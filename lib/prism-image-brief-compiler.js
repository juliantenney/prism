/**
 * Sprint 70 Slice 5 — Prism image-brief compiler.
 * Deterministic translation: canonical visual jobs → provider-neutral image briefs.
 * Consumes planPrismVisualJobs() output only. Does not crawl pages, resolve anchors,
 * call providers, create assets, or modify rendering.
 *
 * Pipeline:
 *   planPrismVisualJobs(page)
 *     → compilePrismImageBriefs(plannerResult)
 *     → future provider adapter
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      require("./prism-visual-jobs-planner.js"),
      require("./visual-planning-contract.js")
    );
  } else {
    var planner = root.PRISM_VISUAL_JOBS_PLANNER;
    var contract = root.PRISM_VISUAL_PLANNING_CONTRACT;
    root.PRISM_IMAGE_BRIEF_COMPILER = factory(planner, contract);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (plannerMod, contractMod) {
  "use strict";

  if (!plannerMod || typeof plannerMod.planPrismVisualJobs !== "function") {
    throw new Error("prism-image-brief-compiler requires prism-visual-jobs-planner");
  }

  var COMPILER_VERSION = "70.5";
  var SUPPORTED_PLANNER_VERSION = plannerMod.PLANNER_VERSION || "70.4";
  var SUPPORTED_SCHEMA_VERSION =
    (contractMod && contractMod.SUPPORTED_SCHEMA_VERSION) ||
    plannerMod.SUPPORTED_SCHEMA_VERSION ||
    "38.4";

  var REPRESENTATIONS =
    contractMod && Array.isArray(contractMod.REPRESENTATIONS)
      ? contractMod.REPRESENTATIONS.slice()
      : [
          "comparison_framework",
          "classification_matrix",
          "causal_model",
          "evidence_t_chart",
          "number_line_segments",
          "ordered_bar_strip",
          "labelled_contrast_panel",
          "concept_map",
          "causal_chain",
          "process",
          "comparison",
          "hierarchy",
          "decision_framework",
          "diagnostic_pathway",
          "annotated_system"
        ];

  var REPRESENTATION_SET = {};
  REPRESENTATIONS.forEach(function (token) {
    REPRESENTATION_SET[token] = true;
  });

  /**
   * Provider-neutral structural guidance only (information layout, not artistic style).
   * Derived from Sprint 38 representation vocabulary — not Design Page authored text.
   */
  var REPRESENTATION_TEMPLATES = {
    comparison_framework: {
      structural_guidance: [
        "Organise two or more constructs on named comparison dimensions",
        "Keep dimensions consistent across constructs",
        "Leave evaluative verdict open for the learner",
        "Avoid decorative elements that obscure distinctions"
      ]
    },
    classification_matrix: {
      structural_guidance: [
        "Organise items into clear labelled categories",
        "Show comparison dimensions consistently across the grid",
        "Preserve readable hierarchy of category headers and cells",
        "Avoid decorative elements that obscure distinctions"
      ]
    },
    causal_model: {
      structural_guidance: [
        "Show directed causal or mechanism relationships",
        "Label nodes and links with source-supported terms only",
        "Preserve directionality without implying unsupported certainty",
        "Avoid decorative arrows that invent causality"
      ]
    },
    evidence_t_chart: {
      structural_guidance: [
        "Separate evidence columns or sides clearly",
        "Keep claim versus evidence roles distinct",
        "Preserve parallel structure across sides",
        "Avoid filling in learner adjudication"
      ]
    },
    number_line_segments: {
      structural_guidance: [
        "Use a single shared axis with consistent units",
        "Depict intervals or segments from source-supported endpoints only",
        "Label segments without stating interpretive verdicts",
        "Avoid decorative scale marks that invent precision"
      ]
    },
    ordered_bar_strip: {
      structural_guidance: [
        "Order bars according to the educational comparison",
        "Keep bar lengths comparable on a shared scale",
        "Label categories clearly",
        "Avoid decorative styling that obscures magnitude relations"
      ]
    },
    labelled_contrast_panel: {
      structural_guidance: [
        "Present a small number of constructs in clear side-by-side panels",
        "Name each construct and at least one contrast dimension",
        "Keep panel structure parallel",
        "Avoid decorative collage that weakens contrast"
      ]
    },
    concept_map: {
      structural_guidance: [
        "Show relationships among concepts as labelled links",
        "Preserve hierarchy or network structure without inventing nodes",
        "Keep link labels concise and source-supported",
        "Avoid decorative connectors that invent relationships"
      ]
    },
    causal_chain: {
      structural_guidance: [
        "Order steps in a clear causal sequence",
        "Show direction of progression",
        "Label each stage with source-supported terms",
        "Avoid implying missing intermediate causes"
      ]
    },
    process: {
      structural_guidance: [
        "Show ordered process stages",
        "Indicate progression clearly",
        "Distinguish stages without decorative clutter",
        "Avoid inventing steps not supported by evidence"
      ]
    },
    comparison: {
      structural_guidance: [
        "Place compared items in a parallel layout",
        "Name comparison dimensions",
        "Preserve readable contrast",
        "Avoid decorative elements that obscure differences"
      ]
    },
    hierarchy: {
      structural_guidance: [
        "Show parent–child or layered structure clearly",
        "Preserve level distinctions",
        "Label levels with source-supported terms",
        "Avoid decorative nesting that invents levels"
      ]
    },
    decision_framework: {
      structural_guidance: [
        "Show decision points and branching criteria",
        "Keep criteria labels source-supported",
        "Preserve readable pathway structure",
        "Avoid revealing the learner’s final choice"
      ]
    },
    diagnostic_pathway: {
      structural_guidance: [
        "Show diagnostic steps or checkpoints in order",
        "Distinguish observations from conclusions",
        "Keep pathway direction clear",
        "Avoid disclosing the diagnostic answer key"
      ]
    },
    annotated_system: {
      structural_guidance: [
        "Depict the system structure with clear labels",
        "Annotate only source-supported parts",
        "Preserve spatial or functional relationships",
        "Avoid decorative labels that invent components"
      ]
    }
  };

  var SPOILER_SOURCE_KINDS = {
    feedback: true,
    answer: true,
    model_answer: true,
    classification_key: true
  };

  var REQUIRED_JOB_FIELDS = [
    "job_id",
    "affordance_id",
    "schema_version",
    "scope",
    "visual_slot",
    "purpose",
    "preferred_representation",
    "subject",
    "context",
    "resolved_sources"
  ];

  function isPlainObject(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  function deepClone(value) {
    if (value == null) return value;
    return JSON.parse(JSON.stringify(value));
  }

  function isNonEmptyString(value) {
    return typeof value === "string" && String(value).trim().length > 0;
  }

  function makeIssue(code, message, details) {
    var issue = { code: code, message: message, severity: "error" };
    if (details && typeof details === "object") {
      Object.keys(details).forEach(function (key) {
        issue[key] = details[key];
      });
    }
    if (!issue.severity) issue.severity = "error";
    return issue;
  }

  function makeWarning(code, message, details) {
    var issue = makeIssue(code, message, details);
    issue.severity = "warning";
    return issue;
  }

  function issueSortKey(issue) {
    var index =
      typeof issue.index === "number" ? String(issue.index).padStart(6, "0") : "999999";
    return [
      String(issue.job_id || ""),
      index,
      issue.code || "",
      issue.message || ""
    ].join("\u0001");
  }

  function sortIssues(list) {
    return list.slice().sort(function (a, b) {
      return issueSortKey(a).localeCompare(issueSortKey(b));
    });
  }

  function emptyDiagnostics() {
    return {
      jobs_received: 0,
      briefs_created: 0,
      briefs_failed: 0,
      activity_scoped: 0,
      page_scoped: 0,
      representations_used: [],
      spoiler_conflicts: 0,
      missing_required_fields: 0,
      duplicate_brief_ids: 0,
      legacy_path_applicable: false,
      partial_compilation: false,
      planner_errors_retained: 0
    };
  }

  function briefIdFromJobId(jobId) {
    var id = String(jobId || "").trim();
    if (id.indexOf("vj-") === 0) return "vb-" + id.slice(3);
    return "vb-" + id;
  }

  function asStringArray(value) {
    if (!Array.isArray(value)) return [];
    return value.map(function (item) {
      return deepClone(item);
    });
  }

  function compileSourceEvidence(resolvedSources) {
    var list = Array.isArray(resolvedSources) ? resolvedSources : [];
    return list.map(function (src) {
      var entry = {
        anchor: deepClone(src.anchor),
        source_type: deepClone(src.source_type),
        source_kind: deepClone(src.source_kind),
        scope: deepClone(src.scope),
        field: deepClone(src.field),
        content: deepClone(src.content),
        content_structured: deepClone(src.content_structured),
        content_text: deepClone(src.content_text),
        content_type: deepClone(src.content_type)
      };
      if (isNonEmptyString(src.activity_id)) entry.activity_id = String(src.activity_id).trim();
      if (isNonEmptyString(src.material_key)) entry.material_key = String(src.material_key).trim();
      return entry;
    });
  }

  function compileContentRequirements(job) {
    var authored = asStringArray(job.must_show);
    var derived = [];
    if (isNonEmptyString(job.pedagogical_added_value)) {
      derived.push({
        kind: "pedagogical_added_value",
        text: String(job.pedagogical_added_value)
      });
    }
    if (isNonEmptyString(job.reasoning_supported)) {
      derived.push({
        kind: "reasoning_supported",
        text: String(job.reasoning_supported)
      });
    }
    return { authored: authored, derived: derived };
  }

  function compileExclusionRequirements(job) {
    return {
      authored_must_not_show: asStringArray(job.must_not_show),
      authored_disallowed_claims: asStringArray(job.disallowed_claims),
      authored_representation_avoid: asStringArray(job.representation_avoid),
      spoiler: {
        anti_spoiler: job.anti_spoiler === true,
        boundary: deepClone(job.spoiler_boundary || null)
      },
      discipline_note: isNonEmptyString(job.canonical_discipline_note)
        ? String(job.canonical_discipline_note)
        : null
    };
  }

  function formatList(lines, indent) {
    var prefix = indent || "- ";
    if (!lines || !lines.length) return prefix + "(none)";
    return lines
      .map(function (line) {
        return prefix + String(line);
      })
      .join("\n");
  }

  function formatEvidenceBasis(sourceEvidence) {
    if (!sourceEvidence.length) return "- (none)";
    return sourceEvidence
      .map(function (src) {
        var label = [
          src.anchor || "(unknown anchor)",
          src.source_kind || src.source_type || "source"
        ].join(" | ");
        var text =
          typeof src.content_text === "string"
            ? src.content_text
            : typeof src.content === "string"
              ? src.content
              : "";
        var clipped = String(text).replace(/\s+/g, " ").trim();
        if (clipped.length > 240) clipped = clipped.slice(0, 237) + "...";
        return "- [" + label + "] " + (clipped || "(structured content)");
      })
      .join("\n");
  }

  function formatSpoilerSection(job) {
    var lines = [];
    lines.push("- anti_spoiler: " + (job.anti_spoiler === true ? "true" : "false"));
    if (job.spoiler_boundary && typeof job.spoiler_boundary === "object") {
      Object.keys(job.spoiler_boundary)
        .sort()
        .forEach(function (key) {
          lines.push("- boundary." + key + ": " + String(job.spoiler_boundary[key]));
        });
    } else {
      lines.push("- boundary: (none)");
    }
    if (isNonEmptyString(job.learner_stage)) {
      lines.push("- learner_stage: " + String(job.learner_stage));
    }
    return lines.join("\n");
  }

  function buildGenerationInstruction(briefCore, job, template, sourceEvidence) {
    var sections = [];
    sections.push(
      "1. Educational objective\n" +
        "- purpose: " +
        String(job.purpose || "") +
        (isNonEmptyString(job.pedagogical_added_value)
          ? "\n- pedagogical_added_value: " + String(job.pedagogical_added_value)
          : "") +
        (isNonEmptyString(job.reasoning_supported)
          ? "\n- reasoning_supported: " + String(job.reasoning_supported)
          : "")
    );
    sections.push(
      "2. Representation\n" +
        "- preferred_representation: " +
        String(job.preferred_representation || "") +
        "\n" +
        formatList(template.structural_guidance || [])
    );
    sections.push("3. Subject\n- " + String(job.subject || ""));
    sections.push("4. Context\n- " + String(job.context || ""));
    sections.push("5. Evidence basis\n" + formatEvidenceBasis(sourceEvidence));
    sections.push(
      "6. Required content\n" +
        formatList(asStringArray(job.must_show).map(String))
    );
    sections.push(
      "7. Excluded content\n" +
        formatList(asStringArray(job.must_not_show).map(String)) +
        (asStringArray(job.representation_avoid).length
          ? "\n- representation_avoid:\n" +
            formatList(
              asStringArray(job.representation_avoid).map(String),
              "  - "
            )
          : "")
    );
    sections.push(
      "8. Claim boundaries\n" +
        "- allowed_claims:\n" +
        formatList(asStringArray(job.allowed_claims).map(String), "  - ") +
        "\n- disallowed_claims:\n" +
        formatList(asStringArray(job.disallowed_claims).map(String), "  - ")
    );
    sections.push("9. Spoiler boundary\n" + formatSpoilerSection(job));
    sections.push(
      "10. Discipline guidance\n" +
        "- discipline_risk_level: " +
        (job.discipline_risk_level != null ? String(job.discipline_risk_level) : "(none)") +
        "\n- canonical_discipline_note: " +
        (isNonEmptyString(job.canonical_discipline_note)
          ? String(job.canonical_discipline_note)
          : "(none)")
    );
    sections.push(
      "11. Caption guidance\n- " +
        (isNonEmptyString(job.caption_intent) ? String(job.caption_intent) : "(none)")
    );
    sections.push(
      "12. Learner-facing figure copy (authored with this brief; do not invent style/camera language)\n" +
        "- alt_text: " +
        (isNonEmptyString(job.alt_text) ? String(job.alt_text) : "(none — author concise alt ≤140 chars)") +
        "\n- detailed_description: " +
        (isNonEmptyString(job.detailed_description)
          ? String(job.detailed_description)
          : "(none — author textbook-style instructional description from the same must_show/context)") +
        "\n- Note: generation_instruction above is the image prompt only; learner HTML uses alt_text + detailed_description, not this prompt."
    );
    return sections.join("\n\n");
  }

  function detectSpoilerConflict(job, sourceEvidence) {
    if (job.anti_spoiler !== true) return null;
    var offending = [];
    sourceEvidence.forEach(function (src) {
      var kind = String(src.source_kind || "").trim();
      if (SPOILER_SOURCE_KINDS[kind]) offending.push(kind + "@" + (src.anchor || ""));
    });
    if (!offending.length) return null;
    return offending;
  }

  function validateJobEnvelope(job, index) {
    var missing = [];
    if (!isPlainObject(job)) {
      return { ok: false, missing: ["job_object"], message: "job must be an object" };
    }
    REQUIRED_JOB_FIELDS.forEach(function (field) {
      if (field === "resolved_sources") {
        if (!Array.isArray(job.resolved_sources)) missing.push(field);
        return;
      }
      if (job[field] == null || (typeof job[field] === "string" && !String(job[field]).trim())) {
        missing.push(field);
      }
    });
    if (missing.length) {
      return {
        ok: false,
        missing: missing,
        message: "job missing required fields: " + missing.join(", ")
      };
    }
    if (!Array.isArray(job.resolved_sources) || !job.resolved_sources.length) {
      return {
        ok: false,
        missing: ["resolved_sources"],
        message: "resolved_sources must be a non-empty array"
      };
    }
    return { ok: true, missing: [] };
  }

  function compileOneBrief(job, index, meta, errors, warnings, diagnostics) {
    var jobId = isPlainObject(job) ? String(job.job_id || "").trim() : "";
    var affordanceId = isPlainObject(job) ? String(job.affordance_id || "").trim() : "";
    var envelope = validateJobEnvelope(job, index);
    if (!envelope.ok) {
      diagnostics.briefs_failed += 1;
      diagnostics.missing_required_fields += 1;
      errors.push(
        makeIssue(
          envelope.missing.indexOf("resolved_sources") !== -1 &&
            envelope.missing.length === 1
            ? "PIC_RESOLVED_SOURCES_REQUIRED"
            : envelope.missing.indexOf("job_id") !== -1
              ? "PIC_JOB_ID_REQUIRED"
              : "PIC_JOB_FIELDS_REQUIRED",
          "jobs[" + index + "]: " + envelope.message,
          {
            index: index,
            job_id: jobId || null,
            affordance_id: affordanceId || null,
            field: envelope.missing[0] || null
          }
        )
      );
      return null;
    }

    var representation = String(job.preferred_representation || "").trim();
    if (!REPRESENTATION_SET[representation]) {
      diagnostics.briefs_failed += 1;
      errors.push(
        makeIssue(
          "PIC_REPRESENTATION_UNSUPPORTED",
          "jobs[" + index + "]: unsupported preferred_representation '" + representation + "'",
          {
            index: index,
            job_id: jobId,
            affordance_id: affordanceId,
            field: "preferred_representation"
          }
        )
      );
      return null;
    }

    var template = REPRESENTATION_TEMPLATES[representation];
    if (!template) {
      diagnostics.briefs_failed += 1;
      errors.push(
        makeIssue(
          "PIC_REPRESENTATION_UNSUPPORTED",
          "jobs[" + index + "]: no structural template for '" + representation + "'",
          {
            index: index,
            job_id: jobId,
            affordance_id: affordanceId,
            field: "preferred_representation"
          }
        )
      );
      return null;
    }

    if (job.anti_spoiler === true && (job.spoiler_boundary == null || typeof job.spoiler_boundary !== "object")) {
      warnings.push(
        makeWarning(
          "PIC_SPOILER_BOUNDARY_MISSING",
          "jobs[" + index + "]: anti_spoiler is true but spoiler_boundary is missing",
          { index: index, job_id: jobId, affordance_id: affordanceId, field: "spoiler_boundary" }
        )
      );
    }

    var sourceEvidence = compileSourceEvidence(job.resolved_sources);
    var spoilerOffenders = detectSpoilerConflict(job, sourceEvidence);
    if (spoilerOffenders) {
      diagnostics.briefs_failed += 1;
      diagnostics.spoiler_conflicts += 1;
      errors.push(
        makeIssue(
          "PIC_SPOILER_CONFLICT",
          "jobs[" +
            index +
            "]: anti_spoiler job references prohibited source kinds: " +
            spoilerOffenders.join(", "),
          {
            index: index,
            job_id: jobId,
            affordance_id: affordanceId,
            field: "resolved_sources"
          }
        )
      );
      return null;
    }

    var contentRequirements = compileContentRequirements(job);
    var exclusionRequirements = compileExclusionRequirements(job);
    var claimConstraints = {
      allowed: asStringArray(job.allowed_claims),
      disallowed: asStringArray(job.disallowed_claims)
    };
    var spoilerConstraints = {
      anti_spoiler: job.anti_spoiler === true,
      boundary: deepClone(job.spoiler_boundary || null),
      learner_stage: deepClone(job.learner_stage),
      source_kinds_used: sourceEvidence
        .map(function (s) {
          return String(s.source_kind || "");
        })
        .filter(Boolean)
    };
    // Stable unique source kinds
    var kindSeen = {};
    spoilerConstraints.source_kinds_used = spoilerConstraints.source_kinds_used.filter(function (k) {
      if (kindSeen[k]) return false;
      kindSeen[k] = true;
      return true;
    });

    var brief = {
      brief_id: briefIdFromJobId(jobId),
      job_id: jobId,
      affordance_id: affordanceId,
      schema_version: String(job.schema_version || meta.schema_version),
      planner_version: String(meta.planner_version),
      compiler_version: COMPILER_VERSION,
      scope: deepClone(job.scope),
      visual_slot: deepClone(job.visual_slot),
      purpose: deepClone(job.purpose),
      preferred_representation: deepClone(job.preferred_representation),
      subject: deepClone(job.subject),
      context: deepClone(job.context),
      source_evidence: sourceEvidence,
      composition: {
        representation: representation,
        primary_subject: deepClone(job.subject),
        educational_function: deepClone(job.purpose),
        learner_stage: deepClone(job.learner_stage),
        structural_guidance: deepClone(template.structural_guidance)
      },
      content_requirements: contentRequirements,
      exclusion_requirements: exclusionRequirements,
      claim_constraints: claimConstraints,
      spoiler_constraints: spoilerConstraints,
      representation_constraints: {
        preferred: deepClone(job.preferred_representation),
        avoid: asStringArray(job.representation_avoid),
        structural_guidance: deepClone(template.structural_guidance)
      },
      caption_guidance: deepClone(job.caption_intent),
      alt_text: deepClone(job.alt_text),
      detailed_description: deepClone(job.detailed_description),
      discipline_guidance: {
        risk_level: deepClone(job.discipline_risk_level),
        canonical_note: deepClone(job.canonical_discipline_note)
      },
      pedagogical_metadata: {
        pedagogical_added_value: deepClone(job.pedagogical_added_value),
        rationale: deepClone(job.rationale),
        reasoning_supported: deepClone(job.reasoning_supported),
        tier: deepClone(job.tier)
      },
      provenance: deepClone(job.provenance || {}),
      authored_passthrough: deepClone(job.authored_passthrough || {})
    };

    if (job.scope === "activity" && isNonEmptyString(job.activity_id)) {
      brief.activity_id = String(job.activity_id).trim();
    }
    if (job.scope === "page" && isNonEmptyString(job.region)) {
      brief.region = String(job.region).trim();
    }

    try {
      brief.generation_instruction = buildGenerationInstruction(
        brief,
        job,
        template,
        sourceEvidence
      );
    } catch (err) {
      diagnostics.briefs_failed += 1;
      errors.push(
        makeIssue(
          "PIC_GENERATION_INSTRUCTION_FAILED",
          "jobs[" + index + "]: failed to compile generation_instruction",
          { index: index, job_id: jobId, affordance_id: affordanceId }
        )
      );
      return null;
    }

    if (job.scope === "page") diagnostics.page_scoped += 1;
    if (job.scope === "activity") diagnostics.activity_scoped += 1;
    diagnostics.briefs_created += 1;
    return brief;
  }

  function compilePrismImageBriefs(plannerResult) {
    if (plannerResult == null) {
      throw new TypeError("compilePrismImageBriefs(plannerResult) requires a planner result object");
    }
    if (!isPlainObject(plannerResult)) {
      throw new TypeError("compilePrismImageBriefs(plannerResult) requires a plain object");
    }

    var diagnostics = emptyDiagnostics();
    var errors = [];
    var warnings = [];

    // Legacy path
    if (plannerResult.authoritative_planning_present === false) {
      diagnostics.legacy_path_applicable = true;
      return {
        valid: true,
        compiler_version: COMPILER_VERSION,
        planner_version: plannerResult.planner_version || null,
        schema_version: plannerResult.schema_version || null,
        authoritative_planning_present: false,
        briefs: [],
        errors: [],
        warnings: [],
        diagnostics: diagnostics
      };
    }

    if (plannerResult.authoritative_planning_present !== true) {
      errors.push(
        makeIssue(
          "PIC_INPUT_REQUIRED",
          "planner result must declare authoritative_planning_present",
          { field: "authoritative_planning_present" }
        )
      );
      return {
        valid: false,
        compiler_version: COMPILER_VERSION,
        planner_version: plannerResult.planner_version || null,
        schema_version: plannerResult.schema_version || null,
        authoritative_planning_present: false,
        briefs: [],
        errors: sortIssues(errors),
        warnings: [],
        diagnostics: diagnostics
      };
    }

    var plannerVersion = String(plannerResult.planner_version || "").trim();
    if (plannerVersion !== SUPPORTED_PLANNER_VERSION) {
      errors.push(
        makeIssue(
          "PIC_PLANNER_VERSION_UNSUPPORTED",
          "unsupported planner_version '" +
            plannerVersion +
            "' (supported: " +
            SUPPORTED_PLANNER_VERSION +
            ")",
          { field: "planner_version" }
        )
      );
      return {
        valid: false,
        compiler_version: COMPILER_VERSION,
        planner_version: plannerVersion || null,
        schema_version: plannerResult.schema_version || null,
        authoritative_planning_present: true,
        briefs: [],
        errors: sortIssues(errors),
        warnings: [],
        diagnostics: diagnostics
      };
    }

    var schemaVersion = String(plannerResult.schema_version || "").trim();
    if (schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
      errors.push(
        makeIssue(
          "PIC_SCHEMA_VERSION_UNSUPPORTED",
          "unsupported schema_version '" +
            schemaVersion +
            "' (supported: " +
            SUPPORTED_SCHEMA_VERSION +
            ")",
          { field: "schema_version" }
        )
      );
      return {
        valid: false,
        compiler_version: COMPILER_VERSION,
        planner_version: plannerVersion,
        schema_version: schemaVersion || null,
        authoritative_planning_present: true,
        briefs: [],
        errors: sortIssues(errors),
        warnings: [],
        diagnostics: diagnostics
      };
    }

    if (plannerResult.valid !== true) {
      diagnostics.planner_errors_retained = Array.isArray(plannerResult.errors)
        ? plannerResult.errors.length
        : 0;
      (plannerResult.errors || []).forEach(function (err) {
        errors.push(
          makeIssue(
            err.code || "PIC_PLANNER_RESULT_INVALID",
            err.message || "planner result invalid",
            {
              job_id: err.job_id,
              affordance_id: err.affordance_id,
              index: err.index,
              field: err.field || err.path
            }
          )
        );
      });
      if (!errors.length) {
        errors.push(
          makeIssue("PIC_PLANNER_RESULT_INVALID", "planner result valid=false", {
            field: "valid"
          })
        );
      }
      return {
        valid: false,
        compiler_version: COMPILER_VERSION,
        planner_version: plannerVersion,
        schema_version: schemaVersion,
        authoritative_planning_present: true,
        briefs: [],
        errors: sortIssues(errors),
        warnings: [],
        diagnostics: diagnostics
      };
    }

    if (!Array.isArray(plannerResult.jobs)) {
      errors.push(
        makeIssue("PIC_JOBS_REQUIRED", "planner result jobs must be an array", {
          field: "jobs"
        })
      );
      return {
        valid: false,
        compiler_version: COMPILER_VERSION,
        planner_version: plannerVersion,
        schema_version: schemaVersion,
        authoritative_planning_present: true,
        briefs: [],
        errors: sortIssues(errors),
        warnings: [],
        diagnostics: diagnostics
      };
    }

    diagnostics.jobs_received = plannerResult.jobs.length;
    var meta = {
      planner_version: plannerVersion,
      schema_version: schemaVersion
    };
    var briefs = [];
    var seenBriefIds = {};
    var representationsUsed = [];

    plannerResult.jobs.forEach(function (job, index) {
      var brief = compileOneBrief(job, index, meta, errors, warnings, diagnostics);
      if (!brief) return;
      if (seenBriefIds[brief.brief_id]) {
        diagnostics.briefs_failed += 1;
        diagnostics.duplicate_brief_ids += 1;
        diagnostics.briefs_created -= 1;
        errors.push(
          makeIssue(
            "PIC_DUPLICATE_BRIEF_ID",
            "jobs[" + index + "]: duplicate derived brief_id " + brief.brief_id,
            {
              index: index,
              job_id: brief.job_id,
              affordance_id: brief.affordance_id,
              field: "brief_id"
            }
          )
        );
        return;
      }
      seenBriefIds[brief.brief_id] = true;
      briefs.push(brief);
      if (representationsUsed.indexOf(brief.preferred_representation) === -1) {
        representationsUsed.push(brief.preferred_representation);
      }
    });

    diagnostics.representations_used = representationsUsed.slice().sort();
    diagnostics.partial_compilation = briefs.length > 0 && diagnostics.briefs_failed > 0;

    errors = sortIssues(errors);
    warnings = sortIssues(warnings);

    return {
      valid: errors.length === 0,
      compiler_version: COMPILER_VERSION,
      planner_version: plannerVersion,
      schema_version: schemaVersion,
      authoritative_planning_present: true,
      briefs: briefs,
      errors: errors,
      warnings: warnings,
      diagnostics: diagnostics
    };
  }

  return {
    COMPILER_VERSION: COMPILER_VERSION,
    SUPPORTED_PLANNER_VERSION: SUPPORTED_PLANNER_VERSION,
    SUPPORTED_SCHEMA_VERSION: SUPPORTED_SCHEMA_VERSION,
    REPRESENTATIONS: REPRESENTATIONS.slice(),
    REPRESENTATION_TEMPLATES: deepClone(REPRESENTATION_TEMPLATES),
    compilePrismImageBriefs: compilePrismImageBriefs,
    briefIdFromJobId: briefIdFromJobId,
    /** Read-only access to planner module. */
    planner: plannerMod
  };
});

/**
 * Sprint 56F Phase 2 — Episode Plan page shell creation (vNext schema 2.0.0).
 * Produces a non-mutating page artefact shell for progressive enrichment.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "object" || !module.exports) {
    if (typeof root !== "undefined") {
      root.PRISM_PAGE_SHELL_CREATE = api;
    }
    return;
  }
  module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var SCHEMA_VERSION = "2.0.0";
  var SHELL_CREATE_VERSION = "56F-EP-SHELL-2";
  var SHELL_DLA_PLACEHOLDER = "\u2014";

  function resolveEpisodePlanV1Validation() {
    try {
      if (typeof require === "function") {
        return require("./episode-plan-v1-validation.js");
      }
    } catch (_) {}
    var root =
      typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
          ? window
          : null;
    return root && root.PRISM_EPISODE_PLAN_V1_VALIDATION
      ? root.PRISM_EPISODE_PLAN_V1_VALIDATION
      : null;
  }

  var REQUIRED_TOP_LEVEL = [
    "artifact_type",
    "schema_version",
    "title",
    "audience",
    "page_profile",
    "assembly_state",
    "page_synthesis",
    "activities",
    "learning_outcomes",
    "source_artefacts",
    "generation_notes"
  ];

  var DLA_COGNITION_FIELDS = [
    "study_orientation",
    "intellectual_frame",
    "intellectual_coherence_bridge",
    "reasoning_orientation",
    "self_explanation_prompt",
    "evidence_use_prompt",
    "argument_structure_hint",
    "conceptual_contrast_prompt",
    "disciplinary_lens",
    "transfer_or_application_task",
    "scaffold_hint_sequence",
    "uncertainty_tension_prompt",
    "prior_knowledge_activation",
    "misconception_claim",
    "reconciliation_prompt",
    "evidence_contrast",
    "reasoning_revision_prompt",
    "initial_position_prompt",
    "revision_trigger",
    "transformation_activity",
    "source_to_application_prompt",
    "duration_minutes",
    "grouping",
    "support_note",
    "purpose"
  ];

  var VALIDATION_REPORT_KEYS = [
    "activity_coverage",
    "material_coverage",
    "episode_plan_attachment",
    "self_containment",
    "schema_compliance",
    "known_issues"
  ];

  function deepClone(value) {
    if (value == null || typeof value !== "object") return value;
    if (Array.isArray(value)) return value.map(deepClone);
    var out = {};
    Object.keys(value).forEach(function (key) {
      out[key] = deepClone(value[key]);
    });
    return out;
  }

  function nonEmptyString(value, fallback) {
    var text = String(value == null ? "" : value).trim();
    return text || fallback;
  }

  function isPageEnrichmentV2Enabled(workflow) {
    if (!workflow || typeof workflow !== "object" || Array.isArray(workflow)) return false;
    if (workflow.pageEnrichmentV2 === true) return true;
    if (
      workflow.workflowOutputSpec &&
      workflow.workflowOutputSpec.pageEnrichmentV2 === true
    ) {
      return true;
    }
    return false;
  }

  function normalizeEpisodePlansInput(input) {
    if (!input) return null;
    if (Array.isArray(input)) {
      return input.length ? { episode_plans: deepClone(input) } : null;
    }
    if (typeof input !== "object") return null;
    if (Array.isArray(input.episode_plans) && input.episode_plans.length) {
      return { episode_plans: deepClone(input.episode_plans) };
    }
    return null;
  }

  function learningOutcomesIndex(learningOutcomesInput) {
    var map = {};
    var rows = [];
    if (!learningOutcomesInput) return map;
    if (Array.isArray(learningOutcomesInput)) {
      rows = learningOutcomesInput;
    } else if (
      learningOutcomesInput &&
      typeof learningOutcomesInput === "object" &&
      Array.isArray(learningOutcomesInput.learning_outcomes)
    ) {
      rows = learningOutcomesInput.learning_outcomes;
    }
    rows.forEach(function (row, index) {
      if (!row) return;
      if (typeof row === "string") {
        map["LO" + (index + 1)] = { outcome_id: "LO" + (index + 1), statement: row };
        return;
      }
      if (typeof row !== "object") return;
      var id = nonEmptyString(row.id || row.outcome_id, "LO" + (index + 1));
      map[id] = row;
    });
    return map;
  }

  function normalizeLearningOutcomesForShell(learningOutcomesInput) {
    var rows = [];
    if (!learningOutcomesInput) return rows;
    if (Array.isArray(learningOutcomesInput)) {
      rows = learningOutcomesInput;
    } else if (
      learningOutcomesInput &&
      typeof learningOutcomesInput === "object" &&
      Array.isArray(learningOutcomesInput.learning_outcomes)
    ) {
      rows = learningOutcomesInput.learning_outcomes;
    }
    return rows
      .map(function (row, index) {
        if (typeof row === "string") {
          var statement = String(row).trim();
          if (!statement) return null;
          return { outcome_id: "LO" + (index + 1), statement: statement };
        }
        if (!row || typeof row !== "object" || Array.isArray(row)) return null;
        var outcomeId = nonEmptyString(row.id || row.outcome_id, "LO" + (index + 1));
        var text = nonEmptyString(row.statement || row.text || row.description, "");
        if (!text) return null;
        var out = { outcome_id: outcomeId, statement: text };
        if (row.category) out.category = String(row.category).trim();
        return out;
      })
      .filter(Boolean);
  }

  function resolveProfileFields(options) {
    var opts = options && typeof options === "object" ? options : {};
    var pageProfile = null;
    if (opts.page_profile != null) {
      if (typeof opts.page_profile === "string") {
        pageProfile = { profile_type: nonEmptyString(opts.page_profile, "learner") };
      } else if (typeof opts.page_profile === "object" && !Array.isArray(opts.page_profile)) {
        pageProfile = deepClone(opts.page_profile);
      }
    }
    if (!pageProfile) {
      pageProfile = {
        profile_type: nonEmptyString(opts.profile_type || opts.page_profile_type, "learner")
      };
    }
    if (!nonEmptyString(pageProfile.profile_type, "")) {
      pageProfile.profile_type = "learner";
    }
    return {
      title: nonEmptyString(opts.title || opts.pageTitle, "Learning page"),
      audience: nonEmptyString(opts.audience || opts.learner_audience, "Learners"),
      page_profile: pageProfile
    };
  }

  function buildSourceArtefactsForShell() {
    return [
      {
        artefact_type: "learning_outcomes",
        source_label: "Learning Outcomes",
        role: "structural"
      }
    ];
  }

  function buildCanonicalShellShapeSnippet() {
    return [
      "Canonical shape examples (required — do not substitute strings for objects):",
      "",
      '"title": "Learner-facing page title",',
      '"audience": "Learners",',
      '"page_profile": { "profile_type": "learner" }',
      '"learning_outcomes": [',
      "  {",
      '    "id": "LO1",',
      '    "statement": "Outcome statement from upstream learning_outcomes"',
      "  }",
      "],",
      '"episode_plans": [',
      "  {",
      '    "activity_id": "A1",',
      '    "mapped_learning_outcome_ids": ["LO1"],',
      '    "episode_plan": { "archetype": "understand", "beats": [{ "function": "orientation" }] }',
      "  }",
      "],",
      '"source_artefacts": [',
      "  {",
      '    "artefact_type": "learning_outcomes",',
      '    "source_label": "Learning Outcomes",',
      '    "role": "structural"',
      "  }",
      "],",
      '"generation_notes": {',
      '  "validation": {',
      '    "coverage_mode": "activity_aligned",',
      '    "known_issues": []',
      "  }",
      "},",
      '"activities": [',
      "  {",
      '    "activity_id": "A1",',
      '    "title": "Activity title from LO",',
      '    "learner_task": "\u2014",',
      '    "expected_output": "\u2014",',
      '    "activity_preamble": "\u2014",',
      '    "required_materials": [],',
      '    "materials": [],',
      '    "episode_plan": { "archetype": "understand", "beats": [{ "function": "orientation" }] }',
      "  }",
      "]",
      "",
      "Required: every episode_plans[] row must include activity_id matching an activities[].activity_id (same A1, A2, … ids).",
      "",
      "Forbidden at shell stage:",
      '- page_profile: "learner" (string)',
      '- source_artefacts: ["learning_outcomes"] (string array)',
      '- omit required top-level keys title/audience/learning_outcomes/generation_notes.validation',
      '- episode_plans[] rows without activity_id',
      '- learner_task / expected_output / activity_preamble: "" (empty string)',
      '- sections[]'
    ].join("\n");
  }

  /**
   * Recover missing episode_plans[].activity_id from parallel activities[] (common Copilot omission).
   * Mutates page in place when a safe 1:1 or id-aligned fix is available.
   * @returns {boolean} whether any activity_id was written
   */
  function alignEpisodePlansActivityIds(page) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return false;
    var plans = page.episode_plans;
    var activities = page.activities;
    if (!Array.isArray(plans) || !plans.length) return false;
    if (!Array.isArray(activities) || !activities.length) return false;
    var changed = false;
    var activityIds = activities.map(function (row) {
      return row && hasNonEmptyString(row.activity_id) ? String(row.activity_id).trim() : "";
    });
    plans.forEach(function (planRow, index) {
      if (!planRow || typeof planRow !== "object" || Array.isArray(planRow)) return;
      if (hasNonEmptyString(planRow.activity_id)) return;
      var fromActivity = activityIds[index] || "";
      if (fromActivity) {
        planRow.activity_id = fromActivity;
        changed = true;
        return;
      }
      // Fallback A1..An when activities row also lacks id but array lengths match
      if (plans.length === activities.length) {
        planRow.activity_id = "A" + (index + 1);
        changed = true;
        if (activities[index] && typeof activities[index] === "object" && !hasNonEmptyString(activities[index].activity_id)) {
          activities[index].activity_id = planRow.activity_id;
        }
      }
    });
    return changed;
  }

  function activityTitleFromPlanRow(row, index, loIndex) {
    var activityId = nonEmptyString(row && row.activity_id, "A" + (index + 1));
    var mapped = Array.isArray(row && row.mapped_learning_outcome_ids)
      ? row.mapped_learning_outcome_ids
      : [];
    var i;
    for (i = 0; i < mapped.length; i += 1) {
      var lo = loIndex[mapped[i]];
      if (!lo) continue;
      var statement = nonEmptyString(lo.statement || lo.text || lo.description, "");
      if (statement) {
        return statement.length > 120 ? statement.slice(0, 117) + "..." : statement;
      }
    }
    return "Activity " + activityId;
  }

  function cloneEpisodePlanRow(row) {
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    var out = {
      activity_id: nonEmptyString(row.activity_id, ""),
      episode_plan: deepClone(row.episode_plan)
    };
    if (Array.isArray(row.mapped_learning_outcome_ids) && row.mapped_learning_outcome_ids.length) {
      out.mapped_learning_outcome_ids = row.mapped_learning_outcome_ids.slice();
    }
    if (row.episode_plan_id) {
      out.episode_plan_id = String(row.episode_plan_id).trim();
    }
    return out;
  }

  function buildActivityShell(row, index, loIndex) {
    var activityId = nonEmptyString(row.activity_id, "A" + (index + 1));
    var shell = {
      activity_id: activityId,
      title: activityTitleFromPlanRow(row, index, loIndex),
      learner_task: SHELL_DLA_PLACEHOLDER,
      expected_output: SHELL_DLA_PLACEHOLDER,
      activity_preamble: SHELL_DLA_PLACEHOLDER,
      required_materials: [],
      materials: []
    };
    if (row.episode_plan && typeof row.episode_plan === "object") {
      shell.episode_plan = deepClone(row.episode_plan);
    }
    if (Array.isArray(row.mapped_learning_outcome_ids) && row.mapped_learning_outcome_ids.length) {
      shell.learning_outcome_ids = row.mapped_learning_outcome_ids.slice();
    }
    return shell;
  }

  function buildShellValidationReport(activityCount) {
    return {
      activity_coverage: activityCount > 0 ? "shell_only" : "none",
      material_coverage: "pending_gam",
      episode_plan_attachment: "attached",
      self_containment: "shell_only",
      schema_compliance: "episode_plan_boundary",
      known_issues:
        activityCount > 0
          ? ["DLA pedagogy and GAM materials not yet populated"]
          : ["No activities in Episode Plan shell"]
    };
  }

  function createPageShellFromEpisodePlan(episodePlansInput, options) {
    var normalized = normalizeEpisodePlansInput(episodePlansInput);
    if (!normalized || !Array.isArray(normalized.episode_plans) || !normalized.episode_plans.length) {
      throw new Error("createPageShellFromEpisodePlan: episode_plans required");
    }
    var opts = options && typeof options === "object" ? options : {};
    var profile = resolveProfileFields(opts);
    var loIndex = learningOutcomesIndex(opts.learning_outcomes);
    var planRows = normalized.episode_plans;
    var activities = planRows.map(function (row, index) {
      return buildActivityShell(row, index, loIndex);
    });
    var episodePlans = planRows
      .map(cloneEpisodePlanRow)
      .filter(function (row) {
        return row && row.activity_id && row.episode_plan;
      });

    return {
      artifact_type: "page",
      schema_version: SCHEMA_VERSION,
      title: profile.title,
      audience: profile.audience,
      page_profile: profile.page_profile,
      assembly_state: {
        enriched_by: ["episode_plan"],
        current_stage: "episode_plan"
      },
      page_synthesis: {},
      activities: activities,
      learning_outcomes: normalizeLearningOutcomesForShell(opts.learning_outcomes),
      episode_plans: episodePlans,
      source_artefacts: buildSourceArtefactsForShell(),
      generation_notes: {
        validation: buildShellValidationReport(activities.length),
        notes:
          "Sprint 56F Episode Plan page shell (" +
          SHELL_CREATE_VERSION +
          ") — pending DLA, GAM, Learning Sequence, Assessment, and finalise_page enrichment"
      }
    };
  }

  function hasNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function isValidShellPlaceholder(value) {
    return hasNonEmptyString(value);
  }

  function validatePageShellAgainstVNextSchema(shell) {
    var errors = [];
    if (!shell || typeof shell !== "object" || Array.isArray(shell)) {
      return { ok: false, errors: ["shell must be an object"] };
    }

    REQUIRED_TOP_LEVEL.forEach(function (key) {
      if (!(key in shell)) errors.push("missing required top-level key: " + key);
    });

    if (shell.artifact_type !== "page") errors.push('artifact_type must be "page"');
    if (shell.schema_version !== SCHEMA_VERSION) {
      errors.push('schema_version must be "' + SCHEMA_VERSION + '"');
    }
    if (!hasNonEmptyString(shell.title)) errors.push("title must be a non-empty string");
    if (!hasNonEmptyString(shell.audience)) errors.push("audience must be a non-empty string");

    if (typeof shell.page_profile === "string") {
      errors.push('page_profile must be an object { profile_type }, not a string like "' + shell.page_profile + '"');
    } else if (!shell.page_profile || typeof shell.page_profile !== "object" || Array.isArray(shell.page_profile)) {
      errors.push("page_profile must be an object");
    } else if (!hasNonEmptyString(shell.page_profile.profile_type)) {
      errors.push("page_profile.profile_type must be a non-empty string");
    }

    if (!shell.assembly_state || typeof shell.assembly_state !== "object" || Array.isArray(shell.assembly_state)) {
      errors.push("assembly_state must be an object");
    } else if (!Array.isArray(shell.assembly_state.enriched_by) || !shell.assembly_state.enriched_by.length) {
      errors.push("assembly_state.enriched_by must be a non-empty array");
    }

    if (!shell.page_synthesis || typeof shell.page_synthesis !== "object" || Array.isArray(shell.page_synthesis)) {
      errors.push("page_synthesis must be an object");
    }

    if (!Array.isArray(shell.activities) || shell.activities.length < 1) {
      errors.push("activities must contain at least one activity");
    } else {
      shell.activities.forEach(function (activity, index) {
        if (!activity || typeof activity !== "object" || Array.isArray(activity)) {
          errors.push("activities[" + index + "] must be an object");
          return;
        }
        ["activity_id", "title", "learner_task", "expected_output", "activity_preamble"].forEach(function (field) {
          if (!isValidShellPlaceholder(activity[field])) {
            errors.push(
              "activities[" +
                index +
                "]." +
                field +
                ' must be a non-empty string (use em dash \u2014 for shell placeholders until DLA)'
            );
          }
        });
        if (!Array.isArray(activity.required_materials)) {
          errors.push("activities[" + index + "].required_materials must be an array");
        }
        if (!Array.isArray(activity.materials)) {
          errors.push("activities[" + index + "].materials must be an array");
        }
        if (!activity.episode_plan || typeof activity.episode_plan !== "object") {
          errors.push("activities[" + index + "].episode_plan must be present at Episode Plan boundary");
        }
        DLA_COGNITION_FIELDS.forEach(function (field) {
          if (field in activity) {
            errors.push("activities[" + index + "] must not include DLA field " + field + " at shell stage");
          }
        });
      });
    }

    if (!Array.isArray(shell.learning_outcomes)) {
      errors.push("learning_outcomes must be an array");
    }

    if (!Array.isArray(shell.source_artefacts) || !shell.source_artefacts.length) {
      errors.push("source_artefacts must be a non-empty array");
    } else {
      shell.source_artefacts.forEach(function (entry, index) {
        if (typeof entry === "string") {
          errors.push(
            "source_artefacts[" +
              index +
              '] must be a structured object, not a string like "' +
              entry +
              '"'
          );
          return;
        }
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
          errors.push("source_artefacts[" + index + "] must be an object");
          return;
        }
        if (!hasNonEmptyString(entry.artefact_type)) {
          errors.push("source_artefacts[" + index + "].artefact_type required");
        }
        if (!hasNonEmptyString(entry.role)) {
          errors.push("source_artefacts[" + index + "].role required");
        }
        if (!hasNonEmptyString(entry.artefact_id) && !hasNonEmptyString(entry.source_label)) {
          errors.push("source_artefacts[" + index + "] requires artefact_id or source_label");
        }
      });
    }

    if (shell.sections != null) {
      errors.push("sections[] must not be written on vNext page shell");
    }

    if (shell.learning_sequence != null) {
      errors.push("learning_sequence must not be present at Episode Plan shell stage");
    }
    if (shell.assessment_check != null) {
      errors.push("assessment_check must not be present at Episode Plan shell stage");
    }

    if (!shell.generation_notes || typeof shell.generation_notes !== "object" || Array.isArray(shell.generation_notes)) {
      errors.push("generation_notes must be an object");
    } else {
      var validation = shell.generation_notes.validation;
      if (!validation || typeof validation !== "object" || Array.isArray(validation)) {
        errors.push("generation_notes.validation must be an object");
      } else {
        VALIDATION_REPORT_KEYS.forEach(function (key) {
          if (!(key in validation)) {
            errors.push("generation_notes.validation." + key + " required");
          }
        });
        if (!Array.isArray(validation.known_issues)) {
          errors.push("generation_notes.validation.known_issues must be an array");
        }
      }
    }

    if (Array.isArray(shell.episode_plans) && Array.isArray(shell.activities) && shell.episode_plans.length) {
      var activityIds = shell.activities.map(function (row) {
        return String(row.activity_id || "");
      });
      shell.episode_plans.forEach(function (row, index) {
        if (!row || !hasNonEmptyString(row.activity_id)) {
          errors.push("episode_plans[" + index + "].activity_id required");
          return;
        }
        if (activityIds.indexOf(String(row.activity_id)) === -1) {
          errors.push("episode_plans[" + index + "] activity_id not found in activities[]");
        }
      });
    }

    var epValidation = resolveEpisodePlanV1Validation();
    if (epValidation && typeof epValidation.validatePageEpisodePlanVocabulary === "function") {
      var vocabCheck = epValidation.validatePageEpisodePlanVocabulary(shell, {
        owner: "Episode Plan capture",
        canonicalSource: "Episode Plan FunctionEnum"
      });
      if (!vocabCheck.ok) {
        (vocabCheck.errors || []).forEach(function (msg) {
          errors.push(msg);
        });
      }
    }

    return { ok: errors.length === 0, errors: errors };
  }

  function shellHasInventedDlaFields(shell) {
    if (!shell || !Array.isArray(shell.activities)) return false;
    return shell.activities.some(function (activity) {
      if (!activity || typeof activity !== "object") return false;
      return DLA_COGNITION_FIELDS.some(function (field) {
        return field in activity;
      });
    });
  }

  function shellHasInventedGamMaterials(shell) {
    if (!shell || !Array.isArray(shell.activities)) return false;
    return shell.activities.some(function (activity) {
      if (!activity || !Array.isArray(activity.materials)) return false;
      return activity.materials.length > 0;
    });
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    SHELL_CREATE_VERSION: SHELL_CREATE_VERSION,
    SHELL_DLA_PLACEHOLDER: SHELL_DLA_PLACEHOLDER,
    DLA_COGNITION_FIELDS: DLA_COGNITION_FIELDS.slice(),
    isPageEnrichmentV2Enabled: isPageEnrichmentV2Enabled,
    normalizeEpisodePlansInput: normalizeEpisodePlansInput,
    alignEpisodePlansActivityIds: alignEpisodePlansActivityIds,
    buildSourceArtefactsForShell: buildSourceArtefactsForShell,
    buildCanonicalShellShapeSnippet: buildCanonicalShellShapeSnippet,
    createPageShellFromEpisodePlan: createPageShellFromEpisodePlan,
    validatePageShellAgainstVNextSchema: validatePageShellAgainstVNextSchema,
    isValidShellPlaceholder: isValidShellPlaceholder,
    shellHasInventedDlaFields: shellHasInventedDlaFields,
    shellHasInventedGamMaterials: shellHasInventedGamMaterials
  };
});

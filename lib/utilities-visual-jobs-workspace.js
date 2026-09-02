/**
 * Sprint 70 Slice 6 — Utilities Visual Jobs workspace (presentation + pipeline orchestration).
 * Consumes Slice 5 compiler output only for UI rendering; builds pipeline from assembled page.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      require("./visual-planning-contract.js"),
      require("./prism-visual-jobs-planner.js"),
      require("./prism-image-brief-compiler.js"),
      require("./prism-visual-assets.js"),
      require("./prism-house-visual-language.js"),
      require("./prism-image-precision-fidelity.js"),
      require("./prism-visual-material-role-grounding.js")
    );
  } else {
    var contract = root.PRISM_VISUAL_PLANNING_CONTRACT;
    var planner = root.PRISM_VISUAL_JOBS_PLANNER;
    var compiler = root.PRISM_IMAGE_BRIEF_COMPILER;
    var visualAssets = root.PRISM_VISUAL_ASSETS;
    var houseVisual = root.PRISM_HOUSE_VISUAL_LANGUAGE;
    var precisionFidelity = root.PRISM_IMAGE_PRECISION_FIDELITY;
    root.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = factory(
      contract,
      planner,
      compiler,
      visualAssets,
      houseVisual,
      precisionFidelity,
      root.PRISM_VISUAL_MATERIAL_ROLE_GROUNDING
    );
  }
})(
  typeof globalThis !== "undefined" ? globalThis : this,
  function (contractMod, plannerMod, compilerMod, assetsMod, houseVisualMod, precisionFidelityMod, groundingMod) {
    "use strict";

    if (
      !contractMod ||
      !plannerMod ||
      !compilerMod ||
      typeof contractMod.validateVisualPlanningContract !== "function" ||
      typeof plannerMod.planPrismVisualJobs !== "function" ||
      typeof compilerMod.compilePrismImageBriefs !== "function" ||
      !assetsMod ||
      typeof assetsMod.createVisualAssetAssociation !== "function" ||
      !houseVisualMod ||
      typeof houseVisualMod.formatResourceVisualLanguageSection !== "function" ||
      !precisionFidelityMod ||
      typeof precisionFidelityMod.collectPrecisionCriticalClaims !== "function" ||
      !groundingMod ||
      typeof groundingMod.filterSourcesForPrecision !== "function"
    ) {
      throw new Error(
        "utilities-visual-jobs-workspace requires visual planning pipeline, visual asset modules, house visual language, and image precision fidelity"
      );
    }

    var VISUAL_SLOT_LABELS = {
      "activity-after-header": "Activity after header",
      "materials-entry": "Materials entry",
      "materials-card-grid-after": "Materials card grid after",
      "materials-table-pair-between": "Materials table pair between",
      "assessment-before-checkpoint": "Assessment before checkpoint",
      "knowledge-summary-after-content": "Knowledge summary after content"
    };

    var SOURCE_KIND_LABELS = {
      learner_task: "Learner task",
      learner_visible_material: "Learner-visible material",
      activity_metadata: "Activity metadata",
      feedback: "Feedback",
      answer: "Answer",
      model_answer: "Model answer",
      classification_key: "Classification key",
      knowledge_summary: "Knowledge summary",
      page_synthesis: "Page synthesis"
    };

    var OUTPUT_VIEWS = {
      learner_page: "learner_page",
      visual_jobs: "visual_jobs",
      video: "video",
      resources: "resources"
    };
    var WORKFLOW_PAGE_RESOURCES_FIELD = "workflow_page_resources";

    /** Prompt length bands for diagnostics (character count, deterministic). */
    var PROMPT_LENGTH_CONCISE_MAX = 1200;
    var PROMPT_LENGTH_EXTENDED_MAX = 2400;

    /**
     * Representations that may use slightly denser labels while still avoiding paragraphs.
     * Exception policy: concise phrases only — never worksheet/article text.
     */
    var HIGHER_LABEL_DENSITY_REPS = {
      evidence_t_chart: true,
      comparison_framework: true,
      decision_framework: true,
      diagnostic_pathway: true
    };

    /**
     * Human-prompt visual-language guidance for all 15 Slice 3 representation tokens.
     * Pedagogical/structural only — no artistic style presets.
     */
    var HUMAN_REPRESENTATION_GUIDANCE = {
      comparison_framework: {
        structure:
          "Parallel or aligned comparison of constructs on consistent named dimensions.",
        prefer: "Aligned columns or panels; short dimension labels; visible similarities and differences.",
        avoid: "One-sided explanation; paragraph-length descriptions; invented comparison categories."
      },
      classification_matrix: {
        structure:
          "Clearly separated categories with consistent classification dimensions across a grid.",
        prefer: "Short category labels; clear grouping; empty or structural cells where learners classify.",
        avoid:
          "Completing classifications learners are expected to perform when spoiler protection applies; essay cells."
      },
      causal_model: {
        structure: "Clear directional causal or mechanism network among labelled concepts.",
        prefer:
          "Concise cause/effect labels; visible arrow direction; distinction among causes, mechanisms and outcomes.",
        avoid:
          "Unsupported causal steps; prose explanations replacing the causal structure; a completed written conclusion."
      },
      evidence_t_chart: {
        structure: "Separated evidence sides or columns with parallel claim-versus-evidence roles.",
        prefer: "Short evidence phrases; clear column roles; parallel structure.",
        avoid: "Filling in learner adjudication; paragraph blocks; reproducing source texts verbatim."
      },
      number_line_segments: {
        structure: "A single shared axis with source-supported intervals or segments.",
        prefer: "Consistent units; short segment labels; spatial placement of intervals.",
        avoid: "Invented precision; interpretive verdicts written as sentences; decorative scale clutter."
      },
      ordered_bar_strip: {
        structure: "Ordered bars on a shared comparable scale.",
        prefer: "Clear category labels; magnitude relations shown by bar length; ordered layout.",
        avoid: "Decorative styling that obscures magnitude; paragraph annotations."
      },
      labelled_contrast_panel: {
        structure: "A small number of side-by-side panels with named contrast dimensions.",
        prefer: "Parallel panel structure; short construct names; one clear contrast cue per panel.",
        avoid: "Decorative collage; dense prose in panels; weak contrast."
      },
      concept_map: {
        structure: "Connected concept nodes with visible relationships and clear hierarchy or central idea.",
        prefer: "Arrows, lines, grouping and spatial arrangement; short node labels.",
        avoid:
          "Paragraph boxes; an essay arranged in boxes; disconnected decorative icons; completed written conclusions."
      },
      causal_chain: {
        structure: "Ordered causal sequence with clear progression from earlier to later stages.",
        prefer: "Directional sequence; concise stage labels; visible arrow direction.",
        avoid: "Missing invented intermediate causes; prose replacing the chain; completed learner inference as text."
      },
      process: {
        structure: "Ordered stages with clear direction and distinguishable steps.",
        prefer: "Numbered or directional sequence; short action labels; stage separation.",
        avoid: "Dense written instructions; ambiguous ordering; paragraph stage descriptions."
      },
      comparison: {
        structure: "Parallel layout of compared items with named comparison dimensions.",
        prefer: "Aligned comparison; concise labels; readable contrast.",
        avoid: "One-sided explanation; invented dimensions; paragraph-length descriptions."
      },
      hierarchy: {
        structure: "Parent–child or layered structure with clear level distinctions.",
        prefer: "Spatial nesting or tree layout; short level labels.",
        avoid: "Decorative nesting that invents levels; paragraph annotations."
      },
      decision_framework: {
        structure: "Decision points and branching criteria in a readable pathway.",
        prefer: "Short criteria labels; clear branches; pathway direction.",
        avoid: "Revealing the learner’s final choice; paragraph criteria; worksheet-like instructions."
      },
      diagnostic_pathway: {
        structure: "Ordered diagnostic steps or checkpoints distinguishing observations from conclusions.",
        prefer: "Clear pathway direction; short checkpoint labels; observation/conclusion separation.",
        avoid: "Disclosing the diagnostic answer key; dense written instructions; paragraph blocks."
      },
      annotated_system: {
        structure: "A coherent central system or object with labels pointing to relevant components.",
        prefer: "Concise callouts; clear leader lines; spatial or functional relationships.",
        avoid: "Label clutter; unsupported components; paragraphs around the image."
      }
    };

    var MODALITY_OPENING =
      "Generate a finished rendered educational image.\n\n" +
      "Return one complete learner-facing visual.\n" +
      "Do not respond with prose, ASCII art, Markdown, code, Mermaid, a text diagram, a written outline or instructions for making the image.\n" +
      "The result must be an actual image rather than a textual scaffold.";

    var MODALITY_CLOSING =
      "Return the finished visual itself, not instructions for creating it.";

    var EXPLANATORY_VISUAL_PREFERENCES = Object.freeze([
      "Explanatory diagrams",
      "Process illustrations",
      "Labelled systems",
      "Maps",
      "Reconstructions",
      "Comparison visuals",
      "Conceptual relationship diagrams",
      "Annotated educational graphics"
    ]);

    var WORKSHEET_STYLE_DISALLOWED = Object.freeze([
      "Worksheets or activity sheets",
      "Quizzes or test-question layouts",
      "Answer boxes, writing frames, or fill-in-the-blank fields",
      "Printable classroom handouts",
      "Tables intended for learner completion",
      "Blank organisers or revision-sheet templates",
      "Question prompts inside the image",
      "Numbered exercises or completion checklists"
    ]);

    var HUMAN_PROMPT_MODES = {
      activity_learning_support: "activity_learning_support",
      knowledge_synthesis: "knowledge_synthesis"
    };

    function resolveHumanPromptMode(brief) {
      if (brief && String(brief.scope || "").trim() === "page") {
        return HUMAN_PROMPT_MODES.knowledge_synthesis;
      }
      return HUMAN_PROMPT_MODES.activity_learning_support;
    }

    function getLearnerStage(brief) {
      return String(
        (brief && brief.spoiler_constraints && brief.spoiler_constraints.learner_stage) ||
          (brief && brief.composition && brief.composition.learner_stage) ||
          ""
      ).trim();
    }

    function buildEducationalModeLines(brief, mode) {
      if (mode === HUMAN_PROMPT_MODES.knowledge_synthesis) {
        return [
          "Educational visual mode: knowledge synthesis.",
          "Produce a synthesis artefact that consolidates previously learned material.",
          "Reveal system organisation by integrating multiple AUTHORISED relationships from Show / must_show and allowed_claims.",
          "Integration must stay inside the commission: do not invent extra concepts, categories, processes, fluxes, or causal links to achieve coherence.",
          "Improve understanding through clear visual organisation.",
          "The image should explain concepts, not set learner tasks.",
          "Do not invent unsupported concepts beyond the authored Knowledge Summary brief and this commission."
        ];
      }
      var lines = [
        "Educational visual mode: activity learning support.",
        "Provide visual scaffolding that supports learner reasoning.",
        "Support learner investigation rather than replacing it.",
        "Minimise explanatory prose; prefer scaffold-style visual structure.",
        "The image should explain concepts while surrounding learner text carries the task.",
        "Do not supply completed interpretations or answer-key style diagrams."
      ];
      if (getLearnerStage(brief) === "pre_classification") {
        lines.push(
          "Pre-classification stage: expose concepts, structure and relationships for investigation."
        );
        lines.push(
          "Do not provide completed interpretations, answer-key statements, final inferences, or a worked example."
        );
      }
      return lines;
    }

    /**
     * Concept / claim boundary for operator-copy human prompts.
     * Activity and synthesis share the no-extra-entities rule; synthesis wording
     * still allows connecting multiple authorised relationships.
     */
    function buildConceptBoundaryLines(mode) {
      var subordination = [
        compilerMod.COMMISSIONING_CUE_SUBORDINATION_LINE,
        compilerMod.COMMISSIONING_CUE_LABEL_BOUNDARY_LINE
      ];
      if (mode === HUMAN_PROMPT_MODES.knowledge_synthesis) {
        return [
          "Visualise only entities, processes, categories and relationships authorised by Show / must_show and supported by allowed_claims.",
          "Obey must_not_show and disallowed_claims.",
          "Do not add textbook concepts, processes, categories, fluxes, boundary crossings or causal relationships not authorised by this brief.",
          compilerMod.CLAIM_STRENGTH_PRESERVATION_LINE,
          subordination[0],
          subordination[1],
          "Treat Authorised source evidence as grounding for authorised content, not permission to extend the taught model.",
          "Synthesis may connect multiple authorised relationships into one coherent model; it must not invent new ones."
        ];
      }
      if (mode === HUMAN_PROMPT_MODES.activity_learning_support) {
        return [
          "Only depict the concepts, processes, categories and relationships supplied in Show / must_show and supported by allowed_claims in this brief.",
          "Obey must_not_show and disallowed_claims.",
          "Do not introduce additional concepts, processes, categories, relationships, examples, historical details, or outcomes.",
          "Do not invent additional concepts, subtopics, historical actors, locations, institutions, technologies, processes, or consequences.",
          "Scientifically or disciplinarily plausible extras that are not authorised by this brief must still be omitted.",
          compilerMod.CLAIM_STRENGTH_PRESERVATION_LINE,
          subordination[0],
          subordination[1]
        ];
      }
      return [];
    }

    var HUMAN_EVIDENCE_PER_SOURCE_MAX = 560;
    var HUMAN_EVIDENCE_TOTAL_MAX = 1600;

    function evidenceSourceText(src) {
      if (!src || typeof src !== "object") return "";
      if (typeof src.content_text === "string") return src.content_text;
      if (typeof src.content === "string") return src.content;
      return "";
    }

    function evidenceSourceLabel(src) {
      var anchor = String((src && src.anchor) || "").trim();
      var field = String((src && src.field) || "").trim();
      var lower = anchor.toLowerCase();
      if (lower === "page_synthesis.knowledge_summary" || field === "knowledge_summary") {
        return "Knowledge summary";
      }
      if (lower === "page_synthesis.learning_purpose" || field === "learning_purpose") {
        return "Learning purpose";
      }
      if (lower === "page_synthesis.overview" || field === "overview") {
        return "Overview";
      }
      if (lower === "page_synthesis.study_tips" || field === "study_tips") {
        return "Study tips";
      }
      if (/\.learner_task$/i.test(anchor) || field === "learner_task") {
        return "Learner task";
      }
      if (/\.materials\./i.test(anchor)) {
        var mat = anchor.split(".").pop() || "material";
        return "Material (" + mat.replace(/_/g, " ") + ")";
      }
      if (field) return field.replace(/_/g, " ");
      if (anchor) return anchor.replace(/[._]/g, " ");
      return "Source";
    }

    function evidencePriority(src) {
      var anchor = String((src && src.anchor) || "").toLowerCase();
      var field = String((src && src.field) || "").toLowerCase();
      if (
        anchor.indexOf("page_synthesis.knowledge_summary") === 0 ||
        field === "knowledge_summary"
      ) {
        return 0;
      }
      if (anchor.indexOf("page_synthesis.") === 0) return 1;
      return 2;
    }

    /**
     * Compact authorised evidence for the LIVE human prompt.
     * Uses brief.source_evidence already resolved by the planner/compiler — no second resolver.
     * Labels are learner/operator-facing (no internal affordance/job IDs or raw anchor paths).
     */
    function getMaterialRole(brief) {
      return brief && brief.material_role && typeof brief.material_role === "object"
        ? brief.material_role
        : null;
    }

    function findRepresentedSource(brief) {
      var sources = Array.isArray(brief && brief.source_evidence) ? brief.source_evidence : [];
      for (var i = 0; i < sources.length; i += 1) {
        if (sources[i] && sources[i].evidence_role === "represented_material") return sources[i];
      }
      return null;
    }

    function buildAuthorisedEvidenceLines(brief) {
      var sources = Array.isArray(brief && brief.source_evidence)
        ? brief.source_evidence.slice()
        : [];
      if (!sources.length) return [];
      var role = getMaterialRole(brief);
      var represented = findRepresentedSource(brief);
      var lines = [];

      if (represented && role) {
        var repText = String(evidenceSourceText(represented) || "")
          .replace(/\s+/g, " ")
          .trim();
        if (repText) {
          if (role.effective_policy === groundingMod.EFFECTIVE_POLICY.GROUNDED_SOURCE) {
            lines.push("- Represented material (authoritative): " + repText);
          } else if (role.effective_policy === groundingMod.EFFECTIVE_POLICY.WORKED_EXAMPLE) {
            lines.push(
              "- Represented worked example (" +
                groundingMod.buildWorkedExampleLabelling(role.represented_material) +
                "): " +
                repText
            );
          }
        }
        sources = sources.filter(function (src) {
          return !(src && src.evidence_role === "represented_material");
        });
      }

      var roleForEvidence =
        role || { effective_policy: groundingMod.EFFECTIVE_POLICY.CONCEPTUAL };
      sources = groundingMod.filterSourcesForPrecision(sources, roleForEvidence);

      sources.sort(function (a, b) {
        return evidencePriority(a) - evidencePriority(b);
      });
      var used = 0;
      for (var i = 0; i < sources.length; i++) {
        if (used >= HUMAN_EVIDENCE_TOTAL_MAX) break;
        var raw = String(evidenceSourceText(sources[i]) || "")
          .replace(/\s+/g, " ")
          .trim();
        if (!raw) continue;
        var budget = Math.min(
          HUMAN_EVIDENCE_PER_SOURCE_MAX,
          HUMAN_EVIDENCE_TOTAL_MAX - used
        );
        var clipped = precisionFidelityMod.clipEvidenceText(raw, budget);
        var line = "- " + evidenceSourceLabel(sources[i]) + ": " + clipped;
        lines.push(line);
        used += clipped.length;
      }
      return lines;
    }

    function collectBriefPrecisionClaims(brief) {
      var additional = [];
      asStringList(brief && brief.content_requirements && brief.content_requirements.authored).forEach(
        function (item) {
          additional.push(item);
        }
      );
      asStringList(brief && brief.claim_constraints && brief.claim_constraints.allowed).forEach(
        function (item) {
          additional.push(item);
        }
      );
      if (brief && brief.subject) additional.push(String(brief.subject));
      var role =
        getMaterialRole(brief) ||
        { effective_policy: groundingMod.EFFECTIVE_POLICY.CONCEPTUAL };
      if (role.effective_policy === groundingMod.EFFECTIVE_POLICY.CONCEPTUAL) {
        if (brief && brief.context) additional.push(String(brief.context));
      }
      return precisionFidelityMod.collectPrecisionCriticalClaims({
        sourceEvidence: brief && brief.source_evidence,
        materialRole: role,
        filterSourcesForPrecision: groundingMod.filterSourcesForPrecision,
        additionalTexts: additional
      });
    }

    function buildMaterialRolePolicyLines(brief) {
      var role =
        getMaterialRole(brief) ||
        { effective_policy: groundingMod.EFFECTIVE_POLICY.CONCEPTUAL };
      if (role.effective_policy === groundingMod.EFFECTIVE_POLICY.CONCEPTUAL) {
        return [
          "This visual explains concepts or relationships only.",
          "Do not instantiate activity-specific scenario numerics, symbols, units, or labels unless explicitly authorised in Show / must_show.",
          "Use qualitative mechanism labels rather than inventing a concrete capacity scenario."
        ];
      }
      if (role.effective_policy === groundingMod.EFFECTIVE_POLICY.WORKED_EXAMPLE) {
        return [
          groundingMod.buildWorkedExampleLabelling(role.represented_material),
          "This visual represents a separate worked example — not the learner's independent attempt scenario.",
          "Use only particulars from the represented worked-example material.",
          "Do not reproduce answer-bearing particulars from the learner's independent attempt material."
        ];
      }
      if (role.effective_policy === groundingMod.EFFECTIVE_POLICY.GROUNDED_SOURCE) {
        return [
          "This visual represents the authoritative learner source material identified in Represented material (authoritative).",
          "Do not substitute or invent alternative numerical, symbolic, unit, label, or scenario particulars.",
          "If a particular cannot be represented faithfully, omit it rather than replace it."
        ];
      }
      return [];
    }

    function asStringList(items) {
      if (!items || !items.length) return [];
      return items
        .map(function (item) {
          if (item && typeof item === "object" && item.text) return String(item.text).trim();
          return String(item == null ? "" : item).trim();
        })
        .filter(Boolean);
    }

    function uniqueStrings(list) {
      var seen = {};
      var out = [];
      (list || []).forEach(function (item) {
        var key = String(item);
        if (seen[key]) return;
        seen[key] = true;
        out.push(key);
      });
      return out;
    }

    function classifyPromptLength(text) {
      var len = String(text || "").length;
      if (len <= PROMPT_LENGTH_CONCISE_MAX) return "concise";
      if (len <= PROMPT_LENGTH_EXTENDED_MAX) return "extended";
      return "unusually_long";
    }

    function normalizePurposeText(brief) {
      if (!brief || typeof brief !== "object") return "";
      var ped =
        brief.pedagogical_metadata && brief.pedagogical_metadata.pedagogical_added_value;
      var purposeToken = brief.purpose ? humanizeToken(brief.purpose) : "";
      var reasoning =
        brief.pedagogical_metadata && brief.pedagogical_metadata.reasoning_supported;
      if (ped) return String(ped).trim();
      if (purposeToken && reasoning) {
        var reason = String(reasoning).trim();
        if (reason.toLowerCase().indexOf(purposeToken.toLowerCase()) === 0) return reason;
        return purposeToken + ". " + reason;
      }
      return purposeToken || (reasoning ? String(reasoning).trim() : "");
    }

    function buildDisplayTitle(brief) {
      var subject = String((brief && brief.subject) || "").trim();
      if (!subject) {
        return humanizeRepresentation(brief && brief.preferred_representation) || "Visual brief";
      }
      if (subject.length <= 90) return subject;
      var cut = subject.slice(0, 90);
      var lastSpace = cut.lastIndexOf(" ");
      if (lastSpace > 40) cut = cut.slice(0, lastSpace);
      return cut.trim() + "...";
    }

    function normalizeContextText(brief) {
      return String((brief && brief.context) || "")
        .trim()
        .replace(/^Visual brief:\s*/i, "");
    }

    function getRepresentationToken(brief) {
      return String(
        (brief && brief.preferred_representation) ||
          (brief && brief.composition && brief.composition.representation) ||
          ""
      ).trim();
    }

    function getRepresentationGuidance(token) {
      return HUMAN_REPRESENTATION_GUIDANCE[token] || null;
    }

    function buildTextDensityLines(token, hasPrecisionClaims) {
      var lines = [
        "Use short noun-phrase labels (about 2–6 words).",
        "Communicate primarily through visual organisation rather than explanatory prose.",
        "Use layout, grouping, arrows, shapes, icons and spatial relationships.",
        "Do not use paragraph text or repeated explanations."
      ];
      if (HIGHER_LABEL_DENSITY_REPS[token]) {
        lines.push(precisionFidelityMod.antiVerbatimPolicyLine(!!hasPrecisionClaims));
      } else if (hasPrecisionClaims) {
        lines.push(precisionFidelityMod.antiVerbatimPolicyLine(true));
      } else {
        lines.push("Use only the text necessary to identify concepts and relationships.");
      }
      return lines;
    }

    function buildRelationshipItems(brief, mode) {
      var items = [];
      var reasoning =
        brief.pedagogical_metadata && brief.pedagogical_metadata.reasoning_supported
          ? String(brief.pedagogical_metadata.reasoning_supported).trim()
          : "";
      var purpose = String(brief.purpose || "").trim();
      var token = getRepresentationToken(brief);
      var guidance = getRepresentationGuidance(token);
      var isActivity = mode === HUMAN_PROMPT_MODES.activity_learning_support;

      if (isActivity) {
        items.push(
          "Show relationships visually through arrows, grouping, hierarchy or spatial organisation."
        );
        items.push("Do not explain those relationships in prose or as a causal essay.");
      }

      if (
        reasoning &&
        !/\b(because|therefore|thus|hence|so that)\b/i.test(reasoning) &&
        reasoning.length <= 160
      ) {
        if (isActivity) {
          items.push("Make visible (do not write as completed inference): " + reasoning);
        } else {
          items.push("Make visible: " + reasoning);
        }
      }
      if (purpose === "mechanism" || purpose === "classification" || purpose === "comparison") {
        items.push("Show " + purpose + " relationships through layout rather than written inference.");
      }
      if (
        guidance &&
        (token === "causal_model" ||
          token === "causal_chain" ||
          token === "process" ||
          token === "concept_map" ||
          token === "comparison" ||
          token === "comparison_framework")
      ) {
        items.push(guidance.prefer);
      }
      return uniqueStrings(items);
    }

    function buildEssentialAvoidItems(brief) {
      var avoid = asStringList(
        brief.exclusion_requirements && brief.exclusion_requirements.authored_must_not_show
      );
      if (brief.spoiler_constraints && brief.spoiler_constraints.anti_spoiler) {
        avoid.push("Completed learner conclusions or answer keys");
      }
      asStringList(brief.claim_constraints && brief.claim_constraints.disallowed).forEach(function (
        claim
      ) {
        if (claim.length <= 120) avoid.push(claim);
      });
      return uniqueStrings(avoid);
    }

    function pushSection(lines, heading, bodyLines) {
      if (!bodyLines || !bodyLines.length) return;
      lines.push(heading);
      bodyLines.forEach(function (line) {
        lines.push(line);
      });
      lines.push("");
    }

    function buildVisualJobHumanPrompt(brief) {
      if (!brief || typeof brief !== "object") return "";
      var mode = resolveHumanPromptMode(brief);
      var token = getRepresentationToken(brief);
      var repLabel = humanizeRepresentation(token);
      var guidance = getRepresentationGuidance(token);
      var mustShow = asStringList(
        brief.content_requirements && brief.content_requirements.authored
      );
      var mustNotShow = asStringList(
        brief.exclusion_requirements && brief.exclusion_requirements.authored_must_not_show
      );
      var repAvoid = asStringList(
        (brief.exclusion_requirements &&
          brief.exclusion_requirements.authored_representation_avoid) ||
          (brief.representation_constraints && brief.representation_constraints.avoid)
      );
      var purposeText = normalizePurposeText(brief);
      var antiSpoiler = !!(brief.spoiler_constraints && brief.spoiler_constraints.anti_spoiler);
      var isActivity = mode === HUMAN_PROMPT_MODES.activity_learning_support;
      var precisionClaims = collectBriefPrecisionClaims(brief);
      var hasPrecisionClaims = precisionClaims.length > 0;
      var emitPrecisionFidelity = precisionFidelityMod.shouldEmitPrecisionFidelity(
        precisionClaims,
        brief
      );
      var lines = [];

      lines.push(MODALITY_OPENING);
      lines.push("");

      if (purposeText) {
        pushSection(lines, "Educational goal:", [purposeText]);
      }

      pushSection(
        lines,
        "Audience:",
        [
          isActivity
            ? "Learners working through an educational activity."
            : "Learners consolidating material after completing activity reasoning."
        ]
      );

      pushSection(lines, "Educational mode:", buildEducationalModeLines(brief, mode));

      pushSection(
        lines,
        "Preferred visual output:",
        EXPLANATORY_VISUAL_PREFERENCES.map(function (item) {
          return "- " + item;
        })
      );

      pushSection(
        lines,
        houseVisualMod.getResourceVisualLanguageHeading(),
        houseVisualMod.getHouseVisualLanguageLines().map(function (item) {
          return "- " + item;
        })
      );

      if (repLabel) {
        pushSection(lines, "Representation:", [repLabel]);
      }

      var conceptBoundary = buildConceptBoundaryLines(mode);
      if (conceptBoundary.length) {
        pushSection(
          lines,
          mode === HUMAN_PROMPT_MODES.knowledge_synthesis
            ? "Concept / claim boundary:"
            : "Concept boundary:",
          conceptBoundary
        );
      }

      var materialRoleLines = buildMaterialRolePolicyLines(brief);
      if (materialRoleLines.length) {
        pushSection(lines, "Material role:", materialRoleLines);
      }

      pushSection(
        lines,
        "Claim discipline:",
        compilerMod.buildHumanClaimDisciplineLines(brief)
      );

      var evidenceLines = buildAuthorisedEvidenceLines(brief);
      if (evidenceLines.length) {
        pushSection(lines, "Authorised source evidence:", evidenceLines);
      }

      var precisionClaimLines = precisionFidelityMod.buildAuthorisedPrecisionClaimLines(
        precisionClaims,
        "human"
      );
      if (precisionClaimLines.length) {
        pushSection(lines, precisionClaimLines[0], precisionClaimLines.slice(1));
      }

      if (guidance) {
        pushSection(lines, "Visual structure:", [
          guidance.structure,
          "Prefer: " + guidance.prefer,
          "Avoid: " + guidance.avoid
        ]);
      }

      if (mustShow.length) {
        pushSection(
          lines,
          "Show:",
          mustShow.map(function (item) {
            return "- " + item;
          })
        );
      }

      var relationships = buildRelationshipItems(brief, mode);
      if (relationships.length) {
        pushSection(
          lines,
          "Relationships:",
          relationships.map(function (item) {
            return "- " + item;
          })
        );
      }

      pushSection(
        lines,
        "Text and labels:",
        buildTextDensityLines(token, hasPrecisionClaims).map(function (item) {
          return "- " + item;
        })
      );

      var avoidCombined = uniqueStrings(
        mustNotShow.concat(repAvoid).concat([
          "Prose-only or text-only responses",
          "ASCII art, Markdown diagrams, code or Mermaid",
          "Paragraph-length explanations on the image"
        ])
      );
      avoidCombined = uniqueStrings(avoidCombined.concat(WORKSHEET_STYLE_DISALLOWED));
      if (isActivity) {
        avoidCombined = uniqueStrings(
          avoidCombined.concat([
            "Additional concepts not listed in this brief",
            "Answer-key style completed interpretations",
            "Explanatory paragraphs that finish learner reasoning",
            "Moving learner exercises into the image itself"
          ])
        );
      }
      pushSection(
        lines,
        "Avoid:",
        avoidCombined.map(function (item) {
          return "- " + item;
        })
      );

      var commissioningCueLines = compilerMod.buildCommissioningCueHumanLines(brief);
      if (commissioningCueLines.length) {
        pushSection(lines, "Commissioning cues (subordinate):", commissioningCueLines);
      }

      if (emitPrecisionFidelity) {
        var fidelityLines = precisionFidelityMod.buildPrecisionFidelityInstructionLines(
          precisionClaims,
          brief
        );
        if (fidelityLines.length) {
          pushSection(lines, fidelityLines[0], fidelityLines.slice(1));
        }
      }

      if (antiSpoiler) {
        var reasoningLines;
        if (isActivity) {
          reasoningLines = [
            "Show the relevant concepts and relationships, but do not provide a completed written conclusion or fully worked learner response.",
            "Support learner investigation rather than replacing it.",
            "The learner should still need to interpret the visual.",
            "Do not reveal completed learner conclusions, answer keys, or model solutions."
          ];
        } else {
          reasoningLines = [
            "Show the relevant concepts and relationships, but do not provide a completed written conclusion or fully worked learner response.",
            "The learner should still need to interpret the visual.",
            "Do not reveal completed learner conclusions, answer keys, or model solutions."
          ];
        }
        if (
          brief.spoiler_constraints.boundary &&
          brief.spoiler_constraints.boundary.allow_structural_hint
        ) {
          reasoningLines.push("Structural hints are permitted where the brief allows.");
        }
        pushSection(lines, "Learner reasoning:", reasoningLines);
      }

      if (brief.caption_guidance) {
        var captionBody = [String(brief.caption_guidance).trim()];
        var captionRole =
          getMaterialRole(brief) ||
          { effective_policy: groundingMod.EFFECTIVE_POLICY.CONCEPTUAL };
        if (captionRole.effective_policy === groundingMod.EFFECTIVE_POLICY.WORKED_EXAMPLE) {
          captionBody.unshift(
            groundingMod.buildWorkedExampleLabelling(captionRole.represented_material)
          );
        }
        captionBody.push("Keep any on-image caption labels short.");
        pushSection(lines, "Caption guidance:", captionBody);
      }

      lines.push(MODALITY_CLOSING);
      return lines
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    }

    function diagnoseHumanPrompt(prompt, brief) {
      var text = String(prompt || "");
      var antiSpoiler = !!(brief && brief.spoiler_constraints && brief.spoiler_constraints.anti_spoiler);
      var token = getRepresentationToken(brief);
      var mode = resolveHumanPromptMode(brief);
      var isActivity = mode === HUMAN_PROMPT_MODES.activity_learning_support;
      var isSynthesis = mode === HUMAN_PROMPT_MODES.knowledge_synthesis;
      var learnerStage = getLearnerStage(brief);
      return {
        modality_instruction_present: /^Generate a finished rendered educational image\./.test(
          text
        ),
        rejects_text_only_output:
          /Do not respond with prose/i.test(text) &&
          /ASCII art/i.test(text) &&
          /Markdown/i.test(text) &&
          /\bcode\b/i.test(text) &&
          /Mermaid/i.test(text) &&
          /written outline/i.test(text),
        visual_organisation_instruction_present:
          /visual organisation/i.test(text) &&
          /layout, grouping, arrows, shapes, icons and spatial relationships/i.test(text),
        paragraph_text_prohibited: /Do not use paragraph text/i.test(text),
        learner_reasoning_boundary_present: antiSpoiler
          ? /learner should still need to interpret/i.test(text) &&
            /completed written conclusion/i.test(text)
          : !/Learner reasoning:/i.test(text),
        representation_guidance_present: !!(
          token &&
          HUMAN_REPRESENTATION_GUIDANCE[token] &&
          /Visual structure:/i.test(text)
        ),
        finished_visual_reminder_present: /Return the finished visual itself/i.test(text),
        activity_mode: isActivity && /activity learning support/i.test(text),
        synthesis_mode: isSynthesis && /knowledge synthesis/i.test(text),
        concept_boundary_present: isSynthesis
          ? /Concept \/ claim boundary:/i.test(text) &&
            /Visualise only entities, processes, categories and relationships authorised by Show/i.test(
              text
            ) &&
            /Do not add textbook concepts, processes, categories/i.test(text)
          : /Concept boundary:/i.test(text) &&
            /Only depict the concepts, processes, categories and relationships supplied in Show/i.test(
              text
            ) &&
            /Do not invent additional concepts/i.test(text),
        relationship_visualisation_present: isActivity
          ? /Show relationships visually through arrows, grouping, hierarchy or spatial organisation/i.test(
              text
            )
          : true,
        no_extra_concepts_instruction_present: isSynthesis
          ? /Do not add textbook concepts, processes, categories/i.test(text) &&
            /must not invent new ones/i.test(text)
          : /Do not introduce additional concepts, processes, categories, relationships/i.test(
              text
            ),
        authorised_evidence_present: /Authorised source evidence:/i.test(text),
        resource_visual_language_present: /Resource visual language:/i.test(text),
        synthesis_integration_bounded: isSynthesis
          ? /AUTHORISED relationships from Show/i.test(text) &&
            !/integrate relationships across the lesson/i.test(text)
          : true,
        preclassification_boundary_present:
          isActivity && learnerStage === "pre_classification"
            ? /Pre-classification stage/i.test(text) &&
              /Support learner investigation rather than replacing it/i.test(text)
            : !/Pre-classification stage/i.test(text),
        prompt_length_class: classifyPromptLength(text),
        human_prompt_mode: mode,
        precision_critical_claims_present: /Authorised precision-critical relationships:/i.test(
          text
        ),
        precision_fidelity_section_present: /Precision-critical fidelity:/i.test(text),
        qualitative_no_invented_equation_present:
          /authorised only qualitatively and no exact formal relationship/i.test(text),
        authorised_formal_verbatim_carveout_present:
          /authorised precision-critical formal forms/i.test(text) &&
          /MAY and SHOULD be reproduced exactly/i.test(text)
      };
    }

    function buildVisualJobPresentation(brief, index) {
      var humanPrompt = buildVisualJobHumanPrompt(brief);
      var contentReq = brief.content_requirements || { authored: [], derived: [] };
      var diagnostics = diagnoseHumanPrompt(humanPrompt, brief);
      if (!diagnostics.modality_instruction_present) {
        throw new Error(
          "buildVisualJobPresentation: human prompt missing required rendered-image modality instruction"
        );
      }
      return {
        index: typeof index === "number" ? index : 0,
        brief_id: brief.brief_id,
        job_id: brief.job_id,
        affordance_id: brief.affordance_id,
        title: buildDisplayTitle(brief),
        location_label:
          formatBriefLocation(brief) + " · " + humanizeVisualSlot(brief.visual_slot),
        representation_label: humanizeRepresentation(brief.preferred_representation),
        representationToken: brief.preferred_representation,
        purpose_text: normalizePurposeText(brief),
        human_prompt: humanPrompt,
        generation_instruction: brief.generation_instruction,
        include_items: asStringList(contentReq.authored),
        avoid_items: buildEssentialAvoidItems(brief),
        prompt_length_class: diagnostics.prompt_length_class,
        prompt_quality_diagnostics: diagnostics,
        rendered_image_required: true,
        must_show: asStringList(contentReq.authored),
        derived_requirements: contentReq.derived || [],
        must_not_show: asStringList(
          brief.exclusion_requirements && brief.exclusion_requirements.authored_must_not_show
        ),
        representation_avoid: asStringList(
          (brief.exclusion_requirements &&
            brief.exclusion_requirements.authored_representation_avoid) ||
            (brief.representation_constraints && brief.representation_constraints.avoid)
        ),
        allowed_claims: asStringList(brief.claim_constraints && brief.claim_constraints.allowed),
        disallowed_claims: asStringList(
          brief.claim_constraints && brief.claim_constraints.disallowed
        ),
        anti_spoiler: !!(brief.spoiler_constraints && brief.spoiler_constraints.anti_spoiler),
        spoiler_boundary:
          (brief.spoiler_constraints && brief.spoiler_constraints.boundary) || null,
        learner_stage:
          (brief.spoiler_constraints && brief.spoiler_constraints.learner_stage) ||
          (brief.composition && brief.composition.learner_stage),
        discipline_risk_level: brief.discipline_guidance && brief.discipline_guidance.risk_level,
        canonical_note: brief.discipline_guidance && brief.discipline_guidance.canonical_note,
        caption_intent: brief.caption_guidance,
        alt_text: brief.alt_text,
        detailed_description: brief.detailed_description,
        source_evidence: Array.isArray(brief.source_evidence) ? brief.source_evidence : [],
        provenance: brief.provenance || {},
        authored_passthrough: brief.authored_passthrough || {},
        schema_version: brief.schema_version,
        planner_version: brief.planner_version,
        compiler_version: brief.compiler_version,
        visual_slot: brief.visual_slot,
        activity_id: brief.activity_id,
        scope: brief.scope
      };
    }

    function deepClone(value) {
      if (value == null) return value;
      return JSON.parse(JSON.stringify(value));
    }

    function normalizePageResourceRefsShape(value) {
      var src = value && typeof value === "object" ? value : {};
      var additional = Array.isArray(src.additional_resources)
        ? src.additional_resources.map(function (row, idx) {
            var item = row && typeof row === "object" ? row : {};
            return {
              resource_id: String(item.resource_id || "").trim(),
              link_text: String(item.link_text || "").trim(),
              order:
                typeof item.order === "number" && isFinite(item.order) ? Math.floor(item.order) : idx
            };
          })
        : [];
      additional = additional
        .filter(function (row) {
          return row.resource_id && row.link_text;
        })
        .sort(function (a, b) {
          return a.order - b.order;
        })
        .map(function (row, idx) {
          return {
            resource_id: row.resource_id,
            link_text: row.link_text,
            order: idx
          };
        });
      return {
        video_resource_id: String(src.video_resource_id || "").trim(),
        video_section_title: String(src.video_section_title || "Video").trim() || "Video",
        video_intro_text: String(src.video_intro_text || ""),
        additional_resources_intro: String(src.additional_resources_intro || ""),
        additional_resources: additional
      };
    }

    function readPageResourceRefsFromPage(page) {
      if (!page || typeof page !== "object") {
        return normalizePageResourceRefsShape(null);
      }
      return normalizePageResourceRefsShape(page[WORKFLOW_PAGE_RESOURCES_FIELD]);
    }

    function writePageResourceRefsToPage(workspaceState, refs) {
      if (!workspaceState || !workspaceState.assembledPageSnapshot) return;
      workspaceState.pageResourceRefs = normalizePageResourceRefsShape(refs);
      workspaceState.assembledPageSnapshot[WORKFLOW_PAGE_RESOURCES_FIELD] = deepClone(
        workspaceState.pageResourceRefs
      );
    }

    function escapeHtml(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function isPlainObject(value) {
      return !!value && typeof value === "object" && !Array.isArray(value);
    }

    function humanizeToken(token) {
      return String(token || "")
        .trim()
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, function (ch) {
          return ch.toUpperCase();
        });
    }

    function humanizeVisualSlot(slot) {
      var key = String(slot || "").trim();
      return VISUAL_SLOT_LABELS[key] || humanizeToken(key);
    }

    function humanizeRepresentation(rep) {
      return humanizeToken(rep);
    }

    function humanizeSourceKind(kind) {
      var key = String(kind || "").trim();
      return SOURCE_KIND_LABELS[key] || humanizeToken(key);
    }

    function formatBriefLocation(brief) {
      if (!brief || typeof brief !== "object") return "Visual job";
      if (brief.scope === "page") {
        return brief.region ? "Page · " + humanizeToken(brief.region) : "Page summary";
      }
      if (brief.activity_id) return "Activity " + String(brief.activity_id);
      return "Activity";
    }

    function buildVisualJobsPipelineFromPage(page) {
      if (!isPlainObject(page)) {
        throw new TypeError("buildVisualJobsPipelineFromPage requires a plain page object");
      }
      var normalized =
        typeof contractMod.normalizeVisualPlanningAuthoredFields === "function"
          ? contractMod.normalizeVisualPlanningAuthoredFields(page)
          : typeof contractMod.normalizeVisualPlanningEvidenceAnchors === "function"
            ? contractMod.normalizeVisualPlanningEvidenceAnchors(page)
            : { page: page, changes: [], errors: [], warnings: [] };
      var workingPage = normalized.page || page;
      var contractResult = deepClone(contractMod.validateVisualPlanningContract(workingPage));
      if ((normalized.errors || []).length) {
        contractResult.valid = false;
        contractResult.errors = (contractResult.errors || []).concat(deepClone(normalized.errors));
      }
      if ((normalized.warnings || []).length) {
        contractResult.warnings = (contractResult.warnings || []).concat(
          deepClone(normalized.warnings)
        );
      }
      var plannerResult = plannerMod.planPrismVisualJobs(workingPage);
      var compilerResult = compilerMod.compilePrismImageBriefs(plannerResult);
      return {
        assembledPageSnapshot: deepClone(workingPage),
        evidenceAnchorNormalization: {
          changes: deepClone(normalized.changes || []),
          errors: deepClone(normalized.errors || []),
          warnings: deepClone(normalized.warnings || [])
        },
        contractResult: deepClone(contractResult),
        plannerResult: deepClone(plannerResult),
        compilerResult: deepClone(compilerResult)
      };
    }

    function emptyWorkspaceState() {
      return {
        assembledPageSnapshot: null,
        contractResult: null,
        plannerResult: null,
        compilerResult: null,
        activeView: OUTPUT_VIEWS.learner_page,
        selectedBriefId: "",
        humanPromptExpandedByBriefId: {},
        copyStateByBriefId: {},
        assetsByBriefId: {},
        assetErrorsByBriefId: {},
        visualAssetManifest: assetsMod.buildVisualAssetManifest({ briefs: [] }, {}),
        rendererPlacementByBriefId: {},
        learnerPreviewRefreshStatus: "",
        pageResourceRefs: {
          video_resource_id: "",
          video_section_title: "Video",
          video_intro_text: "",
          additional_resources_intro: "",
          additional_resources: []
        },
        pageResourceDrafts: {
          videoTitle: "Video",
          videoIntroText: "",
          videoEmbedCode: "",
          resourceIntroText: "",
          resourceLinkText: "",
        },
        additionalResourceProjection: {
          intro_text: "",
          items: [],
          diagnostics: []
        },
        videoResourceProjection: {
          resource_id: "",
          section_title: "Video",
          intro_text: "",
          embed_code: ""
        },
        previewRevision: 0,
        previewTransaction: null,
        previewWriteLog: []
      };
    }

    function buildVisualJobsWorkspaceState(page, options) {
      var opts = options && typeof options === "object" ? options : {};
      if (page == null) {
        return emptyWorkspaceState();
      }
      if (!isPlainObject(page)) {
        throw new TypeError("buildVisualJobsWorkspaceState(page) requires a plain object or null");
      }
      var pipeline = buildVisualJobsPipelineFromPage(page);
      pipeline.activeView =
        opts.activeView === OUTPUT_VIEWS.visual_jobs ||
        opts.activeView === OUTPUT_VIEWS.video ||
        opts.activeView === OUTPUT_VIEWS.resources
          ? opts.activeView
          : OUTPUT_VIEWS.learner_page;
      pipeline.selectedBriefId = "";
      pipeline.humanPromptExpandedByBriefId = {};
      pipeline.copyStateByBriefId = {};
      pipeline.assetsByBriefId = {};
      pipeline.assetErrorsByBriefId = {};
      pipeline.rendererPlacementByBriefId = {};
      pipeline.learnerPreviewRefreshStatus = "";
      pipeline.previewRevision = 0;
      pipeline.previewTransaction = null;
      pipeline.previewWriteLog = [];
      pipeline.pageResourceRefs = readPageResourceRefsFromPage(pipeline.assembledPageSnapshot);
      pipeline.pageResourceDrafts = {
        videoTitle: String(pipeline.pageResourceRefs.video_section_title || "Video"),
        videoIntroText: String(pipeline.pageResourceRefs.video_intro_text || ""),
        resourceIntroText: String(pipeline.pageResourceRefs.additional_resources_intro || ""),
        resourceLinkText: "",
        videoEmbedCode: ""
      };
      pipeline.additionalResourceProjection = {
        intro_text: String(pipeline.pageResourceRefs.additional_resources_intro || ""),
        items: [],
        diagnostics: []
      };
      pipeline.videoResourceProjection = {
        resource_id: "",
        section_title: String(pipeline.pageResourceRefs.video_section_title || "Video"),
        intro_text: String(pipeline.pageResourceRefs.video_intro_text || ""),
        embed_code: ""
      };
      pipeline.visualAssetManifest = assetsMod.buildVisualAssetManifest(
        pipeline.compilerResult || { briefs: [] },
        pipeline.assetsByBriefId
      );
      if (pipeline.compilerResult && Array.isArray(pipeline.compilerResult.briefs)) {
        pipeline.selectedBriefId = String(
          (pipeline.compilerResult.briefs[0] && pipeline.compilerResult.briefs[0].brief_id) || ""
        );
      }
      return pipeline;
    }

    function resolveWorkspaceStatus(workspaceState) {
      if (!workspaceState || !workspaceState.assembledPageSnapshot) {
        return "no_assembled_page";
      }
      var contract = workspaceState.contractResult || {};
      var planner = workspaceState.plannerResult || {};
      var compiler = workspaceState.compilerResult || {};
      if (contract.authoritative_planning_present === false) {
        return "legacy_no_planning";
      }
      if (contract.valid === false) {
        return "contract_invalid";
      }
      if (planner.valid === false) {
        return "planner_invalid";
      }
      var generateCount =
        planner.diagnostics && typeof planner.diagnostics.generate === "number"
          ? planner.diagnostics.generate
          : Array.isArray(planner.jobs)
            ? planner.jobs.length
            : 0;
      if (generateCount === 0) {
        return "zero_generate_jobs";
      }
      if (compiler.valid === false) {
        return compiler.briefs && compiler.briefs.length ? "compiler_partial" : "compiler_invalid";
      }
      return "success";
    }

    function buildWorkspaceSummary(workspaceState) {
      var status = resolveWorkspaceStatus(workspaceState);
      var planner = (workspaceState && workspaceState.plannerResult) || {};
      var compiler = (workspaceState && workspaceState.compilerResult) || {};
      var plannerDiag = planner.diagnostics || {};
      var briefs = Array.isArray(compiler.briefs) ? compiler.briefs : [];
      var activityScoped = 0;
      var pageScoped = 0;
      briefs.forEach(function (brief) {
        if (brief.scope === "page") pageScoped += 1;
        if (brief.scope === "activity") activityScoped += 1;
      });
      return {
        status: status,
        promptCount: briefs.length,
        activityScoped: activityScoped,
        pageScoped: pageScoped,
        deferredCount: Array.isArray(plannerDiag.deferred) ? plannerDiag.deferred.length : plannerDiag.defer || 0,
        skippedCount: Array.isArray(plannerDiag.skipped) ? plannerDiag.skipped.length : plannerDiag.skip || 0,
        contractValid: !!(workspaceState.contractResult && workspaceState.contractResult.valid),
        plannerValid: !!planner.valid,
        compilerValid: !!compiler.valid,
        partialCompilation: !!(compiler.diagnostics && compiler.diagnostics.partial_compilation)
      };
    }

    function buildBriefCardViewModel(brief, index) {
      return buildVisualJobPresentation(brief, index);
    }

    function compareVisualJobsAlphabetically(a, b) {
      var locCmp = String(formatBriefLocation(a) || "").localeCompare(
        String(formatBriefLocation(b) || ""),
        undefined,
        { sensitivity: "base", numeric: true }
      );
      if (locCmp !== 0) return locCmp;
      var titleCmp = String(buildDisplayTitle(a) || "").localeCompare(
        String(buildDisplayTitle(b) || ""),
        undefined,
        { sensitivity: "base", numeric: true }
      );
      if (titleCmp !== 0) return titleCmp;
      var slotCmp = String(humanizeVisualSlot(a && a.visual_slot) || "").localeCompare(
        String(humanizeVisualSlot(b && b.visual_slot) || ""),
        undefined,
        { sensitivity: "base", numeric: true }
      );
      if (slotCmp !== 0) return slotCmp;
      return String((a && a.brief_id) || "").localeCompare(String((b && b.brief_id) || ""), undefined, {
        sensitivity: "base",
        numeric: true
      });
    }

    function buildVisualJobsOrderedList(workspaceState) {
      var compiler = (workspaceState && workspaceState.compilerResult) || {};
      var briefs = Array.isArray(compiler.briefs) ? compiler.briefs.slice() : [];
      return briefs.sort(compareVisualJobsAlphabetically);
    }

    function findBriefById(workspaceState, briefId) {
      var id = String(briefId || "").trim();
      if (!id) return null;
      var briefs = buildVisualJobsOrderedList(workspaceState);
      for (var i = 0; i < briefs.length; i += 1) {
        if (String(briefs[i].brief_id || "") === id) return briefs[i];
      }
      return null;
    }

    function ensureSelectedBriefId(workspaceState) {
      var state = workspaceState || emptyWorkspaceState();
      var selected = String(state.selectedBriefId || "").trim();
      if (selected && findBriefById(state, selected)) return selected;
      var briefs = buildVisualJobsOrderedList(state);
      return briefs.length ? String(briefs[0].brief_id || "") : "";
    }

    function refreshVisualAssetManifest(workspaceState) {
      var next = workspaceState && typeof workspaceState === "object" ? workspaceState : {};
      next.visualAssetManifest = assetsMod.buildVisualAssetManifest(
        next.compilerResult || { briefs: [] },
        next.assetsByBriefId || {}
      );
      return next;
    }

    function selectVisualJob(workspaceState, briefId) {
      var id = String(briefId || "").trim();
      if (!id) return workspaceState;
      if (!findBriefById(workspaceState, id)) return workspaceState;
      workspaceState.selectedBriefId = id;
      return workspaceState;
    }

    function toggleVisualJobPromptVisibility(workspaceState, briefId) {
      var id = String(briefId || "").trim();
      if (!id) return workspaceState;
      if (!workspaceState.humanPromptExpandedByBriefId) {
        workspaceState.humanPromptExpandedByBriefId = {};
      }
      workspaceState.humanPromptExpandedByBriefId[id] =
        workspaceState.humanPromptExpandedByBriefId[id] ? false : true;
      return workspaceState;
    }

    function attachVisualAssetToWorkspace(workspaceState, briefId, imageInput, options) {
      var brief = findBriefById(workspaceState, briefId);
      if (!brief) {
        return { ok: false, code: "unknown_brief_id", message: "Selected graphics job was not found." };
      }
      var current = workspaceState.assetsByBriefId && workspaceState.assetsByBriefId[brief.brief_id];
      var result = current
        ? assetsMod.replaceVisualAssetAssociation(current, brief, imageInput, options || {})
        : assetsMod.createVisualAssetAssociation(brief, imageInput, options || {});
      if (!result.ok) return result;
      if (!workspaceState.assetsByBriefId) workspaceState.assetsByBriefId = {};
      if (!workspaceState.assetErrorsByBriefId) workspaceState.assetErrorsByBriefId = {};
      workspaceState.assetsByBriefId[brief.brief_id] = result.asset;
      workspaceState.assetErrorsByBriefId[brief.brief_id] = "";
      refreshVisualAssetManifest(workspaceState);
      return { ok: true, asset: deepClone(result.asset) };
    }

    function removeVisualAssetFromWorkspace(workspaceState, briefId) {
      var id = String(briefId || "").trim();
      if (!workspaceState || !workspaceState.assetsByBriefId || !workspaceState.assetsByBriefId[id]) {
        return { ok: false, code: "asset_not_found" };
      }
      var existing = workspaceState.assetsByBriefId[id];
      var removed = assetsMod.removeVisualAssetAssociation(existing);
      if (!removed.ok) return removed;
      delete workspaceState.assetsByBriefId[id];
      if (!workspaceState.assetErrorsByBriefId) workspaceState.assetErrorsByBriefId = {};
      workspaceState.assetErrorsByBriefId[id] = "";
      refreshVisualAssetManifest(workspaceState);
      return { ok: true, removed: removed };
    }

    function setVideoResourceReference(workspaceState, resourceId, embedCode) {
      if (!workspaceState || !workspaceState.assembledPageSnapshot) {
        return { ok: false, code: "workspace_unavailable" };
      }
      var refs = normalizePageResourceRefsShape(workspaceState.pageResourceRefs);
      refs.video_resource_id = String(resourceId || "").trim();
      writePageResourceRefsToPage(workspaceState, refs);
      if (!workspaceState.pageResourceDrafts) workspaceState.pageResourceDrafts = {};
      workspaceState.pageResourceDrafts.videoEmbedCode = String(embedCode || "");
      return { ok: true };
    }

    function clearVideoResourceReference(workspaceState) {
      if (!workspaceState || !workspaceState.assembledPageSnapshot) {
        return { ok: false, code: "workspace_unavailable" };
      }
      var refs = normalizePageResourceRefsShape(workspaceState.pageResourceRefs);
      refs.video_resource_id = "";
      writePageResourceRefsToPage(workspaceState, refs);
      return { ok: true };
    }

    function setAdditionalResourcesIntro(workspaceState, introText) {
      if (!workspaceState || !workspaceState.assembledPageSnapshot) {
        return { ok: false, code: "workspace_unavailable" };
      }
      var refs = normalizePageResourceRefsShape(workspaceState.pageResourceRefs);
      refs.additional_resources_intro = String(introText == null ? "" : introText);
      writePageResourceRefsToPage(workspaceState, refs);
      if (!workspaceState.pageResourceDrafts) workspaceState.pageResourceDrafts = {};
      workspaceState.pageResourceDrafts.resourceIntroText = refs.additional_resources_intro;
      return { ok: true };
    }

    function addAdditionalResourceReference(workspaceState, resourceId, linkText) {
      if (!workspaceState || !workspaceState.assembledPageSnapshot) {
        return { ok: false, code: "workspace_unavailable" };
      }
      var rid = String(resourceId || "").trim();
      var text = String(linkText || "").trim();
      if (!rid || !text) return { ok: false, code: "invalid_reference" };
      var refs = normalizePageResourceRefsShape(workspaceState.pageResourceRefs);
      refs.additional_resources.push({
        resource_id: rid,
        link_text: text,
        order: refs.additional_resources.length
      });
      writePageResourceRefsToPage(workspaceState, refs);
      return { ok: true };
    }

    function removeAdditionalResourceReference(workspaceState, resourceId) {
      if (!workspaceState || !workspaceState.assembledPageSnapshot) {
        return { ok: false, code: "workspace_unavailable" };
      }
      var rid = String(resourceId || "").trim();
      var refs = normalizePageResourceRefsShape(workspaceState.pageResourceRefs);
      refs.additional_resources = refs.additional_resources
        .filter(function (row) {
          return row.resource_id !== rid;
        })
        .map(function (row, idx) {
          return {
            resource_id: row.resource_id,
            link_text: row.link_text,
            order: idx
          };
        });
      writePageResourceRefsToPage(workspaceState, refs);
      return { ok: true };
    }

    function moveAdditionalResourceReference(workspaceState, resourceId, direction) {
      if (!workspaceState || !workspaceState.assembledPageSnapshot) {
        return { ok: false, code: "workspace_unavailable" };
      }
      var rid = String(resourceId || "").trim();
      var refs = normalizePageResourceRefsShape(workspaceState.pageResourceRefs);
      var idx = refs.additional_resources.findIndex(function (row) {
        return row.resource_id === rid;
      });
      if (idx < 0) return { ok: false, code: "reference_not_found" };
      var nextIdx = direction === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= refs.additional_resources.length) {
        return { ok: false, code: "move_out_of_bounds" };
      }
      var tmp = refs.additional_resources[idx];
      refs.additional_resources[idx] = refs.additional_resources[nextIdx];
      refs.additional_resources[nextIdx] = tmp;
      refs.additional_resources = refs.additional_resources.map(function (row, rowIdx) {
        return { resource_id: row.resource_id, link_text: row.link_text, order: rowIdx };
      });
      writePageResourceRefsToPage(workspaceState, refs);
      return { ok: true };
    }

    function issueFingerprint(issue) {
      if (!issue || typeof issue !== "object") return String(issue || "");
      return [
        issue.code || "",
        issue.path || "",
        typeof issue.index === "number" ? String(issue.index) : "",
        issue.affordance_id || "",
        issue.field || "",
        issue.message || ""
      ].join("\u0001");
    }

    function filterDistinctIssues(issues, excludeFingerprints) {
      var exclude = excludeFingerprints || {};
      var seen = {};
      var out = [];
      (issues || []).forEach(function (issue) {
        var key = issueFingerprint(issue);
        if (exclude[key] || seen[key]) return;
        seen[key] = true;
        out.push(issue);
      });
      return out;
    }

    function buildStageErrorPresentation(workspaceState) {
      var summary = buildWorkspaceSummary(workspaceState);
      var contract = (workspaceState && workspaceState.contractResult) || {};
      var planner = (workspaceState && workspaceState.plannerResult) || {};
      var compiler = (workspaceState && workspaceState.compilerResult) || {};
      var contractErrors = Array.isArray(contract.errors) ? contract.errors : [];
      var plannerErrors = Array.isArray(planner.errors) ? planner.errors : [];
      var compilerErrors = Array.isArray(compiler.errors) ? compiler.errors : [];
      var contractFingerprints = {};
      contractErrors.forEach(function (issue) {
        contractFingerprints[issueFingerprint(issue)] = true;
      });
      var plannerDistinct = filterDistinctIssues(plannerErrors, contractFingerprints);
      var plannerFingerprints = Object.assign({}, contractFingerprints);
      plannerDistinct.forEach(function (issue) {
        plannerFingerprints[issueFingerprint(issue)] = true;
      });
      var compilerDistinct = filterDistinctIssues(compilerErrors, plannerFingerprints);

      var presentation = {
        contractErrors: contractErrors,
        plannerErrors: [],
        compilerErrors: [],
        plannerBlockedMessage: "",
        compilerBlockedMessage: ""
      };

      if (contract.valid === false) {
        presentation.plannerBlockedMessage =
          "Not run because the visual-planning contract is invalid.";
        presentation.compilerBlockedMessage =
          "Not run because no valid visual-job plan is available.";
        return presentation;
      }

      presentation.plannerErrors = plannerDistinct;
      if (planner.valid === false) {
        presentation.compilerBlockedMessage =
          "Not run because no valid visual-job plan is available.";
        return presentation;
      }

      presentation.compilerErrors = compilerDistinct;
      return presentation;
    }

    function summaryHasVisibleContent(summary) {
      if (!summary) return false;
      if (summary.status === "zero_generate_jobs") return true;
      if (summary.promptCount) return true;
      if (summary.activityScoped) return true;
      if (summary.pageScoped) return true;
      if (summary.deferredCount) return true;
      if (summary.skippedCount) return true;
      if (summary.partialCompilation) return true;
      return false;
    }

    function buildVisualJobsWorkspaceViewModel(workspaceState) {
      var summary = buildWorkspaceSummary(workspaceState);
      var compiler = (workspaceState && workspaceState.compilerResult) || {};
      var contract = (workspaceState && workspaceState.contractResult) || {};
      var planner = (workspaceState && workspaceState.plannerResult) || {};
      var briefs = buildVisualJobsOrderedList(workspaceState);
      var stageErrors = buildStageErrorPresentation(workspaceState);
      var selectedBriefId = ensureSelectedBriefId(workspaceState);
      var selectedBrief = findBriefById(workspaceState, selectedBriefId);
      var selectedPresentation = selectedBrief
        ? buildVisualJobPresentation(selectedBrief, briefs.indexOf(selectedBrief))
        : null;
      var assetsByBriefId = (workspaceState && workspaceState.assetsByBriefId) || {};
      var pageRefs = normalizePageResourceRefsShape(
        workspaceState && workspaceState.pageResourceRefs
      );
      var attachedCount = 0;
      var listItems = briefs.map(function (brief, index) {
        var asset = assetsByBriefId[brief.brief_id] || null;
        if (asset) attachedCount += 1;
        return {
          index: index,
          brief_id: brief.brief_id,
          location_label: formatBriefLocation(brief),
          title: buildDisplayTitle(brief),
          representation_label: humanizeRepresentation(brief.preferred_representation),
          status: asset ? "image_attached" : "needs_image"
        };
      });
      return {
        workspaceState: workspaceState || null,
        summary: summary,
        status: summary.status,
        briefCards: briefs.map(buildBriefCardViewModel),
        orderedBriefItems: listItems,
        selectedBriefId: selectedBriefId,
        selectedBrief: selectedPresentation,
        selectedAsset: selectedBrief ? assetsByBriefId[selectedBrief.brief_id] || null : null,
        selectedAssetError:
          selectedBrief &&
          workspaceState &&
          workspaceState.assetErrorsByBriefId &&
          workspaceState.assetErrorsByBriefId[selectedBrief.brief_id]
            ? String(workspaceState.assetErrorsByBriefId[selectedBrief.brief_id])
            : "",
        selectedPlacementStatus:
          selectedBrief &&
          workspaceState &&
          workspaceState.rendererPlacementByBriefId &&
          workspaceState.rendererPlacementByBriefId[selectedBrief.brief_id]
            ? deepClone(workspaceState.rendererPlacementByBriefId[selectedBrief.brief_id])
            : null,
        learnerPreviewRefreshStatus:
          workspaceState && workspaceState.learnerPreviewRefreshStatus
            ? String(workspaceState.learnerPreviewRefreshStatus)
            : "",
        previewRevision:
          workspaceState && typeof workspaceState.previewRevision === "number"
            ? workspaceState.previewRevision
            : 0,
        attachedCount: attachedCount,
        contractErrors: stageErrors.contractErrors,
        contractWarnings: Array.isArray(contract.warnings) ? contract.warnings : [],
        plannerErrors: stageErrors.plannerErrors,
        plannerWarnings: Array.isArray(planner.warnings) ? planner.warnings : [],
        compilerErrors: stageErrors.compilerErrors,
        compilerWarnings: Array.isArray(compiler.warnings) ? compiler.warnings : [],
        plannerBlockedMessage: stageErrors.plannerBlockedMessage,
        compilerBlockedMessage: stageErrors.compilerBlockedMessage,
        deferred: (planner.diagnostics && planner.diagnostics.deferred) || [],
        skipped: (planner.diagnostics && planner.diagnostics.skipped) || [],
        activeView:
          workspaceState &&
          (workspaceState.activeView === OUTPUT_VIEWS.visual_jobs ||
            workspaceState.activeView === OUTPUT_VIEWS.video ||
            workspaceState.activeView === OUTPUT_VIEWS.resources)
            ? workspaceState.activeView
            : OUTPUT_VIEWS.learner_page,
        briefCount: briefs.length,
        pageResourceRefs: pageRefs,
        pageResourceDrafts:
          (workspaceState && workspaceState.pageResourceDrafts) || {
            videoTitle: "Video",
            videoIntroText: "",
            resourceIntroText: "",
            resourceLinkText: "",
            videoEmbedCode: ""
          },
        additionalResourceProjection:
          (workspaceState && workspaceState.additionalResourceProjection) || {
            intro_text: "",
            items: [],
            diagnostics: []
          },
        videoResourceProjection:
          (workspaceState && workspaceState.videoResourceProjection) || {
            resource_id: "",
            section_title: "Video",
            intro_text: "",
            embed_code: ""
          },
        visualAssetManifest:
          (workspaceState && workspaceState.visualAssetManifest) ||
          assetsMod.buildVisualAssetManifest(compiler, assetsByBriefId)
      };
    }

    function renderListItems(items, emptyLabel) {
      if (!items || !items.length) {
        return "<li class=\"util-vj-muted\">" + escapeHtml(emptyLabel || "None") + "</li>";
      }
      return items
        .map(function (item) {
          if (item && typeof item === "object" && item.text) {
            var prefix = item.kind ? humanizeToken(item.kind) + ": " : "";
            return "<li><span class=\"util-vj-derived-label\">" + escapeHtml(prefix) + "</span>" + escapeHtml(item.text) + "</li>";
          }
          return "<li>" + escapeHtml(String(item)) + "</li>";
        })
        .join("");
    }

    function renderStructuredIssue(issue) {
      var title =
        issue.title ||
        (issue.field === "learner_stage"
          ? "Invalid learner stage"
          : issue.code
            ? humanizeToken(String(issue.code).replace(/^VPC_/, "").replace(/_/g, " "))
            : "Validation error");
      var parts = [
        '<li class="util-vj-issue">',
        '<p class="util-vj-issue-title"><strong>' + escapeHtml(title) + "</strong></p>"
      ];
      if (issue.affordance_id) {
        parts.push("<p>Affordance: " + escapeHtml(String(issue.affordance_id)) + "</p>");
      }
      if (issue.field) {
        parts.push("<p>Field: " + escapeHtml(String(issue.field)) + "</p>");
      }
      if (Array.isArray(issue.allowed_values) && issue.allowed_values.length) {
        parts.push(
          "<p>Allowed values: " + escapeHtml(issue.allowed_values.join(", ")) + "</p>"
        );
      }
      if (issue.code) {
        parts.push(
          '<p>Code: <code class="util-vj-code">' + escapeHtml(String(issue.code)) + "</code></p>"
        );
      }
      if (issue.message && !(issue.field && /learner_stage must be/i.test(issue.message))) {
        parts.push('<p class="util-vj-muted">' + escapeHtml(String(issue.message)) + "</p>");
      } else if (issue.message && issue.field === "learner_stage") {
        // Field + allowed values already convey the constraint; keep path for location.
        if (issue.path) {
          parts.push('<p class="util-vj-muted">' + escapeHtml(String(issue.path)) + "</p>");
        }
      }
      parts.push("</li>");
      return parts.join("");
    }

    function renderIssueList(issues, cssClass) {
      if (!issues || !issues.length) return "";
      return (
        '<ul class="util-vj-issue-list ' +
        escapeHtml(cssClass || "") +
        '">' +
        issues.map(renderStructuredIssue).join("") +
        "</ul>"
      );
    }

    function renderBlockedStageMessage(message) {
      if (!message) return "";
      return '<p class="util-vj-blocked">' + escapeHtml(message) + "</p>";
    }

    function renderCompactList(label, items) {
      if (!items || !items.length) return "";
      return (
        '<div class="util-vj-checks">' +
        "<h5>" +
        escapeHtml(label) +
        "</h5>" +
        "<ul>" +
        items
          .map(function (item) {
            return "<li>" + escapeHtml(String(item)) + "</li>";
          })
          .join("") +
        "</ul></div>"
      );
    }

    function renderBriefCard(card) {
      var evidenceHtml = card.source_evidence
        .map(function (src) {
          var text =
            typeof src.content_text === "string"
              ? src.content_text
              : typeof src.content === "string"
                ? src.content
                : "";
          var clipped = String(text).replace(/\s+/g, " ").trim();
          return (
            '<div class="util-vj-evidence-item">' +
            "<div><strong>" +
            escapeHtml(src.anchor || "") +
            "</strong> · " +
            escapeHtml(humanizeSourceKind(src.source_kind)) +
            "</div>" +
            '<div class="util-vj-evidence-text">' +
            escapeHtml(clipped || "(structured content)") +
            "</div>" +
            (src.content && typeof src.content === "object"
              ? "<pre class=\"util-vj-mini-pre\">" +
                escapeHtml(JSON.stringify(src.content, null, 2)) +
                "</pre>"
              : "") +
            "</div>"
          );
        })
        .join("");

      return (
        '<article class="util-vj-card" data-brief-id="' +
        escapeHtml(card.brief_id) +
        '">' +
        '<header class="util-vj-card-header">' +
        "<h4>" +
        escapeHtml(card.location_label) +
        "</h4>" +
        '<p class="util-vj-representation">' +
        escapeHtml(card.representation_label) +
        "</p>" +
        "</header>" +
        '<p class="util-vj-card-title">' +
        escapeHtml(card.title || "") +
        "</p>" +
        '<p class="util-vj-rendered-note">Rendered image required</p>' +
        (card.purpose_text
          ? '<p class="util-vj-card-purpose">' + escapeHtml(card.purpose_text) + "</p>"
          : "") +
        '<div class="util-vj-field util-vj-prompt-field">' +
        "<h5>Image prompt</h5>" +
        '<pre class="util-vj-human-prompt" id="util-vj-human-prompt-' +
        escapeHtml(card.brief_id) +
        '">' +
        escapeHtml(card.human_prompt || "") +
        "</pre>" +
        '<button type="button" class="btn util-vj-copy-btn" data-copy-brief-id="' +
        escapeHtml(card.brief_id) +
        '" data-copy-kind="human" aria-label="Copy human prompt for ' +
        escapeHtml(card.location_label) +
        '">Copy Prompt</button>' +
        "</div>" +
        renderCompactList("Include", card.include_items) +
        renderCompactList("Avoid", card.avoid_items) +
        '<details class="util-vj-details util-vj-debug-details">' +
        "<summary>Developer and debug details</summary>" +
        '<div class="util-vj-details-body">' +
        "<h6>Canonical prompt</h6>" +
        '<pre class="util-vj-canonical-prompt">' +
        escapeHtml(card.generation_instruction || "") +
        "</pre>" +
        '<button type="button" class="btn util-vj-copy-btn util-vj-copy-canonical-btn" data-copy-brief-id="' +
        escapeHtml(card.brief_id) +
        '" data-copy-kind="canonical" aria-label="Copy canonical prompt for ' +
        escapeHtml(card.location_label) +
        '">Copy Canonical Prompt</button>' +
        "<h6>Requirements and safeguards</h6>" +
        "<p class=\"util-vj-derived-label\">Authored required content</p><ul>" +
        renderListItems(card.must_show, "No authored required content") +
        "</ul>" +
        (card.derived_requirements && card.derived_requirements.length
          ? "<p class=\"util-vj-derived-label\">Derived educational requirements</p><ul>" +
            renderListItems(card.derived_requirements, "") +
            "</ul>"
          : "") +
        "<p class=\"util-vj-derived-label\">Authored exclusions</p><ul>" +
        renderListItems(card.must_not_show, "No authored exclusions") +
        "</ul>" +
        "<p class=\"util-vj-derived-label\">Representation exclusions</p><ul>" +
        renderListItems(card.representation_avoid, "No representation exclusions") +
        "</ul>" +
        "<p class=\"util-vj-derived-label\">Allowed claims</p><ul>" +
        renderListItems(card.allowed_claims, "No explicit allowed claims") +
        "</ul>" +
        "<p class=\"util-vj-derived-label\">Disallowed claims</p><ul>" +
        renderListItems(card.disallowed_claims, "No disallowed claims") +
        "</ul>" +
        "<p class=\"util-vj-derived-label\">Spoiler safety</p><p>anti_spoiler: " +
        escapeHtml(String(!!card.anti_spoiler)) +
        "</p>" +
        (card.spoiler_boundary
          ? "<pre class=\"util-vj-mini-pre\">" +
            escapeHtml(JSON.stringify(card.spoiler_boundary, null, 2)) +
            "</pre>"
          : '<p class="util-vj-muted">No spoiler boundary</p>') +
        (card.learner_stage
          ? "<p>learner_stage: " + escapeHtml(String(card.learner_stage)) + "</p>"
          : "") +
        "<p class=\"util-vj-derived-label\">Discipline</p><p>" +
        escapeHtml(String(card.discipline_risk_level || "(none)")) +
        "</p><p>" +
        escapeHtml(String(card.canonical_note || "No discipline note")) +
        "</p>" +
        "<p class=\"util-vj-derived-label\">Caption intent</p><p>" +
        escapeHtml(String(card.caption_intent || "No caption guidance")) +
        "</p>" +
        "<p class=\"util-vj-derived-label\">Learner alt text</p><p>" +
        escapeHtml(String(card.alt_text || "No alt_text authored")) +
        "</p>" +
        "<p class=\"util-vj-derived-label\">Detailed description</p><p>" +
        escapeHtml(String(card.detailed_description || "No detailed_description authored")) +
        "</p>" +
        "<h6>Evidence</h6>" +
        (evidenceHtml || '<p class="util-vj-muted">No evidence records</p>') +
        "<h6>Technical identity</h6>" +
        "<p>brief_id: " +
        escapeHtml(card.brief_id || "") +
        "</p><p>job_id: " +
        escapeHtml(card.job_id || "") +
        "</p><p>affordance_id: " +
        escapeHtml(card.affordance_id || "") +
        "</p><p>schema_version: " +
        escapeHtml(String(card.schema_version || "")) +
        "</p><p>planner_version: " +
        escapeHtml(String(card.planner_version || "")) +
        "</p><p>compiler_version: " +
        escapeHtml(String(card.compiler_version || "")) +
        "</p><p>visual_slot: " +
        escapeHtml(card.visual_slot || "") +
        "</p><p>representation: " +
        escapeHtml(card.representationToken || "") +
        "</p>" +
        (card.activity_id ? "<p>activity_id: " + escapeHtml(card.activity_id) + "</p>" : "") +
        "<h6>Provenance and passthrough</h6>" +
        "<pre class=\"util-vj-mini-pre\">" +
        escapeHtml(
          JSON.stringify(
            { provenance: card.provenance, authored_passthrough: card.authored_passthrough },
            null,
            2
          )
        ) +
        "</pre>" +
        "<h6>Diagnostics</h6>" +
        "<p>prompt_length_class: " +
        escapeHtml(String(card.prompt_length_class || "")) +
        "</p>" +
        (card.prompt_quality_diagnostics
          ? "<pre class=\"util-vj-mini-pre\">" +
            escapeHtml(JSON.stringify(card.prompt_quality_diagnostics, null, 2)) +
            "</pre>"
          : "") +
        (card.prompt_length_class === "unusually_long"
          ? '<p class="util-vj-warning">Human prompt is unusually long. Copy remains available in full.</p>'
          : "") +
        "</div></details>" +
        "</article>"
      );
    }

    function renderPipelineDetails(workspaceState, vm) {
      if (
        vm.status === "no_assembled_page" ||
        vm.status === "legacy_no_planning" ||
        vm.status === "contract_invalid"
      ) {
        return "";
      }
      var contract = (workspaceState && workspaceState.contractResult) || {};
      var planner = (workspaceState && workspaceState.plannerResult) || {};
      var compiler = (workspaceState && workspaceState.compilerResult) || {};
      var parts = [
        '<details class="util-vj-details util-vj-pipeline-details"><summary>Pipeline details</summary><div class="util-vj-details-body">',
        "<p>contract valid: " + escapeHtml(String(!!contract.valid)) + "</p>",
        "<p>planner valid: " + escapeHtml(String(!!planner.valid)) + "</p>",
        "<p>compiler valid: " + escapeHtml(String(!!compiler.valid)) + "</p>",
        "<p>schema_version: " +
          escapeHtml(String(contract.schema_version || planner.schema_version || "")) +
          "</p>"
      ];
      if (planner.planner_version) {
        parts.push("<p>planner_version: " + escapeHtml(String(planner.planner_version)) + "</p>");
      }
      if (compiler.compiler_version) {
        parts.push("<p>compiler_version: " + escapeHtml(String(compiler.compiler_version)) + "</p>");
      }
      if (vm.contractWarnings.length) {
        parts.push("<h6>Contract warnings</h6>", renderIssueList(vm.contractWarnings, "is-warning"));
      }
      if (vm.plannerWarnings.length) {
        parts.push("<h6>Planner warnings</h6>", renderIssueList(vm.plannerWarnings, "is-warning"));
      }
      if (vm.compilerWarnings.length) {
        parts.push("<h6>Compiler warnings</h6>", renderIssueList(vm.compilerWarnings, "is-warning"));
      }
      if (vm.summary.partialCompilation) {
        parts.push(
          '<p class="util-vj-warning">Partial compilation: some graphics jobs could not be compiled.</p>'
        );
      }
      parts.push("</div></details>");
      return parts.join("");
    }

    function renderWorkspaceSummary(vm) {
      if (!summaryHasVisibleContent(vm.summary)) return "";
      var parts = ['<div class="util-vj-summary">'];
      if (vm.status === "zero_generate_jobs") {
        parts.push("<p><strong>No external images are required for this page.</strong></p>");
      } else if (vm.summary.promptCount) {
        parts.push(
          "<p><strong>" +
            escapeHtml(String(vm.summary.promptCount)) +
            "</strong> image prompt" +
            (vm.summary.promptCount === 1 ? "" : "s") +
            "</p>"
        );
      }
      var meta = [];
      if (vm.summary.activityScoped) {
        meta.push(
          escapeHtml(String(vm.summary.activityScoped)) +
            " activity visual" +
            (vm.summary.activityScoped === 1 ? "" : "s")
        );
      }
      if (vm.summary.pageScoped) {
        meta.push(
          escapeHtml(String(vm.summary.pageScoped)) +
            " page visual" +
            (vm.summary.pageScoped === 1 ? "" : "s")
        );
      }
      if (vm.summary.deferredCount) {
        meta.push(escapeHtml(String(vm.summary.deferredCount)) + " deferred");
      }
      if (vm.summary.skippedCount) {
        meta.push(escapeHtml(String(vm.summary.skippedCount)) + " skipped");
      }
      if (meta.length) {
        parts.push('<p class="util-vj-summary-meta">' + meta.join(" · ") + "</p>");
      }
      if (vm.summary.partialCompilation && vm.status !== "success") {
        parts.push(
          '<p class="util-vj-warning"><strong>Some graphics jobs could not be compiled.</strong></p>'
        );
      }
      parts.push("</div>");
      return parts.join("");
    }

    function renderVisualJobStatusLabel(status) {
      if (status === "image_attached") return "Image attached";
      return "Needs image";
    }

    function renderVideoAndResourcesAuthoring(vm) {
      var refs = vm.pageResourceRefs || {
        video_resource_id: "",
        video_section_title: "Video",
        video_intro_text: "",
        additional_resources_intro: "",
        additional_resources: []
      };
      var drafts = vm.pageResourceDrafts || {};
      var projection = vm.additionalResourceProjection || { items: [] };
      var projectionById = Object.create(null);
      (projection.items || []).forEach(function (row) {
        if (row && row.resource_id) projectionById[String(row.resource_id)] = row;
      });
      var resourceItems = (refs.additional_resources || [])
        .map(function (row, idx) {
          var meta = projectionById[row.resource_id] || {};
          return (
            '<li class="util-vj-page-resource-item">' +
            '<div><strong>' +
            escapeHtml(row.link_text) +
            "</strong></div>" +
            '<div class="util-vj-muted">' +
            escapeHtml(String(meta.filename || "")) +
            (meta.mime_type ? " · " + escapeHtml(String(meta.mime_type)) : "") +
            (meta.byte_size ? " · " + escapeHtml(String(meta.byte_size)) + " bytes" : "") +
            "</div>" +
            '<div class="util-vj-actions">' +
            '<button type="button" class="btn ghost" data-resource-move-dir="up" data-resource-ref-id="' +
            escapeHtml(row.resource_id) +
            '"' +
            (idx === 0 ? " disabled" : "") +
            ">Move up</button>" +
            '<button type="button" class="btn ghost" data-resource-move-dir="down" data-resource-ref-id="' +
            escapeHtml(row.resource_id) +
            '"' +
            (idx === refs.additional_resources.length - 1 ? " disabled" : "") +
            ">Move down</button>" +
            '<button type="button" class="btn ghost" data-remove-resource-ref-id="' +
            escapeHtml(row.resource_id) +
            '">Remove</button>' +
            "</div>" +
            "</li>"
          );
        })
        .join("");
      var view = vm.activeView || OUTPUT_VIEWS.visual_jobs;
      if (view === OUTPUT_VIEWS.video) {
        return (
          '<section class="util-vj-page-resource-authoring util-vj-authoring-form">' +
          "<h4>Video</h4>" +
          '<p class="util-vj-muted">One video permitted. Paste provider-supplied embed code.</p>' +
          '<div class="util-vj-form-field">' +
          '<label for="util-vj-video-title">Section title</label>' +
          '<input id="util-vj-video-title" type="text" class="util-vj-form-control" data-video-title-input data-draft-field="videoTitle" placeholder="Video" value="' +
          escapeHtml(String(drafts.videoTitle != null ? drafts.videoTitle : refs.video_section_title || "Video")) +
          '" />' +
          "</div>" +
          '<div class="util-vj-form-field">' +
          '<label for="util-vj-video-intro">Introductory paragraph (optional)</label>' +
          '<textarea id="util-vj-video-intro" class="util-vj-form-control util-vj-form-control--textarea" data-video-intro-input data-draft-field="videoIntroText" rows="3" placeholder="Optional context shown before the embed.">' +
          escapeHtml(String(drafts.videoIntroText != null ? drafts.videoIntroText : refs.video_intro_text || "")) +
          "</textarea>" +
          "</div>" +
          '<div class="util-vj-form-field">' +
          '<label for="util-vj-video-embed">Embed code</label>' +
          '<textarea id="util-vj-video-embed" class="util-vj-form-control util-vj-form-control--embed" data-video-embed-input data-draft-field="videoEmbedCode" rows="10" placeholder="Paste provider embed code here...">' +
          escapeHtml(
            String(
              drafts.videoEmbedCode != null && String(drafts.videoEmbedCode).length
                ? drafts.videoEmbedCode
                : (vm.videoResourceProjection && vm.videoResourceProjection.embed_code) || ""
            )
          ) +
          "</textarea>" +
          "</div>" +
          '<div class="util-vj-actions">' +
          '<button type="button" class="btn" data-save-video-embed>Save Video</button>' +
          '<button type="button" class="btn ghost" data-remove-video-embed' +
          (refs.video_resource_id ? "" : " disabled") +
          ">Remove Video</button>" +
          "</div>" +
          "</section>"
        );
      }
      if (view === OUTPUT_VIEWS.resources) {
        return (
          '<section class="util-vj-page-resource-authoring util-vj-authoring-form">' +
          "<h4>Resources</h4>" +
          '<div class="util-vj-form-field">' +
          '<label for="util-vj-resource-intro">Introductory paragraph (optional)</label>' +
          '<textarea id="util-vj-resource-intro" class="util-vj-form-control util-vj-form-control--textarea" data-resource-intro-input data-draft-field="resourceIntroText" rows="3" placeholder="Optional introductory paragraph shown before links.">' +
          escapeHtml(
            String(drafts.resourceIntroText != null ? drafts.resourceIntroText : refs.additional_resources_intro || "")
          ) +
          "</textarea>" +
          "</div>" +
          '<div class="util-vj-actions"><button type="button" class="btn" data-save-resource-intro>Save Intro</button></div>' +
          '<div class="util-vj-form-field util-vj-resource-add-block">' +
          '<label>Add resource</label>' +
          '<div class="util-vj-resource-add-row">' +
          '<label class="btn util-vj-choose-resource">Choose file<input type="file" class="util-vj-file-input" data-resource-file-input /></label>' +
          '<input type="text" class="util-vj-form-control util-vj-resource-link-text" data-resource-link-text-input data-draft-field="resourceLinkText" placeholder="Learner-facing link text" value="' +
          escapeHtml(String(drafts.resourceLinkText || "")) +
          '" aria-label="Learner-facing link text" />' +
          '<button type="button" class="btn" data-add-resource-ref>Add Resource</button>' +
          "</div>" +
          "</div>" +
          (resourceItems
            ? '<ol class="util-vj-page-resource-list">' + resourceItems + "</ol>"
            : '<p class="util-vj-muted">No additional resources added.</p>') +
          "</section>"
        );
      }
      return "";
    }

    function renderVisualJobsListPane(vm) {
      var parts = [
        '<section class="util-vj-pane util-vj-pane-list" aria-label="Graphics to create">',
        "<h4>Images to create</h4>",
        '<p class="util-vj-progress">' +
          escapeHtml(String(vm.attachedCount || 0)) +
          " of " +
          escapeHtml(String(vm.briefCount || 0)) +
          " images attached</p>",
        '<div class="util-vj-list" role="listbox" aria-label="Graphics jobs">'
      ];
      (vm.orderedBriefItems || []).forEach(function (item) {
        var selected = String(item.brief_id) === String(vm.selectedBriefId || "");
        parts.push(
          '<button type="button" class="util-vj-list-item' +
            (selected ? " is-selected" : "") +
            '" role="option" aria-selected="' +
            (selected ? "true" : "false") +
            '" data-brief-select-id="' +
            escapeHtml(item.brief_id) +
            '">' +
            '<span class="util-vj-list-item-head">' +
            escapeHtml(item.location_label) +
            "</span>" +
            '<span class="util-vj-list-item-title">' +
            escapeHtml(item.title || "") +
            "</span>" +
            '<span class="util-vj-list-item-rep">' +
            escapeHtml(item.representation_label || "") +
            "</span>" +
            '<span class="util-vj-list-item-status" data-status="' +
            escapeHtml(item.status) +
            '">' +
            (item.status === "image_attached" ? "✓ " : "○ ") +
            escapeHtml(renderVisualJobStatusLabel(item.status)) +
            "</span>" +
            "</button>"
        );
      });
      parts.push("</div></section>");
      return parts.join("");
    }

    function renderSelectedAssetInfo(vm) {
      if (!vm.selectedAsset) {
        return '<p class="util-vj-empty-image">No image attached.</p>';
      }
      var asset = vm.selectedAsset;
      var previewSrc =
        (asset.preview_source && asset.preview_source.value) ||
        (asset.render_source && asset.render_source.value) ||
        "";
      return (
        '<figure class="util-vj-image-preview">' +
        '<img src="' +
        escapeHtml(previewSrc) +
        '" alt="' +
        escapeHtml(asset.alt_text || "") +
        '" class="util-vj-image-preview-img" />' +
        '<figcaption class="util-vj-image-meta">' +
        escapeHtml(asset.filename || "") +
        " · " +
        escapeHtml(String(asset.width || 0)) +
        "×" +
        escapeHtml(String(asset.height || 0)) +
        " · " +
        escapeHtml(String(asset.mime_type || "")) +
        "</figcaption>" +
        "</figure>"
      );
    }

    function renderSelectedJobPane(vm) {
      var card = vm.selectedBrief;
      if (!card) {
        return '<section class="util-vj-pane util-vj-pane-detail"><p class="util-vj-empty">Select a graphics job.</p></section>';
      }
      var promptExpanded =
        !!(
          vm &&
          vm.selectedBriefId &&
          vm.workspaceState &&
          vm.workspaceState.humanPromptExpandedByBriefId &&
          vm.workspaceState.humanPromptExpandedByBriefId[vm.selectedBriefId]
        );
      var evidenceHtml = card.source_evidence
        .map(function (src) {
          return (
            '<div class="util-vj-evidence-item"><div><strong>' +
            escapeHtml(src.anchor || "") +
            "</strong> · " +
            escapeHtml(humanizeSourceKind(src.source_kind)) +
            "</div></div>"
          );
        })
        .join("");
      function sanitizeAssetForDebug(asset) {
        if (!asset || typeof asset !== "object") return null;
        var clone = deepClone(asset);
        if (
          clone.render_source &&
          clone.render_source.kind === "data_url" &&
          typeof clone.render_source.value === "string"
        ) {
          clone.render_source.value =
            "[data-url-hidden length=" + String(clone.render_source.value.length) + "]";
        }
        if (
          clone.preview_source &&
          clone.preview_source.kind === "data_url" &&
          typeof clone.preview_source.value === "string"
        ) {
          clone.preview_source.value =
            "[data-url-hidden length=" + String(clone.preview_source.value.length) + "]";
        }
        return clone;
      }
      function sanitizeManifestForDebug(manifest) {
        var m = deepClone(manifest || {});
        if (Array.isArray(m.assets)) {
          m.assets = m.assets.map(function (asset) {
            return sanitizeAssetForDebug(asset);
          });
        }
        return m;
      }
      var parts = [
        '<section class="util-vj-pane util-vj-pane-detail" aria-label="Selected image job">',
        "<h4>Selected image job</h4>",
        '<p class="util-vj-card-title">' + escapeHtml(card.location_label) + "</p>",
        '<p class="util-vj-card-title">' + escapeHtml(card.title || "") + "</p>",
        '<p class="util-vj-representation">' + escapeHtml(card.representation_label || "") + "</p>",
        '<p class="util-vj-rendered-note">Rendered image required</p>',
        card.purpose_text ? '<p class="util-vj-card-purpose">' + escapeHtml(card.purpose_text) + "</p>" : "",
        '<div class="util-vj-actions"><button type="button" class="btn util-vj-copy-btn" data-copy-kind="human" data-copy-brief-id="' +
          escapeHtml(card.brief_id) +
          '" aria-label="Copy human prompt for ' +
          escapeHtml(card.location_label) +
          '">Copy Prompt</button>' +
          '<button type="button" class="btn" data-toggle-prompt-brief-id="' +
          escapeHtml(card.brief_id) +
          '">' +
          (promptExpanded ? "Hide Prompt" : "Show Prompt") +
          "</button>" +
          '<button type="button" class="btn" data-view-learner-page="1">View in Learner Page</button></div>',
        promptExpanded
          ? '<pre class="util-vj-human-prompt" id="util-vj-human-prompt-' +
            escapeHtml(card.brief_id) +
            '">' +
            escapeHtml(card.human_prompt || "") +
            "</pre>"
          : "",
        '<div class="util-vj-dropzone" tabindex="0" data-image-dropzone-brief-id="' +
          escapeHtml(card.brief_id) +
          '">' +
          "<p>Drag an image here</p><p>Paste an image</p>" +
          '<label class="btn util-vj-choose-image">Choose image<input type="file" accept="image/png,image/jpeg,image/webp" class="util-vj-file-input" data-image-file-input-brief-id="' +
          escapeHtml(card.brief_id) +
          '" /></label></div>',
        vm.selectedAssetError
          ? '<p class="util-vj-warning" role="alert">' + escapeHtml(vm.selectedAssetError) + "</p>"
          : "",
        renderSelectedAssetInfo(vm),
        vm.selectedAsset
          ? '<div class="util-vj-actions"><button type="button" class="btn" data-replace-image-brief-id="' +
            escapeHtml(card.brief_id) +
            '">Replace image</button><button type="button" class="btn ghost" data-remove-image-brief-id="' +
            escapeHtml(card.brief_id) +
            '">Remove image</button></div>'
          : "",
        '<details class="util-vj-details util-vj-debug-details"><summary>Developer and debug details</summary><div class="util-vj-details-body">',
        "<h6>Human prompt</h6>",
        '<pre class="util-vj-human-prompt">' + escapeHtml(card.human_prompt || "") + "</pre>",
        "<h6>Canonical prompt</h6>",
        '<pre class="util-vj-canonical-prompt">' + escapeHtml(card.generation_instruction || "") + "</pre>",
        '<button type="button" class="btn util-vj-copy-btn util-vj-copy-canonical-btn" data-copy-kind="canonical" data-copy-brief-id="' +
          escapeHtml(card.brief_id) +
          '" aria-label="Copy canonical prompt for ' +
          escapeHtml(card.location_label) +
          '">Copy Canonical Prompt</button>',
        "<h6>Evidence</h6>",
        evidenceHtml || '<p class="util-vj-muted">No evidence records</p>',
        "<h6>Asset association metadata</h6>",
        vm.selectedAsset
          ? '<pre class="util-vj-mini-pre">' +
            escapeHtml(JSON.stringify(sanitizeAssetForDebug(vm.selectedAsset), null, 2)) +
            "</pre>"
          : '<p class="util-vj-muted">No asset attached</p>',
        "<h6>Manifest entry</h6>",
        '<pre class="util-vj-mini-pre">' +
          escapeHtml(JSON.stringify(sanitizeManifestForDebug(vm.visualAssetManifest || {}), null, 2)) +
          "</pre>",
        "<h6>Renderer placement status</h6>",
        vm.selectedPlacementStatus
          ? '<pre class="util-vj-mini-pre">' +
            escapeHtml(JSON.stringify(vm.selectedPlacementStatus, null, 2)) +
            "</pre>"
          : '<p class="util-vj-muted">No placement status yet.</p>',
        vm.learnerPreviewRefreshStatus
          ? '<p class="util-vj-muted">Learner preview: ' +
            escapeHtml(vm.learnerPreviewRefreshStatus) +
            "</p>"
          : "",
        vm.previewRevision
          ? '<p class="util-vj-muted">Preview revision: ' + escapeHtml(String(vm.previewRevision)) + "</p>"
          : "",
        "<h6>Diagnostics</h6>",
        '<pre class="util-vj-mini-pre">' +
          escapeHtml(JSON.stringify(card.prompt_quality_diagnostics || {}, null, 2)) +
          "</pre>",
        "</div></details>",
        "</section>"
      ];
      return parts.join("");
    }

    function renderVisualJobsWorkspaceHtml(workspaceState) {
      var vm = buildVisualJobsWorkspaceViewModel(workspaceState);
      var heading = "Graphics";
      if (vm.activeView === OUTPUT_VIEWS.video) heading = "Video";
      if (vm.activeView === OUTPUT_VIEWS.resources) heading = "Resources";
      var parts = ['<div class="util-vj-workspace-inner">', "<h3>" + heading + "</h3>"];

      if (vm.status === "no_assembled_page") {
        parts.push(
          '<p class="util-vj-empty">Assemble or preview a page to see its graphics jobs.</p>'
        );
        parts.push("</div>");
        return parts.join("");
      }

      if (vm.status === "legacy_no_planning") {
        parts.push(
          '<p class="util-vj-empty">This page does not contain authoritative visual planning.</p>',
          '<p class="util-vj-muted">The existing legacy rendering path remains available.</p>'
        );
        parts.push("</div>");
        return parts.join("");
      }

      if (vm.activeView === OUTPUT_VIEWS.video || vm.activeView === OUTPUT_VIEWS.resources) {
        parts.push(renderVideoAndResourcesAuthoring(vm));
        parts.push("</div>");
        return parts.join("");
      }

      if (summaryHasVisibleContent(vm.summary)) {
        parts.push(renderWorkspaceSummary(vm));
        parts.push(renderPipelineDetails(workspaceState, vm));
      }

      if (vm.contractErrors.length) {
        parts.push("<h4>Visual planning contract</h4>", renderIssueList(vm.contractErrors, "is-error"));
      }
      if (vm.plannerBlockedMessage || vm.plannerErrors.length) {
        parts.push("<h4>Visual job planning</h4>");
        if (vm.plannerBlockedMessage) {
          parts.push(renderBlockedStageMessage(vm.plannerBlockedMessage));
        }
        if (vm.plannerErrors.length) {
          parts.push(renderIssueList(vm.plannerErrors, "is-error"));
        }
      }
      if (vm.compilerBlockedMessage || vm.compilerErrors.length) {
        parts.push("<h4>Image brief compilation</h4>");
        if (vm.compilerBlockedMessage) {
          parts.push(renderBlockedStageMessage(vm.compilerBlockedMessage));
        }
        if (vm.compilerErrors.length) {
          parts.push(renderIssueList(vm.compilerErrors, "is-error"));
        }
      }
      if (
        vm.compilerWarnings.length &&
        (vm.status === "contract_invalid" ||
          vm.status === "planner_invalid" ||
          vm.status === "compiler_invalid" ||
          vm.status === "compiler_partial")
      ) {
        parts.push("<h4>Compilation warnings</h4>", renderIssueList(vm.compilerWarnings, "is-warning"));
      }

      if (vm.briefCards.length) {
        parts.push('<div class="util-vj-two-pane">');
        parts.push(renderVisualJobsListPane(vm));
        parts.push(renderSelectedJobPane(vm));
        parts.push("</div>");
      } else if (
        vm.status !== "zero_generate_jobs" &&
        vm.status !== "legacy_no_planning" &&
        vm.status !== "no_assembled_page"
      ) {
        parts.push('<p class="util-vj-empty">No compiled image briefs are available.</p>');
      }

      if (vm.deferred.length || vm.skipped.length) {
        parts.push('<details class="util-vj-details util-vj-other-decisions"><summary>Other visual decisions</summary><div class="util-vj-details-body">');
        if (vm.deferred.length) {
          parts.push("<h6>Deferred</h6><ul>");
          vm.deferred.forEach(function (row) {
            parts.push(
              "<li>" +
                escapeHtml(row.affordance_id || "") +
                (row.defer_reason ? " · " + escapeHtml(row.defer_reason) : "") +
                "</li>"
            );
          });
          parts.push("</ul>");
        }
        if (vm.skipped.length) {
          parts.push("<h6>Skipped</h6><ul>");
          vm.skipped.forEach(function (row) {
            parts.push(
              "<li>" +
                escapeHtml(row.affordance_id || "") +
                (row.skip_reason ? " · " + escapeHtml(row.skip_reason) : "") +
                "</li>"
            );
          });
          parts.push("</ul>");
        }
        parts.push("</div></details>");
      }

      parts.push("</div>");
      return parts.join("");
    }

    function copyVisualJobPrompt(text, clipboard) {
      var prompt = String(text == null ? "" : text);
      if (!prompt) {
        return Promise.resolve({ ok: false, error: "empty_prompt" });
      }
      if (clipboard && typeof clipboard.writeText === "function") {
        return clipboard.writeText(prompt).then(
          function () {
            return { ok: true };
          },
          function () {
            return { ok: false, error: "clipboard_denied" };
          }
        );
      }
      return Promise.resolve({ ok: false, error: "clipboard_unavailable" });
    }

    function getBriefHumanPrompt(workspaceState, briefId) {
      var compiler = workspaceState && workspaceState.compilerResult;
      if (!compiler || !Array.isArray(compiler.briefs)) return "";
      var id = String(briefId || "").trim();
      for (var i = 0; i < compiler.briefs.length; i += 1) {
        if (String(compiler.briefs[i].brief_id || "") === id) {
          return buildVisualJobHumanPrompt(compiler.briefs[i]);
        }
      }
      return "";
    }

    function getBriefGenerationInstruction(workspaceState, briefId) {
      var compiler = workspaceState && workspaceState.compilerResult;
      if (!compiler || !Array.isArray(compiler.briefs)) return "";
      var id = String(briefId || "").trim();
      for (var i = 0; i < compiler.briefs.length; i += 1) {
        if (String(compiler.briefs[i].brief_id || "") === id) {
          return String(compiler.briefs[i].generation_instruction || "");
        }
      }
      return "";
    }

    return {
      OUTPUT_VIEWS: OUTPUT_VIEWS,
      VISUAL_SLOT_LABELS: VISUAL_SLOT_LABELS,
      PROMPT_LENGTH_CONCISE_MAX: PROMPT_LENGTH_CONCISE_MAX,
      PROMPT_LENGTH_EXTENDED_MAX: PROMPT_LENGTH_EXTENDED_MAX,
      HUMAN_REPRESENTATION_GUIDANCE: HUMAN_REPRESENTATION_GUIDANCE,
      HUMAN_PROMPT_MODES: HUMAN_PROMPT_MODES,
      resolveHumanPromptMode: resolveHumanPromptMode,
      buildConceptBoundaryLines: buildConceptBoundaryLines,
      buildAuthorisedEvidenceLines: buildAuthorisedEvidenceLines,
      collectBriefPrecisionClaims: collectBriefPrecisionClaims,
      getResourceVisualLanguageHeading: houseVisualMod.getResourceVisualLanguageHeading,
      getHouseVisualLanguageLines: houseVisualMod.getHouseVisualLanguageLines,
      formatResourceVisualLanguageSection: houseVisualMod.formatResourceVisualLanguageSection,
      extractResourceVisualLanguageBlock: houseVisualMod.extractResourceVisualLanguageBlock,
      buildVisualJobHumanPrompt: buildVisualJobHumanPrompt,
      buildVisualJobPresentation: buildVisualJobPresentation,
      diagnoseHumanPrompt: diagnoseHumanPrompt,
      classifyPromptLength: classifyPromptLength,
      buildVisualJobsPipelineFromPage: buildVisualJobsPipelineFromPage,
      buildVisualJobsWorkspaceState: buildVisualJobsWorkspaceState,
      emptyWorkspaceState: emptyWorkspaceState,
      buildVisualJobsWorkspaceViewModel: buildVisualJobsWorkspaceViewModel,
      buildVisualJobsOrderedList: buildVisualJobsOrderedList,
      selectVisualJob: selectVisualJob,
      toggleVisualJobPromptVisibility: toggleVisualJobPromptVisibility,
      attachVisualAssetToWorkspace: attachVisualAssetToWorkspace,
      removeVisualAssetFromWorkspace: removeVisualAssetFromWorkspace,
      setVideoResourceReference: setVideoResourceReference,
      clearVideoResourceReference: clearVideoResourceReference,
      setAdditionalResourcesIntro: setAdditionalResourcesIntro,
      addAdditionalResourceReference: addAdditionalResourceReference,
      removeAdditionalResourceReference: removeAdditionalResourceReference,
      moveAdditionalResourceReference: moveAdditionalResourceReference,
      readPageResourceRefsFromPage: readPageResourceRefsFromPage,
      normalizePageResourceRefsShape: normalizePageResourceRefsShape,
      refreshVisualAssetManifest: refreshVisualAssetManifest,
      buildWorkspaceSummary: buildWorkspaceSummary,
      buildStageErrorPresentation: buildStageErrorPresentation,
      resolveWorkspaceStatus: resolveWorkspaceStatus,
      renderVisualJobsWorkspaceHtml: renderVisualJobsWorkspaceHtml,
      copyVisualJobPrompt: copyVisualJobPrompt,
      validateVisualImageInput: assetsMod.validateVisualImageInput,
      getVisualAssetManifest: function (workspaceState) {
        return deepClone(
          (workspaceState && workspaceState.visualAssetManifest) ||
            assetsMod.buildVisualAssetManifest(
              (workspaceState && workspaceState.compilerResult) || { briefs: [] },
              (workspaceState && workspaceState.assetsByBriefId) || {}
            )
        );
      },
      getBriefHumanPrompt: getBriefHumanPrompt,
      getBriefGenerationInstruction: getBriefGenerationInstruction,
      humanizeVisualSlot: humanizeVisualSlot,
      humanizeRepresentation: humanizeRepresentation,
      escapeHtml: escapeHtml
    };
  }
);

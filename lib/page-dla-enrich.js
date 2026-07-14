/**
 * Sprint 56F Phase 3 — DLA enrich-in-place for vNext page artefacts.
 */
(function (root, factory) {
  "use strict";
  var populationContract = null;
  var beatRegistry = null;
  var instructionalArchetype = null;
  if (typeof module === "object" && module.exports) {
    try {
      populationContract = require("./episode-plan-population-contract.js");
    } catch (_) {}
    try {
      beatRegistry = require("./beat-material-registry.js");
    } catch (_) {}
    try {
      instructionalArchetype = require("./ld-instructional-archetype.js");
    } catch (_) {}
    module.exports = factory(populationContract, beatRegistry, instructionalArchetype);
  } else {
    populationContract = root.PRISM_EPISODE_PLAN_POPULATION;
    beatRegistry = root.PRISM_BEAT_MATERIAL_REGISTRY;
    instructionalArchetype = root.PRISM_LD_INSTRUCTIONAL_ARCHETYPE;
    root.PRISM_PAGE_DLA_ENRICH = factory(
      populationContract,
      beatRegistry,
      instructionalArchetype
    );
  }
})(
  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,
  function (populationContract, beatRegistry, instructionalArchetype) {
    "use strict";

    function getPopulationContract() {
      if (populationContract) return populationContract;
      var root =
        typeof globalThis !== "undefined"
          ? globalThis
          : typeof window !== "undefined"
          ? window
          : {};
      return root.PRISM_EPISODE_PLAN_POPULATION || null;
    }

    function getBeatRegistry() {
      if (beatRegistry) return beatRegistry;
      var root =
        typeof globalThis !== "undefined"
          ? globalThis
          : typeof window !== "undefined"
          ? window
          : {};
      return root.PRISM_BEAT_MATERIAL_REGISTRY || null;
    }

    function getInstructionalArchetypeLib() {
      if (instructionalArchetype) return instructionalArchetype;
      var root =
        typeof globalThis !== "undefined"
          ? globalThis
          : typeof window !== "undefined"
          ? window
          : {};
      return root.PRISM_LD_INSTRUCTIONAL_ARCHETYPE || null;
    }

    function appendArchetypePlanValidationErrors(page, errors) {
      var lib = getInstructionalArchetypeLib();
      if (!lib || typeof lib.validatePageArchetypePlans !== "function") return;
      var result = lib.validatePageArchetypePlans(page);
      if (result && Array.isArray(result.errors) && result.errors.length) {
        result.errors.forEach(function (err) {
          errors.push(err);
        });
      }
    }

    var ENRICH_VERSION = "56F-DLA-ENRICH-1";
    var SHELL_DLA_PLACEHOLDER = "\u2014";
    var SCHEMA_VERSION = "2.0.0";

    var DLA_REQUIRED_STRING_FIELDS = ["learner_task", "expected_output", "activity_preamble"];

    var DLA_OWNED_COGNITION_FIELDS = [
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
      "study_orientation",
      "intellectual_frame",
      "intellectual_coherence_bridge",
      "support_note"
    ];

    var INTERNAL_ACTIVITY_KEYS = [
      "_population_trace",
      "_learner_task_segments",
      "_population_contract_version",
      "episode_plan_ref",
      "materials_order"
    ];

    var FUNCTION_TO_MATERIAL_TYPE = {
      explanation: "text",
      observation: "text",
      criteria_exposition: "text",
      example: "worked_example",
      non_example: "worked_example",
      worked_thinking: "worked_example",
      worked_judgement: "worked_example",
      guided_practice: "template",
      guided_reasoning: "decision_table",
      guided_inquiry: "prompt_set",
      independent_performance: "template",
      verification: "checklist",
      reflection: "consolidation_summary",
      transfer: "transfer_prompt",
      misconception_confrontation: "prompt_set",
      criteria_construction: "template",
      perspective_construction: "template",
      evaluative_judgement: "template",
      revision: "template"
    };

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

    function hasNonEmptyString(value) {
      return typeof value === "string" && value.trim().length > 0;
    }

    function isShellPlaceholder(value) {
      return String(value == null ? "" : value).trim() === SHELL_DLA_PLACEHOLDER;
    }

    function cleanPopulationText(value) {
      var text = String(value == null ? "" : value).trim();
      return text.replace(/^\[population:[^\]]+\]\s*/i, "").trim();
    }

    function resolveMaterialTypeForFunction(fn) {
      var key = String(fn || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
      if (!key) return "text";
      if (
        getBeatRegistry() &&
        typeof getBeatRegistry().resolveMaterialTypeForEpisodeFunction === "function"
      ) {
        var resolved = getBeatRegistry().resolveMaterialTypeForEpisodeFunction(key);
        if (resolved) return resolved;
      }
      return FUNCTION_TO_MATERIAL_TYPE[key] || "text";
    }

    function learningOutcomesIndex(page) {
      var map = {};
      var rows = Array.isArray(page && page.learning_outcomes) ? page.learning_outcomes : [];
      rows.forEach(function (row, index) {
        if (typeof row === "string") {
          map["LO" + (index + 1)] = { outcome_id: "LO" + (index + 1), statement: row };
          return;
        }
        if (!row || typeof row !== "object") return;
        var id = nonEmptyString(row.outcome_id || row.id, "LO" + (index + 1));
        map[id] = row;
      });
      return map;
    }

    function resolveLoStatementForActivity(activity, loIndex) {
      var ids = Array.isArray(activity.learning_outcome_ids)
        ? activity.learning_outcome_ids
        : Array.isArray(activity.mapped_learning_outcome_ids)
        ? activity.mapped_learning_outcome_ids
        : [];
      var i;
      for (i = 0; i < ids.length; i += 1) {
        var lo = loIndex[ids[i]];
        if (!lo) continue;
        var statement = nonEmptyString(lo.statement || lo.text || lo.description, "");
        if (statement) return statement;
      }
      return nonEmptyString(activity.title, "the learning outcome");
    }

    function materialPurposeForBeat(fn, loStatement) {
      var label = String(fn || "")
        .replace(/_/g, " ")
        .trim();
      if (!label) return "Support " + loStatement + ".";
      return (
        "Provide " +
        label +
        " material to help learners work toward: " +
        loStatement +
        "."
      );
    }

    function buildRequiredMaterialsFromPlan(activityId, episodePlan) {
      var contract = getPopulationContract();
      if (contract && typeof contract.buildObligationScaffoldFromPlan === "function") {
        var scaffold = contract.buildObligationScaffoldFromPlan(episodePlan, {
          activity_id: activityId
        });
        var seq = 0;
        return (scaffold.obligations || []).map(function (row) {
          seq += 1;
          var fn = nonEmptyString(row.instructional_function, "");
          return {
            material_id: activityId + "-M" + seq,
            material_type: resolveMaterialTypeForFunction(fn),
            type: resolveMaterialTypeForFunction(fn),
            purpose: materialPurposeForBeat(fn, activityId),
            specification: nonEmptyString(row.specification, materialPurposeForBeat(fn, activityId)),
            instructional_function: fn,
            plan_beat_index:
              typeof row.plan_beat_index === "number" ? row.plan_beat_index : undefined
          };
        });
      }
      var beats = (episodePlan && episodePlan.beats) || [];
      return beats.map(function (beat, index) {
        var fn = nonEmptyString(beat && beat.function, "explanation");
        return {
          material_id: activityId + "-M" + (index + 1),
          material_type: resolveMaterialTypeForFunction(fn),
          type: resolveMaterialTypeForFunction(fn),
          purpose: materialPurposeForBeat(fn, activityId),
          specification: materialPurposeForBeat(fn, activityId),
          instructional_function: fn,
          plan_beat_index: index
        };
      });
    }

    function buildLearnerTask(activity, loStatement, scaffolded) {
      var fromScaffold = cleanPopulationText(scaffolded && scaffolded.learner_task);
      if (fromScaffold && !isShellPlaceholder(fromScaffold)) {
        return fromScaffold;
      }
      var archetype = nonEmptyString(
        activity.episode_plan && activity.episode_plan.archetype,
        "understand"
      );
      var beats = (activity.episode_plan && activity.episode_plan.beats) || [];
      var beatNames = beats
        .map(function (b) {
          return String((b && b.function) || "").replace(/_/g, " ");
        })
        .filter(Boolean)
        .slice(0, 4)
        .join(", ");
      return (
        "Complete this " +
        archetype +
        " activity to " +
        loStatement.charAt(0).toLowerCase() +
        loStatement.slice(1) +
        (beatNames ? " by working through: " + beatNames + "." : ".")
      );
    }

    function buildExpectedOutput(loStatement, archetype) {
      return (
        "Submit evidence that demonstrates " +
        loStatement.charAt(0).toLowerCase() +
        loStatement.slice(1) +
        " with reasoning that references the teaching materials and meets the " +
        archetype +
        " quality threshold."
      );
    }

    function buildActivityPreamble(activity, loStatement, scaffolded) {
      var fromScaffold = cleanPopulationText(scaffolded && scaffolded.activity_preamble);
      if (fromScaffold && !isShellPlaceholder(fromScaffold)) {
        return fromScaffold;
      }
      var archetype = nonEmptyString(
        activity.episode_plan && activity.episode_plan.archetype,
        "understand"
      );
      return (
        "This activity helps you " +
        loStatement.charAt(0).toLowerCase() +
        loStatement.slice(1) +
        " using a " +
        archetype +
        " learning pathway."
      );
    }

    function buildCognitionFields(activity, loStatement, scaffolded) {
      var archetype = nonEmptyString(
        activity.episode_plan && activity.episode_plan.archetype,
        "understand"
      );
      var out = {};
      DLA_OWNED_COGNITION_FIELDS.forEach(function (field) {
        if (scaffolded && hasNonEmptyString(scaffolded[field]) && !isShellPlaceholder(scaffolded[field])) {
          out[field] = cleanPopulationText(scaffolded[field]);
        }
      });
      if (!out.study_orientation) {
        out.study_orientation =
          "Work through each beat in order, pausing to explain your reasoning before moving to independent practice.";
      }
      if (!out.intellectual_frame) {
        out.intellectual_frame =
          "Frame your work around " + loStatement + " and how the evidence supports your conclusions.";
      }
      if (!out.reasoning_orientation) {
        out.reasoning_orientation =
          "Use " +
          archetype +
          "-level reasoning: state what you know, how the materials support it, and what remains uncertain.";
      }
      if (!out.self_explanation_prompt) {
        out.self_explanation_prompt =
          "Before submitting, explain in your own words how your response demonstrates " +
          loStatement.charAt(0).toLowerCase() +
          loStatement.slice(1) +
          ".";
      }
      if (!out.prior_knowledge_activation) {
        out.prior_knowledge_activation =
          "Recall what you already know about this topic and note one assumption you are testing in this activity.";
      }
      if (!out.evidence_use_prompt) {
        out.evidence_use_prompt =
          "Cite specific details from the required materials when justifying each step of your response.";
      }
      if (!out.argument_structure_hint) {
        out.argument_structure_hint =
          "Structure your response as claim → evidence → reasoning → limitation.";
      }
      if (!out.scaffold_hint_sequence) {
        out.scaffold_hint_sequence = [
          "Orient to the activity goal",
          "Study the teaching materials",
          "Attempt guided practice",
          "Complete independent performance",
          "Verify against the checklist"
        ];
      }
      if (!out.support_note) {
        out.support_note =
          "If stuck, revisit the worked example and compare your reasoning to the model before revising.";
      }
      if (archetype === "apply" && !out.transfer_or_application_task) {
        out.transfer_or_application_task =
          "Apply the procedure from the worked example to a new case with different inputs.";
      }
      if (archetype === "analyse" && !out.conceptual_contrast_prompt) {
        out.conceptual_contrast_prompt =
          "Contrast two plausible interpretations and explain which evidence supports each.";
      }
      if (archetype === "evaluate" && !out.uncertainty_tension_prompt) {
        out.uncertainty_tension_prompt =
          "Identify the main trade-off in your judgement and what would change your conclusion.";
      }
      if (!out.disciplinary_lens) {
        out.disciplinary_lens = "Use discipline-appropriate vocabulary when describing mechanisms and evidence.";
      }
      if (!out.intellectual_coherence_bridge) {
        out.intellectual_coherence_bridge =
          "Connect this activity's conclusion to the broader learning goal: " + loStatement + ".";
      }
      return out;
    }

    function stripInternalActivityFields(activity) {
      var out = Object.assign({}, activity || {});
      INTERNAL_ACTIVITY_KEYS.forEach(function (key) {
        delete out[key];
      });
      Object.keys(out).forEach(function (key) {
        if (key.indexOf("_plan_") === 0) delete out[key];
      });
      return out;
    }

    function enrichActivityWithDla(activity, loStatement, options) {
      if (!activity || typeof activity !== "object") {
        throw new Error("enrichActivityWithDla: activity required");
      }
      var episodePlan = activity.episode_plan;
      if (!episodePlan || typeof episodePlan !== "object") {
        throw new Error(
          "enrichActivityWithDla: activities[" +
            nonEmptyString(activity.activity_id, "?") +
            "].episode_plan required"
        );
      }
      var activityId = nonEmptyString(activity.activity_id, "A1");
      var scaffolded = null;
      var contract = getPopulationContract();
      if (contract && typeof contract.applyPopulationScaffoldToActivity === "function") {
        scaffolded = contract.applyPopulationScaffoldToActivity(
          { activity_id: activityId },
          episodePlan
        );
      }
      var requiredMaterials = buildRequiredMaterialsFromPlan(activityId, episodePlan);
      requiredMaterials.forEach(function (row, index) {
        row.purpose = materialPurposeForBeat(row.instructional_function, loStatement);
        if (!row.material_id) row.material_id = activityId + "-M" + (index + 1);
      });
      var cognition = buildCognitionFields(activity, loStatement, scaffolded || {});
      var enriched = stripInternalActivityFields(activity);
      enriched.learner_task = buildLearnerTask(activity, loStatement, scaffolded || {});
      enriched.expected_output = buildExpectedOutput(
        loStatement,
        nonEmptyString(episodePlan.archetype, "understand")
      );
      enriched.activity_preamble = buildActivityPreamble(activity, loStatement, scaffolded || {});
      enriched.required_materials = requiredMaterials;
      enriched.materials = [];
      Object.keys(cognition).forEach(function (key) {
        enriched[key] = cognition[key];
      });
      if (!Array.isArray(enriched.learning_outcome_ids) && Array.isArray(activity.learning_outcome_ids)) {
        enriched.learning_outcome_ids = activity.learning_outcome_ids.slice();
      }
      enriched.episode_plan = deepClone(episodePlan);
      return enriched;
    }

    function appendDlaSourceArtefact(sourceArtefacts) {
      var rows = Array.isArray(sourceArtefacts) ? sourceArtefacts.slice() : [];
      var hasDla = rows.some(function (row) {
        return row && row.artefact_type === "design_learning_activities";
      });
      if (!hasDla) {
        rows.push({
          artefact_type: "design_learning_activities",
          source_label: "Design Learning Activities",
          role: "pedagogy"
        });
      }
      return rows;
    }

    function buildDlaValidationReport(activityCount) {
      return {
        activity_coverage: activityCount > 0 ? "dla_enriched" : "none",
        material_coverage: "pending_gam",
        episode_plan_attachment: "attached",
        self_containment: "dla_enriched",
        schema_compliance: "dla_boundary",
        known_issues: activityCount > 0 ? [] : ["No activities after DLA enrichment"]
      };
    }

    function enrichPageWithDla(pageShell, options) {
      if (!pageShell || typeof pageShell !== "object" || Array.isArray(pageShell)) {
        throw new Error("enrichPageWithDla: page shell required");
      }
      if (String(pageShell.artifact_type || "") !== "page") {
        throw new Error('enrichPageWithDla: artifact_type must be "page"');
      }
      if (!Array.isArray(pageShell.activities) || !pageShell.activities.length) {
        throw new Error("enrichPageWithDla: activities[] required");
      }
      var out = deepClone(pageShell);
      var loIndex = learningOutcomesIndex(out);
      out.activities = out.activities.map(function (activity) {
        var loStatement = resolveLoStatementForActivity(activity, loIndex);
        return enrichActivityWithDla(activity, loStatement, options || {});
      });
      out.page_synthesis = {};
      out.assembly_state = Object.assign({}, out.assembly_state || {}, {
        current_stage: "dla",
        enriched_by: ["episode_plan", "dla"]
      });
      out.source_artefacts = appendDlaSourceArtefact(out.source_artefacts);
      out.generation_notes = Object.assign({}, out.generation_notes || {}, {
        validation: buildDlaValidationReport(out.activities.length),
        notes:
          "Sprint 56F DLA page enrichment (" +
          ENRICH_VERSION +
          ") — materials pending GAM; page_synthesis pending finalise_page"
      });
      return out;
    }

    function extractLearningActivitiesRows(capture) {
      if (!capture || typeof capture !== "object") return [];
      if (Array.isArray(capture.activities)) return capture.activities;
      if (capture.learning_activities && Array.isArray(capture.learning_activities.activities)) {
        return capture.learning_activities.activities;
      }
      if (capture.learning_activities && Array.isArray(capture.learning_activities.content)) {
        return capture.learning_activities.content;
      }
      if (Array.isArray(capture.content)) return capture.content;
      return [];
    }

    function mergeDlaRowsIntoPageShell(shellBaseline, dlaRows) {
      if (!shellBaseline || !Array.isArray(dlaRows) || !dlaRows.length) return null;
      var baseline = deepClone(shellBaseline);
      var rowMap = {};
      dlaRows.forEach(function (row) {
        if (row && row.activity_id) rowMap[String(row.activity_id)] = row;
      });
      baseline.activities = baseline.activities.map(function (activity) {
        var incoming = rowMap[String(activity.activity_id || "")];
        if (!incoming) return activity;
        var merged = Object.assign({}, activity, incoming);
        merged.episode_plan = deepClone(activity.episode_plan || incoming.episode_plan);
        merged.activity_id = activity.activity_id;
        merged.materials = [];
        return merged;
      });
      return enrichPageWithDla(baseline);
    }

    function normalizeDlaCaptureToPage(shellBaseline, capture) {
      if (!capture || typeof capture !== "object") return null;
      if (
        String(capture.artifact_type || "") === "page" &&
        String(capture.schema_version || "") === SCHEMA_VERSION
      ) {
        var page = deepClone(capture);
        if (!page.assembly_state) {
          page.assembly_state = { enriched_by: ["episode_plan", "dla"], current_stage: "dla" };
        }
        return page;
      }
      if (!shellBaseline) return null;
      var rows = extractLearningActivitiesRows(capture);
      if (!rows.length) return null;
      return mergeDlaRowsIntoPageShell(shellBaseline, rows);
    }

    function pageSynthesisHasContent(pageSynthesis) {
      if (!pageSynthesis || typeof pageSynthesis !== "object") return false;
      return ["overview", "learning_purpose", "knowledge_summary", "study_tips", "support_notes"].some(
        function (key) {
          var slot = pageSynthesis[key];
          if (!slot) return false;
          if (typeof slot === "string") return hasNonEmptyString(slot);
          if (typeof slot === "object" && hasNonEmptyString(slot.body)) return true;
          if (key === "knowledge_summary" && slot && Array.isArray(slot.concepts) && slot.concepts.length) {
            return true;
          }
          return false;
        }
      );
    }

    function activityIdsInOrder(page) {
      return (page.activities || []).map(function (row) {
        return String(row.activity_id || "");
      });
    }

    function validateDlaEnrichedPage(page, baseline) {
      var errors = [];
      if (!page || typeof page !== "object" || Array.isArray(page)) {
        return { ok: false, errors: ["page must be an object"] };
      }
      if (page.artifact_type !== "page") errors.push('artifact_type must be "page"');
      if (page.schema_version !== SCHEMA_VERSION) {
        errors.push('schema_version must be "' + SCHEMA_VERSION + '"');
      }
      [
        "title",
        "audience",
        "page_profile",
        "assembly_state",
        "page_synthesis",
        "activities",
        "learning_outcomes",
        "source_artefacts",
        "generation_notes"
      ].forEach(function (key) {
        if (!(key in page)) errors.push("missing required top-level key: " + key);
      });
      if (!Array.isArray(page.activities) || !page.activities.length) {
        errors.push("activities[] required");
      }
      if (page.sections != null) errors.push("sections[] must not be written at DLA stage");
      if (page.learning_sequence != null) {
        errors.push("learning_sequence must not be present at DLA stage");
      }
      if (page.assessment_check != null) {
        errors.push("assessment_check must not be present at DLA stage");
      }
      if (pageSynthesisHasContent(page.page_synthesis)) {
        errors.push("page_synthesis must remain empty at DLA stage");
      } else if (!page.page_synthesis || typeof page.page_synthesis !== "object") {
        errors.push("page_synthesis must be an object");
      }
      if (!page.assembly_state || typeof page.assembly_state !== "object") {
        errors.push("assembly_state required");
      } else {
        if (page.assembly_state.current_stage !== "dla") {
          errors.push('assembly_state.current_stage must be "dla"');
        }
        var enrichedBy = Array.isArray(page.assembly_state.enriched_by)
          ? page.assembly_state.enriched_by
          : [];
        if (enrichedBy.indexOf("episode_plan") === -1) {
          errors.push('assembly_state.enriched_by must include "episode_plan"');
        }
        if (enrichedBy.indexOf("dla") === -1) {
          errors.push('assembly_state.enriched_by must include "dla"');
        }
      }
      if (baseline) {
        if (activityIdsInOrder(page).join("|") !== activityIdsInOrder(baseline).join("|")) {
          errors.push("activity_id order must match upstream page shell");
        }
      }
      (page.activities || []).forEach(function (activity, index) {
        if (!activity || typeof activity !== "object") {
          errors.push("activities[" + index + "] must be an object");
          return;
        }
        DLA_REQUIRED_STRING_FIELDS.forEach(function (field) {
          if (!hasNonEmptyString(activity[field]) || isShellPlaceholder(activity[field])) {
            errors.push(
              "activities[" + index + "]." + field + " must be enriched (not placeholder em dash)"
            );
          }
        });
        var beats =
          activity.episode_plan &&
          Array.isArray(activity.episode_plan.beats) &&
          activity.episode_plan.beats.length
            ? activity.episode_plan.beats
            : [];
        if (beats.length && (!Array.isArray(activity.required_materials) || !activity.required_materials.length)) {
          errors.push(
            "activities[" + index + "].required_materials required when episode_plan has beats"
          );
        }
        if (!Array.isArray(activity.materials)) {
          errors.push("activities[" + index + "].materials must be an array");
        } else if (activity.materials.length) {
          activity.materials.forEach(function (material, mIndex) {
            if (material && hasNonEmptyString(material.body)) {
              errors.push(
                "activities[" + index + "].materials[" + mIndex + "].body forbidden at DLA stage"
              );
            }
          });
        }
        if (!activity.episode_plan || typeof activity.episode_plan !== "object") {
          errors.push("activities[" + index + "].episode_plan must be preserved");
        }
      });
      appendArchetypePlanValidationErrors(page, errors);
      return { ok: errors.length === 0, errors: errors };
    }

    function validateDlaPartialPageCapture(page) {
      var errors = [];
      if (!page || typeof page !== "object" || Array.isArray(page)) {
        return { ok: false, errors: ["page must be an object"] };
      }
      if (page.artifact_type !== "page") errors.push('artifact_type must be "page"');
      if (page.schema_version !== SCHEMA_VERSION) {
        errors.push('schema_version must be "' + SCHEMA_VERSION + '"');
      }
      if (!Array.isArray(page.activities) || !page.activities.length) {
        errors.push("partial DLA page must include activities[]");
      }
      if (!page.assembly_state || typeof page.assembly_state !== "object") {
        errors.push("assembly_state required");
      }
      if (page.learning_sequence != null) {
        errors.push("learning_sequence must not be present in DLA partial");
      }
      if (page.assessment_check != null) {
        errors.push("assessment_check must not be present in DLA partial");
      }
      (page.activities || []).forEach(function (activity, index) {
        if (!activity || typeof activity !== "object" || Array.isArray(activity)) {
          errors.push("activities[" + index + "] must be an object");
          return;
        }
        if (!hasNonEmptyString(activity.activity_id)) {
          errors.push("activities[" + index + "].activity_id required");
        }
        if ("materials" in activity && !Array.isArray(activity.materials)) {
          errors.push("activities[" + index + "].materials must be an array when present");
        }
        if (Array.isArray(activity.materials)) {
          activity.materials.forEach(function (material, mIndex) {
            if (
              material &&
              typeof material === "object" &&
              !Array.isArray(material) &&
              hasNonEmptyString(material.body)
            ) {
              errors.push(
                "activities[" + index + "].materials[" + mIndex + "].body forbidden at DLA stage"
              );
            }
          });
        }
      });
      appendArchetypePlanValidationErrors(page, errors);
      return { ok: errors.length === 0, errors: errors };
    }

    function isVNextPageAtDlaStage(page) {
      return (
        page &&
        page.artifact_type === "page" &&
        page.schema_version === SCHEMA_VERSION &&
        page.assembly_state &&
        page.assembly_state.current_stage === "dla"
      );
    }

    return {
      ENRICH_VERSION: ENRICH_VERSION,
      SCHEMA_VERSION: SCHEMA_VERSION,
      SHELL_DLA_PLACEHOLDER: SHELL_DLA_PLACEHOLDER,
      DLA_REQUIRED_STRING_FIELDS: DLA_REQUIRED_STRING_FIELDS.slice(),
      DLA_OWNED_COGNITION_FIELDS: DLA_OWNED_COGNITION_FIELDS.slice(),
      isShellPlaceholder: isShellPlaceholder,
      enrichActivityWithDla: enrichActivityWithDla,
      enrichPageWithDla: enrichPageWithDla,
      normalizeDlaCaptureToPage: normalizeDlaCaptureToPage,
      validateDlaEnrichedPage: validateDlaEnrichedPage,
      validateDlaPartialPageCapture: validateDlaPartialPageCapture,
      isVNextPageAtDlaStage: isVNextPageAtDlaStage,
      buildRequiredMaterialsFromPlan: buildRequiredMaterialsFromPlan
    };
  }
);

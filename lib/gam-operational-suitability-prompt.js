"use strict";



/**

 * S78 operational suitability — GAM load-bearing particulars authoring block.

 * Stage 1: prompt-contract salience only (no semantic validation).

 */

(function (root, factory) {

  "use strict";

  var api = factory();

  if (typeof module !== "undefined" && module.exports) {

    module.exports = api;

  }

  if (typeof root !== "undefined") {

    root.PRISM_GAM_OPERATIONAL_SUITABILITY_PROMPT = api;

  }

})(

  typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this,

  function () {

    "use strict";



    var MARKER = "S78-OPERATIONAL-SUITABILITY (auto-applied)";



    function resolveProductionFulfilmentLib() {

      if (typeof require === "function") {

        try {

          return require("./dla-production-fulfilment.js");

        } catch (_) {}

      }

      return null;

    }



    function parseLearnerTaskFallback(learnerTask) {

      return String(learnerTask || "")

        .split(/\n+/)

        .map(function (line, index) {

          var text = line.replace(/^\s*\d+[\).\]]\s*/, "").trim();

          return { sourceStepNumber: index + 1, text: text };

        })

        .filter(function (step) {

          return step.text;

        });

    }



    function classifyLearnerProductionSteps(learnerTask, expectedOutput) {

      var lib = resolveProductionFulfilmentLib();

      if (lib && typeof lib.classifyLearnerProductionSteps === "function") {

        return lib.classifyLearnerProductionSteps(learnerTask, expectedOutput);

      }

      return {

        steps: parseLearnerTaskFallback(learnerTask).map(function (step) {

          return {

            stepNumber: step.sourceStepNumber,

            text: step.text,

            responseKind: null

          };

        }),

        productionKinds: []

      };

    }



    var MODEL_MATERIAL_TYPES = Object.freeze({

      worked_example: true,

      modelling_note: true

    });



    var OPERAND_MATERIAL_TYPES = Object.freeze({

      scenario: true,

      task_card: true,

      scenarios: true,

      task_cards: true,

      study_scenarios: true,

      prompt_set: true

    });



    var WORKSPACE_MATERIAL_TYPES = Object.freeze({

      template: true,

      analysis_table: true,

      comparison_table: true,

      decision_table: true,

      classification_table: true,

      planning_table: true,

      data_table: true,

      impact_table: true

    });



    var OPEN_ENDED_COMMISSION_RE =

      /\b(open[- ]ended|multiple (?:valid|defensible|plausible)|competing (?:arguments|interpretations|readings|perspectives)|evaluate (?:different|alternative|competing)|interpret(?:ation)?(?:s)? (?:may|can) (?:vary|differ)|several (?:valid|defensible) (?:answers|interpretations))\b/i;



    var DELIBERATE_INSUFFICIENCY_COMMISSION_RE =

      /\b(missing information|additional information (?:is )?(?:needed|required)|what (?:information|data|evidence) (?:is )?(?:missing|needed|required)|diagnos(?:e|is) (?:the )?(?:insufficiency|limitation|gap)|limitations of (?:the )?(?:data|evidence|information|dataset)|insufficient (?:data|information|evidence)|identify (?:what is )?missing)\b/i;



    var COMPLETE_WORKED_COMMISSION_RE =

      /\b(complete worked (?:solution|result|example|demonstration)|fully worked|full worked|complete solution|complete derivation|reach(?:es)? (?:the )?(?:promised |final |target )?result|identify(?:ing)? (?:the )?optimal|determine(?:ing)? (?:the )?(?:optimal|candidate) (?:values|solution|allocation))\b/i;



    var SOLVED_MODEL_COMMISSION_RE =

      /\b(solved (?:modelling|modeling|example|path|result)|including verification|constraint satisfaction|verify(?:ing)? (?:the )?constraint|final values|optimal values)\b/i;



    var PARTIAL_MODEL_EXCLUDE_RE =

      /\b(stop before|do not include (?:the )?solution|without solving|objective (?:function )?and constraint only|(?:include )?problems? only[^.]{0,48}do not include|no solutions? or derivative)\b/i;



    function nonEmptyString(value) {

      return typeof value === "string" && value.trim().length > 0;

    }



    function materialTypeToken(row) {

      return String((row && (row.material_type || row.type)) || "").trim();

    }



    function materialIdToken(row) {

      return nonEmptyString(row && row.material_id) ? String(row.material_id).trim() : "";

    }



    function truncate(text, maxLen) {

      var value = String(text || "").trim();

      if (!value) return "";

      if (value.length <= maxLen) return value;

      return value.slice(0, maxLen - 1) + "…";

    }



    function buildIdSet(ids) {

      var set = Object.create(null);

      (ids || []).forEach(function (id) {

        if (id) set[id] = true;

      });

      return set;

    }



    function rowHasResponseFulfilment(row) {

      return !!(

        row &&

        row.response_fulfilment &&

        typeof row.response_fulfilment === "object" &&

        !Array.isArray(row.response_fulfilment)

      );

    }



    function isChecklistRow(row) {

      return materialTypeToken(row) === "checklist";

    }



    function activityCommissionMode(activity) {

      var combined =

        String((activity && activity.learner_task) || "") +

        " " +

        String((activity && activity.expected_output) || "");

      if (DELIBERATE_INSUFFICIENCY_COMMISSION_RE.test(combined)) {

        return "deliberate_insufficiency";

      }

      if (OPEN_ENDED_COMMISSION_RE.test(combined)) {

        return "open_ended";

      }

      return "determinate";

    }



    function activityHasLoadBearingProduction(activity) {

      var classification = classifyLearnerProductionSteps(

        activity && activity.learner_task,

        activity && activity.expected_output

      );

      return classification.productionKinds.length > 0;

    }



    function specPromisesCompleteWorkedResult(row) {

      var text =

        String((row && row.purpose) || "") + " " + String((row && row.specification) || "");

      return COMPLETE_WORKED_COMMISSION_RE.test(text);

    }



    function specPromisesPartialModelOnly(row) {

      var text =

        String((row && row.purpose) || "") + " " + String((row && row.specification) || "");

      return PARTIAL_MODEL_EXCLUDE_RE.test(text);

    }



    function modelCommissionRequiresCompleteReview(row) {

      if (!isModelRow(row)) return false;

      if (specPromisesPartialModelOnly(row)) return false;

      if (specPromisesCompleteWorkedResult(row)) return true;

      var text =

        String((row && row.purpose) || "") + " " + String((row && row.specification) || "");

      return SOLVED_MODEL_COMMISSION_RE.test(text);

    }



    function modelCommissionRequiresDemonstrationReview(row) {

      if (!isModelRow(row)) return false;

      if (modelCommissionRequiresCompleteReview(row)) return false;

      if (specPromisesPartialModelOnly(row)) return false;

      return true;

    }



    function isWorkspaceRow(row) {

      return !!WORKSPACE_MATERIAL_TYPES[materialTypeToken(row)];

    }



    function isModelRow(row) {

      return !!MODEL_MATERIAL_TYPES[materialTypeToken(row)];

    }



    function resolveTaskInputIds(activity) {

      var taskDecision = activity && activity.task_material_decision;

      if (!taskDecision || !Array.isArray(taskDecision.task_input_material_ids)) {

        return [];

      }

      return taskDecision.task_input_material_ids

        .map(function (id) {

          return nonEmptyString(id) ? String(id).trim() : "";

        })

        .filter(Boolean);

    }



    function resolveAttemptOperandIds(requiredMaterials) {

      var ids = [];

      var seen = Object.create(null);

      (requiredMaterials || []).forEach(function (row) {

        var binding = row && row.practice_independence;

        if (!binding || !Array.isArray(binding.attempt_operand_material_ids)) return;

        binding.attempt_operand_material_ids.forEach(function (id) {

          var token = nonEmptyString(id) ? String(id).trim() : "";

          if (token && !seen[token]) {

            seen[token] = true;

            ids.push(token);

          }

        });

      });

      return ids;

    }



    function activityHasSubstantiveLearnerProduction(activity, requiredMaterials) {

      if (activityHasLoadBearingProduction(activity)) return true;

      if (!nonEmptyString(activity && activity.expected_output)) return false;

      if (resolveTaskInputIds(activity).length > 0) return true;

      if (resolveAttemptOperandIds(requiredMaterials).length > 0) return true;

      return false;

    }



    function activityRequiresOperationalSuitability(activity, requiredMaterials) {

      if (activityHasSubstantiveLearnerProduction(activity, requiredMaterials)) return true;

      return requiredMaterials.some(function (row) {

        return modelCommissionRequiresCompleteReview(row);

      });

    }



    function isAuthoritativeGeneratedInput(materialId, taskInputSet, attemptOperandSet) {

      return !!(taskInputSet[materialId] || attemptOperandSet[materialId]);

    }



    function shouldExcludeFromSemanticReview(row, taskInputSet, attemptOperandSet) {

      var materialId = materialIdToken(row);

      if (!materialId) return true;

      if (isChecklistRow(row)) return true;

      if (isAuthoritativeGeneratedInput(materialId, taskInputSet, attemptOperandSet)) return false;

      if (rowHasResponseFulfilment(row)) return true;

      if (materialTypeToken(row) === "text") return true;

      if (isWorkspaceRow(row)) return true;

      return false;

    }



    function resolveMaterialRole(row, taskInputSet, attemptOperandSet) {

      if (modelCommissionRequiresCompleteReview(row)) return "model_complete";

      if (modelCommissionRequiresDemonstrationReview(row)) return "model_demonstration";

      var materialId = materialIdToken(row);

      if (isAuthoritativeGeneratedInput(materialId, taskInputSet, attemptOperandSet)) {

        return "learner_operand";

      }

      return "";

    }



    function collectSuitabilityObligationsFromPage(page) {

      var activities = Array.isArray(page && page.activities) ? page.activities : [];

      var obligations = [];



      activities.forEach(function (activity) {

        var activityId = nonEmptyString(activity && activity.activity_id)

          ? String(activity.activity_id).trim()

          : "";

        var requiredMaterials = Array.isArray(activity && activity.required_materials)

          ? activity.required_materials

          : [];

        if (!activityRequiresOperationalSuitability(activity, requiredMaterials)) {

          return;

        }



        var mode = activityCommissionMode(activity);

        var taskInputSet = buildIdSet(resolveTaskInputIds(activity));

        var attemptOperandSet = buildIdSet(resolveAttemptOperandIds(requiredMaterials));



        requiredMaterials.forEach(function (row) {

          if (!row || typeof row !== "object") return;

          var materialId = materialIdToken(row);

          if (!materialId) return;

          if (shouldExcludeFromSemanticReview(row, taskInputSet, attemptOperandSet)) return;



          var role = resolveMaterialRole(row, taskInputSet, attemptOperandSet);

          if (!role) return;



          var obligation = {

            activity_id: activityId,

            material_id: materialId,

            material_type: materialTypeToken(row),

            purpose: String((row && row.purpose) || "").trim(),

            specification: String((row && row.specification) || "").trim(),

            role: role,

            commission_mode: mode,

            learner_task: String((activity && activity.learner_task) || "").trim(),

            expected_output: String((activity && activity.expected_output) || "").trim()

          };

          if (row.practice_independence && typeof row.practice_independence === "object") {

            obligation.practice_independence = row.practice_independence;

          }

          if (row.response_fulfilment && typeof row.response_fulfilment === "object") {

            obligation.response_fulfilment = row.response_fulfilment;

          }

          if (Array.isArray(row.response_fields) && row.response_fields.length) {

            obligation.response_fields = row.response_fields;

          }

          obligations.push(obligation);

        });

      });



      return obligations;

    }



    function formatRoleLabel(role) {

      if (role === "model_complete") return "complete worked/model result";

      if (role === "model_demonstration") return "model demonstration";

      if (role === "learner_operand") return "learner operand";

      return "load-bearing material";

    }



    function buildOperationalSuitabilityAuthoringBlock(page) {

      var obligations = collectSuitabilityObligationsFromPage(page);

      if (!obligations.length) return "";



      var lines = [

        "",

        MARKER + ":",

        "- Authoritative DLA commission below — operational suitability (Case 1) applies locally to listed material(s).",

        "- Generated load-bearing particulars must be mutually consistent and sufficient for the commissioned action/result within intended scope.",

        "- Provide enough coherent information for the commissioned operation; do not emit contradictory or underdetermined particulars when the commission requires identifying or completing a determinate result.",

        "- If purpose/specification promises a complete worked result, reach that promised result — do not stop at partial intermediate steps.",

        "- If the material supplies learner-owned operand particulars, keep them unsolved but operationally usable for expected_output.",

        "- Preserve intentional open-endedness or deliberate insufficiency when learner_task/expected_output makes that the object of learning.",

        "- Preserve response_fulfilment blank cells on workspace rows; do not conflate with S78-WS-2 independence rules.",

        "",

        "Per-material authoring obligations:"

      ];



      obligations.forEach(function (entry) {

        var modeNote = "";

        if (entry.commission_mode === "open_ended") {

          modeNote = " — commission is open-ended/interpretive; do not impose spurious uniqueness.";

        } else if (entry.commission_mode === "deliberate_insufficiency") {

          modeNote =

            " — commission makes missing/insufficient information the object of learning; preserve intentional gaps.";

        } else if (entry.role === "model_complete") {

          modeNote = " — reach the complete result promised by purpose/specification.";

        } else if (entry.role === "learner_operand") {

          modeNote = " — particulars must make expected_output actually achievable; do not pre-solve.";

        }



        lines.push(

          "- " +

            entry.material_id +

            " (" +

            entry.material_type +

            ")" +

            (entry.activity_id ? " in activity " + entry.activity_id : "") +

            " [" +

            formatRoleLabel(entry.role) +

            "]: " +

            (truncate(entry.purpose, 120) || truncate(entry.specification, 160) || "see commission") +

            modeNote

        );

      });



      return lines.join("\n");

    }



    function markerAlreadyPresent(text) {

      return new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(

        String(text || "")

      );

    }



    function applyOperationalSuitabilityBlockToDraft(draftText, page) {

      var draftBody = String(draftText || "").trim();

      if (!draftBody || markerAlreadyPresent(draftBody)) return draftBody;

      var block = buildOperationalSuitabilityAuthoringBlock(page);

      if (!block) return draftBody;

      return (draftBody + block).trim();

    }



    return {

      MARKER: MARKER,

      MODEL_MATERIAL_TYPES: MODEL_MATERIAL_TYPES,

      OPERAND_MATERIAL_TYPES: OPERAND_MATERIAL_TYPES,

      collectSuitabilityObligationsFromPage: collectSuitabilityObligationsFromPage,

      buildOperationalSuitabilityAuthoringBlock: buildOperationalSuitabilityAuthoringBlock,

      markerAlreadyPresent: markerAlreadyPresent,

      applyOperationalSuitabilityBlockToDraft: applyOperationalSuitabilityBlockToDraft,

      activityCommissionMode: activityCommissionMode,

      activityHasLoadBearingProduction: activityHasLoadBearingProduction,

      activityHasSubstantiveLearnerProduction: activityHasSubstantiveLearnerProduction,

      activityRequiresOperationalSuitability: activityRequiresOperationalSuitability,

      specPromisesCompleteWorkedResult: specPromisesCompleteWorkedResult,

      modelCommissionRequiresCompleteReview: modelCommissionRequiresCompleteReview,

      modelCommissionRequiresDemonstrationReview: modelCommissionRequiresDemonstrationReview

    };

  }

);



"use strict";

/**
 * S78-WS-1 — Response fulfilment binding for DLA partial-page capture.
 * Architecture-generic production classifier + fail-closed commissioning gate.
 */

var parseLearnerTask = require("./learner-renderer-vnext/parse-learner-task.js").parseLearnerTask;

var RESPONSE_KINDS = Object.freeze([
  "table_compare",
  "table_complete",
  "table_decide",
  "table_classify",
  "table_plan",
  "text_compose"
]);

var RESPONSE_KIND_SET = Object.freeze(
  RESPONSE_KINDS.reduce(function (acc, kind) {
    acc[kind] = true;
    return acc;
  }, Object.create(null))
);

var FULFILMENT_KINDS = Object.freeze(["learner_workspace", "learner_text_production"]);

var RESPONSE_KIND_ALLOWED_MATERIAL_TYPES = Object.freeze({
  table_compare: Object.freeze({ comparison_table: true }),
  table_complete: Object.freeze({
    analysis_table: true,
    decision_table: true,
    classification_table: true,
    planning_table: true,
    data_table: true,
    impact_table: true,
    comparison_table: true,
    template: true
  }),
  table_decide: Object.freeze({ decision_table: true, analysis_table: true }),
  table_classify: Object.freeze({ classification_table: true }),
  table_plan: Object.freeze({ planning_table: true }),
  text_compose: Object.freeze({ prompt_set: true, template: true, task_card: true })
});

var TEACHING_ONLY_MATERIAL_TYPES = Object.freeze({
  text: true,
  explanatory_note: true,
  checklist: true,
  modelling_note: true,
  worked_example: true,
  sample_output: true,
  reference_table: true,
  consolidation_summary: true
});

var STUDY_STEP_RE =
  /^(study|read|review|work through|examine|look at|follow the|review the|use the checklist|verify|check the|complete the self-check|complete the checklist|complete the verification)\b/i;

var VERIFY_STEP_RE =
  /^(compare your|verify|check|use the checklist|complete the self-check|complete the checklist|complete the .*verification checklist|revise|review your|self-check|consolidate)\b/i;

var TABLE_COMPARE_STEP_RE =
  /\b(comparison table|compare .+ (?:in|into|using|within) (?:the |a )?table|tabular comparison|compare .+ (?:across|between) .+ (?:in|using|within) (?:the |a )?table)\b/i;

var TABLE_COMPLETE_STEP_RE =
  /\b(complete (?:the )?(?:analysis |decision |classification |planning |comparison )?table|fill (?:in )?(?:the )?table|enter .+ (?:into|in) (?:the |a )?table|blank cells)\b/i;

var TABLE_DECIDE_STEP_RE =
  /\b(complete (?:the )?decision table|decide .+ (?:in|using) (?:the |a )?decision table|decision table completion)\b/i;

var TABLE_CLASSIFY_STEP_RE =
  /\b(complete (?:the )?classification table|classify .+ (?:in|using) (?:the |a )?classification (?:table|grid))\b/i;

var TABLE_PLAN_STEP_RE =
  /\b(complete (?:the )?planning table|plan .+ (?:in|using) (?:the |a )?planning table)\b/i;

var TEXT_COMPOSE_STEP_RE =
  /^(write|draft|produce|explain|justify|summari[sz]e|respond with|compose|record your (?:analysis|response|answer))\b/i;

var EXPECTED_OUTPUT_TABLE_COMPARE_RE =
  /\b(comparison table|tabular comparison|compare .+ in (?:a )?table)\b/i;

var EXPECTED_OUTPUT_TABLE_COMPLETE_RE =
  /\b(completed table|complete (?:the )?table|table with learner|fill(?:ed)?-in table|table completion)\b/i;

var EXPECTED_OUTPUT_TEXT_COMPOSE_RE =
  /\b(written (?:response|analysis|memo|explanation)|extended (?:response|writing|prose)|substantive (?:written )?response)\b/i;

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function materialTypeToken(row) {
  return String((row && (row.material_type || row.type)) || "").trim();
}

function isStudyOrVerifyStep(text) {
  var step = String(text || "").trim();
  if (!step) return true;
  if (STUDY_STEP_RE.test(step)) return true;
  if (VERIFY_STEP_RE.test(step)) return true;
  return false;
}

function classifyStepResponseKind(stepText) {
  var text = String(stepText || "").trim();
  if (!text || isStudyOrVerifyStep(text)) return null;

  if (TABLE_COMPARE_STEP_RE.test(text)) return "table_compare";
  if (TABLE_DECIDE_STEP_RE.test(text)) return "table_decide";
  if (TABLE_CLASSIFY_STEP_RE.test(text)) return "table_classify";
  if (TABLE_PLAN_STEP_RE.test(text)) return "table_plan";
  if (TABLE_COMPLETE_STEP_RE.test(text)) {
    if (/\bcomparison table\b/i.test(text)) return "table_compare";
    return "table_complete";
  }
  if (TEXT_COMPOSE_STEP_RE.test(text)) return "text_compose";
  if (/^Compare\b/i.test(text) && /\btable\b/i.test(text)) return "table_compare";
  if (/^Complete the (?:analysis|decision|classification|planning|comparison)/i.test(text)) {
    if (/comparison/i.test(text)) return "table_compare";
    if (/decision/i.test(text)) return "table_decide";
    if (/classification/i.test(text)) return "table_classify";
    if (/planning/i.test(text)) return "table_plan";
    return "table_complete";
  }
  if (/^Enter\b/i.test(text) && /\btable\b/i.test(text)) {
    if (/\bcomparison table\b/i.test(text)) return "table_compare";
    return "table_complete";
  }
  return null;
}

function inferProductionKindsFromExpectedOutput(expectedOutput) {
  var text = String(expectedOutput || "").trim();
  if (!text) return [];
  var kinds = [];
  if (EXPECTED_OUTPUT_TABLE_COMPARE_RE.test(text)) kinds.push("table_compare");
  else if (EXPECTED_OUTPUT_TABLE_COMPLETE_RE.test(text)) kinds.push("table_complete");
  if (EXPECTED_OUTPUT_TEXT_COMPOSE_RE.test(text)) kinds.push("text_compose");
  return kinds;
}

function classifyLearnerProductionSteps(learnerTask, expectedOutput) {
  var steps = parseLearnerTask(learnerTask);
  var classified = steps.map(function (step) {
    var responseKind = classifyStepResponseKind(step.text);
    return {
      stepNumber: step.sourceStepNumber,
      text: step.text,
      responseKind: responseKind
    };
  });

  var productionKinds = [];
  classified.forEach(function (entry) {
    if (entry.responseKind && productionKinds.indexOf(entry.responseKind) === -1) {
      productionKinds.push(entry.responseKind);
    }
  });

  if (!productionKinds.length) {
    inferProductionKindsFromExpectedOutput(expectedOutput).forEach(function (kind) {
      if (productionKinds.indexOf(kind) === -1) productionKinds.push(kind);
    });
  }

  return {
    steps: classified,
    productionKinds: productionKinds
  };
}

function allowedMaterialTypesForKind(responseKind) {
  return RESPONSE_KIND_ALLOWED_MATERIAL_TYPES[responseKind] || null;
}

function materialTypeCompatibleWithResponseKind(materialType, responseKind) {
  var allowed = allowedMaterialTypesForKind(responseKind);
  if (!allowed) return false;
  return !!allowed[String(materialType || "").trim()];
}

function validateResponseFulfilmentShape(value, path, errors) {
  if (value == null) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(path + " must be an object when present");
    return;
  }
  var kind = String(value.kind || "").trim();
  if (FULFILMENT_KINDS.indexOf(kind) === -1) {
    errors.push(
      path + '.kind must be "learner_workspace" or "learner_text_production" when present'
    );
  }
  var responseKind = String(value.response_kind || "").trim();
  if (!RESPONSE_KIND_SET[responseKind]) {
    errors.push(path + ".response_kind must be a recognised production response kind when present");
  }
  if (kind === "learner_text_production" && responseKind && responseKind.indexOf("table_") === 0) {
    errors.push(path + ".kind learner_text_production is incompatible with table response_kind");
  }
  if (kind === "learner_workspace" && responseKind === "text_compose") {
    errors.push(path + ".kind learner_workspace is incompatible with response_kind text_compose");
  }
  if (value.binds_production_steps != null) {
    if (!Array.isArray(value.binds_production_steps) || !value.binds_production_steps.length) {
      errors.push(path + ".binds_production_steps must be a non-empty number array when present");
    } else {
      value.binds_production_steps.forEach(function (stepNum, index) {
        if (!Number.isInteger(stepNum) || stepNum < 1) {
          errors.push(
            path + ".binds_production_steps[" + index + "] must be a positive integer step number"
          );
        }
      });
    }
  }
  if (value.allows_partial_exemplar != null && typeof value.allows_partial_exemplar !== "boolean") {
    errors.push(path + ".allows_partial_exemplar must be boolean when present");
  }
}

function rowFulfilsProductionKind(row, productionKind) {
  if (!row || typeof row !== "object") return false;
  var rf = row.response_fulfilment;
  if (!rf || typeof rf !== "object") return false;
  if (String(rf.response_kind || "").trim() !== productionKind) return false;
  return materialTypeCompatibleWithResponseKind(materialTypeToken(row), productionKind);
}

function appendResponseFulfilmentValidationErrors(activity, activityIndex, errors) {
  var activityId = nonEmptyString(activity && activity.activity_id)
    ? String(activity.activity_id).trim()
    : "activities[" + activityIndex + "]";
  var requiredMaterials = Array.isArray(activity && activity.required_materials)
    ? activity.required_materials
    : [];
  var classification = classifyLearnerProductionSteps(
    activity && activity.learner_task,
    activity && activity.expected_output
  );
  var productionKinds = classification.productionKinds;

  requiredMaterials.forEach(function (row, reqIndex) {
    if (!row || typeof row !== "object" || !Object.prototype.hasOwnProperty.call(row, "response_fulfilment")) {
      return;
    }
    var rowPath =
      "activities[" + activityIndex + "].required_materials[" + reqIndex + "]";
    var materialId = nonEmptyString(row.material_id) ? String(row.material_id).trim() : rowPath;
    var rf = row.response_fulfilment;
    if (!rf || typeof rf !== "object") return;

    var responseKind = String(rf.response_kind || "").trim();
    var materialType = materialTypeToken(row);

    if (responseKind && !materialTypeCompatibleWithResponseKind(materialType, responseKind)) {
      errors.push(
        "S78_WS_INCOMPATIBLE_TYPE: " +
          rowPath +
          " (" +
          materialId +
          ") has response_fulfilment.response_kind=" +
          responseKind +
          " but material_type=" +
          materialType
      );
    }

    if (TEACHING_ONLY_MATERIAL_TYPES[materialType] && responseKind.indexOf("table_") === 0) {
      errors.push(
        "S78_WS_INCOMPATIBLE_TYPE: " +
          rowPath +
          " (" +
          materialId +
          ") teaching/display material_type=" +
          materialType +
          " cannot fulfil response_kind=" +
          responseKind
      );
    }

    if (materialType === "reference_table") {
      errors.push(
        "S78_WS_INCOMPATIBLE_TYPE: " +
          rowPath +
          " (" +
          materialId +
          ") reference_table cannot carry learner_workspace response_fulfilment"
      );
    }
  });

  var stepBindingMap = Object.create(null);
  requiredMaterials.forEach(function (row, reqIndex) {
    var rf = row && row.response_fulfilment;
    if (!rf || !Array.isArray(rf.binds_production_steps)) return;
    var materialId = nonEmptyString(row.material_id) ? String(row.material_id).trim() : "row" + reqIndex;
    rf.binds_production_steps.forEach(function (stepNum) {
      if (!Number.isInteger(stepNum) || stepNum < 1) return;
      if (!stepBindingMap[stepNum]) stepBindingMap[stepNum] = [];
      stepBindingMap[stepNum].push({
        materialId: materialId,
        responseKind: String(rf.response_kind || "").trim(),
        reqIndex: reqIndex
      });
    });
  });

  Object.keys(stepBindingMap).forEach(function (stepKey) {
    var bindings = stepBindingMap[stepKey];
    if (bindings.length <= 1) return;
    var kinds = bindings.map(function (b) {
      return b.responseKind;
    });
    var uniqueKinds = kinds.filter(function (kind, index) {
      return kinds.indexOf(kind) === index;
    });
    if (uniqueKinds.length > 1) {
      errors.push(
        "S78_WS_UNBOUND_PRODUCTION: activities[" +
          activityIndex +
          "] (" +
          activityId +
          ") ambiguous binds_production_steps for step " +
          stepKey +
          " across material_ids " +
          bindings
            .map(function (b) {
              return b.materialId;
            })
            .join(", ")
      );
    }
  });

  if (!productionKinds.length) return;

  productionKinds.forEach(function (productionKind) {
    var fulfillingRows = requiredMaterials.filter(function (row) {
      return rowFulfilsProductionKind(row, productionKind);
    });
    if (fulfillingRows.length) return;

    var stepHint = classification.steps.find(function (step) {
      return step.responseKind === productionKind;
    });
    var stepNumber = stepHint ? stepHint.stepNumber : null;
    var stepSnippet = stepHint ? stepHint.text.slice(0, 80) : "";
    var commissionedIds = requiredMaterials
      .map(function (row) {
        return nonEmptyString(row && row.material_id) ? String(row.material_id).trim() : "";
      })
      .filter(Boolean)
      .join(", ");

    errors.push(
      "S78_WS_UNBOUND_PRODUCTION: activities[" +
        activityIndex +
        "] (" +
        activityId +
        ") requires response_kind=" +
        productionKind +
        (stepNumber != null ? " from learner_task step " + stepNumber : "") +
        (stepSnippet ? ' ("' + stepSnippet + '")' : "") +
        "; no required_materials[] row with response_fulfilment + compatible material_type" +
        (commissionedIds ? "; commissioned material_ids: " + commissionedIds : "")
    );
  });
}

module.exports = {
  RESPONSE_KINDS: RESPONSE_KINDS,
  RESPONSE_KIND_ALLOWED_MATERIAL_TYPES: RESPONSE_KIND_ALLOWED_MATERIAL_TYPES,
  TEACHING_ONLY_MATERIAL_TYPES: TEACHING_ONLY_MATERIAL_TYPES,
  classifyLearnerProductionSteps: classifyLearnerProductionSteps,
  validateResponseFulfilmentShape: validateResponseFulfilmentShape,
  appendResponseFulfilmentValidationErrors: appendResponseFulfilmentValidationErrors,
  materialTypeCompatibleWithResponseKind: materialTypeCompatibleWithResponseKind
};

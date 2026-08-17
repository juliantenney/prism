"use strict";

/**
 * S78-WS-2 — GAM operand-aware model/practice independence prompt block.
 * Stage 1: prompt-contract authoring only (no semantic validation).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_GAM_PRACTICE_INDEPENDENCE_PROMPT = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

var MARKER = "S78-WS-2 MODEL-PRACTICE-INDEPENDENCE (auto-applied)";

var MODEL_MATERIAL_TYPES = Object.freeze({
  worked_example: true,
  modelling_note: true
});

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function materialTypeToken(row) {
  return String((row && (row.material_type || row.type)) || "").trim();
}

function materialIdToken(row) {
  return nonEmptyString(row && row.material_id) ? String(row.material_id).trim() : "";
}

function rowByMaterialId(requiredMaterials) {
  var map = Object.create(null);
  (requiredMaterials || []).forEach(function (row) {
    var id = materialIdToken(row);
    if (id) map[id] = row;
  });
  return map;
}

function collectPracticeIndependenceBindingsFromPage(page) {
  var activities = Array.isArray(page && page.activities) ? page.activities : [];
  var bindings = [];

  activities.forEach(function (activity) {
    var activityId = nonEmptyString(activity && activity.activity_id)
      ? String(activity.activity_id).trim()
      : "";
    var requiredMaterials = Array.isArray(activity && activity.required_materials)
      ? activity.required_materials
      : [];
    var byId = rowByMaterialId(requiredMaterials);

    requiredMaterials.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      if (!MODEL_MATERIAL_TYPES[materialTypeToken(row)]) return;
      var pi = row.practice_independence;
      if (!pi || typeof pi !== "object") return;
      var operandIds = Array.isArray(pi.attempt_operand_material_ids)
        ? pi.attempt_operand_material_ids
            .map(function (id) {
              return nonEmptyString(id) ? String(id).trim() : "";
            })
            .filter(Boolean)
        : [];
      if (!operandIds.length) return;

      var attemptOperands = operandIds.map(function (operandId) {
        var operandRow = byId[operandId] || null;
        return {
          material_id: operandId,
          material_type: operandRow ? materialTypeToken(operandRow) : "",
          specification: operandRow ? String(operandRow.specification || "").trim() : ""
        };
      });

      bindings.push({
        activity_id: activityId,
        model_material_id: materialIdToken(row),
        model_material_type: materialTypeToken(row),
        attempt_operand_material_ids: operandIds.slice(),
        attempt_operands: attemptOperands
      });
    });
  });

  return bindings;
}

function formatOperandSummary(operands) {
  return operands
    .map(function (op) {
      var typePart = op.material_type ? " (" + op.material_type + ")" : "";
      return op.material_id + typePart;
    })
    .join(", ");
}

function buildS78Ws2OperandAwareAuthoringBlock(page) {
  var bindings = collectPracticeIndependenceBindingsFromPage(page);
  if (!bindings.length) return "";

  var lines = [
    "",
    MARKER + ":",
    "- Authoritative DLA practice_independence bindings below — do not infer model/attempt pairing from task verbs when present.",
    "- When emitting the listed model material(s): demonstrate the same target method/capability on a DISTINCT comparable operand; do not use any bound attempt operand as the worked instance.",
    "- MUST NOT copy, restate, solve, answer, or substantially complete load-bearing reasoning for bound attempt operand(s) in the model body.",
    "- **Bridge:** transfer method, sequence, decision process, or criteria — not the attempt's answer, attempt-specific calculations, or final conclusion.",
    "- Bound attempt operand material bodies (scenario, task_card, etc.) remain learner-owned; preserve response_fulfilment blank cells on workspace rows.",
    "",
    "Per-binding authoring obligations:"
  ];

  bindings.forEach(function (binding) {
    lines.push(
      "- Model " +
        binding.model_material_id +
        " (" +
        binding.model_material_type +
        ")" +
        (binding.activity_id ? " in activity " + binding.activity_id : "") +
        ": attempt operand material_id(s) " +
        formatOperandSummary(binding.attempt_operands) +
        " are LEARNER-OWNED — author this model on a different near-transfer instance; do not disclose or complete those operands."
    );
  });

  return lines.join("\n");
}

function ws2MarkerAlreadyPresent(text) {
  return new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(
    String(text || "")
  );
}

function applyS78Ws2PracticeIndependenceBlockToDraft(draftText, page) {
  var draftBody = String(draftText || "").trim();
  if (!draftBody || ws2MarkerAlreadyPresent(draftBody)) return draftBody;
  var block = buildS78Ws2OperandAwareAuthoringBlock(page);
  if (!block) return draftBody;
  return (draftBody + block).trim();
}

return {
  MARKER: MARKER,
  MODEL_MATERIAL_TYPES: MODEL_MATERIAL_TYPES,
  collectPracticeIndependenceBindingsFromPage: collectPracticeIndependenceBindingsFromPage,
  buildS78Ws2OperandAwareAuthoringBlock: buildS78Ws2OperandAwareAuthoringBlock,
  ws2MarkerAlreadyPresent: ws2MarkerAlreadyPresent,
  applyS78Ws2PracticeIndependenceBlockToDraft: applyS78Ws2PracticeIndependenceBlockToDraft
};
});

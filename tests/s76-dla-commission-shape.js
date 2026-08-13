/**
 * Sprint 76 fixture migration helper for P01/P03 shape on existing DLA test pages.
 * Does not invent evidence_decision when absent (missing object remains a P02 fail).
 * Does not infer task-input need from learner_task prose.
 */
"use strict";

function ordinaryCommissionFields(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return row;
  const out = Object.assign({}, row);
  if (!String(out.purpose || "").trim()) {
    out.purpose = "Support the learner task.";
  }
  if (!String(out.specification || "").trim()) {
    out.specification = String(out.purpose).trim() + " authoring bounds.";
  }
  return out;
}

function deriveTaskMaterialDecision(activity) {
  const decision = activity && activity.evidence_decision;
  if (
    decision &&
    decision.required === true &&
    Array.isArray(decision.provider_material_ids) &&
    decision.provider_material_ids.length
  ) {
    return {
      separate_inputs_required: true,
      task_input_material_ids: decision.provider_material_ids.map(function (id) {
        return String(id);
      })
    };
  }
  return {
    separate_inputs_required: false,
    task_input_material_ids: []
  };
}

function applyS76CommissionShape(activity, options) {
  const opts = options && typeof options === "object" ? options : {};
  if (!activity || typeof activity !== "object" || Array.isArray(activity)) return activity;
  const next = Object.assign({}, activity);
  if (Array.isArray(next.required_materials)) {
    next.required_materials = next.required_materials.map(ordinaryCommissionFields);
  } else if (!Object.prototype.hasOwnProperty.call(next, "required_materials")) {
    next.required_materials = [];
  }
  if (!next.task_material_decision) {
    next.task_material_decision = deriveTaskMaterialDecision(next);
  }
  if (opts.fillBridge && !String(next.intellectual_coherence_bridge || "").trim()) {
    next.intellectual_coherence_bridge =
      "You have the page orientation; now complete this activity's production.";
  }
  if (opts.fillEvidenceDecision && !next.evidence_decision) {
    next.evidence_decision = {
      required: false,
      reason: "No epistemic evidence dependence declared.",
      provider_material_ids: []
    };
  }
  return next;
}

function applyS76CommissionShapeToPage(page, options) {
  if (!page || typeof page !== "object" || !Array.isArray(page.activities)) return page;
  return Object.assign({}, page, {
    activities: page.activities.map(function (activity) {
      return applyS76CommissionShape(activity, options);
    })
  });
}

module.exports = {
  ordinaryCommissionFields: ordinaryCommissionFields,
  applyS76CommissionShape: applyS76CommissionShape,
  applyS76CommissionShapeToPage: applyS76CommissionShapeToPage
};

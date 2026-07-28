"use strict";

/**
 * Sprint 38 render-plan helpers for vNext (browser-bundle safe).
 * Mirrors lib/sprint38-visual-affordances.js buildVisualAffordanceRenderPlan / resolveSlotGenerate.
 */

function normalizeActivityIdKey(id) {
  return String(id == null ? "" : id)
    .trim()
    .toLowerCase();
}

function normalizeVisualSlotKey(slot) {
  return String(slot == null ? "" : slot)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
}

function resolveRenderPlanScopeKey(row) {
  var scope = String((row && row.scope) || "").trim();
  if (scope === "page") return "page";
  if (
    !scope &&
    row &&
    !String(row.activity_id || "").trim() &&
    String(row.region || "").trim()
  ) {
    return "page";
  }
  return normalizeActivityIdKey(row && row.activity_id);
}

function buildVisualAffordanceRenderPlan(page) {
  var list = page && Array.isArray(page.visual_affordances) ? page.visual_affordances : [];
  if (!list.length) {
    return { legacy: true, slotGenerate: {} };
  }
  var slotGenerate = {};
  list.forEach(function (row) {
    if (!row || typeof row !== "object") return;
    if (String(row.visual_decision || "").trim() !== "generate") return;
    var slot = normalizeVisualSlotKey(row.visual_slot);
    if (!slot) return;
    var aid = resolveRenderPlanScopeKey(row);
    if (!aid) return;
    var key = aid + "|" + slot;
    slotGenerate[key] = {
      affordance_id: String(row.affordance_id || "").trim(),
      activity_id: String(row.activity_id || "").trim(),
      visual_slot: slot,
      purpose: row.purpose,
      preferred_representation: row.preferred_representation
    };
  });
  return {
    legacy: false,
    slotGenerate: slotGenerate,
    affordance_count: list.length
  };
}

function resolveSlotGenerate(plan, activityId, slot) {
  if (!plan || plan.legacy) return null;
  var aid = normalizeActivityIdKey(activityId);
  var slotId = normalizeVisualSlotKey(slot);
  if (!slotId) return null;
  // Page-scoped slots are keyed as "page|<slot>" and resolved with empty activityId.
  if (!aid) aid = "page";
  return plan.slotGenerate[aid + "|" + slotId] || null;
}

module.exports = {
  normalizeActivityIdKey: normalizeActivityIdKey,
  normalizeVisualSlotKey: normalizeVisualSlotKey,
  buildVisualAffordanceRenderPlan: buildVisualAffordanceRenderPlan,
  resolveSlotGenerate: resolveSlotGenerate
};

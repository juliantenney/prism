"use strict";

/**
 * Regression test: Sprint 38 plan-authorised slots must be placed even when
 * the activity contains no matching legacy material type (e.g. card-grid-after
 * with no scenario/prompt_set material).
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const placements = require("../lib/learner-renderer-vnext/build-visual-affordance-placements");
const s38 = require("../lib/learner-renderer-vnext/sprint38-visual-affordance-plan");

function buildModel(activities) {
  return { activities: activities, orientationSections: [] };
}

function findHooks(model) {
  var hooks = [];
  model.activities.forEach(function (act) {
    (act.beats || []).forEach(function (beat) {
      (beat.contentSequence || []).forEach(function (item, i) {
        if (item.visualAffordanceBefore) {
          hooks.push({ pos: "before", index: i, slot: item.visualAffordanceBefore.slot,
            activityId: item.visualAffordanceBefore.activityId });
        }
        if (item.visualAffordanceAfter) {
          hooks.push({ pos: "after", index: i, slot: item.visualAffordanceAfter.slot,
            activityId: item.visualAffordanceAfter.activityId });
        }
      });
    });
  });
  return hooks;
}

test("materials-card-grid-after placed on first material when plan authorises but no card-grid type exists", () => {
  const page = {
    visual_affordances: [{
      affordance_id: "va-a2-process-01", scope: "activity", activity_id: "A2",
      visual_decision: "generate", visual_slot: "materials-card-grid-after"
    }]
  };
  const model = buildModel([{
    id: "A2", title: "Engineering",
    beats: [{
      contentSequence: [
        { kind: "material", material: { type: "worked_example" } },
        { kind: "material", material: { type: "analysis_table" } }
      ]
    }]
  }]);
  placements.attachVisualAffordancePlacements(page, model);
  const hooks = findHooks(model);
  const cardGridHook = hooks.find(h => h.slot === "materials-card-grid-after");
  assert.ok(cardGridHook, "materials-card-grid-after hook must be placed");
  assert.equal(cardGridHook.pos, "after");
  assert.equal(cardGridHook.activityId, "A2");
});

test("materials-card-grid-after prefers actual card-grid material when present", () => {
  const page = {
    visual_affordances: [{
      affordance_id: "va-test", scope: "activity", activity_id: "A1",
      visual_decision: "generate", visual_slot: "materials-card-grid-after"
    }]
  };
  const model = buildModel([{
    id: "A1", title: "Test",
    beats: [{
      contentSequence: [
        { kind: "material", material: { type: "text" } },
        { kind: "material", material: { type: "scenario" } },
        { kind: "material", material: { type: "checklist" } }
      ]
    }]
  }]);
  placements.attachVisualAffordancePlacements(page, model);
  const hooks = findHooks(model);
  const cardGridHook = hooks.find(h => h.slot === "materials-card-grid-after");
  assert.ok(cardGridHook, "hook placed");
  assert.equal(cardGridHook.index, 1, "placed on the scenario (card-grid) material, not first material");
});

test("materials-table-pair-between placed on first material when plan authorises but no table type exists", () => {
  const page = {
    visual_affordances: [{
      affordance_id: "va-test", scope: "activity", activity_id: "A1",
      visual_decision: "generate", visual_slot: "materials-table-pair-between"
    }]
  };
  const model = buildModel([{
    id: "A1", title: "Test",
    beats: [{
      contentSequence: [
        { kind: "material", material: { type: "text" } },
        { kind: "material", material: { type: "worked_example" } }
      ]
    }]
  }]);
  placements.attachVisualAffordancePlacements(page, model);
  const hooks = findHooks(model);
  const tablePairHook = hooks.find(h => h.slot === "materials-table-pair-between");
  assert.ok(tablePairHook, "materials-table-pair-between hook must be placed");
  assert.equal(tablePairHook.pos, "after");
});

test("legacy path does NOT place card-grid-after without matching material type", () => {
  const page = { visual_affordances: [] };
  const model = buildModel([{
    id: "A2", title: "Test",
    beats: [{
      contentSequence: [
        { kind: "material", material: { type: "worked_example" } },
        { kind: "material", material: { type: "analysis_table" } }
      ]
    }]
  }]);
  placements.attachVisualAffordancePlacements(page, model);
  const hooks = findHooks(model);
  const cardGridHook = hooks.find(h => h.slot === "materials-card-grid-after");
  assert.equal(cardGridHook, undefined, "legacy path should not fabricate card-grid-after");
});

test("hook placed only once per activity even with multiple materials", () => {
  const page = {
    visual_affordances: [{
      affordance_id: "va-test", scope: "activity", activity_id: "A1",
      visual_decision: "generate", visual_slot: "materials-card-grid-after"
    }]
  };
  const model = buildModel([{
    id: "A1", title: "Test",
    beats: [{
      contentSequence: [
        { kind: "material", material: { type: "text" } },
        { kind: "material", material: { type: "worked_example" } },
        { kind: "material", material: { type: "checklist" } }
      ]
    }]
  }]);
  placements.attachVisualAffordancePlacements(page, model);
  const hooks = findHooks(model);
  const cardGridHooks = hooks.filter(h => h.slot === "materials-card-grid-after");
  assert.equal(cardGridHooks.length, 1, "exactly one hook per activity");
});

test("plan-authorised materials-table-pair-between is consumed once across multiple tables", () => {
  const page = {
    visual_affordances: [{
      affordance_id: "va-pair", scope: "activity", activity_id: "A4",
      visual_decision: "generate", visual_slot: "materials-table-pair-between"
    }]
  };
  const model = buildModel([{
    id: "A4", title: "Compare",
    beats: [{
      contentSequence: [
        { kind: "material", material: { type: "comparison_table" } },
        { kind: "material", material: { type: "comparison_table" } },
        { kind: "material", material: { type: "checklist" } }
      ]
    }]
  }]);
  placements.attachVisualAffordancePlacements(page, model);
  const hooks = findHooks(model).filter(h => h.slot === "materials-table-pair-between");
  assert.equal(hooks.length, 1, "exactly one table-pair-between hook");
  assert.equal(hooks[0].index, 0, "placed after the first table in the pair");
  assert.equal(hooks[0].pos, "after");
});

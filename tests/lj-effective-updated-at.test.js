/**
 * Learning Journey effectiveUpdatedAt for My Workflows display + Updated sorting.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const hierarchy = require("../lib/learning-journey-workflow-hierarchy.js");

function lj(id, updatedAt) {
  return {
    id,
    name: id,
    product: "learning_journey",
    updatedAt: updatedAt,
    steps: []
  };
}

function child(id, sourceWorkflowId, updatedAt, product) {
  return {
    id,
    name: id,
    product: product || "interactive",
    sourceWorkflowId,
    sourceCommissionId: "c-" + id,
    updatedAt,
    steps: []
  };
}

test("1. Child updated after parent → LJ effective equals child", () => {
  const parent = lj("wf-lj", 1000);
  const c1 = child("wf-c1", "wf-lj", 5000);
  const all = [parent, c1];
  assert.equal(hierarchy.resolveWorkflowEffectiveUpdatedAt(parent, all), 5000);
  assert.equal(parent.updatedAt, 1000, "stored parent updatedAt unchanged");
  assert.equal(c1.updatedAt, 5000);
});

test("2. Parent updated after all children → LJ effective equals parent", () => {
  const parent = lj("wf-lj", 9000);
  const c1 = child("wf-c1", "wf-lj", 2000);
  const c2 = child("wf-c2", "wf-lj", 3000);
  assert.equal(
    hierarchy.resolveWorkflowEffectiveUpdatedAt(parent, [parent, c1, c2]),
    9000
  );
});

test("3. Multiple children with different timestamps → max child", () => {
  const parent = lj("wf-lj", 1000);
  const c1 = child("wf-c1", "wf-lj", 4000);
  const c2 = child("wf-c2", "wf-lj", 7000, "expository");
  const c3 = child("wf-c3", "wf-lj", 2000, "assessment_pack");
  assert.equal(
    hierarchy.resolveWorkflowEffectiveUpdatedAt(parent, [parent, c1, c2, c3]),
    7000
  );
});

test("4. Child deleted or moved → effective recalculates without it", () => {
  const parent = lj("wf-lj", 1000);
  const c1 = child("wf-c1", "wf-lj", 8000);
  const c2 = child("wf-c2", "wf-lj", 3000);
  assert.equal(
    hierarchy.resolveWorkflowEffectiveUpdatedAt(parent, [parent, c1, c2]),
    8000
  );
  // deleted
  assert.equal(
    hierarchy.resolveWorkflowEffectiveUpdatedAt(parent, [parent, c2]),
    3000
  );
  // moved to another parent
  const moved = child("wf-c1", "wf-other", 8000);
  assert.equal(
    hierarchy.resolveWorkflowEffectiveUpdatedAt(parent, [parent, c2, moved]),
    3000
  );
});

test("5. Unrelated workflow updated does not affect LJ effective", () => {
  const parent = lj("wf-lj", 1000);
  const c1 = child("wf-c1", "wf-lj", 2000);
  const unrelated = {
    id: "wf-u",
    name: "Unrelated",
    product: "interactive",
    updatedAt: 99999,
    steps: []
  };
  const ambiguous = child("wf-amb", "wf-missing", 88888);
  assert.equal(
    hierarchy.resolveWorkflowEffectiveUpdatedAt(parent, [
      parent,
      c1,
      unrelated,
      ambiguous
    ]),
    2000
  );
  assert.equal(
    hierarchy.resolveWorkflowEffectiveUpdatedAt(unrelated, [
      parent,
      c1,
      unrelated,
      ambiguous
    ]),
    99999,
    "standalone uses own timestamp"
  );
});

test("6. Missing or invalid timestamps fall back safely", () => {
  const parent = lj("wf-lj", undefined);
  delete parent.updatedAt;
  const c1 = child("wf-c1", "wf-lj", "nope");
  const c2 = child("wf-c2", "wf-lj", -5);
  const c3 = child("wf-c3", "wf-lj", 4500);
  assert.equal(
    hierarchy.resolveWorkflowEffectiveUpdatedAt(parent, [parent, c1, c2, c3]),
    4500
  );
  assert.equal(hierarchy.resolveWorkflowEffectiveUpdatedAt(parent, [parent]), 0);
  assert.equal(hierarchy.readWorkflowUpdatedAtMs(null), 0);
  assert.equal(hierarchy.readWorkflowUpdatedAtMs({ updatedAt: NaN }), 0);
});

test("7. Nested Learning Journey ownership is transitive", () => {
  const root = lj("wf-root", 1000);
  const nestedLj = Object.assign(lj("wf-nested", 2000), {
    sourceWorkflowId: "wf-root",
    sourceCommissionId: "c-nested"
  });
  const leaf = child("wf-leaf", "wf-nested", 12000);
  const all = [root, nestedLj, leaf];
  assert.equal(hierarchy.resolveWorkflowEffectiveUpdatedAt(root, all), 12000);
  assert.equal(hierarchy.resolveWorkflowEffectiveUpdatedAt(nestedLj, all), 12000);
  assert.equal(root.updatedAt, 1000);
  assert.equal(nestedLj.updatedAt, 2000);
  assert.equal(leaf.updatedAt, 12000);
});

test("8. Display and sort use the same derived value", () => {
  const parent = lj("wf-lj", 1000);
  const c1 = child("wf-c1", "wf-lj", 6000);
  const older = lj("wf-older", 5000);
  const standalone = {
    id: "wf-solo",
    name: "Solo",
    product: "interactive",
    updatedAt: 5500,
    steps: []
  };
  const all = [parent, c1, older, standalone];

  const effectiveParent = hierarchy.resolveWorkflowEffectiveUpdatedAt(parent, all);
  const effectiveOlder = hierarchy.resolveWorkflowEffectiveUpdatedAt(older, all);
  const effectiveSolo = hierarchy.resolveWorkflowEffectiveUpdatedAt(standalone, all);
  assert.equal(effectiveParent, 6000);
  assert.equal(effectiveOlder, 5000);
  assert.equal(effectiveSolo, 5500);

  // Updated (newest) among top-level rows uses the same derived parent value.
  const topLevel = [parent, older, standalone].slice().sort(function (a, b) {
    return (
      hierarchy.resolveWorkflowEffectiveUpdatedAt(b, all) -
      hierarchy.resolveWorkflowEffectiveUpdatedAt(a, all)
    );
  });
  assert.deepEqual(
    topLevel.map((w) => w.id),
    ["wf-lj", "wf-solo", "wf-older"]
  );
  assert.equal(
    hierarchy.resolveWorkflowEffectiveUpdatedAt(topLevel[0], all),
    effectiveParent
  );
  assert.equal(
    hierarchy.resolveWorkflowEffectiveUpdatedAt(c1, all),
    6000,
    "child display/sort key remains its own stored updatedAt"
  );
});

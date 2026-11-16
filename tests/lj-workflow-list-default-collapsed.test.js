/**
 * Learning Journey My Workflows entries default to collapsed.
 * Non-LJ workflow list behaviour is unchanged.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const hierarchy = require("../lib/learning-journey-workflow-hierarchy.js");

function lj(id, name) {
  return {
    id: id,
    name: name || id,
    product: "learning_journey",
    steps: [{ id: "s1", title: "Design Page", canonical_step_id: "step_design_page" }],
    updatedAt: 100
  };
}

function child(id, name, sourceWorkflowId, sourceCommissionId) {
  return {
    id: id,
    name: name,
    product: "interactive",
    sourceWorkflowId: sourceWorkflowId,
    sourceCommissionId: sourceCommissionId,
    steps: [{ id: "c1", title: "Design Page" }],
    updatedAt: 200
  };
}

test("new LJ parents start collapsed until explicitly expanded", () => {
  const workflows = [lj("wf-new", "New Journey"), child("wf-c1", "Child", "wf-new", "c1")];
  const collapsed = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {
    expandedById: {}
  });
  assert.equal(collapsed.rows[0].type, "lj_parent");
  assert.equal(collapsed.rows[0].expanded, false);
  assert.equal(collapsed.rows[0].hasChildren, true);
  assert.equal(hierarchy.isLearningJourneyListExpanded({}, "wf-new"), false);

  const afterExpand = hierarchy.setLearningJourneyListExpanded({}, "wf-new", true);
  const expanded = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {
    expandedById: afterExpand
  });
  assert.equal(expanded.rows[0].expanded, true);
  assert.equal(hierarchy.isLearningJourneyListExpanded(afterExpand, "wf-new"), true);

  const afterCollapse = hierarchy.setLearningJourneyListExpanded(afterExpand, "wf-new", false);
  const collapsedAgain = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {
    expandedById: afterCollapse
  });
  assert.equal(collapsedAgain.rows[0].expanded, false);
  assert.equal(hierarchy.isLearningJourneyListExpanded(afterCollapse, "wf-new"), false);
});

test("non-LJ rows remain standalone and unaffected by LJ disclosure defaults", () => {
  const workflows = [
    { id: "wf-interactive", name: "Interactive", product: "interactive", steps: [], updatedAt: 2 },
    { id: "wf-expository", name: "Expository", product: "expository", steps: [], updatedAt: 1 },
    lj("wf-lj", "Journey"),
    child("wf-c1", "Child", "wf-lj", "c1")
  ];
  const built = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {});
  assert.deepEqual(
    built.rows.map((row) => [row.type, row.workflow.id, row.expanded]),
    [
      ["standalone", "wf-interactive", false],
      ["standalone", "wf-expository", false],
      ["lj_parent", "wf-lj", false]
    ]
  );
  assert.equal(built.childWorkflowIds["wf-c1"], "wf-lj");
});

test("explicit expanded state is preserved across ordinary presentation rebuilds", () => {
  const workflows = [lj("wf-lj", "Journey"), child("wf-c1", "Child", "wf-lj", "c1")];
  const expandedById = hierarchy.setLearningJourneyListExpanded({}, "wf-lj", true);
  const first = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {
    expandedById: expandedById
  });
  const second = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {
    expandedById: expandedById
  });
  assert.equal(first.rows[0].expanded, true);
  assert.equal(second.rows[0].expanded, true);
  assert.deepEqual(first.rows[0].children.map((c) => c.id), ["wf-c1"]);
  assert.deepEqual(second.rows[0].children.map((c) => c.id), ["wf-c1"]);
});

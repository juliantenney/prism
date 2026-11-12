/**
 * My Workflows list: coalesce status-evidence hydrate refreshes so selecting a
 * Learning Journey after refresh does not rebuild the list once per child.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function boot() {
  return loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-workflow-hierarchy.js",
      "lib/workflow-list-presentation.js"
    ]
  });
}

test("status-evidence hydrate settle defers refresh while hydrates remain in flight", () => {
  const { api } = boot();
  api.clearWorkflowListStatusEvidenceCacheForTest();
  api.markWorkflowListStatusHydrateInFlightForTest("wf-c02", true);
  api.markWorkflowListStatusHydrateInFlightForTest("wf-c03", true);
  api.markWorkflowListStatusHydrateInFlightForTest("wf-c04", true);

  const mid = api.settleWorkflowListStatusEvidenceHydrateForTest({ needsRefresh: true });
  assert.equal(mid.deferred, true);
  assert.equal(api.isWorkflowListStatusHydrateRefreshPendingForTest(), true);
  assert.equal(api.countWorkflowListStatusHydratesInFlightForTest(), 3);

  api.markWorkflowListStatusHydrateInFlightForTest("wf-c02", false);
  const still = api.settleWorkflowListStatusEvidenceHydrateForTest({ needsRefresh: true });
  assert.equal(still.deferred, true);
  assert.equal(api.countWorkflowListStatusHydratesInFlightForTest(), 2);

  api.markWorkflowListStatusHydrateInFlightForTest("wf-c03", false);
  api.markWorkflowListStatusHydrateInFlightForTest("wf-c04", false);
  const done = api.settleWorkflowListStatusEvidenceHydrateForTest({ needsRefresh: false });
  assert.equal(done.deferred, false);
  assert.equal(done.refreshed, true);
  assert.equal(api.isWorkflowListStatusHydrateRefreshPendingForTest(), false);
  assert.equal(api.countWorkflowListStatusHydratesInFlightForTest(), 0);
});

test("idle settle without pending refresh does not rebuild", () => {
  const { api } = boot();
  api.clearWorkflowListStatusEvidenceCacheForTest();
  const result = api.settleWorkflowListStatusEvidenceHydrateForTest({ needsRefresh: false });
  assert.equal(result.deferred, false);
  assert.equal(result.refreshed, false);
  assert.equal(api.isWorkflowListStatusHydrateRefreshPendingForTest(), false);
});

test("parent Learning Journey selection stays selected across coalesced hydrate settle", () => {
  const { api } = boot();
  api.clearWorkflowListStatusEvidenceCacheForTest();
  const lj = {
    id: "wf-lj",
    name: "The Feedback That Changed the Work Journal Test",
    product: "learning_journey",
    steps: [{ id: "dp", title: "Design Page", canonical_step_id: "step_design_page" }],
    updatedAt: 1
  };
  const children = ["c02", "c03", "c04", "c05", "c06", "c01"].map(function (id, index) {
    return {
      id: "wf-" + id,
      name: "Child " + id,
      product: "assessment_pack",
      sourceWorkflowId: "wf-lj",
      sourceCommissionId: id,
      steps: [{ id: "dp", title: "Design Page", canonical_step_id: "step_design_page" }],
      updatedAt: index + 2
    };
  });
  api.setWorkflowsForTest([lj].concat(children));
  api.setLearningJourneyListExpandedForParentForTest("wf-lj", true);
  api.renderWorkflowListForTest({ skipDefaultSelection: true });

  children.forEach(function (child) {
    api.markWorkflowListStatusHydrateInFlightForTest(child.id, true);
  });

  api.selectWorkflowForTest("wf-lj");
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-lj");

  // Mid-wave settle must defer the list rebuild (N children would otherwise
  // each force an immediate re-render and flicker selection chrome).
  const mid = api.settleWorkflowListStatusEvidenceHydrateForTest({ needsRefresh: true });
  assert.equal(mid.deferred, true);
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-lj");
  assert.equal(api.isWorkflowListStatusHydrateRefreshPendingForTest(), true);

  children.forEach(function (child) {
    api.markWorkflowListStatusHydrateInFlightForTest(child.id, false);
  });
  const done = api.settleWorkflowListStatusEvidenceHydrateForTest({ needsRefresh: false });
  assert.equal(done.refreshed, true);
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-lj");
  assert.equal(api.isWorkflowListStatusHydrateRefreshPendingForTest(), false);
});

test("standalone workflow settle path still refreshes once when idle after hydrate", () => {
  const { api } = boot();
  api.clearWorkflowListStatusEvidenceCacheForTest();
  api.setWorkflowsForTest([
    {
      id: "wf-solo",
      name: "Standalone Workshop",
      product: "interactive",
      steps: [{ id: "dp", title: "Design Page" }],
      updatedAt: 1
    }
  ]);
  api.renderWorkflowListForTest({ skipDefaultSelection: true });
  api.selectWorkflowForTest("wf-solo");
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-solo");

  api.markWorkflowListStatusHydrateInFlightForTest("wf-solo", true);
  const mid = api.settleWorkflowListStatusEvidenceHydrateForTest({ needsRefresh: true });
  assert.equal(mid.deferred, true);

  api.markWorkflowListStatusHydrateInFlightForTest("wf-solo", false);
  const done = api.settleWorkflowListStatusEvidenceHydrateForTest({ needsRefresh: false });
  assert.equal(done.refreshed, true);
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-solo");
});

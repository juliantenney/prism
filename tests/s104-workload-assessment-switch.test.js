/**
 * Sprint 104 recovery (S104-D08) — deterministic workload assessment switch.
 *
 * With the internal switch off (the default) every workload assessment entry point in app.js is
 * short-circuited before any adapter or estimator is invoked, across all four product families.
 * With the switch on the dormant machinery is reachable again. The estimator and adapters are
 * retained unchanged.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function loadWithSpies() {
  const loaded = loadPrismAppJsTestApi({ extraLibs: [] });
  const host = loaded.window || loaded.sandbox;
  const calls = { interactive: 0, assessmentPack: 0, situatedTask: 0, learningJourney: 0 };
  const spies = {
    PrismInteractiveWorkloadFeasibilityAdapter: {
      collectInteractiveWorkloadWarnings() {
        calls.interactive += 1;
        return ["Workload feasibility (advisory, interactive): spy"];
      }
    },
    PrismAssessmentPackWorkloadFeasibilityAdapter: {
      collectAssessmentPackWorkloadWarnings() {
        calls.assessmentPack += 1;
        return ["Workload feasibility (advisory, assessment pack): spy"];
      }
    },
    PrismSituatedTaskWorkloadFeasibilityAdapter: {
      collectSituatedTaskWorkloadWarnings() {
        calls.situatedTask += 1;
        return ["Workload feasibility (advisory, situated task): spy"];
      }
    },
    PrismLearningJourneyWorkloadFeasibilityAdapter: {
      collectLearningJourneyWorkloadWarnings() {
        calls.learningJourney += 1;
        return ["Workload feasibility (advisory, journey): spy"];
      }
    }
  };
  Object.keys(spies).forEach((k) => {
    host[k] = spies[k];
    if (loaded.sandbox && loaded.sandbox.globalThis) loaded.sandbox.globalThis[k] = spies[k];
  });
  return { api: loaded.api, calls };
}

function runAll(api) {
  const out = { interactive: [], assessmentPack: [], situatedTask: [], learningJourney: [] };
  api.appendInteractiveWorkloadFeasibilityWarnings({ activities: [] }, null, out.interactive, {});
  api.appendAssessmentPackWorkloadFeasibilityWarnings({ elicitations: [] }, out.assessmentPack, {});
  api.appendSituatedTaskWorkloadFeasibilityWarnings({}, out.situatedTask, {});
  api.appendLearningJourneyWorkloadFeasibilityWarnings({}, null, out.learningJourney, {});
  return out;
}

test("S104-D08: switch defaults to false and short-circuits all four product families before any adapter runs", () => {
  const { api, calls } = loadWithSpies();
  assert.equal(api.getWorkloadAssessmentEnabledForTest(), false);
  const out = runAll(api);
  assert.deepEqual(calls, { interactive: 0, assessmentPack: 0, situatedTask: 0, learningJourney: 0 });
  Object.keys(out).forEach((k) => assert.deepEqual(out[k], [], k));
  // Learning Journey gate passes through untouched, preserving its own errors/warnings.
  const gate = api.attachLearningJourneyWorkloadWarningsToGate
    ? api.attachLearningJourneyWorkloadWarningsToGate({ ok: true, errors: [], warnings: ["unrelated warning"] }, {}, null, {})
    : { warnings: ["unrelated warning"] };
  assert.deepEqual(gate.warnings, ["unrelated warning"]);
  assert.equal(calls.learningJourney, 0);
});

test("S104-D08: enabling the switch reaches the dormant adapters again", () => {
  const { api, calls } = loadWithSpies();
  api.setWorkloadAssessmentEnabledForTest(true);
  const out = runAll(api);
  assert.equal(calls.interactive, 1);
  assert.equal(calls.assessmentPack, 1);
  assert.equal(calls.situatedTask, 1);
  assert.equal(calls.learningJourney, 1);
  Object.keys(out).forEach((k) => assert.equal(out[k].length, 1, k));
});

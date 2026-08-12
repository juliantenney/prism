"use strict";

/**
 * Sprint 75 — My Workflows / Run segmented progress + saved-data indicator.
 *
 * Display-only. Reuses existing Run navigation index and persisted runstate
 * capture refs / legacy capturedOutputs. No new progress or persistence model.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const styleCssPath = path.join(repoRoot, "style.css");
const RUNKEY = "promptr.workflows.runstate.v1";

function loadPrismTestApi(seedStorage) {
  const storage = Object.assign({}, seedStorage || {});
  const localStorage = {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null;
    },
    setItem(k, v) {
      storage[k] = String(v);
    },
    removeItem(k) {
      delete storage[k];
    },
    key(i) {
      const keys = Object.keys(storage);
      return i >= 0 && i < keys.length ? keys[i] : null;
    },
    get length() {
      return Object.keys(storage).length;
    }
  };
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {},
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
  };
  const windowStub = { document: documentStub, localStorage };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, storage, source };
}

function sevenSteps() {
  return [
    { id: "s1", title: "Normalize Content" },
    { id: "s2", title: "Generate Learning Content" },
    { id: "s3", title: "Model Knowledge" },
    { id: "s4", title: "Design Learning Activities" },
    { id: "s5", title: "Design Page" },
    { id: "s6", title: "Generate Activity Materials" },
    { id: "s7", title: "Review" }
  ];
}

function buildWorkflow(id, steps) {
  return {
    id,
    name: "WF " + id,
    steps: steps || sevenSteps()
  };
}

function progressOf(segments) {
  return segments.map((row) => row.progress);
}

function savedFlags(segments) {
  return segments.map((row) => !!row.hasSavedData);
}

test("1: one segment is rendered per workflow step, in workflow order", () => {
  const { api } = loadPrismTestApi();
  const steps = sevenSteps();
  api.setWorkflowsForTest([buildWorkflow("wf-a", steps)]);
  const segments = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-a",
    steps,
    currentIndex: 0
  });
  assert.equal(segments.length, 7);
  assert.deepEqual(
    segments.map((row) => row.stepId),
    ["s1", "s2", "s3", "s4", "s5", "s6", "s7"]
  );
  assert.deepEqual(
    segments.map((row) => row.index),
    [0, 1, 2, 3, 4, 5, 6]
  );
});

test("2/3/4: current, passed, and future steps use existing Run index", () => {
  const { api, source } = loadPrismTestApi();
  const steps = sevenSteps();
  const segments = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-a",
    steps,
    currentIndex: 4
  });
  assert.deepEqual(progressOf(segments), [
    "passed",
    "passed",
    "passed",
    "passed",
    "current",
    "future",
    "future"
  ]);
  assert.match(source, /state\.currentWorkflowRunIndex/);
  assert.match(
    source,
    /i < currentIndex \? "passed" : i === currentIndex \? "current" : "future"/
  );
  assert.match(
    source,
    /currentIndex:\s*idx/
  );
});

test("5: a step with persisted capture data receives the saved-data state", () => {
  const steps = sevenSteps();
  const seeded = {};
  seeded[RUNKEY] = JSON.stringify({
    "wf-a": {
      captureRefs: {
        s5: { final: { resource_id: "wr-page-final" } }
      }
    }
  });
  const { api } = loadPrismTestApi(seeded);
  api.setWorkflowsForTest([buildWorkflow("wf-a", steps)]);
  const segments = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-a",
    steps,
    currentIndex: 4
  });
  assert.equal(api.workflowStepHasPersistedRunDataForTest("wf-a", "s5"), true);
  assert.equal(segments[4].hasSavedData, true);
  assert.equal(segments[4].progress, "current");
});

test("6: a progressed step without persisted data is not incomplete or error", () => {
  const { api, source } = loadPrismTestApi();
  const steps = sevenSteps();
  const segments = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-a",
    steps,
    currentIndex: 4
  });
  assert.equal(segments[0].progress, "passed");
  assert.equal(segments[0].hasSavedData, false);
  assert.equal(segments[1].progress, "passed");
  assert.equal(segments[1].hasSavedData, false);
  assert.equal(segments[2].progress, "passed");
  assert.equal(segments[2].hasSavedData, false);
  const css = fs.readFileSync(styleCssPath, "utf8");
  assert.doesNotMatch(css, /\.workflow-run-progress-segment[^{]*\{[^}]*\b(red|#dc|#ef|#f59|#eab|yellow)\b/i);
  assert.doesNotMatch(source, /workflow-run-progress-segment[\s\S]{0,200}is-(error|incomplete|warning)/);
});

test("7: multiple steps with persisted data are represented independently", () => {
  const steps = sevenSteps();
  const seeded = {};
  seeded[RUNKEY] = JSON.stringify({
    "wf-a": {
      captureRefs: {
        s4: { final: { resource_id: "wr-dla" } },
        s5: { raw: { resource_id: "wr-page-raw" } }
      }
    }
  });
  const { api } = loadPrismTestApi(seeded);
  const segments = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-a",
    steps,
    currentIndex: 4
  });
  assert.deepEqual(savedFlags(segments), [false, false, false, true, true, false, false]);
  assert.deepEqual(progressOf(segments).slice(0, 5), [
    "passed",
    "passed",
    "passed",
    "passed",
    "current"
  ]);
});

test("8: reload/re-render reflects persisted saved-data state, including legacy captures", () => {
  const steps = sevenSteps();
  const seeded = {};
  seeded[RUNKEY] = JSON.stringify({
    "wf-reload": {
      captureRefs: {
        s4: { final: { resource_id: "wr-dla" } }
      },
      capturedOutputs: { s5: "{\"artifact_type\":\"page\"}" }
    }
  });
  const { api } = loadPrismTestApi(seeded);
  api.setWorkflowsForTest([buildWorkflow("wf-reload", steps)]);
  const segments = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-reload",
    steps,
    currentIndex: 0
  });
  assert.equal(segments[0].progress, "current");
  assert.equal(segments[3].hasSavedData, true);
  assert.equal(segments[4].hasSavedData, true);
  assert.equal(segments[1].hasSavedData, false);
});

test("in-memory visit without persist does not count as saved data", () => {
  const { api } = loadPrismTestApi();
  const steps = sevenSteps();
  api.setWorkflowsForTest([buildWorkflow("wf-a", steps)]);
  api.setSelectedWorkflowIdForTest("wf-a");
  api.setCurrentWorkflowRunIndexForTest(4);
  api.setWorkflowRunCaptureRefsForTest({
    s5: { final: { resource_id: "wr-not-persisted" } }
  });
  const segments = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-a",
    steps,
    currentIndex: 4
  });
  assert.equal(segments[4].progress, "current");
  assert.equal(segments[4].hasSavedData, false);
});

test("9: switching workflow recalculates segments from that workflow's persisted state", () => {
  const stepsA = sevenSteps();
  const stepsB = [
    { id: "b1", title: "One" },
    { id: "b2", title: "Two" },
    { id: "b3", title: "Three" }
  ];
  const seeded = {};
  seeded[RUNKEY] = JSON.stringify({
    "wf-a": {
      captureRefs: {
        s4: { final: { resource_id: "wr-a4" } },
        s5: { final: { resource_id: "wr-a5" } }
      }
    },
    "wf-b": {
      captureRefs: {
        b1: { final: { resource_id: "wr-b1" } }
      }
    }
  });
  const { api } = loadPrismTestApi(seeded);
  api.setWorkflowsForTest([buildWorkflow("wf-a", stepsA), buildWorkflow("wf-b", stepsB)]);

  const segsA = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-a",
    steps: stepsA,
    currentIndex: 4
  });
  const segsB = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-b",
    steps: stepsB,
    currentIndex: 0
  });
  assert.equal(segsA.length, 7);
  assert.deepEqual(savedFlags(segsA), [false, false, false, true, true, false, false]);
  assert.equal(segsB.length, 3);
  assert.deepEqual(savedFlags(segsB), [true, false, false]);
  assert.deepEqual(progressOf(segsB), ["current", "future", "future"]);
});

test("10: clear run data removes saved-data indication via existing cleanup", () => {
  const steps = sevenSteps();
  const seeded = {};
  seeded[RUNKEY] = JSON.stringify({
    "wf-clear": {
      captureRefs: {
        s4: { final: { resource_id: "wr-dla" } },
        s5: { final: { resource_id: "wr-page" } }
      }
    }
  });
  const { api, storage, source } = loadPrismTestApi(seeded);
  api.setWorkflowsForTest([buildWorkflow("wf-clear", steps)]);
  api.setSelectedWorkflowIdForTest("wf-clear");

  const before = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-clear",
    steps,
    currentIndex: 4
  });
  assert.equal(before[3].hasSavedData, true);
  assert.equal(before[4].hasSavedData, true);

  api.clearPersistedWorkflowRunStateForWorkflowForTest("wf-clear");
  const after = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-clear",
    steps,
    currentIndex: 0
  });
  assert.deepEqual(savedFlags(after), [false, false, false, false, false, false, false]);
  const storeAfter = JSON.parse(storage[RUNKEY] || "{}");
  assert.equal(storeAfter["wf-clear"], undefined);
  assert.match(source, /clearWorkflowRunCaptureState\(\{[\s\S]*workflowId:\s*wid/);
  assert.doesNotMatch(source, /clearWorkflowRunProgressSegments/);
});

test("11: no new persistence schema or progress model is introduced", () => {
  const { source } = loadPrismTestApi();
  assert.match(source, /WORKFLOW_RUN_STATE_STORAGE_KEY = "promptr\.workflows\.runstate\.v1"/);
  assert.doesNotMatch(source, /promptr\.workflows\.progress/i);
  assert.doesNotMatch(source, /segmentSaved|progressHighWater|runProgressSegmentsStore/);
  assert.match(
    source,
    /function workflowStepHasPersistedRunData\([\s\S]*loadWorkflowRunStateStore\(\)/
  );
  assert.match(
    source,
    /function workflowHasPersistedDesignPageResult\([\s\S]*workflowStepHasPersistedRunData\(/
  );
});

test("12: segments are non-interactive", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const css = fs.readFileSync(styleCssPath, "utf8");
  const { source } = loadPrismTestApi();
  assert.match(html, /id="workflowRunProgressSegments"/);
  assert.doesNotMatch(html, /id="workflowRunProgressSegments"[\s\S]{0,200}<button/);
  assert.match(css, /\.workflow-run-progress-segments\s*\{[\s\S]*pointer-events:\s*none;/);
  assert.match(source, /document\.createElement\("span"\)/);
  assert.match(source, /block\.className = "workflow-run-progress-segment"/);
  assert.doesNotMatch(source, /workflow-run-progress-segment[\s\S]{0,80}addEventListener/);
  assert.doesNotMatch(source, /workflowRunProgressSegments[\s\S]{0,120}addEventListener/);
});

test("13: existing Step X of Y remains present and is not replaced", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const { source } = loadPrismTestApi();
  assert.match(html, /id="workflowRunStatus"/);
  assert.match(html, /id="workflowRunProgressSegments"/);
  assert.match(
    source,
    /"Step "\s*\+\s*displayIndex\s*\+\s*" of "\s*\+\s*displayTotal\s*\+\s*" \\u2014 "/
  );
  assert.match(source, /els\.workflowRunStatus\.textContent\s*=/);
  assert.match(source, /syncWorkflowRunStepIdentityPlacement\(/);
});

test("14: Previous / Next remain grouped and are placed in the step nav row", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const { source } = loadPrismTestApi();
  const buttonsStart = html.indexOf('class="workflow-run-buttons"');
  const stepsList = html.indexOf('id="workflowSteps"');
  assert.ok(buttonsStart > 0 && buttonsStart < stepsList);
  const buttons = html.slice(buttonsStart, html.indexOf("</div>", buttonsStart));
  assert.match(buttons, /id="workflowPrevStepBtn"/);
  assert.match(buttons, /id="workflowNextStepBtn"/);
  assert.doesNotMatch(buttons, /id="workflowRunCopyBtn"/);
  assert.doesNotMatch(buttons, /workflowRunProgressSegments/);
  assert.doesNotMatch(buttons, /id="workflowRunStatus"/);
  assert.match(source, /navTarget\.appendChild\(els\.workflowRunButtons\)/);
});

test("accessible description is provided without a permanent visible legend", () => {
  const { api } = loadPrismTestApi();
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const css = fs.readFileSync(styleCssPath, "utf8");
  const steps = sevenSteps();
  const seeded = {};
  seeded[RUNKEY] = JSON.stringify({
    "wf-a": {
      captureRefs: {
        s4: { final: { resource_id: "wr-dla" } },
        s5: { final: { resource_id: "wr-page" } }
      }
    }
  });
  const { api: apiSeeded } = loadPrismTestApi(seeded);
  const segments = apiSeeded.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-a",
    steps,
    currentIndex: 4
  });
  const label = api.buildWorkflowRunProgressSegmentsAriaLabelForTest(segments, 4);
  assert.equal(
    label,
    "Workflow progress: step 5 of 7. Saved data on steps 4, 5."
  );
  const emptyLabel = api.buildWorkflowRunProgressSegmentsAriaLabelForTest(
    api.buildWorkflowRunProgressSegmentsForTest({
      workflowId: "wf-empty",
      steps,
      currentIndex: 0
    }),
    0
  );
  assert.equal(emptyLabel, "Workflow progress: step 1 of 7. No saved step data.");
  assert.match(html, /id="workflowRunProgressSegments"[\s\S]*?role="img"/);
  assert.doesNotMatch(html, /workflow-run-progress-legend/);
  assert.doesNotMatch(css, /workflow-run-progress-legend/);
});

test("visual language: passed green, current outlined, future grey, saved marker only when present", () => {
  const css = fs.readFileSync(styleCssPath, "utf8");
  assert.match(
    css,
    /\.workflow-run-progress-segment\.is-passed\s*\{[\s\S]*background:\s*var\(--success\)/
  );
  assert.match(
    css,
    /\.workflow-run-progress-segment\.is-current\s*\{[\s\S]*outline:\s*2px solid/
  );
  assert.match(
    css,
    /\.workflow-run-progress-segment\s*\{[\s\S]*background:\s*#d1d5db/
  );
  assert.match(css, /\.workflow-run-progress-segment\.is-saved::after/);
  assert.doesNotMatch(css, /\.workflow-run-progress-segment:not\(\.is-saved\)::after/);
  assert.doesNotMatch(css, /\.workflow-run-progress-segment\.is-future::after/);
});

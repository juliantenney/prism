/**
 * Sprint 100B-1 — Interactive workload feasibility adapter + LS advisory wiring.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const adapter = require(path.join(
  repoRoot,
  "lib",
  "interactive-workload-feasibility-adapter.js"
));
const estimator = require(path.join(repoRoot, "lib", "workload-feasibility-estimator.js"));
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS
} = require("./prism-vm-lib-bootstrap.js");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    setTimeout,
    clearTimeout,
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/workload-feasibility-estimator.js",
      "lib/interactive-workload-feasibility-adapter.js",
      "lib/page-shell-create.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  // Sprint 104 recovery (S104-D08): deterministic workload assessment is off by default in app.js;
  // this suite tests the dormant advisory machinery, so enable it explicitly.
  api.setWorkloadAssessmentEnabledForTest(true);
  return api;
}

function writingActivity(overrides) {
  return Object.assign(
    {
      activity_id: "A3",
      title: "Compose your philosophical argument",
      duration_minutes: 10,
      learner_task:
        "Write one coherent philosophical argument of approximately 300–400 words. Address truth, belief, evidence and justification.",
      expected_output:
        "A sustained philosophical argument of approximately 300–400 words with justified conclusions.",
      required_materials: [
        {
          material_id: "M1",
          type: "text",
          purpose: "case evidence",
          specification: "Review the final case evidence before writing."
        }
      ]
    },
    overrides || {}
  );
}

test("maps writing-intensive activity with explicit demands", () => {
  const mapped = adapter.mapActivityToEstimatorInput(writingActivity(), {});
  assert.ok(mapped);
  assert.equal(mapped.input.activityType, "argumentative_writing");
  assert.deepEqual(mapped.input.suggestedLengthWords, { min: 300, max: 400 });
  assert.equal(mapped.input.reasoningDemand, "argument");
  assert.equal(mapped.input.declaredDurationMinutes, 10);
});

test("detects implausibly short allocation for writing activity", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      total_duration_minutes: 10,
      timeline: [{ activity_id: "A3", duration_minutes: 10 }]
    },
    activities: [writingActivity({ duration_minutes: null })]
  };
  const result = adapter.assessInteractivePageWorkload(page, null);
  assert.ok(result.warnings.length >= 1);
  assert.match(result.warnings[0], /Workload feasibility \(advisory\)/);
  assert.match(result.warnings[0], /allocated duration of 10 minutes/);
  assert.match(result.warnings[0], /You may retain the current design/);
  assert.match(result.warnings[0], /approximate workload estimates/i);
});

test("avoids false positives for short simple MCQ activities", () => {
  const page = {
    learning_sequence: {
      ordered_activity_ids: ["A1"],
      timeline: [{ activity_id: "A1", duration_minutes: 3 }]
    },
    activities: [
      {
        activity_id: "A1",
        title: "Quick check",
        duration_minutes: 3,
        learner_task: "Choose one option that best matches the finding.",
        expected_output: "Selected MCQ option.",
        required_materials: [
          {
            material_id: "Q1",
            type: "multiple_choice",
            purpose: "auto check",
            specification: "One stem with four options."
          }
        ]
      }
    ]
  };
  const result = adapter.assessInteractivePageWorkload(page, null);
  assert.equal(result.warnings.length, 0);
  assert.ok(result.findings.length >= 1);
  assert.equal(result.findings[0].estimate.plausiblyInsufficient, false);
});

test("missing or ambiguous activity data produces no warning clutter", () => {
  const page = {
    learning_sequence: {
      ordered_activity_ids: ["A2"],
      timeline: [{ activity_id: "A2", duration_minutes: 12 }]
    },
    activities: [
      {
        activity_id: "A2",
        title: "Explore the idea",
        duration_minutes: 12,
        learner_task: "Work through the prompts.",
        expected_output: "Completed activity notes."
      }
    ]
  };
  const result = adapter.assessInteractivePageWorkload(page, null);
  assert.equal(result.warnings.length, 0);
});

test("free-text field alone does not invent substantial writing demand", () => {
  const mapped = adapter.mapActivityToEstimatorInput(
    {
      activity_id: "A4",
      title: "Reflect briefly",
      duration_minutes: 8,
      learner_task: "Write a short note about what you noticed.",
      expected_output: "A short free-text reflection."
    },
    {}
  );
  assert.equal(mapped, null);
});

test("does not mutate supplied page or baseline", () => {
  const page = {
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      timeline: [{ activity_id: "A3", duration_minutes: 10 }]
    },
    activities: [writingActivity()]
  };
  const baseline = {
    activities: [writingActivity({ title: "Baseline title" })]
  };
  const pageSnap = JSON.stringify(page);
  const baseSnap = JSON.stringify(baseline);
  adapter.assessInteractivePageWorkload(page, baseline);
  assert.equal(JSON.stringify(page), pageSnap);
  assert.equal(JSON.stringify(baseline), baseSnap);
});

test("Learning Sequence validation remains ok while returning advisory warnings", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: {
      current_stage: "learning_sequence",
      enriched_by: ["learning_sequence"]
    },
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      total_duration_minutes: 10,
      timeline: [{ activity_id: "A3", duration_minutes: 10 }]
    },
    activities: [writingActivity({ duration_minutes: 10 })]
  };
  const check = api.validateLearningSequencePartialPageCapture(page, {
    effectiveDurationMinutes: 10,
    baselinePage: null
  });
  assert.equal(check.ok, true, (check.errors || []).join("; "));
  assert.equal((check.errors || []).length, 0);
  assert.ok(Array.isArray(check.warnings));
  assert.ok(check.warnings.length >= 1);
  assert.match(check.warnings[0], /Workload feasibility \(advisory\)/);
});

test("Learning Sequence arithmetic validation still blocks mismatched totals", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: {
      current_stage: "learning_sequence",
      enriched_by: ["learning_sequence"]
    },
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      total_duration_minutes: 10,
      timeline: [{ activity_id: "A3", duration_minutes: 10 }]
    },
    activities: [writingActivity({ duration_minutes: 10 })]
  };
  const check = api.validateLearningSequencePartialPageCapture(page, {
    effectiveDurationMinutes: 60
  });
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /authoritative effective workflow duration/i);
  assert.equal((check.warnings || []).length, 0);
});

test("uses baseline activity prose with Learning Sequence timeline durations", () => {
  const lsPage = {
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      timeline: [{ activity_id: "A3", duration_minutes: 10 }]
    },
    activities: []
  };
  const baseline = {
    activities: [writingActivity({ duration_minutes: null })]
  };
  const warnings = adapter.collectInteractiveWorkloadWarnings(lsPage, baseline);
  assert.ok(warnings.length >= 1);
});

test("estimator independence still holds through adapter findings", () => {
  const page = {
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      timeline: [{ activity_id: "A3", duration_minutes: 10 }]
    },
    activities: [writingActivity({ duration_minutes: 10 })]
  };
  const a = adapter.assessInteractivePageWorkload(page, null).findings[0].estimate;
  const b = estimator.estimateActivityWorkload({
    activityType: "argumentative_writing",
    suggestedLengthWords: { min: 300, max: 400 },
    reasoningDemand: "argument",
    readingDemand: "moderate",
    declaredDurationMinutes: 45
  });
  assert.deepEqual(a.indicativeEffortMinutes, b.indicativeEffortMinutes);
});

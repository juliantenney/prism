/**
 * Sprint 100B-2 — Assessment Pack workload feasibility adapter + advisory wiring.
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
  "assessment-pack-workload-feasibility-adapter.js"
));
const estimator = require(path.join(repoRoot, "lib", "workload-feasibility-estimator.js"));
const interactiveAdapter = require(path.join(
  repoRoot,
  "lib",
  "interactive-workload-feasibility-adapter.js"
));
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
      "lib/assessment-pack-workload-feasibility-adapter.js",
      "lib/page-shell-create.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function philosophicalElicitation(overrides) {
  return Object.assign(
    {
      elicitation_id: "E_PHIL",
      indicative_duration_minutes: 10,
      evidence_ask:
        "Elicit one coherent philosophical argument addressing truth, belief, evidence and justification.",
      stimulus: "Review the final case evidence before writing.",
      delivery: {
        kind: "constructed_performance",
        prompt: {
          title: "Compose your philosophical argument",
          context: "You have reviewed the case materials.",
          task:
            "Write one coherent philosophical argument of approximately 300–400 words. Address truth, belief, evidence and justification.",
          response_expectation: "A sustained philosophical argument with justified conclusions.",
          suggested_length: "Approximately 300–400 words.",
          indicative_time: "Approximately 10 minutes."
        }
      }
    },
    overrides || {}
  );
}

function recommendationElicitation(overrides) {
  return Object.assign(
    {
      elicitation_id: "E_REC",
      indicative_duration_minutes: 19,
      evidence_ask:
        "Elicit an evidence-based institutional recommendation evaluating trade-offs against stated criteria.",
      stimulus: "Complete fictional evidence dossier for the institutional case.",
      delivery: {
        kind: "constructed_performance",
        prompt: {
          title: "Evidence-based recommendation",
          task:
            "Write an evidence-based recommendation of approximately 350–500 words. Evaluate the trade-offs against the stated criteria and justify your judgement.",
          suggested_length: "Approximately 350–500 words.",
          indicative_time: "Approximately 19 minutes."
        }
      }
    },
    overrides || {}
  );
}

function shortMcqElicitation(overrides) {
  return Object.assign(
    {
      elicitation_id: "E_MCQ",
      indicative_duration_minutes: 3,
      evidence_ask: "Elicit one determinate judgement about the best-supported conclusion.",
      delivery: {
        kind: "auto_checkable_items",
        prompt: {
          title: "Quick check",
          task: "Choose one option that best matches the finding.",
          suggested_length: "One selection.",
          indicative_time: "Approximately 3 minutes."
        },
        items: [
          {
            item_id: "I1",
            form: "single_answer_mcq",
            prompt: { stem: "Which conclusion is best supported?", options: [] },
            judgement: { correct_answer: "B" }
          }
        ]
      }
    },
    overrides || {}
  );
}

function revisionElicitation(overrides) {
  return Object.assign(
    {
      elicitation_id: "E_REV",
      indicative_duration_minutes: 12,
      evidence_ask:
        "Elicit an analytical reconsideration and a substantive revision after feedback.",
      stimulus: "Case excerpt and criteria notes.",
      delivery: {
        kind: "constructed_performance",
        prompt: {
          title: "Reconsider and revise",
          task:
            "Write an analytical reconsideration of approximately 180–250 words. Then revise your response after feedback.",
          suggested_length: "Approximately 180–250 words.",
          indicative_time: "Approximately 12 minutes."
        }
      },
      formative_return: {
        materials: [
          {
            material_id: "F1",
            body: "Compare your response with the criteria and identify gaps before revising."
          }
        ],
        optional_revision: { offered: true },
        revision: {
          prompt: "Revise your response using the feedback."
        }
      }
    },
    overrides || {}
  );
}

test("maps 300–400-word philosophical argument with implausibly short allocation", () => {
  const mapped = adapter.mapElicitationToEstimatorInput(philosophicalElicitation());
  assert.ok(mapped);
  assert.equal(mapped.input.activityType, "argumentative_writing");
  assert.deepEqual(mapped.input.suggestedLengthWords, { min: 300, max: 400 });
  assert.equal(mapped.input.reasoningDemand, "argument");
  assert.equal(mapped.input.declaredDurationMinutes, 10);
  const result = adapter.assessAssessmentPackWorkload({
    elicitations: [philosophicalElicitation()]
  });
  assert.ok(result.warnings.length >= 1);
  assert.match(result.warnings[0], /Workload feasibility \(indicative\)/);
  assert.match(result.warnings[0], /allocated 10 minutes/);
  assert.match(result.warnings[0], /You may continue without changing the design/);
  assert.match(result.warnings[0], /not a measured completion time|planning aid/);
});

test("maps 350–500-word evidence-based recommendation overload", () => {
  const mapped = adapter.mapElicitationToEstimatorInput(recommendationElicitation());
  assert.ok(mapped);
  assert.equal(mapped.input.activityType, "institutional_recommendation");
  assert.deepEqual(mapped.input.suggestedLengthWords, { min: 350, max: 500 });
  assert.equal(mapped.input.readingDemand, "dossier");
  const result = adapter.assessAssessmentPackWorkload({
    elicitations: [recommendationElicitation()]
  });
  assert.ok(result.warnings.length >= 1);
  assert.match(result.warnings[0], /Evidence-based recommendation/);
  assert.match(result.warnings[0], /allocated 19 minutes/);
});

test("short straightforward assessment response remains plausible", () => {
  const result = adapter.assessAssessmentPackWorkload({
    elicitations: [shortMcqElicitation()]
  });
  assert.equal(result.warnings.length, 0);
  assert.ok(result.findings.length >= 1);
  assert.equal(result.findings[0].estimate.plausiblyInsufficient, false);
});

test("substantive feedback and revision add distinct overhead without inventing length", () => {
  const mapped = adapter.mapElicitationToEstimatorInput(revisionElicitation());
  assert.ok(mapped);
  assert.equal(mapped.input.requiresFeedbackInterpretation, true);
  assert.equal(mapped.input.requiresRevision, true);
  assert.deepEqual(mapped.input.suggestedLengthWords, { min: 180, max: 250 });
  const result = adapter.assessAssessmentPackWorkload({
    elicitations: [revisionElicitation()]
  });
  assert.ok(result.warnings.length >= 1);
  assert.match(result.warnings[0], /feedback interpretation/);
  assert.match(result.warnings[0], /revision/);
});

test("missing or ambiguous duration or workload information yields no clutter", () => {
  const ambiguous = {
    elicitation_id: "E_AMB",
    delivery: {
      kind: "constructed_performance",
      prompt: {
        title: "Explore the idea",
        task: "Work through the prompts.",
        response_expectation: "Completed notes."
      }
    }
  };
  assert.equal(adapter.mapElicitationToEstimatorInput(ambiguous), null);
  const result = adapter.assessAssessmentPackWorkload({ elicitations: [ambiguous] });
  assert.equal(result.warnings.length, 0);
});

test("text-entry / constructed_performance alone does not invent substantial writing", () => {
  const mapped = adapter.mapElicitationToEstimatorInput({
    elicitation_id: "E_TEXT",
    indicative_duration_minutes: 8,
    evidence_ask: "Record a brief note",
    delivery: {
      kind: "constructed_performance",
      prompt: {
        title: "Reflect briefly",
        task: "Write a short note about what you noticed.",
        suggested_length: "A short free-text reflection.",
        indicative_time: "Approximately 8 minutes."
      },
      response_workspace: {
        intention: "Free-text entry field for a brief reflection."
      }
    }
  });
  assert.equal(mapped, null);
});

test("parses indicative_time conservatively without summing nested stage minutes", () => {
  assert.equal(adapter.parseIndicativeTimeMinutes("Approximately 6 minutes."), 6);
  assert.equal(
    adapter.parseIndicativeTimeMinutes(
      "Approximately 15 minutes in total: 2 minutes reading, 10 minutes writing, 3 minutes review."
    ),
    15
  );
});

test("does not mutate Assessment Pack artefacts", () => {
  const artefact = { elicitations: [philosophicalElicitation()] };
  const snap = JSON.stringify(artefact);
  adapter.assessAssessmentPackWorkload(artefact);
  assert.equal(JSON.stringify(artefact), snap);
});

test("Assessment Pack elicitation capture remains ok with advisory warnings only", () => {
  const api = loadPrismTestApi();
  const artefact = {
    artifact_type: "assessment_evidence_elicitation",
    elicitations: [philosophicalElicitation()]
  };
  const wf = { id: "wf-ap", product: "assessment_pack", steps: [] };
  const check = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(artefact),
    { outputName: "assessment_evidence_elicitation", title: "Design Evidence Elicitation" },
    wf
  );
  assert.equal(check.ok, true, (check.errors || []).join("; ") || check.message);
  assert.equal((check.errors || []).length, 0);
  assert.ok(Array.isArray(check.warnings));
  assert.ok(check.warnings.length >= 1);
  assert.match(check.warnings[0], /Workload feasibility \(indicative\)/);
});

test("Assessment Design Page capture remains ok with advisory warnings only", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Formative check",
    activities: [],
    assessment_evidence: {
      elicitations: [philosophicalElicitation()]
    }
  };
  const check = api.validateAssessmentDesignPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
  assert.equal((check.errors || []).length, 0);
  assert.ok(Array.isArray(check.warnings));
  assert.ok(check.warnings.length >= 1);
});

test("no regression: 100A estimator independence still holds", () => {
  const finding = adapter.assessAssessmentPackWorkload({
    elicitations: [philosophicalElicitation()]
  }).findings[0].estimate;
  const direct = estimator.estimateActivityWorkload({
    activityType: "argumentative_writing",
    suggestedLengthWords: { min: 300, max: 400 },
    reasoningDemand: "argument",
    readingDemand: "moderate",
    declaredDurationMinutes: 45
  });
  assert.deepEqual(finding.indicativeEffortMinutes, direct.indicativeEffortMinutes);
});

test("no regression: 100B-1 Interactive adapter still warns on writing overload", () => {
  const page = {
    learning_sequence: {
      ordered_activity_ids: ["A3"],
      timeline: [{ activity_id: "A3", duration_minutes: 10 }]
    },
    activities: [
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
      }
    ]
  };
  const warnings = interactiveAdapter.collectInteractiveWorkloadWarnings(page, null);
  assert.ok(warnings.length >= 1);
});

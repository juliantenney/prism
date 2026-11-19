/**
 * Sprint 100C — Learning Journey commission + journey workload feasibility.
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
  "learning-journey-workload-feasibility-adapter.js"
));
const estimator = require(path.join(repoRoot, "lib", "workload-feasibility-estimator.js"));
const interactiveAdapter = require(path.join(
  repoRoot,
  "lib",
  "interactive-workload-feasibility-adapter.js"
));
const assessmentAdapter = require(path.join(
  repoRoot,
  "lib",
  "assessment-pack-workload-feasibility-adapter.js"
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
      "lib/learning-journey-workload-feasibility-adapter.js",
      "lib/learning-journey-design-page.js",
      "lib/page-shell-create.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function writingCommission(overrides) {
  return Object.assign(
    {
      commission_id: "c_write",
      section_id: "exp_1",
      order: 1,
      title: "Compose a philosophical argument",
      product_id: "interactive",
      status: "supported",
      specification_text:
        "Create an Interactive Resource. Approximate learner time: 10 minutes. Require learners to write one coherent philosophical argument of approximately 300–400 words addressing truth, belief, evidence and justification. Review the final case evidence before writing.",
      journey_context_text: "First commission.",
      dependencies: ""
    },
    overrides || {}
  );
}

function simpleCommission(overrides) {
  return Object.assign(
    {
      commission_id: "c_mcq",
      section_id: "exp_2",
      order: 2,
      title: "Quick check",
      product_id: "interactive",
      status: "supported",
      specification_text:
        "Create an Interactive Resource. Approximate learner time: 10 minutes. One short auto-checkable multiple-choice item checking a single finding.",
      journey_context_text: "No recurring scenario beyond the shared finding.",
      dependencies: ""
    },
    overrides || {}
  );
}

function vagueCommission(overrides) {
  return Object.assign(
    {
      commission_id: "c_vague",
      section_id: "exp_3",
      order: 3,
      title: "Explore the idea",
      product_id: "expository",
      status: "supported",
      specification_text:
        "Establish understanding of the topic using the shared materials and develop the intended learning.",
      journey_context_text: "Continue from earlier exploration.",
      dependencies: "c_mcq"
    },
    overrides || {}
  );
}

test("commission with demanding constructed writing and short allocation warns", () => {
  const mapped = adapter.mapCommissionToEstimatorInput(writingCommission());
  assert.ok(mapped);
  assert.equal(mapped.input.activityType, "argumentative_writing");
  assert.deepEqual(mapped.input.suggestedLengthWords, { min: 300, max: 400 });
  assert.equal(mapped.input.declaredDurationMinutes, 10);
  const result = adapter.assessLearningJourneyWorkload(
    { commissions: [writingCommission()] },
    { learningTimeEnvelopeMinutes: 10 }
  );
  assert.ok(result.warnings.some((w) => /commission/i.test(w)));
  assert.match(
    result.warnings.find((w) => /commission/i.test(w)),
    /allocated 10 minutes/
  );
  assert.match(
    result.warnings.find((w) => /commission/i.test(w)),
    /You may continue without changing the design/
  );
});

test("simple commission with plausible allocation does not warn", () => {
  const result = adapter.assessLearningJourneyWorkload(
    { commissions: [simpleCommission()] },
    { learningTimeEnvelopeMinutes: 10 }
  );
  assert.equal(result.warnings.length, 0);
  assert.ok(result.findings.length >= 1);
  assert.equal(result.findings[0].estimate.plausiblyInsufficient, false);
});

test("insufficient evidence commission maps to null and produces no clutter", () => {
  assert.equal(adapter.mapCommissionToEstimatorInput(vagueCommission()), null);
  const result = adapter.assessLearningJourneyWorkload(
    { commissions: [vagueCommission()] },
    { learningTimeEnvelopeMinutes: 90 }
  );
  assert.equal(result.warnings.length, 0);
  assert.equal(result.journey.insufficientEvidenceCount, 1);
});

test("journey can sum correctly yet still warn when a commission is overloaded", () => {
  const page = {
    commissions: [
      writingCommission({
        commission_id: "c1",
        order: 1,
        specification_text:
          "Create an Interactive Resource. Approximate learner time: 10 minutes. Require a 300–400 word philosophical argument with justified conclusions after reviewing the case evidence."
      }),
      simpleCommission({
        commission_id: "c2",
        order: 2,
        section_id: "exp_2",
        specification_text:
          "Create an Interactive Resource. Approximate learner time: 80 minutes. Several short auto-checkable multiple-choice items consolidating the finding."
      })
    ]
  };
  const result = adapter.assessLearningJourneyWorkload(page, {
    learningTimeEnvelopeMinutes: 90
  });
  assert.equal(result.journey.allocatedSum, 90);
  assert.equal(result.journey.arithmeticOk, true);
  assert.ok(result.journey.overloadedCount >= 1);
  assert.ok(result.warnings.some((w) => /commission/i.test(w)));
  assert.ok(
    result.warnings.some(
      (w) => /journey/i.test(w) && /correctly summed journey is not automatically feasible/i.test(w)
    )
  );
  // Never invent a summed estimator upper-bound total.
  assert.ok(
    result.warnings.every((w) => !/\bsum(?:med)? (?:estimator|upper|predicted)\b/i.test(w))
  );
});

test("journey with multiple independently evidenced workload concerns", () => {
  const page = {
    commissions: [
      writingCommission({ commission_id: "c1", order: 1 }),
      writingCommission({
        commission_id: "c2",
        order: 2,
        section_id: "exp_2",
        title: "Evidence-based recommendation",
        specification_text:
          "Create an Assessment Pack. Approximate learner time: 19 minutes. Write an evidence-based recommendation of approximately 350–500 words using the complete fictional evidence dossier and evaluating trade-offs against stated criteria."
      })
    ]
  };
  const result = adapter.assessLearningJourneyWorkload(page, {
    learningTimeEnvelopeMinutes: 29
  });
  assert.ok(result.journey.overloadedCount >= 2);
  const commissionWarnings = result.warnings.filter((w) => /commission/i.test(w));
  assert.ok(commissionWarnings.length >= 2);
  assert.ok(result.warnings.some((w) => /journey/i.test(w)));
});

test("overlapping commission scopes are not safely aggregated into a predicted total", () => {
  const page = {
    commissions: [
      {
        commission_id: "c1",
        title: "Apply statistics",
        product_id: "interactive",
        status: "supported",
        specification_text:
          "Serve Learning Elements 2 and 3. Approximate learner time: 45 minutes. Write approximately 180–250 words explaining the calculated summaries."
      },
      {
        commission_id: "c2",
        title: "Revisit statistics",
        product_id: "interactive",
        status: "supported",
        specification_text:
          "Also serve Learning Element 2 with further practice. Approximate learner time: 45 minutes. Write approximately 180–250 words consolidating interpretation."
      }
    ]
  };
  const result = adapter.assessLearningJourneyWorkload(page, {
    learningTimeEnvelopeMinutes: 90
  });
  assert.equal(result.journey.aggregationRisk.hasOverlap, true);
  assert.equal(result.journey.aggregationSafe, false);
  assert.ok(
    result.warnings.some(
      (w) => /overlap/i.test(w) && /no combined/i.test(w)
    )
  );
});

test("does not double-count element allocations with commission allocations", () => {
  const page = {
    learning_elements: [
      { element_id: "E1", learning_time_minutes: 40 },
      { element_id: "E2", learning_time_minutes: 50 }
    ],
    commissions: [
      writingCommission({
        specification_text:
          "Serve Learning Element 1. Approximate learner time: 10 minutes. Require a 300–400 word philosophical argument."
      })
    ]
  };
  const result = adapter.assessLearningJourneyWorkload(page, {
    learningTimeEnvelopeMinutes: 10
  });
  // Envelope and commission allocation only — element minutes (40+50) must not be added.
  assert.equal(result.journey.allocatedSum, 10);
  assert.notEqual(result.journey.allocatedSum, 100);
  assert.notEqual(result.journey.allocatedSum, 50);
});

test("parses approximate learner time and envelope conservatively", () => {
  assert.equal(
    adapter.parseCommissionAllocatedMinutes("Approximate learner time: 35 minutes"),
    35
  );
  assert.equal(
    adapter.parseCommissionAllocatedMinutes(
      "with approximately 15 minutes of learner effort. Allocate approximately 5 minutes to mean and 10 minutes to SD."
    ),
    15
  );
  assert.equal(adapter.parseLearningTimeEnvelopeMinutes("90 minutes"), 90);
  assert.equal(adapter.parseLearningTimeEnvelopeMinutes("1.5 hours"), 90);
});

test("advisory Design Page capture remains ok with warnings and unchanged schemas", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Credibility judgements",
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "Intro",
        order: 1,
        exposition: "Begin the journey."
      },
      {
        section_id: "exp_1",
        title: "1. Argument",
        order: 2,
        exposition: "Compose the argument."
      }
    ],
    commissions: [writingCommission()],
    assembly_state: { calls_model: true, current_stage: "design_page", enriched_by: ["design_page"] },
    learning_journey: { continuity: "Test continuity." }
  };
  const snap = JSON.stringify(page);
  const wf = {
    id: "wf-lj",
    product: "learning_journey",
    deliverySeed: { learning_time: "10 minutes" },
    steps: []
  };
  const check = api.validateDesignPageOrPageCapture(page, wf, {
    outputName: "page",
    canonical_step_id: "step_design_page",
    title: "Design Page"
  });
  assert.equal(check.ok, true, (check.errors || []).join("; "));
  assert.equal((check.errors || []).length, 0);
  assert.ok(Array.isArray(check.warnings));
  assert.ok(check.warnings.length >= 1);
  assert.match(check.warnings[0], /Workload feasibility \(indicative/);
  assert.equal(JSON.stringify(page), snap);
});

test("no regression: 100A estimator independence", () => {
  const mapped = adapter.mapCommissionToEstimatorInput(writingCommission());
  const a = estimator.estimateActivityWorkload(mapped.input);
  const b = estimator.estimateActivityWorkload({
    activityType: "argumentative_writing",
    suggestedLengthWords: { min: 300, max: 400 },
    reasoningDemand: "argument",
    readingDemand: "moderate",
    declaredDurationMinutes: 45
  });
  assert.deepEqual(a.indicativeEffortMinutes, b.indicativeEffortMinutes);
});

test("no regression: 100B-1 Interactive adapter still warns", () => {
  const warnings = interactiveAdapter.collectInteractiveWorkloadWarnings(
    {
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
            "Write one coherent philosophical argument of approximately 300–400 words.",
          expected_output: "A sustained philosophical argument of approximately 300–400 words."
        }
      ]
    },
    null
  );
  assert.ok(warnings.length >= 1);
});

test("no regression: 100B-2 Assessment Pack adapter still warns", () => {
  const warnings = assessmentAdapter.collectAssessmentPackWorkloadWarnings({
    elicitations: [
      {
        elicitation_id: "E_PHIL",
        indicative_duration_minutes: 10,
        evidence_ask: "Elicit a philosophical argument",
        stimulus: "Case evidence.",
        delivery: {
          kind: "constructed_performance",
          prompt: {
            title: "Compose your philosophical argument",
            task: "Write one coherent philosophical argument of approximately 300–400 words.",
            suggested_length: "Approximately 300–400 words.",
            indicative_time: "Approximately 10 minutes."
          }
        }
      }
    ]
  });
  assert.ok(warnings.length >= 1);
});

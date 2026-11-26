const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const {
  PEDAGOGICAL_ICON_LIBS,
  runPrismLibScriptsInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");

const estimator = require(path.join(repoRoot, "lib/workload-feasibility-estimator.js"));
const ljAdapter = require(path.join(repoRoot, "lib/learning-journey-workload-feasibility-adapter.js"));
const interactiveAdapter = require(path.join(repoRoot, "lib/interactive-workload-feasibility-adapter.js"));
const apAdapter = require(path.join(repoRoot, "lib/assessment-pack-workload-feasibility-adapter.js"));

function createElementStub() {
  return {
    value: "",
    textContent: "",
    innerHTML: "",
    className: "",
    style: {},
    dataset: {},
    children: [],
    classList: {
      add() {},
      remove() {},
      toggle() {
        return false;
      },
      contains: () => false
    },
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    appendChild() {},
    removeChild() {},
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {},
    querySelector: () => null,
    querySelectorAll: () => []
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) {
        elementStore.set(id, createElementStub());
      }
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: createElementStub()
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    setTimeout,
    clearTimeout,
    location: { hash: "", pathname: "/" },
    _: { debounce: (fn) => fn },
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: windowStub._, document: documentStub, window: windowStub };
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
  return sandbox.window.__PRISM_TEST_API;
}

test("Practice math-problem operator-precedence bug is fixed", () => {
  const practiceWithWords = ljAdapter.mapCommissionToEstimatorInput({
    commission_id: "c_prac_words",
    title: "Interpret spread",
    product_id: "practice",
    allocated_minutes: 15,
    specification_text:
      "Diagnose whether learners calculate the wrong standard deviation and write approximately 180–220 words justifying your conclusion."
  });
  assert.ok(practiceWithWords);
  assert.notEqual(practiceWithWords.input.activityType, "mathematical_problem");
  assert.equal(practiceWithWords.input.activityType, "analytical_writing");

  const expositoryWithCalc = ljAdapter.mapCommissionToEstimatorInput({
    commission_id: "c_exp_calc",
    title: "Explain dispersion",
    product_id: "expository",
    allocated_minutes: 12,
    specification_text:
      "Explain why we calculate standard deviation using squared deviations in approximately 150–200 words."
  });
  assert.ok(expositoryWithCalc);
  assert.notEqual(expositoryWithCalc.input.activityType, "mathematical_problem");

  const genuinePracticeMath = ljAdapter.mapCommissionToEstimatorInput({
    commission_id: "c_prac_math",
    title: "Solve equation",
    product_id: "practice",
    allocated_minutes: 15,
    specification_text: "Calculate the standard deviation and solve the equation step by step."
  });
  assert.ok(genuinePracticeMath);
  assert.equal(genuinePracticeMath.input.activityType, "mathematical_problem");
});

test("LJ uses authoritative structured durations over conflicting prose and flags unavailable authoritative durations", () => {
  const page = {
    duration_contract_version: "s104_m1",
    learning_journey: { allocated_minutes: 25 },
    commissions: [
      {
        commission_id: "c1",
        order: 1,
        title: "Dense synthesis",
        product_id: "assessment_pack",
        allocated_minutes: 10,
        specification_text:
          "Approximate learner time: 90 minutes. Write an evidence-based institutional recommendation of approximately 350–450 words using the complete fictional evidence dossier."
      },
      {
        commission_id: "c2",
        order: 2,
        title: "Follow-up",
        product_id: "practice",
        allocated_minutes: 15,
        specification_text: "Short practice check: one auto-checkable multiple-choice item."
      }
    ]
  };
  const snap = JSON.stringify(page);
  const res = ljAdapter.assessLearningJourneyWorkload(page);
  assert.equal(res.journey.envelopeMinutes, 25);
  assert.equal(res.journey.allocatedSum, 25);
  assert.equal(res.journey.durationStatus, "available");
  assert.equal(res.findings[0].allocatedMinutes, 10);
  assert.equal(res.findings[0].durationSource, "structured");
  assert.ok(res.warnings.some((w) => /allocated duration of 10 minutes/.test(w)));
  assert.equal(JSON.stringify(page), snap);

  const missingStructuredPage = {
    duration_contract_version: "s104_m1",
    learning_journey: {},
    commissions: [
      {
        commission_id: "c_missing",
        order: 1,
        title: "Commission missing structured minutes",
        product_id: "practice",
        specification_text:
          "Approximate learner time: 20 minutes. Write approximately 180–250 words comparing two models."
      }
    ]
  };
  const unavailableRes = ljAdapter.assessLearningJourneyWorkload(missingStructuredPage, {
    requireAuthoritativeDuration: true
  });
  assert.equal(unavailableRes.journey.durationStatus, "unavailable");
  assert.equal(unavailableRes.findings[0].allocatedMinutes, null);
  assert.ok(unavailableRes.warnings.some((w) => /unavailable/i.test(w)));
});

test("Practice cumulative comparison catches dense multi-dataset page against authoritative duration and flags missing duration instead of silent pass", () => {
  // Synthetic C01-like dense Practice page (never modifies c01-page.json).
  const densePracticePage = {
    schema_version: "2.0.0",
    artifact_type: "page",
    product_id: "practice",
    page_kind: "practice",
    learning_sequence: {
      ordered_activity_ids: ["A1", "A2"]
    },
    activities: [
      {
        activity_id: "A1",
        title: "Compare evidence tables and diagnose pattern",
        learner_task:
          "Inspect the three datasets, make two selection judgements, study the worked example, and write approximately 60–90 words explaining the trade-off.",
        expected_output: "Approximately 60–90 words.",
        required_materials: [
          { material_id: "D01", type: "data_table", purpose: "dataset 1" },
          { material_id: "D02", type: "data_table", purpose: "dataset 2" },
          { material_id: "D03", type: "data_table", purpose: "dataset 3" },
          { material_id: "SEL1", type: "selection", purpose: "choose interpretation" },
          { material_id: "SEL2", type: "selection", purpose: "choose mechanism" },
          { material_id: "WE1", type: "worked_example", purpose: "worked demonstration" },
          { material_id: "T1", type: "template", purpose: "learner explanation" },
          { material_id: "OPT1", type: "text", purpose: "optional hint if needed", optional: true }
        ],
        // Enriched materials mirroring same IDs — must NOT be double counted!
        materials: [
          { material_id: "D01", material_type: "data_table", title: "D01" },
          { material_id: "D02", material_type: "data_table", title: "D02" },
          { material_id: "D03", material_type: "data_table", title: "D03" },
          { material_id: "SEL1", material_type: "selection", title: "SEL1" },
          { material_id: "SEL2", material_type: "selection", title: "SEL2" },
          { material_id: "WE1", material_type: "worked_example", title: "WE1" },
          { material_id: "T1", material_type: "template", title: "T1" },
          { material_id: "OPT1", material_type: "text", title: "Optional hint", optional: true }
        ]
      },
      {
        activity_id: "A2",
        title: "Diagnose and revise against criteria",
        learner_task:
          "Inspect two more datasets, make three selection judgements, complete the response template in approximately 70–100 words, check all 6 diagnostic criteria, and revise your response.",
        expected_output: "Completed structured review.",
        required_materials: [
          { material_id: "D04", type: "data_table", purpose: "dataset 4" },
          { material_id: "D05", type: "data_table", purpose: "dataset 5" },
          { material_id: "SEL3", type: "selection", purpose: "select indicator" },
          { material_id: "SEL4", type: "selection", purpose: "select error" },
          { material_id: "SEL5", type: "selection", purpose: "select correction" },
          { material_id: "T2", type: "template", purpose: "written synthesis" },
          {
            material_id: "CHK1",
            type: "checklist",
            purpose: "diagnostic feedback",
            body: {
              criteria: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]
            }
          }
        ]
      }
    ]
  };

  // Deduplication check: A1 has 3 unique datasets, 2 selections, 1 worked example, 1 optional note (not 6/4/2).
  const a1 = interactiveAdapter.mapActivityToEstimatorInput(densePracticePage.activities[0], {});
  assert.equal(a1.input.newEvidenceCount, 3);
  assert.equal(a1.input.selectionControlCount, 2);
  assert.equal(a1.input.workedExampleCount, 1);
  assert.equal(a1.input.optionalSupportCount, 1);
  assert.equal(a1.input.constructedResponseCount, 1);

  const a2 = interactiveAdapter.mapActivityToEstimatorInput(densePracticePage.activities[1], {});
  assert.equal(a2.input.checklistCriterionCount, 6);
  assert.equal(a2.input.requiresRevision, true);

  // Missing authoritative duration -> explicit unavailable warning (NOT silent pass).
  const missingDur = interactiveAdapter.assessInteractivePageWorkload(densePracticePage, null);
  assert.equal(missingDur.durationStatus, "unavailable");
  assert.ok(missingDur.warnings.some((w) => /authoritative duration is unavailable/i.test(w)));

  // Authoritative duration 15 min -> cumulative overload warning naming principal drivers
  // (S104 final policy: 20 min has upper indicative boundary 25; 15 min has upper boundary 20).
  const tightDur = interactiveAdapter.assessInteractivePageWorkload(densePracticePage, null, {
    effectiveDurationMinutes: 15
  });
  assert.equal(tightDur.durationStatus, "available");
  assert.equal(tightDur.cumulative.plausiblyInsufficient, true);
  assert.ok(tightDur.warnings.some((w) => /cumulative/i.test(w)));
  assert.ok(tightDur.warnings.some((w) => /evidence inspection|structured decisions|worked examples|feedback/i.test(w)));
});

test("Distinguishes familiar vs new vs mixed evidence and excludes optional support from required load", () => {
  const familiarOnly = estimator.estimateActivityWorkload({
    activityType: "analytical_writing",
    suggestedLengthWords: { min: 100, max: 130 },
    readingDemand: "familiar",
    familiarEvidenceCount: 1,
    declaredDurationMinutes: 25
  });
  const newEvidence = estimator.estimateActivityWorkload({
    activityType: "analytical_writing",
    suggestedLengthWords: { min: 100, max: 130 },
    readingDemand: "moderate",
    newEvidenceCount: 3,
    declaredDurationMinutes: 25
  });
  const mixedEvidence = estimator.estimateActivityWorkload({
    activityType: "analytical_writing",
    suggestedLengthWords: { min: 100, max: 130 },
    readingDemand: "familiar",
    familiarEvidenceCount: 1,
    newEvidenceCount: 2,
    declaredDurationMinutes: 25
  });
  assert.ok(familiarOnly.indicativeEffortMinutes.low < mixedEvidence.indicativeEffortMinutes.low);
  assert.ok(mixedEvidence.indicativeEffortMinutes.low < newEvidence.indicativeEffortMinutes.low);

  const withoutOptional = estimator.estimateActivityWorkload({
    activityType: "mcq",
    selectionControlCount: 2,
    declaredDurationMinutes: 10
  });
  const withOptional = estimator.estimateActivityWorkload({
    activityType: "mcq",
    selectionControlCount: 2,
    optionalSupportCount: 3,
    declaredDurationMinutes: 10
  });
  assert.deepEqual(withoutOptional.indicativeEffortMinutes, withOptional.indicativeEffortMinutes);
  assert.ok(withOptional.factors.some((f) => /Optional support\/extensions \(3\)/.test(f)));
});

test("Assessment Pack adapter respects authoritative duration, cumulative tasks, structured stimuli, and optional revision separation", () => {
  const apArtefact = {
    elicitations: [
      {
        elicitation_id: "E1",
        delivery: {
          kind: "auto_checkable_items",
          prompt: { title: "Check pattern", task: "Inspect scatterplot and answer." },
          stimulus: { kind: "scatterplot", datasets: [{ id: "S1" }, { id: "S2" }] },
          items: [{ id: "i1" }, { id: "i2" }, { id: "i3" }, { id: "i4" }]
        }
      },
      {
        elicitation_id: "E2",
        delivery: {
          kind: "constructed_performance",
          prompt: {
            title: "Interpret residuals",
            task: "Explain the pattern in approximately 150–200 words.",
            suggested_length: "Approximately 150–200 words."
          },
          response_workspace: { parts: [{ id: "p1" }, { id: "p2" }] }
        },
        formative_return: {
          optional_revision: { offered: true },
          materials: [{ kind: "worked_example", title: "Sample solution" }]
        }
      }
    ]
  };
  // E2 has optional_revision.offered = true WITHOUT mandatory revision prompt/task -> not forced into required revision!
  const mappedE2 = apAdapter.mapElicitationToEstimatorInput(apArtefact.elicitations[1]);
  assert.equal(mappedE2.input.requiresRevision, false);
  assert.equal(mappedE2.input.workedExampleCount, 1);

  const noDur = apAdapter.assessAssessmentPackWorkload(apArtefact);
  assert.equal(noDur.durationStatus, "unavailable");
  assert.ok(noDur.warnings.some((w) => /unavailable/i.test(w)));

  const tightPack = apAdapter.assessAssessmentPackWorkload(apArtefact, {
    effectiveDurationMinutes: 10
  });
  assert.equal(tightPack.durationStatus, "available");
  assert.equal(tightPack.cumulative.plausiblyInsufficient, true);
  assert.ok(tightPack.warnings.some((w) => /cumulative/i.test(w)));
});

test("app.js integration supplies authoritative durations to Practice LS, Assessment Pack, and LJ without mutating artefacts or conflating structural validation", () => {
  const api = loadPrismTestApi();
  const apPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Pack check",
    assessment_evidence: {
      elicitations: [
        {
          elicitation_id: "E_LONG",
          delivery: {
            kind: "constructed_performance",
            prompt: {
              title: "Long synthesis",
              task: "Write approximately 220–280 words evaluating the evidence.",
              suggested_length: "Approximately 220–280 words."
            }
          }
        }
      ]
    }
  };
  const apCheck = api.validateAssessmentDesignPageCapture(apPage, {
    id: "wf-ap-m5",
    product: "assessment_pack",
    adjustments: { parameters: { duration_minutes: 10 } }
  });
  assert.equal(apCheck.ok, true, (apCheck.errors || []).join("; "));
  assert.ok(apCheck.warnings.some((w) => /allocated duration of 10 minutes/i.test(w)));

  // Structural mismatch still blocks cleanly with errors and zero feasibility clutter.
  const lsBad = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "learning_sequence", enriched_by: ["learning_sequence"] },
    learning_sequence: {
      ordered_activity_ids: ["A1"],
      total_duration_minutes: 10,
      timeline: [{ activity_id: "A1", duration_minutes: 10 }]
    },
    activities: [
      {
        activity_id: "A1",
        title: "Write",
        duration_minutes: 10,
        learner_task: "Write approximately 250–300 words."
      }
    ]
  };
  const structuralErrCheck = api.validateLearningSequencePartialPageCapture(lsBad, {
    effectiveDurationMinutes: 45
  });
  assert.equal(structuralErrCheck.ok, false);
  assert.equal((structuralErrCheck.warnings || []).length, 0);

  // LJ integration: authoritative structured commission allocation wins over conflicting prose.
  const ljPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    duration_contract_version: "s104_m1",
    product_id: "learning_journey",
    title: "Structured LJ check",
    activities: [],
    sections: [
      { section_id: "journey_intro", title: "Intro", order: 1, exposition: "Begin." },
      { section_id: "exp_1", title: "1. Synthesis", order: 2, exposition: "Synthesize." }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Dense synthesis",
        product_id: "assessment_pack",
        status: "supported",
        allocated_minutes: 10,
        specification_text:
          "Approximate learner time: 90 minutes. Write an evidence-based institutional recommendation of approximately 350–450 words using the complete fictional evidence dossier."
      }
    ],
    assembly_state: { calls_model: true, current_stage: "design_page", enriched_by: ["design_page"] },
    learning_journey: { continuity: "Coherent flow.", allocated_minutes: 10 }
  };
  const ljWf = {
    id: "wf-lj-m5",
    product: "learning_journey",
    workflowBriefResolution: {
      resolvedFactors: { commissioned_duration_minutes: 10, duration_contract_version: "s104_m1" }
    },
    steps: []
  };
  const ljCheck = api.validateDesignPageOrPageCapture(ljPage, ljWf, {
    outputName: "page",
    canonical_step_id: "step_design_page",
    title: "Design Page"
  });
  assert.equal(ljCheck.ok, true, (ljCheck.errors || []).join("; "));
  assert.ok(ljCheck.warnings.some((w) => /allocated duration of 10 minutes/.test(w)));
});

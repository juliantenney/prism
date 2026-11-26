/**
 * Sprint 104 — Situated Task downstream & upstream workload feasibility regression suite.
 *
 * Covers:
 * 1. Genuinely proportionate short Situated Task (no false positive).
 * 2. Substantial integrated advisory judgement (single workspace, multi-part reasoning,
 *    paired observation table, reasoning review — without inferring multiple written responses).
 * 3. Multiple genuinely independent recording requirements.
 * 4. Familiar vs unfamiliar vs mixed evidence without double-counting.
 * 5. Integrated reasoning & writing / revision without double-counting.
 * 6. Upstream Learning Journey extraction for Situated Task commissions + explicit
 *    insufficient_evidence vs assessed_feasible distinction.
 * 7. Full app.js Stage 5 warning lifecycle: capture, restoration, replacement,
 *    invalidation, clearing, and duration-lock preservation.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const family = require(path.join(repoRoot, "lib", "first-class-workflow-family.js"));
const design = require(path.join(repoRoot, "lib", "situated-task-design-page.js"));
const stAdapter = require(path.join(repoRoot, "lib", "situated-task-workload-feasibility-adapter.js"));
const ljAdapter = require(path.join(repoRoot, "lib", "learning-journey-workload-feasibility-adapter.js"));
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function makeBaseSituatedPage(overrides) {
  const page = design.buildSituatedTaskDesignPageFixture({
    title: (overrides && overrides.title) || "Situated Task"
  }).page;
  return Object.assign(page, overrides || {});
}

function buildShortProportionateSituatedPage() {
  const page = makeBaseSituatedPage({
    title: "Spot Pricing Signals in One Aisle"
  });
  page.sections = [
    {
      section_id: "orient",
      title: "What you will do",
      order: 1,
      exposition:
        "Inspect two shelf labels in a local shop or online listing and notice whether unit pricing is shown clearly alongside promotional discounts."
    }
  ];
  page.situated_learning.activity.undertaking =
    "Inspect two shelf labels and record a brief 1–2 sentence note on which unit-price cue was clearest.";
  page.situated_learning.record.retain = "One brief note naming the clearest unit-price cue.";
  page.situated_learning.record.entries = [
    {
      entry_id: "quick_note",
      order: 1,
      label: "Brief observation note",
      prompt: "Write a brief 1–2 sentence note on which price cue stood out."
    }
  ];
  return page;
}

function buildIntegratedAdvisorySituatedPage() {
  const tableMd = [
    "| District | Spend per Pupil (£) | Exam Score |",
    "| --- | ---: | ---: |",
    "| D1 | 4800 | 62 |",
    "| D2 | 5100 | 64 |",
    "| D3 | 5300 | 63 |",
    "| D4 | 5600 | 67 |",
    "| D5 | 5900 | 68 |",
    "| D6 | 6200 | 70 |",
    "| D7 | 6500 | 71 |",
    "| D8 | 6900 | 74 |",
    "| D9 | 7200 | 73 |",
    "| D10 | 7600 | 77 |"
  ].join("\n");

  const page = makeBaseSituatedPage({
    title: "Advising on Local Education Funding Evidence"
  });
  page.sections = [
    {
      section_id: "orient",
      title: "The advisory situation",
      order: 1,
      exposition:
        "A local council committee has asked for an independent advisory note on whether raising per-pupil funding directly raises exam performance. Examine the ten paired observations below carefully.\n\n" +
        tableMd +
        "\n\nInterpret the pattern across all ten paired observations before forming any causal claim. Consider direct causation, reverse causality, and common-cause explanations, and evaluate the limitations of observational data."
    },
    {
      section_id: "task",
      title: "Construct and review your advisory judgement",
      order: 2,
      exposition:
        "Work through the three competing causal mechanisms (direct, reverse, and common-cause explanations), evaluate what the evidence cannot establish, review your reasoning against causal-inference criteria before finalising, and compose one integrated written advisory judgement for the committee."
    }
  ];
  page.situated_learning.activity.undertaking =
    "Interpret the ten paired observations, construct direct, reverse, and common-cause explanations, evaluate evidence limitations, review your reasoning, and write one integrated written advisory judgement.";
  page.situated_learning.record.retain =
    "One integrated written advisory judgement incorporating competing causal explanations and evidence limitations.";
  page.situated_learning.record.entries = [
    {
      entry_id: "advisory_judgement",
      order: 1,
      label: "Integrated advisory judgement",
      prompt:
        "Write one integrated written advisory judgement explaining the pattern in the ten paired observations, comparing direct, reverse, and common-cause explanations, evaluating evidence limitations, and stating your recommendation.",
      placement: { after_section_id: "task" },
      artefact: {
        elicitation_id: "c4_advisory_judgement",
        response_kind: "constructed_text"
      }
    }
  ];
  return page;
}

function buildMultiEntrySituatedPage() {
  const page = makeBaseSituatedPage({
    title: "Workplace Handover Field Investigation"
  });
  page.sections = [
    {
      section_id: "orient",
      title: "Prepare for observation",
      order: 1,
      exposition:
        "Before observing two live customer handovers, note what sequence and communication cues you expect to see."
    },
    {
      section_id: "observe",
      title: "Observe in context",
      order: 2,
      exposition:
        "Observe two live handovers and record what was actually said, handed over, or omitted."
    },
    {
      section_id: "divergence",
      title: "Compare expectation and practice",
      order: 3,
      exposition:
        "Compare your expectation against what happened in practice and note where practice diverged."
    }
  ];
  page.situated_learning.activity.undertaking =
    "Record pre-visit expectations, observe two live handovers, and document where practice diverged from expectation.";
  page.situated_learning.record.entries = [
    {
      entry_id: "expectation",
      order: 1,
      label: "Pre-visit expectation",
      prompt: "Record what you expect to happen during the handover.",
      placement: { after_section_id: "orient" }
    },
    {
      entry_id: "observation",
      order: 2,
      label: "Live observation log",
      prompt: "Record what was actually said and done across both handovers.",
      placement: { after_section_id: "observe" }
    },
    {
      entry_id: "divergence",
      order: 3,
      label: "Divergence analysis",
      prompt: "Analyse where observed practice diverged from expectation and why it matters.",
      placement: { after_section_id: "divergence" }
    }
  ];
  return page;
}

test("1. Genuinely proportionate short Situated Task is assessed feasible with no warning", () => {
  const page = buildShortProportionateSituatedPage();
  const res = stAdapter.assessSituatedTaskWorkload(page, { effectiveDurationMinutes: 12 });

  assert.equal(res.status, "assessed_feasible");
  assert.equal(res.sufficientEvidence, true);
  assert.equal(res.insufficientEvidence, false);
  assert.equal(res.warnings.length, 0);
  assert.equal(res.mapped.input.constructedResponseCount, 1);
  assert.equal(res.mapped.input.integratedReasoningProduction, true);
  assert.ok(res.estimate.indicativeEffortMinutes.low <= 12);
});

test("2. Substantial integrated advisory judgement stays 1 workspace yet flags overload against 13 min", () => {
  const page = buildIntegratedAdvisorySituatedPage();
  const res = stAdapter.assessSituatedTaskWorkload(page, { effectiveDurationMinutes: 13 });

  // Single workspace — must NOT infer multiple independent written responses
  assert.equal(res.mapped.input.constructedResponseCount, 1);
  assert.equal(res.mapped.metadata.recordEntryCount, 1);
  assert.equal(res.mapped.metadata.dataTableCount, 1);
  assert.equal(res.mapped.metadata.substantialWrittenDeliverable, true);
  assert.equal(res.mapped.input.integratedReasoningProduction, undefined);
  assert.ok(res.mapped.metadata.distinctReasoningDemandCount >= 3);
  assert.equal(res.mapped.input.reasoningDemand, "evaluation");
  assert.equal(res.mapped.input.requiresFeedbackInterpretation, true);

  assert.equal(res.status, "plausibly_insufficient");
  assert.equal(res.estimate.plausiblyInsufficient, true);
  assert.equal(res.warnings.length, 1);
  assert.match(res.warnings[0], /Situated Task/);
  assert.match(res.warnings[0], /allocated 13 minutes/);
  assert.match(res.warnings[0], /You may continue without changing the design/);

  // Same page is feasible when given a realistic envelope (e.g. 25 min)
  const feasibleRes = stAdapter.assessSituatedTaskWorkload(page, { effectiveDurationMinutes: 25 });
  assert.equal(feasibleRes.status, "assessed_feasible");
  assert.equal(feasibleRes.warnings.length, 0);
});

test("3. Multiple genuinely independent recording requirements scale workload distinctly", () => {
  const page = buildMultiEntrySituatedPage();
  const shortAlloc = stAdapter.assessSituatedTaskWorkload(page, { effectiveDurationMinutes: 10 });
  const adequateAlloc = stAdapter.assessSituatedTaskWorkload(page, { effectiveDurationMinutes: 28 });

  assert.equal(shortAlloc.mapped.input.constructedResponseCount, 3);
  assert.equal(shortAlloc.mapped.metadata.recordEntryCount, 3);
  assert.equal(shortAlloc.status, "plausibly_insufficient");
  assert.equal(shortAlloc.warnings.length, 1);
  assert.equal(adequateAlloc.status, "assessed_feasible");
  assert.equal(adequateAlloc.warnings.length, 0);
});

test("4. Familiar vs unfamiliar evidence differentiates reading/inspection load without double-counting", () => {
  const unfamiliarPage = buildIntegratedAdvisorySituatedPage();
  const familiarPage = makeBaseSituatedPage({
    title: "Revisit Earlier Evidence in Context"
  });
  familiarPage.sections = [
    {
      section_id: "revisit",
      title: "Revisit your earlier findings",
      order: 1,
      exposition:
        "Bring forward the familiar dataset you already examined in the earlier commission and check whether one new caveat changes your prior conclusion."
    }
  ];
  familiarPage.situated_learning.activity.undertaking =
    "Revisit your earlier evidence and record a brief 1–2 sentence note on whether the caveat shifts your prior judgement.";
  familiarPage.situated_learning.record.entries = [
    {
      entry_id: "revisit_note",
      order: 1,
      label: "Brief revisit note",
      prompt: "Write a brief 1–2 sentence note on the caveat."
    }
  ];

  const unf = stAdapter.assessSituatedTaskWorkload(unfamiliarPage, { effectiveDurationMinutes: 13 });
  const fam = stAdapter.assessSituatedTaskWorkload(familiarPage, { effectiveDurationMinutes: 13 });

  assert.equal(fam.mapped.input.readingDemand, "familiar");
  assert.equal(fam.mapped.input.familiarMaterial, true);
  assert.equal(fam.status, "assessed_feasible");
  assert.ok(
    fam.estimate.indicativeEffortMinutes.low < unf.estimate.indicativeEffortMinutes.low,
    "Familiar brief revisit must estimate lower than unfamiliar full advisory task"
  );
});

test("5. Integrated reasoning + writing and duration_unavailable / insufficient_evidence are explicit", () => {
  const briefPage = buildShortProportionateSituatedPage();
  const noDur = stAdapter.assessSituatedTaskWorkload(briefPage, {});
  assert.equal(noDur.status, "duration_unavailable");
  assert.equal(noDur.durationStatus, "unavailable");
  assert.equal(noDur.warnings.length, 0);

  const emptySignals = stAdapter.assessSituatedTaskWorkload(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "",
      activities: [],
      sections: [],
      situated_learning: { purpose: {}, activity: {}, record: {}, reconnection: {} }
    },
    { effectiveDurationMinutes: 10 }
  );
  assert.equal(emptySignals.status, "insufficient_evidence");
  assert.equal(emptySignals.insufficientEvidence, true);
  assert.equal(emptySignals.sufficientEvidence, false);
  assert.equal(emptySignals.warnings.length, 0);
});

test("6. Upstream LJ extraction recognises Situated Task advisory deliverables, paired observations, and preserves insufficient_evidence status", () => {
  const ljPage = {
    learning_journey: { allocated_minutes: 33 },
    commissions: [
      {
        commission_id: "c4_advisory",
        title: "C4: Advising on Funding Evidence",
        product_id: "situated_task",
        allocated_minutes: 13,
        specification_text:
          "Interpret ten paired observations, construct direct, reverse, and common-cause explanations, evaluate evidence limitations, conduct a reasoning review, and produce one integrated written advisory judgement."
      },
      {
        commission_id: "c_brief_sit",
        title: "Brief field check",
        product_id: "situated_task",
        allocated_minutes: 10,
        specification_text:
          "Revisit your earlier evidence and record a brief note justifying whether one constraint applies."
      },
      {
        commission_id: "c_thin_spec",
        title: "Unspecified exploratory session",
        product_id: "situated_task",
        allocated_minutes: 10,
        specification_text: "Explore the local context openly."
      }
    ]
  };

  const res = ljAdapter.assessLearningJourneyWorkload(ljPage, {
    authoritativeParentDurationMinutes: 33
  });

  const c4 = res.findings.find((f) => f.commissionId === "c4_advisory");
  assert.ok(c4 && c4.mapped && c4.estimate);
  assert.equal(c4.mapped.input.constructedResponseCount, 1);
  assert.equal(c4.mapped.metadata.substantialWrittenDeliverable, true);
  assert.equal(c4.mapped.input.integratedReasoningProduction, undefined);
  assert.equal(c4.mapped.input.newEvidenceCount, 1);
  assert.equal(c4.mapped.input.requiresFeedbackInterpretation, true);
  assert.equal(c4.feasibilityStatus, "plausibly_insufficient");
  assert.equal(c4.estimate.plausiblyInsufficient, true);

  const brief = res.findings.find((f) => f.commissionId === "c_brief_sit");
  assert.ok(brief && brief.mapped && brief.estimate);
  assert.equal(brief.mapped.input.integratedReasoningProduction, true);
  assert.equal(brief.feasibilityStatus, "assessed_feasible");

  const thin = res.findings.find((f) => f.commissionId === "c_thin_spec");
  assert.ok(thin);
  assert.equal(thin.insufficientEvidence, true);
  assert.equal(thin.feasibilityStatus, "insufficient_evidence");
  assert.ok(res.journey.insufficientEvidenceCommissionIds.includes("c_thin_spec"));
  assert.equal(res.journey.insufficientEvidenceCount, 1);
  assert.equal(res.journey.assessedCount, 2);
});

test("7. app.js Situated Task Stage 5 warning lifecycle: capture, restoration, replacement, invalidation, clearing, duration lock", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/workload-feasibility-estimator.js",
      "lib/situated-task-workload-feasibility-adapter.js",
      "lib/sprint38-visual-affordances.js",
      "lib/visual-planning-contract.js",
      "lib/situated-task-design-page.js",
      "lib/situated-task-sibling-prompts.js"
    ]
  });

  const built = family.buildFirstClassWorkflowFamily({
    product: "situated_task",
    focus: "Advise on local education funding evidence",
    audience: "undergraduate economics students",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);

  const wf = {
    id: "wf-c4-st-lifecycle",
    product: "situated_task",
    name: "C4 Situated Task Lifecycle",
    ldCreateOutputType: "situated_task",
    workflowOutputSpec: { pageEnrichmentV2: false, partialPageOutputs: false },
    adjustments: { parameters: { duration_minutes: 13 } },
    workflowBriefResolution: {
      resolvedFactors: {
        duration_minutes: 13,
        commissioned_duration_minutes: 13,
        duration_contract_version: "s104_m1"
      }
    },
    steps: built.steps.map((step, index) =>
      Object.assign({}, step, { id: "st-lc-" + (index + 1) })
    )
  };
  const stage5 = wf.steps[4];

  const overloadedRaw =
    "```json\n" + JSON.stringify(buildIntegratedAdvisorySituatedPage(), null, 2) + "\n```\nSTEP 5 OUTPUT: page";
  const feasibleRaw =
    "```json\n" + JSON.stringify(buildShortProportionateSituatedPage(), null, 2) + "\n```\nSTEP 5 OUTPUT: page";
  const invalidRaw = "```json\n{\"artifact_type\":\"page\",\"schema_version\":\"2.0.0\"}\n```";

  // 1. Capture (overloaded, 13 min): non-blocking ok:true + advisory warning; duration lock unchanged
  const capOverloaded = api.validateStrictJsonWorkflowRunStepCaptureForTest(overloadedRaw, stage5, wf);
  assert.equal(capOverloaded.ok, true);
  assert.equal(capOverloaded.warnings.length, 1);
  assert.match(capOverloaded.warnings[0], /allocated 13 minutes/);
  assert.equal(wf.workflowBriefResolution.resolvedFactors.duration_minutes, 13);

  // 2. Restoration on reload/hydration restores warning
  const restored = api.revalidateSituatedTaskDesignPageCaptureAfterHydrationForTest(wf, {
    capturesRaw: { [stage5.id]: overloadedRaw }
  });
  assert.equal(restored.ok, true);
  assert.equal(restored.warnings.length, 1);
  assert.match(api.getWorkflowRunWorkloadFeasibilityWarningsForTest(stage5.id), /allocated 13 minutes/);

  // 3. Replacement with proportionate short task clears warning
  const replaced = api.revalidateSituatedTaskDesignPageCaptureAfterHydrationForTest(wf, {
    capturesRaw: { [stage5.id]: feasibleRaw }
  });
  assert.equal(replaced.ok, true);
  assert.equal(replaced.warnings.length, 0);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest(stage5.id), "");

  // 4. Re-populate then invalidate with invalid capture clears warning
  api.revalidateSituatedTaskDesignPageCaptureAfterHydrationForTest(wf, {
    capturesRaw: { [stage5.id]: overloadedRaw }
  });
  assert.ok(api.getWorkflowRunWorkloadFeasibilityWarningsForTest(stage5.id).length > 0);
  const invalidated = api.revalidateSituatedTaskDesignPageCaptureAfterHydrationForTest(wf, {
    capturesRaw: { [stage5.id]: invalidRaw }
  });
  assert.equal(invalidated.ok, false);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest(stage5.id), "");

  // 5. Re-populate then clear (empty capture) clears warning
  api.revalidateSituatedTaskDesignPageCaptureAfterHydrationForTest(wf, {
    capturesRaw: { [stage5.id]: overloadedRaw }
  });
  assert.ok(api.getWorkflowRunWorkloadFeasibilityWarningsForTest(stage5.id).length > 0);
  const cleared = api.revalidateSituatedTaskDesignPageCaptureAfterHydrationForTest(wf, {
    capturesRaw: { [stage5.id]: "" }
  });
  assert.equal(cleared.ok, true);
  assert.equal(cleared.empty, true);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest(stage5.id), "");
});

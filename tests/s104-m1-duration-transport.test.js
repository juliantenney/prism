/**
 * Sprint 104 Milestone 1 — Authoritative duration transport & authority tests.
 *
 * Scope (Milestone 1 only):
 * - Canonical Step 4 origin (<<<COMMISSION_DURATIONS_BEGIN>>>) -> Step 5 LJ Design Page
 * - Lossless transport across Expository, Practice, Assessment Pack, Situated Task
 *   (Design Page -> envelope -> intake -> deliverySeed -> resolvedFactors -> effective context)
 * - Authority & conflict detection (Step 4 vs Step 5 mismatch; component override lock)
 * - Legacy commissions without structured duration (explicit null/unavailable, zero prose parsing)
 * - Single & batch creation, delete/recreate, persistence/normalization, standalone non-regression
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
const siblingPrompts = require("../lib/learning-journey-sibling-prompts.js");
const designMod = require("../lib/learning-journey-design-page.js");
const intakeMod = require("../lib/first-class-commission-intake.js");
const familyMod = require("../lib/first-class-workflow-family.js");
const bindMod = require("../lib/commission-native-lo-bind.js");
const statusMod = require("../lib/learning-journey-commission-production-status.js");

const SHARED_CORPUS = [
  "Correlation and Causation — Shared Authoritative Dataset.",
  "Ice cream sales and drowning incidents rise together in summer (r = 0.87).",
  "Confounding variable: ambient temperature."
].join("\n");

function loPayload(statement) {
  return {
    learning_outcomes: [
      {
        statement,
        related_concepts: ["correlation", "causation", "confounding"],
        cognitive_level: "analyse"
      }
    ],
    learner_level: "undergraduate",
    scope: "component"
  };
}

function makeStep4CommissioningText(durationsObj, proseMinutes) {
  const mins = proseMinutes || { c1: 8, c2: 12, c3: 20, c4: 30 };
  const base = [
    "LEARNING EXPERIENCE COMMISSIONS",
    "",
    "<<<SHARED_AUTHORITATIVE_MATERIAL_BEGIN>>>",
    SHARED_CORPUS,
    "<<<SHARED_AUTHORITATIVE_MATERIAL_END>>>",
    "",
    "3. PRISM PRODUCT COMMISSIONS",
    "- Commission id: c1 — Practice (Approximate learner time: " + mins.c1 + " minutes)",
    "- Commission id: c2 — Expository (Approximate learner time: " + mins.c2 + " minutes)",
    "- Commission id: c3 — Assessment Pack (Approximate learner time: " + mins.c3 + " minutes)",
    "- Commission id: c4 — Situated Task (Approximate learner time: " + mins.c4 + " minutes)",
    "",
    "6. TIME CHECK",
    "Total allocation accounted for."
  ];
  if (durationsObj) {
    base.push(
      "",
      "<<<COMMISSION_DURATIONS_BEGIN>>>",
      JSON.stringify(durationsObj, null, 2),
      "<<<COMMISSION_DURATIONS_END>>>"
    );
  }
  base.push("", "STEP 4 OUTPUT: learning_commissions");
  return base.join("\n");
}

function makeFourProductPageWithDurations(options) {
  const opts = options || {};
  const durations = opts.durations || { c1: 8, c2: 12, c3: 20, c4: 30 };
  const omitCommissionAllocated = !!opts.omitCommissionAllocated;
  const includeJourneyAllocated = opts.journeyAllocatedMinutes !== undefined
    ? opts.journeyAllocatedMinutes
    : 70;
  const specSuffix = opts.includeProseTime ? " Approximate learner time: 99 minutes." : "";

  const c1Spec =
    "Educational job: compare competing economic explanations from shared evidence." +
    specSuffix +
    "\n\n" +
    bindMod.wrapComponentLearningOutcomes(
      loPayload("Compare competing causal claims against confounding evidence.")
    );
  const c2Spec =
    "Educational job: explain why correlation does not imply causation." +
    specSuffix +
    "\n\n" +
    bindMod.wrapComponentLearningOutcomes(
      loPayload("Explain confounding and reverse causation without jargon.")
    );
  const c3Spec =
    "Educational job: evaluate causal inference independently and retain response c3.E1." +
    specSuffix +
    "\n\n" +
    bindMod.wrapComponentLearningOutcomes(
      loPayload("Defend an independent causal judgement using supplied data.")
    );
  const c4Spec =
    "Educational job: observe workplace evidence practices in context." +
    specSuffix;

  const comm = (base, id) =>
    omitCommissionAllocated || durations[id] == null
      ? base
      : Object.assign({}, base, { allocated_minutes: durations[id] });

  const ljMeta = {
    design_intent: "Build evidence-backed causal reasoning.",
    continuity: "Same observational scenario throughout.",
    journal: { enabled: false, title: "Learning Journal", entries: [] }
  };
  if (includeJourneyAllocated != null && !omitCommissionAllocated) {
    ljMeta.allocated_minutes = includeJourneyAllocated;
  }

  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Correlation and Causation",
    shared_authoritative_material: {
      status: "generated",
      content: SHARED_CORPUS
    },
    activities: [],
    sections: [
      { section_id: "journey_intro", title: "Introduction", order: 1, exposition: "Journey intro." },
      { section_id: "exp_1", title: "Comparing Explanations", order: 2, exposition: "Practice step." },
      { section_id: "exp_2", title: "Causal Mechanisms", order: 3, exposition: "Expository step." },
      { section_id: "exp_3", title: "Independent Judgement", order: 4, exposition: "Assessment step." },
      { section_id: "exp_4", title: "Workplace Observation", order: 5, exposition: "Situated step." }
    ],
    commissions: [
      comm(
        {
          commission_id: "c1",
          section_id: "exp_1",
          order: 1,
          title: "Comparing competing explanations",
          product_id: "practice",
          status: "supported",
          specification_text: c1Spec,
          journey_context_text: "Opening shared scenario.",
          dependencies: ""
        },
        "c1"
      ),
      comm(
        {
          commission_id: "c2",
          section_id: "exp_2",
          order: 2,
          title: "Causal vs non-causal links",
          product_id: "expository",
          status: "supported",
          specification_text: c2Spec,
          journey_context_text: "Builds on comparing explanations in exp_1.",
          dependencies: "c1"
        },
        "c2"
      ),
      comm(
        {
          commission_id: "c3",
          section_id: "exp_3",
          order: 3,
          title: "Independent evidence judgement",
          product_id: "assessment_pack",
          status: "supported",
          specification_text: c3Spec,
          journey_context_text: "Builds on c1 and c2 causal reasoning.",
          dependencies: "c1, c2"
        },
        "c3"
      ),
      comm(
        {
          commission_id: "c4",
          section_id: "exp_4",
          order: 4,
          title: "Workplace data audit",
          product_id: "situated_task",
          status: "supported",
          specification_text: c4Spec,
          journey_context_text: "Applies c1–c3 causal scrutiny to a real workplace claim.",
          dependencies: "c3"
        },
        "c4"
      )
    ],
    learning_journey: ljMeta,
    assembly_state: { calls_model: true }
  };
}

function makeParentLjWorkflow(id, options) {
  const opts = options || {};
  const steps = [
    {
      id: "s4",
      title: "Commissioning",
      outputName: "learning_commissions",
      canonical_step_id: "step_journey_commissioning"
    },
    {
      id: "s5",
      title: "Design Page",
      outputName: "page",
      canonical_step_id: "step_design_page"
    }
  ];
  return {
    id: id || "wf-lj-m1",
    name: "Correlation and Causation",
    product: "learning_journey",
    steps,
    workflowBriefResolution: {
      initialBrief: Object.assign(
        { product: "learning_journey", sourceContext: SHARED_CORPUS },
        opts.step4Durations ? { commissionedComponentDurations: opts.step4Durations } : {}
      ),
      resolvedFactors: Object.assign(
        { product: "learning_journey", source_context: SHARED_CORPUS },
        opts.step4Durations ? { commissioned_component_durations: opts.step4Durations } : {}
      )
    },
    artefacts: SHARED_CORPUS
  };
}

function createMemoryCatalogueBackend() {
  const map = new Map();
  return {
    get: async (key) => (map.has(key) ? map.get(key) : null),
    set: async (key, val) => {
      map.set(key, val);
    },
    remove: async (key) => {
      map.delete(key);
    },
    clear: async () => {
      map.clear();
    }
  };
}

function loadHarness(sharedBackend) {
  const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");
  const backend = sharedBackend || createMemoryCatalogueBackend();
  catalogueStore.setStorageBackend(backend);
  let uuidCounter = 0;
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/prism-workflow-catalogue-store.js",
      "lib/first-class-workflow-family.js",
      "lib/commission-native-lo-bind.js",
      "lib/first-class-commission-intake.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js",
      "lib/learning-journey-shared-source.js",
      "lib/learning-journey-workflow-hierarchy.js",
      "lib/workflow-artefact-json-strict.js",
      "lib/ld-dla-page-enrich-contract.js"
    ]
  });
  loaded.window.Utils = loaded.window.Utils || {};
  loaded.window.Utils.uuid = function () {
    uuidCounter += 1;
    return "wf-m1-" + String(uuidCounter).padStart(3, "0") + "-" + Date.now();
  };
  loaded.window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeMod;
  loaded.sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeMod;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeMod;
  }
  loaded.window.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  loaded.sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  }
  const resourcesStub = { deleteResourcesForWorkflow: async () => ({ ok: true }) };
  loaded.window.PRISM_WORKFLOW_RESOURCES = resourcesStub;
  loaded.sandbox.PRISM_WORKFLOW_RESOURCES = resourcesStub;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_WORKFLOW_RESOURCES = resourcesStub;
  }
  loaded.window.confirm = () => true;
  loaded.sandbox.confirm = () => true;
  return { loaded, api: loaded.api, catalogueStore, backend };
}

test("Canonical Step 4 origin and Step 5 prompt alignment distinguish allocated duration", () => {
  const step4 = siblingPrompts.TEMPLATES.learning_commissions;
  const beginCount = (step4.match(/<<<COMMISSION_DURATIONS_BEGIN>>>/g) || []).length;
  const endCount = (step4.match(/<<<COMMISSION_DURATIONS_END>>>/g) || []).length;
  assert.equal(beginCount, 1);
  assert.equal(endCount, 1);
  assert.match(step4, /canonical point of origin/i);
  assert.match(step4, /Authoritative allocated duration/i);
  assert.match(step4, /Designed duration/i);
  assert.match(step4, /Estimated workload/i);

  const extracted = designMod.extractCommissionDurationsFromCommissioningText(step4);
  assert.equal(extracted.ok, true);
  assert.equal(extracted.byCommissionId.c1, 15);

  const dpPrompt = designMod.buildLearningJourneyDesignPagePrompt();
  const dpCopy = designMod.buildLearningJourneyDesignPageCopyInstructions();
  assert.match(dpPrompt, /"allocated_minutes": 15/);
  assert.match(dpPrompt, /Step 4 COMMISSION_DURATIONS/i);
  assert.match(dpPrompt, /do not independently invent, alter, round/i);
  assert.match(dpCopy, /Carry Step 4 allocated_minutes verbatim/i);
});

test("Step 4 COMMISSION_DURATIONS extraction rejects prose fallback and malformed payloads", () => {
  const proseOnly = [
    "LEARNING EXPERIENCE COMMISSIONS",
    "Commission title: C04 Practice",
    "Approximate learner time: 8 minutes",
    "STEP 4 OUTPUT: learning_commissions"
  ].join("\n");
  const missing = designMod.extractCommissionDurationsFromCommissioningText(proseOnly);
  assert.equal(missing.ok, false);
  assert.equal(missing.kind, "missing");

  const valid = designMod.extractCommissionDurationsFromCommissioningText(
    makeStep4CommissioningText({
      journey_allocated_minutes: 13,
      commissions: [
        { commission_id: "c1", allocated_minutes: 5 },
        { commission_id: "c4", allocated_minutes: 8 }
      ]
    })
  );
  assert.equal(valid.ok, true);
  assert.equal(valid.journeyAllocatedMinutes, 13);
  assert.equal(valid.componentAllocatedSum, 13);
  assert.equal(valid.byCommissionId.c1, 5);
  assert.equal(valid.byCommissionId.c4, 8);

  const proseString = designMod.extractCommissionDurationsFromCommissioningText(
    makeStep4CommissioningText({
      journey_allocated_minutes: 90,
      commissions: [{ commission_id: "c1", allocated_minutes: "8 minutes" }]
    })
  );
  assert.equal(proseString.ok, false);
  assert.equal(proseString.kind, "malformed");

  const zeroOrNegative = designMod.extractCommissionDurationsFromCommissioningText(
    makeStep4CommissioningText({
      journey_allocated_minutes: 90,
      commissions: [{ commission_id: "c1", allocated_minutes: 0 }]
    })
  );
  assert.equal(zeroOrNegative.ok, false);
  assert.equal(zeroOrNegative.kind, "malformed");
});

test("Design Page validator permits legacy absent durations and rejects invalid/conflicting values", () => {
  const legacyPage = makeFourProductPageWithDurations({ omitCommissionAllocated: true });
  assert.equal(designMod.validateLearningJourneyDesignPage(legacyPage).ok, true);

  const validPage = makeFourProductPageWithDurations({
    durations: { c1: 5, c2: 12, c3: 20, c4: 30 },
    journeyAllocatedMinutes: 67
  });
  assert.equal(designMod.validateLearningJourneyDesignPage(validPage).ok, true);

  const proseDurationPage = makeFourProductPageWithDurations();
  proseDurationPage.commissions[0].allocated_minutes = "8 minutes";
  const badProse = designMod.validateLearningJourneyDesignPage(proseDurationPage);
  assert.equal(badProse.ok, false);
  assert.ok(badProse.errors.some((e) => /allocated_minutes must be a positive integer/.test(e)));

  const floatDurationPage = makeFourProductPageWithDurations();
  floatDurationPage.commissions[1].allocated_minutes = 7.5;
  assert.equal(designMod.validateLearningJourneyDesignPage(floatDurationPage).ok, false);

  const conflictAliasPage = makeFourProductPageWithDurations();
  conflictAliasPage.commissions[0].allocated_minutes = 8;
  conflictAliasPage.commissions[0].duration_minutes = 15;
  const badAlias = designMod.validateLearningJourneyDesignPage(conflictAliasPage);
  assert.equal(badAlias.ok, false);
  assert.ok(badAlias.errors.some((e) => /conflicting structured duration fields/.test(e)));
});

test("Step 4 -> Step 5 authority reconciliation rejects conflicts and inherits verbatim when omitted", () => {
  const { api } = loadHarness();
  const ljWf = makeParentLjWorkflow("wf-lj-reconcile");
  api.setWorkflowsForTest([ljWf]);
  api.setSelectedWorkflowIdForTest("wf-lj-reconcile");

  const step4Text = makeStep4CommissioningText({
    journey_allocated_minutes: 70,
    commissions: [
      { commission_id: "c1", allocated_minutes: 8 },
      { commission_id: "c2", allocated_minutes: 12 },
      { commission_id: "c3", allocated_minutes: 20 },
      { commission_id: "c4", allocated_minutes: 30 }
    ]
  });
  const step4Apply = api.applyLearningJourneyCommissionDurationsFromCommissionCapture(
    ljWf,
    step4Text,
    { softMissing: true }
  );
  assert.equal(step4Apply.ok, true);
  assert.equal(step4Apply.durations.byCommissionId.c1, 8);

  // Conflict: Step 5 attempts to unilaterally change c1 from 8 to 25 -> rejected!
  const conflictingDp = makeFourProductPageWithDurations({
    durations: { c1: 25, c2: 12, c3: 20, c4: 30 },
    journeyAllocatedMinutes: 70
  });
  const rejectedParse = api.parseLearningJourneyDesignPageCaptureForStorage(
    JSON.stringify(conflictingDp),
    ljWf
  );
  assert.equal(rejectedParse.ok, false);
  assert.ok(
    rejectedParse.errors.some((e) => /commission_duration_conflict/.test(e)),
    JSON.stringify(rejectedParse)
  );
  const earlyStageGate = api.validateDesignPageOrPageCapture(conflictingDp, ljWf, ljWf.steps[1]);
  assert.equal(earlyStageGate.ok, false);

  // Omitted in Step 5 -> inherits Step 4 canonical integers verbatim (without prose parsing)
  const omittedDp = makeFourProductPageWithDurations({
    omitCommissionAllocated: true,
    includeProseTime: true
  });
  const acceptedParse = api.parseLearningJourneyDesignPageCaptureForStorage(
    JSON.stringify(omittedDp),
    ljWf
  );
  assert.equal(acceptedParse.ok, true, JSON.stringify(acceptedParse));
  assert.equal(acceptedParse.parsed.commissions[0].allocated_minutes, 8);
  assert.equal(acceptedParse.parsed.commissions[1].allocated_minutes, 12);
  assert.equal(acceptedParse.parsed.commissions[2].allocated_minutes, 20);
  assert.equal(acceptedParse.parsed.commissions[3].allocated_minutes, 30);
  assert.equal(acceptedParse.parsed.learning_journey.allocated_minutes, 70);

  // Persisted JSON also carries the reconciled durations
  const reparsed = JSON.parse(acceptedParse.json);
  assert.equal(reparsed.commissions[0].allocated_minutes, 8);
});

test("Lossless duration transport across all 4 commissioned product families (batch, single, prompts, persistence, delete/recreate)", async () => {
  const expectedDurations = { c1: 8, c2: 12, c3: 20, c4: 30 };
  const page = makeFourProductPageWithDurations({
    durations: expectedDurations,
    journeyAllocatedMinutes: 70,
    includeProseTime: true
  });

  // 1. Batch creation & end-to-end effective prompt/parameter projection across all 4 products
  const { api } = loadHarness();
  const ljWf = makeParentLjWorkflow("wf-lj-all4");
  api.setWorkflowsForTest([ljWf]);
  api.setSelectedWorkflowIdForTest("wf-lj-all4");
  api.setLearningJourneyCommissioningPreviewContextForTest({
    sourceWorkflowId: "wf-lj-all4",
    page
  });

  const batch = await api.handleLearningJourneyBatchCreateComponentsActionForTest({
    sourceWorkflowId: "wf-lj-all4",
    page
  });
  assert.equal(batch.ok, true, JSON.stringify(batch));
  assert.equal(batch.created.length, 4);

  const byCommission = {};
  batch.created.forEach((row) => {
    byCommission[row.commissionId] = row.workflow;
  });

  const expectedProducts = {
    c1: "practice",
    c2: "expository",
    c3: "assessment_pack",
    c4: "situated_task"
  };

  Object.keys(expectedDurations).forEach((cid) => {
    const mins = expectedDurations[cid];
    const wf = byCommission[cid];
    assert.ok(wf, "missing created workflow for " + cid);
    assert.equal(wf.product, expectedProducts[cid]);
    assert.equal(wf.workflowBriefResolution.resolvedFactors.commissioned_duration_minutes, mins);
    assert.equal(wf.workflowBriefResolution.resolvedFactors.duration_minutes, mins);
    assert.equal(
      wf.workflowBriefResolution.resolvedFactors.commissioned_duration_provenance.authority,
      "learning_journey_commission"
    );
    assert.equal(wf.workflowBriefResolution.initialBrief.allocatedMinutes, mins);
    assert.equal(api.hasAuthoritativeCommissionedDuration(wf), true);
    assert.equal(api.resolveCommissionedWorkflowDurationMinutes(wf), mins);
    assert.equal(api.resolveEffectiveWorkflowDurationMinutes(wf), mins);

    const ctx = api.readWorkflowCommissionContext(wf);
    assert.equal(ctx.commissionedDurationMinutes, mins);
    assert.equal(ctx.journeyAllocatedMinutes, 70);

    // Every non-derived-shell step receives Authoritative Duration: <mins> minutes
    const promptSteps = wf.steps.filter(
      (s) => String(s.canonical_step_id || "") !== "step_design_episode_plan"
    );
    assert.ok(promptSteps.length >= 4, cid + " prompt steps");
    promptSteps.forEach((step) => {
      const block = api.buildEffectiveWorkflowContextBlock(wf, step);
      assert.match(block, /Authoritative workflow parameters for this run:/);
      assert.match(block, new RegExp("Duration: " + mins + " minutes"));
    });

    // Persistence & normalization preserve duration losslessly
    const normalized = api.normalizeWorkflowForV1(JSON.parse(JSON.stringify(wf)), []);
    assert.equal(api.resolveCommissionedWorkflowDurationMinutes(normalized), mins);
    assert.equal(api.resolveEffectiveWorkflowDurationMinutes(normalized), mins);

    // Component Adjustments cannot unilaterally override LJ-commissioned duration
    assert.equal(api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 45), false);
    wf.adjustments = { version: 1, parameters: { duration_minutes: 45 } };
    assert.equal(api.resolveEffectiveWorkflowDurationMinutes(wf), mins);
  });

  // Verify Practice sub-10-min (8 min) reaches LS partial validation, prompt instructions, and Edit->Save persistence
  const practiceWf = byCommission.c1;
  api.setWorkflowsForTest([ljWf, practiceWf, byCommission.c2, byCommission.c3, byCommission.c4]);
  api.setSelectedWorkflowIdForTest(practiceWf.id);
  const lsOpts = api.buildLearningSequencePartialValidationOptions(practiceWf);
  assert.equal(lsOpts.effectiveDurationMinutes, 8);

  const lsRejectsWrongDuration = api.validateLearningSequencePartialPageCapture(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      learning_sequence: {
        total_duration_minutes: 30,
        timeline: [{ activity_id: "A1", duration_minutes: 30, order: 1 }]
      }
    },
    lsOpts
  );
  assert.equal(lsRejectsWrongDuration.ok, false);
  assert.ok(
    lsRejectsWrongDuration.errors.some((e) =>
      /total duration \(30 min\) must match authoritative effective workflow duration \(8 min\)/i.test(e)
    ),
    JSON.stringify(lsRejectsWrongDuration.errors)
  );
  const lsAcceptsAuthoritative = api.validateLearningSequencePartialPageCapture(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      assembly_state: { current_stage: "learning_sequence", enriched_by: ["learning_sequence"] },
      learning_sequence: {
        total_duration_minutes: 8,
        timeline: [{ activity_id: "A1", duration_minutes: 8, order: 1 }]
      }
    },
    lsOpts
  );
  assert.equal(lsAcceptsAuthoritative.ok, true, JSON.stringify(lsAcceptsAuthoritative.errors));

  // Verify compiled step instructions receive authoritative duration across all 4 commissioned products
  [
    { wf: practiceWf, minutes: 8, stepIdx: 1 },
    { wf: byCommission.c2, minutes: 12, stepIdx: 0 },
    { wf: byCommission.c3, minutes: 20, stepIdx: 0 },
    { wf: byCommission.c4, minutes: 30, stepIdx: 0 }
  ].forEach(({ wf, minutes, stepIdx }) => {
    api.setSelectedWorkflowIdForTest(wf.id);
    const step = wf.steps[stepIdx];
    const prompt = api.buildWorkflowStepInstructions(step, stepIdx);
    assert.match(prompt, new RegExp("Duration: " + minutes + " minutes"));
  });
  api.setSelectedWorkflowIdForTest(practiceWf.id);

  // Verify persistence round-trip: saveWorkflows -> clear memory -> loadWorkflows -> normalizeWorkflowForV1 -> carryForward
  await api.saveWorkflowsForTest();
  api.setWorkflowsForTest([]);
  await api.loadWorkflowsForTest();
  const reloadedWorkflows = api.getWorkflowsForTest();
  const reloadedPractice = reloadedWorkflows.find((w) => w.id === practiceWf.id);
  assert.ok(reloadedPractice);
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(reloadedPractice), 8);
  const normalizedPractice = api.normalizeWorkflowForV1(
    JSON.parse(JSON.stringify(reloadedPractice))
  );
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(normalizedPractice), 8);
  const simulatedEdited = {
    id: reloadedPractice.id,
    name: reloadedPractice.name + " edited",
    workflowBriefResolution: JSON.parse(JSON.stringify(reloadedPractice.workflowBriefResolution)),
    steps: JSON.parse(JSON.stringify(reloadedPractice.steps))
  };
  api.carryForwardWorkflowProvenanceFieldsFromExistingForTest(reloadedPractice, simulatedEdited);
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(simulatedEdited), 8);
  assert.equal(
    simulatedEdited.workflowBriefResolution.resolvedFactors.commissioned_duration_minutes,
    8
  );

  // Legacy Interactive commission WITH structured allocated_minutes still feeds DLA workbook overlay
  const interactiveIntake = intakeMod.intakeCommission({
    productId: "interactive",
    specificationText: "Educational job.",
    allocatedMinutes: 8,
    sourceCommissionId: "c_legacy",
    sourceJourneyWorkflowId: "wf-lj-all4"
  });
  assert.equal(interactiveIntake.ok, true);
  const interactive8Wf = {
    id: "wf-int-8",
    name: "Interactive 8 min",
    product: "interactive",
    variant: "self_study",
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, interactiveIntake.family.deliverySeed),
      initialBrief: Object.assign({}, interactiveIntake.createSeed)
    },
    steps: interactiveIntake.family.steps
  };
  const dlaCtx = api.buildDlaCanonicalSlotContext(
    { desiredOutputs: "interactive learner workbook page" },
    interactive8Wf
  );
  assert.match(dlaCtx.overlayText, /8-minute/i);

  // 2. Delete and recreate single component (Assessment Pack c3 = 20 min) preserves allocated_minutes
  const apWf = byCommission.c3;
  api.setSelectedWorkflowIdForTest(apWf.id);
  await api.handleDeleteWorkflowForTest();
  const matchesAfterDelete = statusMod.findConstituentWorkflows(
    api.getWorkflowsForTest(),
    "wf-lj-all4",
    "c3"
  );
  assert.equal(matchesAfterDelete.length, 0);

  const recreated = await api.initialiseFirstClassProductFromLearningJourneyCommissionForTest(
    { commissionId: "c3", productId: "assessment_pack", sourceWorkflowId: "wf-lj-all4" },
    { suppressUiHandoff: true }
  );
  assert.equal(recreated.ok, true, JSON.stringify(recreated));
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(recreated.workflow), 20);
  assert.equal(
    recreated.workflow.workflowBriefResolution.resolvedFactors.commissioned_duration_minutes,
    20
  );
});

test("Sub-10-minute (5 min) Practice and LJ-commissioned Expository UI rendering remain clean", async () => {
  const { loaded, api } = loadHarness();
  const page5 = makeFourProductPageWithDurations({
    durations: { c1: 5, c2: 12, c3: 15, c4: 30 },
    journeyAllocatedMinutes: 62
  });
  const ljWf = makeParentLjWorkflow("wf-lj-5min");
  api.setWorkflowsForTest([ljWf]);
  api.setSelectedWorkflowIdForTest("wf-lj-5min");
  api.setLearningJourneyCommissioningPreviewContextForTest({
    sourceWorkflowId: "wf-lj-5min",
    page: page5
  });

  const practice5 = await api.initialiseFirstClassProductFromLearningJourneyCommissionForTest(
    { commissionId: "c1", productId: "practice", sourceWorkflowId: "wf-lj-5min" },
    { suppressUiHandoff: true }
  );
  assert.equal(practice5.ok, true, JSON.stringify(practice5));
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(practice5.workflow), 5);
  const block = api.buildEffectiveWorkflowContextBlock(practice5.workflow, practice5.workflow.steps[1]);
  assert.match(block, /Duration: 5 minutes/);

  // Expository commissioned at 12 min also exposes Duration: 12 minutes while keeping Scope/extent
  const expo12 = await api.initialiseFirstClassProductFromLearningJourneyCommissionForTest(
    { commissionId: "c2", productId: "expository", sourceWorkflowId: "wf-lj-5min" },
    { suppressUiHandoff: true }
  );
  assert.equal(expo12.ok, true, JSON.stringify(expo12));
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(expo12.workflow), 12);
  const expoBlock = api.buildEffectiveWorkflowContextBlock(expo12.workflow, expo12.workflow.steps[0]);
  assert.match(expoBlock, /Duration: 12 minutes/);

  // Adjustments UI disables duration override cleanly and displays parent LJ ownership
  const makeTrackedNode = (tag) => {
    const attrs = {};
    const node = {
      tagName: String(tag || "DIV").toUpperCase(),
      className: "",
      textContent: "",
      placeholder: "",
      value: "",
      disabled: false,
      style: {},
      dataset: {},
      children: [],
      setAttribute: (k, v) => {
        attrs[String(k)] = String(v);
      },
      getAttribute: (k) => (Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null),
      removeAttribute: (k) => {
        delete attrs[String(k)];
      },
      appendChild: (child) => {
        if (child) node.children.push(child);
        return child;
      },
      addEventListener: () => {}
    };
    return node;
  };
  const origCreateElement = loaded.sandbox.document.createElement;
  const panelHost = loaded.sandbox.document.getElementById("unifiedWorkflowSettingsOptions");
  panelHost.children = [];
  panelHost.appendChild = (child) => {
    if (child) panelHost.children.push(child);
    return child;
  };
  loaded.sandbox.document.createElement = (tag) => makeTrackedNode(tag);
  try {
    api.renderAdjustmentsWorkflowParametersSection(practice5.workflow);
  } finally {
    loaded.sandbox.document.createElement = origCreateElement;
  }
  function collect(node, acc) {
    if (!node) return acc;
    acc.push(node);
    const kids = node.children || (node.childNodes ? Array.from(node.childNodes) : []);
    kids.forEach((child) => collect(child, acc));
    return acc;
  }
  const nodes = collect(panelHost, []);
  const durInput = nodes.find(
    (n) =>
      n.getAttribute &&
      n.getAttribute("data-field") === "adjustmentParameter" &&
      n.getAttribute("data-adjustment-id") === "duration_minutes"
  );
  assert.ok(durInput, "expected duration_minutes adjustment input");
  assert.equal(durInput.disabled, true);
  const statusText = nodes
    .map((n) => String(n.textContent || "") + " " + String(n.placeholder || ""))
    .join("\n");
  assert.match(statusText, /Owned by parent Learning Journey: 5 minutes/);
  assert.doesNotMatch(statusText, /resolvedFactors|commissioned_duration_minutes|provenance/);
});

test("Legacy LJ commissions without structured duration stay explicitly unavailable (no prose fallback)", async () => {
  const { api } = loadHarness();
  const legacyPage = makeFourProductPageWithDurations({
    omitCommissionAllocated: true,
    includeProseTime: true // specification_text contains "Approximate learner time: 99 minutes."
  });
  // Also ensure legacy interactive commission without allocated_minutes stays null
  legacyPage.commissions[0].product_id = "interactive";

  const ljWf = makeParentLjWorkflow("wf-lj-legacy");
  api.setWorkflowsForTest([ljWf]);
  api.setSelectedWorkflowIdForTest("wf-lj-legacy");
  api.setLearningJourneyCommissioningPreviewContextForTest({
    sourceWorkflowId: "wf-lj-legacy",
    page: legacyPage
  });

  const batch = await api.handleLearningJourneyBatchCreateComponentsActionForTest({
    sourceWorkflowId: "wf-lj-legacy",
    page: legacyPage
  });
  assert.equal(batch.ok, true);
  assert.equal(batch.created.length, 4);

  batch.created.forEach((row) => {
    const wf = row.workflow;
    const factors = wf.workflowBriefResolution.resolvedFactors;
    assert.equal(factors.commissioned_duration_minutes, undefined);
    assert.equal(factors.duration_minutes, undefined);
    assert.equal(api.hasAuthoritativeCommissionedDuration(wf), false);
    assert.equal(api.resolveCommissionedWorkflowDurationMinutes(wf), null);
    assert.equal(api.resolveEffectiveWorkflowDurationMinutes(wf), null);

    const step = wf.steps[wf.steps.length - 1];
    const block = api.buildEffectiveWorkflowContextBlock(wf, step);
    assert.doesNotMatch(block, /^Duration:/m);
  });
});

test("Envelope / intake fails closed on duration conflicts or non-integer prose strings", () => {
  const conflictIntake = intakeMod.intakeCommission({
    productId: "practice",
    specificationText: "Educational job.",
    allocatedMinutes: 8,
    durationMinutes: 15
  });
  assert.equal(conflictIntake.ok, false);
  assert.equal(conflictIntake.code, "commission_duration_conflict");

  const proseIntake = intakeMod.intakeCommission({
    productId: "expository",
    specificationText: "Educational job.",
    allocated_minutes: "15 minutes"
  });
  assert.equal(proseIntake.ok, false);
  assert.equal(proseIntake.code, "invalid_allocated_minutes");

  const optConflict = intakeMod.intakeCommission(
    {
      productId: "situated_task",
      specificationText: "Educational job.",
      allocatedMinutes: 30
    },
    { authoritativeAllocatedMinutes: 15 }
  );
  assert.equal(optConflict.ok, false);
  assert.equal(optConflict.code, "commission_duration_conflict");
});

test("Invariant 1: Step 4 journey_allocated_minutes matches parent LJ duration and component sum reconciles", () => {
  const { api } = loadHarness();
  const built = familyMod.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "learning_journey",
    focus: "Correlation and Causation",
    learningTime: "70 minutes"
  });
  assert.equal(built.ok, true);
  assert.equal(built.deliverySeed.duration_contract_version, "s104_m1");

  const ljWf = {
    id: "wf-lj-inv1",
    name: "Correlation and Causation",
    product: built.identity.product,
    variant: built.identity.variant,
    steps: built.steps.map((s, idx) => Object.assign({}, s, { id: "lj-s-" + (idx + 1) })),
    workflowBriefResolution: {
      initialBrief: { topic: "Correlation and Causation", learningTime: "70 minutes", durationContractVersion: "s104_m1" },
      resolvedFactors: Object.assign({}, built.deliverySeed)
    }
  };
  api.setWorkflowsForTest([ljWf]);
  assert.equal(api.resolveLearningJourneyAuthoritativeParentDurationMinutes(ljWf), 70);

  // Step 4 must NOT redefine the parent 70-minute allocation (e.g. changing it to 90 fails closed)
  const redefineParent = api.applyLearningJourneyCommissionDurationsFromCommissionCapture(
    ljWf,
    makeStep4CommissioningText({
      journey_allocated_minutes: 90,
      commissions: [
        { commission_id: "c1", allocated_minutes: 20 },
        { commission_id: "c2", allocated_minutes: 20 },
        { commission_id: "c3", allocated_minutes: 20 },
        { commission_id: "c4", allocated_minutes: 30 }
      ]
    })
  );
  assert.equal(redefineParent.ok, false);
  assert.ok(redefineParent.errors.some((e) => /journey_duration_conflict/.test(e)));

  // Step 4 component sum that does not reconcile with journey_allocated_minutes (8+12+20+25 = 65 != 70) fails closed
  const mismatchSum = api.applyLearningJourneyCommissionDurationsFromCommissionCapture(
    ljWf,
    makeStep4CommissioningText({
      journey_allocated_minutes: 70,
      commissions: [
        { commission_id: "c1", allocated_minutes: 8 },
        { commission_id: "c2", allocated_minutes: 12 },
        { commission_id: "c3", allocated_minutes: 20 },
        { commission_id: "c4", allocated_minutes: 25 }
      ]
    })
  );
  assert.equal(mismatchSum.ok, false);
  assert.ok(mismatchSum.errors.some((e) => /commission_durations_total_mismatch/.test(e)));

  // Step 4 omitting journey_allocated_minutes fails closed
  const omittedJourneyTotal = designMod.extractCommissionDurationsFromCommissioningText(
    makeStep4CommissioningText({
      commissions: [
        { commission_id: "c1", allocated_minutes: 30 },
        { commission_id: "c2", allocated_minutes: 40 }
      ]
    }),
    { parentAuthoritativeMinutes: 70 }
  );
  assert.equal(omittedJourneyTotal.ok, false);
  assert.ok(omittedJourneyTotal.errors.some((e) => /journey_allocated_minutes required/.test(e)));

  // Reconciled Step 4 (8+12+20+30 = 70 == parent 70) succeeds, and Step 5 cannot disagree with parent 70
  const reconciledStep4 = api.applyLearningJourneyCommissionDurationsFromCommissionCapture(
    ljWf,
    makeStep4CommissioningText({
      journey_allocated_minutes: 70,
      commissions: [
        { commission_id: "c1", allocated_minutes: 8 },
        { commission_id: "c2", allocated_minutes: 12 },
        { commission_id: "c3", allocated_minutes: 20 },
        { commission_id: "c4", allocated_minutes: 30 }
      ]
    })
  );
  assert.equal(reconciledStep4.ok, true);

  const dpRedefinesParent = makeFourProductPageWithDurations({
    durations: { c1: 8, c2: 12, c3: 20, c4: 30 },
    journeyAllocatedMinutes: 90
  });
  const dpRejected = api.parseLearningJourneyDesignPageCaptureForStorage(
    JSON.stringify(dpRedefinesParent),
    ljWf
  );
  assert.equal(dpRejected.ok, false);
  assert.ok(dpRejected.errors.some((e) => /journey_duration_conflict/.test(e)));
});

test("Invariant 2: Newly authored LJ/commissions cannot silently bypass duration contract while genuinely legacy remain valid", async () => {
  const { api } = loadHarness();
  const built = familyMod.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "learning_journey",
    focus: "Correlation and Causation",
    learningTime: "70 minutes"
  });
  const newLjWf = {
    id: "wf-lj-new-strict",
    name: "New LJ",
    product: "learning_journey",
    steps: built.steps.map((s, idx) => Object.assign({}, s, { id: "new-s-" + (idx + 1) })),
    workflowBriefResolution: {
      initialBrief: { topic: "Correlation and Causation", learningTime: "70 minutes", durationContractVersion: "s104_m1" },
      resolvedFactors: Object.assign({}, built.deliverySeed)
    }
  };
  api.setWorkflowsForTest([newLjWf]);
  api.setSelectedWorkflowIdForTest("wf-lj-new-strict");
  assert.equal(api.isLearningJourneyDurationContractRequired(newLjWf), true);

  // 1. Newly authored Step 4 omitting COMMISSION_DURATIONS fails closed even under Run sync
  const step4Step = newLjWf.steps.find((s) => s.canonical_step_id === "step_journey_commissioning");
  const missingStep4Dur = api.applyLearningJourneyCommissionDurationsFromCommissionCapture(
    newLjWf,
    "LEARNING EXPERIENCE COMMISSIONS\nApproximate learner time: 70 minutes\nSTEP 4 OUTPUT: learning_commissions",
    { softMissing: !api.isLearningJourneyDurationContractRequired(newLjWf) }
  );
  assert.equal(missingStep4Dur.ok, false);
  assert.equal(missingStep4Dur.code, "missing");
  assert.ok(step4Step);

  // 2. Newly authored Step 5 Design Page omitting allocated_minutes (with no Step 4 backfill) fails closed
  const pageOmittingDurations = makeFourProductPageWithDurations({
    omitCommissionAllocated: true,
    includeProseTime: true
  });
  const dpGateMissing = api.parseLearningJourneyDesignPageCaptureForStorage(
    JSON.stringify(pageOmittingDurations),
    newLjWf
  );
  assert.equal(dpGateMissing.ok, false);
  assert.ok(dpGateMissing.errors.some((e) => /commission_duration_missing_required/.test(e)));

  // 3. Partial duration Design Page (e.g., c1 has 8, c2 Practice omits it) fails closed even on a legacy workflow
  const partialPage = makeFourProductPageWithDurations({ omitCommissionAllocated: true });
  partialPage.commissions[0].allocated_minutes = 8;
  assert.equal(designMod.validateLearningJourneyDesignPage(partialPage).ok, false);

  // 4. Component creation on newly authored LJ omitting allocated_minutes fails closed (no silent null bypass)
  api.setLearningJourneyCommissioningPreviewContextForTest({
    sourceWorkflowId: "wf-lj-new-strict",
    page: pageOmittingDurations
  });
  const blockedCreate = await api.initialiseFirstClassProductFromLearningJourneyCommissionForTest(
    { commissionId: "c1", productId: "practice", sourceWorkflowId: "wf-lj-new-strict" },
    { suppressUiHandoff: true }
  );
  assert.equal(blockedCreate.ok, false);
  assert.equal(blockedCreate.code, "commission_duration_missing_required");
});

test("Standalone Expository and Interactive workflows remain unchanged", () => {
  const standaloneExpo = familyMod.buildFirstClassWorkflowFamily({
    ldCreateOutputType: familyMod.LD_EXPOSITORY,
    focus: "Bayes Theorem",
    startingArtefact: "generate_from_topic",
    scopeScale: "about a 10-minute read"
  });
  assert.equal(standaloneExpo.ok, true);
  assert.equal(standaloneExpo.deliverySeed.commissioned_duration_minutes, undefined);
  assert.equal(standaloneExpo.deliverySeed.duration_minutes, undefined);

  const standaloneInteractive = familyMod.buildFirstClassWorkflowFamily({
    ldCreateOutputType: familyMod.LD_SELF_STUDY,
    focus: "Bayes Theorem",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(standaloneInteractive.ok, true);
  assert.equal(standaloneInteractive.deliverySeed.commissioned_duration_minutes, undefined);

  // S80-S6 static invariant: resolveEffectiveWorkflowDurationMinutes( call count remains 3
  const appSrc = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  const reads = appSrc.match(/resolveEffectiveWorkflowDurationMinutes\(/g) || [];
  assert.equal(reads.length, 3);
});

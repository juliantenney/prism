/**
 * Sprint 105 Milestone 3 — Progressive Learning Journey run orchestration,
 * per-stage validation & acceptance, persistence, deterministic assembly routing,
 * upstream invalidation, stale-write protection, reload hydration, origin-aware
 * clear-run, clean workflow duplication (S105-AD-004), and legacy LJ separation.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const ljAssemble = require("../lib/learning-journey-assemble.js");
const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPrompts = require("../lib/learning-journey-sibling-prompts.js");
const ljShared = require("../lib/learning-journey-shared-source.js");
const { loadPrismAppJsTestApi, createPrismVmElementStub } = require("./prism-vm-lib-bootstrap.js");

function loadHarness() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/learning-journey-assemble.js",
      "lib/learning-journey-shared-source.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-sibling-prompts.js"
    ]
  });
  const host = loaded.window || loaded.sandbox;
  if (host) {
    host.PRISM_LEARNING_JOURNEY_ASSEMBLE = ljAssemble;
    host.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = ljShared;
    host.PRISM_LEARNING_JOURNEY_DESIGN_PAGE = ljDesign;
    host.PrismLearningJourneySiblingPrompts = ljPrompts;
  }
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_ASSEMBLE = ljAssemble;
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = ljShared;
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_DESIGN_PAGE = ljDesign;
    loaded.sandbox.globalThis.PrismLearningJourneySiblingPrompts = ljPrompts;
  }
  return loaded;
}

function makeStepLi(step, initialValue) {
  const ta = createPrismVmElementStub();
  ta.value = initialValue || "";
  const statusEl = createPrismVmElementStub();
  const outName = createPrismVmElementStub();
  outName.value = step.outputName || "";
  const li = createPrismVmElementStub();
  const attrs = { "data-step-id": step.id };
  const queryMap = {
    '[data-field="runStepOutput"]': ta,
    '[data-role="run-step-output-status"]': statusEl,
    '[data-field="outputName"]': outName
  };
  li.getAttribute = (k) => (Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null);
  li.setAttribute = (k, v) => {
    attrs[k] = String(v);
  };
  li.querySelector = (sel) => (Object.prototype.hasOwnProperty.call(queryMap, sel) ? queryMap[sel] : null);
  return { li, ta, statusEl };
}

function makeProgressiveWorkflow(id, opts) {
  const o = opts || {};
  const briefSource = o.briefSource || "";
  const wf = {
    id: id,
    name: "Economics – Marginal Transit Decisions",
    product: "learning_journey",
    progressive_capture_version: ljAssemble.PROGRESSIVE_CAPTURE_VERSION,
    outputSpec: {
      partialPageOutputs: true,
      progressiveCaptureVersion: ljAssemble.PROGRESSIVE_CAPTURE_VERSION
    },
    steps: [
      {
        id: "s1",
        title: "Requirements",
        outputName: "learning_requirements",
        canonical_step_id: "step_journey_requirements"
      },
      {
        id: "s2",
        title: "Progression",
        outputName: "learning_progression",
        canonical_step_id: "step_journey_progression",
        inputBindings: [{ kind: "internal", sourceStepId: "s1", artifactName: "learning_requirements" }]
      },
      {
        id: "s3",
        title: "Elements",
        outputName: "learning_elements",
        canonical_step_id: "step_journey_elements",
        inputBindings: [{ kind: "internal", sourceStepId: "s2", artifactName: "learning_progression" }]
      },
      {
        id: "s4",
        title: "Commissioning",
        outputName: "learning_commissions",
        canonical_step_id: "step_journey_commissioning",
        inputBindings: [{ kind: "internal", sourceStepId: "s3", artifactName: "learning_elements" }]
      },
      {
        id: "s5",
        title: "Design Page",
        outputName: "learning_journey_page",
        canonical_step_id: "step_design_page",
        inputBindings: [
          { kind: "internal", sourceStepId: "s1", artifactName: "learning_requirements" },
          { kind: "internal", sourceStepId: "s2", artifactName: "learning_progression" },
          { kind: "internal", sourceStepId: "s3", artifactName: "learning_elements" },
          { kind: "internal", sourceStepId: "s4", artifactName: "learning_commissions" }
        ]
      }
    ],
    workflowBriefResolution: {
      initialBrief: {
        topic: "Marginal analysis in municipal transit",
        allocated_minutes: 90,
        sourceContext: briefSource
      },
      resolvedFactors: {
        topic: "Marginal analysis in municipal transit",
        journey_allocated_minutes: 90,
        allocated_minutes: 90,
        progressive_capture_version: ljAssemble.PROGRESSIVE_CAPTURE_VERSION,
        duration_contract_version: "s104_m1",
        source_context: briefSource,
        source_context_origin: briefSource ? "brief_provided" : ""
      }
    }
  };
  if (o.legacy) {
    delete wf.progressive_capture_version;
    delete wf.outputSpec;
    delete wf.workflowBriefResolution.resolvedFactors.progressive_capture_version;
    delete wf.workflowBriefResolution.resolvedFactors.duration_contract_version;
    delete wf.workflowBriefResolution.resolvedFactors.journey_allocated_minutes;
    delete wf.workflowBriefResolution.resolvedFactors.allocated_minutes;
    delete wf.workflowBriefResolution.initialBrief.allocated_minutes;
  }
  return wf;
}

function makeValidStages(opts) {
  const o = opts || {};
  const sharedStatus = o.briefProvided
    ? { status: "provided" }
    : o.generatedSource
      ? { status: "generated", content: o.generatedSource }
      : { status: "none", content: "" };

  return {
    s1: {
      artifact_type: "learning_journey_stage",
      schema_version: "1.0.0",
      stage: "learning_requirements",
      journey_allocated_minutes: 90,
      learning_outcomes: {
        learning_outcomes: [
          {
            statement: "Interpret marginal cost and marginal benefit in a transit pricing decision.",
            related_concepts: ["marginal cost", "opportunity cost"],
            cognitive_level: "apply"
          },
          {
            statement: "Evaluate trade-offs across competing municipal transit policy options.",
            related_concepts: ["trade-offs", "externalities"],
            cognitive_level: "evaluate"
          }
        ],
        learner_level: "First-year undergraduate"
      },
      learner_profile: "Introductory economics students with basic algebra.",
      purpose: "Build practical marginal-decision fluency in real municipal policy contexts.",
      body_of_knowledge: ["Marginal cost", "Opportunity cost", "Externalities"],
      constraints_and_tradeoffs: "Strictly 90 minutes total; favour depth over formulaic drill.",
      journal_orientation: "Developmental visibility across initial and revised policy judgements."
    },
    s2: {
      artifact_type: "learning_journey_stage",
      schema_version: "1.0.0",
      stage: "learning_progression",
      journey_structure: {
        mode: "single",
        rationale: "Single 90-minute arc moving from concept grounding to defended policy judgement."
      },
      developmental_phases: [
        {
          phase_id: "P1",
          title: "Concept Grounding",
          purpose: "Establish marginal vs average reasoning.",
          indicative_minutes: 30,
          scaffolding_and_evidence: "Worked examples with immediate check prompts.",
          dependencies: []
        },
        {
          phase_id: "P2",
          title: "Policy Application",
          purpose: "Apply marginal reasoning and externalities to an authentic transit choice.",
          indicative_minutes: 60,
          scaffolding_and_evidence: "Guided practice followed by situated policy recommendation.",
          dependencies: ["P1"]
        }
      ],
      developmental_arc: "Progresses from conceptual distinction to defended policy judgement.",
      journal_note: "Track learner policy rationale from initial estimate to final recommendation."
    },
    s3: {
      artifact_type: "learning_journey_stage",
      schema_version: "1.0.0",
      stage: "learning_elements",
      elements: [
        {
          element_id: "E1",
          phase_id: "P1",
          title: "Marginal vs Average Cost",
          educational_job: "Explain marginal cost using worked fare increments.",
          knowledge_focus: "Marginal cost and sunk cost.",
          indicative_minutes: 30,
          scaffolding_and_feedback: "Worked contrast with conceptual checks.",
          dependencies: [],
          journal_producer_candidate: false
        },
        {
          element_id: "E2",
          phase_id: "P2",
          title: "Initial Fare Decision",
          educational_job: "Practise applying marginal reasoning to draft a fare stance (elicitation E1).",
          knowledge_focus: "Marginal benefit and ridership elasticity.",
          indicative_minutes: 30,
          scaffolding_and_feedback: "Stepwise feedback on marginal comparison.",
          dependencies: ["E1"],
          journal_producer_candidate: true
        },
        {
          element_id: "E3",
          phase_id: "P2",
          title: "Transit Policy Brief",
          educational_job: "Revisit initial fare stance with new externality evidence (elicitation E2).",
          knowledge_focus: "Externalities and policy trade-offs.",
          indicative_minutes: 30,
          scaffolding_and_feedback: "Rubric criteria on trade-off justification.",
          dependencies: ["E2"],
          journal_producer_candidate: true
        }
      ],
      boundary_notes: "Split cleanly between grounding, guided practice, and synthesis."
    },
    s4: {
      artifact_type: "learning_journey_stage",
      schema_version: "1.0.0",
      stage: "learning_commissions",
      shared_authoritative_material: sharedStatus,
      commissions: [
        {
          commission_id: "comm_1",
          section_id: "exp_1",
          order: 1,
          title: "Understanding Marginal Cost",
          product_id: "expository",
          status: "supported",
          allocated_minutes: 30,
          specification_text:
            "Explain marginal cost vs average cost on unfamiliar bus route data.\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{\"learning_outcomes\":[{\"statement\":\"Distinguish marginal cost from average cost in transit operations.\",\"related_concepts\":[\"marginal cost\"],\"cognitive_level\":\"understand\"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>",
          journey_context_text:
            "Established scenario facts: MetroBus operates peak and off-peak corridors with fixed fleet leases.",
          dependencies: "",
          element_ids: ["E1"],
          relevant_journey_outcome_numbers: [1]
        },
        {
          commission_id: "comm_2",
          section_id: "exp_2",
          order: 2,
          title: "Drafting a Fare Stance",
          product_id: "practice",
          status: "supported",
          allocated_minutes: 30,
          specification_text:
            "Guide learners through marginal revenue and ridership comparison to draft an initial fare stance (elicitation E1) on familiar MetroBus figures.\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{\"learning_outcomes\":[{\"statement\":\"Apply marginal analysis to propose a defensible bus fare stance.\",\"related_concepts\":[\"marginal analysis\"],\"cognitive_level\":\"apply\"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>",
          journey_context_text:
            "Established scenario facts: MetroBus operates peak and off-peak corridors with fixed fleet leases. Earlier in comm_1 learners distinguished marginal from average cost on MetroBus data. Learners bring forward their conceptual distinction to draft their own fare stance (E1).",
          dependencies: "comm_1",
          element_ids: ["E2"],
          relevant_journey_outcome_numbers: [1]
        },
        {
          commission_id: "comm_3",
          section_id: "exp_3",
          order: 3,
          title: "Defending a Transit Policy",
          product_id: "situated_task",
          status: "supported",
          allocated_minutes: 30,
          specification_text:
            "Learners evaluate congestion externalities and write a concise policy brief (elicitation E2) revisiting their earlier fare stance.\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{\"learning_outcomes\":[{\"statement\":\"Evaluate competing transit policy trade-offs incorporating externalities.\",\"related_concepts\":[\"externalities\",\"trade-offs\"],\"cognitive_level\":\"evaluate\"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>",
          journey_context_text:
            "Established scenario facts: MetroBus operates peak and off-peak corridors with fixed fleet leases. Earlier in comm_2 learners drafted an initial fare stance (E1). Learners bring forward their own declared read-only learner artefact comm_2.E1 available in the Learning Journal and unified runtime to reconsider their decision with congestion externalities.",
          dependencies: "comm_2",
          element_ids: ["E3"],
          relevant_journey_outcome_numbers: [1, 2]
        }
      ],
      continuity: "Learners progress from conceptual cost analysis to an initial fare stance and a revised policy defence.",
      journal: {
        enabled: true,
        decision_basis: "Developmental visibility across initial and revised policy stances.",
        title: "Policy Reasoning Journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Initial Fare Stance",
            artefact_id: "comm_2.E1",
            framing: "Your marginal fare stance from the guided practice."
          },
          {
            entry_id: "j2",
            order: 2,
            title: "Transit Policy Brief",
            artefact_id: "comm_3.E2",
            framing: "Your policy defence after weighing externalities."
          }
        ]
      }
    },
    s5: {
      artifact_type: "page",
      schema_version: "2.0.0",
      product_id: "learning_journey",
      title: "Marginal Thinking in Municipal Transit",
      editorial_opening_image: {
        decision: "skip",
        skip_reason: "Focused analytical economics sequence."
      },
      sections: [
        {
          section_id: "journey_intro",
          title: "Why Marginal Decisions Matter",
          order: 1,
          exposition: "Explore how marginal costs and externalities shape real municipal transit choices."
        },
        {
          section_id: "exp_1",
          title: "Understanding Marginal Cost",
          order: 2,
          exposition: "Start by separating incremental operating costs from fixed fleet costs."
        },
        {
          section_id: "exp_2",
          title: "Drafting a Fare Stance",
          order: 3,
          exposition: "Test fare options and draft your own evidence-backed stance."
        },
        {
          section_id: "exp_3",
          title: "Defending a Transit Policy",
          order: 4,
          exposition: "Revisit your stance in light of congestion externalities and defend a policy brief."
        }
      ],
      learning_journey: {
        design_intent: "Scaffold introductory economics learners from marginal cost concepts to defended policy judgement.",
        journal: {
          title: "Policy Reasoning Journal",
          entries: [
            {
              entry_id: "j1",
              framing: "Inspect your fare stance from Step 2 alongside later externality reasoning."
            },
            {
              entry_id: "j2",
              framing: "Review your policy brief to see how your trade-off weighting developed."
            }
          ]
        }
      },
      assembly_state: {
        current_stage: "design_page",
        enriched_by: ["design_page"],
        calls_model: true
      }
    }
  };
}

function pasteStagesInOrder(api, wf, stages, stageList) {
  const domByStep = {};
  for (const key of stageList) {
    const step = wf.steps.find((s) => s.id === key);
    const stub = makeStepLi(step, JSON.stringify(stages[key], null, 2));
    domByStep[key] = stub;
    api.syncWorkflowRunCapturedOutputToState(stub.li, { source: "user_input" });
  }
  return domByStep;
}

test("S105 M3: 5-stage progressive capture, validation, persistence & deterministic assembly require all 5 stages and reject monolithic bypass", () => {
  const { api } = loadHarness();
  const wf = makeProgressiveWorkflow("wf_s105_m3_full", {
    briefSource: ""
  });
  const stages = makeValidStages({
    generatedSource:
      "MetroBus dataset: Peak route serves 1200 passengers per hour and off-peak serves 350 passengers per hour under a fixed fleet lease of 40 buses."
  });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  // All 5 steps are capture producers on progressive LJ
  assert.equal(api.isPartialPageOutputWorkflowEnabled(wf), true);
  for (const st of wf.steps) {
    assert.equal(api.isWorkflowStepRunCaptureProducer(st, wf), true, `${st.id} must be capture producer`);
  }

  // Attempting to paste Stage 2 before Stage 1 fails closed
  const earlyS2 = makeStepLi(wf.steps[1], JSON.stringify(stages.s2, null, 2));
  api.syncWorkflowRunCapturedOutputToState(earlyS2.li, { source: "user_input" });
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s2"), true);
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(wf.steps[1], "s2", wf, earlyS2.li), false);

  // Cleanly paste Stages 1..4
  pasteStagesInOrder(api, wf, stages, ["s1", "s2", "s3", "s4"]);
  for (const sid of ["s1", "s2", "s3", "s4"]) {
    assert.equal(api.workflowRunStepHasBlockingCaptureErrors(sid), false, `${sid} should be valid`);
  }

  // Stage 4 persisted run-derived durations and run-generated source_context
  const dur = api.readLearningJourneyAuthoritativeCommissionDurations(wf);
  assert.ok(dur && dur.byCommissionId && dur.byCommissionId.comm_1 === 30);
  assert.equal(wf.workflowBriefResolution.resolvedFactors.source_context_origin, "run_generated");
  assert.match(wf.workflowBriefResolution.resolvedFactors.source_context, /MetroBus dataset/);

  // Before Stage 5 is captured, final assembly MUST fail closed
  const preS5 = api.readAcceptedLearningJourneyPageFromWorkflow(wf);
  assert.equal(preS5.ok, false);
  assert.match(preS5.code, /missing_progressive_stages:design_page/);
  assert.throws(() => api.resolvePageForRenderOrAssembly(null, wf), /missing_progressive_stages/);

  // Monolithic LJ Design Page pasted on Step 5 of progressive workflow MUST be rejected
  const monolithic = ljDesign.buildLearningJourneyDesignPageFixture({ title: "Monolithic Attempt" }).page;
  const monoLi = makeStepLi(wf.steps[4], JSON.stringify(monolithic, null, 2));
  api.syncWorkflowRunCapturedOutputToState(monoLi.li, { source: "user_input" });
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s5"), true);
  const afterMono = api.readAcceptedLearningJourneyPageFromWorkflow(wf);
  assert.equal(afterMono.ok, false);

  // Paste valid thin Stage 5 partial → deterministic assembly succeeds
  pasteStagesInOrder(api, wf, stages, ["s5"]);
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s5"), false);

  const accepted = api.readAcceptedLearningJourneyPageFromWorkflow(wf);
  assert.equal(accepted.ok, true);
  assert.equal(accepted.progressive, true);
  assert.equal(accepted.assembledFromStages, true);
  assert.equal(accepted.page.product_id, "learning_journey");
  assert.equal(accepted.page.commissions.length, 3);
  assert.equal(accepted.page.commissions[0].allocated_minutes, 30);
  assert.match(accepted.page.commissions[0].journey_context_text, /<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>>/);
  assert.equal(accepted.page.learning_journey.journal.enabled, true);
  assert.equal(accepted.page.learning_journey.journal.entries.length, 2);
  assert.equal(accepted.page.learning_journey.journal.entries[0].artefact_id, "comm_2.E1");
  assert.equal(accepted.page.shared_authoritative_material.status, "generated");
  // Zero intermediate-field leakage
  assert.equal(Object.prototype.hasOwnProperty.call(accepted.page.commissions[0], "element_ids"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(accepted.page.learning_journey.journal, "decision_basis"), false);

  // resolvePageForRenderOrAssembly routes progressive workflow deterministically through all 5 stages
  const resolved = api.resolvePageForRenderOrAssembly(stages.s5, wf);
  assert.deepEqual(resolved, accepted.page);
});

test("S105 M3: author edits flow authoritatively through compact inter-stage handoffs and invalidate all downstream stages + stale writes", () => {
  const { api } = loadHarness();
  const briefCorpus = "AUTHORITATIVE_BRIEF_SOURCE: MetroBus fixed fleet 40 buses.";
  const wf = makeProgressiveWorkflow("wf_s105_m3_inval", { briefSource: briefCorpus });
  const stages = makeValidStages({ briefProvided: true });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  pasteStagesInOrder(api, wf, stages, ["s1", "s2", "s3", "s4", "s5"]);
  const initialAccepted = api.readAcceptedLearningJourneyPageFromWorkflow(wf);
  assert.equal(initialAccepted.ok, true);
  assert.equal(initialAccepted.page.shared_authoritative_material.status, "provided");
  assert.equal(initialAccepted.page.shared_authoritative_material.content, briefCorpus);

  // Verify Stage 5 handoff communicates consequential upstream decisions cleanly without full specs or shared source
  const s5Prompt = api.resolveStepPromptText(wf.steps[4], wf).text;
  assert.match(s5Prompt, /Stage 1 learner_profile: Introductory economics students/);
  assert.match(s5Prompt, /Stage 4 journey continuity summary/);
  assert.match(s5Prompt, /Focus: Explain marginal cost using worked fare increments/);
  assert.match(s5Prompt, /Stage 4 framing cue: Your marginal fare stance/);
  assert.doesNotMatch(s5Prompt, /COMPONENT_LEARNING_OUTCOMES_BEGIN/);
  assert.doesNotMatch(s5Prompt, /AUTHORITATIVE_BRIEF_SOURCE/);

  // Edit Stage 2 (author revises phase purpose & scaffolding) → invalidates Stages 3, 4, 5!
  const editedS2 = JSON.parse(JSON.stringify(stages.s2));
  editedS2.developmental_phases[0].purpose = "AUTHOR_EDITED_PHASE1_PURPOSE: Contrast marginal vs sunk cost.";
  editedS2.developmental_phases[0].scaffolding_and_evidence = "AUTHOR_EDITED_SCAFFOLDING: Guided numeric table.";
  const s2Li = makeStepLi(wf.steps[1], JSON.stringify(editedS2, null, 2));
  api.syncWorkflowRunCapturedOutputToState(s2Li.li, { source: "user_input" });

  // Stages 3, 4, 5 MUST be invalidated and cleared; assembly MUST fail closed!
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s2"), false);
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s3"), true);
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s4"), true);
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s5"), true);
  assert.equal(api.readWorkflowRunCaptureTextForStepId("s3"), "");
  assert.equal(api.readWorkflowRunCaptureTextForStepId("s4"), "");
  assert.equal(api.readWorkflowRunCaptureTextForStepId("s5"), "");

  const postEditAssembly = api.readAcceptedLearningJourneyPageFromWorkflow(wf);
  assert.equal(postEditAssembly.ok, false);
  assert.match(postEditAssembly.code, /stale_progressive_stages|missing_progressive_stages/);
  assert.throws(() => api.resolvePageForRenderOrAssembly(null, wf));

  // Run-derived durations cleared on upstream invalidation, while brief-provided source_context is strictly preserved!
  assert.equal(api.readLearningJourneyAuthoritativeCommissionDurations(wf), null);
  assert.equal(api.isLearningJourneySourceContextBriefProvided(wf), true);
  assert.equal(api.readLearningJourneyBriefProvidedSourceContext(wf), briefCorpus);

  // Stage 3 handoff now carries the author's edited Stage 2 decisions verbatim
  const s3PromptAfterEdit = api.resolveStepPromptText(wf.steps[2], wf).text;
  assert.match(s3PromptAfterEdit, /AUTHOR_EDITED_PHASE1_PURPOSE/);
  assert.match(s3PromptAfterEdit, /AUTHOR_EDITED_SCAFFOLDING/);
});

test("S105 M3: reload persistence restores all 5 stages identically and fails closed if any restored stage is corrupted", () => {
  const { api, sandbox } = loadHarness();
  const wf = makeProgressiveWorkflow("wf_s105_m3_reload", {
    briefSource: "BRIEF_CORPUS_RELOAD: Route 7 ridership 900/hr."
  });
  const stages = makeValidStages({ briefProvided: true });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  pasteStagesInOrder(api, wf, stages, ["s1", "s2", "s3", "s4", "s5"]);
  const beforeReload = api.readAcceptedLearningJourneyPageFromWorkflow(wf);
  assert.equal(beforeReload.ok, true);

  // Simulate durable store persistence (inline record under legacy/test store) and cold reload
  const persistedCaptures = {
    s1: JSON.stringify(stages.s1, null, 2),
    s2: JSON.stringify(stages.s2, null, 2),
    s3: JSON.stringify(stages.s3, null, 2),
    s4: JSON.stringify(stages.s4, null, 2),
    s5: JSON.stringify(stages.s5, null, 2)
  };
  const revalOk = api.revalidateProgressiveLearningJourneyCapturesAfterHydration(wf.id, {
    captures: persistedCaptures,
    capturesRaw: persistedCaptures
  });
  assert.equal(revalOk.ok, true);
  const afterReload = api.readAcceptedLearningJourneyPageFromWorkflow(wf, {
    captures: persistedCaptures,
    capturesRaw: persistedCaptures
  });
  assert.equal(afterReload.ok, true);
  assert.deepEqual(afterReload.page, beforeReload.page);

  // Now simulate corrupted Stage 3 in persisted storage on reload → fails closed!
  const corruptedCaptures = Object.assign({}, persistedCaptures, {
    s3: JSON.stringify({
      artifact_type: "learning_journey_stage",
      schema_version: "1.0.0",
      stage: "learning_elements",
      elements: []
    })
  });
  const revalBad = api.revalidateProgressiveLearningJourneyCapturesAfterHydration(wf.id, {
    captures: corruptedCaptures,
    capturesRaw: corruptedCaptures
  });
  assert.equal(revalBad.ok, false);
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s3"), true);
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s4"), true);
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s5"), true);

  // Confirm live restore with empty store has zero phantom captures
  const ls = (sandbox.window && sandbox.window.localStorage) || sandbox.localStorage;
  if (ls && typeof ls.removeItem === "function") {
    ls.removeItem("prism_workflow_runstate_v1");
  }
  api.clearWorkflowRunCaptureState({ workflowId: wf.id, clearDom: false, persist: false });
  api.restoreWorkflowRunStateForWorkflow(wf.id);
  for (const sid of ["s1", "s2", "s3", "s4", "s5"]) {
    assert.equal(api.readWorkflowRunCaptureTextForStepId(sid), "");
  }
});

test("S105 M3: origin-aware clear-run and clean workflow duplication (S105-AD-004) preserve brief source while clearing run-derived metadata", () => {
  const { api } = loadHarness();

  // Case A: Run-generated shared source workflow
  const wfRunGen = makeProgressiveWorkflow("wf_s105_m3_rungen", { briefSource: "" });
  const stagesRunGen = makeValidStages({
    generatedSource:
      "RUN_GENERATED_CORPUS: MetroBus operates 40 buses across peak and off-peak corridors; peak fare is $3.00 and off-peak ridership averages 350 passengers per hour."
  });
  api.setWorkflowsForTest([wfRunGen]);
  api.setSelectedWorkflowIdForTest(wfRunGen.id);
  pasteStagesInOrder(api, wfRunGen, stagesRunGen, ["s1", "s2", "s3", "s4", "s5"]);

  assert.equal(api.isLearningJourneySourceContextBriefProvided(wfRunGen), false);
  assert.match(wfRunGen.workflowBriefResolution.resolvedFactors.source_context, /RUN_GENERATED_CORPUS/);
  assert.ok(api.readLearningJourneyAuthoritativeCommissionDurations(wfRunGen));

  // Duplicate before clearing → duplicate MUST be completely clean (no run-generated source, no durations, remapped step IDs)
  api.handleDuplicateWorkflow();
  const allAfterDupA = api.getWorkflowsForTest();
  const dupRunGen = allAfterDupA.find((w) => w.id !== wfRunGen.id);
  assert.ok(dupRunGen && dupRunGen.id !== wfRunGen.id);
  assert.equal(api.isProgressiveLearningJourneyWorkflowActive(dupRunGen), true);
  assert.notEqual(dupRunGen.steps[0].id, wfRunGen.steps[0].id);
  assert.equal(dupRunGen.steps[1].inputBindings[0].sourceStepId, dupRunGen.steps[0].id);
  assert.equal(api.readLearningJourneyAuthoritativeCommissionDurations(dupRunGen), null);
  assert.equal(
    String((dupRunGen.workflowBriefResolution.resolvedFactors || {}).source_context || ""),
    ""
  );
  assert.equal(api.readAcceptedLearningJourneyPageFromWorkflow(dupRunGen).ok, false);

  // Clear run data on original run-generated workflow → removes captures, durations, AND run-generated source
  api.setSelectedWorkflowIdForTest(wfRunGen.id);
  api.clearWorkflowRunCaptureState({ workflowId: wfRunGen.id, clearDom: false, persist: true });
  assert.equal(api.readLearningJourneyAuthoritativeCommissionDurations(wfRunGen), null);
  assert.equal(
    String((wfRunGen.workflowBriefResolution.resolvedFactors || {}).source_context || ""),
    ""
  );
  assert.equal(api.readAcceptedLearningJourneyPageFromWorkflow(wfRunGen).ok, false);

  // Case B: Brief-provided shared source workflow
  const briefCorpus = "BRIEF_PROVIDED_CORPUS: Municipal bus budget $4.2M.";
  const wfBrief = makeProgressiveWorkflow("wf_s105_m3_brief", { briefSource: briefCorpus });
  const stagesBrief = makeValidStages({ briefProvided: true });
  api.setWorkflowsForTest([wfBrief]);
  api.setSelectedWorkflowIdForTest(wfBrief.id);
  pasteStagesInOrder(api, wfBrief, stagesBrief, ["s1", "s2", "s3", "s4", "s5"]);

  assert.equal(api.isLearningJourneySourceContextBriefProvided(wfBrief), true);
  assert.ok(api.readLearningJourneyAuthoritativeCommissionDurations(wfBrief));

  // Duplicate → preserves brief-provided source_context, clears durations
  api.handleDuplicateWorkflow();
  const allAfterDupB = api.getWorkflowsForTest();
  const dupBrief = allAfterDupB.find((w) => w.id !== wfBrief.id);
  assert.ok(dupBrief && dupBrief.id !== wfBrief.id);
  assert.equal(api.isLearningJourneySourceContextBriefProvided(dupBrief), true);
  assert.equal(api.readLearningJourneyBriefProvidedSourceContext(dupBrief), briefCorpus);
  assert.equal(api.readLearningJourneyAuthoritativeCommissionDurations(dupBrief), null);

  // Clear run data on brief-provided workflow → preserves brief-provided source_context, clears captures & durations
  api.setSelectedWorkflowIdForTest(wfBrief.id);
  api.clearWorkflowRunCaptureState({ workflowId: wfBrief.id, clearDom: false, persist: true });
  assert.equal(api.isLearningJourneySourceContextBriefProvided(wfBrief), true);
  assert.equal(api.readLearningJourneyBriefProvidedSourceContext(wfBrief), briefCorpus);
  assert.equal(api.readLearningJourneyAuthoritativeCommissionDurations(wfBrief), null);
  assert.equal(api.readAcceptedLearningJourneyPageFromWorkflow(wfBrief).ok, false);
});

test("S105 M3: legacy pre-105 Learning Journey workflows retain chat Steps 1-4 and monolithic Step 5 acceptance", () => {
  const { api } = loadHarness();
  const legacyWf = makeProgressiveWorkflow("wf_s105_m3_legacy", { legacy: true });
  api.setWorkflowsForTest([legacyWf]);
  api.setSelectedWorkflowIdForTest(legacyWf.id);

  assert.equal(api.isProgressiveLearningJourneyWorkflowActive(legacyWf), false);
  assert.equal(api.isWorkflowStepRunCaptureProducer(legacyWf.steps[0], legacyWf), false);
  assert.equal(api.isWorkflowStepRunCaptureProducer(legacyWf.steps[3], legacyWf), false);
  assert.equal(api.isWorkflowStepRunCaptureProducer(legacyWf.steps[4], legacyWf), true);

  const monoPage = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Legacy Monolithic Journey"
  }).page;
  const s5Stub = makeStepLi(legacyWf.steps[4], JSON.stringify(monoPage, null, 2));
  api.syncWorkflowRunCapturedOutputToState(s5Stub.li, { source: "user_input" });

  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s5"), false);
  const accepted = api.readAcceptedLearningJourneyPageFromWorkflow(legacyWf);
  assert.equal(accepted.ok, true);
  assert.equal(accepted.page.title, "Legacy Monolithic Journey");
  const resolved = api.resolvePageForRenderOrAssembly(monoPage, legacyWf);
  assert.equal(resolved.title, "Legacy Monolithic Journey");
});

test("S105 M3: stale persistence writes abort after upstream invalidation and invalidated captures never resurrect on reload", async () => {
  const { api, sandbox } = loadHarness();
  const wf = makeProgressiveWorkflow("wf_s105_m3_stale_write", {
    briefSource: "BRIEF_STALE_WRITE: MetroBus baseline."
  });
  const stages = makeValidStages({ briefProvided: true });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  pasteStagesInOrder(api, wf, stages, ["s1", "s2", "s3", "s4", "s5"]);
  const epochBeforeEdit = api.getWorkflowRunClearEpochForTest(wf.id);

  // Seed durable runstate record mimicking persisted Steps 1..5 in localStorage
  const ls = (sandbox.window && sandbox.window.localStorage) || sandbox.localStorage;
  if (ls && typeof ls.setItem === "function") {
    const store = {};
    store[wf.id] = {
      capturedOutputs: {
        s1: JSON.stringify(stages.s1),
        s2: JSON.stringify(stages.s2),
        s3: JSON.stringify(stages.s3),
        s4: JSON.stringify(stages.s4),
        s5: JSON.stringify(stages.s5)
      },
      capturedOutputsRaw: {
        s1: JSON.stringify(stages.s1),
        s2: JSON.stringify(stages.s2),
        s3: JSON.stringify(stages.s3),
        s4: JSON.stringify(stages.s4),
        s5: JSON.stringify(stages.s5)
      },
      captureRefs: {
        s2: { final: { resource_id: "res_s2" } },
        s5: { final: { resource_id: "res_s5" } }
      },
      stepCompleted: { s1: true, s2: true, s3: true, s4: true, s5: true }
    };
    ls.setItem("prism_workflow_runstate_v1", JSON.stringify(store));
  }

  // Author edits Stage 1 → invalidates Stages 2..5, bumps clear epoch, purges durable store entries
  const editedS1 = JSON.parse(JSON.stringify(stages.s1));
  editedS1.purpose = "REVISED_PURPOSE_AFTER_EDIT";
  const s1Li = makeStepLi(wf.steps[0], JSON.stringify(editedS1, null, 2));
  api.syncWorkflowRunCapturedOutputToState(s1Li.li, { source: "user_input" });

  const epochAfterEdit = api.getWorkflowRunClearEpochForTest(wf.id);
  assert.ok(epochAfterEdit > epochBeforeEdit, "upstream invalidation must advance clear epoch");

  // A stale in-flight async persist captured before the edit MUST abort cleanly
  const staleRes = await api.persistWorkflowRunStateForWorkflowForTest(wf.id, {
    clearEpoch: epochBeforeEdit,
    source: "stale_in_flight_test"
  });
  assert.equal(staleRes.ok, false);
  assert.equal(staleRes.abandoned, true);

  // Durable store must NOT retain invalidated downstream step entries (no ABSENT!=DELETE resurrection)
  if (ls && typeof ls.getItem === "function") {
    const rawStore = ls.getItem("prism_workflow_runstate_v1");
    const parsedStore = rawStore ? JSON.parse(rawStore) : {};
    const rec = parsedStore[wf.id] || {};
    for (const dsid of ["s2", "s3", "s4", "s5"]) {
      assert.equal((rec.capturedOutputs || {})[dsid], undefined, `${dsid} must be purged from capturedOutputs`);
      assert.equal((rec.captureRefs || {})[dsid], undefined, `${dsid} must be purged from captureRefs`);
      assert.equal((rec.stepCompleted || {})[dsid], undefined, `${dsid} must be purged from stepCompleted`);
    }
  }
});

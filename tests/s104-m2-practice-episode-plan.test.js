const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  loadPrismAppJsTestApi,
  createPrismVmElementStub
} = require("./prism-vm-lib-bootstrap");

const REPO_ROOT = path.resolve(__dirname, "..");

const pageShellCreate = require(path.join(REPO_ROOT, "lib", "page-shell-create.js"));
const pageVnextAssemble = require(path.join(REPO_ROOT, "lib", "page-vnext-assemble.js"));
const rendererVnext = require(path.join(REPO_ROOT, "lib", "learner-renderer-vnext"));
const practiceEpMod = require(path.join(REPO_ROOT, "lib", "practice-episode-plan.js"));
const grammarMod = require(path.join(REPO_ROOT, "lib", "episode-plan-v1-archetype-grammar.js"));
const familyMod = require(path.join(REPO_ROOT, "lib", "first-class-workflow-family.js"));
const intakeMod = require(path.join(REPO_ROOT, "lib", "first-class-commission-intake.js"));

function loadM2Api() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/prism-workflow-resources.js",
      "lib/ld-practice-presentation-contracts.js",
      "lib/episode-plan-v1-vocabulary.js",
      "lib/episode-plan-v1-archetype-grammar.js",
      "lib/episode-plan-population-contract.js",
      "lib/episode-plan-v1-templates.js",
      "lib/episode-plan-v1-validation.js",
      "lib/page-shell-create.js",
      "lib/episode-plan-dla-integration.js",
      "lib/practice-episode-plan.js"
    ]
  });
  const memStorage = new Map();
  loaded.window.localStorage = {
    getItem(k) {
      return memStorage.has(k) ? memStorage.get(k) : null;
    },
    setItem(k, v) {
      memStorage.set(k, String(v));
    },
    removeItem(k) {
      memStorage.delete(k);
    },
    key(i) {
      return Array.from(memStorage.keys())[i] || null;
    },
    get length() {
      return memStorage.size;
    }
  };
  const wfResourcesMod = loaded.sandbox.PRISM_WORKFLOW_RESOURCES;
  if (wfResourcesMod && typeof wfResourcesMod.resetStorageBackendForTests === "function") {
    wfResourcesMod.resetStorageBackendForTests();
  }
  const runstateStoreMod = loaded.sandbox.PRISM_WORKFLOW_RUNSTATE_STORE;
  if (runstateStoreMod && typeof runstateStoreMod.resetStorageBackendForTests === "function") {
    runstateStoreMod.resetStorageBackendForTests();
  }
  return loaded;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeCommissionedPracticeWorkflow(api, overrides = {}) {
  const commissionedLos = overrides.commissionedLearningOutcomes || {
    learning_outcomes: [
      {
        statement:
          "Identify candidate confounding variables in observational regional datasets using covariation checks.",
        related_concepts: ["confounding", "covariation"],
        cognitive_level: "apply"
      },
      {
        statement:
          "Evaluate whether a proposed causal mechanism accounts for observed slope divergence across subgroups.",
        related_concepts: ["causal mechanism", "subgroup divergence"],
        cognitive_level: "evaluate"
      }
    ]
  };
  const durationMinutes =
    overrides.durationMinutes !== undefined ? overrides.durationMinutes : 15;
  const specText =
    overrides.commissionSpec ||
    "Learners practise distinguishing genuine causal drivers from regional confounders using the shared panel datasets.";
  const journeyCtx =
    overrides.journeyContext ||
    "Prior learning: learners completed the Expository primer 'Spotting Association vs Causation' establishing baseline correlation vs slope definitions and Dataset A regional panels. Do not reteach basic correlation formulas.";
  const dependencies =
    overrides.dependencies !== undefined ? overrides.dependencies : "c0 (Spotting Association vs Causation)";

  const intakeRes = intakeMod.intakeCommission({
    productId: "practice",
    focus: overrides.focus || "Diagnosing Confounders in Regional Panels",
    audience: overrides.audience || "Undergraduate econometrics students",
    specificationText: specText,
    journeyContextText: journeyCtx,
    dependencies,
    publishedTitleDirectory:
      "PUBLISHED LEARNING JOURNEY RESOURCE TITLES\n- c0: Spotting Association vs Causation",
    sourceContext:
      overrides.sourceContext ||
      "Region North: r=0.82 (1998-2015); Region South: r=0.31 (1998-2015). Policy shock in 2006.",
    allocatedMinutes: durationMinutes,
    journeyAllocatedMinutes: 45,
    sourceJourneyWorkflowId: "wf-lj-m2",
    sourceCommissionId: "c1",
    componentLearningOutcomes: commissionedLos,
    requiredLearnerArtefacts: overrides.requiredLearnerArtefacts || [
      {
        elicitationId: "E1",
        artefactId: "c1.E1",
        title: "Confounder diagnosis judgement"
      }
    ]
  });
  assert.equal(intakeRes.ok, true, JSON.stringify(intakeRes));
  const applied = api.applyAcceptedCommissionIntakeForTest(intakeRes);
  assert.equal(applied.ok, true, JSON.stringify(applied));
  const rawSteps = plain(applied.built.steps || intakeRes.family.steps).map((s, idx) =>
    Object.assign({ id: "p-step-" + (idx + 1) }, s)
  );
  const wf = api.normalizeWorkflowForV1(
    {
      id: overrides.id || "wf-practice-m2-1",
      name: overrides.name || "Practice — Diagnosing Confounders",
      goal:
        overrides.goal ||
        "Practise identifying confounders and defending causal mechanism judgements across regional datasets.",
      product: "practice",
      promptRoute: "practice",
      pageEnrichmentV2: true,
      partialPageOutputs: false,
      steps: rawSteps,
      workflowOutputSpec: {
        audience: overrides.audience || "Undergraduate econometrics students",
        pageEnrichmentV2: true
      },
      workflowBriefResolution: {
        initialBrief: Object.assign(
          {
            product: "practice",
            topic: overrides.focus || "Diagnosing Confounders in Regional Panels",
            audience: overrides.audience || "Undergraduate econometrics students",
            designIntent: specText,
            commissionSpecification: specText,
            journeyContextText: journeyCtx,
            dependencies,
            commissionedDurationMinutes: durationMinutes,
            allocatedMinutes: durationMinutes,
            journeyAllocatedMinutes: 45,
            durationContractVersion: "s104_m1",
            commissionedLearningOutcomes: commissionedLos,
            commissionNativeBound: true,
            requiredLearnerArtefacts: overrides.requiredLearnerArtefacts || [
              { elicitationId: "E1", artefactId: "c1.E1", title: "Confounder diagnosis judgement" }
            ]
          },
          intakeRes.family.initialBriefPatch || {}
        ),
        resolvedFactors: Object.assign({}, intakeRes.family.deliverySeed, {
          audience: overrides.audience || "Undergraduate econometrics students",
          commissioned_duration_minutes: durationMinutes,
          journey_allocated_minutes: 45,
          duration_contract_version: "s104_m1",
          commissioned_learning_outcomes: commissionedLos,
          commission_native_lo_bound: true,
          required_learner_artefacts: overrides.requiredLearnerArtefacts || [
            { elicitationId: "E1", artefactId: "c1.E1", title: "Confounder diagnosis judgement" }
          ]
        })
      }
    },
    []
  );
  return wf;
}

function makeInteractiveWorkflow(overrides = {}) {
  return {
    id: overrides.id || "wf-interactive-m2-1",
    name: "Interactive — Elasticity Foundations",
    goal: "Guide learners through price elasticity of demand.",
    product: "interactive",
    promptRoute: "interactive",
    pageEnrichmentV2: true,
    steps: [
      {
        id: "int-s1",
        title: "Define Learning Outcomes",
        outputName: "learning_outcomes",
        canonical_step_id: "step_define_learning_outcomes"
      },
      {
        id: "int-s2",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "int-s3",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities"
      }
    ],
    workflowOutputSpec: {
      audience: "First-year economics undergraduates",
      pageEnrichmentV2: true
    }
  };
}

function makePracticeEpShell(overrides = {}) {
  const los = overrides.learning_outcomes || [
    {
      id: "LO1",
      statement:
        "Identify candidate confounding variables in observational regional datasets using covariation checks."
    },
    {
      id: "LO2",
      statement:
        "Evaluate whether a proposed causal mechanism accounts for observed slope divergence across subgroups."
    }
  ];
  const activities = overrides.activities || [
    {
      activity_id: "A1",
      title: "Cohesive confounder diagnosis and causal evaluation",
      learner_task: "\u2014",
      expected_output: "\u2014",
      activity_preamble: "\u2014",
      required_materials: [],
      materials: [],
      learning_outcome_ids: ["LO1", "LO2"],
      episode_plan: {
        archetype: "evaluate",
        beats: [
          { function: "perspective_construction" },
          { function: "evaluative_judgement" },
          { function: "reflection" }
        ]
      }
    }
  ];
  const episodePlans =
    overrides.episode_plans ||
    activities.map((a) => ({
      activity_id: a.activity_id,
      mapped_learning_outcome_ids: (a.learning_outcome_ids || []).slice(),
      episode_plan: JSON.parse(JSON.stringify(a.episode_plan))
    }));

  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      product_id: "practice",
      page_kind: "practice",
      title: "Diagnosing Confounders in Regional Panels",
      audience: "Undergraduate econometrics students",
      page_profile: { profile_type: "learner" },
      assembly_state: {
        enriched_by: ["episode_plan"],
        current_stage: "episode_plan"
      },
      page_synthesis: {},
      learning_outcomes: los,
      episode_plans: episodePlans,
      activities,
      source_artefacts: [
        {
          artefact_type: "learning_outcomes",
          source_label: "Commissioned Learning Outcomes",
          role: "structural"
        }
      ],
      generation_notes: {
        validation: {
          activity_coverage: "shell_only",
          material_coverage: "pending_gam",
          episode_plan_attachment: "attached",
          self_containment: "shell_only",
          schema_compliance: "episode_plan_boundary",
          known_issues: []
        }
      }
    },
    overrides.topLevel || {}
  );
}

test("index.html loads archetype grammar before practice-episode-plan module", () => {
  const html = fs.readFileSync(path.join(REPO_ROOT, "index.html"), "utf8");
  const vocabIdx = html.indexOf("lib/episode-plan-v1-vocabulary.js");
  const grammarIdx = html.indexOf("lib/episode-plan-v1-archetype-grammar.js");
  const dlaIntIdx = html.indexOf("lib/episode-plan-dla-integration.js");
  const practiceEpIdx = html.indexOf("lib/practice-episode-plan.js");
  assert.ok(vocabIdx !== -1);
  assert.ok(grammarIdx > vocabIdx, "grammar must load after vocabulary");
  assert.ok(practiceEpIdx > grammarIdx && practiceEpIdx > dlaIntIdx, "practice EP loads after dependencies");
});

test("Practice EP prompt supplies outcomes, duration, purpose, prior learning and removes deterministic boilerplate", () => {
  const { api } = loadM2Api();
  const wf = makeCommissionedPracticeWorkflow(api, { durationMinutes: 8 });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const epStep = wf.steps[0];
  assert.equal(epStep.canonical_step_id, "step_design_episode_plan");

  // Context projection eligibility is Practice-aware without breaking 1-arg Interactive default
  assert.equal(api.isDerivedShellWorkflowStep(epStep, wf), false);
  assert.equal(api.isWorkflowStepEligibleForWorkflowContextProjection(epStep, wf), true);
  assert.equal(api.isDerivedShellWorkflowStep(epStep), true);
  assert.equal(api.isWorkflowStepEligibleForWorkflowContextProjection(epStep), false);

  const resolved = api.resolveStepPromptText(epStep, wf);
  assert.equal(resolved.sourceType, "practice_episode_plan");
  assert.match(resolved.text, /AUTHORITATIVE COMMISSIONED LEARNING OUTCOMES/);
  assert.match(resolved.text, /`LO1`:/);
  assert.match(resolved.text, /`LO2`:/);
  assert.match(resolved.text, /Authoritative allocated duration: 8 minutes/);
  assert.match(resolved.text, /PURPOSE \/ FOCUS/);
  assert.match(resolved.text, /Prior learning:/);
  assert.match(resolved.text, /LEARNING JOURNEY CONTEXT/);
  assert.match(resolved.text, /EDUCATIONAL DEPENDENCIES/);
  assert.match(resolved.text, /Shared Learner Artefact Obligation/i);
  assert.match(resolved.text, /elicitation_id `E1`/);
  assert.match(resolved.text, /map multiple compatible authoritative outcomes onto one cohesive activity/i);
  assert.match(resolved.text, /NO duration tiers, NO activity quotas, and NO beat-count targets/i);
  assert.match(resolved.text, /rising intellectual demand/i);
  assert.doesNotMatch(resolved.text, /Supported learner response repertoire/);

  const fullInstructions = api.buildWorkflowStepInstructions(epStep, 0, null);
  assert.match(fullInstructions, /Duration: 8 minutes/);
  assert.match(fullInstructions, /AI-authored Practice Episode Plan/);
  assert.match(fullInstructions, /STEP 1 OUTPUT: page/);
  assert.doesNotMatch(fullInstructions, /Do NOT invent episode plans with an LLM/);
  assert.doesNotMatch(fullInstructions, /PRISM-derived — return verbatim/);
  assert.doesNotMatch(fullInstructions, /Deterministic step \(Sprint 56F\)/);
  assert.doesNotMatch(fullInstructions, /Authoritative Sprint 56F page shell/);
});

test("Non-commission-native Practice workflow still resolves AI-authored EP prompt without deterministic derivation", () => {
  const { api } = loadM2Api();
  const wf = {
    id: "wf-practice-legacy-lo",
    name: "Practice — Margin Analysis",
    goal: "Practise marginal revenue vs marginal cost decisions.",
    product: "practice",
    promptRoute: "practice",
    pageEnrichmentV2: true,
    inputs: "Learners already understand total cost curves.",
    steps: [
      {
        id: "lo-s1",
        title: "Define Learning Outcomes",
        outputName: "learning_outcomes",
        canonical_step_id: "step_define_learning_outcomes"
      },
      {
        id: "ep-s2",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    "lo-s1": JSON.stringify({
      learning_outcomes: [
        { id: "LO1", statement: "Apply MR = MC to choose output under price-taking assumptions." }
      ]
    })
  });

  const resolved = api.resolveStepPromptText(wf.steps[1], wf);
  assert.equal(resolved.sourceType, "practice_episode_plan");
  assert.match(resolved.text, /`LO1`: Apply MR = MC/);
  assert.match(resolved.text, /Prior learning established: Learners already understand total cost curves/);
  assert.equal(api.deriveDesignEpisodePlanCaptureJson(wf), "");
});

test("Model-authored Practice EP capture (including multi-LO cohesive single activity & lean beat sequence) is accepted and never overwritten", () => {
  const { api } = loadM2Api();
  const wf = makeCommissionedPracticeWorkflow(api);
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const epStep = wf.steps[0];

  // Compact lean evaluate sequence addressing BOTH LO1 & LO2 in ONE cohesive activity
  const shell = makePracticeEpShell();
  const fencedWithFooter = [
    "Here is the designed Practice Episode Plan:",
    "",
    "```json",
    JSON.stringify(shell, null, 2),
    "```",
    "",
    "STEP 1 OUTPUT: page"
  ].join("\n");

  const stored = api.parseWorkflowRunPageStructureCaptureForStorage(
    fencedWithFooter,
    epStep,
    wf
  );
  assert.equal(stored.ok, true, JSON.stringify(stored));
  assert.equal(stored.parsed.activities.length, 1);
  assert.deepEqual(plain(stored.parsed.activities[0].learning_outcome_ids), ["LO1", "LO2"]);
  assert.deepEqual(plain(stored.parsed.episode_plans[0].mapped_learning_outcome_ids), ["LO1", "LO2"]);
  assert.equal(stored.parsed.activities[0].episode_plan.archetype, "evaluate");
  assert.deepEqual(
    plain(stored.parsed.activities[0].episode_plan.beats.map((b) => b.function)),
    ["perspective_construction", "evaluative_judgement", "reflection"]
  );

  // Run canonical enforcement MUST preserve authored design verbatim (never replace with 12-beat template!)
  const enforced = api.applyEpisodePlanCaptureCanonicalEnforcement(
    stored.json,
    epStep,
    epStep.id,
    wf
  );
  const enforcedParsed = JSON.parse(enforced);
  assert.equal(enforcedParsed.activities.length, 1);
  assert.equal(enforcedParsed.activities[0].title, "Cohesive confounder diagnosis and causal evaluation");
  assert.deepEqual(enforcedParsed.activities[0].learning_outcome_ids, ["LO1", "LO2"]);
  assert.deepEqual(
    enforcedParsed.activities[0].episode_plan.beats.map((b) => b.function),
    ["perspective_construction", "evaluative_judgement", "reflection"]
  );
  assert.deepEqual(plain(api.getWorkflowRunEpisodePlanValidationForTest()), {});

  // Sync via DOM Run textarea & confirm zero overwrite and durable resolution
  const ta = createPrismVmElementStub();
  ta.value = fencedWithFooter;
  const li = {
    getAttribute: (attr) => (attr === "data-step-id" ? epStep.id : ""),
    querySelector: (sel) => (sel === '[data-field="runStepOutput"]' ? ta : null)
  };
  api.syncWorkflowRunCapturedOutputToState(li, { source: "test_paste" });
  const persisted = JSON.parse(ta.value);
  assert.equal(persisted.activities.length, 1);
  assert.deepEqual(persisted.activities[0].learning_outcome_ids, ["LO1", "LO2"]);

  // Downstream shell & EP resolvers return the authored multi-LO shell verbatim
  const dlaBaselineJson = api.resolvePageShellJsonForDlaCopy(wf);
  const dlaBaseline = JSON.parse(dlaBaselineJson);
  assert.equal(dlaBaseline.activities.length, 1);
  assert.deepEqual(dlaBaseline.activities[0].learning_outcome_ids, ["LO1", "LO2"]);

  const epForDla = api.resolveEpisodePlansForDlaPopulation({ workflow: wf, skipSync: true });
  assert.equal(epForDla.episode_plans.length, 1);
  assert.deepEqual(plain(epForDla.episode_plans[0].mapped_learning_outcome_ids), ["LO1", "LO2"]);

  // Verify assembly & vNext renderer contract compatibility for multi-LO cohesive single activity
  const assembled = pageVnextAssemble.assembleVNextPageFromPartials({
    episode_plan: persisted,
    dla: {
      artifact_type: "page",
      schema_version: "2.0.0",
      assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
      activities: [
        {
          activity_id: "A1",
          title: "Diagnose confounders across regional panels",
          activity_preamble: "Compare the two candidate explanations before locking in your diagnosis.",
          learner_task: "Select the strongest confounder and explain why the alternative mechanism fails.",
          expected_output: "Selection of confounder plus one concise defence.",
          evidence_decision: { required: false, provider_material_ids: [] },
          task_material_decision: { required: true, reason: "practice_workspace" },
          required_materials: [
            {
              material_id: "A1-M1",
              material_type: "selection",
              purpose: "diagnose_confounder",
              role: "practise",
              required: true
            }
          ]
        }
      ]
    },
    gam: {
      artifact_type: "page",
      schema_version: "2.0.0",
      assembly_state: { current_stage: "gam", enriched_by: ["gam"] },
      activities: [
        {
          activity_id: "A1",
          materials: [
            {
              material_id: "A1-M1",
              material_type: "selection",
              title: "Candidate confounders",
              body: "Choose the mechanism consistent with both regions.",
              body_format: "markdown",
              selection_kind: "single_select",
              options: [
                { id: "o1", label: "2006 regulatory shock" },
                { id: "o2", label: "Random measurement noise" }
              ]
            }
          ]
        }
      ]
    },
    learning_sequence: {
      artifact_type: "page",
      schema_version: "2.0.0",
      assembly_state: { current_stage: "learning_sequence", enriched_by: ["learning_sequence"] },
      learning_sequence: {
        summary: "Focused practice diagnosis.",
        total_estimated_minutes: 8,
        steps: [{ step_id: "S1", activity_id: "A1", label: "Diagnose", estimated_minutes: 8 }]
      }
    },
    design_page: {
      artifact_type: "page",
      schema_version: "2.0.0",
      assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] },
      page_synthesis: {
        knowledge_summary: { body: "Distinguish confounding shocks from sample noise.", format: "markdown" }
      }
    }
  });
  assert.equal(assembled.ok, true, JSON.stringify(assembled.errors));
  assert.equal(assembled.page.activities.length, 1);
  assert.deepEqual(assembled.page.activities[0].learning_outcome_ids, ["LO1", "LO2"]);
  const vnextCheck = rendererVnext.validateInput(assembled.page);
  assert.deepEqual(vnextCheck.errors, [], JSON.stringify(vnextCheck.errors));
});

test("Grammar enforcement rejects illegal archetypes, non-FunctionEnum beats, ordering errors, and invalid beats without overwriting", () => {
  const { api } = loadM2Api();
  const wf = makeCommissionedPracticeWorkflow(api);
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const epStep = wf.steps[0];

  const badCases = [
    {
      label: "unknown archetype",
      mutate: (s) => {
        s.activities[0].episode_plan.archetype = "explore";
        s.episode_plans[0].episode_plan.archetype = "explore";
      },
      pattern: /UNKNOWN_ARCHETYPE/i
    },
    {
      label: "non-FunctionEnum beat",
      mutate: (s) => {
        s.activities[0].episode_plan.beats = [
          { function: "invented_warm_up" },
          { function: "verification" }
        ];
        s.episode_plans[0].episode_plan.beats = JSON.parse(
          JSON.stringify(s.activities[0].episode_plan.beats)
        );
      },
      pattern: /invented_warm_up|FunctionEnum|NON_CANONICAL/i
    },
    {
      label: "understand missing required explanation beat",
      mutate: (s) => {
        s.activities[0].episode_plan = {
          archetype: "understand",
          beats: [{ function: "orientation" }, { function: "verification" }]
        };
        s.episode_plans[0].episode_plan = JSON.parse(
          JSON.stringify(s.activities[0].episode_plan)
        );
      },
      pattern: /MISSING_REQUIRED_BEAT.*explanation/i
    },
    {
      label: "phase ordering & T1-T5 violation (performance before explanation)",
      mutate: (s) => {
        s.activities[0].episode_plan = {
          archetype: "understand",
          beats: [
            { function: "independent_performance" },
            { function: "explanation" },
            { function: "verification" }
          ]
        };
        s.episode_plans[0].episode_plan = JSON.parse(
          JSON.stringify(s.activities[0].episode_plan)
        );
      },
      pattern: /PHASE_ORDER|RELATIVE_ORDER|PRECEDES/i
    },
    {
      label: "missing closure group / invalid terminal beat",
      mutate: (s) => {
        s.activities[0].episode_plan = {
          archetype: "apply",
          beats: [{ function: "worked_thinking" }, { function: "independent_performance" }]
        };
        s.episode_plans[0].episode_plan = JSON.parse(
          JSON.stringify(s.activities[0].episode_plan)
        );
      },
      pattern: /MISSING_REQUIRED_GROUP|TERMINAL/i
    },
    {
      label: "activities vs episode_plans beat disagreement",
      mutate: (s) => {
        s.episode_plans[0].episode_plan = {
          archetype: "understand",
          beats: [{ function: "explanation" }, { function: "verification" }]
        };
      },
      pattern: /disagrees with episode_plans/i
    }
  ];

  badCases.forEach((tc) => {
    const badShell = makePracticeEpShell();
    tc.mutate(badShell);
    const rawBad = JSON.stringify(badShell, null, 2);

    const check = api.validateEpisodePlanOrPageShellCapture(badShell, wf);
    assert.equal(check.ok, false, tc.label + " must fail validation");
    assert.match(check.errors.join("; "), tc.pattern, tc.label);

    const parseResult = api.parseWorkflowRunPageStructureCaptureForStorage(rawBad, epStep, wf);
    assert.equal(parseResult.ok, false, tc.label + " storage parse must reject");

    // Verify Run sync keeps raw textarea untouched and records error without deterministic overwrite
    const ta = createPrismVmElementStub();
    ta.value = rawBad;
    const li = {
      getAttribute: (attr) => (attr === "data-step-id" ? epStep.id : ""),
      querySelector: (sel) => (sel === '[data-field="runStepOutput"]' ? ta : null)
    };
    api.syncWorkflowRunCapturedOutputToState(li, { source: "test_invalid" });
    assert.equal(ta.value, rawBad, tc.label + " textarea must NOT be overwritten");
    const valMap = api.getWorkflowRunEpisodePlanValidationForTest();
    assert.match(String(valMap[epStep.id] || ""), tc.pattern, tc.label + " validation surfaced");

    // Downstream resolvers must fail closed rather than fall back to deterministic derivation
    assert.equal(api.resolvePageShellJsonForDlaCopy(wf), "");
    const dlaDiag = api.resolveEpisodePlansForDlaPopulation({
      workflow: wf,
      diagnostic: true,
      skipSync: true
    });
    assert.equal(dlaDiag.episodePlans, null, tc.label + " must fail closed downstream");
  });
});

test("Outcome coverage & fidelity: mirrors single-sided mapping, rejects dropped, invented, rewritten, or conflicting outcomes", () => {
  const { api } = loadM2Api();
  const wf = makeCommissionedPracticeWorkflow(api);
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  // Single-sided mapped_learning_outcome_ids mirrors cleanly onto activity.learning_outcome_ids
  const oneSided = makePracticeEpShell();
  delete oneSided.activities[0].learning_outcome_ids;
  const oneSidedCheck = api.validateEpisodePlanOrPageShellCapture(oneSided, wf);
  assert.equal(oneSidedCheck.ok, true, JSON.stringify(oneSidedCheck.errors));
  assert.deepEqual(plain(oneSided.activities[0].learning_outcome_ids), ["LO1", "LO2"]);

  // Disagreement between activities[].learning_outcome_ids and episode_plans[].mapped_learning_outcome_ids fails closed
  const disagreeShell = makePracticeEpShell();
  disagreeShell.activities[0].learning_outcome_ids = ["LO1"];
  disagreeShell.episode_plans[0].mapped_learning_outcome_ids = ["LO1", "LO2"];
  const disagreeRes = api.validateEpisodePlanOrPageShellCapture(disagreeShell, wf);
  assert.equal(disagreeRes.ok, false);
  assert.match(disagreeRes.errors.join("; "), /disagrees with episode_plans\.mapped_learning_outcome_ids/i);

  // Unmapped / silently discarded commissioned outcome fails closed
  const unmappedShell = makePracticeEpShell();
  unmappedShell.activities[0].learning_outcome_ids = ["LO1"];
  unmappedShell.episode_plans[0].mapped_learning_outcome_ids = ["LO1"];
  const unmappedRes = api.validateEpisodePlanOrPageShellCapture(unmappedShell, wf);
  assert.equal(unmappedRes.ok, false);
  assert.match(unmappedRes.errors.join("; "), /LO2.*unmapped/i);

  // Unknown / invented mapped outcome ID fails closed
  const unknownLoShell = makePracticeEpShell();
  unknownLoShell.activities[0].learning_outcome_ids = ["LO1", "LO2", "LO99"];
  unknownLoShell.episode_plans[0].mapped_learning_outcome_ids = ["LO1", "LO2", "LO99"];
  const unknownRes = api.validateEpisodePlanOrPageShellCapture(unknownLoShell, wf);
  assert.equal(unknownRes.ok, false);
  assert.match(unknownRes.errors.join("; "), /unknown learning outcome id "LO99"/i);

  // Rewritten authoritative outcome statement fails closed
  const rewrittenShell = makePracticeEpShell();
  rewrittenShell.learning_outcomes[1].statement = "Memorize regression coefficient formulas.";
  const rewrittenRes = api.validateEpisodePlanOrPageShellCapture(rewrittenShell, wf);
  assert.equal(rewrittenRes.ok, false);
  assert.match(rewrittenRes.errors.join("; "), /modified authoritative learning outcome "LO2"/i);

  // Omitted authoritative outcome from learning_outcomes[] fails closed
  const omittedLoShell = makePracticeEpShell();
  omittedLoShell.learning_outcomes = [omittedLoShell.learning_outcomes[0]];
  omittedLoShell.activities[0].learning_outcome_ids = ["LO1"];
  omittedLoShell.episode_plans[0].mapped_learning_outcome_ids = ["LO1"];
  const omittedRes = api.validateEpisodePlanOrPageShellCapture(omittedLoShell, wf);
  assert.equal(omittedRes.ok, false);
  assert.match(omittedRes.errors.join("; "), /omitted authoritative learning outcome "LO2"/i);

  // Invented DLA cognition fields & non-empty materials fail closed
  const pollutedDlaShell = makePracticeEpShell();
  pollutedDlaShell.activities[0].reasoning_orientation = "Think about confounding.";
  const pollutedDlaRes = api.validateEpisodePlanOrPageShellCapture(pollutedDlaShell, wf);
  assert.equal(pollutedDlaRes.ok, false);
  assert.match(pollutedDlaRes.errors.join("; "), /must not include DLA field reasoning_orientation/i);

  const pollutedGamShell = makePracticeEpShell();
  pollutedGamShell.activities[0].materials = [{ material_id: "M1", body: "Premature body" }];
  const pollutedGamRes = api.validateEpisodePlanOrPageShellCapture(pollutedGamShell, wf);
  assert.equal(pollutedGamRes.ok, false);
  assert.match(pollutedGamRes.errors.join("; "), /materials empty/i);
});

test("Practice EP capture persists cleanly across Run state store reload and never auto-populates when unstarted", async () => {
  const { api } = loadM2Api();
  const wf = makeCommissionedPracticeWorkflow(api);
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const epStep = wf.steps[0];

  // Unstarted Practice Run: no derived shell, no phantom capture, no validation error
  assert.equal(api.deriveDesignEpisodePlanCaptureJson(wf), "");
  assert.equal(api.resolvePageShellJsonForDlaCopy(wf), "");
  assert.equal(api.tryResolveCanonicalEpisodePlansDeriveFallback(wf), null);

  const emptyTa = createPrismVmElementStub();
  emptyTa.value = "";
  const emptyLi = {
    getAttribute: (attr) => (attr === "data-step-id" ? epStep.id : ""),
    querySelector: (sel) => (sel === '[data-field="runStepOutput"]' ? emptyTa : null)
  };
  api.syncWorkflowRunCapturedOutputToState(emptyLi, { source: "empty_check" });
  assert.equal(emptyTa.value, "");
  assert.deepEqual(plain(api.getWorkflowRunEpisodePlanValidationForTest()), {});

  // Author a valid multi-activity Practice EP capture (A1: understand, A2: apply) and persist
  const twoActShell = makePracticeEpShell({
    activities: [
      {
        activity_id: "A1",
        title: "Diagnose candidate confounders",
        learner_task: "\u2014",
        expected_output: "\u2014",
        activity_preamble: "\u2014",
        required_materials: [],
        materials: [],
        learning_outcome_ids: ["LO1"],
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "worked_thinking" },
            { function: "independent_performance" },
            { function: "verification" }
          ]
        }
      },
      {
        activity_id: "A2",
        title: "Evaluate competing causal claims",
        learner_task: "\u2014",
        expected_output: "\u2014",
        activity_preamble: "\u2014",
        required_materials: [],
        materials: [],
        learning_outcome_ids: ["LO2"],
        episode_plan: {
          archetype: "evaluate",
          beats: [
            { function: "perspective_construction" },
            { function: "evaluative_judgement" },
            { function: "transfer" }
          ]
        }
      }
    ]
  });

  const ta = createPrismVmElementStub();
  ta.value = JSON.stringify(twoActShell, null, 2);
  const li = {
    getAttribute: (attr) => (attr === "data-step-id" ? epStep.id : ""),
    querySelector: (sel) => (sel === '[data-field="runStepOutput"]' ? ta : null)
  };
  api.syncWorkflowRunCapturedOutputToState(li, { source: "persist_check" });
  assert.deepEqual(plain(api.getWorkflowRunEpisodePlanValidationForTest()), {});
  const capturedFinal = api.getWorkflowRunCapturedOutputsForTest()[epStep.id];
  const capturedRaw = api.getWorkflowRunCapturedOutputsRawForTest()[epStep.id];
  assert.ok(capturedFinal && capturedRaw, "Practice EP capture must populate live capture state");

  const putRes = await api.persistWorkflowRunCapturePayloadForStepForTest(
    wf.id,
    epStep.id,
    capturedRaw,
    capturedFinal
  );
  assert.equal(putRes.ok, true, JSON.stringify(putRes));
  api.setWorkflowRunCaptureRefsForTest({ [epStep.id]: putRes.refs });
  const persistRes = await api.persistWorkflowRunStateForWorkflowForTest(wf.id, {
    observedStepId: epStep.id
  });
  assert.equal(persistRes.ok, true, JSON.stringify(persistRes));

  // Simulate state reload by clearing in-memory captures and re-hydrating from durable resource/run-state stores
  const rawStore = api.loadWorkflowRunStateStoreForTest();
  const persistedRec = rawStore[wf.id];
  assert.ok(persistedRec, "persisted workflow run-state record must exist");
  assert.ok(
    persistedRec.captureRefs &&
      persistedRec.captureRefs[epStep.id] &&
      persistedRec.captureRefs[epStep.id].final,
    "Practice EP capture must persist as a durable resource ref"
  );

  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  api.setWorkflowRunCaptureRefsForTest({});
  await api.hydrateWorkflowRunStateStoreFromDurableForTest();
  api.restoreWorkflowRunStateForWorkflowForTest(wf.id);
  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);

  const reloadedShellJson = api.resolvePageShellJsonForDlaCopy(wf);
  const reloadedShell = JSON.parse(reloadedShellJson);
  assert.equal(reloadedShell.activities.length, 2);
  assert.deepEqual(
    reloadedShell.activities[0].episode_plan.beats.map((b) => b.function),
    ["worked_thinking", "independent_performance", "verification"]
  );
  assert.deepEqual(
    reloadedShell.activities[1].episode_plan.beats.map((b) => b.function),
    ["perspective_construction", "evaluative_judgement", "transfer"]
  );
});

test("Interactive non-regression: deterministic derivation, Copy prompt, and canonical capture enforcement remain unchanged", () => {
  const { api } = loadM2Api();
  const wf = makeInteractiveWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    "int-s1": JSON.stringify({
      learning_outcomes: [
        { id: "LO1", statement: "Explain price elasticity of demand." }
      ]
    })
  });

  const epStep = wf.steps[1];
  assert.equal(api.isDerivedShellWorkflowStep(epStep), true);
  assert.equal(api.isDerivedShellWorkflowStep(epStep, wf), true);
  assert.equal(api.isWorkflowStepEligibleForWorkflowContextProjection(epStep, wf), false);

  const resolved = api.resolveStepPromptText(epStep, wf);
  assert.equal(resolved.sourceType, "v2_locked");

  const derivedJson = api.deriveDesignEpisodePlanCaptureJson(wf);
  assert.ok(derivedJson);
  const derived = JSON.parse(derivedJson);
  assert.equal(derived.artifact_type, "page");
  assert.equal(derived.activities.length, 1);

  const instructions = api.buildWorkflowStepInstructions(epStep, 1, null);
  assert.match(instructions, /Deterministic step \(Sprint 56F\)/);
  assert.match(instructions, /Do NOT invent episode plans with an LLM/);
  assert.match(instructions, /Authoritative Sprint 56F page shell \(PRISM-derived — return verbatim\)/);

  // Interactive canonical enforcement still returns canonical derived shell
  const customAttempt = JSON.stringify({
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Custom",
    audience: "Students",
    page_profile: { profile_type: "learner" },
    assembly_state: { enriched_by: ["episode_plan"], current_stage: "episode_plan" },
    page_synthesis: {},
    learning_outcomes: [{ outcome_id: "LO1", statement: "Explain price elasticity of demand." }],
    activities: [
      {
        activity_id: "A1",
        title: "Custom",
        learner_task: "\u2014",
        expected_output: "\u2014",
        activity_preamble: "\u2014",
        required_materials: [],
        materials: [],
        episode_plan: { archetype: "understand", beats: [{ function: "explanation" }, { function: "verification" }] }
      }
    ],
    source_artefacts: [{ artefact_type: "learning_outcomes", role: "structural", source_label: "LO" }],
    generation_notes: {
      validation: {
        activity_coverage: "shell_only",
        material_coverage: "pending_gam",
        episode_plan_attachment: "attached",
        self_containment: "shell_only",
        schema_compliance: "episode_plan_boundary",
        known_issues: []
      }
    }
  });
  const enforced = api.applyEpisodePlanCaptureCanonicalEnforcement(customAttempt, epStep, epStep.id, wf);
  assert.equal(JSON.stringify(JSON.parse(enforced)), JSON.stringify(derived));
});

test("Evaluate evaluative_core prompt-validator alignment: rejects independent_performance-only evaluate, accepts evaluative_judgement without extra beats", () => {
  const practiceEp = require("../lib/practice-episode-plan.js");
  const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");

  const prompt = practiceEp.buildPracticeEpisodePlanPromptBody({
    title: "Strengthening the broadband advisory judgement",
    audience: "Learners",
    purpose: "Reconsider and strengthen the broadband advisory judgement with justified additional evidence.",
    durationMinutes: 15,
    authoritativeOutcomes: [
      { id: "LO1", statement: "Explain how temporal information, evidence about potential confounders and informative comparisons could strengthen or challenge a causal explanation." },
      { id: "LO2", statement: "Justify additional evidence that would help distinguish between competing explanations of the broadband and business-growth relationship." },
      { id: "LO3", statement: "Improve an existing economic judgement by clarifying its evidential basis, uncertainty and requirements for stronger causal conclusions." }
    ]
  });

  // Prompt explicitly warns that criteria_exposition/guided_reasoning/independent_performance do not satisfy evaluative_core
  assert.match(prompt, /criteria_exposition.*guided_reasoning.*independent_performance.*do NOT satisfy `evaluative_core`/i);
  assert.match(prompt, /express that performance beat directly as `evaluative_judgement` rather than `independent_performance`/i);
  assert.match(prompt, /Pre-output grammar self-check.*evaluative_core/i);

  const contractBlock = practiceContracts.buildPracticePresentationContractBlock("episode_plan");
  assert.match(contractBlock, /satisfy evaluate's required evaluative_core group with a genuine evaluative beat/i);
  assert.match(contractBlock, /rather than pairing criteria_exposition\/guided_reasoning with independent_performance alone/i);

  const makeBroadbandShell = (a2PerformanceBeat) => ({
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Strengthening the broadband advisory judgement",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    assembly_state: { enriched_by: ["episode_plan"], current_stage: "episode_plan" },
    page_synthesis: {},
    learning_outcomes: [
      { id: "LO1", statement: "Explain how temporal information, evidence about potential confounders and informative comparisons could strengthen or challenge a causal explanation." },
      { id: "LO2", statement: "Justify additional evidence that would help distinguish between competing explanations of the broadband and business-growth relationship." },
      { id: "LO3", statement: "Improve an existing economic judgement by clarifying its evidential basis, uncertainty and requirements for stronger causal conclusions." }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan: {
          archetype: "analyse",
          beats: [{ function: "worked_thinking" }, { function: "guided_inquiry" }, { function: "verification" }]
        }
      },
      {
        activity_id: "A2",
        mapped_learning_outcome_ids: ["LO2", "LO3"],
        episode_plan: {
          archetype: "evaluate",
          beats: [
            { function: "activation" },
            { function: "criteria_exposition" },
            { function: "guided_reasoning" },
            { function: a2PerformanceBeat },
            { function: "verification" }
          ]
        }
      }
    ],
    activities: [
      {
        activity_id: "A1",
        title: "What evidence would help distinguish competing explanations?",
        learning_outcome_ids: ["LO1"],
        learner_task: "\u2014",
        expected_output: "\u2014",
        activity_preamble: "\u2014",
        required_materials: [],
        materials: [],
        episode_plan: {
          archetype: "analyse",
          beats: [{ function: "worked_thinking" }, { function: "guided_inquiry" }, { function: "verification" }]
        }
      },
      {
        activity_id: "A2",
        title: "Reconsider and strengthen your broadband advisory judgement",
        learning_outcome_ids: ["LO2", "LO3"],
        learner_task: "\u2014",
        expected_output: "\u2014",
        activity_preamble: "\u2014",
        required_materials: [],
        materials: [],
        episode_plan: {
          archetype: "evaluate",
          beats: [
            { function: "activation" },
            { function: "criteria_exposition" },
            { function: "guided_reasoning" },
            { function: a2PerformanceBeat },
            { function: "verification" }
          ]
        }
      }
    ],
    source_artefacts: [
      { artefact_type: "learning_outcomes", source_label: "Authoritative commissioned learning outcomes", role: "structural" }
    ],
    generation_notes: {
      validation: {
        activity_coverage: "shell_only",
        material_coverage: "pending_gam",
        episode_plan_attachment: "attached",
        self_containment: "shell_only",
        schema_compliance: "episode_plan_boundary",
        known_issues: []
      }
    }
  });

  // Validation MUST NOT be weakened: independent_performance-only evaluate still fails evaluative_core
  const failingCheck = practiceEp.validatePracticeEpisodePlanCapture(
    makeBroadbandShell("independent_performance")
  );
  assert.equal(failingCheck.ok, false);
  assert.ok(
    failingCheck.errors.some((e) => /activity A2 \(evaluate\): MISSING_REQUIRED_GROUP group=evaluative_core/.test(e)),
    JSON.stringify(failingCheck.errors)
  );

  // Expressing the defended judgement as evaluative_judgement passes with the exact same 5-beat count
  const passingCheck = practiceEp.validatePracticeEpisodePlanCapture(
    makeBroadbandShell("evaluative_judgement")
  );
  assert.equal(passingCheck.ok, true, JSON.stringify(passingCheck.errors));
});

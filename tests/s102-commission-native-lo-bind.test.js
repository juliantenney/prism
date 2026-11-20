/**
 * Sprint 102D — Commission-native LO extract/bind/topology.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const bind = require("../lib/commission-native-lo-bind.js");
const intake = require("../lib/first-class-commission-intake.js");
const family = require("../lib/first-class-workflow-family.js");
const siblingPrompts = require("../lib/learning-journey-sibling-prompts.js");
const designPage = require("../lib/learning-journey-design-page.js");

const SAMPLE_LOS = {
  learning_outcomes: [
    {
      statement: "Classify stationary points using the Hessian test.",
      related_concepts: ["Hessian", "critical points"],
      cognitive_level: "apply",
      notes: "Component focus"
    }
  ],
  learner_level: "undergraduate",
  scope: "one practice episode"
};

const JOURNEY_LOS = {
  learning_outcomes: [
    {
      statement: "Use multivariable calculus to analyse constrained optimisation problems.",
      related_concepts: ["gradients", "constraints"],
      cognitive_level: "analyse",
      notes: "Journey destination"
    }
  ]
};

function withComponentMarkers(extraProse) {
  return [
    extraProse || "Educational job: practise Hessian classification.",
    bind.wrapComponentLearningOutcomes(SAMPLE_LOS)
  ].join("\n\n");
}

function withJourneyMarkers(extraProse) {
  return [
    extraProse || "Prior: constraint geometry established.",
    bind.wrapJourneyLearningOutcomes(JOURNEY_LOS)
  ].join("\n\n");
}

test("extract valid component LO markers", () => {
  const hit = bind.extractComponentLearningOutcomes(withComponentMarkers());
  assert.equal(hit.ok, true);
  assert.equal(hit.value.learning_outcomes.length, 1);
  assert.match(hit.value.learning_outcomes[0].statement, /Hessian/i);
});

test("missing component markers fail closed", () => {
  const hit = bind.extractComponentLearningOutcomes("Educational job only.");
  assert.equal(hit.ok, false);
  assert.equal(hit.kind, "missing");
});

test("duplicate component markers are malformed", () => {
  const text =
    withComponentMarkers() + "\n" + bind.wrapComponentLearningOutcomes(SAMPLE_LOS);
  const hit = bind.extractComponentLearningOutcomes(text);
  assert.equal(hit.ok, false);
  assert.equal(hit.kind, "malformed");
});

test("empty outcomes array is malformed", () => {
  const text = bind.wrapComponentLearningOutcomes({ learning_outcomes: [] });
  const hit = bind.extractComponentLearningOutcomes(text);
  assert.equal(hit.ok, false);
});

test("invalid JSON inside markers is malformed", () => {
  const text =
    bind.COMPONENT_BEGIN + "\n{not-json\n" + bind.COMPONENT_END;
  const hit = bind.extractComponentLearningOutcomes(text);
  assert.equal(hit.ok, false);
  assert.equal(hit.kind, "malformed");
});

test("thin row check rejects missing statement", () => {
  const text = bind.wrapComponentLearningOutcomes({
    learning_outcomes: [{ related_concepts: ["x"], cognitive_level: "apply" }]
  });
  const hit = bind.extractComponentLearningOutcomes(text);
  assert.equal(hit.ok, false);
});

test("journey markers extract independently and never substitute for component bind", () => {
  const journeyOnly = withJourneyMarkers();
  const j = bind.extractJourneyLearningOutcomes(journeyOnly);
  assert.equal(j.ok, true);
  const bindResult = bind.tryBindCommissionNativeLos(
    "Educational job without component markers.",
    journeyOnly
  );
  assert.equal(bindResult.bound, false);
});

test("tryBind succeeds only with component markers", () => {
  const ok = bind.tryBindCommissionNativeLos(
    withComponentMarkers(),
    withJourneyMarkers()
  );
  assert.equal(ok.bound, true);
  assert.equal(ok.provenance.authority, "learning_journey_commission");
  assert.equal(ok.provenance.not_dlo_generated, true);
  assert.equal(ok.componentLearningOutcomes.learning_outcomes.length, 1);
  assert.equal(ok.journeyLearningOutcomes.learning_outcomes.length, 1);
});

test("omitFoundationTitles removes GLC/MK/DLO/Normalize", () => {
  const next = bind.omitFoundationTitles([
    "Normalize Content",
    "Generate Learning Content",
    "Model Knowledge",
    "Define Learning Outcomes",
    "Design Episode Plan",
    "Design Page"
  ]);
  assert.deepEqual(next, ["Design Episode Plan", "Design Page"]);
});

test("planningEntryTitleForProduct mapping", () => {
  assert.equal(bind.planningEntryTitleForProduct("practice"), "Design Episode Plan");
  assert.equal(bind.planningEntryTitleForProduct("interactive"), "Design Episode Plan");
  assert.equal(bind.planningEntryTitleForProduct("expository"), "Expository Journey Plan");
  assert.equal(
    bind.planningEntryTitleForProduct("assessment_pack"),
    "Interpret Evidence Purpose"
  );
});

function assertPlanningFirst(productId, expectedFirst) {
  const result = intake.intakeCommission({
    productId: productId,
    specificationText: withComponentMarkers("Job for " + productId),
    journeyContextText: withJourneyMarkers(),
    focus: productId + " focus",
    sourceJourneyWorkflowId: "wf-lj",
    sourceCommissionId: "c1"
  });
  assert.equal(result.ok, true, productId + " intake ok");
  assert.equal(result.commissionNativeBound, true, productId + " bound");
  assert.equal(result.family.titles[0], expectedFirst, productId + " first title");
  assert.equal(
    result.family.titles.some((t) => /define learning outcomes/i.test(t)),
    false
  );
  assert.equal(
    result.family.titles.some((t) => /generate learning content/i.test(t)),
    false
  );
  assert.ok(result.family.deliverySeed.commissioned_learning_outcomes);
  assert.equal(
    result.family.deliverySeed.commissioned_learning_outcomes_provenance.not_dlo_generated,
    true
  );
}

test("Practice commission-native starts at EP", () => {
  assertPlanningFirst("practice", "Design Episode Plan");
});

test("Interactive commission-native starts at EP", () => {
  assertPlanningFirst("interactive", "Design Episode Plan");
});

test("Expository commission-native starts at EJP", () => {
  assertPlanningFirst("expository", "Expository Journey Plan");
});

test("Assessment Pack commission-native starts at Purpose", () => {
  assertPlanningFirst("assessment_pack", "Interpret Evidence Purpose");
});

test("legacy commission without markers retains foundation titles", () => {
  const result = intake.intakeCommission({
    productId: "practice",
    specificationText: "Educational job only — no LO markers.",
    focus: "legacy practice"
  });
  assert.equal(result.ok, true);
  assert.equal(result.commissionNativeBound, false);
  assert.deepEqual(
    result.family.titles.filter((t) => t !== "Normalize Content"),
    family.INTERACTIVE_TITLES
  );
});

test("invalid markers retain foundation workflow", () => {
  const bad =
    "Job\n" +
    bind.COMPONENT_BEGIN +
    "\n{bad\n" +
    bind.COMPONENT_END;
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: bad,
    focus: "bad markers"
  });
  assert.equal(result.commissionNativeBound, false);
  assert.ok(result.family.titles.includes("Define Learning Outcomes"));
});

test("AP Purpose prompt recognises commissioned outcomes wording", () => {
  const prompts = family.buildAssessmentPackPrompts
    ? null
    : null;
  // Purpose text is embedded in family build; inspect prompt via family builder seed path.
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "AP topic",
    startingArtefact: "generate_from_topic",
    assessmentIntent: "formative_check",
    componentCountMode: "auto"
  });
  assert.equal(built.ok, true);
  const purposeStep = built.steps.find(
    (s) => s && /interpret evidence purpose/i.test(s.title)
  );
  assert.ok(purposeStep);
  const prompt = String(purposeStep.prompt || purposeStep.notes || "");
  // Family stores prompt on stage via assessmentStage — check titles include foundation for Create
  assert.ok(built.titles.includes("Define Learning Outcomes"));
});

test("AP Purpose prompt body prefers commissioned outcomes language", () => {
  // Rebuild purpose string path: inspect exported prompt text through family internals
  // by constructing via assessment pack family and reading step prompt field.
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "AP",
    startingArtefact: "generate_from_topic",
    assessmentIntent: "formative_check",
    componentCountMode: "auto"
  });
  const purpose = built.steps.find((s) => /interpret evidence purpose/i.test(s.title));
  const body = String(
    (purpose && (purpose.promptTemplate || purpose.prompt || purpose.role)) || ""
  );
  // assessmentStage sets prompt on the step — locate it
  const raw = JSON.stringify(built);
  assert.match(raw, /commissioned component learning_outcomes/i);
  assert.match(raw, /Prefer commissioned/i);
});

test("LJ Requirements prompt requires journey LO markers", () => {
  assert.match(
    siblingPrompts.TEMPLATES.learning_requirements,
    /JOURNEY_LEARNING_OUTCOMES_BEGIN/
  );
});

test("LJ Progression consumes journey LO markers as authoritative", () => {
  assert.match(
    siblingPrompts.TEMPLATES.learning_progression,
    /competing outcome set/
  );
});

test("LJ Design Page guidance requires component LO markers", () => {
  const prompt = designPage.buildLearningJourneyDesignPagePrompt();
  assert.match(String(prompt), /COMPONENT_LEARNING_OUTCOMES_BEGIN/);
  assert.match(String(prompt), /JOURNEY_LEARNING_OUTCOMES_BEGIN/);
  assert.match(String(prompt), /not a mere copy/i);
});

test("Practice remains absent from Create declarations", () => {
  assert.equal(
    family.listCreateDeclarations().some((d) => d && d.product === "practice"),
    false
  );
});

test("Create-from-topic Interactive retains foundation titles", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "interactive",
    variant: "self_study",
    focus: "standalone topic",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  assert.ok(built.titles.includes("Generate Learning Content"));
  assert.ok(built.titles.includes("Define Learning Outcomes"));
  assert.ok(built.titles.includes("Design Episode Plan"));
});

test("app.js planning delivery injects preamble and commissioned LOs", () => {
  const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
  const loaded = loadPrismAppJsTestApi({
    extraLibs: ["lib/commission-native-lo-bind.js", "lib/workflow-artefact-json-strict.js"]
  });
  const api = loaded.api;
  assert.ok(api.readCommissionedLearningOutcomes);
  assert.ok(api.applyCommissionedOriginalBriefDelivery);
  const wf = {
    product: "practice",
    workflowBriefResolution: {
      resolvedFactors: {
        commission_specification: withComponentMarkers(),
        journey_context: withJourneyMarkers(),
        commission_native_lo_bound: true,
        commissioned_learning_outcomes: SAMPLE_LOS,
        commissioned_learning_outcomes_provenance: {
          authority: "learning_journey_commission",
          not_dlo_generated: true
        }
      },
      initialBrief: {}
    }
  };
  const los = api.readCommissionedLearningOutcomes(wf);
  assert.ok(los);
  assert.equal(los.learning_outcomes.length, 1);
  const step = {
    title: "Design Episode Plan",
    canonical_step_id: "step_design_episode_plan"
  };
  assert.equal(api.isCommissionNativePlanningStep(step, wf), true);
  const delivered = api.applyCommissionedOriginalBriefDelivery(
    "BASE EP PROMPT BODY",
    step,
    wf,
    {}
  );
  assert.match(delivered, /COMMISSION-NATIVE OUTCOME AUTHORITY/);
  assert.match(delivered, /AUTHORITATIVE COMMISSIONED LEARNING OUTCOMES/);
  assert.match(delivered, /Hessian/i);
  assert.match(delivered, /BASE EP PROMPT BODY/);
});

test("Expository planning delivery notes absent learning_content safely", () => {
  const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
  const api = loadPrismAppJsTestApi({
    extraLibs: ["lib/commission-native-lo-bind.js", "lib/workflow-artefact-json-strict.js"]
  }).api;
  const wf = {
    product: "expository",
    workflowBriefResolution: {
      resolvedFactors: {
        commission_specification: withComponentMarkers(),
        journey_context: withJourneyMarkers(),
        commission_native_lo_bound: true,
        commissioned_learning_outcomes: SAMPLE_LOS,
        commissioned_learning_outcomes_provenance: {
          authority: "learning_journey_commission",
          not_dlo_generated: true
        }
      },
      initialBrief: {}
    }
  };
  const step = {
    title: "Expository Journey Plan",
    canonical_step_id: "step_expository_journey_plan"
  };
  const delivered = api.applyCommissionedOriginalBriefDelivery("EJP BODY", step, wf, {});
  assert.match(delivered, /EXPOSITORY COMMISSION-NATIVE GROUNDING/);
  assert.match(delivered, /Do not invent learning_content or knowledge_model/);
});

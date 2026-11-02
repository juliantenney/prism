/**
 * Sprint 92 Gate 8 — Learning Journey educational handoffs in Situated synthesis.
 *
 * Commissioned Situated Task may depend on prior constituent learner work when
 * the LJ commission declares that dependency. Standalone must establish its own
 * required inputs. No runtime learner-state transport.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const intake = require("../lib/first-class-commission-intake.js");
const design = require("../lib/situated-task-design-page.js");
const sibling = require("../lib/situated-task-sibling-prompts.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const SPEC_C7 =
  "Learners should conduct the investigation designed previously in the prior experience.";
const JOURNEY_C7 =
  "The investigation question and plan come directly from c6.";
const DEPS_C7 = "Requires c6. The resulting question and investigation plan from c6 are required by c7.";

test("commission intake preserves specification, journey context, and dependencies on deliverySeed", () => {
  const result = intake.intakeCommission({
    productId: "situated_task",
    specificationText: SPEC_C7,
    journeyContextText: JOURNEY_C7,
    dependencies: DEPS_C7,
    sourceJourneyWorkflowId: "wf-lj",
    sourceCommissionId: "c7",
    focus: "Workplace Investigation"
  });
  assert.equal(result.ok, true, result.code || "");
  assert.equal(result.family.deliverySeed.commission_specification, SPEC_C7);
  assert.equal(result.family.deliverySeed.journey_context, JOURNEY_C7);
  assert.equal(result.family.deliverySeed.commission_dependencies, DEPS_C7);
});

test("composeSituatedTaskOriginalBrief surfaces commission handoff into ORIGINAL_BRIEF", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/situated-task-design-page.js",
      "lib/situated-task-sibling-prompts.js",
      "lib/first-class-commission-intake.js"
    ]
  });
  assert.equal(typeof api.composeSituatedTaskOriginalBrief, "function");

  const standaloneWf = {
    product: "situated_task",
    workflowBriefResolution: {
      resolvedFactors: {
        topic: "Observe a practice",
        original_brief: "PURPOSE / FOCUS\nObserve a practice"
      }
    }
  };
  const standaloneBrief = api.composeSituatedTaskOriginalBrief(standaloneWf);
  assert.match(standaloneBrief, /Observe a practice/);
  assert.doesNotMatch(standaloneBrief, /COMMISSION SPECIFICATION/);
  assert.doesNotMatch(standaloneBrief, /EDUCATIONAL DEPENDENCIES/);

  const commissionedWf = {
    product: "situated_task",
    workflowBriefResolution: {
      resolvedFactors: {
        topic: "Workplace Investigation",
        original_brief: "PURPOSE / FOCUS\nWorkplace Investigation",
        commission_specification: SPEC_C7,
        journey_context: JOURNEY_C7,
        commission_dependencies: DEPS_C7
      }
    }
  };
  const commissionedBrief = api.composeSituatedTaskOriginalBrief(commissionedWf);
  assert.match(commissionedBrief, /COMMISSION SPECIFICATION/);
  assert.match(commissionedBrief, /conduct the investigation designed previously/i);
  assert.match(commissionedBrief, /LEARNING JOURNEY CONTEXT/);
  assert.match(commissionedBrief, /come directly from c6/i);
  assert.match(commissionedBrief, /EDUCATIONAL DEPENDENCIES/);
  assert.match(commissionedBrief, /Requires c6/);
  assert.match(commissionedBrief, /does not transfer the learner's prior responses/i);
  // Must not leave commission context hidden behind bare original_brief.
  assert.notEqual(commissionedBrief, commissionedWf.workflowBriefResolution.resolvedFactors.original_brief);
});

test("Stage 5 / Situation / Activity prompts: standalone vs commissioned handoff contract", () => {
  const stage5 = design.buildSituatedTaskDesignPagePrompt();
  assert.match(stage5, /ENACTABILITY \(mandatory — standalone vs commissioned handoff\)/);
  assert.match(stage5, /created standalone must establish everything required/i);
  assert.match(stage5, /explicit educational dependency on a prior constituent/i);
  assert.match(stage5, /honour it/i);
  assert.match(stage5, /do NOT recreate, replace, or independently determine/i);
  assert.match(stage5, /no automatic learner-state transfer/i);
  assert.match(stage5, /dependency graph/i);
  assert.match(stage5, /still state concretely what the learner now DOES/i);
  assert.match(stage5, /required prior artefact to bring forward/i);
  // Still forbid vague authoring-chat ellipticals as the whole undertaking.
  assert.match(stage5, /undertake the previously designed investigation/i);

  const copy = design.buildSituatedTaskDesignPageCopyInstructions();
  assert.match(copy, /Standalone: establish all required task inputs/i);
  assert.match(copy, /honour that educational handoff/i);
  assert.match(copy, /No automatic learner-state transfer/i);

  const situation = sibling.resolveTemplate("situation");
  assert.match(situation, /EDUCATIONAL HANDOFFS/i);
  assert.match(situation, /Do not absorb or redo learning work/i);
  assert.match(situation, /no automatic learner-state transfer/i);
  assert.match(situation, /standalone creation/i);

  const activity = sibling.resolveTemplate("activity");
  assert.match(activity, /EXPLICIT PRIOR-EXPERIENCE HANDOFF/i);
  assert.match(activity, /carrying out \/ using that prior work/i);
  assert.match(activity, /Do not invent runtime transfer/i);
});

test("no learner-state transport implied in Situated / intake modules", () => {
  const stage5 = design.buildSituatedTaskDesignPagePrompt();
  assert.match(stage5, /no automatic learner-state transfer/i);
  assert.match(stage5, /cross-product response transport/i);
  assert.doesNotMatch(stage5, /learner-state transfer is provided|transfers prior responses automatically/i);
  // Forbidden persistence mentions remain forbidden fields — not a transport feature.
  assert.match(stage5, /persistence \/ storage \/ localStorage/);

  const intakeSrc = fs.readFileSync(
    path.join(__dirname, "..", "lib/first-class-commission-intake.js"),
    "utf8"
  );
  assert.match(intakeSrc, /commission_dependencies/);
  assert.doesNotMatch(intakeSrc, /learnerResponseTransfer|priorResponsePayload|crossProductState/i);
});

test("live resolveStepPromptText materialises commission handoff into Situation ORIGINAL_BRIEF", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/situated-task-design-page.js",
      "lib/situated-task-sibling-prompts.js",
      "lib/first-class-commission-intake.js"
    ]
  });
  const result = intake.intakeCommission({
    productId: "situated_task",
    specificationText: SPEC_C7,
    journeyContextText: JOURNEY_C7,
    dependencies: DEPS_C7,
    sourceJourneyWorkflowId: "wf-lj",
    sourceCommissionId: "c7",
    focus: "Workplace Investigation"
  });
  assert.equal(result.ok, true);
  const wf = {
    id: "wf-c7-sit",
    product: "situated_task",
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c7",
    steps: result.family.steps.map((s, i) => Object.assign({}, s, { id: "s" + i })),
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, result.family.deliverySeed, {
        topic: "Workplace Investigation"
      }),
      initialBrief: {
        topic: "Workplace Investigation",
        commissionSpecification: SPEC_C7,
        journeyContextText: JOURNEY_C7,
        dependencies: DEPS_C7
      }
    }
  };
  const situationStep = wf.steps.find((s) => s.title === "Situation");
  const designStep = wf.steps.find((s) => s.title === "Design Page");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const situationResolved = api.resolveStepPromptText(situationStep, wf);
  assert.ok(situationResolved && situationResolved.text);
  assert.match(situationResolved.text, /COMMISSION SPECIFICATION/);
  assert.match(situationResolved.text, /EDUCATIONAL DEPENDENCIES/);
  assert.match(situationResolved.text, /Requires c6/);

  const designResolved = api.resolveStepPromptText(designStep, wf);
  assert.ok(designResolved && designResolved.text);
  assert.match(designResolved.text, /standalone vs commissioned handoff/i);
  assert.match(designResolved.text, /honour it/i);
  assert.doesNotMatch(designResolved.text, /learner-state transfer is provided/i);
});

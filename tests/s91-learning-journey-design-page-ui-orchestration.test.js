/**
 * Sprint 91 WP3 — behavioural Run orchestration + shared renderer path.
 *
 * Learning Journey Step 5 is same-chat GPT constrained synthesis, not local assembly.
 * Accepted output is an ordinary shared page rendered via renderLearnerPageHtml.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const family = require("../lib/first-class-workflow-family.js");
const design = require("../lib/learning-journey-design-page.js");
const renderer = require("../lib/learner-renderer-vnext");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function buildFreshLearningJourneyWorkflow() {
  const built = family.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "Online credibility judgements",
    learningTime: "90 minutes",
    duration: "1 day",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  const steps = built.steps.map((step, index) =>
    Object.assign({}, step, {
      id: "lj-ui-" + (index + 1),
      override_prompt_body: "",
      prompt_source_type: "none"
    })
  );
  return {
    id: "wf-lj-ui-orchestration",
    product: "learning_journey",
    name: "Online credibility Learning Journey",
    steps: steps,
    workflowBriefResolution: {
      resolvedFactors: built.deliverySeed || { topic: "Online credibility judgements" }
    }
  };
}

test("fresh Learning Journey Step 5 exposes LJ-specific Copy/model path (not local assembly)", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-sibling-prompts.js"
    ]
  });
  assert.equal(typeof api.orchestrateLearningJourneyDesignPageRunStage, "function");

  const wf = buildFreshLearningJourneyWorkflow();
  assert.deepEqual(
    wf.steps.map((s) => s.outputName),
    [
      "learning_requirements",
      "learning_progression",
      "learning_elements",
      "learning_commissions",
      "learning_journey_page"
    ]
  );
  const designStep = wf.steps.find((s) => s.title === "Design Page");
  assert.ok(designStep);

  const orch = api.orchestrateLearningJourneyDesignPageRunStage({
    workflow: wf,
    step: designStep
  });

  assert.equal(orch.ok, true);
  assert.equal(orch.executionMode, "model_copy_paste");
  assert.equal(orch.requiresModel, true);
  assert.equal(orch.callsModel, true);
  assert.equal(orch.usedModelPasteContract, true);
  assert.equal(orch.localAssemblerInvoked, false);
  assert.equal(orch.promptUsesLearningJourneyContract, true);
  assert.equal(orch.forbidsInteractiveContract, true);
  assert.equal(orch.includesInteractivePageSynthesisContract, false);
  assert.match(orch.promptText, /ONE continuous chat/i);
  assert.match(orch.promptText, /artifact_type": "page"/);
  assert.match(orch.promptText, /product_id": "learning_journey"/);
  assert.match(orch.promptText, /commissions\[\]/);
  assert.match(orch.promptText, /calls_model": true/);
  assert.doesNotMatch(orch.promptText, /Sprint 58 Design Page partial output mode/);
  assert.doesNotMatch(orch.instructionsText, /Sprint 58 Design Page partial output mode/);

  assert.equal(typeof api.maybeAutoPopulateLearningJourneyDesignPageRunCapture, "undefined");

  const accepted = design.buildLearningJourneyDesignPageFixture({
    title: "Learning Journey: Online credibility judgements"
  });
  assert.equal(accepted.ok, true);
  const fromCapture = api.readAcceptedLearningJourneyPageFromWorkflow(
    {
      product: "learning_journey",
      steps: [
        {
          id: "dp",
          title: "Design Page",
          canonical_step_id: "step_design_page",
          outputName: "learning_journey_page"
        }
      ]
    },
    {
      captures: { dp: JSON.stringify(accepted.page) },
      capturesRaw: { dp: JSON.stringify(accepted.page) }
    }
  );
  assert.equal(fromCapture.ok, true);
  assert.equal(fromCapture.page.artifact_type, "page");
  assert.equal(fromCapture.page.product_id, "learning_journey");
  assert.equal(design.validateLearningJourneyDesignPage(fromCapture.page).ok, true);

  const html = renderer.renderLearnerPageHtml(fromCapture.page, {
    compositionMode: "moments"
  });
  assert.equal(html.error, null);
  assert.match(html.html, /util-exposition-sections/);
  assert.match(html.html, /Workplace credibility walkthrough/);
  assert.doesNotMatch(html.html, /lj-design-page/);
});

test("Interactive Design Page orchestration remains model/copy-paste without LJ contract", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-sibling-prompts.js"
    ]
  });
  const interactive = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(interactive.ok, true);
  const steps = interactive.steps.map((step, index) =>
    Object.assign({}, step, { id: "int-ui-" + (index + 1) })
  );
  const wf = {
    id: "wf-interactive-ui",
    product: "interactive",
    name: "Bayes Interactive",
    steps: steps,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true }
  };
  const designStep = wf.steps.find((s) => s.title === "Design Page");
  assert.ok(designStep);

  const orch = api.orchestrateLearningJourneyDesignPageRunStage({
    workflow: wf,
    step: designStep
  });
  assert.equal(orch.ok, true);
  assert.equal(orch.executionMode, "model_copy_paste");
  assert.equal(orch.requiresModel, true);
  assert.equal(orch.usedModelPasteContract, true);
  assert.equal(orch.localAssemblerInvoked, false);
  assert.equal(orch.promptUsesLearningJourneyContract, false);
});

test("clearLearningJourneyDesignPageModelPromptSeed removes Interactive Design Page seed", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/learning-journey-design-page.js"]
  });
  const wf = buildFreshLearningJourneyWorkflow();
  const step = wf.steps.find((s) => s.title === "Design Page");
  step.override_prompt_body =
    "Sprint 58 Design Page partial output mode: return a partial page artefact containing title, page_synthesis";
  step.prompt_source_type = "local_override";
  api.clearLearningJourneyDesignPageModelPromptSeed(wf);
  assert.equal(String(step.override_prompt_body || ""), "");
  assert.equal(String(step.prompt_source_type || ""), "none");
});

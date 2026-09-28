/**
 * Sprint 88 — Assessment Pack publishing slice.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const family = require("../lib/first-class-workflow-family.js");
const publish = require("../lib/assessment-pack-publish.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");

const ANSWER = "The posterior is the largest bar";

function pack() {
  return {
    artifact_type: "assessment_pack",
    learning_outcomes: [{ id: "LO1", statement: "Read a simple frequency chart." }],
    evidence_plan_ref: { principal_purpose: "formative", diagnostic_intent: false, planned_component_count: 2 },
    components: [
      {
        id: "c-text",
        form: "short_constructed_response",
        prompt: { stem: "In one sentence, say what a prior is." },
        judgement: {
          auto_checkable: false,
          acceptable_answer_guidance: "Mentions belief before the new evidence.",
          model_answer: "A prior is the belief before seeing the evidence."
        },
        feedback_note: "Keep this hidden until a later review.",
        representation: null
      },
      {
        id: "c-figure",
        form: "single_answer_mcq",
        prompt: {
          stem: "Which group is larger?",
          options: ["Group A", "Group B"]
        },
        judgement: { auto_checkable: true, correct_answer: "Group B" },
        feedback_note: "Group B has the taller bar.",
        representation: {
          required: true,
          kind: "data_figure",
          must_represent: "Two group sizes",
          authoritative_data: {
            unit: "people",
            points: [
              { label: "Group A", value: 20 },
              { label: "Group B", value: 80 }
            ]
          },
          learner_purpose: "The learner must compare the bars.",
          must_not_show: [ANSWER],
          alt_text: "Group A has 20 people. Group B has 80 people."
        }
      }
    ]
  };
}

function design() {
  return {
    artifact_type: "assessment_design_page",
    title: "A short check on group size",
    attempt_instructions: "Answer both parts.",
    framing: "Formative check."
  };
}

test("Assessment workflow ends at Design Page and that prompt consumes the pack", () => {
  const built = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Group size",
    startingPoint: "topic",
    componentCount: 2
  });
  assert.equal(built.titles[built.titles.length - 1], "Design Page");
  const designStep = built.steps[built.steps.length - 1];
  assert.match(designStep.promptBody, /assessment_pack artefact is your only semantic input/);
  assert.match(designStep.promptBody, /Do not rewrite prompts/);
  assert.match(designStep.promptBody, /Do not invent a stimulus/);
  const author = built.steps[built.steps.length - 2].promptBody;
  assert.match(author, /representation is null/);
  assert.match(author, /data_figure/);
  assert.match(author, /must_not_show/);
});

test("text and exact-data components publish in order and fail closed", () => {
  const assembled = publish.assembleAssessmentPackPage({ designPage: design(), assessmentPack: pack() });
  assert.equal(assembled.ok, true);
  assert.deepEqual(
    assembled.page.assessment_check.items.map(function (item) {
      return item.id;
    }),
    ["c-text", "c-figure"]
  );
  assert.equal(assembled.page.page_kind, "assessment");
  assert.deepEqual(assembled.page.activities, []);
  const textItem = assembled.page.assessment_check.items[0];
  const figureItem = assembled.page.assessment_check.items[1];
  assert.equal(textItem.stem, "In one sentence, say what a prior is.");
  assert.equal(textItem.feedback_note, "Keep this hidden until a later review.");
  assert.equal(textItem.judgement.acceptable_answer_guidance, "Mentions belief before the new evidence.");
  assert.equal(textItem.representation, null);
  assert.equal(figureItem.stem, "Which group is larger?");
  assert.deepEqual(figureItem.options, ["Group A", "Group B"]);
  assert.equal(figureItem.correct_answer, "Group B");
  assert.equal(figureItem.feedback_note, "Group B has the taller bar.");
  assert.deepEqual(figureItem.representation.authoritative_data, {
    unit: "people",
    points: [
      { label: "Group A", value: 20 },
      { label: "Group B", value: 80 }
    ]
  });
  assert.equal(JSON.stringify(figureItem.representation).indexOf(ANSWER), -1);
  assert.equal(JSON.stringify(assembled.page).indexOf("knowledge_summary"), -1);
  assert.equal(JSON.stringify(assembled.page).indexOf("visual_affordances"), -1);
  const asset = assembled.assets[0];
  assert.equal(asset.component_id, "c-figure");
  assert.match(asset.media.markup, /Group A/);
  assert.match(asset.media.markup, /80/);
  assert.equal(asset.media.markup.indexOf(ANSWER), -1);
  assert.equal(asset.alt_text.indexOf(ANSWER), -1);
  assert.equal(JSON.stringify(asset).indexOf("correct_answer"), -1);

  const spoiled = pack();
  spoiled.components[1].representation.alt_text = ANSWER;
  const failed = publish.assembleAssessmentPackPage({ designPage: design(), assessmentPack: spoiled });
  assert.equal(failed.ok, false);
  assert.equal(failed.code, "representation_unrealised");
});

test("renderer shows the figure before the response and keeps short response unchecked", () => {
  const assembled = publish.assembleAssessmentPackPage({ designPage: design(), assessmentPack: pack() });
  const model = buildPageModel(assembled.page);
  assert.equal(model.ok, true);
  assert.equal(model.model.pageKind, "assessment");
  assert.equal(model.model.activities.length, 0);
  const html = renderPage(model.model, {});
  assert.match(html, /data-page-kind="assessment"/);
  assert.equal(html.indexOf('data-region="activities"'), -1);
  const figureAt = html.indexOf('data-assessment-stimulus="c-figure"');
  const responseAt = html.indexOf('data-assessment-check');
  assert.ok(figureAt > 0);
  assert.ok(responseAt > figureAt);
  assert.match(html, /data-auto-checkable="false"/);
  assert.equal(html.indexOf("Mentions belief before the new evidence"), -1);
  assert.equal(html.indexOf("A prior is the belief before seeing the evidence"), -1);
  assert.match(html, /data-assessment-result aria-live="polite" hidden/);
  assert.match(html, /Group B has the taller bar/);
});

test("Assemble From Current Workflow Run reads the AAC artefact from the run-step output chain", () => {
  const fs = require("fs");
  const path = require("path");
  const vm = require("vm");
  const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
  const repoRoot = path.resolve(__dirname, "..");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elements = {};
  function createElementStub() {
    return {
      value: "",
      textContent: "",
      classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
      style: {},
      dataset: {},
      children: [],
      setAttribute() {},
      removeAttribute() {},
      addEventListener() {},
      appendChild(child) {
        this.children.push(child);
      },
      querySelector() { return null; },
      querySelectorAll() { return []; }
    };
  }
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: createElementStub,
    getElementById(id) {
      if (!elements[id]) elements[id] = createElementStub();
      return elements[id];
    },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    location: { hash: "", pathname: "/" },
    localStorage: { getItem: () => null, setItem() {} },
    _: sandbox._,
    Utils: { uuid: () => "uuid-fixed", debounce: (fn) => fn }
  };
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.document = documentStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib/assessment-pack-publish.js"), "utf8"),
    sandbox,
    { filename: "lib/assessment-pack-publish.js" }
  );
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  const api = sandbox.window.__PRISM_TEST_API;
  const source = pack();
  const designPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "AssessTest pack",
    attempt_instructions: "Answer both parts.",
    framing: "Formative check.",
    page_synthesis: { knowledge_summary: { body: "POISONED_SUMMARY" } },
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [{ activity_id: "A1" }],
    visual_affordances: [{ subject: "UNCOMMISSIONED_CONCEPT_MAP", region: "knowledge_summary" }],
    assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
  };
  const workflow = {
    id: "assess-test",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    steps: [
      {
        id: "step-aac",
        title: "Generate Assessment Items",
        canonical_step_id: "step_generate_assessment_items",
        outputName: "page"
      },
      {
        id: "step-dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  function stepRow(stepId, outputText) {
    const textarea = { value: outputText };
    return {
      getAttribute(name) {
        return name === "data-step-id" ? stepId : "";
      },
      classList: {
        contains(token) {
          return token === "workflow-step";
        }
      },
      querySelector(selector) {
        return selector === '[data-field="runStepOutput"]' ? textarea : null;
      }
    };
  }
  api.setWorkflowStepElementsForTest([
    stepRow("step-aac", JSON.stringify(source) + "\nSTEP 5 OUTPUT: assessment_pack"),
    stepRow("step-dp", JSON.stringify(designPage))
  ]);
  const captures = {
    "step-dp": JSON.stringify(designPage)
  };
  const page = api.resolvePageForRenderOrAssembly(designPage, workflow, {
    captures: captures,
    capturesRaw: captures
  });
  const published = JSON.stringify(page);
  assert.equal(page.page_kind, "assessment");
  assert.equal(page.title, "AssessTest pack");
  assert.equal(
    page.assessment_check.items
      .map(function (item) {
        return item.id;
      })
      .join(","),
    "c-text,c-figure"
  );
  assert.equal(page.assessment_check.items[0].stem, "In one sentence, say what a prior is.");
  assert.equal(page.assessment_check.items[1].options.join(","), "Group A,Group B");
  assert.equal(page.assessment_check.items[1].correct_answer, "Group B");
  assert.equal(page.assessment_check.items[1].representation.component_id, "c-figure");
  assert.equal(published.indexOf("POISONED_SUMMARY"), -1);
  assert.equal(published.indexOf("UNCOMMISSIONED_CONCEPT_MAP"), -1);
  assert.equal(published.indexOf("38.4"), -1);
  const assessmentDraft = "Keep the Assessment Design Page contract. Do not invent a stimulus.";
  const assessmentPrompt = api.applyWorkflowStepRuntimePromptAugmentations(
    assessmentDraft,
    {
      title: "Design Page",
      canonical_step_id: "step_design_page",
      outputName: "assessment_design_page"
    },
    workflow,
    {}
  );
  assert.equal(assessmentPrompt, assessmentDraft);
  assert.equal(assessmentPrompt.indexOf("knowledge_summary"), -1);
  assert.equal(assessmentPrompt.indexOf("visual_affordances"), -1);
  const interactive = {
    id: "interactive-control",
    product: "interactive",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "step-dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
  api.setWorkflowsForTest([interactive]);
  api.setSelectedWorkflowIdForTest(interactive.id);
  const interactivePrompt = api.applyLdDesignPagePartialContractToDraft(
    "Base interactive prompt.",
    {
      stepTitle: "Design Page",
      stepCanonicalStepId: "step_design_page",
      workflowId: interactive.id
    },
    interactive
  );
  assert.match(interactivePrompt, /knowledge_summary/);
  assert.match(interactivePrompt, /visual_affordances/);
  assert.equal(
    api.isWorkflowStepRunCaptureProducer(
      { title: "Author Assessment Components", outputName: "assessment_pack" },
      workflow
    ),
    true
  );
  assert.equal(
    api.isWorkflowStepRunCaptureProducer(
      { title: "Generate Learning Content", outputName: "learning_content" },
      { product: "interactive" }
    ),
    false
  );
  assert.equal(
    api.isWorkflowStepRunCaptureProducer(
      { title: "Design Page", canonical_step_id: "step_design_page", outputName: "page" },
      interactive
    ),
    true
  );
  assert.equal(
    api.isWorkflowStepRunCaptureProducer(
      { title: "Plan Assessment Evidence", outputName: "evidence_plan" },
      workflow
    ),
    true
  );
  const evidencePlanBody = JSON.stringify({
    artifact_type: "evidence_plan",
    planned_component_count: 6
  });
  const assessmentPackBody = JSON.stringify({
    artifact_type: "assessment_pack",
    components: [{ id: "c1", form: "single_answer_mcq" }]
  });
  const pageBody = JSON.stringify({ artifact_type: "page", schema_version: "2.0.0" });
  assert.equal(
    api.evaluateWorkflowRunStepCaptureForAdvance(
      { title: "Plan Assessment Evidence", outputName: "evidence_plan" },
      evidencePlanBody
    ).ok,
    true
  );
  const shifted = api.evaluateWorkflowRunStepCaptureForAdvance(
    { title: "Author Assessment Components", outputName: "assessment_pack" },
    evidencePlanBody
  );
  assert.equal(shifted.ok, false);
  assert.equal(shifted.code, "capture_step_mismatch");
  assert.equal(shifted.artifactType, "evidence_plan");
  assert.equal(shifted.expected, "assessment_pack");
  assert.equal(
    api.evaluateWorkflowRunStepCaptureForAdvance(
      { title: "Author Assessment Components", outputName: "assessment_pack" },
      assessmentPackBody
    ).ok,
    true
  );
  assert.equal(
    api.evaluateWorkflowRunStepCaptureForAdvance(
      {
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "assessment_design_page"
      },
      pageBody
    ).ok,
    true
  );
  const assessmentDesign = {
    id: "assess-dp-prompt",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [
      {
        id: "step-dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "assessment_design_page",
        prompt_source_type: "local_override",
        override_prompt_body: "Assessment presentation only. Do not invent a stimulus."
      }
    ]
  };
  api.setWorkflowsForTest([assessmentDesign]);
  api.setSelectedWorkflowIdForTest(assessmentDesign.id);
  const assessmentInstructions = api.buildWorkflowStepInstructions(
    assessmentDesign.steps[0],
    5,
    null
  );
  assert.match(assessmentInstructions, /attempt_instructions/);
  assert.match(assessmentInstructions, /optional framing/);
  assert.equal(assessmentInstructions.indexOf("Sprint 58 Design Page partial output mode"), -1);
  assert.equal(assessmentInstructions.indexOf("visual_affordances"), -1);
  assert.equal(assessmentInstructions.indexOf("visual_affordance_schema_version"), -1);
  assert.equal(assessmentInstructions.indexOf("activities_visual_review"), -1);
  assert.equal(assessmentInstructions.indexOf("page_synthesis"), -1);
  assert.equal(assessmentInstructions.indexOf("knowledge_summary_support"), -1);
  const detail = documentStub.getElementById("workflowDetail");
  detail.classList.contains = function (token) {
    return token === "run-mode";
  };
  function editorStep(id, title, outputName) {
    const fields = {
      title: { value: title, hasAttribute() { return false; } },
      outputName: { value: outputName, hasAttribute() { return false; } },
      roleLabel: { value: "", hasAttribute() { return false; } },
      promptId: { value: "", hasAttribute() { return false; } },
      inputKind: { value: "text", hasAttribute() { return false; } },
      notes: { value: "", hasAttribute() { return false; } }
    };
    return {
      __workflowStepId: id,
      getAttribute(name) {
        if (name === "data-step-id") return id;
        if (name === "data-canonical-step-id") return "step_design_page";
        if (name === "data-prompt-source") return "local_override";
        return "";
      },
      setAttribute() {},
      classList: {
        contains(token) {
          return token === "workflow-step";
        }
      },
      querySelector(selector) {
        const match = /data-field="([^"]+)"/.exec(String(selector || ""));
        return match ? fields[match[1]] || null : null;
      }
    };
  }
  api.setWorkflowStepElementsForTest([
    editorStep("step-dp", "Design Page", "assessment_design_page")
  ]);
  api.setWorkflowStepPatternCatalogForTest([
    {
      title: "Design Page",
      canonicalStepId: "step_design_page",
      promptFactory: {
        runnerInstructions: {
          what_this_step_does:
            "Emit Design Page owned wrapper prose as page_synthesis on a partial v2 page artefact.",
          what_to_check:
            "page_synthesis object with knowledge_summary mandatory; visual_affordance_schema_version 38.4 present; activities_visual_review[] present; visual_affordances[] present with authored generate|defer|skip semantics."
        }
      }
    }
  ]);
  const liveCopiedPrompt = api.buildWorkflowStepInstructions(
    assessmentDesign.steps[0],
    5,
    null
  );
  assert.match(liveCopiedPrompt, /attempt_instructions/);
  assert.match(liveCopiedPrompt, /optional framing/);
  assert.equal(liveCopiedPrompt.indexOf("Sprint 58 Design Page partial output mode"), -1);
  assert.equal(liveCopiedPrompt.indexOf("visual_affordances"), -1);
  assert.equal(liveCopiedPrompt.indexOf("visual_affordance_schema_version"), -1);
  assert.equal(liveCopiedPrompt.indexOf("activities_visual_review"), -1);
  assert.equal(liveCopiedPrompt.indexOf("page_synthesis"), -1);
  assert.equal(liveCopiedPrompt.indexOf("knowledge_summary_support"), -1);
  const acceptedDesign = api.validateAssessmentDesignPageCapture({
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "A formative check",
    attempt_instructions: "Answer, then check.",
    framing: "See what is secure.",
    assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
  });
  assert.equal(acceptedDesign.ok, true);
  const leakedDesign = api.validateAssessmentDesignPageCapture({
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "A formative check",
    visual_affordances: [
      {
        visual_slot: "knowledge_summary_support",
        preferred_representation: "concept_map",
        anti_spoiler: true
      }
    ]
  });
  assert.equal(leakedDesign.ok, false);
  assert.match(leakedDesign.errors.join(" "), /visual_affordances are not part of Assessment Design Page/);
  const interactiveInstructions = api.buildWorkflowStepInstructions(
    {
      id: "step-dp",
      title: "Design Page",
      canonical_step_id: "step_design_page",
      outputName: "page",
      prompt_source_type: "local_override",
      override_prompt_body: "Interactive design page."
    },
    5,
    null
  );
  api.setWorkflowsForTest([
    {
      id: "interactive-dp-prompt",
      product: "interactive",
      workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
      steps: [
        {
          id: "step-dp",
          title: "Design Page",
          canonical_step_id: "step_design_page",
          outputName: "page"
        }
      ]
    }
  ]);
  api.setSelectedWorkflowIdForTest("interactive-dp-prompt");
  const interactiveRunPrompt = api.buildWorkflowStepInstructions(
    {
      id: "step-dp",
      title: "Design Page",
      canonical_step_id: "step_design_page",
      outputName: "page",
      prompt_source_type: "local_override",
      override_prompt_body: "Interactive design page."
    },
    5,
    null
  );
  assert.match(interactiveRunPrompt, /visual_affordances/);
  assert.equal(typeof interactiveInstructions, "string");
});

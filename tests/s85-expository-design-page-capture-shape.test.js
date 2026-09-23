/**
 * Sprint 85 — Expository Design Page partial capture (application paste path).
 *
 * Live blocker: paste → syncWorkflowRunCapturedOutputToState rejected the
 * Copilot-shaped Design Page result. Lower-level validator-only tests missed
 * parsePageArtefactCaptureForStorage + partial-step normalize skip.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const sibling = require("../lib/expository-sibling-prompts.js");
const assemble = require("../lib/page-vnext-assemble.js");
const vpc = require("../lib/visual-planning-contract.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function makeS2SectionAffordance(overrides) {
  return Object.assign(
    {
      affordance_id: "va-S2-feedback-01",
      scope: "section",
      section_id: "S2",
      visual_decision: "generate",
      visual_slot: "section-after-content",
      tier: "essential",
      purpose: "mechanism",
      preferred_representation: "process",
      subject: "Integrating feedback-loop diagram",
      context:
        "Visual brief: synthesise the closed feedback loop so learners can see how section moves integrate.",
      evidence_anchors: ["S2.purpose", "S2.synthesis"],
      rationale: "Makes the integrative feedback loop inspectable without inventing activities.",
      reasoning_supported: "Learners integrate prior section moves into one closed loop.",
      learner_stage: "post_reasoning",
      anti_spoiler: false,
      representation_avoid: ["generic_infographic", "topic_hero_image"],
      canonical_discipline_note: "Show only relationships warranted by upstream sections.",
      requires_exact_data_match: false,
      must_show: ["closed feedback loop", "labelled stage nodes"],
      must_not_show: ["activity worksheets", "unsupported causal shortcuts"],
      allowed_claims: ["Earlier sections contribute distinct moves that integrate here."],
      disallowed_claims: ["Claims absent from upstream substance."],
      source_basis: "S2.synthesis",
      caption_intent: "Synthesis feedback loop.",
      alt_text: "Feedback-loop diagram; detailed description follows.",
      detailed_description:
        "A closed process loop links ordered section moves into one integrative cycle.",
      discipline_risk_level: "medium"
    },
    overrides || {}
  );
}

function makeLiveExpositoryDpCapture(overrides) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Feedback loops in adaptive systems",
      page_synthesis: {
        overview: "Thin orientation to the authored journey.",
        learning_purpose: "Help learners integrate the feedback-loop arc.",
        knowledge_summary: "S2 consolidates the loop across prior sections."
      },
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [],
      visual_affordances: [makeS2SectionAffordance()],
      assembly_state: {
        current_stage: "design_page",
        enriched_by: ["design_page"]
      }
    },
    overrides || {}
  );
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  function createElementStub() {
    return {
      value: "",
      textContent: "",
      className: "",
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
      style: {},
      dataset: {},
      children: [],
      appendChild() {},
      removeChild() {},
      setAttribute() {},
      removeAttribute() {},
      getAttribute() { return null; },
      addEventListener() {},
      removeEventListener() {},
      focus() {},
      click() {},
      querySelector(sel) {
        return (this._qs && this._qs[sel]) || null;
      },
      querySelectorAll() {
        return [];
      }
    };
  }
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
    PrismExpositorySiblingPrompts: sibling
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/sprint38-visual-affordances.js",
      "lib/visual-planning-contract.js",
      "lib/expository-sibling-prompts.js",
      "lib/expository-contracts.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, createElementStub };
}

const { api, createElementStub } = loadPrismTestApi();

function makeExpositoryWf(flagOverrides) {
  const step = {
    id: "dp1",
    title: "Design Page",
    canonical_step_id: "step_design_page",
    outputName: "page"
  };
  return {
    id: "wf-expo-dp-shape",
    name: "Create an Expository Resource: feedback",
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY,
    workflowOutputSpec: Object.assign(
      { pageEnrichmentV2: true, partialPageOutputs: true },
      flagOverrides || {}
    ),
    steps: [
      {
        id: "ejp1",
        title: "Expository Journey Plan",
        canonical_step_id: "step_expository_journey_plan",
        outputName: "expository_journey_plan"
      },
      step
    ]
  };
}

function makeLiveCopilotPaste(capture) {
  return (
    "Here is the Design Page output:\n\n```json\n" +
    JSON.stringify(capture, null, 2) +
    "\n```\nSTEP 7 OUTPUT: page\n"
  );
}

function buildRunLi(stepId, paste) {
  const li = createElementStub();
  li.getAttribute = (name) => (name === "data-step-id" ? stepId : null);
  const ta = createElementStub();
  ta.value = paste;
  const outName = createElementStub();
  outName.value = "page";
  const status = createElementStub();
  li._qs = {
    '[data-field="runStepOutput"]': ta,
    '[data-field="outputName"]': outName,
    '[data-role="run-step-output-status"]': status
  };
  return { li, ta, status };
}

/**
 * Exact browser paste: raw JSON, no fences/footer/prose, and NO artifact_type / schema_version.
 * Capture path supplies deterministic pipeline envelope on the authorised Expository DP step.
 */
test("app-path RAW live paste (no artifact_type/schema_version): sync accepts Expository DP partial", () => {
  const fixturePath = path.join(
    repoRoot,
    "tests",
    "fixtures",
    "s85-expository-dp-raw-paste.json"
  );
  const rawPaste = fs.readFileSync(fixturePath, "utf8");
  assert.equal(rawPaste.trim().charAt(0), "{");
  assert.doesNotMatch(rawPaste, /```/);
  assert.doesNotMatch(rawPaste, /STEP\s*\d+\s*OUTPUT/i);

  const parsed = JSON.parse(rawPaste);
  assert.equal(Object.prototype.hasOwnProperty.call(parsed, "artifact_type"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(parsed, "schema_version"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(parsed, "activities"), false);
  assert.ok(parsed.title);
  assert.ok(parsed.page_synthesis);
  assert.equal(parsed.assembly_state.current_stage, "design_page");
  assert.ok(Array.isArray(parsed.visual_affordances));
  assert.equal(parsed.visual_affordances.length, 2);

  const wf = makeExpositoryWf();
  const step = wf.steps[1];
  assert.equal(api.isAuthorisedExpositoryDesignPageCaptureStep(step, wf), true);
  assert.equal(api.isRecognisableExpositoryDesignPagePartialOwnedShape(parsed), true);

  const stamped = api.applyExpositoryDesignPageCaptureEnvelopeIdentity(parsed, step, wf);
  assert.equal(stamped.artifact_type, "page");
  assert.equal(stamped.schema_version, "2.0.0");
  assert.equal(Object.prototype.hasOwnProperty.call(parsed, "artifact_type"), false);

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});

  const { li, status } = buildRunLi(step.id, rawPaste);
  api.syncWorkflowRunCapturedOutputToState(li, { source: "user_input" });
  api.updateRunStepOutputStatus(li);

  const statusText = String(status.textContent || "");
  const strictMsg = String((api.getWorkflowRunStrictJsonValidationForTest() || {})[step.id] || "");
  const pageMsg = String((api.getWorkflowRunPageValidationForTest() || {})[step.id] || "");

  assert.equal(strictMsg, "", `strict validation blocked capture: ${strictMsg}`);
  assert.equal(pageMsg, "", `page storage validation blocked capture: ${pageMsg}`);
  assert.doesNotMatch(statusText, /unrecognized Design Page capture shape/i);
  assert.match(statusText, /Step complete/i);

  const storedRaw = String((api.getWorkflowRunCapturedOutputsRawForTest() || {})[step.id] || "");
  assert.ok(storedRaw.trim(), "expected stored capture");
  const stored = JSON.parse(storedRaw);
  assert.equal(stored.title, parsed.title);
  assert.equal(stored.artifact_type, "page");
  assert.equal(stored.schema_version, "2.0.0");
  assert.ok(!stored.activities || stored.activities.length === 0);
  assert.equal(stored.visual_affordances.length, 2);
  assert.equal(stored.visual_affordances[0].scope, "section");
  assert.equal(stored.visual_affordances[1].section_id, "S6");

  const vaShape = vpc.validateVisualPlanningCaptureShape(stored);
  assert.equal(vaShape.valid, true, JSON.stringify(vaShape.errors, null, 2));
  const partialCheck = api.validateDesignPagePartialPageCapture(stored);
  assert.equal(partialCheck.ok, true, (partialCheck.errors || []).join(" | "));
});

test("envelope stamp: conflicting artifact_type/schema_version are not silently corrected", () => {
  const fixture = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "tests/fixtures/s85-expository-dp-raw-paste.json"), "utf8")
  );
  const wf = makeExpositoryWf();
  const step = wf.steps[1];

  const badArtifact = Object.assign({}, fixture, { artifact_type: "learning_content" });
  const stampedArtifact = api.applyExpositoryDesignPageCaptureEnvelopeIdentity(
    badArtifact,
    step,
    wf
  );
  assert.equal(stampedArtifact.artifact_type, "learning_content");
  assert.equal(Object.prototype.hasOwnProperty.call(stampedArtifact, "schema_version"), false);

  const badSchema = Object.assign({}, fixture, { schema_version: "1.0.0" });
  const stampedSchema = api.applyExpositoryDesignPageCaptureEnvelopeIdentity(badSchema, step, wf);
  assert.equal(stampedSchema.schema_version, "1.0.0");
  assert.equal(Object.prototype.hasOwnProperty.call(stampedSchema, "artifact_type"), false);

  const check = api.validateDesignPageOrPageCapture(badArtifact, wf, step);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /unrecognized Design Page capture shape/i);
});

test("envelope stamp: raw object is not promoted outside authorised Expository DP step", () => {
  const fixture = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "tests/fixtures/s85-expository-dp-raw-paste.json"), "utf8")
  );
  const interactiveWf = {
    id: "wf-interactive-dp",
    name: "Interactive DP",
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [
      {
        id: "ep1",
        title: "Design Episode Plan",
        canonical_step_id: "step_design_episode_plan",
        outputName: "page"
      },
      {
        id: "dp1",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
  const step = interactiveWf.steps[1];
  assert.equal(api.isAuthorisedExpositoryDesignPageCaptureStep(step, interactiveWf), false);
  const stamped = api.applyExpositoryDesignPageCaptureEnvelopeIdentity(
    fixture,
    step,
    interactiveWf
  );
  assert.equal(Object.prototype.hasOwnProperty.call(stamped, "artifact_type"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(stamped, "schema_version"), false);

  api.setWorkflowsForTest([interactiveWf]);
  api.setSelectedWorkflowIdForTest(interactiveWf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  const { li, status } = buildRunLi(step.id, JSON.stringify(fixture, null, 2));
  api.syncWorkflowRunCapturedOutputToState(li, { source: "user_input" });
  api.updateRunStepOutputStatus(li);
  assert.match(String(status.textContent || ""), /validation errors/i);
  assert.doesNotMatch(
    String((api.getWorkflowRunCapturedOutputsRawForTest() || {})[step.id] || ""),
    /"artifact_type"\s*:\s*"page"/
  );
});

test("envelope stamp: malformed non-DP-shaped JSON on Expository DP step fails closed", () => {
  const wf = makeExpositoryWf();
  const step = wf.steps[1];
  const junk = { note: "not a design page", assembly_state: { current_stage: "design_page" } };
  assert.equal(api.isRecognisableExpositoryDesignPagePartialOwnedShape(junk), false);
  const stamped = api.applyExpositoryDesignPageCaptureEnvelopeIdentity(junk, step, wf);
  assert.equal(Object.prototype.hasOwnProperty.call(stamped, "artifact_type"), false);

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  const { li, status } = buildRunLi(step.id, JSON.stringify(junk, null, 2));
  api.syncWorkflowRunCapturedOutputToState(li, { source: "user_input" });
  api.updateRunStepOutputStatus(li);
  assert.match(String(status.textContent || ""), /validation errors/i);
});

test("raw Expository DP paste proceeds through deterministic assembly after envelope stamp", () => {
  const fixture = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "tests/fixtures/s85-expository-dp-raw-paste.json"), "utf8")
  );
  const wf = makeExpositoryWf();
  const step = wf.steps[1];
  const dp = api.applyExpositoryDesignPageCaptureEnvelopeIdentity(fixture, step, wf);
  assert.equal(dp.artifact_type, "page");
  assert.equal(dp.schema_version, "2.0.0");

  const ejp = {
    artifact_type: "expository_journey_plan",
    schema_version: "1.0.0",
    title: "Formative assessment",
    audience: "lecturers",
    journey_intent: "Evidence to action",
    commissioned_purpose: "Explain formative assessment as an evidence-to-action loop.",
    epistemic_form: "practical conceptual model",
    sections: [
      {
        section_id: "S2",
        title: "Evidence",
        purpose: "Evidence",
        knowledge_focus: "evidence",
        conceptual_move: "establish",
        dependencies: [],
        lo_refs: [],
        elaboration_intentions: [],
        representation_needs: [],
        connections: [],
        synthesis: "loop",
        order: 2
      },
      {
        section_id: "S6",
        title: "Synthesis",
        purpose: "Synthesis",
        knowledge_focus: "integrate",
        conceptual_move: "integrate",
        dependencies: ["S2"],
        lo_refs: [],
        elaboration_intentions: [],
        representation_needs: [],
        connections: [],
        synthesis: "integrated",
        order: 6
      }
    ]
  };
  const xd = {
    artifact_type: "expository_development",
    schema_version: "1.0.0",
    sections: [
      {
        section_id: "S2",
        explanation_intent: "Evidence",
        exposition: "Evidence becomes formative through interpretation and use.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: []
      },
      {
        section_id: "S6",
        explanation_intent: "Synthesis",
        exposition: "The loop integrates earlier moves without inventing new stages.",
        invitations_to_think: [],
        continuity_hooks: ["S2"],
        materials_commission: []
      }
    ]
  };
  const xm = {
    artifact_type: "expository_materials",
    schema_version: "1.0.0",
    materials: [
      {
        material_id: "m1",
        commission_id: "c1",
        section_id: "S6",
        kind: "exposition",
        body: "Body."
      }
    ]
  };
  const result = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    expository_materials: xm,
    design_page: dp
  });
  assert.equal(result.ok, true, (result.errors || []).join(" | "));
  assert.equal(result.page.title, fixture.title);
  assert.equal(result.page.visual_affordances.length, 2);
  assert.equal(result.page.visual_affordances[0].scope, "section");
});

test("app-path: prose-wrapped live Expository DP paste syncs via syncWorkflowRunCapturedOutputToState", () => {
  const capture = makeLiveExpositoryDpCapture();
  const wf = makeExpositoryWf();
  const step = wf.steps[1];
  const paste = makeLiveCopilotPaste(capture);

  assert.equal(api.isExpositoryResourceWorkflow(wf), true);
  assert.equal(api.isPartialPageOutputWorkflowEnabled(wf), true);
  assert.equal(api.isPostEpisodePlanPartialOutputStep(step, wf), true);
  assert.equal(api.isExpositoryDesignPagePartialCaptureShape(capture, wf), true);

  // Storage parser must accept Copilot prose+fence+footer (partial DP skips normalize repair).
  const parsedStorage = api.parsePageArtefactCaptureForStorage(paste);
  assert.equal(parsedStorage.ok, true, parsedStorage.message || (parsedStorage.errors || []).join("; "));
  assert.equal(String(parsedStorage.parsed.artifact_type || "").toLowerCase(), "page");
  assert.equal(String(parsedStorage.parsed.schema_version || "").trim(), "2.0.0");
  assert.equal(parsedStorage.parsed.assembly_state.current_stage, "design_page");
  assert.equal(Object.prototype.hasOwnProperty.call(parsedStorage.parsed, "activities"), false);

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});

  const { li, ta, status } = buildRunLi(step.id, paste);
  api.syncWorkflowRunCapturedOutputToState(li, { source: "user_input" });
  api.updateRunStepOutputStatus(li);

  const strictMap = api.getWorkflowRunStrictJsonValidationForTest();
  const pageMap = api.getWorkflowRunPageValidationForTest();
  assert.equal(strictMap[step.id] || "", "", "strict validation must clear");
  assert.equal(pageMap[step.id] || "", "", "page storage validation must clear");
  assert.doesNotMatch(String(status.textContent || ""), /unrecognized Design Page capture shape/i);
  assert.doesNotMatch(String(status.textContent || ""), /fenced ```json block/i);
  assert.match(String(status.textContent || ""), /Step complete/i);

  const storedRaw = String((api.getWorkflowRunCapturedOutputsRawForTest() || {})[step.id] || "");
  const storedObj = JSON.parse(storedRaw);
  assert.equal(storedObj.artifact_type, "page");
  assert.equal(storedObj.schema_version, "2.0.0");
  assert.equal(storedObj.title, capture.title);
  assert.ok(!storedObj.activities || storedObj.activities.length === 0);
  assert.equal(ta.value.trim().charAt(0), "{");

  const strict = api.validateStrictJsonWorkflowRunStepCaptureForTest(storedRaw, step, wf);
  assert.equal(strict.ok, true, (strict.errors || []).join("; "));
});

test("recognised Expository DP still passes section visual-affordance contract", () => {
  const capture = makeLiveExpositoryDpCapture();
  const shape = vpc.validateVisualPlanningCaptureShape(capture);
  assert.equal(shape.valid, true, JSON.stringify(shape.errors, null, 2));
  const check = api.validateDesignPagePartialPageCapture(capture);
  assert.equal(check.ok, true, (check.errors || []).join(" | "));
});

test("malformed Expository partial shapes fail closed (lower-level + app-path)", () => {
  const step = makeExpositoryWf().steps[1];
  const wf = makeExpositoryWf();

  // Lower-level gate without envelope stamp still rejects missing identity.
  const missingIdentity = makeLiveExpositoryDpCapture({
    artifact_type: undefined,
    schema_version: undefined
  });
  delete missingIdentity.artifact_type;
  delete missingIdentity.schema_version;
  const badIdentity = api.validateDesignPageOrPageCapture(missingIdentity, wf, step);
  assert.equal(badIdentity.ok, false);
  assert.match((badIdentity.errors || []).join("; "), /unrecognized Design Page capture shape/i);

  const fakeActivities = makeLiveExpositoryDpCapture({
    activities: [{ activity_id: "A1", title: "Pretend" }]
  });
  assert.equal(api.isExpositoryDesignPagePartialCaptureShape(fakeActivities, wf), false);
  assert.equal(api.isRecognisableExpositoryDesignPagePartialOwnedShape(fakeActivities), false);

  // Non-DP-shaped payload on the authorised step is not stamped and remains fail-closed.
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  const junk = { hello: "world", assembly_state: { current_stage: "design_page" } };
  const { li, status } = buildRunLi(step.id, JSON.stringify(junk, null, 2));
  api.syncWorkflowRunCapturedOutputToState(li, { source: "user_input" });
  api.updateRunStepOutputStatus(li);
  assert.match(String(status.textContent || ""), /validation errors/i);
});

test("Interactive full Design Page still requires activities[] when not partial", () => {
  const interactiveWf = {
    id: "wf-interactive-dp",
    name: "Interactive DP",
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: false },
    steps: [
      {
        id: "ep1",
        title: "Design Episode Plan",
        canonical_step_id: "step_design_episode_plan",
        outputName: "page"
      },
      {
        id: "dp1",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
  const partialLike = makeLiveExpositoryDpCapture();
  const check = api.validateDesignPageOrPageCapture(
    partialLike,
    interactiveWf,
    interactiveWf.steps[1]
  );
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /activities array required/i);
});

test("captured Expository DP proceeds through deterministic assembly", () => {
  const dp = makeLiveExpositoryDpCapture();
  const ejp = {
    artifact_type: "expository_journey_plan",
    schema_version: "1.0.0",
    title: "Feedback loops",
    audience: "learners",
    journey_intent: "Integrate a closed loop.",
    commissioned_purpose: "Explain how feedback loops integrate signal and control.",
    epistemic_form: "mechanism and causal sequence",
    sections: [
      {
        section_id: "S1",
        title: "Signal",
        purpose: "Introduce signal",
        knowledge_focus: "inputs",
        conceptual_move: "establish",
        dependencies: [],
        lo_refs: [],
        elaboration_intentions: [],
        representation_needs: [],
        connections: [],
        synthesis: "signal set",
        order: 1
      },
      {
        section_id: "S2",
        title: "Integrating loop",
        purpose: "Synthesise loop",
        knowledge_focus: "integration",
        conceptual_move: "integrate",
        dependencies: ["S1"],
        lo_refs: [],
        elaboration_intentions: [],
        representation_needs: ["process diagram"],
        connections: [],
        synthesis: "closed loop",
        order: 2
      }
    ]
  };
  const xd = {
    artifact_type: "expository_development",
    schema_version: "1.0.0",
    sections: [
      {
        section_id: "S1",
        explanation_intent: "Set the signal",
        exposition: "A control signal establishes the reference for later comparison.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: []
      },
      {
        section_id: "S2",
        explanation_intent: "Close the loop",
        exposition: "Closing the loop reunites sensing, comparison, and correction.",
        invitations_to_think: [],
        continuity_hooks: ["S1"],
        materials_commission: []
      }
    ]
  };
  const xm = {
    artifact_type: "expository_materials",
    schema_version: "1.0.0",
    materials: [
      {
        material_id: "m1",
        commission_id: "c1",
        section_id: "S2",
        kind: "exposition",
        body: "Loop body."
      }
    ]
  };
  const result = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    expository_materials: xm,
    design_page: dp
  });
  assert.equal(result.ok, true, (result.errors || []).join(" | "));
  const page = result.page;
  assert.ok(page && typeof page === "object");
  assert.equal(page.title, dp.title);
  assert.ok(Array.isArray(page.visual_affordances));
  assert.equal(page.visual_affordances[0].scope, "section");
  assert.equal(page.visual_affordances[0].section_id, "S2");
  assert.ok(!page.activities || page.activities.length === 0);
});

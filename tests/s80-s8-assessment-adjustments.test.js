/**
 * Sprint 80 S8 — Assessment Adjustments v1 (Quantity + Difficulty only).
 *
 * Authorised Option B from accepted T-011 / T-012. Question Type is deferred.
 *
 * Covers:
 *   - capability gate generate_assessment_items (CAI/GAI topology);
 *   - registry declarations + commissioned resolvers;
 *   - pack-facing promptInstructionTemplate projection;
 *   - Auto / adjusted / clear vertical proofs;
 *   - Goal + Additional Instruction precedence;
 *   - persistence; no topology / resolvedFactors / fetch delta;
 *   - Question Type and DA remain out of scope.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const TYPED_HEADING = "Authoritative workflow parameters for this run:";
const AUTHORITATIVE_CLAUSE = "These values are authoritative for this run.";
const EXACTLY_10 = "Generate exactly 10 assessment items.";
const EXACTLY_5 = "Generate exactly 5 assessment items.";
const BALANCED_PROFILE = "Use a Balanced difficulty profile.";
const HIGHER_ORDER_PROFILE = "Use a Higher-order-heavy difficulty profile.";
const FOUNDATIONAL_PROFILE = "Use a Foundational-heavy difficulty profile.";

const COMMISSIONED_GOAL =
  "Create a self-study resource with formative assessment questions on Henry VIII.";
const TOPIC = "Henry VIII";

function createElementStub(tagName) {
  const el = {
    value: "",
    textContent: "",
    className: "",
    placeholder: "",
    type: "",
    min: "",
    max: "",
    step: "",
    rows: 0,
    readOnly: false,
    autocomplete: "",
    tagName: String(tagName || "DIV").toUpperCase(),
    classList: {
      _set: {},
      add(name) {
        el.classList._set[name] = true;
      },
      remove(name) {
        delete el.classList._set[name];
      },
      contains(name) {
        return !!el.classList._set[name];
      },
      toggle() {
        return false;
      }
    },
    style: {},
    dataset: {},
    attributes: {},
    children: [],
    listeners: {},
    appendChild(child) {
      el.children.push(child);
      return child;
    },
    removeChild() {},
    insertBefore(child) {
      el.children.unshift(child);
      return child;
    },
    setAttribute(name, value) {
      el.attributes[name] = String(value);
    },
    removeAttribute(name) {
      delete el.attributes[name];
    },
    hasAttribute(name) {
      return Object.prototype.hasOwnProperty.call(el.attributes, name);
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(el.attributes, name)
        ? el.attributes[name]
        : null;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener(name, fn) {
      el.listeners[name] = el.listeners[name] || [];
      el.listeners[name].push(fn);
    },
    removeEventListener() {},
    focus() {},
    click() {},
    fire(name) {
      (el.listeners[name] || []).forEach((fn) => fn({ target: el }));
    }
  };
  Object.defineProperty(el, "innerHTML", {
    get() {
      return "";
    },
    set() {
      el.children.length = 0;
    }
  });
  return el;
}

function flattenElements(root) {
  const out = [];
  (function walk(node) {
    if (!node) return;
    out.push(node);
    (node.children || []).forEach(walk);
  })(root);
  return out;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const fetchCalls = [];
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: (tag) => createElementStub(tag),
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
    location: { hash: "", pathname: "/" },
    localStorage: { getItem: () => null, setItem() {} },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "uuid-fixed" }
  };
  sandbox.fetch = function (...args) {
    fetchCalls.push(args);
    return Promise.reject(new Error("fetch must not be called"));
  };
  windowStub.fetch = sandbox.fetch;
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, sandbox, fetchCalls, elementStore };
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function caiStep(overrides) {
  return Object.assign(
    {
      id: "gai_step",
      title: "Generate Assessment Items",
      outputName: "page",
      canonical_step_id: "step_generate_assessment_items",
      prompt_source_type: "local_override",
      override_prompt_body: "Generate assessment items for the supplied topic."
    },
    overrides || {}
  );
}

function daStep() {
  return {
    id: "da_step",
    title: "Design Assessment",
    outputName: "assessment_blueprint",
    canonical_step_id: "step_design_assessment",
    prompt_source_type: "local_override",
    override_prompt_body: "Design the assessment blueprint."
  };
}

function mkStep() {
  return {
    id: "mk_step",
    title: "Model Knowledge",
    outputName: "knowledge_model",
    canonical_step_id: "step_model_knowledge",
    prompt_source_type: "local_override",
    override_prompt_body: "Build a knowledge model for the supplied topic."
  };
}

/**
 * Self-study CAI-capable workflow commissioned with 10 items / foundation_heavy.
 */
function buildCaiWorkflow(overrides) {
  const base = {
    id: "wf-s80-s8-cai",
    name: "S8 CAI assessment coverage",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      goal: COMMISSIONED_GOAL,
      desiredOutputs: "A learner-facing page with formative assessment.",
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    workflowBriefResolution: {
      initialBrief: {
        goal: COMMISSIONED_GOAL,
        designIntent: COMMISSIONED_GOAL
      },
      resolvedFactors: {
        topic: TOPIC,
        assessment_required: true,
        assessment_total_items: 10,
        difficulty_profile: "foundation_heavy",
        assessment_type: "mcq",
        delivery_context: "self_directed",
        page_profile: "learner",
        session_materials: ["page"]
      },
      mappedBindings: {
        stepParamPatch: {
          step_generate_assessment_items: {
            number_of_items: "10",
            difficulty_profile: "foundational",
            response_formats: "single_answer_mcq"
          }
        }
      }
    },
    steps: [mkStep(), caiStep()]
  };
  return Object.assign(base, overrides || {});
}

function buildWorkshopCaiWorkflow() {
  const wf = buildCaiWorkflow({
    id: "wf-s80-s8-workshop",
    name: "S8 workshop CAI"
  });
  wf.workflowBriefResolution.resolvedFactors.delivery_context = "facilitated_session";
  wf.workflowBriefResolution.resolvedFactors.design_scope = "session";
  return wf;
}

function buildNonCaiWorkflow() {
  return {
    id: "wf-s80-s8-no-cai",
    name: "S8 no assessment items",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      goal: "Create a self-study page on Henry VIII.",
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    workflowBriefResolution: {
      initialBrief: { goal: "Create a self-study page on Henry VIII." },
      resolvedFactors: {
        topic: TOPIC,
        assessment_required: false,
        delivery_context: "self_directed",
        page_profile: "learner"
      }
    },
    steps: [mkStep()]
  };
}

function buildDaOnlyWorkflow() {
  return {
    id: "wf-s80-s8-da-only",
    name: "S8 DA without CAI",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      goal: "Design an assessment blueprint.",
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    workflowBriefResolution: {
      initialBrief: { goal: "Design an assessment blueprint." },
      resolvedFactors: {
        topic: TOPIC,
        assessment_required: true,
        assessment_total_items: 10,
        difficulty_profile: "balanced"
      }
    },
    steps: [mkStep(), daStep()]
  };
}

function buildDaPlusCaiWorkflow() {
  const wf = buildCaiWorkflow({ id: "wf-s80-s8-da-cai", name: "S8 DA+CAI" });
  wf.steps = [mkStep(), daStep(), caiStep()];
  return wf;
}

function withAdjustments(wf, params) {
  const next = JSON.parse(JSON.stringify(wf));
  next.adjustments = {
    version: 1,
    parameters: Object.assign({}, params)
  };
  return next;
}

function assembleAllSteps(api, wf) {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const prompts = {};
  wf.steps.forEach((step, index) => {
    prompts[step.id] = api.buildWorkflowStepInstructions(step, index + 1, null);
  });
  return prompts;
}

function renderPanel(loaded, wf) {
  const api = loaded.api;
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const root = loaded.elementStore.get("unifiedWorkflowSettingsOptions");
  root.children.length = 0;
  api.renderUnifiedWorkflowSettingsUI();
  return { root, nodes: flattenElements(root) };
}

function adjustmentInputs(nodes) {
  return nodes.filter((n) => n.getAttribute("data-field") === "adjustmentParameter");
}

function adjustmentIds(nodes) {
  return adjustmentInputs(nodes).map((n) => n.getAttribute("data-adjustment-id"));
}

function findDeclaration(api, id) {
  return api.getAdjustmentsParameterRegistry().filter((d) => d.id === id)[0];
}

function topologyFingerprint(wf) {
  return JSON.stringify(
    (wf.steps || []).map((s) => ({
      id: s.id,
      title: s.title,
      canonical_step_id: s.canonical_step_id,
      outputName: s.outputName
    }))
  );
}

// ---------------------------------------------------------------------------
// Registry + capability
// ---------------------------------------------------------------------------

test("S8: Quantity and Difficulty are declared with the authorised contracts", () => {
  const { api } = loadPrismTestApi();
  const count = findDeclaration(api, "assessment_item_count");
  assert.ok(count);
  assert.equal(count.label, "Number of items");
  assert.equal(count.type, "number");
  assert.equal(count.min, 1);
  assert.equal(count.max, 200);
  assert.equal(count.projection, "workflowContext");
  assert.deepEqual(plain(count.applicability), {
    requiresCapability: "generate_assessment_items"
  });
  assert.equal(count.promptInstructionTemplate, "Generate exactly {{value}} assessment items.");
  assert.equal(typeof count.resolveCommissioned, "function");

  const difficulty = findDeclaration(api, "assessment_difficulty_profile");
  assert.ok(difficulty);
  assert.equal(difficulty.label, "Difficulty");
  assert.equal(difficulty.type, "enum");
  assert.deepEqual(plain(difficulty.options), [
    { value: "foundational", label: "Foundational-heavy" },
    { value: "balanced", label: "Balanced" },
    { value: "higher_order", label: "Higher-order-heavy" }
  ]);
  assert.deepEqual(plain(difficulty.applicability), {
    requiresCapability: "generate_assessment_items"
  });
  assert.equal(difficulty.promptInstructionTemplate, "Use a {{label}} difficulty profile.");
  assert.equal(typeof difficulty.resolveCommissioned, "function");
});

test("S8: Question Type is not declared", () => {
  const { api } = loadPrismTestApi();
  const ids = api.getAdjustmentsParameterRegistry().map((d) => d.id);
  assert.ok(!ids.includes("assessment_response_format"));
  assert.ok(!ids.includes("response_formats"));
  const difficulty = findDeclaration(api, "assessment_difficulty_profile");
  const banned = [
    "single_answer_mcq",
    "true_false",
    "short_answer",
    "essay",
    "multiple_answer_mcq",
    "Easy",
    "Moderate",
    "Challenging"
  ];
  banned.forEach((value) => {
    assert.ok(
      !(difficulty.options || []).some((o) => o.value === value || o.label === value),
      value + " must not appear on Difficulty"
    );
  });
});

test("S8: registry validation enforces Quantity 1–200", () => {
  const { api } = loadPrismTestApi();
  const declaration = findDeclaration(api, "assessment_item_count");
  assert.equal(api.validateAdjustmentsParameterValue(declaration, 1).ok, true);
  assert.equal(api.validateAdjustmentsParameterValue(declaration, 200).ok, true);
  assert.equal(api.validateAdjustmentsParameterValue(declaration, 0).ok, false);
  assert.equal(api.validateAdjustmentsParameterValue(declaration, 201).ok, false);
});

test("S8: capability resolver is registered and fail-closed for non-CAI", () => {
  const { api } = loadPrismTestApi();
  const count = findDeclaration(api, "assessment_item_count");
  assert.equal(api.isAdjustmentsParameterApplicable(count, buildCaiWorkflow()), true);
  assert.equal(api.isAdjustmentsParameterApplicable(count, buildNonCaiWorkflow()), false);
  assert.equal(api.isAdjustmentsParameterApplicable(count, buildDaOnlyWorkflow()), false);
  assert.equal(api.isAdjustmentsParameterApplicable(count, buildDaPlusCaiWorkflow()), true);
  assert.equal(api.isAdjustmentsParameterApplicable(count, { id: "bare", steps: [] }), false);
});

test("S8: capability prefers canonical_step_id and still accepts title fallback", () => {
  const { api } = loadPrismTestApi();
  const byId = buildNonCaiWorkflow();
  byId.steps.push({
    id: "gai",
    title: "Something else",
    canonical_step_id: "step_generate_assessment_items"
  });
  assert.equal(
    api.isAdjustmentsParameterApplicable(findDeclaration(api, "assessment_item_count"), byId),
    true
  );

  const byTitle = buildNonCaiWorkflow();
  byTitle.steps.push({
    id: "gai",
    title: "Generate Assessment Items",
    canonical_step_id: ""
  });
  assert.equal(
    api.isAdjustmentsParameterApplicable(findDeclaration(api, "assessment_item_count"), byTitle),
    true
  );
});

// ---------------------------------------------------------------------------
// Commissioned resolvers
// ---------------------------------------------------------------------------

test("S8: commissioned Quantity prefers resolvedFactors.assessment_total_items", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.resolveCommissionedAssessmentItemCount(buildCaiWorkflow()), 10);
});

test("S8: commissioned Quantity falls back to frozen stepParamPatch.number_of_items", () => {
  const { api } = loadPrismTestApi();
  const wf = buildCaiWorkflow();
  delete wf.workflowBriefResolution.resolvedFactors.assessment_total_items;
  wf.workflowBriefResolution.mappedBindings.stepParamPatch.step_generate_assessment_items.number_of_items =
    "14";
  assert.equal(api.resolveCommissionedAssessmentItemCount(wf), 14);
});

test("S8: commissioned Quantity defaults to 10 for CAI when nothing recoverable", () => {
  const { api } = loadPrismTestApi();
  const wf = buildCaiWorkflow();
  delete wf.workflowBriefResolution.resolvedFactors.assessment_total_items;
  delete wf.workflowBriefResolution.mappedBindings;
  assert.equal(api.resolveCommissionedAssessmentItemCount(wf), 10);
});

test("S8: commissioned Quantity ignores Goal prose and selectedOptions", () => {
  const { api } = loadPrismTestApi();
  const wf = buildCaiWorkflow();
  delete wf.workflowBriefResolution.resolvedFactors.assessment_total_items;
  delete wf.workflowBriefResolution.mappedBindings;
  wf.workflowOutputSpec.goal = "Create 20 assessment questions.";
  wf.steps[1].prompt_bindings = {
    selectedOptions: [{ id: "number_of_items", value: "20" }]
  };
  assert.equal(api.resolveCommissionedAssessmentItemCount(wf), 10);
});

test("S8: commissioned Difficulty maps foundation_heavy → foundational", () => {
  const { api } = loadPrismTestApi();
  assert.equal(
    api.resolveCommissionedAssessmentDifficultyProfile(buildCaiWorkflow()),
    "foundational"
  );
  assert.equal(
    api.mapDesignAssessmentDifficultyToItemsDifficultyProfile("foundation_heavy"),
    "foundational"
  );
  assert.equal(
    api.mapDesignAssessmentDifficultyToItemsDifficultyProfile("higher_order_heavy"),
    "higher_order"
  );
});

test("S8: commissioned Difficulty falls back to frozen stepParamPatch then balanced", () => {
  const { api } = loadPrismTestApi();
  const viaPatch = buildCaiWorkflow();
  delete viaPatch.workflowBriefResolution.resolvedFactors.difficulty_profile;
  viaPatch.workflowBriefResolution.mappedBindings.stepParamPatch.step_generate_assessment_items.difficulty_profile =
    "higher_order";
  assert.equal(api.resolveCommissionedAssessmentDifficultyProfile(viaPatch), "higher_order");

  const legacy = buildCaiWorkflow();
  delete legacy.workflowBriefResolution.resolvedFactors.difficulty_profile;
  delete legacy.workflowBriefResolution.mappedBindings;
  assert.equal(api.resolveCommissionedAssessmentDifficultyProfile(legacy), "balanced");
});

test("S8: commissioned Difficulty never invents Easy/Moderate/Challenging", () => {
  const { api } = loadPrismTestApi();
  const wf = buildCaiWorkflow();
  wf.workflowBriefResolution.resolvedFactors.difficulty_profile = "challenging";
  delete wf.workflowBriefResolution.mappedBindings;
  // Unknown alias → mapper returns "" → legacy balanced (no Easy/Moderate/Challenging).
  assert.equal(api.resolveCommissionedAssessmentDifficultyProfile(wf), "balanced");
  assert.equal(api.mapDesignAssessmentDifficultyToItemsDifficultyProfile("challenging"), "");
  assert.equal(api.mapDesignAssessmentDifficultyToItemsDifficultyProfile("easy"), "");
});

// ---------------------------------------------------------------------------
// UI capability proofs
// ---------------------------------------------------------------------------

test("S8: self-study CAI workflow shows Quantity and Difficulty controls", () => {
  const loaded = loadPrismTestApi();
  const { nodes } = renderPanel(loaded, buildCaiWorkflow());
  const ids = adjustmentIds(nodes);
  assert.ok(ids.includes("assessment_item_count"));
  assert.ok(ids.includes("assessment_difficulty_profile"));
  const countInput = adjustmentInputs(nodes).find(
    (n) => n.getAttribute("data-adjustment-id") === "assessment_item_count"
  );
  assert.equal(countInput.value, "");
  assert.match(countInput.placeholder, /Auto — 10/);
  const difficulty = adjustmentInputs(nodes).find(
    (n) => n.getAttribute("data-adjustment-id") === "assessment_difficulty_profile"
  );
  assert.equal(difficulty.tagName, "SELECT");
  assert.equal(difficulty.value, "");
  assert.match(difficulty.children[0].textContent, /Auto — Foundational-heavy/);
});

test("S8: workshop CAI workflow shows assessment controls", () => {
  const loaded = loadPrismTestApi();
  const { nodes } = renderPanel(loaded, buildWorkshopCaiWorkflow());
  const ids = adjustmentIds(nodes);
  assert.ok(ids.includes("assessment_item_count"));
  assert.ok(ids.includes("assessment_difficulty_profile"));
});

test("S8: non-CAI workflow hides assessment controls", () => {
  const loaded = loadPrismTestApi();
  const { nodes } = renderPanel(loaded, buildNonCaiWorkflow());
  const ids = adjustmentIds(nodes);
  assert.ok(!ids.includes("assessment_item_count"));
  assert.ok(!ids.includes("assessment_difficulty_profile"));
  assert.deepEqual(plain(ids), ["topic", "goal", "duration_minutes", "audience"]);
});

test("S8: DA-only workflow hides assessment controls; DA+CAI shows them", () => {
  const loaded = loadPrismTestApi();
  const daOnly = renderPanel(loaded, buildDaOnlyWorkflow());
  assert.ok(!adjustmentIds(daOnly.nodes).includes("assessment_item_count"));

  const daCai = renderPanel(loaded, buildDaPlusCaiWorkflow());
  assert.ok(adjustmentIds(daCai.nodes).includes("assessment_item_count"));
  assert.ok(adjustmentIds(daCai.nodes).includes("assessment_difficulty_profile"));
});

// ---------------------------------------------------------------------------
// Projection + Auto / adjust / clear
// ---------------------------------------------------------------------------

test("S8 Run A: Auto projects commissioned Quantity and Difficulty into CAI prompt", () => {
  const { api, fetchCalls } = loadPrismTestApi();
  const wf = buildCaiWorkflow();
  const beforeFactors = JSON.stringify(wf.workflowBriefResolution.resolvedFactors);
  const beforeTopo = topologyFingerprint(wf);
  const prompts = assembleAllSteps(api, wf);
  const cai = prompts.gai_step;
  assert.ok(cai.includes(TYPED_HEADING));
  assert.ok(cai.includes(EXACTLY_10));
  assert.ok(cai.includes(FOUNDATIONAL_PROFILE));
  assert.ok(cai.includes(AUTHORITATIVE_CLAUSE));
  assert.ok(!cai.includes(BALANCED_PROFILE));
  assert.equal(JSON.stringify(wf.workflowBriefResolution.resolvedFactors), beforeFactors);
  assert.equal(topologyFingerprint(wf), beforeTopo);
  assert.equal(fetchCalls.length, 0);
});

test("S8 Run B: adjusted Quantity=5 and Difficulty=higher_order change CAI prompt only", () => {
  const { api, fetchCalls } = loadPrismTestApi();
  const wf = withAdjustments(buildCaiWorkflow(), {
    assessment_item_count: 5,
    assessment_difficulty_profile: "higher_order"
  });
  const beforeFactors = JSON.stringify(wf.workflowBriefResolution.resolvedFactors);
  const beforeTopo = topologyFingerprint(wf);
  const prompts = assembleAllSteps(api, wf);
  const cai = prompts.gai_step;
  assert.ok(cai.includes(EXACTLY_5));
  assert.ok(cai.includes(HIGHER_ORDER_PROFILE));
  assert.ok(!cai.includes(EXACTLY_10));
  assert.ok(!cai.includes(FOUNDATIONAL_PROFILE));
  assert.equal(JSON.stringify(wf.workflowBriefResolution.resolvedFactors), beforeFactors);
  assert.equal(topologyFingerprint(wf), beforeTopo);
  assert.equal(fetchCalls.length, 0);
  assert.ok(!/selectedOptions|PRISM_STEP_PARAMS|\{\{\s*option:/i.test(cai));
});

test("S8 Run C: clearing adjustments restores Run A projection exactly", () => {
  const { api } = loadPrismTestApi();
  const base = buildCaiWorkflow();
  const runA = assembleAllSteps(api, base).gai_step;

  const adjusted = withAdjustments(JSON.parse(JSON.stringify(base)), {
    assessment_item_count: 5,
    assessment_difficulty_profile: "higher_order"
  });
  api.setWorkflowAdjustmentParameterValue(adjusted, "assessment_item_count", "");
  api.setWorkflowAdjustmentParameterValue(adjusted, "assessment_difficulty_profile", "");
  assert.equal(adjusted.adjustments, undefined);

  const runC = assembleAllSteps(api, adjusted).gai_step;
  const extractGov = (text) => {
    const start = text.indexOf(TYPED_HEADING);
    assert.ok(start >= 0);
    const chunk = text.slice(start);
    const end = chunk.indexOf("\n\nWorkflow-wide intent");
    return end >= 0 ? chunk.slice(0, end) : chunk.split("\n\n")[0];
  };
  assert.equal(extractGov(runC), extractGov(runA));
  assert.ok(runC.includes(EXACTLY_10));
  assert.ok(runC.includes(FOUNDATIONAL_PROFILE));
});

test("S8: Quantity projects the pack imperative, not a weak Number of items line", () => {
  const { api } = loadPrismTestApi();
  const lines = api.buildEffectiveWorkflowContextLines(buildCaiWorkflow());
  assert.ok(lines.includes(EXACTLY_10));
  assert.ok(!lines.some((l) => /^Number of items:/.test(l)));
  assert.ok(lines.includes(FOUNDATIONAL_PROFILE));
  assert.ok(!lines.some((l) => /^Difficulty:/.test(l)));
});

test("S8: assessment parameters reach CAI and other projection-eligible steps; not Episode Plan", () => {
  const { api } = loadPrismTestApi();
  const wf = buildCaiWorkflow();
  wf.steps.push({
    id: "ep_step",
    title: "Design Episode Plan",
    outputName: "page",
    canonical_step_id: "step_design_episode_plan"
  });
  const prompts = assembleAllSteps(api, wf);
  assert.ok(prompts.gai_step.includes(EXACTLY_10));
  assert.ok(prompts.mk_step.includes(EXACTLY_10));
  assert.ok(!prompts.ep_step.includes(TYPED_HEADING));
  assert.ok(!prompts.ep_step.includes(EXACTLY_10));
});

// ---------------------------------------------------------------------------
// Precedence
// ---------------------------------------------------------------------------

test("S8: typed Quantity remains authoritative against Goal and CAI Additional Instruction", () => {
  const { api } = loadPrismTestApi();
  const wf = withAdjustments(buildCaiWorkflow(), { assessment_item_count: 10 });
  wf.adjustments.parameters.goal =
    "Create 20 assessment questions.";
  wf.steps[1].additional_instruction = "Only create five questions.";
  const prompts = assembleAllSteps(api, wf);
  const cai = prompts.gai_step;

  const typedAt = cai.indexOf(EXACTLY_10);
  const goalAt = cai.indexOf("Create 20 assessment questions.");
  const aiAt = cai.indexOf("Only create five questions.");
  assert.ok(typedAt >= 0, "typed Quantity must appear");
  assert.ok(goalAt >= 0, "Goal prose may survive verbatim");
  assert.ok(aiAt >= 0, "Additional Instruction may survive verbatim");
  assert.ok(typedAt < goalAt, "typed Quantity must precede Goal");
  assert.ok(typedAt < aiAt, "typed Quantity must precede Additional Instruction");
  assert.ok(cai.includes(AUTHORITATIVE_CLAUSE));
  assert.ok(cai.includes(TYPED_HEADING));
});

test("S8: typed Difficulty remains authoritative against easier Additional Instruction", () => {
  const { api } = loadPrismTestApi();
  const wf = withAdjustments(buildCaiWorkflow(), {
    assessment_difficulty_profile: "higher_order"
  });
  wf.steps[1].additional_instruction = "Make all of the questions very easy.";
  const cai = assembleAllSteps(api, wf).gai_step;
  const typedAt = cai.indexOf(HIGHER_ORDER_PROFILE);
  const aiAt = cai.indexOf("Make all of the questions very easy.");
  assert.ok(typedAt >= 0);
  assert.ok(aiAt >= 0);
  assert.ok(typedAt < aiAt);
  assert.ok(cai.includes(AUTHORITATIVE_CLAUSE));
});

// ---------------------------------------------------------------------------
// Persistence + safety
// ---------------------------------------------------------------------------

test("S8: adjustments survive normalize / JSON round-trip (save-load-export)", () => {
  const { api } = loadPrismTestApi();
  const wf = withAdjustments(buildCaiWorkflow(), {
    assessment_item_count: 7,
    assessment_difficulty_profile: "higher_order"
  });
  const normalized = api.normalizeWorkflowForV1(JSON.parse(JSON.stringify(wf)), []);
  assert.equal(normalized.adjustments.parameters.assessment_item_count, 7);
  assert.equal(
    normalized.adjustments.parameters.assessment_difficulty_profile,
    "higher_order"
  );
  const exported = JSON.parse(JSON.stringify(normalized));
  const duplicated = api.normalizeWorkflowForV1(exported, []);
  assert.equal(duplicated.adjustments.parameters.assessment_item_count, 7);
  assert.equal(
    duplicated.adjustments.parameters.assessment_difficulty_profile,
    "higher_order"
  );
  const ctx = api.resolveEffectiveRunContext(duplicated);
  assert.equal(ctx.parameters.assessment_item_count, 7);
  assert.equal(ctx.provenance.assessment_item_count, "adjustment");
});

test("S8: clearing deletes the adjustment key per S1 contract", () => {
  const { api } = loadPrismTestApi();
  const wf = withAdjustments(buildCaiWorkflow(), {
    assessment_item_count: 5,
    assessment_difficulty_profile: "higher_order",
    topic: "Elizabeth I"
  });
  api.setWorkflowAdjustmentParameterValue(wf, "assessment_item_count", "");
  assert.ok(!Object.prototype.hasOwnProperty.call(wf.adjustments.parameters, "assessment_item_count"));
  assert.equal(wf.adjustments.parameters.assessment_difficulty_profile, "higher_order");
  api.setWorkflowAdjustmentParameterValue(wf, "assessment_difficulty_profile", "");
  assert.ok(
    !Object.prototype.hasOwnProperty.call(wf.adjustments.parameters, "assessment_difficulty_profile")
  );
});

test("S8: non-CAI workflow never projects assessment parameters even if stored", () => {
  const { api } = loadPrismTestApi();
  const wf = withAdjustments(buildNonCaiWorkflow(), {
    assessment_item_count: 5,
    assessment_difficulty_profile: "higher_order"
  });
  // Stored keys that are not applicable are dropped on normalize.
  const normalized = api.normalizeWorkflowAdjustments(wf.adjustments);
  // Keys remain in raw until normalizeWorkflowForV1 — but effective context must
  // mark not_applicable and omit projection.
  const ctx = api.resolveEffectiveRunContext(wf);
  assert.equal(ctx.provenance.assessment_item_count, "not_applicable");
  assert.ok(!Object.prototype.hasOwnProperty.call(ctx.parameters, "assessment_item_count"));
  const lines = api.buildEffectiveWorkflowContextLines(wf);
  assert.ok(!lines.some((l) => /Generate exactly|difficulty profile/i.test(l)));
  void normalized;
});

test("S8: does not revive selectedOptions, option placeholders, or PRISM_STEP_PARAMS", () => {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  // Seed path must still wipe selectedOptions (historical Create bake).
  assert.match(source, /var selectedOptions = \[\];/);
  const { api } = loadPrismTestApi();
  const wf = withAdjustments(buildCaiWorkflow(), {
    assessment_item_count: 5,
    assessment_difficulty_profile: "higher_order"
  });
  const cai = assembleAllSteps(api, wf).gai_step;
  assert.ok(!/\{\{\s*option:/i.test(cai));
  assert.ok(!/PRISM_STEP_PARAMS/.test(cai));
});

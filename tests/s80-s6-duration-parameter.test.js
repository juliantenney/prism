/**
 * Sprint 80 S6 — Duration parameter + D1 hardcoded DLA timing repair.
 *
 * Duration is the third typed workflow parameter and the first *number*, so
 * this file doubles as the proof that the registry generalises beyond text.
 *
 * Covers:
 *   - the registry declaration and commissioned fallback (§2, §3);
 *   - the A-D resolver/provenance matrix (§14);
 *   - D1: canonical DLA timing byte-identical at 60, truthful at 30/90 (§15);
 *   - Learning Sequence duration projection through the shared route (§16);
 *   - DLA-as-constraint vs LS-as-allocator ownership (§17);
 *   - Topic/Goal/page-title safety (§18);
 *   - Topic / Duration / Goal / Additional Instruction precedence (§19).
 *
 * No fetch, no AI, no topology regeneration anywhere in this file.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));

const TYPED_HEADING = "Authoritative workflow parameters for this run:";
const AUTHORITATIVE_CLAUSE = "These values are authoritative for this run.";

const TOPIC = "Elizabeth I";
const COMMISSIONED_GOAL =
  "Create a 60-minute self-study learner page on Elizabeth I for first-year undergraduates.";
const DESIRED_OUTPUTS = "A single learner-facing page the learner works through alone.";

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

/**
 * A self-directed learner-page workflow commissioned at 60 minutes — the state
 * in which the old hardcoded DLA text happened to be true.
 */
function buildWorkflow() {
  return {
    id: "wf-s80-s6",
    name: "S6 Duration coverage",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      goal: COMMISSIONED_GOAL,
      desiredOutputs: DESIRED_OUTPUTS,
      audience: "First-year undergraduates",
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    workflowBriefResolution: {
      initialBrief: {
        goal: COMMISSIONED_GOAL,
        designIntent: COMMISSIONED_GOAL,
        desiredOutputs: DESIRED_OUTPUTS
      },
      resolvedFactors: {
        topic: TOPIC,
        duration_minutes: 60,
        delivery_context: "self_directed",
        delivery_mode: "async",
        input_strategy: "generate_from_topic",
        page_profile: "learner",
        design_scope: "session",
        learner_level: "undergraduate",
        activities_required: true,
        session_materials: ["page"]
      }
    },
    steps: [
      {
        id: "mk_step",
        title: "Model Knowledge",
        outputName: "knowledge_model",
        canonical_step_id: "step_model_knowledge",
        prompt_source_type: "local_override",
        override_prompt_body: "Build a knowledge model for the supplied topic."
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities",
        prompt_source_type: "local_override",
        override_prompt_body: "Design the learning activities."
      },
      {
        id: "ls_step",
        title: "Construct Learning Sequence",
        outputName: "learning_sequence",
        canonical_step_id: "step_construct_learning_sequence",
        prompt_source_type: "local_override",
        override_prompt_body: "Order the activities into a learning sequence."
      },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      }
    ]
  };
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

/** The live canonical DLA overlay text for a workflow, via the production path. */
function assembleLiveDlaOverlay(api, wf) {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const step = wf.steps.filter((s) => s.id === "dla_step")[0];
  const context = api.enrichDlaLearnerPageAugmentContext
    ? api.enrichDlaLearnerPageAugmentContext(
        api.buildWorkflowStepPromptAugmentContextFromStep(step, wf)
      )
    : api.buildWorkflowStepPromptAugmentContextFromStep(step, wf);
  const slotContext = api.buildDlaCanonicalSlotContext(context, wf);
  return { slotContext, overlayText: String(slotContext.overlayText || "") };
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

function findAdjustmentInput(nodes, id) {
  return nodes
    .filter((n) => n.getAttribute("data-field") === "adjustmentParameter")
    .filter((n) => n.getAttribute("data-adjustment-id") === id)[0];
}

/** Structural comparison across the vm realm boundary (D-014 note). */
function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

const loaded = loadPrismTestApi();
const api = loaded.api;

// ---------------------------------------------------------------------------
// Registry declaration (§2) and commissioned fallback (§3)
// ---------------------------------------------------------------------------

test("S6: Duration is a declared registry parameter with the required characteristics", () => {
  const row = api
    .getAdjustmentsParameterRegistry()
    .find((r) => r.id === "duration_minutes");
  assert.ok(row, "duration_minutes must be declared");
  assert.equal(row.label, "Duration");
  assert.equal(row.type, "number");
  assert.equal(row.units, "minutes");
  assert.equal(row.owner, "workflow_run_context");
  assert.equal(row.projection, "workflowContext");
  assert.deepEqual(plain(row.applicability), { always: true });
  assert.equal(typeof row.resolveCommissioned, "function");
  assert.equal(row.multiline, false, "a number is always a scalar");
});

test("S6: the declared range is 10-480, matching the only range this product declares", () => {
  const row = api
    .getAdjustmentsParameterRegistry()
    .find((r) => r.id === "duration_minutes");
  assert.equal(row.min, 10);
  assert.equal(row.max, 480);

  // Out-of-range values are rejected rather than clamped, so nothing silently
  // stores a duration the product does not support.
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 5);
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(wf), 60, "5 is below min");
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 900);
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(wf), 60, "900 is above max");
});

test("S6: the commissioned duration is the frozen resolved factor", () => {
  const wf = buildWorkflow();
  assert.equal(api.resolveCommissionedWorkflowDurationMinutes(wf), 60);

  // Not parsed out of the runtime Goal (§3).
  const noFactor = buildWorkflow();
  delete noFactor.workflowBriefResolution.resolvedFactors.duration_minutes;
  noFactor.workflowOutputSpec.goal = "Create a 90-minute resource on Elizabeth I.";
  assert.equal(
    api.resolveCommissionedWorkflowDurationMinutes(noFactor),
    null,
    "prose minutes must not become a commissioned duration"
  );
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(noFactor), null);
});

// ---------------------------------------------------------------------------
// A-D resolver / provenance matrix (§14)
// ---------------------------------------------------------------------------

test("S6 CASE A: no adjustment resolves 60 with provenance commissioned", () => {
  const wf = buildWorkflow();
  const resolved = api.resolveEffectiveRunContext(wf);
  assert.equal(resolved.parameters.duration_minutes, 60);
  assert.equal(resolved.provenance.duration_minutes, "commissioned");
  assert.equal(wf.adjustments, undefined, "Auto stores nothing");
});

test("S6 CASE B: explicit 30 resolves 30 with provenance adjustment", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);
  const resolved = api.resolveEffectiveRunContext(wf);
  assert.equal(resolved.parameters.duration_minutes, 30);
  assert.equal(resolved.provenance.duration_minutes, "adjustment");
  assert.deepEqual(plain(wf.adjustments.parameters), { duration_minutes: 30 });
});

test("S6 CASE C: explicit 90 resolves 90", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 90);
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(wf), 90);
  assert.equal(
    api.resolveEffectiveRunContext(wf).provenance.duration_minutes,
    "adjustment"
  );
});

test("S6 CASE D: clearing the value returns to the commissioned duration", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", "");
  const resolved = api.resolveEffectiveRunContext(wf);
  assert.equal(resolved.parameters.duration_minutes, 60);
  assert.equal(resolved.provenance.duration_minutes, "commissioned");
  assert.equal(wf.adjustments, undefined, "clearing removes the record, no AUTO sentinel");
});

test("S6: a string number from a DOM input is coerced, not stored as text", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", "45");
  assert.equal(wf.adjustments.parameters.duration_minutes, 45);
  assert.equal(typeof wf.adjustments.parameters.duration_minutes, "number");
});

// ---------------------------------------------------------------------------
// Immutability / no-AI / no-step-params (§14, §20, §21)
// ---------------------------------------------------------------------------

test("S6: changing Duration mutates no resolvedFactors, no topology, and calls no model", () => {
  const wf = buildWorkflow();
  const factorsBefore = JSON.stringify(wf.workflowBriefResolution.resolvedFactors);
  const stepsBefore = JSON.stringify(wf.steps);
  const specBefore = JSON.stringify(wf.workflowOutputSpec);
  const fetchBefore = loaded.fetchCalls.length;

  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);
  const prompts = assembleAllSteps(api, wf);
  assembleLiveDlaOverlay(api, wf);

  assert.equal(JSON.stringify(wf.workflowBriefResolution.resolvedFactors), factorsBefore);
  assert.equal(JSON.stringify(wf.steps), stepsBefore, "topology unchanged");
  assert.equal(JSON.stringify(wf.workflowOutputSpec), specBefore);
  assert.equal(loaded.fetchCalls.length, fetchBefore, "no network/model call");

  // Duration is projected as prompt text, never through the dead step-param path.
  Object.keys(prompts).forEach((id) => {
    assert.doesNotMatch(prompts[id], /PRISM_STEP_PARAMS/, id + " must not gain step params");
    assert.doesNotMatch(prompts[id], /\{\{option:/, id + " must not gain option tokens");
  });
  assert.equal(
    JSON.stringify(wf.steps).indexOf("PRISM_STEP_PARAMS"),
    -1,
    "no step-param write"
  );
});

// ---------------------------------------------------------------------------
// D1 — canonical DLA timing (§15)
// ---------------------------------------------------------------------------

test("D1 root cause: the overlay no longer contains a hardcoded 60 literal", () => {
  const source = fs.readFileSync(
    path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"),
    "utf8"
  );
  assert.doesNotMatch(source, /~60-minute learner workbook/);
  assert.doesNotMatch(source, /session_duration_target_minutes \(~60\)/);
  assert.doesNotMatch(source, /Sum of activity duration_minutes 50–70/);
});

test("D1 60-minute default: overlay text is byte-identical to the pre-S6 contract", () => {
  const previous = execFileSync(
    "git",
    ["show", "HEAD:lib/ld-dla-page-enrich-contract.js"],
    { cwd: repoRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  );
  const tmp = path.join(repoRoot, "tests", ".s80-s6-baseline-dla-contract.js");
  fs.writeFileSync(tmp, previous);
  try {
    delete require.cache[require.resolve(tmp)];
    const baseline = require(tmp);
    const before = baseline.buildDlaWorkbookOverlayBlock();
    assert.equal(
      dlaContract.buildDlaWorkbookOverlayBlock(),
      before,
      "omitting duration must reproduce the accepted contract exactly"
    );
    assert.equal(
      dlaContract.buildDlaWorkbookOverlayBlock({ durationMinutes: 60 }),
      before,
      "an explicit 60 must also be byte-identical"
    );
  } finally {
    fs.unlinkSync(tmp);
  }
});

test("D1 band rule: +/-10 minutes, reproducing 50-70 at 60", () => {
  const cases = [
    [30, 20, 40],
    [60, 50, 70],
    [90, 80, 100]
  ];
  cases.forEach(([target, low, high]) => {
    const band = dlaContract.resolveDlaWorkbookDurationTarget({ durationMinutes: target });
    assert.equal(band.target, target);
    assert.equal(band.bandLow, low);
    assert.equal(band.bandHigh, high);
  });
  // Floor prevents a lower bound of 0, which would state no constraint at all.
  const smallest = dlaContract.resolveDlaWorkbookDurationTarget({ durationMinutes: 10 });
  assert.equal(smallest.bandLow, 5);
  assert.equal(smallest.bandHigh, 20);
});

test("D1 absent/invalid duration falls back to the 60-minute contract", () => {
  const expected = dlaContract.buildDlaWorkbookOverlayBlock({ durationMinutes: 60 });
  [undefined, null, "", 0, -30, "not a number"].forEach((value) => {
    assert.equal(
      dlaContract.buildDlaWorkbookOverlayBlock({ durationMinutes: value }),
      expected,
      "duration " + JSON.stringify(value) + " must preserve default behaviour"
    );
  });
});

test("D1 live path: a 30-minute workflow gets a 30-minute canonical DLA contract", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);
  const { overlayText } = assembleLiveDlaOverlay(api, wf);
  assert.ok(overlayText, "the workbook overlay must be live for a self-directed learner page");

  assert.match(overlayText, /~30-minute learner workbook/);
  assert.match(overlayText, /session_duration_target_minutes \(~30\)/);
  assert.match(overlayText, /Sum of activity duration_minutes 20–40/);

  assert.doesNotMatch(overlayText, /~60-minute/);
  assert.doesNotMatch(overlayText, /session_duration_target_minutes \(~60\)/);
  assert.doesNotMatch(overlayText, /50–70/);
});

test("D1 live path: a 90-minute workflow gets a 90-minute canonical DLA contract", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 90);
  const { overlayText } = assembleLiveDlaOverlay(api, wf);
  assert.match(overlayText, /~90-minute learner workbook/);
  assert.match(overlayText, /session_duration_target_minutes \(~90\)/);
  assert.match(overlayText, /Sum of activity duration_minutes 80–100/);
  assert.doesNotMatch(overlayText, /50–70/);
});

test("D1 live path: an unadjusted workflow still gets the accepted 60-minute contract", () => {
  const wf = buildWorkflow();
  const { overlayText } = assembleLiveDlaOverlay(api, wf);
  assert.equal(
    overlayText,
    dlaContract.buildDlaWorkbookOverlayBlock(),
    "Auto must not change the canonical text"
  );
});

// ---------------------------------------------------------------------------
// DLA constraint vs LS allocator ownership (§7, §17)
// ---------------------------------------------------------------------------

test("S6 ownership: DLA receives Duration as a target/band, not as an allocation", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);
  const { overlayText } = assembleLiveDlaOverlay(api, wf);

  // A target and a sum band are constraints on the total. Neither names a
  // per-activity allocation, which is what would duplicate LS authority.
  assert.match(overlayText, /session_duration_target_minutes/);
  assert.match(overlayText, /Sum of activity duration_minutes 20–40/);
  assert.doesNotMatch(
    overlayText,
    /allocate .*start_minute|timeline allocation|total_duration_minutes/i,
    "DLA must not be handed the allocation job"
  );
});

test("S6 ownership: LS remains the only stage that emits a timing allocation", () => {
  const strict = fs.readFileSync(
    path.join(repoRoot, "lib", "workflow-artefact-json-strict.js"),
    "utf8"
  );
  assert.match(strict, /total_duration_minutes/, "LS artefact owns the total");
  assert.match(strict, /start_minute/, "LS artefact owns per-block placement");
});

test("S6 ownership: the renderer copies LS durations rather than computing a plan", () => {
  const projector = fs.readFileSync(
    path.join(repoRoot, "lib", "learner-renderer-vnext", "project-timeline-durations.js"),
    "utf8"
  );
  assert.match(projector, /Does not compute a new allocation/i);
  assert.match(projector, /when the activity value is absent/i);

  // Duration is not read by the renderer at all: it has no second timing source.
  assert.doesNotMatch(projector, /adjustments/i);
  assert.doesNotMatch(projector, /duration_minutes\s*=\s*\d+/);
});

// ---------------------------------------------------------------------------
// Learning Sequence projection (§8, §9, §16)
// ---------------------------------------------------------------------------

test("S6 LS: the live LS prompt receives the effective Duration authoritatively", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);
  const at30 = assembleAllSteps(api, wf);
  assert.match(at30.ls_step, /Duration: 30 minutes/);
  assert.match(at30.ls_step, new RegExp(TYPED_HEADING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(at30.ls_step, /These values are authoritative for this run\./);
  assert.doesNotMatch(at30.ls_step, /Duration: 60 minutes/);

  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 90);
  const at90 = assembleAllSteps(api, wf);
  assert.match(at90.ls_step, /Duration: 90 minutes/);
  assert.doesNotMatch(at90.ls_step, /Duration: 30 minutes/);

  // Same prompt path, no regeneration, no step-param machinery.
  assert.doesNotMatch(at90.ls_step, /PRISM_STEP_PARAMS/);
});

test("S6 all-step context: Duration appears once per eligible step, with units", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);
  const prompts = assembleAllSteps(api, wf);

  ["mk_step", "dla_step", "ls_step"].forEach((id) => {
    const matches = String(prompts[id]).match(/Duration: 30 minutes/g) || [];
    assert.equal(matches.length, 1, id + " must state Duration exactly once");
  });

  // Episode Plan derives its shell and receives no projected parameters (S2 §7).
  assert.doesNotMatch(prompts.ep_step, /Duration: 30 minutes/);
});

test("S6: an unadjusted workflow projects the commissioned Duration", () => {
  const wf = buildWorkflow();
  const prompts = assembleAllSteps(api, wf);
  assert.match(prompts.ls_step, /Duration: 60 minutes/);
});

// ---------------------------------------------------------------------------
// Precedence (§10, §19)
// ---------------------------------------------------------------------------

test("S6 precedence: Duration 30 outranks a 90-minute Goal and an hour-long instruction", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);
  api.setWorkflowAdjustmentParameterValue(
    wf,
    "goal",
    "Create a detailed 90-minute resource that goes deep into Elizabethan religious policy."
  );
  wf.steps.filter((s) => s.id === "dla_step")[0].additional_instruction =
    "Use around an hour.";

  const prompts = assembleAllSteps(api, wf);
  const dla = prompts.dla_step;

  const typedAt = dla.indexOf(TYPED_HEADING);
  const intentAt = dla.indexOf("Workflow-wide intent for this run (Goal):");
  const instructionAt = dla.indexOf("Author additional instruction for this step.");

  assert.ok(typedAt > -1 && intentAt > -1 && instructionAt > -1);
  assert.ok(typedAt < intentAt, "typed parameters precede prose intent");
  assert.ok(intentAt < instructionAt, "prose intent precedes the author instruction");

  assert.match(dla, /Duration: 30 minutes/);
  assert.match(dla, /These values are authoritative for this run\./);
  assert.match(dla, /the value above wins and the conflicting text is superseded/);
  assert.match(dla, /subordinate to the authoritative workflow parameters above/);

  // The conflicting prose is neither rewritten nor parsed away — precedence is
  // structural, so the author still sees what they wrote (§10).
  assert.match(dla, /90-minute resource/);
  assert.match(dla, /Use around an hour\./);
});

test("S6 composition: Topic, Duration, Goal and instruction each keep their own role", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);
  api.setWorkflowAdjustmentParameterValue(
    wf,
    "goal",
    "An introductory resource that prepares learners for later study."
  );
  wf.steps.filter((s) => s.id === "dla_step")[0].additional_instruction =
    "Make this roughly an hour.";

  const dla = assembleAllSteps(api, wf).dla_step;
  const typedBlock = dla.slice(dla.indexOf(TYPED_HEADING), dla.indexOf(AUTHORITATIVE_CLAUSE));

  // Both typed parameters sit in the authoritative block; prose does not.
  assert.match(typedBlock, /Topic: Elizabeth I/);
  assert.match(typedBlock, /Duration: 30 minutes/);
  assert.doesNotMatch(typedBlock, /introductory resource/);
  assert.doesNotMatch(typedBlock, /roughly an hour/);

  // The instruction stays on its own step.
  assert.doesNotMatch(assembleAllSteps(api, wf).ls_step, /roughly an hour/);
});

// ---------------------------------------------------------------------------
// Topic / Goal / page-title safety (§18)
// ---------------------------------------------------------------------------

test("S6 safety: Duration does not affect Topic, Goal, page title or workflow name", () => {
  const wf = buildWorkflow();
  const titleBefore = api.buildPageShellOptionsFromWorkflow(wf);
  const nameBefore = wf.name;

  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);

  assert.equal(api.resolveEffectiveWorkflowTopicForTitle(wf), TOPIC);
  assert.equal(api.resolveCommissionedWorkflowGoal(wf), COMMISSIONED_GOAL);
  assert.equal(wf.name, nameBefore);
  assert.deepEqual(
    plain(api.buildPageShellOptionsFromWorkflow(wf)),
    plain(titleBefore),
    "page shell must be unchanged by a timing constraint"
  );
});

test("S6 safety: the Goal/Topic authority work is intact alongside Duration", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 30);

  // D4: no ungoverned "Goal:" line; Goal only arrives via the registry.
  const prompts = assembleAllSteps(api, wf);
  assert.doesNotMatch(prompts.mk_step, /^Goal:/m);

  // D5: the title comes from Topic, not raw Goal prose.
  const shell = api.buildPageShellOptionsFromWorkflow(wf);
  assert.doesNotMatch(String(shell.title || ""), /60-minute/);

  // D6: factor derivation still reads the frozen commissioning prose.
  assert.equal(
    api.resolveCommissioningGoalProseForFactorDerivation(wf),
    COMMISSIONED_GOAL
  );
});

// ---------------------------------------------------------------------------
// UI / Auto behaviour (§11)
// ---------------------------------------------------------------------------

test("S6 UI: Duration renders as a bounded number input with a minutes unit", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const input = findAdjustmentInput(nodes, "duration_minutes");
  assert.ok(input, "Duration must render in Adjustments");
  assert.equal(input.tagName, "INPUT");
  assert.equal(input.type, "number");
  assert.equal(input.min, "10");
  assert.equal(input.max, "480");

  const units = nodes.filter((n) => n.getAttribute("data-role") === "adjustment-units");
  assert.equal(units.length, 1, "exactly one units label");
  assert.equal(units[0].textContent, "minutes");
});

test("S6 UI: blank means Auto, and the commissioned value is contextual only", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const input = findAdjustmentInput(nodes, "duration_minutes");
  assert.equal(input.value, "", "Auto must not prefill the commissioned value");
  assert.equal(input.placeholder, "Auto — 60 minutes");

  const status = nodes.filter((n) => n.getAttribute("data-role") === "adjustment-status");
  const statusText = status.map((n) => n.textContent).join("\n");
  assert.match(statusText, /Auto — using the value this workflow was created with: 60 minutes/);

  // No implementation vocabulary leaks into the UI.
  const uiText = nodes.map((n) => String(n.textContent || "") + " " + String(n.placeholder || "")).join("\n");
  assert.doesNotMatch(uiText, /resolvedFactors|PRISM_STEP_PARAMS|provenance|duration_minutes/);
});

test("S6 UI: typing a value stores it, clearing it restores Auto", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const input = findAdjustmentInput(nodes, "duration_minutes");

  input.value = "30";
  input.fire("input");
  assert.equal(wf.adjustments.parameters.duration_minutes, 30);

  input.value = "";
  input.fire("input");
  assert.equal(wf.adjustments, undefined, "clearing restores Auto");
});

test("S6 UI: there is exactly one duration control in Adjustments", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const durationInputs = nodes
    .filter((n) => n.getAttribute("data-field") === "adjustmentParameter")
    .filter((n) => n.getAttribute("data-adjustment-id") === "duration_minutes");
  assert.equal(durationInputs.length, 1);

  // The historical Settings duration control must not reappear here.
  const labels = nodes.map((n) => String(n.textContent || "")).join("\n");
  assert.doesNotMatch(labels, /Session duration \(minutes\)/);
});

// ---------------------------------------------------------------------------
// Persistence lifecycle (§21)
// ---------------------------------------------------------------------------

test("S6: Duration survives normalization, and out-of-range stored values are dropped", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { duration_minutes: 30 } };
  const normalized = api.normalizeWorkflowForV1(wf, []);
  assert.equal(normalized.adjustments.parameters.duration_minutes, 30);

  const bad = buildWorkflow();
  bad.adjustments = { version: 1, parameters: { duration_minutes: 4000 } };
  const normalizedBad = api.normalizeWorkflowForV1(bad, []);
  assert.equal(
    normalizedBad.adjustments,
    undefined,
    "an unsupported duration is not retained as latent authority"
  );
});

// ---------------------------------------------------------------------------
// Extensibility checkpoint (§20)
// ---------------------------------------------------------------------------

test("S6 extensibility: Duration needs no per-prompt-builder timing prose", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");

  // The one and only consumer-specific read of the effective duration is the
  // bounded D1 owner. If this count grows, stages are interpreting duration
  // independently again.
  const reads = appSrc.match(/resolveEffectiveWorkflowDurationMinutes\(/g) || [];
  assert.equal(
    reads.length,
    2,
    "expected exactly two call-shaped sites: the definition and the D1 caller"
  );
});

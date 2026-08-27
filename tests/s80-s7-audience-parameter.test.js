/**
 * Sprint 80 S7 — Audience as the fourth governed workflow parameter.
 *
 * The objective under test is not "a field exists" but "there is exactly ONE
 * runtime Audience authority" across Adjustments → prompts → page artefact,
 * with a frozen commissioned Audience preserved separately.
 *
 * Covers:
 *   - registry declaration and commissioned resolver, incl. the legacy gate (§1);
 *   - Audience stays opaque prose; learner level stays excluded (§2, §3);
 *   - the A-D resolver/provenance matrix (§4);
 *   - declarative UI, Auto placeholder, clear-to-Auto (§5);
 *   - workflow-wide projection through the shared route only (§6);
 *   - Topic/Goal/Duration/Audience/Additional-Instruction precedence (§7);
 *   - #workflowAudience retired to read-only commissioning info (§8);
 *   - the legacy step-1 Audience authority removed (§9);
 *   - page.audience consuming the effective governed Audience (§10);
 *   - the "Learners" exemplar disposition (§11);
 *   - Create-time inference negative guarantees (§12);
 *   - the vertical commissioned → adjusted proof (§13);
 *   - the only-delta proof (§14);
 *   - Goal/Audience independence (§15);
 *   - four-parameter composition + registry extensibility (§16);
 *   - legacy workflow cases A-E (§17);
 *   - persistence and non-leakage (§19).
 *
 * No fetch, no AI, no topology regeneration anywhere in this file.
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

const TOPIC = "Henry VIII";
const COMMISSIONED_GOAL =
  "Create an introductory learner page on Henry VIII for first-year undergraduates.";
const COMMISSIONED_AUDIENCE = "First-year undergraduate history students";
const ADJUSTED_AUDIENCE = "Postgraduate history students studying Tudor political culture";
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
 * A commissioned self-directed learner-page workflow with a real frozen
 * audience, a Topic, a Goal and a Duration — so Audience can be proven to
 * compose with the three parameters that preceded it.
 */
function buildWorkflow() {
  return {
    id: "wf-s80-s7",
    name: "S7 Audience coverage",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      goal: COMMISSIONED_GOAL,
      desiredOutputs: DESIRED_OUTPUTS,
      audience: COMMISSIONED_AUDIENCE,
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    workflowBriefResolution: {
      initialBrief: {
        goal: COMMISSIONED_GOAL,
        designIntent: COMMISSIONED_GOAL,
        audience: COMMISSIONED_AUDIENCE,
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
        id: "lo_step",
        title: "Define Learning Outcomes",
        outputName: "learning_outcomes",
        canonical_step_id: "step_define_learning_outcomes",
        prompt_source_type: "local_override",
        override_prompt_body: "Define the learning outcomes."
      },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan",
        prompt_source_type: "local_override",
        override_prompt_body: "Derive the episode plan shell."
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

function withAudience(wf, value) {
  const next = JSON.parse(JSON.stringify(wf));
  next.adjustments = {
    version: 1,
    parameters: { audience: value }
  };
  return next;
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

function audienceInput(nodes) {
  return nodes.filter(
    (n) =>
      n.getAttribute &&
      n.getAttribute("data-field") === "adjustmentParameter" &&
      n.getAttribute("data-adjustment-id") === "audience"
  )[0];
}

function findDeclaration(api, id) {
  return api.getAdjustmentsParameterRegistry().filter((d) => d.id === id)[0];
}

/**
 * Values returned from the app.js sandbox carry that realm's prototypes, so
 * deepStrictEqual rejects them as "same structure but not reference-equal".
 * Re-materialise them in this realm before comparing.
 */
function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function registryIds(api) {
  return plain(api.getAdjustmentsParameterRegistry().map((d) => d.id)).sort();
}

/** The page artefact shell the production page-composition path would build. */
function pageShellFor(api, wf) {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  return api.buildPageShellOptionsFromWorkflow(wf, []);
}

// ---------------------------------------------------------------------------
// §1 Registry declaration
// ---------------------------------------------------------------------------

test("S7 §1: audience is declared with the expected semantic shape", () => {
  const { api } = loadPrismTestApi();
  const declaration = findDeclaration(api, "audience");
  assert.ok(declaration, "audience must be declared in the registry");
  assert.equal(declaration.label, "Audience");
  assert.equal(declaration.type, "text");
  assert.equal(declaration.owner, "workflow_run_context");
  assert.equal(declaration.projection, "workflowContext");
  assert.deepEqual(plain(declaration.applicability), { always: true });
  assert.equal(typeof declaration.resolveCommissioned, "function");
});

test("S7 §1: audience is single-line text, so it lands in the authoritative section", () => {
  const { api } = loadPrismTestApi();
  const declaration = findDeclaration(api, "audience");
  // Not multiline: this is what puts Audience with Topic/Duration rather than
  // with Goal prose, and is the whole basis of §7 precedence.
  assert.ok(!declaration.multiline);
  assert.ok(!declaration.units, "audience is not a measured quantity");
  assert.ok(!declaration.options || !declaration.options.length, "audience is not an enum");
  assert.ok(declaration.min == null, "audience has no numeric bound");
  assert.ok(declaration.max == null, "audience has no numeric bound");
});

test("S7 §1: the registry now declares exactly four parameters", () => {
  const { api } = loadPrismTestApi();
  assert.deepEqual(registryIds(api), ["audience", "duration_minutes", "goal", "topic"]);
});

// ---------------------------------------------------------------------------
// §1 Commissioned resolver, including the legacy gate
// ---------------------------------------------------------------------------

test("S7 §1: commissioned Audience reads the frozen initialBrief", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.resolveCommissionedWorkflowAudience(buildWorkflow()), COMMISSIONED_AUDIENCE);
});

test("S7 §1: frozen resolvedFactors.audience is an honest second read", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution.initialBrief.audience;
  wf.workflowBriefResolution.resolvedFactors.audience = "Research fellows";
  assert.equal(api.resolveCommissionedWorkflowAudience(wf), "Research fellows");
});

test("S7 §1: the mutable spec is NOT commissioned authority when a frozen brief exists", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution.initialBrief.audience;
  wf.workflowOutputSpec.audience = "Senior executives";
  // A frozen brief exists but records no audience. Promoting the spec here
  // would relabel a possible post-Create edit as commissioning history.
  assert.equal(api.resolveCommissionedWorkflowAudience(wf), "");
});

test("S7 §1: initialBrief outranks resolvedFactors and the spec together", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  wf.workflowBriefResolution.resolvedFactors.audience = "Research fellows";
  wf.workflowOutputSpec.audience = "Senior executives";
  assert.equal(api.resolveCommissionedWorkflowAudience(wf), COMMISSIONED_AUDIENCE);
});

test("S7 §1: blank/whitespace frozen values do not count as commissioned", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  wf.workflowBriefResolution.initialBrief.audience = "   ";
  wf.workflowBriefResolution.resolvedFactors.audience = "";
  assert.equal(api.resolveCommissionedWorkflowAudience(wf), "");
});

// ---------------------------------------------------------------------------
// §4 Resolver / provenance matrix
// ---------------------------------------------------------------------------

test("S7 §4 case A: no adjustment + commissioned => commissioned", () => {
  const { api } = loadPrismTestApi();
  const context = api.resolveEffectiveRunContext(buildWorkflow());
  assert.equal(context.parameters.audience, COMMISSIONED_AUDIENCE);
  assert.equal(context.provenance.audience, "commissioned");
});

test("S7 §4 case B: explicit nonblank adjustment wins", () => {
  const { api } = loadPrismTestApi();
  const context = api.resolveEffectiveRunContext(withAudience(buildWorkflow(), ADJUSTED_AUDIENCE));
  assert.equal(context.parameters.audience, ADJUSTED_AUDIENCE);
  assert.equal(context.provenance.audience, "adjustment");
});

test("S7 §4 case C: blank adjustment falls back to commissioned (blank means Auto)", () => {
  const { api } = loadPrismTestApi();
  ["", "   "].forEach((blank) => {
    const context = api.resolveEffectiveRunContext(withAudience(buildWorkflow(), blank));
    assert.equal(context.parameters.audience, COMMISSIONED_AUDIENCE);
    assert.equal(context.provenance.audience, "commissioned");
  });
});

test("S7 §4 case D: neither adjustment nor commissioned => absent", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution.initialBrief.audience;
  delete wf.workflowOutputSpec.audience;
  const context = api.resolveEffectiveRunContext(wf);
  assert.ok(!Object.prototype.hasOwnProperty.call(context.parameters, "audience"));
  assert.equal(context.provenance.audience, "absent");
});

test("S7 §4: there is no AUTO sentinel and no second store", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), ADJUSTED_AUDIENCE);
  const stored = JSON.stringify(wf.adjustments);
  assert.ok(!/AUTO|__auto__|auto_sentinel/i.test(stored));
  assert.deepEqual(Object.keys(wf.adjustments.parameters), ["audience"]);
  assert.equal(api.resolveEffectiveWorkflowAudience(wf), ADJUSTED_AUDIENCE);
});

// ---------------------------------------------------------------------------
// §2 / §3 Audience stays opaque; learner level stays out
// ---------------------------------------------------------------------------

test("S7 §3: learner level is NOT registered and no enum control was introduced", () => {
  const { api } = loadPrismTestApi();
  const ids = api.getAdjustmentsParameterRegistry().map((d) => d.id);
  ["learner_level", "learnerLevel", "audience_level", "educational_stage"].forEach((banned) => {
    assert.ok(!ids.includes(banned), banned + " must not be declared");
  });
  const types = api.getAdjustmentsParameterRegistry().map((d) => d.type);
  assert.ok(!types.includes("enum"), "no enum parameter should ship in this slice");
});

test("S7 §2/§3: adjusting Audience never derives learner_level or any typed factor", () => {
  const { api } = loadPrismTestApi();
  const base = buildWorkflow();
  const before = JSON.parse(JSON.stringify(base.workflowBriefResolution.resolvedFactors));
  const wf = withAudience(base, "Primary school pupils with no prior study of the period");
  assembleAllSteps(api, wf);
  api.resolveEffectiveRunContext(wf);
  assert.deepEqual(wf.workflowBriefResolution.resolvedFactors, before);
  // "Primary school pupils" is exactly the phrase Create-time inference would
  // have collapsed to learner_level "beginner". At Run it must stay prose.
  assert.equal(wf.workflowBriefResolution.resolvedFactors.learner_level, "undergraduate");
});

test("S7 §3: the dead learner-level machinery is not made to look authoritative", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), ADJUSTED_AUDIENCE);
  const prompts = assembleAllSteps(api, wf);
  Object.keys(prompts).forEach((id) => {
    const text = prompts[id];
    assert.ok(!/PRISM_STEP_PARAMS/.test(text), id + " must not carry a step-param block");
    assert.ok(!/learnerLevel\s*=/.test(text), id + " must not carry learnerLevel=");
    assert.ok(!/\baudience_level\b/.test(text), id + " must not mention audience_level");
  });
});

// ---------------------------------------------------------------------------
// §6 Projection coverage
// ---------------------------------------------------------------------------

test("S7 §6: Audience reaches every projection-eligible step, once", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), ADJUSTED_AUDIENCE);
  const prompts = assembleAllSteps(api, wf);
  ["mk_step", "lo_step", "dla_step", "ls_step"].forEach((id) => {
    const text = prompts[id];
    assert.ok(text.includes("Audience: " + ADJUSTED_AUDIENCE), id + " must receive Audience");
    assert.equal(
      text.split("Audience: " + ADJUSTED_AUDIENCE).length - 1,
      1,
      id + " must receive Audience exactly once"
    );
  });
});

test("S7 §6: Episode Plan keeps its existing projection exemption", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), ADJUSTED_AUDIENCE);
  const prompts = assembleAllSteps(api, wf);
  assert.ok(!prompts.ep_step.includes(TYPED_HEADING));
  assert.ok(!prompts.ep_step.includes(ADJUSTED_AUDIENCE));
});

test("S7 §6: Audience is projected via the shared block, not per-builder plumbing", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), ADJUSTED_AUDIENCE);
  const lines = api.buildEffectiveWorkflowContextLines(wf);
  assert.ok(lines.includes("Audience: " + ADJUSTED_AUDIENCE));
  const block = api.buildEffectiveWorkflowContextBlock(wf, wf.steps[0]);
  assert.ok(block.includes(TYPED_HEADING));
  assert.ok(block.includes("Audience: " + ADJUSTED_AUDIENCE));
});

test("S7 §6: no Audience-specific plumbing was added to app.js", () => {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  // The only call-shaped reads of the effective Audience are its definition and
  // the single bounded page-artefact consumer (§10).
  const reads = source.match(/resolveEffectiveWorkflowAudience\(/g) || [];
  assert.equal(reads.length, 2, "expected definition + one page consumer only");
});

// ---------------------------------------------------------------------------
// §7 Precedence — the required adversarial proof
// ---------------------------------------------------------------------------

test("S7 §7: Audience outranks contradicting Goal prose and Additional Instruction", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), "Postgraduate history students");
  wf.adjustments.parameters.goal = "Create an introductory resource for primary school pupils.";
  wf.steps[0].additional_instruction = "Write this for complete beginners.";
  const prompts = assembleAllSteps(api, wf);
  const text = prompts.mk_step;

  const typedAt = text.indexOf(TYPED_HEADING);
  const audienceAt = text.indexOf("Audience: Postgraduate history students");
  const intentAt = text.indexOf("Workflow-wide intent for this run (Goal):");
  assert.ok(typedAt !== -1 && audienceAt !== -1 && intentAt !== -1);
  // Structural precedence: Audience sits in the authoritative block, above the
  // subordinate prose. No conflict detection, no prose rewriting.
  assert.ok(audienceAt > typedAt);
  assert.ok(intentAt > audienceAt);
  assert.ok(text.includes(AUTHORITATIVE_CLAUSE));

  // Both pieces of contradicting prose survive verbatim.
  assert.ok(text.includes("Create an introductory resource for primary school pupils."));
  assert.ok(text.includes("Write this for complete beginners."));
});

test("S7 §7: no Audience-specific precedence wording was added", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), ADJUSTED_AUDIENCE);
  const block = api.buildEffectiveWorkflowContextBlock(wf, wf.steps[0]);
  const clauses = block.split("\n").filter((l) => /\bAudience\b/.test(l));
  // Audience appears only as its own value line, never inside precedence prose.
  assert.deepEqual(clauses, ["Audience: " + ADJUSTED_AUDIENCE]);
});

// ---------------------------------------------------------------------------
// §8 #workflowAudience disposition
// ---------------------------------------------------------------------------

test("S7 §8: #workflowAudience is read-only in every mode and in markup", () => {
  const loaded = loadPrismTestApi();
  const { api, elementStore } = loaded;
  const markup = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  const group = markup.slice(
    markup.indexOf('<label for="workflowAudience">'),
    markup.indexOf('<label for="workflowArtefacts">')
  );
  assert.match(group, /readonly/, "the commissioning field is read-only in markup");
  assert.match(group, /Adjustments/, "it points the author at the governed control");

  const wf = buildWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const field = elementStore.get("workflowAudience");
  ["edit", "run", "settings"].forEach((mode) => {
    api.setWorkflowMode(mode);
    assert.equal(field.readOnly, true, "read-only in " + mode + " mode");
  });
});

test("S7 §8: the field shows the frozen commissioning Audience", () => {
  const loaded = loadPrismTestApi();
  const { api, elementStore } = loaded;
  const wf = buildWorkflow();
  wf.workflowOutputSpec.audience = "Senior executives";
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.populateWorkflowDetail(wf);
  // Not the mutable spec value, even though one is stored.
  assert.equal(elementStore.get("workflowAudience").value, COMMISSIONED_AUDIENCE);
});

test("S7 §8: the field stays empty rather than displaying a historical edit", () => {
  const loaded = loadPrismTestApi();
  const { api, elementStore } = loaded;
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution.initialBrief.audience;
  wf.workflowOutputSpec.audience = "Senior executives";
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.populateWorkflowDetail(wf);
  assert.equal(elementStore.get("workflowAudience").value, "");
});

test("S7 §8: Save does not gather a runtime authority from the DOM field", () => {
  const loaded = loadPrismTestApi();
  const { api, elementStore } = loaded;
  const wf = buildWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.populateWorkflowDetail(wf);
  // Simulate a tampered DOM value; Save must ignore it and preserve storage.
  elementStore.get("workflowAudience").value = "Tampered audience";
  const gathered = api.gatherWorkflowDetailFormData();
  assert.equal(gathered.workflowOutputSpec.audience, COMMISSIONED_AUDIENCE);
  assert.ok(!/Tampered/.test(JSON.stringify(gathered)));
});

test("S7 §8: Save preserves a stored legacy value rather than destroying it", () => {
  const loaded = loadPrismTestApi();
  const { api, elementStore } = loaded;
  const wf = buildWorkflow();
  wf.workflowOutputSpec.audience = "Senior executives";
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.populateWorkflowDetail(wf);
  elementStore.get("workflowAudience").value = "";
  const gathered = api.gatherWorkflowDetailFormData();
  // No longer runtime authority, but not destroyed either (§17).
  assert.equal(gathered.workflowOutputSpec.audience, "Senior executives");
});

// ---------------------------------------------------------------------------
// §9 Legacy step-1 authority removed — the required proof
// ---------------------------------------------------------------------------

test("S7 §9: a legacy spec audience cannot leak into step 1", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), "Postgraduate students");
  wf.workflowBriefResolution.initialBrief.audience = "Undergraduate students";
  wf.workflowOutputSpec.audience = "Senior executives";

  const runtime = api.buildWorkflowRuntimeContextText(wf, wf.steps[0]);
  assert.ok(!/Senior executives/.test(runtime));
  assert.ok(!/^Audience:/m.test(runtime), "step-1 must no longer emit its own Audience line");

  const prompts = assembleAllSteps(api, wf);
  Object.keys(prompts).forEach((id) => {
    assert.ok(!/Senior executives/.test(prompts[id]), id + " must not leak the legacy value");
  });
  assert.ok(prompts.mk_step.includes("Audience: Postgraduate students"));
});

test("S7 §9: the legacy line is gone even when Audience is on Auto", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  // The dangerous case supersession could not cover: no adjustment at all, but
  // a frozen brief and a stale spec that disagree.
  wf.workflowBriefResolution.initialBrief.audience = "Undergraduate students";
  wf.workflowOutputSpec.audience = "Senior executives";
  const runtime = api.buildWorkflowRuntimeContextText(wf, wf.steps[0]);
  assert.ok(!/Senior executives/.test(runtime));
  const prompts = assembleAllSteps(api, wf);
  assert.ok(prompts.mk_step.includes("Audience: Undergraduate students"));
  assert.ok(!/Senior executives/.test(prompts.mk_step));
});

test("S7 §9: step-1 still carries its other commissioning context", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  wf.workflowOutputSpec.constraints = "No external tools.";
  const runtime = api.buildWorkflowRuntimeContextText(wf, wf.steps[0]);
  assert.ok(runtime.includes("Workflow: S7 Audience coverage"));
  assert.ok(runtime.includes("Constraints: No external tools."));
});

// ---------------------------------------------------------------------------
// §10 page.audience
// ---------------------------------------------------------------------------

test("S7 §10: page.audience uses the adjusted Audience", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), "Postgraduate students");
  assert.equal(pageShellFor(api, wf).audience, "Postgraduate students");
});

test("S7 §10: on Auto, page.audience uses the commissioned Audience", () => {
  const { api } = loadPrismTestApi();
  const shell = pageShellFor(api, buildWorkflow());
  assert.equal(shell.audience, COMMISSIONED_AUDIENCE);
  // The pre-slice defect was that this said "Learners" for every LD workflow.
  assert.notEqual(shell.audience, "Learners");
});

test("S7 §10: with no Audience at all, the honest fallback chain remains", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution.initialBrief.audience;
  delete wf.workflowOutputSpec.audience;
  assert.equal(pageShellFor(api, wf).audience, "Learners");
});

test("S7 §10: page.audience remains a required non-empty schema field", () => {
  const { api } = loadPrismTestApi();
  const shell = pageShellFor(api, buildWorkflow());
  assert.equal(typeof shell.audience, "string");
  assert.ok(shell.audience.length > 0);
  // Unrelated page schema is untouched.
  assert.ok(shell.title);
  assert.deepEqual(plain(shell.page_profile), { profile_type: "learner" });
});

test("S7 §10: prompts and page artefact report the same Audience authority", () => {
  const { api } = loadPrismTestApi();
  [buildWorkflow(), withAudience(buildWorkflow(), "Postgraduate students")].forEach((wf) => {
    const effective = api.resolveEffectiveWorkflowAudience(wf);
    assert.equal(pageShellFor(api, wf).audience, effective);
    const prompts = assembleAllSteps(api, wf);
    assert.ok(prompts.mk_step.includes("Audience: " + effective));
  });
});

// ---------------------------------------------------------------------------
// §12 Create-time inference negative guarantees
// ---------------------------------------------------------------------------

test("S7 §12: an Audience adjustment changes no frozen commissioning state", () => {
  const loaded = loadPrismTestApi();
  const { api, fetchCalls } = loaded;
  const before = buildWorkflow();
  const frozenFactors = JSON.stringify(before.workflowBriefResolution.resolvedFactors);
  const frozenBrief = JSON.stringify(before.workflowBriefResolution.initialBrief);
  const topology = before.steps.map((s) => ({
    id: s.id,
    canonical: s.canonical_step_id,
    outputName: s.outputName,
    body: s.override_prompt_body
  }));

  const wf = withAudience(before, "Members of the public with no clinical background");
  assembleAllSteps(api, wf);
  pageShellFor(api, wf);

  assert.equal(JSON.stringify(wf.workflowBriefResolution.resolvedFactors), frozenFactors);
  assert.equal(JSON.stringify(wf.workflowBriefResolution.initialBrief), frozenBrief);
  assert.deepEqual(
    wf.steps.map((s) => ({
      id: s.id,
      canonical: s.canonical_step_id,
      outputName: s.outputName,
      body: s.override_prompt_body
    })),
    topology
  );
  assert.equal(fetchCalls.length, 0, "no network call may occur");
});

test("S7 §12: Audience does not reselect cognition packs or page profile", () => {
  const { api } = loadPrismTestApi();
  const auto = buildWorkflow();
  const adjusted = withAudience(buildWorkflow(), "Experienced NHS clinicians");
  const ctxAuto = api.resolvePedagogicCognitionBriefContextForPrompt
    ? api.resolvePedagogicCognitionBriefContextForPrompt(auto)
    : null;
  const ctxAdj = api.resolvePedagogicCognitionBriefContextForPrompt
    ? api.resolvePedagogicCognitionBriefContextForPrompt(adjusted)
    : null;
  assert.deepEqual(
    plain(ctxAdj),
    plain(ctxAuto),
    "cognition context must not depend on runtime Audience"
  );
  assert.equal(
    pageShellFor(api, adjusted).page_profile.profile_type,
    pageShellFor(api, auto).page_profile.profile_type
  );
});

test("S7 §12: Create-time audience inference is untouched in source", () => {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  // The blob still includes audience, and the level regex still exists: this
  // slice deliberately changes neither (D18/D20 stay open).
  assert.ok(
    /var blob = \[goal, designIntent, audience, scopeScale, inputs, desiredOutputs, scope\]/.test(
      source
    )
  );
  assert.ok(/beginner\|intermediate\|advanced\|undergraduate\|postgraduate/.test(source));
});

// ---------------------------------------------------------------------------
// §13 Vertical commissioned → adjusted proof
// ---------------------------------------------------------------------------

test("S7 §13: vertical proof — Run A commissioned, Run B adjusted, nothing else moves", () => {
  const loaded = loadPrismTestApi();
  const { api, fetchCalls } = loaded;

  const runA = buildWorkflow();
  const promptsA = assembleAllSteps(api, runA);
  const shellA = pageShellFor(api, runA);

  const runB = withAudience(buildWorkflow(), ADJUSTED_AUDIENCE);
  const promptsB = assembleAllSteps(api, runB);
  const shellB = pageShellFor(api, runB);

  // Prompts follow the effective Audience.
  assert.ok(promptsA.mk_step.includes("Audience: " + COMMISSIONED_AUDIENCE));
  assert.ok(promptsB.mk_step.includes("Audience: " + ADJUSTED_AUDIENCE));
  assert.ok(!promptsB.mk_step.includes(COMMISSIONED_AUDIENCE));

  // Page artefact follows the same authority.
  assert.equal(shellA.audience, COMMISSIONED_AUDIENCE);
  assert.equal(shellB.audience, ADJUSTED_AUDIENCE);

  // Everything structural is identical.
  assert.deepEqual(runB.steps.map((s) => s.id), runA.steps.map((s) => s.id));
  assert.deepEqual(runB.steps.map((s) => s.outputName), runA.steps.map((s) => s.outputName));
  assert.deepEqual(
    runB.workflowBriefResolution.resolvedFactors,
    runA.workflowBriefResolution.resolvedFactors
  );
  assert.equal(shellB.title, shellA.title);
  assert.equal(fetchCalls.length, 0);

  Object.keys(promptsB).forEach((id) => {
    assert.ok(!/PRISM_STEP_PARAMS/.test(promptsB[id]));
  });
});

// ---------------------------------------------------------------------------
// §14 Only-delta proof
// ---------------------------------------------------------------------------

test("S7 §14: substituting Audience back reproduces the Run A prompt exactly", () => {
  const { api } = loadPrismTestApi();
  const promptsA = assembleAllSteps(api, buildWorkflow());
  const promptsB = assembleAllSteps(api, withAudience(buildWorkflow(), ADJUSTED_AUDIENCE));
  Object.keys(promptsA).forEach((id) => {
    const restored = promptsB[id].split(ADJUSTED_AUDIENCE).join(COMMISSIONED_AUDIENCE);
    assert.equal(restored, promptsA[id], id + " must differ only by the Audience value");
  });
});

test("S7 §14: an unadjusted workflow keeps the accepted post-S6 prompt", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  // Audience resolves from the frozen brief, so the only new text is the
  // Audience line itself; Topic/Goal/Duration rendering is unchanged.
  const text = assembleAllSteps(api, wf).mk_step;
  assert.ok(text.includes("Topic: " + TOPIC));
  assert.ok(text.includes("Duration: 60 minutes"));
  assert.ok(text.includes("Audience: " + COMMISSIONED_AUDIENCE));
  assert.ok(text.includes("Workflow-wide intent for this run (Goal):"));
});

// ---------------------------------------------------------------------------
// §15 Goal / Audience independence — the principal product justification
// ---------------------------------------------------------------------------

test("S7 §15: Goal and Audience are independently adjustable", () => {
  const { api } = loadPrismTestApi();
  const GOAL_ADJ = "Focus on evaluating competing interpretations of the break with Rome.";

  const wf = withAudience(buildWorkflow(), "Postgraduate history students");
  wf.adjustments.parameters.goal = GOAL_ADJ;
  const text = assembleAllSteps(api, wf).mk_step;

  // Both reach the model as distinct concepts, in their distinct sections.
  assert.ok(text.includes("Audience: Postgraduate history students"));
  assert.ok(text.includes("Workflow-wide intent for this run (Goal):"));
  assert.ok(text.includes(GOAL_ADJ));

  // Changing Audience does not alter Goal.
  const wf2 = JSON.parse(JSON.stringify(wf));
  wf2.adjustments.parameters.audience = "Experienced NHS clinicians";
  const ctx2 = api.resolveEffectiveRunContext(wf2);
  assert.equal(ctx2.parameters.goal, GOAL_ADJ);
  assert.equal(ctx2.provenance.goal, "adjustment");

  // Changing Goal does not alter Audience.
  const wf3 = JSON.parse(JSON.stringify(wf));
  wf3.adjustments.parameters.goal = "Something else entirely.";
  const ctx3 = api.resolveEffectiveRunContext(wf3);
  assert.equal(ctx3.parameters.audience, "Postgraduate history students");
  assert.equal(ctx3.provenance.audience, "adjustment");
});

test("S7 §15: clearing Audience restores commissioned without touching Goal", () => {
  const { api } = loadPrismTestApi();
  const GOAL_ADJ = "Focus on evaluating competing interpretations of the break with Rome.";
  const wf = withAudience(buildWorkflow(), "Postgraduate history students");
  wf.adjustments.parameters.goal = GOAL_ADJ;

  api.setWorkflowAdjustmentParameterValue(wf, "audience", "");
  const ctx = api.resolveEffectiveRunContext(wf);
  assert.equal(ctx.parameters.audience, COMMISSIONED_AUDIENCE);
  assert.equal(ctx.provenance.audience, "commissioned");
  assert.equal(ctx.parameters.goal, GOAL_ADJ);
  assert.equal(ctx.provenance.goal, "adjustment");
  assert.ok(!Object.prototype.hasOwnProperty.call(wf.adjustments.parameters, "audience"));
});

// ---------------------------------------------------------------------------
// §16 Four-parameter composition + extensibility
// ---------------------------------------------------------------------------

test("S7 §16: all four parameters render through the one shared mechanism", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), "Postgraduate history students");
  wf.adjustments.parameters.topic = "Elizabeth I";
  wf.adjustments.parameters.duration_minutes = 90;
  wf.adjustments.parameters.goal = "Emphasise source criticism.";

  const text = assembleAllSteps(api, wf).mk_step;
  assert.ok(text.includes("Topic: Elizabeth I"));
  assert.ok(text.includes("Duration: 90 minutes"));
  assert.ok(text.includes("Audience: Postgraduate history students"));
  assert.ok(text.includes("Emphasise source criticism."));

  // One authoritative block, one intent block — not four special cases.
  assert.equal(text.split(TYPED_HEADING).length - 1, 1);
  assert.deepEqual(plain(api.buildEffectiveWorkflowContextLines(wf)), [
    "Topic: Elizabeth I",
    "Duration: 90 minutes",
    "Audience: Postgraduate history students"
  ]);
});

test("S7 §16: a further text parameter projects with no prompt-builder edits", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { register: "Formal academic register" } };
  api.setAdjustmentsRegistryForTest([
    {
      id: "register",
      label: "Register",
      type: "text",
      owner: "workflow_run_context",
      projection: "workflowContext",
      applicability: { always: true }
    }
  ]);
  const text = assembleAllSteps(api, wf).mk_step;
  assert.ok(text.includes("Register: Formal academic register"));
  api.resetAdjustmentsRegistryForTest();
  assert.deepEqual(registryIds(api), ["audience", "duration_minutes", "goal", "topic"]);
});

// ---------------------------------------------------------------------------
// §5 Adjustments UI
// ---------------------------------------------------------------------------

test("S7 §5: Audience renders as a single text input with an Auto placeholder", () => {
  const loaded = loadPrismTestApi();
  const { nodes } = renderPanel(loaded, buildWorkflow());
  const inputs = nodes.filter(
    (n) =>
      n.getAttribute &&
      n.getAttribute("data-field") === "adjustmentParameter" &&
      n.getAttribute("data-adjustment-id") === "audience"
  );
  assert.equal(inputs.length, 1, "exactly one Audience control");
  const input = inputs[0];
  assert.equal(input.tagName, "INPUT");
  assert.equal(input.type, "text");
  assert.equal(input.value, "", "the commissioned value must not be prefilled");
  assert.equal(input.placeholder, "Auto — " + COMMISSIONED_AUDIENCE);
});

test("S7 §5: the panel now renders four workflow parameters", () => {
  const loaded = loadPrismTestApi();
  const { nodes } = renderPanel(loaded, buildWorkflow());
  const ids = Array.from(
    nodes
      .filter((n) => n.getAttribute && n.getAttribute("data-field") === "adjustmentParameter")
      .map((n) => n.getAttribute("data-adjustment-id"))
  ).sort();
  assert.deepEqual(ids, ["audience", "duration_minutes", "goal", "topic"]);
});

test("S7 §5: typing sets the adjustment and clearing restores Auto", () => {
  const loaded = loadPrismTestApi();
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const input = audienceInput(nodes);

  input.value = "Postgraduate students";
  input.fire("input");
  assert.equal(wf.adjustments.parameters.audience, "Postgraduate students");

  input.value = "";
  input.fire("input");
  assert.ok(
    !wf.adjustments ||
      !wf.adjustments.parameters ||
      !Object.prototype.hasOwnProperty.call(wf.adjustments.parameters, "audience"),
    "clearing must delete the stored adjustment"
  );
  assert.equal(
    loaded.api.resolveEffectiveRunContext(wf).provenance.audience,
    "commissioned"
  );
});

test("S7 §5/§18: the panel does not imply recompilation", () => {
  const loaded = loadPrismTestApi();
  const { nodes } = renderPanel(loaded, buildWorkflow());
  const copy = nodes
    .map((n) => String(n.textContent || ""))
    .join(" ")
    .toLowerCase();
  assert.ok(/leave a field blank to keep the value it was created with/.test(copy));
  ["rebuild", "recompile", "regenerate the workflow", "re-elicit"].forEach((banned) => {
    assert.ok(!copy.includes(banned), "must not imply " + banned);
  });
  // No implementation vocabulary leaks into the author-facing surface.
  ["resolvedfactors", "workflowoutputspec", "learner_level", "prism_step_params"].forEach((v) => {
    assert.ok(!copy.includes(v), v + " must not appear in UI copy");
  });
});

test("S7 §5: Audience help text points at the commissioned fallback", () => {
  const { api } = loadPrismTestApi();
  const declaration = findDeclaration(api, "audience");
  assert.ok(/leave blank/i.test(declaration.help));
  assert.ok(/does not change which stages run/i.test(declaration.help));
});

// ---------------------------------------------------------------------------
// §17 Legacy workflow safety
// ---------------------------------------------------------------------------

test("S7 §17 case A: no adjustments object at all", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  delete wf.adjustments;
  const ctx = api.resolveEffectiveRunContext(wf);
  assert.equal(ctx.parameters.audience, COMMISSIONED_AUDIENCE);
  assert.equal(ctx.provenance.audience, "commissioned");
});

test("S7 §17 case B: frozen brief present but no initialBrief.audience", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution.initialBrief.audience;
  delete wf.workflowOutputSpec.audience;
  assert.equal(api.resolveEffectiveRunContext(wf).provenance.audience, "absent");
});

test("S7 §17 case C: only resolvedFactors.audience", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution.initialBrief.audience;
  delete wf.workflowOutputSpec.audience;
  wf.workflowBriefResolution.resolvedFactors.audience = "Research fellows";
  const ctx = api.resolveEffectiveRunContext(wf);
  assert.equal(ctx.parameters.audience, "Research fellows");
  assert.equal(ctx.provenance.audience, "commissioned");
});

test("S7 §17 case D: pre-frozen-brief record uses the narrow legacy allowance", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  // No workflowBriefResolution at all: the spec is the only commissioning
  // record this workflow has ever had, and the field is no longer editable.
  delete wf.workflowBriefResolution;
  wf.workflowOutputSpec.audience = "Senior executives";
  const ctx = api.resolveEffectiveRunContext(wf);
  assert.equal(ctx.parameters.audience, "Senior executives");
  assert.equal(ctx.provenance.audience, "commissioned");
});

test("S7 §17 case E: nothing anywhere resolves to absent, not to a guess", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution;
  delete wf.workflowOutputSpec.audience;
  const ctx = api.resolveEffectiveRunContext(wf);
  assert.equal(ctx.provenance.audience, "absent");
  assert.equal(api.resolveEffectiveWorkflowAudience(wf), "");
  // And the projected block simply omits Audience rather than inventing one.
  const block = api.buildEffectiveWorkflowContextBlock(wf, wf.steps[0]);
  assert.ok(!/Audience:/.test(block));
});

test("S7 §17: a legacy mutable value is never silently promoted to an Adjustment", () => {
  const { api } = loadPrismTestApi();
  const wf = buildWorkflow();
  wf.workflowOutputSpec.audience = "Senior executives";
  api.resolveEffectiveRunContext(wf);
  assert.ok(
    !wf.adjustments || !wf.adjustments.parameters || !wf.adjustments.parameters.audience,
    "no migration into adjustments may occur"
  );
});

// ---------------------------------------------------------------------------
// §19 Persistence
// ---------------------------------------------------------------------------

test("S7 §19: Audience survives normalize/round trip at the S1 location", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), ADJUSTED_AUDIENCE);
  const normalized = api.normalizeWorkflowForV1(JSON.parse(JSON.stringify(wf)), []);
  assert.equal(normalized.adjustments.parameters.audience, ADJUSTED_AUDIENCE);
  const roundTripped = JSON.parse(JSON.stringify(normalized));
  assert.equal(roundTripped.adjustments.parameters.audience, ADJUSTED_AUDIENCE);
  assert.equal(api.resolveEffectiveWorkflowAudience(roundTripped), ADJUSTED_AUDIENCE);
});

test("S7 §19: Audience is not written into any legacy store", () => {
  const { api } = loadPrismTestApi();
  const wf = withAudience(buildWorkflow(), ADJUSTED_AUDIENCE);
  assembleAllSteps(api, wf);
  pageShellFor(api, wf);

  assert.ok(
    !Object.prototype.hasOwnProperty.call(
      wf.workflowBriefResolution.resolvedFactors,
      "audience"
    ),
    "resolvedFactors must not gain an audience key"
  );
  assert.equal(
    wf.workflowOutputSpec.audience,
    COMMISSIONED_AUDIENCE,
    "the spec must not become the new authority"
  );
  wf.steps.forEach((step) => {
    assert.ok(!/PRISM_STEP_PARAMS/.test(String(step.notes || "")));
    assert.ok(!new RegExp(ADJUSTED_AUDIENCE).test(String(step.notes || "")));
    assert.ok(!new RegExp(ADJUSTED_AUDIENCE).test(String(step.override_prompt_body || "")));
  });
});

// ---------------------------------------------------------------------------
// §11 "Learners" exemplar disposition
// ---------------------------------------------------------------------------

test("S7 §11: the canonical exemplar is shape guidance, not an audience authority", () => {
  const shellCreate = require(path.join(repoRoot, "lib", "page-shell-create.js"));
  const snippet = shellCreate.buildCanonicalShellShapeSnippet();
  // The exemplar's stated job is string-vs-object shape, and the sibling `title`
  // value is self-evidently a placeholder rather than a literal to emit.
  assert.ok(/do not substitute strings for objects/i.test(snippet));
  assert.ok(snippet.includes('"title": "Learner-facing page title",'));
  assert.ok(snippet.includes('"audience": "Learners",'));
  // It carries no instruction to emit the literal value.
  assert.ok(!/audience must be "Learners"/i.test(snippet));
});

test("S7 §11: the derived shell is composed from the governed options, and is authoritative", () => {
  const { api } = loadPrismTestApi();
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");

  // The PRISM-derived shell is built by handing buildPageShellOptionsFromWorkflow
  // to createPageShellFromEpisodePlan, so the §10 repair is what populates the
  // artefact the model is told to return verbatim.
  assert.ok(
    /createPageShellFromEpisodePlan\(\s*episodePlans,\s*buildPageShellOptionsFromWorkflow\(workflow, normalized\)\s*\)/.test(
      source
    ),
    "the derived shell must be composed from the governed page-shell options"
  );
  assert.ok(/Authoritative Sprint 56F page shell \(PRISM-derived — return verbatim\)/.test(source));
  assert.ok(/Do NOT invent, replan beats, or change activity_ids/.test(source));

  // And those options carry the governed value, not the exemplar's constant.
  const wf = withAudience(buildWorkflow(), "Postgraduate students");
  const options = pageShellFor(api, wf);
  assert.equal(options.audience, "Postgraduate students");
  assert.notEqual(options.audience, "Learners");
});

test("S7 §11: the deterministic builder — not the model — owns page.audience", () => {
  const shellCreate = require(path.join(repoRoot, "lib", "page-shell-create.js"));
  // Whatever the exemplar shows, the supplied option wins in the composed header.
  const header = shellCreate.resolveProfileFields
    ? shellCreate.resolveProfileFields({ audience: "Postgraduate students" })
    : null;
  if (header) {
    assert.equal(header.audience, "Postgraduate students");
  }
  // The "Learners" constant is only ever a last-resort default.
  const source = fs.readFileSync(path.join(repoRoot, "lib", "page-shell-create.js"), "utf8");
  assert.ok(
    /audience: nonEmptyString\(opts\.audience \|\| opts\.learner_audience, "Learners"\)/.test(source)
  );
});

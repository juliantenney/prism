/**
 * Sprint 80 S2 — Adjustments: Topic vertical proof.
 *
 * Proves the full extension path through live prompt assembly:
 *   registry declaration -> resolveEffectiveRunContext -> shared workflowContext
 *   projector -> authoritative prompt ingress (I1 and I2) -> model-visible text.
 *
 * The headline proof is the product proposition: one saved workflow assembled
 * for "Henry VIII", then assembled again for "Elizabeth I" after changing only
 * workflow.adjustments.parameters.topic — no regeneration, no elicitation, no
 * model call, no resolvedFactors mutation, no PRISM_STEP_PARAMS write and no
 * baked prompt-body rewrite.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const CONTEXT_HEADING = "Authoritative workflow parameters for this run:";
const SUPERSEDE_MARKER = "the value above wins and the conflicting text is superseded";
const INSTRUCTION_HEADING = "Author additional instruction for this step.";

const HENRY = "Henry VIII";
const ELIZABETH = "Elizabeth I";

function createElementStub() {
  const el = {
    value: "",
    textContent: "",
    className: "",
    placeholder: "",
    type: "",
    autocomplete: "",
    tagName: "DIV",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
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
    click() {}
  };
  return el;
}

/** Walk a stub element tree so UI assertions can inspect rendered output. */
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

const DLA_PAGE_JSON = JSON.stringify({
  artifact_type: "page",
  schema_version: "2.0.0",
  assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
  learning_outcomes: [{ outcome_id: "LO1", statement: "Explain the concept." }],
  episode_plans: [{ episode_id: "E1", archetype: "understand" }],
  activities: [
    {
      activity_id: "A1",
      title: "Analyse the source",
      expected_output: "A short written analysis.",
      duration_minutes: 20,
      materials: []
    }
  ]
});

/**
 * One workflow covering every step S2 must serve, commissioned for Henry VIII.
 * Model-driven steps carry an override body so ordinary assembly produces text.
 */
function buildWorkflow() {
  return {
    id: "wf-s80-s2",
    name: "S2 Topic coverage",
    goal: "Prove the Topic workflow parameter",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      goal: "Prove the Topic workflow parameter",
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    workflowBriefResolution: {
      resolvedFactors: {
        topic: HENRY,
        design_scope: "session",
        learner_level: "undergraduate"
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
        override_prompt_body: "Write the learning outcomes."
      },
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
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
        id: "gam_step",
        title: "Generate Activity Materials",
        outputName: "page",
        canonical_step_id: "step_generate_activity_materials",
        prompt_source_type: "local_override",
        override_prompt_body: "Author the activity materials."
      },
      {
        id: "ls_step",
        title: "Construct Learning Sequence",
        outputName: "page",
        canonical_step_id: "step_construct_learning_sequence",
        prompt_source_type: "local_override",
        override_prompt_body: "Order the activities into a sequence."
      },
      {
        id: "dp_step",
        title: "Design Page",
        outputName: "page",
        canonical_step_id: "step_design_page",
        prompt_source_type: "local_override",
        override_prompt_body: "Assemble the learner page."
      },
      {
        id: "da_step",
        title: "Design Assessment",
        outputName: "page",
        canonical_step_id: "step_design_assessment",
        prompt_source_type: "local_override",
        override_prompt_body: "Plan the assessment."
      },
      {
        id: "gai_step",
        title: "Generate Assessment Items",
        outputName: "page",
        canonical_step_id: "step_generate_assessment_items",
        prompt_source_type: "local_override",
        override_prompt_body: "Generate the assessment items."
      }
    ],
    workflowRunCapturedOutputs: { dla_step: DLA_PAGE_JSON }
  };
}

// Every model-driven step. Episode Plan is deliberately absent.
const MODEL_DRIVEN_STEP_IDS = [
  "mk_step",
  "lo_step",
  "dla_step",
  "gam_step",
  "ls_step",
  "dp_step",
  "da_step",
  "gai_step"
];

/** Assemble every step of a workflow through the live Copy path. */
function assembleAllSteps(api, wf) {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const prompts = {};
  wf.steps.forEach((step, index) => {
    prompts[step.id] = api.buildWorkflowStepInstructions(step, index + 1, null);
  });
  return prompts;
}

const loaded = loadPrismTestApi();
const api = loaded.api;

// ---------------------------------------------------------------------------
// 1. Registry declaration
// ---------------------------------------------------------------------------

test("S2: topic is declared in the shipped registry with the agreed contract", () => {
  const registry = api.getAdjustmentsParameterRegistry();
  const topic = registry.find((row) => row.id === "topic");
  assert.ok(topic, "topic must be declared");
  assert.equal(topic.label, "Topic");
  assert.equal(topic.type, "text");
  assert.equal(topic.projection, "workflowContext");
  assert.ok(topic.help, "topic needs user-facing help text");
  assert.equal(typeof topic.resolveCommissioned, "function");
  // No enum: Topic is free text, so it cannot constrain to a value list.
  assert.equal(topic.options.length, 0);
  // Applicable to every workflow — Topic gates no capability and no topology.
  assert.equal(api.isAdjustmentsParameterApplicable(topic, buildWorkflow()), true);
});

// ---------------------------------------------------------------------------
// 2. Commissioned fallback, precedence and provenance
// ---------------------------------------------------------------------------

test("S2: absent adjustment falls back to the commissioned topic", () => {
  const wf = buildWorkflow();
  const context = api.resolveEffectiveRunContext(wf);
  assert.equal(context.parameters.topic, HENRY);
  assert.equal(context.provenance.topic, "commissioned");
});

test("S2: commissioned topic reads resolvedFactors, including the legacy alias", () => {
  assert.equal(api.resolveCommissionedWorkflowTopic(buildWorkflow()), HENRY);
  assert.equal(
    api.resolveCommissionedWorkflowTopic({
      workflowBriefResolution: { resolvedFactors: { workshop_subject: "Photosynthesis" } }
    }),
    "Photosynthesis"
  );
  // No commissioned topic and no adjustment resolves to nothing at all.
  assert.equal(api.resolveCommissionedWorkflowTopic({ id: "bare" }), "");
  const bare = api.resolveEffectiveRunContext({ id: "bare" });
  assert.equal(Object.prototype.hasOwnProperty.call(bare.parameters, "topic"), false);
  assert.equal(bare.provenance.topic, "absent");
});

test("S2: an explicit adjustment overrides the commissioned topic", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  const context = api.resolveEffectiveRunContext(wf);
  assert.equal(context.parameters.topic, ELIZABETH);
  assert.equal(context.provenance.topic, "adjustment");
});

test("S2: blank or invalid adjustment falls back rather than blanking the topic", () => {
  // A numeric value is not "invalid" for a text parameter — it coerces to a
  // usable topic string (e.g. "1984") — so it is excluded here deliberately.
  ["", "   ", null, {}, []].forEach((value) => {
    const wf = buildWorkflow();
    wf.adjustments = { version: 1, parameters: { topic: value } };
    const context = api.resolveEffectiveRunContext(wf);
    assert.equal(
      context.parameters.topic,
      HENRY,
      "an unusable value must not defeat the commissioned topic"
    );
    assert.equal(context.provenance.topic, "commissioned");
  });
});

test("S2: resolving the topic never mutates the workflow or resolvedFactors", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  const before = JSON.stringify(wf);
  api.resolveEffectiveRunContext(wf);
  assembleAllSteps(api, wf);
  assert.equal(JSON.stringify(wf), before, "assembly must leave the record untouched");
  assert.equal(wf.workflowBriefResolution.resolvedFactors.topic, HENRY);
});

// ---------------------------------------------------------------------------
// 3. Shared projector
// ---------------------------------------------------------------------------

test("S2: the shared projector is registry-driven, not Topic-specific", () => {
  const wf = buildWorkflow();
  const lines = api.buildEffectiveWorkflowContextLines(wf);
  // Topic is commissioned; CAI capability also projects Quantity/Difficulty
  // defaults (S80-S8) because this fixture includes Generate Assessment Items.
  assert.ok(lines.includes("Topic: " + HENRY));
  assert.ok(lines.includes("Generate exactly 10 assessment items."));
  assert.ok(lines.includes("Use a Balanced difficulty profile."));

  // A second workflowContext parameter must appear with no prompt edits.
  api.setAdjustmentsRegistryForTest([
    {
      id: "topic",
      label: "Topic",
      type: "text",
      owner: "workflow_run_context",
      projection: "workflowContext"
    },
    {
      id: "sample_audience",
      label: "Audience",
      type: "text",
      owner: "workflow_run_context",
      projection: "workflowContext"
    }
  ]);
  const extended = buildWorkflow();
  extended.adjustments = {
    version: 1,
    parameters: { topic: ELIZABETH, sample_audience: "Undergraduates" }
  };
  const prompts = assembleAllSteps(api, extended);
  assert.match(prompts.mk_step, /Topic: Elizabeth I/);
  assert.match(prompts.mk_step, /Audience: Undergraduates/);
  api.resetAdjustmentsRegistryForTest();
});

test("S2: the projected block is compact and asserts its own authority", () => {
  const block = api.buildEffectiveWorkflowContextBlock(buildWorkflow());
  assert.match(block, new RegExp(CONTEXT_HEADING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(block, /Topic: Henry VIII/);
  assert.match(block, /Generate exactly 10 assessment items\./);
  assert.match(block, new RegExp(SUPERSEDE_MARKER));
  // Compact: heading, typed lines (Topic + CAI Quantity/Difficulty), blank,
  // supersession sentence. Must not grow into a brief dump.
  assert.ok(block.split("\n").length <= 8, "projected context must stay compact");
  // It must not duplicate the workflow brief.
  assert.doesNotMatch(block, /Goal:|Constraints:|Desired outputs:/);
});

test("S2: no workflowContext value produces no block and no prompt change", () => {
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution;
  // Drop assessment-capable steps so S80-S8 legacy CAI defaults (10 / balanced)
  // cannot invent a typed block when nothing is commissioned.
  wf.steps = wf.steps.filter(
    (step) =>
      step.canonical_step_id !== "step_generate_assessment_items" &&
      step.canonical_step_id !== "step_design_assessment"
  );
  assert.equal(api.buildEffectiveWorkflowContextBlock(wf), "");
  const prompts = assembleAllSteps(api, wf);
  const remaining = MODEL_DRIVEN_STEP_IDS.filter(
    (id) => id !== "gai_step" && id !== "da_step"
  );
  remaining.forEach((id) => {
    assert.doesNotMatch(prompts[id], new RegExp(CONTEXT_HEADING), id);
  });
});

// ---------------------------------------------------------------------------
// 4. Ingress coverage (I1 + I2)
// ---------------------------------------------------------------------------

test("S2 (I1/I2): topic reaches every model-driven step", () => {
  const prompts = assembleAllSteps(api, buildWorkflow());
  MODEL_DRIVEN_STEP_IDS.forEach((id) => {
    assert.match(prompts[id], new RegExp(CONTEXT_HEADING), id + " must receive the block");
    assert.match(prompts[id], /Topic: Henry VIII/, id + " must receive the topic");
  });
});

test("S2 (I2): GAM receives topic through the canonical-safe ingress", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  const prompts = assembleAllSteps(api, wf);
  const gam = prompts.gam_step;
  assert.match(gam, /Topic: Elizabeth I/);
  // Canonical assembler output stays ahead of the appended projection, so
  // canonical ownership is unchanged.
  assert.ok(
    gam.indexOf(CONTEXT_HEADING) > 0,
    "the projection must be appended after canonical text, never inserted into it"
  );
  assert.doesNotMatch(gam, /PRISM_STEP_PARAMS/);
  assert.doesNotMatch(gam, /\{\{option:/);
});

// S80-S4: the predicate names changed when Additional Instruction eligibility
// was split from workflow-parameter projection eligibility. EP's *projection*
// behaviour is unchanged: it derives its shell from upstream outcomes, so it
// still receives no projected Topic.
test("S2: derived-shell Episode Plan receives no topic projection", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  const prompts = assembleAllSteps(api, wf);
  assert.doesNotMatch(prompts.ep_step, new RegExp(CONTEXT_HEADING));
  assert.doesNotMatch(prompts.ep_step, /Elizabeth I/);
  assert.equal(api.isWorkflowStepEligibleForWorkflowContextProjection(wf.steps[2]), false);
  assert.equal(api.isDerivedShellWorkflowStep(wf.steps[2]), true);
});

test("S2: DLA keeps canonical text and gains only the topic context", () => {
  const wf = buildWorkflow();
  const baseline = assembleAllSteps(api, wf).dla_step;

  const changed = buildWorkflow();
  changed.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  const updated = assembleAllSteps(api, changed).dla_step;

  // The only model-visible delta is the projected topic value.
  assert.equal(
    updated.replace(/Topic: Elizabeth I/g, "Topic: " + HENRY),
    baseline,
    "DLA must change only by the projected topic value"
  );
  // Canonical duration language is untouched (D1 is out of scope for S2).
  assert.equal(/50\s*[–-]\s*70|~?\s*60\s*min/.test(updated), /50\s*[–-]\s*70|~?\s*60\s*min/.test(baseline));
});

// ---------------------------------------------------------------------------
// 5. Vertical proof: Henry VIII -> Elizabeth I on one saved workflow
// ---------------------------------------------------------------------------

test("S2: same workflow reruns with a changed topic and nothing else", () => {
  const fresh = loadPrismTestApi();
  const localApi = fresh.api;

  // RUN A — commissioned topic.
  const wf = buildWorkflow();
  const runA = assembleAllSteps(localApi, wf);
  MODEL_DRIVEN_STEP_IDS.forEach((id) => {
    assert.match(runA[id], /Topic: Henry VIII/, id + " run A");
  });

  const topologyBefore = JSON.stringify(
    wf.steps.map((s) => ({
      id: s.id,
      canonical_step_id: s.canonical_step_id,
      outputName: s.outputName,
      override_prompt_body: s.override_prompt_body
    }))
  );
  const factorsBefore = JSON.stringify(wf.workflowBriefResolution.resolvedFactors);

  // The ONLY change: one explicit adjustment value.
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };

  // RUN B — same saved workflow, no regeneration.
  const runB = assembleAllSteps(localApi, wf);
  MODEL_DRIVEN_STEP_IDS.forEach((id) => {
    assert.match(runB[id], /Topic: Elizabeth I/, id + " run B");
    assert.doesNotMatch(runB[id], /Topic: Henry VIII/, id + " must not keep the old topic");
    // Nothing else in the prompt moved.
    assert.equal(
      runB[id].replace(/Topic: Elizabeth I/g, "Topic: " + HENRY),
      runA[id],
      id + ": the only delta must be the topic value"
    );
  });

  // No regeneration, no elicitation, no stale-baked rewrite.
  assert.equal(
    JSON.stringify(
      wf.steps.map((s) => ({
        id: s.id,
        canonical_step_id: s.canonical_step_id,
        outputName: s.outputName,
        override_prompt_body: s.override_prompt_body
      }))
    ),
    topologyBefore,
    "topology, step ids and baked prompt bodies must be unchanged"
  );
  assert.equal(
    JSON.stringify(wf.workflowBriefResolution.resolvedFactors),
    factorsBefore,
    "resolvedFactors must be unchanged"
  );

  // No model call and no PRISM_STEP_PARAMS authority.
  assert.deepEqual(fresh.fetchCalls, [], "changing a typed parameter must not call out");
  Object.keys(runB).forEach((id) => {
    assert.doesNotMatch(runB[id], /PRISM_STEP_PARAMS/, id);
  });
  assert.doesNotMatch(JSON.stringify(wf), /PRISM_STEP_PARAMS/);
});

// ---------------------------------------------------------------------------
// 6. Composition with the S3 Additional Instruction
// ---------------------------------------------------------------------------

test("S2 + S3: topic stays authoritative and the instruction stays subordinate", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  wf.steps.find((s) => s.id === "mk_step").additional_instruction =
    "Emphasise political and religious change.";
  const prompts = assembleAllSteps(api, wf);

  const mk = prompts.mk_step;
  assert.match(mk, /Topic: Elizabeth I/, "topic must be model-visible in MK");
  assert.match(mk, /Emphasise political and religious change\./, "instruction must be visible");

  // Precedence is structural: the authoritative parameter block precedes the
  // subordinate instruction block.
  assert.ok(
    mk.indexOf(CONTEXT_HEADING) < mk.indexOf(INSTRUCTION_HEADING),
    "workflow parameters must precede the subordinate instruction block"
  );
  assert.match(mk, /explicit workflow parameters/, "the block must name what outranks it");

  // The instruction is step-scoped; the topic is workflow-scoped.
  MODEL_DRIVEN_STEP_IDS.filter((id) => id !== "mk_step").forEach((id) => {
    assert.match(prompts[id], /Topic: Elizabeth I/, id + " must receive the topic");
    assert.doesNotMatch(prompts[id], /political and religious change/, id + " must not see MK steering");
    assert.doesNotMatch(prompts[id], new RegExp(INSTRUCTION_HEADING), id);
  });
});

test("S2 + S3: an instruction cannot displace an explicit topic", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  wf.steps.find((s) => s.id === "mk_step").additional_instruction =
    "Treat Henry VIII as the topic.";
  const mk = assembleAllSteps(api, wf).mk_step;

  // Both texts are present, but the structural contract makes Elizabeth I win.
  assert.match(mk, /Topic: Elizabeth I/);
  assert.ok(mk.indexOf(CONTEXT_HEADING) < mk.indexOf(INSTRUCTION_HEADING));
  assert.match(mk, new RegExp(SUPERSEDE_MARKER));
  // The resolver is unmoved by prose.
  assert.equal(api.resolveEffectiveRunContext(wf).parameters.topic, ELIZABETH);
});

// ---------------------------------------------------------------------------
// 7. Persistence: save, duplicate, export
// ---------------------------------------------------------------------------

test("S2: an explicit topic survives normalization, duplicate and export", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };

  const normalized = api.normalizeWorkflowForV1(JSON.parse(JSON.stringify(wf)), []);
  assert.equal(normalized.adjustments.parameters.topic, ELIZABETH);
  assert.equal(normalized.adjustments.version, 1);

  // Duplicate/export are structural copies, so a round trip must preserve it.
  const roundTripped = api.normalizeWorkflowForV1(
    JSON.parse(JSON.stringify(normalized)),
    []
  );
  assert.equal(roundTripped.adjustments.parameters.topic, ELIZABETH);
  assert.doesNotMatch(JSON.stringify(roundTripped), /PRISM_STEP_PARAMS/);
});

test("S2: gather carries an explicit topic through the save path", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const gathered = api.gatherWorkflowDetailFormDataForTest();
  assert.equal(gathered.adjustments.parameters.topic, ELIZABETH);
});

test("S2: setting the value writes the adjustment; clearing it restores Auto", () => {
  const wf = buildWorkflow();

  assert.equal(api.setWorkflowAdjustmentParameterValue(wf, "topic", ELIZABETH), true);
  assert.equal(wf.adjustments.parameters.topic, ELIZABETH);
  assert.equal(api.resolveEffectiveRunContext(wf).provenance.topic, "adjustment");

  // Blank clears the entry rather than storing an "AUTO" sentinel.
  assert.equal(api.setWorkflowAdjustmentParameterValue(wf, "topic", "   "), true);
  assert.equal(Object.prototype.hasOwnProperty.call(wf, "adjustments"), false);
  const context = api.resolveEffectiveRunContext(wf);
  assert.equal(context.parameters.topic, HENRY);
  assert.equal(context.provenance.topic, "commissioned");

  // An undeclared id is rejected outright.
  assert.equal(api.setWorkflowAdjustmentParameterValue(wf, "not_declared", "x"), false);
});

// ---------------------------------------------------------------------------
// 8. Minimal UI
// ---------------------------------------------------------------------------

test("S2 (UI): the Topic field shows Auto fallback and edits the adjustment", () => {
  const fresh = loadPrismTestApi();
  const localApi = fresh.api;
  const container = fresh.elementStore.get("unifiedWorkflowSettingsOptions");
  const wf = buildWorkflow();
  localApi.setWorkflowsForTest([wf]);
  localApi.setSelectedWorkflowIdForTest(wf.id);

  localApi.renderAdjustmentsWorkflowParametersSection(wf);
  const rendered = flattenElements(container);
  const input = rendered.find((el) => el.getAttribute("data-adjustment-id") === "topic" && el.type);
  assert.ok(input, "a Topic input must be rendered");

  // Absence is Auto: the commissioned value is a placeholder, not a prefill.
  assert.equal(input.value, "", "an unset adjustment must render blank");
  assert.match(input.placeholder, /Auto — Henry VIII/);
  const status = rendered.find((el) => el.getAttribute("data-role") === "adjustment-status");
  assert.match(status.textContent, /Auto/);
  assert.match(status.textContent, /Henry VIII/);

  // Editing writes the adjustment through the S1 persistence mechanism.
  input.value = ELIZABETH;
  input.listeners.input.forEach((fn) => fn());
  assert.equal(wf.adjustments.parameters.topic, ELIZABETH);
  assert.match(status.textContent, /Using your value: Elizabeth I/);
  assert.deepEqual(fresh.fetchCalls, [], "editing a parameter must not call out");
});

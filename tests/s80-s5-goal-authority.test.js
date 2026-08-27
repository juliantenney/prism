/**
 * Sprint 80 S5 — Goal authority repair + Goal Adjustment.
 *
 * Operator adopted the T-009 Option E direction: Goal and Topic are distinct
 * concepts, Topic remains, and the runtime Goal comes under Adjustments with the
 * commissioning Goal separated from it and frozen.
 *
 * Covers:
 *   - the Goal registry declaration and its frozen commissioned source;
 *   - the A-D Topic/Goal matrix (§15);
 *   - D4 (ungoverned Goal/Topic contradiction) regression (§16);
 *   - D6 (live Goal re-extraction into factor/scaffold selection) regression (§17);
 *   - D5 (page title from raw Goal prose) regression (§18);
 *   - three-layer Topic / Goal / Additional Instruction composition (§19);
 *   - capability-boundary and immutability proofs (§13, §23).
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
const INTENT_HEADING = "Workflow-wide intent for this run (Goal):";
const SUBORDINATE_CLAUSE = "subordinate to the authoritative workflow parameters above";
const CAPABILITY_CLAUSE = "does not change which stages this workflow runs";

const HENRY = "Henry VIII";
const ELIZABETH = "Elizabeth I";

/** The frozen Create-time commissioning prose. */
const COMMISSIONED_GOAL =
  "Create a 60-minute self-study resource on Henry VIII with 10 formative assessment questions.";
/** A rich runtime Goal: duration + subject + assessment count + purpose. */
const RUNTIME_GOAL =
  "Create an introductory resource on Elizabeth I that establishes the concepts needed for a later resource on the English Reformation.";

function createElementStub(tagName) {
  const el = {
    value: "",
    textContent: "",
    className: "",
    placeholder: "",
    type: "",
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
 * A workflow commissioned for Henry VIII, with an assessment-producing topology
 * and frozen factors that match the commissioned Goal. `initialBrief` carries
 * the frozen commissioning prose; `workflowOutputSpec.goal` starts out as the
 * same string, which is exactly the state Create leaves behind.
 */
function buildWorkflow() {
  return {
    id: "wf-s80-s5",
    name: "S5 Goal authority coverage",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      goal: COMMISSIONED_GOAL,
      audience: "First-year undergraduates",
      constraints: "Must be completable without a library visit.",
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    workflowBriefResolution: {
      initialBrief: { goal: COMMISSIONED_GOAL, designIntent: COMMISSIONED_GOAL },
      resolvedFactors: {
        topic: HENRY,
        duration_minutes: 60,
        delivery_context: "self_directed",
        delivery_mode: "async",
        assessment_required: true,
        assessment_total_items: 10,
        assessment_type: "mcq",
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
        id: "gai_step",
        title: "Generate Assessment Items",
        outputName: "page",
        canonical_step_id: "step_generate_assessment_items",
        prompt_source_type: "local_override",
        override_prompt_body: "Generate the assessment items."
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

function renderPanel(loaded, wf) {
  const api = loaded.api;
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const root = loaded.elementStore.get("unifiedWorkflowSettingsOptions");
  root.children.length = 0;
  api.renderUnifiedWorkflowSettingsUI();
  return { root, nodes: flattenElements(root) };
}

function findByField(nodes, field) {
  return nodes.filter((n) => n.getAttribute("data-field") === field);
}

function findAdjustmentInput(nodes, id) {
  return findByField(nodes, "adjustmentParameter").filter(
    (n) => n.getAttribute("data-adjustment-id") === id
  )[0];
}

/** Structural comparison across the vm realm boundary (D-014 note). */
function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function allText(nodes) {
  return nodes
    .map((n) => String(n.textContent || "") + " " + String(n.placeholder || ""))
    .join("\n");
}

const loaded = loadPrismTestApi();
const api = loaded.api;

// ---------------------------------------------------------------------------
// Registry declaration (§2) and commissioned source (§3)
// ---------------------------------------------------------------------------

test("S5: Goal is a declared registry parameter with the required characteristics", () => {
  const goal = api.getAdjustmentsParameterRegistry().find((row) => row.id === "goal");
  assert.ok(goal, "goal must be declared");
  assert.equal(goal.label, "Goal");
  assert.equal(goal.type, "text");
  assert.equal(goal.multiline, true, "Goal is prose, not a label");
  assert.equal(goal.owner, "workflow_run_context");
  assert.equal(goal.projection, "workflowContext");
  assert.deepEqual(plain(goal.applicability), { always: true });
  assert.equal(typeof goal.resolveCommissioned, "function");
});

test("S5: the commissioned Goal is the frozen commissioning prose, not the mutable spec", () => {
  const wf = buildWorkflow();
  assert.equal(api.resolveCommissionedWorkflowGoal(wf), COMMISSIONED_GOAL);

  // Mutating workflowOutputSpec.goal cannot move the commissioned value.
  wf.workflowOutputSpec.goal = "Something an old build wrote here.";
  assert.equal(api.resolveCommissionedWorkflowGoal(wf), COMMISSIONED_GOAL);
  assert.equal(api.resolveEffectiveRunContext(wf).parameters.goal, COMMISSIONED_GOAL);
  assert.equal(api.resolveEffectiveRunContext(wf).provenance.goal, "commissioned");

  // designIntent is the same frozen prose under Create's other key.
  const viaDesignIntent = buildWorkflow();
  delete viaDesignIntent.workflowBriefResolution.initialBrief.goal;
  assert.equal(api.resolveCommissionedWorkflowGoal(viaDesignIntent), COMMISSIONED_GOAL);

  // No frozen brief at all means absent, not a fall back to mutable state.
  const bare = { id: "wf", workflowOutputSpec: { goal: "mutable" } };
  assert.equal(api.resolveCommissionedWorkflowGoal(bare), "");
  assert.equal(api.resolveEffectiveRunContext(bare).provenance.goal, "absent");
});

test("S5: an explicit runtime Goal persists through the S1 adjustments path only", () => {
  const wf = buildWorkflow();
  const changed = api.setWorkflowAdjustmentParameterValue(wf, "goal", RUNTIME_GOAL);
  assert.equal(changed, true);
  assert.deepEqual(plain(wf.adjustments), {
    version: 1,
    parameters: { goal: RUNTIME_GOAL }
  });

  // Never written anywhere else.
  assert.equal(wf.workflowOutputSpec.goal, COMMISSIONED_GOAL, "spec goal untouched");
  assert.equal(
    wf.workflowBriefResolution.initialBrief.goal,
    COMMISSIONED_GOAL,
    "initialBrief is never mutated"
  );
  assert.equal(wf.workflowBriefResolution.resolvedFactors.goal, undefined);
  wf.steps.forEach((step) => {
    assert.doesNotMatch(String(step.notes || ""), /PRISM_STEP_PARAMS/);
    assert.equal(String(step.notes || "").includes(RUNTIME_GOAL), false);
    assert.equal(String(step.override_prompt_body || "").includes(RUNTIME_GOAL), false);
  });

  // Clearing restores Auto: absence, not a stored blank.
  api.setWorkflowAdjustmentParameterValue(wf, "goal", "   ");
  assert.equal(wf.adjustments, undefined);
  assert.equal(api.resolveEffectiveRunContext(wf).provenance.goal, "commissioned");
});

// ---------------------------------------------------------------------------
// A-D matrix (§15)
// ---------------------------------------------------------------------------

const MATRIX = [
  {
    name: "CASE A - neither adjusted",
    adjustments: null,
    topic: { value: HENRY, provenance: "commissioned" },
    goal: { value: COMMISSIONED_GOAL, provenance: "commissioned" }
  },
  {
    name: "CASE B - Topic only",
    adjustments: { topic: ELIZABETH },
    topic: { value: ELIZABETH, provenance: "adjustment" },
    goal: { value: COMMISSIONED_GOAL, provenance: "commissioned" }
  },
  {
    name: "CASE C - Goal only",
    adjustments: { goal: RUNTIME_GOAL },
    topic: { value: HENRY, provenance: "commissioned" },
    goal: { value: RUNTIME_GOAL, provenance: "adjustment" }
  },
  {
    name: "CASE D - both",
    adjustments: { topic: ELIZABETH, goal: RUNTIME_GOAL },
    topic: { value: ELIZABETH, provenance: "adjustment" },
    goal: { value: RUNTIME_GOAL, provenance: "adjustment" }
  }
];

MATRIX.forEach((row) => {
  test("S5 matrix: " + row.name, () => {
    const wf = buildWorkflow();
    if (row.adjustments) {
      wf.adjustments = { version: 1, parameters: row.adjustments };
    }
    const factorsBefore = JSON.stringify(wf.workflowBriefResolution.resolvedFactors);
    const topologyBefore = JSON.stringify(wf.steps.map((s) => s.title));
    const overridesBefore = JSON.stringify(
      wf.steps.map((s) => String(s.override_prompt_body || ""))
    );
    const notesBefore = JSON.stringify(wf.steps.map((s) => String(s.notes || "")));
    const fetchBefore = loaded.fetchCalls.length;

    // Provenance.
    const context = api.resolveEffectiveRunContext(wf);
    assert.equal(context.parameters.topic, row.topic.value);
    assert.equal(context.provenance.topic, row.topic.provenance);
    assert.equal(context.parameters.goal, row.goal.value);
    assert.equal(context.provenance.goal, row.goal.provenance);

    // Projection: both concepts reach every eligible step. Model Knowledge is a
    // foundation upstream step, so its Goal projection is assessment-sanitised;
    // DLA is not, so it carries the intent verbatim.
    const prompts = assembleAllSteps(api, wf);
    ["mk_step", "dla_step", "gai_step"].forEach((id) => {
      assert.match(prompts[id], new RegExp(TYPED_HEADING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(prompts[id], new RegExp("Topic: " + row.topic.value));
      assert.ok(
        prompts[id].includes(INTENT_HEADING),
        row.name + ": " + id + " must carry the Goal intent block"
      );
      assert.ok(prompts[id].includes(SUBORDINATE_CLAUSE), "precedence is stated");
      assert.ok(prompts[id].includes(CAPABILITY_CLAUSE), "capability boundary is stated");
    });
    assert.ok(
      prompts.dla_step.includes(row.goal.value),
      row.name + ": the effective Goal prose reaches a non-upstream step verbatim"
    );

    // Exactly one Goal authority: no ungoverned commissioning `Goal:` line.
    Object.keys(prompts).forEach((id) => {
      assert.doesNotMatch(prompts[id], /^Goal: /m, id + " must have no ungoverned Goal line");
    });
    assert.doesNotMatch(
      api.buildWorkflowRuntimeContextText(wf, wf.steps[0], 1),
      /^Goal: /m
    );

    // Nothing derived, nothing regenerated, nothing called.
    assert.equal(
      JSON.stringify(wf.workflowBriefResolution.resolvedFactors),
      factorsBefore,
      "resolvedFactors are frozen"
    );
    assert.equal(JSON.stringify(wf.steps.map((s) => s.title)), topologyBefore);
    assert.equal(
      JSON.stringify(wf.steps.map((s) => String(s.override_prompt_body || ""))),
      overridesBefore
    );
    assert.equal(JSON.stringify(wf.steps.map((s) => String(s.notes || ""))), notesBefore);
    assert.equal(loaded.fetchCalls.length, fetchBefore, "no network call");
    wf.steps.forEach((s) =>
      assert.doesNotMatch(String(s.notes || ""), /PRISM_STEP_PARAMS/)
    );
  });
});

test("S5 matrix: Case A projection is unchanged when the workflow has no frozen brief", () => {
  // Legacy record: no commissioned Goal exists, so no intent block is projected
  // and prompts keep their pre-S5 shape apart from the retired Goal line.
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution.initialBrief;
  const first = assembleAllSteps(api, wf).mk_step;
  assert.equal(first.includes(INTENT_HEADING), false);
  assert.match(first, /Topic: Henry VIII/);
});

// ---------------------------------------------------------------------------
// D4 regression (§16)
// ---------------------------------------------------------------------------

test("D4 regression: Goal and Topic can no longer contradict each other ungoverned", () => {
  // The exact T-009 scenario: commissioned Henry VIII, runtime Goal names
  // Elizabeth I, Topic left on Auto (so it stays Henry VIII).
  const wf = buildWorkflow();
  wf.adjustments = {
    version: 1,
    parameters: { goal: "Create an introductory resource on Elizabeth I." }
  };

  const prompts = assembleAllSteps(api, wf);
  const first = prompts.mk_step;

  // Both concepts are visible, because they are now two deliberate concepts...
  assert.match(first, /Topic: Henry VIII/);
  assert.ok(first.includes("Elizabeth I"), "the author's intent is not silently dropped");

  // ...but the contract states which one is authoritative for the subject, and
  // the typed block is emitted before the subordinate intent block.
  assert.ok(
    first.indexOf(TYPED_HEADING) < first.indexOf(INTENT_HEADING),
    "typed parameters must precede prose intent"
  );
  assert.ok(first.includes(SUBORDINATE_CLAUSE));
  assert.match(
    first,
    /the value above wins and the conflicting text is superseded/,
    "typed authority is explicit"
  );

  // The pre-repair defect was TWO independent Goal authorities. There is now
  // exactly one, and it is the governed one.
  assert.doesNotMatch(first, /^Goal: /m);
  const intentOccurrences = first.split(INTENT_HEADING).length - 1;
  assert.equal(intentOccurrences, 1, "exactly one Goal authority per prompt");

  // A stale workflowOutputSpec.goal cannot leak in even if a legacy record has
  // one that disagrees with everything else.
  wf.workflowOutputSpec.goal = "STALE-UNGOVERNED-GOAL-SENTINEL";
  const after = assembleAllSteps(api, wf);
  Object.keys(after).forEach((id) => {
    assert.doesNotMatch(after[id], /STALE-UNGOVERNED-GOAL-SENTINEL/, id);
  });
});

test("D4 regression: #workflowGoal is no longer an independently editable authority", () => {
  const html = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  const at = html.indexOf('id="workflowGoal"');
  assert.ok(at > 0);
  const field = html.slice(at - 400, at + 400);
  assert.match(field, /readonly/, "the commissioning field is read-only in markup");
  assert.match(field, /Adjustments/, "it points the author at the governed control");

  // Read-only in every mode, not just run/settings.
  const wf = buildWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const goalEl = loaded.elementStore.get("workflowGoal");
  ["edit", "run", "settings"].forEach((mode) => {
    api.setWorkflowMode(mode);
    assert.equal(goalEl.readOnly, true, "read-only in " + mode + " mode");
  });

  // It displays the frozen commissioning prose.
  api.populateWorkflowDetail(wf);
  assert.equal(goalEl.value, COMMISSIONED_GOAL);

  // Typing into it cannot change stored state: Save preserves what is stored.
  goalEl.value = "TYPED-INTO-READONLY-FIELD";
  const draft = api.gatherWorkflowDetailFormData();
  assert.equal(
    draft.workflowOutputSpec.goal,
    COMMISSIONED_GOAL,
    "Save preserves the stored goal instead of gathering the DOM"
  );
  assert.doesNotMatch(
    JSON.stringify(draft),
    /TYPED-INTO-READONLY-FIELD/,
    "the field's text never enters the saved record"
  );
});

// ---------------------------------------------------------------------------
// D6 regression (§17)
// ---------------------------------------------------------------------------

test("D6 regression: changing the runtime Goal re-derives no factors or scaffolds", () => {
  const wf = buildWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const before = api.resolvePedagogicCognitionBriefContextForPrompt({ workflowId: wf.id });
  const baselineExplicit = JSON.stringify(before.explicit);
  const baselinePacks = JSON.stringify(before.packs);
  const baselineContract = JSON.stringify(before.contract);
  const baselineResolved = JSON.stringify(before.resolved);

  // A runtime Goal engineered to flip every deterministic rule it can reach:
  // different duration, different delivery mode, no assessment, no activities.
  api.setWorkflowAdjustmentParameterValue(
    wf,
    "goal",
    "Run a 20-minute live workshop on Elizabeth I with no quiz and no activities."
  );
  api.setWorkflowsForTest([wf]);

  const after = api.resolvePedagogicCognitionBriefContextForPrompt({ workflowId: wf.id });
  assert.equal(JSON.stringify(after.explicit), baselineExplicit, "no factor re-derivation");
  assert.equal(JSON.stringify(after.packs), baselinePacks, "no pack re-selection");
  assert.equal(JSON.stringify(after.contract), baselineContract, "no contract change");
  assert.equal(JSON.stringify(after.resolved), baselineResolved, "frozen factors untouched");

  // The frozen delivery/input/product decisions specifically.
  ["delivery_mode", "delivery_context", "input_strategy", "page_profile", "duration_minutes"].forEach(
    (key) => {
      assert.equal(
        String(after.resolved[key]),
        String(wf.workflowBriefResolution.resolvedFactors[key]),
        key + " stays frozen"
      );
    }
  );

  // The scaffold-gating ctx carries frozen prose, not the runtime Goal.
  const ctx = api.buildWorkflowStepPromptAugmentContextFromStep(wf.steps[1], wf);
  assert.equal(ctx.workflowGoal, COMMISSIONED_GOAL);
  assert.doesNotMatch(ctx.workflowGoal, /Elizabeth I/);
});

test("D6 regression: a mutated workflowOutputSpec.goal no longer moves derivation", () => {
  const wf = buildWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const baseline = JSON.stringify(
    api.resolvePedagogicCognitionBriefContextForPrompt({ workflowId: wf.id }).explicit
  );

  wf.workflowOutputSpec.goal =
    "Run a 20-minute live workshop with no quiz, no activities and no page.";
  api.setWorkflowsForTest([wf]);
  assert.equal(
    JSON.stringify(
      api.resolvePedagogicCognitionBriefContextForPrompt({ workflowId: wf.id }).explicit
    ),
    baseline,
    "derivation reads the frozen brief, so the mutable field is inert"
  );
});

test("D6: Create-time extraction is untouched and still interprets prose", () => {
  // The repair must not disable commissioning interpretation.
  const explicit = api.extractWorkflowBriefExplicitFactors({
    selectedDomains: ["learning-design"],
    goal: COMMISSIONED_GOAL,
    inputs: "",
    desiredOutputs: ""
  });
  assert.equal(explicit.assessment_required, true);
  assert.equal(explicit.assessment_total_items, 10);
  assert.equal(explicit.delivery_context, "self_directed");
});

// ---------------------------------------------------------------------------
// D5 regression (§18)
// ---------------------------------------------------------------------------

test("D5 regression: the page title is never the Goal sentence", () => {
  const wf = buildWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const outcomes = [{ outcome_id: "LO1", statement: "Explain the break with Rome." }];

  const shell = api.buildPageShellOptionsFromWorkflow(wf, outcomes);
  assert.notEqual(shell.title, COMMISSIONED_GOAL);
  assert.equal(shell.title, HENRY, "the concise Topic is the title source");
  // None of the rich Goal's content leaks into the title.
  assert.doesNotMatch(shell.title, /60-minute/);
  assert.doesNotMatch(shell.title, /10 formative/);
  assert.doesNotMatch(shell.title, /^Create /);

  // A rich runtime Goal cannot become the title either.
  api.setWorkflowAdjustmentParameterValue(wf, "goal", RUNTIME_GOAL);
  api.setWorkflowsForTest([wf]);
  const withGoal = api.buildPageShellOptionsFromWorkflow(wf, outcomes);
  assert.equal(withGoal.title, HENRY);
  assert.doesNotMatch(withGoal.title, /establishes the concepts/);
});

test("D5: Topic is the title authority, and an explicit commissioned title outranks it", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const outcomes = [{ outcome_id: "LO1", statement: "x" }];

  // Adjusting Topic retitles the page.
  assert.equal(api.buildPageShellOptionsFromWorkflow(wf, outcomes).title, ELIZABETH);

  // An explicit commissioned page title has higher authority and is preserved.
  wf.workflowBriefResolution.resolvedFactors.page_title = "The Tudor Succession";
  api.setWorkflowsForTest([wf]);
  assert.equal(
    api.buildPageShellOptionsFromWorkflow(wf, outcomes).title,
    "The Tudor Succession"
  );
});

test("D5: with no Topic the title falls back to the workflow name, never Goal", () => {
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution.resolvedFactors.topic;
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const title = api.buildPageShellOptionsFromWorkflow(wf, [
    { outcome_id: "LO1", statement: "x" }
  ]).title;
  assert.equal(title, wf.name);
  assert.notEqual(title, COMMISSIONED_GOAL);
});

test("D7 avoided: no Topic is ever derived from Goal prose", () => {
  // T-009 showed the deterministic subject regex yields a garbage topic from a
  // rich goal. Nothing in the title or projection path may use it.
  const wf = buildWorkflow();
  delete wf.workflowBriefResolution.resolvedFactors.topic;
  wf.adjustments = { version: 1, parameters: { goal: RUNTIME_GOAL } };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const context = api.resolveEffectiveRunContext(wf);
  assert.equal(context.provenance.topic, "absent", "Topic is absent, not invented");
  assert.equal(api.resolveEffectiveWorkflowTopicForTitle(wf), "");
  const first = assembleAllSteps(api, wf).mk_step;
  assert.doesNotMatch(first, /^Topic: /m, "no fabricated Topic line");
});

// ---------------------------------------------------------------------------
// Additional Instruction composition (§19)
// ---------------------------------------------------------------------------

test("S5: Topic, Goal and Additional Instruction compose in precedence order", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  api.setWorkflowAdjustmentParameterValue(
    wf,
    "goal",
    "Create an introductory resource emphasising religious change."
  );
  wf.steps[0].additional_instruction = "Prioritise competing interpretations.";

  const prompts = assembleAllSteps(api, wf);
  const mk = prompts.mk_step;

  const typedAt = mk.indexOf(TYPED_HEADING);
  const intentAt = mk.indexOf(INTENT_HEADING);
  const instructionAt = mk.indexOf("Prioritise competing interpretations.");
  assert.ok(typedAt >= 0 && intentAt >= 0 && instructionAt >= 0, "all three layers present");
  assert.ok(typedAt < intentAt, "typed parameters precede Goal");
  assert.ok(intentAt < instructionAt, "Goal precedes stage-local instruction");

  assert.match(mk, /Topic: Elizabeth I/);
  assert.match(mk, /emphasising religious change/);

  // Additional Instruction is stage-local: it appears only in its own step.
  ["dla_step", "gai_step", "ep_step"].forEach((id) => {
    assert.doesNotMatch(
      prompts[id],
      /Prioritise competing interpretations\./,
      id + " must not receive another step's instruction"
    );
  });
  // Whereas Topic and Goal are workflow-wide.
  ["dla_step", "gai_step"].forEach((id) => {
    assert.match(prompts[id], /Topic: Elizabeth I/);
    assert.ok(prompts[id].includes(INTENT_HEADING));
  });
});

test("S5: Design Episode Plan still receives no projected parameters", () => {
  // Derived-shell step: S2's projection exclusion is unchanged by adding Goal.
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH, goal: RUNTIME_GOAL } };
  const ep = assembleAllSteps(api, wf).ep_step;
  assert.doesNotMatch(ep, /Topic: Elizabeth I/);
  assert.equal(ep.includes(INTENT_HEADING), false);
});

// ---------------------------------------------------------------------------
// Upstream assessment boundary
// ---------------------------------------------------------------------------

test("S5: Goal prose is assessment-sanitised for foundation upstream steps", () => {
  const wf = buildWorkflow();
  api.setWorkflowAdjustmentParameterValue(
    wf,
    "goal",
    "Create a resource on Elizabeth I with 10 formative assessment questions and model answers."
  );
  const prompts = assembleAllSteps(api, wf);

  // Model Knowledge is a foundation upstream step, so the projected intent runs
  // through the *same pre-existing* sanitiser the step-1 commissioning context
  // has always used. S5 deliberately does not retune that sanitiser (§10/§20),
  // so this asserts the cues it actually removes rather than an ideal.
  assert.ok(prompts.mk_step.includes(INTENT_HEADING));
  assert.doesNotMatch(prompts.mk_step, /model answers/, "high-leak cue is stripped");
  assert.match(prompts.mk_step, /Elizabeth I/, "the subject survives sanitisation");

  // A downstream assessment step is entitled to the full, unsanitised intent.
  assert.match(prompts.gai_step, /formative assessment questions/);
  assert.match(prompts.gai_step, /model answers/);
});

test("S5: upstream sanitisation of Goal matches the pre-S5 step-1 treatment", () => {
  // Equivalence check: whatever the old ungoverned `Goal:` line would have shown
  // an upstream step, the projected intent block shows the same prose.
  const wf = buildWorkflow();
  const rich =
    "Create a resource on Elizabeth I with 10 formative assessment questions and model answers.";
  api.setWorkflowAdjustmentParameterValue(wf, "goal", rich);
  const sanitised = api.sanitizeAssessmentCuesForUpstreamContext(rich).trim();
  const entries = api.buildEffectiveWorkflowIntentEntries(wf, wf.steps[0]);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].value, sanitised);

  // Non-upstream steps get it verbatim.
  const downstream = api.buildEffectiveWorkflowIntentEntries(wf, wf.steps[2]);
  assert.equal(downstream[0].value, rich);
});

// ---------------------------------------------------------------------------
// Capability boundary (§13)
// ---------------------------------------------------------------------------

test("S5: a runtime Goal cannot change what the workflow is capable of producing", () => {
  const wf = buildWorkflow();
  const titlesBefore = wf.steps.map((s) => s.title);

  // Goal asks to drop assessment and become a live workshop.
  api.setWorkflowAdjustmentParameterValue(
    wf,
    "goal",
    "Run a live workshop on Elizabeth I with no assessment at all."
  );
  assembleAllSteps(api, wf);
  assert.deepEqual(plain(wf.steps.map((s) => s.title)), plain(titlesBefore));
  assert.equal(wf.workflowBriefResolution.resolvedFactors.assessment_required, true);
  assert.equal(wf.workflowBriefResolution.resolvedFactors.delivery_mode, "async");

  // And the prompt says so, so the author is not led to expect recompilation.
  const first = assembleAllSteps(api, wf).mk_step;
  assert.ok(first.includes(CAPABILITY_CLAUSE));
});

test("S5: a workflow with no assessment stage gains none from a Goal asking for one", () => {
  const wf = buildWorkflow();
  wf.steps = wf.steps.filter((s) => s.id !== "gai_step");
  api.setWorkflowAdjustmentParameterValue(
    wf,
    "goal",
    "Create a resource on Durkheim with 10 formative assessment questions."
  );
  const prompts = assembleAllSteps(api, wf);
  assert.equal(wf.steps.length, 3, "no stage was added");
  assert.deepEqual(
    plain(wf.steps.map((s) => s.canonical_step_id)),
    ["step_model_knowledge", "step_design_learning_activities", "step_design_episode_plan"]
  );
  // No step is asked to emit assessment items, because none is an assessment
  // step. The Goal is context; it cannot create a stage or an output contract.
  Object.keys(prompts).forEach((id) => {
    assert.doesNotMatch(
      prompts[id],
      /STEP \d+ OUTPUT: assessment/i,
      id + " must not acquire an assessment output contract"
    );
  });
  assert.equal(api.resolveEffectiveRunContext(wf).provenance.goal, "adjustment");
});

// ---------------------------------------------------------------------------
// UI honesty and Auto behaviour (§14)
// ---------------------------------------------------------------------------

test("S5: Goal renders as a distinct multiline control with Auto semantics", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);

  const topicInput = findAdjustmentInput(nodes, "topic");
  const goalInput = findAdjustmentInput(nodes, "goal");
  assert.ok(topicInput && goalInput, "both parameters render");

  // Visibly a different kind of thing.
  assert.equal(goalInput.tagName, "TEXTAREA");
  assert.equal(topicInput.tagName, "INPUT");
  assert.ok(goalInput.rows >= 2, "Goal is multiline");

  // Auto: blank field, commissioned value as contextual placeholder only.
  assert.equal(goalInput.value, "", "Auto is an empty field");
  assert.match(goalInput.placeholder, /Auto/);
  assert.ok(goalInput.placeholder.includes(COMMISSIONED_GOAL));
  assert.equal(api.getWorkflowAdjustmentParameters(wf).goal, undefined);

  // Distinct, non-implementation help text for each.
  const text = allText(nodes);
  assert.match(text, /What you want this run of the workflow to achieve/);
  assert.match(text, /The subject this workflow generates for/);
  assert.doesNotMatch(text, /initialBrief/, "no implementation terminology");
  assert.doesNotMatch(text, /workflowOutputSpec/);
  assert.doesNotMatch(text, /resolvedFactors/);

  // Typing stores an explicit value; clearing restores Auto.
  goalInput.value = RUNTIME_GOAL;
  goalInput.fire("input");
  assert.equal(api.getWorkflowAdjustmentParameters(wf).goal, RUNTIME_GOAL);
  goalInput.value = "";
  goalInput.fire("input");
  assert.equal(wf.adjustments, undefined, "clearing restores Auto");
});

// ---------------------------------------------------------------------------
// Persistence lifecycle
// ---------------------------------------------------------------------------

test("S5: an explicit Goal survives normalization, duplication and export shapes", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { goal: RUNTIME_GOAL, topic: ELIZABETH } };

  const normalized = api.normalizeWorkflowForV1(JSON.parse(JSON.stringify(wf)), []);
  assert.equal(normalized.adjustments.parameters.goal, RUNTIME_GOAL);
  assert.equal(normalized.adjustments.parameters.topic, ELIZABETH);
  assert.equal(
    normalized.workflowBriefResolution.initialBrief.goal,
    COMMISSIONED_GOAL,
    "the frozen commissioning prose survives normalization"
  );

  // Unknown parameters are still dropped rather than retained as authority.
  const withJunk = api.normalizeWorkflowAdjustments({
    version: 1,
    parameters: { goal: RUNTIME_GOAL, not_declared: "x" }
  });
  assert.deepEqual(plain(withJunk.parameters), { goal: RUNTIME_GOAL });
});

test("S5: no fetch, no AI and no elicitation anywhere in this suite", () => {
  assert.equal(loaded.fetchCalls.length, 0);
});

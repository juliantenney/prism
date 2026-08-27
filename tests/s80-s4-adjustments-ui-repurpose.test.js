/**
 * Sprint 80 S4 — Adjustments UI repurpose.
 *
 * Covers the four things S4 changes:
 *   1. the historical pack-derived Settings catalogue leaves the active surface;
 *   2. the panel becomes Adjustments (typed parameters + per-step guidance);
 *   3. Design Episode Plan gains Additional Instruction (operator correction
 *      superseding the S2/S3 exclusion);
 *   4. step 1 no longer presents stale commissioning prose beside an explicitly
 *      adjusted typed parameter.
 *
 * Instructions / step.notes is a retained supported capability throughout and is
 * asserted to be distinct from step.additional_instruction in both storage and
 * presentation.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const INSTRUCTION_HEADING = "Author additional instruction for this step.";
const CONTEXT_HEADING = "Authoritative workflow parameters for this run:";

const HENRY = "Henry VIII";
const ELIZABETH = "Elizabeth I";
const COMMISSIONED_GOAL =
  "Introduce learners to the reign of Henry VIII and the English Reformation.";

function createElementStub(tagName) {
  const el = {
    value: "",
    textContent: "",
    className: "",
    placeholder: "",
    type: "",
    rows: 0,
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
    /** Fire a listener the way a real input event would. */
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
 * Workflow spanning the stages S4 touches. Commissioned for Henry VIII with a
 * Goal written around that topic, so the step-1 staleness repair is observable.
 */
function buildWorkflow() {
  return {
    id: "wf-s80-s4",
    name: "S4 Adjustments coverage",
    goal: COMMISSIONED_GOAL,
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
      // S80-S5: the frozen commissioning prose. This is now the commissioned
      // source for the Goal parameter, so the fixture carries it explicitly.
      initialBrief: { goal: COMMISSIONED_GOAL, designIntent: COMMISSIONED_GOAL },
      resolvedFactors: { topic: HENRY, learner_level: "undergraduate" }
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
        id: "custom_step",
        title: "My own hand-rolled step",
        outputName: "notes_out",
        prompt_source_type: "local_override",
        override_prompt_body: "Do the custom thing.",
        notes: "CUSTOM-NOTES-SENTINEL"
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

/** Render the Adjustments panel and return every rendered stub node. */
function renderPanel(loaded, wf) {
  const api = loaded.api;
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const root = loaded.elementStore.get("unifiedWorkflowSettingsOptions");
  root.children.length = 0;
  api.renderUnifiedWorkflowSettingsUI();
  return { root, nodes: flattenElements(root) };
}

function findByRole(nodes, role) {
  return nodes.filter((n) => n.getAttribute("data-role") === role);
}

function findByField(nodes, field) {
  return nodes.filter((n) => n.getAttribute("data-field") === field);
}

/**
 * Structural comparison across the vm realm boundary.
 * `deepEqual` compares prototypes, so a sandbox-created object never matches a
 * test-realm literal even when the contents are identical (D-014 note).
 */
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
// Adjustments surface (S4 §1, §3, §13)
// ---------------------------------------------------------------------------

test("S4: workflow Settings is presented as Adjustments in the markup", () => {
  const html = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  const tabAt = html.indexOf('id="workflowModeSettingsBtn"');
  assert.ok(tabAt > 0, "workflow mode tab must exist");
  const tab = html.slice(tabAt, tabAt + 800);
  assert.match(tab, /Adjustments/);
  assert.doesNotMatch(tab, />\s*Settings\s*</);
  assert.doesNotMatch(tab, /pack-defined/);

  const panelAt = html.indexOf('id="unifiedWorkflowSettingsPanel"');
  assert.ok(panelAt > 0, "the panel must exist");
  const panel = html.slice(panelAt, panelAt + 1200);
  assert.match(panel, /Adjustments/);
  assert.doesNotMatch(panel, /pack-defined parameters/);
});

test("S4: unrelated application Settings terminology is untouched", () => {
  const html = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  // The API key panel is a different product concept and must keep its identity.
  assert.match(html, /id="apiSettings"/);
  assert.match(html, /class="api-settings/);
});

test("S4: historical pack-derived Settings controls no longer render", () => {
  const wf = buildWorkflow();
  // Pack metadata that would previously have produced a full control catalogue.
  wf.workflowBriefResolution.briefConfig = {
    workflowParameterControls: [
      {
        key: "delivery_context",
        label: "Delivery context",
        controlType: "text",
        default: "",
        visible: true,
        elicitation: "settings-only"
      }
    ],
    stepParameterControls: [
      {
        key: "dla_difficulty",
        canonicalStepId: "step_design_learning_activities",
        label: "Activity difficulty",
        controlType: "text",
        default: "",
        visible: true,
        elicitation: "settings-only"
      }
    ]
  };
  const { nodes } = renderPanel(loaded, wf);

  // No pack control is rendered, under any scope.
  assert.equal(
    nodes.filter((n) => n.getAttribute("data-workflow-pack-param") === "1").length,
    0
  );
  const text = allText(nodes);
  assert.doesNotMatch(text, /Delivery context/);
  assert.doesNotMatch(text, /Activity difficulty/);
  // No implementation vocabulary leaks into the surface.
  [/PRISM_STEP_PARAMS/, /resolvedFactors/, /workflowContext/, /registry/i, /canonical assembler/i].forEach(
    (pattern) => assert.doesNotMatch(text, pattern)
  );
});

test("S4: no historical Settings control becomes runtime-effective", () => {
  const wf = buildWorkflow();
  wf.notes = "[PRISM_STEP_PARAMS]\ndla_difficulty: hard\n[/PRISM_STEP_PARAMS]";
  wf.steps[3].notes = "[PRISM_STEP_PARAMS]\ndla_difficulty: hard\n[/PRISM_STEP_PARAMS]";
  const prompts = assembleAllSteps(api, wf);
  Object.keys(prompts).forEach((id) => {
    assert.doesNotMatch(prompts[id], /Authoritative workflow parameters[\s\S]*dla_difficulty/);
  });
  // The panel does not promote the stored legacy block into Adjustments either.
  const { nodes } = renderPanel(loaded, wf);
  assert.equal(api.getWorkflowAdjustmentParameters(wf).dla_difficulty, undefined);
  assert.doesNotMatch(allText(nodes), /dla_difficulty/);
});

test("S4: badge is a semantic marker rather than a control count", () => {
  const wf = buildWorkflow();
  const badge = loaded.elementStore.get("workflowModeSettingsBadge");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  api.refreshWorkflowModeSettingsTabBadge();
  assert.equal(badge.classList.contains("hidden"), true, "all-automatic shows no badge");
  assert.equal(badge.textContent, "");

  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  api.refreshWorkflowModeSettingsTabBadge();
  assert.equal(badge.classList.contains("hidden"), false);
  assert.equal(badge.textContent, "Customised");
  // Never a bare number.
  assert.doesNotMatch(badge.textContent, /^\d+$/);
});

test("S4: empty Adjustments state still renders a usable panel", () => {
  const wf = buildWorkflow();
  delete wf.adjustments;
  wf.steps.forEach((s) => delete s.additional_instruction);
  const { nodes } = renderPanel(loaded, wf);

  assert.equal(api.countExplicitWorkflowAdjustments(wf), 0);
  assert.equal(findByRole(nodes, "adjustments-workflow-parameters").length, 1);
  assert.equal(findByRole(nodes, "adjustments-workflow-steps").length, 1);
  // Topic, Goal, Duration and Audience are offered even though nothing is set.
  assert.equal(findByField(nodes, "adjustmentParameter").length, 4);
});

// ---------------------------------------------------------------------------
// Workflow parameters (S4 §4)
// ---------------------------------------------------------------------------

test("S4: Topic renders declaratively from the registry", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const inputs = findByField(nodes, "adjustmentParameter");
  assert.equal(inputs.length, 4, "exactly the declared workflowContext parameters");
  assert.deepEqual(
    plain(inputs.map((n) => n.getAttribute("data-adjustment-id"))),
    ["topic", "goal", "duration_minutes", "audience"]
  );

  // Driven by declaration metadata, not by a hardcoded Topic branch: a second
  // declaration renders through the same path with no UI change.
  api.setAdjustmentsRegistryForTest(
    api.getAdjustmentsParameterRegistry().concat([
      {
        id: "second_param",
        label: "Second parameter",
        help: "Proves the extension path.",
        type: "text",
        owner: "workflow_run_context",
        projection: "workflowContext",
        applicability: { always: true }
      }
    ])
  );
  try {
    const again = renderPanel(loaded, buildWorkflow());
    const ids = findByField(again.nodes, "adjustmentParameter").map((n) =>
      n.getAttribute("data-adjustment-id")
    );
    assert.deepEqual(plain(ids).slice().sort(), [
      "audience",
      "duration_minutes",
      "goal",
      "second_param",
      "topic"
    ]);
    assert.match(allText(again.nodes), /Second parameter/);
  } finally {
    api.resetAdjustmentsRegistryForTest();
  }
});

test("S4: blank Topic means Auto and shows the commissioned value as placeholder", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const input = findByField(nodes, "adjustmentParameter")[0];

  assert.equal(input.value, "", "Auto is represented by an empty field");
  assert.match(input.placeholder, /Henry VIII/, "commissioned value is contextual only");
  // The commissioned value is not stored as an explicit adjustment.
  assert.equal(api.getWorkflowAdjustmentParameters(wf).topic, undefined);
  assert.equal(wf.adjustments, undefined);

  const effective = api.resolveEffectiveRunContext(wf);
  assert.equal(effective.parameters.topic, HENRY);
  assert.equal(effective.provenance.topic, "commissioned");
});

test("S4: typing a Topic persists it, clearing it restores Auto", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const input = findByField(nodes, "adjustmentParameter")[0];

  input.value = ELIZABETH;
  input.fire("input");
  assert.equal(api.getWorkflowAdjustmentParameters(wf).topic, ELIZABETH);
  let effective = api.resolveEffectiveRunContext(wf);
  assert.equal(effective.parameters.topic, ELIZABETH);
  assert.equal(effective.provenance.topic, "adjustment");

  input.value = "";
  input.fire("input");
  assert.equal(api.getWorkflowAdjustmentParameters(wf).topic, undefined);
  effective = api.resolveEffectiveRunContext(wf);
  assert.equal(effective.parameters.topic, HENRY);
  assert.equal(effective.provenance.topic, "commissioned");
});

// ---------------------------------------------------------------------------
// Instructions vs Additional Instruction (S4 §6, §7)
// ---------------------------------------------------------------------------

test("S4: Instructions and Additional Instruction are separate fields per step", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);

  // Every step offers Instructions; every step here also offers steering.
  assert.equal(findByRole(nodes, "adjustments-instructions").length, wf.steps.length);
  assert.equal(
    findByRole(nodes, "adjustments-additional-instruction").length,
    wf.steps.length
  );
  // Distinct textareas, so the two mechanisms cannot be conflated in the DOM.
  assert.equal(findByField(nodes, "adjustmentsNotes").length, wf.steps.length);
  assert.equal(
    findByField(nodes, "adjustmentsAdditionalInstruction").length,
    wf.steps.length
  );
});

test("S4: labels and help explain the difference without internal vocabulary", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const text = allText(nodes);

  assert.match(text, /Instructions \(optional\)/);
  assert.match(text, /Additional instruction \(optional\)/);
  // The operator-specified guidance meaning for Additional Instruction.
  assert.match(text, /influence choices PRISM can make when generating this step/);
  assert.match(
    text,
    /cannot override workflow parameters, required output structure, or information established by earlier steps/
  );
  // Instructions keeps its general-purpose framing and is not called legacy.
  assert.match(text, /steps you have written yourself/);
  assert.doesNotMatch(text, /legacy|deprecated|obsolete/i);
});

test("S4: the two fields write to their own storage keys", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const mkCard = nodes.find((n) => n.getAttribute("data-unified-step-id") === "mk_step");
  const cardNodes = flattenElements(mkCard);
  const notes = findByField(cardNodes, "adjustmentsNotes")[0];
  const steering = findByField(cardNodes, "adjustmentsAdditionalInstruction")[0];

  notes.value = "MK-NOTES-SENTINEL";
  notes.fire("input");
  steering.value = "MK-STEERING-SENTINEL";
  steering.fire("input");

  const mk = wf.steps.find((s) => s.id === "mk_step");
  assert.equal(mk.notes, "MK-NOTES-SENTINEL");
  assert.equal(mk.additional_instruction, "MK-STEERING-SENTINEL");
  // No merging in either direction, and no notes-tag write.
  assert.doesNotMatch(mk.notes, /MK-STEERING-SENTINEL/);
  assert.doesNotMatch(mk.additional_instruction, /MK-NOTES-SENTINEL/);
  assert.doesNotMatch(String(mk.notes), /PRISM_STEP_PARAMS/);
});

test("S4: existing step.notes runtime semantics are unchanged", () => {
  const wf = buildWorkflow();
  const baseline = assembleAllSteps(api, wf);
  // The hand-rolled step's notes still reach its prompt exactly as before.
  assert.match(baseline.custom_step, /CUSTOM-NOTES-SENTINEL/);
  // Notes are not wrapped in the subordinate steering block.
  assert.doesNotMatch(baseline.custom_step, new RegExp(INSTRUCTION_HEADING));
});

// ---------------------------------------------------------------------------
// Episode Plan correction (S4 §8-§11)
// ---------------------------------------------------------------------------

test("S4: Episode Plan exposes Additional Instruction in the panel", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const epCard = nodes.find((n) => n.getAttribute("data-unified-step-id") === "ep_step");
  assert.ok(epCard, "Episode Plan must appear in the panel");
  const cardNodes = flattenElements(epCard);
  assert.equal(findByRole(cardNodes, "adjustments-additional-instruction").length, 1);
});

test("S4: EP Additional Instruction stores in step.additional_instruction", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const epCard = nodes.find((n) => n.getAttribute("data-unified-step-id") === "ep_step");
  const steering = findByField(
    flattenElements(epCard),
    "adjustmentsAdditionalInstruction"
  )[0];

  steering.value = "Keep the learning arc relatively flat for an introductory resource.";
  steering.fire("input");

  const ep = wf.steps.find((s) => s.id === "ep_step");
  assert.equal(
    ep.additional_instruction,
    "Keep the learning arc relatively flat for an introductory resource."
  );
  assert.equal(ep.notes, undefined, "steering must not be written into notes");
});

test("S4: EP Additional Instruction reaches the EP prompt via the shared block", () => {
  const wf = buildWorkflow();
  const ep = wf.steps.find((s) => s.id === "ep_step");
  ep.additional_instruction = "EP-ARC-SENTINEL";
  const prompts = assembleAllSteps(api, wf);

  assert.match(prompts.ep_step, /EP-ARC-SENTINEL/);
  // The same S3 helper output, verbatim — no bespoke EP mechanism.
  const shared = api.buildStepAdditionalInstructionBlock(ep);
  assert.ok(shared.includes("EP-ARC-SENTINEL"));
  assert.ok(
    prompts.ep_step.includes(shared),
    "EP must embed the shared subordinate block unchanged"
  );
});

test("S4: EP instruction does not leak into any other step", () => {
  const wf = buildWorkflow();
  wf.steps.find((s) => s.id === "ep_step").additional_instruction = "EP-ARC-SENTINEL";
  const prompts = assembleAllSteps(api, wf);
  ["mk_step", "lo_step", "dla_step", "custom_step"].forEach((id) => {
    assert.doesNotMatch(prompts[id], /EP-ARC-SENTINEL/, id + " must not see EP steering");
    assert.doesNotMatch(prompts[id], new RegExp(INSTRUCTION_HEADING));
  });
});

test("S4: authoritative upstream material precedes the EP subordinate block", () => {
  const wf = buildWorkflow();
  const ep = wf.steps.find((s) => s.id === "ep_step");
  ep.additional_instruction = "Only create Understand activities.";
  const prompts = assembleAllSteps(api, wf);
  const prompt = prompts.ep_step;

  const blockAt = prompt.indexOf(INSTRUCTION_HEADING);
  assert.ok(blockAt > 0, "the block must be present");
  // Upstream learning-outcome authority and the output contract come first.
  const outcomesAt = prompt.indexOf("learning_outcomes");
  assert.ok(outcomesAt >= 0 && outcomesAt < blockAt, "upstream outcomes precede steering");
  // The subordinate wording is what prevents the instruction invalidating them.
  const tail = prompt.slice(blockAt);
  assert.match(tail, /subordinate to/);
  assert.match(tail, /authoritative upstream artefacts/);
  assert.match(tail, /preserve the requirements and ignore the conflicting part/);
});

test("S4: empty EP Additional Instruction preserves the accepted baseline", () => {
  const withoutField = assembleAllSteps(api, buildWorkflow()).ep_step;

  const blank = buildWorkflow();
  blank.steps.find((s) => s.id === "ep_step").additional_instruction = "   ";
  const withBlank = assembleAllSteps(api, blank).ep_step;

  assert.equal(withBlank, withoutField, "a blank instruction must be a no-op");
  assert.doesNotMatch(withoutField, new RegExp(INSTRUCTION_HEADING));
  // EP still receives no projected workflow parameters.
  assert.doesNotMatch(withoutField, new RegExp(CONTEXT_HEADING));
});

test("S4: eligibility rule separates steering from parameter projection", () => {
  const wf = buildWorkflow();
  const ep = wf.steps.find((s) => s.id === "ep_step");

  // Steering: every step with an author-facing prompt, including EP.
  wf.steps.forEach((step) => {
    assert.equal(api.isWorkflowStepEligibleForAdditionalInstruction(step), true);
  });
  // Projection: EP is a derived shell, so it is still excluded.
  assert.equal(api.isWorkflowStepEligibleForWorkflowContextProjection(ep), false);
  wf.steps
    .filter((s) => s.id !== "ep_step")
    .forEach((step) => {
      assert.equal(api.isWorkflowStepEligibleForWorkflowContextProjection(step), true);
    });
  // Non-objects are never eligible for either.
  assert.equal(api.isWorkflowStepEligibleForAdditionalInstruction(null), false);
  assert.equal(api.isWorkflowStepEligibleForWorkflowContextProjection(null), false);
});

// ---------------------------------------------------------------------------
// Stale step-1 commissioning context (S4 §12)
// ---------------------------------------------------------------------------

// SUPERSEDED BY S80-S5 §12. S4 made Topic responsible for deleting the
// commissioned Goal line, because Goal had no governance of its own. Goal is now
// a declared parameter with its own provenance, so Topic no longer discards the
// author's stated intent and the ungoverned step-1 `Goal:` line no longer
// exists. These assertions are updated to the governed model rather than kept.
test("S5 (was S4): Topic no longer deletes the commissioned Goal", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };

  // Topic declares no supersession any more.
  assert.deepEqual(plain(api.getSupersededCommissionedContextFields(wf)), {});

  const prompts = assembleAllSteps(api, wf);
  const first = prompts.mk_step;
  // The adjusted Topic is authoritative...
  assert.match(first, /Topic: Elizabeth I/);
  // ...and the commissioned intent survives as subordinate context rather than
  // being deleted, with precedence stated structurally.
  assert.match(first, /Workflow-wide intent for this run \(Goal\):/);
  assert.match(first, /subordinate to the authoritative workflow parameters above/);
  // The ungoverned commissioning `Goal:` line is gone for good (D4).
  assert.doesNotMatch(first, /^Goal: /m);
});

test("S5 (was S4): unrelated commissioning context is preserved when Topic is adjusted", () => {
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  const context = api.buildWorkflowRuntimeContextText(wf, wf.steps[0], 1);

  assert.doesNotMatch(context, /^Goal: /m, "Goal is projected as a parameter, not here");
  // S80-S7 §9: Audience is governed too now, so it is likewise projected as a
  // parameter rather than emitted here. Constraints remain the unrelated
  // commissioning field this test exists to protect.
  assert.doesNotMatch(context, /^Audience: /m, "Audience is projected as a parameter, not here");
  assert.match(context, /library visit/, "constraints are unrelated and retained");
});

test("S5 (was S4): the commissioned Goal reaches the prompt when Goal is on Auto", () => {
  const wf = buildWorkflow();
  assert.deepEqual(plain(api.getSupersededCommissionedContextFields(wf)), {});
  const first = assembleAllSteps(api, wf).mk_step;
  assert.match(first, /Workflow-wide intent for this run \(Goal\):/);
  assert.match(first, /English Reformation/);
  // Never through the old ungoverned commissioning line.
  assert.doesNotMatch(
    api.buildWorkflowRuntimeContextText(wf, wf.steps[0], 1),
    /^Goal: /m
  );
});

test("S5: the supersession mechanism survives, with no declaration using it", () => {
  const topic = api
    .getAdjustmentsParameterRegistry()
    .find((row) => row.id === "topic");
  assert.deepEqual(plain(topic.supersedesCommissionedContextFields), []);
  const goal = api.getAdjustmentsParameterRegistry().find((row) => row.id === "goal");
  assert.deepEqual(plain(goal.supersedesCommissionedContextFields), []);

  // A parameter that declares no supersession suppresses nothing.
  api.setAdjustmentsRegistryForTest([
    {
      id: "harmless",
      label: "Harmless",
      type: "text",
      owner: "workflow_run_context",
      projection: "workflowContext",
      applicability: { always: true }
    }
  ]);
  try {
    const wf = buildWorkflow();
    wf.adjustments = { version: 1, parameters: { harmless: "x" } };
    assert.deepEqual(plain(api.getSupersededCommissionedContextFields(wf)), {});
  } finally {
    api.resetAdjustmentsRegistryForTest();
  }

  // The mechanism itself is still live and generic, ready for a future typed
  // parameter that does need to supersede a commissioned field.
  //
  // S80-S7 §9 note: this probe used to supersede `audience`, but Audience is now
  // a governed parameter and its step-1 line was removed outright, which would
  // make that assertion pass vacuously. `constraints` is still emitted at step 1,
  // so it proves the mechanism genuinely suppresses a live commissioned field.
  api.setAdjustmentsRegistryForTest([
    {
      id: "constraints_probe",
      label: "Constraints probe",
      type: "text",
      owner: "workflow_run_context",
      projection: "workflowContext",
      applicability: { always: true },
      supersedesCommissionedContextFields: ["constraints"]
    }
  ]);
  try {
    const wf = buildWorkflow();
    // Baseline: the commissioned constraints line is present without the probe.
    assert.match(api.buildWorkflowRuntimeContextText(wf, wf.steps[0], 1), /library visit/);

    wf.adjustments = { version: 1, parameters: { constraints_probe: "No external tools" } };
    assert.deepEqual(plain(api.getSupersededCommissionedContextFields(wf)), {
      constraints: true
    });
    const context = api.buildWorkflowRuntimeContextText(wf, wf.steps[0], 1);
    assert.doesNotMatch(context, /library visit/);
  } finally {
    api.resetAdjustmentsRegistryForTest();
  }
});

// ---------------------------------------------------------------------------
// Safety (S4 §14, §15)
// ---------------------------------------------------------------------------

test("S4: no PRISM_STEP_PARAMS write is introduced by the panel", () => {
  const wf = buildWorkflow();
  const { nodes } = renderPanel(loaded, wf);
  const notesBefore = wf.steps.map((s) => String(s.notes || ""));

  findByField(nodes, "adjustmentsAdditionalInstruction").forEach((area) => {
    area.value = "steering";
    area.fire("input");
  });
  const input = findByField(nodes, "adjustmentParameter")[0];
  input.value = ELIZABETH;
  input.fire("input");

  wf.steps.forEach((step, i) => {
    assert.doesNotMatch(String(step.notes || ""), /PRISM_STEP_PARAMS/);
    assert.equal(String(step.notes || ""), notesBefore[i], "notes untouched by steering");
  });
  assert.doesNotMatch(String(wf.notes || ""), /PRISM_STEP_PARAMS/);
});

test("S4: no AI, API or fetch call is introduced", () => {
  const before = loaded.fetchCalls.length;
  const wf = buildWorkflow();
  wf.adjustments = { version: 1, parameters: { topic: ELIZABETH } };
  wf.steps.find((s) => s.id === "ep_step").additional_instruction = "EP-ARC-SENTINEL";

  const { nodes } = renderPanel(loaded, wf);
  const input = findByField(nodes, "adjustmentParameter")[0];
  input.value = "Another topic";
  input.fire("input");
  assembleAllSteps(api, wf);
  api.refreshWorkflowModeSettingsTabBadge();

  assert.equal(loaded.fetchCalls.length, before, "no network call may occur");
});

test("S4: with no Adjustments set, prompts keep the accepted post-S2 behaviour", () => {
  const bare = buildWorkflow();
  const baseline = assembleAllSteps(api, bare);

  const touched = buildWorkflow();
  // Rendering the panel must not itself change any prompt.
  renderPanel(loaded, touched);
  const after = assembleAllSteps(api, touched);

  Object.keys(baseline).forEach((id) => {
    assert.equal(after[id], baseline[id], id + " must be unchanged by S4");
  });
  // Commissioned Topic still reaches model-driven steps; EP still does not.
  assert.match(baseline.mk_step, /Henry VIII/);
  assert.doesNotMatch(baseline.ep_step, new RegExp(CONTEXT_HEADING));
});

test("S4: resolvedFactors are never mutated by the Adjustments surface", () => {
  const wf = buildWorkflow();
  const snapshot = JSON.stringify(wf.workflowBriefResolution.resolvedFactors);
  const { nodes } = renderPanel(loaded, wf);
  const input = findByField(nodes, "adjustmentParameter")[0];
  input.value = ELIZABETH;
  input.fire("input");
  assembleAllSteps(api, wf);
  assert.equal(JSON.stringify(wf.workflowBriefResolution.resolvedFactors), snapshot);
});

/**
 * Sprint 80 S3 — Adjustments: generic per-step Additional Instruction.
 *
 * Proves through live prompt assembly (not helper-only calls): the instruction
 * reaches MK / DLA / DP / assessment prompts via I1 and GAM via I2; it is
 * step-scoped and does not leak; deterministic Episode Plan neither exposes nor
 * consumes it; canonical and output-contract text keeps precedence; absent
 * instructions leave prompts byte-identical; and no model call is introduced.
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
const SUBORDINATE_MARKER = "Apply this instruction only where this step has legitimate discretion.";

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
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
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    hasAttribute() {
      return false;
    },
    getAttribute() {
      return null;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
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
  return { api: sandbox.window.__PRISM_TEST_API, sandbox, fetchCalls };
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
 * A workflow covering every step type S3 must serve.
 * Model-driven steps carry an override body so ordinary assembly produces text.
 */
function buildWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-s80-s3",
      name: "S3 coverage",
      goal: "Prove per-step additional instruction",
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      workflowOutputSpec: {
        goal: "Prove per-step additional instruction",
        pageEnrichmentV2: true,
        partialPageOutputs: true
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
          id: "dp_step",
          title: "Design Page",
          outputName: "page",
          canonical_step_id: "step_design_page",
          prompt_source_type: "local_override",
          override_prompt_body: "Assemble the learner page."
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
    },
    overrides || {}
  );
}

function stepIndexById(wf, stepId) {
  return wf.steps.findIndex((s) => s.id === stepId);
}

/**
 * Assemble one step's prompt through the live Copy path, optionally with an
 * instruction set on a chosen step.
 */
function assembleStepPrompt(api, options) {
  const opts = options || {};
  const wf = buildWorkflow();
  if (opts.instructionStepId) {
    const target = wf.steps.find((s) => s.id === opts.instructionStepId);
    target.additional_instruction = opts.instruction;
  }
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest
    ? api.setWorkflowRunCapturedOutputsForTest({ dla_step: DLA_PAGE_JSON })
    : null;
  const step = wf.steps.find((s) => s.id === opts.assembleStepId);
  const index = stepIndexById(wf, opts.assembleStepId) + 1;
  return api.buildWorkflowStepInstructions(step, index, null);
}

const loaded = loadPrismTestApi();
const api = loaded.api;

// ---------------------------------------------------------------------------
// Storage + availability contract
// ---------------------------------------------------------------------------

test("S3: instruction is stored in its own field, never in notes", () => {
  const normalized = api.normalizeWorkflowForV1(
    {
      id: "wf-store",
      name: "Store",
      steps: [
        {
          id: "mk_step",
          title: "Model Knowledge",
          notes: "Designer notes stay here.",
          additional_instruction: "  Prioritise competing interpretations.  "
        }
      ]
    },
    []
  );
  const step = normalized.steps[0];
  assert.equal(step.additional_instruction, "Prioritise competing interpretations.");
  assert.equal(step.notes, "Designer notes stay here.");
  assert.doesNotMatch(step.notes, /competing interpretations/);
  assert.doesNotMatch(JSON.stringify(normalized), /PRISM_STEP_PARAMS/);
});

test("S3: empty instruction is omitted so existing records keep their shape", () => {
  const normalized = api.normalizeWorkflowForV1(
    {
      id: "wf-empty",
      name: "Empty",
      steps: [
        { id: "a", title: "Model Knowledge", additional_instruction: "   " },
        { id: "b", title: "Define Learning Outcomes" }
      ]
    },
    []
  );
  normalized.steps.forEach((step) => {
    assert.equal(
      Object.prototype.hasOwnProperty.call(step, "additional_instruction"),
      false,
      "absent/blank instruction must not persist a key"
    );
  });
});

test("S3: gather omits blank instructions and preserves stored ones", () => {
  const wf = buildWorkflow();
  wf.steps.find((s) => s.id === "mk_step").additional_instruction = "Keep this steering.";
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const gathered = api.gatherWorkflowDetailFormDataForTest();

  // The step editor is not rendered in this harness, so gather must fall back to
  // the stored value rather than clearing it.
  gathered.steps.forEach((step) => {
    if (step.id === "mk_step") {
      assert.equal(step.additional_instruction, "Keep this steering.");
    } else {
      assert.equal(
        Object.prototype.hasOwnProperty.call(step, "additional_instruction"),
        false,
        "blank instruction must not be gathered as an empty key"
      );
    }
  });
});

// ---------------------------------------------------------------------------
// S80-S4 §8/§11 — OPERATOR CORRECTION, not regression-papering.
//
// S3 shipped with Episode Plan excluded from Additional Instruction on the rule
// "deterministic step => no steering". The operator has superseded that
// decision: Episode Plan is an important upstream learning-design stage whose
// learning arc shapes the whole downstream resource, and manual experimentation
// showed natural-language steering measurably changes it. The two assertions
// below previously asserted EP exclusion and now assert EP inclusion.
// ---------------------------------------------------------------------------

test("S4: Episode Plan is now eligible for Additional Instruction", () => {
  const wf = buildWorkflow();
  const ep = wf.steps.find((s) => s.id === "ep_step");
  const mk = wf.steps.find((s) => s.id === "mk_step");
  const gam = wf.steps.find((s) => s.id === "gam_step");

  assert.equal(api.stepSupportsAdditionalInstruction(ep), true);
  assert.equal(api.isWorkflowStepEligibleForAdditionalInstruction(ep), true);

  // EP remains a derived-shell step, so it still receives no projected
  // workflow parameters. Only the steering eligibility changed.
  assert.equal(api.isDerivedShellWorkflowStep(ep), true);
  assert.equal(api.isWorkflowStepEligibleForWorkflowContextProjection(ep), false);

  [mk, gam].forEach((step) => {
    assert.equal(api.stepSupportsAdditionalInstruction(step), true);
    assert.equal(api.isDerivedShellWorkflowStep(step), false);
    assert.equal(api.isWorkflowStepEligibleForWorkflowContextProjection(step), true);
  });
});

test("S4: Episode Plan consumes a stored instruction through the shared block", () => {
  const wf = buildWorkflow();
  const ep = wf.steps.find((s) => s.id === "ep_step");
  ep.additional_instruction = "EP-STEERING-SENTINEL";
  assert.equal(api.getStepAdditionalInstruction(ep), "EP-STEERING-SENTINEL");

  // Same shared helper as every other step — no bespoke EP mechanism.
  const block = api.buildStepAdditionalInstructionBlock(ep);
  assert.match(block, new RegExp(INSTRUCTION_HEADING));
  assert.match(block, /EP-STEERING-SENTINEL/);
  assert.equal(
    api.appendStepAdditionalInstructionBlockToPrompt("canonical text", ep),
    "canonical text\n" + block
  );

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const prompt = api.buildWorkflowStepInstructions(ep, 3, null);
  assert.match(prompt, /EP-STEERING-SENTINEL/);
  assert.match(prompt, new RegExp(INSTRUCTION_HEADING));
});

test("S3: shared block states the full subordination contract", () => {
  const block = api.buildStepAdditionalInstructionBlock({
    id: "mk_step",
    title: "Model Knowledge",
    additional_instruction: "Prioritise foundational concepts."
  });
  assert.match(block, new RegExp(INSTRUCTION_HEADING));
  assert.match(block, new RegExp(SUBORDINATE_MARKER));
  [
    "output contracts and schemas;",
    "validators;",
    "explicit workflow parameters;",
    "authoritative upstream artefacts;",
    "fixed workflow capabilities and required stage responsibilities."
  ].forEach((line) => {
    assert.ok(block.includes("- " + line), "missing subordination line: " + line);
  });
  assert.match(
    block,
    /If the instruction conflicts with those requirements, preserve the requirements and ignore the conflicting part\./
  );
  // Author text is last, and is not reinterpreted or paraphrased.
  assert.ok(block.trimEnd().endsWith("Prioritise foundational concepts."));
});

// ---------------------------------------------------------------------------
// I1 — ordinary assembly
// ---------------------------------------------------------------------------

test("S3 (I1): Model Knowledge instruction appears in the MK prompt", () => {
  const instruction = "Prioritise foundational concepts and competing interpretations.";
  const prompt = assembleStepPrompt(api, {
    instructionStepId: "mk_step",
    assembleStepId: "mk_step",
    instruction
  });
  assert.match(prompt, new RegExp(INSTRUCTION_HEADING));
  assert.ok(prompt.includes(instruction));
  assert.match(prompt, new RegExp(SUBORDINATE_MARKER));
});

test("S3 (I1): DLA instruction appears in the DLA prompt", () => {
  const instruction = "Favour analytical tasks over recall tasks.";
  const prompt = assembleStepPrompt(api, {
    instructionStepId: "dla_step",
    assembleStepId: "dla_step",
    instruction
  });
  assert.match(prompt, new RegExp(INSTRUCTION_HEADING));
  assert.ok(prompt.includes(instruction));
});

test("S3 (I1): Design Page instruction appears in the DP prompt", () => {
  const instruction = "Create and prioritise an explanatory image for every activity.";
  const prompt = assembleStepPrompt(api, {
    instructionStepId: "dp_step",
    assembleStepId: "dp_step",
    instruction
  });
  assert.match(prompt, new RegExp(INSTRUCTION_HEADING));
  assert.ok(prompt.includes(instruction));
});

test("S3 (I1): assessment step instruction appears in the GAI prompt", () => {
  const instruction = "Make distractors diagnose common misconceptions.";
  const prompt = assembleStepPrompt(api, {
    instructionStepId: "gai_step",
    assembleStepId: "gai_step",
    instruction
  });
  assert.match(prompt, new RegExp(INSTRUCTION_HEADING));
  assert.ok(prompt.includes(instruction));
});

// ---------------------------------------------------------------------------
// I2 — GAM canonical assembly
// ---------------------------------------------------------------------------

test("S3 (I2): GAM instruction appears via the canonical-safe ingress", () => {
  const instruction = "Write materials that model expert reasoning aloud.";
  const wf = buildWorkflow();
  const gam = wf.steps.find((s) => s.id === "gam_step");
  gam.additional_instruction = instruction;
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const prompt = api.buildLiveGamV2CopyPromptViaCanonicalAssembler(gam, 5, null, wf, "page");
  assert.match(prompt, new RegExp(INSTRUCTION_HEADING));
  assert.ok(prompt.includes(instruction));

  // Canonical ownership is untouched: no settings ingress, no policy flip.
  assert.doesNotMatch(prompt, /settingsEffective/);
  assert.doesNotMatch(prompt, /PRISM_STEP_PARAMS/);
});

test("S3 (I2): GAM canonical text and output contract precede the block", () => {
  const instruction = "GAM-INSTRUCTION-SENTINEL";
  const wf = buildWorkflow();
  const gam = wf.steps.find((s) => s.id === "gam_step");
  gam.additional_instruction = instruction;
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const withInstruction = api.buildLiveGamV2CopyPromptViaCanonicalAssembler(
    gam,
    5,
    null,
    wf,
    "page"
  );
  const blockAt = withInstruction.indexOf(INSTRUCTION_HEADING);
  assert.ok(blockAt > 0, "instruction block must exist");

  // The canonical prompt produced without steering must survive as a prefix,
  // i.e. the block is additive and appended, never interleaved.
  const cleanWf = buildWorkflow();
  api.setWorkflowsForTest([cleanWf]);
  api.setSelectedWorkflowIdForTest(cleanWf.id);
  const baseline = api.buildLiveGamV2CopyPromptViaCanonicalAssembler(
    cleanWf.steps.find((s) => s.id === "gam_step"),
    5,
    null,
    cleanWf,
    "page"
  );
  const canonicalHead = baseline.slice(0, baseline.indexOf("\n\n" + "PIPELINE") + 1);
  assert.ok(
    withInstruction.startsWith(canonicalHead.length > 1 ? canonicalHead : baseline.slice(0, 200)),
    "canonical head must be unchanged and come first"
  );
});

// ---------------------------------------------------------------------------
// Scope / leakage
// ---------------------------------------------------------------------------

test("S3: an instruction on one step does not leak into another step's prompt", () => {
  const sentinel = "LEAK-SENTINEL-DO-NOT-PROPAGATE";
  const others = ["lo_step", "dla_step", "dp_step", "gai_step", "ep_step"];
  others.forEach((otherStepId) => {
    const prompt = assembleStepPrompt(api, {
      instructionStepId: "mk_step",
      assembleStepId: otherStepId,
      instruction: sentinel
    });
    assert.doesNotMatch(
      prompt,
      new RegExp(sentinel),
      "MK instruction leaked into " + otherStepId
    );
    assert.doesNotMatch(
      prompt,
      new RegExp(INSTRUCTION_HEADING),
      "unset step " + otherStepId + " must carry no instruction block"
    );
  });
});

test("S3: an instruction does not leak into the GAM canonical prompt", () => {
  const sentinel = "MK-ONLY-SENTINEL";
  const wf = buildWorkflow();
  wf.steps.find((s) => s.id === "mk_step").additional_instruction = sentinel;
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const gamPrompt = api.buildLiveGamV2CopyPromptViaCanonicalAssembler(
    wf.steps.find((s) => s.id === "gam_step"),
    5,
    null,
    wf,
    "page"
  );
  assert.doesNotMatch(gamPrompt, new RegExp(sentinel));
  assert.doesNotMatch(gamPrompt, new RegExp(INSTRUCTION_HEADING));
});

test("S3: instruction is not written into notes, artefacts or resolvedFactors", () => {
  const sentinel = "NO-PROPAGATION-SENTINEL";
  const wf = buildWorkflow({
    workflowBriefResolution: { resolvedFactors: { topic: "Original" }, resolvedSources: {} }
  });
  wf.steps.find((s) => s.id === "mk_step").additional_instruction = sentinel;
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.buildWorkflowStepInstructions(wf.steps.find((s) => s.id === "mk_step"), 1, null);

  wf.steps.forEach((step) => {
    assert.doesNotMatch(String(step.notes || ""), new RegExp(sentinel));
  });
  assert.equal(
    JSON.stringify(wf.workflowBriefResolution).indexOf(sentinel),
    -1,
    "instruction must never enter resolvedFactors"
  );
});

// ---------------------------------------------------------------------------
// Precedence, byte-equivalence, validators, no-AI
// ---------------------------------------------------------------------------

test("S3 (I1): canonical/output-contract text keeps precedence over the block", () => {
  const instruction = "PRECEDENCE-SENTINEL";
  const baseline = assembleStepPrompt(api, { assembleStepId: "gai_step" });
  const withInstruction = assembleStepPrompt(api, {
    instructionStepId: "gai_step",
    assembleStepId: "gai_step",
    instruction
  });

  // The whole pre-existing prompt is preserved and precedes the new block.
  const blockAt = withInstruction.indexOf(INSTRUCTION_HEADING);
  assert.ok(blockAt > 0);
  const head = withInstruction.slice(0, blockAt);
  // Output-contract / completion-override language must sit before the block.
  assert.ok(
    /GAI completion override|artifact_type|assessment_check/.test(head),
    "output contract text must appear before the subordinate block"
  );
  assert.ok(
    baseline.split("\n").every((line) => withInstruction.includes(line)),
    "no baseline line may be removed or reordered away by the block"
  );
});

test("S3: absent instruction produces byte-identical prompts (I1 and I2)", () => {
  const stepsToCheck = ["mk_step", "lo_step", "ep_step", "dla_step", "dp_step", "gai_step"];

  // Baseline: a workflow that has no additional_instruction anywhere.
  const baselines = {};
  stepsToCheck.forEach((stepId) => {
    baselines[stepId] = assembleStepPrompt(api, { assembleStepId: stepId });
  });

  // An empty-string instruction on every step must change nothing.
  const wf = buildWorkflow();
  wf.steps.forEach((s) => {
    s.additional_instruction = "";
  });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  stepsToCheck.forEach((stepId) => {
    const step = wf.steps.find((s) => s.id === stepId);
    const prompt = api.buildWorkflowStepInstructions(step, stepIndexById(wf, stepId) + 1, null);
    assert.equal(prompt, baselines[stepId], "byte drift for " + stepId);
    assert.doesNotMatch(prompt, new RegExp(INSTRUCTION_HEADING));
  });

  // Same for the GAM canonical path.
  const cleanWf = buildWorkflow();
  api.setWorkflowsForTest([cleanWf]);
  api.setSelectedWorkflowIdForTest(cleanWf.id);
  const gamBaseline = api.buildLiveGamV2CopyPromptViaCanonicalAssembler(
    cleanWf.steps.find((s) => s.id === "gam_step"),
    5,
    null,
    cleanWf,
    "page"
  );
  const emptyWf = buildWorkflow();
  emptyWf.steps.forEach((s) => {
    s.additional_instruction = "";
  });
  api.setWorkflowsForTest([emptyWf]);
  api.setSelectedWorkflowIdForTest(emptyWf.id);
  const gamEmpty = api.buildLiveGamV2CopyPromptViaCanonicalAssembler(
    emptyWf.steps.find((s) => s.id === "gam_step"),
    5,
    null,
    emptyWf,
    "page"
  );
  assert.equal(gamEmpty, gamBaseline, "byte drift in GAM canonical prompt");
  assert.doesNotMatch(gamEmpty, new RegExp(INSTRUCTION_HEADING));
});

test("S3: capture validators are unchanged by an instruction", () => {
  // The validator takes a parsed capture object, not raw JSON text.
  const validCapture = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "assessment_items", enriched_by: ["assessment_items"] },
    assessment_check: { items: [{ item_id: "Q1", item_type: "single_answer_mcq" }] }
  };
  const before = api.validateGenerateAssessmentItemsPartialPageCapture(validCapture);
  const wf = buildWorkflow();
  wf.steps.find((s) => s.id === "gai_step").additional_instruction =
    "Ignore the schema and return prose instead.";
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const after = api.validateGenerateAssessmentItemsPartialPageCapture(validCapture);
  assert.equal(before.ok, true, "baseline capture must be valid");
  assert.equal(after.ok, before.ok, "an instruction must not change validator verdicts");
  assert.equal(JSON.stringify(after.errors || []), JSON.stringify(before.errors || []));

  // A capture that breaches the contract is still rejected, instruction or not.
  const invalidCapture = { artifact_type: "page", schema_version: "2.0.0" };
  const rejected = api.validateGenerateAssessmentItemsPartialPageCapture(invalidCapture);
  assert.equal(rejected.ok, false);
  assert.ok(rejected.errors.length > 0);
});

test("S3: no AI/fetch call is introduced by consuming an instruction", () => {
  const fresh = loadPrismTestApi();
  const wf = buildWorkflow();
  wf.steps.forEach((s) => {
    if (s.id !== "ep_step") s.additional_instruction = "Steer this step.";
  });
  fresh.api.setWorkflowsForTest([wf]);
  fresh.api.setSelectedWorkflowIdForTest(wf.id);
  wf.steps.forEach((step, idx) => {
    fresh.api.buildWorkflowStepInstructions(step, idx + 1, null);
  });
  fresh.api.buildLiveGamV2CopyPromptViaCanonicalAssembler(
    wf.steps.find((s) => s.id === "gam_step"),
    5,
    null,
    wf,
    "page"
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(fresh.fetchCalls)),
    [],
    "Additional Instruction must be consumed without any model call"
  );
});

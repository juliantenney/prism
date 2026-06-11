/**
 * Sprint 41 — Educational Quality Framework runtime prompt contract.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const eqfLib = require("../lib/educational-quality-framework-prompt.js");

const EQF_MARKER = /EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/i;

const LD_BRIEF = {
  goal:
    "Create a self-directed learning page on inflation covering household impacts, policy trade-offs and evaluative judgement.",
  inputs: "Undergraduate economics (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();

function applyRuntimePrompt(baseDraft, stepId, stepTitle) {
  const step = {
    canonical_step_id: stepId,
    canonical_title: stepTitle,
    title: stepTitle
  };
  const wf = {
    goal: LD_BRIEF.goal,
    desiredOutputs: LD_BRIEF.desiredOutputs,
    workflowOutputSpec: { goal: LD_BRIEF.goal }
  };
  return api.applyWorkflowStepRuntimePromptAugmentations(baseDraft, step, wf);
}

function stepContext(stepId, stepTitle) {
  return {
    stepCanonicalStepId: stepId,
    stepCanonicalTitle: stepTitle,
    stepTitle: stepTitle
  };
}

function assertEqfCoreContent(prompt) {
  assert.match(prompt, EQF_MARKER);
  assert.match(prompt, /learner journey is the primary design unit/i);
  assert.match(prompt, /understanding/i);
  assert.match(prompt, /capability/i);
  assert.match(prompt, /judgement/i);
  assert.match(prompt, /independence/i);
  assert.match(prompt, /compare, evaluate, justify, critique and defend/i);
  assert.match(prompt, /guided practice/i);
  assert.match(prompt, /independent decision making/i);
  assert.match(prompt, /transfer/i);
  assert.match(prompt, /metacognition/i);
  assert.match(prompt, /learning success/i);
  assert.match(prompt, /cognitive activity/i);
  assert.match(prompt, /not more interface activity/i);
}

test("41-1: lib module exports marker and apply helper", () => {
  assert.equal(eqfLib.MODULE_ID, "EDUCATIONAL-QUALITY-FRAMEWORK");
  assert.match(eqfLib.MARKER, EQF_MARKER);
  const block = eqfLib.buildEducationalQualityFrameworkPromptBlock();
  assertEqfCoreContent(block);
});

test("41-1: Design Learning Activities receives EQF marker via runtime augmentations", () => {
  const prompt = applyRuntimePrompt(
    "Populate learning activities from episode plans.\n",
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  assertEqfCoreContent(prompt);
});

test("41-1: Construct Learning Sequence receives EQF marker", () => {
  const prompt = applyRuntimePrompt(
    "Build the learning sequence.\n",
    "step_construct_learning_sequence",
    "Construct Learning Sequence"
  );
  assert.match(prompt, EQF_MARKER);
  assert.match(prompt, /learner journey/i);
});

test("41-1: Design Page receives EQF marker", () => {
  const prompt = applyRuntimePrompt(
    "Assemble the learner page.\n",
    "step_design_page",
    "Design Page"
  );
  assert.match(prompt, EQF_MARKER);
  assert.match(prompt, /learning success/i);
});

test("41-1: Design Assessment receives EQF marker", () => {
  const prompt = applyRuntimePrompt(
    "Design the assessment blueprint.\n",
    "step_design_assessment",
    "Design Assessment"
  );
  assert.match(prompt, EQF_MARKER);
  assert.match(prompt, /judgement/i);
});

test("41-1: Design Feedback receives EQF marker", () => {
  const prompt = applyRuntimePrompt(
    "Generate feedback aligned to assessment items.\n",
    "step_design_feedback",
    "Design Feedback"
  );
  assert.match(prompt, EQF_MARKER);
  assert.match(prompt, /metacognition/i);
});

test("41-1: non-target step Model Knowledge does not receive EQF marker", () => {
  const prompt = applyRuntimePrompt(
    "Model the knowledge in the source.\n",
    "step_model_knowledge",
    "Model Knowledge"
  );
  assert.doesNotMatch(prompt, EQF_MARKER);
});

test("41-1: EQF marker is not duplicated on second apply", () => {
  const ctx = stepContext("step_design_learning_activities", "Design Learning Activities");
  const once = eqfLib.applyEducationalQualityFrameworkPromptBlockToDraft("Draft.\n", ctx);
  const twice = eqfLib.applyEducationalQualityFrameworkPromptBlockToDraft(once, ctx);
  const hits = twice.match(/EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/gi);
  assert.equal(hits && hits.length, 1);
});

test("41-2: Construct Learning Sequence includes journey and progressive independence manifestation", () => {
  const prompt = applyRuntimePrompt(
    "Build the learning sequence.\n",
    "step_construct_learning_sequence",
    "Construct Learning Sequence"
  );
  assert.match(prompt, /learner-development journey/i);
  assert.match(prompt, /modelled support/i);
  assert.match(prompt, /guided practice/i);
  assert.match(prompt, /supported decision making/i);
  assert.match(prompt, /understanding → capability → judgement → independence/i);
  assert.doesNotMatch(prompt, /literal two-column/i);
});

test("41-2: Design Learning Activities includes developmental purpose and judgement manifestation", () => {
  const prompt = applyRuntimePrompt(
    "Populate learning activities.\n",
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  assert.match(prompt, /developmental purpose of each activity/i);
  assert.match(prompt, /required_materials and learner_task/i);
  assert.match(prompt, /choose, prioritise or decide/i);
  assert.match(prompt, /progressive independence/i);
  assert.match(prompt, /activity shells/i);
});

test("41-2: Generate Activity Materials includes preserve judgement and avoid pre-answering guidance", () => {
  const prompt = applyRuntimePrompt(
    "Realise activity materials.\n",
    "step_generate_activity_materials",
    "Generate Activity Materials"
  );
  assert.match(prompt, /cognitive purpose already specified by DLA/i);
  assert.match(prompt, /do not pre-answer/i);
  assert.match(prompt, /worked → faded → independent/i);
  assert.match(prompt, /uncertainty, confidence, progress or next steps/i);
  assert.match(prompt, /not add interaction.*for its own sake/i);
});

test("41-2: Design Page includes semantic guidance vs activities distinction without literal columns", () => {
  const prompt = applyRuntimePrompt(
    "Assemble the learner page.\n",
    "step_design_page",
    "Design Page"
  );
  assert.match(prompt, /learning guidance and learning activities semantically distinct/i);
  assert.match(prompt, /not a literal two-column layout requirement/i);
  assert.match(prompt, /expected outputs, completion evidence and reflective closure/i);
  assert.match(prompt, /do not turn it into heavy extra tasks/i);
});

test("41-2: Design Assessment includes justification and judgement evidence guidance", () => {
  const prompt = applyRuntimePrompt(
    "Design the assessment blueprint.\n",
    "step_design_assessment",
    "Design Assessment"
  );
  assert.match(prompt, /justification or interpretation over recall-only/i);
  assert.match(prompt, /judgement tasks/i);
  assert.match(prompt, /misconceptions or weak reasoning/i);
});

test("41-2: Generate Assessment Items includes interpretation and judgement evidence guidance", () => {
  const prompt = applyRuntimePrompt(
    "Generate assessment items.\n",
    "step_generate_assessment_items",
    "Generate Assessment Items"
  );
  assert.match(prompt, /justification or interpretation over recall-only/i);
  assert.match(prompt, /judgement tasks/i);
  assert.match(prompt, /misconceptions or weak reasoning/i);
});

test("41-2: Design Feedback includes next-step decisions and concise scalable feedback", () => {
  const prompt = applyRuntimePrompt(
    "Generate feedback pack.\n",
    "step_design_feedback",
    "Design Feedback"
  );
  assert.match(prompt, /what changed in understanding, capability, judgement or independence/i);
  assert.match(prompt, /next-step decisions/i);
  assert.match(prompt, /concise and scalable/i);
});

test("41-2: manifestation lines are step-specific and omitted for core-only block without context", () => {
  const dlaCtx = stepContext("step_design_learning_activities", "Design Learning Activities");
  const seqCtx = stepContext("step_construct_learning_sequence", "Construct Learning Sequence");
  const dlaLines = eqfLib.buildEducationalQualityFrameworkManifestationLines(dlaCtx);
  const seqLines = eqfLib.buildEducationalQualityFrameworkManifestationLines(seqCtx);
  assert.ok(dlaLines.some((line) => /developmental purpose/i.test(line)));
  assert.ok(seqLines.some((line) => /learner-development journey/i.test(line)));
  assert.notDeepEqual(dlaLines, seqLines);
  assert.equal(eqfLib.buildEducationalQualityFrameworkManifestationLines({}).length, 0);
});

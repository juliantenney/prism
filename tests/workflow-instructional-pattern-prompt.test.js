/**
 * Sprint 48 Slice 2 — SP-02 / SP-03 instructional pattern GAM prompt augmentation.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const patternLib = require("../lib/instructional-pattern-prompt.js");

const SP02_MARKER = /INSTRUCTIONAL-PATTERN-SP-02 \(auto-applied\)/i;
const SP03_MARKER = /INSTRUCTIONAL-PATTERN-SP-03 \(auto-applied\)/i;
const SP06_MARKER = /INSTRUCTIONAL-PATTERN-SP-06 \(auto-applied\)/i;

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

const FACILITATOR_ONLY_BRIEF = {
  goal: "Design a 90-minute facilitated workshop on team communication for nursing students.",
  inputs: "Face-to-face classroom with tutor facilitation",
  desiredOutputs: "Facilitator guide and slide deck",
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
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function resolveBrief(brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    brief.goal,
    brief.inputs
  );
  return api.resolveWorkflowBriefFactors(ldBriefConfig, explicit, {}, inferred, brief)
    .resolved;
}

function applyRuntimePrompt(baseDraft, stepId, stepTitle, brief) {
  const resolved = resolveBrief(brief);
  const factors = Object.assign({}, resolved);
  if (brief === MARX_SELF_STUDY_BRIEF) {
    factors.delivery_context = "self_directed";
    factors.session_materials = ["page"];
  }
  const step = {
    canonical_step_id: stepId,
    canonical_title: stepTitle,
    title: stepTitle
  };
  const wf = {
    goal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    workflowOutputSpec: { goal: brief.goal },
    workflowBriefResolution: { resolvedFactors: factors }
  };
  return api.applyWorkflowStepRuntimePromptAugmentations(baseDraft, step, wf);
}

function assertSp02Content(prompt) {
  assert.match(prompt, SP02_MARKER);
  assert.match(prompt, /SP-02 \/ DT-SP-01 partial-exemplar decision table/i);
  assert.match(prompt, /decision_table/i);
  assert.match(prompt, /exactly one partial exemplar row/i);
  assert.match(prompt, /MUST include exactly one/i);
  assert.match(prompt, /Judgement.*empty on every row/i);
  assert.match(prompt, /MP-1/i);
  assert.match(prompt, /all-empty decision_table.*FM-04/i);
  assert.match(prompt, /GOOD shape example/i);
  assert.match(prompt, /Judgement \(leave blank\)/i);
  assert.match(prompt, /FORBIDDEN.*FM-04/i);
}

function assertSp03Content(prompt) {
  assert.match(prompt, SP03_MARKER);
  assert.match(prompt, /SP-03 \/ TP-SP-01 capstone transfer prompt/i);
  assert.match(prompt, /transfer_prompt/i);
  assert.match(prompt, /MUST include learner-context selection/i);
  assert.match(prompt, /MUST include an operational completion criterion/i);
  assert.match(prompt, /at least three distinct application cues/i);
  assert.match(prompt, /MUST explicitly name or link to session criteria/i);
  assert.match(prompt, /instructional FAIL \(FM-02\)/i);
  assert.match(prompt, /instructional FAIL \(FM-03\)/i);
  assert.match(prompt, /GOOD shape example/i);
  assert.match(prompt, /FORBIDDEN: one-sentence transfer prompt/i);
  assert.match(prompt, /MP-1/i);
}

function assertSp06Content(prompt) {
  assert.match(prompt, SP06_MARKER);
  assert.match(prompt, /SP-06 \/ WE-SP-01 visible-reasoning worked example/i);
  assert.match(prompt, /worked_example/i);
  assert.match(prompt, /parallel-task bridge/i);
  assert.match(prompt, /MUST include an explicit parallel-task bridge/i);
  assert.match(prompt, /instructional FAIL \(FM-05\)/i);
  assert.match(prompt, /GOOD shape example/i);
  assert.match(prompt, /\*\*Bridge:\*\*/i);
  assert.match(prompt, /FORBIDDEN:.*FM-05/i);
  assert.match(prompt, /MP-1/i);
  assert.match(prompt, /MP-2/i);
  assert.match(prompt, /MP-3/i);
}

test("48-2: lib exports SP-02, SP-03, and SP-06 markers and apply helper", () => {
  assert.equal(patternLib.MODULE_ID, "INSTRUCTIONAL-PATTERN-PROMPT");
  assert.match(patternLib.MARKER_SP02, SP02_MARKER);
  assert.match(patternLib.MARKER_SP03, SP03_MARKER);
  assert.match(patternLib.MARKER_SP06, SP06_MARKER);
  const block = patternLib.buildInstructionalPatternPromptBlock();
  assertSp02Content(block);
  assertSp03Content(block);
  assertSp06Content(block);
});

test("48-2: self-directed learner-page GAM receives SP-02, SP-03, and SP-06 markers", () => {
  const base = "Realise activity materials from upstream DLA.\n";
  const prompt = applyRuntimePrompt(
    base,
    "step_generate_activity_materials",
    "Generate Activity Materials",
    MARX_SELF_STUDY_BRIEF
  );
  assertSp02Content(prompt);
  assertSp03Content(prompt);
  assertSp06Content(prompt);
  assert.ok(prompt.length > base.length);
});

test("48-2: scope gate — facilitator brief excludes pattern markers on GAM", () => {
  const prompt = applyRuntimePrompt(
    "Realise activity materials.\n",
    "step_generate_activity_materials",
    "Generate Activity Materials",
    FACILITATOR_ONLY_BRIEF
  );
  assert.doesNotMatch(prompt, SP02_MARKER);
  assert.doesNotMatch(prompt, SP03_MARKER);
  assert.doesNotMatch(prompt, SP06_MARKER);
});

test("48-2: non-GAM step Design Learning Activities excludes pattern markers", () => {
  const prompt = applyRuntimePrompt(
    "Populate learning activities.\n",
    "step_design_learning_activities",
    "Design Learning Activities",
    MARX_SELF_STUDY_BRIEF
  );
  assert.doesNotMatch(prompt, SP02_MARKER);
  assert.doesNotMatch(prompt, SP03_MARKER);
  assert.doesNotMatch(prompt, SP06_MARKER);
});

test("48-2: non-GAM step Design Page excludes pattern markers", () => {
  const prompt = applyRuntimePrompt(
    "Assemble the learner page.\n",
    "step_design_page",
    "Design Page",
    MARX_SELF_STUDY_BRIEF
  );
  assert.doesNotMatch(prompt, SP02_MARKER);
  assert.doesNotMatch(prompt, SP03_MARKER);
  assert.doesNotMatch(prompt, SP06_MARKER);
});

test("48-2: pattern markers are not duplicated on second apply", () => {
  const ctx = {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalStepId: "step_generate_activity_materials",
    stepCanonicalTitle: "Generate Activity Materials",
    workflowBriefResolution: {
      resolvedFactors: Object.assign(resolveBrief(MARX_SELF_STUDY_BRIEF), {
        delivery_context: "self_directed",
        session_materials: ["page"]
      })
    }
  };
  const once = api.applyInstructionalPatternPromptBlockToDraft("Draft.\n", ctx);
  const twice = api.applyInstructionalPatternPromptBlockToDraft(once, ctx);
  assert.equal((twice.match(SP02_MARKER) || []).length, 1);
  assert.equal((twice.match(SP03_MARKER) || []).length, 1);
  assert.equal((twice.match(SP06_MARKER) || []).length, 1);
});

test("48-2: lib apply helper does not duplicate markers", () => {
  const once = patternLib.applyInstructionalPatternPromptBlockToDraft("Draft.\n", {});
  const twice = patternLib.applyInstructionalPatternPromptBlockToDraft(once, {});
  assert.equal((twice.match(SP02_MARKER) || []).length, 1);
  assert.equal((twice.match(SP03_MARKER) || []).length, 1);
  assert.equal((twice.match(SP06_MARKER) || []).length, 1);
});

test("48-2: resolveInstructionalPatternPromptLib exposes apply helper", () => {
  const lib = api.resolveInstructionalPatternPromptLib();
  assert.ok(lib);
  assert.equal(typeof lib.applyInstructionalPatternPromptBlockToDraft, "function");
  assert.equal(typeof lib.buildInstructionalPatternPromptBlock, "function");
  assert.equal(typeof lib.buildSp06PromptBlock, "function");
});

test("48-2: GAM prompt delta is additive — DLA prompt unchanged for pattern markers", () => {
  const dlaBase = "Populate learning activities from episode plans.\n";
  const dlaPrompt = applyRuntimePrompt(
    dlaBase,
    "step_design_learning_activities",
    "Design Learning Activities",
    MARX_SELF_STUDY_BRIEF
  );
  const gamBase = "Realise activity materials.\n";
  const gamPrompt = applyRuntimePrompt(
    gamBase,
    "step_generate_activity_materials",
    "Generate Activity Materials",
    MARX_SELF_STUDY_BRIEF
  );
  assert.doesNotMatch(dlaPrompt, SP02_MARKER);
  assert.doesNotMatch(dlaPrompt, SP03_MARKER);
  assert.doesNotMatch(dlaPrompt, SP06_MARKER);
  assert.match(gamPrompt, SP02_MARKER);
  assert.match(gamPrompt, SP03_MARKER);
  assert.match(gamPrompt, SP06_MARKER);
});

test("48-3: SP-02 block requires exactly one partial exemplar row (MUST)", () => {
  const block = patternLib.buildSp02PromptBlock();
  assert.match(block, /every decision_table body MUST include exactly one partial exemplar row/i);
  assert.match(block, /On the exemplar row only/i);
});

test("48-3: SP-02 defines all-empty decision_table as FM-04 instructional fail", () => {
  const block = patternLib.buildSp02PromptBlock();
  assert.match(block, /all-empty decision_table.*instructional FAIL \(FM-04\).*do not emit/i);
  assert.match(block, /FORBIDDEN:.*every cell empty and no exemplar row.*FM-04/i);
});

test("48-3: SP-02 GOOD shape example shows exemplar row and empty judgement column", () => {
  const block = patternLib.buildSp02PromptBlock();
  assert.match(block, /GOOD shape example/i);
  assert.match(block, /Judgement \(leave blank\)/i);
  assert.match(block, /Brief evidence citing the case/i);
  assert.match(block, /Brief reasoning linking evidence/i);
  assert.match(block, /\| Second item \|  \|  \|  \|/);
});

test("48-3: SP-02 retains MP-1 ownership constraints", () => {
  const block = patternLib.buildSp02PromptBlock();
  assert.match(block, /MUST stay empty on every row, including the exemplar row/i);
  assert.match(block, /Do not pre-fill Correct\/Incorrect/i);
  assert.match(block, /learner owns evaluative conclusions \(MP-1\)/i);
});

test("48-3: SP-02 block unchanged by Slice 3 scope — SP-03 not mixed with SP-02 markers", () => {
  const sp03 = patternLib.buildSp03PromptBlock();
  assert.match(sp03, /SP-03 \/ TP-SP-01 capstone transfer prompt/i);
  assert.doesNotMatch(sp03, /exactly one partial exemplar row/i);
  assert.doesNotMatch(sp03, /all-empty decision_table/i);
});

test("48-4: SP-06 block requires explicit parallel-task bridge (MUST)", () => {
  const block = patternLib.buildSp06PromptBlock();
  assert.match(block, /every worked_example body MUST include an explicit parallel-task bridge/i);
  assert.match(block, /transfer the method, not the answer/i);
});

test("48-4: SP-06 defines model-only worked_example as FM-05 instructional fail", () => {
  const block = patternLib.buildSp06PromptBlock();
  assert.match(
    block,
    /ends at the model conclusion with no learner application guidance.*instructional FAIL \(FM-05\).*do not emit/i
  );
  assert.match(block, /FORBIDDEN: step chain \+ model conclusion only.*FM-05/i);
});

test("48-4: SP-06 GOOD shape example shows bridge without learner answer", () => {
  const block = patternLib.buildSp06PromptBlock();
  assert.match(block, /GOOD shape example/i);
  assert.match(block, /visible because\/reasoning between steps/i);
  assert.match(block, /\*\*Bridge:\*\* Now use the same method on your/i);
  assert.match(block, /do not copy the model outcome/i);
});

test("48-4: SP-06 retains MP-1 and MP-2 ownership constraints", () => {
  const block = patternLib.buildSp06PromptBlock();
  assert.match(block, /model the move before independent production \(MP-2\)/i);
  assert.match(block, /Do not supply the learner's independent deliverable/i);
  assert.match(block, /scaffolding only \(MP-1\)/i);
});

test("48-4: SP-02 and SP-06 blocks unchanged by Slice 4 refinement", () => {
  const sp02 = patternLib.buildSp02PromptBlock();
  const sp06 = patternLib.buildSp06PromptBlock();
  assert.match(sp02, /exactly one partial exemplar row/i);
  assert.match(sp02, /instructional FAIL \(FM-04\)/i);
  assert.match(sp06, /parallel-task bridge/i);
  assert.doesNotMatch(sp02, /FM-05/i);
  assert.doesNotMatch(sp06, /FM-04/i);
});

test("48-5: SP-03 block requires MUST bundle for transfer_prompt", () => {
  const block = patternLib.buildSp03PromptBlock();
  assert.match(block, /every transfer_prompt body MUST provide substantive learner-owned transfer scaffolding/i);
  assert.match(block, /MUST include learner-context selection/i);
  assert.match(block, /MUST include an operational completion criterion/i);
  assert.match(block, /at least three distinct application cues/i);
  assert.match(block, /MUST explicitly name or link to session criteria/i);
});

test("48-5: SP-03 defines FM-02 and FM-03 instructional fails", () => {
  const block = patternLib.buildSp03PromptBlock();
  assert.match(block, /too thin to guide production.*instructional FAIL \(FM-02\).*do not emit/i);
  assert.match(
    block,
    /generic third-person application or claim correction without learner-owned context choice.*instructional FAIL \(FM-03\).*do not emit/i
  );
});

test("48-5: SP-03 GOOD shape example shows context, cues, and criteria linkage", () => {
  const block = patternLib.buildSp03PromptBlock();
  assert.match(block, /GOOD shape example/i);
  assert.match(block, /Choose a \[context you know\]/i);
  assert.match(block, /Apply \[core concept\] to your chosen context/i);
  assert.match(block, /named session criterion/i);
  assert.match(block, /State what transfers and what does not/i);
});

test("48-5: SP-03 FORBIDDEN floors name thin and third-person shapes", () => {
  const block = patternLib.buildSp03PromptBlock();
  assert.match(block, /FORBIDDEN: one-sentence transfer prompt — FM-02/i);
  assert.match(block, /FORBIDDEN: generic "apply this to a real-world case"/i);
  assert.match(block, /FORBIDDEN: third-person claim correction with no own-context choice — FM-03/i);
});

test("48-5: SP-03 retains MP-1 ownership constraint", () => {
  const block = patternLib.buildSp03PromptBlock();
  assert.match(block, /Do not supply a pre-written learner transfer response/i);
  assert.match(block, /assign production to the learner \(MP-1\)/i);
});

test("48-5: SP-02 and SP-06 blocks unchanged by Slice 5 refinement", () => {
  const sp02 = patternLib.buildSp02PromptBlock();
  const sp06 = patternLib.buildSp06PromptBlock();
  assert.match(sp02, /instructional FAIL \(FM-04\)/i);
  assert.match(sp06, /instructional FAIL \(FM-05\)/i);
  assert.doesNotMatch(sp02, /FM-02/i);
  assert.doesNotMatch(sp06, /transfer_prompt/i);
  assert.doesNotMatch(sp06, /FM-03/i);
});

test("48-6: SP-04 block requires MUST bundle for consolidation_summary", () => {
  const block = patternLib.buildSp04PromptBlock();
  assert.match(block, /every consolidation_summary body MUST scaffold learner-produced synthesis/i);
  assert.match(block, /MUST require learner-produced synthesis/i);
  assert.match(block, /MUST include an operational completion criterion/i);
  assert.match(block, /at least three synthesis angles/i);
  assert.match(block, /reflection, distinction, judgement, uncertainty/i);
});

test("48-6: SP-04 defines FM-10 instructional fail", () => {
  const block = patternLib.buildSp04PromptBlock();
  assert.match(
    block,
    /too thin to guide learner synthesis.*bullet prompts only with no synthesis expectation.*no learner-write requirement.*instructional FAIL \(FM-10\).*do not emit/i
  );
});

test("48-6: SP-04 GOOD shape example shows synthesis prompts without completed answer", () => {
  const block = patternLib.buildSp04PromptBlock();
  assert.match(block, /GOOD shape example/i);
  assert.match(block, /Write \[word band\] synthesising your understanding/i);
  assert.match(block, /What key distinction can you now make/i);
  assert.match(block, /What uncertainty or open question remains/i);
  assert.match(block, /You might begin with:/i);
  assert.match(block, /One idea that now seems clearer is/i);
});

test("48-6: SP-04 FORBIDDEN floors name spoiler and replay shapes", () => {
  const block = patternLib.buildSp04PromptBlock();
  assert.match(block, /FORBIDDEN: past-tense session summary.*In this session you learned/i);
  assert.match(block, /FORBIDDEN: completed consolidation summary or model essay/i);
  assert.match(block, /FORBIDDEN: learning-outcomes replay or capstone judgement written for the learner/i);
});

test("48-6: SP-04 retains MP-1 ownership constraint", () => {
  const block = patternLib.buildSp04PromptBlock();
  assert.match(block, /Do not supply a completed consolidation essay/i);
  assert.match(block, /scaffolding only \(MP-1\)/i);
});

test("48-6: SP-02, SP-03, and SP-06 blocks unchanged by Slice 6 refinement", () => {
  const sp02 = patternLib.buildSp02PromptBlock();
  const sp03 = patternLib.buildSp03PromptBlock();
  const sp06 = patternLib.buildSp06PromptBlock();
  assert.match(sp02, /instructional FAIL \(FM-04\)/i);
  assert.match(sp03, /instructional FAIL \(FM-02\)/i);
  assert.match(sp06, /instructional FAIL \(FM-05\)/i);
  assert.doesNotMatch(sp02, /FM-10/i);
  assert.doesNotMatch(sp03, /consolidation_summary/i);
  assert.doesNotMatch(sp06, /FM-10/i);
  assert.doesNotMatch(sp06, /CS-SP-01/i);
});

test("48-6: lib apply helper appends SP-04 without duplicating marker", () => {
  const once = patternLib.applyInstructionalPatternPromptBlockToDraft("Draft.\n", {});
  assert.match(once, /INSTRUCTIONAL-PATTERN-SP-04 \(auto-applied\)/i);
  const twice = patternLib.applyInstructionalPatternPromptBlockToDraft(once, {});
  assert.equal((twice.match(/INSTRUCTIONAL-PATTERN-SP-04 \(auto-applied\)/gi) || []).length, 1);
});

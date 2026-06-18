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

const SP01_MARKER = /INSTRUCTIONAL-PATTERN-SP-01 \(auto-applied\)/i;
const SP02_MARKER = /INSTRUCTIONAL-PATTERN-SP-02 \(auto-applied\)/i;
const SP03_MARKER = /INSTRUCTIONAL-PATTERN-SP-03 \(auto-applied\)/i;
const SP06_MARKER = /INSTRUCTIONAL-PATTERN-SP-06 \(auto-applied\)/i;
const SP07_MARKER = /INSTRUCTIONAL-PATTERN-SP-07 \(auto-applied\)/i;

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
  assert.match(prompt, /## What experts notice/i);
  assert.match(prompt, /instructional FAIL \(FM-12\)/i);
  assert.match(prompt, /instructional FAIL \(FM-05\)/i);
  assert.match(prompt, /GOOD shape example/i);
  assert.match(prompt, /\*\*Bridge:\*\*/i);
  assert.match(prompt, /FORBIDDEN:.*FM-05/i);
  assert.match(prompt, /MP-1/i);
  assert.match(prompt, /MP-2/i);
  assert.match(prompt, /MP-3/i);
}

function assertSp07Content(prompt) {
  assert.match(prompt, SP07_MARKER);
  assert.match(prompt, /SP-07 \/ SO-SP-01 annotated sample output/i);
  assert.match(prompt, /sample_output/i);
  assert.match(prompt, /## Why this works/i);
  assert.match(prompt, /instructional FAIL \(FM-11\)/i);
  assert.match(prompt, /Use this as a quality guide, not as text to copy/i);
}

function assertSp01Content(prompt) {
  assert.match(prompt, SP01_MARKER);
  assert.match(prompt, /SP-01 \/ TEXT-SP-01 connective exposition prose/i);
  assert.match(prompt, /substantive connective exposition/i);
  assert.match(prompt, /at least two distinct ideas/i);
  assert.match(prompt, /instructional FAIL \(FM-07\)/i);
  assert.match(prompt, /FORBIDDEN: appended Cognition cues: block or orientation metadata inside text Content — FM-07/i);
}

const PEER_GOAL =
  "Peer instruction session: individual answer, pair discussion, then revise answers after discussion.";

function resolveCognitionContract(brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    selectedDomains: ["learning-design"]
  });
  const { resolved } = api.resolveWorkflowBriefFactors(ldBriefConfig, explicit, {}, {}, brief);
  const packs = api.resolvePedagogicCognitionPackIds(ldBriefConfig, resolved, explicit, brief);
  return api.resolvePedagogicCognitionContractRequirements(
    packs,
    resolved,
    explicit,
    ldBriefConfig,
    brief
  );
}

test("48-2: lib exports SP-02, SP-03, SP-06, SP-07, and apply helper", () => {
  assert.equal(patternLib.MODULE_ID, "INSTRUCTIONAL-PATTERN-PROMPT");
  assert.match(patternLib.MARKER_SP02, SP02_MARKER);
  assert.match(patternLib.MARKER_SP03, SP03_MARKER);
  assert.match(patternLib.MARKER_SP06, SP06_MARKER);
  assert.match(patternLib.MARKER_SP07, SP07_MARKER);
  assert.match(patternLib.MARKER_SP01, SP01_MARKER);
  const block = patternLib.buildInstructionalPatternPromptBlock();
  assertSp02Content(block);
  assertSp03Content(block);
  assertSp06Content(block);
  assertSp07Content(block);
  assertSp01Content(block);
});

test("48-2: self-directed learner-page GAM receives SP-02, SP-03, SP-06, SP-07, and SP-01 markers", () => {
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
  assertSp07Content(prompt);
  assertSp01Content(prompt);
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
  assert.doesNotMatch(prompt, SP07_MARKER);
  assert.doesNotMatch(prompt, SP01_MARKER);
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
  assert.doesNotMatch(prompt, SP07_MARKER);
  assert.doesNotMatch(prompt, SP01_MARKER);
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
  assert.doesNotMatch(prompt, SP07_MARKER);
  assert.doesNotMatch(prompt, SP01_MARKER);
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
  assert.equal((twice.match(SP07_MARKER) || []).length, 1);
  assert.equal((twice.match(SP01_MARKER) || []).length, 1);
});

test("48-2: lib apply helper does not duplicate markers", () => {
  const once = patternLib.applyInstructionalPatternPromptBlockToDraft("Draft.\n", {});
  const twice = patternLib.applyInstructionalPatternPromptBlockToDraft(once, {});
  assert.equal((twice.match(SP02_MARKER) || []).length, 1);
  assert.equal((twice.match(SP03_MARKER) || []).length, 1);
  assert.equal((twice.match(SP06_MARKER) || []).length, 1);
  assert.equal((twice.match(SP07_MARKER) || []).length, 1);
  assert.equal((twice.match(SP01_MARKER) || []).length, 1);
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
  assert.doesNotMatch(dlaPrompt, SP07_MARKER);
  assert.match(gamPrompt, SP02_MARKER);
  assert.match(gamPrompt, SP03_MARKER);
  assert.match(gamPrompt, SP06_MARKER);
  assert.match(gamPrompt, SP07_MARKER);
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

test("48-4: SP-06 GOOD shape example shows What experts notice then bridge without learner answer", () => {
  const block = patternLib.buildSp06PromptBlock();
  assert.match(block, /GOOD shape example/i);
  assert.match(block, /visible because\/reasoning between steps/i);
  assert.match(block, /## What experts notice/i);
  assert.match(block, /GOOD shape example[\s\S]*## What experts notice[\s\S]*\*\*Bridge:\*\*/i);
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

test("48-7: SP-05 block requires MUST bundle for checklist", () => {
  const block = patternLib.buildSp05PromptBlock();
  assert.match(block, /every checklist body MUST provide criteria-linked learner self-check verification/i);
  assert.match(block, /at least four checkable items tied to expected_output/i);
  assert.match(block, /learner-check imperatives \(Have you \/ Did you \/ Does your\)/i);
  assert.match(block, /## Common mistakes/i);
  assert.match(block, /### If any check is not met:/i);
});

test("48-7: SP-05 defines FM-09 instructional fail", () => {
  const block = patternLib.buildSp05PromptBlock();
  assert.match(
    block,
    /verifies row, table, or task completion only without reasoning-quality or criteria-evidence checks.*instructional FAIL \(FM-09\).*do not emit/i
  );
});

test("48-7: SP-05 defines stub and thin checklist instructional fails", () => {
  const block = patternLib.buildSp05PromptBlock();
  assert.match(block, /fewer than four checkable items.*pointer-only body.*instructional FAIL/i);
  assert.match(block, /FORBIDDEN: pointer or stub checklist/i);
});

test("48-7: SP-05 GOOD shape example shows Common mistakes and revise block", () => {
  const block = patternLib.buildSp05PromptBlock();
  assert.match(block, /GOOD shape example/i);
  assert.match(block, /Have you \[criterion tied to expected_output\]/i);
  assert.match(block, /not just named it/i);
  assert.match(block, /not described in general/i);
  assert.match(block, /GOOD shape example[\s\S]*## Common mistakes[\s\S]*### If any check is not met:/i);
  assert.match(block, /mechanism linking them/i);
  assert.match(block, /Revise your \[deliverable\] by \(1\)/i);
});

test("48-7: SP-05 FORBIDDEN floors name completion and reflection-only shapes", () => {
  const block = patternLib.buildSp05PromptBlock();
  assert.match(block, /FORBIDDEN: Did you finish\?/i);
  assert.match(block, /FORBIDDEN: reflection-only verification/i);
  assert.match(block, /FORBIDDEN: completion-dominant structures.*Is each row complete\?.*FM-09/i);
  assert.match(block, /FORBIDDEN in checklist.*Reflect on/i);
  assert.match(block, /FORBIDDEN: generic revise guidance/i);
});

test("48-7: SP-05 retains MP-1 ownership constraint", () => {
  const block = patternLib.buildSp05PromptBlock();
  assert.match(block, /Do not supply completed learner work or model answers/i);
  assert.doesNotMatch(block, /FM-11/i);
  assert.doesNotMatch(block, /grouped sections/i);
  assert.doesNotMatch(block, /misconception guard/i);
});

test("48-7: SP-02, SP-03, SP-04, and SP-06 blocks unchanged by Slice 7 refinement", () => {
  const sp02 = patternLib.buildSp02PromptBlock();
  const sp03 = patternLib.buildSp03PromptBlock();
  const sp04 = patternLib.buildSp04PromptBlock();
  const sp06 = patternLib.buildSp06PromptBlock();
  assert.match(sp02, /instructional FAIL \(FM-04\)/i);
  assert.match(sp03, /instructional FAIL \(FM-02\)/i);
  assert.match(sp04, /instructional FAIL \(FM-10\)/i);
  assert.match(sp06, /instructional FAIL \(FM-05\)/i);
  assert.doesNotMatch(sp02, /FM-09/i);
  assert.doesNotMatch(sp03, /checklist/i);
  assert.doesNotMatch(sp04, /CL-SP-01/i);
  assert.doesNotMatch(sp06, /FM-09/i);
});

test("48-7: lib apply helper appends SP-05 without duplicating marker", () => {
  const once = patternLib.applyInstructionalPatternPromptBlockToDraft("Draft.\n", {});
  assert.match(once, /INSTRUCTIONAL-PATTERN-SP-05 \(auto-applied\)/i);
  const twice = patternLib.applyInstructionalPatternPromptBlockToDraft(once, {});
  assert.equal((twice.match(/INSTRUCTIONAL-PATTERN-SP-05 \(auto-applied\)/gi) || []).length, 1);
});

test("49-2: GAM cognition contract excludes text materials (D-49-01)", () => {
  const contract = resolveCognitionContract({ goal: PEER_GOAL, selectedDomains: ["learning-design"] });
  assert.ok(contract);
  const block = api.buildPedagogicCognitionContractPromptBlock("gam", contract);
  assert.match(block, /non-text activity material block/i);
  assert.match(block, /Material: \.\.\. \(text\) bodies are exposition-only/i);
  assert.match(block, /do NOT append Cognition cues sections or orientation metadata inside text Content/i);
});

test("49-2: SP-01 block requires connective exposition MUST bundle", () => {
  const block = patternLib.buildSp01PromptBlock();
  assert.match(block, /every text body MUST provide substantive connective exposition/i);
  assert.match(block, /at least two distinct ideas/i);
  assert.match(block, /clearly distinct from assigning the learner deliverable/i);
  assert.match(block, /teach and explain for the learner/i);
});

test("49-2: SP-01 forbids cognition-cue appendages (FM-07)", () => {
  const block = patternLib.buildSp01PromptBlock();
  assert.match(block, /MUST NOT append Cognition cues sections, orientation metadata/i);
  assert.match(block, /instructional FAIL \(FM-07\)/i);
  assert.match(block, /FORBIDDEN: appended Cognition cues: block or orientation metadata inside text Content — FM-07/i);
  assert.doesNotMatch(block, /FM-08/i);
});

test("49-2: SP-01 GOOD shape example shows Marx M1-style progression and example", () => {
  const block = patternLib.buildSp01PromptBlock();
  assert.match(block, /GOOD shape example/i);
  assert.match(block, /relational language/i);
  assert.match(block, /intellectual progression/i);
  assert.match(block, /\*\*Example:\*\* Substantive applied illustration/i);
  assert.match(block, /do not pre-answer the learner's independent task/i);
});

test("49 C4: SP-01 examples no longer describe exposition as brief, concise, or lightweight", () => {
  const block = patternLib.buildSp01PromptBlock();
  assert.doesNotMatch(block, /\bbrief exposition\b/i);
  assert.doesNotMatch(block, /\bconcise exposition\b/i);
  assert.doesNotMatch(block, /\blightweight exposition\b/i);
  assert.doesNotMatch(block, /brief definitional prose/i);
  assert.match(block, /substantive connective exposition/i);
  assert.match(block, /explanatory definitional prose/i);
});

test("49 C4: SP-01 still requires connective exposition and retains FM-07", () => {
  const block = patternLib.buildSp01PromptBlock();
  assert.match(block, /every text body MUST provide substantive connective exposition/i);
  assert.match(block, /MUST NOT append Cognition cues sections, orientation metadata/i);
  assert.match(block, /instructional FAIL \(FM-07\)/i);
  assert.match(block, /FORBIDDEN: appended Cognition cues: block or orientation metadata inside text Content — FM-07/i);
});

test("49 C4: SP-02 through SP-06 blocks unaffected by SP-01 wording cleanup", () => {
  const sp02 = patternLib.buildSp02PromptBlock();
  const sp03 = patternLib.buildSp03PromptBlock();
  const sp04 = patternLib.buildSp04PromptBlock();
  const sp05 = patternLib.buildSp05PromptBlock();
  const sp06 = patternLib.buildSp06PromptBlock();
  assert.match(sp02, /instructional FAIL \(FM-04\)/i);
  assert.match(sp03, /instructional FAIL \(FM-02\)/i);
  assert.match(sp04, /instructional FAIL \(FM-10\)/i);
  assert.match(sp05, /instructional FAIL \(FM-09\)/i);
  assert.match(sp06, /instructional FAIL \(FM-05\)/i);
  assert.doesNotMatch(sp02, /FM-07/i);
  assert.doesNotMatch(sp03, /TEXT-SP-01/i);
});

test("49-2: SP-01 retains MP-1 ownership constraint", () => {
  const block = patternLib.buildSp01PromptBlock();
  assert.match(block, /Do not supply a completed learner response or pre-written deliverable/i);
  assert.match(block, /teach and frame only \(MP-1\)/i);
});

test("49-2: lib apply helper appends SP-01 without duplicating marker", () => {
  const once = patternLib.applyInstructionalPatternPromptBlockToDraft("Draft.\n", {});
  assert.match(once, SP01_MARKER);
  const twice = patternLib.applyInstructionalPatternPromptBlockToDraft(once, {});
  assert.equal((twice.match(SP01_MARKER) || []).length, 1);
});

test("51-1: SP-07 GOOD shape example shows Why this works after sample body", () => {
  const block = patternLib.buildSp07PromptBlock();
  assert.match(block, /GOOD shape example/i);
  assert.match(block, /GOOD shape example[\s\S]*## Why this works/i);
  assert.match(block, /Links concepts through a causal mechanism rather than listing definitions/i);
  assert.match(block, /Use this as a quality guide, not as text to copy/i);
});

test("51-1: SP-07 defines FM-11 instructional fail for missing Why this works", () => {
  const block = patternLib.buildSp07PromptBlock();
  assert.match(block, /instructional FAIL \(FM-11\)/i);
  assert.match(block, /no `## Why this works` section/i);
});

test("51-2: SP-05 defines FM-13 for missing Common mistakes or revise block", () => {
  const block = patternLib.buildSp05PromptBlock();
  assert.match(block, /instructional FAIL \(FM-13\)/i);
  assert.match(block, /without `## Common mistakes`/i);
});

test("51-2: SP-06 forbids embedded checklist in worked_example (FM-14)", () => {
  const block = patternLib.buildSp06PromptBlock();
  assert.match(block, /instructional FAIL \(FM-14\)/i);
  assert.match(block, /MUST NOT embed checklist bodies/i);
});

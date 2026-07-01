/**
 * Sprint 56 DLA-05 — SSOT rationalisation guards (emitted DLA Copy prompt).
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

const RNA_HCV_BRIEF = {
  goal:
    "Create a self-directed learning page on RNA virus genome organisation, replication, HCV mechanisms, and transmission strategies.",
  inputs: "Undergraduate biomedical students (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

const SPRINT_56_BASELINE_CHARS = 49949;
/** DLA-07 core ~31,769; post-stabilisation target ≤32k — see SPRINT-56-DLA-STABILISATION-PASS.md */
const SPRINT_56_TARGET_MAX_CHARS = 32000;

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function extractDlaPromptFactory(md) {
  const sectionIdx = md.indexOf("## 5. Design Learning Activities");
  const fence = md.indexOf("```json", md.indexOf("### Prompt Factory", sectionIdx));
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

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

function emitRnaHcvDlaCorePrompt(api) {
  const ldBriefConfig = api.normalizeWorkflowBriefConfig(
    extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
  );
  const explicit = api.extractWorkflowBriefExplicitFactors(RNA_HCV_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    RNA_HCV_BRIEF.goal,
    RNA_HCV_BRIEF.inputs
  );
  const resolved = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    RNA_HCV_BRIEF
  ).resolved;
  const wf = {
    goal: RNA_HCV_BRIEF.goal,
    desiredOutputs: RNA_HCV_BRIEF.desiredOutputs,
    workflowOutputs: ["Learner-facing page"],
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const step = {
    title: "Design Learning Activities",
    canonical_step_id: "step_design_learning_activities"
  };
  const dlaPromptFactory = extractDlaPromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowGoal: RNA_HCV_BRIEF.goal,
    workflowOutputs: wf.workflowOutputs,
    workflowOutputSpec: { goal: RNA_HCV_BRIEF.goal, desiredOutputs: RNA_HCV_BRIEF.desiredOutputs },
    step,
    matchedPattern: { promptFactory: dlaPromptFactory }
  });
  return api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});
}

function countMarker(prompt, marker) {
  const re = new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  return (prompt.match(re) || []).length;
}

test("Sprint 56 DLA-05: emitted core prompt within ≤32k budget", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.ok(
    prompt.length <= SPRINT_56_TARGET_MAX_CHARS,
    `expected ≤${SPRINT_56_TARGET_MAX_CHARS} chars, got ${prompt.length} (baseline ${SPRINT_56_BASELINE_CHARS})`
  );
});

test("Sprint 56 DLA-05: SSOT marker exactly once", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.equal(
    countMarker(prompt, "LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT (auto-applied)"),
    1
  );
});

test("Sprint 56 DLA-05: deprecated scaffold authorities absent from DLA prompt", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.doesNotMatch(prompt, /LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-COGNITION-ORIENTATION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /Learner-page activity framing \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /PRE-EMIT CHECKLIST \(before returning activities JSON\)/i);
});

test("Sprint 56 DLA-05: no conflicting scaffold range authorities", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.doesNotMatch(prompt, /self_explanation_prompt[^\n]*25–80/i);
  assert.doesNotMatch(prompt, /transfer_or_application_task \(30–70 words\)/i);
  assert.doesNotMatch(prompt, /transfer_or_application_task: on the culminating[^\n]*30–70/i);
  assert.match(prompt, /FORBIDDEN on scaffold fields/i);
  assert.match(prompt, /activity_preamble 50–120/i);
  assert.match(prompt, /transfer_or_application_task 35–80/i);
});

test("Sprint 56 DLA-05: single exemplar fingerprint and unified PRE-EMIT gate", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.equal(countMarker(prompt, "reasoning_orientation — Weak"), 1);
  assert.equal(countMarker(prompt, "reasoning_orientation — Strong"), 1);
  assert.ok(countMarker(prompt, "- SCAFFOLD GENRE:") >= 1);
  assert.equal(countMarker(prompt, "DLA PRE-EMIT SCAFFOLD GATE"), 1);
  assert.match(prompt, /Self-check: count words in every scaffold field/i);
});

test("Sprint 56 DLA-05: thin OUTPUT CONTRACT retains field index without duplicate ranges", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.match(prompt, /OUTPUT CONTRACT \(learner-facing copy fields — author to the learner; scaffold: LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT\)/i);
  assert.doesNotMatch(
    prompt,
    /reasoning_orientation: on compare\/analyse\/application\/cause-effect activities — 35–80 words/i
  );
});

test("Sprint 56 DLA-07: SSOT block precedes EQF and PEL on DLA learner-page prompt", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  const ssotIdx = prompt.search(/LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT \(auto-applied\)/i);
  const eqfIdx = prompt.search(/EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/i);
  const pelIdx = prompt.search(/Pedagogic enrichment — reasoning contract \(auto-applied\)/i);
  assert.ok(ssotIdx >= 0, "SSOT marker present");
  assert.ok(eqfIdx >= 0, "EQF marker present");
  assert.ok(ssotIdx < eqfIdx, "SSOT must precede EQF");
  if (pelIdx >= 0) {
    assert.ok(ssotIdx < pelIdx, "SSOT must precede PEL reasoning");
  }
});

test("Sprint 56 DLA-07: EQF qualified on DLA learner-page — no unqualified reduce scaffolding", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.doesNotMatch(prompt, /reduce scaffolding across the journey/i);
  assert.match(
    prompt,
    /DLA learner-page scaffold fields: follow LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT word floors and PRE-EMIT gate/i
  );
  assert.match(prompt, /fade learner_task\/materials support/i);
});

test("Sprint 56 DLA-07: PEL reasoning qualified — no one-cue minimisation on DLA path", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.doesNotMatch(prompt, /one reasoning cue set per activity/i);
  assert.match(prompt, /not one-line hints or single cues/i);
});

test("Sprint 56 DLA-07: JSON shape qualifier does not permit terse scaffold prose", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.match(prompt, /do not shorten scaffold prose for JSON brevity/i);
  assert.doesNotMatch(prompt, /not one-line hints, single cues, or arrow-only stems/i);
  assert.match(prompt, /not one-line hints or single cues/i);
});

test("Sprint 56 DLA-05: lib FIELD_WORD_RANGES aligned to SSOT", () => {
  const sandbox = {};
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, ["lib/ld-guided-learning-scaffold.js"]);
  const ranges = sandbox.PRISM_LD_GUIDED_LEARNING_SCAFFOLD.FIELD_WORD_RANGES;
  assert.equal(ranges.self_explanation_prompt.min, 35);
  assert.equal(ranges.transfer_or_application_task.min, 35);
  assert.equal(ranges.transfer_or_application_task.max, 80);
});

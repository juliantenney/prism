/**
 * Sprint 38-H — Evaluation harness fidelity (38H-4).
 * Static contract tests for ev-38h-inflation-pipeline-capture-once.mjs
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const harnessPath = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-06-05-sprint-38h-workbook-realisation-fidelity",
  "artefacts",
  "ev-38h-inflation-pipeline-capture-once.mjs"
);
const contractPath = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-06-05-sprint-38h-workbook-realisation-fidelity",
  "artefacts",
  "HARNESS-CONTRACT.md"
);
const legacy38gPath = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-06-04-sprint-38g-activity-component-quality",
  "artefacts",
  "ev-38g-inflation-pipeline-capture-once.mjs"
);

const harnessSrc = fs.readFileSync(harnessPath, "utf8");
const legacy38gSrc = fs.readFileSync(legacy38gPath, "utf8");
const contractMd = fs.readFileSync(contractPath, "utf8");

test("38H-4 harness: includes KM pipeline steps", () => {
  assert.match(harnessSrc, /step_generate_learning_content/);
  assert.match(harnessSrc, /step_model_knowledge/);
  assert.match(harnessSrc, /step_define_learning_outcomes/);
  assert.match(harnessSrc, /## 2\. Generate Learning Content/);
  assert.match(harnessSrc, /## 3\. Model Knowledge/);
});

test("38H-4 harness: persists knowledge_model and upstream artefacts", () => {
  assert.match(harnessSrc, /knowledge-model\.json/);
  assert.match(harnessSrc, /learning-content\.json/);
  assert.match(harnessSrc, /learning-outcomes\.json/);
  assert.match(harnessSrc, /dla-learning-activities\.json/);
  assert.match(harnessSrc, /knowledgeModelCaptured/);
});

test("38H-4 harness: wires knowledge_model into downstream steps", () => {
  assert.match(harnessSrc, /Upstream knowledge_model/);
  const dlaIdx = harnessSrc.indexOf("dlaText = await callOpenAI");
  const dlaBlock = harnessSrc.slice(dlaIdx, dlaIdx + 1200);
  assert.match(dlaBlock, /knowledge_model/);
  const gamIdx = harnessSrc.indexOf("gamTextRaw = await callOpenAI");
  const gamBlock = harnessSrc.slice(gamIdx, gamIdx + 1200);
  assert.match(gamBlock, /knowledge_model/);
});

test("38H-4 harness: does not use synthetic LO-only shortcut", () => {
  assert.doesNotMatch(harnessSrc, /Return \{ learning_outcomes: \[4 outcomes/);
  assert.match(harnessSrc, /loAug\.augmented/);
});

test("38H-4 harness: preserves EV-38G comparator naming and output dir", () => {
  assert.match(harnessSrc, /EV-38H-AFTER/);
  assert.match(harnessSrc, /Does not overwrite.*EV-38G-AFTER/);
  assert.match(harnessSrc, /priorRuns.*EV-38G-AFTER/);
  assert.doesNotMatch(harnessSrc, /EV-38G-AFTER-dla/);
});

test("38H-4 harness: legacy 38G script unchanged (no KM step)", () => {
  assert.doesNotMatch(legacy38gSrc, /step_model_knowledge/);
  assert.doesNotMatch(legacy38gSrc, /knowledge-model\.json/);
});

test("38H-4 HARNESS-CONTRACT documents full pipeline", () => {
  assert.match(contractMd, /Generate Learning Content/);
  assert.match(contractMd, /Model Knowledge/);
  assert.match(contractMd, /knowledge-model\.json/);
  assert.match(contractMd, /EV-38G-AFTER/);
  assert.match(contractMd, /do not overwrite/i);
});

test("38H-4b harness: strict KM artefact parse and output contract", () => {
  assert.match(harnessSrc, /parseKnowledgeModelCapture/);
  assert.match(harnessSrc, /buildKmHarnessOutputContract/);
  assert.match(harnessSrc, /sanitizePrismRunCapturedOutput/);
  assert.match(harnessSrc, /buildKmHarnessOutputContract\(KM_PIPELINE_STEP_NUM\)/);
  assert.match(harnessSrc, /OUTPUT: knowledge_model/);
  assert.doesNotMatch(harnessSrc, /if \(!knowledge_model\) \{\s*knowledge_model = \{ concepts: \[\]/s);
});

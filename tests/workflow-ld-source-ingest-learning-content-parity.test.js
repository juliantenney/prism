/**
 * Sprint 42-10 — source ingest converges on learning_content before Model Knowledge.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractGlcPromptFactory(md) {
  const idx = md.indexOf("## 2. Generate Learning Content");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function extractNormalizePromptFactory(md) {
  const idx = md.indexOf("## 1. Normalize Content");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

const api = loadPrismTestApi();
const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const glcPf = extractGlcPromptFactory(ldMd);
const normalizePf = extractNormalizePromptFactory(ldMd);

test("Normalize output remains normalized_content fidelity contract", () => {
  assert.equal(normalizePf.preferredOutputFormat, "structured_markdown");
  assert.match(normalizePf.promptTemplate, /do not introduce new ideas/i);
  assert.match(normalizePf.promptTemplate, /normalized_content/i);
  assert.doesNotMatch(normalizePf.promptTemplate, /learning_content/i);
});

test("GLC prompt tightens canonical learning_content JSON when source is normalized_content", () => {
  const tpl = glcPf.promptTemplate;
  assert.match(tpl, /normalized_content/i);
  assert.match(tpl, /governing question|central inquiry/i);
  assert.match(tpl, /intellectual progression/i);
  assert.match(tpl, /do not invent ideas unsupported/i);
  assert.match(tpl, /JSON top-level keys:.*title.*sections.*key_concepts.*examples/i);
  assert.match(tpl, /fenced JSON block only/i);
  assert.match(tpl, /STEP N OUTPUT: learning_content/i);
  assert.deepEqual(glcPf.defaultOutputStructure.keys, [
    "title",
    "sections",
    "key_concepts",
    "examples"
  ]);
});

test("Model Knowledge prompt prefers learning_content when both are bound", () => {
  const mkIdx = ldMd.indexOf("## 3. Model Knowledge");
  const fence = ldMd.indexOf("```json", mkIdx);
  const close = ldMd.indexOf("```", fence + 7);
  const mkPf = JSON.parse(ldMd.slice(fence + 7, close).trim());
  assert.match(mkPf.promptTemplate, /When learning_content is provided, treat it as the primary structured source/i);
  assert.match(mkPf.promptTemplate, /STEP N OUTPUT: knowledge_model/i);
});

/**
 * Sprint 51 Phase 1 — annotated model commentary (GAM prompt contracts).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const patternLib = require("../lib/instructional-pattern-prompt.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

const SP06_MARKER = /INSTRUCTIONAL-PATTERN-SP-06 \(auto-applied\)/i;
const SP07_MARKER = /INSTRUCTIONAL-PATTERN-SP-07 \(auto-applied\)/i;

function loadPelMaterialBlock() {
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
  return sandbox.window.__PRISM_TEST_API.buildSelfDirectedGamPelReasoningMaterialPromptBlock();
}

test("51-1: SP-07 requires Why this works on sample_output", () => {
  const block = patternLib.buildSp07PromptBlock();
  assert.match(block, SP07_MARKER);
  assert.match(block, /SP-07 \/ SO-SP-01 annotated sample output/i);
  assert.match(block, /sample_output/i);
  assert.match(block, /## Why this works/i);
  assert.match(block, /3–5 concise bullets/i);
  assert.match(block, /reasoning quality, conceptual connections, analytical moves/i);
  assert.match(block, /instructional FAIL \(FM-11\)/i);
  assert.match(block, /Use this as a quality guide, not as text to copy/i);
  assert.match(block, /FORBIDDEN in Why this works.*clear, detailed, well written/i);
});

test("51-1: SP-06 requires What experts notice before Bridge on worked_example", () => {
  const block = patternLib.buildSp06PromptBlock();
  assert.match(block, /## What experts notice/i);
  assert.match(block, /before \*\*Bridge:\*\*/i);
  assert.match(block, /instructional FAIL \(FM-12\)/i);
  assert.match(block, /FORBIDDEN in What experts notice.*clarity, detail, structure/i);
  assert.match(block, /GOOD shape example[\s\S]*## What experts notice[\s\S]*\*\*Bridge:\*\*/i);
});

test("51-1: apply helper appends SP-07 without duplicating marker", () => {
  const once = patternLib.applyInstructionalPatternPromptBlockToDraft("Draft.\n", {});
  assert.match(once, SP07_MARKER);
  const twice = patternLib.applyInstructionalPatternPromptBlockToDraft(once, {});
  assert.equal((twice.match(SP07_MARKER) || []).length, 1);
});

test("51-1: full pattern block includes SP-06 and SP-07", () => {
  const block = patternLib.buildInstructionalPatternPromptBlock();
  assert.match(block, SP06_MARKER);
  assert.match(block, SP07_MARKER);
  assert.match(block, /## What experts notice/i);
  assert.match(block, /## Why this works/i);
});

test("51-1: PEL material block reinforces weak/strong judgement sections", () => {
  const block = loadPelMaterialBlock();
  assert.match(block, /## What experts notice/i);
  assert.match(block, /## Why this works/i);
  assert.match(block, /## A weaker response would/i);
  assert.match(block, /## A stronger response would/i);
  assert.match(block, /criteria-led strong/i);
});

test("51-1: example bodies can satisfy commentary shape conventions", () => {
  const sampleOutput = [
    "> Model response linking mechanism to evidence in a parallel case.",
    "",
    "## Why this works",
    "- Links concepts through a causal mechanism rather than listing definitions.",
    "- Uses scenario-specific evidence to support the analytical move.",
    "- Moves beyond description by explaining relationships and implications.",
    "",
    "Use this as a quality guide, not as text to copy."
  ].join("\n");
  assert.match(sampleOutput, /## Why this works/i);
  assert.doesNotMatch(sampleOutput, /\bbecause it is clear\b/i);

  const workedExample = [
    "**Step 1:** Identify pressures — separate demand from cost shocks.",
    "**Step 2:** Map affected agents.",
    "",
    "## What experts notice",
    "- Effective analysis names the mechanism connecting cause and effect.",
    "- Novices label inflation without tracing who gains and loses.",
    "",
    "**Bridge:** Apply the same sequence to your scenario — do not copy this conclusion."
  ].join("\n");
  assert.match(workedExample, /## What experts notice[\s\S]*\*\*Bridge:\*\*/i);

  const judgement = [
    "## A weaker response would",
    "Inflation is bad because prices rose a lot — a slogan without criteria.",
    "",
    "## A stronger response would",
    "Rates each criterion with evidence from the scenario and explains trade-offs between feasibility and impact."
  ].join("\n");
  assert.match(judgement, /## A weaker response would[\s\S]*## A stronger response would/i);
});

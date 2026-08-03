/**
 * Sprint 51 Phase 2 — evaluative coaching (GAM prompt contracts).
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

const SP05_MARKER = /INSTRUCTIONAL-PATTERN-SP-05 \(auto-applied\)/i;
const SP06_MARKER = /INSTRUCTIONAL-PATTERN-SP-06 \(auto-applied\)/i;

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

test("51-2: SP-05 requires guided-review feature depth on checklist", () => {
  const block = patternLib.buildSp05PromptBlock();
  assert.match(block, SP05_MARKER);
  assert.match(block, /guided_criteria/i);
  assert.match(block, /normally emit 2–3 independently observable/i);
  assert.match(block, /Forbidden as stand-alone repairs \(generic-only\)/i);
  assert.match(block, /without supplying a complete replacement answer/i);
});

test("51-2: SP-05 requires actionable paired repairs", () => {
  const block = patternLib.buildSp05PromptBlock();
  assert.match(block, /Every expected feature MUST have a paired repair/i);
  assert.match(block, /GOOD guided depth example/i);
  assert.match(block, /IRES recruits ribosomes/i);
  assert.match(block, /FORBIDDEN: generic revise guidance/i);
});

test("51-2: SP-05 forbids motivational and generic-only coaching language", () => {
  const block = patternLib.buildSp05PromptBlock();
  assert.match(block, /FORBIDDEN: motivational coaching/i);
  assert.match(block, /revisit\/review the material/i);
  assert.match(block, /add more detail/i);
  assert.match(block, /use precise terminology/i);
});

test("51-2: SP-06 forbids checklist embedded in worked_example", () => {
  const block = patternLib.buildSp06PromptBlock();
  assert.match(block, SP06_MARKER);
  assert.match(block, /MUST NOT embed checklist bodies/i);
  assert.match(block, /instructional FAIL \(FM-14\)/i);
  assert.match(block, /separate Material: \.\.\. \(checklist\)/i);
});

test("51-2: full pattern block still includes SP-05 guided-review quality", () => {
  const block = patternLib.buildInstructionalPatternPromptBlock();
  assert.match(block, SP05_MARKER);
  assert.match(block, /guided_criteria/i);
  assert.match(block, /normally emit 2–3 independently observable/i);
});

test("51-2: PEL material block reinforces evaluative coaching", () => {
  const block = loadPelMaterialBlock();
  assert.match(block, /INSTRUCTIONAL-PATTERN-SP blocks/i);
  assert.match(block, /Which part of your answer provides explanation rather than description/i);
  assert.match(block, /Which claim is least well supported/i);
  assert.match(block, /diagnostic only/i);
});

test("51-2: example bodies satisfy evaluative coaching shape conventions", () => {
  const checklist = [
    "Use this to evaluate your evaluation report:",
    "",
    "• Have you linked each price pressure to a specific agent and mechanism?",
    "• Have you cited at least one scenario detail per major claim?",
    "• Have you addressed whether multiple causes interact?",
    "• Have you stated what remains uncertain?",
    "",
    "## Common mistakes",
    "- Label-only classification with no mechanism or evidence.",
    "- Listing affected agents without explaining how the pressure reaches them.",
    "- Generic justification that could fit any inflation case.",
    "",
    "### If any check is not met:",
    "Revise your report by (1) adding a mechanism sentence for each classification, (2) quoting one scenario detail per claim."
  ].join("\n");
  assert.match(checklist, /## Common mistakes[\s\S]*### If any check is not met:/i);
  assert.doesNotMatch(checklist, /\bReflect on\b/i);

  const workedExample = [
    "**Step 1:** Separate demand-led from cost-led pressures.",
    "**Step 2:** Map which agents gain or lose.",
    "",
    "## What experts notice",
    "- Strong analysis names the transmission mechanism.",
    "",
    "**Bridge:** Apply the same sequence to your scenario."
  ].join("\n");
  assert.doesNotMatch(workedExample, /Have you /i);
  assert.doesNotMatch(workedExample, /## Common mistakes/i);
});

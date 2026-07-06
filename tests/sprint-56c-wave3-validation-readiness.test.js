/**
 * Sprint 56C Wave 3 — validation readiness meta-test bundle.
 *
 * Purpose: validate framework artefact existence/linkage only.
 * Non-goal: runtime-generation or educational-quality validation.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const sprintDir = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-07-06-sprint-56c-design-page-migration-execution"
);

const ARCH_DEF = path.join(
  sprintDir,
  "SPRINT-56C-WAVE-3-VALIDATION-ARCHITECTURE-DEFINITION.md"
);
const DISCOVERY = path.join(sprintDir, "SPRINT-56C-WAVE-3-VALIDATION-DISCOVERY.md");
const VISIBILITY = path.join(sprintDir, "SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md");
const REGISTRY = path.join(sprintDir, "SPRINT-56C-WAVE-3-FIXTURE-REGISTRY.md");
const DUAL_PATH = path.join(sprintDir, "SPRINT-56C-WAVE-3-DUAL-PATH-REVIEW-FRAMEWORK.md");
const CROSSWALK = path.join(
  sprintDir,
  "SPRINT-56C-WAVE-3-FAILURE-MODE-STRUCTURAL-REVIEW.md"
);
const INVENTORY = path.join(sprintDir, "SPRINT-56C-WAVE-3-REGRESSION-INVENTORY.md");
const CHECKLIST = path.join(sprintDir, "SPRINT-56C-EXECUTION-CHECKLIST.md");
const PLAYBOOK = path.join(sprintDir, "SPRINT-56C-WAVE-3-COPILOT-CAPTURE-PLAYBOOK.md");

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

test("56C W3 readiness: required governance artefacts exist", () => {
  [ARCH_DEF, DISCOVERY, VISIBILITY, REGISTRY, DUAL_PATH, CROSSWALK, INVENTORY, CHECKLIST].forEach(
    (p) => assert.equal(fs.existsSync(p), true, p)
  );
});

test("56C W3 readiness: fixture registry declares frozen class IDs", () => {
  const text = read(REGISTRY);
  ["FX-MULTI", "FX-INFLATION", "FX-KNOWLEDGE", "FX-ASSESS", "FX-FACILITATOR", "FX-RICH-DLA-GAM"]
    .forEach((token) => assert.match(text, new RegExp(token)));
  assert.match(text, /path_a_status/i);
  assert.match(text, /path_b_status/i);
  assert.match(text, /structural_checklist_id/i);
});

test("56C W3 readiness: dual-path framework defines PATH-A and PATH-B rules", () => {
  const text = read(DUAL_PATH);
  assert.match(text, /PATH-A/i);
  assert.match(text, /PATH-B/i);
  assert.match(text, /P-A1/i);
  assert.match(text, /P-B2/i);
  assert.match(text, /allowed claims/i);
  assert.match(text, /prohibited claims/i);
  assert.match(text, /Runtime generation quality is not validated by Prism/i);
});

test("56C W3 readiness: FM-A to FM-G crosswalk is present", () => {
  const text = read(CROSSWALK);
  ["FM-A", "FM-B", "FM-C", "FM-D", "FM-E", "FM-F", "FM-G"].forEach((id) =>
    assert.match(text, new RegExp(id))
  );
  assert.match(text, /trigger/i);
  assert.match(text, /detection source/i);
  assert.match(text, /review path/i);
  assert.match(text, /severity/i);
});

test("56C W3 readiness: regression inventory maps 56C suites to controls", () => {
  const text = read(INVENTORY);
  [
    "sprint-56c-wave1-phase1-gates.test.js",
    "sprint-56c-wave1-phase2a-gates.test.js",
    "sprint-56c-wave1-phase2b-gates.test.js",
    "sprint-56c-wave1-phase3-va-gates.test.js",
    "sprint-56c-wave2-gates.test.js",
    "ld-thin-assembly-coherence.test.js",
    "ld-design-page-compose-contract.test.js",
    "ld-materials-copy.test.js"
  ].forEach((name) => assert.match(text, new RegExp(name.replace(/\./g, "\\."))));
  assert.match(text, /56C-VALIDATION-READINESS-BUNDLE/);
});

test("56C W3 readiness: checklist §E is completed for Wave 3", () => {
  const text = read(CHECKLIST);
  const sectionE = text.slice(text.indexOf("## E. Validation readiness checks"));
  assert.match(sectionE, /\*\*OQ-24\*\* dual-path \*\*review framework\*\* documented \| ☑/);
  assert.match(
    sectionE,
    /\*\*OQ-25\*\* canonical fixtures \*\*identified\*\* \(definitions recorded\) \| ☑/
  );
  assert.match(sectionE, /Failure modes A–G mapped to structural review criteria \| ☑/);
  assert.match(
    sectionE,
    /Runtime acceptance testing delegated to Copilot environment where artefact capture requires generation \| ☑/
  );
});

test("56C W3 readiness: optional copilot capture playbook exists and is constraint-safe", () => {
  assert.equal(fs.existsSync(PLAYBOOK), true);
  const text = read(PLAYBOOK);
  assert.match(text, /## Prohibited language/i);
  assert.match(text, /Runtime generation quality not validated in Prism scope/i);
});

/**
 * Sprint 104 — shared workload authoring principles (proportionality guidance).
 *
 * Authoring guidance only: the single principles module, its use in Practice authoring contracts
 * and in the authenticated Learning Journey commissioning prompt. No estimator is involved.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const repoRoot = path.resolve(__dirname, "..");
const principles = require(path.join(repoRoot, "lib", "workload-authoring-principles.js"));

test("shared principles module exposes canonical statements", () => {
  const list = principles.listPrinciples();
  const ids = list.map((p) => p.id);
  [
    "integrated_performance",
    "genuine_additional_demand",
    "familiar_revisit",
    "complementary_feedback",
    "revision_mode",
    "scope_from_task",
    "heuristic_estimates"
  ].forEach((id) => assert.ok(ids.includes(id), `principle ${id} present`));
  assert.equal(principles.promptLines().length, list.length);
});

test("Practice workload economy lines include the shared principles", () => {
  const contracts = require(path.join(repoRoot, "lib", "ld-practice-presentation-contracts.js"));
  const dla = contracts.buildPracticePresentationContractBlock("dla");
  assert.match(dla, /Shared workload principles/);
  assert.match(dla, /charge the cognition once/);
});

test("authenticated commissioning prompts carry the shared principles block", () => {
  const prompts = require(path.join(repoRoot, "lib", "learning-journey-sibling-prompts.js"));
  const block = principles.promptBlock();
  assert.ok(prompts.TEMPLATES.learning_commissions.includes(block), "legacy/export-derived template");
  const progressive = prompts.PROGRESSIVE_TEMPLATES.learning_commissions;
  assert.ok(progressive.includes(principles.PROMPT_HEADING), "progressive stage-4 template");
  principles.promptLines().forEach((line) => {
    assert.ok(progressive.includes(line), "progressive template carries: " + line.slice(0, 40));
  });
  Object.keys(prompts.TEMPLATES).forEach((k) => {
    if (k === "learning_commissions") return;
    assert.ok(!String(prompts.TEMPLATES[k]).includes(principles.PROMPT_HEADING), k);
  });
});

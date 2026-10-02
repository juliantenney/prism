/**
 * Sprint 89 — first-class identity and the closed generated-topology path.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const family = require("../lib/first-class-workflow-family.js");

test("legacy ldCreateOutputType maps to product identity and prose does not", () => {
  const fromType = family.readFirstClassIdentity({ ldCreateOutputType: "expository_resource" });
  assert.equal(fromType.product, "expository");
  assert.equal(fromType.source, "legacy_ldCreateOutputType");
  const prose = family.readFirstClassIdentity({
    name: "create an expository resource",
    goal: "create an expository resource"
  });
  assert.equal(prose.product, "");
  assert.equal(prose.source, "unknown");
});

test("first-class create still does not call a model", () => {
  const built = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Bayes",
    startingPoint: "topic"
  });
  assert.equal(built.ok, true);
  assert.equal(built.callsModel, false);
  assert.equal(built.deliverySeed.assessment_depth, "standard");
});

test("generated topology and elicitation entry points are absent", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const app = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  const context = fs.readFileSync(path.join(__dirname, "..", "workflowGenerationContext.js"), "utf8");
  assert.equal(app.includes("function continueWorkflowDesignGeneration"), false);
  assert.equal(app.includes("function callOpenAIForWorkflowDesign"), false);
  assert.equal(app.includes("function applyWorkflowDesignHeuristics"), false);
  assert.equal(app.includes("function handleWorkflowAnswer"), false);
  assert.match(app, /delete wf\.ldCreateOutputType/);
  assert.equal(context.includes("function buildWorkflowGenerationContext"), false);
  assert.equal(context.includes("function getWorkflowPolicy"), false);
});

test("stored product wins over a leftover output type", () => {
  const identity = family.readFirstClassIdentity({
    product: "assessment_pack",
    ldCreateOutputType: "expository_resource"
  });
  assert.equal(identity.product, "assessment_pack");
  assert.equal(identity.source, "stored");
});

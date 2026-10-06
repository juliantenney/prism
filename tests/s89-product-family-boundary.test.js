/**
 * Sprint 89 slice 4 — the three first-class products share one integration declaration.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const family = require("../lib/first-class-workflow-family.js");

const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("four first-class products are declared including Learning Journey", () => {
  const ids = family.listFirstClassProducts().map((row) => row.id);
  assert.deepEqual(ids, ["interactive", "expository", "assessment_pack", "learning_journey"]);
});

test("each product builds its predetermined family", () => {
  const interactive = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  const expository = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "expository_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  const assessment = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Bayes",
    startingPoint: "topic"
  });
  assert.equal(interactive.identity.product, "interactive");
  assert.equal(expository.identity.product, "expository");
  assert.equal(assessment.identity.product, "assessment_pack");
  assert.ok(interactive.titles.indexOf("Design Learning Activities") !== -1);
  assert.ok(expository.titles.indexOf("Expository Journey Plan") !== -1);
  assert.ok(assessment.titles.indexOf("Plan Assessment Evidence") !== -1);
  assert.equal(interactive.callsModel, false);
  assert.equal(expository.callsModel, false);
  assert.equal(assessment.callsModel, false);
});

test("prompt and publish routes are positive and Custom is generic", () => {
  assert.equal(family.promptRouteForWorkflow({ product: "interactive" }), "interactive");
  assert.equal(family.promptRouteForWorkflow({ product: "expository" }), "expository");
  assert.equal(family.promptRouteForWorkflow({ product: "assessment_pack" }), "assessment");
  assert.equal(family.promptRouteForWorkflow({ product: "learning_journey" }), "learning_journey");
  assert.equal(family.promptRouteForWorkflow({ name: "create an expository resource" }), "generic");
  assert.equal(family.publishRouteForWorkflow({ product: "interactive" }), "learner_page");
  assert.equal(family.publishRouteForWorkflow({ product: "expository" }), "expository_page");
  assert.equal(family.publishRouteForWorkflow({ product: "assessment_pack" }), "assessment_pack");
  assert.equal(family.publishRouteForWorkflow({ product: "learning_journey" }), "learning_journey_page");
  assert.equal(family.publishRouteForWorkflow({}), "");
});

test("legacy identity still maps once and a stored product wins", () => {
  const legacy = family.readFirstClassIdentity({ ldCreateOutputType: "workshop" });
  assert.equal(legacy.product, "interactive");
  assert.equal(legacy.variant, "workshop");
  assert.equal(legacy.source, "legacy_ldCreateOutputType");
  const stored = family.readFirstClassIdentity({
    product: "expository",
    ldCreateOutputType: "self_study_resource"
  });
  assert.equal(stored.product, "expository");
  assert.equal(stored.source, "stored");
});

test("Assessment accepts Interactive or Expository output and is not itself a source", () => {
  const assessment = family.listFirstClassProducts().find((row) => row.id === "assessment_pack");
  assert.deepEqual(assessment.acceptsProductOutputFrom, ["interactive", "expository"]);
  const asSource = family.readFirstClassProductOutput(
    { id: "a", product: "assessment_pack", steps: [{ id: "dp", title: "Design Page", canonical_step_id: "step_design_page" }] },
    { dp: "{}" }
  );
  assert.equal(asSource.ok, false);
  const interactive = family.readFirstClassProductOutput(
    { id: "i", product: "interactive", steps: [{ id: "dp", title: "Design Page", canonical_step_id: "step_design_page" }] },
    { dp: "{\"artifact_type\":\"page\"}" }
  );
  assert.equal(interactive.ok, true);
  assert.equal(interactive.product, "interactive");
});

test("Create markup options match the family declaration", () => {
  const declared = family.listCreateDeclarations();
  const select = indexHtml.match(/<select[^>]*id="wfLdCreateOutputType"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(select);
  const options = [];
  const re = /<option value="([^"]*)">/g;
  let match;
  while ((match = re.exec(select[1]))) options.push(match[1]);
  assert.deepEqual(
    options.filter((value) => value),
    declared.map((row) => row.value)
  );
  assert.equal(declared.find((row) => row.value === "assessment_pack").parameterHook, "assessment_pack");
  assert.equal(declared.find((row) => row.value === "workshop").product, "interactive");
});

/**
 * Expository topology comes from the predetermined family, not a generated-graph rewrite.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const family = require("../lib/first-class-workflow-family.js");

test("Expository topic pipeline is the sibling stages, not the Interactive middle", () => {
  const built = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "expository_resource",
    focus: "Photosynthesis",
    startingPoint: "topic"
  });
  const titles = built.titles;
  assert.ok(titles.includes("Expository Journey Plan"));
  assert.ok(titles.includes("Expository Development"));
  assert.ok(titles.includes("Expository Materials"));
  assert.equal(titles.includes("Design Episode Plan"), false);
  assert.equal(titles.includes("Generate Assessment Items"), false);
  assert.equal(titles.includes("Design Assessment"), false);
});

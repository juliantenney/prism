/**
 * Sprint 58 — GAI partial page enrich contract tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const gaiContract = require("../lib/ld-gai-page-enrich-contract.js");

test("GAI contract requires partial page envelope with assessment_check", () => {
  const block = gaiContract.buildGaiPageEnrichContractBlock();
  assert.match(block, /artifact_type.*page/i);
  assert.match(block, /assessment_items/i);
  assert.match(block, /assessment_check/i);
  assert.match(block, /Do not return standalone assessment_items JSON/i);
});

test("canonical GAI shape snippet forbids legacy root items object", () => {
  const snippet = gaiContract.buildCanonicalGaiAssessmentShapeSnippet();
  assert.match(snippet, /"assessment_check"/);
  assert.match(snippet, /Invalid GAI outputs/i);
  assert.match(snippet, /root object with only "items"/i);
});

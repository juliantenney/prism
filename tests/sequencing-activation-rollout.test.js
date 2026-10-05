/**
 * Sequencing activation — policy unit smoke (legacy utility HTML retired).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadPrismAppJsTestApi, installVnextPageShapeCompatForTests } = require("./prism-vm-lib-bootstrap.js");

const fixturePath = path.join(__dirname, "fixtures", "page-render", "sequencing-rollout-learner-page.json");

const { api: rawApi } = loadPrismAppJsTestApi();
const api = installVnextPageShapeCompatForTests(rawApi);

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

test("strict learner path: sequencing row suppresses duplicate instruction list", () => {
  const page = loadFixture();
  const seqRow = page.sections[0].content[0];
  const suppressed = api.shouldSuppressInstructionList(
    seqRow,
    seqRow.materials,
    seqRow.learner_instructions,
    { enableSequencingInteractionPolicy: true },
    "learner"
  );
  assert.equal(suppressed, true);
});

test("explicit false override keeps suppression disabled", () => {
  const page = loadFixture();
  const seqRow = page.sections[0].content[0];
  const suppressed = api.shouldSuppressInstructionList(
    seqRow,
    seqRow.materials,
    seqRow.learner_instructions,
    { enableSequencingInteractionPolicy: false },
    "learner"
  );
  assert.equal(suppressed, false);
});

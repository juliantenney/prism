const test = require("node:test");
const assert = require("node:assert/strict");

const ldTable = require("../lib/ld-table-fidelity.js");

test("LD-TABLE-FIDELITY: module metadata", () => {
  assert.equal(ldTable.MODULE_ID, "LD-TABLE-FIDELITY");
  assert.match(ldTable.MARKER, /LD-TABLE-FIDELITY/);
});

test("LD-TABLE-FIDELITY: author role includes row adequacy and pipe rules", () => {
  const text = ldTable.buildLdTableFidelityPromptBlock({ role: "author" });
  assert.match(text, /LD-TABLE-FIDELITY \(auto-applied\)/i);
  assert.match(text, /complete pipe table with header row, divider row/i);
  assert.match(text, /never a single blank row when multiple learner responses/i);
  assert.match(text, /FORBIDDEN in materials table fields/i);
  assert.match(text, /figures only/i);
});

test("LD-TABLE-FIDELITY: preserve role without marker when embedded", () => {
  const text = ldTable.buildLdTableFidelityPromptBlock({
    role: "preserve",
    includeMarker: false
  });
  assert.doesNotMatch(text, /LD-TABLE-FIDELITY \(auto-applied\)/i);
  assert.match(text, /Preserve role \(Design Page\)/i);
  assert.match(text, /comma-separated rows/i);
});

test("LD-TABLE-FIDELITY: spec role for DLA cross-reference", () => {
  const text = ldTable.buildLdTableFidelityPromptBlock({ role: "spec" });
  assert.match(text, /Spec role \(Design Learning Activities\)/i);
  assert.match(text, /pipe markdown tables in Generate Activity Materials/i);
});

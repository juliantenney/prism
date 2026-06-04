const test = require("node:test");
const assert = require("node:assert/strict");

const materialsCopy = require("../lib/ld-materials-copy.js");

test("LD-MATERIALS-COPY: module metadata", () => {
  assert.equal(materialsCopy.MODULE_ID, "LD-MATERIALS-COPY");
  assert.match(materialsCopy.MARKER, /LD-MATERIALS-COPY/);
});

test("LD-MATERIALS-COPY: preserve role without marker when embedded", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "preserve",
    includeMarker: false
  });
  assert.doesNotMatch(text, /LD-MATERIALS-COPY \(auto-applied\)/i);
  assert.match(text, /merge every upstream block/i);
  assert.match(text, /Set of scenarios/i);
  assert.match(text, /PREC-02/i);
  assert.match(text, /LD-TABLE-FIDELITY/i);
});

test("LD-MATERIALS-COPY: author role without marker for GAM embed", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "author",
    includeMarker: false
  });
  assert.match(text, /Author role \(Generate Activity Materials\)/i);
  assert.match(text, /label-only strings/i);
  assert.doesNotMatch(text, /LD-MATERIALS-COPY \(auto-applied\)/i);
});

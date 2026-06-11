const test = require("node:test");
const assert = require("node:assert/strict");

const compose = require("../lib/ld-design-page-compose-contract.js");
const materialsCopy = require("../lib/ld-materials-copy.js");
const tableFidelity = require("../lib/ld-table-fidelity.js");

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: module metadata", () => {
  assert.equal(compose.MODULE_ID, "LD-DESIGN-PAGE-COMPOSE-CONTRACT");
  assert.match(compose.MARKER, /LD-DESIGN-PAGE-COMPOSE-CONTRACT/);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: membership and validation anchors", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /\(U \\ X\) ⊆ C/);
  assert.match(text, /activities_omitted\[\]/i);
  assert.match(text, /assessment_check\.content object with items\[\]/i);
  assert.match(text, /never omit for output size/i);
  assert.match(text, /upstream learning_activities \(not only activity_materials\)/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: materials bridge without duplicate module markers", () => {
  const text = compose.buildLdDesignPageComposePromptBlock({
    materialsCopyBlock: materialsCopy.buildLdMaterialsCopyPromptBlock({
      role: "preserve",
      includeMarker: false
    }),
    tableFidelityBlock: tableFidelity.buildLdTableFidelityPromptBlock({
      role: "preserve",
      includeMarker: false
    })
  });
  assert.match(text, /additive page-root metadata only/i);
  assert.match(text, /copy activity\.materials\.\* verbatim from upstream activity_materials/i);
  assert.match(text, /LD-MATERIALS-COPY \| Layer: L4/i);
  assert.match(text, /Preserve role \(Design Page\)/i);
  assert.match(text, /LD-TABLE-FIDELITY \| Layer: L4/i);
  assert.doesNotMatch(text, /LD-MATERIALS-COPY \(auto-applied\)/i);
  assert.doesNotMatch(text, /LD-TABLE-FIDELITY \(auto-applied\)/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: field preservation optional", () => {
  const withFields = compose.buildLdDesignPageComposePromptBlock({ includeFieldPreservation: true });
  const withoutFields = compose.buildLdDesignPageComposePromptBlock({ includeFieldPreservation: false });
  assert.match(withFields, /activity_preamble/i);
  assert.doesNotMatch(withoutFields, /Activity field preservation/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: references sibling modules without inlining bodies", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /LD-SELF-DIRECTED-RHETORIC/i);
  assert.match(text, /LD-MATH-RENDER/i);
  assert.match(text, /Sprint 38 visual/i);
  assert.match(text, /additive page-root metadata only/i);
  assert.doesNotMatch(text, /Example generate record/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: composeAlreadyPresent", () => {
  assert.equal(compose.composeAlreadyPresent(""), false);
  assert.equal(
    compose.composeAlreadyPresent("LD-DESIGN-PAGE-COMPOSE-CONTRACT (auto-applied):\n"),
    true
  );
  assert.equal(
    compose.composeAlreadyPresent("Design Page activity materials fidelity (auto-applied):\n"),
    true
  );
});

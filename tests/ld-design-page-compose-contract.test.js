const test = require("node:test");
const assert = require("node:assert/strict");

const compose = require("../lib/ld-design-page-compose-contract.js");
const exposition = require("../lib/ld-authorial-exposition.js");
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

test("49-C2: membership forbids material shell and synopsis substitution", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /copy the full materials object onto the matching row/i);
  assert.match(text, /no synopsis, reference-only, placeholder, or catalogue substitution/i);
  assert.match(text, /generation_notes\.limitations with explicit reason/i);
  assert.match(text, /never truncate, summarise, or thin materials to references/i);
  assert.doesNotMatch(text, /activity shell with available fields and material references/i);
  assert.doesNotMatch(text, /retain the activity shell/i);
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

test("49-C2: field preservation list unchanged", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /activity_preamble, learner_task, prior_knowledge_activation, reasoning_orientation/i);
  assert.match(text, /intellectual_frame, intellectual_coherence_bridge/i);
  assert.match(text, /learner_task, expected_output, and support_note/i);
  assert.equal(
    compose.FIELD_PRESERVATION_FIELD_IDS,
    "activity_preamble, learner_task, prior_knowledge_activation, reasoning_orientation, self_explanation_prompt, evidence_use_prompt, argument_structure_hint, conceptual_contrast_prompt, disciplinary_lens, transfer_or_application_task, scaffold_hint_sequence, uncertainty_tension_prompt, study_orientation, intellectual_frame, intellectual_coherence_bridge"
  );
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: field preservation optional", () => {
  const withFields = compose.buildLdDesignPageComposePromptBlock({ includeFieldPreservation: true });
  const withoutFields = compose.buildLdDesignPageComposePromptBlock({ includeFieldPreservation: false });
  assert.match(withFields, /activity_preamble/i);
  assert.doesNotMatch(withoutFields, /Activity field preservation/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: references LD-AUTHORIAL-EXPOSITION sibling", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /LD-AUTHORIAL-EXPOSITION/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: references LD-JOURNEY-ASSIMILATION sibling", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /LD-JOURNEY-ASSIMILATION/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: references sibling modules without inlining bodies", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /LD-SELF-DIRECTED-RHETORIC/i);
  assert.match(text, /LD-MATH-RENDER/i);
  assert.match(text, /Sprint 38 visual/i);
  assert.match(text, /additive page-root metadata only/i);
  assert.doesNotMatch(text, /Example generate record/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: portable episode_plans schema in compose block", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.ok(Array.isArray(compose.EPISODE_PLAN_LINES));
  assert.ok(compose.EPISODE_PLAN_LINES.length >= 4);
  assert.match(text, /EPISODE PLANS \(portable page schema/i);
  assert.match(text, /top-level episode_plans\[\]/i);
  assert.match(text, /per-activity episode_plan/i);
  assert.match(text, /episode_plan_source_activity_id/i);
  assert.match(text, /source_artefacts MUST list episode_plans/i);
  assert.match(text, /self-describing/i);
  assert.match(text, /without requiring workflow captures or session state/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: authorable vs archival pointer before materials embed", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /AUTHORABLE VS ARCHIVAL FIELDS/i);
  assert.match(text, /materials\.\* is archival only/i);
  assert.match(text, /PRE-EMIT VALIDATION/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: authoritative GAM content binding pointer", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /Authoritative GAM content binding \(hard\)/i);
  assert.match(text, /AUTHORITATIVE GAM CONTENT BINDING/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: multi-material enumeration pointer", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /Multi-material enumeration \(hard\)/i);
  assert.match(text, /MULTI-MATERIAL ENUMERATION INVARIANT/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: full content body preservation pointer", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /Full content body preservation \(hard\)/i);
  assert.match(text, /FULL CONTENT BODY PRESERVATION/i);
  assert.match(text, /entire embedded Content: body — not reference, excerpt, summary, or condensed representation/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: page artefact is final learner output pointer", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /Final learner output \(hard\)/i);
  assert.match(text, /PAGE ARTEFACT IS FINAL LEARNER OUTPUT/i);
  assert.match(text, /no "Full \.\.\. from \.\.\."/i);
  assert.match(text, /do not emit it as a valid page/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: material preservation overrides page optimisation pointer", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /Material preservation overrides page optimisation \(hard\)/i);
  assert.match(text, /MATERIAL PRESERVATION OVERRIDES PAGE OPTIMISATION/i);
  assert.match(text, /represented in condensed form/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: opaque payload pointer at activity_materials", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /activity\.materials opaque transport \(hard\)/i);
  assert.match(text, /OPAQUE PAYLOAD TRANSPORT/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: context access rule pointer", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /CONTEXT ACCESS RULE/i);
  assert.match(text, /LO1-TEXT, LO2-SCN/i);
  assert.match(text, /full material bodies are unavailable/i);
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

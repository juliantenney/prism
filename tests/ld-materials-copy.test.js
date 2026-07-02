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
  assert.doesNotMatch(text, /near-verbatim/i);
  assert.doesNotMatch(text, /shorten only clearly non-essential/i);
  assert.match(text, /verbatim into activity\.materials\.\*/i);
  assert.match(text, /FORBIDDEN inflation-collapse substitutes/i);
  assert.match(text, /Demand exceeds supply → demand-pull inflation/i);
  assert.match(text, /OPAQUE PAYLOAD TRANSPORT/i);
});

test("LD-MATERIALS-COPY: opaque payload forbidden transforms", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "preserve",
    includeMarker: false
  });
  assert.match(text, /transport, not authoring/i);
  assert.match(text, /scenario → one-sentence scenario description/i);
  assert.match(text, /modelling_note → framework label or arrow chain only/i);
  assert.match(text, /consolidation_summary → synthesis-summary descriptor/i);
  assert.doesNotMatch(text, /concrete scenarios \(named cases with context/i);
});

test("LD-MATERIALS-COPY: authorable vs archival fields", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "preserve",
    includeMarker: false
  });
  assert.match(text, /AUTHORABLE VS ARCHIVAL FIELDS/i);
  assert.match(text, /Archival \(not authorable\): learning_activities\.content\[\]\.materials\.\*/i);
  assert.match(text, /Do not modify materials for coherence, readability, page flow/i);
  assert.match(text, /PRE-EMIT VALIDATION/i);
  assert.match(text, /not model-authored/i);
});

test("LD-MATERIALS-COPY: authoritative GAM content binding", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "preserve",
    includeMarker: false
  });
  assert.match(text, /AUTHORITATIVE GAM CONTENT BINDING/i);
  assert.match(text, /Metadata \(routing\/mapping\/field naming only/i);
  assert.match(text, /learning_activities\.content\[\]\.materials\[<destination_field>\]/i);
  assert.match(text, /PRE-EMIT CONTENT BINDING VALIDATION/i);
  assert.match(text, /Leadership memo template\./i);
  assert.match(text, /## Leadership Memo Template/i);
});

test("LD-MATERIALS-COPY: multi-material enumeration invariant", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "preserve",
    includeMarker: false
  });
  assert.match(text, /MULTI-MATERIAL ENUMERATION INVARIANT/i);
  assert.match(text, /count\(activity\.materials keys\) must equal count\(GAM Material blocks/i);
  assert.match(text, /Do not: choose a representative material/i);
  assert.match(text, /only materials\.text is present when multiple GAM materials exist/i);
  assert.match(text, /worked_example.*exact Content body/i);
});

test("LD-MATERIALS-COPY: full content body preservation", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "preserve",
    includeMarker: false
  });
  assert.match(text, /FULL CONTENT BODY PRESERVATION/i);
  assert.match(text, /entire Content: body/i);
  assert.match(text, /until the next Material:, next Activity:, STEP marker, or EOF/i);
  assert.match(text, /must include all paragraphs, bullets, table rows, and headings/i);
  assert.match(text, /must not be shortened to the first line/i);
  assert.match(text, /only a heading, opening sentence, table header, checklist first item, or template title/i);
});

test("LD-MATERIALS-COPY: material preservation overrides page optimisation", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "preserve",
    includeMarker: false
  });
  assert.match(text, /MATERIAL PRESERVATION OVERRIDES PAGE OPTIMISATION/i);
  assert.match(text, /page-size optimisation, rendering practicality, brevity preferences/i);
  assert.match(text, /Large output is acceptable; condensed output is not/i);
  assert.match(text, /Leadership Judgement Memo template\./i);
  assert.match(text, /Model readiness judgement\./i);
  assert.match(text, /represented in condensed form/i);
  assert.match(text, /fail generation — do not emit the page/i);
});

test("LD-MATERIALS-COPY: page artefact is final learner output", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "preserve",
    includeMarker: false
  });
  assert.match(text, /PAGE ARTEFACT IS FINAL LEARNER OUTPUT/i);
  assert.match(text, /not a renderer contract, content index, material reference map/i);
  assert.match(text, /Full worked example from LO1-WE/i);
  assert.match(text, /See upstream material/i);
  assert.match(text, /refers to content instead of containing it/i);
  assert.match(text, /do not emit it as a valid page/i);
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

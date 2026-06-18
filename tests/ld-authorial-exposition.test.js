const test = require("node:test");
const assert = require("node:assert/strict");

const exposition = require("../lib/ld-authorial-exposition.js");
const compose = require("../lib/ld-design-page-compose-contract.js");

test("LD-AUTHORIAL-EXPOSITION: module metadata", () => {
  assert.equal(exposition.MODULE_ID, "LD-AUTHORIAL-EXPOSITION");
  assert.match(exposition.MARKER, /LD-AUTHORIAL-EXPOSITION-CONTRACT/);
});

test("49-C1: authorial scope is wrapper prose only", () => {
  const text = exposition.buildLdAuthorialExpositionPromptBlock();
  assert.match(text, /wrapper prose \(overview, learning_purpose, knowledge_summary, study_tips/i);
  assert.match(text, /wrapper sections only/i);
  assert.doesNotMatch(text, /improve how they read when composed/i);
});

test("49-C1: rhetorical role separation covers wrapper sections only", () => {
  const text = exposition.buildLdAuthorialExpositionPromptBlock();
  assert.match(text, /RHETORICAL ROLE SEPARATION/i);
  assert.match(text, /overview — establish intellectual journey/i);
  assert.match(text, /knowledge_summary — preview concepts/i);
  assert.doesNotMatch(text, /activity_preamble — prepare learner thinking/i);
  assert.doesNotMatch(text, /intellectual_coherence_bridge — connect prior reasoning/i);
});

test("49-C1: preservation boundary excludes activity and material fields from authorial polish", () => {
  const text = exposition.buildLdAuthorialExpositionPromptBlock();
  assert.match(text, /PRESERVATION BOUNDARY/i);
  assert.match(text, /Copy verbatim when present upstream/i);
  assert.match(text, /activity_preamble, learner_task, expected_output, support_note/i);
  assert.match(text, /activity\.materials\.\* \/ activity_materials bodies/i);
  assert.match(text, /Do not rewrite, compress, summarise, paraphrase, or reinterpret preserved fields/i);
  assert.doesNotMatch(text, /FRAMING ASSIMILATION/i);
  assert.doesNotMatch(text, /Write activity_preamble, reasoning_orientation/i);
});

test("LD-AUTHORIAL-EXPOSITION: transition quality and learner arc", () => {
  const text = exposition.buildLdAuthorialExpositionPromptBlock();
  assert.match(text, /TRANSITION QUALITY/i);
  assert.match(text, /intellectual momentum/i);
  assert.match(text, /Explanation → Exploration → Reasoning → Reflection → Synthesis/i);
});

test("LD-AUTHORIAL-EXPOSITION: anti-redundancy and voice profiles", () => {
  const selfStudy = exposition.buildLdAuthorialExpositionPromptBlock({ facilitated: false });
  const workshop = exposition.buildLdAuthorialExpositionPromptBlock({ facilitated: true });
  assert.match(selfStudy, /ANTI-REDUNDANCY \(wrapper sections only\)/i);
  assert.match(selfStudy, /Explanation before task/i);
  assert.doesNotMatch(selfStudy, /study_orientation may address sequence/i);
  assert.match(workshop, /No facilitator choreography/i);
  assert.match(workshop, /circulate, minutes 5–12/i);
});

test("LD-AUTHORIAL-EXPOSITION: expositionAlreadyPresent", () => {
  assert.equal(exposition.expositionAlreadyPresent(""), false);
  assert.equal(
    exposition.expositionAlreadyPresent("LD-AUTHORIAL-EXPOSITION-CONTRACT (auto-applied):\n"),
    true
  );
});

test("LD-DESIGN-PAGE-COMPOSE: embeds authorial exposition block when provided", () => {
  const authorialBlock = exposition.buildLdAuthorialExpositionPromptBlock({ includeMarker: false });
  const text = compose.buildLdDesignPageComposePromptBlock({
    includeAuthorialExposition: true,
    authorialExpositionBlock: authorialBlock
  });
  assert.match(text, /LD-DESIGN-PAGE-COMPOSE-CONTRACT/i);
  assert.match(text, /RHETORICAL ROLE SEPARATION/i);
  assert.match(text, /PRESERVATION BOUNDARY/i);
  assert.match(text, /LD-AUTHORIAL-EXPOSITION/i);
});

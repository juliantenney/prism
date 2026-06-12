const test = require("node:test");
const assert = require("node:assert/strict");

const exposition = require("../lib/ld-authorial-exposition.js");
const compose = require("../lib/ld-design-page-compose-contract.js");

test("LD-AUTHORIAL-EXPOSITION: module metadata", () => {
  assert.equal(exposition.MODULE_ID, "LD-AUTHORIAL-EXPOSITION");
  assert.match(exposition.MARKER, /LD-AUTHORIAL-EXPOSITION-CONTRACT/);
});

test("LD-AUTHORIAL-EXPOSITION: rhetorical role separation", () => {
  const text = exposition.buildLdAuthorialExpositionPromptBlock();
  assert.match(text, /RHETORICAL ROLE SEPARATION/i);
  assert.match(text, /overview — establish intellectual journey/i);
  assert.match(text, /activity_preamble — prepare learner thinking/i);
  assert.match(text, /intellectual_coherence_bridge — connect prior reasoning/i);
});

test("LD-AUTHORIAL-EXPOSITION: transition and framing assimilation", () => {
  const text = exposition.buildLdAuthorialExpositionPromptBlock();
  assert.match(text, /TRANSITION QUALITY/i);
  assert.match(text, /intellectual momentum/i);
  assert.match(text, /FRAMING ASSIMILATION/i);
  assert.match(text, /Explanation → Exploration → Reasoning → Reflection → Synthesis/i);
  assert.match(text, /do not write meta-labels in content/i);
});

test("LD-AUTHORIAL-EXPOSITION: anti-redundancy and voice profiles", () => {
  const selfStudy = exposition.buildLdAuthorialExpositionPromptBlock({ facilitated: false });
  const workshop = exposition.buildLdAuthorialExpositionPromptBlock({ facilitated: true });
  assert.match(selfStudy, /ANTI-REDUNDANCY/i);
  assert.match(selfStudy, /Explanation before task/i);
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
  assert.match(text, /LD-AUTHORIAL-EXPOSITION/i);
});

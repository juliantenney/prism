const test = require("node:test");
const assert = require("node:assert/strict");

const journey = require("../lib/ld-journey-assimilation.js");

test("LD-JOURNEY-ASSIMILATION: module metadata", () => {
  assert.equal(journey.MODULE_ID, "LD-JOURNEY-ASSIMILATION");
  assert.match(journey.MARKER, /LD-JOURNEY-ASSIMILATION-CONTRACT/);
});

test("LD-JOURNEY-ASSIMILATION: upstream signals and wrapper sections", () => {
  const text = journey.buildLdJourneyAssimilationPromptBlock();
  assert.match(text, /UPSTREAM SIGNALS/i);
  assert.match(text, /learning_content — central inquiry/i);
  assert.match(text, /knowledge_model — concepts/i);
  assert.match(text, /learning_sequence — timeline order/i);
  assert.match(text, /transition_to_next/i);
  assert.match(text, /KNOWLEDGE SUMMARY/i);
  assert.match(text, /CLOSURE \/ STUDY TIPS/i);
});

test("LD-JOURNEY-ASSIMILATION: inquiry voice and preservation boundary", () => {
  const text = journey.buildLdJourneyAssimilationPromptBlock();
  assert.match(text, /Question → Investigation → Evidence → Judgement/i);
  assert.match(text, /Having distinguished/i);
  assert.match(text, /never rewrite, compress, or mutate activity\.materials/i);
  assert.match(text, /PREC-02/i);
});

test("LD-JOURNEY-ASSIMILATION: assimilationAlreadyPresent", () => {
  assert.equal(journey.assimilationAlreadyPresent(""), false);
  assert.equal(
    journey.assimilationAlreadyPresent("LD-JOURNEY-ASSIMILATION-CONTRACT (auto-applied):\n"),
    true
  );
});

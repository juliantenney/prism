/**
 * Sprint 56C Wave 2 W2.3A — LD-THIN-ASSEMBLY-COHERENCE contract unit tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const bridge = require("../lib/ld-thin-assembly-coherence.js");

const MARKER = /LD-THIN-ASSEMBLY-COHERENCE-CONTRACT \(auto-applied\)/i;

const DP_CTX = {
  stepCanonicalStepId: "step_design_page",
  stepCanonicalTitle: "Design Page"
};

const DLA_CTX = {
  stepCanonicalStepId: "step_design_learning_activities",
  stepCanonicalTitle: "Design Learning Activities"
};

test("LD-THIN-ASSEMBLY-COHERENCE: contract exists and exports correctly", () => {
  assert.equal(bridge.MODULE_ID, "LD-THIN-ASSEMBLY-COHERENCE");
  assert.match(bridge.MARKER, MARKER);
  assert.ok(bridge.LD_THIN_ASSEMBLY_COHERENCE_CONTRACT);
  assert.equal(bridge.LD_THIN_ASSEMBLY_COHERENCE_CONTRACT.MODULE_ID, "LD-THIN-ASSEMBLY-COHERENCE");
  assert.equal(typeof bridge.buildLdThinAssemblyCoherencePromptBlock, "function");
  assert.equal(typeof bridge.applyLdThinAssemblyCoherenceContractToDraft, "function");
  assert.equal(bridge.NAVIGATION_POINTER_WORD_CAP, 80);
  assert.equal(bridge.TRANSITION_GLUE_WORD_CAP, 60);
});

test("LD-THIN-ASSEMBLY-COHERENCE: apply function is idempotent on Design Page", () => {
  const once = bridge.applyLdThinAssemblyCoherenceContractToDraft("Base draft.\n", DP_CTX);
  const twice = bridge.applyLdThinAssemblyCoherenceContractToDraft(once, DP_CTX);
  assert.equal(once, twice);
  const hits = twice.match(/LD-THIN-ASSEMBLY-COHERENCE-CONTRACT \(auto-applied\)/gi);
  assert.equal(hits && hits.length, 1);
});

test("LD-THIN-ASSEMBLY-COHERENCE: apply passthrough on non-Design Page steps", () => {
  const out = bridge.applyLdThinAssemblyCoherenceContractToDraft("DLA draft.\n", DLA_CTX);
  assert.equal(out, "DLA draft.");
  assert.doesNotMatch(out, MARKER);
});

test("LD-THIN-ASSEMBLY-COHERENCE: wrapper-gap bridge behaviour only", () => {
  const text = bridge.buildLdThinAssemblyCoherencePromptBlock();
  assert.match(text, /TRANSPORT-FIRST/i);
  assert.match(text, /wrapper-gap fallback only/i);
  assert.match(text, /overview — navigation pointer only when no upstream overview body exists/i);
  assert.match(text, /learning_purpose — structural orientation only when no upstream learning_purpose body exists/i);
  assert.match(text, /Emit bridge fallback prose only where a wrapper slot remains empty/i);
  assert.match(text, /if no gap exists, omit bridge prose entirely/i);
  assert.match(text, /verbatim upstream transition placement/i);
  assert.match(text, /Section headings — organisational labels/i);
  assert.match(text, /membership signalling/i);
});

test("LD-THIN-ASSEMBLY-COHERENCE: prohibits teaching, summaries, synthesis, study tips", () => {
  const text = bridge.buildLdThinAssemblyCoherencePromptBlock();
  assert.match(text, /PROHIBITED/i);
  assert.match(text, /Teaching, instructional explanations/i);
  assert.match(text, /Summaries of materials/i);
  assert.match(text, /knowledge_summary or study_tips synthesis/i);
  assert.match(text, /learning guidance/i);
  assert.doesNotMatch(text, /synthesise what should now be clearer/i);
  assert.doesNotMatch(text, /glossary-style repetition/i);
});

test("LD-THIN-ASSEMBLY-COHERENCE: prohibits rhetoric, journey, authorial, EQF, VA, intellectual bridge generation", () => {
  const text = bridge.buildLdThinAssemblyCoherencePromptBlock();
  assert.match(text, /Rhetoric, voice polish/i);
  assert.match(text, /journey assimilation, or authorial exposition/i);
  assert.match(text, /EDUCATIONAL-QUALITY-FRAMEWORK augmentation on Design Page/i);
  assert.match(text, /Visual affordance generation/i);
  assert.match(text, /Generating or rewriting intellectual_coherence_bridge/i);
  assert.doesNotMatch(text, /LD-JOURNEY-ASSIMILATION/i);
  assert.doesNotMatch(text, /LD-AUTHORIAL-EXPOSITION/i);
  assert.doesNotMatch(text, /LD-SELF-DIRECTED-RHETORIC/i);
  assert.doesNotMatch(text, /Sprint 38 visual affordance authoring contract/i);
});

test("LD-THIN-ASSEMBLY-COHERENCE: preserves upstream content and forbids condensation", () => {
  const text = bridge.buildLdThinAssemblyCoherencePromptBlock();
  assert.match(text, /transport upstream body verbatim when present/i);
  assert.match(text, /Never override, paraphrase, or replace transported wrapper text/i);
  assert.match(text, /Never condense, summarise, paraphrase, or optimise GAM, DLA, episode, or assessment payloads/i);
  assert.match(text, /copy verbatim on activity rows/i);
  assert.match(text, /never assimilate into overview or learning_purpose/i);
  assert.match(text, /obey appended LD-DESIGN-PAGE-COMPOSE-CONTRACT/i);
});

test("LD-THIN-ASSEMBLY-COHERENCE: includes 80-word navigation and 60-word transition caps", () => {
  const text = bridge.buildLdThinAssemblyCoherencePromptBlock();
  assert.match(text, /≤ 80 words per affected section/i);
  assert.match(text, /≤ 60 words per insert/i);
  assert.equal(bridge.NAVIGATION_POINTER_WORD_CAP, 80);
  assert.equal(bridge.TRANSITION_GLUE_WORD_CAP, 60);
});

test("LD-THIN-ASSEMBLY-COHERENCE: does not reference removed modules as authorities", () => {
  const text = bridge.buildLdThinAssemblyCoherencePromptBlock();
  assert.doesNotMatch(text, /obey LD-JOURNEY-ASSIMILATION/i);
  assert.doesNotMatch(text, /obey LD-AUTHORIAL-EXPOSITION/i);
  assert.doesNotMatch(text, /LD-SELF-DIRECTED-RHETORIC/i);
  assert.doesNotMatch(text, /Question → Investigation → Evidence → Judgement/i);
  assert.doesNotMatch(text, /RHETORICAL ROLE SEPARATION/i);
  assert.match(text, /LD-DESIGN-PAGE-COMPOSE-CONTRACT/i);
  assert.match(text, /LD-MATERIALS-COPY/i);
});

test("LD-THIN-ASSEMBLY-COHERENCE: coherenceAlreadyPresent detects marker", () => {
  assert.equal(bridge.coherenceAlreadyPresent(""), false);
  assert.equal(
    bridge.coherenceAlreadyPresent("LD-THIN-ASSEMBLY-COHERENCE-CONTRACT (auto-applied):\n"),
    true
  );
});

test("LD-THIN-ASSEMBLY-COHERENCE: isThinAssemblyCoherenceTargetStep resolves Design Page", () => {
  assert.equal(bridge.isThinAssemblyCoherenceTargetStep(DP_CTX), true);
  assert.equal(bridge.isThinAssemblyCoherenceTargetStep({ stepCanonicalTitle: "Design Page" }), true);
  assert.equal(bridge.isThinAssemblyCoherenceTargetStep(DLA_CTX), false);
});

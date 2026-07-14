const test = require("node:test");
const assert = require("node:assert/strict");

const depth = require("../lib/ld-gam-instructional-depth.js");

test("LD-GAM-INSTRUCTIONAL-DEPTH: module metadata", () => {
  assert.equal(depth.MODULE_ID, "LD-GAM-INSTRUCTIONAL-DEPTH");
  assert.match(depth.MARKER, /LD-GAM-INSTRUCTIONAL-DEPTH/);
});

test("LD-GAM-INSTRUCTIONAL-DEPTH: exemplars identified as internal generation guidance", () => {
  const text = depth.buildGamInstructionalDepthPromptBlock();
  assert.match(text, /EXEMPLAR PURPOSE/i);
  assert.match(text, /INTERNAL GENERATION GUIDANCE/i);
  assert.match(text, /NOT learner-facing content/i);
  assert.match(text, /must not become part of the generated materials/i);
  assert.match(text, /generation guidance only — do not surface as learner content/i);
});

test("LD-GAM-INSTRUCTIONAL-DEPTH: meta-instructional leakage prohibited", () => {
  const text = depth.buildGamInstructionalDepthPromptBlock();
  assert.match(text, /ANTI-LEAKAGE — PROHIBIT META-INSTRUCTIONAL COMMENTARY/i);
  assert.match(text, /A weak explanation/i);
  assert.match(text, /A stronger recommendation/i);
  assert.match(text, /CONVERT META COMMENTARY INTO DIRECT TEACHING/i);
  assert.match(
    text,
    /A weak explanation jumps directly from heteroscedasticity to bad results/i
  );
  assert.match(
    text,
    /Heteroscedasticity affects the reliability of standard errors because changing variance/i
  );
});

test("LD-GAM-INSTRUCTIONAL-DEPTH: subject-matter-first guidance present", () => {
  const text = depth.buildGamInstructionalDepthPromptBlock();
  assert.match(text, /Subject-matter-first principle/i);
  assert.match(text, /focus on the learner's understanding of the subject matter/i);
  assert.match(
    text,
    /concepts, evidence, reasoning, decisions, consequences, and interpretation/i
  );
  assert.match(text, /not commentary about how the content was generated/i);
});

test("LD-GAM-INSTRUCTIONAL-DEPTH: comparative reasoning guidance remains", () => {
  const text = depth.buildGamInstructionalDepthPromptBlock();
  assert.match(text, /DOMAIN COMPARISON REMAINS DESIRABLE/i);
  assert.match(text, /comparisons of interpretations, competing explanations/i);
  assert.match(text, /REQUIRED COMPARATIVE MOVES/i);
  assert.match(text, /Plausible competing interpretation/i);
  assert.match(
    text,
    /One interpretation is that residual variance increases as fitted values increase/i
  );
});

test("LD-GAM-INSTRUCTIONAL-DEPTH: existing exemplar sets remain present", () => {
  const text = depth.buildGamInstructionalDepthPromptBlock();
  assert.match(text, /Heteroscedasticity can make statistical inference less reliable/i);
  assert.match(
    text,
    /Heteroscedasticity changes the spread of residuals across observations/i
  );
  assert.match(text, /Residual plots help identify heteroscedasticity/i);
  assert.match(text, /A residual plot compares prediction errors with fitted values/i);
  assert.match(
    text,
    /A researcher observes increasing residual variance and must decide what to do/i
  );
  assert.match(
    text,
    /Maya is evaluating a household spending model using 2,000 observations/i
  );
  assert.match(text, /The plot suggests heteroscedasticity\./i);
  assert.match(text, /Higher temperature speeds up the reaction/i);
  assert.match(text, /Unclear responsibilities cause project delays/i);
});

test("LD-GAM-INSTRUCTIONAL-DEPTH: preserves anti-rubric-mimicry guidance", () => {
  const text = depth.buildGamInstructionalDepthPromptBlock();
  assert.match(text, /ANTI-GAMING — DO NOT EMIT RUBRIC LABELS/i);
  assert.match(text, /Cause:\", \"Mechanism:\", \"Immediate effect:/i);
});

test("LD-GAM-INSTRUCTIONAL-DEPTH: apply only on GAM step", () => {
  const draft = "Base prompt";
  const withGam = depth.applyLdGamInstructionalDepthContractToDraft(draft, {
    isGenerateActivityMaterialsStep: true
  });
  assert.match(withGam, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT/);
  const withoutGam = depth.applyLdGamInstructionalDepthContractToDraft(draft, {
    isGenerateActivityMaterialsStep: false
  });
  assert.equal(withoutGam, draft);
});

test("LD-GAM-INSTRUCTIONAL-DEPTH: deduplicates marker", () => {
  const once = depth.applyLdGamInstructionalDepthContractToDraft("Base", {
    isGenerateActivityMaterialsStep: true
  });
  const twice = depth.applyLdGamInstructionalDepthContractToDraft(once, {
    isGenerateActivityMaterialsStep: true
  });
  assert.equal(twice, once);
});

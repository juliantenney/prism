/**
 * Generation-guidance regressions: prediction-/investigation-led Interactives
 * protect an independent attempt before complete explanation; revision and
 * transfer rules stay conditional; direct instruction remains valid.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const designPagePartial = require("../lib/ld-design-page-partial-contract.js");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");
const gamContract = require("../lib/ld-gam-page-enrich-contract.js");
const eqf = require("../lib/educational-quality-framework-prompt.js");

const {
  shouldDeferMaterialToCheck,
  materialMatchesPostAttemptReveal
} = require("../lib/learner-renderer-vnext/compose-generic-moments.js");

test("Design Page knowledge_summary protects prediction-led destination explanations", () => {
  const text = designPagePartial.buildDesignPagePartialContractBlock();
  const shape = designPagePartial.buildCanonicalDesignPagePartialShapeSnippet();
  assert.match(text, /Interactive opening orientation/i);
  assert.match(text, /Conditional attempt-before-complete-explanation/i);
  assert.match(
    text,
    /Prediction → Investigation → Learner explanation → Formal explanation\/feedback → Revision/
  );
  assert.match(text, /not a universal ban on direct instruction/i);
  assert.match(text, /preparatory scaffolding/i);
  assert.match(text, /Avoid duplicating the same full explanation/i);
  assert.match(shape, /do not deliver the complete destination explanation upfront/i);
});

test("DLA production commissions attempt-before-complete-explanation only when design relies on it", () => {
  const production = dlaContract.assembleDlaCanonicalContract().sections.production;
  assert.match(production, /Conditional attempt-before-complete-explanation/i);
  assert.match(
    production,
    /Prediction → Investigation → Learner explanation → Formal explanation\/feedback → Revision/
  );
  assert.match(production, /Do not force this pattern/i);
  assert.match(production, /direct instruction or worked modelling/i);
  assert.match(production, /Discovery-sequence protection/i);
  assert.match(production, /Reveal after/i);
});

test("revision observability is a conditional three-part debrief, not a universal workspace", () => {
  const production = dlaContract.assembleDlaCanonicalContract().sections.production;
  assert.match(production, /Evidence-driven revision observability/i);
  assert.match(production, /what they initially thought/i);
  assert.match(production, /what evidence or reasoning challenged or confirmed/i);
  assert.match(production, /what they now conclude and why/i);
  assert.match(
    production,
    /Omit this structure where revision of an initial judgement is not an intended outcome/i
  );
  assert.match(production, /Do not add new interaction controls/i);
});

test("transfer guidance forbids repeating already-answered feedback cases without mandating transfer everywhere", () => {
  const production = dlaContract.assembleDlaCanonicalContract().sections.production;
  const commissioning = dlaContract.assembleDlaCanonicalContract().sections.commissioning;
  const gam = gamContract.buildGamPageEnrichContractBlock();
  assert.match(production, /not already answered by preceding examples or post-attempt feedback/i);
  assert.match(production, /Do not mandate an additional transfer task for every Interactive/i);
  assert.match(production, /Transfer distance may be near or far/i);
  assert.match(commissioning, /Do not commission a transfer whose answer is already given/i);
  assert.match(commissioning, /Do not mandate transfer for every Interactive/i);
  assert.match(
    gam,
    /Do not reuse a decision, allocation or comparison whose answer is already stated/i
  );
  assert.match(gam, /distinguishable from the activity's principal task/i);
});

test("GAM keeps complete destination explanations out of ordinary pre-task Learn when discovery-led", () => {
  const gam = gamContract.buildGamPageEnrichContractBlock();
  assert.match(gam, /Conditional attempt-before-complete-explanation \(GAM realisation\)/i);
  assert.match(
    gam,
    /post-attempt sample_output or marked Reveal\/Review\/Release-after feedback/i
  );
  assert.match(gam, /Direct instruction and upfront modelling remain valid/i);
  assert.match(
    gam,
    /do not duplicate that complete destination across ordinary pre-task Learn text and Check/i
  );
});

test("AS-02 allows preparatory framing before perform for prediction-led designs", () => {
  const overlay = dlaContract.buildDlaWorkbookOverlayBlock();
  assert.match(overlay, /IFP-05 ANTI-SHELL/);
  assert.match(overlay, /preparatory scaffolding and task framing satisfy AS-02/i);
  assert.match(overlay, /complete destination explanation may follow the independent attempt/i);
  assert.match(overlay, /prediction-first activation remains valid/i);
});

test("educational quality framework manifestations include conditional sequencing", () => {
  const dla = eqf.buildEducationalQualityFrameworkPromptBlock({
    context: { stepCanonicalStepId: "step_design_learning_activities" }
  });
  const gam = eqf.buildEducationalQualityFrameworkPromptBlock({
    context: { stepCanonicalStepId: "step_generate_activity_materials" }
  });
  const sequence = eqf.buildEducationalQualityFrameworkPromptBlock({
    context: { stepCanonicalStepId: "step_construct_learning_sequence" }
  });
  assert.match(dla, /protect an initial independent attempt before the complete explanation/i);
  assert.match(dla, /initial \/ evidence \/ revised-conclusion debrief/i);
  assert.match(gam, /complete destination explanations in post-attempt feedback/i);
  assert.match(sequence, /independent attempt precedes complete formal explanation\/feedback/i);
});

test("post-attempt disclosure detectors remain intact for Reveal/Review after solutions", () => {
  assert.equal(
    materialMatchesPostAttemptReveal({
      title: "Worked comparison",
      body: "## Reveal after completing your comparison\n\nAnswer: 25."
    }),
    true
  );
  assert.equal(
    shouldDeferMaterialToCheck({
      type: "sample_output",
      title: "Worked comparison",
      body: "## Reveal after completing your comparison\n\nAnswer: 25."
    }),
    true
  );
  assert.equal(
    shouldDeferMaterialToCheck({
      type: "text",
      title: "Prerequisite framing",
      body: "Area is the product of the side lengths. Feasibility is a separate check."
    }),
    false
  );
  assert.equal(
    shouldDeferMaterialToCheck({
      type: "worked_example",
      title: "Distinct-data model",
      body: "A separate practice rectangle shows the method without answering the focal cases."
    }),
    false
  );
});

test("Design Page domain prompt template carries the same knowledge_summary bound", () => {
  const md = fs.readFileSync(
    path.join(__dirname, "..", "domains", "learning-design", "domain-learning-design-step-patterns.md"),
    "utf8"
  );
  assert.match(md, /do not deliver the complete conceptual destination or formal derivation upfront/i);
  assert.match(
    md,
    /when activities rely on prediction, investigation or construction, do not deliver the complete destination explanation upfront/i
  );
  assert.match(md, /keep restated outcomes as capabilities not completed answers/i);
});

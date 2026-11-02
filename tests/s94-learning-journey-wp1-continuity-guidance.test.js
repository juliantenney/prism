/**
 * Sprint 94 WP1 / S94-T-003 — Step 4 commissioning and Step 5 Design Page
 * continuity guidance. Prompt-contract tests only. Semantic validation is WP2.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const sibling = require("../lib/learning-journey-sibling-prompts.js");
const design = require("../lib/learning-journey-design-page.js");

const STEP4 = sibling.TEMPLATES.learning_commissions;
const STEP5 = design.buildLearningJourneyDesignPagePrompt();
const COPY = design.buildLearningJourneyDesignPageCopyInstructions();

test("Step 4 commissioning retains Sprint 91 product-selection structure", () => {
  assert.match(STEP4, /You are commissioning the designed learning experiences required to realise a Learning Journey/);
  assert.match(STEP4, /LEARNING EXPERIENCE COMMISSIONS/);
  assert.match(STEP4, /CENTRE OF GRAVITY/);
  assert.match(STEP4, /unsupported commission/i);
  assert.match(STEP4, /situated_task|SITUATED TASK/);
});

test("Step 4 requires the four continuity distinctions", () => {
  assert.match(STEP4, /EDUCATIONAL CONTINUITY CONTRACT/);
  assert.match(STEP4, /EDUCATIONAL JOB/);
  assert.match(STEP4, /what learners will do in this component/i);
  assert.match(STEP4, /ESTABLISHED SCENARIO FACTS/);
  assert.match(STEP4, /MEANINGFUL PRECEDING ACTIVITIES/);
  assert.match(STEP4, /BRING-FORWARD/);
  assert.match(STEP4, /contribution to the journey progression/i);
});

test("Step 4 distinguishes recurring scenario, no-scenario, and omitted continuity", () => {
  assert.match(STEP4, /Not every Learning Journey uses a recurring scenario/);
  assert.match(STEP4, /deliberately has no recurring scenario/);
  assert.match(STEP4, /do not invent a shared scenario or locked options/i);
  assert.match(STEP4, /omitted required continuity/);
  assert.match(STEP4, /must not silently replace established facts/i);
  assert.match(STEP4, /If earlier components established a decision among named options, later commissions must restate those options/);
});

test("Step 4 requires meaningful preceding activities, not generic continuation", () => {
  assert.match(STEP4, /Continue the previous scenario/);
  assert.match(STEP4, /is insufficient/);
  assert.match(STEP4, /making an initial judgement/);
  assert.match(STEP4, /formulating investigative questions/);
  assert.match(STEP4, /gathering evidence/);
  assert.match(STEP4, /The first commission in journey order may have no preceding activities/);
  assert.match(STEP4, /Reference only educationally relevant preceding components/);
});

test("Step 4 bring-forward does not assume output inspection or response transport", () => {
  assert.match(STEP4, /Learners retain responsibility for referring to their own earlier work/);
  assert.match(STEP4, /Do not imply that PRISM automatically transfers learner responses/);
  assert.match(STEP4, /inspecting previous published resources or knowing individual learner responses/);
  assert.match(STEP4, /do not prove what generated or published resources actually contain/i);
});

test("Step 4 still uses existing commission fields rather than a new schema", () => {
  assert.doesNotMatch(STEP4, /preceding_activities\[\]/);
  assert.doesNotMatch(STEP4, /structured continuity object/i);
  assert.match(STEP4, /Educational job \(what learners will do/);
  assert.match(STEP4, /Established scenario facts, or an explicit statement that this journey has no recurring scenario/);
  assert.match(STEP4, /CONTINUITY CHECK/);
});

test("Step 5 preserves existing JSON structure and maps the three continuity fields", () => {
  assert.match(STEP5, /"specification_text"/);
  assert.match(STEP5, /"journey_context_text"/);
  assert.match(STEP5, /"dependencies"/);
  assert.match(STEP5, /this component's educational job and constraints/i);
  assert.match(STEP5, /explicit no-recurring-scenario statement/);
  assert.match(STEP5, /Continue the previous scenario/);
  assert.match(STEP5, /concise references to relevant earlier commission_id/i);
  assert.doesNotMatch(STEP5, /"preceding_activities"/);
  assert.match(STEP5, /no preceding_activities array/);
  assert.match(STEP5, /no structured continuity object/);
});

test("Step 5 forbids compressing Step 4 continuity and inspecting earlier outputs", () => {
  assert.match(STEP5, /compress Step 4 continuity into generic phrases/);
  assert.match(STEP5, /Preserve authoritative Step 4 continuity/);
  assert.match(STEP5, /must not assume access to earlier outputs or individual responses/);
  assert.match(STEP5, /The first commission in journey order may omit preceding-activity and bring-forward context/);
  assert.match(STEP5, /Do not invent a recurring scenario/);
  assert.match(STEP5, /must not silently replace established facts/);
  assert.match(STEP5, /If earlier components established a decision among named options, restate those options/);
  assert.match(COPY, /Preserve Step 4 continuity in specification_text, journey_context_text, and dependencies/);
  assert.match(COPY, /Do not compress continuity into generic continuation/);
});

test("Making Decisions Under Uncertainty regression is encoded as named-option preservation", () => {
  // C1 established a decision among longer library opening hours, additional study
  // spaces, and improved online support. WP1 does not regenerate that journey;
  // the guidance must require later commissions to restate named options and
  // allow new evidence without replacing them.
  assert.match(STEP4, /later commissions must restate those options/);
  assert.match(STEP4, /They may add evidence about the same decision/);
  assert.match(STEP4, /They must not substitute different options/);
  assert.match(STEP5, /If earlier components established a decision among named options, restate those options/);
  assert.match(STEP5, /Later components may introduce new evidence/);
});

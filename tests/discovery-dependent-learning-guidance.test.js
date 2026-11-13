/**
 * Discovery-dependent learning: orientation and learning outcomes must not
 * prematurely disclose explanations learners are meant to discover.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const eqf = require("../lib/educational-quality-framework-prompt.js");
const designPagePartial = require("../lib/ld-design-page-partial-contract.js");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");
const gamContract = require("../lib/ld-gam-page-enrich-contract.js");
const expositorySibling = require("../lib/expository-sibling-prompts.js");

const DOMAIN_PATTERNS = path.join(
  __dirname,
  "..",
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function assembledLoPrompt() {
  return eqf.applyEducationalQualityFrameworkPromptBlockToDraft(
    "You are designing learning outcomes from a structured knowledge model.\nGenerate clear outcomes.\n",
    {
      stepCanonicalStepId: "step_define_learning_outcomes",
      stepCanonicalTitle: "Define Learning Outcomes",
      stepTitle: "Define Learning Outcomes"
    }
  );
}

function assembledDesignPagePrompt() {
  const contract = designPagePartial.buildDesignPagePartialContractBlock();
  const shape = designPagePartial.buildCanonicalDesignPagePartialShapeSnippet();
  return [contract, shape].join("\n");
}

test("EQF targets Define Learning Outcomes and injects discovery protection into the assembled LO prompt", () => {
  assert.equal(
    eqf.isEducationalQualityFrameworkTargetStep({
      stepCanonicalStepId: "step_define_learning_outcomes"
    }),
    true
  );
  const prompt = assembledLoPrompt();
  assert.match(prompt, /EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/i);
  assert.match(prompt, /Discovery-dependent learning/i);
  assert.match(prompt, /capabilities learners will demonstrate/i);
  assert.match(prompt, /not completed answers to discovery-dependent activities/i);
  assert.match(
    prompt,
    /decisive case-specific explanations, hidden evidence, intended interpretations or resolutions/i
  );
  assert.match(prompt, /naming the intellectual work and revealing its solution/i);
});

test("EQF core principle reaches activity/sequence steps without banning direct instruction", () => {
  const dla = eqf.buildEducationalQualityFrameworkPromptBlock({
    context: { stepCanonicalStepId: "step_design_learning_activities" }
  });
  const sequence = eqf.buildEducationalQualityFrameworkPromptBlock({
    context: { stepCanonicalStepId: "step_construct_learning_sequence" }
  });
  assert.match(dla, /Discovery-dependent learning/i);
  assert.match(dla, /Retain prerequisite scaffolding/i);
  assert.match(dla, /direct instruction or worked modelling/i);
  assert.match(sequence, /Discovery-dependent learning/i);
  assert.match(
    sequence,
    /not merely because a resource contains a question or fictional scenario/i
  );
});

test("Design Page assembled orientation guidance protects outcomes and opening prose", () => {
  const prompt = assembledDesignPagePrompt();
  assert.match(prompt, /Interactive opening orientation/i);
  assert.match(prompt, /overview, learning_purpose, knowledge_summary/i);
  assert.match(prompt, /Discovery-dependent learning \(orientation\)/i);
  assert.match(prompt, /capabilities learners will demonstrate/i);
  assert.match(prompt, /explaining the task and revealing its solution/i);
  assert.match(prompt, /Extend the same bound to overview and learning_purpose/i);
  assert.match(prompt, /not a universal ban on direct instruction/i);
  assert.match(prompt, /safety\/accessibility information/i);
  assert.match(
    prompt,
    /not merely because the resource contains a question or fictional scenario/i
  );
  assert.match(prompt, /post-attempt \/ Reveal-after disclosure mechanisms/i);
  assert.match(prompt, /keep outcomes as capabilities not completed answers/i);
});

test("existing attempt-before / discovery-sequence guidance remains complementary, not conflicting", () => {
  const design = designPagePartial.buildDesignPagePartialContractBlock();
  const production = dlaContract.assembleDlaCanonicalContract().sections.production;
  const gam = gamContract.buildGamPageEnrichContractBlock();
  assert.match(design, /Conditional attempt-before-complete-explanation/i);
  assert.match(production, /Discovery-sequence protection/i);
  assert.match(production, /Distinct-data worked_example modelling remains allowed/i);
  assert.match(gam, /Direct instruction and upfront modelling remain valid/i);
  assert.match(gam, /Conditional attempt-before-complete-explanation \(GAM realisation\)/i);
  // Orientation/LO protection must not rewrite activity disclosure into a blanket ban.
  assert.doesNotMatch(design, /never explain concepts/i);
  assert.doesNotMatch(production, /ban on worked examples/i);
});

test("domain Define Learning Outcomes template carries the same discovery principle", () => {
  const md = fs.readFileSync(DOMAIN_PATTERNS, "utf8");
  assert.match(md, /## 4\. Define Learning Outcomes/);
  assert.match(md, /Discovery-dependent learning: when the learning design deliberately requires/i);
  assert.match(md, /capabilities learners will demonstrate/i);
  assert.match(md, /naming the intellectual work and revealing its solution/i);
  assert.match(md, /keep restated outcomes as capabilities not completed answers/i);
});

test("Expository LO sibling preserves direct explanation while honouring progressive disclosure when declared", () => {
  const text = expositorySibling.resolveTemplate({
    stepCanonicalStepId: "step_define_learning_outcomes",
    title: "Define Learning Outcomes"
  });
  assert.ok(text.length > 0, "Expository Define Learning Outcomes sibling body should resolve");
  assert.match(text, /Direct explanation is the normal Expository method/i);
  assert.match(text, /do not withhold concepts merely because a question appears/i);
  assert.match(text, /progressive disclosure or discovery before explanation/i);
  assert.match(text, /capabilities rather than the completed resolution/i);
});

test("Design Page remains outside EQF runtime targeting", () => {
  assert.equal(
    eqf.isEducationalQualityFrameworkTargetStep({
      stepCanonicalStepId: "step_design_page",
      stepCanonicalTitle: "Design Page"
    }),
    false
  );
});

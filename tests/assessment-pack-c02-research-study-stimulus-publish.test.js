/**
 * C02 Assessment Pack Design Page failure:
 * elicitation.stimulus authored as a research-study object must normalise to
 * learner-facing prose, preserve figures/limitations, and publish.
 * delivery.prompt as the closed six-string constructed brief remains valid.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const publish = require("../lib/assessment-pack-publish.js");
const canonical = require("../lib/assessment-pack-canonical.js");
const family = require("../lib/first-class-workflow-family.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

const FIXTURE = path.join(__dirname, "..", "tmp-c02-assessment-design-page-fail.json");

function c02Page() {
  return JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
}

test("raw C02 Design Page fails strict validation before normalisation", () => {
  const page = c02Page();
  const stimulus = page.assessment_evidence.elicitations[0].stimulus;
  assert.equal(typeof stimulus, "object");
  assert.ok(canonical.looksLikeResearchStudyStimulus(stimulus));
  const strict = canonical.validateAssessmentPackCanonicalPage(page);
  assert.equal(strict.ok, false);
  assert.ok(
    strict.errors.some(function (error) {
      return (
        error.path === "elicitations[0].stimulus" &&
        /object without text, body, statement, stem, or assumption/i.test(error.message)
      );
    }),
    JSON.stringify(strict.errors)
  );
});

test("C02 research-study elicitation.stimulus normalises and publishes with findings preserved", () => {
  const page = c02Page();
  const promptRead = canonical.readConstructedLearnerPrompt(
    page.assessment_evidence.elicitations[0].delivery.prompt
  );
  assert.equal(promptRead.ok, true, "six-key constructed prompt must remain valid");
  assert.match(promptRead.task, /Write your own short explanation/);

  const prepared = canonical.normalizeAssessmentPackCanonicalPage(page);
  assert.ok(
    prepared.normalizations.some(function (note) {
      return note.action === "research_study_stimulus_to_prose";
    }),
    JSON.stringify(prepared.normalizations)
  );
  assert.equal(typeof prepared.page.assessment_evidence.elicitations[0].stimulus, "string");
  assert.match(
    prepared.page.assessment_evidence.elicitations[0].stimulus,
    /Study breaks and concentration among undergraduate students/
  );
  assert.match(prepared.page.assessment_evidence.elicitations[0].stimulus, /72%/);
  assert.match(prepared.page.assessment_evidence.elicitations[0].stimulus, /58%/);
  assert.match(prepared.page.assessment_evidence.elicitations[0].stimulus, /14 percentage points/);
  assert.match(prepared.page.assessment_evidence.elicitations[0].stimulus, /observational/);
  assert.match(prepared.page.assessment_evidence.elicitations[0].stimulus, /Evidence boundary:/);

  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published && published.message);
  assert.equal(published.source, "canonical");
  assert.equal(typeof published.page.assessment_evidence.elicitations[0].stimulus, "string");

  const elicitation = published.page.assessment_evidence.elicitations[0];
  assert.equal(elicitation.elicitation_id, "E1");
  assert.equal(elicitation.delivery.kind, "constructed_performance");
  assert.equal(elicitation.epistemic_class, "non_determinate");
  assert.match(String(elicitation.artefact_contribution && elicitation.artefact_contribution.artefact_id), /C02\.E1/);

  const rendered = renderLearnerPageHtml(published.page, { compositionMode: "beats" });
  assert.equal(rendered.error, null, rendered.error);
  const html = rendered.html;
  assert.match(html, /data-region="assessment-stimulus"/);
  assert.match(html, /Study breaks and concentration among undergraduate students/);
  assert.match(html, /72%/);
  assert.match(html, /58%/);
  assert.match(html, /14 percentage points/);
  assert.match(html, /Methodological limitations/);
  assert.match(html, /does not establish a causal effect/);
  assert.match(html, /data-workspace-kind="text_entry"/);
  assert.doesNotMatch(html, /data-assessment-check="true"/);
  assert.doesNotMatch(html, /data-auto-checkable="true"/);
});

test("elicitation/design prompts forbid structured research-study stimulus objects", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus:
      "Learners write an independent first explanation of a fictional research finding and retain it as C02.E1.",
    startingPoint: "topic"
  });
  assert.equal(built.ok, true);
  const elicitation = built.steps.find(function (step) {
    return /Elicitation/i.test(step.title);
  });
  const design = built.steps.find(function (step) {
    return /Design Page/i.test(step.title);
  });
  assert.match(
    elicitation.promptBody,
    /Do not emit elicitation\.stimulus as a structured object with keys such as research_question/
  );
  assert.match(elicitation.promptBody, /one continuous learner-facing prose string/);
  assert.match(design.promptBody, /research_question\/method\/findings object/);
});

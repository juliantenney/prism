/**
 * Regression: generated retain/copy output_specification used educational
 * affordance fields (output_id, reviewable, editable, …) instead of the closed
 * Assessment Pack publisher contract. Publish must normalize that known shape
 * without weakening schema validation, then assemble through the real path.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const canonical = require("../lib/assessment-pack-canonical.js");
const publish = require("../lib/assessment-pack-publish.js");
const family = require("../lib/first-class-workflow-family.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

const FIXTURE = path.join(__dirname, "fixtures", "assessment-pack-legacy-retain-first-explanation.json");

function failingPage() {
  return JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
}

function authoritativeSpec() {
  return {
    specification_id: "evidence-record",
    artefact_title: "Evidence record",
    audience: "A reviewer",
    purpose: "Record what the learner selected and wrote.",
    action_label: "Assemble evidence record",
    missing_response_text: "Not yet answered.",
    sections: [
      {
        section_id: "writing",
        order: 1,
        heading: "Written judgement",
        contributions: [
          {
            contribution_id: "judgement-text",
            label: "Judgement",
            elicitation_id: "initial_explanation",
            response_part: "response_text"
          }
        ]
      }
    ]
  };
}

test("legacy retain output_specification fails closed validation before normalize", () => {
  const page = failingPage();
  const validated = canonical.validateAssessmentPackCanonicalPage(page);
  assert.equal(validated.ok, false);
  const codes = validated.errors.map(function (error) {
    return error.code;
  });
  assert.ok(codes.indexOf("output_unsupported_key") !== -1);
  assert.ok(codes.indexOf("output_specification_field_required") !== -1);
  assert.ok(codes.indexOf("output_specification_sections_required") !== -1);
});

test("publish path normalizes the failing retain shape and assembles unchanged input JSON", () => {
  const page = failingPage();
  const rawSpec = page.assessment_evidence.output_specification;
  assert.equal(rawSpec.output_id, "initial_explanation_text");
  assert.equal(rawSpec.specification_id, undefined);
  assert.equal(rawSpec.sections, undefined);

  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published && published.message);
  assert.equal(published.source, "canonical");
  assert.ok(
    (published.normalizations || []).some(function (note) {
      return note.action === "normalized_legacy_retain_output_specification";
    })
  );

  const spec = published.page.assessment_evidence.output_specification;
  assert.equal(spec.specification_id, "initial_explanation_text");
  assert.equal(spec.artefact_title, "Your first explanation");
  assert.equal(spec.audience, "You, for later revision and comparison");
  assert.equal(spec.action_label, "Copy my first explanation");
  assert.equal(spec.missing_response_text, "Not yet written.");
  assert.equal(spec.output_id, undefined);
  assert.equal(spec.reviewable, undefined);
  assert.equal(spec.editable, undefined);
  assert.equal(spec.copyable, undefined);
  assert.equal(spec.source_elicitation_ids, undefined);
  assert.equal(Array.isArray(spec.sections), true);
  assert.equal(spec.sections.length, 1);
  assert.equal(spec.sections[0].contributions.length, 1);
  assert.equal(spec.sections[0].contributions[0].elicitation_id, "initial_explanation");
  assert.equal(spec.sections[0].contributions[0].response_part, "response_text");

  const revalidated = canonical.validateAssessmentPackCanonicalPage(published.page);
  assert.equal(revalidated.ok, true, JSON.stringify(revalidated.errors));

  const rendered = renderLearnerPageHtml(published.page, { compositionMode: "beats" });
  assert.equal(rendered.error, null, rendered.error);
  assert.match(rendered.html, /data-assessment-output-mode="direct_copy"/);
  assert.match(rendered.html, /data-assessment-output-copy="true"/);
  assert.match(rendered.html, /Copy my first explanation/);
  assert.match(rendered.html, /Later activities will not retrieve it automatically/);
  assert.equal(rendered.html.indexOf('data-assessment-assemble="true"'), -1);
  assert.equal(rendered.html.indexOf("Replace with current responses"), -1);
  assert.equal(rendered.html.indexOf("Summarise this assessment"), -1);
});

test("authoritative output_specification still publishes without legacy normalization", () => {
  const page = failingPage();
  page.assessment_evidence.output_specification = authoritativeSpec();
  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published && published.message);
  assert.equal(
    (published.normalizations || []).some(function (note) {
      return note.action === "normalized_legacy_retain_output_specification";
    }),
    false
  );
  assert.equal(published.page.assessment_evidence.output_specification.specification_id, "evidence-record");
  assert.equal(published.page.assessment_evidence.output_specification.artefact_title, "Evidence record");
});

test("Design Page retain/explanation commission emits closed output_specification fields only", () => {
  const focus = [
    "Learning Journey Assessment Pack commission for Your first explanation.",
    "Learners must write an independent first explanation of a fictional research finding",
    "and retain that explanation for later revision and comparison.",
    "Do not automatically grade unrestricted writing."
  ].join(" ");
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: focus,
    startingPoint: "topic"
  });
  assert.equal(built.ok, true);
  const design = built.steps[6];
  assert.match(design.promptBody, /Emit assessment_evidence\.output_specification/);
  assert.match(design.promptBody, /specification_id, artefact_title, audience, purpose, action_label, missing_response_text, sections/);
  assert.match(design.promptBody, /Do not emit output_id, title, source_elicitation_ids/);
  assert.match(design.promptBody, /Do not place elicitation_id or response_part on the section object itself/);
  assert.match(design.promptBody, /You, for later revision and comparison/);
  assert.equal(design.promptBody.indexOf("journey-commissioning-brief"), -1);
});

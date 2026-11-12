/**
 * C04 Diagnose your explanation: Design Page emitted section shorthand
 * { heading, elicitation_id, response_part } instead of canonical
 * { section_id, order, heading, contributions }. Publish-time normalisation
 * must convert that unambiguous mapping; generation guidance must forbid it.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const canonical = require("../lib/assessment-pack-canonical.js");
const publish = require("../lib/assessment-pack-publish.js");
const family = require("../lib/first-class-workflow-family.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

const C04_FIXTURE = path.join(
  __dirname,
  "fixtures",
  "assessment-pack-c04-section-elicitation-shorthand.json"
);
const LEGACY_THREE = path.join(
  __dirname,
  "fixtures",
  "assessment-pack-legacy-section-mapped-output-spec.json"
);

function c04Page() {
  return JSON.parse(fs.readFileSync(C04_FIXTURE, "utf8"));
}

test("C04 shorthand fails closed validation before normalize", () => {
  const page = c04Page();
  const section = page.assessment_evidence.output_specification.sections[0];
  assert.equal(section.heading, "My diagnosis");
  assert.equal(section.elicitation_id, "E1");
  assert.equal(section.response_part, "response_text");
  assert.equal(section.section_id, undefined);
  assert.equal(section.contributions, undefined);

  const validated = canonical.validateAssessmentPackCanonicalPage(page);
  assert.equal(validated.ok, false);
  const codes = validated.errors.map(function (error) {
    return error.code;
  });
  assert.ok(codes.indexOf("output_unsupported_key") !== -1);
  assert.ok(codes.indexOf("output_section_field_required") !== -1);
  assert.ok(codes.indexOf("output_section_contributions_required") !== -1);
});

test("publish normalizes C04 section elicitation shorthand and preserves E1", () => {
  const page = c04Page();
  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published && published.message);
  assert.equal(published.source, "canonical");
  assert.ok(
    (published.normalizations || []).some(function (note) {
      return (
        note.action === "normalized_legacy_retain_output_specification" &&
        note.section_count === 1 &&
        Array.isArray(note.source_elicitation_ids) &&
        note.source_elicitation_ids[0] === "E1"
      );
    }),
    JSON.stringify(published.normalizations)
  );

  const spec = published.page.assessment_evidence.output_specification;
  assert.equal(spec.specification_id, "C04.E1");
  assert.equal(spec.artefact_title, "My explanation diagnosis");
  assert.equal(spec.sections.length, 1);
  assert.equal(spec.sections[0].section_id, "C04.E1-E1");
  assert.equal(spec.sections[0].order, 1);
  assert.equal(spec.sections[0].heading, "My diagnosis");
  assert.equal(spec.sections[0].contributions.length, 1);
  assert.equal(spec.sections[0].contributions[0].elicitation_id, "E1");
  assert.equal(spec.sections[0].contributions[0].response_part, "response_text");
  assert.equal(spec.sections[0].elicitation_id, undefined);
  assert.equal(spec.sections[0].response_part, undefined);

  const elicitations = published.page.assessment_evidence.elicitations;
  assert.equal(elicitations.length, 1);
  assert.equal(elicitations[0].elicitation_id, "E1");
  assert.equal(elicitations[0].delivery.kind, "constructed_performance");
  assert.equal(elicitations[0].journalable_artefact_id, "C04.E1");

  const revalidated = canonical.validateAssessmentPackCanonicalPage(published.page);
  assert.equal(revalidated.ok, true, JSON.stringify(revalidated.errors));

  const rendered = renderLearnerPageHtml(published.page, { compositionMode: "beats" });
  assert.equal(rendered.error, null, rendered.error);
  assert.match(rendered.html, /My diagnosis|My explanation diagnosis/);
  assert.match(rendered.html, /data-assessment-output-mode="assemble"/);
  const encoded = rendered.html.match(/data-assessment-output-spec="([^"]+)"/);
  assert.ok(encoded, "output specification embedded for assembly");
  const embedded = JSON.parse(
    encoded[1]
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/\\u003c/g, "<")
  );
  assert.equal(embedded.sections[0].contributions[0].elicitation_id, "E1");
  assert.equal(embedded.sections[0].contributions[0].response_part, "response_text");
});

test("ambiguous conflicting section elicitation ids still fail closed", () => {
  const page = c04Page();
  page.assessment_evidence.output_specification.sections[0].source_elicitation_id = "OTHER";
  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, false);
  assert.equal(published.code, "assessment_evidence_invalid");
});

test("unresolvable section elicitation_id still fails closed", () => {
  const page = c04Page();
  page.assessment_evidence.output_specification.sections[0].elicitation_id = "MISSING";
  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, false);
  assert.equal(published.code, "assessment_evidence_invalid");
});

test("existing title/source_elicitation_id legacy section mapping still publishes", () => {
  const page = JSON.parse(fs.readFileSync(LEGACY_THREE, "utf8"));
  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published && published.message);
  assert.equal(published.page.assessment_evidence.output_specification.sections.length, 3);
});

test("Design Page guidance forbids section-level elicitation shorthand", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: [
      "Learners must write an independent diagnostic self-evaluation of their explanation",
      "and retain that diagnosis for later revision and comparison.",
      "Do not automatically grade unrestricted writing."
    ].join(" "),
    startingPoint: "topic"
  });
  assert.equal(built.ok, true);
  const design = built.steps.find(function (step) {
    return /design page/i.test(String((step && step.title) || ""));
  });
  assert.ok(design, "Design Page step present");
  assert.match(design.promptBody, /Each section has section_id, order as a unique number, heading, and contributions/);
  assert.match(
    design.promptBody,
    /Do not place elicitation_id or response_part on the section object itself/
  );
  assert.match(design.promptBody, /Do not emit shorthand section rows/);
  assert.match(design.promptBody, /Do not collapse the contribution into the section row/);
});

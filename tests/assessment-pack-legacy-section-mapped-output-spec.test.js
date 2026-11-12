/**
 * Regression: multi-section retain/copy output_specification used legacy
 * section rows { title, source_elicitation_id, response_part } instead of
 * canonical { section_id, order, heading, contributions }. Publish-time
 * normalisation must convert unambiguous mappings without weakening schema
 * validation, preserving the earlier single-section C1 retain fix.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const canonical = require("../lib/assessment-pack-canonical.js");
const publish = require("../lib/assessment-pack-publish.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

const SECTION_FIXTURE = path.join(
  __dirname,
  "fixtures",
  "assessment-pack-legacy-section-mapped-output-spec.json"
);
const C1_FIXTURE = path.join(
  __dirname,
  "fixtures",
  "assessment-pack-legacy-retain-first-explanation.json"
);

function failingSectionMappedPage() {
  return JSON.parse(fs.readFileSync(SECTION_FIXTURE, "utf8"));
}

test("legacy three-section output_specification fails closed validation before normalize", () => {
  const page = failingSectionMappedPage();
  const validated = canonical.validateAssessmentPackCanonicalPage(page);
  assert.equal(validated.ok, false);
  const codes = validated.errors.map(function (error) {
    return error.code;
  });
  assert.ok(codes.indexOf("output_unsupported_key") !== -1);
  assert.ok(codes.indexOf("output_section_field_required") !== -1);
  assert.ok(
    validated.errors.some(function (error) {
      return /sections\[0\]\.(title|section_id|heading|contributions)/.test(String(error.path || ""));
    }),
    JSON.stringify(validated.errors)
  );
});

test("publish path normalizes legacy three-section retain shape and assembles unchanged input JSON", () => {
  const page = failingSectionMappedPage();
  const rawSections = page.assessment_evidence.output_specification.sections;
  assert.equal(rawSections.length, 3);
  assert.equal(rawSections[0].title, "Prioritised improvements");
  assert.equal(rawSections[0].source_elicitation_id, "E1");
  assert.equal(rawSections[0].section_id, undefined);
  assert.equal(rawSections[0].contributions, undefined);
  assert.equal(rawSections[1].source_elicitation_id, "E3");
  assert.equal(rawSections[2].source_elicitation_id, "E4");

  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published && published.message);
  assert.equal(published.source, "canonical");
  assert.ok(
    (published.normalizations || []).some(function (note) {
      return (
        note.action === "normalized_legacy_retain_output_specification" &&
        note.section_count === 3
      );
    }),
    JSON.stringify(published.normalizations)
  );

  const spec = published.page.assessment_evidence.output_specification;
  assert.equal(spec.specification_id, "revision_record");
  assert.equal(spec.artefact_title, "Revision record");
  assert.equal(spec.sections.length, 3);
  assert.equal(spec.sections[0].section_id, "revision_record-E1");
  assert.equal(spec.sections[0].order, 1);
  assert.equal(spec.sections[0].heading, "Prioritised improvements");
  assert.equal(spec.sections[0].contributions.length, 1);
  assert.equal(spec.sections[0].contributions[0].elicitation_id, "E1");
  assert.equal(spec.sections[0].contributions[0].response_part, "response_text");
  assert.equal(spec.sections[1].heading, "Revised explanation");
  assert.equal(spec.sections[1].contributions[0].elicitation_id, "E3");
  assert.equal(spec.sections[2].heading, "Reasons for significant changes");
  assert.equal(spec.sections[2].contributions[0].elicitation_id, "E4");
  assert.equal(spec.sections[0].title, undefined);
  assert.equal(spec.sections[0].source_elicitation_id, undefined);

  const revalidated = canonical.validateAssessmentPackCanonicalPage(published.page);
  assert.equal(revalidated.ok, true, JSON.stringify(revalidated.errors));

  const rendered = renderLearnerPageHtml(published.page, { compositionMode: "beats" });
  assert.equal(rendered.error, null, rendered.error);
  assert.match(rendered.html, /Prioritised improvements/);
  assert.match(rendered.html, /Revised explanation/);
  assert.match(rendered.html, /Reasons for significant changes/);
  assert.match(rendered.html, /Copy my revision record|data-assessment-output-copy/);
  assert.match(rendered.html, /data-assessment-output-mode="assemble"/);
  const encoded = rendered.html.match(/data-assessment-output-spec="([^"]+)"/);
  assert.ok(encoded, "output specification is embedded for assembly");
  const embedded = JSON.parse(
    encoded[1]
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/\\u003c/g, "<")
  );
  assert.equal(embedded.sections.length, 3);
  assert.deepEqual(
    embedded.sections.map(function (section) {
      return section.contributions[0].elicitation_id;
    }),
    ["E1", "E3", "E4"]
  );
  assert.deepEqual(
    embedded.sections.map(function (section) {
      return section.heading;
    }),
    ["Prioritised improvements", "Revised explanation", "Reasons for significant changes"]
  );
});

test("unresolvable legacy section source elicitation id is left unchanged and still fails closed", () => {
  const page = failingSectionMappedPage();
  page.assessment_evidence.output_specification.sections[1].source_elicitation_id = "MISSING";
  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, false);
  assert.equal(published.code, "assessment_evidence_invalid");
  assert.equal(
    page.assessment_evidence.output_specification.sections[1].source_elicitation_id,
    "MISSING"
  );
});

test("earlier C1 single-section retain normalization still publishes", () => {
  const page = JSON.parse(fs.readFileSync(C1_FIXTURE, "utf8"));
  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published && published.message);
  assert.ok(
    (published.normalizations || []).some(function (note) {
      return note.action === "normalized_legacy_retain_output_specification";
    })
  );
  const spec = published.page.assessment_evidence.output_specification;
  assert.equal(spec.sections.length, 1);
  assert.equal(spec.sections[0].contributions[0].elicitation_id, "initial_explanation");
});

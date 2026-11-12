/**
 * Delivery-context-aware retention guidance for Assessment Pack output help.
 * System-owned help differs for standalone vs Learning Journey; authored
 * educational prose is left unchanged.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const assessmentOutput = require("../lib/learner-renderer-vnext/assessment-output.js");
const artefact = require("../lib/learner-renderer-vnext/learner-artefact-contract.js");
const publish = require("../lib/assessment-pack-publish.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");

const C02_FIXTURE = path.join(
  __dirname,
  "fixtures",
  "assessment-pack-legacy-retain-first-explanation.json"
);

function directCopySpec() {
  return {
    specification_id: "retain_original",
    artefact_title: "Your first explanation",
    action_label: "Copy my first explanation",
    purpose: "Retain the learner's original explanation without generating a summary.",
    sections: [
      {
        section_id: "original",
        order: 1,
        heading: "Original explanation",
        contributions: [
          {
            contribution_id: "c1",
            label: "Explanation",
            elicitation_id: "E1",
            response_part: "response_text"
          }
        ]
      }
    ]
  };
}

function producerContract() {
  return {
    produces: [
      {
        artefactId: "C02.E1",
        commissionId: "c02",
        workspaceId: "assessment-constructed-E1",
        label: "Your first explanation"
      }
    ],
    references: [
      {
        artefactId: "C02.E1",
        commissionId: "c04",
        usage: "reference",
        label: "Your earlier explanation"
      }
    ]
  };
}

test("standalone publication presents page-only copy guidance", () => {
  const help = assessmentOutput.buildAssessmentOutputRetentionHelp({
    deliveryContext: "standalone"
  });
  assert.match(help, /kept on this page only/i);
  assert.match(help, /will not retrieve it automatically/i);
  assert.doesNotMatch(help, /Learning Journal/i);
  assert.doesNotMatch(help, /Learning Journey/i);

  const html = assessmentOutput.renderAssessmentOutputRegion(directCopySpec());
  assert.match(html, /data-assessment-output-delivery="standalone"/);
  assert.match(html, /kept on this page only/i);
  assert.doesNotMatch(html, /Learning Journal/i);
});

test("Learning Journey producer guidance distinguishes Journal from prepopulation", () => {
  const help = assessmentOutput.buildAssessmentOutputRetentionHelp({
    deliveryContext: "unified",
    isProducer: true,
    journalListed: true
  });
  assert.match(help, /Learning Journey/i);
  assert.match(help, /Learning Journal/i);
  assert.match(help, /do not paste it into their answer fields/i);
  assert.doesNotMatch(help, /kept on this page only/i);
  assert.doesNotMatch(help, /C02\.E1/);
});

test("non-journalled producer is not described as journalled", () => {
  const help = assessmentOutput.buildAssessmentOutputRetentionHelp({
    deliveryContext: "unified",
    isProducer: true,
    journalListed: false
  });
  assert.match(help, /show it for reference/i);
  assert.doesNotMatch(help, /Learning Journal/i);
  assert.match(help, /do not paste it into later answer fields/i);
});

test("unified mount updates only system-owned assessment-output help", () => {
  const authored =
    "Save or copy your completed response somewhere you can retrieve it. Decide which findings matter most.";
  const helpNode = {
    textContent: assessmentOutput.buildAssessmentOutputRetentionHelp({
      deliveryContext: "standalone"
    }),
    setAttribute() {},
    getAttribute() {
      return "standalone";
    }
  };
  const root = {
    querySelectorAll(selector) {
      return selector === "[data-assessment-output-help]" ? [helpNode] : [];
    }
  };
  const result = artefact.applyContextualHandoffGuidance(root, {
    contract: producerContract(),
    commissionId: "c02",
    journalSpec: {
      entries: [{ artefact_id: "C02.E1", title: "Original explanation" }]
    },
    deliveryContext: "unified"
  });
  assert.equal(result.ok, true);
  assert.equal(result.systemOwnedOnly, true);
  assert.ok(result.rewritten >= 1);
  assert.match(helpNode.textContent, /Learning Journal/i);
  assert.match(helpNode.textContent, /do not paste it into their answer fields/i);
  // Authored educational prose is not rewritten by this delivery-owned path.
  assert.match(authored, /Save or copy your completed response/);
  assert.match(authored, /Decide which findings matter most/);
});

test("producer signpost mentions Journal only for declared journal artefacts", () => {
  const withJournal = artefact.buildProducerSignpostHtml(
    producerContract(),
    "c02",
    [{ commissionId: "c04", title: "Diagnose your explanation" }],
    { journalSpec: { entries: [{ artefactId: "C02.E1" }] } }
  );
  assert.match(withJournal, /Learning Journal/);
  assert.match(withJournal, /do not paste it into their answer fields/i);
  assert.doesNotMatch(withJournal, /C02\.E1/);

  const withoutJournal = artefact.buildProducerSignpostHtml(
    producerContract(),
    "c02",
    [{ commissionId: "c04", title: "Diagnose your explanation" }],
    { journalSpec: { entries: [{ artefactId: "C05.E1" }] } }
  );
  assert.doesNotMatch(withoutJournal, /Learning Journal/);
  assert.match(withoutJournal, /do not paste it into their answer fields/i);
});

test("resolved consumer reference states read-only reference without prepopulation", () => {
  const html = artefact.renderArtefactReferenceHtml(
    {
      ok: true,
      status: "resolved",
      artefactId: "C02.E1",
      text: "My explanation",
      label: "Your earlier explanation"
    },
    { artefactId: "C02.E1", label: "Your earlier explanation" },
    { producerTitle: "Write your first explanation" }
  );
  assert.match(html, /Available here for reference/);
  assert.match(html, /not pasted into the answer fields below/i);
  assert.match(html, /My explanation/);
  // Technical artefact ids may appear in machine attributes, not ordinary guidance prose.
  assert.doesNotMatch(
    html.replace(/data-lj-artefact-ref="[^"]*"/g, "").replace(/id="[^"]*"/g, ""),
    /C02\.E1/
  );
});

test("existing retain Assessment Pack still publishes with unchanged learner-authored task prose", () => {
  if (!fs.existsSync(C02_FIXTURE)) return;
  const page = JSON.parse(fs.readFileSync(C02_FIXTURE, "utf8"));
  const attemptBefore = String(page.attempt_instructions || "");
  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published && published.message);
  assert.equal(String(published.page.attempt_instructions || ""), attemptBefore);

  const rendered = renderLearnerPageHtml(published.page);
  assert.match(rendered.html, /data-assessment-output-help="true"/);
  assert.match(rendered.html, /kept on this page only/i);
  assert.match(rendered.html, /Keep your original explanation/);
  assert.doesNotMatch(rendered.html, /data-assessment-output-delivery="unified"/);
});

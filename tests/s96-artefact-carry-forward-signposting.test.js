/**
 * Unified Learning Journey — learner-facing artefact carry-forward signposting.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const artefact = require("../lib/learner-renderer-vnext/learner-artefact-contract.js");
const { renderAssessmentOutputRegion } = require("../lib/learner-renderer-vnext/assessment-output.js");

function lj2Contract() {
  return {
    produces: [
      {
        artefactId: "c1.E1",
        commissionId: "c1",
        workspaceId: "assessment-constructed-E1",
        label: "Original explanation"
      },
      {
        artefactId: "c5.E1",
        commissionId: "c5",
        workspaceId: "assessment-constructed-E1",
        label: "Revised explanation"
      }
    ],
    references: [
      {
        artefactId: "c1.E1",
        commissionId: "c5",
        usage: "reference",
        label: "Your earlier response"
      },
      {
        artefactId: "c1.E1",
        commissionId: "c6",
        usage: "reference",
        label: "Your earlier response"
      },
      {
        artefactId: "c5.E1",
        commissionId: "c6",
        usage: "reference",
        label: "Your earlier response"
      }
    ]
  };
}

function lj2Resources() {
  return [
    { commissionId: "c1", title: "Your first explanation", pageKey: "page-c1" },
    { commissionId: "c2", title: "Understanding what the evidence warrants", pageKey: "page-c2" },
    { commissionId: "c5", title: "Reconsider, revise and improve", pageKey: "page-c5" },
    {
      commissionId: "c6",
      title: "The feedback that changed the work",
      pageKey: "page-c6"
    }
  ];
}

test("C1 producer signpost names C5 and C6 resource titles", () => {
  const html = artefact.buildProducerSignpostHtml(lj2Contract(), "c1", lj2Resources());
  assert.match(html, /data-lj-artefact-signpost="producer"/);
  assert.match(html, /Reconsider, revise and improve/);
  assert.match(html, /The feedback that changed the work/);
  assert.match(html, /save your draft in this Learning Journey/i);
  assert.match(html, /on this device/i);
  assert.doesNotMatch(html, /\bc1\b|\bc5\b|\bc6\b|workspace|localStorage|artefactId/i);
});

test("C5 producer signpost names C6 and consumer reference identifies C1", () => {
  const producer = artefact.buildProducerSignpostHtml(lj2Contract(), "c5", lj2Resources());
  assert.match(producer, /The feedback that changed the work/);
  assert.doesNotMatch(producer, /Your first explanation/);

  const consumer = artefact.renderArtefactReferenceHtml(
    {
      ok: true,
      status: "resolved",
      artefactId: "c1.E1",
      text: "My first draft explanation.",
      label: "Original explanation"
    },
    { artefactId: "c1.E1", label: "Your earlier response" },
    {
      producerTitle: "Your first explanation",
      produceLabel: "Original explanation"
    }
  );
  assert.match(consumer, /Original explanation/);
  assert.match(consumer, /From 'Your first explanation'/);
  assert.match(consumer, /saved it earlier in this Learning Journey/);
  assert.match(consumer, /My first draft explanation/);
  assert.doesNotMatch(consumer.replace(/data-lj-artefact-ref="[^"]*"/g, ""), /c1\.E1|commissionId|localStorage|workspaceId/i);
});

test("C6 consumer references identify the earlier resources they actually use", () => {
  const fromC1 = artefact.renderArtefactReferenceHtml(
    { ok: false, status: "missing", artefactId: "c1.E1", text: "", label: "Original explanation" },
    { artefactId: "c1.E1" },
    {
      producerTitle: "Your first explanation",
      produceLabel: "Original explanation"
    }
  );
  const fromC5 = artefact.renderArtefactReferenceHtml(
    {
      ok: true,
      status: "resolved",
      artefactId: "c5.E1",
      text: "Revised draft.",
      label: "Revised explanation"
    },
    { artefactId: "c5.E1" },
    {
      producerTitle: "Reconsider, revise and improve",
      produceLabel: "Revised explanation"
    }
  );
  assert.match(fromC1, /Your first explanation/);
  assert.match(fromC1, /save your draft in this Learning Journey/);
  assert.match(fromC5, /Reconsider, revise and improve/);
  assert.match(fromC5, /Revised explanation/);
  assert.match(fromC5, /Revised draft/);
});

test("resources with no artefact relationship receive no producer signpost", () => {
  const html = artefact.buildProducerSignpostHtml(lj2Contract(), "c2", lj2Resources());
  assert.equal(html, "");
});

test("unified rewrite replaces standalone page-only retrieval claim for producers", () => {
  const raw =
    "A draft of your response is kept on this page only. Later activities will not retrieve it automatically — copy the wording you want to keep for later use.";
  const out = artefact.rewriteHandoffMechanicsText(raw, {
    isProducer: true,
    resolutions: []
  });
  assert.doesNotMatch(out, /Later activities will not retrieve/i);
  assert.doesNotMatch(out, /kept on this page only/i);
  assert.match(out, /kept on this device when you save it/i);
  assert.match(out, /Learning Journey/i);
});

test("standalone assessment-output help remains page-only / copy guidance", () => {
  const html = renderAssessmentOutputRegion({
    specification_id: "retain_original",
    artefact_title: "Your first explanation",
    action_label: "Copy my first explanation",
    purpose: "Retain the learner's original explanation without generating a summary.",
    sections: [
      {
        section_id: "original",
        title: "Original explanation",
        contributions: [
          {
            elicitation_id: "E1",
            response_part: "response_text"
          }
        ]
      }
    ]
  });
  assert.match(html, /Later activities will not retrieve it automatically/);
  assert.match(html, /kept on this page only/);
});

test("journeys without relationships still skip contextual rewrite", () => {
  const result = artefact.applyContextualHandoffGuidance(
    {
      querySelector() {
        return null;
      }
    },
    {
      contract: { produces: [], references: [] },
      commissionId: "c2",
      deliveryContext: "unified",
      resolutions: []
    }
  );
  assert.equal(result.skipped, "no-artefact-relationship");
});

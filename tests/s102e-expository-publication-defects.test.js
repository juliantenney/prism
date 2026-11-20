/**
 * Sprint 102E — Expository publication defects:
 * 1) structured-material journal/response metadata must not publish as learner headings
 * 2) figure detailed_description must not publish layout-commission / production instructions
 * 3) Expository can host journalable text via shared learner_artefacts (not Interactive activities)
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");
const structured = require("../lib/learner-renderer-vnext/expository-structured-materials.js");
const renderAffordance = require("../lib/learner-renderer-vnext/render-visual-affordance.js");
const figureContract = require("../lib/learner-figure-description-contract.js");
const assemble = require("../lib/page-vnext-assemble.js");
const sibling = require("../lib/expository-sibling-prompts.js");

const METADATA_LABELS = [
  "Response id",
  "Response type",
  "Producer",
  "Stable identifier",
  "Elicitation id",
  "Artefact id",
  "Workspace id"
];

function pageWithMaterial(body) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "expository",
    page_kind: "expository",
    title: "Commission-native reading",
    activities: [],
    sections: [
      {
        section_id: "S8",
        title: "Carry forward",
        exposition: "Close by capturing one durable insight.",
        materials: [
          {
            material_id: "XM-S8-01",
            kind: "reflection",
            title: "Learning Journal response",
            body: body
          }
        ]
      }
    ],
    page_synthesis: {},
    assembly_state: {
      current_stage: "expository_materials",
      enriched_by: [
        "expository_journey_plan",
        "expository_development",
        "expository_materials"
      ]
    }
  };
}

function visible(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

test("response-contract metadata keys are schema mechanics", () => {
  assert.equal(structured.isSchemaMechanicKey("response_id"), true);
  assert.equal(structured.isSchemaMechanicKey("response_type"), true);
  assert.equal(structured.isSchemaMechanicKey("producer"), true);
  assert.equal(structured.isSchemaMechanicKey("stable_identifier"), true);
  assert.equal(structured.isSchemaMechanicKey("elicitation_id"), true);
  assert.equal(structured.isUnlabeledProseKey("prompt"), true);
  assert.equal(structured.isSchemaMechanicKey("constraint_function"), false);
});

test("S8 response-contract object does not publish Response id / Producer chrome", () => {
  const page = pageWithMaterial({
    response_id: "E1",
    response_type: "constructed_text",
    producer: "c1",
    stable_identifier: "c1.E1",
    prompt: "Record one insight you will carry into later practice."
  });
  const rendered = renderLearnerPageHtml(page);
  const text = visible(rendered.html);
  METADATA_LABELS.forEach(function (label) {
    assert.doesNotMatch(
      rendered.html,
      new RegExp(
        "<(?:strong|h4|dt|th)[^>]*>\\s*" +
          label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
          "\\s*</",
        "i"
      ),
      "leaked metadata heading: " + label
    );
    assert.doesNotMatch(text, new RegExp("\\b" + label + "\\b", "i"));
  });
  assert.match(text, /Record one insight you will carry into later practice/);
  assert.doesNotMatch(text, /\bc1\.E1\b/);
});

test("layout-commission detailed_description is treated as production prose", () => {
  const production =
    "Arrange three substantial nodes left to right for the feedback stages, with clear connectors.";
  assert.equal(renderAffordance.isGraphicsProductionProse(production), true);
  assert.equal(figureContract.looksLikeProductionPrompt(production), true);
  assert.equal(
    renderAffordance.isGraphicsProductionProse(
      "A closed process loop links ordered section moves into one integrative cycle."
    ),
    false
  );
});

test("figure accessible description omits Arrange-three-nodes production instructions", () => {
  const tinyPng =
    "data:image/png;base64," +
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const parts = renderAffordance.resolveFigureCaptionParts(
    {
      caption_intent: "",
      detailed_description:
        "Arrange three substantial nodes left to right labelled Sensing, Judging and Acting, connected by arrows."
    },
    1
  );
  assert.equal(parts.detailedBody, "");
  assert.doesNotMatch(parts.body || "", /Arrange three substantial nodes/i);

  const html = renderAffordance.renderVisualAffordanceFigure(
    {
      asset_id: "asset-s1-fig",
      affordance_id: "va-S1-fig-01",
      caption_intent: "",
      alt_text: "Three-stage feedback loop; detailed description follows.",
      detailed_description:
        "Arrange three substantial nodes left to right labelled Sensing, Judging and Acting, connected by arrows.",
      render_source: { kind: "data_url", value: tinyPng }
    },
    { slot: "section-after-content", subject: "Feedback stages", affordanceId: "va-S1-fig-01" },
    { figureCounter: { value: 0 } }
  );
  assert.match(html, /Figure 1/);
  assert.doesNotMatch(html, /Arrange three substantial nodes/i);
  assert.doesNotMatch(html, /util-visual-asset-detailed-description/);
});

test("Expository Design Page owns and retains learner_artefacts", () => {
  assert.ok(
    assemble.EXPOSITORY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.includes("learner_artefacts")
  );
  const contracts = require("../lib/expository-contracts.js");
  const ejp = contracts.normalizeExpositoryJourneyPlan({
    title: "Shell",
    audience: "learners",
    journey_intent: "Carry insight forward.",
    commissioned_purpose: "explain a durable insight",
    epistemic_form: "consolidation",
    learning_outcomes: [{ id: "LO1", statement: "State one durable insight." }],
    sections: [
      {
        section_id: "S1",
        title: "Opening",
        purpose: "Start",
        knowledge_focus: "insight",
        conceptual_move: "establish"
      }
    ]
  });
  const xd = contracts.normalizeExpositoryDevelopment({
    sections: [
      {
        section_id: "S1",
        explanation_intent: "Open the idea.",
        exposition: "Start here with developed prose."
      }
    ]
  });
  const result = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    design_page: {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Published title",
      page_synthesis: {},
      learner_artefacts: {
        produces: [
          {
            elicitation_id: "E1",
            response_kind: "constructed_text",
            label: "Your insight",
            prompt: "What will you carry forward?"
          }
        ]
      },
      assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
    }
  });
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.page.learner_artefacts.produces[0].elicitation_id, "E1");
  const rendered = renderLearnerPageHtml(result.page);
  assert.match(rendered.html, /data-workspace-kind="text_entry"/);
  assert.match(rendered.html, /data-workspace-id="learner-constructed-E1"/);
});

test("Expository Design Page sibling prompt guides learner_artefacts without Interactive activities", () => {
  const dp = sibling.resolveTemplate("design_page");
  assert.match(dp, /learner_artefacts\.produces/);
  assert.match(dp, /constructed_text/);
  assert.match(dp, /Do not invent Interactive activities/);
  const isolation = sibling.assertNoInteractiveSemantics(dp);
  assert.equal(isolation.ok, true, JSON.stringify(isolation.hits));
});

test("Expository commission injects learner_artefacts producer guidance on Design Page", () => {
  const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
  const { api } = loadPrismAppJsTestApi();
  const wf = {
    id: "wf-expo-artefact",
    product: "expository",
    workflowBriefResolution: {
      initialBrief: {
        product: "expository",
        commissionSpecification: "Author a short Learning Journal response.",
        requiredLearnerArtefacts: [
          {
            elicitationId: "E1",
            artefactId: "c1.E1",
            title: "Learning Journal response"
          }
        ]
      }
    }
  };
  const instruction = api.composeCommissionedLearnerArtefactProducerInstruction(wf);
  assert.match(instruction, /SHARED LEARNER ARTEFACT PRODUCER REQUIREMENT/);
  assert.match(instruction, /learner_artefacts\.produces/);
  assert.match(instruction, /elicitation_id "E1"/);
  assert.doesNotMatch(instruction, /Set response_fulfilment\.artefact_elicitation_id/);
  assert.match(instruction, /Do not invent Interactive activities/);
  assert.equal(
    api.isCommissionLearnerFacingCopyStep(
      { canonical_step_id: "step_design_page", title: "Design Page" },
      wf
    ),
    true
  );
});
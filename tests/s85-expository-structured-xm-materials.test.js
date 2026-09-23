/**
 * Sprint 85 — structured Expository XM bodies must not render as [object Object].
 *
 * Live forms: conceptual_diagram (S2), compact_worked_example (S5), synthesis_diagram (S6).
 * Diagram learner representation is owned by section visual affordances; XM diagram
 * bodies contribute caption/title only. formal_notes stay authoring-only.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const contracts = require("../lib/expository-contracts.js");
const assemble = require("../lib/page-vnext-assemble.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const fixturesDir = path.join(__dirname, "fixtures");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function loadStructuredXmPage() {
  const xmRaw = readJson("s85-expository-live-xm-structured.json");
  const xm = contracts.normalizeExpositoryMaterials(xmRaw);
  const ejp = {
    artifact_type: "expository_journey_plan",
    schema_version: "1.0.0",
    title: "Formative assessment: from evidence to action",
    audience: "University lecturers",
    journey_intent: "Build a practical formative model.",
    commissioned_purpose: "Explain formative assessment as an evidence-to-action loop.",
    epistemic_form: "practical conceptual model",
    sections: [
      {
        section_id: "S2",
        title: "Evidence to action",
        purpose: "Core model",
        knowledge_focus: "loop",
        conceptual_move: "establish mechanism",
        order: 2
      },
      {
        section_id: "S5",
        title: "Peers and self",
        purpose: "Distribute",
        knowledge_focus: "actors",
        conceptual_move: "extend",
        order: 5
      },
      {
        section_id: "S6",
        title: "Designing the loop",
        purpose: "Synthesise",
        knowledge_focus: "integration",
        conceptual_move: "integrate",
        order: 6
      }
    ]
  };
  const xd = {
    artifact_type: "expository_development",
    schema_version: "1.0.0",
    sections: [
      {
        section_id: "S2",
        explanation_intent: "Establish the loop.",
        exposition:
          "Formative assessment can be understood as a recurring relationship among intended learning, evidence, interpretation and action.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: [
          {
            commission_id: "MC-S2-01",
            section_id: "S2",
            kind: "conceptual_diagram",
            intent: "loop figure"
          }
        ]
      },
      {
        section_id: "S5",
        explanation_intent: "Extend actors.",
        exposition:
          "Peers and learners can contribute judgement inside the same four-part loop without inventing new stages.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: [
          {
            commission_id: "MC-S5-01",
            section_id: "S5",
            kind: "compact_worked_example",
            intent: "peer judgement example"
          }
        ]
      },
      {
        section_id: "S6",
        explanation_intent: "Return to the loop.",
        exposition:
          "Returning to the loop, judgement roles may enrich the same structure without a competing framework.",
        invitations_to_think: [],
        continuity_hooks: [],
        materials_commission: [
          {
            commission_id: "MC-S6-01",
            section_id: "S6",
            kind: "synthesis_diagram",
            intent: "integrated loop"
          }
        ]
      }
    ]
  };
  const design_page = Object.assign({}, readJson("s85-expository-dp-raw-paste.json"), {
    artifact_type: "page",
    schema_version: "2.0.0"
  });
  // Keep only S2/S6 VAs from the live DP fixture.
  return assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    expository_materials: xm,
    design_page
  });
}

test("XM normalize preserves structured object bodies (no [object Object] coercion)", () => {
  const xmRaw = readJson("s85-expository-live-xm-structured.json");
  const xm = contracts.normalizeExpositoryMaterials(xmRaw);
  assert.equal(typeof xm.materials[0].body, "object");
  assert.notEqual(xm.materials[0].body, "[object Object]");
  assert.equal(xm.materials[0].body.caption.includes("formative loop"), true);
  assert.equal(Array.isArray(xm.materials[0].body.elements), true);
  assert.equal(typeof xm.materials[1].body, "object");
  assert.equal(xm.materials[1].body.stages.length, 4);
  assert.equal(typeof xm.materials[2].body, "object");
  assert.match(xm.materials[0].formal_notes, /AUTHOR-ONLY S2/);
});

test("structured XM renders without [object Object]; S5 worked example is learner-visible", () => {
  const assembled = loadStructuredXmPage();
  assert.equal(assembled.ok, true);
  assert.equal(typeof assembled.page.sections[0].materials[0].body, "object");

  const model = buildPageModel(assembled.page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const byId = Object.create(null);
  model.model.expositionSections.forEach((s) => {
    byId[s.id] = s;
  });

  assert.equal(byId.S2.materials[0].type, "expository_diagram_caption");
  assert.equal(byId.S5.materials[0].type, "expository_compact_worked_example");
  assert.equal(byId.S6.materials[0].type, "expository_diagram_caption");
  assert.equal(byId.S5.materials[0].stages.length, 4);

  const html = String(renderLearnerPageHtml(assembled.page).html || "");
  assert.doesNotMatch(html, /\[object Object\]/);
  assert.doesNotMatch(html, /AUTHOR-ONLY/);
  assert.doesNotMatch(html, /data-workspace-kind=/);
  assert.doesNotMatch(html, /data-region="activities"/);

  assert.match(html, /Peer judgement inside the same loop/);
  assert.match(html, /students exchange draft abstracts/i);
  assert.match(html, /Intended learning/);
  assert.match(html, /Peer and self contributors enrich judgement/);
  assert.match(html, /data-expository-structured="compact_worked_example"/);

  assert.match(html, /Evidence-to-action formative loop/);
  assert.match(html, /recurring formative loop/);
  assert.match(html, /Integrated formative design loop/);
  assert.match(html, /richer judgement roles/);
  // Full diagram element dumps suppressed (graphic owns representation).
  assert.doesNotMatch(html, /Shapes what evidence is worth eliciting/);
  assert.doesNotMatch(html, /guiding_question/);

  assert.match(html, /data-affordance-id="va-S2-evidence-action-01"/);
  assert.match(html, /data-affordance-id="va-S6-synthesis-01"/);
});

test("unknown structured XM body renders semantic fallback without [object Object] (S87-T-004)", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Unknown structured body",
    activities: [],
    sections: [
      {
        section_id: "S9",
        title: "Odd material",
        exposition: "Section prose remains visible.",
        materials: [
          {
            material_id: "odd-1",
            section_id: "S9",
            kind: "mystery_structure",
            body: { foo: "bar", nested: { a: 1 } },
            formal_notes: "AUTHOR-ONLY mystery"
          }
        ]
      }
    ],
    page_synthesis: { overview: "Overview text" },
    assembly_state: {
      current_stage: "expository_materials",
      enriched_by: ["expository_journey_plan", "expository_development", "expository_materials"]
    }
  };
  const model = buildPageModel(page);
  assert.equal(model.ok, true);
  assert.equal(model.model.expositionSections[0].materials[0].type, "expository_structured_fallback");
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.doesNotMatch(html, /\[object Object\]/);
  assert.doesNotMatch(html, /AUTHOR-ONLY mystery/);
  assert.doesNotMatch(html, /not supported for learner rendering/i);
  assert.match(html, /data-expository-structured="fallback"/);
  assert.match(html, /bar/);
  assert.match(html, /Section prose remains visible/);
});

test("Interactive string-body materials remain unchanged", () => {
  const interactive = readJson("page-render/roman-roads-page.json");
  const before = renderLearnerPageHtml(interactive);
  assert.equal(before.error, null);
  const html = String(before.html || "");
  assert.match(html, /data-region="activities"/);
  assert.doesNotMatch(html, /data-expository-structured=/);
  assert.doesNotMatch(html, /\[object Object\]/);
});

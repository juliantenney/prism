/**
 * Expository XM illustration specifications become visual jobs.
 * Comparison tables stay tables. Unrealised diagrams are not construction documents.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const handoff = require("../lib/expository-xm-illustration-handoff.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");

const TEXT_ALTERNATIVE =
  "In ordinary rain, rainfall enters soil storage. When rainfall exceeds what the soil can hold, additional water runs off into the river channel.";

function catchmentMaterial() {
  return {
    material_id: "XM-M01",
    section_id: "S2",
    kind: "annotated_catchment_diagram",
    title: "How a catchment turns rain into floodwater",
    body: {
      format: "Annotated catchment diagram",
      diagram: {
        representation: "One catchment cross-section in two states: ordinary rain and flood-producing rain",
        layout: "Two labelled states of the same catchment",
        elements: [
          { id: "rain", label: "Rainfall", description: "Water arriving on the catchment" },
          { id: "soil", label: "Soil storage", description: "Water held in the ground" },
          { id: "channel", label: "River channel", description: "Water leaving as streamflow" }
        ],
        causal_connections: [
          { from: "rain", to: "soil", meaning: "infiltrates while the soil can store it" },
          { from: "rain", to: "channel", meaning: "runs off once storage is exceeded" }
        ]
      },
      legend: [
        { label: "Infiltration", description: "Rain entering soil storage" },
        { label: "Runoff", description: "Rain that reaches the channel" }
      ],
      text_alternative: TEXT_ALTERNATIVE
    }
  };
}

function comparisonMaterial() {
  return {
    material_id: "XM-M02",
    section_id: "S3",
    kind: "concise_comparison_table",
    title: "Rain and flood compared",
    body: {
      caption: "Rain and flood compared",
      columns: ["Condition", "Ordinary rain", "Flood-producing rain"],
      rows: [
        {
          Condition: "Soil storage",
          "Ordinary rain": "Accepts water",
          "Flood-producing rain": "Already full"
        }
      ]
    }
  };
}

function pageWith(materials, affordances) {
  const bySection = {};
  materials.forEach(function (material) {
    const sid = material.section_id;
    if (!bySection[sid]) {
      bySection[sid] = {
        section_id: sid,
        title: sid,
        exposition: "Section " + sid + " exposition.",
        materials: []
      };
    }
    bySection[sid].materials.push(material);
  });
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "When Does Rain Become a Flood?",
    activities: [],
    sections: Object.keys(bySection).map(function (key) {
      return bySection[key];
    }),
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: affordances || [],
    page_synthesis: {},
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["expository_journey_plan", "expository_development", "expository_materials", "design_page"]
    }
  };
}

function article(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const start = html.indexOf(marker);
  assert.notEqual(start, -1, "missing material " + materialId);
  const open = html.lastIndexOf("<article", start);
  const end = html.indexOf("</article>", start);
  return html.slice(open, end + "</article>".length);
}

test("annotated catchment diagram becomes one section image job and keeps authored relationships", () => {
  const stored = pageWith([catchmentMaterial(), comparisonMaterial()]);
  const before = JSON.stringify(stored.visual_affordances);
  const pipeline = workspace.buildVisualJobsPipelineFromPage(stored);
  assert.equal(JSON.stringify(stored.visual_affordances), before);

  assert.equal(pipeline.plannerResult.valid, true, JSON.stringify(pipeline.plannerResult.errors));
  assert.equal(pipeline.compilerResult.valid, true, JSON.stringify(pipeline.compilerResult.errors));
  assert.equal(pipeline.plannerResult.jobs.length, 1);
  const job = pipeline.plannerResult.jobs[0];
  assert.equal(job.section_id, "S2");
  assert.equal(job.visual_slot, "section-after-content");
  assert.equal(job.scope, "section");
  assert.equal(job.authored_passthrough.material_id, "XM-M01");
  assert.equal(job.subject, "How a catchment turns rain into floodwater");
  assert.match(job.must_show.join("\n"), /Rainfall → Soil storage/);
  assert.match(job.must_show.join("\n"), /Rainfall → River channel/);
  assert.match(job.must_show.join("\n"), /Two labelled states of the same catchment/);
  assert.equal(job.detailed_description, TEXT_ALTERNATIVE);

  const brief = pipeline.compilerResult.briefs[0];
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /Rainfall → Soil storage/);
  assert.match(prompt, /infiltrates while the soil can store it/);
  assert.match(prompt, /When rainfall exceeds what the soil can hold/);
  assert.match(prompt, /Two labelled states of the same catchment/);
  assert.doesNotMatch(prompt, /XM-M02/);
  assert.equal(
    pipeline.compilerResult.briefs.filter(function (row) {
      return String(row.subject || "").indexOf("Rain and flood") !== -1;
    }).length,
    0
  );
});

test("a comparison table does not become an image job and stays a published table", () => {
  const page = pageWith([comparisonMaterial()]);
  const pipeline = workspace.buildVisualJobsPipelineFromPage(page);
  assert.equal(pipeline.plannerResult.jobs.length, 0);
  const tableBriefs = (pipeline.compilerResult.briefs || []).filter(function (brief) {
    return brief && brief.editorial_opening !== true;
  });
  assert.equal(tableBriefs.length, 0);
  assert.equal(handoff.isUnrealizedIllustrationSpecification(comparisonMaterial()), false);

  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const material = model.model.expositionSections[0].materials[0];
  assert.equal(material.type, "expository_structured_table");
  const rendered = renderLearnerPageHtml(page);
  const html = String(rendered.html || "");
  assert.match(html, /<table\b/i);
  assert.match(html, /Already full/);
  assert.doesNotMatch(html, /data-illustration-status="unfulfilled"/);
});

test("an unfulfilled catchment diagram is not published as construction tables", () => {
  const page = pageWith([catchmentMaterial(), comparisonMaterial()]);
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const diagram = model.model.expositionSections
    .map(function (section) {
      return section.materials[0];
    })
    .filter(function (material) {
      return material.id === "XM-M01";
    })[0];
  assert.equal(diagram.type, "expository_unfulfilled_illustration");
  assert.equal(diagram.accessibleText, TEXT_ALTERNATIVE);

  const rendered = renderLearnerPageHtml(page);
  const html = String(rendered.html || "");
  const block = article(html, "XM-M01");
  assert.match(block, /data-illustration-status="unfulfilled"/);
  assert.match(block, /not yet available/);
  assert.match(block, /When rainfall exceeds what the soil can hold/);
  assert.doesNotMatch(block, /<table\b/i);
  assert.doesNotMatch(block, /<img\b/i);
  assert.doesNotMatch(block, /<h4\b/i);
  ["Format", "Representation", "Elements", "Legend", "Layout", "Causal connections"].forEach(
    function (label) {
      assert.equal(block.includes(">" + label + "<"), false, label);
    }
  );
  assert.match(article(html, "XM-M02"), /<table\b/i);
  assert.match(html, /Already full/);
});

test("an existing section generate affordance is not given a second illustration job", () => {
  const existing = {
    affordance_id: "va-S2-authored",
    scope: "section",
    section_id: "S2",
    visual_decision: "generate",
    visual_slot: "section-after-content",
    tier: "essential",
    purpose: "mechanism",
    preferred_representation: "annotated_system",
    subject: "How a catchment turns rain into floodwater",
    context: "Visual brief: the authored catchment diagram.",
    evidence_anchors: ["S2.materials.XM-M01"],
    rationale: "The authored figure makes the catchment relationships inspectable.",
    reasoning_supported: TEXT_ALTERNATIVE,
    learner_stage: "post_reasoning",
    anti_spoiler: false,
    representation_avoid: ["generic_infographic"],
    canonical_discipline_note: "Use the authored diagram only.",
    requires_exact_data_match: false,
    must_show: ["Rainfall → Soil storage"],
    must_not_show: ["An extra catchment"],
    allowed_claims: [TEXT_ALTERNATIVE],
    disallowed_claims: ["Relationships absent from the diagram."],
    source_basis: "S2.materials.XM-M01",
    caption_intent: "Catchment diagram",
    alt_text: "Catchment diagram; detailed description follows.",
    detailed_description: TEXT_ALTERNATIVE,
    discipline_risk_level: "medium"
  };
  const page = pageWith([catchmentMaterial()], [existing]);
  const prepared = handoff.preparePageForXmIllustrationJobs(page);
  assert.equal(prepared, page);
  assert.equal(page.visual_affordances.length, 1);
  const pipeline = workspace.buildVisualJobsPipelineFromPage(page);
  assert.equal(pipeline.plannerResult.valid, true, JSON.stringify(pipeline.plannerResult.errors));
  assert.equal(pipeline.plannerResult.jobs.length, 1);
  assert.equal(pipeline.plannerResult.jobs[0].affordance_id, "va-S2-authored");
});

test("trial-structure and panel diagrams are not treated as this illustration handoff", () => {
  assert.equal(
    handoff.isUnrealizedIllustrationSpecification({
      material_id: "rct-diagram",
      kind: "Randomised trial structure diagram",
      body: {
        representation_type: "Branching trial structure",
        trial_components: [{ id: "RCT-1", label: "Eligible participants" }],
        relationships: [{ from: "RCT-1", to: "RCT-2", label: "Enter random allocation" }],
        accessible_text_equivalent: "Eligible adults are randomly allocated."
      }
    }),
    false
  );
  assert.equal(
    handoff.isUnrealizedIllustrationSpecification({
      material_id: "XM-M01",
      kind: "Comparative conceptual energy-flow diagram",
      body: {
        format: "Paired conceptual energy-flow diagram",
        diagram: {
          panels: [{ heading: "Vegetated rural surface", layout: "Left panel" }],
          shared_equation: { expression: "Rn + QF = H + LE + ΔQS" }
        },
        text_equivalent: "The diagram compares two environments."
      }
    }),
    false
  );
});

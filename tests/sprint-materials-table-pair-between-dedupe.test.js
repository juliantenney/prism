"use strict";

/**
 * Regression: materials-table-pair-between must render once between the paired
 * tables, not again after the learner response/comparison table.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const placements = require("../lib/learner-renderer-vnext/build-visual-affordance-placements");
const renderer = require("../lib/learner-renderer-vnext");

const TINY_PNG_DATA_URL =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function findHooks(model) {
  var hooks = [];
  (model.activities || []).forEach(function (act) {
    (act.beats || []).forEach(function (beat) {
      (beat.contentSequence || []).forEach(function (item, i) {
        if (item.visualAffordanceBefore) {
          hooks.push({
            pos: "before",
            index: i,
            materialId: item.material && item.material.id,
            materialType: item.material && item.material.type,
            slot: item.visualAffordanceBefore.slot,
            affordanceId: item.visualAffordanceBefore.affordanceId
          });
        }
        if (item.visualAffordanceAfter) {
          hooks.push({
            pos: "after",
            index: i,
            materialId: item.material && item.material.id,
            materialType: item.material && item.material.type,
            slot: item.visualAffordanceAfter.slot,
            affordanceId: item.visualAffordanceAfter.affordanceId
          });
        }
      });
    });
  });
  return hooks;
}

function buildA4LikePage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Table pair between regression",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    page_synthesis: {
      overview: { format: "markdown", body: "Overview." },
      learning_purpose: { format: "markdown", body: "Purpose." },
      knowledge_summary: { format: "markdown", body: "Summary." },
      study_tips: { format: "markdown", body: "Tips." }
    },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Compare evidence." }],
    learning_sequence: {
      sequence_type: "self_directed",
      ordered_activity_ids: ["A4"],
      total_duration_minutes: 20
    },
    visual_affordance_schema_version: "38.4",
    visual_affordances: [
      {
        affordance_id: "va-a4-contrast-panel",
        scope: "activity",
        activity_id: "A4",
        visual_decision: "generate",
        visual_slot: "materials-table-pair-between",
        subject: "Contrast panel between evidence and comparison tables"
      },
      {
        affordance_id: "va-page-ks",
        scope: "page",
        region: "knowledge_summary",
        visual_decision: "generate",
        visual_slot: "knowledge-summary-after-content",
        subject: "Knowledge summary map"
      }
    ],
    activities: [
      {
        activity_id: "A4",
        title: "Compare poem evidence",
        learner_task: "Compare the two poems using the evidence and framework tables.",
        expected_output: "A short comparison citing evidence.",
        activity_preamble: "Inspect the evidence set before completing the framework.",
        evidence_decision: {
          required: true,
          reason: "Learners compare from supplied evidence.",
          provider_material_ids: ["A4-M1"]
        },
        required_materials: [
          {
            material_id: "A4-M1",
            type: "comparison_table",
            purpose: "Comparison Evidence Set",
            specification: "Fixed evidence rows."
          },
          {
            material_id: "A4-M2",
            type: "comparison_table",
            purpose: "Comparison Framework",
            specification: "Learner comparison workspace."
          },
          {
            material_id: "A4-M3",
            type: "checklist",
            purpose: "Guided review",
            specification: "Review criteria."
          }
        ],
        materials: [
          {
            material_id: "A4-M1",
            material_type: "comparison_table",
            activity_id: "A4",
            title: "Comparison Evidence Set",
            body_format: "markdown",
            body:
              "| Poem | Quotation |\n| --- | --- |\n| Dulce | \"Bent double, like old beggars under sacks,\" |\n| Anthem | \"What passing-bells for these who die as cattle?\" |"
          },
          {
            material_id: "A4-M2",
            material_type: "comparison_table",
            activity_id: "A4",
            title: "Comparison Framework",
            body_format: "markdown",
            body:
              "| Poem | Quotation | Comparison |\n| --- | --- | --- |\n| Dulce |  | *Learner completes* |\n| Anthem |  | *Learner completes* |"
          },
          {
            material_id: "A4-M3",
            material_type: "checklist",
            activity_id: "A4",
            title: "Guided review",
            body_format: "markdown",
            body: "- [ ] I cited exact evidence\n- [ ] I compared both poems"
          }
        ],
        episode_plan: {
          archetype: "analyse",
          beats: [
            { function: "orientation" },
            { function: "explanation" },
            { function: "guided_practice" },
            { function: "verification" }
          ]
        },
        learning_outcome_ids: ["LO1"],
        mapped_learning_outcomes: ["LO1"],
        grouping: "individual",
        duration_minutes: 20,
        reasoning_orientation: "Compare evidence before judging."
      }
    ]
  };
}

function buildContrastAsset() {
  return {
    asset_id: "asset-vb-38-4-va-a4-contrast-panel-activity-a4-materials-table-pair-between",
    brief_id: "vb-38-4-va-a4-contrast-panel",
    affordance_id: "va-a4-contrast-panel",
    scope: "activity",
    activity_id: "A4",
    visual_slot: "materials-table-pair-between",
    filename: "activity-a4-materials-table-pair-between.png",
    alt_text: "Contrast panel comparing poem evidence patterns; detailed description follows.",
    detailed_description:
      "Side-by-side contrast of evidence patterns from the two poems for the comparison task.",
    render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
  };
}

test("placement: materials-table-pair-between attaches once after first of two tables", () => {
  const page = {
    visual_affordances: [
      {
        affordance_id: "va-a4-contrast-panel",
        scope: "activity",
        activity_id: "A4",
        visual_decision: "generate",
        visual_slot: "materials-table-pair-between"
      }
    ]
  };
  const model = {
    activities: [
      {
        id: "A4",
        title: "Compare",
        beats: [
          {
            contentSequence: [
              { kind: "material", material: { id: "A4-M1", type: "comparison_table" } },
              { kind: "material", material: { id: "A4-M2", type: "comparison_table" } },
              { kind: "material", material: { id: "A4-M3", type: "checklist" } }
            ]
          }
        ]
      }
    ],
    orientationSections: []
  };
  placements.attachVisualAffordancePlacements(page, model);
  const pairHooks = findHooks(model).filter((h) => h.slot === "materials-table-pair-between");
  assert.equal(pairHooks.length, 1, JSON.stringify(pairHooks));
  assert.equal(pairHooks[0].pos, "after");
  assert.equal(pairHooks[0].materialId, "A4-M1");
  assert.equal(pairHooks[0].affordanceId, "va-a4-contrast-panel");
  assert.equal(
    findHooks(model).some(
      (h) => h.materialId === "A4-M2" && h.slot === "materials-table-pair-between"
    ),
    false,
    "must not place again after the learner response table"
  );
});

test("render: A4-like table-pair-between appears once between evidence and framework", () => {
  const page = buildA4LikePage();
  const result = renderer.renderLearnerPageHtml(page, {
    visualAssets: {
      manifest_version: "1.0",
      schema_version: "38.4",
      assets: [
        buildContrastAsset(),
        {
          asset_id: "asset-va-page-ks",
          brief_id: "brief-va-page-ks",
          affordance_id: "va-page-ks",
          scope: "page",
          visual_slot: "knowledge-summary-after-content",
          alt_text: "Knowledge summary map; detailed description follows.",
          detailed_description: "Concept relationships for the session.",
          render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
        }
      ],
      missing_brief_ids: [],
      diagnostics: { briefs_received: 2, assets_attached: 2, assets_missing: 0 }
    }
  });
  assert.equal(result.error, null, result.error && result.error.message);
  const html = result.html;

  const contrastSrcMatches = html.match(
    /activity-a4-materials-table-pair-between\.png|asset-vb-38-4-va-a4-contrast-panel/g
  );
  // Filename may not appear for data_url; count figures by stable id instead.
  const figureId = "asset-vb-38-4-va-a4-contrast-panel-activity-a4-materials-table-pair-between";
  const figureIdMatches = html.match(new RegExp('data-figure-id="' + figureId + '"', "g")) || [];
  assert.equal(figureIdMatches.length, 1, "contrast figure must render exactly once");

  const descId = "figure-description-" + figureId;
  const descIdMatches = html.match(new RegExp('id="' + descId + '"', "g")) || [];
  assert.equal(descIdMatches.length, 1, "description id must be unique");
  const ariaMatches =
    html.match(new RegExp('aria-describedby="' + descId + '"', "g")) || [];
  assert.equal(ariaMatches.length, 1, "aria-describedby must resolve to one description");

  const evidencePos = html.indexOf("Comparison Evidence Set");
  const frameworkPos = html.indexOf("Comparison Framework");
  const reviewPos = html.indexOf("Guided review");
  const figurePos = html.indexOf('data-figure-id="' + figureId + '"');
  assert.ok(evidencePos !== -1 && frameworkPos !== -1 && reviewPos !== -1 && figurePos !== -1);
  assert.ok(evidencePos < figurePos, "figure after evidence table");
  assert.ok(figurePos < frameworkPos, "figure before comparison framework");
  assert.ok(frameworkPos < reviewPos, "framework before guided review");

  // Contiguous figure numbering across KS + A4 contrast
  const figureLabels = [...html.matchAll(/>\s*Figure\s+(\d+)\./g)].map((m) => Number(m[1]));
  assert.ok(figureLabels.length >= 2, "expected KS + contrast figures");
  for (var i = 1; i < figureLabels.length; i += 1) {
    assert.equal(figureLabels[i], figureLabels[i - 1] + 1, "figure numbers must be contiguous");
  }

  // Unrelated knowledge-summary slot still renders
  assert.match(html, /data-figure-id="asset-va-page-ks"/);
  assert.equal((html.match(/data-figure-id="asset-va-page-ks"/g) || []).length, 1);
});

test("intentional distinct placements may reuse the same image file", () => {
  const page = buildA4LikePage();
  page.visual_affordances.push({
    affordance_id: "va-a4-entry",
    scope: "activity",
    activity_id: "A4",
    visual_decision: "generate",
    visual_slot: "materials-entry",
    subject: "Entry diagram"
  });
  const sharedFile = "shared-contrast.png";
  const result = renderer.renderLearnerPageHtml(page, {
    visualAssets: {
      assets: [
        {
          ...buildContrastAsset(),
          filename: sharedFile
        },
        {
          asset_id: "asset-va-a4-entry",
          brief_id: "brief-va-a4-entry",
          affordance_id: "va-a4-entry",
          scope: "activity",
          activity_id: "A4",
          visual_slot: "materials-entry",
          filename: sharedFile,
          alt_text: "Entry diagram; detailed description follows.",
          detailed_description: "Entry overview for the comparison activity.",
          render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
        },
        {
          asset_id: "asset-va-page-ks",
          brief_id: "brief-va-page-ks",
          affordance_id: "va-page-ks",
          scope: "page",
          visual_slot: "knowledge-summary-after-content",
          alt_text: "Knowledge summary map; detailed description follows.",
          detailed_description: "Concept relationships for the session.",
          render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
        }
      ]
    }
  });
  assert.equal(result.error, null, result.error && result.error.message);
  const html = result.html;
  assert.equal(
    (html.match(/data-figure-id="asset-vb-38-4-va-a4-contrast-panel-activity-a4-materials-table-pair-between"/g) || [])
      .length,
    1
  );
  assert.equal((html.match(/data-figure-id="asset-va-a4-entry"/g) || []).length, 1);
  assert.notEqual(
    html.indexOf('data-figure-id="asset-va-a4-entry"'),
    html.indexOf(
      'data-figure-id="asset-vb-38-4-va-a4-contrast-panel-activity-a4-materials-table-pair-between"'
    )
  );
});

test("legacy path still places table-pair-between only between adjacent tables", () => {
  const page = { visual_affordances: [] };
  const model = {
    activities: [
      {
        id: "A2",
        title: "Legacy multi-table",
        beats: [
          {
            contentSequence: [
              { kind: "material", material: { id: "M1", type: "analysis_table" } },
              { kind: "material", material: { id: "M2", type: "analysis_table" } },
              { kind: "material", material: { id: "M3", type: "checklist" } }
            ]
          }
        ]
      }
    ],
    orientationSections: []
  };
  placements.attachVisualAffordancePlacements(page, model);
  const pairHooks = findHooks(model).filter((h) => h.slot === "materials-table-pair-between");
  assert.equal(pairHooks.length, 1);
  assert.equal(pairHooks[0].materialId, "M1");
});

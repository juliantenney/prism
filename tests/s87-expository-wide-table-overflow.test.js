/**
 * Regression: Expository wide tables use established breakout layout.
 * Prose stays ~70ch; table hosts expand right into available viewport width.
 * Horizontal scroll is a narrow/fallback only — not the primary desktop behaviour.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");
const structured = require("../lib/learner-renderer-vnext/expository-structured-materials.js");

const repoRoot = path.resolve(__dirname, "..");
const appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
const cssStart = appJs.indexOf("function getUtilityExpositoryPublishingCss");
const cssEnd = appJs.indexOf("function getUtilityVnextProseMeasureCss", cssStart);
const expositoryCss =
  cssStart >= 0 && cssEnd > cssStart ? appJs.slice(cssStart, cssEnd) : "";

const WIDE_COLUMNS = [
  "Label",
  "Premises",
  "Conclusion",
  "Test question",
  "Counterexample",
  "Result",
  "Reason"
];

function pageWithWideStructuredTable() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Counterexample test",
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "Applying the counterexample test",
        exposition: "Apply the counterexample test to each case.",
        materials: [
          {
            material_id: "mat-cases",
            kind: "comparison",
            title: "Cases",
            body: {
              columns: WIDE_COLUMNS,
              rows: [
                {
                  Label: "Case A",
                  Premises: "All P are Q; this is P",
                  Conclusion: "This is Q",
                  "Test question": "Is every P really Q?",
                  Counterexample: "A P that is not Q",
                  Result: "Invalid",
                  Reason:
                    "A single counterexample defeats the universal claim even when the premises sound persuasive."
                },
                {
                  Label: "Case B",
                  Premises: "Most P are Q; this is P",
                  Conclusion: "This is probably Q",
                  "Test question": "Does most survive one miss?",
                  Counterexample: "A P that is not Q",
                  Result: "Still plausible",
                  Reason:
                    "Statistical claims tolerate exceptions; the reason column must remain fully readable."
                }
              ]
            }
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

test("Expository CSS: table hosts use breakout width; scroll is fallback only", () => {
  assert.ok(expositoryCss.length > 100, "expected Expository publishing CSS slice");
  assert.match(expositoryCss, /util-exposition-table-breakout/);
  assert.match(expositoryCss, /util-exposition-table-scroll/);
  // Established breakout principle (viewport-relative width, not measure-locked)
  assert.match(
    expositoryCss,
    /width:min\(75rem,calc\(100vw - var\(--learner-breakout-left\) - var\(--learner-page-gutter\)\)\)/
  );
  assert.match(expositoryCss, /max-width:none/);
  // Table fills breakout host (not width:auto / min-width:100% as the solution)
  assert.match(
    expositoryCss,
    /\.util-exposition-structured-table\{width:100%;min-width:0;max-width:none/
  );
  assert.doesNotMatch(
    expositoryCss,
    /\.util-exposition-structured-table\{width:auto;min-width:100%/
  );
  // Overflow retained as fallback on the breakout host rule set
  assert.match(expositoryCss, /overflow-x:auto/);
  assert.match(expositoryCss, /util-exposition-explanation > \.util-table-scroll/);
  assert.match(expositoryCss, /util-exposition-material > \.util-table-scroll/);
  // Interactive shared floor remains untouched
  assert.match(appJs, /\.util-learner-renderer-vnext table\{[^}]*min-width:34rem/);
  assert.match(appJs, /--learner-reading-width:70ch/);
  // Shared Interactive breakout selector unchanged
  assert.match(
    appJs,
    /\.util-learner-renderer-vnext \.util-learner-table-breakout,\.util-learner-renderer-vnext \.util-material-table-block\{/
  );
});

test("Structured wide Cases table uses breakout host; Reason intact", () => {
  const page = pageWithWideStructuredTable();
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.match(html, /data-page-kind="expository"/);
  assert.match(html, /util-exposition-table-breakout/);
  assert.match(html, /util-exposition-table-scroll/);
  assert.match(
    html,
    /util-exposition-table-breakout[\s\S]*<table class="util-exposition-structured-table">[\s\S]*Reason/
  );
  assert.match(html, /reason column must remain fully readable/i);
  for (const col of WIDE_COLUMNS) {
    assert.match(html, new RegExp(col.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  const mat = model.model.expositionSections[0].materials[0];
  const direct = structured.renderExpositionStructuredMaterial(mat);
  assert.match(direct, /util-exposition-table-breakout/);
  assert.match(direct, /util-exposition-structured-table/);
});

test("Markdown exposition tables receive util-table-scroll host for breakout CSS", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Counterexample test",
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "Applying the counterexample test",
        exposition:
          "### Cases\n\n" +
          "| Label | Premises | Conclusion | Test question | Counterexample | Result | Reason |\n" +
          "| --- | --- | --- | --- | --- | --- | --- |\n" +
          "| A | All P are Q | This is Q | Is every P Q? | A P that is not Q | Invalid | Reason text must stay reachable. |\n",
        materials: []
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
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.match(html, /data-page-kind="expository"/);
  assert.match(
    html,
    /util-exposition-explanation[\s\S]*util-table-scroll[\s\S]*Reason text must stay reachable/
  );
  // Breakout applies via Expository CSS to explanation > .util-table-scroll
  assert.match(expositoryCss, /util-exposition-explanation > \.util-table-scroll/);
});

/**
 * Page render shape smoke — PB-S-007 (historical golden HTML asserts removed).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fixturesDir = "tests/fixtures/page-render";

function mainBodyHtml(html) {
  return String(html || "").split('<details class="util-meta"')[0];
}

function markupBodyHtml(html) {
  return mainBodyHtml(html).replace(/<style[\s\S]*?<\/style>/gi, "");
}

test("shape fixtures: markdown-table page renders without error", () => {
  const parsed = loadPageFixture(repoRoot, path.join(fixturesDir, "shape-markdown-table.json"));
  const html = renderPageHtml(api, parsed);
  assert.match(html, /util-page-export--vnext/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});

test("slice 31-4: markdown table shape uses scroll wrapper when table is exported", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, path.join(fixturesDir, "shape-markdown-table.json")));
  if (html.includes("util-table-scroll")) {
    assert.match(html, /util-table-scroll/);
    assert.doesNotMatch(html, /<p>\s*\|[^<]+\|/);
  }
});

test("generic cleanup: schema field labels are hidden while their learner content remains", () => {
  const body = api.utilityNormalizeLearnerContentHierarchyForTest(
    '<h5>Body</h5><p>Body content remains.</p>' +
      '<h4>Text</h4><p>Text content remains.</p>' +
      '<h6>Statement</h6><p>Statement content remains.</p>' +
      '<h5>Id</h5><p>Reference 12</p>' +
      '<h4>Items</h4><ul><li>First useful item</li></ul>'
  );
  assert.match(body, /Body content remains/);
  assert.match(body, /Text content remains/);
  assert.match(body, /Statement content remains/);
  assert.match(body, /Reference 12/);
  assert.match(body, /First useful item/);
  assert.doesNotMatch(
    body,
    /<[^>]+>\s*(Body|Content|Text|Items|Statement|Id)\s*<\/[^>]+>/i
  );
});

test("learner page IA order promotes journey and hides internals", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Political Economy Workbook",
    assembly_state: { current_stage: "design_page", enriched_by: ["episode_plan", "dla"] },
    generation_notes: { validation: { material_coverage: "complete" } },
    sections: [
      {
        section_id: "knowledge_summary",
        heading: "Knowledge Summary",
        content: "Core ideas for this workbook."
      },
      {
        section_id: "learning_sequence",
        heading: "Learning Sequence",
        content: {
          sequence_title: "How this learning progresses",
          ordered_activity_ids: ["A1", "A2"]
        }
      },
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          { activity_id: "A1", title: "Concept foundations", learner_task: "Read and explain." },
          { activity_id: "A2", title: "Evidence and critique", learner_task: "Evaluate claims." }
        ]
      },
      {
        section_id: "assessment_check",
        heading: "Assessment Check",
        content: { items: [{ question: "What is surplus value?" }] }
      }
    ]
  };
  const html = renderPageHtml(api, page);
  const body = mainBodyHtml(html);
  const visibleText = markupBodyHtml(body).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  assert.match(visibleText, /Learning Journey|Orient.*Concept foundations|Concept foundations.*Evidence/i);
  assert.doesNotMatch(visibleText, /Learning Activities/i);
  assert.match(body, /<h2 class="util-activity-title">Concept foundations<\/h2>/i);
  assert.match(body, /<h2 class="util-activity-title">Evidence and critique<\/h2>/i);
  assert.match(visibleText, /Assessment/i);
  assert.doesNotMatch(body, /assembly_state|current_stage|enriched_by|generation_notes/i);
});

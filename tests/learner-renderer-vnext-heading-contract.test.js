"use strict";

/**
 * vNext learner-page heading contract — PB-S-007 smoke (historical h1–h3-only asserts removed).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const { renderMarkdownBlock } = require("../lib/learner-renderer-vnext/render-html-utils");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const { renderOrderingWorkspace } = require("../lib/learner-renderer-vnext/render-ordering-workspace");
const { buildOrderingWorkspaceModel } = require("../lib/learner-renderer-vnext/build-ordering-workspace-model");

const repoRoot = path.resolve(__dirname, "..");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

test("heading contract: moments mode renders vNext page shell", () => {
  const result = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" });
  assert.equal(result.error, null);
  const html = result.html;
  assert.match(html, /data-composition-mode="moments"/);
  assert.match(html, /<h1>/);
  assert.match(html, /<h2 class="util-section-heading/);
  assert.match(html, /<h2 class="util-activity-title"/);
  assert.match(html, /data-region="assessment"/);
  assert.match(html, /util-study-tips/);
});

test("heading contract: beats-fallback mode renders activity beats", () => {
  const result = renderLearnerPageHtml(loadFixture(), { compositionMode: "beats" });
  assert.equal(result.error, null);
  const html = result.html;
  assert.doesNotMatch(html, /data-composition-mode="moments"/);
  assert.match(html, /<h3 class="util-beat-heading/);
  assert.match(html, /Expected output/);
});

test("heading contract: Markdown headings in blocks map to util-md-heading h3", () => {
  const html = renderMarkdownBlock("#### Four");
  assert.match(html, /<h3 class="util-md-heading util-md-heading--source-4">Four<\/h3>/);
});

test("heading contract: material labels use non-heading util-material-heading", () => {
  const moments = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" }).html;
  assert.match(moments, /class="util-material-heading/);
});

test("heading contract: ordering-workspace label is a non-heading element", () => {
  const part = {
    responsePartId: "A1::ordering::ordering",
    surfaceKind: "ordering",
    label: "Put these steps in order",
    prompt: "Use the move buttons.",
    ordering: {
      mode: "sequence",
      validationMode: "none",
      expectedOrder: [],
      items: [
        { itemId: "i1", content: "First", authoredIndex: 0, accessibleLabel: "First" },
        { itemId: "i2", content: "Second", authoredIndex: 1, accessibleLabel: "Second" }
      ],
      initialItems: [
        { itemId: "i1", content: "First", authoredIndex: 0, accessibleLabel: "First" },
        { itemId: "i2", content: "Second", authoredIndex: 1, accessibleLabel: "Second" }
      ]
    }
  };
  const built = buildOrderingWorkspaceModel(part, { activityId: "A1" });
  assert.equal(built.ok, true);
  const html = renderOrderingWorkspace(built.workspace);
  assert.match(
    html,
    /<p class="util-composition-subheading util-ordering-workspace__label">Put these steps in order<\/p>/
  );
});

test("heading contract: task-card titles use styled non-heading elements", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M-cards",
      material_type: "task_card",
      title: "Card set",
      content: [
        { title: "Card Alpha", instruction: "Do the first thing." },
        { title: "Card Beta", instruction: "Do the second thing." }
      ]
    },
    0
  );
  const html = renderMaterial(model);
  assert.match(html, /<p class="util-task-card__title">Card Alpha<\/p>/);
  assert.match(html, /class="util-material-heading/);
});

"use strict";

/**
 * vNext learner-page heading contract: max three semantic levels (h1–h3).
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

function countTag(html, tag) {
  const re = new RegExp("<" + tag + "(?:\\s|>)", "gi");
  return (String(html).match(re) || []).length;
}

function assertNoForbiddenHeadings(html, label) {
  assert.equal(countTag(html, "h4"), 0, label + ": no h4");
  assert.equal(countTag(html, "h5"), 0, label + ": no h5");
  assert.equal(countTag(html, "h6"), 0, label + ": no h6");
}

function assertHeadingContract(html, label) {
  assert.equal(countTag(html, "h1"), 1, label + ": exactly one h1");
  assert.ok(countTag(html, "h2") >= 1, label + ": has h2 regions/activities");
  assert.ok(countTag(html, "h3") >= 1, label + ": has h3 subsections");
  assertNoForbiddenHeadings(html, label);
  assert.match(html, /<h2 class="util-section-heading/, label + ": page regions use h2");
  assert.match(html, /<h2 class="util-activity-title"/, label + ": activity titles use h2");
  assert.match(html, /<h3 class="util-assessment-title/, label + ": assessment items use h3");
  assert.match(html, /data-region="assessment"/, label + ": assessment path present");
  assert.match(html, /util-study-tips/, label + ": study tips path present");
  assert.match(html, /class="util-material-heading/, label + ": material heading class retained");
}

test("heading contract: moments mode conforms to h1–h3 outline", () => {
  const result = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" });
  assert.equal(result.error, null);
  const html = result.html;
  assertHeadingContract(html, "moments");
  assert.match(html, /data-composition-mode="moments"/);
  assert.match(html, /<h3 class="util-composition-moment-heading"/);
  assert.match(
    html,
    /<p class="util-composition-subheading">What to produce<\/p>/
  );
  assert.match(html, /<p class="util-material-heading util-icon-heading"/);
  assert.doesNotMatch(html, /<h4\b/);
});

test("heading contract: beats-fallback mode conforms to h1–h3 outline", () => {
  const result = renderLearnerPageHtml(loadFixture(), { compositionMode: "beats" });
  assert.equal(result.error, null);
  const html = result.html;
  assertHeadingContract(html, "beats");
  assert.doesNotMatch(html, /data-composition-mode="moments"/);
  assert.match(html, /<h3 class="util-beat-heading/);
  assert.match(html, /<p class="util-material-heading util-icon-heading"/);
  assert.match(html, /Expected output/);
  assert.doesNotMatch(html, /<h4\b/);
});

test("heading contract: Markdown # through ###### all render as semantic h3 with source-depth classes", () => {
  const samples = [
    { md: "# One", depth: 1, text: "One" },
    { md: "## Two", depth: 2, text: "Two" },
    { md: "### Three", depth: 3, text: "Three" },
    { md: "#### Four", depth: 4, text: "Four" },
    { md: "##### Five", depth: 5, text: "Five" },
    { md: "###### Six with **bold**", depth: 6, text: "Six with <strong>bold</strong>" }
  ];
  samples.forEach((sample) => {
    const html = renderMarkdownBlock(sample.md);
    assert.match(
      html,
      new RegExp(
        '<h3 class="util-md-heading util-md-heading--source-' +
          sample.depth +
          '">' +
          sample.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
          "</h3>"
      )
    );
    assertNoForbiddenHeadings(html, "md source-" + sample.depth);
    assert.equal(countTag(html, "h1"), 0);
    assert.equal(countTag(html, "h2"), 0);
  });
});

test("heading contract: material labels and EO use non-heading elements", () => {
  const moments = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" }).html;
  const beats = renderLearnerPageHtml(loadFixture(), { compositionMode: "beats" }).html;

  assert.match(moments, /<p class="util-material-heading util-icon-heading"/);
  assert.match(beats, /<p class="util-material-heading util-icon-heading"/);
  assert.match(beats, /<p class="util-material-heading util-icon-heading"[\s\S]*Expected output/);
  assert.match(moments, /<p class="util-composition-subheading">What to produce<\/p>/);
  assert.match(
    moments,
    /<label class="util-composition-subheading util-learner-workspace__label"/
  );
  assert.doesNotMatch(moments, /<h[456]\b/);
  assert.doesNotMatch(beats, /<h[456]\b/);
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
  assertNoForbiddenHeadings(html, "ordering workspace");
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
  assert.match(html, /<p class="util-task-card__title">Card Beta<\/p>/);
  assert.match(html, /class="util-material-heading/);
  assertNoForbiddenHeadings(html, "task cards");
});

test("heading contract: fixture markdown ## maps to h3 with source-2 class", () => {
  const html = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" }).html;
  assert.match(
    html,
    /<h3 class="util-md-heading util-md-heading--source-2">Residuals and Variance<\/h3>/
  );
});

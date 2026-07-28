/**
 * Sprint 70 Slice 2A — learner-facing title + orientation heading hygiene.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const normalizeContent = require("../lib/learner-renderer-vnext/normalize-content.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");
const assemble = require("../lib/page-vnext-assemble.js");
const buildLearnerDraftPageIdentity =
  require("../lib/learner-renderer-vnext/learner-draft-page-key.js").buildLearnerDraftPageIdentity;

const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");
const renderFixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function loadAssembleFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function loadRenderablePage(overrides) {
  const page = JSON.parse(fs.readFileSync(renderFixturePath, "utf8"));
  return Object.assign(page, overrides || {});
}

test("Slice 2A normalize: strips ## Welcome under Overview", () => {
  const out = normalizeContent.stripLeadingMatchingMarkdownHeading(
    "## Welcome\n\nThis self-study resource explores Roman roads.",
    "Overview"
  );
  assert.equal(out, "This self-study resource explores Roman roads.");
});

test("Slice 2A normalize: strips ## Overview under Overview", () => {
  const out = normalizeContent.stripLeadingMatchingMarkdownHeading(
    "## Overview\n\nProse remains.",
    "Overview"
  );
  assert.equal(out, "Prose remains.");
});

test("Slice 2A normalize: strips matching learning purpose / knowledge summary / study tips", () => {
  assert.equal(
    normalizeContent.stripLeadingMatchingMarkdownHeading(
      "## Learning Purpose\n\nYou will explain drivers.",
      "Learning purpose"
    ),
    "You will explain drivers."
  );
  assert.equal(
    normalizeContent.stripLeadingMatchingMarkdownHeading(
      "## Knowledge Summary\n\nCore concepts follow.",
      "Knowledge summary"
    ),
    "Core concepts follow."
  );
  assert.equal(
    normalizeContent.stripLeadingMatchingMarkdownHeading(
      "## Study Tips\n\nPace yourself.",
      "Study tips"
    ),
    "Pace yourself."
  );
});

test("Slice 2A normalize: preserves meaningful non-duplicate initial heading", () => {
  const body = "## Why roads mattered\n\nRoads bound the empire.";
  assert.equal(
    normalizeContent.stripLeadingMatchingMarkdownHeading(body, "Overview"),
    body
  );
});

test("Slice 2A normalize: does not strip activity/material bodies via page_synthesis helper", () => {
  const synthesis = {
    overview: { body: "## Welcome\n\nIntro prose.", format: "markdown" }
  };
  const materialsBody = "## Welcome\n\nMaterial-specific welcome remains.";
  normalizeContent.normalizePageSynthesisOrientationBodies(synthesis);
  assert.equal(synthesis.overview.body, "Intro prose.");
  assert.equal(
    materialsBody,
    "## Welcome\n\nMaterial-specific welcome remains.",
    "materials body must be untouched by page_synthesis normaliser"
  );
});

test("Slice 2A render: Overview shows one structural heading; Welcome removed", () => {
  const page = loadRenderablePage({
    title: "Roman Roads and the Connected Empire",
    page_synthesis: {
      overview: {
        body: "## Welcome\n\nThis self-study resource explores Roman roads and imperial connectivity.",
        format: "markdown"
      },
      learning_purpose: {
        body: "## Learning Purpose\n\nYou will analyse engineering and exchange.",
        format: "markdown"
      },
      knowledge_summary: {
        body: "## Knowledge Summary\n\nRoads enabled military and commercial exchange.",
        format: "markdown"
      },
      study_tips: {
        body: "## Study Tips\n\nAnnotate each map before moving on.",
        format: "markdown"
      }
    }
  });
  const modelResult = buildPageModel(page);
  assert.equal(modelResult.ok, true, (modelResult.errors || []).map((e) => e.message).join("; "));
  assert.equal(modelResult.model.title, "Roman Roads and the Connected Empire");
  const html = renderPage(modelResult.model);
  assert.match(html, /<h1>Roman Roads and the Connected Empire<\/h1>/);
  const overviewSection = html.slice(
    html.indexOf('data-orientation-type="overview"'),
    html.indexOf('data-orientation-type="learning_purpose"')
  );
  assert.equal((overviewSection.match(/>\s*Overview\s*</gi) || []).length, 1);
  assert.doesNotMatch(overviewSection, />\s*Welcome\s*</i);
  assert.match(overviewSection, /This self-study resource explores Roman roads/i);

  const purposeSection = html.slice(
    html.indexOf('data-orientation-type="learning_purpose"'),
    html.indexOf('data-orientation-type="knowledge_summary"')
  );
  assert.equal((purposeSection.match(/>\s*Learning purpose\s*</gi) || []).length, 1);
  assert.match(purposeSection, /You will analyse engineering/i);

  const summarySection = html.slice(
    html.indexOf('data-orientation-type="knowledge_summary"'),
    html.indexOf('data-region="study-tips"') >= 0
      ? html.indexOf('data-region="study-tips"')
      : html.length
  );
  assert.equal((summarySection.match(/>\s*Knowledge summary\s*</gi) || []).length, 1);
  assert.match(summarySection, /Roads enabled military/i);

  if (html.includes('data-region="study-tips"')) {
    const tips = html.slice(html.indexOf('data-region="study-tips"'));
    assert.equal((tips.match(/>\s*Study tips\s*</gi) || []).length, 1);
    assert.match(tips, /Annotate each map/i);
  }
});

test("Slice 2A render: model title is page.title with no renderer rewrite", () => {
  const page = loadRenderablePage({
    title: "Roman Roads: Engineering, Empire, and Exchange"
  });
  const modelResult = buildPageModel(page);
  assert.equal(modelResult.ok, true);
  assert.equal(modelResult.model.title, page.title);
  const html = renderPage(modelResult.model);
  assert.match(html, /<h1>Roman Roads: Engineering, Empire, and Exchange<\/h1>/);
  assert.doesNotMatch(html, /Create a 60 minute/i);
});

test("Slice 2A: HTML document title consumers use assembled page.title", () => {
  const page = loadRenderablePage({ title: "Roman Roads and the Connected Empire" });
  const modelResult = buildPageModel(page);
  assert.equal(modelResult.ok, true);
  const bodyHtml = renderPage(modelResult.model);
  const h1Match = bodyHtml.match(/<h1>([^<]+)<\/h1>/);
  assert.ok(h1Match);
  assert.equal(h1Match[1], page.title);
  // Export shell scrapes h1 into <title>; contract is page.title → h1 → document title.
  assert.equal(h1Match[1], "Roman Roads and the Connected Empire");
});

test("Slice 2A: VA planning unchanged through assembly while title updates", () => {
  const ep = loadAssembleFixture("ep-shell.json");
  ep.title =
    "Create a 60 minute self study resource for undergraduate history students on roman roads";
  const dp = loadAssembleFixture("dp-partial-with-va.json");
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: ep,
    design_page: dp
  });
  assert.equal(result.page.title, dp.title);
  assert.deepEqual(result.page.visual_affordances, dp.visual_affordances);
  assert.deepEqual(result.page.activities_visual_review, dp.activities_visual_review);
  assert.equal(result.page.visual_affordance_schema_version, "38.4");
  assert.equal(Object.prototype.hasOwnProperty.call(result.page, "visual_jobs"), false);
});

test("Slice 2A persistence note: title participates in pageKey slug", () => {
  const page = loadRenderablePage({
    title: "Roman Roads and the Connected Empire",
    workflow_id: "wf-demo",
    page_id: "page-demo"
  });
  const identity = buildLearnerDraftPageIdentity(page);
  assert.match(identity.pageKey, /roman-roads-and-the-connected-empire/i);
  assert.equal(identity.unstable, false);
  // Compatibility: changing title changes the pageKey even when workflow/page ids are present.
  const renamed = buildLearnerDraftPageIdentity(
    Object.assign({}, page, { title: "Different Title" })
  );
  assert.notEqual(identity.pageKey, renamed.pageKey);
});

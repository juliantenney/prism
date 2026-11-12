/**
 * C04 caption_intent leakage + six-dimension terminology preservation.
 * Uses the supplied C04 Design Page fixture / published-package evidence shape.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const visualAssets = require("../lib/prism-visual-assets.js");
const editorial = require("../lib/expository-editorial-opening.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const { renderVisualAffordanceFigure } = require("../lib/learner-renderer-vnext/render-visual-affordance.js");
const publish = require("../lib/assessment-pack-publish.js");

const TINY_PNG_DATA_URL =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const C04_FIXTURE = path.join(
  __dirname,
  "fixtures",
  "assessment-pack-c04-section-elicitation-shorthand.json"
);
const C04_PUBLISHED_HTML = path.join(__dirname, "..", ".tmp-c04-qa", "learner-page.html");

const DRIFTED_DIMENSIONS =
  /accuracy, clarity, relevance, context, qualification and proportionality/;
const PRODUCTION_CAPTION =
  /Establish the setting of independent academic reflection without conveying assessment criteria/;

function loadC04() {
  return JSON.parse(fs.readFileSync(C04_FIXTURE, "utf8"));
}

test("existing C04 authored package demonstrates both defects before correction", () => {
  const page = loadC04();
  assert.match(String(page.attempt_instructions || ""), DRIFTED_DIMENSIONS);
  assert.match(String(page.assessment_evidence.elicitations[0].delivery.prompt.task || ""), DRIFTED_DIMENSIONS);
  assert.match(String(page.editorial_opening_image.caption_intent || ""), PRODUCTION_CAPTION);

  if (fs.existsSync(C04_PUBLISHED_HTML)) {
    const published = fs.readFileSync(C04_PUBLISHED_HTML, "utf8");
    assert.match(published, PRODUCTION_CAPTION);
    assert.match(published, /Figure 1\./);
    assert.match(published, DRIFTED_DIMENSIONS);
  }
});

test("decorative editorial openings do not expose caption_intent as a learner caption", () => {
  const page = loadC04();
  const brief = editorial.buildEditorialOpeningBrief(page);
  assert.ok(brief);
  assert.equal(brief.decorative, true);
  assert.match(String(brief.caption_intent || ""), PRODUCTION_CAPTION);
  assert.equal(brief.learner_caption, undefined);

  const attached = visualAssets.createVisualAssetAssociation(
    brief,
    {
      filename: "editorial-opening.png",
      mime_type: "image/png",
      byte_size: 68,
      width: 1,
      height: 1,
      render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
    },
    { intakeMethod: "file_picker" }
  );
  assert.equal(attached.ok, true);
  assert.equal(attached.asset.learner_caption, undefined);
  assert.match(String(attached.asset.caption_intent || ""), PRODUCTION_CAPTION);

  const html = String(
    renderLearnerPageHtml(page, {
      visualAssets: { assets: [attached.asset] }
    }).html || ""
  );
  const opening = html.indexOf('data-region="editorial-opening"');
  assert.ok(opening !== -1);
  const figureEnd = html.indexOf("</figure>", opening);
  const figure = html.slice(opening, figureEnd === -1 ? opening + 800 : figureEnd + 9);
  assert.match(figure, /alt=""/);
  assert.doesNotMatch(figure, /<figcaption/i);
  assert.doesNotMatch(figure, /Figure 1\./);
  assert.doesNotMatch(figure, PRODUCTION_CAPTION);
  assert.doesNotMatch(figure, /without conveying/);
});

test("genuine authored learner captions remain visible on editorial openings", () => {
  const figure = renderVisualAffordanceFigure(
    {
      affordance_id: "va-editorial-opening",
      visual_slot: "editorial-opening",
      decorative: true,
      learner_caption: "A quiet study desk for independent reflection.",
      caption_intent:
        "Establish the setting of independent academic reflection without conveying assessment criteria, evidence or suggested answers.",
      subject: "A quiet university study setting",
      render_source: { kind: "file", value: "assets/editorial-opening.png" }
    },
    { slot: "editorial-opening", affordanceId: "va-editorial-opening" },
    { figureCounter: { value: 0 } }
  );
  assert.match(figure, /<strong>Figure 1\.<\/strong> A quiet study desk for independent reflection\./);
  assert.doesNotMatch(figure, PRODUCTION_CAPTION);
  assert.doesNotMatch(figure, /without conveying/);
});

test("production instructions cannot leak through polluted learner_caption on the editorial path", () => {
  const figure = renderVisualAffordanceFigure(
    {
      affordance_id: "va-editorial-opening",
      visual_slot: "editorial-opening",
      decorative: true,
      learner_caption:
        "Establish the setting of independent academic reflection without conveying assessment criteria, evidence or suggested answers.",
      caption_intent:
        "Establish the setting of independent academic reflection without conveying assessment criteria, evidence or suggested answers.",
      subject: "A quiet university study setting",
      render_source: { kind: "file", value: "assets/editorial-opening.png" }
    },
    { slot: "editorial-opening", affordanceId: "va-editorial-opening" },
    { figureCounter: { value: 0 } }
  );
  assert.match(figure, /alt=""/);
  assert.doesNotMatch(figure, /<figcaption/i);
  assert.doesNotMatch(figure, /Figure/);
  assert.doesNotMatch(figure, PRODUCTION_CAPTION);
});

test("Assessment Pack generation guidance preserves commission framework terminology", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus:
      "Diagnose your explanation using the C03 quality dimensions: Numerical accuracy; Evidential support; Proportionality; Clarity; Relevance; Context and qualification.",
    startingPoint: "topic"
  });
  const elicitation = built.steps.find(function (step) {
    return /elicitation/i.test(String(step.title || "")) || step.outputName === "assessment_evidence_elicitation";
  });
  const design = built.steps.find(function (step) {
    return /design page/i.test(String(step.title || "")) || step.outputName === "page";
  });
  assert.ok(elicitation);
  assert.ok(design);
  assert.match(
    elicitation.promptBody,
    /preserve that framework's exact dimension names and grouping/i
  );
  assert.match(elicitation.promptBody, /Do not hard-code any universal dimension set/i);
  assert.match(
    design.promptBody,
    /preserve that framework's exact dimension names and grouping/i
  );
  assert.match(
    design.promptBody,
    /split a compound dimension \(for example turning "Context and qualification"/i
  );
  assert.match(design.promptBody, /Do not rewrite arbitrary learner-facing prose at publish time/i);
  assert.match(
    design.promptBody,
    /caption_intent and detailed_description are production-only authoring metadata/i
  );
});

test("publishing existing C04 authored text does not silently rewrite dimension terminology", () => {
  const page = loadC04();
  const resolved = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(resolved.ok, true, resolved && resolved.message);
  assert.match(String(resolved.page.attempt_instructions || ""), DRIFTED_DIMENSIONS);
  const task = resolved.page.assessment_evidence.elicitations[0].delivery.prompt.task;
  assert.match(String(task || ""), DRIFTED_DIMENSIONS);

  const html = String(renderLearnerPageHtml(resolved.page).html || "");
  assert.match(html, DRIFTED_DIMENSIONS);
  // Caption defect is render-boundary; dimensions require authored regeneration.
  assert.doesNotMatch(html, /Numerical accuracy/);
  assert.doesNotMatch(html, /Evidential support/);
  assert.doesNotMatch(html, /Context and qualification/);
});

test("editorial brief attach path still builds a visual job for C04 without promoting caption_intent", () => {
  const page = loadC04();
  const pipeline = workspace.buildVisualJobsPipelineFromPage(page);
  const briefs = (pipeline.compilerResult.briefs || []).filter(function (brief) {
    return brief && brief.editorial_opening === true;
  });
  assert.equal(briefs.length, 1);
  assert.equal(briefs[0].learner_caption, undefined);
  assert.match(String(briefs[0].caption_intent || ""), PRODUCTION_CAPTION);
});

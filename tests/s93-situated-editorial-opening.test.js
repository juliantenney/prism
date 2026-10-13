/**
 * Situated Task editorial opening image.
 * Reuses the Expository resource-level job, attach path and opening placement.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const design = require("../lib/situated-task-design-page.js");
const editorial = require("../lib/expository-editorial-opening.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const visualAssets = require("../lib/prism-visual-assets.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");

const TINY_PNG_DATA_URL =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function editorialBriefs(pipeline) {
  return (pipeline.compilerResult.briefs || []).filter(function (brief) {
    return brief && brief.editorial_opening === true;
  });
}

function page() {
  const fixture = design.buildSituatedTaskDesignPageFixture();
  assert.equal(fixture.ok, true, (fixture.errors || []).join("; "));
  return fixture.page;
}

test("Situated Design Page authors a resource-level editorial opening image", () => {
  const prompt = design.buildSituatedTaskDesignPagePrompt();
  const copy = design.buildSituatedTaskDesignPageCopyInstructions();
  assert.match(prompt, /EDITORIAL OPENING IMAGE/);
  assert.match(prompt, /editorial_opening_image/);
  assert.match(prompt, /authentic setting or context for learner-owned action/i);
  assert.match(prompt, /findings, model answers, or decisions the learner must make/i);
  assert.match(prompt, /OPTIONAL VISUAL PLANNING/i);
  assert.match(prompt, /section-after-content/);
  assert.match(copy, /editorial_opening_image/);
  assert.match(copy, /do not place it in visual_affordances/i);

  const authored = page();
  authored.editorial_opening_image = {
    decision: "generate",
    subject: "A ward office at the start of a shift",
    context: "The setting where the learner will gather their own handover evidence.",
    caption_intent: "The workplace setting for the learner's own investigation.",
    alt_text: "Ward office before a shift handover; detailed description follows.",
    detailed_description:
      "An illustration of a ward office ready for a handover. It does not show findings or the judgement the learner must make."
  };
  assert.equal(design.validateSituatedTaskDesignPage(authored).ok, true);
  assert.equal(design.pageHasVisualPlanning(authored), false);
  assert.equal(Object.prototype.hasOwnProperty.call(authored, "visual_affordances"), false);
});

test("a Situated Task receives one editorial job through the existing attach flow", () => {
  const authored = page();
  authored.editorial_opening_image = {
    decision: "generate",
    subject: "A ward office at the start of a shift",
    context: "The setting where the learner will gather their own handover evidence.",
    caption_intent: "The workplace setting for the learner's own investigation.",
    alt_text: "Ward office before a shift handover; detailed description follows.",
    detailed_description:
      "An illustration of a ward office ready for a handover. It does not show findings or the judgement the learner must make."
  };
  const pipeline = workspace.buildVisualJobsPipelineFromPage(authored);
  assert.equal(pipeline.plannerResult.jobs.length, 0);
  const briefs = editorialBriefs(pipeline);
  assert.equal(briefs.length, 1);
  assert.equal(briefs[0].editorial_product, "situated_task");
  assert.equal(briefs[0].affordance_id, editorial.AFFORDANCE_ID);
  assert.equal(briefs[0].subject, "A ward office at the start of a shift");
  const prompt = workspace.buildVisualJobHumanPrompt(briefs[0]);
  assert.match(prompt, /^Generate a finished rendered educational image\./);
  assert.match(prompt, /Magazine-style editorial opening image for a Situated Task/);
  assert.match(prompt, /authentic setting or context/i);
  assert.match(prompt, /findings, model answers, or decisions the learner must make/i);
  assert.doesNotMatch(prompt, /Expository chapter/);
  assert.doesNotMatch(prompt, /topic_hero_image/);

  const attached = visualAssets.createVisualAssetAssociation(
    briefs[0],
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
  assert.equal(attached.asset.affordance_id, "va-editorial-opening");
  assert.equal(attached.asset.visual_slot, "editorial-opening");
  assert.equal(attached.asset.status, "attached");
});

test("a fulfilled Situated opening image renders after the title and an unfulfilled one does not", () => {
  const authored = page();
  const unfulfilled = String(renderLearnerPageHtml(authored).html || "");
  assert.match(unfulfilled, /<h1>/);
  assert.doesNotMatch(unfulfilled, /data-region="editorial-opening"/);
  assert.doesNotMatch(unfulfilled, /data-visual-slot="editorial-opening"/);
  assert.doesNotMatch(unfulfilled, /<figure\b/i);
  assert.doesNotMatch(unfulfilled, /Ward office at the start of a shift/);

  const fulfilled = String(
    renderLearnerPageHtml(authored, {
      visualAssets: {
        assets: [
          {
            affordance_id: "va-editorial-opening",
            visual_slot: "editorial-opening",
            scope: "editorial",
            alt_text: "Ward office before a shift handover; detailed description follows.",
            detailed_description: "An illustration of a ward office ready for a handover.",
            render_source: { kind: "file", value: "assets/editorial-opening.png" }
          }
        ]
      }
    }).html || ""
  );
  const heading = fulfilled.indexOf("<h1>");
  const opening = fulfilled.indexOf('data-region="editorial-opening"');
  const firstSection = fulfilled.indexOf('data-region="exposition"');
  assert.ok(heading !== -1 && opening > heading && firstSection > opening);
  assert.match(fulfilled, /assets\/editorial-opening\.png/);
  assert.match(fulfilled, /alt="Ward office before a shift handover\."/);
  const openingRegion = fulfilled.slice(opening, firstSection);
  assert.match(openingRegion, /<figcaption/i);
  assert.match(openingRegion, /Figure 1\./);
  assert.match(openingRegion, /Ward office before a shift handover\./);
  assert.doesNotMatch(openingRegion, /aria-describedby/);
  assert.doesNotMatch(openingRegion, /An illustration of a ward office ready for a handover/);

  const skipped = page();
  skipped.editorial_opening_image = {
    decision: "skip",
    skip_reason: "An opening image would reveal the handover judgement the learner must make."
  };
  assert.equal(editorialBriefs(workspace.buildVisualJobsPipelineFromPage(skipped)).length, 0);
  const skippedHtml = String(
    renderLearnerPageHtml(skipped, {
      visualAssets: {
        assets: [
          {
            affordance_id: "va-editorial-opening",
            visual_slot: "editorial-opening",
            alt_text: "Should not publish",
            detailed_description: "Should not publish",
            render_source: { kind: "file", value: "assets/editorial-opening.png" }
          }
        ]
      }
    }).html || ""
  );
  assert.doesNotMatch(skippedHtml, /editorial-opening\.png/);
  assert.doesNotMatch(skippedHtml, /data-region="editorial-opening"/);
});

test("a section visual affordance stays separate from the editorial opening image", () => {
  const fixture = design.buildSituatedTaskDesignPageFixture({ withActionSupportVisual: true });
  assert.equal(fixture.ok, true, (fixture.errors || []).join("; "));
  const pipeline = workspace.buildVisualJobsPipelineFromPage(fixture.page);
  assert.equal(pipeline.plannerResult.jobs.length, 1);
  assert.equal(pipeline.plannerResult.jobs[0].purpose, "action_support");
  assert.equal(pipeline.plannerResult.jobs[0].scope, "section");
  const opening = editorialBriefs(pipeline);
  assert.equal(opening.length, 1);
  assert.equal(opening[0].scope, "editorial");
  assert.equal(
    fixture.page.visual_affordances.some(function (row) {
      return row.affordance_id === "va-editorial-opening";
    }),
    false
  );
  const openingPrompt = workspace.buildVisualJobHumanPrompt(opening[0]);
  assert.doesNotMatch(openingPrompt, /Observation guide for product-situation features/);
});

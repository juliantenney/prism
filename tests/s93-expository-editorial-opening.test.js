/**
 * Expository editorial opening image.
 * One resource-level job, separate from pedagogical section figures.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const editorial = require("../lib/expository-editorial-opening.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const assemble = require("../lib/page-vnext-assemble.js");
const contracts = require("../lib/expository-contracts.js");
const sibling = require("../lib/expository-sibling-prompts.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8"));
}

function ordinaryPage(extra) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "When Does Rain Become a Flood?",
      activities: [],
      sections: [
        {
          section_id: "S1",
          title: "Rain on a catchment",
          exposition: "Rain falls across a catchment."
        },
        {
          section_id: "S2",
          title: "When storage is exceeded",
          exposition: "Runoff grows once the soil can hold no more."
        }
      ],
      visual_affordance_schema_version: "38.4",
      activities_visual_review: [],
      visual_affordances: [],
      page_synthesis: {},
      assembly_state: {
        current_stage: "design_page",
        enriched_by: [
          "expository_journey_plan",
          "expository_development",
          "expository_materials",
          "design_page"
        ]
      }
    },
    extra || {}
  );
}

function editorialBriefs(pipeline) {
  return (pipeline.compilerResult.briefs || []).filter(function (brief) {
    return brief && brief.editorial_opening === true;
  });
}

test("Design Page owns the editorial opening decision separately from pedagogical figures", () => {
  const dp = sibling.resolveTemplate("design_page");
  assert.match(dp, /editorial_opening_image/);
  assert.match(dp, /does not teach a mechanism/i);
  assert.match(dp, /misleading, inappropriate or unhelpful/i);
  assert.match(dp, /visual_affordances may be \[\] when no figure is warranted/i);
  assert.ok(assemble.EXPOSITORY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.includes("editorial_opening_image"));
  assert.equal(
    assemble.DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.includes("editorial_opening_image"),
    false
  );
});

test("an ordinary Expository chapter receives one editorial opening image job", () => {
  const page = ordinaryPage();
  const pipeline = workspace.buildVisualJobsPipelineFromPage(page);
  const briefs = editorialBriefs(pipeline);
  assert.equal(briefs.length, 1);
  assert.equal(pipeline.plannerResult.jobs.length, 0);
  const brief = briefs[0];
  assert.equal(brief.affordance_id, "va-editorial-opening");
  assert.equal(brief.visual_slot, "editorial-opening");
  assert.equal(brief.preferred_representation, "editorial_opening");
  assert.equal(brief.subject, "When Does Rain Become a Flood?");
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /^Generate a finished rendered educational image\./);
  assert.match(prompt, /Magazine-style editorial opening image/);
  assert.match(prompt, /does not teach a mechanism/i);
  assert.match(prompt, /Rain on a catchment/);
  assert.match(prompt, /Alt text:/);
  assert.match(prompt, /When Does Rain Become a Flood\?/);
  assert.match(prompt, /not documentary evidence|documentary evidence/i);
  assert.doesNotMatch(prompt, /topic_hero_image/);
  assert.equal(workspace.resolveWorkspaceStatus(pipeline), "success");
});

test("Design Page copy and a justified skip both survive into the image job", () => {
  const generated = ordinaryPage({
    editorial_opening_image: {
      decision: "generate",
      subject: "A catchment after rain",
      context: "Wet streets, a rising river and an overcast sky. No labelled process.",
      caption_intent: "Rain gathering across a catchment.",
      alt_text: "Illustration of rain over a catchment; detailed description follows.",
      detailed_description:
        "An illustrated catchment under rain, suggesting atmosphere rather than a measured flood event."
    }
  });
  const prompt = workspace.buildVisualJobHumanPrompt(
    editorialBriefs(workspace.buildVisualJobsPipelineFromPage(generated))[0]
  );
  assert.match(prompt, /A catchment after rain/);
  assert.match(prompt, /Rain gathering across a catchment/);
  assert.match(prompt, /suggesting atmosphere rather than a measured flood event/);

  const skipped = ordinaryPage({
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "An opening photograph would imply a specific flood event this chapter does not document."
    }
  });
  assert.equal(editorialBriefs(workspace.buildVisualJobsPipelineFromPage(skipped)).length, 0);
  assert.equal(editorial.isJustifiedSkip(skipped), true);
});

test("a fulfilled editorial image opens the chapter and an unfulfilled one leaves no artefact", () => {
  const page = ordinaryPage();
  const unfulfilled = String(renderLearnerPageHtml(page).html || "");
  assert.match(unfulfilled, /<h1>[^<]*When Does Rain Become a Flood\?/);
  assert.doesNotMatch(unfulfilled, /data-region="editorial-opening"/);
  assert.doesNotMatch(unfulfilled, /data-visual-slot="editorial-opening"/);
  assert.doesNotMatch(unfulfilled, /<figure\b/i);
  assert.doesNotMatch(unfulfilled, /Magazine-style editorial/);

  const fulfilled = String(
    renderLearnerPageHtml(page, {
      visualAssets: {
        assets: [
          {
            affordance_id: "va-editorial-opening",
            visual_slot: "editorial-opening",
            scope: "editorial",
            alt_text: "Illustration of rain over a catchment; detailed description follows.",
            detailed_description: "An illustrated catchment under rain.",
            render_source: { kind: "file", value: "assets/editorial-opening.png" }
          },
          {
            affordance_id: "va-S2-diagram",
            section_id: "S2",
            visual_slot: "section-after-content",
            scope: "section",
            alt_text: "Catchment diagram; detailed description follows.",
            detailed_description: "Rainfall reaches soil storage and then the river channel.",
            render_source: { kind: "file", value: "assets/section-diagram.png" }
          }
        ]
      }
    }).html || ""
  );
  const opening = fulfilled.indexOf('data-region="editorial-opening"');
  const heading = fulfilled.indexOf("<h1>");
  const firstSection = fulfilled.indexOf('data-region="exposition"');
  assert.ok(heading !== -1 && opening > heading && firstSection > opening);
  assert.match(fulfilled, /assets\/editorial-opening\.png/);
  assert.match(fulfilled, /An illustrated catchment under rain/);
  assert.match(fulfilled, /Illustration of rain over a catchment/);
  const skipped = ordinaryPage({
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "An opening image would be misleading for this chapter."
    }
  });
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

test("a section diagram does not replace the editorial opening job", () => {
  const page = ordinaryPage({
    sections: [
      {
        section_id: "S2",
        title: "How a catchment turns rain into floodwater",
        exposition: "The diagram shows the commissioned comparison of storage and runoff.",
        materials: [
          {
            material_id: "XM-M01",
            section_id: "S2",
            kind: "annotated_catchment_diagram",
            title: "How a catchment turns rain into floodwater",
            body: {
              format: "Annotated catchment diagram",
              diagram: {
                representation: "One catchment in two states",
                layout: "Two labelled states of the same catchment",
                elements: [
                  { id: "rain", label: "Rainfall" },
                  { id: "soil", label: "Soil storage" }
                ],
                causal_connections: [
                  { from: "rain", to: "soil", meaning: "infiltrates while the soil can store it" }
                ]
              },
              text_alternative: "Rainfall enters soil storage until the soil is full."
            }
          }
        ]
      }
    ]
  });
  const pipeline = workspace.buildVisualJobsPipelineFromPage(page);
  assert.equal(pipeline.plannerResult.jobs.length, 1);
  assert.equal(pipeline.plannerResult.jobs[0].section_id, "S2");
  const opening = editorialBriefs(pipeline);
  assert.equal(opening.length, 1);
  const openingPrompt = workspace.buildVisualJobHumanPrompt(opening[0]);
  assert.doesNotMatch(openingPrompt, /Rainfall → Soil storage/);
  const diagramPrompt = workspace.buildVisualJobHumanPrompt(pipeline.compilerResult.briefs[0]);
  assert.match(diagramPrompt, /Rainfall → Soil storage/);
});

test("Interactive pages do not receive an editorial opening image", () => {
  const interactive = readJson("page-render/roman-roads-page.json");
  const pipeline = workspace.buildVisualJobsPipelineFromPage(interactive);
  assert.equal(editorialBriefs(pipeline).length, 0);
  const model = buildPageModel(interactive);
  assert.equal(model.model.pageKind, "interactive");
  assert.equal(model.model.editorialOpening, null);
  const html = String(
    renderLearnerPageHtml(interactive, {
      visualAssets: {
        assets: [
          {
            affordance_id: "va-editorial-opening",
            visual_slot: "editorial-opening",
            alt_text: "Should stay off this product",
            detailed_description: "Should stay off this product",
            render_source: { kind: "file", value: "assets/editorial-opening.png" }
          }
        ]
      }
    }).html || ""
  );
  assert.doesNotMatch(html, /data-region="editorial-opening"/);
  assert.doesNotMatch(html, /editorial-opening\.png/);
});

test("assembled Expository Design Page keeps an authored editorial decision", () => {
  const ejp = Object.assign({}, readJson("s85-expository-live-ejp.json"), {
    commissioned_purpose: "Explain formative assessment as an evidence-to-action loop.",
    epistemic_form: "practical conceptual model"
  });
  const xd = readJson("s85-expository-live-xd.json");
  const xm = contracts.normalizeExpositoryMaterials(readJson("s85-expository-live-xm-structured.json"));
  const design_page = Object.assign({}, readJson("s85-expository-dp-raw-paste.json"), {
    artifact_type: "page",
    schema_version: "2.0.0",
    page_synthesis: {},
    editorial_opening_image: {
      decision: "generate",
      subject: "A seminar room where evidence of learning is still in use",
      context: "Quiet classroom atmosphere, not a diagram of the feedback loop.",
      caption_intent: "Evidence of learning, still open on the table.",
      alt_text: "Illustration of a seminar room; detailed description follows.",
      detailed_description: "An editorial view of a seminar room. It does not document a real class."
    }
  });
  const assembled = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    expository_materials: xm,
    design_page: design_page
  });
  assert.equal(assembled.ok, true, JSON.stringify(assembled.errors || assembled));
  assert.equal(
    assembled.page.editorial_opening_image.subject,
    "A seminar room where evidence of learning is still in use"
  );
  const pipeline = workspace.buildVisualJobsPipelineFromPage(assembled.page);
  const opening = editorialBriefs(pipeline);
  assert.equal(opening.length, 1);
  assert.match(opening[0].subject, /seminar room/);
  const sectionJobs = pipeline.plannerResult.jobs.filter(function (job) {
    return job.section_id === "S2";
  });
  assert.equal(sectionJobs.length, 1);
});

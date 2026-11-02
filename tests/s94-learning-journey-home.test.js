/**
 * Learning Journey home presentation: editorial banner, learner typography,
 * optional video, and experience sequence.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");

const editorial = require("../lib/expository-editorial-opening.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const design = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");

const TINY_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function productWaysPage(extra) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      product_id: "learning_journey",
      title: "Introduction to Product Ways of Working",
      activities: [],
      sections: [
        {
          section_id: "journey_intro",
          title: "Introduction to Product Ways of Working",
          order: 1,
          exposition:
            "Product ways of working start with understanding the people you are trying to help, the problems they face and the outcomes you want to achieve — rather than assuming that the first proposed solution is necessarily the right one.\n\nIn this short journey, you will develop a practical introduction to this way of thinking. You will first look beneath a workplace request to identify the problem and intended outcome. You will then explore how assumptions, evidence and iteration help teams make decisions under uncertainty. Finally, you will apply these ideas yourself to a new workplace situation.\n\nThe aim is not to make you a product specialist in 30 minutes. It is to give you a useful mental model for participating in product work and asking better questions when you encounter requests, proposed solutions and decisions."
        },
        {
          section_id: "exp_1",
          title: "Seeing the Problem Behind the Request",
          order: 2,
          exposition:
            "Your starting point is a familiar workplace situation: someone has asked for something to be built, changed or delivered."
        },
        {
          section_id: "exp_2",
          title: "Learning Through Evidence",
          order: 3,
          exposition:
            "Once you stop treating the first proposed solution as certain, an important question appears: how do we decide what to do when we do not yet know everything we need to know?"
        },
        {
          section_id: "exp_3",
          title: "Making a Product-Oriented Judgement",
          order: 4,
          exposition:
            "Now you will bring the ideas together in a new workplace situation."
        }
      ],
      commissions: [
        {
          commission_id: "c1",
          section_id: "exp_1",
          order: 1,
          title: "Seeing the Problem Behind the Request",
          product_id: "expository",
          status: "supported",
          specification_text: "SPEC_C1"
        },
        {
          commission_id: "c2",
          section_id: "exp_2",
          order: 2,
          title: "Learning Through Evidence",
          product_id: "interactive",
          status: "supported",
          specification_text: "SPEC_C2"
        },
        {
          commission_id: "c3",
          section_id: "exp_3",
          order: 3,
          title: "Making a Product-Oriented Judgement",
          product_id: "assessment_pack",
          status: "supported",
          specification_text: "SPEC_C3"
        }
      ],
      learning_journey: { design_intent: "test", continuity: "test" },
      assembly_state: {
        current_stage: "design_page",
        enriched_by: ["design_page"],
        calls_model: true
      }
    },
    extra && typeof extra === "object" ? extra : {}
  );
}

function editorialAsset(overrides) {
  return Object.assign(
    {
      brief_id: "brief-editorial-opening",
      affordance_id: "va-editorial-opening",
      visual_slot: "editorial-opening",
      mime_type: "image/png",
      alt_text: "Colleagues discussing a workplace request around a table",
      subject: "Colleagues discussing a workplace request together",
      learner_caption: "Colleagues discussing a workplace request together",
      detailed_description:
        "Create a restrained, realistic editorial photograph of colleagues in a workplace. Photorealistic, cinematic lighting. Do not reveal later answers.",
      render_source: { kind: "data_url", value: TINY_PNG }
    },
    overrides && typeof overrides === "object" ? overrides : {}
  );
}

function constituent(label) {
  return {
    html: "<!DOCTYPE html><html><body><h1>" + label + "</h1></body></html>",
    assets: [],
    metadata: { package_kind: "learner_package", html_entry: "learner-page.html", title: label }
  };
}

function unzip(bytes) {
  const files = fflate.unzipSync(bytes);
  const out = {};
  Object.keys(files).forEach((path) => {
    out[path] = files[path];
  });
  return out;
}

test("Learning Journey pages default-generate an editorial opening job", () => {
  const page = productWaysPage();
  assert.equal(editorial.isLearningJourneyPage(page), true);
  const brief = editorial.buildEditorialOpeningBrief(page);
  assert.ok(brief);
  assert.equal(brief.editorial_opening, true);
  assert.equal(brief.editorial_product, "learning_journey");
  assert.equal(brief.visual_slot, "editorial-opening");
  assert.match(String(brief.context), /journey as a whole/i);
  assert.match(String(brief.detailed_description), /later experiences/i);

  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const briefs =
    ws && ws.compilerResult && Array.isArray(ws.compilerResult.briefs)
      ? ws.compilerResult.briefs
      : [];
  assert.equal(briefs.length, 1);
  assert.equal(briefs[0].editorial_opening, true);
  const prompt = workspace.buildVisualJobHumanPrompt(briefs[0]);
  assert.match(prompt, /Learning Journey home page/);
  assert.match(prompt, /must not reveal answers, findings, or decisions from later experiences/);
});

test("a justified skip creates no Learning Journey editorial job", () => {
  const page = productWaysPage({
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "No meaningful contextual image can be commissioned for this journey."
    }
  });
  assert.equal(editorial.buildEditorialOpeningBrief(page), null);
  const ws = workspace.buildVisualJobsWorkspaceState(page);
  const briefs =
    ws && ws.compilerResult && Array.isArray(ws.compilerResult.briefs)
      ? ws.compilerResult.briefs
      : [];
  assert.equal(briefs.length, 0);
});

test("Design Page accepts editorial_opening_image and still rejects visual_affordances", () => {
  const page = productWaysPage({
    editorial_opening_image: {
      decision: "generate",
      subject: "A workplace conversation about an unclear request",
      context: "Orient the learner to product work without showing later answers.",
      caption_intent: "A workplace conversation about an unclear request.",
      alt_text: "Colleagues discussing a workplace request around a table",
      detailed_description: "An editorial opening image for the journey as a whole."
    }
  });
  assert.equal(design.validateLearningJourneyDesignPage(page).ok, true);
  const forbidden = Object.assign({}, page, { visual_affordances: [] });
  assert.equal(design.validateLearningJourneyDesignPage(forbidden).ok, false);
});

test("home typography follows published learner tokens and drops formulaic chrome", () => {
  const home = ljPackage.buildLearningJourneyHomeHtml(productWaysPage());
  assert.equal(home.ok, true);
  assert.match(home.html, /--learner-font-sans:"Segoe UI"/);
  assert.match(home.html, /--learner-reading-width:70ch/);
  assert.doesNotMatch(home.html, /Georgia/);
  assert.doesNotMatch(home.html, /Work through each experience in order/);
  assert.doesNotMatch(home.html, /Open an experience when you are ready to begin/);
  assert.match(
    home.html,
    /Product ways of working start with understanding the people you are trying to help/
  );
  assert.match(home.html, /Each experience works on its own/);
  const intro = home.html.match(
    /data-section-id="journey_intro"[\s\S]*?<\/section>/
  );
  assert.ok(intro);
  assert.doesNotMatch(intro[0], /<h2>Introduction to Product Ways of Working<\/h2>/);
});

test("experience sequence is numbered with a non-duplicative action", () => {
  const home = ljPackage.buildLearningJourneyHomeHtml(productWaysPage());
  assert.match(home.html, /<ol class="lj-home__experiences">/);
  assert.match(home.html, /data-experience-index="1"/);
  assert.match(home.html, /data-experience-index="2"/);
  assert.match(home.html, /data-experience-index="3"/);
  assert.match(home.html, /Open this experience/);
  assert.match(home.html, /href="c1\/index\.html"/);
  assert.match(home.html, /href="c2\/index\.html"/);
  assert.match(home.html, /href="c3\/index\.html"/);
  const c1 = home.html.indexOf('href="c1/index.html"');
  const c2 = home.html.indexOf('href="c2/index.html"');
  const c3 = home.html.indexOf('href="c3/index.html"');
  assert.ok(c1 > 0 && c2 > c1 && c3 > c2);
  assert.doesNotMatch(
    home.html,
    /<a class="lj-home__link"[^>]*>Seeing the Problem Behind the Request<\/a>/
  );
});

test("fulfilled editorial banner uses a learner caption and keeps production text out", () => {
  const home = ljPackage.buildLearningJourneyHomeHtml(productWaysPage(), {
    visualAssets: { assets: [editorialAsset()] }
  });
  assert.match(home.html, /data-region="editorial-opening"/);
  assert.match(home.html, /data-visual-slot="editorial-opening"/);
  assert.match(home.html, /Figure 1\./);
  assert.match(home.html, /Colleagues discussing a workplace request together/);
  assert.match(home.html, /alt="Colleagues discussing a workplace request around a table\."/);
  assert.doesNotMatch(home.html, /Create a restrained, realistic editorial photograph/);
  assert.doesNotMatch(home.html, /Photorealistic/);
  assert.doesNotMatch(home.html, /caption_intent/);
  assert.doesNotMatch(home.html, /detailed_description/);
});

test("unfulfilled editorial and absent video publish a clean home", () => {
  const home = ljPackage.buildLearningJourneyHomeHtml(productWaysPage());
  assert.doesNotMatch(home.html, /data-region="editorial-opening"/);
  assert.doesNotMatch(home.html, /data-region="video"/);
  assert.doesNotMatch(home.html, /data-region="additional-resources"/);
  assert.match(home.html, /data-lj-role="learner-home"/);
});

test("optional video sits after the introduction and before the experience sequence", () => {
  const home = ljPackage.buildLearningJourneyHomeHtml(productWaysPage(), {
    videoProjection: {
      section_title: "A short introduction",
      intro_text: "",
      embed_code:
        '<iframe src="https://example.com/embed/journey" title="Journey introduction"></iframe>'
    }
  });
  const introAt = home.html.indexOf('data-section-id="journey_intro"');
  const videoAt = home.html.indexOf('data-region="video"');
  const sequenceAt = home.html.indexOf('class="lj-home__experiences"');
  assert.ok(introAt > 0 && videoAt > introAt && sequenceAt > videoAt);
  assert.match(home.html, /src="https:\/\/example.com\/embed\/journey"/);
  assert.doesNotMatch(home.html, /data-region="additional-resources"/);
});

test("editorial banner helper renders from a visual-asset manifest", () => {
  const html = ljPackage.renderLearningJourneyEditorialBannerHtml(
    { assets: [editorialAsset()] },
    productWaysPage()
  );
  assert.match(html, /data-region="editorial-opening"/);
  assert.match(html, /Figure 1\./);
  assert.doesNotMatch(html, /Create a restrained, realistic editorial photograph/);
  assert.equal(
    ljPackage.renderLearningJourneyEditorialBannerHtml({ assets: [] }, productWaysPage()),
    ""
  );
});

test("ZIP packages the home editorial image and preserves constituent links", () => {
  const assembled = ljPackage.assembleLearningJourneyLearnerPackage({
    page: productWaysPage(),
    constituents: [
      { commissionId: "c1", learnerPackage: constituent("C1") },
      { commissionId: "c2", learnerPackage: constituent("C2") },
      { commissionId: "c3", learnerPackage: constituent("C3") }
    ],
    visualAssets: { assets: [editorialAsset()] },
    videoProjection: {
      section_title: "A short introduction",
      embed_code: '<iframe src="https://example.com/embed/journey" title="Journey introduction"></iframe>'
    },
    fflate
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  const entries = unzip(assembled.bytes);
  assert.ok(entries["index.html"]);
  assert.ok(entries["media/editorial-opening.png"]);
  assert.ok(entries["c1/index.html"]);
  const home = fflate.strFromU8(entries["index.html"]);
  assert.match(home, /src="media\/editorial-opening\.png"/);
  assert.match(home, /data-region="video"/);
  assert.match(home, /href="c1\/index\.html"/);
  assert.doesNotMatch(home, /data:image\/png;base64/);
});

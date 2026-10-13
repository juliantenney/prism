/**
 * Assessment Pack editorial opening image.
 * Optional resource-level job, separate from item representation and answer keys.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const family = require("../lib/first-class-workflow-family.js");
const canonical = require("../lib/assessment-pack-canonical.js");
const publish = require("../lib/assessment-pack-publish.js");
const editorial = require("../lib/expository-editorial-opening.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const visualAssets = require("../lib/prism-visual-assets.js");
const learnerPackage = require("../lib/learner-package.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const { renderVisualAffordanceFigure } = require("../lib/learner-renderer-vnext/render-visual-affordance.js");

const TINY_PNG_DATA_URL =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const ANSWER_KEY = "KEY-PRIOR-A";
const ORDER_KEY = "step-secret-3";
const FIGURE_ALT = "DATA-FIGURE-ALT-SHOULD-NOT-BE-OPENING";

function editorialBriefs(pipeline) {
  return (pipeline.compilerResult.briefs || []).filter(function (brief) {
    return brief && brief.editorial_opening === true;
  });
}

function openingImage() {
  return {
    decision: "generate",
    subject: "A quiet clinic corridor before a study session",
    context: "The educational setting of the check. No answers, sequences, or judgements.",
    caption_intent: "The setting in which the learner will attempt the check.",
    alt_text: "Quiet clinic corridor; detailed description follows.",
    detailed_description:
      "An illustration of a quiet clinic corridor. It establishes context for the assessment and does not show answers or a level of competence."
  };
}

function page(extra) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      product_id: "assessment_pack",
      page_kind: "assessment",
      title: "A formative check",
      activities: [],
      framing: "This check asks you to use evidence you can already read.",
      attempt_instructions: "Read each item, then record your own response.",
      sections: [],
      assessment_evidence: {
        purpose: {
          role: "R2",
          visibility_claim: "Whether the learner can identify a prior.",
          stop_rationale: "A short formative stop.",
          forward_intent: "Show what to concentrate on next."
        },
        learner_context: { depends_on_prior_work: false },
        elicitations: [
          {
            elicitation_id: "e1",
            order: 1,
            evidence_ask: "Identify a prior probability.",
            epistemic_class: "determinate",
            delivery: {
              kind: "auto_checkable_items",
              items: [
                {
                  item_id: "q1",
                  order: 1,
                  form: "single_answer_mcq",
                  prompt: {
                    stem: "Which statement is a prior?",
                    options: [{ key: "a", text: "Belief before evidence" }]
                  },
                  judgement: { correct_answer: ANSWER_KEY, auto_checkable: true },
                  feedback_note: "A prior is the belief held before the new evidence.",
                  representation: {
                    kind: "data_figure",
                    alt_text: FIGURE_ALT,
                    authoritative_data: { labels: [ORDER_KEY] }
                  }
                }
              ]
            },
            formative_return: {
              materials: [
                { material_id: "m1", body: "A prior is the belief held before the new evidence." }
              ],
              forward_orientation: "Concentrate on how priors change when evidence arrives."
            }
          }
        ],
        pack_forward_orientation:
          "Use the result to choose what to study next. It does not unlock or block a path."
      }
    },
    extra || {}
  );
}

test("Design Page permits an optional editorial opening image", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Clinical study design",
    startingPoint: "topic"
  });
  const design = built.steps[6].promptBody;
  assert.match(design, /Editorial opening image/);
  assert.match(
    design,
    /title, activities \[\], assessment_evidence, and editorial_opening_image/
  );
  assert.match(design, /Always emit editorial_opening_image at page root as a decision/);
  assert.match(design, /Image generation is not mandatory/);
  assert.doesNotMatch(design, /Omit the field/);
  assert.match(design, /not an assessment stimulus/);
  assert.match(design, /correct answers, answer sequences, classifications, matches/);
  assert.match(design, /R1 reflective assessment/);
  assert.match(design, /R2 assessment/);
  assert.match(design, /does not need to convey instructional content/);
  assert.match(design, /text-based formative assessment is not automatically a reason to skip/);
  assert.match(
    design,
    /Choose skip when no meaningful contextual image can be commissioned, not merely because the assessment questions are text-based|when no meaningful contextual image can be commissioned, not merely because the assessment questions are text-based/
  );
  assert.doesNotMatch(design, /unnecessary decoration/);
  assert.match(design, /Do not invent a stimulus/);
  assert.match(design, /Do not invent evidence purpose/);

  const authored = page({ editorial_opening_image: openingImage() });
  assert.equal(canonical.validateAssessmentPackCanonicalPage(authored).ok, true);
  const omitted = page();
  assert.equal(editorialBriefs(workspace.buildVisualJobsPipelineFromPage(omitted)).length, 0);
});

test("a Design Page editorial decision survives publish into the image-commission workflow", () => {
  const generated = page({ editorial_opening_image: openingImage() });
  const publishedGenerate = publish.resolveAssessmentPackPublishPage({ page: generated });
  assert.equal(publishedGenerate.ok, true);
  assert.equal(publishedGenerate.source, "canonical");
  assert.equal(
    publishedGenerate.page.editorial_opening_image.subject,
    "A quiet clinic corridor before a study session"
  );
  const generatePipeline = workspace.buildVisualJobsPipelineFromPage(publishedGenerate.page);
  const briefs = editorialBriefs(generatePipeline);
  assert.equal(briefs.length, 1);
  assert.equal(briefs[0].subject, publishedGenerate.page.editorial_opening_image.subject);
  assert.equal(briefs[0].editorial_product, "assessment_pack");
  assert.equal(generatePipeline.plannerResult.jobs.length, 0);
  assert.equal(
    publishedGenerate.page.assessment_evidence.elicitations[0].delivery.items[0].judgement
      .correct_answer,
    ANSWER_KEY
  );

  const skipped = page({
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "An opening image would only decorate this short check."
    }
  });
  const publishedSkip = publish.resolveAssessmentPackPublishPage({ page: skipped });
  assert.equal(publishedSkip.ok, true);
  assert.equal(publishedSkip.page.editorial_opening_image.decision, "skip");
  assert.equal(
    publishedSkip.page.editorial_opening_image.skip_reason,
    "An opening image would only decorate this short check."
  );
  assert.equal(editorialBriefs(workspace.buildVisualJobsPipelineFromPage(publishedSkip.page)).length, 0);
  assert.equal(editorial.isJustifiedSkip(publishedSkip.page), true);
});

test("generate attaches through the existing image job and skip commissions nothing", () => {
  const authored = page({ editorial_opening_image: openingImage() });
  const pipeline = workspace.buildVisualJobsPipelineFromPage(authored);
  const briefs = editorialBriefs(pipeline);
  assert.equal(briefs.length, 1);
  assert.equal(briefs[0].editorial_product, "assessment_pack");
  assert.equal(briefs[0].affordance_id, editorial.AFFORDANCE_ID);
  assert.equal(briefs[0].subject, "A quiet clinic corridor before a study session");
  assert.equal(pipeline.plannerResult.jobs.length, 0);
  const prompt = workspace.buildVisualJobHumanPrompt(briefs[0]);
  assert.match(prompt, /^Generate a finished rendered educational image\./);
  assert.match(prompt, /Magazine-style editorial opening image for an Assessment Pack/);
  assert.match(prompt, /not an assessment stimulus/);
  assert.match(prompt, /Quiet clinic corridor; detailed description follows/);
  assert.match(prompt, /does not show answers or a level of competence/);
  assert.doesNotMatch(prompt, new RegExp(ANSWER_KEY));
  assert.doesNotMatch(prompt, new RegExp(ORDER_KEY));
  assert.doesNotMatch(prompt, new RegExp(FIGURE_ALT));
  assert.doesNotMatch(prompt, /Expository chapter|Situated Task/);

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

  const skipped = page({
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "An opening image would only decorate this short check."
    }
  });
  assert.equal(editorialBriefs(workspace.buildVisualJobsPipelineFromPage(skipped)).length, 0);
  assert.equal(editorial.isJustifiedSkip(skipped), true);
});

test("a fulfilled image sits under the title; a missing image publishes cleanly", () => {
  const authored = page({ editorial_opening_image: openingImage() });
  const unfulfilled = String(renderLearnerPageHtml(authored).html || "");
  assert.match(unfulfilled, /<h1>/);
  assert.doesNotMatch(unfulfilled, /data-region="editorial-opening"/);
  assert.doesNotMatch(unfulfilled, /data-visual-slot="editorial-opening"/);
  assert.doesNotMatch(unfulfilled, /quiet clinic corridor/i);
  assert.doesNotMatch(unfulfilled, /editorial_opening_image/);
  assert.match(unfulfilled, /data-assessment-mode="static"/);
  assert.match(unfulfilled, /Which statement is a prior\?/);
  assert.match(unfulfilled, /Read each item, then record your own response/);

  const fulfilled = String(
    renderLearnerPageHtml(authored, {
      visualAssets: {
        assets: [
          {
            affordance_id: "va-editorial-opening",
            visual_slot: "editorial-opening",
            scope: "editorial",
            alt_text: "Quiet clinic corridor; detailed description follows.",
            detailed_description:
              "An illustration of a quiet clinic corridor. It establishes context for the assessment and does not show answers or a level of competence.",
            render_source: { kind: "file", value: "assets/editorial-opening.png" }
          }
        ]
      }
    }).html || ""
  );
  const heading = fulfilled.indexOf("<h1>");
  const opening = fulfilled.indexOf('data-region="editorial-opening"');
  const intro = fulfilled.indexOf('data-region="assessment-intro"');
  assert.ok(heading !== -1 && opening > heading && intro > opening);
  assert.match(fulfilled, /assets\/editorial-opening\.png/);
  assert.match(fulfilled, /alt="Quiet clinic corridor\."/);
  const figure = fulfilled.slice(opening, intro);
  assert.match(figure, /<figcaption/i);
  assert.match(figure, /Figure 1\./);
  assert.match(figure, /A quiet clinic corridor before a study session\./);
  assert.doesNotMatch(figure, /aria-describedby/);
  assert.doesNotMatch(figure, /An illustration of a quiet clinic corridor/);
  assert.doesNotMatch(figure, new RegExp(ANSWER_KEY));
  assert.doesNotMatch(figure, new RegExp(ORDER_KEY));
  assert.doesNotMatch(figure, new RegExp(FIGURE_ALT));
  const assessmentStart = 'data-region="assessment"';
  assert.equal(
    fulfilled.slice(fulfilled.indexOf(assessmentStart)),
    unfulfilled.slice(unfulfilled.indexOf(assessmentStart))
  );

  const skipped = page({
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "An opening image would only decorate this short check."
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
  assert.doesNotMatch(skippedHtml, /Should not publish/);
  assert.equal(
    skippedHtml.slice(skippedHtml.indexOf('data-region="assessment"')),
    unfulfilled.slice(unfulfilled.indexOf('data-region="assessment"'))
  );
});

test("an attached editorial image packages on a relative asset path", () => {
  const authored = page({ editorial_opening_image: openingImage() });
  const brief = editorialBriefs(workspace.buildVisualJobsPipelineFromPage(authored))[0];
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
  const rendered = renderLearnerPageHtml(authored, {
    visualAssets: { assets: [attached.asset] }
  });
  assert.equal(rendered.error, null);
  const built = learnerPackage.buildLearnerPackage({
    html: rendered.html,
    title: authored.title,
    pageSlug: "formative-check-opening",
    visualAssetManifest: { assets: [attached.asset] }
  });
  assert.equal(built.ok, true, built.error && built.error.message);
  assert.match(built.package.html, /src="assets\/editorial-opening\.png"/);
  assert.doesNotMatch(built.package.html, /data:image\/png;base64/);
  assert.ok(
    built.package.assets.some(function (asset) {
      return asset.path === "assets/editorial-opening.png";
    })
  );
  const opening = built.package.html.indexOf('data-region="editorial-opening"');
  const intro = built.package.html.indexOf('data-region="assessment-intro"');
  assert.ok(opening !== -1 && intro > opening);
  assert.match(built.package.html, /Which statement is a prior\?/);
  assert.equal(
    built.package.html.slice(built.package.html.indexOf('data-region="assessment"')),
    rendered.html.slice(rendered.html.indexOf('data-region="assessment"'))
  );
});

test("the live Step 7 prompt requires an editorial decision even when the stored prompt is older", () => {
  const oldReturn =
    'Return JSON only with artifact_type "page", schema_version "2.0.0", product_id "assessment_pack", page_kind "assessment", title, activities [], and assessment_evidence.';
  const { api } = loadPrismAppJsTestApi();
  const stored = page();
  const workflow = {
    id: "aptest2",
    name: "APTest2",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [
      {
        id: "step-dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page",
        prompt_source_type: "local_override",
        override_prompt_body:
          "You are synthesising the Assessment Pack Design Page. Stages 1–3 are your only semantic input.\n" +
          oldReturn +
          "\nDo not invent a stimulus. Do not add a knowledge summary, study tips, or a closing section.\n" +
          "Do not invent evidence purpose, elicitation, epistemic class, formative return, or bring-forward."
      }
    ]
  };
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  const live = api.buildWorkflowStepInstructions(workflow.steps[0], 6, null);
  assert.match(live, /editorial_opening_image/);
  assert.match(live, /decision "generate" includes subject, context, caption_intent, alt_text, and detailed_description/);
  assert.match(live, /decision "skip" includes a short skip_reason/);
  assert.match(live, /Image generation is not mandatory/);
  assert.match(live, /Making the decision is mandatory/);
  assert.match(
    live,
    /Page graphics planning means assessment stimuli and learning-page graphics\. It does not apply to editorial_opening_image/
  );
  assert.equal(live.indexOf(oldReturn), -1);
  assert.doesNotMatch(live, /Omit the field/);
  assert.equal(live.indexOf("visual_affordances"), -1);
  const requirementAt = live.indexOf("Always emit editorial_opening_image");
  const coreAt = live.indexOf("Here is the core prompt for this step:");
  assert.ok(requirementAt !== -1 && coreAt !== -1 && requirementAt < coreAt);
  assert.equal(live.indexOf(oldReturn, coreAt), -1);
  const resolved = api.resolveStepPromptText(workflow.steps[0], workflow);
  assert.match(resolved.text, /assessment_evidence, and editorial_opening_image/);
  assert.match(resolved.text, /"generate"/);
  assert.match(resolved.text, /"skip"/);

  const published = publish.resolveAssessmentPackPublishPage({
    page: Object.assign({}, stored, {
      editorial_opening_image: {
        decision: "skip",
        skip_reason: "An opening image would only decorate this short check."
      }
    })
  });
  assert.equal(published.ok, true);
  assert.equal(published.page.editorial_opening_image.decision, "skip");
  assert.equal(published.page.assessment_evidence.elicitations[0].elicitation_id, "e1");
});

test("the live Step 7 prompt judges an editorial image by context, not instructional content", () => {
  const { api } = loadPrismAppJsTestApi();
  const workflow = {
    id: "aptest2-guidance",
    name: "APTest2",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    steps: [
      {
        id: "step-dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page",
        prompt_source_type: "local_override",
        override_prompt_body:
          'Return JSON only with artifact_type "page", schema_version "2.0.0", product_id "assessment_pack", page_kind "assessment", title, activities [], assessment_evidence, and editorial_opening_image.\n' +
          'For generate, emit {"decision":"generate","subject":"...","context":"...","caption_intent":"...","alt_text":"...","detailed_description":"..."}.\n' +
          'For skip, emit {"decision":"skip","skip_reason":"..."} with a short reason when an opening image would be misleading, inappropriate, unhelpful, or unnecessary decoration.'
      }
    ]
  };
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  const live = api.buildWorkflowStepInstructions(workflow.steps[0], 6, null);
  assert.match(
    live,
    /An editorial opening image serves contextual, atmospheric or orienting purposes\. It does not need to convey instructional content\./
  );
  assert.match(
    live,
    /A short, text-based formative assessment is not automatically a reason to skip an editorial image\./
  );
  assert.match(
    live,
    /Consider whether a restrained, relevant visual could establish the professional setting or subject without revealing answers or directing learner judgements\./
  );
  assert.match(
    live,
    /Choose skip when no meaningful contextual image can be commissioned, not merely because the assessment questions are text-based\.|when no meaningful contextual image can be commissioned, not merely because the assessment questions are text-based\./
  );
  assert.match(live, /decision "generate"/);
  assert.match(live, /decision "skip"/);
  assert.match(live, /An image is not required for every assessment/);
  assert.doesNotMatch(live, /unnecessary decoration/);
  assert.doesNotMatch(live, /decision must be "generate"|must choose generate/i);
});

test("editorial opening captions stay short, numbered and free of production commissions", () => {
  const commission =
    "Create a restrained, realistic editorial photograph of three colleagues reviewing documents around a laptop. Do not reveal answers, sequences, or judgement information.";
  const authored = page({
    editorial_opening_image: {
      decision: "generate",
      subject: "Colleagues reviewing workplace documents together",
      context: commission,
      caption_intent: commission,
      alt_text: "Three colleagues reviewing documents around a laptop.",
      detailed_description: commission
    }
  });
  const html = String(
    renderLearnerPageHtml(authored, {
      visualAssets: {
        assets: [
          {
            affordance_id: "va-editorial-opening",
            visual_slot: "editorial-opening",
            scope: "editorial",
            subject: "Colleagues reviewing workplace documents together",
            alt_text: "Three colleagues reviewing documents around a laptop.",
            detailed_description: commission,
            caption_intent: commission,
            render_source: { kind: "file", value: "assets/editorial-opening.png" }
          }
        ]
      }
    }).html || ""
  );
  const opening = html.indexOf('data-region="editorial-opening"');
  const intro = html.indexOf('data-region="assessment-intro"');
  assert.ok(opening !== -1 && intro > opening);
  const banner = html.slice(opening, intro);
  assert.match(banner, /src="assets\/editorial-opening\.png"/);
  assert.match(banner, /alt="Three colleagues reviewing documents around a laptop\."/);
  assert.match(banner, /<strong>Figure 1\.<\/strong> Colleagues reviewing workplace documents together\./);
  assert.doesNotMatch(banner, /Create a restrained/);
  assert.doesNotMatch(banner, /aria-describedby/);
  assert.doesNotMatch(banner, /detailed_description|caption_intent/);

  const counter = { value: 0 };
  const preferred = renderVisualAffordanceFigure(
    {
      affordance_id: "va-editorial-opening",
      visual_slot: "editorial-opening",
      alt_text: "Three colleagues reviewing documents around a laptop.",
      subject: "A team meeting",
      learner_caption: "Colleagues reviewing workplace documents together.",
      detailed_description: commission,
      caption_intent: commission,
      render_source: { kind: "file", value: "assets/editorial-opening.png" }
    },
    { slot: "editorial-opening", subject: "A team meeting", affordanceId: "va-editorial-opening" },
    { figureCounter: counter }
  );
  assert.match(preferred, /alt="Three colleagues reviewing documents around a laptop\."/);
  assert.match(
    preferred,
    /<strong>Figure 1\.<\/strong> Colleagues reviewing workplace documents together\./
  );
  assert.doesNotMatch(preferred, /A team meeting/);
  assert.doesNotMatch(preferred, /Create a restrained/);
  assert.doesNotMatch(preferred, /aria-describedby/);

  const decorative = renderVisualAffordanceFigure(
    {
      affordance_id: "va-editorial-opening",
      visual_slot: "editorial-opening",
      alt_text: "",
      subject: "Colleagues reviewing workplace documents together",
      detailed_description: commission,
      render_source: { kind: "file", value: "assets/editorial-opening.png" }
    },
    { slot: "editorial-opening", affordanceId: "va-editorial-opening" },
    { figureCounter: counter }
  );
  assert.match(decorative, /alt=""/);
  assert.match(decorative, /<strong>Figure 2\.<\/strong> Colleagues reviewing workplace documents together\./);
  assert.doesNotMatch(decorative, /Create a restrained/);

  const repeated = renderVisualAffordanceFigure(
    {
      affordance_id: "va-editorial-opening",
      visual_slot: "editorial-opening",
      alt_text: "Three colleagues reviewing documents around a laptop.",
      subject: "Three colleagues reviewing documents around a laptop",
      detailed_description: commission,
      render_source: { kind: "file", value: "assets/editorial-opening.png" }
    },
    { slot: "editorial-opening", affordanceId: "va-editorial-opening" },
    { figureCounter: counter }
  );
  assert.match(repeated, /alt="Three colleagues reviewing documents around a laptop\."/);
  assert.match(
    repeated,
    /<span aria-hidden="true">Three colleagues reviewing documents around a laptop\.<\/span>/
  );
  assert.match(repeated, /<strong>Figure 3\.<\/strong>/);
  assert.doesNotMatch(repeated, /aria-describedby/);
  assert.doesNotMatch(repeated, /Create a restrained/);

  const unsafe = renderVisualAffordanceFigure(
    {
      affordance_id: "va-editorial-opening",
      visual_slot: "editorial-opening",
      alt_text: commission,
      subject: commission,
      detailed_description: commission,
      caption_intent: commission,
      render_source: { kind: "file", value: "assets/editorial-opening.png" }
    },
    { slot: "editorial-opening", subject: commission, affordanceId: "va-editorial-opening" },
    { figureCounter: counter }
  );
  assert.match(unsafe, /alt=""/);
  assert.doesNotMatch(unsafe, /<figcaption/i);
  assert.doesNotMatch(unsafe, /Create a restrained/);
  assert.equal(counter.value, 3);

  const instructional = renderVisualAffordanceFigure(
    {
      affordance_id: "va-s2-diagram",
      visual_slot: "section-after-content",
      alt_text: "Catchment diagram; detailed description follows.",
      detailed_description: "Rainfall reaches soil storage and then the river channel.",
      render_source: { kind: "file", value: "assets/section-diagram.png" }
    },
    { slot: "section-after-content", affordanceId: "va-s2-diagram" },
    { figureCounter: counter }
  );
  assert.match(instructional, /Figure 4\./);
  assert.match(instructional, /Rainfall reaches soil storage and then the river channel/);
  assert.match(instructional, /aria-describedby="figure-description-/);
  assert.equal(counter.value, 4);
});

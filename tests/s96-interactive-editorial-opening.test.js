/**
 * Interactive resource optional editorial opening image.
 * Reuses the shared editorial-opening brief / Visual Jobs / learner-package path.
 */

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const fs = require("node:fs");
const path = require("node:path");

const editorial = require("../lib/expository-editorial-opening.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const visualAssets = require("../lib/prism-visual-assets.js");
const learnerPackage = require("../lib/learner-package.js");
const assemble = require("../lib/page-vnext-assemble.js");
const designPagePartial = require("../lib/ld-design-page-partial-contract.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");

const TINY_PNG_DATA_URL =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function editorialBriefs(pipeline) {
  return (pipeline.compilerResult.briefs || []).filter(function (brief) {
    return brief && brief.editorial_opening === true;
  });
}

function openingImage() {
  return {
    decision: "generate",
    subject: "A restrained 1934 university archive corridor at dusk",
    context:
      "Fictional Blackthorn University atmosphere. No case documents, clues, clocks, or investigative conclusions.",
    caption_intent: "Establish the archival setting without revealing the investigation.",
    alt_text: "Quiet university archive corridor; detailed description follows.",
    detailed_description:
      "An illustration of a quiet 1934 university archive corridor. It establishes atmosphere for the Interactive resource and does not show case evidence, clues, or answers."
  };
}

function interactivePage(extra) {
  const base = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "fixtures", "page-render", "roman-roads-page.json"),
      "utf8"
    )
  );
  base.product_id = "interactive";
  base.title = "The Impossible Alibi";
  base.page_synthesis = Object.assign({}, base.page_synthesis, {
    overview: {
      format: "markdown",
      body: "A valuable notebook has vanished from a locked archive."
    },
    knowledge_summary: {
      format: "markdown",
      body: "Separate documented claims from inferences."
    }
  });
  base.visual_affordance_schema_version = "38.4";
  base.activities_visual_review = [
    {
      activity_id: "A1",
      activity_visual_value: { decision: "high", rationale: "Concept contrast helps classification." }
    }
  ];
  base.visual_affordances = [
    {
      affordance_id: "va-page-knowledge-summary-01",
      scope: "page",
      region: "knowledge_summary",
      visual_decision: "generate",
      rationale: "Map evidence-to-judgement relationships after the briefing.",
      subject: "Evidence-to-judgement reasoning relationships",
      context: "Conceptual map of investigative reasoning.",
      evidence_anchors: ["page_synthesis.knowledge_summary"],
      visual_slot: "knowledge-summary-after-content",
      tier: "essential",
      purpose: "synthesis",
      preferred_representation: "concept_map",
      pedagogical_added_value: "Brings together distinctions taught across activities.",
      reasoning_supported: "Connect source evaluation to qualified judgement.",
      learner_stage: "post_reasoning",
      anti_spoiler: true,
      spoiler_boundary: {
        hide_answers: true,
        hide_classification_keys: true,
        hide_model_solution: true,
        allow_structural_hint: true
      },
      representation_avoid: ["generic_infographic", "topic_hero_image"],
      canonical_discipline_note: "Represent epistemic categories only.",
      requires_exact_data_match: false,
      must_show: ["Documentary evidence", "Competing hypotheses"],
      must_not_show: ["A named culprit"],
      allowed_claims: ["Documents and testimony provide different kinds of evidence."],
      disallowed_claims: ["A sound investigation must identify a guilty person."],
      source_basis: "page_synthesis.knowledge_summary",
      caption_intent: "How source claims become a qualified judgement.",
      alt_text: "Concept map of evidence evaluation; detailed description follows.",
      detailed_description: "A concept map linking sources to qualified judgement.",
      discipline_risk_level: "medium"
    }
  ];
  return Object.assign(base, extra || {});
}

test("Design Page contract requires an Interactive editorial opening image with generate", () => {
  const block = designPagePartial.buildDesignPagePartialContractBlock();
  assert.match(block, /Required Interactive editorial opening image/);
  assert.match(block, /editorial_opening_image/);
  assert.match(
    block,
    /Always emit editorial_opening_image at page root with decision "generate"/
  );
  assert.match(block, /Do not use decision "skip"/);
  assert.match(block, /Do not omit editorial_opening_image on a newly authored Interactive Design Page/);
  assert.match(block, /Do not place the opening image in visual_affordances/);
  assert.match(block, /Knowledge Summary graphic/);
  assert.match(block, /must not reveal evidence, clues, interpretations/);
  assert.match(block, /decorative and text-free/);
  assert.match(block, /text overlays, caption panels, titles, labels, slogans/);
  assert.match(block, /Set alt_text to "" \(empty\)/);
  assert.doesNotMatch(block, /Optional Interactive editorial opening image/);
  assert.doesNotMatch(block, /not required for every Interactive resource/);
  const shape = designPagePartial.buildCanonicalDesignPagePartialShapeSnippet();
  assert.match(shape, /"editorial_opening_image": \{ "decision": "generate"/);
  assert.match(shape, /"alt_text": ""/);
  assert.doesNotMatch(shape, /generate\|skip/);
  assert.doesNotMatch(shape, /optional; omit entirely/);
});

test("Interactive Design Page Copy notes list required editorial_opening_image", () => {
  const vm = require("node:vm");
  const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
  const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, path.join(__dirname, ".."), [
    "lib/ld-design-page-partial-contract.js"
  ]);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  const wf = {
    id: "wf-interactive-editorial-opening-copy",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [
      {
        id: "dp_step",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const instr = api.buildWorkflowStepInstructions(wf.steps[0], 0, null);
  assert.match(instr, /required editorial_opening_image/);
  assert.match(
    instr,
    /Always emit editorial_opening_image at page root with decision "generate"/
  );
  assert.match(instr, /required for every newly authored Interactive Design Page/);
  assert.match(
    instr,
    /owned fields \(title, page_synthesis, visual_affordance_schema_version, activities_visual_review, visual_affordances, editorial_opening_image/
  );
  assert.match(instr, /editorial_opening_image is required with decision "generate"/);
  assert.match(instr, /Knowledge Summary diagrams and activity illustrations/);
});

test("Interactive Design Page ownership preserves editorial_opening_image through assembly", () => {
  const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");
  function loadFixture(name) {
    return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
  }

  assert.ok(
    assemble.DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.indexOf("editorial_opening_image") !== -1
  );

  const designPartial = Object.assign({}, loadFixture("dp-partial-with-va.json"), {
    editorial_opening_image: openingImage()
  });
  const assembled = assemble.assembleVNextPageFromPartials({
    episode_plan: loadFixture("ep-shell.json"),
    dla: loadFixture("dla-partial.json"),
    gam: loadFixture("gam-partial.json"),
    learning_sequence: loadFixture("ls-partial.json"),
    design_page: designPartial
  });
  assert.equal(assembled.ok, true, (assembled.errors || []).join("; "));
  assert.equal(assembled.page.editorial_opening_image.decision, "generate");
  assert.equal(
    assembled.page.editorial_opening_image.subject,
    "A restrained 1934 university archive corridor at dusk"
  );
  assert.ok(Array.isArray(assembled.page.visual_affordances));
  assert.ok(assembled.page.visual_affordances.length > 0);
});

test("authored generate commissions an Interactive opening job; legacy omit and skip still do not", () => {
  // Backwards compatibility: older Interactive JSON without the field stays valid.
  const omitted = interactivePage();
  assert.equal(editorial.isInteractivePage(omitted), true);
  assert.equal(editorialBriefs(workspace.buildVisualJobsPipelineFromPage(omitted)).length, 0);

  const skipped = interactivePage({
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "Atmosphere is already clear from the overview prose."
    }
  });
  assert.equal(editorial.isJustifiedSkip(skipped), true);
  assert.equal(editorialBriefs(workspace.buildVisualJobsPipelineFromPage(skipped)).length, 0);

  const generated = interactivePage({ editorial_opening_image: openingImage() });
  const briefs = editorialBriefs(workspace.buildVisualJobsPipelineFromPage(generated));
  assert.equal(briefs.length, 1);
  assert.equal(briefs[0].editorial_product, "interactive");
  assert.equal(briefs[0].affordance_id, editorial.AFFORDANCE_ID);
  assert.equal(briefs[0].visual_slot, "editorial-opening");
  assert.equal(briefs[0].subject, openingImage().subject);

  assert.equal(briefs[0].alt_text, "");
  assert.equal(briefs[0].decorative, true);
  assert.ok(
    (briefs[0].exclusion_requirements.authored_must_not_show || []).some(function (line) {
      return /text overlays/i.test(line);
    })
  );
  const prompt = workspace.buildVisualJobHumanPrompt(briefs[0]);
  assert.match(prompt, /Magazine-style editorial opening image for an Interactive resource/);
  assert.match(prompt, /Decorative, text-free visual/);
  assert.match(prompt, /text overlays, caption panels, titles, labels, slogans/);
  assert.match(prompt, /Alt text: \(empty — decorative image/);
  assert.match(prompt, /not a Knowledge Summary graphic/);
  assert.match(prompt, /Do not reveal evidence, clues, interpretations or answers/);
  assert.doesNotMatch(prompt, /Assessment Pack|Situated Task|Expository chapter/);
});

test("opening image is distinct from Knowledge Summary graphic in Visual Jobs", () => {
  const page = interactivePage({ editorial_opening_image: openingImage() });
  const pipeline = workspace.buildVisualJobsPipelineFromPage(page);
  const briefs = pipeline.compilerResult.briefs || [];
  const opening = briefs.filter(function (b) {
    return b && b.editorial_opening === true;
  });
  const ks = briefs.filter(function (b) {
    return b && b.affordance_id === "va-page-knowledge-summary-01";
  });
  assert.equal(opening.length, 1);
  assert.ok(ks.length >= 1 || (pipeline.plannerResult.jobs || []).length >= 0);
  assert.notEqual(opening[0].affordance_id, "va-page-knowledge-summary-01");
  assert.equal(opening[0].visual_slot, "editorial-opening");
});

test("title then opening image then Overview; missing image leaves layout unchanged", () => {
  const authored = interactivePage({ editorial_opening_image: openingImage() });
  const withoutAsset = String(renderLearnerPageHtml(authored).html || "");
  assert.match(withoutAsset, /<h1>/);
  assert.match(withoutAsset, /Overview/i);
  assert.doesNotMatch(withoutAsset, /data-region="editorial-opening"/);
  assert.doesNotMatch(withoutAsset, /editorial-opening\.png/);
  assert.doesNotMatch(withoutAsset, /broken|placeholder/i);

  const withAsset = String(
    renderLearnerPageHtml(authored, {
      visualAssets: {
        assets: [
          {
            affordance_id: "va-editorial-opening",
            visual_slot: "editorial-opening",
            scope: "editorial",
            alt_text: "Quiet university archive corridor; detailed description follows.",
            detailed_description:
              "An illustration of a quiet 1934 university archive corridor. It establishes atmosphere for the Interactive resource and does not show case evidence, clues, or answers.",
            subject: "A restrained 1934 university archive corridor at dusk",
            render_source: { kind: "file", value: "assets/editorial-opening.png" }
          }
        ]
      }
    }).html || ""
  );
  const heading = withAsset.indexOf("<h1>");
  const opening = withAsset.indexOf('data-region="editorial-opening"');
  const overview = withAsset.indexOf("Overview");
  assert.ok(heading !== -1 && opening > heading && overview > opening);
  assert.match(withAsset, /src="assets\/editorial-opening\.png"/);
  assert.match(withAsset, /alt=""/);
  assert.match(withAsset, /util-visual-asset--editorial-opening/);
  assert.match(withAsset, /<figcaption[\s\S]*A restrained 1934 university archive corridor at dusk/);

  const noCommission = String(renderLearnerPageHtml(interactivePage()).html || "");
  assert.doesNotMatch(noCommission, /data-region="editorial-opening"/);
  assert.match(noCommission, /Overview/i);
});

test("attached Interactive opening image packages offline in the learner ZIP", () => {
  const authored = interactivePage({ editorial_opening_image: openingImage() });
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
  assert.equal(attached.asset.affordance_id, "va-editorial-opening");

  const rendered = renderLearnerPageHtml(authored, {
    visualAssets: { assets: [attached.asset] }
  });
  assert.equal(rendered.error, null, rendered.error);
  const built = learnerPackage.buildLearnerPackage({
    html: rendered.html,
    title: authored.title,
    pageSlug: "impossible-alibi-opening",
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
  const heading = built.package.html.indexOf("<h1>");
  const opening = built.package.html.indexOf('data-region="editorial-opening"');
  const overview = built.package.html.indexOf("Overview");
  assert.ok(heading !== -1 && opening > heading && overview > opening);
});

test("existing Interactive resources without opening images remain compatible", () => {
  const legacy = interactivePage();
  assert.equal(Object.prototype.hasOwnProperty.call(legacy, "editorial_opening_image"), false);
  const rendered = renderLearnerPageHtml(legacy);
  assert.equal(rendered.error, null, rendered.error);
  assert.match(rendered.html, /The Impossible Alibi/);
  assert.match(rendered.html, /Origins and Expansion of the Roman Road Network/);
  assert.doesNotMatch(rendered.html, /editorial-opening/);
  assert.equal(editorialBriefs(workspace.buildVisualJobsPipelineFromPage(legacy)).length, 0);
});

/**
 * Sprint 91 WP3 — Learning Journey Design Page (shared page contract).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const family = require("../lib/first-class-workflow-family.js");
const design = require("../lib/learning-journey-design-page.js");
const sibling = require("../lib/learning-journey-sibling-prompts.js");
const renderer = require("../lib/learner-renderer-vnext");

const FIXTURE_PAGE = design.buildLearningJourneyDesignPageFixture({
  title: "Learning Journey: Online credibility judgements"
});

test("Learning Journey Design Page prompt is constrained same-chat synthesis of shared page", () => {
  const prompt = design.buildLearningJourneyDesignPagePrompt();
  assert.match(prompt, /ONE continuous chat/i);
  assert.match(prompt, /Learning Requirements/);
  assert.match(prompt, /Learning Progression/);
  assert.match(prompt, /Learning Elements/);
  assert.match(prompt, /Learning Experience Commissions/);
  assert.match(prompt, /unsupported commissions/i);
  assert.match(prompt, /redesign the journey/i);
  assert.match(prompt, /artifact_type": "page"/);
  assert.match(prompt, /product_id": "learning_journey"/);
  assert.match(prompt, /commissions\[\]/);
  assert.match(prompt, /sections\[\]\.exposition/);
  assert.match(prompt, /calls_model": true/);
  assert.match(prompt, /FORBIDDEN FIELDS/);
  assert.match(prompt, /page_synthesis/);
  assert.match(prompt, /artifact_type learning_journey_page/);
  assert.doesNotMatch(prompt, /local assembly; no model/i);
  assert.doesNotMatch(prompt, /upstream captures/i);
  assert.equal(sibling.resolveTemplate("design_page"), prompt);
});

test("valid GPT-shaped shared page is accepted; Interactive and obsolete shapes are rejected", () => {
  assert.equal(FIXTURE_PAGE.ok, true);
  assert.equal(FIXTURE_PAGE.callsModel, true);
  assert.equal(FIXTURE_PAGE.page.assembly_state.calls_model, true);
  assert.equal(FIXTURE_PAGE.page.artifact_type, "page");
  assert.equal(FIXTURE_PAGE.page.schema_version, "2.0.0");
  assert.equal(FIXTURE_PAGE.page.product_id, "learning_journey");
  assert.ok(Array.isArray(FIXTURE_PAGE.page.sections));
  assert.ok(Array.isArray(FIXTURE_PAGE.page.commissions));
  assert.equal(design.validateLearningJourneyDesignPage(FIXTURE_PAGE.page).ok, true);

  const interactive = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Online credibility",
    page_synthesis: { overview: { body: "Overview" } },
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: [],
    assembly_state: { current_stage: "design_page", enriched_by: ["design_page"], calls_model: true }
  };
  assert.equal(design.validateLearningJourneyDesignPage(interactive).ok, false);

  const obsolete = {
    artifact_type: "learning_journey_page",
    schema_version: "1.0.0",
    title: "Obsolete",
    rationale: { markdown: "x" },
    journey: { markdown: "y" },
    elements: { markdown: "z" },
    assembly_state: { calls_model: true }
  };
  assert.equal(design.validateLearningJourneyDesignPage(obsolete).ok, false);

  const wrapper = {
    learning_journey_page: {
      title: "Wrapped",
      page_synthesis: {},
      visual_affordances: []
    }
  };
  assert.equal(design.validateLearningJourneyDesignPage(wrapper).ok, false);

  const localFalse = Object.assign({}, FIXTURE_PAGE.page, {
    assembly_state: Object.assign({}, FIXTURE_PAGE.page.assembly_state, { calls_model: false })
  });
  assert.equal(design.validateLearningJourneyDesignPage(localFalse).ok, false);
});

test("structured commissions survive validation and resolve to experience sections", () => {
  const page = FIXTURE_PAGE.page;
  const gate = design.validateLearningJourneyDesignPage(page);
  assert.equal(gate.ok, true);

  const c1 = design.resolveCommissionFromPage(page, "c1");
  const c2 = design.resolveCommissionFromPage(page, "c2");
  assert.ok(c1);
  assert.ok(c2);
  assert.equal(c1.section_id, "exp_1");
  assert.equal(c2.section_id, "exp_2");
  assert.equal(c1.status, "supported");
  assert.equal(c1.product_id, "expository");
  assert.equal(c2.status, "unsupported");
  assert.equal(c2.product_id, "");

  const sectionIds = new Set(page.sections.map((s) => s.section_id));
  page.commissions.forEach((row) => {
    assert.ok(sectionIds.has(row.section_id));
    assert.notEqual(row.section_id, "journey_intro");
  });

  const unsupportedForced = Object.assign({}, page, {
    commissions: [
      Object.assign({}, c2, { status: "unsupported", product_id: "interactive" })
    ].concat(page.commissions.slice(0, 1))
  });
  assert.equal(design.validateLearningJourneyDesignPage(unsupportedForced).ok, false);
});

test("shared renderer renders Markdown exposition as semantic HTML", () => {
  const page = design.buildLearningJourneyDesignPageFixture({
    title: "Learning Journey: Credibility",
    introExposition: "Welcome.\n\nThis journey develops **online credibility** judgements.",
    experienceExposition: "Next you will practise cue recognition before comparing sources."
  }).page;
  const rendered = renderer.renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  assert.match(rendered.html, /util-exposition-sections/);
  assert.match(rendered.html, /<p>/);
  assert.match(rendered.html, /<strong>online credibility<\/strong>/);
  assert.doesNotMatch(rendered.html, /\*\*online credibility\*\*/);
  assert.match(rendered.html, /About this journey|Credibility/);
  assert.match(rendered.html, /exp_1|Credibility cues primer|cue recognition/i);
  assert.doesNotMatch(rendered.html, /lj-design-page/);
  assert.doesNotMatch(rendered.html, /<pre[^>]*>[\s\S]*artifact_type/);
});

test("Learning Journey publish route remains distinct from Interactive", () => {
  assert.equal(family.publishRouteForWorkflow({ product: "learning_journey" }), "learning_journey_page");
  assert.equal(family.publishRouteForWorkflow({ product: "interactive" }), "learner_page");
  assert.equal(design.PRODUCT_ID, "learning_journey");
  assert.equal(design.ARTIFACT_TYPE, "page");
  assert.equal(design.PUBLISH_ROUTE, "learning_journey_page");
});

test("existing Interactive / Expository / Assessment family publish routes remain intact", () => {
  const interactive = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  const expository = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "expository_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  const assessment = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Bayes",
    startingPoint: "topic"
  });
  assert.equal(interactive.identity.product, "interactive");
  assert.equal(expository.identity.product, "expository");
  assert.equal(assessment.identity.product, "assessment_pack");
  assert.equal(family.publishRouteForWorkflow(interactive.identity), "learner_page");
  assert.equal(family.publishRouteForWorkflow(expository.identity), "expository_page");
  assert.equal(family.publishRouteForWorkflow(assessment.identity), "assessment_pack");
});

test("Assessment pack publish module still assembles assessment pages", () => {
  const publish = require("../lib/assessment-pack-publish.js");
  assert.equal(typeof publish.assembleAssessmentPackPage, "function");
});

test("app.js wires Learning Journey Design Page as GPT synthesis then shared page consume", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.match(appSource, /readAcceptedLearningJourneyPageFromWorkflow/);
  assert.match(appSource, /buildLearningJourneyDesignPageCopyInstructions/);
  assert.match(appSource, /orchestrateLearningJourneyDesignPageRunStage/);
  assert.match(appSource, /refreshUtilitiesOutputWorkspaceFromPage\(ljResult\.page/);
  assert.doesNotMatch(appSource, /executeLearningJourneyDesignPageRunStage/);
  assert.doesNotMatch(appSource, /isLearningJourneyDesignPageLocalStage/);
  assert.doesNotMatch(appSource, /assembled locally — no model paste/);
  assert.doesNotMatch(appSource, /renderLearningJourneyDesignPageHtml/);
  assert.match(
    appSource,
    /String\(wf\.product \|\| ""\)\.trim\(\) !== "learning_journey"/
  );
});

test("design-page module source does not invoke model clients or LJ-specific renderer", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "lib", "learning-journey-design-page.js"),
    "utf8"
  );
  assert.doesNotMatch(source, /openai|anthropic|fetch\(|XMLHttpRequest/i);
  assert.doesNotMatch(source, /renderLearningJourneyDesignPageHtml|lj-design-page/);
});

test("product_id learning_journey disambiguates Interactive section id learning_journey", () => {
  assert.equal(design.PRODUCT_ID, "learning_journey");
  assert.notEqual(design.PRODUCT_ID, "interactive");
});

test("fixture builder is pure under vm isolation", () => {
  const code = fs.readFileSync(
    path.join(__dirname, "..", "lib", "learning-journey-design-page.js"),
    "utf8"
  );
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: "learning-journey-design-page.js" });
  const api = sandbox.module.exports;
  const result = api.buildLearningJourneyDesignPageFixture({ title: "Isolated" });
  assert.equal(result.ok, true);
  assert.equal(result.page.artifact_type, "page");
  assert.equal(result.page.assembly_state.calls_model, true);
});

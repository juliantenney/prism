/**
 * Sprint 92 Gate 8 Slice 1 — Situated Task family registration, pipeline, Design Page.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const design = require("../lib/situated-task-design-page.js");
const sibling = require("../lib/situated-task-sibling-prompts.js");
const renderer = require("../lib/learner-renderer-vnext");

const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

const ST_TITLES = ["Situation", "Activity", "Support", "Learning Return", "Design Page"];
const ST_OUTPUTS = [
  "situated_situation",
  "situated_activity",
  "situated_support",
  "situated_learning_return",
  "situated_task_page"
];

test("situated_task is registered as a first-class product with acceptsCommission", () => {
  const row = family.listFirstClassProducts().find((p) => p.id === "situated_task");
  assert.ok(row);
  assert.equal(row.label, "Situated Task");
  assert.equal(row.promptRoute, "situated_task");
  assert.equal(row.publishRoute, "situated_task_page");
  assert.equal(row.acceptsCommission, true);
  assert.equal(family.productAcceptsCommission("situated_task"), true);
  assert.equal(design.PRODUCT_ID, "situated_task");
  assert.equal(design.PRODUCT_LABEL, "Situated Task");
});

test("Situated Task Create declaration maps to situated_task", () => {
  const row = family.createDeclarationForValue("situated_task");
  assert.ok(row);
  assert.equal(row.product, "situated_task");
  assert.equal(row.label, "Situated Task");
  const declared = family.listCreateDeclarations().map((d) => d.value);
  assert.ok(declared.indexOf("situated_task") !== -1);
});

test("Create markup includes situated_task with family declarations", () => {
  const declared = family.listCreateDeclarations();
  const select = indexHtml.match(/<select[^>]*id="wfLdCreateOutputType"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(select);
  const options = [];
  const re = /<option value="([^"]*)">/g;
  let match;
  while ((match = re.exec(select[1]))) options.push(match[1]);
  assert.deepEqual(
    options.filter((value) => value),
    declared.map((row) => row.value)
  );
});

test("predetermined Situated Task five-stage order and capture identities", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "situated_task",
    focus: "Investigate a product situation",
    audience: "undergraduate product students",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  assert.equal(built.callsModel, false);
  assert.equal(built.identity.product, "situated_task");
  assert.equal(built.identity.ldCreateOutputType, "situated_task");
  assert.deepEqual(built.titles, ST_TITLES);
  assert.deepEqual(
    built.steps.map((s) => s.outputName),
    ST_OUTPUTS
  );
  assert.match(built.deliverySeed.original_brief, /PURPOSE \/ FOCUS/);
  assert.equal(built.deliverySeed.activities_required, false);
});

test("Situated Task sibling routing resolves by title and outputName", () => {
  assert.equal(sibling.resolveStageFromStepIdentity({ title: "Situation" }), "situation");
  assert.equal(sibling.resolveStageFromStepIdentity({ title: "Activity" }), "activity");
  assert.equal(sibling.resolveStageFromStepIdentity({ title: "Support" }), "support");
  assert.equal(
    sibling.resolveStageFromStepIdentity({ title: "Learning Return" }),
    "learning_return"
  );
  assert.equal(
    sibling.resolveStageFromStepIdentity({ outputName: "situated_task_page" }),
    "design_page"
  );
  assert.match(sibling.resolveTemplate("situation"), /CORE QUESTION/);
  assert.match(sibling.resolveTemplate("situation"), /principal learning vehicle/i);
  assert.match(sibling.resolveTemplate("situation"), /PRODUCT-BOUNDARY CHALLENGE/);
  assert.match(sibling.resolveTemplate("activity"), /learner-owned/i);
  assert.match(sibling.resolveTemplate("support"), /without PRISM taking over/i);
  assert.match(sibling.resolveTemplate("learning_return"), /not a persistence/i);
});

test("continuous-conversation Design Page prompt has JSON purity contract", () => {
  const prompt = design.buildSituatedTaskDesignPagePrompt();
  assert.match(prompt, /ONE continuous chat/i);
  assert.match(prompt, /Situation/);
  assert.match(prompt, /Activity/);
  assert.match(prompt, /Support/);
  assert.match(prompt, /Learning Return/);
  assert.match(prompt, /JSON PURITY \(mandatory/i);
  assert.match(prompt, /:chatgpt-content-reference/i);
  assert.match(prompt, /artifact_type": "page"/);
  assert.match(prompt, /situated_learning/);
  assert.match(prompt, /activities": \[\]/);
  assert.match(prompt, /product_id \(workflow identity/);
  assert.doesNotMatch(prompt, /"product_id": "situated_task"/);
  assert.equal(sibling.resolveTemplate("design_page"), prompt);
  const copy = design.buildSituatedTaskDesignPageCopyInstructions();
  assert.match(copy, /valid JSON only/i);
  assert.match(copy, /no citations, content-reference tokens/i);
});

test("valid Situated Task page is accepted; wrong shapes rejected", () => {
  const fixture = design.buildSituatedTaskDesignPageFixture();
  assert.equal(fixture.ok, true);
  assert.equal(design.validateSituatedTaskDesignPage(fixture.page).ok, true);
  assert.equal(fixture.page.artifact_type, "page");
  assert.equal(fixture.page.schema_version, "2.0.0");
  assert.deepEqual(fixture.page.activities, []);
  assert.equal(Object.prototype.hasOwnProperty.call(fixture.page, "product_id"), false);
  assert.ok(fixture.page.situated_learning.purpose.learning_intent);
  assert.ok(fixture.page.situated_learning.activity.undertaking);
  assert.ok(fixture.page.situated_learning.record.retain);
  assert.ok(fixture.page.situated_learning.reconnection.destination);

  assert.equal(
    design.validateSituatedTaskDesignPage({
      artifact_type: "situated_task_page",
      schema_version: "2.0.0",
      title: "x",
      activities: [],
      sections: [{ section_id: "a", title: "A", exposition: "e" }],
      situated_learning: fixture.page.situated_learning,
      assembly_state: fixture.page.assembly_state
    }).ok,
    false
  );

  assert.equal(
    design.validateSituatedTaskDesignPage(
      Object.assign({}, fixture.page, { product_id: "situated_task" })
    ).ok,
    false
  );

  assert.equal(
    design.validateSituatedTaskDesignPage(
      Object.assign({}, fixture.page, {
        situated_learning: Object.assign({}, fixture.page.situated_learning, {
          purpose: { learning_intent: "x" }
        })
      })
    ).ok,
    false
  );

  assert.equal(
    design.validateSituatedTaskDesignPage(
      Object.assign({}, fixture.page, { activities: [{ activity_id: "A1" }] })
    ).ok,
    false
  );

  assert.equal(
    design.validateSituatedTaskDesignPage(
      Object.assign({}, fixture.page, {
        sourceCommissionId: "c1",
        commissions: []
      })
    ).ok,
    false
  );

  assert.equal(
    design.validateSituatedTaskDesignPage(
      Object.assign({}, fixture.page, { localStorage: true })
    ).ok,
    false
  );
});

test("optional conditional situated_learning fields are omit-able", () => {
  const bare = design.buildSituatedTaskDesignPageFixture().page;
  assert.equal(design.validateSituatedTaskDesignPage(bare).ok, true);
  assert.equal(Object.prototype.hasOwnProperty.call(bare.situated_learning, "boundaries"), false);

  const withOptional = design.buildSituatedTaskDesignPageFixture({
    boundaries: "Do not enter restricted areas.",
    attention: "Notice unexpected evidence."
  }).page;
  assert.equal(design.validateSituatedTaskDesignPage(withOptional).ok, true);
  assert.equal(withOptional.situated_learning.boundaries, "Do not enter restricted areas.");

  const emptyOptional = Object.assign({}, bare, {
    situated_learning: Object.assign({}, bare.situated_learning, { attention: "" })
  });
  assert.equal(design.validateSituatedTaskDesignPage(emptyOptional).ok, false);
});

test("ordered learner-facing sections render via shared exposition path", () => {
  const page = design.buildSituatedTaskDesignPageFixture({
    orientExposition: "Investigate the **product situation** carefully."
  }).page;
  assert.ok(page.sections.length >= 2);
  assert.ok(page.sections[0].order <= page.sections[1].order);
  const rendered = renderer.renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  assert.match(rendered.html, /util-exposition-sections/);
  assert.match(rendered.html, /<strong>product situation<\/strong>/);
});

test("prompt and publish routes do not fall through to interactive", () => {
  assert.equal(family.promptRouteForWorkflow({ product: "situated_task" }), "situated_task");
  assert.equal(family.publishRouteForWorkflow({ product: "situated_task" }), "situated_task_page");
  assert.equal(family.promptRouteForWorkflow({ product: "interactive" }), "interactive");
  assert.match(appSource, /situated_task_sibling/);
  assert.match(appSource, /resolveSituatedTaskSiblingPromptBodyForStep/);
  assert.match(appSource, /promptRoute === "situated_task"/);
  assert.match(indexHtml, /situated-task-design-page\.js/);
  assert.match(indexHtml, /situated-task-sibling-prompts\.js/);
});

test("existing Interactive / Expository / Assessment / Learning Journey pipelines remain intact", () => {
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
  const journey = family.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "Credibility",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(interactive.identity.product, "interactive");
  assert.equal(expository.identity.product, "expository");
  assert.equal(assessment.identity.product, "assessment_pack");
  assert.equal(journey.identity.product, "learning_journey");
  assert.equal(family.productAcceptsCommission("interactive"), true);
  assert.equal(family.productAcceptsCommission("learning_journey"), false);
});

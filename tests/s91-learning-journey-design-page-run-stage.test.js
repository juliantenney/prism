/**
 * Sprint 91 — Learning Journey Design Page Run-stage prompt routing.
 * Step 5 is GPT constrained synthesis in the continuous chat (not local assembly).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const design = require("../lib/learning-journey-design-page.js");

test("Learning Journey Design Page Copy notes forbid Interactive contract", () => {
  const notes = design.buildLearningJourneyDesignPageCopyInstructions();
  assert.match(notes, /same-chat/i);
  assert.match(notes, /artifact_type page/);
  assert.match(notes, /product_id learning_journey/);
  assert.match(notes, /commissions\[\]/);
  assert.match(notes, /Do not invent page_synthesis/);
  assert.doesNotMatch(notes, /local assembly; no model call/i);
  assert.doesNotMatch(notes, /Sprint 58 Design Page partial/);
});

test("app.js routes Learning Journey Design Page to LJ prompt, not Interactive pageEnrichmentV2", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.match(appSource, /orchestrateLearningJourneyDesignPageRunStage/);
  assert.match(appSource, /readAcceptedLearningJourneyPageFromWorkflow/);
  assert.match(
    appSource,
    /Learning Journey Design Page is GPT same-chat synthesis — not Interactive pageEnrichmentV2/
  );
  assert.match(
    appSource,
    /String\(wf\.product \|\| ""\)\.trim\(\) !== "learning_journey"/
  );
  const ljBranch = appSource.indexOf("buildLearningJourneyDesignPageCopyInstructions");
  const interactivePartial = appSource.indexOf(
    "Sprint 58 Design Page partial output mode: return a partial page artefact containing title, page_synthesis"
  );
  assert.ok(ljBranch !== -1);
  assert.ok(interactivePartial !== -1);
  assert.ok(ljBranch < interactivePartial);
  assert.doesNotMatch(
    appSource,
    /Learning Journey Design Page is local assembly — never emit a model Copy contract/
  );
});

test("Interactive Design Page contract remains available for Interactive workflows", () => {
  const interactive = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(interactive.ok, true);
  assert.ok(interactive.titles.indexOf("Design Page") !== -1);
  assert.equal(interactive.identity.product, "interactive");
  const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.match(
    appSource,
    /Sprint 58 Design Page partial output mode: return a partial page artefact containing title, page_synthesis/
  );
});

test("fixture shared page carries commissions and continuity without Interactive fields", () => {
  const staged = design.buildLearningJourneyDesignPageFixture({
    title: "Learning Journey: Online credibility judgements"
  });
  assert.equal(staged.ok, true);
  assert.equal(staged.page.artifact_type, "page");
  assert.equal(staged.page.product_id, "learning_journey");
  assert.equal(staged.page.assembly_state.calls_model, true);
  assert.ok(Array.isArray(staged.page.commissions));
  assert.ok(staged.page.learning_journey.continuity);
  assert.equal(design.validateLearningJourneyDesignPage(staged.page).ok, true);
  const json = JSON.stringify(staged.page);
  assert.doesNotMatch(json, /"page_synthesis"/);
  assert.doesNotMatch(json, /"visual_affordance_schema_version"/);
  assert.doesNotMatch(json, /"rationale"/);
  assert.doesNotMatch(json, /"learning_journey_page"/);
});

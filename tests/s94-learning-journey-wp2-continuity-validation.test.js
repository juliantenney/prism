/**
 * Sprint 94 WP2 — S94-T-004 capture-time continuity validation and
 * S94-T-005 author-only commissioning contract inspection.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const family = require("../lib/first-class-workflow-family.js");
const design = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const MEANINGFUL_PRECEDING =
  "Learners previously made an initial judgement among longer library opening hours, additional study spaces, and improved online support.";
const NO_SCENARIO = "This journey has no recurring scenario.";
const GENERIC = "Continue the previous scenario.";
const BRING_FORWARD =
  "Bring forward the initial judgement you made in the previous activity and use it to weigh new evidence.";
const AUTO_TRANSFER =
  "PRISM automatically transfers stored answers from the previous component.";

function clonePage(page) {
  return JSON.parse(JSON.stringify(page));
}

function twoCommissionPage(overrides) {
  const fixture = design.buildLearningJourneyDesignPageFixture({
    title: "Learning Journey: Continuity capture"
  });
  assert.equal(fixture.ok, true);
  const page = clonePage(fixture.page);
  const extra = overrides && typeof overrides === "object" ? overrides : {};
  if (Object.prototype.hasOwnProperty.call(extra, "firstContext")) {
    page.commissions[0].journey_context_text = extra.firstContext;
  }
  if (Object.prototype.hasOwnProperty.call(extra, "laterContext")) {
    page.commissions[1].journey_context_text = extra.laterContext;
  }
  if (Object.prototype.hasOwnProperty.call(extra, "laterDependencies")) {
    page.commissions[1].dependencies = extra.laterDependencies;
  }
  if (Object.prototype.hasOwnProperty.call(extra, "firstSpec")) {
    page.commissions[0].specification_text = extra.firstSpec;
  }
  if (Object.prototype.hasOwnProperty.call(extra, "laterSpec")) {
    page.commissions[1].specification_text = extra.laterSpec;
  }
  if (extra.swapOrders) {
    page.commissions[0].order = 2;
    page.commissions[1].order = 1;
  }
  return page;
}

function legacyHomeLikePage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Product Ways of Working",
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "A short workplace journey."
      },
      {
        section_id: "exp_1",
        title: "Seeing the Problem",
        order: 2,
        exposition: "Start from a familiar request."
      },
      {
        section_id: "exp_2",
        title: "Learning Through Evidence",
        order: 3,
        exposition: "Look for evidence."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Seeing the Problem",
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
      }
    ],
    learning_journey: { design_intent: "test", continuity: "test" },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };
}

function ljWorkflowAndStep() {
  const built = family.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "Continuity capture",
    learningTime: "90 minutes",
    duration: "1 day",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  const wf = {
    id: "wf-lj-wp2",
    product: "learning_journey",
    name: "LJ WP2",
    steps: built.steps.map((step, index) =>
      Object.assign({}, step, { id: "lj-wp2-" + (index + 1) })
    )
  };
  const designStep = wf.steps.find((s) => s.title === "Design Page");
  assert.ok(designStep);
  return { wf, designStep };
}

test("1. first commission with empty context passes continuity", () => {
  const page = twoCommissionPage({ firstContext: "" });
  const errors = design.collectLearningJourneyContinuityErrors(page);
  assert.deepEqual(errors, []);
  assert.equal(design.validateLearningJourneyDesignPage(page).ok, true);
  assert.equal(design.validateLearningJourneyDesignPageForCapture(page).ok, true);
});

test("2. later commission with empty context fails continuity", () => {
  const page = twoCommissionPage({ laterContext: "   " });
  const errors = design.collectLearningJourneyContinuityErrors(page);
  assert.ok(errors.indexOf("commissions[c2].journey_context_text missing") !== -1);
  assert.equal(design.validateLearningJourneyDesignPage(page).ok, true);
  assert.equal(design.validateLearningJourneyDesignPageForCapture(page).ok, false);
});

test("3. later commission with generic continuation only fails", () => {
  const page = twoCommissionPage({ laterContext: GENERIC });
  const errors = design.collectLearningJourneyContinuityErrors(page);
  assert.ok(errors.indexOf("commissions[c2].journey_context_text generic_continuation") !== -1);
});

test("4. generic introductory wording plus meaningful preceding-activity description passes", () => {
  const page = twoCommissionPage({
    laterContext: GENERIC + " " + MEANINGFUL_PRECEDING
  });
  assert.deepEqual(design.collectLearningJourneyContinuityErrors(page), []);
});

test("5. no-recurring-scenario statement alone fails for later commissions", () => {
  const page = twoCommissionPage({ laterContext: NO_SCENARIO });
  const errors = design.collectLearningJourneyContinuityErrors(page);
  assert.ok(
    errors.indexOf("commissions[c2].journey_context_text no_scenario_without_preceding_activity") !==
      -1
  );
});

test("6. no-recurring-scenario statement plus preceding-activity description passes", () => {
  const page = twoCommissionPage({
    laterContext: NO_SCENARIO + " " + MEANINGFUL_PRECEDING
  });
  assert.deepEqual(design.collectLearningJourneyContinuityErrors(page), []);
});

test("7. dependencies without journey context fail for later commissions", () => {
  const page = twoCommissionPage({
    laterContext: "",
    laterDependencies: "c1 / exp_1"
  });
  const errors = design.collectLearningJourneyContinuityErrors(page);
  assert.ok(errors.indexOf("commissions[c2].journey_context_text missing") !== -1);
});

test("8. explicit automatic-response-transfer claims fail", () => {
  const page = twoCommissionPage({ laterContext: AUTO_TRANSFER + " " + MEANINGFUL_PRECEDING });
  const errors = design.collectLearningJourneyContinuityErrors(page);
  assert.ok(errors.indexOf("commissions[c2].automatic_response_access") !== -1);
});

test("9. legitimate learner-owned bring-forward instructions pass", () => {
  const page = twoCommissionPage({ laterContext: BRING_FORWARD });
  assert.deepEqual(design.collectLearningJourneyContinuityErrors(page), []);
});

test("learner-owned retrieval and explicit automatic-access prohibitions pass", () => {
  [
    "Learners retrieve their own earlier responses.",
    "Learners consult their retained work from the previous activity.",
    "PRISM does not automatically transfer learner responses.",
    "Do not assume that earlier responses are automatically available.",
    "Learners retrieve their own earlier responses retrieved from the previous Interactive."
  ].forEach(function (text) {
    const page = twoCommissionPage({ laterSpec: text, laterContext: MEANINGFUL_PRECEDING });
    assert.deepEqual(
      design.collectLearningJourneyContinuityErrors(page),
      [],
      "expected pass for: " + text
    );
  });
});

test("positive automatic-access and inspection claims still fail", () => {
  [
    "PRISM automatically transfers stored answers from the previous component.",
    "Previous learner responses are automatically available.",
    "PRISM has already inspected the previous published resource."
  ].forEach(function (text) {
    const page = twoCommissionPage({ laterSpec: text, laterContext: MEANINGFUL_PRECEDING });
    const errors = design.collectLearningJourneyContinuityErrors(page);
    assert.ok(
      errors.indexOf("commissions[c2].automatic_response_access") !== -1,
      "expected fail for: " + text + " got " + JSON.stringify(errors)
    );
  });
});

test("first commission generic continuation fails; first no-scenario-only is allowed", () => {
  const genericFirst = twoCommissionPage({ firstContext: GENERIC });
  assert.ok(
    design
      .collectLearningJourneyContinuityErrors(genericFirst)
      .indexOf("commissions[c1].journey_context_text generic_continuation") !== -1
  );
  const noScenarioFirst = twoCommissionPage({ firstContext: NO_SCENARIO });
  assert.deepEqual(design.collectLearningJourneyContinuityErrors(noScenarioFirst), []);
});

test("first versus later follows numeric order, not array position", () => {
  const page = twoCommissionPage({
    firstContext: "",
    laterContext: "",
    swapOrders: true
  });
  const errors = design.collectLearningJourneyContinuityErrors(page);
  assert.ok(errors.indexOf("commissions[c1].journey_context_text missing") !== -1);
  assert.equal(errors.indexOf("commissions[c2].journey_context_text missing"), -1);
});

test("10. existing structural validation continues to accept legacy fixtures", () => {
  const legacy = legacyHomeLikePage();
  assert.equal(design.validateLearningJourneyDesignPage(legacy).ok, true);
  assert.ok(design.collectLearningJourneyContinuityErrors(legacy).length > 0);
  assert.equal(design.validateLearningJourneyDesignPageForCapture(legacy).ok, false);
  const fixture = design.buildLearningJourneyDesignPageFixture({});
  assert.equal(fixture.ok, true);
  assert.equal(design.validateLearningJourneyDesignPage(fixture.page).ok, true);
});

test("Run Next storage capture and capture helper reject later empty context consistently", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/learning-journey-design-page.js"]
  });
  const { wf, designStep } = ljWorkflowAndStep();
  const invalid = twoCommissionPage({ laterContext: "" });
  const raw = JSON.stringify(invalid);
  const stored = api.parseLearningJourneyDesignPageCaptureForStorage(raw);
  const runPath = api.parseWorkflowRunPageStructureCaptureForStorage(raw, designStep, wf);
  assert.equal(stored.ok, false);
  assert.equal(runPath.ok, false);
  assert.ok((stored.errors || []).indexOf("commissions[c2].journey_context_text missing") !== -1);
  assert.deepEqual(stored.errors, runPath.errors);

  const valid = twoCommissionPage({
    firstContext: "",
    laterContext: MEANINGFUL_PRECEDING
  });
  const accepted = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(valid),
    designStep,
    wf
  );
  assert.equal(accepted.ok, true, accepted.message || (accepted.errors || []).join("; "));
});

test("author inspection shows labelled escaped fields and empty-state labels", () => {
  const page = twoCommissionPage({
    firstSpec: '<img src=x onerror=alert(1)> Educational job',
    firstContext: "",
    laterContext: MEANINGFUL_PRECEDING,
    laterDependencies: ""
  });
  page.commissions[0].dependencies = "";
  const preview = design.buildLearningJourneyCommissioningPreviewHtml(page, {
    sourceWorkflowId: "wf-lj-wp2"
  });
  assert.equal(preview.ok, true);
  const html = preview.html;
  assert.match(html, /<dt>Educational job<\/dt>/);
  assert.match(html, /<dt>Journey context<\/dt>/);
  assert.match(html, /<dt>Dependencies<\/dt>/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(html, /<img src=x onerror=alert\(1\)>/);
  assert.match(html, /lj-commissioning-preview__empty">Not provided/);
  assert.match(html, /lj-commissioning-preview__empty">None/);
  assert.doesNotMatch(html, /specification_text=/);
  assert.doesNotMatch(html, /journey_context_text=/);
  assert.doesNotMatch(html, /dependencies=/);
  assert.match(html, /Create Expository/);
  assert.match(
    html,
    /data-lj-action="create-product"[^>]*data-lj-commission-id="c1"/
  );
});

test("learner home and ZIP remain free of raw commissioning metadata", () => {
  const page = twoCommissionPage({
    laterContext: "SECRET_JOURNEY_CONTEXT_HOME",
    laterDependencies: "SECRET_DEPENDENCY_HOME"
  });
  page.commissions[0].specification_text = "SECRET_SPEC_HOME_C1";
  const home = ljPackage.buildLearningJourneyHomeHtml(page);
  assert.equal(home.ok, true);
  assert.doesNotMatch(home.html, /SECRET_SPEC_HOME_C1/);
  assert.doesNotMatch(home.html, /SECRET_JOURNEY_CONTEXT_HOME/);
  assert.doesNotMatch(home.html, /SECRET_DEPENDENCY_HOME/);
  assert.doesNotMatch(home.html, /Educational job/);
  assert.doesNotMatch(home.html, /Commissioning contract/);
  assert.doesNotMatch(home.html, /Authoring view/);
});

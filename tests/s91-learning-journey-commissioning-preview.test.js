/**
 * Sprint 91 — Learning Journey Authoring Preview as commissioning interface.
 *
 * product_id learning_journey selects LJ commissioning Preview (not generic learner export).
 * commissions[] drive Create actions; specification prose is not dumped into HTML.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const design = require("../lib/learning-journey-design-page.js");
const family = require("../lib/first-class-workflow-family.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function liveLikeLearningJourneyPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Judging the Credibility of Online Information",
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "You will build and defend a credibility judgement."
      },
      {
        section_id: "exp_1",
        title: "Challenge Your First Impression",
        order: 2,
        exposition: "Start by noticing and questioning your first reaction."
      },
      {
        section_id: "exp_2",
        title: "Build a Better Basis for Judgement",
        order: 3,
        exposition: "Establish a stronger basis before investigating further."
      },
      {
        section_id: "exp_3",
        title: "Learn to Investigate Beyond the Source",
        order: 4,
        exposition: "Practise looking beyond the immediate source."
      },
      {
        section_id: "exp_4",
        title: "Conduct and Weigh a Credibility Investigation",
        order: 5,
        exposition: "Carry out and weigh a fuller credibility investigation."
      },
      {
        section_id: "exp_5",
        title: "Make an Independent Credibility Judgement",
        order: 6,
        exposition: "Form an independent judgement from the evidence so far."
      },
      {
        section_id: "exp_6",
        title: "Defend Your Judgement",
        order: 7,
        exposition: "Defend your judgement with the evidence you gathered."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Challenge Your First Impression",
        product_id: "interactive",
        status: "supported",
        specification_text:
          "LONG SPEC for interactive c1 that must not appear in Preview HTML content.",
        journey_context_text: "SECRET_JOURNEY_CONTEXT_C1",
        dependencies: "SECRET_DEPENDENCY_C1"
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Build a Better Basis for Judgement",
        product_id: "expository",
        status: "supported",
        specification_text: "LONG SPEC for expository c2 SECRET_SPEC_C2",
        journey_context_text: "SECRET_JOURNEY_CONTEXT_C2",
        dependencies: "SECRET_DEPENDENCY_C2"
      },
      {
        commission_id: "c3",
        section_id: "exp_3",
        order: 3,
        title: "Learn to Investigate Beyond the Source",
        product_id: "interactive",
        status: "supported",
        specification_text: "LONG SPEC for interactive c3 SECRET_SPEC_C3",
        journey_context_text: "SECRET_JOURNEY_CONTEXT_C3",
        dependencies: "SECRET_DEPENDENCY_C3"
      },
      {
        commission_id: "c4",
        section_id: "exp_4",
        order: 4,
        title: "Conduct and Weigh a Credibility Investigation",
        product_id: "",
        status: "unsupported",
        specification_text: "LONG SPEC unsupported c4 SECRET_SPEC_C4",
        journey_context_text: "SECRET_JOURNEY_CONTEXT_C4",
        dependencies: "SECRET_DEPENDENCY_C4"
      },
      {
        commission_id: "c5",
        section_id: "exp_5",
        order: 5,
        title: "Make an Independent Credibility Judgement",
        product_id: "",
        status: "unsupported",
        specification_text: "LONG SPEC unsupported c5 SECRET_SPEC_C5",
        journey_context_text: "SECRET_JOURNEY_CONTEXT_C5",
        dependencies: "SECRET_DEPENDENCY_C5"
      },
      {
        commission_id: "c6",
        section_id: "exp_6",
        order: 6,
        title: "Defend Your Judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "LONG SPEC assessment c6 SECRET_SPEC_C6",
        journey_context_text: "SECRET_JOURNEY_CONTEXT_C6",
        dependencies: "SECRET_DEPENDENCY_C6"
      }
    ],
    learning_journey: {
      design_intent: "Author design intent only",
      continuity: "Continuity sidecar only"
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: [
        "learning_requirements",
        "learning_progression",
        "learning_elements",
        "learning_commissions",
        "design_page"
      ],
      calls_model: true
    }
  };
}

test("product_id learning_journey selects Learning Journey commissioning Preview treatment", () => {
  const page = liveLikeLearningJourneyPage();
  assert.equal(design.isLearningJourneyDesignPage(page), true);
  assert.equal(design.validateLearningJourneyDesignPage(page).ok, true);
  const preview = design.buildLearningJourneyCommissioningPreviewHtml(page, {
    sourceWorkflowId: "wf-lj-live"
  });
  assert.equal(preview.ok, true);
  assert.match(preview.html, /lj-commissioning-preview/);
  assert.match(preview.html, /data-product-id="learning_journey"/);
  assert.match(preview.html, /Authoring view/);
});

test("journey_intro and experience sections render in intended order with section↔commission association", () => {
  const page = liveLikeLearningJourneyPage();
  const preview = design.buildLearningJourneyCommissioningPreviewHtml(page, {
    sourceWorkflowId: "wf-lj-live"
  });
  const html = preview.html;
  assert.match(html, /data-section-id="journey_intro"/);
  assert.match(html, /About this journey/);
  assert.match(html, /You will build and defend a credibility judgement/);

  const experienceOrder = [
    "Challenge Your First Impression",
    "Build a Better Basis for Judgement",
    "Learn to Investigate Beyond the Source",
    "Conduct and Weigh a Credibility Investigation",
    "Make an Independent Credibility Judgement",
    "Defend Your Judgement"
  ];
  let cursor = -1;
  experienceOrder.forEach((title) => {
    const next = html.indexOf(title);
    assert.ok(next > cursor, "expected ordered title: " + title);
    cursor = next;
  });

  assert.match(
    html,
    /data-section-id="exp_1"[\s\S]*data-commission-id="c1"[\s\S]*data-product-id="interactive"/
  );
  assert.match(
    html,
    /data-section-id="exp_2"[\s\S]*data-commission-id="c2"[\s\S]*data-product-id="expository"/
  );
  assert.match(
    html,
    /data-section-id="exp_6"[\s\S]*data-commission-id="c6"[\s\S]*data-product-id="assessment_pack"/
  );
});

test("supported acceptsCommission commissions expose Create actions with stable identity", () => {
  assert.equal(family.productAcceptsCommission("interactive"), true);
  assert.equal(family.productAcceptsCommission("expository"), true);
  assert.equal(family.productAcceptsCommission("assessment_pack"), true);

  const preview = design.buildLearningJourneyCommissioningPreviewHtml(liveLikeLearningJourneyPage(), {
    sourceWorkflowId: "wf-lj-live"
  });
  const html = preview.html;
  assert.match(html, /Create Interactive/);
  assert.match(html, /Create Expository/);
  assert.match(html, /Create Assessment Pack/);
  assert.match(
    html,
    /data-lj-action="create-product"[^>]*data-lj-commission-id="c1"[^>]*data-lj-section-id="exp_1"[^>]*data-lj-product-id="interactive"[^>]*data-lj-source-workflow-id="wf-lj-live"/
  );
  assert.match(
    html,
    /data-lj-commission-id="c2"[^>]*data-lj-product-id="expository"/
  );
  assert.match(
    html,
    /data-lj-commission-id="c6"[^>]*data-lj-product-id="assessment_pack"/
  );
  assert.doesNotMatch(html, /specification_text=/);
  assert.doesNotMatch(html, /\?commission=/);
});

test("unsupported commissions remain visible without Create actions", () => {
  const preview = design.buildLearningJourneyCommissioningPreviewHtml(liveLikeLearningJourneyPage());
  const html = preview.html;
  assert.match(html, /Conduct and Weigh a Credibility Investigation/);
  assert.match(html, /Make an Independent Credibility Judgement/);
  assert.match(html, /data-commission-id="c4"[^>]*data-status="unsupported"/);
  assert.match(html, /data-commission-id="c5"[^>]*data-status="unsupported"/);
  assert.match(html, /Unsupported in PRISM/);
  assert.doesNotMatch(html, /data-lj-commission-id="c4"/);
  assert.doesNotMatch(html, /data-lj-commission-id="c5"/);
  assert.equal((html.match(/Create Interactive/g) || []).length, 2);
});

test("specification_text / journey_context_text / dependencies are not dumped into Preview HTML", () => {
  const page = liveLikeLearningJourneyPage();
  const preview = design.buildLearningJourneyCommissioningPreviewHtml(page);
  const html = preview.html;
  assert.doesNotMatch(html, /SECRET_SPEC_C2/);
  assert.doesNotMatch(html, /SECRET_SPEC_C4/);
  assert.doesNotMatch(html, /SECRET_JOURNEY_CONTEXT_C1/);
  assert.doesNotMatch(html, /SECRET_DEPENDENCY_C6/);
  assert.doesNotMatch(html, /LONG SPEC/);
  assert.doesNotMatch(html, /Author design intent only/);
  assert.doesNotMatch(html, /Continuity sidecar only/);
});

test("Authoring Preview HTML path uses Learning Journey commissioning treatment for LJ pages", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-design-page.js"
    ]
  });
  assert.equal(typeof api.runUtilityPageExportPipelineForTest, "function");
  const rendered = api.runUtilityPageExportPipelineForTest(liveLikeLearningJourneyPage(), {
    skipWorkflowAssembly: true,
    applyCompositionValidation: false
  });
  assert.equal(rendered.error, null, rendered.error || "");
  assert.equal(rendered.learningJourneyCommissioningPreview, true);
  assert.match(rendered.html, /lj-commissioning-preview/);
  assert.match(rendered.html, /Create Interactive/);
  assert.match(rendered.html, /Create Expository/);
  assert.match(rendered.html, /Create Assessment Pack/);
  assert.match(rendered.html, /Unsupported in PRISM/);
  assert.doesNotMatch(rendered.html, /SECRET_SPEC_C2/);
  assert.doesNotMatch(rendered.html, /util-learner-renderer-vnext/);
});

test("ordinary non-Learning-Journey page rendering remains on shared learner path", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-design-page.js"
    ]
  });
  const interactivePage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Bayes Interactive",
    activities: [],
    page_synthesis: {
      overview: { body: "Overview body for Bayes." }
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"]
    }
  };
  const rendered = api.runUtilityPageExportPipelineForTest(interactivePage, {
    skipWorkflowAssembly: true,
    applyCompositionValidation: false
  });
  assert.equal(!!rendered.learningJourneyCommissioningPreview, false);
  if (rendered && rendered.html) {
    assert.doesNotMatch(rendered.html, /lj-commissioning-preview/);
    assert.doesNotMatch(rendered.html, /Create Interactive/);
  } else {
    assert.ok(rendered && rendered.error);
    assert.doesNotMatch(String(rendered.error || ""), /Learning Journey commissioning/i);
  }
});

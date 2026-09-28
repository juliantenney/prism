/**
 * Sprint 88 — Assessment Pack starting points and product-output source.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const family = require("../lib/first-class-workflow-family.js");

const TOPIC = [
  "Generate Learning Content",
  "Model Knowledge",
  "Define Learning Outcomes",
  "Plan Assessment Evidence",
  "Author Assessment Components",
  "Design Page"
];

const SOURCE = ["Normalize Content"].concat(TOPIC);

const outcomes = {
  learning_outcomes: [{ id: "LO1", statement: "Explain Bayes' theorem." }]
};

const pageCapture = '{"artifact_type":"page","title":"Completed resource"}';

function build(overrides) {
  return family.buildFirstClassWorkflowFamily(
    Object.assign(
      {
        ldCreateOutputType: "assessment_pack",
        focus: "Bayes theorem",
        startingPoint: "topic",
        purpose: "formative",
        diagnosticIntent: false,
        weighting: false,
        componentCount: 6
      },
      overrides || {}
    )
  );
}

function productWorkflow(product, legacyType) {
  return {
    id: product + "-1",
    product: product,
    ldCreateOutputType: legacyType,
    steps: [
      { id: "lo", title: "Define Learning Outcomes", canonical_step_id: "step_define_learning_outcomes" },
      { id: "page", title: "Design Page", canonical_step_id: "step_design_page" },
      { id: "extra", title: product === "expository" ? "Expository Journey Plan" : "Design Episode Plan" }
    ]
  };
}

test("topic Assessment Pack is independent and does not copy another product", () => {
  const built = build({ authoritativeLearningOutcomes: outcomes, sourceWorkflowId: "should-not-switch" });
  assert.equal(built.ok, true);
  assert.equal(built.callsModel, false);
  assert.deepEqual(built.titles, TOPIC);
  assert.equal(built.identity.startingPoint, "topic");
  assert.equal(built.identity.sourceWorkflowId, undefined);
  assert.equal(built.titles[built.titles.length - 1], "Design Page");
  assert.equal(built.titles.includes("Design Episode Plan"), false);
  assert.equal(built.steps[0].promptBody, undefined);
  assert.doesNotMatch(built.steps[3].promptBody, /Explain Bayes/);
});

test("authoritative source prefixes Normalize Content", () => {
  const built = build({ startingPoint: "authoritative_source" });
  assert.deepEqual(built.titles, SOURCE);
  assert.equal(built.titles[built.titles.length - 1], "Design Page");
});

test("Interactive product output is source material, not saved Learning Outcomes", () => {
  const workflow = productWorkflow("interactive", "self_study_resource");
  const read = family.readFirstClassProductOutput(workflow, {
    lo: JSON.stringify(outcomes),
    page: pageCapture
  });
  assert.equal(read.ok, true);
  assert.equal(read.product, "interactive");
  assert.equal(read.sourceText, pageCapture);
  assert.equal(read.stepId, "page");
  const built = build({
    startingPoint: "product_output",
    sourceWorkflowId: workflow.id,
    sourceProduct: read.product,
    authoritativeLearningOutcomes: outcomes
  });
  assert.deepEqual(built.titles, SOURCE);
  assert.equal(built.identity.sourceWorkflowId, workflow.id);
  assert.equal(built.identity.sourceProduct, "interactive");
  assert.equal(built.titles.includes("Design Episode Plan"), false);
  assert.doesNotMatch(built.steps[4].promptBody, /Explain Bayes/);
  assert.equal(built.steps.length, SOURCE.length);
});

test("Expository product output is source material on the same pipeline", () => {
  const workflow = productWorkflow("expository", "expository_resource");
  const read = family.readFirstClassProductOutput(workflow, { page: pageCapture });
  assert.equal(read.ok, true);
  assert.equal(read.product, "expository");
  const built = build({
    startingPoint: "product_output",
    sourceWorkflowId: workflow.id,
    sourceProduct: "expository"
  });
  assert.deepEqual(built.titles, SOURCE);
  assert.equal(built.identity.sourceProduct, "expository");
  assert.equal(built.titles.includes("Expository Journey Plan"), false);
});

test("a Learning Outcomes capture is not a product output", () => {
  const workflow = productWorkflow("interactive", "self_study_resource");
  const read = family.readFirstClassProductOutput(workflow, { lo: JSON.stringify(outcomes) });
  assert.equal(read.ok, false);
  assert.equal(read.code, "no_product_output");
});

test("target component count reaches planning and authoring without changing topology", () => {
  const small = build({ componentCount: 4, purpose: "formative", diagnosticIntent: false, weighting: false });
  const large = build({
    componentCount: 12,
    purpose: "summative",
    diagnosticIntent: true,
    weighting: true,
    startingPoint: "topic"
  });
  assert.deepEqual(small.titles, large.titles);
  const plan = small.steps[3].promptBody;
  const author = small.steps[4].promptBody;
  assert.match(plan, /Component count: exactly 4/);
  assert.match(plan, /Honour this number/);
  assert.match(plan, /Component mix: PRISM decides/);
  assert.match(author, /Author exactly 4 components/);
  assert.match(author, /Do not rebalance the mix/);
  assert.match(large.steps[3].promptBody, /Component count: exactly 12/);
  assert.match(large.steps[3].promptBody, /Assessment intent: pretest_diagnostic/);
  assert.match(large.steps[3].promptBody, /include a weight/);
  assert.deepEqual(build({ startingPoint: "authoritative_source", componentCount: 3 }).titles, SOURCE);
  assert.deepEqual(build({ startingPoint: "product_output", sourceWorkflowId: "x", componentCount: 9 }).titles, SOURCE);
});

test("supported forms are checkable and open responses are not commissioned", () => {
  const built = build();
  const author = built.steps[4].promptBody;
  const plan = built.steps[3].promptBody;
  assert.match(author, /single_answer_mcq/);
  assert.match(author, /multiple_answer_mcq/);
  assert.match(author, /ordering/);
  assert.match(author, /classification/);
  assert.match(author, /matching/);
  assert.match(author, /Do not author short constructed responses/);
  assert.match(author, /Do not merely restate the order/);
  assert.match(author, /Do not merely name which item belongs where/);
  assert.match(author, /Do not merely restate the pairs/);
  assert.match(author, /Do not copy learning-outcome statements/);
  assert.match(author, /Do not write author or stage directions such as 'After the attempt'/);
  assert.match(plan, /ordering/);
  assert.equal(author.indexOf("short_constructed_response set auto_checkable false"), -1);
  assert.equal(built.steps[3].outputName, "evidence_plan");
  assert.equal(built.steps[4].outputName, "assessment_pack");
});

test("Interactive and Expository families stay unchanged", () => {
  const interactive = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Topic",
    startingArtefact: "generate_from_topic"
  });
  const expository = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "expository_resource",
    focus: "Topic",
    startingArtefact: "generate_from_topic"
  });
  const interactiveSource = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Topic",
    startingArtefact: "provided_source_content"
  });
  assert.equal(interactive.titles.includes("Plan Assessment Evidence"), false);
  assert.equal(expository.titles.includes("Author Assessment Components"), false);
  assert.equal(interactive.titles.length, 8);
  assert.equal(expository.titles.length, 7);
  assert.equal(interactiveSource.titles[0], "Normalize Content");
  assert.equal(interactiveSource.titles[interactiveSource.titles.length - 1], "Design Page");
});

test("reading a saved graph does not rebuild it", () => {
  const saved = {
    id: "old",
    product: "assessment_pack",
    startingPoint: "existing_interactive_resource",
    steps: [{ title: "Plan Assessment Evidence" }, { title: "Author Assessment Components" }]
  };
  const before = JSON.stringify(saved);
  const identity = family.readFirstClassIdentity(saved);
  assert.equal(JSON.stringify(saved), before);
  assert.equal(identity.product, "assessment_pack");
  assert.equal(identity.startingPoint, "existing_interactive_resource");
  assert.equal(saved.steps.length, 2);
});

/**
 * Sprint 96 — commissioning prevention: published titles + no bare cN in learner prose.
 *
 * Proves the narrow Learning Journey → constituent handoff supplies the
 * commission_id → published-title directory and that shared commissioning
 * instructions prohibit internal ids in learner-facing copy for Interactive
 * and Assessment Pack (and shared composers used by Expository / Situated Task).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const intake = require("../lib/first-class-commission-intake.js");
const design = require("../lib/learning-journey-design-page.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const TITLE_HEADING =
  "PUBLISHED LEARNING JOURNEY RESOURCE TITLES (authoritative for learner-facing cross-resource references)";
const CONSTRAINT_HEADING = "CROSS-RESOURCE REFERENCES IN LEARNER-FACING PROSE";

const TITLE_C3 = "From Evidence to Justified Action";
const TITLE_C4 = "Reconsidering a Provisional Decision";
const TITLE_C5 = "Independent Evidence-Informed Judgement";
const TITLE_C6 = "Evaluating the Quality of Independent Judgement";

function loadApi() {
  return loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-commission-intake.js",
      "lib/expository-sibling-prompts.js",
      "lib/situated-task-sibling-prompts.js",
      "lib/situated-task-design-page.js",
      "lib/learning-journey-sibling-prompts.js",
      "lib/learning-journey-design-page.js"
    ]
  });
}

function duuStylePage() {
  const built = design.buildLearningJourneyDesignPageFixture({
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "A journey about deciding under uncertainty."
      },
      {
        section_id: "exp_c3",
        title: TITLE_C3,
        order: 2,
        exposition: "Make a provisional library recommendation."
      },
      {
        section_id: "exp_c4",
        title: TITLE_C4,
        order: 3,
        exposition: "Revisit the recommendation with new evidence."
      },
      {
        section_id: "exp_c5",
        title: TITLE_C5,
        order: 4,
        exposition: "Produce an independent traffic-management judgement."
      },
      {
        section_id: "exp_c6",
        title: TITLE_C6,
        order: 5,
        exposition: "Evaluate the quality of that independent judgement."
      }
    ],
    commissions: [
      {
        commission_id: "c3",
        section_id: "exp_c3",
        order: 1,
        product_id: "interactive",
        status: "supported",
        title: TITLE_C3,
        specification_text:
          "Educational job: Choose and justify a provisional library policy using evaluated evidence. Learners should retain their decision for later reconsideration.",
        journey_context_text:
          "Established scenario: university library opening hours. Learners previously evaluated evidence.",
        dependencies: "Requires c2."
      },
      {
        commission_id: "c4",
        section_id: "exp_c4",
        order: 2,
        product_id: "interactive",
        status: "supported",
        title: TITLE_C4,
        specification_text:
          "Educational job: Reconsider the provisional library recommendation using later evidence.",
        journey_context_text:
          "Bring forward the learner's own provisional recommendation and justification.",
        dependencies: "Requires c3. Bring forward the learner's own provisional recommendation."
      },
      {
        commission_id: "c5",
        section_id: "exp_c5",
        order: 3,
        product_id: "assessment_pack",
        status: "supported",
        title: TITLE_C5,
        specification_text:
          "Educational job: Write an independent traffic-management judgement under uncertainty.",
        journey_context_text:
          "Transfer context: independent school traffic-management assessment.",
        dependencies: "Requires c4."
      },
      {
        commission_id: "c6",
        section_id: "exp_c6",
        order: 4,
        product_id: "assessment_pack",
        status: "supported",
        title: TITLE_C6,
        specification_text:
          "Educational job: Evaluate the quality of the learner's independent traffic-management judgement.",
        journey_context_text:
          "Bring forward the learner's own independent traffic-management judgement for self-evaluation.",
        dependencies: "Requires c5. Bring forward the learner's own traffic-management judgement."
      }
    ]
  });
  assert.equal(built.ok, true, (built.errors || []).join("; "));
  return built.page;
}

function commissionedWorkflow(api, productId, extras) {
  const page = duuStylePage();
  const commissionId = extras && extras.commissionId ? extras.commissionId : "c4";
  const commission = design.resolveCommissionFromPage(page, commissionId);
  assert.ok(commission, "commission missing: " + commissionId);
  const envelope = design.commissionToIntakeEnvelope(commission, page, {
    sourceJourneyWorkflowId: "wf-lj-duu",
    focus: commission.title
  });
  const result = intake.intakeCommission(
    Object.assign({}, envelope, { productId: productId }),
    productId === "interactive" ? { ldCreateOutputType: "self_study_resource" } : {}
  );
  assert.equal(result.ok, true, result.code || "");
  const steps = (result.family.steps || []).map(function (row, i) {
    return Object.assign({}, row, { id: "s" + i });
  });
  const wf = {
    id: "wf-" + productId + "-" + commissionId + "-title-refs",
    product: productId,
    sourceWorkflowId: "wf-lj-duu",
    sourceCommissionId: envelope.sourceCommissionId,
    steps: steps,
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, result.family.deliverySeed, { topic: commission.title }),
      initialBrief: {
        topic: commission.title,
        commissionSpecification: envelope.specificationText,
        journeyContextText: envelope.journeyContextText,
        dependencies: envelope.dependencies,
        commissionDependencies: envelope.dependencies,
        publishedTitleDirectory: envelope.publishedTitleDirectory,
        commissionPublishedTitles: envelope.commissionPublishedTitles
      }
    }
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  return { result: result, wf: wf, envelope: envelope, page: page, commission: commission };
}

test("design-page title directory maps DUU commission ids to published titles", () => {
  const page = duuStylePage();
  const directory = design.buildCommissionPublishedTitleDirectory(page);
  assert.equal(directory.entries.length, 4);
  assert.deepEqual(directory.entries.find((e) => e.commissionId === "c4"), {
    commissionId: "c4",
    title: TITLE_C4
  });
  assert.deepEqual(directory.entries.find((e) => e.commissionId === "c5"), {
    commissionId: "c5",
    title: TITLE_C5
  });
  assert.match(directory.text, new RegExp(TITLE_HEADING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(
    directory.text,
    new RegExp('Internal id "c4": published title "' + TITLE_C4 + '"')
  );
  assert.match(
    directory.text,
    new RegExp('Internal id "c5": published title "' + TITLE_C5 + '"')
  );
});

test("C3 commission generator brief receives C4 published title", () => {
  const { api } = loadApi();
  const { wf, envelope } = commissionedWorkflow(api, "interactive", { commissionId: "c3" });
  assert.equal(envelope.sourceCommissionId, "c3");
  assert.equal(envelope.dependencies, "Requires c2.");
  assert.match(envelope.publishedTitleDirectory, new RegExp(TITLE_C4));

  const brief = api.composeCommissionedOriginalBrief(wf);
  assert.match(brief, new RegExp(TITLE_HEADING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(brief, new RegExp('Internal id "c4": published title "' + TITLE_C4 + '"'));
  assert.match(brief, /CROSS-RESOURCE REFERENCES IN LEARNER-FACING PROSE/);
  assert.match(brief, /from PUBLISHED LEARNING JOURNEY RESOURCE TITLES/);
  assert.equal(wf.workflowBriefResolution.resolvedFactors.commission_dependencies, "Requires c2.");

  const bringForward = api.composeCommissionedLearnerFacingBringForwardInstruction(wf);
  assert.match(bringForward, new RegExp(CONSTRAINT_HEADING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(bringForward, /never by bare commission ids such as c3 or c4/i);
});

test("C6 commission generator brief receives C5 published title", () => {
  const { api } = loadApi();
  const { wf, envelope } = commissionedWorkflow(api, "assessment_pack", { commissionId: "c6" });
  assert.equal(envelope.sourceCommissionId, "c6");
  assert.match(envelope.dependencies, /Requires c5/);
  assert.match(envelope.publishedTitleDirectory, new RegExp(TITLE_C5));

  const brief = api.composeCommissionedOriginalBrief(wf);
  assert.match(brief, new RegExp(TITLE_HEADING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(brief, new RegExp('Internal id "c5": published title "' + TITLE_C5 + '"'));
  assert.match(brief, /Requires c5/);
  assert.match(brief, /Dependency identifiers are machine-readable metadata only/);
  assert.equal(
    wf.workflowBriefResolution.resolvedFactors.commission_dependencies,
    envelope.dependencies
  );

  const honour = api.composeCommissionedContextHonourInstruction(wf);
  assert.match(honour, /name earlier resources by published title, never by bare commission ids/i);
  const bringForward = api.composeCommissionedLearnerFacingBringForwardInstruction(wf);
  assert.match(bringForward, /names any referenced journey resource by published title/i);
});

test("commission intake preserves dependency ids while exposing titles in instructions", () => {
  const page = duuStylePage();
  const commission = design.resolveCommissionFromPage(page, "c4");
  const envelope = design.commissionToIntakeEnvelope(commission, page, {
    sourceJourneyWorkflowId: "wf-lj-duu"
  });
  assert.equal(
    envelope.dependencies,
    "Requires c3. Bring forward the learner's own provisional recommendation."
  );
  const result = intake.intakeCommission(
    Object.assign({}, envelope, { productId: "interactive" }),
    { ldCreateOutputType: "self_study_resource" }
  );
  assert.equal(result.ok, true, result.code || "");
  assert.equal(result.family.deliverySeed.commission_dependencies, envelope.dependencies);
  assert.match(result.family.deliverySeed.commission_published_titles, new RegExp(TITLE_C4));
  assert.match(result.createSeed.publishedTitleDirectory, new RegExp(TITLE_C3));
});

test("Interactive and Assessment Pack composers share title map and constraint", () => {
  const { api } = loadApi();
  const interactive = commissionedWorkflow(api, "interactive", { commissionId: "c4" });
  const assessment = commissionedWorkflow(api, "assessment_pack", { commissionId: "c6" });

  const interactiveBrief = api.composeCommissionedOriginalBrief(interactive.wf);
  assert.match(interactiveBrief, new RegExp(TITLE_C4));
  assert.match(interactiveBrief, /must never appear in learner-facing prose/i);

  const assessmentBrief = api.composeCommissionedOriginalBrief(assessment.wf);
  assert.match(assessmentBrief, new RegExp(TITLE_C5));
  assert.match(assessmentBrief, /artefact contracts, state keys/i);
});

test("when published titles are unavailable, instructions forbid inventing titles or exposing cN", () => {
  const { api } = loadApi();
  const wf = {
    id: "wf-partial",
    product: "interactive",
    workflowBriefResolution: {
      resolvedFactors: {
        commission_specification: "Educational job: Reconsider a decision.",
        journey_context: "Learners previously made a provisional recommendation.",
        commission_dependencies: "Requires c3."
      },
      initialBrief: {
        commissionSpecification: "Educational job: Reconsider a decision.",
        journeyContextText: "Learners previously made a provisional recommendation.",
        dependencies: "Requires c3."
      }
    }
  };
  const brief = api.composeCommissionedOriginalBrief(wf);
  assert.doesNotMatch(brief, /PUBLISHED LEARNING JOURNEY RESOURCE TITLES/);
  assert.match(brief, /CROSS-RESOURCE REFERENCES IN LEARNER-FACING PROSE/);
  assert.match(brief, /do not invent a title/i);
  assert.match(brief, /do not expose internal commission identifiers/i);
  assert.match(brief, /natural generic reference/i);
  assert.match(brief, /Requires c3/);

  const constraint = api.composeLearnerFacingCrossResourceReferenceConstraint(false);
  assert.match(constraint, /natural generic reference/i);
  assert.doesNotMatch(constraint, /from PUBLISHED LEARNING JOURNEY RESOURCE TITLES/);
});

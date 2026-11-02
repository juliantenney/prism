/**
 * Sprint 94 WP5 — Interactive DLA V2 Copilot-bound prompt delivery.
 *
 * resolveStepPromptText attaches the commission brief and WP4/WP5 instructions,
 * but DLA V2 Copy discards that body. This suite asserts the final Copilot
 * prompt assembled via the canonical DLA path.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const intake = require("../lib/first-class-commission-intake.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const SPEC_REUSE =
  "Educational job: Reconsider the study-provision choice using new evidence.";
const JOURNEY_REUSE =
  "Established scenario: learners choose among longer library opening hours, additional study spaces, and improved online support. Earlier they recorded an initial judgement. Bring forward that learner-owned initial judgement and use it when weighing the new evidence.";
const DEPS_REUSE =
  "Requires c1. Bring forward the learner's own initial judgement from the opening Interactive.";
const CORE_DLA =
  "Populate executable learning_activities. Each activity MUST include activity_preamble.";

const HONOUR_HEADING = "AUTHORITATIVE COMMISSION CONTEXT";
const WP5_HEADING = "LEARNER-FACING BRING-FORWARD";
const DLA_ROLE_HEADING = "## 1. DLA ROLE AND AUTHORITY";
const DLA_OUTPUT_HEADING = "## 10. OUTPUT CONTRACT AND SHAPE";

function loadApi() {
  return loadPrismAppJsTestApi({
    extraLibs: [
      "lib/ld-dla-page-enrich-contract.js",
      "lib/first-class-commission-intake.js",
      "lib/expository-sibling-prompts.js",
      "lib/situated-task-sibling-prompts.js",
      "lib/situated-task-design-page.js",
      "lib/learning-journey-sibling-prompts.js"
    ]
  });
}

function countHeading(text, heading) {
  const re = new RegExp("^" + heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "gm");
  return (String(text || "").match(re) || []).length;
}

function countLiteral(text, needle) {
  return String(text || "").split(needle).length - 1;
}

function enableInteractiveDlaV2(wf) {
  wf.pageEnrichmentV2 = true;
  wf.partialPageOutputs = true;
  wf.workflowOutputSpec = Object.assign({}, wf.workflowOutputSpec || {}, {
    pageEnrichmentV2: true,
    partialPageOutputs: true
  });
  return wf;
}

function dlaCopyStep(wf) {
  const step = (wf.steps || []).find(function (row) {
    return String(row.title || "") === "Design Learning Activities";
  });
  assert.ok(step, "missing Design Learning Activities");
  return Object.assign({}, step, {
    canonical_step_id: "step_design_learning_activities",
    canonicalStepId: "step_design_learning_activities",
    outputName: "page",
    prompt_source_type: "local_override",
    override_prompt_body: CORE_DLA
  });
}

function commissionedInteractive(api, tag) {
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC_REUSE,
    journeyContextText: JOURNEY_REUSE,
    dependencies: DEPS_REUSE,
    sourceJourneyWorkflowId: "wf-lj",
    sourceCommissionId: "c2",
    focus: "Compare study-provision options"
  });
  assert.equal(result.ok, true, result.code || "");
  const wf = enableInteractiveDlaV2({
    id: "wf-c2-interactive-dla-v2-" + String(tag || "copy"),
    product: "interactive",
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c2",
    steps: (result.family.steps || []).map(function (row, i) {
      return Object.assign({}, row, { id: "s" + i });
    }),
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, result.family.deliverySeed, {
        topic: "Compare study-provision options"
      }),
      initialBrief: {
        topic: "Compare study-provision options",
        commissionSpecification: SPEC_REUSE,
        journeyContextText: JOURNEY_REUSE,
        dependencies: DEPS_REUSE,
        commissionDependencies: DEPS_REUSE
      }
    }
  });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  return wf;
}

function standaloneInteractive(api) {
  const wf = enableInteractiveDlaV2({
    id: "wf-solo-interactive-dla-v2",
    product: "interactive",
    steps: [
      {
        id: "dla_step",
        title: "Design Learning Activities",
        canonical_step_id: "step_design_learning_activities",
        outputName: "page"
      }
    ],
    workflowBriefResolution: {
      resolvedFactors: { topic: "Bayes theorem" },
      initialBrief: { topic: "Bayes theorem" }
    }
  });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  return wf;
}

function assertSprint94BlocksOnce(text) {
  const body = String(text || "");
  assert.equal(countHeading(body, "COMMISSION SPECIFICATION"), 1);
  assert.equal(countHeading(body, "LEARNING JOURNEY CONTEXT"), 1);
  assert.equal(countHeading(body, "EDUCATIONAL DEPENDENCIES (prior experience handoff)"), 1);
  assert.equal(countHeading(body, HONOUR_HEADING), 1);
  assert.equal(countHeading(body, WP5_HEADING), 1);
  assert.match(body, /COMMISSION SPECIFICATION\nEducational job: Reconsider the study-provision choice/);
  assert.match(body, /longer library opening hours/);
  assert.match(body, /additional study spaces/);
  assert.match(body, /improved online support/);
  assert.match(body, /Requires c1/);
  assert.match(body, /only when the commission explicitly requires learners to reuse their own earlier work/);
  assert.match(body, /If you completed the earlier activity, revisit/);
  assert.match(body, /Avoid implying that PRISM automatically transfers learner responses/);
  assert.match(body, /first relevant activity's existing activity_preamble/);
  assert.doesNotMatch(
    body,
    /learner-state transfer is provided|transfers prior responses automatically|inspected previous published|stored answers are available/i
  );
}

function assertCanonicalDlaContractIntact(text) {
  const body = String(text || "");
  assert.equal(countLiteral(body, DLA_ROLE_HEADING), 1);
  assert.match(body, new RegExp("^" + DLA_OUTPUT_HEADING.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "m"));
  assert.match(body, /partial v2 page artefact for DLA-owned fields only/);
  assert.match(body, /Do not return a full-page replay/);
  assert.match(body, /FINAL SILENT PRE-EMIT CHECK \(P02\)/);
}

test("commissioned Interactive DLA V2 Copy includes Sprint 94 blocks once without restoring the discarded core prompt", () => {
  const { api } = loadApi();
  const wf = commissionedInteractive(api, "copy");
  const step = dlaCopyStep(wf);
  const copy = api.buildWorkflowStepInstructions(step, 2, null);
  assert.ok(copy && String(copy).trim(), "Copy prompt was empty");
  assertSprint94BlocksOnce(copy);
  assertCanonicalDlaContractIntact(copy);
  assert.match(copy, /STEP 3 OUTPUT: page/);
  assert.match(copy, /Do NOT emit a standalone learning_activities artefact|partial page artefact containing only DLA-owned fields/);
  assert.doesNotMatch(copy, /Here is the core prompt for this step/);
  assert.doesNotMatch(copy, /Populate executable learning_activities/);
  const productionAt = copy.indexOf("## 4. LEARNER PRODUCTION");
  const briefAt = copy.indexOf("COMMISSION SPECIFICATION");
  const honourAt = copy.indexOf(HONOUR_HEADING);
  const wp5At = copy.indexOf(WP5_HEADING);
  const outputAt = copy.indexOf(DLA_OUTPUT_HEADING);
  assert.ok(productionAt >= 0 && briefAt > productionAt, "commission brief must land in productionSlot");
  assert.ok(honourAt > briefAt, "honour must follow the labelled brief");
  assert.ok(wp5At > honourAt, "bring-forward must follow honour");
  assert.ok(outputAt > wp5At, "canonical output contract must remain after productionSlot");
});

test("assembleLiveDlaCanonicalPrompt and Copilot schema callers receive the same commissioned context", () => {
  const { api } = loadApi();
  const wf = commissionedInteractive(api, "assembler");
  const step = dlaCopyStep(wf);
  const live = api.assembleLiveDlaCanonicalPrompt(
    {
      stepCanonicalStepId: "step_design_learning_activities",
      stepCanonicalTitle: "Design Learning Activities",
      stepTitle: "Design Learning Activities"
    },
    wf
  );
  const schema = api.buildDlaV2CopilotSchemaInstructions(wf, step);
  [live, schema].forEach(function (text) {
    assertSprint94BlocksOnce(text);
    assertCanonicalDlaContractIntact(text);
  });
  assert.equal(
    live.indexOf("COMMISSION SPECIFICATION") >= 0,
    schema.indexOf("COMMISSION SPECIFICATION") >= 0
  );
});

test("standalone Interactive DLA V2 Copy omits Sprint 94 commission blocks", () => {
  const { api } = loadApi();
  const wf = standaloneInteractive(api);
  const step = dlaCopyStep(wf);
  const copy = api.buildWorkflowStepInstructions(step, 2, null);
  assert.ok(copy && String(copy).trim(), "standalone Copy prompt was empty");
  assertCanonicalDlaContractIntact(copy);
  assert.equal(countHeading(copy, "COMMISSION SPECIFICATION"), 0);
  assert.equal(countHeading(copy, "LEARNING JOURNEY CONTEXT"), 0);
  assert.equal(countHeading(copy, HONOUR_HEADING), 0);
  assert.equal(countHeading(copy, WP5_HEADING), 0);
  const live = api.assembleLiveDlaCanonicalPrompt(
    {
      stepCanonicalStepId: "step_design_learning_activities",
      stepTitle: "Design Learning Activities"
    },
    wf
  );
  assert.equal(countHeading(live, HONOUR_HEADING), 0);
  assert.equal(countHeading(live, WP5_HEADING), 0);
  assert.equal(countHeading(live, "COMMISSION SPECIFICATION"), 0);
});

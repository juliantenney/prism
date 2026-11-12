/**
 * My Workflows list: product type label + compact authoring status.
 */

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const presentation = require("../lib/workflow-list-presentation.js");
const family = require("../lib/first-class-workflow-family.js");

function designPageSteps() {
  return [
    { id: "s1", title: "Learning Outcomes", canonical_step_id: "step_learning_outcomes" },
    { id: "s2", title: "Design Episode Plan", canonical_step_id: "step_design_episode_plan" },
    { id: "s3", title: "Design Learning Activities", canonical_step_id: "step_design_learning_activities" },
    { id: "s4", title: "Generate Activity Materials", canonical_step_id: "step_generate_activity_materials" },
    { id: "s5", title: "Construct Learning Sequence", canonical_step_id: "step_construct_learning_sequence" },
    { id: "dp", title: "Design Page", canonical_step_id: "step_design_page" }
  ];
}

function interactiveWorkflow(extra) {
  return Object.assign(
    {
      id: "wf-interactive",
      name: "Sample Interactive",
      product: "interactive",
      steps: designPageSteps(),
      updatedAt: 1
    },
    extra || {}
  );
}

test("product labels use authoritative metadata and fall back to Type unknown", () => {
  assert.equal(
    presentation.resolveWorkflowListProductLabel(
      { product: "interactive", name: "Anything" },
      { familyMod: family }
    ),
    "Interactive"
  );
  assert.equal(
    presentation.resolveWorkflowListProductLabel(
      { product: "expository" },
      { familyMod: family }
    ),
    "Expository"
  );
  assert.equal(
    presentation.resolveWorkflowListProductLabel(
      { product: "learning_journey" },
      { familyMod: family }
    ),
    "Learning Journey"
  );
  assert.equal(
    presentation.resolveWorkflowListProductLabel(
      { product: "assessment_pack" },
      { familyMod: family }
    ),
    "Assessment Pack"
  );
  assert.equal(
    presentation.resolveWorkflowListProductLabel(
      { product: "situated_task" },
      { familyMod: family }
    ),
    "Situated Task"
  );
  assert.equal(
    presentation.resolveWorkflowListProductLabel(
      { ldCreateOutputType: "self_study_resource", name: "Old Self Study" },
      { familyMod: family }
    ),
    "Interactive"
  );
  assert.equal(
    presentation.resolveWorkflowListProductLabel(
      { name: "Mysterious Untitled Pack" },
      { familyMod: family }
    ),
    "Type unknown"
  );
  assert.equal(
    presentation.resolveWorkflowListProductLabel(
      { name: "Looks Like Assessment Pack" },
      { familyMod: family }
    ),
    "Type unknown"
  );
});

test("authoring status: empty, partial captures, and Design Page complete", () => {
  const wf = interactiveWorkflow();

  const empty = presentation.deriveWorkflowListAuthoringStatus(wf, null);
  assert.equal(empty.status, "no_data");
  assert.equal(empty.label, "No data");
  assert.match(empty.title, /No data/);

  const partial = presentation.deriveWorkflowListAuthoringStatus(wf, {
    capturedOutputs: { s1: '{"artifact_type":"page"}' },
    stepCompleted: { s1: true, s2: true, s3: true, s4: true, s5: true, dp: true },
    runIndex: 5
  });
  assert.equal(partial.status, "in_progress");
  assert.equal(partial.label, "In progress");
  assert.equal(partial.terminalStepId, "dp");

  const complete = presentation.deriveWorkflowListAuthoringStatus(wf, {
    capturedOutputs: {
      s1: '{"ok":true}',
      dp: '{"artifact_type":"page","title":"Done"}'
    }
  });
  assert.equal(complete.status, "complete");
  assert.equal(complete.label, "Complete");
  assert.match(complete.title, /not QA/);
});

test("authoring status treats captureRefs as saved output without requiring hydrated bodies", () => {
  const wf = interactiveWorkflow();
  const viaRef = presentation.deriveWorkflowListAuthoringStatus(wf, {
    captureRefs: {
      dp: {
        final: { resource_id: "res-dp-1", slot_key: "run_capture:dp:final" }
      }
    }
  });
  assert.equal(viaRef.status, "complete");

  const partialRef = presentation.deriveWorkflowListAuthoringStatus(wf, {
    captureRefs: {
      s3: {
        final: { resource_id: "res-s3", slot_key: "run_capture:s3:final" }
      }
    }
  });
  assert.equal(partialRef.status, "in_progress");
});

test("stepCompleted and runIndex alone do not mark progress or completion", () => {
  const wf = interactiveWorkflow();
  const visitedOnly = presentation.deriveWorkflowListAuthoringStatus(wf, {
    stepCompleted: { s1: true, s2: true, dp: true },
    runIndex: 5
  });
  assert.equal(visitedOnly.status, "no_data");
});

test("Learning Journey constituents and older unknown workflows remain compatible", () => {
  const child = {
    id: "wf-child",
    name: "Constituent Interactive",
    product: "interactive",
    sourceWorkflowId: "wf-lj",
    steps: designPageSteps()
  };
  assert.equal(
    presentation.resolveWorkflowListProductLabel(child, { familyMod: family }),
    "Interactive"
  );
  assert.equal(
    presentation.deriveWorkflowListAuthoringStatus(child, {}).status,
    "no_data"
  );
  assert.equal(
    presentation.deriveWorkflowListAuthoringStatus(child, {
      capturedOutputsRaw: { s2: '{"episode":true}' }
    }).status,
    "in_progress"
  );

  const legacyCustom = {
    id: "wf-old",
    name: "Pre-product workflow",
    steps: [
      { id: "a", title: "Brief" },
      { id: "b", title: "Draft" },
      { id: "c", title: "Final artefact" }
    ]
  };
  assert.equal(
    presentation.resolveWorkflowListProductLabel(legacyCustom, { familyMod: family }),
    "Type unknown"
  );
  assert.equal(
    presentation.deriveWorkflowListAuthoringStatus(legacyCustom, {
      capturedOutputs: { a: "x", b: "y" }
    }).status,
    "in_progress"
  );
  assert.equal(
    presentation.deriveWorkflowListAuthoringStatus(legacyCustom, {
      capturedOutputs: { c: "final body" }
    }).status,
    "complete"
  );
});

test("resolveWorkflowListAuthoringStatusForWorkflow merges durable store captures", () => {
  // Keep this as a pure-store check without a fragile full DOM boot.
  const empty = presentation.deriveWorkflowListAuthoringStatus(
    interactiveWorkflow({ id: "wf-empty" }),
    null
  );
  const partial = presentation.deriveWorkflowListAuthoringStatus(
    interactiveWorkflow({ id: "wf-partial" }),
    { capturedOutputs: { s1: '{"partial":true}' } }
  );
  const complete = presentation.deriveWorkflowListAuthoringStatus(
    interactiveWorkflow({ id: "wf-complete" }),
    {
      captureRefs: {
        dp: { final: { resource_id: "res-complete", slot_key: "run_capture:dp:final" } }
      }
    }
  );
  const child = presentation.deriveWorkflowListAuthoringStatus(
    interactiveWorkflow({ id: "wf-child", sourceWorkflowId: "wf-lj" }),
    { capturedOutputs: { dp: '{"artifact_type":"page"}' } }
  );
  assert.equal(empty.status, "no_data");
  assert.equal(partial.status, "in_progress");
  assert.equal(complete.status, "complete");
  assert.equal(child.status, "complete");
  assert.equal(
    presentation.resolveWorkflowListProductLabel(
      { id: "wf-lj", product: "learning_journey", name: "Parent Journey" },
      { familyMod: family }
    ),
    "Learning Journey"
  );
});

/**
 * My Workflows list: product type label + reactive four-status derivation.
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

function designPageCapture(overrides) {
  return JSON.stringify(
    Object.assign(
      {
        artifact_type: "page",
        schema_version: "2.0.0",
        product_id: "interactive",
        title: "Sample",
        activities: [],
        visual_affordances: []
      },
      overrides || {}
    )
  );
}

function mockProductionStatus(result) {
  return {
    assessRequiredGraphicsCompletion: function () {
      return Object.assign(
        {
          determinable: true,
          complete: true,
          zeroRequired: true,
          requiredCount: 0,
          attachedCount: 0,
          reason: "mock"
        },
        result || {}
      );
    }
  };
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
});

test("No data → Incomplete after the first saved output", () => {
  const wf = interactiveWorkflow();
  const empty = presentation.deriveWorkflowListAuthoringStatus(wf, null);
  assert.equal(empty.status, "no_data");
  assert.equal(empty.label, "No data");

  const partial = presentation.deriveWorkflowListAuthoringStatus(wf, {
    capturedOutputs: { s1: '{"artifact_type":"page"}' },
    stepCompleted: { s1: true, s2: true, s3: true, s4: true, s5: true, dp: true },
    runIndex: 5
  });
  assert.equal(partial.status, "incomplete");
  assert.equal(partial.label, "Incomplete");
  assert.equal(partial.terminalStepId, "dp");
});

test("Incomplete → Authoring after pipeline completion with outstanding required authoring", () => {
  const wf = interactiveWorkflow();
  const authoring = presentation.deriveWorkflowListAuthoringStatus(
    wf,
    {
      capturedOutputs: {
        s1: '{"ok":true}',
        dp: designPageCapture({
          visual_affordances: [
            {
              affordance_id: "va1",
              visual_decision: "generate",
              brief_id: "brief-1"
            }
          ]
        })
      }
    },
    {
      productionStatusMod: mockProductionStatus({
        determinable: true,
        complete: false,
        zeroRequired: false,
        requiredCount: 1,
        attachedCount: 0,
        reason: "required_graphics_outstanding"
      })
    }
  );
  assert.equal(authoring.status, "authoring");
  assert.equal(authoring.label, "Authoring");
});

test("Authoring → Completed after all required authoring is satisfied", () => {
  const wf = interactiveWorkflow();
  const completed = presentation.deriveWorkflowListAuthoringStatus(
    wf,
    {
      capturedOutputs: {
        dp: designPageCapture()
      },
      workflowResourceRefs: [{ brief_id: "brief-1", resource_id: "res-1" }]
    },
    {
      productionStatusMod: mockProductionStatus({
        determinable: true,
        complete: true,
        zeroRequired: false,
        requiredCount: 1,
        attachedCount: 1,
        reason: "all_required_graphics_complete"
      })
    }
  );
  assert.equal(completed.status, "completed");
  assert.equal(completed.label, "Completed");
});

test("Completed → Authoring when required authoring becomes outstanding again", () => {
  const wf = interactiveWorkflow();
  const reopened = presentation.deriveWorkflowListAuthoringStatus(
    wf,
    {
      capturedOutputs: { dp: designPageCapture() },
      workflowResourceRefs: []
    },
    {
      productionStatusMod: mockProductionStatus({
        determinable: true,
        complete: false,
        zeroRequired: false,
        requiredCount: 2,
        attachedCount: 0,
        reason: "required_graphics_outstanding"
      })
    }
  );
  assert.equal(reopened.status, "authoring");
});

test("pipeline complete with no required authoring moves Incomplete → Completed", () => {
  const wf = interactiveWorkflow();
  const completed = presentation.deriveWorkflowListAuthoringStatus(
    wf,
    { capturedOutputs: { dp: designPageCapture({ visual_affordances: [] }) } },
    {
      productionStatusMod: mockProductionStatus({
        determinable: true,
        complete: true,
        zeroRequired: true,
        requiredCount: 0,
        attachedCount: 0
      })
    }
  );
  assert.equal(completed.status, "completed");
});

test("terminal capture without page body stays Authoring (cannot prove graphics complete)", () => {
  const wf = interactiveWorkflow();
  const viaRef = presentation.deriveWorkflowListAuthoringStatus(wf, {
    captureRefs: {
      dp: {
        final: { resource_id: "res-dp-1", slot_key: "run_capture:dp:final" }
      }
    }
  });
  assert.equal(viaRef.status, "authoring");

  const partialRef = presentation.deriveWorkflowListAuthoringStatus(wf, {
    captureRefs: {
      s3: {
        final: { resource_id: "res-s3", slot_key: "run_capture:s3:final" }
      }
    }
  });
  assert.equal(partialRef.status, "incomplete");
});

test("stepCompleted and runIndex alone do not mark progress or completion", () => {
  const wf = interactiveWorkflow();
  const visitedOnly = presentation.deriveWorkflowListAuthoringStatus(wf, {
    stepCompleted: { s1: true, s2: true, dp: true },
    runIndex: 5
  });
  assert.equal(visitedOnly.status, "no_data");
});

test("Learning Journey constituents derive their own status independently", () => {
  const child = {
    id: "wf-child",
    name: "Constituent Interactive",
    product: "interactive",
    sourceWorkflowId: "wf-lj",
    steps: designPageSteps()
  };
  assert.equal(
    presentation.deriveWorkflowListAuthoringStatus(child, {}).status,
    "no_data"
  );
  assert.equal(
    presentation.deriveWorkflowListAuthoringStatus(child, {
      capturedOutputsRaw: { s2: '{"episode":true}' }
    }).status,
    "incomplete"
  );
  assert.equal(
    presentation.deriveWorkflowListAuthoringStatus(
      child,
      { capturedOutputs: { dp: designPageCapture() } },
      {
        productionStatusMod: mockProductionStatus({
          determinable: true,
          complete: true,
          zeroRequired: true,
          requiredCount: 0
        })
      }
    ).status,
    "completed"
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
    presentation.deriveWorkflowListAuthoringStatus(legacyCustom, {
      capturedOutputs: { a: "x", b: "y" }
    }).status,
    "incomplete"
  );
  assert.equal(
    presentation.deriveWorkflowListAuthoringStatus(
      legacyCustom,
      { capturedOutputs: { c: JSON.stringify({ artifact_type: "page", activities: [] }) } },
      {
        productionStatusMod: mockProductionStatus({
          determinable: true,
          complete: true,
          zeroRequired: true,
          requiredCount: 0
        })
      }
    ).status,
    "completed"
  );
});

test("mergeRunRecordForListStatus overlays live captures and graphics evidence", () => {
  const merged = presentation.mergeRunRecordForListStatus(
    {
      capturedOutputs: { s1: "durable" },
      workflowResourceRefs: [{ resource_id: "old" }]
    },
    {
      capturedOutputs: { s2: "live" },
      workflowResourceRefs: [{ resource_id: "new" }],
      assetsByBriefId: { "brief-1": { mime_type: "image/png" } }
    }
  );
  assert.equal(merged.capturedOutputs.s1, "durable");
  assert.equal(merged.capturedOutputs.s2, "live");
  assert.equal(merged.workflowResourceRefs[0].resource_id, "new");
  assert.ok(merged.assetsByBriefId["brief-1"]);
});

test("live overlay empty refs win over durable so removed graphics reopen Authoring", () => {
  const merged = presentation.mergeRunRecordForListStatus(
    {
      capturedOutputs: { dp: designPageCapture() },
      workflowResourceRefs: [{ resource_id: "still-in-durable", brief_id: "brief-1" }]
    },
    {
      capturedOutputs: { dp: designPageCapture() },
      workflowResourceRefs: [],
      assetsByBriefId: {}
    }
  );
  assert.deepEqual(merged.workflowResourceRefs, []);
  assert.deepEqual(merged.assetsByBriefId, {});
});

test("removing then reattaching required graphics flips Completed ↔ Authoring", () => {
  const wf = interactiveWorkflow();
  const pageBody = designPageCapture({
    visual_affordances: [
      { affordance_id: "va1", visual_decision: "generate", brief_id: "brief-1" }
    ]
  });
  const withGraphic = {
    capturedOutputs: { dp: pageBody },
    authoritativeAssembledPage: JSON.parse(pageBody),
    workflowResourceRefs: [
      {
        resource_id: "res-1",
        brief_id: "brief-1",
        affordance_id: "va1",
        lifecycle_state: "active"
      }
    ]
  };
  const completed = presentation.deriveWorkflowListAuthoringStatus(wf, withGraphic, {
    productionStatusMod: mockProductionStatus({
      determinable: true,
      complete: true,
      zeroRequired: false,
      requiredCount: 1,
      attachedCount: 1,
      reason: "all_required_graphics_complete"
    })
  });
  assert.equal(completed.status, "completed");

  const removed = presentation.deriveWorkflowListAuthoringStatus(
    wf,
    Object.assign({}, withGraphic, { workflowResourceRefs: [], assetsByBriefId: {} }),
    {
      productionStatusMod: mockProductionStatus({
        determinable: true,
        complete: false,
        zeroRequired: false,
        requiredCount: 1,
        attachedCount: 0,
        reason: "required_graphics_outstanding"
      })
    }
  );
  assert.equal(removed.status, "authoring");

  const restored = presentation.deriveWorkflowListAuthoringStatus(wf, withGraphic, {
    productionStatusMod: mockProductionStatus({
      determinable: true,
      complete: true,
      zeroRequired: false,
      requiredCount: 1,
      attachedCount: 1,
      reason: "all_required_graphics_complete"
    })
  });
  assert.equal(restored.status, "completed");
});

test("saved/restored hydrated authoring evidence yields Completed without inline capture bodies", () => {
  const wf = interactiveWorkflow();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Restored",
    activities: [],
    visual_affordances: []
  };
  const restored = presentation.deriveWorkflowListAuthoringStatus(
    wf,
    {
      captureRefs: {
        dp: { final: { resource_id: "res-dp", slot_key: "run_capture:dp:final" } }
      },
      authoritativeAssembledPage: page,
      workflowResourceRefs: []
    },
    {
      productionStatusMod: mockProductionStatus({
        determinable: true,
        complete: true,
        zeroRequired: true,
        requiredCount: 0,
        attachedCount: 0,
        reason: "zero_required_graphics_jobs"
      })
    }
  );
  assert.equal(restored.status, "completed");
});

test("Incomplete pipeline stays Incomplete even when graphics evidence looks complete", () => {
  const wf = interactiveWorkflow();
  const incomplete = presentation.deriveWorkflowListAuthoringStatus(
    wf,
    {
      capturedOutputs: { s3: '{"activities":[]}' },
      workflowResourceRefs: [
        {
          resource_id: "res-1",
          brief_id: "brief-1",
          affordance_id: "va1",
          lifecycle_state: "active"
        }
      ],
      assetsByBriefId: { "brief-1": { mime_type: "image/png" } }
    },
    {
      productionStatusMod: mockProductionStatus({
        determinable: true,
        complete: true,
        zeroRequired: false,
        requiredCount: 1,
        attachedCount: 1
      })
    }
  );
  assert.equal(incomplete.status, "incomplete");
});

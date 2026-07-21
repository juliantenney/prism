"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const vnext = require("../lib/learner-renderer-vnext");
const { parseChecklistBody } = require("../lib/learner-renderer-vnext/parse-material");
const {
  parseLearnerTask
} = require("../lib/learner-renderer-vnext/parse-learner-task");

const repoRoot = path.resolve(__dirname, "..");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function compactActivity(activity) {
  return {
    id: activity.id,
    title: activity.title,
    durationMinutes: activity.durationMinutes,
    grouping: activity.grouping,
    preamble: activity.preamble,
    reasoningOrientation: activity.reasoningOrientation,
    beats: activity.beats.map((beat) => ({
      sourceFunction: beat.sourceFunction,
      learnerRole: beat.learnerRole,
      learnerLabel: beat.learnerLabel,
      instructions: beat.instructions,
      prompts: beat.prompts,
      materialIds: beat.materials.map((material) => material.id),
      expectedOutput: beat.expectedOutput
    }))
  };
}

test("vNext builds A1 canonical activity model", () => {
  const result = vnext.buildPageModel(loadFixture());
  assert.equal(result.ok, true);
  const a1 = result.model.activities.find((activity) => activity.id === "A1");

  assert.deepEqual(compactActivity(a1), {
    id: "A1",
    title: "Defining Heteroscedasticity and Homoscedasticity",
    durationMinutes: 12,
    grouping: "individual",
    preamble:
      "You will build a foundational mental model of residual variance before working with evidence. Focus on how the spread of residuals differs between homoscedastic and heteroscedastic situations.",
    reasoningOrientation:
      "Focus on the spread of errors rather than the existence of errors. Ask yourself whether the amount of prediction error remains stable or changes across observations. Build a mental picture of residual variability before thinking about statistical consequences.",
    beats: [
      {
        sourceFunction: "orientation",
        learnerRole: "reflect",
        learnerLabel: "Reflect",
        instructions: [],
        prompts: [
          {
            sourceField: "self_explanation_prompt",
            text: "How would you explain to a fellow economics student why two regressions can have residuals but only one exhibits heteroscedasticity?"
          }
        ],
        materialIds: [],
        expectedOutput: null
      },
      {
        sourceFunction: "explanation",
        learnerRole: "explain",
        learnerLabel: "Understand",
        instructions: [
          {
            sourceStepNumber: 1,
            text: "Study the explanatory text introducing residuals, homoscedasticity, and heteroscedasticity."
          }
        ],
        prompts: [],
        materialIds: ["A1-M1"],
        expectedOutput: null
      },
      {
        sourceFunction: "check_understanding",
        learnerRole: "check",
        learnerLabel: "Check your work",
        instructions: [
          {
            sourceStepNumber: 2,
            text: "Work through the expert example showing how residual variance changes across observations."
          },
          {
            sourceStepNumber: 3,
            text: "Compare the sample response with the explanation."
          },
          {
            sourceStepNumber: 4,
            text: "Complete the self-check and identify one misconception you previously held or might have held."
          },
          {
            sourceStepNumber: 5,
            text: "Write a brief explanation distinguishing homoscedasticity from heteroscedasticity in your own words."
          }
        ],
        prompts: [],
        materialIds: ["A1-M2", "A1-M3", "A1-M4"],
        expectedOutput: {
          text: "A successful response clearly defines both homoscedasticity and heteroscedasticity, refers to residual variance, and explains the difference using plain language rather than formulae alone. The explanation should demonstrate that changing variability, not simply the presence of residuals, is the defining feature."
        }
      }
    ]
  });
});

test("vNext builds A5 canonical activity model without splitting step 5", () => {
  const result = vnext.buildPageModel(loadFixture());
  assert.equal(result.ok, true);
  const a5 = result.model.activities.find((activity) => activity.id === "A5");
  const compact = compactActivity(a5);

  assert.deepEqual(
    compact.beats.map((beat) => ({
      sourceFunction: beat.sourceFunction,
      learnerRole: beat.learnerRole,
      learnerLabel: beat.learnerLabel,
      sourceSteps: beat.instructions.map((step) => step.sourceStepNumber),
      promptFields: beat.prompts.map((prompt) => prompt.sourceField),
      materialIds: beat.materialIds,
      hasExpectedOutput: beat.expectedOutput !== null
    })),
    [
      {
        sourceFunction: "orientation",
        learnerRole: "explain",
        learnerLabel: "Understand",
        sourceSteps: [1],
        promptFields: ["intellectual_coherence_bridge"],
        materialIds: ["A5-M1"],
        hasExpectedOutput: false
      },
      {
        sourceFunction: "comparison",
        learnerRole: "model",
        learnerLabel: "See it modelled",
        sourceSteps: [2],
        promptFields: [],
        materialIds: ["A5-M2", "A5-M3"],
        hasExpectedOutput: false
      },
      {
        sourceFunction: "evaluation",
        learnerRole: "practise",
        learnerLabel: "Your turn",
        sourceSteps: [3, 4, 5],
        promptFields: ["argument_structure_hint"],
        materialIds: ["A5-M4", "A5-M5", "A5-M6"],
        hasExpectedOutput: true
      },
      {
        sourceFunction: "reflection",
        learnerRole: "transfer",
        learnerLabel: "Apply elsewhere",
        sourceSteps: [6],
        promptFields: [],
        materialIds: ["A5-M8", "A5-M7"],
        hasExpectedOutput: false
      }
    ]
  );

  const step5 = compact.beats[2].instructions.find(
    (step) => step.sourceStepNumber === 5
  );
  assert.equal(
    step5.text,
    "Complete the final verification checklist and read the session consolidation summary."
  );
});

test("vNext fixture model satisfies source closure and empty-beat invariants", () => {
  const source = loadFixture();
  const result = vnext.buildPageModel(source);
  assert.equal(result.ok, true);
  assert.deepEqual(
    result.model.activities.map((activity) => activity.id),
    ["A1", "A2", "A3", "A4", "A5"]
  );
  assert.deepEqual(result.diagnostics.omittedBeats, [
    {
      activityId: "A3",
      sourceFunction: "orientation",
      reason: "empty_learner_facing_content"
    },
    {
      activityId: "A4",
      sourceFunction: "orientation",
      reason: "empty_learner_facing_content"
    }
  ]);

  result.model.activities.forEach((activity) => {
    activity.beats.forEach((beat) => {
      assert.equal(vnext.hasLearnerFacingContent(beat), true);
    });
  });

  const modelMaterialIds = result.model.activities.flatMap((activity) =>
    activity.beats.flatMap((beat) => beat.materials.map((material) => material.id))
  );
  const sourceMaterialIds = source.activities.flatMap((activity) =>
    activity.materials.map((material) => material.material_id)
  );
  assert.deepEqual([...modelMaterialIds].sort(), [...sourceMaterialIds].sort());
  sourceMaterialIds.forEach((id) => {
    assert.equal(modelMaterialIds.filter((candidate) => candidate === id).length, 1);
  });

  source.activities.forEach((sourceActivity) => {
    const modelActivity = result.model.activities.find(
      (activity) => activity.id === sourceActivity.activity_id
    );
    const sourceSteps = parseLearnerTask(sourceActivity.learner_task);
    const modelSteps = modelActivity.beats.flatMap((beat) => beat.instructions);
    assert.deepEqual(
      modelSteps.map((step) => step.sourceStepNumber).sort((a, b) => a - b),
      sourceSteps.map((step) => step.sourceStepNumber).sort((a, b) => a - b)
    );
    assert.equal(
      modelActivity.beats.filter((beat) => beat.expectedOutput !== null).length,
      1
    );
  });

  const checklists = result.model.activities.flatMap((activity) =>
    activity.beats.flatMap((beat) =>
      beat.materials.filter((material) => material.type === "checklist")
    )
  );
  assert.equal(checklists.length, 5);

  const a2 = result.model.activities.find((activity) => activity.id === "A2");
  assert.deepEqual(
    a2.beats.find((beat) => beat.sourceFunction === "analysis").materials.map(
      (material) => material.id
    ),
    ["A2-M3", "A2-M2"]
  );
});

test("vNext checklist parsing separates criteria and trailing revision text", () => {
  assert.deepEqual(
    parseChecklistBody(
      "- First criterion\n- Second criterion\n\nRevise before continuing."
    ),
    {
      criteria: ["First criterion", "Second criterion"],
      revisionInstruction: "Revise before continuing."
    }
  );
});

test("vNext rejects unassigned and unknown materials instead of falling back", () => {
  const unassignedPage = loadFixture();
  unassignedPage.activities[0].materials.push({
    material_id: "A1-MX",
    material_type: "template",
    title: "Unexpected template",
    body_format: "markdown",
    body: "Template"
  });
  const unassigned = vnext.buildPageModel(unassignedPage);
  assert.equal(unassigned.ok, false);
  assert.ok(
    unassigned.errors.some(
      (error) =>
        error.code === "UNASSIGNED_MATERIAL" && error.materialId === "A1-MX"
    )
  );

  const unknownPage = loadFixture();
  unknownPage.activities[0].materials[0].material_type = "mystery_widget";
  const unknown = vnext.buildPageModel(unknownPage);
  assert.equal(unknown.ok, false);
  assert.ok(
    unknown.errors.some((error) => error.code === "UNKNOWN_MATERIAL_TYPE")
  );
});

test("vNext production module excludes legacy planner and consumption patterns", () => {
  const moduleDir = path.join(repoRoot, "lib", "learner-renderer-vnext");
  const forbidden = [
    "scoreClauseForBeat",
    "scoreMaterialForBeat",
    "chooseSinkBeatIndex",
    "earliestStepMention",
    "resolveBeatMaterialPlan",
    "orderedMaterialKeysRendered",
    "checklistRendered",
    "insertExpectedOutputGuidanceBeforeChecklist"
  ];
  const compositionAdapterFiles = new Set([
    "compose-activity-moments.js",
    "compose-workspace.js",
    "completion-table-workspace.js"
  ]);
  const files = fs
    .readdirSync(moduleDir)
    .filter((name) => name.endsWith(".js"));
  const productionSource = files
    .filter((name) => !compositionAdapterFiles.has(name))
    .map((name) => fs.readFileSync(path.join(moduleDir, name), "utf8"))
    .join("\n");

  forbidden.forEach((token) => assert.equal(productionSource.includes(token), false));
  assert.doesNotMatch(
    productionSource,
    /activityId\s*={2,3}\s*["']A[1-5]["']/
  );
});

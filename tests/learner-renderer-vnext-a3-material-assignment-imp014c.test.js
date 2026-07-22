"use strict";

/**
 * Sprint 68 IMP-014C follow-up — A3-M2 material assignment for apply-orient-practise-feedback.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const buildModel = require("../lib/learner-renderer-vnext/build-page-model").buildPageModel;
const buildBeatModels = require("../lib/learner-renderer-vnext/build-beat-model").buildBeatModels;
const selectVariant = require("../lib/learner-renderer-vnext/archetype-rules").selectArchetypeVariant;
const renderPage = require("../lib/learner-renderer-vnext/render-learner-page").renderLearnerPageHtml;
const classifyActivityBeats =
  require("../lib/learner-renderer-vnext/compose-moment-classification").classifyActivityBeats;
const resolveMaterialType =
  require("../lib/learner-renderer-vnext/parse-material").resolveMaterialType;
const {
  readVideoTranscriptTestPage
} = require("./videotranscripttest-workflow-fixture.js");

const browserBundlePath = path.join(
  __dirname,
  "..",
  "lib",
  "learner-renderer-vnext-browser.js"
);

const APPLY_VARIANT = selectVariant("apply", ["orientation", "practice", "feedback"]);

function buildA3Activity(materials) {
  return {
    activity_id: "A3",
    title: "Plan an Outbreak Response",
    learner_task:
      "1. Read the outbreak response framing text.\n" +
      "2. Study the outbreak scenario and identify immediate constraints.\n" +
      "3. Complete the planning table with sequenced actions and rationales.\n" +
      "4. Use the checklist to verify that each action is evidence-linked.",
    expected_output: "Completed planning table and checklist.",
    episode_plan: {
      archetype: "apply",
      beats: [{ function: "orientation" }, { function: "practice" }, { function: "feedback" }]
    },
    materials: materials
  };
}

function beatForMaterial(activity) {
  var result = buildBeatModels(activity, APPLY_VARIANT);
  assert.equal(result.errors.length, 0, result.errors.map((e) => e.message).join("; "));
  var modelActivity = { id: "A3", beats: result.beats };
  var materialId = "A3-M2";
  for (var i = 0; i < result.beats.length; i += 1) {
    var beat = result.beats[i];
    if ((beat.materials || []).some(function (material) { return material.id === materialId; })) {
      return beat;
    }
  }
  return null;
}

test("IMP-014C A3: A3-M2 with type alias resolves to scenario and matches practice beat", () => {
  var activity = buildA3Activity([
    {
      material_id: "A3-M1",
      material_type: "text",
      title: "Framing",
      body_format: "markdown",
      body: "Framing text."
    },
    {
      material_id: "A3-M2",
      type: "scenario",
      title: "Outbreak Scenario",
      body_format: "markdown",
      body: "Regional hospital cluster with dialysis-linked HCV cases."
    },
    {
      material_id: "A3-M3",
      material_type: "planning_table",
      title: "Planning Table",
      body_format: "markdown",
      body: "| Action | Rationale |\n| --- | --- |\n| Screen | Interrupt transmission |"
    },
    {
      material_id: "A3-M4",
      material_type: "checklist",
      title: "Checklist",
      body_format: "markdown",
      body: "- Evidence linked"
    }
  ]);
  assert.equal(resolveMaterialType(activity.materials[1]), "scenario");
  var beat = beatForMaterial(activity);
  assert.ok(beat);
  assert.equal(beat.sourceFunction, "practice");
  assert.equal(beat.learnerRole, "practise");
});

test("IMP-014C A3: worked_example A3-M2 matches exactly one practice beat rule", () => {
  var activity = buildA3Activity([
    {
      material_id: "A3-M1",
      material_type: "text",
      title: "Framing",
      body: "Framing text."
    },
    {
      material_id: "A3-M2",
      material_type: "worked_example",
      title: "Modeled Outbreak Response Walkthrough",
      body: "Step 1: identify constraints. Step 2: sequence containment actions."
    },
    {
      material_id: "A3-M3",
      material_type: "planning_table",
      title: "Planning Table",
      body: "| Action | Rationale |\n| --- | --- |\n| Screen | Interrupt transmission |"
    },
    {
      material_id: "A3-M4",
      material_type: "checklist",
      title: "Checklist",
      body: "- Evidence linked"
    }
  ]);
  var beat = beatForMaterial(activity);
  assert.equal(beat.sourceFunction, "practice");
});

test("IMP-014C A3: A3-M2 composed into Do moment for practice beat", () => {
  var page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "A3 moment probe",
    page_profile: "learner",
    activities: [
      buildA3Activity([
        {
          material_id: "A3-M1",
          material_type: "text",
          title: "Framing",
          body: "Framing text."
        },
        {
          material_id: "A3-M2",
          material_type: "worked_example",
          title: "Modeled scenario response",
          body: "Expert walkthrough of outbreak prioritisation."
        },
        {
          material_id: "A3-M3",
          material_type: "planning_table",
          title: "Planning Table",
          body: "| Action | Rationale |\n| --- | --- |\n| Screen | Interrupt transmission |"
        },
        {
          material_id: "A3-M4",
          material_type: "checklist",
          title: "Checklist",
          body: "- Evidence linked"
        }
      ])
    ]
  };
  var model = buildModel(page);
  assert.equal(model.ok, true, model.errors.map((e) => e.code).join(", "));
  var a3 = model.model.activities.find(function (activity) {
    return activity.id === "A3";
  });
  var groups = classifyActivityBeats(a3);
  assert.ok(
    groups.doBeats.some(function (beat) {
      return (beat.materials || []).some(function (material) {
        return material.id === "A3-M2";
      });
    })
  );
});

test("IMP-014C A3: all materials assigned exactly once", () => {
  var page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "A3 cardinality",
    page_profile: "learner",
    activities: [
      buildA3Activity([
        {
          material_id: "A3-M1",
          material_type: "text",
          title: "Framing",
          body: "Framing text."
        },
        {
          material_id: "A3-M2",
          type: "worked_example",
          title: "Scenario model",
          body: "Expert scenario analysis."
        },
        {
          material_id: "A3-M3",
          material_type: "planning_table",
          title: "Planning Table",
          body: "| Action | Rationale |\n| --- | --- |\n| Screen | Interrupt transmission |"
        },
        {
          material_id: "A3-M4",
          material_type: "checklist",
          title: "Checklist",
          body: "- Evidence linked"
        }
      ])
    ]
  };
  var result = buildModel(page);
  assert.equal(result.ok, true, result.errors.map((e) => e.message).join("; "));
});

test("IMP-014C A3: scenarios alias resolves to scenario on practice beat", () => {
  var activity = buildA3Activity([
    { material_id: "A3-M1", material_type: "text", title: "Framing", body: "Framing" },
    { material_id: "A3-M2", type: "scenarios", title: "Cases", body: "Case details." },
    { material_id: "A3-M3", material_type: "planning_table", title: "Plan", body: "|a|b|\n|-|-|" },
    { material_id: "A3-M4", material_type: "checklist", title: "Check", body: "- one" }
  ]);
  var beat = beatForMaterial(activity);
  assert.equal(beat.sourceFunction, "practice");
});

test("IMP-014C A3: apply-orient-practise-feedback rejects unrelated material types", () => {
  var activity = buildA3Activity([
    { material_id: "A3-M1", material_type: "text", title: "Framing", body: "Framing" },
    { material_id: "A3-M2", material_type: "transfer_prompt", title: "Transfer", body: "Transfer" },
    { material_id: "A3-M3", material_type: "planning_table", title: "Plan", body: "|a|b|\n|-|-|" },
    { material_id: "A3-M4", material_type: "checklist", title: "Check", body: "- one" }
  ]);
  var result = buildBeatModels(activity, APPLY_VARIANT);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "UNASSIGNED_MATERIAL" && String(error.message).includes("A3-M2");
    })
  );
});

test("IMP-014C A3: material matching more than one beat rule still fails", () => {
  var overlapVariant = {
    id: "test-overlap",
    beatSequence: ["a", "b"],
    beats: [
      {
        sourceFunction: "a",
        learnerRole: "practise",
        materialTypes: ["text"],
        materialOrder: ["text"],
        promptFields: [],
        taskSteps: { take: 0 },
        includeExpectedOutput: false
      },
      {
        sourceFunction: "b",
        learnerRole: "check",
        materialTypes: ["text"],
        materialOrder: ["text"],
        promptFields: [],
        taskSteps: { take: 0 },
        includeExpectedOutput: false
      }
    ]
  };
  var activity = {
    activity_id: "X1",
    learner_task: "Study the text.",
    expected_output: "Output",
    materials: [{ material_id: "X1-M1", material_type: "text", title: "Text", body: "Body" }]
  };
  var result = buildBeatModels(activity, overlapVariant);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "MULTIPLY_ASSIGNED_MATERIAL";
    })
  );
});

test("IMP-014C: authoritative VideoTranscriptTest page renders completely", () => {
  var page = readVideoTranscriptTestPage().page;
  var rendered = renderPage(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  assert.ok(rendered.html && rendered.html.length > 1000);
});

test("IMP-014C: journey-compressed variants cover authoritative workflow materials", () => {
  var page = readVideoTranscriptTestPage().page;
  var result = buildModel(page);
  assert.equal(result.ok, true, result.errors.map((e) => e.code + " " + e.message).join("; "));
  page.activities.forEach(function (activity) {
    (activity.materials || []).forEach(function (material) {
      var assigned = false;
      var modelActivity = result.model.activities.find(function (row) {
        return row.id === activity.activity_id;
      });
      (modelActivity.beats || []).forEach(function (beat) {
        if ((beat.materials || []).some(function (row) { return row.id === material.material_id; })) {
          assigned = true;
        }
      });
      assert.equal(assigned, true, activity.activity_id + " " + material.material_id);
    });
  });
});

test("IMP-014C: browser bundle includes resolveMaterialType and practice worked_example rule", () => {
  var bundle = fs.readFileSync(browserBundlePath, "utf8");
  assert.match(bundle, /resolveMaterialType/);
  assert.match(bundle, /apply-orient-practise-feedback[\s\S]*worked_example/);
});

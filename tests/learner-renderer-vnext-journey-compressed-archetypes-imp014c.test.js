"use strict";

/**
 * Sprint 69 Phase 5B — former journey-compressed vocabulary fails closed.
 * Historical IMP-014C positive coverage is replaced by negative fail-closed proofs.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const buildModel = require("../lib/learner-renderer-vnext/build-page-model").buildPageModel;
const renderPage = require("../lib/learner-renderer-vnext/render-learner-page").renderLearnerPageHtml;
const route = require("../lib/learner-renderer-vnext/archetype-validation-route");
const {
  readVideoTranscriptTestPage,
  WORKFLOW_ID,
  WORKFLOW_NAME
} = require("./videotranscripttest-workflow-fixture.js");

const repoRoot = path.resolve(__dirname, "..");
const heteroPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const kitchenSinkPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "learner-renderer-kitchen-sink-page.json"
);

const HISTORICAL_COMPRESSED = Object.freeze([
  {
    activityId: "A1",
    archetype: "understand",
    beatSequence: ["orientation", "explanation", "check"]
  },
  {
    activityId: "A3",
    archetype: "apply",
    beatSequence: ["orientation", "practice", "feedback"]
  },
  {
    activityId: "A4",
    archetype: "analyse",
    beatSequence: ["orientation", "investigation", "synthesis"]
  },
  {
    activityId: "A5",
    archetype: "evaluate",
    beatSequence: ["orientation", "judgement", "reflection"]
  }
]);

function pageWithPlan(activityId, archetype, beats) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "imp014c-negative",
    activities: [
      {
        activity_id: activityId,
        title: activityId,
        episode_plan: {
          archetype: archetype,
          beats: beats.map(function (fn) {
            return { function: fn };
          })
        },
        materials: [{ material_id: activityId + "-M1", type: "text", body: "Body" }]
      }
    ]
  };
}

test("IMP-014C Phase 5B: journey registry module is gone", () => {
  assert.equal(
    fs.existsSync(
      path.join(repoRoot, "lib", "learner-renderer-vnext", "journey-compatibility-registry.js")
    ),
    false
  );
  assert.equal(route.VALIDATION_ROUTE.JOURNEY_COMPATIBILITY_REGISTRY, undefined);
});

HISTORICAL_COMPRESSED.forEach(function (row) {
  test(
    "IMP-014C Phase 5B: historical compressed sequence fails closed (" + row.activityId + ")",
    () => {
      const model = buildModel(pageWithPlan(row.activityId, row.archetype, row.beatSequence));
      assert.equal(model.ok, false);
      assert.ok(
        model.errors.some(function (err) {
          return (
            err.code === "MIXED_EPISODE_PLAN_VOCABULARY" ||
            err.code === "UNKNOWN_EPISODE_PLAN_BEAT"
          );
        }),
        JSON.stringify(model.errors)
      );
      const rendered = renderPage(pageWithPlan(row.activityId, row.archetype, row.beatSequence));
      assert.ok(rendered.error);
    }
  );
});

test("IMP-014C Phase 5B: migrated VTT / Hetero / kitchen-sink are canonical FunctionEnum", () => {
  const loaded = readVideoTranscriptTestPage();
  assert.equal(String(loaded.provenance.workflow_id), WORKFLOW_ID);
  assert.equal(String(loaded.provenance.workflow_name || ""), WORKFLOW_NAME);

  [loaded.page, JSON.parse(fs.readFileSync(heteroPath, "utf8")), JSON.parse(fs.readFileSync(kitchenSinkPath, "utf8"))].forEach(
    function (page) {
      const model = buildModel(page);
      assert.equal(model.ok, true, JSON.stringify(model.errors));
      model.diagnostics.archetypeInspection.forEach(function (insp) {
        assert.equal(insp.validationRoute, "canonical-grammar");
        assert.equal(insp.runtimeAuthority, "shared-archetype-grammar");
        insp.normalizedBeatSequence.forEach(function (beat) {
          assert.equal(
            require("../lib/episode-plan-v1-vocabulary").FUNCTION_ENUM_SET[beat],
            true,
            beat
          );
        });
      });
    }
  );
});

"use strict";

/**
 * Sprint 68 IMP-014C — journey-compressed beat vocabulary from production
 * VideoTranscriptTest diagnostics.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const selectVariant = require("../lib/learner-renderer-vnext/archetype-rules").selectArchetypeVariant;
const buildModel = require("../lib/learner-renderer-vnext/build-page-model").buildPageModel;
const renderPage = require("../lib/learner-renderer-vnext/render-learner-page").renderLearnerPageHtml;
const {
  classifyBeatMoment,
  beatRequiresDoCheckSplit
} = require("../lib/learner-renderer-vnext/compose-moment-classification");
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
const browserBundlePath = path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js");
const sourceRulesPath = path.join(repoRoot, "lib", "learner-renderer-vnext", "archetype-rules.js");

const JOURNEY_VARIANT_IDS = Object.freeze([
  "understand-orient-explain-check",
  "apply-orient-practise-feedback",
  "analyse-orient-investigate-synthesise",
  "evaluate-orient-judge-reflect"
]);

const AUTHORITATIVE_SEQUENCES = Object.freeze([
  {
    activityId: "A1",
    archetype: "understand",
    beatSequence: ["orientation", "explanation", "check"],
    variantId: "understand-orient-explain-check"
  },
  {
    activityId: "A2",
    archetype: "understand",
    beatSequence: ["orientation", "explanation", "check"],
    variantId: "understand-orient-explain-check"
  },
  {
    activityId: "A3",
    archetype: "apply",
    beatSequence: ["orientation", "practice", "feedback"],
    variantId: "apply-orient-practise-feedback"
  },
  {
    activityId: "A4",
    archetype: "analyse",
    beatSequence: ["orientation", "investigation", "synthesis"],
    variantId: "analyse-orient-investigate-synthesise"
  },
  {
    activityId: "A5",
    archetype: "analyse",
    beatSequence: ["orientation", "investigation", "synthesis"],
    variantId: "analyse-orient-investigate-synthesise"
  },
  {
    activityId: "A6",
    archetype: "evaluate",
    beatSequence: ["orientation", "judgement", "reflection"],
    variantId: "evaluate-orient-judge-reflect"
  }
]);

function loadAuthoritativePage() {
  return readVideoTranscriptTestPage().page;
}

function countMaterials(page) {
  return (page.activities || []).reduce(function (sum, activity) {
    return sum + (Array.isArray(activity.materials) ? activity.materials.length : 0);
  }, 0);
}

test("IMP-014C: understand accepts exactly orientation → explanation → check", () => {
  var variant = selectVariant("understand", ["orientation", "explanation", "check"]);
  assert.ok(variant);
  assert.equal(variant.id, "understand-orient-explain-check");
  assert.deepEqual(variant.beatSequence, ["orientation", "explanation", "check"]);
});

test("IMP-014C: apply accepts exactly orientation → practice → feedback", () => {
  var variant = selectVariant("apply", ["orientation", "practice", "feedback"]);
  assert.ok(variant);
  assert.equal(variant.id, "apply-orient-practise-feedback");
});

test("IMP-014C: analyse accepts exactly orientation → investigation → synthesis", () => {
  var variant = selectVariant("analyse", ["orientation", "investigation", "synthesis"]);
  assert.ok(variant);
  assert.equal(variant.id, "analyse-orient-investigate-synthesise");
});

test("IMP-014C: evaluate accepts exactly orientation → judgement → reflection", () => {
  var variant = selectVariant("evaluate", ["orientation", "judgement", "reflection"]);
  assert.ok(variant);
  assert.equal(variant.id, "evaluate-orient-judge-reflect");
});

test("IMP-014C: A1 and A2 both resolve to understand-orient-explain-check", () => {
  ["A1", "A2"].forEach(function (activityId) {
    var page = loadAuthoritativePage();
    var activity = page.activities.find(function (row) {
      return row.activity_id === activityId;
    });
    var beats = activity.episode_plan.beats.map(function (beat) {
      return beat.function;
    });
    var variant = selectVariant(activity.episode_plan.archetype, beats);
    assert.equal(variant.id, "understand-orient-explain-check", activityId);
  });
});

test("IMP-014C: A4 and A5 both resolve to analyse-orient-investigate-synthesise", () => {
  ["A4", "A5"].forEach(function (activityId) {
    var page = loadAuthoritativePage();
    var activity = page.activities.find(function (row) {
      return row.activity_id === activityId;
    });
    var beats = activity.episode_plan.beats.map(function (beat) {
      return beat.function;
    });
    var variant = selectVariant(activity.episode_plan.archetype, beats);
    assert.equal(variant.id, "analyse-orient-investigate-synthesise", activityId);
  });
});

test("IMP-014C: authoritative workflow assigns all materials exactly once", () => {
  var result = buildModel(loadAuthoritativePage());
  assert.equal(result.ok, true, result.errors.map((e) => e.code).join(", "));
  assert.ok(
    !result.errors.some(function (error) {
      return (
        error.code === "UNASSIGNED_MATERIAL" ||
        error.code === "MULTIPLY_ASSIGNED_MATERIAL"
      );
    })
  );
  assert.equal(countMaterials(loadAuthoritativePage()), 29);
});

test("IMP-014C: authoritative workflow assigns all learner-task steps exactly once", () => {
  var result = buildModel(loadAuthoritativePage());
  assert.equal(result.ok, true);
  assert.ok(
    !result.errors.some(function (error) {
      return (
        error.code === "UNASSIGNED_TASK_STEP" ||
        error.code === "MULTIPLY_ASSIGNED_TASK_STEP"
      );
    })
  );
});

test("IMP-014C: authoritative workflow assigns all expected outputs exactly once", () => {
  var result = buildModel(loadAuthoritativePage());
  assert.equal(result.ok, true);
  assert.ok(
    !result.errors.some(function (error) {
      return (
        error.code === "UNASSIGNED_EXPECTED_OUTPUT" ||
        error.code === "MULTIPLY_ASSIGNED_EXPECTED_OUTPUT"
      );
    })
  );
});

test("IMP-014C: journey-compressed functions classify into correct moments", () => {
  assert.equal(
    classifyBeatMoment({ sourceFunction: "check", learnerRole: "check" }),
    "check"
  );
  assert.equal(
    classifyBeatMoment({ sourceFunction: "practice", learnerRole: "practise" }),
    "do"
  );
  assert.equal(
    classifyBeatMoment({ sourceFunction: "feedback", learnerRole: "check" }),
    "check"
  );
  assert.equal(
    classifyBeatMoment({ sourceFunction: "investigation", learnerRole: "practise" }),
    "do"
  );
  assert.equal(
    classifyBeatMoment({ sourceFunction: "synthesis", learnerRole: "check" }),
    "check"
  );
  assert.equal(
    classifyBeatMoment({ sourceFunction: "judgement", learnerRole: "practise" }),
    "do"
  );
  assert.equal(
    classifyBeatMoment({ sourceFunction: "judgement", learnerRole: "model" }),
    "learn"
  );
});

test("IMP-014C: investigation beats with learn and task materials split", () => {
  var beat = {
    sourceFunction: "investigation",
    learnerRole: "practise",
    instructions: [{ text: "Study the modelling note." }, { text: "Complete the analysis table." }],
    materials: [
      { id: "M1", type: "text" },
      { id: "M2", type: "analysis_table" }
    ]
  };
  assert.equal(beatRequiresDoCheckSplit(beat), true);
});

test("IMP-014C: activity-id renaming does not change variant resolution", () => {
  var page = loadAuthoritativePage();
  page.activities.forEach(function (activity) {
    activity.activity_id = "RENAMED-" + activity.activity_id;
    (activity.materials || []).forEach(function (material) {
      material.activity_id = activity.activity_id;
    });
  });
  var result = buildModel(page);
  assert.equal(result.ok, true, result.errors.map((e) => e.code).join(", "));
});

test("IMP-014C: reordered beat sequence fails strict matching", () => {
  assert.equal(selectVariant("understand", ["explanation", "orientation", "check"]), null);
  assert.equal(selectVariant("apply", ["orientation", "feedback", "practice"]), null);
});

test("IMP-014C: unknown beat function fails strict matching", () => {
  assert.equal(selectVariant("understand", ["orientation", "explanation", "unknown_fn"]), null);
  assert.equal(selectVariant("analyse", ["orientation", "investigation", "verification"]), null);
});

test("IMP-014C: browser and Node catalogues include journey-compressed variants", () => {
  var source = fs.readFileSync(sourceRulesPath, "utf8");
  var bundle = fs.readFileSync(browserBundlePath, "utf8");
  JOURNEY_VARIANT_IDS.forEach(function (variantId) {
    assert.match(source, new RegExp('"' + variantId + '"'));
    assert.match(bundle, new RegExp('"' + variantId + '"'), "Stale browser bundle: " + variantId);
  });
});

test("IMP-014C: authoritative VideoTranscriptTest page renders through production path", () => {
  var loaded = readVideoTranscriptTestPage();
  assert.equal(String(loaded.provenance.workflow_id), WORKFLOW_ID);
  assert.equal(String(loaded.provenance.workflow_name || ""), WORKFLOW_NAME);

  AUTHORITATIVE_SEQUENCES.forEach(function (row) {
    var activity = loaded.page.activities.find(function (entry) {
      return entry.activity_id === row.activityId;
    });
    var beats = activity.episode_plan.beats.map(function (beat) {
      return beat.function;
    });
    var variant = selectVariant(row.archetype, beats);
    assert.equal(variant.id, row.variantId, row.activityId);
  });

  var modelResult = buildModel(loaded.page);
  assert.equal(modelResult.ok, true, modelResult.errors.map((e) => e.code).join(", "));
  assert.deepEqual(modelResult.diagnostics.cascadeSummary, {});

  var rendered = renderPage(loaded.page, { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  assert.ok(rendered.html && rendered.html.length > 1000);
});

test("IMP-014C: heteroscedasticity golden page still renders unchanged", () => {
  var fixture = JSON.parse(fs.readFileSync(heteroPath, "utf8"));
  var result = renderPage(fixture);
  assert.equal(result.error, null, result.error);
});

test("IMP-014C: kitchen sink page still renders unchanged", () => {
  var fixture = JSON.parse(fs.readFileSync(kitchenSinkPath, "utf8"));
  var result = renderPage(fixture);
  assert.equal(result.error, null, result.error);
});

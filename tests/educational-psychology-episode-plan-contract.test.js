"use strict";

/**
 * Educational Psychology post–Sprint 68 — producer contract repair regression.
 *
 * Root cause: illegal beat vocabulary entered at Episode Plan capture.
 * Fixes under test: FunctionEnum shell validation, canonical derive fallback,
 * assembly episode_plan preservation, and last-resort V1 registry variants.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const templates = require("../lib/episode-plan-v1-templates");
const validation = require("../lib/episode-plan-v1-validation");
const shellCreate = require("../lib/page-shell-create");
const assemble = require("../lib/page-vnext-assemble");
const selectVariant =
  require("../lib/learner-renderer-vnext/archetype-rules").selectArchetypeVariant;
const buildPageModel =
  require("../lib/learner-renderer-vnext/build-page-model").buildPageModel;

const fixtureDir = path.join(
  __dirname,
  "fixtures",
  "educational-psychology-post-s68"
);

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, name), "utf8"));
}

function repairedShellFromFixture() {
  const badEp = loadJson("design-episode-plan.json");
  const los = { learning_outcomes: badEp.learning_outcomes };
  const derived = templates.deriveEpisodePlansFromLearningOutcomes(los);
  const shell = shellCreate.createPageShellFromEpisodePlan(derived, {
    title: badEp.title,
    audience: badEp.audience,
    learning_outcomes: los,
    page_profile: badEp.page_profile
  });
  return { badEp, los, shell };
}

test("fixture EP capture contains illegal consolidation vocabulary", () => {
  const badEp = loadJson("design-episode-plan.json");
  const vocab = validation.validatePageEpisodePlanVocabulary(badEp, {
    owner: "Episode Plan capture",
    canonicalSource: "Episode Plan FunctionEnum"
  });
  assert.equal(vocab.ok, false);
  assert.ok(
    vocab.diagnostics.some(function (row) {
      return (
        row.code === "NON_CANONICAL_EPISODE_PLAN_BEAT" &&
        row.beat === "consolidation" &&
        row.activityId === "A1"
      );
    })
  );
  assert.ok(
    (vocab.errors || []).some(function (msg) {
      return /NON_CANONICAL_EPISODE_PLAN_BEAT/.test(msg);
    })
  );
});

test("page shell schema rejects consolidation before renderer", () => {
  const badEp = loadJson("design-episode-plan.json");
  const check = shellCreate.validatePageShellAgainstVNextSchema(badEp);
  assert.equal(check.ok, false);
  assert.ok(
    (check.errors || []).some(function (msg) {
      return /consolidation/.test(msg);
    })
  );
});

test("DLA/GAM fixture activities do not carry episode_plan overwrites", () => {
  const dla = loadJson("design-learning-activities.json");
  const gam = loadJson("generate-activity-materials.json");
  dla.activities.forEach(function (row) {
    assert.equal(
      Object.prototype.hasOwnProperty.call(row, "episode_plan"),
      false,
      row.activity_id + " DLA should not own episode_plan"
    );
  });
  gam.activities.forEach(function (row) {
    assert.equal(
      Object.prototype.hasOwnProperty.call(row, "episode_plan"),
      false,
      row.activity_id + " GAM should not include episode_plan"
    );
  });
});

test("canonical derive from embedded LOs uses only FunctionEnum beats", () => {
  const { shell } = repairedShellFromFixture();
  const check = shellCreate.validatePageShellAgainstVNextSchema(shell);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
  shell.activities.forEach(function (activity) {
    const planCheck = validation.validateEpisodePlanV1(
      activity.episode_plan,
      activity.activity_id
    );
    assert.equal(planCheck.ok, true, planCheck.errors && planCheck.errors.join("; "));
    (activity.episode_plan.beats || []).forEach(function (beat) {
      assert.notEqual(beat.function, "consolidation");
    });
  });
});

test("merge protection: downstream partial cannot overwrite activity.episode_plan", () => {
  const { shell } = repairedShellFromFixture();
  const canonical = shell.activities[0].episode_plan.beats.map(function (b) {
    return b.function;
  });
  const dla = loadJson("design-learning-activities.json");
  const attack = JSON.parse(JSON.stringify(dla));
  attack.activities[0].episode_plan = {
    archetype: "understand",
    beats: [{ function: "consolidation" }]
  };
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: shell,
    dla: attack
  });
  assert.equal(result.ok, true);
  assert.deepEqual(
    result.page.activities[0].episode_plan.beats.map(function (b) {
      return b.function;
    }),
    canonical
  );
  assert.ok(
    (result.diagnostics || []).some(function (row) {
      return row.code === "DOWNSTREAM_EPISODE_PLAN_OVERWRITE_IGNORED";
    })
  );
});

test("Educational Psychology repaired assembly binds A1–A5 with exactly-once assignment", () => {
  const { shell } = repairedShellFromFixture();
  const assembled = assemble.assembleVNextPageFromPartials({
    episode_plan: shell,
    dla: loadJson("design-learning-activities.json"),
    gam: loadJson("generate-activity-materials.json"),
    learning_sequence: loadJson("construct-learning-sequence.json"),
    design_page: loadJson("design-page.json")
  });
  assert.equal(assembled.ok, true);

  const sequences = {};
  assembled.page.activities.forEach(function (activity) {
    const seq = (activity.episode_plan.beats || []).map(function (b) {
      return b.function;
    });
    sequences[activity.activity_id] = {
      archetype: activity.episode_plan.archetype,
      seq: seq
    };
    const variant = selectVariant(activity.episode_plan.archetype, seq);
    assert.ok(
      variant,
      activity.activity_id + " must match a registered variant"
    );
    assert.match(variant.id, /episode-plan-v1$/);
  });

  assert.deepEqual(sequences.A1.archetype, "understand");
  assert.deepEqual(sequences.A2.archetype, "apply");
  assert.deepEqual(sequences.A3.archetype, "analyse");
  assert.deepEqual(sequences.A4.archetype, "evaluate");
  assert.deepEqual(sequences.A5.archetype, "understand");

  const model = buildPageModel(assembled.page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || [], null, 2));
  const codes = (model.errors || []).map(function (row) {
    return row.code;
  });
  assert.equal(codes.includes("UNKNOWN_ARCHETYPE_VARIANT"), false);
  assert.equal(codes.includes("UNASSIGNED_MATERIAL"), false);
  assert.equal(codes.includes("UNASSIGNED_TASK_STEP"), false);
  assert.equal(codes.includes("UNASSIGNED_EXPECTED_OUTPUT"), false);
  assert.equal(codes.includes("MULTIPLY_ASSIGNED_MATERIAL"), false);
});

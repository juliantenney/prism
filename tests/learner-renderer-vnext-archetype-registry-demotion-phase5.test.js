/**
 * Sprint 69 Phase 5B — supersedes Phase 5 demotion tests.
 * Journey registry and composition-continuity overlays are removed.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const repoRoot = path.resolve(__dirname, "..");
const archetypeRules = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-rules.js"
));
const route = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-validation-route.js"
));
const binding = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-canonical-binding.js"
));
const buildPageModel = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "build-page-model.js"
)).buildPageModel;

test("compatibility modules are deleted", () => {
  assert.equal(
    fs.existsSync(
      path.join(repoRoot, "lib", "learner-renderer-vnext", "journey-compatibility-registry.js")
    ),
    false
  );
  assert.equal(
    fs.existsSync(
      path.join(repoRoot, "lib", "learner-renderer-vnext", "canonical-composition-continuity.js")
    ),
    false
  );
});

test("ARCHETYPE_RULES facade is removed-phase-5b", () => {
  assert.equal(archetypeRules.REGISTRY_ROLE, "removed-phase-5b");
  assert.deepEqual(archetypeRules.ARCHETYPE_RULES, {});
  assert.equal(
    archetypeRules.selectArchetypeVariant("understand", [
      "orientation",
      "explanation",
      "check"
    ]),
    null
  );
  assert.equal(
    archetypeRules.selectArchetypeVariant(
      "understand",
      binding.EPISODE_PLAN_V1_SEQUENCES.understand
    ),
    null
  );
});

test("VTT and Hetero render through canonical-grammar only", () => {
  [
    "tests/fixtures/workflows/videotranscripttest-assembled-page.json",
    "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
  ].forEach(function (rel) {
    const page = JSON.parse(fs.readFileSync(path.join(repoRoot, rel), "utf8"));
    const model = buildPageModel(page);
    assert.equal(model.ok, true, rel + ": " + JSON.stringify(model.errors));
    model.diagnostics.archetypeInspection.forEach(function (insp) {
      assert.equal(insp.validationRoute, route.VALIDATION_ROUTE.CANONICAL_GRAMMAR);
      assert.equal(insp.runtimeAuthority, route.RUNTIME_AUTHORITY.SHARED_ARCHETYPE_GRAMMAR);
      assert.equal(insp.bindingSource, "canonical-grammar-binding");
      assert.equal(insp.registryMatch, false);
      assert.equal(insp.continuityMatch, false);
    });
  });
});

test("canonical binding does not depend on whole-sequence overlays", () => {
  const seq = ["explanation", "worked_thinking", "guided_practice", "verification"];
  const a = binding.buildCanonicalFunctionEnumVariant("understand", seq);
  const b = binding.buildCanonicalFunctionEnumVariant("analyse", seq);
  assert.equal(a.id.indexOf("understand"), 0);
  assert.equal(b.id.indexOf("analyse"), 0);
  assert.deepEqual(
    a.beats.map(function (beat) {
      return [beat.sourceFunction, beat.learnerRole, beat.taskSteps.take];
    }),
    b.beats.map(function (beat) {
      return [beat.sourceFunction, beat.learnerRole, beat.taskSteps.take];
    })
  );
});

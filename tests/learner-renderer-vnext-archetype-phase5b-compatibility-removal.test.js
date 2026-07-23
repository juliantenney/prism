/**
 * Sprint 69 Phase 5B — pre-launch compatibility removal tests.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const vocabulary = require(path.join(repoRoot, "lib", "episode-plan-v1-vocabulary.js"));
const grammar = require(path.join(repoRoot, "lib", "episode-plan-v1-archetype-grammar.js"));
const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));
const binding = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-canonical-binding.js"
));
const route = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-validation-route.js"
));
const archetypeRules = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-rules.js"
));
const buildPageModel = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "build-page-model.js"
)).buildPageModel;
const parity = require(path.join(repoRoot, "scripts", "report-episode-plan-grammar-parity.js"));

const POSITIVE_FIXTURES = [
  "tests/fixtures/workflows/videotranscripttest-assembled-page.json",
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
  "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json",
  "tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json",
  "tests/fixtures/educational-psychology-post-s68/repaired-assembled-page.json"
];

function pageWithPlan(activityId, archetype, beats, extras) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "phase-5b",
    activities: [
      Object.assign(
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
        },
        extras || {}
      )
    ]
  };
}

function summarizeBinding(variant) {
  return variant.beats.map(function (beat) {
    return {
      f: beat.sourceFunction,
      r: beat.learnerRole,
      t: beat.taskSteps.take,
      mt: beat.materialTypes.slice(),
      eo: !!beat.includeExpectedOutput
    };
  });
}

test("journey compatibility modules are removed from runtime", () => {
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
  assert.equal(archetypeRules.REGISTRY_ROLE, "removed-phase-5b");
  assert.equal(archetypeRules.selectArchetypeVariant("understand", ["orientation", "explanation", "check"]), null);
  assert.equal(route.VALIDATION_ROUTE.JOURNEY_COMPATIBILITY_REGISTRY, undefined);
});

POSITIVE_FIXTURES.forEach(function (rel) {
  test("positive fixture uses canonical-grammar only: " + path.basename(rel), () => {
    const page = JSON.parse(fs.readFileSync(path.join(repoRoot, rel), "utf8"));
    const model = buildPageModel(page);
    assert.equal(model.ok, true, JSON.stringify(model.errors));
    model.diagnostics.archetypeInspection.forEach(function (insp) {
      assert.equal(insp.validationRoute, "canonical-grammar");
      assert.equal(insp.runtimeAuthority, "shared-archetype-grammar");
      assert.equal(insp.bindingSource, "canonical-grammar-binding");
      insp.normalizedBeatSequence.forEach(function (beat) {
        assert.equal(
          vocabulary.FUNCTION_ENUM_SET[beat],
          true,
          beat + " must be FunctionEnum in " + rel
        );
      });
    });
  });
});

test("former compressed inputs fail closed", () => {
  const page = buildPageModel(
    pageWithPlan("A-c", "understand", ["orientation", "explanation", "check"])
  );
  assert.equal(page.ok, false);
  assert.ok(
    page.errors.some(function (row) {
      return (
        row.code === "MIXED_EPISODE_PLAN_VOCABULARY" ||
        row.code === "UNKNOWN_EPISODE_PLAN_BEAT"
      );
    })
  );
});

test("mixed FunctionEnum/compressed inputs fail closed", () => {
  const classification = route.classifySequenceVocabulary([
    "orientation",
    "explanation",
    "check"
  ]);
  assert.equal(classification.kind, "mixed_vocabulary");
  const resolved = route.resolveArchetypeValidation({
    activityId: "A",
    archetype: "understand",
    normalizedBeatSequence: ["orientation", "explanation", "check"]
  });
  assert.equal(resolved.ok, false);
  assert.equal(resolved.errors[0].code, "MIXED_EPISODE_PLAN_VOCABULARY");
});

test("no compatibility-registry runtime route", () => {
  assert.deepEqual(Object.keys(route.VALIDATION_ROUTE).sort(), [
    "CANONICAL_GRAMMAR",
    "MALFORMED",
    "UNKNOWN_OR_MIXED"
  ]);
});

test("formerly registered and unseen equivalent sequences share binding rules", () => {
  const seq = ["explanation", "worked_thinking", "guided_practice", "verification"];
  const a = binding.buildCanonicalFunctionEnumVariant("understand", seq);
  const b = binding.buildCanonicalFunctionEnumVariant("understand", seq);
  assert.deepEqual(summarizeBinding(a), summarizeBinding(b));
  const resolved = route.resolveArchetypeValidation({
    activityId: "A",
    archetype: "understand",
    normalizedBeatSequence: seq
  });
  assert.equal(resolved.ok, true);
  assert.deepEqual(summarizeBinding(resolved.variant), summarizeBinding(a));
});

test("composition does not depend on historical sequence identity", () => {
  const seq = ["explanation", "guided_practice", "verification"];
  const understand = binding.buildCanonicalFunctionEnumVariant("understand", seq);
  const apply = binding.buildCanonicalFunctionEnumVariant("apply", seq);
  assert.deepEqual(summarizeBinding(understand), summarizeBinding(apply));
});

test("shared grammar is sole educational legality authority", () => {
  assert.equal(
    grammar.validateSequenceAgainstGrammar("understand", [
      "explanation",
      "criteria_construction",
      "transition"
    ]).valid,
    false
  );
  const page = buildPageModel(
    pageWithPlan("A-bad", "understand", [
      "explanation",
      "criteria_construction",
      "transition"
    ])
  );
  assert.equal(page.ok, false);
  assert.ok(
    page.errors.some(function (row) {
      return row.code === "ARCHETYPE_GRAMMAR_VALIDATION_FAILED";
    })
  );
});

test("retirement report has zero runtime compatibility entries", () => {
  const report = parity.summarize(parity.collectCases());
  assert.equal(report.phase, "phase-5b");
  assert.equal(report.counts.runtimeCompatibilityEntries, 0);
  assert.equal(report.counts.positiveCompressedFixtures, 0);
  assert.equal(report.counts.positiveMixedVocabularyFixtures, 0);
  assert.equal(report.counts.canonicalWholeSequenceLegalityEntries, 0);
  assert.equal(report.counts.wholeSequenceCompositionDependencies, 0);
  assert.deepEqual(report.blockers, []);
  assert.equal(
    report.counts.canonicalGrammarAuthoritativeCases,
    report.counts.positiveRouteOk
  );
});

test("compressed beats never enter FunctionEnum", () => {
  Object.keys(route.NON_CANONICAL_COMPATIBILITY_BEATS).forEach(function (beat) {
    assert.equal(vocabulary.FUNCTION_ENUM_SET[beat], undefined);
  });
});

test("Node and browser validation routes match for VTT and unseen", () => {
  const browserPath = path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js");
  const source = fs.readFileSync(browserPath, "utf8");
  assert.doesNotMatch(source, /journey-compatibility-registry\.js/);
  assert.doesNotMatch(source, /canonical-composition-continuity\.js/);

  const sandbox = { console: console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "learner-renderer-vnext-browser.js" });

  const vtt = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "tests/fixtures/workflows/videotranscripttest-assembled-page.json"),
      "utf8"
    )
  );
  const node = buildPageModel(vtt);
  const browser = sandbox.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(vtt);
  assert.equal(node.ok, true);
  assert.equal(browser.error, null);
  assert.equal(
    node.diagnostics.archetypeInspection[0].validationRoute,
    browser.modelResult.diagnostics.archetypeInspection[0].validationRoute
  );
  assert.equal(
    node.diagnostics.archetypeInspection[0].runtimeAuthority,
    "shared-archetype-grammar"
  );
});

test("V1 template sequences still render through grammar", () => {
  const beats = templates.ARCHETYPE_TEMPLATES.understand.beats.map(function (b) {
    return b.function;
  });
  const page = buildPageModel(pageWithPlan("A-t", "understand", beats));
  assert.equal(page.ok, true, JSON.stringify(page.errors));
});

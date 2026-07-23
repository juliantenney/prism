/**
 * Sprint 69 Phase 5B — dual validation after registry removal.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const grammar = require(path.join(repoRoot, "lib", "episode-plan-v1-archetype-grammar.js"));
const vocabulary = require(path.join(repoRoot, "lib", "episode-plan-v1-vocabulary.js"));
const archetypeRules = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-rules.js"
));
const dual = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-grammar-dual-validation.js"
));
const route = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-validation-route.js"
));
const buildPageModel = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "build-page-model.js"
)).buildPageModel;
const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));
const parity = require(path.join(repoRoot, "scripts", "report-episode-plan-grammar-parity.js"));

function pageWithPlan(activityId, archetype, beats, extras) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "dual-validation",
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

test("structured grammar validation returns stable violation codes", () => {
  const missing = grammar.validateSequenceAgainstGrammar("understand", [
    "orientation",
    "verification",
    "transition"
  ]);
  assert.equal(missing.applicable, true);
  assert.equal(missing.valid, false);
  assert.ok(
    missing.violations.some(function (row) {
      return row.code === "MISSING_REQUIRED_BEAT" && row.beat === "explanation";
    })
  );

  const nonFe = grammar.validateSequenceAgainstGrammar("understand", [
    "orientation",
    "explanation",
    "check"
  ]);
  assert.equal(nonFe.applicable, false);
  assert.equal(nonFe.applicability, "NON_FUNCTION_ENUM_COMPATIBILITY_VOCABULARY");
  assert.ok(
    nonFe.violations.some(function (row) {
      return row.code === "NON_CANONICAL_BEAT" && row.beat === "check";
    })
  );
  assert.equal(vocabulary.FUNCTION_ENUM_SET.check, undefined);
});

test("observational comparison outcomes remain deterministic without runtime registry", () => {
  const feSeq = archetypeRules.EPISODE_PLAN_V1_SEQUENCES.understand.slice();
  const grammarAccept = dual.compareRegistryAndGrammar({
    archetype: "understand",
    normalizedBeatSequence: feSeq,
    registryMatch: false
  });
  assert.equal(grammarAccept.comparison, dual.COMPARISON.REGISTRY_REJECTS_GRAMMAR_ACCEPTS);
  assert.equal(grammarAccept.registry.accepts, false);
  assert.equal(grammarAccept.registry.authority, "removed-phase-5b");
  assert.equal(grammarAccept.phase, "phase-5b");

  const journey = ["orientation", "explanation", "check"];
  const journeyCmp = dual.compareRegistryAndGrammar({
    archetype: "understand",
    normalizedBeatSequence: journey,
    registryMatch: false
  });
  assert.equal(journeyCmp.comparison, dual.COMPARISON.GRAMMAR_NOT_APPLICABLE);
  assert.equal(journeyCmp.registry.accepts, false);

  const bothRejectSeq = ["explanation", "criteria_construction", "transition"];
  const bothReject = dual.compareRegistryAndGrammar({
    archetype: "understand",
    normalizedBeatSequence: bothRejectSeq,
    registryMatch: false
  });
  assert.equal(bothReject.comparison, dual.COMPARISON.REGISTRY_REJECTS_GRAMMAR_REJECTS);
});

test("canonical grammar authority: grammar-valid FunctionEnum renders", () => {
  const unregisteredButGrammarLegal = [
    "explanation",
    "example",
    "guided_practice",
    "verification",
    "transition"
  ];
  const okUnseen = buildPageModel(
    pageWithPlan("A-unreg", "understand", unregisteredButGrammarLegal)
  );
  assert.equal(okUnseen.ok, true, JSON.stringify(okUnseen.errors));
  assert.equal(
    okUnseen.errors.some(function (row) {
      return row.code === "UNKNOWN_ARCHETYPE_VARIANT";
    }),
    false
  );
  assert.equal(
    okUnseen.diagnostics.archetypeInspection[0].validationRoute,
    route.VALIDATION_ROUTE.CANONICAL_GRAMMAR
  );
  assert.equal(
    okUnseen.diagnostics.archetypeInspection[0].runtimeAuthority,
    route.RUNTIME_AUTHORITY.SHARED_ARCHETYPE_GRAMMAR
  );

  const registered = templates.ARCHETYPE_TEMPLATES.understand.beats.map(function (b) {
    return b.function;
  });
  const okPage = buildPageModel(pageWithPlan("A-reg", "understand", registered));
  assert.equal(okPage.ok, true, JSON.stringify(okPage.errors));
  assert.equal(
    okPage.diagnostics.archetypeInspection[0].runtimeAuthority,
    route.RUNTIME_AUTHORITY.SHARED_ARCHETYPE_GRAMMAR
  );
  assert.equal(okPage.diagnostics.archetypeInspection[0].registryMatch, false);
});

test("compressed and mixed sequences fail closed without UNKNOWN_ARCHETYPE_VARIANT", () => {
  const mixed = ["orientation", "explanation", "check"];
  const page = buildPageModel(pageWithPlan("A1", "understand", mixed));
  assert.equal(page.ok, false);
  assert.ok(
    page.errors.some(function (row) {
      return row.code === "MIXED_EPISODE_PLAN_VOCABULARY";
    })
  );
  assert.equal(
    page.errors.some(function (row) {
      return row.code === "UNKNOWN_ARCHETYPE_VARIANT";
    }),
    false
  );
});

test("compressed vocabulary never pollutes FunctionEnum", () => {
  assert.equal(vocabulary.FUNCTION_ENUM_SET.check_understanding, undefined);
  assert.equal(vocabulary.FUNCTION_ENUM_SET.practice, undefined);
  assert.equal(vocabulary.FUNCTION_ENUM_SET.check, undefined);
});

test("retirement report Phase 5B targets are met", () => {
  const report = parity.summarize(parity.collectCases());
  assert.equal(report.phase, "phase-5b");
  assert.equal(report.counts.runtimeCompatibilityEntries, 0);
  assert.deepEqual(report.blockers, []);
});

test("Node and browser dual-validation comparison outcomes match", () => {
  const browserPath = path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js");
  const source = fs.readFileSync(browserPath, "utf8");
  const sandbox = { console: console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "learner-renderer-vnext-browser.js" });
  assert.ok(sandbox.PRISM_LEARNER_RENDERER_VNEXT);

  const registered = templates.ARCHETYPE_TEMPLATES.apply.beats.map(function (b) {
    return b.function;
  });
  const page = pageWithPlan("A-parity", "apply", registered);
  const node = buildPageModel(page);
  const browser = sandbox.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(page);
  assert.equal(node.ok, true);
  assert.equal(browser.error, null);
  assert.equal(
    node.diagnostics.archetypeInspection[0].dualValidation.comparison,
    browser.modelResult.diagnostics.archetypeInspection[0].dualValidation.comparison
  );
  assert.equal(
    node.diagnostics.archetypeInspection[0].runtimeAuthority,
    browser.modelResult.diagnostics.archetypeInspection[0].runtimeAuthority
  );
});

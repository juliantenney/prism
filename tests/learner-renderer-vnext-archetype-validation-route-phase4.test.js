/**
 * Sprint 69 Phase 4/5B — renderer validation-route tests.
 * Phase 5B: sole route is canonical-grammar; compressed/mixed fail closed.
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
const buildPageModel = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "build-page-model.js"
)).buildPageModel;

const UNSEEN_BY_ARCHETYPE = Object.freeze({
  understand: [
    "explanation",
    "example",
    "guided_practice",
    "verification",
    "transition"
  ],
  apply: [
    "explanation",
    "worked_thinking",
    "guided_practice",
    "independent_performance",
    "verification",
    "transition"
  ],
  analyse: [
    "explanation",
    "guided_inquiry",
    "independent_performance",
    "verification",
    "transition"
  ],
  evaluate: [
    "criteria_exposition",
    "worked_judgement",
    "evaluative_judgement",
    "verification",
    "transition"
  ]
});

function pageWithPlan(activityId, archetype, beats, extras) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "phase-4-migration",
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

function assertNoUnknownVariant(errors) {
  assert.equal(
    errors.some(function (row) {
      return row.code === "UNKNOWN_ARCHETYPE_VARIANT";
    }),
    false,
    "UNKNOWN_ARCHETYPE_VARIANT must not appear on production validation"
  );
}

test("canonical FunctionEnum sequence renders through grammar authority", () => {
  const beats = templates.ARCHETYPE_TEMPLATES.understand.beats.map(function (b) {
    return b.function;
  });
  assert.equal(archetypeRules.selectArchetypeVariant("understand", beats), null);
  const page = buildPageModel(pageWithPlan("A-reg", "understand", beats));
  assert.equal(page.ok, true, JSON.stringify(page.errors));
  const insp = page.diagnostics.archetypeInspection[0];
  assert.equal(insp.validationRoute, route.VALIDATION_ROUTE.CANONICAL_GRAMMAR);
  assert.equal(insp.runtimeAuthority, route.RUNTIME_AUTHORITY.SHARED_ARCHETYPE_GRAMMAR);
  assert.equal(insp.match, true);
  assert.equal(insp.registryMatch, false);
  assert.equal(insp.bindingSource, "canonical-grammar-binding");
});

Object.keys(UNSEEN_BY_ARCHETYPE).forEach(function (archetype) {
  test(
    "grammar-valid unregistered canonical sequence renders for " + archetype,
    () => {
      const seq = UNSEEN_BY_ARCHETYPE[archetype];
      assert.equal(archetypeRules.selectArchetypeVariant(archetype, seq), null);
      const grammarResult = grammar.validateSequenceAgainstGrammar(archetype, seq);
      assert.equal(grammarResult.valid, true, JSON.stringify(grammarResult.violations));
      const page = buildPageModel(pageWithPlan("A-unseen-" + archetype, archetype, seq));
      assert.equal(page.ok, true, JSON.stringify(page.errors));
      assertNoUnknownVariant(page.errors);
      const insp = page.diagnostics.archetypeInspection[0];
      assert.equal(insp.validationRoute, route.VALIDATION_ROUTE.CANONICAL_GRAMMAR);
      assert.equal(insp.runtimeAuthority, route.RUNTIME_AUTHORITY.SHARED_ARCHETYPE_GRAMMAR);
      assert.equal(insp.registryMatch, false);
      assert.equal(insp.bindingSource, "canonical-grammar-binding");
      assert.equal(insp.dualValidation.renderingContinued, true);
      assert.equal(insp.dualValidation.renderingAffectedByGrammar, true);
    }
  );
});

test("grammar-invalid canonical sequence is not rescued by any compatibility path", () => {
  const invalid = ["orientation", "transition"];
  const grammarResult = grammar.validateSequenceAgainstGrammar("understand", invalid);
  assert.equal(grammarResult.valid, false);

  const resolved = route.resolveArchetypeValidation({
    activityId: "A-rescue",
    archetype: "understand",
    normalizedBeatSequence: invalid
  });
  assert.equal(resolved.ok, false);
  assert.equal(resolved.continuityMatch, false);
  assert.equal(resolved.errors[0].code, "ARCHETYPE_GRAMMAR_VALIDATION_FAILED");

  const page = buildPageModel(pageWithPlan("A-rescue", "understand", invalid));
  assert.equal(page.ok, false);
  assert.ok(
    page.errors.some(function (row) {
      return row.code === "ARCHETYPE_GRAMMAR_VALIDATION_FAILED";
    })
  );
  assertNoUnknownVariant(page.errors);
});

test("grammar-invalid canonical sequence emits structured grammar diagnostics", () => {
  const page = buildPageModel(
    pageWithPlan("A-invalid", "understand", [
      "explanation",
      "criteria_construction",
      "transition"
    ])
  );
  assert.equal(page.ok, false);
  const primary = page.errors.filter(function (row) {
    return row.code === "ARCHETYPE_GRAMMAR_VALIDATION_FAILED";
  });
  assert.equal(primary.length, 1);
  assert.equal(primary[0].validationRoute, route.VALIDATION_ROUTE.CANONICAL_GRAMMAR);
  assert.equal(primary[0].runtimeAuthority, route.RUNTIME_AUTHORITY.SHARED_ARCHETYPE_GRAMMAR);
  assert.ok(primary[0].grammarViolations.length > 0);
  assert.equal(primary[0].renderingContinued, false);
});

test("former journey-compressed sequence fails closed", () => {
  const journey = ["orientation", "explanation", "check"];
  assert.equal(archetypeRules.selectArchetypeVariant("understand", journey), null);
  const page = buildPageModel(pageWithPlan("A-j", "understand", journey));
  assert.equal(page.ok, false);
  assert.ok(
    page.errors.some(function (row) {
      return (
        row.code === "MIXED_EPISODE_PLAN_VOCABULARY" ||
        row.code === "UNKNOWN_EPISODE_PLAN_BEAT"
      );
    })
  );
  assertNoUnknownVariant(page.errors);
  assert.equal(vocabulary.FUNCTION_ENUM_SET.check, undefined);
});

test("mixed FunctionEnum/compressed fails closed with MIXED_EPISODE_PLAN_VOCABULARY", () => {
  const mixed = ["orientation", "explanation", "check"];
  const page = buildPageModel(pageWithPlan("A-mix", "understand", mixed));
  assert.equal(page.ok, false);
  const primary = page.errors.filter(function (row) {
    return row.code === "MIXED_EPISODE_PLAN_VOCABULARY";
  });
  assert.equal(primary.length, 1);
  assert.equal(primary[0].validationRoute, route.VALIDATION_ROUTE.UNKNOWN_OR_MIXED);
});

test("compressed-only sequence fails closed", () => {
  const compressed = ["orientation", "practice", "feedback"];
  // orientation is FunctionEnum — use pure compressed
  const pure = ["practice", "feedback", "check"];
  const page = buildPageModel(pageWithPlan("A-c", "apply", pure));
  assert.equal(page.ok, false);
  assert.ok(
    page.errors.some(function (row) {
      return row.code === "UNKNOWN_EPISODE_PLAN_BEAT";
    })
  );
});

test("compressed beats never enter FunctionEnum", () => {
  Object.keys(route.NON_CANONICAL_COMPATIBILITY_BEATS).forEach(function (beat) {
    assert.equal(
      vocabulary.FUNCTION_ENUM_SET[beat],
      undefined,
      beat + " must not be FunctionEnum"
    );
  });
  assert.equal(vocabulary.isApprovedFunction("check"), false);
  assert.equal(vocabulary.isApprovedFunction("practice"), false);
});

test("unknown beat fails closed", () => {
  const page = buildPageModel(
    pageWithPlan("A-unk", "understand", ["orientation", "explanation", "not_a_real_beat"])
  );
  assert.equal(page.ok, false);
  assert.ok(
    page.errors.some(function (row) {
      return row.code === "UNKNOWN_EPISODE_PLAN_BEAT";
    })
  );
});

test("unknown archetype fails closed", () => {
  const page = buildPageModel(
    pageWithPlan("A-arch", "invented_archetype", ["explanation", "transition"])
  );
  assert.equal(page.ok, false);
  assert.ok(
    page.errors.some(function (row) {
      return row.code === "UNKNOWN_ARCHETYPE";
    })
  );
});

test("malformed empty beat function fails closed", () => {
  const page = buildPageModel({
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "phase-4-migration",
    activities: [
      {
        activity_id: "A-empty",
        title: "A-empty",
        episode_plan: {
          archetype: "understand",
          beats: [{ function: "explanation" }, { function: "" }, { function: "transition" }]
        },
        materials: [{ material_id: "A-empty-M1", type: "text", body: "Body" }]
      }
    ]
  });
  assert.equal(page.ok, false);
  assert.ok(
    page.errors.some(function (row) {
      return row.code === "MALFORMED_EPISODE_PLAN_SEQUENCE";
    }),
    JSON.stringify(page.errors)
  );
});

test("canonical binding roles remain deterministic for unseen sequences", () => {
  const seq = UNSEEN_BY_ARCHETYPE.understand;
  const a = archetypeRules.buildCanonicalFunctionEnumVariant("understand", seq);
  const b = archetypeRules.buildCanonicalFunctionEnumVariant("understand", seq);
  assert.deepEqual(
    a.beats.map(function (beat) {
      return [beat.sourceFunction, beat.learnerRole];
    }),
    b.beats.map(function (beat) {
      return [beat.sourceFunction, beat.learnerRole];
    })
  );
  a.beats.forEach(function (beat) {
    assert.equal(
      beat.learnerRole,
      archetypeRules.V1_LEARNER_ROLE_BY_FUNCTION[beat.sourceFunction]
    );
  });
});

test("Educational Psychology regression remains green under canonical grammar", () => {
  const fixturePath = path.join(
    repoRoot,
    "tests",
    "fixtures",
    "educational-psychology-post-s68",
    "repaired-assembled-page.json"
  );
  const pageJson = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const page = buildPageModel(pageJson);
  assert.equal(page.ok, true, JSON.stringify(page.errors));
  page.diagnostics.archetypeInspection.forEach(function (insp) {
    assert.equal(insp.validationRoute, route.VALIDATION_ROUTE.CANONICAL_GRAMMAR);
    assert.equal(insp.runtimeAuthority, route.RUNTIME_AUTHORITY.SHARED_ARCHETYPE_GRAMMAR);
    assert.equal(insp.match, true);
  });
});

test("Node and browser validation routes match for unseen and compressed fail-closed", () => {
  const browserPath = path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js");
  const source = fs.readFileSync(browserPath, "utf8");
  const sandbox = { console: console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "learner-renderer-vnext-browser.js" });
  assert.ok(sandbox.PRISM_LEARNER_RENDERER_VNEXT);

  const unseenPage = pageWithPlan(
    "A-browser-unseen",
    "understand",
    UNSEEN_BY_ARCHETYPE.understand
  );
  const nodeUnseen = buildPageModel(unseenPage);
  const browserUnseen =
    sandbox.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(unseenPage);
  assert.equal(nodeUnseen.ok, true);
  assert.equal(browserUnseen.error, null);
  assert.equal(
    nodeUnseen.diagnostics.archetypeInspection[0].validationRoute,
    browserUnseen.modelResult.diagnostics.archetypeInspection[0].validationRoute
  );
  assert.equal(
    nodeUnseen.diagnostics.archetypeInspection[0].runtimeAuthority,
    browserUnseen.modelResult.diagnostics.archetypeInspection[0].runtimeAuthority
  );

  const journeyPage = pageWithPlan("A-browser-j", "understand", [
    "orientation",
    "explanation",
    "check"
  ]);
  const nodeJourney = buildPageModel(journeyPage);
  const browserJourney =
    sandbox.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(journeyPage);
  assert.equal(nodeJourney.ok, false);
  assert.ok(browserJourney.error);
  assert.equal(
    nodeJourney.diagnostics.archetypeInspection[0].validationRoute,
    browserJourney.modelResult.diagnostics.archetypeInspection[0].validationRoute
  );
  assert.equal(
    nodeJourney.diagnostics.archetypeInspection[0].validationRoute,
    route.VALIDATION_ROUTE.UNKNOWN_OR_MIXED
  );
});

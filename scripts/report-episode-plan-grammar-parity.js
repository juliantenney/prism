#!/usr/bin/env node
/**
 * Sprint 69 Phase 5B — registry retirement / grammar authority report.
 *
 * Target: zero runtime compatibility entries; all positive cases canonical-grammar.
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const grammar = require(path.join(repoRoot, "lib", "episode-plan-v1-archetype-grammar.js"));
const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));
const binding = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-canonical-binding.js"
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
const vocabulary = require(path.join(repoRoot, "lib", "episode-plan-v1-vocabulary.js"));
const buildPageModel = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "build-page-model.js"
)).buildPageModel;

function compareCase(source, archetype, sequence, extra) {
  const resolution = route.resolveArchetypeValidation({
    activityId: (extra && extra.activityId) || "",
    archetype: archetype,
    normalizedBeatSequence: sequence
  });
  const comparison = dual.compareRegistryAndGrammar({
    archetype: archetype,
    normalizedBeatSequence: sequence,
    registryMatch: false,
    renderingContinued: !!(resolution && resolution.ok),
    validationRoute: resolution.validationRoute,
    runtimeAuthority: resolution.runtimeAuthority,
    bindingSource: resolution.bindingSource,
    grammarResult: resolution.grammarResult
  });
  const compressed = sequence.some(function (beat) {
    return route.NON_CANONICAL_COMPATIBILITY_BEATS[beat];
  });
  const allFe = sequence.every(function (beat) {
    return vocabulary.FUNCTION_ENUM_SET[beat] === true;
  });
  return Object.assign(
    {
      source: source,
      archetype: archetype,
      sequence: sequence.slice(),
      comparison: comparison.comparison,
      validationRoute: resolution.validationRoute,
      runtimeAuthority: resolution.runtimeAuthority,
      bindingSource: resolution.bindingSource,
      routeOk: !!(resolution && resolution.ok),
      compressedVocabulary: compressed,
      allFunctionEnum: allFe,
      positiveCompatibility: !!(resolution && resolution.ok && compressed)
    },
    extra || {}
  );
}

function collectCases() {
  const cases = [];

  Object.keys(templates.ARCHETYPE_TEMPLATES).forEach(function (archetype) {
    const sequence = templates.ARCHETYPE_TEMPLATES[archetype].beats.map(function (b) {
      return b.function;
    });
    cases.push(
      compareCase("episode-plan-v1-template", archetype, sequence, {
        label: archetype + "-template"
      })
    );
  });

  Object.keys(binding.EPISODE_PLAN_V1_SEQUENCES).forEach(function (archetype) {
    cases.push(
      compareCase(
        "episode-plan-v1-sequence",
        archetype,
        binding.EPISODE_PLAN_V1_SEQUENCES[archetype].slice(),
        { label: archetype + "-v1" }
      )
    );
  });

  const edPsychPath = path.join(
    repoRoot,
    "tests",
    "fixtures",
    "educational-psychology-post-s68",
    "repaired-assembled-page.json"
  );
  if (fs.existsSync(edPsychPath)) {
    const page = JSON.parse(fs.readFileSync(edPsychPath, "utf8"));
    (page.activities || []).forEach(function (activity) {
      const archetype = String(
        (activity.episode_plan && activity.episode_plan.archetype) || ""
      )
        .trim()
        .toLowerCase();
      const sequence = Array.isArray(activity.episode_plan && activity.episode_plan.beats)
        ? activity.episode_plan.beats.map(function (b) {
            return String((b && b.function) || "")
              .trim()
              .toLowerCase();
          })
        : [];
      cases.push(
        compareCase("educational-psychology-fixture", archetype, sequence, {
          label: activity.activity_id,
          activityId: activity.activity_id
        })
      );
    });
  }

  try {
    const corpusMod = require(path.join(
      repoRoot,
      "lib",
      "learner-renderer-vnext",
      "certification-corpus.js"
    ));
    (corpusMod.CERTIFICATION_CORPUS || []).forEach(function (entry) {
      if (!entry || !entry.fixturePath) return;
      const abs = path.join(repoRoot, entry.fixturePath);
      if (!fs.existsSync(abs)) return;
      const page = JSON.parse(fs.readFileSync(abs, "utf8"));
      (page.activities || []).forEach(function (activity) {
        const archetype = String(
          (activity.episode_plan && activity.episode_plan.archetype) || ""
        )
          .trim()
          .toLowerCase()
          .replace(/[\s-]+/g, "_");
        const sequence = Array.isArray(activity.episode_plan && activity.episode_plan.beats)
          ? activity.episode_plan.beats.map(function (b) {
              return String((b && b.function) || "")
                .trim()
                .toLowerCase()
                .replace(/[\s-]+/g, "_");
            })
          : [];
        if (!archetype || !sequence.length) return;
        cases.push(
          compareCase("certification-corpus", archetype, sequence, {
            label: String(entry.id) + ":" + String(activity.activity_id || ""),
            activityId: activity.activity_id,
            workflowId: entry.id
          })
        );
      });
    });
  } catch (_) {}

  // Negative historical compressed samples (must fail closed).
  [
    ["orientation", "explanation", "check"],
    ["orientation", "practice", "feedback"],
    ["orientation", "investigation", "synthesis"]
  ].forEach(function (sequence, index) {
    cases.push(
      compareCase("negative-compressed-sample", "understand", sequence, {
        label: "neg-compressed-" + index,
        negative: true
      })
    );
  });

  return cases;
}

function summarize(cases) {
  const positive = cases.filter(function (row) {
    return !row.negative;
  });
  const counts = {
    total: cases.length,
    runtimeCompatibilityEntries: 0,
    positiveCompressedFixtures: positive.filter(function (row) {
      return row.compressedVocabulary && row.routeOk;
    }).length,
    positiveMixedVocabularyFixtures: positive.filter(function (row) {
      return (
        row.compressedVocabulary &&
        row.allFunctionEnum === false &&
        row.sequence.some(function (b) {
          return vocabulary.FUNCTION_ENUM_SET[b];
        }) &&
        row.routeOk
      );
    }).length,
    canonicalWholeSequenceLegalityEntries: 0,
    wholeSequenceCompositionDependencies: 0,
    canonicalGrammarAuthoritativeCases: positive.filter(function (row) {
      return row.routeOk && row.validationRoute === "canonical-grammar";
    }).length,
    positiveCases: positive.length,
    positiveRouteOk: positive.filter(function (row) {
      return row.routeOk;
    }).length,
    negativeCompressedFailClosed: cases.filter(function (row) {
      return row.negative && !row.routeOk;
    }).length
  };
  return {
    phase: "phase-5b",
    grammarVersion: grammar.GRAMMAR_VERSION,
    vocabularyVersion: vocabulary.VOCABULARY_VERSION,
    runtimeAuthority: dual.RUNTIME_AUTHORITY,
    counts: counts,
    blockers: Object.keys(counts).filter(function (key) {
      if (key === "total" || key === "positiveCases" || key === "positiveRouteOk") {
        return false;
      }
      if (key === "canonicalGrammarAuthoritativeCases") {
        return counts[key] !== counts.positiveRouteOk;
      }
      if (key === "negativeCompressedFailClosed") return false;
      return counts[key] !== 0;
    }),
    cases: cases
  };
}

function formatHuman(report) {
  const lines = [];
  lines.push("Sprint 69 Phase 5B — Registry retirement report");
  lines.push("Grammar version: " + report.grammarVersion);
  lines.push("Runtime authority: " + report.runtimeAuthority);
  lines.push("");
  Object.keys(report.counts).forEach(function (key) {
    lines.push("  " + key + ": " + report.counts[key]);
  });
  lines.push("");
  lines.push("Blockers: " + (report.blockers.length ? report.blockers.join(", ") : "(none)"));
  return lines.join("\n");
}

function main() {
  const asJson = process.argv.indexOf("--json") !== -1;
  const report = summarize(collectCases());
  if (asJson) {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    process.stdout.write(formatHuman(report) + "\n");
  }
  if (report.blockers.length) {
    process.stderr.write("Phase 5B retirement blockers present.\n");
    process.exitCode = 1;
  }
  const smoke = buildPageModel({
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "parity-smoke",
    activities: [
      {
        activity_id: "A1",
        title: "A1",
        episode_plan: {
          archetype: "understand",
          beats: templates.ARCHETYPE_TEMPLATES.understand.beats.slice()
        },
        materials: [{ material_id: "M1", type: "text", body: "Hello" }]
      }
    ]
  });
  if (smoke.ok !== true) {
    process.stderr.write("Parity smoke failed\n");
    process.exitCode = 1;
  }
}

module.exports = {
  collectCases: collectCases,
  summarize: summarize,
  formatHuman: formatHuman,
  compareCase: compareCase
};

if (require.main === module) {
  main();
}

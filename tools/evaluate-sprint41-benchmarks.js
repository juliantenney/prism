#!/usr/bin/env node
/**
 * Sprint 41 Slice 4 — run EQF evaluator on known benchmark fixtures (if present).
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const diagnostic = require("./evaluate-educational-quality-framework.js");
const evaluator = require("../lib/educational-quality-framework-evaluator.js");

var BENCHMARK_FIXTURES = [
  {
    label: "Inflation Workshop Page",
    relativePath: "tests/fixtures/page-render/ld-inflation-workshop-page.json"
  },
  {
    label: "Inflation Workshop Page (full)",
    relativePath: "tests/fixtures/page-render/ld-inflation-workshop-page-full.json"
  }
];

function buildBenchmarkSection(label, evaluated) {
  var result = evaluated.result;
  var lines = [];
  lines.push(label + ":");
  lines.push("Score: " + result.score + "/8");
  lines.push("");
  lines.push("Dimensions:");
  evaluator.DIMENSION_ORDER.forEach(function (key) {
    var dim = result.dimensions[key];
    var mark = dim && dim.present ? "present" : "absent";
    lines.push("- " + diagnostic.dimensionLabel(key) + ": " + mark);
  });
  lines.push("");
  lines.push("Summary: " + evaluator.summariseEducationalQualityFrameworkEvidence(result));
  lines.push("");
  return lines.join("\n");
}

function runSprint41Benchmarks(options) {
  var opts = options && typeof options === "object" ? options : {};
  var repoRoot = opts.repoRoot || path.resolve(__dirname, "..");
  var rule = "=".repeat(50);
  var lines = [rule, "Sprint 41 Educational Framework Benchmarks", rule, ""];
  var evaluatedAny = false;

  BENCHMARK_FIXTURES.forEach(function (fixture) {
    var absPath = path.join(repoRoot, fixture.relativePath);
    if (!fs.existsSync(absPath)) {
      lines.push(fixture.label + ":");
      lines.push("(fixture not found — skipped)");
      lines.push("");
      return;
    }
    evaluatedAny = true;
    var evaluated = diagnostic.evaluateFile(absPath, { threshold: evaluator.DEFAULT_THRESHOLD });
    lines.push(buildBenchmarkSection(fixture.label, evaluated));
  });

  if (!evaluatedAny) {
    lines.push("No benchmark fixtures found.");
    lines.push("");
  }

  return {
    report: lines.join("\n").trim() + "\n",
    evaluatedAny: evaluatedAny
  };
}

function runBenchmarkCli() {
  try {
    var output = runSprint41Benchmarks();
    process.stdout.write(output.report);
    return 0;
  } catch (e) {
    process.stderr.write("Error: " + (e && e.message ? e.message : e) + "\n");
    return 1;
  }
}

if (require.main === module) {
  process.exit(runBenchmarkCli());
}

module.exports = {
  BENCHMARK_FIXTURES: BENCHMARK_FIXTURES,
  buildBenchmarkSection: buildBenchmarkSection,
  runSprint41Benchmarks: runSprint41Benchmarks,
  runBenchmarkCli: runBenchmarkCli
};

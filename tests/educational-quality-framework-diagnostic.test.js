/**
 * Sprint 41 Slice 4 — diagnostic tooling tests.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const diagnostic = require("../tools/evaluate-educational-quality-framework.js");
const benchmarks = require("../tools/evaluate-sprint41-benchmarks.js");
const evaluator = require("../lib/educational-quality-framework-evaluator.js");

const STRONG_JSON = {
  activities: [
    {
      activity_id: "A1",
      activity_preamble: "Learner journey begins with orientation and progression.",
      learner_task: "Explain and distinguish the concepts, then compare options and justify your decision.",
      expected_output: "Evidence of what you now understand, can do, and can judge independently.",
      support_note: "Check your thinking: reflect on uncertainty and next steps."
    }
  ]
};

const THIN_JSON = {
  activities: [{ activity_id: "A1", learner_task: "Read.", expected_output: "Done." }]
};

function writeTempFile(name, content) {
  var dir = fs.mkdtempSync(path.join(os.tmpdir(), "eqf-diag-"));
  var filePath = path.join(dir, name);
  fs.writeFileSync(filePath, content, "utf8");
  return { dir: dir, filePath: filePath };
}

function cleanupDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (_e) {}
}

test("41D-1: single-file diagnostic report includes score, dimensions, summary, evidence", () => {
  var tmp = writeTempFile("strong.json", JSON.stringify(STRONG_JSON));
  try {
    var evaluated = diagnostic.evaluateFile(tmp.filePath);
    var report = diagnostic.buildDiagnosticReport(evaluated);
    assert.match(report, /Educational Quality Framework Diagnostic/);
    assert.match(report, /Score:/);
    assert.match(report, /\d+ \/ 8/);
    assert.match(report, /Dimensions:/);
    assert.match(report, /Summary:/);
    assert.equal(typeof evaluated.result.score, "number");
    assert.ok(evaluated.result.dimensions);
    assert.ok(report.includes("\u2713") || report.includes("\u2717"));
    assert.match(report, /Evidence:/);
  } finally {
    cleanupDir(tmp.dir);
  }
});

test("41D-1: HTML file is evaluated as text/HTML corpus", () => {
  var tmp = writeTempFile(
    "page.html",
    "<html><body><p>Compare interpretations and justify your recommendation.</p></body></html>"
  );
  try {
    var evaluated = diagnostic.evaluateFile(tmp.filePath);
    assert.equal(evaluated.kind, "html");
    assert.equal(typeof evaluated.result.score, "number");
    assert.equal(evaluated.result.dimensions.judgement.present, true);
  } finally {
    cleanupDir(tmp.dir);
  }
});

test("41D-1: comparison mode reports numeric delta and dimension changes", () => {
  var baseTmp = writeTempFile("baseline.json", JSON.stringify(THIN_JSON));
  var candTmp = writeTempFile("candidate.json", JSON.stringify(STRONG_JSON));
  try {
    var baseline = diagnostic.evaluateFile(baseTmp.filePath);
    var candidate = diagnostic.evaluateFile(candTmp.filePath);
    var comparison = diagnostic.buildComparisonReport(baseline, candidate);
    assert.match(comparison, /Baseline Score:/);
    assert.match(comparison, /Candidate Score:/);
    assert.match(comparison, /Delta:/);
    assert.match(comparison, /Dimension Changes:/);
    var delta = candidate.result.score - baseline.result.score;
    assert.match(comparison, new RegExp("Delta:\\s*" + (delta >= 0 ? "\\+" : "") + delta));
    var changes = diagnostic.compareDimensionResults(baseline.result, candidate.result);
    assert.ok(Array.isArray(changes));
    if (changes.length) {
      changes.forEach(function (change) {
        assert.ok(change.label);
      });
    }
  } finally {
    cleanupDir(baseTmp.dir);
    cleanupDir(candTmp.dir);
  }
});

test("41D-1: missing file handling returns non-zero exit and does not evaluate", () => {
  var code = diagnostic.runDiagnosticCli(["definitely-missing-eqf-file.json"], {
    stdout: { write: () => {} },
    stderr: { write: () => {} }
  });
  assert.equal(code, 1);
});

test("41D-1: CLI compare mode executes successfully on temp files", () => {
  var baseTmp = writeTempFile("baseline.json", JSON.stringify(THIN_JSON));
  var candTmp = writeTempFile("candidate.json", JSON.stringify(STRONG_JSON));
  try {
    var result = spawnSync(
      process.execPath,
      [
        path.join(repoRoot, "tools/evaluate-educational-quality-framework.js"),
        baseTmp.filePath,
        "--compare",
        candTmp.filePath
      ],
      { encoding: "utf8", cwd: repoRoot }
    );
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Baseline Score:/);
    assert.match(result.stdout, /Candidate Score:/);
    assert.match(result.stdout, /Delta:/);
  } finally {
    cleanupDir(baseTmp.dir);
    cleanupDir(candTmp.dir);
  }
});

test("41D-1: benchmark runner does not throw when fixtures missing", () => {
  var output = benchmarks.runSprint41Benchmarks({
    repoRoot: path.join(repoRoot, "tests", "fixtures", "nonexistent-benchmark-root")
  });
  assert.match(output.report, /Sprint 41 Educational Framework Benchmarks/);
  assert.equal(output.evaluatedAny, false);
  assert.match(output.report, /No benchmark fixtures found|skipped/i);
});

test("41D-1: benchmark runner works when inflation fixture present", () => {
  var inflationPath = path.join(
    repoRoot,
    "tests/fixtures/page-render/ld-inflation-workshop-page.json"
  );
  if (!fs.existsSync(inflationPath)) {
    assert.ok(true, "inflation fixture absent — skip");
    return;
  }
  var output = benchmarks.runSprint41Benchmarks({ repoRoot: repoRoot });
  assert.equal(output.evaluatedAny, true);
  assert.match(output.report, /Inflation Workshop Page/);
  assert.match(output.report, /Score:\s*\d+\/8/);
  assert.match(output.report, /Dimensions:/);
  assert.match(output.report, /Summary:/);
});

test("41D-1: educational score never fails CLI exit for low-scoring artefact", () => {
  var tmp = writeTempFile("thin.json", JSON.stringify(THIN_JSON));
  try {
    var result = spawnSync(
      process.execPath,
      [path.join(repoRoot, "tools/evaluate-educational-quality-framework.js"), tmp.filePath],
      { encoding: "utf8", cwd: repoRoot }
    );
    assert.equal(result.status, 0);
    assert.match(result.stdout, /BELOW|PASS/);
    var evaluated = diagnostic.evaluateFile(tmp.filePath);
    assert.equal(evaluated.result.ok, false);
  } finally {
    cleanupDir(tmp.dir);
  }
});

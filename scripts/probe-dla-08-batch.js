/**
 * Sprint 56 stabilisation — run N DLA-08 probes (same settings) and aggregate pass rates.
 * Run: node scripts/probe-dla-08-batch.js [runs=3]
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const runs = Math.max(1, parseInt(process.argv[2] || "3", 10));
const fixtureDir = path.join(repoRoot, "tests/fixtures/dla");
const reportPath = path.join(
  repoRoot,
  "docs/development/prompt-contracts/artefacts/dla-08-stabilisation-batch-report.json"
);

const results = [];

for (let i = 1; i <= runs; i += 1) {
  const outJson = path.join(fixtureDir, `rna-hcv-dla-08-stab-run-${i}.json`);
  const backup = path.join(fixtureDir, "rna-hcv-dla-08-run.json");
  if (fs.existsSync(backup)) {
    fs.copyFileSync(backup, path.join(fixtureDir, `rna-hcv-dla-08-run-pre-batch-${i}.json`));
  }
  console.log(`\n=== Probe run ${i}/${runs} ===`);
  const proc = spawnSync("node", ["scripts/probe-dla-08-copy-validation.js"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env
  });
  process.stdout.write(proc.stdout || "");
  process.stderr.write(proc.stderr || "");
  if (proc.status !== 0) {
    console.error(`Run ${i} failed with exit ${proc.status}`);
    results.push({ run: i, error: true, exitCode: proc.status });
    continue;
  }
  let summary = null;
  try {
    const lines = (proc.stdout || "").trim().split("\n");
    const jsonStart = lines.findIndex((l) => l.trim() === "{");
    if (jsonStart >= 0) {
      summary = JSON.parse(lines.slice(jsonStart).join("\n"));
    }
  } catch (_e) {
    summary = null;
  }
  if (fs.existsSync(backup)) {
    fs.copyFileSync(backup, outJson);
  }
  if (summary && summary.current) {
    results.push({
      run: i,
      passMandatory: summary.current.passMandatory,
      activityCount: summary.current.activityCount,
      passMandatoryPct: summary.current.passMandatoryPct,
      emittedCoreChars: summary.emittedCoreChars,
      histogram: summary.histogram
    });
  } else {
    results.push({ run: i, error: true, parseFailed: true });
  }
}

const ok = results.filter((r) => !r.error);
const meanPct =
  ok.length > 0
    ? Math.round((ok.reduce((s, r) => s + r.passMandatoryPct, 0) / ok.length) * 10) / 10
    : 0;
const aggregate = {
  date: new Date().toISOString().slice(0, 10),
  runs,
  results,
  meanPassMandatoryPct: meanPct,
  best: ok.length ? ok.reduce((a, b) => (a.passMandatoryPct >= b.passMandatoryPct ? a : b)) : null,
  worst: ok.length ? ok.reduce((a, b) => (a.passMandatoryPct <= b.passMandatoryPct ? a : b)) : null,
  threshold80MetRuns: ok.filter((r) => r.passMandatoryPct >= 80).length,
  reliable80: ok.length > 0 && ok.every((r) => r.passMandatoryPct >= 80)
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(aggregate, null, 2), "utf8");
console.log("\n=== Batch aggregate ===");
console.log(JSON.stringify(aggregate, null, 2));

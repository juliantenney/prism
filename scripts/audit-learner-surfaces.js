#!/usr/bin/env node
"use strict";

/**
 * S68-IMP-016 — Emit learner-surface audit records to stdout or optional files.
 *
 * Usage:
 *   node scripts/audit-learner-surfaces.js
 *   node scripts/audit-learner-surfaces.js --json > learner-surface-audit.json
 *   node scripts/audit-learner-surfaces.js --md
 */

var fs = require("node:fs");
var path = require("node:path");

var audit = require("../lib/learner-renderer-vnext/audit-learner-surfaces");

var repoRoot = path.resolve(__dirname, "..");
var args = process.argv.slice(2);
var writeJson = args.indexOf("--json") >= 0 || args.indexOf("--write-json") >= 0;
var writeMd = args.indexOf("--md") >= 0 || args.indexOf("--write-md") >= 0;
var outDir = null;

args.forEach(function (arg, index) {
  if (arg === "--out" && args[index + 1]) outDir = args[index + 1];
});

var result = audit.runLearnerSurfaceAudit({ repoRoot: repoRoot });

var summary = {
  activityCount: result.records.length,
  adequacyTotals: result.adequacyTotals,
  surfaceTotals: result.surfaceTotals,
  recommendation: result.recommendation
};

if (writeJson) {
  process.stdout.write(JSON.stringify(result, null, 2));
} else if (writeMd) {
  process.stdout.write(result.markdown + "\n");
} else {
  console.log(JSON.stringify(summary, null, 2));
  console.log("\n" + result.markdown);
}

if (outDir) {
  var abs = path.resolve(outDir);
  fs.mkdirSync(abs, { recursive: true });
  fs.writeFileSync(path.join(abs, "learner-surface-audit.json"), JSON.stringify(result, null, 2));
  fs.writeFileSync(path.join(abs, "learner-surface-audit.md"), result.markdown + "\n");
  console.error("Wrote audit artefacts to " + abs);
}

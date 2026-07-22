#!/usr/bin/env node
"use strict";

/**
 * S68-IMP-020 — Production certification CLI for learner-renderer-vNext.
 *
 * Usage:
 *   node scripts/certify-learner-renderer-vnext.js
 *   node scripts/certify-learner-renderer-vnext.js --json
 *   node scripts/certify-learner-renderer-vnext.js --md
 *   node scripts/certify-learner-renderer-vnext.js --out artifacts
 *   node scripts/certify-learner-renderer-vnext.js --no-browser
 */

var path = require("node:path");
var certify = require("../lib/learner-renderer-vnext/certify-learner-renderer");

var repoRoot = path.resolve(__dirname, "..");
var args = process.argv.slice(2);
var writeJson = args.indexOf("--json") >= 0;
var writeMd = args.indexOf("--md") >= 0;
var noBrowser = args.indexOf("--no-browser") >= 0;
var outDir = null;

args.forEach(function (arg, index) {
  if (arg === "--out" && args[index + 1]) outDir = args[index + 1];
});

var report = certify.runLearnerRendererCertification({
  repoRoot: repoRoot,
  compareBrowser: !noBrowser,
  writeArtifacts: true,
  artifactsDir: outDir || path.join(repoRoot, "artifacts")
});

if (writeJson) {
  var clone = Object.assign({}, report);
  delete clone.markdown;
  process.stdout.write(JSON.stringify(clone, null, 2));
} else if (writeMd) {
  process.stdout.write(report.markdown + "\n");
} else {
  console.log(
    JSON.stringify(
      {
        certificationState: report.summary.certificationState,
        status: report.summary.status,
        workflows: report.summary.workflows,
        fails: report.summary.fails,
        warnings: report.summary.warnings,
        capabilityCoverage: report.capabilityCoverage,
        artifactPaths: report.artifactPaths
      },
      null,
      2
    )
  );
  console.log("\n" + report.markdown);
}

if (report.artifactPaths) {
  console.error("Wrote certification artefacts to " + path.dirname(report.artifactPaths.json));
}

process.exitCode = report.summary.exitCode;

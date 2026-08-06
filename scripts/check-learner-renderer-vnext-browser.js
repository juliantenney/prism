"use strict";

/**
 * Fail if committed vNext browser artefacts do not match a fresh build from source.
 * Development/test tooling only — not a production runtime.
 *
 * Run: node scripts/check-learner-renderer-vnext-browser.js
 *   or: npm run check:learner-renderer-vnext-browser
 */
const fs = require("node:fs");
const path = require("node:path");
const {
  generateTargetOutputs,
  repoRoot
} = require("./build-learner-renderer-vnext-browser.js");

function checkLearnerRendererVnextBrowserFreshness() {
  var outputs = generateTargetOutputs();
  var stale = [];
  var missing = [];

  outputs.forEach(function (item) {
    var rel = path.relative(repoRoot, item.outPath).replace(/\\/g, "/");
    if (!fs.existsSync(item.outPath)) {
      missing.push(rel);
      return;
    }
    var onDisk = fs.readFileSync(item.outPath, "utf8");
    if (onDisk !== item.content) {
      stale.push(rel);
    }
  });

  return {
    ok: stale.length === 0 && missing.length === 0,
    outputs: outputs.map(function (item) {
      return path.relative(repoRoot, item.outPath).replace(/\\/g, "/");
    }),
    stale: stale,
    missing: missing
  };
}

function main() {
  var result = checkLearnerRendererVnextBrowserFreshness();
  if (result.ok) {
    console.log(
      "OK: vNext browser artefacts match source (" + result.outputs.join(", ") + ")."
    );
    process.exit(0);
  }
  if (result.missing.length) {
    console.error("Missing generated artefact(s):\n  - " + result.missing.join("\n  - "));
  }
  if (result.stale.length) {
    console.error(
      "Stale generated artefact(s) (do not match lib/learner-renderer-vnext source):\n  - " +
        result.stale.join("\n  - ")
    );
  }
  console.error(
    "Rebuild with: npm run build:learner-renderer-vnext-browser\n" +
      "Then re-run: npm run check:learner-renderer-vnext-browser"
  );
  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = {
  checkLearnerRendererVnextBrowserFreshness: checkLearnerRendererVnextBrowserFreshness
};

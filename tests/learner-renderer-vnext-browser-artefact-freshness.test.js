"use strict";

/**
 * S74A-T-020 — generated browser artefact freshness gate.
 * Node-based test evidence that committed artefacts match source rebuild.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {
  checkLearnerRendererVnextBrowserFreshness
} = require("../scripts/check-learner-renderer-vnext-browser.js");

test("committed vNext browser artefacts match a fresh build from source", function () {
  var result = checkLearnerRendererVnextBrowserFreshness();
  assert.equal(
    result.ok,
    true,
    "Stale or missing artefacts: " +
      JSON.stringify({ stale: result.stale, missing: result.missing }) +
      " — run npm run build:learner-renderer-vnext-browser"
  );
  assert.ok(
    result.outputs.indexOf("lib/learner-renderer-vnext-browser.js") >= 0,
    "freshness check must include the browser-loaded shell artefact"
  );
});

test("index.html loads the browser-loaded vNext artefact", function () {
  var fs = require("node:fs");
  var indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.match(
    indexHtml,
    /src=["']lib\/learner-renderer-vnext-browser\.js[^"']*["']/,
    "index.html must load lib/learner-renderer-vnext-browser.js"
  );
});

test("index.html browser artefact cache-buster is not the pre-timing-projection token", function () {
  var fs = require("node:fs");
  var indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  var match = indexHtml.match(
    /src=["']lib\/learner-renderer-vnext-browser\.js\?v=([^"']+)["']/
  );
  assert.ok(match, "index.html must load learner-renderer-vnext-browser.js with a ?v= cache token");
  assert.notEqual(
    match[1],
    "20260729-s70-expandable-images",
    "cache-buster must be refreshed after timing-projection / estimated_minutes support"
  );
  assert.match(match[1], /timing|202608/, "cache token should reflect the timing repair generation");
});

"use strict";

/**
 * Regenerate a bare learner-page HTML preview for S81 R4 revision-reminder checks.
 * Output is written under ./out/ (gitignored).
 */

const fs = require("fs");
const path = require("path");
const { renderLearnerPageHtml } = require("../../lib/learner-renderer-vnext");

const repoRoot = path.resolve(__dirname, "..", "..");
const fixture = path.join(
  repoRoot,
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
);
const outDir = path.join(__dirname, "out");
const out = path.join(outDir, "heteroscedasticity-revision-reminder-bare.html");
const page = JSON.parse(fs.readFileSync(fixture, "utf8"));
const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;

const html =
  "<!doctype html><html><head><meta charset=utf-8>" +
  "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
  "<title>S81 R4 revision reminder (bare)</title>" +
  "<script>window.__PRISM_R4_DEBUG__=true;</script>" +
  "</head><body>" +
  rendered +
  "</body></html>";

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(out, html);
console.log("Wrote", out, "bytes=", html.length);

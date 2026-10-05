"use strict";

/** PB-S-007 smoke — historical IMP-017 compose/golden asserts removed. */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

const fixturePath = path.join(
  __dirname,
  "..",
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

test("IMP-017 smoke: heteroscedasticity page renders in moments mode", () => {
  const result = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" });
  assert.equal(result.error, null);
  assert.match(result.html, /util-learner-renderer-vnext/);
  assert.match(result.html, /data-composition-mode="moments"/);
});

test("IMP-017 smoke: Do moments include learner-facing workspaces or materials", () => {
  const html = renderLearnerPageHtml(loadFixture(), { compositionMode: "moments" }).html;
  assert.match(html, /data-composition-moment="do"/);
  assert.match(html, /data-material-type=|data-workspace-kind=/);
});

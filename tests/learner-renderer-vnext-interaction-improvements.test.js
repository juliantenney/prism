"use strict";

/** PB-S-007 smoke — historical interaction/golden asserts removed. */

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

test("interaction smoke: page renders with draft controls region", () => {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const result = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(result.error, null);
  assert.match(result.html, /data-learner-draft-controls|util-learner-draft-controls/);
});

test("interaction smoke: composed activities expose moment structure", () => {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  assert.match(html, /data-composed-activity-count=/);
  assert.match(html, /util-activity/);
});

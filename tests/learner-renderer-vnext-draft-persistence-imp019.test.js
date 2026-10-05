"use strict";

/** PB-S-007 smoke — historical IMP-019 persistence golden asserts removed. */

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

test("IMP-019 smoke: page declares persistence storage key", () => {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  assert.match(html, /data-persistence-storage-key=/);
  assert.match(html, /learner-renderer-vnext:draft:/);
});

test("IMP-019 smoke: draft status affordance present", () => {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  assert.match(html, /data-learner-draft-status|util-learner-draft-status/);
});

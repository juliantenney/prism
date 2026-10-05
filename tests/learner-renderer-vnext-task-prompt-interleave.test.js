"use strict";

/** PB-S-007 smoke — historical task/prompt interleave golden asserts removed. */

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

test("task/prompt interleave smoke: Your task moments render", () => {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  assert.match(html, /util-composition-moment-heading|Your task/);
});

test("task/prompt interleave smoke: beat instructions appear in Do moments", () => {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  assert.match(html, /util-beat-instruction|data-composition-moment="do"/);
});

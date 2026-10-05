"use strict";

/** PB-S-007 smoke — historical IMP-018 ordering golden asserts removed. */

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

test("IMP-018 smoke: moments export renders without error", () => {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const result = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(result.error, null);
  assert.match(result.html, /util-composition-moment/);
});

test("IMP-018 smoke: orientation and activities regions present", () => {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  assert.match(html, /data-region="orientation"|util-page-orientation/);
  assert.match(html, /util-activity-title/);
});

"use strict";

/** PB-S-007 smoke — GAM kitchen-sink audit golden asserts removed. */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vnext = require("../lib/learner-renderer-vnext");

const repoRoot = path.resolve(__dirname, "..");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "learner-renderer-kitchen-sink-page.json"
);

function loadKitchenSink() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

test("kitchen-sink fixture: buildPageModel succeeds", () => {
  const result = vnext.buildPageModel(loadKitchenSink());
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test("kitchen-sink fixture: renders composed moments HTML", () => {
  const rendered = vnext.renderLearnerPageHtml(loadKitchenSink(), { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  assert.match(rendered.html, /data-composition-mode="moments"/);
  assert.match(rendered.html, /util-learner-renderer-vnext/);
});

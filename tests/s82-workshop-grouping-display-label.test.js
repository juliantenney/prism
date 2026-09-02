"use strict";

/**
 * S82 — grouping badge presentation labels (canonical token preserved in model).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const fs = require("node:fs");

const repoRoot = path.resolve(__dirname, "..");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "owen-a1-assembled-shape.json"
);
const labelForGroupingDisplay = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "grouping-display-label.js"
)).labelForGroupingDisplay;
const buildPageModel = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "build-page-model.js"
)).buildPageModel;
const renderPage = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "render-page.js"
)).renderPage;
const renderActivity = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "render-activity.js"
)).renderActivity;

function workshopPageWithGrouping(grouping) {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  page.constraints_applied = { delivery_mode: "live_workshop", delivery_context: "in_person" };
  page.activities[0].grouping = grouping;
  return page;
}

test("labelForGroupingDisplay humanises known multiword tokens", () => {
  assert.equal(labelForGroupingDisplay("small_group"), "Small group");
  assert.equal(labelForGroupingDisplay("whole_group"), "Whole group");
  assert.equal(labelForGroupingDisplay("individual_then_pair"), "Individual then pair");
  assert.equal(labelForGroupingDisplay("individual_then_small_group"), "Individual then small group");
});

test("labelForGroupingDisplay humanises single-word and fallback tokens", () => {
  assert.equal(labelForGroupingDisplay("individual"), "Individual");
  assert.equal(labelForGroupingDisplay("pairs"), "Pairs");
  assert.equal(labelForGroupingDisplay("pair"), "Pair");
  assert.equal(labelForGroupingDisplay("mixed"), "Mixed");
  assert.equal(labelForGroupingDisplay("role_play"), "Role play");
});

test("buildPageModel preserves canonical grouping token unchanged", () => {
  const built = buildPageModel(workshopPageWithGrouping("small_group"));
  assert.equal(built.ok, true, built.errors && built.errors.join("; "));
  assert.equal(built.model.activities[0].grouping, "small_group");
});

test("renderActivity badge is human-readable and omits raw underscores", () => {
  const built = buildPageModel(workshopPageWithGrouping("whole_group"));
  assert.equal(built.ok, true);
  const html = renderActivity(built.model.activities[0]);
  assert.match(html, /class="util-badge util-badge-group">Whole group</);
  assert.doesNotMatch(html, /util-badge-group">whole_group</);
  assert.doesNotMatch(html, /util-badge-group">[^<]*_/);
});

test("renderPage emits humanised grouping badges across workshop tokens", () => {
  const expectations = {
    small_group: "Small group",
    individual_then_pair: "Individual then pair",
    individual: "Individual"
  };
  Object.keys(expectations).forEach(function (token) {
    const built = buildPageModel(workshopPageWithGrouping(token));
    assert.equal(built.ok, true, token);
    assert.equal(built.model.activities[0].grouping, token);
    const html = renderPage(built.model);
    assert.match(html, new RegExp('util-badge-group">' + expectations[token] + "<"));
    assert.doesNotMatch(html, new RegExp('util-badge-group">' + token + "<"));
  });
});

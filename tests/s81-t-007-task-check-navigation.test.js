"use strict";

/**
 * S81-T-007 — R1 asymmetric Task/Check landmarks + Check→Task navigation.
 * Task→Check shortcut intentionally absent (S81-T-008 manual UX correction).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");
const taskCheckNav = require("../lib/learner-renderer-vnext/task-check-navigation");

const repoRoot = path.resolve(__dirname, "..");
const heteroPath = path.join(
  repoRoot,
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
);
const kitchenPath = path.join(
  repoRoot,
  "tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json"
);

function render(fixturePath) {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  return renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
}

function collectIds(html, re) {
  const ids = [];
  let match;
  const clone = new RegExp(re.source, "g");
  while ((match = clone.exec(html))) {
    if (String(match[1]).endsWith("-heading")) continue;
    ids.push(match[1]);
  }
  return ids;
}

test("task-check-navigation slug and landmark ids are deterministic and unique per activity", () => {
  assert.equal(taskCheckNav.taskLandmarkId("A1"), "learner-task-a1");
  assert.equal(taskCheckNav.checkLandmarkId("A1"), "learner-check-a1");
  assert.equal(taskCheckNav.taskLandmarkId("Act 2!"), "learner-task-act-2");
  assert.notEqual(
    taskCheckNav.taskLandmarkId("a1"),
    taskCheckNav.checkLandmarkId("a1")
  );
});

test("hetero page: landmarks unique; Check→Task present; Task→Check shortcut absent", () => {
  const html = render(heteroPath);

  const taskIds = collectIds(html, /id="(learner-task-[^"]+)"/);
  const checkIds = collectIds(html, /id="(learner-check-[^"]+)"/);
  assert.ok(taskIds.length >= 2, "expected multiple task landmarks");
  assert.equal(taskIds.length, checkIds.length);
  assert.equal(new Set(taskIds).size, taskIds.length, "task ids unique");
  assert.equal(new Set(checkIds).size, checkIds.length, "check ids unique");

  taskIds.forEach(function (taskId) {
    const slug = taskId.replace(/^learner-task-/, "");
    const checkId = "learner-check-" + slug;
    assert.ok(checkIds.indexOf(checkId) >= 0, "paired check for " + taskId);

    // No Task → Check shortcut inside the Task region.
    const taskSection = new RegExp(
      'id="' +
        taskId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        '"[\\s\\S]*?(?=id="learner-task-|id="learner-check-|</article>)'
    );
    const taskChunkMatch = html.match(taskSection);
    assert.ok(taskChunkMatch, "expected task section for " + taskId);
    assert.doesNotMatch(
      taskChunkMatch[0],
      /href="#learner-check-|Check your response \(/
    );

    const toTask = new RegExp(
      'id="' +
        checkId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        '"[\\s\\S]*?href="#' +
        taskId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        '"'
    );
    assert.match(html, toTask);
  });

  assert.doesNotMatch(html, /Check your response \(/);
  assert.match(html, /Back to your task \(/);
  assert.match(html, /util-composition-moment-nav__link/);
});

test("kitchen sink: Check→Task nav retained; no Task→Check shortcut; no schema markers", () => {
  const html = render(kitchenPath);
  assert.match(html, /data-workspace-kind="table_entry"/);
  assert.match(html, /id="learner-task-/);
  assert.match(html, /id="learner-check-/);
  assert.match(html, /Back to your task/);
  assert.doesNotMatch(html, /Check your response \(/);
  assert.doesNotMatch(html, /response_kind|covers_response_material/);
});

test("Check→Task links are ordinary anchors; landmarks labelled", () => {
  const html = render(heteroPath);
  assert.doesNotMatch(
    html,
    /<p class="util-composition-moment-nav"><a class="util-composition-moment-nav__link" href="#learner-check-/
  );
  assert.match(
    html,
    /<p class="util-composition-moment-nav"><a class="util-composition-moment-nav__link" href="#learner-task-/
  );
  assert.match(html, /aria-labelledby="learner-task-[^"]+-heading"/);
  assert.match(html, /aria-labelledby="learner-check-[^"]+-heading"/);
});

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "educational-psychology-post-s68",
  "repaired-assembled-page.json"
);

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

test("orient renders page-level learning outcomes from outcome_id in source order", () => {
  const page = loadFixture();
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.match(html, /data-region="orientation"/);
  assert.match(html, /data-orientation-type="learning_outcomes"/);
  assert.match(html, /LO1/);
  assert.match(html, /LO5/);
  const lo1 = html.indexOf("LO1");
  const lo2 = html.indexOf("LO2");
  const lo3 = html.indexOf("LO3");
  const lo4 = html.indexOf("LO4");
  const lo5 = html.indexOf("LO5");
  assert.ok(lo1 >= 0 && lo2 > lo1 && lo3 > lo2 && lo4 > lo3 && lo5 > lo4);
});

test("orient omits learning outcomes section when none are provided", () => {
  const page = loadFixture();
  page.learning_outcomes = [];
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.doesNotMatch(html, /data-orientation-type="learning_outcomes"/);
});

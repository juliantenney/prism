const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

test("Roman Roads fixture renders through vNext moments path", () => {
  const fixturePath = path.join(__dirname, "fixtures", "page-render", "roman-roads-association-page.json");
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  assert.ok(String(rendered.html || "").length > 500);
  assert.match(rendered.html, /data-renderer="vnext"/);
});

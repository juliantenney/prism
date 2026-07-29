const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const { buildLearnerPackage } = require("../lib/learner-package");

function buildRomanRoadsStylePage() {
  const fixturePath = path.join(
    __dirname,
    "fixtures",
    "page-render",
    "heteroscedasticity-beat-assignment-page.json"
  );
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const a2 = (page.activities || []).find((activity) => String(activity.activity_id || "") === "A2");
  if (!a2) return page;
  a2.learner_task =
    "1. Study the process walkthrough and explanatory material.\n" +
    "2. Review the worked construction example.\n" +
    "3. Complete the analysis table by explaining the purpose of each construction stage.\n" +
    "4. Build a short written explanation of how individual engineering features contributed to durability.\n" +
    "5. Complete the verification checklist.";
  a2.expected_output =
    "Produce a completed analysis table and a short explanation demonstrating how surveying, construction layers, drainage, and maintenance combined to create durable roads.";
  (a2.materials || []).forEach((material) => {
    if (String(material.material_id || "") === "A2-M2") {
      material.material_type = "analysis_table";
      material.title = "Construction Analysis Table";
    }
    if (String(material.material_id || "") === "A2-M3") {
      material.material_type = "checklist";
      material.title = "Construction Self-Check";
      material.body = "- Check your response.";
    }
  });
  return page;
}

function extractActivityHtml(html, activityId) {
  var marker = 'id="activity-' + activityId + '"';
  var markerIndex = html.indexOf(marker);
  if (markerIndex < 0) return "";
  var openTagStart = html.lastIndexOf("<article", markerIndex);
  if (openTagStart < 0) return "";
  var tagRe = /<(\/?)article\b[^>]*>/gi;
  tagRe.lastIndex = openTagStart;
  var depth = 0;
  var match;
  while ((match = tagRe.exec(html)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return html.slice(openTagStart, tagRe.lastIndex);
    }
  }
  return "";
}

function extractDoMoment(html) {
  var marker = 'data-composition-moment="do"';
  var start = html.indexOf(marker);
  if (start < 0) return "";
  var open = html.lastIndexOf("<section", start);
  var close = html.indexOf("</section>", start);
  if (open < 0 || close < 0) return "";
  return html.slice(open, close + "</section>".length);
}

test("A2 table + written explanation renders two independent workspaces", () => {
  const page = buildRomanRoadsStylePage();
  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  assert.match(rendered.html, /data-composition-mode="moments"/);
  assert.match(rendered.html, /data-beats-fallback-activity-count="0"/);

  const activityHtml = extractActivityHtml(String(rendered.html || ""), "A2");
  const doHtml = extractDoMoment(activityHtml);
  assert.match(doHtml, /Complete the analysis table/i);
  assert.match(doHtml, /Build a short written explanation/i);
  assert.match(doHtml, /data-workspace-kind="table_entry"/);
  assert.match(doHtml, /data-workspace-kind="text_entry"/);

  // Order requirement: step 3 instruction -> table workspace -> step 4 instruction -> text workspace.
  const idxStep3 = doHtml.indexOf("Complete the analysis table");
  const idxTable = doHtml.indexOf('data-workspace-kind="table_entry"');
  const idxStep4 = doHtml.indexOf("Build a short written explanation");
  const idxText = doHtml.indexOf('data-workspace-kind="text_entry"');
  assert.ok(idxStep3 >= 0 && idxTable > idxStep3);
  assert.ok(idxStep4 > idxTable);
  assert.ok(idxText > idxStep4);

  const workspaceIds = [...doHtml.matchAll(/data-workspace-id="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(workspaceIds.length >= 2);
  assert.equal(new Set(workspaceIds).size, workspaceIds.length);
});

test("table-only Do activity still renders one workspace", () => {
  const page = buildRomanRoadsStylePage();
  const a2 = (page.activities || []).find((activity) => String(activity.activity_id || "") === "A2");
  assert.ok(a2, "A2 activity exists");
  a2.learner_task =
    "1. Study the walkthrough.\n" +
    "2. Complete the analysis table by explaining each stage.\n" +
    "3. Complete the verification checklist.";
  a2.expected_output = "Produce a completed analysis table.";
  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  const activityHtml = extractActivityHtml(String(rendered.html || ""), "A2");
  const doHtml = extractDoMoment(activityHtml);
  const textCount = (doHtml.match(/data-workspace-kind="text_entry"/g) || []).length;
  const tableCount = (doHtml.match(/data-workspace-kind="table_entry"/g) || []).length;
  assert.equal(tableCount, 1);
  assert.equal(textCount, 0);
});

test("export/package path preserves both workspaces from same rendered basis", () => {
  const page = buildRomanRoadsStylePage();
  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  const activityHtml = extractActivityHtml(String(rendered.html || ""), "A2");
  const doHtml = extractDoMoment(activityHtml);
  assert.match(doHtml, /data-workspace-kind="table_entry"/);
  assert.match(doHtml, /data-workspace-kind="text_entry"/);

  const pkg = buildLearnerPackage({ html: rendered.html });
  assert.equal(pkg.ok, true);
  assert.match(pkg.package.html, /data-workspace-kind="table_entry"/);
  assert.match(pkg.package.html, /data-workspace-kind="text_entry"/);
});

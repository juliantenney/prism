/**
 * C4 Activity A3: a fenced text individual-value plot stays preformatted
 * in learner HTML and in the exported package.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const fflate = require("fflate");

const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");
const { renderMarkdownBlock } = require("../lib/learner-renderer-vnext/render-html-utils.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

const degree = "\u00B0";
const axis = "                    |---------|---------|---------|---------|";
const ticks = "                    60        70        80        90       100";
const conditionB = "Condition B: 40 " + degree + "C            \u25CF \u25CF  \u25CF \u25CF\u25CF  \u25CF";
const conditionA = "Condition A: 20 " + degree + "C                             \u25C6 \u25C6 \u25C6 \u25C6\u25C6 \u25C6";
const plotLines = [
  "                         Dissolution time (s)",
  ticks,
  axis,
  conditionB,
  conditionA,
  axis,
  ticks
];
const plotBody = [
  "## Individual-value dot plot",
  "",
  "The plot below represents the twelve synthetic educational measurements. Each marker is one independent trial. Both conditions use the same linear horizontal axis, from 60 to 100 seconds, with labelled ticks at 60, 70, 80, 90 and 100. The marker symbols distinguish the conditions without relying on colour.",
  "",
  "```text",
  ...plotLines,
  "```",
  "",
  "**Plot key:** \u25CF = Condition B at 40 " + degree + "C; \u25C6 = Condition A at 20 " + degree + "C.",
  "",
  "Use the common axis and the accompanying exact-value table to examine each condition's location and spread. Record your own graphical interpretation before revealing the explanatory feedback. No mean markers or model comparison are supplied in this plot."
].join("\n");

function plotPage() {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const activity = page.activities.find((item) => item.activity_id === "A3");
  activity.title = "Read the Individual-Value Plot";
  const plotMaterial = activity.materials.find((item) => item.material_id === "A3-M2");
  plotMaterial.title = "Individual-Value Dot Plot of Dissolution Times";
  plotMaterial.material_type = "scenario";
  plotMaterial.body = plotBody;
  return page;
}

function renderPlotPage() {
  const rendered = renderLearnerPageHtml(plotPage(), { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  return String(rendered.html || "");
}

function activitySlice(html) {
  const start = html.indexOf('id="activity-A3"');
  const end = html.indexOf('id="activity-A4"');
  assert.ok(start >= 0 && end > start);
  return html.slice(start, end);
}

function assertPlotHtml(html) {
  const activity = activitySlice(html);
  const plotStart = activity.indexOf("Individual-Value Dot Plot of Dissolution Times");
  const plotEnd = activity.indexOf("data-material-id=", plotStart + 1);
  const plot =
    plotEnd > plotStart ? activity.slice(plotStart, plotEnd) : activity.slice(plotStart);
  assert.match(plot, /class="util-fenced-text"/);
  assert.equal((plot.match(/<pre>/g) || []).length, 1);
  assert.doesNotMatch(plot, /```/);
  const pre = plot.match(/<pre>([\s\S]*?)<\/pre>/);
  assert.ok(pre, "plot is one preformatted block");
  assert.equal(pre[1], plotLines.join("\n"));
  assert.equal((pre[1].match(/\u25CF/g) || []).length, 6);
  assert.equal((pre[1].match(/\u25C6/g) || []).length, 6);
  assert.ok(pre[1].indexOf(conditionB) > pre[1].indexOf(ticks));
  assert.ok(pre[1].indexOf(conditionA) > pre[1].indexOf(conditionB));
  const before = plot.slice(0, plot.indexOf('<div class="util-fenced-text">'));
  const after = plot.slice(plot.indexOf("</pre>") + 6);
  assert.match(before, /twelve synthetic educational measurements/);
  assert.match(before, /Individual-value dot plot/);
  assert.match(after, /<strong>Plot key:<\/strong>/);
  assert.match(after, /accompanying exact-value table/);
  assert.doesNotMatch(before, /<pre>/);
  assert.doesNotMatch(after, /<pre>/);
  assert.match(activity, /<table/);
  assert.match(activity, /data-workspace/);
  assert.doesNotMatch(activity, /```text/);
}

test("a fenced text plot keeps authored columns and surrounding prose", () => {
  const html = renderMarkdownBlock(plotBody);
  assert.match(html, /<div class="util-fenced-text"><pre>/);
  assert.equal((html.match(/<pre>/g) || []).length, 1);
  assert.doesNotMatch(html, /```/);
  const pre = html.match(/<pre>([\s\S]*?)<\/pre>/);
  assert.equal(pre[1], plotLines.join("\n"));
  assert.match(html, /<p>The plot below represents the twelve synthetic educational measurements\./);
  assert.match(html, /<p><strong>Plot key:<\/strong> \u25CF = Condition B/);
  assert.match(html, /<p>Use the common axis and the accompanying exact-value table/);
});

test("an unclosed text fence is left as ordinary prose", () => {
  const html = renderMarkdownBlock("```text\nCondition A: 20\n\nStill a paragraph.");
  assert.doesNotMatch(html, /<pre>/);
  assert.match(html, /Still a paragraph/);
});

test("a pipe table beside a text fence stays a table", () => {
  const html = renderMarkdownBlock(
    "```text\n  axis\n```\n\n| Trial | Time |\n| --- | --- |\n| 1 | 93 |"
  );
  assert.match(html, /<pre> {2}axis<\/pre>/);
  assert.match(html, /<table/);
  assert.match(html, /<td[^>]*>93<\/td>/);
});

test("math outside a text fence is still protected", () => {
  const html = renderMarkdownBlock("\\[\n75.5000-91.6667\\approx-16.1667\n\\]\n\n```text\n  plot\n```");
  assert.match(html, /\\\[/);
  assert.match(html, /<pre> {2}plot<\/pre>/);
});

test("C4 A3 learner HTML renders the individual-value plot without fences", () => {
  assertPlotHtml(renderPlotPage());
});

test("exported C4 package keeps the preformatted individual-value plot", () => {
  const packaged = learnerPackage.buildLearnerPackage({
    html: renderPlotPage(),
    visualAssetManifest: { assets: [] },
    title: "Read the Individual-Value Plot"
  });
  assert.equal(packaged.ok, true, JSON.stringify(packaged.error || {}));
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(packaged.package);
  assert.equal(zipped.ok, true, JSON.stringify(zipped.error || {}));
  const entries = fflate.unzipSync(zipped.bytes);
  assertPlotHtml(fflate.strFromU8(entries["learner-page.html"]));
});

test("published learner CSS scrolls a fenced text plot inside its container", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.match(
    appSource,
    /\.util-learner-renderer-vnext \.util-fenced-text\{[^}]*overflow-x:auto/
  );
  assert.match(
    appSource,
    /\.util-learner-renderer-vnext \.util-fenced-text pre\{[^}]*white-space:pre/
  );
});

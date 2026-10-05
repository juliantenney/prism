const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const { buildLearnerPackage } = require("../lib/learner-package");

function loadBasePage() {
  const fixturePath = path.join(
    __dirname,
    "fixtures",
    "page-render",
    "heteroscedasticity-beat-assignment-page.json"
  );
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function buildAssociationRegressionPage() {
  const page = loadBasePage();
  const byId = Object.create(null);
  (page.activities || []).forEach((activity) => {
    byId[String(activity.activity_id || "")] = activity;
  });

  var a1 = byId.A1;
  if (a1) {
    a1.learner_task =
      "1. Study the explanatory text and worked example.\n" +
      "2. Examine the sample output and identify how evidence is linked to interpretation.\n" +
      "3. Complete the self-check.\n" +
      "4. Write a brief explanation in your own words.";
  }

  var a4 = byId.A4;
  if (a4) {
    a4.learner_task =
      "1. Examine the case-study scenarios.\n" +
      "2. Study the worked judgement example.\n" +
      "3. Complete the prompt set by explaining each stage in the chain of effects.\n" +
      "4. Complete the checklist and revise your conclusion.";
    (a4.required_materials || []).forEach((row) => {
      if (String(row.material_id || "") === "A4-M1") row.type = "scenario";
      if (String(row.material_id || "") === "A4-M2") row.type = "worked_example";
    });
    (a4.materials || []).forEach((row) => {
      if (String(row.material_id || "") === "A4-M1") {
        row.material_type = "scenario";
        row.title = "Provincial Case Studies";
      }
      if (String(row.material_id || "") === "A4-M2") {
        row.material_type = "worked_example";
        row.title = "Worked Historical Judgement";
      }
      if (String(row.material_id || "") === "A4-M4") {
        row.material_type = "checklist";
        row.title = "Final Revision Checklist";
      }
    });
  }

  var a5 = byId.A5;
  if (a5) {
    a5.learner_task =
      "1. Study the criteria for evaluating detection and remedy approaches.\n" +
      "2. Review the research scenarios and the worked judgement example.\n" +
      "3. Complete the comparison and decision framework.\n" +
      "4. Produce an independent written judgement recommending an approach and defending your reasoning.\n" +
      "5. Review the consolidation summary and complete the final transfer prompt.";
  }
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

function extractMomentHtml(activityHtml, kind) {
  var marker = 'data-composition-moment="' + kind + '"';
  var start = activityHtml.indexOf(marker);
  if (start < 0) return "";
  var open = activityHtml.lastIndexOf("<section", start);
  var close = activityHtml.indexOf("</section>", start);
  if (open < 0 || close < 0) return "";
  return activityHtml.slice(open, close + "</section>".length);
}

function indexOfOrEnd(text, search) {
  var idx = String(text || "").indexOf(search);
  return idx >= 0 ? idx : Number.MAX_SAFE_INTEGER;
}

function loadBrowserRendererApi() {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
    "utf8"
  );
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    window: {},
    globalThis: {}
  };
  sandbox.window.window = sandbox.window;
  sandbox.window.globalThis = sandbox.window;
  sandbox.globalThis = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "learner-renderer-vnext-browser.js" });
  return sandbox.window.PRISM_LEARNER_RENDERER_VNEXT;
}

test("association regression fixture renders moments without error", () => {
  const page = buildAssociationRegressionPage();
  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  assert.match(String(rendered.html || ""), /data-composition-mode="moments"/);
});

test("exports keep same moments ordering and browser/node structures agree", () => {
  const page = buildAssociationRegressionPage();
  const node = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(node.error, null);
  const nodeHtml = String(node.html || "");
  const pkg = buildLearnerPackage({ html: nodeHtml });
  assert.equal(pkg.ok, true);
  const packagedHtml = String(pkg.package.html || "");
  assert.ok(indexOfOrEnd(packagedHtml, 'data-material-id="A4-M4"') > 0);
  assert.ok(indexOfOrEnd(packagedHtml, 'data-material-id="A5-M8"') < indexOfOrEnd(packagedHtml, 'data-material-id="A5-M7"'));

  const browserApi = loadBrowserRendererApi();
  assert.ok(browserApi && typeof browserApi.renderLearnerPageHtml === "function");
  const browser = browserApi.renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(browser.error, null);
  const browserHtml = String(browser.html || "");
  assert.ok(indexOfOrEnd(browserHtml, 'data-material-id="A4-M4"') > 0);
  assert.ok(indexOfOrEnd(browserHtml, 'data-material-id="A5-M8"') < indexOfOrEnd(browserHtml, 'data-material-id="A5-M7"'));
});

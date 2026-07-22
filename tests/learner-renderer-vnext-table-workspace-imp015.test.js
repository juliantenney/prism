"use strict";

/**
 * Sprint 68 — S68-IMP-015 table workspace synthetic row labels and cell spacing.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildPageModel,
  renderLearnerPageHtml,
  validatePageModel
} = require("../lib/learner-renderer-vnext");
const {
  renderTableWorkspace,
  buildTableWorkspaceModel
} = require("../lib/learner-renderer-vnext/render-table-workspace");
const {
  isSyntheticRowLabel,
  classifyTableWorkspaceRowLabel
} = require("../lib/learner-renderer-vnext/table-workspace-row-label");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");

const heteroFixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const videoFixturePath = path.join(
  __dirname,
  "fixtures",
  "workflows",
  "videotranscripttest-assembled-page.json"
);
const appJsPath = path.join(__dirname, "..", "app.js");
const browserBundlePath = path.join(
  __dirname,
  "..",
  "lib",
  "learner-renderer-vnext-browser.js"
);

function loadJson(fixturePath) {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function findActivityMaterial(sourcePage, activityId, materialId) {
  const modelResult = buildPageModel(sourcePage);
  assert.equal(modelResult.ok, true);
  const activity = modelResult.model.activities.find((item) => item.id === activityId);
  assert.ok(activity, "activity " + activityId);
  for (const beat of activity.beats) {
    const match = (beat.materials || []).find((material) => material.id === materialId);
    if (match) return { modelResult, activity, material: match };
  }
  throw new Error("material not found: " + materialId);
}

function syntheticMaterial(body, overrides) {
  return Object.assign(
    {
      id: "SYN-M1",
      type: "decision_table",
      title: "Synthetic label probe",
      bodyFormat: "markdown",
      body: body
    },
    overrides || {}
  );
}

function countTagCells(html, tagName) {
  return (html.match(new RegExp("<" + tagName + "\\b", "g")) || []).length;
}

function extractDuplicateDomIds(html) {
  const ids = [...String(html || "").matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const uniqueIds = new Set(ids);
  return ids.length - uniqueIds.size;
}

test("detection: exact synthetic placeholders are classified conservatively", () => {
  assert.equal(isSyntheticRowLabel("Response row 2"), true);
  assert.equal(isSyntheticRowLabel("response row 2"), true);
  assert.equal(isSyntheticRowLabel("Blank row 3"), true);
  assert.equal(isSyntheticRowLabel("Editable row 4"), true);
  assert.equal(isSyntheticRowLabel("Host response"), false);
  assert.equal(isSyntheticRowLabel("Immune response"), false);
  assert.equal(isSyntheticRowLabel("Response strategy"), false);
  assert.equal(isSyntheticRowLabel("Observed response"), false);
  assert.equal(isSyntheticRowLabel("Row-level interpretation"), false);
});

test("model: synthetic first cell is normalised without shifting columns", () => {
  const material = syntheticMaterial(
    "| Label | Detail |\n| --- | --- |\n| Response row 2 | Mechanism | |\n| Host response | Keep me | |"
  );
  const model = buildTableWorkspaceModel(material, "A1");
  assert.ok(model);
  assert.equal(model.rows.length, 2);
  assert.equal(model.rows[0].labelInfo.isSyntheticRowLabel, true);
  assert.equal(model.rows[0].labelInfo.visibleRowLabel, null);
  assert.equal(model.rows[0].cells[0], "");
  assert.equal(model.rows[0].cells[1], "Mechanism");
  assert.equal(model.rows[1].labelInfo.hasMeaningfulRowLabel, true);
  assert.equal(model.rows[1].labelInfo.visibleRowLabel, "Host response");
});

test("render: Response row 2 is not visible in learner HTML", () => {
  const material = syntheticMaterial(
    "| Criterion | Evidence |\n| --- | --- |\n| Response row 2 | | |\n| Response row 3 | | |"
  );
  const html = renderTableWorkspace(material, "KS");
  assert.doesNotMatch(html, /Response row \d+/);
  assert.equal(countTagCells(html, "td"), 4);
  assert.equal(countTagCells(html, "th"), 4);
  assert.equal((html.match(/util-learner-table-workspace__input/g) || []).length, 4);
});

test("render: meaningful row labels remain visible and use th scope=row", () => {
  const material = syntheticMaterial(
    "| Label | Evidence |\n| --- | --- |\n| Host response | cue | |\n| Immune response | cue | |\n| Response strategy | cue | |"
  );
  const html = renderTableWorkspace(material, "KS");
  assert.match(html, /Host response/);
  assert.match(html, /Immune response/);
  assert.match(html, /Response strategy/);
  assert.equal((html.match(/<th scope="row"/g) || []).length, 3);
});

test("render: placeholder-only rows retain editable fields and authored order", () => {
  const material = syntheticMaterial(
    "| A | B | C |\n| --- | --- | --- |\n| Response row 2 | | |\n| Response row 3 | | |"
  );
  const html = renderTableWorkspace(material, "KS");
  const inputIds = [...html.matchAll(/id="([^"]+-input-r\d+-c\d+)"/g)].map((m) => m[1]);
  assert.deepEqual(inputIds, [
    "ks-syn-m1-input-r0-c1",
    "ks-syn-m1-input-r0-c2",
    "ks-syn-m1-input-r1-c1",
    "ks-syn-m1-input-r1-c2"
  ]);
});

test("accessibility: synthetic placeholders do not appear in accessible names", () => {
  const material = syntheticMaterial(
    "| Step | Detail |\n| --- | --- |\n| Response row 2 | | |"
  );
  const html = renderTableWorkspace(material, "KS");
  assert.doesNotMatch(html, /aria-labelledby="[^"]*Response row/i);
  assert.doesNotMatch(html, /aria-label="[^"]*Response row/i);
  assert.match(html, /aria-label="Response field, row 1, column Detail"/);
});

test("accessibility: meaningful row labels continue using aria-labelledby", () => {
  const material = syntheticMaterial("| Label | Evidence |\n| --- | --- |\n| Example | | |");
  const html = renderTableWorkspace(material, "KS");
  assert.match(html, /aria-labelledby="ks-syn-m1-row-0 ks-syn-m1-col-evidence-1"/);
});

test("heteroscedasticity: A3-M3 no longer exposes synthetic row labels", () => {
  const sourcePage = loadJson(heteroFixturePath);
  const { material } = findActivityMaterial(sourcePage, "A3", "A3-M3");
  const html = renderTableWorkspace(material, "A3");
  assert.doesNotMatch(html, /Response row \d+/);
  assert.match(html, /Likely heteroscedasticity/);
  assert.equal((html.match(/util-learner-table-workspace__input/g) || []).length, 8);
});

test("heteroscedasticity: full moments page retains material assignment and zero duplicate ids", () => {
  const sourcePage = loadJson(heteroFixturePath);
  const modelResult = buildPageModel(sourcePage);
  assert.equal(modelResult.ok, true);
  assert.equal(validatePageModel(sourcePage, modelResult.model).errors.length, 0);

  const html = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  assert.doesNotMatch(html, /Response row \d+/);
  assert.equal(extractDuplicateDomIds(html), 0);
});

test("VideoTranscriptTest: table workspaces remain structurally correct", () => {
  const sourcePage = loadJson(videoFixturePath);
  const modelResult = buildPageModel(sourcePage);
  assert.equal(modelResult.ok, true);

  const html = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  assert.doesNotMatch(html, /Response row \d+/);
  assert.match(html, /util-learner-table-workspace/);
  assert.equal(extractDuplicateDomIds(html), 0);
  assert.equal(validatePageModel(sourcePage, modelResult.model).errors.length, 0);
});

test("static tables: non-workspace markdown tables are not regressed by workspace spacing", () => {
  const sourcePage = loadJson(heteroFixturePath);
  const { material } = findActivityMaterial(sourcePage, "A2", "A2-M1");
  const html = renderMaterial(material);
  assert.match(html, /Widening funnel/);
  assert.doesNotMatch(html, /util-learner-table-workspace__cell--editable/);
  assert.doesNotMatch(html, /<input/);
});

test("presentation css: editable and fixed workspace cells use separate padding", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  assert.match(
    source,
    /\.util-learner-table-workspace__table \.util-learner-table-workspace__cell--editable\{padding:2px/
  );
  assert.match(
    source,
    /\.util-learner-table-workspace__table \.util-learner-table-workspace__cell--fixed\{padding:\.5rem \.65rem/
  );
  assert.match(source, /\.util-learner-table-workspace__input\{[^"]*padding:\.4rem \.5rem/);
  assert.match(source, /\.util-learner-table-workspace__input\{[^"]*border-radius:4px/);
  assert.match(source, /\.util-learner-table-workspace__input:focus\{[^"]*outline-offset:0/);
});

test("browser bundle: table workspace row-label helpers remain in parity with Node modules", () => {
  const bundle = fs.readFileSync(browserBundlePath, "utf8");
  assert.match(bundle, /isSyntheticRowLabel/);
  assert.match(bundle, /buildTableWorkspaceModel/);
  assert.match(bundle, /buildNeutralInputAccessibleName/);
  assert.doesNotMatch(bundle, /Response row " \+ \(rowIndex \+ 1\)/);
});

test("classifier: partially authored synthetic rows keep meaningful trailing cells", () => {
  const info = classifyTableWorkspaceRowLabel("Response row 2", 1);
  assert.equal(info.isSyntheticRowLabel, true);
  assert.equal(info.needsStructuralRowHeader, true);
  assert.equal(info.visibleRowLabel, null);

  const material = syntheticMaterial(
    "| Step | Detail | Notes |\n| --- | --- | --- |\n| Response row 2 | Mechanism | |"
  );
  const html = renderTableWorkspace(material, "KS");
  assert.match(html, /Mechanism/);
  assert.doesNotMatch(html, /Response row 2/);
  assert.equal(countTagCells(html, "td"), 2);
});

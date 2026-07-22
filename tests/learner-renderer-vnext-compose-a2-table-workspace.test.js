"use strict";

/**
 * Sprint 68 — S68-IMP-007 A2 interactive table workspace tests.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { buildPageModel, renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const {
  composeDoMoment,
  composeLearnMoment
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
const {
  shouldComposeTableWorkspaceMaterial
} = require("../lib/learner-renderer-vnext/completion-table-workspace");
const {
  renderTableWorkspace,
  extractTableFromMaterial
} = require("../lib/learner-renderer-vnext/render-table-workspace");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function buildGoldenContext() {
  const sourcePage = loadFixture();
  const modelResult = buildPageModel(sourcePage);
  assert.equal(modelResult.ok, true);
  const a2 = modelResult.model.activities.find((activity) => activity.id === "A2");
  assert.ok(a2);
  return { sourcePage, modelResult, a2 };
}

function findMaterial(activity, materialId) {
  for (const beat of activity.beats) {
    const match = (beat.materials || []).find((material) => material.id === materialId);
    if (match) return match;
  }
  return null;
}

function extractActivityHtml(html, activityId) {
  const source = String(html || "");
  const marker = 'id="activity-' + activityId + '"';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return "";

  const openTagStart = source.lastIndexOf("<article", markerIndex);
  if (openTagStart < 0) return "";

  const tagRe = /<(\/?)article\b[^>]*>/gi;
  tagRe.lastIndex = openTagStart;
  let depth = 0;
  let match;
  while ((match = tagRe.exec(source)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return source.slice(openTagStart, tagRe.lastIndex);
    }
  }
  return "";
}

function momentHtml(html, kind) {
  const marker = 'data-composition-moment="' + kind + '"';
  const start = html.indexOf(marker);
  if (start < 0) return "";
  const sectionStart = html.lastIndexOf("<section", start);
  const sectionEnd = html.indexOf("</section>", start);
  if (sectionStart < 0 || sectionEnd < 0) return "";
  return html.slice(sectionStart, sectionEnd + "</section>".length);
}

test("routing: Do moment marks A2-M2 for table workspace metadata", () => {
  const { a2 } = buildGoldenContext();
  const doMoment = composeDoMoment(a2);
  assert.ok(doMoment);

  const m2Item = doMoment.items.find(
    (item) => item.kind === "material" && item.material && item.material.id === "A2-M2"
  );
  assert.ok(m2Item);
  assert.equal(m2Item.tableWorkspace, true);
  assert.equal(shouldComposeTableWorkspaceMaterial(m2Item.material), true);

  const m3Item = doMoment.items.find(
    (item) => item.kind === "material" && item.material && item.material.id === "A2-M3"
  );
  assert.ok(m3Item);
  assert.equal(m3Item.tableWorkspace, false);
});

test("routing: Learn moment does not mark A2-M1 for table workspace", () => {
  const { a2 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a2);
  assert.ok(learnMoment);

  const m1Item = learnMoment.items.find(
    (item) => item.kind === "material" && item.material && item.material.id === "A2-M1"
  );
  assert.ok(m1Item);
  assert.notEqual(m1Item.tableWorkspace, true);
});

test("render: A2-M2 uses interactive table workspace in moments mode", () => {
  const { sourcePage } = buildGoldenContext();
  const a2Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A2"
  );
  const doHtml = momentHtml(a2Html, "do");
  const learnHtml = momentHtml(a2Html, "learn");

  assert.match(doHtml, /util-learner-table-workspace/);
  assert.match(doHtml, /data-render-mode="table_workspace"/);
  assert.match(doHtml, /data-material-id="A2-M2"/);
  assert.match(doHtml, /util-learner-table-workspace__input/);
  assert.match(doHtml, /util-learner-table-workspace__guidance/);
  assert.match(doHtml, /saved on this device/i);
  assert.doesNotMatch(doHtml, /util-learner-workspace/);
  assert.doesNotMatch(doHtml, /<textarea/);

  assert.match(learnHtml, /data-material-id="A2-M1"/);
  assert.match(learnHtml, /<table>/);
  assert.doesNotMatch(learnHtml, /util-learner-table-workspace/);
  assert.doesNotMatch(learnHtml, /<input/);
});

test("render: beats mode keeps A2-M2 static with no form controls", () => {
  const { sourcePage } = buildGoldenContext();
  const a2Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html,
    "A2"
  );

  assert.match(a2Html, /data-material-id="A2-M2"/);
  assert.match(a2Html, /util-material-table-block/);
  assert.doesNotMatch(a2Html, /util-learner-table-workspace/);
  assert.doesNotMatch(a2Html, /<input/);
  assert.doesNotMatch(a2Html, /<textarea/);
});

test("cell fidelity: fixed example row and hints remain text; blanks become inputs", () => {
  const { a2 } = buildGoldenContext();
  const material = findMaterial(a2, "A2-M2");
  assert.ok(material);

  const table = extractTableFromMaterial(material);
  assert.ok(table);
  assert.deepEqual(table.header, [
    "Case",
    "Observed Pattern",
    "Variance Behaviour",
    "Heteroscedasticity Judgement",
    "Hint"
  ]);
  assert.equal(table.rows.length, 4);

  const html = renderTableWorkspace(material, "A2");
  assert.match(html, /Example/);
  assert.match(html, /Funnel shape/);
  assert.match(html, /Compare spread across values/);
  assert.match(html, /Check width of residual cloud/);

  assert.equal((html.match(/util-learner-table-workspace__input/g) || []).length, 9);
  assert.doesNotMatch(html, /<textarea/);

  assert.match(html, /<th scope="col"/);
  assert.match(html, /<th scope="row"/);
  assert.match(html, /aria-labelledby="/);
});

test("cell fidelity: static material path unchanged for A2-M1 reference table", () => {
  const { a2 } = buildGoldenContext();
  const material = findMaterial(a2, "A2-M1");
  assert.ok(material);

  const html = renderMaterial(material);
  assert.match(html, /Widening funnel/);
  assert.match(html, /util-worked-example/);
  assert.doesNotMatch(html, /util-learner-table-workspace/);
  assert.doesNotMatch(html, /<input/);
});

test("accessibility: editable controls reference row and column header ids", () => {
  const { a2 } = buildGoldenContext();
  const material = findMaterial(a2, "A2-M2");
  const html = renderTableWorkspace(material, "A2");

  assert.match(html, /id="a2-a2-m2-col-observed-pattern-1"/);
  assert.match(html, /id="a2-a2-m2-row-1"/);
  assert.match(
    html,
    /aria-labelledby="a2-a2-m2-row-1 a2-a2-m2-col-observed-pattern-1"/
  );
});

test("regression: A1 free-text workspace unchanged and A2 Do workspace remains null", () => {
  const sourcePage = loadFixture();
  const { a2 } = buildGoldenContext();
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const a1Html = extractActivityHtml(momentsHtml, "A1");
  const a2Html = extractActivityHtml(momentsHtml, "A2");
  const doMoment = composeDoMoment(a2);

  assert.match(a1Html, /util-learner-workspace__input/);
  assert.doesNotMatch(a1Html, /util-learner-table-workspace/);
  assert.equal(doMoment.workspace, null);

  const a2Moments = [...a2Html.matchAll(/data-composition-moment="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(a2Moments, ["orient", "learn", "do", "check"]);
});

test("regression: A5 composes capstone surfaces in moments export", () => {
  const sourcePage = loadFixture();
  const beatsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html;
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;

  const a5Moments = extractActivityHtml(momentsHtml, "A5");
  assert.notEqual(a5Moments, extractActivityHtml(beatsHtml, "A5"));
  assert.equal((a5Moments.match(/data-composition-moment="/g) || []).length, 4);
  assert.match(a5Moments, /data-workspace-kind="table_entry"/);
  assert.match(a5Moments, /data-workspace-capability="text_entry"/);
});

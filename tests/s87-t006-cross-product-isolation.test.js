/**
 * S87-T-006 — Cross-product isolation + pageKind compatibility gate.
 *
 * Protects Sprint 87 invariants that span shared assembly/renderer surfaces
 * without pixel snapshots.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const assemble = require("../lib/page-vnext-assemble.js");
const {
  buildPageModel,
  isExpositoryLearnerPage
} = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const fixturesDir = path.join(__dirname, "fixtures");
const appJs = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

test("pageKind: Expository stamp → expository; Interactive fixture → interactive", () => {
  assert.equal(
    isExpositoryLearnerPage({
      expository_journey: { commissioned_purpose: "p", epistemic_form: "f" }
    }),
    true
  );
  const interactive = readJson("page-render/roman-roads-page.json");
  assert.equal(isExpositoryLearnerPage(interactive), false);
  const iModel = buildPageModel(interactive);
  assert.equal(iModel.ok, true);
  assert.equal(iModel.model.pageKind, "interactive");
});

test("pageKind: missing model.pageKind still renders safely (no Expository class)", () => {
  const html = renderPage({
    title: "Legacy-shaped model",
    // deliberately omit pageKind
    header: { description: "", durationMinutes: null },
    orientationSections: [],
    expositionSections: [],
    activities: [],
    assessmentItems: [],
    studyTipsHtml: "",
    closingParagraph: "",
    visualAffordances: [],
    persistence: { pageKey: "legacy", storageKey: "legacy", identityUnstable: true }
  });
  assert.match(html, /util-learner-renderer-vnext/);
  assert.doesNotMatch(html, /util-page--expository/);
  assert.doesNotMatch(html, /data-page-kind="expository"/);
});

test("pageKind: absent Expository markers default to interactive; legacy orientation retained", () => {
  const page = Object.assign({}, readJson("page-render/roman-roads-page.json"));
  delete page.expository_journey;
  if (page.assembly_state && Array.isArray(page.assembly_state.enriched_by)) {
    page.assembly_state = Object.assign({}, page.assembly_state, {
      enriched_by: page.assembly_state.enriched_by.filter(function (stage) {
        return (
          stage !== "expository_journey_plan" &&
          stage !== "expository_development" &&
          stage !== "expository_materials"
        );
      })
    });
  }
  assert.equal(isExpositoryLearnerPage(page), false);
  const model = buildPageModel(page);
  assert.equal(model.ok, true);
  assert.equal(model.model.pageKind, "interactive");
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.match(html, /data-page-kind="interactive"/);
  assert.doesNotMatch(html, /util-page--expository/);
  // Generic orientation capability retained for non-Expository pages
  assert.match(html, /data-region="orientation"/);
});

test("Interactive DP ownership list still includes sections; Expository list does not", () => {
  assert.ok(assemble.DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.includes("sections"));
  assert.ok(!assemble.EXPOSITORY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS.includes("sections"));
});

test("Expository publishing CSS selectors cannot match Interactive page-kind", () => {
  const pubStart = appJs.indexOf("function getUtilityExpositoryPublishingCss");
  const pubEnd = appJs.indexOf("function getUtilityVnextProseMeasureCss", pubStart);
  const slice = appJs.slice(pubStart, pubEnd);
  assert.match(slice, /data-page-kind="expository"/);
  assert.match(slice, /util-page-export--expository/);
  assert.doesNotMatch(slice, /data-page-kind="interactive"/);
  // Export body class is gated
  assert.match(
    appJs,
    /if \(isExpositoryExport\) bodyClass \+= " util-page-export--expository"/
  );
});

test("Interactive structural root unchanged: activities region + no exposition publish class", () => {
  const interactive = readJson("page-render/roman-roads-page.json");
  const html = String(renderLearnerPageHtml(interactive).html || "");
  assert.match(html, /data-region="activities"/);
  assert.match(html, /util-activity/);
  assert.doesNotMatch(html, /util-page--expository/);
  assert.doesNotMatch(html, /data-region="exposition"/);
});

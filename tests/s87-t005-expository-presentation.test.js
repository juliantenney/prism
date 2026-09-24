/**
 * S87-T-005 — Restrained Expository presentation (T-010 first slice).
 *
 * Protects Expository-scoped publishing CSS / page-kind marker without
 * asserting pixel-perfect values.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const assemble = require("../lib/page-vnext-assemble.js");
const contracts = require("../lib/expository-contracts.js");
const {
  buildPageModel,
  isExpositoryLearnerPage
} = require("../lib/learner-renderer-vnext/build-page-model.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const fixturesDir = path.join(__dirname, "fixtures");
const appJs = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const expositoryCssStart = appJs.indexOf("function getUtilityExpositoryPublishingCss");
const expositoryCssEnd = appJs.indexOf(
  "function getUtilityVnextProseMeasureCss",
  expositoryCssStart
);
const expositoryCssSlice =
  expositoryCssStart >= 0 && expositoryCssEnd > expositoryCssStart
    ? appJs.slice(expositoryCssStart, expositoryCssEnd)
    : "";

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function loadKitchenExpositoryPage() {
  const ejp = Object.assign({}, readJson("s85-expository-live-ejp.json"), {
    commissioned_purpose: "Explain formative assessment as an evidence-to-action loop.",
    epistemic_form: "practical conceptual model"
  });
  const xd = readJson("s85-expository-live-xd.json");
  const xm = contracts.normalizeExpositoryMaterials(
    readJson("s85-expository-live-xm-structured.json")
  );
  const design_page = Object.assign({}, readJson("s85-expository-dp-raw-paste.json"), {
    artifact_type: "page",
    schema_version: "2.0.0",
    page_synthesis: {}
  });
  xd.sections[0].exposition =
    "Formative assessment is a recurring relationship.\n\n" +
    "Consider the update:\n\n\\[\nP(H\\mid E)=\\frac{P(E\\mid H)P(H)}{P(E)}\n\\]\n\n" +
    "- Intended learning\n- Useful evidence\n- Interpretation\n\n" +
    "| Move | Role |\n| --- | --- |\n| Evidence | Makes understanding visible |\n| Action | Generates further evidence |\n";
  const assembled = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    expository_materials: xm,
    design_page
  });
  assert.equal(assembled.ok, true, JSON.stringify(assembled.errors || []));
  return assembled.page;
}

test("isExpositoryLearnerPage detects assemble stamp / enriched_by only", () => {
  assert.equal(
    isExpositoryLearnerPage({
      expository_journey: { commissioned_purpose: "x", epistemic_form: "y" }
    }),
    true
  );
  assert.equal(
    isExpositoryLearnerPage({
      assembly_state: { enriched_by: ["expository_materials"] }
    }),
    true
  );
  assert.equal(
    isExpositoryLearnerPage({
      assembly_state: { enriched_by: ["episode_plan", "design_page"] },
      activities: [{ activity_id: "A1" }]
    }),
    false
  );
});

test("Expository render stamps data-page-kind=expository; Interactive does not", () => {
  const page = loadKitchenExpositoryPage();
  const model = buildPageModel(page);
  assert.equal(model.ok, true);
  assert.equal(model.model.pageKind, "expository");
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.match(html, /data-page-kind="expository"/);
  assert.match(html, /util-page--expository/);
  assert.match(html, /data-region="exposition"/);
  assert.doesNotMatch(html, /data-region="orientation"/);
  assert.doesNotMatch(html, /data-region="page-closing"/);

  const interactive = readJson("page-render/roman-roads-page.json");
  const iModel = buildPageModel(interactive);
  assert.equal(iModel.ok, true);
  assert.equal(iModel.model.pageKind, "interactive");
  const iHtml = String(renderLearnerPageHtml(interactive).html || "");
  assert.match(iHtml, /data-page-kind="interactive"/);
  assert.doesNotMatch(iHtml, /data-page-kind="expository"/);
  assert.doesNotMatch(iHtml, /util-page--expository/);
  assert.match(iHtml, /data-region="activities"/);
});

test("~70ch prose measure retained; Expository publishing CSS is scoped", () => {
  assert.match(appJs, /--learner-reading-width:70ch/);
  assert.match(appJs, /function getUtilityExpositoryPublishingCss/);
  assert.match(expositoryCssSlice, /data-page-kind="expository"/);
  assert.match(expositoryCssSlice, /body\.util-page-export--expository/);
  assert.match(expositoryCssSlice, /\.util-visual-asset-image\{border:0;border-radius:0/);
  // Wide tables: Expository-scoped breakout (not measure-locked scroll-as-primary)
  assert.match(expositoryCssSlice, /util-exposition-table-breakout/);
  assert.match(expositoryCssSlice, /util-exposition-table-scroll/);
  assert.match(
    expositoryCssSlice,
    /width:min\(75rem,calc\(100vw - var\(--learner-breakout-left\) - var\(--learner-page-gutter\)\)\)/
  );
  assert.match(
    expositoryCssSlice,
    /\.util-exposition-structured-table\{width:100%;min-width:0;max-width:none/
  );
  assert.doesNotMatch(
    expositoryCssSlice,
    /\.util-exposition-structured-table\{width:auto;min-width:100%/
  );
  // Shared Interactive figure chrome remains in base CSS
  assert.match(
    appJs,
    /\.util-learner-renderer-vnext \.util-visual-asset-image\{[^}]*border:1px solid #e5e7eb;border-radius:8px/
  );
  assert.match(appJs, /\.util-learner-renderer-vnext table\{[^}]*min-width:34rem/);
  assert.match(expositoryCssSlice, /overflow-x:auto/);
});

test("Expository kitchen page keeps semantic hierarchy, materials, tables, lists, maths", () => {
  const page = loadKitchenExpositoryPage();
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.match(html, /data-page-kind="expository"/);
  assert.match(html, /<h1>/);
  assert.match(html, /util-section-heading/);
  assert.match(html, /<table[\s>]/);
  assert.match(html, /<ul>|<ol>/);
  assert.match(html, /\\\[/);
  assert.match(html, /data-expository-structured=/);
  assert.doesNotMatch(html, /Structured material body is not supported/);
  assert.doesNotMatch(html, /data-region="orientation"/);
  assert.doesNotMatch(html, /data-region="page-closing"/);
});

test("Interactive presentation path does not receive Expository publishing overrides", () => {
  const interactive = readJson("page-render/roman-roads-page.json");
  const html = String(renderLearnerPageHtml(interactive).html || "");
  assert.doesNotMatch(html, /util-page--expository/);
  assert.doesNotMatch(html, /data-page-kind="expository"/);
  assert.match(
    appJs,
    /if \(isExpositoryExport\) bodyClass \+= " util-page-export--expository"/
  );
});

test("T-004 structured-material markup remains under Expository presentation", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Structured style check",
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "Section",
        exposition: "Prose.",
        materials: [
          {
            material_id: "m1",
            kind: "compact_worked_example",
            body: {
              title: "Worked",
              stages: [{ label: "A", description: "Do A" }]
            }
          }
        ]
      }
    ],
    expository_journey: {
      commissioned_purpose: "p",
      epistemic_form: "f"
    },
    assembly_state: {
      enriched_by: ["expository_materials"]
    }
  };
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.match(html, /data-page-kind="expository"/);
  assert.match(html, /data-expository-structured="compact_worked_example"/);
  assert.match(html, /util-exposition-material/);
});

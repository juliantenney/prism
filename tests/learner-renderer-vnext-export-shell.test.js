"use strict";

/**
 * Sprint 67 — vNext export standalone document shell.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

const LEGACY_RENDERER_ONLY_MARKERS = Object.freeze([
  "util-journey-compass-header",
  'id="activity-1"',
  "util-journey-compass__title"
]);

const VNEXT_NAV_TARGETS = Object.freeze([
  { href: "#journey-orient", id: "journey-orient" },
  { href: "#activity-A1", id: "activity-A1" },
  { href: "#activity-A2", id: "activity-A2" },
  { href: "#activity-A3", id: "activity-A3" },
  { href: "#activity-A4", id: "activity-A4" },
  { href: "#activity-A5", id: "activity-A5" },
  { href: "#journey-assessment", id: "journey-assessment" },
  { href: "#journey-study-tips", id: "journey-study-tips" }
]);

const VNEXT_ACTIVITY_NAV_TITLES = Object.freeze([
  "Defining Heteroscedasticity and Homoscedasticity",
  "Interpreting Residual Plot Evidence",
  "Applying Residual Evidence to Economic Data",
  "Consequences for Statistical Inference",
  "Comparing Detection and Remedy Approaches"
]);

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  injectLearnerRendererVNextInSandbox(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api, sandbox };
}

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function renderVnextExport(api, fixture) {
  const result = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  return String(result.html || "");
}

function renderLegacyExport(api, fixture) {
  const result = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "legacy",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  return String(result.html || "");
}

test("vNext export: fragment wrapped in full standalone document", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());

  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html lang="en">/i);
  assert.match(html, /<\/html>\s*$/i);
  assert.match(html, /<body class="[^"]*\butil-page-export--vnext\b/);
  assert.match(
    html,
    /<main class="util-learner-page util-page util-learner-renderer-vnext" data-renderer="vnext"(?:[^>]*) data-composition-mode="moments" data-composed-activity-count="5" data-beats-fallback-activity-count="0">/
  );
  assert.match(html, /util-vnext-activity/);
  assert.ok(html.includes('data-activity-id="A1"'), "Export must include vNext activity markup.");
  assert.doesNotMatch(html, /<header class="util-page-header util-learning-header"/);
});

test("vNext export: includes shared presentation CSS in head", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.match(html, /<head>[\s\S]*<style>[\s\S]*<\/style>[\s\S]*<\/head>/i);
  assert.match(html, /\.util-learning-header,\.util-journey-nav\{/);
  assert.match(html, /\.util-journey-nav\{/);
  assert.doesNotMatch(html, /--learner-shell-width:/);
  assert.doesNotMatch(html, /--learner-text-2xl:/);
  assert.match(html, /--learner-reading-width:70ch/);
  assert.match(html, /--learner-navigation-width:1200px/);
  assert.match(html, /--learner-font-sans:"Segoe UI",Roboto,Helvetica,Arial,sans-serif/);
  assert.match(html, /--learner-text-base:1rem/);
  assert.match(html, /--learner-leading-body:1\.65/);
  assert.match(html, /--learner-sticky-nav-height:7\.5rem/);
  assert.match(html, /\.util-learning-header,\.util-journey-nav\{width:min\(calc\(100% - 2 \* var\(--learner-page-gutter\)\),var\(--learner-navigation-width\)\)/);
  assert.match(html, /\.util-learning-header,\.util-journey-nav\{[^}]*margin-inline:auto/);
  assert.doesNotMatch(html, /\.util-learning-header\{[^}]*margin-block:0 var\(--learner-space-4\)/);
  assert.doesNotMatch(html, /\.util-learning-header\{[^}]*position:sticky/);
  assert.doesNotMatch(html, /\.util-learning-header\{[^}]*top:0/);
  assert.match(
    html,
    /\.util-learning-header__intro\{width:100%;max-width:var\(--learner-reading-width\);margin-inline:auto;padding-block:\.75rem var\(--learner-space-2\)/
  );
  assert.match(html, /\.util-journey-nav\{[^}]*position:sticky[^}]*top:0[^}]*z-index:50/);
  assert.match(html, /\.util-journey-nav\{[^}]*margin-bottom:var\(--learner-space-4\)/);
  assert.match(html, /\.util-journey-nav\{[^}]*background:rgba\(255,255,255,\.97\)/);
  assert.match(html, /body\.util-page-export--vnext \[data-journey-section\]\{scroll-margin-top:var\(--learner-sticky-nav-height\)/);
  assert.doesNotMatch(html, /\.util-learning-header \[data-journey-section\]\{scroll-margin-top/);
  assert.doesNotMatch(html, /\.util-learning-header \.util-journey-nav/);
  assert.match(html, /\.util-learning-header__subtitle\{[^}]*max-width:min\(100%,58ch\)/);
  assert.match(html, /\.util-learning-header__subtitle\{[^}]*margin-inline:auto/);
  assert.match(html, /\.util-learning-header__subtitle\{[^}]*text-align:left/);
  assert.match(html, /\.util-learning-header__subtitle\{[^}]*white-space:normal/);
  assert.doesNotMatch(html, /\.util-learning-header__subtitle\{[^}]*white-space:nowrap/);
  assert.doesNotMatch(html, /\.util-learning-header__subtitle\{[^}]*text-overflow:ellipsis/);
  assert.doesNotMatch(html, /@media \(max-width:820px\)\{[^}]*\.util-learning-header__subtitle/);
  assert.match(html, /\.util-learning-header__subtitle\{[^}]*color:#475569/);
  assert.match(html, /\.util-learning-header__duration\{color:#64748b;white-space:nowrap\}/);
  assert.doesNotMatch(html, /\.util-learning-header__duration\{display:block/);
  assert.doesNotMatch(html, /\.util-learning-header__duration\{[^}]*margin-block/);
  assert.doesNotMatch(html, /\.util-learning-header__duration\{[^}]*text-align:center/);
  assert.doesNotMatch(html, /\.util-journey-overflow-cue/);
  assert.doesNotMatch(html, /\.util-learning-header__meta-item/);
  assert.match(html, /util-journey-nav--sequential/);
  assert.doesNotMatch(html, /\.util-journey-nav--scroll/);
  assert.doesNotMatch(html, /\.util-journey-nav--compact/);
  assert.doesNotMatch(html, /\.util-journey-track\{/);
  assert.doesNotMatch(html, /\.util-journey-dot\{/);
  assert.match(html, /\.util-journey-all-btn\{/);
  assert.match(html, /\.util-learning-header__title\{[^}]*text-align:center/);
  assert.match(html, /\.util-learning-header__title\{[^}]*margin-block:0 var\(--learner-space-1\)/);
  assert.match(html, /\.util-learner-page\{width:min\(calc\(100% - 2 \* var\(--learner-page-gutter\)\),var\(--learner-reading-width\)\)/);
  assert.doesNotMatch(html, /-webkit-line-clamp|line-clamp:/);
  assert.doesNotMatch(html, /text-overflow:\s*ellipsis/);
  assert.doesNotMatch(html, /@media \(max-width:1024px\)/);
  assert.match(html, /body\.util-page-export--vnext\{[^}]*font-family:var\(--learner-font-sans\)/);
  assert.match(html, /\.util-learner-renderer-vnext\{font-size:var\(--learner-text-base\);line-height:var\(--learner-leading-body\);color:#1f2937;text-align:left\}/);
  assert.match(html, /\.util-learning-header__title\{[^}]*font-size:var\(--learner-text-title\)/);
  assert.match(html, /\.util-section-heading\{[^}]*font-size:var\(--learner-text-xl\)/);
  assert.match(html, /\.util-activity-title\{[^}]*font-size:var\(--learner-text-lg\)/);
  assert.match(html, /\.util-beat-heading\{[^}]*font-size:var\(--learner-text-md\)/);
  assert.match(html, /\.util-material-heading\{[^}]*font-size:var\(--learner-text-base\)/);
  assert.match(html, /\.util-md-heading\{[^}]*font-size:var\(--learner-text-base\)/);
  assert.match(
    html,
    /\.util-md-heading--source-1,\.util-learner-renderer-vnext \.util-md-heading--source-2\{[^}]*font-size:var\(--learner-text-md\)/
  );
  assert.match(html, /\.util-md-heading--source-3\{[^}]*font-size:var\(--learner-text-base\)/);
  assert.match(
    html,
    /\.util-md-heading--source-4,\.util-learner-renderer-vnext \.util-md-heading--source-5,\.util-learner-renderer-vnext \.util-md-heading--source-6\{[^}]*font-size:var\(--learner-text-sm\)/
  );
  assert.match(html, /\.util-beat-instruction\{[^}]*font-size:var\(--learner-text-base\)/);
  assert.match(html, /\.util-guidance-label\{[^}]*font-size:var\(--learner-text-sm\)/);
  assert.match(html, /\.util-guidance-body,[^}]*font-size:var\(--learner-text-base\)/);
  assert.match(html, /\.util-assessment-statement\{[^}]*font-size:var\(--learner-text-base\)/);
  assert.match(html, /\.util-task-card__title\{[^}]*font-size:var\(--learner-text-base\)/);
  assert.match(html, /\.util-assessment-title\{margin:0/);
  assert.match(html, /\.util-assessment-feedback summary\{[^}]*font-size:var\(--learner-text-sm\)/);
  assert.match(html, /\.util-learner-renderer-vnext td\{font-size:\.9375rem/);
  assert.match(html, /\.util-learner-renderer-vnext th\{font-size:\.875rem/);
  assert.equal((html.match(/body\.util-page-export--vnext\{/g) || []).length, 2);
  assert.equal((html.match(/\.util-section-heading\{font-size:var\(--learner-text-xl\)/g) || []).length, 1);
});

test("vNext export: includes section journey navigation and targets", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.match(html, /class="util-learning-header"/);
  assert.match(html, /class="util-journey-nav util-journey-nav--sequential"/);
  assert.match(html, /aria-label="Learning sections"/);
  assert.match(html, /Self assessment/);
  assert.doesNotMatch(html, /util-journey-nav--compact|util-journey-nav--scroll|util-journey-track/);
  assert.match(html, /class="util-learning-header__title"/);
  VNEXT_NAV_TARGETS.forEach((target) => {
    assert.match(html, new RegExp(`href="${target.href.replace("#", "\\#")}"`));
    assert.match(html, new RegExp(`id="${target.id}"[^>]*data-journey-section="true"`));
  });
  assert.match(html, /<script>[\s\S]*util-journey-nav--sequential[\s\S]*<\/script>/);
});

test("vNext export: complete journey exposes eight destinations in All Activities list", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  const linkMatches = html.match(/class="util-journey-all-link"/g) || [];
  assert.equal(linkMatches.length, 8);
  assert.match(html, /href="#journey-orient"[\s\S]*?>[\s\S]*?Orient/);
  VNEXT_ACTIVITY_NAV_TITLES.forEach((title) => {
    assert.match(
      html,
      new RegExp(`class="util-journey-all-link"[^>]*>${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<`)
    );
  });
  assert.match(html, /href="#journey-assessment"[\s\S]*Self assessment/);
  assert.match(html, /href="#journey-study-tips"[\s\S]*Study tips/);
});

test("vNext export: authored activity titles preserve full accessible names", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  VNEXT_ACTIVITY_NAV_TITLES.forEach((title, index) => {
    const activityId = "A" + String(index + 1);
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(html, new RegExp(`href="#activity-${activityId}"`));
    assert.match(
      html,
      new RegExp(`class="util-journey-all-link" href="#activity-${activityId}"[^>]*>${escaped}<`)
    );
  });
  assert.match(
    html,
    new RegExp(
      `aria-label="Next section: ${VNEXT_ACTIVITY_NAV_TITLES[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`
    )
  );
});

test('vNext export: assessment nav label uses "Self assessment"', () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.match(html, /href="#journey-assessment"/);
  assert.match(html, /Self assessment/);
  assert.match(html, /class="util-journey-all-link" href="#journey-assessment"[^>]*>Self assessment</);
});

test("vNext export: assessment nav item omitted when assessment absent", () => {
  const { api } = loadPrismTestApi();
  const fixture = loadFixture();
  fixture.assessment_check = { items: [] };
  const html = renderVnextExport(api, fixture);
  assert.doesNotMatch(html, /href="#journey-assessment"/);
  assert.doesNotMatch(html, /id="journey-assessment"/);
});

test('vNext export: visible assessment section heading uses "Self assessment"', () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.match(html, /<section[^>]*data-region="assessment"[^>]*>/);
  assert.match(html, /util-semantic-icon__label">Self assessment<\/span>/);
  assert.doesNotMatch(html, /util-semantic-icon__label">Assessment<\/span>/);
});

test("vNext export: sequential nav keeps endpoints reachable without scroll cue", () => {
  const { api } = loadPrismTestApi();
  const html = api.utilityRenderVnextSequentialJourneyNavHtmlForTest(
    Array.from({ length: 9 }, (_, i) => ({
      id: "activity-" + i,
      label: "Step " + i,
      accessibleLabel: "Step " + i,
      title: "Step " + i
    })),
    { currentIndex: 0 }
  );
  assert.match(html, /util-journey-nav--sequential/);
  assert.match(html, /href="#activity-0"/);
  assert.match(html, /href="#activity-8"/);
  assert.doesNotMatch(html, /util-journey-overflow-cue/);
  assert.doesNotMatch(html, /Scroll →/);
  assert.doesNotMatch(html, /util-journey-track/);
});

test("vNext export: 320px-safe layout and print rule present", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.match(html, /overflow-x:clip/);
  assert.match(html, /@media \(max-width:720px\)/);
  assert.match(html, /@media print\{/);
  assert.match(html, /min-width:34rem/);
});

test("vNext export: material markdown headings are scoped and not browser defaults", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.match(
    html,
    /\.util-md-heading--source-1,\.util-learner-renderer-vnext \.util-md-heading--source-2\{[^}]*font-size:var\(--learner-text-md\)/
  );
  assert.match(html, /\.util-md-heading--source-3\{[^}]*font-size:var\(--learner-text-base\)/);
  assert.match(
    html,
    /\.util-md-heading--source-4,\.util-learner-renderer-vnext \.util-md-heading--source-5,\.util-learner-renderer-vnext \.util-md-heading--source-6\{[^}]*font-size:var\(--learner-text-sm\)/
  );
  assert.doesNotMatch(html, /\.util-material-block h2,/);
  assert.doesNotMatch(html, /\.util-material-block h4,/);
  assert.doesNotMatch(html, /\.util-learner-renderer-vnext h2\{font-size:1\.5em/);
});

test("vNext export: retains vNext marker and excludes legacy renderer duplicates", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.match(html, /data-renderer="vnext"/);
  LEGACY_RENDERER_ONLY_MARKERS.forEach((marker) => {
    assert.equal(
      html.includes(marker),
      false,
      `vNext export must not contain legacy renderer marker: ${marker}`
    );
  });
});

test("vNext export: legacy output unchanged", () => {
  const { api } = loadPrismTestApi();
  const fixture = loadFixture();
  const legacyViaEntry = renderLegacyExport(api, fixture);
  const legacyBaseline = api.buildUtilityStructuredHtmlForTest(fixture, ["sections"], {
    applyCompositionValidation: false,
    rendererVersion: "legacy"
  });
  assert.ok(legacyBaseline && !legacyBaseline.error, legacyBaseline && legacyBaseline.error);
  assert.equal(legacyViaEntry, String(legacyBaseline.html || ""));
  assert.doesNotMatch(legacyViaEntry, /data-renderer="vnext"/);
  assert.doesNotMatch(legacyViaEntry, /util-vnext-activity/);
});

test("vNext export: preview and download paths share the same pipeline output", () => {
  const { api } = loadPrismTestApi();
  const fixture = loadFixture();
  const first = renderVnextExport(api, fixture);
  const second = renderVnextExport(api, fixture);
  assert.equal(first, second);
});

test("vNext export: scroll cue is absent from generated HTML", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.doesNotMatch(html, /util-journey-overflow-cue/);
  assert.doesNotMatch(html, /Scroll →/);
});

const EXPECTED_HEADER_SUBTITLE =
  "This self-study lesson introduces heteroscedasticity, a common issue in applied economic regression analysis.";

function renderDefaultExport(api, fixture) {
  const result = api.renderLearnerPageForTest(fixture, {
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  return String(result.html || "");
}

test("vNext export: default renderer selection produces vNext shell", () => {
  const { api } = loadPrismTestApi();
  const html = renderDefaultExport(api, loadFixture());
  assert.match(html, /body class="[^"]*\butil-page-export--vnext\b/);
  assert.match(html, /data-renderer="vnext"/);
});

test("vNext export: header subtitle uses first overview sentence and legacy duration", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  const escapedSubtitle = EXPECTED_HEADER_SUBTITLE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(html, /class="util-learning-header__intro"/);
  assert.match(
    html,
    new RegExp(
      `class="util-learning-header__subtitle">${escapedSubtitle} <span class="util-learning-header__duration">60 mins\\.</span></p>`
    )
  );
  assert.doesNotMatch(html, /<p class="util-learning-header__duration">/);
  assert.doesNotMatch(html, /util-learning-header__meta-item/);
  assert.doesNotMatch(html, /5 activities/);
  assert.doesNotMatch(html, /util-learning-header__mode/);
  assert.doesNotMatch(html, /util-learning-header__assessment-meta/);
  assert.doesNotMatch(html, /60 min ·/);
});

test("vNext export: full overview remains in Orient section", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.match(html, /data-orientation-type="overview"/);
  assert.match(
    html,
    /This self-study lesson introduces heteroscedasticity, a common issue in applied economic regression analysis\. You will progress from understanding residual variance/
  );
  const headerIntro = html.match(/<div class="util-learning-header__intro">[\s\S]*?<\/div>/);
  assert.ok(headerIntro);
  const headerSubtitleCount = (headerIntro[0].match(/util-learning-header__subtitle/g) || []).length;
  assert.equal(headerSubtitleCount, 1);
});

test("vNext export: first-sentence helper behaviour", () => {
  const { api } = loadPrismTestApi();
  const extract = api.utilityExtractFirstCompleteSentenceForTest;
  assert.equal(
    extract(
      "## Overview\n\nThis self-study lesson introduces heteroscedasticity, a common issue in applied economic regression analysis. You will progress further."
    ),
    EXPECTED_HEADER_SUBTITLE
  );
  assert.equal(extract("One sentence only."), "One sentence only.");
  assert.equal(extract("No terminal punctuation here"), "No terminal punctuation here");
  assert.equal(extract(""), "");
  assert.equal(extract("   "), "");
  assert.doesNotMatch(extract("First sentence ends here. Second begins."), /\.\.\./);
});

test("vNext export: duration formatting uses legacy mins convention", () => {
  const { api } = loadPrismTestApi();
  const buildIntro = api.utilityBuildVnextLearningHeaderIntroForTest;
  assert.equal(
    buildIntro({ header: { durationMinutes: 60, description: "" } }, {}).duration,
    "60 mins."
  );
  assert.equal(
    buildIntro({ header: { durationMinutes: 1, description: "" } }, {}).duration,
    "1 min."
  );
  assert.equal(
    buildIntro({ header: { durationMinutes: 90, description: "" } }, {}).duration,
    "90 mins."
  );
});

test("vNext export: missing overview omits subtitle cleanly", () => {
  const { api } = loadPrismTestApi();
  const buildIntro = api.utilityBuildVnextLearningHeaderIntroForTest;
  const intro = buildIntro({ header: { durationMinutes: 20, description: "" } }, {});
  assert.equal(intro.subtitle, "");
  assert.equal(intro.duration, "20 mins.");
  const fixture = loadFixture();
  fixture.page_synthesis.overview.body = "";
  const html = renderVnextExport(api, fixture);
  assert.doesNotMatch(html, /class="util-learning-header__subtitle">This self-study/);
  assert.match(
    html,
    /class="util-learning-header__subtitle"><span class="util-learning-header__duration">60 mins\.<\/span><\/p>/
  );
});

test("vNext export: missing duration omits duration element cleanly", () => {
  const { api } = loadPrismTestApi();
  const fixture = loadFixture();
  (fixture.activities || []).forEach((activity) => {
    delete activity.duration_minutes;
    delete activity.durationMinutes;
  });
  const html = renderVnextExport(api, fixture);
  const headerIntro = html.match(/<div class="util-learning-header__intro">[\s\S]*?<\/div>/);
  assert.ok(headerIntro);
  assert.match(headerIntro[0], /class="util-learning-header__subtitle">[^<]+<\/p>/);
  assert.doesNotMatch(headerIntro[0], /util-learning-header__duration/);
  assert.doesNotMatch(headerIntro[0], /\d+\s*mins?\./i);
  assert.doesNotMatch(headerIntro[0], /class="util-learning-header__subtitle">[^<]*\s<\/p>/);
});

test("vNext export: assessment label appears in nav and section only", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  const headerIntro = html.match(/<div class="util-learning-header__intro">[\s\S]*?<\/div>/);
  assert.ok(headerIntro);
  assert.doesNotMatch(headerIntro[0], /Self assessment/);
  assert.match(html, /href="#journey-assessment"[\s\S]*Self assessment/);
  assert.match(html, /util-semantic-icon__label">Self assessment<\/span>/);
});

test("vNext export: sticky navigation shell uses full width intro and nav-only sticky", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  const headerMatch = html.match(/<header class="util-learning-header">[\s\S]*?<\/header>/);
  assert.ok(headerMatch, "Expected introductory header markup.");
  const headerHtml = headerMatch[0];
  assert.match(headerHtml, /<div class="util-learning-header__intro">/);
  assert.doesNotMatch(headerHtml, /<nav class="util-journey-nav/);
  const navMatch = html.match(/<nav class="util-journey-nav[^"]*"[\s\S]*?<\/nav>/);
  assert.ok(navMatch, "Expected journey navigation markup.");
  const headerEnd = html.indexOf("</header>");
  const navStart = html.indexOf('<nav class="util-journey-nav');
  assert.ok(headerEnd > -1 && navStart > headerEnd, "Navigation must follow the closed header as a sibling.");
  assert.doesNotMatch(html, /\.util-learning-header::before/);
  assert.doesNotMatch(html, /\.util-journey-nav::before/);
  assert.doesNotMatch(html, /\.util-journey-nav\{[^}]*100vw/);
  assert.doesNotMatch(html, /position:fixed/);
  assert.match(html, /@media print\{[^}]*\.util-learning-header,.util-journey-nav\{display:none!important/);
  assert.match(html, /stickyClearanceHeight\(\)\+8/);
  assert.doesNotMatch(html, /header\|\|nav\)\.offsetHeight/);
  assert.match(html, /--learner-sticky-nav-height/);
  assert.match(html, /scroll-margin-top:var\(--learner-sticky-nav-height\)/);
  assert.doesNotMatch(html, /header\.querySelector\('\.util-journey-nav'\)/);
  assert.doesNotMatch(html, /classList\.(add|toggle)\(['"]is-sticky/);
});

test("vNext export: sequential nav CSS replaces compact/scroll track modes", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.doesNotMatch(html, /min-width:0;min-width:0/);
  assert.doesNotMatch(html, /-ms-overflow-style:/);
  assert.doesNotMatch(html, /\.util-journey-nav--scroll/);
  assert.doesNotMatch(html, /\.util-journey-nav--compact/);
  assert.doesNotMatch(html, /\.util-journey-track\{/);
  assert.doesNotMatch(html, /\.util-journey-dot\{/);
  assert.match(html, /util-journey-nav--sequential/);
  assert.match(html, /\.util-journey-all-btn\{/);
  assert.match(html, /\.util-journey-adjacent\{/);
  assert.match(html, /@media print\{[\s\S]*\.util-learner-page\{width:100%;max-width:none;padding:0\}/);
  assert.match(html, /\.util-learning-header__subtitle\{[^}]*max-width:min\(100%,58ch\)/);
  assert.match(html, /\.util-learning-header__subtitle\{[^}]*text-align:left/);
  assert.doesNotMatch(html, /\.util-learning-header__subtitle\{[^}]*white-space:nowrap/);
  assert.match(html, /\.util-knowledge-summary__content/);
  assert.match(html, /\.util-learner-renderer-vnext \.util-activity\{[^}]*padding:0;border:0;background:transparent/);
});

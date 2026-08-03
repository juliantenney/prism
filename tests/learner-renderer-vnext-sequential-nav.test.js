"use strict";

/**
 * vNext sequential journey navigation (renderer/UI only).
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

function makeItems(count, opts) {
  const options = opts || {};
  const titleFor = (i) => {
    if (typeof options.titleFor === "function") return options.titleFor(i);
    return "Section " + (i + 1);
  };
  return Array.from({ length: count }, (_, i) => ({
    id: i === 0 ? "journey-orient" : "activity-A" + i,
    label: titleFor(i),
    accessibleLabel: titleFor(i),
    title: titleFor(i)
  }));
}

test("sequential nav: canonical section ordering and n of total", () => {
  const { api } = loadPrismTestApi();
  const items = makeItems(9);
  const html = api.utilityRenderVnextSequentialJourneyNavHtmlForTest(items, { currentIndex: 3 });
  assert.match(html, /aria-label="Learning sections"/);
  assert.match(html, /data-journey-total="9"/);
  assert.match(html, /aria-label="Section 4 of 9"/);
  assert.match(html, /util-journey-position__visible"[^>]*>4 of 9</);
  assert.match(html, /data-journey-current-title="true">Section 4</);
  assert.doesNotMatch(
    html,
    /util-journey-track|util-journey-dot|util-journey-fill|--journey-progress|% complete|completed|visited|locked/i
  );
});

test("sequential nav: preceding and following destination calculation", () => {
  const { api } = loadPrismTestApi();
  const items = makeItems(7);
  const mid = api.utilityRenderVnextSequentialJourneyNavHtmlForTest(items, { currentIndex: 3 });
  assert.match(mid, /util-journey-adjacent--prev"[^>]*href="#activity-A2"/);
  assert.match(mid, /aria-label="Previous section: Section 3"/);
  assert.match(mid, /util-journey-adjacent--next"[^>]*href="#activity-A4"/);
  assert.match(mid, /aria-label="Next section: Section 5"/);
  assert.match(mid, /‹/);
  assert.match(mid, /›/);
});

test("sequential nav: first-section omits previous link", () => {
  const { api } = loadPrismTestApi();
  const html = api.utilityRenderVnextSequentialJourneyNavHtmlForTest(makeItems(5), {
    currentIndex: 0
  });
  assert.match(
    html,
    /util-journey-adjacent--placeholder util-journey-adjacent--prev/
  );
  assert.doesNotMatch(html, /util-journey-adjacent--prev"[^>]*href=/);
  assert.match(html, /util-journey-adjacent--next"[^>]*href="#activity-A1"/);
  assert.doesNotMatch(html, /disabled|aria-disabled="true"/);
  assert.doesNotMatch(html, />\s*Previous\s*</);
  assert.doesNotMatch(html, />\s*Next\s*</);
});

test("sequential nav: final-section omits following link", () => {
  const { api } = loadPrismTestApi();
  const html = api.utilityRenderVnextSequentialJourneyNavHtmlForTest(makeItems(5), {
    currentIndex: 4
  });
  assert.match(
    html,
    /util-journey-adjacent--placeholder util-journey-adjacent--next/
  );
  assert.doesNotMatch(html, /util-journey-adjacent--next"[^>]*href=/);
  assert.match(html, /util-journey-adjacent--prev"[^>]*href="#activity-A3"/);
  assert.match(html, /aria-label="Section 5 of 5"/);
});

test("sequential nav: All Activities list, disclosure attrs, aria-current", () => {
  const { api } = loadPrismTestApi();
  const items = makeItems(12);
  const html = api.utilityRenderVnextSequentialJourneyNavHtmlForTest(items, { currentIndex: 5 });
  assert.match(
    html,
    /<button type="button" class="util-journey-all-btn"[^>]*aria-expanded="false"[^>]*aria-controls="util-journey-all-panel"[^>]*aria-label="All activities"/
  );
  assert.match(html, /id="util-journey-all-panel"[^>]*hidden/);
  const links = html.match(/class="util-journey-all-link"/g) || [];
  assert.equal(links.length, 12);
  assert.match(html, /href="#journey-orient"/);
  assert.match(html, /href="#activity-A11"/);
  assert.match(html, /href="#activity-A5"[^>]*aria-current="location"/);
  assert.equal((html.match(/aria-current="location"/g) || []).length, 1);
});

test("sequential nav: complete titles up to 60 characters", () => {
  const { api } = loadPrismTestApi();
  const title45 = "Applying Ohms Law to Series Circuits Carefuly";
  const title60 = "Interpreting Osmosis Data Tables With Careful Method Notes!!";
  assert.equal(title45.length, 45);
  assert.equal(title60.length, 60);
  const items = [
    { id: "journey-orient", label: "Orient", title: "Orient" },
    { id: "activity-A1", label: title45, title: title45 },
    { id: "activity-A2", label: title60, title: title60 },
    { id: "journey-study-tips", label: "Study tips", title: "Study tips" }
  ];
  const html = api.utilityRenderVnextSequentialJourneyNavHtmlForTest(items, {
    currentIndex: 1
  });
  assert.match(html, new RegExp(title45.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(html, new RegExp(title60.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(html, /\.\.\.</);
  assert.match(
    html,
    /aria-label="Next section: Interpreting Osmosis Data Tables With Careful Method Notes!!"/
  );
});

test("sequential nav: script targets sequential nav without progress track", () => {
  const { api } = loadPrismTestApi();
  const script = api.utilityBuildVnextSequentialJourneyNavScriptForTest();
  assert.match(script, /util-journey-nav--sequential/);
  assert.match(script, /util-journey-all-link/);
  assert.match(script, /getElementById/);
  assert.match(script, /aria-current/);
  assert.match(script, /util-journey-all-btn/);
  assert.match(script, /util-journey-all-close/);
  assert.match(script, /stickyClearanceHeight|lastStickyClearance/);
  assert.match(script, /renderAdjacentSlot|focusedAdjacentDirection/);
  assert.match(script, /maxScroll/);
  assert.doesNotMatch(script, /titlesHost\.innerHTML\s*=/);
  assert.doesNotMatch(script, /querySelectorAll\('\[data-journey-section\]'\)/);
  assert.doesNotMatch(script, /util-journey-track|journey-progress|aria-live/);
});

test("sequential nav: canonical model excludes structural activities container", () => {
  const { api } = loadPrismTestApi();
  const items = [
    { id: "journey-orient", label: "Orient", title: "Orient" },
    { id: "activity-A1", label: "Activity 1", title: "Activity 1" },
    { id: "activity-A2", label: "Activity 2", title: "Activity 2" },
    { id: "activity-A3", label: "Activity 3", title: "Activity 3" },
    { id: "activity-A4", label: "Activity 4", title: "Activity 4" },
    { id: "activity-A5", label: "Activity 5", title: "Activity 5" },
    { id: "journey-study-tips", label: "Study tips", title: "Study tips" }
  ];
  const html = api.utilityRenderVnextSequentialJourneyNavHtmlForTest(items, {
    currentIndex: 1
  });
  assert.match(html, /data-journey-total="7"/);
  assert.match(html, /aria-label="Section 2 of 7"/);
  assert.match(html, /util-journey-position__visible"[^>]*>2 of 7</);
  assert.match(html, /data-journey-current-title="true">Activity 1</);
  assert.match(html, /aria-label="Previous section: Orient"/);
  assert.match(html, /aria-label="Next section: Activity 2"/);
  assert.equal((html.match(/class="util-journey-all-link"/g) || []).length, 7);
  assert.match(html, /href="#activity-A1"[^>]*aria-current="location"/);
  assert.doesNotMatch(html, /href="#journey-activities"/);
  assert.match(html, /util-journey-sequential__row/);
  assert.match(html, /util-journey-all-close/);
  assert.doesNotMatch(html, /util-journey-sequential__toolbar/);
});

test("sequential nav: optional assessment counted once with activities container present in export", () => {
  const { api } = loadPrismTestApi();
  const withAssessment = renderVnextExport(api, loadFixture());
  assert.match(withAssessment, /id="journey-activities"[^>]*data-journey-section="true"/);
  assert.equal((withAssessment.match(/class="util-journey-all-link"/g) || []).length, 8);
  assert.match(withAssessment, /data-journey-total="8"/);
  assert.equal(
    (withAssessment.match(/href="#journey-assessment"/g) || []).length,
    (withAssessment.match(/class="util-journey-all-link" href="#journey-assessment"/g) || []).length
  );

  const fixture = loadFixture();
  fixture.assessment_check = { items: [] };
  const withoutAssessment = renderVnextExport(api, fixture);
  assert.match(withoutAssessment, /id="journey-activities"[^>]*data-journey-section="true"/);
  assert.equal((withoutAssessment.match(/class="util-journey-all-link"/g) || []).length, 7);
  assert.match(withoutAssessment, /data-journey-total="7"/);
  assert.doesNotMatch(withoutAssessment, /href="#journey-assessment"/);

  const script = api.utilityBuildVnextSequentialJourneyNavScriptForTest();
  assert.match(script, /panelLinks\.forEach/);
  assert.match(script, /getElementById\(id\)/);
  assert.doesNotMatch(script, /querySelectorAll\('\[data-journey-section\]'\)/);
});

test("sequential nav: vNext export uses sequential model and keeps anchors", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.match(html, /util-journey-nav--sequential/);
  assert.match(html, /aria-label="Learning sections"/);
  assert.doesNotMatch(html, /util-journey-nav--compact|util-journey-nav--scroll|util-journey-track/);
  assert.match(html, /href="#journey-orient"/);
  assert.match(html, /href="#journey-assessment"/);
  assert.match(html, /href="#journey-study-tips"/);
  assert.match(html, /util-journey-all-link/);
  assert.match(html, /util-journey-all-btn/);
  assert.match(html, /<script>[\s\S]*util-journey-nav--sequential[\s\S]*<\/script>/);
  assert.doesNotMatch(html, /util-journey-dot/);
});

test("sequential nav: CSS removes progress track from vNext export", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.doesNotMatch(html, /\.util-journey-track\{/);
  assert.doesNotMatch(html, /\.util-journey-dot\{/);
  assert.doesNotMatch(html, /util-journey-nav--compact/);
  assert.doesNotMatch(html, /util-journey-nav--scroll/);
  assert.match(html, /util-journey-all-btn/);
  assert.doesNotMatch(html, /-webkit-line-clamp|line-clamp:/);
  assert.doesNotMatch(html, /text-overflow:\s*ellipsis/);
});

test("sequential nav: compact centred desktop unit and panel chrome", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, loadFixture());
  assert.match(
    html,
    /\.util-journey-sequential\{[^}]*max-width:var\(--learner-reading-width\);margin-inline:auto/
  );
  assert.match(
    html,
    /\.util-journey-sequential__row\{display:grid;grid-template-columns:44px repeat\(3,minmax\(0,1fr\)\)/
  );
  assert.match(
    html,
    /@media \(min-width:900px\)\{\.util-journey-sequential__row\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)\}\.util-journey-all-btn\{position:absolute;inset-inline-end:calc\(100% \+ var\(--journey-all-btn-gap\)\)/
  );
  assert.doesNotMatch(html, /\.util-journey-sequential__row::after/);
  assert.match(html, /\.util-journey-sequential\{[^}]*border-bottom:1px solid #e2e8f0/);
  assert.match(html, /\.util-journey-all-panel\{[^}]*width:100%;max-width:100%/);
  assert.match(html, /\.util-journey-all-btn\{[^}]*min-height:44px/);
  assert.match(html, /overflow-wrap:break-word/);
  assert.doesNotMatch(
    html,
    /\.util-journey-adjacent__title,\.util-journey-current\{[^}]*overflow-wrap:anywhere/
  );
  assert.match(html, /\.util-journey-adjacent\{display:grid;grid-template-columns:1\.15em minmax\(0,1fr\) 1\.15em/);
  assert.match(html, /\.util-journey-adjacent\{[^}]*text-align:center/);
  assert.match(html, /\.util-journey-adjacent--prev \.util-journey-adjacent__chevron\{grid-column:1;justify-self:start\}/);
  assert.match(html, /\.util-journey-adjacent--next \.util-journey-adjacent__chevron\{grid-column:3;justify-self:end\}/);
  assert.match(html, /\.util-journey-adjacent__title\{grid-column:1\/-1;grid-row:1;[^}]*text-align:center\}/);
  assert.doesNotMatch(html, /\.util-journey-adjacent--prev\{[^}]*text-align:left/);
  assert.doesNotMatch(html, /\.util-journey-adjacent--next\{[^}]*text-align:right/);
  assert.doesNotMatch(html, /max-width:min\(100%,44rem\)/);
  assert.match(html, /util-journey-all-panel__header/);
  assert.match(html, /util-journey-all-close/);
});

test("sequential nav: 5/7/9/12 section counts render position and list", () => {
  const { api } = loadPrismTestApi();
  [5, 7, 9, 12].forEach((count) => {
    const html = api.utilityRenderVnextSequentialJourneyNavHtmlForTest(makeItems(count), {
      currentIndex: Math.min(2, count - 1)
    });
    assert.match(html, new RegExp('data-journey-total="' + count + '"'));
    assert.equal((html.match(/class="util-journey-all-link"/g) || []).length, count);
  });
});

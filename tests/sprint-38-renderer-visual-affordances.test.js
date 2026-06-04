/**
 * Sprint 38-7 — renderer visual affordance alignment (hooks + passthrough).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const s38LibPath = path.join(repoRoot, "lib", "sprint38-visual-affordances.js");
const recordsPath = path.join(repoRoot, "tests", "fixtures", "sprint-38", "affordance-records.json");
const fixturesDir = path.join(repoRoot, "tests", "fixtures", "page-render");

const records = JSON.parse(fs.readFileSync(recordsPath, "utf8"));

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => false },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    click: () => {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const s38Source = fs.readFileSync(s38LibPath, "utf8");
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
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
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
  vm.runInContext(s38Source, sandbox, { filename: "sprint38-visual-affordances.js" });
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function loadPage(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function renderPage(api, page) {
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

function pageWithAffordances(base, affordanceList) {
  const page = JSON.parse(JSON.stringify(base));
  page.visual_affordance_schema_version = "38.4";
  page.visual_affordances = affordanceList.map((r) => JSON.parse(JSON.stringify(r)));
  return page;
}

function activityBlocks(html) {
  const out = [];
  const source = String(html || "");
  const openRe = /<article class="util-task-block">/gi;
  let openMatch;
  while ((openMatch = openRe.exec(source))) {
    const start = openMatch.index;
    let depth = 0;
    const tagRe = /<(\/?)article\b[^>]*>/gi;
    tagRe.lastIndex = start;
    let tagMatch;
    while ((tagMatch = tagRe.exec(source))) {
      depth += tagMatch[1] ? -1 : 1;
      if (depth === 0) {
        out.push(source.slice(start, tagRe.lastIndex));
        break;
      }
    }
  }
  return out;
}

function hooksIn(html) {
  return String(html || "").match(/util-visual-affordance/g) || [];
}

function assertNoAffordanceInsideForbiddenRegions(html) {
  const headerInners = String(html || "").match(
    /<div class="util-activity-header"[^>]*>([\s\S]*?)<\/div>/gi
  );
  if (headerInners) {
    for (let i = 1; i < headerInners.length; i += 1) {
      assert.doesNotMatch(headerInners[i], /util-visual-affordance/);
    }
  }
}

const api = loadPrismTestApi();

test("render plan: empty affordances => legacy mode", () => {
  const plan = api.utilityBuildVisualAffordanceRenderPlanForTest({ visual_affordances: [] });
  assert.equal(plan.legacy, true);
});

test("render plan: non-empty affordances => authoritative mode", () => {
  const plan = api.utilityBuildVisualAffordanceRenderPlanForTest({
    visual_affordances: [records.inflation_a2_generate]
  });
  assert.equal(plan.legacy, false);
  assert.ok(plan.slotGenerate["a2|materials-entry"]);
});

test("hook renderer: data-affordance-id and data-activity-id passthrough", () => {
  const hook = api.utilityRenderVisualAffordanceHookForTest("materials-entry", {
    activityId: "A2",
    affordanceId: "va-A2-cpi-deflator-distinction"
  });
  assert.match(hook, /data-affordance-id="va-A2-cpi-deflator-distinction"/);
  assert.match(hook, /data-activity-id="A2"/);
  assert.match(hook, /data-visual-activity-id="A2"/);
});

test("legacy page: climate fixture unchanged (hooks present, no affordance id)", () => {
  const html = renderPage(api, loadPage("ld-climate-misconception-discussion-page.json"));
  assert.ok(hooksIn(html).length >= 2);
  assert.doesNotMatch(html, /data-affordance-id=/);
  assertNoAffordanceInsideForbiddenRegions(html);
});

test("authoritative generate: climate mechanism hook at card-grid-after", () => {
  const page = pageWithAffordances(loadPage("ld-climate-misconception-discussion-page.json"), [
    records.climate_mechanism_generate
  ]);
  const html = renderPage(api, page);
  assert.match(html, /data-affordance-id="va-CC-MIS-1-radiative-mechanism"/);
  assert.match(
    html,
    /util-visual-affordance--materials-card-grid-after[\s\S]*?data-affordance-id="va-CC-MIS-1-radiative-mechanism"/
  );
  assert.doesNotMatch(html, /util-visual-affordance--activity-after-header/);
  assertNoAffordanceInsideForbiddenRegions(html);
});

test("authoritative generate: inflation A2 materials-entry only", () => {
  const page = pageWithAffordances(loadPage("ld-inflation-workshop-page-full.json"), [
    records.inflation_a2_generate
  ]);
  const html = renderPage(api, page);
  const a2 = activityBlocks(html).find((b) => /Indicator Comparison/i.test(b));
  assert.ok(a2, "expected A2 block");
  assert.match(a2, /data-affordance-id="va-A2-cpi-deflator-distinction"/);
  assert.match(a2, /util-visual-affordance--materials-entry/);
  assert.doesNotMatch(a2, /util-visual-affordance--activity-after-header/);
});

test("authoritative reject: inflation A5 emits no hooks in A5 block", () => {
  const page = pageWithAffordances(loadPage("ld-inflation-workshop-page-full.json"), [
    records.inflation_a5_reject
  ]);
  const html = renderPage(api, page);
  const a5 = activityBlocks(html).find((b) => /Debrief|Whole group/i.test(b));
  assert.ok(a5, "expected A5 block");
  assert.equal(hooksIn(a5).length, 0);
});

test("authoritative defer: suppresses hooks for deferred activity", () => {
  const deferOnly = {
    affordance_id: "va-A1-procedure-defer",
    activity_id: "A1",
    visual_decision: "defer",
    defer_reason: "worked_example_sufficient_first",
    rationale: "Worked example sufficient before figure."
  };
  const page = pageWithAffordances(loadPage("confidence-interval-a2-multitable-page.json"), [
    deferOnly
  ]);
  const html = renderPage(api, page);
  const a1 = activityBlocks(html).find((b) => /A1|Worked example|confidence interval/i.test(b));
  assert.ok(a1, "expected A1 block");
  assert.equal(hooksIn(a1).length, 0);
});

test("authoritative generate: CI A4 number_line materials-entry", () => {
  const page = pageWithAffordances(loadPage("confidence-interval-a2-multitable-page.json"), [
    records.ci_a4_generate
  ]);
  const html = renderPage(api, page);
  const a4 = activityBlocks(html).find((b) => /Interval comparison scenario/i.test(b));
  assert.ok(a4, "expected A4 block");
  assert.match(a4, /data-affordance-id="va-A4-interval-overlap"/);
  assert.match(a4, /util-visual-affordance--materials-entry/);
});

test("legacy inflation: still emits hooks without authored affordances", () => {
  const legacyHtml = renderPage(api, loadPage("ld-inflation-workshop-page-full.json"));
  const s38Page = pageWithAffordances(loadPage("ld-inflation-workshop-page-full.json"), [
    records.inflation_a2_generate
  ]);
  const s38Html = renderPage(api, s38Page);
  assert.ok(hooksIn(legacyHtml).length > hooksIn(s38Html).length);
});

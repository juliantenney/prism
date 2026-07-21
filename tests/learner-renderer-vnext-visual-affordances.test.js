"use strict";

/**
 * Sprint 67 — vNext visual affordance contract preservation and downstream discovery.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const vnext = require("../lib/learner-renderer-vnext");
const {
  discoverVisualAffordanceHooks,
  assertUniqueHooks
} = require("../lib/learner-renderer-vnext/discover-visual-affordance-hooks");
const {
  renderVisualAffordanceHook
} = require("../lib/learner-renderer-vnext/render-visual-affordance");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const s38LibPath = path.join(repoRoot, "lib", "sprint38-visual-affordances.js");
const recordsPath = path.join(repoRoot, "tests", "fixtures", "sprint-38", "affordance-records.json");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const records = JSON.parse(fs.readFileSync(recordsPath, "utf8"));

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function pageWithAffordances(page, affordances) {
  return Object.assign({}, page, {
    visual_affordance_schema_version: "38.4",
    visual_affordances: affordances.slice()
  });
}

function renderVnextHtml(page, options) {
  const rendered = vnext.renderLearnerPageHtml(page, options);
  assert.equal(rendered.error, null, rendered.error || "render failed");
  return String(rendered.html || "");
}

function renderBeatsHtml(page) {
  return renderVnextHtml(page, { compositionMode: "beats" });
}

function activityBlocks(html) {
  const out = [];
  const source = String(html || "");
  const openRe = /<article class="util-activity[^"]*"/gi;
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

function loadLegacyApi() {
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
  vm.runInContext(s38Source, sandbox, { filename: "sprint38-visual-affordances.js" });
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function assertNoAffordanceInsideForbiddenRegions(html) {
  const headerInners = String(html || "").match(
    /<header class="util-activity-header"[^>]*>([\s\S]*?)<\/header>/gi
  );
  if (headerInners) {
    headerInners.forEach(function (inner) {
      assert.doesNotMatch(inner, /util-visual-affordance/);
    });
  }
}

test("visual affordance hook renderer matches legacy contract", () => {
  const hook = renderVisualAffordanceHook({
    slot: "materials-entry",
    activityId: "A2",
    affordanceId: "va-A2-cpi-deflator-distinction",
    subject: "Indicator Comparison"
  });
  assert.match(hook, /^<div class="util-visual-affordance util-visual-affordance--materials-entry"/);
  assert.match(hook, /data-visual-slot="materials-entry"/);
  assert.match(hook, /data-affordance-id="va-A2-cpi-deflator-distinction"/);
  assert.match(hook, /data-activity-id="A2"/);
  assert.match(hook, /data-visual-activity-id="A2"/);
  assert.match(hook, /\shidden\b/);
  assert.match(hook, /aria-hidden="true"/);
});

test("vNext legacy mode: heteroscedasticity emits hooks without affordance ids", () => {
  const html = renderVnextHtml(loadFixture());
  const hooks = discoverVisualAffordanceHooks(html);
  assert.ok(hooks.length >= 2);
  assertUniqueHooks(hooks);
  assert.ok(
    hooks.every(function (hook) {
      return !hook.affordanceId;
    })
  );
  assertNoAffordanceInsideForbiddenRegions(html);
});

test("vNext authoritative: A2 materials-entry only with stable affordance id", () => {
  const page = pageWithAffordances(loadFixture(), [records.inflation_a2_generate]);
  const html = renderBeatsHtml(page);
  const hooks = discoverVisualAffordanceHooks(html);
  const a2 = activityBlocks(html).find(function (block) {
    return /data-activity-id="A2"/.test(block);
  });
  assert.ok(a2, "expected A2 activity block");
  const a2Hooks = discoverVisualAffordanceHooks(a2);
  assert.equal(a2Hooks.length, 1);
  assert.equal(a2Hooks[0].slot, "materials-entry");
  assert.equal(a2Hooks[0].affordanceId, "va-A2-cpi-deflator-distinction");
  assert.equal(a2Hooks[0].activityId, "A2");
  assert.doesNotMatch(a2, /util-visual-affordance--activity-after-header/);
  assertUniqueHooks(hooks);
});

test("vNext authoritative defer: suppresses hooks for deferred activity", () => {
  const deferOnly = {
    affordance_id: "va-A1-procedure-defer",
    activity_id: "A1",
    visual_decision: "defer",
    defer_reason: "worked_example_sufficient_first",
    rationale: "Worked example sufficient before figure."
  };
  const page = pageWithAffordances(loadFixture(), [deferOnly]);
  const html = renderVnextHtml(page);
  const a1 = activityBlocks(html).find(function (block) {
    return /data-activity-id="A1"/.test(block);
  });
  assert.ok(a1, "expected A1 block");
  assert.equal(discoverVisualAffordanceHooks(a1).length, 0);
});

test("vNext model: visualAffordancePlan populated from source JSON", () => {
  const page = pageWithAffordances(loadFixture(), [records.inflation_a2_generate]);
  const built = vnext.buildPageModel(page);
  assert.equal(built.ok, true);
  assert.equal(built.model.visualAffordancePlan.legacy, false);
  assert.ok(built.model.visualAffordancePlan.slotGenerate["a2|materials-entry"]);
});

test("vNext placement: activity-after-header immediately after header", () => {
  const html = renderVnextHtml(loadFixture());
  assert.match(
    html,
    /<header class="util-activity-header"[^>]*>[\s\S]*?<\/header>\s*<div class="util-visual-affordance[^"]*util-visual-affordance--activity-after-header"/
  );
});

test("vNext placement: assessment hook before assessment list", () => {
  const html = renderVnextHtml(loadFixture());
  assert.match(
    html,
    /util-section-heading util-icon-heading[\s\S]*?Self assessment[\s\S]*?<\/h2>\s*<div class="util-visual-affordance[^"]*util-visual-affordance--assessment-before-checkpoint"/
  );
});

test("downstream discovery: vNext hooks match VEU selector contract", () => {
  const page = pageWithAffordances(loadFixture(), [records.inflation_a2_generate]);
  const html = renderVnextHtml(page);
  const hooks = discoverVisualAffordanceHooks(html);
  hooks.forEach(function (hook) {
    assert.match(hook.className, /util-visual-affordance/);
    assert.match(hook.className, new RegExp("util-visual-affordance--" + hook.slot));
    assert.ok(hook.slot, "hook must expose data-visual-slot");
    if (hook.affordanceId) {
      assert.ok(hook.activityId, "authoritative hooks require data-activity-id");
    }
  });
});

test("legacy renderer unchanged for climate fixture hook count", () => {
  const api = loadLegacyApi();
  const climatePath = path.join(
    repoRoot,
    "tests",
    "fixtures",
    "page-render",
    "ld-climate-misconception-discussion-page.json"
  );
  const page = JSON.parse(fs.readFileSync(climatePath, "utf8"));
  const legacy = api.buildUtilityStructuredHtmlForTest(page, undefined, { rendererVersion: "legacy" });
  assert.ok(legacy && !legacy.error);
  const legacyHooks = discoverVisualAffordanceHooks(String(legacy.html || ""));
  assert.ok(legacyHooks.length >= 2);
});

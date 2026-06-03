const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures", "page-render");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() { return false; },
      toggle() { return false; }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() { return null; },
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api };
}

function loadPageFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function renderPageFixture(api, fixtureName) {
  const parsed = loadPageFixture(fixtureName);
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
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

function firstCapture(html, re) {
  const m = String(html || "").match(re);
  return m ? m[1] : "";
}

function assertNoAffordanceInsideForbiddenRegions(html) {
  const headerInners = String(html || "").match(
    /<div class="util-activity-header"[^>]*>([\s\S]*?)<\/div>/gi
  );
  if (headerInners) {
    for (let i = 1; i < headerInners.length; i += 1) {
      assert.doesNotMatch(
        headerInners[i],
        /util-visual-affordance/,
        "visual affordance must not be a child of .util-activity-header"
      );
    }
  }
  const badgeInners = String(html || "").match(/<div class="util-badge-row"[^>]*>([\s\S]*?)<\/div>/gi);
  if (badgeInners) {
    for (let i = 1; i < badgeInners.length; i += 1) {
      assert.doesNotMatch(
        badgeInners[i],
        /util-visual-affordance/,
        "visual affordance must not be a child of .util-badge-row"
      );
    }
  }
  const iconHeadings = String(html || "").match(
    /<h[1-5][^>]*class="[^"]*util-icon-heading[^"]*"[^>]*>([\s\S]*?)<\/h[1-5]>/gi
  );
  if (iconHeadings) {
    for (let i = 1; i < iconHeadings.length; i += 1) {
      assert.doesNotMatch(
        iconHeadings[i],
        /util-visual-affordance/,
        "visual affordance must not be inside .util-icon-heading"
      );
    }
  }
  const sectionHeading = firstCapture(
    html,
    /<h2[^>]*class="[^"]*util-section-heading[^"]*"[^>]*>([\s\S]*?)<\/h2>/i
  );
  assert.doesNotMatch(
    sectionHeading,
    /util-visual-affordance/,
    "visual affordance must not be inside .util-section-heading"
  );
  const metaInner = firstCapture(html, /<details class="util-meta"[^>]*>([\s\S]*?)<\/details>/i);
  assert.doesNotMatch(
    metaInner,
    /util-visual-affordance/,
    "visual affordance must not be inside metadata fold"
  );
}

test("visual affordance: climate page — hooks outside headers and icon headings", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "ld-climate-misconception-discussion-page.json");
  assert.match(html, /util-visual-affordance/);
  assertNoAffordanceInsideForbiddenRegions(html);

  const activities = activityBlocks(html);
  assert.ok(activities.length >= 1);
  const first = activities[0];
  assert.match(
    first,
    /<div class="util-activity-header"[^>]*>[\s\S]*?<\/div>\s*<div class="util-visual-affordance[^"]*util-visual-affordance--activity-after-header/
  );
  assert.match(
    first,
    /<div class="util-card-grid">[\s\S]*?<\/div>\s*<div class="util-visual-affordance util-visual-affordance--materials-card-grid-after"/
  );
  assert.match(
    first,
    /util-visual-affordance--materials-card-grid-after[\s\S]*?<h4[^>]*class="[^"]*util-material-heading/
  );
});

test("visual affordance: CI multi-table — paired table hook between scroll wrappers", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "confidence-interval-a2-multitable-page.json");
  assertNoAffordanceInsideForbiddenRegions(html);

  const a2 = activityBlocks(html).find(function (block) {
    return /Confidence interval template/i.test(block);
  });
  assert.ok(a2, "expected A2 activity block");
  const materialsRegion = firstCapture(
    a2,
    /<div class="util-activity-materials">([\s\S]*?)<\/div>\s*<div class="util-output-block/
  );
  assert.match(
    materialsRegion,
    /util-table-scroll util-material-table[\s\S]*?util-visual-affordance--materials-table-pair-between[\s\S]*?util-table-scroll util-material-table/
  );
  assert.match(
    materialsRegion,
    /util-table-scroll util-material-table">[\s\S]*?<\/div>\s*<div class="util-visual-affordance util-visual-affordance--materials-table-pair-between"/
  );
  assert.equal(
    materialsRegion.match(/<\/h[45]>\s*<div class="util-visual-affordance/),
    null,
    "visual affordance must not immediately follow a materials heading"
  );
});

test("visual affordance: hook renderer stays block-level and hidden", () => {
  const { api } = loadPrismTestApi();
  const hook = api.utilityRenderVisualAffordanceHookForTest("activity-after-header", {
    subject: "Sample activity",
    activityId: "A1"
  });
  assert.match(hook, /^<div class="util-visual-affordance util-visual-affordance--activity-after-header"/);
  assert.match(hook, /data-visual-slot="activity-after-header"/);
  assert.match(hook, /data-visual-subject="Sample activity"/);
  assert.match(hook, /\shidden\b/);
  assert.match(hook, /aria-hidden="true"/);
  assert.doesNotMatch(hook, /<h[1-5]/);
});

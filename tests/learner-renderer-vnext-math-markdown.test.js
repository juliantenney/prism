"use strict";

/**
 * S78-T-034 — vNext math-delimiter protection regressions.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const { renderMarkdownBlock, renderMarkdownInline } = require(
  "../lib/learner-renderer-vnext/render-html-utils"
);

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

const MRS_BODY = [
  "The tangency condition requires equality of marginal rates of substitution:",
  "",
  "\\[",
  "\\frac{U_x}{U_y}",
  "\\]",
  "",
  "and",
  "",
  "\\[",
  "\\frac{p_x}{p_y}",
  "\\]"
].join("\n");

const FOC_BODY = [
  "First-order conditions:",
  "",
  "\\[",
  "U_x=\\lambda p_x",
  "\\]",
  "",
  "\\[",
  "U_y=\\lambda p_y",
  "\\]"
].join("\n");

function assertMathPreserved(html, label) {
  assert.doesNotMatch(
    html,
    /<em>/,
    `${label}: markdown emphasis must not appear inside protected maths`
  );
  assert.doesNotMatch(
    html,
    /U<em>|p<em>|x<em>/,
    `${label}: TeX subscripts must not be corrupted`
  );
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
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
  injectLearnerRendererVNextInSandbox(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "PRISM test API must be available");
  return { api };
}

function loadFixtureWithMathBody(body) {
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const material = fixture.activities[0].materials.find((row) => row.material_id === "A1-M1");
  assert.ok(material, "fixture must include A1-M1");
  material.body = body;
  return fixture;
}

test("vNext markdown: display MRS ratios preserve TeX delimiters and subscripts", () => {
  const html = renderMarkdownBlock(MRS_BODY);
  assertMathPreserved(html, "MRS body");
  assert.match(html, /\\\[[\s\S]*\\frac\{U_x\}\{U_y\}[\s\S]*\\\]/);
  assert.match(html, /\\\[[\s\S]*\\frac\{p_x\}\{p_y\}[\s\S]*\\\]/);
});

test("vNext markdown: display first-order conditions preserve lambda subscripts", () => {
  const html = renderMarkdownBlock(FOC_BODY);
  assertMathPreserved(html, "FOC body");
  assert.match(html, /U_x=\\lambda p_x/);
  assert.match(html, /U_y=\\lambda p_y/);
});

test("vNext markdown: inline maths with single-letter subscripts stay intact in one paragraph", () => {
  const html = renderMarkdownInline("Use \\(U_x\\) and \\(p_y\\) in the ratio.");
  assertMathPreserved(html, "inline subscripts");
  assert.match(html, /\\\(U_x\\\)/);
  assert.match(html, /\\\(p_y\\\)/);
});

test("vNext markdown: prose emphasis outside maths still transforms", () => {
  const html = renderMarkdownBlock(
    "This _emphasis_ should render while \\(U_x\\) stays intact."
  );
  assert.match(html, /<em>emphasis<\/em>/);
  assert.match(html, /\\\(U_x\\\)/);
  assert.doesNotMatch(html, /U<em>/);
});

test("vNext markdown: partial-derivative control notation remains correct", () => {
  const body = ["\\[", "\\frac{\\partial L}{\\partial m}=n-\\lambda=0", "\\]"].join("\n");
  const html = renderMarkdownBlock(body);
  assertMathPreserved(html, "partial control");
  assert.match(html, /\\frac\{\\partial L\}\{\\partial m\}/);
});

test("vNext markdown: multi-subscript display expression stays intact", () => {
  const html = renderMarkdownBlock("\\[\nx_i + y_j = z_k\n\\]");
  assertMathPreserved(html, "multi subscript");
  assert.match(html, /x_i \+ y_j = z_k/);
});

test("vNext live path: renderLearnerPageForTest preserves failing MRS notation", () => {
  const { api } = loadPrismTestApi();
  const fixture = loadFixtureWithMathBody(MRS_BODY);
  const result = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");
  assert.match(html, /data-renderer="vnext"/);
  assertMathPreserved(html, "live vNext export");
  assert.match(html, /\\frac\{U_x\}\{U_y\}/);
  assert.match(html, /\\frac\{p_x\}\{p_y\}/);
  assert.doesNotMatch(html, /U<em>x/);
});

test("vNext live path: renderLearnerPageForTest preserves inline maths in material prose", () => {
  const { api } = loadPrismTestApi();
  const body = [
    "Compare \\(U_x\\) with \\(p_y\\) when evaluating _economic intuition_.",
    "",
    "\\[",
    "U_x=\\lambda p_x",
    "\\]"
  ].join("\n");
  const fixture = loadFixtureWithMathBody(body);
  const result = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");
  assert.match(html, /<em>economic intuition<\/em>/);
  assert.match(html, /\\\(U_x\\\)/);
  assert.match(html, /\\\(p_y\\\)/);
  assert.match(html, /U_x=\\lambda p_x/);
  assert.doesNotMatch(html, /U<em>/);
});

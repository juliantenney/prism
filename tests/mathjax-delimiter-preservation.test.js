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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  assert.equal(typeof api.utilityNormalizeUtilitiesJsonInputForTest, "function");
  assert.equal(typeof api.buildUtilityStructuredHtmlForTest, "function");
  assert.equal(typeof api.utilityContainsSupportedMathDelimitersForTest, "function");
  assert.equal(typeof api.utilityTypesetPreviewMathIfNeededForTest, "function");
  assert.equal(typeof api.utilityBuildMathJaxExportBootstrapForTest, "function");
  assert.equal(typeof api.utilityEnhanceExportHtmlWithMathJaxForTest, "function");
  assert.equal(typeof api.utilityHasMathJaxExportBootstrapForTest, "function");
  assert.equal(typeof api.getUtilityMathJaxExportLoaderSrcForTest, "function");
  assert.equal(typeof api.applyUtilityPreviewHtmlForTest, "function");
  assert.equal(typeof api.getUtilitiesPreviewSrcdocForTest, "function");
  assert.equal(typeof api.setUtilitiesPreviewFrameContentDocumentForTest, "function");
  assert.equal(typeof api.setUtilitiesLastHtmlForTest, "function");
  assert.equal(typeof api.getUtilitiesLastHtmlForTest, "function");
  return { api, windowStub };
}

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

test("utilities normalization: keeps markdown-escaped JSON array wrappers parseable", () => {
  const { api } = loadPrismTestApi();
  const raw =
    '{"artifact_type":"page","title":"T","sections": \\[{"section_id":"a","heading":"H","content":"ok"}\\]}';
  const normalized = api.utilityNormalizeUtilitiesJsonInputForTest(raw);
  const parsed = JSON.parse(normalized);
  assert.equal(Array.isArray(parsed.sections), true);
  assert.equal(parsed.sections.length, 1);
  assert.equal(parsed.sections[0].section_id, "a");
});

test("utilities normalization: preserves escaped MathJax delimiters inside JSON strings", () => {
  const { api } = loadPrismTestApi();
  const raw =
    '{"artifact_type":"page","title":"Math","sections":[{"section_id":"m","heading":"H","content":"Inline \\\\(x^2\\\\) and block \\\\[x^2\\\\]"}]}';
  const normalized = api.utilityNormalizeUtilitiesJsonInputForTest(raw);
  const parsed = JSON.parse(normalized);
  const content = String(parsed.sections[0].content || "");
  assert.match(content, /\\\(x\^2\\\)/);
  assert.match(content, /\\\[x\^2\\\]/);
});

test("math delimiter fixture: delimiters survive structured HTML construction", () => {
  const { api } = loadPrismTestApi();
  const parsed = loadFixture("mathjax-delimiter-preservation-page.json");
  const rendered = api.buildUtilityStructuredHtmlForTest(parsed, ["sections"]);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");

  assert.match(html, /\\\(x\^2 \+ y\^2 = z\^2\\\)/);
  assert.match(html, /\\\[x\^2 \+ y\^2 = z\^2\\\]/);
  assert.match(html, /Mixed markdown and maths/);
  assert.match(html, /<ul>/);
  assert.match(html, /<li>Recall \\\(a\^2 - b\^2 = \(a-b\)\(a\+b\)\\\)<\/li>/);
});

test("math delimiter fixture: malformed delimiters remain readable raw text", () => {
  const { api } = loadPrismTestApi();
  const parsed = loadFixture("mathjax-delimiter-preservation-page.json");
  const rendered = api.buildUtilityStructuredHtmlForTest(parsed, ["sections"]);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");

  assert.match(html, /Malformed inline: \\\(x\^2 \+ y\^2 = z\^2/);
  assert.match(html, /Malformed block: \\\[x\^2 \+ y\^2/);
});

test("math delimiter fixture: delimiters in code spans and code fences are preserved as literals", () => {
  const { api } = loadPrismTestApi();
  const parsed = loadFixture("mathjax-delimiter-preservation-page.json");
  const rendered = api.buildUtilityStructuredHtmlForTest(parsed, ["sections"]);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");

  assert.match(html, /<code>\\\(x\+y\\\)<\/code>/);
  assert.match(html, /\\\[\s*x\^2 \+ y\^2\\\]/);
});

test("non-math markdown behavior remains unchanged in math baseline fixture", () => {
  const { api } = loadPrismTestApi();
  const parsed = loadFixture("mathjax-delimiter-preservation-page.json");
  const rendered = api.buildUtilityStructuredHtmlForTest(parsed, ["sections"]);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");

  assert.match(html, /<li>First bullet<\/li>/);
  assert.match(html, /<li>Second bullet<\/li>/);
  assert.match(html, /Final control line\./);
});

test("preview/export source: rendered HTML stays identical for preview srcdoc and export source", () => {
  const { api } = loadPrismTestApi();
  const parsed = loadFixture("mathjax-delimiter-preservation-page.json");
  const rendered = api.buildUtilityStructuredHtmlForTest(parsed, ["sections"]);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");

  api.applyUtilityPreviewHtmlForTest(html);
  assert.equal(api.getUtilitiesPreviewSrcdocForTest(), html);

  api.setUtilitiesLastHtmlForTest(html);
  assert.equal(api.getUtilitiesLastHtmlForTest(), html);
});

test("math delimiter detector: true for supported delimiters", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.utilityContainsSupportedMathDelimitersForTest("Inline \\(x+y\\)"), true);
  assert.equal(api.utilityContainsSupportedMathDelimitersForTest("Block \\[x+y\\]"), true);
});

test("math delimiter detector: false for no math and dollar delimiters", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.utilityContainsSupportedMathDelimitersForTest("No maths here."), false);
  assert.equal(api.utilityContainsSupportedMathDelimitersForTest("Dollar $x+y$"), false);
  assert.equal(api.utilityContainsSupportedMathDelimitersForTest("Double $$x+y$$"), false);
});

test("preview hook: no supported delimiters means no MathJax call", async () => {
  const { api, windowStub } = loadPrismTestApi();
  const previewDoc = { body: { nodeName: "BODY" }, documentElement: { nodeName: "HTML" } };
  api.setUtilitiesPreviewFrameContentDocumentForTest(previewDoc);
  var calls = 0;
  windowStub.MathJax = {
    typesetPromise() {
      calls += 1;
      return Promise.resolve();
    }
  };
  api.applyUtilityPreviewHtmlForTest("<p>plain text only</p>");
  await new Promise((resolve) => setTimeout(resolve, 90));
  assert.equal(calls, 0);
});

test("preview hook: MathJax unavailable exits safely", async () => {
  const { api, windowStub } = loadPrismTestApi();
  const previewDoc = { body: { nodeName: "BODY" }, documentElement: { nodeName: "HTML" } };
  api.setUtilitiesPreviewFrameContentDocumentForTest(previewDoc);
  windowStub.MathJax = null;
  assert.doesNotThrow(() => {
    api.applyUtilityPreviewHtmlForTest("<p>Inline \\(x+y\\)</p>");
  });
  await new Promise((resolve) => setTimeout(resolve, 90));
  assert.match(api.getUtilitiesPreviewSrcdocForTest(), /\\\(x\+y\\\)/);
});

test("preview hook: supported delimiters call scoped MathJax typeset", async () => {
  const { api, windowStub } = loadPrismTestApi();
  const scopeNode = { nodeName: "BODY" };
  const previewDoc = { body: scopeNode, documentElement: { nodeName: "HTML" } };
  api.setUtilitiesPreviewFrameContentDocumentForTest(previewDoc);
  var clearCalls = 0;
  var typesetCalls = 0;
  var lastArgs = null;
  windowStub.MathJax = {
    typesetClear(nodes) {
      clearCalls += 1;
      lastArgs = nodes;
    },
    typesetPromise(nodes) {
      typesetCalls += 1;
      lastArgs = nodes;
      return Promise.resolve();
    }
  };
  api.applyUtilityPreviewHtmlForTest("<p>Inline \\(x+y\\)</p>");
  await new Promise((resolve) => setTimeout(resolve, 90));
  assert.equal(clearCalls >= 1, true);
  assert.equal(typesetCalls >= 1, true);
  assert.ok(Array.isArray(lastArgs));
  assert.equal(lastArgs[0], scopeNode);
});

test("preview hook: typeset rejection does not throw or corrupt preview HTML", async () => {
  const { api, windowStub } = loadPrismTestApi();
  const previewDoc = { body: { nodeName: "BODY" }, documentElement: { nodeName: "HTML" } };
  api.setUtilitiesPreviewFrameContentDocumentForTest(previewDoc);
  windowStub.MathJax = {
    typesetPromise() {
      return Promise.reject(new Error("typeset failed"));
    }
  };
  const html = "<p>Block \\[x+y\\]</p>";
  assert.doesNotThrow(() => {
    api.applyUtilityPreviewHtmlForTest(html);
  });
  await new Promise((resolve) => setTimeout(resolve, 90));
  assert.equal(api.getUtilitiesPreviewSrcdocForTest(), html);
});

test("preview hook: repeated rerenders preserve latest non-math HTML", async () => {
  const { api, windowStub } = loadPrismTestApi();
  const previewDoc = { body: { nodeName: "BODY" }, documentElement: { nodeName: "HTML" } };
  api.setUtilitiesPreviewFrameContentDocumentForTest(previewDoc);
  var typesetCalls = 0;
  windowStub.MathJax = {
    typesetPromise() {
      typesetCalls += 1;
      return Promise.resolve();
    }
  };
  api.applyUtilityPreviewHtmlForTest("<p>Inline \\(x+y\\)</p>");
  api.applyUtilityPreviewHtmlForTest("<p>Latest plain text render.</p>");
  await new Promise((resolve) => setTimeout(resolve, 90));
  assert.equal(api.getUtilitiesPreviewSrcdocForTest(), "<p>Latest plain text render.</p>");
  assert.equal(typesetCalls >= 0, true);
});

test("export enhancement: includes MathJax bootstrap for supported delimiters", () => {
  const { api } = loadPrismTestApi();
  const html = "<!doctype html><html><head><title>T</title></head><body><p>Inline \\(x+y\\)</p></body></html>";
  const enhanced = api.utilityEnhanceExportHtmlWithMathJaxForTest(html);
  assert.match(enhanced, /prism-mathjax-export-bootstrap/);
  assert.match(enhanced, /prism-mathjax-export-loader/);
  assert.match(enhanced, /tex-chtml\.js/);
  assert.match(enhanced, /\\\(x\+y\\\)/);
});

test("export enhancement: no delimiters keeps HTML unchanged", () => {
  const { api } = loadPrismTestApi();
  const html = "<!doctype html><html><head><title>T</title></head><body><p>No math here.</p></body></html>";
  const enhanced = api.utilityEnhanceExportHtmlWithMathJaxForTest(html);
  assert.equal(enhanced, html);
  assert.doesNotMatch(enhanced, /prism-mathjax-export-bootstrap/);
});

test("export enhancement: config contains only supported delimiters and no dollar rules", () => {
  const { api } = loadPrismTestApi();
  const bootstrap = api.utilityBuildMathJaxExportBootstrapForTest();
  assert.match(bootstrap, /inlineMath:\s*\[\['\\\\\(','\\\\\)'\]\]/);
  assert.match(bootstrap, /displayMath:\s*\[\['\\\\\[','\\\\\]'\]\]/);
  assert.doesNotMatch(bootstrap, /\$\$/);
  assert.doesNotMatch(bootstrap, /inlineMath:\s*\[\['\$','\$'\]\]/);
});

test("export enhancement: repeated wrapping does not duplicate bootstrap", () => {
  const { api } = loadPrismTestApi();
  const html = "<!doctype html><html><head></head><body><p>Block \\[x+y\\]</p></body></html>";
  const once = api.utilityEnhanceExportHtmlWithMathJaxForTest(html);
  const twice = api.utilityEnhanceExportHtmlWithMathJaxForTest(once);
  assert.equal((twice.match(/prism-mathjax-export-bootstrap/g) || []).length, 1);
  assert.equal((twice.match(/prism-mathjax-export-loader/g) || []).length, 1);
  assert.equal(api.utilityHasMathJaxExportBootstrapForTest(twice), true);
});

test("export enhancement: non-math export behavior remains stable", () => {
  const { api } = loadPrismTestApi();
  const html = "<html><body><h1>Report</h1><p>Plain text.</p></body></html>";
  const enhanced = api.utilityEnhanceExportHtmlWithMathJaxForTest(html);
  assert.equal(enhanced, html);
});

test("markdown block parser: block math with minus signs is not turned into list items", () => {
  const { api } = loadPrismTestApi();
  const md = "\\[ x^2 - 4x - 5 = 0 \\]";
  const html = String(api.utilityRenderMarkdownBlockForTest(md) || "");
  assert.match(html, /\\\[ x\^2 - 4x - 5 = 0 \\\]/);
  assert.doesNotMatch(html, /<li>\s*4x\s*<\/li>/i);
  assert.doesNotMatch(html, /<li>\s*5 = 0\s*<\/li>/i);
});

test("markdown block parser: multiline block math with minus signs remains intact", () => {
  const { api } = loadPrismTestApi();
  const md = ["\\[", "x^2 - 4x - 5 = 0", "\\]"].join("\n");
  const html = String(api.utilityRenderMarkdownBlockForTest(md) || "");
  assert.match(html, /\\\[[\s\S]*x\^2 - 4x - 5 = 0[\s\S]*\\\]/);
  assert.doesNotMatch(html, /<li>\s*4x\s*<\/li>/i);
  assert.doesNotMatch(html, /<li>\s*5 = 0\s*<\/li>/i);
});

test("markdown block parser: quadratic formula block remains preserved", () => {
  const { api } = loadPrismTestApi();
  const md = "\\[ x = \\\\frac{-b \\pm \\\\sqrt{b^2 - 4ac}}{2a} \\]";
  const html = String(api.utilityRenderMarkdownBlockForTest(md) || "");
  assert.match(html, /\\\[ x = \\\\frac\{-b \\pm \\\\sqrt\{b\^2 - 4ac\}\}\{2a\} \\\]/);
});

test("markdown block parser: normal bullet lists still work outside math blocks", () => {
  const { api } = loadPrismTestApi();
  const md = "- One\n- Two\n- Three";
  const html = String(api.utilityRenderMarkdownBlockForTest(md) || "");
  assert.equal((html.match(/<li>/g) || []).length, 3);
  assert.match(html, /<li>One<\/li>/);
  assert.match(html, /<li>Two<\/li>/);
  assert.match(html, /<li>Three<\/li>/);
});

test("export html: multiline math block does not emit broken list fragments from minus terms", () => {
  const { api } = loadPrismTestApi();
  const parsed = {
    artifact_type: "page",
    title: "Math export check",
    page_profile: "learner",
    sections: [
      {
        section_id: "math_check",
        heading: "Math",
        content: ["\\[", "x^2 - 4x - 5 = 0", "\\]"].join("\n")
      }
    ]
  };
  const rendered = api.buildUtilityStructuredHtmlForTest(parsed, ["sections"]);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");
  assert.doesNotMatch(html, /<ul>[\s\S]*<li>\s*4x\s*<\/li>/i);
});

test("activity materials regression fixture: M1/M2 strings preserve block math and avoid broken list fragments", () => {
  const { api } = loadPrismTestApi();
  const parsed = loadFixture("mathjax-materials-regression-page.json");
  const rendered = api.buildUtilityStructuredHtmlForTest(parsed, ["sections"]);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");
  assert.match(html, /\\\[[\s\S]*x\^2 - 4x - 5 = 0[\s\S]*\\\]/);
  assert.doesNotMatch(html, /<p>\s*\\\[\s*x\^2\s*<\/p>\s*<ul>/i);
  assert.doesNotMatch(html, /<li>\s*4x\s*<\/li>/i);
  assert.doesNotMatch(html, /<li>\s*5\s*=\s*0\s*\\\]\s*<\/li>/i);
});

test("activity materials regression: markdown heading and inline math underscores are preserved", () => {
  const { api } = loadPrismTestApi();
  const parsed = {
    artifact_type: "page",
    title: "Math heading/inline regression",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Solutions block",
            learner_task: "Complete the solutions.",
            materials: {
              M1_text: ["#### 5. Solutions", "\\(x_1 =\\) _________", "\\(x_2 =\\) _________"].join("\n")
            }
          }
        ]
      }
    ]
  };
  const rendered = api.buildUtilityStructuredHtmlForTest(parsed, ["sections"]);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");
  assert.doesNotMatch(html, /<p>####/i);
  assert.doesNotMatch(html, /<em>1/i);
  assert.doesNotMatch(html, /x<em>/i);
  assert.doesNotMatch(html, /x<\/em>2/i);
  assert.match(html, /\\\(x_1 =\\\)/);
  assert.match(html, /\\\(x_2 =\\\)/);
});

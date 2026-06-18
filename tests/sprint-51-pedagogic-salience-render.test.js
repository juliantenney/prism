/**
 * Sprint 51 — pedagogic salience renderer (callouts + checklist split).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const salienceLib = require("../lib/ld-pedagogic-salience-render.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
      toggle: () => false
    },
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();

function renderPage(parsed) {
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

function activityArticleScope(html, titleFragment) {
  const escaped = titleFragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const fragmentRe = new RegExp(escaped, "i");
  const articles = html.match(/<article class="util-task-block[^"]*">[\s\S]*?<\/article>/gi) || [];
  return articles.find((article) => fragmentRe.test(article)) || "";
}

function minimalSaliencePage() {
  return {
    artifact_type: "page",
    title: "Salience test page",
    audience: "Test",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "S51",
            title: "Pedagogic salience fixture",
            learner_task: "Study the model and check your work.",
            expected_output: "A short written response.",
            materials: {
              worked_example:
                "**Step 1:** Name the mechanism.\n\n## What experts notice\n- Strong analysis names the transmission mechanism explicitly.\n- Weak analysis lists labels only.\n\n**Bridge:** Apply the same sequence to your case.",
              sample_output:
                "> A model paragraph with causal links.\n\n## Why this works\n- Links concepts through a causal mechanism.\n- Uses evidence before judgement.",
              checklist:
                "Have you linked each price pressure to a mechanism?\n- Have you named at least one transmission channel?\n- Does your answer cite one scenario detail?\n\n## Common mistakes\n- Label-only classification with no mechanism.\n- Plot summary instead of analytical contrast.\n\n### If any check is not met:\nRevise your report by adding a mechanism sentence and one cited detail."
            }
          }
        ]
      }
    ]
  };
}

test("51-salience lib: splitChecklistPedagogicSections isolates verification from coaching", () => {
  const split = salienceLib.splitChecklistPedagogicSections(minimalSaliencePage().sections[0].content[0].materials.checklist);
  assert.equal(split.hasPedagogicSections, true);
  assert.match(split.verification, /Have you linked each price pressure/i);
  assert.doesNotMatch(split.verification, /Common mistakes/i);
  assert.match(split.diagnostic, /## Common mistakes/i);
  assert.match(split.diagnostic, /Label-only classification/i);
  assert.match(split.revision, /### If any check is not met/i);
  assert.match(split.revision, /Revise your report/i);
});

test("51-salience lib: wrapPedagogicSalienceSectionsInHtml wraps recognised headings", () => {
  const input =
    '<p><strong>Step 1:</strong> Name the mechanism.</p>' +
    '<h4 class="util-card-subheading">What experts notice</h4><ul><li>Expert point one.</li></ul>' +
    '<h4 class="util-card-subheading">Why this works</h4><ul><li>Quality point one.</li></ul>' +
    '<h4 class="util-card-subheading">Common mistakes</h4><ul><li>Mistake one.</li></ul>' +
    '<h5 class="util-card-subheading">If any check is not met</h5><p>Revise by adding detail.</p>';

  const out = salienceLib.wrapPedagogicSalienceSectionsInHtml(input);
  assert.match(out, /util-pedagogic-callout--expert-insight/);
  assert.match(out, /util-pedagogic-callout--quality-commentary/);
  assert.match(out, /util-pedagogic-callout--diagnostic/);
  assert.match(out, /util-pedagogic-callout--revision/);
  assert.match(out, /How experts think/);
  assert.match(out, /Why the model is strong/);
  assert.match(out, /Weaknesses to avoid/);
  assert.match(out, /How to improve/);
  assert.doesNotMatch(out, /<h4 class="util-card-subheading">What experts notice<\/h4>/);
  assert.match(out, /<ul class="util-diagnostic-list">|<aside class="util-pedagogic-callout util-pedagogic-callout--diagnostic[\s\S]*?<ul/);
});

test("51-salience: What experts notice renders as expert-insight callout", () => {
  const html = renderPage(minimalSaliencePage());
  const scope = activityArticleScope(html, "Pedagogic salience fixture");
  assert.match(scope, /util-pedagogic-callout--expert-insight/);
  assert.match(scope, /data-pedagogic-salience="expert-insight"/);
  assert.match(scope, /How experts think/);
  assert.match(scope, /Strong analysis names the transmission mechanism/i);
});

test("51-salience: Why this works renders as quality-commentary callout", () => {
  const html = renderPage(minimalSaliencePage());
  const scope = activityArticleScope(html, "Pedagogic salience fixture");
  assert.match(scope, /util-pedagogic-callout--quality-commentary/);
  assert.match(scope, /Why the model is strong/);
  assert.match(scope, /Links concepts through a causal mechanism/i);
});

test("51-salience: Common mistakes renders as diagnostic callout without checkboxes", () => {
  const html = renderPage(minimalSaliencePage());
  const scope = activityArticleScope(html, "Pedagogic salience fixture");
  const checkSection = scope.slice(scope.indexOf("Check your work"));
  assert.match(checkSection, /util-pedagogic-callout--diagnostic/);
  assert.match(checkSection, /Weaknesses to avoid/);
  assert.match(checkSection, /Label-only classification with no mechanism/i);
  const diagnosticAside = checkSection.match(
    /<aside class="util-pedagogic-callout util-pedagogic-callout--diagnostic[\s\S]*?<\/aside>/i
  );
  assert.ok(diagnosticAside, "expected diagnostic aside");
  assert.match(diagnosticAside[0], /<ul[^>]*><li>/);
  assert.doesNotMatch(diagnosticAside[0], /util-checkbox-list/);
  assert.doesNotMatch(diagnosticAside[0], /util-checkbox/);
});

test("51-salience: If any check is not met renders as revision callout", () => {
  const html = renderPage(minimalSaliencePage());
  const scope = activityArticleScope(html, "Pedagogic salience fixture");
  const checkSection = scope.slice(scope.indexOf("Check your work"));
  assert.match(checkSection, /util-pedagogic-callout--revision/);
  assert.match(checkSection, /How to improve/);
  assert.match(checkSection, /Revise your report by adding a mechanism sentence/i);
  const revisionAside = checkSection.match(
    /<aside class="util-pedagogic-callout util-pedagogic-callout--revision[\s\S]*?<\/aside>/i
  );
  assert.ok(revisionAside, "expected revision aside");
  assert.doesNotMatch(revisionAside[0], /util-checkbox-list/);
});

test("51-salience: verification checklist items still render as checkboxes", () => {
  const html = renderPage(minimalSaliencePage());
  const scope = activityArticleScope(html, "Pedagogic salience fixture");
  const checkSection = scope.slice(scope.indexOf("Check your work"));
  assert.match(checkSection, /util-checkbox-list/);
  assert.match(checkSection, /Have you named at least one transmission channel/i);
});

test("51-salience: Sprint 50 instructional grammar order unchanged", () => {
  const html = renderPage(minimalSaliencePage());
  const scope = activityArticleScope(html, "Pedagogic salience fixture");
  const studyIdx = scope.indexOf("Read and model");
  const doIdx = scope.indexOf("What to do");
  const checkIdx = scope.indexOf("Check your work");
  assert.notEqual(studyIdx, -1);
  assert.notEqual(doIdx, -1);
  assert.notEqual(checkIdx, -1);
  assert.ok(studyIdx < doIdx, "Study before Do");
  assert.ok(doIdx < checkIdx, "Do before Check");
  assert.match(scope, /util-instructional-study/);
  assert.match(scope, /util-instructional-check/);
});

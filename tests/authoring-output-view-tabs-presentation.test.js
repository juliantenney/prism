/**
 * Authoring output-view tabs reuse main toolbar segmented pill chrome;
 * Open / HTML / ZIP remain distinct action buttons.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
const styleCss = fs.readFileSync(path.join(repoRoot, "style.css"), "utf8");
const appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");

function previewToolbarHtml() {
  const start = indexHtml.indexOf('class="utilities-preview-toolbar"');
  const end = indexHtml.indexOf('id="utilitiesOutputWorkspace"', start);
  assert.ok(start > 0 && end > start, "preview toolbar markup");
  return indexHtml.slice(start, end);
}

function loadPrismTestApi() {
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(appJs, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

test("Authoring nav tabs reuse app-tabs / tab segmented pill classes", () => {
  const toolbar = previewToolbarHtml();
  assert.match(
    toolbar,
    /id="utilitiesOutputViewBar"[^>]*class="[^"]*\bapp-tabs\b[^"]*\butilities-output-view-bar\b[^"]*"|id="utilitiesOutputViewBar"[^>]*class="[^"]*\butilities-output-view-bar\b[^"]*\bapp-tabs\b[^"]*"/
  );
  assert.match(toolbar, /id="utilitiesOutputViewLearnerBtn"[^>]*class="[^"]*\btab\b[^"]*\bactive\b/);
  assert.match(toolbar, /id="utilitiesOutputViewVisualJobsBtn"[^>]*class="[^"]*\btab\b/);
  assert.match(toolbar, /id="utilitiesOutputViewVideoBtn"[^>]*class="[^"]*\btab\b/);
  assert.match(toolbar, /id="utilitiesOutputViewResourcesBtn"[^>]*class="[^"]*\btab\b/);
  assert.match(toolbar, />\s*Learner Page\s*</);
  assert.match(toolbar, />\s*Graphics \(0\)\s*</);
  assert.match(toolbar, />\s*Video \(0\)\s*</);
  assert.match(toolbar, />\s*Resources \(0\)\s*</);
  assert.doesNotMatch(toolbar, /utilitiesOutputViewLearnerBtn[^>]*utilities-output-view-btn/);
});

test("Open HTML ZIP remain distinct action buttons outside the tab strip", () => {
  const toolbar = previewToolbarHtml();
  const actionsStart = toolbar.indexOf('class="utilities-preview-actions"');
  assert.ok(actionsStart > 0);
  const actions = toolbar.slice(actionsStart);
  assert.match(actions, /id="utilitiesOpenTabBtn"[^>]*class="[^"]*\bbtn\b[^"]*\bsmall\b/);
  assert.match(actions, /id="utilitiesDownloadHtmlBtn"[^>]*class="[^"]*\bbtn\b[^"]*\bsmall\b/);
  assert.match(actions, /id="utilitiesDownloadPackageBtn"[^>]*class="[^"]*\bbtn\b[^"]*\bsmall\b/);
  assert.doesNotMatch(actions, /role="tab"/);
  assert.doesNotMatch(actions, /\butilities-output-view-btn\b/);
});

test("selected-state class matches main toolbar active convention", () => {
  assert.match(appJs, /utilitiesOutputViewLearnerBtn\.classList\.toggle\("active"/);
  assert.match(appJs, /utilitiesOutputViewVisualJobsBtn\.classList\.toggle\("active"/);
  assert.match(appJs, /utilitiesOutputViewVideoBtn\.classList\.toggle\("active"/);
  assert.match(appJs, /utilitiesOutputViewResourcesBtn\.classList\.toggle\("active"/);
  assert.doesNotMatch(
    appJs,
    /utilitiesOutputViewLearnerBtn\.classList\.toggle\("is-active"/
  );
});

test("CSS keeps Authoring tab strip on shared pill chrome and actions responsive", () => {
  assert.match(styleCss, /\.app-tabs\s*\{[^}]*border-radius:\s*999px/s);
  assert.match(styleCss, /\.tab\.active\s*\{[^}]*background:\s*#ffffff/s);
  assert.match(styleCss, /\.tab:focus-visible\s*\{[^}]*outline:\s*2px solid/s);
  assert.match(styleCss, /\.btn:focus-visible\s*\{[^}]*outline:\s*2px solid/s);
  assert.match(
    styleCss,
    /\.utilities-output-view-bar\.app-tabs\s*\{[^}]*flex-wrap:\s*wrap;[^}]*max-width:\s*100%/s
  );
  assert.match(styleCss, /\.utilities-output-view-bar\.hidden\s*\{[^}]*display:\s*none/s);
  assert.match(
    styleCss,
    /@media\s*\(max-width:\s*720px\)\s*\{[^}]*\.utilities-preview-actions\s*\{[^}]*margin-left:\s*0/s
  );
  assert.doesNotMatch(styleCss, /\.utilities-output-view-btn\s*\{/);
});

test("tab switching still updates aria-selected and active class", () => {
  const api = loadPrismTestApi();
  assert.equal(typeof api.setUtilitiesOutputViewForTest, "function");
  api.setUtilitiesOutputViewForTest("visual_jobs");
  assert.equal(api.getUtilitiesOutputViewForTest(), "visual_jobs");
  api.setUtilitiesOutputViewForTest("learner_page");
  assert.equal(api.getUtilitiesOutputViewForTest(), "learner_page");
  api.setUtilitiesOutputViewForTest("video");
  assert.equal(api.getUtilitiesOutputViewForTest(), "video");
  api.setUtilitiesOutputViewForTest("resources");
  assert.equal(api.getUtilitiesOutputViewForTest(), "resources");
});

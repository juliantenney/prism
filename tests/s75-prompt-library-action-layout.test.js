"use strict";

/**
 * Sprint 75 — Prompt Library action layout and consistency.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");

function libraryHeaderHtml() {
  const start = indexHtml.indexOf('class="library-header"');
  const end = indexHtml.indexOf('class="library-filters"');
  assert.ok(start >= 0 && end > start);
  return indexHtml.slice(start, end);
}

function libraryDetailHtml() {
  const start = indexHtml.indexOf('class="library-detail"');
  const end = indexHtml.indexOf("</aside>", start);
  assert.ok(start >= 0 && end > start);
  return indexHtml.slice(start, end);
}

function indexInHeader(id) {
  return libraryHeaderHtml().indexOf(`id="${id}"`);
}

test("top action row contains core library controls", () => {
  const header = libraryHeaderHtml();
  [
    "newPromptBtn",
    "duplicatePromptBtn",
    "renamePromptBtn",
    "copyPromptBodyBtn",
    "usePromptBtn",
    "importFileInput",
    "exportPromptBtn",
    "exportAllBtn",
    "savePromptChangesBtn",
    "deletePromptBtn"
  ].forEach((id) => {
    assert.match(header, new RegExp(`id="${id}"`));
  });
});

test("controls occur in intended group order", () => {
  const order = [
    "newPromptBtn",
    "duplicatePromptBtn",
    "renamePromptBtn",
    "copyPromptBodyBtn",
    "usePromptBtn",
    "importFileInput",
    "exportPromptBtn",
    "exportAllBtn",
    "savePromptChangesBtn",
    "deletePromptBtn"
  ];
  let prev = -1;
  order.forEach((id) => {
    const idx = indexInHeader(id);
    assert.ok(idx >= 0, `${id} should be in header`);
    assert.ok(idx > prev, `${id} should follow prior controls`);
    prev = idx;
  });
  assert.match(libraryHeaderHtml(), /library-actions-group/);
});

test("Copy prompt label is used and Copy Prompt Body is removed", () => {
  assert.match(libraryHeaderHtml(), /Copy prompt/);
  assert.doesNotMatch(indexHtml, /Copy Prompt Body/);
});

test("Save label is used and Save changes is removed", () => {
  assert.match(libraryHeaderHtml(), /id="savePromptChangesBtn"[^>]*>[\s\S]*?Save/);
  assert.doesNotMatch(indexHtml, /Save changes/);
});

test("Delete remains destructive in header", () => {
  assert.match(libraryHeaderHtml(), /id="deletePromptBtn"[^>]*class="[^"]*danger/);
});

test("Copy prompt is primary; Use as template is secondary", () => {
  const header = libraryHeaderHtml();
  assert.match(header, /id="copyPromptBodyBtn"[^>]*class="[^"]*primary/);
  const useBtn = header.match(/id="usePromptBtn"[^>]*>/);
  assert.ok(useBtn);
  assert.doesNotMatch(useBtn[0], /primary/);
});

test("detail pane no longer contains duplicate action row", () => {
  const detail = libraryDetailHtml();
  assert.doesNotMatch(detail, /detail-buttons/);
  assert.doesNotMatch(detail, /savePromptChangesBtn/);
  assert.doesNotMatch(detail, /usePromptBtn/);
  assert.doesNotMatch(detail, /copyPromptBodyBtn/);
  assert.match(detail, /id="detailBody"/);
  assert.match(detail, /id="versionsList"/);
});

test("Copy prompt retains clipboard handler and copies detail body only", () => {
  assert.match(appSource, /function handleCopyPromptBody/);
  assert.match(appSource, /els\.copyPromptBodyBtn\.addEventListener\("click", handleCopyPromptBody\)/);
  const fn = appSource.slice(
    appSource.indexOf("function handleCopyPromptBody"),
    appSource.indexOf("function handleSaveDesignedWorkflow")
  );
  assert.match(fn, /els\.detailBody\.value/);
  assert.match(fn, /window\.Utils[\s\S]*copyText/);
  assert.match(fn, /fillTemplateVariables/);
  assert.match(fn, /Prompt body copied to clipboard/);
  assert.doesNotMatch(fn, /Library\.savePrompt/);
});

test("Use as template retains existing handler behaviour", () => {
  assert.match(appSource, /function handleUsePrompt/);
  assert.match(appSource, /els\.usePromptBtn\.addEventListener\("click", handleUsePrompt\)/);
  const fn = appSource.slice(
    appSource.indexOf("function handleUsePrompt"),
    appSource.indexOf("function handleExportAll")
  );
  assert.match(fn, /hydratePromptStudioFromPromptAsset/);
  assert.match(fn, /switchTab\("promptFactory"\)/);
  assert.match(fn, /updatePrompt/);
});

test("Save retains selected-prompt update path and version rendering", () => {
  assert.match(appSource, /function handleSavePromptChanges/);
  assert.match(appSource, /els\.savePromptChangesBtn\.addEventListener\("click", handleSavePromptChanges\)/);
  const fn = appSource.slice(
    appSource.indexOf("function handleSavePromptChanges"),
    appSource.indexOf("function handleNewPrompt")
  );
  assert.match(fn, /if \(state\.selectedPromptId\)/);
  assert.match(fn, /Library\.updatePrompt\(data\)/);
  assert.match(fn, /Library\.savePrompt\(data\)/);
  assert.match(fn, /populateDetailForm\(saved\)/);
  const populateFn = appSource.slice(
    appSource.indexOf("function populateDetailForm"),
    appSource.indexOf("function renderVersions")
  );
  assert.match(populateFn, /renderVersions\(promptAsset\)/);
});

test("selected-prompt actions disable when detail form is cleared", () => {
  const fn = appSource.slice(
    appSource.indexOf("function clearDetailForm"),
    appSource.indexOf("function populateDetailForm")
  );
  assert.match(fn, /duplicatePromptBtn\.disabled = true/);
  assert.match(fn, /renamePromptBtn\.disabled = true/);
  assert.match(fn, /deletePromptBtn\.disabled = true/);
  assert.match(fn, /usePromptBtn\.disabled = true/);
  assert.match(fn, /exportPromptBtn\.disabled = true/);
  assert.match(fn, /copyPromptBodyBtn\.disabled = true/);
});

test("import/export handlers remain wired", () => {
  assert.match(appSource, /function handleImportChange/);
  assert.match(appSource, /function handleExportPrompt/);
  assert.match(appSource, /function exportAllData/);
  assert.match(appSource, /importPromptsFromEntries/);
});

test("keyboard save shortcut still targets handleSavePromptChanges on library panel", () => {
  assert.match(appSource, /handleSavePromptChanges\(\)/);
  assert.match(
    appSource,
    /els\.libraryPanel && !els\.libraryPanel\.classList\.contains\("hidden"\)[\s\S]*handleSavePromptChanges\(\)/
  );
});

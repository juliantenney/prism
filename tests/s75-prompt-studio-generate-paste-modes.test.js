"use strict";

/**
 * Sprint 75 — Prompt Studio Generate | Paste mode split.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const libraryJsPath = path.join(repoRoot, "library.js");
const appSource = fs.readFileSync(appJsPath, "utf8");
const librarySource = fs.readFileSync(libraryJsPath, "utf8");
const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

function createClassList(initial) {
  const classes = new Set(initial || []);
  return {
    add(name) {
      classes.add(name);
    },
    remove(name) {
      classes.delete(name);
    },
    contains(name) {
      return classes.has(name);
    },
    toggle(name, force) {
      if (arguments.length > 1) {
        if (force) classes.add(name);
        else classes.delete(name);
        return !!force;
      }
      if (classes.has(name)) {
        classes.delete(name);
        return false;
      }
      classes.add(name);
      return true;
    }
  };
}

function createElementStub(id, options) {
  const opts = options || {};
  const initial = Array.isArray(opts.classes) ? opts.classes.slice() : [];
  const el = {
    id,
    value: opts.value || "",
    textContent: opts.textContent || "",
    className: initial.join(" "),
    classList: createClassList(initial),
    disabled: !!opts.disabled,
    open: !!opts.open,
    setAttribute(name, value) {
      this["_" + name] = value;
    },
    removeAttribute(name) {
      delete this["_" + name];
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this, "_" + name) ? this["_" + name] : null;
    },
    hasAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this, "_" + name);
    },
    addEventListener() {},
    focus() {},
    scrollIntoView() {},
    closest() {
      return null;
    },
    appendChild(child) {
      if (!this.children) this.children = [];
      this.children.push(child);
      return child;
    }
  };
  return el;
}

function bootLibrary() {
  const store = Object.create(null);
  const localStorage = {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    }
  };
  const sandbox = { window: {}, localStorage, indexedDB: undefined };
  sandbox.window = sandbox;
  sandbox.window.Utils = { uuid: () => "uuid-" + Math.random().toString(36).slice(2) };
  vm.runInContext(librarySource, vm.createContext(sandbox), { filename: "library.js" });
  return { Library: sandbox.window.Library, store };
}

function boot(opts) {
  opts = opts && typeof opts === "object" ? opts : {};
  const elementStore = new Map();
  const ids = [
    "outputType",
    "outputTypeGroup",
    "promptAudienceGroup",
    "promptRoleGroup",
    "promptGoalGroup",
    "promptContextGroup",
    "promptToneGroup",
    "promptFormatGroup",
    "promptLengthGroup",
    "promptConstraintsGroup",
    "textReadingLevelGroup",
    "typeFieldsText",
    "typeFieldsCode",
    "typeFieldsImage",
    "typeFieldsStructured",
    "promptStudioAdvancedOptions",
    "defineBriefIntro",
    "defineBriefHeading",
    "promptAudience",
    "promptGoal",
    "initialPrompt",
    "finalPrompt",
    "finalSummary",
    "saveToLibraryBtn",
    "pfBriefAuthoringActions",
    "pfBriefStartRefinementRow",
    "pfCardEditablePrompt",
    "pfCardRefinement",
    "pfGenerateModePanel",
    "pfPasteModePanel",
    "promptStudioStandaloneChrome",
    "promptStudioIntro",
    "promptStudioModeControl",
    "promptStudioModePasteBtn",
    "promptStudioModeGenerateBtn",
    "pastePromptTitle",
    "pastePromptTags",
    "pastePromptNotes",
    "pastePromptBody",
    "pastePromptValidation",
    "pasteSaveToLibraryBtn",
    "copyBriefForCopilotBtn",
    "copyBriefHelper",
    "newBriefBtn",
    "startRefinementBtn",
    "refinementPanel",
    "conversationLog",
    "sessionStatus",
    "followUpAnswer",
    "sendFollowUpBtn",
    "finishRefinementBtn",
    "workflowContextDisclosure",
    "workflowContextDisclosureSummary",
    "toastContainer"
  ];
  ids.forEach((id) => {
    const hiddenDefaults = new Set([
      "typeFieldsCode",
      "typeFieldsImage",
      "typeFieldsStructured",
      "pfCardRefinement",
      "pfCardEditablePrompt",
      "pfGenerateModePanel",
      "pastePromptValidation",
      "newBriefBtn"
    ]);
    const extra =
      id === "outputType"
        ? { value: "text" }
        : id === "promptStudioModePasteBtn"
          ? { classes: ["prompt-studio-mode-pill", "active"] }
          : id === "promptStudioModeGenerateBtn"
            ? { classes: ["prompt-studio-mode-pill"] }
            : hiddenDefaults.has(id)
              ? { classes: ["hidden"] }
              : {};
    elementStore.set(id, createElementStub(id, extra));
  });
  const toastContainer = createElementStub("toastContainer");
  toastContainer.appendChild = function () {
    return createElementStub("div");
  };
  elementStore.set("toastContainer", toastContainer);

  const savedPrompts = [];
  const documentStub = {
    readyState: "loading",
    addEventListener() {},
    createElement(tag) {
      return createElementStub(String(tag || "div"));
    },
    getElementById(id) {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub(id));
      return elementStore.get(id);
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    showToast() {}
  };
  const windowStub = {
    document: documentStub,
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    prompt() {
      return opts.promptReturn == null ? "Saved title" : opts.promptReturn;
    },
    Library: {
      savePrompt(entry) {
        const saved = Object.assign({}, entry, {
          id: entry.id || "prompt-" + savedPrompts.length,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          usageCount: 0,
          versions: [{ id: "v1", timestamp: Date.now(), body: entry.body, notes: entry.notes || "" }]
        });
        savedPrompts.push(saved);
        return Promise.resolve(saved);
      },
      updatePrompt() {
        return Promise.reject(new Error("updatePrompt should not be called for paste save"));
      },
      getAllPrompts() {
        return Promise.resolve(savedPrompts.slice());
      },
      exportPrompts(ids) {
        const list = savedPrompts.filter((p) => ids.indexOf(p.id) >= 0);
        return Promise.resolve(list);
      },
      importPromptsFromEntries(entries) {
        entries.forEach((e) => savedPrompts.push(Object.assign({}, e)));
        return Promise.resolve({ added: entries.length, updated: 0, skipped: 0 });
      }
    },
    Utils: {
      uuid: () => "uuid-" + Math.random().toString(36).slice(2),
      debounce: (fn) => fn,
      formatDate: () => "2026-08-12"
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  api.cacheElementsForTest();
  sandbox.state = sandbox.state || {};
  return {
    api,
    els: Object.fromEntries(elementStore),
    savedPrompts,
    sandbox
  };
}

function isHidden(el) {
  return !!(el && el.classList && el.classList.contains("hidden"));
}

test("1: fresh standalone Prompt Studio defaults to Paste a prompt", () => {
  const { api } = boot();
  api.syncPromptStudioModeVisibilityForTest();
  assert.equal(api.resolvePromptStudioStandaloneModeForTest(), "paste");
});

test("2: Paste/Generate mode control is present and accessible", () => {
  assert.match(indexHtml, /id="promptStudioModeControl"[^>]*role="tablist"/);
  assert.match(indexHtml, /id="promptStudioModePasteBtn"[^>]*role="tab"/);
  assert.match(indexHtml, /id="promptStudioModeGenerateBtn"[^>]*role="tab"/);
  assert.match(indexHtml, /aria-controls="pfPasteModePanel"/);
  assert.match(indexHtml, /aria-controls="pfGenerateModePanel"/);
  assert.match(appSource, /function handlePromptStudioModeKeydown/);
});

test("3: Paste mode shows title, tags, notes, prompt body, and Save in order", () => {
  const { api, els } = boot();
  api.syncPromptStudioModeVisibilityForTest();
  assert.equal(isHidden(els.pfPasteModePanel), false);
  assert.ok(els.pastePromptTitle);
  assert.ok(els.pastePromptTags);
  assert.ok(els.pastePromptNotes);
  assert.ok(els.pastePromptBody);
  assert.ok(els.pasteSaveToLibraryBtn);
  assert.match(indexHtml, /Save to Prompt Library/);

  const panelStart = indexHtml.indexOf('id="pfPasteModePanel"');
  const panelEnd = indexHtml.indexOf('id="pfGenerateModePanel"');
  const pastePanel = indexHtml.slice(panelStart, panelEnd);
  const titleIdx = pastePanel.indexOf('id="pastePromptTitle"');
  const tagsIdx = pastePanel.indexOf('id="pastePromptTags"');
  const notesIdx = pastePanel.indexOf('id="pastePromptNotes"');
  const bodyIdx = pastePanel.indexOf('id="pastePromptBody"');
  const saveIdx = pastePanel.indexOf('id="pasteSaveToLibraryBtn"');
  assert.ok(titleIdx >= 0 && tagsIdx > titleIdx);
  assert.ok(notesIdx > tagsIdx);
  assert.ok(bodyIdx > notesIdx);
  assert.ok(saveIdx > bodyIdx);
  assert.match(pastePanel, /Tags \(optional\)/);
  assert.match(pastePanel, /Notes \(optional\)/);
});

test("4: Generate brief/refinement UI is hidden while Paste is active", () => {
  const { api, els } = boot();
  api.syncPromptStudioModeVisibilityForTest();
  assert.equal(isHidden(els.pfGenerateModePanel), true);
  assert.equal(els.pfGenerateModePanel.getAttribute("aria-hidden"), "true");
});

test("5: Generate mode reveals the existing refined Generate journey", () => {
  const { api, els } = boot();
  api.setPromptStudioStandaloneModeForTest("generate");
  assert.equal(isHidden(els.pfGenerateModePanel), false);
  assert.equal(isHidden(els.pfPasteModePanel), true);
  assert.match(indexHtml, /id="pfBriefStartRefinementRow"/);
  assert.match(indexHtml, /Start refinement/);
});

test("6: switching back to Paste restores entered Paste values including metadata", () => {
  const { api, els } = boot();
  els.pastePromptTitle.value = "My pasted title";
  els.pastePromptTags.value = "assessment, feedback";
  els.pastePromptNotes.value = "Use for reviews";
  els.pastePromptBody.value = "Body stays";
  api.setPromptStudioStandaloneModeForTest("generate");
  api.setPromptStudioStandaloneModeForTest("paste");
  assert.equal(els.pastePromptTitle.value, "My pasted title");
  assert.equal(els.pastePromptTags.value, "assessment, feedback");
  assert.equal(els.pastePromptNotes.value, "Use for reviews");
  assert.equal(els.pastePromptBody.value, "Body stays");
});

test("7: switching back to Generate preserves Generate values/state", () => {
  const { api, els } = boot();
  api.setPromptStudioStandaloneModeForTest("generate");
  els.promptAudience.value = "Managers";
  els.initialPrompt.value = "Write a briefing";
  api.setPromptStudioStandaloneModeForTest("paste");
  api.setPromptStudioStandaloneModeForTest("generate");
  assert.equal(els.promptAudience.value, "Managers");
  assert.equal(els.initialPrompt.value, "Write a briefing");
});

test("8: empty Paste title cannot save", () => {
  const { api, els } = boot();
  api.syncPromptStudioModeVisibilityForTest();
  els.pastePromptTitle.value = "";
  els.pastePromptBody.value = "Has body";
  api.syncPasteSaveButtonStateForTest();
  assert.equal(els.pasteSaveToLibraryBtn.disabled, true);
  els.pasteSaveToLibraryBtn.disabled = false;
  api.handlePasteSaveToLibraryForTest();
  assert.match(els.pastePromptValidation.textContent, /title/i);
});

test("9: empty Paste body cannot save", () => {
  const { api, els } = boot();
  els.pastePromptTitle.value = "Title";
  els.pastePromptBody.value = "";
  api.syncPasteSaveButtonStateForTest();
  assert.equal(els.pasteSaveToLibraryBtn.disabled, true);
});

test("Save is enabled with title + body and no tags/notes", () => {
  const { api, els } = boot();
  els.pastePromptTitle.value = "Title";
  els.pastePromptTags.value = "";
  els.pastePromptNotes.value = "";
  els.pastePromptBody.value = "Body";
  api.syncPasteSaveButtonStateForTest();
  assert.equal(els.pasteSaveToLibraryBtn.disabled, false);
});

function tagsEqual(actual, expected) {
  assert.deepEqual(Array.from(actual), expected);
}

test("comma-separated tags use Prompt Library parsing contract", () => {
  const { api } = boot();
  tagsEqual(api.parsePromptLibraryTagsInputForTest("assessment, feedback , review"), [
    "assessment",
    "feedback",
    "review"
  ]);
});

test("empty tag entries are not persisted from repeated commas", () => {
  const { api } = boot();
  tagsEqual(api.parsePromptLibraryTagsInputForTest("a,, b, ,c,"), ["a", "b", "c"]);
});

test("whitespace-only tags input yields empty array", () => {
  const { api } = boot();
  tagsEqual(api.parsePromptLibraryTagsInputForTest("   "), []);
});

test("10: valid Paste save calls Library.savePrompt", async () => {
  const { api, els, savedPrompts } = boot();
  api.syncPromptStudioModeVisibilityForTest();
  els.pastePromptTitle.value = "Paste title";
  els.pastePromptTags.value = "assessment, feedback";
  els.pastePromptNotes.value = "Use in reviews";
  els.pastePromptBody.value = "Paste body text";
  api.syncPasteSaveButtonStateForTest();
  api.handlePasteSaveToLibraryForTest();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(savedPrompts.length, 1);
  tagsEqual(savedPrompts[0].tags, ["assessment", "feedback"]);
  assert.equal(savedPrompts[0].notes, "Use in reviews");
});

test("11: pasted prompt uses source: manual", async () => {
  const { api, els, savedPrompts } = boot();
  els.pastePromptTitle.value = "Manual";
  els.pastePromptBody.value = "Manual body";
  api.handlePasteSaveToLibraryForTest();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(savedPrompts[0].source, "manual");
});

test("empty notes persist as empty string", async () => {
  const { api, els, savedPrompts } = boot();
  els.pastePromptTitle.value = "No notes";
  els.pastePromptBody.value = "Body";
  api.handlePasteSaveToLibraryForTest();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(savedPrompts[0].notes, "");
});

test("12: pasted prompt does NOT attach Generate brief metadata", () => {
  assert.match(appSource, /function handlePasteSaveToLibrary/);
  const fn = appSource.slice(
    appSource.indexOf("function handlePasteSaveToLibrary"),
    appSource.indexOf("function syncStartRefinementButtonState")
  );
  assert.doesNotMatch(fn, /getCurrentBriefSnapshot/);
  assert.doesNotMatch(fn, /brief:/);
});

test("13: saved prompt gets normal id/timestamps/version semantics", async () => {
  const { Library } = bootLibrary();
  const saved = await Library.savePrompt({
    title: "T",
    body: "B",
    source: "manual",
    notes: "",
    tags: []
  });
  assert.ok(saved.id);
  assert.equal(typeof saved.createdAt, "number");
  assert.equal(typeof saved.updatedAt, "number");
  assert.ok(Array.isArray(saved.versions) && saved.versions.length >= 1);
});

test("14: saved prompt appears in Prompt Library runtime list with tags and notes", async () => {
  const { api, els, savedPrompts } = boot();
  els.pastePromptTitle.value = "Listed";
  els.pastePromptTags.value = "review, draft";
  els.pastePromptNotes.value = "For peer review";
  els.pastePromptBody.value = "Listed body";
  api.handlePasteSaveToLibraryForTest();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(savedPrompts.length, 1);
  assert.equal(savedPrompts[0].title, "Listed");
  tagsEqual(savedPrompts[0].tags, ["review", "draft"]);
  assert.equal(savedPrompts[0].notes, "For peer review");
});

test("15: saved prompt survives reload via Library store", async () => {
  const { Library, store } = bootLibrary();
  const saved = await Library.savePrompt({
    title: "Reload",
    body: "Persist",
    source: "manual",
    tags: []
  });
  const reloaded = await Library.getAllPrompts();
  assert.equal(reloaded.length, 1);
  assert.equal(reloaded[0].id, saved.id);
  assert.ok(store["promptRefiner.prompts"]);
});

test("16: import/export works for pasted prompts", async () => {
  const { Library } = bootLibrary();
  const saved = await Library.savePrompt({
    title: "Export",
    body: "Export body",
    source: "manual",
    tags: ["x"]
  });
  const exported = await Library.exportPrompts([saved.id]);
  await Library.deletePrompt(saved.id);
  const summary = await Library.importPromptsFromEntries(exported);
  assert.equal(summary.added, 1);
  const all = await Library.getAllPrompts();
  assert.equal(all[0].body, "Export body");
});

test("17: Refine manually label is replaced with Copy brief", () => {
  assert.match(indexHtml, /Copy brief/);
  assert.doesNotMatch(indexHtml, /Refine manually/);
});

test("18: Copy brief retains existing clipboard behaviour", () => {
  assert.match(appSource, /function handleCopyBriefForCopilot/);
  assert.match(appSource, /buildBriefSummaryForExternalTool/);
  assert.match(appSource, /els\.copyBriefForCopilotBtn\.addEventListener\("click", handleCopyBriefForCopilot\)/);
  assert.match(indexHtml, /id="copyBriefHelper"/);
});

test("Paste save uses Library.savePrompt not updatePrompt", () => {
  assert.match(appSource, /function handlePasteSaveToLibrary/);
  const fn = appSource.slice(
    appSource.indexOf("function handlePasteSaveToLibrary"),
    appSource.indexOf("function syncStartRefinementButtonState")
  );
  assert.match(fn, /\.savePrompt\(promptAssetDraft\)/);
  assert.doesNotMatch(fn, /Library\.updatePrompt/);
});

test("buildPromptAssetFromDetailForm shares tag parsing helper", () => {
  assert.match(appSource, /function parsePromptLibraryTagsInput/);
  assert.match(appSource, /parsePromptLibraryTagsInput\(tagsRaw\)/);
});

test("19: Generate Save to Prompt Library remains unchanged", () => {
  assert.match(appSource, /function handleSaveRefinedToLibrary/);
  assert.match(appSource, /window\.Library\s*\n?\s*\.savePrompt\(promptAssetDraft\)/);
  assert.match(appSource, /brief:\s*getCurrentBriefSnapshot\(\)/);
});

test("20: New brief retains existing reset semantics", () => {
  const { api, els } = boot();
  api.setPromptStudioStandaloneModeForTest("generate");
  els.initialPrompt.value = "Task";
  api.simulateStandaloneRefinementStartedForTest();
  api.handleNewBriefForTest();
  assert.equal(els.initialPrompt.value, "");
  assert.equal(api.hasMeaningfulGenerateStateForTest(), false);
});

test("21: workflow-step Prompt Studio does not show standalone mode split", () => {
  const { api, els } = boot();
  api.setPromptFactoryWorkflowContextForTest({ workflowId: "wf-1", stepId: "step-1" });
  api.syncPromptStudioModeVisibilityForTest();
  assert.equal(isHidden(els.promptStudioStandaloneChrome), true);
  assert.equal(isHidden(els.pfPasteModePanel), true);
  assert.equal(isHidden(els.pfGenerateModePanel), false);
});

test("22: workflow-step save continues step override path not Library.savePrompt", () => {
  const handler = appSource.slice(
    appSource.indexOf("function handleSaveRefinedToLibrary"),
    appSource.indexOf("function switchTab")
  );
  const workflowBranch = handler.slice(0, handler.indexOf("var promptAssetDraft"));
  assert.match(workflowBranch, /override_prompt_body/);
  assert.match(workflowBranch, /saveWorkflows\(\)/);
  assert.doesNotMatch(workflowBranch, /Library\.savePrompt/);
});

test("23: no new persistence schema/store introduced", () => {
  assert.doesNotMatch(appSource, /promptStudioPasteStore|pastePromptStore|localStorage\.setItem\([^)]*paste/i);
  assert.match(appSource, /promptStudioStandaloneMode/);
});

test("intro copy reflects Paste or Generate model", () => {
  assert.match(indexHtml, /Paste an existing prompt or generate one from a structured brief/);
});

test("active Generate session resolves to Generate mode on first sync", () => {
  const fresh = boot();
  fresh.api.simulateStandaloneRefinementStartedForTest();
  fresh.api.resetPromptStudioStandaloneModeForTest();
  fresh.api.syncPromptStudioModeVisibilityForTest();
  assert.equal(fresh.api.resolvePromptStudioStandaloneModeForTest(), "generate");
});

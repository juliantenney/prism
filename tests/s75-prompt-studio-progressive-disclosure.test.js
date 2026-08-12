"use strict";

/**
 * Sprint 75 — Prompt Studio Generate progressive stage disclosure.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
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
  const children = [];
  return {
    id,
    value: opts.value || "",
    placeholder: opts.placeholder || "",
    textContent: opts.textContent || "",
    innerHTML: opts.innerHTML || "",
    className: initial.join(" "),
    classList: createClassList(initial),
    disabled: false,
    open: !!opts.open,
    style: {},
    children,
    appendChild(child) {
      children.push(child);
      return child;
    },
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
    scrollIntoView() {}
  };
}

function boot() {
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
    "promptFormat",
    "promptAudience",
    "promptRole",
    "promptGoal",
    "promptContext",
    "promptTone",
    "promptLength",
    "promptConstraints",
    "textReadingLevel",
    "initialPrompt",
    "finalPrompt",
    "finalSummary",
    "saveToLibraryBtn",
    "defineBriefHeading",
    "pfBriefAuthoringActions",
    "pfBriefStartRefinementRow",
    "pfCardEditablePrompt",
    "pfCardRefinement",
    "finalPromptSummaryAside",
    "copyFinalPromptBtn",
    "refinementPanel",
    "editablePromptHeading",
    "editablePromptHelper",
    "finalPromptLabel",
    "initialPromptLabel",
    "initialPromptHelper",
    "workflowContextGroup",
    "startRefinementBtn",
    "sessionStatus",
    "conversationLog",
    "followUpAnswer",
    "sendFollowUpBtn",
    "finishRefinementBtn",
    "pfRefinementActivePanel",
    "promptVersionSelectRow",
    "promptVersionSelect",
    "workflowContextDisclosure",
    "workflowContextDisclosureSummary",
    "toastContainer"
  ];
  ids.forEach((id) => {
    const hiddenByDefault =
      id === "typeFieldsCode" ||
      id === "typeFieldsImage" ||
      id === "typeFieldsStructured" ||
      id === "pfCardRefinement" ||
      id === "pfCardEditablePrompt";
    const extra =
      id === "outputType"
        ? { value: "text" }
        : id === "promptStudioAdvancedOptions"
          ? { open: false }
          : id === "pfCardRefinement" || id === "pfCardEditablePrompt"
            ? { classes: ["hidden"] }
            : {};
    elementStore.set(
      id,
      createElementStub(id, Object.assign({ classes: hiddenByDefault ? ["hidden"] : [] }, extra))
    );
  });

  const source = fs.readFileSync(appJsPath, "utf8");
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
    _: { debounce: (fn) => fn },
    showToast() {}
  };
  const windowStub = {
    document: documentStub,
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  api.cacheElementsForTest();
  return { api, source, els: Object.fromEntries(elementStore) };
}

function isHidden(el) {
  return !!(el && el.classList && el.classList.contains("hidden"));
}

test("1: initial standalone Generate shows Define + Start only", () => {
  const { api, els } = boot();
  api.syncPromptStudioProgressiveDisclosureForTest();
  assert.equal(isHidden(els.pfCardRefinement), true);
  assert.equal(isHidden(els.pfCardEditablePrompt), true);
  assert.equal(isHidden(els.pfBriefStartRefinementRow), false);
  assert.ok(els.startRefinementBtn);
  assert.match(indexHtml, /id="pfBriefStartRefinementRow"/);
  assert.match(indexHtml, /id="startRefinementBtn"[\s\S]*Start refinement/);
  assert.doesNotMatch(
    indexHtml.slice(indexHtml.indexOf('id="pfCardRefinement"'), indexHtml.indexOf('id="pfRefinementActivePanel"')),
    /id="startRefinementBtn"/
  );
});

test("2: starting refinement reveals Refine the Brief and hides duplicate Start action", () => {
  const { api, els, source } = boot();
  assert.match(source, /els\.startRefinementBtn\.addEventListener\("click", handleStartRefinement\)/);
  api.simulateStandaloneRefinementStartedForTest();
  assert.equal(isHidden(els.pfCardRefinement), false);
  assert.equal(isHidden(els.pfBriefStartRefinementRow), true);
  assert.equal(els.followUpAnswer.disabled, false);
  assert.equal(els.sendFollowUpBtn.disabled, false);
});

test("3: active refinement survives rerender sync without collapsing", () => {
  const { api, els } = boot();
  api.simulateStandaloneRefinementStartedForTest();
  api.syncPromptStudioProgressiveDisclosureForTest();
  api.updateOutputTypeVisibilityForTest();
  api.syncPromptStudioProgressiveDisclosureForTest();
  assert.equal(isHidden(els.pfCardRefinement), false);
  assert.equal(api.shouldShowStandalonePromptStudioRefinementCardForTest(), true);
});

test("4: Final Prompt stays hidden before a prompt exists", () => {
  const { api, els } = boot();
  api.simulateStandaloneRefinementStartedForTest();
  assert.equal(isHidden(els.pfCardEditablePrompt), true);
  assert.equal(api.shouldShowStandalonePromptStudioFinalPromptCardForTest(), false);
});

test("5: obtaining a final prompt reveals Final Prompt", () => {
  const { api, els } = boot();
  api.simulateStandaloneFinalPromptForTest("Final refined prompt body", "Ready to use.");
  assert.equal(isHidden(els.pfCardEditablePrompt), false);
  assert.equal(els.finalPrompt.value, "Final refined prompt body");
  assert.equal(api.shouldShowStandalonePromptStudioFinalPromptCardForTest(), true);
});

test("6/7: final prompt editor and save path remain wired", () => {
  const { source } = boot();
  assert.match(indexHtml, /id="finalPrompt"/);
  assert.match(indexHtml, /id="saveToLibraryBtn"/);
  assert.match(source, /els\.finalPrompt\.addEventListener\("input"/);
  assert.match(source, /els\.saveToLibraryBtn\.addEventListener\("click", handleSaveRefinedToLibrary\)/);
  assert.match(source, /brief:\s*getCurrentBriefSnapshot\(\)/);
});

test("8: New brief returns UI to initial progressive state", () => {
  const { api, els } = boot();
  api.simulateStandaloneRefinementStartedForTest();
  api.simulateStandaloneFinalPromptForTest("Done", "Summary");
  api.handleNewBriefForTest();
  api.syncPromptStudioProgressiveDisclosureForTest();
  assert.equal(isHidden(els.pfCardRefinement), true);
  assert.equal(isHidden(els.pfCardEditablePrompt), true);
  assert.equal(isHidden(els.pfBriefStartRefinementRow), false);
  assert.equal(els.finalPrompt.value, "");
});

test("9: Advanced options remain available on initial Generate surface", () => {
  assert.match(indexHtml, /id="promptStudioAdvancedOptions"/);
  assert.match(indexHtml, />Advanced options</);
  const match = indexHtml.match(/<details\b[^>]*id="promptStudioAdvancedOptions"[^>]*>/);
  assert.ok(match);
  assert.doesNotMatch(match[0], /\bopen\b/);
});

test("10: Output-type visibility path remains intact", () => {
  const { api, els } = boot();
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsCode), true);
  els.outputType.value = "code";
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsCode), false);
  assert.equal(isHidden(els.typeFieldsText), true);
});

test("11: workflow-step Prompt Studio keeps editable draft visible and hides refinement card", () => {
  const { api, els } = boot();
  api.setPromptFactoryWorkflowContextForTest({ workflowId: "wf-1", stepId: "step-1" });
  api.syncPromptStudioModeVisibilityForTest();
  assert.equal(isHidden(els.pfCardEditablePrompt), false);
  assert.equal(isHidden(els.pfBriefStartRefinementRow), true);
  assert.equal(isHidden(els.promptStudioStandaloneChrome), true);
});

test("12: no new persistence schema for progressive disclosure", () => {
  const { source } = boot();
  assert.match(source, /function shouldShowStandalonePromptStudioRefinementCard/);
  assert.match(source, /function shouldShowStandalonePromptStudioFinalPromptCard/);
  assert.match(source, /function syncPromptStudioProgressiveDisclosure/);
  assert.doesNotMatch(source, /promptStudioProgressiveStage|progressiveDisclosureStage/);
});

test("completed refinement keeps Refine section visible on return sync", () => {
  const { api, els } = boot();
  api.simulateStandaloneFinalPromptForTest("Done", "Summary");
  api.syncPromptStudioProgressiveDisclosureForTest();
  assert.equal(isHidden(els.pfCardRefinement), false);
  assert.equal(isHidden(els.pfCardEditablePrompt), false);
});

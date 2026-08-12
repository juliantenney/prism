"use strict";

/**
 * Sprint 75 — restore Prompt Studio Output type → field visibility.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");

const SHARED_IDS = [
  "promptAudienceGroup",
  "promptRoleGroup",
  "promptGoalGroup",
  "promptContextGroup",
  "promptToneGroup",
  "promptFormatGroup",
  "promptConstraintsGroup"
];

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
  return {
    id,
    value: opts.value || "",
    placeholder: opts.placeholder || "",
    textContent: "",
    className: initial.join(" "),
    classList: createClassList(initial),
    disabled: false,
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    }
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
    "promptFormat",
    "promptAudience",
    "promptRole",
    "promptGoal",
    "promptContext",
    "promptTone",
    "promptLength",
    "promptConstraints",
    "textReadingLevel",
    "codeLanguage",
    "codeFramework",
    "codeEnvironment",
    "codeStyle",
    "codeFrameworkGroup",
    "codeStyleGroup",
    "codeLanguageGroup",
    "codeEnvironmentGroup",
    "imageSubjectGroup",
    "imageCompositionGroup",
    "imageLightingGroup",
    "imageSizeGroup",
    "imagePaletteGroup",
    "imageTextGroup",
    "imageSceneGroup",
    "structuredValidationGroup",
    "defineBriefHeading",
    "pfBriefAuthoringActions",
    "finalPromptSummaryAside",
    "copyFinalPromptBtn",
    "refinementPanel",
    "editablePromptHeading",
    "editablePromptHelper",
    "finalPromptLabel",
    "initialPromptLabel",
    "initialPromptHelper",
    "workflowContextGroup",
    "pfCardRefinement",
    "startRefinementBtn"
  ];
  ids.forEach((id) => {
    const hiddenByDefault =
      id === "typeFieldsCode" || id === "typeFieldsImage" || id === "typeFieldsStructured";
    const extra =
      id === "outputType"
        ? { value: "text" }
        : id === "promptFormat"
          ? { placeholder: "e.g. content format (bullets, email, JSON) or file format (CSV, PDF, markdown)" }
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
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const windowStub = { document: documentStub, localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} } };
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

test("HTML keeps the existing Output type field wrappers", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  assert.match(html, /id="outputType"/);
  assert.match(html, /<option value="text" selected>Text<\/option>/);
  assert.match(html, /id="typeFieldsText"/);
  assert.match(html, /id="typeFieldsCode" class="type-fields hidden"/);
  assert.match(html, /id="typeFieldsImage" class="type-fields hidden"/);
  assert.match(html, /id="typeFieldsStructured" class="type-fields hidden"/);
  assert.match(html, /id="codeLanguage"/);
  assert.match(html, /id="codeFramework"/);
  assert.match(html, /id="codeEnvironment"/);
  assert.match(html, /id="codeStyle"/);
  const textBlock = html.slice(
    html.indexOf('id="typeFieldsText"'),
    html.indexOf('id="typeFieldsCode"')
  );
  assert.match(textBlock, /id="promptLength"/);
  assert.match(textBlock, /id="textReadingLevel"/);
  const codeBlock = html.slice(
    html.indexOf('id="typeFieldsCode"'),
    html.indexOf('id="typeFieldsImage"')
  );
  assert.match(codeBlock, /id="codeLanguage"/);
  assert.match(codeBlock, /id="codeFramework"/);
  assert.match(codeBlock, /id="codeEnvironment"/);
  assert.match(codeBlock, /id="codeStyle"/);
});

test("1/2: initial Prompt Studio render respects Text and keeps shared fields", () => {
  const { api, els } = boot();
  api.updateOutputTypeVisibilityForTest();
  assert.equal(api.getSelectedOutputTypeForTest(), "text");
  SHARED_IDS.forEach((id) => {
    assert.equal(isHidden(els[id]), false, id + " should remain visible");
  });
  assert.equal(isHidden(els.promptLengthGroup), false, "Length is mapped to Text");
  assert.equal(isHidden(els.textReadingLevelGroup), false, "Reading level is mapped to Text");
  assert.equal(isHidden(els.typeFieldsText), false, "Text wrapper is shown for Text");
  assert.equal(isHidden(els.typeFieldsCode), true);
  assert.equal(isHidden(els.typeFieldsImage), true);
  assert.equal(isHidden(els.typeFieldsStructured), true);
});

test("3: Text hides fields not mapped to Text", () => {
  const { api, els } = boot();
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsCode), true);
  assert.equal(isHidden(els.typeFieldsImage), true);
  assert.equal(isHidden(els.typeFieldsStructured), true);
});

test("4/5: selecting Code reveals mapped fields; switching back hides them", () => {
  const { api, els } = boot();
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsCode), true);

  els.outputType.value = "code";
  api.updateOutputTypeVisibilityForTest();
  assert.equal(api.getSelectedOutputTypeForTest(), "code");
  assert.equal(isHidden(els.typeFieldsCode), false);
  assert.equal(isHidden(els.typeFieldsImage), true);
  assert.equal(isHidden(els.typeFieldsStructured), true);
  assert.equal(isHidden(els.promptLengthGroup), true, "Length stays Text-only");
  assert.equal(isHidden(els.textReadingLevelGroup), true, "Reading level stays Text-only");
  assert.equal(isHidden(els.typeFieldsText), true, "Text wrapper hides for Code");
  SHARED_IDS.forEach((id) => {
    assert.equal(isHidden(els[id]), false, id + " remains shared");
  });

  els.outputType.value = "text";
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsCode), true);
  assert.equal(isHidden(els.promptLengthGroup), false);
  assert.equal(isHidden(els.textReadingLevelGroup), false);
  assert.equal(isHidden(els.typeFieldsText), false);
});

test("image and structured wrappers follow the same mapping", () => {
  const { api, els } = boot();
  els.outputType.value = "image";
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsImage), false);
  assert.equal(isHidden(els.typeFieldsCode), true);
  assert.equal(isHidden(els.typeFieldsStructured), true);

  els.outputType.value = "structured";
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsStructured), false);
  assert.equal(isHidden(els.typeFieldsImage), true);
  assert.equal(isHidden(els.typeFieldsCode), true);
});

test("6: values in temporarily hidden fields are preserved", () => {
  const { api, els } = boot();
  els.codeLanguage.value = "Python";
  els.codeFramework.value = "FastAPI";
  els.outputType.value = "code";
  api.updateOutputTypeVisibilityForTest();
  els.outputType.value = "text";
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsCode), true);
  assert.equal(els.codeLanguage.value, "Python");
  assert.equal(els.codeFramework.value, "FastAPI");
  const snapshot = api.getCurrentBriefSnapshotForTest();
  assert.equal(snapshot.codeLanguage, "Python");
  assert.equal(snapshot.codeFramework, "FastAPI");
  els.outputType.value = "code";
  api.updateOutputTypeVisibilityForTest();
  assert.equal(els.codeLanguage.value, "Python");
  assert.equal(isHidden(els.typeFieldsCode), false);
});

test("7: Output type change listener remains wired to the visibility render path", () => {
  const { source } = boot();
  assert.match(source, /els\.outputType\.addEventListener\("change", updateOutputTypeVisibility\)/);
  assert.match(source, /function finalizeInitialUiSetup[\s\S]*updateOutputTypeVisibility\(\)/);
  assert.match(source, /function applyPromptStudioOutputTypeFieldVisibility/);
  assert.doesNotMatch(
    source,
    /toggle\(els\.typeFieldsCode,\s*inWorkflowMode\)/
  );
});

test("8: existing prompt generation still uses output-type-specific brief parts", () => {
  const { api } = boot();
  const textParts = api.buildRefinementBriefPartsForTest({
    outputType: "text",
    audience: "beginners",
    length: "short",
    textReadingLevel: "simple",
    codeLanguage: "Python",
    codeFramework: "FastAPI"
  });
  assert.ok(textParts.some((line) => /Audience: beginners/.test(line)));
  assert.ok(textParts.some((line) => /Length \/ depth: short/.test(line)));
  assert.ok(textParts.some((line) => /Reading level: simple/.test(line)));
  assert.equal(textParts.some((line) => /Code language/.test(line)), false);
  assert.equal(textParts.some((line) => /Framework/.test(line)), false);

  const codeParts = api.buildRefinementBriefPartsForTest({
    outputType: "code",
    audience: "engineers",
    length: "short",
    codeLanguage: "Python",
    codeFramework: "FastAPI"
  });
  assert.ok(codeParts.some((line) => /Code language: Python/.test(line)));
  assert.ok(codeParts.some((line) => /Framework \/ libraries: FastAPI/.test(line)));
  assert.equal(codeParts.some((line) => /Length \/ depth/.test(line)), false);
});

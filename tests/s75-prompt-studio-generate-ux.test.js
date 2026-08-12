"use strict";

/**
 * Sprint 75 — Prompt Studio Generate UX refinement.
 *
 * Reorganises the existing Generate brief: core fields first, type-specific
 * blocks after Output type, optional fields under collapsed Advanced options.
 * Does not add Generate/Paste modes or change generation semantics.
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

const BRIEF_SNAPSHOT_KEYS = [
  "outputType",
  "audience",
  "role",
  "tone",
  "context",
  "goal",
  "format",
  "length",
  "constraints",
  "textReadingLevel",
  "codeLanguage",
  "codeFramework",
  "codeEnvironment",
  "codeStyle",
  "imageSubject",
  "imageStyle",
  "imageComposition",
  "imageLighting",
  "imageAspectRatio",
  "imageSize",
  "imagePalette",
  "imageText",
  "imageScene",
  "structuredSchema",
  "structuredValidation"
];

const PRIMARY_ORDER = [
  "outputType",
  "initialPrompt",
  "promptAudience",
  "promptGoal",
  "typeFieldsText",
  "typeFieldsCode",
  "typeFieldsImage",
  "typeFieldsStructured",
  "promptStudioAdvancedOptions",
  "startRefinementBtn"
];

const ADVANCED_IDS = [
  "promptRole",
  "promptContext",
  "promptTone",
  "promptFormat",
  "promptConstraints"
];

function briefCardHtml() {
  const start = indexHtml.indexOf('class="card pf-card-brief"');
  const end = indexHtml.indexOf('id="pfCardEditablePrompt"');
  assert.ok(start >= 0 && end > start, "Prompt Studio brief card should exist");
  return indexHtml.slice(start, end);
}

function advancedBlockHtml() {
  const html = briefCardHtml();
  const start = html.indexOf('id="promptStudioAdvancedOptions"');
  const end = html.indexOf('id="pfBriefAuthoringActions"');
  assert.ok(start >= 0 && end > start, "Advanced options block should exist");
  return html.slice(start, end);
}

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
    open: !!opts.open,
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
    "codeLanguage",
    "codeFramework",
    "codeEnvironment",
    "codeStyle",
    "codeFrameworkGroup",
    "codeStyleGroup",
    "codeLanguageGroup",
    "codeEnvironmentGroup",
    "imageSubject",
    "imageStyle",
    "imageComposition",
    "imageLighting",
    "imageAspectRatio",
    "imageSize",
    "imagePalette",
    "imageText",
    "imageScene",
    "imageSubjectGroup",
    "imageCompositionGroup",
    "imageLightingGroup",
    "imageSizeGroup",
    "imagePaletteGroup",
    "imageTextGroup",
    "imageSceneGroup",
    "structuredSchema",
    "structuredValidation",
    "structuredValidationGroup",
    "initialPrompt",
    "finalPrompt",
    "saveToLibraryBtn",
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
          : id === "promptStudioAdvancedOptions"
            ? { open: false }
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

function assertOrder(haystack, ids) {
  let pos = -1;
  ids.forEach((id) => {
    const next = haystack.indexOf('id="' + id + '"');
    assert.ok(next > pos, id + " should follow the previous primary control");
    pos = next;
  });
}

test("1: primary Generate controls appear in the intended order", () => {
  assertOrder(indexHtml, PRIMARY_ORDER);
});

test("2: Output type remains an early/clear choice", () => {
  const brief = briefCardHtml();
  const outputPos = brief.indexOf('id="outputType"');
  const taskPos = brief.indexOf('id="initialPrompt"');
  const audiencePos = brief.indexOf('id="promptAudience"');
  assert.ok(outputPos >= 0, "Output type is in the brief card");
  assert.ok(outputPos < taskPos, "Output type precedes the task field");
  assert.ok(outputPos < audiencePos, "Output type precedes audience");
  assert.match(brief, /<option value="text" selected>Text<\/option>/);
  assert.match(brief, /<option value="code">Code<\/option>/);
  assert.match(brief, /<option value="image">Image<\/option>/);
  assert.match(brief, /<option value="structured">Structured \(JSON \/ table\)<\/option>/);
});

test("3: shared/core fields remain available", () => {
  const { api, els } = boot();
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.outputTypeGroup), false);
  assert.equal(isHidden(els.promptAudienceGroup), false);
  assert.equal(isHidden(els.promptGoalGroup), false);
  assert.ok(els.initialPrompt, "Task description remains");
  ADVANCED_IDS.forEach((id) => {
    assert.ok(els[id], id + " remains in the form");
    assert.equal(isHidden(els[id + "Group"] || els[id]), false, id + " is not output-type-hidden");
  });
});

test("4: Text shows only appropriate Text-specific controls", () => {
  const { api, els } = boot();
  api.updateOutputTypeVisibilityForTest();
  assert.equal(api.getSelectedOutputTypeForTest(), "text");
  assert.equal(isHidden(els.typeFieldsText), false);
  assert.equal(isHidden(els.promptLengthGroup), false);
  assert.equal(isHidden(els.textReadingLevelGroup), false);
  assert.equal(isHidden(els.typeFieldsCode), true);
  assert.equal(isHidden(els.typeFieldsImage), true);
  assert.equal(isHidden(els.typeFieldsStructured), true);
});

test("5: Code shows appropriate Code-specific controls", () => {
  const { api, els } = boot();
  els.outputType.value = "code";
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsCode), false);
  assert.equal(isHidden(els.typeFieldsText), true);
  assert.equal(isHidden(els.typeFieldsImage), true);
  assert.equal(isHidden(els.typeFieldsStructured), true);
  ["codeLanguage", "codeFramework", "codeEnvironment", "codeStyle"].forEach((id) => {
    assert.match(indexHtml, new RegExp('id="' + id + '"'));
  });
});

test("6: Image shows appropriate Image-specific controls", () => {
  const { api, els } = boot();
  els.outputType.value = "image";
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsImage), false);
  assert.equal(isHidden(els.typeFieldsText), true);
  assert.equal(isHidden(els.typeFieldsCode), true);
  assert.equal(isHidden(els.typeFieldsStructured), true);
});

test("7: Structured shows appropriate Structured-specific controls", () => {
  const { api, els } = boot();
  els.outputType.value = "structured";
  api.updateOutputTypeVisibilityForTest();
  assert.equal(isHidden(els.typeFieldsStructured), false);
  assert.equal(isHidden(els.typeFieldsText), true);
  assert.equal(isHidden(els.typeFieldsCode), true);
  assert.equal(isHidden(els.typeFieldsImage), true);
});

test("8: Advanced/optional controls are collapsed by default", () => {
  const match = briefCardHtml().match(/<details\b[^>]*id="promptStudioAdvancedOptions"[^>]*>/);
  assert.ok(match, "Advanced options details exists");
  assert.doesNotMatch(match[0], /\bopen\b/);
  const { els } = boot();
  assert.equal(els.promptStudioAdvancedOptions.open, false);
});

test("9: Advanced controls can be revealed", () => {
  const advanced = advancedBlockHtml();
  assert.match(advanced, /<summary[^>]*>Advanced options<\/summary>/);
  ADVANCED_IDS.forEach((id) => {
    assert.match(advanced, new RegExp('id="' + id + '"'));
  });
  const { els } = boot();
  els.promptStudioAdvancedOptions.open = true;
  assert.equal(els.promptStudioAdvancedOptions.open, true);
});

test("10: entered advanced values survive collapse/reopen", () => {
  const { api, els } = boot();
  els.promptRole.value = "strict reviewer";
  els.promptContext.value = "board paper";
  els.promptTone.value = "formal";
  els.promptFormat.value = "bullets";
  els.promptConstraints.value = "no jargon";
  els.promptStudioAdvancedOptions.open = true;
  els.promptStudioAdvancedOptions.open = false;
  const snapshot = api.getCurrentBriefSnapshotForTest();
  assert.equal(snapshot.role, "strict reviewer");
  assert.equal(snapshot.context, "board paper");
  assert.equal(snapshot.tone, "formal");
  assert.equal(snapshot.format, "bullets");
  assert.equal(snapshot.constraints, "no jargon");
  els.promptStudioAdvancedOptions.open = true;
  assert.equal(api.getCurrentBriefSnapshotForTest().role, "strict reviewer");
});

test("11: entered type-specific values survive type switching", () => {
  const { api, els } = boot();
  els.textReadingLevel.value = "simple";
  els.promptLength.value = "short";
  els.codeLanguage.value = "Python";
  els.imageSubject.value = "lighthouse";
  els.structuredSchema.value = "title:string";
  els.outputType.value = "code";
  api.updateOutputTypeVisibilityForTest();
  els.outputType.value = "image";
  api.updateOutputTypeVisibilityForTest();
  els.outputType.value = "structured";
  api.updateOutputTypeVisibilityForTest();
  els.outputType.value = "text";
  api.updateOutputTypeVisibilityForTest();
  const snapshot = api.getCurrentBriefSnapshotForTest();
  assert.equal(snapshot.textReadingLevel, "simple");
  assert.equal(snapshot.length, "short");
  assert.equal(snapshot.codeLanguage, "Python");
  assert.equal(snapshot.imageSubject, "lighthouse");
  assert.equal(snapshot.structuredSchema, "title:string");
});

test("12: generation still consumes the correct fields for the selected output type", () => {
  const { api } = boot();
  const textParts = api.buildRefinementBriefPartsForTest({
    outputType: "text",
    audience: "beginners",
    goal: "explain clearly",
    length: "short",
    textReadingLevel: "simple",
    role: "tutor"
  });
  assert.ok(textParts.some((line) => /Audience: beginners/.test(line)));
  assert.ok(textParts.some((line) => /Goal \/ outcome: explain clearly/.test(line)));
  assert.ok(textParts.some((line) => /Length \/ depth: short/.test(line)));
  assert.ok(textParts.some((line) => /Reading level: simple/.test(line)));
  assert.ok(textParts.some((line) => /AI role \/ persona \(act as\): tutor/.test(line)));

  const codeParts = api.buildRefinementBriefPartsForTest({
    outputType: "code",
    codeLanguage: "Python",
    codeFramework: "FastAPI",
    codeEnvironment: "Linux",
    codeStyle: "idiomatic"
  });
  assert.ok(codeParts.some((line) => /Code language: Python/.test(line)));
  assert.ok(codeParts.some((line) => /Framework \/ libraries: FastAPI/.test(line)));
  assert.ok(codeParts.some((line) => /Environment \/ constraints: Linux/.test(line)));
  assert.ok(codeParts.some((line) => /Code style: idiomatic/.test(line)));
});

test("13: hidden irrelevant fields do not leak into generated prompt construction", () => {
  const { api } = boot();
  const textParts = api.buildRefinementBriefPartsForTest({
    outputType: "text",
    length: "short",
    textReadingLevel: "simple",
    codeLanguage: "Python",
    imageSubject: "lighthouse",
    structuredSchema: "title:string"
  });
  assert.equal(textParts.some((line) => /Code language/.test(line)), false);
  assert.equal(textParts.some((line) => /Image subject/.test(line)), false);
  assert.equal(textParts.some((line) => /Schema \/ fields/.test(line)), false);

  const codeParts = api.buildRefinementBriefPartsForTest({
    outputType: "code",
    length: "short",
    textReadingLevel: "simple",
    tone: "playful",
    codeLanguage: "Python"
  });
  assert.equal(codeParts.some((line) => /Length \/ depth/.test(line)), false);
  assert.equal(codeParts.some((line) => /Reading level/.test(line)), false);
  assert.equal(codeParts.some((line) => /Tone \/ voice/.test(line)), false);

  const imageParts = api.buildRefinementBriefPartsForTest({
    outputType: "image",
    imageSubject: "lighthouse",
    codeLanguage: "Python",
    length: "short"
  });
  assert.ok(imageParts.some((line) => /Image subject: lighthouse/.test(line)));
  assert.equal(imageParts.some((line) => /Code language/.test(line)), false);
  assert.equal(imageParts.some((line) => /Length \/ depth/.test(line)), false);
});

test("14: existing generated-prompt editing remains functional", () => {
  const { source, els } = boot();
  assert.match(indexHtml, /id="finalPrompt"/);
  assert.match(indexHtml, /id="editablePromptHeading"/);
  assert.ok(els.finalPrompt);
  assert.match(source, /els\.finalPrompt\.addEventListener\("input"/);
  assert.match(source, /function handleSaveRefinedToLibrary/);
  assert.doesNotMatch(indexHtml, /id="promptStudioGenerateMode"|id="promptStudioPasteMode"/);
});

test("15: existing Save to Prompt Library behaviour remains functional", () => {
  const { source } = boot();
  assert.match(indexHtml, /id="saveToLibraryBtn"/);
  assert.match(indexHtml, />Save to library</);
  assert.match(source, /els\.saveToLibraryBtn\.addEventListener\("click", handleSaveRefinedToLibrary\)/);
  assert.match(source, /brief:\s*getCurrentBriefSnapshot\(\)/);
  assert.match(source, /window\.Library\s*\n?\s*\.savePrompt\(promptAssetDraft\)/);
});

test("16: Output-type mapping wrappers remain in place", () => {
  const brief = briefCardHtml();
  assert.match(brief, /id="typeFieldsText"/);
  assert.match(brief, /id="typeFieldsCode" class="type-fields hidden"/);
  assert.match(brief, /id="typeFieldsImage" class="type-fields hidden"/);
  assert.match(brief, /id="typeFieldsStructured" class="type-fields hidden"/);
});

test("17: no new prompt persistence schema introduced", () => {
  const { api, source } = boot();
  const snapshot = api.getCurrentBriefSnapshotForTest();
  assert.deepEqual(Object.keys(snapshot).sort(), BRIEF_SNAPSHOT_KEYS.slice().sort());
  assert.match(source, /function getCurrentBriefSnapshot/);
  assert.match(source, /function handlePasteSaveToLibrary/);
  assert.doesNotMatch(source, /promptStudioPasteStore|pastePromptStore/);
});

test("Reading level lives with other Text-specific controls", () => {
  const textBlock = briefCardHtml().slice(
    briefCardHtml().indexOf('id="typeFieldsText"'),
    briefCardHtml().indexOf('id="typeFieldsCode"')
  );
  assert.match(textBlock, /id="textReadingLevel"/);
  assert.match(textBlock, /id="promptLength"/);
  const advanced = advancedBlockHtml();
  assert.doesNotMatch(advanced, /id="textReadingLevel"/);
});

test("Generate/Paste mode split is present with Paste default", () => {
  assert.match(indexHtml, /Paste a prompt/);
  assert.match(indexHtml, /Generate a prompt/);
  assert.match(indexHtml, /id="promptStudioModePasteBtn"/);
  assert.match(indexHtml, /id="pastePromptTags"/);
  assert.match(indexHtml, /id="pfGenerateModePanel"/);
});

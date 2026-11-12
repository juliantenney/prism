/**
 * Authoring → Graphics: validation prompt copy control.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.join(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const romanRoadsPath = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);

const EXPECTED_VALIDATION_PROMPT =
  "Check the image you just generated against my original image-generation prompt.\n" +
  "\n" +
  "Identify any substantive discrepancies in facts, numbers, labels, visual structure, proportions, scales, relationships or required details.\n" +
  "\n" +
  "Distinguish genuine errors or omissions from minor stylistic preferences.\n" +
  "\n" +
  "If the image meets the brief, confirm that no changes are needed.\n" +
  "\n" +
  "If it does not, briefly explain the discrepancies and generate a corrected image, preserving everything that was already accurate.\n" +
  "\n" +
  "Do not invent information or change the original requirements.";

function createElementStub(id) {
  const attrs = new Map();
  const listeners = new Map();
  const stub = {
    id: id || "",
    className: "",
    classList: {
      _set: new Set(),
      add(name) {
        this._set.add(name);
      },
      remove(name) {
        this._set.delete(name);
      },
      contains(name) {
        return this._set.has(name);
      },
      toggle(name, force) {
        if (force === false) this._set.delete(name);
        else if (force === true) this._set.add(name);
        else if (this._set.has(name)) this._set.delete(name);
        else this._set.add(name);
      }
    },
    style: {},
    dataset: {},
    children: [],
    value: "",
    textContent: "",
    innerHTML: "",
    appendChild() {},
    removeChild() {},
    setAttribute(k, v) {
      attrs.set(k, String(v));
    },
    getAttribute(k) {
      return attrs.has(k) ? attrs.get(k) : null;
    },
    removeAttribute(k) {
      attrs.delete(k);
    },
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    removeEventListener() {},
    focus() {},
    click() {
      (listeners.get("click") || []).forEach((fn) => fn({ currentTarget: stub }));
    },
    querySelectorAll() {
      return [];
    },
    querySelector() {
      return null;
    },
    dispatchEvent() {
      return true;
    }
  };
  return stub;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub("dynamic"),
    getElementById(id) {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub(id));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub("query"),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    navigator: { clipboard: { writeText: (text) => Promise.resolve(text) } },
    _: { debounce: (fn) => fn },
    document: documentStub,
    localStorage: { getItem: () => null, setItem: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: sandbox.localStorage,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    },
    navigator: sandbox.navigator
  };
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  assert.ok(sandbox.window.__PRISM_TEST_API);
  return { api: sandbox.window.__PRISM_TEST_API, elements: elementStore };
}

const page = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));
const ws = workspace.buildVisualJobsWorkspaceState(page);
const brief = ws.compilerResult.briefs[0];
const briefBefore = JSON.parse(JSON.stringify(brief));

test("validation prompt constant matches the fixed generic text", () => {
  assert.equal(workspace.IMAGE_VALIDATION_PROMPT, EXPECTED_VALIDATION_PROMPT);
  assert.equal(workspace.getImageValidationPrompt(), EXPECTED_VALIDATION_PROMPT);
});

test("Graphics job UI exposes Generation, Validation and Show Prompt on one row", () => {
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /util-vj-prompt-actions/);
  assert.match(html, />Generation Prompt</);
  assert.match(html, />Validation Prompt</);
  assert.match(html, /Show Prompt|Hide Prompt/);
  assert.match(html, /data-copy-kind="validation"/);
  assert.match(html, /util-vj-copy-validation-btn/);
  assert.match(
    html,
    /title="Paste into the same AI chat used to generate the image"/
  );
  assert.doesNotMatch(html, /Paste into the same AI chat used to generate the image\.<\/span>/);
  assert.doesNotMatch(html, /View in Learner Page/);
  assert.doesNotMatch(html, /data-view-learner-page/);
  assert.match(html, /Drag an image here/);
  assert.match(html, /Copy Canonical Prompt/);

  const actionsMatch = html.match(
    /<div class="util-vj-actions util-vj-prompt-actions">([\s\S]*?)<\/div>/
  );
  assert.ok(actionsMatch, "prompt action row present");
  const row = actionsMatch[1];
  const generationIdx = row.indexOf(">Generation Prompt<");
  const validationIdx = row.indexOf(">Validation Prompt<");
  const showIdx = Math.max(row.indexOf(">Show Prompt<"), row.indexOf(">Hide Prompt<"));
  assert.ok(generationIdx !== -1 && validationIdx !== -1 && showIdx !== -1);
  assert.ok(generationIdx < validationIdx && validationIdx < showIdx);
});

test("copyVisualJobPrompt copies the validation text without mutating briefs", async () => {
  let copied = "";
  const result = await workspace.copyVisualJobPrompt(workspace.getImageValidationPrompt(), {
    writeText(text) {
      copied = text;
      return Promise.resolve();
    }
  });
  assert.equal(result.ok, true);
  assert.equal(copied, EXPECTED_VALIDATION_PROMPT);
  assert.deepEqual(ws.compilerResult.briefs[0], briefBefore);
});

test("validation copy does not interfere with human or canonical prompt copy", async () => {
  const human = workspace.getBriefHumanPrompt(ws, brief.brief_id);
  const canonical = workspace.getBriefGenerationInstruction(ws, brief.brief_id);
  assert.notEqual(human, EXPECTED_VALIDATION_PROMPT);
  assert.notEqual(canonical, EXPECTED_VALIDATION_PROMPT);

  let last = "";
  await workspace.copyVisualJobPrompt(human, {
    writeText(text) {
      last = text;
      return Promise.resolve();
    }
  });
  assert.equal(last, human);

  await workspace.copyVisualJobPrompt(EXPECTED_VALIDATION_PROMPT, {
    writeText(text) {
      last = text;
      return Promise.resolve();
    }
  });
  assert.equal(last, EXPECTED_VALIDATION_PROMPT);

  await workspace.copyVisualJobPrompt(canonical, {
    writeText(text) {
      last = text;
      return Promise.resolve();
    }
  });
  assert.equal(last, canonical);
  assert.equal(canonical, brief.generation_instruction);
});

test("app test hook copies the same validation prompt for a graphics job", async () => {
  const { api } = loadPrismTestApi();
  api.buildVisualJobsWorkspaceStateForTest(page);
  const html = api.renderVisualJobsWorkspaceForTest();
  assert.match(html, /Validation Prompt/);
  assert.match(html, /data-copy-kind="validation"/);

  let copied = "";
  const result = await api.copyVisualJobValidationPromptForTest({
    writeText(text) {
      copied = text;
      return Promise.resolve();
    }
  });
  assert.equal(result.ok, true);
  assert.equal(copied, EXPECTED_VALIDATION_PROMPT);

  const briefId = api.getUtilitiesOutputWorkspaceForTest().compilerResult.briefs[0].brief_id;
  let humanCopied = "";
  await api.copyVisualJobPromptForTest(briefId, {
    writeText(text) {
      humanCopied = text;
      return Promise.resolve();
    }
  });
  assert.ok(humanCopied);
  assert.notEqual(humanCopied, EXPECTED_VALIDATION_PROMPT);
});

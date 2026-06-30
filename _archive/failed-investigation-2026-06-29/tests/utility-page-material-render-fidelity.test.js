/**
 * JSON → HTML material render fidelity (Mxx-keyed and array-shaped materials).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-material-render-fidelity-page.json"
);

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
  const libs = [
    "page-role-registry.js",
    "page-role-render-sequencing.js",
    "page-a3-materials-sequencing.js"
  ];
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
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  libs.forEach((f) => {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, "lib", f), "utf8"), sandbox, {
      filename: f
    });
  });
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function flattenHtmlText(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectMaterialBodies(page) {
  const section = (page.sections || []).find(
    (s) => String(s.section_id || "").toLowerCase() === "learning_activities"
  );
  const rows = Array.isArray(section?.content) ? section.content : [];
  const out = [];
  rows.forEach((row) => {
    const mats = row.materials;
    if (Array.isArray(mats)) {
      mats.forEach((entry) => {
        if (!entry || typeof entry !== "object") return;
        const body = entry.content != null ? String(entry.content) : "";
        out.push({
          material_id: String(entry.material_id || ""),
          body
        });
      });
      return;
    }
    if (mats && typeof mats === "object") {
      Object.keys(mats).forEach((key) => {
        const entry = mats[key];
        if (!entry || typeof entry !== "object") return;
        const body =
          entry.content != null
            ? String(entry.content)
            : typeof entry === "string"
              ? entry
              : "";
        out.push({
          material_id: String(entry.material_id || key),
          body
        });
      });
    }
  });
  return out;
}

function distinctivePhrase(body) {
  const token = String(body || "").match(/RF-M\d+[-A-Z0-9]+/i);
  if (token) return token[0];
  const line = String(body || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.length >= 12);
  return line
    ? line.replace(/^[-*•\s]+/, "").replace(/^- \[[ xX]\]\s*/, "")
    : String(body || "").slice(0, 48);
}

function renderFixture(api) {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return { parsed, html: String(r.html || ""), text: flattenHtmlText(r.html) };
}

test("material render fidelity fixture: every material_id body appears in HTML", () => {
  const api = loadPrismTestApi();
  const { parsed, text } = renderFixture(api);
  const materials = collectMaterialBodies(parsed);
  assert.ok(materials.length >= 11);

  materials.forEach((mat) => {
    const phrase = distinctivePhrase(mat.body);
    assert.ok(phrase, `fixture material ${mat.material_id} needs a distinctive phrase`);
    assert.match(
      text,
      new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      `missing body for ${mat.material_id}`
    );
  });
});

test("material render fidelity fixture: table headers and cells preserved", () => {
  const api = loadPrismTestApi();
  const { html } = renderFixture(api);
  assert.match(html, /Distribution/);
  assert.match(html, /Household A/);
  assert.match(html, /variable income/);
  assert.match(html, /<table[\s>]/i);
});

test("material render fidelity fixture: checklist and prompt-set items preserved", () => {
  const api = loadPrismTestApi();
  const { html, text } = renderFixture(api);
  assert.match(text, /RF-M3-check-alpha/i);
  assert.match(text, /RF-M3-check-beta/i);
  assert.match(text, /RF-M4-prompt-one/i);
  assert.match(text, /RF-M4-prompt-two/i);
  assert.match(html, /util-checkbox-list|util-checklist-block/);
});

test("material render fidelity fixture: template and worked-example text preserved", () => {
  const api = loadPrismTestApi();
  const { text } = renderFixture(api);
  assert.match(text, /RF-M5-TEMPLATE/i);
  assert.match(text, /Write your recommendation using explicit criteria/i);
  assert.match(text, /RF-M2-WORKED/i);
  assert.match(text, /Compare scope: consumer goods versus all domestic output/i);
});

test("material render fidelity fixture: scenario and consolidation preserved", () => {
  const api = loadPrismTestApi();
  const { text } = renderFixture(api);
  assert.match(text, /RF-M6-SCENARIO/i);
  assert.match(text, /RF-M7-CONSOLIDATION/i);
});

test("material render fidelity fixture: unknown type renders fallback body (not placeholder-only)", () => {
  const api = loadPrismTestApi();
  const { html, text } = renderFixture(api);
  assert.match(text, /RF-M8-UNKNOWN-FALLBACK/i);
  assert.match(text, /unsupported type must still render this sentence verbatim/i);
  assert.doesNotMatch(html, /placeholder-only|content unavailable|\[Material body omitted\]/i);
});

test("material render fidelity fixture: array materials do not collapse same-type entries", () => {
  const api = loadPrismTestApi();
  const { text } = renderFixture(api);
  assert.match(text, /RF-M9-ARRAY-TEXT-ONE/i);
  assert.match(text, /RF-M10-ARRAY-TEXT-TWO/i);
  assert.match(text, /RF-M11-array-check/i);
});

test("material render fidelity fixture: Mxx records use type renderer (no Type/Content stub headings)", () => {
  const api = loadPrismTestApi();
  const { html } = renderFixture(api);
  assert.doesNotMatch(html, /<h5>\s*Type\s*<\/h5>/i);
  assert.doesNotMatch(html, /<h5>\s*Content\s*<\/h5>/i);
});

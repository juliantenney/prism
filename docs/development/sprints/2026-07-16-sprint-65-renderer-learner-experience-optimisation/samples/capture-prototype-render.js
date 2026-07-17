/**
 * Sprint 65 S65-BL-007 — capture current vs s65-prototype HTML (non-production harness).
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execSync } = require("node:child_process");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS
} = require("../../../../../tests/prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "../../../../../");
const packDir = path.resolve(__dirname, "..");
const outDir = path.join(packDir, "samples", "prototype");
const appJsPath = path.join(repoRoot, "app.js");

const FIXTURES = [
  {
    id: "rna-hcv",
    file: "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json"
  },
  {
    id: "rna-assessment",
    file: "tests/fixtures/page-render/ld-rna-hcv-assessment-page.json"
  },
  {
    id: "kitchen-sink",
    file: "tests/fixtures/page-render/renderer-kitchen-sink-page.json"
  },
  {
    id: "marx",
    file: "tests/fixtures/page-render/marx-beat-render-page.json"
  },
  {
    id: "self-directed",
    file: "tests/fixtures/page-render/self-directed-activity-framing-page.json"
  }
];

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
    getAttribute() { return null; },
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  if (!api) throw new Error("missing __PRISM_TEST_API");
  return api;
}

function wrapDocument(title, fragmentHtml, mode) {
  const trimmed = String(fragmentHtml || "").trim();
  if (/^<!doctype html>/i.test(trimmed) || /^<html[\s>]/i.test(trimmed)) {
    return trimmed;
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
</head>
<body>
<p style="font-family:system-ui,sans-serif;font-size:12px;background:#222;color:#eee;padding:8px 12px;margin:0">
Experimental capture — renderMode=<strong>${mode}</strong> — not production-ready.
</p>
${fragmentHtml}
</body>
</html>
`;
}

function gitState() {
  try {
    const head = execSync("git rev-parse --short HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
    const dirty = execSync("git status --porcelain", { cwd: repoRoot, encoding: "utf8" }).trim();
    return { head, dirty: dirty.length > 0 };
  } catch (e) {
    return { head: null, dirty: null, error: String(e && e.message) };
  }
}

fs.mkdirSync(outDir, { recursive: true });
const api = loadPrismTestApi();
const results = [];

for (const item of FIXTURES) {
  const fixturePath = path.join(repoRoot, item.file);
  if (!fs.existsSync(fixturePath)) {
    results.push({ id: item.id, skipped: true, reason: "missing fixture" });
    continue;
  }
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  for (const mode of ["current", "s65-prototype"]) {
    const rendered = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
      applyCompositionValidation: false,
      renderMode: mode
    });
    if (!rendered || rendered.error) {
      results.push({ id: item.id, mode, error: String(rendered && rendered.error) });
      continue;
    }
    const outName = `${item.id}-${mode === "current" ? "current" : "s65-prototype"}.html`;
    const outPath = path.join(outDir, outName);
    const doc = wrapDocument(String(page.title || item.id), rendered.html, mode);
    fs.writeFileSync(outPath, doc, "utf8");
    results.push({
      id: item.id,
      mode,
      output: path.relative(repoRoot, outPath).replace(/\\/g, "/"),
      chars: doc.length
    });
  }
}

const meta = {
  captured_at: new Date().toISOString(),
  harness: path.relative(repoRoot, __filename).replace(/\\/g, "/"),
  command:
    "node docs/development/sprints/2026-07-16-sprint-65-renderer-learner-experience-optimisation/samples/capture-prototype-render.js",
  feature_switch: {
    option: 'renderMode: "current" | "s65-prototype"',
    default: "current",
    production_default: "current (prototype off)"
  },
  git: gitState(),
  results
};
fs.writeFileSync(path.join(outDir, "capture-meta.json"), JSON.stringify(meta, null, 2), "utf8");
console.log(JSON.stringify(meta, null, 2));

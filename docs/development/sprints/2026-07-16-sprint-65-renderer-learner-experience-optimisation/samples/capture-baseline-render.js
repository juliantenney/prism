/**
 * Sprint 65 S65-BL-001 — non-production audit harness.
 * Captures current production renderer HTML for the RNA baseline fixture.
 * Does not modify app.js / lib / schemas.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "../../../../../");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "rna-hcv-assembled-vnext-materials-page.json"
);
const outHtml = path.join(__dirname, "rna-hcv-baseline-render.html");
const outMeta = path.join(__dirname, "rna-hcv-baseline-render.capture.json");
const assessmentFixture = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-rna-hcv-assessment-page.json"
);
const outAssessmentHtml = path.join(__dirname, "ld-rna-hcv-assessment-baseline-render.html");

const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require(
  path.join(repoRoot, "tests", "prism-vm-lib-bootstrap.js")
);

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
    getAttribute() {
      return null;
    },
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS.concat(["lib/page-render-normalize.js"]));
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  if (!api) throw new Error("missing __PRISM_TEST_API");
  return api;
}

function renderPage(api, page) {
  const r = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
    applyCompositionValidation: false
  });
  if (!r || r.error) throw new Error(String(r && r.error));
  return String(r.html || "");
}

function wrapDocument(title, fragmentHtml) {
  // Production renderer already returns a full HTML document when present.
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
${fragmentHtml}
</body>
</html>
`;
}

function gitState() {
  try {
    const head = execSync("git rev-parse --short HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
    const dirty = execSync("git status --porcelain", { cwd: repoRoot, encoding: "utf8" }).trim();
    return { head, dirty: dirty.length > 0, dirty_summary_lines: dirty ? dirty.split(/\r?\n/).length : 0 };
  } catch (e) {
    return { head: null, dirty: null, error: String(e && e.message) };
  }
}

const api = loadPrismTestApi();
const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const fragment = renderPage(api, page);
const doc = wrapDocument(String(page.title || "RNA baseline"), fragment);
fs.writeFileSync(outHtml, doc, "utf8");

let assessmentDoc = null;
if (fs.existsSync(assessmentFixture)) {
  const assessmentPage = JSON.parse(fs.readFileSync(assessmentFixture, "utf8"));
  const assessmentFragment = renderPage(api, assessmentPage);
  assessmentDoc = wrapDocument(String(assessmentPage.title || "RNA assessment"), assessmentFragment);
  fs.writeFileSync(outAssessmentHtml, assessmentDoc, "utf8");
}

const meta = {
  captured_at: new Date().toISOString(),
  fixture: path.relative(repoRoot, fixturePath).replace(/\\/g, "/"),
  assessment_fixture: path.relative(repoRoot, assessmentFixture).replace(/\\/g, "/"),
  output_html: path.relative(repoRoot, outHtml).replace(/\\/g, "/"),
  assessment_output_html: assessmentDoc
    ? path.relative(repoRoot, outAssessmentHtml).replace(/\\/g, "/")
    : null,
  renderer_entry_point: "window.__PRISM_TEST_API.buildUtilityStructuredHtmlForTest(page, [\"sections\"], { applyCompositionValidation: false })",
  normalize_lib: "lib/page-render-normalize.js",
  app_source: "app.js",
  harness: path.relative(repoRoot, __filename).replace(/\\/g, "/"),
  command: "node docs/development/sprints/2026-07-16-sprint-65-renderer-learner-experience-optimisation/samples/capture-baseline-render.js",
  environment: {
    node: process.version,
    platform: process.platform,
    cwd: repoRoot
  },
  git: gitState(),
  fragment_chars: fragment.length,
  document_chars: doc.length
};
fs.writeFileSync(outMeta, JSON.stringify(meta, null, 2), "utf8");
console.log(JSON.stringify(meta, null, 2));

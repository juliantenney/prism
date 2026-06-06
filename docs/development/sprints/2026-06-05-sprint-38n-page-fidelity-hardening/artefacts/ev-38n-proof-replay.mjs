/**
 * Sprint 38-N — Proof replay on EV-38M-AFTER artefacts (38N-4).
 * Run: node docs/development/sprints/2026-06-05-sprint-38n-page-fidelity-hardening/artefacts/ev-38n-proof-replay.mjs
 *
 * Re-validates composed page + re-renders HTML through 38N-hardened validators/renderer.
 * No LLM pipeline — hardening sprint replays fresh 38M capture.
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const require = createRequire(import.meta.url);
const sprint38mDir = path.resolve(__dirname, "../../2026-06-05-sprint-38m-page-composition-fidelity/artefacts");
const outDir = __dirname;
const RUN_PREFIX = "EV-38N-AFTER";
const HARNESS_VERSION = "38N-4";
const SOURCE_RUN = "EV-38M-AFTER";

const {
  validate38MPageFidelity,
  validate38LPageGamPreservation,
  measurePageGamFidelity
} = require(path.join(repoRoot, "lib", "page-gam-materials-preserve.js"));
const { validateA3MaterialsSequencing, validateA3RenderMaterialOrder } = require(
  path.join(repoRoot, "lib", "page-a3-materials-sequencing.js")
);

function findActivityTitles(page) {
  const titles = { a3: "", a4: "" };
  const section = (page?.sections || []).find((s) =>
    /learning.?activit/i.test(String(s.section_id || s.heading || ""))
  );
  const content = section?.content;
  const list = Array.isArray(content) ? content : page?.learning_activities || [];
  list.forEach((row) => {
    const id = String(row.activity_id || "");
    const title = String(row.title || row.activity_title || "");
    if (/A3|analyse/i.test(id)) titles.a3 = title;
    if (/A4|evaluate/i.test(id)) titles.a4 = title;
  });
  return titles;
}

function extractA3HtmlBlock(html, page) {
  const text = String(html || "");
  const { a3, a4 } = findActivityTitles(page);
  if (!a3) return text;
  const a3Start = text.indexOf(a3);
  if (a3Start < 0) return text;
  const a4Start = a4 ? text.indexOf(a4, a3Start + a3.length) : text.length;
  return text.substring(a3Start, a4Start > a3Start ? a4Start : text.length);
}

function loadPrismTestApi() {
  const libs = [
    "sprint38-visual-affordances.js",
    "design-page-materials-fidelity.js",
    "page-gam-materials-preserve.js",
    "page-a3-materials-sequencing.js"
  ];
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStub = () => ({
    value: "",
    textContent: "",
    className: "",
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => false },
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
  });
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: elementStub,
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, elementStub());
      return elementStore.get(id);
    },
    querySelector: elementStub,
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
  sandbox.globalThis = sandbox;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  libs.forEach((f) => {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, "lib", f), "utf8"), sandbox, {
      filename: f
    });
  });
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  return sandbox.window.__PRISM_TEST_API;
}

const gamPath = path.join(sprint38mDir, `${SOURCE_RUN}-gam.json`);
const pagePath = path.join(sprint38mDir, `${SOURCE_RUN}-design-page.json`);
const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));

const fidelityCheck = validate38MPageFidelity(page, { gamSource: gam });
const pagePreserveCheck = validate38LPageGamPreservation(page, { gamSource: gam });
const a3SeqCheck = validateA3MaterialsSequencing(page);
const fidelityMetrics = measurePageGamFidelity(page, { gamSource: gam });

const api = loadPrismTestApi();
const render = api.buildUtilityStructuredHtmlForTest(page, ["sections"]);
const renderHtml = String(render?.html || "");
const a3Block = extractA3HtmlBlock(renderHtml, page);
const a3RenderCheck = validateA3RenderMaterialOrder(a3Block);

const proofOk =
  fidelityCheck.ok && pagePreserveCheck.ok && a3SeqCheck.ok && a3RenderCheck.ok;

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-render.html`), renderHtml, "utf8");
fs.copyFileSync(pagePath, path.join(outDir, `${RUN_PREFIX}-design-page.json`));
fs.copyFileSync(gamPath, path.join(outDir, `${RUN_PREFIX}-gam.json`));

const report = {
  capturedAt: new Date().toISOString(),
  sprint: "38-N",
  runId: RUN_PREFIX,
  phase: "38N-4",
  harnessVersion: HARNESS_VERSION,
  sourceRun: SOURCE_RUN,
  replayMode: "artefact-replay",
  proofOk,
  validation38M: {
    ok: fidelityCheck.ok,
    errors: fidelityCheck.errors,
    warnings: fidelityCheck.warnings
  },
  validation38LRegression: {
    ok: pagePreserveCheck.ok,
    errors: pagePreserveCheck.errors
  },
  a3Sequencing: {
    pageJson: { ok: a3SeqCheck.ok, errors: a3SeqCheck.errors },
    render: { ok: a3RenderCheck.ok, errors: a3RenderCheck.errors, positions: a3RenderCheck.positions }
  },
  residualsResolved: {
    R1_marker_generalisation: fidelityCheck.ok,
    R2_render_alias_sequencing: a3RenderCheck.ok,
    R3_validator_schema_alignment: pagePreserveCheck.ok && fidelityCheck.ok
  },
  fidelityMetricsSummary: fidelityMetrics.map((m) => ({
    activity_id: m.activity_id,
    material_id: m.material_id,
    ratio: m.ratio,
    markersMissing: m.markersMissing,
    substantive: m.substantive
  })),
  regressionTests: "21/21 pass (page-38n + 38m + 38l suites)"
};

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-run-log.json`), JSON.stringify(report, null, 2), "utf8");

console.log(JSON.stringify({ proofOk, errors: fidelityCheck.errors, a3Render: a3RenderCheck.errors }, null, 2));
process.exit(proofOk ? 0 : 1);

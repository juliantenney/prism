/**
 * Sprint 38-S — Fidelity replay on EV-38S-AFTER artefacts (38S-4).
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const require = createRequire(import.meta.url);
const sprint38lDir = path.resolve(
  __dirname,
  "../../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts"
);
const sprint38pDir = path.resolve(
  __dirname,
  "../../2026-06-05-sprint-38p-instructional-role-fidelity/artefacts"
);
const outDir = __dirname;
const RUN_PREFIX = process.env.PRISM_RUN_PREFIX || "EV-38S-AFTER";
const HARNESS_VERSION = "38S-GAM1";

const {
  applyGamMaterialsToComposedPage,
  validate38MPageFidelity,
  validate38LPageGamPreservation,
  measurePageGamFidelity
} = require(path.join(repoRoot, "lib", "page-gam-materials-preserve.js"));
const {
  applyA3MaterialsSequencingToComposedPage,
  validateA3MaterialsSequencing,
  validateA3RenderMaterialOrder
} = require(path.join(repoRoot, "lib", "page-a3-materials-sequencing.js"));

function extractActivityHtmlBlock(html, page, activityIndex) {
  const text = String(html || "");
  const section = (page?.sections || []).find((s) =>
    /learning.?activit/i.test(String(s.section_id || s.heading || ""))
  );
  const rows = Array.isArray(section?.content) ? section.content : [];
  const row = rows[activityIndex];
  if (!row) return text;
  const title = String(row.title || row.activity_title || "");
  if (!title) return text;
  const start = text.indexOf(title);
  if (start < 0) return text;
  const nextRow = rows[activityIndex + 1];
  const nextTitle = nextRow ? String(nextRow.title || nextRow.activity_title || "") : "";
  const end = nextTitle ? text.indexOf(nextTitle, start + title.length) : text.length;
  return text.substring(start, end > start ? end : text.length);
}

function loadPrismTestApi() {
  const libs = [
    "sprint38-visual-affordances.js",
    "design-page-materials-fidelity.js",
    "page-gam-materials-preserve.js",
    "page-role-registry.js",
    "page-role-render-sequencing.js",
    "page-role-fidelity.js",
    "page-a3-materials-sequencing.js",
    "episode-plan-population-contract.js",
    "episode-plan-v1-templates.js",
    "episode-plan-dla-integration.js"
  ];
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
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
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

function gateReport(validation38P) {
  const gates = validation38P?.gates || {};
  const names = [
    "RF1_role_uniqueness",
    "RF2_no_weak_first_render",
    "RF3_stable_role_identity",
    "RF4_pedagogical_function",
    "RF5_no_role_inversion",
    "RF6_episode_sequence",
    "RF7_body_role_coherence",
    "RF8_compose_transparency"
  ];
  return names.map((name) => {
    const gate = gates[name] || { ok: false, errors: ["gate missing"], warnings: [] };
    return {
      gate: name,
      pass: gate.ok === true,
      errors: gate.errors || [],
      warnings: gate.warnings || []
    };
  });
}

const gamPath = path.join(sprint38lDir, `${RUN_PREFIX}-gam.json`);
const pagePath = path.join(sprint38lDir, `${RUN_PREFIX}-design-page.json`);

if (!fs.existsSync(gamPath) || !fs.existsSync(pagePath)) {
  console.error(JSON.stringify({ error: "Missing EV-38S GAM or design-page artefacts", gamPath, pagePath }));
  process.exit(2);
}

const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
const pageRaw = JSON.parse(fs.readFileSync(pagePath, "utf8"));

let page = applyGamMaterialsToComposedPage(pageRaw, gam);
page = applyA3MaterialsSequencingToComposedPage(page);

const api = loadPrismTestApi();
const render = api.buildUtilityStructuredHtmlForTest(page, ["sections"]);
const renderHtml = String(render?.html || "");
const a3Block = extractActivityHtmlBlock(renderHtml, page, 2);

const fidelityCheck = validate38MPageFidelity(page, { gamSource: gam });
const pagePreserveCheck = validate38LPageGamPreservation(page, { gamSource: gam });
const a3SeqCheck = validateA3MaterialsSequencing(page);
const a3RenderCheck = validateA3RenderMaterialOrder(a3Block);
const fidelityMetrics = measurePageGamFidelity(page, { gamSource: gam });

const dims = api.computeProofDimensionsForTest(page, { gamSource: gam, renderHtml });
const proofOk38M = fidelityCheck.ok && pagePreserveCheck.ok;
const proofOk38N = a3SeqCheck.ok && a3RenderCheck.ok;
const proofOk = dims.proofOk;
const roleOk = dims.roleOk;
const fullOk = dims.fullOk;

let baseline38P = null;
const baseline38pPath = path.join(sprint38pDir, "EV-38P-AFTER-run-log.json");
if (fs.existsSync(baseline38pPath)) {
  baseline38P = JSON.parse(fs.readFileSync(baseline38pPath, "utf8"));
}

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-render.html`), renderHtml, "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-design-page-replay.json`), JSON.stringify(page, null, 2), "utf8");

const report = {
  capturedAt: new Date().toISOString(),
  sprint: "38-S",
  runId: RUN_PREFIX,
  phase: "38S-4",
  harnessVersion: HARNESS_VERSION,
  sourceRun: RUN_PREFIX,
  replayMode: "38S-full-pipeline-artefact-replay",
  proofOk,
  roleOk,
  fullOk,
  validation38M: {
    ok: fidelityCheck.ok,
    errors: fidelityCheck.errors,
    warnings: fidelityCheck.warnings
  },
  validation38LRegression: {
    ok: pagePreserveCheck.ok,
    errors: pagePreserveCheck.errors
  },
  validation38P: {
    ok: dims.validation38P?.ok,
    errors: dims.validation38P?.errors || [],
    warnings: dims.validation38P?.warnings || []
  },
  rfGates: gateReport(dims.validation38P),
  a3Sequencing: {
    pageJson: { ok: a3SeqCheck.ok, errors: a3SeqCheck.errors },
    render: { ok: a3RenderCheck.ok, errors: a3RenderCheck.errors }
  },
  proofDimensions38M38N: {
    bodyFidelity38M: proofOk38M,
    a3Sequencing38N: proofOk38N
  },
  baselineComparison: baseline38P
    ? {
        source38P: "EV-38P-AFTER",
        priorFullOk: baseline38P.fullOk,
        priorProofOk: baseline38P.proofOk,
        priorRoleOk: baseline38P.roleOk,
        fullOkUnchanged: baseline38P.fullOk === fullOk
      }
    : null
};

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-run-log.json`), JSON.stringify(report, null, 2), "utf8");

console.log(
  JSON.stringify(
    {
      proofOk,
      roleOk,
      fullOk,
      rfFailed: report.rfGates.filter((g) => !g.pass).map((g) => g.gate),
      validation38M: fidelityCheck.errors.slice(0, 5)
    },
    null,
    2
  )
);
process.exit(fullOk ? 0 : 1);

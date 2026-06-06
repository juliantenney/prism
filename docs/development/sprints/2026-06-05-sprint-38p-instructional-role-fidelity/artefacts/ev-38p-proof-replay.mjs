/**
 * Sprint 38-P — Proof replay on EV-38M-AFTER artefacts (38P-6).
 * Run: node docs/development/sprints/2026-06-05-sprint-38p-instructional-role-fidelity/artefacts/ev-38p-proof-replay.mjs
 *
 * Re-applies 38M merge + 38P role precedence render + dual validation (proofOk + roleOk).
 * No LLM pipeline — replays frozen 38M capture through post-38P codebase.
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
const sprint38nDir = path.resolve(__dirname, "../../2026-06-05-sprint-38n-page-fidelity-hardening/artefacts");
const outDir = __dirname;
const RUN_PREFIX = "EV-38P-AFTER";
const HARNESS_VERSION = "38P-6";
const SOURCE_RUN = "EV-38M-AFTER";

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

function extractA3HtmlBlock(html, page) {
  return extractActivityHtmlBlock(html, page, 2);
}

function extractA4HtmlBlock(html, page) {
  return extractActivityHtmlBlock(html, page, 3);
}

function loadPrismTestApi() {
  const libs = [
    "sprint38-visual-affordances.js",
    "design-page-materials-fidelity.js",
    "page-gam-materials-preserve.js",
    "page-role-registry.js",
    "page-role-render-sequencing.js",
    "page-role-fidelity.js",
    "page-a3-materials-sequencing.js"
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

function aggregateRatios(metrics) {
  const byActivity = {};
  (metrics || []).forEach((m) => {
    const aid = String(m.activity_id || "");
    if (!byActivity[aid]) byActivity[aid] = { ratios: [], count: 0 };
    byActivity[aid].ratios.push(Number(m.ratio) || 0);
    byActivity[aid].count += 1;
  });
  return Object.keys(byActivity).sort().map((aid) => {
    const rows = byActivity[aid].ratios;
    const avg = rows.length ? Math.round(rows.reduce((a, b) => a + b, 0) / rows.length) : 0;
    return { activity_id: aid, material_count: rows.length, aggregate_ratio_pct: avg };
  });
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

const gamPath = path.join(sprint38mDir, `${SOURCE_RUN}-gam.json`);
const pagePath = path.join(sprint38mDir, `${SOURCE_RUN}-design-page.json`);
const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
const pageRaw = JSON.parse(fs.readFileSync(pagePath, "utf8"));

let page = applyGamMaterialsToComposedPage(pageRaw, gam);
page = applyA3MaterialsSequencingToComposedPage(page);

const api = loadPrismTestApi();
const render = api.buildUtilityStructuredHtmlForTest(page, ["sections"]);
const renderHtml = String(render?.html || "");
const a3Block = extractA3HtmlBlock(renderHtml, page);
const a4Block = extractA4HtmlBlock(renderHtml, page);

const fidelityCheck = validate38MPageFidelity(page, { gamSource: gam });
const pagePreserveCheck = validate38LPageGamPreservation(page, { gamSource: gam });
const a3SeqCheck = validateA3MaterialsSequencing(page);
const a3RenderCheck = validateA3RenderMaterialOrder(a3Block);
const fidelityMetrics = measurePageGamFidelity(page, { gamSource: gam });

const dims = api.computeProofDimensionsForTest(page, { gamSource: gam, renderHtml });
const roleMeasure = api.measureRoleFidelityForTest(page, { gamSource: gam, renderHtml });

const proofOk38M = fidelityCheck.ok && pagePreserveCheck.ok;
const proofOk38N = a3SeqCheck.ok && a3RenderCheck.ok;
const proofOk = dims.proofOk;
const roleOk = dims.roleOk;
const fullOk = dims.fullOk;

let baseline38N = null;
const baseline38nPath = path.join(sprint38nDir, "EV-38N-AFTER-run-log.json");
if (fs.existsSync(baseline38nPath)) {
  baseline38N = JSON.parse(fs.readFileSync(baseline38nPath, "utf8"));
}

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-render.html`), renderHtml, "utf8");
fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-design-page.json`), JSON.stringify(page, null, 2), "utf8");
fs.copyFileSync(gamPath, path.join(outDir, `${RUN_PREFIX}-gam.json`));

const report = {
  capturedAt: new Date().toISOString(),
  sprint: "38-P",
  runId: RUN_PREFIX,
  phase: "38P-6",
  harnessVersion: HARNESS_VERSION,
  sourceRun: SOURCE_RUN,
  replayMode: "artefact-replay-merge-render-dual-validation",
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
    warnings: dims.validation38P?.warnings || [],
    passed: dims.validation38P?.passed || [],
    failed: dims.validation38P?.failed || []
  },
  rfGates: gateReport(dims.validation38P),
  a3Sequencing: {
    pageJson: { ok: a3SeqCheck.ok, errors: a3SeqCheck.errors },
    render: { ok: a3RenderCheck.ok, errors: a3RenderCheck.errors, positions: a3RenderCheck.positions }
  },
  a4RoleSequencing: {
    renderHtmlLength: a4Block.length,
    headingsSample: (a4Block.match(/<h4[^>]*>[^<]+<\/h4>/gi) || []).slice(0, 12)
  },
  proofDimensions38M38N: {
    bodyFidelity38M: proofOk38M,
    a3Sequencing38N: proofOk38N,
    antiSynopsis: !fidelityCheck.errors.some((e) => /synopsis|anti-synopsis/i.test(String(e))),
    antiTableShell: !fidelityCheck.errors.some((e) => /table.?shell|empty.?table/i.test(String(e))),
    renderOrderA3: a3RenderCheck.ok
  },
  fidelityMetricsSummary: fidelityMetrics.map((m) => ({
    activity_id: m.activity_id,
    material_id: m.material_id,
    ratio: m.ratio,
    markersMissing: m.markersMissing,
    substantive: m.substantive
  })),
  aggregateGamToPageRatio: aggregateRatios(fidelityMetrics),
  roleCoverage: roleMeasure?.coverage || null,
  roleSupersession: roleMeasure?.supersession || null,
  baselineComparison: baseline38N
    ? {
        source38N: "EV-38N-AFTER",
        proofOkUnchanged: baseline38N.proofOk === proofOk,
        prior38NProofOk: baseline38N.proofOk,
        prior38NRoleOk: null
      }
    : null,
  comparators: [SOURCE_RUN, "EV-38N-AFTER", "38I-4-A4-episode"]
};

fs.writeFileSync(path.join(outDir, `${RUN_PREFIX}-run-log.json`), JSON.stringify(report, null, 2), "utf8");

console.log(
  JSON.stringify(
    {
      proofOk,
      roleOk,
      fullOk,
      rfFailed: report.rfGates.filter((g) => !g.pass).map((g) => g.gate),
      a3Render: a3RenderCheck.errors,
      validation38M: fidelityCheck.errors
    },
    null,
    2
  )
);
process.exit(fullOk ? 0 : 1);

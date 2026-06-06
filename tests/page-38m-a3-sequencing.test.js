/**
 * Sprint 38-M — A3 Analyse materials sequencing fidelity.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const sprint38lArtefacts = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts"
);
const gamPath = path.join(sprint38lArtefacts, "EV-38L-AFTER-gam.json");
const pagePath = path.join(sprint38lArtefacts, "EV-38L-AFTER-design-page.json");

const {
  applyGamMaterialsToComposedPage,
  validate38MPageFidelity
} = require(path.join(repoRoot, "lib/page-gam-materials-preserve.js"));

const {
  A3_ANALYSE_MATERIALS_ORDER,
  applyA3MaterialsSequencingToComposedPage,
  validateA3MaterialsSequencing,
  validateA3RenderMaterialOrder
} = require(path.join(repoRoot, "lib/page-a3-materials-sequencing.js"));

function activityRow(page, index) {
  const section = (page.sections || []).find(
    (s) =>
      String(s.section_id || "").toLowerCase() === "learning_activities" ||
      /learning activit/i.test(String(s.heading || ""))
  );
  const rows = Array.isArray(section?.content) ? section.content : [];
  return rows[index] || null;
}

function activityMaterials(page, index) {
  return activityRow(page, index)?.materials || {};
}

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
    "sprint38-visual-affordances.js",
    "design-page-materials-fidelity.js",
    "page-gam-materials-preserve.js",
    "page-role-registry.js",
    "page-role-render-sequencing.js",
    "page-a3-materials-sequencing.js"
  ];
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
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function composeFullPage(gam, page) {
  const merged = applyGamMaterialsToComposedPage(page, gam);
  return applyA3MaterialsSequencingToComposedPage(merged, {});
}

test("38M-4 A3 sequencing sets materials_order and reorders materials keys", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const composed = composeFullPage(gam, page);
  const a3 = activityRow(composed, 2);

  assert.deepEqual(a3.materials_order, A3_ANALYSE_MATERIALS_ORDER);
  assert.equal(Object.keys(a3.materials)[0], "worked_analytic_pass");
  assert.equal(Object.keys(a3.materials)[1], "analysis_table");
  assert.equal(Object.keys(a3.materials)[2], "scenario_maya_households");
  assert.equal(Object.keys(a3.materials)[3], "checklist");
  assert.equal(composed.metadata?.a3_materials_sequencing_applied, true);

  const seqCheck = validateA3MaterialsSequencing(composed);
  assert.equal(seqCheck.ok, true, seqCheck.errors.join("; "));
});

test("38M-4 A3 sequencing preserves 100% body fidelity", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const rawA3 = activityMaterials(page, 2);
  const composed = composeFullPage(gam, page);
  const a3 = activityMaterials(composed, 2);

  assert.equal(a3.worked_analytic_pass, rawA3.worked_analytic_pass);
  assert.equal(a3.analysis_table, rawA3.analysis_table);
  assert.equal(a3.scenario_maya_households, rawA3.scenario_maya_households);
  assert.equal(a3.checklist, rawA3.checklist);
});

test("38M-4 A3 render order follows materials_order on composed page", () => {
  const api = loadPrismTestApi();
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const composed = composeFullPage(gam, page);

  const html = String(api.buildUtilityStructuredHtmlForTest(composed).html || "");
  const a3Title = "Analysing Inflation Effects on Household Budgets";
  const a3Start = html.indexOf(a3Title);
  const a4Start = html.indexOf("Evaluating Household Strategies for Inflation Management");
  const a3Block = html.substring(a3Start, a4Start);

  const renderCheck = validateA3RenderMaterialOrder(a3Block);
  assert.equal(renderCheck.ok, true, renderCheck.errors.join("; "));

  const h4Re = /<h4[^>]*util-material-heading[^>]*>([\s\S]*?)<\/h4>/gi;
  const headings = [];
  let hm;
  while ((hm = h4Re.exec(a3Block)) !== null) {
    headings.push({
      pos: hm.index,
      text: hm[1].replace(/<[^>]+>/g, "").trim()
    });
  }
  const workedPos = headings.find((h) => /Worked analytic pass/i.test(h.text))?.pos ?? -1;
  const tablePos = headings.find((h) => /^Worksheet$/i.test(h.text))?.pos ?? -1;
  const scenarioPos = headings.find((h) => /Scenario Maya households/i.test(h.text))?.pos ?? -1;
  const checklistPos = headings.find((h) => /^Checklist$/i.test(h.text))?.pos ?? -1;

  assert.ok(workedPos >= 0 && tablePos > workedPos, "worked pass before table");
  assert.ok(scenarioPos > tablePos, "table before scenario");
  assert.ok(checklistPos > scenarioPos, "scenario before checklist");
});

test("38M-4 compose path applies A3 sequencing after GAM preserve", () => {
  const api = loadPrismTestApi();
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));

  const next = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamActivityMaterials: gam.activities
  });

  const a3 = activityRow(next, 2);
  assert.ok(Array.isArray(a3.materials_order));
  assert.equal(a3.materials_order.length, A3_ANALYSE_MATERIALS_ORDER.length);
  A3_ANALYSE_MATERIALS_ORDER.forEach((key, index) => {
    assert.equal(a3.materials_order[index], key);
  });
  assert.equal(next.metadata?.a3_materials_sequencing_applied, true);
  assert.equal(next.metadata?.gam_materials_preserve_applied, true);
});

test("38M-4 no A4 regression — validate38M still passes after full compose", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const composed = composeFullPage(gam, page);

  const check = validate38MPageFidelity(composed, { gamSource: gam });
  assert.equal(check.ok, true, check.errors.join("; "));

  const a4Mats = activityMaterials(composed, 3);
  assert.match(String(a4Mats.scenario_maya_strategy_menu), /Strategy A: Budget Tightening/);
  assert.doesNotMatch(String(a4Mats.guided_judgement_table), /Partial example/);
});

test("38M-4 A4 activity does not receive A3 materials_order", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const composed = composeFullPage(gam, page);
  const a4 = activityRow(composed, 3);
  assert.equal(a4.materials_order, undefined);
});

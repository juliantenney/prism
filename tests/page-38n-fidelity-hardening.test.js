/**
 * Sprint 38-N — Page fidelity hardening (R1 marker generalisation, R2 render order, R3 schema alignment).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const sprint38mArtefacts = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-05-sprint-38m-page-composition-fidelity/artefacts"
);
const gamPath = path.join(sprint38mArtefacts, "EV-38M-AFTER-gam.json");
const pagePath = path.join(sprint38mArtefacts, "EV-38M-AFTER-design-page.json");

const {
  validate38MPageFidelity,
  validate38LPageGamPreservation,
  pageMaterialText,
  semanticMarkerSatisfied,
  hasGuidedTableExemplar,
  evaluateMaterialMarkers
} = require(path.join(repoRoot, "lib/page-gam-materials-preserve.js"));

const { validateA3RenderMaterialOrder } = require(path.join(
  repoRoot,
  "lib/page-a3-materials-sequencing.js"
));

function activityRow(page, index) {
  const section = (page.sections || []).find(
    (s) =>
      String(s.section_id || "").toLowerCase() === "learning_activities" ||
      /learning activit/i.test(String(s.heading || ""))
  );
  const rows = Array.isArray(section?.content) ? section.content : [];
  return rows[index] || null;
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

test("38N R1 — semantic markers accept fresh GAM phrasing on EV-38M-AFTER A4", () => {
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const a4 = activityRow(page, 3);
  const worked = pageMaterialText(a4.materials, "worked_judgement_weak_strong");
  const guided = pageMaterialText(a4.materials, "guided_judgement_table");
  const scenario = pageMaterialText(a4.materials, "scenario_maya_strategy_menu");

  assert.match(worked, /Weak Judgement \(Slogan-style\)/i);
  assert.match(worked, /Strong Judgement \(Criteria-led\)/i);
  assert.ok(semanticMarkerSatisfied("weak_worked_judgement", worked));
  assert.ok(semanticMarkerSatisfied("strong_worked_judgement", worked));

  const workedMarkers = evaluateMaterialMarkers(worked, [
    "weak_worked_judgement",
    "strong_worked_judgement"
  ]);
  assert.deepEqual(workedMarkers.missing, []);

  assert.ok(hasGuidedTableExemplar(guided));
  const guidedMarkers = evaluateMaterialMarkers(guided, ["guided_table_exemplar"]);
  assert.deepEqual(guidedMarkers.missing, []);

  assert.ok(semanticMarkerSatisfied("strategy_a", scenario));
  assert.ok(semanticMarkerSatisfied("strategy_e", scenario));
});

test("38N R3 — pageMaterialText resolves scenarios[] and alias keys on EV-38M-AFTER", () => {
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const a4 = activityRow(page, 3);
  const a3 = activityRow(page, 2);

  const scenarioFromArray = pageMaterialText(a4.materials, "scenario_maya_strategy_menu");
  assert.ok(scenarioFromArray.length > 400);
  assert.match(scenarioFromArray, /Strategy A:/i);

  const workedAlias = pageMaterialText(a4.materials, "worked_judgement_weak_strong");
  assert.ok(workedAlias.length > 400);

  const a3Scenario = pageMaterialText(a3.materials, "scenario_maya_households");
  assert.ok(a3Scenario.length > 200);
  assert.match(a3Scenario, /Fixed Income/i);
});

test("38N R1+R3 — validate38M and 38L regression pass on EV-38M-AFTER replay", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));

  const check38M = validate38MPageFidelity(page, { gamSource: gam });
  assert.equal(check38M.ok, true, check38M.errors.join("; "));

  const check38L = validate38LPageGamPreservation(page, { gamSource: gam });
  assert.equal(check38L.ok, true, check38L.errors.join("; "));
});

test("38N R2 — A3 render order honours materials_order with alias keys present", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const a3 = activityRow(page, 2);

  assert.ok(Array.isArray(a3.materials_order));
  assert.ok(a3.materials.worked_example);
  assert.ok(a3.materials.scenarios);
  assert.ok(a3.materials.evaluation_checklist);

  const html = String(api.buildUtilityStructuredHtmlForTest(page).html || "");
  const a3Block = extractA3HtmlBlock(html, page);
  const renderCheck = validateA3RenderMaterialOrder(a3Block);
  assert.equal(renderCheck.ok, true, renderCheck.errors.join("; "));
});

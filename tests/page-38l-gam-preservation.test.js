/**
 * Sprint 38-L — GAM → Design Page materials preservation (L4 compose merge).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const sprintArtefacts = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts"
);
const gamPath = path.join(sprintArtefacts, "EV-38L-AFTER-gam.json");
const pagePath = path.join(sprintArtefacts, "EV-38L-AFTER-design-page.json");

const {
  applyGamMaterialsToComposedPage,
  validate38LPageGamPreservation
} = require(path.join(repoRoot, "lib/page-gam-materials-preserve.js"));

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
    "page-gam-materials-preserve.js"
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

function activityMaterials(page, index) {
  const section = (page.sections || []).find(
    (s) =>
      String(s.section_id || "").toLowerCase() === "learning_activities" ||
      /learning activit/i.test(String(s.heading || ""))
  );
  const rows = Array.isArray(section?.content) ? section.content : [];
  return rows[index]?.materials || {};
}

test("38L page preservation validator fails on thinned EV-38L design-page before GAM merge", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const pre = validate38LPageGamPreservation(page, { gamSource: gam });
  assert.equal(pre.ok, false);
  assert.ok(pre.errors.some((e) => /A4: missing substantive worked example/i.test(e)));
  assert.ok(pre.errors.some((e) => /A4: missing substantive scenario/i.test(e)));
});

test("38L page preservation merge restores thinned A4 GAM bodies from EV-38L artefacts", () => {
  assert.ok(fs.existsSync(gamPath), "EV-38L-AFTER-gam.json required");
  assert.ok(fs.existsSync(pagePath), "EV-38L-AFTER-design-page.json required");

  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);

  assert.equal(merged.metadata?.gam_materials_preserve_applied, true);
  assert.ok((merged.metadata?.gam_materials_preserve_rows || 0) >= 4);

  const a4 = activityMaterials(merged, 3);
  assert.match(
    String(a4.scenario_maya_strategy_menu || a4.scenario || ""),
    /Strategy A: Budget Tightening/
  );
  assert.match(
    String(a4.worked_judgement_weak_strong || a4.worked_example || ""),
    /Weak Evaluation Example/
  );
  assert.match(String(a4.transfer_prompt_evaluate || a4.transfer_prompt || ""), /at least 80 words/);

  const check = validate38LPageGamPreservation(merged, { gamSource: gam });
  assert.equal(check.ok, true, check.errors.join("; "));
});

test("38L page preservation validator requires checklist on A1–A4 and A3 worked analytic pass", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);

  [0, 1, 2, 3].forEach((i) => {
    const mats = activityMaterials(merged, i);
    const hasChecklist = Object.keys(mats).some((k) => /checklist/i.test(k) && String(mats[k]).length > 80);
    assert.ok(hasChecklist, `A${i + 1} checklist`);
  });

  const a3 = activityMaterials(merged, 2);
  assert.ok(
    String(a3.worked_analytic_pass || "").length > 400,
    "A3 worked analytic pass body preserved"
  );
});

test("applyPedagogicCognitionSemanticsToComposedPage applies GAM preserve when upstreamActivityMaterials passed", () => {
  const api = loadPrismTestApi();
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));

  const next = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamActivityMaterials: gam.activities
  });

  const check = api.validate38LPageGamPreservationForTest(next, { gamSource: gam });
  assert.equal(check.ok, true, check.errors.join("; "));
});

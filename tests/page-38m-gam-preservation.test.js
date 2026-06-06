/**
 * Sprint 38-M — GAM → Page A4 Evaluate fidelity (38M-2 preservation model).
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
  validate38MPageFidelity,
  measurePageGamFidelity,
  isSynopsisOrShell,
  tableShellCollapse,
  mergeMaterialsFromGamList
} = require(path.join(repoRoot, "lib/page-gam-materials-preserve.js"));

function activityMaterials(page, index) {
  const section = (page.sections || []).find(
    (s) =>
      String(s.section_id || "").toLowerCase() === "learning_activities" ||
      /learning activit/i.test(String(s.heading || ""))
  );
  const rows = Array.isArray(section?.content) ? section.content : [];
  return rows[index]?.materials || {};
}

function gamA4Materials(gam) {
  return gam.activities[3].materials;
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

test("38M synopsis detector flags EV-38L thinned A4 scenario and worked judgement", () => {
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const a4 = activityMaterials(page, 3);
  const scenarioSpec = {
    tier: "A",
    markers: ["Strategy A:", "Strategy E:"]
  };
  assert.equal(
    isSynopsisOrShell(
      a4.scenario_maya_strategy_menu,
      "",
      "scenario_maya_strategy_menu",
      scenarioSpec
    ),
    true
  );
  assert.match(String(a4.worked_judgement_weak_strong), /This note shows stepwise reasoning/i);
  assert.equal(
    isSynopsisOrShell(
      a4.worked_judgement_weak_strong,
      "",
      "worked_judgement_weak_strong",
      { tier: "A", markers: ["Weak Evaluation Example", "Strong Evaluation Example"] }
    ),
    true
  );
  assert.equal(tableShellCollapse(a4.guided_judgement_table, "guided_judgement_table"), true);
});

test("38M validate38MPageFidelity fails on raw EV-38L design-page before merge", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const pre = validate38MPageFidelity(page, { gamSource: gam });
  assert.equal(pre.ok, false);
  assert.ok(pre.errors.some((e) => /G1:/.test(e)));
  assert.ok(pre.errors.some((e) => /G2:/.test(e)));
  assert.ok(pre.errors.some((e) => /G3:/.test(e)));
  assert.ok(pre.errors.some((e) => /G5:/.test(e)));
  assert.ok(pre.errors.some((e) => /G9:/.test(e)));
});

test("38M merge restores Tier-A A4 materials to ≥90% GAM parity on EV-38L artefacts", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const a4Gam = gamA4Materials(gam);
  const a4 = activityMaterials(merged, 3);

  const m12 = a4Gam.find((m) => m.material_id === "M12_Scenario_Maya_Strategy_Menu");
  const m14 = a4Gam.find((m) => m.material_id === "M14_Worked_Judgement_Weak_Strong");
  const m15 = a4Gam.find((m) => m.material_id === "M15_Guided_Judgement_Table");
  const m18 = a4Gam.find((m) => m.material_id === "M18_Transfer_Prompt_Evaluate");

  const scenarioLen = String(a4.scenario_maya_strategy_menu || "").length;
  const workedLen = String(a4.worked_judgement_weak_strong || "").length;
  const guidedLen = String(a4.guided_judgement_table || "").length;
  const transferLen = String(a4.transfer_prompt_evaluate || "").length;

  assert.ok(scenarioLen >= m12.contentLen * 0.9, `M12 ratio ${scenarioLen}/${m12.contentLen}`);
  assert.ok(workedLen >= m14.contentLen * 0.9, `M14 ratio ${workedLen}/${m14.contentLen}`);
  assert.ok(guidedLen >= m15.contentLen * 0.9, `M15 ratio ${guidedLen}/${m15.contentLen}`);
  assert.ok(transferLen >= m18.contentLen * 0.8, `M18 ratio ${transferLen}/${m18.contentLen}`);

  assert.match(String(a4.scenario_maya_strategy_menu), /Strategy A: Budget Tightening/);
  assert.match(String(a4.worked_judgement_weak_strong), /Weak Evaluation Example/);
  assert.match(String(a4.worked_judgement_weak_strong), /Strong Evaluation Example/);
  assert.match(String(a4.guided_judgement_table), /Budget Tightening/);
  assert.doesNotMatch(String(a4.guided_judgement_table), /Partial example/);
  assert.match(String(a4.transfer_prompt_evaluate), /at least 80 words/);

  assert.equal(merged.metadata?.gam_materials_preserve_schema, "38M-2");
});

test("38M validate38MPageFidelity passes after merge with no A3 regression", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);

  const check = validate38MPageFidelity(merged, { gamSource: gam });
  assert.equal(check.ok, true, check.errors.join("; "));

  const a3Metrics = check.metrics.filter((m) =>
    ["M8_Worked_Analytic_Pass_Household_Inflation", "M9_Scenario_Maya_Households", "M10_Analysis_Table_Household_Comparison", "M11_Checklist_Analyse"].includes(
      m.material_id
    )
  );
  a3Metrics.forEach((m) => {
    if (m.material_id === "M11_Checklist_Analyse") return;
    assert.ok(m.ratio >= 99, `A3 ${m.material_id} ratio ${m.ratio}%`);
  });
});

test("38M measurePageGamFidelity reports loss types on pre-merge page", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const metrics = measurePageGamFidelity(page, { gamSource: gam });

  const m14 = metrics.find((m) => m.material_id === "M14_Worked_Judgement_Weak_Strong");
  const m15 = metrics.find((m) => m.material_id === "M15_Guided_Judgement_Table");
  assert.equal(m14.lossType, "synopsis_replacement");
  assert.equal(m15.lossType, "table_shell_collapse");
  assert.equal(m14.substantive, false);
});

test("applyPedagogicCognitionSemanticsToComposedPage passes validate38M when upstream GAM provided", () => {
  const api = loadPrismTestApi();
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));

  const next = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamActivityMaterials: gam.activities
  });

  const check = api.validate38MPageFidelityForTest(next, { gamSource: gam });
  assert.equal(check.ok, true, check.errors.join("; "));
});

test("38M mergeMaterialsFromGamList preserves exact GAM body for capstone fields", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const thinned = activityMaterials(page, 3);
  const merged = mergeMaterialsFromGamList(thinned, gamA4Materials(gam));

  const m14 = gamA4Materials(gam).find((m) => m.material_id === "M14_Worked_Judgement_Weak_Strong");
  assert.equal(merged.worked_judgement_weak_strong, m14.content);
});

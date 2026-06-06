/**
 * Sprint 38-P — Render role precedence (material_role_index consumer).
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
  applyGamMaterialsToComposedPage,
  validate38MPageFidelity
} = require(path.join(repoRoot, "lib/page-gam-materials-preserve.js"));

const {
  applyA3MaterialsSequencingToComposedPage,
  validateA3RenderMaterialOrder
} = require(path.join(repoRoot, "lib/page-a3-materials-sequencing.js"));

const roleRender = require(path.join(repoRoot, "lib/page-role-render-sequencing.js"));

function activityRow(page, index) {
  const section = (page.sections || []).find(
    (s) =>
      String(s.section_id || "").toLowerCase() === "learning_activities" ||
      /learning activit/i.test(String(s.heading || ""))
  );
  const rows = Array.isArray(section?.content) ? section.content : [];
  return rows[index] || null;
}

function findActivityTitles(page) {
  const titles = { a3: "", a4: "" };
  const section = (page?.sections || []).find((s) =>
    /learning.?activit/i.test(String(s.section_id || s.heading || ""))
  );
  const list = Array.isArray(section?.content) ? section.content : [];
  list.forEach((row) => {
    const id = String(row.activity_id || "");
    const title = String(row.title || row.activity_title || "");
    if (/A3|analyse/i.test(id)) titles.a3 = title;
    if (/A4|evaluate/i.test(id)) titles.a4 = title;
  });
  return titles;
}

function extractActivityHtmlBlock(html, page, which) {
  const text = String(html || "");
  const { a3, a4 } = findActivityTitles(page);
  const title = which === "a4" ? a4 : a3;
  if (!title) return text;
  const start = text.indexOf(title);
  if (start < 0) return "";
  const nextTitle = which === "a4" ? "" : a4;
  const end = nextTitle ? text.indexOf(nextTitle, start + title.length) : text.length;
  return text.substring(start, end > start ? end : text.length);
}

function countH4Headings(html, pattern) {
  const re = /<h4[^>]*class="[^"]*util-material-heading[^"]*"[^>]*>([\s\S]*?)<\/h4>/gi;
  let count = 0;
  let m;
  while ((m = re.exec(String(html || ""))) !== null) {
    const inner = String(m[1] || "")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (pattern.test(inner)) count += 1;
  }
  return count;
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

function mergedPageWithRoleIndex() {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  let merged = applyGamMaterialsToComposedPage(page, gam);
  merged = applyA3MaterialsSequencingToComposedPage(merged);
  return { gam, merged };
}

test("38P-4 plan — A4 selects canonical keys and skips superseded stubs", () => {
  const { merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  assert.ok(roleRender.isRolePrecedenceActive(a4));

  const plan = roleRender.buildRolePrecedenceRenderPlan(a4, a4.materials);
  const keys = plan.map((p) => p.key);

  assert.ok(keys.includes("worked_judgement_weak_strong"));
  assert.ok(keys.includes("guided_judgement_table"));
  assert.ok(keys.includes("transfer_prompt_evaluate"));
  assert.ok(keys.includes("independent_judgement_template"));
  assert.equal(keys.includes("modelling_note"), false);
  assert.equal(keys.includes("decision_table"), false);
  assert.equal(keys.includes("transfer_prompt"), false);
  assert.equal(keys.includes("template"), false);
});

test("38P-4 A4 render — suppresses modelling_note stub before worked judgement", () => {
  const api = loadPrismTestApi();
  const { merged } = mergedPageWithRoleIndex();
  const html = String(api.buildUtilityStructuredHtmlForTest(merged).html || "");
  const a4Block = extractActivityHtmlBlock(html, merged, "a4");

  assert.equal(countH4Headings(a4Block, /^Modelling note$/i), 0);
  assert.ok(countH4Headings(a4Block, /Worked judgement \(weak vs strong\)/i) >= 1);
  assert.match(a4Block, /Weak Judgement \(Slogan-style\)/i);
  assert.match(a4Block, /Strong Judgement \(Criteria-led\)/i);
});

test("38P-4 A4 render — suppresses decision_table shell before guided table", () => {
  const api = loadPrismTestApi();
  const { merged } = mergedPageWithRoleIndex();
  const html = String(api.buildUtilityStructuredHtmlForTest(merged).html || "");
  const a4Block = extractActivityHtmlBlock(html, merged, "a4");

  assert.equal(countH4Headings(a4Block, /^Decision table$/i), 0);
  assert.ok(countH4Headings(a4Block, /Guided judgement table/i) >= 1);
});

test("38P-4 A4 render — suppresses transfer_prompt stub; canonical evaluate prompt shown", () => {
  const api = loadPrismTestApi();
  const { merged } = mergedPageWithRoleIndex();
  const html = String(api.buildUtilityStructuredHtmlForTest(merged).html || "");
  const a4Block = extractActivityHtmlBlock(html, merged, "a4");

  const transferHeadings = countH4Headings(a4Block, /^Transfer prompt$/i);
  assert.equal(transferHeadings, 1, "exactly one Transfer prompt heading expected");
  assert.match(a4Block, /transfer_prompt_evaluate|Transfer Prompt Evaluate|own household or context/i);
});

test("38P-4 A4 render — independent template precedence over template alias", () => {
  const api = loadPrismTestApi();
  const { merged } = mergedPageWithRoleIndex();
  const html = String(api.buildUtilityStructuredHtmlForTest(merged).html || "");
  const a4Block = extractActivityHtmlBlock(html, merged, "a4");

  assert.ok(countH4Headings(a4Block, /Independent judgement template/i) >= 1);
  assert.equal(countH4Headings(a4Block, /^Template$/i), 0);
});

test("38P-4 A4 render — no duplicate weak/strong pairs from alias keys", () => {
  const api = loadPrismTestApi();
  const { merged } = mergedPageWithRoleIndex();
  const html = String(api.buildUtilityStructuredHtmlForTest(merged).html || "");
  const a4Block = extractActivityHtmlBlock(html, merged, "a4");

  const weakStrongBlocks = (a4Block.match(/Weak Judgement \(Slogan-style\)/gi) || []).length;
  assert.equal(weakStrongBlocks, 1);
  const workedJudgementHeadings = countH4Headings(a4Block, /Worked judgement/i);
  assert.equal(workedJudgementHeadings, 1);
});

test("38P-4 A3 regression — role precedence preserves materials_order sequencing", () => {
  const api = loadPrismTestApi();
  const { merged } = mergedPageWithRoleIndex();
  const a3 = activityRow(merged, 2);

  assert.ok(roleRender.isRolePrecedenceActive(a3));
  assert.ok(Array.isArray(a3.materials_order));

  const html = String(api.buildUtilityStructuredHtmlForTest(merged).html || "");
  const a3Block = extractActivityHtmlBlock(html, merged, "a3");
  const renderCheck = validateA3RenderMaterialOrder(a3Block);
  assert.equal(renderCheck.ok, true, renderCheck.errors.join("; "));
});

test("38P-4 fallback — absent material_role_index keeps legacy render path", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const a4 = activityRow(page, 3);
  assert.equal(a4.material_role_index, undefined);

  const html = String(api.buildUtilityStructuredHtmlForTest(page).html || "");
  const a4Block = extractActivityHtmlBlock(html, page, "a4");

  assert.ok(a4Block.length > 200);
  assert.ok(
    countH4Headings(a4Block, /Modelling note|Worked judgement|Decision table|Guided judgement/i) >= 1
  );
});

test("38P-4 unresolved role — renderable orphan key still emitted when not superseded", () => {
  const api = loadPrismTestApi();
  const { merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  a4.materials.custom_orphan_slot =
    "Custom orphan learner text that should still appear when unresolved.";
  a4.material_role_index.custom_orphan_slot = {
    role_family: null,
    canonical_key: "custom_orphan_slot",
    authority: "unresolved",
    renderable: true,
    superseded_by: null
  };

  const html = String(api.buildUtilityStructuredHtmlForTest(merged).html || "");
  const a4Block = extractActivityHtmlBlock(html, merged, "a4");
  assert.match(a4Block, /Custom orphan learner text/i);
});

test("38P-4 38M body fidelity preserved on merged replay", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const check = validate38MPageFidelity(merged, { gamSource: gam });
  assert.equal(check.ok, true, check.errors.join("; "));
});

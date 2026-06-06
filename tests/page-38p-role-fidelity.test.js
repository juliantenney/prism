/**
 * Sprint 38-P — Role fidelity validation (roleOk / RF-1..RF-8).
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
  validate38MPageFidelity,
  ROLE_AUTHORITY
} = require(path.join(repoRoot, "lib/page-gam-materials-preserve.js"));

const { applyA3MaterialsSequencingToComposedPage } = require(path.join(
  repoRoot,
  "lib/page-a3-materials-sequencing.js"
));

const roleFidelity = require(path.join(repoRoot, "lib/page-role-fidelity.js"));

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
    "page-role-fidelity.js",
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
  return sandbox.window.__PRISM_TEST_API;
}

function mergedPageWithRoleIndex() {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  let merged = applyGamMaterialsToComposedPage(page, gam);
  merged = applyA3MaterialsSequencingToComposedPage(merged);
  return { gam, merged };
}

function renderPageHtml(api, page) {
  return String(api.buildUtilityStructuredHtmlForTest(page).html || "");
}

test("38P-5 A4 canonical — roleOk passes on merged page with render HTML", () => {
  const api = loadPrismTestApi();
  const { gam, merged } = mergedPageWithRoleIndex();
  const html = renderPageHtml(api, merged);

  const check = roleFidelity.validate38PRoleFidelity(merged, {
    gamSource: gam,
    renderHtml: html
  });

  assert.equal(check.roleOk, true, check.errors.join("; "));
  assert.equal(check.ok, true);
  assert.ok(check.passed.includes("RF1_role_uniqueness"));
  assert.ok(check.passed.includes("RF2_no_weak_first_render"));
  assert.ok(check.passed.includes("RF8_compose_transparency"));
});

test("38P-5 RF-2 — superseded stub heading in render fails roleOk", () => {
  const api = loadPrismTestApi();
  const { gam, merged } = mergedPageWithRoleIndex();
  const html = renderPageHtml(api, merged);
  const badHtml = html.replace(
    "Worked judgement (weak vs strong)",
    "Modelling note</span></h4><p>stub</p><h4><span>Worked judgement (weak vs strong)"
  );

  const check = roleFidelity.validate38PRoleFidelity(merged, {
    gamSource: gam,
    renderHtml: badHtml
  });

  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF2|RF3/.test(e)));
});

test("38P-5 RF-1 — duplicate authoritative role family fails", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  a4.material_role_index.transfer_prompt_evaluate_2 = {
    role_family: "transfer_prompt",
    canonical_key: "transfer_prompt_evaluate",
    authority: ROLE_AUTHORITY.CANONICAL,
    source: "gam",
    canonical: true,
    renderable: true,
    superseded_by: null
  };
  a4.materials.transfer_prompt_evaluate_2 = a4.materials.transfer_prompt_evaluate;

  const check = roleFidelity.validate38PRoleFidelity(merged, { gamSource: gam });
  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF1.*transfer_prompt/i.test(e)));
});

test("38P-5 RF-5 — role inversion on consolidation fails", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  if (a4.materials.consolidation_summary) {
    a4.materials.consolidation_summary =
      "Write a 200-word reflection explaining your household inflation strategy.";
  }

  const check = roleFidelity.validate38PRoleFidelity(merged, { gamSource: gam });
  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF5/.test(e)));
});

test("38P-5 RF-6 — wrong render sequence fails", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const a4Title = activityRow(merged, 3).title;
  const fakeA4Html =
    `<h3>${a4Title}</h3><div class="util-materials-stack">` +
    '<h4 class="util-material-heading"><span>Scenario</span></h4><p>s</p>' +
    '<h4 class="util-material-heading"><span>Guided judgement table</span></h4><p>g</p>' +
    '<h4 class="util-material-heading"><span>Worked judgement (weak vs strong)</span></h4><p>w</p>' +
    "</div>";

  const check = roleFidelity.validate38PRoleFidelity(merged, {
    gamSource: gam,
    renderHtml: { 3: fakeA4Html }
  });
  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF6/.test(e)));
});

test("38P-5 unresolved role — renderable orphan does not break RF-1", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  a4.materials.custom_orphan_slot = "Custom orphan slot text for unresolved role coverage test.";
  a4.material_role_index.custom_orphan_slot = {
    role_family: null,
    canonical_key: "custom_orphan_slot",
    authority: ROLE_AUTHORITY.UNRESOLVED,
    source: "compose",
    canonical: false,
    renderable: true,
    superseded_by: null
  };

  const check = roleFidelity.validate38PRoleFidelity(merged, { gamSource: gam });
  assert.equal(check.gates.RF1_role_uniqueness.ok, true, check.errors.join("; "));
});

test("38P-5 RF-7 — missing pedagogical markers on canonical body fails", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  a4.materials.worked_judgement_weak_strong = "Short synopsis without weak or strong markers.";

  const check = roleFidelity.validate38PRoleFidelity(merged, { gamSource: gam });
  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF4|RF7/.test(e)));
});

test("38P-5 RF-8 — missing material_role_index fails", () => {
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const check = roleFidelity.validate38PRoleFidelity(page, { gamSource: JSON.parse(fs.readFileSync(gamPath, "utf8")) });
  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF8/.test(e)));
});

test("38P-5 diagnostics — measureRoleFidelity and measureRoleCoverage", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const coverage = roleFidelity.measureRoleCoverage(merged);
  assert.ok(coverage.totals.canonical > 0);
  assert.ok(coverage.totals.superseded > 0);
  assert.ok(coverage.activities[3].superseded.some((s) => s.key === "modelling_note"));

  const report = roleFidelity.measureRoleFidelity(merged, { gamSource: gam });
  assert.equal(typeof report.roleOk, "boolean");
  assert.ok(report.coverage);
  assert.ok(report.supersession);
});

test("38P-5 harness — proofOk and roleOk reported independently", () => {
  const api = loadPrismTestApi();
  const { gam, merged } = mergedPageWithRoleIndex();
  const html = renderPageHtml(api, merged);

  const dims = api.computeProofDimensionsForTest(merged, { gamSource: gam, renderHtml: html });
  assert.equal(typeof dims.proofOk, "boolean");
  assert.equal(typeof dims.roleOk, "boolean");
  assert.equal(dims.fullOk, dims.proofOk && dims.roleOk);
  assert.ok(dims.validation38M);
  assert.ok(dims.validation38P);

  const proofOnly = validate38MPageFidelity(merged, { gamSource: gam });
  assert.equal(proofOnly.ok, dims.proofOk, "proofOk must match unchanged 38M validator");
});

test("38P-5 harness API — validate38PRoleFidelityForTest available", () => {
  const api = loadPrismTestApi();
  const { gam, merged } = mergedPageWithRoleIndex();
  const html = renderPageHtml(api, merged);
  const check = api.validate38PRoleFidelityForTest(merged, { gamSource: gam, renderHtml: html });
  assert.equal(check.roleOk, true, check.errors.join("; "));
});

/**
 * Sprint 58 Phase 1B — vNext page assembly tests.
 * Sprint 58 Phase 1A — partial workflow gate tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS, injectLearnerRendererVNextInSandbox, wirePageVnextAssembleForTests, renderUtilityPageHtmlForTest } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");
const assemble = require(path.join(repoRoot, "lib", "page-vnext-assemble.js"));

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

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
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
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
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat(["lib/page-vnext-assemble.js"])
  );
  wirePageVnextAssembleForTests(windowStub, repoRoot);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

const epShell = loadFixture("ep-shell.json");
const dlaPartial = loadFixture("dla-partial.json");
const gamPartial = loadFixture("gam-partial.json");
const lsPartial = loadFixture("ls-partial.json");
const dpPartial = loadFixture("dp-partial.json");
const daPartial = loadFixture("assessment-design-partial.json");
const gaiPartial = loadFixture("assessment-items-partial.json");
const gamUnknownPartial = loadFixture("gam-unknown-activity-partial.json");
const dpPartialWithVa = loadFixture("dp-partial-with-va.json");

test("EP shell only assembles", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.title, "Inflation Workshop");
  assert.equal(result.page.activities.length, 2);
  assert.equal(result.page.assembly_state.current_stage, "episode_plan");
  assert.deepEqual(result.page.assembly_state.enriched_by, ["episode_plan"]);
});

test("EP + DLA overlays activities by activity_id", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dlaPartial
  });
  assert.equal(result.ok, true);
  const a1 = result.page.activities.find((row) => row.activity_id === "A1");
  assert.ok(a1);
  assert.equal(a1.learner_task, "Compare inflation drivers using evidence.");
  assert.equal(a1.title, "Map inflation cause chains");
  assert.equal(a1.episode_plan.archetype, "understand");
  assert.equal(result.page.assembly_state.current_stage, "dla");
  assert.deepEqual(result.page.assembly_state.enriched_by, ["episode_plan", "dla"]);
});

test("DLA episode_plan overwrite is ignored; canonical EP beats preserved", () => {
  const dlaAttack = JSON.parse(JSON.stringify(dlaPartial));
  dlaAttack.activities[0].episode_plan = {
    archetype: "understand",
    beats: [{ function: "consolidation" }]
  };
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dlaAttack
  });
  assert.equal(result.ok, true);
  const a1 = result.page.activities.find((row) => row.activity_id === "A1");
  assert.equal(a1.episode_plan.archetype, "understand");
  assert.deepEqual(
    a1.episode_plan.beats.map((b) => b.function),
    epShell.activities[0].episode_plan.beats.map((b) => b.function)
  );
  assert.ok(
    (result.diagnostics || []).some(
      (row) => row.code === "DOWNSTREAM_EPISODE_PLAN_OVERWRITE_IGNORED"
    )
  );
});

test("EP + DLA + GAM attaches materials and preserves DLA fields", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dlaPartial,
    gam: gamPartial
  });
  assert.equal(result.ok, true);
  const a1 = result.page.activities.find((row) => row.activity_id === "A1");
  assert.ok(a1);
  assert.equal(a1.learner_task, "Compare inflation drivers using evidence.");
  assert.equal(a1.reasoning_orientation, "Link cause to effect.");
  assert.equal(Array.isArray(a1.required_materials), true);
  assert.equal(a1.required_materials.length, 1);
  assert.equal(a1.required_materials[0].material_id, "A1-M1");
  assert.equal(a1.materials.length, 1);
  assert.equal(a1.materials[0].material_id, "A1-M1");
  assert.match(String(a1.materials[0].body), /Demand-pull/);
  assert.equal(result.page.assembly_state.current_stage, "gam");
});

test("unknown GAM activity_id throws", () => {
  assert.throws(
    () =>
      assemble.assembleVNextPageFromPartials({
        episode_plan: epShell,
        dla: dlaPartial,
        gam: gamUnknownPartial
      }),
    /Unknown activity_id in gam partial: A9/
  );
});

test("EP + LS sets learning_sequence", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    learning_sequence: lsPartial
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.learning_sequence.sequence_title, "Inflation workshop flow");
  assert.deepEqual(result.page.learning_sequence.ordered_activity_ids, ["A1", "A2"]);
  assert.equal(result.page.assembly_state.current_stage, "learning_sequence");
});

test("LS timeline durations project onto activities when activity duration is absent", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dlaPartial,
    learning_sequence: lsPartial
  });
  assert.equal(result.ok, true);
  const a1 = result.page.activities.find((row) => row.activity_id === "A1");
  const a2 = result.page.activities.find((row) => row.activity_id === "A2");
  assert.equal(a1.duration_minutes, 25);
  assert.equal(a2.duration_minutes, 35);
  assert.equal(a1.grouping, undefined);
  assert.equal(a2.grouping, undefined);
});

test("explicit activity duration_minutes wins over LS timeline projection", () => {
  const dla = JSON.parse(JSON.stringify(dlaPartial));
  dla.activities[0].duration_minutes = 99;
  const ls = JSON.parse(JSON.stringify(lsPartial));
  ls.learning_sequence.timeline[0].grouping = "pairs";
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla,
    learning_sequence: ls
  });
  assert.equal(result.ok, true);
  const a1 = result.page.activities.find((row) => row.activity_id === "A1");
  const a2 = result.page.activities.find((row) => row.activity_id === "A2");
  assert.equal(a1.duration_minutes, 99);
  assert.equal(a2.duration_minutes, 35);
  assert.equal(a1.grouping, undefined, "timeline grouping must not project onto activities");
});

test("LS timeline without duration_minutes does not fabricate activity duration", () => {
  const ls = JSON.parse(JSON.stringify(lsPartial));
  delete ls.learning_sequence.timeline[0].duration_minutes;
  delete ls.learning_sequence.timeline[1].duration_minutes;
  delete ls.learning_sequence.timeline[0].estimated_minutes;
  delete ls.learning_sequence.timeline[1].estimated_minutes;
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dlaPartial,
    learning_sequence: ls
  });
  assert.equal(result.ok, true);
  const a1 = result.page.activities.find((row) => row.activity_id === "A1");
  const a2 = result.page.activities.find((row) => row.activity_id === "A2");
  assert.equal(a1.duration_minutes, undefined);
  assert.equal(a2.duration_minutes, undefined);
});

test("LS timeline estimated_minutes project onto activities when duration_minutes absent", () => {
  const ls = JSON.parse(JSON.stringify(lsPartial));
  ls.learning_sequence.timeline[0] = {
    activity_id: "A1",
    estimated_minutes: 8
  };
  ls.learning_sequence.timeline[1] = {
    activity_id: "A2",
    estimated_minutes: 12
  };
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dlaPartial,
    learning_sequence: ls
  });
  assert.equal(result.ok, true);
  const a1 = result.page.activities.find((row) => row.activity_id === "A1");
  const a2 = result.page.activities.find((row) => row.activity_id === "A2");
  assert.equal(a1.duration_minutes, 8);
  assert.equal(a2.duration_minutes, 12);
});

test("timeline duration_minutes wins over estimated_minutes during assemble projection", () => {
  const ls = JSON.parse(JSON.stringify(lsPartial));
  ls.learning_sequence.timeline[0] = {
    activity_id: "A1",
    duration_minutes: 10,
    estimated_minutes: 8
  };
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dlaPartial,
    learning_sequence: ls
  });
  assert.equal(result.ok, true);
  const a1 = result.page.activities.find((row) => row.activity_id === "A1");
  assert.equal(a1.duration_minutes, 10);
});

test("EP + DP sets page_synthesis and sections", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    design_page: dpPartial
  });
  assert.equal(result.ok, true);
  assert.match(String(result.page.page_synthesis.overview.body), /inflation drivers/i);
  assert.equal(Array.isArray(result.page.sections), true);
  assert.equal(result.page.sections[0].section_id, "overview");
  assert.equal(result.page.assembly_state.current_stage, "design_page");
});

test("EP + assessment partials set assessment fields", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    assessment_design: daPartial,
    assessment_items: gaiPartial
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.assessment_blueprint.total_items, 2);
  assert.equal(result.page.assessment_blueprint.feedback_display, "answer_grid_end");
  assert.equal(result.page.assessment_check.items[0].item_id, "Q1");
  assert.equal(result.page.sections[0].section_id, "assessment_check");
  assert.equal(result.page.assembly_state.current_stage, "assessment_items");
});

test("full chain produces a renderable-looking complete page object", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dlaPartial,
    gam: gamPartial,
    learning_sequence: lsPartial,
    assessment_design: daPartial,
    assessment_items: gaiPartial,
    design_page: dpPartial
  });
  assert.equal(result.ok, true);
  const validation = assemble.validateAssembledPageForRender(result.page);
  assert.equal(validation.ok, true);
  assert.equal(result.page.artifact_type, "page");
  assert.equal(result.page.schema_version, "2.0.0");
  assert.equal(result.page.activities.length, 2);
  assert.ok(result.page.learning_sequence);
  assert.ok(result.page.page_synthesis.overview);
  assert.deepEqual(result.page.assembly_state.enriched_by, [
    "episode_plan",
    "dla",
    "gam",
    "learning_sequence",
    "assessment_design",
    "assessment_items",
    "design_page"
  ]);
  assert.equal(result.page.assembly_state.current_stage, "design_page");
});

// --- Sprint 70 Slice 2 — Design Page visual planning preservation ---

function assertDeepEqualAuthoredPlanning(actual, expected, label) {
  assert.deepEqual(actual, expected, label || "authored planning must survive assembly unchanged");
}

test("Slice 2: Design Page visual planning fields are preserved through assembly", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dlaPartial,
    gam: gamPartial,
    learning_sequence: lsPartial,
    design_page: dpPartialWithVa
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.visual_affordance_schema_version, "38.4");
  assert.equal(Array.isArray(result.page.activities_visual_review), true);
  assert.equal(result.page.activities_visual_review.length, 2);
  assert.equal(Array.isArray(result.page.visual_affordances), true);
  assert.equal(result.page.visual_affordances.length, 4);
  assertDeepEqualAuthoredPlanning(
    result.page.visual_affordance_schema_version,
    dpPartialWithVa.visual_affordance_schema_version
  );
  assertDeepEqualAuthoredPlanning(
    result.page.activities_visual_review,
    dpPartialWithVa.activities_visual_review
  );
  assertDeepEqualAuthoredPlanning(result.page.visual_affordances, dpPartialWithVa.visual_affordances);
});

test("Slice 2A: Design Page title replaces provisional shell title through assembly", () => {
  const shell = JSON.parse(JSON.stringify(epShell));
  shell.title =
    "Create a 60 minute self study resource for undergraduate history students on roman roads";
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: shell,
    design_page: dpPartialWithVa
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.title, "Inflation Drivers and CPI Reasoning");
  assert.notEqual(result.page.title, shell.title);
  assertDeepEqualAuthoredPlanning(result.page.visual_affordances, dpPartialWithVa.visual_affordances);
  assert.match(result.page.page_synthesis.overview.body, /^## Welcome/i);
});

test("Slice 2A: omitting Design Page title preserves legacy shell title", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    design_page: dpPartial
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.title, "Inflation Workshop");
  assert.equal(result.page.visual_affordances, undefined);
});

test("Slice 2: activity generate/defer/skip rows survive assembly unchanged", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    design_page: dpPartialWithVa
  });
  const generateRow = result.page.visual_affordances.find(
    (row) => row.affordance_id === "va-A1-generate-01"
  );
  const deferRow = result.page.visual_affordances.find((row) => row.affordance_id === "va-A2-defer-01");
  const skipRow = result.page.visual_affordances.find((row) => row.affordance_id === "va-A2-skip-01");
  assert.ok(generateRow);
  assert.ok(deferRow);
  assert.ok(skipRow);
  assert.equal(generateRow.visual_decision, "generate");
  assert.equal(deferRow.visual_decision, "defer");
  assert.equal(skipRow.visual_decision, "skip");
  assert.equal(generateRow.context, dpPartialWithVa.visual_affordances[0].context);
  assert.deepEqual(generateRow.evidence_anchors, dpPartialWithVa.visual_affordances[0].evidence_anchors);
  assert.deepEqual(generateRow.must_show, dpPartialWithVa.visual_affordances[0].must_show);
  assert.deepEqual(generateRow.must_not_show, dpPartialWithVa.visual_affordances[0].must_not_show);
  assert.equal(generateRow.pedagogical_added_value, dpPartialWithVa.visual_affordances[0].pedagogical_added_value);
  assert.deepEqual(generateRow.spoiler_boundary, dpPartialWithVa.visual_affordances[0].spoiler_boundary);
});

test("Slice 2: page-level Knowledge Summary affordance survives assembly unchanged", () => {
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    design_page: dpPartialWithVa
  });
  const pageRow = result.page.visual_affordances.find(
    (row) => row.affordance_id === "va-page-knowledge-summary-01"
  );
  assert.ok(pageRow);
  assert.equal(pageRow.scope, "page");
  assert.equal(pageRow.region, "knowledge_summary");
  assert.equal(pageRow.visual_slot, "knowledge-summary-after-content");
  assert.equal(pageRow.context, dpPartialWithVa.visual_affordances[3].context);
  assert.deepEqual(pageRow.evidence_anchors, dpPartialWithVa.visual_affordances[3].evidence_anchors);
});

test("Slice 2: resolvePageForRenderOrAssembly preserves authored visual planning", () => {
  const dpInput = JSON.parse(JSON.stringify(dpPartialWithVa));
  const wf = {
    id: "wf-s70-va-assemble",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      { id: "ep_step", title: "Design Episode Plan", outputName: "page", canonical_step_id: "step_design_episode_plan" },
      { id: "dla_step", title: "Design Learning Activities", outputName: "page", canonical_step_id: "step_design_learning_activities" },
      { id: "gam_step", title: "Generate Activity Materials", outputName: "page", canonical_step_id: "step_generate_activity_materials" },
      { id: "ls_step", title: "Construct Learning Sequence", outputName: "page", canonical_step_id: "step_construct_learning_sequence" },
      { id: "dp_step", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCaptureMapsForTest(
    {
      ep_step: JSON.stringify(epShell, null, 2),
      dla_step: JSON.stringify(dlaPartial, null, 2),
      gam_step: JSON.stringify(gamPartial, null, 2),
      ls_step: JSON.stringify(lsPartial, null, 2),
      dp_step: JSON.stringify(dpInput, null, 2)
    },
    {
      ep_step: JSON.stringify(epShell, null, 2),
      dla_step: JSON.stringify(dlaPartial, null, 2),
      gam_step: JSON.stringify(gamPartial, null, 2),
      ls_step: JSON.stringify(lsPartial, null, 2),
      dp_step: JSON.stringify(dpInput, null, 2)
    }
  );
  const resolved = api.resolvePageForRenderOrAssembly(dpInput, wf, {});
  assert.equal(
    JSON.stringify(resolved.visual_affordances),
    JSON.stringify(dpInput.visual_affordances),
    "visual_affordances must survive resolvePageForRenderOrAssembly unchanged"
  );
  assert.equal(
    JSON.stringify(resolved.activities_visual_review),
    JSON.stringify(dpInput.activities_visual_review),
    "activities_visual_review must survive resolvePageForRenderOrAssembly unchanged"
  );
  assert.equal(resolved.visual_affordance_schema_version, "38.4");
});

test("Slice 2: no legacy affordance injection when authoritative planning exists", () => {
  const s38 = require(path.join(repoRoot, "lib", "sprint38-visual-affordances.js"));
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    design_page: dpPartialWithVa
  });
  assert.equal(result.page.visual_affordances.length, dpPartialWithVa.visual_affordances.length);
  assert.equal(s38.buildVisualAffordanceRenderPlan(result.page).legacy, false);
  const authoredIds = new Set(dpPartialWithVa.visual_affordances.map((row) => row.affordance_id));
  result.page.visual_affordances.forEach((row) => {
    assert.ok(authoredIds.has(row.affordance_id));
    assert.ok(row.affordance_id);
    assert.ok(String(row.context || "").length > 0);
  });
});

test("Slice 2: legacy handover remains when Design Page omits visual planning", () => {
  const s38 = require(path.join(repoRoot, "lib", "sprint38-visual-affordances.js"));
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    design_page: dpPartial
  });
  assert.equal(result.page.visual_affordance_schema_version, undefined);
  assert.equal(result.page.visual_affordances, undefined);
  assert.equal(s38.detectVisualAffordanceHandoverMode(result.page), "legacy");
  assert.equal(s38.buildVisualAffordanceRenderPlan(result.page).legacy, true);
});

test("mergeAssemblyState orders enriched_by correctly", () => {
  const merged = assemble.mergeAssemblyState([
    { enriched_by: ["episode_plan"], current_stage: "episode_plan" },
    { enriched_by: ["dla"], current_stage: "dla" },
    { enriched_by: ["gam"], current_stage: "gam" },
    { enriched_by: ["learning_sequence"], current_stage: "learning_sequence" },
    { enriched_by: ["assessment_design"], current_stage: "assessment_design" },
    { enriched_by: ["assessment_items"], current_stage: "assessment_items" },
    { enriched_by: ["design_page"], current_stage: "design_page" }
  ]);
  assert.deepEqual(merged.enriched_by, [
    "episode_plan",
    "dla",
    "gam",
    "learning_sequence",
    "assessment_design",
    "assessment_items",
    "design_page"
  ]);
  assert.equal(merged.current_stage, "design_page");
});

test("assembleVNextPageFromWorkflowCaptures reads step captures by stage", () => {
  const wf = {
    id: "wf-assemble",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "ep_step",
        title: "Design Episode Plan",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        canonical_step_id: "step_design_learning_activities"
      },
      {
        id: "gam_step",
        title: "Generate Activity Materials",
        canonical_step_id: "step_generate_activity_materials"
      },
      {
        id: "da_step",
        title: "Design Assessment",
        canonical_step_id: "step_design_assessment"
      },
      {
        id: "gai_step",
        title: "Generate Assessment Items",
        canonical_step_id: "step_generate_assessment_items"
      }
    ]
  };
  const captures = {
    ep_step: JSON.stringify(epShell),
    dla_step: JSON.stringify(dlaPartial),
    gam_step: JSON.stringify(gamPartial),
    da_step: JSON.stringify(daPartial),
    gai_step: JSON.stringify(gaiPartial)
  };
  const result = assemble.assembleVNextPageFromWorkflowCaptures(wf, { captures });
  assert.equal(result.ok, true);
  assert.equal(result.page.activities[0].materials.length, 1);
  assert.equal(result.page.assessment_blueprint.total_items, 2);
  assert.equal(result.page.assessment_check.items[0].item_id, "Q1");
  assert.equal(result.page.assembly_state.current_stage, "assessment_items");
});

test("partial capture workflow resolves assembled page for render and renders HTML", () => {
  const wf = {
    id: "wf-render-assemble",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      { id: "ep_step", title: "Design Episode Plan", outputName: "page", canonical_step_id: "step_design_episode_plan" },
      { id: "dla_step", title: "Design Learning Activities", outputName: "page", canonical_step_id: "step_design_learning_activities" },
      { id: "gam_step", title: "Generate Activity Materials", outputName: "page", canonical_step_id: "step_generate_activity_materials" },
      { id: "ls_step", title: "Construct Learning Sequence", outputName: "page", canonical_step_id: "step_construct_learning_sequence" },
      { id: "da_step", title: "Design Assessment", outputName: "page", canonical_step_id: "step_design_assessment" },
      { id: "gai_step", title: "Generate Assessment Items", outputName: "page", canonical_step_id: "step_generate_assessment_items" },
      { id: "dp_step", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCaptureMapsForTest(
    {
      ep_step: JSON.stringify(epShell, null, 2),
      dla_step: JSON.stringify(dlaPartial, null, 2),
      gam_step: JSON.stringify(gamPartial, null, 2),
      ls_step: JSON.stringify(lsPartial, null, 2),
      da_step: JSON.stringify(daPartial, null, 2),
      gai_step: JSON.stringify(gaiPartial, null, 2),
      dp_step: JSON.stringify(dpPartial, null, 2)
    },
    {
      ep_step: JSON.stringify(epShell, null, 2),
      dla_step: JSON.stringify(dlaPartial, null, 2),
      gam_step: JSON.stringify(gamPartial, null, 2),
      ls_step: JSON.stringify(lsPartial, null, 2),
      da_step: JSON.stringify(daPartial, null, 2),
      gai_step: JSON.stringify(gaiPartial, null, 2),
      dp_step: JSON.stringify(dpPartial, null, 2)
    }
  );
  const resolved = api.resolvePageForRenderOrAssembly(dpPartial, wf, {});
  assert.equal(String(resolved.artifact_type), "page");
  assert.equal(String(resolved.schema_version), "2.0.0");
  assert.equal(Array.isArray(resolved.activities), true);
  assert.equal(resolved.activities.length, 2);
  const a1 = resolved.activities.find((row) => row.activity_id === "A1");
  assert.ok(a1);
  assert.equal(a1.learner_task, "Compare inflation drivers using evidence.");
  assert.equal(Array.isArray(a1.materials), true);
  assert.equal(a1.materials.length, 1);
  assert.equal(a1.materials[0].material_id, "A1-M1");
  assert.ok(resolved.learning_sequence && resolved.learning_sequence.sequence_title);
  assert.ok(resolved.assessment_blueprint && resolved.assessment_blueprint.total_items === 2);
  assert.ok(resolved.assessment_check && Array.isArray(resolved.assessment_check.items));
  assert.ok(resolved.page_synthesis || resolved.sections);
  assert.notEqual(String(resolved.assembly_state && resolved.assembly_state.current_stage), "gam");
});

test("resolvePageForRenderOrAssembly throws explicit error when required EP capture missing", () => {
  const wf = {
    id: "wf-render-missing-ep",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      { id: "ep_step", title: "Design Episode Plan", outputName: "page", canonical_step_id: "step_design_episode_plan" },
      { id: "dp_step", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCaptureMapsForTest(
    { dp_step: JSON.stringify(dpPartial, null, 2) },
    { dp_step: JSON.stringify(dpPartial, null, 2) }
  );
  assert.throws(
    () => api.resolvePageForRenderOrAssembly(dpPartial, wf, {}),
    /Missing required episode plan page shell capture/i
  );
});

test("legacy mode bypasses partial assembly resolver", () => {
  const legacyWf = {
    id: "wf-legacy-render",
    pageEnrichmentV2: false,
    partialPageOutputs: false,
    steps: [{ id: "dp_step", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }]
  };
  const input = JSON.parse(JSON.stringify(dpPartial));
  const resolved = api.resolvePageForRenderOrAssembly(input, legacyWf, {});
  assert.equal(resolved, input);
});

test("v2 rollback mode bypasses partial assembly resolver", () => {
  const rollbackWf = {
    id: "wf-v2-rollback-render",
    pageEnrichmentV2: true,
    partialPageOutputs: false,
    steps: [{ id: "dp_step", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }]
  };
  const input = JSON.parse(JSON.stringify(dpPartial));
  const resolved = api.resolvePageForRenderOrAssembly(input, rollbackWf, {});
  assert.equal(resolved, input);
});

// --- Phase 1A gate tests ---

const api = loadPrismTestApi();

const dlaStep = {
  id: "dla_step",
  title: "Design Learning Activities",
  canonical_step_id: "step_design_learning_activities",
  outputName: "page"
};
const epStep = {
  id: "ep_step",
  title: "Design Episode Plan",
  canonical_step_id: "step_design_episode_plan",
  outputName: "page"
};
const loStep = {
  id: "lo_step",
  title: "Define Learning Outcomes",
  canonical_step_id: "step_define_learning_outcomes",
  outputName: "learning_outcomes"
};
const daStep = {
  id: "da_step",
  title: "Design Assessment",
  canonical_step_id: "step_design_assessment",
  outputName: "page"
};
const gaiStep = {
  id: "gai_step",
  title: "Generate Assessment Items",
  canonical_step_id: "step_generate_assessment_items",
  outputName: "page"
};

test("isPageEnrichmentV2WorkflowEnabled reads workflow config", () => {
  assert.equal(api.isPageEnrichmentV2WorkflowEnabled({}), false);
  assert.equal(api.isPageEnrichmentV2WorkflowEnabled({ pageEnrichmentV2: true }), true);
  assert.equal(
    api.isPageEnrichmentV2WorkflowEnabled({ workflowOutputSpec: { pageEnrichmentV2: true } }),
    true
  );
});

test("isPartialPageOutputWorkflowEnabled requires v2 and partialPageOutputs", () => {
  assert.equal(api.isPartialPageOutputWorkflowEnabled({ partialPageOutputs: true }), false);
  assert.equal(
    api.isPartialPageOutputWorkflowEnabled({ pageEnrichmentV2: true, partialPageOutputs: true }),
    true
  );
  assert.equal(
    api.isPartialPageOutputWorkflowEnabled({
      pageEnrichmentV2: true,
      partialPageOutputs: false
    }),
    false
  );
});

test("isPostEpisodePlanPartialOutputStep identifies post-EP steps only in partial mode", () => {
  const partialWf = { pageEnrichmentV2: true, partialPageOutputs: true };
  const fullV2Wf = { pageEnrichmentV2: true, partialPageOutputs: false };
  const legacyWf = { pageEnrichmentV2: false };

  assert.equal(api.isPostEpisodePlanPartialOutputStep(dlaStep, partialWf), true);
  assert.equal(api.isPostEpisodePlanPartialOutputStep(daStep, partialWf), true);
  assert.equal(api.isPostEpisodePlanPartialOutputStep(gaiStep, partialWf), true);
  assert.equal(api.isPostEpisodePlanPartialOutputStep(epStep, partialWf), false);
  assert.equal(api.isPostEpisodePlanPartialOutputStep(loStep, partialWf), false);
  assert.equal(api.isPostEpisodePlanPartialOutputStep(dlaStep, fullV2Wf), false);
  assert.equal(api.isPostEpisodePlanPartialOutputStep(dlaStep, legacyWf), false);
});

test("shouldInjectUpstreamCaptureIntoPrompt is false for post-EP partial steps only", () => {
  const partialWf = { pageEnrichmentV2: true, partialPageOutputs: true };
  const fullV2Wf = { pageEnrichmentV2: true, partialPageOutputs: false };

  assert.equal(api.shouldInjectUpstreamCaptureIntoPrompt(dlaStep, partialWf), false);
  assert.equal(api.shouldInjectUpstreamCaptureIntoPrompt(daStep, partialWf), false);
  assert.equal(api.shouldInjectUpstreamCaptureIntoPrompt(gaiStep, partialWf), false);
  assert.equal(api.shouldInjectUpstreamCaptureIntoPrompt(epStep, partialWf), true);
  assert.equal(api.shouldInjectUpstreamCaptureIntoPrompt(loStep, partialWf), true);
  assert.equal(api.shouldInjectUpstreamCaptureIntoPrompt(dlaStep, fullV2Wf), true);
});

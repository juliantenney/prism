/**
 * Episode plans → Design Page preservation layer.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

const episodePreserve = require("../lib/page-episode-plans-preserve.js");

const SAMPLE_BEATS = [
  { function: "orientation" },
  { function: "explanation" },
  { function: "verification" }
];

function samplePlanContainer(planRows) {
  return {
    episode_plans: planRows,
    derivation_version: "38S-3",
    source: "learning_outcomes"
  };
}

function basePage(materials) {
  return {
    artifact_type: "page",
    title: "Test page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Activity one",
            learner_task: "Complete the task.",
            materials: materials || { scenario: "Scenario body text for the learner." }
          }
        ]
      }
    ],
    source_artefacts: ["learning_activities", "activity_materials"]
  };
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

function loadPrismTestApi(extraLibs) {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
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
    removeEventListener: () => {},
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
  const libs = [
    "lib/page-episode-plans-preserve.js",
    "lib/page-gam-materials-preserve.js",
    "lib/sprint38-visual-affordances.js",
    "lib/ld-table-fidelity.js",
    "lib/ld-materials-copy.js",
    "lib/ld-design-page-compose-contract.js",
    "lib/ld-instructional-manifestation-render.js",
    "lib/utility-pedagogical-icons.js",
    "lib/utility-pedagogical-beats.js",
    ...(extraLibs || [])
  ];
  libs.forEach((rel) => {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, rel), "utf8"), sandbox, { filename: rel });
  });
  if (sandbox.PRISM_PAGE_EPISODE_PLANS_PRESERVE) {
    windowStub.PRISM_PAGE_EPISODE_PLANS_PRESERVE = sandbox.PRISM_PAGE_EPISODE_PLANS_PRESERVE;
  }
  if (sandbox.PRISM_PAGE_GAM_MATERIALS_PRESERVE) {
    windowStub.PRISM_PAGE_GAM_MATERIALS_PRESERVE = sandbox.PRISM_PAGE_GAM_MATERIALS_PRESERVE;
  }
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

test("resolvePlanRowForActivity: direct A1 → A1 mapping", () => {
  const container = samplePlanContainer([
    {
      activity_id: "A1",
      mapped_learning_outcome_ids: ["LO1"],
      episode_plan: { archetype: "understand", beats: SAMPLE_BEATS }
    }
  ]);
  const resolved = episodePreserve.resolvePlanRowForActivity(
    container,
    { activity_id: "A1" },
    null,
    0
  );
  assert.equal(resolved.method, "activity_id");
  assert.equal(resolved.planRow.activity_id, "A1");
  assert.equal(resolved.sourceActivityId, null);
});

test("resolvePlanRowForActivity: LO1 → A1 via mapped_learning_outcomes bridge", () => {
  const container = samplePlanContainer([
    {
      activity_id: "LO1",
      mapped_learning_outcome_ids: ["LO1"],
      episode_plan: { archetype: "apply", beats: [{ function: "guided_practice" }] }
    }
  ]);
  const resolved = episodePreserve.resolvePlanRowForActivity(
    container,
    { activity_id: "A1", mapped_learning_outcomes: ["LO1"] },
    { activity_id: "A1", mapped_learning_outcomes: ["LO1"] },
    0
  );
  assert.equal(resolved.method, "mapped_learning_outcomes");
  assert.equal(resolved.planRow.activity_id, "LO1");
  assert.equal(resolved.sourceActivityId, "LO1");
});

test("resolvePlanRowForActivity: index fallback records source activity id", () => {
  const container = samplePlanContainer([
    {
      activity_id: "LO9",
      episode_plan: { archetype: "analyse", beats: [{ function: "worked_thinking" }] }
    }
  ]);
  const resolved = episodePreserve.resolvePlanRowForActivity(
    container,
    { activity_id: "A1" },
    null,
    0
  );
  assert.equal(resolved.method, "index");
  assert.equal(resolved.sourceActivityId, "LO9");
});

test("applyEpisodePlansToComposedPage: attaches plans and preserves materials", () => {
  const materials = {
    scenario: "Full scenario body that must remain verbatim.",
    checklist: "## Checklist\n\n- Item one\n- Item two"
  };
  const page = basePage(materials);
  const upstream = {
    activities: [{ activity_id: "A1", mapped_learning_outcomes: ["LO1"] }]
  };
  const plans = samplePlanContainer([
    {
      activity_id: "A1",
      mapped_learning_outcome_ids: ["LO1"],
      episode_plan: { archetype: "understand", beats: SAMPLE_BEATS }
    }
  ]);

  const merged = episodePreserve.applyEpisodePlansToComposedPage(page, plans, upstream);
  const row = merged.sections[0].content[0];

  assert.ok(Array.isArray(merged.episode_plans));
  assert.equal(merged.episode_plans.length, 1);
  assert.equal(merged.episode_plans[0].activity_id, "A1");
  assert.deepEqual(row.materials, materials);
  assert.equal(row.episode_plan.archetype, "understand");
  assert.equal(row.episode_plan.beats.length, 3);
  assert.ok(merged.source_artefacts.includes("episode_plans"));
  assert.equal(row.episode_plan_source_activity_id, undefined);
});

test("applyEpisodePlansToComposedPage: LO bridge on page activity", () => {
  const page = basePage({ text: "unchanged" });
  const plans = samplePlanContainer([
    {
      activity_id: "LO1",
      mapped_learning_outcome_ids: ["LO1"],
      episode_plan: { archetype: "apply", beats: [{ function: "transfer" }] }
    }
  ]);
  const upstream = {
    activities: [{ activity_id: "A1", mapped_learning_outcomes: ["LO1"] }]
  };
  const merged = episodePreserve.applyEpisodePlansToComposedPage(page, plans, upstream);
  const row = merged.sections[0].content[0];
  assert.equal(row.episode_plan.archetype, "apply");
  assert.equal(row.episode_plan_source_activity_id, "LO1");
  assert.deepEqual(row.materials, { text: "unchanged" });
});

test("applyEpisodePlansToComposedPage: no-op when episode_plans unavailable", () => {
  const page = basePage({ note: "same" });
  const unchanged = episodePreserve.applyEpisodePlansToComposedPage(page, null, null);
  assert.deepEqual(unchanged, page);
});

test("applyPedagogicCognitionSemanticsToComposedPage: wires episode plans preserve", () => {
  const api = loadPrismTestApi();
  const page = basePage({ body: "material body" });
  const plans = samplePlanContainer([
    {
      activity_id: "A1",
      episode_plan: { archetype: "understand", beats: SAMPLE_BEATS }
    }
  ]);
  const merged = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: { activities: [{ activity_id: "A1" }] },
    upstreamEpisodePlans: plans
  });
  assert.ok(Array.isArray(merged.episode_plans));
  assert.equal(merged.sections[0].content[0].episode_plan.archetype, "understand");
  assert.equal(merged.sections[0].content[0].materials.body, "material body");
});

test("applyComposedPageEpisodePlansPreserve: skips when page already has portable episode_plans", () => {
  const api = loadPrismTestApi();
  const page = basePage({ body: "material body" });
  page.episode_plans = [
    {
      activity_id: "A1",
      episode_plan: { archetype: "analyse", beats: [{ function: "explanation" }] }
    }
  ];
  page.sections[0].content[0].episode_plan = {
    archetype: "analyse",
    beats: [{ function: "explanation" }]
  };
  const plans = samplePlanContainer([
    {
      activity_id: "A1",
      episode_plan: { archetype: "understand", beats: SAMPLE_BEATS }
    }
  ]);
  const merged = api.applyComposedPageEpisodePlansPreserve(page, {
    upstreamEpisodePlans: plans,
    upstreamLearningActivities: { activities: [{ activity_id: "A1" }] }
  });
  assert.equal(merged.episode_plans[0].episode_plan.archetype, "analyse");
  assert.equal(merged.sections[0].content[0].episode_plan.archetype, "analyse");
});

test("applyComposedPageEpisodePlansPreserve: fallback injects when page omits episode_plans", () => {
  const api = loadPrismTestApi();
  const page = basePage({ body: "material body" });
  const plans = samplePlanContainer([
    {
      activity_id: "A1",
      episode_plan: { archetype: "understand", beats: SAMPLE_BEATS }
    }
  ]);
  const merged = api.applyComposedPageEpisodePlansPreserve(page, {
    upstreamEpisodePlans: plans,
    upstreamLearningActivities: { activities: [{ activity_id: "A1" }] }
  });
  assert.equal(merged.episode_plans[0].episode_plan.archetype, "understand");
  assert.equal(merged.sections[0].content[0].episode_plan.archetype, "understand");
});

test("renderer does not emit raw episode_plans section in export HTML", () => {
  const api = loadPrismTestApi(["lib/design-page-materials-fidelity.js"]);
  const page = basePage({ scenario: "Learner scenario content." });
  const plans = samplePlanContainer([
    {
      activity_id: "A1",
      episode_plan: { archetype: "understand", beats: SAMPLE_BEATS }
    }
  ]);
  const enriched = episodePreserve.applyEpisodePlansToComposedPage(page, plans, {
    activities: [{ activity_id: "A1" }]
  });
  const result = api.runUtilityPageExportPipelineForTest(enriched, {
    applyCompositionValidation: false
  });
  assert.equal(result.error, null);
  const html = String(result.html || "");
  assert.ok(html.length > 0);
  assert.doesNotMatch(html, /<h2[^>]*>\s*Episode Plans\s*<\/h2>/i);
  assert.doesNotMatch(html, /"function"\s*:\s*"orientation"/i);
  assert.doesNotMatch(html, /episode_plan_source_activity_id/i);
});

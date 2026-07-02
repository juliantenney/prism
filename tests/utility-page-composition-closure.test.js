/**
 * Sprint 25-5 — Design Page activity closure validation and strict export render.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixtureDir = path.join(repoRoot, "tests", "fixtures", "page-render");
const fullFixturePath = path.join(fixtureDir, "ld-inflation-workshop-page-full.json");
const missingA2FixturePath = path.join(fixtureDir, "ld-inflation-workshop-page-missing-a2.json");
const upstreamLaPath = path.join(fixtureDir, "ld-inflation-workshop-upstream-learning-activities.json");

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
  const source = fs.readFileSync(appJsPath, "utf8");
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function sectionAfterHeading(html, headingText) {
  const re = new RegExp(
    headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?(?=<h2|<details class=\"util-meta\"|$)",
    "i"
  );
  const m = html.match(re);
  return m ? m[0] : "";
}

const api = loadPrismTestApi();
const upstreamLa = JSON.parse(fs.readFileSync(upstreamLaPath, "utf8"));

test("closure validator: full page passes with five upstream activities", () => {
  const page = JSON.parse(fs.readFileSync(fullFixturePath, "utf8"));
  const result = api.validatePageActivityClosure(page, upstreamLa);
  assert.equal(result.outcome, "pass");
  assert.deepEqual([...result.composed_activity_ids].sort(), ["a1", "a2", "a3", "a4", "a5"]);
});

test("closure validator: A2 preserved in composed sections when present upstream", () => {
  const page = JSON.parse(fs.readFileSync(fullFixturePath, "utf8"));
  const composed = api.collectComposedActivityIdsFromPage(page);
  assert.ok(composed.includes("a2"));
});

test("closure validator: silent omission of A2 fails", () => {
  const page = JSON.parse(fs.readFileSync(missingA2FixturePath, "utf8"));
  const result = api.validatePageActivityClosure(page, upstreamLa);
  assert.equal(result.outcome, "fail");
  assert.deepEqual([...result.untraced_omission_ids], ["a2"]);
});

test("closure validator: explicit omission trace passes", () => {
  const page = JSON.parse(fs.readFileSync(missingA2FixturePath, "utf8"));
  page.generation_notes = {
    limitations: ["Activity A2 omitted per user request."],
    activities_omitted: [
      {
        activity_id: "A2",
        title: "Measuring Inflation: Indicator Comparison",
        reason: "User requested exclusion of indicator comparison activity.",
        authority: "explicit_exclusion"
      }
    ]
  };
  const result = api.validatePageActivityClosure(page, upstreamLa);
  assert.equal(result.outcome, "pass");
  assert.deepEqual([...result.traced_omission_ids], ["a2"]);
});

test("closure validator: silent omission appends generation_notes warnings", () => {
  const page = JSON.parse(fs.readFileSync(missingA2FixturePath, "utf8"));
  const result = api.validatePageActivityClosure(page, upstreamLa);
  api.appendPageCompositionClosureWarnings(page, result);
  assert.ok(Array.isArray(page.generation_notes.limitations));
  assert.ok(
    page.generation_notes.limitations.some((line) => /A2|a2/i.test(String(line))),
    "limitations should mention missing A2"
  );
  assert.ok(Array.isArray(page.generation_notes.activities_omitted));
  assert.equal(page.generation_notes.activities_omitted.length, 0);
});

test("design page closure: LO3-LO5 omission with duration/readability reasons is repaired", () => {
  const upstream = {
    activities: [
      { activity_id: "LO1", title: "Activity 1" },
      { activity_id: "LO2", title: "Activity 2" },
      { activity_id: "LO3", title: "Activity 3" },
      { activity_id: "LO4", title: "Activity 4" },
      { activity_id: "LO5", title: "Activity 5" },
      { activity_id: "LO6", title: "Activity 6" }
    ]
  };
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          { activity_id: "LO1", title: "Activity 1" },
          { activity_id: "LO2", title: "Activity 2" },
          { activity_id: "LO6", title: "Activity 6" }
        ]
      },
      {
        section_id: "knowledge_summary",
        heading: "Knowledge Summary",
        content: "LO3-LO5 integrated conceptually for readability."
      }
    ],
    generation_notes: {
      activities_omitted: [
        {
          activity_id: "LO3",
          title: "Activity 3",
          reason: "condensed into conceptual flow",
          authority: "duration_constraint"
        },
        {
          activity_id: "LO4",
          title: "Activity 4",
          reason: "integrated conceptually",
          authority: "duration_constraint"
        },
        {
          activity_id: "LO5",
          title: "Activity 5",
          reason: "fit readability constraint",
          authority: "duration_constraint"
        }
      ],
      limitations: []
    }
  };
  const validation = api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamLearningActivities: upstream
  });
  const composed = [...api.collectComposedActivityIdsFromPage(page)].sort();
  assert.equal(validation.outcome, "pass");
  assert.deepEqual(composed, ["lo1", "lo2", "lo3", "lo4", "lo5", "lo6"]);
  assert.ok(Array.isArray(page.generation_notes.activities_omitted));
  assert.equal(page.generation_notes.activities_omitted.length, 0);
  const limitationsBlob = (page.generation_notes.limitations || []).join(" ").toLowerCase();
  assert.doesNotMatch(limitationsBlob, /integrated conceptually|conceptual flow|fit readability constraint/i);
});

test("applyPageCompositionValidationForUtilitiesPage: upstream-aware compose restores omitted activity rows", () => {
  const page = JSON.parse(fs.readFileSync(missingA2FixturePath, "utf8"));
  const validation = api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamLearningActivities: upstreamLa
  });
  assert.equal(validation.outcome, "pass");
  assert.ok(api.collectComposedActivityIdsFromPage(page).includes("a2"));
  assert.ok(validation.materialsValidation);
});

test("strict render: sequence omission does not fabricate A2 in HTML", () => {
  const parsed = JSON.parse(fs.readFileSync(fullFixturePath, "utf8"));
  const la = parsed.sections.find((s) => s.section_id === "learning_activities");
  la.content = la.content.filter((row) => String(row.activity_id) !== "A2");
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  const activitiesScope = sectionAfterHeading(html, "Learning activities");
  assert.doesNotMatch(activitiesScope, /Measuring Inflation: Indicator Comparison/i);
  assert.equal((activitiesScope.match(/util-task-block/gi) || []).length, 4);
});

test("strict render: activity_materials alone do not fabricate A2 in HTML", () => {
  const parsed = JSON.parse(fs.readFileSync(fullFixturePath, "utf8"));
  const la = parsed.sections.find((s) => s.section_id === "learning_activities");
  la.content = la.content.filter((row) => String(row.activity_id) !== "A2");
  const seq = parsed.sections.find((s) => s.section_id === "learning_sequence");
  if (seq && Array.isArray(seq.content)) {
    seq.content = seq.content.filter((row) => String(row.activity_id) !== "A2");
  }
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  const activitiesScope = sectionAfterHeading(html, "Learning activities");
  assert.doesNotMatch(activitiesScope, /Measuring Inflation: Indicator Comparison/i);
  assert.doesNotMatch(activitiesScope, /<h3>A2<\/h3>/i);
});

test("strict render: non-strict probe path can still recover A2 when explicitly disabled", () => {
  const parsed = JSON.parse(fs.readFileSync(fullFixturePath, "utf8"));
  const la = parsed.sections.find((s) => s.section_id === "learning_activities");
  la.content = la.content.filter((row) => String(row.activity_id) !== "A2");
  const html = api.utilityRenderPageSectionsForTest([la], {
    pageSections: parsed.sections,
    strictCompositionClosure: false,
    cleanupInlineMarkdown: true,
    suppressInternalMetadata: true
  });
  assert.match(html, /<h3>A2<\/h3>/i);
  assert.match(html, /\bPPI\b/);
});

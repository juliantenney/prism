/**
 * Sprint 56F Phase 8 — vNext renderer compatibility layer tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures", "page-render");
const normalizeLibPath = path.join(repoRoot, "lib", "page-render-normalize.js");

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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS.concat(["lib/page-render-normalize.js"]));
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api, normalize: sandbox.PRISM_PAGE_RENDER_NORMALIZE };
}

function loadPageFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function renderPage(api, page, options) {
  const r = api.buildUtilityStructuredHtmlForTest(page, ["sections"], options || {});
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

const VNEXT_PAGE = {
  artifact_type: "page",
  schema_version: "2.0.0",
  title: "vNext Progressive Enrichment Demo",
  audience: "Undergraduate self-directed learners",
  page_profile: { profile_type: "learner" },
  assembly_state: { enriched_by: ["episode_plan", "dla", "gam", "learning_sequence", "assessment"] },
  page_synthesis: {
    overview: {
      body: "This page examines how capitalism shapes labour relations. You will compare texts and apply core concepts.",
      format: "markdown"
    },
    learning_purpose: {
      body: "By the end you will explain class struggle and apply Marxist concepts to a workplace scenario.",
      format: "markdown"
    },
    knowledge_summary: {
      concepts: [
        { name: "Class Struggle", definition: "Conflict between owners and workers over production." },
        { name: "Alienation", definition: "Workers disconnected from labour and its products." }
      ],
      relationships: "Capitalism produces class divisions that drive struggle."
    },
    study_tips: {
      body: "- Compare author purpose before plot summary.\n- Cite factory details when applying concepts.",
      format: "markdown"
    }
  },
  activities: [
    {
      activity_id: "A1",
      title: "Compare Marx's Major Works",
      duration_minutes: 20,
      activity_preamble: "Compare texts as intellectual projects, not plot summaries.",
      learner_task: "Complete the comparison table using purpose-and-difference moves.",
      expected_output: "A filled comparison table with defensible differences.",
      support_note: "If your difference reads like plot summary, revisit author purpose.",
      materials: [
        {
          material_id: "A1-TEXT-1",
          material_type: "text",
          title: "Comparison guidance",
          body: "### Comparison guidance\nPurpose states author aim; difference names a contrast between works.",
          body_format: "markdown"
        },
        {
          material_id: "A1-WE-1",
          material_type: "worked_example",
          title: "Model row",
          body: "### Model row\n| Work | Purpose | Difference |\n| Manifesto | Mobilise workers | Short programme |",
          body_format: "markdown"
        }
      ]
    },
    {
      activity_id: "A2",
      title: "Apply Core Concepts",
      duration_minutes: 15,
      activity_preamble: "Apply concepts to a factory scenario with evidence.",
      learner_task: "Write a short explanation using the checklist.",
      expected_output: "150–250 word explanation with cited factory detail.",
      support_note: "Name groups with a factory detail, not labels alone.",
      materials: [
        {
          material_id: "A2-CHK-1",
          material_type: "checklist",
          title: "Concept checklist",
          body: "## Checklist\n- Identify capitalism\n- Describe bourgeoisie\n- Explain alienation",
          body_format: "markdown"
        }
      ]
    }
  ],
  learning_sequence: {
    ordered_activity_ids: ["A1", "A2"],
    sequence_title: "Self-study sequence",
    total_duration_minutes: 35,
    timeline: [
      {
        activity_id: "A1",
        phase_type: "concept_application",
        duration_minutes: 20,
        transition_to_next: "Move from comparison to applying concepts in a scenario."
      },
      {
        activity_id: "A2",
        phase_type: "synthesis",
        duration_minutes: 15,
        transition_to_next: "Session ends with applied judgement."
      }
    ]
  },
  assessment_check: {
    items: [
      {
        item_id: "Q1",
        prompt: "Which statement best describes historical materialism?",
        options: ["Economic conditions shape society", "Ideas alone drive history"],
        success_criteria: ["Selects economic conditions option with brief justification"]
      }
    ],
    feedback_guidance: ["Focus on material conditions, not idea-first explanations."]
  },
  learning_outcomes: [],
  source_artefacts: [{ artefact_type: "episode_plans", role: "structural", source_label: "EP" }],
  generation_notes: {
    validation: {
      activity_coverage: "full",
      material_coverage: "full",
      episode_plan_attachment: "n/a",
      self_containment: "yes",
      schema_compliance: "2.0.0",
      known_issues: []
    }
  }
};

test("legacy page fixture still renders unchanged", () => {
  const { api } = loadPrismTestApi();
  const legacy = loadPageFixture("marx-self-study-page.json");
  const html = renderPage(api, legacy, { applyCompositionValidation: false });
  assert.match(html, /Karl Marx: Life, Ideas, and Historical Context/i);
  assert.match(html, /Modelled comparison row/i);
  assert.match(html, /Comparing Marx/i);
});

test("normalizePageForRender does not mutate the input page object", () => {
  const { normalize } = loadPrismTestApi();
  const page = JSON.parse(JSON.stringify(VNEXT_PAGE));
  const snapshot = JSON.stringify(page);
  const normalized = normalize.normalizePageForRender(page);
  assert.notEqual(normalized, page);
  assert.equal(JSON.stringify(page), snapshot);
  assert.equal(page.sections, undefined);
  assert.ok(Array.isArray(normalized.sections));
});

test("vNext page_synthesis synthesizes render sections in canonical order", () => {
  const { api } = loadPrismTestApi();
  const page = JSON.parse(JSON.stringify(VNEXT_PAGE));
  delete page.learning_sequence;
  delete page.assessment_check;
  const sections = api.getPageSectionsForRenderForTest(page);
  const ids = sections.map((s) => s.section_id);
  assert.ok(ids.indexOf("knowledge_summary") !== -1);
  assert.ok(ids.indexOf("learning_journey") !== -1);
  assert.ok(ids.indexOf("learning_activities") !== -1);
  assert.ok(ids.indexOf("study_tips") !== -1);
  assert.ok(ids.indexOf("knowledge_summary") < ids.indexOf("learning_journey"));
  assert.ok(ids.indexOf("learning_journey") < ids.indexOf("learning_activities"));
  const ksSection = sections.find((s) => s.section_id === "knowledge_summary");
  const laSection = sections.find((s) => s.section_id === "learning_activities");
  assert.match(JSON.stringify(ksSection && ksSection.content), /class struggle|capitalism/i);
  assert.match(String(laSection && laSection.content && laSection.content[0] && laSection.content[0].title), /Compare Marx/i);
});

test("vNext top-level activities[] render as learning activities", () => {
  const { api } = loadPrismTestApi();
  const page = JSON.parse(JSON.stringify(VNEXT_PAGE));
  delete page.page_synthesis;
  delete page.learning_sequence;
  delete page.assessment_check;
  const rows = api.extractLearningActivityRowsFromPageForTest(page);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].activity_id, "A1");
  const html = renderPage(api, page, { applyCompositionValidation: false });
  assert.match(html, /Compare Marx/i);
  assert.match(html, /Apply Core Concepts/i);
});

test("vNext materials[] array renders through existing material renderer", () => {
  const { api, normalize } = loadPrismTestApi();
  const page = JSON.parse(JSON.stringify(VNEXT_PAGE));
  delete page.page_synthesis;
  delete page.learning_sequence;
  delete page.assessment_check;
  const normalized = normalize.normalizePageForRender(page);
  const row = normalized.activities[0];
  assert.ok(row.materials && typeof row.materials === "object");
  assert.ok(!Array.isArray(row.materials));
  const primaryMaterial = row.materials.text || row.materials.worked_example;
  if (primaryMaterial && typeof primaryMaterial === "object" && !Array.isArray(primaryMaterial)) {
    assert.match(String(primaryMaterial.body || primaryMaterial.content || primaryMaterial.text || ""), /Comparison guidance|Model row/);
  } else {
    assert.match(String(primaryMaterial), /Comparison guidance|Model row/);
  }
  assert.equal(row.materials._material_ids.text, "A1-TEXT-1");
  const html = renderPage(api, page, { applyCompositionValidation: false });
  assert.match(html, /Comparison guidance/i);
  assert.match(html, /Model row/i);
});

test("vNext learning_sequence renders through existing path", () => {
  const { api } = loadPrismTestApi();
  const page = JSON.parse(JSON.stringify(VNEXT_PAGE));
  delete page.page_synthesis;
  delete page.assessment_check;
  const sections = api.getPageSectionsForRenderForTest(page);
  const ls = sections.find((s) => s.section_id === "learning_sequence");
  assert.ok(ls);
  assert.equal(ls.content.sequence_title, "Self-study sequence");
  assert.equal(ls.content.timeline.length, 2);
  assert.equal(ls.content.timeline[0].activity_id, "A1");
});

test("vNext assessment_check renders through existing path", () => {
  const { api } = loadPrismTestApi();
  const page = JSON.parse(JSON.stringify(VNEXT_PAGE));
  delete page.page_synthesis;
  delete page.learning_sequence;
  const sections = api.getPageSectionsForRenderForTest(page);
  const ac = sections.find((s) => s.section_id === "assessment_check");
  assert.ok(ac);
  assert.equal(ac.content.items[0].item_id, "Q1");
  const html = renderPage(api, page, { applyCompositionValidation: false });
  assert.match(html, /historical materialism/i);
});

test("Journey Compass uses page_synthesis.overview.body for governing inquiry", () => {
  const { api } = loadPrismTestApi();
  const page = JSON.parse(JSON.stringify(VNEXT_PAGE));
  delete page.learning_sequence;
  delete page.assessment_check;
  const compass = api.buildJourneyCompassFromPageForTest(page);
  assert.ok(compass);
  assert.match(compass.governing_inquiry, /capitalism shapes labour relations/i);
  assert.equal(compass.steps.length, 2);
});

test("page_synthesis wins over legacy sections for the same slot", () => {
  const { api } = loadPrismTestApi();
  const page = JSON.parse(JSON.stringify(VNEXT_PAGE));
  page.sections = [
    {
      section_id: "overview",
      heading: "Legacy Overview",
      content: "Legacy overview body should not win."
    }
  ];
  const sections = api.getPageSectionsForRenderForTest(page);
  const overview = sections.find((s) => s.section_id === "overview");
  assert.match(String(overview.content), /capitalism shapes labour relations/i);
  assert.doesNotMatch(String(overview.content), /Legacy overview body should not win/i);
});

test("full vNext page renders through the standard HTML export path", () => {
  const { api } = loadPrismTestApi();
  const html = renderPage(api, VNEXT_PAGE, { applyCompositionValidation: false });
  assert.match(html, /vNext Progressive Enrichment Demo/i);
  assert.match(html, /capitalism shapes labour relations/i);
  assert.match(html, /Class Struggle/i);
  assert.match(html, /Compare Marx/i);
  assert.match(html, /historical materialism/i);
});

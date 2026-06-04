/**
 * Renderer v1 — inflation workshop page fixtures (reduced + full production shape).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixtureDir = path.join(repoRoot, "tests", "fixtures", "page-render");
const reducedFixturePath = path.join(fixtureDir, "ld-inflation-workshop-page.json");
const fullFixturePath = path.join(fixtureDir, "ld-inflation-workshop-page-full.json");
const visibilityFixturePath = path.join(
  fixtureDir,
  "ld-inflation-workshop-learner-visibility-page.json"
);
const csvWorksheetFixturePath = path.join(
  fixtureDir,
  "ld-inflation-workshop-csv-worksheet-page.json"
);

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

function renderPageFixture(api, fixturePath) {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

function sectionAfterHeading(html, headingText) {
  const re = new RegExp(
    headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?(?=<h2|<details class=\"util-meta\"|$)",
    "i"
  );
  const m = html.match(re);
  return m ? m[0] : "";
}

function activityIdsFromFixture(fixturePath) {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const ids = [];
  const sections = Array.isArray(parsed.sections) ? parsed.sections : [];
  sections.forEach((section) => {
    if (String(section.section_id || "").toLowerCase() !== "learning_activities") return;
    const rows = Array.isArray(section.content) ? section.content : [];
    rows.forEach((row) => {
      if (row && row.activity_id) ids.push(String(row.activity_id));
    });
  });
  return ids;
}

function countElementsWithClass(html, className, tagPattern) {
  const tags = tagPattern || "article|div";
  const re = new RegExp("<(?:" + tags + ')\\s+class="[^"]*\\b' + className + '\\b', "gi");
  return (html.match(re) || []).length;
}

function activityTitlesFromFixture(fixturePath) {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const map = {};
  const sections = Array.isArray(parsed.sections) ? parsed.sections : [];
  sections.forEach((section) => {
    if (String(section.section_id || "").toLowerCase() !== "learning_activities") return;
    const rows = Array.isArray(section.content) ? section.content : [];
    rows.forEach((row) => {
      if (row && row.activity_id && row.title) map[String(row.activity_id)] = String(row.title);
    });
  });
  return map;
}

const api = loadPrismTestApi();

test("inflation workshop (learner visibility probe): no PRISMBLANK tokens or sample answers", () => {
  const html = renderPageFixture(api, visibilityFixturePath);
  assert.doesNotMatch(html, /@@PRISMBLANK/i);
  assert.doesNotMatch(html, /Sample Answer/i);
  assert.match(html, /util-worked-example/i);
});

test("inflation workshop (reduced): activities and material patterns", () => {
  const html = renderPageFixture(api, reducedFixturePath);
  assert.match(html, /Inflation concepts warm-up/i);
  assert.match(html, /Measures and impacts table/i);
  const activitiesScope = sectionAfterHeading(html, "Learning activities");
  assert.match(activitiesScope, /Measures and impacts table/i);
  assert.equal((activitiesScope.match(/util-task-block/gi) || []).length, 2);
  assert.ok(countElementsWithClass(activitiesScope, "util-task-card", "article") >= 2);
  assert.ok(countElementsWithClass(activitiesScope, "util-scenario-card", "div") >= 2);
  assert.match(activitiesScope, /<table>[\s\S]*CPI/i);
  assert.match(activitiesScope, /util-prompt-set/);
});

test("inflation workshop (reduced): learning purpose bullets render as lists", () => {
  const html = renderPageFixture(api, reducedFixturePath);
  const scope = sectionAfterHeading(html, "Learning purpose");
  assert.match(scope, /<ul>/);
  assert.match(scope, /<li>[\s\S]*explain what inflation/i);
  assert.doesNotMatch(scope, /<p>[\s\S]*- explain what inflation/i);
});

test("inflation workshop (full): every activity_id in artefact renders in HTML", () => {
  const ids = activityIdsFromFixture(fullFixturePath);
  const titles = activityTitlesFromFixture(fullFixturePath);
  assert.deepEqual(ids.sort(), ["A1", "A2", "A3", "A4", "A5"]);
  const html = renderPageFixture(api, fullFixturePath);
  const activitiesScope = sectionAfterHeading(html, "Learning activities");
  ids.forEach((id) => {
    const title = titles[id];
    assert.ok(title, "fixture should include title for " + id);
    assert.match(
      activitiesScope,
      new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      "expected activity " + id + " title in Learning activities"
    );
  });
  assert.equal((activitiesScope.match(/util-task-block/gi) || []).length, 5);
  assert.match(html, /Session timeline/i);
});

test("inflation workshop (full): strict export does not recover A2 from sequence when missing from sections LA", () => {
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

test("inflation workshop (full): strict export does not recover A2 from activity_materials alone", () => {
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
  assert.equal(countElementsWithClass(activitiesScope, "util-task-block", "article"), 4);
});

test("inflation workshop: Study Tips heading wins over assessment section_id", () => {
  const parsed = JSON.parse(fs.readFileSync(fullFixturePath, "utf8"));
  parsed.sections.push({
    section_id: "assessment_check",
    heading: "Study Tips",
    content: "- Re-read the comparison table before the debrief.\n- Note one limitation of your chosen measure."
  });
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /util-section-icon--study-tips[\s\S]{0,160}<span>Study Tips<\/span>/);
  assert.match(html, /fa-graduation-cap/);
  assert.doesNotMatch(html, /<span>Study Tips<\/span>[\s\S]{0,120}util-section-icon--assessment/);
});

test("inflation workshop (full): object-map learning_activities content still renders all IDs", () => {
  const parsed = JSON.parse(fs.readFileSync(fullFixturePath, "utf8"));
  const la = parsed.sections.find((s) => s.section_id === "learning_activities");
  const map = {};
  la.content.forEach((row) => {
    map[String(row.activity_id)] = Object.assign({}, row);
  });
  la.content = map;
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  const out = String(r.html || "");
  const activitiesScope = sectionAfterHeading(out, "Learning activities");
  assert.match(activitiesScope, /Measuring Inflation: Indicator Comparison/i);
  assert.match(activitiesScope, /Policy and communication wrap-up/i);
  assert.equal((activitiesScope.match(/util-task-block/gi) || []).length, 5);
});

test("inflation workshop (full): A1 six task cards, classification table, split scenarios", () => {
  const html = renderPageFixture(api, fullFixturePath);
  const a1Scope = html.match(/Inflation concepts warm-up[\s\S]*?(?=Measuring Inflation: Indicator Comparison)/i);
  assert.ok(a1Scope, "A1 block should be present");
  const a1 = a1Scope[0];
  assert.equal(countElementsWithClass(a1, "util-task-card", "article"), 6, "A1 should render six task cards");
  assert.match(a1, /Card 1/i);
  assert.match(a1, /Card 6/i);
  assert.match(a1, /<table>[\s\S]*Bread/i);
  assert.equal(countElementsWithClass(a1, "util-scenario-card", "div"), 2);
  assert.match(a1, /Scenario A/i);
  assert.match(a1, /Inflation Scenarios/i);
  assert.doesNotMatch(a1, /Scenario Section Title/i);
});

test("inflation workshop (csv worksheet): A2/A3 comparison_table arrays render semantic tables", () => {
  const html = renderPageFixture(api, csvWorksheetFixturePath);
  const a2Scope = html.match(/Measuring Inflation: Indicator Comparison[\s\S]*?(?=Inflation types comparison)/i);
  const a3Scope = html.match(/Inflation types comparison[\s\S]*?(?=<h2|Production Metadata|$)/i);
  assert.ok(a2Scope && a3Scope, "A2 and A3 activity blocks should render");
  assert.doesNotMatch(a2Scope[0], /<li>Year,Index<\/li>/i);
  assert.doesNotMatch(a3Scope[0], /<li>Aspect,Demand-pull,Cost-push,Built-in<\/li>/i);
  assert.match(a2Scope[0], /Worksheet[\s\S]*<table[\s\S]*<th[^>]*>[\s\S]*Year[\s\S]*<\/th>/i);
  assert.match(a3Scope[0], /Worksheet[\s\S]*<table[\s\S]*<th[^>]*>[\s\S]*Built-in[\s\S]*<\/th>/i);
  assert.match(a3Scope[0], /util-worksheet-blank/);
});

test("inflation workshop (csv worksheet): UI export pipeline matches structured HTML path", () => {
  const page = JSON.parse(fs.readFileSync(csvWorksheetFixturePath, "utf8"));
  const r = api.runUtilityPageExportPipelineForTest(page, {
    applyCompositionValidation: true
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /util-table-scroll util-material-table/);
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
});

test("inflation workshop (full): A2 table, prompt set, and checklist", () => {
  const html = renderPageFixture(api, fullFixturePath);
  const a2Scope = html.match(/Measuring Inflation: Indicator Comparison[\s\S]*?(?=Household scenario — fixed income)/i);
  assert.ok(a2Scope, "A2 block should be present");
  const a2 = a2Scope[0];
  assert.match(a2, /<table>[\s\S]*CPI/i);
  assert.match(a2, /util-prompt-set/);
  assert.match(a2, /student newspaper/i);
  assert.match(a2, /util-checkbox-list|☐/);
});

test("inflation workshop (full): A3 four scenario cards; A4 three scenario cards", () => {
  const html = renderPageFixture(api, fullFixturePath);
  const a3Scope = html.match(/Household scenario — fixed income[\s\S]*?(?=Household scenario — variable costs)/i);
  const a4Scope = html.match(/Household scenario — variable costs[\s\S]*?(?=Policy and communication wrap-up)/i);
  assert.ok(a3Scope && a4Scope);
  assert.equal(countElementsWithClass(a3Scope[0], "util-scenario-card", "div"), 4);
  assert.match(a3Scope[0], /Scenario C/i);
  assert.match(a3Scope[0], /Scenario D/i);
  assert.equal(countElementsWithClass(a4Scope[0], "util-scenario-card", "div"), 3);
  assert.match(a4Scope[0], /Scenario 1/i);
  assert.match(a4Scope[0], /Scenario 3/i);
  assert.match(a3Scope[0], /Worksheet|<table>/i);
  assert.match(a4Scope[0], /Worksheet|<table>/i);
});

test("inflation workshop (full): A5 discussion prompt set renders", () => {
  const html = renderPageFixture(api, fullFixturePath);
  const a5Scope = html.match(/Policy and communication wrap-up[\s\S]*?(?=<h2|Production Metadata|$)/i);
  assert.ok(a5Scope);
  assert.match(a5Scope[0], /util-prompt-set/);
  assert.match(a5Scope[0], /Discussion prompts|CPI or GDP deflator/i);
  assert.match(a5Scope[0], /one limitation of your chosen measure/i);
});

test("inflation workshop (full): learning purpose list and collapsed metadata", () => {
  const html = renderPageFixture(api, fullFixturePath);
  const purposeScope = sectionAfterHeading(html, "Learning purpose");
  assert.match(purposeScope, /<ul>/);
  assert.match(purposeScope, /<li>[\s\S]*compare CPI/i);
  assert.match(html, /Production Metadata/);
  assert.match(html, /<details class="util-meta"/);
  assert.match(html, /util-meta-summary/);
  assert.match(html, /fa-gears/);
});

test("inflation workshop (full): semantic material icons in HTML", () => {
  const html = renderPageFixture(api, fullFixturePath);
  const activitiesScope = sectionAfterHeading(html, "Learning activities");
  assert.match(html, /fa-puzzle-piece/);
  assert.match(activitiesScope, /fa-layer-group/);
  assert.match(activitiesScope, /fa-map-location-dot/);
  assert.match(html, /Measuring Inflation: Indicator Comparison/i);
  assert.match(activitiesScope, /fa-comments/);
  assert.match(activitiesScope, /util-material-icon/);
  assert.match(activitiesScope, /aria-hidden="true"/);
  assert.match(activitiesScope, /util-icon-heading/);
  assert.doesNotMatch(html, /<h2 class="util-section-heading util-icon-heading"/);
});

test("inflation workshop (full): production shape renders visible A2 title in HTML", () => {
  const html = renderPageFixture(api, fullFixturePath);
  assert.match(html, /Measuring Inflation: Indicator Comparison/i);
  const activitiesScope = sectionAfterHeading(html, "Learning activities");
  const titles = activityTitlesFromFixture(fullFixturePath);
  assert.match(
    activitiesScope,
    new RegExp(titles.A2.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    "A2 title must appear in Learning activities HTML"
  );
  const a2Scope = html.match(/Measuring Inflation: Indicator Comparison[\s\S]*?(?=Household scenario — fixed income)/i);
  assert.ok(a2Scope, "A2 activity block should be present");
  assert.match(a2Scope[0], /util-prompt-set/);
  assert.match(a2Scope[0], /<table>[\s\S]*PPI/i);
});

test("inflation workshop (full): learning_object mode requires A2 in section content (strict closure)", () => {
  const parsed = JSON.parse(fs.readFileSync(fullFixturePath, "utf8"));
  const pageSectionsSnapshot = JSON.parse(JSON.stringify(parsed.sections));
  const la = parsed.sections.find((s) => s.section_id === "learning_activities");
  la.content = la.content.filter((row) => String(row.activity_id) !== "A2");
  const r = api.buildUtilityStructuredHtmlForTest(parsed, ["sections"], {
    presentationMode: "learning_object",
    pageSections: pageSectionsSnapshot
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  const loScreen = html.match(/data-lo-screen="3"[\s\S]*?(?=data-lo-screen="4"|$)/i);
  assert.ok(loScreen, "learning activities LO screen should exist");
  assert.doesNotMatch(loScreen[0], /Measuring Inflation: Indicator Comparison/i);
});

const CATALOG_PAGE_SECTION_ORDER = [
  "overview",
  "learning_purpose",
  "knowledge_summary",
  "learning_activities",
  "assessment_check",
  "support_notes"
];

test("inflation workshop (full): catalog sectionOrder prefers sections[] over partial top-level learning_activities", () => {
  const parsed = JSON.parse(fs.readFileSync(fullFixturePath, "utf8"));
  const la = parsed.sections.find((s) => s.section_id === "learning_activities");
  parsed.learning_activities = la.content.filter((row) => String(row.activity_id) !== "A2");
  const r = api.buildUtilityStructuredHtmlForTest(parsed, CATALOG_PAGE_SECTION_ORDER);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /Measuring Inflation: Indicator Comparison/i);
  const activitiesScope = sectionAfterHeading(html, "Learning activities");
  assert.match(
    activitiesScope,
    /Measuring Inflation: Indicator Comparison/i,
    "A2 title must render when sections[] is authoritative"
  );
  assert.equal((activitiesScope.match(/util-task-block/gi) || []).length, 5);
});

test("inflation workshop (full): isolated LA section strict mode does not fabricate A2 from pageSections probe", () => {
  const parsed = JSON.parse(fs.readFileSync(fullFixturePath, "utf8"));
  const laSection = parsed.sections.find((s) => s.section_id === "learning_activities");
  const laOnly = JSON.parse(JSON.stringify(laSection));
  laOnly.content = laOnly.content.filter((row) => String(row.activity_id) !== "A2");
  const html = api.utilityRenderPageSectionsForTest([laOnly], {
    pageSections: parsed.sections,
    strictCompositionClosure: true,
    cleanupInlineMarkdown: true,
    suppressInternalMetadata: true
  });
  assert.doesNotMatch(html, /Measuring Inflation: Indicator Comparison/i);
});

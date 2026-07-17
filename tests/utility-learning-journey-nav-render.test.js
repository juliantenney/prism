/**
 * Sprint 55 — Learning Journey ribbon (renderer-only).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const marxFixturePath = path.join(repoRoot, "tests", "fixtures", "page-render", "marx-self-study-page.json");
const inflationFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-page-full.json"
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function bodyHtml(html) {
  const m = String(html || "").match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1] : String(html || "");
}

test("learning journey ribbon: omitted when fewer than two activities", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    title: "Single activity",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Only activity",
            learner_task: "Do one thing.",
            materials: { text: "Some reading." }
          }
        ]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  const html = r.html || "";
  const acts = api.utilityCollectLearningJourneyActivitiesFromExportHtmlForTest(html);
  assert.equal(acts.length, 1, "expected one learning activity article");
  assert.ok(
    !/<nav class="util-journey-nav"/.test(html),
    "ribbon should not render for one activity"
  );
});

test("learning journey sticky header: multi-activity page restores journey nav", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r.html, "expected html export");
  const html = r.html;

  assert.match(html, /<header class="util-learning-header">/);
  assert.match(html, /util-learning-header__title/);
  assert.match(html, /util-learning-header__meta/);
  assert.match(html, /util-learning-header__description/);
  assert.match(html, /util-learning-header__duration/);
  assert.doesNotMatch(
    html,
    /(?:-|–|—|·|\|)\s*<span class="util-learning-header__duration">/
  );
  assert.match(html, /\.util-learning-header\{position:sticky;top:0/);
  const headerCss = html.match(/\.util-learning-header\{([^}]*)\}/);
  assert.ok(headerCss);
  assert.doesNotMatch(headerCss[1], /border-bottom|box-shadow/);
  assert.match(html, /\.util-learning-header__meta\{[^}]*margin:0 0 var\(--space-2\)/);
  assert.match(html, /\.util-learning-header__duration\{margin-left:0/);
  assert.doesNotMatch(html, /h2\.util-section-heading\{[^}]*border-bottom/);
  assert.doesNotMatch(html, /\.util-knowledge-summary\{[^}]*border-top/);
  assert.match(html, /#journey-orient>section\{margin:0;padding:0\}/);
  assert.match(
    html,
    /#journey-orient>section\+section\{margin-top:var\(--space-4\)\}/
  );
  assert.match(
    html,
    /#journey-orient>section>h2\.util-section-heading\{margin:0 0 var\(--space-2\);padding:0\}/
  );
  assert.match(
    html,
    /\.util-knowledge-summary__content\{margin:0;padding:0;background:transparent\}/
  );
  assert.doesNotMatch(html, /\.util-knowledge-summary--prose\{[^}]*padding/);
  assert.match(html, /@media print\{[^}]*\.util-learning-header\{display:none/);
  assert.match(html, /util-journey-nav--compact/);
  assert.match(html, /util-journey-link/);
  assert.match(html, /util-journey-arrow/);
  assert.match(html, /util-journey-track/);
  assert.match(html, /util-journey-fill/);
  assert.match(html, /util-journey-dot/);
  assert.match(html, /--journey-progress/);
  assert.match(html, /journeyToTrackPct/);
  assert.match(html, /util-page-export--with-journey-nav/);

  const sections = html.match(/data-journey-section="true"/g) || [];
  assert.ok(sections.length >= 3, "expected orient plus activity journey sections");

  assert.match(html, /\bid="journey-orient"/);
  assert.doesNotMatch(html, /Journey compass/i);
  assert.doesNotMatch(html, /<section class="util-journey-compass-header"/);
  assert.match(
    html,
    /\.util-overview p,.util-overview li,[^}]*\{font-weight:400\}/
  );

  const ids = [...html.matchAll(/\bid="activity-\d+"/g)].map((m) => m[0]);
  assert.ok(ids.length >= 2, "expected stable activity ids");
});

test("top orientation: introductory sections render as aligned h2 sections", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    title: "Journey orientation",
    page_profile: "learner",
    learning_outcomes: [
      { id: "LO1", statement: "Identify the core claim in a short passage." },
      { id: "LO2", statement: "Explain how evidence supports that claim." }
    ],
    sections: [
      {
        section_id: "overview",
        heading: "Overview",
        content: "Introductory overview prose remains visible.\n\n---\n\nOverview continuation remains visible."
      },
      {
        section_id: "learning_purpose",
        heading: "Learning Purpose",
        content: "Purpose prose remains visible."
      },
      {
        section_id: "knowledge_summary",
        heading: "Knowledge Summary",
        content: "Knowledge summary prose remains visible."
      },
      {
        section_id: "learning_sequence",
        heading: "Learning Journey",
        content: {
          steps: [{ title: "First step", description: "Begin here." }]
        }
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r.html, "expected html export");
  const body = bodyHtml(r.html);
  assert.match(
    body,
    /<div id="journey-orient" data-journey-section="true">\s*<section class="util-overview">/
  );
  assert.match(body, /<section class="util-overview">/);
  assert.match(body, /<section class="util-learning-purpose">/);
  assert.match(body, /<section class="util-learning-outcomes">/);
  assert.match(body, /<section class="util-knowledge-summary">/);
  assert.match(body, /<section class="util-learning-journey">/);
  assert.match(body, /<div class="util-overview__content">/);
  assert.match(body, /<div class="util-learning-purpose__content">/);
  assert.match(body, /<div class="util-learning-outcomes__content">/);
  assert.match(
    body,
    /<div class="util-knowledge-summary__content util-knowledge-summary--prose">/
  );
  assert.match(body, /<div class="util-learning-journey__content">/);
  assert.match(body, /Introductory overview prose remains visible/);
  assert.match(body, /Overview continuation remains visible/);
  assert.match(body, /Purpose prose remains visible/);
  assert.match(body, /Identify the core claim in a short passage/);
  assert.match(body, /Explain how evidence supports that claim/);
  assert.match(body, /Knowledge summary prose remains visible/);
  assert.match(body, /<ul class="util-learning-outcomes__list">/);
  assert.doesNotMatch(body, /util-learning-outcomes__content[\s\S]{0,200}>\s*(Outcomes|Items|Statement|Text|ID)\s*</i);
  [
    "Overview",
    "Learning Purpose",
    "Learning Outcomes",
    "Knowledge Summary",
    "Learning Journey"
  ].forEach((heading) => {
    assert.match(
      body,
      new RegExp(
        '<h2 class="util-section-heading">[\\s\\S]*?<span>' +
          heading +
          "<\\/span><\\/h2>"
      )
    );
  });
  assert.doesNotMatch(
    body,
    /<p[^>]*>\s*(?:Overview|Learning Purpose|Learning Outcomes|Learning Journey)\s*<\/p>/i
  );
  assert.doesNotMatch(body, /<hr\b/i);
  const openingOrder = [
    "util-overview",
    "util-learning-purpose",
    "util-learning-outcomes",
    "util-knowledge-summary",
    "util-learning-journey"
  ].map((className) => body.indexOf('<section class="' + className + '">'));
  assert.ok(openingOrder.every((index) => index !== -1));
  assert.deepEqual(openingOrder, openingOrder.slice().sort((a, b) => a - b));
});

test("learning journey nav labels: strip LO prefixes and shorten", () => {
  const api = loadPrismTestApi();
  const normalize = api.utilityNormalizeJourneyNavLabelForTest;
  assert.equal(
    normalize("LO1 — Defining Digital Accessibility in Practice"),
    "Defining Accessibility"
  );
  assert.equal(normalize("LO2 — Analysing Barriers and User Impact"), "Barriers & Impact");
  assert.equal(normalize("LO3 — Applying POUR to Evaluate a Resource"), "POUR Evaluation");
  assert.equal(normalize("LO4 — Improving an Accessible Document"), "Improve Document");
  assert.equal(normalize("LO5 — Adapting Teaching for Accessibility"), "Teaching Accessibly");
  assert.equal(normalize("A1 — First step"), "First step");
  assert.equal(normalize("Activity 1: Warm up"), "Warm up");
});

test("learning journey nav labels: two-line display formatting", () => {
  const api = loadPrismTestApi();
  const format = api.utilityFormatJourneyNavLabelDisplayForTest;
  assert.equal(format("Orient"), "Orient");
  assert.equal(format("Defining Accessibility"), "Defining<br>Accessibility");
  assert.equal(format("Barriers & Impact"), "Barriers &amp;<br>Impact");
  assert.equal(format("POUR Evaluation"), "POUR<br>Evaluation");
  assert.equal(format("Improve Document"), "Improve<br>Document");
  assert.equal(format("Teaching Accessibly"), "Teaching<br>Accessibly");
});

test("learning journey structural progress: section-based scale", () => {
  const api = loadPrismTestApi();
  const progress = api.utilityComputeJourneyStructuralProgressForTest;
  assert.equal(progress(0, 0, 4), 0);
  assert.ok(Math.abs(progress(0, 0.5, 4) - 50 / 3) < 1e-9);
  assert.ok(Math.abs(progress(1, 0, 4) - 100 / 3) < 1e-9);
  assert.equal(progress(3, 0, 4), 100);
  assert.ok(Math.abs(progress(1, 0.5, 4) - 50) < 1e-9);
  assert.equal(progress(2, 1, 4), 100);
});

test("learning journey layout: compact up to 7 items, scroll beyond", () => {
  const api = loadPrismTestApi();
  const layout = api.utilityLearningJourneyNavLayoutClassForTest;
  assert.equal(layout(4), " util-journey-nav--compact");
  assert.equal(layout(7), " util-journey-nav--compact");
  assert.equal(layout(8), " util-journey-nav--scroll");
});

test("learning journey arrows: compact layout only", () => {
  const api = loadPrismTestApi();
  const render = api.utilityRenderLearningJourneyNavHtmlForTest;
  const compact = render([
    { id: "journey-orient", label: "Orient" },
    { id: "activity-1", label: "Defining Accessibility" },
    { id: "activity-2", label: "Barriers & Impact" },
    { id: "activity-3", label: "POUR Evaluation" }
  ]);
  assert.match(compact, /util-journey-nav--compact/);
  assert.equal((compact.match(/util-journey-arrow/g) || []).length, 3);
  assert.doesNotMatch(compact, /util-journey-arrow[^<]*<\/span>\s*<\/div>/);
  assert.match(compact, /util-journey-arrow" aria-hidden="true">→<\/span><a class="util-journey-link"/);

  const scrollItems = [];
  for (let i = 0; i < 8; i += 1) {
    scrollItems.push({ id: "activity-" + i, label: "Step " + i });
  }
  const scroll = render(scrollItems);
  assert.match(scroll, /util-journey-nav--scroll/);
  assert.doesNotMatch(scroll, /util-journey-arrow/);
});

test("learning journey sticky header: inflation workshop includes journey nav", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(inflationFixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(page);
  const html = r.html || "";
  assert.match(html, /<header class="util-learning-header">/);
  assert.match(html, /util-journey-nav/);
  assert.match(html, /util-journey-link/);
  assert.match(html, /util-journey-arrow/);
  assert.match(html, /\bid="journey-orient"/);
  const activities = api.utilityCollectLearningJourneyActivitiesFromExportHtmlForTest(html);
  assert.ok(activities.length >= 2);
});

test("learning journey ribbon: sequence timeline without learning activities omits ribbon", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    title: "Timeline only",
    page_profile: "learner",
    sections: [
      {
        section_id: "overview",
        heading: "Overview",
        content: { text: "Workshop overview only." }
      },
      {
        section_id: "learning_sequence",
        heading: "Sequence",
        content: [
          {
            activity_id: "LO1",
            title: "Intro",
            learner_task: "Listen.",
            duration_minutes: 5
          },
          {
            activity_id: "LO2",
            title: "Discuss",
            learner_task: "Talk.",
            duration_minutes: 10
          }
        ]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  const html = r.html || "";
  const acts = api.utilityCollectLearningJourneyActivitiesFromExportHtmlForTest(html);
  assert.equal(acts.length, 0, "timeline steps are not learning journey activities");
  assert.ok(
    !/<nav class="util-journey-nav"/.test(html),
    "timeline-only pages should not get ribbon"
  );
});

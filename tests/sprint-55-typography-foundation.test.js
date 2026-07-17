/**
 * Sprint 55 — typography foundation pass (editorial reading measure).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const marxFixturePath = path.join(repoRoot, "tests", "fixtures", "page-render", "marx-beat-render-page.json");
const marxSelfStudyFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "marx-self-study-page.json"
);

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => false },
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

test("typography foundation: export CSS includes reading measure and spacing scale", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(html, /max-width:68ch/);
  assert.match(html, /--space-1:\.375rem/);
  assert.match(html, /--space-5:2\.5rem/);
});

test("typography foundation: learning header shell stays export width, prose at 68ch", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(
    html,
    /body\.util-page-export--with-learning-header[^}]*max-width:920px/
  );
  assert.match(
    html,
    /body\.util-page-export>section,body\.util-page-export>div\[data-journey-section\][^}]*max-width:68ch/
  );
  assert.doesNotMatch(
    html,
    /body\.util-page-export--with-learning-header\{max-width:68ch/
  );
  assert.match(html, /\.util-learning-header[^}]*max-width:none/);
});

test("typography foundation: activities render as document sections not cards", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(html, /article\.util-task-block[^}]*border:0/);
  assert.match(html, /article\.util-task-block[^}]*box-shadow:none/);
  assert.match(html, /article\.util-task-block[^}]*background:transparent/);
});

test("typography foundation: beat headings and subdued material headings", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(html, /\.util-beat-heading\{[^}]*font-size:1\.05rem/);
  assert.match(html, /h4\.util-material-heading[^}]*font-size:\.95rem/);
  assert.match(html, /h4\.util-material-heading[^}]*text-transform:none/);
});

test("document rhythm: body elements and headings use the shared spacing scale", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(
    html,
    /body\.util-page-export p,body\.util-page-export ul,body\.util-page-export ol,body\.util-page-export table\{margin-top:0;margin-bottom:var\(--space-3\)\}/
  );
  assert.match(
    html,
    /body\.util-page-export h2\.util-section-heading\{margin:0 0 var\(--space-2\);padding:0\}/
  );
  assert.match(
    html,
    /body\.util-page-export h4\.util-material-heading,body\.util-page-export \.util-material-heading\{margin:0 0 var\(--space-2\)\}/
  );
  assert.match(
    html,
    /body\.util-page-export \.util-activity-header h2,body\.util-page-export \.util-activity-header h3,body\.util-page-export \.util-activity-title\{margin:0\}/
  );
  assert.match(
    html,
    /body\.util-page-export \.util-assessment-section>h2\.util-section-heading\{margin:0 0 var\(--space-2\);padding:0\}/
  );
  assert.match(
    html,
    /body\.util-page-export article\.util-assessment-item,body\.util-page-export article\.util-assessment-item\.util-task-block\{margin:0\}/
  );
  assert.match(
    html,
    /\.util-checklist\{list-style:disc;margin:0 0 var\(--space-2\) 1\.25rem;padding:0\}/
  );
});

test("document rhythm: instructional containers share first and last child rules", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const firstChildRule = html.match(
    /body\.util-page-export \.util-material-block>:first-child[^{}]+\{margin-top:0\}/
  );
  const lastChildRule = html.match(
    /body\.util-page-export \.util-material-block>:last-child[^{}]+\{margin-bottom:0\}/
  );
  assert.ok(firstChildRule);
  assert.ok(lastChildRule);
  [
    "util-worked-example",
    "util-scenario-card",
    "util-template-block",
    "util-prompt-set",
    "util-checklist-block",
    "util-expected-output"
  ].forEach(function (className) {
    assert.match(firstChildRule[0], new RegExp("\\." + className + ">:first-child"));
    assert.match(lastChildRule[0], new RegExp("\\." + className + ">:last-child"));
  });
  assert.doesNotMatch(html, /(?:<style>|})\.util-expected-output\{margin:/);
});

test("generic cleanup: learner content uses lesson, activity, and beat heading levels only", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const learnerBody = html
    .split('<details class="util-meta"')[0]
    .replace(
      /<section\b[^>]*class="[^"]*util-assessment-section[^"]*"[^>]*>[\s\S]*?<\/section>/gi,
      ""
    );
  assert.equal((learnerBody.match(/<h1\b/gi) || []).length, 1);
  assert.match(learnerBody, /<h2 class="util-activity-title">/);
  assert.match(learnerBody, /<h3 class="util-beat-heading">/);
  assert.doesNotMatch(learnerBody, /<h[4-6]\b/i);
  assert.doesNotMatch(learnerBody, /<h2[^>]*>\s*Learning Activities\s*<\/h2>/i);
});

test("generic cleanup: sticky description drops a leaked Overview prefix", () => {
  const api = loadPrismTestApi();
  const source =
    '<!doctype html><html><body><h1>Example lesson</h1>' +
    '<article class="util-task-block"><div class="util-activity-header">' +
    '<h2 class="util-activity-title">First activity</h2></div></article>' +
    '<article class="util-task-block"><div class="util-activity-header">' +
    '<h2 class="util-activity-title">Second activity</h2></div></article>' +
    "</body></html>";
  const html = api.utilityApplyLearningJourneyHeaderToExportHtmlForTest(source, {
    journeyCompassEnabled: true,
    journeyCompass: {
      governing_inquiry: "Overview This lesson introduces a useful idea.",
      session_frame: "60 min session",
      steps: [
        { activity_id: "A1", title: "First activity", duration_minutes: 30 },
        { activity_id: "A2", title: "Second activity", duration_minutes: 30 }
      ]
    }
  });
  const header = html.match(/<header class="util-learning-header"[\s\S]*?<\/header>/i);
  assert.ok(header);
  assert.match(
    header[0],
    /<span class="util-learning-header__description">This lesson introduces a useful idea\.<\/span>/
  );
  assert.match(
    header[0],
    /<\/span> <span class="util-learning-header__duration">60 mins\.<\/span>/
  );
  assert.doesNotMatch(header[0], /(?:-|–|—|·|\|)\s*60 mins\./);
  assert.doesNotMatch(header[0], />Overview\b/i);
});

test("presentation repair: obsolete activity-column CSS is absent", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.doesNotMatch(html, /\.util-activity-row\.util-page-columns\{/);
  assert.doesNotMatch(html, /\.util-journey-compass(?:--activity)?\{/);
  assert.doesNotMatch(html, /\.util-page-resource\{/);
});

test("presentation repair: generated orientation labels do not bold explanatory text", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxSelfStudyFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(html, /<span class="util-framing-label">How to think:<\/span>/);
  assert.doesNotMatch(
    html,
    /<p class="util-activity-preamble-cue[^"]*"><strong>/
  );
  assert.match(
    html,
    /\.util-activity-preamble p[^}]*font-weight:400/
  );
});

test("presentation repair: opening layout wrappers are removed without losing content", () => {
  const api = loadPrismTestApi();
  const html = api.utilityNormalizeLearnerContentHierarchyForTest(
    '<section><h2 class="util-section-heading">Orientation</h2>' +
      '<div class="util-activity-row util-page-columns">' +
      '<aside class="util-journey-compass util-journey-compass--activity">' +
      "<p>Commentary remains.</p></aside>" +
      '<div class="util-page-resource"><div class="util-card-grid">' +
      '<article class="util-task-card"><p>Resource remains.</p></article>' +
      "</div></div>" +
      "</div></section>"
  );
  assert.doesNotMatch(
    html,
    /util-activity-row|util-page-columns|util-journey-compass|util-page-resource|util-card-grid|util-task-card/
  );
  assert.match(html, /Commentary remains\./);
  assert.match(html, /Resource remains\./);
  assert.ok(
    html.indexOf("Commentary remains.") < html.indexOf("Resource remains.")
  );
});

test("presentation repair: sentence-like opening labels become normal paragraphs", () => {
  const api = loadPrismTestApi();
  const sentence =
    "This full explanatory sentence introduces the lesson and should use normal paragraph weight.";
  const html = api.utilityNormalizeLearnerContentHierarchyForTest(
    "<section><h3><strong>" + sentence + "</strong></h3></section>"
  );
  assert.match(html, new RegExp("<p>" + sentence + "</p>"));
  assert.doesNotMatch(html, /<strong>|util-supporting-label/);
});

test("presentation repair: section headings keep matching h2 close tags", () => {
  const api = loadPrismTestApi();
  const html = api.utilityNormalizeLearnerContentHierarchyForTest(
    '<section><h2 class="util-section-heading">' +
      '<svg xmlns="http://www.w3.org/2000/svg"><path d="M15 14c.2-1"></path></svg>' +
      "<span>Knowledge Summary</span></h2><p>Body prose.</p></section>"
  );
  assert.match(
    html,
    /<h2 class="util-section-heading">[\s\S]*<span>Knowledge Summary<\/span><\/h2>/
  );
  assert.doesNotMatch(
    html,
    /<h2 class="util-section-heading">[\s\S]*Knowledge Summary<\/span><\/p>/
  );
});

test("top orientation: Overview label is removed while Learning Purpose remains body text", () => {
  const api = loadPrismTestApi();
  const html = api.utilityNormalizeLearnerContentHierarchyForTest(
    '<section><p class="util-supporting-label">Overview</p><p>Intro prose.</p>' +
      '<p class="util-supporting-label">Learning Purpose</p><p>Purpose prose.</p></section>'
  );
  assert.doesNotMatch(html, />\s*Overview\s*</);
  assert.match(html, /<section><p>Intro prose\.<\/p>/);
  assert.match(html, /<p>Learning Purpose<\/p>\s*<p>Purpose prose\.<\/p>/);
  assert.doesNotMatch(
    html,
    /util-supporting-label[^>]*>\s*(?:Overview|Learning Purpose)/
  );
});

test("typography foundation: instructional blocks use editorial chrome reduction", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(html, /\.util-worked-example[^}]*background:transparent/);
  assert.match(html, /\.util-pedagogic-callout[^}]*box-shadow:none/);
  assert.match(html, /\.util-cognition[^}]*background:transparent/);
  assert.match(html, /\.util-support-note[^}]*background:transparent/);
});

test("typography foundation: Marx A1 retains beat structure with calmer presentation", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const a1 = html.match(
    /Historical Materialism and Capitalism[\s\S]*?(?=Surplus Value and Exploitation|Is Marx Still Relevant|$)/i
  );
  assert.ok(a1, "expected A1 block");
  assert.match(a1[0], /class="util-beat-heading"/);
  assert.match(a1[0], />Understand</);
  assert.match(a1[0], />See it modelled</);
  assert.match(a1[0], />Check your work</);
});

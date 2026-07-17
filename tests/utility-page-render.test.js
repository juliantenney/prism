const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures", "page-render");

const PAGE_METADATA_ORDER = [
  "sections",
  "source_artefacts",
  "constraints_applied",
  "generation_notes"
];

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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  assert.equal(typeof api.buildUtilityStructuredHtmlForTest, "function");
  return { api };
}

function loadPageFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function renderPageFixture(api, fixtureName, sectionOrder) {
  const parsed = loadPageFixture(fixtureName);
  const r = api.buildUtilityStructuredHtmlForTest(parsed, sectionOrder);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

function mainBodyHtml(html) {
  return String(html || "").split('<details class="util-meta"')[0];
}

function markupBodyHtml(html) {
  return mainBodyHtml(html).replace(/<style[\s\S]*?<\/style>/gi, "");
}

function sectionScope(html, headingText) {
  const scopeHtml = mainBodyHtml(html);
  const escaped = headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    "<h2[^>]*>[\\s\\S]*?<span>" + escaped + "</span>[\\s\\S]*?(?=<h2\\b|<details class=\"util-meta\"|$)",
    "i"
  );
  const m = scopeHtml.match(re);
  return m ? m[0] : scopeHtml;
}

function activityArticleScope(html, headingText) {
  const scopeHtml = mainBodyHtml(html);
  const escaped = headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    '<article class="util-task-block[^"]*"[\\s\\S]*?<h2[^>]*>[^<]*' + escaped + "[\\s\\S]*?</article>",
    "i"
  );
  const m = scopeHtml.match(re);
  return m ? m[0] : "";
}

/** Shared HTML shape semantics (domain-agnostic). */
function assertNoParagraphListNesting(html) {
  const block = markupBodyHtml(html);
  const chunks = block.split(/<\/p>(?![a-z])/i);
  for (const chunk of chunks) {
    if (!/<p\b/i.test(chunk)) continue;
    const insideP = chunk.replace(/^[\s\S]*?<p[^>]*>/i, "");
    assert.equal(
      /<ul\b/i.test(insideP),
      false,
      "expected no <ul> inside an open <p> (before </p>)"
    );
  }
  assert.equal(
    /<ul\b[\s\S]*?<\/ul>\s*<\/p>/i.test(block),
    false,
    "expected no </ul> immediately before </p>"
  );
}

function assertNoOrphanListItems(html) {
  let stripped = String(html || "");
  stripped = stripped.replace(/<ul class="util-checklist"[^>]*>[\s\S]*?<\/ul>/gi, "");
  stripped = stripped.replace(/<ul class="util-checkbox-list"[^>]*>[\s\S]*?<\/ul>/gi, "");
  stripped = stripped.replace(/<ul[^>]*>[\s\S]*?<\/ul>/gi, "");
  stripped = stripped.replace(/<ol[^>]*>[\s\S]*?<\/ol>/gi, "");
  assert.equal(/<li\b/i.test(stripped), false, "expected no orphan <li> outside lists");
}

function assertAdjacentCompatibleUlMerged(html) {
  const plainOnly = String(html || "")
    .replace(/<ul\b[^>]*\butil-checklist\b[^>]*>[\s\S]*?<\/ul>/gi, "")
    .replace(/<ul\b[^>]*\butil-checkbox-list\b[^>]*>[\s\S]*?<\/ul>/gi, "");
  assert.equal(
    /<\/ul>\s*<ul\b/i.test(plainOnly),
    false,
    "expected adjacent plain <ul> blocks merged (checklist boundaries may remain)"
  );
}

function assertPlainChecklistsPreserved(html) {
  const blocks = html.match(/<ul class="util-checklist"[^>]*>[\s\S]*?<\/ul>/gi) || [];
  assert.ok(blocks.length > 0, "expected at least one util-checklist block");
  for (const block of blocks) {
    assert.doesNotMatch(block, /util-checkbox/);
    assert.doesNotMatch(block, /☐/);
    assert.equal(/<p>\s*<ul/i.test(block), false, "checklist must not be inside <p>");
    assert.equal(/<ul\b/i.test(block.replace(/^<ul[^>]*>/i, "")), false, "no nested <ul> in checklist");
  }
}

function assertTablesPreserved(html) {
  const tables = html.match(/<table>[\s\S]*?<\/table>/gi) || [];
  assert.ok(tables.length > 0, "expected at least one <table>");
  for (const table of tables) {
    assert.doesNotMatch(table, /<ul\b/i, "table block must not contain list markup");
    assert.match(table, /<t[hd]>/i);
  }
}

function assertMcqOptionsNotCheckboxLists(html) {
  const scope =
    html.match(/Select the best response[\s\S]{0,2500}/i)?.[0] ||
    html.match(/Question 1[\s\S]{0,2500}/i)?.[0] ||
    "";
  assert.ok(scope, "expected MCQ stem in output");
  assert.match(scope, /Option alpha/);
  assert.match(scope, /Option beta/);
  assert.doesNotMatch(
    scope,
    /util-checkbox-list[\s\S]*Option alpha/i,
    "MCQ letter options must not be rendered as util-checkbox-list"
  );
}

function assertStandardListSemantics(html, scope, expectedLiCount) {
  const block = scope || html;
  assert.match(block, /<ul>/);
  const liCount = (block.match(/<li>/g) || []).length;
  if (typeof expectedLiCount === "number") {
    assert.equal(liCount, expectedLiCount, `expected ${expectedLiCount} <li> in scope`);
  }
  assertNoParagraphListNesting(block);
  assertNoOrphanListItems(block);
  assertAdjacentCompatibleUlMerged(block);
}

function assertProductionMetadataFold(html) {
  assert.match(html, /(?:Production Metadata|About this page|Document information)/);
  const body = mainBodyHtml(html);
  const meta = html.match(/<details class="util-meta"[\s\S]*$/i);
  assert.ok(meta, "expected util-meta details");
  assertNoParagraphListNesting(html);
  assertNoOrphanListItems(html);
  return { body, meta: meta[0] };
}

function assertLearnerProductionMetadataBoundary(html) {
  const body = mainBodyHtml(html);
  assert.doesNotMatch(body, /<h2[^>]*>\s*Source Artefacts/i);
  assert.doesNotMatch(body, /<h2[^>]*>\s*Generation Notes/i);
  assert.doesNotMatch(body, /<h2[^>]*>\s*Constraints Applied/i);
  assert.doesNotMatch(body, /<h2[^>]*>\s*Production Metadata/i);
  assert.doesNotMatch(body, /<strong>Audience:<\/strong>/i);
}

function assertSanitizedPageSemantics(html, opts) {
  opts = opts || {};
  assertNoParagraphListNesting(html);
  assertNoOrphanListItems(html);
  assertAdjacentCompatibleUlMerged(html);
  if (opts.expectCheckbox) assertPlainChecklistsPreserved(html);
  if (opts.expectTable) assertTablesPreserved(html);
  if (opts.expectMcq) assertMcqOptionsNotCheckboxLists(html);
}

// --- Content shapes (fixtures named by shape, not domain) ---

test("page shape: string bullet block → ul/li semantics", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-string-bullet-block.json");
  const scope = sectionScope(html, "Section A");
  assertStandardListSemantics(html, scope, 3);
  assert.match(scope, /First line in a multiline bullet block/);
  assertSanitizedPageSemantics(html);
});

test("page shape: inline bullet run → ul/li semantics", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-inline-bullet-run.json");
  assertStandardListSemantics(html, sectionScope(html, "Section A"), 3);
  assert.match(html, /alpha/);
  assertSanitizedPageSemantics(html);
});

test("page shape: primitive string array → ul/li semantics", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-primitive-string-array.json");
  assertStandardListSemantics(html, sectionScope(html, "Section A"), 3);
  assert.match(html, /Array element one/);
  assertSanitizedPageSemantics(html);
});

test("page shape: prose + bullets + prose → p, ul, p without list nesting", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-prose-bullets-prose.json");
  const scope = sectionScope(html, "Section A");
  assert.match(scope, /Opening prose paragraph/);
  assert.match(scope, /<ul>/);
  assert.match(scope, /Closing prose paragraph/);
  assert.equal(/<p>[\s\S]*<ul>[\s\S]*<\/p>[\s\S]*Closing/i.test(scope), false);
  assertSanitizedPageSemantics(html);
});

test("page shape: checkbox list → util-checklist preserved", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-checkbox-list.json");
  assert.match(html, /util-checklist/);
  assert.doesNotMatch(markupBodyHtml(html), /☐|<span class="util-checkbox"/);
  assertPlainChecklistsPreserved(html);
  assertSanitizedPageSemantics(html, { expectCheckbox: true });
});

test("page shape: markdown table → table preserved without list markup", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-markdown-table.json");
  assertTablesPreserved(html);
  assertSanitizedPageSemantics(html, { expectTable: true });
  assert.match(html, /cell x/);
});

test("slice 31-4: markdown table shape uses scroll wrapper when table is exported", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-markdown-table.json");
  if (html.includes("util-table-scroll")) {
    assert.match(html, /util-table-scroll/);
    assert.doesNotMatch(html, /<p>\s*\|[^<]+\|/);
  }
});

test("slice 31-5: activity echo dedupe suppresses exact framing and cross-block repeats", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-activity-echo-dedupe.json");
  const scope = activityArticleScope(html, "Echo dedupe showcase");
  const preamblePhrase = "Read the scenario carefully before you write";
  const evidencePhrase = "Use evidence from the passage when you answer";
  const taskPhrase = "Write a short paragraph comparing the two sources";
  assert.equal(
    (scope.match(new RegExp(preamblePhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length,
    1,
    "exact preamble echo should render once"
  );
  assert.equal(
    (scope.match(new RegExp(evidencePhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length,
    1,
    "exact reasoning echo should render once"
  );
  assert.match(scope, /util-activity-task--primary/);
  assert.match(scope, new RegExp(taskPhrase, "i"));
  assert.doesNotMatch(scope, /<h4[^>]*>\s*Guidance\s*<\/h4>/i);
  assert.doesNotMatch(scope, /<strong>Task:<\/strong>\s*Read the scenario/i);
  assert.doesNotMatch(
    scope,
    new RegExp("util-support-note[\\s\\S]{0,200}" + taskPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    "support note must not repeat task wording"
  );
  assert.match(scope, /Primary source excerpt/);
});

test("slice 31-5: activity echo dedupe retains distinct orientation and reasoning labels", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-activity-echo-dedupe.json");
  const scope = activityArticleScope(html, "Echo dedupe showcase");
  assert.match(scope, /Intellectual frame:/i);
  assert.match(scope, /How to think:/i);
  assert.doesNotMatch(
    scope,
    /<div class="util-activity-preamble">[\s\S]{0,160}Read the scenario carefully before you write/i,
    "later preamble block suppressed when intellectual frame already rendered the text"
  );
  assert.doesNotMatch(scope, /Using evidence:/i);
  const thinkIdx = scope.indexOf("How to think:");
  const taskIdx = scope.indexOf("util-activity-task--primary");
  assert.ok(thinkIdx !== -1 && taskIdx !== -1);
  assert.ok(thinkIdx < taskIdx);
});

test("page shape: knowledge summary prose → util-knowledge-summary wrapper", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-knowledge-summary-prose.json");
  const scope = sectionScope(html, "Knowledge Summary");
  assert.match(scope, /util-knowledge-summary/);
  assert.match(scope, /util-knowledge-summary--prose/);
  assert.match(scope, /Statistical significance describes/);
  assert.match(scope, /null hypothesis/);
  assert.doesNotMatch(scope, /util-definition-list/i);
});

test("generic cleanup: schema field labels are hidden while their learner content remains", () => {
  const { api } = loadPrismTestApi();
  const body = api.utilityNormalizeLearnerContentHierarchyForTest(
    '<h5>Body</h5><p>Body content remains.</p>' +
      '<h4>Text</h4><p>Text content remains.</p>' +
      '<h6>Statement</h6><p>Statement content remains.</p>' +
      '<h5>Id</h5><p>Reference 12</p>' +
      '<h4>Items</h4><ul><li>First useful item</li></ul>'
  );
  assert.match(body, /Body content remains/);
  assert.match(body, /Text content remains/);
  assert.match(body, /Statement content remains/);
  assert.match(body, /Reference 12/);
  assert.match(body, /First useful item/);
  assert.doesNotMatch(
    body,
    /<[^>]+>\s*(Body|Content|Text|Items|Statement|Id)\s*<\/[^>]+>/i
  );
});

test("top orientation: Overview renders once as an h2 without losing content", () => {
  const { api } = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    title: "Wrapper cleanup",
    page_profile: "learner",
    sections: [
      {
        section_id: "overview",
        heading: "Overview",
        content: "## Overview\n\nThe introduction remains visible."
      }
    ]
  };
  const rendered = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const body = mainBodyHtml(String(rendered.html || ""));
  assert.equal((body.match(/>\s*Overview\s*</gi) || []).length, 1);
  assert.match(body, /<section class="util-overview">/);
  assert.match(body, /<h2 class="util-section-heading">[\s\S]*?<span>Overview<\/span><\/h2>/);
  assert.match(body, /The introduction remains visible/);
});

test("page shape: production metadata → util-meta fold only", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-production-metadata.json", PAGE_METADATA_ORDER);
  const { body, meta } = assertProductionMetadataFold(html);
  assert.equal(body.includes("Upstream Alpha"), false);
  assert.match(meta, /Upstream Alpha/);
  assert.match(meta, /limitations/i);
  assertLearnerProductionMetadataBoundary(html);
  assert.match(html, /About this page/);
});

test("page shape: body bullets with metadata keys → metadata outside main body", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-metadata-with-body.json");
  const { body } = assertProductionMetadataFold(html);
  const scope = sectionScope(body, "Section A");
  assertStandardListSemantics(body, scope, 3);
  assert.equal(body.includes("Upstream Alpha"), false);
  assert.match(html, /Upstream Alpha/);
});

test("page shape: structured assessment MCQ → options not checkbox lists", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-structured-assessment-mcq.json");
  assert.match(html, /Select the best response/);
  assertMcqOptionsNotCheckboxLists(html);
  assertSanitizedPageSemantics(html, { expectMcq: true });
});

test("slice 31-6: structured MCQ — prompt/choices wrappers and option order", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-structured-assessment-mcq.json");
  assert.match(html, /util-assessment-prompt[\s\S]{0,500}Select the best response/i);
  assert.match(html, /util-assessment-choices[\s\S]{0,800}util-assessment-options/i);
  assert.match(html, /util-assessment-item--formative/);
  const optionsBlock =
    html.match(/util-assessment-options[\s\S]{0,600}?<\/ul>/i)?.[0] || "";
  assert.match(optionsBlock, /Option alpha/);
  assert.match(optionsBlock, /Option beta/);
  assert.match(optionsBlock, /Option gamma/);
  const alphaIdx = optionsBlock.indexOf("Option alpha");
  const betaIdx = optionsBlock.indexOf("Option beta");
  const gammaIdx = optionsBlock.indexOf("Option gamma");
  assert.ok(alphaIdx < betaIdx && betaIdx < gammaIdx, "option order preserved");
  const assessScope = html.match(/util-assessment-section[\s\S]{0,4000}/i)?.[0] || "";
  assert.doesNotMatch(assessScope, /util-checkbox-list/i);
});

test("slice 31-6: assessment presentation CSS markers in export", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-structured-assessment-mcq.json");
  assert.match(html, /\.util-assessment-prompt\{/);
  assert.match(html, /\.util-assessment-choices\{/);
  assert.match(html, /\.util-assessment-item--formative\{/);
});

test("v1.1.1: pedagogic figure accommodation after activity header", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "ld-climate-misconception-discussion-page.json");
  assert.match(html, /\.util-figure\.util-figure--pedagogic\{/);
  assert.match(
    html,
    /\.util-activity-header\+\.util-figure--pedagogic[^}]*margin-top:12px/
  );
});

test("page shape: plain bullets then checklist → separate list kinds preserved", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-bullets-then-checkbox.json");
  const scope = sectionScope(html, "Section A");
  assert.match(scope, /Plain bullet one/);
  assert.match(scope, /Checkbox task one/);
  assert.match(html, /util-checklist/);
  const plainUlOpens = scope.match(/<ul(?![^>]*util-checklist)[^>]*>/gi) || [];
  assert.ok(plainUlOpens.length >= 1, "expected at least one plain <ul>");
  assertPlainChecklistsPreserved(html);
  assertAdjacentCompatibleUlMerged(html);
  assertNoOrphanListItems(html);
});

test("golden composed page: confidence-interval multi-table, scenario, MathJax, assessment", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "confidence-interval-a2-multitable-page.json", PAGE_METADATA_ORDER);
  const body = mainBodyHtml(html);

  assert.match(body, /util-task-block/);
  assert.match(body, /util-activity-task--primary/);
  assert.match(body, /util-materials-stack/);
  assert.match(body, /util-output-block/);
  assert.match(body, /util-support-note/);

  assert.match(body, /\\\(\s*\\alpha\s*=\s*0\.05\s*\\\)/);
  assert.match(
    body,
    /<div class="util-knowledge-summary__content util-knowledge-summary--prose">[\s\S]*?\\\[[\s\S]*?\\bar\{x\}/
  );
  assert.match(body, /\\\(n = 10\\\)/);
  assert.doesNotMatch(body, /\\\$|\\\$\\\$/);

  assert.doesNotMatch(body, /<p>\s*\|\s*Statement\s*\|/i);
  assert.doesNotMatch(body, /<p>\s*\|\s*Level\s*\|/i);
  assert.doesNotMatch(body, /<p>\s*\|\s*Group\s*\|\s*Interval\s*\|/i);
  assert.match(body, /<table>/);
  assert.match(body, /<th>Statement<\/th>/);
  assert.match(body, /<th>Level<\/th>/);
  assert.match(body, /<th>Group<\/th>/);
  const tableCount = (body.match(/<table>/gi) || []).length;
  assert.ok(tableCount >= 3, "expected template + scenario tables, got " + tableCount);

  assert.match(body, /util-worked-example/);
  assert.match(body, /Modelled interval judgement/);
  assert.match(body, /Move to reuse/);
  assert.match(body, /Step → meaning/i);
  assert.match(body, /Use this when/i);
  assert.match(body, /In activities:/i);
  assert.match(body, /util-purpose-task-cue/);
  assert.match(body, /util-session-phase-cue/);
  assert.match(body, /util-material-role-action/);
  assert.match(body, /util-material-role-model/);
  assert.match(body, /util-material-role-thinking/);
  assert.match(body, /util-material-role-deliverable/);
  assert.match(body, /util-material-role-checkpoint/);

  const a2 = activityArticleScope(html, "Confidence interval template");
  assert.match(a2, /util-template-icon|util-lucide-icon/);
  assert.match(a2, /Confidence Interval Template/);
  assert.match(a2, /Confidence Levels/);
  assert.match(a2, /Method captures mean 95% of time/);
  assert.match(a2, /Both tables completed/);
  assert.match(a2, /Check your thinking:/i);
  assert.match(a2, /both interpretations sound plausible/i);
  assert.match(a2, /interval gets wider when n increases/i);
  assert.match(a2, /util-material-role-close[\s\S]*Closure/i);

  const a4 = activityArticleScope(html, "Interval comparison scenario");
  assert.match(a4, /util-material-role-scenario/);
  assert.match(a4, /util-scenario-card/);
  assert.match(a4, /Interval Comparison/);
  assert.match(a4, /\(66\.08, 73\.92\)/);
  assert.match(a4, /Check your thinking:/i);
  assert.match(a4, /interprets what overlap implies/i);

  const assess = sectionScope(html, "Formative assessment check");
  assert.match(assess, /util-assessment-prompt/);
  assert.match(assess, /util-assessment-choices/);
  assert.match(assess, /<ol>/);
  assert.match(assess, /<li>What is your decision about H0\?<\/li>/);
  assert.match(assess, /appropriate procedure here/i);
  assert.doesNotMatch(assess, /<p>[^<]*1\.\s*Decision\?[^<]*2\.\s*What does p-value/i);
  assert.match(assess, /Reject H0/);
  assert.match(assess, /util-assessment-explanation/);
  assert.match(assess, /practical significance/i);
  assert.match(assess, /harder to defend/i);

  const tips = sectionScope(html, "Study tips");
  assert.match(tips, /what changed in your understanding/i);
  assert.match(tips, /hardest to justify/i);
  assert.match(a4, /Debrief/i);
  assert.match(a4, /Which evidence is stronger/i);
  assert.match(a2, /Closure/i);
});

test("learning activity render hides required_materials metadata and material ids", () => {
  const { api } = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A2",
            title: "Evaluate alternatives",
            learner_task: "Compare options and justify your decision.",
            required_materials: [
              {
                material_id: "A2-M3",
                type: "analysis_table",
                purpose: "comparison scaffold",
                specification: "Use a three-column criterion table."
              }
            ],
            materials: [
              {
                material_id: "A2-M3",
                type: "analysis_table",
                content:
                  "## Comparison table\n| Criterion | Option A | Option B |\n| --- | --- | --- |\n| Cost | 2 | 3 |"
              }
            ]
          }
        ]
      }
    ]
  };
  const rendered = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");
  assert.match(html, /Comparison table/i);
  const visibleText = markupBodyHtml(html).replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(visibleText, /\bMaterial Ids\b/i);
  assert.doesNotMatch(visibleText, /\bA2-M3\b/i);
  assert.doesNotMatch(visibleText, /\brequired[_\s-]?materials\b/i);
  assert.doesNotMatch(visibleText, /\bspecification\b/i);
});

test("material-id keyed bodies do not render id headings", () => {
  const { api } = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A3",
            title: "Assess competing proposals",
            learner_task: "Use the table to compare proposals.",
            materials: {
              "A2-M3": "Duplicate internal-id copy of worksheet body.",
              analysis_table:
                "| Criterion | Option A | Option B |\n| --- | --- | --- |\n| Reliability | High | Medium |"
            }
          }
        ]
      }
    ]
  };
  const rendered = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");
  const visibleText = markupBodyHtml(html).replace(/<[^>]+>/g, " ");
  assert.match(visibleText, /\bCriterion\b/i);
  assert.match(visibleText, /\bReliability\b/i);
  assert.doesNotMatch(visibleText, /\bA2-M3\b/i);
});

test("metadata-only material type buckets do not render placeholder ids", () => {
  const { api } = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            title: "Interpret evidence",
            learner_task: "Read and reason with the provided materials.",
            materials: {
              text: { material_id: "A1-M1", type: "text", purpose: "concept exposition" },
              worked_example: { material_id: "A1-M2", type: "worked_example", purpose: "reasoning model" },
              sample_output: { material_id: "A1-M3", type: "sample_output", purpose: "quality threshold" }
            }
          }
        ]
      }
    ]
  };
  const rendered = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const visibleText = markupBodyHtml(String(rendered.html || "")).replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(visibleText, /\bText\b/i);
  assert.doesNotMatch(visibleText, /\bWorked Example\b/i);
  assert.doesNotMatch(visibleText, /\bSample Output\b/i);
  assert.doesNotMatch(visibleText, /\bA1-M1\b/i);
  assert.doesNotMatch(visibleText, /\bA1-M2\b/i);
  assert.doesNotMatch(visibleText, /\bA1-M3\b/i);
});

test("v2 activities render hydrated materials and suppress required_materials ids", () => {
  const { api } = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    page_synthesis: {
      title: "Marx workbook",
      knowledge_summary: "Core terms for analysing Marx."
    },
    activities: [
      {
        activity_id: "A1",
        title: "Industrial context and class",
        learner_task: "Read the material and explain Marx's core claim.",
        required_materials: [
          {
            material_id: "A1-M1",
            type: "text",
            purpose: "Concept framing",
            specification: "Short historical overview"
          }
        ],
        materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            title: "Industrial Revolution and Marx",
            body_format: "markdown",
            body: "Workers sold labour while owners controlled capital."
          }
        ]
      }
    ]
  };
  const rendered = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const visibleText = markupBodyHtml(String(rendered.html || "")).replace(/<[^>]+>/g, " ");
  assert.match(visibleText, /Industrial Revolution and Marx/i);
  assert.match(visibleText, /Workers sold labour while owners controlled capital/i);
  assert.doesNotMatch(visibleText, /\bMaterial Ids\b/i);
  assert.doesNotMatch(visibleText, /\brequired[_\s-]?materials\b/i);
  assert.doesNotMatch(visibleText, /\bA1-M1\b/i);
});

test("learner page IA order promotes journey and hides internals", () => {
  const { api } = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Political Economy Workbook",
    assembly_state: { current_stage: "design_page", enriched_by: ["episode_plan", "dla"] },
    generation_notes: { validation: { material_coverage: "complete" } },
    sections: [
      {
        section_id: "knowledge_summary",
        heading: "Knowledge Summary",
        content: "Core ideas for this workbook."
      },
      {
        section_id: "learning_sequence",
        heading: "Learning Sequence",
        content: {
          sequence_title: "How this learning progresses",
          ordered_activity_ids: ["A1", "A2"]
        }
      },
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          { activity_id: "A1", title: "Concept foundations", learner_task: "Read and explain." },
          { activity_id: "A2", title: "Evidence and critique", learner_task: "Evaluate claims." }
        ]
      },
      {
        section_id: "assessment_check",
        heading: "Assessment Check",
        content: { items: [{ question: "What is surplus value?" }] }
      }
    ]
  };
  const rendered = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");
  const body = mainBodyHtml(html);
  const visibleText = markupBodyHtml(body).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  assert.match(visibleText, /Learning Journey|Orient.*Concept foundations|Concept foundations.*Evidence/i);
  assert.doesNotMatch(visibleText, /Learning Activities/i);
  assert.match(body, /<h2 class="util-activity-title">Concept foundations<\/h2>/i);
  assert.match(body, /<h2 class="util-activity-title">Evidence and critique<\/h2>/i);
  assert.match(visibleText, /Assessment/i);
  assert.doesNotMatch(body, /assembly_state|current_stage|enriched_by|generation_notes/i);
});

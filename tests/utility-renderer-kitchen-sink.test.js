/**
 * Sprint 26 — synthetic renderer kitchen sink fixture (smoke + coverage anchors).
 * Does not validate composition closure (see utility-page-composition-closure.test.js).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(repoRoot, "tests", "fixtures", "page-render", "renderer-kitchen-sink-page.json");

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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function renderKitchenSink(api) {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return { parsed, html: String(r.html || "") };
}

function sectionScope(html, headingText) {
  const re = new RegExp(
    headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      "[\\s\\S]*?(?=<h2|<details class=\"util-meta\"|$)",
    "i"
  );
  const m = html.match(re);
  return m ? m[0] : html;
}

function indexOfMarker(html, marker) {
  const idx = html.indexOf(marker);
  return idx === -1 ? Number.POSITIVE_INFINITY : idx;
}

const api = loadPrismTestApi();

test("kitchen sink fixture: parses and declares synthetic renderer stress", () => {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  assert.equal(parsed.artifact_type, "page");
  assert.equal(parsed.source_artefacts && parsed.source_artefacts.synthetic_fixture, true);
  assert.ok(Array.isArray(parsed.sections) && parsed.sections.length >= 8);
});

test("kitchen sink fixture: renders HTML without error", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /PRISM renderer kitchen sink/i);
  assert.match(html, /<header class="util-learning-header">/);
});

test("kitchen sink fixture: all activity titles present (KS-A1–KS-A6)", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /Pattern showcase/i);
  assert.match(html, /Edge cases/i);
  assert.match(html, /Density and print stress/i);
  assert.match(html, /PEL orientation field showcase/i);
  assert.match(html, /PEL reasoning field showcase/i);
  assert.match(html, /Minimal activity row/i);
  assert.ok((html.match(/util-task-block/gi) || []).length >= 6);
});

test("kitchen sink fixture: core material patterns present", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-task-card/);
  assert.match(html, /util-scenario-card/);
  assert.match(html, /util-prompt-set/);
  assert.match(html, /util-checklist/);
  assert.match(html, /util-template-block/);
  assert.match(html, /<table>/);
  assert.match(html, /util-output-block/);
  assert.match(html, /util-support-note/);
});

test("kitchen sink fixture: study tips and assessment sections distinguish icons", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-section-icon--study-tips/);
  assert.match(html, /Study tips/i);
  assert.match(html, /Formative assessment check/i);
});

test("kitchen sink fixture: metadata fold and generation_notes", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /<details class="util-meta"/);
  assert.match(html, /Synthetic renderer stress fixture/i);
});

test("kitchen sink fixture: unknown material key does not break render", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /experimental_unknown_key|Unknown material shape/i);
});

test("kitchen sink fixture (26-2): tables wrapped for horizontal scroll", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /<div class="util-table-scroll(?: util-material-table)?">/);
});

test("kitchen sink fixture (26-2): presentation CSS includes print break rules", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /@media print/);
  assert.match(html, /break-inside:avoid-page/);
  assert.match(html, /article\.util-task-block\{break-inside:avoid-page/);
});

test("kitchen sink fixture (26-3): no object Object leakage", () => {
  const { html } = renderKitchenSink(api);
  assert.doesNotMatch(html, /\[object Object\]/i);
});

test("kitchen sink fixture (26-3): metadata section folded into util-meta only", () => {
  const { html } = renderKitchenSink(api);
  const bodyBeforeMeta = html.split('<details class="util-meta"')[0];
  assert.doesNotMatch(bodyBeforeMeta, /<h2[^>]*>\s*Production Metadata/i);
  assert.match(html, /util-meta-section/);
  assert.match(html, /renderer-kitchen-sink-page|fixture_id/i);
});

test("kitchen sink fixture (26-3): checklist distinct from prompt set", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-checklist-block/);
  assert.match(html, /util-checklist-icon/);
  assert.match(html, /util-prompt-set/);
});

test("kitchen sink fixture (26-3): no hardcoded worksheet instruction", () => {
  const { html } = renderKitchenSink(api);
  assert.doesNotMatch(html, /Use this table to record your group/i);
});

test("kitchen sink fixture (26-3): unknown material uses generic icon heading", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-generic-material-icon/);
  assert.match(html, /Unknown material shape/i);
});

test("kitchen sink fixture (26-3): session timeline renders safely", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /Session timeline/i);
  assert.match(html, /util-session-step/);
  assert.match(html, /Complete pattern showcase materials/i);
});

test("kitchen sink fixture (26-4): professional polish CSS and timeline structure", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /\.util-session-timeline\{/);
  assert.match(html, /<div class="util-session-timeline">/);
  assert.match(html, /util-timeline-step/);
  assert.match(html, /util-timeline-meta/);
  assert.match(html, /h4\.util-material-heading/);
  assert.match(html, /<details class="util-meta"/);
});

test("kitchen sink fixture (26-4): material headings use icon-heading alignment", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-material-heading util-icon-heading/);
});

test("kitchen sink fixture (26-5): typographic polish and assessment identity", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /\.util-assessment-section\{/);
  assert.match(html, /<section class="util-assessment-section util-material-role-checkpoint">/);
  assert.match(html, /util-assessment-item/);
  assert.match(html, /util-assessment-number/);
  assert.match(html, /util-assessment-options/);
  assert.match(html, /util-assessment-key/);
  assert.match(html, /About this page/);
});

test("kitchen sink fixture (26-5): icon alignment and print polish CSS markers", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /\.util-icon-heading\{[^}]*align-items:center/);
  assert.match(html, /counter-reset:timeline-step/);
  assert.match(html, /box-shadow:none!important/);
});

test("kitchen sink stabilisation: learning purpose bullets without embedded markers", () => {
  const { html } = renderKitchenSink(api);
  const scope = sectionScope(html, "Learning purpose");
  assert.match(scope, /<ul>/);
  assert.match(scope, /Identify key renderer paths/i);
  assert.doesNotMatch(scope, /<li>\s*-\s*Identify/i);
  assert.doesNotMatch(scope, /<li>\s*1\.\s*Render tables/i);
});

test("kitchen sink stabilisation: markdown tables render as util-table-scroll (not pipe paragraphs)", () => {
  const { html } = renderKitchenSink(api);
  const edge = sectionScope(html, "Renderer stabilisation edge cases");
  const tableScrollCount = (html.match(/util-table-scroll/g) || []).length;
  assert.ok(tableScrollCount >= 4, `expected multiple util-table-scroll wrappers, got ${tableScrollCount}`);
  assert.doesNotMatch(edge, /<p>\s*\|[^<]+\|[^<]+\|/);
  assert.doesNotMatch(edge, /<h5[^>]*>[^<]*\|[^<]*---/);
});

test("kitchen sink stabilisation: comparison separator artefacts normalized", () => {
  const { html } = renderKitchenSink(api);
  const edge = sectionScope(html, "Renderer stabilisation edge cases");
  assert.doesNotMatch(edge, /---\s*-\s*Key Difference:/i);
  assert.match(edge, /Key Difference:/i);
  assert.match(edge, /Similarity:/i);
});

test("kitchen sink stabilisation: knowledge summary variants without nested heading stacks in li", () => {
  const { html } = renderKitchenSink(api);
  const obj = sectionScope(html, "Key ideas (object)");
  const arr = sectionScope(html, "Key ideas (array)");
  assert.match(obj, /util-knowledge-summary/);
  assert.match(obj, /util-definition-list/);
  assert.match(obj, /util-concept-relationships/);
  assert.doesNotMatch(obj, /<li>\s*<h3>/i);
  assert.doesNotMatch(arr, /<li>\s*<h3>/i);
  assert.match(arr, /util-knowledge-summary/);
  assert.match(arr, /Assessment visibility/i);
});

test("slice 31-3: knowledge summary hierarchy CSS markers in export", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /\.util-knowledge-summary\{/);
  assert.match(html, /\.util-concept-group\{/);
  assert.match(html, /\.util-definition-list\{/);
  assert.match(html, /\.util-concept-relationships\{/);
});

test("slice 31-4: activity materials use util-materials-stack and material-table tier", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-materials-stack/);
  assert.match(html, /util-activity-materials[\s\S]{0,400}util-materials-stack/);
  assert.match(html, /util-table-scroll util-material-table/);
  assert.match(html, /util-template-block util-material-template/);
  assert.match(html, /util-material-role-practice/);
  assert.match(html, /util-material-role-checkpoint/);
  assert.match(html, /util-prompt-set util-material-prompt/);
  assert.match(html, /\.util-materials-stack\{/);
  assert.match(html, /\.util-table-scroll\.util-material-table\{/);
});

test("slice 31-5: density pacing CSS markers in export", () => {
  const { html } = renderKitchenSink(api);
  // V31_5: direct-child cues use margin-bottom:0; rhythm from .util-activity-framing { gap:8px } (V31_2)
  assert.match(html, /\.util-activity-framing>\.util-activity-preamble-cue\{margin-bottom:0\}/);
  assert.match(html, /\.util-activity-framing>\.util-activity-preamble-cue\+\.util-activity-preamble-cue\{margin-top:0\}/);
  assert.match(html, /\.util-activity-framing\+\.util-activity-task--primary\{margin-top:10px\}/);
});

test("slice 31-6: formative assessment — prompt/choices hierarchy and answer-grid regression", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-assessment-section[\s\S]{0,800}Formative assessment check/i);
  const assess = sectionScope(html, "Formative assessment check");
  assert.match(assess, /util-assessment-item--formative/);
  assert.match(assess, /util-assessment-prompt/);
  assert.match(assess, /util-assessment-choices/);
  assert.match(assess, /util-assessment-options/);
  assert.doesNotMatch(assess, /util-checkbox-list/i);
  const keyIdx = indexOfMarker(assess, "util-assessment-key");
  const inlineIdx = indexOfMarker(assess, "Correct answer:");
  assert.ok(keyIdx !== Number.POSITIVE_INFINITY);
  assert.equal(inlineIdx, Number.POSITIVE_INFINITY);
});

test("slice 31-6: assessment presentation CSS in kitchen-sink export", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /\.util-assessment-prompt\{/);
  assert.match(html, /\.util-assessment-choices\{/);
});

test("slice 31-5: distinct PEL orientation and reasoning cues retained on KS-A6", () => {
  const { html } = renderKitchenSink(api);
  const scope = sectionScope(html, "PEL orientation field showcase");
  assert.match(scope, /Study orientation:/i);
  assert.match(scope, /Intellectual frame:/i);
  assert.match(scope, /Connection to previous activity:/i);
  const studyIdx = scope.indexOf("Study orientation:");
  const frameIdx = scope.indexOf("Intellectual frame:");
  assert.ok(studyIdx !== -1 && frameIdx !== -1 && studyIdx < frameIdx);
});

test("slice 31-4: kitchen sink preserves comparison prompt wording and table structure", () => {
  const { html } = renderKitchenSink(api);
  const edge = sectionScope(html, "Renderer stabilisation edge cases");
  assert.match(edge, /What is the purpose of each work\?/);
  assert.match(edge, /Key Difference:/);
  assert.match(edge, /util-materials-stack/);
  assert.doesNotMatch(edge, /<p>\s*\|[^<]+\|[^<]+\|/);
});

test("kitchen sink stabilisation: checklist string and array avoid heading-only checkbox rows", () => {
  const { html } = renderKitchenSink(api);
  const edge = sectionScope(html, "Renderer stabilisation edge cases");
  const lists = edge.match(/<ul class="util-checklist"[^>]*>[\s\S]*?<\/ul>/gi) || [];
  assert.ok(lists.length >= 1);
  lists.forEach((listHtml) => {
    assert.doesNotMatch(listHtml, /##\s*Checklist/i);
    assert.doesNotMatch(listHtml, />Checklist</i);
    assert.doesNotMatch(listHtml, /☐/);
  });
  assert.match(edge, /Complete plain-string table/i);
});

test("kitchen sink stabilisation: answer-grid mode hides inline correct answers", () => {
  const { html } = renderKitchenSink(api);
  const assess = sectionScope(html, "Formative assessment check");
  const keyIdx = indexOfMarker(assess, "util-assessment-key");
  const inlineIdx = indexOfMarker(assess, "Correct answer:");
  assert.ok(keyIdx !== Number.POSITIVE_INFINITY, "expected answer key section");
  assert.equal(inlineIdx, Number.POSITIVE_INFINITY, "inline correct answer must not appear in items");
  assert.doesNotMatch(assess, /<div class="util-assessment-item-body">[\s\S]*?Explanation/i);
  assert.match(assess, /util-true-false-options|True<\/li>/i);
});

test("kitchen sink stabilisation: activity framing and cognition blocks visible", () => {
  const { html } = renderKitchenSink(api);
  const edge = sectionScope(html, "Renderer stabilisation edge cases");
  const preambleIdx = edge.indexOf("util-activity-preamble");
  const taskIdx = edge.indexOf("What to do");
  assert.ok(preambleIdx !== -1 && taskIdx !== -1);
  assert.ok(preambleIdx < taskIdx);
  assert.match(edge, /util-cognition--explain/);
  assert.match(edge, /util-cognition--transfer/);
  assert.match(edge, /util-cognition--scaffold/);
});

test("kitchen sink stabilisation: generic Text/Support Text headings suppressed when inner title exists", () => {
  const { html } = renderKitchenSink(api);
  const edge = sectionScope(html, "Renderer stabilisation edge cases");
  assert.match(edge, /Key Life Events/i);
  assert.match(edge, /Class Struggle Explanation/i);
  assert.doesNotMatch(
    edge,
    /Support Text[\s\S]{0,160}util-card-subheading[\s\S]{0,80}Class Struggle/i,
    "redundant Support Text label before inner title"
  );
});

test("kitchen sink stabilisation: template heading plus pipe table splits into h5 and util-table-scroll", () => {
  const { html } = renderKitchenSink(api);
  const edge = sectionScope(html, "Renderer stabilisation edge cases");
  assert.match(edge, /Table after heading/i);
  assert.match(edge, /Table after heading[\s\S]{0,700}util-table-scroll/i);
  assert.doesNotMatch(edge, /<h5[^>]*>[^<]*\|[^<]*---/i);
});

test("kitchen sink stabilisation: template follow-up strips embedded ordered-list markers", () => {
  const { html } = renderKitchenSink(api);
  const edge = sectionScope(html, "Renderer stabilisation edge cases");
  assert.match(edge, /Write one sentence/i);
  assert.match(edge, /Add evidence/i);
  assert.doesNotMatch(edge, /1\.\s*Write one sentence/i);
  assert.doesNotMatch(edge, /2\.\s*Add evidence/i);
});

test("kitchen sink stabilisation: answer-grid items omit inline Explanation blocks", () => {
  const { html } = renderKitchenSink(api);
  const assess = sectionScope(html, "Formative assessment check");
  assert.doesNotMatch(assess, /<h[34][^>]*>\s*Explanation\s*<\/h[34]>/i);
  assert.doesNotMatch(assess, /util-assessment-explanation/i);
  assert.doesNotMatch(
    assess,
    /<div class="util-assessment-item-body">[\s\S]*?Explanation/i
  );
});

test("kitchen sink stabilisation: meaningful material titles suppress generic Body heading", () => {
  const { html } = renderKitchenSink(api);
  const edge = sectionScope(html, "Renderer stabilisation edge cases");
  assert.match(edge, /Class Struggle Explanation/i);
  assert.doesNotMatch(edge, /<h5>\s*Body\s*<\/h5>/i);
});

test("kitchen sink 30-1b: PEL orientation fields render with labels before What to do", () => {
  const { html } = renderKitchenSink(api);
  const scope = sectionScope(html, "PEL orientation field showcase");
  assert.match(scope, /Study orientation:/i);
  assert.match(scope, /Intellectual frame:/i);
  assert.match(scope, /Connection to previous activity:/i);
  assert.match(scope, /validate renderer passthrough for self-study orientation fields/i);
  assert.match(scope, /checking layout like a learner scanning a page/i);
  assert.match(scope, /edge-case activity when judging whether orientation labels/i);
  const studyIdx = scope.indexOf("Study orientation:");
  const taskIdx = scope.indexOf("What to do");
  assert.ok(studyIdx !== -1 && taskIdx !== -1);
  assert.ok(studyIdx < taskIdx);
  assert.match(scope, /util-activity-study-orientation/);
});

test("kitchen sink 30-2r: PEL reasoning fields render with labels before What to do", () => {
  const { html } = renderKitchenSink(api);
  const scope = sectionScope(html, "PEL reasoning field showcase");
  assert.match(scope, /Disciplinary lens:/i);
  assert.match(scope, /How to think:/i);
  assert.match(scope, /Using evidence:/i);
  assert.match(scope, /Structuring your response:/i);
  assert.match(scope, /Key distinction:/i);
  assert.match(scope, /Trace mechanism and host interaction/i);
  assert.match(scope, /Quote the reference excerpt/i);
  const lensIdx = scope.indexOf("Disciplinary lens:");
  const thinkIdx = scope.indexOf("How to think:");
  const evidenceIdx = scope.indexOf("Using evidence:");
  const structureIdx = scope.indexOf("Structuring your response:");
  const contrastIdx = scope.indexOf("Key distinction:");
  const taskIdx = scope.indexOf("What to do");
  assert.ok(lensIdx !== -1 && thinkIdx !== -1 && evidenceIdx !== -1 && taskIdx !== -1);
  assert.ok(lensIdx < thinkIdx, "disciplinary lens before how to think");
  assert.ok(thinkIdx < evidenceIdx, "how to think before using evidence");
  assert.ok(evidenceIdx < structureIdx, "using evidence before structuring");
  assert.ok(structureIdx < contrastIdx, "structuring before key distinction");
  assert.ok(contrastIdx < taskIdx, "reasoning cues before what to do");
});

test("kitchen sink 30-2r: duplicate reasoning field text is suppressed", () => {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const activities = parsed.sections.find((s) => s.section_id === "learning_activities").content;
  const ksA7 = activities.find((a) => a.activity_id === "KS-A7");
  const dupText = "Same reasoning guidance text for dedupe test.";
  ksA7.evidence_use_prompt = dupText;
  ksA7.argument_structure_hint = dupText;
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  const scope = sectionScope(String(r.html), "PEL reasoning field showcase");
  const matches = scope.match(/Same reasoning guidance text for dedupe test/gi) || [];
  assert.equal(matches.length, 1, "duplicate reasoning prose should render once");
});

test("kitchen sink 30-2r: minimal activity row omits empty reasoning labels", () => {
  const { html } = renderKitchenSink(api);
  const scope = sectionScope(html, "Minimal activity row");
  assert.doesNotMatch(scope, /Using evidence:/i);
  assert.doesNotMatch(scope, /Structuring your response:/i);
  assert.doesNotMatch(scope, /Key distinction:/i);
  assert.doesNotMatch(scope, /Disciplinary lens:/i);
});

test("kitchen sink 30-1b: minimal activity row omits empty orientation labels", () => {
  const { html } = renderKitchenSink(api);
  const scope = sectionScope(html, "Minimal activity row");
  assert.match(scope, /What to do/i);
  assert.doesNotMatch(scope, /Study orientation:/i);
  assert.doesNotMatch(scope, /Intellectual frame:/i);
  assert.doesNotMatch(scope, /Connection to previous activity:/i);
});

test("slice 31-2: activity framing rail and primary task hierarchy CSS", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-activity-framing/);
  assert.match(html, /util-activity-task--primary/);
  assert.match(html, /\.util-activity-framing\{/);
  assert.match(html, /\.util-activity-task--primary\{/);
  assert.match(html, /\.util-pel-orientation-cue\{/);
  assert.match(html, /\.util-pel-reasoning-cue\{/);
  const scope = sectionScope(html, "PEL orientation field showcase");
  assert.match(scope, /util-activity-framing[\s\S]*Study orientation:/i);
  assert.match(scope, /util-activity-task--primary[\s\S]*What to do/i);
  const framingEnd = scope.indexOf("</div>", scope.indexOf("util-activity-framing"));
  const taskStart = scope.indexOf("util-activity-task--primary");
  assert.ok(framingEnd !== -1 && taskStart !== -1);
  assert.ok(framingEnd < taskStart, "framing rail should precede primary task block");
});

test("kitchen sink stabilisation: config scalars render as plain text not markdown emphasis", () => {
  const { html } = renderKitchenSink(api);
  const meta = html.slice(html.indexOf("About this page"));
  assert.ok(meta.length > 0, "expected collapsed metadata footer");
  assert.match(meta, /answer[\s_]grid[\s_]end/i);
  assert.doesNotMatch(meta, /answer<em>grid<\/em>end/i);
});

/**
 * Sprint 27 tracks 27-4d / 27-4e — composition metadata + renderer visibility modes.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const climateFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-climate-misconception-discussion-page.json"
);

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
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = { document: documentStub, addEventListener() {}, _: sandbox._, Utils: { debounce: (fn) => fn }, localStorage: { getItem: () => null, setItem() {} }, URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} }, Blob: function Blob() {}, Library: { importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }), getAllPrompts: () => Promise.resolve([]) } };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function sectionScope(html, headingText) {
  const re = new RegExp(
    headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?(?=<h2|<details class=\"util-meta\"|$)",
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

const P27_02_RESOLVED = {
  feedback_timing: "tutor_led_reveal_only",
  learner_answer_visibility: "hidden_until_reveal",
  design_feedback_required: true,
  assessment_required: true
};

test("27-4d: brief mapping sets hidden visibility and include_answers false on Design Page", () => {
  const mapped = api.applyWorkflowBriefMappings(
    api.normalizeWorkflowBriefConfig({ optionalFactors: [], mappingRules: [] }),
    P27_02_RESOLVED
  );
  const dp = mapped.stepParamPatch.step_design_page || mapped.stepParamPatch.design_page;
  assert.ok(dp, "expected Design Page step patch");
  assert.equal(dp.include_answers, "false");
  assert.equal(dp.feedback_display, "none");
  assert.equal(mapped.workflowConstraintPatch.feedback_display, "none");
  assert.equal(mapped.workflowConstraintPatch.learner_answer_visibility, "hidden_until_reveal");
  assert.equal(mapped.workflowConstraintPatch.feedback_timing, "tutor_led_reveal_only");
});

test("27-4d: applyAssessmentSemanticsToComposedPage stamps page metadata without stripping item keys", () => {
  const page = {
    artifact_type: "page",
    title: "Delayed feedback seminar",
    sections: [
      {
        section_id: "assessment_check",
        heading: "Formative assessment",
        content: {
          items: [
            {
              item_id: "TF-1",
              item_type: "true_false",
              proposition: "Sample proposition.",
              true_false_answer: "False",
              correct_answer: "False"
            }
          ]
        }
      }
    ]
  };
  const stamped = api.applyAssessmentSemanticsToComposedPage(page, P27_02_RESOLVED);
  assert.equal(stamped.feedback_display, "none");
  assert.equal(stamped.metadata.feedback_display, "none");
  assert.equal(stamped.constraints_applied.feedback_timing, "tutor_led_reveal_only");
  assert.equal(stamped.generation_notes.constraints_applied.learner_answer_visibility, "hidden_until_reveal");
  const item = stamped.sections[0].content.items[0];
  assert.equal(item.true_false_answer, "False");
  assert.equal(item.correct_answer, "False");
});

test("27-4d: end_of_session_reveal maps to answer_grid_end", () => {
  const presentation = api.resolveAssessmentPresentationFromBriefFactors({
    feedback_timing: "end_of_session_reveal",
    learner_answer_visibility: "hidden_until_reveal"
  });
  assert.equal(presentation.feedbackDisplay, "none");
  const endReveal = api.resolveAssessmentPresentationFromBriefFactors({
    feedback_timing: "end_of_session_reveal",
    learner_answer_visibility: "show_answer_grid_end"
  });
  assert.equal(endReveal.feedbackDisplay, "answer_grid_end");
  assert.equal(endReveal.includeAnswers, true);
});

test("27-4e: reflection_then_answers hides inline answers and reveals grid after prompts", () => {
  const page = {
    artifact_type: "page",
    title: "Peer instruction check",
    feedback_display: "reflection_then_answers",
    sections: [
      {
        section_id: "assessment_check",
        heading: "Formative assessment",
        content: {
          items: [
            {
              item_id: "Q1",
              stem: "Which process converts light energy to chemical energy?",
              options: { A: "Photosynthesis", B: "Respiration only" },
              correct_answer: "A",
              explanation_or_rationale: "Photosynthesis captures light in chloroplasts."
            }
          ]
        }
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  const assessment = sectionScope(html, "Formative assessment");
  assert.doesNotMatch(assessment, /Correct answer/i);
  assert.match(assessment, /Which process converts light energy/i);
  assert.match(html, /util-reflection-answers/);
  assert.match(html, /Self-check answers/i);
  assert.match(html, /Photosynthesis/);
  const promptIdx = indexOfMarker(html, "Which process converts light energy");
  const revealIdx = indexOfMarker(html, "Self-check answers");
  assert.ok(promptIdx < revealIdx, "prompts should precede reveal section");
});

test("27-4e: answer_grid_end still renders placeholder grid without inline answers", () => {
  const page = {
    artifact_type: "page",
    title: "End grid check",
    feedback_display: "answer_grid_end",
    sections: [
      {
        section_id: "assessment_check",
        heading: "Knowledge check",
        content: {
          items: [
            {
              item_id: "Q1",
              stem: "First stem?",
              options: { A: "One", B: "Two" },
              correct_answer: "A"
            },
            {
              item_id: "Q2",
              stem: "Second stem?",
              options: { A: "Alpha", B: "Beta" },
              correct_answer: "B"
            }
          ]
        }
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  const html = String(r.html || "");
  const assessment = sectionScope(html, "Knowledge check");
  assert.doesNotMatch(assessment, /Correct answer/i);
  assert.match(html, /Answer Grid/i);
  assert.match(html, /Q1\s*___/);
  assert.match(html, /Q2\s*___/);
});

test("27-4e: climate T/F page keeps answers in JSON but hides them when feedback_display is none", () => {
  const fixture = JSON.parse(fs.readFileSync(climateFixturePath, "utf8"));
  assert.equal(fixture.feedback_display, "none");
  const item = fixture.sections.find((s) => s.section_id === "assessment_check").content.items[0];
  assert.ok(item.true_false_answer);
  const r = api.buildUtilityStructuredHtmlForTest(fixture);
  const html = String(r.html || "");
  const assessment = sectionScope(html, "Formative assessment");
  assert.doesNotMatch(assessment, /Correct answer/i);
});

test("27-4d: after_peer_discussion maps to reflection_then_answers presentation", () => {
  const presentation = api.resolveAssessmentPresentationFromBriefFactors({
    feedback_timing: "after_peer_discussion"
  });
  assert.equal(presentation.feedbackDisplay, "reflection_then_answers");
  assert.equal(presentation.includeAnswers, false);
});

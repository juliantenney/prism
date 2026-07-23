"use strict";

/**
 * Learner interaction improvements: EO order, MCQ, checklist, grouped labels.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  renderLearnerPageHtml,
  buildPageModel
} = require("../lib/learner-renderer-vnext");
const assessmentInteractive = require("../lib/learner-renderer-vnext/assessment-interactive");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const { parsePromptSetItems } = require("../lib/learner-renderer-vnext/parse-prompt-set-items");
const learnerDraftAdapters = require("../lib/learner-renderer-vnext/learner-draft-adapters");

const heteroPath = path.join(
  __dirname,
  "fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
);
const kitchenPath = path.join(
  __dirname,
  "fixtures/page-render/renderer-kitchen-sink-page.json"
);

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function extractActivityHtml(html, activityId) {
  const source = String(html || "");
  const marker = 'id="activity-' + activityId + '"';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return "";

  const openTagStart = source.lastIndexOf("<article", markerIndex);
  if (openTagStart < 0) return "";

  const tagRe = /<(\/?)article\b[^>]*>/gi;
  tagRe.lastIndex = openTagStart;
  let depth = 0;
  let match;
  while ((match = tagRe.exec(source)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return source.slice(openTagStart, tagRe.lastIndex);
    }
  }
  return "";
}

function momentHtml(activityHtml, kind) {
  const re = new RegExp(
    '<section class="util-composition-moment util-composition-moment--' +
      kind +
      '[^"]*"[\\s\\S]*?</section>'
  );
  const match = activityHtml.match(re);
  assert.ok(match, kind + " moment");
  return match[0];
}

function indexOfOrFail(html, needle, label) {
  const index = html.indexOf(needle);
  assert.ok(index >= 0, label + " missing");
  return index;
}

test("expected output precedes A2 and A3 table workspaces", () => {
  const page = loadJson(heteroPath);
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;

  ["A2", "A3"].forEach((activityId) => {
    const doHtml = momentHtml(extractActivityHtml(html, activityId), "do");
    const eo = indexOfOrFail(doHtml, "What to produce", activityId + " EO");
    const table = indexOfOrFail(
      doHtml,
      'data-workspace-kind="table_entry"',
      activityId + " table"
    );
    assert.ok(eo < table, activityId + ": EO must precede table workspace");
    assert.equal((doHtml.match(/What to produce/g) || []).length, 1);
    assert.equal((doHtml.match(/data-workspace-kind="table_entry"/g) || []).length, 1);
  });
});

test("expected output remains before A1 and A4 response workspaces", () => {
  const page = loadJson(heteroPath);
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;

  ["A1", "A4"].forEach((activityId) => {
    const doHtml = momentHtml(extractActivityHtml(html, activityId), "do");
    const eo = indexOfOrFail(doHtml, "What to produce", activityId + " EO");
    const workspace = indexOfOrFail(
      doHtml,
      'data-workspace-kind="text_entry"',
      activityId + " workspace"
    );
    assert.ok(eo < workspace, activityId + ": EO before text workspace");
  });
});

test("A5 argument hint and expected output precede workspaces without duplication", () => {
  const page = loadJson(heteroPath);
  const doHtml = momentHtml(
    extractActivityHtml(
      renderLearnerPageHtml(page, { compositionMode: "moments" }).html,
      "A5"
    ),
    "do"
  );
  const eo = indexOfOrFail(doHtml, "What to produce", "A5 EO");
  const hint = indexOfOrFail(doHtml, "Structure your response", "A5 hint");
  const table = indexOfOrFail(doHtml, 'data-workspace-kind="table_entry"', "A5 table");
  const text = indexOfOrFail(doHtml, 'data-workspace-capability="text_entry"', "A5 text");
  assert.ok(eo < hint, "EO before argument hint");
  assert.ok(hint < table, "hint before table");
  assert.ok(table < text, "table before text");
  assert.equal((doHtml.match(/What to produce/g) || []).length, 1);
  assert.equal((doHtml.match(/Structure your response/g) || []).length, 1);
});

test("interactive MCQ renders radios, check button, and no preselection", () => {
  const page = loadJson(heteroPath);
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  const start = html.indexOf('data-region="assessment"');
  assert.ok(start >= 0);
  const end = html.indexOf('data-region="', start + 10);
  const assessment = html.slice(start, end >= 0 ? end : html.length);
  const interactiveCount = (assessment.match(/util-assessment-item--interactive/g) || [])
    .length;
  assert.ok(interactiveCount >= 5, "expected interactive MCQs");
  assert.equal(
    (assessment.match(/type="radio"/g) || []).length,
    interactiveCount * 4
  );
  assert.equal(
    (assessment.match(/data-assessment-check/g) || []).length,
    interactiveCount
  );
  assert.doesNotMatch(assessment, /\schecked(=|\s|>)/);
  assert.match(assessment, /data-workspace-kind="assessment_selection"/);
});

test("MCQ incomplete items fall back to static rendering", () => {
  const staticItem = assessmentInteractive.renderAssessmentItem(
    {
      item_id: "short-1",
      item_type: "short_answer",
      stem: "Explain residual variance.",
      explanation_or_rationale: "Learners should mention spread."
    },
    0
  );
  assert.match(staticItem, /util-assessment-item--static/);
  assert.doesNotMatch(staticItem, /type="radio"/);

  const incomplete = assessmentInteractive.renderAssessmentItem(
    {
      item_id: "mcq-bad",
      item_type: "single_answer_mcq",
      stem: "Pick one",
      options: ["A", "B"],
      correct_answer: "C"
    },
    1
  );
  assert.match(incomplete, /util-assessment-item--static/);
  assert.doesNotMatch(incomplete, /type="radio"/);
});

test("assessment_selection adapter round-trips selection and checked state", () => {
  const radios = ["A", "B"].map((value) => ({
    value,
    checked: value === "B",
    matches() {
      return false;
    },
    getAttribute() {
      return null;
    }
  }));
  const result = {
    hidden: true,
    textContent: "",
    innerHTML: "",
    className: ""
  };
  const workspace = {
    attributes: {
      "data-workspace-kind": "assessment_selection",
      "data-assessment-correct": "B",
      "data-assessment-rationale": "Because B.",
      "data-assessment-checked": "false"
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name)
        ? this.attributes[name]
        : null;
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
    removeAttribute(name) {
      delete this.attributes[name];
    },
    querySelector(selector) {
      if (selector === 'input[type="radio"][data-assessment-option]:checked') {
        return radios.find((radio) => radio.checked) || null;
      }
      if (selector === "[data-assessment-result]") return result;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === 'input[type="radio"][data-assessment-option]') return radios.slice();
      return [];
    }
  };

  const serialized = learnerDraftAdapters.serializeWorkspaceState(workspace);
  assert.equal(serialized.ok, true);
  assert.equal(serialized.state.value.selectedOption, "B");

  workspace.attributes["data-assessment-checked"] = "true";
  const restored = learnerDraftAdapters.restoreWorkspaceState(workspace, {
    kind: "assessment_selection",
    stateVersion: 1,
    value: { selectedOption: "B", checked: true }
  });
  assert.equal(restored.ok, true);
  assert.equal(result.hidden, false);
  assert.match(result.innerHTML, /Correct/);

  const cleared = learnerDraftAdapters.clearWorkspaceState(workspace);
  assert.equal(cleared.ok, true);
  assert.equal(radios.every((radio) => !radio.checked), true);
});

test("actionable checklists render interactive checkboxes with stable ids", () => {
  const html = renderMaterial(
    {
      id: "A1-M4",
      type: "checklist",
      title: "Concept Self-Check",
      bodyFormat: "markdown",
      body: "",
      checklist: {
        criteria: ["Have I explained residual variance?", "Have I used evidence?"],
        revisionInstruction: "Revise any No answers."
      }
    },
    { activityId: "A1" }
  );
  assert.match(html, /util-interactive-checklist/);
  assert.equal((html.match(/type="checkbox"/g) || []).length, 2);
  assert.match(html, /data-workspace-kind="checklist_entry"/);
  assert.match(html, /data-workspace-id="checklist-a1-a1-m4"/);
  assert.match(html, /data-checklist-item-id="checklist-a1-a1-m4-item-0"/);
  assert.match(html, /for="checklist-a1-a1-m4-item-0"/);
  assert.doesNotMatch(html, /<ul class="util-checklist"/);
});

test("static lists without checklist criteria remain static", () => {
  const html = renderMaterial({
    id: "NOTE-1",
    type: "text",
    title: "Notes",
    bodyFormat: "markdown",
    body: "- Point one\n- Point two"
  });
  assert.doesNotMatch(html, /util-interactive-checklist/);
  assert.doesNotMatch(html, /type="checkbox"/);
});

test("grouped prompt_set labels are distinct Response N without changing ids", () => {
  const items = parsePromptSetItems("1. First prompt here\n2. Second prompt here\n3. Third");
  assert.deepEqual(
    items.map((item) => item.label),
    ["Response 1", "Response 2", "Response 3"]
  );

  const page = loadJson(heteroPath);
  const a4 = extractActivityHtml(
    renderLearnerPageHtml(page, { compositionMode: "moments" }).html,
    "A4"
  );
  assert.match(a4, /Response 1/);
  assert.match(a4, /Response 2/);
  assert.match(a4, /data-workspace-id="learner-workspace-a4-a4-prompt-item-a4-m3-item-1-1"/);
  assert.match(a4, /data-workspace-id="learner-workspace-a4-a4-prompt-item-a4-m3-item-2-2"/);
});

test("kitchen-sink short_answer remains static while true_false can be interactive", () => {
  const page = loadJson(kitchenPath);
  const section = (page.sections || []).find(
    (entry) => entry.section_id === "assessment_check"
  );
  const items = (section && section.content && section.content.items) || [];
  assert.equal(items.length, 3);

  const mcq = assessmentInteractive.renderAssessmentItem(items[0], 0);
  const tf = assessmentInteractive.renderAssessmentItem(items[1], 1);
  const shortAnswer = assessmentInteractive.renderAssessmentItem(items[2], 2);

  assert.match(mcq, /util-assessment-item--interactive/);
  assert.match(tf, /util-assessment-item--interactive/);
  assert.match(shortAnswer, /util-assessment-item--static/);
  assert.doesNotMatch(shortAnswer, /type="radio"/);
});

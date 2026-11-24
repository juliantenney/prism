/**
 * Sprint 101E Option B — Practice Do selection controls vertical slice.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page.js");
const normalizeSelection =
  require("../lib/learner-renderer-vnext/normalize-selection.js");
const workspaceFromResponsePart =
  require("../lib/learner-renderer-vnext/learner-surface-registry.js")
    .workspaceFromResponsePart;
const types = require("../lib/learner-renderer-vnext/response-part-types.js");
const assessmentRuntime = require("../lib/learner-renderer-vnext/assessment-runtime.js");
const draftAdapters = require("../lib/learner-renderer-vnext/learner-draft-adapters.js");
const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");
const { loadPrismAppJsTestApi, DEFAULT_LIBS } = require("./prism-vm-lib-bootstrap.js");

function practicePageWithSelections() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Multiplier decisions — practice",
    page_synthesis: {
      overview: {
        body: "Decide what each candidate establishes, then justify briefly.",
        format: "markdown"
      }
    },
    activities: [
      {
        activity_id: "A1",
        title: "Evaluate candidate points",
        learner_task:
          "For (4,6): decide feasibility, stationarity, and what the evidence establishes; then write a short justification.",
        expected_output:
          "Selections for feasibility, stationarity, and evidential force, plus a short mathematical justification.",
        activity_preamble:
          "Keep feasibility, the multiplier condition, and extremum claims as separate decisions.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { id: "orient", function: "framing" },
            { id: "model", function: "worked_thinking" },
            { id: "do", function: "guided_practice" },
            { id: "check", function: "verification" }
          ]
        },
        materials: [
          {
            material_id: "A1-M-stimulus",
            material_type: "text",
            title: "Working apparatus",
            body: "Maximise \\(A(x,y)=xy\\) subject to \\(x+y=10\\), \\(x>0\\), \\(y>0\\). Consider the candidate point (4,6)."
          },
          {
            material_id: "A1-M-feas",
            material_type: "selection",
            title: "Feasibility",
            body: "Is (4,6) feasible under the perimeter constraint?",
            selection: {
              form: "single_select",
              prompt: "Is (4,6) feasible under \\(x+y=10\\), \\(x>0\\), \\(y>0\\)?",
              options: [
                { key: "feasible", text: "Feasible" },
                { key: "infeasible", text: "Infeasible" }
              ],
              correct_answer: "feasible",
              feedback:
                "(4,6) meets the perimeter and positivity constraints, so it is feasible."
            }
          },
          {
            material_id: "A1-M-stat",
            material_type: "selection",
            title: "Multiplier condition",
            selection: {
              form: "single_select",
              prompt: "Does (4,6) satisfy the multiplier stationarity condition for this problem?",
              options: [
                { key: "yes", text: "Yes — it is a stationary candidate" },
                { key: "no", text: "No — it fails stationarity" }
              ],
              correct_answer: "yes",
              feedback:
                "At (4,6) the gradients are parallel under the constraint, so stationarity holds."
            }
          },
          {
            material_id: "A1-M-force",
            material_type: "selection",
            title: "What the evidence establishes",
            selection: {
              form: "multi_select",
              prompt: "What does the present evidence establish? Select all that apply.",
              options: [
                { key: "feasible", text: "The point is feasible" },
                { key: "stationary", text: "The point is a stationary candidate" },
                { key: "maximum", text: "The point is an established maximum" },
                { key: "minimum", text: "The point is an established minimum" }
              ],
              correct_answers: ["feasible", "stationary"],
              feedback:
                "Feasibility and stationarity are established; extremum claims need further justification."
            }
          },
          {
            material_id: "A1-M-justify",
            material_type: "template",
            title: "Brief mathematical justification",
            body:
              "**Justification:** Explain why feasibility and stationarity do not by themselves establish a maximum."
          },
          {
            material_id: "A1-M-check",
            material_type: "checklist",
            title: "Check your work",
            body_format: "json",
            body: {
              mode: "diagnostic_review",
              criteria: [
                {
                  id: "c1",
                  statement: "Feasibility and stationarity were judged separately.",
                  look_for: ["Separate decisions for constraint satisfaction and stationarity"],
                  if_missing: ["Revisit the feasibility and multiplier selections"],
                  why_it_matters: "Collapsing the two claims hides unsupported leaps."
                },
                {
                  id: "c2",
                  statement: "Extremum claims are not overstated.",
                  look_for: ["Maximum/minimum not claimed without further justification"],
                  if_missing: ["Remove unsupported extremum claims"],
                  why_it_matters: "Stationarity alone does not prove an extremum."
                }
              ]
            }
          }
        ],
        required_materials: [
          {
            material_id: "A1-M-stimulus",
            type: "text",
            purpose: "stimulus",
            specification: "Working formulae"
          },
          {
            material_id: "A1-M-feas",
            type: "selection",
            purpose: "production",
            specification: "Feasibility decision"
          },
          {
            material_id: "A1-M-stat",
            type: "selection",
            purpose: "production",
            specification: "Stationarity decision"
          },
          {
            material_id: "A1-M-force",
            type: "selection",
            purpose: "production",
            specification: "Evidential force"
          },
          {
            material_id: "A1-M-justify",
            type: "template",
            purpose: "production",
            specification: "Brief justification"
          },
          {
            material_id: "A1-M-check",
            type: "checklist",
            purpose: "feedback",
            specification: "Criterion review"
          }
        ]
      }
    ],
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "design_learning_activities", "generate_activity_materials"]
    }
  };
}

test("normalizeSelectionSemantics accepts single/multi and rejects malformed", () => {
  const ok = normalizeSelection.normalizeSelectionSemantics({
    selection: {
      form: "single_select",
      prompt: "Choose",
      options: [
        { key: "a", text: "A" },
        { key: "b", text: "B" }
      ],
      correct_answer: "a"
    }
  });
  assert.equal(ok.ok, true);
  assert.equal(ok.model.determinate, true);
  assert.equal(ok.model.correctAnswer, "a");

  const bad = normalizeSelection.normalizeSelectionSemantics({
    selection: { form: "single_select", prompt: "Choose", options: [{ key: "a", text: "A" }] }
  });
  assert.equal(bad.ok, false);

  const mismatch = normalizeSelection.normalizeSelectionSemantics({
    selection: {
      form: "single_select",
      prompt: "Choose",
      options: [
        { key: "a", text: "A" },
        { key: "b", text: "B" }
      ],
      correct_answer: "z"
    }
  });
  assert.equal(mismatch.ok, false);
});

test("registry builds selection workspaces (no longer unsupported)", () => {
  const mapped = workspaceFromResponsePart(
    {
      responsePartId: "A1-selection-feas-1",
      surfaceKind: types.SURFACE_KIND.SINGLE_SELECT,
      label: "Feasibility",
      prompt: "Is it feasible?",
      selection: {
        form: "single_select",
        prompt: "Is it feasible?",
        options: [
          { key: "yes", text: "Yes" },
          { key: "no", text: "No" }
        ],
        correct_answer: "yes",
        feedback: "Yes."
      }
    },
    { activityId: "A1" }
  );
  assert.equal(mapped.ok, true);
  assert.equal(mapped.workspace.capability, "single_select");
  assert.equal(mapped.workspace.selection.determinate, true);
});

test("Practice page renders selection radios/checkboxes with a11y + check + guided review", () => {
  const built = buildPageModel(practicePageWithSelections());
  assert.equal(built.ok, true, JSON.stringify(built.diagnostics || built.error || {}));
  const html = renderPage(built.model, { includeRuntimeScripts: true });

  assert.match(html, /data-practice-selection="true"/);
  assert.match(html, /data-assessment-form="single_answer_mcq"/);
  assert.match(html, /data-assessment-form="multiple_answer_mcq"/);
  assert.match(html, /type="radio"/);
  assert.match(html, /type="checkbox"/);
  assert.match(html, /util-assessment-fieldset/);
  assert.match(html, /util-assessment-legend/);
  assert.match(html, /data-assessment-check/);
  assert.match(html, /data-assessment-rationale=/);
  assert.match(html, /data-guided-review="true"/);
  assert.match(html, /data-workspace-kind="assessment_selection"/);
  assert.match(html, /data-workspace-kind="checklist_entry"/);
  assert.match(html, /getAssessmentRuntimeScript|data-assessment-check/);
  // Runtime scripts present for check + drafts
  assert.match(html, /prism:learner-workspace-change|assessment_selection/);
  assert.match(html, /util-practice-decision-grid|util-practice-selection/);
});

function createStubNode(tagName) {
  const node = {
    tagName: String(tagName || "").toUpperCase(),
    className: "",
    attributes: Object.create(null),
    children: [],
    parentNode: null,
    value: "",
    checked: false,
    hidden: false,
    _text: "",
    _html: "",
    classList: {
      _classes: Object.create(null),
      contains(name) {
        return Boolean(this._classes[name]);
      },
      add(name) {
        this._classes[name] = true;
      },
      remove(name) {
        delete this._classes[name];
      }
    },
    get textContent() {
      return node._text + node.children.map((child) => child.textContent || "").join("");
    },
    set textContent(value) {
      node._text = String(value == null ? "" : value);
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name)
        ? this.attributes[name]
        : null;
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name === "value") this.value = String(value);
      if (name === "class") {
        this.className = String(value);
        this.classList._classes = Object.create(null);
        String(value)
          .split(/\s+/)
          .filter(Boolean)
          .forEach((cls) => {
            this.classList._classes[cls] = true;
          });
      }
      if (name === "hidden") this.hidden = true;
    },
    removeAttribute(name) {
      delete this.attributes[name];
      if (name === "hidden") this.hidden = false;
    },
    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      return child;
    },
    contains(other) {
      if (other === this) return true;
      return this.children.some(
        (child) => child === other || (child.contains && child.contains(other))
      );
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    },
    querySelectorAll(selector) {
      const found = [];
      const walk = (current) => {
        current.children.forEach((child) => {
          if (stubMatches(child, selector)) found.push(child);
          walk(child);
        });
      };
      walk(this);
      return found;
    },
    matches(selector) {
      return stubMatches(this, selector);
    },
    closest(selector) {
      let current = this;
      while (current) {
        if (stubMatches(current, selector)) return current;
        current = current.parentNode;
      }
      return null;
    },
    addEventListener(type, handler) {
      if (!this._listeners) this._listeners = [];
      this._listeners.push({ type, handler });
    },
    removeEventListener(type, handler) {
      if (!this._listeners) return;
      this._listeners = this._listeners.filter(
        (entry) => !(entry.type === type && entry.handler === handler)
      );
    },
    dispatchEvent(event) {
      if (!event.target) event.target = this;
      if (!event.preventDefault) event.preventDefault = function () {};
      let current = this;
      while (current) {
        (current._listeners || [])
          .filter((entry) => entry.type === event.type)
          .forEach((entry) => entry.handler(event));
        if (!event.bubbles) break;
        current = current.parentNode;
      }
      return true;
    },
    click() {
      this.dispatchEvent({ type: "click", bubbles: true, target: this });
    }
  };
  Object.defineProperty(node, "innerHTML", {
    get() {
      return node._html;
    },
    set(value) {
      node._html = String(value || "");
      node._text = node._html.replace(/<[^>]+>/g, "");
      node.children = [];
    }
  });
  return node;
}

function stubMatches(node, selector) {
  const sel = String(selector || "").trim();
  if (sel === "input[type=radio]:checked" || sel === 'input[type="radio"]:checked') {
    return node.tagName === "INPUT" && node.getAttribute("type") === "radio" && !!node.checked;
  }
  if (
    sel === 'input[type="radio"][data-assessment-option]' ||
    sel === "input[type=radio][data-assessment-option]"
  ) {
    return (
      node.tagName === "INPUT" &&
      node.getAttribute("type") === "radio" &&
      node.getAttribute("data-assessment-option") != null
    );
  }
  if (sel === 'input[type="checkbox"][data-assessment-option]') {
    return (
      node.tagName === "INPUT" &&
      node.getAttribute("type") === "checkbox" &&
      node.getAttribute("data-assessment-option") != null
    );
  }
  if (sel === ".util-assessment-item--interactive") {
    return !!(node.classList && node.classList.contains("util-assessment-item--interactive"));
  }
  if (sel === "[data-assessment-result]") {
    return node.getAttribute("data-assessment-result") != null;
  }
  if (sel === "[data-assessment-check]") {
    return node.getAttribute("data-assessment-check") != null;
  }
  if (sel === '[data-renderer="vnext"]') {
    return node.getAttribute("data-renderer") === "vnext";
  }
  if (sel.startsWith("input[data-assessment-option=")) {
    const key = sel.match(/"([^"]+)"/)[1];
    return node.tagName === "INPUT" && node.getAttribute("data-assessment-option") === key;
  }
  if (sel.startsWith("[")) {
    const body = sel.slice(1, -1);
    const eq = body.indexOf("=");
    if (eq < 0) return node.getAttribute(body) != null;
    const attr = body.slice(0, eq);
    const raw = body.slice(eq + 1).replace(/^["']|["']$/g, "");
    return node.getAttribute(attr) === raw;
  }
  return false;
}

test("determinate check + draft serialize/restore for Practice selection markup", () => {
  const article = createStubNode("article");
  article.setAttribute(
    "class",
    "util-task-block util-assessment-item util-assessment-item--interactive util-practice-selection"
  );
  article.setAttribute("data-workspace-kind", "assessment_selection");
  article.setAttribute("data-workspace-id", "assessment-feas");
  article.setAttribute("data-assessment-form", "single_answer_mcq");
  article.setAttribute("data-assessment-correct", "feasible");
  article.setAttribute(
    "data-assessment-rationale",
    "(4,6) meets the perimeter and positivity constraints, so it is feasible."
  );
  article.setAttribute("data-practice-selection", "true");

  const radioYes = createStubNode("input");
  radioYes.setAttribute("type", "radio");
  radioYes.setAttribute("data-assessment-option", "feasible");
  radioYes.setAttribute("value", "feasible");
  radioYes.value = "feasible";

  const radioNo = createStubNode("input");
  radioNo.setAttribute("type", "radio");
  radioNo.setAttribute("data-assessment-option", "infeasible");
  radioNo.setAttribute("value", "infeasible");
  radioNo.value = "infeasible";

  const checkBtn = createStubNode("button");
  checkBtn.setAttribute("data-assessment-check", "");
  checkBtn.setAttribute("type", "button");

  const result = createStubNode("div");
  result.setAttribute("data-assessment-result", "");
  result.hidden = true;

  article.appendChild(radioYes);
  article.appendChild(radioNo);
  article.appendChild(checkBtn);
  article.appendChild(result);

  const root = createStubNode("main");
  root.setAttribute("data-renderer", "vnext");
  root.className = "util-learner-renderer-vnext";
  root.appendChild(article);

  const install = assessmentRuntime.installAssessmentRuntime(root);
  assert.equal(install.ok, true);

  radioYes.checked = true;
  checkBtn.click();
  assert.equal(result.hidden, false);
  assert.match(result.textContent, /Correct/i);
  assert.match(result.textContent, /feasible|perimeter|constraint/i);

  const serialized = draftAdapters.serializeWorkspaceState(article);
  assert.equal(serialized.ok, true);
  assert.equal(serialized.state.value.selectedOption, "feasible");

  radioYes.checked = false;
  radioNo.checked = true;
  const restored = draftAdapters.restoreWorkspaceState(article, serialized.state);
  assert.equal(restored.ok, true);
  assert.equal(radioYes.checked, true);
  assert.equal(radioNo.checked, false);
  assert.notEqual(article.getAttribute("data-assessment-checked"), "true");

  install.dispose();
});

test("matching selection material renders labelled selects", () => {
  const page = practicePageWithSelections();
  page.activities[0].materials.push({
    material_id: "A1-M-match",
    material_type: "selection",
    title: "Match claim to status",
    selection: {
      form: "matching",
      prompt: "Match each claim to its status.",
      left: [
        { id: "c1", text: "Feasibility of (4,6)" },
        { id: "c2", text: "Established maximum" }
      ],
      right: [
        { id: "supported", text: "Supported by evidence" },
        { id: "unsupported", text: "Unsupported inference" }
      ],
      pairs: { c1: "supported", c2: "unsupported" },
      feedback: "Feasibility is supported; maximum is not yet established."
    }
  });
  const built = buildPageModel(page);
  assert.equal(built.ok, true, JSON.stringify(built.diagnostics || {}));
  const html = renderPage(built.model, { includeRuntimeScripts: true });
  assert.match(html, /data-assessment-form="matching"/);
  assert.match(html, /data-assessment-pair/);
  assert.match(html, /<select[^>]+data-assessment-pair/);
  assert.match(html, /for="assessment-match-/);
});

test("Practice contracts commission selection materials; Interactive unchanged", () => {
  assert.match(practiceContracts.CONTRACT_VERSION, /104M3-PRACTICE-RECONCILED-V1/);
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  assert.match(dla, /selection\.form "single_select"/);
  assert.match(dla, /selection\.form "multi_select"/);
  assert.match(dla, /selection\.form "matching"/);

  const { api } = loadPrismAppJsTestApi({ libs: DEFAULT_LIBS.slice() });
  const interactiveDla = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design Interactive learning activities.\n",
    {
      canonical_step_id: "step_design_learning_activities",
      canonical_title: "Design Learning Activities",
      title: "Design Learning Activities"
    },
    {
      product: "interactive",
      variant: "self_study",
      startingPoint: "generate_from_topic",
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true }
    },
    {}
  );
  assert.doesNotMatch(interactiveDla, /101E-PRACTICE-SELECTION-PAYLOAD/);
  assert.doesNotMatch(interactiveDla, /selection\.form "single_select"/);
});

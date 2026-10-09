"use strict";

/**
 * Sprint 93 — Assessment Pack guided self-evaluation and revision.
 * Carousel navigation, draft preservation, and the one stored forward sentence.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("node:vm");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const { getGuidedReviewRuntimeScript } = require("../lib/learner-renderer-vnext/guided-review-runtime");
const adapters = require("../lib/learner-renderer-vnext/learner-draft-adapters");

const PREMATURE_FORWARD =
  "In your design proposal, identify the comparison condition and explain why it would provide a more credible counterfactual. Also explain which differences between groups would still need attention.";
const CORRECTED_FORWARD =
  "When you write your methodological judgement, identify the comparison condition and explain why it would provide a more credible counterfactual. Also explain which differences between groups would still need attention.";
const SHORTER_FEEDBACK =
  "In your design proposal, identify the comparison condition and explain why it would provide a more credible counterfactual.";
const COMPARE_BOTH_VERSIONS =
  "Compare your original and revised judgements. Notice whether your revision improved the precision of the causal conclusion, the prioritisation of rival explanations or the connection between design choices and validity threats. Your response is not being automatically judged; the value of this stage lies in making your reasoning visible to yourself and improving one consequential part of it. Use the uncertainty that remains to consider what additional evidence would most change your confidence.";
const REFLECT_ON_CHANGES =
  "Reflect on the changes you made. Notice whether your revision improved the precision of the causal conclusion, the prioritisation of rival explanations or the connection between design choices and validity threats. Your response is not being automatically judged; the value of this stage lies in making your reasoning visible to yourself and improving one consequential part of it. Use the uncertainty that remains to consider what additional evidence would most change your confidence.";
const DIFFERENT_COMPARE_SENTENCE =
  "Compare your original and revised judgements and notice whether the revision improved the causal conclusion.";

const CRITERIA = [
  {
    material_id: "c1",
    title: "Self-evaluation: accuracy and restraint of the causal conclusion",
    body: "Have you stated clearly that balance scores improved without claiming that this alone establishes a programme effect?"
  },
  {
    material_id: "c2",
    title: "Self-evaluation: plausible rival explanations",
    body: "Have you explained how each rival explanation could influence the observed balance scores rather than simply naming a threat?"
  },
  {
    material_id: "c3",
    title: "Self-evaluation: design appropriateness and feasibility",
    body: "Is the comparison condition or repeated-observation strategy sufficiently clear to show what evidence it would add?"
  },
  {
    material_id: "c4",
    title: "Self-evaluation: remaining limitations and uncertainty",
    body: "Have you identified what your stronger design would still leave unresolved, including differences between groups?"
  },
  {
    material_id: "c5",
    title: "Self-evaluation: quality of methodological justification",
    body: "Look for explicit links between the weaknesses you identified and the design safeguards you proposed."
  }
];

function page() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Can We Claim the Intervention Worked? Evaluating Causal Evidence in Clinical Research",
    activities: [],
    sections: [
      {
        section_id: "situation",
        title: "The situation",
        exposition: "Your task is to examine what can legitimately be inferred from this evidence."
      }
    ],
    assessment_evidence: {
      purpose: {
        role: "R2",
        visibility_claim: "Whether the learner can defend a causal judgement.",
        stop_rationale: "A short formative stop before the next study block.",
        forward_intent: "Show the learner what to concentrate on next."
      },
      learner_context: {
        depends_on_prior_work: false,
        entry_assumptions: [
          "The learner is studying Research Methods at postgraduate level in Sports and Exercise Medicine."
        ],
        bring_forward: [
          {
            what: "Your notes on Campbell and Stanley.",
            how_used: "Use them when you judge the rehabilitation service's claim."
          }
        ]
      },
      elicitations: [
        {
          elicitation_id: "E4",
          order: 4,
          evidence_ask:
            "Interpret the contribution of an appropriate concurrent comparison group to causal inference.",
          epistemic_class: "determinate",
          delivery: {
            kind: "auto_checkable_items",
            items: [
              {
                item_id: "e4-q",
                order: 1,
                form: "single_answer_mcq",
                prompt: {
                  stem: "What is the strongest methodological reason for including this comparison group?",
                  options: [
                    { key: "a", text: "It proves the programme caused the improvement." },
                    { key: "b", text: "It supplies a concurrent comparison." }
                  ]
                },
                judgement: { correct_answer: "b", auto_checkable: true },
                feedback_note: SHORTER_FEEDBACK
              }
            ]
          },
          formative_return: {
            forward_orientation: PREMATURE_FORWARD
          }
        },
        {
          elicitation_id: "E6",
          order: 6,
          evidence_ask:
            "Elicit an independently constructed, integrated methodological judgement evaluating the service's causal claim.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: {
              title: "Your methodological judgement",
              context: "There was no concurrent comparison group.",
              task: "Write a reasoned methodological judgement for the rehabilitation service. Propose a stronger evaluation design and justify the remaining uncertainty.",
              response_expectation: "Develop a coherent, justified argument rather than a list of methodological terms.",
              suggested_length: "Approximately 300–450 words, or an equivalently developed response.",
              indicative_time: "8–9 minutes"
            },
            response_workspace: {
              intention: "Provide a substantial, editable text workspace in which the learner can draft a methodological judgement."
            }
          },
          formative_return: {
            materials: CRITERIA.concat([
              {
                material_id: "revise",
                title: "Identify one weakness and revise",
                body: "Return to your written judgement and select one weakness revealed by the criteria."
              }
            ]),
            forward_orientation: COMPARE_BOTH_VERSIONS,
            revision: {
              offered: true,
              prompt:
                "Identify one weakness in your methodological judgement using the self-evaluation criteria. Explain briefly why it matters, then revise or extend your original response to address it."
            }
          }
        }
      ],
      pack_forward_orientation: DIFFERENT_COMPARE_SENTENCE
    }
  };
}

function render() {
  return renderLearnerPageHtml(page(), { compositionMode: "beats" });
}

function constructedSlice(html) {
  const start = html.indexOf('data-assessment-mode="constructed"');
  assert.ok(start >= 0);
  return html.slice(start);
}

test("five self-evaluation criteria stay intact in a guided review", () => {
  const result = render();
  assert.equal(result.error, null, result.error);
  const html = result.html;
  const constructed = constructedSlice(html).split("<script>")[0];
  assert.equal((constructed.match(/data-guided-review-index="/g) || []).length, 5);
  assert.match(constructed, /data-guided-review="true"/);
  assert.match(constructed, /aria-label="Guided self-evaluation"/);
  assert.match(constructed, /class="util-guided-review__nav" hidden data-guided-review-nav/);
  assert.match(constructed, /class="util-guided-review__nav-btn util-guided-review__nav-btn--prev"/);
  assert.match(constructed, /class="util-guided-review__nav-btn util-guided-review__nav-btn--next"/);
  assert.match(constructed, /aria-label="Previous criterion"/);
  assert.match(constructed, /aria-label="Next criterion"/);
  assert.match(constructed, /type="button"/);
  ["1 of 5", "2 of 5", "3 of 5", "4 of 5", "5 of 5"].forEach(function (label) {
    assert.match(constructed, new RegExp(label.replace(" ", "\\s")));
  });
  CRITERIA.forEach(function (criterion) {
    assert.match(constructed, new RegExp(criterion.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(constructed, new RegExp(criterion.body.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  assert.match(constructed, /Identify one weakness and revise/);
  assert.match(constructed, /Return to your written judgement and select one weakness revealed by the criteria/);
  assert.doesNotMatch(
    constructed,
    /Identify one weakness in your methodological judgement using the self-evaluation criteria/
  );
  assert.match(constructed, /What is the most important weakness you identified in your argument\?/);
  assert.match(constructed, /Revise your written judgement/);
  assert.match(constructed, /Revision is yours to make/);
  assert.doesNotMatch(constructed, /type="checkbox"/);
  assert.doesNotMatch(constructed, /data-assessment-correct/);
  assert.doesNotMatch(constructed, /data-workspace-kind="checklist_entry"/);
  const lastCriterion = constructed.indexOf("quality of methodological justification");
  const revisionMaterial = constructed.indexOf("Identify one weakness and revise");
  const weakness = constructed.indexOf("What is the most important weakness you identified in your argument?");
  assert.ok(lastCriterion < revisionMaterial && revisionMaterial < weakness);
  assert.match(html, /<script>[\s\S]*data-guided-review-next/);
  const appCss = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
  assert.match(
    appCss,
    /\.util-learner-renderer-vnext \.util-guided-review__nav-btn:hover:not\(:disabled\)\{background:#f8fafc;border-color:#94a3b8\}/
  );
  assert.match(
    appCss,
    /@media \(max-width:720px\)\{\.util-learner-renderer-vnext \.util-guided-review__nav\{flex-direction:column\}\.util-learner-renderer-vnext \.util-guided-review__nav-btn\{width:100%\}\}/
  );
});

test("guided review moves one criterion at a time and leaves the written judgement unchanged", () => {
  const result = render();
  assert.equal(result.error, null, result.error);
  const html = result.html;
  const progresses = [];
  const progressRe = /data-guided-review-progress>([^<]+)</g;
  let match;
  while ((match = progressRe.exec(html))) progresses.push(match[1]);
  assert.deepEqual(progresses, ["1 of 5", "2 of 5", "3 of 5", "4 of 5", "5 of 5"]);

  const listeners = { click: [] };
  function makeEl(tagName, attrs) {
    const el = {
      tagName: String(tagName || "").toUpperCase(),
      attributes: Object.assign(Object.create(null), attrs || {}),
      children: [],
      parentNode: null,
      disabled: false,
      hidden: Object.prototype.hasOwnProperty.call(attrs || {}, "hidden"),
      textContent: "",
      value: "",
      id: attrs && attrs.id ? attrs.id : "",
      getAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
      },
      setAttribute(name, value) {
        this.attributes[name] = String(value);
        if (name === "hidden") this.hidden = true;
        if (name === "id") this.id = String(value);
      },
      removeAttribute(name) {
        delete this.attributes[name];
        if (name === "hidden") this.hidden = false;
      },
      hasAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name);
      },
      matches(sel) {
        if (sel.indexOf("[data-guided-review-next]") >= 0) return this.hasAttribute("data-guided-review-next");
        if (sel.indexOf("[data-guided-review-prev]") >= 0) return this.hasAttribute("data-guided-review-prev");
        return false;
      },
      closest(sel) {
        let node = this;
        while (node) {
          if (sel === '[data-guided-review="true"]' && node.getAttribute("data-guided-review") === "true") return node;
          if (sel.indexOf("[data-guided-review-prev]") >= 0 && node.hasAttribute("data-guided-review-prev")) return node;
          if (sel.indexOf("[data-guided-review-next]") >= 0 && node.hasAttribute("data-guided-review-next")) return node;
          if (sel === "[data-assessment-return-to-response]" && node.hasAttribute("data-assessment-return-to-response")) {
            return node;
          }
          node = node.parentNode;
        }
        return null;
      },
      focus() {
        document.activeElement = this;
      },
      click() {
        listeners.click.forEach(function (fn) {
          fn({ target: this, preventDefault() {} });
        }, this);
      },
      querySelector(sel) {
        return this.querySelectorAll(sel)[0] || null;
      },
      querySelectorAll(sel) {
        return queryAll(this, sel);
      }
    };
    return el;
  }
  function collect(node, out) {
    out.push(node);
    (node.children || []).forEach(function (child) {
      collect(child, out);
    });
  }
  function queryAll(root, sel) {
    const all = [];
    collect(root, all);
    return all.filter(function (el) {
      if (sel === '[data-guided-review="true"]') return el.getAttribute("data-guided-review") === "true";
      if (sel === "[data-guided-review-index]") return el.hasAttribute("data-guided-review-index");
      if (sel.indexOf('[data-guided-review-index="') === 0) {
        return el.getAttribute("data-guided-review-index") === sel.match(/"(\d+)"/)[1];
      }
      if (sel === "[data-guided-review-progress]") return el.hasAttribute("data-guided-review-progress");
      if (sel === "[data-guided-review-status]") return el.hasAttribute("data-guided-review-status");
      if (sel === "[data-guided-review-prev]") return el.hasAttribute("data-guided-review-prev");
      if (sel === "[data-guided-review-next]") return el.hasAttribute("data-guided-review-next");
      if (sel === "[data-guided-review-nav]") return el.hasAttribute("data-guided-review-nav");
      if (sel.charAt(0) === "#") return el.id === sel.slice(1);
      if (sel.indexOf('[id="') === 0) return el.id === sel.slice(5, -2);
      return false;
    });
  }

  const document = {
    readyState: "complete",
    activeElement: null,
    addEventListener(type, fn) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(fn);
    },
    getElementById(id) {
      return queryAll(document.body, "#" + id)[0] || null;
    },
    querySelector(sel) {
      return queryAll(document.body, sel)[0] || null;
    },
    querySelectorAll(sel) {
      return queryAll(document.body, sel);
    },
    body: null
  };
  const root = makeEl("div", { "data-guided-review": "true" });
  const status = makeEl("p", { "data-guided-review-status": "" });
  const panels = progresses.map(function (label, index) {
    const panel = makeEl("section", { "data-guided-review-index": String(index) });
    const progress = makeEl("p", { "data-guided-review-progress": "" });
    progress.textContent = label;
    progress.parentNode = panel;
    panel.children.push(progress);
    panel.parentNode = root;
    return panel;
  });
  const nav = makeEl("div", { "data-guided-review-nav": "", hidden: "" });
  const prev = makeEl("button", { "data-guided-review-prev": "" });
  const next = makeEl("button", { "data-guided-review-next": "" });
  prev.parentNode = nav;
  next.parentNode = nav;
  nav.children.push(prev, next);
  nav.parentNode = root;
  const back = makeEl("a", { href: "#assessment-constructed-E6", "data-assessment-return-to-response": "assessment-constructed-E6" });
  back.parentNode = root;
  const field = makeEl("textarea", { id: "assessment-constructed-E6" });
  field.value = "The improvement does not establish that the programme caused it.";
  status.parentNode = root;
  root.children.push(status, ...panels, nav, back);
  const pageRoot = makeEl("div", {});
  root.parentNode = pageRoot;
  field.parentNode = pageRoot;
  pageRoot.children.push(root, field);
  document.body = pageRoot;

  const sandbox = { document: document, Array: Array, Number: Number, String: String, Math: Math };
  vm.createContext(sandbox);
  vm.runInContext(getGuidedReviewRuntimeScript(), sandbox);

  assert.equal(panels[0].hidden, false);
  assert.equal(panels[1].hidden, true);
  assert.equal(panels[4].hidden, true);
  assert.equal(prev.disabled, true);
  next.click();
  assert.equal(panels[0].hidden, true);
  assert.equal(panels[1].hidden, false);
  assert.equal(status.textContent, "2 of 5");
  assert.equal(document.activeElement, next);
  next.click();
  next.click();
  prev.click();
  assert.equal(status.textContent, "3 of 5");
  assert.equal(panels[2].hidden, false);
  assert.equal(panels[3].hidden, true);
  for (let step = 0; step < 5; step += 1) prev.click();
  assert.equal(status.textContent, "1 of 5");
  assert.equal(field.value, "The improvement does not establish that the programme caused it.");
  back.click();
  assert.equal(document.activeElement, field);
  assert.equal(field.value, "The improvement does not establish that the programme caused it.");
});

test("weakness statement and written judgement persist as separate text entries", () => {
  const result = render();
  assert.equal(result.error, null, result.error);
  const html = result.html;
  assert.match(html, /data-workspace-id="assessment-constructed-E6"/);
  assert.match(html, /data-workspace-id="assessment-constructed-E6-weakness"/);
  assert.match(html, /What is the most important weakness you identified in your argument\?/);
  assert.match(html, /Revision is yours to make\. It is not marked correct or incorrect\./);
  assert.match(html, /Revise your written judgement/);
  const constructed = constructedSlice(html);
  assert.equal((constructed.match(/data-workspace-kind="text_entry"/g) || []).length, 2);
  assert.equal((constructed.match(/data-assessment-judgement="none"/g) || []).length, 2);

  function workspace(id, text) {
    const input = { value: text };
    return {
      input: input,
      getAttribute(name) {
        if (name === "data-workspace-kind") return "text_entry";
        if (name === "data-workspace-id") return id;
        return null;
      },
      querySelector(sel) {
        return sel === "textarea.util-learner-workspace__input" ? input : null;
      }
    };
  }
  const judgement = workspace("assessment-constructed-E6", "The claim is not established.");
  const weakness = workspace("assessment-constructed-E6-weakness", "I overstated the causal conclusion.");
  const savedJudgement = adapters.serializeWorkspaceState(judgement);
  const savedWeakness = adapters.serializeWorkspaceState(weakness);
  assert.equal(savedJudgement.ok, true);
  assert.equal(savedWeakness.ok, true);
  assert.equal(savedJudgement.state.value.text, "The claim is not established.");
  assert.equal(savedWeakness.state.value.text, "I overstated the causal conclusion.");
  judgement.input.value = "";
  weakness.input.value = "A rival explanation needs a clearer mechanism.";
  const revisedWeakness = adapters.serializeWorkspaceState(weakness);
  adapters.restoreWorkspaceState(judgement, savedJudgement.state);
  adapters.restoreWorkspaceState(weakness, revisedWeakness.state);
  assert.equal(judgement.input.value, "The claim is not established.");
  assert.equal(weakness.input.value, "A rival explanation needs a clearer mechanism.");
});

test("the premature design-proposal sentence is corrected only as that exact forward orientation", () => {
  const result = render();
  assert.equal(result.error, null, result.error);
  const html = result.html;
  assert.match(html, new RegExp(CORRECTED_FORWARD.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(html.includes(PREMATURE_FORWARD), false);
  assert.match(html, /Propose a stronger evaluation design and justify the remaining uncertainty/);
  assert.match(html, new RegExp(SHORTER_FEEDBACK.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(html, /What to bring with you/);
  assert.match(html, /Your notes on Campbell and Stanley/);
  assert.match(html, /strongest methodological reason for including this comparison group/);
  assert.match(html, /Your methodological judgement/);
  assert.match(html, new RegExp(REFLECT_ON_CHANGES.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(html.includes(COMPARE_BOTH_VERSIONS), false);
  assert.match(html, new RegExp(DIFFERENT_COMPARE_SENTENCE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(html, /What to take forward/);
  [
    "The learner is studying Research Methods",
    "Whether the learner can defend a causal judgement",
    "A short formative stop before the next study block",
    "Show the learner what to concentrate on next",
    "Interpret the contribution of an appropriate concurrent comparison group",
    "Elicit an independently constructed",
    "Provide a substantial, editable text workspace"
  ].forEach(function (phrase) {
    assert.equal(html.includes(phrase), false, phrase);
  });
});

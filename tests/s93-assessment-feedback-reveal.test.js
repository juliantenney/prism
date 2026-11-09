/**
 * Assessment Pack formative feedback stays hidden until the learner checks
 * a valid response, or deliberately opens self-review guidance.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const { getAssessmentRuntimeScript } = require("../lib/learner-renderer-vnext/assessment-runtime");

const ANSWER = "The most justified interpretation is B.";
const ILLUSTRATIVE = "An illustrative response would name the missing comparison and stop there.";

function item(id, form, prompt, judgement, note) {
  return {
    item_id: id,
    order: 1,
    form: form,
    prompt: prompt,
    judgement: Object.assign({ auto_checkable: true }, judgement),
    feedback_note: note
  };
}

function elicitation(id, order, epistemic, delivery, materials) {
  return {
    elicitation_id: id,
    order: order,
    evidence_ask: "Show what you can already do with the claim.",
    epistemic_class: epistemic,
    delivery: delivery,
    formative_return: {
      materials: materials,
      forward_orientation: "Use what you noticed in the next task.",
      revision:
        epistemic === "non_determinate"
          ? { offered: true, prompt: "Revise one sentence if the criteria show a gap." }
          : undefined
    }
  };
}

function page() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Spotting Weak Evidence: A Practical Assessment of Workplace Claims",
    activities: [],
    sections: [],
    assessment_evidence: {
      purpose: {
        role: "R2",
        visibility_claim: "Whether the learner can judge a workplace claim.",
        stop_rationale: "A short formative stop.",
        forward_intent: "Show what to look for next."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Carry the judgement into the next task.",
      elicitations: [
        elicitation(
          "q1",
          1,
          "determinate",
          {
            kind: "auto_checkable_items",
            items: [
              item(
                "q1",
                "classification",
                {
                  stem: "Classify each claim.",
                  categories: [
                    { id: "weak", label: "Weak evidence" },
                    { id: "strong", label: "Stronger evidence" }
                  ],
                  items: [{ id: "c1", text: "One colleague's impression" }]
                },
                { assignments: { c1: "weak" } },
                "One impression is weak evidence."
              )
            ]
          },
          [{ material_id: "q1-note", body: "Classification feedback stays with the check." }]
        ),
        elicitation(
          "q2",
          2,
          "determinate",
          {
            kind: "auto_checkable_items",
            items: [
              item(
                "q2",
                "single_answer_mcq",
                {
                  stem: "Which interpretation is most justified?",
                  options: [
                    { key: "A", text: "The claim is proven." },
                    { key: "B", text: "The claim is only weakly supported." }
                  ]
                },
                { correct_answer: "B" },
                ANSWER
              )
            ]
          },
          [{ material_id: "q2-note", body: ANSWER }]
        ),
        elicitation(
          "q3",
          3,
          "determinate",
          {
            kind: "auto_checkable_items",
            items: [
              item(
                "q3",
                "multiple_answer_mcq",
                {
                  stem: "Select every weak feature.",
                  options: [
                    { key: "a", text: "A single anecdote" },
                    { key: "b", text: "A comparison group" }
                  ]
                },
                { correct_answers: ["a"] },
                "A single anecdote is weak evidence."
              )
            ]
          },
          [{ material_id: "q3-note", body: "Multiple-answer feedback stays with the check." }]
        ),
        elicitation(
          "q6",
          4,
          "non_determinate",
          {
            kind: "constructed_performance",
            prompt: "Write your own judgement of the workplace claim.",
            response_workspace: {
              intention: "A written judgement",
              guidance: "Name the claim and the limit of the evidence."
            }
          },
          [
            {
              material_id: "criteria",
              title: "Self-evaluation",
              body: "Compare your reasons with the claim and the evidence you can point to."
            },
            {
              material_id: "illustration",
              title: "Illustrative response",
              body: ILLUSTRATIVE
            }
          ]
        )
      ]
    }
  };
}

function withoutConcealedFeedback(html) {
  return String(html || "")
    .replace(/<section hidden data-assessment-explanation="true"[\s\S]*?<\/section>/g, "")
    .replace(/<div id="[^"]+" class="util-assessment-review-region"[\s\S]*$/g, "")
    .replace(/\sdata-assessment-rationale="[^"]*"/g, "");
}

test("determinate explanations and constructed review guidance are hidden on first render", () => {
  const result = renderLearnerPageHtml(page());
  assert.equal(result.error, null, result.error);
  const html = result.html.split("<script>")[0];
  assert.match(html, /data-assessment-form="classification"/);
  assert.match(html, /data-assessment-form="single_answer_mcq"/);
  assert.match(html, /data-assessment-form="multiple_answer_mcq"/);
  assert.match(html, /data-assessment-correct="B"/);
  assert.match(html, /<section hidden data-assessment-explanation="true"/);
  assert.match(html, /data-assessment-rationale="The most justified interpretation is B\."/);
  assert.match(html, /<section hidden data-assessment-explanation="true"[\s\S]*The most justified interpretation is B\./);
  assert.match(html, /data-assessment-result aria-live="polite" hidden><\/div>/);
  assert.doesNotMatch(withoutConcealedFeedback(html), new RegExp(ANSWER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(withoutConcealedFeedback(html), /One impression is weak evidence/);
  assert.doesNotMatch(withoutConcealedFeedback(html), /A single anecdote is weak evidence/);

  const constructed = html.slice(html.indexOf('data-assessment-mode="constructed"'));
  assert.match(constructed, /Review your response/);
  assert.match(constructed, /aria-expanded="false"/);
  assert.match(constructed, /data-assessment-review-region hidden/);
  assert.match(constructed, /Illustrative response/);
  assert.match(constructed, new RegExp(ILLUSTRATIVE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(withoutConcealedFeedback(html), new RegExp(ILLUSTRATIVE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(constructed, /data-assessment-check/);
  assert.match(constructed, /Your response is not marked correct or incorrect/);
});

function createElement(tagName) {
  const node = {
    tagName: String(tagName || "").toUpperCase(),
    className: "",
    attributes: Object.create(null),
    children: [],
    parentNode: null,
    _text: "",
    value: "",
    checked: false,
    hidden: false,
    disabled: false,
    _html: "",
    classList: {
      _classes: Object.create(null),
      contains(name) {
        return Boolean(this._classes[name]);
      }
    },
    get textContent() {
      return node._text + node.children.map((child) => child.textContent || "").join("");
    },
    set textContent(value) {
      node._text = String(value == null ? "" : value);
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
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
      if (child.parentNode) {
        const siblings = child.parentNode.children;
        const index = siblings.indexOf(child);
        if (index >= 0) siblings.splice(index, 1);
      }
      child.parentNode = this;
      this.children.push(child);
      return child;
    },
    contains(other) {
      if (other === this) return true;
      return this.children.some((child) => child === other || child.contains(other));
    },
    matches(selector) {
      return matchesSelector(this, selector);
    },
    closest(selector) {
      let current = this;
      while (current) {
        if (matchesSelector(current, selector)) return current;
        current = current.parentNode;
      }
      return null;
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    },
    querySelectorAll(selector) {
      const found = [];
      String(selector)
        .split(",")
        .forEach((piece) => {
          queryAll(this, piece.trim()).forEach((match) => {
            if (found.indexOf(match) < 0) found.push(match);
          });
        });
      return found;
    },
    focus() {},
    addEventListener(type, handler) {
      if (!this._listeners) this._listeners = [];
      this._listeners.push({ type, handler });
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

function matchesSelector(node, selector) {
  let rest = String(selector || "").trim();
  if (!rest) return false;
  if (rest[0] === "#") {
    return node.getAttribute("id") === rest.slice(1);
  }
  const tagMatch = rest.match(/^([a-zA-Z0-9:-]+)/);
  if (tagMatch && !rest.startsWith(".") && !rest.startsWith("[")) {
    if (node.tagName !== tagMatch[1].toUpperCase()) return false;
    rest = rest.slice(tagMatch[1].length);
  }
  while (rest.length) {
    if (rest[0] === ".") {
      const cls = rest.slice(1).match(/^[a-zA-Z0-9_-]+/);
      if (!cls || !node.classList.contains(cls[0])) return false;
      rest = rest.slice(1 + cls[0].length);
      continue;
    }
    if (rest[0] === "[") {
      const attr = rest.match(/^\[([^=\]]+)(?:=(?:"([^"]*)"|([^\]]+)))?\]/);
      if (!attr) return false;
      const actual = node.getAttribute(attr[1]);
      const expected = attr[2] != null ? attr[2] : attr[3];
      if (expected == null) {
        if (actual == null) return false;
      } else if (actual !== expected) return false;
      rest = rest.slice(attr[0].length);
      continue;
    }
    return false;
  }
  return true;
}

function queryAll(root, selector) {
  const parts = String(selector).split(/\s+/).filter(Boolean);
  function walk(node, partIndex, out) {
    if (!node || !node.children) return;
    node.children.forEach((child) => {
      if (matchesSelector(child, parts[partIndex])) {
        if (partIndex === parts.length - 1) out.push(child);
        else walk(child, partIndex + 1, out);
      }
      walk(child, partIndex, out);
    });
  }
  const found = [];
  walk(root, 0, found);
  return found;
}

function parseHtmlFragment(html, documentNode) {
  const root = createElement("fragment");
  root.parentNode = documentNode;
  const stack = [root];
  String(html || "").replace(/<!--[\s\S]*?-->/g, "").split(/(<[^>]+>)/g).forEach((chunk) => {
    if (!chunk) return;
    if (chunk[0] !== "<") {
      stack[stack.length - 1]._text += chunk;
      return;
    }
    if (/^<\//.test(chunk)) {
      if (stack.length > 1) stack.pop();
      return;
    }
    const match = chunk.match(/^<([a-zA-Z0-9:-]+)([^>]*)>/);
    if (!match) return;
    const tag = match[1].toLowerCase();
    const attrText = match[2] || "";
    const node = createElement(tag);
    attrText.replace(/([^\s=]+)(?:="([^"]*)")?/g, function (_all, name, value) {
      if (name === "/") return "";
      node.setAttribute(name, value == null ? "" : value);
      return "";
    });
    stack[stack.length - 1].appendChild(node);
    const voidTags = { br: 1, img: 1, input: 1, meta: 1, link: 1 };
    if (!voidTags[tag] && !/\/\s*$/.test(attrText)) stack.push(node);
  });
  return root;
}

function mountConstructedReview(confirmFn) {
  const result = renderLearnerPageHtml(page());
  assert.equal(result.error, null, result.error);
  const html = result.html;
  const documentNode = createElement("document");
  documentNode.appendChild(parseHtmlFragment(html, documentNode));
  const prompts = [];
  const context = vm.createContext({
    document: documentNode,
    confirm: function (message) {
      prompts.push(String(message || ""));
      return typeof confirmFn === "function" ? confirmFn(message) : !!confirmFn;
    }
  });
  vm.runInContext(getAssessmentRuntimeScript(), context);
  const article = documentNode.querySelector('[data-assessment-mode="constructed"]');
  const button = documentNode.querySelector("[data-assessment-open-review]");
  const review = documentNode.querySelector("[data-assessment-review-region]");
  const primary = documentNode.querySelector("#assessment-constructed-q6");
  const weakness = documentNode.querySelector("#assessment-constructed-q6-weakness");
  return {
    article: article,
    button: button,
    review: review,
    primary: primary,
    weakness: weakness,
    prompts: prompts,
    click: function () {
      button.dispatchEvent({ type: "click", bubbles: true, target: button });
    }
  };
}

test("empty constructed response declines early-feedback confirmation and keeps review hidden", () => {
  const ui = mountConstructedReview(false);
  assert.equal(ui.review.hidden, true);
  ui.click();
  assert.equal(ui.prompts.length, 1);
  assert.match(ui.prompts[0], /You haven't written a response yet/);
  assert.match(ui.prompts[0], /Open the review guidance\?/);
  assert.equal(ui.review.hidden, true);
  assert.equal(ui.button.getAttribute("aria-expanded"), "false");
});

test("empty constructed response accepts early-feedback confirmation and reveals review", () => {
  const ui = mountConstructedReview(true);
  ui.click();
  assert.equal(ui.prompts.length, 1);
  assert.equal(ui.review.hidden, false);
  assert.equal(ui.button.getAttribute("aria-expanded"), "true");
  assert.match(ui.review.querySelector("[data-assessment-review-status]").textContent, /not marked/);
  ui.click();
  assert.equal(ui.prompts.length, 1, "already-open review must not confirm again");
});

test("whitespace-only constructed response still requires confirmation", () => {
  const ui = mountConstructedReview(false);
  ui.primary.value = "   \n\t  ";
  ui.click();
  assert.equal(ui.prompts.length, 1);
  assert.equal(ui.review.hidden, true);
});

test("non-empty constructed response reveals review without confirmation", () => {
  const ui = mountConstructedReview(false);
  ui.primary.value = "The workplace claim is only weakly supported.";
  ui.click();
  assert.equal(ui.prompts.length, 0);
  assert.equal(ui.review.hidden, false);
  assert.equal(ui.button.getAttribute("aria-expanded"), "true");
});

test("reflection or revision fields do not count as the primary constructed attempt", () => {
  const ui = mountConstructedReview(false);
  assert.ok(ui.weakness, "fixture should include a revision weakness field");
  ui.weakness.value = "I overstated the comparison.";
  assert.equal(String(ui.primary.value || "").trim(), "");
  ui.click();
  assert.equal(ui.prompts.length, 1);
  assert.equal(ui.review.hidden, true);
});

/**
 * Sprint 93 output-to-spec slice 3 — learner artefact assembly.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");
const { getAssessmentRuntimeScript } = require("../lib/learner-renderer-vnext/assessment-runtime");
const { getAssessmentOutputRuntimeScript } = require("../lib/learner-renderer-vnext/assessment-output");
const adapters = require("../lib/learner-renderer-vnext/learner-draft-adapters");
const { injectStandaloneVnextExportRuntime } = require("../lib/learner-renderer-vnext-standalone-embed");

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
    get previousElementSibling() {
      if (!node.parentNode) return null;
      const index = node.parentNode.children.indexOf(node);
      return index > 0 ? node.parentNode.children[index - 1] : null;
    },
    get nextElementSibling() {
      if (!node.parentNode) return null;
      const index = node.parentNode.children.indexOf(node);
      return index >= 0 && index < node.parentNode.children.length - 1
        ? node.parentNode.children[index + 1]
        : null;
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
      if (name === "disabled") this.disabled = true;
      if (name === "hidden") this.hidden = true;
    },
    removeAttribute(name) {
      delete this.attributes[name];
      if (name === "disabled") this.disabled = false;
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
    insertBefore(newNode, referenceNode) {
      if (newNode.parentNode) {
        const from = newNode.parentNode.children;
        const idx = from.indexOf(newNode);
        if (idx >= 0) from.splice(idx, 1);
      }
      newNode.parentNode = this;
      const index = this.children.indexOf(referenceNode);
      if (index < 0) this.children.push(newNode);
      else this.children.splice(index, 0, newNode);
      return newNode;
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
    select() {},
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
    if (rest.startsWith(":checked")) {
      if (!node.checked) return false;
      rest = rest.slice(":checked".length);
      continue;
    }
    return false;
  }
  return true;
}

function queryAll(root, selector) {
  const parts = String(selector).split(/\s+/).filter(Boolean);
  let current = [root];
  parts.forEach((part) => {
    const next = [];
    current.forEach((node) => {
      walk(node, (child) => {
        if (child !== node && matchesSelector(child, part)) next.push(child);
      });
    });
    current = next;
  });
  return current;
}

function walk(node, visit) {
  visit(node);
  (node.children || []).forEach((child) => walk(child, visit));
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseAttrs(text) {
  const attrs = Object.create(null);
  const re = /([a-zA-Z0-9:_-]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g;
  let match;
  while ((match = re.exec(text || ""))) {
    const raw = match[2] != null ? match[2] : match[3] != null ? match[3] : "";
    attrs[match[1]] = decodeEntities(raw);
  }
  return attrs;
}

function parseHtmlFragment(html, documentRef) {
  const root = createElement("div");
  root.ownerDocument = documentRef;
  const stack = [root];
  const tokenRe = /<script\b[^>]*>[\s\S]*?<\/script>|<(\/?)([a-zA-Z0-9:-]+)([^>]*)>|([^<]+)/g;
  let match;
  while ((match = tokenRe.exec(html))) {
    if (match[4] != null) {
      stack[stack.length - 1]._text += match[4];
      continue;
    }
    const closing = Boolean(match[1]);
    const tag = String(match[2] || "").toLowerCase();
    const attrText = match[3] || "";
    if (closing) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    const node = createElement(tag);
    node.ownerDocument = documentRef;
    const attrs = parseAttrs(attrText);
    Object.keys(attrs).forEach((key) => node.setAttribute(key, attrs[key]));
    stack[stack.length - 1].appendChild(node);
    const voidTags = { br: 1, img: 1, input: 1, meta: 1, link: 1 };
    if (!voidTags[tag] && !/\/\s*$/.test(attrText)) stack.push(node);
  }
  return root;
}

function mount(html, clipboard) {
  const documentNode = createElement("document");
  documentNode.defaultView = {
    navigator: {
      clipboard: {
        writeText(text) {
          if (clipboard) clipboard.push(String(text));
          return Promise.resolve();
        }
      }
    }
  };
  const parsed = parseHtmlFragment(html, documentNode);
  documentNode.appendChild(parsed);
  const context = vm.createContext({
    document: documentNode,
    CustomEvent: class CustomEvent {
      constructor(type, init) {
        this.type = type;
        this.bubbles = !!(init && init.bubbles);
        this.detail = init && init.detail;
      }
    }
  });
  vm.runInContext(getAssessmentRuntimeScript() + getAssessmentOutputRuntimeScript(), context);
  return documentNode;
}

function click(node) {
  node.dispatchEvent({ type: "click", bubbles: true, target: node });
}

function change(node) {
  node.dispatchEvent({ type: "change", bubbles: true, target: node });
}

function purposeBody() {
  return {
    role: "R1",
    visibility_claim: "Which distinctions the learner can state.",
    stop_rationale: "A short formative stop.",
    forward_intent: "Carry the current responses forward."
  };
}

function item(id, order, form, prompt, judgement, note) {
  return {
    item_id: id,
    order: order,
    form: form,
    prompt: prompt,
    judgement: Object.assign({ auto_checkable: true }, judgement),
    feedback_note: note
  };
}

function page(spec, timing) {
  const pageBody = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Assembly check",
    activities: [],
    metadata: { workflow_id: "wf-output", page_id: "page-output" },
    assessment_evidence: {
      purpose: purposeBody(),
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use the record in the next block.",
      delivery_preferences: timing ? { feedback_timing: timing } : undefined,
      elicitations: [
        {
          elicitation_id: "forms",
          order: 1,
          evidence_ask: "Work through each closed check.",
          epistemic_class: "determinate",
          delivery: {
            kind: "auto_checkable_items",
            items: [
              item("single", 1, "single_answer_mcq", {
                stem: "Pick one.",
                options: [
                  { key: "a", text: "Alpha" },
                  { key: "b", text: "Beta" }
                ]
              }, { correct_answer: "a" }, "Alpha is the named choice."),
              item("multi", 2, "multiple_answer_mcq", {
                stem: "Pick both.",
                options: [
                  { key: "a", text: "One" },
                  { key: "b", text: "Two" },
                  { key: "c", text: "Three" }
                ]
              }, { correct_answers: ["a", "b"] }, "Both belong."),
              item("order", 3, "ordering", {
                stem: "Order the steps.",
                items: [
                  { id: "s2", text: "Second" },
                  { id: "s1", text: "First" }
                ]
              }, { correct_order: ["s1", "s2"] }, "First comes before second."),
              item("class", 4, "classification", {
                stem: "Classify each item.",
                categories: [
                  { id: "c1", label: "Design" },
                  { id: "c2", label: "Threat" }
                ],
                items: [
                  { id: "i1", text: "Cohort" },
                  { id: "i2", text: "History" }
                ]
              }, { assignments: { i1: "c1", i2: "c2" } }, "A cohort is a design."),
              item("match", 5, "matching", {
                stem: "Match each pair.",
                left: [
                  { id: "l1", text: "Prior" },
                  { id: "l2", text: "Evidence" }
                ],
                right: [
                  { id: "r1", text: "Belief before evidence" },
                  { id: "r2", text: "The new data" }
                ]
              }, { pairs: { l1: "r1", l2: "r2" } }, "A prior is that belief.")
            ]
          },
          formative_return: {
            materials: [{ material_id: "guide", body: "Use the check result to see what still needs attention." }],
            forward_orientation: "Take the checked result into the next block."
          }
        },
        {
          elicitation_id: "judgement",
          order: 2,
          evidence_ask: "Write the judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write the judgement in your own words.",
            response_workspace: { intention: "A written judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", title: "Self-evaluation: restraint", body: "Look at the claim again." }],
            revision: { offered: true, prompt: "Name one change you would make." },
            forward_orientation: "Carry the writing forward."
          }
        }
      ]
    }
  };
  if (spec) pageBody.assessment_evidence.output_specification = spec;
  return pageBody;
}

function specification() {
  return {
    specification_id: "evidence-record",
    artefact_title: "Evidence record",
    audience: "A reviewer",
    purpose: "Record what the learner selected and wrote.",
    action_label: "Assemble evidence record",
    missing_response_text: "Not yet answered.",
    sections: [
      {
        section_id: "writing",
        order: 2,
        heading: "Written judgement",
        contributions: [
          {
            contribution_id: "judgement-text",
            label: "Judgement",
            elicitation_id: "judgement",
            response_part: "response_text"
          },
          {
            contribution_id: "weakness",
            label: "Weakness you identified",
            elicitation_id: "judgement",
            response_part: "identified_weakness"
          }
        ]
      },
      {
        section_id: "checks",
        order: 1,
        heading: "Checked distinctions",
        contributions: [
          {
            contribution_id: "single-choice",
            label: "Single choice",
            elicitation_id: "forms",
            item_id: "single",
            response_part: "selected_options"
          },
          {
            contribution_id: "single-check",
            label: "Single check",
            elicitation_id: "forms",
            item_id: "single",
            response_part: "check_result"
          },
          {
            contribution_id: "multi-choice",
            label: "Multiple choice",
            elicitation_id: "forms",
            item_id: "multi",
            response_part: "selected_options"
          },
          {
            contribution_id: "multi-check",
            label: "Multiple check",
            elicitation_id: "forms",
            item_id: "multi",
            response_part: "check_result"
          },
          {
            contribution_id: "order-choice",
            label: "Current order",
            elicitation_id: "forms",
            item_id: "order",
            response_part: "selected_options"
          },
          {
            contribution_id: "class-choice",
            label: "Classification",
            elicitation_id: "forms",
            item_id: "class",
            response_part: "selected_options",
            missing_response_text: "No category chosen."
          },
          {
            contribution_id: "match-choice",
            label: "Matching",
            elicitation_id: "forms",
            item_id: "match",
            response_part: "selected_options"
          },
          {
            contribution_id: "match-check",
            label: "Matching check",
            elicitation_id: "forms",
            item_id: "match",
            response_part: "check_result"
          }
        ]
      }
    ]
  };
}

function rendered(spec, timing) {
  const result = renderLearnerPageHtml(page(spec, timing), { compositionMode: "beats" });
  assert.equal(result.error, null, String(result.error || ""));
  return result.html;
}

function outputArea(doc) {
  return doc.querySelector('[data-workspace-id="assessment-output-evidence-record"] textarea');
}

function outputWorkspace(doc) {
  return doc.querySelector('[data-workspace-id="assessment-output-evidence-record"]');
}

function itemById(doc, id) {
  return doc.querySelector('[data-assessment-item-id="' + id + '"]');
}

function assemble(doc) {
  click(doc.querySelector("[data-assessment-assemble]"));
}

const html = rendered(specification());
const bareHtml = rendered(undefined);

test("a pack without a specification has no artefact controls", () => {
  assert.equal(bareHtml.indexOf('data-assessment-assemble="true"'), -1);
  assert.equal(bareHtml.indexOf('data-assessment-output-region="true"'), -1);
  assert.equal(bareHtml.indexOf("Replace with current responses"), -1);
  assert.equal(bareHtml.indexOf('data-assessment-output-copy="true"'), -1);
  assert.equal(bareHtml.indexOf("Summarise this assessment"), -1);
  assert.equal(bareHtml.indexOf("data-assessment-review>"), -1);
});

test("missing answers use the authored sentence and sections follow section order", () => {
  const doc = mount(html);
  assemble(doc);
  const text = outputArea(doc).value;
  assert.match(text, /^Evidence record\nFor: A reviewer\nRecord what the learner selected and wrote\./);
  assert.ok(text.indexOf("Checked distinctions") < text.indexOf("Written judgement"));
  assert.ok(text.indexOf("Judgement") < text.indexOf("Weakness you identified"));
  assert.ok(text.indexOf("Single choice") < text.indexOf("Single check"));
  assert.ok(text.indexOf("Single check") < text.indexOf("Multiple choice"));
  assert.match(text, /Classification\nNo category chosen\./);
  assert.match(text, /Single choice\nNot yet answered\./);
  assert.match(text, /Single check\nNot yet answered\./);
  assert.match(text, /Judgement\nNot yet answered\./);
  assert.doesNotMatch(text, /Correct\./);
  assert.equal(outputWorkspace(doc).getAttribute("data-assessment-assembled-snapshot"), text);
});

test("all five forms and all four response parts assemble from the current controls", () => {
  const doc = mount(html);
  const single = itemById(doc, "single");
  single.querySelector('input[value="a"]').checked = true;
  click(single.querySelector("[data-assessment-check]"));
  const multi = itemById(doc, "multi");
  multi.querySelector('input[value="a"]').checked = true;
  click(multi.querySelector("[data-assessment-check]"));
  assert.match(multi.querySelector("[data-assessment-result]").innerHTML, /incomplete/);
  const order = itemById(doc, "order");
  const list = order.querySelector("[data-assessment-order]");
  list.appendChild(list.querySelector('[data-assessment-element-id="s2"]'));
  itemById(doc, "class").querySelector('[data-assessment-subject="i1"]').value = "c1";
  const match = itemById(doc, "match");
  match.querySelector('[data-assessment-subject="l1"]').value = "r1";
  match.querySelector('[data-assessment-subject="l2"]').value = "r2";
  click(match.querySelector("[data-assessment-check]"));
  doc.querySelector("#assessment-constructed-judgement").value = "The design does not establish causation.";
  doc.querySelector("#assessment-constructed-judgement-weakness").value = "I overstated the comparison.";
  assemble(doc);
  const text = outputArea(doc).value;
  assert.match(text, /Single choice\nAlpha/);
  assert.match(text, /Single check\nCorrect\.\nAlpha is the named choice\./);
  assert.match(text, /Multiple choice\nOne/);
  assert.match(text, /Not quite\.\nBoth belong\./);
  assert.doesNotMatch(text, /incomplete/);
  assert.match(text, /Current order\n1\. First\n2\. Second/);
  assert.match(text, /Classification\nCohort: Design/);
  assert.doesNotMatch(text, /History:/);
  assert.match(text, /Matching\nPrior: Belief before evidence\nEvidence: The new data/);
  assert.match(text, /Matching check\nCorrect\.\nA prior is that belief\./);
  assert.match(text, /Judgement\nThe design does not establish causation\./);
  assert.match(text, /Weakness you identified\nI overstated the comparison\./);
  assert.doesNotMatch(text, /score|grade|proficiency/i);
});

test("an edited artefact is kept, copied, and replaced only on request", async () => {
  const copied = [];
  const doc = mount(html, copied);
  doc.querySelector("#assessment-constructed-judgement").value = "First judgement.";
  assemble(doc);
  const snapshot = outputArea(doc).value;
  outputArea(doc).value = "LEARNER EDIT\n" + snapshot;
  doc.querySelector("#assessment-constructed-judgement").value = "Replacement judgement.";
  assemble(doc);
  assert.equal(outputArea(doc).value, "LEARNER EDIT\n" + snapshot);
  assert.equal(doc.querySelector("[data-assessment-output-status]").textContent, "Your edits were kept.");
  assert.equal(outputWorkspace(doc).getAttribute("data-assessment-assembled-snapshot"), snapshot);
  click(doc.querySelector("[data-assessment-output-copy]"));
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.deepEqual(copied, ["LEARNER EDIT\n" + snapshot]);
  click(doc.querySelector("[data-assessment-output-replace]"));
  assert.match(outputArea(doc).value, /Replacement judgement\./);
  assert.doesNotMatch(outputArea(doc).value, /LEARNER EDIT/);
  assert.equal(outputArea(doc).value, outputWorkspace(doc).getAttribute("data-assessment-assembled-snapshot"));
});

test("an edited artefact draft restores separately from the source responses", () => {
  const doc = mount(html);
  doc.querySelector("#assessment-constructed-judgement").value = "Stored judgement.";
  assemble(doc);
  outputArea(doc).value = "Edited record";
  const state = adapters.serializeWorkspaceState(outputWorkspace(doc)).state;
  assert.equal(state.kind, "text_entry");
  assert.equal(state.value.text, "Edited record");
  assert.match(state.value.assembled_snapshot, /Stored judgement\./);
  assert.equal(state.value.score, undefined);

  const restored = mount(html);
  const result = adapters.restoreWorkspaceState(outputWorkspace(restored), state);
  assert.equal(result.ok, true);
  assert.equal(outputArea(restored).value, "Edited record");
  assemble(restored);
  assert.equal(outputArea(restored).value, "Edited record");
  assert.equal(restored.querySelector("[data-assessment-output-status]").textContent, "Your edits were kept.");

  adapters.clearWorkspaceState(outputWorkspace(restored));
  assert.equal(outputArea(restored).value, "");
  assert.equal(outputWorkspace(restored).getAttribute("data-assessment-assembled-snapshot"), null);
  assert.equal(restored.querySelector("#assessment-constructed-judgement").value, "");
});

test("changing a checked answer clears that result before assembly", () => {
  const doc = mount(html);
  const single = itemById(doc, "single");
  const alpha = single.querySelector('input[value="a"]');
  const beta = single.querySelector('input[value="b"]');
  alpha.checked = true;
  click(single.querySelector("[data-assessment-check]"));
  assert.equal(single.getAttribute("data-assessment-last-result"), "correct");
  alpha.checked = false;
  beta.checked = true;
  change(beta);
  assert.equal(single.getAttribute("data-assessment-checked"), "false");
  assert.equal(single.getAttribute("data-assessment-last-result"), null);
  assert.equal(single.querySelector("[data-assessment-result]").hidden, true);
  assemble(doc);
  assert.match(outputArea(doc).value, /Single choice\nBeta/);
  assert.match(outputArea(doc).value, /Single check\nNot yet answered\./);
  assert.doesNotMatch(outputArea(doc).value, /Correct\./);

  const order = itemById(doc, "order");
  click(order.querySelector("[data-assessment-check]"));
  assert.equal(order.getAttribute("data-assessment-last-result"), "incorrect");
  const moveFirstUp = order.querySelector('[data-assessment-element-id="s1"] [data-assessment-move="up"]');
  click(moveFirstUp);
  assert.equal(order.getAttribute("data-assessment-last-result"), null);
  assert.equal(order.getAttribute("data-assessment-checked"), "false");
});

test("end-of-pack checking still waits for Finish, and a later edit can be finished again", () => {
  const endHtml = rendered(specification(), "end_of_pack");
  assert.match(endHtml, /Finish assessment/);
  assert.match(endHtml, /Assemble evidence record/);
  assert.equal(endHtml.indexOf("Summarise this assessment"), -1);
  const doc = mount(endHtml);
  const single = itemById(doc, "single");
  single.querySelector('input[value="a"]').checked = true;
  click(single.querySelector("[data-assessment-check]"));
  assert.equal(single.getAttribute("data-assessment-last-result"), null);
  click(doc.querySelector("[data-assessment-finish]"));
  assert.equal(single.getAttribute("data-assessment-last-result"), "correct");
  assert.equal(doc.querySelector("[data-assessment-finish]").disabled, true);
  const beta = single.querySelector('input[value="b"]');
  single.querySelector('input[value="a"]').checked = false;
  beta.checked = true;
  change(beta);
  assert.equal(single.getAttribute("data-assessment-last-result"), null);
  assert.equal(doc.querySelector("[data-assessment-finish]").disabled, false);
});

test("a legacy self-study assessment still emits its learning-outcome summary", () => {
  const legacy = renderPage({
    title: "Self-study check",
    pageKind: "interactive",
    header: {},
    orientationSections: [],
    expositionSections: [],
    closingParagraph: "",
    learningOutcomes: [{ id: "LO1", statement: "Identify a prior." }],
    activities: [],
    assessmentPack: null,
    assessment: {
      sectionHeading: "What this assessment checks",
      intent: "formative_check",
      feedbackTiming: "per_component",
      outcomes: [{ id: "LO1", statement: "Identify a prior." }],
      items: [
        {
          item_id: "q1",
          item_type: "single_answer_mcq",
          stem: "Which statement is a prior?",
          options: [
            { key: "a", text: "Belief before evidence" },
            { key: "b", text: "The new data" }
          ],
          correct_answer: "a",
          feedback_note: "A prior is the earlier belief.",
          mapped_learning_outcomes: ["LO1"]
        }
      ]
    },
    studyTips: ""
  });
  assert.match(legacy, /Summarise this assessment/);
  assert.match(legacy, /data-assessment-review/);
  assert.equal(legacy.indexOf('data-assessment-product="assessment_pack"'), -1);
  assert.equal(legacy.indexOf('data-assessment-assemble="true"'), -1);
  assert.equal(legacy.indexOf('data-assessment-output-region="true"'), -1);
});

test("standalone publication carries the assembly script and the offline draft runtime", () => {
  const standalone = injectStandaloneVnextExportRuntime("<body>" + html + "</body>");
  assert.match(standalone, /data-prism-vnext-export-runtime=/);
  assert.match(standalone, /data-assessment-assemble="true"/);
  assert.match(standalone, /function installAssessmentOutput/);
  assert.match(standalone, /initializeLearnerDraftPersistence/);
});

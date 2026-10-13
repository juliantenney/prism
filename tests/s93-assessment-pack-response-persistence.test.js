/**
 * Sprint 93 output-to-spec slice 2 — Assessment Pack response persistence.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const adapters = require("../lib/learner-renderer-vnext/learner-draft-adapters");
const { initializeLearnerDraftPersistence } = require("../lib/learner-renderer-vnext/learner-draft-persistence");

function createElement(tagName) {
  const node = {
    tagName: String(tagName || "").toUpperCase(),
    className: "",
    attributes: Object.create(null),
    children: [],
    parentNode: null,
    textContent: "",
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
    },
    removeAttribute(name) {
      delete this.attributes[name];
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
    addEventListener(type, handler) {
      if (!this._listeners) this._listeners = [];
      this._listeners.push({ type, handler });
    },
    dispatchEvent(event) {
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
      node.textContent = node._html.replace(/<[^>]+>/g, "");
    }
  });
  return node;
}

function matchesSelector(node, selector) {
  let rest = String(selector || "").trim();
  if (!rest) return false;
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
      const attr = rest.match(/^\[([^=\]]+)(?:=\"([^\"]*)\")?\]/);
      if (!attr) return false;
      const value = node.getAttribute(attr[1]);
      if (attr[2] == null) {
        if (value == null) return false;
      } else if (value !== attr[2]) return false;
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

function parseAttrs(text) {
  const attrs = Object.create(null);
  const re = /([a-zA-Z0-9:_-]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g;
  let match;
  while ((match = re.exec(text || ""))) {
    attrs[match[1]] = match[2] != null ? match[2] : match[3] != null ? match[3] : "";
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
      stack[stack.length - 1].textContent += match[4];
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
    Object.keys(attrs).forEach((key) => {
      if (key === "disabled") node.disabled = true;
      if (key === "hidden") node.hidden = true;
      node.setAttribute(key, attrs[key]);
    });
    stack[stack.length - 1].appendChild(node);
    const voidTags = { br: 1, img: 1, input: 1, meta: 1, link: 1 };
    if (!voidTags[tag] && !/\/\s*$/.test(attrText)) stack.push(node);
  }
  return root;
}

function mount(html) {
  const documentNode = createElement("document");
  documentNode.createElement = (tag) => {
    const node = createElement(tag);
    node.ownerDocument = documentNode;
    return node;
  };
  documentNode.addEventListener = () => {};
  const parsed = parseHtmlFragment(html, documentNode);
  const main = parsed.querySelector("main");
  main.ownerDocument = documentNode;
  return main;
}

function page() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Persistence check",
    activities: [],
    metadata: { workflow_id: "wf-persist", page_id: "page-persist" },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Which distinctions the learner can apply.",
        stop_rationale: "A short formative stop.",
        forward_intent: "Carry the checked distinctions forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use the result in the next block. It does not unlock a path.",
      elicitations: [
        {
          elicitation_id: "forms",
          order: 1,
          evidence_ask: "Work through each closed check.",
          epistemic_class: "determinate",
          delivery: {
            kind: "auto_checkable_items",
            items: [
              {
                item_id: "single",
                order: 1,
                form: "single_answer_mcq",
                prompt: {
                  stem: "Pick one.",
                  options: [
                    { key: "a", text: "Alpha" },
                    { key: "b", text: "Beta" }
                  ]
                },
                judgement: { correct_answer: "a", auto_checkable: true },
                feedback_note: "Alpha is the named choice."
              },
              {
                item_id: "multi",
                order: 2,
                form: "multiple_answer_mcq",
                prompt: {
                  stem: "Pick both.",
                  options: [
                    { key: "a", text: "One" },
                    { key: "b", text: "Two" },
                    { key: "c", text: "Three" }
                  ]
                },
                judgement: { correct_answers: ["a", "b"], auto_checkable: true },
                feedback_note: "Both belong."
              },
              {
                item_id: "order",
                order: 3,
                form: "ordering",
                prompt: {
                  stem: "Order the steps.",
                  items: [
                    { id: "s2", text: "Second" },
                    { id: "s1", text: "First" }
                  ]
                },
                judgement: { correct_order: ["s1", "s2"], auto_checkable: true },
                feedback_note: "First comes before second."
              },
              {
                item_id: "class",
                order: 4,
                form: "classification",
                prompt: {
                  stem: "Classify each item.",
                  categories: [
                    { id: "c1", label: "Design" },
                    { id: "c2", label: "Threat" }
                  ],
                  items: [
                    { id: "i1", text: "Cohort" },
                    { id: "i2", text: "History" }
                  ]
                },
                judgement: { assignments: { i1: "c1", i2: "c2" }, auto_checkable: true },
                feedback_note: "A cohort is a design."
              },
              {
                item_id: "match",
                order: 5,
                form: "matching",
                prompt: {
                  stem: "Match each pair.",
                  left: [
                    { id: "l1", text: "Prior" },
                    { id: "l2", text: "Evidence" }
                  ],
                  right: [
                    { id: "r1", text: "Belief before evidence" },
                    { id: "r2", text: "The new data" }
                  ]
                },
                judgement: { pairs: { l1: "r1", l2: "r2" }, auto_checkable: true },
                feedback_note: "A prior is that belief."
              }
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
}

function renderedHtml() {
  const result = renderLearnerPageHtml(page(), { compositionMode: "beats" });
  assert.equal(result.error, null, String(result.error || ""));
  return result.html;
}

function workspace(root, id) {
  return root.querySelector('[data-workspace-id="' + id + '"]');
}

function checkedValues(root, id) {
  return workspace(root, id)
    .querySelectorAll('input[data-assessment-option]')
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function orderIds(root) {
  return workspace(root, "assessment-order")
    .querySelectorAll("[data-assessment-element-id]")
    .map((node) => node.getAttribute("data-assessment-element-id"));
}

function roundTrip(html, id, prepare) {
  const live = mount(html);
  const source = workspace(live, id);
  prepare(source);
  const state = adapters.serializeWorkspaceState(source).state;
  const restored = mount(html);
  const target = workspace(restored, id);
  const result = adapters.restoreWorkspaceState(target, state);
  assert.equal(result.ok, true);
  return { state, target, restored };
}

const html = renderedHtml();

test("rendered ordering keeps its initial display order for clearing", () => {
  assert.match(html, /data-assessment-initial-order="s2\|s1"/);
  assert.match(html, /data-workspace-id="assessment-constructed-judgement"/);
  assert.match(html, /data-workspace-id="assessment-constructed-judgement-weakness"/);
});

test("each determinate form restores the visible selection without a score", () => {
  const single = roundTrip(html, "assessment-single", (item) => {
    item.querySelector('input[value="b"]').checked = true;
  });
  assert.deepEqual(single.state.value, { selectedOption: "b", checked: false });
  assert.deepEqual(checkedValues(single.restored, "assessment-single"), ["b"]);
  assert.equal(single.target.getAttribute("data-assessment-last-result"), null);
  assert.equal(single.target.getAttribute("data-assessment-checked"), "false");
  assert.equal(single.target.querySelector("[data-assessment-result]").innerHTML, "");

  const multi = roundTrip(html, "assessment-multi", (item) => {
    item.querySelector('input[value="a"]').checked = true;
    item.querySelector('input[value="c"]').checked = true;
  });
  assert.deepEqual(multi.state.value.selectedOptions, ["a", "c"]);
  assert.equal(multi.state.value.checked, false);
  assert.equal(Object.prototype.hasOwnProperty.call(multi.state.value, "score"), false);
  assert.deepEqual(checkedValues(multi.restored, "assessment-multi"), ["a", "c"]);
  assert.equal(multi.target.getAttribute("data-assessment-last-result"), null);

  const order = roundTrip(html, "assessment-order", (item) => {
    const list = item.querySelector("[data-assessment-order]");
    list.appendChild(list.querySelector('[data-assessment-element-id="s2"]'));
  });
  assert.deepEqual(order.state.value.itemOrder, ["s1", "s2"]);
  assert.deepEqual(orderIds(order.restored), ["s1", "s2"]);
  assert.equal(order.target.querySelector("[data-assessment-position]").textContent, "1");
  assert.equal(order.target.getAttribute("data-assessment-last-result"), null);

  const classified = roundTrip(html, "assessment-class", (item) => {
    item.querySelector('[data-assessment-subject="i1"]').value = "c1";
  });
  assert.deepEqual(classified.state.value.assignments, { i1: "c1", i2: "" });
  assert.equal(classified.target.querySelector('[data-assessment-subject="i1"]').value, "c1");
  assert.equal(classified.target.querySelector('[data-assessment-subject="i2"]').value, "");
  assert.equal(classified.target.getAttribute("data-assessment-last-result"), null);

  const matched = roundTrip(html, "assessment-match", (item) => {
    item.querySelector('[data-assessment-subject="l1"]').value = "r2";
    item.querySelector('[data-assessment-subject="l2"]').value = "r1";
  });
  assert.deepEqual(matched.state.value.pairs, { l1: "r2", l2: "r1" });
  assert.equal(matched.target.querySelector('[data-assessment-subject="l1"]').value, "r2");
  assert.equal(matched.target.getAttribute("data-assessment-last-result"), null);
});

test("a saved check restores the response without disclosing the answer", () => {
  const live = mount(html);
  const single = workspace(live, "assessment-single");
  single.querySelector('input[value="a"]').checked = true;
  single.setAttribute("data-assessment-checked", "true");
  const correctState = adapters.serializeWorkspaceState(single).state;
  const correctPage = mount(html);
  adapters.restoreWorkspaceState(workspace(correctPage, "assessment-single"), correctState);
  const correctItem = workspace(correctPage, "assessment-single");
  assert.equal(correctItem.querySelector('input[value="a"]').checked, true);
  assert.equal(correctItem.getAttribute("data-assessment-last-result"), null);
  assert.equal(correctItem.getAttribute("data-assessment-checked"), "false");
  assert.equal(correctItem.querySelector("[data-assessment-result]").innerHTML, "");

  const wrong = mount(html);
  adapters.restoreWorkspaceState(workspace(wrong, "assessment-single"), {
    kind: "assessment_selection",
    stateVersion: 1,
    value: { selectedOption: "b", checked: true }
  });
  const wrongItem = workspace(wrong, "assessment-single");
  assert.equal(wrongItem.querySelector('input[value="b"]').checked, true);
  assert.equal(wrongItem.getAttribute("data-assessment-last-result"), null);
  assert.equal(wrongItem.querySelector("[data-assessment-result]").innerHTML, "");
  assert.doesNotMatch(String(wrongItem.querySelector("[data-assessment-result]").innerHTML), /correct answer/i);

  const unanswered = mount(html);
  adapters.restoreWorkspaceState(workspace(unanswered, "assessment-single"), {
    kind: "assessment_selection",
    stateVersion: 1,
    value: { selectedOption: "", checked: true }
  });
  const blank = workspace(unanswered, "assessment-single");
  assert.deepEqual(checkedValues(unanswered, "assessment-single"), []);
  assert.equal(blank.getAttribute("data-assessment-last-result"), null);
  assert.equal(blank.getAttribute("data-assessment-checked"), "false");
  assert.equal(blank.querySelector("[data-assessment-result]").innerHTML, "");

  const partial = mount(html);
  adapters.restoreWorkspaceState(workspace(partial, "assessment-class"), {
    kind: "assessment_selection",
    stateVersion: 1,
    value: { selectedOption: "", checked: true, assignments: { i1: "c1", i2: "" } }
  });
  const partialItem = workspace(partial, "assessment-class");
  assert.equal(partialItem.querySelector('[data-assessment-subject="i1"]').value, "c1");
  assert.equal(partialItem.getAttribute("data-assessment-last-result"), null);
  assert.equal(partialItem.getAttribute("data-assessment-checked"), "false");

  const multi = mount(html);
  adapters.restoreWorkspaceState(workspace(multi, "assessment-multi"), {
    kind: "assessment_selection",
    stateVersion: 1,
    value: { selectedOption: "", checked: true, selectedOptions: ["a"] }
  });
  const multiItem = workspace(multi, "assessment-multi");
  assert.equal(multiItem.querySelector('input[value="a"]').checked, true);
  assert.equal(multiItem.getAttribute("data-assessment-last-result"), null);
  assert.equal(multiItem.querySelector("[data-assessment-result]").innerHTML, "");

  const ordered = mount(html);
  const orderItem = workspace(ordered, "assessment-order");
  orderItem.setAttribute("data-assessment-checked", "true");
  const orderState = adapters.serializeWorkspaceState(orderItem).state;
  const orderPage = mount(html);
  adapters.restoreWorkspaceState(workspace(orderPage, "assessment-order"), orderState);
  assert.deepEqual(orderIds(orderPage), ["s2", "s1"]);
  assert.equal(workspace(orderPage, "assessment-order").getAttribute("data-assessment-last-result"), null);
  assert.equal(workspace(orderPage, "assessment-order").querySelector("[data-assessment-result]").innerHTML, "");

  const corrected = mount(html);
  const correctList = workspace(corrected, "assessment-order").querySelector("[data-assessment-order]");
  correctList.appendChild(correctList.querySelector('[data-assessment-element-id="s2"]'));
  const correctOrderItem = workspace(corrected, "assessment-order");
  correctOrderItem.setAttribute("data-assessment-checked", "true");
  const correctOrderState = adapters.serializeWorkspaceState(correctOrderItem).state;
  const correctOrderPage = mount(html);
  adapters.restoreWorkspaceState(workspace(correctOrderPage, "assessment-order"), correctOrderState);
  assert.deepEqual(orderIds(correctOrderPage), ["s1", "s2"]);
  assert.equal(workspace(correctOrderPage, "assessment-order").getAttribute("data-assessment-last-result"), null);
  assert.equal(workspace(correctOrderPage, "assessment-order").querySelector("[data-assessment-result]").innerHTML, "");
});

test("constructed response text and the weakness stay separate", () => {
  const judgement = roundTrip(html, "assessment-constructed-judgement", (item) => {
    item.querySelector("textarea").value = "The design does not establish causation.";
  });
  assert.equal(judgement.state.kind, "text_entry");
  assert.equal(judgement.state.value.text, "The design does not establish causation.");
  assert.equal(
    judgement.target.querySelector("textarea").value,
    "The design does not establish causation."
  );

  const weakness = roundTrip(html, "assessment-constructed-judgement-weakness", (item) => {
    item.querySelector("textarea").value = "I overstated the comparison.";
  });
  assert.equal(weakness.state.value.text, "I overstated the comparison.");
  assert.equal(weakness.target.querySelector("textarea").value, "I overstated the comparison.");
  assert.notEqual(judgement.target.querySelector("textarea").value, weakness.target.querySelector("textarea").value);
});

test("a previously saved single-answer draft still restores", () => {
  const restored = mount(html);
  const result = adapters.restoreWorkspaceState(workspace(restored, "assessment-single"), {
    kind: "assessment_selection",
    stateVersion: 1,
    value: { selectedOption: "a", checked: true }
  });
  assert.equal(result.ok, true);
  assert.deepEqual(checkedValues(restored, "assessment-single"), ["a"]);
  assert.equal(workspace(restored, "assessment-single").getAttribute("data-assessment-last-result"), null);
  assert.equal(workspace(restored, "assessment-single").getAttribute("data-assessment-checked"), "false");
  assert.equal(workspace(restored, "assessment-single").querySelector("[data-assessment-result]").innerHTML, "");
});

test("changing a checkbox schedules a draft that keeps the selection", async () => {
  const root = mount(html);
  const map = new Map();
  const storage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(String(key), String(value)),
    removeItem: (key) => map.delete(String(key))
  };
  const api = initializeLearnerDraftPersistence(root, {
    pageKey: "persistence-slice",
    storage,
    debounceMs: 0,
    confirm: () => false
  });
  const box = workspace(root, "assessment-multi").querySelector('input[value="b"]');
  box.checked = true;
  box.dispatchEvent({ type: "change", target: box, bubbles: true });
  await new Promise((resolve) => setTimeout(resolve, 0));
  const saved = JSON.parse(map.get("learner-renderer-vnext:draft:persistence-slice"));
  assert.deepEqual(saved.workspaces["assessment-multi"].value.selectedOptions, ["b"]);
  assert.equal(saved.workspaces["assessment-multi"].value.checked, false);
  assert.equal(api.getStatus(), "Draft saved on this device");
});

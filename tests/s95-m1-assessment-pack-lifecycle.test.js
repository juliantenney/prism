/**
 * Sprint 95 M1 — Assessment Pack container-scoped mount / unmount / remount.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  renderLearnerPageHtml,
  renderLearnerResourceFragment,
  mountLearnerResource,
  unmountLearnerResource,
  installAssessmentRuntime,
  disposeAssessmentRuntime
} = require("../lib/learner-renderer-vnext");

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
    _listeners: [],
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
    removeChild(child) {
      const index = this.children.indexOf(child);
      if (index >= 0) {
        this.children.splice(index, 1);
        child.parentNode = null;
      }
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
    addEventListener(type, handler, options) {
      this._listeners.push({ type, handler, options: options || false });
    },
    removeEventListener(type, handler, options) {
      const capture = Boolean(options && options.capture);
      this._listeners = this._listeners.filter((entry) => {
        const entryCapture = Boolean(entry.options && entry.options.capture);
        if (typeof entry.options === "boolean") {
          return !(entry.type === type && entry.handler === handler && Boolean(entry.options) === capture);
        }
        return !(entry.type === type && entry.handler === handler && entryCapture === capture);
      });
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
  Object.defineProperty(node, "firstChild", {
    get() {
      return node.children[0] || null;
    }
  });
  Object.defineProperty(node, "innerHTML", {
    get() {
      return node._html;
    },
    set(value) {
      node._html = String(value || "");
      node.children = [];
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

function createDocument() {
  const documentNode = createElement("document");
  documentNode.createElement = (tag) => {
    const node = createElement(tag);
    node.ownerDocument = documentNode;
    return node;
  };
  documentNode.addEventListener = () => {};
  documentNode.removeEventListener = () => {};
  return documentNode;
}

function createMountContainer(documentRef) {
  // Standalone stub (not createElement) so innerHTML can parse the fragment.
  const container = {
    tagName: "DIV",
    className: "",
    attributes: Object.create(null),
    children: [],
    parentNode: null,
    ownerDocument: documentRef,
    _html: "",
    _listeners: [],
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
    appendChild(child) {
      if (child.parentNode && child.parentNode.children) {
        const siblings = child.parentNode.children;
        const index = siblings.indexOf(child);
        if (index >= 0) siblings.splice(index, 1);
      }
      child.parentNode = this;
      this.children.push(child);
      return child;
    },
    removeChild(child) {
      const index = this.children.indexOf(child);
      if (index >= 0) {
        this.children.splice(index, 1);
        child.parentNode = null;
      }
      return child;
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
    addEventListener() {},
    removeEventListener() {},
    replaceChildren() {
      this.children.forEach((child) => {
        child.parentNode = null;
      });
      this.children = [];
      this._html = "";
    }
  };
  Object.defineProperty(container, "firstChild", {
    get() {
      return container.children[0] || null;
    }
  });
  Object.defineProperty(container, "innerHTML", {
    get() {
      return container._html;
    },
    set(value) {
      container._html = String(value || "");
      container.children.forEach((child) => {
        child.parentNode = null;
      });
      container.children = [];
      const parsed = parseHtmlFragment(container._html, documentRef);
      parsed.children.slice().forEach((child) => {
        container.appendChild(child);
      });
    }
  });
  return container;
}

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(String(key), String(value)),
    removeItem: (key) => map.delete(String(key)),
    _map: map
  };
}

function assessmentPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Lifecycle check",
    activities: [],
    metadata: { workflow_id: "wf-s95-m1", page_id: "page-s95-m1" },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Lifecycle restore.",
        stop_rationale: "A short formative stop.",
        forward_intent: "Carry the checked distinctions forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use the result in the next block.",
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
              }
            ]
          },
          formative_return: {
            materials: [{ material_id: "guide", body: "Use the check result." }],
            forward_orientation: "Take the checked result forward."
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
            materials: [{ material_id: "look", title: "Self-evaluation", body: "Look again." }],
            revision: { offered: true, prompt: "Name one change." },
            forward_orientation: "Carry the writing forward."
          }
        }
      ]
    }
  };
}

function workspace(root, id) {
  return root.querySelector('[data-workspace-id="' + id + '"]');
}

test("S95-T-003 fragment uses article landmark without nested main or boot scripts", () => {
  const fragment = renderLearnerResourceFragment(assessmentPage());
  assert.equal(fragment.error, null, String(fragment.error || ""));
  assert.match(fragment.html, /^<article\b/);
  assert.match(fragment.html, /data-renderer="vnext"/);
  assert.match(fragment.html, /role="region"/);
  assert.doesNotMatch(fragment.html, /<main\b/);
  assert.doesNotMatch(fragment.html, /<script\b/);
  assert.match(fragment.html, /data-workspace-id="assessment-constructed-judgement"/);
});

test("standalone page render still wraps in main and auto-boots assessment runtime", () => {
  const standalone = renderLearnerPageHtml(assessmentPage(), { compositionMode: "beats" });
  assert.equal(standalone.error, null, String(standalone.error || ""));
  assert.match(standalone.html, /^<main\b/);
  assert.match(standalone.html, /<script>/);
  assert.match(standalone.html, /installAssessmentRuntime/);
  assert.match(standalone.html, /function boot\(\)/);
  assert.doesNotMatch(standalone.html, /<article\b[^>]*data-renderer="vnext"/);
});

test("S95-T-002/004 mount → type → unmount → remount restores draft text", async () => {
  const documentRef = createDocument();
  const storage = memoryStorage();
  const fragment = renderLearnerResourceFragment(assessmentPage());
  assert.equal(fragment.error, null, String(fragment.error || ""));

  const container = createMountContainer(documentRef);
  const first = mountLearnerResource(container, {
    html: fragment.html,
    storage,
    pageKey: "s95-m1-lifecycle",
    debounceMs: 0
  });
  assert.equal(first.ok, true, first.reason || "mount failed");
  assert.ok(first.root);
  assert.equal(first.root.tagName, "ARTICLE");
  assert.equal(first.root.getAttribute("data-renderer"), "vnext");
  assert.ok(first.root.__prismAssessmentRuntime);
  assert.ok(first.root.__prismDraftPersistence);

  const textarea = workspace(first.root, "assessment-constructed-judgement").querySelector("textarea");
  assert.ok(textarea);
  textarea.value = "The design does not establish causation.";
  textarea.dispatchEvent({ type: "input", target: textarea, bubbles: true });
  await new Promise((resolve) => setTimeout(resolve, 0));
  first.draft.flushPendingSave();

  const saved = JSON.parse(storage.getItem("learner-renderer-vnext:draft:s95-m1-lifecycle"));
  assert.equal(
    saved.workspaces["assessment-constructed-judgement"].value.text,
    "The design does not establish causation."
  );

  const unmounted = unmountLearnerResource(first);
  assert.equal(unmounted.ok, true);
  assert.equal(unmounted.alreadyDisposed, false);
  assert.equal(container.children.length, 0);
  assert.equal(first.root.__prismAssessmentRuntime, undefined);
  assert.equal(first.root.__prismDraftPersistence, undefined);

  const second = mountLearnerResource(container, {
    html: fragment.html,
    storage,
    pageKey: "s95-m1-lifecycle",
    debounceMs: 0
  });
  assert.equal(second.ok, true, second.reason || "remount failed");
  const restored = workspace(second.root, "assessment-constructed-judgement").querySelector("textarea");
  assert.equal(restored.value, "The design does not establish causation.");

  const again = unmountLearnerResource(first);
  assert.equal(again.ok, true);
  assert.equal(again.alreadyDisposed, true);

  second.unmount();
});

test("S95-T-004 dispose is idempotent and repeated mount does not duplicate handlers", () => {
  const documentRef = createDocument();
  const container = createMountContainer(documentRef);
  const fragment = renderLearnerResourceFragment(assessmentPage());
  const storage = memoryStorage();

  const first = mountLearnerResource(container, {
    html: fragment.html,
    storage,
    pageKey: "s95-m1-handlers",
    debounceMs: 0
  });
  assert.equal(first.ok, true);
  const clickCountAfterFirst = first.root._listeners.filter((entry) => entry.type === "click").length;
  assert.ok(clickCountAfterFirst >= 1);

  const same = installAssessmentRuntime(first.root);
  assert.equal(same, first.root.__prismAssessmentRuntime);
  assert.equal(
    first.root._listeners.filter((entry) => entry.type === "click").length,
    clickCountAfterFirst,
    "re-install must not attach another click handler"
  );

  first.unmount();
  disposeAssessmentRuntime(first.root);
  disposeAssessmentRuntime(first.root);

  const second = mountLearnerResource(container, {
    html: fragment.html,
    storage,
    pageKey: "s95-m1-handlers",
    debounceMs: 0
  });
  assert.equal(second.ok, true);
  assert.equal(
    second.root._listeners.filter((entry) => entry.type === "click").length,
    clickCountAfterFirst,
    "remount must recreate a single scoped handler set"
  );
  second.unmount();
});

test("selection change persists across remount via draft pageKey", async () => {
  const documentRef = createDocument();
  const storage = memoryStorage();
  const fragment = renderLearnerResourceFragment(assessmentPage());
  const container = createMountContainer(documentRef);

  const first = mountLearnerResource(container, {
    html: fragment.html,
    storage,
    pageKey: "s95-m1-selection",
    debounceMs: 0
  });
  const box = workspace(first.root, "assessment-single").querySelector('input[value="b"]');
  box.checked = true;
  box.dispatchEvent({ type: "change", target: box, bubbles: true });
  await new Promise((resolve) => setTimeout(resolve, 0));
  first.draft.flushPendingSave();
  first.unmount();

  const second = mountLearnerResource(container, {
    html: fragment.html,
    storage,
    pageKey: "s95-m1-selection",
    debounceMs: 0
  });
  const restored = workspace(second.root, "assessment-single").querySelector('input[value="b"]');
  assert.equal(restored.checked, true);
  second.unmount();
});

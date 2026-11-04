/**
 * Sprint 95 M4 — wider product lifecycle + six-resource synthetic journey.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");

const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const learnerPackage = require("../lib/learner-package.js");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");
const {
  renderLearnerPageHtml,
  renderLearnerResourceFragment,
  mountLearnerResource,
  unmountLearnerResource,
  installOrderingRuntime,
  disposeOrderingRuntime,
  installMathEntryRuntime,
  disposeMathEntryRuntime
} = require("../lib/learner-renderer-vnext");
const { buildOrderingWorkspaceModel } = require("../lib/learner-renderer-vnext/build-ordering-workspace-model");
const { renderOrderingWorkspace } = require("../lib/learner-renderer-vnext/render-ordering-workspace");

function assessmentPage(overrides) {
  const src = overrides && typeof overrides === "object" ? overrides : {};
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: src.title || "Assessment stop",
    activities: [],
    metadata: {
      workflow_id: src.workflowId || "wf-s95-m4",
      page_id: src.pageId || "page-s95-m4"
    },
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "M4 compatibility.",
        stop_rationale: "A short formative stop.",
        forward_intent: "Carry the judgement forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use the result in the next block.",
      elicitations: [
        {
          elicitation_id: "judgement",
          order: 1,
          evidence_ask: "Write the independent judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write your independent judgement.",
            response_workspace: { intention: "Independent judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", body: "Look again." }],
            revision: { offered: true, prompt: "Name one change." },
            forward_orientation: "Carry the writing forward."
          }
        }
      ]
    }
  };
}

function orderingFragmentHtml(pageKey) {
  const built = buildOrderingWorkspaceModel(
    {
      responsePartId: "A1::ordering::ordering",
      surfaceKind: "ordering",
      label: "Order the decision steps",
      prompt: "Use the move buttons.",
      ordering: {
        mode: "sequence",
        validationMode: "exact_order",
        expectedOrder: ["s1", "s2", "s3"],
        items: [
          { itemId: "s2", content: "Weigh trade-offs", accessibleLabel: "Weigh trade-offs" },
          { itemId: "s1", content: "Frame the decision", accessibleLabel: "Frame the decision" },
          { itemId: "s3", content: "Commit and monitor", accessibleLabel: "Commit and monitor" }
        ],
        initialItems: [
          { itemId: "s2", content: "Weigh trade-offs", accessibleLabel: "Weigh trade-offs" },
          { itemId: "s1", content: "Frame the decision", accessibleLabel: "Frame the decision" },
          { itemId: "s3", content: "Commit and monitor", accessibleLabel: "Commit and monitor" }
        ]
      }
    },
    { activityId: "A1" }
  );
  assert.equal(built.ok, true);
  const body = renderOrderingWorkspace(built.workspace);
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Ordering practice" data-persistence-page-key="' +
    String(pageKey || "m4-ordering") +
    '">' +
    '<h2 data-lj-resource-title="true">Opening interactive</h2>' +
    body +
    "</article>"
  );
}

function mathFallbackFragmentHtml(pageKey) {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" ' +
    'aria-label="Math practice" data-persistence-page-key="' +
    String(pageKey || "m4-math") +
    '">' +
    '<h2 data-lj-resource-title="true">Quantify uncertainty</h2>' +
    '<div class="util-learner-workspace util-learner-workspace--math-entry" data-workspace-kind="text_entry" ' +
    'data-workspace-id="math-ws-1" data-input-modality="math" data-math-entry="true" ' +
    'data-math-field-id="math-ws-1-field" data-math-label-id="math-ws-1-label">' +
    '<label id="math-ws-1-label" for="math-ws-1-field">Express the prior</label>' +
    '<div data-math-entry-mount class="util-math-entry__mount" hidden></div>' +
    '<textarea id="math-ws-1-field" class="util-learner-workspace__input util-learner-workspace__input--canonical"></textarea>' +
    "</div>" +
    "</article>"
  );
}

function staticFragmentHtml(title, pageKey, body) {
  return (
    '<article class="util-learner-renderer-vnext" data-renderer="vnext" role="region" aria-label="' +
    title +
    '" data-persistence-page-key="' +
    pageKey +
    '"><h2 data-lj-resource-title="true">' +
    title +
    "</h2><p>" +
    (body || "Static explanatory content for the journey.") +
    "</p></article>"
  );
}

function artefactContract() {
  return {
    produces: [
      {
        artefactId: "c5.independent_judgement",
        commissionId: "c5",
        workspaceId: "assessment-constructed-judgement",
        label: "Independent judgement"
      }
    ],
    references: [
      {
        artefactId: "c5.independent_judgement",
        commissionId: "c6",
        usage: "reference",
        label: "Your earlier independent judgement",
        missingMessage:
          "Your independent judgement is not available yet. Complete that experience first, or continue with the activities below.",
        standaloneFallback:
          "If you are working outside the journey, keep a copy of your judgement yourself."
      }
    ]
  };
}

function sixResourceJourney() {
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Deciding Under Uncertainty (M4 synthetic)",
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Synthetic six-resource compatibility fixture — not regenerated DUU content."
      },
      { section_id: "exp_1", title: "Opening interactive", order: 2, exposition: "Order the steps." },
      { section_id: "exp_2", title: "Expository framing", order: 3, exposition: "Read the framing." },
      { section_id: "exp_3", title: "Situated record", order: 4, exposition: "Capture a short record." },
      { section_id: "exp_4", title: "Quantify uncertainty", order: 5, exposition: "Use a math workspace." },
      { section_id: "exp_5", title: "Independent judgement", order: 6, exposition: "Write the judgement." },
      { section_id: "exp_6", title: "Reflect on your judgement", order: 7, exposition: "Reuse the judgement." }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Opening interactive",
        product_id: "interactive",
        status: "supported",
        specification_text: "C1 ordering"
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Expository framing",
        product_id: "expository",
        status: "supported",
        specification_text: "C2 expository"
      },
      {
        commission_id: "c3",
        section_id: "exp_3",
        order: 3,
        title: "Situated record",
        product_id: "situated_task",
        status: "supported",
        specification_text: "C3 situated-style"
      },
      {
        commission_id: "c4",
        section_id: "exp_4",
        order: 4,
        title: "Quantify uncertainty",
        product_id: "interactive",
        status: "supported",
        specification_text: "C4 math modality"
      },
      {
        commission_id: "c5",
        section_id: "exp_5",
        order: 5,
        title: "Independent judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C5"
      },
      {
        commission_id: "c6",
        section_id: "exp_6",
        order: 6,
        title: "Reflect on your judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C6"
      }
    ]
  });
}

function createElement(tagName) {
  const node = {
    tagName: String(tagName || "").toUpperCase(),
    className: "",
    attributes: Object.create(null),
    children: [],
    parentNode: null,
    textContent: "",
    value: "",
    hidden: false,
    disabled: false,
    _html: "",
    _listeners: [],
    style: {
      setProperty: function () {},
      getPropertyValue: function () {
        return "";
      },
      removeProperty: function () {}
    },
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
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
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
      return this.children.some((child) => child === other || (child.contains && child.contains(other)));
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    },
    querySelectorAll(selector) {
      const found = [];
      walk(this, (child) => {
        if (child !== this && matchesSelector(child, selector)) found.push(child);
      });
      return found;
    },
    addEventListener(type, handler) {
      this._listeners.push({ type, handler });
    },
    removeEventListener(type, handler) {
      this._listeners = this._listeners.filter(
        (entry) => !(entry.type === type && entry.handler === handler)
      );
    },
    dispatchEvent() {
      return true;
    },
    getBoundingClientRect() {
      return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
    },
    focus() {},
    blur() {}
  };
  Object.defineProperty(node, "innerHTML", {
    get() {
      return node._html;
    },
    set(value) {
      node._html = String(value || "");
      node.children = [];
    }
  });
  Object.defineProperty(node, "clientHeight", {
    get() {
      return 0;
    }
  });
  Object.defineProperty(node, "scrollHeight", {
    get() {
      return 0;
    }
  });
  Object.defineProperty(node, "scrollTop", {
    get() {
      return node._scrollTop || 0;
    },
    set(value) {
      node._scrollTop = Number(value) || 0;
    }
  });
  Object.defineProperty(node, "parentElement", {
    get() {
      return node.parentNode && node.parentNode.tagName ? node.parentNode : null;
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
      if (!cls || !node.classList || !node.classList.contains(cls[0])) return false;
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
  const container = {
    tagName: "DIV",
    attributes: Object.create(null),
    children: [],
    parentNode: null,
    ownerDocument: documentRef,
    _html: "",
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
    },
    appendChild(child) {
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
      walk(this, (child) => {
        if (child !== this && matchesSelector(child, selector)) found.push(child);
      });
      return found;
    },
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
      container.children = [];
      const parsed = parseHtmlFragment(container._html, documentRef);
      parsed.children.slice().forEach((child) => container.appendChild(child));
    }
  });
  return container;
}

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(String(key), String(value)),
    removeItem: (key) => map.delete(String(key))
  };
}

function unzipText(bytes, name) {
  const files = fflate.unzipSync(bytes);
  assert.ok(files[name], "missing " + name);
  return Buffer.from(files[name]).toString("utf8");
}

test("S95-T-010 ordering runtime installs and disposes without duplicate handlers", () => {
  const documentRef = createDocument();
  const container = createMountContainer(documentRef);
  const html = orderingFragmentHtml("m4-order-handlers");
  const storage = memoryStorage();

  const first = mountLearnerResource(container, {
    html,
    storage,
    pageKey: "m4-order-handlers",
    debounceMs: 0
  });
  assert.equal(first.ok, true, first.reason || "mount failed");
  assert.ok(first.ordering && first.ordering.ok);
  assert.ok(first.root.__prismOrderingRuntime);
  const clicks = first.root._listeners.filter((entry) => entry.type === "click").length;
  assert.ok(clicks >= 1);

  const same = installOrderingRuntime(first.root);
  assert.equal(same, first.root.__prismOrderingRuntime);
  assert.equal(
    first.root._listeners.filter((entry) => entry.type === "click").length,
    clicks,
    "re-install must not duplicate ordering click handler"
  );

  first.unmount();
  assert.equal(first.root.__prismOrderingRuntime, undefined);
  disposeOrderingRuntime(first.root);
});

test("S95-T-010 math-entry install uses textarea fallback without MathLive and disposes", () => {
  const documentRef = createDocument();
  const container = createMountContainer(documentRef);
  const html = mathFallbackFragmentHtml("m4-math-fallback");
  const mounted = mountLearnerResource(container, {
    html,
    storage: memoryStorage(),
    pageKey: "m4-math-fallback",
    debounceMs: 0
  });
  assert.equal(mounted.ok, true, mounted.reason || "mount failed");
  assert.ok(mounted.mathEntry && mounted.mathEntry.ok);
  assert.equal(mounted.mathEntry.mode, "fallback");
  const workspace = mounted.root.querySelector('[data-input-modality="math"]');
  assert.ok(workspace);
  assert.ok(workspace.classList.contains("util-learner-workspace--math-fallback"));

  const same = installMathEntryRuntime(mounted.root);
  assert.equal(same, mounted.root.__prismMathEntryRuntime);

  mounted.unmount();
  assert.equal(mounted.root.__prismMathEntryRuntime, undefined);
  disposeMathEntryRuntime(mounted.root);
});

test("S95-T-010 six-resource synthetic DUU-shaped shell reaches all commissions with C5→C6 contract", () => {
  const journey = sixResourceJourney();
  assert.equal(journey.ok, true);

  const pageC5 = assessmentPage({
    title: "Independent judgement",
    workflowId: "wf-m4-c5",
    pageId: "page-m4-c5"
  });
  const pageC6 = assessmentPage({
    title: "Reflect on your judgement",
    workflowId: "wf-m4-c6",
    pageId: "page-m4-c6"
  });
  const packC5 = learnerPackage.buildLearnerPackage({
    html: renderLearnerPageHtml(pageC5).html,
    title: pageC5.title
  });
  const packC6 = learnerPackage.buildLearnerPackage({
    html: renderLearnerPageHtml(pageC6).html,
    title: pageC6.title
  });
  assert.equal(packC5.ok, true);
  assert.equal(packC6.ok, true);

  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    artefactContract: artefactContract(),
    constituents: [
      {
        commissionId: "c1",
        title: "Opening interactive",
        productId: "interactive",
        fragmentHtml: orderingFragmentHtml("m4-duu-c1")
      },
      {
        commissionId: "c2",
        title: "Expository framing",
        productId: "expository",
        fragmentHtml: staticFragmentHtml(
          "Expository framing",
          "m4-duu-c2",
          "Uncertainty is a property of the decision situation."
        )
      },
      {
        commissionId: "c3",
        title: "Situated record",
        productId: "situated_task",
        fragmentHtml: staticFragmentHtml(
          "Situated record",
          "m4-duu-c3",
          "Record the workplace situation you will revisit."
        )
      },
      {
        commissionId: "c4",
        title: "Quantify uncertainty",
        productId: "interactive",
        fragmentHtml: mathFallbackFragmentHtml("m4-duu-c4")
      },
      {
        commissionId: "c5",
        title: "Independent judgement",
        productId: "assessment_pack",
        sourcePage: pageC5,
        learnerPackage: packC5.package
      },
      {
        commissionId: "c6",
        title: "Reflect on your judgement",
        productId: "assessment_pack",
        sourcePage: pageC6,
        learnerPackage: packC6.package
      }
    ],
    fflate
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  assert.equal(assembled.packageMode, "unified_shell");
  assert.equal(assembled.resources.length, 6);
  assert.equal(
    (assembled.warnings || []).filter((row) => /Unknown product_id|No mountable/i.test(row.reason || "")).length,
    0
  );

  const shellHtml = unzipText(assembled.bytes, "index.html");
  assert.match(shellHtml, /data-lj-shell="unified"/);
  assert.match(shellHtml, /id="lj-resource-c1"/);
  assert.match(shellHtml, /id="lj-resource-c2"/);
  assert.match(shellHtml, /id="lj-resource-c3"/);
  assert.match(shellHtml, /id="lj-resource-c4"/);
  assert.match(shellHtml, /id="lj-resource-c5"/);
  assert.match(shellHtml, /id="lj-resource-c6"/);
  assert.match(shellHtml, /util-ordering-workspace/);
  assert.match(shellHtml, /data-input-modality="math"/);
  assert.match(shellHtml, /c5\.independent_judgement/);
  assert.match(shellHtml, /Your earlier independent judgement/);
  assert.match(shellHtml, /src="runtime\/learner-renderer-vnext-browser\.js"/);
  assert.doesNotMatch(shellHtml, /<iframe\b/i);

  const files = fflate.unzipSync(assembled.bytes);
  assert.ok(files["runtime/learner-renderer-vnext-browser.js"]);
  assert.equal(files["c1/index.html"], undefined);

  // Multi-document path remains available (two-AP subset; all page commissions need packages).
  const multiJourney = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Multi-doc lock",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Multi-doc regression."
      },
      { section_id: "exp_5", title: "Independent judgement", order: 2, exposition: "Write." },
      { section_id: "exp_6", title: "Reflect", order: 3, exposition: "Reflect." }
    ],
    commissions: [
      {
        commission_id: "c5",
        section_id: "exp_5",
        order: 1,
        title: "Independent judgement",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C5"
      },
      {
        commission_id: "c6",
        section_id: "exp_6",
        order: 2,
        title: "Reflect",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "C6"
      }
    ]
  });
  const multi = ljPackage.assembleLearningJourneyLearnerPackage({
    page: multiJourney.page,
    constituents: [
      { commissionId: "c5", learnerPackage: packC5.package },
      { commissionId: "c6", learnerPackage: packC6.package }
    ],
    fflate
  });
  assert.equal(multi.ok, true, multi.error && multi.error.message);
  const multiHome = unzipText(multi.bytes, "index.html");
  assert.match(multiHome, /lj-home/);
  assert.match(multiHome, /href="c5\/index\.html"/);
});

test("S95-T-010 Assessment Pack fragment still mounts with extended lifecycle handles", () => {
  const hadWindow = Object.prototype.hasOwnProperty.call(global, "window");
  const hadDocument = Object.prototype.hasOwnProperty.call(global, "document");
  const previousWindow = global.window;
  const previousDocument = global.document;

  const documentRef = createDocument();
  documentRef.body = createElement("body");
  documentRef.documentElement = createElement("html");
  documentRef.addEventListener = function () {};
  documentRef.removeEventListener = function () {};
  global.document = documentRef;
  global.window = {
    addEventListener: function () {},
    removeEventListener: function () {},
    scrollBy: function () {},
    getComputedStyle: function () {
      return {
        overflowY: "visible",
        position: "static",
        paddingTop: "0",
        paddingBottom: "0",
        getPropertyValue: function () {
          return "";
        }
      };
    },
    matchMedia: function () {
      return { matches: false, addEventListener: function () {}, addListener: function () {} };
    },
    requestAnimationFrame: function (fn) {
      return setTimeout(fn, 0);
    },
    dispatchEvent: function () {
      return true;
    }
  };

  try {
    const container = createMountContainer(documentRef);
    documentRef.body.appendChild(container);
    const fragment = renderLearnerResourceFragment(
      assessmentPage({ workflowId: "wf-m4-ap", pageId: "page-m4-ap" })
    );
    assert.equal(fragment.error, null, String(fragment.error || ""));
    const mounted = mountLearnerResource(container, {
      html: fragment.html,
      storage: memoryStorage(),
      pageKey: "m4-ap",
      debounceMs: 0
    });
    assert.equal(mounted.ok, true);
    assert.ok(mounted.assessment);
    assert.ok(mounted.ordering);
    assert.ok(mounted.mathEntry);
    assert.ok(mounted.revisionCriterion);
    const result = unmountLearnerResource(mounted);
    assert.equal(result.ok, true);
  } finally {
    if (hadWindow) global.window = previousWindow;
    else delete global.window;
    if (hadDocument) global.document = previousDocument;
    else delete global.document;
  }
});

test("real DUU source gap remains documented: no committed seven-component HTML", () => {
  // Guard: M4 must not pretend live DUU HTML exists on disk.
  const fs = require("node:fs");
  const path = require("node:path");
  const candidates = [
    path.join(__dirname, "..", "docs", "development", "sprints", "2026-11-03-sprint-95-unified-learning-journey-runtime", "COMPATIBILITY-INVENTORY.md")
  ];
  const inventory = fs.readFileSync(candidates[0], "utf8");
  assert.match(inventory, /Absent/);
  assert.match(inventory, /synthetic/i);
});

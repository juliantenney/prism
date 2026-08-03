"use strict";

/**
 * Sprint 71 — guided-review checklist vertical slice.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");

const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const guided = require("../lib/learner-renderer-vnext/parse-guided-checklist");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const { getGuidedReviewRuntimeScript } = require("../lib/learner-renderer-vnext/guided-review-runtime");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");

function guidedPayload(overrides) {
  return Object.assign(
    {
      review_mode: "guided_criteria",
      criteria: [
        {
          statement: "Have you described how each genome type produces mRNA?",
          why_it_matters: "Genome-to-mRNA mapping is the core discrimination in this task.",
          features: [
            {
              expected: "Each genome type is linked to an mRNA production route",
              repair: "Add one sentence per genome type naming how mRNA is produced."
            },
            {
              expected: "Positive-sense, negative-sense, and dsRNA are treated distinctly",
              repair: "Separate the three routes instead of collapsing them into one process."
            }
          ],
          confirmation_label: "My response now meets this criterion"
        },
        {
          statement: "Have you avoided treating all RNA genomes as interchangeable?",
          why_it_matters: "Interchangeable treatment hides the diagnostic differences learners must use.",
          features: [
            {
              expected: "At least one explicit contrast between genome types",
              repair: "Add a contrast sentence that names how two genome types differ in mRNA production."
            }
          ]
        },
        {
          statement: "Have you connected genome type to a practical implication for the activity?",
          why_it_matters: "Without application, the explanation stays abstract.",
          features: [
            {
              expected: "One consequence for detection, infection, or laboratory practice",
              repair: "State one practical consequence that follows from the genome-to-mRNA route."
            }
          ]
        }
      ]
    },
    overrides || {}
  );
}

function guidedMaterial(payload) {
  return parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M4",
      material_type: "checklist",
      title: "Response quality review",
      body_format: "json",
      body: payload
    },
    0
  );
}

function createGuidedReviewHarness() {
  const listeners = { click: [] };

  function makeEl(tagName, attrs) {
    const el = {
      tagName: String(tagName || "").toUpperCase(),
      attributes: Object.assign(Object.create(null), attrs || {}),
      children: [],
      parentNode: null,
      disabled: false,
      checked: false,
      hidden: Object.prototype.hasOwnProperty.call(attrs || {}, "hidden"),
      textContent: "",
      getAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name)
          ? this.attributes[name]
          : null;
      },
      setAttribute(name, value) {
        this.attributes[name] = String(value);
        if (name === "hidden") this.hidden = true;
      },
      removeAttribute(name) {
        delete this.attributes[name];
        if (name === "hidden") this.hidden = false;
      },
      hasAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name);
      },
      matches(sel) {
        if (sel.indexOf("[data-guided-review-next]") >= 0) {
          return this.hasAttribute("data-guided-review-next");
        }
        if (sel.indexOf("[data-guided-review-prev]") >= 0) {
          return this.hasAttribute("data-guided-review-prev");
        }
        return false;
      },
      closest(sel) {
        let node = this;
        while (node) {
          if (
            sel === '[data-guided-review="true"]' &&
            node.getAttribute("data-guided-review") === "true"
          ) {
            return node;
          }
          if (
            sel.indexOf("[data-guided-review-prev]") >= 0 &&
            node.hasAttribute("data-guided-review-prev")
          ) {
            return node;
          }
          if (
            sel.indexOf("[data-guided-review-next]") >= 0 &&
            node.hasAttribute("data-guided-review-next")
          ) {
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
        listeners.click.forEach((fn) => fn({ target: this, preventDefault() {} }));
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
    (node.children || []).forEach((child) => collect(child, out));
  }

  function queryAll(root, sel) {
    const all = [];
    collect(root, all);
    return all.filter((el) => {
      if (sel === '[data-guided-review="true"]') {
        return el.getAttribute("data-guided-review") === "true";
      }
      if (sel === "[data-guided-review-index]") {
        return el.hasAttribute("data-guided-review-index");
      }
      if (sel.indexOf('[data-guided-review-index="') === 0) {
        const idx = sel.match(/"(\d+)"/)[1];
        return el.getAttribute("data-guided-review-index") === idx;
      }
      if (sel === "[data-guided-review-progress]") {
        return el.hasAttribute("data-guided-review-progress");
      }
      if (sel === "[data-guided-review-status]") {
        return el.hasAttribute("data-guided-review-status");
      }
      if (sel === "[data-guided-review-prev]") {
        return el.hasAttribute("data-guided-review-prev");
      }
      if (sel === "[data-guided-review-next]") {
        return el.hasAttribute("data-guided-review-next");
      }
      if (sel === "[data-guided-review-nav]") {
        return el.hasAttribute("data-guided-review-nav");
      }
      if (sel.charAt(0) === "#") {
        return el.getAttribute("id") === sel.slice(1);
      }
      return false;
    });
  }

  const root = makeEl("div", { "data-guided-review": "true", "data-guided-review-count": "3" });
  const status = makeEl("p", { "data-guided-review-status": "" });
  status.className = "util-visually-hidden";
  const panelsWrap = makeEl("div", {});
  const panels = [0, 1, 2].map((index) => {
    const panel = makeEl("section", { "data-guided-review-index": String(index) });
    const progress = makeEl("p", { "data-guided-review-progress": "" });
    progress.textContent = "Criterion " + (index + 1) + " of 3";
    const checkbox = makeEl("input", {
      id: "checklist-a1-a1-m4-item-" + index,
      "data-checklist-item-id": "checklist-a1-a1-m4-item-" + index,
      type: "checkbox"
    });
    progress.parentNode = panel;
    checkbox.parentNode = panel;
    panel.children.push(progress, checkbox);
    panel.parentNode = panelsWrap;
    return panel;
  });
  panels.forEach((panel) => panelsWrap.children.push(panel));
  const nav = makeEl("div", { "data-guided-review-nav": "", hidden: "" });
  nav.hidden = true;
  const prev = makeEl("button", { "data-guided-review-prev": "" });
  prev.disabled = false;
  const next = makeEl("button", { "data-guided-review-next": "" });
  prev.parentNode = nav;
  next.parentNode = nav;
  nav.children.push(prev, next);
  status.parentNode = root;
  panelsWrap.parentNode = root;
  nav.parentNode = root;
  root.children.push(status, panelsWrap, nav);

  const document = {
    readyState: "complete",
    activeElement: null,
    addEventListener(type, fn) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(fn);
    },
    querySelector(sel) {
      return queryAll(root, sel)[0] || null;
    },
    querySelectorAll(sel) {
      return queryAll(root, sel);
    }
  };

  const sandbox = { document, Array, Number, String, Math, Boolean, console };
  vm.createContext(sandbox);
  vm.runInContext(getGuidedReviewRuntimeScript(), sandbox);

  return {
    document,
    root: document.querySelector('[data-guided-review="true"]'),
    panels,
    prev,
    next,
    firstCheckbox: document.querySelector("#checklist-a1-a1-m4-item-0"),
    nav
  };
}

test("guided checklist: valid JSON parses to guided_review mode", () => {
  const model = guidedMaterial(guidedPayload());
  assert.equal(model.bodyFormat, "json");
  assert.equal(model.checklist.mode, "guided_review");
  assert.equal(model.checklist.guidedCriteria.length, 3);
  assert.equal(model.checklist.criteria.length, 3);
  assert.equal(
    model.checklist.guidedCriteria[0].confirmationLabel,
    "My response now meets this criterion"
  );
  assert.ok(model.checklist.guidedCriteria[0].id);
  assert.equal(model.checklist.guidedCriteria[0].features.length, 2);
});

test("guided checklist: max five criteria enforced", () => {
  const criteria = [];
  for (let i = 0; i < 6; i += 1) {
    criteria.push({
      statement: "Have you checked criterion " + (i + 1) + "?",
      why_it_matters: "Dimension " + (i + 1),
      features: [{ expected: "Feature " + (i + 1), repair: "Repair " + (i + 1) }]
    });
  }
  const parsed = guided.parseGuidedChecklist({ review_mode: "guided_criteria", criteria });
  assert.equal(parsed.ok, true);
  assert.equal(parsed.model.guidedCriteria.length, 5);
  assert.ok(parsed.diagnostics.some((row) => row.code === "GUIDED_CHECKLIST_TRUNCATED"));
});

test("guided checklist: incomplete criteria degrade without inventing guidance", () => {
  const model = guidedMaterial({
    review_mode: "guided_criteria",
    criteria: [
      { statement: "Only a statement, no features" },
      {
        statement: "Have you included evidence?",
        features: [{ expected: "A cited detail", repair: "Add one cited detail." }]
      }
    ]
  });
  assert.equal(model.checklist.mode, "simple");
  assert.deepEqual(model.checklist.criteria, [
    "Only a statement, no features",
    "Have you included evidence?"
  ]);
  assert.equal(model.checklist.guidedCriteria, null);
});

test("guided checklist: markdown bodies remain simple mode", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M4",
      material_type: "checklist",
      title: "Concept Self-Check",
      body_format: "markdown",
      body:
        "- Have you explained residual variance?\n- Have you distinguished the two terms?\n\nIf any answer is No, revise before continuing."
    },
    0
  );
  assert.equal(model.checklist.mode, "simple");
  assert.equal(model.checklist.guidedCriteria, null);
  assert.equal(model.checklist.criteria.length, 2);
  assert.match(model.checklist.revisionInstruction, /revise before continuing/i);
});

test("guided checklist: JSON inside markdown body is not auto-detected", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M4",
      material_type: "checklist",
      title: "Mixed",
      body_format: "markdown",
      body: JSON.stringify(guidedPayload())
    },
    0
  );
  assert.equal(model.checklist.mode, "simple");
  assert.equal(model.checklist.guidedCriteria, null);
});

test("guided checklist: renderer emits one-at-a-time shell with all panels in DOM", () => {
  const html = renderMaterial(guidedMaterial(guidedPayload()), { activityId: "A1" });
  assert.match(html, /data-guided-review="true"/);
  assert.match(html, /Review your answer/);
  assert.match(html, /Criterion 1 of 3/);
  assert.match(html, /Criterion 2 of 3/);
  assert.match(html, /Criterion 3 of 3/);
  assert.match(html, /Why this matters/);
  assert.match(html, /What to look for/);
  assert.match(html, /If something is missing/);
  assert.match(html, /My response now meets this criterion/);
  assert.match(html, /util-guided-review__nav" hidden/);
  assert.match(html, /data-guided-review-nav/);
  assert.match(html, /data-checklist-item-id="checklist-a1-a1-m4-item-0"/);
  assert.match(html, /data-workspace-kind="checklist_entry"/);
  assert.doesNotMatch(html, /<h[456]\b/);
});

test("guided checklist: progressive enhancement one-at-a-time with nav focus and checkbox persistence", () => {
  const harness = createGuidedReviewHarness();
  const root = harness.root;
  assert.ok(root);
  assert.equal(root.getAttribute("data-guided-review-enhanced"), "true");

  const panels = harness.panels;
  assert.equal(panels.length, 3);
  assert.equal(panels[0].hidden, false);
  assert.equal(panels[1].hidden, true);
  assert.equal(panels[2].hidden, true);
  assert.equal(panels[1].hasAttribute("inert"), true);

  assert.equal(harness.nav.hidden, false);
  assert.equal(harness.prev.disabled, true);
  assert.equal(harness.next.disabled, false);

  harness.firstCheckbox.checked = true;

  harness.next.focus();
  harness.next.click();
  assert.equal(harness.document.activeElement, harness.next);
  assert.equal(panels[0].hidden, true);
  assert.equal(panels[1].hidden, false);
  assert.match(
    harness.document.querySelector("[data-guided-review-status]").textContent,
    /Criterion 2 of 3/
  );
  assert.equal(harness.firstCheckbox.checked, true);

  harness.next.click();
  assert.equal(harness.next.disabled, true);
  assert.equal(panels[2].hidden, false);

  harness.prev.focus();
  harness.prev.click();
  assert.equal(harness.document.activeElement, harness.prev);
  assert.equal(harness.firstCheckbox.checked, true);
});

test("guided checklist: simple markdown checklist rendering unchanged", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M4",
      material_type: "checklist",
      title: "Concept Self-Check",
      body_format: "markdown",
      body: "- Have you explained residual variance?\n- Have you distinguished the two terms?"
    },
    0
  );
  const html = renderMaterial(model, { activityId: "A1" });
  assert.match(html, /<fieldset class="util-interactive-checklist"/);
  assert.doesNotMatch(html, /data-guided-review="true"/);
  assert.match(html, /Have you explained residual variance\?/);
});

test("guided checklist: page render injects guided-review runtime", () => {
  const material = guidedMaterial(guidedPayload());
  const checkMoment = {
    kind: "check",
    items: [{ kind: "material", material: material }],
    workspaces: []
  };
  const html = renderPage(
    {
      title: "Guided review page",
      header: { description: "", durationMinutes: null },
      orientationSections: [],
      activities: [
        {
          id: "A1",
          title: "Genome mapping",
          durationMinutes: null,
          grouping: "",
          mappedOutcomes: [],
          preamble: "",
          reasoningOrientation: "",
          beats: [],
          compositionMoments: null
        }
      ],
      assessment: { items: [] },
      studyTips: ""
    },
    {
      compositionMode: "moments",
      activityComposition: {
        A1: {
          orientMoment: null,
          learnMoment: null,
          doMoment: null,
          checkMoment: checkMoment,
          renderPath: "moments",
          omitBeatFunctions: [],
          suppressBeatContent: {},
          suppressFraming: true
        }
      }
    }
  );

  assert.match(html, /data-guided-review="true"/);
  assert.match(html, /data-guided-review-active/);
  assert.match(html, /Previous criterion/);
  assert.doesNotMatch(html, /<h[456]\b/);
});

"use strict";

/**
 * S81-T-008 — R4 revision-pass criterion accompaniment.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");
const {
  getRevisionCriterionRuntimeScript
} = require("../lib/learner-renderer-vnext/revision-criterion-runtime");
const revisionAccompaniment = require("../lib/learner-renderer-vnext/revision-criterion-accompaniment");
const { buildMaterialModel } = require("../lib/learner-renderer-vnext/parse-material");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");

const repoRoot = path.resolve(__dirname, "..");
const heteroPath = path.join(
  repoRoot,
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
);
const kitchenPath = path.join(
  repoRoot,
  "tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json"
);

function render(fixturePath) {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  return renderLearnerPageHtml(page, { compositionMode: "moments" });
}

function guidedChecklistMaterial() {
  return buildMaterialModel(
    {
      material_id: "A1-M4",
      material_type: "checklist",
      title: "Review",
      body_format: "json",
      body: {
        review_mode: "guided_criteria",
        criteria: [
          {
            id: "crit-a",
            statement: "Does the response name residual variance?",
            why_it_matters: "Variance language is the concept hinge.",
            features: [
              { expected: "Mentions residual variance", repair: "Add residual variance wording." }
            ]
          },
          {
            id: "crit-b",
            statement: "Does the response avoid the residual-presence myth?",
            why_it_matters: "Prevents a common misconception.",
            features: [
              { expected: "States residuals alone are not enough", repair: "Clarify the misconception." }
            ]
          }
        ]
      }
    },
    0
  );
}

test("markup helpers: guidance host id pairs with activity slug", () => {
  assert.equal(
    revisionAccompaniment.revisionGuidanceId("A1"),
    "learner-revision-guidance-a1"
  );
});

test("hetero: revise actions, Check→Task, no Task→Check shortcut, no schema markers", () => {
  const result = render(heteroPath);
  const html = result.html;

  assert.match(html, /Revise with this criterion/);
  assert.match(html, /data-revise-with-criterion="true"/);
  assert.match(html, /data-revision-guidance="true"/);
  assert.match(html, /Hide guidance/);
  assert.match(html, /Prism does not mark or score your answer/);
  assert.match(html, /data-revision-reminder="true"/);
  assert.match(html, /Revising against/);
  assert.match(html, /View guidance/);
  assert.match(html, /Back to your task \(/);
  assert.doesNotMatch(html, /Check your response \(/);
  assert.match(html, /href="#learner-task-a1"/);
  assert.match(html, /id="learner-task-a1"/);
  assert.match(html, /id="learner-check-a1"/);

  const reviseCount = (html.match(/Revise with this criterion/g) || []).length;
  const hostCount = (html.match(/id="learner-revision-guidance-[a-z0-9-]+"/g) || [])
    .map((m) => m.replace(/^id="|"$/g, ""))
    .filter((id) => !id.endsWith("-heading")).length;
  const taskLandmarks = (html.match(/id="(learner-task-[a-z0-9-]+)"/g) || [])
    .map((m) => m.replace(/^id="|"$/g, ""))
    .filter((id) => !id.endsWith("-heading"));
  assert.ok(reviseCount >= 8, "expected revise actions across activities, got " + reviseCount);
  assert.ok(hostCount >= 2, "expected per-activity guidance hosts, got " + hostCount);
  assert.equal(hostCount, taskLandmarks.length, "one guidance host per Task landmark");

  assert.doesNotMatch(html, /covers_response_material_ids|diagnostic_review/);
  assert.ok(
    html.indexOf("data-revise-with-criterion") >= 0 && html.indexOf("<script>") >= 0,
    "revision PE script expected when revise controls present"
  );
});

test("kitchen sink: table activities get revise + Task guidance host", () => {
  const html = render(kitchenPath).html;
  assert.match(html, /data-workspace-kind="table_entry"/);
  assert.match(html, /data-revise-with-criterion="true"/);
  assert.match(html, /data-revision-guidance="true"/);
  assert.match(html, /id="learner-task-/);
});

test("guided checklist: revise action carries criterion id and full guidance sources", () => {
  const material = guidedChecklistMaterial();
  const html = renderMaterial(material, {
    activityId: "A1",
    revisionAccompaniment: true
  });
  assert.match(html, /data-guided-review="true"/);
  assert.match(html, /data-revision-criterion-id="crit-a"/);
  assert.match(html, /data-revision-criterion-id="crit-b"/);
  assert.match(
    html,
    /data-revision-criterion-id="crit-a"[\s\S]*?Revise with this criterion/
  );
  assert.match(html, /Why this matters/);
  assert.match(html, /What to look for/);
  assert.match(html, /If something is missing/);
});

test("runtime: reminder stays hidden while guidance in view; appears after scroll-past; View guidance; hide clears both", () => {
  const listeners = Object.create(null);
  const windowListeners = Object.create(null);

  function makeEl(tag, attrs) {
    const el = {
      tagName: String(tag || "div").toUpperCase(),
      attributes: Object.assign({}, attrs || {}),
      children: [],
      parentNode: null,
      hidden: Object.prototype.hasOwnProperty.call(attrs || {}, "hidden"),
      innerHTML: "",
      textContent: "",
      _rect: { top: 0, bottom: 100, left: 0, right: 100 },
      getBoundingClientRect() {
        return this._rect;
      },
      scrollIntoView() {
        this._scrolledIntoView = true;
        this._rect = { top: 10, bottom: 120, left: 0, right: 100 };
      },
      getAttribute(name) {
        if (name === "hidden") return this.hidden ? "" : null;
        return Object.prototype.hasOwnProperty.call(this.attributes, name)
          ? this.attributes[name]
          : null;
      },
      setAttribute(name, value) {
        if (name === "hidden") {
          this.hidden = true;
          return;
        }
        this.attributes[name] = String(value);
      },
      removeAttribute(name) {
        if (name === "hidden") {
          this.hidden = false;
          return;
        }
        delete this.attributes[name];
      },
      hasAttribute(name) {
        if (name === "hidden") return this.hidden;
        return Object.prototype.hasOwnProperty.call(this.attributes, name);
      },
      matches(sel) {
        if (sel.indexOf("[data-revise-with-criterion]") >= 0) {
          return this.hasAttribute("data-revise-with-criterion");
        }
        if (sel.indexOf("[data-revision-guidance-hide]") >= 0) {
          return this.hasAttribute("data-revision-guidance-hide");
        }
        if (sel.indexOf("[data-revision-reminder-view]") >= 0) {
          return this.hasAttribute("data-revision-reminder-view");
        }
        if (sel.indexOf('[data-revision-guidance="true"]') >= 0) {
          return this.getAttribute("data-revision-guidance") === "true";
        }
        if (sel.indexOf('[data-revision-reminder="true"]') >= 0) {
          return this.getAttribute("data-revision-reminder") === "true";
        }
        if (sel.indexOf('[data-composition-moment="do"]') >= 0) {
          return this.getAttribute("data-composition-moment") === "do";
        }
        if (sel.indexOf("[data-revision-criterion-root]") >= 0) {
          return this.hasAttribute("data-revision-criterion-root");
        }
        return false;
      },
      closest(sel) {
        let node = this;
        while (node) {
          if (node.matches(sel)) return node;
          node = node.parentNode;
        }
        return null;
      },
      querySelector(sel) {
        return queryAll(this, sel)[0] || null;
      },
      querySelectorAll(sel) {
        return queryAll(this, sel);
      },
      focus() {
        document.activeElement = this;
      }
    };
    return el;
  }

  function queryAll(root, sel) {
    const out = [];
    function walk(node) {
      if (!node) return;
      if (node.matches && node.matches(sel)) out.push(node);
      if (sel.indexOf("[data-revision-guidance-body]") >= 0 && node.hasAttribute("data-revision-guidance-body")) {
        if (out.indexOf(node) < 0) out.push(node);
      }
      if (sel.indexOf("[data-revision-reminder-statement]") >= 0 && node.hasAttribute("data-revision-reminder-statement")) {
        if (out.indexOf(node) < 0) out.push(node);
      }
      if (sel.indexOf(".util-revision-guidance__heading") >= 0 && node.attributes.class === "util-revision-guidance__heading") {
        if (out.indexOf(node) < 0) out.push(node);
      }
      if (sel.indexOf(".util-composition-moment-heading") >= 0 && node.attributes.class === "util-composition-moment-heading") {
        if (out.indexOf(node) < 0) out.push(node);
      }
      if (sel.indexOf(".util-interactive-checklist__label") >= 0 && node.attributes.class === "util-interactive-checklist__label") {
        if (out.indexOf(node) < 0) out.push(node);
      }
      if (
        sel.indexOf('[data-composition-moment="do"][data-activity-id=') >= 0 &&
        node.getAttribute("data-composition-moment") === "do"
      ) {
        const m = /data-activity-id="([^"]*)"/.exec(sel);
        if (m && node.getAttribute("data-activity-id") === m[1] && out.indexOf(node) < 0) {
          out.push(node);
        }
      }
      if (
        sel.indexOf('[data-composition-moment="do"][data-active-revision-criterion-id]') >= 0 &&
        node.getAttribute("data-composition-moment") === "do" &&
        node.getAttribute("data-active-revision-criterion-id")
      ) {
        if (out.indexOf(node) < 0) out.push(node);
      }
      if (
        sel.indexOf('[data-revision-guidance="true"]') >= 0 &&
        node.getAttribute("data-revision-guidance") === "true" &&
        out.indexOf(node) < 0
      ) {
        out.push(node);
      }
      if (
        sel.indexOf('[data-revision-reminder="true"]') >= 0 &&
        node.getAttribute("data-revision-reminder") === "true" &&
        out.indexOf(node) < 0
      ) {
        out.push(node);
      }
      (node.children || []).forEach(walk);
    }
    walk(root);
    return out;
  }

  const document = {
    readyState: "complete",
    activeElement: null,
    documentElement: { clientHeight: 800 },
    location: { hash: "" },
    addEventListener(type, fn) {
      if (!listeners[type]) listeners[type] = [];
      listeners[type].push(fn);
    },
    querySelector(sel) {
      return queryAll(pageRoot, sel)[0] || null;
    },
    querySelectorAll(sel) {
      return queryAll(pageRoot, sel);
    }
  };

  const pageRoot = makeEl("main", {});
  const taskA1 = makeEl("section", {
    "data-composition-moment": "do",
    "data-activity-id": "A1",
    id: "learner-task-a1"
  });
  const taskHeading = makeEl("h3", {
    class: "util-composition-moment-heading",
    id: "learner-task-a1-heading",
    tabindex: "-1"
  });
  const reminder = makeEl("div", {
    "data-revision-reminder": "true",
    "data-activity-id": "A1",
    id: "learner-revision-reminder-a1",
    hidden: ""
  });
  reminder.hidden = true;
  const reminderStmt = makeEl("p", { "data-revision-reminder-statement": "" });
  const viewBtn = makeEl("button", { "data-revision-reminder-view": "" });
  const guidance = makeEl("aside", {
    "data-revision-guidance": "true",
    "data-activity-id": "A1",
    id: "learner-revision-guidance-a1",
    hidden: ""
  });
  guidance.hidden = true;
  guidance._rect = { top: 40, bottom: 200, left: 0, right: 400 };
  const guidanceHeading = makeEl("h4", {
    class: "util-revision-guidance__heading",
    id: "learner-revision-guidance-a1-heading",
    tabindex: "-1"
  });
  const hideBtn = makeEl("button", { "data-revision-guidance-hide": "" });
  const guidanceBody = makeEl("div", { "data-revision-guidance-body": "" });
  const workspace = makeEl("textarea", { id: "learner-workspace-a1-demo" });
  workspace.value = "draft stays";

  const checkItem0 = makeEl("div", {
    "data-revision-criterion-root": "",
    "data-revision-criterion-id": "c0"
  });
  const label0 = makeEl("label", { class: "util-interactive-checklist__label" });
  label0.innerHTML = "Criterion zero text";
  const checkbox0 = makeEl("input", { type: "checkbox", "data-checklist-item-id": "c0" });
  checkbox0.checked = true;
  const revise0 = makeEl("a", {
    "data-revise-with-criterion": "true",
    "data-activity-id": "A1",
    "data-revision-criterion-id": "c0",
    href: "#learner-task-a1"
  });
  const checkItem1 = makeEl("div", {
    "data-revision-criterion-root": "",
    "data-revision-criterion-id": "c1"
  });
  const label1 = makeEl("label", { class: "util-interactive-checklist__label" });
  label1.innerHTML = "Criterion one text";
  const revise1 = makeEl("a", {
    "data-revise-with-criterion": "true",
    "data-activity-id": "A1",
    "data-revision-criterion-id": "c1",
    href: "#learner-task-a1"
  });

  const taskA2 = makeEl("section", {
    "data-composition-moment": "do",
    "data-activity-id": "A2",
    id: "learner-task-a2"
  });
  const reminderA2 = makeEl("div", {
    "data-revision-reminder": "true",
    "data-activity-id": "A2",
    hidden: ""
  });
  reminderA2.hidden = true;
  const guidanceA2 = makeEl("aside", {
    "data-revision-guidance": "true",
    "data-activity-id": "A2",
    hidden: ""
  });
  guidanceA2.hidden = true;

  function attach(parent, child) {
    child.parentNode = parent;
    parent.children.push(child);
  }

  attach(taskA1, taskHeading);
  attach(reminder, reminderStmt);
  attach(reminder, viewBtn);
  attach(taskA1, reminder);
  attach(guidance, guidanceHeading);
  attach(guidance, hideBtn);
  attach(guidance, guidanceBody);
  attach(taskA1, guidance);
  attach(taskA1, workspace);
  attach(checkItem0, checkbox0);
  attach(checkItem0, label0);
  attach(checkItem0, revise0);
  attach(checkItem1, label1);
  attach(checkItem1, revise1);
  attach(taskA2, reminderA2);
  attach(taskA2, guidanceA2);
  attach(pageRoot, taskA1);
  attach(pageRoot, checkItem0);
  attach(pageRoot, checkItem1);
  attach(pageRoot, taskA2);

  [taskHeading, guidanceHeading, label0, label1].forEach(function (el) {
    const prev = el.matches.bind(el);
    el.matches = function (sel) {
      if (sel === ".util-revision-guidance__heading") {
        return this.attributes.class === "util-revision-guidance__heading";
      }
      if (sel === ".util-composition-moment-heading") {
        return this.attributes.class === "util-composition-moment-heading";
      }
      if (sel === ".util-interactive-checklist__label") {
        return this.attributes.class === "util-interactive-checklist__label";
      }
      return prev(sel);
    };
  });

  assert.equal(reminder.hidden, true, "reminder absent before revision");

  const sandbox = {
    document,
    window: {
      innerHeight: 800,
      getComputedStyle() {
        return { overflowY: "visible" };
      },
      addEventListener(type, fn) {
        if (!windowListeners[type]) windowListeners[type] = [];
        windowListeners[type].push(fn);
      }
    },
    Array,
    Number,
    String,
    Math,
    Boolean,
    console,
    WeakMap,
    history: {
      pushState: function (_s, _t, href) {
        document.location.hash = String(href || "").replace(/^#/, "");
      }
    },
    location: document.location,
    setTimeout: function (fn) {
      fn();
    }
  };
  vm.createContext(sandbox);
  vm.runInContext(getRevisionCriterionRuntimeScript(), sandbox);

  function click(el) {
    (listeners.click || []).forEach(function (fn) {
      fn({ target: el, preventDefault: function () {} });
    });
  }
  function fireScroll() {
    (windowListeners.scroll || []).forEach(function (fn) {
      fn();
    });
  }

  click(revise0);
  assert.equal(guidance.hidden, false);
  assert.equal(reminder.hidden, true, "compact reminder absent while full guidance in view");
  assert.equal(reminder.getAttribute("data-revision-reminder-active"), null);
  assert.match(guidanceBody.innerHTML, /Criterion zero text/);
  assert.match(reminderStmt.innerHTML, /Criterion zero text/);
  assert.equal(checkbox0.checked, true);
  assert.equal(workspace.value, "draft stays");
  assert.equal(reminderA2.hidden, true);

  guidance._rect = { top: -180, bottom: -20, left: 0, right: 400 };
  taskA1._rect = { top: -40, bottom: 900, left: 0, right: 400 };
  fireScroll();
  assert.equal(reminder.hidden, false, "compact reminder appears after scrolling past guidance");
  assert.equal(reminder.getAttribute("data-revision-reminder-active"), "true");
  assert.match(reminderStmt.innerHTML, /Criterion zero text/);
  assert.equal(reminderA2.hidden, true, "other activity reminder stays hidden");

  click(revise1);
  assert.match(guidanceBody.innerHTML, /Criterion one text/);
  assert.match(reminderStmt.innerHTML, /Criterion one text/);
  guidance._rect = { top: -180, bottom: -20, left: 0, right: 400 };
  taskA1._rect = { top: -40, bottom: 900, left: 0, right: 400 };
  fireScroll();
  assert.equal(reminder.hidden, false);
  assert.equal(reminder.getAttribute("data-revision-reminder-active"), "true");

  click(viewBtn);
  assert.equal(guidance._scrolledIntoView, true);
  assert.equal(document.activeElement, guidanceHeading);
  assert.equal(reminder.hidden, true, "View guidance hides compact reminder while full panel in view");
  assert.equal(reminder.getAttribute("data-revision-reminder-active"), null);

  guidance._rect = { top: -180, bottom: -20, left: 0, right: 400 };
  taskA1._rect = { top: -40, bottom: 900, left: 0, right: 400 };
  fireScroll();
  assert.equal(reminder.hidden, false);
  assert.equal(reminder.getAttribute("data-revision-reminder-active"), "true");

  click(hideBtn);
  assert.equal(guidance.hidden, true);
  assert.equal(reminder.hidden, true);
  assert.equal(reminder.getAttribute("data-revision-reminder-active"), null);
  assert.equal(taskA1.getAttribute("data-active-revision-criterion-id"), null);
  assert.equal(guidanceBody.innerHTML, "");
  assert.equal(reminderStmt.innerHTML, "");
  assert.equal(checkbox0.checked, true);
  assert.equal(workspace.value, "draft stays");
});

test("rendered page embeds reminder PE CSS for static/export preview", () => {
  const html = render(heteroPath).html;
  assert.match(html, /id="prism-revision-reminder-css"/);
  assert.match(html, /data-revision-reminder-active/);
  assert.match(html, /position:fixed/);
  assert.match(
    html,
    /top:var\(--learner-sticky-nav-height,0px\)/
  );
  assert.match(
    html,
    /\.util-revision-reminder\[data-revision-reminder-active="true"\]\{[^}]*z-index:40/
  );
});

test("reminder CSS sits below shell sticky-nav token; nav stays higher z-index in export shell", () => {
  const css = revisionAccompaniment.getRevisionReminderPresentationCss();
  assert.match(css, /top:var\(--learner-sticky-nav-height,0px\)/);
  assert.match(css, /z-index:40/);
  assert.doesNotMatch(css, /top:0;/);
});

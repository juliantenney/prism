/**
 * Sprint 91 — Learning Journey My Workflows parent/child presentation + navigation.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const hierarchy = require("../lib/learning-journey-workflow-hierarchy.js");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function lj(id, name) {
  return {
    id: id,
    name: name || id,
    product: "learning_journey",
    steps: [{ id: "s1", title: "Design Page", canonical_step_id: "step_design_page" }],
    updatedAt: 100
  };
}

function child(id, name, sourceWorkflowId, sourceCommissionId, product) {
  return {
    id: id,
    name: name,
    product: product || "interactive",
    sourceWorkflowId: sourceWorkflowId,
    sourceCommissionId: sourceCommissionId,
    steps: [{ id: "c1", title: "Design Page" }],
    updatedAt: 200
  };
}

function createElementStub(tagName) {
  const tag = String(tagName || "div").toUpperCase();
  const el = {
    tagName: tag,
    value: "",
    textContent: "",
    className: "",
    checked: false,
    disabled: false,
    children: [],
    parentNode: null,
    style: {},
    dataset: {},
    _attrs: {},
    _listeners: {},
    _hiddenClass: false,
    classList: {
      add(name) {
        if (name === "hidden") el._hiddenClass = true;
        const parts = String(el.className || "")
          .split(/\s+/)
          .filter(Boolean);
        if (parts.indexOf(name) === -1) parts.push(name);
        el.className = parts.join(" ");
      },
      remove(name) {
        if (name === "hidden") el._hiddenClass = false;
        el.className = String(el.className || "")
          .split(/\s+/)
          .filter((part) => part && part !== name)
          .join(" ");
      },
      contains(name) {
        if (name === "hidden") return !!el._hiddenClass;
        return (
          String(el.className || "")
            .split(/\s+/)
            .indexOf(name) !== -1
        );
      },
      toggle(name) {
        if (el.classList.contains(name)) {
          el.classList.remove(name);
          return false;
        }
        el.classList.add(name);
        return true;
      }
    },
    appendChild(node) {
      this.children.push(node);
      node.parentNode = this;
      return node;
    },
    removeChild(node) {
      const idx = this.children.indexOf(node);
      if (idx >= 0) this.children.splice(idx, 1);
      return node;
    },
    querySelector(selector) {
      const all = this.querySelectorAll(selector);
      return all.length ? all[0] : null;
    },
    querySelectorAll(selector) {
      const out = [];
      const walk = (node) => {
        (node.children || []).forEach((childNode) => {
          if (matchesStubSelector(childNode, selector)) out.push(childNode);
          walk(childNode);
        });
      };
      walk(this);
      return out;
    },
    addEventListener(type, fn) {
      this._listeners[type] = this._listeners[type] || [];
      this._listeners[type].push(fn);
    },
    removeEventListener() {},
    setAttribute(name, value) {
      this._attrs[name] = String(value);
    },
    removeAttribute(name) {
      delete this._attrs[name];
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this._attrs, name)
        ? this._attrs[name]
        : null;
    },
    focus() {},
    select() {},
    click() {
      const handlers = this._listeners.click || [];
      handlers.forEach((fn) => fn({ target: this, preventDefault() {}, stopPropagation() {} }));
    },
    set innerHTML(value) {
      void value;
      this.children = [];
      this.textContent = "";
    },
    get innerHTML() {
      return "";
    }
  };
  return el;
}

function matchesStubSelector(node, selector) {
  const sel = String(selector || "").trim();
  if (!sel) return false;
  if (sel.charAt(0) === ".") {
    return node.classList.contains(sel.slice(1));
  }
  if (sel.charAt(0) === "[") {
    const match = sel.match(/^\[([^=\]]+)(?:=["']?([^"'\]]+)["']?)?\]$/);
    if (!match) return false;
    const attr = match[1];
    const expected = match[2];
    const actual = node.getAttribute(attr);
    if (expected == null) return actual != null;
    return actual === expected;
  }
  return false;
}

function collectWorkflowListIds(workflowList) {
  return workflowList
    .querySelectorAll(".workflow-item")
    .map((el) => el.getAttribute("data-workflow-id"));
}

function bootHierarchyHarness() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const workflowList = createElementStub("div");
  const workflowSourceJourneyNav = createElementStub("div");
  workflowSourceJourneyNav.classList.add("hidden");
  const workflowBackToSourceJourneyBtn = createElementStub("button");
  workflowBackToSourceJourneyBtn.textContent = "← Back to Journey";
  const workflowDetail = createElementStub("section");
  workflowDetail.classList.add("run-mode");
  const workflowModeRunBtn = createElementStub("button");
  workflowModeRunBtn.classList.add("active");
  const workflowModeEditBtn = createElementStub("button");
  const workflowModeSettingsBtn = createElementStub("button");

  [
    ["workflowList", workflowList],
    ["workflowSourceJourneyNav", workflowSourceJourneyNav],
    ["workflowBackToSourceJourneyBtn", workflowBackToSourceJourneyBtn],
    ["workflowDetail", workflowDetail],
    ["workflowModeRunBtn", workflowModeRunBtn],
    ["workflowModeEditBtn", workflowModeEditBtn],
    ["workflowModeSettingsBtn", workflowModeSettingsBtn],
    ["workflowSteps", createElementStub("ul")],
    ["workflowName", createElementStub("input")],
    ["workflowLibraryTags", createElementStub("input")],
    ["workflowLibraryNotes", createElementStub("textarea")],
    ["workflowArtefacts", createElementStub("textarea")],
    ["workflowOutputs", createElementStub("textarea")],
    ["workflowStartingArtefact", createElementStub("input")],
    ["workflowAudience", createElementStub("input")],
    ["workflowGoal", createElementStub("input")],
    ["workflowConstraints", createElementStub("textarea")],
    ["exportWorkflowBtn", createElementStub("button")],
    ["workflowModeSettingsBadge", createElementStub("span")],
    ["workflowValidationPanel", createElementStub("div")],
    ["workflowMetaCreated", createElementStub("span")],
    ["workflowMetaUpdated", createElementStub("span")],
    ["deleteWorkflowBtn", createElementStub("button")],
    ["duplicateWorkflowBtn", createElementStub("button")],
    ["renameWorkflowBtn", createElementStub("button")],
    ["clearWorkflowRunDataBtn", createElementStub("button")],
    ["toastContainer", createElementStub("div")],
    ["apiKeyStatus", createElementStub("span")],
    ["workflowRunStatus", createElementStub("div")],
    ["workflowPrevStepBtn", createElementStub("button")],
    ["workflowNextStepBtn", createElementStub("button")],
    ["workflowRunCopyBtn", createElementStub("button")],
    ["workflowContinueToAuthoringBtn", createElementStub("button")],
    ["workflowsTab", createElementStub("button")],
    ["workflowsPanel", createElementStub("section")]
  ].forEach(([id, el]) => elementStore.set(id, el));

  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: (tag) => createElementStub(tag),
    getElementById(id) {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };

  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: {
      debounce: (fn) => fn,
      formatDate: () => "today"
    },
    localStorage: {
      getItem() {
        return null;
      },
      setItem() {}
    },
    URL: {
      createObjectURL() {
        return "blob:test";
      },
      revokeObjectURL() {}
    },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries() {
        return Promise.resolve({ added: 0, updated: 0, skipped: 0 });
      },
      getAllPrompts() {
        return Promise.resolve([]);
      }
    },
    crypto: {
      randomUUID() {
        return "00000000-0000-4000-8000-000000000099";
      }
    }
  };

  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);

  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-workflow-hierarchy.js"
    ]),
    { skipLearnerRendererVNextInject: true }
  );

  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  if (!api) {
    throw new Error("Expected window.__PRISM_TEST_API after loading app.js");
  }

  return {
    api,
    workflowList,
    workflowSourceJourneyNav,
    workflowBackToSourceJourneyBtn,
    document: documentStub,
    window: windowStub
  };
}

test("commissioned constituents nest beneath Learning Journey and are not top-level", () => {
  const workflows = [
    lj("wf-lj", "LJTest"),
    child("wf-c1", "Challenge Your First Impression", "wf-lj", "c1", "interactive"),
    child("wf-c2", "Build a Better Basis for Judgement", "wf-lj", "c2", "expository"),
    { id: "wf-other", name: "Unrelated Workshop", product: "interactive", steps: [], updatedAt: 50 }
  ];
  const built = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {});
  assert.equal(built.rows.length, 2);
  assert.equal(built.rows[0].type, "lj_parent");
  assert.equal(built.rows[0].workflow.id, "wf-lj");
  assert.equal(built.rows[0].hasChildren, true);
  assert.equal(built.rows[0].expanded, true);
  assert.equal(built.rows[0].children.length, 2);
  assert.equal(built.rows[0].children[0].id, "wf-c1");
  assert.equal(built.rows[0].children[1].id, "wf-c2");
  assert.equal(built.rows[1].type, "standalone");
  assert.equal(built.rows[1].workflow.id, "wf-other");
  assert.equal(built.childWorkflowIds["wf-c1"], "wf-lj");
  assert.equal(built.childWorkflowIds["wf-c2"], "wf-lj");
  assert.match(built.orderingNote, /sourceCommissionId/);
});

test("children from two Learning Journeys do not cross-group", () => {
  const workflows = [
    lj("wf-lj-a", "Journey A"),
    lj("wf-lj-b", "Journey B"),
    child("wf-a1", "A child", "wf-lj-a", "c1"),
    child("wf-b1", "B child", "wf-lj-b", "c9")
  ];
  const built = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {});
  const a = built.rows.find((r) => r.workflow.id === "wf-lj-a");
  const b = built.rows.find((r) => r.workflow.id === "wf-lj-b");
  assert.equal(a.children.map((c) => c.id).join(","), "wf-a1");
  assert.equal(b.children.map((c) => c.id).join(","), "wf-b1");
});

test("disclosure collapsed hides children in presentation model", () => {
  const workflows = [lj("wf-lj", "LJTest"), child("wf-c1", "Child", "wf-lj", "c1")];
  const built = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {
    expandedById: { "wf-lj": false }
  });
  assert.equal(built.rows[0].expanded, false);
  assert.equal(built.rows[0].children.length, 1);
  assert.equal(hierarchy.isLearningJourneyListExpanded({ "wf-lj": false }, "wf-lj"), false);
  const next = hierarchy.setLearningJourneyListExpanded({}, "wf-lj", true);
  assert.equal(next["wf-lj"], true);
});

test("missing sourceWorkflowId and invalid/non-LJ parents stay top-level", () => {
  const workflows = [
    { id: "wf-plain", name: "Plain", product: "interactive", steps: [] },
    child("wf-orphan", "Orphan", "missing-parent", "c1"),
    {
      id: "wf-interactive-parent",
      name: "Not a Journey",
      product: "interactive",
      steps: []
    },
    child("wf-bad-parent", "Bad parented", "wf-interactive-parent", "c2"),
    lj("wf-lj", "LJTest")
  ];
  const built = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {});
  const topIds = built.rows.map((r) => r.workflow.id);
  assert.ok(topIds.includes("wf-plain"));
  assert.ok(topIds.includes("wf-orphan"));
  assert.ok(topIds.includes("wf-bad-parent"));
  assert.ok(topIds.includes("wf-interactive-parent"));
  assert.ok(topIds.includes("wf-lj"));
  assert.equal(Object.keys(built.childWorkflowIds).length, 0);
});

test("no parent.children[] relationship is required", () => {
  const parent = lj("wf-lj", "LJTest");
  assert.equal(parent.children, undefined);
  const built = hierarchy.buildLearningJourneyWorkflowListRows(
    [parent, child("wf-c1", "Child", "wf-lj", "c1")],
    [parent, child("wf-c1", "Child", "wf-lj", "c1")],
    {}
  );
  assert.equal(built.rows[0].children.length, 1);
  assert.equal(parent.children, undefined);
});

test("My Workflows DOM nests children; disclosure toggles; Back to Journey selects parent", () => {
  const {
    api,
    workflowList,
    workflowSourceJourneyNav,
    workflowBackToSourceJourneyBtn
  } = bootHierarchyHarness();

  const workflows = [
    lj("wf-lj", "LJTest"),
    child("wf-c1", "Challenge Your First Impression", "wf-lj", "c1", "interactive"),
    child("wf-c2", "Build a Better Basis for Judgement", "wf-lj", "c2", "expository"),
    { id: "wf-other", name: "Unrelated", product: "interactive", steps: [], updatedAt: 1 }
  ];
  api.setWorkflowsForTest(workflows);
  api.renderWorkflowListForTest({ skipDefaultSelection: true });

  assert.deepEqual(collectWorkflowListIds(workflowList), [
    "wf-lj",
    "wf-c1",
    "wf-c2",
    "wf-other"
  ]);
  assert.equal(
    workflowList.querySelector('[data-workflow-id="wf-c1"]').getAttribute("data-workflow-list-role"),
    "lj_child"
  );
  assert.equal(
    workflowList
      .querySelector('[data-workflow-id="wf-other"]')
      .getAttribute("data-workflow-list-role"),
    "standalone"
  );

  const disclosure = workflowList.querySelector('[data-lj-disclosure-id="wf-lj"]');
  assert.ok(disclosure);
  assert.equal(disclosure.getAttribute("aria-expanded"), "true");

  // Toggle via the same click path My Workflows uses.
  api.setLearningJourneyListExpandedForParentForTest("wf-lj", false);
  api.renderWorkflowListForTest({ skipDefaultSelection: true });
  assert.deepEqual(collectWorkflowListIds(workflowList), ["wf-lj", "wf-other"]);
  assert.equal(api.getLearningJourneyListExpandedByIdForTest()["wf-lj"], false);

  api.setLearningJourneyListExpandedForParentForTest("wf-lj", true);
  api.renderWorkflowListForTest({ skipDefaultSelection: true });
  assert.ok(workflowList.querySelector('[data-workflow-id="wf-c2"]'));

  api.selectWorkflowForTest("wf-c2");
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-c2");
  assert.equal(workflowSourceJourneyNav.classList.contains("hidden"), false);
  assert.match(workflowBackToSourceJourneyBtn.textContent, /Back to LJTest/);

  api.setLearningJourneyListExpandedForParentForTest("wf-lj", false);
  api.renderWorkflowListForTest({ skipDefaultSelection: true });
  const opened = api.handleBackToSourceLearningJourneyForTest();
  assert.equal(opened.ok, true);
  assert.equal(opened.workflowId, "wf-lj");
  assert.equal(opened.destination, "workflows_run");
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-lj");
  assert.equal(api.getLearningJourneyListExpandedByIdForTest()["wf-lj"], true);
});

test("Preview Open expands parent and selects ordinary child", () => {
  const { api, workflowList } = bootHierarchyHarness();
  api.setWorkflowsForTest([
    lj("wf-lj", "LJTest"),
    child("wf-c2", "Build a Better Basis for Judgement", "wf-lj", "c2", "expository")
  ]);
  api.setSelectedWorkflowIdForTest("wf-lj");
  api.setLearningJourneyListExpandedForParentForTest("wf-lj", false);
  const opened = api.handleLearningJourneyPreviewOpenProductActionForTest({
    workflowId: "wf-c2",
    commissionId: "c2",
    sourceWorkflowId: "wf-lj",
    productId: "expository"
  });
  assert.equal(opened.ok, true);
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-c2");
  assert.equal(api.getLearningJourneyListExpandedByIdForTest()["wf-lj"], true);
  api.renderWorkflowListForTest({ skipDefaultSelection: true });
  const childRow = workflowList.querySelector('[data-workflow-id="wf-c2"]');
  assert.ok(childRow);
  assert.equal(childRow.getAttribute("data-lj-parent-id"), "wf-lj");
});

test("ordinary workflow list behaviour remains intact without LJ parents", () => {
  const { api, workflowList } = bootHierarchyHarness();
  api.setWorkflowsForTest([
    { id: "a", name: "Alpha", product: "interactive", steps: [], updatedAt: 2 },
    { id: "b", name: "Beta", product: "interactive", steps: [], updatedAt: 1 }
  ]);
  api.renderWorkflowListForTest({ skipDefaultSelection: true });
  assert.deepEqual(collectWorkflowListIds(workflowList), ["a", "b"]);
  assert.equal(workflowList.querySelectorAll("[data-lj-disclosure-id]").length, 0);
});

test("resolveSourceLearningJourneyForWorkflow rejects non-LJ and missing parents", () => {
  const workflows = [
    lj("wf-lj", "LJTest"),
    { id: "wf-ix", name: "Interactive parent", product: "interactive", steps: [] },
    child("wf-ok", "Ok", "wf-lj", "c1"),
    child("wf-bad", "Bad", "wf-ix", "c2"),
    child("wf-miss", "Miss", "gone", "c3")
  ];
  assert.equal(
    hierarchy.resolveSourceLearningJourneyForWorkflow(
      child("wf-ok", "Ok", "wf-lj", "c1"),
      workflows
    ).ok,
    true
  );
  assert.equal(
    hierarchy.resolveSourceLearningJourneyForWorkflow(
      child("wf-bad", "Bad", "wf-ix", "c2"),
      workflows
    ).ok,
    false
  );
  assert.equal(
    hierarchy.resolveSourceLearningJourneyForWorkflow(
      child("wf-miss", "Miss", "gone", "c3"),
      workflows
    ).ok,
    false
  );
});

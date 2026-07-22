"use strict";

/**
 * Sprint 68 — S68-IMP-018 generic ordering learner surface.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const {
  buildPageModel,
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");
const {
  composeDoMoment,
  composeCheckMoment,
  composeOrientMoment,
  composeLearnMoment
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
const { resolveWorkspaceList } = require("../lib/learner-renderer-vnext/render-composed-moment");
const normalizeOrdering = require("../lib/learner-renderer-vnext/normalize-ordering");
const {
  validateExactOrder,
  getOrderingRuntimeScript
} = require("../lib/learner-renderer-vnext/ordering-runtime");
const { renderOrderingWorkspace } = require("../lib/learner-renderer-vnext/render-ordering-workspace");
const { buildOrderingWorkspaceModel } = require("../lib/learner-renderer-vnext/build-ordering-workspace-model");
const {
  collectResponseParts
} = require("../lib/learner-renderer-vnext/compose-response-parts");
const {
  workspaceFromResponsePart
} = require("../lib/learner-renderer-vnext/learner-surface-registry");
const audit = require("../lib/learner-renderer-vnext/audit-learner-surfaces");
const types = require("../lib/learner-renderer-vnext/response-part-types");
const {
  loadLearnerRendererVNextBrowserInSandbox,
  wireBrowserGlobalThis
} = require("./prism-vm-lib-bootstrap.js");

const orderingFixture = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "prism-authoritative-ordering-page.json"
);
const sequencingSourceFixture = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "sequencing-rollout-learner-page.json"
);
const heteroFixture = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const rnaFixture = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "rna-hcv-assembled-vnext-materials-page.json"
);
const browserBundlePath = path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js");

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function orderingActivity() {
  const page = loadJson(orderingFixture);
  const model = buildPageModel(page).model;
  const activity = model.activities.find((entry) => entry.id === "A1");
  assert.ok(activity);
  return { page, model, activity, source: page.activities[0] };
}

function doWorkspaces(activity) {
  const moment = composeDoMoment(activity);
  return resolveWorkspaceList(moment);
}

function extractOrderingItemIds(html) {
  const ids = [];
  const re = /data-ordering-item-id="([^"]+)"/g;
  let match;
  while ((match = re.exec(html))) ids.push(match[1]);
  return ids;
}

function extractOrderingContents(html) {
  const contents = [];
  const re =
    /<div class="util-ordering-item__content">([\s\S]*?)<\/div>/g;
  let match;
  while ((match = re.exec(html))) {
    contents.push(match[1].replace(/<[^>]+>/g, "").trim());
  }
  return contents;
}

/**
 * Minimal DOM enough to exercise ordering runtime move/check behaviour.
 */
function createOrderingDomHarness(htmlFragment) {
  function parseAttrs(tag) {
    const attrs = Object.create(null);
    const re = /([a-zA-Z0-9:_-]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g;
    let match;
    while ((match = re.exec(tag))) {
      attrs[match[1]] = match[2] != null ? match[2] : match[3] != null ? match[3] : "";
    }
    return attrs;
  }

  function createNode(tagName) {
    const node = {
      tagName: String(tagName || "").toUpperCase(),
      className: "",
      classList: {
        _classes: Object.create(null),
        contains: function (name) {
          return Boolean(this._classes[name]);
        },
        add: function (name) {
          this._classes[name] = true;
          node.className = Object.keys(this._classes).join(" ");
        }
      },
      attributes: Object.create(null),
      children: [],
      parentNode: null,
      textContent: "",
      hidden: false,
      disabled: false,
      focused: false,
      offsetWidth: 1,
      getAttribute: function (name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name)
          ? this.attributes[name]
          : null;
      },
      setAttribute: function (name, value) {
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
      closest: function (selector) {
        let current = this;
        while (current) {
          if (matches(current, selector)) return current;
          current = current.parentNode;
        }
        return null;
      },
      querySelector: function (selector) {
        return queryAll(this, selector)[0] || null;
      },
      querySelectorAll: function (selector) {
        return queryAll(this, selector);
      },
      focus: function () {
        this.focused = true;
      }
    };
    Object.defineProperty(node, "previousElementSibling", {
      get: function () {
        if (!this.parentNode) return null;
        const siblings = this.parentNode.children;
        const index = siblings.indexOf(this);
        return index > 0 ? siblings[index - 1] : null;
      }
    });
    Object.defineProperty(node, "nextElementSibling", {
      get: function () {
        if (!this.parentNode) return null;
        const siblings = this.parentNode.children;
        const index = siblings.indexOf(this);
        return index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
      }
    });
    return node;
  }

  function matches(node, selector) {
    if (!node || !selector) return false;
    var rest = String(selector).trim();
    var tagMatch = rest.match(/^([a-zA-Z0-9:-]+)/);
    if (tagMatch && !rest.startsWith(".") && !rest.startsWith("[")) {
      if (node.tagName !== tagMatch[1].toUpperCase()) return false;
      rest = rest.slice(tagMatch[1].length);
    }
    while (rest.length) {
      if (rest[0] === ".") {
        var cls = rest.slice(1).match(/^[a-zA-Z0-9_-]+/);
        if (!cls || !node.classList.contains(cls[0])) return false;
        rest = rest.slice(1 + cls[0].length);
        continue;
      }
      if (rest[0] === "[") {
        var attr = rest.match(/^\[([^=\]]+)(?:=\"([^\"]*)\")?\]/);
        if (!attr) return false;
        var value = node.getAttribute(attr[1]);
        if (attr[2] == null) {
          if (value == null) return false;
        } else if (value !== attr[2]) {
          return false;
        }
        rest = rest.slice(attr[0].length);
        continue;
      }
      return false;
    }
    return true;
  }

  function queryAll(root, selector) {
    const parts = String(selector)
      .split(/\s+/)
      .filter(Boolean);
    let current = [root];
    parts.forEach((part) => {
      const next = [];
      current.forEach((node) => {
        walk(node, (child) => {
          if (child !== node && matches(child, part)) next.push(child);
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

  function appendChild(parent, child) {
    child.parentNode = parent;
    parent.children.push(child);
  }

  function insertBefore(parent, newNode, referenceNode) {
    const index = parent.children.indexOf(referenceNode);
    if (newNode.parentNode) {
      const from = newNode.parentNode.children;
      const fromIndex = from.indexOf(newNode);
      if (fromIndex >= 0) from.splice(fromIndex, 1);
    }
    newNode.parentNode = parent;
    if (index < 0) parent.children.push(newNode);
    else parent.children.splice(index, 0, newNode);
  }

  function parseFragment(html) {
    const root = createNode("div");
    const stack = [root];
    const tokenRe = /<!--[\s\S]*?-->|<script\b[^>]*>([\s\S]*?)<\/script>|<(\/?)([a-zA-Z0-9:-]+)([^>]*)>|([^<]+)/g;
    let match;
    while ((match = tokenRe.exec(html))) {
      if (match[1] != null && match[2] == null && match[3] == null) {
        const script = createNode("script");
        script.textContent = match[1];
        const openTag = match[0].match(/^<script\b([^>]*)>/i);
        if (openTag) {
          const attrs = parseAttrs(openTag[1] || "");
          Object.keys(attrs).forEach((key) => script.setAttribute(key, attrs[key]));
        }
        appendChild(stack[stack.length - 1], script);
        continue;
      }
      if (match[5] != null) {
        const parent = stack[stack.length - 1];
        parent.textContent += match[5];
        continue;
      }
      const closing = Boolean(match[2]);
      const tag = String(match[3] || "").toLowerCase();
      const attrText = match[4] || "";
      if (closing) {
        if (stack.length > 1) stack.pop();
        continue;
      }
      const node = createNode(tag);
      const attrs = parseAttrs(attrText);
      Object.keys(attrs).forEach((key) => {
        if (key === "disabled") node.disabled = true;
        if (key === "hidden") node.hidden = true;
        node.setAttribute(key, attrs[key] === "" && key !== "class" ? "" : attrs[key]);
      });
      if (attrs.class) node.setAttribute("class", attrs.class);
      appendChild(stack[stack.length - 1], node);
      const voidTags = { br: 1, img: 1, input: 1, meta: 1, link: 1 };
      if (!voidTags[tag] && !/\/\s*$/.test(attrText)) stack.push(node);
    }

    root.insertBefore = function (newNode, referenceNode) {
      insertBefore(root, newNode, referenceNode);
    };
    walk(root, (node) => {
      node.insertBefore = function (newNode, referenceNode) {
        insertBefore(node, newNode, referenceNode);
      };
    });
    return root;
  }

  const documentRoot = parseFragment(htmlFragment);
  const listeners = [];
  const document = {
    readyState: "complete",
    body: documentRoot,
    querySelector: function (selector) {
      return documentRoot.querySelector(selector);
    },
    querySelectorAll: function (selector) {
      return documentRoot.querySelectorAll(selector);
    },
    addEventListener: function (type, handler) {
      listeners.push({ type: type, handler: handler });
    },
    __prismOrderingBound: false
  };

  const sandbox = {
    document: document,
    window: {},
    console: console
  };
  vm.runInNewContext(getOrderingRuntimeScript(), sandbox);
  sandbox.window.PRISM_ORDERING_RUNTIME.init(document);

  function click(selector) {
    const btn = document.querySelector(selector);
    assert.ok(btn, "missing button " + selector);
    const event = {
      target: {
        closest: function (sel) {
          return btn.closest(sel);
        }
      }
    };
    listeners
      .filter((entry) => entry.type === "click")
      .forEach((entry) => entry.handler(event));
    return btn;
  }

  return {
    document: document,
    click: click,
    orderIds: function () {
      return Array.from(
        document.querySelectorAll('[data-ordering-list] .util-ordering-item')
      ).map((item) => item.getAttribute("data-ordering-item-id"));
    },
    statusText: function () {
      const status = document.querySelector("[data-ordering-status]");
      return status ? status.textContent : "";
    },
    feedback: function () {
      const node = document.querySelector("[data-ordering-feedback]");
      return node
        ? {
            text: node.textContent,
            state: node.getAttribute("data-ordering-state"),
            hidden: Boolean(node.hidden)
          }
        : null;
    }
  };
}

test("1 fixture: authoritative PRISM ordering fixture loads", () => {
  const page = loadJson(orderingFixture);
  assert.equal(page.activities[0].activity_interaction_type, "sequencing");
  assert.ok(Array.isArray(page.activities[0].ordering.canonical_order));
  const built = buildPageModel(page);
  assert.equal(built.ok, true);
  assert.ok(!built.error);
});

test("2 provenance: ordering fixture documents sequencing-rollout source", () => {
  const page = loadJson(orderingFixture);
  const source = loadJson(sequencingSourceFixture);
  assert.match(String(page.metadata.provenance || ""), /sequencing-rollout-learner-page\.json/);
  assert.deepEqual(
    page.activities[0].ordering.canonical_order,
    source.sections[0].content[0].ordering.canonical_order
  );
  assert.deepEqual(
    page.activities[0].ordering.learner_display_order,
    source.sections[0].content[0].ordering.learner_display_order
  );
});

test("3 recognised ordering material produces surfaceKind ordering", () => {
  const { activity } = orderingActivity();
  const workspaces = doWorkspaces(activity);
  assert.equal(workspaces.length, 1);
  assert.equal(workspaces[0].capability, "ordering");
  assert.equal(workspaces[0].kind, "ordering");
});

test("4 explicit reorder semantics produce an ordering response part", () => {
  const { activity } = orderingActivity();
  const moment = composeDoMoment(activity);
  const collected = collectResponseParts({
    activityId: activity.id,
    momentKind: "do",
    items: moment.items,
    taskSteps: moment.taskSteps,
    expectedOutput: moment.expectedOutput,
    modelActivity: activity
  });
  const orderingParts = collected.parts.filter(
    (part) => part.surfaceKind === types.SURFACE_KIND.ORDERING
  );
  assert.equal(orderingParts.length, 1);
  assert.equal(orderingParts[0].sourceKind, types.SOURCE_KIND.ORDERING);
});

test("5 sequenced prose alone does not produce ordering", () => {
  const result = normalizeOrdering.normalizeOrderingSemantics({
    learner_task:
      "1. Trace entry, translation, replication, and assembly in order.\n2. Complete the analysis table."
  });
  assert.equal(result.ok, false);
});

test("6 numbered table rows do not produce ordering", () => {
  const result = normalizeOrdering.normalizeOrderingSemantics({
    learner_task: "Complete the numbered rows in the table.",
    materials: [{ material_type: "analysis_table", body: "| # | Step |\n|---|---|\n| 1 | A |\n| 2 | B |" }]
  });
  assert.equal(result.ok, false);
});

test("7 fixed-order process tables remain table_entry", () => {
  const result = audit.runLearnerSurfaceAudit({ repoRoot: repoRoot });
  const a2 = result.records.find(function (record) {
    return record.fixtureId === "videotranscripttest" && record.activityId === "A2";
  });
  assert.ok(a2);
  assert.deepEqual(a2.currentSurface, ["table_entry"]);
  assert.equal(a2.orderingAudit.orderingJustified, false);
  assert.equal(a2.currentSurface.indexOf("ordering"), -1);
});

test("8 at least two ordering items are required", () => {
  const result = normalizeOrdering.normalizeOrderingSemantics({
    activity_interaction_type: "sequencing",
    ordering: { canonical_order: ["Only one"] }
  });
  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some((row) => row.code === "ORDERING_ITEMS_MISSING"));
});

test("9 item IDs are unique", () => {
  const result = normalizeOrdering.normalizeOrderingSemantics({
    activity_interaction_type: "sequencing",
    ordering: {
      canonical_order: [
        { item_id: "same", content: "A" },
        { item_id: "same", content: "B" }
      ]
    }
  });
  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some((row) => row.code === "DUPLICATE_ORDERING_ITEM_ID"));
});

test("10 duplicate visible item text is allowed when IDs differ", () => {
  const result = normalizeOrdering.normalizeOrderingSemantics({
    activity_interaction_type: "sequencing",
    ordering: {
      canonical_order: [
        { item_id: "a1", content: "Same text" },
        { item_id: "a2", content: "Same text" }
      ]
    }
  });
  assert.equal(result.ok, true);
  assert.equal(result.model.items[0].content, result.model.items[1].content);
  assert.notEqual(result.model.items[0].itemId, result.model.items[1].itemId);
});

test("11 source item order is preserved in the semantic model", () => {
  const result = normalizeOrdering.normalizeOrderingSemantics({
    activity_interaction_type: "sequencing",
    ordering: {
      canonical_order: ["Event A", "Event B", "Event C"],
      learner_display_order: ["Event C", "Event A", "Event B"]
    }
  });
  assert.deepEqual(
    result.model.items.map((item) => item.content),
    ["Event A", "Event B", "Event C"]
  );
  assert.equal(result.model.items[0].authoredIndex, 0);
});

test("12 expected order is represented by item IDs", () => {
  const result = normalizeOrdering.normalizeOrderingSemantics({
    activity_interaction_type: "sequencing",
    ordering: {
      canonical_order: ["Event A", "Event B", "Event C"],
      learner_display_order: ["Event C", "Event A", "Event B"]
    }
  });
  assert.equal(result.model.validationMode, "exact_order");
  assert.deepEqual(
    result.model.expectedOrder,
    result.model.items.map((item) => item.itemId)
  );
});

test("13 malformed expected order is rejected", () => {
  const result = normalizeOrdering.normalizeOrderingSemantics({
    activity_interaction_type: "sequencing",
    ordering: {
      items: [
        { item_id: "a", content: "A" },
        { item_id: "b", content: "B" }
      ],
      expected_order: ["a", "missing"]
    }
  });
  assert.equal(result.ok, false);
  assert.ok(
    result.diagnostics.some(
      (row) =>
        row.code === "INVALID_EXPECTED_ORDER" || row.code === "EXPECTED_ORDER_ITEM_MISMATCH"
    )
  );
});

test("14 missing expected order supports unvalidated ordering", () => {
  const result = normalizeOrdering.normalizeOrderingSemantics({
    activity_interaction_type: "ranking",
    ordering: {
      items: [
        { item_id: "a", content: "A" },
        { item_id: "b", content: "B" }
      ]
    }
  });
  assert.equal(result.ok, true);
  assert.equal(result.model.validationMode, "none");
  assert.deepEqual(result.model.expectedOrder, []);
});

test("15 ordering workspace is placed in Do", () => {
  const { activity } = orderingActivity();
  const doMoment = composeDoMoment(activity);
  assert.ok(doMoment);
  assert.equal(doMoment.kind, "do");
  assert.equal(resolveWorkspaceList(doMoment).length, 1);
});

test("16 ordering workspace appears exactly once", () => {
  const { page } = orderingActivity();
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null);
  const matches = rendered.html.match(/data-workspace-kind="ordering"/g) || [];
  assert.equal(matches.length, 1);
});

test("17 ordering material assignment remains exactly once", () => {
  const { activity } = orderingActivity();
  const doMoment = composeDoMoment(activity);
  const checkMoment = composeCheckMoment(activity);
  const learnMoment = composeLearnMoment(activity);
  const all = []
    .concat(resolveWorkspaceList(doMoment))
    .concat(resolveWorkspaceList(checkMoment))
    .concat(resolveWorkspaceList(learnMoment));
  assert.equal(all.filter((workspace) => workspace.capability === "ordering").length, 1);
});

test("18 task-step assignment remains exactly once for reorder step", () => {
  const { activity } = orderingActivity();
  const doMoment = composeDoMoment(activity);
  const checkMoment = composeCheckMoment(activity);
  const doTexts = (doMoment.taskSteps || []).map((step) => step.text);
  const checkTexts = (checkMoment.taskSteps || []).map((step) => step.text);
  const reorder = /put these in order/i;
  const doHits = doTexts.filter((text) => reorder.test(text)).length;
  const checkHits = checkTexts.filter((text) => reorder.test(text)).length;
  assert.equal(doHits, 1);
  assert.equal(checkHits, 0);
});

test("19 expected-output assignment remains exactly once", () => {
  const { activity } = orderingActivity();
  const doMoment = composeDoMoment(activity);
  const checkMoment = composeCheckMoment(activity);
  const assigned = [doMoment, checkMoment].filter((moment) => moment && moment.expectedOutput);
  assert.equal(assigned.length, 1);
});

test("20 initial presentation does not reveal exact answer", () => {
  const { activity } = orderingActivity();
  const workspace = doWorkspaces(activity)[0];
  const initial = workspace.items.map((item) => item.content);
  assert.deepEqual(initial, ["Event C", "Event A", "Event B"]);
  assert.notDeepEqual(
    workspace.items.map((item) => item.itemId),
    workspace.validation.expectedOrder
  );
});

test("21 deterministic shuffle is stable", () => {
  const source = {
    activity_id: "SEED-A",
    activity_interaction_type: "sequencing",
    ordering: {
      canonical_order: ["One", "Two", "Three", "Four"],
      learner_display_order_strategy: "deterministic_shuffle",
      shuffle_seed_key: "stable-seed"
    }
  };
  const first = normalizeOrdering.normalizeOrderingSemantics(source, {
    activityId: "SEED-A",
    seedKey: "stable-seed"
  });
  const second = normalizeOrdering.normalizeOrderingSemantics(source, {
    activityId: "SEED-A",
    seedKey: "stable-seed"
  });
  assert.deepEqual(
    first.model.initialItems.map((item) => item.itemId),
    second.model.initialItems.map((item) => item.itemId)
  );
  assert.notDeepEqual(
    first.model.initialItems.map((item) => item.itemId),
    first.model.expectedOrder
  );
});

test("22 deterministic shuffle is identical in browser and Node", () => {
  const page = loadJson(orderingFixture);
  const nodeHtml = renderLearnerPageHtml(page).html;
  const sandbox = { console: console };
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  const browserHtml = sandbox.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(page).html;
  assert.deepEqual(extractOrderingItemIds(nodeHtml), extractOrderingItemIds(browserHtml));
  assert.deepEqual(extractOrderingContents(nodeHtml), extractOrderingContents(browserHtml));
});

test("23-29 Move up/down, ends, live region, and focus behaviour", () => {
  const { page } = orderingActivity();
  const html = renderLearnerPageHtml(page).html;
  const section = html.match(
    /<div class="util-learner-workspace util-ordering-workspace[\s\S]*?<\/div>\s*(?=<section|<\/section|<h2|$)/
  );
  assert.ok(section);
  const harness = createOrderingDomHarness(section[0]);
  const initial = harness.orderIds();
  assert.equal(initial.length, 3);

  const firstUp = harness.document.querySelector(
    '.util-ordering-item[data-position="1"] .util-ordering-item__move--up'
  );
  const lastDown = harness.document.querySelector(
    '.util-ordering-item[data-position="3"] .util-ordering-item__move--down'
  );
  assert.equal(firstUp.disabled, true);
  assert.equal(lastDown.disabled, true);

  harness.click(
    '.util-ordering-item[data-ordering-item-id="' +
      initial[1] +
      '"] .util-ordering-item__move--up'
  );
  const afterUp = harness.orderIds();
  assert.deepEqual(afterUp, [initial[1], initial[0], initial[2]]);
  assert.match(harness.statusText(), /Moved ".+" to position 1 of 3\./);

  harness.click(
    '.util-ordering-item[data-ordering-item-id="' +
      afterUp[0] +
      '"] .util-ordering-item__move--down'
  );
  const afterDown = harness.orderIds();
  assert.deepEqual(afterDown, [initial[0], initial[1], initial[2]]);
  assert.match(harness.statusText(), /Moved ".+" to position 2 of 3\./);

  const moved = harness.document.querySelector(
    '.util-ordering-item[data-ordering-item-id="' + afterDown[1] + '"]'
  );
  const focusedControl = moved.querySelector(".util-ordering-item__move--down");
  assert.equal(focusedControl.focused, true);
  assert.equal(moved.getAttribute("data-position"), "2");
  assert.equal(
    moved.querySelector(".util-ordering-item__move--up").disabled,
    false
  );
});

test("30 multiple ordering workspaces operate independently", () => {
  const partA = {
    responsePartId: "A1::ordering::ordering",
    surfaceKind: "ordering",
    label: "Sequence A",
    prompt: "Order A",
    ordering: {
      mode: "sequence",
      validationMode: "exact_order",
      expectedOrder: ["a1", "a2"],
      items: [
        { itemId: "a1", content: "A1", authoredIndex: 0, accessibleLabel: "A1" },
        { itemId: "a2", content: "A2", authoredIndex: 1, accessibleLabel: "A2" }
      ],
      initialItems: [
        { itemId: "a2", content: "A2", authoredIndex: 1, accessibleLabel: "A2" },
        { itemId: "a1", content: "A1", authoredIndex: 0, accessibleLabel: "A1" }
      ]
    }
  };
  const partB = {
    responsePartId: "B1::ordering::ordering",
    surfaceKind: "ordering",
    label: "Sequence B",
    prompt: "Order B",
    ordering: {
      mode: "sequence",
      validationMode: "exact_order",
      expectedOrder: ["b1", "b2"],
      items: [
        { itemId: "b1", content: "B1", authoredIndex: 0, accessibleLabel: "B1" },
        { itemId: "b2", content: "B2", authoredIndex: 1, accessibleLabel: "B2" }
      ],
      initialItems: [
        { itemId: "b1", content: "B1", authoredIndex: 0, accessibleLabel: "B1" },
        { itemId: "b2", content: "B2", authoredIndex: 1, accessibleLabel: "B2" }
      ]
    }
  };
  const wsA = buildOrderingWorkspaceModel(partA, { activityId: "A1" }).workspace;
  const wsB = buildOrderingWorkspaceModel(partB, { activityId: "B1" }).workspace;
  const html = renderOrderingWorkspace(wsA) + renderOrderingWorkspace(wsB);
  const harness = createOrderingDomHarness(html);
  const beforeB = harness.document
    .querySelectorAll('.util-ordering-workspace[data-workspace-id="' + wsB.workspaceId + '"] .util-ordering-item')
    .map((item) => item.getAttribute("data-ordering-item-id"));
  harness.click(
    '.util-ordering-workspace[data-workspace-id="' +
      wsA.workspaceId +
      '"] .util-ordering-item[data-ordering-item-id="a1"] .util-ordering-item__move--up'
  );
  const afterB = harness.document
    .querySelectorAll('.util-ordering-workspace[data-workspace-id="' + wsB.workspaceId + '"] .util-ordering-item')
    .map((item) => item.getAttribute("data-ordering-item-id"));
  assert.deepEqual(afterB, beforeB);
});

test("31 exact-order validation identifies correct order", () => {
  assert.deepEqual(validateExactOrder(["a", "b", "c"], ["a", "b", "c"]), {
    ok: true,
    state: "correct"
  });
});

test("32 exact-order validation identifies incorrect order", () => {
  assert.deepEqual(validateExactOrder(["c", "a", "b"], ["a", "b", "c"]), {
    ok: false,
    state: "incorrect"
  });
});

test("33 validation compares item IDs, not text", () => {
  const result = normalizeOrdering.normalizeOrderingSemantics({
    activity_interaction_type: "sequencing",
    ordering: {
      canonical_order: [
        { item_id: "id-a", content: "Visible A" },
        { item_id: "id-b", content: "Visible B" }
      ]
    }
  });
  assert.deepEqual(result.model.expectedOrder, ["id-a", "id-b"]);
  assert.equal(
    validateExactOrder(["id-b", "id-a"], result.model.expectedOrder).ok,
    false
  );
  assert.equal(
    validateExactOrder(["id-a", "id-b"], result.model.expectedOrder).ok,
    true
  );
});

test("34 expected order is not exposed in learner-facing DOM attributes", () => {
  const { page } = orderingActivity();
  const html = renderLearnerPageHtml(page).html;
  assert.doesNotMatch(html, /data-expected-order=/);
  assert.doesNotMatch(html, /data-canonical-order=/);
  assert.match(html, /class="util-ordering-expected" hidden/);
});

test("35 no drag interaction is required for keyboard completion", () => {
  const { page } = orderingActivity();
  const html = renderLearnerPageHtml(page).html;
  assert.doesNotMatch(html, /draggable=/);
  assert.match(html, /Move up/);
  assert.match(html, /Move down/);
});

test("36 visible labels are authored or restrained generic labels", () => {
  const { activity } = orderingActivity();
  const workspace = doWorkspaces(activity)[0];
  assert.match(workspace.label, /Sequence the stages|Rank the options/);
  workspace.items.forEach((item) => {
    assert.match(item.content, /^Event [ABC]$/);
  });
});

test("37 internal IDs are not learner-visible as labels", () => {
  const { page } = orderingActivity();
  const html = renderLearnerPageHtml(page).html;
  assert.doesNotMatch(html, />item-\d+-event-[abc]</i);
  assert.match(html, />Event [ABC]</);
});

test("38 ordering mode can distinguish sequence from ranking", () => {
  const sequence = normalizeOrdering.normalizeOrderingSemantics({
    activity_interaction_type: "sequencing",
    ordering: { canonical_order: ["A", "B"] }
  });
  const rank = normalizeOrdering.normalizeOrderingSemantics({
    activity_interaction_type: "ranking",
    ordering: { items: ["A", "B"] }
  });
  assert.equal(sequence.model.mode, "sequence");
  assert.equal(rank.model.mode, "rank");
  assert.match(rank.model.label, /Rank/);
  const resolved = workspaceFromResponsePart({
    responsePartId: "rank-part",
    surfaceKind: types.SURFACE_KIND.ORDERING,
    label: rank.model.label,
    prompt: rank.model.prompt,
    ordering: rank.model
  }, { activityId: "R1" });
  assert.equal(resolved.ok, true);
  assert.equal(resolved.workspace.capability, "ordering");
});

test("39 text_entry rendering remains unchanged for heteroscedasticity A1", () => {
  const page = loadJson(heteroFixture);
  const html = renderLearnerPageHtml(page).html;
  assert.match(html, /data-workspace-capability="text_entry"/);
});

test("40 table_entry rendering remains unchanged for heteroscedasticity", () => {
  const page = loadJson(heteroFixture);
  const html = renderLearnerPageHtml(page).html;
  assert.match(html, /data-workspace-kind="table_entry"/);
});

test("41 IMP-017 multi-part text composition remains present", () => {
  const page = loadJson(heteroFixture);
  const model = buildPageModel(page).model;
  const a4 = model.activities.find((entry) => entry.id === "A4");
  if (!a4) return;
  const workspaces = resolveWorkspaceList(composeDoMoment(a4));
  assert.ok(workspaces.filter((workspace) => workspace.capability === "text_entry").length >= 1);
});

test("42 static markdown tables remain unchanged", () => {
  const page = loadJson(rnaFixture);
  const html = renderLearnerPageHtml(page).html;
  assert.match(html, /<table\b/);
});

test("43 browser and Node HTML remain equivalent for ordering fixture", () => {
  const page = loadJson(orderingFixture);
  const nodeHtml = renderLearnerPageHtml(page).html;
  const sandbox = { console: console };
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  const browserHtml = sandbox.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(page).html;
  assert.equal(
    nodeHtml.replace(/\s+/g, " ").trim(),
    browserHtml.replace(/\s+/g, " ").trim()
  );
});

test("44 audit identifies the authoritative ordering activity", () => {
  const result = audit.runLearnerSurfaceAudit({ repoRoot: repoRoot });
  const row = result.records.find(
    (record) => record.fixtureId === "authoritative-ordering" && record.activityId === "A1"
  );
  assert.ok(row);
  assert.deepEqual(row.currentSurface, ["ordering"]);
  assert.equal(row.adequacy, audit.ADEQUACY.FULLY_SUPPORTED);
  const matrix = result.capabilityMatrix.find((entry) => entry.capability === "ordering");
  assert.equal(matrix.currentStatus, "implemented");
  assert.ok(matrix.evidenceCount >= 1);
});

test("45 audit does not classify fixed sequence tables as ordering", () => {
  const result = audit.runLearnerSurfaceAudit({ repoRoot: repoRoot });
  const falsePositives = result.records.filter(function (record) {
    return (
      record.fixtureId !== "authoritative-ordering" &&
      record.currentSurface.indexOf("ordering") >= 0
    );
  });
  assert.equal(falsePositives.length, 0);
});

test("46 registry still rejects unknown future surfaces", () => {
  const resolved = workspaceFromResponsePart({
    surfaceKind: "matching",
    responsePartId: "x"
  });
  assert.equal(resolved.ok, false);
  assert.equal(resolved.diagnostic.code, types.DIAGNOSTIC.UNSUPPORTED_LEARNER_SURFACE);
});

test("47 audit corpus totals include ordering fixture", () => {
  const result = audit.runLearnerSurfaceAudit({ repoRoot: repoRoot });
  assert.equal(result.records.length, 25);
  assert.equal(result.adequacyTotals.fully_supported, 25);
  assert.equal(result.adequacyTotals.supported_imperfectly_represented || 0, 0);
  assert.equal(result.adequacyTotals.missing_capability || 0, 0);
  assert.equal(result.activitySurfaceUsage.ordering, 1);
});

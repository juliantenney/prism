/**
 * Sprint 75 — S75-D25: Create Proposed workflow is one read-only graph preview.
 * Retires Create Draft/Refined chrome and Create-time graph edit controls.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const styleCssPath = path.join(repoRoot, "style.css");

function createElementStub(tagName = "div") {
  const classSet = new Set();
  const attrs = Object.create(null);
  const children = [];
  const el = {
    tagName: String(tagName).toUpperCase(),
    value: "",
    disabled: false,
    hidden: false,
    innerHTML: "",
    textContent: "",
    children,
    classList: {
      add: (...names) => names.forEach((n) => classSet.add(String(n))),
      remove: (...names) => names.forEach((n) => classSet.delete(String(n))),
      contains: (name) => classSet.has(String(name)),
      toggle: (name, force) => {
        const key = String(name);
        if (force === true) {
          classSet.add(key);
          return true;
        }
        if (force === false) {
          classSet.delete(key);
          return false;
        }
        if (classSet.has(key)) {
          classSet.delete(key);
          return false;
        }
        classSet.add(key);
        return true;
      }
    },
    setAttribute: (k, v) => {
      attrs[String(k)] = String(v);
      if (String(k) === "hidden") el.hidden = true;
    },
    getAttribute: (k) =>
      Object.prototype.hasOwnProperty.call(attrs, String(k)) ? attrs[String(k)] : null,
    removeAttribute: (k) => {
      delete attrs[String(k)];
      if (String(k) === "hidden") el.hidden = false;
    },
    appendChild: (child) => {
      children.push(child);
      return child;
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {}
  };
  Object.defineProperty(el, "className", {
    get() {
      return Array.from(classSet).join(" ");
    },
    set(v) {
      classSet.clear();
      String(v || "")
        .split(/\s+/)
        .filter(Boolean)
        .forEach((n) => classSet.add(n));
    }
  });
  Object.defineProperty(el, "innerHTML", {
    get() {
      return el._innerHTML || "";
    },
    set(v) {
      el._innerHTML = String(v || "");
      if (!String(v || "").trim()) {
        children.length = 0;
      }
    }
  });
  return el;
}

function loadPrismWithDom() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const elementStore = new Map();
  const ensure = (id, tag) => {
    if (!elementStore.has(id)) elementStore.set(id, createElementStub(tag || "div"));
    return elementStore.get(id);
  };
  [
    ["wfDesignSummary", "p"],
    ["wfDesignProposedTableWrap", "div"],
    ["wfDesignSteps", "tbody"],
    ["wfDesignSaveBtn", "button"],
    ["wfDesignStatus", "span"],
    ["wfDesignIntent", "textarea"]
  ].forEach(([id, tag]) => ensure(id, tag));
  ensure("wfDesignProposedTableWrap").classList.add("hidden");
  ensure("wfDesignProposedTableWrap").setAttribute("hidden", "hidden");
  ensure("wfDesignSummary").classList.add("empty");
  ensure("wfDesignSaveBtn").disabled = true;

  const documentStub = {
    readyState: "loading",
    addEventListener: () => {},
    createElement: (tag) => createElementStub(tag),
    getElementById: (id) => ensure(id),
    querySelector: () => createElementStub("div"),
    querySelectorAll: () => []
  };
  const windowStub = {
    document: documentStub,
    Utils: { uuid: () => "test-uuid" },
    setTimeout,
    clearTimeout
  };
  documentStub.defaultView = windowStub;
  windowStub.window = windowStub;
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    document: documentStub,
    window: windowStub
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  api.cacheElements();
  return { api, ensure, source };
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const styleCss = fs.readFileSync(styleCssPath, "utf8");
const appSource = fs.readFileSync(appJsPath, "utf8");

test("A: No Workflow version selector in Create", () => {
  assert.doesNotMatch(indexHtml, /id="wfDesignVersionSelect"/);
  assert.doesNotMatch(indexHtml, /Workflow version/);
  assert.doesNotMatch(appSource, /getElementById\("wfDesignVersionSelect"\)/);
});

test("B: No user-facing Draft/Refined labels in Create proposed section", () => {
  const proposedIdx = indexHtml.indexOf(">Proposed workflow<");
  assert.ok(proposedIdx !== -1);
  const nextCard = indexHtml.indexOf('id="workflowsPanel"', proposedIdx);
  const slice = indexHtml.slice(proposedIdx, nextCard === -1 ? proposedIdx + 1200 : nextCard);
  assert.doesNotMatch(slice, /\bDraft\b/);
  assert.doesNotMatch(slice, /\bRefined\b/);
  assert.doesNotMatch(slice, /option value="draft"/);
  assert.doesNotMatch(slice, /option value="refined"/);
});

test("C–L: Proposed workflow markup, Save, and read-only render contract", () => {
  assert.match(indexHtml, />Proposed workflow</);
  assert.doesNotMatch(indexHtml, />Suggested workflow</);
  assert.match(indexHtml, /id="wfDesignSummary"/);
  assert.match(indexHtml, /id="wfDesignSteps"/);
  assert.match(indexHtml, /id="wfDesignSaveBtn"/);
  assert.match(indexHtml, />Save Workflow</);
  assert.match(indexHtml, /Workflow step/);
  assert.match(indexHtml, />Purpose</);
  assert.match(styleCss, /\.wf-proposed-workflow-table/);
  assert.match(styleCss, /table-layout:\s*fixed/);
  assert.match(styleCss, /\.wf-proposed-step-title[\s\S]*?width:\s*53%/);

  assert.match(appSource, /S75-D25/);
  assert.match(appSource, /function renderWorkflowDesignResult/);
  assert.doesNotMatch(appSource, /function updateWorkflowDesignStepField/);
  assert.doesNotMatch(appSource, /function deleteWorkflowDesignStep/);
  assert.doesNotMatch(appSource, /data-action", "delete-wf-step/);
  assert.doesNotMatch(appSource, /decorateWorkflowStepSettingsDiscoverability\([\s\S]{0,80}context:\s*"design"/);
  assert.match(appSource, /wf-proposed-step-title/);
  assert.match(appSource, /wf-proposed-step-purpose/);
  assert.match(appSource, /one proposed Create graph/);
  assert.doesNotMatch(appSource, /Store versions so users can compare draft vs refined/);
  assert.match(appSource, /state\.workflowDesignResult = parsed/);
  assert.match(appSource, /state\.workflowDesignVersions = null/);
  assert.match(appSource, /S75-D25: Save the single proposed Create graph/);
  assert.match(appSource, /var design = state\.workflowDesignResult \|\| null/);
});

test("M–P: Save handoff / Settings / Run / pack refinement retained", () => {
  assert.match(appSource, /function handleSaveDesignedWorkflow/);
  assert.match(appSource, /switchTab\("workflows"\)/);
  assert.match(appSource, /setWorkflowMode\("run"\)/);
  assert.match(appSource, /function decorateWorkflowStepSettingsDiscoverability/);
  assert.match(appSource, /isWorkflowStepConfigurableInSettings/);
  assert.match(appSource, /opts\.context === "design" \? "Tunable" : "Settings"/);
  assert.match(appSource, /post_generation_refinement/);
  assert.match(appSource, /stepRefinementProfiles/);
  assert.match(indexHtml, /id="promptVersionSelect"/);
  assert.match(indexHtml, /Displayed prompt version/);
});

test("Runtime: one graph rendered read-only in order with summary", () => {
  const { api, ensure } = loadPrismWithDom();
  const design = {
    summary: "Generate a self-study resource on ladybirds with a single activity.",
    steps: [
      { title: "Generate Learning Content", role: "Content generation" },
      { title: "Model Knowledge", role: "Knowledge modelling" },
      { title: "Define Learning Outcomes", role: "Outcome design" },
      { title: "Design Episode Plan", role: "Episode planning" }
    ]
  };
  api.setWorkflowDesignResultForTest(design);
  assert.equal(api.getSelectedWorkflowDesign(), design);
  api.renderWorkflowDesignResult({ promptRefine: false });

  const summary = ensure("wfDesignSummary");
  assert.equal(
    summary.textContent,
    "Generate a self-study resource on ladybirds with a single activity."
  );
  assert.equal(summary.classList.contains("empty"), false);

  const wrap = ensure("wfDesignProposedTableWrap");
  assert.equal(wrap.classList.contains("hidden"), false);

  const tbody = ensure("wfDesignSteps");
  assert.equal(tbody.children.length, 4);
  const titles = tbody.children.map((row) => {
    const titleCell = row.children.find((c) =>
      (c.className || "").includes("wf-proposed-step-title")
    );
    return titleCell ? titleCell.textContent : "";
  });
  assert.deepEqual(titles, [
    "Generate Learning Content",
    "Model Knowledge",
    "Define Learning Outcomes",
    "Design Episode Plan"
  ]);
  tbody.children.forEach((row) => {
    assert.equal(row.tagName, "TR");
    assert.equal(row.children.length, 3);
    const purpose = row.children.find((c) =>
      (c.className || "").includes("wf-proposed-step-purpose")
    );
    assert.ok(purpose && purpose.textContent);
    assert.equal(row.querySelector('[data-field="title"]'), null);
    assert.doesNotMatch(JSON.stringify(row), /Delete/);
    assert.doesNotMatch(JSON.stringify(row), /Tunable/);
    assert.doesNotMatch(JSON.stringify(row), /Editable in the Settings/);
  });
  assert.equal(ensure("wfDesignSaveBtn").disabled, false);
});

test("Q: D03 still protects pack refinement; version select not required", () => {
  assert.match(appSource, /post_generation_refinement/);
  assert.match(appSource, /stepRefinementProfiles/);
  assert.doesNotMatch(appSource, /function handleWorkflowReview/);
  assert.doesNotMatch(appSource, /function callOpenAIForWorkflowReview/);
  assert.doesNotMatch(indexHtml, /wfDesignReviewBtn/);
  assert.doesNotMatch(indexHtml, /id="wfDesignVersionSelect"/);
});

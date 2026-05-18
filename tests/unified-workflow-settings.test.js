/**
 * Sprint 22 Slice 22-1 / 22-1.1 — unified workflow Settings aggregation and sync.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractJsonBlockAfterHeading(md, heading) {
  const idx = md.indexOf(heading);
  assert.ok(idx !== -1, `LD pack should contain ${heading}`);
  const fence = md.indexOf("```json", idx);
  assert.ok(fence !== -1, `json fence after ${heading}`);
  const close = md.indexOf("```", fence + 7);
  assert.ok(close !== -1);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function loadLdWorkflowBriefConfig() {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const block = extractJsonBlockAfterHeading(md, "### Workflow Brief Config");
  return block.workflowBriefConfig;
}

function createElementStub(tagName = "div") {
  const attrs = {};
  const classSet = new Set();
  const el = {
    tagName: String(tagName).toUpperCase(),
    value: "",
    children: [],
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    setAttribute(name, value) {
      attrs[name] = String(value);
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null;
    },
    removeAttribute(name) {
      delete attrs[name];
    },
    hasAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attrs, name);
    },
    classList: {
      add: (...names) => names.forEach((n) => classSet.add(String(n))),
      remove: (...names) => names.forEach((n) => classSet.delete(String(n))),
      contains: (name) => classSet.has(String(name)),
      toggle: (name, force) => {
        const n = String(name);
        if (force === true) classSet.add(n);
        else if (force === false) classSet.delete(n);
        else if (classSet.has(n)) classSet.delete(n);
        else classSet.add(n);
      }
    },
    querySelector(selector) {
      const found = [];
      walkQuery(el, selector, found, false);
      return found[0] || null;
    },
    querySelectorAll(selector) {
      const found = [];
      walkQuery(el, selector, found, true);
      return found;
    },
    addEventListener: () => {},
    removeEventListener: () => {}
  };
  return el;
}

function elementMatches(el, selector) {
  const s = String(selector || "").trim();
  if (s === "[data-unified-step-id]") {
    return el.getAttribute && el.getAttribute("data-unified-step-id") != null;
  }
  if (s === '[data-unified-workflow-level="1"]') {
    return el.getAttribute && el.getAttribute("data-unified-workflow-level") === "1";
  }
  if (s === "[data-workflow-pack-param='1']") {
    return el.getAttribute && el.getAttribute("data-workflow-pack-param") === "1";
  }
  if (s === '[data-field="notes"]') {
    return el.getAttribute && el.getAttribute("data-field") === "notes";
  }
  if (s === ".workflow-step") {
    return el.classList && el.classList.contains("workflow-step");
  }
  return false;
}

function walkQuery(node, selector, found, collectAll) {
  if (!node || !node.children) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (elementMatches(child, selector)) {
      found.push(child);
      if (!collectAll) return;
    }
    walkQuery(child, selector, found, collectAll);
  }
}

function buildUnifiedSettingsDomTree() {
  const optionsRoot = createElementStub("div");
  const section = createElementStub("section");
  section.setAttribute("data-unified-step-id", "s1");
  const packInput = createElementStub("input");
  packInput.setAttribute("data-workflow-pack-param", "1");
  packInput.setAttribute("data-param-key", "tune_key");
  packInput.setAttribute("data-param-label", "Tune");
  packInput.value = "facilitator";
  section.appendChild(packInput);
  optionsRoot.appendChild(section);

  const workflowSteps = createElementStub("ol");
  const stepLi = createElementStub("li");
  stepLi.classList.add("workflow-step");
  stepLi.setAttribute("data-step-id", "s1");
  const notesArea = createElementStub("textarea");
  notesArea.setAttribute("data-field", "notes");
  notesArea.value = "[PRISM_STEP_PARAMS]\ntune_key=learner\n[/PRISM_STEP_PARAMS]";
  stepLi.appendChild(notesArea);
  workflowSteps.appendChild(stepLi);

  return { optionsRoot, workflowSteps, notesArea };
}

function buildUnifiedSettingsDomTreeWithWorkflowLevel() {
  const optionsRoot = createElementStub("div");
  const wfSection = createElementStub("section");
  wfSection.setAttribute("data-unified-workflow-level", "1");
  const wfInput = createElementStub("input");
  wfInput.setAttribute("data-workflow-pack-param", "1");
  wfInput.setAttribute("data-param-key", "delivery_context");
  wfInput.setAttribute("data-param-label", "Delivery context");
  wfInput.value = "online_sync";
  wfSection.appendChild(wfInput);
  optionsRoot.appendChild(wfSection);

  const workflowSteps = createElementStub("ol");
  const workflowLibraryNotes = createElementStub("textarea");
  workflowLibraryNotes.value = "Internal workflow notes";

  return { optionsRoot, workflowSteps, workflowLibraryNotes };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise
  };
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {}
  };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function loadPrismTestApiForUnifiedSettingsSync() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const { optionsRoot, workflowSteps, notesArea } = buildUnifiedSettingsDomTree();
  elementStore.set("unifiedWorkflowSettingsOptions", optionsRoot);
  elementStore.set("workflowSteps", workflowSteps);
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: (tagName) => createElementStub(tagName),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub("div"),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };

  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "test-uuid" },
    localStorage: { getItem: () => null, setItem: () => {} },
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, notesArea };
}

function loadPrismTestApiForUnifiedSettingsWorkflowSync() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const elementStore = new Map();
  const { optionsRoot, workflowSteps, workflowLibraryNotes } = buildUnifiedSettingsDomTreeWithWorkflowLevel();
  elementStore.set("unifiedWorkflowSettingsOptions", optionsRoot);
  elementStore.set("workflowSteps", workflowSteps);
  elementStore.set("workflowLibraryNotes", workflowLibraryNotes);
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: (tagName) => createElementStub(tagName),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub("div"),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "test-uuid" },
    localStorage: { getItem: () => null, setItem: () => {} },
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, workflowLibraryNotes };
}

const sampleWorkflow = {
  id: "wf-1",
  name: "LD pilot",
  steps: [
    {
      id: "s1",
      title: "Design Page",
      canonical_step_id: "step_design_page",
      notes: "[PRISM_STEP_PARAMS]\npage_profile=learner\n[/PRISM_STEP_PARAMS]"
    },
    {
      id: "s2",
      title: "Design Assessment",
      canonical_step_id: "step_design_assessment",
      notes: ""
    },
    {
      id: "s3",
      title: "Untyped step",
      notes: ""
    }
  ]
};

const alphaBriefConfig = {
  stepParameterControls: [
    {
      key: "tune_key",
      canonicalStepId: "step_alpha",
      label: "Tune",
      description: "Tuning",
      controlType: "text",
      default: "",
      visible: true,
      advanced: false,
      elicitation: "settings-only"
    }
  ]
};

test("collectIncludedWorkflowStepRows returns only steps with canonical_step_id", () => {
  const api = loadPrismTestApi();
  const rows = api.collectIncludedWorkflowStepRows(sampleWorkflow);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].canonicalStepId, "step_design_page");
  assert.equal(rows[0].stepId, "s1");
  assert.equal(rows[1].canonicalStepId, "step_design_assessment");
});

test("aggregateUnifiedWorkflowParameterSections filters to included steps only", () => {
  const api = loadPrismTestApi();
  const briefConfig = loadLdWorkflowBriefConfig();
  const result = api.aggregateUnifiedWorkflowParameterSections(sampleWorkflow, briefConfig);
  assert.ok(Array.isArray(result.steps));
  assert.equal(result.steps.length, 2);
  const page = result.steps.find((s) => s.canonicalStepId === "step_design_page");
  assert.ok(page);
  assert.ok(page.controls.length >= 1);
  assert.equal(page.params.page_profile, "learner");
  const assessment = result.steps.find((s) => s.canonicalStepId === "step_design_assessment");
  assert.ok(assessment);
  assert.ok(assessment.controls.length >= 1);
});

test("aggregateUnifiedWorkflowParameterSections returns empty steps when briefConfig is null", () => {
  const api = loadPrismTestApi();
  const wf = {
    steps: [{ id: "a1", title: "Alpha", canonical_step_id: "step_alpha", notes: "" }]
  };
  const nullResult = api.aggregateUnifiedWorkflowParameterSections(wf, null);
  assert.equal(nullResult.workflow, null);
  assert.equal(nullResult.steps.length, 0);
  const undefResult = api.aggregateUnifiedWorkflowParameterSections(wf, undefined);
  assert.equal(undefResult.workflow, null);
  assert.equal(undefResult.steps.length, 0);
});

test("aggregateUnifiedWorkflowParameterSections includes workflowParameterControls section", () => {
  const api = loadPrismTestApi();
  const briefConfig = {
    workflowParameterControls: [
      {
        key: "delivery_context",
        label: "Delivery context",
        description: "Delivery mode",
        controlType: "select",
        default: "blended",
        options: [
          { value: "blended", label: "Blended" },
          { value: "in_person", label: "In person" }
        ],
        visible: true,
        advanced: false,
        elicitation: "settings-only"
      }
    ],
    stepParameterControls: []
  };
  const wf = {
    id: "wf-wf",
    notes: "[PRISM_STEP_PARAMS]\ndelivery_context=online_sync\n[/PRISM_STEP_PARAMS]",
    steps: []
  };
  const result = api.aggregateUnifiedWorkflowParameterSections(wf, briefConfig);
  assert.ok(result.workflow);
  assert.equal(result.workflow.controls.length, 1);
  assert.equal(result.workflow.controls[0].key, "delivery_context");
  assert.equal(result.workflow.params.delivery_context, "online_sync");
  assert.equal(result.steps.length, 0);
});

test("normalizeWorkflowParameterControl does not require canonicalStepId", () => {
  const api = loadPrismTestApi();
  const row = api.normalizeWorkflowParameterControl({
    key: "topic_scope",
    label: "Topic scope",
    controlType: "text",
    default: "narrow",
    visible: true,
    elicitation: "settings-only"
  });
  assert.ok(row);
  assert.equal(row.key, "topic_scope");
  assert.equal(row.canonicalStepId, undefined);
});

test("aggregateUnifiedWorkflowParameterSections omits steps with no visible pack controls", () => {
  const api = loadPrismTestApi();
  const briefConfig = loadLdWorkflowBriefConfig();
  const wf = {
    id: "wf-2",
    steps: [{ id: "x1", title: "Unknown", canonical_step_id: "step_does_not_exist_in_pack" }]
  };
  const result = api.aggregateUnifiedWorkflowParameterSections(wf, briefConfig);
  assert.equal(result.steps.length, 0);
});

test("aggregateUnifiedWorkflowParameterSections excludes hidden workflowParameterControls", () => {
  const api = loadPrismTestApi();
  const briefConfig = {
    workflowParameterControls: [
      {
        key: "visible_wf",
        label: "Visible",
        description: "Shown",
        controlType: "text",
        default: "",
        visible: true,
        advanced: false,
        elicitation: "settings-only"
      },
      {
        key: "hidden_wf",
        label: "Hidden",
        description: "Hidden",
        controlType: "text",
        default: "",
        visible: false,
        advanced: false,
        elicitation: "settings-only"
      }
    ]
  };
  const result = api.aggregateUnifiedWorkflowParameterSections({ id: "wf", notes: "", steps: [] }, briefConfig);
  assert.ok(result.workflow);
  assert.equal(result.workflow.controls.length, 1);
  assert.equal(result.workflow.controls[0].key, "visible_wf");
});

test("aggregateUnifiedWorkflowParameterSections excludes hidden controls from render list", () => {
  const api = loadPrismTestApi();
  const briefConfig = {
    stepParameterControls: [
      {
        key: "visible_param",
        canonicalStepId: "step_alpha",
        label: "Visible",
        description: "Shown",
        controlType: "text",
        default: "",
        visible: true,
        advanced: false,
        elicitation: "settings-only"
      },
      {
        key: "hidden_param",
        canonicalStepId: "step_alpha",
        label: "Hidden",
        description: "Hidden",
        controlType: "text",
        default: "",
        visible: false,
        advanced: false,
        elicitation: "settings-only"
      }
    ]
  };
  const wf = {
    steps: [{ id: "a1", title: "Alpha", canonical_step_id: "step_alpha", notes: "" }]
  };
  const result = api.aggregateUnifiedWorkflowParameterSections(wf, briefConfig);
  assert.equal(result.steps.length, 1);
  assert.equal(result.steps[0].controls.length, 1);
  assert.equal(result.steps[0].controls[0].key, "visible_param");
});

test("resolveWorkflowBriefConfigForWorkflow prefers persisted workflow briefConfig", () => {
  const api = loadPrismTestApi();
  const briefConfig = loadLdWorkflowBriefConfig();
  const wf = {
    workflowBriefResolution: { briefConfig: briefConfig }
  };
  const resolved = api.resolveWorkflowBriefConfigForWorkflow(wf, null);
  assert.ok(resolved);
  assert.ok(Array.isArray(resolved.stepParameterControls));
  assert.ok(resolved.stepParameterControls.length >= 25);
});

test("syncUnifiedWorkflowSettingsToStepNotes upserts [PRISM_STEP_PARAMS] in step notes", () => {
  const { api, notesArea } = loadPrismTestApiForUnifiedSettingsSync();
  api.syncUnifiedWorkflowSettingsToStepNotes();

  const parsed = api.parseWorkflowStepParamBlock(notesArea.value);
  assert.equal(parsed.tune_key, "facilitator");
  assert.match(notesArea.value, /\[PRISM_STEP_PARAMS\]/);
  assert.match(notesArea.value, /\[\/PRISM_STEP_PARAMS\]/);
});

test("syncUnifiedWorkflowSettingsToStepNotes upserts workflow-level block in workflowLibraryNotes only", () => {
  const { api, workflowLibraryNotes } = loadPrismTestApiForUnifiedSettingsWorkflowSync();
  api.syncUnifiedWorkflowSettingsToStepNotes();
  const parsed = api.parseWorkflowStepParamBlock(workflowLibraryNotes.value);
  assert.equal(parsed.delivery_context, "online_sync");
  assert.match(workflowLibraryNotes.value, /\[PRISM_STEP_PARAMS\]/);
  assert.match(workflowLibraryNotes.value, /Internal workflow notes/);
});

test("aggregate reads workflow object params when workflow is not selected", () => {
  const api = loadPrismTestApi();
  const wf = {
    steps: [
      {
        id: "s1",
        title: "Alpha",
        canonical_step_id: "step_alpha",
        notes: "[PRISM_STEP_PARAMS]\ntune_key=learner\n[/PRISM_STEP_PARAMS]"
      }
    ]
  };
  const domSyncedNotes = api.upsertWorkflowStepParamBlock(wf.steps[0].notes, [
    { id: "tune_key", label: "Tune", value: "facilitator" }
  ]);
  const aggregated = api.aggregateUnifiedWorkflowParameterSections(wf, alphaBriefConfig);
  assert.equal(aggregated.steps[0].params.tune_key, "learner");
  assert.equal(api.parseWorkflowStepParamBlock(domSyncedNotes).tune_key, "facilitator");
});

function loadPrismTestApiForUnifiedSettingsDomReread() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const elementStore = new Map();
  const optionsRoot = createElementStub("div");
  const workflowSteps = createElementStub("ol");
  const stepLi = createElementStub("li");
  stepLi.classList.add("workflow-step");
  stepLi.setAttribute("data-step-id", "s1");
  const notesArea = createElementStub("textarea");
  notesArea.setAttribute("data-field", "notes");
  notesArea.value = "[PRISM_STEP_PARAMS]\ntune_key=facilitator\n[/PRISM_STEP_PARAMS]";
  stepLi.appendChild(notesArea);
  workflowSteps.appendChild(stepLi);

  const workflowLibraryNotes = createElementStub("textarea");
  workflowLibraryNotes.value =
    "[PRISM_STEP_PARAMS]\ndelivery_context=online_sync\n[/PRISM_STEP_PARAMS]";

  elementStore.set("unifiedWorkflowSettingsOptions", optionsRoot);
  elementStore.set("workflowSteps", workflowSteps);
  elementStore.set("workflowLibraryNotes", workflowLibraryNotes);

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: (tagName) => createElementStub(tagName),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub("div"),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "test-uuid" },
    localStorage: { getItem: () => null, setItem: () => {} },
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  const wfId = "wf-dom-reread";
  api.setSelectedWorkflowIdForTest(wfId);
  return { api, wfId };
}

test("aggregate prefers DOM-synced step and workflow params when workflow is selected", () => {
  const { api, wfId } = loadPrismTestApiForUnifiedSettingsDomReread();
  const wf = {
    id: wfId,
    notes: "[PRISM_STEP_PARAMS]\ndelivery_context=blended\n[/PRISM_STEP_PARAMS]",
    steps: [
      {
        id: "s1",
        title: "Alpha",
        canonical_step_id: "step_alpha",
        notes: "[PRISM_STEP_PARAMS]\ntune_key=learner\n[/PRISM_STEP_PARAMS]"
      }
    ]
  };
  const briefConfig = {
    workflowParameterControls: [
      {
        key: "delivery_context",
        label: "Delivery",
        description: "Mode",
        controlType: "text",
        default: "",
        visible: true,
        advanced: false,
        elicitation: "settings-only"
      }
    ],
    stepParameterControls: [
      {
        key: "tune_key",
        canonicalStepId: "step_alpha",
        label: "Tune",
        description: "Tuning",
        controlType: "text",
        default: "",
        visible: true,
        advanced: false,
        elicitation: "settings-only"
      }
    ]
  };
  const result = api.aggregateUnifiedWorkflowParameterSections(wf, briefConfig);
  assert.equal(result.workflow.params.delivery_context, "online_sync");
  assert.equal(result.steps[0].params.tune_key, "facilitator");
});

test("mergeRecoveredBriefConfigIntoResolution fills missing workflowParameterControls on partial briefConfig", () => {
  const api = loadPrismTestApi();
  const partial = {
    mappedBindings: {
      workflowOutputSpecPatch: {},
      workflowConstraintPatch: {},
      stepParamPatch: {},
      mapped: [],
      warnings: []
    },
    missing: [],
    briefConfig: {
      stepParameterControls: [
        {
          key: "page_profile",
          canonicalStepId: "step_design_page",
          label: "Profile",
          controlType: "text",
          default: "",
          visible: true,
          elicitation: "settings-only"
        }
      ]
    }
  };
  const recovered = {
    workflowParameterControls: [
      {
        key: "delivery_context",
        label: "Delivery context",
        controlType: "text",
        default: "",
        visible: true,
        elicitation: "settings-only"
      }
    ],
    stepParameterControls: [
      {
        key: "other_step",
        canonicalStepId: "step_other",
        label: "Other",
        controlType: "text",
        default: "",
        visible: true,
        elicitation: "settings-only"
      }
    ]
  };
  const merged = api.mergeRecoveredBriefConfigIntoResolution(partial, recovered);
  assert.ok(merged.mappedBindings);
  assert.equal(merged.briefConfig.workflowParameterControls.length, 1);
  assert.equal(merged.briefConfig.workflowParameterControls[0].key, "delivery_context");
  assert.equal(merged.briefConfig.stepParameterControls.length, 1);
  assert.equal(merged.briefConfig.stepParameterControls[0].key, "page_profile");
});

test("mergeRecoveredBriefConfigIntoResolution does not replace rich persisted workflowParameterControls", () => {
  const api = loadPrismTestApi();
  const rich = {
    mappedBindings: {
      workflowOutputSpecPatch: { topic: "saved" },
      workflowConstraintPatch: {},
      stepParamPatch: {},
      mapped: [],
      warnings: []
    },
    missing: [],
    briefConfig: {
      workflowParameterControls: [
        {
          key: "custom_wf",
          label: "Custom",
          controlType: "text",
          default: "mine",
          visible: true,
          elicitation: "settings-only"
        }
      ],
      stepParameterControls: []
    }
  };
  const recovered = {
    workflowParameterControls: [
      {
        key: "delivery_context",
        label: "Delivery context",
        controlType: "text",
        default: "",
        visible: true,
        elicitation: "settings-only"
      }
    ],
    stepParameterControls: []
  };
  const merged = api.mergeRecoveredBriefConfigIntoResolution(rich, recovered);
  assert.equal(merged.mappedBindings.workflowOutputSpecPatch.topic, "saved");
  assert.equal(merged.briefConfig.workflowParameterControls.length, 1);
  assert.equal(merged.briefConfig.workflowParameterControls[0].key, "custom_wf");
  assert.equal(merged.briefConfig.workflowParameterControls[0].default, "mine");
});

function loadPrismTestApiWithWorkflowGenerationContext() {
  const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");
  const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
  const manifestJson = JSON.parse(fs.readFileSync(manifestFsPath, "utf8"));

  function resolveRepoFileFromUrl(url) {
    const normalized = String(url || "").replace(/\\/g, "/");
    const marker = "domains/";
    const pos = normalized.indexOf(marker);
    if (pos === -1) return null;
    return path.join(repoRoot, normalized.slice(pos).replace(/\//g, path.sep));
  }

  function fetchImpl(url) {
    const u = String(url || "");
    if (u.includes("domain-manifest.json")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(manifestJson)
      });
    }
    const disk = resolveRepoFileFromUrl(u);
    if (disk && fs.existsSync(disk)) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(fs.readFileSync(disk, "utf8"))
      });
    }
    return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve("") });
  }

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    fetch: fetchImpl
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(wgcPath, "utf8"), sandbox, {
    filename: "workflowGenerationContext.js"
  });

  const documentStub = { readyState: "loading", addEventListener: () => {} };
  sandbox.document = documentStub;
  sandbox.window.document = documentStub;
  sandbox.window.window = sandbox.window;
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

const ldWorkflowWithoutPersistedBriefConfig = {
  id: "wf-ld-recover",
  selectedDomains: ["general", "learning-design"],
  steps: [
    {
      id: "s1",
      title: "Design Page",
      canonical_step_id: "step_design_page",
      notes: ""
    }
  ]
};

test("inferSelectedDomainsFromWorkflowRecord normalizes saved workflow domains", () => {
  const api = loadPrismTestApi();
  const domains = api.inferSelectedDomainsFromWorkflowRecord(ldWorkflowWithoutPersistedBriefConfig);
  assert.equal(domains.length, 2);
  assert.equal(domains[0], "general");
  assert.equal(domains[1], "learning-design");
});

test("workflowNeedsUnifiedSettingsBriefConfigRecovery when steps exist and briefConfig missing", () => {
  const api = loadPrismTestApi();
  api.clearRecoveredBriefConfigCacheForTest();
  assert.equal(api.workflowNeedsUnifiedSettingsBriefConfigRecovery(ldWorkflowWithoutPersistedBriefConfig), true);
  assert.equal(
    api.workflowNeedsUnifiedSettingsBriefConfigRecovery({
      selectedDomains: ["general"],
      steps: [{ id: "s1", canonical_step_id: "step_design_page", notes: "" }]
    }),
    true
  );
  assert.equal(
    api.workflowNeedsUnifiedSettingsBriefConfigRecovery({
      selectedDomains: ["general"],
      steps: [{ id: "s1", title: "Custom", notes: "" }]
    }),
    false
  );
  assert.equal(
    api.workflowNeedsUnifiedSettingsBriefConfigRecovery({
      selectedDomains: ["general", "learning-design"],
      steps: [{ id: "s1", title: "Custom", notes: "" }]
    }),
    true
  );
});

test("recoverWorkflowBriefConfigForUnifiedSettings loads LD pack for saved workflow", async () => {
  const api = loadPrismTestApiWithWorkflowGenerationContext();
  api.clearRecoveredBriefConfigCacheForTest();
  const payload = await api.recoverWorkflowBriefConfigForUnifiedSettings(
    ldWorkflowWithoutPersistedBriefConfig
  );
  assert.equal(payload.domainId, "learning-design");
  assert.ok(payload.config);
  assert.ok(Array.isArray(payload.config.stepParameterControls));
  assert.ok(payload.config.stepParameterControls.length >= 25);
  const aggregate = api.aggregateUnifiedWorkflowParameterSections(
    ldWorkflowWithoutPersistedBriefConfig,
    payload.config
  );
  assert.ok(aggregate.steps.length >= 1);
  assert.ok(api.getRecoveredBriefConfigForWorkflow("wf-ld-recover"));
  assert.ok(
    api.resolveWorkflowBriefConfigForWorkflow(ldWorkflowWithoutPersistedBriefConfig, null)
  );
});

test("recoverWorkflowBriefConfigForUnifiedSettings renders workflow-only controls without canonical steps", async () => {
  const api = loadPrismTestApiWithWorkflowGenerationContext();
  api.clearRecoveredBriefConfigCacheForTest();
  const wf = {
    id: "wf-wf-only",
    selectedDomains: ["general", "learning-design"],
    steps: [{ id: "s1", title: "Custom", notes: "" }]
  };
  const payload = await api.recoverWorkflowBriefConfigForUnifiedSettings(wf);
  assert.ok(payload.config);
  assert.ok(
    Array.isArray(payload.config.workflowParameterControls) &&
      payload.config.workflowParameterControls.length >= 1
  );
  const aggregate = api.aggregateUnifiedWorkflowParameterSections(wf, payload.config);
  assert.ok(aggregate.workflow);
  assert.ok(aggregate.workflow.controls.length >= 1);
  assert.equal(aggregate.steps.length, 0);
  const delivery = aggregate.workflow.controls.find((c) => c.key === "delivery_context");
  assert.ok(delivery, "LD pilot metadata should appear as pack control, not runtime branch");
});

test("cacheRecoveredBriefConfig retains full briefConfig including workflowParameterControls", async () => {
  const api = loadPrismTestApiWithWorkflowGenerationContext();
  api.clearRecoveredBriefConfigCacheForTest();
  const wf = {
    id: "wf-save-merge",
    selectedDomains: ["general", "learning-design"],
    steps: []
  };
  await api.recoverWorkflowBriefConfigForUnifiedSettings(wf);
  const recovered = api.getRecoveredBriefConfigForWorkflow("wf-save-merge");
  assert.ok(recovered);
  assert.ok(Array.isArray(recovered.workflowParameterControls));
  assert.ok(
    recovered.workflowParameterControls.some(function (row) {
      return row && String(row.key || "") === "delivery_context";
    })
  );
});

test("recoverWorkflowBriefConfigForUnifiedSettings returns null when no canonical steps and general-only", async () => {
  const api = loadPrismTestApiWithWorkflowGenerationContext();
  api.clearRecoveredBriefConfigCacheForTest();
  const payload = await api.recoverWorkflowBriefConfigForUnifiedSettings({
    id: "wf-general",
    selectedDomains: ["general"],
    steps: [{ id: "s1", title: "Custom workshop step", notes: "" }]
  });
  assert.equal(payload.domainId, "general");
  assert.equal(payload.config, null);
  const aggregate = api.aggregateUnifiedWorkflowParameterSections(
    { steps: [{ id: "s1", title: "Custom workshop step", notes: "" }] },
    payload.config
  );
  assert.equal(aggregate.steps.length, 0);
});

function loadPrismTestApiForWorkflowNavigation() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const elementStore = new Map();
  const workflowDetail = createElementStub("div");
  const unifiedPanel = createElementStub("section");
  const contextHint = createElementStub("p");
  const saveHint = createElementStub("p");
  saveHint.textContent =
    "Changes sync to workflow and step notes as you edit. Use Save in the workflow header to persist this workflow.";
  saveHint.classList.add("hidden");
  const optionsRoot = createElementStub("div");
  unifiedPanel.appendChild(contextHint);
  unifiedPanel.appendChild(saveHint);
  unifiedPanel.appendChild(optionsRoot);

  const runBtn = createElementStub("button");
  const settingsBtn = createElementStub("button");
  const editBtn = createElementStub("button");
  editBtn.classList.add("active");
  const badge = createElementStub("span");
  badge.classList.add("hidden");
  settingsBtn.appendChild(badge);

  elementStore.set("workflowDetail", workflowDetail);
  elementStore.set("unifiedWorkflowSettingsPanel", unifiedPanel);
  elementStore.set("unifiedWorkflowSettingsHint", contextHint);
  elementStore.set("unifiedWorkflowSettingsSaveHint", saveHint);
  elementStore.set("unifiedWorkflowSettingsOptions", optionsRoot);
  elementStore.set("workflowModeRunBtn", runBtn);
  elementStore.set("workflowModeSettingsBtn", settingsBtn);
  elementStore.set("workflowModeSettingsBadge", badge);
  elementStore.set("workflowModeEditBtn", editBtn);
  elementStore.set("workflowSteps", createElementStub("ol"));
  elementStore.set("workflowLibraryNotes", createElementStub("textarea"));

  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: (tagName) => createElementStub(tagName),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
      return elementStore.get(id);
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "test-uuid" },
    localStorage: { getItem: () => null, setItem: () => {} },
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return {
    api,
    workflowDetail,
    unifiedPanel,
    contextHint,
    saveHint,
    optionsRoot,
    runBtn,
    settingsBtn,
    editBtn,
    badge
  };
}

test("setWorkflowMode selects Settings Run and Edit without breaking mode state", () => {
  const { api, workflowDetail, unifiedPanel, runBtn, settingsBtn, editBtn } =
    loadPrismTestApiForWorkflowNavigation();

  api.setWorkflowDetailModeForTest("settings");
  assert.equal(api.getWorkflowDetailModeForTest(), "settings");
  assert.equal(settingsBtn.classList.contains("active"), true);
  assert.equal(unifiedPanel.classList.contains("hidden"), false);
  assert.equal(workflowDetail.classList.contains("settings-mode"), true);

  api.setWorkflowDetailModeForTest("run");
  assert.equal(api.getWorkflowDetailModeForTest(), "run");
  assert.equal(runBtn.classList.contains("active"), true);
  assert.equal(unifiedPanel.classList.contains("hidden"), true);
  assert.equal(workflowDetail.classList.contains("run-mode"), true);

  api.setWorkflowDetailModeForTest("edit");
  assert.equal(api.getWorkflowDetailModeForTest(), "edit");
  assert.equal(editBtn.classList.contains("active"), true);
  assert.equal(unifiedPanel.classList.contains("hidden"), true);
  assert.equal(workflowDetail.classList.contains("settings-mode"), false);
});

test("refreshWorkflowModeSettingsTabBadge reflects visible workflow and step controls", () => {
  const { api, badge } = loadPrismTestApiForWorkflowNavigation();
  const briefConfig = {
    workflowParameterControls: [
      {
        key: "delivery_context",
        label: "Delivery",
        controlType: "text",
        default: "",
        visible: true,
        elicitation: "settings-only"
      }
    ],
    stepParameterControls: [
      {
        key: "tune_key",
        canonicalStepId: "step_alpha",
        label: "Tune",
        controlType: "text",
        default: "",
        visible: true,
        elicitation: "settings-only"
      }
    ]
  };
  const wf = {
    id: "wf-badge",
    notes: "",
    steps: [
      {
        id: "s1",
        title: "Alpha",
        canonical_step_id: "step_alpha",
        notes: ""
      }
    ],
    workflowBriefResolution: { briefConfig: briefConfig }
  };
  api.setSelectedWorkflowIdForTest("wf-badge");
  api.setWorkflowsForTest([wf]);
  assert.equal(api.countUnifiedWorkflowVisibleParameterControls(wf, briefConfig), 2);
  api.refreshWorkflowModeSettingsTabBadge();
  assert.equal(badge.classList.contains("hidden"), false);
  assert.equal(badge.textContent, "2");
});

test("renderUnifiedWorkflowSettingsContent shows empty state when no controls apply", () => {
  const { api, contextHint, saveHint, optionsRoot } = loadPrismTestApiForWorkflowNavigation();
  const wf = {
    id: "wf-empty",
    steps: [{ id: "s1", title: "Custom", canonical_step_id: "step_unknown", notes: "" }]
  };
  api.renderUnifiedWorkflowSettingsContentForTest(wf, { stepParameterControls: [], workflowParameterControls: [] });
  assert.match(contextHint.textContent, /No pack-defined parameters apply/);
  assert.equal(saveHint.classList.contains("hidden"), true);
  assert.equal(optionsRoot.children.length, 0);
});

test("renderUnifiedWorkflowSettingsContent keeps save hint visible for applicable controls", () => {
  const { api, saveHint, optionsRoot } = loadPrismTestApiForWorkflowNavigation();
  const wf = {
    id: "wf-save-hint",
    notes: "",
    steps: [{ id: "s1", title: "Alpha", canonical_step_id: "step_alpha", notes: "" }]
  };
  api.renderUnifiedWorkflowSettingsContentForTest(wf, alphaBriefConfig);
  assert.equal(saveHint.classList.contains("hidden"), false);
  assert.match(saveHint.textContent, /Save/);
  assert.ok(optionsRoot.querySelector("[data-workflow-pack-param='1']"));
  api.syncUnifiedWorkflowSettingsToStepNotes();
  assert.equal(saveHint.classList.contains("hidden"), false);
});

test("unified Settings surface does not render prompt factory controls", () => {
  const { api, optionsRoot } = loadPrismTestApiForWorkflowNavigation();
  const wf = {
    id: "wf-no-prompt",
    notes: "",
    steps: [{ id: "s1", title: "Alpha", canonical_step_id: "step_alpha", notes: "" }]
  };
  api.renderUnifiedWorkflowSettingsContentForTest(wf, alphaBriefConfig);
  assert.equal(optionsRoot.querySelector(".workflow-step-new-prompt"), null);
  assert.equal(optionsRoot.querySelector("[data-prompt-factory]"), null);
  assert.equal(optionsRoot.querySelector("textarea[data-field='prompt']"), null);
  const packControls = optionsRoot.querySelectorAll("[data-workflow-pack-param='1']");
  assert.ok(packControls.length >= 1);
});

test("discoverPackBriefConfigForWorkflow recovers LD pack when selectedDomains missing but canonical_step_id present", async () => {
  const api = loadPrismTestApiWithWorkflowGenerationContext();
  api.clearRecoveredBriefConfigCacheForTest();
  const wf = {
    id: "wf-missing-domains",
    steps: [
      {
        id: "s1",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        notes: ""
      },
      {
        id: "s2",
        title: "Design Assessment",
        canonical_step_id: "step_design_assessment",
        notes: ""
      }
    ]
  };
  assert.equal(api.inferSelectedDomainsFromWorkflowRecord(wf).join(","), "general");
  const payload = await api.discoverPackBriefConfigForWorkflow(wf);
  assert.equal(payload.domainId, "learning-design");
  assert.ok(payload.config);
  assert.ok(api.scoreBriefConfigForCanonicalStepIds(payload.config, ["step_design_page", "step_design_assessment"]) >= 2);
});

test("discoverPackBriefConfigForWorkflow recovers from canonical IDs when selectedDomains is general-only", async () => {
  const api = loadPrismTestApiWithWorkflowGenerationContext();
  api.clearRecoveredBriefConfigCacheForTest();
  const wf = {
    id: "wf-general-only-domains",
    selectedDomains: ["general"],
    steps: [
      {
        id: "s1",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        notes: ""
      }
    ]
  };
  const payload = await api.discoverPackBriefConfigForWorkflow(wf);
  assert.equal(payload.domainId, "learning-design");
  assert.ok(payload.config);
  const aggregate = api.aggregateUnifiedWorkflowParameterSections(wf, payload.config);
  assert.ok(aggregate.steps.length >= 1);
});

test("diagnoseUnifiedWorkflowParameterCoverage reports unmatched canonical step IDs", () => {
  const api = loadPrismTestApi();
  const wf = {
    steps: [
      { id: "s1", title: "Design Page", canonical_step_id: "step_design_page", notes: "" },
      { id: "s2", title: "Unknown", canonical_step_id: "step_not_in_pack", notes: "" }
    ]
  };
  const briefConfig = {
    stepParameterControls: [
      {
        key: "page_profile",
        canonicalStepId: "step_design_page",
        label: "Profile",
        controlType: "text",
        default: "",
        visible: true,
        elicitation: "settings-only"
      }
    ]
  };
  const diag = api.diagnoseUnifiedWorkflowParameterCoverage(wf, briefConfig);
  assert.equal(diag.includedStepCount, 2);
  assert.equal(diag.matchedStepSectionCount, 1);
  assert.equal(diag.unmatchedCanonicalStepIds.length, 1);
  assert.equal(diag.unmatchedCanonicalStepIds[0], "step_not_in_pack");
  assert.ok(diag.packStepControlCanonicalStepIds.includes("step_design_page"));
});

test("aggregate renders workflow and multiple matched step sections with visible controls only", () => {
  const api = loadPrismTestApi();
  const ldBrief = loadLdWorkflowBriefConfig();
  const wf = {
    id: "wf-full",
    notes: "[PRISM_STEP_PARAMS]\ndelivery_context=blended\n[/PRISM_STEP_PARAMS]",
    steps: [
      {
        id: "s1",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        notes: ""
      },
      {
        id: "s2",
        title: "Design Assessment",
        canonical_step_id: "step_design_assessment",
        notes: ""
      }
    ]
  };
  const result = api.aggregateUnifiedWorkflowParameterSections(wf, ldBrief);
  assert.ok(result.workflow);
  assert.ok(result.workflow.controls.length >= 1);
  assert.ok(result.steps.length >= 2);
  const page = result.steps.find((s) => s.canonicalStepId === "step_design_page");
  const assessment = result.steps.find((s) => s.canonicalStepId === "step_design_assessment");
  assert.ok(page && page.controls.length >= 1);
  assert.ok(assessment && assessment.controls.length >= 1);
  assert.ok(!page.controls.some((c) => c.visible === false));
});

test("LD pack metadata covers previously unmatched LD step IDs except generate-learning-content", () => {
  const api = loadPrismTestApi();
  const ldBrief = loadLdWorkflowBriefConfig();
  const wf = {
    id: "wf-ld-coverage",
    steps: [
      { id: "s1", title: "Generate Learning Content", canonical_step_id: "step_generate_learning_content", notes: "" },
      { id: "s2", title: "Model Knowledge", canonical_step_id: "step_model_knowledge", notes: "" },
      { id: "s3", title: "Define Learning Outcomes", canonical_step_id: "step_define_learning_outcomes", notes: "" },
      { id: "s4", title: "Design Learning Activities", canonical_step_id: "step_design_learning_activities", notes: "" },
      { id: "s5", title: "Generate Activity Materials", canonical_step_id: "step_generate_activity_materials", notes: "" },
      { id: "s6", title: "Construct Learning Sequence", canonical_step_id: "step_construct_learning_sequence", notes: "" }
    ]
  };
  const diag = api.diagnoseUnifiedWorkflowParameterCoverage(wf, ldBrief);
  assert.equal(diag.includedStepCount, 6);
  assert.equal(diag.unmatchedCanonicalStepIds.length, 1);
  assert.equal(diag.unmatchedCanonicalStepIds[0], "step_generate_learning_content");
  assert.equal(diag.matchedStepSectionCount, 5);
  const aggregate = api.aggregateUnifiedWorkflowParameterSections(wf, ldBrief);
  assert.equal(aggregate.workflow.controls.length, 4);
  let visibleControlCount = aggregate.workflow.controls.length;
  aggregate.steps.forEach(function (section) {
    visibleControlCount += section.controls.length;
  });
  assert.equal(visibleControlCount, 19);
});

test("shouldRefreshRecoveredBriefConfigForUnifiedSettings when session cache under-covers canonical steps", () => {
  const api = loadPrismTestApi();
  api.clearRecoveredBriefConfigCacheForTest();
  api.cacheRecoveredBriefConfigForWorkflow("wf-stale-cache", {
    domainId: "learning-design",
    config: {
      workflowParameterControls: [],
      stepParameterControls: [
        {
          key: "page_profile",
          canonicalStepId: "step_design_page",
          label: "Page profile",
          controlType: "select",
          default: "learner",
          options: [{ value: "learner", label: "Learner" }],
          visible: true,
          elicitation: "settings-only"
        }
      ]
    }
  });
  const wf = {
    id: "wf-stale-cache",
    steps: [
      { id: "s1", canonical_step_id: "step_design_page", notes: "" },
      { id: "s2", canonical_step_id: "step_model_knowledge", notes: "" }
    ]
  };
  assert.equal(api.shouldRefreshRecoveredBriefConfigForUnifiedSettings(wf), true);
  assert.equal(api.workflowNeedsUnifiedSettingsBriefConfigRecovery(wf), true);
});

test("buildUnifiedWorkflowSettingsCoverageHint singular unmatched step wording", () => {
  const api = loadPrismTestApi();
  const hint = api.buildUnifiedWorkflowSettingsCoverageHint(
    {
      steps: [
        {
          id: "s1",
          canonical_step_id: "step_generate_learning_content",
          title: "Generate Learning Content"
        }
      ]
    },
    loadLdWorkflowBriefConfig()
  );
  assert.match(hint, /matched 1 included step: step_generate_learning_content/);
  assert.match(hint, /This step can still run/);
  assert.match(hint, /does not currently expose tunable Settings controls for it/);
});

test("buildUnifiedWorkflowSettingsCoverageHint plural unmatched step wording", () => {
  const api = loadPrismTestApi();
  const hint = api.buildUnifiedWorkflowSettingsCoverageHint(
    {
      steps: [
        {
          id: "s1",
          canonical_step_id: "step_generate_learning_content",
          title: "Generate Learning Content"
        },
        {
          id: "s2",
          canonical_step_id: "step_not_in_pack",
          title: "Unknown"
        }
      ]
    },
    {
      stepParameterControls: [
        {
          key: "page_profile",
          canonicalStepId: "step_design_page",
          label: "Profile",
          controlType: "text",
          default: "",
          visible: true,
          elicitation: "settings-only"
        }
      ]
    }
  );
  assert.match(hint, /matched 2 included steps:/);
  assert.match(hint, /step_generate_learning_content/);
  assert.match(hint, /step_not_in_pack/);
  assert.match(hint, /These steps can still run/);
  assert.match(hint, /expose tunable Settings controls for them/);
});

test("groupWorkflowStepParameterControlsForSettings uses step labels for step scope", () => {
  const api = loadPrismTestApi();
  const sections = api.groupWorkflowStepParameterControlsForSettings(
    [
      {
        key: "a",
        label: "A",
        controlType: "text",
        default: "",
        advanced: false,
        visible: true
      },
      {
        key: "b",
        label: "B",
        controlType: "text",
        default: "",
        advanced: true,
        visible: true
      }
    ],
    { parameterScope: "step" }
  );
  assert.equal(sections[0].label, "Basic step parameters");
  assert.equal(sections[1].label, "Advanced step parameters");
});

test("groupWorkflowStepParameterControlsForSettings uses workflow labels for workflow scope", () => {
  const api = loadPrismTestApi();
  const sections = api.groupWorkflowStepParameterControlsForSettings(
    [
      {
        key: "a",
        label: "A",
        controlType: "text",
        default: "",
        advanced: false,
        visible: true
      },
      {
        key: "b",
        label: "B",
        controlType: "text",
        default: "",
        advanced: true,
        visible: true
      }
    ],
    { parameterScope: "workflow" }
  );
  assert.equal(sections[0].label, "Basic workflow parameters");
  assert.equal(sections[1].label, "Advanced workflow parameters");
});

test("countUnifiedWorkflowVisibleParameterControls excludes hidden pack controls", () => {
  const api = loadPrismTestApi();
  const briefConfig = {
    workflowParameterControls: [
      {
        key: "visible_wf",
        label: "Visible",
        controlType: "text",
        default: "",
        visible: true,
        elicitation: "settings-only"
      },
      {
        key: "hidden_wf",
        label: "Hidden",
        controlType: "text",
        default: "",
        visible: false,
        elicitation: "settings-only"
      }
    ],
    stepParameterControls: [
      {
        key: "visible_step",
        canonicalStepId: "step_alpha",
        label: "Visible",
        controlType: "text",
        default: "",
        visible: true,
        elicitation: "settings-only"
      }
    ]
  };
  const wf = {
    steps: [{ id: "s1", title: "Alpha", canonical_step_id: "step_alpha", notes: "" }]
  };
  assert.equal(api.countUnifiedWorkflowVisibleParameterControls(wf, briefConfig), 2);
});

test("unionWorkflowBriefConfigsForDisplay merges supplemental step controls without overwriting primary keys", () => {
  const api = loadPrismTestApi();
  const primary = {
    workflowParameterControls: [
      {
        key: "custom_wf",
        label: "Custom",
        controlType: "text",
        default: "mine",
        visible: true,
        elicitation: "settings-only"
      }
    ],
    stepParameterControls: [
      {
        key: "page_profile",
        canonicalStepId: "step_design_page",
        label: "Primary profile",
        controlType: "text",
        default: "learner",
        visible: true,
        elicitation: "settings-only"
      }
    ]
  };
  const supplemental = loadLdWorkflowBriefConfig();
  const merged = api.unionWorkflowBriefConfigsForDisplay(primary, supplemental);
  assert.ok(merged.workflowParameterControls.some((c) => c.key === "custom_wf"));
  assert.ok(merged.workflowParameterControls.some((c) => c.key === "delivery_context"));
  const pageControls = merged.stepParameterControls.filter(
    (c) => c.canonicalStepId === "step_design_page"
  );
  assert.ok(pageControls.some((c) => c.key === "page_profile" && c.default === "learner"));
  assert.ok(pageControls.length >= 2);
});

/**
 * Sprint 58 final fix — preserve pageEnrichmentV2 / partialPageOutputs through
 * resolveWorkflowForUpstreamArtefacts and run-mode Design Page prompt assembly.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

const COMPOSE_MARKER = /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i;
const PARTIAL_MARKER = /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i;
const LEGACY_UPSTREAM_INJECTION = /### Upstream Learning Sequence page|workflow capture; use this text verbatim|CAPTURE MISSING:/i;

function createClassList(initial) {
  const set = new Set(initial || []);
  return {
    add(name) {
      set.add(String(name));
    },
    remove(name) {
      set.delete(String(name));
    },
    contains(name) {
      return set.has(String(name));
    },
    toggle(name, force) {
      const key = String(name);
      const on = force === undefined ? !set.has(key) : !!force;
      if (on) set.add(key);
      else set.delete(key);
      return on;
    }
  };
}

function createElementStub(id) {
  return {
    id: id || "",
    value: "",
    textContent: "",
    classList: createClassList(),
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
}

function makeWorkflowStepElement(opts) {
  const row = opts || {};
  const fields = {
    title: row.title || "Design Page",
    roleLabel: row.roleLabel || "",
    promptId: row.promptId || "",
    inputKind: row.inputKind || "text",
    outputName: row.outputName || "page",
    notes: row.notes || ""
  };
  return {
    classList: createClassList(["workflow-step"]),
    getAttribute(name) {
      if (name === "data-step-id") return row.id || "dp";
      if (name === "data-canonical-step-id") return row.canonical_step_id || "step_design_page";
      if (name === "data-domain-version") return row.domain_version || "";
      if (name === "data-prompt-source") return row.prompt_source_type || "none";
      return null;
    },
    querySelector(sel) {
      const match = String(sel || "").match(/\[data-field="([^"]+)"\]/);
      if (!match) return null;
      const key = match[1];
      if (!Object.prototype.hasOwnProperty.call(fields, key)) return null;
      return {
        value: fields[key],
        hasAttribute() {
          return false;
        },
        getAttribute() {
          return null;
        }
      };
    },
    querySelectorAll() {
      return [];
    },
    hasAttribute() {
      return false;
    }
  };
}

function enterRunMode(byId) {
  byId.workflowDetail.classList.add("run-mode");
  byId.workflowDetail.classList.remove("edit-mode");
  byId.workflowModeRunBtn.classList.add("active");
  byId.workflowModeEditBtn.classList.remove("active");
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const byId = {};
  [
    "workflowDetail",
    "workflowModeRunBtn",
    "workflowModeEditBtn",
    "workflowModeSettingsBtn",
    "unifiedWorkflowSettingsPanel",
    "workflowName",
    "workflowLibraryTags",
    "workflowLibraryNotes",
    "workflowArtefacts",
    "workflowOutputs",
    "workflowAudience",
    "workflowGoal",
    "workflowConstraints",
    "workflowSteps",
    "workflowModeSettingsBadge",
    "unifiedWorkflowSettingsHint",
    "unifiedWorkflowSettingsSaveHint",
    "unifiedWorkflowSettingsOptions"
  ].forEach((id) => {
    byId[id] = createElementStub(id);
  });
  byId.workflowModeRunBtn.classList = createClassList();
  byId.workflowModeEditBtn.classList = createClassList(["active"]);
  byId.workflowModeSettingsBtn.classList = createClassList();
  byId.workflowDetail.classList = createClassList(["edit-mode"]);
  byId.unifiedWorkflowSettingsPanel.classList = createClassList(["hidden"]);
  byId.workflowSteps.children = [];

  const documentStub = {
    readyState: "complete",
    body: createElementStub("body"),
    documentElement: createElementStub("html"),
    getElementById(id) {
      if (!byId[id]) byId[id] = createElementStub(id);
      return byId[id];
    },
    querySelector() {
      return createElementStub("qs");
    },
    querySelectorAll() {
      return [];
    },
    createElement(tag) {
      return createElementStub(tag);
    },
    addEventListener() {}
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    localStorage: { getItem: () => null, setItem() {} },
    Utils: { debounce: (fn) => fn, uuid: () => "uuid-test" }
  };
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    document: documentStub,
    window: windowStub,
    _: { debounce: (fn) => fn }
  };
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, [
    "lib/ld-design-page-partial-contract.js",
    "lib/ld-design-page-compose-contract.js"
  ]);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, byId };
}

function persistedPartialWorkflow() {
  return {
    id: "wf-partial-migrated",
    name: "Migrated partial",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      audience: "Learners",
      goal: "Learner page",
      constraints: "",
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    steps: [
      {
        id: "ep",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dla",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities"
      },
      {
        id: "gam",
        title: "Generate Activity Materials",
        outputName: "page",
        canonical_step_id: "step_generate_activity_materials"
      },
      {
        id: "ls",
        title: "Construct Learning Sequence",
        outputName: "page",
        canonical_step_id: "step_construct_learning_sequence"
      },
      {
        id: "dp",
        title: "Design Page",
        outputName: "page",
        canonical_step_id: "step_design_page",
        override_prompt_body: "Assemble learner page.",
        prompt_source_type: "local_override"
      }
    ]
  };
}

test("A: flag-only explicit workflow retains Sprint 58 flags and borrows steps", () => {
  const { api } = loadPrismTestApi();
  const persisted = persistedPartialWorkflow();
  persisted.pageEnrichmentV2 = false;
  persisted.partialPageOutputs = false;
  persisted.workflowOutputSpec.pageEnrichmentV2 = false;
  persisted.workflowOutputSpec.partialPageOutputs = false;
  api.setWorkflowsForTest([persisted]);
  api.setSelectedWorkflowIdForTest(persisted.id);

  const resolved = api.resolveWorkflowForUpstreamArtefacts({
    workflow: {
      id: persisted.id,
      pageEnrichmentV2: true,
      partialPageOutputs: true
    }
  });
  assert.ok(resolved);
  assert.equal(resolved.pageEnrichmentV2, true);
  assert.equal(resolved.partialPageOutputs, true);
  assert.equal(resolved.workflowOutputSpec.pageEnrichmentV2, true);
  assert.equal(resolved.workflowOutputSpec.partialPageOutputs, true);
  assert.ok(Array.isArray(resolved.steps));
  assert.ok(resolved.steps.length >= 5);
  assert.equal(api.isPartialPageOutputWorkflowEnabled(resolved), true);
});

test("B: run-mode gathered steps merge Sprint 58 flags from persisted workflow", () => {
  const { api, byId } = loadPrismTestApi();
  const persisted = persistedPartialWorkflow();
  api.setWorkflowsForTest([persisted]);
  api.setSelectedWorkflowIdForTest(persisted.id);
  api.setWorkflowStepElementsForTest(
    persisted.steps.map((step) =>
      makeWorkflowStepElement({
        id: step.id,
        title: step.title,
        outputName: step.outputName,
        canonical_step_id: step.canonical_step_id
      })
    )
  );
  enterRunMode(byId);
  assert.equal(byId.workflowDetail.classList.contains("run-mode"), true);

  const resolved = api.resolveWorkflowForUpstreamArtefacts({});
  assert.ok(resolved);
  assert.ok(Array.isArray(resolved.steps));
  assert.ok(resolved.steps.length >= 5);
  assert.equal(resolved.pageEnrichmentV2, true);
  assert.equal(resolved.partialPageOutputs, true);
  assert.equal(resolved.workflowOutputSpec.pageEnrichmentV2, true);
  assert.equal(resolved.workflowOutputSpec.partialPageOutputs, true);
  assert.equal(api.isPartialPageOutputWorkflowEnabled(resolved), true);
});

test("C: explicit partialPageOutputs false is not overwritten by persisted true", () => {
  const { api } = loadPrismTestApi();
  const persisted = persistedPartialWorkflow();
  api.setWorkflowsForTest([persisted]);
  api.setSelectedWorkflowIdForTest(persisted.id);

  const resolved = api.resolveWorkflowForUpstreamArtefacts({
    workflow: {
      id: persisted.id,
      pageEnrichmentV2: true,
      partialPageOutputs: false,
      steps: persisted.steps.slice()
    }
  });
  assert.equal(resolved.partialPageOutputs, false);
  assert.equal(resolved.workflowOutputSpec.partialPageOutputs, false);
  assert.equal(api.isPartialPageOutputWorkflowEnabled(resolved), false);

  const dpStep = {
    canonical_step_id: "step_design_page",
    title: "Design Page",
    outputName: "page"
  };
  const prompt = api
    .applyWorkflowStepRuntimePromptAugmentations("Assemble learner page.\n", dpStep, resolved, {})
    .trim();
  assert.match(prompt, COMPOSE_MARKER);
  assert.doesNotMatch(prompt, PARTIAL_MARKER);
});

test("D1: Design Page prompt with flag-only stub injects partial and excludes compose", () => {
  const { api } = loadPrismTestApi();
  const persisted = persistedPartialWorkflow();
  api.setWorkflowsForTest([persisted]);
  api.setSelectedWorkflowIdForTest(persisted.id);

  const flagOnly = {
    id: persisted.id,
    pageEnrichmentV2: true,
    partialPageOutputs: true
  };
  const prompt = api
    .applyWorkflowStepRuntimePromptAugmentations(
      "Assemble learner page.\n",
      {
        canonical_step_id: "step_design_page",
        title: "Design Page",
        outputName: "page"
      },
      flagOnly,
      {}
    )
    .trim();
  assert.match(prompt, PARTIAL_MARKER);
  assert.doesNotMatch(prompt, COMPOSE_MARKER);
  assert.doesNotMatch(prompt, LEGACY_UPSTREAM_INJECTION);
});

test("D2: run-mode resolved workflow keeps partial Design Page prompt surface", () => {
  const { api, byId } = loadPrismTestApi();
  const persisted = persistedPartialWorkflow();
  api.setWorkflowsForTest([persisted]);
  api.setSelectedWorkflowIdForTest(persisted.id);
  api.setWorkflowStepElementsForTest(
    persisted.steps.map((step) =>
      makeWorkflowStepElement({
        id: step.id,
        title: step.title,
        outputName: step.outputName,
        canonical_step_id: step.canonical_step_id
      })
    )
  );
  enterRunMode(byId);

  const resolved = api.resolveWorkflowForUpstreamArtefacts({});
  const prompt = api
    .applyWorkflowStepRuntimePromptAugmentations(
      "Assemble learner page.\n",
      {
        canonical_step_id: "step_design_page",
        title: "Design Page",
        outputName: "page"
      },
      resolved,
      {}
    )
    .trim();
  assert.match(prompt, PARTIAL_MARKER);
  assert.doesNotMatch(prompt, COMPOSE_MARKER);
  assert.doesNotMatch(prompt, /GAM Content: bodies already present in the conversation/i);
  assert.doesNotMatch(prompt, /WHOLE-BLOCK MATERIAL EXTRACTION/i);
  assert.equal(api.shouldInjectUpstreamCaptureIntoPrompt(
    {
      id: "dp",
      title: "Design Page",
      outputName: "page",
      canonical_step_id: "step_design_page"
    },
    resolved
  ), false);
});

test("Live smoke: run-mode Design Page instructions omit compose for migrated partial workflow", () => {
  const { api, byId } = loadPrismTestApi();
  const persisted = persistedPartialWorkflow();
  api.setWorkflowsForTest([persisted]);
  api.setSelectedWorkflowIdForTest(persisted.id);
  api.setWorkflowStepElementsForTest(
    persisted.steps.map((step) =>
      makeWorkflowStepElement({
        id: step.id,
        title: step.title,
        outputName: step.outputName,
        canonical_step_id: step.canonical_step_id,
        prompt_source_type: step.prompt_source_type || "none"
      })
    )
  );
  enterRunMode(byId);

  const dpStep = persisted.steps.find((s) => s.canonical_step_id === "step_design_page");
  const instructions = api.buildWorkflowStepInstructions(dpStep, 4, null);
  assert.match(instructions, /partial page artefact|page_synthesis|partial page output mode/i);
  assert.doesNotMatch(instructions, COMPOSE_MARKER);
  assert.doesNotMatch(instructions, /Upstream Learning Sequence page/i);
  assert.doesNotMatch(instructions, /GAM Content: bodies already present/i);
  assert.doesNotMatch(instructions, /activity_materials bodies are not present/i);
});

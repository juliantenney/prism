/**
 * Selecting a Completed workflow must not flip it to Authoring, bump Updated,
 * or erase hydrate-cache / durable completion evidence.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function createElementStub() {
  const el = {
    value: "",
    textContent: "",
    className: "",
    children: [],
    style: {},
    dataset: {},
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    appendChild(node) {
      this.children.push(node);
      return node;
    },
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
  return el;
}

function boot() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById(id) {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const memoryStorage = Object.create(null);
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, formatDate: () => "today" },
    localStorage: {
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(memoryStorage, key)
          ? memoryStorage[key]
          : null;
      },
      setItem(key, value) {
        memoryStorage[key] = String(value);
      },
      removeItem(key) {
        delete memoryStorage[key];
      }
    },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
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
      "lib/learning-journey-workflow-hierarchy.js",
      "lib/workflow-list-presentation.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "expected __PRISM_TEST_API");
  windowStub.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = {
    assessRequiredGraphicsCompletion: function (page, runRecord) {
      const required = (
        Array.isArray(page && page.visual_affordances) ? page.visual_affordances : []
      ).filter(function (row) {
        return String((row && row.visual_decision) || "").toLowerCase() === "generate";
      });
      if (!required.length) {
        return {
          determinable: true,
          complete: true,
          zeroRequired: true,
          requiredCount: 0,
          attachedCount: 0,
          reason: "zero_required_graphics_jobs"
        };
      }
      const refs = Array.isArray(runRecord && runRecord.workflowResourceRefs)
        ? runRecord.workflowResourceRefs
        : [];
      const assets =
        runRecord && runRecord.assetsByBriefId && typeof runRecord.assetsByBriefId === "object"
          ? runRecord.assetsByBriefId
          : {};
      const attached = required.filter(function (row) {
        const bid = String((row && row.brief_id) || "").trim();
        if (bid && assets[bid]) return true;
        return refs.some(function (ref) {
          return String((ref && (ref.brief_id || ref.briefId)) || "").trim() === bid;
        });
      }).length;
      return {
        determinable: true,
        complete: attached >= required.length,
        zeroRequired: false,
        requiredCount: required.length,
        attachedCount: attached,
        reason:
          attached >= required.length
            ? "all_required_graphics_complete"
            : "required_graphics_outstanding"
      };
    }
  };
  return { api, window: windowStub };
}

function interactiveSteps() {
  return [
    { id: "s1", title: "Learning Outcomes", canonical_step_id: "step_learning_outcomes" },
    { id: "dp", title: "Design Page", canonical_step_id: "step_design_page" }
  ];
}

function completedPage(extras) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Completed page",
      activities: [],
      visual_affordances: []
    },
    extras || {}
  );
}

function seedCompletedWorkflow(api, id, options) {
  const opts = options || {};
  const steps = interactiveSteps();
  const wf = {
    id: id,
    name: opts.name || id,
    product: opts.product || "interactive",
    steps,
    updatedAt: opts.updatedAt || 1000,
    sourceWorkflowId: opts.sourceWorkflowId || "",
    sourceCommissionId: opts.sourceCommissionId || ""
  };
  const page = completedPage(opts.pageExtras);
  const resourceRefs = Array.isArray(opts.workflowResourceRefs)
    ? opts.workflowResourceRefs
    : [];
  api.setWorkflowsForTest([wf].concat(opts.extraWorkflows || []));
  api.setWorkflowRunStateStoreForTest({
    [id]: {
      captureRefs: {
        dp: { final: { resource_id: "res-" + id, slot_key: "run_capture:dp:final" } }
      },
      workflowResourceRefs: resourceRefs.slice(),
      stepCompleted: { dp: true }
    }
  });
  api.clearWorkflowListStatusEvidenceCacheForTest(id);
  api.writeWorkflowListStatusEvidenceCacheForTest(id, {
    authoritativeAssembledPage: page,
    workflowResourceRefs: resourceRefs.length
      ? resourceRefs.slice()
      : opts.cacheResourceRefs
        ? opts.cacheResourceRefs.slice()
        : [],
    assetsByBriefId: opts.assetsByBriefId || {}
  });
  return { wf, page, steps };
}

test("selecting Completed workflow keeps Completed (zero required graphics)", () => {
  const { api } = boot();
  const { wf } = seedCompletedWorkflow(api, "wf-done");
  api.setActiveMainTabForTest("workflows");
  api.setSelectedWorkflowIdForTest(null);

  const before = api.resolveWorkflowListAuthoringStatusForTest(wf);
  assert.equal(before.status, "completed");

  api.selectWorkflowForTest("wf-done");
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-done");
  const after = api.resolveWorkflowListAuthoringStatusForTest(wf);
  assert.equal(after.status, "completed");
});

test("selecting Completed workflow keeps Completed when attachments exist only in status cache", () => {
  const { api } = boot();
  const cacheRefs = [
    {
      resource_id: "res-graphic",
      brief_id: "brief-1",
      affordance_id: "va1",
      lifecycle_state: "active"
    }
  ];
  const { wf } = seedCompletedWorkflow(api, "wf-graphic", {
    pageExtras: {
      visual_affordances: [
        { affordance_id: "va1", visual_decision: "generate", brief_id: "brief-1" }
      ]
    },
    workflowResourceRefs: [],
    cacheResourceRefs: cacheRefs,
    assetsByBriefId: { "brief-1": { mime_type: "image/png" } }
  });
  api.setActiveMainTabForTest("workflows");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(wf).status, "completed");
  api.selectWorkflowForTest("wf-graphic");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(wf).status, "completed");
});

test("Incomplete and Authoring statuses are unchanged by selection alone", () => {
  const { api } = boot();
  const incomplete = {
    id: "wf-incomplete",
    name: "Incomplete WF",
    product: "interactive",
    steps: interactiveSteps(),
    updatedAt: 10
  };
  const authoring = {
    id: "wf-authoring",
    name: "Authoring WF",
    product: "interactive",
    steps: interactiveSteps(),
    updatedAt: 20
  };
  api.setWorkflowsForTest([incomplete, authoring]);
  api.setWorkflowRunStateStoreForTest({
    "wf-incomplete": {
      captureRefs: {
        s1: { final: { resource_id: "res-s1", slot_key: "run_capture:s1:final" } }
      }
    },
    "wf-authoring": {
      captureRefs: {
        dp: { final: { resource_id: "res-dp", slot_key: "run_capture:dp:final" } }
      },
      workflowResourceRefs: []
    }
  });
  api.clearWorkflowListStatusEvidenceCacheForTest();
  api.writeWorkflowListStatusEvidenceCacheForTest("wf-authoring", {
    authoritativeAssembledPage: completedPage({
      visual_affordances: [
        { affordance_id: "va1", visual_decision: "generate", brief_id: "brief-1" }
      ]
    }),
    workflowResourceRefs: [],
    assetsByBriefId: {}
  });
  api.setActiveMainTabForTest("workflows");

  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(incomplete).status, "incomplete");
  api.selectWorkflowForTest("wf-incomplete");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(incomplete).status, "incomplete");

  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(authoring).status, "authoring");
  api.selectWorkflowForTest("wf-authoring");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(authoring).status, "authoring");
});

test("Authoring tab empty live attachments can reopen Authoring after Completed", () => {
  const { api } = boot();
  const refs = [
    {
      resource_id: "res-1",
      brief_id: "brief-1",
      affordance_id: "va1",
      lifecycle_state: "active"
    }
  ];
  const { wf } = seedCompletedWorkflow(api, "wf-auth-remove", {
    pageExtras: {
      visual_affordances: [
        { affordance_id: "va1", visual_decision: "generate", brief_id: "brief-1" }
      ]
    },
    workflowResourceRefs: refs,
    cacheResourceRefs: refs
  });
  api.setActiveMainTabForTest("workflows");
  api.selectWorkflowForTest("wf-auth-remove");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(wf).status, "completed");

  // Genuine Authoring remove: empty live refs + authoritative Authoring overlay.
  // Keep the page body (still has required generate jobs) but clear attachments.
  api.setActiveMainTabForTest("utilities");
  api.setWorkflowResourceRefsForTest([]);
  api.setWorkflowRunStateStoreForTest({
    "wf-auth-remove": {
      captureRefs: {
        dp: { final: { resource_id: "res-wf-auth-remove", slot_key: "run_capture:dp:final" } }
      },
      workflowResourceRefs: []
    }
  });
  api.writeWorkflowListStatusEvidenceCacheForTest("wf-auth-remove", {
    authoritativeAssembledPage: completedPage({
      visual_affordances: [
        { affordance_id: "va1", visual_decision: "generate", brief_id: "brief-1" }
      ]
    }),
    workflowResourceRefs: [],
    assetsByBriefId: {}
  });
  assert.equal(api.getActiveMainTabForTest(), "utilities");
  assert.deepEqual(api.getWorkflowResourceRefsForTest(), []);
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(wf).status, "authoring");
});

test("selection does not bump Updated timestamp", () => {
  const { api } = boot();
  const other = {
    id: "wf-other",
    name: "Other",
    product: "interactive",
    steps: interactiveSteps(),
    updatedAt: 4444
  };
  const { wf } = seedCompletedWorkflow(api, "wf-ts", {
    updatedAt: 5555,
    extraWorkflows: [other]
  });
  api.setActiveMainTabForTest("workflows");
  api.selectWorkflowForTest("wf-other");
  api.selectWorkflowForTest("wf-ts");
  const workflows = api.getWorkflowsForTest();
  assert.equal(workflows.find((row) => row.id === "wf-ts").updatedAt, 5555);
  assert.equal(workflows.find((row) => row.id === "wf-other").updatedAt, 4444);
});

test("Learning Journey parent Completed stays Completed when selected", () => {
  const { api } = boot();
  const lj = {
    id: "wf-lj",
    name: "The Slippery Case",
    product: "learning_journey",
    steps: [{ id: "dp", title: "Design Page", canonical_step_id: "step_design_page" }],
    updatedAt: 900
  };
  const child = {
    id: "wf-child",
    name: "Child Interactive",
    product: "interactive",
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c1",
    steps: interactiveSteps(),
    updatedAt: 901
  };
  api.setWorkflowsForTest([lj, child]);
  api.setWorkflowRunStateStoreForTest({
    "wf-lj": {
      captureRefs: {
        dp: { final: { resource_id: "res-lj", slot_key: "run_capture:dp:final" } }
      }
    },
    "wf-child": {
      captureRefs: {
        dp: { final: { resource_id: "res-child", slot_key: "run_capture:dp:final" } }
      }
    }
  });
  api.clearWorkflowListStatusEvidenceCacheForTest();
  api.writeWorkflowListStatusEvidenceCacheForTest("wf-lj", {
    authoritativeAssembledPage: completedPage({ title: "The Slippery Case" }),
    workflowResourceRefs: [],
    assetsByBriefId: {}
  });
  api.writeWorkflowListStatusEvidenceCacheForTest("wf-child", {
    authoritativeAssembledPage: completedPage({ title: "Child" }),
    workflowResourceRefs: [],
    assetsByBriefId: {}
  });
  api.setActiveMainTabForTest("workflows");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(lj).status, "completed");
  api.selectWorkflowForTest("wf-lj");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(lj).status, "completed");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(child).status, "completed");
});

test("tab switch workflows→run inspection does not reopen Authoring for Completed", () => {
  const { api } = boot();
  const { wf } = seedCompletedWorkflow(api, "wf-tab");
  api.setActiveMainTabForTest("workflows");
  api.selectWorkflowForTest("wf-tab");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(wf).status, "completed");
  api.setWorkflowDetailModeForTest("run");
  api.setActiveMainTabForTest("workflows");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(wf).status, "completed");
});

test("Completed status survives reload-like deselection with cache retained", () => {
  const { api } = boot();
  const { wf } = seedCompletedWorkflow(api, "wf-reload");
  api.setActiveMainTabForTest("workflows");
  api.selectWorkflowForTest("wf-reload");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(wf).status, "completed");
  // Simulate leaving the workflow then returning after a soft reload of live maps.
  api.setSelectedWorkflowIdForTest(null);
  api.setWorkflowResourceRefsForTest([]);
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(wf).status, "completed");
  api.selectWorkflowForTest("wf-reload");
  assert.equal(api.resolveWorkflowListAuthoringStatusForTest(wf).status, "completed");
});

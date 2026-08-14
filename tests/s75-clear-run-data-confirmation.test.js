/**
 * Sprint 75 — Clear run data requires confirmation before mutation.
 */

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");
const workflowResources = require("../lib/prism-workflow-resources.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const RUNKEY = "promptr.workflows.runstate.v1";
const WFKEY = "promptr.workflows.v1";

function createElementStub(tagName) {
  const tag = String(tagName || "div").toUpperCase();
  const el = {
    tagName: tag,
    value: "",
    textContent: "",
    innerHTML: "",
    open: false,
    returnValue: "",
    className: "",
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
    style: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener(type, fn) {
      if (!this.__listeners) this.__listeners = Object.create(null);
      if (!this.__listeners[type]) this.__listeners[type] = [];
      this.__listeners[type].push(fn);
    },
    removeEventListener(type, fn) {
      if (!this.__listeners || !this.__listeners[type]) return;
      this.__listeners[type] = this.__listeners[type].filter((h) => h !== fn);
    },
    focus() {
      this.__focused = true;
    },
    click() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    showModal() {
      this.open = true;
    },
    close() {
      this.open = false;
      const handlers = (this.__listeners && this.__listeners.close) || [];
      handlers.forEach((fn) => fn());
    }
  };
  if (tag === "DIALOG") {
    el.showModal = function () {
      this.open = true;
    };
  }
  return el;
}

function makeStorage(seed) {
  const storage = Object.assign({}, seed || {});
  return {
    storage,
    localStorage: {
      getItem(k) {
        return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null;
      },
      setItem(k, v) {
        storage[k] = String(v);
      },
      removeItem(k) {
        delete storage[k];
      }
    }
  };
}

function boot(options) {
  const opts = options && typeof options === "object" ? options : {};
  const { storage, localStorage } = makeStorage(opts.seedStorage);
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const revokedUrls = [];
  const elementStore = new Map();
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
  const dialog = createElementStub("dialog");
  dialog.returnValue = "";
  [
    "clearWorkflowRunDataConfirmDialog",
    "clearWorkflowRunDataConfirmTitle",
    "clearWorkflowRunDataConfirmBody",
    "clearWorkflowRunDataConfirmCancel",
    "clearWorkflowRunDataConfirmSubmit",
    "workflowSteps"
  ].forEach((id) => {
    elementStore.set(id, id === "clearWorkflowRunDataConfirmDialog" ? dialog : createElementStub("div"));
  });

  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "uuid-test" },
    localStorage,
    confirm: typeof opts.confirm === "function" ? opts.confirm : () => false,
    URL: {
      createObjectURL: () => "blob:test",
      revokeObjectURL(url) {
        revokedUrls.push(String(url || ""));
      }
    },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  workflowResources.resetStorageBackendForTests();
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, storage, dialog, elementStore, revokedUrls };
}

function assertRunDataCleared(storage, workflowId) {
  const raw = storage[RUNKEY];
  if (!raw) return;
  const store = JSON.parse(raw);
  const rec = store[workflowId];
  if (!rec) return;
  assert.equal(Object.keys(rec.capturedOutputs || {}).length, 0);
  assert.equal(Object.keys(rec.capturedOutputsRaw || {}).length, 0);
  assert.equal(Object.keys(rec.captureRefs || {}).length, 0);
  assert.equal(Object.keys(rec.stepCompleted || {}).length, 0);
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const appSource = fs.readFileSync(appJsPath, "utf8");

test("A: Markup exposes accessible clear-run-data confirmation dialog", () => {
  assert.match(indexHtml, /id="clearWorkflowRunDataConfirmDialog"/);
  assert.match(indexHtml, /aria-labelledby="clearWorkflowRunDataConfirmTitle"/);
  assert.match(indexHtml, /aria-describedby="clearWorkflowRunDataConfirmBody"/);
  assert.match(indexHtml, /id="clearWorkflowRunDataConfirmCancel"[\s\S]*?\bautofocus\b/);
  assert.match(indexHtml, /class="btn small danger"[\s\S]*id="clearWorkflowRunDataConfirmSubmit"/);
  assert.match(indexHtml, /Clear run data/);
  assert.match(indexHtml, /src="app\.js\?v=/);
});

test("B: Confirmation copy identifies the selected workflow", () => {
  const { api } = boot();
  const copy = api.buildClearWorkflowRunDataConfirmCopyForTest("Roman Roads");
  assert.equal(copy.title, 'Clear run data for "Roman Roads"?');
  assert.match(copy.body, /Run progress, captured data and generated assets/);
  assert.match(copy.body, /workflow itself and its settings will not be deleted/);
  assert.match(copy.body, /cannot be undone/i);
});

test("C: Cancel leaves run state and workflow definition untouched", async () => {
  const wf = {
    id: "wf-clear-1",
    name: "Demo Workflow",
    createdAt: 1000,
    updatedAt: 2000,
    steps: [{ id: "step-1", title: "Step 1" }]
  };
  const runRecord = {
    runIndex: 1,
    stepCompleted: { "step-1": true },
    capturedOutputs: { "step-1": "{\"ok\":true}" }
  };
  const { api, storage, dialog } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wf]),
      [RUNKEY]: JSON.stringify({ "wf-clear-1": runRecord })
    }
  });

  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wf))]);
  api.setSelectedWorkflowIdForTest("wf-clear-1");
  api.setWorkflowRunCapturedOutputsForTest({ "step-1": "{\"ok\":true}" });
  api.saveWorkflowsForTest();

  dialog.returnValue = "cancel";
  const cancelPromise = api.requestClearWorkflowRunDataConfirmationForTest("Demo Workflow");
  dialog.close();
  assert.equal(await cancelPromise, false);

  assert.ok(storage[RUNKEY].includes("wf-clear-1"));
  assert.equal(api.getWorkflowsForTest().length, 1);
  assert.equal(api.getWorkflowsForTest()[0].name, "Demo Workflow");
  assert.equal(api.getWorkflowsForTest()[0].steps[0].id, "step-1");
});

test("D: Confirm invokes existing cleanup without changing workflow definition", async () => {
  const wf = {
    id: "wf-clear-2",
    name: "Keep Definition",
    createdAt: 1000,
    updatedAt: 2000,
    steps: [{ id: "step-a", title: "Step A" }]
  };
  const runRecord = {
    runIndex: 2,
    stepCompleted: { "step-a": true },
    capturedOutputs: { "step-a": "{\"done\":true}" }
  };
  const { api, storage, dialog } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wf]),
      [RUNKEY]: JSON.stringify({ "wf-clear-2": runRecord })
    }
  });

  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wf))]);
  api.setSelectedWorkflowIdForTest("wf-clear-2");
  api.setWorkflowRunCapturedOutputsForTest({ "step-a": "{\"done\":true}" });
  api.saveWorkflowsForTest();

  dialog.returnValue = "confirm";
  const confirmPromise = api.requestClearWorkflowRunDataConfirmationForTest("Keep Definition");
  dialog.close();
  assert.equal(await confirmPromise, true);

  await api.executeClearWorkflowRunDataForTest("wf-clear-2");

  const runStore = JSON.parse(storage[RUNKEY] || "{}");
  assert.equal(runStore["wf-clear-2"], undefined);
  assert.equal(api.getWorkflowsForTest().length, 1);
  assert.equal(api.getWorkflowsForTest()[0].id, "wf-clear-2");
  assert.equal(api.getWorkflowsForTest()[0].name, "Keep Definition");
  assert.equal(api.getWorkflowsForTest()[0].steps[0].id, "step-a");
  const captureRefs = api.getWorkflowRunCaptureRefsForTest();
  assert.equal(Object.keys(captureRefs).length, 0);
  assert.equal(Object.keys(api.getWorkflowRunCapturedOutputsForTest()).length, 0);
});

test("E: handleClearWorkflowRunData waits for confirmation before cleanup", async () => {
  const wf = {
    id: "wf-clear-3",
    name: "Gate Test",
    steps: [{ id: "s1", title: "One" }]
  };
  const { api, storage, dialog } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wf]),
      [RUNKEY]: JSON.stringify({
        "wf-clear-3": { capturedOutputs: { s1: "{}" } }
      })
    }
  });

  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wf))]);
  api.setSelectedWorkflowIdForTest("wf-clear-3");
  api.setWorkflowRunCapturedOutputsForTest({ s1: "{}" });

  dialog.returnValue = "confirm";
  const handlePromise = api.handleClearWorkflowRunDataForTest();
  dialog.close();
  await handlePromise;

  assertRunDataCleared(storage, "wf-clear-3");
  assert.equal(Object.keys(api.getWorkflowRunCapturedOutputsForTest()).length, 0);
  assert.match(appSource, /requestClearWorkflowRunDataConfirmation/);
  assert.match(appSource, /executeClearWorkflowRunData\(/);
  assert.match(appSource, /if \(!confirmed\) return;/);
});

test("F: executeClearWorkflowRunData preserves existing cleanup semantics", () => {
  const start = appSource.indexOf("function executeClearWorkflowRunData");
  assert.ok(start > 0);
  const end = appSource.indexOf("\n  function requestClearWorkflowRunDataConfirmation", start);
  const body = appSource.slice(start, end > 0 ? end : start + 600);
  assert.match(body, /deleteGeneratedVisualJobImagesForWorkflow/);
  assert.match(body, /resetLiveGraphicsStateForClearedRun/);
  assert.doesNotMatch(body, /deleteResourcesForWorkflow\(/);
  assert.match(body, /clearWorkflowRunCaptureState\(/);
  assert.match(body, /resetWorkflowRunNavigationState\(/);
  assert.match(body, /updateWorkflowRunView\(/);
  assert.match(body, /Run data cleared\./);
});

const TINY_PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

function pngBlob() {
  if (typeof Blob !== "undefined") {
    return new Blob([TINY_PNG_BYTES], { type: "image/png" });
  }
  return TINY_PNG_BYTES;
}

test("G: Clear Run Data deletes run-owned generated images and preserves authoring resources", async () => {
  const assetsMod = require("../lib/prism-visual-assets.js");
  const workspaceMod = require("../lib/utilities-visual-jobs-workspace.js");
  const wf = { id: "wf-g", name: "Graphics Clear", steps: [{ id: "s1", title: "One" }] };
  const { api, storage, revokedUrls } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wf]),
      [RUNKEY]: JSON.stringify({
        "wf-g": { capturedOutputs: { s1: "{}" }, workflowResourceRefs: [{ resource_id: "wr-keep" }] }
      })
    }
  });

  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wf))]);
  api.setSelectedWorkflowIdForTest("wf-g");

  const img1 = await workflowResources.putBinaryResource({
    workflow_id: "wf-g",
    affordance_id: "va-job-1",
    brief_id: "vb-1",
    mime_type: "image/png",
    payload_blob: pngBlob(),
    byte_size: TINY_PNG_BYTES.length
  });
  const img2 = await workflowResources.putBinaryResource({
    workflow_id: "wf-g",
    affordance_id: "va-job-2",
    brief_id: "vb-2",
    mime_type: "image/png",
    payload_blob: pngBlob(),
    byte_size: TINY_PNG_BYTES.length
  });
  const otherWfImg = await workflowResources.putBinaryResource({
    workflow_id: "wf-other",
    affordance_id: "va-other",
    brief_id: "vb-o",
    mime_type: "image/png",
    payload_blob: pngBlob(),
    byte_size: TINY_PNG_BYTES.length
  });
  const extraFile = await workflowResources.putBinaryFileResource({
    workflow_id: "wf-g",
    filename: "notes.png",
    mime_type: "image/png",
    payload_blob: pngBlob(),
    byte_size: TINY_PNG_BYTES.length
  });
  const video = await workflowResources.putTextResource({
    workflow_id: "wf-g",
    slot_key: "page_video_embed",
    mime_type: "text/html",
    text_payload: "<iframe src='https://example.com'></iframe>"
  });
  assert.equal(img1.ok && img2.ok && otherWfImg.ok && extraFile.ok && video.ok, true);

  api.setWorkflowResourceRefsForTest([
    { resource_id: img1.resource_id, affordance_id: "va-job-1", lifecycle_state: "active" },
    { resource_id: img2.resource_id, affordance_id: "va-job-2", lifecycle_state: "active" }
  ]);
  api.setUtilitiesOutputWorkspaceForTest({
    compilerResult: {
      briefs: [
        { brief_id: "vb-1", affordance_id: "va-job-1" },
        { brief_id: "vb-2", affordance_id: "va-job-2" }
      ]
    },
    assetsByBriefId: {
      "vb-1": { resource_id: img1.resource_id },
      "vb-2": { resource_id: img2.resource_id }
    },
    assetErrorsByBriefId: { "vb-1": "" },
    visualAssetManifest: {
      manifest_version: "70.8",
      schema_version: "",
      assets: [{ brief_id: "vb-1" }, { brief_id: "vb-2" }],
      missing_brief_ids: []
    },
    rendererPlacementByBriefId: { "vb-1": {} }
  });
  api.setUtilitiesVisualAssetObjectUrlsForTest({
    "vb-1": "blob:stale-1",
    "vb-2": "blob:stale-2"
  });

  await api.executeClearWorkflowRunDataForTest("wf-g");

  const remainingG = await workflowResources.listActiveResources("wf-g");
  const remainingIds = remainingG.map((row) => row.resource_id).sort();
  assert.equal(remainingIds.includes(img1.resource_id), false);
  assert.equal(remainingIds.includes(img2.resource_id), false);
  assert.equal(remainingIds.includes(extraFile.resource_id), true);
  assert.equal(remainingIds.includes(video.resource_id), true);
  const remainingOther = await workflowResources.listActiveResources("wf-other");
  assert.equal(remainingOther.some((row) => row.resource_id === otherWfImg.resource_id), true);

  const extraMeta = await workflowResources.getResourceMetadata(extraFile.resource_id);
  assert.equal(String(extraMeta.affordance_id || ""), "");
  const videoMeta = await workflowResources.getResourceMetadata(video.resource_id);
  assert.equal(videoMeta.slot_key, "page_video_embed");

  assert.equal(api.getWorkflowResourceRefsForTest().length, 0);
  const ws = api.getUtilitiesOutputWorkspaceForTest();
  assert.equal(Object.keys((ws && ws.assetsByBriefId) || {}).length, 0);
  assert.equal(Array.isArray(ws && ws.visualAssetManifest && ws.visualAssetManifest.assets) ? ws.visualAssetManifest.assets.length : 0, 0);
  assert.equal(Object.keys(api.getUtilitiesVisualAssetObjectUrlsForTest()).length, 0);
  assert.ok(revokedUrls.includes("blob:stale-1"));
  assert.ok(revokedUrls.includes("blob:stale-2"));

  const runStore = JSON.parse(storage[RUNKEY] || "{}");
  assert.equal(runStore["wf-g"], undefined);

  const hydrated = await workflowResources.hydrateVisualAssetsIntoWorkspace({
    workflowId: "wf-g",
    workspace: ws,
    assetsMod,
    workspaceMod
  });
  assert.equal(hydrated.ok, true);
  assert.equal(hydrated.hydrated, 0);
  assert.equal(Object.keys(ws.assetsByBriefId || {}).length, 0);
});


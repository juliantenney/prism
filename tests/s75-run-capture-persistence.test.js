/**
 * Sprint 75 — Run capture persistence non-destructive merge (S75-D14).
 *
 * Persisted Run captures are cumulative durable state for the workflow's latest run.
 * Ordinary persistence must not interpret missing live keys as deletion.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox,
  wirePageVnextAssembleForTests
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");
const assemble = require(path.join(repoRoot, "lib", "page-vnext-assemble.js"));
const RUNKEY = "promptr.workflows.runstate.v1";

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
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

function boot() {
  const storage = {};
  const localStorage = {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null;
    },
    setItem(k, v) {
      storage[k] = String(v);
    },
    removeItem(k) {
      delete storage[k];
    }
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
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: {
      debounce: (fn) => fn,
      uuid: () => "id-" + Math.random().toString(16).slice(2)
    },
    localStorage,
    URL: { createObjectURL: () => "blob:x", revokeObjectURL() {} },
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
    PEDAGOGICAL_ICON_LIBS.concat(["lib/page-vnext-assemble.js"])
  );
  wirePageVnextAssembleForTests(windowStub, repoRoot);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, storage };
}

function keys(obj) {
  return Object.keys(obj || {}).sort();
}

function storeRec(storage, workflowId) {
  const raw = storage[RUNKEY];
  if (!raw) return null;
  const store = JSON.parse(raw);
  return store[workflowId] || null;
}

function markerTitle(page, tag) {
  const next = JSON.parse(JSON.stringify(page));
  next.title = "MARKER_" + tag;
  return next;
}

function buildPartialWorkflow(id) {
  return {
    id: id || "wf-persist-A",
    name: "Persist A",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities"
      },
      {
        id: "gam_step",
        title: "Generate Activity Materials",
        outputName: "page",
        canonical_step_id: "step_generate_activity_materials"
      },
      {
        id: "ls_step",
        title: "Construct Learning Sequence",
        outputName: "page",
        canonical_step_id: "step_construct_learning_sequence"
      },
      {
        id: "dp_step",
        title: "Design Page",
        outputName: "page",
        canonical_step_id: "step_design_page"
      }
    ]
  };
}

function selectLike(api, fromId, toId) {
  if (fromId && fromId !== toId) {
    api.persistWorkflowRunStateForWorkflowForTest(fromId, { toastType: "" });
  }
  api.restoreWorkflowRunStateForWorkflowForTest(toId);
  api.setSelectedWorkflowIdForTest(toId);
}

const epShell = loadFixture("ep-shell.json");
const dlaPartial = loadFixture("dla-partial.json");
const gamPartial = loadFixture("gam-partial.json");
const lsPartial = loadFixture("ls-partial.json");
const dpPartial = loadFixture("dp-partial.json");
const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const appSource = fs.readFileSync(appJsPath, "utf8");

const stagePages = [
  ["ep_step", markerTitle(epShell, "EP")],
  ["dla_step", markerTitle(dlaPartial, "DLA")],
  ["gam_step", markerTitle(gamPartial, "GAM")],
  ["ls_step", markerTitle(lsPartial, "CLS")],
  ["dp_step", markerTitle(dpPartial, "DP")]
];

function seedFullMaps() {
  const full = {};
  const fullRaw = {};
  const completed = {};
  stagePages.forEach(([sid, page]) => {
    full[sid] = JSON.stringify(page);
    fullRaw[sid] = JSON.stringify(page, null, 2);
    completed[sid] = true;
  });
  return { full, fullRaw, completed };
}

test("A: cumulative persistence retains earlier captures after each persist", () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfA");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const mem = {};
  const memRaw = {};
  stagePages.forEach(([sid, page], idx) => {
    mem[sid] = JSON.stringify(page);
    memRaw[sid] = JSON.stringify(page, null, 2);
    api.setWorkflowRunCapturedOutputsForTest(Object.assign({}, mem));
    api.setWorkflowRunCapturedOutputsRawForTest(Object.assign({}, memRaw));
    const result = api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });
    assert.equal(result.ok, true);
    const rec = storeRec(storage, wf.id);
    assert.deepEqual(keys(rec.capturedOutputsRaw), keys(memRaw));
    assert.match(JSON.parse(rec.capturedOutputsRaw.ep_step).title, /MARKER_EP/);
    if (idx >= 1) assert.match(JSON.parse(rec.capturedOutputsRaw.dla_step).title, /MARKER_DLA/);
    if (idx >= 4) assert.match(JSON.parse(rec.capturedOutputsRaw.dp_step).title, /MARKER_DP/);
  });
});

test("B: truncated live persist must not destroy fuller durable captures", () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfA");
  const { full, fullRaw, completed } = seedFullMaps();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest(full);
  api.setWorkflowRunCapturedOutputsRawForTest(fullRaw);
  api.setWorkflowRunStepCompletedForTest(completed);
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });
  assert.equal(keys(storeRec(storage, wf.id).capturedOutputsRaw).length, 5);

  api.setWorkflowRunCapturedOutputsForTest({ ep_step: full.ep_step });
  api.setWorkflowRunCapturedOutputsRawForTest({ ep_step: fullRaw.ep_step });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });

  const rec = storeRec(storage, wf.id);
  assert.deepEqual(keys(rec.capturedOutputsRaw), [
    "dla_step",
    "dp_step",
    "ep_step",
    "gam_step",
    "ls_step"
  ]);
  assert.match(JSON.parse(rec.capturedOutputsRaw.dla_step).title, /MARKER_DLA/);
  assert.match(JSON.parse(rec.capturedOutputsRaw.gam_step).title, /MARKER_GAM/);
});

test("C: live update wins for matching keys", () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfA");
  const oldDla = markerTitle(dlaPartial, "OLD_DLA");
  const newDla = markerTitle(dlaPartial, "NEW_DLA");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    ep_step: JSON.stringify(markerTitle(epShell, "EP")),
    dla_step: JSON.stringify(oldDla)
  });
  api.setWorkflowRunCapturedOutputsRawForTest({
    ep_step: JSON.stringify(markerTitle(epShell, "EP"), null, 2),
    dla_step: JSON.stringify(oldDla, null, 2)
  });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });

  api.setWorkflowRunCapturedOutputsForTest({
    ep_step: JSON.stringify(markerTitle(epShell, "EP")),
    dla_step: JSON.stringify(newDla)
  });
  api.setWorkflowRunCapturedOutputsRawForTest({
    ep_step: JSON.stringify(markerTitle(epShell, "EP"), null, 2),
    dla_step: JSON.stringify(newDla, null, 2)
  });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });

  const rec = storeRec(storage, wf.id);
  assert.match(JSON.parse(rec.capturedOutputsRaw.dla_step).title, /MARKER_NEW_DLA/);
  assert.doesNotMatch(JSON.parse(rec.capturedOutputsRaw.dla_step).title, /OLD_DLA/);
});

test("D/E: workflow switch A→B→A and A→B→C→A preserve A captures", () => {
  const { api, storage } = boot();
  const wfA = buildPartialWorkflow("wfA");
  const wfB = {
    id: "wfB",
    name: "B",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "ep_b",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      }
    ]
  };
  const wfC = {
    id: "wfC",
    name: "C",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "ep_c",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      }
    ]
  };
  const { full, fullRaw, completed } = seedFullMaps();
  api.setWorkflowsForTest([wfA, wfB, wfC]);
  api.setSelectedWorkflowIdForTest(wfA.id);
  api.setWorkflowRunCapturedOutputsForTest(full);
  api.setWorkflowRunCapturedOutputsRawForTest(fullRaw);
  api.setWorkflowRunStepCompletedForTest(completed);
  api.persistWorkflowRunStateForWorkflowForTest(wfA.id, { toastType: "" });

  selectLike(api, wfA.id, wfB.id);
  api.setWorkflowRunCapturedOutputsForTest({
    ep_b: JSON.stringify(markerTitle(epShell, "B"))
  });
  api.setWorkflowRunCapturedOutputsRawForTest({
    ep_b: JSON.stringify(markerTitle(epShell, "B"), null, 2)
  });
  api.persistWorkflowRunStateForWorkflowForTest(wfB.id, { toastType: "" });

  selectLike(api, wfB.id, wfA.id);
  assert.equal(keys(api.getWorkflowRunCapturedOutputsRawForTest()).length, 5);
  assert.equal(keys(storeRec(storage, wfA.id).capturedOutputsRaw).length, 5);

  selectLike(api, wfA.id, wfB.id);
  selectLike(api, wfB.id, wfC.id);
  selectLike(api, wfC.id, wfA.id);
  assert.deepEqual(keys(api.getWorkflowRunCapturedOutputsRawForTest()), [
    "dla_step",
    "dp_step",
    "ep_step",
    "gam_step",
    "ls_step"
  ]);
});

test("F: reload restores full A captures after selecting another workflow", () => {
  const first = boot();
  const wfA = buildPartialWorkflow("wfA");
  const wfB = {
    id: "wfB",
    name: "B",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "ep_b",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      }
    ]
  };
  const { full, fullRaw, completed } = seedFullMaps();
  first.api.setWorkflowsForTest([wfA, wfB]);
  first.api.setSelectedWorkflowIdForTest(wfA.id);
  first.api.setWorkflowRunCapturedOutputsForTest(full);
  first.api.setWorkflowRunCapturedOutputsRawForTest(fullRaw);
  first.api.setWorkflowRunStepCompletedForTest(completed);
  first.api.persistWorkflowRunStateForWorkflowForTest(wfA.id, { toastType: "" });
  const dump = first.storage[RUNKEY];

  const second = boot();
  second.storage[RUNKEY] = dump;
  second.api.setWorkflowsForTest([wfA, wfB]);
  second.api.setSelectedWorkflowIdForTest(wfB.id);
  second.api.restoreWorkflowRunStateForWorkflowForTest(wfB.id);
  assert.equal(keys(storeRec(second.storage, wfA.id).capturedOutputsRaw).length, 5);
  selectLike(second.api, wfB.id, wfA.id);
  assert.equal(keys(second.api.getWorkflowRunCapturedOutputsRawForTest()).length, 5);
  assert.match(
    JSON.parse(second.api.getWorkflowRunCapturedOutputsRawForTest().gam_step).title,
    /MARKER_GAM/
  );
});

test("G: Authoring reconcile recovers durable captures when live is truncated", () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfA");
  const { full, fullRaw, completed } = seedFullMaps();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest(full);
  api.setWorkflowRunCapturedOutputsRawForTest(fullRaw);
  api.setWorkflowRunStepCompletedForTest(completed);
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });

  api.setWorkflowRunCapturedOutputsForTest({ ep_step: full.ep_step });
  api.setWorkflowRunCapturedOutputsRawForTest({ ep_step: fullRaw.ep_step });
  assert.equal(keys(api.getWorkflowRunCapturedOutputsRawForTest()).length, 1);
  assert.equal(keys(storeRec(storage, wf.id).capturedOutputsRaw).length, 5);

  const reconciled = api.reconcileWorkflowRunCapturesWithDurableStateForTest(wf.id);
  assert.equal(keys(reconciled.capturedOutputsRaw).length, 5);
  assert.equal(keys(api.getWorkflowRunCapturedOutputsRawForTest()).length, 5);

  const resolved = api.resolvePageForRenderOrAssembly(JSON.parse(fullRaw.dp_step), wf, {
    captures: reconciled.capturedOutputs,
    capturesRaw: reconciled.capturedOutputsRaw
  });
  assert.equal(assemble.isLearnerReadyAssembledPage(resolved), true);
  assert.equal(
    resolved.activities[0].learner_task,
    "Compare inflation drivers using evidence."
  );
  assert.ok(resolved.activities[0].materials && resolved.activities[0].materials.length);
});

test("H: Authoring live-newer overlay wins while recovering missing durable keys", () => {
  const { api } = boot();
  const wf = buildPartialWorkflow("wfA");
  const { full, fullRaw, completed } = seedFullMaps();
  const oldDla = markerTitle(dlaPartial, "OLD_DLA");
  const newDla = markerTitle(dlaPartial, "NEW_DLA");
  // Ensure new DLA still has instructional content for readiness.
  newDla.activities = JSON.parse(JSON.stringify(dlaPartial.activities));
  newDla.title = "MARKER_NEW_DLA";

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const durableFull = Object.assign({}, full, {
    dla_step: JSON.stringify(oldDla)
  });
  const durableRaw = Object.assign({}, fullRaw, {
    dla_step: JSON.stringify(oldDla, null, 2)
  });
  api.setWorkflowRunCapturedOutputsForTest(durableFull);
  api.setWorkflowRunCapturedOutputsRawForTest(durableRaw);
  api.setWorkflowRunStepCompletedForTest(completed);
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });

  api.setWorkflowRunCapturedOutputsForTest({
    ep_step: full.ep_step,
    dla_step: JSON.stringify(newDla)
  });
  api.setWorkflowRunCapturedOutputsRawForTest({
    ep_step: fullRaw.ep_step,
    dla_step: JSON.stringify(newDla, null, 2)
  });

  const reconciled = api.reconcileWorkflowRunCapturesWithDurableStateForTest(wf.id);
  assert.match(JSON.parse(reconciled.capturedOutputsRaw.dla_step).title, /MARKER_NEW_DLA/);
  assert.ok(reconciled.capturedOutputsRaw.gam_step);
  assert.ok(reconciled.capturedOutputsRaw.dp_step);

  const resolved = api.resolvePageForRenderOrAssembly(JSON.parse(fullRaw.ep_step), wf, {
    captures: reconciled.capturedOutputs,
    capturesRaw: reconciled.capturedOutputsRaw
  });
  assert.equal(resolved.activities[0].learner_task, newDla.activities[0].learner_task);
  assert.ok(resolved.activities[0].materials && resolved.activities[0].materials.length);
});

test("I: explicit Clear Run Data removes durable record and merge cannot resurrect", () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfA");
  const { full, fullRaw, completed } = seedFullMaps();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest(full);
  api.setWorkflowRunCapturedOutputsRawForTest(fullRaw);
  api.setWorkflowRunStepCompletedForTest(completed);
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });
  assert.ok(storeRec(storage, wf.id));

  api.clearWorkflowRunCaptureState({
    workflowId: wf.id,
    resetIndex: true,
    clearDom: false
  });
  assert.equal(storeRec(storage, wf.id), null);
  assert.deepEqual(keys(api.getWorkflowRunCapturedOutputsRawForTest()), []);

  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });
  const rec = storeRec(storage, wf.id);
  assert.ok(rec);
  assert.deepEqual(keys(rec.capturedOutputsRaw), []);
  assert.deepEqual(keys(rec.capturedOutputs), []);
});

test("J: C-04 paste-field visibility behaviour remains unchanged", () => {
  assert.match(appSource, /Sprint 75 C-04: show capture only when PRISM requires a page-structure artefact/);
  assert.match(appSource, /isWorkflowStepPageStructureProducer/);
  assert.match(indexHtml, /Paste the result back into PRISM|Clear run data/);
});

test("K: D13 EP-only still fails learner-ready; EP+DLA+GAM assembles", () => {
  const { api } = boot();
  const wf = buildPartialWorkflow("wfA");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    ep_step: JSON.stringify(epShell)
  });
  api.setWorkflowRunCapturedOutputsRawForTest({
    ep_step: JSON.stringify(epShell, null, 2)
  });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });
  assert.throws(
    () => api.resolvePageForRenderOrAssembly(epShell, wf, {}),
    /learner activity content needed to assemble the page/i
  );

  api.setWorkflowRunCapturedOutputsForTest({
    ep_step: JSON.stringify(epShell),
    dla_step: JSON.stringify(dlaPartial),
    gam_step: JSON.stringify(gamPartial)
  });
  api.setWorkflowRunCapturedOutputsRawForTest({
    ep_step: JSON.stringify(epShell, null, 2),
    dla_step: JSON.stringify(dlaPartial, null, 2),
    gam_step: JSON.stringify(gamPartial, null, 2)
  });
  const resolved = api.resolvePageForRenderOrAssembly(epShell, wf, {});
  assert.equal(assemble.isLearnerReadyAssembledPage(resolved), true);
});

test("L: D12 remains retired — no Presentation mode / learning_object", () => {
  assert.doesNotMatch(indexHtml, /id="utilitiesPresentationMode"/);
  assert.doesNotMatch(indexHtml, /Learning object HTML/i);
  assert.doesNotMatch(indexHtml, /value="learning_object"/);
  assert.doesNotMatch(appSource, /utilitiesPresentationMode/);
  assert.doesNotMatch(appSource, /buildUtilityLearningObjectHtml/);
});

test("merge helper: absent live keys preserve durable", () => {
  const { api } = boot();
  const merged = api.mergeWorkflowRunCaptureMapsForTest(
    { a: "1", b: "2" },
    { a: "1b" }
  );
  assert.equal(merged.a, "1b");
  assert.equal(merged.b, "2");
  assert.equal(Object.keys(merged).sort().join(","), "a,b");
});

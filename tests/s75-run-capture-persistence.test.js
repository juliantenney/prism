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
const workflowResources = require(path.join(repoRoot, "lib", "prism-workflow-resources.js"));
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

function boot(options) {
  const opts = options && typeof options === "object" ? options : {};
  const storage = {};
  let setItemCallCount = 0;
  const localStorage = {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null;
    },
    setItem(k, v) {
      setItemCallCount += 1;
      if (typeof opts.onSetItem === "function") {
        opts.onSetItem({ key: k, value: String(v), callCount: setItemCallCount });
      }
      storage[k] = String(v);
    },
    removeItem(k) {
      delete storage[k];
    },
    key(i) {
      const keys = Object.keys(storage);
      return i >= 0 && i < keys.length ? keys[i] : null;
    },
    get length() {
      return Object.keys(storage).length;
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
    setTimeout,
    clearTimeout,
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
  if (!opts.retainResourceBackend) {
    workflowResources.resetStorageBackendForTests();
  }
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
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

function buildRunLi(stepId, outputName, initialValue, canonicalStepId) {
  const ta = createElementStub();
  ta.value = String(initialValue || "");
  const output = createElementStub();
  output.value = String(outputName || "");
  const status = createElementStub();
  const attrs = {
    "data-step-id": String(stepId || ""),
    "data-canonical-step-id": String(canonicalStepId || "")
  };
  const li = createElementStub();
  li.classList.contains = (name) => name === "workflow-step";
  li.setAttribute = (name, value) => {
    attrs[name] = String(value);
  };
  li.getAttribute = (name) =>
    Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null;
  li.querySelector = (selector) => {
    if (selector === '[data-field="runStepOutput"]') return ta;
    if (selector === '[data-field="outputName"]') return output;
    if (selector === '[data-role="run-step-output-status"]') return status;
    return null;
  };
  return { li, ta };
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

async function selectLikeAsync(api, fromId, toId) {
  selectLike(api, fromId, toId);
  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(toId);
}

async function persistMapsAsRefs(api, wfId, finalMap, rawMap, stepCompleted) {
  const refs = {};
  const keysList = Object.keys(rawMap || {});
  for (const sid of keysList) {
    const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
      wfId,
      sid,
      rawMap[sid],
      finalMap[sid] != null ? finalMap[sid] : rawMap[sid]
    );
    assert.equal(put.ok, true, JSON.stringify(put));
    refs[sid] = put.refs;
  }
  api.setWorkflowRunCaptureRefsForTest(refs);
  api.setWorkflowRunCapturedOutputsForTest(finalMap);
  api.setWorkflowRunCapturedOutputsRawForTest(rawMap);
  if (stepCompleted) api.setWorkflowRunStepCompletedForTest(stepCompleted);
  return api.persistWorkflowRunStateForWorkflowForTest(wfId, { toastType: "" });
}

function assertNoInlineBodies(rec) {
  assert.equal(Object.keys(rec.capturedOutputs || {}).length, 0);
  assert.equal(Object.keys(rec.capturedOutputsRaw || {}).length, 0);
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

test("A: cumulative persistence retains earlier capture refs after each persist", async () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfA");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const mem = {};
  const memRaw = {};
  for (let idx = 0; idx < stagePages.length; idx += 1) {
    const [sid, page] = stagePages[idx];
    mem[sid] = JSON.stringify(page);
    memRaw[sid] = JSON.stringify(page, null, 2);
    await persistMapsAsRefs(api, wf.id, Object.assign({}, mem), Object.assign({}, memRaw));
    const rec = storeRec(storage, wf.id);
    assertNoInlineBodies(rec);
    assert.deepEqual(keys(rec.captureRefs), keys(memRaw));
    await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
    const live = api.getWorkflowRunCapturedOutputsRawForTest();
    assert.match(JSON.parse(live.ep_step).title, /MARKER_EP/);
    if (idx >= 1) assert.match(JSON.parse(live.dla_step).title, /MARKER_DLA/);
    if (idx >= 4) assert.match(JSON.parse(live.dp_step).title, /MARKER_DP/);
  }
});

test("B: truncated live persist must not destroy fuller durable capture refs", async () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfA");
  const { full, fullRaw, completed } = seedFullMaps();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  await persistMapsAsRefs(api, wf.id, full, fullRaw, completed);
  assert.equal(keys(storeRec(storage, wf.id).captureRefs).length, 5);

  api.setWorkflowRunCaptureRefsForTest({
    ep_step: storeRec(storage, wf.id).captureRefs.ep_step
  });
  api.setWorkflowRunCapturedOutputsForTest({ ep_step: full.ep_step });
  api.setWorkflowRunCapturedOutputsRawForTest({ ep_step: fullRaw.ep_step });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });

  const rec = storeRec(storage, wf.id);
  assert.deepEqual(keys(rec.captureRefs), [
    "dla_step",
    "dp_step",
    "ep_step",
    "gam_step",
    "ls_step"
  ]);
  assertNoInlineBodies(rec);
});

test("C: live update wins for matching capture refs", async () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfA");
  const oldDla = markerTitle(dlaPartial, "OLD_DLA");
  const newDla = markerTitle(dlaPartial, "NEW_DLA");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  await persistMapsAsRefs(
    api,
    wf.id,
    {
      ep_step: JSON.stringify(markerTitle(epShell, "EP")),
      dla_step: JSON.stringify(oldDla)
    },
    {
      ep_step: JSON.stringify(markerTitle(epShell, "EP"), null, 2),
      dla_step: JSON.stringify(oldDla, null, 2)
    }
  );

  await persistMapsAsRefs(
    api,
    wf.id,
    {
      ep_step: JSON.stringify(markerTitle(epShell, "EP")),
      dla_step: JSON.stringify(newDla)
    },
    {
      ep_step: JSON.stringify(markerTitle(epShell, "EP"), null, 2),
      dla_step: JSON.stringify(newDla, null, 2)
    }
  );

  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  const live = api.getWorkflowRunCapturedOutputsRawForTest();
  assert.match(JSON.parse(live.dla_step).title, /MARKER_NEW_DLA/);
  assert.doesNotMatch(JSON.parse(live.dla_step).title, /OLD_DLA/);
  assertNoInlineBodies(storeRec(storage, wf.id));
});

test("D/E: workflow switch A→B→A and A→B→C→A preserve A captures", async () => {
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
  await persistMapsAsRefs(api, wfA.id, full, fullRaw, completed);

  await selectLikeAsync(api, wfA.id, wfB.id);
  await persistMapsAsRefs(
    api,
    wfB.id,
    { ep_b: JSON.stringify(markerTitle(epShell, "B")) },
    { ep_b: JSON.stringify(markerTitle(epShell, "B"), null, 2) }
  );

  await selectLikeAsync(api, wfB.id, wfA.id);
  assert.equal(keys(api.getWorkflowRunCapturedOutputsRawForTest()).length, 5);
  assert.equal(keys(storeRec(storage, wfA.id).captureRefs).length, 5);

  await selectLikeAsync(api, wfA.id, wfB.id);
  await selectLikeAsync(api, wfB.id, wfC.id);
  await selectLikeAsync(api, wfC.id, wfA.id);
  assert.deepEqual(keys(api.getWorkflowRunCapturedOutputsRawForTest()), [
    "dla_step",
    "dp_step",
    "ep_step",
    "gam_step",
    "ls_step"
  ]);
});

test("F: reload restores full A captures after selecting another workflow", async () => {
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
  await persistMapsAsRefs(first.api, wfA.id, full, fullRaw, completed);
  const dump = first.storage[RUNKEY];

  const second = boot({ retainResourceBackend: true });
  second.storage[RUNKEY] = dump;
  second.api.setWorkflowsForTest([wfA, wfB]);
  second.api.setSelectedWorkflowIdForTest(wfB.id);
  second.api.restoreWorkflowRunStateForWorkflowForTest(wfB.id);
  assert.equal(keys(storeRec(second.storage, wfA.id).captureRefs).length, 5);
  await selectLikeAsync(second.api, wfB.id, wfA.id);
  assert.equal(keys(second.api.getWorkflowRunCapturedOutputsRawForTest()).length, 5);
  assert.match(
    JSON.parse(second.api.getWorkflowRunCapturedOutputsRawForTest().gam_step).title,
    /MARKER_GAM/
  );
});

test("G: Authoring hydrate+reconcile recovers durable captures when live is truncated", async () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfA");
  const { full, fullRaw, completed } = seedFullMaps();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  await persistMapsAsRefs(api, wf.id, full, fullRaw, completed);

  api.setWorkflowRunCapturedOutputsForTest({ ep_step: full.ep_step });
  api.setWorkflowRunCapturedOutputsRawForTest({ ep_step: fullRaw.ep_step });
  assert.equal(keys(api.getWorkflowRunCapturedOutputsRawForTest()).length, 1);
  assert.equal(keys(storeRec(storage, wf.id).captureRefs).length, 5);

  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
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

test("H: Authoring live-newer overlay wins while recovering missing durable keys", async () => {
  const { api } = boot();
  const wf = buildPartialWorkflow("wfA");
  const { full, fullRaw, completed } = seedFullMaps();
  const oldDla = markerTitle(dlaPartial, "OLD_DLA");
  const newDla = markerTitle(dlaPartial, "NEW_DLA");
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
  await persistMapsAsRefs(api, wf.id, durableFull, durableRaw, completed);

  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest(
    Object.assign({}, api.getWorkflowRunCapturedOutputsForTest(), {
      dla_step: JSON.stringify(newDla)
    })
  );
  api.setWorkflowRunCapturedOutputsRawForTest(
    Object.assign({}, api.getWorkflowRunCapturedOutputsRawForTest(), {
      dla_step: JSON.stringify(newDla, null, 2)
    })
  );

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

test("I: explicit Clear Run Data removes durable record and merge cannot resurrect", async () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfA");
  const { full, fullRaw, completed } = seedFullMaps();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  await persistMapsAsRefs(api, wf.id, full, fullRaw, completed);
  assert.ok(storeRec(storage, wf.id));

  api.clearPersistedWorkflowRunStateForWorkflowForTest(wf.id);
  api.setWorkflowRunCaptureRefsForTest({});
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  assert.equal(storeRec(storage, wf.id), null);

  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });
  const rec = storeRec(storage, wf.id);
  assert.ok(rec);
  assert.equal(keys(rec.captureRefs || {}).length, 0);
  assertNoInlineBodies(rec);
});

test("J: C-04 paste-field visibility behaviour remains unchanged", () => {
  assert.match(appSource, /isWorkflowStepPageStructureProducer/);
  assert.match(appSource, /Paste the result back into PRISM/);
});

test("K: D13 EP-only still fails learner-ready; full page assembles", () => {
  const ep = markerTitle(epShell, "EP");
  assert.equal(assemble.isLearnerReadyAssembledPage(ep), false);
  const page = JSON.parse(JSON.stringify(dpPartial));
  page.activities = JSON.parse(JSON.stringify(dlaPartial.activities));
  if (gamPartial.activities && gamPartial.activities[0] && gamPartial.activities[0].materials) {
    page.activities[0].materials = gamPartial.activities[0].materials;
  }
  assert.equal(assemble.isLearnerReadyAssembledPage(page), true);
});

test("L: D12 remains retired — no Presentation mode / learning_object", () => {
  assert.doesNotMatch(indexHtml, /id="utilitiesPresentationMode"/);
  assert.doesNotMatch(indexHtml, /Learning object HTML/i);
  assert.doesNotMatch(indexHtml, /value="learning_object"/);
  assert.doesNotMatch(appSource, /utilitiesPresentationMode/);
  assert.doesNotMatch(appSource, /buildUtilityLearningObjectHtml/);
});

test("M: unchanged in-memory accepted capture still persists to resource refs", async () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfM");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const raw = JSON.stringify(dpPartial, null, 2);
  const parsed = JSON.stringify(dpPartial);
  await persistMapsAsRefs(api, wf.id, { dp_step: parsed }, { dp_step: raw });
  const rec = storeRec(storage, wf.id);
  assert.ok(rec);
  assert.ok(rec.captureRefs && rec.captureRefs.dp_step);
  assertNoInlineBodies(rec);
  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  assert.equal(
    JSON.stringify(JSON.parse(api.getWorkflowRunCapturedOutputsForTest().dp_step)),
    JSON.stringify(JSON.parse(parsed))
  );
});

test("N: durable blank placeholder is replaced by accepted non-blank DLA capture", async () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfN");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const dlaRaw = JSON.stringify(dlaPartial, null, 2);
  const dlaFinal = JSON.stringify(dlaPartial);
  api.setWorkflowRunCapturedOutputsForTest({ dla_step: "" });
  api.setWorkflowRunCapturedOutputsRawForTest({ dla_step: "" });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });

  await persistMapsAsRefs(api, wf.id, { dla_step: dlaFinal }, { dla_step: dlaRaw });
  const rec = storeRec(storage, wf.id);
  assert.ok(rec);
  assert.ok(rec.captureRefs && rec.captureRefs.dla_step);
  assertNoInlineBodies(rec);
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

test("merge helper: blank live value does not erase durable accepted capture", () => {
  const { api } = boot();
  const merged = api.mergeWorkflowRunCaptureMapsForTest(
    { step_dp: '{"title":"accepted"}' },
    { step_dp: "" }
  );
  assert.equal(merged.step_dp, '{"title":"accepted"}');
});

test("DLA accepted input persists as resource refs and survives non-current blank syncs", async () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfDlaPersist");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setCurrentWorkflowRunIndexForTest(1);

  const dlaRaw = JSON.stringify(dlaPartial, null, 2);
  const dlaFinal = JSON.stringify(dlaPartial);
  await persistMapsAsRefs(api, wf.id, { dla_step: dlaFinal }, { dla_step: dlaRaw });
  let rec = storeRec(storage, wf.id);
  assert.ok(rec.captureRefs && rec.captureRefs.dla_step);
  assertNoInlineBodies(rec);

  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  const dlaLi = buildRunLi(
    "dla_step",
    "page",
    dlaRaw,
    "step_design_learning_activities"
  );
  const epLi = buildRunLi("ep_step", "page", "", "step_design_episode_plan");
  const gamLi = buildRunLi("gam_step", "page", "", "step_generate_activity_materials");
  const clsLi = buildRunLi("cls_step", "page", "", "step_build_learning_sequence");
  const dpLi = buildRunLi("dp_step", "page", "", "step_design_page");
  api.setWorkflowStepElementsForTest([epLi.li, dlaLi.li, gamLi.li, clsLi.li, dpLi.li]);
  api.syncAllWorkflowRunCapturesFromDomToState();
  rec = storeRec(storage, wf.id);
  assert.ok(rec.captureRefs && rec.captureRefs.dla_step);
  assert.equal(String(api.getWorkflowRunCapturedOutputsRawForTest().dla_step || "").length > 0, true);
});

test("GAM accepted input follows same resource-backed persistence path", async () => {
  const { api, storage } = boot();
  const wf = buildPartialWorkflow("wfGamPersist");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setCurrentWorkflowRunIndexForTest(2);

  const gamRaw = JSON.stringify(gamPartial, null, 2);
  const gamFinal = JSON.stringify(gamPartial);
  await persistMapsAsRefs(api, wf.id, { gam_step: gamFinal }, { gam_step: gamRaw });
  const rec = storeRec(storage, wf.id);
  assert.ok(rec.captureRefs && rec.captureRefs.gam_step);
  assertNoInlineBodies(rec);
});

test("quota-like storage failure retries with compacted blank placeholders", () => {
  let throwOnNextSet = false;
  const { api, storage } = boot({
    onSetItem() {
      if (throwOnNextSet) {
        throwOnNextSet = false;
        const err = new Error("Quota exceeded");
        err.name = "QuotaExceededError";
        throw err;
      }
    }
  });
  const wf = buildPartialWorkflow("wfQuotaRetry");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setCurrentWorkflowRunIndexForTest(1);
  api.restoreWorkflowRunStateForWorkflowForTest(wf.id);

  api.setWorkflowRunCaptureRefsForTest({
    dla_step: {
      final: { resource_id: "res-dla", slot_key: "run_capture:dla_step:final" },
      raw: { resource_id: "res-dla", slot_key: "run_capture:dla_step:final" }
    }
  });
  api.setWorkflowRunStepCompletedForTest({ dla_step: true });
  throwOnNextSet = true;
  const ok = api.persistWorkflowRunStateForWorkflowForTest(wf.id, {
    source: "test_quota_retry",
    observedStepId: "dla_step"
  });
  assert.equal(ok.ok, true);
  const rec = storeRec(storage, wf.id);
  assert.ok(rec);
  assert.ok(rec.captureRefs && rec.captureRefs.dla_step);
});

/**
 * IndexedDB-first workflow catalogue: migration, durable create, reload.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");
const design = require("../lib/learning-journey-design-page.js");
const intake = require("../lib/first-class-commission-intake.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const WFKEY = "promptr.workflows.v1";
const BACKEND_KEY = "promptr.workflows.v1.backend";

function makeStorage(seed, options) {
  const opts = options && typeof options === "object" ? options : {};
  const storage = Object.assign({}, seed || {});
  const localStorage = {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null;
    },
    setItem(k, v) {
      if (typeof opts.onSetItem === "function") opts.onSetItem(k, v, storage);
      storage[k] = String(v);
    },
    removeItem(k) {
      delete storage[k];
    },
    key(i) {
      return Object.keys(storage)[i] || null;
    },
    get length() {
      return Object.keys(storage).length;
    }
  };
  return { storage, localStorage };
}

function buildPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "STEM – Making Sense of Experimental Data",
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Make sense of experimental data."
      },
      {
        section_id: "exp_1",
        title: "Understanding Experimental Evidence",
        order: 2,
        exposition: "C1"
      },
      {
        section_id: "exp_2",
        title: "Understanding Descriptive Statistics",
        order: 3,
        exposition: "C2"
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Understanding Experimental Evidence",
        product_id: "expository",
        status: "supported",
        specification_text: "C1 SPEC — evidence roles.",
        journey_context_text: "Opening.",
        dependencies: "none"
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Understanding Descriptive Statistics",
        product_id: "expository",
        status: "supported",
        specification_text: "C2 SPEC — descriptive statistics.",
        journey_context_text: "Builds on C1.",
        dependencies: "c1"
      }
    ],
    learning_journey: {
      design_intent: "Author intent",
      continuity: "Shared continuity"
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: [
        "learning_requirements",
        "learning_progression",
        "learning_elements",
        "learning_commissions",
        "design_page"
      ],
      calls_model: true
    }
  };
}

function parentJourney(id, updatedAt) {
  return {
    id: id,
    name: "STEM – Making Sense of Experimental Data",
    product: "learning_journey",
    selectedDomains: ["learning-design"],
    steps: [{ id: "dp", title: "Design Page", outputName: "design_page" }],
    createdAt: 1,
    updatedAt: updatedAt != null ? updatedAt : 1,
    workflowBriefResolution: {
      resolvedFactors: { source_context: "shared dataset 1,2,3" },
      initialBrief: { sourceContext: "shared dataset 1,2,3" }
    }
  };
}

function childC1(parentId, updatedAt) {
  return {
    id: "wf-c1",
    name: "Understanding Experimental Evidence",
    product: "expository",
    sourceWorkflowId: parentId,
    sourceCommissionId: "c1",
    selectedDomains: ["learning-design"],
    steps: [{ id: "s1", title: "Expository", override_prompt_body: "c1" }],
    createdAt: 2,
    updatedAt: updatedAt != null ? updatedAt : 2
  };
}

function loadApi(options) {
  const opts = options && typeof options === "object" ? options : {};
  const { storage, localStorage } = makeStorage(opts.seedStorage, {
    onSetItem: opts.onSetItem
  });
  catalogueStore.resetStorageBackendForTests();

  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/prism-workflow-catalogue-store.js",
      "lib/first-class-workflow-family.js",
      "lib/first-class-commission-intake.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js"
    ]
  });

  loaded.window.localStorage = localStorage;
  if (loaded.sandbox) loaded.sandbox.localStorage = localStorage;

  loaded.window.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  if (loaded.sandbox) {
    loaded.sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
    if (loaded.sandbox.globalThis) {
      loaded.sandbox.globalThis.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
    }
  }

  if (loaded.window.Utils && !loaded.window.Utils.uuid) {
    let n = 0;
    loaded.window.Utils.uuid = function () {
      return "wf-test-" + String(++n);
    };
  }

  if (loaded.sandbox) loaded.sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intake;
  if (loaded.window) loaded.window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intake;
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intake;
  }

  return { api: loaded.api, storage, localStorage, loaded };
}

async function awaitMaybe(value) {
  if (value && typeof value.then === "function") return value;
  return value;
}

test("catalogue store memory backend round-trips JSON with revision", async () => {
  const backend = catalogueStore.resetStorageBackendForTests();
  assert.equal(backend.kind, "memory");
  const payload = JSON.stringify([{ id: "a", name: "A" }]);
  const wrote = await catalogueStore.writeCatalogueJson(payload, {
    nextRevision: 3,
    expectedRevision: 0
  });
  assert.equal(wrote.ok, true);
  assert.equal(wrote.revision, 3);
  const record = await catalogueStore.readCatalogueRecord();
  assert.equal(record.json, payload);
  assert.equal(record.revision, 3);
  const stale = await catalogueStore.writeCatalogueJson(payload, {
    expectedRevision: 1,
    nextRevision: 2
  });
  assert.equal(stale.ok, false);
  assert.equal(stale.reason, "stale_revision");
  await catalogueStore.clearCatalogue();
  assert.equal(await catalogueStore.readCatalogueJson(), null);
});

test("first startup migrates localStorage catalogue into IndexedDB and retains LS backup", async () => {
  const parentId = "wf-lj-migrate-1";
  const seed = [parentJourney(parentId), childC1(parentId)];
  const seedJson = JSON.stringify(seed);
  const { api, storage } = loadApi({
    seedStorage: { [WFKEY]: seedJson }
  });

  const resolved = await api.resolveAuthoritativeWorkflowCatalogueOnStartupForTest();
  assert.equal(resolved.migrated, true);
  assert.equal(resolved.backend, "idb");
  assert.equal(resolved.source, "localStorage_migrated");
  assert.equal(resolved.backupRetained, true);
  assert.equal(storage[WFKEY], seedJson, "original LS catalogue must remain as recovery backup");
  assert.equal(storage[BACKEND_KEY], "idb");

  const idbRaw = await catalogueStore.readCatalogueJson();
  assert.equal(idbRaw, seedJson);
  assert.ok(api.getWorkflowCatalogueRevisionForTest() >= 1);

  await api.loadWorkflowsForTest();
  const loaded = api.getWorkflowsForTest();
  assert.equal(loaded.length, 2);
  assert.ok(loaded.some((wf) => wf && wf.sourceCommissionId === "c1"));
});

test("already-migrated startup prefers IndexedDB and does not clobber with older LS", async () => {
  const parentId = "wf-lj-migrate-2";
  const newerIdb = [
    parentJourney(parentId, 100),
    childC1(parentId, 100),
    {
      id: "wf-c2-newer",
      name: "Understanding Descriptive Statistics",
      product: "expository",
      sourceWorkflowId: parentId,
      sourceCommissionId: "c2",
      steps: [],
      createdAt: 50,
      updatedAt: 100
    }
  ];
  const olderLs = [parentJourney(parentId, 10)];
  catalogueStore.resetStorageBackendForTests();
  await catalogueStore.writeCatalogueJson(JSON.stringify(newerIdb), {
    nextRevision: 5,
    expectedRevision: 0
  });

  const { api, storage } = loadApi({
    seedStorage: {
      [WFKEY]: JSON.stringify(olderLs),
      [BACKEND_KEY]: "idb"
    }
  });
  // Re-seed IDB after loadApi reset
  await catalogueStore.writeCatalogueJson(JSON.stringify(newerIdb), {
    nextRevision: 5,
    expectedRevision: 0
  });
  api.setWorkflowCatalogueRevisionForTest(5);

  const resolved = await api.resolveAuthoritativeWorkflowCatalogueOnStartupForTest();
  assert.equal(resolved.migrated, false);
  assert.equal(resolved.backend, "idb");
  const parsed = JSON.parse(resolved.raw);
  assert.equal(parsed.length, 3, "must keep richer/newer IndexedDB catalogue");
  assert.ok(parsed.some((wf) => wf && wf.sourceCommissionId === "c2"));
  assert.equal(
    storage[WFKEY],
    JSON.stringify(olderLs),
    "older LS backup must not be deleted"
  );
});

test("prior overflowed catalogue (IDB only) loads without requiring localStorage", async () => {
  const parentId = "wf-lj-overflowed";
  const idbOnly = [parentJourney(parentId), childC1(parentId)];
  catalogueStore.resetStorageBackendForTests();
  await catalogueStore.writeCatalogueJson(JSON.stringify(idbOnly), {
    nextRevision: 2,
    expectedRevision: 0
  });

  const { api, storage } = loadApi({
    seedStorage: { [BACKEND_KEY]: "idb" }
  });
  await catalogueStore.writeCatalogueJson(JSON.stringify(idbOnly), {
    nextRevision: 2,
    expectedRevision: 0
  });

  await api.loadWorkflowsForTest();
  assert.equal(api.getWorkflowsForTest().length, 2);
  assert.equal(Object.prototype.hasOwnProperty.call(storage, WFKEY), false);
  assert.equal(storage[BACKEND_KEY], "idb");
});

test("ordinary saves write IndexedDB exclusively and keep LS only as best-effort backup", async () => {
  const parentId = "wf-lj-save-idb";
  let lsWrites = 0;
  const { api, storage } = loadApi({
    onSetItem(key) {
      if (key === WFKEY) lsWrites += 1;
    }
  });

  api.setWorkflowsForTest([parentJourney(parentId)]);
  const saveResult = await awaitMaybe(api.saveWorkflowsForTest());
  assert.equal(saveResult.ok, true);
  assert.equal(saveResult.backend, "idb");
  assert.equal(storage[BACKEND_KEY], "idb");

  const idbRaw = await catalogueStore.readCatalogueJson();
  assert.ok(idbRaw);
  assert.equal(JSON.parse(idbRaw).length, 1);
  // Backup may succeed when quota allows.
  assert.ok(lsWrites >= 0);
  if (storage[WFKEY]) {
    assert.equal(JSON.parse(storage[WFKEY]).length, 1);
  }
});

test("failed IndexedDB write rolls back ghost constituent", async () => {
  const parentId = "wf-lj-stem-rollback";
  const { api } = loadApi();

  catalogueStore.setStorageBackend({
    kind: "broken",
    get: () => Promise.resolve(null),
    getRecord: () => Promise.resolve(null),
    put: () => Promise.resolve({ ok: false, reason: "forced_failure" }),
    remove: () => Promise.resolve({ ok: true }),
    clear: () => Promise.resolve({ ok: true })
  });

  api.setWorkflowsForTest([parentJourney(parentId)]);
  // Seed revision path without relying on broken put for the parent seed in memory only.
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: buildPage(),
    sourceWorkflowId: parentId
  });

  const beforeCount = api.getWorkflowsForTest().length;
  const createdResult = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c2",
      sectionId: "exp_2",
      productId: "expository",
      sourceWorkflowId: parentId
    })
  );
  assert.equal(createdResult.ok, false);
  assert.equal(createdResult.code, "persist_failed");
  assert.equal(api.getWorkflowsForTest().length, beforeCount);
  assert.equal(
    api.getWorkflowsForTest().some((wf) => wf && wf.sourceCommissionId === "c2"),
    false
  );
});

test("constituent create persists in IndexedDB and survives reload", async () => {
  const parentId = "wf-lj-stem-parent";
  const { api, storage } = loadApi();

  api.setWorkflowsForTest([parentJourney(parentId)]);
  await awaitMaybe(api.saveWorkflowsForTest());

  const page = buildPage();
  assert.equal(design.validateLearningJourneyDesignPage(page).ok, true);
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: parentId
  });

  const createdResult = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c2",
      sectionId: "exp_2",
      productId: "expository",
      sourceWorkflowId: parentId
    })
  );
  assert.equal(createdResult.ok, true, createdResult.code || "");
  assert.ok(createdResult.workflow);
  assert.equal(createdResult.workflow.sourceCommissionId, "c2");
  assert.equal(createdResult.workflow.sourceWorkflowId, parentId);

  const idbRaw = await catalogueStore.readCatalogueJson();
  assert.ok(idbRaw, "expected catalogue written to IndexedDB");
  assert.equal(
    JSON.parse(idbRaw).some((wf) => wf && wf.sourceCommissionId === "c2"),
    true,
    "C2 must be present in IndexedDB immediately after create"
  );
  assert.equal(storage[BACKEND_KEY], "idb");

  api.setWorkflowsForTest([]);
  await api.loadWorkflowsForTest();
  const c2 = api.getWorkflowsForTest().find((wf) => wf && wf.sourceCommissionId === "c2");
  assert.ok(c2, "C2 must survive reload from IndexedDB");
  assert.equal(c2.sourceWorkflowId, parentId);
  assert.equal(c2.product, "expository");
});

test("serialised saves preserve newest catalogue snapshot", async () => {
  const { api } = loadApi();
  api.setWorkflowsForTest([parentJourney("p1")]);
  const first = api.saveWorkflowsForTest();
  api.setWorkflowsForTest([parentJourney("p1"), childC1("p1")]);
  const second = api.saveWorkflowsForTest();
  const [r1, r2] = await Promise.all([awaitMaybe(first), awaitMaybe(second)]);
  assert.equal(r1.ok, true);
  assert.equal(r2.ok, true);
  const idbRaw = await catalogueStore.readCatalogueJson();
  assert.equal(JSON.parse(idbRaw).length, 2, "latest save must win after serialised queue");
});

test("quota on LS backup does not fail authoritative IndexedDB save", async () => {
  const parentId = "wf-lj-backup-quota";
  const { api, storage } = loadApi({
    seedStorage: {
      [WFKEY]: JSON.stringify([parentJourney(parentId)])
    },
    onSetItem(key) {
      if (key === WFKEY) {
        const err = new Error("QuotaExceededError: storage full");
        err.name = "QuotaExceededError";
        throw err;
      }
    }
  });

  // Migrate first while LS read still works; subsequent backup writes will fail.
  await api.loadWorkflowsForTest();
  api.setWorkflowsForTest([parentJourney(parentId), childC1(parentId)]);
  const saveResult = await awaitMaybe(api.saveWorkflowsForTest());
  assert.equal(saveResult.ok, true, "IDB save must succeed even when LS backup hits quota");
  assert.equal(saveResult.backend, "idb");
  assert.equal(saveResult.backupOk, false);
  const idbRaw = await catalogueStore.readCatalogueJson();
  assert.equal(JSON.parse(idbRaw).length, 2);
  // Original LS backup retained (setItem failed, so seed remains).
  assert.ok(storage[WFKEY]);
});

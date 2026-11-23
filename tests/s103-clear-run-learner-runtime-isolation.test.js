/**
 * Sprint 103 — Clear run data must clear learner draft envelopes / journal acks
 * for the workflow, while isolating commissions that share elicitation ids.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  attachLearnerPageIdentityFromWorkflow,
  buildLearnerDraftPageIdentity,
  createLearnerDraftStorage,
  deleteLearnerRuntimeStateForWorkflow,
  deleteLearnerDraftsForWorkflow,
  learnerDraftStorageKeyPrefixForWorkflow
} = require("../lib/learner-renderer-vnext");
const envelope = require("../lib/learner-renderer-vnext/learner-draft-envelope");
const constants = require("../lib/learner-renderer-vnext/learner-draft-constants");

const appJsPath = path.join(path.resolve(__dirname, ".."), "app.js");

function makeBagStorage(seed) {
  const storage = Object.assign({}, seed || {});
  return {
    storage,
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
}

function practicePage(title, commissionId) {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: title || "Practice",
    activities: [{ activity_id: "A1", title: "Judgement" }]
  };
  if (commissionId) {
    page.commission_id = commissionId;
    page.metadata = { commission_id: commissionId };
  }
  return page;
}

test("identical elicitation workspace ids stay isolated across commissions", () => {
  const pageA = practicePage("Clinical judgement", "C01");
  const pageB = practicePage("Clinical judgement", "C02");
  attachLearnerPageIdentityFromWorkflow(pageA, {
    id: "wf-shared",
    sourceCommissionId: "C01"
  });
  attachLearnerPageIdentityFromWorkflow(pageB, {
    id: "wf-shared",
    sourceCommissionId: "C02"
  });
  const idA = buildLearnerDraftPageIdentity(pageA);
  const idB = buildLearnerDraftPageIdentity(pageB);
  assert.notEqual(idA.pageKey, idB.pageKey);
  assert.match(idA.pageKey, /learner-page--c01/i);
  assert.match(idB.pageKey, /learner-page--c02/i);

  const bag = makeBagStorage();
  const api = createLearnerDraftStorage(bag);
  const draftA = envelope.createEmptyEnvelope(idA.pageKey);
  draftA.workspaces["learner-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "JUDGEMENT-FROM-C01"
  });
  const draftB = envelope.createEmptyEnvelope(idB.pageKey);
  draftB.workspaces["learner-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "JUDGEMENT-FROM-C02"
  });
  assert.equal(api.saveLearnerDraft(idA.pageKey, draftA).ok, true);
  assert.equal(api.saveLearnerDraft(idB.pageKey, draftB).ok, true);

  const loadedA = api.loadLearnerDraft(idA.pageKey);
  const loadedB = api.loadLearnerDraft(idB.pageKey);
  assert.equal(loadedA.envelope.workspaces["learner-constructed-E1"].value.text, "JUDGEMENT-FROM-C01");
  assert.equal(loadedB.envelope.workspaces["learner-constructed-E1"].value.text, "JUDGEMENT-FROM-C02");
});

test("new workflow page identity does not resolve sibling workflow drafts", () => {
  const oldPage = practicePage("Initial clinical judgement", "C01");
  attachLearnerPageIdentityFromWorkflow(oldPage, {
    id: "wf-old-practice",
    sourceCommissionId: "C01"
  });
  const newPage = practicePage("Initial clinical judgement", "C01");
  attachLearnerPageIdentityFromWorkflow(newPage, {
    id: "wf-new-practice",
    sourceCommissionId: "C01"
  });
  const oldId = buildLearnerDraftPageIdentity(oldPage);
  const newId = buildLearnerDraftPageIdentity(newPage);
  assert.notEqual(oldId.pageKey, newId.pageKey);

  const bag = makeBagStorage();
  const api = createLearnerDraftStorage(bag);
  const draft = envelope.createEmptyEnvelope(oldId.pageKey);
  draft.workspaces["learner-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "STALE-FROM-OLD-WORKFLOW"
  });
  assert.equal(api.saveLearnerDraft(oldId.pageKey, draft).ok, true);

  const loadedNew = api.loadLearnerDraft(newId.pageKey);
  assert.equal(loadedNew.ok, true);
  assert.equal(loadedNew.envelope, null);
});

test("reload persistence keeps legitimate draft until cleared", () => {
  const page = practicePage("Judgement", "C01");
  attachLearnerPageIdentityFromWorkflow(page, {
    id: "wf-reload",
    sourceCommissionId: "C01"
  });
  const identity = buildLearnerDraftPageIdentity(page);
  const bag = makeBagStorage();
  const api = createLearnerDraftStorage(bag);
  const draft = envelope.createEmptyEnvelope(identity.pageKey);
  draft.workspaces["learner-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "KEEP-ACROSS-RELOAD"
  });
  assert.equal(api.saveLearnerDraft(identity.pageKey, draft).ok, true);
  const again = createLearnerDraftStorage(bag).loadLearnerDraft(identity.pageKey);
  assert.equal(again.envelope.workspaces["learner-constructed-E1"].value.text, "KEEP-ACROSS-RELOAD");
});

test("deleteLearnerDraftsForWorkflow removes constructed responses and leaves other workflows", () => {
  const bag = makeBagStorage();
  const api = createLearnerDraftStorage(bag);
  const keepKey =
    "v1::wf-keep::learner-page--c01::2.0.0::a1::practice";
  const clearKey =
    "v1::wf-clear-me::learner-page--c01::2.0.0::a1::practice";
  assert.equal(
    api.saveLearnerDraft(keepKey, {
      ...envelope.createEmptyEnvelope(keepKey),
      workspaces: {
        "learner-constructed-E1": envelope.createWorkspaceState("text_entry", {
          text: "KEEP"
        })
      }
    }).ok,
    true
  );
  assert.equal(
    api.saveLearnerDraft(clearKey, {
      ...envelope.createEmptyEnvelope(clearKey),
      workspaces: {
        "learner-constructed-E1": envelope.createWorkspaceState("text_entry", {
          text: "CLEAR-ME"
        })
      }
    }).ok,
    true
  );

  const prefix = learnerDraftStorageKeyPrefixForWorkflow("wf-clear-me");
  assert.match(prefix, /learner-renderer-vnext:draft:v1::wf-clear-me::/);

  const cleared = deleteLearnerDraftsForWorkflow("wf-clear-me", { storage: bag });
  assert.equal(cleared.ok, true);
  assert.ok(cleared.deleted.length >= 1);
  assert.equal(api.loadLearnerDraft(clearKey).envelope, null);
  assert.equal(
    api.loadLearnerDraft(keepKey).envelope.workspaces["learner-constructed-E1"].value.text,
    "KEEP"
  );
});

test("deleteLearnerRuntimeStateForWorkflow clears drafts and journal acknowledgements", () => {
  const bag = makeBagStorage();
  const pageKey = "v1::wf-lj-1::learner-page::2.0.0::no-activities::journey";
  const draftKey = constants.STORAGE_KEY_PREFIX + pageKey;
  const ackKey = "prism:lj-journal:ack:lj:wf-lj-1:learner-page";
  const otherAck = "prism:lj-journal:ack:lj:wf-other:page";
  bag.setItem(
    draftKey,
    JSON.stringify({
      schemaVersion: 1,
      renderer: "learner-renderer-vnext",
      pageKey: pageKey,
      workspaces: {
        "learner-constructed-E1": envelope.createWorkspaceState("text_entry", {
          text: "JOURNALABLE"
        })
      }
    })
  );
  bag.setItem(ackKey, JSON.stringify({ fingerprints: { j1: "v1:abc:3" } }));
  bag.setItem(otherAck, JSON.stringify({ fingerprints: { j1: "v1:xyz:3" } }));

  const result = deleteLearnerRuntimeStateForWorkflow("wf-lj-1", { storage: bag });
  assert.equal(result.ok, true);
  assert.equal(bag.getItem(draftKey), null);
  assert.equal(bag.getItem(ackKey), null);
  assert.ok(bag.getItem(otherAck));
});

test("Clear run data app path wires learner-runtime clear and preserves authored workflow fields", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  const start = source.indexOf("function executeClearWorkflowRunData");
  const end = source.indexOf("\n  function requestClearWorkflowRunDataConfirmation", start);
  const body = source.slice(start, end > 0 ? end : start + 2400);
  assert.match(body, /clearLearnerRuntimeStateForWorkflow\(wid\)/);
  const first = body.indexOf("clearLearnerRuntimeStateForWorkflow(wid)");
  const second = body.indexOf("clearLearnerRuntimeStateForWorkflow(wid)", first + 1);
  assert.ok(first > 0);
  assert.ok(second > first, "must clear learner runtime a second time after async purge");
  assert.ok(first < body.indexOf("deleteRunCaptureTextResourcesForWorkflow"));

  const confirmStart = source.indexOf("function buildClearWorkflowRunDataConfirmCopy");
  const confirmBody = source.slice(confirmStart, confirmStart + 900);
  assert.match(confirmBody, /learner responses saved on this device/);
  assert.match(confirmBody, /authored designs will not be deleted/);

  // Authored catalogue is never deleted by the clear helper.
  assert.doesNotMatch(body, /deleteWorkflow\(/);
  assert.doesNotMatch(body, /removeItem\(WFKEY\)|removeItem\("promptr\.workflows\.v1"\)/);
});

test("Clear run data scoped runtime clear leaves authored workflow JSON untouched", () => {
  const bag = makeBagStorage();
  const wfKey = "promptr.workflows.v1";
  const authored = JSON.stringify([
    {
      id: "wf-practice-clear",
      name: "Practice child",
      product: "practice",
      sourceCommissionId: "C02",
      steps: [{ id: "step-1", title: "EP" }]
    }
  ]);
  bag.setItem(wfKey, authored);
  const pageKey = "v1::wf-practice-clear::learner-page--c02::2.0.0::a1::practice-stop";
  bag.setItem(
    constants.STORAGE_KEY_PREFIX + pageKey,
    JSON.stringify({
      schemaVersion: 1,
      renderer: "learner-renderer-vnext",
      pageKey: pageKey,
      workspaces: {
        "learner-constructed-E1": envelope.createWorkspaceState("text_entry", {
          text: "MUST-CLEAR"
        })
      }
    })
  );
  bag.setItem(
    "prism:lj-journal:ack:lj:wf-practice-clear:page",
    JSON.stringify({ fingerprints: { j1: "v1:x:1" } })
  );

  const cleared = deleteLearnerRuntimeStateForWorkflow("wf-practice-clear", { storage: bag });
  assert.equal(cleared.ok, true);
  assert.equal(bag.getItem(constants.STORAGE_KEY_PREFIX + pageKey), null);
  assert.equal(bag.getItem("prism:lj-journal:ack:lj:wf-practice-clear:page"), null);
  assert.equal(bag.getItem(wfKey), authored);
});

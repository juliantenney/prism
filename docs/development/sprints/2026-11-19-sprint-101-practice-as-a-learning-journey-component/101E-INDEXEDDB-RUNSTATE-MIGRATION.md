# Sprint 101E — Complete IndexedDB run-state migration

**Status:** Implementation landed — **blocker OPEN until C1 browser verification**  
**Date:** 2026-11-20  
**Do not commit/push. Do not clear user storage. Do not overwrite C1/C2/C3.**

## Phase 1 — Inventory (localStorage / sessionStorage)

### Active persistent application data (first-party)

| Location | Key / use | Classification | Action this task |
| -------- | --------- | -------------- | ---------------- |
| `app.js` `saveWorkflowRunStateStore` / `loadWorkflowRunStateStore` | `promptr.workflows.runstate.v1` | **Was authoritative** — caused C1 `QuotaExceededError` | **Migrated to IndexedDB** (`prismWorkflowRunstateDB`); LS is backup only |
| `app.js` catalogue path | `promptr.workflows.v1` | Already IDB-first via `prism-workflow-catalogue-store.js`; LS best-effort backup | Unchanged (already correct architecture) |
| `app.js` | `promptr.workflows.v1.backend` | Backend marker | Remains (tiny metadata) |
| `app.js` | `promptr.runCaptureStorageVersion`, migration report | Migration bookkeeping | Remains (tiny metadata) |
| `library.js` | Prompt library entries | Separate product surface (not workflow run-state) | **Documented exception** — out of C1 Step 5 / run-state scope |
| `workflowGenerationContext.js` | Domain list cache | Cache / preference | **Documented exception** — tiny cache, not run captures |
| `lib/learner-renderer-vnext/learner-draft-storage.js` (+ browser/export mirrors) | Learner **draft** responses in exported packages | Learner runtime drafts (not authoring run-state) | **Exception documented** — out of authoring persistence scope |
| `lib/learning-journey-unified-shell.js` | `sessionStorage` sidebar expanded/collapsed | UI preference | **Exception** — ephemeral UI, not durable app data |

### Temporary session recovery

| Location | Key | Notes |
| -------- | --- | ----- |
| `app.js` | `promptr.workflows.run.unsaved.v1` (`sessionStorage`) | Failed-write recovery only; **not** required after successful IndexedDB save |

### Legacy / compatibility

| Location | Notes |
| -------- | ----- |
| Catalogue LS read/write helpers | Non-destructive migration + recovery backup; IDB authoritative |
| Run-state LS read/write helpers (new) | Same pattern as catalogue after this migration |

### Tests / docs / prompts

- Extensive `tests/*` localStorage stubs and `RUNKEY` fixtures.
- Prompt text mentioning “localStorage” in situated-task contracts (instructional prohibition, not storage).
- Third-party: MathLive / vendor bundles (out of control).

### Debug

- `PRISM_DEBUG_LJ_PRODUCTION_STATUS` flag in localStorage (optional debug).

---

## Phase 2 — Intended vs actual architecture

### Intended (post–Sprint 75 / catalogue work)

| Data | Authoritative store |
| ---- | ------------------- |
| Workflow **definitions** (catalogue) | IndexedDB `prismWorkflowCatalogueDB` |
| Capture **bodies** (text/binary resources) | IndexedDB `prismWorkflowResourcesDB` |
| Workflow **run-state** (refs, stepCompleted, runIndex, page resource refs) | **Should be IndexedDB** |

### Actual before this task

| Data | Actual |
| ---- | ------ |
| Catalogue | IndexedDB ✓ (LS backup) |
| Capture bodies | IndexedDB ✓ |
| Run-state | **localStorage only** ✗ — incomplete migration |

### Root cause of incomplete migration

Sprint 75 moved large capture **payloads** into `PRISM_WORKFLOW_RESOURCES` (IndexedDB) and left a “lightweight” run-state map in `localStorage`. Catalogue later moved to IndexedDB. **Run-state was never moved**, so a crowded origin could still fail on `localStorage.setItem(promptr.workflows.runstate.v1)` with `QuotaExceededError` even when IndexedDB had capacity — blocking Step 5 after payload write / before durable refs landed.

---

## Phase 3 — Changes

1. **New** `lib/prism-workflow-runstate-store.js` — IndexedDB store mirroring catalogue API (`readRunStateJson` / `writeRunStateJson`, revision, memory backend for tests).
2. **`app.js`**
   - In-memory run-state cache + serialised IDB save queue.
   - `hydrateWorkflowRunStateStoreFromDurable()` on startup (after `loadWorkflows`): non-destructive LS→IDB migration when LS is richer; **does not delete** LS.
   - `saveWorkflowRunStateStore` writes **IndexedDB**; `tryWriteLocalWorkflowRunStateBackup` is best-effort and **cannot fail** the authoritative path.
   - `persistWorkflowRunStateForWorkflow` returns a Promise (awaited on capture persist).
3. **`index.html`** — load runstate store script.
4. Tests + bootstrap wire the shared module.

### Remaining intentional exceptions

- Learner draft localStorage in learner packages (learner product, not authoring run-state).
- Unified-shell sidebar `sessionStorage`.
- Tiny markers / version keys in localStorage.
- Best-effort LS **backups** for catalogue + run-state (never required for success).
- Unsaved capture `sessionStorage` recovery after failed durable writes.

---

## Phase 4 — Tests

```text
node --test tests/s101e-runstate-indexeddb-migration.test.js \
  tests/s101e-run-data-persistence-failure.test.js \
  tests/s76-empty-capture-persist-guard.test.js \
  tests/s101e-expository-generation-notes-object.test.js \
  tests/s75-run-capture-persistence.test.js \
  tests/s75-run-capture-resource-persistence.test.js \
  tests/workflow-updated-at-run-persistence.test.js
→ 62/62 pass
```

Includes: C1 Step 5 persist with localStorage at quota / unavailable; legacy migration without deletion; nested `generation_notes`; failed persist does not advance; S75 capture/ref durability; regression guards that `saveWorkflowRunStateStore` uses `writeRunStateJson` and first-party runstate key writes only go through the backup helper.

---

## Manual browser verification

1. Hard-refresh PRISM (confirm `prism-workflow-runstate-store.js?v=20261120-s101e-idb-runstate` loads).
2. Open C1 → Step 5 → **re-paste original** JSON (ensure nested `generation_notes`).
3. Press Next — must advance without save-failure toast.
4. DevTools → Application → IndexedDB → `prismWorkflowRunstateDB` → `runstate` has `promptr.workflows.runstate.v1`.
5. DevTools → Application → IndexedDB → `prismWorkflowResourcesDB` → `resource_meta` has `run_capture:…` for the step.
6. Clear **sessionStorage** only → hard-refresh → reopen C1 Run → Step 5 capture + nested JSON must restore.
7. Optional: Application → fill/block localStorage → repeat paste/Next — must still succeed via IndexedDB.

**Acceptance:** C1 Step 5 persists and restores entirely through IndexedDB with localStorage full or unavailable; clearing sessionStorage after a successful save must not lose the result.

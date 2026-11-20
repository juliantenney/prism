# Sprint 101E — Run-data persistence failure (production blocker)

**Status:** Iteration 2 + **IndexedDB runstate migration** landed — **blocker still OPEN until C1 browser verify**  
**Follow-on:** [101E-INDEXEDDB-RUNSTATE-MIGRATION.md](101E-INDEXEDDB-RUNSTATE-MIGRATION.md)  
**Date:** 2026-11-20  
**Do not mark 101E complete. Do not commit/push. Do not overwrite C2/C3.**

## Confirmed failure (iteration 1 verification)

After the first persistence fix, real browser retry on C1 Step 5 showed:

- PRISM correctly **remained on Step 5** (Next gating worked).
- Result remained in the input.
- Red toast claimed **browser storage is full** with diagnostic **`storage_write_failed`**.
- Visible JSON ended with `"generation_notes": "[object Object]"` — original was a **structured object**.

**Blocker not resolved by iteration 1 alone.**

---

## Root causes (iteration 2 — evidenced)

### A. JSON corruption — `String(object)` in Expository normalize

**Path:** paste → `syncWorkflowRunCapturedOutputToState` → `parseExpositoryArtefactCaptureForStorage` → `validateExpositoryArtefactShape` → `normalizeExpositoryDevelopment` → textarea rewrite via `JSON.stringify(normalized)`.

**Defect:** `lib/expository-contracts.js` used `generation_notes: str(src.generation_notes)` where `str()` is `String(value)`. For a nested object this yields the literal `"[object Object]"`, which then becomes the durable/session capture.

Same pattern existed on EJP and XM. Material `body` / `formal_notes` already had object-preserving helpers; `generation_notes` did not.

**Evidence:** live C1 paste showed corrupted `generation_notes` after accept; code at `normalizeExpositoryDevelopment` (pre-fix) called `str()`.

### B. False “storage is full” for `storage_write_failed`

**Path:** IndexedDB `putTextResource` may succeed or fail; runstate write uses `localStorage.setItem(promptr.workflows.runstate.v1)`. Failures return `reason: "storage_write_failed"`.

**Defect:** quota detection used `/quota|exceed|storage/i`, which matches **any** DOMException mentioning `'Storage'` (e.g. `Failed to execute 'setItem' on 'Storage': …`), setting `quota: true` and selecting the storage-full toast — even when the failure is not quota exhaustion.

User-visible pair (`storage is full` + `[storage_write_failed]`) matches this false-positive path.

### C. Iteration 1 (still valid)

Next advanced before durable persist settled (fixed in iteration 1). That fix remains; iteration 2 addresses corruption + misdiagnosis.

---

## Fix implemented (iteration 2)

1. **`normalizeGenerationNotes`** — preserve string prose **or** clone structured objects/arrays; never `String(object)`. Applied to EJP, XD, XM.
2. **Accurate quota detection** — `QuotaExceededError` / `exceeded the quota` / disk-full markers only; **do not** match bare `Storage`.
3. **Stage-aware toasts** — distinguish `indexeddb_putTextResource` vs `localStorage_runstate`; if body saved but run index failed, say so explicitly (not “storage full”).
4. **Console diagnostics** — `console.warn("[PRISM] run-capture persist failed", { stage, code, errorName, message, payloadOk, runstateOk, quotaClassified, dbName, objectStore, storageEstimate })` (no capture body).
5. **Unsaved stash includes refs** when payload write succeeded so same-tab recovery can rehydrate from IndexedDB after refresh.

Cache-bust: `expository-contracts.js?v=20261120-s101e-generation-notes-object`, resources script from iteration 1.

---

## Files changed (iteration 2)

| File | Change |
| ---- | ------ |
| `lib/expository-contracts.js` | `normalizeGenerationNotes`; EJP/XD/XM use it |
| `app.js` | Accurate quota detector; stage toasts; diagnostics log; stash refs |
| `index.html` | Cache-bust expository-contracts |
| `tests/s101e-expository-generation-notes-object.test.js` | New |
| `tests/s101e-run-data-persistence-failure.test.js` | Nested notes + stage toast assertions |
| `tests/s76-empty-capture-persist-guard.test.js` | False-positive Storage message cases |
| `docs/.../101E-RUN-DATA-PERSISTENCE-FAILURE.md` | This update |
| `docs/.../STATUS.md` | Work log |

---

## Tests

```text
node --test tests/s101e-expository-generation-notes-object.test.js \
  tests/s101e-run-data-persistence-failure.test.js \
  tests/s76-empty-capture-persist-guard.test.js
→ 23/23 pass
```

---

## Remaining risks

- Genuine localStorage quota can still block runstate writes on a crowded origin; toast should now say so only when quota is real, and distinguish body-saved vs body-failed.
- Corrupted paste already in the textarea from the prior session must be **re-pasted** from the external original (do not “repair” meaning of `"[object Object]"`).
- Cross-tab sessionStorage backups do not apply.

---

## Browser verification (distinguish IndexedDB vs sessionStorage)

1. Hard-refresh PRISM (confirm cache-busted `expository-contracts` + resources scripts).
2. Open C1 Run → Step 5. **Re-paste the original external JSON** (not the corrupted textarea content).
3. Confirm the textarea still shows `"generation_notes": { ... }` (object), **not** `"[object Object]"`.
4. Press Next.
   - **Success:** advances to Step 6 **without** a failure toast.
   - **Failure:** remains on Step 5; toast includes `[reason @ stage · ErrorName]`. Open DevTools Console for `[PRISM] run-capture persist failed` (stage, estimate). Note whether stage is `indexeddb_putTextResource` or `localStorage_runstate`.
5. Hard-refresh the browser.
6. Reopen C1 Run.
   - **IndexedDB durability:** Step 5 restores with nested `generation_notes` intact **and** DevTools → Application → IndexedDB → `prismWorkflowResourcesDB` → `resource_meta` contains a `run_capture:…` row for the step. Clearing **sessionStorage** only and refreshing again still restores (proves IndexedDB, not session fallback).
   - **Session-only fallback:** restore works until sessionStorage is cleared; after clearing sessionStorage + refresh, capture is gone — treat as **not durable**; free localStorage/IndexedDB pressure and retry paste.

**Do not close the blocker until the original C1 Step 5 result survives a real browser refresh with nested JSON intact and IndexedDB durability confirmed.**

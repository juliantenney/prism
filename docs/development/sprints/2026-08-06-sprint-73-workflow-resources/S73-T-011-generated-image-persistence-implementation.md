# S73-T-011 — Generated-image persistence implementation

**Task:** S73-T-011  
**Sprint:** 73 — Workflow Resources  
**Type:** Phase 2 minimal vertical slice  
**Date:** 2026-08-06  
**Contract:** [S73-T-010-phase-2-acceptance-criteria.md](S73-T-010-phase-2-acceptance-criteria.md)  
**Status:** Implementation complete — **S73-T-012 verification in progress**

---

## 1. Scope implemented

- Workflow-scoped **Workflow Resources** owner module (`lib/prism-workflow-resources.js`).
- **Manual image attach** persistence on Sprint 70 visual-jobs path.
- **IndexedDB** binary payload + metadata stores (browser); **in-memory** injectable backend (Node tests).
- **Runstate reference rail** (`workflowResourceRefs` in `promptr.workflows.runstate.v1` snapshot).
- **Rehydration** into Utilities workspace on page refresh / workspace rebuild.
- **Export regeneration** path decoupled from prior-session `utilitiesLastHtml` requirement (regenerates when cache empty).
- **Focused unit tests** (`tests/s73-t-011-workflow-resources.test.js`).

**Not implemented:** PDF/Word/video, orphan UI, server sync, package re-import, Phase 3 generalisation.

---

## 2. Integration points

| Concern | Location |
| ------- | -------- |
| Owner module | `lib/prism-workflow-resources.js` |
| Script load | `index.html` (after `prism-visual-assets.js`, before workspace) |
| Attach write | `app.js` → `applyVisualJobAssetFile` → `persistWorkflowResourceFromVisualAttach` |
| Workspace rehydrate | `app.js` → `refreshUtilitiesOutputWorkspaceFromPage` → `rehydrateWorkflowResourcesIntoUtilitiesWorkspace` |
| Runstate refs | `app.js` → `buildWorkflowRunStateSnapshotForCurrentSelection` / `restoreWorkflowRunStateForWorkflow` |
| Preview | Existing `refreshUtilitiesLearnerPreviewWithVisualAssets` (manifest-fed) |
| Export HTML/ZIP/open-tab | `resolveUtilitiesExportHtmlForDownload` → `regenerateUtilitiesExportHtmlFromDurableState` fallback |
| Test hooks | `prismTestApi.*ForTest` exports in `app.js` |

---

## 3. Files changed

| File | Change |
| ---- | ------ |
| `lib/prism-workflow-resources.js` | **New** — canonical owner boundary |
| `app.js` | Persist on attach, rehydrate, runstate refs, export regeneration |
| `index.html` | Load workflow resources script |
| `tests/s73-t-011-workflow-resources.test.js` | **New** — focused verification |
| `tests/prism-vm-lib-bootstrap.js` | Include workflow resources in default lib bootstrap |

---

## 4. Canonical owner boundary

**Module:** `PRISM_WORKFLOW_RESOURCES`

**Storage shape (P5/P6 hybrid):**

- **Payload tier:** IndexedDB `prismWorkflowResourcesDB` → `resource_payload` store (Blob per `resource_id`).
- **Metadata tier:** IndexedDB `resource_meta` store (neutral JSON records, indexed by `workflow_id`).
- **Reference tier:** Runstate snapshot field `workflowResourceRefs` (minimal `{ resource_id, affordance_id, lifecycle_state }`).

**Neutral record fields:** `resource_id`, `resource_type` (`binary`), `mime_type`, `workflow_id`, `affordance_id`, `brief_id` (helper, not sole identity), `lifecycle_state`, `byte_size`, timestamps.

**Replacement rule (MVP):** Same `workflow_id` + `affordance_id` + `active` → **in-place payload update**, stable `resource_id`.

---

## 5. Persisted state categories

| Category | Consumer |
| -------- | -------- |
| `resource_id` | Owner lookup, projection `asset.resource_id`, runstate refs |
| `resource_type` | Future adapter dispatch (binary today) |
| `mime_type` | Intake validation, package extension, data URL materialization |
| Payload blob | Rehydration → transient `data_url` for render/export |
| `affordance_id` | Brief matching, resolver, runstate ref |
| `workflow_id` | Scoped listing |
| `lifecycle_state` | Active vs superseded/orphan (supersede not fully exercised) |
| `workflowResourceRefs` | Runstate reconnect on reload |

**Not persisted:** `generation_instruction`, manifests, `assetsByBriefId`, object URLs, HTML, ZIP.

---

## 6. Explicitly transient state

- Visual jobs / image briefs (recomputed)
- `visualAssetManifest` (rebuilt on hydrate)
- `assetsByBriefId` (session cache after hydrate)
- Object URLs / preview iframe HTML
- `utilitiesLastHtml` (optional session cache; export regenerates if empty)

---

## 7. Rehydration flow

```text
refreshUtilitiesOutputWorkspaceFromPage(page)
    → buildVisualJobsWorkspaceState (empty assetsByBriefId)
    → rehydrateWorkflowResourcesIntoUtilitiesWorkspace
        → listActiveResources(workflowId) from owner
        → load payload blob per resource
        → materialize data_url → createVisualAssetAssociation (transient)
        → refreshVisualAssetManifest
    → refreshUtilitiesLearnerPreviewWithVisualAssets (if hydrated > 0)
```

---

## 8. Preview / export regeneration flow

**Preview:** Unchanged render pipeline; fed by rehydrated manifest.

**Export:** `handleUtilitiesDownloadHtml` / `handleUtilitiesDownloadLearnerPackage` / `handleUtilitiesOpenInNewTab` call `resolveUtilitiesExportHtmlForDownload()`:

1. Use `utilitiesLastHtml` if present (cache).
2. Else rehydrate + `runUtilityPageExportPipeline` fresh render.

Package builder unchanged (`buildLearnerPackage` + manifest clone).

---

## 9. Replacement behaviour

Replacing image on same affordance updates payload under existing `resource_id` (no duplicate active resources for same affordance).

---

## 10. Failure behaviour

| Condition | Behaviour |
| --------- | --------- |
| Owner module absent | Session attach proceeds; `persisted: false` (no rollback) |
| Payload/metadata write failure | Attach rolled back from workspace; error on brief |
| Missing payload on rehydrate | Diagnostic `missing_payload`; brief error message; not counted as hydrated |
| Export render failure | Toast with explicit message |

---

## 11. Measurements (smoke band — Node/memory backend)

| Metric | Observed (2026-08-06) |
| ------ | --------------------- |
| Individual payload size | 70 bytes (1×1 PNG test fixture) |
| Resources per workflow | 1 (test) |
| putBinaryResource | < 15 ms (memory backend) |
| hydrateVisualAssetsIntoWorkspace | < 60 ms (memory backend, 1 resource) |
| Typical/heavy bands | **Not yet measured in browser** — S73-T-012 |

---

## 12. Verification results

| Test | Result |
| ---- | ------ |
| `tests/s73-t-011-workflow-resources.test.js` (5 tests) | **Pass** |
| `tests/sprint-70-slice-e2-learner-package-rewrite.test.js` | **Pass** |
| Browser manual rehydration (same profile) | **Pending** — S73-T-012 |

---

## 13. Deviations from T-010

| Item | Deviation |
| ---- | --------- |
| Browser measurement bands | Smoke band only in automated tests; browser profiling deferred to T-012 |
| Quota failure simulation | Not yet automated |
| `utilitiesLastHtml` | Still used as optional cache when present; export no longer **requires** prior-session snapshot |

---

## 14. Open issues

- Browser IndexedDB quota/performance bands need manual or instrumented verification (T-012).
- Orphan/supersede lifecycle when affordance removed from page JSON — minimal `active`-only handling today.
- Full vertical-slice browser E2E (attach → close tab → reopen → preview → ZIP) documented in T-012 checklist.

---

## 15. Definition-of-done assessment (T-010 §10)

| # | Criterion | Status |
| - | --------- | ------ |
| 1 | Canonical resource on attach | **Met** (when owner module loaded) |
| 2 | Payload survives refresh | **Met** (IDB + rehydrate path) |
| 3 | Payload survives new session | **Met** (architectural — IDB same origin; browser proof pending T-012) |
| 4 | Association survives | **Met** (runstate refs + owner metadata) |
| 5 | Rehydrate without reattach | **Met** (automated hydrate test) |
| 6 | Preview regenerates | **Met** (via existing preview refresh after hydrate) |
| 7 | HTML/ZIP regenerates | **Met** (export fallback path) |
| 8 | Prompt not required | **Met** (hydrate test without brief prompts) |
| 9 | Explicit failures | **Partial** (missing payload; write failure on attach) |
| 10 | Measurements recorded | **Partial** (smoke only) |
| 11 | Browser verified | **Pending** T-012 |
| 12 | Focused regressions | **Partial** (new suite + e2 pass) |
| 13 | No derived canonical state | **Met** |
| 14 | Resource-type neutrality | **Met** (neutral owner module) |
| 15 | Evidence vs T-010 | **This document** |

**Phase 2 slice success** awaits **S73-T-012** completion per sprint charter.

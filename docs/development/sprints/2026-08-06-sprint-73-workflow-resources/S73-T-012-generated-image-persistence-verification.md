# S73-T-012 — Generated-image persistence verification

**Task:** S73-T-012  
**Sprint:** 73 — Workflow Resources  
**Type:** Focused verification + measurement + narrow fixes  
**Date:** 2026-08-06  
**Contract:** [S73-T-010-phase-2-acceptance-criteria.md](S73-T-010-phase-2-acceptance-criteria.md)  
**Implementation under test:** [S73-T-011-generated-image-persistence-implementation.md](S73-T-011-generated-image-persistence-implementation.md)

---

## 1. Verification scope

This note verifies the S73-T-011 minimal generated-image Workflow Resource slice against T-010 criteria, with emphasis on:

- Browser-loaded attach -> persist -> refresh/new-session rehydrate.
- Preview/HTML/ZIP regeneration from durable workflow + canonical resources.
- Failure injection for payload/meta/storage failures.
- Workload measurements including a heavy band above 20 MB total payload.

No architecture redesign was performed.

---

## 2. Environment and browser versions

- OS: Windows 11 (`win32 10.0.26100`)
- Browser runtime (Cursor embedded):  
  `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/3.13.25 Chrome/144.0.7559.236 Electron/40.10.3 Safari/537.36`
- App URL: `http://localhost/prism/`

---

## 3. V1–V15 matrix

| ID | Result | Notes |
| -- | ------ | ----- |
| V1 Resource record creation | **Pass** | Attach created canonical records with stable `resource_id`, `workflow_id`, `affordance_id`, `mime_type`, and Blob payload. |
| V2 Runstate reference persistence | **Pass** | `workflowResourceRefs` persisted; no `data:image`, `blob:`, or `visualAssetManifest` in runstate. |
| V3 Refresh rehydration | **Pass** | Reload + restore + rehydrate succeeded; resources repopulated without reattach. |
| V4 New-session rehydration | **Pass** | New tab/session after closing original tab rehydrated persisted resources. |
| V5 Stable association | **Pass** | Non-sequential attaches restored to correct affordances; no cross-swaps observed. |
| V6 Replacement semantics | **Pass** | Replace on same affordance preserved `resource_id`; single active association remained. |
| V7 Prompt independence | **Pass** | Rehydrate/preview/export worked without persisted `generation_instruction`. |
| V8 Preview regeneration | **Pass** | Rebuild used workflow + canonical resources + transient projection; no canonical mutation evidence. |
| V9 Standalone HTML regeneration | **Pass** | Fresh HTML generated after reopen with cleared `utilitiesLastHtml`. |
| V10 ZIP regeneration | **Pass** | Fresh ZIP generated after reopen; asset paths and payload presence validated. |
| V11 Missing payload failure | **Conditional** | Missing payload reported (`missing_payload`) and omitted from projection/export set; package-level warning text was not emitted. |
| V12 Storage-write/partial-failure safety | **Conditional** | Payload/meta/storage failures were explicit and attach failed safely; runstate write-failure injection was not reproducible in-browser. |
| V13 Quota/storage-unavailable behavior | **Pass** | Controlled quota/storage errors failed explicitly; no fallback to base64 runstate persistence observed. |
| V14 Browser/Node parity | **Pass** | Node suites passed; browser module load and runtime calls verified in live path. |
| V15 Resource-type-neutral boundary | **Pass** | Owner boundary remains neutral (`PRISM_WORKFLOW_RESOURCES`, `resource_type`, metadata/payload concepts). |

---

## 4. Automated test results

Command run:

`node --test tests/s73-t-011-workflow-resources.test.js tests/sprint-70-slice-e2-learner-package-rewrite.test.js tests/sprint-70-slice-e3-learner-package-zip.test.js tests/sprint-70-slice-8-two-pane-manual-assets.test.js tests/learner-renderer-vnext-visual-affordances.test.js`

Result:

- 41 tests passed
- 0 failed
- Duration: ~1.5 s

---

## 5. Manual browser verification steps and outcomes

1. Loaded `http://localhost/prism/` and verified `window.PRISM_WORKFLOW_RESOURCES` and `window.__PRISM_TEST_API`.
2. Built a verification workflow page with valid structure and injected visual affordances.
3. Attached two images in non-sequential order.
4. Persisted runstate and confirmed canonical owner records.
5. Reloaded page; restored workflow and rehydrated.
6. Opened a new tab/session; restored workflow and rehydrated again.
7. Generated fresh standalone HTML and learner package ZIP after reopen.
8. Executed controlled failure injections (payload write fail, metadata write fail, storage unavailable).
9. Executed heavy-band scenario with 10 images and ~23.7 MB total payload.

---

## 6. Refresh and new-session evidence

### Refresh path (same tab)

- Workflow: `wf-s73-t012-verified`
- Explicit rehydrate call: `hydrated: 2`
- Rehydrate duration: `137 ms`
- Restored resources mapped back to affordances:
  - `va-a1-gen-01` -> `wr-1acae28d-d4a2-4614-8c7c-040b6de9610e`
  - `va-a2-gen-02` -> `wr-1c9f8995-771a-43e9-81b0-359ee731acba`

### New-session path (new tab after closing original tab)

- Workflow: `wf-s73-t012-verified`
- Rehydrate duration: `375 ms`
- `rehydrated: 2`
- HTML regeneration: success (`459.5 ms`)
- ZIP regeneration: success (`zipBytes: 1,492,092`)

---

## 7. Preview regeneration evidence

- Preview rebuilt from canonical resources + transient workspace manifest.
- Rehydrated assets were materialized as `render_source.kind: data_url` in transient workspace.
- `blob:`/object URLs remained transient and were not persisted in runstate.

---

## 8. HTML regeneration evidence

- Fresh HTML generation after reopen succeeded without prior-session `utilitiesLastHtml`.
- Verified by setting `utilitiesLastHtml` empty before export resolve.
- `wf-s73-t012-verified` HTML output length: `2,233,081` bytes.

---

## 9. ZIP regeneration evidence

- Fresh ZIP generation after reopen succeeded.
- `wf-s73-t012-verified` ZIP:
  - asset paths: `2`
  - zip bytes: `1,492,092`
- Heavy band (`wf-s73-t012-heavy2`) ZIP:
  - asset paths: `10`
  - zip bytes: `23,742,617`

---

## 10. Replacement and prompt-independence evidence

### Replacement semantics

- Replaced image on same affordance (`vb-38-4-va-a1-gen-01-activity-a1-materials-entry`).
- `resource_id` stable before/after:
  - before: `wr-1acae28d-d4a2-4614-8c7c-040b6de9610e`
  - after: `wr-1acae28d-d4a2-4614-8c7c-040b6de9610e`
- Active records for that affordance remained exactly `1`.

### Prompt independence

- Runstate persistence checks found no persisted `generation_instruction`.
- Rehydrate/preview/HTML/ZIP succeeded with persisted payload + metadata + association only.

---

## 11. Failure-injection evidence

### Payload write failure (controlled `QuotaExceededError`)

- Result: attach failed (`ok: false`, error surfaced), no workspace asset left for failed attach.

### Metadata write failure

- Result: attach failed (`ok: false`, `meta_write_failed`), compensating `deletePayload` rollback invoked.

### Storage unavailable/open failure

- Result: attach failed explicitly (`indexeddb_open_failed`), no false success.

### Missing payload on rehydrate

- Deleted payload for one referenced resource.
- Rehydrate diagnostics included:
  - `code: missing_payload`
  - resource omitted from hydrated manifest.

### Runstate persistence failure

- In-browser `localStorage.setItem` override did not produce a reproducible failure hook for this path.
- Marked as conditional coverage gap for follow-up hardening test seam.

---

## 12. Workload measurements

### Smoke band

- 1-2 attached images under 500 KiB-1 MiB range (per-file examples: `288,565` and `403,955` bytes).
- Refresh/new-session rehydrate and HTML/ZIP regeneration succeeded.

### Typical band

- Covered by multi-image browser runs in the 2-10 image range; stable persistence/regeneration observed.
- Primary measured representative run: `wf-s73-t012-verified` (2 images, ~1.5 MB total for active target pair).

### Heavy band (required >=20 MB)

- Workflow: `wf-s73-t012-heavy2`
- Images: `10`
- Largest individual payload: `2,370,356` bytes
- Total payload: `23,703,113` bytes (~22.6 MiB)
- Write duration: `6,920.1 ms`
- Rehydrate duration: `1,481.7 ms`
- HTML generation: `538.7 ms`
- ZIP generation: `1,057.2 ms`
- ZIP size: `23,742,617` bytes
- Visible responsiveness: operation remained interactive but with noticeable latency growth during later attaches.

### Excessive/failure band

- Controlled failure injection used (no disk-filling strategy).
- Explicit failure handling confirmed for quota-like and adapter-unavailable failures.

---

## 13. Storage-estimate observations

All values are browser estimates (`navigator.storage.estimate()`), not fixed guarantees.

### Verified workflow run (`wf-s73-t012-verified`)

- Before: `usage 2,014,882` (IndexedDB)
- After: `usage 3,517,358` (IndexedDB)

### Heavy run (`wf-s73-t012-heavy2`)

- Before: `usage 27,537,876` (IndexedDB)
- After: `usage 51,266,170` (IndexedDB)
- Reported quota remained ~`191.5 GB` in this local profile, but is environment-dependent.

---

## 14. Memory / representation observations

Observed chain:

`IndexedDB Blob -> payload read -> transient workspace asset -> data_url render source -> HTML export rewrite -> ZIP buffers`

Key observations:

- Rehydration path materializes Blob payloads into `data_url` for render/export projection.
- Preview state uses transient sources only; no persisted object URL in runstate.
- ZIP generation adds additional in-memory buffers, and cost grows with heavy payload totals.
- Heavy run remained successful at ~23.7 MB, with increased attach and regeneration times.

---

## 15. Browser/Node parity evidence

- Browser path:
  - `PRISM_WORKFLOW_RESOURCES` present in runtime.
  - `index.html` load order verified by automated test.
  - Attach -> persist -> reload/new-session rehydrate -> HTML/ZIP regeneration demonstrated.
- Node/source path:
  - Focused suites passed (41/41).
  - `tests/prism-vm-lib-bootstrap.js` includes `lib/prism-workflow-resources.js`.

---

## 16. Defects found

1. **Missing-payload export warning granularity**
   - Missing payload is diagnosed during rehydrate, but package-level warning text may remain empty after omission.
2. **Runstate-failure injection seam**
   - Could not force a clean in-browser runstate persistence failure at the attach boundary for explicit rollback assertion.

Neither issue blocked the primary user outcome.

---

## 17. Narrow fixes made

- No runtime code changes were required during T-012 verification.
- Verification remained evidence-focused; no architectural expansion performed.

---

## 18. Remaining constraints

- Browser persistence remains same-origin/same-profile best-effort storage, not archival durability.
- Missing payload handling is explicit at diagnostics layer, but export/package warning surfacing can be improved.
- Runstate write-failure behavior needs a stronger test seam for deterministic injection.

---

## 19. Assessment against T-010 definition of done

T-010 slice definition-of-done is met for the primary outcome:

- Resource creation/payload persistence/association survival: **met**
- Refresh and new-session rehydration: **met**
- Preview + HTML + ZIP regeneration post-reopen: **met**
- Prompt independence: **met**
- Explicit handling of key persistence failures: **met** (with conditional gap on runstate-injection seam)
- Heavy-band evidence (>=20 MB): **met**
- Browser path proof beyond Node-only tests: **met**
- No derived artefacts treated as canonical persisted state: **met**

---

## 20. Phase 2 recommendation

### **Phase 2 complete with documented constraints**

The generated-image persistence MVP outcome is verified in browser and test paths, including heavy-band persistence and regeneration.  
Non-blocking constraints remain around warning granularity for missing payload export and deterministic runstate-failure injection coverage.

**Next sprint task:** post-Phase-2 review / explicit Phase 3 decision-planning task.  
`S73-T-020` and `S73-T-021` remain blocked pending explicit authorisation.


# Sprint 95 — Real-journey integration gate

**Date:** 2026-11-03  
**Status:** **Complete — live DUU author-verified; Sprint 95 CLOSED — ACCEPTED**  
**Depends on:** [S95-D05](decisions.md#s95-d05--accept-m4-unified-learning-journey-runtime-compatibility-and-integration), [S95-D06](decisions.md#s95-d06--accept-m5-author-facing-unified-learning-journey-publishing), [S95-D07](decisions.md#s95-d07--close-sprint-95--unified-learning-journey-runtime-accepted)

## Verdict

| Question | Answer |
| -------- | ------ |
| Can the real journey be assembled from existing application data? | **Yes** — when the author’s browser store contains a Complete DUU Learning Journey and hydrated constituents. |
| Author-facing unified download (no console)? | **Yes (M5)** — **Download Unified Learning Journey** in Utilities Learning Journey authoring preview. |
| Assembled and verified against live DUU? | **Yes (author)** — real *Deciding Under Uncertainty* via normal UI (S95-D06). Automation store remained empty. |
| Default download changed? | **No** — multi-document ZIP remains default. |

## Data-access route (existing app)

1. **Persist:** `localStorage` keys `promptr.workflows.v1` (catalogue) + `promptr.workflows.runstate.v1` (captures/refs); IndexedDB `prismWorkflowResourcesDB` for media.  
2. **Preview context:** Open Utilities Authoring Preview on the Learning Journey workflow → sets `state.learningJourneyCommissioningPreviewContext = { page, sourceWorkflowId }`.  
3. **Hydrate:** `prepareLearningJourneyPreviewProductionByCommissionId` → per-commission `hydrateConstituentRunRecordForProductionStatus` → `authoritativeAssembledPage`.  
4. **Preflight:** `preflightLearningJourneyLearnerPackage` (all commissions must be Complete).  
5. **Constituent packages:** `buildConstituentLearnerPackageModel` (returns `sourcePage` + `productId`).  
6. **Unified shell (author path, M5):** click **Download Unified Learning Journey** → `handleLearningJourneyUnifiedShellPackageDownload` → auto artefact proposal → `assembleLearningJourneyUnifiedShellPackage`.  
7. **Unified shell (test/automation only):** `window.__PRISM_TEST_API.handleLearningJourneyUnifiedShellPackageDownloadForTest(options)`.

Multi-document download continues to use `handleLearningJourneyLearnerPackageDownload` only (ZIP control).

## Artefact contract (automatic)

- **Not stored** on design-page commissions.
- **Derived** via `proposeArtefactContractFromLearningJourney` from:
  - `commission.dependencies` **explicitly naming** an earlier Assessment Pack commission id, and
  - producer `sourcePage.assessment_evidence` constructed_performance → `assessment-constructed-{elicitation_id}`.
- **Supported consumers:** Assessment Pack and **Interactive** (when dependency text names the producer).
- **Not inferred** from resource order or compatible workspace types alone.
- **Missing / ambiguous** metadata reported in `artefactProposal.gaps` (author toast); workspace ids are never fabricated.
- Standalone fallback copy remains on reference declarations.
- Test-only override: explicit `producerCommissionId` / `consumerCommissionId` or a full `artefactContract`.

## Author verification procedure (M5 — visible UI only)

Use the browser profile that already holds the Complete *Deciding Under Uncertainty* Learning Journey. Do **not** use the Developer Tools console.

1. Hard-reload PRISM so cache markers load (`?v=20261103-s95-m5-unified-publishing` on `app.js`, `learning-journey-unified-shell.js`, and `learner-renderer-vnext-browser.js`).
2. Open the Complete Learning Journey in **Utilities → Authoring Preview** (commissioning preview).
3. Confirm the download strip shows both:
   - multi-document **ZIP** (unchanged), and  
   - **Download Unified Learning Journey**.
4. Click **Download Unified Learning Journey**.
5. Expect either:
   - success toast and a browser ZIP download, or  
   - a clear error toast naming incomplete commissions or an unresolved artefact relationship (do not ignore errors).
6. Extract the ZIP and serve the folder over **HTTP** (not `file://`).
7. Open `index.html` in the browser:
   - Overview is the default destination; TOC lists Overview then all six resources.
   - Navigate every constituent; Interactive internal section nav and journey sidebar Previous/Next resource coexist.
8. On C5: enter a constructed judgement and blur/save.
9. On C6: confirm the earlier judgement appears as a **read-only** artefact reference (no editable controls inside the reference).
10. Reload the page; confirm the C6 reference and drafts persist.
11. Confirm resource navigation and journey navigation still work after reload.
12. Optionally re-run the multi-document ZIP download once to confirm it still works unchanged.

Record pass/fail against these steps before accepting M5 / closing Sprint 95.

## What exists vs missing

| Item | State |
| ---- | ----- |
| LJ design page + commission ids + product_ids | In browser store when DUU is present |
| Constituent workflow linkage | In workflow catalogue |
| Hydrated source pages / learner HTML | Built on demand from captures + resources |
| Produce/reference artefact contract | **Not persisted** — derived at assemble time |
| Author-facing Unified download control | **Present (M5)** |
| Live DUU in this automation session | **Absent** |
| Repo / Export-all JSON sufficient alone | **No** — omits runstate + IndexedDB resources |

## Validation performed

| Check | Result |
| ---- | ------ |
| Inspect Cursor IDE browser localStorage for DUU | Empty store — 0 workflows |
| Unit: artefact proposal incl. Interactive consumer | **Pass** — `tests/s95-real-journey-artefact-proposal.test.js` |
| Unit: author UI control visibility / wiring | **Pass** — `tests/s95-m5-unified-publishing-ui.test.js` |
| Browser: control on `index.html` + AP→Interactive ZIP handoff | **Pass** — `tests/s95-m5-unified-publishing-browser.test.js` |
| Live six-resource DUU via author UI | **Pass (author)** — download, render, nav, C5→C6 labelled read-only, automatic contract |
| Full screen-reader audit | **Deferred** — S95-AD-020 |

## Packaging / styling / navigation (prior fixes, still in force)

- Runtime script fetched in-browser for assemble (`runtimeScript`).
- `learnerCss` passed from authoring path; commission titles from design-page metadata.
- Overview TOC destination; two-level nav (journey sidebar + resource sequential section nav).

## Remaining debt (not blockers for close)

1. MathLive remount + MathLive/MathJax packaging — S95-AD-011 / S95-AD-012.  
2. Presentation-sprint polish (nav overlap, sidebar, collapsible TOC, responsive/zoom, instructional copy, further keyboard/SR) — S95-AD-015…020.  
3. Making unified shell the default download remains unauthorised — S95-AD-008.

## Closure

Sprint 95 is **CLOSED — ACCEPTED** ([SPRINT-95-CLOSURE.md](SPRINT-95-CLOSURE.md)). Prompt-pipeline changes and presentation-sprint implementation remain unauthorised until separately opened.

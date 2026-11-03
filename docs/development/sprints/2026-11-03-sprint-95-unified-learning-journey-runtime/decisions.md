# Sprint 95 — Decisions

## S95-D01 — Open Sprint 95 — Unified Learning Journey Runtime

**Date:** 2026-11-03  
**Status:** Accepted  
**Depends on:** [Sprint 94 CLOSED — ACCEPTED](../2026-11-02-sprint-94-learning-journey-continuity/SPRINT-94-CLOSURE.md) (S94-D07)

**Decision:** Open **Sprint 95 — Unified Learning Journey Runtime** as an architectural-foundations and bounded-implementation sprint.

**Objective:** Establish foundations for a unified, accessible, single-document Learning Journey runtime with persistent navigation, container-scoped resource lifecycle, and explicit learner-artefact relationships — while preserving standalone publishing and (until superseded) multi-document Journey packages.

**Authoritative basis:**

- Sprint 94 closure: continuity is a commissioning contract; multi-document delivery and manual C5 → C6 retrieval remain known limitations, not generation defects.
- Read-only investigations (2026-11-03): unified runtime feasible via mount-on-demand; Assessment Pack preferred for M1; no iframes.

**Not authorised by opening alone:**

- production code before M1 is explicitly authorised in an implementation chat;
- regenerating *Deciding Under Uncertainty*;
- changing Learning Journey publishing in M1;
- server-side learner accounts, AI marking, new frameworks, wholesale redesign, user theme UI;
- Interactive V2 / PB-FA-019;
- reopening Sprint 94.

**First deliverable:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) with M1 plan. First implementation slice: **M1 — Renderer Lifecycle Demonstrator**.

**Predecessor:** Sprint 94 remains **CLOSED — ACCEPTED**. Do not reopen.

---

## S95-D02 — Accept M1 Renderer Lifecycle Demonstrator (Assessment Pack)

**Date:** 2026-11-03  
**Status:** Accepted  
**Depends on:** [S95-D01](#s95-d01--open-sprint-95--unified-learning-journey-runtime)

**Decision:** Accept **M1 — Renderer Lifecycle Demonstrator** as implemented for Assessment Pack.

**Delivered:**

- Container-scoped `install` / `dispose` for assessment, guided-review, assessment-output, and draft persistence.
- `renderLearnerResourceFragment` / `mountLearnerResource` / `unmountLearnerResource` mount API (`lib/learner-renderer-vnext/resource-lifecycle.js`).
- Mountable fragment uses `<article role="region">` (no nested `<main>`); standalone export remains `<main>` with auto-boot scripts.
- Focused tests in `tests/s95-m1-assessment-pack-lifecycle.test.js`; AP + LJ publish regressions green; browser artefacts rebuilt.

**Not authorised by this decision:**

- M2 Unified Learning Journey Shell;
- M3 artefact handoff;
- M4 consolidation / other product-type lifecycles;
- Changing Learning Journey publishing;
- Regenerating educational resources.

**Evidence:** [VALIDATION.md](VALIDATION.md) (2026-11-03 M1 rows).

---

## S95-D03 — Accept M2 Unified Learning Journey Shell (additive)

**Date:** 2026-11-03  
**Status:** Accepted  
**Depends on:** [S95-D02](#s95-d02--accept-m1-renderer-lifecycle-demonstrator-assessment-pack)

**Decision:** Accept **M2 — Unified Learning Journey Shell** as an **additive** publishing capability.

**Delivered:**

- Single-document shell with persistent TOC, one `<main>`, prev/next, aria-live announcements, focus management.
- Reuses M1 `mountLearnerResource` / `unmountLearnerResource` (no second renderer).
- Package API: `assembleLearningJourneyUnifiedShellPackage` / `buildLearningJourneyUnifiedShellHtml` (`lib/learning-journey-unified-shell.js`, also re-exported from `learning-journey-learner-package.js`).
- ZIP layout: `index.html` + `runtime/learner-renderer-vnext-browser.js` + `media/<commissionId>/…`.
- Multi-document LJ ZIP and standalone publishing remain unchanged and regression-green.
- Real-browser verification (Playwright + system Chrome) for navigation, persistence, reload, and a11y shell basics.

**Not authorised by this decision:**

- M3 artefact handoff / C5 → C6 produce-reference;
- Replacing multi-document ZIP as the default download;
- M4 lifecycle for Interactive / Expository / Situated Task / MathLive;
- Regenerating *Deciding Under Uncertainty*;
- Learner theme UI or wholesale redesign.

**Evidence:** [VALIDATION.md](VALIDATION.md) (2026-11-03 M2 rows).

---

## S95-D04 — Accept M3 Explicit Learner Artefact Handoff

**Date:** 2026-11-03  
**Status:** Accepted  
**Depends on:** [S95-D03](#s95-d03--accept-m2-unified-learning-journey-shell-additive)

**Decision:** Accept **M3 — Explicit Learner Artefact Handoff**.

**Delivered:**

- Generic produce/reference contract (`lib/learner-renderer-vnext/learner-artefact-contract.js`) — not hard-coded to C5/C6.
- Live read-only resolution of declared artefacts from the producer’s current saved draft workspace only.
- Unified shell injects reference or missing-input UI on consumer mount.
- C5 → C6 demonstrator via synthetic Assessment Pack journey (no educational regeneration).
- Node + Playwright browser evidence; M1/M2/AP/LJ regressions green.

**Not authorised by this decision:**

- M4 product-type consolidation / MathLive remount;
- Artefact versioning or snapshots;
- AI marking;
- Making unified shell the default download;
- Regenerating *Deciding Under Uncertainty*.

**Evidence:** [VALIDATION.md](VALIDATION.md) (2026-11-03 M3 rows).

---

## S95-D05 — Accept M4 Unified Learning Journey Runtime Compatibility and Integration

**Date:** 2026-11-03  
**Status:** **Accepted** (qualified)  
**Depends on:** [S95-D04](#s95-d04--accept-m3-explicit-learner-artefact-handoff)

**Decision:** Accept **M4 — Unified Learning Journey Runtime Compatibility and Integration**, with the following explicit qualifications:

1. Lifecycle compatibility and **synthetic** six-resource integration are demonstrated.  
2. Real *Deciding Under Uncertainty* integration is **not** yet demonstrated.  
3. MathLive remount and dependency packaging remain **unverified**.  
4. Full manual accessibility testing (including a full screen-reader audit) remains **outstanding**.

**Delivered:**

- Compatibility inventory (`COMPATIBILITY-INVENTORY.md`) — live journey HTML absent on disk; synthetic fixture used.
- Container-scoped install/dispose for ordering, math-entry (MathLive when present; textarea fallback otherwise), and revision-criterion; wired into `mountLearnerResource` / `unmountLearnerResource`.
- Six-resource synthetic DUU-shaped unified shell with C5→C6 artefact handoff preserved.
- Playwright browser evidence for navigation, ordering, math fallback persistence, landmarks, missing→resolved artefact, reload.
- Standalone + multi-document publishing remain additive/green; guided-review/assessment document-root event scope fixed for standalone boot.
- No prompt-pipeline changes; educational content not regenerated.

**Not authorised by this decision:**

- Sprint 95 closure;
- Learning Journey prompt-pipeline changes;
- Making unified shell the default download;
- Regenerating *Deciding Under Uncertainty*;
- Claiming real-journey verification without a separate integration gate;
- AI marking / artefact versioning / server accounts.

**Evidence:** [VALIDATION.md](VALIDATION.md) (2026-11-03 M4 rows). Follow-on: real-journey integration gate (this chat).

---

## S95-D06 — Accept M5 Author-facing Unified Learning Journey Publishing

**Date:** 2026-11-03  
**Status:** **Accepted**  
**Depends on:** [S95-D05](#s95-d05--accept-m4-unified-learning-journey-runtime-compatibility-and-integration)

**Decision:** Accept **M5 — Author-facing Unified Learning Journey Publishing**.

**Delivered:**

- Utilities control **Download Unified Learning Journey** (`#utilitiesDownloadUnifiedJourneyBtn`), shown only during Learning Journey commissioning preview, alongside the existing multi-document ZIP.
- Download path reuses prep/hydrate/preflight; incomplete commissions and unresolved explicit artefact relationships report author-facing toasts (no silent partial package when declared pairs cannot be resolved).
- Automatic `produces` / `references` proposal extended to supported non-Assessment-Pack consumers (**Interactive**) when `commission.dependencies` explicitly name an Assessment Pack producer; workspace ids derived from hydrated constructed elicitations only — no order-only inference, no fabricated ids, standalone fallback preserved.
- No developer-console requirement for the author path; test API retained for automation.
- Multi-document ZIP and standalone publishing unchanged; unified remains **non-default**.

**Author live-browser evidence (real *Deciding Under Uncertainty*):**

- Unified package downloaded via the normal UI (no developer console).
- Journey opens; constituent resources render.
- Journey and component navigation present.
- C5 constructed response appears in C6 as a labelled, read-only artefact.
- Artefact contract generated automatically without manually supplying commission identifiers.

**Not authorised by this decision alone:**

- Closing Sprint 95 (see S95-D07);
- Making unified shell the default download;
- Learning Journey prompt-pipeline changes or educational regeneration;
- Presentation-sprint shell/nav polish;
- MathLive packaging claims.

**Evidence:** [VALIDATION.md](VALIDATION.md) (M5 rows); [REAL-JOURNEY-INTEGRATION.md](REAL-JOURNEY-INTEGRATION.md).

---

## S95-D07 — Close Sprint 95 — Unified Learning Journey Runtime (Accepted)

**Date:** 2026-11-03  
**Status:** Accepted  
**Depends on:** [S95-D06](#s95-d06--accept-m5-author-facing-unified-learning-journey-publishing)

**Decision:** Close **Sprint 95 — Unified Learning Journey Runtime** as **CLOSED — ACCEPTED**.

**Completed milestones:** M1–M5 accepted (M4 remains qualified for MathLive remount/packaging and full SR audit; those remain architectural debt, not reopen triggers).

**Closing Sprint 95 does not mean** any of the following have been done:

- making the unified shell the default Learning Journey download;
- presentation-sprint UI polish (overlapping component nav, sidebar refinement, collapsible TOC, responsive/zoom behaviour, context-sensitive C5/C6 manual-transfer copy);
- further full keyboard / screen-reader verification beyond recorded automated landmarks and author smoke;
- MathLive remount stability or MathJax/MathLive asset bundling in the unified ZIP;
- Learning Journey prompt-pipeline changes or regeneration of educational content;
- Interactive V2 / Course Home / server learner accounts / AI marking.

**Successor:** Presentation-sprint work is **not** started by this close. Authorise it separately.

**Evidence:** [SPRINT-95-CLOSURE.md](SPRINT-95-CLOSURE.md); [VALIDATION.md](VALIDATION.md); [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md).

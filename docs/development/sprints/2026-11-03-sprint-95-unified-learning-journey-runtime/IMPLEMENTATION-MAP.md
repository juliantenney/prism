# Sprint 95 — Implementation map

**Status:** **CLOSED — ACCEPTED** (S95-D07)  
**Sprint:** 95 — Unified Learning Journey Runtime  
**Opening:** [S95-D01](decisions.md#s95-d01--open-sprint-95--unified-learning-journey-runtime)  
**Closure:** [SPRINT-95-CLOSURE.md](SPRINT-95-CLOSURE.md)  
**Charter:** [SPRINT-95-CHARTER.md](SPRINT-95-CHARTER.md)

Do not reopen. Presentation-sprint work requires separate authorisation.

---

## Current posture

```text
Sprint 94                             CLOSED — ACCEPTED — do not reopen
Sprint 95                             CLOSED — ACCEPTED (S95-D07)
M1 Renderer Lifecycle Demonstrator    ACCEPTED (S95-D02)
M2 Unified LJ Shell                   ACCEPTED (S95-D03) — additive
M3 Explicit Artefact Handoff          ACCEPTED (S95-D04)
M4 Compatibility / Integration        ACCEPTED (S95-D05, qualified)
M5 Author-facing Unified Publishing   ACCEPTED (S95-D06) — live DUU verified
Presentation sprint                   NOT started
```

---

## Milestones

| ID | Title | Status |
| -- | ----- | ------ |
| M1 | Renderer Lifecycle Demonstrator (Assessment Pack preferred) | **ACCEPTED** (S95-D02) |
| M2 | Unified Learning Journey Shell | **ACCEPTED** (S95-D03) — additive |
| M3 | Explicit Learner Artefact Handoff (C5 → C6) | **ACCEPTED** (S95-D04) |
| M4 | Consolidation and Wider Compatibility | **ACCEPTED** (S95-D05, qualified) |
| M5 | Author-facing Unified Learning Journey Publishing | **ACCEPTED** (S95-D06) |

### Task index (initial)

| ID | Title | Milestone | Status |
| -- | ----- | --------- | ------ |
| S95-T-001 | Open sprint + map + M1 plan | Open | **COMPLETE** |
| S95-T-002 | Assessment Pack container-scoped init/dispose | M1 | **COMPLETE** |
| S95-T-003 | Fragment vs script separation for mountable AP body | M1 | **COMPLETE** |
| S95-T-004 | Mount / unmount / remount restore tests | M1 | **COMPLETE** |
| S95-T-005 | Standalone AP publish regression lock | M1 | **COMPLETE** |
| S95-T-006 | Journey shell single document + TOC + content region | M2 | **COMPLETE** |
| S95-T-007 | Accessible navigation / focus / announcements | M2 | **COMPLETE** |
| S95-T-008 | Produce/reference artefact contract + missing-input UI | M3 | **COMPLETE** |
| S95-T-009 | C5 → C6 read-only judgement demonstrator | M3 | **COMPLETE** |
| S95-T-010 | Extend lifecycle to other product types + compatibility | M4 | **COMPLETE** (S95-D05) |
| S95-T-011 | Real-journey unified-shell integration gate | Post-M4 | **COMPLETE** — path ready; live DUU blocked |
| S95-T-012 | Author-facing Download Unified Learning Journey | M5 | **COMPLETE** — accepted (live DUU) |

---

## M1 — Renderer Lifecycle Demonstrator (initial implementation plan)

**Goal:** Prove one resource type (prefer **Assessment Pack**) can be mounted into a specified DOM container with explicit scoped initialisation and safe disposal, without changing Learning Journey publishing.

### Required behaviours

1. Existing standalone HTML publishing remains unchanged in behaviour.  
2. Resource markup can be rendered into a specified container.  
3. Runtime initialisation is explicitly scoped to that container.  
4. Learner input is captured and persisted (existing draft pageKey model).  
5. The resource can be unmounted safely (listeners/timers cleared; drafts flushed).  
6. The resource can be remounted with learner state restored.  
7. Repeated mounting does not duplicate event handlers or timers.  
8. Keyboard and assistive-technology behaviour remains correct for the mounted resource.

### Likely touch points (investigation-backed; not yet implemented)

| Area | Files (indicative) |
| ---- | ------------------ |
| Assessment runtime | `lib/learner-renderer-vnext/assessment-runtime.js` |
| Guided review | `lib/learner-renderer-vnext/guided-review-runtime.js` |
| Assessment output | `lib/learner-renderer-vnext/assessment-output.js` |
| Draft persistence | `lib/learner-renderer-vnext/learner-draft-persistence.js`, `learner-draft-runtime.js` |
| Page HTML emission | `lib/learner-renderer-vnext/render-page.js` |
| Browser rebuild | `npm run build:learner-renderer-vnext-browser` |

### M1 non-goals

- Changing `assembleLearningJourneyLearnerPackage` / home HTML.  
- Artefact produce/reference contract.  
- Interactive / Expository / Situated Task lifecycle (unless needed as smoke only).  
- Theme UI.

### M1 acceptance

- Focused automated tests for mount → type → unmount → remount restore; dispose idempotency; no double-handler.  
- Existing `s93-assessment-pack-*` render/persistence suites remain green.  
- Standalone export path still auto-boots without requiring journey globals.  
- Evidence logged in [VALIDATION.md](VALIDATION.md).

**M1 result (2026-11-03):** **ACCEPTED** — see S95-D02 and VALIDATION.md. API: `renderLearnerResourceFragment` / `mountLearnerResource` / `unmountLearnerResource`.

---

## M2 — Unified Learning Journey Shell

**M2 result (2026-11-03):** **ACCEPTED** (S95-D03). Additive single-document package via `lib/learning-journey-unified-shell.js`. Reuses M1 mount API. Multi-document ZIP remains the default path until an explicit superseding decision.

## M3 — Explicit Learner Artefact Handoff

**M3 result (2026-11-03):** **ACCEPTED** (S95-D04). Module: `lib/learner-renderer-vnext/learner-artefact-contract.js`. Shell option: `artefactContract`. Demonstrator uses synthetic AP pages for C5→C6; educational content not regenerated.

## M4 — Consolidation and Wider Compatibility

**M4 result (2026-11-03):** **ACCEPTED** (S95-D05, qualified). Compatibility inventory recorded first. Lifecycle install/dispose extended for ordering, math-entry (textarea fallback without MathLive), and revision-criterion. Six-resource synthetic DUU-shaped shell + C5→C6 validated. Live DUU not demonstrated. Unified shell remains additive.

**Real-journey gate (2026-11-03):** Developer-only `__PRISM_TEST_API.handleLearningJourneyUnifiedShellPackageDownloadForTest` reuses multi-doc hydrate/preflight. Artefact contract may be proposed from `dependencies` + constructed workspaces. Live verification blocked — automation browser store empty. See [REAL-JOURNEY-INTEGRATION.md](REAL-JOURNEY-INTEGRATION.md).

## M5 — Author-facing Unified Learning Journey Publishing

**M5 result (2026-11-03):** **ACCEPTED** (S95-D06). Live *Deciding Under Uncertainty* verified via normal UI.

**Delivered:**

- Author control **Download Unified Learning Journey** in Utilities authoring preview (alongside multi-document ZIP). Visible only when Learning Journey commissioning preview is active.
- Reuses existing prep/hydrate/preflight path; incomplete commissions surface via `formatPreflightBlockers`; unresolved explicit artefact pairs surface via proposal gaps (no silent partial package when pairs are declared but unresolved).
- `proposeArtefactContractFromLearningJourney` supports Assessment Pack **and Interactive** consumers when `commission.dependencies` explicitly name an Assessment Pack producer; workspace ids derived from hydrated constructed elicitations only.
- Multi-document ZIP and standalone publishing unchanged; unified remains non-default.
- Automated: `tests/s95-m5-unified-publishing-ui.test.js`, `tests/s95-m5-unified-publishing-browser.test.js`, extended `tests/s95-real-journey-artefact-proposal.test.js`.
- Author live evidence: UI download; resources render; journey + component nav; C5→C6 labelled read-only artefact; automatic contract without manual commission ids.

**Sprint closed:** [SPRINT-95-CLOSURE.md](SPRINT-95-CLOSURE.md) (S95-D07).

---

## Acceptance criteria (sprint-level)

Sprint 95 is complete when:

1. M1–M5 are accepted (M4 may retain recorded qualifications).  
2. Standalone publishing remains fully supported.  
3. Multi-document LJ publishing remains available until an accepted superseding path is documented.  
4. Explicit artefact relationships only — no implicit sharing of all drafts.  
5. Accessibility requirements for shell navigation and mount lifecycle are met and tested (full SR may remain debt).  
6. Focused + agreed regression suites are green; evidence in VALIDATION.md.

**Assessment at close:** **Met** — see [SPRINT-95-CLOSURE.md](SPRINT-95-CLOSURE.md).

---

## Critical regression requirements

- Standalone resource publishing  
- Multi-document Learning Journey publishing (until superseded)  
- Assessment Pack rendering and formative behaviour  
- Draft persistence and restoration  
- Educational content / assessment semantics unchanged  
- Exported package portability  
- Keyboard and screen-reader accessibility  

---

## Risks and dependencies

| Risk | Mitigation |
| ---- | ---------- |
| Document-scoped listeners resist tidy dispose | M1 proves Assessment Pack path before shell work |
| MathLive remount instability | Defer math-heavy products; empirical M1/M4 checks |
| pageKey drift across re-publish orphans drafts | Document identity stability; test remount against fixed keys |
| Scope expands into Interactive V2 | Charter exclusion; refuse absorption |
| Conference timeline pressure | Ship M1 evidence early; M2/M3 demonstrator over perfect consolidation |
| Accidentally change LJ publish in M1 | Explicit M1 non-goal; package tests must stay green without behaviour change |

**Dependencies:** Sprint 94 continuity contract (closed). Assessment Pack first-class (Sprint 93 closed). No new educational generation required for M1–M3 demonstrators.

---

## Out of scope (do not absorb)

PB-FA-019 Interactive V2; Course Home; server accounts; AI marking; new frameworks; visual redesign; regenerating existing journeys; Sprint 94 commissioning reopen.

# Sprint 95 — Implementation map

**Status:** **OPEN** — M1 ready; not started  
**Sprint:** 95 — Unified Learning Journey Runtime  
**Opening:** [S95-D01](decisions.md#s95-d01--open-sprint-95--unified-learning-journey-runtime)  
**Charter:** [SPRINT-95-CHARTER.md](SPRINT-95-CHARTER.md)

Do not reorder milestones. Do not start M2 until M1 acceptance is recorded.

---

## Current posture

```text
Sprint 94                             CLOSED — ACCEPTED — do not reopen
Sprint 95 open (S95-D01)              COMPLETE
M1 Renderer Lifecycle Demonstrator    READY — not started
M2 Unified LJ Shell                   BLOCKED on M1
M3 Explicit Artefact Handoff          BLOCKED on M2 (or M1+manifest spike if authorised)
M4 Consolidation / wider compatibility BLOCKED on M2/M3
Production code                       No Sprint 95 code yet
```

---

## Milestones

| ID | Title | Status |
| -- | ----- | ------ |
| M1 | Renderer Lifecycle Demonstrator (Assessment Pack preferred) | **READY — not started** |
| M2 | Unified Learning Journey Shell | Planned |
| M3 | Explicit Learner Artefact Handoff (C5 → C6) | Planned |
| M4 | Consolidation and Wider Compatibility | Planned |

### Task index (initial)

| ID | Title | Milestone | Status |
| -- | ----- | --------- | ------ |
| S95-T-001 | Open sprint + map + M1 plan | Open | **COMPLETE** |
| S95-T-002 | Assessment Pack container-scoped init/dispose | M1 | **NOT STARTED** |
| S95-T-003 | Fragment vs script separation for mountable AP body | M1 | **NOT STARTED** |
| S95-T-004 | Mount / unmount / remount restore tests | M1 | **NOT STARTED** |
| S95-T-005 | Standalone AP publish regression lock | M1 | **NOT STARTED** |
| S95-T-006 | Journey shell single document + TOC + content region | M2 | Blocked |
| S95-T-007 | Accessible navigation / focus / announcements | M2 | Blocked |
| S95-T-008 | Produce/reference artefact contract + missing-input UI | M3 | Blocked |
| S95-T-009 | C5 → C6 read-only judgement demonstrator | M3 | Blocked |
| S95-T-010 | Extend lifecycle to other product types + asset consolidation | M4 | Blocked |

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

---

## M2 — Unified Learning Journey Shell (proposed)

Single-document shell with persistent TOC, one active content region, accessible prev/next/current navigation, state restoration for the active resource. Multi-document ZIP remains available until explicitly superseded.

## M3 — Explicit Learner Artefact Handoff (proposed)

Minimal produce/reference contract. Demonstrate C5 independent judgement as read-only reference in C6. Missing-input notice when absent. No AI marking. Do not regenerate educational content.

## M4 — Consolidation and Wider Compatibility (proposed)

Extend lifecycle to other resource types; consolidate shared CSS/JS; verify product matrix; theme-token readiness only.

---

## Acceptance criteria (sprint-level)

Sprint 95 is complete when:

1. At least M1–M3 are accepted (M4 may close with recorded remainder if authorised).  
2. Standalone publishing remains fully supported.  
3. Multi-document LJ publishing remains available until an accepted superseding path is documented.  
4. Explicit artefact relationships only — no implicit sharing of all drafts.  
5. Accessibility requirements for shell navigation and mount lifecycle are met and tested.  
6. Focused + agreed regression suites are green; evidence in VALIDATION.md.

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

# Sprint 95 — Charter

**Sprint:** 95 — Unified Learning Journey Runtime  
**Status:** **OPEN** — M1 ready; not started  
**Opened:** 2026-11-03  
**Type:** Architectural foundations → bounded implementation  
**Predecessor:** [Sprint 94 — CLOSED — ACCEPTED](../2026-11-02-sprint-94-learning-journey-continuity/SPRINT-94-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-023](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-023--unified-learning-journey-runtime)  
**Opening:** [S95-D01](decisions.md#s95-d01--open-sprint-95--unified-learning-journey-runtime)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Start here:** [SPRINT-95-START-HERE.md](SPRINT-95-START-HERE.md)

---

## Mission

Establish the foundations for a **unified, accessible, single-document Learning Journey runtime**.

The runtime should support:

- persistent journey navigation;
- shared learner state for **explicitly declared** artefacts;
- one active resource mounted in a journey-owned content region;

while preserving **independent resource rendering and publishing** (including standalone QA).

Educational motivation: make both the designed learning journey and the learner’s developing thinking visible — without automated interpretation of shared artefacts.

---

## Programme context

Sprint 94 closed the **commissioning continuity** contract. Constituents still publish as separate HTML documents. Manual C5 → C6 response retrieval is a known delivery-model limitation, not a generation defect.

Read-only investigations (2026-11-03) established that a single-document runtime is feasible if resource interaction runtimes support **container-scoped initialisation and disposal**, preferring **mount-on-demand** over render-once.

Conference demonstration target remains **1–2 December 2026**. This sprint is the runtime foundations slice.

---

## Architectural principles

1. One accessible HTML document for the Learning Journey.  
2. One active resource mounted within a journey-owned content region.  
3. No iframe-based resource delivery.  
4. Shared runtime services for navigation, persistence, and learner artefacts.  
5. Container-scoped resource initialisation and disposal.  
6. Existing standalone publishing remains fully supported.  
7. Resources may be pedagogically dependent without being technically dependent on the journey runtime.  
8. Explicit artefact relationships; no implicit sharing of all learner responses.  
9. Learner-generated content remains learner-owned.  
10. No automated interpretation or marking of shared learner artefacts.  
11. Common CSS and JavaScript consolidated where practical.  
12. Accessibility is a foundational acceptance requirement.  
13. Architecture should support future learner-controlled presentation preferences (not implemented this sprint).

---

## Established findings (do not re-investigate)

- LJ package = multi-document ZIP (`index.html` + `cN/index.html`); see Sprint 91/94 closure architecture.  
- `renderPage` already emits a `<main>` fragment; standalone wraps it.  
- Assessment / guided-review / ordering / math / draft runtimes largely bind to `document` today; draft persistence is root-capable but lacks dispose.  
- Drafts live in same-origin `localStorage` under `learner-renderer-vnext:draft:{pageKey}`.  
- Sprint 94 continuity is commissioning prose, not runtime artefact transport.  
- Prefer **mount-on-demand** over render-once for ID/listener/a11y reasons.

---

## Scope

1. **M1** — Assessment Pack renderer lifecycle demonstrator (container mount/unmount; standalone unchanged; no LJ publish change).  
2. **M2** — Unified Learning Journey shell (TOC, one content region, accessible navigation).  
3. **M3** — Explicit produce/reference artefact handoff (C5 → C6 demonstrator).  
4. **M4** — Wider product compatibility + CSS/JS consolidation.

---

## Stopping condition

Sprint 95 may close when accepted milestones and regression criteria in [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) are met, evidence is in [VALIDATION.md](VALIDATION.md), debt is in [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md), and a closure record is written. Closure is **not** authorised by this charter alone. M1 alone does **not** close the sprint.

---

## Explicitly outside Sprint 95

- Regenerating *Deciding Under Uncertainty* / *Making Decisions Under Uncertainty*  
- Server-side learner accounts / central databases  
- AI marking of shared artefacts  
- New application framework  
- Wholesale visual redesign / user-controlled themes (readiness only)  
- Interactive V2 / PB-FA-019  
- Course Home / programme assembly  
- Changing generation prompts or educational design contracts unless a demonstrated implementation need requires it  
- Reopening Sprint 94 continuity commissioning work

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

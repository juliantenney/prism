# Sprint 74 — Decision Log

**Sprint status:** **OPEN** (2026-08-06) — planning/discovery; 74A not opened  
**Format:** ID · Decision · Status · Rationale · Consequences  
**Expanded constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)

Inherited binding decisions are **linked, not duplicated** — Sprint 73 [`decisions.md`](../2026-08-06-sprint-73-workflow-resources/decisions.md); Sprint 72 (`S72-D09`, `S72-D10`, `S72-D14`).

---

## S74-D01 Sprint 74 scope — Architecture Consolidation and Rationalisation (discovery-led wrapper)

- **Decision:** Sprint 74 is opened as a **discovery-led wrapper sprint** on Architecture Consolidation and Rationalisation. Its purpose is to map the supported Prism architecture and recommend coherent rationalisation domains for future **74A / 74B / 74C** sprints. Indiscriminate cleanup and runtime changes are out of scope for discovery tasks. Sprint 74A / 74B / 74C are **not opened** by this decision.
- **Status:** Accepted (2026-08-06)
- **Rationale:** After Sprint 73 closure, maturation priority shifts to understanding supported paths, ownership, and duplication before any consolidation. Evidence must precede deletion or merge. Related backlog signals (PB-FA-003, PB-S-004) inform discovery but are not auto-converted into implementation without readiness.
- **Consequences:** Pack scoped to discovery and sequencing; `S74-T-001` is the initial committed task; no runtime edits in T-001; Sprint 73 remains closed predecessor authority for Workflow Resources and Authoring.

---

## S74-D02 Recommended first implementation domain — Authoring → learner export path integrity

- **Decision:** Pending **operator approval to open a pack**, the first implementation domain (**Sprint 74A**) should be **Authoring → learner export path integrity** (docs truth + **production browser-path** / **generated browser artefact** verification + Legacy *inventory*). Sequence thereafter: **74B** generation-contract & capture-validator hygiene → **74C** repository & fixture hygiene. This decision **does not open** Sprint 74A / 74B / 74C.
- **Status:** Accepted as programme recommendation (2026-08-06); pack open remains operator-gated
- **Rationale:** [S74-T-010](S74-T-010-rationalisation-domain-refinement.md) refined S74-T-001 for smallest coherent slices, lowest risk, and easiest verification. Export-path integrity aligns with PB-FA-003 and the supported product spine under [browser-only / static deployment](ARCHITECTURAL-CONSTRAINTS.md) constraints. “Split app.js” is rejected as a domain; ownership-based allocation applies instead. Legacy *deletion*, schema SSOT moves, WR orphan cleanup, and PB-FA-004 remain out of 74A.
- **Consequences:** Next authorised action is open Sprint 74A pack after operator approval; Sprint 74 wrapper stays discovery/planning until then; T-011 optional if a thinner AC seed is required before pack open. 74A verification must treat Node-based tests as evidence about shared logic, not as deployment proof.

---

## S74-D03 Browser-only runtime and static deployment

- **Decision:** Prism’s supported production environment is a **standalone browser application** (HTML, JavaScript, CSS, browser-provided APIs only). There is no backend, no runtime Node.js, no server-side workflow execution, no runtime filesystem, and no runtime package-manager requirement. Node.js is **development/test tooling only**. Every supported production feature must execute through **browser-loaded scripts** referenced by `index.html`. Deployment must remain **static** (direct browser loading; `index.html`-driven bootstrap; browser-compatible globals or an equally static browser-compatible replacement; no runtime compilation requirement for end users). Generated browser artefacts may be produced in development; they do not make Node available at runtime.
- **Status:** Accepted — **binding** (2026-08-06)
- **Rationale:** Dual-looking repository surfaces (`module.exports`, Node suites, npm scripts, bundle builders) historically invite false “two runtime” interpretations. Rationalisation and agent guidance must not invent a backend or treat Node tests as proof of the deployed app.
- **Consequences:** Sprint 74 / 74A–C must not introduce server dependencies, runtime Node APIs, production filesystem assumptions, mandatory end-user build tooling, or non-static deployment. Preferred terminology is recorded in [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md). Avoid “Node runtime,” “Node production path,” “backend path,” and “browser/Node runtime parity.”

---

## S74-D04 One supported path per major product responsibility

- **Decision:** Every major product responsibility should have **one clearly identifiable supported (authoritative) implementation**. Compatibility, historical, and experimental paths may remain temporarily only if labelled clearly; future development targets the authoritative path; rationalisation reduces ambiguity; removal follows evidence and verification. Sprint 74 success is clarity for maintainers, contributors, and coding agents — **not** line-count reduction.
- **Status:** Accepted — **binding** (2026-08-06)
- **Rationale:** Plausible-but-wrong alternate paths are the maturation hazard after Workflow Resources and vNext renderer delivery. Ambiguity in module, documentation, schema, and browser-loading authority increases regression and agent error risk.
- **Consequences:** 74A–C must name the authoritative path for each touched responsibility, label Compatibility surfaces explicitly, and must not treat “delete lines” as a goal. Expanded statement: [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) Constraint 2.

---

## S74-D05 `app.js` rationalised by ownership, not size

- **Decision:** `app.js` is **not** a rationalisation target merely because it is large. Do **not** plan a size-driven “split `app.js`” sprint. Move a responsibility only when another domain is the clearer architectural owner; extract only as part of that domain; preserve application-shell responsibilities in `app.js` (bootstrap, top-level navigation, dependency wiring, lifecycle, high-level workflow orchestration, routing between domain modules, browser-only integration seams, approved test hooks). Extraction criteria: ownership, cohesion, testability, browser loading, risk — **not** line count.
- **Status:** Accepted — **binding** (2026-08-06)
- **Rationale:** Size-driven splits create artificial modules, break browser-loading cohesion, and conflict with the browser-only / one-supported-path constraints. [S74-T-010](S74-T-010-rationalisation-domain-refinement.md) already allocated responsibilities by ownership.
- **Consequences:** Programme docs and future 74A–C packs must not open an “app.js split” workstream. Narrow edits and ownership-based extractions remain allowed inside domain sprints. Expanded statement: [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) Constraint 3.

---

## Pending decisions

| Topic | Expected trigger |
| ----- | ---------------- |
| Open Sprint 74A pack | **Operator approval** (recommended domain recorded in `S74-D02`) |
| Legacy renderer retirement eligibility | Evidence from 74A inventory (not decided) |
| Whether compose/partial merge enters 74B | 74B planning — default docs-only first |
| WR orphan cleanup implementation | PB-R-008 policy — not 74A–C |

Do not record implementation consolidation decisions without discovery evidence and explicit acceptance criteria.

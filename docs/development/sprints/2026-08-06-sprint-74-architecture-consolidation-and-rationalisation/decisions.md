# Sprint 74 — Decision Log

**Sprint status:** **OPEN** (2026-08-06) — programme wrapper; Sprint 74B **OPEN** (implementation)  
**Format:** ID · Decision · Status · Rationale · Consequences  
**Expanded constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  
**Engineering disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
**Active implementation pack:** [Sprint 74B](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/SPRINT-74B-START-HERE.md)  
**Closed predecessor:** [Sprint 74A](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md)  
**Decisions:** `S74-D01`…`S74-D09`
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
- **Status:** Accepted as programme recommendation (2026-08-06); **fulfilled by operator open** (`S74-D06` / Sprint 74A pack) — recommendation text preserved. **Implementation target later clarified** by [`S74-D07`](#s74-d07--one-definitive-codebase-around-established-functionality) / [`S74A-D02`](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) (definitive codebase; obsolete learner-renderer removal). Recommendation text is **not** rewritten.
- **Rationale:** [S74-T-010](S74-T-010-rationalisation-domain-refinement.md) refined S74-T-001 for smallest coherent slices, lowest risk, and easiest verification. Export-path integrity aligns with PB-FA-003 and the supported product spine under [browser-only / static deployment](ARCHITECTURAL-CONSTRAINTS.md) constraints. “Split app.js” is rejected as a domain; ownership-based allocation applies instead. Legacy *deletion*, schema SSOT moves, WR orphan cleanup, and PB-FA-004 remain out of 74A.
- **Consequences:** Next authorised action was open Sprint 74A pack after operator approval; fulfilled by `S74-D06` / [Sprint 74A](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md). Sprint 74 wrapper stays open as programme authority. 74A verification must treat Node-based tests as evidence about shared logic, not as deployment proof.

---

## S74-D03 Browser-only runtime and static deployment

- **Decision:** Prism’s supported production environment is a **standalone browser application** (HTML, JavaScript, CSS, browser-provided APIs only). There is no backend, no runtime Node.js, no server-side workflow execution, no runtime filesystem, and no runtime package-manager requirement. Node.js is **development/test tooling only**. Every supported production feature must execute through **browser-loaded scripts** referenced by `index.html`. Deployment must remain **static** (direct browser loading; `index.html`-driven bootstrap; browser-compatible globals or an equally static browser-compatible replacement; no runtime compilation requirement for end users). Generated browser artefacts may be produced in development; they do not make Node available at runtime.
- **Status:** Accepted — **binding** (2026-08-06)
- **Rationale:** Dual-looking repository surfaces (`module.exports`, Node suites, npm scripts, bundle builders) historically invite false “two runtime” interpretations. Rationalisation and agent guidance must not invent a backend or treat Node tests as proof of the deployed app.
- **Consequences:** Sprint 74 / 74A–C must not introduce server dependencies, runtime Node APIs, production filesystem assumptions, mandatory end-user build tooling, or non-static deployment. Preferred terminology is recorded in [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md). Avoid “Node runtime,” “Node production path,” “backend path,” and “browser/Node runtime parity.”

---

## S74-D04 One supported path per major product responsibility

- **Decision:** Every major product responsibility should have **one clearly identifiable supported (authoritative) implementation**. Compatibility, historical, and experimental paths may remain temporarily only if labelled clearly; future development targets the authoritative path; rationalisation reduces ambiguity; removal follows evidence and verification. Sprint 74 success is clarity for maintainers, contributors, and coding agents — **not** line-count reduction.
- **Status:** Accepted — **binding** (2026-08-06). **Clarified and strengthened** by [`S74-D07`](#s74-d07--one-definitive-codebase-around-established-functionality): definitive codebase / removal of obsolete alternatives; Compatibility only for current explicit product requirements. Decision text above is **not** rewritten.
- **Rationale:** Plausible-but-wrong alternate paths are the maturation hazard after Workflow Resources and vNext renderer delivery. Ambiguity in module, documentation, schema, and browser-loading authority increases regression and agent error risk.
- **Consequences:** 74A–C must name the authoritative path for each touched responsibility, and must not treat “delete lines” as a goal. Expanded statement: [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) Constraint 2 (as clarified by `S74-D07`).

---

## S74-D05 `app.js` rationalised by ownership, not size

- **Decision:** `app.js` is **not** a rationalisation target merely because it is large. Do **not** plan a size-driven “split `app.js`” sprint. Move a responsibility only when another domain is the clearer architectural owner; extract only as part of that domain; preserve application-shell responsibilities in `app.js` (bootstrap, top-level navigation, dependency wiring, lifecycle, high-level workflow orchestration, routing between domain modules, browser-only integration seams, approved test hooks). Extraction criteria: ownership, cohesion, testability, browser loading, risk — **not** line count.
- **Status:** Accepted — **binding** (2026-08-06)
- **Rationale:** Size-driven splits create artificial modules, break browser-loading cohesion, and conflict with the browser-only / one-supported-path constraints. [S74-T-010](S74-T-010-rationalisation-domain-refinement.md) already allocated responsibilities by ownership.
- **Consequences:** Programme docs and future 74A–C packs must not open an “app.js split” workstream. Narrow edits and ownership-based extractions remain allowed inside domain sprints. Expanded statement: [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) Constraint 3.

---

## S74-D06 Operator approval opens Sprint 74A

- **Decision:** Operator approval has **opened** the Sprint 74A implementation pack — Authoring → Learner Export Path Integrity — implementing Domain A from [S74-T-010](S74-T-010-rationalisation-domain-refinement.md) as recommended by `S74-D02`. Sprint 74 remains the open programme wrapper. Sprint 74B and 74C remain **not opened**. Binding constraints `S74-D03`…`S74-D05` continue to govern 74A.
- **Status:** Accepted (2026-08-06)
- **Rationale:** Discovery and domain refinement are complete; the readiness bar for the first implementation slice is met; operator authorised pack open.
- **Consequences:** Implementation continues in [Sprint 74A pack](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md) under `S74A-D01`; do not implement Domain A under the Sprint 74 wrapper; do not treat this as opening 74B/74C or closing Sprint 74. *(74A sole-renderer removal direction: `S74A-D02` under programme principle `S74-D07`.)*

---

## S74-D07 — One definitive codebase around established functionality

- **Decision:** Sprint 74 rationalisation must converge established product responsibilities onto **one definitive implementation** in the active codebase. Obsolete, superseded, and redundant implementation paths should be **removed** once their responsibilities are verified as covered. **Compatibility** code is retained **only** where there is a **current, explicit product requirement** for compatibility. **Historical existence is not a compatibility requirement.** “One supported path” does **not** mean leaving unused alternative implementations available but undocumented. Rationalisation success includes **removal of plausible-but-wrong code paths** that confuse maintainers and coding agents. Removal remains **evidence-led** and must preserve current required functionality. Line-count reduction is not the purpose, but **code removal is expected** where it eliminates obsolete architectural alternatives. This decision **clarifies and strengthens** `S74-D04` / Constraint 2; earlier decision text is not deleted. Expanded statement: [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) Constraint 2. Application to learner rendering: [S74A-D02](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer).
- **Status:** Accepted — **binding** programme principle (2026-08-06)
- **Rationale:** Operator definitive direction: Sprint 74A (and subsequent rationalisation) exists to establish one stable, definitive codebase around existing functionality — not to preserve obsolete parallel options indefinitely under a Compatibility label.
- **Consequences:** Planning and implementation docs must not treat Compatibility retention as the default end state. Evidence gates removal; evidence must not indefinitely protect obsolete parallels. Same-day earlier draft wording that framed only “controlled Legacy retirement in 74A” is superseded by this programme-level principle; 74A execution detail lives in `S74A-D02`.

---

## S74-D08 Operator approval opens Sprint 74B

- **Decision:** Operator approval has **opened** the Sprint 74B implementation pack — Generation-contract & capture-validator hygiene — implementing Domain B from [S74-T-010](S74-T-010-rationalisation-domain-refinement.md). Sprint 74 remains the open programme wrapper. Sprint 74A is **COMPLETE / Closed**. Sprint 74C remains **not opened**. Binding constraints `S74-D03`…`S74-D05`, `S74-D07`, and [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) govern 74B. First implementation task: ownership-first investigation (`S74B-T-010`). Pack init does not begin runtime implementation.
- **Status:** Accepted (2026-08-07)
- **Rationale:** Sprint 74A closed; Domain B readiness and post-74A methodology refinement complete. Opening a bounded pack with ownership-inventory-first sequencing reduces silent prompt and ownership drift risk.
- **Consequences:** Implementation proceeds in [Sprint 74B pack](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/SPRINT-74B-START-HERE.md) under `S74B-D01`; do not implement Domain B under the Sprint 74 wrapper; do not treat this as opening 74C.

---

## S74-D09 — Pre-release compatibility is not a default requirement

- **Decision:** Prism is currently **pre-user / pre-release**. There is **no external user population** whose historical persisted data must be preserved across internal development versions. The next real usage phase is **alpha testing**.

  Therefore:

  - Historical persisted state, deprecated runtime shapes, rollback modes, and superseded implementation paths have **no automatic compatibility requirement**.  
  - **Compatibility** must be retained **only** where there is an **explicit current product requirement**.  
  - **Historical existence alone is not a requirement.**  
  - Repository history preserves retired implementations.  
  - Tests should protect **current intended behaviour**, not obsolete internal development states.  
  - Old local workflows/runstate may **legitimately require regeneration/re-run** after architectural convergence.  
  - Migration code, fallback branches, shims, and version flags should be **removed** when they exist only to preserve superseded pre-release data or behaviour.

  This principle **does not** authorise indiscriminate deletion:

  - current intended functionality must be preserved;  
  - current supported contracts/data shapes must remain valid;  
  - destructive changes still require ownership and residue evidence;  
  - user-facing behaviour must be verified.

  Once Prism has **external users** or **release compatibility commitments**, compatibility policy must be **revisited explicitly** rather than inferred from this decision.

  **Governing formulation:**

  > Preserve current intended functionality, not historical pre-release data shapes or superseded implementation behaviour.

  > Compatibility is opt-in by explicit product requirement, not opt-out by historical existence.

  Expands Constraint 2 / `S74-D07` for the pre-release phase. Working practice: [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md). Sprint 74B application: [S74B-D03](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/decisions.md#s74b-d03--historical-pre-release-workflowrunstate-compatibility-does-not-block-rationalisation).

- **Status:** **Accepted** — **binding** (2026-08-07)
- **Rationale:** Operator direction for Sprint 74 rationalisation while Prism remains pre-release: do not treat local historical development state as a Compatibility product requirement.
- **Consequences:** Active Sprint 74 / 74B guidance must not imply old local data must be preserved by default. T-040 may fail-close obsolete shapes without adding migrations solely for pre-release state. Historical discovery docs are not rewritten; dated policy notes apply where earlier Compatibility posture appeared.

---

## Pending decisions

| Topic | Expected trigger |
| ----- | ---------------- |
| Open Sprint 74C pack | After 74B closure / programme order |
| WR orphan cleanup implementation | PB-R-008 policy — not 74B |
| Post-alpha / release Compatibility policy | When external users or release commitments exist — revisit `S74-D09` |

Obsolete learner-renderer removal in 74A — **complete** (`S74-D07` / `S74A-D02`).  
Compose / partial page-construction — **S74B-D02**. Pre-release Compatibility — **S74-D09** / **S74B-D03**.

Do not record implementation consolidation decisions without discovery evidence and explicit acceptance criteria.

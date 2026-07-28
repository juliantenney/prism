# Sprint 69 Implementation Roadmap

**Related:** [WHY-SPRINT-69.md](WHY-SPRINT-69.md) · [HANDOVER.md](HANDOVER.md) · [GOALS.md](GOALS.md) · [CONTEXT.md](CONTEXT.md)

---

Sprint 69 moves exact validation from sequence enumeration to shared archetype grammar. Phases below are the implementation plan; completion is measured against [Definition of Done](HANDOVER.md#sprint-69-definition-of-done).

## Phase 1 — Shared vocabulary

- **Objective:** establish single canonical beat vocabulary authority.
- **Dependencies:** Episode Plan FunctionEnum, ownership docs, current validation hooks.
- **Risks:** accidental divergence between producer and renderer maps.
- **Expected outputs:** vocabulary contract module + compatibility matrix.
- **Completion criteria:** both producer and renderer consume the same canonical vocabulary source.

## Phase 2 — Shared grammar

- **Objective:** define archetype grammar (required/optional/order/terminal constraints).
- **Dependencies:** phase 1 vocabulary; existing archetype semantics.
- **Risks:** overfitting to fixtures; under-specified constraints.
- **Expected outputs:** grammar schema + validator + examples.
- **Completion criteria:** grammar validates existing certified corpus archetypes exactly.

## Phase 3 — Dual validation

- **Objective:** run sequence-registry and grammar checks together behind diagnostics.
- **Dependencies:** phase 2 validator.
- **Risks:** false mismatches; noisy diagnostics.
- **Expected outputs:** dual-path diagnostics and parity report.
- **Completion criteria:** no unresolved disagreement on authoritative fixtures.

## Phase 4 — Renderer migration

- **Objective:** switch renderer gating from registry-equality to grammar-validated binding.
- **Dependencies:** dual validation confidence.
- **Risks:** assignment regressions.
- **Expected outputs:** migrated binding path + invariant tests.
- **Completion criteria:** zero regressions on unassigned/duplicate diagnostics.

## Phase 5 — Registry retirement

- **Objective:** demote whole-sequence registry as runtime validation authority.
- **Dependencies:** phase 4 complete.
- **Risks:** loss of traceability for legacy variants.
- **Expected outputs:** deprecation notes, compatibility layer (if needed), cleanup.
- **Completion criteria:** docs/tests treat grammar as authority.

## Phase 6 — Certification

- **Objective:** prove production readiness under new abstraction.
- **Dependencies:** all prior phases.
- **Risks:** corpus edge cases.
- **Expected outputs:** updated certification artefacts and closeout evidence.
- **Completion criteria:** all [Definition of Done](HANDOVER.md#sprint-69-definition-of-done) outcomes satisfied.

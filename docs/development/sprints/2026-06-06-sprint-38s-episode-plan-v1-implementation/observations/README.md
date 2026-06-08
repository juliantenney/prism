# Observations — Sprint 38-S

**Sprint:** Episode Plan V1 Implementation  
**Type:** Implementation + proof  
**Status:** **OPEN** — first-class workflow step integrated (see 38S-first-class-episode-plan-step)  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) · [38S-6 closure](38S-6-sprint-closure.md)

**Predecessor:** [38R-6 closure](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md)

---

## Programme framing

```text
38Q discovered the missing planning abstraction.
38R proved the smallest viable form of that abstraction.
38S implements that abstraction and executes the proof framework.
```

---

## Phase index

| Phase | Title | Deliverable | Status |
|-------|-------|-------------|--------|
| **38S-1** | Episode Plan V1 integration | [38S-1-episode-plan-v1-integration.md](38S-1-episode-plan-v1-integration.md) | **COMPLETE** |
| **38S-2** | Population contract | [38S-2-population-contract-implementation.md](38S-2-population-contract-implementation.md) | **COMPLETE** |
| **38S-3** | DLA obligation tagging | [38S-3-dla-obligation-tagging.md](38S-3-dla-obligation-tagging.md) | **COMPLETE** |
| **38S-4** | Proof execution | [38S-4-proof-execution.md](38S-4-proof-execution.md) | **COMPLETE (B)** |
| **38S-5** | Evaluation and recommendation | [38S-5-evaluation-and-recommendation.md](38S-5-evaluation-and-recommendation.md) | **COMPLETE** |
| **38S-R** | Remediation status audit | [38S-remediation-status-audit.md](38S-remediation-status-audit.md) | **COMPLETE** |
| **38S-R2** | Remediation + re-proof | [38S-remediation-reproof.md](38S-remediation-reproof.md) | **COMPLETE (B)** |
| **38S-GAM** | GAM format remediation | [38S-gam-realisation-format-remediation.md](38S-gam-realisation-format-remediation.md) | **COMPLETE** |
| **38S-RF1** | Role supersession remediation | [38S-role-supersession-remediation.md](38S-role-supersession-remediation.md) | **COMPLETE (SC-7)** |
| **38S-6** | Closure | [38S-6-sprint-closure.md](38S-6-sprint-closure.md) | **Superseded** (harness-only) |
| **38S-WF** | First-class workflow step + V1 enforcement | [38S-first-class-episode-plan-step.md](38S-first-class-episode-plan-step.md) | **COMPLETE** |
| **Phase 2** | Prompt sanitisation + manual workflow | [../phase-2/README.md](../phase-2/README.md) | **IN PROGRESS** |

---

## Phase 2 (prompt sanitisation)

All Phase 2 documents live in **[../phase-2/](../phase-2/)**. Start with [38S-handover-pack.md](../phase-2/38S-handover-pack.md) for a new chat.

| Phase | Doc |
|-------|-----|
| Handover | [phase-2/38S-handover-pack.md](../phase-2/38S-handover-pack.md) |
| 2A DLA | [phase-2/38S-prompt-sanitisation-phase-2a-dla-only.md](../phase-2/38S-prompt-sanitisation-phase-2a-dla-only.md) |
| 2B GAM | [phase-2/38S-prompt-sanitisation-phase-2b-gam-audit.md](../phase-2/38S-prompt-sanitisation-phase-2b-gam-audit.md) |
| 2B-b PEL | [phase-2/38S-prompt-sanitisation-phase-2b-b-pel-audit.md](../phase-2/38S-prompt-sanitisation-phase-2b-b-pel-audit.md) |

Stub redirects remain under `observations/` for old links.

## Reading order

**Predecessor (required):** [38R-6 closure](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md)

1. [38S-1](38S-1-episode-plan-v1-integration.md) — integration (**COMPLETE**)
2. [38S-2](38S-2-population-contract-implementation.md) — population contract (**COMPLETE**)
3. [38S-3](38S-3-dla-obligation-tagging.md) — obligation tagging (**COMPLETE**)
4. [38S-4](38S-4-proof-execution.md) — proof execution (**COMPLETE — Partial success**)
5. [38S-5](38S-5-evaluation-and-recommendation.md) — evaluation (**COMPLETE**)
6. [Remediation audit](38S-remediation-status-audit.md) — status audit (**COMPLETE**)
7. 38S-6 closure ← **START** (after R1–R4 + re-proof)

---

## Design authority (read-only — do not relitigate)

| Doc | Role |
|-----|------|
| [38R-1](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-1-minimum-viable-episode-plan.md) | V1 schema |
| [38R-2](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md) | A1–A4 reference plans |
| [38R-3](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) | P1–P10 · AC-01–AC-10 |
| [38R-4](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) | Proof gate |
| [38R-5](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-5-implementation-recommendation.md) | IC-1–IC-12 |

---

## Proof baselines

| Baseline | Role |
|----------|------|
| `EV-38M-AFTER` | Before — parallel bundles |
| `EV-38P-AFTER` | Fidelity floor — `fullOk: true` |
| `EV-38S-AFTER-4` | **Authoritative** — plan-driven proof run — `fullOk: true` |

---

## Sprint constraint

**V1 frozen.** Implement and prove — do not redesign the abstraction.

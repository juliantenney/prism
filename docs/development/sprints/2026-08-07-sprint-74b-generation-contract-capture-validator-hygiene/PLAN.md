# Sprint 74B — Plan

**Status:** **OPEN** (2026-08-07)  
**Theme:** Generation-contract & capture-validator hygiene  
**Charter:** [SPRINT-74B-CHARTER.md](SPRINT-74B-CHARTER.md)  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality) · [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement)  
**Constraints:** [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)  
**Engineering disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(inherited)*

Task IDs: `S74B-T-###`. Decision IDs: `S74B-D##` in [decisions.md](decisions.md).

Acceptance criteria AC-01…AC-13: [SPRINT-74B-CHARTER.md](SPRINT-74B-CHARTER.md).

---

## Execution order

```text
S74B-T-001 (pack init) ✅
  → S74B-T-010 (generation pipeline architectural discovery) ✅
    → S74B-T-020 (compose vs partial contract role documentation) ✅
      → S74B-T-030 (deprecated helper / compose / legacy-validator removal plan) ✅
        → S74B-T-040 (execute evidenced removals and consolidations) ✅
          → S74B-T-050 (verification and sprint closure) ← next
```

T-010…T-030 are complete. **S74B-D02** / **S74B-D03 Accepted.** Programme **S74-D09 Accepted.** T-030 plan reconciled for pre-release Compatibility policy. Removals begin only under **T-040** when authorised.

---

## Tasks

### S74B-T-001 — Sprint pack initialisation

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-07) |
| **Ownership** | Sprint documentation |
| **Approach** | Create 74B pack; link parent constraints, Domain B, Engineering Disciplines; record `S74B-D01`; parent `S74-D08` |
| **Acceptance** | Pack files present; relative links valid; 74C not opened |
| **Verification** | Link/consistency check |
| **Runtime** | **Unchanged** |

---

### S74B-T-010 — Generation pipeline architectural discovery (ownership inventory)

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-07) — [S74B-T-010-generation-pipeline-architectural-discovery.md](S74B-T-010-generation-pipeline-architectural-discovery.md) |
| **Ownership** | Generation / contract / capture-validation codebase (discovery) |
| **Approach** | Expanded beyond wrappers-only inventory: discover stable architectural phases from workflow brief through page hand-off to the learner renderer; map ownership, I/O, persistence, validation, contracts; evaluate operator three-area hypothesis; answer what “generation” means; locate duplicate ownership and deprecated/live legacy surfaces. **No deletion or consolidation.** |
| **Acceptance** | AC-01, AC-02; enables AC-03…AC-12; architectural baseline for remaining 74B tasks |
| **Verification** | [S74B-T-010-generation-pipeline-architectural-discovery.md](S74B-T-010-generation-pipeline-architectural-discovery.md) |
| **Dependencies** | T-001 Done; Sprint 74A closed |
| **Runtime** | **Unchanged** |

---

### S74B-T-020 — Compose vs partial contract role documentation

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-07) — [S74B-T-020-compose-vs-partial-contract-role-documentation.md](S74B-T-020-compose-vs-partial-contract-role-documentation.md) |
| **Ownership** | Design Page / contract documentation |
| **Approach** | Evidence-led role documentation for compose vs partial using T-010 phases. Prove or reject operator hypothesis that partial + assemble is definitive and compose is obsolete residue. Docs-only — no forced code merge; no runtime changes. |
| **Acceptance** | AC-07; contributes to AC-01…AC-03 |
| **Verification** | [S74B-T-020-compose-vs-partial-contract-role-documentation.md](S74B-T-020-compose-vs-partial-contract-role-documentation.md) |
| **Dependencies** | T-010 Done |
| **Runtime** | **Unchanged** |

---

### S74B-T-030 — Deprecated helper, compose-path and legacy-validator removal plan

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-07) — [S74B-T-030-deprecated-helper-compose-legacy-validator-removal-plan.md](S74B-T-030-deprecated-helper-compose-legacy-validator-removal-plan.md) |
| **Ownership** | Definitive-codebase removal design (generation domain) |
| **Approach** | Under **S74B-D02** / **S74B-D03** / **S74-D09**, produce exact removal/consolidation slices for obsolete compose, PR-W\* thin aliases, four legacy always-pass capture shims, and dead `partialPageOutputs: false` branches. Ownership proof from T-010/T-020. Plan reconciled so every T-040 intermediate commit can stay green. **No runtime execution.** |
| **Acceptance** | AC-03; enables T-040 |
| **Verification** | [S74B-T-030 plan](S74B-T-030-deprecated-helper-compose-legacy-validator-removal-plan.md); S74B-D02 / S74B-D03 Accepted |
| **Dependencies** | T-010 Done; T-020 Done; **S74B-D02 Accepted**; reconciled under **S74-D09** / **S74B-D03** |
| **Runtime** | **Unchanged** |

---

### S74B-T-040 — Execute evidenced removals and consolidations

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-07) — [S74B-T-040-execute-evidenced-removals-evidence.md](S74B-T-040-execute-evidenced-removals-evidence.md) |
| **Ownership** | Generation-contract hygiene implementation |
| **Approach** | Executed reconciled T-030 slices S1–S7. Compose removed; PR-W aliases removed; legacy shims fail-closed. |
| **Acceptance** | AC-03, AC-04, AC-05, AC-08, AC-12 |
| **Verification** | Focused suites; [evidence report](S74B-T-040-execute-evidenced-removals-evidence.md) |
| **Dependencies** | T-030 Done; **S74B-D03** / **S74-D09** Accepted |

---

### S74B-T-050 — Generation-contract hygiene verification and sprint closure

| Field | Content |
| ----- | ------- |
| **Status** | **Not started** |
| **Ownership** | Sprint closure |
| **Approach** | Confirm ownership documented; no unreachable duplicate ownership; supported builders stable; Authoring export unchanged; focused suites green; residue sweep complete; AC-01…AC-13 evidenced. Prepare closure only when complete. |
| **Acceptance** | All charter ACs; 74C not opened |
| **Verification** | Evidence pack + STATUS complete |
| **Dependencies** | T-010…T-040 Done |

---

## Explicit non-scope (plan)

See charter. First slice is **inventory only**. Do not treat line-count reduction as success. Do not open Sprint 74C.

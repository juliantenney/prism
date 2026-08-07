# Sprint 74B — Plan

**Status:** **OPEN** (2026-08-07)  
**Theme:** Generation-contract & capture-validator hygiene  
**Charter:** [SPRINT-74B-CHARTER.md](SPRINT-74B-CHARTER.md)  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Constraints:** [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)  
**Engineering disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(inherited)*

Task IDs: `S74B-T-###`. Decision IDs: `S74B-D##` in [decisions.md](decisions.md).

Acceptance criteria AC-01…AC-13: [SPRINT-74B-CHARTER.md](SPRINT-74B-CHARTER.md).

---

## Execution order

```text
S74B-T-001 (pack init) ✅
  → S74B-T-010 (generation pipeline architectural discovery + ownership inventory) ✅
    → S74B-T-020 (compose vs partial contract role documentation) ← next
      → S74B-T-030 (removal / consolidation plan from inventory)
        → S74B-T-040 (execute evidenced removals and consolidations)
          → S74B-T-050 (verification and sprint closure)
```

T-010 is complete as **evidence-only** discovery. **No implementation / removals started.** Next is T-020 (docs-only).

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
| **Status** | **Not started** |
| **Ownership** | Design Page / contract documentation |
| **Approach** | Document compose vs partial contract **roles** and boundaries from T-010 findings. Docs-first — no forced code merge. |
| **Acceptance** | AC-07 |
| **Verification** | Doc review against inventory |
| **Dependencies** | T-010 Done |

---

### S74B-T-030 — Deprecated helper and legacy-validator removal plan

| Field | Content |
| ----- | ------- |
| **Status** | **Not started** |
| **Ownership** | Definitive-codebase removal design (generation domain) |
| **Approach** | From T-010 inventory: for each surface classify **remove** · **retain as shared** · **consolidate to definitive owner** · **rename** · **investigate** · **defer**. Produce exact removal/consolidation slices with verification and rollback checkpoints. Removal follows ownership proof. |
| **Acceptance** | AC-03; enables T-040 |
| **Verification** | Plan artefact; stop conditions respected |
| **Dependencies** | T-010 Done; T-020 Done (or explicitly waived with reason) |

---

### S74B-T-040 — Execute evidenced removals and consolidations

| Field | Content |
| ----- | ------- |
| **Status** | **Not started** |
| **Ownership** | Generation-contract hygiene implementation |
| **Approach** | Execute T-030 plan in small reversible commits. Focused contract/generation tests after each slice. Residue sweep per Engineering Disciplines. Spot-check Authoring export unchanged. |
| **Acceptance** | AC-03, AC-04, AC-05, AC-08, AC-12 |
| **Verification** | Focused suites; diff vs plan |
| **Dependencies** | T-030 Done |

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

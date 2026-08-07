# Sprint 74C — Plan

**Status:** **OPEN** (2026-08-07) — T-040 Done; T-050 next  
**Theme:** Repository Hygiene & Historical Residue Rationalisation  
**Charter:** [SPRINT-74C-CHARTER.md](SPRINT-74C-CHARTER.md)  
**Scope authority:** [S74-programme-post-74B-review.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-programme-post-74B-review.md) — narrowed **R1**  
**Programme:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality) · [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement)  
**Constraints:** [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)  
**Engineering disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(inherited)*

Task IDs: `S74C-T-###`. Decision IDs: `S74C-D##` in [decisions.md](decisions.md).

Acceptance criteria AC-01…AC-13: [SPRINT-74C-CHARTER.md](SPRINT-74C-CHARTER.md).

---

## Execution order

```text
S74C-T-001 … S74C-T-040 ✅
  → S74C-T-050 (verify + close 74C / programme if authorised) ← next
```

**T-040 executed:** A → D → G → B → C → E1 → E2. Group F excluded. Evidence: [S74C-T-040-repository-hygiene-execution-evidence.md](S74C-T-040-repository-hygiene-execution-evidence.md).

---

## Tasks

### S74C-T-001 — Sprint pack initialisation

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-07) |
| **Ownership** | Sprint documentation |
| **Approach** | Create 74C pack; link post-74B R1 boundary, constraints, Engineering Disciplines; record `S74C-D01`; update parent wrapper |
| **Acceptance** | Pack files present; relative links valid; 75 not opened; no runtime/test/fixture/deletion changes |
| **Verification** | Link/consistency check |
| **Runtime** | **Unchanged** |

---

### S74C-T-010 — Repository hygiene inventory

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-07) |
| **Ownership** | Repository residue discovery |
| **Approach** | Evidence-only inventory. Classify: current/active · historical evidence · archive · probe/tooling · scratch · obsolete · unknown. Inspect at minimum: root `test*.txt`, `tmp-*`, dumped HTML/JSON, logs, `_archive/`, `scripts/probe-*`, `tools/*` calling removed compose/Legacy APIs, old generated outputs, obsolete test-only helpers, certification artefacts, sprint evidence packs, docs scratch/context files, untracked/frequently regenerated paths. Per item: path, type, references, consumer, historical value, Git-history preservation, classification, recommended action, confidence. **Do not delete.** |
| **Acceptance** | AC-01; enables AC-02…AC-10 |
| **Verification** | [S74C-T-010-repository-hygiene-inventory.md](S74C-T-010-repository-hygiene-inventory.md) |
| **Dependencies** | T-001 Done |
| **Runtime** | **Unchanged** |

---

### S74C-T-020 — Retention and deletion decisions

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-07) |
| **Ownership** | Hygiene decision design |
| **Approach** | For every inventory class: retain · archive · delete · rename · defer. Establish concise `_archive/` / historical residue policy (Git history vs active archive copy vs must-remain consumers). **Do not implement.** |
| **Acceptance** | AC-02, AC-06, AC-07 |
| **Verification** | [S74C-T-020-retention-and-deletion-decisions.md](S74C-T-020-retention-and-deletion-decisions.md) · [S74C-D02](decisions.md#s74c-d02--git-history-is-the-default-archive-active-copies-need-current-operational-justification) |
| **Dependencies** | T-010 Done |
| **Runtime** | **Unchanged** |

---

### S74C-T-030 — Hygiene execution plan

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-07) |
| **Ownership** | Deletion/move/rename slice design |
| **Approach** | Small reversible slices per T-020: **A → D → G → B → C → E1 → E2**. Group F = parking lot (no deletion). Protect list explicit. **Do not execute.** |
| **Acceptance** | AC-03; enables T-040 |
| **Verification** | [S74C-T-030-repository-hygiene-execution-plan.md](S74C-T-030-repository-hygiene-execution-plan.md) |
| **Dependencies** | T-020 Done |
| **Runtime** | **Unchanged** |

---

### S74C-T-040 — Execute approved hygiene

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-07) |
| **Ownership** | Repository hygiene implementation |
| **Approach** | Delete per T-030 slices only. Expand `.gitignore` (Slice G). No product behaviour changes. Stop and report if a hygiene action unexpectedly depends on product behaviour reasoning. |
| **Acceptance** | AC-04, AC-05, AC-08, AC-09, AC-10 |
| **Verification** | [S74C-T-040-repository-hygiene-execution-evidence.md](S74C-T-040-repository-hygiene-execution-evidence.md) |
| **Dependencies** | T-030 Done; slices authorised |
| **Runtime** | **Unchanged** (hygiene only) |

---

### S74C-T-050 — Verify repository hygiene and sprint / programme closure

| Field | Content |
| ----- | ------- |
| **Status** | **Not started** ← next |
| **Ownership** | Sprint / programme closure |
| **Approach** | Confirm ACs; no product regressions claimed without evidence; close 74C; close Sprint 74 programme **only if authorised**. Do not open Sprint 75. |
| **Acceptance** | AC-01…AC-13; 75 not opened |
| **Verification** | Closure evidence |
| **Dependencies** | T-010…T-040 Done |

---

## Explicit non-scope (plan)

See charter. T-040 hygiene execution is **Done**. Next is **T-050 verify/close**. Do not open Sprint 75. Do not pull PB-S-001. Do not expand into Group F without a new decision.

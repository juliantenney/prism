# Sprint 77 — Plan

**Status:** **COMPLETE / CLOSED** (opened 2026-08-14; closed 2026-08-14)  
**Opening decision:** [S77-D01](decisions.md#s77-d01--open-sprint-77--dla-prompt-contract-architecture-pilot)  
**Dashboard:** [STATUS.md](STATUS.md) · **Context:** [CONTEXT.md](CONTEXT.md)

Task IDs: `S77-T-###`. Decision IDs: `S77-D##` in [decisions.md](decisions.md).

Later design and restructuring are **evidence-led**. T-010 inventory and T-011 design are complete. Do not invent a second hierarchy.

---

## Programme phases

```text
S77-T-001 (pack init) ✅ Done
  → S77-D01 (open Sprint 77) ✅ Accepted
  → S77-T-010 (DLA model-visible prompt inventory) ✅ Diagnostic complete
  → S77-T-011 (DLA prompt architecture solution design) ✅ Design complete
  → S77-T-012 (implementation plan) ✅ Plan complete
  → S77-T-013 (Phase A canonical assembler) ✅ Complete
  → S77-T-014 (Phase B equivalence) ✅ ACCEPTED
  → S77-T-015 (Phase C atomic switch) ✅ LIVE
  → S77-T-016 (evidence_requirement capture repair) ✅ COMPLETE
  → S77-T-017 (Lagrangian Gate D) ✅ PASS
  → S77-T-018 (pilot gated / GAM E handover) ✅ COMPLETE
  → S77-T-019 DIAGNOSTIC RECORDED
  → S77-T-022 E1 solution design COMPLETE
  → S77-T-023 E1 implementation COMPLETE (A/B/C PASS — E1 CLOSED)
  → S77-T-024 bound Gate C COMPLETE (E1 CLOSED · Case 1 CLOSED)
  → S77-T-025 GAM D diagnostic COMPLETE (no live independent defect)
  → S77-T-026 E2 diagnostic COMPLETE (OPEN / intermittent; recurrence protocol)
  → S77-T-027 close-out COMPLETE
  → S77-D04 (close Sprint 77) ✅ Accepted
  → TRANSFERRED / NOT ABSORBED: E2 wait-state · Graphics · T-032 · PB-FA-010 · Phase D
```

---

## Phase 1 — Pack and inventory

### S77-T-001 — Sprint pack initialisation

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-14) |
| **Ownership** | Sprint documentation |
| **Mode** | Documentation only |
| **Approach** | Create Sprint 77 pack; top-level overview; open `S77-D01`; define T-010 without executing it; record Sprint 76 CLOSED; set Sprint 77 as active |
| **Acceptance** | Pack files present; relative links valid; no production/test changes; T-010 defined not started; Sprint 77 OPEN |
| **Verification** | [S77-T-001-sprint-pack-initialisation.md](S77-T-001-sprint-pack-initialisation.md) |

---

### S77-T-010 — DLA model-visible prompt inventory and architecture diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-14) — [S77-T-010-dla-model-visible-prompt-inventory-and-architecture-diagnostic.md](S77-T-010-dla-model-visible-prompt-inventory-and-architecture-diagnostic.md) |
| **Ownership** | DLA prompt architecture |
| **Mode** | **DIAGNOSTIC ONLY** — no prompt rewrite, no P05, no production behaviour change, no architecture design |
| **Purpose** | Reconstruct the complete **live DLA** prompt assembly. Map instruction ownership, duplication, order, and unique vs assembled cost. Identify dead/non-live surfaces. Establish the behavioural baseline before any architecture is designed. |
| **Must answer** | What prompt blocks exist? Where authored? Where injected? How many times? Assembled order? Which semantic invariant is owned by which block? Which instructions are duplicated or overlapping? Which examples introduce semantics? Which instructions describe validator-enforced structure? Which blocks are DLA-stage-specific vs shared? Unique vs assembled character/token costs? Which production surfaces are dead/non-live? Which areas are hardest to trace from behavioural defect back to canonical instruction? |
| **Out of T-010** | Designing a section hierarchy; implementing P05; restructuring prompts; GAM D/E; Graphics; reopening Sprint 76 semantic repairs; EP/GAM/Design Page/QA prompt redesign |
| **Acceptance** | Written inventory/diagnostic artefact; live vs dead surfaces distinguished; unique and assembled costs reported separately; protected baseline listed as preserved (not re-tested unless operator later authorises); no production edits |
| **Verification** | [S77-T-010-dla-model-visible-prompt-inventory-and-architecture-diagnostic.md](S77-T-010-dla-model-visible-prompt-inventory-and-architecture-diagnostic.md) |

Do **not** re-execute T-010 unless the live assembly changes.

---

### S77-T-011 — DLA model-visible prompt architecture solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Design complete** (2026-08-14) — [S77-T-011-dla-prompt-contract-architecture-solution-design.md](S77-T-011-dla-prompt-contract-architecture-solution-design.md) |
| **Ownership** | DLA prompt architecture |
| **Mode** | SOLUTION DESIGN ONLY — not implementation |
| **Purpose** | Target one coherent model-visible DLA contract: sections, order, ownership, P05-as-single-inject, pack-as-overlay, Copy/Studio share |
| **Acceptance** | Protected invariants mapped with BEHAVIOUR CHANGE = NO; U-1/U-2/U-3 recorded unresolved; no production edits |
| **Verification** | [S77-T-011-dla-prompt-contract-architecture-solution-design.md](S77-T-011-dla-prompt-contract-architecture-solution-design.md) |

---

### S77-T-012 — DLA prompt architecture implementation plan

| Field | Content |
| ----- | ------- |
| **Status** | **Plan complete** (2026-08-14) — [S77-T-012-dla-prompt-contract-architecture-implementation-plan.md](S77-T-012-dla-prompt-contract-architecture-implementation-plan.md) |
| **Ownership** | DLA prompt architecture |
| **Mode** | IMPLEMENTATION PLAN ONLY — not implementation |
| **Purpose** | Option 3 sequence: assembler behind flag → atomic Copy/Studio switch (P05 as consequence) → retire old authorities |
| **Acceptance** | Component/invariant/test ledgers complete; U-1/U-2/U-3 classified; no production edits |
| **Verification** | [S77-T-012-dla-prompt-contract-architecture-implementation-plan.md](S77-T-012-dla-prompt-contract-architecture-implementation-plan.md) |

---

### S77-T-013 — Phase A canonical DLA assembler

| Field | Content |
| ----- | ------- |
| **Status** | **COMPLETE** (2026-08-14) — [S77-T-013-dla-canonical-assembler-phase-a-implementation.md](S77-T-013-dla-canonical-assembler-phase-a-implementation.md) |
| **Mode** | Phase A only — assembler + tests; **production still legacy** |
| **Live contract** | `76-DLA-PARTIAL-9` unchanged |
| **Verification** | `tests/ld-dla-canonical-assembler.test.js` 18 pass; listed legacy suites 196 pass |

---

### S77-T-015 — Phase C atomic production switch

| Field | Content |
| ----- | ------- |
| **Status** | **COMPLETE / LIVE** (2026-08-14) — [S77-T-015-dla-canonical-architecture-phase-c-atomic-switch.md](S77-T-015-dla-canonical-architecture-phase-c-atomic-switch.md) |
| **Live contract** | `77-DLA-CANONICAL-1` then **`77-DLA-CANONICAL-2`** (T-016) |
| **Gates** | A/B/C **PASS** · D **PASS** (T-017) |
| **P05** | Multiplicity 1 as architecture consequence |

---

### S77-T-016 — Gate D evidence_requirement capture regression

| Field | Content |
| ----- | ------- |
| **Status** | **COMPLETE** (2026-08-14) — [S77-T-016-gate-d-evidence-requirement-capture-regression.md](S77-T-016-gate-d-evidence-requirement-capture-regression.md) |
| **Live contract** | `77-DLA-CANONICAL-2` |
| **Gate D** | Interrupted at capture; **PASS** after corrected DLA — see [T-017](S77-T-017-dla-canonical-architecture-lagrangian-gate-d.md) |

---

### S77-T-017 — Lagrangian Gate D operator assessment

| Field | Content |
| ----- | ------- |
| **Status** | **COMPLETE / PASS** (2026-08-14) — [S77-T-017-dla-canonical-architecture-lagrangian-gate-d.md](S77-T-017-dla-canonical-architecture-lagrangian-gate-d.md) |
| **Mode** | Documentation only |
| **Gate D** | **PASS** — behavioural preservation confirmed; GAM E separate |

---

### S77-T-018 — DLA architecture pilot gated; GAM E handover

| Field | Content |
| ----- | ------- |
| **Status** | **COMPLETE** (2026-08-14) — [S77-T-018](S77-T-018-dla-architecture-pilot-gated-and-gam-e-handover.md) |
| **Mode** | Documentation / transition |
| **Decision** | [S77-D02](decisions.md#s77-d02-dla-architecture-pilot-gated--return-to-functional-queue-gam-e-next) |

---

### S77-T-019 — GAM E learner-facing corruption diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **DIAGNOSTIC RECORDED** — [S77-T-019](S77-T-019-gam-e-learner-facing-corruption-diagnostic.md) |
| **Mode** | Diagnostic only — no implementation |
| **Classification** | E1 confirmed / no drift this run · E2 intermittent · A4 S3 Case-1 exhibit |

### S77-T-020 — GAM Case 1 operational suitability solution design

| Field | Content |
| ----- | ------- |
| **Status** | **SOLUTION DESIGN COMPLETE** — [S77-T-020](S77-T-020-gam-case-1-operational-suitability-solution-design.md) |
| **Mode** | Design only — no code |
| **Recommended repair** | Option 1 — extend GAM Copy-brief T-031 sentence (executability gloss) |

### S77-T-021 — GAM Case 1 Copy-brief implementation

| Field | Content |
| ----- | ------- |
| **Status** | **Gate A/B/C PASS** — Case 1 **CLOSED** — [S77-T-021](S77-T-021-gam-case-1-operational-suitability-implementation.md) · [T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md) |

### S77-T-022 — GAM E1 authoritative DLA commission binding solution design

| Field | Content |
| ----- | ------- |
| **Status** | **SOLUTION DESIGN COMPLETE** — [S77-T-022](S77-T-022-gam-e1-authoritative-dla-commission-binding-solution-design.md) |
| **Mode** | Design only — no code |
| **Recommended repair** | Option 1 — bounded commission projection in existing partial embed seam |

### S77-T-023 — GAM E1 commission projection implementation

| Field | Content |
| ----- | ------- |
| **Status** | **COMPLETE** — Gate A/B/C **PASS** — **E1 CLOSED** — [S77-T-023](S77-T-023-gam-e1-authoritative-dla-commission-binding-implementation.md) |
| **Mode** | Implementation + bound Gate C recorded in T-024 |

### S77-T-024 — Bound Gate C (E1 + Case 1)

| Field | Content |
| ----- | ------- |
| **Status** | **COMPLETE** — [S77-T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md) |
| **Mode** | Operator inspection record only — no production/tests |
| **Verdict** | E1 **CLOSED** · Case 1 **CLOSED** |

### S77-T-025 — GAM D pedagogical-function fulfilment diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **DIAGNOSTIC COMPLETE** — no live independent defect proven — [S77-T-025](S77-T-025-gam-d-pedagogical-function-fulfilment-diagnostic.md) |
| **Ownership** | GAM D |
| **Mode** | **DIAGNOSTIC ONLY** when authorised — no implementation, no schema/validator/DLA/T-031 changes |
| **Purpose** | Diagnose whether GAM fulfils the **pedagogical function** of a known DLA commission (distinct from E1 binding, Case 1 executability, and E2 corruption) |
| **Out of T-025** | Closing E2; reopening T-031; claiming general GAM quality; GAM prompt-architecture rewrite |
| **Acceptance** | Written diagnostic; defect class kept separate from E1/E2/Case 1; no production edits unless a later task is authorised |
| **Verification** | [S77-T-025](S77-T-025-gam-d-pedagogical-function-fulfilment-diagnostic.md) |

### S77-T-026 — GAM E2 intermittent corruption diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **DIAGNOSTIC COMPLETE** — E2 remains OPEN / INTERMITTENT — [S77-T-026](S77-T-026-gam-e2-intermittent-corruption-diagnostic.md) |
| **Mode** | DIAGNOSTIC ONLY when authorised |
| **Purpose** | Diagnose intermittent learner-facing / JSON corruption (`Pur[`, `\rtial`); capture protocol, not a guessed sanitiser |

### S77-T-027 — Sprint 77 close-out

| Field | Content |
| ----- | ------- |
| **Status** | **COMPLETE** (2026-08-14) — [S77-T-027](S77-T-027-sprint-77-closeout.md) |
| **Mode** | Documentation / close-out only |
| **Purpose** | Close Sprint 77 at the architecture + GAM-investigation boundary |
| **Out of T-027** | Production/test changes; Phase D; Graphics; T-032; PB-FA-010 execution; next-sprint selection |

---

## Later (not authorised)

| Work | Gate |
| ---- | ---- |
| Phase D DLA legacy cleanup / rollback removal | Separate operator decision |
| [PB-FA-010](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-010--prompt-contract-architecture-method-after-dla-pilot) other prompts | After individual bounded work; GAM architecture **after** GAM D/E |
| Graphics | OPEN / SEPARATE |

---

## Last updated

2026-08-14 — Sprint 77 **CLOSED** ([S77-T-027](S77-T-027-sprint-77-closeout.md)).

# Sprint 87 — Plan

**Status:** **READY / NOT STARTED** — pack opened ([S87-D01](decisions.md#s87-d01--open-sprint-87--expository-quality--first-successor-implementation)); no task begun  
**Dashboard:** [STATUS.md](STATUS.md) · **Charter:** [SPRINT-87-CHARTER.md](SPRINT-87-CHARTER.md)  
**Design:** [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md)

Gate/task IDs: `S87-T-###`, `S87-D##`, `S87-WP#`.

---

## Programme posture

```text
Sprint pack / opening decision     COMPLETE (S87-D01)
QA v0.2 (S86 WP2 carry-forward)    FIRST TASK — not started
T-011 first-slice implementation   AUTHORISED after T-001 — not started
Sprint 86 investigation/design     CLOSED — do not reopen priorities
Interactive baseline               PROTECTED (S83-D04)
Sprint 87 execution                READY / NOT STARTED
```

---

## Work packages

| WP | Focus | Status |
| -- | ----- | ------ |
| **WP1** | Acceptance instrument — Expository QA v0.2 | **NOT STARTED** |
| **WP2** | Contracts / authority / Expository sibling prompts (EQ1) | **NOT STARTED** |
| **WP3** | Chapter-form assembly policy (EQ7/EQ8 + DP `sections` safety) | **NOT STARTED** |
| **WP4** | Renderer — AD-010 repair + restrained T-010 presentation | **NOT STARTED** |
| **WP5** | Engineering gates + live validation + closure | **NOT STARTED** |

---

## Dependency order (binding)

```text
QA v0.2
  ↓
contracts / authority
  ↓
Expository sibling prompts
  ↓
assembly policy
  ↓
renderer / AD-010 / restrained presentation
  ↓
focused + regression engineering gates
  ↓
live Expository pressure cases
  ↓
sprint evaluation / closure
```

---

## Task sequence

| ID | Title | WP | Status |
| -- | ----- | -- | ------ |
| **S87-T-001** | Draft Expository **QA v0.2** (before production coding) | WP1 | **READY** — first authorised task |
| **S87-T-002** | EQ1 contract + Expository prompt authority (EJP/XD binding) | WP2 | **NOT STARTED** |
| **S87-T-003** | Chapter-form policy: opening (EQ7) / closing (EQ8) / DP `sections` safety | WP3 | **NOT STARTED** |
| **S87-T-004** | AD-010 structured-material rendering repair | WP4 | **NOT STARTED** |
| **S87-T-005** | Restrained renderer/CSS presentation (T-010 MUST) | WP4 | **NOT STARTED** |
| **S87-T-006** | Engineering regression gate (focused + first-class + Interactive) | WP5 | **NOT STARTED** |
| **S87-T-007** | Live/manual Expository validation (pressure cases + QA v0.2) | WP5 | **NOT STARTED** |
| **S87-T-008** | Synthesis / sprint closure | WP5 | **NOT STARTED** |

### T-001 notes (do not draft in setup)

Incorporate S86 evidence-backed instrument candidates:

- creation-context purpose-fit  
- epistemic-form preservation  
- accessibility semantic equivalence ≠ editorial redundancy  
- productive conceptual recurrence ≠ redundancy  
- interpretive consolidation need not force single-model resolution  
- representation: warrant → explanatory value of form → integration  

Base on [EXPOSITORY-QA-v0.1.md](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/EXPOSITORY-QA-v0.1.md) + [T-007](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-007-FIVE-CASE-SYNTHESIS.md).

### Explicitly not tasked

Option B · H3s · fonts · callouts · new AI stage · CAS · Interactive prompt edits · Research Synthesis · Expository→Interactive.

---

## Related

- Opening: [S87-D01](decisions.md#s87-d01--open-sprint-87--expository-quality--first-successor-implementation)  
- Design: [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md)  
- Closure handoff: [S86 T-012](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-012-SPRINT-86-CLOSURE.md)  
- Protected Interactive: [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)  
- Backlog: [PB-FA-012](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa)

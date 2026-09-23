# Sprint 87 — Plan

**Status:** **IN PROGRESS** — [S87-D01](decisions.md#s87-d01--open-sprint-87--expository-quality--first-successor-implementation) · QA [S87-D02](decisions.md#s87-d02--accept-expository-qa-v02)  
**Dashboard:** [STATUS.md](STATUS.md) · **Charter:** [SPRINT-87-CHARTER.md](SPRINT-87-CHARTER.md)  
**Design:** [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md)  
**Acceptance instrument:** [EXPOSITORY-QA-v0.2.md](EXPOSITORY-QA-v0.2.md)

Gate/task IDs: `S87-T-###`, `S87-D##`, `S87-WP#`.

---

## Programme posture

```text
Sprint pack / opening decision     COMPLETE (S87-D01)
QA v0.2                            COMPLETE (S87-T-001 / S87-D02)
EQ1 contracts / prompts / stamp    COMPLETE (S87-T-002 / WP2)
Chapter-form / DP sections         COMPLETE (S87-T-003 / WP3)
AD-010 structured materials        COMPLETE (S87-T-004 / S87-D05)
Restrained T-010 presentation      COMPLETE (S87-T-005 / S87-D06)
Engineering regression gate        COMPLETE (S87-T-006 / S87-D07)
Sprint 86 investigation/design     CLOSED
Interactive baseline               PROTECTED (S83-D04)
Sprint 87 execution                IN PROGRESS
```

---

## Work packages

| WP | Focus | Status |
| -- | ----- | ------ |
| **WP1** | Acceptance instrument — Expository QA v0.2 | **COMPLETE** |
| **WP2** | Contracts / authority / Expository sibling prompts (EQ1) | **COMPLETE** |
| **WP3** | Chapter-form assembly policy (EQ7/EQ8 + DP `sections` safety) | **COMPLETE** |
| **WP4** | Renderer — AD-010 repair + restrained T-010 presentation | **COMPLETE** |
| **WP5** | Engineering gates + live validation + closure | **IN PROGRESS** — T-006 COMPLETE; T-007 next |

---

## Dependency order (binding)

```text
QA v0.2                          ← COMPLETE
  ↓
contracts / authority            ← COMPLETE (T-002)
  ↓
Expository sibling prompts       ← COMPLETE (T-002/T-003)
  ↓
assembly policy                  ← COMPLETE (T-003)
  ↓
renderer / AD-010                ← COMPLETE (T-004)
  ↓
restrained presentation (T-010)  ← COMPLETE (T-005)
  ↓
focused + regression engineering gates  ← COMPLETE (T-006)
  ↓
live Expository pressure cases          ← T-007 next
  ↓
sprint evaluation / closure
```

---

## Task sequence

| ID | Title | WP | Status |
| -- | ----- | -- | ------ |
| **S87-T-001** | Draft Expository **QA v0.2** | WP1 | **COMPLETE** |
| **S87-T-002** | EQ1 contract + Expository prompt authority (EJP/XD binding) | WP2 | **COMPLETE** |
| **S87-T-003** | Chapter-form policy: opening (EQ7) / closing (EQ8) / DP `sections` safety | WP3 | **COMPLETE** |
| **S87-T-004** | AD-010 structured-material rendering repair | WP4 | **COMPLETE** |
| **S87-T-005** | Restrained renderer/CSS presentation (T-010 MUST) | WP4 | **COMPLETE** |
| **S87-T-006** | Engineering regression gate (focused + first-class + Interactive) | WP5 | **COMPLETE** |
| **S87-T-007** | Live/manual Expository validation (pressure cases + QA v0.2) | WP5 | **READY** — next authorised |
| **S87-T-008** | Synthesis / sprint closure | WP5 | **NOT STARTED** |

### Explicitly not tasked

Option B · H3s · fonts · callouts · new AI stage · CAS · Interactive prompt edits · Research Synthesis · Expository→Interactive.

---

## Related

- Opening: [S87-D01](decisions.md#s87-d01--open-sprint-87--expository-quality--first-successor-implementation)  
- QA v0.2: [S87-D02](decisions.md#s87-d02--accept-expository-qa-v02)  
- EQ1: [S87-D03](decisions.md#s87-d03--eq1-ejp-contract-fields-commissioned_purpose--epistemic_form)  
- Chapter form: [S87-D04](decisions.md#s87-d04--expository-chapter-form-eq7eq8--dp-sections-safety)  
- AD-010: [S87-D05](decisions.md#s87-d05--ad-010-structured-material-semantic-rendering)  
- Presentation: [S87-D06](decisions.md#s87-d06--expository-scoped-t-010-presentation)  
- Engineering gate: [S87-D07](decisions.md#s87-d07--engineering-regression-gate--cross-product-isolation)  
- Tests: `tests/s87-t002-*.js` · `tests/s87-t003-*.js` · `tests/s87-t004-*.js` · `tests/s87-t005-*.js` · `tests/s87-t006-*.js`  
- Design: [S86 T-011](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-011-SUCCESSOR-IMPLEMENTATION-DESIGN.md) · [S86 T-010](../2026-09-22-sprint-86-expository-editorial-quality-and-qa/T-010-TYPOGRAPHY-REQUIREMENTS.md)  
- Backlog: [PB-FA-012](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa)

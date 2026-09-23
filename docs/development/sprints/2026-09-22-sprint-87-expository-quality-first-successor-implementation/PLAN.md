# Sprint 87 — Plan

**Status:** **COMPLETE / CLOSED** — [S87-D14](decisions.md#s87-d14--close-sprint-87--expository-quality--first-successor-implementation) · [T-008-SPRINT-87-CLOSURE.md](T-008-SPRINT-87-CLOSURE.md)  
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
Live validation + repairs          COMPLETE (S87-T-007 / S87-D08…D13)
Sprint closure                     COMPLETE (S87-T-008 / S87-D14)
Sprint 86 investigation/design     CLOSED
Interactive baseline               PROTECTED (S83-D04)
Sprint 87                          COMPLETE / CLOSED
PB-FA-012                          CLOSED
```

---

## Work packages

| WP | Focus | Status |
| -- | ----- | ------ |
| **WP1** | Acceptance instrument — Expository QA v0.2 | **COMPLETE** |
| **WP2** | Contracts / authority / Expository sibling prompts (EQ1) | **COMPLETE** |
| **WP3** | Chapter-form assembly policy (EQ7/EQ8 + DP `sections` safety) | **COMPLETE** |
| **WP4** | Renderer — AD-010 repair + restrained T-010 presentation | **COMPLETE** |
| **WP5** | Engineering gates + live validation + closure | **COMPLETE** |

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
| **S87-T-007** | Live/manual Expository validation (pressure cases + QA v0.2) | WP5 | **COMPLETE** |
| **S87-T-008** | Synthesis / sprint closure | WP5 | **COMPLETE** |

### Explicitly not tasked (remain deferred)

Option B · H3s · fonts · callouts · new AI stage · CAS · Interactive prompt edits · Research Synthesis · Expository→Interactive.

---

## Final gates (T-008)

| Gate | Result |
| ---- | ------ |
| `npm run test:first-class` | **339/339** |
| Focused S87 acceptance pack | **96/96** |
| Fig 4 regression | **3/3** |
| `npm run check:learner-renderer-vnext-browser` | **OK** |

---

## Related

- Closure: [T-008-SPRINT-87-CLOSURE.md](T-008-SPRINT-87-CLOSURE.md) · [S87-D14](decisions.md#s87-d14--close-sprint-87--expository-quality--first-successor-implementation)  
- Live validation: [T-007-LIVE-VALIDATION.md](T-007-LIVE-VALIDATION.md)  
- Decisions: [decisions.md](decisions.md) S87-D01…D14  
- Backlog: [PB-FA-012](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-012--expository-editorial-quality--qa) — **CLOSED**

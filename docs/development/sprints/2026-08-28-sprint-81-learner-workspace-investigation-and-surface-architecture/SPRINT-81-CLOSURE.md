# Sprint 81 — Closure Record

**Sprint:** 81 — Learner Workspace Investigation & Surface Architecture  
**Opened:** 2026-08-28  
**Closed:** 2026-08-28  
**Status:** **COMPLETE / CLOSED**  
**Outcome:** **B — TARGETED ENHANCEMENT** ([S81-D02](decisions.md#s81-d02--b-targeted-enhancement-narrowed))  
**Predecessor:** [Sprint 80 — CLOSED](../2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/SPRINT-80-START-HERE.md)  
**Entry:** [SPRINT-81-START-HERE.md](SPRINT-81-START-HERE.md) · **Dashboard:** [STATUS.md](STATUS.md) · **Handover:** [HANDOVER.md](HANDOVER.md)

---

## 1. Final product conclusion

PRISM’s existing learner surfaces were already **substantially appropriate**.

The investigation did **not** justify:

- a surface-family architecture;
- activity-type → widget mapping architecture;
- a learner-workspace overhaul;
- a general revision subsystem;
- a free-text/table diagnostic engine;
- criterion → field/cell mapping;
- new commissioning structure for precise revision targeting.

The principal evidenced interaction weakness was the **revision / self-review loop**, not the underlying production surfaces.

---

## 2. Final shipped learner behaviour

Normal first-pass flow remains linear:

```text
Explore → Your task → learner production → Check your response
```

- **No** Task → Check shortcut.
- Check → **Back to your task** (activity-level return).
- Per criterion: **Revise with this criterion** → same activity’s Task + **one** active authored Review guidance criterion.
- Existing production workspace remains the sole editable source of truth.
- PRISM does **not** infer which field/cell a criterion concerns and does **not** assess free-text/table responses.

### Revision guidance

- Full Review guidance at Task after explicit handoff; normal document flow (scrolls away).
- When full guidance leaves view while the learner remains in the Do/activity region: **compact reminder** — Revising against + statement + **View guidance**.
- Reminder sits below sticky journey nav via `--learner-sticky-nav-height`.
- **View guidance** returns to full guidance; **Hide guidance** clears accompaniment only.
- One active revision criterion per activity; no permanent criteria chrome; no duplicate editable response; no read-only production mirror; no dual-pane.

---

## 3. Manual-test learning

| ID | Finding |
| -- | ------- |
| A | Initial R1 Task → Check was technically correct but redundant/mistimed in linear flow — **removed**. |
| B | Activity-level return is the truthful granularity supported by current contracts. |
| C | `diagnostic_review` / `covers_response_material_ids` does **not** provide criterion→field mapping and does not survive into vNext as navigation authority. |
| D | R4 solves **cognitive-context**, not exact response-locus navigation. |
| E | Full sticky Review guidance rejected (too much viewport). |
| F | Separation: full guidance = understand; compact reminder = remember; workspace = revise. |
| G | Final operator manual testing: interaction useful and acceptable — **sprint closed**. |

---

## 4. Architectural conclusions retained

Six learner-action model (do **not** imply six widget families):

1. study/read/inspect  
2. compose written response  
3. complete/construct table  
4. self-review against criteria  
5. order/sequence  
6. select objective answer  

Existing representations remain the default. Future specialised surfaces need their own evidence case.

```text
learner evidence ≠ automated diagnosis
```

Only ordering/select currently have deterministic evidence-consuming checks. Self-review remains learner judgement. `diagnostic_review` remains structural/commissioning authority, not a runtime diagnostic engine.

---

## 5. Accessibility

Sprint 81 preserved the established **alpha accessibility baseline** (native controls, keyboard, names, document structure, no focus trap, reflow/fallback, authoritative editable controls, no drag-only requirement). **No formal WCAG conformance claimed.**

---

## 6. Tests / confidence

| Gate | Result |
| ---- | ------ |
| `npm run test:first-class` | **339/339 PASS** |
| Focused R1 (`tests/s81-t-007-…`) | **pass** (task record) |
| Focused R4 (`tests/s81-t-008-…`) | **pass** (task record; final board **11** assertions with shell-offset CSS) |

D-014 not reopened. RC3–RC8 historical debt not reopened.

---

## 7. Debt disposition

**Open / carried:** S81-D-001…D-007 (unsupported response surfaces, ordering emission uncertainty, feedback_pack, multi-answer assessment, vocabulary mismatches) — see [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md).

**Parked / not pursued (intentionally rejected alternatives):** R3 primary, R5 dual-pane, T5 table replacement, C3 new compose family, matching/canvas/new select programmes, criterion→field mapping, free-text/table diagnosis engine.

---

## 8. What was not started

**Mathematical learner input / maths entry** was **not** opened, designed, or implemented in Sprint 81. It is only a future-work pointer in [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).

---

## 9. Recommended commit message

```text
Close Sprint 81: targeted revision-loop enhancement (R1 + R4).

Investigation retained existing learner surfaces; shipped asymmetric Task/Check
landmarks and criterion revision accompaniment with compact sticky reminder.
```

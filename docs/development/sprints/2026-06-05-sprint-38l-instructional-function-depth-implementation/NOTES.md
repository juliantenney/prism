# Sprint 38-L — Notes

**Status:** **CHARTERED** (2026-06-05)

**Predecessor:** [38K-6 closure](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-6-sprint-closure.md)

---

## Charter created

Successor to Sprint 38-K (**CLOSED — SUCCESS**).

**Mission:** Implement instructional sufficiency (R1–R7) in pack §5/§6 — no architecture changes.

**38L-1:** Planning review — **COMPLETE**.  
**38L-2:** DLA depth-floor — **COMPLETE**.  
**38L-3:** GAM depth-shaped bodies — **COMPLETE** ([38L-3](observations/38L-3-gam-depth-shaped-body-implementation.md)): GAM-PRES-08/09, GAM-WB-26..30, F9.  
**38L-4:** Closure integration + Evaluate alignment — **COMPLETE** ([38L-4](observations/38L-4-closure-integration-and-evaluate-alignment.md)): INF-EVAL-01, EV-CAP-04, DLA-WB-31, GAM-PRES-10, harness.  
**Next:** **38L-5** Inflation proof run.

---

## Key framing decisions

1. **Do not revisit architecture** — 38K proved schema/ACM/renderer/workflow sufficient.  
2. **Extend 38-J IFP/GAM-PRES** — do not weaken.  
3. **Level 3 minimum floor** per [38K-3](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md).  
4. **Evaluate first** implementation priority (R5, R7) + universal verification (R1).  
5. **Success = EV-38L-AFTER** vs `EV-38J-AFTER` + 38I-4 minimum sufficiency.

---

## Baselines

| Set | Role |
|-----|------|
| `EV-38J-AFTER-*` | Primary comparator |
| `EV-38G-AFTER-*` | Historical shell |
| 38I-4 mock-ups | Target calibration |

**Capture prefix:** `EV-38L-AFTER-*`

---

## Production surface

`domains/learning-design/domain-learning-design-step-patterns.md` — §5 DLA, §6 GAM

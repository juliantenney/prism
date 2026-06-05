# Sprint 38-M — Notes

**Status:** **CHARTERED** (2026-06-05)

**Predecessor:** [38L-6 closure](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md)

---

## Charter created

Successor to Sprint 38-L (**CLOSED — SUCCESS**).

**Mission:** Page composition fidelity at L4 — GAM bodies survive compose and render.

**Next:** **38M-1** Baseline page fidelity analysis (no implementation).

---

## Key framing decisions

1. **Do not revisit architecture** — 38-L proved schema/ACM/workflow sufficient; gap is L4 compose.  
2. **Hold 38-L §5/§6 gains** — DLA/GAM depth obligations remain; 38-M fixes the page boundary.  
3. **No renderer styling redesign** — A3 sequencing via page JSON / compose ordering first.  
4. **Build on existing preserve layer** — `page-gam-materials-preserve.js` from 38-L post-work.  
5. **Proof = `EV-38M-AFTER`** with GAM≈page length gates on A4 worked/guided judgement.

---

## Problem evidence (38-L)

| Material (A4) | GAM len | Page len (EV-38L) |
|---------------|---------|-------------------|
| Scenario | 817 | 222 |
| Worked judgement | 1050 | 248 |
| Guided table | 1711 | 687 |

Source: [38L loss trace](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md)

---

## Baselines

| Set | Role |
|-----|------|
| `EV-38L-AFTER-*` | Primary comparator (pre-38M proof) |
| `EV-38J-AFTER-*` | Structure-only |
| 38I-4 A4 episode | Benchmark calibration |

**Capture prefix (this sprint):** `EV-38M-AFTER-*`

---

## Production surface (expected)

- L4 compose path — `app.js` post-compose merge  
- `lib/page-gam-materials-preserve.js` (extend)  
- Page fidelity validators + harness  
- Pack L4 contracts — only if 38M-1 identifies prompt gap

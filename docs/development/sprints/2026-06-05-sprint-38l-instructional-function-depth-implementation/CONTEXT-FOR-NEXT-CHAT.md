# Context for next chat — Sprint 38-L

**Pack:** `docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/`

**Status:** **CLOSED** — [38L-6](observations/38L-6-sprint-closure.md)

---

## Mission (completed)

Implemented instructional sufficiency obligations (R1–R7) within the 38-J architecture — `EV-38L-AFTER` materially richer than `EV-38J-AFTER`; 38I-4 benchmark **partial** on rendered learner page.

```text
38-K defined episode sufficiency.
38-L implemented depth and closure obligations.
```

---

## Closure conclusion

| Finding | Detail |
|---------|--------|
| Architecture | **PASS** — no schema/ACM/renderer/workflow redesign needed |
| R1–R7 | **PASS** — implemented in §5/§6 |
| 38I benchmark | **PARTIAL** |
| Remaining gap | **Page composition fidelity** + **function richness calibration** (A4 capstone; M16 independent template) |

**Evidence:** [38L-instructional-function-loss-trace.md](observations/38L-instructional-function-loss-trace.md)

---

## Successor work (not chartered)

1. Re-run harness with GAM→Page preserve gate; QA **rendered page** vs GAM.  
2. Calibrate GAM independent judgement template (M16) to [38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md).  
3. Optional: A3 episode presentation order (checklist-first render).

**Suggested next sprint:** 38-M Page Composition Fidelity (TBD).

---

## Key artefacts

| Item | Path |
|------|------|
| Proof run | `artefacts/EV-38L-AFTER-*` |
| Harness | `artefacts/ev-38l-inflation-pipeline-capture-once.mjs` |
| DLA validator | `lib/dla-38l-obligation-check.js` |
| Page preserve | `lib/page-gam-materials-preserve.js` |
| Closure | [observations/38L-6-sprint-closure.md](observations/38L-6-sprint-closure.md) |

---

## Frozen baselines

- `EV-38G-AFTER-*` — shell baseline  
- `EV-38J-AFTER-*` — post-structure baseline  
- `EV-38L-AFTER-*` — post-depth implementation baseline  
- [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

---

## Phase sequence (complete)

```text
38L-1 → 38L-2 → 38L-3 → 38L-4 → 38L-5 → 38L-6 ✓
```

# Handover — Sprint 38-L

**Pack:** [README.md](README.md) · **Status:** **CHARTERED** (2026-06-05)

**Predecessor:** [Sprint 38-K](../2026-06-05-sprint-38k-instructional-function-depth/) (**CLOSED** — [38K-6](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-6-sprint-closure.md))

---

## Start here — 38L-5

### Inflation proof run

1. Read [38L-4 closure + Evaluate alignment](observations/38L-4-closure-integration-and-evaluate-alignment.md) — R5 termination gates, R7 harness.  
2. Run `artefacts/ev-38l-inflation-pipeline-capture-once.mjs` → `EV-38L-AFTER-*`.  
3. Deliverable: `observations/38L-5-inflation-proof-run.md`.

---

## What 38-K handed off

| Item | Location |
|------|----------|
| Depth model | [38K-2](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md) |
| Archetype floors | [38K-3](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) |
| Before/after examples | [38K-4](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) |
| Implementation roadmap | [38K-5](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md) |
| Closure + handover | [38K-6](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-6-sprint-closure.md) |
| Post-38J baseline | `../2026-06-05-sprint-38j-instructional-function-planning/artefacts/EV-38J-AFTER-*` |

**Core finding:** Architecture holds; implement depth + closure in §5/§6 only.

---

## Phase index

| Phase | Status |
|-------|--------|
| **38L-1** | Implementation planning review — **COMPLETE** |
| **38L-2** | DLA depth-floor implementation — **COMPLETE** |
| **38L-3** | GAM depth-shaped body implementation — **COMPLETE** |
| **38L-4** | Closure integration + Evaluate alignment — **COMPLETE** |
| **38L-5** | Inflation proof run — **NEXT** |
| **38L-6** | Closure |

---

## Hold conditions

| Hold | Source |
|------|--------|
| **38J IFP** | Extend §5 — do not weaken |
| **38J GAM-PRES** | Extend §6 — do not weaken |
| **38K architecture conclusion** | No schema/ACM/renderer/workflow |
| **38H anti-spoiler** | GAM-WB-06b |
| **Frozen comparators** | `EV-38G-AFTER-*` · `EV-38J-AFTER-*` |

---

## Implementation priority (from 38K-6 §9)

1. **R1** — Universal verification  
2. **R5 + R7** — Evaluate completion + household LO  
3. **R2 + R3** — Depth floors in specs + GAM bodies  
4. **R6** — Analyse worked analytic pass  
5. **R4** — Closure emission gates  

---

Open with **38L-5**. Cite [38L-4](observations/38L-4-closure-integration-and-evaluate-alignment.md) · [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md).

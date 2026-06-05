# Handover — Sprint 38-M

**Pack:** [README.md](README.md) · **Status:** **CHARTERED** (2026-06-05)

**Predecessor:** [Sprint 38-L](../2026-06-05-sprint-38l-instructional-function-depth-implementation/) (**CLOSED** — [38L-6](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md))

---

## Start here — 38M-1

### Baseline page fidelity analysis

1. Read [38L loss trace](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md) — survival matrix.  
2. Read [38L page preserve fix](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-page-preservation-and-json-validity-fix.md) — existing merge layer.  
3. Measure `EV-38L-AFTER-gam.json` vs `EV-38L-AFTER-design-page.json` vs render per A3/A4 function.  
4. Deliverable: `observations/38M-1-baseline-page-fidelity-analysis.md`.

**Rule:** No implementation in 38M-1.

---

## What 38-L handed off

| Item | Location |
|------|----------|
| Forensic trace | [38L-instructional-function-loss-trace.md](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md) |
| Closure verdict | [38L-6](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md) |
| Proof artefacts | `../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38L-AFTER-*` |
| Page preserve lib | `lib/page-gam-materials-preserve.js` |
| DLA validator | `lib/dla-38l-obligation-check.js` |
| 38L harness | `../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs` |

**Core finding:** DLA and GAM are rich; **page composition** compresses A4; render exposes thin learner experience.

---

## Phase index

| Phase | Status |
|-------|--------|
| **38M-1** | Baseline page fidelity analysis — **NEXT** |
| **38M-2** | Page composition preservation model |
| **38M-3** | A4 Evaluate fidelity implementation |
| **38M-4** | A3 Analyse sequencing fidelity |
| **38M-5** | Inflation proof run |
| **38M-6** | Closure |

---

## Success target (`EV-38M-AFTER`)

- A4 worked judgement page length ≈ GAM  
- A4 guided judgement page length ≈ GAM  
- Transfer prompts intact  
- No synopsis replacement of instructional materials  

---

## Hold conditions

| Hold | Source |
|------|--------|
| **38-L §5/§6** | Do not weaken depth obligations |
| **Architecture** | No schema · ACM · renderer styling · workflow redesign |
| **38L harness lineage** | Inflation proof — not 38H DLA path |
| **Frozen comparators** | `EV-38L-AFTER-*` · `EV-38J-AFTER-*` |

---

Open with **38M-1**. Cite [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md) · [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md).

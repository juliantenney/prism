# Sprint 38-M — Page Composition Fidelity

**Pack path:** `docs/development/sprints/2026-06-05-sprint-38m-page-composition-fidelity/`  
**Date:** 2026-06-05  
**Status:** **CHARTERED** — **38M-1 START HERE**  
**Predecessor:** [Sprint 38-L — Instructional Function Depth Implementation](../2026-06-05-sprint-38l-instructional-function-depth-implementation/) (**CLOSED** — [38L-6](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md) · **SUCCESS**)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

Close the **L4 Design Page composition fidelity gap** identified in [38L instructional function loss trace](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md): upstream DLA and GAM are rich; composed page JSON compresses instructional bodies; rendered learner experience feels thin.

| Prior sprint | Established |
|--------------|-------------|
| **38-I** | Episode archetypes; 38I-4 target-state mock-ups |
| **38-J** | IFP §5; GAM-PRES §6; episode **structure** |
| **38-K** | Depth model; R1–R7 roadmap |
| **38-L** | R1–R7 in §5/§6; `EV-38L-AFTER`; DLA obligations; initial GAM→Page preserve layer |
| **38-M** | **Page composition fidelity** — GAM bodies survive compose and render |

**Core shift:**

```text
38-L made DLA and GAM instructionally sufficient.
38-M makes the composed page faithful to GAM.
```

**Programme question:**

> How do we prevent Design Page composition from summarising or collapsing materials that GAM already generated correctly?

---

## Problem statement (forensic)

```text
DLA  → rich
GAM  → rich
Page → compressed   ← primary failure stage (A4)
Render → thin learner experience
```

**Evidence:** [38L-instructional-function-loss-trace.md](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md) · [38L-page-preservation-and-json-validity-fix.md](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-page-preservation-and-json-validity-fix.md)

---

## Architecture (unchanged)

```text
KM → LO → IFP → ACM → DLA → GAM → Design Page → Render
```

**Do not revisit:** schema · ACM · renderer styling · workflow steps.

**Primary implementation surface:** L4 compose (Design Page step) — pack contracts, programmatic GAM→page merge, validators, harness proof.

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38M-1** | Baseline page fidelity analysis | `observations/38M-1-baseline-page-fidelity-analysis.md` | **NEXT** |
| **38M-2** | Page composition preservation model | `observations/38M-2-page-composition-preservation-model.md` | Not started |
| **38M-3** | A4 Evaluate fidelity implementation | `observations/38M-3-a4-evaluate-fidelity-implementation.md` | Not started |
| **38M-4** | A3 Analyse sequencing fidelity | `observations/38M-4-a3-analyse-sequencing-fidelity.md` | Not started |
| **38M-5** | Inflation proof run | `observations/38M-5-inflation-proof-run.md` · `artefacts/EV-38M-AFTER-*` | Not started |
| **38M-6** | Closure | `observations/38M-6-sprint-closure.md` | Not started |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Success criterion (`EV-38M-AFTER`)

| Requirement | Evidence |
|-------------|----------|
| A4 worked judgement page length **≈** GAM length | Char-length parity on `worked_judgement` / `modelling_note` fields |
| A4 guided judgement page length **≈** GAM length | Char-length parity on `guided_judgement_table` / `decision_table` |
| Transfer prompts survive intact | Full GAM `transfer_prompt` body on page + render |
| No synopsis replacement | Validator rejects catalogue/placeholder-only bodies |
| A3 pedagogical sequence improved | Worked pass before verification in learner-facing order (38M-4) |

**Proof prefix:** `EV-38M-AFTER-*`

---

## In scope

- L4 page composition fidelity analysis and model  
- GAM→page body preservation enforcement  
- A4 Evaluate capstone fidelity (scenario, worked judgement, guided table, transfer, template)  
- A3 Analyse material sequencing (compose/page JSON; not renderer CSS redesign)  
- Inflation proof rerun · `EV-38M-AFTER` comparison vs `EV-38L-AFTER`  
- Validators and regression tests at page JSON boundary  

---

## Out of scope

| Item | Notes |
|------|--------|
| Schema changes | KM/LO keys frozen |
| ACM redesign | 38G-2 frozen |
| Renderer styling / CSS redesign | 38H hold — mapping-only fixes permitted only if charter phase explicitly allows |
| Workflow changes | No new pipeline steps |
| DLA §5 / GAM §6 pack rewrites | Hold 38-L gains — extend L4 only unless 38M-1 proves pack gap |
| New material types or archetypes | Existing catalogue |
| Full 38I-4 episode length in one sprint | Fidelity parity first |

---

## Authority (read-only)

| Document | Role |
|----------|------|
| [38L-6 closure](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md) | Successor mandate |
| [38L loss trace](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md) | Stage-level survival matrix |
| [38L page preserve fix](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-page-preservation-and-json-validity-fix.md) | Existing `page-gam-materials-preserve` baseline |
| [38I-4 A4 episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | Benchmark calibration |
| [LD-MATERIALS-COPY](../../../domains/learning-design/domain-learning-design-step-patterns.md) | L4 preserve contract (reference) |

**Baselines (frozen):** `EV-38L-AFTER-*` · `EV-38J-AFTER-*` · `EV-38G-AFTER-*`

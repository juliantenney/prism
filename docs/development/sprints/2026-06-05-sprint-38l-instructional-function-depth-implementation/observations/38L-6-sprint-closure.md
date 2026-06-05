# Sprint 38-L — Sprint closure (38L-6)

**Date:** 2026-06-05  
**Sprint:** **38-L — Instructional Function Depth Implementation** — **CLOSED**  
**Predecessor:** [Sprint 38-K](../2026-06-05-sprint-38k-instructional-function-depth/) (**CLOSED** — [38K-6](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-6-sprint-closure.md))  
**Proof run:** `EV-38L-AFTER` · [38L-5](38L-5-inflation-proof-run.md)

---

## §1 Executive summary

Sprint 38-L **implemented** instructional sufficiency obligations R1–R7 in pack §5 IFP and §6 GAM-PRES, captured a successful inflation proof run (`EV-38L-AFTER`), hardened the pipeline with DLA obligation validation and GAM→Page preservation, and completed a forensic instructional-function loss trace.

**Critical conclusion:** The remaining learner-facing gap is **not architectural**. Rich instructional structures exist in DLA and GAM; A3 largely survives to page render; A4 richness is **materially compressed during page composition**; independent judgement remains **thinner than target even before composition** (GAM M16).

| Assessment area | Verdict |
|-----------------|---------|
| Architecture | **PASS** |
| Instructional depth implementation (R1–R7) | **PASS** |
| 38I benchmark attainment | **PARTIAL** |
| **Sprint 38-L overall** | **SUCCESS** (charter delivered; benchmark partial by design ceiling) |

---

## §2 Objectives achieved

| Phase | Objective | Status | Evidence |
|-------|-----------|--------|----------|
| **38L-1** | Map R1–R7 to §5/§6 edit plan; confirm no architecture reopening | **COMPLETE** | [38L-1](38L-1-implementation-planning-review.md) |
| **38L-2** | DLA depth floors, emission gates, Evaluate/Analyse planning packs | **COMPLETE** | [38L-2](38L-2-dla-depth-floor-implementation.md) |
| **38L-3** | GAM depth-shaped body rules (GAM-PRES-08/09, GAM-WB-26..31) | **COMPLETE** | [38L-3](38L-3-gam-depth-shaped-body-implementation.md) |
| **38L-4** | Closure integration; INF-EVAL-01; EV-CAP-04; harness alignment (R7) | **COMPLETE** | [38L-4](38L-4-closure-integration-and-evaluate-alignment.md) |
| **38L-5** | Inflation proof run `EV-38L-AFTER-*` | **COMPLETE** | [38L-5](38L-5-inflation-proof-run.md) |
| **Post-38L-5 hardening** | DLA obligation validator; GAM→Page preserve; loss trace | **COMPLETE** | [DLA diagnosis](38L-DLA-obligation-run-path-diagnosis.md) · [Page preserve](38L-page-preservation-and-json-validity-fix.md) · [Loss trace](38L-instructional-function-loss-trace.md) |
| **38L-6** | Evidence-backed closure | **COMPLETE** | This document |

### R1–R7 implementation summary

| ID | Goal | Delivered |
|----|------|-----------|
| **R1** | Universal verification | DLA-WB-26; checklists on all four activities in `EV-38L-AFTER` |
| **R2** | Level 3 depth floors in DLA specs | `depth_floor: L3` on required_materials; IFP-09 |
| **R3** | Function-shaped GAM bodies | GAM-PRES-08/09; 19 materials with depth-shaped bodies |
| **R4** | Closure emission gates | IFP-10; transfer/template/checklist gates |
| **R5** | Evaluate completion pack | A4 eight-material chain; independent memo + verification + transfer |
| **R6** | Analyse worked analytic pass | M8 before analysis_table; full body in GAM and A3 page |
| **R7** | Evaluate LO / harness alignment | Frozen LO4 household Evaluate; 38I-4 A4 benchmark in harness |

---

## §3 Evidence summary

| Evidence class | Artefact / test | Key result |
|----------------|-----------------|------------|
| Pack §5 DLA | `domain-learning-design-step-patterns.md` §5 | IFP-09/10, DLA-WB-26..31, INF-EVAL-01, EV-CAP-04 |
| Pack §6 GAM | Same file §6 | GAM-PRES-08/09/10, GAM-WB-26..31 |
| Proof run | `artefacts/EV-38L-AFTER-*` | 19 GAM materials; 4 verification checklists; household A4 capstone |
| Comparator | `artefacts/EV-38L-vs-38J-comparison.json` | Substantial improvement vs 38J/38G ([38L-5 §1](38L-5-inflation-proof-run.md)) |
| DLA obligations | `lib/dla-38l-obligation-check.js` · harness hard fail | Mandatory §5 rows enforced on 38L path |
| Page preservation | `lib/page-gam-materials-preserve.js` · `tests/page-38l-gam-preservation.test.js` | Programmatic GAM→page merge + validator |
| Forensic trace | [38L-instructional-function-loss-trace.md](38L-instructional-function-loss-trace.md) | Stage-by-stage A3/A4 function survival matrix |
| Regression tests | `tests/dla-38l-obligation-smoke.test.js` · `tests/page-38l-gam-preservation.test.js` | DLA prompt surface + page preservation |

**Proof-run headline metrics ([38L-5](38L-5-inflation-proof-run.md)):**

| Metric | EV-38J-AFTER | EV-38L-AFTER |
|--------|--------------|--------------|
| GAM materials | 14 | **19** |
| A4 materials | 5 (policy Evaluate) | **8** (household closure pack) |
| Verification on all activities | No | **Yes** |
| A4 independent memo + transfer | Absent | **Present** |

---

## §4 Architecture assessment

**Verdict: PASS**

| Layer | Change in 38-L? | Assessment |
|-------|-----------------|------------|
| Schema (KM/LO) | No | Frozen LO contract; KM parse regression fixed ([38L-KM-json-regression-fix.md](38L-KM-json-regression-fix.md)) |
| ACM | No | Existing material types only |
| Workflow | No | Same pipeline steps |
| Renderer styling | No | CSS unchanged |
| Pack §5 IFP | **Yes** | Primary implementation surface — extend only |
| Pack §6 GAM-PRES | **Yes** | Primary implementation surface — extend only |
| L4 compose hardening | Minimal | `page-gam-materials-preserve` post-compose merge (not renderer) |

The stable chain holds:

```text
KM → LO → Episode Archetype → IFP → ACM → DLA → GAM → Design Page → Render
```

38-K's conclusion stands: **no platform redesign required** to approach 38I-4 sufficiency.

---

## §5 Remaining gaps

### Learner-facing (primary)

| Gap | Evidence | Stage |
|-----|----------|-------|
| **A4 page composition fidelity** | Scenario 817→222 chars; worked judgement 1050→248; guided table collapsed | Page composition (LLM thin/replace) |
| **Independent judgement template depth** | GAM M16 only 218 chars (memo header); below DLA spec | GAM generation + page |
| **38I stepped episode reading** | A3 checklist renders before worked pass; guided/independent fused in one table | Structural DLA shape + render order |
| **Workbook vs page divergence** | `EV-38L-AFTER-workbook.md` (GAM) rich; design-page render thin on A4 | Export path / compose fidelity |

### Programme (secondary)

| Gap | Notes |
|-----|-------|
| Full 38I-4 A4 episode length and step choreography | Beyond 38-L minimum sufficiency floor |
| Understand discrimination pack (38K-5 O1) | Deferred from 38L-1 |
| Re-run `EV-38L-AFTER` with preserve merge applied end-to-end | Post-sprint hardening not yet in frozen proof artefact metadata |

**Not gaps:** DLA function planning, GAM material count/type coverage, A3 body preservation, architecture capacity.

---

## §6 Successor recommendation

**Do not reopen 38-J/38-K architecture.** Next programme slice should target **learner-facing fidelity** at the L4 boundary:

| Priority | Focus | Rationale |
|----------|-------|-----------|
| **1** | **Page composition fidelity** | Forensic trace: A4 loss at compose; preserve layer exists but proof artefact predates full merge |
| **2** | **GAM independent judgement calibration** | M16 thin before page; blocks 38I-4 A4 owned judgement |
| **3** | **Episode presentation** | A3 render order + optional stepped framing (lower leverage than A4 body loss) |

**Suggested successor charter (not yet created):** Sprint **38-M — Page Composition Fidelity and Episode Presentation** (or equivalent), scoped to L4 compose enforcement, GAM depth gates for `template`/`modelling_note`, and rendered-page QA against `EV-38L-AFTER-gam.json` — **not** schema/ACM/renderer redesign.

**Frozen baselines for successor:**

- `EV-38L-AFTER-*` — post-implementation comparator  
- `EV-38J-AFTER-*` — structure-only comparator  
- [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) — benchmark calibration  

---

## §7 Sprint verdict

| Criterion | Result |
|-----------|--------|
| R1–R7 implemented in pack §5/§6 | **Yes** |
| `EV-38L-AFTER` captured | **Yes** |
| Materially richer than `EV-38J-AFTER` | **Yes** ([38L-5](38L-5-inflation-proof-run.md) verdict C — substantial improvement) |
| 38I-4 minimum sufficiency on all activities | **Partial** (A4 page render; M16 depth) |
| Architecture unchanged | **Yes** |
| Forensic trace completed | **Yes** |

### Verdict matrix (per charter guidance)

| Dimension | Verdict |
|-----------|---------|
| **Architecture** | **PASS** |
| **Instructional depth implementation** | **PASS** |
| **38I benchmark attainment** | **PARTIAL** |
| **Sprint 38-L closure** | **SUCCESS** |

**Rationale:** 38-L charter was **implement R1–R7 and prove with `EV-38L-AFTER`** — delivered. Full 38I-4 episode parity was explicitly **out of charter** ([IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) non-goals). Residual learner-facing gap is **compose fidelity and function richness calibration**, not sprint failure.

---

## §8 Handover

### Start here (successor work)

1. Read [38L-instructional-function-loss-trace.md](38L-instructional-function-loss-trace.md) — stage-level survival matrix.  
2. Read [38L-page-preservation-and-json-validity-fix.md](38L-page-preservation-and-json-validity-fix.md) — existing L4 merge hook.  
3. Re-run 38L harness with preserve gate; compare **rendered page** (not workbook.md alone) to GAM.  
4. Calibrate GAM M16 independent judgement against [38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) Step 5–6.

### Key files

| Item | Path |
|------|------|
| Pack | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Harness | `artefacts/ev-38l-inflation-pipeline-capture-once.mjs` |
| Proof artefacts | `artefacts/EV-38L-AFTER-*` |
| DLA validator | `lib/dla-38l-obligation-check.js` |
| Page preserve | `lib/page-gam-materials-preserve.js` |
| Tests | `tests/dla-38l-obligation-smoke.test.js` · `tests/page-38l-gam-preservation.test.js` |

### Hold conditions (carry forward)

- Extend 38-J IFP/GAM-PRES — do not weaken  
- No schema/ACM/renderer redesign without new charter  
- Evaluate capstone = household strategy ([38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md))  
- Use **38L harness only** for inflation proof (not 38H DLA path)

### Observation index

| Slice | Document |
|-------|----------|
| 38L-1 | [38L-1-implementation-planning-review.md](38L-1-implementation-planning-review.md) |
| 38L-2 | [38L-2-dla-depth-floor-implementation.md](38L-2-dla-depth-floor-implementation.md) |
| 38L-3 | [38L-3-gam-depth-shaped-body-implementation.md](38L-3-gam-depth-shaped-body-implementation.md) |
| 38L-4 | [38L-4-closure-integration-and-evaluate-alignment.md](38L-4-closure-integration-and-evaluate-alignment.md) |
| 38L-5 | [38L-5-inflation-proof-run.md](38L-5-inflation-proof-run.md) |
| Hardening | [38L-DLA-obligation-run-path-diagnosis.md](38L-DLA-obligation-run-path-diagnosis.md) · [38L-page-preservation-and-json-validity-fix.md](38L-page-preservation-and-json-validity-fix.md) · [38L-instructional-function-loss-trace.md](38L-instructional-function-loss-trace.md) |
| **38L-6** | **This document** |

---

**Parent:** [observations/README.md](README.md) · **Sprint:** **38-L CLOSED** · **Successor:** [Sprint 38-M — Page Composition Fidelity](../../2026-06-05-sprint-38m-page-composition-fidelity/) (**CHARTERED** — 38M-1 START HERE)

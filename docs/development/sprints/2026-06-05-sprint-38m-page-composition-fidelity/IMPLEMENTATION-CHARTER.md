# Sprint 38-M — Implementation charter (Page Composition Fidelity)

**Date:** 2026-06-05  
**Status:** **CHARTERED**  
**Predecessor:** [Sprint 38-L](../2026-06-05-sprint-38l-instructional-function-depth-implementation/) (**CLOSED** — [38L-6](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md) · **SUCCESS**)

---

## Mission

**Page Composition Fidelity** — prevent Design Page composition from summarising or collapsing instructional materials that GAM already generated correctly, so the rendered learner workbook reflects GAM richness.

**Not:** schema/ACM/renderer-styling/workflow redesign; reopening 38-L DLA/GAM depth obligations; word-count gaming without substantive body checks.

---

## Programme question

> Why does the learner-facing page feel like “worksheet + checklist” when DLA and GAM already carry full instructional episodes?

**38-L answer:** Architecture holds; DLA and GAM are rich; **page composition** thins A4 (and A3 episode order inverts at render).  
**38-M answer:** Enforce **L4 fidelity** so composed page JSON and render match GAM bodies.

---

## Inherited finding (38-L)

| Stage | A3 | A4 |
|-------|----|----|
| DLA | Rich function chain | Rich Evaluate completion pack |
| GAM | Full bodies (19-material run) | Full scenario, worked judgement, guided table |
| Page | Bodies largely preserved | **Compressed** — synopsis replacement |
| Render | Checklist-first order | Thin stubs despite keys present |

**Source:** [38L-instructional-function-loss-trace.md](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md)

**Existing baseline code (38-L post-work, not proof-validated end-to-end):**

- `lib/page-gam-materials-preserve.js` — GAM→page merge hook  
- `lib/dla-38l-obligation-check.js` — upstream DLA gate  
- `tests/page-38l-gam-preservation.test.js` — preservation regression  

38-M **formalises, extends, and proves** this layer under `EV-38M-AFTER`.

---

## Architecture

### Stable chain (unchanged)

```text
KM → LO → Episode Archetype → IFP → ACM → DLA → GAM → Design Page → Render
```

### Implementation surface (this sprint)

| Surface | Scope |
|---------|--------|
| **L4 compose analysis** | Baseline metrics GAM vs page vs render ([38M-1](../2026-06-05-sprint-38m-page-composition-fidelity/)) |
| **Preservation model** | Merge rules, validators, anti-synopsis gates ([38M-2](../2026-06-05-sprint-38m-page-composition-fidelity/)) |
| **A4 fidelity** | Capstone body parity ([38M-3](../2026-06-05-sprint-38m-page-composition-fidelity/)) |
| **A3 sequencing** | Pedagogical material order in page JSON / compose output ([38M-4](../2026-06-05-sprint-38m-page-composition-fidelity/)) |
| **Harness + tests** | `EV-38M-AFTER` proof ([38M-5](../2026-06-05-sprint-38m-page-composition-fidelity/)) |

**Touch surfaces (expected):**

- `lib/page-gam-materials-preserve.js` (extend/harden)  
- `app.js` — `applyPedagogicCognitionSemanticsToComposedPage` / compose path only  
- Design Page pack contracts (L4) — **only if 38M-1 identifies prompt gap**  
- Harness: fork from `ev-38l-inflation-pipeline-capture-once.mjs` → `ev-38m-*`  
- Tests: page fidelity validators  

**Hold:** No renderer CSS/styling redesign. A3 sequencing prefers page JSON ordering and compose merge over `app.js` render style changes.

---

## Core goals

| ID | Goal | Phases |
|----|------|--------|
| **F1** | Quantify GAM→page→render fidelity gap per function (A3, A4) | 38M-1 |
| **F2** | Define preservation model — when GAM wins, anti-synopsis rules, validators | 38M-2 |
| **F3** | A4 Evaluate body parity — worked judgement, guided table, scenario, transfer | 38M-3 |
| **F4** | A3 Analyse sequencing — worked pass → guided table → verification order | 38M-4 |
| **F5** | Proof run `EV-38M-AFTER` with hard fidelity gates | 38M-5 |
| **F6** | Evidence-backed closure | 38M-6 |

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Schema expansion | Per 38-K/38-L hold |
| ACM redesign | 38G-2 frozen |
| Renderer styling redesign | CSS/visual overhaul out of scope |
| New workflow steps | Same pipeline |
| Rewriting 38-L §5/§6 depth rules | Unless 38M-1 finds L4-only fix insufficient |
| GAM regeneration overhaul | Focus is **compose fidelity**, not re-authoring GAM |
| Full 38I-4 episode prose length | Fidelity parity with GAM first |

---

## Implementation permissions by phase

| Phase | Pack / code changes | Notes |
|-------|---------------------|--------|
| **38M-1** | **None** | Analysis only — baseline fidelity matrix |
| **38M-2** | **Design doc**; optional spec stubs | Preservation model — no production edits until doc approved |
| **38M-3** | **Code + tests** | A4 fidelity implementation |
| **38M-4** | **Code + tests** | A3 sequencing — compose/page JSON focus |
| **38M-5** | **Harness / artefacts** | `EV-38M-AFTER-*` |
| **38M-6** | **Docs only** | Closure |

---

## Phases

### 38M-1 — Baseline page fidelity analysis

| Field | Content |
|-------|---------|
| **Purpose** | Measure GAM vs page vs render per instructional function on `EV-38L-AFTER`; confirm loss stage; define parity thresholds |
| **Deliverable** | `observations/38M-1-baseline-page-fidelity-analysis.md` |
| **Rule** | **No implementation** |
| **Status** | **NEXT** |
| **Inputs** | `EV-38L-AFTER-{gam,design-page}*` · loss trace · preserve fix doc |

---

### 38M-2 — Page composition preservation model

| Field | Content |
|-------|---------|
| **Purpose** | Specify merge policy, field-key mapping, synopsis detection, validator contracts, harness gates |
| **Deliverable** | `observations/38M-2-page-composition-preservation-model.md` |
| **Depends on** | 38M-1 |
| **Builds on** | `page-gam-materials-preserve.js` · LD-MATERIALS-COPY |

---

### 38M-3 — A4 Evaluate fidelity implementation

| Field | Content |
|-------|---------|
| **Purpose** | Implement A4 capstone parity — scenario, criteria, worked judgement, guided judgement table, transfer, independent template |
| **Deliverable** | `observations/38M-3-a4-evaluate-fidelity-implementation.md` |
| **Depends on** | 38M-2 |
| **Success checks** | No synopsis replacement; worked/guided lengths ≈ GAM |

---

### 38M-4 — A3 Analyse sequencing fidelity

| Field | Content |
|-------|---------|
| **Purpose** | Restore pedagogical order: worked analytic pass → analysis table → scenario → verification |
| **Deliverable** | `observations/38M-4-a3-analyse-sequencing-fidelity.md` |
| **Depends on** | 38M-2 |
| **Constraint** | No renderer CSS redesign — page JSON / compose ordering first |

---

### 38M-5 — Inflation proof run

| Field | Content |
|-------|---------|
| **Purpose** | Capture `EV-38M-AFTER-*`; compare vs `EV-38L-AFTER`, 38I-4 A4 |
| **Deliverable** | `observations/38M-5-inflation-proof-run.md` · `artefacts/EV-38M-AFTER-*` |
| **Depends on** | 38M-3, 38M-4 |
| **Harness** | `artefacts/ev-38m-inflation-pipeline-capture-once.mjs` (to be created in 38M-5) |

---

### 38M-6 — Closure

| Field | Content |
|-------|---------|
| **Purpose** | Evidence-backed closure; residual gaps; forward plan |
| **Deliverable** | `observations/38M-6-sprint-closure.md` |
| **Depends on** | 38M-5 |

---

## Phase dependency graph

```text
38M-1 Baseline fidelity analysis
    → 38M-2 Preservation model
        → 38M-3 A4 Evaluate fidelity
        → 38M-4 A3 Analyse sequencing
            → 38M-5 Proof run (EV-38M-AFTER)
                → 38M-6 Closure
```

(38M-3 and 38M-4 may proceed in parallel after 38M-2.)

---

## Success criterion (`EV-38M-AFTER`)

| Requirement | Measurement |
|-------------|-------------|
| A4 worked judgement page length **≈** GAM | ≥90% char parity vs upstream GAM material for M14 |
| A4 guided judgement page length **≈** GAM | ≥90% char parity vs upstream GAM material for M15 |
| Transfer prompts survive intact | Full GAM transfer body on page; no shortened stub |
| No synopsis replacement | Validator pass — no placeholder-only bodies on A4 capstone fields |
| Rendered page reflects page JSON | Spot-check `buildUtilityStructuredHtmlForTest` for A4 weak/strong exemplars and Strategy A–E |

**Comparator baselines:** `EV-38L-AFTER-*` (pre-fidelity proof) · [38I-4 A4](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

---

## Hold conditions

| Hold | Source |
|------|--------|
| 38-L §5/§6 gains | Do not weaken IFP/GAM-PRES |
| 38-L architecture conclusion | No schema/ACM/workflow redesign |
| 38H table/scenario fidelity | LD-TABLE-FIDELITY |
| Anti-spoiler | GAM-WB-06b |
| Renderer styling | No CSS overhaul — 38M-4 sequencing via compose/page JSON |
| Frozen comparators | `EV-38L-AFTER-*` · `EV-38J-AFTER-*` |
| Harness path | 38L inflation harness lineage — not 38H DLA path |

---

## References

- [38L-6 closure](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md)  
- [38L loss trace](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md)  
- [38L page preserve](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-page-preservation-and-json-validity-fix.md)  
- [38I-4 A4](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)  
- [38J Design Page contract](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md) (L4 reference)

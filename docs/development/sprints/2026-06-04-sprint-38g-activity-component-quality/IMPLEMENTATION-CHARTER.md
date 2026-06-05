# Sprint 38-G — Implementation charter (Activity Component Quality)

**Date:** 2026-06-04  
**Status:** **CLOSED** (2026-06-05) — [38G-6](observations/38G-6-sprint-closure-and-retrospective.md)  
**Predecessor:** [Sprint 38-F](../2026-06-04-sprint-38f-workbook-contract-refinement/) (**CLOSED** — [38F-5](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-5-final-evaluation-and-sprint-closure.md), [38F-8](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md))

---

## Mission

Improve **workbook quality** by strengthening the **pedagogical composition of activities**, especially:

- **Teaching preambles** before learner action  
- **Learner guidance** — complete, scaffolded “what to do”  
- **Scenario richness** — analysable cases, not label lists  
- **Workload realism** — credible `duration_minutes`  
- **Self-check / verification beats** — explicit R3 episodes  
- **Activity coherence** — coached session arc, not assembled blocks  

**Supersedes prior label:** “Retrieval density refinement” — retrieval is addressed **through** verification beats and guidance, not genre checklist alone.

**Primary success condition:**

> **Professional self-study workbook PASS** on Inflation anchor ([38F-8 criteria](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md) + [38C-1 §5.1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) + **Preservation PASS**

**Hold condition (38-F gains):**

> **V-01**, **V-05**, 38E-8/9 material types still manifest; **no** preservation regression

---

## Programme question

> Can pack-level **activity component** obligations (preamble, guidance, scenario depth, timings, self-check, non-spoiler consolidation) produce a **coached** Inflation workbook on the existing pipeline while **retaining** 38-F structural contract gains?

---

## Inherited from 38-F

### Proven

| Item | Status |
|------|--------|
| Workbook contracts influence outputs | **Yes** |
| V-01 (table family) | **Fixed** on `EV-38F-AFTER` |
| V-05 (`scenario` Material) | **Fixed** |
| worked_example / sample_output / consolidation_summary | **Retained** |
| Preservation architecture | **Stable** (V-13 PASS) |
| Design Page primary cause | **No** |
| Renderer primary cause | **No** |

### Remaining (38G addresses)

- Assembled-not-authored feel · insufficient teaching before practice · weak preambles · thin tasks · unrealistic timings · shallow scenarios · weak self-checks · spoiler consolidation · compressed 3-activity arc

Source: [38F-8](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md)

---

## Preconditions

| Sprint | Assumed true |
|--------|----------------|
| **38-C / 38-D** | Pedagogy + validation model ([38C-1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md), [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)) |
| **38-E** | Full workbook contracts in pack §5/§6 |
| **38-F** | V-01/V-05 refinement + `EV-38F-AFTER` diagnosis |
| **38-B** | Preservation modules — **monitor only** (V-13) |

**Primary baseline page:** [EV-38F-AFTER-design-page.json](../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/EV-38F-AFTER-design-page.json) ([38F-8](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md))

**Comparator:** [EV-38E10-AFTER-design-page.json](../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E10-AFTER-design-page.json) (preambles, checklist, 4-activity arc)

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Design Page investigation | [38F-8 §8](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md) — not primary |
| Renderer / layout sprint | Table column UX out of scope unless charter amended |
| Preservation architecture reopening | V-13 regression only |
| Re-litigating **V-01** table family | **Hold** 38F-2 DLA-WB-06a / GAM-WB-38F-01 |
| Re-litigating **V-05** scenario Material | **Hold** 38F-2 DLA-WB-18 / GAM-WB-10 |
| `app.js` changes | Forbidden unless 38G-1 documents need + charter amendment |
| Sprint 39 reasoning cues | Separate programme |
| Stripping 38E-8/9 or 38F-2 rows | Forbidden without charter amendment |

---

## Implementation permissions by phase

| Phase | Code / prompt changes | Notes |
|-------|----------------------|--------|
| **38G-1** | **None** | Analysis only — baseline [38F-8](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md) page |
| **38G-2** | **None** | Component model — docs only |
| **38G-3** | **`domain-learning-design-step-patterns.md` §5 + §6** | Activity quality clauses; **retain** 38F/38E structural rows |
| **38G-4** | **Tests/checks** tied to new clauses + V-13 | Extend `workbook-contract-prompt-surface.test.js` pattern |
| **38G-5** | **Artefacts** under sprint `artefacts/` | `EV-38G-AFTER-*`; quality review observation |
| **38G-6** | **Docs only** | Closure |
| **`app.js`** | **Forbidden** unless 38G-1 proves need + charter amendment | Default: pack-only |

---

## Phases

### 38G-1 — First-glance workbook quality analysis

| Field | Content |
|-------|---------|
| **Purpose** | Formalise [38F-8](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md) findings into 38G gap list; confirm “teaches enough” bar; activity-level issue register |
| **Primary artefact** | [EV-38F-AFTER-design-page.json](../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/EV-38F-AFTER-design-page.json) |
| **Deliverable** | `observations/38G-1-first-glance-workbook-quality-analysis.md` |
| **Permission** | Analysis only |
| **Success criteria** | First-glance FAIL/PASS explicit; gap list drives 38G-2; no pack edits |
| **Status** | **COMPLETE** — [38G-1](observations/38G-1-first-glance-workbook-quality-analysis.md) |

---

### 38G-2 — Activity component model

| Field | Content |
|-------|---------|
| **Purpose** | Define normative components: **preamble**, **guidance**, **examples**, **practice**, **self-check**, **expected output** — mapped to [38C-1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) and DLA/GAM fields |
| **Deliverable** | `observations/38G-2-activity-component-model.md` |
| **Inputs** | 38G-1; [38F-7](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-7-retrieval-definition-and-page-review-setup.md) R3 function-first |
| **Permission** | Docs only |
| **Success criteria** | Reviewer can score an activity against component checklist; pack clause targets identified |
| **Status** | **COMPLETE** — [38G-2](observations/38G-2-activity-component-model.md) |

**Depends on:** 38G-1

---

### 38G-3 — DLA/GAM implementation

| Field | Content |
|-------|---------|
| **Purpose** | Encode 38G-2 in pack **§5 DLA** and **§6 GAM** — preambles, rich `learner_task`, scenario depth, duration realism, checklist/prompt_set, empty consolidation template |
| **Deliverable** | `observations/38G-3-dla-gam-implementation.md` + pack diffs |
| **Permission** | `domain-learning-design-step-patterns.md` **§5 + §6 only** |
| **Success criteria** | Obligations traceable in pack; 38F-2 + 38E-8/9 rows **unchanged in intent** |
| **Status** | **COMPLETE** — [38G-3](observations/38G-3-dla-gam-implementation.md) |

**Depends on:** 38G-2

---

### 38G-4 — Regression + preservation review

| Field | Content |
|-------|---------|
| **Purpose** | Prompt-surface tests; confirm V-01/V-05/38E-8/9 clauses present; V-13 stack untouched |
| **Deliverable** | `observations/38G-4-regression-and-preservation-review.md` |
| **Permission** | Tests/checks only |
| **Success criteria** | **READY** for 38G-5 pipeline |
| **Status** | **COMPLETE** — [38G-4](observations/38G-4-regression-and-preservation-review.md) |

**Depends on:** 38G-3

---

### 38G-5 — Inflation rerun and quality review

| Field | Content |
|-------|---------|
| **Purpose** | Capture `EV-38G-AFTER`; score [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) + **professional workbook** bar; compare 38F / 38E10 / 38G |
| **Deliverable** | `observations/38G-5-inflation-rerun-quality-review.md` + `artefacts/EV-38G-AFTER-*` |
| **Permission** | Artefacts + observation only |
| **Success criteria** | Dual verdicts: quality + preservation; four-way comparison |
| **Status** | **COMPLETE** — [38G-5 ACM trace](observations/38G-5-acm-realisation-trace.md) + [EV-38G-AFTER artefacts](artefacts/) |

**Depends on:** 38G-3, 38G-4

---

### 38G-6 — Sprint closure

| Field | Content |
|-------|---------|
| **Purpose** | Close 38-G; hypothesis judgement; programme recommendation |
| **Deliverable** | `observations/38G-6-sprint-closure.md` |
| **Permission** | Docs only |
| **Status** | **COMPLETE** — [38G-6](observations/38G-6-sprint-closure-and-retrospective.md) |

**Depends on:** 38G-5

**Sprint verdict:** **SIGNIFICANT SUCCESS**

---

## Phase dependency graph

```text
38G-1 First-glance quality analysis (38F-8 page)
    → 38G-2 Activity component model
        → 38G-3 DLA/GAM pack implementation (§5 + §6)
            → 38G-4 Regression + preservation
                → 38G-5 Inflation rerun + quality review
                    → 38G-6 Closure
```

---

## Success criteria (sprint exit)

| Criterion | Measure |
|-----------|---------|
| Quality gaps specified | 38G-1 + 38G-2 complete |
| Pack updated | 38G-3 §5/§6 |
| Regression | 38G-4; V-13 unchanged in architecture |
| Inflation evaluated | `EV-38G-AFTER` |
| **Primary** | Professional workbook **PASS** on anchor |
| **Hold** | V-01/V-05 + 38E-8/9 types + **Preservation PASS** |
| Comparators preserved | Do not overwrite EV-01 … EV-38F |

---

## References

- [README.md](README.md)
- [HANDOVER.md](HANDOVER.md)
- [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md)
- [38F HANDOVER](../2026-06-04-sprint-38f-workbook-contract-refinement/HANDOVER.md)

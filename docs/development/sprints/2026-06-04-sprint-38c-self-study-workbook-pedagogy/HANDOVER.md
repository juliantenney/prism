# Handover — Sprint 38-B → Sprint 38-C

**Date:** 2026-06-04  
**From:** [Sprint 38-B](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/)  
**To:** [Sprint 38-C](README.md) — Self-Study Workbook Pedagogy

---

## What Sprint 38-B proved

| Outcome | Evidence |
|---------|----------|
| **Architecture stable** | Shared LD modules + compose contract; Wave 1–3 complete |
| **Preservation stable** | Inflation B4 gate PASS on committed artefacts; GAM→DP tables verbatim |
| **Ownership model works** | GAM authors materials; DLA specs; Design Page composes read-only |
| **Governance established** | [38B-7](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-7-governance-and-maintenance.md), module lifecycle |
| **Prompt footprint reduced** | Four-step sum **152,782 → 71,960** (−52.9%) |
| **B4 programme** | **MONITORING** — historical malformed tables not reproduced on EV captures |
| **Tests** | **730** passing at Wave 3 exit |

38-B was a **prompt architecture and materials-fidelity** sprint. It succeeded on its charter.

---

## What Sprint 38-C will investigate

**Learner product quality** for `page_profile: learner` — self-study **workbook** experience, not syntax preservation alone.

| Pedagogical function | 38-C interest |
|----------------------|---------------|
| Explanatory teaching | Prose that connects ideas between activities |
| Modelling | Expert reasoning made visible before practice |
| Worked examples | Stepped solutions with partial completion |
| Guided practice | Structured attempts with criteria |
| Faded support | Scaffolding reduced across sequence |
| Misconceptions | Common errors surfaced for self-correction |
| Interpretation guidance | How to read tables, data, and claims |
| Retrieval opportunities | Recall, self-check, low-stakes quiz |
| Synthesis opportunities | Integrative tasks (e.g. personal plan) |
| Consolidation | Summary, reflection, “what to remember” |
| Transfer | Application to learner’s own context |
| Evaluative judgement | Rubrics, exemplars, ranking with justification |

Phases: [PLANNING-CHARTER.md](PLANNING-CHARTER.md) (38C-1 … 38C-5).

---

## Hypotheses (explicit)

### Rejected for 38-C primary track

> **“Design Page is stripping content.”**

**Why rejected:** [38C richness review](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-design-page-richness-review.md) — EV-01 `materials.*` matches GAM; compose contract preserve intent aligned.

### Accepted working hypothesis

> **“The workflow is generating the wrong instructional genre for self-study.”**

**Why accepted:** [38C self-study quality review](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-self-study-resource-quality-review.md) — Inflation output reads as **activity sheet + reference notes**; GAM same-run authored **tables only**; missing scenarios, cards, worked examples, consolidation; **125 min** labelled duration vs **60-minute** product question.

---

## Artefacts to reuse

| Asset | Path |
|-------|------|
| Design Page JSON | [ev-38b4-01-design-page.json](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-design-page.json) |
| GAM text (same run) | [ev-38b4-01-pipeline-gam.txt](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-pipeline-gam.txt) |
| Rich GAM comparator | [ev-38b4-03-inflation-gam-live.txt](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-inflation-gam-live.txt) |
| Golden workshop page | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` |

Use directly for execution-charter evidence; optional copy into [artefacts/](artefacts/).

---

## Out of scope for 38-C planning

- Prompt-size reduction
- New shared LD modules (unless a later execution phase charters them for **workbook genre**)
- Automated regression harness expansion
- Sprint 39 reasoning cues (remain separately gated)

---

## Planning closure (2026-06-04)

Sprint **38-C** is **CLOSED**. Observations **38C-1 … 38C-6** are **COMPLETE**.

| Outcome | Document |
|---------|----------|
| Full synthesis + execution recommendation | [38C-6](observations/38C-6-planning-synthesis-and-execution-recommendation.md) |
| Learner experience target | [38C-5](observations/38C-5-workbook-experience-rendering.md) |

**Recommended execution:** **Sprint 38-D — Workbook Authoring Contracts** ([38C-6 §7](observations/38C-6-planning-synthesis-and-execution-recommendation.md)).

## Suggested next chat

1. Charter **Sprint 38-D** from [38C-6 §7](observations/38C-6-planning-synthesis-and-execution-recommendation.md) — DLA/GAM contracts, canonical workbook fixture, genre-mix validation, Inflation before/after.  
2. Keep **38-B preserve stack**; do not reopen prompt-size as workbook fix.  
3. Defer composition/renderer UX to **38-E** (or 38-D phase 2) until multi-genre GAM output exists.

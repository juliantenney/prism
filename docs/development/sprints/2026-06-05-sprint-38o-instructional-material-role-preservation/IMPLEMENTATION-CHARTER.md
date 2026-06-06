# Sprint 38-O — Implementation charter (Instructional Material Role Preservation)

**Date:** 2026-06-05  
**Status:** **CLOSED** — [38O-5](observations/38O-5-sprint-closure.md) · **SUCCESS**  
**Predecessor:** [Sprint 38-N](../2026-06-05-sprint-38n-page-fidelity-hardening/) (**CLOSED** — [38N-5](../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-5-sprint-closure.md) · **SUCCESS**)

---

## Mission

**Instructional Material Role Preservation (discovery)** — determine whether pedagogically important instructional material roles generated upstream survive into the composed page model and learner render.

**Not:** implementation sprint; 38M/38N reopen; schema/ACM/workflow redesign; prompt changes; renderer changes; validator changes; general instructional quality review.

---

## Context (post-38M/38N)

Sprint 38-M closed the L4 **body fidelity** cliff. Sprint 38-N hardened proof machinery. Current state:

| Guarantee | Status |
|-----------|--------|
| GAM→Page body preservation (post-merge) | Enforced |
| Synopsis replacement | Eliminated (Tier-A) |
| Table-shell collapse | Eliminated (Tier-A) |
| A3 render ordering | Hardened |
| Validator/schema false negatives | Resolved |
| `EV-38N-AFTER` `proofOk` | **true** |
| Regression tests | **21/21 pass** |

**New follow-on observation (38N-5):** Manual inflation testing suggests a **role preservation** gap distinct from body ratio — page artefacts may retain templates, tables, and checklists while omitting or weakening worked examples, explanatory structures, and reasoning supports.

---

## Core question

> When GAM contains instructional teaching roles, do those roles survive as learner-facing page materials, or are they reduced to readings, worksheets, templates, and checklists?

---

## Primary roles to trace

| Role family | GAM signals (indicative) |
|-------------|--------------------------|
| Worked examples | `worked_example` / worked thinking |
| Worked calculations | `worked_example` + calculation purpose |
| Model answers | `sample_output` / model answer reference |
| Sample outputs | `sample_output` |
| Explanatory guidance | `text` / concept elucidation, criteria exposition |
| Reasoning supports | `modelling_note`, worked judgement |
| Scaffold hints | activity-row `scaffold_hint_sequence` |
| Misconceptions / checks | misconception prompts, verification |
| Transfer prompts | `transfer_prompt` |
| Evaluative judgement supports | worked judgement, guided judgement, templates |

---

## Core goals

| ID | Goal | Phase |
|----|------|-------|
| **O1** | Baseline role-survival trace GAM → Page → Render | 38O-1 |
| **O2** | Role taxonomy and page-key mapping analysis | 38O-2 |
| **O3** | Failure-mode classification (lost / compressed / filtered / renamed / merged / absent) | 38O-3 |
| **O4** | Preservation options and recommendation (design only) | 38O-4 |
| **O5** | Evidence-backed closure | 38O-5 |

---

## Implementation permissions by phase

| Phase | Code / pack / prompt changes | Notes |
|-------|------------------------------|-------|
| **38O-1** | **None** | Analysis only — role-survival matrix |
| **38O-2** | **None** | Taxonomy and mapping analysis |
| **38O-3** | **None** | Failure-mode classification |
| **38O-4** | **Design doc only** | Options/recommendation — no production edits until charter approved |
| **38O-5** | **Docs only** | Closure |

**Hold:** No production code, prompts, renderer logic, or validator changes in any 38O phase unless a future sprint is chartered for implementation.

---

## Phases

### 38O-1 — Baseline role-survival trace

| Field | Content |
|-------|---------|
| **Purpose** | Trace material roles GAM → Page (raw + merged) → Render on recent inflation runs; build role-survival matrix; distinguish body fidelity from role fidelity |
| **Deliverable** | `observations/38O-1-baseline-role-survival-trace.md` |
| **Rule** | **No implementation** |
| **Status** | **Complete** |
| **Inputs** | `EV-38M-AFTER-*` · `EV-38N-AFTER-*` · 38M/38N closure docs |

---

### 38O-2 — Role taxonomy and page-mapping analysis

| Field | Content |
|-------|---------|
| **Purpose** | Formalise instructional role taxonomy; map GAM type/purpose → page keys → render headings |
| **Deliverable** | `observations/38O-2-role-taxonomy-page-mapping-analysis.md` |
| **Depends on** | 38O-1 |
| **Status** | **Complete** |

---

### 38O-3 — Failure-mode classification

| Field | Content |
|-------|---------|
| **Purpose** | Classify observed losses: lost, compressed, filtered, renamed, merged into weaker roles, never represented |
| **Deliverable** | `observations/38O-3-failure-mode-classification.md` |
| **Depends on** | 38O-1, 38O-2 |
| **Status** | **Complete** |

---

### 38O-4 — Preservation options / recommendation

| Field | Content |
|-------|---------|
| **Purpose** | Design-only preservation options; recommend disposition for a potential implementation sprint |
| **Deliverable** | `observations/38O-4-preservation-options-recommendation.md` |
| **Depends on** | 38O-3 |
| **Status** | **Complete** |

---

### 38O-5 — Closure

| Field | Content |
|-------|---------|
| **Purpose** | Sprint closure record with discovery verdict |
| **Deliverable** | `observations/38O-5-sprint-closure.md` |
| **Depends on** | 38O-4 |
| **Status** | **Complete** |

---

## Sprint closure

| Field | Content |
|-------|---------|
| **Verdict** | **SUCCESS** |
| **Closure record** | [38O-5-sprint-closure.md](observations/38O-5-sprint-closure.md) |
| **Future disposition** | Charter implementation sprint for role fidelity (F1 preferred) → [Sprint 38-P](../../2026-06-05-sprint-38p-instructional-role-fidelity/) |

---

## Success criteria (discovery sprint)

| Criterion | Target |
|-----------|--------|
| Role-survival matrix | Evidence-backed across A1–A4 on ≥1 inflation run |
| Body vs role fidelity | Explicitly distinguished |
| Failure modes | Classified with hypotheses for 38O-2+ |
| Scope | No 38M/38N reopen; no implementation |
| Closure | Discovery verdict with recommendation |

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Reopen 38M body preservation | Closed — SUCCESS |
| Reopen 38N hardening | Closed — SUCCESS |
| Fix role preservation | Discovery only in 38O |
| Prompt / renderer / validator edits | Out of scope |
| General instructional quality | Role survival focus only |
| Schema / ACM / workflow redesign | Hold |

---

## Frozen baselines

- `EV-38M-AFTER-*` — fresh inflation capture (pre/post merge)  
- `EV-38N-AFTER-*` — post-38N replay  
- [38I-4 A4 episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) — target-state reference

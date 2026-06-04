# Slice 38D-2 — GAM workbook genre contract

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md) § 38D-2  
**Authority:** [38D-1](38D-1-dla-workbook-contract.md) · [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) · [38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) · [38C-4](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) · [38C-6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md)  
**Evidence:** [EV-01-G](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-pipeline-gam.txt) · [EV-03-G](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-inflation-gam-live.txt)  
**Out of scope:** DLA spec ([38D-1](38D-1-dla-workbook-contract.md)) · pack/runtime · implementation

---

## 1. Purpose

Convert [38C-4](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) genre catalogue into an **executable GAM contract** — testable clauses for **organised GAM text** / `activity_materials` when [38D-1](38D-1-dla-workbook-contract.md) workbook obligations apply.

**Success for this slice:** A reviewer inspecting **GAM output only** can score **GAM-WB-** clauses and determine **contract PASS/FAIL** without Design Page or rendered HTML.

---

## 2. Inputs and authority

| Source | Role |
|--------|------|
| [38D-1](38D-1-dla-workbook-contract.md) | DLA triggers; §9 handoff questions answered here |
| [38C-4 §4–9](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) | Genre bodies, table rules, AP-01–12 |
| [38C-2 §7](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) | EV-01-G vs EV-03-G calibration |
| [38C-1 §3–5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Workbook functions (reference only — not redefined) |
| `LD-MATERIALS-COPY` · `LD-TABLE-FIDELITY` | Preserve/fidelity — GAM still **authors** bodies |

**Assumptions:**

1. GAM **must realise every** DLA `required_materials` entry ([38C-4 §3.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)).  
2. Workbook **session** obligations apply when DLA contract is in scope — even if a single DLA entry is missing, **genre-mix** rules still judge GAM output for workbook briefs.  
3. Recognition token: `Material: * (type)` in organised text, or JSON `activity_materials[].type`.

---

## 3. Applicability

| Signal | Requirement |
|--------|-------------|
| **Delivery** | `self_directed` workbook run |
| **Downstream profile** | `page_profile: learner` |
| **Intent** | [DLA-WB-01](38D-1-dla-workbook-contract.md) Pass or equivalent brief flag |
| **Upstream** | DLA `required_materials[]` present per activity |

**N/A:** Workshop-only captures (use EV-03 as comparator, not contract PASS bar for self-study workbook).

**Conditional clauses:** Apply when DLA lists matching `type` **or** when [38D-1](38D-1-dla-workbook-contract.md) session-level requirement implies genre (e.g. consolidation) — if DLA silent, clause may be **N/A** but **GAM-WB-MIX-01** still applies on workbook briefs.

---

## 4. Contract model

| Level | Meaning |
|-------|---------|
| **Mandatory** | Must Pass for **GAM contract PASS** |
| **Recommended** | Fail → PASS with warnings |
| **Optional** | Enhancement; no fail if omitted when DLA silent |
| **Prohibited** | Must not appear; presence → **FAIL** |

**GAM contract PASS:** All **Mandatory** Pass (or N/A with documented DLA gap); no **Prohibited** triggered.

**GAM contract FAIL:** Any **Mandatory** Fail, or **Prohibited** triggered.

**Note:** GAM may **FAIL** while DLA also **FAIL** (EV-01). GAM **PASS** requires DLA **PASS** first for full pipeline workbook compliance.

---

## 5. Core principles

### 5.1 Preserve downstream cannot invent genres

> **Design Page cannot compose workbook genres that GAM never authored.**

Evidence: [38C-2 §7.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) — EV-01-G and EV-01-P share **four** table keys only; DP gap **0**, learner gap **100%** of missing genres.

**Contract implication:** GAM is the **authoring ceiling** for `materials.*` bodies. Failures at GAM cannot be remedied by Design Page or renderer for that run.

### 5.2 Table-only output is invalid for workbooks

> **Table-only workbook output is contractually invalid.**

Evidence: [38C-4 §5.5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) · [38C-2 GAP-05](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) · **GAM-WB-MIX-01** below.

---

## 6. Genre contract clauses

*Unless noted, clauses are **Mandatory when triggered** by DLA [38D-1](38D-1-dla-workbook-contract.md) or workbook session rules.*

### GAM-WB-00 — Realise every DLA material entry

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Trigger** | Each `required_materials` row on each activity |
| **Obligation** | One authored `Material:` / `activity_materials` body per entry; `type` matches DLA; body satisfies `purpose` + `specification` |
| **Minimum body** | Non-empty `Content` / material body — no placeholder label ([38C-4 AP-11](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **Pass** | 100% DLA entries realised with substantive bodies |
| **Fail** | Missing entry; “Set of scenarios describing…” without cases; empty block |
| **Functions** | All |
| **Source** | 38C-4 §3.1 · 38C-4 §8.4 #6 · 38D-1 §9 G7 |

---

### GAM-WB-01 — Explanatory teaching material (`text` / `exposition`)

| Field | Content |
|-------|---------|
| **Trigger** | [DLA-WB-07](38D-1-dla-workbook-contract.md) Pass — exposition `required_materials` or session teaching requirement |
| **Obligation** | Author `text` / exposition block: **≥120 words** linking **≥2** ideas outside table cells |
| **Minimum body** | Continuous prose paragraph(s); not only table definitions |
| **Pass** | Exposition material present meeting word/link threshold |
| **Fail** | No exposition block; teaching only in table cells or DP intro ([AP-12](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **N/A** | DLA-WB-07 Fail/N/A — record DLA gap; if workbook brief, **GAM-WB-MIX-01** may still Fail |
| **Functions** | Explanatory teaching ([38C-1 §3.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Source** | 38C-4 §4.17 · 38C-2 GAP-01 |

---

### GAM-WB-02 — Worked examples (`sample_output` / stepped `template` / `worked_example`)

| Field | Content |
|-------|---------|
| **Trigger** | [DLA-WB-08](38D-1-dla-workbook-contract.md) — `sample_output` or stepped `template` |
| **Obligation** | Ordered **steps** with **intermediate results**; expert path distinct from learner blank worksheet |
| **Minimum body** | ≥3 numbered steps OR staged headings with visible working; method named |
| **Pass** | Example block present; does not pre-complete learner’s parallel blanks |
| **Fail** | Absent; pre-filled learner sheet labelled “example”; answer key only ([AP-05](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **Functions** | Worked examples ([38C-1 §3.2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Source** | 38C-4 §4.2 · 38C-4 §4.8 · 38C-2 §5.3 |

---

### GAM-WB-03 — Modelling notes (`modelling_note` / `reasoning_walkthrough`)

| Field | Content |
|-------|---------|
| **Level** | **Recommended** ( **Mandatory** if DLA-WB-08 N/A and DLA-WB-09 required ) |
| **Trigger** | [DLA-WB-09](38D-1-dla-workbook-contract.md); `reasoning_orientation` + modelling spec |
| **Obligation** | Think-aloud or decision criteria: “First check… because…” on one worked decision |
| **Minimum body** | ≥60 words of process prose OR annotated criteria list (≥3 bullets) |
| **Pass** | Modelling body in materials — not only JSON cognition field |
| **Fail** | Absent when DLA required modelling path; numbers-only example |
| **Functions** | Modelling ([38C-1 §3.3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Source** | 38C-4 §4.3 · 38C-2 §5.4 |

---

### GAM-WB-04 — Guided practice support

| Field | Content |
|-------|---------|
| **Trigger** | Any activity with practice `required_materials` + [DLA-WB-10](38D-1-dla-workbook-contract.md) |
| **Obligation** | Materials match task: blanks where learner calculates/classifies; support genres present (cards/scenario/template) per DLA |
| **Minimum body** | Learner-completion cells empty in practice columns; scenario/table alignment on same activity |
| **Pass** | Task completable from materials without inventing context |
| **Fail** | Reference-only table for practice task; pre-filled analysis rows learner should produce ([38C-4 §5.2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) EV-03 A3 hazard) |
| **Functions** | Guided practice ([38C-1 §3.4](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Source** | 38C-4 §4.1 · §4.7 · 38C-2 GAP-02 |

---

### GAM-WB-05 — Retrieval checks (`task_cards`, `prompt_set`, `checklist`, `retrieval_check`)

| Field | Content |
|-------|---------|
| **Trigger** | [DLA-WB-11](38D-1-dla-workbook-contract.md) — ≥2 activities |
| **Obligation** | **≥2 activities** each include ≥1 retrieval genre with **learner-check** opportunity |
| **Minimum body** | `task_cards`: ≥3 imperative cards; `prompt_set`: ≥2 numbered prompts with answer expectation; `checklist`: ≥4 checkable items tied to criteria; `retrieval_check`: question + check hint |
| **Pass** | Two+ activities meet minimums; checks correctness/completeness — not feelings only ([AP-07](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **Fail** | &lt;2 activities with retrieval genres; implicit “fill table” only; generic “did you finish?” ([AP-04](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **Functions** | Retrieval ([38C-1 §3.7](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Source** | 38C-4 §4.4–4.6 · §4.10 · 38C-2 GAP-04 |

---

### GAM-WB-06 — Consolidation summary (`consolidation_summary`)

| Field | Content |
|-------|---------|
| **Trigger** | [DLA-WB-12](38D-1-dla-workbook-contract.md) session consolidation requirement |
| **Obligation** | Session closure body: **what to remember** — not new teaching, not table reprint |
| **Minimum body** | **≥80 words** summarising **≥3** session ideas; may include 1–2 reflection questions |
| **Pass** | Dedicated consolidation material OR final-activity closure block meeting minimum |
| **Fail** | Absent; consolidation = four tables reposted ([AP-06](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) / [AP-08](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **Fail rule** | **`prompt_set` alone on capstone ≠ consolidation Pass** ([38C-4 §4.11](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) EV-03 partial) |
| **Functions** | Consolidation ([38C-1 §3.8](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Source** | 38C-4 §4.11 · 38C-2 GAP-03 |

---

### GAM-WB-07 — Synthesis support (capstone `template` / plan scaffold)

| Field | Content |
|-------|---------|
| **Trigger** | [DLA-WB-13](38D-1-dla-workbook-contract.md) capstone |
| **Obligation** | Integrative **plan/memo template** or scaffold — learner completes synthesis artefact |
| **Minimum body** | Template with labelled sections for integrative output (≥3 sections); not four full reference tables |
| **Pass** | Capstone primary material = synthesis scaffold + at most **one** optional lookup stub |
| **Fail** | Capstone materials = all prior `*_table` types re-authored (GAM-WB-20) |
| **Functions** | Synthesis ([38C-1 §3.9](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Source** | 38C-4 §4.7 · §5.4 · 38C-2 GAP-08 |

---

### GAM-WB-08 — Transfer prompts (`transfer_prompt`)

| Field | Content |
|-------|---------|
| **Level** | **Recommended** |
| **Trigger** | [DLA-WB-14](38D-1-dla-workbook-contract.md) |
| **Obligation** | “Your household / your context / your role” prompts with completion criteria |
| **Minimum body** | ≥2 transfer prompts, each requiring personal application |
| **Pass** | Transfer subsection on capstone or late activity |
| **Fail (warning)** | Only third-person scenarios through capstone |
| **Functions** | Transfer ([38C-1 §3.10](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Source** | 38C-4 §4.13 · 38C-2 §5.10 |

---

### GAM-WB-09 — Evaluative judgement (`rubric` / ranking materials)

| Field | Content |
|-------|---------|
| **Trigger** | [DLA-WB-15](38D-1-dla-workbook-contract.md); ranking/compare activity |
| **Obligation** | `rubric` or criteria list; ranking table **without** pre-filled learner judgement column |
| **Minimum body** | ≥3 criteria OR must/should bullets requiring justification |
| **Pass** | Criteria adjacent to rank task; effectiveness/rating cells **empty** for learner |
| **Fail** | Pre-filled ratings (EV-01 A4: 4,5,3,4) ([AP-10](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **N/A** | No ranking activity |
| **Functions** | Evaluative judgement ([38C-1 §3.11](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Source** | 38C-4 §4.14 · 38C-2 GAP-09 |

---

### GAM-WB-10 — Scenario bodies (`scenario`)

| Field | Content |
|-------|---------|
| **Trigger** | [DLA-WB-18](38D-1-dla-workbook-contract.md); DLA `type: scenario` |
| **Obligation** | ≥**2** named cases with **specific** figures/context (prices, household, period) |
| **Minimum body** | Case titles + ≥40 words narrative each; not label-only |
| **Pass** | Scenario block before dependent table/worksheet on same activity |
| **Fail** | Task cites scenarios, no `Material: scenario` ([AP-03](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)); placeholder label ([AP-11](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **Functions** | Guided practice, transfer context |
| **Source** | 38C-4 §4.1 · 38C-2 §5.5 A3 |

---

### GAM-WB-11 — Templates (`template`)

| Field | Content |
|-------|---------|
| **Trigger** | DLA `template` for practice or capstone |
| **Obligation** | **Blank** fields / empty cells for learner completion |
| **Minimum body** | `fields[]` or markdown blanks; section labels for learner input |
| **Pass** | Template distinct from fully worked reference table |
| **Fail** | All cells pre-filled; template duplicates reference table with answers |
| **Functions** | Guided practice, synthesis |
| **Source** | 38C-4 §4.7 |

---

### GAM-WB-12 — Sample outputs (`sample_output`)

| Field | Content |
|-------|---------|
| **Trigger** | DLA `sample_output` (worked example or quality exemplar) |
| **Obligation** | Annotated exemplar; if worked example path, satisfies **GAM-WB-02** |
| **Minimum body** | Full sample string with ≥2 quality features explained in prose |
| **Pass** | Sample ≠ learner’s exact blank task pre-answered |
| **Fail** | Empty; duplicates learner worksheet solution |
| **Functions** | Worked examples, evaluative judgement |
| **Source** | 38C-4 §4.8 |

---

### GAM-WB-13 — Checklists (`checklist`)

| Field | Content |
|-------|---------|
| **Trigger** | DLA `checklist` on activity |
| **Obligation** | Checkable items tied to `expected_output` / task criteria |
| **Minimum body** | ≥4 items in ≥1 section; observable checks |
| **Pass** | Checklist follows practice materials on same or prior activity |
| **Fail** | “Did you finish?” only; no link to task ([AP-04](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **Functions** | Retrieval, guided practice |
| **Source** | 38C-4 §4.6 |

---

### GAM-WB-14 — Rubrics (`rubric` / quality criteria)

| Field | Content |
|-------|---------|
| **Trigger** | DLA ranking/compare + [DLA-WB-15](38D-1-dla-workbook-contract.md) |
| **Obligation** | See **GAM-WB-09** — may be separate `rubric` material |
| **Minimum body** | 3–5 criteria with levels or must/should bullets |
| **Pass** | Rubric body present when judgement required |
| **Fail** | Rank task with table only and pre-filled scores |
| **Functions** | Evaluative judgement |
| **Source** | 38C-4 §4.14 |

---

### GAM-WB-15 — Misconception notes (`misconception_note`)

| Field | Content |
|-------|---------|
| **Level** | **Recommended** |
| **Trigger** | DLA learner-facing misconception spec |
| **Obligation** | “Common mistake: … Instead: …” callout |
| **Minimum body** | ≥30 words; learner-facing tone |
| **Pass** | Material callout — not facilitator-only `failure_mode` |
| **Fail (warning)** | Only JSON `failure_mode`, no material |
| **Functions** | Misconceptions ([38C-1 §3.6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Source** | 38C-4 §4.9 · 38C-2 §5.7 |

---

### GAM-WB-16 — Reference tables (`*_table` family)

| Field | Content |
|-------|---------|
| **Trigger** | DLA table types (`classification_table`, `comparison_table`, `analysis_table`, `impact_table`, …) |
| **Obligation** | Pipe markdown per `LD-TABLE-FIDELITY`; learner-work columns **empty** unless reference-only row |
| **Minimum body** | Valid headers; no comma-row pseudo-tables; judgement columns empty when learner ranks |
| **Pass** | Table supports paired non-table genre on same or adjacent activity |
| **Fail** | Pre-filled judgement; table-only session ([§7](#7-table-specific-contract)) |
| **Functions** | Reference, guided practice (partial teaching) |
| **Source** | 38C-4 §4.16 · §5 |

---

### GAM-WB-17 — Task cards (`task_cards`)

| Field | Content |
|-------|---------|
| **Trigger** | DLA `task_cards`; part of **GAM-WB-05** |
| **Obligation** | ≥3 solo-feasible imperative cards per spec |
| **Minimum body** | Domain `{ "text": "..." }` per card |
| **Pass** | Cards sequenced; no required group agreement ([AP-09](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **Fail** | Single blob; “Agree with your group” on solo workbook |
| **Functions** | Retrieval, guided practice, fading (early) |
| **Source** | 38C-4 §4.4 |

---

### GAM-WB-18 — Prompt sets (`prompt_set`)

| Field | Content |
|-------|---------|
| **Trigger** | DLA `prompt_set`; part of **GAM-WB-05** |
| **Obligation** | Numbered prompts with clear short-answer expectation |
| **Minimum body** | ≥2 prompts, each expecting 1–3 sentences |
| **Pass** | Prompts linked to materials above |
| **Fail** | Vague “discuss”; capstone prompts only with no summary → **not** WB-06 Pass |
| **Functions** | Retrieval, evaluative judgement (partial) |
| **Source** | 38C-4 §4.5 |

---

### GAM-WB-19 — Reflection prompts (`reflection_prompt`)

| Field | Content |
|-------|---------|
| **Level** | **Optional** |
| **Trigger** | DLA encourages reflection with consolidation |
| **Obligation** | 2–4 metacognitive prompts after practice |
| **Minimum body** | Open questions on understanding change |
| **Pass** | Paired with retrieval or consolidation — not sole retrieval |
| **Fail** | Reflection-only “retrieval” ([AP-07](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **Functions** | Consolidation (partial) |
| **Source** | 38C-4 §4.12 |

---

### GAM-WB-20 — Capstone anti-dump (prohibited pattern)

| Field | Content |
|-------|---------|
| **Level** | **Prohibited** |
| **Trigger** | Capstone / final activity on workbook |
| **Obligation** | Must **not** re-author all prior session `*_table` types as primary capstone materials |
| **Pass** | Capstone ≤1 lookup table + synthesis/transfer genres |
| **Fail** | A5-style four-table reprint ([AP-08](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) — **EV-01** |
| **Functions** | Fading, synthesis |
| **Source** | 38C-4 §5.4 · 38D-1 DLA-WB-16 · 38C-2 GAP-08 |

---

### GAM-WB-21 — No placeholder material labels

| Field | Content |
|-------|---------|
| **Level** | **Prohibited** |
| **Trigger** | Any material block |
| **Obligation** | Full body per `LD-MATERIALS-COPY` intent |
| **Pass** | Actionable content in every `Material:` block |
| **Fail** | “Set of scenarios describing inflation impacts…” without scenarios ([AP-11](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md)) |
| **Source** | 38C-4 §9 AP-11 |

---

## 7. Table-specific contract

### 7.1 Acceptable table usage

| Use | Requirement |
|-----|-------------|
| Comparison / classification worksheet | Learner columns **blank** |
| Reference data row | May be pre-filled |
| Numeric practice | Empty cells for learner calculations |
| Ranking / effectiveness | **Empty** rating column OR rubric + learner-generated rank |

### 7.2 Required companion genres

When an activity’s only GAM types are `*_table`, workbook contract requires **on same activity or session**:

| Companion | Minimum |
|-----------|---------|
| `scenario` | When task uses case language (GAM-WB-10) |
| `task_cards` or `prompt_set` or `checklist` | On **≥2** activities session-wide (GAM-WB-05) |
| `consolidation_summary` | Session end (GAM-WB-06) |
| `sample_output` / worked example | When [DLA-WB-08](38D-1-dla-workbook-contract.md) applies |

### 7.3 Prohibited table-only patterns

| ID | Pattern | GAM contract |
|----|---------|--------------|
| **AP-01** | **Table-only workbook** | Session has **only** `classification_table`, `comparison_table`, `analysis_table`, `impact_table` (or `*_table` family) — **GAM-WB-MIX-01 Fail** |
| **AP-02** | **Reference-dump capstone** | Capstone re-posts all prior tables — **GAM-WB-20 Fail** |
| **AP-03** | **Ranking table with judgement pre-filled** | Effectiveness/rating cells populated — **GAM-WB-09 / WB-16 Fail** |
| **AP-04** | **Scenario named but not authored** | Task/preamble scenarios; no `Material: scenario` — **GAM-WB-10 Fail** |

*Additional catalogue:* [38C-4 §9](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) AP-05–12 map to clauses above.

---

## 8. Genre-mix rules

| Rule ID | Contract rule | Fail when |
|---------|---------------|-----------|
| **GAM-WB-MIX-01** | **Tables alone are insufficient** for self-study workbook | Unique non-table `Material` type count = **0** across session |
| **GAM-WB-MIX-02** | **≥2 distinct type families** session-wide when any table used | Only one family (tables only) |
| **GAM-WB-MIX-03** | **Consolidation ≠ table** | Closure attempted only by reprinting tables or outcomes list |
| **GAM-WB-MIX-04** | **Worked example must contain worked content** | WB-02 triggered and steps absent |
| **GAM-WB-MIX-05** | **Retrieval = learner-check** | WB-05 triggered and only open reflection prompts |
| **GAM-WB-MIX-06** | **Early activity richer than capstone** | Capstone material count/types &gt; early practice (inverse fade) — **EV-01 A5** |

**Type family taxonomy (reviewer):**

| Family | Example tokens |
|--------|----------------|
| **Table** | `classification_table`, `comparison_table`, `analysis_table`, `impact_table` |
| **Narrative** | `scenario`, `text`, `exposition` |
| **Structured practice** | `task_cards`, `template`, `prompt_set` |
| **Closure / quality** | `consolidation_summary`, `checklist`, `rubric`, `sample_output` |

**EV-01:** 1 family (table only). **EV-03:** 4+ families.

---

## 9. EV-01 calibration (EV-01-G)

**Artefact:** [ev-38b4-01-pipeline-gam.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-pipeline-gam.txt) — 5 activities, **12** `Material:` lines, **4** types only.

| Clause / rule | Result | Evidence |
|---------------|:------:|----------|
| GAM-WB-00 | **Fail** | All listed entries are tables — DLA likely table-only; bodies present but genre wrong |
| GAM-WB-01 | **Fail** | No exposition material |
| GAM-WB-02 | **Fail** | No worked example |
| GAM-WB-03 | **Fail** | No modelling body |
| GAM-WB-04 | **Partial → Fail** | Tables present; A3 no scenario — practice misaligned |
| GAM-WB-05 | **Fail** | No cards/checklist/prompt_set |
| GAM-WB-06 | **Fail** | No consolidation_summary |
| GAM-WB-07 | **Fail** | A5 = four tables — not synthesis scaffold |
| GAM-WB-08 | **Fail** | No transfer_prompt material |
| GAM-WB-09 | **Fail** | A4 impact_table pre-filled ratings 4,5,3,4 |
| GAM-WB-10 | **Fail** | A3 scenarios in task, no scenario material |
| GAM-WB-11–14 | **N/A** | Types not authored |
| GAM-WB-15 | **Fail** | No misconception material |
| GAM-WB-16 | **Pass** | Tables syntactically authored (~1,360 words) |
| GAM-WB-17–18 | **Fail** | Absent |
| GAM-WB-19 | **N/A** | |
| GAM-WB-20 | **Fail** | A5 four-table dump |
| GAM-WB-21 | **Pass** | Table bodies substantive — not placeholder labels |
| GAM-WB-MIX-01 | **Fail** | **AP-01** — table-only |
| GAM-WB-MIX-02 | **Fail** | One family |
| GAM-WB-MIX-03 | **Fail** | No consolidation genre |
| GAM-WB-MIX-04–05 | **Fail** | Prerequisites absent |
| GAM-WB-MIX-06 | **Fail** | Capstone heaviest material |

### 9.1 Summary verdict

| Verdict | Detail |
|---------|--------|
| **GAM contract** | **FAIL** (expected) |
| **Primary cause** | **AP-01 table-only workbook** — consistent with [38C-2 §7.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) |
| **Preserve note** | Tables **valid** for B4 — separate from workbook contract |

---

## 10. EV-03 calibration (EV-03-G)

**Artefact:** [ev-38b4-03-inflation-gam-live.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-inflation-gam-live.txt) — **8** material types.

| Clause / rule | Result | Notes |
|---------------|:------:|-------|
| GAM-WB-MIX-01 | **Pass** | scenario, task_cards, prompt_set, checklist + tables |
| GAM-WB-MIX-02 | **Pass** | ≥2 families |
| GAM-WB-05 | **Pass** | A1 cards; A2 prompts + checklist |
| GAM-WB-10 | **Pass** | A1, A3, A4 scenarios with specifics |
| GAM-WB-01 | **Fail** | No dedicated exposition block |
| GAM-WB-02 | **Fail** | No worked example |
| GAM-WB-03 | **Fail** | No modelling note |
| GAM-WB-06 | **Partial** | A5 `prompt_set` only — not ≥80-word summary |
| GAM-WB-07 | **Partial** | Capstone prompts, not plan template |
| GAM-WB-09 | **Unknown** | A4 ranking — need cell-level review for pre-fill |
| GAM-WB-04 | **Partial** | A3 analysis_table rows pre-filled — workshop hazard |
| GAM-WB-20 | **Pass** | A5 not four-table dump |
| GAM-WB-17 | **Partial** | A1 Card 6 group wording — solo concern |

### 10.1 Comparator role

EV-03 shows GAM **can** satisfy **mix, scenario, retrieval** clauses when DLA specifies them — **not** full workbook PASS ([38C-2 §7.3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md): still missing exposition, worked example, consolidation_summary).

---

## 11. DLA → GAM traceability matrix

| DLA-WB clause | GAM-WB obligation(s) |
|---------------|----------------------|
| DLA-WB-01 Intent | *(GAM assumes DLA in scope)* — enables all session rules |
| DLA-WB-02 Outcomes | GAM-WB-00 — bodies align to mapped outcomes |
| DLA-WB-03 Duration | **N/A** — DLA owns minutes |
| DLA-WB-04 Solo | GAM-WB-17 — no group-required card text |
| DLA-WB-05 Fading | GAM-WB-MIX-06 · GAM-WB-20 |
| DLA-WB-06 Diversity | GAM-WB-MIX-01 · GAM-WB-MIX-02 |
| DLA-WB-07 Teaching | GAM-WB-01 |
| DLA-WB-08 Worked ex. | GAM-WB-02 · GAM-WB-12 |
| DLA-WB-09 Modelling | GAM-WB-03 |
| DLA-WB-10 Guided | GAM-WB-04 · GAM-WB-11 · GAM-WB-16 |
| DLA-WB-11 Retrieval | GAM-WB-05 · GAM-WB-13 · GAM-WB-17 · GAM-WB-18 |
| DLA-WB-12 Consolidation | GAM-WB-06 |
| DLA-WB-13 Synthesis | GAM-WB-07 |
| DLA-WB-14 Transfer | GAM-WB-08 |
| DLA-WB-15 Judgement | GAM-WB-09 · GAM-WB-14 · GAM-WB-16 |
| DLA-WB-16 Anti-dump | GAM-WB-20 |
| DLA-WB-17 No social | GAM-WB-17 (card/task bodies) |
| DLA-WB-18 Scenario | GAM-WB-10 |
| DLA-WB-19 Expected output | GAM-WB-00 · GAM-WB-13 (checklist alignment) |

**Coverage:** All [38D-1](38D-1-dla-workbook-contract.md) clauses have GAM mapping or explicit N/A.

---

## 12. GAM reviewer checklist

**Run ID:** _______________ **Date:** _______________  
**Artefact:** Organised GAM text / `activity_materials` export only

### 12.1 Type inventory

| Activity | Material types authored (tokens) |
|----------|----------------------------------|
| A1 | |
| A2 | |
| … | |

**Unique families (non-table):** _____ **Table-only session?** ☐ Yes → **FAIL MIX-01**

### 12.2 Clause checklist

| # | Clause | Pass | Fail | N/A | Notes |
|---|--------|:----:|:----:|:---:|-------|
| 0 | GAM-WB-00 Realise DLA | | | | |
| 1 | GAM-WB-01 Exposition | | | | |
| 2 | GAM-WB-02 Worked example | | | | |
| 3 | GAM-WB-03 Modelling | | | | rec. |
| 4 | GAM-WB-04 Guided support | | | | |
| 5 | GAM-WB-05 Retrieval | | | | |
| 6 | GAM-WB-06 Consolidation | | | | |
| 7 | GAM-WB-07 Synthesis | | | | |
| 8 | GAM-WB-08 Transfer | | | | rec. |
| 9 | GAM-WB-09 Judgement | | | | |
| 10 | GAM-WB-10 Scenario | | | | |
| 16 | GAM-WB-16 Tables OK | | | | |
| 20 | GAM-WB-20 Anti-dump | | | | |
| 21 | GAM-WB-21 No placeholders | | | | |
| — | MIX-01 … MIX-06 | | | | |

**GAM contract:** ☐ PASS · ☐ FAIL · ☐ FAIL (DLA not in scope)

### 12.3 Quick probes (GAM text only)

1. Count `Material: * (` lines — list distinct type suffixes.  
2. Capstone: how many `*_table` blocks vs `template` / `prompt_set` / `consolidation_summary`?  
3. Any “partner”, “group”, “agree with” inside card/prompt bodies?  
4. A4-style table: are rating/judgement cells empty?  
5. Is there ≥80 words of closure **outside** table cells?

---

## 13. Open questions for 38D-3 (canonical workbook fixture)

| ID | Fixture must demonstrate |
|----|---------------------------|
| **F1** | Minimal **PASS** GAM type list (≥2 families, all MIX rules) for Inflation topic |
| **F2** | Minimal **PASS** DLA `required_materials` rows that trigger each GAM-WB clause |
| **F3** | **FAIL** exemplar: table-only GAM excerpt (EV-01-sized) for regression |
| **F4** | **PASS** exemplar: EV-03-shaped genre mix **plus** missing WB-01/02/06 bodies flagged as partial |
| **F5** | Capstone **good** vs **dump** pair (GAM-WB-20) |
| **F6** | Ranking table **good** (empty ratings) vs **bad** (EV-01 A4) |
| **F7** | Scenario **good** (2 cases) vs **AP-04** label-only |
| **F8** | Crosswalk: fixture clause IDs ↔ GAM-WB ↔ DLA-WB ↔ [38C-5 E1–E17](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) for 38D-4/5 |

---

## 14. Completion statement

| Criterion | Met? |
|-----------|------|
| Table-only explicitly invalid | §5.2 · §7.3 AP-01 · MIX-01 |
| Every major DLA requirement → GAM obligation | §11 |
| EV-01 FAIL consistent with 38C | §9 |
| EV-03 positive comparator | §10 |
| No implementation proposals | Throughout |
| Reviewer can judge GAM artefact alone | §12 |
| 38D-1 §9 questions answered | §6 · §11 |
| Slice 38D-2 | **COMPLETE** |

**Reviewer check:** On organised GAM text, if only `*_table` types appear on a workbook run → **GAM contract FAIL** immediately (MIX-01) — before Design Page.

**Next:** [38D-3 Canonical workbook fixture](38D-3-canonical-workbook-fixture.md) **COMPLETE** (`CW-REF-38D3`).

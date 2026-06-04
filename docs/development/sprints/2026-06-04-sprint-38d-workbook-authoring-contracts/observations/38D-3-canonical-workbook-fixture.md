# Slice 38D-3 — Canonical workbook fixture

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Fixture ID:** `CW-REF-38D3`  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md) § 38D-3  
**Authority:** [38D-1](38D-1-dla-workbook-contract.md) · [38D-2](38D-2-gam-workbook-genre-contract.md) · [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) · [38C-5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md)  
**Fixture artefacts:** [fixtures/](../fixtures/) (sprint-local only)  
**Out of scope:** Live LLM runs · pack prompts · `tests/` repo fixtures · implementation

---

## 1. Purpose

Define the **canonical reference workbook** (`CW-REF-38D3`) that represents **PASS** against:

- [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) workbook model (R1–R7)
- [38D-1](38D-1-dla-workbook-contract.md) DLA contract
- [38D-2](38D-2-gam-workbook-genre-contract.md) GAM contract
- [38C-5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) learner experience target (E1–E17)

**Success for this slice:** Reviewers have an **authoritative structural benchmark** — what PRISM means by a **self-study workbook** — with end-to-end traceability **DLA → GAM → learner page**, distinct from **EV-01** failure captures.

---

## 2. Inputs and authority

| Source | Role |
|--------|------|
| [38D-1](38D-1-dla-workbook-contract.md) | DLA-WB clauses → fixture DLA outline |
| [38D-2](38D-2-gam-workbook-genre-contract.md) | GAM-WB clauses · §13 F1–F8 handoff |
| [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Function rubric · PASS rules |
| [38C-5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) | Journey · section order · E1–E17 |
| **EV-01** | Negative comparator ([fixtures/negative-exemplar-ev01-index.md](../fixtures/negative-exemplar-ev01-index.md)) |
| **EV-03** | Partial positive comparator (genre mix, incomplete PASS) |
| **GOLDEN** | Workshop shape only — not self-study PASS |

---

## 3. Fixture philosophy

| This fixture **is** | This fixture **is not** |
|---------------------|-------------------------|
| A **workbook reference model** — structure, genres, journey | A **golden render** or committed HTML snapshot |
| A **contract-compliance exemplar** for reviewers and 38D-4 gates | A **pack prompt** or runtime template |
| **Topic-agnostic** skeleton (inflation used only in comparators) | A **domain-specific content exemplar** (no mandatory CPI/PPI prose) |
| Planning **outlines** + manifest in sprint `fixtures/` | Executable JSON in repo `tests/` |

**Principle:** The fixture names **shapes and obligations**. Live runs may use any subject matter that satisfies the same DLA/GAM/type inventory.

---

## 4. Canonical workbook specification (F1–F8)

Requirements from [38D-2 §13](38D-2-gam-workbook-genre-contract.md), operationalised:

| ID | Requirement | Canonical PASS signal |
|----|-------------|----------------------|
| **F1** | Minimal **PASS** GAM type list (≥2 non-table families) | ≥**4** families: narrative, structured practice, retrieval, closure — see [gam-expectations](../fixtures/canonical-workbook-gam-expectations.md) |
| **F2** | Minimal **PASS** DLA `required_materials` rows | Every activity in [dla-outline](../fixtures/canonical-workbook-dla-outline.md) fully specified |
| **F3** | **FAIL** exemplar: table-only GAM | **NEG-EV-01** — [negative-exemplar-ev01-index.md](../fixtures/negative-exemplar-ev01-index.md) |
| **F4** | **PASS** exemplar: full genre mix + flagged gaps vs EV-03 | **CW-REF-38D3** manifest; EV-03 noted as missing exposition/worked example/consolidation_summary |
| **F5** | Capstone **good** vs **dump** pair | Canonical A5: template + transfer + consolidation — **not** four tables ([GAM-WB-20](38D-2-gam-workbook-genre-contract.md)) |
| **F6** | Ranking table **good** vs **bad** | Canonical A4: empty ratings + rubric — contrast EV-01 A4 pre-fill |
| **F7** | Scenario **good** vs label-only | Canonical A3/A4: ≥2 cases — contrast EV-01 A3 |
| **F8** | Crosswalk fixture ↔ DLA-WB ↔ GAM-WB ↔ E1–E17 | [reference-manifest](../fixtures/canonical-workbook-reference-manifest.md) · §11 below · §12 for 38D-4 |

### 4.1 Programme targets (all F*)

| Target | Canonical value |
|--------|-----------------|
| **Duration** | **60 minutes** (`duration_minutes` sum **50–70**) |
| **Learner** | Solo; no required partner/group ([DLA-WB-04](38D-1-dla-workbook-contract.md)) |
| **38C-1 workbook** | **PASS** (R1–R7) |
| **Multi-genre authoring** | Mandatory types in §7 |
| **Consolidation** | `consolidation_summary` ≥80 words |
| **Retrieval** | ≥2 activities with cards/checklist/prompt_set |
| **Transfer** | `transfer_prompt` on capstone (recommended → canonical includes) |
| **Progression** | Support fades A1→A5; capstone lightest table weight ([GAM-WB-MIX-06](38D-2-gam-workbook-genre-contract.md)) |

---

## 5. Canonical learner journey

```text
Orientation → Teaching → Worked example → Guided practice → Self-check
    → Independent application → Transfer → Consolidation
```

| Stage | Learner goal | 38C-1 functions | DLA obligations (representative) | GAM genres |
|-------|-------------|-----------------|--------------------------------|------------|
| **Orientation** | Know goal, time, path | Partial teaching | WB-01, WB-02, WB-03; A1 outcomes | `text` (short), `task_cards`, `checklist` |
| **Teaching** | Grasp concepts solo | Explanatory teaching **Present** | WB-07; A2 exposition spec | `text` ≥120 words |
| **Worked example** | See expert method | Worked examples **Present** | WB-08; A2 `sample_output` | `sample_output` stepped |
| **Guided practice** | Try with structure | Guided practice **Present** | WB-10, WB-18; A3 scenario + template | `scenario`, `template`, `task_cards` |
| **Self-check** | Verify before moving on | Retrieval **Present** | WB-11; A1 checklist, A4 prompts | `checklist`, `prompt_set` |
| **Independent application** | Apply with less support | Guided practice, judgement | WB-15; A4 rank + rubric | `comparison_table` (empty ratings), `rubric` |
| **Transfer** | Own context | Transfer **Present** | WB-14; A5 transfer prompts | `transfer_prompt` |
| **Consolidation** | Remember and close | Consolidation **Present** | WB-12; A5 closure | `consolidation_summary` |

**Activity mapping:** A1 orientation/self-check · A2 teach + example · A3 guided · A4 independent · A5 transfer + synthesis + consolidation.

---

## 6. Canonical DLA shape

Representative outline: [fixtures/canonical-workbook-dla-outline.md](../fixtures/canonical-workbook-dla-outline.md).

### 6.1 Summary

| Dimension | Canonical |
|-----------|-----------|
| **Activities** | **5** (A1–A5), ordered, solo |
| **Duration** | 10 + 12 + 13 + 13 + 12 = **60** min |
| **`required_materials` families** | `text`, `sample_output`, `scenario`, `task_cards`, `template`, `checklist`, `prompt_set`, `rubric`, `transfer_prompt`, `consolidation_summary`, optional `*_table` |
| **Capstone** | Integrative `template` + transfer + consolidation — **prohibited** full table re-list |
| **Contracts** | DLA-WB-01 … 19 → **Pass** when outline fully specified |

*No implementation syntax* — field names are illustrative of domain intent.

---

## 7. Canonical GAM shape

Detail: [fixtures/canonical-workbook-gam-expectations.md](../fixtures/canonical-workbook-gam-expectations.md).

### 7.1 Mandatory vs optional (session)

| Mandatory genres | Optional genres |
|------------------|-----------------|
| exposition (`text`) | `modelling_note` (if WB-02 satisfied) |
| `scenario` (≥2 activities) | `misconception_note` |
| `sample_output` / worked path | `reflection_prompt` (with consolidation) |
| `task_cards` | `*_table` (≤3 activities, companion use) |
| `checklist` or `retrieval_check` | |
| `prompt_set` (≥2 activities) | |
| learner `template` | |
| `consolidation_summary` | |
| `rubric` (if rank activity) | |
| capstone `template` + `transfer_prompt` | |

### 7.2 Minimum expectations

- **≥4** type **families** ([GAM-WB-MIX-02](38D-2-gam-workbook-genre-contract.md))
- **0** placeholder material labels ([GAM-WB-21](38D-2-gam-workbook-genre-contract.md))
- **100%** DLA material entries realised ([GAM-WB-00](38D-2-gam-workbook-genre-contract.md))

---

## 8. Canonical page experience

What the learner **should see** ([38C-5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md)):

| Zone | Learner-visible content |
|------|-------------------------|
| **Opening** | Title, **~60 min** badge, outcomes, **key ideas** prose (not 69-word journey only) |
| **Early activities** | Cards + short teaching before tables |
| **Mid** | Scenario stories → worksheet with **blanks** → checklist |
| **Late** | Rank task with **empty** rating column + criteria list |
| **Capstone** | Plan template + “your context” prompts — **not** four repeated tables |
| **Close** | **Consolidation section** — summary + optional reflection |
| **E1–E17 forecast** | E1–E4 Y, E5–E6 Y, E7 Y, E8 Y, E9 Y, E10–E14 Y, E15 Y, E16–E17 Y |

Design Page **preserves** GAM bodies; fixture assumes compose surfaces `knowledge_summary` or merged exposition and a **post-activities consolidation** section when upstream provides `consolidation_summary` ([38C-5 §8.4](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) — observation, not implementation).

---

## 9. Inflation comparison

*Inflation used as **comparator topic only** — canonical fixture is topic-neutral.*

| Dimension | **EV-01** | **EV-03** | **CW-REF-38D3** (canonical) |
|-----------|-----------|-----------|------------------------------|
| **38C-1 workbook** | **FAIL** | **FAIL** (partial functions) | **PASS** (by design) |
| **DLA contract** | **FAIL** (inferred) | Partial / unknown | **PASS** (outline) |
| **GAM contract** | **FAIL** (AP-01) | **Partial** | **PASS** (by design) |
| **Genre diversity** | **4** table types only | **8** types | **≥10** tokens, **≥4** families |
| **Consolidation** | Absent | `prompt_set` only (partial) | `consolidation_summary` mandatory |
| **Retrieval** | Implicit table fill | cards + checklist + prompts | cards + checklist + prompts (≥2 acts) |
| **Transfer** | Partial task text | Limited | `transfer_prompt` on capstone |
| **Worked example** | Absent | Absent | `sample_output` mandatory |
| **Exposition** | Absent | Absent | `text` mandatory |
| **Capstone** | Four-table dump | prompts only | plan template + closure |
| **Duration** | 125 min | varies | **60** min |
| **Learner journey** | Tables → tables → abrupt end | Richer mid; weak close | Full 8-stage arc |
| **Solo** | Partner/group tasks | Some group card text | Solo throughout |

**Role summary:**

| Artefact | Use |
|----------|-----|
| **EV-01** | **Before** baseline — must **not** match canonical |
| **EV-03** | Proof GAM **can** multi-genre; **not** sufficient for canonical PASS |
| **CW-REF-38D3** | Target shape for 38D-4 gates and Inflation **after** contract run |

---

## 10. Fixture acceptance criteria

### 10.1 PASS — fixture `CW-REF-38D3`

All must hold:

| Authority | Condition |
|-----------|-----------|
| **[38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)** | R1–R7 satisfied on composed+render review |
| **[38D-1](38D-1-dla-workbook-contract.md)** | DLA-WB Mandatory clauses Pass on [dla-outline](../fixtures/canonical-workbook-dla-outline.md) |
| **[38D-2](38D-2-gam-workbook-genre-contract.md)** | GAM-WB + MIX Pass on [gam-expectations](../fixtures/canonical-workbook-gam-expectations.md) |
| **F1–F8** | Deliverables present in sprint `fixtures/` |
| **Distinct from EV-01** | Type inventory disjoint from table-only set |

### 10.2 FAIL — candidate run vs fixture

| Signal | Verdict |
|--------|---------|
| GAM organised text = only `*_table` | **Not canonical** — equals EV-01 class |
| Capstone = all prior tables | **Not canonical** — AP-02 |
| No `consolidation_summary` body | **Not canonical** |
| DLA sum duration **>70** without exception | **Not canonical** |

---

## 11. Reviewer usage guide

### 11.1 When to use `CW-REF-38D3`

| Use case | Steps |
|----------|-------|
| **Score a new DLA export** | Compare activity-by-activity to [dla-outline](../fixtures/canonical-workbook-dla-outline.md); run [38D-1 §8](38D-1-dla-workbook-contract.md) |
| **Score GAM text** | Build type inventory; compare to [gam-expectations](../fixtures/canonical-workbook-gam-expectations.md); run [38D-2 §12](38D-2-gam-workbook-genre-contract.md) |
| **Score learner page** | Run [38C-5 E1–E17](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) |
| **Regression vs Inflation** | Side-by-side type list: candidate vs **EV-01** vs **canonical manifest** |

### 11.2 Quick decision tree

```text
Count GAM Material types
  → only *_table?  → STOP: NEG-EV-01 class (not workbook)
  → <4 families?  → FAIL MIX-02
  → no consolidation_summary?  → FAIL canonical
  → matches manifest?  → proceed to 38C-1 R1–R7 on page/render
```

### 11.3 Crosswalk (F8)

| Fixture stage | DLA-WB | GAM-WB | 38C-5 E-items |
|---------------|--------|--------|---------------|
| Orientation | 01–03 | 01, 17 | E1–E4 |
| Teaching | 07 | 01 | E2 |
| Worked example | 08 | 02, 12 | E5 |
| Guided | 10, 18 | 04, 10, 11 | E6–E8 |
| Self-check | 11 | 05, 13, 18 | E9 |
| Independent | 15 | 09, 14, 16 | E10–E11 |
| Transfer | 14 | 08 | E12 |
| Consolidation | 12 | 06 | E13–E14 |
| Anti-patterns | 16–17 | 20, 21 | E15–E17 |

---

## 12. Output for 38D-4 (validation rules)

Rules that **naturally emerge** from this fixture for [38D-4](38D-4-workbook-validation-criteria.md):

| Rule ID | Layer | Rule (draft) |
|---------|-------|--------------|
| **V-01** | GAM | Type family count ≥ **4** on workbook brief |
| **V-02** | GAM | Non-table type count ≥ **1** (MIX-01) |
| **V-03** | GAM | `consolidation_summary` present with ≥80 words |
| **V-04** | GAM | `sample_output` or stepped example present |
| **V-05** | GAM | `scenario` on every activity with case language in DLA |
| **V-06** | GAM | Capstone table blocks ≤ **1** |
| **V-07** | GAM | No pre-filled judgement column on rank tables |
| **V-08** | DLA | `duration_minutes` sum ∈ [50, 70] |
| **V-09** | DLA | All DLA-WB Mandatory Pass |
| **V-10** | Page | 38C-1 R1–R7 Pass on composed page |
| **V-11** | Render | 38C-5 E1, E2, E5, E9, E13, E14, E15, E16, E17 = Y |
| **V-12** | Programme | Candidate type inventory **≠** EV-01-only set |
| **V-13** | Programme | B4 table syntax Pass **independent** of V-01–V-11 |

**Gate ordering (planning):** V-08/V-09 (DLA) → V-01–V-07 (GAM) → V-10 (page) → V-11 (render).

---

## 13. Completion statement

| Criterion | Met? |
|-----------|------|
| Represents workbook PASS | §4, §10 |
| DLA → GAM → learner traceability | §5–8, §11 |
| Future benchmark | `CW-REF-38D3` + [manifest](../fixtures/canonical-workbook-reference-manifest.md) |
| Distinct from EV-01 | §9, [negative-exemplar](../fixtures/negative-exemplar-ev01-index.md) |
| No implementation | Throughout |
| Sprint-local fixtures only | [fixtures/](../fixtures/) |
| Slice 38D-3 | **COMPLETE** |

**Reviewer check:** Open [canonical-workbook-reference-manifest.md](../fixtures/canonical-workbook-reference-manifest.md) — if a run’s GAM type list is a subset of EV-01’s four tables, it is **not** the canonical workbook.

**Next:** [38D-4 Workbook validation criteria](38D-4-workbook-validation-criteria.md) **COMPLETE**.

# Canonical workbook reference manifest (CW-REF-38D3)

**Fixture ID:** `CW-REF-38D3`  
**Authority:** [38D-3-canonical-workbook-fixture.md](../observations/38D-3-canonical-workbook-fixture.md)  
**Status:** Planning reference — not live pipeline output

---

## Identity

| Field | Value |
|-------|--------|
| **Intent** | `self_study_workbook` |
| **Delivery** | `self_directed` |
| **Profile** | `page_profile: learner` |
| **Duration target** | **60 minutes** (sum `duration_minutes` 50–70) |
| **Topic binding** | **None** — structural reference; inflation used only in comparators |

---

## Session genre inventory (minimum PASS)

| Family | Required types (≥1 each where marked) | Mandatory |
|--------|--------------------------------------|:---------:|
| Narrative | `text` / exposition | **Yes** |
| Narrative | `scenario` | **Yes** (≥2 activities) |
| Practice | `sample_output` or stepped `template` (worked example) | **Yes** |
| Practice | `task_cards` | **Yes** |
| Practice | `template` (learner blanks) | **Yes** |
| Retrieval | `checklist` **or** `retrieval_check` | **Yes** |
| Retrieval | `prompt_set` | **Yes** (≥2 activities total retrieval) |
| Closure | `consolidation_summary` | **Yes** |
| Integration | `transfer_prompt` | **Recommended** |
| Integration | capstone `template` (plan scaffold) | **Yes** |
| Reference | `*_table` (≤3 activities; not capstone-only) | **Optional** |
| Judgement | `rubric` (if rank/compare activity) | **When applicable** |

**Prohibited on PASS:** Table-only session · capstone four-table dump · pre-filled judgement column · placeholder scenario labels.

---

## Activity skeleton (5 activities · 60 min)

| ID | Minutes | Stage | Primary GAM genres |
|----|--------:|-------|-------------------|
| **A1** | 10 | Orientation + light retrieval | exposition (short), task_cards, checklist |
| **A2** | 12 | Teaching + worked example | exposition, sample_output, comparison_table (reference) |
| **A3** | 13 | Guided practice | scenario, template or analysis_table (blanks), task_cards |
| **A4** | 13 | Independent + judgement | scenario, reference_table, rubric, ranking table (empty ratings) |
| **A5** | 12 | Transfer + synthesis + consolidation | template (plan), transfer_prompt, consolidation_summary |
| **Σ** | **60** | | **≥4 non-table families** |

---

## Contract crosswalk (quick)

| Layer | PASS bar |
|-------|----------|
| [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | R1–R7 |
| [38D-1](../observations/38D-1-dla-workbook-contract.md) | DLA-WB-01 … 19 Mandatory |
| [38D-2](../observations/38D-2-gam-workbook-genre-contract.md) | GAM-WB-* + MIX-01 … 06 |

---

## Negative comparators (same programme)

| ID | Role | Location |
|----|------|----------|
| **EV-01** | Table-only **FAIL** | [ev-38b4-01-pipeline-gam.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-pipeline-gam.txt) |
| **EV-03** | Partial uplift | [ev-38b4-03-inflation-gam-live.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-inflation-gam-live.txt) |

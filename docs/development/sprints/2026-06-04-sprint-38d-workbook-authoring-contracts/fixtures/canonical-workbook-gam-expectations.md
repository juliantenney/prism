# Canonical workbook — GAM genre expectations (planning)

**Fixture ID:** `CW-REF-38D3` · **Layer:** GAM (`Material:` blocks / `activity_materials`)  
**Authority:** [38D-2](../observations/38D-2-gam-workbook-genre-contract.md)

---

## Minimum type token set (session-wide)

| Token | Mandatory | Minimum body (reviewer) |
|-------|:---------:|-------------------------|
| `text` / exposition | **Yes** | ≥120 words linking ≥2 ideas ([GAM-WB-01](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `scenario` | **Yes** | ≥2 cases, ≥40 words each, specific details ([GAM-WB-10](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `sample_output` or worked `template` | **Yes** | ≥3 numbered steps ([GAM-WB-02](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `task_cards` | **Yes** | ≥3 solo cards on ≥1 activity ([GAM-WB-17](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `checklist` or `retrieval_check` | **Yes** | ≥4 checkable criteria ([GAM-WB-13](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `prompt_set` | **Yes** | ≥2 activities with prompts ([GAM-WB-18](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `template` (learner) | **Yes** | Blank fields for learner ([GAM-WB-11](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `consolidation_summary` | **Yes** | ≥80 words, ≥3 ideas ([GAM-WB-06](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `transfer_prompt` | Recommended | ≥2 “your context” prompts ([GAM-WB-08](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `rubric` | If rank activity | ≥3 criteria ([GAM-WB-14](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `*_table` | Optional | Companion to non-table; empty learner cells ([GAM-WB-16](../observations/38D-2-gam-workbook-genre-contract.md)) |
| `modelling_note` | Optional | If no worked example path |
| `misconception_note` | Optional | Learner-facing callout |
| `reflection_prompt` | Optional | With consolidation, not instead of retrieval |

---

## Per-activity genre map (canonical)

| Activity | Expected `Material:` types (order) |
|----------|-----------------------------------|
| **A1** | text → task_cards → checklist |
| **A2** | text → sample_output → comparison_table |
| **A3** | scenario → template → task_cards |
| **A4** | scenario → comparison_table (empty ratings) → rubric → prompt_set |
| **A5** | template → transfer_prompt → consolidation_summary |

**Capstone rule:** ≤1 optional lookup table stub on A5; **not** four full table reprints ([GAM-WB-20](../observations/38D-2-gam-workbook-genre-contract.md)).

---

## MIX rules (must Pass)

| Rule | Canonical expectation |
|------|----------------------|
| MIX-01 | Non-table count ≥ **1** family |
| MIX-02 | ≥ **4** distinct families session-wide |
| MIX-03 | Closure prose block present |
| MIX-04 | Worked steps visible |
| MIX-05 | Checklist/cards/prompts = learner-check |
| MIX-06 | A5 material weight **≤** A3 |

---

## Negative exemplar pointer

| Comparator | Types only | Contract |
|------------|------------|----------|
| [EV-01-G](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-pipeline-gam.txt) | 4 tables | **FAIL** MIX-01 |
| [EV-03-G](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-inflation-gam-live.txt) | 8 types, partial closure | **Partial** |

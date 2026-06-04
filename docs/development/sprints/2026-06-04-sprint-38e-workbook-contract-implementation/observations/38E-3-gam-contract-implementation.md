# Slice 38E-3 — GAM workbook genre contract implementation

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38E-3  
**Authority:** [38D-2](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) · [38E-1](38E-1-implementation-target-audit.md) · [38E-2](38E-2-dla-contract-implementation.md) · [canonical-workbook-gam-expectations.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/canonical-workbook-gam-expectations.md)  
**Out of scope:** DLA §5 · `app.js` · `lib/ld-*` · tests · Design Page

---

## 1. Purpose

Enact **GAM-WB-00 … 21**, **GAM-WB-MIX-01 … 06**, and **AP-01 … 04** in **Generate Activity Materials** so GAM authors **full learner-facing genre bodies** when upstream DLA specifies workbook `required_materials` — making **table-only workbook output contractually invalid** and capping the genre ceiling for Design Page.

---

## 2. Inputs and authority

| Source | Role |
|--------|------|
| [38D-2](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) | Normative GAM-WB / MIX / AP clauses |
| [38E-2](38E-2-dla-contract-implementation.md) | Upstream DLA spec obligations — GAM realises, does not redesign |
| [38E-1](38E-1-implementation-target-audit.md) | Allowed target: pack §6 only; `app.js` **NO** |
| [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | V2 GAM layer (V-01, V-02, V-03 …) |
| [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) | EV-01 FAIL baseline · AFTER pending 38E-5 |

**Applicability gate:** `self_directed` + upstream `delivery_notes.workbook_contract_applied` / `resource_intent: self_study_workbook` / equivalent workbook arc (links to [38E-2](38E-2-dla-contract-implementation.md) DLA-WB-01).

---

## 3. Files changed

| File | Section | Change |
|------|---------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | **§6 Generate Activity Materials** only | Expanded `Material-type realisation guidance`; added **Self-study workbook genre contract (GAM-WB)** block; updated `defaultPromptNotes` |

**Not changed:** §5 DLA · §13 Design Page · `app.js` · `lib/ld-table-fidelity.js` · `lib/ld-materials-copy.js` · tests

---

## 4. Contract clauses implemented

| GAM-WB clause | Implementation location | Summary | Evidence |
|---------------|-------------------------|---------|----------|
| **Core** DP ceiling | GAM-WB block intro | Design Page cannot compose genres GAM never authored | `GAM-WB core:` |
| **00** Realise all entries | GAM-WB block + existing usability | 100% DLA entries with Content; no spec-only | `GAM-WB-00:` |
| **01** Exposition | Material guidance + GAM-WB-01 | `text` / exposition ≥120 words, ≥2 ideas | `text / exposition:` · `GAM-WB-01` |
| **02** Worked example | Material guidance + GAM-WB-02 | `sample_output` / `worked_example` ≥3 steps | `sample_output / worked_example:` · `GAM-WB-02` |
| **03** Modelling | Material guidance + GAM-WB-03 | `modelling_note` / `reasoning_walkthrough` | `modelling_note:` · `GAM-WB-03` |
| **04** Guided practice | GAM-WB-04 | Usable practice bodies, not reference dump | `GAM-WB-04` |
| **05** Retrieval | Material guidance + GAM-WB-05 | task_cards, prompt_set, checklist / retrieval_check | `checklist / retrieval_check` · `GAM-WB-05` |
| **06** Consolidation | Material guidance + GAM-WB-06 | `consolidation_summary` ≥80 words, ≥3 ideas | `consolidation_summary:` · `GAM-WB-06` |
| **07** Synthesis capstone | GAM-WB-07 | Synthesis scaffold materials | `GAM-WB-07` |
| **08** Transfer | Material guidance + GAM-WB-08 | `transfer_prompt` learner context | `transfer_prompt:` · `GAM-WB-08` |
| **09** Evaluative judgement | Material guidance + GAM-WB-09 | Empty rating cells; rubric/quality_criteria | `rubric / quality_criteria:` · `GAM-WB-09` |
| **10** Scenario | Material guidance + GAM-WB-10 | Full scenario bodies | `scenario:` · `GAM-WB-10` |
| **11** Template | Material guidance + GAM-WB-11 | Learner blanks; worked rows when modelled | `template:` · `GAM-WB-11` |
| **12** Sample output | Material guidance + GAM-WB-12 | Annotated exemplar | `sample_output` · `GAM-WB-12` |
| **13** Checklist | Material guidance + GAM-WB-13 | ≥4 checkable items | `checklist` · `GAM-WB-13` |
| **14** Rubric | Material guidance + GAM-WB-14 | ≥3 criteria | `rubric` · `GAM-WB-14` |
| **15** Misconception | Material guidance + GAM-WB-15 | `misconception_note` when requested | `misconception_note:` · `GAM-WB-15` |
| **16** Reference tables | Material guidance + GAM-WB-16 | `reference_table` / tables as support; LD-TABLE-FIDELITY | `reference_table:` · `GAM-WB-16` |
| **17** Task cards | Material guidance + GAM-WB-17 | ≥3 cards | `task_cards:` · `GAM-WB-17` |
| **18** Prompt set | Material guidance + GAM-WB-18 | ≥2 prompts | `prompt_set:` · `GAM-WB-18` |
| **19** Reflection | Material guidance + GAM-WB-19 | Supplement only, not retrieval substitute | `reflection_prompt:` · `GAM-WB-19` |
| **20** Capstone anti-dump | GAM-WB-07 + GAM-WB-20 | No four-table capstone reprint | `GAM-WB-20` |
| **21** No placeholders | GAM-WB-00 + usability (unchanged) | Substantive bodies | Existing usability + `GAM-WB-00` |
| **exemplar / comparison_pair** | Material guidance | When DLA purpose requires | `exemplar / comparison_pair:` |

**38E-2 crosswalk (DLA → GAM):**

| DLA obligation (38E-2) | GAM realisation (38E-3) |
|-------------------------|-------------------------|
| `text` exposition spec | GAM-WB-01 body |
| `sample_output` / `template` worked | GAM-WB-02 / MIX-04 |
| `scenario` when case language | GAM-WB-10 / AP-04 |
| task_cards / prompt_set / checklist | GAM-WB-05 / MIX-05 |
| consolidation purpose / final activity | `consolidation_summary` GAM-WB-06 / MIX-03 |
| capstone synthesis | GAM-WB-07, GAM-WB-20 |
| ranking spec | GAM-WB-09, AP-03 |
| non-table diversity (DLA-WB-06) | GAM-WB-MIX-01/02, AP-01 |

---

## 5. Mix and anti-pattern rules implemented

| Rule | Location | Summary |
|------|----------|---------|
| **GAM-WB-MIX-01** | GAM-WB block | Tables alone insufficient — **AP-01 invalid** |
| **GAM-WB-MIX-02** | GAM-WB block | ≥2 type families when tables used |
| **GAM-WB-MIX-03** | GAM-WB block + consolidation guidance | Consolidation ≠ table-only |
| **GAM-WB-MIX-04** | GAM-WB block + template guidance | Worked content required, not blank template only |
| **GAM-WB-MIX-05** | GAM-WB block | Retrieval = learner-check genres |
| **GAM-WB-MIX-06** | GAM-WB block | Capstone weight ≤ mid-session practice |
| **AP-01** | GAM-WB block Anti-patterns | Table-only workbook FAIL |
| **AP-02** | GAM-WB block | Reference-dump capstone FAIL |
| **AP-03** | Material guidance + GAM-WB-09 | Pre-filled judgement FAIL |
| **AP-04** | GAM-WB-10 + Anti-patterns | Scenario named, not authored FAIL |

**Explicit invalid statement:** `Table-only workbook is contractually invalid (AP-01 / GAM-WB-MIX-01)` in GAM-WB block.

---

## 6. Non-goals respected

| Non-goal | Status |
|----------|--------|
| §5 DLA edits | **Not touched** |
| `app.js` GAM scaffolds | **Not touched** |
| `LD-MATERIALS-COPY` / `LD-TABLE-FIDELITY` module text | **Not weakened** — block says obey, do not weaken |
| Design Page | **Not touched** |
| DLA design obligations in GAM | **Explicitly excluded** — realise DLA only |
| Tests | **Not touched** |

---

## 7. `app.js` status

| Question | Answer |
|----------|--------|
| **Edited?** | **No** |
| **Rationale** | Per [38E-1 §7](38E-1-implementation-target-audit.md): pack §6 sufficient for genre obligations; `LD-MATERIALS-COPY` / `LD-TABLE-FIDELITY` remain runtime-canonical. |
| **Follow-up** | Optional `buildSelfDirectedGamWorkbookGenrePromptBlock` only if 38E-5 AFTER shows model ignores pack gate — charter amendment required. |

---

## 8. Risks / follow-ups for 38E-4

| Risk | Mitigation (38E-4) |
|------|---------------------|
| Model ignores gated block | Assert §6 prompt contains `AP-01` and `GAM-WB-MIX-01` in workflow tests |
| DLA without workbook flag | GAM-WB may not apply — score dual path on Inflation AFTER |
| Prompt size pressure | Run `probe-38b1-ld-workflow-prompt-audit.js` — GAM augmented size delta |
| Token alias drift (`worked_example` vs `sample_output`) | Material guidance accepts both; reviewer uses `Material:` token inventory |
| Preservation (V-13) | Unchanged LD modules — B4 monitor on AFTER only |

---

## 9. Validation notes for 38E-4

| Check | Method | 38D-4 rules |
|-------|--------|-------------|
| GAM prompt has workbook gate | Grep / `workflow-self-directed-learner-page-formatting.test.js` extension | — |
| AP-01 explicit | String `table-only workbook is contractually invalid` | **V-02** |
| Genre inventory on capture | Parse `Material: * (type)` from AFTER artefact | **V-01**, **V-02** |
| MIX-03 consolidation | Presence of `consolidation_summary` body | **V-03** |
| AP-03 empty ratings | Cell-level review on rank activity | **V-06** |
| V-13 preservation | Compare AFTER GAM→DP vs EV-01-P | **V-13** |
| DLA+GAM pipeline | Requires live or fixture run in 38E-5 | Full scorecard [38D-5 §6](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) |

---

## 10. Completion statement

| Criterion | Met? |
|-----------|------|
| GAM-WB implemented in §6 only | **Yes** |
| AP-01 table-only explicitly invalid | **Yes** |
| Major 38E-2 DLA expectations have GAM obligations | **Yes** — §4 crosswalk |
| No §5 / app.js / lib / tests | **Yes** |
| LD preserve modules not weakened | **Yes** |
| 38E-4 can validate against 38D-4 | **Yes** |
| Slice **38E-3** | **COMPLETE** |

**Next slice:** **38E-4** — Contract regression and fixture check (tests allowed if tied to 38D-4).

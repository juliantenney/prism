# Canonical workbook — DLA specification outline (planning)

**Fixture ID:** `CW-REF-38D3` · **Layer:** DLA (`learning_activities[]`)  
**Not:** Implementation JSON schema · Live pack syntax · Topic-specific content

---

## Session metadata (representative)

| Field | Representative value |
|-------|---------------------|
| `resource_intent` | `self_study_workbook` |
| `session_duration_target_minutes` | `60` |
| `delivery_context` | `self_directed` |
| `page_profile` (downstream) | `learner` |
| `consolidation_requirement` | Session closure with summary + reflection |

---

## Activity A1 — Orient and warm up (10 min)

| Field | Representative content |
|-------|------------------------|
| `activity_id` | `A1` |
| `mapped_learning_outcomes` | `LO-1`, `LO-2` |
| `learner_task` | Solo: preview outcomes and complete orientation cards. |
| `expected_output` | All orientation cards answered; checklist items ticked. |
| `grouping` | `individual` |
| `required_materials` | |

| type | purpose | specification (intent) |
|------|---------|------------------------|
| `text` | session orientation | Brief framing linking topic to learner goals (exposition seed) |
| `task_cards` | orientation steps | ≥3 cards: read outcomes, skim key ideas, note prior knowledge |
| `checklist` | self-check | ≥4 items: “I can state the session goal”, “I know how long this takes”, … |

---

## Activity A2 — Learn core ideas and see a worked example (12 min)

| Field | Representative content |
|-------|------------------------|
| `learner_task` | Study exposition and worked example; identify method steps. |
| `expected_output` | Learner lists method steps used in example (observable). |
| `required_materials` | |

| type | purpose | specification |
|------|---------|-----------------|
| `text` | explanatory teaching | Connect ≥2 core concepts in prose (DLA-WB-07) |
| `sample_output` | worked example | Stepped expert completion on **one** instance; not learner worksheet |
| `comparison_table` | reference | Definitions/compare — reference rows only; no learner judgement column |

---

## Activity A3 — Guided practice with scenario (13 min)

| Field | Representative content |
|-------|------------------------|
| `learner_task` | Apply method to scenario cases using structured worksheet. |
| `expected_output` | Completed template/table blanks for ≥2 cases. |
| `required_materials` | |

| type | purpose | specification |
|------|---------|-----------------|
| `scenario` | case context | ≥2 named cases with specific details (DLA-WB-18) |
| `template` | guided practice | Blank fields for learner calculations/classifications |
| `task_cards` | step guidance | ≥3 imperative steps referencing scenario + template |

---

## Activity A4 — Compare options with judgement (13 min)

| Field | Representative content |
|-------|------------------------|
| `activity_interaction_type` | `ranking` (when applicable) |
| `learner_task` | Rank options using rubric; justify top choice in writing. |
| `expected_output` | Rank order + short justification meeting rubric bullets. |
| `required_materials` | |

| type | purpose | specification |
|------|---------|-----------------|
| `scenario` | decision context | Case requiring comparison (solo) |
| `comparison_table` | compare | Options listed; **effectiveness/rating cells empty** for learner |
| `rubric` | evaluative judgement | ≥3 criteria; learner-generated ranking required (DLA-WB-15) |
| `prompt_set` | retrieval | ≥2 prompts interpreting comparison |

---

## Activity A5 — Personal plan, transfer, and closure (12 min)

| Field | Representative content |
|-------|------------------------|
| `mapped_learning_outcomes` | `LO-1` … `LO-4` (≥3) |
| `learner_task` | Build personal integrative plan; apply to your context; complete closure. |
| `expected_output` | Completed plan template + transfer responses + consolidation reviewed. |
| `required_materials` | |

| type | purpose | specification |
|------|---------|-----------------|
| `template` | synthesis | Integrative plan scaffold — **not** re-list of all prior tables (DLA-WB-16) |
| `transfer_prompt` | transfer | ≥2 prompts requiring learner’s own context |
| `consolidation_summary` | session closure | Summary of ≥3 takeaways; optional reflection pair |
| `prompt_set` | retrieval (optional) | Capstone review prompts — **does not replace** consolidation_summary |

**Prohibited on A5:** `classification_table`, `comparison_table`, `analysis_table`, `impact_table` **all** as primary capstone materials.

---

## DLA contract expectation

All [DLA-WB-01 … 19](../observations/38D-1-dla-workbook-contract.md) **Mandatory** clauses → **Pass** when this outline is fully specified.

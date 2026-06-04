# Slice 38D-1 — DLA workbook contract

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md) § 38D-1  
**Authority:** [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) · [38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) · [38C-3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) · [38C-6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md)  
**Out of scope:** GAM material bodies ([38D-2](38D-2-gam-workbook-genre-contract.md) TBD) · pack/runtime · implementation

---

## 1. Purpose

Convert [38C-3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) planning requirements into an **executable DLA workbook contract** — numbered, testable clauses a reviewer can apply to **`learning_activities`** (and linked brief metadata) **before GAM runs**.

**Success for this slice:** Given DLA JSON (or equivalent activity spec export), a reviewer can score each **DLA-WB-** clause Pass / Fail / Unknown / N/A and produce a **contract verdict** without reading GAM or Design Page output.

---

## 2. Inputs and authority

| Source | Role in this contract |
|--------|------------------------|
| [38C-1 §3–5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Normative workbook functions; R1–R7; 60-min MVP |
| [38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) | EV-01 failure modes; GAP-01 … GAP-09; DLA origin tags |
| [38C-3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) | Planning stance (Require/Encourage); §5 minimum spec; §8 statements 1–15 |
| [38C-6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md) | Execution mandate for upstream contracts |
| `domain-learning-design-artefacts.md` | `required_materials[]` shape (`type`, `purpose`, `specification`) |

**Assumptions:**

1. DLA outputs **`learning_activities[]`** — not material prose ([38C-3 §3.2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md)).  
2. Table **syntax** and copy fidelity remain **GAM + 38-B** — DLA names **need**, not pipe rows.  
3. **Inflation EV-01 DLA JSON is not committed** — §7 uses inferred obligations from [38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) + same-run GAM/page ([38C-3 §2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md)).

---

## 3. Applicability

### 3.1 When this contract applies

| Signal | Requirement |
|--------|-------------|
| **`delivery_context`** | `self_directed` (or brief-equivalent solo study) |
| **`page_profile`** (downstream) | `learner` |
| **Workbook intent** | Brief or DLA metadata declares **60-minute self-study workbook** (see DLA-WB-01) |

### 3.2 When clauses are N/A

| Condition | Effect |
|-----------|--------|
| Brief is **workshop** / facilitator-led | Full contract **N/A** — use workshop DLA shape (golden comparator only) |
| Brief is **reference sheet** only | Contract **N/A** — different genre ([38C-1 §2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| Activity is explicitly **optional stretch** | Social clauses may be **N/A** for that activity only if labelled optional |

### 3.3 Workbook intent (normative)

A run is in scope when the product expects [38C-1 §1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md): solo learner, teach → practice → check → consolidate, ~60 minutes.

---

## 4. Contract model

| Level | Meaning | Reviewer action |
|-------|---------|-----------------|
| **Mandatory** | Must hold for **contract PASS** | Fail → contract FAIL |
| **Recommended** | Should hold; fail → **PASS with warnings** | Record gap; does not alone fail contract |
| **Optional** | Permitted enhancements | No fail if omitted |
| **Prohibited** | Must not appear on workbook briefs | Fail if present |

**Contract PASS (DLA layer):** All **Mandatory** clauses **Pass** (or justified N/A). **Prohibited** none triggered.

**Contract FAIL:** Any **Mandatory** clause **Fail**.

**Unknown:** DLA artefact missing — score separately; treat as **Fail** for gate purposes unless reconstructed from brief.

---

## 5. Workbook contract clauses

### DLA-WB-01 — Workbook intent declared

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | Downstream steps cannot apply workbook rules if brief is silent ([38C-3 §9 Q1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md); statement 1). |
| **Pass** | DLA output or resolved brief includes explicit workbook intent (e.g. `resource_intent: self_study_workbook`, or documented equivalent flag + 60-min target). |
| **Fail** | Only implicit intent from tables/tasks; no workbook declaration. |
| **38C source** | 38C-3 §8.1 · 38C-1 §1 |

---

### DLA-WB-02 — Learning outcomes mapped

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | Workbook coherence requires outcome-linked activities ([38C-3 §5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md); statement 14). |
| **Pass** | Every activity has `mapped_learning_outcomes` (or equivalent) with ≥1 outcome ID; capstone maps **≥3** distinct outcome IDs. |
| **Fail** | Any core activity unmapped; capstone maps &lt;3 when ≥3 outcomes exist in session. |
| **38C source** | 38C-3 §5 · 38C-3 §8.14 |

---

### DLA-WB-03 — Duration budget

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | 60-min workbook credibility ([38C-1 §4 R7](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); GAP-06). |
| **Pass** | Sum of `duration_minutes` across activities is **50–70**, **or** `session_duration_target_minutes` ∈ [50,70] with per-activity rationale when sum differs. |
| **Fail** | Sum **&gt;70** or **&lt;50** without documented brief exception (EV-01: **125**). |
| **38C source** | 38C-2 GAP-06 · 38C-3 §5 · 38C-3 §8.2 |

---

### DLA-WB-04 — Solo feasibility

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | Self-study workbook requires solo-completable core tasks ([38C-1 §4](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); GAP-07). |
| **Pass** | No core activity `learner_task` **requires** partner, group, or facilitator; `grouping` is individual/solo default or social interaction explicitly **optional**. |
| **Fail** | Mandatory “partner”, “group”, “agree with class”, or facilitator-dependent completion on any core activity. |
| **38C source** | 38C-2 GAP-07 · 38C-3 §4 guided practice · 38C-3 §8.3 |

---

### DLA-WB-05 — Activity progression and fading

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | Workbook arc reduces support toward capstone ([38C-1 §3.5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); GAP-08). |
| **Pass** | Activities ordered A1…An; early activities specify **more** `required_materials` entries/types than capstone; capstone `specification` describes **synthesis artefact**, not “include all prior table types”. |
| **Fail** | Capstone `required_materials` re-lists every prior table type as primary materials; flat support across sequence with no fading intent in spec text. |
| **38C source** | 38C-3 §4 fading · 38C-2 GAP-08 · 38C-3 §8.12 |

---

### DLA-WB-06 — required_materials diversity (non-table)

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | Table-only specs → table-only GAM ([38C-2 §7.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md); GAP-05). |
| **Pass** | Session uses **≥2 distinct** `required_materials.type` **families**; if any activity lists a `*_table` type, session also lists ≥1 **non-table** domain type (`scenario`, `task_cards`, `prompt_set`, `checklist`, `template`, `sample_output`, …). |
| **Fail** | All activities’ `required_materials` are table-family types only. |
| **38C source** | 38C-1 §4 materials variety · 38C-2 GAP-05 · 38C-3 §5 · 38C-3 §8.13 |

---

### DLA-WB-07 — Explanatory teaching specified

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | R1 fails if teaching deferred to DP intro or table defs only ([38C-1 R1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); GAP-01). |
| **Pass** | Session-level exposition requirement documented; ≥1 `required_materials` or activity field with `purpose` = concept exposition / teaching (non-table), **or** explicit session exposition activity. |
| **Fail** | No exposition requirement; only table `purpose` = classify/compare/reference. |
| **38C source** | 38C-3 §4 explanatory teaching · 38C-2 GAP-01 · 38C-3 §8 (implicit in statements 1, 14) |

---

### DLA-WB-08 — Worked example requirement

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | R5 requires worked examples **or** modelling Present ([38C-1 R5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); EV-01 absent). |
| **Pass** | ≥1 activity lists `required_materials` with `type` **`sample_output`** or **`template`** and `specification` requiring **stepped expert completion** before parallel learner task; `learner_task` references that method. |
| **Fail** | No such entry on any activity. |
| **38C source** | 38C-3 §4 worked examples · 38C-2 §5.3 R5 · 38C-3 §8.6 |

---

### DLA-WB-09 — Modelling (when no worked example)

| Field | Content |
|-------|---------|
| **Level** | **Recommended** |
| **Rationale** | Alternate R5 path when DLA-WB-08 omitted by design ([38C-3 §4 modelling](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md)). |
| **Pass** | DLA-WB-08 **Pass**, **or** ≥1 activity specifies modelling (`reasoning_orientation` + material spec for decision criteria / think-aloud). |
| **Fail (warning)** | DLA-WB-08 Fail and no modelling spec. |
| **38C source** | 38C-3 §4 modelling · 38C-3 §8.7 |

---

### DLA-WB-10 — Guided practice completeness

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | R2 requires guided practice Present on ≥2 activities ([38C-1 R2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)). |
| **Pass** | Every activity has `learner_task`, `expected_output`, and `required_materials` covering what the learner works on; **≥2** activities meet this with practice-oriented (not reference-only) `purpose`. |
| **Fail** | Missing task/output on any activity; reference-only materials on majority of activities. |
| **38C source** | 38C-3 §4 guided practice · 38C-1 §3.4 · 38C-3 §5 |

---

### DLA-WB-11 — Retrieval requirement

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | R3 requires retrieval Present — ≥2 explicit episodes ([38C-1 §3.7](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); GAP-04). |
| **Pass** | **≥2** activities include `required_materials` with `type` **`task_cards`**, **`prompt_set`**, and/or **`checklist`**; each linked `expected_output` states what learner verifies. |
| **Fail** | Fewer than two activities with those types; retrieval only implied via “complete table”. |
| **38C source** | 38C-3 §4 retrieval · 38C-2 GAP-04 · 38C-3 §8.4 |

---

### DLA-WB-12 — Consolidation requirement

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | R4 critical for self-study ([38C-1 R4](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); GAP-03). |
| **Pass** | Session-level consolidation requirement in DLA metadata **or** final activity with `required_materials` / task whose `purpose` is session closure (summary, reflection, key takeaways). |
| **Fail** | No consolidation activity or global requirement; session ends at last practice task only. |
| **38C source** | 38C-3 §4 consolidation · 38C-2 GAP-03 · 38C-3 §8.8 |

---

### DLA-WB-13 — Synthesis requirement (capstone)

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | R6 integration path ([38C-1 R6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)); tighten EV-01 A5 shape. |
| **Pass** | ≥1 capstone (last integrative activity): `expected_output` = integrative artefact (plan, memo, portfolio piece); maps ≥3 outcomes. |
| **Fail** | No capstone; capstone output = “reproduce tables” or “review all materials”. |
| **38C source** | 38C-3 §4 synthesis · 38C-2 §5.10 · 38C-3 §8.9 |

---

### DLA-WB-14 — Transfer (personal application)

| Field | Content |
|-------|---------|
| **Level** | **Recommended** |
| **Rationale** | R6 alternate path; required when outcomes imply personal context ([38C-3 §4 transfer](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md)). |
| **Pass** | Capstone or late activity `learner_task` / `transfer_or_application_task` requires learner’s own context (“your household”, “your case”). |
| **Fail (warning)** | Only third-person scenarios through capstone when topic is personal/professional application. |
| **38C source** | 38C-3 §4 transfer · 38C-3 §8.10 · 38C-1 §3.10 |

---

### DLA-WB-15 — Evaluative judgement (compare/rank tasks)

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** (when applicable) |
| **Rationale** | Pre-filled scores violate judgement intent (GAP-09). |
| **Applicability** | Any activity with `activity_interaction_type: ranking` or compare/rank `learner_task`. |
| **Pass** | `specification` requires **learner-generated** ranking/justification; forbids pre-supplied effectiveness scores in material spec; `expected_output` mentions justification. |
| **Fail** | Spec allows or implies pre-filled judgement column; rank task without criteria. |
| **N/A** | No compare/rank activities in session. |
| **38C source** | 38C-3 §4 evaluative judgement · 38C-2 GAP-09 · 38C-3 §8.11 |

---

### DLA-WB-16 — Capstone anti-dump

| Field | Content |
|-------|---------|
| **Level** | **Prohibited** (capstone shape) |
| **Rationale** | Reference dump ending ([38C-2 GAP-08](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md); 38C-3 anti-spec). |
| **Pass** | Capstone `required_materials` does **not** enumerate all prior `*_table` types as primary deliverables. |
| **Fail** | Capstone spec = “include / complete all tables from A1–A4” or lists all four table types without synthesis-first materials. |
| **38C source** | 38C-3 §5 anti-spec · 38C-2 §5.6 · 38C-3 §8.9 |

---

### DLA-WB-17 — Partner/group adaptation

| Field | Content |
|-------|---------|
| **Level** | **Prohibited** (core activities) |
| **Rationale** | Workshop wording on solo workbook ([38C-2 GAP-07](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)). |
| **Pass** | No prohibited phrasing in `learner_task` / `activity_preamble` on core activities (see DLA-WB-04). |
| **Fail** | “Work with your partner”, “in your group”, “facilitator will…”, or required consensus language. |
| **38C source** | 38C-3 §4 guided practice · 38C-2 §5.5 · 38C-3 §8.3 |

---

### DLA-WB-18 — Scenario requirement (case-based tasks)

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** (when applicable) |
| **Rationale** | Task/material mismatch breaks guided practice (GAP-02). |
| **Applicability** | `learner_task` or `activity_preamble` references scenarios, cases, households, or narratives. |
| **Pass** | Same `activity_id` includes `required_materials` with `type` **`scenario`** (or equivalent) and `specification` describing the case. |
| **Fail** | Case language in task; no scenario material spec on that activity. |
| **N/A** | No case-based language in any activity. |
| **38C source** | 38C-3 §4 guided practice · 38C-2 GAP-02 · 38C-3 §8.5 |

---

### DLA-WB-19 — Observable expected output (all activities)

| Field | Content |
|-------|---------|
| **Level** | **Mandatory** |
| **Rationale** | Hidden success criteria ([38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)); statement 14. |
| **Pass** | Every activity has non-empty `expected_output` describing observable completion. |
| **Fail** | Generic or missing `expected_output` on any core activity. |
| **38C source** | 38C-3 §8.14 · 38C-3 §4 guided practice |

---

## 6. Material obligations table

Maps [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) functions to **minimum DLA `required_materials` expectations** (types are domain-controlled; table-specific keys permitted when `purpose` is clear).

| Workbook function | DLA contract clause | Minimum `required_materials` / fields |
|-------------------|---------------------|--------------------------------------|
| Explanatory teaching | WB-07 | Non-table exposition purpose **or** session exposition activity |
| Worked examples | WB-08 | `sample_output` or `template` + stepped spec |
| Modelling | WB-09 (rec.) | `reasoning_orientation` + criteria spec if WB-08 N/A |
| Guided practice | WB-10, WB-18 | Task + materials per activity; `scenario` when case language |
| Fading | WB-05 | Progression spec; capstone ≠ full table re-list |
| Retrieval | WB-11 | `task_cards` / `prompt_set` / `checklist` on ≥2 activities |
| Consolidation | WB-12 | Closure-purpose material or session metadata |
| Synthesis | WB-13 | Capstone integrative `expected_output` |
| Transfer | WB-14 (rec.) | Personal-context task on capstone/late activity |
| Evaluative judgement | WB-15 | Learner-generated rank spec when ranking interaction |
| Session economics | WB-03 | `duration_minutes` sum 50–70 |
| Solo study | WB-04, WB-17 | Solo `learner_task`; no prohibited social wording |
| Variety | WB-06 | ≥2 type families; non-table if tables used |

---

## 7. Inflation calibration (EV-01)

**Artefact:** Inferred DLA obligations from [EV-01-P/G](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-design-page.json) · [38C-2 §4–6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md). **Committed DLA JSON:** none.

| Clause | Result | Evidence (inference) |
|--------|:------:|----------------------|
| DLA-WB-01 | **Unknown** | Workbook journey copy on page; flag not in committed DLA |
| DLA-WB-02 | **Pass** | Outcomes listed; activities mapped on page |
| DLA-WB-03 | **Fail** | Sum **125** min ([38C-2 §4](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)) |
| DLA-WB-04 | **Fail** | A2 partner, A4 group tasks |
| DLA-WB-05 | **Fail** | A5 re-attaches all four tables — inverse fading |
| DLA-WB-06 | **Fail** | Inferred specs → GAM **4** table types only |
| DLA-WB-07 | **Fail** | No exposition material type in upstream |
| DLA-WB-08 | **Fail** | No `sample_output` / worked template spec |
| DLA-WB-09 | **Fail** | No modelling spec (WB-08 also Fail) |
| DLA-WB-10 | **Pass** | Tasks + outputs on all activities |
| DLA-WB-11 | **Fail** | No cards/checklist/prompt_set in EV-01-G |
| DLA-WB-12 | **Fail** | No consolidation requirement |
| DLA-WB-13 | **Pass** | A5 integrative task text present |
| DLA-WB-14 | **Partial → warning** | A5 transfer language partial ([38C-2 §5.10](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)) |
| DLA-WB-15 | **Fail** | A4 ranking with pre-filled ratings (GAP-09) |
| DLA-WB-16 | **Fail** | A5 four-table dump |
| DLA-WB-17 | **Fail** | Partner/group phrasing |
| DLA-WB-18 | **Fail** | A3 “scenarios” without scenario spec |
| DLA-WB-19 | **Pass** | `expected_output` present per activity on page |

### 7.1 Summary verdict

| Verdict | Detail |
|---------|--------|
| **DLA contract** | **FAIL** |
| Mandatory failures | WB-03, WB-04, WB-05, WB-06, WB-07, WB-08, WB-11, WB-12, WB-15, WB-16, WB-17, WB-18 (**12**) |
| Mandatory passes | WB-02, WB-10, WB-13, WB-19 (**4**) |
| Unknown | WB-01 (**1**) |
| Recommended warnings | WB-09, WB-14 |

**Interpretation:** EV-01 downstream failure is **consistent with DLA contract FAIL** before GAM. Even perfect GAM fidelity cannot produce workbook genres not **specified** in `required_materials` ([38C-2 §7.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)). Post-contract target: **0** mandatory fails on rerun DLA export.

---

## 8. Reviewer checklist (DLA output)

**Resource / run ID:** _______________ **Date:** _______________  
**Artefact:** `learning_activities` JSON (DLA export) · **Applicability:** self_directed + learner workbook

| # | Clause | Pass | Fail | N/A | Unk | Notes |
|---|--------|:----:|:----:|:---:|:---:|-------|
| 1 | DLA-WB-01 Intent | | | | | |
| 2 | DLA-WB-02 Outcomes | | | | | |
| 3 | DLA-WB-03 Duration | | | | | Sum: ___ min |
| 4 | DLA-WB-04 Solo | | | | | |
| 5 | DLA-WB-05 Fading | | | | | |
| 6 | DLA-WB-06 Diversity | | | | | Types: ___ |
| 7 | DLA-WB-07 Teaching | | | | | |
| 8 | DLA-WB-08 Worked ex. | | | | | |
| 9 | DLA-WB-09 Modelling | | | | | rec. |
| 10 | DLA-WB-10 Guided | | | | | |
| 11 | DLA-WB-11 Retrieval | | | | | |
| 12 | DLA-WB-12 Consolidation | | | | | |
| 13 | DLA-WB-13 Synthesis | | | | | |
| 14 | DLA-WB-14 Transfer | | | | | rec. |
| 15 | DLA-WB-15 Judgement | | | | | |
| 16 | DLA-WB-16 Anti-dump | | | | | |
| 17 | DLA-WB-17 No social | | | | | |
| 18 | DLA-WB-18 Scenario | | | | | |
| 19 | DLA-WB-19 Expected out. | | | | | |

**Contract:** ☐ PASS (all Mandatory Pass; no Prohibited) · ☐ FAIL · ☐ INCOMPLETE (Unknown &gt;0)

**Type families present (session):** _______________________

---

## 9. Open questions for 38D-2 (GAM contract)

DLA clauses assume GAM can realise specs. **38D-2** must answer:

| ID | Question | Trigger clause |
|----|----------|----------------|
| **G1** | Minimum body per `required_materials.type` when DLA lists `scenario`, `checklist`, `sample_output`, …? | WB-06, WB-11, WB-08 |
| **G2** | How GAM realises **exposition** when DLA-WB-07 Pass — dedicated type vs `text` block? | WB-07 |
| **G3** | How GAM authors **consolidation** from DLA-WB-12 without DP inventing closure? | WB-12 |
| **G4** | Anti-pattern enforcement when DLA-WB-16 Pass but GAM reprints all tables? | WB-16 |
| **G5** | Ranking tables: empty judgement cells when DLA-WB-15 Pass? | WB-15 |
| **G6** | Table-family keys (`analysis_table`) vs domain types — normalisation rules? | WB-06 |
| **G7** | Mandatory vs optional realisation when DLA lists multiple materials per activity? | WB-10 |
| **G8** | Genre-mix signal on GAM output before Design Page (planning probe)? | WB-06 |
| **G9** | `LD-MATERIALS-COPY` interaction — no placeholder labels? | All |
| **G10** | If DLA contract PASS but GAM table-only — GAM contract FAIL definition? | WB-06 |

*Source planning questions:* [38C-3 §10](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) (reassigned to 38D-2).

---

## 10. Completion statement

| Criterion | Met? |
|-----------|------|
| Clauses testable (pass/fail/N/A) | §5 — DLA-WB-01 … 19 |
| EV-01 scored | §7 |
| Traceability to 38C-3 | Each clause cites 38C-3 / 38C-1 / 38C-2 |
| No GAM obligations defined | §9 defers to 38D-2 |
| No implementation proposals | Throughout |
| Reviewer can judge DLA before GAM | §8 checklist |
| Slice 38D-1 | **COMPLETE** |

**Reviewer check:** Export `learning_activities` for a self-study workbook brief → complete §8 → if any **Mandatory Fail**, stop: GAM cannot be held solely responsible until DLA is fixed.

**Next:** [38D-2 GAM workbook genre contract](38D-2-gam-workbook-genre-contract.md) **COMPLETE**.

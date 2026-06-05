Reconstructed from sprint evidence after original file was found to be missing. No new analysis performed.

**Recovery sources:** agent transcript of the accepted KM→LO traceability revision (§1–§11); initial 38G-1 gap register restored in §9.4–§9.5; cross-checked against [38G-2](38G-2-activity-component-model.md), [38G-3](38G-3-dla-gam-implementation.md), [38F-8](../../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md), and sprint tracking docs.

---

# Slice 38G-1 — First-glance workbook quality analysis

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Type:** **Analysis only** — no pack/code/tests · no pipeline run · no implementation proposals  
**Authority:** [38F-8](../../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md) · [38C-1 §5.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) · [domain-learning-design-artefacts.md](../../../2026-05-12-sprint-08-workflow-planning-and-brief-semantics-alignment/context-files/domain-learning-design-artefacts.md) (KM/LO schema)  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38G-1  

**Primary artefacts:**  
- Page: [EV-38F-AFTER-design-page.json](../../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/EV-38F-AFTER-design-page.json)  
- DLA: [EV-38F-AFTER-dla-learning-activities.json](../../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/EV-38F-AFTER-dla-learning-activities.json)  
- GAM: [EV-38F-AFTER-gam.txt](../../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/EV-38F-AFTER-gam.txt)  

**Comparators:**  
- Page/DLA: [EV-38E10-AFTER-*](../../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/)  
- Programme KM/LO shape: [ld-inflation-workshop-page-full.json](../../../../tests/fixtures/page-render/ld-inflation-workshop-page-full.json) · [affordance-records.json](../../../../tests/fixtures/sprint-38/affordance-records.json)  

---

## 1. Purpose and analytical lens

Formalise [38F-8](../../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md) into a **traceability review** across:

```text
Generate / Normalise  →  Knowledge Model  →  Learning Outcomes  →  Workbook Activities
```

**Working hypothesis (to investigate, not assume):**

> The workbook is **not exploiting pedagogical affordances already present** in the Knowledge Model and Learning Outcomes — not because material **types** are missing, but because **activity components** are thin or absent.

### 1.1 Material types ≠ activity components

| Plane | Examples on anchor | Role |
|-------|-------------------|------|
| **Material types** (artefacts) | `scenario`, `worked_example`, `analysis_table`, `sample_output`, `consolidation_summary` | **What** the learner sees as content blocks |
| **Activity components** (pedagogical functions) | orientation, concept elucidation, knowledge activation, misconception handling, worked reasoning, guidance, practice, verification, reflection | **How** the activity coaches the learner toward the LO |

**38-F proved:** material types can be **PASS** while activity components are **FAIL**.

### 1.2 Investigation questions

For each activity:

| Dimension | Review question |
|-----------|-----------------|
| **Concept coverage** | Which concepts are **required**, **taught**, or **assumed**? |
| **Knowledge activation** | What prior knowledge is **activated** vs **assumed**? |
| **Misconception handling** | Which KM misconceptions are **surfaced** vs **ignored**? |
| **Process utilisation** | Which KM processes are **demonstrated** vs **ignored**? |
| **Relationship utilisation** | Which KM relationships are **explained** vs **ignored**? |
| **Cognitive support** | Does support match LO cognitive demand (Understand / Apply / Analyse / Evaluate)? |

### 1.3 LO → Task vs coached arc

| Weak pattern (observed) | Strong self-study pattern (target bar) |
|-------------------------|----------------------------------------|
| `LO → Task` | `LO → Required concepts → KM affordances → Instructional decisions → Teaching → Task` |

**Out of scope:** Pack edits · `app.js` · pipelines · schema redesign · implementation.

---

## 2. Method and traceability limits

| Step | Action |
|------|--------|
| 1 | Map **canonical KM affordances** for the Inflation anchor from workflow brief, programme fixtures, and domain artefact schema. |
| 2 | Extract **LO affordances** from frozen EV-38F page outcomes + DLA `mapped_learning_outcomes`. |
| 3 | Trace **DLA → GAM → Design Page** for each activity; note **upstream vs learner-visible** fields. |
| 4 | Score **activity components** and **cognitive fit** per activity. |
| 5 | Contrast **38E10** (richer DLA cognition fields) and **38F page** (structural types retained, composition thinner). |

### 2.1 Harness limitation (explicit)

The [38F capture harness](../../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/ev-38f-inflation-pipeline-capture-once.mjs) **does not run** Generate/Normalise or Model Knowledge. It synthesises LOs with a short prompt, then DLA → GAM → Design Page.

| Implication | Handling in this analysis |
|-------------|---------------------------|
| No frozen `knowledge_model.json` for EV-38F | Reconstruct **canonical KM** from brief + golden inflation fixture + programme misconception signals |
| LOs not KM-derived in capture | Treat page/DLA LOs as **declared affordances**; compare to **expected KM coverage** |
| Analysis remains valid | Hypothesis concerns **exploitation** of affordances that **should** flow from brief/KM/LO — observable as gaps even when KM artefact is inferred |

**Brief affordances** ([run-log](../../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/EV-38F-AFTER-run-log.json)): CPI, **GDP deflator**, household scenarios, **policy communication**, first-year economics.

---

## 3. Executive verdict

| Lens | Verdict | Rationale |
|------|---------|-----------|
| **Material types (38-F structural)** | **PASS** | scenario · table · worked_example · sample_output · consolidation_summary present |
| **Professional workbook (first glance)** | **FAIL** | Thin coaching; LO→Task pattern; spoiler closure |
| **38C-1 R1–R7** | **FAIL** | R3 absent; R4 partial; R6 partial |
| **KM/LO exploitation hypothesis** | **Supported (provisional)** | Rich brief/KM-shaped content **available in programme**; workbook **uses subset**; Evaluate LO **orphaned**; GDP deflator / measure distinction **dropped**; cognition fields **lost at page** |

**One-line:** Structure works; **pedagogical affordances are under-translated** into activity components — the workbook presents tasks atop materials without the instructional chain needed for solo success.

---

## 4. Pedagogical affordances in the Knowledge Model

### 4.1 Canonical KM (reconstructed for Inflation anchor)

Derived from workflow brief, [ld-inflation-workshop-page-full.json](../../../../tests/fixtures/page-render/ld-inflation-workshop-page-full.json) `knowledge_summary` + materials, and [affordance-records.json](../../../../tests/fixtures/sprint-38/affordance-records.json) (CPI / PPI / GDP deflator distinction).

| KM slot | Affordances available for this topic |
|---------|--------------------------------------|
| **Concepts** | Inflation (general price level); purchasing power; **CPI**; **GDP deflator**; PPI; inflation **causes** (demand-pull, cost-push, built-in); household budget categories; **heterogeneous household impact**; **inflation management strategies**; monetary policy (introductory) |
| **Relationships** | Inflation **reduces** purchasing power; CPI **measures** inflation; CPI **contrasts with** GDP deflator (coverage); category inflation rates **differentially affect** budgets by spending share; income change **offsets or fails to offset** price rises; strategies **trade off** effectiveness / feasibility / risk |
| **Processes** | (1) **CPI inflation rate calculation**; (2) **category budget impact** estimation; (3) **cross-household comparison**; (4) **strategy evaluation** with criteria; (5) **consolidation / reflection** linking concepts to context |
| **Misconceptions** | Single price rise **vs** general inflation; **nominal** price change **vs** CPI-measured inflation; **CPI vs GDP deflator** conflation; **equal impact** across households; **income rise** automatically beats inflation |

### 4.2 KM affordances exploited on EV-38F-AFTER

| KM affordance | Exploited? | Where / evidence |
|---------------|:----------:|------------------|
| Inflation definition + causes | **Partial** | A1 `explanatory_text` — three causes listed; no misconception framing |
| CPI + inflation rate formula | **Yes** | A1 `worked_example` 4 steps |
| Purchasing power link | **Partial** | `sample_output` one bullet; not re-taught before A2 |
| GDP deflator / PPI / measure comparison | **No** | Brief promises; golden fixture has `comparison_table`; **absent** on 38F page |
| Household heterogeneity | **Partial** | Two scenarios + table; **identical** % shocks; no income-offset reasoning taught |
| Budget impact **process** | **Assumed** | A2 task asks estimates; **no** method, worked row, or formula |
| Strategy evaluation **process** | **Told only** | Strategies appear in spoiler `consolidation_summary`; **no** evaluate activity |
| CPI vs nominal misconception | **No** | 38E10 Study Tips mention it; **38F** Study Tips generic |
| CPI vs deflator misconception | **No** | Programme affordance record exists; workbook silent |
| Policy communication | **No** | In brief; not in page activities |

**KM exploitation rate (qualitative):** ~**35–40%** of canonical affordances reach learner-facing **teaching**; higher for **artefact presence** (CPI calc block) than for **instructional exploitation** (processes, misconceptions, contrasts).

---

## 5. Pedagogical affordances in the Learning Outcomes

### 5.1 Declared LOs (EV-38F page)

From `Learning Purpose and Outcomes` section:

| LO ID | Statement | Bloom level |
|-------|-----------|-------------|
| **LO1** | Understand inflation and its causes | **Understand** |
| **LO2** | Explain CPI and cost-of-living measurement | **Understand / Explain** |
| **LO3** | Analyze inflation impact on household budgets and purchasing power | **Analyze** |
| **LO4** | Evaluate strategies households can use to manage inflation | **Evaluate** |

### 5.2 LO → activity mapping (DLA truth)

From [EV-38F-AFTER-dla-learning-activities.json](../../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/EV-38F-AFTER-dla-learning-activities.json) `outcome_alignment`:

| Activity | Mapped LOs |
|----------|------------|
| **A1** | LO1, LO2 |
| **A2** | LO3 |
| **A3** | LO1, LO2, LO3, **LO4** |

### 5.3 LO affordances vs workbook expression

| LO | Cognitive demand | Taught before task? | Practised with support? | Verified? | Verdict |
|----|------------------|---------------------|-------------------------|-----------|---------|
| **LO1** Understand causes | Medium | **Partial** (A1 text) | **Partial** (read + worked example) | **No** | **LO → Task** on “answer questions” with no items |
| **LO2** Explain CPI | Medium–High | **Yes** (A1 materials) | **Partial** (no try-then-check) | **No** | Teaching present; **verification missing** |
| **LO3** Analyze household impact | High | **No** (A2 jumps to table) | **Thin** (scenario labels + empty cells) | **No** | **Assumes** analysis skill; checklist absent |
| **LO4** Evaluate strategies | **Highest** | **No** | **No** dedicated activity | **No** | **Orphaned** — only named in A3 task + spoiler essay |

**Pattern confirmed:** For LO3 and LO4 the workbook most often implements **`LO → Task`**, not the coached chain.

---

## 6. Workbook expression analysis

### 6.1 Pipeline trace summary

```text
Brief (CPI, GDP deflator, households, policy)
  ↓  [KM step SKIPPED in harness]
LOs (4 outcomes, Understand → Evaluate)
  ↓
DLA (3 activities; preambles authored; no cognition fields)
  ↓
GAM (6 materials; types satisfied; no checklist/cards/prompt_set)
  ↓
Design Page (preambles DROPPED; materials preserved; spoiler consolidation)
  ↓
Learner: materials present, coaching thin
```

### 6.2 Material types on page (structural PASS)

| Activity | Material types | Activity components (learner-visible) |
|----------|----------------|-------------------------------------|
| **A1** | `explanatory_text`, `worked_example`, `sample_output` | Concept elucidation + worked reasoning **Present**; orientation, activation, verification **Absent** on page |
| **A2** | `scenario`, `analysis_table` | Practice scaffold **Partial**; guidance, verification **Absent** |
| **A3** | `consolidation_summary` (spoiler body) | Reflection **contradicted** by model answer; evaluate **not practised** |

### 6.3 Upstream vs learner-visible loss (critical)

| Field / component | In 38F DLA? | On 38F page? | In 38E10 page? |
|-------------------|:-----------:|:------------:|:--------------:|
| `activity_preamble` | **Yes** (all 3) | **No** | **Yes** |
| `support_note` | **No** | **No** | **Yes** |
| `prior_knowledge_activation` | **No** | **No** | **Yes** (A1) |
| `reasoning_orientation` | **No** | **No** | **Yes** (A2–A3) |
| `failure_mode` | **No** | **No** | (not checked) |
| `checklist` / `task_cards` / `prompt_set` | **No** | **No** | **Yes** |
| `modelling_note` | **No** (activity dropped) | **No** | **Yes** (A3) |
| `knowledge_summary` section | N/A | **No** | N/A (fixture has it) |

**Correction to [38F-8](../../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md):** Preambles were **authored in DLA** but **not preserved on the Design Page**. The gap is **traceability loss at compose**, not complete absence upstream — though DLA still lacks cognition fields present in 38E10.

### 6.4 Instructional density (session level)

| Component | Expected for professional self-study | On EV-38F-AFTER |
|-----------|--------------------------------------|-----------------|
| Framing / orientation | Per-activity + session map | Generic Welcome only |
| Concept explanation | Before each new demand | **A1 only** |
| Knowledge activation | Before Apply/Analyze | **Absent** |
| Misconception alerts | At known confusion points | **Absent** |
| Worked reasoning | Before parallel practice | **A1 yes**; **A2 no** |
| Guidance | Complete task + method | **Incomplete** (hollow questions; no calc method) |
| Self-checks | ≥2 episodes ([38C-1 R3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) | **0** |
| Reflection | Non-spoiler closure | **Undermined** by model essay |

**Density verdict:** **Insufficient** for LO3–LO4 solo completion — not because the session is short, but because **instructional components before the task** are missing where cognitive demand rises.

### 6.5 38E10 → 38F compression

| Dimension | 38E10 | 38F | Pedagogical impact |
|-----------|-------|-----|-------------------|
| Activities | 4 | 3 | **LO4 practice activity removed** |
| Evaluate step | Dedicated A3 + `modelling_note` | None | **Evaluate → Tell** in consolidation |
| A2 materials | `task_cards` + `checklist` | `scenario` + `analysis_table` | **Structural win** (V-05) without **verification replacement** |
| Study Tips | Misconception-aware | Generic | KM misconception affordance **unused** |

---

## 7. Activity component analysis

Activity components scored: **Present** · **Partial** · **Absent** per activity on **learner-visible page** (primary) with DLA upstream note.

### 7.1 Component legend

| Component | Definition |
|-----------|------------|
| **Orientation** | Why this activity now; link to prior activity |
| **Concept elucidation** | Teaches ideas needed for the task |
| **Knowledge activation** | Surfaces prior knowledge explicitly |
| **Misconception handling** | Names and corrects likely errors |
| **Worked reasoning** | Expert process visible before learner attempt |
| **Guidance** | Complete, executable “what to do” |
| **Practice** | Substantive learner attempt with materials |
| **Verification** | Self-check before continue |
| **Reflection** | Learner-generated closure |

### 7.2 A1 — Studying Inflation Concepts with Worked Example

**Mapped LOs:** LO1, LO2 · **Cognitive level:** Understand / Explain

| Component | Score | Notes |
|-----------|-------|-------|
| Orientation | **Absent** | DLA preamble **not on page** |
| Concept elucidation | **Present** | `explanatory_text` + causes |
| Knowledge activation | **Absent** | No prior-knowledge prompt |
| Misconception handling | **Absent** | Nominal vs CPI not addressed |
| Worked reasoning | **Present** | 4-step CPI example |
| Guidance | **Partial** | “Answer questions…” — **no questions authored** |
| Practice | **Partial** | Implicit recall only |
| Verification | **Absent** | No checklist / prompt_set |
| Reflection | **N/A** | |

**Concept coverage**

| Concept | Required | Taught | Assumed |
|---------|:--------:|:------:|:-------:|
| Inflation definition | ● | ● | |
| Inflation causes (3) | ● | ● | |
| CPI as measure | ● | ● | |
| Inflation rate formula | ● | ● | |
| Purchasing power | ● | Partial | |
| GDP deflator contrast | | | ● (not in LO2 practice) |

**KM processes:** CPI calculation **demonstrated**; interpretation **partial**.

**Cognitive support:** Adequate for **passive Understand**; **inadequate** for Explain-with-evidence (no authored prompts).

---

### 7.3 A2 — Analyzing Inflation Impact (Scenarios + Table)

**Mapped LOs:** LO3 · **Cognitive level:** Analyze

| Component | Score | Notes |
|-----------|-------|-------|
| Orientation | **Absent** | No bridge from CPI lesson to household budgets |
| Concept elucidation | **Absent** | No teaching for budget-impact analysis |
| Knowledge activation | **Absent** | |
| Misconception handling | **Absent** | Equal-impact / income-offset not surfaced |
| Worked reasoning | **Absent** | No worked table row or formula |
| Guidance | **Partial** | Steps without **how** to compute $ impact |
| Practice | **Present** | Empty table cells — but **low cognitive depth** (repeat ×%) |
| Verification | **Absent** | No checklist (38E10 had 7 items) |
| Reflection | **N/A** | Notes column only |

**Concept coverage**

| Concept | Required | Taught | Assumed |
|---------|:--------:|:------:|:-------:|
| Expenditure categories | ● | Listed in scenario | |
| Category-specific inflation rates | ● | Given | |
| Budget impact calculation | ● | | ● |
| Income vs inflation offset | ● | | ● |
| Cross-household comparison | ● | | ● |
| Purchasing power analysis | ● | | ● |

**KM processes:** Process (2) and (3) **required** but **not demonstrated** — learner must invent method.

**Cognitive support:** **Mismatch** — **Analyze** LO with **Apply-level** mechanical fill if learner guesses formula.

---

### 7.4 A3 — Consolidation Summary and Reflection

**Mapped LOs:** LO1–LO4 · **Cognitive level:** Synthesize + **Evaluate** (LO4)

| Component | Score | Notes |
|-----------|-------|-------|
| Orientation | **Absent** | |
| Concept elucidation | **Spoiler** | Model essay **teaches** instead of learner |
| Knowledge activation | **Absent** | |
| Misconception handling | **Absent** | |
| Worked reasoning | **Absent** | No modelling for evaluation |
| Guidance | **Poor** | Write summary **while** full summary supplied |
| Practice | **Partial** | Writing task undermined |
| Verification | **N/A** | |
| Reflection | **Partial** | Prompt in task; **no** `reflection_prompts` material |

**LO4 (Evaluate):** **Required** for closure — **never practised** in a prior activity. Strategies **asserted** in spoiler text, not **evaluated** with criteria.

**Cognitive support:** **Severe mismatch** — Evaluate demand with **no** evaluative practice arc.

---

### 7.5 Missing activity (38E10 A3 — Evaluate Strategies)

| Component | Expected for LO4 | 38F |
|-----------|----------------|-----|
| Concept elucidation | Criteria for strategy quality | **Absent** |
| Worked reasoning | `modelling_note` | **Absent** |
| Guidance | `prompt_set` (6 prompts) | **Absent** |
| Practice | Evaluation report | **Absent** |
| Verification | Implicit in prompts | **Absent** |

This activity is the **main LO4 exploitation point** removed in 38F compression.

---

## 8. Cognitive progression analysis

### 8.1 Intended progression (from LO set)

```text
Understand (LO1) → Explain (LO2) → Analyze (LO3) → Evaluate (LO4) → Consolidate
```

### 8.2 Actual 38F progression

```text
Understand/Explain (A1 materials, weak task)
    → Analyze-labelled practice (A2, Apply-level workload)
        → Tell + Write (A3, LO4 unpractised)
```

| Transition | Expected support | Actual |
|------------|------------------|--------|
| LO2 → LO3 | Bridge: CPI change → household budget; worked partial row | **Jump** to table |
| LO3 → LO4 | Teach criteria; model evaluation; prompt_set | **Skip** — strategies in essay |
| Session → Close | Empty template + reflection | **Spoiler** summary |

### 8.3 Cognitive demand vs instructional support

| Activity | LO level | Support level | Fit |
|----------|----------|---------------|-----|
| A1 | Understand / Explain | Medium (materials) / Low (task) | **Partial** |
| A2 | Analyze | Low (no method, thin scenario) | **Fail** |
| A3 | Evaluate + synthesize | Spoiler replaces effort | **Fail** |

**Fading:** Not observed — support **decreases** as cognitive demand **increases** (inverse of workbook pedagogy).

---

## 9. Points where pedagogical value is lost

### 9.1 Traceability loss map

| Stage | What is available | What learner receives | Loss type |
|-------|-------------------|----------------------|-----------|
| **Brief → KM** | GDP deflator, policy communication | Not in workbook | **Scope dropout** (harness + DLA) |
| **KM → LO** | Measure distinction, misconceptions | LO2 narrow (CPI only) | **Affordance narrowing** |
| **LO → DLA** | LO4 Evaluate | No evaluate activity | **Arc truncation** |
| **DLA → Page** | `activity_preamble` (all acts) | Dropped | **Compose loss** |
| **DLA → Page** | Cognition fields (38E10 pattern) | Never authored in 38F DLA | **Authoring gap** |
| **DLA → GAM** | Need checklist / prompts for R3 | Types only | **Component not specified** |
| **GAM → Page** | `consolidation_summary` as template | Full model essay | **Genre mis-realisation** |
| **KM misconceptions → materials** | CPI/deflator, nominal vs inflation | Silent | **Unused affordance** |

### 9.2 Hypothesis assessment

| Hypothesis element | Finding |
|--------------------|---------|
| Structure largely working | **Confirmed** — 38-F structural PASS |
| Problem is educational quality | **Confirmed** |
| Not exploiting KM/LO affordances | **Supported** — canonical KM/brief **richer** than workbook; LO4 **unpractised**; processes/misconceptions **ignored** |
| Material types mask missing components | **Confirmed** — types present; orientation/verification/evaluate chain **absent** |

**Status:** Working hypothesis **supported** on anchor evidence — not yet a programme-wide conclusion.

### 9.3 Gap framework (for 38G-2) — condensed

| ID | Gap | Severity | Root pattern |
|----|-----|----------|--------------|
| **GQ-KM** | KM affordances not translated to teaching | **Critical** | Brief/KM ⊃ page concepts |
| **GQ-LO** | LO → Task without instructional chain | **Critical** | LO3/LO4 |
| **GQ-COG** | Inverse support vs cognitive demand | **Critical** | A2, A3 |
| **GQ-02** | Orientation / preamble lost or absent | **High** | Page drops DLA preambles |
| **GQ-03** | Incomplete guidance | **High** | Hollow questions; no method |
| **GQ-07** | Verification absent | **Critical** | R3 |
| **GQ-08** | Evaluate activity omitted | **Critical** | LO4 orphan |
| **GQ-10** | Spoiler consolidation | **High** | R4 partial |
| **GQ-MIS** | Misconceptions unused | **Medium** | KM → Study Tips gap |

### 9.4 Full gap register (GQ-01–GQ-10)

Normative gap categories for the activity component model (initial 38G-1 pass; retained alongside §9.3 traceability overlays). Each gap: **ID**, **definition**, **severity**, **38C link**, **38G-2 component slot** (name only — 38G-2 defines criteria).

| ID | Gap name | Definition (what “good” lacks on anchor) | Severity | 38C-1 | 38G-2 slot |
|----|----------|--------------------------------------------|----------|-------|------------|
| **GQ-01** | **Teaching-before-outcome** | Learning outcomes promise capabilities (e.g. evaluate strategies) **not taught or practised** in-page before closure. | **Critical** | R1 Partial; R6 | `outcome_alignment` |
| **GQ-02** | **Missing activity preamble** | No learner-facing **why / what you will do / prerequisite link** before each activity’s task. | **High** | R1 Partial | `preamble` |
| **GQ-03** | **Incomplete learner task** | `learner_task` references artefacts or actions **not authored** (questions, method, sequence). | **High** | R2 Partial | `guidance` |
| **GQ-04** | **Under-scaffolded practice** | Practice demands output without **worked partial**, formula box, decision sequence, or success criteria. | **High** | R2 Partial; R5 | `practice_scaffold` |
| **GQ-05** | **Thin scenario** | `scenario` Material is label list not **analysable case** (narrative, constraints, hooks, differentiated shocks). | **High** | R2 Partial | `scenario_body` |
| **GQ-06** | **Duration–workload mismatch** | `duration_minutes` **≥~1.5×** realistic effort for authored prompts and materials. | **Medium** | R7 Partial | `duration_credibility` |
| **GQ-07** | **Missing verification beat** | No **≥2** explicit self-check episodes (checklist, prompt_set, try-then-check) per [38C-1 §3.7](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md). | **Critical** | R3 Absent | `self_check` |
| **GQ-08** | **Broken session arc** | Activity count or ordering drops **mandatory pedagogical step** (here: strategy evaluation before consolidation). | **Critical** | R6 Partial | `sequencing` |
| **GQ-09** | **Weak connective coaching** | No bridges between activities; generic front matter; no “before you continue” rhythm. | **High** | R1 Partial; fading Absent | `coaching_voice` |
| **GQ-10** | **Spoiler consolidation** | Closure material is **model answer** while task requires **learner-generated** synthesis. | **High** | R4 Partial | `closure_template` |

**Severity scale**

| Level | Meaning for 38G |
|-------|-----------------|
| **Critical** | Blocks **professional workbook PASS** or **38C-1 R1–R4**; must be addressed in 38G-3 obligations |
| **High** | Major first-glance FAIL contributor; visible on single activity review |
| **Medium** | Credibility / UX; paired with High gaps on same activity |
| **Low** | Secondary (e.g. table column balance) — **out of charter** unless amended |

**Gap → activity matrix**

| Gap ID | A1 | A2 | A3 | Page | Missing act |
|--------|:--:|:--:|:--:|:----:|:-----------:|
| GQ-01 | | | ● | ● | ● |
| GQ-02 | ● | ● | ● | ● | |
| GQ-03 | ● | ● | ● | | |
| GQ-04 | | ● | | | |
| GQ-05 | | ● | | | |
| GQ-06 | ● | ● | ● | | |
| GQ-07 | ● | ● | | | ● (would be A3 on 38E10) |
| GQ-08 | | | ● | ● | ● |
| GQ-09 | | ● | | ● | |
| GQ-10 | | | ● | | |

### 9.5 Cross-cutting patterns (symptom → root pattern)

| 38-F symptom ([CONTEXT-FOR-NEXT-CHAT](../CONTEXT-FOR-NEXT-CHAT.md)) | Root pattern on anchor | Gap IDs |
|---------------------------------------------------------------------|------------------------|---------|
| Activities assume prior teaching | Outcome–activity misalignment; dropped strategy activity | GQ-01, GQ-08 |
| Learner tasks under-scaffolded | Task text not backed by materials/method | GQ-03, GQ-04 |
| Scenarios too thin | Scenario authored as data labels | GQ-05 |
| Timings unrealistic | Labels decoupled from authored workload | GQ-06 |
| Coaching voice weak | No preambles or bridges | GQ-02, GQ-09 |
| Verification weak | Structural types present; **beats** absent | GQ-07 |
| Consolidation spoiler-like | `consolidation_summary` = answer key | GQ-10 |
| Activities feel assembled | Blocks without connective coaching | GQ-09 + all High gaps |

**Single sentence diagnosis:** The page satisfies **workbook material taxonomy** but not **workbook instructional composition** — learners receive blocks to read and fill, not a **coached session** with teach → practise → verify → integrate → reflect.

---

## 10. Implications for 38G-2

38G-2 should define an **activity component model** that:

1. **Separates** material type obligations (hold 38-F) from **component** obligations (new).
2. **Requires traceability rows** per activity: `mapped_LO → required_concepts → KM hooks → components → materials`.
3. **Names normative components** aligned to this analysis:

| 38G-2 component | Source in §7 |
|-----------------|--------------|
| `orientation` | Orientation |
| `concept_elucidation` | Concept elucidation |
| `knowledge_activation` | Knowledge activation |
| `misconception_handling` | Misconception handling |
| `worked_reasoning` | Worked reasoning |
| `guidance` | Guidance |
| `practice` | Practice |
| `verification` | Verification |
| `reflection` | Reflection |

4. **Adds cognitive-fit rule:** instructional support **must not decrease** as Bloom level rises across the session arc.
5. **Adds LO integrity rule:** **Evaluate** LOs require **evaluative practice** before consolidation — not essay-only mention.
6. **Adds exploitation rule:** when brief/KM includes **contrasts** (e.g. CPI vs GDP deflator) or **misconceptions**, workbook must **surface** them in components or record justified omission.
7. **Maps fields** for pack traceability (38G-3 targets): `activity_preamble`, `prior_knowledge_activation`, `support_note`, `reasoning_orientation`, `prompt_set`, `checklist`, `modelling_note`, `reflection_prompts` — plus **anti-spoiler** `consolidation_summary` discipline.
8. **Preserves compose fidelity:** DLA-authored orientation fields must reach learner page (observation for 38G-4 — **not** Design Page sprint; pack may strengthen DP contract language).

### 10.1 Hold conditions (unchanged)

Retain V-01, V-05, worked_example, sample_output, consolidation_summary **type**, preservation — improve **component density** inside those types.

### 10.2 Professional PASS bar (unchanged intent)

[38C-1 §5.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) R1–R7 **Present**; coached arc; no critical GQ-* gaps; structural hold PASS.

---

## 11. Completion statement

| Deliverable section | Met? |
|---------------------|:----:|
| 1. KM pedagogical affordances | **Yes** — §4 |
| 2. LO pedagogical affordances | **Yes** — §5 |
| 3. Workbook expression analysis | **Yes** — §6 |
| 4. Activity component analysis | **Yes** — §7 |
| 5. Cognitive progression analysis | **Yes** — §8 |
| 6. Points where value is lost | **Yes** — §9 |
| 7. Implications for 38G-2 | **Yes** — §10 |
| No implementation | **Yes** |
| Hypothesis investigated (not assumed) | **Yes** — §9.2 |

**Slice 38G-1:** **COMPLETE**  
**Next slice:** **38G-2** — Activity component model (`observations/38G-2-activity-component-model.md`)

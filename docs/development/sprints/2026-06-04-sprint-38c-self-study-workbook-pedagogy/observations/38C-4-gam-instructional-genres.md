# Slice 38C-4 — GAM instructional genres

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Authority:** [38C-1-workbook-pedagogy-model.md](38C-1-workbook-pedagogy-model.md) · [38C-2-workbook-gap-analysis.md](38C-2-workbook-gap-analysis.md) · [38C-3-dla-workbook-requirements.md](38C-3-dla-workbook-requirements.md)  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md) § 38C-4  
**Out of scope:** DLA requirement changes (38C-3) · page/HTML design (38C-5) · implementation

---

## 1. Purpose

Define **instructional genres** that **Generate Activity Materials (GAM)** must be able to **author** so [38C-3](38C-3-dla-workbook-requirements.md) workbook obligations become **learner-visible bodies** on the composed page — not table-only reference content.

**Success for this slice:** A reviewer can inspect GAM output (organised text or `activity_materials`) and judge whether each genre is **present**, **thin**, or **anti-pattern**, and whether the mix is **insufficient for workbook pedagogy** when only tables appear.

---

## 2. Inputs and assumptions

| Input | Role |
|-------|------|
| [38C-1](38C-1-workbook-pedagogy-model.md) | Workbook functions and MVP bar |
| [38C-2](38C-2-workbook-gap-analysis.md) | EV-01 failure modes; EV-03 comparator |
| [38C-3](38C-3-dla-workbook-requirements.md) | DLA → GAM obligation source (§8, §10) |
| `domain-learning-design-artefacts.md` | Controlled `required_materials.type` + strict content schemas |
| **EV-01-G** | [ev-38b4-01-pipeline-gam.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-pipeline-gam.txt) — 4 table types only |
| **EV-03-G** | [ev-38b4-03-inflation-gam-live.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-inflation-gam-live.txt) — 8 types |
| **GOLDEN** | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` — workshop `activity_materials` mix |

**Assumptions:**

1. GAM **must realise every** `required_materials` entry from DLA — no redesign of activities ([pack role](38C-3-dla-workbook-requirements.md)).  
2. **`LD-MATERIALS-COPY`** and **`LD-TABLE-FIDELITY`** remain authoritative for verbatim bodies and pipe tables — 38C-4 adds **genre obligations**, not new preserve rules.  
3. Table-specific keys (`analysis_table`, `comparison_table`, …) are **reference_table** family members in this catalogue.  
4. Planning genre names may extend domain controlled values (`text` for exposition) — execution alignment is a future charter concern.

---

## 3. GAM responsibility model

### 3.1 What GAM owns

| Responsibility | Description |
|----------------|-------------|
| **Full material bodies** | Prose, scenarios, cards, checklists, tables, examples — all `Content` in organised GAM text or `activity_materials[].content` |
| **Pipe-table authoring** | Structured tables per `LD-TABLE-FIDELITY` when DLA specifies table types |
| **Genre mix per activity** | One `Material:` block per `required_materials` entry; all entries realised |
| **Learner-ready usability** | No placeholder labels; bodies match `purpose` + `specification` |
| **Workbook function realisation** | Teaching, retrieval, example, closure **bodies** that Design Page can only preserve |
| **Usage metadata** (when JSON) | How learner interacts — adapted for self-directed where brief requires |

### 3.2 What GAM does not own

| Not owned | Owner |
|-----------|--------|
| Which activities exist; material **types** required | **DLA** |
| `learner_task` / `expected_output` wording | **DLA** (GAM anchors, does not replace) |
| Page section order; merge into `page.sections` | **Design Page** |
| HTML/CSS; card vs table layout | **Renderer** / **38C-5** |
| Sprint 38 visual affordances | **Design Page** page-root |
| Session duration budget | **DLA** |

### 3.3 Relationship to DLA and Design Page

```text
DLA required_materials[]  →  GAM authors bodies (this slice)
                         →  Design Page copies to activity.materials (preserve)
                         →  Renderer displays (38C-5)
```

| Checkpoint | GAM | Design Page |
|------------|-----|-------------|
| Scenario in DLA spec | Must author named cases with numbers/context | Must not drop |
| Scenario absent in DLA | Must not invent for workbook compliance | Cannot recover |
| Table-only GAM output | **Insufficient** for workbook ([§5](#5-table-specific-rules)) | Can still preserve tables faithfully |

---

## 4. Material genre catalogue

*Reviewer recognition:* each genre has a **type key** (domain or table family), minimum body shape, and supported **38C-1 functions**.

---

### 4.1 `scenario`

| Field | Definition |
|-------|------------|
| **Purpose** | Situate learning in named cases with concrete context (prices, households, roles). |
| **DLA trigger** | Task/preamble references scenarios, cases, households; [38C-3 §4.1 guided practice](38C-3-dla-workbook-requirements.md) |
| **GAM must author** | ≥2 distinct cases with **specific details** (domain schema: `scenario_title` + `text` per case, or equivalent markdown headings). |
| **Learner evidence** | Scenario cards / headings before worksheet; not empty `materials.scenario`. |
| **Anti-patterns** | “Set of scenarios describing…” label only; scenario text in `learner_task` but no material block ([EV-01 A3](38C-2-workbook-gap-analysis.md)). |
| **Functions** | Guided practice, transfer context, explanatory teaching (partial) |

**EV-03-G excerpt:** A1 Scenarios 1–2 with $ prices; A3 Scenarios A–D ([ev-38b4-03-inflation-gam-live.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-inflation-gam-live.txt)).

---

### 4.2 `worked_example` (maps DLA `sample_output` / stepped `template`)

| Field | Definition |
|-------|------------|
| **Purpose** | Expert completes one instance **step-by-step** before parallel learner work. |
| **DLA trigger** | [38C-3 Require worked examples](38C-3-dla-workbook-requirements.md); `type: sample_output` or `template` with stepped spec |
| **GAM must author** | Ordered steps with **intermediate results**; one clear method; does not complete the learner’s parallel blank worksheet. |
| **Learner evidence** | Numbered stages / “Example solution” block; learner task says “use the same method”. |
| **Anti-patterns** | Fully filled learner worksheet passed off as example; answer key without reasoning ([38C-1 §3.2](38C-1-workbook-pedagogy-model.md)). |
| **Functions** | Worked examples, modelling (partial) |

**EV-01:** **Absent** — no `sample_output` / stepped template block.

---

### 4.3 `modelling_note` / `reasoning_walkthrough`

| Field | Definition |
|-------|------------|
| **Purpose** | Visible expert **reasoning** — criteria, checks, decisions — not only final answers. |
| **DLA trigger** | [38C-3 Encourage modelling](38C-3-dla-workbook-requirements.md); `reasoning_orientation` + material spec |
| **GAM must author** | “First check… because…” prose OR annotated decision on one row/classification; criteria list before practice. |
| **Learner evidence** | Reasoning block in materials or preamble-length modelling section (not only JSON `reasoning_orientation`). |
| **Anti-patterns** | Worked example with numbers but no decision rules; facilitator `usage` only. |
| **Functions** | Modelling, explanatory teaching (partial) |

**EV-01:** **Absent** as material; cognition fields on A5 may not render ([38C-2 §5.4](38C-2-workbook-gap-analysis.md)).

---

### 4.4 `task_cards`

| Field | Definition |
|-------|------------|
| **Purpose** | Discrete guided steps the solo learner completes in sequence. |
| **DLA trigger** | [38C-3 Require retrieval](38C-3-dla-workbook-requirements.md) ≥2 activities; early-activity support |
| **GAM must author** | ≥3 cards with **actionable** imperative prompts; domain schema: `{ "text": "..." }` per card. |
| **Learner evidence** | Card grid / numbered cards in HTML; tasks separable from one blob paragraph. |
| **Anti-patterns** | “Complete the activity” single card; Card 6 “Agree with your group” on solo workbook without solo variant ([EV-03 A1 Card 6](38C-2-workbook-gap-analysis.md)). |
| **Functions** | Guided practice, retrieval, fading (early) |

**EV-03-G:** A1 six task cards. **EV-01:** **Absent**.

---

### 4.5 `prompt_set`

| Field | Definition |
|-------|------------|
| **Purpose** | Open questions requiring short written answers — interpretation, comparison, reflection. |
| **DLA trigger** | Retrieval, evaluative judgement, capstone discussion |
| **GAM must author** | Numbered prompts with **clear answer expectation** (1–3 sentences each minimum spec). |
| **Learner evidence** | Prompt list block; linked to table or scenario just above. |
| **Anti-patterns** | Vague “discuss”; prompts with no link to materials provided. |
| **Functions** | Retrieval, evaluative judgement, synthesis (partial) |

**EV-03-G:** A2 three prompts; A5 wrap-up prompts. **EV-01:** **Absent**.

---

### 4.6 `checklist`

| Field | Definition |
|-------|------------|
| **Purpose** | Self-check before submit — completeness and quality gates. |
| **DLA trigger** | [38C-3 Require retrieval](38C-3-dla-workbook-requirements.md); after table/prompt activities |
| **GAM must author** | Domain schema: sections + checkable items tied to `expected_output` ([GOLDEN A2](38C-2-workbook-gap-analysis.md)). |
| **Learner evidence** | Checkbox list “Before you continue / submit”. |
| **Anti-patterns** | Generic “did you finish?” without criteria; checklist without prior task ([38C-2 anti-pattern](38C-2-workbook-gap-analysis.md)). |
| **Functions** | Retrieval, guided practice |

**EV-03-G:** A2 submission check. **EV-01:** **Absent**.

---

### 4.7 `template`

| Field | Definition |
|-------|------------|
| **Purpose** | Partially completed structure learner fills in (blank fields). |
| **DLA trigger** | Guided practice; capstone plan outline |
| **GAM must author** | `fields` array or markdown with **empty cells** / labelled blanks — not full solution. |
| **Learner evidence** | Worksheet template with gaps; distinct from reference table. |
| **Anti-patterns** | Template that is a copy of reference table with all cells filled. |
| **Functions** | Guided practice, synthesis, transfer |

---

### 4.8 `sample_output` (domain type — often **worked_example** body)

| Field | Definition |
|-------|------------|
| **Purpose** | Exemplar output showing quality bar (may be full solution for **different** item than learner’s). |
| **DLA trigger** | Worked example Require; evaluative judgement |
| **GAM must author** | Full string or array with **annotated** quality features called out in prose. |
| **Learner evidence** | “Sample response” section separate from learner template. |
| **Anti-patterns** | Sample = learner’s exact task pre-answered. |
| **Functions** | Worked examples, evaluative judgement |

---

### 4.9 `misconception_note`

| Field | Definition |
|-------|------------|
| **Purpose** | Name common error + correction for self-study. |
| **DLA trigger** | [38C-3 Encourage misconceptions](38C-3-dla-workbook-requirements.md) |
| **GAM must author** | “Common mistake: … Instead: …” learner-facing callout. |
| **Learner evidence** | Aside / callout in materials or after task. |
| **Anti-patterns** | `failure_mode` only in activity JSON (facilitator tone). |
| **Functions** | Misconceptions |

---

### 4.10 `retrieval_check` / `self_check`

| Field | Definition |
|-------|------------|
| **Purpose** | Low-stakes recall — cover-and-recall, mini-quiz, “without looking”. |
| **DLA trigger** | [38C-3 Require retrieval](38C-3-dla-workbook-requirements.md) (≥2 episodes) |
| **GAM must author** | Question + expected check (answer hint or self-grade criterion). |
| **Learner evidence** | Distinct from reflection; expects **correctness** check. |
| **Anti-patterns** | Retrieval = “reflect on feelings” only ([§9](#9-anti-pattern-catalogue)). |
| **Functions** | Retrieval |

*Note:* MCQ may come from assessment step — outside GAM-only path ([38C-3 Q5](38C-3-dla-workbook-requirements.md)).

---

### 4.11 `consolidation_summary`

| Field | Definition |
|-------|------------|
| **Purpose** | Session closure — **what to remember**, not new teaching. |
| **DLA trigger** | [38C-3 Require consolidation](38C-3-dla-workbook-requirements.md) |
| **GAM must author** | ≥80 words summarising ≥3 session ideas; optional reflection prompt pair. |
| **Learner evidence** | Final section material or dedicated activity body — not outcomes list repeat. |
| **Anti-patterns** | Consolidation = repetition of all tables ([EV-01 A5](38C-2-workbook-gap-analysis.md)). |
| **Functions** | Consolidation |

**EV-01:** **Absent**. **EV-03 A5:** prompt_set only — **partial** closure, not full summary genre.

---

### 4.12 `reflection_prompt`

| Field | Definition |
|-------|------------|
| **Purpose** | Metacognitive look-back — what changed in understanding. |
| **DLA trigger** | Encourage with consolidation; capstone |
| **GAM must author** | 2–4 open prompts (“What surprised you…”, “What would you do differently…”). |
| **Learner evidence** | Reflection subsection after practice. |
| **Anti-patterns** | Reflection without prior retrieval check. |
| **Functions** | Consolidation (partial), transfer (partial) |

---

### 4.13 `transfer_prompt`

| Field | Definition |
|-------|------------|
| **Purpose** | Apply ideas to **learner’s own** context. |
| **DLA trigger** | [38C-3 Encourage transfer](38C-3-dla-workbook-requirements.md); capstone |
| **GAM must author** | Explicit “your household / your role / your data” prompts with completion criteria. |
| **Learner evidence** | Transfer subsection on capstone activity. |
| **Anti-patterns** | Only third-person scenarios throughout. |
| **Functions** | Transfer, synthesis |

---

### 4.14 `rubric` / `quality_criteria`

| Field | Definition |
|-------|------------|
| **Purpose** | How to judge quality of comparison, ranking, or written plan. |
| **DLA trigger** | [38C-3 Require evaluative judgement](38C-3-dla-workbook-requirements.md) on rank/compare activities |
| **GAM must author** | 3–5 criteria with performance levels OR must/should bullets for justification. |
| **Learner evidence** | Criteria list adjacent to ranking task. |
| **Anti-patterns** | Pre-filled scores in table ([EV-01 A4 ratings](38C-2-workbook-gap-analysis.md)). |
| **Functions** | Evaluative judgement |

---

### 4.15 `exemplar` / `comparison_pair`

| Field | Definition |
|-------|------------|
| **Purpose** | Show strong vs weak response (or two approaches) for judgement training. |
| **DLA trigger** | Evaluative judgement Encourage/Require |
| **GAM must author** | Two labelled exemplars + “why B is stronger” commentary. |
| **Learner evidence** | Side-by-side or sequential exemplar blocks. |
| **Anti-patterns** | Single exemplar only when comparison required. |
| **Functions** | Evaluative judgement, modelling |

---

### 4.16 `reference_table` (family: `classification_table`, `comparison_table`, `analysis_table`, `impact_table`, …)

| Field | Definition |
|-------|------------|
| **Purpose** | Structured reference or **worksheet** grid — definitions, comparison, data entry. |
| **DLA trigger** | When DLA lists table type with purpose (classify, compare, analyse) |
| **GAM must author** | Pipe markdown per `LD-TABLE-FIDELITY`; learner-completion columns **empty** unless row is reference data only. |
| **Learner evidence** | `<table>` with headers; blank cells where learner writes. |
| **Anti-patterns** | Table-only session; pre-filled judgement columns; comma-row pseudo-tables (B4). |
| **Functions** | Explanatory teaching (partial), guided practice, reference — **not sufficient alone** for workbook |

**EV-01-G:** **Only** this family — four keys, all activities.

---

### 4.17 `text` / `exposition` (domain `text`; planning genre for teaching prose)

| Field | Definition |
|-------|------------|
| **Purpose** | Connect concepts in prose outside table cells — session or activity exposition. |
| **DLA trigger** | [38C-3 Require explanatory teaching](38C-3-dla-workbook-requirements.md) |
| **GAM must author** | ≥120 words linking ≥2 ideas when DLA requires exposition material. |
| **Learner evidence** | Prose section in materials or session-level block merged to page. |
| **Anti-patterns** | Relying on Design Page intro only. |
| **Functions** | Explanatory teaching |

**EV-01 / EV-03:** Not observed as dedicated exposition block — teaching **Partial** via tables + short intro.

---

## 5. Table-specific rules

### 5.1 When tables are useful

| Use | Role |
|-----|------|
| Comparison matrices | CPI vs PPI vs GDP deflator |
| Classification worksheets | Term ↔ category blanks |
| Budget / impact grids | Numeric practice with empty cells |
| Reference data | Fixed definitions learner cites |

Tables are **support material** for practice — not the entire pedagogy.

### 5.2 When tables become anti-patterns

| Anti-pattern | Workbook impact |
|--------------|-----------------|
| **Table-only workbook** | Fails [38C-1 §4](38C-1-workbook-pedagogy-model.md) variety + R1/R3/R4 — **[EV-01](38C-2-workbook-gap-analysis.md)** |
| **Pre-filled judgement columns** | Cosmetic ranking — GAP-09 |
| **Reference dump on capstone** | All prior tables re-posted — GAP-08 |
| **Definitions-only encyclopaedia** | Reference notes genre, not workbook |
| **Filled analysis rows when learner should analyse** | Spoils A3-style tasks ([EV-03 A3 table pre-filled](38C-2-workbook-gap-analysis.md) — workshop hazard) |

### 5.3 Approved combinations (planning)

| Pattern | Genres | Functions served |
|---------|--------|------------------|
| **Table + scenario** | `scenario` → `analysis_table` (empty learner columns) | Guided practice, teaching |
| **Table + task card** | `task_cards` → `comparison_table` | Retrieval, guided practice |
| **Table + worked example** | `sample_output` (steps) → `template` (blanks) | Worked examples, practice |
| **Table + checklist** | `comparison_table` + `prompt_set` → `checklist` | Retrieval, judgement |
| **Table + consolidation** | Last activity: `consolidation_summary` + **no** full table reprint | Consolidation |

### 5.4 Reference dump warning

When capstone `required_materials` lists **all** table types from A1–An, GAM must **not** treat that as compliance. Author instead:

- `transfer_prompt` + plan `template` + optional **one** lookup stub (not four full tables).

[38C-3 §5 anti-spec](38C-3-dla-workbook-requirements.md) · [38C-2 GAP-08](38C-2-workbook-gap-analysis.md).

### 5.5 Classification: table-only output

| Verdict | Condition |
|---------|-----------|
| **Insufficient for workbook** | GAM organised output has **only** `*_table` / reference_table family across all activities **and** DLA brief is self-study workbook |
| **May suffice for reference sheet** | Same output — different genre ([38C-1 §2](38C-1-workbook-pedagogy-model.md)) |
| **Preserve still valid** | Design Page may copy tables faithfully — **not** a GAM excuse for missing genres |

---

## 6. Workbook sequence patterns (planning only)

Reusable **genre mixes** — not implementation templates.

### Pattern A — Situate → model → practise → check → close

```text
scenario → worked_example → task_cards → checklist → consolidation_summary
```

**Inflation fit:** A1 warm-up, A3 household (if blanks), session close.

### Pattern B — Reference → interpret → apply → verify

```text
reference_table → prompt_set → template (learner) → checklist
```

**Inflation fit:** A2 indicators.

### Pattern C — Compare with judgement

```text
reference_table (no scores) → rubric → ranking task_cards → reflection_prompt
```

**Inflation fit:** A4 strategies — **requires empty rating column or learner-generated rank**.

### Pattern D — Build → integrate → transfer

```text
(task_cards + tables)* → synthesis template → transfer_prompt → consolidation_summary
```

**Inflation fit:** A5 capstone — **not** four-table dump.

### Pattern E — Workshop-rich (comparator only)

```text
scenario → task_cards → reference_table → prompt_set → checklist
```

**GOLDEN / EV-03** approximate — still **not** full workbook PASS without exposition + worked example + consolidation summary ([38C-2 §7.3](38C-2-workbook-gap-analysis.md)).

---

## 7. Mapping — DLA requirements → GAM obligations

| DLA signal / requirement ([38C-3 §8](38C-3-dla-workbook-requirements.md)) | GAM material obligation | Workbook function |
|--------------------------------------------------------------------------|-------------------------|-------------------|
| R1 exposition requirement | Author `text`/`exposition` OR substantial scenario prose + linking paragraph | Explanatory teaching |
| R5 `sample_output` / stepped `template` | Author `worked_example` body with steps | Worked examples |
| Encourage modelling | Author `modelling_note` / `reasoning_walkthrough` | Modelling |
| R2 guided practice + aligned materials | Author `scenario` + `template` / table with blanks per task | Guided practice |
| R3 retrieval ≥2 activities | Author `task_cards` + `checklist` and/or `retrieval_check` | Retrieval |
| R4 consolidation requirement | Author `consolidation_summary` (+ optional `reflection_prompt`) | Consolidation |
| R6 capstone integrative output | Author `template` / plan scaffold — **not** four full tables | Synthesis |
| Encourage transfer | Author `transfer_prompt` on capstone | Transfer |
| R11 rank/compare spec | Author `rubric`; tables **without** learner judgement pre-filled | Evaluative judgement |
| R12 fading | Early: cards + checklist; late: fewer genres; capstone: synthesis only | Fading |
| R13 ≥2 type families | ≥1 non-table genre wherever tables used | Multiple |
| R5 scenario when task says so | Author `scenario` block | Guided practice |
| R15 misconception spec | Author `misconception_note` | Misconceptions |

---

## 8. Inflation gap interpretation

### 8.1 EV-01-G (same run) — GAM-level failure

| Observation | Detail |
|-------------|--------|
| Material types authored | **4** — `classification_table`, `comparison_table`, `analysis_table`, `impact_table` only |
| Missing genres | **scenario**, **task_cards**, **prompt_set**, **checklist**, **worked_example**, **consolidation_summary**, **rubric**, **exposition** |
| Word volume | ~1,360 words — mostly definitional table cells |
| Capstone A5 | **Reprints** all four tables — reference dump ([38C-2 GAP-08](38C-2-workbook-gap-analysis.md)) |
| A4 table | **Pre-filled effectiveness ratings** — judgement anti-pattern |
| Design Page | Copied tables **verbatim** — no GAM→DP loss |

**GAM verdict:** **Table-only workbook authoring** — **insufficient** for [38C-1](38C-1-workbook-pedagogy-model.md) PASS regardless of preserve quality.

### 8.2 EV-03-G (richer comparator)

| Observation | Detail |
|-------------|--------|
| Material types | **8** — adds `scenario`, `task_cards`, `prompt_set`, `checklist` |
| A3 | Scenario prose **plus** analysis_table (rows pre-filled — workshop-style) |
| A5 | `prompt_set` only — **partial** consolidation |
| Still missing | Dedicated **worked_example**, **consolidation_summary**, **exposition**, **rubric** |

**Implication:** When DLA/upstream matches golden shape, GAM **does** author multi-genre materials; EV-01 failure is **spec/run**, not impossible platform behaviour.

### 8.3 GOLDEN `activity_materials`

| Observation | Detail |
|-------------|--------|
| Types | scenario, task_cards, tables, prompt_set, checklist, discussion_prompts |
| Duration | **60 min** sequence |
| Role | Workshop comparator — shows **target genre mix** for materials section, not self-study workbook PASS |

### 8.4 Answers to [38C-3 §10](38C-3-dla-workbook-requirements.md) planning questions

| # | Answer (observation) |
|---|---------------------|
| 1 | Minimum bodies defined in §4 per genre; tables in §4.16 |
| 2 | `sample_output`/`template` = stepped expert path; parallel learner gets blanks |
| 3 | Ranking tables: empty judgement column or rubric + learner rank |
| 4 | `consolidation_summary` genre when DLA requires closure |
| 5 | Capstone: synthesis template + transfer — **reject** four-table reprint |
| 6 | **Mandatory:** every DLA `required_materials` entry; **workbook:** also session-level genres when DLA Requires |
| 7 | EV-03: scenario **before** table on same activity |
| 8 | Yes — `text`/exposition when DLA Requires R1 |
| 9 | Planning: genre mix audit on GAM text (type token count) — not implemented |
| 10 | `LD-MATERIALS-COPY` author role **implements** §4 bodies; no 38-B contract change in planning |

---

## 9. Anti-pattern catalogue

| ID | Anti-pattern | GAM signal | Workbook impact |
|----|--------------|------------|-----------------|
| **AP-01** | **Table-only workbook** | Only `*_table` blocks | Fails MVP — EV-01 |
| **AP-02** | Activity instruction without learner support | Task in DLA only; no cards/checklist | Thin practice |
| **AP-03** | Scenario named, not authored | Preamble/task only | GAP-02 |
| **AP-04** | Checklist without criteria | “Did you finish?” | Weak retrieval |
| **AP-05** | Worked example without reasoning | Numbers only | Weak R5 |
| **AP-06** | Consolidation as repetition | Re-post all tables | GAP-03/08 |
| **AP-07** | Retrieval as reflection only | “How do you feel?” | R3 fail |
| **AP-08** | Capstone as reference dump | A5 four tables | GAP-08 |
| **AP-09** | Partner/group material unadapted | “Agree with group” in cards | Solo workbook fail |
| **AP-10** | Pre-filled judgement in table | Effectiveness ratings filled | GAP-09 |
| **AP-11** | Placeholder material labels | “Set of scenarios…” | `LD-MATERIALS-COPY` violation |
| **AP-12** | Exposition deferred to Design Page | No GAM teaching body | R1 fail |

---

## 10. Output for 38C-5 (learner page experience)

Questions for **workbook experience and rendering** — observation handoff only:

1. **Section order:** Should workbook follow `learning_sequence` or pedagogical order (teach → practise → consolidate) when `section_id` is heading-based ([EV-01](38C-2-workbook-gap-analysis.md))?  
2. **Consolidation surfacing:** Dedicated page section vs last-activity material vs both — how does learner know session ended?  
3. **Self-checks:** Render `checklist` / `retrieval_check` as interactive vs static — visibility of completion?  
4. **Support / fading:** Should early activities show card grids and late activities hide redundant reference — renderer policy for `render_hints`?  
5. **Reference vs practice:** Visual separation of **reference_table** blocks from **template** / task_cards (tabs, headings, collapsible)?  
6. **Cognition fields:** Do `scaffold_hint_sequence`, `reasoning_orientation` appear in HTML when only in JSON ([38C-2 §5.4](38C-2-workbook-gap-analysis.md))?  
7. **Exposition placement:** `knowledge_summary` section vs first activity material — what satisfies R1 visibly?  
8. **Capstone:** Single integrative task card zone vs embedded tables — avoid reference dump **layout**.  
9. **Solo wording:** Renderer substitute “your work” for “group agreement” or fail visible?  
10. **Duration display:** Show 125 min honestly vs brief 60 min — UX trust ([38C-2 GAP-06](38C-2-workbook-gap-analysis.md)).

---

## 11. Success criteria (slice)

| Criterion | Met? |
|-----------|------|
| GAM vs DLA vs Design Page separated | §3 |
| Genres definable by reviewer | §4 (16 entries) |
| Table-only = insufficient for workbook | §5.5 |
| 38C-5 handoff questions | §10 |
| No implementation | Throughout |
| 38C-3 §10 questions answered | §8.4 |
| Slice 38C-4 | **COMPLETE** |

---

## 12. Sign-off

| Item | Status |
|------|--------|
| Genre catalogue | §4 |
| Table rules | §5 |
| Sequence patterns | §6 |
| DLA → GAM map | §7 |
| Inflation interpretation | §8 |
| Anti-patterns | §9 |
| Next slice | [38C-5 workbook experience & rendering](38C-5-workbook-experience-rendering.md) (TBD) |

**Reviewer check:** Given GAM organised text, count `Material: * (type)` tokens — if only `*_table` on a workbook brief, classify **AP-01** before Design Page runs.

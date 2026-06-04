# Slice 38C-3 — DLA workbook requirements

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Authority:** [38C-1-workbook-pedagogy-model.md](38C-1-workbook-pedagogy-model.md) · **Evidence:** [38C-2-workbook-gap-analysis.md](38C-2-workbook-gap-analysis.md)  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md) § 38C-3  
**Out of scope:** GAM material authoring detail ([38C-4](38C-4-gam-instructional-genres.md) TBD) · page/render shape ([38C-5](38C-5-workbook-experience-rendering.md) TBD) · implementation

---

## 1. Purpose

Define what **Design Learning Activities (DLA)** must **specify** when the intended downstream product is a **60-minute self-study workbook** ([38C-1 §1](38C-1-workbook-pedagogy-model.md)), so GAM and Design Page receive an activity set that can realise workbook functions — not an activity sheet or reference dump.

**Success for this slice:** A reviewer can answer: *“What must DLA communicate before GAM can reliably produce a workbook?”* without reading pack or runtime code.

---

## 2. Inputs and assumptions

| Input | Use |
|-------|-----|
| [38C-1](38C-1-workbook-pedagogy-model.md) | Normative functions, MVP, pass/fail |
| [38C-2](38C-2-workbook-gap-analysis.md) | Inflation EV-01 gaps, origins, §10 signals |
| `domain-learning-design-artefacts.md` | Existing `required_materials` shape (`type`, `purpose`, `specification`) |
| Inflation capture brief (inferred) | Table-only `required_materials` hint → GAM authored 4 table keys only |

**Assumptions:**

1. **Sprint 38-B preserve stack is sufficient** — DLA does not need to re-specify pipe-table syntax (GAM + `LD-TABLE-FIDELITY`).  
2. **`delivery_context: self_directed`** and **`page_profile: learner`** imply workbook intent unless brief says otherwise.  
3. DLA outputs **`learning_activities`** JSON — not final page prose or material bodies.  
4. **DLA JSON for Inflation EV-01 was not committed** — failure-mode mapping uses page/GAM evidence + 38C-2 origin tags (**likely DLA** where stated).

---

## 3. DLA responsibility model

### 3.1 What DLA owns

| Responsibility | Description |
|----------------|-------------|
| **Activity set design** | Which activities exist (IDs, sequence), mapped to outcomes |
| **Learner task contract** | `learner_task`, `expected_output` — solo-feasible, observable |
| **Material requirements** | `required_materials[]`: **type**, `purpose`, `specification` (what GAM must realise) |
| **Instructional intent per activity** | Preamble, cognition-orientation fields, interaction type, failure modes |
| **Session economics** | `duration_minutes` per activity; fit to **declared session budget** |
| **Delivery mode signals** | Grouping, facilitator_moves — must align with self-study vs workshop |
| **Workbook function coverage** | Explicit intent that each 38C-1 function is **required** somewhere in the activity set |

DLA is the **specification authority** for *what* must exist before GAM authors bodies and Design Page composes the page.

### 3.2 What DLA does not own

| Not owned | Owner |
|-----------|--------|
| Full material prose, tables, scenarios (bodies) | **GAM** (`activity_materials`) |
| Page sections, merge, `materials.*` copy | **Design Page** (read-only compose) |
| Pipe-table row content, anti-CSV shapes | **GAM** + `LD-TABLE-FIDELITY` |
| HTML layout, render hints consumption | **Renderer** / **38C-5** |
| Pack prompt wording | **38-B** (frozen for 38-C planning) |

DLA must **not** assume Design Page will invent teaching prose, scenarios, or consolidation that were never in `required_materials` or activity fields ([38C-2 §7.1](38C-2-workbook-gap-analysis.md)).

### 3.3 Relationship to GAM and Design Page

```text
Brief + outcomes
  → DLA: learning_activities[] + required_materials (types + specs)
      → GAM: activity_materials (full bodies per type)
          → Design Page: page (preserve merge, framing, page-root metadata)
              → Renderer: learner HTML
```

| Handoff | DLA must supply |
|---------|-----------------|
| **→ GAM** | Unambiguous `required_materials` entries (type + purpose + specification); learner_task aligned with each material; no table-only set when workbook functions need non-table types |
| **→ Design Page** | Complete activity records; solo `learner_task`; capstone activity spec that does not mean “re-list every table type”; optional flags for page-level expectations (38C-5 — not DLA schema here) |

---

## 4. Workbook functions — DLA stance (Require · Encourage · Permit · Silent)

*Normative bar:* [38C-1 §4–5](38C-1-workbook-pedagogy-model.md). *Evidence:* [38C-2 §5, §8](38C-2-workbook-gap-analysis.md).

| Function | DLA stance | Why |
|----------|------------|-----|
| **Explanatory teaching** | **Require** (session-level) | R1 fails if only table defs ([38C-2 GAP-01](38C-2-workbook-gap-analysis.md)); DLA must signal exposition need — not leave to DP intro |
| **Worked examples** | **Require** (≥1 activity) | R5; EV-01 absent ([38C-2 §5.3](38C-2-workbook-gap-analysis.md)) |
| **Modelling** | **Encourage** (≥1 activity if no worked example) | R5 alternative path; satisfies “example OR modelling” |
| **Guided practice** | **Require** (≥2 activities) | R2; needs task + material specs aligned ([38C-2 GAP-02](38C-2-workbook-gap-analysis.md)) |
| **Fading** | **Require** (progression metadata) | 38C-1 §4 fading Partial acceptable for MVP but EV-01 **Absent** — DLA must encode decreasing support / capstone rules |
| **Misconceptions** | **Encourage** | EV-01 `failure_mode` not learner-facing — DLA should specify learner-facing misconception intent if used |
| **Retrieval** | **Require** (≥2 activities) | R3; EV-01 partial ([38C-2 GAP-04](38C-2-workbook-gap-analysis.md)) |
| **Consolidation** | **Require** (session-level) | R4 critical; EV-01 absent ([38C-2 GAP-03](38C-2-workbook-gap-analysis.md)) |
| **Synthesis** | **Require** (≥1 capstone) | R6; EV-01 strength — keep but tighten spec |
| **Transfer** | **Encourage** (capstone) | R6 alternative; EV-01 partial on A5 |
| **Evaluative judgement** | **Require** where compare/rank tasks exist | EV-01 partial + pre-filled ratings — DLA must spec judgement criteria, not answers |

### 4.1 Per-function DLA obligations (observation)

#### Explanatory teaching — **Require**

| DLA must | Evidence |
|----------|----------|
| Declare **session exposition requirement** (e.g. link to outcome “explain X”) and at least one `required_materials` or activity field whose `purpose` is concept exposition — not only table types | GAP-01; intro 69 words on page |
| **Permit** outcome-aligned `activity_preamble` but **not** treat preambles as sufficient teaching | 38C-1 §3.1 Partial pattern |
| **Remain silent** on word counts in material bodies | GAM authors prose |

#### Worked examples — **Require**

| DLA must | Evidence |
|----------|----------|
| Specify ≥1 activity with `required_materials` entry whose `type` is **`sample_output`** or **`template`** (per domain artefact vocabulary) with `specification` stating stepped expert completion before parallel learner task | R5 fail EV-01 |
| `learner_task` on that activity must reference using the example method | 38C-1 §3.2 |
| **Remain silent** on step formatting in GAM output | 38C-4 |

#### Modelling — **Encourage**

| DLA must | Evidence |
|----------|----------|
| Where no worked example, **encourage** `reasoning_orientation` or material spec requiring decision criteria / think-aloud | R5 alternate |
| **Permit** both modelling + worked example on same activity | — |
| **Not require** if worked example Required satisfied | R5 OR rule |

#### Guided practice — **Require**

| DLA must | Evidence |
|----------|----------|
| Every activity: `learner_task` + `expected_output` + `required_materials` covering what learner works on | 38C-1 §3.4 |
| If task references scenarios, **require** matching `scenario` (or equivalent) in `required_materials` for that `activity_id` | A3 preamble mismatch [38C-2 §5.5](38C-2-workbook-gap-analysis.md) |
| **Require** `grouping: individual` or solo-feasible task — no mandatory partner/group | GAP-07 |
| **Permit** optional stretch pair work only when labelled optional | — |

#### Fading — **Require**

| DLA must | Evidence |
|----------|----------|
| Document progression: early activities **require** more `required_materials` types (cards, checklist); capstone **must not** spec “all table types from A1–A4” as only materials | GAP-08 |
| Capstone `specification` should reference synthesis artefact, not full reference library | A5 four-table dump |
| **Encourage** explicit support level per activity (e.g. hint density in specification text) | 38C-1 §3.5 |

#### Misconceptions — **Encourage**

| DLA must | Evidence |
|----------|----------|
| **Encourage** `failure_mode` written as learner-facing “Common mistake” spec in `required_materials` or task | EV-01 JSON-only |
| **Permit** omit on low-stakes drill activities | — |
| **Remain silent** on render phrasing | 38C-5 |

#### Retrieval — **Require**

| DLA must | Evidence |
|----------|----------|
| ≥2 activities with `required_materials` including **`task_cards`**, **`prompt_set`**, and/or **`checklist`** (domain controlled types) | GAP-04; EV-03-G has cards + checklist |
| `expected_output` must state what learner checks (e.g. “answered all prompts”) | 38C-1 §3.7 |
| **Permit** low-stakes MCQ only if brief includes assessment step — not DLA-only | Golden has assessment_check |

#### Consolidation — **Require**

| DLA must | Evidence |
|----------|----------|
| Session-level **consolidation requirement** in DLA output metadata or final activity: reflection / summary / key takeaways specification | GAP-03 critical |
| At least one `required_materials` or dedicated activity whose `purpose` is session closure | EV-01 no closure section |
| **Remain silent** on whether closure is page section vs material block | 38C-5 |

#### Synthesis — **Require**

| DLA must | Evidence |
|----------|----------|
| ≥1 capstone activity integrating ≥3 outcome threads (explicit in `mapped_learning_outcomes` or task) | EV-01 A5 present |
| `expected_output` = integrative artefact (plan, memo) — not “re-copy tables” | GAP-08 |
| **Permit** cognition fields (`scaffold_hint_sequence`, etc.) on capstone | EV-01 A5 |

#### Transfer — **Encourage**

| DLA must | Evidence |
|----------|----------|
| Capstone **encourage** `transfer_or_application_task` or task text requiring learner’s own context | EV-01 partial |
| **Require** when topic is personal finance / professional practice (domain-dependent) | 38C-1 §3.10 |
| **Permit** abstract scenarios earlier if transfer on capstone | — |

#### Evaluative judgement — **Require** (when applicable)

| DLA must | Evidence |
|----------|----------|
| If `activity_interaction_type: ranking` or compare task: `specification` must require **learner-generated** ranking/justification — not pre-supplied scores in material spec | GAP-09 |
| `expected_output` must mention justification quality | A4 EV-01 |
| **Remain silent** on rubric layout | GAM / 38C-4 |

---

## 5. Minimum workbook specification (60-minute self-study)

What DLA must communicate in **`learning_activities`** (and brief-linked metadata) for a workbook-targeted run.

| Field / topic | Minimum obligation |
|---------------|-------------------|
| **Learning outcomes** | Mapped on every activity; capstone maps ≥3 outcome IDs |
| **Learner context** | Self-study, solo primary; no facilitator dependency |
| **Self-study mode** | Explicit in brief resolution → activities avoid workshop-only grouping as default |
| **Solo feasibility** | `learner_task` completable alone; social interaction **optional** only |
| **Duration budget** | Sum of `duration_minutes` **50–70** OR explicit `session_duration_target_minutes: 60` with rationale if activities fewer |
| **Progression** | Ordered activities A1…An with fading intent (support ↓); capstone last |
| **Retrieval** | ≥2 activities with checklist / task_cards / prompt_set in `required_materials` |
| **Consolidation** | Session closure specified (activity or global requirement) |
| **Transfer / synthesis** | Capstone with integrative `expected_output`; transfer encouraged |
| **Judgement** | Compare/rank activities include criteria in `specification`, not answer key |
| **Material variety** | Across session: ≥2 distinct `required_materials.type` **families** — must include at least one **non-table** type when any activity uses tables ([38C-1 §4](38C-1-workbook-pedagogy-model.md)) |
| **Table activities** | May **permit** `classification_table`, `comparison_table`, etc. as types in spec — DLA names type + purpose; **38C-4** maps to GAM bodies |

**Anti-specification (DLA must not):**

- List only `*_table` types for all activities on a self-study workbook brief ([38C-2 GAP-05](38C-2-workbook-gap-analysis.md)).  
- Inflate durations to **125 min** without brief alignment ([38C-2 GAP-06](38C-2-workbook-gap-analysis.md)).  
- Specify capstone `required_materials` as full duplicate of prior table set ([38C-2 GAP-08](38C-2-workbook-gap-analysis.md)).

---

## 6. Failure modes observed in Inflation — DLA obligation map

| 38C-2 gap | EV-01 symptom | Missing / weak DLA obligation | Confidence |
|-----------|---------------|--------------------------------|------------|
| **GAP-01** Teaching arc | 69-word intro; defs in tables only | No session exposition requirement; no non-table teaching spec | High |
| **GAP-02** Practice progression | A3 “scenarios” without scenario material | `required_materials` not listing `scenario` when task requires it | High |
| **GAP-03** Consolidation | No closure section | No consolidation activity or session requirement | High |
| **GAP-04** Retrieval | No cards/checklist | No `task_cards` / `checklist` / `prompt_set` in specs | High (inferred — matches EV-01-G) |
| **GAP-05** Table-only | 4/4 material keys tables | `required_materials` effectively table-only for all activities | High (capture brief + GAM) |
| **GAP-06** Duration | 125 min sum | No session budget constraint on `duration_minutes` | Medium |
| **GAP-07** Social tasks | Partner / group in A2, A4 | `learner_task` written for workshop; grouping not solo | Medium |
| **GAP-08** A5 dump | Four tables on capstone | Capstone spec = reference all tables vs synthesis artefact | Medium |
| **GAP-09** Pre-filled judgement | A4 effectiveness column | Material `specification` allowed scored table without learner ranking | Medium (shared with GAM) |
| **R5** No example/modelling | Absent | No `sample_output` / modelling spec on any activity | High |

**Not attributed to DLA on this evidence:** table syntax corruption (B4), Design Page stripping (disproven [38C-2 §9](38C-2-workbook-gap-analysis.md)).

---

## 7. Ownership boundaries

| Concern | DLA | GAM | Design Page |
|---------|-----|-----|-------------|
| Activity exists / order | **Owns** | Must not add activities | Must not add activities |
| `learner_task` / `expected_output` | **Owns** | Uses as anchor | Preserves / composes |
| `required_materials.type` + `specification` | **Owns** | Realises bodies | Does not invent types |
| Material prose length / tables | Specifies intent | **Owns** bodies | Preserves merge |
| Worked example steps | Requires via spec | **Owns** content | Preserves |
| Session duration sum | **Owns** targets | — | May display `duration_minutes` |
| Solo vs group framing | **Owns** task wording | — | Preserves tasks |
| Consolidation prose | Requires closure | May author block | May place section (38C-5) |
| Page intro / outcomes list | Outcome mapping | — | **Owns** compose |
| `failure_mode` learner visibility | Specifies intent | May embed in materials | Preserve fields |
| Pipe-table syntax | Names table **need** | **Owns** authoring | **Owns** preserve |
| Sprint 38 affordances | — | — | **Owns** page-root metadata |

---

## 8. Emerging requirement statements

*Observation-only. No implementation.*

1. DLA should declare **`resource_intent: self_study_workbook`** (or equivalent brief flag) when the downstream page is a 60-minute solo workbook.  
2. DLA should require **sum of `duration_minutes` between 50 and 70** unless the brief documents a different budget with fewer activities.  
3. DLA should require **every `learner_task` to be solo-feasible** — no mandatory partner, group, or facilitator.  
4. DLA should require **at least two activities** to include **`required_materials`** entries with types **`task_cards`**, **`prompt_set`**, and/or **`checklist`**.  
5. DLA should require **at least one `scenario`** (or equivalent spec) wherever `learner_task` or `activity_preamble` references scenarios, cases, or households.  
6. DLA should require **at least one activity** with **`sample_output`** or **`template`** specification for a **worked example** before parallel practice.  
7. DLA should **encourage at least one activity** with modelling intent (`reasoning_orientation` and/or specification requiring decision criteria) when worked example is omitted.  
8. DLA should require a **session consolidation requirement** — reflection, summary, or key takeaways — as an explicit activity or global specification.  
9. DLA should require **one capstone activity** whose `expected_output` is an **integrative artefact** and whose `required_materials` do not merely re-list all prior table types.  
10. DLA should require **capstone or late activity** to include **transfer** language (“your context”, “your case”) when outcomes imply personal application.  
11. DLA should require **ranking or comparison activities** to specify **learner-generated judgement** in `specification` — not pre-filled evaluation scores.  
12. DLA should require **fading** across the sequence: early activities specify more supportive material types; capstone specifies synthesis materials only.  
13. DLA should require **at least two distinct `required_materials.type` families** in the session when any activity uses structured tables.  
14. DLA should map **every activity** to **learning outcomes** and include **observable `expected_output`**.  
15. DLA should **encourage learner-facing misconception** specifications where `failure_mode` is used — not facilitator-only strings.

---

## 9. Risks and open questions

| ID | Risk / question | Why it matters | Owner to resolve |
|----|-----------------|----------------|------------------|
| **Q1** | Is `resource_intent` already in brief resolution or only implied by `delivery_context`? | DLA cannot require workbook if brief is silent | Product / brief schema |
| **Q2** | Controlled `required_materials.type` list vs table-specific types (`analysis_table`) | EV-01 used table keys — domain doc lists `scenario`, `task_cards`, … | 38C-4 + domain artefact |
| **Q3** | Where does **session exposition** live — DLA field vs GAM `exposition` material vs Design Page section? | R1 ownership split | 38C-5 |
| **Q4** | Consolidation: last activity vs separate pseudo-activity vs page-only | DLA can require; realisation split | 38C-5 |
| **Q5** | MCQ / `assessment_check` — DLA or separate assessment step? | Retrieval Present bar | Programme |
| **Q6** | Cognition fields on capstone — DLA require or optional? | Modelling partial in JSON only | 38C-5 render |
| **Q7** | Workshop golden DLA shape vs self-study — same activity IDs, different specs? | Comparator confusion | 38C-2 §7.3 |

---

## 10. Output for 38C-4 (GAM instructional genres)

Questions **38C-4 must answer** (DLA specs assume answers exist):

1. For each domain `required_materials.type` (+ table-specific types used in practice), what **minimum body** satisfies DLA `specification` for workbook PASS?  
2. How should GAM realise **`sample_output` / `template`** as worked examples without spoiling parallel practice?  
3. What GAM rules prevent **pre-filled judgement columns** when DLA specifies ranking?  
4. How does GAM author **consolidation** bodies from DLA session requirement (type name TBD)?  
5. What is the **anti-pattern** for capstone materials that duplicate all prior tables?  
6. Which types are **mandatory realisations** vs optional when DLA lists multiple `required_materials`?  
7. How does GAM align **scenario + table** on same activity (EV-03 pattern) vs EV-01 table-only?  
8. Does GAM need explicit **exposition** material type when DLA requires explanatory teaching?  
9. What validation signals GAM output **genre mix** before Design Page (probe concept — planning only)?  
10. How do **`LD-MATERIALS-COPY`** author rules interact with new workbook types without reopening 38-B preserve scope?

---

## 11. Sign-off

| Item | Status |
|------|--------|
| DLA ownership model | §3 |
| Functions → Require/Encourage/Permit/Silent | §4 |
| 60-minute minimum spec | §5 |
| Inflation failure map | §6 |
| Ownership table | §7 |
| Requirement statements | §8 |
| 38C-4 handoff questions | §10 |
| Implementation proposals | **None** |
| Slice 38C-3 | **COMPLETE** |

**Reviewer check:** Given only 38C-3, a planner can specify `learning_activities` so GAM is **obliged** to produce scenarios, retrieval, examples, and closure — not only tables — before Design Page runs.

**Next:** [38C-4 GAM instructional genres](38C-4-gam-instructional-genres.md) (TBD).

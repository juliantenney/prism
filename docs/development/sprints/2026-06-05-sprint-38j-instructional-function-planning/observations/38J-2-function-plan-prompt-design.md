# Slice 38J-2 — Function-plan prompt design

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Draft planning logic only — no pack, code, or implementation changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38J-2  
**Inputs:** [38J-1 baseline](38J-1-baseline-inspection.md) · [38I-2 episode model](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-3 KM/LO mapping](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) · [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) · [38H-2 anti-spoiler](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-2-gam-consolidation-discipline.md)

---

## Primary question

> What instructions should DLA follow so that episode archetypes **reliably** produce **instructional episodes** rather than **task shells**?

**Design answer:** DLA must execute a **mandatory internal planning pass per activity** — archetype → ordered functions (R/C/O) → KM triggers → inference flags → population plan — **before** emitting `learner_task`, `expected_output`, or `required_materials`. The existing JSON schema is sufficient; planning is **prompt behaviour**, not a new artefact.

---

## Section 1 — Instructional planning model

### 1.1 Target vs current pattern

| Current (failure) | Target (38-J) |
|-------------------|---------------|
| LO → `learner_task` → `required_materials` | LO → archetype → function plan → population → segmented learner journey |

### 1.2 Internal planning sequence (per activity)

DLA must perform these steps **in order** for **each** `activities[]` entry before writing JSON fields:

```text
Step A — Collect inputs
  mapped_learning_outcomes[]
  knowledge_model (concepts, relationships, groupings, processes, misconceptions)
  session position (activity index 1..N in session)
  delivery_notes / brief transfer cues

Step B — Archetype selection
  Apply LO-ARC-01/02/03 (38I-3 §2)
  Apply edge-case overrides (Assess vs Evaluate; Apply vs Analyse verb)
  Record: primary_archetype ∈ { Understand, Apply, Analyse, Evaluate }

Step C — Instructional function planning
  Load archetype template (Sections 2–5)
  Build ordered function_sequence[] with R / C / O tags
  Apply KM trigger upgrades (Section 6)
  Apply session-arc modifiers (Section 10)

Step D — Inference contract check
  For each function flagged inference_required (Section 7)
  Author planning notes: what to infer from LO + brief + relationships
  Forbidden: invent unsupported domain facts

Step E — Population plan (DLA emission map)
  For each R function (then C where included):
    - Which existing output surfaces carry this function
    - required_materials row(s): type, purpose, specification depth
    - cognition fields (preamble, activation, scaffold, reflection, transfer)
    - learner_task segment order (teaching blocks before performance blocks)
  Verify anti-shell (Section 8) and anti-spoiler (Section 9)

Step F — Emit JSON
  required_materials derived FROM function plan (not reverse)
  learner_task = concatenation of planned segments in function order
  expected_output = evidence tied to Independent practice / Evaluative judgement
```

### 1.3 Why this must precede `learner_task`

| Reason | Evidence |
|--------|----------|
| **Task-first causes shells** | `EV-38G` wrote tasks then listed materials to satisfy DLA-WB rows |
| **Materials without sequence ≠ episode** | A1 has rich `worked_example` but task says “study then write” only |
| **Evaluate collapses to summary** | A4 task written before criteria/perspectives planned |
| **GAM cannot recover** | §6: “do not redesign activities” |
| **Function order is pedagogical** | 38I-2 sequences are evidence-based, not cosmetic |

### 1.4 Planning record (internal only)

No new schema field in v1. The model holds planning **mentally** or in scratch reasoning, then emits existing fields. Optional future: `delivery_notes.episode_plan_summary` — **out of 38-J scope**.

### 1.5 Population surfaces (existing DLA fields only)

| Planning output | Existing field |
|-----------------|----------------|
| Orientation, Framing, Activation | `activity_preamble`, `prior_knowledge_activation`, `reasoning_orientation` |
| Explanation, Example, Non-example, Criteria | `required_materials` specs (`text`, `worked_example`, `task_cards`) |
| Worked thinking | `worked_example` / `modelling_note` specification |
| Guided / Independent practice | `learner_task` segments + `analysis_table` / `scenario` / `template` |
| Verification | `checklist`, `prompt_set`, `task_cards` specification |
| Reflection, Transfer | `self_explanation_prompt`, `transfer_or_application_task` |
| Misconception challenge | `support_note` + dedicated material spec |
| Evaluative judgement | `learner_task` + `prompt_set` / rubric spec + `decision_table` |

---

## Section 2 — Understand template

**Authority:** [38I-2 §2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-3 §3.2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md)

### 2.1 Planning order (fixed)

```text
Orientation → Framing → Activation → Explanation → Example
  → Non-example → Misconception challenge → Guided classification
  → Independent classification → Verification → Reflection → Transition
```

### 2.2 Function obligations

| Function | Tag | Planning obligation |
|----------|-----|---------------------|
| Orientation | **R** | Preamble states episode intellectual purpose and session link |
| Framing | **C** | **R** when confusable concepts or abstract definitions |
| Activation | **C** | **R** when activity_index > 1 |
| Explanation | **R** | Teach definitions/relationships from KM concepts — not delegated to GAM alone |
| Example | **R** | Positive instance tied to LO related concepts |
| Non-example | **C** | **R** when `contrasts_with` relationship or confusable pair |
| Misconception challenge | **C**† | **R** when KM `misconceptions[]` maps to LO concepts |
| Guided classification | **C** | **R** when first discrimination attempt in session |
| Independent classification | **R** | Observable performance: sort, label, or explain in own words |
| Verification | **R** | ≥4 checkable discrimination items |
| Reflection | **C** | Self-explanation prompt tied to concept meaning |
| Transition | **C** | Bridge to next episode skill |

### 2.3 DLA must plan before materials

| Plan element | Minimum specification depth |
|--------------|----------------------------|
| Concepts to teach | Name KM concepts + definitions to cover |
| Example / non-example pair | What counts / what does not |
| Misconception | Name KM misconception + reconciliation prompt |
| Guided classification | ≥3 items with hint column or partial scaffold |
| Verification | Checklist tied to discrimination, not topic recall only |
| `learner_task` segments | (1) teach/read (2) guided attempt (3) independent attempt — not single “write explanation” |

### 2.4 Required materials pattern (planning target)

| Function | Typical material types (existing) |
|----------|-----------------------------------|
| Explanation + Example + Worked path | `worked_example` (concept walkthrough) |
| Misconception + Verification | `task_cards` or `checklist` |
| Independent classification | `learner_task` performance segment |
| Optional contrast model | `sample_output` only if **not** copy-paste target — prefer verification |

**Anti-pattern:** `sample_output` as answer template without independent discrimination task.

### 2.5 Anti-shell safeguards (Understand)

| FAIL if | Condition |
|---------|-----------|
| US-SHELL-01 | Only `learner_task` + `activity_preamble` without Explanation + Example population plan |
| US-SHELL-02 | `learner_task` is single imperative (“Explain X”) with no teaching segment |
| US-SHELL-03 | No Verification function planned |
| US-SHELL-04 | Misconception KM present but no Misconception challenge planned |

---

## Section 3 — Apply template

**Authority:** [38I-2 §3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-3 §3.3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md)

### 3.1 Planning order

```text
Orientation → Framing → Activation → Criteria exposition (process/rules)
  → Worked thinking → Guided practice → Independent practice
  → Verification → Revision → Reflection → Transfer → Transition
```

### 3.2 Function obligations

| Function | Tag | Planning obligation |
|----------|-----|---------------------|
| Orientation | **R** | Link to prior Understand episode |
| Framing | **R** | Situational context (data, scenario, case constants) |
| Activation | **O** | Brief prerequisite concept recall |
| Criteria exposition | **R** | Explicit method steps/rules before practice |
| Worked thinking | **R** | Full expert run with visible intermediate steps |
| Guided practice | **R** | Partial completion — one row/step with hints |
| Independent practice | **R** | Full learner execution without hints |
| Verification | **R** | Procedural checklist or keyed steps |
| Revision | **C** | Compare attempt to model path |
| Reflection | **C** | Hardest step / error pattern |
| Transfer | **C** | Same method, new numbers/context |
| Transition | **C** | Preview Analyse/Evaluate use |

### 3.3 Fade planning (within episode)

| Phase | Support level |
|-------|---------------|
| Criteria exposition | Full rules visible |
| Worked thinking | Full model |
| Guided practice | Hints, partial table |
| Independent practice | No hints |
| Verification | Criteria remain visible |

DLA `scaffold_hint_sequence` must mirror fade phases — not flat three-step list unrelated to method.

### 3.4 LO verb override (Apply disguised as Analyse)

**Rule AP-OVERRIDE-01:** If LO verb is *Analyze/Analyse* but outcome intent is **procedure execution** (calculate, complete table, follow steps) and KM has matching `processes[]` with ≥3 steps → plan **Apply** archetype, not Analyse.

**Inflation example:** CPI rate calculation → Apply (`Calculating CPI Inflation` process).

### 3.5 Required materials pattern

| Function | Plan |
|----------|------|
| Criteria exposition | Process steps in `worked_example` spec or `text` exposition material |
| Worked thinking | `worked_example` — **mandatory** row |
| Guided practice | Partial `analysis_table` or `task_cards` with one completed row |
| Independent practice | Empty learner columns in table / full task segment |
| Verification | `checklist` or `prompt_set` with keyed steps |

### 3.6 Anti-shell safeguards (Apply)

| FAIL if | Condition |
|---------|-----------|
| AP-SHELL-01 | No `worked_example` planned when Worked thinking **R** |
| AP-SHELL-02 | Empty table + task only — no criteria exposition or worked model |
| AP-SHELL-03 | Guided and Independent practice collapse to single “fill table” with no fade |
| AP-SHELL-04 | LO override applicable but Analyse template used (no process modelling) |

---

## Section 4 — Analyse template

**Authority:** [38I-2 §4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-3 §3.4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md)

### 4.1 Planning order

```text
Orientation → Framing (analytical question) → Activation
  → Criteria exposition → Explanation → Worked thinking (analytic)
  → Guided inquiry → Guided practice → Independent practice (+ justification)
  → Verification → Reflection → Transfer → Transition
```

### 4.2 Function obligations

| Function | Tag | Planning obligation |
|----------|-----|---------------------|
| Orientation | **R** | Why analysis now — not “answer questions” |
| Framing | **R** | Bounded analytical question with stakes |
| Activation | **C** | Recall concepts/relationships for analysis |
| Criteria exposition | **R** | Comparison dimensions / lenses explicit |
| Explanation | **C** | **R** when relationships non-obvious |
| Worked thinking | **R** | One full analytic pass on one case |
| Guided inquiry | **C** | Productive uncertainty prompts |
| Guided practice | **R** | Partial matrix with hint column |
| Independent practice | **R** | Full analysis + **written justification** |
| Verification | **R** | Evidence/criteria audit |
| Reflection | **R** | Why analysis holds |
| Transfer | **C** | New case, same criteria frame |
| Transition | **C** | Link to Evaluate if follows |

### 4.3 Assess LO handling

**Rule AN-ASSESS-01:** LO verb *Assess* with structured comparison, no recommendation → **Analyse** archetype.  
**Rule AN-ASSESS-02:** If statement requires strategy choice or criteria-weighted recommendation → **Evaluate** (not Analyse).

### 4.4 Required materials pattern

| Function | Plan |
|----------|------|
| Criteria exposition | Table headers / lens list in `task_cards` or `prompt_set` spec |
| Worked thinking | `modelling_note` or analytic `worked_example` — one case walkthrough |
| Guided / Independent | `analysis_table` / `comparison_table` + `scenario` when cases involved |
| Verification | `checklist` — “evidence cited?” / dimension coverage |
| Justification | `expected_output` requires prose justification, not cells only |

### 4.5 Anti-shell safeguards (Analyse)

| FAIL if | Condition |
|---------|-----------|
| AN-SHELL-01 | Analysis table without criteria exposition planned |
| AN-SHELL-02 | No worked analytic model before independent analysis |
| AN-SHELL-03 | `expected_output` = “complete table” only — no justification |
| AN-SHELL-04 | Comparison without explicit dimensions (opinion-list risk) |

---

## Section 5 — Evaluate template (priority)

**Authority:** [38I-2 §5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-3 §3.5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md)  
**Benchmark:** [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

### 5.1 Planning order (A4-aligned)

```text
Orientation → Framing (decision context) → Activation
  → Perspective building → Criteria exposition
  → Explanation (constraints) → Worked judgement (exemplar contrast)
  → Guided inquiry (trade-offs) → Guided judgement (partial ranking)
  → Independent judgement → Evaluative judgement → Verification
  → Reflection → Transfer
```

**Note:** *Perspective building* implements competing perspectives (A4 Step 1). *Worked judgement* = strong vs weak exemplar — **not** learner’s final answer.

### 5.2 Function obligations

| Function | Tag | User priority | Planning obligation |
|----------|-----|---------------|---------------------|
| Orientation | **R** | — | Distinguish evaluation from summary/analysis |
| Framing | **R** | — | Decision scenario with constants (income, constraints) |
| Activation | **C** | — | Integrate prior session concepts only — **not** re-teach all LOs |
| **Perspective building** | **R** | Required | Who gains/loses; ≥2 competing priorities named |
| **Criteria exposition** | **R** | Required | ≥3 decision dimensions tied to case — rubric-ready |
| Explanation | **C** | — | Constraints, perspectives background |
| **Worked judgement** | **R** | Required | Weak vs strong exemplar — quality modelling, not spoiler memo |
| Guided inquiry | **C** | Trade-offs | Tension prompts before ranking |
| **Guided judgement** | **R** | Required | Partial comparison table with scoring + justification column |
| **Independent judgement** | **R** | Required | Learner-owned recommendation (memo length in `expected_output`) |
| **Evaluative judgement** | **R** | — | Compare ≥2 options using criteria — distinct from summary |
| **Verification** | **R** | Required | Rubric self-audit checklist |
| Reflection | **C** | Optional metacognitive | What would reverse judgement? |
| **Transfer** | **R** | Required | Learner own context with same criteria |
| Transition | **O** | — | Session closure |

### 5.3 What DLA must plan before learner materials (Evaluate checklist)

| # | Plan item | A4 benchmark section |
|---|-----------|---------------------|
| 1 | Decision scenario constants | Maya household; strategy menu A–E |
| 2 | Distribution lenses (who gains/loses) | Three lenses table |
| 3 | Competing perspectives (≥3) | Household / saver / income-seeker |
| 4 | Criteria rows (≥3) | Four criteria with “why it matters here” |
| 5 | Strategy inventory for comparison | Options A–E — not pre-ranked |
| 6 | Exemplar contrast spec | Weak slogan vs strong criteria-led paragraph |
| 7 | Guided partial ranking table | Columns: criteria scores + justification |
| 8 | Independent task structure | Opening / recommendation / trade-off / revision condition |
| 9 | Verification checkpoints | ≥5 rubric rows |
| 10 | Transfer prompt | Same criteria, learner context |
| 11 | Anti-spoiler guard | Exemplar must not fulfil `expected_output` |

### 5.4 Required materials pattern (Evaluate)

| Function | Plan (existing types) |
|----------|----------------------|
| Framing + Perspective | `scenario` (decision case) + `text` or `prompt_set` for perspectives |
| Criteria exposition | `prompt_set` or `task_cards` — rubric dimensions |
| Worked judgement | `modelling_note` — exemplar contrast (**not** `sample_output` of learner memo) |
| Guided judgement | `decision_table` or `analysis_table` — partial ranking scaffold |
| Independent judgement | `learner_task` segment + optional `template` with blank fields |
| Verification | `checklist` — rubric self-audit |
| Transfer | `transfer_or_application_task` + `prompt_set` |
| Reflection | `self_explanation_prompt` |

**Capstone rule EV-CAP-01:** When Evaluate LO maps with lower LOs on same activity, lower LOs supply **Activation** content only — episode shape stays **Evaluate**. **Forbidden:** consolidation_summary as sole Evaluate vehicle.

**Capstone rule EV-CAP-02:** Evaluate activity must **not** be the only activity with all LOs mapped unless it executes full Evaluate template above.

### 5.5 Anti-shell safeguards (Evaluate)

| FAIL if | Condition |
|---------|-----------|
| EV-SHELL-01 | `consolidation_summary` + reflection prompts only |
| EV-SHELL-02 | No criteria exposition planned |
| EV-SHELL-03 | No perspective building planned |
| EV-SHELL-04 | No worked judgement (exemplar contrast) planned |
| EV-SHELL-05 | No guided partial judgement before independent task |
| EV-SHELL-06 | `learner_task` = “write summary of session” |
| EV-SHELL-07 | Transfer absent when LO/brief requires personal budget |

---

## Section 6 — KM trigger obligations

Translate [38I-3 §3.6](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) into **hard prompt rules**. After archetype template load, apply triggers to **upgrade** function tags.

### 6.1 Trigger rules

| Trigger ID | KM signal (on LO-related concepts) | Effect |
|------------|--------------------------------------|--------|
| **KM-T01** | `misconceptions[]` references mapped concept | Misconception challenge → **R** (Understand); upgrade to **R** on Analyse/Evaluate if episode uses that concept |
| **KM-T02** | `relationships.type = contrasts_with` between mapped concepts | Non-example → **R** (Understand); Criteria exposition upgrade (Analyse) |
| **KM-T03** | `processes[]` with ≥3 steps matching LO/method | Worked thinking → **R** (Apply); force Apply archetype check (AP-OVERRIDE-01) |
| **KM-T04** | `groupings[]` spans mapped concepts | Guided classification (Understand) or Criteria exposition (Analyse) → upgrade **C→R** |
| **KM-T05** | `relationships.type = affects` + household/budget concepts | Transfer → **R** (Evaluate); Perspective building content from income types |
| **KM-T06** | `relationships.type = measures` (e.g. CPI→Inflation) | Explanation + Example population must cite relationship |
| **KM-T07** | Confusable pair in concepts but **no** misconception row | Non-example via `contrasts_with` only — flag inference_required |
| **KM-T08** | `processes[]` named in Policy Communication etc. | Explanation (Evaluate) — macro context only, not task answer |

### 6.2 Application algorithm

```text
FOR each activity:
  concepts_in_scope = LO related concepts ∩ KM
  FOR each trigger KM-T01..T08:
    IF signal present → upgrade function tag OR set inference flag
  Re-run anti-shell for upgraded R functions
```

### 6.3 KM absence fallback

If `knowledge_model` not in context: plan from LO statement + brief only; set `km_confidence: low`; apply inference contracts (Section 7) more aggressively; **do not** skip function planning.

---

## Section 7 — Inference contracts

When KM lacks explicit slots, DLA may **infer** planning content under constraints below. **No new KM keys.**

### 7.1 General inference rules

| Rule | Constraint |
|------|------------|
| **INF-01** | Infer only from LO `statement`, LO notes, brief, and **existing** KM relationships/concepts |
| **INF-02** | Do not invent domain facts not implied by artefacts (e.g. specific inflation rate) unless brief supplies or reasonable minimal scenario constants for Evaluate framing |
| **INF-03** | Criteria dimensions must be **operational** — learner can apply to case |
| **INF-04** | Strategy menus must be **plausible set** (3–6 options), not ranked |
| **INF-05** | Exemplar contrast: model **quality of reasoning**, not single correct answer |
| **INF-06** | Scenario numerics: order-of-magnitude realistic; label as illustrative |

### 7.2 Inference matrix

| Gap | Allowed inference source | Evaluate requirement |
|-----|-------------------------|----------------------|
| **Criteria** | LO evaluate verb + `affects` relationships + household stakes | ≥3 dimensions (A4: purchasing-power, essentials, feasibility, downside) |
| **Perspectives** | KM groupings (e.g. income types) + competing priorities in brief | ≥2 named perspectives with tension |
| **Trade-offs** | Criteria conflict pairs (feasibility vs protection) | ≥1 explicit trade-off prompt in guided inquiry |
| **Judgement rubric** | Criteria exposition rows → verification checklist | ≥4 checkpoint items |
| **Scenario constants** | LO personal budget scope + Fixed/Variable income concepts | Named decision-maker, income, essentials/discretionary split |
| **Strategy inventory** | LO “manage/mitigate strategies” + domain convention | 4–6 strategies, neutral labels |
| **Analytic taxonomy** | LO “causes/types” when not in KM | Standard paired causes — label as framework, cite LO |

### 7.3 Evaluate inference contract (explicit)

When `primary_archetype = Evaluate`:

1. **Criteria exposition** — Derive 3–5 rubric dimensions from LO statement nouns/verbs + KM `affects` chains. Each dimension needs “what you are judging” + “why it matters in this case.”  
2. **Perspective building** — Minimum: beneficiary lens, burdened lens, optional policy context (non-answer). Use KM income groupings when present.  
3. **Trade-offs** — Plan ≥2 guided inquiry prompts where criteria pull against each other.  
4. **Worked judgement** — Plan weak exemplar (slogan/no criteria) vs strong exemplar (criteria + trade-off + conditional recommendation). Strong exemplar **must not** match `expected_output` structure exactly.  
5. **Transfer** — **R** — Plan learner-context prompt using same criteria labels.

### 7.4 Forbidden inferences

| Forbidden | Why |
|-----------|-----|
| Pre-written learner memo in `consolidation_summary` spec | Anti-spoiler |
| Single “correct” strategy ranked in materials | Evaluate requires learner judgement |
| GDP deflator etc. not in KM/LO | No invention |
| Full session summary as Evaluate teaching | H-04 failure mode |

---

## Section 8 — Anti-shell rule

### 8.1 Definition

An **activity shell** is output where:

```text
activity_preamble
+ learner_task (single imperative paragraph)
+ required_materials (types listed with thin specs)
+ expected_output (topic coverage phrase)
```

…without a planned **R-function teaching and verification sequence**.

### 8.2 Planning gate (run before JSON emit)

For each activity, after function plan:

| Check | PASS condition |
|-------|----------------|
| **AS-01** | Every **R** function in archetype template has population entry |
| **AS-02** | `learner_task` has ≥2 segments in function order (teach/model before perform) |
| **AS-03** | ≥1 material spec with teaching depth (worked_example, modelling_note, text exposition, or scenario+narrative) |
| **AS-04** | Verification function planned with ≥4 check items specified |
| **AS-05** | `expected_output` cites observable evidence, not “understanding of topic” |
| **AS-06** | Evaluate archetype passes EV-SHELL-01..07 |

### 8.3 FAIL conditions (do not emit; replan)

| ID | Condition |
|----|-----------|
| **AS-FAIL-01** | Primary archetype identified but <80% of **R** functions populated |
| **AS-FAIL-02** | `learner_task` word count dominates plan but no Worked thinking / Explanation planned |
| **AS-FAIL-03** | Materials chosen only to satisfy DLA-WB row checklist without function mapping |
| **AS-FAIL-04** | Capstone maps Evaluate LO but passes EV-SHELL-01 |
| **AS-FAIL-05** | Apply archetype without Worked thinking when KM-T03 fired |

### 8.4 Relation to DLA-WB

DLA-WB rows remain **necessary** (workbook contract) but **insufficient**. Anti-shell is **downstream** of function plan: WB rows must be **justified** by function mapping, not drive planning.

---

## Section 9 — Anti-spoiler rule

Extend [38H-2 GAM-WB-06b](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-2-gam-consolidation-discipline.md) to **DLA planning** (GAM follows in 38J-4).

### 9.1 Allowed modelling (plan for GAM to expand)

| Allowed | Planning spec |
|---------|---------------|
| Worked reasoning | `worked_example` — expert steps, visible thinking |
| Worked judgement | `modelling_note` — weak vs strong exemplar contrast |
| Criteria teaching | Rubric dimensions + how to apply — not applied ranking for learner case |
| Scaffold frameworks | Sentence starters, blank tables, checklists |

### 9.2 Forbidden (DLA must not plan)

| Forbidden | Applies when |
|-----------|--------------|
| Completed learner memo in `consolidation_summary` spec | `expected_output` requires learner write |
| `sample_output` matching independent task | Independent practice / judgement planned |
| Past-tense session summary (“you have learned”) | Any learner-production task |
| Pre-ranked strategy recommendation | Evaluate guided/independent judgement |
| Pre-filled learner judgement cells | Ranking/compare tables |

### 9.3 DLA planning checks

| Check | Rule |
|-------|------|
| **SP-01** | If `expected_output` contains write/explain/justify/evaluate → `consolidation_summary` spec must say **scaffold-only** |
| **SP-02** | `sample_output` spec must state **not for copying** when Independent practice planned |
| **SP-03** | Worked judgement exemplar must include **weak + strong** — strong is not final learner deliverable |
| **SP-04** | `modelling_note` purpose must not duplicate `expected_output` fulfilment |

### 9.4 Handoff to GAM (38J-4)

DLA specifications should include phrase: *“GAM: scaffold-not-answer per GAM-WB-06b when learner-production required.”* for relevant materials.

---

## Section 10 — Session arc guidance

No session schema. Use **activity_index** (1..N) and `delivery_notes.session_duration_target_minutes`.

### 10.1 Progression model

| Index | Typical archetype curve (Inflation) | Independence |
|-------|-------------------------------------|--------------|
| 1 | Understand | Low — heavy teaching |
| 2 | Apply | Moderate — fade within episode |
| 3 | Analyse | Moderate–high |
| 4 | Evaluate | High — learner owns judgement |

### 10.2 Scaffold fading rules (cross-activity)

| Rule | Guidance |
|------|----------|
| **ARC-01** | `activity_index` 1: highest teaching material count; include Activation only if needed |
| **ARC-02** | Middle activities: assume concepts from prior — Activation brief |
| **ARC-03** | Final activity: no re-teaching all LOs — Activation integrates prior episodes |
| **ARC-04** | Capstone material weight ≤ mid-session practice (GAM-WB-MIX-06 alignment) |
| **ARC-05** | `scaffold_hint_sequence` support decreases as index increases |
| **ARC-06** | Evaluate finale: criteria stay visible — criteria do **not** fade like Apply procedure |

### 10.3 LO distribution planning

| Rule | Guidance |
|------|----------|
| **ARC-LO-01** | One primary LO per activity preferred — capstone exception |
| **ARC-LO-02** | Evaluate LO must have **dedicated** Evaluate-shaped activity — not only multi-LO capstone |
| **ARC-LO-03** | Multi-LO capstone: primary archetype = max level; lower LOs → Activation only |

### 10.4 Transition planning

Each activity plan should include **Transition** function (except final optional): one sentence in preamble or `reasoning_orientation` linking forward.

### 10.5 Duration

Sum 50–70 minutes (DLA-WB-03). Allocate longer `duration_minutes` to Evaluate and first Understand when function plan is rich — do not compress teaching for duration compliance.

---

## Section 11 — Recommended pack changes for 38J-3

*Where to insert Section 1–10 logic into `domain-learning-design-step-patterns.md` §5 — **no replacement text in this slice**.*

### 11.1 Primary insertion: §5 `promptTemplate`

| Block | Content to add (from this doc) |
|-------|-------------------------------|
| **IFP-00** | Mandatory internal planning sequence (Section 1.2) before JSON |
| **IFP-01** | LO-ARC rules + AP-OVERRIDE-01 + AN-ASSESS rules |
| **IFP-02** | Archetype template summaries (Sections 2–5) — function orders + R/C/O tables |
| **IFP-03** | KM trigger table KM-T01..T08 (Section 6) |
| **IFP-04** | Inference contracts INF-01..06 + Evaluate contract (Section 7) |
| **IFP-05** | Anti-shell gate AS-01..06 + AS-FAIL (Section 8) |
| **IFP-06** | Anti-spoiler planning SP-01..04 (Section 9) |
| **IFP-07** | Session arc ARC-01..06 (Section 10) |
| **IFP-08** | Replace compressed bundle one-liner with “execute template for primary_archetype” |

**Placement:** After Context/Task, **before** “Output: Return JSON” — planning is **instruction**, not output schema.

### 11.2 Secondary insertion: §5 `defaultPromptNotes`

Short reinforcement: internal function plan mandatory; anti-shell; Evaluate A4 bar; KM triggers hard.

### 11.3 DLA-WB row additions (38J-3 consideration)

| Proposed row | Purpose |
|--------------|---------|
| **DLA-WB-22** | Evaluate archetype: requires criteria + scenario + modelling_note or exemplar contrast + guided judgement table + transfer |
| **DLA-WB-23** | Apply archetype: requires worked_example when process ≥3 steps |
| **DLA-WB-24** | Anti-shell: replan if AS-FAIL triggered |
| **DLA-WB-25** | Session arc: activity_index fade notes in delivery_notes |

Rows reference function plan — not material checklist alone.

### 11.4 Deferred to 38J-4 (§6 GAM)

| Item | Reason |
|------|--------|
| Function-ordered material emission | DLA must spec order in `required_materials` + purpose prefixes |
| GAM-WB-06b cross-reference from DLA specs | Section 9.4 |
| Evaluate body depth targets | Match A4 section lengths |

### 11.5 Not changed in 38J-3

| Surface | Reason |
|---------|--------|
| JSON output schema | No expansion |
| §6 full rewrite | 38J-4 scope |
| Design Page | Read-only |
| Harness | 38J-5 |

### 11.6 Implementation order (38J-3)

1. Insert IFP-00, IFP-01, IFP-05 (planning + anti-shell) — highest leverage  
2. Insert IFP-02 Evaluate template + IFP-04 Evaluate inference  
3. Insert IFP-02 Understand/Apply/Analyse + IFP-03 triggers  
4. Insert IFP-06, IFP-07 + DLA-WB-22..25  
5. Regression: workbook-contract prompt-surface tests + `EV-38J` proof (38J-5)

### 11.7 Acceptance bar for 38J-5

Generated Inflation DLA/GAM must be traceable to this document:

- A4 passes EV-SHELL-01..07 and SP-01..04  
- A2 uses Apply template with KM-T03  
- A1 includes KM-T01/T02 if KM present  
- Anti-shell gate would PASS all four activities  

---

## References

- [38J-1 baseline inspection](38J-1-baseline-inspection.md)
- [38I-2 instructional episode model](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)
- [38I-3 KM/LO mapping](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md)
- [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)
- [38I-4 target mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)
- [38H-2 GAM consolidation discipline](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-2-gam-consolidation-discipline.md)

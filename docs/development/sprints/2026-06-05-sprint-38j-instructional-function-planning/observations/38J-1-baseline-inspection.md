# Slice 38J-1 — Baseline inspection (DLA/GAM generation path)

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Analysis only — no pack, prompt, or code changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38J-1  
**Predecessor authority:** [38I-6 closure](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-6-sprint-closure.md)

**Sources inspected:** Pack §5/§6 (`domain-learning-design-step-patterns.md`) · [EV-38G-AFTER DLA](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-dla-learning-activities.json) · [EV-38G-AFTER GAM](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-gam.txt) · [EV-38G-AFTER page](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-design-page.json) · [38G-5 ACM trace](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md) · [38I-4 targets](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) · [38I-5 implications](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)

---

## Primary question

> Why does the current pipeline generate **activity shells** instead of **instructional episodes**?

**Short diagnosis:** The pack **already instructs** coached episodes and LO-level bundles, but generation **plans activities as material checklists + task verbs**. There is **no internal step** that selects an episode archetype, sequences instructional functions, or binds KM triggers to **R** moves before `learner_task` and `required_materials` are emitted. GAM **faithfully realises** what DLA specifies and **cannot recover** missing episode choreography because it is bound to “do not redesign activities.” Richness is therefore **lost at DLA planning**, not at renderer compose.

---

## Section 1 — Current DLA behaviour

### 1.1 What DLA currently plans

Per pack §5 (`Design Learning Activities`), DLA output schema is:

| Output element | Role |
|----------------|------|
| `activities[]` | One row per activity block |
| `activity_id`, `title`, `grouping`, `duration_minutes` | Session structure |
| `mapped_learning_outcomes` | LO linkage |
| `required_materials[]` | `{ material_id, type, purpose, specification }` — **requirements only** |
| `learner_task`, `expected_output` | Primary learner-facing task shell |
| `activity_preamble` + optional cognition fields | Orientation / hints (`prior_knowledge_activation`, `scaffold_hint_sequence`, etc.) |
| `delivery_notes` | Workbook contract flags (`workbook_contract_applied`, consolidation, duration) |
| `outcome_alignment` | Trace map |

**DLA-WB contract (38E–38G):** Mandatory **material rows** (early `worked_example` + `sample_output`; practice `analysis_table`; `scenario`; capstone `consolidation_summary`), duration sum, capstone multi-LO mapping, anti-table-only session rules.

**38G ACM rows (DLA-WB-20/21):** Encode component coverage in purpose/specification language — orientation, elucidation, practice, verification — **without** a function sequence field.

### 1.2 What DLA currently omits

| Omission | Evidence |
|----------|----------|
| **Episode archetype** per activity | No `primary_archetype` or equivalent in schema or `EV-38G` output |
| **Ordered instructional function plan** | No function sequence; no R/C/O tags |
| **KM trigger obligations** as planning rules | Pack mentions misconceptions/processes; no executable “if misconception → Misconception challenge **R**” |
| **Evaluate inference contracts** | No criteria/perspectives/trade-off authoring rules beyond bundle one-liner |
| **Function-ordered learner journey** | `learner_task` is single block; not segmented by teaching moves |
| **Archetype-over-LO-verb override** | A2 LO *Analyze* → no explicit Apply archetype for CPI calculation |
| **Dedicated Evaluate episode** | A4 capstone maps all LOs; no sole Evaluate activity |
| **Session fade contract** | DLA-WB-05 prose only; not tied to function depth per activity index |

### 1.3 Where LO is used

| Use | How |
|-----|-----|
| **Mapping** | `mapped_learning_outcomes` per activity |
| **Verb → bundle (implicit)** | Pack line: *“Apply LO cognitive-demand component bundles… Understand => orientation + concept elucidation + check; Apply => worked example + guided practice + verification; …”* |
| **Capstone aggregation** | DLA-WB-02/13: final activity maps ≥3 LOs |
| **Cognition field tone** | `reasoning_orientation`, `expected_output` shaped by LO verb |

LO **selects activity type loosely** via bundle one-liners but does **not** drive a **function plan** with required moves.

### 1.4 Where KM is used

Pack §5 instructs:

- Use concepts, definitions, relationships, processes, groupings, misconceptions in `required_materials` purpose/specification  
- Shape explanatory links; require worked reasoning from processes; require misconception handling when relevant  
- Avoid LO→task shells that skip instructional setup  

**`EV-38G-AFTER` reality:**

| KM signal | DLA usage |
|-----------|-----------|
| Inflation definition, causes | A1 worked_example **spec** references KM; GAM populates demand-pull/cost-push |
| CPI process | **Not** driving A2 — no `worked_example` for calculation steps |
| CPI vs GDP deflator misconception | A1 `support_note` only — **no** dedicated misconception challenge material |
| Fixed/variable income, household budgets | A3 scenario spec — **partial** |
| Policy communication | **Absent** from DLA/GAM (also absent from 38G harness KM) |

**Note:** 38G capture ran **without frozen KM JSON** ([38G-5 §capture note](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md)). Post-38H KM harness exists (`EV-38H-AFTER-knowledge-model.json`). Baseline failure mode is still **planning**, not KM absence alone — pack already tells DLA to use KM when present.

### 1.5 Implicit archetype logic?

**Yes — rhetorical, not operational.**

Pack §5 `promptTemplate` includes:

```text
Apply LO cognitive-demand component bundles in activity design:
Understand => orientation + concept elucidation + check
Apply => worked example + guided practice + verification
Analyse => comparison/classification + reasoning scaffold + verification + transition
Evaluate => trade-offs + judgement + justification + reflection + transition
```

And: *“Build coached episodes, not LO->task shells.”*

This is **implicit archetype guidance** collapsed into:

1. A **material-type checklist** (DLA-WB rows)  
2. **Short cognition fields** on ~half of activities  
3. **One `learner_task` paragraph** per activity  

There is **no** mandatory pass that says: *for this LO, emit these functions in order before writing learner_task*.

### 1.6 Does DLA think in activities, functions, or neither?

| Model | Verdict |
|-------|---------|
| **Activities** | **Primary** — DLA’s unit of planning is `activities[]` with materials + task |
| **Instructional functions** | **Secondary rhetoric** — named in pack/ACM rows, **not** planning primitives |
| **Neither (pure LO→task)** | **Avoided in intent** but **achieved in output** when bundles are not operationalised |

**Answer:** DLA thinks in **activities with material types and task verbs**. Instructional functions are **referenced in pack prose** but **not instantiated** as an internal planning structure.

---

## Section 2 — Current GAM behaviour

### 2.1 How GAM expands DLA

Pack §6 (`Generate Activity Materials`):

| Rule | Effect |
|------|--------|
| `learning_activities` = **source of truth** | GAM must not redesign activities or structure |
| Realise **100%** of `required_materials` with full bodies | LD-MATERIALS-COPY |
| Use KM + LO affordances to enrich bodies | When DLA specs allow |
| Material-type-specific bodies | worked_example ≥3 steps; scenario ≥2 cases; consolidation_summary ≥80 words |
| GAM-WB-06b (38H-2) | Anti-spoiler when learner-production required |
| Output order | Activity header → Material blocks in listed order |

### 2.2 Ordering preservation

| Ordering | Preserved? |
|----------|------------|
| Activity sequence A1→A4 | **Yes** — session order from DLA |
| Materials within activity | **Yes** — GAM follows `required_materials` list order |
| **Instructional function sequence** | **N/A** — not specified in DLA |
| Cognition fields | **Not in GAM** — pass through DLA → page |

GAM does **not** impose episode function order; it **expands specifications**.

### 2.3 Instructional moves preservation

| Move | GAM behaviour on `EV-38G` |
|------|---------------------------|
| Orientation | DLA `activity_preamble` — not GAM-authored |
| Concept elucidation | **Strong when** DLA lists `worked_example` (A1) |
| Worked reasoning | A1 full steps; **A2 none** (DLA omitted) |
| Misconception handling | Embedded in task_cards/support_note — not dedicated block |
| Verification | prompt_set / checklist — **present** where DLA listed |
| Evaluate judgement | **Absent** — A4 no `modelling_note`, `rubric`, decision scenario |
| Consolidation | A4 `consolidation_summary` — **spoiler essay** (pre-38H-2 class; [38H-1 H-04](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-1-workbook-realisation-fidelity-analysis.md)) |

### 2.4 Consolidation behaviour

- DLA-WB-12 **requires** `consolidation_summary` on capstone  
- GAM authors ≥80-word closure body  
- When `learner_task` requires learner write, GAM-WB-06b requires **scaffold-only** — `EV-38G` violated (model essay)  
- `prompt_set` supplements but does not replace consolidation  

Consolidation is treated as a **genre slot**, not an **Evaluate episode**.

### 2.5 Could GAM already realise richer episodes if DLA supplied richer structures?

**Yes — with limits.**

| Evidence | Implication |
|----------|-------------|
| A1 GAM `worked_example` ~200 words, 3 steps | GAM **can** teach when DLA requests material + rich spec |
| A3 GAM scenario + table + checklist | GAM **can** support Analyse-shaped practice |
| GAM bound: “do not redesign activities” | Cannot add teaching blocks DLA did not specify |
| No function-order field | GAM cannot reorder moves into episode arc |
| Page compose preserves materials ([38G-5](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md)) | Downstream **not** primary blocker |

**Answer:** GAM is **capable but downstream of DLA**. Richer **structures and specifications** from DLA (more materials, function-ordered specs, inference-filled Evaluate requirements) would flow through GAM **without renderer changes**. GAM alone cannot fix LO→task shells.

---

## Section 3 — Inflation trace

### 3.1 Chain overview

```text
KM (38H: 7 concepts, processes, misconceptions, relationships)
  → LO (4 outcomes: Explain, Analyze, Assess, Evaluate)
    → DLA (4 activities, material specs, ~110-word tasks)
      → GAM (full material bodies)
        → Page (verbatim merge per 38G-5)
```

### 3.2 A1 — Where intent becomes shell

| Stage | Instructional intent | Task-shell signal |
|-------|---------------------|-------------------|
| **LO** | *Explain inflation and causes* | Understand demand |
| **DLA** | Lists worked_example, sample_output, task_cards; preamble + cognition fields | `learner_task`: *“Study the worked example… Then write your own explanation”* (~45 words) — **allocates** work, does not **teach** discrimination, non-examples, CPI/deflator repair |
| **GAM** | Rich worked_example (3 steps, causes) | Teaching lives **inside** material; learner journey not integrated |
| **Page** | Preserves worked_example + thin task | Learner must infer episode arc from materials |

**Transition point:** **DLA `learner_task` + missing function plan** — pack asked for coached episode; output is **study-then-write** with strong GAM appendix.

**vs [38I-4 A1 target](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md):** ~950 words integrated teaching (non-example table, misconception challenge, guided classification, verification).

### 3.3 A2 — Purest shell

| Stage | What happens |
|-------|--------------|
| **LO** | *Analyze CPI… interpret trends* |
| **DLA** | `analysis_table` + `prompt_set` only — **no** `worked_example`, no procedure exposition material |
| **GAM** | Empty CPI table + formula in prompt_set |
| **Page** | Task: calculate, classify, interpret — **no** worked thinking fade |

**Transition point:** **DLA material selection** — Apply-shaped procedure not planned despite KM `Calculating CPI Inflation` process ([38I-3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) P3).

### 3.4 A4 — Evaluate collapse (H-04)

| Stage | What happens |
|-------|--------------|
| **LO** | *Evaluate strategies to manage inflation on personal budgets* |
| **DLA** | Capstone maps **all 4 LOs**; materials = `consolidation_summary` + `prompt_set` only — **no** criteria exposition, scenario, rubric, `modelling_note`, exemplar contrast |
| **GAM** | Spoiler consolidation essay + reflection prompts |
| **Page** | Learner asked to write summary; consolidation **pre-answers** task |

**Transition point:** **DLA arc + material plan** — Evaluate LO **labelled** on capstone, **not instructionally planned** as Evaluate archetype.

**vs [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md):** perspectives → criteria → worked judgement → guided table → independent memo → verification → transfer (~1,300 words).

### 3.5 Page layer

[EV-38G-AFTER-design-page.json](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-design-page.json) constraints: *“Preserved … verbatim”*, *“No redesign of pedagogy”*.  

**Losses at page** ([38G-5](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md)): table `*Instructions:*` prose trimmed on A2 — **minor** vs shell problem.

---

## Section 4 — Candidate insertion points

*Identification only — no edits proposed.*

### 4.1 Pack §5 — DLA `promptTemplate` (primary)

| Insertion | Purpose |
|-----------|---------|
| **Pre-activity planning block** (internal instructions) | Archetype selection per LO-ARC rules before each `activities[]` entry |
| **Function-plan template invocation** | Per archetype: ordered R/C/O moves from [38I-2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) |
| **KM trigger table** | Obligation upgrades ([38I-3 §3.6](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md)) |
| **Inference contracts** | Evaluate criteria/perspectives when KM lacks slots |
| **Anti-shell gate** | Reject emission if only preamble + learner_task without **R** function coverage |
| **`required_materials` derivation** | Each **R** function → material type + specification (not reverse) |

**Framing:** Internal prompt logic — **not** new JSON field required for v1; model plans functions **then** fills existing schema.

### 4.2 Pack §5 — `defaultPromptNotes` / DLA-WB rows

| Insertion | Purpose |
|-----------|---------|
| **DLA-WB-22+ (future rows)** | Archetype-specific mandatory material patterns (e.g. Evaluate requires rubric or criteria prompt_set + scenario) |
| **Session arc row** | Activity index → expected scaffold depth / independence |

Secondary to promptTemplate — reinforces operational rules.

### 4.3 Pack §6 — GAM `promptTemplate`

| Insertion | Purpose |
|-----------|---------|
| **Function-ordered emission** | When DLA specification lists function order in purpose/specification, GAM sections Content accordingly |
| **Evaluate bodies** | modelling_note / rubric / exemplar contrast realisation rules |
| **GAM-WB-06b enforcement** | Already present — hold |

GAM insertion is **second** — only after DLA specifies richer structure.

### 4.4 Runtime / harness (38J-5)

| Insertion | Purpose |
|-----------|---------|
| Pass `EV-38H-AFTER-knowledge-model.json` into DLA/GAM | KM population reliability |
| Function coverage scoring (optional) | Compare output to 38I-2 **R** moves |

Not generation logic — **validation**.

### 4.5 Explicitly not insertion points (per charter)

| Surface | Why not |
|---------|---------|
| New workflow step | 38-J framing: internal DLA logic only |
| Persistent IFP artefact | Deferred unless proof requires |
| ACM schema | Frozen [38G-2](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) |
| Design Page compose | Read-only; 38H preservation holds |
| Renderer / `app.js` | Target uses existing components |

---

## Section 5 — Failure-mode diagnosis

### 5.1 Option assessment

| Mode | Applies? | Evidence |
|------|----------|----------|
| **A. Missing information** | **Partial** | 38G run lacked frozen KM; inflation KM now available. Pack **already contains** episode instructions — information is not the main gap |
| **B. Missing instructional planning** | **Primary** | No archetype selection or function sequence before DLA output; [38I-5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) hypothesis confirmed |
| **C. DLA simplification** | **Primary** | Model satisfies DLA-WB **material rows** while emitting thin `learner_task`; A2/A4 omit teaching materials despite pack bundles |
| **D. GAM simplification** | **Secondary** | A4 spoiler is GAM genre failure; most gaps originate in DLA specs. GAM enriches A1 worked_example — not uniformly thin |
| **E. Combination** | **Yes — best fit** | **B + C** dominant; **D** local (consolidation); **A** mitigated by 38H KM |

### 5.2 Failure mechanism (one sentence)

The model **complies with workbook material checklists** and **ignores coached-episode choreography** because the pack does not **force** an internal function-planning pass before `learner_task` and `required_materials` emission.

### 5.3 Why `EV-38G` still looks like success for 38G

[38G-5](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md) correctly shows **improvement over 38F** — preambles, cognition fields, retrieval materials, scenario depth. That is **visible pedagogy + material coverage**, not **episode richness** per [38I-1/38I-2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md). 38-J addresses the **next** gap.

---

## Section 6 — Minimal-change assessment

### 6.1 Is the 38I-5 hypothesis correct?

> Rich episodes can plausibly emerge through **prompt-level planning changes alone** (no schema, ACM, renderer).

| Claim | Baseline verdict |
|-------|------------------|
| **Plausible** | **Yes** — A1 GAM proves materials can carry teaching; target states use existing types only |
| **Sufficient without prompt depth** | **No** — current §5 bundles are too compressed to operationalise |
| **Renderer required** | **No** — page preserves GAM bodies |
| **Schema required** | **No** — function plan can live in prompt instructions + richer specifications |
| **GAM changes required** | **Yes, secondary** — function-ordered emission + Evaluate body rules — still pack §6 only |

### 6.2 What prompt-level planning must add (minimum)

1. **Mandatory internal sequence:** archetype → functions → materials → learner_task segments  
2. **KM triggers** as hard obligations, not suggestions  
3. **Evaluate inference contract** when archetype = Evaluate  
4. **Anti-shell** validation instructions before JSON return  
5. **Session fade** guidance across activity index  

### 6.3 Residual risks (unchanged from 38I-6)

| Risk | Baseline note |
|------|---------------|
| Inference variance on Evaluate | Prompt contracts must be explicit ([38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) is the bar) |
| Token / length | Longer specs + GAM bodies — manage in 38J-5, not pre-constrained |
| KM in harness | 38J-5 should use `EV-38H-AFTER-knowledge-model.json` for fair proof |

---

## Section 7 — Recommended implementation focus for 38J-2

**38J-2 deliverable:** `observations/38J-2-function-plan-prompt-design.md`

### 7.1 Priority order

| Priority | Focus | Rationale |
|----------|-------|-----------|
| **P1** | **Evaluate function-plan template + inference contract** | H-04; largest gap A4; [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) is acceptance spec |
| **P2** | **Understand template** | Misconception trigger; non-example; verification — KM well-populated on inflation |
| **P3** | **Apply template** | Worked thinking + fade; archetype-over-LO-verb for A2 |
| **P4** | **Analyse template** | Criteria matrix + worked analytic pass |
| **P5** | **Cross-cutting anti-shell + anti-spoiler** | Operationalise existing pack intent |
| **P6** | **Session arc / fade table** | Activity 1→4 independence curve |

### 7.2 What 38J-2 should produce (content spec, not implementation)

For each archetype:

- Ordered **R/C/O** function list (from 38I-2)  
- KM read list per **R** function  
- `required_materials` mapping per function (existing types)  
- Cognition field mapping per function  
- **Inference flags** (Evaluate criteria, scenario numerics)  
- **Anti-patterns** (LO→task only; sample_output as copy target; capstone spoiler)  
- **Minimum specification depth** for `purpose`/`specification` fields (so GAM has structure to expand)

### 7.3 What 38J-2 should defer to 38J-3/4

- Actual pack §5/§6 string edits  
- Harness changes  
- Proof run  

### 7.4 Success criterion for 38J-1 (this slice)

| Criterion | Met? |
|-----------|------|
| Clear diagnosis why `EV-38G` = shells | **Yes** — §5, §3 |
| Where to introduce function planning | **Yes** — §4 (pack §5 primary) |
| GAM vs DLA attribution | **Yes** — DLA primary, GAM secondary |
| 38I-5 hypothesis assessed | **Yes** — §6, prompt-level sufficient |
| No implementation proposed | **Yes** — insertion points only |

---

## References

- [38I-5 implementation implications](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)
- [38I-6 sprint closure](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-6-sprint-closure.md)
- [38I-2 episode model](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)
- [38I-3 KM/LO mapping](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md)
- [38I-4 target mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)
- [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)
- `domains/learning-design/domain-learning-design-step-patterns.md` §5, §6
- [EV-38G-AFTER DLA](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-dla-learning-activities.json)
- [EV-38G-AFTER GAM](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-gam.txt)
- [EV-38G-AFTER page](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-design-page.json)
- [38G-5 ACM trace](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md)

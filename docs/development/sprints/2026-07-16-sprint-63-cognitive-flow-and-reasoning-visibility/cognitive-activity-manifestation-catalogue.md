# Cognitive Activity Manifestation Catalogue

**Sprint:** 63 — Cognitive Flow & Reasoning Visibility  
**Type:** Discovery / architecture artefact (not a schema)  
**Date:** 2026-07-16  
**Status:** Evidence-based catalogue  

**Primary evidence:** [activity-type-system-inventory.md](activity-type-system-inventory.md)  
**Related:** [Sprint 63 charter](../../../sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md) · [learning-experience-evolution.md](../../../architecture/learning-experience-evolution.md) · [Sprint 62 presentation slice](../2026-07-16-sprint-62-coherent-renderer-pass/learner-journey-presentation-slice.md)

**Method:** Bridge distributed PRISM identity signals → cognitive operations → candidate learner-facing manifestations. RNA A1–A6 are worked examples only. No new canonical activity-type vocabulary. No invented instructional meaning.

---

## 1. Executive Summary

### Why homogeneous activity rendering is insufficient

Sprint 62 showed that **navigation labels** (Understand → See it modelled → Your turn → Check your work) improve journey coherence, but they apply the **same presentation grammar** to activities that demand different reasoning moves. The inventory shows RNA A1 (classification) and A2 (causal analysis) can share an identical shortened beat list while differing mainly in `material_type` and task prose ([inventory §6.1–6.2](activity-type-system-inventory.md)). Learners therefore experience structural sameness even when the cognitive job differs.

### Which existing signals can support differentiated manifestation

| Signal | Reach renderer? | Use in manifestation |
| ------ | --------------- | -------------------- |
| `material_type` | Yes | Strong family cue (e.g. `classification_table` vs `decision_table`) — `lib/beat-material-registry.js` |
| `beats[].function` | Yes | Phase structure + Sprint 62 labels — `app.js`, registry |
| `episode_plan.archetype` | Weak UI; present on page | Secondary confidence (Bloom shell) — `lib/episode-plan-v1-templates.js` |
| `learner_task` / `expected_output` | Yes | Frame labels only when text already present — Sprint 62 |
| Checklist / cognition field prose | Yes when authored | Criteria / framing visibility |
| `instructional_archetype` + `archetype_plan` | **No** (stops at GAM) | Tier 1 cognitive contract — `lib/ld-instructional-archetype.js` |
| `activity_interaction_type` | Specialised paths | Sequencing / ranking modalities |

### Why this is a discovery artefact, not a schema

The catalogue describes **candidate learner-facing shapes** conditioned on existing signals. It does **not** introduce a new enum, replace episode/instructional/material vocabularies, or prescribe production renderer behaviour.

### Confidence overview

| Tier | Meaning | Safe manifestation changes |
| ---- | ------- | -------------------------- |
| **1** | Explicit instructional archetype + plan | Expose plan-keyed structure **if** plan reaches the page (today: only via GAM body prose) |
| **2** | Converging episode + beats + materials + task/output | Reorder/group/label/foreground **existing** materials; family-specific phase labels only when tied to present content |
| **3** | Sparse verbs / isolated materials | Minimal label tweaks; prefer generic |
| **4** | Unknown | Generic Sprint 62 journey only |

### Testable without upstream redesign

**Immediately testable (render-time):** classification vs causal analysis vs evaluation using `material_type` + beats + episode archetype already on assembled pages (e.g. RNA fixture).  
**Propagation-only:** any manifestation that needs `archetype_plan` fields (`start`/`outcome`/`required_links`, `criteria`/`evidence`/`tradeoffs`, etc.).  
**Not currently testable:** families with only docs-only instructional IDs (diagnosis, recommendation, …).

---

## 2. Manifestation Design Principles

### 2.1 Preserve authored meaning

A manifestation **may**: reorder, group, label, foreground, visually differentiate, expose relationships **already encoded**.

A manifestation **must not**: invent reasoning steps; fabricate criteria; add unsupported evidence; infer goals absent from `learner_task` / framing fields; rewrite the instructional contract.

*(Aligned with Sprint 62 hard boundary and charter Working Hypothesis.)*

### 2.2 Manifest cognition, not just content type

A table does not determine the family:

| Material | May support |
| -------- | ----------- |
| `analysis_table` | Causal analysis, comparison, systems analysis |
| `classification_table` | Classification |
| `decision_table` | Evaluation / judgement |
| `planning_table` | Process / planning (out-of-registry; inventory §2.6) |

Cognitive operation requires **multi-signal** reading (episode + beats + materials + task/output ± instructional archetype).

### 2.3 Prefer multi-signal confidence

Stronger when several of these converge: episode archetype, beat functions, instructional archetype, archetype-plan structure, learner-task verbs, expected output, material types.

### 2.4 Allow graceful fallback

If signals conflict or confidence is Tier 3–4, retain the **current generic** activity manifestation (Sprint 62 journey labels + material-type UI). Prefer preserve over invent.

### 2.5 Keep layer distinctions

Never collapse: cognitive family ≠ episode archetype ≠ instructional archetype ≠ archetype plan ≠ beat sequence ≠ material type ≠ interaction type ≠ assessment type ≠ visual component ≠ renderer layout.

---

## 3. Confidence Model

### Tier 1 — Explicit cognitive contract

**Support:** recognised `instructional_archetype` ∈ {`mechanism_explanation`, `process_walkthrough`, `mental_model_building`, `evaluation_judgement`} plus corresponding `archetype_plan` (`PLAN_KEYS` in `lib/ld-instructional-archetype.js` lines 136–152).

**Safe changes:** If plan fields are available at render time, surface them as structural headings wrapping **unchanged** authored values (e.g. list `required_links` as “Links in the chain” only when those strings exist). Do not expand or paraphrase.

**Today’s limit:** Plan does not reach learner render ([inventory §2.3, §8.5](activity-type-system-inventory.md)). Tier 1 manifestations are **propagation experiments**, not current production behaviour.

### Tier 2 — Strongly inferred

**Support:** Consistent combination of episode archetype + beat functions + material types + task/output wording (no instructional archetype required).

**Safe changes:** Family-aware phase labels that rename existing beats; grouping materials by reasoning role already implied by beat assignment; foreground checklist/expected_output already present; emphasise distinctive material UI already supported (classification vs decision table still share worksheet chrome — content/columns carry meaning).

### Tier 3 — Weakly inferred

**Support:** Mainly verbs, isolated material types, or incomplete fixtures.

**Safe changes:** At most soft emphasis (e.g. keep generic labels; do not claim a cognitive family in UI).

### Tier 4 — Unknown

**Support:** No reliable signal.

**Safe changes:** Generic manifestation only.

---

## 4. Catalogue of Cognitive Activity Families

Families below require repository evidence. Pedagogically plausible but undocumented families are listed in §4.12 as **insufficient evidence**.

---

### 4.1 Classification

#### Cognitive purpose

Assign cases to categories using an organising principle (e.g. genome polarity → virus class).

#### Expert reasoning pattern

```text
identify organising principle
→ examine case features
→ assign category
→ test boundary / counter-example
→ verify against criteria
```

#### Evidence in PRISM

| Kind | Values / locations |
| ---- | ------------------ |
| Episode | Often `understand` — RNA A1 (`tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json`) |
| Instructional archetype | **None** in production allowlist specifically for classification |
| Interaction | `classification` documented in domain LD artefacts ([inventory §2.1](activity-type-system-inventory.md)) |
| Beats | `explanation`, `worked_thinking`, `guided_practice`, `verification` (RNA A1) |
| Materials | `classification_table` (registry PRACTICE); `worked_example`; `sample_output`; `checklist`; `text` — `lib/beat-material-registry.js` |
| Task verbs | “Classify…”, “Study the … classification table” (RNA A1) |
| Expected output | “Completed classification table…” |

#### Information required by the learner

| Kind | Need |
| ---- | ---- |
| Domain | Category definitions / feature cues |
| Reasoning structure | Organising principle (may be only in exposition body) |
| Quality criteria | Checklist criteria when present |
| Evidence | Cases / examples to classify |
| Constraints | Boundary cases (optional; often absent) |

#### Current generic manifestation

Uniform Frame (if goal-shaped) / What to do → Understand → See it modelled → Your turn → Check your work; `classification_table` as generic worksheet (`app.js` worksheet path).

#### Candidate cognitive manifestation

```text
Organising principle (from existing exposition)
→ Modelled classification (worked_example / sample_output)
→ Classification attempt (classification_table)
→ Check against criteria (checklist)
```

#### Suitable learner-facing labels

| Label | Safety |
| ----- | ------ |
| Understand / See it modelled / Your turn / Check your work | Safe generic (Sprint 62) |
| “Classification grid” as material title | Only if title already authored |
| “Organising principle” | **Requires** explicit heading/prose already in body — do not invent |

#### Suitable visual structures

Classification matrix (already table); optional feature→category columns **only if** present in authored table.

#### Unsafe manifestation moves

Invent category definitions; invent boundary tests; invent “why this feature matters” rationales not in body.

#### Minimum required signals

`classification_table` **or** (`activity_interaction_type` = `classification`) plus practice beat; preferably checklist.

#### Fallback behaviour

Generic journey + worksheet table.

#### RNA example — A1

| Item | Value |
| ---- | ----- |
| Source signals | `classification_table`, episode `understand`, inventory learner_task, checklist |
| Inferred family | Classification |
| Current | Generic journey; table as worksheet |
| Candidate | Emphasise classification matrix role; retain bodies |
| Tier | **2** (strong material + task; no Tier 1 instructional archetype) |

---

### 4.2 Mechanism / causal explanation

#### Cognitive purpose

Explain how a start condition produces an outcome through intervening links.

#### Expert reasoning pattern

```text
state start condition
→ follow required intervening links
→ account for outcome (including multi-phase outcomes)
→ verify completeness of chain
```

#### Evidence in PRISM

| Kind | Values / locations |
| ---- | ------------------ |
| Instructional | `mechanism_explanation` — `lib/ld-instructional-archetype.js` ALLOWED + `PLAN_KEYS`: `start`, `outcome`, `required_links` |
| GAM | `RULES.mechanism_explanation` (same file) |
| Episode | Often `analyse` — RNA A2 |
| Beats | `explanation`, `worked_thinking`, `guided_practice`, `verification` |
| Materials | `analysis_table`, `worked_example`, `text`, `checklist` |
| Task | “Complete the analysis table using the worked example” (RNA A2) |

#### Information required

| Kind | Need |
| ---- | ---- |
| Domain | Mechanism content |
| Reasoning structure | Start → links → outcome (**explicit in archetype_plan when Tier 1**) |
| Quality criteria | Checklist |
| Evidence | Observations / steps in table |
| Sequence / dependency | Order of causal links |

#### Current generic manifestation

Same shortened beat grammar as classification; `analysis_table` as worksheet; Sprint 62 Frame works well when learner_task is goal-shaped (A2).

#### Candidate cognitive manifestation

```text
Goal (existing learner_task)
→ Success criteria (existing checklist / output)
→ Mechanism overview (text)
→ Follow the chain (worked_example)
→ Trace the chain (analysis_table)
→ Check the chain (checklist)
```

With Tier 1 plan present (propagation): surface `start` / `required_links` / `outcome` as structure around **unchanged** strings.

#### Suitable learner-facing labels

| Label | Safety |
| ----- | ------ |
| Follow the chain / Trace the mechanism | Safe **only** as beat relabel when worked/analysis materials already causal; do not invent chain steps |
| Sprint 62 generics | Always safe |

#### Suitable visual structures

Causal chain or ordered analysis table (authored columns); not a new invented link list.

#### Unsafe moves

Fabricate `required_links`; invent multi-phase outcomes; claim mechanism completeness without checklist/plan.

#### Minimum required signals

Tier 2: `analysis_table` + `worked_example` + analyse/understand episode **or** causal task verbs.  
Tier 1: `instructional_archetype` = `mechanism_explanation` + plan.

#### Fallback

Generic journey + analysis worksheet.

#### RNA example — A2

| Item | Value |
| ---- | ----- |
| Signals | episode `analyse`, `analysis_table`, worked_example, goal-shaped task, checklist |
| Family | Mechanism / causal explanation |
| Tier | **2** on fixture (**1** if `mechanism_explanation` stamped and propagated) |
| Candidate | Causal-trace manifestation using existing materials; Frame already strong |

---

### 4.3 Process walkthrough / process modelling

#### Cognitive purpose

Perform a staged investigation or planning process where later stages consume earlier findings.

#### Expert reasoning pattern

```text
establish process goal
→ stage 1 finding
→ carry forward
→ stage n finding
→ bounded conclusion
```

#### Evidence in PRISM

| Kind | Values / locations |
| ---- | ------------------ |
| Instructional | `process_walkthrough` — plan keys `process_goal`, `stages` (`ld-instructional-archetype.js`) |
| GAM | `RULES.process_walkthrough` |
| Episode | Often `apply` — RNA A3 |
| Materials | `scenario`, `planning_table` (⚠ not in beat registry), `checklist`, `text` |
| Task | “Read the scenario and complete the planning table” (RNA A3) |

#### Information required

Process goal; ordered stages; scenario constraints; checklist criteria; carry-forward dependencies (often only in worked body when Tier 1).

#### Current generic manifestation

Scenario card + worksheet-like planning table; apply episode; possible diagnostics for unassigned `planning_table` ([inventory §6.3](activity-type-system-inventory.md)).

#### Candidate cognitive manifestation

```text
Situation (scenario)
→ Process goal (from task / text / plan)
→ Staged attempt (planning_table rows as stages if authored)
→ Check (checklist)
```

#### Labels

“Stage the response” / “Carry findings forward” — **unsafe** unless stage language already in materials. Prefer Sprint 62 generics + material titles.

#### Visual structures

Process timeline **only if** stages exist as authored rows/headings; scenario card (already supported).

#### Unsafe moves

Invent stages; invent process_goal; renumber table into false process order.

#### Minimum signals

Tier 1: `process_walkthrough` + plan. Tier 2: `scenario` + planning/analysis table + apply-like task.

#### Fallback

Generic + scenario + table.

#### RNA example — A3

Tier **2** (scenario + planning_table + apply). Not Tier 1 on fixture.

---

### 4.4 Mental-model building / systems modelling

#### Cognitive purpose

Assemble a coherent system model (relationships + constraint) and use it to contrast states or explain behaviour.

#### Expert reasoning pattern

```text
name the system
→ state key relationships
→ hold governing constraint
→ contrast state A vs state B (or apply model to scenario)
→ check model coherence
```

#### Evidence in PRISM

| Kind | Values / locations |
| ---- | ------------------ |
| Instructional | `mental_model_building` — `system`, `key_relationships`, `governing_constraint`, `contrast{state_a,state_b}` |
| GAM | `RULES.mental_model_building`; forbids `parts` / `predicted_effect` as plan fields |
| Materials | `modelling_note` (registry EXAMPLE); `scenario`; `analysis_table` — RNA A4 |
| Episode | `analyse` — RNA A4 |

**Note:** “Systems analysis” as a separate family is **not** a distinct production instructional ID. Treat as the same cognitive family when `modelling_note` + scenario converge (Tier 2), Tier 1 when `mental_model_building` present.

#### Information required

System identity; relationships; constraint; contrast states; scenario application; checklist.

#### Current generic manifestation

Modelling note as EXAMPLE block; scenario; analysis table; generic beats.

#### Candidate cognitive manifestation

```text
System overview (text / modelling_note)
→ Relationships & constraint (same bodies — do not split unless headings exist)
→ Apply to situation (scenario + analysis_table)
→ Check (checklist)
```

With Tier 1 plan propagated: expose plan keys as structure around unchanged strings.

#### Labels

“Map the dependencies” — only if relationship language exists. Safe: See it modelled / Your turn.

#### Unsafe moves

Invent governing constraints; invent contrast states; emit System:/Constraint: rubric headings the GAM rule forbids as learner chrome unless already in body.

#### Minimum signals

Tier 1: `mental_model_building`. Tier 2: `modelling_note` + (`scenario` or analysis table).

#### RNA example — A4

Family: mental-model / systems modelling. Tier **2**. Candidate: emphasise model→apply-to-scenario grouping without inventing constraint text.

---

### 4.5 Comparison

#### Cognitive purpose

Compare entities on shared dimensions and draw a defensible difference/similarity.

#### Expert reasoning pattern

```text
fix comparison dimensions
→ characterise entity A / B on each dimension
→ contrast
→ conclude with criteria
```

#### Evidence in PRISM

| Kind | Values / locations |
| ---- | ------------------ |
| Materials | `comparison_table` (registry); often `analysis_table` with “comparing…” task — RNA A5 |
| Episode | `analyse` — RNA A5 |
| Beats | explanation → worked_thinking → guided_practice → verification |
| Instructional | No dedicated Priority-1 ID (`diagnostic_comparison` is **docs-only** — Sprint 59) |

#### Information required

Entities; dimensions; evidence per cell; conclusion criteria.

#### Current generic manifestation

Analysis/comparison table as worksheet; generic journey.

#### Candidate cognitive manifestation

```text
What is being compared (from task/text)
→ Modelled comparison (worked_example)
→ Comparison grid (table)
→ Check (checklist)
```

#### Labels

“Compare the evidence” — safe as phase emphasis when table is comparative; do not invent dimensions.

#### Unsafe moves

Invent comparison axes; invent entities.

#### Minimum signals

`comparison_table` **or** (`analysis_table` + compare/contrast task verbs).

#### RNA example — A5

Task: “Complete the analysis table comparing direct-acting antivirals.” Tier **2** comparison (not “systems integration” — materials are comparison-oriented analysis, not modelling_note).

---

### 4.6 Evaluation and judgement

#### Cognitive purpose

Apply criteria to evidence, weigh trade-offs, and reach a justified judgement.

#### Expert reasoning pattern

```text
pose evaluation question
→ apply criteria to evidence
→ surface trade-offs / competing interpretations
→ weigh
→ justified conclusion
→ (optional) transfer
```

*(Matches `RULES.evaluation_judgement` worked_example sequence in `ld-instructional-archetype.js`.)*

#### Evidence in PRISM

| Kind | Values / locations |
| ---- | ------------------ |
| Instructional | `evaluation_judgement` — plan: `question`, `criteria`, `evidence`, `tradeoffs`, `judgement_focus` |
| Episode | `evaluate` + beats `worked_judgement`, `evaluative_judgement`, `transfer` — templates + RNA A6 |
| Materials | `decision_table`, `template`, `scenario`, `worked_example`, `checklist`, `transfer_prompt` |
| Task | Inventory-style on RNA A6 (blocks “Your goal” — Sprint 62 boundary) |

#### Information required

Question; criteria; evidence; trade-offs; judgement focus; checklist; transfer prompt if present.

#### Current generic manifestation

Evaluate episode beats rendered with Sprint 62 labels; decision table + template + transfer; inventory What to do; Success looks like if checklist/output allow.

#### Candidate cognitive manifestation

```text
Situation (scenario)
→ Modelled judgement (worked_example / worked_judgement beat)
→ Decision structure (decision_table)
→ Judgement scaffold (template — existing headings only)
→ Check (checklist)
→ Apply elsewhere (transfer_prompt)
```

Tier 1 propagation: surface plan fields as structure without paraphrase.

#### Labels

| Label | Safety |
| ----- | ------ |
| Make your judgement / Weigh the trade-offs | Safe only if criteria/trade-offs text exists |
| Sprint 62 Apply elsewhere / Check your work | Safe |
| Invented evaluative goal | **Unsafe** for inventory learner_task |

#### Visual structures

Evidence–criteria–judgement scaffold **from existing template headings**; decision table.

#### Unsafe moves

Invent criteria; invent trade-offs; invent goal from inventory list; reorder Transfer after Verify unless already supported (Sprint 62 preserved authored order).

#### Minimum signals

Tier 1: `evaluation_judgement`. Tier 2: episode `evaluate` + (`decision_table` or `worked_judgement` / template) + checklist.

#### RNA example — A6

Tier **2** (evaluate + decision_table + template + transfer). Information sufficiency for “goal” **low** (inventory task). Candidate: judgement scaffold using existing artefacts; do not invent goal.

---

### 4.7 Sequencing / ranking (interaction-led)

#### Cognitive purpose

Impose or recover order / priority among items.

#### Evidence

`activity_interaction_type` ∈ {`sequencing`, `ranking`} — domain LD artefacts; workbook fixtures ([inventory §2.1](activity-type-system-inventory.md)). Transition chain T3 (`prediction` → `observation` → `revision`) is related but distinct.

#### Candidate manifestation

Retain specialised sequencing/ranking UI already used; do not force into generic table-only grammar.

#### Tier

**1–2** when interaction type present; else Tier 4.

#### RNA

Not primary on A1–A6.

---

### 4.8 Transfer / application extension (beat overlay)

Not a full activity family; a **terminal cognitive move** attached to other families.

#### Evidence

Beat `transfer`; material `transfer_prompt` — registry `episodeFunctions: transfer`; RNA A6-M7.

#### Manifestation

Keep as “Apply elsewhere” (Sprint 62) wrapping **existing** prompt body. Do not invent transfer targets.

#### Tier

Explicit as beat/material; family = host activity’s family.

---

### 4.9 Reflection / consolidation

#### Evidence

Beat `reflection`; materials `consolidation_summary`; cognition fields (`self_explanation_prompt`, `transformation_activity` open strings).

#### Candidate manifestation

Surface existing reflection/consolidation prose after verify; do not invent metacognitive prompts.

#### Tier

**2–3** depending on field/material presence.

---

### 4.10 Prediction (weak)

#### Evidence

Beat `prediction` in FunctionEnum; transition chain T3 — `lib/episode-plan-population-contract.js`. Sparse fixture evidence.

#### Tier

**3**. Catalogue entry: retain generic; do not build prediction UI without authored prediction/observation materials.

---

### 4.11 Insufficient evidence (not catalogued as families)

| Candidate | Why excluded |
| --------- | ------------ |
| Diagnosis | Docs-only `diagnostic_comparison` (Sprint 59); not in ALLOWED |
| Design | No production instructional ID / dedicated material contract |
| Argumentation | Cognition fields exist as open prose; no closed family signal |
| Problem solving | Generic pedagogical language only |
| Retrieval / rehearsal | No distinct production vocabulary beyond practice beats |

---

## 5. Cross-Family Comparison Matrix

| Family | Core Cognitive Move | Required Information | Existing Strongest Signal | Candidate Manifestation | Confidence |
| ------ | ------------------- | -------------------- | ------------------------- | ----------------------- | ---------- |
| Classification | Assign to categories | Principle + cases + criteria | `classification_table` | Principle → model → grid → check | Tier 2 |
| Mechanism / causal | Trace start→links→outcome | Chain structure + criteria | `mechanism_explanation` / `analysis_table` | Chain overview → model → trace table → check | Tier 1–2 |
| Process walkthrough | Staged investigation | Goal + stages + carry-forward | `process_walkthrough` / scenario+planning_table | Situation → stages → check | Tier 1–2 |
| Mental-model / systems | Model + contrast / apply | System + relations + constraint | `mental_model_building` / `modelling_note` | Model → apply to scenario → check | Tier 1–2 |
| Comparison | Contrast on dimensions | Entities + dimensions | `comparison_table` / compare-task + analysis_table | Model → comparison grid → check | Tier 2 |
| Evaluation & judgement | Criteria→evidence→weigh→conclude | Question + criteria + trade-offs | `evaluation_judgement` / evaluate+decision_table | Model judgement → decision → template → check → transfer | Tier 1–2 |
| Sequencing / ranking | Order / prioritise | Item set + order criteria | `activity_interaction_type` | Existing specialised UI | Tier 1–2 |
| Reflection | Metacognitive consolidation | Reflection prose | reflection beat / consolidation_summary | Append existing reflection | Tier 2–3 |
| Prediction | Predict then revise | Prediction + observation | `prediction` beat (sparse) | Generic unless materials exist | Tier 3 |

---

## 6. RNA A1–A6 Worked Mapping

Fixture: `tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json`  
**None** of A1–A6 carry `instructional_archetype` on materials (inventory traces).

| Activity | Candidate family | Explicit signals | Inferred signals | Tier | Information sufficiency | Current cognitive visibility | Candidate manifestation | Safe now | Needs upstream |
| -------- | ---------------- | ---------------- | ---------------- | ---- | ----------------------- | ---------------------------- | ------------------------ | -------- | -------------- |
| **A1** | Classification | `classification_table`, checklist, episode `understand`, beats | Task “classification”; sample_output | **2** | Principle may be only in text body; inventory task weak as goal | Low–medium (table implies classify) | Classification grid emphasis; generic labels | Relabel/group existing materials | Authored organising-principle field; instructional archetype if desired |
| **A2** | Mechanism / causal | episode `analyse`, `analysis_table`, worked_example, checklist, goal-shaped task | Causal verbs in bodies | **2** | High for attempt; chain structure not explicit as plan | Medium (Sprint 62 Frame strong) | Causal-trace journey using existing Frame + materials | Phase emphasis; Frame already OK | `mechanism_explanation` + plan propagation |
| **A3** | Process modelling | episode `apply`, scenario, planning_table, checklist | Process/plan task | **2** | Stages only if in table/body; planning_table registry gap | Medium | Scenario → staged plan → check | Group scenario before table | `process_walkthrough` plan; register planning_table |
| **A4** | Mental-model / systems | episode `analyse`, `modelling_note`, scenario, analysis_table, checklist | Systems/evasion theme in bodies | **2** | Constraint/contrast may be only in prose | Medium | Model → scenario application → check | Group modelling_note with scenario | `mental_model_building` plan propagation |
| **A5** | Comparison | episode `analyse`, analysis_table, worked_example, checklist, “comparing…” task | Comparative dimensions in table | **2** | Dimensions in authored table | Medium | Comparison-grid manifestation | Emphasise compare framing from **existing** task text | Optional comparison_table type; instructional ID |
| **A6** | Evaluation & judgement | episode `evaluate`, `worked_judgement`, decision_table, template, transfer_prompt, checklist | Evaluative bodies | **2** | Goal **insufficient** (inventory task); criteria in checklist/body | Medium structure / low goal clarity | Judgement scaffold from existing artefacts; no invented goal | Labels + grouping; keep Transfer order | Authored goal; `evaluation_judgement` plan on page |

**Revision vs provisional labels:** A5 mapped to **Comparison** (not “systems integration”) per material/task evidence. A4 kept as mental-model/systems (not a separate Tier 1 systems ID). A1 is classification **not** mental-model building (no modelling_note / mental_model plan).

---

## 7. Signal-to-Manifestation Decision Model

Conceptual only — **not** implementation.

```text
Is instructional_archetype present on a material (or activity-level stamp if ever added)?
    yes → inspect archetype_plan keys
         → if plan fields available at render time: Tier 1 family manifestation
         → if plan fields missing at render (current production): treat as Tier 2 using materials/beats only
    no → inspect episode_plan.archetype + beats[].function + material_types + learner_task/expected_output

Do multiple signals converge on one family?
    yes → assign candidate family (Tier 2)
    no / conflict → Tier 3–4 → generic Sprint 62 manifestation

Does the candidate manifestation element require information not present on the page?
    yes → omit that element (do not invent)
    no → expose / group / label available reasoning structure

Is learner_task inventory-style?
    yes → do not promote “Your goal”; keep What to do (Sprint 62 rule)
```

---

## 8. Manifestation Opportunities Without Schema Redesign

### Immediately testable (assembled-page / render-time)

- Differentiate **classification** (A1) vs **causal analysis** (A2) vs **evaluation** (A6) using `material_type` + episode archetype + beats already on RNA fixture.
- Family-aware **grouping** of existing materials (e.g. scenario before decision_table) without new fields.
- Sprint 62-style labels/Frame already available; extend only with labels that point at existing blocks.

### Potentially testable with propagation only

- Surface `archetype_plan` fields for any of the four instructional archetypes once present on the assembled activity/material object consumed by render.
- Requires page/assembly to retain fields currently used by GAM only ([inventory flatten point](activity-type-system-inventory.md)).

### Not currently testable

- Docs-only instructional IDs (diagnosis, recommendation, …).
- Manifestations needing authored goals/criteria when only inventory `learner_task` exists (A6 goal).
- Assuming table type alone selects family without corroborating signals.

---

## 9. Candidate Experiments

### Experiment 1 — Existing-signal differentiation

| Item | Detail |
| ---- | ------ |
| Question | Can render-time signals alone make classification vs causal vs evaluative activities *cognitively* distinguishable without new fields? |
| Evidence used | `material_type`, `episode_plan.archetype`, `beats[]`, learner_task/expected_output, checklist |
| Examples | RNA A1, A2, A6 |
| Expected LD difference | Different phase emphasis and material grouping; same bodies |
| Risks | Over-claiming family from weak signals; visual churn without reasoning gain |
| Success criteria | Educational review: higher reasoning visibility; no invented meaning; materials/order preserved |
| Boundary | Presentation/prototype only; no DLA/GAM/schema; no production merge required |

### Experiment 2 — Archetype-plan propagation prototype

| Item | Detail |
| ---- | ------ |
| Question | What becomes possible when one `archetype_plan` reaches the renderer unchanged? |
| Evidence used | e.g. `mechanism_explanation` plan keys or `evaluation_judgement` plan keys from `ld-instructional-archetype.js` |
| Examples | Non-production fixture with stamped instructional_archetype + plan |
| Expected LD difference | Explicit chain/criteria/trade-off structure from **authored plan strings** |
| Risks | Temptation to paraphrase plan into coaching copy |
| Success criteria | Plan strings appear once, unchanged; clearer cognitive scaffold than Experiment 1 |
| Boundary | Diagnostic/prototype path only; no production schema change; documents propagation need |

### Experiment 3 — Generic vs cognitive manifestation review

| Item | Detail |
| ---- | ------ |
| Question | Does a candidate cognitive manifestation improve reasoning visibility vs current generic form under no-invented-meaning constraints? |
| Evidence used | Side-by-side HTML for same activity JSON |
| Examples | A2 (strong Frame) and A6 (boundary) |
| Expected LD difference | A2: modest gain; A6: reveals information gaps (goal/criteria) rather than “fixing” them |
| Risks | Reviewers request invented content to “complete” A6 |
| Success criteria | Documented visibility scores; explicit list of missing information; no schema decision forced |
| Boundary | Review artefact; no production renderer change |

---

## 10. Architecture Questions Raised

*(Recorded, not resolved.)*

1. Should cognitive family be explicitly represented or inferred at render time?
2. Should instructional archetypes remain material-level concepts?
3. Should `archetype_plan` reach the assembled page / renderer?
4. Should manifestation be selected from activity identity, episode identity, or material identity?
5. Can one activity legitimately contain several cognitive families?
6. How should mixed or transitional activities be represented?
7. What confidence threshold is required before differentiated rendering?
8. Which layer owns the manifestation decision (DLA, assemble, renderer)?
9. Should shortened episode beat lists be discouraged when they erase archetype differences?
10. Is registering `planning_table` a renderer completeness fix or a type-system change?

---

## 11. Conclusions and Recommendation

### 1. Strongly evidenced families

**Six core families** with solid repository support:

1. Classification (Tier 2 material/interaction)  
2. Mechanism / causal explanation (Tier 1 instructional + Tier 2 materials)  
3. Process walkthrough / process modelling (Tier 1 + Tier 2)  
4. Mental-model building / systems modelling (Tier 1 + Tier 2)  
5. Comparison (Tier 2)  
6. Evaluation and judgement (Tier 1 + Tier 2)

Plus interaction-led **sequencing/ranking**, and overlays **transfer** / **reflection**.

### 2. Only inferred / weak

Prediction (Tier 3); diagnosis, design, argumentation, problem solving, retrieval — **insufficient** for catalogue families.

### 3. Signals that can support differentiated manifestation

Render-time: `material_type`, `beats[].function`, `episode_plan.archetype`, task/output/checklist/cognition prose.  
Upstream-only today: `instructional_archetype` + `archetype_plan`.

### 4. Testable without schema change

Experiment 1 and 3 using assembled-page signals (RNA A1/A2/A6). Presentation prototypes only.

### 5. What disappears before rendering

`instructional_archetype` and `archetype_plan` structured fields (GAM consumes; manifestation/render does not — inventory). Full episode template distinctions when fixtures emit shortened identical beat lists.

### 6. Do controlled manifestation experiments justify?

**Yes** — three bounded experiments in §9. They test the Sprint 63 Working Hypothesis (cognitive process vs available information) without schema redesign.

### 7. What Sprint 63 should do next

1. Run **Experiment 1** (A1 vs A2 vs A6) as a design/prototype review.  
2. Optionally prototype **Experiment 2** on a non-production fixture to quantify propagation value.  
3. Complete **Experiment 3** educational review; feed missing-information inventory.  
4. **Do not** decide schema/pipeline redesign until experiment evidence lands.  
5. Keep production renderer stable unless a later sprint explicitly authorises implementation.

---

## Appendix — Evidence index

| Topic | Citation |
| ----- | -------- |
| Instructional allowlist + PLAN_KEYS + RULES | `lib/ld-instructional-archetype.js` |
| Episode templates | `lib/episode-plan-v1-templates.js` |
| Beat FunctionEnum | `lib/episode-plan-population-contract.js` |
| Material registry | `lib/beat-material-registry.js` |
| No archetype in manifestation | `lib/ld-instructional-manifestation-render.js` (no matches) |
| Sprint 62 presentation rules | `docs/development/sprints/2026-07-16-sprint-62-coherent-renderer-pass/learner-journey-presentation-slice.md` |
| RNA fixture | `tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json` |
| Inventory | [activity-type-system-inventory.md](activity-type-system-inventory.md) |

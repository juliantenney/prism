# Cognitive Structure Final Validation

**Sprint:** 63 — Cognitive Flow & Reasoning Visibility  
**Type:** Final discovery / validation  
**Date:** 2026-07-16  
**Status:** Complete  

**Distinction**

| Document | Role |
| -------- | ---- |
| [cognitive-structure-preservation-and-manifestation-synthesis.md](cognitive-structure-preservation-and-manifestation-synthesis.md) | Authoritative Sprint 63 **interpretation** |
| This document | Evidence confirming or limiting **generalisation** and **production relevance** |

**Artefacts:** [experiments/experiment-3/](experiments/experiment-3/)

---

## 1. Objective

Answer two questions:

**A — Generalisation:** Do other Priority-1 instructional archetypes contain learner-relevant reasoning structure that cannot be safely recovered from current render-time signals?

**B — Production reality:** Does the GAM→render flattening boundary observed in controlled experiments also occur in production-like generated activities?

Establish whether Sprint 64 may open an **implementation-focused investigation** of cognitive structure preservation and manifestation (not whether production merge is authorised).

---

## 2. Evidence Base

| Input | Use |
| ----- | --- |
| activity-type-system-inventory.md | Identity / flatten map |
| cognitive-activity-manifestation-catalogue.md | Families / tiers |
| cognitive-manifestation-experiment-1.md | Tier 2 manifestation baseline |
| cognitive-manifestation-experiment-2-archetype-propagation.md | Mechanism case |
| cognitive-structure-preservation-and-manifestation-synthesis.md | Thresholds + authoritative position |
| experiments/experiment-1/, experiment-2/ | Supporting variants |
| Sprint 59/60 enzymes + mixed-archetype acceptance | Authored plans + live GAM delivery |
| Production preserve/normalize/renderer modules | Code-path boundary |
| RNA + first-audit assembled pages | Assembled materials without structured contracts |

---

## 3. Candidate Selection

| Archetype | Activity | Source | Selection Rationale | Evidence Quality |
| --------- | -------- | ------ | ------------------- | ---------------- |
| `process_walkthrough` | A4 / A4-M1 | `dla-mixed-priority1.page.json` + `process-walkthrough.required-material.json` | Stable Priority-1 fixture; complete plan; task/output for recoverability; Sprint 59/60 transfer PASS | **High** (authored plan); assembled learner body not inventable — purpose used as stand-in |
| `mental_model_building` | A3 / A3-M1 | same mixed page + `mental-model-building.required-material.json` | Stable Priority-1 fixture; richest non-mechanism plan shape; Sprint 59/60 PASS | **High** (authored plan); same body-stand-in limitation |

Both candidates had usable upstream plans. No synthetic plans created.

Mechanism (`Experiment 2`) retained as the third comparison arm — not re-run here.

---

## 4. Process Walkthrough Trace

### Pipeline

```text
source (S59/S60 fixtures)
→ DLA required_materials[A4-M1]
→ GAM buildArchetypeRoutingBlock + RULES.process_walkthrough
→ assembled materials[] (body only)
→ page-gam-materials-preserve / page-render-normalize
→ manifestation / renderer
```

| Stage | instructional_archetype | archetype_plan | Present? | Transformed? | Consumed? |
| ----- | ----------------------- | -------------- | -------- | ------------ | --------- |
| Source fixtures | `process_walkthrough` | process_goal + stages | Yes | No | Authoring |
| DLA | On required_materials | Full object | Yes | Validated | Planning SoT |
| GAM prompt | Routing line | JSON in block | Yes | Serialised to prompt | **Yes** (generation) |
| GAM body | Not structured | Not attached | No as fields | Realised as prose (when generated) | Implicit |
| Assembled materials[] | Absent | Absent | No | — | No |
| Preserve / normalize | No handlers | No handlers | No | — | No |
| Manifestation / renderer | No references | No references | No | — | No |

**Loss point:** structured contract stops at **GAM → assembled `materials[]`** (same as Experiment 2).

**Citations:** `lib/ld-dla-page-enrich-contract.js`; `lib/ld-instructional-archetype.js` (`PLAN_KEYS.process_walkthrough`, `buildArchetypeRoutingBlock`); `lib/page-gam-materials-preserve.js` (no archetype fields); `lib/page-render-normalize.js`; `lib/ld-instructional-manifestation-render.js`.

---

## 5. Process Walkthrough Recoverability

### Plan (verbatim)

```json
{
  "process_goal": "interpret an enzyme reaction-rate investigation",
  "stages": [
    "identify the manipulated condition and measured outcome",
    "inspect the pattern across observations",
    "connect the pattern to enzyme behaviour",
    "form a bounded conclusion"
  ]
}
```

### Field analysis

| Field | Value Summary | Learner-Relevant | Authoring-Only | Planning-Only | Uncertain |
| ----- | ------------- | ---------------- | -------------- | ------------- | --------- |
| `process_goal` | interpret enzyme reaction-rate investigation | **high** (expected outcome / process aim) | no | also planning | — |
| `stages[0]` | identify condition & measured outcome | **high** (sequence) | no | also | — |
| `stages[1]` | inspect pattern across observations | **high** (sequence / intermediate transformation) | no | also | — |
| `stages[2]` | connect pattern to enzyme behaviour | **high** (dependency / intermediate transformation) | no | also | — |
| `stages[3]` | form bounded conclusion | **high** (expected outcome / boundary) | no | also | — |

### Recoverability

| Archetype | Plan Field | Recoverable? | Confidence | Recovery Source | Invention Risk |
| --------- | ---------- | ------------ | ---------- | --------------- | -------------- |
| process_walkthrough | process_goal | partially | high | purpose / task near-paraphrase | low |
| process_walkthrough | stages[0] | partially | medium | specification “condition identification” | medium |
| process_walkthrough | stages[1] | **no** | high | — | **high** |
| process_walkthrough | stages[2] | **no** | high | — | **high** |
| process_walkthrough | stages[3] | partially | medium | expected_output “bounded conclusion” | medium |

**Method:** leaf units N=5; score = (yes×1 + partially×0.5 + no×0) / N.  
**Recoverability % ≈ 30%.**

**Highest-value non-recoverable:** `stages` (especially middle stages 1–2) as an ordered expert reasoning sequence.

---

## 6. Process Walkthrough Manifestation Comparison

Artefacts: [experiments/experiment-3/process-walkthrough/](experiments/experiment-3/process-walkthrough/)

| Manifestation Element | Variant | Source Signal or Field | Verbatim or Transformed | Semantic Risk |
| --------------------- | ------- | ---------------------- | ----------------------- | ------------- |
| Orientation / goal / success | T2+T1 | preamble, task, output | verbatim | low |
| Generic “condition→conclusion” | T2 | specification + output | lightly framed | medium (underspecifies middle) |
| Process goal box | T1 | process_goal | verbatim | low |
| Ordered stage list | T1 | stages[] | verbatim | low |
| Plan-based self-check | T1 | process_goal + stages | verbatim | low |

### Educational review (0–5)

| Dimension | T2 | T1 | Difference | Evidence |
| --------- | -- | -- | ---------- | -------- |
| Reasoning orientation | 3 | 4 | +1 | Explicit process_goal |
| Reasoning sequence | 2 | 5 | **+3** | Authored stages |
| Information sufficiency | 2 | 5 | **+3** | Named intermediate stages |
| Relationship visibility | 2 | 3 | +1 | Stage-to-stage dependencies clearer |
| Dependency visibility | 2 | 4 | **+2** | Ordered stage chain |
| Self-explanation support | 2 | 4 | **+2** | Stage checklist |
| Transfer readiness | 2 | 3 | +1 | Process goal transferable as pattern |
| Output clarity | 3 | 4 | +1 | Bounded conclusion stage explicit |
| Coherence | 3 | 5 | **+2** | Grammar + content scaffold |
| Meaning preservation | 5 | 5 | 0 | Verbatim only |

* Strongest gain: reasoning sequence / information sufficiency via `stages`.  
* Weakest gain: orientation (already decent from preamble/task).  
* Highest semantic risk: low when verbatim; high if stages invented at T2.  
* Gain **exceeds** grouping/labelling: yes — content-structural.  
* Depends on non-recoverable fields: **yes** (`stages[1]`, `stages[2]`).

---

## 7. Mental Model Building Trace

Same pipeline and loss point as §4; material A3-M1; `RULES.mental_model_building`; `PLAN_KEYS` = system, key_relationships, governing_constraint, contrast.

| Stage | Present? | Consumed? |
| ----- | -------- | --------- |
| DLA required_materials | Yes (full plan) | Planning SoT |
| GAM routing | Yes | Generation |
| Assembled materials[] | Structured plan **No** | No |
| Preserve / normalize / renderer | No consumers | No |

---

## 8. Mental Model Building Recoverability

### Plan (verbatim)

```json
{
  "system": "a room heated by a thermostat-controlled heater",
  "key_relationships": [
    "the thermostat compares room temperature with the set point",
    "the heater switches on when the room is below the set point and off when it reaches it",
    "the room continually loses heat to colder surroundings"
  ],
  "governing_constraint": "the heater has a finite heating capacity",
  "contrast": {
    "state_a": "the outside temperature is mildly cold",
    "state_b": "the outside temperature becomes extremely cold"
  }
}
```

### Field analysis

| Field | Value Summary | Learner-Relevant | Notes |
| ----- | ------------- | ---------------- | ----- |
| `system` | room + thermostat heater | **high** | component / system identity |
| `key_relationships[0..2]` | compare / switch / heat loss | **high** | component interaction / feedback |
| `governing_constraint` | finite heating capacity | **high** | governing rule / boundary |
| `contrast.state_a` | mildly cold | **medium–high** | comparison point |
| `contrast.state_b` | extremely cold | **medium–high** | comparison point |

### Recoverability

| Plan Field | Recoverable? | Confidence | Recovery Source | Invention Risk |
| ---------- | ------------ | ---------- | --------------- | -------------- |
| system | partially | high | task “thermostat-controlled heating” | medium |
| key_relationships[0] | **no** | high | — | **high** |
| key_relationships[1] | **no** | high | — | **high** |
| key_relationships[2] | **no** | high | — | **high** |
| governing_constraint | **no** | high | expected_output says “constraint” but not which | **high** |
| contrast.state_a | partially | high | task “mild vs extreme cold” | low–medium |
| contrast.state_b | partially | high | same | low–medium |

**Method:** N=7 leaf units; same scoring formula.  
**Recoverability % ≈ 21%.**

**Highest-value non-recoverable:** `key_relationships` + `governing_constraint`.

---

## 9. Mental Model Building Manifestation Comparison

Artefacts: [experiments/experiment-3/mental-model-building/](experiments/experiment-3/mental-model-building/)

| Dimension | T2 | T1 | Difference | Evidence |
| --------- | -- | -- | ---------- | -------- |
| Reasoning orientation | 3 | 4 | +1 | Named system |
| Reasoning sequence | 2 | 4 | **+2** | Relationships → constraint → contrast |
| Information sufficiency | 2 | 5 | **+3** | Named relationships + constraint |
| Relationship visibility | 2 | 5 | **+3** | key_relationships verbatim |
| Dependency visibility | 2 | 5 | **+3** | Constraint governs contrast explanations |
| Self-explanation support | 2 | 5 | **+3** | Plan-checkable model |
| Transfer readiness | 3 | 4 | +1 | Contrast scaffold |
| Output clarity | 3 | 4 | +1 | Expected model + constraint |
| Coherence | 3 | 5 | **+2** | Single durable model |
| Meaning preservation | 5 | 5 | 0 | Verbatim |

* Strongest gain: relationship / dependency visibility.  
* Weakest gain: transfer readiness (contrast already cued in task).  
* Gain exceeds grouping/labelling: **yes**.  
* Depends on non-recoverable fields: **yes**.

---

## 10. Cross-Archetype Generalisation

| Archetype | High-Value Non-Recoverable Fields | Recoverability % | T1 Gain Beyond T2 | Semantic Risk |
| --------- | --------------------------------- | ---------------- | ----------------- | ------------- |
| `mechanism_explanation` (Exp 2) | `required_links` | ~40% | Large (sequence, sufficiency, self-check) | Low if verbatim |
| `process_walkthrough` (Exp 3) | `stages` (esp. middle) | ~30% | Large (sequence, sufficiency) | Low if verbatim |
| `mental_model_building` (Exp 3) | `key_relationships`, `governing_constraint` | ~21% | Large (relationships, dependency, sufficiency) | Low if verbatim |

### Answers

1. **Non-recoverable learner-relevant structure in ≥2 independent archetypes?** **Yes** — all three.  
2. **Fields structurally similar or archetype-specific?** **Archetype-specific shapes**, shared **class**: named intermediate reasoning structure (links / stages / relationships+constraint).  
3. **Is `required_links` special or one example?** **One example** of that broader class.  
4. **Different forms of reasoning structure?** **Yes** — causal chain vs ordered process vs system model + contrast.  
5. **General preservation problem supported?** **Yes** — structured plans consumed by GAM and not available as learner-reachable structure.  
6. **Only archetype-specific?** **No** — pattern repeats across three Priority-1 shapes.  
7. **Consistently low-value fields?** Archetype **ID** as learner content; endpoint fields that heavily overlap `learner_task` (process_goal, contrast labels, mechanism start/outcome) are **lower novelty** though still useful as structure.

**Question A answer:** **Yes** — other Priority-1 archetypes contain learner-relevant, non-recoverable reasoning structure.

---

## 11. Production-Like Sample

| Sample | Topic | Archetype | Generation Path | Why Representative |
| ------ | ----- | --------- | --------------- | ------------------ |
| S1 | Sprint 60 Phase C mixed DLA → live GAM prompt | mechanism + process + mental_model | Production DLA SoT (no S59 tokens); live browser `archetype_delivery.pass` | Real production routing path; plans delivered to GAM |
| S2 | RNA HCV assembled vnext materials page | none on materials | Assembled render fixture used in Sprint 62/63 | Production-like assembled `materials[]` + renderer |
| S3 | Introduction to Educational Psychology (first-audit) | none | Sprint 59 first-audit generated page JSON with bodies | Real generated learner materials |
| S4 | Was Marx Right? (first-audit) | none | Same audit path | Second domain; assembled bodies |
| S5 | Process walkthrough strong realisation example | process_walkthrough | Target GAM realisation prose (not live capture) | Nearest body-level realisation of stages-as-prose |

**Limitation:** Repository lacks a saved post-GAM assembled page JSON that both (a) had Priority-1 plans upstream and (b) retained capture of generated bodies with provenance. Phase C explicitly did not require fresh Copilot body regeneration. S5 is exemplar prose, not a live capture.

---

## 12. Production Reality Findings

| Sample | Upstream Contract Present | Structured Contract Reaches Renderer | Recoverability | Same Flattening Boundary? |
| ------ | ------------------------- | ------------------------------------ | -------------- | ------------------------- |
| S1 Phase C live GAM | **Yes** (3 plans in DLA + prompt) | **No** (plans in prompt only; no materials[] contract consumer) | N/A at renderer | **Yes** (prompt consumes; render path does not) |
| S2 RNA assembled | **No** on materials | **No** | Tier 2 only | Boundary vacuous (no contract) but confirms assembled pages lack fields |
| S3 Ed Psych audit | **No** instructional archetype | **No** | Bodies only | Same absence on assembled materials |
| S4 Marx audit | **No** | **No** | Bodies only | Same |
| S5 Process realisation exemplar | Upstream plan known | Stages appear only as **prose headings**, not structured fields on materials | Partial from prose with high interpretation cost | **Yes** — structure realised, not preserved |

### Code-path confirmation (production modules)

* `page-gam-materials-preserve.js` — no `instructional_archetype` / `archetype_plan` handling  
* `page-render-normalize.js` — no consumers  
* `ld-instructional-manifestation-render.js` — no consumers  
* Renderer learner HTML — branches on materials/beats, not instructional plans  

### Spot check (Part 10)

| Sample | Plan Field | Learner Value | Recoverable Downstream? | Invention Risk |
| ------ | ---------- | ------------- | ----------------------- | -------------- |
| S1 A2 | required_links | high | **no** (from task alone) | high |
| S1 A4 | stages[1–2] | high | **no** | high |
| S1 A3 | governing_constraint | high | **no** | high |
| S5 | stages as prose | high | partially from exemplar headings only if body present | medium (parsing ≠ structured contract) |

### Question B answer

> Is the GAM → assembled `materials[]` flattening boundary present in production-like content?

**Mostly observed** → treated as **consistently observed** at the **code-path + live GAM delivery + assembled-page absence** level; **not** confirmed via a single archived post-GAM materials capture with archetype provenance.

---

## 13. Threshold Assessment

Applied exactly from the synthesis §11 / task Part 11.

### Further propagation investigation

| Criterion | Met? |
| --------- | ---- |
| Additional archetypes show learner-relevant plan information | **Yes** |
| At least some information non-recoverable | **Yes** |
| Semantic risk manageable when preserved verbatim | **Yes** |

**Result:** threshold **met** (already executed as Experiment 3).

### Architecture investigation

| Criterion | Met? |
| --------- | ---- |
| ≥2 independent high-value non-recoverable cases | **Yes** (3 archetypes) |
| Confirmation in production-like content | **Yes** (mostly/consistently via code path + live delivery + assembled absence) |
| Recurring pipeline boundary, not fixture anomaly | **Yes** |

**Result:** threshold **met**.

### Schema investigation

| Criterion | Met? |
| --------- | ---- |
| Required semantics do not already exist | **No** — plans exist upstream |
| Existing fields cannot represent structure | **No** |
| Propagation alone insufficient | **Not shown** |

**Result:** threshold **not met**.

---

## 14. Limitations

* Experiment 3 bodies are purpose stand-ins (no invented GAM prose); educational scores are implementer reviews, not multi-reviewer panels.  
* No archived post-GAM assembled JSON with Priority-1 provenance in-repo.  
* `evaluation_judgement` not re-tested in this validation (fourth Priority-1).  
* First-audit samples lack instructional archetypes — they confirm absence on assembled pages, not post-plan loss on the same artefact.  
* Recoverability % uses a weighted leaf-unit method; alternative counting would change percentages but not the non-recoverable high-value fields.

---

## 15. Final Findings

1. Generalisation **holds** across `mechanism_explanation`, `process_walkthrough`, and `mental_model_building`.  
2. High-value non-recoverable structures are archetype-specific fields of a shared class (named intermediate reasoning structure).  
3. T1 gains exceed Tier 2 grouping/labelling for both new archetypes when plans are surfaced verbatim.  
4. Flattening boundary is a **recurring production pipeline property**, not a fixture-only anomaly.  
5. Synthesis conceptual conclusions remain valid; architecture threshold status is **updated by this validation** (now met).  
6. Schema redesign remains unjustified.  
7. Production merge / renderer rewrite remains unjustified.

### Decision outcome

## Outcome A — Architecture Investigation Justified

Sprint 64 **may investigate** the smallest viable preservation and manifestation mechanism.

Sprint 64 **must not** treat this as approval to merge production renderer behaviour, change schemas, or rewrite DLA/GAM semantics without a separate implementation authorisation.

---

## 16. Sprint 63 Close-Out Recommendation

| Question | Answer |
| -------- | ------ |
| Synthesis still valid? | **Yes** as authoritative interpretation |
| Architecture investigation justified? | **Yes** (Outcome A) |
| Implementation-focused production work justified? | **No** — investigation only |
| Schema investigation justified? | **No** |
| What should happen next? | Sprint 64 may open a bounded **investigation** of minimal preservation/manifestation options under existing fields |
| What should not happen next? | Schema redesign; production merge; invented plan content; broad taxonomy work |

### Final Sprint 63 close-out sentence

> Sprint 63 concludes that differentiated cognitive structure is already encoded upstream across multiple Priority-1 archetype plans, that render-time Tier 2 manifestation can surface only part of it, that high-value intermediate reasoning structure (`required_links`, `stages`, `key_relationships`/`governing_constraint`) is systematically lost at the GAM→assembled-materials boundary in production-like paths, and that Sprint 64 is justified to **investigate** — not yet to implement in production — the smallest viable preservation and manifestation mechanism without schema redesign.

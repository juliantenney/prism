# Sprint 59 — Instructional Archetype Framework (Workstream)

**Status:** Priority-1 MVP **complete** (mechanism + process + mental model transfer **PASS**); operationalisation continues in [Sprint 60](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CHARTER.md)  
**Opened:** 2026-07-14  
**Updated:** 2026-07-15  
**Authority:** [instructional-archetype-audit.md](instructional-archetype-audit.md)  
**Backlog:** [backlog.md](backlog.md)

---

## Purpose

Systematically improve GAM instructional quality by creating **explicit support contracts for instructional archetypes**, independent of topic domain and separate from material presentation types.

Priority-1 MVP transfer validation completed in **Sprint 59**. Production activation and mixed-archetype workflows are proposed for **Sprint 60**.

---

## Implementation status (2026-07-15)

Instructional archetypes are implemented as an **independent instructional dimension**.

| Component | Status |
| --------- | ------ |
| DLA contract generation | PASS |
| Contract persistence | PASS |
| Archetype routing | PASS |
| GAM Copy delivery | PASS |
| Runtime verification | PASS |
| Mechanism transfer test | PASS |
| Process transfer test | PASS |
| Mental model transfer test | PASS |

**Validated chain:** DLA → persistence → GAM routing → generated materials.

Architecture (pipeline unchanged):

```text
LO → EP shell → DLA partial → GAM partial → Assessment → LS partial → DP synthesis → deterministic assembly
```

Instructional intent is transmitted through archetype contracts. Material type and instructional archetype are independent.

**Runtime (verified):** `ld-instructional-archetype.js?v=20260715-5` · `workflow-step-recognition-context.js?v=20260715-s59-gam-ctx-1` · `app.js?v=20260715-s59-mental-1`

### Mechanism — PASS

Validated behaviour: `required_link` → realised causal transition → `outcome` (enzymes A2-M1 fixture).

### Process — PASS

Final rule wording: **`20260715-4`**. Validated behaviour: stage → reasoning → finding → finding transfer → conclusion (enzymes A4-M1).

**Delivery-path note:** Earlier process “failures” were often invalid tests because routing never reached GAM Copy (shaped outer recognition vs raw-step inner gate). Fixed via `buildWorkflowStepRecognitionContext`. The process rule was not the failure.

### Mental model — PASS

Validated behaviour: coherent account from `key_relationships` + `governing_constraint`; same model for contrast states; no System:/Relationships: rubric headings (thermostat MVP).

---

## Core distinction

| Concept | Meaning | Examples |
| ------- | ------- | -------- |
| **Material type** | Presentation / schema format of a material body | `text`, `worked_example`, `scenario`, `checklist`, `decision_table`, `modelling_note`, `template`, `prompt_set` |
| **Instructional archetype** | Pedagogical function the material must perform | `mechanism_explanation`, `evaluation`, `transfer`, `worked_judgement` |

**Material type ≠ instructional archetype.**

- Material type answers: *what shape is the payload?*  
- Instructional archetype answers: *what learning move must the learner be able to do after using it?*

The same material type can realise different archetypes (e.g. `worked_example` as `worked_analysis` vs `worked_judgement`). The same archetype can appear in different types (e.g. `mechanism_explanation` in `text` or `modelling_note`).

---

## Candidate inventory

| ID | Instructional archetype |
| -- | ----------------------- |
| `concept_exposition` | Teach what a concept is and how it relates to sibling concepts |
| `mechanism_explanation` | Teach how and why an effect is transmitted (intervening process) |
| `process_walkthrough` | Teach an ordered physical, biological, cognitive, or institutional process |
| `mental_model_building` | Help the learner assemble a durable working model of a system |
| `worked_analysis` | Model expert analytic reasoning with alternatives compared |
| `evidence_interpretation` | Teach reading of plots, tables, cases, or observations into meaning |
| `diagnostic_comparison` | Compare candidate diagnoses or accounts against evidence |
| `worked_judgement` | Model weak vs strong evaluative reasoning |
| `guided_practice` | Scaffold partial practice with learner-owned completion |
| `independent_performance` | Support full learner attempt without spoiling the answer |
| `evaluation` | Support criterion-based appraisal of options or claims |
| `recommendation` | Support justified choice of action or remedy |
| `verification` | Support quality/self-check with repair path |
| `transfer` | Support reapplication in a new context |
| `consolidation` | Support reflective synthesis without new teaching dump |
| `misconception_repair` | Confront and correct a named misconception |

---

## Current system asymmetries (summary)

**Strong support today:** evidence interpretation, diagnostic reasoning, comparison, evaluation, judgement, verification, transfer (SP-02..07 + Evaluate PRES density + historical A4/transfer gates on some paths).

**Priority-1 teaching MVP:** mechanism, process, and mental model have validated contract → routing → GAM materials. Fuller support packages (purpose…validation strategy) and production selection remain open (Sprint 60+).

**Still weak / incomplete without fuller packages / operationalisation:** concept exposition; recommendation; modelling_note instructional depth; production archetype selection (still token/opt-in in S59).

See audit §5 for the historical asymmetry that opened this workstream.

---

## Package deliverables (every archetype)

Each future archetype support package must define:

1. **Purpose definition** — pedagogical job and learner success test  
2. **Generation procedure** — how GAM should author the body (connected to material types)  
3. **Required components** — must-include reasoning elements (not mandatory headings)  
4. **Quality criteria** — outcome-based checks (reconstructability, intervening process, etc.)  
5. **Anti-patterns** — definition lists, rubric labels, meta leakage, prompt-only scenarios, etc.  
6. **Exemplars** — weak vs better; domain-neutral where possible; **internal generation guidance only**  
7. **Validation strategy** — soft prompt gates vs future capture rules (design first; implement later with care)

MVP routing + transfer tests prove the contract/delivery path; they do not close the full package checklist above.

---

## Phasing

### Priority 1 (immediate)

| Archetype | Why | Transfer status |
| --------- | --- | --------------- |
| `mechanism_explanation` | Enzymes A2/A4 failure mode; core teaching gap | **PASS** |
| `process_walkthrough` | Step-list collapse without expert process teaching | **PASS** (`v20260715-4`) |
| `mental_model_building` | Conceptual systems under-served | **PASS** (thermostat MVP) |

### Priority 2

| Archetype | Why |
| --------- | --- |
| `concept_exposition` | Glossary/definition-stack common failure |
| `recommendation` | Relies on Evaluate spillover; no dedicated contract |
| `modelling_note` instructional contracts | Material type used for teaching without SP depth |

### Deferred (preserve current strength; do not regress)

Preserve/document contracts for already-strong shapes: `evidence_interpretation`, `diagnostic_comparison`, `worked_judgement`, `evaluation`, `verification`, `transfer`, `worked_analysis`, `guided_practice`, `independent_performance`, `consolidation`, `misconception_repair`.

---

## Guardrails

- Remain in Sprint 59; no Sprint 60 creation from this workstream alone.  
- Do not weaken Evaluate/diagnostic support while adding teaching archetypes.  
- Retain Iteration 4–7 anti-gaming and anti-exemplar-leakage rules.  
- Prefer outcome-based success tests over mandatory learner-facing rubric headings.  
- Material-type schemas stay presentation formats unless a typed SP is deliberately designed.  
- Do not rewrite process rule `v20260715-4` without new post-delivery evidence.

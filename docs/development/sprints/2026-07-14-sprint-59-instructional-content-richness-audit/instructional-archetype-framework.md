# Sprint 59 — Instructional Archetype Framework (Workstream)

**Status:** Active workstream (in-sprint)  
**Opened:** 2026-07-14  
**Authority:** [instructional-archetype-audit.md](instructional-archetype-audit.md)  
**Backlog:** [backlog.md](backlog.md)

---

## Purpose

Systematically improve GAM instructional quality by creating **explicit support contracts for instructional archetypes**, independent of topic domain and separate from material presentation types.

This workstream remains inside **Sprint 59**. It does **not** open Sprint 60.

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

**Weak support today:** concept exposition, mechanism explanation, process walkthrough, mental-model building (generic `text` / soft DEPTH guidance; presence-only v2 capture).

See audit §5 for detail.

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

---

## Phasing

### Priority 1 (immediate)

| Archetype | Why |
| --------- | --- |
| `mechanism_explanation` | Enzymes A2/A4 failure mode; core teaching gap |
| `process_walkthrough` | Step-list collapse without expert process teaching |
| `mental_model_building` | Conceptual systems (enzyme–substrate, causal networks) under-served |

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

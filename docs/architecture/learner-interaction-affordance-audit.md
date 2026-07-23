# Productive-instruction affordance audit (heteroscedasticity golden page)

Scope: renderer/composition only. No keyword-based workspace synthesis.

Classification key:

- **correctly supported** — productive action has a matching interaction
- **optional mental reflection** — pause/think language without authored response object
- **check/revision instruction** — verification language tied to checklist/feedback
- **renderer omission** — response semantics already exist but were not interactive (addressed in this pass where noted)
- **pipeline/schema limitation** — no response object/capability in the canonical model

| Activity | Step | Learner action | Existing affordance | Result |
| -------- | ---: | -------------- | ------------------- | ------ |
| A1 | 1–3 | Study/analyse residual plots | Learn materials | correctly supported |
| A1 | 4 | Identify misconception / verify criteria | Interactive checklist (now) | correctly supported |
| A1 | 5 | Write explanation | text_entry workspace | correctly supported |
| A2 | 3 | Complete analysis table | table_entry workspace | correctly supported |
| A2 | 4 | Decide case evidence | table columns in workspace | correctly supported |
| A2 | — | Meet “What to produce” criteria | EO before table (fixed) | correctly supported |
| A3 | — | Complete decision table | table_entry workspace | correctly supported |
| A3 | — | Verify with checklist | Interactive checklist (now) | correctly supported |
| A4 | — | Complete prompt set | 5× text_entry with Response N labels | correctly supported |
| A5 | — | Complete comparison table + judgement | table_entry + text_entry; hint before workspace | correctly supported |
| Page | Assessment | Select MCQ answers | Interactive radios + Check answer (now) | correctly supported |
| Kitchen-sink | short_answer | Free-text assessment | Static stem + disclosure | pipeline/schema limitation (no option set / not MCQ) |
| Kitchen-sink | true_false | Judge statement | Interactive when True/False synthesised + answer present | correctly supported when evaluable |
| Any | “Pause and reflect” style | Mental reflection | No persisted input | optional mental reflection |

## Checklist applicability rule

Interactive when:

1. `material.type === "checklist"`, and
2. parsed `checklist.criteria` is a non-empty array.

Otherwise render static bullets/markdown. No conversion of arbitrary lists.

## Assessment print behaviour

- Print shows question + options (native radios keep selection state where the browser prints checked controls).
- Hide “Check answer” buttons and on-screen result regions.
- Do not auto-print an answer key for interactive items.

## Table textarea content auto-grow (optional assessment)

**Decision: do not implement content-driven auto-grow in this pass.**

Row-height stretch already fills the cell when sibling labels wrap. Content auto-grow (`field-sizing` / JS height sync) would compete with the flex `min-height: 100%` stretch contract and risks uneven column heights or breaking the completed layout probe. Learners can scroll inside the `textarea` when entered text exceeds the stretched cell. Revisit only with an explicit design that preserves sibling-driven row stretch.

# Sprint 38-B Charter — Learning Design Prompt Architecture and Materials Fidelity Consolidation

**Pack path:** `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/`  
**Date:** 2026-06-03  
**Mode:** Discovery and planning — **no runtime implementation** in charter phase

---

## Mission

Audit and plan consolidation of **Learning Design workflow prompts** (especially **Design Page**) so Sprints 35–38 pedagogical capabilities are **preserved** while reducing prompt size, duplication, contradiction, and regression risk — including unresolved **table-shaped materials fidelity**.

---

## Problem statement

### Sprint 38 success, LD prompt debt

Sprint 38 delivered a working visual affordance pipeline. Validation showed the pipeline is sound; **Design Page prompt composition** is not.

Capabilities were added incrementally via **runtime auto-applied blocks** in `app.js` and pack text in `domain-learning-design-step-patterns.md`. The Design Page augmented prompt is now very large. Overlapping instructions interact in ways that are difficult to predict.

### Regression timeline

1. **Placeholder collapse** — Rich upstream `activity_materials` were summarised into label-only `materials` (“Set of short scenarios…”, “Calculation table…”, “Model showing…”).
2. **Partial mitigation** — Materials-fidelity prompt block + pack notes + `lib/design-page-materials-fidelity.js` tests improved scenario restoration.
3. **Remaining failure** — **Table fidelity**: tables appear as malformed comma-row list/prose instead of proper table-shaped fields or markdown tables.

Example malformed output (Inflation rerun):

```text
Scenario 1,,,
Scenario 2,,,
Scenario 3,,,

Headers
Policy Change
Borrowing
Spending
Inflation

Rows
Interest rate increase,,,
Interest rate decrease,,,
```

Expected: named material fields (`analysis_table`, `comparison_table`, `impact_table`, etc.) containing **markdown pipe tables** or structured row objects the renderer can normalise.

---

## Principles

1. **Sprint 38 architecture is frozen** — schema 38.4, compose validation, renderer hooks, VEU v1.2.1 are not redesign targets.
2. **Preserve pedagogy, reduce redundancy** — do not “fix” by deleting Sprint 35–38 guidance; **reorganise** into hierarchy.
3. **Fidelity before affordances** — `visual_affordances[]` are additive page-root metadata; they must not compete with or replace `activity.materials`.
4. **Tables are first-class materials** — table fidelity is explicit scope, not implied by “no placeholders”.
5. **Precedence and scope** — every instruction must declare taxonomy category and what it governs (page vs figure vs upstream copy).
6. **Evidence-backed consolidation** — length reduction claims require 38B-6 anchor validation.
7. **Sprint 39 is gated** — no new reasoning-cue prompt blocks until 38-B audit completes.

---

## Target contract hierarchy (design direction)

Consolidation should move toward a single ordered contract, for example:

```text
1. Hard output schema
2. Source / content fidelity
3. Activity membership and materials preservation
4. Table and structured material fidelity
5. Pedagogical enrichment contract
6. Visual affordance metadata (Sprint 38 — page root only)
7. Style / rhetoric constraints
8. Validation checklist
```

---

## Success criteria (programme)

| Criterion | Evidence |
|-----------|----------|
| LD priority steps inventoried with length and block counts | 38B-1 populated |
| Instruction taxonomy with overlap/conflict map | 38B-2 |
| Design Page consolidation plan with before/after shape | 38B-3 |
| Table fidelity regression documented with root-cause hypotheses | 38B-4 |
| Workflow-wide growth candidates listed | 38B-5 |
| Regression validation plan for future prompt changes | 38B-6 |
| Governance rules for future prompt evolution | 38B-7 |

**Not success criteria for 38-B charter phase:** merged prompts in production, renderer changes, or Sprint 38 schema edits.

---

## Priority workflow steps (38B-1)

- Model Knowledge  
- Define Learning Outcomes  
- Design Learning Activities  
- Generate Activity Materials  
- Generate Assessment Items  
- Construct Learning Sequence  
- **Design Page** (highest priority)

---

## Relationship to Sprint 38

| Sprint 38 (complete) | Sprint 38-B (this sprint) |
|----------------------|---------------------------|
| Visual affordance schema, VEU handover | Prompt stack that **authors** affordances + materials |
| `pedagogical_added_value`, representation tokens | Whether prompt blocks **contradict** materials copy rules |
| 706-test floor, compose validation | Whether **prompt length** causes model compression |

---

## Relationship to Sprint 39

Sprint 39 investigates **reasoning cue specificity** for images. New cue-authoring guidance is prompt-shaped. Adding it before 38-B consolidation would **compound** architecture debt.

**Gate:** Sprint 39 implementation or large prompt additions wait until 38B-1 audit and 38B-4 table fidelity analysis are complete.

---

## Out of scope

- Runtime refactoring (this pack setup)  
- Renderer, CSS, VEU, image generation changes  
- Sprint 38 schema validation changes  
- Sprint 39 reasoning cue implementation  
- Deleting accumulated blocks without a mapped hierarchy replacement

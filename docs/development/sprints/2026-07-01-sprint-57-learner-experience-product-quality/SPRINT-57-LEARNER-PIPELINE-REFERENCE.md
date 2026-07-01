# Sprint 57 — Learner Pipeline Reference

**Purpose:** Canonical technical reference for learner-content generation.  
**Audience:** Onboarding developers; future chats needing pipeline context without reading Sprint 56 history.

---

## Pipeline overview

```
Workflow brief
    ↓
Episode Plan (optional upstream)
    ↓
┌─────────────────────────────────────────────────────────────┐
│  DLA — Design Learning Activities                           │
│  Output: learning_activities[] with obligations + scaffolds │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  GAM — Generate Activity Materials                          │
│  Output: activity_materials (delivery-ready bodies)         │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Design Page — Assemble page JSON                           │
│  Output: page artefact (sections[], materials embedded)     │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Repair + Validation (post-capture / post-compose)          │
└───────────────────────────┬─────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Export / HTML renderer (product layer)                      │
└─────────────────────────────────────────────────────────────┘
```

**Rule of thumb:** DLA **specifies** what learners need to think and do; GAM **realises** readable material bodies; Design Page **assembles** without redesigning pedagogy.

---

## DLA — Design Learning Activities

**Step ID:** `step_design_learning_activities`  
**Pack section:** `domain-learning-design-step-patterns.md` §5

### Role

- Populate `learning_activities` from upstream `episode_plans` (obligation population — do not replan beats)
- Author **learner-facing scaffold fields**: `activity_preamble`, cognition fields, `expected_output`, `intellectual_coherence_bridge`
- Specify `required_materials` **obligations** (types, gates, anti-spoiler specs) — not full material bodies
- Specify table **intent** for GAM realisation (`LD-TABLE-FIDELITY` spec role)

### Key authorities

| Authority | Module / location |
| --------- | ----------------- |
| Scaffold SSOT | `lib/ld-guided-learning-scaffold.js` — PRE-EMIT gate |
| Thin field index | `buildLearnerPageDlaOutputContractOverrideBlock` in `app.js` |
| PEL orientation / reasoning | `applyPedagogicEnrichmentContractScaffoldToDraft` (DLA only) |
| Table spec | `LD-TABLE-FIDELITY` role `dla` |
| EQF | Qualified for scaffold word floors |

### Does NOT

- Generate material bodies (GAM)
- Assemble page sections (Design Page)
- Apply learner rhetoric (`LD-SELF-DIRECTED-RHETORIC` excluded via `!isDla`)

### Output artefact

`learning_activities` JSON — activities with `learner_task`, scaffold fields, `required_materials[]`, optional `episode_plan`.

---

## GAM — Generate Activity Materials

**Step ID:** `step_generate_activity_materials`  
**Pack section:** §6

### Role

- Realise every `required_materials` row as delivery-ready `activity_materials` content
- Apply **GAM-PRES-08/09** depth floors (pack SSOT)
- Apply **instructional pattern** shapes (SP-01..07) per material type
- Author pipe tables and full prose bodies (`LD-TABLE-FIDELITY` / `LD-MATERIALS-COPY` author roles)
- Self-directed: learner voice, reading sufficiency, facilitator-ban (self-study block)

### Key authorities

| Authority | Module / location |
| --------- | ----------------- |
| Depth / type | Pack GAM-PRES / GAM-WB |
| Pattern shape | `lib/instructional-pattern-prompt.js` |
| Cross-material reasoning | `buildSelfDirectedGamPelReasoningMaterialPromptBlock` |
| Rhetoric | `lib/ld-self-directed-rhetoric.js` role `gam` |
| Capture validation | `lib/gam-output-format.js` |

### Does NOT

- Change activity structure or replan pedagogy
- Compose page sections
- Own scaffold word floors (DLA)

### Output artefact

`activity_materials` — labelled material bodies keyed to activity IDs for downstream merge.

---

## Design Page — Page assembly

**Step ID:** `step_design_page`  
**Pack section:** §13

### Role

- Assemble `artifact_type: page` with `sections[]`, optional `episode_plans[]`, `visual_affordances[]`
- **Read-only composition** — copy upstream fields and material bodies verbatim
- Wrapper prose: overview, learning_purpose, knowledge_summary, transitions (`LD-JOURNEY-ASSIMILATION`, `LD-AUTHORIAL-EXPOSITION`)
- Preserve scaffold fields and materials per compose contract
- Embed L4 preserve roles for materials and tables inside compose block

### Key authorities

| Authority | Module / location |
| --------- | ----------------- |
| Compose SSOT | `lib/ld-design-page-compose-contract.js` |
| Scaffold preservation | `composeOnly` slice in `ld-guided-learning-scaffold.js` |
| Materials/table preserve | Embedded in `buildLdDesignPageComposePromptBlock` |
| Rhetoric | `LD-SELF-DIRECTED-RHETORIC` role `design_page` |
| Visual affordances | Sprint 38 block in `app.js` |

### Does NOT

- Generate scaffolds or material bodies
- Receive PEL orientation/reasoning on emit
- Receive instructional patterns (GAM only)

### Output artefact

Page JSON — self-contained for export; `learning_activities.content[]` with structured `materials.*` objects.

---

## Repair role

Repair runs **after** LLM emit — not in the prompt stack.

| Repair | When | What |
| ------ | ---- | ---- |
| `applyComposedPageGamMaterialsPreserve` | Page composition | Overlay upstream GAM bodies when page LLM thinned materials |
| `validatePageActivityFieldClosure` | Capture | Prefer upstream DLA fields when page row thinner |
| `repairGuidedLearningScaffoldOnDlaCapture` | DLA capture | Lift scaffold fields below SSOT floors |
| `sanitizeSelfDirectedGamMaterialsOutput` | GAM capture | Strip facilitator-facing labels |
| `applyGamPackTextValidationToCapture` | GAM capture | Pack structure + depth advisory |

**Principle:** Prompts set intent; repair enforces floors when external models vary.

---

## Validation role

| Validator | Checks |
| --------- | ------ |
| Page activity closure | Activity membership `(U \ X) ⊆ C` |
| Page materials closure | Material bodies present vs upstream GAM |
| Page episode plans closure | Portable schema alignment |
| Strict JSON capture | Parse validity per step |
| GAM-FMT gate | Pack text organisation; depth warnings |

Failed closure may set `page_generation_failure` — preferable to corrupt learner pages.

---

## Prompt assembly (runtime)

All three steps use:

```javascript
applyWorkflowStepRuntimePromptAugmentations(draft, step, wf, optionMap)
```

Step-specific gates live inside each `apply*` function. See [SPRINT-57-ARCHITECTURE-STATE.md](SPRINT-57-ARCHITECTURE-STATE.md) for order.

**DLA enrich:** `enrichDlaLearnerPageAugmentContext` sets `dlaLearnerPageScaffoldSsot: true` for early SSOT inject.

---

## Product layer (Sprint 57 focus)

Below validation, the **export/renderer** turns page JSON into learner HTML.

Sprint 55 established **beat-first** structure (Journey → Activity → Beat → Material). Sprint 57 improves **presentation** on that structure without changing the generation pipeline above.

---

## Quick test map

| Concern | Test file |
| ------- | --------- |
| DLA SSOT | `tests/sprint-56-dla-ssot-rationalisation.test.js` |
| Design Page materials | `tests/design-page-materials-fidelity.test.js` |
| Compose contract | `tests/ld-design-page-compose-contract.test.js` |
| GAM patterns | `tests/workflow-instructional-pattern-prompt.test.js` |
| Page materials closure | `tests/page-materials-closure.test.js` |
| Journey assimilation | `tests/workflow-learner-page-journey-assimilation.test.js` |

---

## Related documents

- [SPRINT-57-ARCHITECTURE-STATE.md](SPRINT-57-ARCHITECTURE-STATE.md) — ownership table
- [SPRINT-57-ARCHITECTURE-DECISIONS.md](SPRINT-57-ARCHITECTURE-DECISIONS.md) — why decisions were made
- [CROSS-PROMPT-AUTHORITY-PLACEMENT-AUDIT.md](../../audits/CROSS-PROMPT-AUTHORITY-PLACEMENT-AUDIT.md) — full matrix

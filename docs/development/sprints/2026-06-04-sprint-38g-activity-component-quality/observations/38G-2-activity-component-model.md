# Slice 38G-2 — Activity component model

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** **Analysis/design only** — no pack/code/tests/pipeline changes  
**Authority:** [38G charter](../IMPLEMENTATION-CHARTER.md) · [38G handover](../HANDOVER.md) · [38G context](../CONTEXT-FOR-NEXT-CHAT.md) · [38F-8](../../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md) · [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) · [38F-7](../../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-7-retrieval-definition-and-page-review-setup.md)  
**Primary anchor artefacts:** [EV-38F-AFTER-dla-learning-activities.json](../../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/EV-38F-AFTER-dla-learning-activities.json), [EV-38F-AFTER-design-page.json](../../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/EV-38F-AFTER-design-page.json)  
**Comparator:** [EV-38E10-AFTER-dla-learning-activities.json](../../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E10-AFTER-dla-learning-activities.json)

---

## 1. Purpose

Define a practical **Activity Component Model (ACM)** for workbook generation that transforms existing information into richer instructional episodes.

This slice assumes 38G-1 findings are accepted:

- Structural material coverage can pass while pedagogical quality fails.
- The central failure pattern is often `LO -> Task` instead of a coached learning path.
- Existing KM/LO structures are under-exploited rather than absent.

---

## 2. Core distinction

| Category | What it is | Examples | Failure mode if missing |
|---|---|---|---|
| **Material type** | Content artefact | `scenario`, `analysis_table`, `worked_example`, `sample_output`, `consolidation_summary` | Output lacks required resources |
| **Activity component** | Pedagogical function | orientation, concept elucidation, activation, misconception handling, worked reasoning, guidance, practice, verification, reflection, transition | Output has resources but does not teach enough |

**Rule:** Material types are necessary but not sufficient.  
**Target:** Keep 38-F material-type wins; add component-level richness.

---

## 3. Existing structures to exploit first (no schema expansion)

Per instruction, ACM uses only existing KM/LO information.

### 3.1 Knowledge Model inputs

- concepts
- definitions
- relationships
- processes
- groupings
- misconceptions

### 3.2 Learning Outcome inputs

- concept mappings
- cognitive levels
- progression
- outcome intent

### 3.3 Existing DLA/GAM surfaces already available

Current outputs already support many component hooks:

- DLA: `activity_preamble`, `learner_task`, `expected_output`, `mapped_learning_outcomes`, `required_materials`, `support_note`, `prior_knowledge_activation`, `reasoning_orientation`, `self_explanation_prompt`, `transfer_or_application_task`
- GAM material types: `prompt_set`, `checklist`, `task_cards`, `modelling_note`, `worked_example`, `scenario`, tables, `consolidation_summary`

No new KM or LO schema is required to define ACM.

---

## 4. Activity Component definitions

Each component is defined as a pedagogical job, not a fixed field.

| Component | Definition | Typical expression (existing fields/materials) |
|---|---|---|
| **Orientation** | Establish why this activity exists now and how it links to session arc | `activity_preamble`, brief bridge sentence |
| **Concept elucidation** | Teach concepts required for success before performance | `text`, `worked_example`, explanatory section |
| **Knowledge activation** | Prompt recall of prior concepts needed for this task | `prior_knowledge_activation`, short retrieval prompt |
| **Misconception handling** | Surface likely errors and corrective lens | misconception note in `support_note` / `prompt_set` / `task_cards` |
| **Worked reasoning** | Make decision process visible, not just answer | `worked_example`, `modelling_note`, reasoning walkthrough |
| **Guidance** | Provide executable, bounded task instructions | `learner_task` with explicit method and success checks |
| **Practice** | Learner performs the intellectual move required by LO | scenario/table/analysis activity |
| **Verification** | Learner checks understanding before continuing | `checklist`, `prompt_set`, self-check card set |
| **Reflection** | Learner consolidates meaning in own words | reflection prompts, non-spoiler consolidation |
| **Transition** | Connect this activity to previous/next and maintain coherence | coherence bridge, session arc cue |

---

## 5. KM affordance -> component mapping

This is the core exploitation map for DLA/GAM.

| KM affordance | Components it should trigger | Why |
|---|---|---|
| concepts + definitions | orientation, concept elucidation, guidance | Learner needs terms and scope before doing |
| relationships | concept elucidation, worked reasoning, practice | Analysis/evaluation requires relation logic, not isolated facts |
| processes | worked reasoning, guidance, practice, verification | If process exists, show method and check execution |
| misconceptions | misconception handling, verification, reflection | Self-study needs explicit self-correction points |
| groupings | orientation, transition, guidance | Supports chunking and activity sequencing |

**ACM principle:** Any KM affordance that carries error risk or reasoning load should map to at least one explicit activity component.

---

## 6. LO cognitive level -> minimum component bundle

Define minimum support density by demand level.

| Cognitive demand | Minimum component bundle |
|---|---|
| **Understand** | orientation + concept elucidation + guidance + quick verification |
| **Apply** | orientation + activation + worked reasoning + guidance + practice + verification |
| **Analyse** | orientation + concept elucidation (relations/processes) + activation + worked reasoning + guidance + practice + verification + transition |
| **Evaluate** | orientation + concept elucidation (criteria/trade-offs) + misconception handling + worked reasoning + guidance + practice + verification + reflection + transition |

**Constraint:** As cognitive demand rises, support cannot thin out.  
This directly addresses the 38F pattern where Evaluate was least supported.

---

## 7. ACM generation flow (DLA/GLM operating pattern)

Current weak pattern:

```text
LO -> Task
```

ACM operating pattern:

```text
LO
 -> Required Concepts
 -> KM Affordances (concepts, relations, processes, misconceptions)
 -> Instructional Decisions (which components are needed)
 -> Teaching/Scaffolding (component realisation)
 -> Task
 -> Verification
 -> Reflection/Transition
```

### 7.1 Per-activity reasoning prompts for DLA/GLM

For each activity, generator should answer:

1. Which LO(s) and cognitive level(s) apply?
2. Which concepts are required to succeed?
3. Which of those are taught here vs activated from prior?
4. Which misconceptions are likely here?
5. Which process/relationship needs demonstration?
6. What verification checkpoint is needed before next activity?
7. What transition statement keeps arc coherence?

---

## 8. Component-to-generation mapping

This section ties components to existing generation surfaces without schema changes.

| Component | DLA responsibility | GAM responsibility | Page composition responsibility |
|---|---|---|---|
| Orientation | require activity preamble + arc cue | realise concise learner-facing language where materialized | preserve field visibly |
| Concept elucidation | specify required explanatory intent/material | author explanatory body/examples | preserve, do not compress away |
| Activation | include short activation cue | provide prompt wording if materialized | keep before task |
| Misconception handling | specify target misconception + correction intent | render misconception-aware prompt/check | preserve adjacent to relevant task |
| Worked reasoning | require demonstration artefact | author worked example/modelling note | keep before main practice |
| Guidance | specify method and output checks in task | align materials to task method | preserve complete task text |
| Practice | define authentic task + materials | realise cases/tables/prompts with sufficient depth | preserve full activity block |
| Verification | require explicit checkpoint artefact | author checklist/prompt_set/task_cards | preserve as visible self-check |
| Reflection | require learner-generated closure | provide prompts/template (not answer key) | keep non-spoiler |
| Transition | define bridge and sequence intent | n/a or optional cue material | preserve bridge text |

---

## 9. Relationship to Sprint 28-31 pedagogical journey

### 9.1 Preserved ideas (already aligned with ACM)

| Prior sprint idea | Status in ACM |
|---|---|
| Sprint 28: structure vs cognition distinction | Preserved as material type vs component distinction |
| Sprint 28: misconception repair and cognitive progression concern | Preserved in misconception + transition components |
| Sprint 30 PEC `orientation_contract` | Directly maps to orientation + transition |
| Sprint 30 PEC `reasoning_contract` | Directly maps to worked reasoning + guidance |
| Sprint 30 self-study emphasis, no adaptive tutoring | Preserved |
| Sprint 31 renderer-passive discipline | Preserved (ACM is generation design, not renderer invention) |

### 9.2 Lost or diluted ideas (relative to 28-31)

| Idea | Evidence of dilution on 38F anchor |
|---|---|
| Activity-level orientation persistence | DLA had preambles; page dropped them |
| Reasoning scaffolds in analysis/evaluation activities | 38F compressed to LO->Task for A2/A3 |
| Misconception-aware support | Minimal explicit misconception surfacing |
| Revision/verification rhythm | checklist/prompt_set density reduced vs richer comparator |

### 9.3 Unrealised opportunities

| Opportunity | Why it is viable now |
|---|---|
| Reuse existing PEL/cognition field surfaces for workbook episodes | Already implemented historically; no schema expansion needed |
| Use LO level to set minimum support density | LO levels already exist |
| Tie KM relationships/processes directly to worked reasoning requirements | KM already carries these affordances |
| Add deterministic anti-spoiler closure discipline | Works within existing `consolidation_summary` type |

**Conclusion:** 38G-2 should not reinvent the journey; it should consolidate and reapply proven concepts to workbook activity generation quality.

---

## 10. Scoring checklist for ACM compliance (for 38G-3/38G-4 use)

Per activity, mark Yes/No:

1. LO level identified and matched to minimum bundle.
2. Required concepts listed (teach vs activate split explicit).
3. At least one KM relationship/process is taught where LO is Analyse/Evaluate.
4. At least one likely misconception surfaced where relevant.
5. Worked reasoning present before higher-demand practice.
6. Guidance is executable (method + output quality expectation).
7. Verification checkpoint present.
8. Reflection present where closure/integration intended.
9. Transition cue included where activity sequence requires continuity.
10. No component replaced by answer-key style spoiler.

Page-level pass requires:

- no critical LOs with missing minimum bundle,
- at least two explicit verification beats,
- Evaluate outcomes backed by evaluate practice (not closure-only mention),
- structural hold conditions retained (V-01/V-05/38E-8/9).

---

## 11. Recommended 38G-3 implementation approach (pack-only, bounded)

Analysis recommendation only; no implementation in this slice.

### 11.1 Approach

1. Encode ACM as **obligations in DLA/GAM prompt contracts** in pack §5/§6.
2. Keep existing material-type obligations unchanged (V-01/V-05 and retained types).
3. Add component-level obligations as generation rules, not new schema fields.
4. Define LO-level minimum component density rules in DLA guidance.
5. Define anti-spoiler closure rule for consolidation realisation in GAM guidance.

### 11.2 Sequencing for 38G-3

| Step | Focus |
|---|---|
| 1 | DLA component decision logic (LO->KM->components) |
| 2 | DLA task/guidance constraints for method completeness |
| 3 | GAM realisation constraints for verification and worked reasoning |
| 4 | GAM consolidation discipline (template/reflection over model-answer spoiler) |
| 5 | Preserve existing structural hold rows unchanged in intent |

### 11.3 Guardrails

- No `app.js` work unless charter amendment.
- No Design Page/renderer reopening.
- No new KM/LO schema fields.
- No workflow topology changes.

---

## 12. Completion statement

| Requirement | Met? |
|---|:---:|
| 1. Activity Component definitions | Yes |
| 2. KM affordance -> component relationship | Yes |
| 3. LO cognitive level -> component relationship | Yes |
| 4. Component -> workbook generation mapping | Yes |
| 5. Relationship to Sprint 28-31 journey | Yes |
| 6. Recommended 38G-3 implementation approach | Yes |
| Analysis/design only (no implementation) | Yes |

**Slice 38G-2:** **COMPLETE**  
**Next:** 38G-3 — DLA/GAM implementation (pack §5/§6 only)


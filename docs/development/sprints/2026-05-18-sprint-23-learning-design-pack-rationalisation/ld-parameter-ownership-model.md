# LD parameter ownership model — Sprint 23 Slice 23-4

**Date:** 2026-05-18  
**Slice:** 23-4 — Workflow vs step parameter ownership  
**Status:** **Complete** (governance/semantics only — no pack or runtime edits)  
**Baselines:** [`ld-semantics-matrix.md`](ld-semantics-matrix.md) · [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md) · [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md)

---

## 1. Objective and approved architectural model

### Objective

Define **parameter ownership**, **precedence**, **inheritance**, and **edit-surface responsibility** across workflow constraints, pack metadata (`workflowParameterControls`, `stepParameterControls`), PF `userOptions`, `mappingRules`, runtime inheritance, and prompt-local authoring — so **23-5** and **23-6** can implement pack changes without ambiguity.

### Approved architectural model (Sprint 23)

| Principle | Statement |
|-----------|-----------|
| **Elicitation** | **Initialises** persistent pedagogical state (`workflowBriefResolution`, constraints, `stepParamPatch`). |
| **Settings** | **Operational authority after synthesis** for pack-declared tunables (workflow + included steps). |
| **Design Assessment** | **Canonical assessment authority** — blueprint semantics (type, difficulty, coverage, item count, display intent) **originate here**. |
| **Generate Assessment Items** | **Inherits from Design Assessment by default**; explicit step-level override only when user opts in (today: PF “advanced options”; target: documented override policy). |
| **Runtime inheritance** | **Preserved** until post-**23-5** parity gates and **23-6** metadata alignment are met — **do not remove in 23-4**. |
| **mappingRules** | **Materialise** brief → constraints/stepParams at synthesis; **never** auto-synthesise Settings controls. |
| **Prompt-local** | Step prompt bodies and PF-only scaffolding — **Edit** / PF, not unified Settings. |

### Explicit boundaries (do not implement yet)

| Boundary | Until |
|----------|--------|
| Pack metadata edits | Slice **23-6** chartered |
| Retire `resolveAssessmentItemsInheritedOptions` | After 23-5 gates + 23-6 controls + regression tests |
| Remove PF `userOptions` | After Settings parity per step |
| Change elicitation runtime | 23-6 pack flags only (`mustAsk`, `skipIfContextResolved`) |
| Settings UI redesign | Out of Sprint 23 |
| Research packs | Frozen |

---

## 2. Ownership vocabulary and precedence doctrine

### 2.1 Ownership classes

| Class | Definition | Canonical storage | Primary edit surface (post-synthesis) |
|-------|------------|-------------------|--------------------------------------|
| **Workflow-owned** | Pedagogical assumption applies to the **whole workflow instance**. | `workflow.workflowOutputSpec.constraints.*` | Unified **Settings** → workflow section |
| **Step-owned** | Assumption applies to **one canonical step**’s execution. | `stepParams.<canonicalStepId>.*` in step notes `[PRISM_STEP_PARAMS]` | Unified **Settings** → step section (included steps only) |
| **Inherited** | Value **derived from an upstream step** on a downstream step; downstream may override. | Downstream `stepParams` (effective at run/prompt time) | Source: **Settings on authority step**; override: downstream Settings or PF advanced |
| **Topology-only** | Affects **which steps exist**, not a tunable parameter key. | Brief resolved factors / inference; WGC rules | **Elicitation** only (not Settings) |
| **Artefact-derived** | Determined by **upstream outputs**, not a user tunable. | Artefact JSON in workflow run | **Run** / step execution; no parameter row |
| **Prompt-local** | Shapes prompt text only; not operational pedagogical state. | Prompt draft, PF template vars | **Edit** / per-step PF; excluded from unified Settings |

### 2.2 Precedence doctrine (highest wins at use time)

Applies when the **same semantic concern** appears on multiple surfaces:

```text
1. Explicit downstream step override (stepParams on consuming step)
      over
2. Inherited value from authority step (Design Assessment → Generate Items)
      over
3. Brief-mapped stepParamPatch from synthesis
      over
4. Workflow constraint default
      over
5. Pack control default in metadata
```

**Elicitation vs Settings (time dimension):**

```text
Before synthesis:  essentials + topology gates + initialisers (elicitation)
At synthesis:      mappingRules write constraints + stepParamPatch
After synthesis:     Settings / step Settings (operational authority)
Prompt editing:      Edit surface (implementation layer; does not change ownership class)
```

### 2.3 Precedence table (surfaces)

| Surface | Phase | Role | Overrides |
|---------|-------|------|-----------|
| `requiredFactors` / `optionalFactors` / `refinementFactors` | Pre-synthesis | Initialise | — |
| `mappingRules` | Synthesis | Materialise | Elicitation values |
| `workflow.workflowOutputSpec.constraints` | Post-synthesis | Workflow-owned state | Earlier brief only via re-save / Settings |
| `workflowParameterControls` | Post-synthesis UI | Edit workflow-owned | Constraints + notes merge on Save |
| `stepParameterControls` | Post-synthesis UI | Edit step-owned | Step notes `[PRISM_STEP_PARAMS]` |
| PF `userOptions` | Post-synthesis (PF mode) | Edit when no pack control id collision | Pack control ids filtered out |
| Runtime inheritance (`resolveAssessmentItemsInheritedOptions`) | PF / prompt hydrate | **Effective** values for Generate Items | Explicit generate-step params if advanced override |
| Prompt draft (`Edit`) | Implementation | Local prompt override | Does not redefine ownership |

---

## 3. Workflow-level parameter ownership

### 3.1 Workflow constraint keys (from mappingRules)

| Constraint key | Brief factor(s) | `workflowParameterControls`? | Ownership | Post-synthesis editor |
|----------------|-----------------|-------------------------------|-----------|------------------------|
| `topic` | `topic` | — | Workflow-owned | Elicitation only (no control) |
| `design_scope` | `design_scope` | ✓ `design_scope` | Workflow-owned | **Settings** |
| `input_strategy` | `input_strategy` | ✓ `input_strategy` | Workflow-owned | **Settings** |
| `delivery_context` | `delivery_context` | ✓ `delivery_context` | Workflow-owned | **Settings** |
| `duration_minutes` | `duration_minutes` | ✓ `duration_minutes` | Workflow-owned (+ step mirror) | **Settings** (workflow); see §4 sequence |
| `delivery_pattern` | `delivery_pattern` | — | Workflow-owned | Elicitation / constraint (no workflow control) |
| `delivery_mode` | `delivery_mode` | — | Workflow-owned | Elicitation / inference |
| `assessment_strategy` | `assessment_strategy` | — | Workflow-owned | Elicitation |
| `assessment_type` | `assessment_type` (refinement) | — | Workflow-owned (+ DA alias) | Elicitation then **DA step** |
| `assessment_total_items` | `assessment_total_items` | — | Workflow-owned (+ DA/Gen) | Elicitation then **DA step** |
| `coverage_scope` | `coverage_scope` | — | Workflow-owned (+ DA) | **DA** (target Settings) |
| `cognitive_demand` | `cognitive_demand` | — | Workflow-owned (+ DA) | **DA** (target Settings) |
| `difficulty_profile` | `difficulty_profile` | — | Workflow-owned (+ DA/Gen) | **DA** authority |
| `learning_environments` | `learning_environments` | — | Workflow-owned | Elicitation |
| `session_materials` | `session_materials` | — | Workflow-owned (+ materials step) | **Step** `session_materials` |
| `page_profile` | `page_profile` | — | Workflow-owned (+ page step) | **Step** `page_profile` |
| Activity/page tone keys | refinement | — | Workflow-owned (+ page step) | **Step** settings-only |

### 3.2 `workflowParameterControls` ownership rule

| Rule | Detail |
|------|--------|
| W1 | Every `workflowParameterControls.key` **must** map to an existing `mappingRules` constraint (or gain a mapping in 23-6). |
| W2 | All four current controls are **`elicitation: settings-only`** → **no refinement re-ask** after first brief resolution. |
| W3 | Workflow controls **do not** replace required-factor blocking — essentials still run at brief time. |
| W4 | Editing workflow controls updates **constraints** on Save; does not auto-edit unrelated step params except via existing merge paths. |

---

## 4. Step-level parameter ownership

### 4.1 Step ownership matrix (declared controls)

| Canonical step | Control keys | Ownership | Also on workflow constraint? |
|----------------|--------------|-----------|-------------------------------|
| `step_normalize_content` | `structure_mode`, `detail_level`, `keep_examples` | Step-owned | — |
| `step_model_knowledge` | `include_*` (3) | Step-owned | — |
| `step_define_learning_outcomes` | `learnerLevel`, `numberOfOutcomes`, `cognitiveEmphasis`, `scope` | Step-owned | `learner_level` → audience |
| `step_design_learning_activities` | `activity_pattern_mix`, `grouping_preference`, `difficulty_level`, `coverage_breadth` | Step-owned | `activity_pattern_mix` |
| `step_generate_activity_materials` | `session_materials` | Step-owned | `session_materials` |
| `step_construct_learning_sequence` | `duration_minutes`, `sequencing_granularity`, `sequencing_style` | Step-owned | `duration_minutes`, `sequencing_granularity` |
| `step_design_page` | `page_profile`, `tone_style`, `depth_level`, `include_examples` | Step-owned | page-related constraints |
| `step_design_assessment` | `activity_type`, `total_items` | **Authority** (assessment) | `assessment_type`, `assessment_total_items`, etc. |
| `step_generate_assessment_items` | `number_of_items` | Step-owned (**inherited default**) | `assessment_total_items` |

### 4.2 Steps without parameter surface (intentional)

| Canonical step | Ownership model |
|----------------|-----------------|
| `step_generate_learning_content` | **Artefact-derived** + brief essentials (`topic`, `input_strategy`) |
| `step_design_feedback` | **Artefact-derived** (`assessment_items`); `feedback_required` is workflow/feedback mapping |
| `step_generate_slide_deck`, `step_generate_vle_structure`, `step_generate_learning_object_set` | **Artefact-derived** (assembly) |
| `step_validate_learning_design`, `step_revise_assessment_based_on_qa` | **Artefact-derived** (QA) |
| `step_design_marking_rubric` | **Artefact-derived** (`assessment_blueprint` / items) |

**Governance:** Absence of `stepParameterControls` is **not** a defect for Tier D steps unless a tunable need is chartered.

### 4.3 Dual-placement policy (workflow + step)

| Semantic | Workflow | Step | Doctrine |
|----------|----------|------|----------|
| `duration_minutes` | `workflowParameterControls.duration_minutes` | `step_construct_learning_sequence.duration_minutes` | **Workflow owns session default**; step owns **sequence realisation**. Same value at synthesis; either Settings group may be edited — **23-6** should document sync expectation. |
| `learner_level` / `learnerLevel` | `audience` constraint | `step_define_learning_outcomes.learnerLevel` | **Brief factor owns cohort**; step owns **outcome wording** enum — see §10 alias. |

---

## 5. Cross-step inheritance policy

### 5.1 Approved inheritance doctrine (Generate Assessment Items)

| Rule | Statement |
|------|-----------|
| I1 | **Design Assessment** is the **sole authority** for assessment blueprint parameters that Generate Items consumes by default. |
| I2 | **Generate Assessment Items** inherits **effective** values for: `response_formats` ← `activity_type`, `number_of_items` ← `total_items`, `difficulty_profile` ← `difficulty_level`, `coverage_mode` ← `coverage_breadth` (current runtime mapping). |
| I3 | Inheritance applies when Generate Items step params are **empty or brief-equal**; explicit user values on Generate Items **win** (advanced override). |
| I4 | **Target state (23-6):** inheritance declared in **pack policy**; runtime B2–B7 retired after parity. **Until then:** runtime behaviour is **normative**. |
| I5 | Unified Settings should eventually show **authority step** values as read-only hints on Generate Items section — **not in 23-4/23-6 scope** unless chartered UI. |

### 5.2 Inheritance map (current runtime — preserved)

| Authority (DA stepParams / PF id) | Consumer (Gen Items param) | Mapper (app.js) |
|--------------------------------|----------------------------|-----------------|
| `activity_type` | `response_formats` | `mapDesignAssessmentActivityTypeToResponseFormats` |
| `total_items` | `number_of_items` | `normalizeAssessmentItemCount` |
| `difficulty_level` | `difficulty_profile` | `mapDesignAssessmentDifficultyToItemsDifficultyProfile` |
| `coverage_breadth` | `coverage_mode` | `mapDesignAssessmentCoverageToItemsCoverageMode` |

### 5.3 Non-inherited cross-step flows

| Flow | Mechanism | Ownership |
|------|-----------|-----------|
| LO → Activities | Artefact `learning_outcomes` | Artefact-derived |
| Activities → Materials | Artefact `learning_activities` | Artefact-derived |
| Blueprint → Generate Items | Artefact `assessment_blueprint` + params | Artefact + **inheritance** |
| Brief → all steps | `stepParamPatch` | Synthesis materialisation |

---

## 6. PF-only vs Settings-owned vs prompt-local controls

### 6.1 Classification by edit surface (target state)

| Category | Definition | Current LD examples | Target owner |
|----------|------------|---------------------|--------------|
| **Settings-owned** | Listed in `workflowParameterControls` or `stepParameterControls` with `visible: true` | Normalize, Model, LO, DLA (partial), sequence, page (partial) | Unified Settings |
| **PF-only (transitional)** | In PF `userOptions` but not in Settings metadata | DA: `feedback_display`, `difficulty_level`, `coverage_breadth`; Gen: 8 options | **23-6:** promote to Settings; PF defers via `filterUserOptionsExcludingPackKeys` |
| **Prompt-local** | Affects prompt template only; not persisted as pedagogical param | PF scaffolds (MCQ feedback, page-task mode); `Edit` draft | **Edit** / PF |
| **Mapping-only** | Brief factor maps to `stepParams` without control | `cognitive_demand`, `assessment_cadence` on DA | **23-6:** add control or drop mapping |

### 6.2 Convergence rule (from 23-3 reference pattern)

> If a tunable is **operational pedagogical state**, it must appear in **pack `*ParameterControls`** with correct `elicitation` flag. PF `userOptions` with the **same id** become **secondary** (hidden by generic filter). PF-only ids without controls are **technical debt** until 23-6.

### 6.3 When refinement becomes Settings-only after synthesis

| Condition | Action (pack 23-6) |
|-----------|-------------------|
| Matching `workflowParameterControls` or `stepParameterControls` exists | Set factor `mustAsk: false`; rely on `skipIfContextResolved` when constraint/stepParam populated |
| Value only on workflow constraint | Add workflow control **or** keep elicitation-only |
| Assessment factor mapped to DA | **DA step control** required before dropping refinement ask |
| Topology gate (`assessment_required`) | **Never** Settings-only — stays elicitation/inference |

---

## 7. Assessment ownership model (priority)

### 7.1 Authority table

| Semantic concern | Canonical authority | Brief factor (init) | Constraint key | Step param key (target) | Generate Items |
|------------------|---------------------|---------------------|----------------|-------------------------|----------------|
| Assessment required? | **Topology** | `assessment_required` | — | — | — |
| Assessment strategy | Workflow | `assessment_strategy` | `assessment_strategy` | — | — |
| Question / activity type | **Design Assessment** | `assessment_type` | `assessment_type` | **`activity_type`** | inherited → `response_formats` |
| Total items | **Design Assessment** | `assessment_total_items` | `assessment_total_items` | **`total_items`** | inherited → `number_of_items`; local override allowed |
| Difficulty distribution | **Design Assessment** | `difficulty_profile` | `difficulty_profile` | **`difficulty_profile`** (target; PF today: `difficulty_level`) | inherited → `difficulty_profile` |
| Coverage | **Design Assessment** | `coverage_scope` | `coverage_scope` | **`coverage_scope`** (target; PF today: `coverage_breadth`) | inherited → `coverage_mode` |
| Cognitive demand | **Design Assessment** | `cognitive_demand` | `cognitive_demand` | **`cognitive_demand`** | — (blueprint-level) |
| Assessment cadence | **Design Assessment** | `assessment_cadence` | `assessment_cadence` | **`assessment_cadence`** | — |
| Response mode mix | Generate Items (operational) | `question_style_mix` | `question_style_mix` | **`question_style_mix`** (target control) | step-owned |
| Stimulus / composition / feedback mode | Generate Items | — | — | PF ids today | step-owned (target) |
| Feedback pack mode | Design Feedback | `feedback_required` | constraint | `step_design_feedback.*` | artefact |
| Display / answer grid intent | **Design Assessment** (blueprint) | — | — | PF `feedback_display` | prompt-shaping only |

### 7.2 Generate Items inheritance doctrine (normative)

1. **Default:** All inherited fields in §5.2 populated from **nearest upstream Design Assessment** step in workflow instance.  
2. **Override:** User sets Generate Items `stepParams` explicitly (PF advanced toggle or Settings when controls exist).  
3. **Precedence:** Override > inheritance > brief patch > defaults.  
4. **No second authority:** Generate Items does **not** own blueprint semantics (type, coverage, difficulty policy) — only **realisation** params (formats, stimulus, item-level feedback mode).  
5. **Runtime:** Current `app.js` implementation is **preserved** until pack declares equivalent policy and tests pass.

### 7.3 PF-only assessment fields (interim ownership)

| Field | Interim owner | 23-6 target |
|-------|---------------|-------------|
| `feedback_display` | DA PF / prompt-local | DA **step-owned** Settings |
| `difficulty_level` | DA PF | Rename to **`difficulty_profile`** on DA step |
| `coverage_breadth` | DA PF | Rename to **`coverage_scope`** on DA step |
| Gen: `composition_mode`, `stimulus_mode`, etc. | Gen PF | Gen **step-owned** Settings |

---

## 8. Topology-only and artefact-derived semantics

### 8.1 Topology-only (not parameters)

| Factor / signal | Effect | Edit surface |
|-----------------|--------|--------------|
| `assessment_required` | Includes/excludes assessment steps; refinement gates | Elicitation / `inferenceRules` |
| `learning_environments` | VLE/xerte/LO guards; pack guidance | Elicitation |
| WGC title filters (`design assessment`, `construct learning sequence`, …) | Step list pruning | Runtime WGC (documented in 23-5) |
| `delivery_pattern` | Constraints + graph | Required elicitation |

**Rule:** Do not add `workflowParameterControls` for topology-only factors without changing graph semantics.

### 8.2 Artefact-derived (no parameter row)

Steps that consume/produce artefacts only — see §4.2. **Governance:** Parameters appear only when pack authors declare a **tunable** that changes execution independent of artefact content.

---

## 9. Canonical-step governance patterns

| Pattern | Steps | Ownership summary |
|---------|-------|-------------------|
| **P1 — Full step parity** | Normalize, Model Knowledge, Define LO | Step-owned; PF ⊆ Settings; Settings authority |
| **P2 — Workflow + step mirror** | Construct Sequence (`duration_minutes`) | Dual placement with documented sync |
| **P3 — Authority + inheritor** | Design Assessment → Generate Items | DA authority; Gen inherited + override |
| **P4 — Settings ⊃ PF** | DLA, Design Page (partial) | Align PF ids or drop orphan controls |
| **P5 — Settings only, PF none** | Generate Activity Materials | Correct target state |
| **P6 — No params** | Assembly, QA, Gen Learning Content | Artefact-derived |

---

## 10. Naming alignment and alias policy

### 10.1 Alias registry (canonical param key ← brief / legacy id)

| Canonical key (target) | Aliases / legacy | Scope | Policy |
|------------------------|------------------|-------|--------|
| `activity_type` | brief `assessment_type` | DA step | **Brief maps to** `activity_type`; document in pack |
| `total_items` | brief `assessment_total_items` | DA step | Brief maps to both constraint + `total_items` |
| `number_of_items` | brief `assessment_total_items` | Gen step | **Inherit** from DA `total_items` by default |
| `difficulty_profile` | PF `difficulty_level`; brief `difficulty_profile` | DA + Gen | **Unify on `difficulty_profile`** on DA step (23-6) |
| `coverage_scope` | PF `coverage_breadth`; brief `coverage_scope` | DA | **Unify on `coverage_scope`** on DA step (23-6) |
| `coverage_mode` | — | Gen step | Consumer key; maps from DA `coverage_scope` / `coverage_breadth` |
| `learnerLevel` | brief `learner_level` | Outcomes step | **Different enums** — maintain explicit mapping table in 23-6 |
| `duration_minutes` | PF `total_duration_minutes` | Workflow + sequence | **Unify on `duration_minutes`**; fix PF id (23-6) |

### 10.2 Naming rules (new pack metadata)

| Rule | Detail |
|------|--------|
| N1 | **Brief factor id** may differ from **step param key** only when `mappingRules` documents the target. |
| N2 | **PF `userOptions.id`** should equal **`stepParameterControls.key`** when both exist. |
| N3 | **No duplicate ids** across steps unless semantics are intentionally step-scoped (e.g. `difficulty_level` on DLA vs DA — disambiguate by `canonicalStepId` in docs). |
| N4 | **Workflow constraint keys** use snake_case brief factor names unless aliased in mapping. |

### 10.3 `learner_level` ↔ `learnerLevel` mapping (reference)

| Brief `learner_level` | Step `learnerLevel` (outcomes) |
|-----------------------|--------------------------------|
| beginner, intermediate, advanced | school, general_adult, … |
| undergraduate | undergraduate |
| postgraduate | postgraduate |

**Ownership:** Brief **workflow audience**; step **outcome phrasing** — not the same enum; do not merge without translation layer in 23-6.

---

## 11. Recommended ownership decisions by factor/key

### 11.1 Master ownership matrix

| Factor / key | Owner class | Authority step / constraint | Elicitation (pre-synthesis) | Post-synthesis edit | Inheritance | Implement slice |
|--------------|-------------|----------------------------|-----------------------------|---------------------|-------------|-----------------|
| `topic` | Workflow-owned | constraint | Required | — | — | — |
| `learner_level` | Workflow + step | constraint + `step_define_learning_outcomes` | Required | Step Settings | — | 23-6 enum map |
| `design_scope` | Workflow-owned | constraint | Required | Workflow Settings | — | 23-6 precedence doc |
| `delivery_pattern` | Workflow-owned | constraint | Required | Elicitation | — | — |
| `input_strategy` | Workflow-owned | constraint | Required | Workflow Settings | — | 23-6 |
| `duration_minutes` | Workflow + step | constraint + sequence | Optional | Workflow + step Settings | — | 23-6 PF key |
| `delivery_context` | Workflow-owned | constraint | Optional | Workflow Settings | — | 23-6 drop extraFields |
| `delivery_mode` | Workflow-owned | constraint | Optional | Elicitation | — | — |
| `assessment_required` | **Topology** | — | Optional | — | — | 23-5 doc |
| `assessment_strategy` | Workflow-owned | constraint | Optional | Elicitation | — | 23-5 |
| `learning_environments` | Topology / workflow | constraint | Optional | Elicitation | — | — |
| `session_materials` | Step-owned | materials step | Optional | Step Settings | — | — |
| `page_profile` | Step-owned | page step | Optional | Step Settings | — | — |
| `assessment_type` | **DA authority** | constraint + DA | Refinement init | DA Settings (target) | → Gen formats | 23-5, 23-6 |
| `assessment_total_items` | **DA authority** | constraint + DA + Gen | Refinement init | DA Settings (target) | → Gen count | 23-5, 23-6 |
| `coverage_scope` | **DA authority** | constraint + DA | Defer refinement | DA Settings (target) | → Gen `coverage_mode` | 23-5, 23-6 |
| `cognitive_demand` | **DA authority** | constraint + DA | Defer refinement | DA Settings (target) | — | 23-5, 23-6 |
| `difficulty_profile` | **DA authority** | constraint + DA + Gen | Defer refinement | DA Settings (target) | → Gen | 23-5, 23-6 |
| `question_style_mix` | Gen step-owned | constraint + Gen | Defer refinement | Gen Settings (target) | — | 23-6 |
| `assessment_cadence` | **DA authority** | constraint + DA | Defer refinement | DA Settings (target) | — | 23-6 |
| `feedback_required` | Feedback step | design feedback step | Defer refinement | PF/artefact | — | 23-5 |
| `activity_pattern_mix` | Step-owned (DLA) | constraint + DLA | Defer refinement | Step Settings | — | 23-6 PF |
| `sequencing_granularity` | Step-owned (sequence) | constraint + sequence | Defer refinement | Step Settings | — | 23-6 PF |
| `tone_style`, `depth_level`, `include_examples` | Step-owned (page) | constraint + page | Defer refinement | Step Settings | — | — |
| `feedback_display` | DA prompt/params | — | — | PF → DA Settings | — | 23-6 |
| Gen PF-only ids | Gen step-owned | — | — | PF → Settings | Inherit defaults | 23-6 |

### 11.2 Convergence recommendations (summary)

| Priority | Recommendation |
|----------|----------------|
| 1 | Declare **DA** as single assessment **authority** in pack README / `workflowBriefConfig` policy block (23-6) |
| 2 | Align DA + Gen **step param keys** with brief factors and inheritance map (23-6) |
| 3 | Promote PF-only assessment fields to **Settings-owned** (23-6) |
| 4 | Document **Generate Items inheritance** in pack; retire runtime after tests (post-23-6 charter) |
| 5 | Fix **duration_minutes** / **learner_level** aliases (23-6) |
| 6 | Mark page/activity refinements **settings-only** in elicitation metadata (23-6) |

---

## 12. Handoff to 23-5 and 23-6

### 12.1 Slice 23-5 — Design Assessment semantics

| Input from 23-4 | Use |
|-----------------|-----|
| §7 Assessment ownership model | Normative authority table |
| §5 Inheritance doctrine | Validate against blueprint prompt template |
| §10 Aliases | Resolve `difficulty_level` / `coverage_breadth` vs mapping targets |
| §8 Topology | Link `assessment_required` to WGC DA pruning |

**23-5 deliverable expectation:** Semantics matrix row per DA param; explicit **prompt template placeholder** ↔ **stepParam** ↔ **Settings** mapping.

### 12.2 Slice 23-6 — Pack metadata rationalisation

| Input from 23-4 | Pack action |
|-----------------|-------------|
| §11 ownership matrix | Add/remove `stepParameterControls` rows |
| §6.3 Settings-only refinement | `mustAsk` / `skipIfContextResolved` |
| §10 alias policy | Rename PF ids; fix `total_duration_minutes` |
| §3 W1–W4 | Ensure workflow controls ↔ mappings |
| **Not** auto-promote mappingRules | Each new control is **authored** with metadata |

### 12.3 Runtime retirement (explicitly not 23-4 or 23-6 default)

Charter separately after:

- [ ] 23-5 closed  
- [ ] 23-6 controls cover §5.2 inherited fields  
- [ ] Tests green for inheritance paths  
- [ ] Gates G1–G5 from [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md) §10.2  

---

## 13. Verification

```bash
node --test tests/*.test.js
```

**Result (2026-05-18):** **188 passed**, 0 failed.

---

## References

- [`ld-semantics-matrix.md`](ld-semantics-matrix.md)  
- [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md)  
- [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md)  
- [`slice-23-4-charter.md`](slice-23-4-charter.md)

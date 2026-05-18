# LD Prompt Factory bespoke-control audit — Sprint 23 Slice 23-3

**Date:** 2026-05-18  
**Slice:** 23-3 — Prompt Factory bespoke-control audit  
**Status:** **Complete** (audit only — no pack or runtime edits)  
**Baselines:** [`ld-semantics-matrix.md`](ld-semantics-matrix.md), [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md)

**Canonical sources:**  
`domains/learning-design/domain-learning-design-step-patterns.md` · `app.js`

---

## 1. Objective and constraints

### Objective

Audit **Prompt Factory `userOptions`** and **LD-specific runtime/PF behaviour** against pack-declared `stepParameterControls` and `mappingRules`, to identify where step information needs are still expressed **outside** canonical metadata — across **all** LD workflow steps, with Design Assessment / Generate Assessment Items as the highest-risk **example** of a systemic pattern.

### Constraints (honoured)

| Constraint | Status |
|------------|--------|
| No pack metadata edits | ✓ |
| No runtime behaviour changes | ✓ |
| Do not remove PF controls or inheritance helpers | ✓ |
| Do not redesign Settings | ✓ |
| Research packs frozen | ✓ |
| No `mappingRules` auto-promotion to controls | ✓ |

### Framing

Design Assessment is **not** treated as a one-off: it exemplifies **PF-only + runtime inheritance + thin Settings metadata**. The same pattern appears (at lower severity) on Generate Assessment Items, Design Learning Activities, Construct Learning Sequence, and Design Page.

---

## 2. Audit method

1. **Canonical step inventory** — `workflowPolicy.canonicalSteps` (17 titles) → slugified `canonical_step_id` (WGC convention).  
2. **Pack surfaces per step** — PF block (`configurationMode`, `userOptions`, `promptTemplate` placeholders), `stepParameterControls` rows, `mappingRules` `stepParams.*` targets.  
3. **Runtime cross-check** — `app.js` grep for title/canonical branches, inheritance, draft scaffolds, WGC pruning.  
4. **Convergence model** — compare to **reference pattern** (Normalize Content / Model Knowledge: full PF ↔ Settings parity via `filterUserOptionsExcludingPackKeys`).  
5. **Classify gaps** — pack-declared · PF-only · mapping-only · runtime-only · misaligned keys.

---

## 3. Canonical step inventory

| # | Pack title | Canonical ID (typical) | PF `userOptions` | `stepParameterControls` | Notes |
|---|------------|------------------------|------------------|-------------------------|--------|
| 1 | Normalize Content | `step_normalize_content` | 3 | 3 | **Reference pattern** |
| 2 | Generate Learning Content | `step_generate_learning_content` | 0 | 0 | Template-only PF JSON |
| 3 | Model Knowledge | `step_model_knowledge` | 3 | 3 | **Reference pattern** |
| 4 | Define Learning Outcomes | `step_define_learning_outcomes` | 4 | 4 | Brief `learner_level` enum mismatch |
| 5 | Design Learning Activities | `step_design_learning_activities` | 3 | 4 | PF missing `activity_pattern_mix` |
| 6 | Generate Activity Materials | `step_generate_activity_materials` | 0 | 1 | PF `configurationMode: none` |
| 7 | Design Assessment | `step_design_assessment` | 5 | 2 | **Highest risk** |
| 8 | Design Feedback | `step_design_feedback` | 0 | 0 | `feedback_required` via mapping only |
| 9 | Generate Assessment Items | `step_generate_assessment_items` | 9 | 1 | **Highest risk** (volume + inheritance) |
| 10 | Construct Learning Sequence | `step_construct_learning_sequence` | 2 | 3 | Duration key mismatch |
| 11 | Design Page | `step_design_page` | 4 | 4 | PF `none` but options exist; partial overlap |
| 12 | Generate Slide Deck | `step_generate_slide_deck` | 0 | 0 | Assembly; notes only |
| 13 | Generate VLE Structure | `step_generate_vle_structure` | 0 | 0 | Assembly |
| 14 | Generate Learning Object Set | `step_generate_learning_object_set` | 0 | 0 | Assembly |
| 15 | Validate Learning Design | `step_validate_learning_design` | 0 | 0 | QA step |
| 16 | Revise Assessment Based on QA | `step_revise_assessment_based_on_qa` | 0 | 0 | QA revision |
| 17 | Design Marking Rubric | `step_design_marking_rubric` | 0 | 0 | Rubric from blueprint |

**Coverage:** 8 steps have `stepParameterControls`; **9** have none. PF `userOptions` appear on **8** steps (including Design Page despite `configurationMode: none`).

---

## 4. PF userOptions vs stepParameterControls matrix

Legend: **✓** aligned (same id); **⊂** Settings subset of PF; **≠** key/name mismatch; **—** absent.

| Canonical step | PF option ids | Settings control keys | Alignment |
|----------------|---------------|----------------------|-----------|
| `step_normalize_content` | `structure_mode`, `detail_level`, `keep_examples` | same | **✓ full** |
| `step_model_knowledge` | `include_relationships`, `include_misconceptions`, `include_processes` | same | **✓ full** |
| `step_define_learning_outcomes` | `learnerLevel`, `numberOfOutcomes`, `cognitiveEmphasis`, `scope` | same | **✓ full** (brief factor enums differ) |
| `step_design_learning_activities` | `grouping_preference`, `difficulty_level`, `coverage_breadth` | + `activity_pattern_mix` | **PF ⊂ Settings** (control has extra key) |
| `step_generate_activity_materials` | — | `session_materials` | **Settings only** |
| `step_design_assessment` | `activity_type`, `feedback_display`, `difficulty_level`, `coverage_breadth`, `total_items` | `activity_type`, `total_items` | **⊂ partial**; mapping uses `difficulty_profile`, `coverage_scope` |
| `step_generate_assessment_items` | 9 ids (see §8) | `number_of_items` only | **⊂ strong** |
| `step_construct_learning_sequence` | `total_duration_minutes`, `sequencing_style` | `duration_minutes`, `sequencing_granularity`, `sequencing_style` | **≠ duration**; PF missing `sequencing_granularity` |
| `step_design_page` | `page_profile`, `include_answers`, `include_marking_guidance`, `include_feedback_guidance` | `page_profile`, `tone_style`, `depth_level`, `include_examples` | **Overlap partial**; disjoint sets |

---

## 5. Pack-declared vs PF-only controls

### 5.1 PF-only (no `stepParameterControls` row)

| Step | PF-only option ids | Also in mappingRules? | Editable today |
|------|-------------------|----------------------|----------------|
| `step_design_assessment` | `feedback_display`, `difficulty_level`, `coverage_breadth` | `difficulty_profile`, `coverage_scope` (**≠ keys**) | PF + step notes; **not** unified Settings |
| `step_generate_assessment_items` | `response_formats`, `composition_mode`, `stimulus_mode`, `scenario_scope`, `cognitive_emphasis`, `difficulty_profile`, `feedback_mode`, `coverage_mode` | partial (`question_style_mix` brief only) | PF (hidden until advanced toggle); partial inheritance |
| `step_design_page` | `include_answers`, `include_marking_guidance`, `include_feedback_guidance` | — | PF / Edit only |
| `step_design_learning_activities` | — | `activity_pattern_mix` mapped | **Inverse:** Settings has control PF lacks |

### 5.2 Settings-only (no PF `userOptions`)

| Step | Settings keys | Notes |
|------|---------------|--------|
| `step_generate_activity_materials` | `session_materials` | PF `configurationMode: none` — correct split if Settings is authority |
| `step_design_learning_activities` | `activity_pattern_mix` | Template uses workflow constraints; PF should expose or drop control |

### 5.3 Mapping-only (brief → `stepParams`, no PF/Settings)

| mappingRules target | Brief factor | Step |
|---------------------|--------------|------|
| `step_design_assessment.coverage_scope` | `coverage_scope` | DA |
| `step_design_assessment.cognitive_demand` | `cognitive_demand` | DA |
| `step_design_assessment.assessment_cadence` | `assessment_cadence` | DA |
| `step_design_assessment.difficulty_profile` | `difficulty_profile` | DA (**PF uses `difficulty_level`**) |
| `step_design_feedback.feedback_required` | `feedback_required` | Design Feedback |
| `step_generate_assessment_items.question_style_mix` | `question_style_mix` | Gen items |

---

## 6. Runtime bespoke logic inventory

### 6.1 Generic (keep — pack-driven)

| Mechanism | Location | Role |
|-----------|----------|------|
| `renderWorkflowPackParameterControlsSection` | `app.js` ~2308 | Renders `stepParameterControls` in PF + unified Settings |
| `buildPackOwnedUserOptionIdMap` / `filterUserOptionsExcludingPackKeys` | ~2204–2212 | Hides PF options when pack owns same **id** |
| Unified Settings aggregation | Sprint 22 | Workflow + included-step controls |

### 6.2 LD-specific bespoke (retirement candidates after pack parity)

| ID | Symbol / behaviour | Lines (approx.) | Steps affected | Category |
|----|-------------------|-----------------|----------------|----------|
| B1 | `isGenerateAssessmentItemsContext` | 1065–1075 | Generate Assessment Items | Step detector (duplicate B8) |
| B2 | `resolveAssessmentItemsInheritedOptions` | 3473–3552 | Generate ← Design Assessment | **Cross-step inheritance** |
| B3 | `mapDesignAssessmentActivityTypeToResponseFormats` | 1085–1097 | Generate ← DA | Value translation |
| B4 | `mapDesignAssessmentDifficultyToItemsDifficultyProfile` | 1099–1108 | Generate ← DA | Key + value translation |
| B5 | `mapDesignAssessmentCoverageToItemsCoverageMode` | 1110–1118 | Generate ← DA | Key + value translation |
| B6 | PF UI: inherited notice + `assessmentItemsShowAdvancedOptions` | 3612–3665 | Generate items | PF UX bespoke |
| B7 | `applyWorkflowStepPromptDefaults` inheritance branch | 4053–4074 | Generate items | Prompt hydration |
| B8 | `isGenerateAssessmentItemsStep` (inner duplicate) | 4564–4574 | Generate items | Duplicate detector |
| B9 | `isMcqLikeAssessmentContext` | 4586–4608 | Generate items | Heuristic |
| B10 | `withMcqDefaultFeedbackScaffold` | 4609–4626 | Generate items | Draft text injection |
| B11 | `isDesignLearningActivitiesStep` | 4575–4585 | DLA | Step detector |
| B12 | `withPageTaskModeScaffold` | 4627+ | DLA | Draft text injection |
| B13 | WGC optional-step pruning (title strings) | 10852–10917 | Many | **Topology** (not PF params) |
| B14 | Upstream “no assessment items yet” boundary | 16702–16710 | Gen content, model, define LO | Prompt guard |
| B15 | Planning adequacy `ld_page_profile_facilitator_mismatch` | 2356, 2547 | Design Page | Advisory link |

**Pattern:** B2–B7 are the **assessment inheritance stack**; B10–B12 are **prompt scaffolds** for other steps; B13 is **WGC** (out of PF scope but affects which steps exist).

---

## 7. Cross-step dependencies and inheritance

```text
                    workflowBriefResolution / stepParamPatch
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
  step_design_assessment    step_define_learning_outcomes   workflow constraints
  (blueprint params)         (learnerLevel ← learner_level)
         │
         │  resolveAssessmentItemsInheritedOptions (runtime B2)
         │  reads step notes keys: activity_type, total_items,
         │       difficulty_level, coverage_breadth  (PF ids)
         ▼
  step_generate_assessment_items
  (response_formats, number_of_items, difficulty_profile, coverage_mode, …)
         │
         ├──► step_design_feedback (artefact: assessment_items)
         ├──► step_validate_learning_design
         ├──► step_design_page (optional assessment_items section)
         └──► step_design_marking_rubric (assessment_blueprint)
```

| Dependent step | Depends on | Mechanism | Pack-declared? |
|----------------|------------|-----------|----------------|
| Generate Assessment Items | Design Assessment | Runtime B2–B5 | **No** — should be pack inheritance policy |
| Generate Assessment Items | Brief / blueprint | `stepParamPatch`, template | Partial |
| Design Page | assessment_items, blueprint | Artefact inputs | N/A |
| Design Feedback | assessment_items | Artefact inputs | `feedback_required` mapping only |
| Construct Learning Sequence | activities, materials, assessments | Inputs | Duration from workflow + step |
| Define LO | knowledge_model | Graph | `learner_level` mapping |

---

## 8. Design Assessment / Generate Assessment Items priority review

### 8.1 Design Assessment — information needs

| Information need | Pack-declared control | PF `userOption` | mappingRules | Runtime |
|------------------|----------------------|-----------------|--------------|---------|
| Question strategy | `activity_type` ✓ | `activity_type` ✓ | `assessment_type` → `activity_type` | — |
| Item count | `total_items` ✓ (advanced) | `total_items` ✓ | `assessment_total_items` | — |
| Difficulty | — | `difficulty_level` | `difficulty_profile` **≠ key** | Inherited to gen as `difficulty_profile` |
| Coverage | — | `coverage_breadth` | `coverage_scope` **≠ key** | Inherited to gen as `coverage_mode` |
| Feedback display | — | `feedback_display` | — (brief `feedback_required` → other step) | Prompt only |
| Cognitive demand | — | — | `cognitive_demand` | — |
| Assessment cadence | — | — | `assessment_cadence` | — |

**Key alignment failures (confirmed):** mapping targets ≠ PF ids ≠ inheritance read keys for difficulty/coverage.

### 8.2 Generate Assessment Items — PF-only surface

| PF id | In Settings metadata? | Inherited from DA? | Hidden by default UI? |
|-------|----------------------|--------------------|------------------------|
| `number_of_items` | ✓ | via `total_items` | No |
| `response_formats` | — | via `activity_type` | **Yes** (advanced toggle) |
| `difficulty_profile` | — | via `difficulty_level` | **Yes** |
| `coverage_mode` | — | via `coverage_breadth` | **Yes** |
| `composition_mode` | — | — | **Yes** |
| `stimulus_mode` | — | — | **Yes** |
| `scenario_scope` | — | — | **Yes** |
| `cognitive_emphasis` | — | — | **Yes** |
| `feedback_mode` | — | — | **Yes** |

**Operational reality:** Users tuning assessment mostly interact with **Design Assessment PF** or **brief elicitation**; unified Settings shows **one** generate-items control unless they use PF advanced mode.

---

## 9. Canonical-step information-needs review

For each step: **(I)** information need · **(C)** in `stepParameterControls`? · **(P)** PF only? · **(M)** mapping only? · **(R)** runtime bespoke? · **(E)** right edit surface? · **(D)** downstream deps? · **(K)** key alignment?

### `step_normalize_content`

| Q | Answer |
|---|--------|
| I | Structure, detail, examples retention | C ✓ | P — | M — | R — | E Settings + PF (deduped) | D downstream content quality | K ✓ |

### `step_generate_learning_content`

| Q | Answer |
|---|--------|
| I | Topic, audience, level, source strategy | C — | P — | M — | R B14 prompt boundary | E brief essentials only | D feeds model/page chain | K — |
| | | **Gap:** no tunable metadata; WGC may prune step | | | | | | |

### `step_model_knowledge`

| Q | Answer |
|---|--------|
| I | Relationships, misconceptions, processes | C ✓ | P — | M — | R B14 | E Settings + PF | D outcomes, assessment | K ✓ |

### `step_define_learning_outcomes`

| Q | Answer |
|---|--------|
| I | Learner level, count, cognitive emphasis, scope | C ✓ | P — | M `learner_level`→`learnerLevel` | R B14 | E Settings + brief | D all downstream | K brief ≠ step enums |

### `step_design_learning_activities`

| Q | Answer |
|---|--------|
| I | Pattern mix, grouping, difficulty, coverage | C ✓ (`activity_pattern_mix`) | P ⊂ (missing pattern mix) | M `activity_pattern_mix` | R B11–B12 scaffold | E Settings; PF partial | D materials, sequence | K ✓ except PF gap |

### `step_generate_activity_materials`

| Q | Answer |
|---|--------|
| I | Session material types | C ✓ | P — (mode none) | M `session_materials` | R — | E Settings | D page, deck | K ✓ |

### `step_design_assessment`

| Q | Answer |
|---|--------|
| I | Blueprint type, difficulty, coverage, items, feedback display, cadence, cognitive demand | C **2/7+** | P **3+** only | M **4** keys mismatch | R B2–B5 consumer | E **PF > Settings** today | D **Generate Items** | K **broken** |

### `step_design_feedback`

| Q | Answer |
|---|--------|
| I | Feedback mode / pack structure | C — | P — | M `feedback_required` | R — | E brief + artefact | D page | K split from DA `feedback_display` |

### `step_generate_assessment_items`

| Q | Answer |
|---|--------|
| I | Count, formats, difficulty, coverage, stimulus, feedback, composition | C **1/9** | P **8** | M partial | R **B1–B10** | E PF + inheritance; Settings thin | D page, QA, feedback | K **broken** |

### `step_construct_learning_sequence`

| Q | Answer |
|---|--------|
| I | Duration, granularity, style | C ✓ | P `total_duration_minutes` **≠** | M duration + granularity | R WGC prune | E Settings | D page, deck, VLE | K duration mismatch |

### `step_design_page`

| Q | Answer |
|---|--------|
| I | Profile, tone, depth, examples, answer/marking/feedback inclusion | C 4 | P 4 (overlap 1) | M page factors | R B15 adequacy | E mixed PF/Settings | D render | K partial |

### Assembly / QA steps (12–17)

| Step | I | C | P | M | R | E | D | K |
|------|---|---|---|---|---|---|---|---|
| Slide deck, VLE, LO set | Sequence + materials | — | — | — | env guards | notes | page/export | — |
| Validate / Revise QA | QA criteria | — | — | — | — | prompt | assessment | — |
| Marking rubric | Rubric from blueprint | — | — | — | — | prompt | page | — |

---

## 10. Retirement / convergence criteria

### 10.1 Per-step convergence target

| Tier | Steps | Target state |
|------|-------|--------------|
| **Tier A — converged** | Normalize, Model Knowledge, Define LO | PF `userOptions` ⊆ pack controls; `filterUserOptionsExcludingPackKeys` sufficient; Settings = PF for tuning |
| **Tier B — partial** | DLA, Construct Sequence, Design Page, Gen Activity Materials | Add missing PF options **or** remove orphan controls; fix key names (`duration_minutes`) |
| **Tier C — divergent** | Design Assessment, Generate Assessment Items | Expand `stepParameterControls`; align mapping/PF/inheritance keys; then retire B2–B7 |
| **Tier D — no params** | Gen Learning Content, Feedback, assembly, QA | Document “artefact-driven, no step params” explicitly in pack |

### 10.2 Runtime retirement gates (B2–B7)

| Gate | Requirement |
|------|-------------|
| G1 | Every inherited field has `stepParameterControls` on **source** step with stable **key** |
| G2 | Generate-items controls cover inherited fields OR pack declares `inheritsFrom: step_design_assessment` policy |
| G3 | Unified Settings shows source + dependent fields without PF-only advanced toggle |
| G4 | Regression tests: item count, formats, difficulty, coverage unchanged |
| G5 | No title-string step matching — `canonical_step_id` only |

### 10.3 PF scaffold retirement (B10, B12)

| Scaffold | Retire when |
|----------|-------------|
| `withMcqDefaultFeedbackScaffold` | Pack prompt template or `defaultPromptNotes` includes MCQ feedback guidance by default |
| `withPageTaskModeScaffold` | DLA template encodes page-task mode from `activity_pattern_mix` / constraints |

---

## 11. Handoff recommendations to 23-4, 23-5, 23-6

| Slice | Actions from 23-3 |
|-------|-------------------|
| **23-4** Workflow vs step ownership | Duration key (`duration_minutes` vs `total_duration_minutes`); disambiguate `difficulty_level` / `coverage_breadth` across DLA vs DA; document `learner_level` ↔ `learnerLevel` |
| **23-5** Design Assessment | Full information-needs matrix §8.1; unify keys before runtime retirement; separate `feedback_display` vs `feedback_required` |
| **23-6** Pack metadata | Add DA + Gen `stepParameterControls` for PF-only ids; add DLA PF `activity_pattern_mix`; fix construct sequence PF id; Design Page optional controls; **do not** auto-promote mappingRules |

**23-2 linkage:** PF-only assessment fields should become **settings-only after synthesis** once metadata exists — stop brief re-ask (`mustAsk` changes).

**Order:** **23-5** semantics → **23-6** pack controls → **23-3 follow-up runtime charter** (inheritance retirement) — not before.

---

## 12. Verification

```bash
node --test tests/*.test.js
```

**Result (2026-05-18):** **188 passed**, 0 failed.

---

## Summary scorecard

| Metric | Value |
|--------|-------|
| Canonical LD steps | **17** |
| Steps with full PF ↔ Settings parity | **3** (Normalize, Model Knowledge, Define LO) |
| Steps with partial parity | **5** |
| Steps with strong PF/runtime divergence | **2** (DA, Gen Items) |
| Steps with no parameter surface | **7** |
| Runtime bespoke LD hooks (retirement candidates) | **15** (B1–B15) |
| Generic pack-driven mechanisms to preserve | **3** |

---

## References

- [`ld-semantics-matrix.md`](ld-semantics-matrix.md)  
- [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md)  
- [`context-files/ld-bespoke-pf-controls.md`](context-files/ld-bespoke-pf-controls.md)  
- [`context-files/ld-design-assessment-excerpts.md`](context-files/ld-design-assessment-excerpts.md)

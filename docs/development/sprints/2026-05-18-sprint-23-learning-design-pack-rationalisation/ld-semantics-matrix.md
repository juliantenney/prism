# LD pack semantics matrix — Sprint 23 Slice 23-1

**Date:** 2026-05-18  
**Slice:** 23-1 — LD pack inventory + semantics matrix  
**Status:** **Complete** (audit only — no pack or runtime edits)  
**Canonical source:** `domains/learning-design/domain-learning-design-step-patterns.md`  
**Runtime cross-check:** `app.js` (assessment inheritance, PF rendering, WGC pruning)

---

## 1. Inventory summary

| Surface | Count | Notes |
|---------|-------|--------|
| `requiredFactors` | **5** | Blocking essentials at brief time |
| `optionalFactors` | **8** | Including topology flags (`assessment_required`) |
| `refinementFactors` | **16** | Post-essentials; many `skipIfContextResolved` |
| `mappingRules` | **26** | Factor → workflow constraint ± stepParams |
| `workflowParameterControls` | **4** | All `elicitation: settings-only` |
| `stepParameterControls` | **25** | Across **8** canonical steps |
| PF sections with `userOptions` | **8** | See §5; several steps have `configurationMode: none` |
| `extraFields` | **1** | `delivery_context` (duplicate surface) |

**Steps with no `stepParameterControls`:** all pack steps except the eight in the index below — notably `step_generate_learning_content`, Design Feedback, Validate LD, etc.

---

## 2. Confirmed priority issues (assessment chain)

| # | Issue | Confirmed |
|---|--------|-----------|
| A | `step_design_assessment` has only **`activity_type`** + **`total_items`** in `stepParameterControls`; `mappingRules` also target **`coverage_scope`**, **`cognitive_demand`**, **`difficulty_profile`**, **`assessment_cadence`** | **Yes** |
| B | Design Assessment PF uses **`difficulty_level`** + **`coverage_breadth`**; `mappingRules` use **`difficulty_profile`** + **`coverage_scope`** on the same step | **Yes** — key vocabulary split |
| C | Generate Assessment Items inherits via **`resolveAssessmentItemsInheritedOptions`** reading PF keys **`difficulty_level`** / **`coverage_breadth`** from prior Design Assessment notes, not mapping target names | **Yes** — `app.js` ~3517–3524 |
| D | Brief factor **`assessment_type`** maps to step param **`activity_type`** | **Yes** |
| E | Brief **`assessment_total_items`** maps to **`total_items`** (design) and **`number_of_items`** (generate) | **Yes** |
| F | Workflow controls **`design_scope`** / **`input_strategy`** are `settings-only` but also **required** elicitation factors | **Yes** |
| G | **`assessment_required`** has no `mappingRule`; drives inference + WGC step inclusion only | **Yes** |

---

## 3. Assessment inheritance flow (runtime)

```text
Elicitation factors  →  mappingRules  →  workflowBriefResolution / stepParamPatch
                              ↓
Design Assessment step notes ([PRISM_STEP_PARAMS]: activity_type, difficulty_level, coverage_breadth, total_items, …)
                              ↓
resolveAssessmentItemsInheritedOptions (app.js)
  activity_type      → response_formats
  total_items        → number_of_items
  difficulty_level   → difficulty_profile   (mapper: introductory/moderate/advanced)
  coverage_breadth   → coverage_mode        (mapper: narrow/balanced/broad)
                              ↓
Generate Assessment Items PF / prompt (inherits unless “advanced options” shown)
```

**Gap:** Values written by mapping to `stepParams.step_design_assessment.difficulty_profile` / `.coverage_scope` may not populate the keys runtime inheritance reads (`difficulty_level`, `coverage_breadth`) unless brief patch and PF use the same storage path.

---

## 4. Semantics matrix — workflow & elicitation gate

| Semantic concern | Brief factor | Req / opt / ref | mappingRules target(s) | Workflow control? | Step control? | PF userOption? | Runtime bespoke? | Current owner | Proposed owner | Gap / duplication | Sprint recommendation |
|------------------|--------------|-----------------|------------------------|-------------------|---------------|----------------|------------------|---------------|----------------|---------------------|------------------------|
| Topic | `topic` | Required | `workflow…constraints.topic` | — | — | — | — | Elicitation | Elicitation (blocking) | None | Keep required; no Settings control needed |
| Learner level (brief) | `learner_level` | Required | `workflow…audience`, `step_define_learning_outcomes.learnerLevel` | — | `learnerLevel` (outcomes) | PF §4 `learnerLevel` | — | Elicitation + patch | Elicitation seeds; Settings tunes outcomes wording | Brief vs step enum mismatch (beginner…postgraduate vs school…professional) | **23-4:** document enum mapping; align or map explicitly |
| Design scope | `design_scope` | Required | `workflow…constraints.design_scope` | `design_scope` (settings-only) | — | — | WGC scope pruning | Elicitation + Settings | **Settings after synthesis**; elicitation init only | Asked at elicitation and editable in Settings | **23-2:** mark elicitation as init; rely on Settings for retune |
| Delivery pattern | `delivery_pattern` | Required | `workflow…constraints.delivery_pattern` | — | — | — | WGC / pack graph | Elicitation + constraint | Elicitation | No Settings control | **23-6:** consider workflow control or settings-only if retune needed |
| Input strategy | `input_strategy` | Required | `workflow…constraints.input_strategy` | `input_strategy` (settings-only) | — | — | WGC starting artefact | Elicitation + Settings | Settings after synthesis | Duplicate with required elicitation | **23-2:** same as design_scope |
| Session duration | `duration_minutes` | Optional | `workflow…duration_minutes`, `step_construct_learning_sequence.duration_minutes` | `duration_minutes` | `duration_minutes` (sequence step) | PF §10 `total_duration_minutes` | — | Elicitation + dual step/workflow | Settings (workflow + sequence) | **Three keys:** `duration_minutes` vs `total_duration_minutes` | **23-4/23-6:** unify param key naming in pack |
| Delivery mode | `delivery_mode` | Optional | `workflow…delivery_mode` | — | — | — | inferenceRules | Elicitation | Constraint only | No control | Charter if retune needed |
| Delivery context | `delivery_context` | Optional + **extraFields** | `workflow…delivery_context` | `delivery_context` | — | — | inferenceRules | Elicitation + Settings + extra field | Settings | Triple surface (optional, extraFields, control) | **23-6:** collapse to workflow control + mapping |
| Session materials | `session_materials` | Optional | `workflow…`, `step_generate_activity_materials.session_materials` | — | `session_materials` | PF §6 none | — | Elicitation + step Settings | Step Settings | PF has no userOptions (mode none) | OK if Settings-only post-synthesis |
| Page profile (brief) | `page_profile` | Optional | `workflow…`, `step_design_page.page_profile` | — | `page_profile` (elicited) | PF §13 `page_profile` | — | Elicitation + step | Step Settings + PF | Brief optional vs step elicited | **23-2:** classify `page_profile` elicitation burden |
| Assessment required (topology) | `assessment_required` | Optional boolean | **None** | — | — | — | inferenceRules; WGC step filter | Elicitation / inference | Elicitation gate only | No mapped constraint key | **23-2:** document as graph gate, not parameter |
| Learning environments | `learning_environments` | Optional | `workflow…learning_environments` | — | — | — | WGC; pack guidance | Elicitation | Constraint | No control | Keep unless Settings needed |
| Assessment strategy | `assessment_strategy` | Optional | `workflow…assessment_strategy` | — | — | — | intentClasses | Elicitation | Workflow constraint | No control | **23-5:** link to assessment pack intent |

---

## 5. Semantics matrix — assessment (priority)

| Semantic concern | Brief factor | Req / opt / ref | mappingRules target(s) | Workflow control? | Step control? | PF userOption? | Runtime bespoke? | Current owner | Proposed owner | Gap / duplication | Sprint recommendation |
|------------------|--------------|-----------------|------------------------|-------------------|---------------|----------------|------------------|---------------|----------------|---------------------|------------------------|
| Assessment type / question strategy | `assessment_type` (ref, mustAsk) | Refinement | `constraints.assessment_type`, `step_design_assessment.**activity_type**` | — | `activity_type` (DA, elicited) | DA: `activity_type` | Inheritance: → `response_formats` | Elicitation + DA step + runtime mapper | **DA step Settings** + pack mapping alias doc | Factor name ≠ param name | **23-5:** document alias; consider rename in 23-6 |
| Total item count | `assessment_total_items` (ref, mustAsk) | Refinement | `constraints…`, `DA.**total_items**`, `generate.**number_of_items**` | — | DA: `total_items` (advanced); Gen: `number_of_items` (elicited) | DA: `total_items`; Gen: `number_of_items` | Inheritance: total_items → number_of_items | Elicitation + both steps | **DA owns blueprint count**; Gen inherits | Asked in refinement + two step controls | **23-5:** single authority on DA; Gen settings-only inherit |
| Coverage scope (brief) | `coverage_scope` | Refinement | `constraints.coverage_scope`, `DA.**coverage_scope**` | — | **Missing** on DA | DA: **`coverage_breadth`** | Maps `coverage_breadth` → `coverage_mode` (gen) | mappingRules vs PF key split | **Add step control `coverage_scope` OR rename mapping to `coverage_breadth`** | Rules target ≠ PF ≠ inheritance | **23-5 / 23-6:** align keys end-to-end |
| Cognitive demand | `cognitive_demand` | Refinement | `constraints…`, `DA.**cognitive_demand**` | — | **Missing** | **Missing** on DA | — | mappingRules only | **DA step control** or workflow constraint | Mapped but no UI | **23-5:** add control or drop mapping |
| Difficulty distribution (brief) | `difficulty_profile` | Refinement | `constraints…`, `DA.**difficulty_profile**`, `generate.**difficulty_profile**` | — | **Missing** on DA | DA: **`difficulty_level`**; Gen: `difficulty_profile` | DA `difficulty_level` → gen `difficulty_profile` | Triple vocabulary | **Unify on `difficulty_profile` or document two-layer model** | profile vs level vs PF id | **23-5:** highest priority rename alignment |
| Response mode mix | `question_style_mix` | Refinement | `constraints…`, `generate.**question_style_mix**` | — | **Missing** | Gen PF only (not in excerpted controls) | — | Brief + generate step | Gen step Settings | No design-step control | **23-5:** optional step control on generate |
| Feedback mode (brief) | `feedback_required` | Refinement | `constraints…`, `step_design_feedback.feedback_required` | — | — | DA: **`feedback_display`** (different semantics) | — | Split across feedback step vs DA PF | **Design Feedback step** owns; DA display mode separate | Different names and steps | **23-5:** semantics matrix row for feedback chain |
| Assessment cadence | `assessment_cadence` | Refinement | `constraints…`, `DA.**assessment_cadence**` | — | **Missing** | **Missing** | — | mappingRules only | **DA control** or workflow-only | No UI | **23-5 / 23-6** |
| Design Assessment blueprint | — | — | — | — | 2 controls only | 5 userOptions | PF simple mode | PF + partial Settings | **Pack metadata** owns all DA tunables | Settings ⊂ PF | **23-5** then **23-6** expand controls |
| Generate assessment items | — | — | brief patch per step | — | `number_of_items` only | 8+ userOptions | **Full inheritance stack** in app.js | PF + bespoke runtime | **Pack + generic inheritance policy** | Most PF options hidden until advanced toggle | **23-3:** audit; **23-5:** parity before runtime retirement |
| Inherited gen fields | — | — | — | — | — | `response_formats`, `difficulty_profile`, `coverage_mode`, … | `resolveAssessmentItemsInheritedOptions` | Runtime | **Pack-declared cross-step mapping** | Not in stepParameterControls | **23-3 / 23-5** charter runtime only after pack parity |

---

## 6. Semantics matrix — activity design & sequencing

| Semantic concern | Brief factor | Req / opt / ref | mappingRules target(s) | Workflow control? | Step control? | PF userOption? | Runtime bespoke? | Current owner | Proposed owner | Gap / duplication | Sprint recommendation |
|------------------|--------------|-----------------|------------------------|-------------------|---------------|----------------|------------------|---------------|----------------|---------------------|------------------------|
| Activity pattern mix | `activity_pattern_mix` | Refinement | `constraints…`, `step_design_learning_activities.activity_pattern_mix` | — | `activity_pattern_mix` | **Not in PF §5** | — | Settings + mapping | Step Settings (PF template silent) | Control exists; PF doesn't expose | **23-6:** add PF option or remove unused control |
| Grouping preference | — | — | — | — | `grouping_preference` | PF §5 | — | Step Settings + PF | Step Settings | Duplicated PF + pack control | **23-3:** filterUserOptionsExcludingPackKeys handles overlap |
| Activity difficulty | — | — | — | — | `difficulty_level` (activities) | PF §5 `difficulty_level` | — | Step Settings + PF | Step Settings | Same key as DA PF id, **different step** | **23-4:** disambiguate in docs |
| Activity coverage breadth | — | — | — | — | `coverage_breadth` (activities) | PF §5 | — | Step Settings + PF | Step Settings | Same id family as DA `coverage_breadth` | **23-4:** namespace by canonical step |
| Sequencing granularity | `sequencing_granularity` | Refinement | `constraints…`, `step_construct_learning_sequence.sequencing_granularity` | — | `sequencing_granularity` | **Not in PF §10** | WGC prune sequence | Settings + mapping | Step Settings | PF missing option | **23-6** |
| Sequencing style | — | — | — | — | `sequencing_style` | PF §10 `sequencing_style` | — | Settings + PF | Step Settings | OK | **23-3** audit overlap |
| Sequence duration | `duration_minutes` | Optional + ref context | see workflow row | — | `duration_minutes` (sequence) | PF `total_duration_minutes` | — | Split keys | Unify `duration_minutes` | PF id ≠ control key | **23-4** |

---

## 7. Semantics matrix — page & content steps

| Semantic concern | Brief factor | Req / opt / ref | mappingRules target(s) | Workflow control? | Step control? | PF userOption? | Runtime bespoke? | Current owner | Proposed owner | Gap / duplication | Sprint recommendation |
|------------------|--------------|-----------------|------------------------|-------------------|---------------|----------------|------------------|---------------|----------------|---------------------|------------------------|
| Normalize structure | — | — | — | — | `structure_mode`, `detail_level`, `keep_examples` | PF §1 (same ids) | — | Settings + PF | Step Settings | Aligned | Good reference pattern |
| Model knowledge flags | — | — | — | — | 3 booleans | PF §3 (same ids) | — | Settings + PF | Step Settings | Aligned | Good reference pattern |
| Learning outcomes params | — | — | `learner_level` → `learnerLevel` | — | 4 controls | PF §4 (same ids) | — | Settings + PF | Step Settings | Brief learner_level enums differ | **23-4** |
| Page tone / depth / examples | `tone_style`, `depth_level`, `include_examples`, etc. | Refinement | page stepParams + constraints | — | settings-only on page | PF §13 partial | — | Refinement + Settings | **Settings-only** post-synthesis | Elicitation may re-ask | **23-2** |
| Page profile (step) | `page_profile` | Optional | see above | — | elicited | PF §13 | — | Mixed | Step Settings | — | **23-2** |
| Page assembly extras | — | — | — | — | — | `include_answers`, etc. | — | PF only | PF / Edit | No Settings metadata | **23-6** if tunable in Settings |
| Generate learning content | — | — | — | — | **None** | **None** | WGC prune | Step only | — | No parameter surfaces | Document intentional gap |

---

## 8. PF `userOptions` inventory (by pack section)

| Pack § | Step (canonical) | `configurationMode` | userOption ids | Overlap with `stepParameterControls` |
|--------|------------------|----------------------|----------------|--------------------------------------|
| §1 Normalize | `step_normalize_content` | simple | `structure_mode`, `detail_level`, `keep_examples` | **Full overlap** |
| §2 Generate Learning Content | `step_generate_learning_content` | (template only) | **None** | None declared |
| §3 Model Knowledge | `step_model_knowledge` | simple | `include_relationships`, `include_misconceptions`, `include_processes` | **Full overlap** |
| §4 Define LO | `step_define_learning_outcomes` | simple | `learnerLevel`, `numberOfOutcomes`, `cognitiveEmphasis`, `scope` | **Full overlap** |
| §5 Design Activities | `step_design_learning_activities` | simple | `grouping_preference`, `difficulty_level`, `coverage_breadth` | **Missing `activity_pattern_mix`** in PF |
| §6 Gen Activity Materials | `step_generate_activity_materials` | **none** | — | `session_materials` in Settings only |
| §7 Design Assessment | `step_design_assessment` | simple | `activity_type`, `feedback_display`, `difficulty_level`, `coverage_breadth`, `total_items` | **Partial** (2/5 in Settings metadata) |
| §8 Design Feedback | — | none | — | — |
| §9 Generate Items | `step_generate_assessment_items` | simple | `number_of_items`, `response_formats`, `composition_mode`, `stimulus_mode`, `scenario_scope`, `cognitive_emphasis`, `difficulty_profile`, `feedback_mode`, `coverage_mode` | **Partial** (`number_of_items` only) |
| §10 Construct Sequence | `step_construct_learning_sequence` | simple | `total_duration_minutes`, `sequencing_style` | **Partial** (`sequencing_style` only; duration key mismatch) |
| §13 Design Page | `step_design_page` | none | `page_profile`, `include_answers`, `include_marking_guidance`, `include_feedback_guidance` | **Partial** (`page_profile` only) |

---

## 9. Runtime bespoke logic (LD assessment-related)

| Location (app.js) | Behaviour | Sprint 23 note |
|-------------------|-----------|----------------|
| `isGenerateAssessmentItemsContext` (~1065) | Title/canonical detection | Duplicate of inner `isGenerateAssessmentItemsStep` (~4564) |
| `resolveAssessmentItemsInheritedOptions` (~3473) | Walk-back to Design Assessment; map 4 fields | **Core bespoke inheritance** — retire only after pack parity |
| `mapDesignAssessment*` (~1085–1118) | Value vocabulary translation | Move to pack mapping table in **23-6** |
| `renderWorkflowStepPromptConfigUI` (~3612–3665) | Inherited notice + advanced toggle | UX bespoke; Settings may subsume |
| `applyWorkflowStepPromptDefaults` (~4053) | Applies inherited options to prompt | Tied to inheritance |
| WGC filter `design assessment` (~10870) | Drops DA step under intent | Topology — document vs `assessment_required` |
| `filterUserOptionsExcludingPackKeys` | Suppresses PF options owned by pack | **Generic** — keep |

---

## 10. `stepParameterControls` index (all 25)

| canonicalStepId | Keys | Primary `elicitation` |
|-----------------|------|------------------------|
| `step_design_page` | page_profile, tone_style, depth_level, include_examples | mixed |
| `step_design_assessment` | activity_type, total_items | elicited + settings-only |
| `step_generate_assessment_items` | number_of_items | elicited |
| `step_normalize_content` | structure_mode, detail_level, keep_examples | settings-only |
| `step_model_knowledge` | include_relationships, include_misconceptions, include_processes | settings-only |
| `step_define_learning_outcomes` | learnerLevel, numberOfOutcomes, cognitiveEmphasis, scope | settings-only |
| `step_design_learning_activities` | activity_pattern_mix, grouping_preference, difficulty_level, coverage_breadth | settings-only |
| `step_generate_activity_materials` | session_materials | settings-only |
| `step_construct_learning_sequence` | duration_minutes, sequencing_granularity, sequencing_style | settings-only |

---

## 11. Slice 23-1 conclusions

1. **Assessment is the highest-friction zone:** four naming families coexist (brief factors, mapping `stepParams` paths, PF `userOptions` ids, runtime inherited ids).
2. **Settings metadata is not a complete view of pedagogy:** Design Assessment and Generate Items expose more in PF than in `stepParameterControls`; inheritance hides PF fields until “advanced options”.
3. **Elicitation duplicates workflow Settings** for `design_scope`, `input_strategy`, `delivery_context`, `duration_minutes` — supports Sprint 23 thesis (init vs authority).
4. **`mappingRules` must not be auto-promoted** to controls (Sprint 22 rule) — several mapped DA params have **no** control; promotion would be a **chartered pack edit** in 23-6, not runtime synthesis.
5. **No runtime or pack changes in 23-1** — downstream slices: **23-2** elicitation, **23-3** PF audit, **23-4** ownership, **23-5** Design Assessment, **23-6** pack edits.

---

## 12. Verification

```bash
node --test tests/*.test.js
```

**Result (2026-05-18):** **188 passed**, 0 failed (floor ≥ 185).

---

## References

- Sprint 23 context snapshots: [`context-files/`](context-files/)
- Slice charter: [`slice-23-1-charter.md`](slice-23-1-charter.md)
- Sprint 22 Settings baseline: [`../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md)

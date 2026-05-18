# Design Assessment semantics — Sprint 23 Slice 23-5

**Date:** 2026-05-18  
**Slice:** 23-5 — Design Assessment semantics  
**Status:** **Complete** (documentation/governance only — no pack or runtime edits)  
**Canonical step:** `step_design_assessment` (pack title: **Design Assessment**)  
**Downstream inheritor:** `step_generate_assessment_items` (Generate Assessment Items)

**Baselines:** [`ld-semantics-matrix.md`](ld-semantics-matrix.md) · [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md) · [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md) · [`ld-parameter-ownership-model.md`](ld-parameter-ownership-model.md)

**Pack source:** `domains/learning-design/domain-learning-design-step-patterns.md` §7 (Design Assessment), §9 (Generate Assessment Items), `workflowBriefConfig`

---

## 1. Objective and constraints

### Objective

Produce an **authoritative Design Assessment (DA) semantics model** that resolves:

- Assessment vocabulary across brief, constraints, step params, PF, prompt placeholders, and runtime inheritance  
- **Ownership** (DA authority vs Generate Items realisation)  
- **Inheritance** defaults and override semantics  
- **Settings metadata targets** for Slice **23-6**  
- **Regression expectations** for a future runtime parity charter  

### Constraints (honoured)

| Constraint | Status |
|------------|--------|
| No pack metadata edits | ✓ |
| No runtime behaviour changes | ✓ |
| Preserve inheritance helpers until parity gates | ✓ |
| No PF/Settings removal or redesign | ✓ |
| No `mappingRules` auto-promotion | ✓ |
| Research packs frozen | ✓ |

---

## 2. Approved assessment authority model

```text
                    ┌─────────────────────────────┐
                    │  Elicitation (initialise)    │
                    │  assessment_required (gate)  │
                    │  assessment_type, total, …   │
                    └──────────────┬──────────────┘
                                   │ mappingRules @ synthesis
                                   ▼
┌──────────────────────────────────────────────────────────────┐
│  DESIGN ASSESSMENT (step_design_assessment)                   │
│  Canonical authority: assessment_blueprint semantics          │
│  Artefact: assessment_blueprint, coverage_map, difficulty_*   │
│  Params: activity_type, total_items, coverage, difficulty, …  │
└──────────────────────────────┬───────────────────────────────┘
                               │ default inheritance
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  GENERATE ASSESSMENT ITEMS (step_generate_assessment_items)   │
│  Realisation: concrete assessment_items                       │
│  Params: formats, stimulus, per-item feedback, count override │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    Design Feedback, Design Page, QA, Rubric
                    (artefact consumers — not assessment authority)
```

| Rule | Statement |
|------|-----------|
| A1 | **DA** owns **what** is assessed (type, coverage, difficulty policy, item count, blueprint structure). |
| A2 | **Generate Items** owns **how items are generated** (formats mix, stimulus mode, composition, item-level feedback presentation) subject to blueprint. |
| A3 | **Settings** is operational authority **after synthesis** for pack-declared controls on included steps. |
| A4 | **Runtime inheritance** (current `app.js`) is **normative interim behaviour** until 23-6 metadata + later runtime charter. |

---

## 3. Current assessment surfaces

| Surface | DA coverage today | Gen Items coverage today |
|---------|-------------------|---------------------------|
| `requiredFactors` / `optionalFactors` | via `assessment_required`, `assessment_strategy` | — |
| `refinementFactors` | `assessment_type`, `assessment_total_items`, `coverage_scope`, `cognitive_demand`, `difficulty_profile`, `assessment_cadence`, `question_style_mix` (Gen only in mapping) | `question_style_mix` → Gen step only |
| `mappingRules` | 6 factors touch DA `stepParams` | 3 factors touch Gen `stepParams` |
| `stepParameterControls` | **2** keys: `activity_type`, `total_items` | **1** key: `number_of_items` |
| PF `userOptions` | **5** ids | **9** ids |
| Prompt template `{{option:*}}` | 5 placeholders | many in template body |
| Runtime inheritance | — | **4** inherited fields from DA walk-back |
| Unified Settings | 2 DA + 1 Gen visible groups | PF advanced toggle for rest |

---

## 4. Design Assessment information-needs matrix

| # | Information need | Blueprint role | Brief factor | Constraint | Target `stepParams` key (DA) | PF id (current) | Settings (current) | Belongs on |
|---|------------------|----------------|--------------|------------|------------------------------|-----------------|----------------------|------------|
| 1 | Question / response strategy | `assessment_blueprint` type | `assessment_type` | `assessment_type` | **`activity_type`** | `activity_type` | ✓ elicited | **DA** |
| 2 | Total items in blueprint | `total_items` | `assessment_total_items` | `assessment_total_items` | **`total_items`** | `total_items` | ✓ advanced | **DA** |
| 3 | Topic coverage breadth | `coverage_map` | `coverage_scope` | `coverage_scope` | **`coverage_scope`** | `coverage_breadth` | — | **DA** |
| 4 | Overall difficulty policy | `difficulty_profile.item_counts` | `difficulty_profile` | `difficulty_profile` | **`difficulty_profile`** | `difficulty_level` | — | **DA** |
| 5 | Cognitive demand emphasis | blueprint emphasis | `cognitive_demand` | `cognitive_demand` | **`cognitive_demand`** | — | — | **DA** |
| 6 | Assessment cadence (module scope) | design_rationale | `assessment_cadence` | `assessment_cadence` | **`assessment_cadence`** | — | — | **DA** |
| 7 | Answer / feedback display plan | prompt-shaping only | — | — | **`feedback_display`** | `feedback_display` | — | **DA** (not Design Feedback) |
| 8 | Whether assessment exists | topology | `assessment_required` | — | — | — | — | **Topology** |
| 9 | Formative/summative stance | constraint context | `assessment_strategy` | `assessment_strategy` | — | — | — | **Workflow** |

**Output artefact keys (DA step):** `assessment_blueprint`, `coverage_map`, `difficulty_profile` (JSON with `item_counts`: recall, comprehension, application, analysis), `design_rationale`.

---

## 5. Generate Assessment Items inheritance matrix

### 5.1 Normative inheritance (approved doctrine)

| Generate Items param | Default source (DA) | DA source key (runtime reads today) | When override applies |
|----------------------|---------------------|-------------------------------------|------------------------|
| `response_formats` | DA question strategy | `activity_type` | Gen step param set explicitly **and** differs from brief-mapped value, or advanced toggle on |
| `number_of_items` | DA blueprint count | `total_items` | Same |
| `difficulty_profile` | DA difficulty policy | `difficulty_level` (PF) → mapped | Same |
| `coverage_mode` | DA coverage | `coverage_breadth` (PF) → mapped | Same |

### 5.2 Runtime value translation (preserved — `app.js`)

**`activity_type` → `response_formats`**

| DA `activity_type` | Gen `response_formats` |
|------------------|------------------------|
| mcq | single_answer_mcq |
| short_answer | short_answer |
| essay | essay |
| problem | short_answer |
| case_study | essay |
| mixed | all_formats_mix |

**`difficulty_level` → `difficulty_profile` (Gen enum)**

| DA PF `difficulty_level` | Gen `difficulty_profile` |
|--------------------------|--------------------------|
| introductory | foundational |
| moderate | balanced |
| advanced | higher_order |

**`coverage_breadth` → `coverage_mode`**

| DA PF `coverage_breadth` | Gen `coverage_mode` |
|--------------------------|---------------------|
| narrow | selected_themes |
| balanced | balanced |
| broad | broad_coverage |

### 5.3 Explicit override semantics

| State | Behaviour |
|-------|-----------|
| **Default** | Generate Items effective params = inheritance ∪ brief patch; inherited keys hidden in PF UI |
| **Advanced override** | User enables `assessmentItemsShowAdvancedOptions`; Gen PF shows inherited keys; explicit values win over inheritance |
| **Settings (today)** | Only `number_of_items` in unified Settings; changing it does **not** automatically sync DA `total_items` unless user saves both |
| **Target (post-23-6)** | Settings on Gen shows inherited values as read-only hints; overrides only on Gen keys |

### 5.4 What does **not** inherit (Gen-owned)

| Gen param | Rationale |
|-----------|-----------|
| `composition_mode` | Item-set structure, not blueprint |
| `stimulus_mode`, `scenario_scope` | Item generation mechanics |
| `cognitive_emphasis` | Per-item emphasis, not blueprint policy |
| `feedback_mode` | Per-item learner feedback, distinct from DA `feedback_display` |
| `question_style_mix` | Brief maps to Gen only; operational mix |

---

## 6. Assessment vocabulary alignment

### 6.1 Priority decisions (formalised)

| Question | **Decision (23-5)** | Rationale |
|----------|---------------------|-----------|
| `assessment_type` vs `activity_type` | **Keep alias** — brief factor `assessment_type` → step param **`activity_type`** | mappingRule already documents; renaming brief factor is high churn; **step key is canonical** |
| `difficulty_level` vs `difficulty_profile` | **Canonical: `difficulty_profile`** on DA step | Matches brief factor, constraint, output JSON, Gen param; PF `difficulty_level` is legacy |
| `coverage_breadth` vs `coverage_scope` | **Canonical: `coverage_scope`** on DA step | Matches brief + mapping; Gen keeps **`coverage_mode`** as consumer key |
| `total_items` vs `number_of_items` | **`total_items` = DA**; **`number_of_items` = Gen** | Same integer semantics; Gen inherits default |
| `cognitive_demand`, `assessment_cadence` | **DA step controls** (23-6) | mappingRules target DA only; blueprint/planning semantics |
| `feedback_display` vs `feedback_required` | **Separate semantics** — see §6.3 | Different steps and purposes |
| Inherited vs override | **Inherit by default; explicit Gen override wins** | §5.3 |
| DA vs Gen scope | **DA = blueprint authority; Gen = item realisation** | §2 |

### 6.2 Three-layer difficulty vocabulary (must align in 23-6)

| Layer | Vocabulary | Used for |
|-------|------------|----------|
| **Brief refinement** `difficulty_profile` | `foundation_heavy`, `balanced`, `higher_order_heavy` | Elicitation / constraint |
| **DA PF (legacy)** `difficulty_level` | `introductory`, `moderate`, `advanced` | PF + runtime inheritance read |
| **Gen PF** `difficulty_profile` | `foundational`, `balanced`, `higher_order` | Item generation |
| **DA output JSON** `difficulty_profile.item_counts` | recall, comprehension, application, analysis | Blueprint structure |

**23-6 recommendation:** Single DA control `difficulty_profile` with select options that map to brief values **and** to Gen `foundational` / `balanced` / `higher_order` via documented value map in pack (not runtime ad hoc).

### 6.3 `feedback_display` vs `feedback_required`

| Aspect | `feedback_display` (DA) | `feedback_required` (brief → Design Feedback) |
|--------|-------------------------|-----------------------------------------------|
| **Step** | Design Assessment | Design Feedback (`step_design_feedback`) |
| **Purpose** | How answers/display are **planned in blueprint** (grid at end, etc.) | Whether workflow produces **feedback_pack** artefact |
| **mappingRules** | — | `constraints.feedback_required`, `step_design_feedback.feedback_required` |
| **Affects** | DA prompt + page render hints | Inclusion of Design Feedback step |
| **23-6** | DA `stepParameterControls.feedback_display` | Keep on feedback step / constraint only |

### 6.4 Coverage vocabulary

| Layer | Values |
|-------|--------|
| Brief `coverage_scope` | `selected_themes`, `balanced`, `broad_coverage` |
| DA target `coverage_scope` | same as brief (canonical) |
| DA PF (legacy) `coverage_breadth` | `narrow`, `balanced`, `broad` |
| Gen `coverage_mode` | `selected_themes`, `balanced`, `broad_coverage` |

**23-6:** Unify DA on `coverage_scope` with brief-aligned option values; runtime mapper updated only in **later runtime charter** to read `coverage_scope` instead of `coverage_breadth`.

---

## 7. Prompt template placeholder mapping

### 7.1 Design Assessment template (`{{option:…}}`)

| Placeholder | Current PF id | Target stepParam key | Notes |
|-------------|---------------|----------------------|--------|
| `{{option:activity_type}}` | `activity_type` | `activity_type` | Aligned |
| `{{option:feedback_display}}` | `feedback_display` | `feedback_display` | Prompt-shaping only per template |
| `{{option:difficulty_level}}` | `difficulty_level` | **`difficulty_profile`** | **Rename placeholder in 23-6** to `{{option:difficulty_profile}}` |
| `{{option:coverage_breadth}}` | `coverage_breadth` | **`coverage_scope`** | **Rename to `{{option:coverage_scope}}`** |
| `{{option:total_items}}` | `total_items` | `total_items` | Aligned |

**Output JSON** uses `difficulty_profile` with `item_counts` keys (recall, comprehension, application, analysis) — distinct from select-level “overall difficulty” but same field name family.

### 7.2 Generate Assessment Items

Template references `assessment_type` in prose constraints (MCQ enforcement) — reads **workflow constraints**, not only step params. Gen placeholders use PF ids (`response_formats`, etc.) — inherit effective values per §5.

---

## 8. Settings metadata target model (23-6)

### 8.1 Design Assessment — target `stepParameterControls`

| key | controlType | elicitation | advanced | Maps from brief | PF id after 23-6 |
|-----|-------------|-------------|----------|-----------------|------------------|
| `activity_type` | select | elicited | false | `assessment_type` | `activity_type` |
| `total_items` | number | settings-only | true | `assessment_total_items` | `total_items` |
| `coverage_scope` | select | settings-only | false | `coverage_scope` | `coverage_scope` |
| `difficulty_profile` | select | settings-only | false | `difficulty_profile` | `difficulty_profile` |
| `cognitive_demand` | select | settings-only | true | `cognitive_demand` | `cognitive_demand` |
| `assessment_cadence` | select | settings-only | true | `assessment_cadence` | `assessment_cadence` |
| `feedback_display` | select | settings-only | true | — | `feedback_display` |

**Remove PF-only ids** `difficulty_level`, `coverage_breadth` after controls + template placeholders align.

### 8.2 Generate Assessment Items — target `stepParameterControls`

| key | elicitation | advanced | Ownership |
|-----|-------------|----------|-----------|
| `number_of_items` | settings-only | false | Gen; default inherits `total_items` |
| `response_formats` | settings-only | true | Gen; default inherits from `activity_type` |
| `difficulty_profile` | settings-only | true | Gen; default inherits from DA |
| `coverage_mode` | settings-only | true | Gen; default inherits from DA |
| `composition_mode` | settings-only | true | Gen-only |
| `stimulus_mode` | settings-only | true | Gen-only |
| `scenario_scope` | settings-only | true | Gen-only |
| `cognitive_emphasis` | settings-only | true | Gen-only |
| `feedback_mode` | settings-only | true | Gen-only |
| `question_style_mix` | settings-only | false | Gen-only (brief-mapped) |

**Do not** duplicate DA authority keys on Gen with same semantics — use inheritance metadata in pack policy (23-6) instead.

---

## 9. Elicitation and topology interaction

| Factor | Role | Interaction with DA |
|--------|------|---------------------|
| `assessment_required` | **Topology gate** | Determines assessment steps in graph; gates refinement asks |
| `assessment_type` | **Initializer** | Maps to `activity_type`; **mustAsk** today — defer repeat in 23-6 when DA param set |
| `assessment_total_items` | **Initializer** | Maps to `total_items` + constraint; defer repeat when set |
| `coverage_scope`, `difficulty_profile`, `cognitive_demand` | **Initializer / defer** | Map to DA; skip refinement when `skipIfContextResolved` + param populated |
| `assessment_cadence` | **Initializer** | Module/sequence scope only (`askWhenDesignScopeIn`) |
| `question_style_mix` | **Gen initializer** | Not DA — maps only to Gen step |
| `feedback_required` | **Feedback step** | Not DA display semantics |

**WGC interaction:** Title match `design assessment` may **exclude** DA step when items requested without blueprint intent (`app.js` ~10870) — document as topology, not parameter conflict.

---

## 10. Runtime preservation and retirement gates

### 10.1 Preserve until parity (no change in 23-5)

| Component | Location |
|-----------|----------|
| `resolveAssessmentItemsInheritedOptions` | `app.js` ~3473 |
| `mapDesignAssessmentActivityTypeToResponseFormats` | ~1085 |
| `mapDesignAssessmentDifficultyToItemsDifficultyProfile` | ~1099 |
| `mapDesignAssessmentCoverageToItemsCoverageMode` | ~1110 |
| PF inherited notice + advanced toggle | ~3612–3665 |
| `applyWorkflowStepPromptDefaults` inheritance branch | ~4053 |

### 10.2 Retirement gates (future runtime charter)

| Gate | Criterion |
|------|-----------|
| G1 | DA `stepParameterControls` includes all keys in §8.1 |
| G2 | PF `userOptions` ids match control keys (`filterUserOptionsExcludingPackKeys` hides duplicates) |
| G3 | Pack documents inheritance policy (source step, field map) |
| G4 | Unified Settings shows DA authority fields on DA card |
| G5 | Regression tests §12 pass with runtime inheritance **removed or delegated to generic engine** |
| G6 | Step notes use **canonical keys** (`coverage_scope`, `difficulty_profile`) so inheritance reads mapping targets |

---

## 11. Pack metadata recommendations for 23-6

Ordered change list — **author manually in 23-6**; not auto-generated from mappingRules.

### 11.1 `stepParameterControls` — Design Assessment (add)

| Action | key | Notes |
|--------|-----|--------|
| Keep | `activity_type` | Align elicitation → `settings-only` after first brief capture (optional) |
| Keep | `total_items` | |
| **Add** | `coverage_scope` | Options from brief `coverage_scope` choices |
| **Add** | `difficulty_profile` | Unified enum map brief ↔ Gen |
| **Add** | `cognitive_demand` | Options from brief |
| **Add** | `assessment_cadence` | Options from brief |
| **Add** | `feedback_display` | Move from PF-only |

### 11.2 PF §7 Design Assessment

| Action | Detail |
|--------|--------|
| Rename | `difficulty_level` → `difficulty_profile` in `userOptions` |
| Rename | `coverage_breadth` → `coverage_scope` |
| Update | `promptTemplate` placeholders to match |
| Align | `userOptions` ids === `stepParameterControls` keys |

### 11.3 `stepParameterControls` — Generate Assessment Items (add)

| Action | key |
|--------|-----|
| Keep | `number_of_items` (change elicitation to `settings-only`) |
| **Add** | `response_formats`, `difficulty_profile`, `coverage_mode` |
| **Add** | `composition_mode`, `stimulus_mode`, `scenario_scope`, `cognitive_emphasis`, `feedback_mode` |
| **Add** | `question_style_mix` |

### 11.4 `mappingRules`

| Action | Detail |
|--------|--------|
| Keep | `assessment_type` → `activity_type` alias |
| Verify | `difficulty_profile` maps to DA + Gen with **same canonical key** after PF rename |
| No auto-add | Do not create controls from rules alone |

### 11.5 `refinementFactors`

| Action | Factor |
|--------|--------|
| Set `mustAsk: false` | `assessment_type`, `assessment_total_items` when DA params resolvable |
| Rely on `skipIfContextResolved` | `coverage_scope`, `difficulty_profile`, `cognitive_demand` |

### 11.6 Pack policy block (recommended)

Add short `assessmentPolicy` (or comment in pack) declaring:

- `authorityStep: step_design_assessment`  
- `inheritance[]` rows matching §5.1  
- `overridePrecedence: explicit_downstream_wins`

---

## 12. Test expectations / regression cases

For **later runtime parity charter** (tests may not exist yet for all paths).

| ID | Scenario | Setup | Expected |
|----|----------|-------|----------|
| T1 | Default inheritance | WF with DA then Gen; DA notes `activity_type=mcq`, `total_items=10`, `difficulty_level=moderate`, `coverage_breadth=balanced` | Gen effective `response_formats=single_answer_mcq`, `number_of_items=10`, `difficulty_profile=balanced`, `coverage_mode=balanced` |
| T2 | Override item count | Gen `number_of_items=5` explicit, advanced on | Effective count **5** despite DA `total_items=10` |
| T3 | Override activity type | Gen sets `response_formats` explicitly | Overrides inherited MCQ mapping |
| T4 | No DA step | Gen only workflow | No inheritance walk; brief patch only |
| T5 | Settings DA controls | Change `activity_type` in unified Settings, save | DA notes updated; Gen inheritance on next PF open reflects change |
| T6 | Canonical keys post-23-6 | DA notes use `coverage_scope`, `difficulty_profile` | Runtime reads same keys (after mapper update) |
| T7 | Brief alias | `assessment_type=essay` in resolution | DA `activity_type=essay` |
| T8 | Unified Settings badge | LD 6-step WF with DA | DA section shows **7** controls (post-23-6), not **2** |
| T9 | mapping vs notes mismatch | mapping writes `difficulty_profile` but notes have only `difficulty_level` | Document as known failure mode until 23-6 |

**Existing tests to keep green:** `tests/unified-workflow-settings.test.js`, `tests/workflow-step-parameter-controls.test.js`, full suite **188+**.

---

## 13. Verification

```bash
node --test tests/*.test.js
```

**Result (2026-05-18):** **188 passed**, 0 failed.

---

## Authoritative summary table (DA semantic row)

| Semantic | Canonical owner | Canonical DA key | Brief alias | Gen inherited param |
|----------|-----------------|------------------|-------------|---------------------|
| Question strategy | DA | `activity_type` | `assessment_type` | `response_formats` |
| Item count (blueprint) | DA | `total_items` | `assessment_total_items` | `number_of_items` |
| Coverage | DA | `coverage_scope` | `coverage_scope` | `coverage_mode` |
| Difficulty policy | DA | `difficulty_profile` | `difficulty_profile` | `difficulty_profile` |
| Cognitive demand | DA | `cognitive_demand` | `cognitive_demand` | — |
| Cadence | DA | `assessment_cadence` | `assessment_cadence` | — |
| Display plan | DA | `feedback_display` | — | — |
| Feedback artefact | Design Feedback | — | `feedback_required` | — |

---

## References

- [`slice-23-5-charter.md`](slice-23-5-charter.md)  
- [`ld-parameter-ownership-model.md`](ld-parameter-ownership-model.md) §7  
- Pack §7–§9: `domain-learning-design-step-patterns.md`

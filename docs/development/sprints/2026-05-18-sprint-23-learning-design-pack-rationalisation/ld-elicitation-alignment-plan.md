# LD elicitation alignment + burden reduction plan — Sprint 23 Slice 23-2

**Date:** 2026-05-18  
**Slice:** 23-2 — Elicitation alignment + burden reduction  
**Status:** **Complete** (audit/plan only — no pack or runtime edits)  
**Baseline:** [`ld-semantics-matrix.md`](ld-semantics-matrix.md) (Slice 23-1)  
**Canonical pack:** `domains/learning-design/domain-learning-design-step-patterns.md` — `workflowBriefConfig`

---

## 1. Slice objective and constraints

### Objective

Classify every LD **elicitation factor** (`requiredFactors`, `optionalFactors`, `refinementFactors`) by operational posture so Sprint 23 can reduce **duplicate questioning** without weakening synthesis or topology.

**Thesis (carry forward):** Elicitation **initialises** persistent pedagogical state; after synthesis, **unified Settings** and step parameters are the operational authority for tunables marked `settings-only` in pack metadata.

### In scope

- Classification vocabulary and factor-by-factor recommendations  
- Settings duplication analysis (workflow + step surfaces)  
- Assessment-specific elicitation burden recommendations  
- Handoff actions for slices **23-4**, **23-5**, **23-6**

### Out of scope (this slice)

| Item | Reason |
|------|--------|
| Pack JSON edits | Slice **23-6** (chartered) |
| Runtime / WGC / PF code changes | Not chartered |
| Removing elicitation questions in code | Explicit constraint |
| Settings UI redesign | Sprint 22 preserved |
| `mappingRules` → auto-controls | Sprint 22 rejected |
| Research packs | Frozen |

### Constraints honoured

- **Essentials gating preserved** — factors that determine whether synthesis can produce a valid workflow remain asked (or inferable) **before** generation.  
- **No behaviour changes** in this slice — recommendations are pack/documentation targets only.

---

## 2. Elicitation factor inventory

| Tier | Count | IDs |
|------|-------|-----|
| **requiredFactors** | 5 | `topic`, `learner_level`, `design_scope`, `delivery_pattern`, `input_strategy` |
| **optionalFactors** | 8 | `duration_minutes`, `delivery_mode`, `delivery_context`, `session_materials`, `page_profile`, `assessment_required`, `learning_environments`, `assessment_strategy` |
| **refinementFactors** | 16 | `coverage_scope`, `cognitive_demand`, `question_style_mix`, `assessment_type`, `feedback_required`, `difficulty_profile`, `assessment_total_items`, `activity_pattern_mix`, `sequencing_granularity`, `assessment_cadence`, `tone_style`, `depth_level`, `include_examples`, `include_practice_tasks`, `compact_vs_detailed` |
| **extraFields** (non-tier but elicited) | 1 | `delivery_context` (duplicate optional + workflow control) |

**Pack surfaces cross-referenced:** 4 `workflowParameterControls`, 25 `stepParameterControls`, 26 `mappingRules`, 8 PF blocks with `userOptions`.

---

## 3. Classification vocabulary

| Posture | Meaning | Elicitation expectation | Post-synthesis authority |
|---------|---------|-------------------------|---------------------------|
| **Blocking essential** | Synthesis cannot proceed safely without a value (or reliable inference). | **Must** be resolved in brief essentials phase. | Workflow constraints; rarely retuned in Settings (no control). |
| **Topology gate** | Determines **which steps exist** in the generated workflow, not a mapped constraint key. | Ask or infer **before** step graph is finalised. | Not a Settings parameter; WGC / pack graph rules. |
| **Structured-state initialiser** | Seeds `workflowBriefResolution` / `stepParamPatch`; needed once at design time. | Ask **once** at brief (required or high-confidence optional/refinement). | **Settings** or step Settings for same semantic key after synthesis. |
| **Settings-only after synthesis** | Pack control exists with `elicitation: "settings-only"` (or step equivalent). | **Defer** repeat questions in refinement if value already mapped from brief or inferable. | **Unified Settings** / step parameter panels. |
| **Deferral candidate** | Redundant with Settings/PF or mapped-only with no stable UI; safe to skip when `skipIfContextResolved` or inference applies. | Strengthen pack `skipIfContextResolved` / `mustAsk: false` in **23-6**. | Settings or PF until metadata aligned (**23-5**). |
| **Removal candidate (pack-only)** | No longer justified as elicitation factor; semantics moved entirely to step/workflow metadata. | Remove from `refinementFactors` in **23-6** only after parity proof. | Settings / PF only |

**Precedence (recommended, documentation-only until 23-6):**

```text
Blocking essentials  →  Topology gates  →  Structured-state initialisers
        →  mappingRules materialise constraints/stepParams at synthesis
        →  Settings-only retune (no re-elicitation)
```

---

## 4. Required factors review

| Factor | Current role | mappingRules | Settings / PF | Proposed posture | Rationale |
|--------|--------------|--------------|---------------|------------------|-----------|
| `topic` | Required text | `constraints.topic` | — | **Blocking essential** | No alternative surface; anchors all downstream steps. |
| `learner_level` | Required select | `audience`, `step_define_learning_outcomes.learnerLevel` | Step `learnerLevel` (settings-only); PF §4 | **Structured-state initialiser** | Must seed brief; enum retune on outcomes step in Settings. Brief enums ≠ step enums — document mapping in **23-4**. |
| `design_scope` | Required select | `constraints.design_scope` | Workflow `design_scope` (**settings-only**) | **Structured-state initialiser** (brief) + **settings-only after synthesis** | **Priority row:** same question at essentials and Settings. Brief sets graph; Settings retunes without re-elicitation. |
| `delivery_pattern` | Required select | `constraints.delivery_pattern` | — | **Blocking essential** | No workflow control; affects constraints and pack graph. Keep required elicitation. |
| `input_strategy` | Required select | `constraints.input_strategy` | Workflow `input_strategy` (**settings-only**) | **Structured-state initialiser** + **settings-only after synthesis** | **Priority row:** duplicates Settings surface; starting-arteffact topology depends on it at synthesis time. |

**Required-factor burden summary:** **2 of 5** (`design_scope`, `input_strategy`) are explicit **Settings duplicates** — keep brief ask for synthesis bootstrap; plan pack metadata so refinement never re-asks (already satisfied for required tier).

---

## 5. Optional factors review

| Factor | Current role | mappingRules | Settings / PF | Proposed posture | Rationale |
|--------|--------------|--------------|---------------|------------------|-----------|
| `duration_minutes` | Optional number | `constraints.duration_minutes`, `step_construct_learning_sequence.duration_minutes` | Workflow + sequence step (**settings-only**); PF `total_duration_minutes` | **Structured-state initialiser** + **settings-only after synthesis** | **Priority row:** triple surface; brief optional OK; retune in Settings. Key mismatch PF vs control → **23-4/23-6**. |
| `delivery_mode` | Optional select | `constraints.delivery_mode` | — | **Structured-state initialiser** (infer-first) | Often set by `inferenceRules` from goal; no Settings control. |
| `delivery_context` | Optional + **extraFields** | `constraints.delivery_context` | Workflow control (**settings-only**) | **Structured-state initialiser** + **settings-only after synthesis** | **Priority row:** triple surface; collapse extraFields in **23-6**. |
| `session_materials` | Optional multi_select | `constraints`, `step_generate_activity_materials` | Step `session_materials` (settings-only); PF §6 none | **Settings-only after synthesis** | Infer from goal; if brief captures, do not re-ask in refinement. |
| `page_profile` | Optional select | `constraints`, `step_design_page` | Step `page_profile` (**elicited** on step); PF §13 | **Structured-state initialiser** (when page in scope) | Brief optional vs step `elicited` — prefer single ask when `session_materials` includes `page`. |
| `assessment_required` | Optional boolean | **None** | — | **Topology gate** | **Priority row:** drives inference + WGC; not a mapped parameter. Keep optional elicitation or strong inference. |
| `learning_environments` | Optional multi_select | `constraints.learning_environments` | — | **Topology gate** / **structured-state initialiser** | Gates VLE/xerte artefacts; inference from goal common. |
| `assessment_strategy` | Optional select | `constraints.assessment_strategy` | — | **Structured-state initialiser** | Intent / constraints; link to assessment pack in **23-5**. |

---

## 6. Refinement factors review

| Factor | mustAsk / skip | mappingRules | Settings / PF | Proposed posture | Rationale |
|--------|----------------|--------------|---------------|------------------|-----------|
| `coverage_scope` | skip; assessment gates | `constraints`, `DA.coverage_scope` | **No** step control; DA PF `coverage_breadth` | **Deferral candidate** → **settings-only after synthesis** post-**23-6** | **Priority row:** mapped but no Settings; PF key mismatch. Defer elicitation when inferred; add control in **23-5/23-6**. |
| `cognitive_demand` | skip; assessment gates | `constraints`, `DA.cognitive_demand` | **Missing** | **Deferral candidate** | **Priority row:** mapping-only. Add DA control or drop mapping in **23-5**. |
| `question_style_mix` | assessment gates | `constraints`, `generate.question_style_mix` | Gen PF only | **Deferral candidate** | Defer to generate-step Settings when control added (**23-6**). |
| `assessment_type` | **mustAsk** | `constraints`, `DA.activity_type` | DA `activity_type` (**elicited**) | **Structured-state initialiser** (brief) + **deferral candidate** (refinement) | **Priority row:** mustAsk duplicates DA control. Keep one brief capture; do not re-ask in refinement if mapped. |
| `feedback_required` | skip | `constraints`, `step_design_feedback` | DA PF `feedback_display` (different semantics) | **Deferral candidate** | Split feedback vs display; **23-5** semantics. |
| `difficulty_profile` | skip | `constraints`, `DA.difficulty_profile`, `generate.difficulty_profile` | DA PF `difficulty_level`; no Settings | **Deferral candidate** | **Priority row:** vocabulary split. Defer elicitation until keys aligned (**23-5**). |
| `assessment_total_items` | **mustAsk** | `constraints`, `DA.total_items`, `generate.number_of_items` | DA + Gen controls | **Structured-state initialiser** + **deferral candidate** | **Priority row:** mustAsk duplicates step controls. Brief seeds; DA owns; Gen inherits. |
| `activity_pattern_mix` | goal/scope gates | `constraints`, `DLA.activity_pattern_mix` | Step settings-only | **Settings-only after synthesis** | Step control exists; refinement should not re-ask if brief mapped. |
| `sequencing_granularity` | skip; scope gates | `constraints`, `sequence.sequencing_granularity` | Step settings-only | **Settings-only after synthesis** | Same pattern as activity mix. |
| `assessment_cadence` | scope gates | `constraints`, `DA.assessment_cadence` | **Missing** | **Deferral candidate** | **Priority row:** mapping-only until **23-6** control. |
| `tone_style` | page gates | `constraints`, `step_design_page` | Step settings-only | **Settings-only after synthesis** | Page refinement redundant post-synthesis. |
| `depth_level` | page gates | same | Step settings-only | **Settings-only after synthesis** | |
| `include_examples` | page gates | same | Step settings-only | **Settings-only after synthesis** | |
| `include_practice_tasks` | page gates | same | — | **Deferral candidate** | No step control; optional page semantics. |
| `compact_vs_detailed` | page gates | `constraints.output_density`, page | — | **Deferral candidate** | Mapped; no dedicated Settings control. |

---

## 7. Settings duplication analysis

### 7.1 Workflow-level duplication

| Workflow control key | Elicitation source | `elicitation` flag | Duplication type | Recommendation |
|---------------------|-------------------|--------------------|------------------|----------------|
| `design_scope` | **requiredFactors** | settings-only | Essentials + Settings | Brief **initialises**; Settings **retunes**; no refinement re-ask |
| `input_strategy` | **requiredFactors** | settings-only | Essentials + Settings | Same |
| `delivery_context` | **optionalFactors** + **extraFields** | settings-only | Optional + extra + Settings | **23-6:** remove extraFields duplicate; infer when possible |
| `duration_minutes` | **optionalFactors** | settings-only | Optional + Settings + sequence step | Brief optional; Settings authoritative post-synthesis |

### 7.2 Step-level vs refinement (assessment priority)

| Brief / refinement factor | Step control | PF option | Duplication |
|---------------------------|-------------|-----------|-------------|
| `assessment_type` | `activity_type` (elicited) | `activity_type` | **Triple** — brief mustAsk + Settings + PF |
| `assessment_total_items` | `total_items` / `number_of_items` | `total_items`, `number_of_items` | **Triple** — mustAsk + two steps |
| `coverage_scope` | — | `coverage_breadth` | **Double** brief + PF; mapping uses `coverage_scope` |
| `difficulty_profile` | — | `difficulty_level` | **Double** brief + PF; mapping uses `difficulty_profile` |

### 7.3 Burden reduction levers (pack-only, future)

| Lever | Applies to | Slice |
|-------|------------|-------|
| Set `mustAsk: false` on `assessment_type`, `assessment_total_items` when `skipIfContextResolved` + mapped from essentials/inference | Assessment refinement | **23-6** |
| Rely on `skipIfContextResolved: true` (already on many factors) — document runtime must treat mapped constraints as resolved | Refinement | **23-6** verify interpreter |
| Add missing `stepParameterControls` so `settings-only` posture is honest | DA assessment params | **23-5 / 23-6** |
| Remove `extraFields.delivery_context` | Workflow | **23-6** |

**No code changes in 23-2** — table documents intended pack edits only.

---

## 8. Topology-only factors

Factors whose **primary effect** is workflow shape, not a stable Settings tunable:

| Factor | Evidence | Consumers | Elicitation recommendation |
|--------|----------|-------------|------------------------------|
| `assessment_required` | **No** `mappingRule` | `inferenceRules` (quiz/mcq → true); WGC step inclusion/exclusion; refinement `askWhenResolvedFactorEquals` | **Topology gate** — keep optional question or strengthen inference; never treat as Settings param |
| `learning_environments` | Maps to constraint | Pack guidance (VLE/xerte guards); WGC | **Topology gate** / initializer — ask when multi-env design explicit |
| `delivery_pattern` | Maps to constraint | Pack graph, blended guidance | **Blocking essential** (required) — not Settings; keep |
| `assessment_strategy` | Maps to constraint | `intentClasses` / assessment pack detection | Initialiser — optional ask when assessment ambiguous |

**Design Assessment step pruning** (`app.js` ~10870) uses intent flags derived from brief/goal, not Settings — aligns `assessment_required` with **topology**, not parameter inheritance.

---

## 9. Assessment elicitation recommendations

### 9.1 Priority rows (from 23-1) — disposition

| Row | Disposition |
|-----|-------------|
| `design_scope` / `input_strategy` required + workflow settings-only | Keep **required** elicitation for synthesis bootstrap; classify refinement as **N/A**; post-synthesis **Settings-only** |
| `delivery_context` triple surface | Optional brief init; **23-6** remove extraFields; Settings retune |
| `duration_minutes` multi-surface | Optional brief; Settings + sequence step; **23-4** key alignment |
| `assessment_required` no mappingRule | **Topology gate** only |
| `assessment_type` / `assessment_total_items` mustAsk vs controls | **One brief capture** (initializer); set **mustAsk false** in refinement when resolved (**23-6**); operational tune on DA / Gen Settings (**23-5**) |
| `coverage_scope`, `cognitive_demand`, `difficulty_profile`, `assessment_cadence` mapped without Settings | **Defer refinement** until controls exist; do not add runtime auto-promotion from mappingRules |

### 9.2 Recommended assessment elicitation flow (target state)

```text
Essentials: topic, learner_level, design_scope, delivery_pattern, input_strategy
Optional/topology: assessment_required (gate), learning_environments, assessment_strategy
Optional init: duration_minutes, delivery_context (if not inferred)

When assessment_required (or inferred):
  Brief initializer (once): assessment_type → activity_type, assessment_total_items → total_items
  Skip refinement repeats if mapped

Post-synthesis:
  Unified Settings: workflow tunables
  Step Settings: DA (expand controls in 23-6), Gen (number_of_items inherit)
  PF: subset until bespoke retired (23-3, 23-5)
```

### 9.3 mustAsk refinement factors — plan

| Factor | Current mustAsk | Proposed |
|--------|-----------------|----------|
| `assessment_type` | true | **false** after first mapped value (pack **23-6**); keep essentials-path inference from goal |
| `assessment_total_items` | true | **false** when `assessment_total_items` or `total_items` already in resolution (**23-6**) |

Until pack edit: runtime will still ask — **no change in 23-2**.

---

## 10. Master recommendation table

| Factor | Current elicitation role | Current mapping target | Current Settings / PF surface | Proposed posture | Rationale | Later slice action |
|--------|-------------------------|------------------------|------------------------------|------------------|-----------|-------------------|
| `topic` | Required essential | `constraints.topic` | — | **Blocking essential** | Core brief anchor | — |
| `learner_level` | Required essential | `audience`, `stepParams…learnerLevel` | Outcomes step settings-only; PF §4 | **Structured-state initialiser** | Seeds audience/outcomes | **23-4** enum map |
| `design_scope` | Required essential | `constraints.design_scope` | Workflow settings-only | **Initializer** + **settings-only after synthesis** | Settings duplicate | **23-6** document precedence |
| `delivery_pattern` | Required essential | `constraints.delivery_pattern` | — | **Blocking essential** | No Settings surface | **23-6** optional workflow control |
| `input_strategy` | Required essential | `constraints.input_strategy` | Workflow settings-only | **Initializer** + **settings-only after synthesis** | Settings duplicate | **23-6** precedence |
| `duration_minutes` | Optional | `constraints`, `sequence.duration_minutes` | Workflow + sequence settings-only; PF key mismatch | **Initializer** + **settings-only after synthesis** | Multi-surface | **23-4**, **23-6** keys |
| `delivery_mode` | Optional | `constraints.delivery_mode` | — | **Initializer** (infer-first) | inferenceRules | — |
| `delivery_context` | Optional + extraFields | `constraints.delivery_context` | Workflow settings-only | **Initializer** + **settings-only after synthesis** | Triple surface | **23-6** drop extraFields |
| `session_materials` | Optional | `constraints`, activity materials step | Step settings-only | **Settings-only after synthesis** | Step control exists | — |
| `page_profile` | Optional | `constraints`, `step_design_page` | Step elicited + PF | **Initializer** (page workflows) | Mixed elicitation flags | **23-6** align step `elicitation` |
| `assessment_required` | Optional boolean | **None** | — | **Topology gate** | Graph/inference only | **23-5** doc vs WGC |
| `learning_environments` | Optional | `constraints.learning_environments` | — | **Topology gate** | Artefact guards | — |
| `assessment_strategy` | Optional | `constraints.assessment_strategy` | — | **Structured-state initialiser** | Intent constraints | **23-5** |
| `coverage_scope` | Refinement; skip | `constraints`, `DA.coverage_scope` | PF `coverage_breadth` only | **Deferral candidate** | No Settings | **23-5**, **23-6** control |
| `cognitive_demand` | Refinement; skip | `constraints`, `DA.cognitive_demand` | — | **Deferral candidate** | Mapping-only | **23-5**, **23-6** |
| `question_style_mix` | Refinement | `constraints`, `generate…` | Gen PF | **Deferral candidate** | No Settings | **23-6** |
| `assessment_type` | Refinement **mustAsk** | `constraints`, `DA.activity_type` | DA elicited + PF | **Initializer** + **deferral** | Triple ask | **23-5**, **23-6** mustAsk |
| `feedback_required` | Refinement; skip | `constraints`, design feedback step | DA `feedback_display` | **Deferral candidate** | Semantic split | **23-5** |
| `difficulty_profile` | Refinement; skip | `constraints`, DA + generate | PF `difficulty_level` | **Deferral candidate** | Key mismatch | **23-5** |
| `assessment_total_items` | Refinement **mustAsk** | `constraints`, DA + generate | DA + Gen controls | **Initializer** + **deferral** | Triple ask | **23-5**, **23-6** mustAsk |
| `activity_pattern_mix` | Refinement | `constraints`, DLA step | Step settings-only | **Settings-only after synthesis** | Control exists | **23-6** PF option |
| `sequencing_granularity` | Refinement; skip | `constraints`, sequence step | Step settings-only | **Settings-only after synthesis** | Control exists | **23-6** PF option |
| `assessment_cadence` | Refinement | `constraints`, `DA.assessment_cadence` | — | **Deferral candidate** | Mapping-only | **23-6** |
| `tone_style` | Refinement (page) | `constraints`, page step | Step settings-only | **Settings-only after synthesis** | | — |
| `depth_level` | Refinement (page) | `constraints`, page step | Step settings-only | **Settings-only after synthesis** | | — |
| `include_examples` | Refinement (page) | `constraints`, page step | Step settings-only | **Settings-only after synthesis** | | — |
| `include_practice_tasks` | Refinement (page) | `constraints`, page step | — | **Deferral candidate** | No control | **23-6** optional |
| `compact_vs_detailed` | Refinement (page) | `constraints.output_density`, page | — | **Deferral candidate** | No control | **23-6** optional |

---

## 11. Proposed handoff to 23-4 / 23-5 / 23-6

| Slice | Actions from 23-2 |
|-------|-------------------|
| **23-4** Workflow vs step parameter ownership | `learner_level` brief vs `learnerLevel` step; `duration_minutes` vs `total_duration_minutes`; disambiguate `difficulty_level` / `coverage_breadth` across steps |
| **23-5** Design Assessment | Resolve assessment initializer vs Settings vs PF; inheritance keys; `mustAsk` assessment factors; topology doc for `assessment_required` |
| **23-6** Pack metadata rationalisation | Implement `mustAsk`/`skipIfContextResolved` changes; remove `extraFields` duplicate; add DA `stepParameterControls`; align `elicitation` flags on controls — **no mappingRule auto-promotion** |

**23-3** (PF bespoke audit): defer refinement UI overlap until **23-5** defines assessment authority.

### Burden reduction scorecard (qualitative)

| Category | Factor count | Posture |
|----------|--------------|---------|
| Keep as blocking / topology | 6 | `topic`, `learner_level`, `delivery_pattern`, `assessment_required`, `learning_environments`, + partial `assessment_strategy` |
| Initialiser once, Settings retune | 7 | `design_scope`, `input_strategy`, `duration_minutes`, `delivery_context`, `delivery_mode`, `page_profile`, assessment initialisers |
| Settings-only after synthesis (stop refinement re-ask) | 9 | workflow duplicates + page/activity/sequence step controls |
| Deferral candidates (pack 23-6) | 10 | assessment mapped-without-control + page gaps |

**Estimated refinement question reduction (after 23-6 pack edits, not 23-2):** up to **10–14** fewer refinement prompts on typical assessment workflows when `skipIfContextResolved` and `mustAsk` changes apply.

---

## 12. Verification

```bash
node --test tests/*.test.js
```

**Result (2026-05-18):** **188 passed**, 0 failed.

---

## References

- [`ld-semantics-matrix.md`](ld-semantics-matrix.md)  
- [`slice-23-1-charter.md`](slice-23-1-charter.md)  
- [`slice-23-2-charter.md`](slice-23-2-charter.md)  
- [`context-files/ld-elicitation-factors.md`](context-files/ld-elicitation-factors.md)  
- [`context-files/ld-workflow-parameter-controls.md`](context-files/ld-workflow-parameter-controls.md)  
- [`context-files/ld-mapping-rules-excerpts.md`](context-files/ld-mapping-rules-excerpts.md)

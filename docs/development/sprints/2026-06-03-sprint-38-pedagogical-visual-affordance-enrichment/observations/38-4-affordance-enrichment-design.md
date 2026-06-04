# Slice 38-4 — Affordance enrichment design

**Date:** 2026-06-03  
**Status:** **COMPLETE** (schema design only — no implementation)  
**Authority:** [38-1](38-1-visual-affordance-audit.md) · [38-2](38-2-visual-purpose-taxonomy.md) · [38-3](38-3-representation-guidance.md)  
**Fixture:** [../fixtures/probe-38-4-enriched-affordance-example.yaml](../fixtures/probe-38-4-enriched-affordance-example.yaml)

**Principle:** 38-4 **encodes** decisions already established — it does not discover new pedagogy.

---

## Success criterion

| Decision | Human-designer test (no full page read) |
|----------|----------------------------------------|
| **generate** | Correct instructional diagram type and constraints; reviewer can explain **what cognitive support** the figure adds (38-6) |
| **defer** | Clear why generation is postponed |
| **reject** | Clear why no visual should exist |

38-3 established **Pass** on all six generate audit rows when `purpose` + `preferred_representation` + fidelity fields are present. This schema is the **minimum** container for those fields.

---

## Field review (mandated list + extensions)

| Field | Verdict | Rationale (38-x) |
|-------|---------|------------------|
| `affordance_id` | **Keep** | 38-1: link hook, VEU opportunity, figure artefact |
| `activity_id` | **Keep** | 38-1: activity binding; workshop merge |
| `visual_decision` | **Keep** | 38-1/38-2: first-class generate \| defer \| reject |
| `activity_visual_value` | **Keep** | 38-2: gate; 38-1: none vs 44 hooks |
| `purpose` | **Keep** (generate only) | 38-2: six-value allow-list |
| `preferred_representation` | **Keep** (generate only) | 38-3: seven-token allow-list |
| `reasoning_supported` | **Keep** | 38-1: cognitive job; 38-2: charter Q1–Q2 |
| `pedagogical_added_value` | **Keep** (generate, recommended) | 38-6: incremental reasoning support vs materials; not enforced in compose validator |
| `learner_stage` | **Keep** (generate) | 38-1: pre/post classification; 38-2 spoiler rule |
| `activity_relationship` | **Remove** | 38-1: expressible inside `reasoning_supported` + `learner_stage` |
| `anti_spoiler` | **Keep** | 38-1: F6 spoiler risk |
| `spoiler_boundary` | **Keep** (conditional) | 38-1: inflation A3 CSV; 38-2 defer vs generate nuance |
| `representation_avoid` | **Keep** (generate, ≥1) | 38-3: F1/F3/F4 guards |
| `canonical_discipline_note` | **Keep** (generate) | 38-3: canonical form; Pass test |
| `requires_exact_data_match` | **Keep** | 38-3: CI A4 quantitative |
| `discipline_risk_level` | **Keep** (generate) | 38-3: low \| medium \| high |
| `must_show` | **Keep** (generate, ≥1) | 38-3: designer Pass |
| `must_not_show` | **Keep** (generate, ≥1) | 38-3: designer Pass |
| `allowed_claims` | **Keep** (generate) | 38-1: F2 unsupported claims |
| `disallowed_claims` | **Keep** (generate, ≥1) | 38-1: F2 |
| `source_basis` | **Keep** (generate) | 38-3: quantitative + VEU authority |
| `caption_intent` | **Keep** (generate) | 38-3: embed caption; merges prompt-connection |
| `visual_slot` | **Keep** (generate when hook) | 38-1: Sprint 36 placement |
| `material_anchor` | **Keep** (optional) | 38-1: table/worksheet key |
| `tier` | **Keep** (generate) | 38-2: essential \| valuable; VEU handoff |
| `concepts` | **Optional** | 38-2 examples; aids LD — not required for Pass if `reasoning_supported` strong |
| `rejection_reason` | **Keep** (reject) | 38-2: seven-value enum |
| `defer_reason` | **Keep** (defer) | 38-2: two-value enum |
| `rationale` | **Keep** (all decisions) | 38-2: activity_visual_value + defer/reject one-liner |
| `pedagogic_justification` | **Merge** → `reasoning_supported` | Redundant prose |
| `learner_prompt_connection` | **Merge** → `caption_intent` | Single caption instruction |
| `canonical_form_required` | **Remove** (field) | 38-3: always true for generate — **validation default** |
| `requires_subject_expert_review` | **Remove** (schema) | 38-3: process flag, not affordance minimum |
| `activity_title` | **Remove** | 38-1: topic inference risk |
| `topic` | **Remove** | 38-1: shallow affordance anti-pattern |

---

## Minimum viable schema (object shape)

### Shared envelope (all records)

```yaml
affordance_id: string          # stable id
activity_id: string
visual_decision: generate | defer | reject
rationale: string              # ≥1 sentence — why this decision
```

### Activity gate (once per activity, not per affordance)

Stored on **activity** object (see Storage):

```yaml
activity_visual_value:
  decision: high | medium | low | none
  rationale: string
```

**38-1/38-2:** Required for every reviewed activity before affordance list is valid.

---

## Generate contract

### Minimum required fields

| Field | Required | Allow-list / rule |
|-------|----------|-------------------|
| `affordance_id` | yes | `va-{activity_id}-{slug}` recommended |
| `activity_id` | yes | |
| `visual_decision` | yes | `generate` |
| `purpose` | yes | 38-2 six purposes |
| `preferred_representation` | yes | 38-3 seven tokens |
| `reasoning_supported` | yes | non-empty; states cognitive job |
| `pedagogical_added_value` | recommended | 38-6: what new cognitive support the figure adds beyond materials (non-empty when present) |
| `representation_avoid` | yes | ≥1 token from 38-3 §4 |
| `anti_spoiler` | yes | boolean |
| `spoiler_boundary` | if `anti_spoiler: true` | four booleans (below) |
| `canonical_discipline_note` | yes | discipline-specific canonical form |
| `source_basis` | yes | JSON paths or material keys |
| `must_show` | yes | ≥1 string |
| `must_not_show` | yes | ≥1 string |
| `allowed_claims` | yes | array (may be 1 item) |
| `disallowed_claims` | yes | ≥1 string |
| `caption_intent` | yes | caption + learner-prompt guard |
| `requires_exact_data_match` | yes | boolean |
| `discipline_risk_level` | yes | `low` \| `medium` \| `high` |
| `tier` | yes | `essential` \| `valuable` |
| `learner_stage` | yes | `pre_classification` \| `post_reasoning` |
| `visual_slot` | if renderer emits hook | Sprint 36 slot enum |
| `material_anchor` | recommended | materials key when anchored |

### Optional (generate)

| Field | When |
|-------|------|
| `concepts` | Short terms list when helpful; never topic slug alone |
| `rejection_reason` | must be `null` or omitted |

### `spoiler_boundary` (when `anti_spoiler: true`)

```yaml
spoiler_boundary:
  hide_answers: boolean
  hide_classification_keys: boolean
  hide_model_solution: boolean
  allow_structural_hint: boolean
```

**38-1:** Inflation A3 CSV generate uses `allow_structural_hint: true`.

### `purpose` allow-list (38-2)

```text
distinction
comparison
classification
mechanism
evidence_structure
data_pattern_reading
```

### `preferred_representation` allow-list (38-3)

```text
comparison_framework
classification_matrix
causal_model
evidence_t_chart
number_line_segments
ordered_bar_strip
labelled_contrast_panel
```

**Implementation note:** May collapse `labelled_contrast_panel` → `comparison_framework` in code enum (six tokens).

### `tier` (38-2 promotion)

| Value | Use |
|-------|-----|
| `essential` | Climate mechanism (pre-template) |
| `valuable` | All other audited **generate** rows |

`optional` tier **not used** — use **defer** or **reject** instead.

### Success test

Designer can draw figure from record **without page** — matches 38-3 §7 Pass.

---

## Defer contract

### Minimum required fields

| Field | Required |
|-------|----------|
| `affordance_id` | yes |
| `activity_id` | yes |
| `visual_decision` | yes (`defer`) |
| `defer_reason` | yes |
| `rationale` | yes |

### `defer_reason` allow-list (38-2)

```text
worked_example_sufficient_first
model_row_sufficient_first
```

### Must not include

- `preferred_representation`, `visual_slot`, `must_show`, `tier` — no figure brief yet  
- `purpose` — optional latent only (not required)

### Success test

Reader knows **why** image generation is postponed (e.g. CI A1 worked example, Marx A2 model row).

---

## Reject contract

### Minimum required fields

| Field | Required |
|-------|----------|
| `affordance_id` | yes |
| `activity_id` | yes |
| `visual_decision` | yes (`reject`) |
| `rejection_reason` | yes |
| `rationale` | yes |

### Must not include

- `purpose`, `preferred_representation`, `visual_slot` (no hook for reject — **38-1**)
- `tier: decorative-rejected` — use **`visual_decision: reject`** + `rejection_reason`; VEU maps to decorative-rejected output

### `rejection_reason` allow-list (38-2)

```text
low_pedagogical_value
debrief_without_new_reasoning
duplicate_existing_structure
decorative_only
spoiler_risk
assessment_text_sufficient
insufficient_source_basis
```

**Mapping 38-1 rows:** A1 → `low_pedagogical_value`; A5 → `debrief_without_new_reasoning`; A3/A4 inflation → `duplicate_existing_structure`; climate/CI assessment → `decorative_only` / `assessment_text_sufficient`; Marx KS → `duplicate_existing_structure`.

### Success test

Reader knows **why no visual** — intentional, not missing hook.

---

## Storage architecture

### Canonical location

```yaml
# page root (recommended)
visual_affordance_schema_version: "38.4"
activities_visual_review:          # parallel to learning_activities by activity_id
  - activity_id: A2
    activity_visual_value:
      decision: high
      rationale: "..."
visual_affordances:                # flat list — all decisions
  - affordance_id: va-a2-...
    activity_id: A2
    visual_decision: generate
    ...
```

**Why flat `visual_affordances[]`:**

- Single handover blob for VEU (38-5)  
- Simple merge in renderer: filter by `activity_id` + `visual_decision`  
- 38-1: multiple records per activity allowed (Climate: 2× generate)

**Alternative rejected:** Only `activity.visual_affordances[]` nested — harder for page-level export and QA scan.

### Merge behaviour

| Source | Rule |
|--------|------|
| LD compose | Authoritative writer of `visual_affordances[]` |
| Renderer | Emits hook **only** when `visual_decision: generate` AND `visual_slot` set |
| VEU | Reads full array; ignores generate rows if misaligned; honours reject rows |

### Identity rules

- `affordance_id` unique per page  
- One **reject** record per rejected **opportunity** (not per hook)  
- At most **two** `generate` per activity (Climate mechanism + evidence)  
- `activity_visual_value.decision: none` ⇒ zero `generate` for that `activity_id`

### Passthrough (implementation phase — not 38-4 code)

Optional mirror on `.util-visual-affordance`: `data-affordance-id`, `data-visual-decision`, `data-visual-purpose` — JSON remains authoritative (38-5).

---

## Quantitative contract

When:

```yaml
requires_exact_data_match: true
```

**Mandatory (in addition to generate minimum):**

| Rule | 38-x |
|------|------|
| `preferred_representation` must be `number_line_segments` or numeric `ordered_bar_strip` | 38-3 |
| `source_basis` must cite exact material paths / cell values | 38-3, 38-1 F2 |
| `must_show` must list every numeric label depicted | 38-3 CI A4 |
| `allowed_claims` must be **only** claims derivable from `source_basis` | 38-1 F2 |
| `disallowed_claims` must include invented statistics | 38-3 |
| No trend, overlap verdict, or significance language unless in `source_basis` | 38-3 |

**Validation auto-set:**

```text
IF preferred_representation == number_line_segments
  THEN requires_exact_data_match MUST be true
```

**Prohibited:** Invented values, inferred trends, relationships absent from materials (38-3 programme rule).

When `requires_exact_data_match: false`, `allowed_claims` still required but may be qualitative (Inflation A2).

---

## Compose QA rules (validation)

| Rule | Source |
|------|--------|
| Every `learning_activities` row has `activity_visual_value` | 38-2 |
| Every `visual_affordances[]` row has `visual_decision` + `rationale` | 38-2 |
| `generate` satisfies generate contract | 38-4 |
| `purpose` + `preferred_representation` in allow-lists | 38-2, 38-3 |
| `activity_visual_value.decision: none` ⇒ no `generate` for that id | 38-1 |
| Topic-only / title-only ⇒ fail | 38-1 |
| `anti_spoiler: true` ⇒ `spoiler_boundary` present | 38-4 |
| `number_line_segments` ⇒ `requires_exact_data_match: true` | 38-3 |
| Generate figure adds reasoning support not already in materials | 38-6 |
| `pedagogical_added_value` states incremental support when authored | 38-6 |
| Representation token `must_add` / `must_not_duplicate` satisfied (38-3 §1) | 38-6 |

---

## Human-designer validation checklist

For each `visual_decision: generate` record, reviewer marks Pass/Fail:

- [ ] **Purpose** names cognitive job (not topic)  
- [ ] **Representation** is allow-listed and matches purpose (38-3 table)  
- [ ] **Pedagogical added value:** reviewer can explain what cognitive support the figure adds beyond materials (38-6)  
- [ ] **must_show / must_not_show** sufficient to brief artist/model  
- [ ] **allowed_claims / disallowed_claims** bound discipline (F2)  
- [ ] **source_basis** traceable without opening HTML  
- [ ] **representation_avoid** prevents duplicate table (F1)  
- [ ] **spoiler_boundary** matches worksheet timing (F6)  
- [ ] **Quantitative:** endpoints in `must_show` match `source_basis` when `requires_exact_data_match: true`  

**Pass bar:** Same as 38-3 §7 — all six audited generate cases Pass.

---

## Schema acceptance examples

Full YAML: [probe-38-4-enriched-affordance-example.yaml](../fixtures/probe-38-4-enriched-affordance-example.yaml).

| # | Case | `visual_decision` | Validates |
|---|------|-------------------|-----------|
| 1 | Inflation A2 distinction | generate | Full generate contract |
| 2 | Climate mechanism | generate | `essential` + `causal_model` |
| 3 | CI A4 overlap | generate | `requires_exact_data_match: true` |
| 4 | CI A1 worked example | defer | `defer_reason` only |
| 5 | Inflation A5 debrief | reject | `debrief_without_new_reasoning` |

---

## Expressibility matrix (38-2 outcomes)

| 38-2 outcome | Schema expression |
|--------------|-------------------|
| 6× generate | `visual_decision: generate` + contracts |
| 2× defer | `visual_decision: defer` + `defer_reason` |
| 7× reject | `visual_decision: reject` + `rejection_reason` |
| 15 opportunities | Envelope + activity gate |

**No "other" bucket required.**

---

## Implementation recommendations (post–38-4 design)

| Layer | Action |
|-------|--------|
| LD / Design Page | Emit `activities_visual_review` + `visual_affordances[]` on compose |
| Validate Learning Design | QA rules above |
| Renderer | Hook only on `generate` + `visual_slot`; no hook on `reject` |
| Tests | Fixture contract test when shape stable |
| 38-5 | VEU consumes `visual_affordances[]` as authoritative |

**Out of scope for 38-4:** `app.js` changes, VEU JSON, domain prompts.

---

### 38-4 architecture verdict

**1. What is the minimum viable affordance schema?**

Three record shapes sharing envelope (`affordance_id`, `activity_id`, `visual_decision`, `rationale`) plus per-activity `activity_visual_value`, stored in flat `page.visual_affordances[]` with generate/defer/reject field sets defined above.

**2. Which fields are mandatory?**

- **All activities:** `activity_visual_value`  
- **generate:** 18 fields (see Generate contract) including conditional `spoiler_boundary`  
- **defer:** 5 fields  
- **reject:** 5 fields  

**3. Which fields are optional?**

- `concepts` (generate)  
- `material_anchor`, `visual_slot` (generate — slot required only if hook emitted)  

**4. Which fields were removed and why?**

| Removed | Why |
|---------|-----|
| `activity_relationship` | Redundant with `reasoning_supported` + `learner_stage` |
| `pedagogic_justification` | Merged into `reasoning_supported` |
| `learner_prompt_connection` | Merged into `caption_intent` |
| `canonical_form_required` | Default true in validator for all `generate` |
| `requires_subject_expert_review` | Process, not minimum schema |
| `activity_title`, `topic` | 38-1 topic-inference failure mode |

**5. Is the schema ready for implementation in Sprint 38?**

**Yes.** Slices 38-1–38-3 supply evidence, enums, and representation tokens. Next implementation work: compose emission + validation + optional hook passthrough (38-5 prompt alignment can proceed in parallel).

---

## Rejected scope creep (38-4)

- Renderer / VEU / image model changes in this slice  
- New purposes or representation tokens  
- `visual_affordances` inside workflow artefacts as separate artefact type (page JSON sufficient)  

---

## Regression

Design-only — **642 pass / 0 fail** unchanged.

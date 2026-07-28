# Visual Planning Contract — Design Page → Prism (Sprint 70 Slice 3)

**Status:** Frozen validation boundary (schema **38.4**)  
**Authority:** `lib/visual-planning-contract.js`  
**Row-shape delegate:** `lib/sprint38-visual-affordances.js` (vocabularies + affordance envelope rules)

---

## Ownership and boundary

| Layer | Responsibility |
|-------|----------------|
| **Design Page** | Authors visual planning (`visual_affordance_schema_version`, `activities_visual_review`, `visual_affordances`) |
| **Page assembly** (`lib/page-vnext-assemble.js`) | Transports fields unchanged — does **not** validate, repair, or reinterpret semantics |
| **Visual planning contract** (`validateVisualPlanningContract`) | Deterministic, non-mutating validation before Prism consumption |
| **Future Prism Planner** | Consumes validated assembled page only |

Prism must **not** depend on workflow step state, Design Page partials, prompt text, live model responses, or intermediate workflow artefacts.

```
Design Page → assembled page → validateVisualPlanningContract() → future Prism Planner
```

This slice stops at validation. No visual jobs, prompts, image providers, assets, or renderer changes.

---

## Canonical input fields

Top-level visual-planning fields on the assembled page:

| Field | Role |
|-------|------|
| `visual_affordance_schema_version` | Contract version gate (supported: `"38.4"`) |
| `activities_visual_review[]` | Per-activity visual-value review metadata (not executable planning) |
| `visual_affordances[]` | Authoritative visual planning rows |

Prism consumes only these fields plus assembled page content referenced by `evidence_anchors` (full source resolution is a later slice).

---

## Unknown-field policy

- **Affordance rows:** Open-ended. Additional authored properties pass through validation untouched when present. Known fields are validated when present.
- **Validation:** Inspect-only — no normalisation, repair, rename, or removal.
- **Activities visual review:** Shape validated; no derivation of affordances from review rows.

---

## Schema version behaviour

| Condition | Result |
|-----------|--------|
| No visual-planning fields present | `valid: true`, `authoritative_planning_present: false` (legacy page) |
| Planning fields present, version missing | Error `VPC_SCHEMA_VERSION_MISSING` |
| Malformed version (empty / wrong type) | Error `VPC_SCHEMA_VERSION_MALFORMED` |
| Supported `"38.4"` | Full validation |
| Unknown future version | Error `VPC_SCHEMA_VERSION_UNSUPPORTED` |
| Version only (no review/affordances arrays) | Warning `VPC_PLANNING_PARTIAL_ENVELOPE` |

Version migration is out of scope for this slice.

---

## Activities visual review

```json
{
  "activity_id": "A1",
  "activity_visual_value": {
    "decision": "high",
    "rationale": "..."
  }
}
```

Rules:

- Unique `activity_id` per row
- `activity_id` must exist on the assembled page (`page.activities[]` or `sections[learning_activities].content[]`)
- `decision`: `high` \| `medium` \| `low` \| `none`
- `rationale`: required non-empty string

Review rows are metadata only — they do not create affordances.

---

## Visual affordance decisions

| `visual_decision` | Meaning |
|-------------------|---------|
| `generate` | Plan a visual for future deterministic consumption |
| `defer` | Valid row; generation deferred |
| `skip` | Valid row; visual intentionally omitted (`reject` legacy alias) |

### Scope semantics

| `scope` | Rules |
|---------|-------|
| `activity` | Requires valid `activity_id` referencing an assembled activity |
| `page` | Requires `region` (currently `knowledge_summary`); `activity_id` must **not** be set |

When `scope` is omitted, Sprint 38 inference applies (`region` ⇒ page, else activity).

### Generate requirements

Sprint 38 envelope (purpose, representation, tier, claims, etc.) **plus** Slice 3 Prism-boundary fields:

- `visual_slot`
- `purpose`
- `preferred_representation`
- `subject`
- `context`
- `evidence_anchors` (non-empty array)

Defer/skip rows remain valid without generation-only fields unless Sprint 38 already requires them (e.g. `rationale`, `defer_reason` / `skip_reason`).

---

## Frozen vocabularies (schema 38.4)

Re-exported from `lib/sprint38-visual-affordances.js`:

| Field | Allowed values |
|-------|----------------|
| `scope` | `activity`, `page` |
| `visual_decision` | `generate`, `defer`, `skip` (legacy `reject`) |
| `visual_slot` | `activity-after-header`, `materials-entry`, `materials-card-grid-after`, `materials-table-pair-between`, `assessment-before-checkpoint`, `knowledge-summary-after-content` |
| `tier` | `essential`, `valuable` |
| `purpose` | `distinction`, `comparison`, `classification`, `mechanism`, `evidence_structure`, `data_pattern_reading`, `synthesis` |
| `preferred_representation` | `comparison_framework`, `classification_matrix`, `causal_model`, `evidence_t_chart`, `number_line_segments`, `ordered_bar_strip`, `labelled_contrast_panel`, `concept_map`, `causal_chain`, `process`, `comparison`, `hierarchy`, `decision_framework`, `diagnostic_pathway`, `annotated_system` |
| `learner_stage` | `pre_classification`, `post_reasoning` |
| `discipline_risk_level` | `low`, `medium`, `high` |
| `activity_visual_value.decision` | `high`, `medium`, `low`, `none` |

**Intentionally open-ended:** `subject`, `context`, `rationale`, `pedagogical_added_value`, `must_show`, `must_not_show`, `allowed_claims`, `disallowed_claims`, `source_basis`, `caption_intent`, and other rich brief metadata — validated as strings/arrays when present, not restricted to enums.

`representation_avoid[]` tokens are controlled (see Sprint 38 `REPRESENTATION_AVOID`).

---

## Evidence-anchor syntax (structure only)

Validated in this slice; **no** `resolved_sources`, job creation, or materials crawling.

- Must be a non-empty string array for `generate` rows
- Each entry: non-empty string
- Supported roots:
  - **Activity:** `{activity_id}.{path}` — e.g. `A1.learner_task`, `A1.materials.scenarios`
  - **Page synthesis:** `page_synthesis.{field}` — fields: `overview`, `knowledge_summary`, `learning_purpose`, `study_tips`
- Obvious activity references must point to an existing assembled activity ID

---

## Validation API

```js
validateVisualPlanningContract(page) → {
  valid: boolean,
  schema_version: string | null,
  authoritative_planning_present: boolean,
  errors: [{ code, message, path?, index?, affordance_id?, activity_id? }],
  warnings: [{ code, message, path?, ... }],
  summary: {
    activity_reviews, affordances, generate, defer, skip,
    page_scoped, activity_scoped
  }
}
```

- Deterministic error/warning ordering
- Stable machine-readable `code` values (`VPC_*`)
- No thrown exceptions for ordinary invalid authored data (programmer errors such as non-object `page` still throw)
- **Does not mutate** the input page

---

## Legacy behaviour

Pages with **none** of the three visual-planning fields remain valid legacy input:

- `authoritative_planning_present: false`
- No fields injected
- No fallback affordances created
- Renderer / handover behaviour unchanged

Partial presence (e.g. affordances without schema version) produces explicit diagnostics.

---

## Sprint 38 relationship

| Module | Role |
|--------|------|
| `lib/sprint38-visual-affordances.js` | Row-shape vocabularies + envelope validation; compose `applyToComposedPage` (mutating — **not** the Prism boundary) |
| `lib/visual-planning-contract.js` | Single Prism boundary: schema gate, activity cross-checks, evidence-anchor syntax, generate planning fields, summary |

Do not call `applyToComposedPage` for Prism planning input — use `validateVisualPlanningContract` only.

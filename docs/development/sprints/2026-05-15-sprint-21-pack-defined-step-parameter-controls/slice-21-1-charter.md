# Sprint 21 Slice 21-1 — Parameter Metadata + Generic Settings Renderer MVP

**Date:** 2026-05-15  
**Status:** **Closed** — see [`slice-21-1-closeout.md`](slice-21-1-closeout.md)  
**Sprint:** 21 — Pack-defined Step Parameter Controls  
**Slice:** 21-1

**Bootstrap:** [`sprint-21-bootstrap.md`](sprint-21-bootstrap.md)  
**Predecessor:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) — **135 tests**; Settings discoverability + provenance complete

**Verification baseline:**

```bash
node --test tests/*.test.js
```

**Expected at charter acceptance:** **135** passed, 0 failed (no regression before work begins)

---

## Deliberate simplicity (programme framing)

Sprint 21 is **not** a complex schema programme and **not** new synthesis logic. The existing pipeline already resolves factors, maps to `stepParams`, and stores values in `[PRISM_STEP_PARAMS]`. Slice 21-1 closes a **Settings operability gap**: authors can see param keys in summaries/provenance but often cannot edit them in Settings.

**Essential task (five steps):**

1. **Identify** pack-defined `stepParams` that already matter (start from existing `mappingRules` + Sprint 20 summary keys — do not invent a large new parameter catalogue).
2. **Describe** each relevant param with minimal human-readable metadata: `label`, `description`, `elicitation` (`elicited` | `settings-only`).
3. **Declare** minimal control metadata for **editable** params only: `controlType`, `default` / `options` where needed, `visible`, `advanced`.
4. **Render** those controls generically in Settings (one code path per `controlType`).
5. **Persist** edits back into `stepParams` via the existing `[PRISM_STEP_PARAMS]` block.

**Two tiers only (no extra categories):**

| `elicitation` | Meaning |
|---------------|---------|
| **`elicited`** | Small “must ask” tier — high-impact; already in brief/essentials today |
| **`settings-only`** | **Default** for richer tuning — available after generation; do not expand the wizard |

Do not add further elicitation enums, validation frameworks, or schema versions unless implementation genuinely requires them.

**Investigation note (code):** LD **Design Page** has mapped `stepParams` and shows **Tunable**, but `configurationMode: "none"` prevents today’s `userOptions` UI from rendering. Pack controls must render **without** depending on `configurationMode: simple`.

---

## Objective

For a **narrow LD pilot**, attach human-readable + control metadata to `stepParams` that already matter, render them generically in Settings, and persist through existing notes — **no** bespoke UI per parameter, **no** mapping or synthesis changes.

**Thesis (slice):** *Document what already maps; render by `controlType`; write back to `stepParams`.*

---

## Scope

| In scope | Detail |
|----------|--------|
| **Parameter metadata (minimal)** | Fields below only; LD pilot entries |
| **Metadata placement** | `workflowBriefConfig.stepParameterControls` (see § Metadata placement rationale) |
| **Generic renderer** | Factory Step Settings panel section: `select`, `boolean`, `number`, `text` |
| **Read path** | Current values from `[PRISM_STEP_PARAMS]` block in step `notes` (existing `readWorkflowStepParamsObject` semantics) |
| **Write path** | Update param object; re-serialize `[PRISM_STEP_PARAMS]`; preserve rest of notes |
| **Pilot steps** | `step_design_page`, `step_design_assessment`, `step_generate_assessment_items` (LD only) |
| **Pilot parameters** | Five controls (see § Pilot LD parameters) |
| **Coexistence** | Pilot steps show pack controls **in addition to** existing Prompt Factory flow; non-pilot steps unchanged |
| **Summaries** | Sprint 20 step summaries refresh from same param keys after save |
| **Tests** | `tests/workflow-step-parameter-controls.test.js` — schema normalization + render helpers via `__PRISM_TEST_API` |
| **LD pack edit** | Declarative metadata + options only — no change to `mappingRules` predicates or adequacy checks |

---

## Non-goals

| Item | Deferred to |
|------|-------------|
| Full LD pack parameter surface | 21-2 / 21-3 |
| Research pack or S1–S13 fixture changes | Separate charter |
| Advanced/basic **UI collapse** (default collapsed sections) | Slice 21-2 |
| `visible: false` internal param hiding at scale | Slice 21-2 |
| Provenance source relabelling after Settings edit | Slice 21-3 |
| Replacing `promptFactory.userOptions` / `configurationMode: simple` | Bridge only in 21-1; migration optional later |
| New brief factors or blocking adequacy predicates | Out of programme |
| Schema overhaul / JSON Schema programme | Out of programme |
| Prompt Studio merge | Out of programme |
| Utilities / page HTML renderer rewrite | Out of programme |
| Workflow diff / history | Out of programme |
| AI-generated labels or options | Pack-authored only |
| Runtime execution engine redesign | Propagation via existing hooks only |

---

## Architectural constraints

Slice 21-1 **must preserve** the Sprint 18–20 model:

| Constraint | Requirement |
|------------|-------------|
| **Lightweight elicitation** | No new mandatory brief questions; pilot `elicitation: elicited` params remain factors already in brief/essentials |
| **Essentials gating** | Unchanged — blocking only when unsafe/incomplete |
| **Planning adequacy** | Advisory only — no new `planningAdequacyChecks` |
| **No wizard regression** | No post-gen required queues; Ready stays non-blocking |
| **Mapping interpreter** | `applyWorkflowBriefMappings` unchanged |
| **Adequacy interpreter** | `evaluateWorkflowBriefPlanningAdequacyChecks` unchanged |
| **Provenance stack** | Sprint 20 panels unchanged in 21-1 (integration tests in 21-3) |
| **Generic runtime** | **No** `if (paramKey === "assessment_type")` UI branches — only `controlType` switches |
| **Pack-driven copy** | Labels, descriptions, options from pack metadata — not hard-coded in `app.js` |
| **Research frozen** | No Research pack edits |

**Rule:** Runtime interprets policy; domain packs declare policy. Slice 21-1 adds **Settings rendering policy** alongside existing mapping policy.

---

## Parameter metadata (minimal)

One object per **editable** param in `workflowBriefConfig.stepParameterControls[]`. Params that are display-only in 21-1 do not need an entry.

### Identity (required for every entry)

| Field | Description |
|-------|-------------|
| **`key`** | Leaf name under `stepParams` (e.g. `page_profile`) — must match an existing mapped key |
| **`canonicalStepId`** | Target step (e.g. `step_design_page`) |

### Human-readable (required)

| Field | Description |
|-------|-------------|
| **`label`** | Settings label |
| **`description`** | Short helper text |
| **`elicitation`** | `elicited` (small must-ask tier) or `settings-only` (default for richer tuning) |

`elicitation` is **documentary** in 21-1 — it does not add brief UI or new blocking questions.

### Control (required for editable params)

| Field | Description |
|-------|-------------|
| **`controlType`** | `select` \| `boolean` \| `number` \| `text` only |
| **`default`** | When absent from `[PRISM_STEP_PARAMS]` after mapping |
| **`options`** | Required for `select` |
| **`visible`** | `false` hides control (pilot: all `true`) |
| **`advanced`** | `true` = richer tuning (UI grouping in 21-2; pilot may render inline) |

### Optional (only if needed)

| Field | When |
|-------|------|
| **`min`** / **`max`** | `number` controls only |
| **`placeholder`** | `text` controls only |

**Not in v1:** JSON Schema, extra elicitation enums, versioning fields, AI-generated copy, prompt-instruction fields (those stay on `userOptions` / templates until migrated later).

### Example (illustrative)

```json
{
  "canonicalStepId": "step_design_page",
  "key": "tone_style",
  "label": "Tone",
  "description": "Voice and register for page content.",
  "controlType": "select",
  "default": "professional",
  "options": [
    { "value": "professional", "label": "Professional" },
    { "value": "conversational", "label": "Conversational" },
    { "value": "academic", "label": "Academic" }
  ],
  "visible": true,
  "advanced": true,
  "elicitation": "settings-only"
}
```

### Normalization rules (runtime)

- Unknown `controlType` → skip control + dev-only warning (no throw).  
- Missing `options` on `select` → skip control.  
- Duplicate `(canonicalStepId, key)` → first wins; log warning in tests.  
- Control list filtered to **active step** when Settings opens.

---

## Runtime responsibilities

| Responsibility | Owner | Slice 21-1 behaviour |
|----------------|-------|----------------------|
| Load metadata | Runtime | From active domain pack `workflowBriefConfig.stepParameterControls` |
| Resolve current value | Runtime | `readWorkflowStepParamsObject(step)` → `params[key]`; else metadata `default` |
| Render controls | Runtime | One renderer per `controlType`; DOM form controls in Step Settings flow |
| Validate input | Runtime | `number` min/max; `select` value ∈ options; `boolean` coercion |
| Persist | Runtime | Merge into params object; `serializeWorkflowStepParamBlock` into `notes` |
| Propagate to execution | Runtime | Existing step run / prompt build paths that already read `[PRISM_STEP_PARAMS]` |
| Labels in summaries | Runtime | Reuse `humanizeWorkflowSettingsParamKey` only as **fallback** if label missing |
| Elicitation tier | Pack metadata only | `elicited` = already asked in brief; `settings-only` = default for richer params — no runtime enforcement in 21-1 |

**Explicit non-responsibility:** Runtime does **not** invent pedagogical options; packs supply `options` and copy.

---

## Metadata placement rationale

**Chosen location:** `workflowBriefConfig.stepParameterControls` on the LD domain pack (sibling to `mappingRules`, `requiredFactors`, `planningAdequacyChecks`).

| Option | Verdict |
|--------|---------|
| **`workflowBriefConfig.stepParameterControls`** | **Selected** — co-locates factor → `stepParams` mappings with control definitions; one contract per domain; runtime already loads `workflowBriefConfig` for Factory brief flows |
| **Per-step `promptFactory` extension** | Rejected for v1 — duplicates metadata across many step patterns; couples pedagogy to Prompt Studio config shape |
| **Pack root sibling of `workflowBriefConfig`** | Rejected for v1 — splits brief policy from parameter policy |
| **`workflowBriefConfig` factor entries only** | Rejected — factors are brief-time; `stepParams` keys need step-scoped `canonicalStepId` |

**No versioning field in 21-1** — add only if a later slice needs migration machinery.

---

## Pilot LD parameters

**Domain:** Learning Design only.  
**Steps:** Three canonical steps already central to Sprint 20 discoverability and provenance.

| `canonicalStepId` | `key` | `controlType` | `advanced` | `elicitation` | Rationale |
|-------------------|-------|---------------|------------|---------------|-----------|
| `step_design_page` | `page_profile` | `select` | `false` | `elicited` | Brief factor; provenance + summaries already prioritize |
| `step_design_page` | `tone_style` | `select` | `true` | `settings-only` | Mapped; common tuning dimension |
| `step_design_page` | `depth_level` | `select` | `true` | `settings-only` | Mapped; common tuning dimension |
| `step_design_assessment` | `activity_type` | `select` | `false` | `elicited` | Maps from `assessment_type` factor |
| `step_generate_assessment_items` | `number_of_items` | `number` | `false` | `elicited` | Maps from `assessment_total_items` factor |

**Out of pilot (explicit):** `include_examples`, `difficulty_profile`, `question_style_mix`, sequencing/scaffolding params, Research steps, all non-LD domains.

**Options source:** Pilot `select` options must match existing LD factor choices / mapping value enums (pack-authored; align with `workflowBriefConfig` factor `choices` and current `stepParams` conventions).

**UI placement:** New section **Workflow parameters** (or equivalent) at top of Step Settings content for pilot steps, above existing Prompt Factory `userOptions` when present.

---

## Persistence + propagation expectations

### Read order

1. Parsed `[PRISM_STEP_PARAMS]` JSON in `step.notes`  
2. Else metadata `default`  
3. Do **not** read brief `resolvedState` directly in Settings UI (brief may be stale vs saved step); mapped values should already have been written at design/save time via existing mapping pipeline

### Write order

1. User edits control → update in-memory params object  
2. Re-serialize `[PRISM_STEP_PARAMS]` block; preserve non-param note text outside tags  
3. On step save / Settings apply: persist to workflow library step record  
4. Sprint 20 summaries: `buildWorkflowStepSettingsSummaryLines` (or successor) reads same keys — edited values visible without new chat

### Propagation

- **In scope:** Values available to existing prompt assembly that injects `stepParams` into step runs (same as today’s patch block).  
- **Out of scope:** Changing **how** models consume params beyond current `[PRISM_STEP_PARAMS]` contract.  
- **Factor sync:** Editing `activity_type` / `number_of_items` in Settings does **not** automatically rewrite brief `resolvedFactors` in 21-1 (avoids dual-writer complexity); provenance may show brief vs step divergence until 21-3.

---

## Test strategy

**New file:** `tests/workflow-step-parameter-controls.test.js`

| Area | Approach |
|------|----------|
| **Normalize metadata** | Pure functions: filter by `canonicalStepId`, dedupe, skip invalid `controlType` |
| **Value resolution** | `default` fallback; read mock step `notes` with param block |
| **Serialize round-trip** | Write param → parse block → equals expected |
| **Renderer helpers** | Build control descriptor list (no full DOM in Node); export via `__PRISM_TEST_API` |
| **Regression** | Full suite **135+** green; no Research fixture file changes |
| **Manual** | LD Factory run: open **Settings** on Design Page / Generate Assessment Items; edit pilot control; save; confirm summary line updates |

**Not required in 21-1:** Browser E2E; provenance label assertions (21-3).

---

## Risks + mitigations

| Risk | Mitigation |
|------|------------|
| **Incomplete metadata on non-pilot steps** | Pilot-only; fallback to existing `userOptions` / advanced config |
| **Dual source of truth** (brief factors vs step params) | Document deferral; 21-3 provenance rules; no brief writer in 21-1 |
| **Settings panel clutter** | Only five controls; advanced flagged for 21-2 collapse |
| **`userOptions` duplication** | Pilot section additive; avoid duplicating same key in `userOptions` for pilot steps |
| **Research regression** | LD-only pack metadata; no Research edits |
| **Elicitation creep** | `elicitation` metadata only; no new brief UI |
| **Bespoke UI creep** | Code review: switches on `controlType` only |
| **Invalid select values** | Runtime validation against `options` |

---

## Success criteria

| Criterion | Target |
|-----------|--------|
| Pilot metadata in LD pack | `stepParameterControls` with five entries, schema v1 fields |
| Generic renderer live | Four control types rendered for pilot steps in Factory Settings |
| Persist + reload | Edit survives step save; `[PRISM_STEP_PARAMS]` contains new value |
| Summaries update | Sprint 20 summary lines reflect edited pilot keys on saved steps |
| No brief regression | **135+** tests; LD profile thinning / adequacy suites unchanged |
| No new blocking flows | Ready non-blocking; no new required post-gen questions |
| Architecture | Mapping + adequacy interpreters untouched; no per-param UI branches |
| Research | Pack and S1–S13 fixtures unchanged |

---

## Implementation sequence (recommended)

1. Pack: five pilot entries in `stepParameterControls` (params that already matter).  
2. Runtime: filter/normalize helpers + tests.  
3. Runtime: generic render in Settings (independent of `configurationMode: simple`).  
4. Runtime: persist into `[PRISM_STEP_PARAMS]` via existing path.  
5. Manual LD validation checklist.

---

## References

| Document | Role |
|----------|------|
| [`sprint-21-bootstrap.md`](sprint-21-bootstrap.md) | Programme slices 21-2 / 21-3 |
| [`review-log.md`](review-log.md) | R21-001–R21-011; open questions resolved herein |
| [`sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) | Two-tier model |
| [`sprint-20-slice-1-closeout.md`](../../../consolidation/sprint-20-slice-1-closeout.md) | Summaries + Settings navigation |
| `domains/learning-design/domain-learning-design-step-patterns.md` | `workflowBriefConfig`, `mappingRules` |

---

## Charter decisions (resolves review-log open questions)

| Question | Decision |
|----------|----------|
| Metadata location | `workflowBriefConfig.stepParameterControls` |
| Control types v1 | `select`, `boolean`, `number`, `text` only |
| `userOptions` coexistence | Bridge — additive panel; no removal in 21-1 |
| LD pilot scope | Five params on three steps (table above) |
| Provenance after Settings edit | **Deferred** to Slice 21-3 |
| Simplicity framing | Five-step essential task; two elicitation values only; no schema programme |

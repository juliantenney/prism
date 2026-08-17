# S78-T-004 — Learner production / workspace fulfilment solution design

**Task:** S78-T-004  
**Status:** **DESIGN COMPLETE** (2026-08-17) — implemented by [S78-T-005](S78-T-005-dla-response-fulfilment-implementation.md)  
**Mode:** DESIGN ONLY — no implementation  
**Workstream:** 1 — Learner production / workspace fulfilment  
**Depends on:** [S78-T-001](S78-T-001-learner-production-workspace-fulfilment-diagnostic.md) (diagnostic complete)  
**Production / tests / prompts / schema / validators / renderer / assembly:** **UNCHANGED by this task**

---

## 0. Accepted T-001 diagnosis (not reopened)

See [S78-T-001](S78-T-001-learner-production-workspace-fulfilment-diagnostic.md). Summary:

- **Earliest proven layer:** DLA learner-production commissioning (Primary **B**).
- **Secondary:** GAM completes table bodies (**C**), static `text` path (**D**), non-enforced guarantees (**G**).
- **Renderer and assembly:** not owners; vNext already supports blank-cell table workspaces.
- **A3 moderate finding:** **DIFFERENT** — out of scope for this design.

---

## 1. Recommended repair architecture (single decision)

**Name:** **Response fulfilment binding (S78-WS-1)**

| Element | Decision |
| ------- | -------- |
| **Canonical owner** | **DLA commissioning contract** + **DLA partial-page capture validator** (`validateDlaPartialPageCapture` in `lib/page-dla-enrich.js`) |
| **Authoritative invariant** | Every **load-bearing learner production obligation** on an activity must be **explicitly bound** to ≥1 commissioned **learner response surface** (`required_materials[]` row with structured `response_fulfilment`) whose **response_kind** matches the obligation and whose **`material_type`** is in the allowed presentation set for that kind. |
| **Enforcement boundary** | **Primary:** DLA capture (fail-closed before GAM). **Secondary:** GAM capture (defence-in-depth for table body blank cells). |
| **GAM defence-in-depth** | When T-023 projection includes `response_fulfilment.kind === "learner_workspace"` on a table-family row, **reject** GAM bodies with **zero** learner-completion blank cells (reuse `materialHasBlankTableCells()`). |
| **Assembly impact** | **None** — preserve transport semantics. |
| **Renderer impact** | **None** — no aliases, fallbacks, or moment-placement changes in this repair. |
| **Regression protection** | Contract tests + capture-validator tests + one generic end-to-end render fixture (architecture-generic, Lagrangian-shaped labels only). |

This is the **smallest canonical design** that closes the proven T-001 chain without Lagrangian hard-coding, renderer compensation, or a general widget platform.

---

## 2. Canonical invariant

### 2.1 Core rule (normative)

> **S78-WS-1:** For each activity, every **load-bearing learner production obligation** must have ≥1 **operational response affordance** commissioned as an explicit **learner response surface** before GAM runs.

An **operational response affordance** means: downstream vNext can expose **persistent learner input** (`table_entry`, `text_entry`, or existing ordering workspace) **without** hand-editing generated bodies.

### 2.2 Distinctions the invariant must preserve

| Distinction | Rule |
| ----------- | ---- |
| **Learner production vs instructional content** | Production obligations require `response_fulfilment` on a material row; teaching/model/reference rows **must not** carry `response_fulfilment` unless they are combined evidence workspaces (existing Sprint 72 pattern). |
| **Response semantics vs presentation** | **`response_kind`** (semantic) is authoritative; **`material_type`** (presentation) must be in the allowed set for that kind — not the other way around. |
| **Required affordance vs optional support** | Checklists, sample_output, consolidation_summary, ordinary `text` exposition are **scaffold/check** unless explicitly bound as the production surface (they should not satisfy table-completion production). |
| **Structured vs free-text production** | Separate `response_kind` families (table_* vs text_compose) map to different material-type sets. |
| **Workspace vs model** | `worked_example` / completed tables in `text` = **model/instruction**; learner workspace = commissioned row with `response_fulfilment`. |

### 2.3 What the invariant is not

- Not “every activity needs an input box.”
- Not “every table is editable.”
- Not “every learner_task verb triggers a workspace.”
- **Study/read/verify/checklist-only steps** are excluded via production-step classification (see §4).

### 2.4 Load-bearing production obligation (source of truth)

Derived **deterministically** at validation time from:

1. **`learner_task`** — parsed via existing `parseLearnerTask()` into ordered steps.
2. **`expected_output`** — corroborates artefact type when task steps are ambiguous.
3. **Classification** — each non-excluded step receives at most one **`response_kind`** from a fixed enum (§4.2).

**Excluded steps** (not load-bearing production): study/read/review/work-through/examine; verify/checklist/self-check/revise-only; “compare your response/thinking” post-hoc checks. Align with `compose-generic-moments.js` `studyOnlyRe` / `hasAuthoredResponseIntent` and `compose-moment-classification.js` `VERIFY_INSTRUCTION_PATTERN` / `LEARN_INSTRUCTION_PATTERN`.

**Not verb-list-only:** classification uses step semantics + `expected_output` + optional binding to `response_fulfilment` rows; verbs are signals, not the sole authority.

---

## 3. DLA repair point

### 3.1 Where the invariant becomes authoritative

| Surface | Location | Change (future implementation) |
| ------- | -------- | ------------------------------ |
| **Production obligation** | DLA §4 Production (`buildDlaSectionProduction`) | Extend step 1: after defining `learner_task` / `expected_output`, commission must **bind** each load-bearing production to a `response_fulfilment` material row. |
| **Commissioning** | DLA §Commissioning (`buildDlaSectionCommissioning`) | Add **`response_fulfilment`** shape rules parallel to `evidence_requirement` (optional object, only on learner-response rows). |
| **Material vocabulary** | DLA §6 (`77-DLA-CANONICAL-3`) | **Unchanged** — no new `material_type` tokens. |
| **Workbook overlay** | G5 / DLA-WB-15 / WB-06a | **Reinterpreted** as special cases of S78-WS-1 (table compare + partial exemplar); not a separate ad hoc rule. |
| **Capture validator** | `validateDlaPartialPageCapture` | **New fulfilment gate** (§5). |

### 3.2 T-001 exhibit — what becomes impossible

For an activity whose classified production includes **`table_compare`** or **`table_complete`**:

**FAIL at DLA capture** if `required_materials` contains **only**:

- `text`, `explanatory_note`, `checklist`, `modelling_note`, `worked_example`, `sample_output`, `reference_table`

…with **no** row carrying `response_fulfilment` + table-family `material_type`.

This blocks the T-024 A1 pattern generically — not because of the phrase “enter responses into a comparison table,” but because **table-class production is unbound to a learner workspace row**.

Embedding a completed pipe table inside `text` **cannot** satisfy table production (presentation path is static; no `response_fulfilment` on a table-family row).

---

## 4. Required commissioning semantics

### 4.1 New structured field: `response_fulfilment` (on `required_materials[]` only)

Parallel to `evidence_requirement` — **optional**, only when this row is the commissioned learner response surface.

```json
"response_fulfilment": {
  "kind": "learner_workspace",
  "response_kind": "table_compare",
  "binds_production_steps": [3],
  "allows_partial_exemplar": true
}
```

| Field | Required | Meaning |
| ----- | -------- | ------- |
| `kind` | yes | `"learner_workspace"` \| `"learner_text_production"` |
| `response_kind` | yes | Semantic production surface (enum §4.2) |
| `binds_production_steps` | optional | 1-based `learner_task` step numbers this row fulfils; if omitted, validator matches any unbound obligation of that `response_kind` |
| `allows_partial_exemplar` | optional | Default `true` for table kinds; documents G5 partial-row intent for GAM |

**Do not** add Lagrangian-specific values. **Do not** invent new `material_type` tokens.

### 4.2 `response_kind` enum (initial set — extensible only with explicit design)

| `response_kind` | Meaning | Allowed `material_type` presentations |
| --------------- | ------- | ------------------------------------- |
| `table_compare` | Compare entities/dimensions in tabular form | `comparison_table` |
| `table_complete` | Fill blank cells in a structured table | `analysis_table`, `decision_table`, `classification_table`, `planning_table`, `data_table`, `impact_table`, `comparison_table`, `template` |
| `table_decide` | Decision/judgement table completion | `decision_table`, `analysis_table` |
| `table_classify` | Classification grid completion | `classification_table` |
| `table_plan` | Planning table completion | `planning_table` |
| `text_compose` | Extended written production | `prompt_set`, `template`, `task_card` |
| `ordering` | Sequence/rank/prioritise manipulation | *(defer to existing ordering commission — **out of initial implementation slice** unless already commissioned via ordering semantics)* |

**Display-only / reference tables:** `reference_table` in `text`/`explanation` beats — **no** `response_fulfilment`. Validator must not require blanks on reference-only rows.

### 4.3 Purpose / specification (retained, strengthened)

Existing non-empty `purpose` + `specification` remain **binding GAM bounds**. For rows with `response_fulfilment`:

- **`specification` must state** learner-completion bounds (row count, columns learners fill, partial exemplar allowed, exclusions such as DLA-WB-15 no pre-supplied scores).
- **`purpose` must not** describe only exposition/checking when `response_fulfilment` is present.

`instructional_archetype` / `archetype_plan` remain **orthogonal** — they route GAM genre but do **not** replace `response_fulfilment`.

### 4.4 Answer: what must DLA express?

DLA must emit, on at least one `required_materials` row per load-bearing production obligation:

1. **`response_fulfilment.response_kind`** — what form of learner response is required.
2. **`material_type`** — presentation token from §6 vocabulary that vNext can render as an input surface for that kind.
3. **`specification`** — bounds ensuring GAM leaves learner-completion loci empty (and partial exemplar rules where allowed).

Downstream stages (GAM T-023 projection) must receive **`response_fulfilment`** in the authoritative commission projection alongside purpose/specification.

---

## 5. Fail-closed fulfilment gate design

### 5.1 Placement

**Primary gate:** `validateDlaPartialPageCapture` (`lib/page-dla-enrich.js`) — after existing material-contract checks, before operator proceeds to GAM.

**Rationale:** Earliest proven causal layer is DLA commission; fail before model spend on GAM.

**Not chosen as primary:** renderer audit, assembly, post-render QA.

### 5.2 Inputs examined

Per activity:

- `learner_task`, `expected_output`
- `required_materials[]`: `material_id`, `material_type`, `purpose`, `specification`, `response_fulfilment`, `instructional_archetype`, `evidence_requirement` (to exclude combined-workspace false positives)

### 5.3 Algorithm (deterministic)

1. Parse `learner_task` → steps.
2. Classify each step → `response_kind` | `study` | `verify` | `none`.
3. Collapse to set **P** = load-bearing production kinds required for the activity (corroborate with `expected_output` when step classification yields `none` but expected output names a completable artefact).
4. For each `p ∈ P`, find rows where `response_fulfilment.response_kind === p` (or compatible superset mapping) **and** `material_type` ∈ allowed set for `p`.
5. **PASS** iff every `p ∈ P` has ≥1 matching row.
6. Additional **consistency checks:**
   - Row with `response_fulfilment` must not use display-only types (`reference_table` unless `kind` is not learner workspace — reference tables never fulfil production).
   - `text` / `checklist` / `worked_example` **cannot** fulfil `table_*` kinds.
   - Duplicate conflicting bindings for the same step → **FAIL** (ambiguous).

### 5.4 PASS / FAIL

| Result | Condition |
| ------ | --------- |
| **PASS** | All load-bearing production kinds bound; types compatible; no forbidden bindings |
| **FAIL** | Any unbound production kind; incompatible material_type; teaching-only materials only |
| **FAIL (ambiguous)** | Classifier yields production kind but multiple incompatible bindings; operator must disambiguate `binds_production_steps` |

### 5.5 Diagnostic output (on FAIL)

Structured errors, e.g.:

```text
S78_WS_UNBOUND_PRODUCTION: activities[0] (A1) requires response_kind=table_compare from learner_task step 3; no required_materials[] row with response_fulfilment + compatible material_type
S78_WS_INCOMPATIBLE_TYPE: activities[0].required_materials[1] (A1-M2) has response_fulfilment.table_compare but material_type=text
```

Include: `activity_id`, step number/text snippet, required `response_kind`, material_ids examined.

### 5.6 Ambiguous cases

| Case | Handling |
| ---- | -------- |
| Task says “complete table” but expected_output is vague | **FAIL** if table kind inferred and unbound; prefer `table_complete` |
| Study step mentions a table | **Exclude** from P (study-only pattern) |
| Combined evidence workspace | Existing Sprint 72 rules; **separate** from S78-WS-1 unless production is explicitly in learner_response columns |
| Checklist verifies table | Checklist does **not** satisfy production binding |
| Ordering production | **Defer** from slice 1 unless ordering commission already explicit |

---

## 6. GAM defence-in-depth design

### 6.1 Placement

**Secondary gate:** `validateGamPartialPageCapture` (`lib/page-gam-enrich.js`) — after body/format checks.

### 6.2 Condition

When authoritative commission (T-023 projection or stored DLA `required_materials` lookup by `material_id`) includes:

```json
"response_fulfilment": { "kind": "learner_workspace", ... }
```

and `material_type` is in **table-family** (`table-material-types.js` `TABLE_MATERIAL_TYPES` minus `reference_table`):

→ GAM material body (markdown) **must** satisfy `materialHasBlankTableCells()` from `lib/learner-renderer-vnext/table-material-parse.js`.

### 6.3 Partial exemplar (legitimate)

**PASS** when:

- ≥1 blank learner-completion cell exists, **and**
- fixed/model rows/cells may be populated (heteroscedasticity A2-M2 pattern — `tests/learner-renderer-vnext-compose-a2-table-workspace.test.js`).

**FAIL** when:

- All learner-completion loci filled (zero blank cells in data rows) — T-001 secondary **C**.

### 6.4 Non-substitute rule

GAM guard **does not** replace DLA binding. If DLA failed to commission a workspace row, GAM must **not** silently add one; DLA capture should have already failed.

### 6.5 Prompt alignment (implementation note)

`LD-TABLE-FIDELITY` author lines remain; implementation should cross-reference `response_fulfilment` in GAM brief when projected from DLA (T-023 extension — design only here).

---

## 7. Cross-layer responsibility contract

```text
Production required (learner_task + expected_output)
  → DLA commissions required_materials[] row with response_fulfilment + compatible material_type + spec bounds
  → [GATE: validateDlaPartialPageCapture S78-WS-1]
  → GAM authors markdown body preserving blank completion cells
  → [GATE: validateGamPartialPageCapture table blank-cell guard]
  → Assembly preserves material_type + body (page-gam-materials-preserve)
  → vNext composes Do moment + tableWorkspace / text_entry
  → Renderer exposes util-learner-table-workspace__input or text_entry
```

| Layer | Must do | Must not do |
| ----- | ------- | ----------- |
| **DLA** | Bind production → response surface; enum + type compatibility | Emit production tasks satisfied by teaching/checklist types alone |
| **DLA validator** | Fail-closed unbound/incompatible bindings | Infer/fix commissions heuristically |
| **GAM** | Preserve blank cells on bound workspace rows | Invent workspace rows not commissioned |
| **GAM validator** | Reject all-filled completion tables for bound workspace rows | Reject legitimate partial exemplars |
| **Assembly** | Transport fidelity | Create/editability semantics |
| **Renderer** | Map blanks → inputs; filled → fixed | Force inputs over authored filled cells |
| **QA** | Measure learner-facing result | Weaken benchmark |

**Earliest failure point:** DLA partial capture (primary). **Secondary:** GAM partial capture.

---

## 8. Assembly and renderer impact verification

| Layer | T-004 conclusion |
| ----- | ---------------- |
| **Assembly** | **No change.** T-001 found no semantic mutation; S78-WS-1 ensures correct material_type + body arrive at renderer. |
| **Renderer** | **No change.** Blank-cell policy is correct; moment placement for table-family types on `guided_practice` beats already routes to Do (`archetype-canonical-binding.js`). |
| **Moment-placement defect** | **Not evidenced.** If future run fails with correct commission but Learn-moment placement, that would be a **separate** diagnostic — not assumed in this design. |

---

## 9. Regression test design (implementation phase — not built in T-004)

| # | Test | Level | Expect |
| - | ---- | ----- | ------ |
| R1 | **Positive table compare** — generic activity, `table_compare` bound to `comparison_table`, GAM body with blank cells, render | Integration (`buildPageModel` + `renderLearnerPageHtml`) | Do moment HTML contains `util-learner-table-workspace__input` |
| R2 | **Negative commission (T-001 class)** — `learner_task` requires table completion; materials only `text`+`checklist` | `validateDlaPartialPageCapture` | `ok: false`, code `S78_WS_UNBOUND_PRODUCTION` |
| R3 | **Negative incompatible type** — `response_fulfilment.table_compare` on `material_type: text` | DLA capture validator | `S78_WS_INCOMPATIBLE_TYPE` |
| R4 | **Negative GAM filled table** — valid DLA commission; GAM body all cells populated | `validateGamPartialPageCapture` | Fail with table blank-cell code |
| R5 | **Partial exemplar** — comparison/analysis table with one fixed example row + blank rows | GAM validator PASS; render has mix of fixed cells + inputs | Matches A2-M2 cell-fidelity pattern |
| R6 | **Display-only reference** — `reference_table` in Learn, no `response_fulfilment` | Render + validator | Static table; no forced `table_entry` |

Fixtures: **architecture-generic** labels (e.g. “Entity A / Entity B”), not Lagrangian coefficients. Lagrangian used only in manual Gate/regeneration, not hard-coded in test strings.

---

## 10. Rejected alternatives

| Alternative | Why rejected |
| ----------- | ------------ |
| **Renderer fallback** — force inputs on static `text` tables when task mentions “table” | Compensates for bad commissioning; violates T-001 renderer non-ownership |
| **Verb-regex-only DLA prompt** | Brittle; existing semantic fields + enum stronger |
| **`material_type` alone** (require `comparison_table` whenever “compare”) | Presentation-only; breaks template/prompt_set text production paths |
| **Specification magic string only** (e.g. `RESPONSE_WORKSPACE:`) without structured field | Harder to project via T-023; weaker diagnostics |
| **GAM-only repair** | Does not fix earliest causal layer; GAM faithfully reproduced T-024 commission |
| **Post-render QA gate only** | Too late; wastes generation cycles |
| **New universal `worksheet` type** | Unnecessary; §6 vocabulary sufficient |
| **Bind production only via archetype G5** | Only applies when workbook overlay fires; Lagrangian A1 failed without it |

---

## 11. Scope explicitly not addressed

- **S78-T-002** — modelling/practice independence  
- **S78-T-003** — Check/revision architecture  
- **Activity 3 moderate** — mathematical workspace as free-text scaffolding (**DIFFERENT**)  
- **Ordering workspace** — initial implementation slice may defer `response_kind: ordering` unless already in scope elsewhere  
- **Combined evidence workspace** — Sprint 72 rules unchanged  
- **Renderer redesign / new widgets**  
- **Lagrangian hand-edit or content tuning**  
- **EP / Design Page** changes (downstream receives fixed commissions)

---

## 12. Recommended implementation decomposition

Implement in order — **each task authorised separately**:

| Task | Scope | Files (anticipated) |
| ---- | ----- | ------------------- |
| **S78-T-005** | DLA contract text: §4/§Commissioning + `response_fulfilment` shape in canonical assembler; T-023 projection includes field; prompt tests | `lib/ld-dla-page-enrich-contract.js`, projection in `app.js` / GAM bind path, `tests/ld-dla-*` |
| **S78-T-006** | DLA capture validator: production classifier + S78-WS-1 gate + diagnostics | `lib/page-dla-enrich.js`, `lib/dla-production-fulfilment.js` (new small module), tests |
| **S78-T-007** | GAM capture validator: blank-cell guard for bound workspace rows | `lib/page-gam-enrich.js`, tests |
| **S78-T-008** | Regression suite R1–R6 + fresh Lagrangian regeneration Gate (operator QA) | tests + sprint Gate record |

**Do not** combine validator + contract in one unreviewed commit. **Gate:** after T-008, fresh Lagrangian EP→QA per Sprint 78 charter — not part of T-005–007 alone.

---

## 13. Verification

| Criterion | Met? |
| --------- | ---- |
| Single recommended architecture (not a menu) | Yes — S78-WS-1 |
| Addresses T-001 Primary B at DLA layer | Yes |
| GAM defence-in-depth specified | Yes |
| Assembly/renderer default unchanged | Yes |
| Regression strategy defined | Yes |
| No implementation in T-004 | Yes |

---

## 14. References

- [S78-T-001](S78-T-001-learner-production-workspace-fulfilment-diagnostic.md)  
- [S77-T-024](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-024-gam-e1-and-case-1-bound-gate-c.md)  
- `lib/ld-dla-page-enrich-contract.js` · `lib/page-dla-enrich.js` · `lib/page-gam-enrich.js`  
- `lib/learner-renderer-vnext/table-material-parse.js` · `lib/learner-renderer-vnext/completion-table-workspace.js`  
- [S76-T-039](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/S76-T-039-dla-p01-r1-intermediate-operand-solution-design.md) (structured-field pattern reference)

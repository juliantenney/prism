# S76-T-023 — DLA-P01 / P02 / P03 implementation plan

**Task:** S76-T-023  
**Mode:** IMPLEMENTATION PLANNING ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, workflow, or Settings changes  
**Depends on (accepted):**  
[S76-T-010](S76-T-010-dla-audit-report.md) · [S76-T-020](S76-T-020-dla-p02-solution-design.md) · [S76-T-021](S76-T-021-dla-p01-solution-design.md) · [S76-T-022](S76-T-022-dla-p03-solution-design.md)  
**Sprint:** 76 Phase 2  
**Out of scope:** DLA-P04 prompt rationalisation · DLA-P05 Copy dual-injection repair · fresh generation · Settings  
**P03 correction (2026-08-13):** type-echo fail-close applies to `specification` only, not `purpose` (aligns [T-022](S76-T-022-dla-p03-solution-design.md)).

This artefact is a **reviewable change plan**. It does not authorise implementation.

---

## A. Executive implementation strategy

Implement P01, P02, and P03 as **one coordinated DLA contract + validator + test change-set**, with a **minimal** DLA prompt/shape edit so the model can emit the new structure, and **almost no GAM behavioural change**.

| Problem | Code meaning of “done” |
| ------- | ---------------------- |
| **P01** | Every DLA activity emits `task_material_decision`; validators close shape + id referential integrity; `required_materials` is always an array. No `learner_task` lexical inference. |
| **P02** | `validateEvidenceDecisionClosure` no longer fail-closes from `taskLooksEvidenceDependent`. Provider closure stays. New: `required: true` ⇒ `provider_material_ids` ⊆ `task_input_material_ids`. Prefer requiring `evidence_decision` on every activity. |
| **P03** | Every `required_materials[]` row has non-empty `purpose` and `specification`. `specification` must not be only the type token after normalisation. `purpose` is presence-only (no type-echo fail-close; no semantic/lexical quality rule). |

**GAM** continues to fulfil `required_materials[]` 1:1. It must not interpret `task_material_decision`. The only planned GAM prompt edit is: treat `specification` as **binding** (parity with `evidence_requirement`).

**Migration:** strict on **DLA capture / enrich validation**. Do **not** default a missing `task_material_decision` to `separate_inputs_required: false`. Update in-repo fixtures that pass through those validators. Stored IndexedDB learner pages are **not** re-run through DLA capture on render (S75-D21). No new schema-version framework (`schema_version` remains `"2.0.0"`).

**Benchmarks:** first Roman Roads / Lagrangian runs **after this change-set and before P04/P05**.

---

## B. Accepted contracts

Unchanged from T-020 / T-021 / T-022. Short restatement for implementers:

```text
EP choreographs → DLA designs/commissions → GAM fulfils
Deterministic logic closes structured consequences of DLA decisions
```

- **P01** `task_material_decision { separate_inputs_required, task_input_material_ids[] }` — separate operands, not “any materials.”  
- **P02** `evidence_decision.required` — particulars as **grounds**; not material-required; not provenance.  
- **P03** existing `purpose` + `specification` — job + GAM bounds; not a new schema.  
- **Compose:** every provider is a task input; not every task input is a provider; P01-present + P03-sufficient + P02-false is legal.

---

## C. Exact implementation surfaces

Classification: **CHANGE REQUIRED** · **TEST ONLY** · **VERIFY ONLY** · **NO CHANGE**

### C.1 Production — DLA contract / Copy assembly

| Path / symbol | Class | Why |
| ------------- | ----- | --- |
| `lib/ld-dla-page-enrich-contract.js` `buildDlaPageEnrichContractBlock` | **CHANGE REQUIRED** | Minimal planning-order + field meanings (P01/P02/P03). Dual-injected (P05). |
| same file `buildCanonicalDlaPageShapeSnippet` | **CHANGE REQUIRED** | Add `task_material_decision`; add `specification` (currently omitted). |
| same file `CONTRACT_VERSION` (`58-DLA-PARTIAL-3`) | **CHANGE REQUIRED** | Bump for observability (e.g. `76-DLA-PARTIAL-4`). |
| `app.js` `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE` (~8755) | **CHANGE REQUIRED** | List `task_material_decision`; mark purpose/specification required. |
| `app.js` `buildDlaV2CopilotSchemaInstructions` (~10645) | **VERIFY ONLY** | Already concatenates contract + shape; picks up lib edits. |
| `app.js` `applyEpisodePlanDlaPopulationPromptBlockToDraft` (~12002) | **VERIFY ONLY** | Second injection of the same contract (P05). Do not add a third copy. |
| `app.js` `buildUpstreamPageShellEmbedSectionForDlaCopy` (~10658) | **NO CHANGE** (this task) | Long evidence-heuristic paragraph; **not on production partial Copy** (embed empty when `isPartialPageOutputWorkflowEnabled`). P04 later. |
| `index.html` `lib/page-dla-enrich.js?v=…` (~1356) | **CHANGE REQUIRED** | Cache pin when `page-dla-enrich.js` changes. |

### C.2 Production — DLA validators / enrich

| Path / symbol | Class | Why |
| ------------- | ----- | --- |
| `lib/page-dla-enrich.js` `validateDlaPartialPageCapture` | **CHANGE REQUIRED** | P01 object + array; P03 row fields; P02 closure without prose fail-close. |
| `lib/page-dla-enrich.js` `validateDlaEnrichedPage` | **CHANGE REQUIRED** | Same checks (avoid partial/full divergence). Keep existing “array required when beats exist” **and** always-array rule. |
| `lib/page-dla-enrich.js` `validateEvidenceDecisionClosure` | **CHANGE REQUIRED** | Remove `inferredEvidenceDemand` fail-closed branches (~1362, 1366–1368, 1406–1408, 1416–1418). Keep provider/shape/scaffold-role closure. Add provider ⊆ task-input ids. Require decision object always. |
| `lib/page-dla-enrich.js` `taskLooksEvidenceDependent` | **CHANGE REQUIRED** (call path) | Remove from fail-closed. **Retain** if still used by warn-only `activityLooksSourceAnalytical` (~662, ~856). |
| `lib/page-dla-enrich.js` `looksLikeProceduralTaskMaterialPractice` | **DELETE if unused after call-path change**; else keep only as helper of retained warn heuristic | S76 carve-out exists solely to defeat fail-closed P02. |
| `lib/page-dla-enrich.js` `looksLikeInstructionalScaffoldNotSourceEvidence` | same as heuristic stack | S75-D15 helper. |
| `lib/page-dla-enrich.js` `validateEvidenceDecisionShape` | **CHANGE REQUIRED** (light) | Call for every activity (object required). |
| `lib/page-dla-enrich.js` `validateEvidenceRequirementShape` | **NO CHANGE** | Already requires provider `purpose` / `learner_action` / `observable_features`. |
| `lib/page-dla-enrich.js` `materialLooksTeachingOnly` | **KEEP** | Structural provider-role closure from row purpose/spec, not `learner_task` boolean inference (T-020). |
| `lib/page-dla-enrich.js` **new** `validateTaskMaterialDecisionClosure` | **CHANGE REQUIRED** | Shared by partial + full. |
| `lib/page-dla-enrich.js` **new** `validateOrdinaryMaterialCommission` | **CHANGE REQUIRED** | P03: non-empty `purpose` and `specification`; type-echo fail-close on `specification` only; reuse `tokenizeMaterialType` (~285). |
| `lib/page-dla-enrich.js` `enrichActivityWithDla` | **CHANGE REQUIRED** | Emit `task_material_decision` so enrich pages pass the same validators. Do **not** invent practice operands from beats. |
| `lib/page-dla-enrich.js` `buildEvidenceDecisionForActivity` | **VERIFY ONLY** | Enrich-only; sets boolean from existing providers. Do not let it define Copy P02 semantics. |
| `lib/page-dla-enrich.js` `buildRequiredMaterialsFromPlan` / `FUNCTION_TO_MATERIAL_TYPE` | **NO CHANGE** | Beat→type is not P01 (T-010/T-021). |
| `lib/page-dla-enrich.js` `collectDlaEvidenceQualityDiagnostics` | **VERIFY ONLY** | Warn-only; may keep `activityLooksSourceAnalytical`. Must not fail-close the boolean. |
| `app.js` `validateDlaOrPageCapture` (~10574) | **VERIFY ONLY** | Delegates to `validateDlaPartialPageCapture`. |

### C.3 Production — assembly / GAM / renderer

| Path / symbol | Class | Why |
| ------------- | ----- | --- |
| `lib/page-vnext-assemble.js` `mergeActivitiesById` | **VERIFY ONLY** | `Object.assign` copies unknown DLA fields including `task_material_decision`. |
| `lib/page-vnext-assemble.js` `validateAssembledPageForRender` | **NO CHANGE** | Envelope only; not DLA commissioning. |
| `lib/page-gam-enrich.js` `normalizeGamCaptureToPage` / `mergeGamMaterialsIntoPage` | **VERIFY ONLY** | Partial GAM attaches `materials[]` onto DLA baseline; new field lives on baseline. |
| `lib/page-gam-enrich.js` `GAM_DLA_OWNED_JSON_FIELDS` | **CHANGE REQUIRED** (defensive preservation) | Add `evidence_decision` and `task_material_decision` so full-page GAM cannot drop them. **Not** semantic consumption. |
| `lib/page-gam-enrich.js` `validateGamEnrichedPage` 1:1 | **NO CHANGE** | Still `required_materials` ↔ `materials` ids. |
| `app.js` `buildGamV2CopyMaterialAuthoringBrief` (~11248) | **CHANGE REQUIRED** | One sentence: honour `specification` as binding (with purpose / `evidence_requirement`). |
| `app.js` `applyGamPackTextValidationToCapture` (~16258) | **VERIFY ONLY** | 1:1 when DLA baseline exists. |
| `lib/ld-gam-page-enrich-contract.js` | **NO CHANGE** this task | Evidence fulfilment already binding; ordinary spec is Copy-brief, not a GAM redesign. P04/depth out of scope. |
| `lib/beat-material-registry.js` `validatePageBeatMaterialClosure` | **NO CHANGE** | Renderer beats ↔ GAM bodies. |
| `lib/dla-38l-obligation-check.js` | **NO CHANGE** | Pack/harness; lexical. |
| Renderer (`lib/learner-renderer-vnext*`) | **NO CHANGE** | Does not render `required_materials` as learner body. |

### C.4 Tests / fixtures (see also §K, §N)

| Path | Class |
| ---- | ----- |
| **New** `tests/s76-dla-p01-p02-p03-contract.test.js` | **TEST ONLY** (create in implementation) — matrix §K |
| `tests/s76-dla-procedural-task-evidence-validation.test.js` | **UPDATE** |
| `tests/s75-dla-evidence-decision-false-positive.test.js` | **REPLACE** fail-closed assertions; **UPDATE** shapes |
| `tests/sprint-72-evidence-centred-activity-slice.test.js` | **REPLACE** prose fail-close cases; **KEEP** provider-closure cases |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | **UPDATE** if planning-order text changes; **KEEP** PRE-EMIT/audit tests (P04) |
| `tests/ld-instructional-archetype-*.test.js` that call `validateDlaPartialPageCapture` | **UPDATE** shapes |
| `tests/page-dla-enrich.test.js` | **UPDATE** enrich emission + any pages missing spec/decision |
| `tests/page-partial-capture-validate.test.js` | **UPDATE** via fixture |
| `tests/ld-instructional-archetype-production-planning.test.js` | **UPDATE** `CONTRACT_VERSION`; shape snippet assertions |
| `tests/fixtures/page-assemble/dla-partial.json` | **UPDATE** (used by capture validate) |
| `tests/page-vnext-assemble.test.js` and other dla-partial consumers | **VERIFY ONLY** after fixture update (passthrough) |
| `tests/fixtures/dla/*.json` (RNA-HCV) | **VERIFY ONLY** — not passed to `validateDla*` today |
| `tests/workbook-contract-prompt-surface.test.js` | **NO CHANGE** — pack, not Copy |
| `tests/ld-instructional-archetype-gam-copy-delivery.test.js` | **VERIFY ONLY** after GAM brief sentence |

---

## D. Current → target shape

**CURRENT** (Copy DLA activity, condensed):

```text
activities[] {
  activity_id, title,
  learner_task,
  expected_output,
  activity_preamble, intellectual_coherence_bridge, cognition…,
  evidence_decision? { required, reason, provider_material_ids[] },
  required_materials? [ { material_id, material_type|type, purpose?, specification?,
                           evidence_requirement?, instructional_archetype? } ]
}
```

**TARGET:**

```text
activities[] {
  activity_id, title,
  learner_task,
  expected_output,
  …cognition / preamble / bridge…,
  task_material_decision {          // NEW — P01; required
    separate_inputs_required: boolean,
    task_input_material_ids: string[]
  },
  required_materials: [ … ],        // always an array (may be [])
  evidence_decision {               // required object — P02
    required, reason, provider_material_ids[]
  }
}
```

**Field order in the canonical snippet (implement this order):**  
`learner_task` → `expected_output` → `task_material_decision` → `required_materials` → `evidence_decision`  
(Planning: production → inputs → commissions → epistemic role.)

**Who must know the new field**

| Layer | Must know? |
| ----- | ---------- |
| DLA prompt/shape | **Yes** |
| DLA validators | **Yes** |
| `enrichActivityWithDla` | **Yes** (emit) |
| `normalizeDlaCaptureToPage` | **No** (deep clone / merge keeps unknown keys) |
| `mergeActivitiesById` | **No** (passthrough) |
| GAM generation | **No** |
| GAM preservation list | **Yes, defensive** (`GAM_DLA_OWNED_JSON_FIELDS`) |
| Renderer | **No** |

No JSON Schema file exists for this activity object. `schema_version` stays `"2.0.0"`. Do not invent version-aware validation.

---

## E. P01 implementation plan

### Where required

| Surface | Policy |
| ------- | ------ |
| Production partial Copy (`validateDlaPartialPageCapture`) | **Required** on every activity |
| Full/enriched DLA (`validateDlaEnrichedPage`) | **Required** (same helper — no divergence) |
| Historical IndexedDB pages | **Not** re-validated at render. Re-paste of DLA Copy **is** strict |
| In-repo fixtures used as DLA captures | **Migrate** (§J) |
| Non-Copy `enrichActivityWithDla` | **Emit** a structurally valid object (§E.3) |

### Deterministic checks (shared helper)

1. `task_material_decision` is a non-array object.  
2. `separate_inputs_required` is boolean.  
3. `task_input_material_ids` is an array.  
4. Each id is a non-empty string.  
5. Ids unique (fail on duplicates).  
6. If `true`: length ≥ 1.  
7. If `false`: length === 0.  
8. Each id equals some `required_materials[].material_id` on **this** activity.  
9. `required_materials` is an array (empty allowed iff `separate_inputs_required` is false; teaching/scaffold rows still allowed when false).  

**Do not** parse `learner_task`.

Replace today’s full-page rule “non-empty `required_materials` only when beats exist” with: **array always present**; non-empty remains a **consequence** of beats on enrich, not a substitute for P01.

### E.3 Enrich emission (non-Copy)

`enrichActivityWithDla` (~1905):

- Always set `required_materials` to an array (already).  
- After `applyEvidenceProviderSelection`:  
  - If any `evidence_requirement` rows exist → `separate_inputs_required: true`, `task_input_material_ids` = those `material_id`s.  
  - Else → `false`, `[]`.  

This does **not** commission Lagrangian-style practice problems (beat→`template` unchanged). It only keeps enrich output **valid** under the new validators. Product P01 remains Copy-generative.

---

## F. P02 implementation plan

### Fail-closed prose inference — call paths

| Site | Current | Action |
| ---- | ------- | ------ |
| `validateEvidenceDecisionClosure` `inferredEvidenceDemand` | Fail if missing decision and heuristic true; fail `required:false` if heuristic true; extra error if `required:true` and heuristic and no providers | **Remove from fail-closed path** |
| Missing `evidence_decision` when providers exist | Fail | **KEEP** (structural) — superseded by “object always required” |
| `activityLooksSourceAnalytical` → `collectDlaEvidenceQualityDiagnostics` | Warn | **Retain as warning** (source-bound quality, not boolean). Do not promote to error |
| `looksLikeProceduralTaskMaterialPractice` | Carve-out inside heuristic | **Delete** if heuristic unused in fail-closed; keep only if warn path still needs `taskLooksEvidenceDependent` |
| Prompt PRE-EMIT / per-activity audit / noun lists | Model instruction | **NO CHANGE this task** (P04) |

### Structural invariants to keep

Already in `validateEvidenceDecisionClosure`:

- Shape: object, boolean `required`, non-empty `reason`, `provider_material_ids` array of strings.  
- `required: true` ⇒ ≥1 provider id; each id in `required_materials`; each has `evidence_requirement`.  
- `required: false` ⇒ empty provider ids; no `evidence_requirement` rows.  
- Orphan `evidence_requirement` must be listed; teaching-only provider-role; combined-workspace field arrays.  

**Add:** if `required === true`, every `provider_material_ids` entry ∈ `task_input_material_ids` (and therefore in `required_materials` via P01).

**Add:** `evidence_decision` object **required on every activity** (T-020 preference). Missing object is a shape error, not a heuristic trigger.

`validateEvidenceRequirementShape` unchanged.

---

## G. P03 implementation plan

On every `required_materials[]` row (ordinary **and** evidence-provider):

1. `purpose` is a non-empty string after `trim`. Presence only. **Not** subject to material-type-token equality fail-close. **No** replacement semantic or lexical quality rule for `purpose`.  
2. `specification` is a non-empty string after `trim`.  
3. Type-echo ban on **`specification` only**.

**Normalisation for specification type-echo** (reuse `tokenizeMaterialType` pattern):

```text
trim → toLowerCase → replace [\s-]+ with _ → strip leading/trailing _ 
→ strip trailing ASCII punctuation [.,;:!?]+
```

Compare normalised `specification` to `tokenizeMaterialType(row.material_type || row.type)`. Fail if equal (e.g. `"Template"`, `"template."`, `"TEMPLATE"`).

Do **not** fail-close `purpose === material_type` (after any normalisation).

**Do not:** word-count floors; “must contain a numeral”; type-specific content regex; `purpose === specification` fail-closed (warn-only later if desired); any lexical/semantic “quality” check on `purpose`.

**Evidence-provider rows:** `evidence_requirement.purpose` does **not** waive row `purpose`/`specification`. Providers still need the ordinary brief (T-022). No extra P03 fields.

**Checklist:** keep existing prompt (3–4 diagnostic criteria in specification). Do not regex-count criteria.

---

## H. Minimal prompt change

**Not P04.** Do not delete PRE-DESIGN, PRE-EMIT, per-activity audit, or INVALID/VALID contrast in this task.

### Edit `buildDlaPageEnrichContractBlock` — planning order (~70–75)

Replace the five evidence-only steps with **one short activity commissioning order**:

1. What must the learner produce (`expected_output` / `learner_task` intent).  
2. Are **separate task inputs** required? Set `task_material_decision`. If true, commission those ids in `required_materials` and list them. If false, ids empty; teaching/scaffold still allowed.  
3. For **every** `required_materials` row: non-empty `purpose` (job) and non-empty `specification` (GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose; specification must not be only the type token).  
4. Independently: does any task input function as **particulars-as-grounds**? Set `evidence_decision.required` per T-020. `false` does not mean no materials.  
5. If true: `provider_material_ids` ⊆ `task_input_material_ids`; those rows carry `evidence_requirement`. If false: no providers / no `evidence_requirement`.

Do **not** add a new self-audit section.

### Edit `buildCanonicalDlaPageShapeSnippet`

Insert `task_material_decision` and `specification` on the example row.

### Edit `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE`

Add `task_material_decision{ separate_inputs_required, task_input_material_ids[] }`; keep purpose/specification on the row list.

### Size (P05)

Unique addition estimated **~0.5–1.0k** characters. Copy injects contract+shape **twice** → assembled **~1–2k**. Do not add a second unique block in `app.js` beyond the OUTPUT CONTRACT line. Net **add** in this task; subtractive work is P04.

---

## I. GAM impact

**GAM does not need to understand, validate, or generate from `task_material_decision`.**

| Question | Answer |
| -------- | ------ |
| Receive it? | Only if DLA JSON is in conversation / baseline. Partial GAM output is `activity_id` + `materials[]`. |
| Validate it? | No. |
| Change generation? | No, except honour **specification** as binding content bounds. |
| 1:1? | Unchanged. Must not invent missing task inputs. |

**Why no GAM redesign:** P01/P02/P03 are DLA decisions. GAM already realises listed ids. T-010: GAM is not the owner of missing commissions.

**Explicit non-goals:** instructional depth module, GAM-PRES, stuffing problems into existing bodies.

---

## J. Compatibility / migration policy

**Recommend: strict DLA capture/enrich validation + fixture migration. No silent `false` default. No version-aware validator framework.**

| Class | Policy |
| ----- | ------ |
| **A. New production Copy** | Fail capture without valid `task_material_decision`, always-array `required_materials`, P03 fields, P02 object/closure |
| **B. Stored/generated pages (IndexedDB)** | Render/assemble **without** DLA capture validate. Old pages keep working. Re-running DLA Copy is strict |
| **C. Historical fixtures used by DLA validate** | **Update** (`tests/fixtures/page-assemble/dla-partial.json` and any test-inline pages) |
| **D. Tests on old shape** | **Update/replace** (§N). New matrix file for the contract |
| **E. Non-Copy enrich** | Emit valid P01 object (§E.3); existing beat `specification` text is already longer than the type token |

**Rejected:** default missing object to `separate_inputs_required: false` (hides A3/A4). **Rejected:** large compatibility framework or `schema_version` bump for one object.

`dla-partial.json` today: no `task_material_decision`, no `specification`, no `evidence_decision` in the file (tests inject evidence). **UPDATE** the fixture so capture tests stay green under strict validate; assembly tests tolerate extra fields.

---

## K. Test matrix

Create `tests/s76-dla-p01-p02-p03-contract.test.js` exercising `validateDlaPartialPageCapture` **and** `validateDlaEnrichedPage` with a shared page builder (include `episode_plan` for full validate).

### P01 positive

| Case | Expect |
| ---- | ------ |
| Inline-complete: `separate_inputs_required: false`, `[]`, WE + checklist allowed | pass |
| Ordinary practice: `true`, problem-set id in `required_materials`, `evidence_decision.required: false` | pass |
| Evidence task: `true`, provider id in task inputs **and** providers, `required: true`, valid `evidence_requirement` | pass |

### P01 negative

| Case | Expect fail |
| ---- | ----------- |
| Missing `task_material_decision` | yes |
| `true` + empty ids | yes |
| `false` + non-empty ids | yes |
| Unknown task-input id | yes |
| Duplicate task-input id | yes |
| `required_materials` absent (not an array) | yes |

### P02 positive

| Case | Expect |
| ---- | ------ |
| Procedural problem set: P01 true, P02 false | pass |
| Evidence interpretation: P01 true, P02 true, valid provider ⊆ task inputs | pass |

### P02 negative

| Case | Expect fail |
| ---- | ----------- |
| `required: true`, no provider | yes |
| Provider id not in `task_input_material_ids` | yes |
| Provider id absent from `required_materials` | yes |
| Provider missing `evidence_requirement` | yes |

### P02 regression (critical)

`learner_task` contains evidential-looking words (“analyse the supplied dataset / interpret the results / quotations”) **and** `evidence_decision.required: false` **and** no `evidence_requirement` rows **and** valid P01 (`false` or `true` with ordinary operands as designed) → **must pass**. Must **not** emit `contradicts evidence-dependent learner task/output wording`.

### P03 positive / negative

| Case | Expect |
| ---- | ------ |
| Meaningful purpose + specification | pass |
| Missing purpose | fail |
| Empty / whitespace-only purpose | fail |
| Missing specification | fail |
| Empty / whitespace-only specification | fail |
| `specification == material_type` | fail |
| Specification differs from `material_type` only by accepted normalisation (case / whitespace / trailing punctuation) | fail |

Do **not** add `purpose == material_type` → fail.

No tests that score specification or purpose “quality.”

Provider row with rich `evidence_requirement` but empty row `specification` → **fail P03**.

---

## L. Lagrangian regression mapping

| Exhibit | Structural output now required | Validator | Remains generative | Later benchmark |
| ------- | ----------------------------- | --------- | ------------------ | --------------- |
| **A2** | Problem-set row + `separate_inputs_required: true` listing that id; WE/table/checklist not necessarily task inputs; `evidence_decision.required: false`; purpose/spec on **all** rows including the problem set | Pass if declared; fail if `true` with missing id, or missing object | Model may still set `false` and omit the problem row — **not** fail-closed from “each practice problem” | Phase 4 Lagrangian: task–material completeness |
| **A3** | New-problem task-input row **or** honest `false` if the stem is fully inline; P03 bounds on that row if commissioned | Same | Wrong `false` with a hollow “solve a new problem” task | Phase 4 |
| **A4** | λ-case row as task input; P03 states nature/count/coverage as load-bearing; P02 true or false independently; if true, cases are providers ⊆ task inputs | Missing cases with `true` + listed id fails; missing object fails; wrong `false` does not | DLA may omit cases and claim `false` | Phase 4; historically benchmark **Major** |

Unit tests can encode **correct** A2/A3/A4 **shapes** as positives and omitted-row-with-`true` as negatives. They cannot encode “prose mentions lambda ⇒ fail.”

---

## M. Benchmark sequencing

Do **not** run benchmarks in the implementation task.

```text
GATE A  contract + validators + unit tests
GATE B  minimal prompt + Copy contract tests
GATE C  Roman Roads (control) + Lagrangian (challenge)   ← first post-repair scores
        BEFORE P04 and BEFORE P05
P04     evidence prompt rationalisation (uses T-020 + this planning-order)
P05     Copy ×2 assembly
Phase 3–4 repeated runs as already in PLAN.md
```

**Recommendation:** first post-P01/P02/P03 benchmark **before P04/P05** so score movement can be attributed to the commissioning contract, not to later prompt deletion or de-duplication.

---

## N. Obsolete expectation inventory

| Test / expectation | Class |
| ------------------ | ----- |
| `tests/s75-dla-evidence-decision-false-positive.test.js` S75-D15 E/F/H: `required:false` **must fail** on evidential wording | **REPLACE** — those pages should **pass** structurally; keep G (true+provider passes); keep A–D pass cases; add `task_material_decision` |
| `tests/sprint-72-evidence-centred-activity-slice.test.js` “A3/A5 wording … with no provider must fail” (`contradicts evidence-dependent`) | **REPLACE** with P02 regression (pass) + keep true structural provider-closure tests in the same file |
| Same file prompt tests matching “required:false contradicts evidence-dependent” in **contract text** | **KEEP** until P04 (this task does not delete that prompt paragraph) |
| `tests/s76-dla-procedural-task-evidence-validation.test.js` “required:false does not fail” for Lagrangian practice | **UPDATE** — still pass; add P01/P03 fields; stop depending on carve-out |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` planning-order / “must not ask analyse supplied evidence” | **UPDATE** only the tests whose **exact strings** you change in the planning-order block; **KEEP** PRE-EMIT / INVALID–VALID |
| `tests/ld-instructional-archetype-production-planning.test.js` `CONTRACT_VERSION === "58-DLA-PARTIAL-3"` | **UPDATE** |
| Archetype tests calling `validateDlaPartialPageCapture` without P01/P03 | **UPDATE** |
| `tests/page-dla-enrich.test.js` enrich materials from beats | **UPDATE** — assert `task_material_decision` emitted; spec already filled |
| `tests/fixtures/page-assemble/dla-partial.json` missing spec / decision | **UPDATE** |
| `tests/page-partial-capture-validate.test.js` “DLA partial with titles is valid” | **UPDATE** via fixture |
| Pack `workbook-contract-prompt-surface` / DLA-WB | **KEEP AS LEGACY** (not Copy) |
| `looksLikeProceduralTaskMaterialPractice` unit behaviour | **DELETE** with the fail-closed path; no separate public export today |
| Optional ordinary purpose/spec (implicit: tests omit specification and still pass) | **UPDATE** those builders |

---

## O. Implementation sequence

Derived from dependencies (validators are the SSOT; prompt must match shape; tests first would be red until validators exist — use **validators + new tests in the same step**):

1. **Helpers + validators** in `lib/page-dla-enrich.js` (P01 helper, P03 helper, P02 closure without heuristic fail-close, provider ⊆ task inputs, always-array `required_materials`, always `evidence_decision`).  
2. **Enrich emission** `enrichActivityWithDla` so `enrichPageWithDla` / `page-dla-enrich.test.js` stay valid.  
3. **New contract test file** (§K) + update obsolete tests/fixtures that call the same validators.  
4. **GATE A review** — unit suite green; no prompt behaviour change yet.  
5. **Contract/shape** `ld-dla-page-enrich-contract.js` + `CONTRACT_VERSION` + `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE`.  
6. **Minimal planning-order prompt** (same file).  
7. **GAM** brief one-liner + `GAM_DLA_OWNED_JSON_FIELDS` preservation.  
8. **`index.html` pin.**  
9. **Prompt-surface tests** (`ld-dla-evidence-decision-consistency-prompt`, shape snippet, archetype production planning version).  
10. **GATE B** — Copy contract tests.  
11. **GATE C** — operator-authorised Roman Roads + Lagrangian (not part of the code PR unless separately authorised).

Suggested commits (if split for reviewability, still one authorised change-set):

1. Validators + enrich + unit/fixture updates  
2. DLA contract/shape/OUTPUT CONTRACT + prompt planning order + prompt tests  
3. GAM preservation + specification-binding sentence + cache pin  

Do not ship prompt without validators (model would emit a field nothing checks). Do not ship validators without fixture updates (suite red).

---

## P. Review gates

### GATE A — contract logic without prompt behaviour

**Evidence:** `node --test tests/s76-dla-p01-p02-p03-contract.test.js tests/s76-dla-procedural-task-evidence-validation.test.js tests/s75-dla-evidence-decision-false-positive.test.js tests/page-dla-enrich.test.js tests/sprint-72-evidence-centred-activity-slice.test.js` (and other updated DLA validate tests) all pass. Heuristic fail-close string `contradicts evidence-dependent` **absent** from fail-closed tests. P01/P03 negatives fail as specified.

**Stop if:** partial vs full validators disagree; enrich pages fail P01/P03.

### GATE B — minimal prompt + Copy surfaces

**Evidence:** shape snippet contains `task_material_decision` and `specification`; OUTPUT CONTRACT line lists the object; planning-order includes production → inputs → purpose/spec → evidence; dual-injection still only the existing two contract copies (no third unique block); GAM brief mentions specification binding; `index.html` pin updated.

**Stop if:** unique DLA contract growth is large (treat as P04 creep); prompt tests for PRE-EMIT accidentally deleted.

### GATE C — benchmarks before P04/P05

**Evidence:** Roman Roads control + Lagrangian challenge captured with the new DLA contract. Inspect intermediate DLA JSON (IndexedDB / run capture): `task_material_decision` present; A2/A3/A4 **declarations**; purpose/spec non-empty. Score is **diagnostic**, not a pass/fail for the code change.

**Stop if:** model systematically omits `task_material_decision` (prompt/shape insufficient — tighten GATE B, still **not** a prose heuristic). Do not start P04 until this isolation run exists.

---

## Q. Risks / mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Model omits `task_material_decision` | Shape snippet + OUTPUT CONTRACT + planning step 2; GATE C inspects captures; **not** a lexical validator |
| Historical fixtures fail | Update capture-path fixtures; do not default `false` |
| Partial/full validator divergence | One shared helper called from both |
| Non-Copy enrich incompatible | Emit P01 object in `enrichActivityWithDla` |
| Heuristics remain fail-closed elsewhere | Grep `inferredEvidenceDemand` / `contradicts evidence-dependent` after edit; only warn path may remain |
| Prompt growth under Copy×2 | Keep unique add &lt; ~1k; no new audit section; P05 later |
| Purpose/spec breaks legitimate rows | Type-echo fail-close is **specification-only**; `purpose` equal to the type token still passes if non-empty; update test rows that used type-only **specification** |
| Wrong generative `false` still possible | Accepted (T-021); GATE C / Phase 4 observe; do not reintroduce prose fail-close |
| GAM consumes `task_material_decision` semantically | Do not mention it in GAM brief except preservation; GAM still 1:1 on `required_materials` |
| `evidence_decision` always-required breaks pages that omitted it when heuristic silent | Require object; update those tests; aligns T-020 |
| Provider ⊆ task inputs forgotten on enrich | When enrich sets providers, list those ids as task inputs |

---

## R. Change-set recommendation

**YES — implement P01/P02/P03 as one coordinated task/change-set.**

They share `lib/page-dla-enrich.js`, `lib/ld-dla-page-enrich-contract.js`, the same fixtures, and GAM’s `required_materials` baseline. Isolated PRs would thrice-edit the same validators and planning order, and P05 would amplify three prompt appends.

Do **not** split for administrative neatness. Optional **internal commits** (§O) are fine if the operator wants bisectability.

P04 and P05 remain **separate authorised** follow-ons after GATE C.

---

## S. Implementation readiness verdict

**P01/P02/P03 IMPLEMENTATION PLAN READY FOR OPERATOR REVIEW**

No unresolved architecture question blocks authorisation. The migration policy (strict capture; no silent `false`; fixture update; no schema-version framework) is the concrete choice this plan already makes.

This artefact **does not** authorise implementation.

---

## Appendix — key current fail-closed lines (for implementers)

| File | Lines (approx.) | Note |
| ---- | --------------- | ---- |
| `lib/page-dla-enrich.js` | 1356–1418 | `validateEvidenceDecisionClosure` heuristic |
| `lib/page-dla-enrich.js` | 1156–1234 | `looksLikeProceduralTaskMaterialPractice` |
| `lib/page-dla-enrich.js` | 1264–1320 | `taskLooksEvidenceDependent` |
| `lib/page-dla-enrich.js` | 2185–2188 | full validate: `required_materials` when beats exist |
| `lib/page-dla-enrich.js` | 2466–2482 | partial: evidence shape if present; no purpose/spec |
| `lib/ld-dla-page-enrich-contract.js` | 70–75 | planning order to replace |
| `lib/ld-dla-page-enrich-contract.js` | 275–294 | shape missing `specification` / P01 object |
| `app.js` | 8755 | OUTPUT CONTRACT field list |
| `app.js` | 11254 | GAM brief: purpose when available; spec not named |

*End of S76-T-023. No implementation is authorised by this artefact.*

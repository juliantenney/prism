# Sprint 44 — Slice 44-1: Tiered GAM Capture Validation Gate

**Date:** 2026-06-13  
**Type:** Workflow run-mode capture validation (runtime gate)  
**Predecessor:** Sprint 43 GAM validation options note; Sprint 38-S `lib/gam-output-format.js`  
**Status:** Design only — **do not implement** in this document

---

## 1. Objective

Wire **`validateGamPackTextOutput`** into Prism workflow **run-mode capture** as a **tiered gate** for **self-directed learner-page** Generate Activity Materials steps only.

| Goal | Detail |
|------|--------|
| Stop compose-breaking GAM captures early | Block JSON stubs and unparseable pack text before Design Page |
| Enforce upstream coverage | When DLA is available, require one realised material per upstream `required_materials` row and per `activity_id` |
| Preserve authorial latitude | Surface thin instructional bodies as **warnings**; do not block step progression |
| Avoid inflation lock-in | **Do not** gate on EV-38L A4 scenario / worked-judgement / transfer word-band checks |
| Stay in capture layer | No renderer, schema, prompt, or automated LLM retry changes |

**Success:** A self-directed learner-page run cannot mark the GAM step complete or advance while capture is a JSON stub or materially under-covered vs upstream DLA; thin bodies are visible but non-blocking.

---

## 2. Files likely touched

| File | Change |
|------|--------|
| `lib/gam-output-format.js` | Add tiered capture API (`validateGamPackTextCaptureGate` or equivalent); `countExpectedMaterialsFromLearningActivities`; keep existing `validateGamPackTextOutput` for harness parity |
| `app.js` | `applyGamPackTextValidationToCapture`; hook in `syncWorkflowRunCapturedOutputToState`; `updateRunStepOutputStatus`; `workflowNextStepBtn` hard gate; run reset; `prismTestApi` exports |
| `index.html` | Load `lib/gam-output-format.js` (browser global `PRISM_GAM_OUTPUT_FORMAT`) |
| `tests/gam-output-format.test.js` | Tier split, DLA-derived thresholds, inflation checks excluded from gate |
| `tests/workflow-gam-capture-validation-gate.test.js` | **New** — scope predicate, capture pipeline, step completion, facilitator exclusion |
| `tests/prism-vm-lib-bootstrap.js` | Register `gam-output-format.js` if VM tests need browser parity |

**Not touched:** `lib/page-gam-materials-preserve.js`, renderers, Design Page compose, GAM prompt blocks, `ev-38s-gam-capture-helper.mjs`, `normalizeGamPackTextForCompose` wiring.

---

## 3. Exact validation tiers

Validation runs on **sanitized** capture text (post `sanitizeSelfDirectedGamMaterialsOutput`), matching what `workflowRunCapturedOutputs` stores.

### 3.0 Scope predicate (all tiers)

Run validation **only when all** are true:

```text
isWorkflowStepGenerateActivityMaterials(stepContext)
AND shouldSanitizeSelfDirectedGamMaterialsOutput(stepContext)
  (= NOT facilitated delivery AND shouldApplySelfDirectedLearnerPageGamMaterialScaffold)
AND raw capture trim length > 0
```

Empty textarea → skip validation; clear gate state for that step.

### 3.1 Tier 1 — Structural (**blocking**)

| Code | Check | Blocks? |
|------|-------|---------|
| **GAM-FMT-01** | JSON `pack` / `activities` / `required_materials` stub (`detectGamJsonStubOutput`) | **Yes** |
| **GAM-FMT-02** | Missing `Material:` + `Content:` pack text structure (`isPackTextGamFormat`) | **Yes** |

These run unconditionally when in scope.

### 3.2 Tier 2 — Coverage (**blocking**)

Requires **parseable** pack text (Tier 1 pass). Uses `parseGamMaterialsFromText`.

| Code | Check | Blocks? | Threshold |
|------|-------|---------|-----------|
| **GAM-FMT-03** | Parsed material count | **Yes** | `expectedMaterialCount` from upstream DLA (see §3.4) |
| **GAM-FMT-05** | Activity coverage | **Yes** | Every upstream `activity_id` has ≥1 parsed material (`validateGamActivityCoverage`) |

**When upstream DLA is unavailable** (no prior `learning_activities` capture, or unparsable):

- **Do not block** on FMT-03/FMT-05.
- Set a **non-blocking informational warning** (single line):  
  `GAM coverage check skipped — capture Design Learning Activities first to enforce material count and activity coverage.`
- Tier 1 still applies.

**Do not use** fixed `minMaterials: 12` or `minActivities: 4` as runtime gate defaults.

### 3.3 Tier 3 — Instructional depth (**warning only**)

| Code | Check | Blocks? |
|------|-------|---------|
| **GAM-FMT-04** | Thin `Content` bodies: checklist/retrieval &lt; 80ch; other types &lt; 120ch (`minBodyForType`) | **No** |

Emit warnings listing up to **6** offenders: `material_id:NNch`.  
Step may complete and Next Step may proceed.

### 3.4 Explicitly excluded from this slice (not gate, not warning)

| Code | Reason |
|------|--------|
| **GAM-FMT-06** | A4 inflation scenario / Strategy A–E / M12 compose contract |
| **GAM-FMT-07** | A4 worked judgement weak/strong / M14 compose contract |
| **GAM-FMT-08** | Transfer prompt “at least 80 words” word-band |

These remain in `validateGamPackTextOutput` for **harness / Node** use only. The new tiered API must **not** call `validateGamA4ComposeContract`, `validateGamTransferPrompts`, or inflation-specific normalize paths.

### 3.5 Upstream-derived `expectedMaterialCount`

```text
expectedMaterialCount = Σ len(activity.required_materials) across all upstream activities
```

- Source: `resolveUpstreamLearningActivitiesFromWorkflowCaptures()` (same as GAM sanitize context).
- If sum is **0** (DLA present but no `required_materials` rows): treat like unavailable upstream — skip FMT-03/FMT-05 blocking; informational warning only.
- Gate condition FMT-03: `parsedMaterials.length < expectedMaterialCount` (strict less-than; equality passes).

### 3.6 Proposed API shape (`lib/gam-output-format.js`)

```javascript
validateGamPackTextCaptureGate(text, {
  learningActivities,   // upstream DLA object or activities array; optional
  upstreamAvailable     // boolean; app sets from resolveUpstreamLearningActivitiesFromWorkflowCaptures
})
// → {
//   ok: boolean,                    // true iff blockingErrors.length === 0
//   blockingErrors: string[],
//   warnings: string[],
//   skippedCoverage: boolean,
//   metrics: { material_count, activity_blocks, thin_count, json_stub, expected_material_count }
// }
```

Existing `validateGamPackTextOutput` unchanged for `ev-38s-gam-capture-helper.mjs` and `tests/gam-output-format.test.js` EV-38L cases.

---

## 4. UI behaviour

### 4.1 Capture sync (`syncWorkflowRunCapturedOutputToState`)

```text
raw textarea
  → workflowRunCapturedOutputsRaw[sid]
  → sanitize (self-directed GAM only)
  → applyGamPackTextValidationToCapture(sanitized, stepContext, sid)
  → workflowRunCapturedOutputs[sid] = sanitized (unchanged text; validation does not mutate)
```

On **blocking** failure:

- Set `workflowRunGamFormatValidation[sid]` to semicolon-joined `blockingErrors`.
- `delete workflowRunStepCompleted[sid]`.

On **warnings only**:

- Clear `workflowRunGamFormatValidation[sid]`.
- Set `workflowRunGamFormatWarnings[sid]` to semicolon-joined warnings (+ informational skip line if applicable).

On **pass** (no blockers, no warnings):

- Delete both gate slots for `sid`.

### 4.2 Step status line (`updateRunStepOutputStatus`)

Extend existing status composition (parallel to `workflowRunLearnerPageFramingValidation`):

| Condition | Display | CSS |
|-----------|---------|-----|
| Blocking errors | `GAM format: {errors}` | `workflow-run-step-output-status--error` (existing error class) |
| Warnings only | `GAM depth: {warnings}` | **New** `workflow-run-step-output-status--warning` |
| Both | Blocking text first; warnings appended after ` · ` | Error class takes precedence |

Strict JSON / EP / page / DLA framing errors unchanged; concatenate with ` · ` when multiple.

### 4.3 Next Step (`workflowNextStepBtn`)

After `syncWorkflowRunCapturedOutputToState`:

- If GAM step in scope **and** `workflowRunGamFormatValidation[sid]` non-empty:
  - `showToast("GAM capture must be pack text with full upstream coverage. " + errors, "error")`
  - `return` (do not set `workflowRunStepCompleted`, do not advance index).
- Warnings alone: **allow** advance (optional: neutral toast — **out of scope** unless product asks).

### 4.4 No repair UX

- Do **not** surface `buildGamOutputContractRetryHint` automatically (no LLM repair path).
- Do **not** write `normalizeGamPackTextForCompose` results back to textarea.
- User fixes capture manually or re-prompts externally.

### 4.5 Facilitator / non-learner-page runs

No status line, no gate, no state slots — identical to today.

---

## 5. State additions

| Key | Type | Purpose |
|-----|------|---------|
| `state.workflowRunGamFormatValidation` | `{ [stepId]: string }` | Blocking errors for GAM capture gate |
| `state.workflowRunGamFormatWarnings` | `{ [stepId]: string }` | Non-blocking depth + coverage-skip messages |

**Lifecycle:**

- Initialise / reset with other run validation maps in workflow run reset (~`workflowRunLearnerPageFramingValidation = {}` block).
- Clear per-step entries on pass or when scope predicate false.
- `prismTestApi` exports: `applyGamPackTextValidationToCapture`, `validateGamPackTextCaptureGate` (via lib resolver), `shouldSanitizeSelfDirectedGamMaterialsOutput` (already exported).

**Unchanged:** `workflowRunCapturedOutputsRaw` remains raw textarea; sanitized store unchanged.

---

## 6. Tests required

### 6.1 `tests/gam-output-format.test.js` (extend)

| Case | Expect |
|------|--------|
| EV-38L GAM via **tiered gate** with upstream fixture | Pass blocking; FMT-04 may produce **warnings** (document expected warning count or accept non-empty warnings without failing `ok`) |
| JSON stub | `blockingErrors` contains GAM-FMT-01; `ok: false` |
| Pack text missing Material/Content | GAM-FMT-02 blocking |
| Parsed count &lt; `expectedMaterialCount` | GAM-FMT-03 blocking |
| Missing activity_id vs upstream | GAM-FMT-05 blocking |
| Thin checklist only | `ok: true`; warnings contain GAM-FMT-04 |
| Tiered gate on thin A4 inflation fixture | **No** GAM-FMT-06/07/08 in blocking or warnings |
| `upstreamAvailable: false` | `skippedCoverage: true`; no FMT-03/05 in `blockingErrors` |

### 6.2 `tests/workflow-gam-capture-validation-gate.test.js` (new)

VM-load `app.js` + libs (pattern: `workflow-learner-page-mandatory-framing.test.js`):

| Case | Expect |
|------|--------|
| Self-directed learner-page GAM context | Validation runs |
| Facilitator-only / sync delivery brief | Validation skipped |
| `applyGamPackTextValidationToCapture` + JSON stub | Sets `workflowRunGamFormatValidation`, clears step completed |
| Thin bodies only | `workflowRunGamFormatWarnings` set; step may remain completable |
| Empty capture | No validation slots |
| Sanitize-before-validate order | Validator receives sanitized text (facilitator block stripped fixture) |

### 6.3 Regression

```bash
node --test tests/gam-output-format.test.js
node --test tests/workflow-gam-capture-validation-gate.test.js
node --test tests/workflow-learner-page-mandatory-framing.test.js
```

Harness `ev-38s-gam-capture-helper.mjs` must still pass full `validateGamPackTextOutput` unchanged.

---

## 7. Out of scope

| Item | Notes |
|------|-------|
| Automated LLM repair / retry loop | No `captureGamPackText` port; no `buildGamOutputContractRetryHint` in UI |
| `normalizeGamPackTextForCompose` at capture | Deterministic mutation deferred (inflation-biased regexes) |
| GAM-FMT-06 / 07 / 08 at runtime | EV-38L / inflation compose contract — harness only |
| Renderer / HTML output | No `renderMaterialValue`, utility HTML, or page render changes |
| Design Page compose / preservation | No `applyComposedPageGamMaterialsPreserve` changes |
| GAM prompt scaffolds | No changes to `buildSelfDirectedGamSelfStudyMaterialsPromptBlock` |
| DLA / EP / page gates | Existing validators untouched |
| Mandatory non-empty GAM capture | Empty textarea remains valid (optional notes field) |
| Workshop facilitated learner handout GAM | Excluded unless brief resolves to self-directed scaffold predicate |
| Conditional domain warnings (future) | A4 checks when upstream signals Evaluate — separate slice |

---

## 8. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| **False blocks** when DLA lists materials the model legitimately merges | `expectedMaterialCount` uses DLA **row count**, not unique compose keys; document that merged materials still need one `Material:` block per upstream row. If merges are common, follow-up slice may add tolerance (+/- 1) with explicit product sign-off. |
| **Sanitize shrinks bodies** below FMT-04 thresholds → noisy warnings | Warnings only — non-blocking; log `thin_count` in metrics for observation. If noise is high, raise thresholds in a later slice. |
| **Upstream DLA stale** vs pasted GAM | Coverage uses current DLA capture at sync time; re-sync GAM after DLA edits. Informational skip when DLA missing avoids false blocks. |
| **Browser / Node drift** | Single source in `gam-output-format.js`; load in `index.html`; VM bootstrap for tests. |
| **Parser drift** vs `page-gam-materials-preserve.js` | Tiered gate uses `parseGamMaterialsFromText` from `gam-output-format.js` only; acceptance test: stub that preserve parses 0 materials must fail FMT-01/02. |
| **Users ignore depth warnings** | Accept for slice 1; Sprint 45+ may add salience observability or conditional domain warnings without universal A4 gate. |
| **Harness regression** | Keep `validateGamPackTextOutput` full contract; tiered API is separate entry point. |
| **120ch vs 120 words** mismatch in prompts | Do not change prompts in this slice; FMT-04 warnings align to **existing code** thresholds. |

---

## Acceptance criteria

| # | Criterion |
|---|-----------|
| 1 | Self-directed learner-page GAM: JSON stub blocks step completion and Next Step |
| 2 | Self-directed learner-page GAM: material count &lt; upstream `required_materials` sum blocks when DLA available |
| 3 | Self-directed learner-page GAM: missing upstream `activity_id` blocks when DLA available |
| 4 | Thin instructional bodies surface as warnings; progression allowed |
| 5 | FMT-06/07/08 never appear in runtime gate or warning output |
| 6 | Facilitator / non-scaffold GAM steps behave as today |
| 7 | No renderer, prompt, or LLM retry changes |
| 8 | Node tests cover tier split and workflow capture integration |

---

## Implementation order (when approved)

1. `validateGamPackTextCaptureGate` + `countExpectedMaterialsFromLearningActivities` in `gam-output-format.js`
2. Unit tests for tier split
3. `index.html` script load + `resolveGamOutputFormatLib()` in `app.js`
4. `applyGamPackTextValidationToCapture` + state + `syncWorkflowRunCapturedOutputToState` hook
5. `updateRunStepOutputStatus` + warning CSS class
6. `workflowNextStepBtn` blocking check
7. Workflow integration tests + manual self-directed Marx/inflation paste smoke

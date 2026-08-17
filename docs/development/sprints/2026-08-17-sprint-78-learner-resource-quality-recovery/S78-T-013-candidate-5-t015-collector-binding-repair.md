# S78-T-013 Candidate 5 — T-015 obligation collector binding repair

**Task:** Bounded instrumentation correction within **S78-T-013** (subordinate to Candidate 5 coverage diagnostic)  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-17)  
**Mode:** Collector binding repair only — temporary T-017/T-018 instrumentation under [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)  
**Depends on:** [S78-T-013-candidate-5-operational-suitability-review-coverage-diagnostic.md](S78-T-013-candidate-5-operational-suitability-review-coverage-diagnostic.md)  
**Does not include:** GAM authoring change · DLA contract change · WS1/WS2/WS3 change · Stage-2 gate redesign · Lagrangian regeneration · T-019

**This repair improves TEMPORARY instrumentation coverage. It does NOT promote the verifier to intended steady-state architecture.**

---

## 1. Previous collector architecture

Two-layer proxy:

1. **Activity gate** — required WS1 `productionKinds`, or non-study/non-verify steps with `expected_output` / `task_input_material_ids`. Combined unnumbered `Examine/Read … and derive/solve/classify` paragraphs were treated as study-only → whole activity skipped.
2. **Material gate** — `task_input_material_ids` **or** operand-type whitelist (`scenario`, `task_card`, `prompt_set`, …). All model rows when activity admitted. `response_fulfilment` surfaces could enter via `prompt_set` type.

---

## 2. Under-coverage cause removed

Authoritative `task_input_material_ids` and `practice_independence.attempt_operand_material_ids` are now followed whenever the activity has **substantive learner production** (`expected_output` + authoritative bindings, or WS1 production kinds), **without** requiring steps to survive the study-prefix classifier first.

---

## 3. Over-coverage cause removed

Rows with `response_fulfilment` are excluded from semantic review unless they are also authoritative task inputs or attempt operands (they should not be — WS1 owns write-into surfaces).

Operand-type whitelist no longer auto-includes `prompt_set` / orphan scenarios.

---

## 4. New authoritative task-input rule

When `activityHasSubstantiveLearnerProduction` is true, every id in `task_material_decision.task_input_material_ids` maps to a `learner_operand` obligation unless excluded as checklist / response-only surface.

---

## 5. Response_fulfilment exclusion rule

```text
response_fulfilment present
AND material_id ∉ task_input_material_ids
AND material_id ∉ practice_independence.attempt_operand_material_ids
→ exclude from Stage-2 scope
```

---

## 6. Model-completeness rule

| Role | Deterministic rule |
| ---- | ------------------ |
| `model_complete` | `worked_example` / `modelling_note` AND NOT partial-exclude regex AND (`COMPLETE_WORKED_COMMISSION_RE` OR `SOLVED_MODEL_COMMISSION_RE`) |
| `model_demonstration` | model row AND NOT complete AND NOT partial-exclude (e.g. stop before solving, objective+constraint only) |
| excluded partial demo | `PARTIAL_MODEL_EXCLUDE_RE` on purpose/specification |

Lexical fallbacks retained only where DLA has no finer metadata. No new DLA fields invented.

---

## 7. Practice_independence treatment

`practice_independence.attempt_operand_material_ids` are collected as authoritative `learner_operand` bindings independently of study-prefixed `learner_task` wording. WS2 semantic judgement remains out of scope for the review prompt.

---

## 8. Remaining production-classifier role

`classifyLearnerProductionSteps` still used to detect substantive production via WS1 `productionKinds` (table/text production). Also: `expected_output` + authoritative task/attempt bindings establish production without verb taxonomy.

---

## 9. Remaining regex/heuristics (unavoidable)

| Heuristic | Why retained |
| --------- | ------------ |
| `COMPLETE_WORKED_COMMISSION_RE` | No DLA boolean for complete-model commission |
| `SOLVED_MODEL_COMMISSION_RE` | Captures “solved path including verification” without domain logic |
| `PARTIAL_MODEL_EXCLUDE_RE` | Distinguishes intentional partial demos from complete-model review |
| Open-ended / deliberate-insufficiency commission regex | Existing T-015 commission_mode only |

No action-verb lists. No discipline-specific patterns.

---

## 10. Candidate-5 conceptual scope

| | Before (observed) | After (fixture) |
| - | ----------------- | --------------- |
| Obligation ids | A4-M1, A4-M2 | A1-M1, A2-M2, A3-M1, A3-M2, A4-M1, A5-M2 |
| A4-M2 response surface | IN (false positive) | OUT |
| A2-M1 partial demo | would IN if activity admitted | OUT |
| Checklists / workspaces / explanatory text | mixed | OUT |

Representative review prompt (Candidate-5-shaped fixture, stub GAM bodies): **~6 obligated rows** vs previous **2**.

T-008 preserved DLA exhibit (stub bodies): obligations **A2-M1, A3-M1, A3-M2, A4-M1**; review prompt **~5423 chars** (scope widened; A1 response surface no longer included).

---

## 11. Cross-disciplinary behaviour

Study/Examine-prefixed tasks with bound task inputs now collect: classification scenarios, mathematical operands, programming/debug inputs, dataset tables, humanities passages, design briefs — domain-general via binding identity only.

---

## 12–15. Stage-2 / artefact / fingerprint / semantic JS

**NONE changed** in `lib/gam-operational-suitability-review.js`. Review artefact shape, fingerprint fields, stale-review protection, exact-id closure, PASS/FAIL gating unchanged. JS still decides scope only; Copilot decides suitability.

---

## 16–20. Preservation

| Area | Change |
| ---- | ------ |
| GAM authoring prompt prose | **NONE** |
| DLA contracts | **NONE** |
| WS1 | **Preserved** — `response_fulfilment` exclusion reinforces WS1 ownership |
| WS2 | **Preserved** — attempt operands collected; WS2 not judged in review |
| WS3 / T-022 | **Preserved** — checklists excluded |

Stage-1 authoring block lists may change row count because obligations changed; marker semantics unchanged.

---

## 21. Tests added/changed

**File:** `tests/s78-gam-operational-suitability-prompt.test.js`

Added binding regressions **R1–R18** (collector + gate smoke). Updated fixtures to include authoritative `task_input_material_ids` where previously relied on type whitelist.

**File:** `tests/s78-gam-operational-suitability-review.test.js`

Updated `openHumanitiesPage` / `deliberateInsufficiencyPage` fixtures with task-input bindings.

---

## 22. Exact test results

| Suite | Result |
| ----- | ------ |
| `s78-gam-operational-suitability-prompt.test.js` | **39/39 pass** |
| `s78-gam-operational-suitability-review.test.js` | **38/38 pass** |
| WS1/WS2/WS3/T-018/T-020/GAM blank-cell regressions | **80/80 pass** |

---

## 23. Protected regression results

T-015 legacy R1–R10, T-017/T-017A full suite, T-018 UX, WS1 response_fulfilment, WS2 practice_independence, WS3 diagnostic_review — all pass without fixture weakening.

---

## 24. Production files changed

- `lib/gam-operational-suitability-prompt.js` — collector binding repair only

---

## 25. Documentation files changed

- This record
- `STATUS.md`, `PLAN.md`, `SPRINT-78-START-HERE.md`, `S78-T-013-workstream-2-integration-verification.md` (pointers)

---

## 26. Deviations

None. Stage-2 untouched. No GAM prompt prose added.

---

## 27. Remaining instrumentation limitations

- Complete vs partial model still partly lexical when DLA purpose/spec is ambiguous.
- Activities with substantive production but **no** `task_input_material_ids`, **no** attempt operands, and **no** WS1-classifiable production kinds may still emit zero operand obligations (correct if nothing generated is bound).
- Verifier remains temporary ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)); first-pass GAM quality is still the sprint signal.

---

## 28. Recommended next action

1. Operator completes in-flight Candidate 5 QA independently (learner-resource evidence).
2. On next T-013-path generation, **re-run Verify generated materials** — prior two-row PASS is stale instrumentation evidence.
3. Do **not** start T-019. Do **not** regenerate Lagrangian from this task.
4. Resume T-013 with trustworthy obligation scope; assess whether first-pass GAM still exposes suitability failure classes.

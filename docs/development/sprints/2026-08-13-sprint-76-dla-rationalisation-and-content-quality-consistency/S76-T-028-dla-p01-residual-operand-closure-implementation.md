# S76-T-028 — DLA-P01 residual operand-closure implementation

**Task:** S76-T-028  
**Status:** **Implemented** (2026-08-13) — ready for operator re-benchmark  
**Mode:** Bounded P01 residual prompt clarification (T-027 Option 2)  
**Depends on:** [T-021](S76-T-021-dla-p01-solution-design.md) · [T-020](S76-T-020-dla-p02-solution-design.md) · [T-024](S76-T-024-dla-p01-p02-p03-gate-a-b.md) · [T-026](S76-T-026-dla-p01-residual-operand-closure-diagnostic.md) · [T-027](S76-T-027-dla-p01-residual-operand-closure-solution-design.md)  
**Out of scope (not started):** P04 · P05 · Gate C re-runs · schemas · behavioural validators · GAM · EP · pack DLA-WB · PRE-EMIT / evidence audits

This artefact records what was implemented. It does **not** authorise fresh generation. It does **not** claim RECOVER. It does **not** start P04 or P05.

---

## 1. T-027 P02 wording correction

**Not required.**

T-027 already states A2/A3 `evidence_decision.required: false` (procedural operands, not particulars-as-grounds) and A4 `required: true` may remain valid. It does not imply A2/A3 practice problems should set `evidence_decision.required: true`. T-027 was not otherwise reopened.

Accepted P02 contract preserved:

| Case | P01 task input | P02 epistemic evidence |
| ---- | -------------- | ---------------------- |
| A2 / A3 procedural optimisation | `true` | `false` |
| A4 shadow-price cases as grounds | `true` | `true` may remain correct |

---

## 2. Contract version

| Field | Before (T-024) | After |
| ----- | -------------- | ----- |
| `lib/ld-dla-page-enrich-contract.js` `CONTRACT_VERSION` | `76-DLA-PARTIAL-4` | **`76-DLA-PARTIAL-5`** |

`schema_version` remains `"2.0.0"`. No schema change.

---

## 3. Production prompt surface changed

| File | Change |
| ---- | ------ |
| `lib/ld-dla-page-enrich-contract.js` | Replaced Activity commissioning order **step 2** in `buildDlaPageEnrichContractBlock`. Version bump. Canonical A4-like JSON **unchanged**. Payload bullet **unchanged**. PRE-EMIT / evidence audits **untouched**. |
| `index.html` | Cache pin on the contract lib only: `?v=20260813-s76-dla-p01-r1-operand`. DLA enrich / GAM pins remain `20260813-s76-dla-p01-p02-p03`. |

**Not changed:** `lib/page-dla-enrich.js` · `lib/page-gam-enrich.js` · `app.js` · schemas · pack DLA-WB · GAM · EP.

### Tests

| File | Change |
| ---- | ------ |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Version `76-DLA-PARTIAL-5`; new `S76 P01-R1` prompt-surface assertions |
| `tests/ld-instructional-archetype-production-planning.test.js` | Version `76-DLA-PARTIAL-5` |

No semantic validator tests were added. Gate A P01/P02/P03 structural tests were preserved.

---

## 4. Before / after semantic wording

**Before (T-024 Gate B step 2):** decide whether **separate task inputs** are required; if true, commission “those materials” and list ids; if false, ids empty and teaching/scaffold may still be commissioned. No operand definition, no four-role contrast, no absence test, no explicit P01/P02 independence on this step.

**After (step 2, unique):**

> 2) Decide whether separate task operands/stimuli are required. A task input is the particular content upon which the learner performs the required operation (solve, calculate, classify, diagnose, analyse, compare, interpret, evaluate, transform, or construct from supplied particulars) when not already fully contained in learner_task. Set task_material_decision. If separate_inputs_required is true, commission those operands in required_materials and list only their material_ids in task_input_material_ids. If false, ids must be empty; teaching/model/workspace/scaffold may still be commissioned. Roles (not type-absolute): operand/stimulus = problem, case, data, values, source, passage, object or other particulars acted upon; model = shows how; workspace = place/structure to record or manipulate, including blank tables; scaffold = prompts, supports or checks. Used during the activity ≠ automatically a task input. Absence test: if removing it leaves the learner without the particulars needed to operate, it is a task input; if they lose only an example of how, a place to write, guidance, or a checklist, it is not. Listing a task input does not set evidence_decision.required; P01 and P02 remain independent.

---

## 5. Prompt size

Measured against T-024 Gate B baseline (unique contract+shape **23,210** / assembled ×2 **46,420**).

| | Characters |
| - | ---------- |
| Contract block | 17,535 |
| Shape snippet | 6,568 (unchanged) |
| Unique (contract+shape) | **24,103** |
| Assembled Copy ×2 | **48,206** |
| **Unique delta vs T-024** | **+893** |
| **Assembled Copy delta vs T-024** | **+1,786** |

T-027 preferred unique band **~550–900**; assembled ×2 **~1.1–1.8k**. Both landed inside those bands.

---

## 6. Tests run / results

Targeted DLA contract / Copy / prompt tests plus directly affected P01/P02/P03 suites:

| Suite | Result |
| ----- | ------ |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | pass |
| `tests/ld-instructional-archetype-production-planning.test.js` | pass |
| `tests/page-dla-enrich.test.js` (incl. Gate B dual-injection) | pass |
| `tests/s76-dla-p01-p02-p03-contract.test.js` | pass |
| `tests/s75-dla-evidence-decision-false-positive.test.js` | pass |
| `tests/s76-dla-procedural-task-evidence-validation.test.js` | pass |
| `tests/sprint-72-evidence-centred-activity-slice.test.js` | pass |
| `tests/page-gam-enrich.test.js` | pass |

**200 pass / 0 fail.** No semantic validator test for missing operands inferred from `learner_task` prose.

---

## 7. Confirmations

| Item | Status |
| ---- | ------ |
| Schema change | **None** |
| Behavioural validator change | **None** |
| P01 / P02 / P03 structural tests | **Preserved** |
| Canonical A4-like JSON example | **Unchanged** |
| Pack DLA-WB / obligation-population | **Untouched** |
| PRE-EMIT / evidence consistency audits | **Untouched** |
| GAM / EP | **Untouched** |
| P04 | **Not started** |
| P05 | **Not started** (dual-injection remains) |
| Fresh generation / Roman Roads / Lagrangian | **Not run** |

---

## 8. Deviations from T-027

| Item | Notes |
| ---- | ----- |
| Optional payload gloss | **Not added.** T-027 listed it as optional. Step 2 already says “list only their material_ids”. Payload line remains the T-024 field-shape bullet. |
| Version bump | `76-DLA-PARTIAL-5` (T-027 did not specify a version string). |
| Cache pin | Contract lib only; DLA/GAM enrich pins unchanged. |
| Unique size | **+893** (inside 550–900). |
| T-027 text | **Unedited** (P02 wording already correct). |

No second canonical activity JSON. No new P01 section. No new fields.

---

## 9. Verdict

**P01 RESIDUAL IMPLEMENTED — READY FOR OPERATOR RE-BENCHMARK**

Do not treat this as RECOVER. Operator re-benchmark (Roman Roads / Lagrangian) is a separate authorised step.

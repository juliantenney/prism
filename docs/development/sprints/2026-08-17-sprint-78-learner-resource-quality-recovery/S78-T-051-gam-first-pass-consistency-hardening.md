# S78-T-051 — Harden GAM first-pass semantic and quantitative consistency

**Task:** S78-T-051  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Mode:** Implementation (GAM live prompt salience only)  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Upstream:** [S78-T-049](S78-T-049-first-pass-generation-validation-reliability-diagnostic.md)  
**Sibling:** [S78-T-050](S78-T-050-dla-evidence-provider-first-pass-hardening.md) (DLA P02 — unchanged by this task)  

**Out of scope (honoured):** DLA T-050 edits · validator/schema changes · auto-retry · UX redesign · image work · learner workspaces · T-013 / Sprint 78 close  

---

## 1. T-049 root-cause confirmation

| Specimen | Failure | Finding |
| -------- | ------- | ------- |
| **1** Lagrangian A1-M1 | Unconstrained contrast gained invented non-negativity → role flip | Soft “do not invent pedagogical constraints” exists; missing **final role/status preservation** check |
| **2** Lagrangian A5-M1 | λ=4 inconsistent with FOCs / constraint | General consistency language exists; missing **silent recompute/verify** before emit |

Validators (OPS-2) correctly rejected both; same-prompt regen succeeded → first-pass generation reliability, not validator over-sensitivity. Do **not** weaken validators.

---

## 2. Exact final GAM pre-emit gate

Canonical constant `GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE` in `lib/ld-gam-page-enrich-contract.js`:

```text
FINAL SILENT PRE-EMIT CONSISTENCY CHECK:
A. Role/status: silently verify generated particulars still instantiate the pedagogical role/status commissioned by purpose, specification, evidence_requirement, learner task, and expected output (intended category, contrast polarity, constrained vs unconstrained, positive vs counterexample, transfer target). Do not invent qualifications that flip that status.
B. Quantitative/derived (only when the material contains quantitative, mathematical, computed, derived, or answer-bearing particulars): silently recompute/verify enough that values, equations, constraints, worked steps, derived quantities, and reference/diagnostic answers are mutually consistent and supported by learner-visible evidence. Skip when the material is purely qualitative.
Correct inconsistencies before emission. Emit only the corrected artefact — do not output checking or reasoning.
```

---

## 3. Conceptual-role / status invariant

**A. Role/status** — particulars must still instantiate the commissioned pedagogical role/status (purpose / specification / evidence_requirement / learner task / expected output). Invented qualifications must not flip category, contrast polarity, constrained vs unconstrained, positive vs counterexample, or transfer target.

---

## 4. Quantitative / derived consistency invariant

**B. Quantitative/derived** — **conditional**: only when materials contain quantitative / mathematical / computed / derived / answer-bearing particulars. Silent recompute/verify of values, equations, constraints, worked steps, derived quantities, and reference/diagnostic answers. Skip purely qualitative materials. No visible workings.

---

## 5. Exact live insertion point

| Path | Placement |
| ---- | --------- |
| **Canonical source** | `lib/ld-gam-page-enrich-contract.js` → `GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE` |
| **Live V2 Copy brief** | End of `buildGamV2CopyMaterialAuthoringBrief()` via `resolveGamFinalSilentPreEmitConsistencyGate()` — last authoring lines before `GAM completion override` |
| **Operator Copy assembly** | Deduped inject in `buildWorkflowStepInstructions` immediately before `GAM completion override` if gate missing |
| **Studio enrich draft** | `applyGamPageEnrichPromptBlockToDraft` appends same canonical gate (marker-deduped) |

Gate sits **after** Case 1 / OPS soft guidance and **before** completion override — true pre-emit salience, not a distant authoring paragraph.

---

## 6. Canonical / non-duplicated

- Single constant in the GAM enrich-contract module.  
- Live paths resolve that constant; no independently maintained second wording.  
- Assembled Copy prompt asserts **exactly one** gate occurrence (brief supplies it; completion-override inject skips when present).

---

## 7. Output schema unchanged

No new fields, envelope, or material shape changes. Output contract remains partial page / materials hydration as before.

---

## 8. Validators unchanged

Not modified:

- `lib/gam-operational-suitability-review.js`  
- `lib/gam-operational-suitability-prompt.js` (Stage-1 OPS block)  
- `lib/page-gam-enrich.js` capture validation  

OPS-2 / capture remain the deterministic backstop.

---

## 9. Live GAM V2 Copy / operator-path regression

`tests/s78-t-051-gam-first-pass-consistency-hardening.test.js` asserts:

- `buildGamV2CopyMaterialAuthoringBrief` ends with the gate;  
- `buildWorkflowStepInstructions` for Generate Activity Materials contains the gate once, after Material authoring guidance and before GAM completion override.

---

## 10. Prompt-position / salience regression

Gate after Case 1 soft constraint language; after authoring guidance; before completion override.

---

## 11. Domain-general regression

No Lagrangian / FOC / advertising / Hydrology production wording in the gate.

---

## 12. Relevant regression suites and results

| Suite | Result |
| ----- | ------ |
| T-051 (7 tests) | **PASS** |
| `s78-gam-operational-suitability-prompt.test.js` | **PASS** (with related batch) |
| `s78-disciplinary-precision-salience.test.js` | **PASS** |
| `s78-gam-learner-closure-packaging.test.js` | **PASS** |
| `s78-t-041-…` | **PASS** |
| `s78-t-042-…` | **PASS** |
| `page-gam-enrich` GAM copy prompt | **PASS** |

---

## 13. Files changed

| File | Change |
| ---- | ------ |
| `lib/ld-gam-page-enrich-contract.js` | Canonical `GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE` + export |
| `app.js` | Resolve helper; append on V2 Copy brief; Studio inject; Copy completion-override dedupe; test API |
| `tests/prism-vm-lib-bootstrap.js` | Load / mirror `ld-gam-page-enrich-contract` |
| `tests/s78-t-051-gam-first-pass-consistency-hardening.test.js` | **New** focused regressions |
| This record + sprint nav | STATUS / HANDOVER / PLAN / START-HERE / next-chat-briefing |

---

## 14. Deviations / unresolved risks

- **Prompt delivery ≠ stochastic proof.** This task does not claim improved first-pass rates.  
- Residual emit-time miss rate may remain; OPS-2 stays the backstop. No auto-retry.  
- DLA T-050 left untouched (structural P02 remains DLA-owned).

---

## 15. Fresh-benchmark recommendation

Next meaningful evidence: a **fresh** from-top run recording (per T-049 §14):

- DLA first-pass validation PASS/FAIL + regen count  
- GAM first-pass OPS-2 / verification PASS/FAIL + regen count  
- Eventual validation result  
- Final learner-resource QA uncapped  

Tag notes with `gam_role` / `gam_quantity` / `p02_structure` when relevant. Do **not** treat prompt-test green as reliability closure.

---

## 16. Sprint 78 / T-013 state

| Item | State |
| ---- | ----- |
| Sprint 78 | **OPEN** |
| T-013 | **OPEN** |
| T-050 | Complete (DLA) |
| T-051 | **Implementation complete** (GAM) |
| Next | Fresh benchmark with first-pass reliability recording; then assess T-013 / further work |

Learner workspace/interactivity remains **PARKED**.

# S78-T-015 — GAM operational suitability authoring salience implementation

**Task:** S78-T-015  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** GAM Stage-1 prompt-contract repair (operational suitability)  
**Depends on:** [S78-T-014](S78-T-014-gam-operational-suitability-solution-design.md), [S78-T-012](S78-T-012-gam-operand-aware-model-practice-independence-authoring.md)  
**Does not include:** Semantic validators, DLA schema changes, Lagrangian regeneration, T-013 execution, T-003 diagnostic

---

## 1. Implementation summary

Implemented **S78-OPERATIONAL-SUITABILITY (auto-applied)** GAM Stage-1 authoring block:

- New `lib/gam-operational-suitability-prompt.js` — commission-led obligation collector + compact auto-applied block
- Injected in `buildAuthoritativeDlaMaterialCommissionSectionFromPage` (`app.js`) immediately after T-023 commission JSON and S78-WS-2 block (when present)
- Case 1 global brief cross-reference added (no large prose duplication)
- GAM partial contract one-line pointer (`lib/ld-gam-page-enrich-contract.js`)
- Browser load via `index.html`; Node/vm bootstrap via `tests/prism-vm-lib-bootstrap.js`
- Regression tests: `tests/s78-gam-operational-suitability-prompt.test.js` (R1–R10 + cross-disciplinary + verification)

**No semantic validators. No DLA changes. No GAM capture validator changes.**

---

## 2. Canonical invariant implemented

> When GAM generates load-bearing particulars for a commissioned learner action or worked-model result, those particulars must be **mutually consistent** and **sufficient** for the commissioned action/result to be completed as specified, within intended scope.

Commission-relative — not domain-specific, not always-unique, not always-complete.

---

## 3. Live GAM injection point

```text
GAM Copy / Prompt Studio
  → buildUpstreamDlaPageEmbedSectionForGamCopy(wf)
      → buildAuthoritativeDlaMaterialCommissionSectionFromPage(page)
          → projectGamAuthoritativeDlaCommissionFromPage(page)     // T-023 JSON
          → buildS78Ws2OperandAwareAuthoringBlock(page)            // T-012 (when bound)
          → buildOperationalSuitabilityAuthoringBlock(page)        // T-015 (NEW)
  → buildGamV2CopyMaterialAuthoringBrief()                         // Case 1 global + cross-ref
  → instructional-pattern blocks (SP-06/07)
  → ld-gam-page-enrich-contract
```

Pattern: **AUTHORITATIVE COMMISSION → LOCAL AUTO-APPLIED OBLIGATION → MATERIAL AUTHORING**

---

## 4. Trigger implementation

Primary commission-led signals (no brittle verb taxonomy):

| Signal | Source |
| ------ | ------ |
| **A — learner performance/output** | `classifyLearnerProductionSteps` production kinds **or** non-study/non-verify learner_task steps with `expected_output` and/or `task_material_decision.task_input_material_ids` |
| **B — promised worked/model result** | `purpose`/`specification` on model rows matching complete-worked commission patterns |

Per-material inclusion:

- **learner_operand** — task inputs and operand-family rows when activity requires suitability
- **model_complete** / **model_demonstration** — `worked_example` / `modelling_note` when complete-worked promised or activity has load-bearing production

Study-only pages without load-bearing production emit **no block**.

---

## 5. Case 1 reuse/evolution

Existing S77-T-021 Case 1 semantics preserved in `buildGamV2CopyMaterialAuthoringBrief`:

- enough coherent information for commissioned operation
- no contradictory/underdetermined particulars when identifying/completing determinate results

**Evolution:** one cross-reference line pointing to local `S78-OPERATIONAL-SUITABILITY (auto-applied)` block when injected. Local block re-expresses Case 1 at per-material salience without duplicating the full global brief.

---

## 6. Local auto-applied block semantics

Compact obligations (not a generic QA rubric):

- load-bearing particulars must be mutually consistent and sufficient
- forbid contradictory/underdetermined particulars when commission requires determinate completion
- complete worked results must reach promised outcome (not partial intermediate stop)
- learner operands remain unsolved but operationally usable
- preserve intentional open-endedness or deliberate insufficiency when commissioned
- preserve `response_fulfilment` blank cells; compose with S78-WS-2

---

## 7. Per-material grounding

Each obligation line names:

- `material_id` + `material_type`
- `activity_id`
- role label (`learner operand`, `complete worked/model result`, `model demonstration`)
- truncated `purpose` (from commission)
- mode-specific suffix (determinate / open-ended / deliberate insufficiency)

No fabricated semantics beyond DLA commission fields.

---

## 8. Prompt size

Representative Candidate-1-shaped commission (A4 model + operand + workspace):

| Component | Chars |
| --------- | ----- |
| S78-OPERATIONAL-SUITABILITY block | **1357** |
| S78-WS-2 block (same page) | 1056 |
| Combined injected blocks (WS2 + ops) | ~2413 |
| Net commission-section increase over JSON-only | **< 4500** (test bound) |

---

## 9. Test results

### R1–R10 prompt-contract tests

| ID | Result |
| -- | ------ |
| R1 valid determinate learner operand | **PASS** |
| R2 contradictory particulars forbidden | **PASS** |
| R3 insufficient particulars forbidden (determinate) | **PASS** |
| R4 complete worked model | **PASS** |
| R5 incomplete worked model non-compliant | **PASS** |
| R6 open-ended — no spurious uniqueness | **PASS** |
| R7 deliberate insufficiency preserved | **PASS** |
| R8 WS2 coexistence | **PASS** |
| R9 WS1 response_fulfilment coexistence | **PASS** |
| R10 Candidate-1-shaped without domain-specific production logic | **PASS** |

### Cross-disciplinary fixtures

| Domain | Result |
| ------ | ------ |
| Programming task (`task_card`) | **PASS** |
| Data/table production (`scenario` + workspace) | **PASS** |
| Open humanities interpretation | **PASS** |
| Deliberate insufficiency brief | **PASS** |

### Existing suites (focused batch)

| Suite | Result |
| ----- | ------ |
| `s78-gam-operational-suitability-prompt.test.js` | **21/21** |
| `s78-gam-practice-independence-prompt.test.js` | **13/13** |
| `s78-dla-response-fulfilment.test.js` | **pass** |
| `s78-gam-workspace-blank-cell.test.js` | **pass** |
| `s78-dla-practice-independence.test.js` | **pass** |
| `page-gam-enrich.test.js` | **pass** |
| `ld-dla-canonical-assembler.test.js` | **pass** |
| `workflow-instructional-pattern-prompt.test.js` | **pass** |
| `ld-instructional-archetype-production-planning.test.js` | **pass** |

**Combined focused regression:** **190/190 pass** (no pre-existing failures observed in batch).

---

## 10. Production / test files changed

| File | Change |
| ---- | ------ |
| `lib/gam-operational-suitability-prompt.js` | **New** — block builder + commission-led trigger |
| `app.js` | Inject block; `resolveGamOperationalSuitabilityPromptLib`; Case 1 cross-ref |
| `lib/ld-gam-page-enrich-contract.js` | One-line suitability pointer |
| `index.html` | Script load |
| `tests/prism-vm-lib-bootstrap.js` | Sandbox bootstrap |
| `tests/s78-gam-operational-suitability-prompt.test.js` | **New** — R1–R10 + verification |

---

## 11. Deviations from T-014

| Item | Deviation |
| ---- | --------- |
| Marker name | Used `S78-OPERATIONAL-SUITABILITY (auto-applied)` rather than WS-numbered label |
| SP-06/07 | No change — suitability salience is commission-local like T-009/T-012 |
| Classifier fallback | Minimal step-parser fallback when `dla-production-fulfilment` unavailable in browser/vm (production classifier used when require available) |

No DLA metadata, no semantic validator, no Lagrangian-specific rules — as designed.

---

## 12. Remaining operational-suitability gap

Stage 1 remains **prompt-contract salience only**. Fresh regeneration evidence is required to confirm GAM reliably authors valid operands under the new local obligations. Candidate 1 remains negative evidence until superseded.

---

## 13. T-013 status after T-015

**S78-T-013 ready to resume** operator-led fresh from-top Lagrangian generation verifying:

- WS1
- WS2
- operational suitability
- clean QA

**Do not execute regeneration in T-015.**

Candidate 1 preserved: WS2 **PASS**; operational suitability **FAIL**; QA **83 uncapped / 69 release / 0 Critical / 2 Major**.

---

## 14. Recommended next action

**Resume S78-T-013** with fresh DLA→GAM regeneration and independent QA. STOP after verification record update unless new failure class emerges.

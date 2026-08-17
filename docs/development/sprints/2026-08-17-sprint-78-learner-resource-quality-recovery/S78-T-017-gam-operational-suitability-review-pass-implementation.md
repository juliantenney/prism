# S78-T-017 — GAM operational suitability review pass implementation

**Task:** S78-T-017  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-17)  
**Mode:** Stage-2 verification pass (prompt + review artefact + fail-closed GAM acceptance)  
**Depends on:** [S78-T-016](S78-T-016-operational-suitability-stage-2-enforcement-design.md) (authoritative design) · T-015 obligation collector  
**Does not include:** Lagrangian regeneration · T-013 operator verification · T-003 · domain solvers · T-015 prose expansion · renderer/QA changes

Sprint 78 remains **OPEN**. Sprint 77 remains **CLOSED**.

T-013 remains **OPEN**. Unit tests do **not** close operational suitability.

**Product status ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)):** this review pass is **temporary instrumentation**. Live FAIL copy may tell the operator to regenerate GAM from the same DLA; that is **operator recovery**, not Sprint 78 reliability closure. **“Regenerate until it passes” is not acceptable.**

---

## 1. Implementation summary

Implemented the T-016 hybrid:

- **Keep T-015** Stage-1 authoring salience (no extra generic prose).
- **Add a separate Copilot review pass** after structurally valid GAM capture.
- **Fail-closed** before GAM step completion / assembly when load-bearing obligations exist.

Live completion boundary chosen: **same GAM workflow step**, after existing `validateGamEnrichedPage`, not a new factory stage.

```text
DLA → GAM generation → structural GAM validation
  → if T-015 obligations exist: review REQUIRED
  → all suitable === true → GAM accepted → assembly
  → any suitable === false → GAM unaccepted; regenerate GAM only from the same DLA
If zero obligations: existing GAM path (no ceremonial review)
```

Prism validates the **verdict artefact** structurally. It does **not** re-solve the commissioned operation in JavaScript.

---

## 2. Exact live workflow before / after

### Before (post-T-015)

```text
GAM Copy / Prompt Studio
  → Copilot authors GAM
  → paste into GAM step
  → parse JSON → normalizeGamCaptureToPage
  → validateGamEnrichedPage (ids, bodies, math markup, WS1 blank-cell, …)
  → if ok: GAM step completable → Next / assembly
```

Semantic operational suitability was **not** a capture condition. Candidate 4 could PASS this path with an impossible commissioned solve.

### After (T-017)

```text
GAM Copy / Prompt Studio          (authoring prompt unchanged: T-015 + T-012 + Case 1)
  → Copilot authors GAM
  → paste into GAM step
  → structural validateGamEnrichedPage
  → if fail: review UI hidden; existing GAM errors block
  → if ok AND T-015 obligations exist:
        show review pane
        Copy review prompt (commission + obligated bodies only)
        paste gam_operational_suitability_review JSON
        structural artefact validation + fingerprint bind
        all suitable true → GAM completable
        any suitable false → block; regenerate GAM only
  → if ok AND zero obligations: existing acceptance (no review)
```

**Prompt Studio:** still copies the GAM **authoring** prompt only. Review is a **second** Run-mode control (`Copy review prompt`) after a structurally valid GAM paste. Authoring is not appended with “certify your own output”.

---

## 3. Reused T-015 obligation collector

`lib/gam-operational-suitability-review.js` calls `collectSuitabilityObligationsFromPage` from `lib/gam-operational-suitability-prompt.js`.

Stage-1 authoring scope and Stage-2 verification scope are the **same** obligation set.

Collector change (bounded): store **full** `purpose` / `specification` / `learner_task` / `expected_output`, and copy `practice_independence` / `response_fulfilment` when present so the review can note them as **out of scope**. T-015 authoring block still **truncates on display only**.

Workspace rows remain excluded (WS1 owns them).

---

## 4. Review trigger

Review is **required** iff `collectSuitabilityObligationsFromPage(dla).length > 0`.

Trigger runs only after structural GAM validation succeeds (`applyGamPackTextValidationToCapture` → `applyGamOperationalSuitabilityReviewGate`).

Zero obligations → no prompt, no artefact, no gate message.

---

## 5. Review prompt structure

Module: `lib/gam-operational-suitability-review.js` → `buildReviewPrompt(dlaPage, gamPage)`.

Contents:

1. Role: REVIEW, not rewrite / quality / WS1 / WS2 / T-003.
2. Commission-relative criteria (consistency, sufficiency, operand answerability, model completeness, open-ended, deliberate insufficiency).
3. Strict JSON example (`artifact_type`, `schema_version`, `gam_fingerprint`, `verdicts[]`).
4. Per obligated row: ids, type, role, `commission_mode`, learner_task, expected_output, purpose, specification, generated body.
5. `gam_fingerprint (copy unchanged)`.

Not included: GAM v2 authoring brief, T-015 authoring block, T-012 WS2 authoring block, enrich-contract schema dump, full page JSON.

---

## 6. Review artefact schema

```json
{
  "artifact_type": "gam_operational_suitability_review",
  "schema_version": "1.0.0",
  "gam_fingerprint": "<8-hex>",
  "verdicts": [
    {
      "activity_id": "<activity_id>",
      "material_id": "<material_id>",
      "suitable": true,
      "failure_class": "none",
      "reason": ""
    }
  ]
}
```

`failure_class`: `none` | `contradiction` | `insufficiency` | `incomplete_model`.

---

## 7. Deterministic artefact validation

`validateReviewArtefact` / `evaluateReviewGate` check:

- JSON object (optional markdown fence strip on parse only; no repair of malformed JSON)
- artefact type / schema version
- exact obligated `material_id` set (no extras, duplicates, omissions)
- `activity_id` required; must match obligated activity when both present
- `suitable` boolean
- `failure_class` enum
- `suitable === true` ⇒ `failure_class === none`
- `suitable === false` ⇒ `failure_class !== none` and non-empty `reason`
- `gam_fingerprint` matches current GAM bodies

This is **shape** validation of the verdict, not semantic re-judgement.

---

## 8. Semantic judgement boundary

| Prism (JS) | Copilot review |
| ---------- | -------------- |
| Obligation set, ids, fingerprint, enum, PASS/FAIL field consistency | Whether particulars actually permit the commissioned action/result |
| WS1 blank-cell / WS2 id binding (unchanged existing gates) | Not WS1, not WS2, not T-003 |

No equation parsers, number heuristics, Lagrangian/FOC/λ rules, or domain solvers.

---

## 9. GAM candidate ↔ review binding

T-017 originally hashed GAM bodies only. **T-017A** binds `gam_fingerprint` to the canonical review scope (obligated commission fields + obligated generated bodies). See [S78-T-017A](S78-T-017A-operational-suitability-review-binding-hardening.md).

Review must copy `gam_fingerprint` unchanged from the prompt. Operator-facing GAM Run UX is in [S78-T-018](S78-T-018-operational-suitability-review-ux-workflow-integration.md).

---

## 10. Stale-review handling

GAM body **or** relevant commission/scope change ⇒ fingerprint change ⇒ `S78_OPS2_STALE_REVIEW` ⇒ previous review cannot accept the current candidate. Operator must rerun the review.

---

## 11. All-PASS acceptance behaviour

Structurally valid review + every obligated `suitable === true` ⇒ clear `workflowRunGamSuitabilityReviewValidation` ⇒ existing Next/complete path may proceed (other GAM/DLA gates unchanged).

---

## 12. Any-FAIL behaviour

Any `suitable === false` ⇒ `S78_OPS2_REVIEW_FAIL` ⇒ GAM remains unaccepted, step completion cleared, assembly unavailable. No partial PASS. No warning-only path.

---

## 13. Operator retry workflow

On FAIL the UI states:

- GAM is not accepted.
- **Regenerate GAM only** from the **same DLA**.
- Do not edit the rejected GAM.
- Do not assemble.
- Do not ask the reviewer to repair content as the primary output.

No autonomous retry subsystem. Smallest reuse: existing GAM paste + new review textarea on the same step.

---

## 14. Zero-obligation behaviour

Study-only / no load-bearing production: existing structural GAM path. No empty review artefact.

---

## 15. Open-ended handling

Prompt: multiple defensible answers are **not** a failure when the commission is interpretive/open-ended. Tests: humanities fixture can PASS.

---

## 16. Deliberate-insufficiency handling

Prompt: missing information is **not** a failure when identifying it is the commissioned task. Tests: incomplete-brief fixture can PASS.

---

## 17. Model-completeness handling

Prompt: if purpose/specification promises a complete worked result, the body must reach it. Tests: `incomplete_model` FAIL blocks; complete-model PASS accepted.

---

## 18. WS1 preservation

No changes to `response_fulfilment`, blank-cell guard, or workspace renderer. Review explicitly excludes WS1. Blank-cell failures still come from T-007 `validateGamEnrichedPage`.

---

## 19. WS2 preservation

No changes to `practice_independence`, DLA WS2 closure, or T-012 authoring. Review explicitly excludes independence. Candidate-4-shaped fixture: distinct model/attempt bodies + suitability FAIL still blocks.

---

## 20. P02 preservation

No changes to `evidence_decision` / `evidence_requirement` / provider closure / T-009. Review prompt does not ask P02 questions. Protected DLA assembler / P02 suites unchanged.

---

## 21. T-003 boundary

Review asks only whether the commissioned task/model can be completed as specified. Prompt forbids learner diagnostic feedback / revision review. T-003 remains queued.

---

## 22. Cross-disciplinary fixtures

Prompt-contract tests (no JS solvers): mathematics-shaped determinate operand; programming debug operand; data/table totals; open humanities; deliberate insufficiency.

---

## 23. Candidate-4-shaped regression

Domain-neutral fixture: structurally distinct model vs attempt bodies; blank workspace table; obligated practice operand; review `contradiction` FAIL on the attempt operand; step completion blocked. No Lagrangian equations in production logic.

---

## 24. Malformed-review cases

Fail closed (actionable codes, no auto-repair):

| Case | Signal |
| ---- | ------ |
| Missing review | `S78_OPS2_REVIEW_REQUIRED` |
| Invalid JSON | `S78_OPS2_REVIEW_INVALID` |
| Extra / duplicate / missing ids | artefact errors |
| Invalid `failure_class` / PASS-FAIL inconsistency / empty FAIL reason | artefact errors |
| Stale fingerprint | `S78_OPS2_STALE_REVIEW` |
| Any unsuitable row | `S78_OPS2_REVIEW_FAIL` |

---

## 25. Review prompt size

Representative Candidate-4-shaped fixture (two obligated rows, short bodies):

| Artefact | Characters |
| -------- | ---------- |
| Review prompt | **3238** |
| T-015 authoring block (same DLA) | 1372 |
| GAM authoring brief + commission section + enrich contract | **19173** |

Review is local (criteria + commission + obligated bodies), not a second global GAM brief.

---

## 26. Production files changed

| File | Role |
| ---- | ---- |
| `lib/gam-operational-suitability-review.js` | **New** — prompt, fingerprint, artefact validation, gate |
| `lib/gam-operational-suitability-prompt.js` | Collector stores full commission text + WS1/WS2 notes for review reuse |
| `app.js` | Review state, Copy prompt, paste capture, fail-closed GAM completion |
| `index.html` | Load review lib |
| `tests/prism-vm-lib-bootstrap.js` | Node/vm load + window wire |

---

## 27. Test files changed

| File | Role |
| ---- | ---- |
| `tests/s78-gam-operational-suitability-review.test.js` | **New** — R1–R20 + malformed + collector identity |

No existing fixtures weakened.

---

## 28. Documentation files changed

| File | Role |
| ---- | ---- |
| `S78-T-017-gam-operational-suitability-review-pass-implementation.md` | This record |
| `STATUS.md` | T-017 complete; T-013 still OPEN |
| `PLAN.md` | T-017 complete |
| `SPRINT-78-START-HERE.md` | Next = resume T-013 with review pass |
| `S78-T-013-workstream-2-integration-verification.md` | Blocked on post-T-017 operator run |

---

## 29. Tests run / results

`tests/s78-gam-operational-suitability-review.test.js` — **24/24 PASS** (R1–R20 plus malformed, WS2-out-of-scope, collector identity, no domain solvers).

---

## 30. Protected regression results

| Suite | Result |
| ----- | ------ |
| `s78-gam-operational-suitability-prompt.test.js` | PASS (T-015) |
| `s78-gam-practice-independence-prompt.test.js` | PASS (T-012) |
| `s78-dla-practice-independence.test.js` | PASS (T-011) |
| `s78-dla-response-fulfilment.test.js` | PASS (WS1 DLA) |
| `s78-gam-workspace-blank-cell.test.js` | PASS (T-007) |
| `page-gam-enrich.test.js` | PASS |
| `ld-dla-canonical-assembler.test.js` | PASS (P02/T-009 markers preserved) |
| `ld-dla-evidence-decision-consistency-prompt.test.js` | PASS |
| `ld-instructional-archetype-production-planning.test.js` | PASS |

**177/177** in the combined protected batch.

---

## 31. Deviations from T-016

| T-016 | This implementation |
| ----- | ------------------- |
| Prefer existing GAM step over new stage | **Followed** — same GAM step after structural validation |
| Session-only review allowed | **Followed** — review JSON is **not** in `buildWorkflowRunStateSnapshot` (reload requires re-paste) |
| Prompt Studio equivalent | Review Copy is **Run-mode only**; Studio still copies authoring only (documented, not a second certify-in-authoring path) |
| Reuse T-015 collector | **Followed**; collector stores full text for the review prompt |

No extra failure classes. No solvers. T-015 authoring semantics not expanded.

---

## 32. Remaining limitations

- Review quality is Copilot-judgement: false PASS / false FAIL remain possible.
- Review capture is session-only; not restored from durable runstate.
- Prompt Studio has no dedicated review Copy control.
- Structural GAM validity is still required before the review pane appears.
- T-013 operator evidence is **not** produced by this task.

---

## 33. Exact recommended next action

**Resume S78-T-013** with a fresh operator-led Lagrangian run:

```text
EP → DLA → GAM → operational-suitability review → assembly → QA
```

Do **not** regenerate inside T-017 (this task is complete).  
Do **not** start T-003.  
Do **not** mark operational suitability or Workstream 2 closed from unit tests.

# S78-T-018 — Operational suitability review UX + workflow integration

**Task:** S78-T-018  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-17)  
**Mode:** Run-mode UX + GAM sub-flow integration (architecture retained)  
**Depends on:** [S78-T-017](S78-T-017-gam-operational-suitability-review-pass-implementation.md) · [S78-T-017A](S78-T-017A-operational-suitability-review-binding-hardening.md)  
**Does not include:** Semantic-review redesign · JS semantic judgement · Lagrangian regeneration · T-003 · other workflow-step generalisation

Sprint 78 remains **OPEN**. Sprint 77 remains **CLOSED**. T-013 remains **OPEN**.

The semantic review architecture is **retained experimentally** as a **sub-phase of Generate Activity Materials**, not an unrelated technical artefact.

**Product status ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)):** T-017–T-018 are **temporary evidence-gathering / reliability instrumentation**. They are **not rejected**. They are **not** the desired permanent GAM product contract. Intended steady state remains: Generate Activity Materials → valid capture → Step complete → Next. A verifier FAIL is a **GAM generation failure**. **“Regenerate until it passes” is not an acceptable Sprint 78 reliability outcome.** Removal of the extra interaction depends on evidence and is **not scheduled**.

**T-018A:** verification is GAM-step-only. A valid DLA paste must not show “Materials generated — verification required”. See [S78-T-018A](S78-T-018A-gam-review-scope-regression-verification-copy-paste-fix.md).

---

## 1. Root cause of “Step complete / Next enabled”

Three cooperating defects, not a missing validator:

1. **Completion copy was capture-based.** `formatWorkflowRunStepCompleteStatus` returns **Step complete** whenever the GAM textarea has a body, unless a listed validation error is shown. Review-required was not a first-class incomplete status.
2. **Review UI was independent of completion.** The verification pane appeared from obligation presence after a structurally valid GAM, even when the operator had not submitted a verification result.
3. **There was no explicit submit.** Evaluation ran on textarea `input` (or not at all if the gate was not applied). Operators could paste GAM, see **Step complete**, see a review box below, and use **Next** without a Check action.

Fail-closed evaluation existed in the library; it was not expressed as the GAM step’s completion/Next contract.

---

## 2. Live state model before / after

**Before:** GAM body present → Step complete; Next if no structural errors; review pane optional/side-channel.

**After (GAM v2 only):**

| Phase | Complete | Next | Verification UI |
| ----- | -------- | ---- | --------------- |
| A awaiting_gam | no | disabled (no paste) | hidden |
| B gam_invalid | no | disabled | hidden |
| C gam_valid_no_review_required | **yes** | enabled | hidden |
| D gam_valid_review_required | no | disabled | shown |
| E review_invalid | no | disabled | shown |
| F review_failed | no | disabled | shown |
| G review_passed | **yes** | enabled | shown (passed) |

---

## 3. Exact completion rule

GAM is complete only for **C** or **G**.

---

## 4. Exact Next enablement rule

Next is enabled only when the step is complete (C or G) and other existing capture gates pass. D/E/F keep Next disabled.

---

## 5. Review UI visibility rule

Shown only after structurally valid GAM **and** T-015 obligations exist. Hidden for zero-obligation GAM and before a valid GAM exists.

---

## 6. User-facing terminology

| UI | Copy |
| -- | ---- |
| Heading | Verify generated materials |
| Intro | These materials include generated information that learners must rely on to complete their tasks. Run a short verification before continuing. |
| Copy | Copy verification prompt |
| Paste | Paste verification result |
| Submit | Check verification |
| Pending status | Materials generated — verification required |

Internal names (`gam_operational_suitability_review`, fingerprint, failure_class, Stage 2) are not primary UI.

---

## 7. Explicit review-submit action

**Check verification** parses JSON, validates the artefact + T-017A fingerprint + obligated ids, and applies PASS/FAIL. Textarea `input` only stores text and clears a prior PASS if the paste changes; it does not submit.

---

## 8. PASS UX

**Verification passed** — “Generated materials are suitable for the commissioned learner tasks.” Step complete; Next enabled.

---

## 9. FAIL UX

**Verification found an issue** plus material id + Copilot `reason`. Instruction: **Regenerate the activity materials from the same DLA prompt.** Next disabled.

---

## 10. Malformed-review UX

**Verification result could not be read** — “Run the verification prompt again and paste the complete JSON result.” Next disabled. No parser stacks.

---

## 11. Stale-review UX

**Materials changed — verification must be run again.** PASS cleared; Next disabled; new Check required. T-017A binding preserved.

---

## 12. Zero-obligation UX

No verification UI. Structural GAM PASS → Step complete → Next.

---

## 13. Semantic judgement remains Copilot-only

JS builds the prompt, reuses T-015 obligations, validates JSON/shape/fingerprint, reads Copilot `suitable` booleans, and manages workflow state. No solvers or content heuristics.

---

## 14. T-017A binding preservation

Fingerprint still covers obligated bodies + authoritative review-scope commission. Any relevant change invalidates PASS.

---

## 15. T-015 preservation

Authoring salience unchanged.

---

## 16–18. WS1 / WS2 / P02

No contract changes. Protected suites PASS.

---

## 19. Production files changed

- `app.js` — GAM verification view-model, Check action, completion/Next wiring, product copy
- `index.html` — `app.js` cache-bust `s78-t018-gam-verify`

---

## 20. Test files changed

- `tests/s78-gam-verification-ux.test.js` (**new** — R1–R12, R16, Cases A–D)
- `tests/s78-gam-operational-suitability-review.test.js` — user-facing gate strings only (fail-closed preserved)

---

## 21. Documentation files changed

- This record
- `STATUS.md`, `PLAN.md`, `SPRINT-78-START-HERE.md`, `HANDOVER.md`, `next-chat-briefing.md`
- `S78-T-013-workstream-2-integration-verification.md`
- T-017 / T-017A cross-links

---

## 22. Tests run / results

`s78-gam-verification-ux.test.js` — **17/17 PASS**  
`s78-gam-operational-suitability-review.test.js` — **36/36 PASS**

Combined T-018 + T-017/T-017A + T-015 + T-012 + T-011 + WS1 DLA/GAM + `page-gam-enrich` + `workflow-run-step-complete-status` + P01/P02/P03: **191/191 PASS**.

---

## 23. Protected regression results

T-015, T-012, T-011, WS1 DLA/GAM, `page-gam-enrich`, `workflow-run-step-complete-status`, P01/P02/P03 — included in the **191/191** combined batch.

---

## 24. Manual workflow verification

No Lagrangian regeneration. Cases A–D exercised as programmatic Run-state fixtures in the T-018 suite (zero-obligation one-phase; obligations + Check PASS; FAIL keeps Next disabled; candidate change invalidates PASS). Live operator confirmation is T-013.

---

## 25. Deviations

Generic `formatWorkflowRunStepCompleteStatus` still returns “Step complete” for non-GAM steps (protected). GAM verification overrides that line in `updateRunStepOutputStatus`. Review JSON remains session-only. Prompt Studio still copies GAM authoring only.

---

## 26. Reusable-pattern observations (do not generalise yet)

| Concept | This implementation |
| ------- | ------------------- |
| Generated artefact | GAM capture |
| Semantic verification prompt | Copilot Copy inside the same step |
| Verdict artefact | structurally validated JSON |
| Candidate binding | T-017A review-scope fingerprint |
| Fail-closed completion | only C/G complete |

Do not extract a generic framework until a second step needs the same shape.

---

## 27. Exact recommended next action

**Resume S78-T-013** on a fresh operator-led Lagrangian, using Verify generated materials as **temporary instrumentation** ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)):

```text
EP → DLA → GAM → Verify generated materials (Check verification) → assembly → QA
```

On FAIL: preserve the candidate and diagnose; do not treat a later PASS as first-pass reliability. Do not broaden to other workflow steps. Do not start T-003. Do not regenerate inside T-018.

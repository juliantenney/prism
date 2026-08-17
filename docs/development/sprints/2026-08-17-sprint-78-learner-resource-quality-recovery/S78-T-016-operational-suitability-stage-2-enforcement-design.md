# S78-T-016 — Operational suitability Stage-2 enforcement diagnostic / solution design

**Task:** S78-T-016  
**Status:** **DESIGN COMPLETE** (2026-08-17)  
**Mode:** DIAGNOSTIC + DESIGN ONLY — no implementation  
**Depends on:** T-013 Candidates 1/3/4 · T-014 · T-015 · S76-T-031 · S77-T-020/T-021  
**Sprint 77:** remains CLOSED  
**Out of scope:** implementation, regeneration, production/prompt/schema/validator/test/assembly/renderer changes, Lagrangian-specific logic, T-003

**Product status (2026-08-17):** implemented via T-017–T-018 as **temporary instrumentation**, not final architecture and not rejected — [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification).

---

## 0. Decision (executive)

T-015 Stage-1 prompt salience is **insufficient**. Fresh structurally valid GAM (Candidate 4) still emits load-bearing particulars that make the commissioned operation impossible.

**Recommended Stage-2 architecture:**

```text
HYBRID
  keep T-015 authoring salience (do not add more prose as the repair)
  +
  separate general semantic verification pass
  (operator Copilot critique of commission + generated bodies)
  +
  Prism fail-closed before assembly
```

**Primary classification: E** (separate general semantic verification pass)  
**Secondary: F** (hybrid — retain Stage-1; do not expand it)

Not A (more prompt). Not B (heuristic validator). Not C (domain solvers). Not D (self-certify during generation). Not G (no further repair).

T-014 §10.3 revisit threshold is **met**.

---

## 1. Stage-1 capability / reliability conclusion

| Question | Answer |
| -------- | ------ |
| Model capability | **YES** |
| Generation reliability | **NO** |
| T-015 prompt salience sufficient | **NO** |

**Capability YES:** Candidate 3 (pre-truncation) showed WS2 separation and a mathematically usable A4 operand. Candidate 4 is structurally valid JSON with observable WS1/WS2. The model *can* author suitable and independent operands.

**Reliability NO:** Candidate 1 (pre-T-015) and Candidate 4 (post-T-015) both emit contradictory FOC systems that make “determine optimal values / report x, y, λ” impossible. Same failure class across salience repair.

**Salience insufficient:** Candidate 4 was generated **after** local `S78-OPERATIONAL-SUITABILITY` injection beside the commission. The model saw the obligation and still authored an inconsistent system. Further prompt prose is the same reliability class (S76/S77 already stacked T-031 + Case 1 + T-015).

**Candidate 2 excluded:** E2 transport/generation corruption; unrelated.

---

## 2. Exact current architectural gap

Live path:

```text
DLA learner_task / expected_output / purpose / specification
  → response_fulfilment (WS1) / practice_independence (WS2)
  → T-023 authoritative GAM commission JSON
  → T-015 operational-suitability authoring block
  → GAM authored bodies
  → GAM capture: JSON + shape + 1:1 ids + non-empty body
                 + math-markup integrity + WS1 blank-cell gate
  → assembly / render
  → QA
```

The architecture **stops being able to establish** “this generated material actually permits the commissioned action/result” **at GAM capture**.

Capture can prove: the row exists, the body is non-empty, TeX is contiguous, workspace cells are blank, model id ≠ attempt id (if DLA bound). It **cannot** prove: particulars are mutually consistent or sufficient for the commissioned result.

That is the gap T-014 named and T-015 left to evidence. Candidate 4 closes the evidence question.

---

## 3. Deterministically validatable information today

| Field | At GAM capture | Supports |
| ----- | -------------- | -------- |
| `learner_task` / `expected_output` | Present on DLA baseline, not semantically interpreted for suitability | **A** structural / intent statement |
| `purpose` / `specification` | Present; non-empty checks only | **A** intent |
| `material_type` | Vocabulary / workspace compatibility (WS1) | **A** / limited **B** |
| `task_input_material_ids` | Id closure | **A** |
| `response_fulfilment` | Kind/shape + blank-cell gate | **A** / **B** (table emptiness) |
| `practice_independence` | Binding ids exist; GAM prompt uses them; capture does **not** compare body semantics | **A** |
| `evidence_requirement` | Shape + provenance clauses | **A** / **B** (structure) |
| authored `body` | Non-empty; markdown vs guided-review JSON; math **markup** integrity | **A** / **B** (TeX hygiene) — **not C** |

**None of these fields yield semantic operational-suitability validation.** Intent metadata does not make a contradictory λ-system detectable without understanding the commissioned operation against the generated particulars.

---

## 4. Why Candidate 4 passed existing capture

Candidate 4 is well-formed page JSON: 1:1 materials, titles, markdown bodies, likely blank workspace cells, distinct model vs attempt instances. FOC lines are well-formed TeX. Capture has **no rule** that `8 − λ = 0` and `4 − λ = 0` cannot jointly determine λ when the task asks for λ.

Passing capture is **correct** under current contracts. It is not a capture bug.

---

## 5. Assessment of candidate approaches

### A. More prompt salience

**Not justified as the Stage-2 repair.** T-015 already placed the invariant adjacent to the commission. Candidate 4 failed anyway. S77-T-020 already found a packed Case 1 sentence insufficient; T-015 was the salience repair. A third prose layer repeats the same class.

Keep T-015 in place (it may still raise hit rate; Candidate 3 is compatible). Do **not** add more generic QA rubric text.

### B. Deterministic heuristic validator

Number matching, equation counts, keyword “solve”, string similarity: **high false-positive / false-negative across disciplines.**

- Open humanities would fail uniqueness heuristics.
- Deliberate insufficiency would fail completeness heuristics.
- Candidate 4 has the “right” number of FOCs (three) — equation-count **false PASS**.
- Programming/debug tasks have no stable token signature.

**Reject** as canonical enforcement.

### C. Domain-specific semantic validators

Equation parsers, Lagrangian/FOC/λ rules: **violate the architectural goal.** Equivalent failures exist in stats, code, finance, logic. A math special case would not transfer and would encode the exhibit rather than the invariant.

**Reject.**

### D. GAM self-verification (emit assertion with the page)

Same generation that authored the inconsistent system would be asked to certify it. Candidate 4 already “knew” the T-015 rule during authoring. Self-certify is **not independent enforcement**.

**Reject** as the fail-closed mechanism. Optional later telemetry only — not acceptance.

### E. Separate general semantic verification pass

A **distinct** Copilot operation after GAM structural capture:

- input: authoritative commission (T-023) + generated load-bearing bodies + T-014 invariant (commission-relative);
- output: structured per-material suitability verdicts;
- Prism: shape-validate the verdict artefact; **FAIL-CLOSE** GAM acceptance if any load-bearing row is `suitable: false`.

This is a **different task** (critique vs author). It stays domain-general (reason about commission vs particulars). It fits Copy/paste. It does not parse equations in Prism.

**Accept as the Stage-2 enforcement mechanism.**

Residual risk: the verifier is still an LLM and can false PASS/FAIL. That is a **reliability-class change**, not a proof. If a later fresh candidate fails **both** authoring and verification on the same contradiction class, reopen design — still without domain solvers as first resort.

### F. Hybrid

T-015 stays (authoring). E is the gate (enforcement). Conditional: run verification **only** when T-015 would collect load-bearing obligations (reuse `collectSuitabilityObligationsFromPage`).

**Accept as packaging of E.**

### G. Another evidenced architecture

Human QA after assembly is too late (invalid operand already packaged). Guided-review JSON is **learner-facing Check** (T-003), not GAM operand verification. DLA specification cannot see GAM numbers. No existing capture-stage semantic review pass for ordinary materials.

**No substitute subsystem found.**

---

## 6. Recommended Stage-2 architecture

**Name:** S78-OPS-2 — GAM operational suitability review (Copy/paste)

```text
GAM generation (T-015 salience retained)
  → structural GAM capture (existing validators UNCHANGED)
  → IF load-bearing obligations exist:
        Prism emits verification Copy prompt
        Operator runs Copilot
        Operator pastes review artefact
        Prism validates shape + all load-bearing rows suitable
  → GAM step complete
  → assembly
```

If no load-bearing obligations: skip review (study-only pages).

**Canonical owner:** **GAM acceptance / capture-gate**, not DLA, not renderer, not QA.

DLA still owns commission (task, expected output, purpose, specification). GAM still owns particulars. **Review owns the fail-closed judgement** that particulars fulfil that commission.

No new DLA fields. No new body schema on materials. No Lagrangian rules.

---

## 7. Fail-closed boundary

**Invalid load-bearing operand must not reach assembly.**

Canonical boundary:

```text
structural GAM parse PASS
  ↛ assembly
semantic review PASS (or skipped: no obligations)
  → GAM accepted
  → assembly
```

Do not merge review into `validateGamPartialPageCapture` as a silent body parser. Keep structural capture and semantic review as **two artefacts, two contracts**.

On FAIL: GAM step **not complete**; show failing `material_id` + reason; operator **regenerates GAM** (not EP/DLA unless commission itself is wrong). No autonomous retry.

---

## 8. Proposed representation (smallest)

New capture artefact only (not a DLA/GAM material field):

```json
{
  "artifact_type": "gam_operational_suitability_review",
  "schema_version": "1.0.0",
  "verdicts": [
    {
      "activity_id": "A4",
      "material_id": "A4-M2",
      "suitable": false,
      "failure_class": "contradiction",
      "reason": "Commission requires determining x, y and λ; generated first-order conditions imply two incompatible values for λ."
    }
  ]
}
```

| Field | Necessary? |
| ----- | ---------- |
| `artifact_type` / `schema_version` | Yes — capture identity |
| `activity_id` + `material_id` | Yes — bind to commission row |
| `suitable` | Yes — acceptance bit |
| `failure_class` | Yes, small enum: `contradiction` \| `insufficiency` \| `incomplete_model` \| `none` — distinguishes Candidate 1 classes without domain logic |
| `reason` | Yes — operator-facing; not parsed as math |
| `commissioned_action` copy | **No** — already on DLA |
| embeddings / scores | **No** |

Prism checks: artefact shape; every T-015 obligation `material_id` has a verdict; no extra unknown required ids; if `suitable === false` → fail-closed.

Prism does **not** re-evaluate the reason text.

---

## 9. Operator workflow (Copy/paste; no hidden retry)

1. Operator pastes GAM JSON as today. Structural validation runs unchanged.  
2. If obligations exist, Prism **does not complete** the GAM step. It shows a verification prompt containing:
   - T-014 invariant (compact);
   - T-023 commission JSON (or the same authoritative projection);
   - generated bodies **only** for obligated `material_id`s;
   - instruction to judge commission-relative suitability (not uniqueness-in-the-abstract);
   - required output: the review artefact above.  
3. Operator copies prompt → Copilot → pastes review JSON.  
4. Prism shape-validates and applies fail-closed.  
5. **PASS:** GAM step completes; assembly allowed.  
6. **FAIL:** step blocked; display failing rows; regenerate **GAM only**.  
7. **Invalid review JSON:** fail-closed like any v2 capture; do not sanitise.

Do not add an autonomous model HTTP loop.

**Workflow-pack step:** prefer **same GAM step, second capture** (smallest). A new factory step is optional later if dual-capture UX is inadequate — not required to justify the architecture.

---

## 10. Open-ended / deliberate insufficiency

Reuse T-014 / T-015 `commission_mode`:

| Mode | Verifier must |
| ---- | ------------- |
| Determinate | FAIL contradiction / insufficiency that prevent the commissioned result |
| Open-ended / interpretive | **PASS** multiple defensible outcomes; must **not** FAIL for non-uniqueness |
| Deliberate insufficiency | **PASS** intentional gaps when identifying missing information is the task |

Verification prompt must state this explicitly. Prism does not infer mode by verbs; pass the same commission fields T-015 already uses.

---

## 11. Model completeness

Same verification mechanism. For rows whose purpose/specification promises a complete worked result, the verifier asks: **does the body reach that promised result, or stop at a partial precursor?**

`failure_class: incomplete_model` covers Candidate 1 A4-M1. Learner-operand suitability and model completeness share **one pass, one artefact**, different obligation roles already computed by T-015.

---

## 12. WS1 relationship

WS1: learner has an **operational response surface** (blank workspace / text production binding).

Stage 2: the **operand/task particulars** supplied for that action are usable.

Candidate 4 can have a perfect blank table asking for x, y, λ (WS1 PASS) and an impossible system (suitability FAIL). Do not merge.

---

## 13. WS2 relationship

WS2: model operand **≠** attempt operand.

Candidate 4 is the canonical **WS2 PASS + suitability FAIL**: distinct instances, both internally unusable/inconsistent. Independence does not imply validity. Do not duplicate `practice_independence` in the review artefact.

---

## 14. T-003 relationship

Suitability: can the task be **completed** as commissioned?

Check/revision: after a completion attempt, can the learner **evaluate and improve** it?

Guided-review checklists remain T-003. Do not use SP-05 / `review_mode` as the Stage-2 GAM gate. Do not start T-003 from this design.

---

## 15. Cross-disciplinary generality

Same architecture, no discipline validators:

| Domain | PASS example | FAIL example |
| ------ | ------------ | ------------ |
| Mathematics | Particulars permit the requested calculation | Contradictory conditions; missing independent relation when a result is required |
| Programming | Spec/tests allow the commissioned debug/implement | Spec contradicts tests so no program can satisfy both, unless that contradiction **is** the task |
| Data/statistics | Table contains coherent variables for the named analysis | Required column absent; internally inconsistent totals where analysis assumes consistency |
| Humanities | Extract supports interpretation; multiple readings allowed | Extract empty/off-topic so the commissioned interpretation cannot begin |
| Deliberate insufficiency | Gaps are the object of learning | Accidental gaps on a determinate calculate-the-total commission |

---

## 16. Cost / complexity

| Item | Estimate |
| ---- | -------- |
| Extra Copilot pass | **One**, only when load-bearing obligations exist |
| Operator burden | One additional copy/paste per such GAM |
| New failure modes | Verifier false FAIL (open-ended misread); false PASS (missed contradiction); E2-like malformed review JSON |
| Contract complexity | One small artefact + shape gate; T-015 trigger reused |
| Prompt size | Verification prompt is **local** (commission + obligated bodies only), not another global GAM brief |

Smallest architecture that **changes reliability class**. More prompt does not.

---

## 17. Existing architecture reused

| Existing | Reuse |
| -------- | ----- |
| T-014 invariant + commission-relative modes | Verification rubric (not new theory) |
| T-015 `collectSuitabilityObligationsFromPage` | Which rows to verify; skip otherwise |
| T-023 commission projection | Authoritative context in verification prompt |
| GAM v2 Copy/paste + fail-closed JSON capture | Review artefact capture |
| WS1/WS2/P02 gates | Unchanged, composed not merged |
| S76-T-031 / S77-T-020 Case 1 | Ownership: GAM fulfilment residual; no DLA “must be solvable”; no solvers |
| Human QA (post-assembly) | **Not** reused as the gate — too late |

Not reused: guided-review learner checklists; math-integrity TeX checker as a solver; educational-quality-framework as a second GAM authoring stack.

Sprint 77 **not reopened**. E2 protocol unchanged.

---

## 18. Classification

| | |
| - | - |
| **Primary** | **E** — separate general semantic verification pass |
| **Secondary** | **F** — hybrid (retain T-015; do not expand it) |

A, B, C, D, G: **rejected** as the Stage-2 repair.

---

## 19. Implementation boundary (do not implement here)

**Proposed next implementation task:**

> **S78-T-017 — GAM operational suitability review pass (prompt + review artefact + fail-closed GAM acceptance)**

Anticipated scope:

- verification prompt builder (commission + obligated bodies + T-014 modes);
- review artefact capture + shape validation;
- GAM step completion gate;
- prompt-contract tests (review required / skipped / FAIL blocks assembly path in test API);
- reuse T-015 obligation collector.

**Must remain unchanged:**

- renderer;
- assembly merge/render unless a completion gate already used by GAM step is sufficient (prefer no new assembly stage);
- Lagrangian / FOC / λ / optimisation logic;
- WS1 `response_fulfilment` and blank-cell guard;
- WS2 `practice_independence`;
- P02 evidence_decision / provider closure;
- QA rubric;
- DLA schema;
- T-015 authoring block (no additional generic prose);
- E2 sanitiser (still forbidden).

Then **resume S78-T-013** on a new structurally valid GAM **with** the review pass.

---

## 20. T-013 state (this task)

See [Candidate 4 record](S78-T-013-candidate-4-post-t015-operational-suitability-fail.md). T-013 remains **OPEN** pending T-017 + fresh verification. QA not run on Candidate 4.

---

## 21. Files changed (this task)

- `S78-T-016-operational-suitability-stage-2-enforcement-design.md` (this file)
- `S78-T-013-candidate-4-post-t015-operational-suitability-fail.md`
- T-013 verification record, STATUS, PLAN, START-HERE

**Production / test / prompt / schema / validator / assembly / renderer:** **NO**

---

## 22. Exact recommended next task

**Authorise S78-T-017** — implement the bounded GAM operational-suitability **review pass** (not more authoring prose). Then resume T-013. Do not start T-003. Do not regenerate in T-016.

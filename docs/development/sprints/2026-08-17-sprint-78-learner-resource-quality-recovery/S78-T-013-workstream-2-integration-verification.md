# S78-T-013 — Workstream 2 integration verification

**Task:** S78-T-013  
**Status:** **OPEN** (2026-08-17) — WS2 independence has **positive evidence**; Candidate 4 post-T-015 **operational suitability FAIL**; T-017–T-018 verifier implemented as **temporary instrumentation** ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)); blocked on fresh operator verification  
**Mode:** Verification only — no production changes  
**Depends on:** S78-T-011 · S78-T-012 · S78-T-015 · S78-T-016 · S78-T-017 · T-017A · **S78-T-018** (GAM verification UX)  
**Does not include:** T-003 diagnostic · T-019 execution · Lagrangian hand-edits · E2 sanitiser · “regenerate until pass” as closure

**Latest:** [Candidate 6 disciplinary-precision diagnostic](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md) (2026-08-17): GAM **attempt 2** + QA **88/100**, 0 C/M, F&S **92**, all four activities Check Strong; Subject **84**. Verifier PASS ≠ disciplinary warrant. Next quality task: **S78-T-025** (not started). [C6 E2](S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md) remains a **separate** reliability track (attempt 1). T-013 stays **OPEN** (first-pass reliability; regen-until-pass is not closure). [Candidate 5 collector repair](S78-T-013-candidate-5-t015-collector-binding-repair.md) remains in force. [Candidate 4](S78-T-013-candidate-4-post-t015-operational-suitability-fail.md) remains historical **WS2 PASS + suitability FAIL**. Unit tests do **not** close T-013.

**Do not conflate** Workstream 2 (model/practice independence) with operational suitability.

---

## 1. Objective

Determine whether the implemented **S78-WS-2** architecture produces the intended learner-facing relationship in a **fresh Lagrangian generation** (post T-011/T-012):

```text
MODEL → INDEPENDENT ATTEMPT
same method/capability + distinct operand + learner performs load-bearing reasoning
```

**Historical defect to prevent (POST-S77 Major 2):**

> A worked model completely solves the **same** constrained-optimisation problem that the learner is subsequently asked to solve independently.

---

## 2. Fresh generation path (required)

Operator workflow — **EP → fresh DLA → fresh GAM → Verify generated materials → assembly/render → QA**:

| Step | Requirement | Artefact to preserve |
| ---- | ----------- | -------------------- |
| EP | Reuse existing canonical EP if unchanged | EP reference / hash |
| DLA | **New** generation through `78-DLA-WS-2` contract | Full DLA page JSON (each candidate) |
| GAM | **New** generation through T-012 WS2 salience + T-015 + **T-017/T-018 verification (temporary instrumentation)** | Full GAM-enriched page JSON + review artefact |
| Assembly | Standard path | Package / preview URL |
| QA | PRISM Resource Quality Benchmark v2.2 unchanged | Score sheet |

**Invalid for T-013 closure:**

- [S78-T-008-candidate-1-fresh-dla-exhibit.json](S78-T-008-candidate-1-fresh-dla-exhibit.json) — pre-T-011; **no `practice_independence`**; would **fail** current DLA gate (see §3 pre-flight).
- T-008 **87/100** run — **exists**; WS1 closed; WS2 **capability** evidence and Check/revision observations for T-003. It is **not** architectural WS2 closure and **not** T-013 closure QA.

---

## 3. Pre-flight evidence (repository, 2026-08-17)

### 3.1 T-011 gate on pre-WS2 exhibit

Running current `appendPracticeIndependenceValidationErrors` against the preserved T-008 DLA exhibit:

| Activity | Binding required? | Current gate result |
| -------- | ----------------- | ------------------- |
| **A2** | **Yes** | `S78_WS2_MISSING_BINDING` on `A2-M2` → operand `A2-M1` |
| **A3** | **Yes** | `S78_WS2_MISSING_BINDING` on `A3-M2` → operand `A3-M1` |

**Interpretation:** Fresh DLA **must** emit `practice_independence` on model rows for A2/A3-equivalent activities or fail closed. Pre-WS2 commissions cannot pass silently.

### 3.2 Expected fresh DLA bindings (checklist)

For each model→independent-attempt activity, verify:

| Check | A2 (expected) | A3 (expected) |
| ----- | ------------- | ------------- |
| Model `material_id` | `A2-M2` | `A3-M2` |
| Model `material_type` | `worked_example` | `modelling_note` or `worked_example` |
| `practice_independence.attempt_operand_material_ids` | `["A2-M1"]` | `["A3-M1"]` |
| Operand row type | `task_card` | `scenario` |
| Independent production | `A2-M3` workspace / table | `A3-M3` workspace / table |
| Model spec: distinct operand | MUST NOT solve bound operand | MUST NOT solve bound operand |

---

## 4. GAM verification template (per binding)

For each WS2 binding, record:

### Model operand

- Concrete problem/case GAM uses to demonstrate the method
- Functions, constraints, numeric values (if any)

### Attempt operand

- Concrete problem/case learner must solve
- Functions, constraints, numeric values (if any)

### Model disclosure

- Reasoning, calculations, FOCs, final answer revealed in model body

### Learner load-bearing reasoning

- What remains for independent performance

### WS2 PASS criterion (all must hold)

1. Same intended method/capability exercised  
2. Genuinely distinct operands/problem instances  
3. Model does not reveal attempt target answer  
4. Model does not substantially complete attempt load-bearing reasoning  
5. Learner must select/apply method independently  
6. Near transfer pedagogically coherent  

---

## 5. Activities in scope

Inspect **every** activity with worked/model material followed by **independent** performance.

| Activity | Historical role | T-013 status |
| -------- | --------------- | ------------ |
| **A2** | Model Lagrangian construction; learner constructs on task_card problems | **Pending fresh artefacts** |
| **A3** | Model solve process; learner solves utility problem | **Pending fresh artefacts** |
| A1 | Conceptual text production — no model→independent pair | Out of WS2 scope |
| A4 | Evidence interpretation — no model→independent pair | Out of WS2 scope |

One successful pair does **not** close WS2 if another fails.

---

## 6. Historical regression comparator

| | POST-S77 (70/100) | T-008 fresh (87/100) | T-013 target |
| - | ----------------- | -------------------- | ------------ |
| A3 failure mode | **Operand B fully solved in model → learner asked to solve B** | Process model vs scenario operand (capability success) | **Operand A modelled → learner solves B** under explicit contract |
| Architectural guarantee | None | None | T-011/T-012 contract + fresh evidence |
| Recurrence | — | **Not yet tested post-T-011/T-012** | Report YES/NO |

---

## 7. Regression checks (during fresh run)

### WS1 (do not reopen)

- [ ] Learner production bound to operational response surfaces  
- [ ] GAM does not complete learner-owned workspace cells  
- [ ] Blank table/workspace cells survive  
- [ ] Rendered response affordances usable  

### P02 (T-009)

- [ ] Provider rows in `evidence_decision.provider_material_ids` carry `evidence_requirement`  
- [ ] No A4-style provider omission (cf. T-008 candidate 1)  

### Assembly / renderer

- [ ] Model content on correct model material  
- [ ] Attempt operand separate  
- [ ] No answer exposed before attempt  
- [ ] No merge/duplicate of model and practice operand  

---

## 8. QA record

**Already run this sprint (not T-013 closure):** T-008 independent QA **87/100**, 0 Critical, 0 Major — [T-008 record](S78-T-008-workstream-1-integration-verification.md). That run closed **WS1** and supplied WS2 capability / T-003 observations. Do **not** claim that Sprint 78 has had no QA.

**T-013 closure QA:** still pending for **WS2 / operational suitability**. A later T-013-path package reached independent QA **88/100** (0 Critical, 0 Major; F&S **78**; A5 Check Strong). That score is the **T-003 exhibit**. It does **not** close T-013 (independence + suitability still open; candidates 1–4 did not produce a T-013 closure package).

| Measure | T-008 comparator | T-013 fresh run |
| ------- | ---------------- | --------------- |
| Uncapped score | **87/100** | _pending T-013 closure package_ |
| Release score | _(if reported)_ | _pending_ |
| Critical | **0** | _pending_ |
| Major | **0** | _pending_ |
| Scaffolding & Independence | **88** | _pending_ |
| Independent Study Effectiveness | **91** | _pending_ |
| Feedback & Self-Regulation | _(historical 30; T-008 A2 Check still weak)_ | **78** on 88/100 T-003 exhibit (A1–A4 Weak; A5 Strong) — **not** T-013 closure |

**T-013 WS2 closure does not require ≥90.** WS2 closes on reliable model/practice independence + no relevant Major. Score below 90 from Check/revision → evidence for **T-003**, not WS2 failure.

---

## 9. Candidates log

| # | Stage | Result | Artefact | Notes |
| - | ----- | ------ | -------- | ----- |
| 1 | DLA pass → GAM captured | **PAUSED** | Operator-held JSON | WS2 independence **PASS** (A2/A3/A4); A4-M2 **INVALID** (contradictory λ); A4-M1 **PARTIAL** — [diagnostic](S78-T-013-candidate-1-gam-mathematical-operand-validity-diagnostic.md); benchmark **BLOCKED** |
| 2 | DLA (not attached in paste) → GAM paste rejected | **STRUCTURAL FAIL** | [malformed GAM](S78-T-013-candidate-2-malformed-gam.txt) | E2-family — [diagnostic](S78-T-013-candidate-2-gam-malformed-json-diagnostic.md); **discard; do not score WS2** |
| 3 | GAM truncated | **INCOMPLETE** | Operator-held | Pre-truncation WS2 + usable A4 operand — capability only; cannot close |
| 4 | DLA → structurally valid GAM (post-T-015) | **SUITABILITY FAIL** | Operator-held JSON | WS1/WS2 observable PASS; contradictory A4/A3 systems — [record](S78-T-013-candidate-4-post-t015-operational-suitability-fail.md); **QA not run** |
| 5 | Full pipeline + independent QA | **QA 88/100** | Operator-held (JSON not yet in pack) | T-003 exhibit (F&S 78; A5 Check Strong). **Does not close T-013** (WS2/suitability still open) |
| 6a | DLA → GAM attempt 1 | **E2 STRUCTURAL FAIL** | [malformed GAM](S78-T-013-candidate-6-malformed-gam.txt) | [E2 diagnostic](S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md); discard for content scoring |
| 6b | Same DLA → GAM attempt 2 → assembly → QA | **QA 88/100** | [GAM](S78-T-013-candidate-6-gam-attempt-2.json) · [QA](S78-T-013-candidate-6-qa-report.md) | WS2 positive; suitability PASS; Check Strong; Subject 84 — [disciplinary diagnostic](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md). **Does not close T-013** |

**On rejection:** preserve exact JSON + validation error + classify as correct fail-closed vs new defect.

---

## 10. Per-activity WS2 verdict

| Activity | DLA binding | GAM semantic (WS2) | WS2 PASS/FAIL | Validity |
| -------- | ----------- | ------------------ | ------------- | -------- |
| A2 | Operator: present | Distinct operands (operator) | **PASS** (pending full body record) | _pending_ |
| A3 | Operator: present | Distinct operands (operator) | **PASS** (pending full body record) | _pending_ |
| A4 | Operator: present | Distinct operands (operator) | **PASS** | **FAIL** (A4-M2 invalid) |

---

## 11. T-003 (complete)

Diagnosed in [S78-T-003](S78-T-003-check-revision-architecture-diagnostic.md) using the earlier 88/100 QA exhibit (F&S 78; A5 Strong). Design: [S78-T-021](S78-T-021-check-revision-architecture-solution-design.md) (**complete**). Implementation **T-022** is **complete**. Candidate 6 QA is a **different** 88/100 package (F&S 92; four activities Check Strong) — do not conflate. T-013 must not absorb Check/revision or disciplinary-precision repair.

---

## 12. Minor issues — log only (do not investigate in T-013)

- Activity time not displayed — **in sprint as queued [S78-T-019](S78-T-019-activity-timing-duration-diagnostic.md)**; do not assume renderer ownership  
- Stray blank lines above response fields — lower priority  
- Missing horizontal rule between activities — lower priority  
- Activity 3 mathematical-workspace presentation (Markdown scaffolding in free-text fields) — lower priority  
- Image mismatch / persistence / operator-path — lower priority where recorded  

---

## 13. Failure handling protocol

If fresh generation violates S78-WS-2:

1. **STOP** benchmark path  
2. Record: DLA binding · assembled GAM WS2 instructions · model operand · attempt operand · leakage/reuse · earliest failure point  
3. Do **not** patch generated Lagrangian  
4. Do **not** implement prompt change in T-013  
5. Failure becomes diagnostic evidence; do **not** close by regenerating until pass  

---

## 14. Success handling protocol

If all relevant activities PASS WS2 semantic gate + WS1/P02 regressions clear + no Major model/practice QA finding:

→ Mark **Workstream 2 — CLOSED**  
→ Recommend **S78-T-003** Check/revision diagnostic  
→ Do **not** close Sprint 78  
→ Do **not** auto-propose Stage-2 semantic fingerprinting on success  

---

## 15. Stage-2 / verifier status ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification))

T-017–T-018 are **retained as temporary instrumentation**, not rejected and not accepted as the desired permanent GAM product contract.

A verifier FAIL is a **GAM generation failure**. Preserve the candidate. Classify the failure. Do **not** treat a later regenerated PASS as proof that the original generation path was reliable. **“Regenerate until it passes” is not T-013 closure.**

| Outcome | Meaning |
| ------- | ------- |
| Fresh first-pass GAM + verification PASS + WS2 semantic gate | Strong evidence toward WS2 closure; still inspect for other defects |
| Verifier FAIL | Generation failure — diagnose; do not loop regeneration as the reliability strategy |
| WS2 PASS + suitability FAIL | Possible simultaneously (Candidate 4) — do not conflate |

---

## 16. WS2 closure decision

**Workstream 2:** **NOT CLOSED.** Independence architecture has **strong positive evidence** (T-011/T-012; C1/C4 distinct operands; T-008 QA praised worked-example → independent-practice separation). T-013 remains open because the integration path also exposed **separate** operational-suitability failures and malformed-output recurrences (E2 Candidate 2; truncation Candidate 3; C4 suitability FAIL).

---

## 17. Operator next actions

1. Preserve Candidate 4 full DLA/GAM JSON in the sprint pack if still held.  
2. **Do not run QA** on Candidate 4.  
3. **Resume fresh generation:** EP → DLA → GAM → **Verify generated materials** (Check verification) → assembly → QA.  
4. On verification FAIL: **preserve the candidate**; classify the failure class; trace to the earliest DLA→GAM owner where justified. Do **not** hand-edit Lagrangian. Do **not** close reliability by regenerating until PASS. Live T-018 copy may still tell the operator to regenerate GAM from the same DLA for that run — that recovery is **not** Sprint 78 reliability success.  
5. T-021 / T-022 **complete**. T-019 remains queued. T-013 remains OPEN (first-pass reliability / E2). Candidate 6 attempt 2 is positive WS2/suitability/QA evidence, not closure. Next quality task when authorised: **S78-T-025**. Do not expand the verifier.

---

## 18. Production / test changes

**None** — verification-only task.

---

## 19. Candidate 5 instrumentation coverage (2026-08-17)

[S78-T-013-candidate-5-operational-suitability-review-coverage-diagnostic.md](S78-T-013-candidate-5-operational-suitability-review-coverage-diagnostic.md): post-T-022 review PASS with only A4-M1 and A4-M2 traced to T-015 collector under/over-coverage. [S78-T-013-candidate-5-t015-collector-binding-repair.md](S78-T-013-candidate-5-t015-collector-binding-repair.md): **binding repair complete** — re-run verification on next GAM; prior two-row PASS is stale. Do not interpret the operator’s in-flight QA here.

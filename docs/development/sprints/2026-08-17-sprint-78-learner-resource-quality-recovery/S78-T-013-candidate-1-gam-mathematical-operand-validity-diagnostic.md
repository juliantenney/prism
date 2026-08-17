# S78-T-013 Candidate 1 — GAM mathematical operand validity diagnostic

**Task:** Bounded diagnostic within S78-T-013  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** DIAGNOSIS ONLY — no implementation  
**Candidate:** Fresh post-T-011/T-012 Lagrangian — GAM captured; DLA passed  
**Trigger:** Operator finding — A4-M2 internally inconsistent FOC system; A4-M1 underdetermined for stated “complete worked solution”

**Production / prompt / validator / test changes:** **NO**

---

## 0. Scope separation

| Invariant | Candidate 1 evidence |
| --------- | -------------------- |
| **S78-WS-2** (model ≠ attempt operand) | **PASS** (operator) — A2/A3/A4 use distinct model vs practice operands with authoritative `practice_independence` |
| **Operand validity** (each operand fit for commissioned purpose) | **FAIL** — A4-M2 invalid; A4-M1 at best partial |

These are **separate** findings. WS2 closure and benchmark continuation are **blocked** by operand validity, not by WS2 independence.

---

## 1. Exact fresh A4-M2 mathematical failure

**Supplied independent-practice equations (operator-established GAM body):**

```text
6 - 2λ = 0
4 - λ = 0
18 - x - y = 0
```

**Independent verification:**

| Equation | Implication |
| -------- | ----------- |
| `6 - 2λ = 0` | λ = **3** |
| `4 - λ = 0` | λ = **4** |
| `18 - x - y = 0` | x + y = **18** (one linear relation in two unknowns) |

**Mutual consistency:** **NO** — λ cannot simultaneously equal 3 and 4.

**Unique (x, y, λ):** **NO** — even ignoring the λ contradiction, one constraint in two unknowns does not determine a unique interior candidate optimum without additional independent FOC relations.

**Learner actions requested (task card):**

1. Find the multiplier value — **impossible** (no consistent λ).  
2. Determine candidate optimal values — **impossible** (insufficient / inconsistent system).  
3. Verify constraint satisfaction — **not meaningfully performable** on a non-solution.

**Verdict:** **INVALID** operand for commissioned independent practice.

**Defect locus:** Present in **GAM JSON** (`activities[].materials[]` body for A4-M2). Assembly/renderer not required to explain the failure.

---

## 2. A4-M1 mathematical / commission fulfilment assessment

**Supplied worked-example equations (operator-established GAM body):**

```text
2 - λ = 0
4 - 2λ = 0
12 - x - 2y = 0
```

**Independent verification:**

| Equation | Implication |
| -------- | ----------- |
| `2 - λ = 0` | λ = **2** |
| `4 - 2λ = 0` | 4 − 4 = 0 ✓ — **consistent** with λ = 2 |
| `12 - x - 2y = 0` | x + 2y = **12** — **one** equation in (x, y) |

**λ determination:** **VALID** — unique consistent λ = 2.

**Unique optimum (x, y):** **NO** — infinite solutions on the line x + 2y = 12; no second independent FOC or objective relation supplied in the excerpt.

**Commission (operator-established DLA intent):**

- Purpose: model **solving** a constrained optimisation problem from first-order conditions.  
- Specification: **Complete worked solution** including identification of optimal values and verification stage (near-transfer instance distinct from A4-M2).

**Comparison to commission:**

| Commission element | Body support |
| -------------------- | ------------ |
| Demonstrate FOC / λ extraction | **Partial** — λ found consistently |
| Complete worked solution with optimal values | **Not fulfilled** — x,y not uniquely determined or completed |
| Verification stage | **Not demonstrable** as a unique optimum verification |

**Verdict:** **PARTIALLY FULFILLED** — not the same failure class as A4-M2 (no λ contradiction), but **does not fulfil** a “complete worked solution / identify optimum” commission if that is what DLA specified.

**Note:** If commission were only “illustrate λ from FOCs”, partial determination could be legitimate. Evidence favours the **stronger** commission wording operator reported.

---

## 3. DLA learner requirement (A4)

From operator-established fresh DLA structure (material ordering: model A4-M1 → operand A4-M2 → workspace A4-M3):

- Learner applies the Lagrangian solution method to an **independent** near-transfer problem.  
- Expected output requires: multiplier identification, optimal values, constraint verification (compound production).  
- Reasoning orientation: track how FOCs constrain the solution before solving.

DLA **does** commission enough **semantic intent** that A4-M2 must be an **unsolved but solvable** near-transfer instance and A4-M1 must **model** a complete solve on a **distinct** instance — via `purpose`, `specification`, `expected_output`, and `practice_independence`.

---

## 4. DLA A4-M1 commission

| Field | Operator-established |
| ----- | -------------------- |
| `material_id` | A4-M1 |
| `material_type` | `worked_example` (or equivalent model type) |
| `practice_independence` | `attempt_operand_material_ids: ["A4-M2"]` |
| Purpose | Model solving a constrained optimisation problem from first-order conditions |
| Specification | Complete worked solution; distinct from bound attempt operand; verification stage |

**DLA solvability wording:** Per Sprint 76 settlement ([S76-T-048](S76-T-048-sprint-76-closeout-and-prompt-architecture-handover.md)), DLA **need not** repeat generic “must be solvable” on every spec when structural commissioning + GAM executability owns inherent suitability. DLA §370: **“GAM owns material bodies and executability.”**

---

## 5. DLA A4-M2 commission

| Field | Operator-established |
| ----- | -------------------- |
| `material_id` | A4-M2 |
| `material_type` | `task_card` (independent operand) |
| Purpose | Independent practice / near-transfer problem |
| Specification | Unsolved problem; learner derives/solves/verifies (not pre-answered) |

DLA commissions **solvability by implication** through `expected_output` and learner_task, but **does not** carry an explicit “internally consistent FOC system” invariant at capture.

---

## 6. GAM A4-M1 realisation

- Uses a **distinct** equation set from A4-M2 (WS2 satisfied).  
- Achieves consistent λ = 2.  
- **Does not** complete a unique (x, y) optimum or full verification narrative implied by “complete worked solution”.  
- **PARTIALLY FULFILLED** relative to commission; not mathematically contradictory.

---

## 7. GAM A4-M2 realisation

- Distinct operand from A4-M1 (WS2 satisfied).  
- Emits **contradictory** λ constraints and **insufficient** relations for unique optimum.  
- **INVALID** — learner cannot perform commissioned actions.

---

## 8. Existing problem-validity / correctness guarantees

| Surface | Guarantee | Enforced? |
| ------- | --------- | --------- |
| **GAM Copy brief** (`buildGamV2CopyMaterialAuthoringBrief`, S77-T-021) | “…enough coherent information… when… identifying or solving for a result, **do not emit contradictory or underdetermined particulars**…” | **Prompt only** |
| **DLA §370 / T-031 split** | GAM owns executability; DLA owns method/pedagogical bounds in specification | **Commission intent**; no solvability capture gate |
| **S78-WS-2** (`practice_independence`) | Model operand ≠ attempt operand | **DLA capture + GAM salience** — different invariant |
| **`ld-gam-page-enrich-contract.js`** | Evidence fulfilment, WS2 pointer, shape rules | **No** mathematical operand validity |
| **`validateGamPartialPageCapture` / `validateGamEnrichedPage`** | Body presence, format, TeX delimiter integrity (`validateLearnerFacingMathIntegrity`), blank-cell WS1 gate, evidence shape | **No** semantic solvability |
| **SP-06 / SP-07** | Bridge / method transfer; not answer transfer | **No** equation consistency |
| **Educational quality framework** | Reasoning quality guidance | **No** operand validity |
| **S76-T-031 design** | Operational suitability definition | **Design complete**; GAM sentence implemented as Case 1; **no capture validator** |

**Nothing in capture makes the fresh A4-M2 body illegal today.**

---

## 9. Actual assembled GAM prompt treatment

Reconstructed from live `app.js` + T-012 commission injection (representative A4-shaped commission):

**Copilot sees:**

1. **Case 1 sentence** in GAM v2 Copy brief — contradictory/underdetermined prohibition when identifying/solving a result (**global**, early in brief).  
2. **Authoritative commission JSON** — A4-M1/M2 `purpose`, `specification`, `practice_independence`.  
3. **S78-WS-2 block** — distinct model operand; do not solve bound attempt — **does not** mention internal consistency or solvability.  
4. **SP-06** (if worked_example) — bridge/method transfer — **not** mathematical validity.

**Does the prompt explicitly require internally consistent, sufficient mathematical operands at the point A4-M2 is authored?**

- **Partially, globally** — Case 1 sentence covers it in principle.  
- **Not locally/saliently** for A4-M2 — no per-operand “must be solvable / mutually consistent FOC system” adjacent to the attempt material commission; WS2 block addresses **independence only**.

Same structural gap as T-009 (P02): rule exists **remotely** in a long prompt; not salient where the defective body is authored.

---

## 10. Existing capture validation

| Check | Applies to A4-M2? |
| ----- | ----------------- |
| Body present / markdown format | Yes — would pass |
| TeX delimiter integrity | Likely pass (plain equations) |
| Purpose/specification fulfilment | **No** |
| Mathematical consistency | **No** |
| Worked-example completeness | **No** |
| Expected_output answerability | **No** |
| Disciplinary correctness | **No** |

**Architectural boundary:** GAM capture validates **shape, preservation, WS1 blank cells, evidence shape, math markup** — not **operational suitability** of generated particulars.

---

## 11. Whether QA would catch it

**Likely yes**, at independent QA:

- **Subject & Disciplinary Quality** — inconsistent FOC system / unusable practice problem (S76 Gate C Lagrangian scored **68** on this dimension for A3/A4-class defects).  
- Possibly **Major** if framed as “learner cannot complete commissioned task as instructed.”

**But:** QA detection ≠ generation-time prevention. Sprint 78 goal includes **reliable** quality recovery, not only post-hoc QA rejection.

---

## 12. Earliest proven causal layer

**GAM material-body authoring (operational suitability realisation)** — DLA passed and commissioned the operation; GAM emitted particulars that violate the already-model-visible Case 1 rule and the commissioned solve/identify/verify operation.

DLA is **not** the earliest layer for A4-M2’s **contradiction** (commission did not require an inconsistent system). DLA may share **secondary** responsibility for A4-M1 if specification over-claims “complete worked solution” without bounding “partial illustration acceptable” — but the **invalid** practice operand is a **GAM authoring failure**.

---

## 13. Root-cause classification

| Code | Applicability |
| ---- | ------------- |
| **A** | Secondary — DLA could state solvability bounds more explicitly; not required by S76 settlement for every spec |
| **B** | Secondary — Case 1 rule not salient at per-material authoring surface for operands |
| **C** | **Yes** — explicit GAM guarantee exists; generation ignored it |
| **D** | **PRIMARY** — guarantee is **prompt-only**, **non-enforced** at capture |
| **E** | No deterministic check exists (by design post-T-021) |
| **F** | **No** — guarantee was **strengthened** in S77-T-021, not removed |
| **G** | **No** — A4-M2 failure is mathematically proven |

**PRIMARY: D** · **SECONDARY: B, C**

---

## 14. Regression / lost-guarantee status

**Not a regression.** Nearly **identical failure class** documented pre-Sprint 78:

- [S77-T-019](S77-T-019-gam-e-learner-facing-corruption-diagnostic.md) — A4 System 3 underdetermined FOCs  
- [S77-T-020](S77-T-020-gam-case-1-operational-suitability-solution-design.md) — Case 1 design  
- [S77-T-021](S77-T-021-gam-case-1-operational-suitability-implementation.md) — contradictory/underdetermined sentence added (+234 chars)

High-quality Lagrangian runs (~88–92) demonstrate **capability**, not **deterministic** operand validity. Fresh Candidate 1 shows Case 1 prompt repair **insufficient** for reliable prevention.

---

## 15. WS2 status in Candidate 1

**WS2: PASS** (operator-established) — for A2, A3, A4:

- Authoritative `practice_independence` on model rows  
- GAM uses **distinct** model vs attempt operands  
- No evidence of bound-operand solution disclosure in model bodies  

**WS2 semantic verification remains incomplete** for A2/A3 bodies until recorded — but the **blocking** finding is operand **validity**, not independence.

---

## 16. Canonical owner of any later repair

Per settled architecture ([S76-T-031](S76-T-031-generated-operand-operational-suitability-solution-design.md), [S77-T-020](S77-T-020-gam-case-1-operational-suitability-solution-design.md)):

| Layer | Owner |
| ----- | ----- |
| Method/pedagogical bounds in commission | **DLA** (`specification`) |
| Realised operand operational suitability | **GAM** (Copy brief + salience at authoring) |
| Deterministic semantic validation | **Out of scope** unless evidence requires — not justified yet |

---

## 17. Smallest repair direction (characterisation only)

**Do not implement.**

Likely **GAM Stage-1 prompt-contract salience** (parallel lesson to T-009 / T-012):

- When `purpose`/`specification`/`learner_task`/`expected_output` commission **identify/solve/verify** a result, inject a **local** authoring obligation adjacent to the authoritative commission (or per material row): generated equations/particulars must be **mutually consistent** and **sufficient** for the commissioned operation — not merely structurally plausible.

**Not** equation parsers, symbolic solvers, or Lagrangian-specific rules in first instance.

Optional **DLA** clarification only if evidence shows commissions routinely under-specify solvability bounds — secondary to GAM salience given §370 ownership.

---

## 18. T-013 benchmark continuation

**BLOCKED** on this candidate.

The benchmark must **not** proceed knowingly with an **invalid learner practice problem** (A4-M2). WS2 independence success does **not** override this.

Disposition: **(1) blocking sub-finding within T-013** — preserve Candidate 1; do not hand-edit; do not run QA gate on this package as a clean WS2 closure exhibit.

---

## 19. T-003 observation (preserve only)

A4 compound production (solve → identify optimum → verify) coexists with an **activity-level diagnostic checklist** decomposing those criteria. Relevant for later T-003 hypothesis on compound production → one activity-level diagnostic review. **No action in this diagnostic.**

---

## 20. Minor issues

Preserved per T-013 charter — not investigated here.

---

## 21. Artefact preservation

| Item | Status |
| ---- | ------ |
| Full DLA JSON | Operator-held — **commit to repo recommended** as `S78-T-013-candidate-1-dla.json` |
| Full GAM JSON | Operator-held — **commit recommended** as `S78-T-013-candidate-1-gam.json` |
| This diagnostic | **Recorded** |

---

## 22. Recommended next task

**Do not regenerate Lagrangian in this task.**

1. **Preserve** Candidate 1 DLA + GAM JSON in sprint pack (operator).  
2. **Authorise bounded repair design** — GAM operational-suitability salience at material authoring (Case 1 extension; distinct from WS2).  
3. **Resume T-013** only after fresh GAM (or full pipeline) regeneration produces **valid** A4-M2 (and fulfils A4-M1 commission if “complete worked solution” remains required).

Suggested task label: **S78-T-014 — GAM operand operational-suitability authoring salience (Case 1 extension)** — design/implementation **not authorised** by this diagnostic.

**Do not start T-003** until T-013 WS2 + validity path is resolved or explicitly split.

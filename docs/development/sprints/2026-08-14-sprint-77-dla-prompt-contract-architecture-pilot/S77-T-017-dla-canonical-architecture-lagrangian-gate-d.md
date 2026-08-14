# S77-T-017 — DLA canonical architecture Lagrangian Gate D

**Status:** **COMPLETE** (2026-08-14) — Gate D **PASS**  
**Mode:** Documentation only (operator assessment)  
**Live contract:** `77-DLA-CANONICAL-2`  
**Depends on:** [T-015](S77-T-015-dla-canonical-architecture-phase-c-atomic-switch.md) · [T-016](S77-T-016-gate-d-evidence-requirement-capture-regression.md)  
**Production change in this task:** **NONE**

---

## Verdict

**Gate D: PASS**

The T-015/T-016 canonical DLA architecture survived the fresh Lagrangian behavioural check (EP → corrected DLA → GAM). The only architecture migration omission encountered during Gate D was the `evidence_requirement` shape gap, repaired by T-016 and confirmed by successful corrected DLA capture.

GAM E learner-facing corruption was observed and is **not** a DLA architecture Gate D fail.

---

## Scope of this assessment

- Operator-inspected chain: **same** fresh Lagrangian run (EP, DLA, GAM).
- Do **not** compare this run with historical Lagrangian activity numbering or older EP artefacts.
- Corrected DLA is the post–T-016 capture, not the failed first DLA attempt.

### Correct fresh EP (authoritative)

Five one-to-one LO activities. Richer archetype/beat structure than earlier historical Lagrangian runs is **not** a regression.

| Activity | LO | Intent | Archetype |
| -------- | -- | ------ | --------- |
| A1 | LO1 | Describe constrained optimisation and the roles of objective function and constraint | understand |
| A2 | LO2 | Construct a Lagrangian from a constrained optimisation problem | apply |
| A3 | LO3 | Derive and solve first-order conditions to determine decision-variable and multiplier values | analyse |
| A4 | LO4 | Interpret the Lagrange multiplier as the shadow value of a constrained resource | evaluate |
| A5 | LO5 | Explain how first-order conditions represent the tangency condition between objective function and constraint | understand |

---

## WITHDRAWN — invalid wrong-EP diagnosis

An **interim** operator assessment compared the **new** DLA with an **OLD** EP.

That comparison produced an invalid A5 / T-033 / U-2 conclusion. **It is withdrawn.**

- It must **not** become project history as a behavioural finding.
- The correct fresh EP restores the one-to-one LO interpretation in the table above.
- **Do NOT** record a previously suggested A5/T-033 failure.
- **No production change** resulted from the invalid comparison.

---

## Findings (operator-authoritative)

### 1. DLA capture after T-016 — PASS

Corrected DLA captured successfully. T-015 `evidence_requirement.kind` / `purpose` omission is repaired. Do not reopen T-016 unless new evidence shows another shape omission.

### 2. EP → DLA alignment — PASS

Inspected DLA preserves fresh EP/LO intent across five activities.

- **A2 / LO2:** production is Lagrangian construction; supplied optimisation problems are operands; worked/supporting materials are not task operands.
- **A3 / LO3:** production requires deriving FOCs, solving, and verification; the practice optimisation problem is the operand; consistent with closed P01-R1 and T-033.
- **A4 / LO4:** production requires interpretation of multiplier/shadow-value evidence; supplied scenarios are particulars-as-grounds; response/analysis structure is scaffold, not evidence operand.
- **A5 / LO5:** production concerns algebraic FOCs vs geometric tangency; paired algebraic/graphical particulars are appropriate evidence.

### 3. P01-R1 — PASS / remains CLOSED

No regression of operand vs workspace. System-supplied things acted upon are commissioned as task inputs where appropriate. Workspaces/scaffolds are not promoted merely because learners record work in them.

### 4. T-033 — PASS / remains CLOSED

Against the **correct** fresh EP, DLA production obligations require the relevant mapped-LO operations. This run does not justify reopening T-033.

### 5. T-031 — PASS / remains CLOSED

DLA commissions the operation and pedagogical bounds without owning inherent executability of realised GAM particulars. Generated A3 practice problem is operationally usable under derive/solve/verify. **Do not** add a generic DLA “must be solvable” sentence.

### 6. P02 — PASS / not reopened

Procedural construction/solving activities do not become evidence-required merely because they use supplied task inputs. Interpretation/explanation activities use supplied particulars as grounds where appropriate. Provider/scaffold distinctions remain coherent.

### 7. DLA → GAM fulfilment — PASS for architecture Gate D

Inspected GAM broadly fulfils DLA commissions:

- **A1:** explanatory constrained-optimisation resource realised.
- **A2:** worked Lagrangian-construction example; independent construction problems.
- **A3:** complete FOC worked example; independent derive → solve → verify problem.
- **A4:** simulated shadow-value scenarios; interpretation structure.
- **A5:** paired graphical/algebraic evidence for FOC/tangency correspondence.

No evidence that the canonical DLA architecture prevented GAM from fulfilling intended commissions.

### 8. GAM E — OBSERVED, KEEP SEPARATE / remains OPEN

A5 GAM material contains visible learner-facing corruption, e.g.:

- `Simulated Evidence for Learning Pur[ poses`
- malformed TeX `\rtial` instead of `\partial`

Fresh evidence for the already-open **GAM E** learner-facing corruption issue. **Not** diagnosed here. **Not** attributed to DLA architecture. **Not** merged into T-031 or GAM D. **Not** repaired in this task.

### 9. GAM D — NOT ESTABLISHED BY THIS GATE / remains OPEN and SEPARATE

Do not infer a GAM-D pedagogical-function failure from this run unless independently evidenced elsewhere.

### 10. U-2 workbook tension — no behavioural failure from this run

The earlier proposed U-2/A5 diagnosis used the **wrong historical EP** (withdrawn). U-2 may remain an architectural residual already documented by T-011/T-012/T-015. This run does **not** establish it as a behavioural regression.

---

## Architecture checklist

| Item | Result |
| ---- | ------ |
| Canonical architecture live | YES (`77-DLA-CANONICAL-2`) |
| Corrected canonical capture | PASS |
| Copy multiplicity 1 | preserved (T-015/T-016) |
| Studio multiplicity 1 | preserved (T-015/T-016) |
| Copy/Studio canonical equality | preserved (T-015/T-016) |
| EP → DLA semantic preservation | PASS |
| P01-R1 | PASS / remains closed |
| T-033 | PASS / remains closed |
| T-031 | PASS / remains closed |
| P02 | PASS |
| DLA → GAM fulfilment (architecture Gate D) | PASS |
| GAM E | observed; separate; OPEN |
| GAM D | OPEN / SEPARATE; not established here |
| U-2 | residual only; no behavioural fail this run |
| Schema change required | NO |
| Validator change required | NO |
| DLA semantic repair required | NO |

---

## Phase D cleanup

T-012 sequences Phase D (stop calling legacy monolith; retain rollback functions until a cleanup commit) **after** Gate B and operator Gate D.

T-015 and live STATUS still mark Phase D **NOT AUTHORISED** until an explicit operator decision.

**This task does not authorise or start Phase D.** Next decision: whether to authorise deletion of live dependence on legacy builders / later deletion of rollback.

---

## Files

Documentation only. No production, prompt, validator, schema, test, pack, EP, DLA, or GAM edits in T-017.

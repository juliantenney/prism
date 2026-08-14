# S76-T-042 — DLA-P01-R1 intermediate-operand Gate C closure

**Task:** S76-T-042  
**Status:** **Gate C PASS** (2026-08-14) — P01-R1 intermediate-operand residual **CLOSED**  
**Mode:** DOCUMENTATION / CLOSURE ONLY — no production, prompt, schema, validator, test, fixture, GAM, EP, DLA-WB, or Settings changes  
**Depends on:** [T-038](S76-T-038-dla-p01-r1-a3-operand-workspace-diagnostic.md) · [T-039](S76-T-039-dla-p01-r1-intermediate-operand-solution-design.md) · [T-040](S76-T-040-dla-p01-r1-intermediate-operand-implementation-plan.md) · [T-041](S76-T-041-dla-p01-r1-intermediate-operand-implementation.md)  
**Contract under test:** `76-DLA-PARTIAL-7`  
**Exhibit:** operator-pasted post-T-041 DLA page (`artifact_type: page`, `schema_version: 2.0.0`, `assembly_state.current_stage: dla`) for Introduction to Lagrangian Multipliers. JSON **not committed** to git (same persistence pattern as T-037).

This artefact records DLA commissioning/selection behaviour. It does **not** require GAM generation. It does **not** implement T-031 or T-033. It does **not** claim RECOVER. It does **not** start P05.

---

## 0. Gate C question

Did the T-041 Step 2 refinement cause DLA to distinguish the particular **system-supplied object** the learner acts upon from the **workspace/model/scaffold** used while acting — without disturbing conventional problem operands, P01/P02 independence, or evidence-provider behaviour?

**Answer: yes.** Decision **A**.

---

## 1. Evidence boundary

| Item | State |
| ---- | ----- |
| Live JSON in git | **No** — operator paste into this session |
| Activities on page | **A1, A2, A3** (fewer than historical five-activity Lagrangian pages) |
| Identification rule | Mapped LO + title + learner operation + material purpose/specification — **not** historical A2/A3 labels |
| GAM | Not inspected; not required |
| T-031 / T-033 / P05 | Untouched |

Do **not** treat fresh `A2` as historical `A2`. Fresh **A1** is the conventional construction case. Fresh **A2** is the FOC/intermediate-object case. Fresh **A3** is the evidence/shadow-price contrast.

---

## 2. Fresh activity-id mapping

| Behavioural role | Fresh id | Title | Mapped LOs | Learner operation |
| ---------------- | -------- | ----- | ---------- | ----------------- |
| Conventional operand | **A1** | Why Constraints Matter | LO1, LO2 | Construct a Lagrangian from a supplied practice problem |
| Intermediate / current-operation operand | **A2** | Derive First-Order Conditions | LO3, LO4 | Differentiate/solve from supplied functions |
| Evidence-provider contrast | **A3** | Interpret the Shadow Price | LO1, LO4, LO5 | Inspect cases and justify economic interpretation |

Historical T-038 “A3 Deriving First-Order Conditions” maps to **fresh A2**, not fresh A3.

---

## 3. Conventional-operand check (fresh A1)

| Field | Value |
| ----- | ----- |
| `separate_inputs_required` | **true** |
| `task_input_material_ids` | **`["A1-M4"]`** |
| Selected operand | **A1-M4** `scenario` — “Provide a practice optimisation problem requiring construction of a Lagrangian.” Spec: one economics-focused case with objective + equality constraint; construction only |
| Not selected | **A1-M1** teaching text; **A1-M2** worked_example/model; **A1-M3** sample_output; **A1-M5** checklist |
| `evidence_decision.required` | **false** |

**Verdict: PASS.** Practice problem is the operand. Model/workspace-equivalent/sample/checklist are used during the activity and are not listed as task inputs. P02 remains false.

---

## 4. Intermediate-operand check (fresh A2)

| Field | Value |
| ----- | ----- |
| `learner_task` | Study modelling note → follow worked analytic pass → complete analysis table for a **new** optimisation problem → solve equations → checklist |
| `expected_output` | Complete FOCs and a feasible solution from differentiation/solution of the supplied problem |
| `separate_inputs_required` | **true** |
| `task_input_material_ids` | **`["A2-M3"]`** |
| Selected operand | **A2-M3** `scenario` — “Provide optimisation values and functions for independent derivation and solution.” Spec: one utility/cost case with **explicit functions** and equality constraint |
| Workspace | **A2-M4** `analysis_table` — “structured workspace for deriving first-order conditions”; **not** in `task_input_material_ids` |
| Also unlisted | **A2-M1** modelling_note; **A2-M2** worked_example; **A2-M5** checklist |
| `evidence_decision.required` | **false** |

T-038 residual was: `true` + list only the derivation table + never commission the functions. Fresh A2 **commissions and lists A2-M3** and keeps **A2-M4 as workspace only**.

**Verdict: PASS.**

---

## 5. Absence-test interpretation

Remove **A2-M3** (supplied functions/problem): the learner loses the particulars to differentiate and solve. That is a task input.

Remove **A2-M4** (derivation table): the learner loses the place/structure in which work is recorded; the functions remain. That is a workspace.

Fresh DLA behaviour **matches** the T-028/T-041 absence distinction.

**Verdict: PASS.**

---

## 6. P01 / P02 independence

| Activity | P01 (`separate_inputs_required`) | P02 (`evidence_decision.required`) | Notes |
| -------- | -------------------------------- | ---------------------------------- | ----- |
| A1 | true | **false** | Procedural construction operand |
| A2 | true | **false** | Procedural FOC operand |
| A3 | true | **true** | Particulars-as-grounds |

A3 contrast: operand/provider is **A3-M2** (`scenario` with `evidence_requirement`; listed in both `task_input_material_ids` and `provider_material_ids`). **A3-M3** worked example, **A3-M4** decision_table workspace, **A3-M5** template, **A3-M6** checklist are **not** the task input.

No evidence-role regression attributable to T-041: procedural operands stay P02 false; the inspection/judgement activity is P02 true with provider ⊆ task inputs.

**Independence verdict: PASS.**  
**Evidence-provider contrast verdict: PASS.**

---

## 7. Conventional non-regression

T-039 required the successful conventional-problem case to remain intact. Fresh A1 still selects a supplied practice optimisation **scenario** and excludes WE/sample/checklist.

**Verdict: PASS** (fresh A1; do not call this historical A2).

---

## 8. Prior-product boundary

Live Step 2: “The learner’s own prior-activity product is not a new GAM commission.”

Fresh A2 commissions a **new** system-supplied scenario (**A2-M3**), not A1’s constructed Lagrangian as a required_material row. That is consistent with the boundary but is **not** a dedicated prior-product negative case.

**Status: NOT EXERCISED IN GATE C** — not a Gate C failure.

---

## 9. GAM / T-031 boundary

- This Gate C tests **DLA commissioning and `task_input_material_ids` selection** only.  
- **GAM fulfilment is downstream** and was not run.  
- Operational suitability of realised operand bodies belongs to **T-031** (designed, not implemented).  
- GAM pedagogical-function fulfilment (historical A4 worked-example) remains a **separate open issue**.  
- Learner-facing corruption remains a **separate open issue**.  

Do **not** reopen P01 because those later stages were not tested here.

---

## 10. Gate C decision

**A. GATE C PASS — CLOSE P01-R1 INTERMEDIATE-OPERAND RESIDUAL**

Supported by: conventional operand correct; intermediate operand now selected correctly; workspace distinct; P01/P02 independence intact; no T-041-attributable regression.

Do **not** propose further P01 prompt work from this residual.

---

## 11. Closure history (P01 chain)

| Stage | What it did |
| ----- | ----------- |
| Original P01 | Explicit `task_material_decision` and ids |
| T-026 / T-028 | Operand vs model/workspace/scaffold + absence test |
| T-038 | Intermediate objects less salient than conventional “problems”; table listed as sole input |
| T-039 / T-041 | Operand = object/state this activity’s operation acts on when the system must supply it |
| **Fresh Gate C (T-042)** | Residual **behaviourally closed** on this Lagrangian DLA page |

---

## 12. Remaining separate Sprint 76 queue (do not start)

| ID | Item | Status |
| -- | ---- | ------ |
| **B** | T-031 generated-operand operational suitability | Designed; **not implemented** |
| **C** | T-033 LO-operation coverage | Designed; **not implemented** |
| **D** | GAM pedagogical-function fulfilment / A4 worked-example | Open; diagnostic **not** performed here |
| **E** | GAM learner-facing A3 corruption | Open; causality **not** assumed |
| **G** | Graphics/image lifecycle | Separate |
| **F** | P05 duplicate DLA Copy injection | **Untouched** |

Queue order among B–F is **not** decided by this closure.

---

**P01-R1 INTERMEDIATE-OPERAND GATE C PASS — RESIDUAL CLOSED**

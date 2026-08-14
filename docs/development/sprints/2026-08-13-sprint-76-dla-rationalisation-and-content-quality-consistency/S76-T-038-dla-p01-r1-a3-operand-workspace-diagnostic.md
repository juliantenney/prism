# S76-T-038 — DLA-P01-R1 A3 operand / workspace diagnostic

**Task:** S76-T-038  
**Status:** **Diagnostic complete** (2026-08-14) — not implementation  
**Mode:** DIAGNOSTIC ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, QA, or Settings changes  
**Depends on:** [T-021](S76-T-021-dla-p01-solution-design.md) · [T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md) · [T-026](S76-T-026-dla-p01-residual-operand-closure-diagnostic.md) · [T-027](S76-T-027-dla-p01-residual-operand-closure-solution-design.md) · [T-028](S76-T-028-dla-p01-residual-operand-closure-implementation.md) · [T-037](S76-T-037-dla-p04-gate-c-rebenchmark.md)  
**Exhibit:** post-P04 Lagrangian A3 (operator-reported in T-037)  
**Contract inspected:** `76-DLA-PARTIAL-6` live surfaces (not T-028-era text alone)

**Out of scope:** T-031 / T-033 implementation · A4 GAM pedagogical-function fulfilment · A3 learner-facing corruption except causal separation · P05 · general DLA prompt architecture · production wording

This artefact diagnoses **queue A** from T-037. It does not mark the defect fixed. It does not authorise implementation. It does not claim RECOVER.

---

## Limitation — runtime artefacts

Exact EP / DLA / GAM JSON for the post-P04 Lagrangian run is **not in git**. Reconstruction uses:

1. Operator-reported T-037 / this brief (primary live evidence);  
2. Live production prompt, pack, and validators;  
3. T-021 / T-026 / T-027 / T-028 as the accepted P01-R1 contract history.

Ids such as `A3-M3` are operator-reported. This report does not invent unpublished `learner_task` wording.

---

## 0. Finding in one paragraph

T-028’s live step 2 already classifies a blank `analysis_table` as a **workspace**, not a task operand. Applied literally, post-P04 Lagrangian A3 **violates** that contract: DLA set `separate_inputs_required: true`, listed `A3-M3` (table/workspace), and never commissioned the **supplied Lagrangian function(s)** named in `expected_output`. The operand disappears at **DLA commissioning / `task_input_material_ids` selection**, not at EP, not at GAM. Schema can express the correct answer. Validators must not infer it from prose. T-031 cannot suit an absent operand. GAM 1:1 fulfilment of the table was correct ownership.

This is the **same class** as T-026 (true + list workspace, omit operand), now after the T-028 gloss, and **asymmetric with A2 on the same page**. It is not a P04 evidence-role regression. It is not deeper P01 architecture. Recurrence is explained by **salience of “problem” vs an intermediate mathematical object**, plus **MEDIUM pack WE + blank-table practice pressure**, plus a canonical example that still only shows cases-as-operands.

**Recommended next class: B — small P01-R1 prompt refinement** (owning surface: commissioning-order step 2 in `lib/ld-dla-page-enrich-contract.js`). Pack reconciliation is secondary, not the primary class.

---

## 1. Evidence boundary

| Item | State |
| ---- | ----- |
| Contract version | `76-DLA-PARTIAL-6` |
| Step 2 (T-028) | Still live verbatim in `buildDlaPageEnrichContractBlock` |
| P04 | Gate C **PASS** ([T-037](S76-T-037-dla-p04-gate-c-rebenchmark.md)); step 2 retained; audits deleted; contrast line added for P01-true / P02-false practice operands |
| Lagrangian A2 this run | Explicit practice problems as task inputs; WE/checklist not operands; P02 false |
| Lagrangian A3 this run | `task_input_material_ids = ["A3-M3"]`; A3-M3 = analysis_table/workspace; no separate Lagrangian operand row |
| A3 GAM corruption | Separate exhibit (queue E) — worked derivation mangling in the **model**, not the missing practice function |
| A4 GAM fulfilment | Queue D — out of scope |

---

## 2. A3 reasoning chain

**LO3 (operator):** derive FOCs by taking partial derivatives of a Lagrangian and setting them to zero.

**Activity:** A3 — Deriving First-Order Conditions.

**EP (operator):** `apply` — orientation → worked_example → practice → consolidation.

| Layer | What happened | Operand present? |
| ----- | ------------- | ---------------- |
| **EP** | Choreographs practice after a worked example. Does not name material ids. Practice beat implies an independent operation on **new** particulars, not “fill a table that contains no L.” | Intent present; no commission yet |
| **DLA Step 1 — production** | `expected_output` refers to FOCs from **supplied Lagrangian functions**. Production therefore presupposes separate L objects. | Named in prose |
| **DLA Step 2 — task_material_decision** | `separate_inputs_required: true` — DLA correctly judged that the L is **not** fully contained in `learner_task`. | Boolean correct |
| **DLA commissioning** | Rows include worked example, teaching/commentary, checklist, and `A3-M3` analysis_table whose spec is **table structure / learner rows**. **No row** whose job is to supply additional Lagrangian function(s). | **Disappears here** |
| **DLA task_input_material_ids** | `["A3-M3"]` — workspace listed as the only task input. | Mis-selected |
| **P02** | Not the failure mode. Procedural FOC practice is P02-false (T-027). | n/a |
| **GAM** | 1:1 fulfilled A3-M3 as the table. Inserted a labelled “Additional practice problem” row **without** an actual L. Could not fulfil an uncommissioned function row. | Confirms absence; does not cause it |

**Earliest causal layer: DLA commissioning + operand-id selection (P01-R1), after a correct `true` boolean.**

EP did not drop the practice beat. GAM did not drop a Lagrangian row DLA never listed.

---

## 3. Literal T-028 test on A3-M3

Live step 2 (current production):

> A task input is the particular content upon which the learner performs the required operation … when not already fully contained in learner_task. … operand/stimulus = problem, case, data, values, source, passage, object or other particulars acted upon; model = shows how; workspace = place/structure to record or manipulate, **including blank tables**; scaffold = prompts, supports or checks. Used during the activity ≠ automatically a task input. **Absence test:** if removing it leaves the learner without the particulars needed to operate, it is a task input; if they lose only an example of how, a place to write, guidance, or a checklist, it is not.

| Test | A3-M3 |
| ---- | ----- |
| Particular content operated on? | **No.** The operation is differentiate **L**. The table is the place to record ∂L/∂x, ∂L/∂y, ∂L/∂λ. |
| Absence test | Remove A3-M3: learner still needs the functions; they lose a structured place to write. Remove an uncommissioned L: they cannot perform the practice operation. **A3-M3 fails as task input.** |
| Already fully in `learner_task`? | **No.** DLA set `true` and `expected_output` says **supplied** functions. |
| Where should the operand live? | Ordinary `required_materials[]` row (problem / text / scenario / etc.) whose purpose is to supply the practice Lagrangian(s); list **that** id only. WE, table, checklist remain unlisted. |

**Classification (ranked):**

1. **B — non-compliant with already sufficient T-028 semantics** (primary). The absence test and “blank tables = workspace” already decide A3-M3.  
2. **C — encouraged by competing pack/practice-table grammar** (contributing). See §5.  
3. **A — deeper contract insufficiency** (weak / local salience only). Structure is sufficient. The operand noun list foregrounds `problem` more than an intermediate **function/expression/object already constructed**. That is a salience gap, not a missing field.  
4. Not random-only: A2 on the same generation applied T-028 correctly.

---

## 4. A2 vs A3

| | A2 (succeeded) | A3 (failed) |
| - | -------------- | ----------- |
| Operation | **Construct** L from a **problem** (objective + constraints) | **Differentiate** a **supplied Lagrangian** |
| Salient operand noun in step 2 list | `problem` — explicit | Intermediate **object/function** — only covered by generic `object` / `particulars` |
| Typical EP beat | practice after WE | practice after WE (same apply pattern) |
| What DLA listed | New optimisation **problems** | `analysis_table` workspace |
| Support rows | WE / checklist not operands | WE / commentary / checklist commissioned; table **also** listed as the input |
| P02 | false | expected false (not diagnosed as P02 fail) |
| Table temptation | Blanks are “construct L here” but the **stem** is still a recognisable problem set | Table can look like it **is** the practice (exemplar derivation + empty “Additional practice problem” row) — operand fused into workspace |

**Why “problem” was salient in A2 but “Lagrangian function” was not in A3**

- Step 2’s examples lead with **problem, case, data…**. A2’s production maps onto the first token. A3’s production maps onto an **already-built mathematical object** that the model can treat as “content of the derivation table” rather than a separate stimulus.  
- Pack practice grammar (WE then blank table) matches **derivation worksheets** especially well: the table *looks* like the practice obligation.  
- Canonical JSON still shows a **scenario** as the only `task_input_material_ids` example. P04’s one-line contrast says practice operands stay listed with P02 false; it does **not** show operand ≠ table for a function-to-operate-on.  
- `expected_output` “supplied Lagrangian functions” shows DLA **knew** supply was required and still bound the id to the workspace — selection error, not “operand already in the task.”

This is prompt-pressure + salience, not unexplained variance.

---

## 5. Competing prompt inventory (live, model-visible)

Inspected: `lib/ld-dla-page-enrich-contract.js` (steps 1–5, payload, provider-authoring, canonical shape); DLA pack `promptTemplate` / `defaultPromptNotes` / DLA-WB gates; `validateTaskMaterialDecisionClosure`; non-Copy `FUNCTION_TO_MATERIAL_TYPE` (not Copy-visible).

| Surface | Pressure on “practice = blank table” | Class |
| ------- | ------------------------------------ | ----- |
| Step 2 T-028 (live) | Explicitly: blank tables are workspaces; list **only operand** ids | **NONE** (corrects the defect) |
| Step 4 P02 | Recording in `analysis_table` ≠ evidence provider. Helps A4; does not tell P02-false practice to list the table as P01 | **LOW** (P02-gated) |
| Canonical shape | Sole full example: scenario + evidence_requirement as task input | **MEDIUM** (A4 analog; no practice-operand + separate table) |
| P04 contrast line | Practice operands in `task_input_material_ids` with P02 false | **LOW** support; no table-vs-function contrast |
| Pack: obligation population / one row per beat | Practice beat → some `required_materials` row. Satisfied by table alone | **MEDIUM** |
| DLA-WB-06a | Session **MUST** include a table/reference type on a **practice-oriented** activity; spec = learner-work columns, judgement cells **left for the learner**; coexist with WE | **MEDIUM** — commissions the table; does **not** require listing it as `task_input_material_ids` |
| DLA-WB-08 / DLA-WB-23 | Study WE before independent practice | **LOW** — modelling order; does not forbid a problem/L row |
| DLA-WB-18 | Distinct `scenario` row if task mentions cases/scenarios | **NONE** for A3 functions; **supports** A4-class |
| DLA-WB-27 / G4 (Analyse) | WE/modelling_note **before** `analysis_table`; table spec ≥1 exemplar or hint column | **LOW** on this exhibit (EP is **apply**, not Analyse) but teaches exemplar+blank grammar |
| Pack `defaultPromptNotes` “Table specs: column/row intent” | Strengthens table commissioning | **LOW** |
| Non-Copy `guided_practice → template` | Same table/template bias | **NONE** on Copy product path |

**Strongest competing pressure: MEDIUM — DLA-WB-06a + obligation-population “practice beat → table row”, not a HIGH instruction that orders the table into `task_input_material_ids`.**

T-027 already flagged: “Pack WE+table salience still wins after Option 2.” This run is that residual, concentrated on A3.

Do **not** treat pack removal as the first move. Pack requires **commissioning** a practice table; T-028 already forbids **listing it as the operand**.

---

## 6. Schema assessment

Correct A3 shape on **existing** fields:

- `separate_inputs_required: true`  
- commission practice Lagrangian(s) as an ordinary `required_materials[]` row  
- list **that** id in `task_input_material_ids`  
- do not list WE, workspace, or checklist  
- `evidence_decision.required` may remain `false`

T-024 already has ordinary-practice fixtures of this shape. T-027 §J: schema sufficient.

**SCHEMA SUFFICIENT: YES**

No new field.

---

## 7. Validator boundary

`validateTaskMaterialDecisionClosure` closes: object present; boolean; unique ids; ids ∈ `required_materials[]`; true ⇒ ≥1 id; false ⇒ empty. It does **not** judge operand-hood.

Accepted architecture: DLA owns the semantic boolean and ids; validators must not infer missing operands from `learner_task` / beats / “practice requires problem set” / maths regexes.

No new **generic deterministic** invariant (without a role field, which T-021/T-027 rejected) can tell a valid table-as-operand (rare: the table **is** the dataset acted on) from this invalid table-as-workspace.

**DETERMINISTIC VALIDATOR CHANGE: NO**

---

## 8. Relation to T-031

P01-R1: did we commission and identify the thing operated on?  
T-031: can the realised thing support the commissioned operation?

Here there is **no** separate practice Lagrangian to test. T-031 would not create it.

**T-031 would not solve this defect.**

---

## 9. GAM ownership

- GAM was **not** given a commission whose purpose/specification is “supply additional Lagrangian function(s) to differentiate.”  
- Inventing those functions **inside** A3-M3 (beyond a labelled empty row) would be **silent repair of a missing DLA commission**, violating 1:1 fulfilment.  
- Filling the table structure DLA specified was legitimate. The empty “Additional practice problem” row is fulfilment of a workspace spec, not a substitute operand.  
- A3 worked-derivation **mangling** (queue E) is a different GAM/content-integrity exhibit on the **model** row. Not required to explain the missing practice L.

**GAM ownership verdict:** GAM could not legitimately repair A3. Defect remains DLA P01-R1 selection/commission.

---

## 10. Bounded problem statement

After T-028, DLA can still set `separate_inputs_required: true` and list a **workspace/table** as the sole task input while omitting a separate row for an **intermediate mathematical operand** (here: Lagrangian functions to differentiate) that is not fully contained in `learner_task`, even when `expected_output` calls those functions “supplied.”

This is **not**:

- original P01 missing `task_material_decision`;  
- T-026’s pre-gloss underspecified “those materials” (the gloss now exists and A3 still misses);  
- P02 evidence semantics;  
- P03 empty purpose/specification (the table spec existed);  
- T-031 operational suitability;  
- T-033 LO-operation coverage;  
- A4 GAM pedagogical-function fulfilment;  
- A3 GAM text corruption.

It **is** a **post-T-028 P01-R1 residual**: adequate structure and an adequate definition, **non-compliant selection** on the intermediate-object / derivation-table pattern, with MEDIUM pack table-as-practice salience. Not a new schema problem. Not unexplained one-off variance (A2 succeeded).

---

## 11. Recommended next class

**B. SMALL P01-R1 PROMPT REFINEMENT NEEDED**

Why not A: same-page A2/A3 split plus T-027’s predicted WE+table residual.  
Why not C as primary: no pack line **requires** listing the table as `task_input_material_ids`; DLA-WB-06a only requires commissioning it. Reconciling pack is optional follow-on if B fails.  
Why not D: schema and ownership already express the correct A3.  
Why not E: operator exhibit + live step 2 + pack text are enough to classify.

**Likely owning surface (do not write replacement wording here):** `lib/ld-dla-page-enrich-contract.js` commissioning-order **step 2** (and, if solution design agrees, the existing one-line practice contrast — still **not** a second full JSON example). Optional later: one pack note that a practice table does not replace the operand row. Leave validators, schema, P02, T-031, T-033, P05, GAM, and A3 corruption alone.

---

## 12. Exact next recommended action

Authorise a **bounded P01-R1 solution-design** task (not implementation from this artefact) to add the smallest step-2 clarification that an **expression / function / already-constructed object the learner must operate on** is an operand, and that a workspace table that will hold the working is not.

Do not implement from T-038. Do not fold into T-031, T-033, P05, or GAM diagnostics.

---

**P01-R1 A3 DIAGNOSTIC COMPLETE — READY FOR BOUNDED SOLUTION DESIGN**

*End of S76-T-038. No implementation authorised.*

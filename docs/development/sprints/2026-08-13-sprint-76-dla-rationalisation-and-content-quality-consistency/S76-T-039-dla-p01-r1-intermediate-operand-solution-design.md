# S76-T-039 — DLA-P01-R1 intermediate-operand salience solution design

**Task:** S76-T-039  
**Status:** **Solution design complete** (2026-08-14) — not implementation  
**Mode:** DESIGN ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, pack, or Settings changes  
**Depends on:** [T-021](S76-T-021-dla-p01-solution-design.md) · [T-027](S76-T-027-dla-p01-residual-operand-closure-solution-design.md) · [T-028](S76-T-028-dla-p01-residual-operand-closure-implementation.md) · [T-038](S76-T-038-dla-p01-r1-a3-operand-workspace-diagnostic.md) · [T-037](S76-T-037-dla-p04-gate-c-rebenchmark.md)  
**Owning surface (future implementation):** `lib/ld-dla-page-enrich-contract.js` commissioning-order **step 2** only

**Out of scope:** implementation · T-031 / T-033 · P05 · DLA-WB / obligation-population edits · GAM A4 fulfilment · A3 text corruption · new schema · validator heuristics · second canonical JSON example · general prompt architecture

This artefact designs the smallest P01-R1 refinement implied by T-038. It does **not** authorise implementation. It does **not** mark the A3 defect fixed. It does **not** claim RECOVER.

**Conceptual wording below is design-only.** Final production text belongs to a later implementation plan.

---

## 0. Accepted T-038 diagnosis (not reopened)

Live step 2 (`76-DLA-PARTIAL-6`) already defines operand vs model vs workspace (including blank tables) vs scaffold, plus the absence test. P01 schema is sufficient. Deterministic validators are correct. A3 set `separate_inputs_required: true` then listed the derivation table and omitted supplied Lagrangian functions. DLA-WB / obligation population exert **MEDIUM** practice→table pressure but do not require that `task_input` decision. GAM correctly did not invent the missing operands.

The local gap is **salience**: `problem` is highly visible as an operand; an **already-formed intermediate object** (here, a Lagrangian to differentiate) is not.

---

## 1. Target semantic principle

Keep T-028 roles. Add one discipline-neutral clause: the operand is whatever **this activity’s operation acts upon**, not only a conventional problem/case/dataset.

| Role | Unchanged meaning |
| ---- | ----------------- |
| **Operand / stimulus** | Particular content, **object, or state** the learner acts on in **this** activity |
| **Model** | Shows how |
| **Workspace** | Place/structure to perform or record work (including blank tables) |
| **Scaffold** | Supports/checks |

An operand may be:

- a conventional problem, case, dataset, source, passage; **or**  
- an **intermediate object/state already formed** that is now the target of a **new** operation,

**when the system must supply it** and it is **not** already fully contained in `learner_task`.

Relative to the current operation only. Do not list the workspace because the learner records the operation there.

**Not production:** no long noun taxonomy (expression / draft / code / specimen / …). Those belong only in this design’s mental tests (§5).

---

## 2. Cross-activity / prior-product boundary (T-021 §I)

**A — system-supplied instance (in P01):** this activity’s operation needs a particular intermediate object that GAM/DLA must **author for this activity**. If it is not fully in `learner_task`, commission a `required_materials[]` row and list it as a task input.

**B — learner-owned prior product (out of P01 expansion):** the learner brings forward **their own** work from an earlier activity. That is **not** a new GAM commission. Do not add a `required_materials[]` row so GAM regenerates the learner’s prior product. State reuse in task/bridge prose only. Do not put that prior product in `task_input_material_ids` (those ids are GAM commissions).

Lagrangian A3 is **A**: independent guided FOC practice needs **supplied** L function(s) for this activity, not a graph of the learner’s A2 answers (T-027). If a future design truly reused A2 learner products, that remains T-021 §I — out of this refinement.

Clean boundary: **P01 commissions what the system must supply for this operation; it does not commission the learner’s own prior output.**

---

## 3. A3 target behaviour (conceptual)

No new field.

| Element | Target |
| ------- | ------ |
| `separate_inputs_required` | `true` |
| Commission | One ordinary row whose job is to supply the practice Lagrangian expression(s) / equivalent problem-objects |
| `task_input_material_ids` | **Only** that operand row |
| Worked example | Commissioned as model; **not** listed |
| Derivation table | Commissioned as workspace; **not** listed merely because derivatives are entered there |
| Checklist | Not listed |
| `evidence_decision.required` | `false` for ordinary procedural practice |

Do **not** put Lagrangian-specific production guidance in the live prompt.

---

## 4. A2 non-regression

A2 already treats **optimisation problems** as operands and WE/workspace/checklist as support, P02 false.

The clarification **widens salience of “object/state acted on”**; it does not demote `problem`. A2’s problems remain the particulars constructed-from. Workspaces remain “place to write.” Absence test unchanged: remove the problem set → no objects to construct L from; remove the table → lose workspace only.

Risk if wording said “prefer intermediate objects over problems”: **rejected**. Intermediate is an **additional** operand form, not a replacement for conventional problems.

---

## 5. Cross-disciplinary mental tests (not production bulk)

| Domain | Operand (act upon) | Not the operand |
| ------ | ------------------ | --------------- |
| Mathematics | Supplied expression / L / problem stem | FOC table, working grid |
| Programming | Supplied code/spec to debug or complete | Trace table, editor template |
| Writing / languages | Supplied draft or passage to edit/critique | annotation worksheet |
| Empirical / science | Supplied dataset or specimen | analysis_table / lab sheet |
| Humanities | Supplied source/extract | comparison table, notes frame |

Rule: identify the object acted on, not the place the result is recorded.

---

## 6. Absence-test decision

**A. No change.**

Live test already decides A3: remove table → lose workspace; remove supplied L → lose the object to differentiate. Replacing it would spend budget restating T-028. A tiny “particulars” gloss is unnecessary if Option 2 names object/state in the definition.

---

## 7. Options

Live step 2 stays the home. No new heading. No second audit. No second full JSON example.

### Option 1 — Tiny noun/example add

Insert tokens such as `expression` / `function` next to `problem, case, data…`.

| Lens | Assessment |
| ---- | ---------- |
| Coverage | Weak — A3 maybe; draft/code/specimen not covered |
| Prompt cost | Lowest (~40–80 unique) |
| Noun-list accretion | **High** — invites more subject nouns |
| Cross-disciplinary | Poor |
| A3 likelihood | Medium (if `function`/`expression` listed) |
| A2/A4 risk | Low |

**Reject** as the recommended path.

### Option 2 — Generalise “particular content” to include intermediate object/state **(recommend)**

One clause: the thing acted on in **this** operation includes an already-formed object/state the **system must supply**, not only a conventional problem/case.

| Lens | Assessment |
| ---- | ---------- |
| Coverage | Strong, discipline-neutral |
| Prompt cost | Small (~150–250 unique if kept to one clause) |
| Noun-list accretion | **Low** if no example taxonomy ships |
| Cross-disciplinary | Strong (§5) |
| A3 likelihood | High — L is exactly that object |
| A2/A4 risk | Low (§4); A4 cases remain conventional particulars |

Optional **one short workspace-fusion clause** (Option 3 fragment) may ride in the same insert: do not list the workspace because the operation is recorded there. Keep total unique add in the same band. Do not add a second numbered step or audit.

### Option 3 — Compact supplied-object vs workspace contrast only

Second sentence: supplied object ≠ table that holds the working.

| Lens | Assessment |
| ---- | ---------- |
| Coverage | Strong for A3 fusion; weaker for “this is still an operand even when it is not called a problem” |
| Prompt cost | Small (~80–150 unique) |
| Noun-list accretion | Low |
| Cross-disciplinary | Medium |
| A3 likelihood | High for table mis-selection; may miss “never commissioned the L at all” |
| A2/A4 risk | Low |

Useful as a **fragment inside Option 2**, not as the sole change.

**Recommend: Option 2** (with optional one-clause workspace-fusion if the implementation plan stays inside the cost band).

---

## 8. Prompt-cost estimate

Current unique contract+shape (T-036): **17,973**. Copy still injects ×2 (P05 open).

| | Unique | Assembled ×2 |
| - | ------ | ------------ |
| Recommended Option 2 insert | **~180–280** | **~360–560** |
| Ceiling for this change | **~400** unique | **~800** ×2 |
| Out of budget | Second activity JSON; pack DLA-WB rewrite; new PRE-EMIT | — |

Do not shrink until “intermediate object/state” and “system must supply” (vs learner prior product) become unclear.

---

## 9. DLA-WB decision

**A. Leave DLA-WB untouched and test the step-2 refinement first.**

T-038: pack **MEDIUM**; DLA-WB-06a requires **commissioning** a practice table, not listing it as `task_input_material_ids`. Step 2 already forbids listing blank tables as operands. The miss is salience of the **other** row. Coordinated pack copy is not required until Option 2 fails a later Gate C. **Not C.** **Not B** unless implementation planning finds the insert cannot be understood beside DLA-WB-06a — no such evidence now.

---

## 10. Schema / validator / GAM

| | |
| - | - |
| **SCHEMA CHANGE** | **NO** |
| **DETERMINISTIC VALIDATOR CHANGE** | **NO** |
| **GAM CHANGE** | **NO** |

DLA semantic selection. GAM fulfils commissioned rows only.

---

## 11. T-031 / T-033 separation

| | Question | This design |
| - | -------- | ----------- |
| **P01-R1** | What is acted on, and has the system supplied/commissioned it? | **Yes — this task** |
| **T-031** | Can the realised operand support the commissioned operation? | **No** — do not add solvability / method-fit |
| **T-033** | Did DLA choose the right LO operations? | **No** — do not add LO-coverage rules to step 2 |

---

## 12. Acceptance criteria (future implementation)

- A3-like intermediate operands become salient as task inputs when the system must supply them.  
- Workspace remains distinguishable (absence test unchanged).  
- A2 conventional problems still classify as operands; WE/workspace/scaffold excluded; P02 false.  
- Learner-owned prior products are **not** automatic GAM commissions.  
- P01/P02 independence intact.  
- No schema change; no deterministic semantic validator; no GAM repair duty.  
- No subject-specific branch; no noun-list expansion; no new audit stack.  
- Unique add in ~180–280 (ceiling ~400).  
- DLA-WB unchanged in this change-set.  
- Canonical A4 JSON unchanged. Steps 1 and 3 openings unchanged (T-033 / T-031 surfaces).

---

## 13. Exact next action

Authorise an **implementation plan** (not live edits from this artefact) for Option 2 on commissioning-order step 2 only: unique/×2 size, cache pin / `CONTRACT_VERSION` bump convention, prompt-test presence of the intermediate-object clause and absence of noun taxonomy, Gate A/B then operator Gate C. Do not implement from T-039.

---

**P01-R1 INTERMEDIATE-OPERAND DESIGN COMPLETE — READY FOR IMPLEMENTATION PLANNING**

*End of S76-T-039. No implementation authorised.*

# S76-T-027 — DLA-P01 residual operand-closure solution design

**Task:** S76-T-027  
**Problem:** [DLA-P01-R1](S76-T-026-dla-p01-residual-operand-closure-diagnostic.md) — DLA does not reliably distinguish task operands/stimuli from models, workspaces, and scaffolds when selecting `task_input_material_ids` for procedural practice  
**Status:** **Solution design complete** (2026-08-13) — not implementation  
**Mode:** DESIGN ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, QA, workflow, or Settings changes  
**Depends on:** [T-010](S76-T-010-dla-audit-report.md) · [T-021](S76-T-021-dla-p01-solution-design.md) · [T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md) · [T-024](S76-T-024-dla-p01-p02-p03-gate-a-b.md) · [T-026](S76-T-026-dla-p01-residual-operand-closure-diagnostic.md)  
**Out of scope:** implementation · P04 · P05 · new schema · prose-heuristic validators · pack DLA-WB rationalisation

This artefact designs the **smallest durable clarification** of what may be listed as a P01 task input. It does not rewrite prompts or authorise implementation.

---

## A. Executive design decision

**PROPOSED TARGET CONTRACT**

Keep the existing P01 object. Do not add fields, roles-on-rows, or a new semantic subsystem.

Clarify, in the existing Activity commissioning order, that `task_input_material_ids` lists only **operands/stimuli**: the particular content the learner **acts upon**. Models, workspaces, scaffolds, and teaching materials may still be commissioned in `required_materials[]`; they are not task inputs unless that same row also supplies those particulars.

Discriminating test (role, not type):

> If this material were removed, would the learner still have the particular content to operate on, or only a demonstration, a blank structure, a check, or an explanation of how to operate?

That is the difference between **“used during the task”** and **“the material the learner acts upon.”**

**Recommended intervention:** replace/clarify commissioning-order step 2, plus a four-role compact contrast in that same step. Keep the current A4-like canonical JSON example. Do not add a second full activity example. Do not touch pack DLA-WB, PRE-EMIT, or evidence self-audit. No schema change. No behavioural validator change.

**P01 RESIDUAL READY FOR IMPLEMENTATION PLANNING**

---

## B. Target operand/stimulus semantics

**CURRENT FACT (T-021):** A material dependency exists when the learner cannot execute the production obligation without an artefact whose content is **not fully stated** in `learner_task` / `expected_output`.

**CURRENT FACT (T-026):** Gate B prompt never defined what a “task input” *is*. Teaching/scaffold is named only on the `false` branch. DLA can list any commissioned row.

**DESIGN INTERPRETATION:** The residual is mis-selection of **which** commissioned rows are listed, not failure to set `separate_inputs_required`.

**PROPOSED TARGET CONTRACT — TASK OPERAND / STIMULUS**

A **task operand / stimulus** is the particular content the learner must **act upon** to produce the required output — content not fully contained in the task prose.

The primary rule is **role**, not a noun list. Nouns (problems, equations, datasets, cases, scenarios, extracts, passages, images, observations, values, objects, prompts that carry particulars) are illustrations of that role.

| | Operand / stimulus | Used during the task but not an operand |
| - | ------------------ | --------------------------------------- |
| Question | What does the operation take as its object? | What helps the learner perform or record the operation? |
| Absence test | Remove it → the learner has nothing to operate on | Remove it → the learner still has the problems/cases/data, but loses a model, blank frame, or check |
| Listed in `task_input_material_ids`? | **Yes** (when separate from task prose) | **No** |

`separate_inputs_required: true` means at least one such operand exists as a separate commission. `false` means the particulars are fully in the task prose (or there are none); teaching/model/workspace/scaffold may still exist.

---

## C. Negative role boundary

**PROPOSED TARGET CONTRACT**

A material is **not** a task input merely because it is present, filled, studied, or used during the activity.

Roles (not `material_type` bans):

| Role | Meaning | Typical types (illustrative, not exclusive) | List as task input? |
| ---- | ------- | ------------------------------------------- | ------------------- |
| **MODEL** | Shows how to perform the operation | `worked_example`, `sample_output`, `modelling_note` | **No**, unless that same row also supplies the unseen particulars the learner must operate on (unusual) |
| **WORKSPACE** | Place/structure in which to perform or record it, including exemplar + **blank** learner rows | `analysis_table`, `comparison_table`, `planning_table`, `decision_table`, `template` | **No**, unless the row also **contains** the particulars (e.g. a supplied dataset table that *is* the data). Blank cells for learner answers do not make the table the operand. |
| **SCAFFOLD** | Supports, prompts, or checks performance | `checklist`, `prompt_set`, `transfer_prompt` | **No** |
| **TEACHING** | Explains concepts/processes | `text`, exposition | **No** |

**Do not** create absolute type-based exclusions. An `analysis_table` can be an operand if it *is* the supplied dataset. A `worked_example` can be an operand only if the learner’s job is to operate on that example’s particulars (rare; usually the job is to study it). Default for procedural practice: WE = model, table = workspace, checklist = scaffold, problem-set/scenario/dataset/extract = operand.

**Not a task input:** the learner’s own answer; an upstream learner product (T-021 §I; still out of P01).

---

## D. Gate C A2 / A3 / A4 walkthrough

**Limitation (CURRENT FACT):** live Gate C JSON is not in git. Roles follow T-026 / operator report.

### A2 — Build the Lagrangian

Learner constructs Lagrangians for **new** optimisation problems.

| Role | Target |
| ---- | ------ |
| **Operand** | The new problem set (objective functions + constraints), not inlined in `learner_task` |
| `task_input_material_ids` | Only the problem-set row id(s) |
| **Model** | Worked Lagrangian construction |
| **Workspace** | Analysis table with exemplar + blank rows |
| **Scaffold** | Checklist / checking guidance |
| **Ordinary commission** | A `required_materials[]` row whose purpose is to supply those unseen problems; P03 specification bounds count/form/variation/exclusions (see §K) |
| **P02** | `false` — problems are procedural operands, not particulars-as-grounds |

### A3 — Derive Optimal Conditions

Learner performs guided FOC calculations on **new** Lagrangian/problem inputs.

| Role | Target |
| ---- | ------ |
| **Operand** | The new Lagrangian / optimisation problem(s) to differentiate |
| `task_input_material_ids` | Only that problem/Lagrangian row id(s) |
| **Model** | Worked FOC modelling |
| **Workspace / scaffold** | Guidance table, checking materials |
| **Ordinary commission** | Separate problem/Lagrangian input row (or reuse of A2’s *commissioned* problems if this activity must have its own GAM-generated copy — still a same-activity commission, not an upstream-learner-product graph) |
| **P02** | `false` |

If A3 is designed to reuse the learner’s A2 answers, that remains **out of P01** (T-021 §I). If A3 is designed as independent guided calculation, DLA must commission the new inputs, not substitute the FOC workspace for them.

### A4 — Interpret shadow prices / λ

Learner inspects **supplied cases/values**.

| Role | Target (preserve) |
| ---- | ----------------- |
| **Operand** | The economic cases (constraints, multiplier values, observations) |
| `task_input_material_ids` | The scenario/case row id(s) |
| **Workspace** | Comparison / analysis table (not listed) |
| **Teaching** | Explanatory text (not listed) |
| **P02** | `true` — those particulars are **grounds** for interpretation; providers ⊆ task inputs |

The same absence test explains all three: remove the problems (A2/A3) or cases (A4) and the operation has no object; remove the table/WE/checklist and the object remains. No activity-specific exception is required.

---

## E. Cross-disciplinary validation

Same rule. `separate_inputs_required` abbreviated as **SIR**.

| Case | Operand | Model | Workspace | Scaffold | Teaching | SIR | `task_input_material_ids` |
| ---- | ------- | ----- | --------- | -------- | -------- | --- | ------------------------- |
| **A. Statistics** — calculate summary measures for the supplied dataset | Dataset | Optional worked calculation | Optional results table | Optional checklist | Optional method text | **true** | Dataset row only |
| **B. Literature** — analyse the supplied passage | Passage / extract | Optional modelled annotation | Optional analysis table | Optional prompts | Optional technique note | **true** | Passage row only (typically also P02 true) |
| **C. Engineering** — diagnose the fault from these sensor readings | Sensor readings | Optional analogue diagnosis | Optional diagnosis table | Optional checklist | Optional theory | **true** | Readings/case row (typically P02 true) |
| **D. History** — compare the two source extracts | The two extracts | Optional modelled comparison | Comparison table | Optional criteria checklist | Optional context text | **true** | Extract/scenario row(s) (typically P02 true) |
| **E. Mathematics** — solve the following three optimisation problems | The three problems | Worked example | Construction/answer table | Checklist | Method text | **true** | Problem-set row only; P02 **false** |
| **F. Chemistry** — use the supplied measurements to calculate concentration | Measurements | Optional worked calculation | Optional workspace | Optional checklist | Optional formula recap | **true** | Measurements row; P02 false unless they function as grounds for a judgement beyond calculation |
| **G. Concept explanation** — study the worked example and explain the method in your own words | None separate (production is explanation of the method; WE is the **model being studied**, not a new operand set). If the WE is fully inlined in the task, SIR **false**. If the WE is a separate artefact the learner must study as the object of explanation, it is an unusual operand (the example *is* what they act upon). Default: SIR **false**; WE commissioned but **not** listed unless the task cannot be done without that separate body. | WE | — | — | May coincide with WE | **false** (default) | empty |
| **H. Reflection** — use the checklist to review your answer | None (checklist is scaffold; the answer is the learner’s product) | — | — | Checklist | — | **false** | empty |

**G** is the boundary case: studying a model is not the same as operating on new particulars. Default false preserves “explain the method.” Only list the WE if the production obligation is to operate on that example’s specific content and it is not in the task prose.

The rule stays coherent: cases B–D look like A4; E looks like A2; A and F are dataset/measurement operands with P02 independent.

---

## F. Minimum prompt surfaces

**CURRENT FACT:** production P01 gloss lives almost entirely in `buildDlaPageEnrichContractBlock` commissioning-order step 2 and the required-payload bullet for `task_material_decision`. Canonical shape is A4-like. Pack DLA-WB is on Copy (`resolveStepPromptText`) but is P04-scale.

| Surface | Proposed class | Why |
| ------- | -------------- | --- |
| `lib/ld-dla-page-enrich-contract.js` `buildDlaPageEnrichContractBlock` — **Activity commissioning order step 2** | **ESSENTIAL** | This is the underspecified line T-026 identified. Replace/clarify in place. |
| Same file — required payload bullet for `task_material_decision` / `task_input_material_ids` | **OPTIONAL** (recommend **include**, one sentence) | Reinforces “list only operand ids” where the field is named. Cheap. |
| `buildCanonicalDlaPageShapeSnippet` — existing A1 scenario/evidence example | **DO NOT REPLACE** | Preserves A4 / Roman Roads analog. |
| Same snippet — add a second full procedural activity JSON | **DO NOT TOUCH in this change-set** | Copy×2 cost; accretion; Option 3 rejected (§N). |
| `app.js` `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE` | **DO NOT TOUCH** unless the field list is already being edited; a gloss does not belong on this dense line | Presence already lists the object. |
| Pack OBLIGATION POPULATION / DLA-WB-06a / G4 / DLA-WB-08 / beat→obligation | **DO NOT TOUCH UNTIL P04** | Compete by salience, do not forbid an extra operand row (§H). |
| PRE-DESIGN / PRE-EMIT / per-activity evidence audit / INVALID–VALID | **DO NOT TOUCH UNTIL P04** | P02 accretion; A2/A3 are P02-false. |
| P02 “scaffold ≠ evidence provider” | **DO NOT TOUCH** | Already correct for A4; do not duplicate it as a P01 audit. |
| GAM brief / EP / `FUNCTION_TO_MATERIAL_TYPE` | **DO NOT TOUCH** | Residual is Copy DLA generative selection. |

**Smallest intervention:** essential step-2 rewrite + optional one-sentence payload gloss. Nothing else.

---

## G. Canonical-example decision

| Option | What | Verdict |
| ------ | ---- | ------- |
| **A** | Definition only (step 2) | May lose to pack WE+blank-table salience. |
| **B** | Definition + one compact four-role contrast **in step 2** (not a second JSON activity) | **Recommend.** Teaches A2 without duplicating the A4 JSON. Unique add is small; Copy×2 still bounded. |
| **C** | Definition + role labels inside canonical JSON shape | Either overloads the A4 example (regression risk) or adds a second activity (cost). Not smallest. |

Keep the current scenario/evidence canonical activity **unchanged**. The compact contrast belongs in commissioning-order step 2, conceptually:

```text
task input = the particulars acted upon (e.g. practice problems, cases, dataset)
model = worked example (shows how)
workspace = analysis table / blank rows (place to do it)
scaffold = checklist (checks it)
```

That is Option B, not a second `activities[]` object.

---

## H. Historical workbook interaction

**CURRENT FACT (T-026):** Pack DLA-WB-06a, G4 (WE before `analysis_table` with exemplar row), DLA-WB-08, and “translate each beat into `required_materials`” are MODEL-VISIBLE on DLA Copy.

**DESIGN INTERPRETATION:** These rules **require** model/workspace/checklist rows. They do **not** say “do not commission a problem-set” and do **not** say “list the table as `task_input_material_ids`.” They compete by filling practice with WE+table, which the underspecified P01 gloss then lists.

**PROPOSED TARGET CONTRACT:** Solve the residual **without** editing pack DLA-WB / OBLIGATION POPULATION now.

A concise operand-first clarification can coexist:

- G4 / DLA-WB-06a still get their table and exemplar row (**workspace**).  
- DLA-WB-08 still gets a worked example (**model**).  
- P01 lists only the **additional** operand row.

No historical instruction was found that **directly contradicts** “also commission the problems and list only those ids.” Beat→obligation is incomplete, not contradictory. Rationalising that incompleteness is **P04**, not P01 correctness.

**If implementation later shows the model still lists the table after the step-2 gloss,** a bounded pack one-liner (“practice tables do not replace operand commissions”) could be considered then. That is not authorised here and is not required to start implementation planning.

---

## I. Validator impact

**CURRENT FACT:** `validateTaskMaterialDecisionClosure` closes declared ids only. T-021 / T-023 / T-026 reject prose inference.

**PROPOSED TARGET CONTRACT:** **No behavioural validator change.**

| Change | Needed? |
| ------ | ------- |
| Fail if listed id “looks like” a workspace | **No** — type-based / prose inference |
| Fail if `learner_task` mentions problems but no problem row | **No** — rejected architecture |
| Prompt-surface tests that commissioning order contains operand vs model/workspace/scaffold | **Yes** (test-only, later implementation) |
| Preserve existing P01 structural matrix (T-024) | **Yes** — no expectation change |
| Canonical-shape tests still expect `task_material_decision` + `specification` | **Yes** — shape JSON unchanged under this design |
| GAM / enrich behavioural tests | **No** |

---

## J. Schema impact

**CURRENT FACT:** `task_material_decision { separate_inputs_required, task_input_material_ids[] }` plus `required_materials[]` already express the correct A2/A3 shape (T-024 ordinary-practice fixture: problem-set row listed; WE/checklist present but not listed; P02 false).

**PROPOSED TARGET CONTRACT:** **No schema change.** No `operand_role` field.

Why the existing model is sufficient:

- A problem-set (or Lagrangian-input) row can exist in `required_materials[]`.  
- Its `material_id` can be the only entry in `task_input_material_ids`.  
- `evidence_decision.required` can remain `false` independently.  
- WE / table / checklist remain ordinary commissions.

A role field would only help **deterministic detection** of wrong-role ids. That is out of this residual’s accepted diagnosis and would be a new subsystem.

---

## K. P03 interaction

**CURRENT FACT (T-022 / T-024):** Every `required_materials[]` row needs non-empty `purpose` and a non-type-echo `specification`.

**DESIGN INTERPRETATION:** P01 names **which** row is the operand. P03 tells GAM **what that row must contain**. Gate C A2 failed at P01 (no operand row), so P03 never applied to the missing problems.

**PROPOSED TARGET CONTRACT** — conceptual sufficiency for an A2/A3 operand row (domain-neutral; no maths schema):

| Load-bearing where relevant | Example intent (not prescribed wording) |
| --------------------------- | --------------------------------------- |
| Count | How many problems / statements |
| Form | What each item contains (e.g. objective + constraint(s); a Lagrangian to differentiate) |
| Variation | Distinct enough that copying the model does not complete the task |
| Constraints | Domain bounds that make items valid for the operation |
| Difficulty / progression | Only if pedagogically load-bearing |
| Exclusions | Do not provide worked solutions / FOC answers / the learner’s interpretation |

Purpose states the **job** (supply unseen problems to construct L / to differentiate). Specification states those bounds. GAM 1:1 then authors bodies. Do not add mathematical-specific fields.

---

## L. P02 interaction

**PROPOSED TARGET CONTRACT** (unchanged from T-020 / T-021):

**Task operand ≠ epistemic evidence.**

| | P01 | P02 |
| - | --- | --- |
| Practice optimisation problems (A2/A3, case E) | `true`; problem-set ids listed | **`false`**; no providers |
| Shadow-price / diagnostic cases (A4, cases B–D) | `true`; case/extract ids listed | **`true`**; those ids are providers ⊆ task inputs |
| Study a method / use a checklist (G default, H) | `false` | `false` |

Do not “fix” A2 by setting `evidence_decision.required: true`. Do not treat P02 scaffold≠provider language as a substitute for this P01 gloss (it only fires when evidence is in play).

Commissioning-order steps 4–5 stay as they are.

---

## M. Prompt-budget estimate

**CURRENT FACT:** Gate B unique contract+shape **23,210** (Δ +633 vs pre-Gate-B). Copy dual-injects that pair.

**PROPOSED TARGET CONTRACT:** replace commissioning-order step 2 (currently ~280 characters) with a role definition + four-line contrast; optional ~120-character payload sentence.

| | Unique | Assembled ×2 |
| - | ------ | ------------ |
| Estimated add | **~550–900** characters | **~1.1–1.8k** |
| Not in budget | Second canonical activity JSON (~1k+ unique, ×2) | Rejected |
| Not in budget | New PRE-EMIT / self-audit | Rejected |

This is a **replacement/clarification** of an existing step, not a new layer. It should not be described as another accretion stack if implementation stays inside step 2 + one payload sentence.

---

## N. Design options

### Option 1 — Clarify “task input” in commissioning order only (definition, no contrast)

- **Effectiveness:** MEDIUM — names the absence test; pack WE+table may still be listed as “the input.”  
- **Prompt cost:** lowest (~300–500 unique).  
- **Historical machinery:** leaves all pack text; weakest override.  
- **Regression:** lowest (A4 example untouched).  
- **P04:** fully compatible.

### Option 2 — Definition + compact operand / model / workspace / scaffold contrast in step 2 **(recommend)**

- **Effectiveness:** HIGH — T-026’s missing analog for A2 without a second JSON activity.  
- **Prompt cost:** ~550–900 unique; ×2 ~1.1–1.8k.  
- **Historical machinery:** does not edit DLA-WB; contrast explicitly says blank tables are workspaces.  
- **Regression:** A4 canonical JSON unchanged; P02 steps 4–5 unchanged.  
- **P04:** compatible; P04 can later thin pack competition.

### Option 3 — Definition + compact procedural canonical example (second `activities[]` JSON)

- **Effectiveness:** HIGH for A2, but duplicates what Option 2 teaches at much higher cost.  
- **Prompt cost:** large (evidence-style JSON ×2).  
- **Historical machinery:** still unedited.  
- **Regression:** two examples may compete (A4 vs A2) or bloat shape tests.  
- **P04:** worse accretion; harder to rationalise.

**Recommend Option 2.**

---

## O. Recommended target design

**PROPOSED TARGET CONTRACT (implementation planning input, not authorised text-as-shipped):**

1. **Replace** Activity commissioning order **step 2** so that:
   - task inputs = operands/stimuli (particulars acted upon, not fully in task prose);  
   - `true` ⇒ commission those rows and list **only** those ids;  
   - model / workspace (including blank tables) / scaffold / teaching may be commissioned but are not listed unless they also *are* those particulars;  
   - `false` ⇒ ids empty; those other roles may still exist;  
   - include the compact four-role contrast (§G).  
2. **Optionally** add one payload sentence: `task_input_material_ids` lists only operand/stimulus ids.  
3. **Do not** change canonical JSON example, pack DLA-WB, PRE-EMIT, GAM, EP, schema, or P01/P02 validator behaviour.  
4. **Tests:** prompt-surface assertions for the new step-2 strings; existing Gate A P01 matrix unchanged.

GAM remains 1:1 fulfilment. Non-Copy enrich remains out of product semantics (T-021 / T-023).

---

## P. Acceptance criteria

Later implementation must demonstrate:

**A2-style**

- New practice problems explicitly commissioned as a `required_materials[]` row.  
- That row’s id listed in `task_input_material_ids`.  
- WE / table / checklist commissioned if wanted, **not** listed as the operand.  
- `evidence_decision.required: false` remains valid.

**A3-style**

- New Lagrangian/problem inputs explicitly commissioned.  
- Relevant id listed as task input.  
- Modelling/workspace not substituted for those operands.  
- Evidence false.

**A4-style**

- Scenario/cases remain task inputs.  
- Comparison/analysis table remains workspace (not listed unless it *is* the cases).  
- `evidence_decision.required: true` remains valid; providers ⊆ task inputs.

**Roman Roads**

- Control behaviour that already listed cases/sources as task inputs must remain expressible; do not make evidence-true activities list empty ids.

**Prompt**

- Unique delta in the §M band.  
- No new self-audit / PRE-EMIT section.  
- No P04 pack rationalisation.  
- Dual-injection still two contract/shape sites only.

**Validators**

- Structural P01/P02/P03 matrix still green.  
- No new prose-inference fail-close.

---

## Q. P04 sequencing

**A. Implement as a tiny P01 corrective change BEFORE P04.**

Evidence:

- Residual is P01 operand selection on **P02-false** practice; P04 is evidence-audit accretion (T-010 / T-026).  
- P04 will not accidentally add this gloss.  
- Careless P04 deletion of provider≠scaffold language could **hurt A4** if P01 still lacks its own role contrast.  
- Gate C isolation of P01/P02/P03 would be confounded if P04 ships in the same change.

Do **not** fold this into P04. Do **not** wait until after P04.

Repository evidence does not support B or C.

---

## R. Risks / unresolved questions

| Risk / question | Handling |
| --------------- | -------- |
| Pack WE+table salience still wins after Option 2 | Implementation Gate: inspect next Lagrangian DLA JSON; only then consider a **one-line** pack correction (not authorised now). |
| Model lists both problem-set **and** table as task inputs | Structurally valid today; pedagogically noisy. Prompt should say **only** operand ids. No validator for extra non-operand ids without a role field (rejected). |
| A3 reuse of A2 learner products | Still T-021 §I; out of this residual. |
| Case G (study the worked example) over-listed as operand | Default false in §E; compact contrast should say WE is model unless it *is* the particulars acted upon. |
| Unique add creeps past ~1k | Implementation must cut contrast, not add a second JSON example. |
| Gate C JSON still not in git | Does not block this design; inspect captures at implementation/review if available. |
| Non-Copy enrich still maps `guided_practice` → `template` and P01 from evidence providers only | Out of Copy product path; do not treat as this fix. |

No remaining architecture fork. Schema vs prompt was the fork; T-026 closed it in favour of prompt clarification on the existing object.

---

## S. Implementation readiness verdict

**P01 RESIDUAL READY FOR IMPLEMENTATION PLANNING**

The target contract is: keep the P01 schema; clarify operand vs model/workspace/scaffold/teaching in commissioning-order step 2 with a compact contrast; leave pack, P04 surfaces, validators, and the A4 canonical JSON alone.

This artefact **does not** authorise implementation.

*End of S76-T-027.*

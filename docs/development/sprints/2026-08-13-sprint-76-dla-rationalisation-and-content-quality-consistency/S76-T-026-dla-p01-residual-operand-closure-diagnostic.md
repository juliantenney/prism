# S76-T-026 — DLA-P01 residual operand-closure diagnostic

**Task:** S76-T-026  
**Status:** **Diagnostic complete** (2026-08-13) — not implementation  
**Mode:** DIAGNOSTIC ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, QA, or Settings changes  
**Depends on:** [T-010](S76-T-010-dla-audit-report.md) · [T-021](S76-T-021-dla-p01-solution-design.md) · [T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md) · [T-024](S76-T-024-dla-p01-p02-p03-gate-a-b.md)  
**Out of scope:** fix implementation · P04 · P05 · GAM/EP/QA change · prose-heuristic validators

This artefact diagnoses a **Gate C residual** of the implemented P01 contract. It does not authorise a solution. It does not mark the residual fixed. It does not claim RECOVER.

---

## Limitation — Gate C artefacts

Exact runtime DLA/GAM JSON for the 2026-08-13 Gate C Roman Roads and Lagrangian runs is **not persisted in the repository**. No IndexedDB dump, benchmark artefact, or captured page JSON for those runs was found under `docs/` or test fixtures.

Reconstruction of A2/A3/A4 therefore uses:

1. **Operator-reported Gate C observations** in the diagnostic brief (primary live evidence);  
2. **T-010 / CONTEXT / T-021 / T-023** historical Lagrangian A2/A3/A4 exhibits (same residual family, earlier runs);  
3. **Current production prompt/contract/validator surfaces** in the repository.

Where the live JSON is needed to name exact `material_id`s listed in `task_input_material_ids`, this report states the role pattern rather than inventing ids.

Operator-reported Gate C scores (not in-repo artefacts): Roman Roads QA **87** (P01/P02/P03 strong; GAM clean); Lagrangian QA **88** (P02/P03 strong; GAM clean; **P01 mixed**).

---

## 0. Residual in one paragraph

P01 **structural** closure is now implemented: DLA must emit `task_material_decision`, and validators close declared ids against `required_materials[]`. Gate C Lagrangian A2/A3 show a **different** failure: DLA correctly sets `separate_inputs_required: true`, then lists **workspace / model / scaffold** commissions as the task inputs, while omitting the **operands** (new optimisation problems / Lagrangians to differentiate). A4 succeeds because the needed particulars are **cases**, which existing evidence/scenario language already treats as the thing acted upon. GAM 1:1 fulfilment is behaving as designed.

This is not the original “undeclared / missing object” P01 hole. It is **operand vs workspace mis-selection among declared task inputs**.

---

## 1. Current P01 semantics — production surfaces

### 1.1 Surfaces that define or constrain P01

| File | Symbol / section | Role | Faithful paraphrase | Distinguishes OPERAND from WORKSPACE / MODEL / SCAFFOLD? |
| ---- | ---------------- | ---- | ------------------- | -------------------------------------------------------- |
| `lib/ld-dla-page-enrich-contract.js` | `buildDlaPageEnrichContractBlock` — **Activity commissioning order** steps 1–5 | MODEL-VISIBLE P01 planning | (1) define production; (2) decide whether **separate task inputs** are required; if true, commission “those materials” and list ids; if false, ids empty and **teaching/scaffold may still be commissioned**; (3) purpose/specification on every row; (4–5) P02 independently, providers ⊆ task inputs | **Weak.** Teaching/scaffold is named only on the **false** branch. The true branch never says what a task input *is*. “Those materials” can be any commissioned row. |
| same | Required payload lines for `task_material_decision`, always-array `required_materials`, `evidence_decision` | MODEL-VISIBLE field presence | Object required; empty array allowed when `separate_inputs_required` is false | **No.** Presence only. |
| same | Evidence-centred semantics | MODEL-VISIBLE P02 | Evidence providers = observations/data/cases/source extracts. Response scaffolds (`analysis_table`, `decision_table`, `template`, …) organise analysis. Recording evidence in a scaffold does **not** make the scaffold a provider. `combined_evidence_workspace` = same row with fixed evidence columns **and** blank learner columns | **Yes for P02**, not for ordinary practice. This is the strongest operand/workspace split in the prompt, and it is gated on epistemic evidence. |
| same | `buildCanonicalDlaPageShapeSnippet` | MODEL-VISIBLE example | A1: `task_input_material_ids: ["A1-M1"]` where A1-M1 is a **scenario** with `evidence_requirement` (“two short contrastive cases”) | **A4-analog only.** The sole canonical example is cases-as-particulars, not a practice-problem operand beside a workspace. |
| `app.js` | `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE` | MODEL-VISIBLE field list | Lists `task_material_decision{ separate_inputs_required, task_input_material_ids[] }` then `required_materials[{… purpose, specification …}]` then `evidence_decision` | **No.** Names the object; no role gloss. |
| `app.js` | `buildDlaV2CopilotSchemaInstructions` | Copy assembly | Concatenates contract + shape | Pass-through. |
| `app.js` | `applyEpisodePlanDlaPopulationPromptBlockToDraft` / `buildWorkflowStepInstructions` | Copy assembly | Partial-v2 DLA Copy: preamble + **pack core prompt** (`resolveStepPromptText`) + contract/shape (dual-injected). Unlike GAM, DLA does **not** skip pack `promptTemplate`. Partial mode does **not** embed stored EP JSON; EP remains in Copilot conversation. | Pack content: see §3. |
| `lib/page-dla-enrich.js` | `validateTaskMaterialDecisionClosure` | Deterministic P01 | Object required; boolean; unique non-empty ids; ids ∈ `required_materials[]`; true ⇒ ≥1 id; false ⇒ empty ids | **No.** Closes declaration, not operand-hood. |
| same | `validateOrdinaryMaterialCommission` | P03 | Non-empty purpose/specification; spec must not be the type token | **No.** A workspace with a good spec still passes. |
| same | `validateEvidenceDecisionClosure` | P02 | Object required; no prose fail-close; provider ⊆ task-input ids; scaffold-role / teaching-only closure for **providers** | Distinguishes scaffold from **evidence provider**. Does not stop a scaffold being listed as a **task input** when P02 is false. |
| same | `enrichActivityWithDla` | Non-Copy enrich only | Emits `task_material_decision` from **evidence-provider rows only**; `FUNCTION_TO_MATERIAL_TYPE.guided_practice → template` | **Not Copy.** Explicitly does not invent practice operands from beats (T-023). Would set `false` for ordinary practice unless providers exist. |
| `lib/page-gam-enrich.js` | `GAM_DLA_OWNED_JSON_FIELDS` | Preservation | Includes `task_material_decision` | GAM must not interpret it. Gate C confirms 1:1 fulfilment. |
| `app.js` | `buildGamV2CopyMaterialAuthoringBrief` | GAM Copy | Honour purpose; specification is binding | **No P01 semantics.** |
| [T-021](S76-T-021-dla-p01-solution-design.md) §C | Design role table | **Not model-visible** | Task input = artefact the learner **works on**; teaching = model; scaffold/workspace = response frame; those last two do **not** satisfy P01 | **Yes — but this table was not copied into the Gate B prompt.** |

### 1.2 What “task input” currently means in production

In **design** (T-021): operand / stimulus — the problem, case, dataset, values, source, or scenario **upon which** the operation is performed.

In **production prompt**: an underspecified “separate task input” that must be commissioned and listed when `separate_inputs_required` is true. The only explicit contrast is “teaching/scaffold still allowed when **false**.”

Therefore current language **does** allow DLA to treat “material used during the task” as equivalent to “the object the learner operates on.” A filled analysis table, worked example, or checklist is used during the task.

---

## 2. A2 / A3 / A4 decision pressure

**Limitation:** live `task_input_material_ids` values are operator-described, not git-captured.

### A2 — Build the Lagrangian

| Role | Reconstruction |
| ---- | -------------- |
| **LEARNER PRODUCTION** | Construct Lagrangians for **new problems**. |
| **OPERAND / STIMULUS** | New optimisation problems (objective functions + constraints) not fully inlined in `learner_task`. |
| **MODEL** | Worked / teaching construction of L. |
| **WORKSPACE** | Analysis table with exemplar + **blank** learner rows. |
| **SCAFFOLD** | Guidance / checklist / checking materials. |
| **Declared P01** | `separate_inputs_required: true` |
| **What DLA listed / commissioned as the “inputs”** | Teaching/modelling/workspace (including the analysis table). **Not** the new problem set. |
| **GAM** | Fulfilled those commissions; did not invent the missing problems. Blank rows have no operands. |

### A3 — Derive Optimal Conditions

| Role | Reconstruction |
| ---- | -------------- |
| **LEARNER PRODUCTION** | Guided first-order-condition calculations on **new** Lagrangian/problem(s). |
| **OPERAND / STIMULUS** | The new Lagrangian / optimisation problem to differentiate. |
| **MODEL** | Worked modelling of FOCs. |
| **WORKSPACE / SCAFFOLD** | Guidance, workspace, checking materials. |
| **Declared P01** | Separate inputs recognised (`true`). |
| **What DLA commissioned as inputs** | Modelling + workspace/checking. **Not** the new problem(s). |
| **GAM** | Did not invent them. |

### A4 — Interpret the Lagrange Multiplier

| Role | Reconstruction |
| ---- | -------------- |
| **LEARNER PRODUCTION** | Interpret λ in context (not construct new L). |
| **OPERAND / STIMULUS** | Two economic **cases** with constraints, multiplier values, contextual observations. |
| **MODEL / WORKSPACE / SCAFFOLD** | May exist additionally; they are not the thing interpreted. |
| **Declared P01** | Cases listed as task inputs. |
| **P02** | Independently judged epistemic evidence; cases as providers. |
| **GAM** | Realised cases without supplying the learner’s interpretation. |

### Contrast

| | A2 / A3 | A4 |
| - | ------- | -- |
| Production verb | Construct / differentiate **new problems** | Interpret **given cases/values** |
| Needed operand type | Practice-problem / Lagrangian statement | Scenario / case particulars |
| Prompt analog | **None** in canonical shape; pack pushes WE + blank table | Canonical shape **is** contrastive cases; P02 language names cases/extracts as providers and tables as scaffolds |
| EP-typical choreography | `apply`: orientation → worked_example → **practice** | `analyse`: orientation → worked_example → **analysis** (scenario then table) |
| Result | `true`, but listed ids are workspace/model | `true`, listed ids **are** the particulars |

---

## 3. Historical practice / workbook pressure

DLA Copy still includes pack `promptTemplate` via `resolveStepPromptText` (`app.js` `buildWorkflowStepInstructions`). GAM Copy **skips** pack; DLA Copy does **not**. These instructions are therefore **MODEL-VISIBLE** on production Copy, not legacy-only.

| Instruction | Location | Classification vs P01 operand closure |
| ----------- | -------- | ------------------------------------- |
| “This step is an **obligation population** step — **translate each episode_plan beat into required_materials**” | Pack DLA `promptTemplate` | **POTENTIALLY COMPETES.** One row per beat, not “commission the operand the production needs.” |
| AS-01: every Required beat has a `required_materials` entry | Pack IFP-05 | **POTENTIALLY COMPETES.** Satisfied by WE + table + checklist without a problem-set row. |
| G1 / DLA-WB-26: every activity **MUST** list a **checklist** | Pack OBLIGATION POPULATION | **NEUTRAL** if not listed as task input; **POTENTIALLY COMPETES** if “must have materials” is taken as P01 satisfaction. |
| G4 / DLA-WB-27 (Analyse): `worked_example`/`modelling_note` **BEFORE** `analysis_table`; table spec requires **≥1 exemplar row or hint column** | Pack OBLIGATION POPULATION | **POTENTIALLY COMPETES / DIRECTLY CONTRADICTS** the residual need. This is the A2 pattern (exemplar + blanks) as a **mandatory Analyse obligation**, without requiring the unseen problems those blanks are for. |
| G5: guided judgement tables with **partial exemplar row** | Pack | **POTENTIALLY COMPETES** (same exemplar+blank grammar). |
| Apply / DLA-WB-23: `worked_example` think-aloud **before independent practice** | Pack | **NEUTRAL to SUPPORTS** modelling; does not require practice **operands**. |
| DLA-WB-06a: session **MUST** include a table/reference type on a **practice-oriented** activity; spec = learner-work columns with judgement cells **left for the learner**; must coexist with DLA-WB-08 worked_example | Pack DLA-WB | **POTENTIALLY COMPETES.** Makes blank-cell tables the default practice artefact. |
| DLA-WB-08: `learner_task` must instruct study of worked example **before practice**; WE+sample_output mandatory early | Pack | **NEUTRAL** for modelling; **POTENTIALLY COMPETES** if practice is then only “blank worksheet.” |
| DLA-WB-18: if task mentions cases/scenarios, require a distinct **scenario** row | Pack | **SUPPORTS P01 for A4-class** particulars. Does **not** fire for “new problems / Lagrangians” unless those words are read as cases. |
| Depth_floor L3 on every R-function material | Pack | **NEUTRAL.** Thickens specs of whatever row exists; does not add missing operand rows. |
| P02: scaffold ≠ evidence provider | Contract | **SUPPORTS** A4; **NEUTRAL** for A2/A3 when `evidence_decision.required` is false. |
| `combined_evidence_workspace`: fixed columns + blank learner columns on the **same** row | Contract | **POTENTIALLY COMPETES** as a pattern (operand+workspace fused). Restricted to P02 providers; still teaches the exemplar/blank-table shape. |
| Non-Copy `FUNCTION_TO_MATERIAL_TYPE.guided_practice → template` | `lib/page-dla-enrich.js` | **NOT MODEL-VISIBLE on Copy.** Documents the same bias on the enrich path. |
| T-021 role table | Design artefact | **SUPPORTS P01** — not in the prompt. |

**Do not remove any of the above.** This section is evidence only.

---

## 4. Shape / example bias

### MODEL-VISIBLE

Canonical DLA shape (`buildCanonicalDlaPageShapeSnippet`):

- `task_input_material_ids` points to **A1-M1**, a **scenario** with evidence_requirement.  
- That is an **A4 analog** (cases as inspectable particulars).  
- There is **no** model-visible example of: practice-problem operand + separate workspace + `evidence_decision.required: false`.

OUTPUT CONTRACT line lists the P01 object with no example row.

### TEST-ONLY (do not enter model context)

| Example | What it shows |
| ------- | ------------- |
| `tests/s76-dla-p01-p02-p03-contract.test.js` “ordinary practice” | Correct **shape**: `true` + id `A1-M3` with purpose “Unseen practice problem set.” **Does not teach the model.** Material type used is `template` — the same type as a workspace — so even the test corpus does not force an operand-specific type. |
| Sprint 72 / S75 fixtures after T-024 migration | Mostly evidence-provider or teaching rows; not a practice-operand teaching example. |
| `tests/s76-dla-commission-shape.js` `deriveTaskMaterialDecision` | If missing, derives P01 from **evidence providers only** (test helper). Same bias as non-Copy enrich. **Test-only.** |

**Finding:** A4 has a stronger analogous **model-visible** example than A2/A3. Tests encode the A2-correct *structure* but cannot pressure live Copy.

---

## 5. EP role

EP must **not** commission materials. The question is whether DLA interprets EP beat vocabulary through older population rules.

Renderer/EP choreography (`lib/learner-renderer-vnext/MODEL_REVIEW.md`; `lib/ld-beat-assignment-compose.js`):

| Typical Lagrangian activity | Likely EP pattern | Beat material salience |
| --------------------------- | ----------------- | ---------------------- |
| A2 / A3 construction & FOCs | **`apply`**: orientation → `worked_example` → **`practice`** | Practice types include `scenario`, `decision_table`, `analysis_table`, `checklist`, `task_card`, `template`. Pack then **requires** a practice table with blank learner cells (DLA-WB-06a) and a preceding WE (DLA-WB-23 / DLA-WB-08). |
| A4 interpretation | **`analyse`**: orientation → `worked_example` → **`analysis`** | Analysis material order is explicitly **`scenario` then `analysis_table`**. Pack G4 reinforces WE-before-table **and** DLA-WB-18 requires a scenario row when cases are mentioned. |

**Assessment:** EP choreography **materially biases** commissioning. It does not force the A2 miss by itself. Combined with pack “one obligation per beat” and “practice = table with blank cells,” `practice` is disproportionately realised as **model + workspace**, while `analysis` already names **scenario/cases** as the first analysis material — the operand A4 needs.

This is **not** an EP schema defect. It is DLA interpreting beat names as material-type recipes.

---

## 6. Validator limit

Current validators **correctly** enforce the **declared** P01 decision:

- object present;  
- true ⇒ at least one listed id that exists on the activity;  
- false ⇒ empty ids;  
- P03 purpose/specification on every row;  
- P02 independent; providers ⊆ listed task inputs.

For Gate C A2/A3 the generated structure **should pass**: `separate_inputs_required: true` and `task_input_material_ids` pointing at real workspace/model rows. There is no check that a listed id is an operand rather than a workspace.

That is why the learner task can lack its operands while capture is green.

**Rejected approach (still rejected):** `learner_task` looks like practice → validator invents a missing material requirement. T-010 principle 8 / T-021 / T-023 / T-024 remain sound: deterministic logic must not reconstruct undeclared dependencies from prose. Gate C does **not** reopen that. The residual is **wrong selection among declared ids**, which a prose heuristic still cannot name reliably (workspace tables also “look like practice”).

**Architectural decision still looks sound.** Closing this residual is a **generative** clarification of what may be listed as a task input, not a new fail-closed wording detector.

T-023’s Lagrangian mapping predicted a different generative miss (`false` + omit the problem row). Gate C produced **`true` + list the workspace**. Same missing operand; different declared shape. Validators were never specified to catch this subclass.

---

## 7. Minimum semantic distinction (diagnostic only)

**Missing / under-emphasised distinction (already in T-021 §C, not in the Gate B prompt):**

| Role | Meaning | May be listed in `task_input_material_ids`? |
| ---- | ------- | ------------------------------------------- |
| **TASK OPERAND / STIMULUS** | Problem, case, dataset, values, source, passage, object, or scenario **upon which** the learner performs the required operation | **Yes** — this is what `true` is for |
| **MODEL** | Shows how | No (may still be commissioned) |
| **WORKSPACE** | Somewhere/structure to do it (including exemplar+blank tables) | No (may still be commissioned) |
| **SCAFFOLD** | Supports / checks the process | No (may still be commissioned) |
| **TEACHING** | Explains what/why | No (may still be commissioned) |

**If this distinction had been explicit in current P01 guidance:** A2/A3’s analysis table / worked example would be obviously **insufficient** as the listed task inputs, while A4’s cases would remain the correct listed inputs. P02 could stay independent (A4 cases may still be evidence; A2 problems need not be).

**Existing schema capability:** `task_material_decision { separate_inputs_required, task_input_material_ids }` **can express the correct answer** (commission a problem-set row; list that id; leave WE/table/checklist unlisted). No new field is **required** to *say* the right thing. A new role enum would only be needed if deterministic logic must **verify** operand-hood — that is a later design choice, not a diagnostic conclusion that the schema is insufficient.

Do not assume a new schema field.

---

## 8. Ranked causal assessment

### PRIMARY — PROMPT GUIDANCE GAP

**Confidence:** HIGH  

**Evidence:** T-021 already defined operand vs teaching vs scaffold/workspace. Gate B implemented a **minimal** commissioning order ([T-023 §H](S76-T-023-dla-p01-p02-p03-implementation-plan.md)) that says “separate task inputs” / “those materials” and mentions teaching/scaffold **only when false**. Unique add was deliberately small (~0.6k). The design distinction never became model-visible. Gate C A2/A3 set `true` (the boolean works) then filled ids with the wrong role (the gloss is missing). A4 succeeds where P02 already states provider ≠ scaffold and the shape example is cases.

**Counter-evidence:** None that the Gate B text defines operand. Pack/EP pressure exists, but would be easier to resist if P01 named the role.

**Implication:** Residual is primarily **under-specified production P01 guidance**, not a failed boolean, not GAM, not missing schema slots.

This subsumes candidate **A (semantic ambiguity in the production contract)**: field names do not carry T-021’s role table. The **accepted design** is not ambiguous; the **shipped prompt** is.

### SECONDARY — HISTORICAL WORKBOOK / OBLIGATION PRESSURE

**Confidence:** HIGH that it biases A2/A3; MEDIUM as independent sufficient cause  

**Evidence:** Pack DLA-WB-06a, G4 exemplar-row tables, beat→obligation population, and Apply WE-before-practice are on Copy. They positively reward WE + blank-cell table as “practice done.”

**Counter-evidence:** A4 is also under those gates and still commissioned cases (DLA-WB-18 / analyse-scenario order help A4). Pressure is selective, not universal.

**Implication:** Clarifying P01 without noticing these competing gates may still lose to “mandatory table with blank cells.” Solution design must **account for** pack competition; this diagnostic does not authorise deleting DLA-WB.

### SECONDARY — SHAPE / EXAMPLE BIAS

**Confidence:** MEDIUM  

**Evidence:** Sole canonical example is A4-like scenario+evidence. No practice-operand example.

**Counter-evidence:** Examples are not the only instruction; a clear commissioning-order gloss could outweigh one JSON snippet.

**Implication:** Any later prompt clarification should not add a large new example block (P04/P05 discipline) unless a **small** A2-shaped contrast is justified.

### SECONDARY — EP INTERACTION

**Confidence:** MEDIUM  

**Evidence:** `apply`/`practice` vs `analyse`/`scenario then table` (§5). Matches A2/A3 vs A4.

**Counter-evidence:** EP does not name material ids. Roman Roads P01-strong shows DLA can choose operands under other choreographies.

**Implication:** Do not change EP. DLA must not treat beat names as a substitute for operand commissioning.

### NOT SUPPORTED AS PRIMARY — SCHEMA INSUFFICIENCY

**Confidence:** HIGH that schema can express the correct commissions  

The object already allows listing a problem-set id and not listing the workspace.

### NOT SUPPORTED — GAM / QA / P04-as-fix

GAM fulfilled commissions. P04 is evidence-audit accretion; it does not add operand-vs-workspace for `required: false` practice. Careless P04 deletion could **weaken A4** (provider ≠ scaffold) without helping A2.

---

## 9. Bounded residual problem statement

**DLA-P01-R1 (operand selection):**

P01 **structural** closure is implemented and Gate C shows DLA can set `separate_inputs_required` correctly. The residual is that DLA does not reliably distinguish **task operands/stimuli** from **models, workspaces, and scaffolds** when selecting `task_input_material_ids` for procedural practice (Lagrangian A2/A3). Interpretation/case activities (A4; Roman Roads) already have prompt analogs and close.

This is distinct from original DLA-P01 (undeclared decision / missing `required_materials` array / omitted object). Validators that close **declared** ids cannot detect this subclass without a new structured role or a rejected prose heuristic.

---

## 10. Solution-design readiness

| | Answer | Note |
| - | ------ | ---- |
| **A. Existing P01 schema sufficient?** | **YES** | Sufficient to *express* the correct commissions. Not sufficient for deterministic *detection* of wrong-role ids without extra structure. |
| **B. Validator change required?** | **NO** (for fail-closed prose / inventing missing rows). **UNCERTAIN** only if a later design adds an explicit role on rows — not required to start prompt/contract clarification. |
| **C. DLA prompt/contract clarification likely required?** | **YES** | Transfer T-021 operand vs model/workspace/scaffold into the commissioning-order / payload gloss. Stay bounded; this is not P04. |
| **D. Would P04 probably fix this accidentally?** | **NO** | P04 targets redundant **evidence** self-audit. A2/A3 are P02-false practice. Do not rely on P04. |
| **E. Solve this residual BEFORE P04?** | **YES** | Sequence: clarify P01 operand selection → then P04, so evidence-prose deletion cannot strip the only existing provider≠scaffold language without a P01 equivalent. Gate C isolation of P01/P02/P03 would be confounded if P04 proceeds first. |

**Not authorised by this artefact:** implementation plan, schema change, pack DLA-WB deletion, validator heuristics, P04, P05, generation.

---

## Verdict

**P01 RESIDUAL READY FOR SOLUTION DESIGN**

Evidence is sufficient to design a bounded P01 operand-selection clarification. Exact Gate C JSON is not in git; that does not block design of the missing semantic gloss. It should be inspected if available when implementing.

*End of S76-T-026. No implementation is authorised.*

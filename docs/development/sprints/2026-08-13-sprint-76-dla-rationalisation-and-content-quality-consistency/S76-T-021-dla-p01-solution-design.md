# S76-T-021 — DLA-P01 solution design

**Task:** S76-T-021  
**Problem:** [DLA-P01](S76-T-010-dla-audit-report.md#7-problem-register) — Task→material closure is not guaranteed  
**Status:** **Solution design complete** (2026-08-13) — not implementation  
**Mode:** DESIGN ONLY — no production code, prompt, schema, validator, test, EP, DLA, GAM, workflow, or Settings changes  
**Diagnostic SSOT:** [S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md)  
**Accepted P02 contract:** [S76-T-020-dla-p02-solution-design.md](S76-T-020-dla-p02-solution-design.md)  
**Sprint:** 76 Phase 2 (P01 only)

This artefact proposes the **task→material closure contract**. It does not rewrite prompts, change validators, or alter schemas.

---

## A. Executive design decision

**PROPOSED TARGET CONTRACT**

A learner-production obligation is **material-closed** when every **separate artefact the learner must have in order to execute that obligation** is an explicit DLA commission in `required_materials[]`, and DLA has recorded which of those commissions are **task inputs** (operands / stimuli) rather than teaching or scaffold.

DLA owns that decision. It is a **generative pedagogical/architectural judgement**, parallel to `evidence_decision.required` but **independent of it**.

The smallest coherent structure that makes this closeable without re-interpreting `learner_task` prose is an activity-level decision object, always present:

```text
task_material_decision: {
  separate_inputs_required: boolean,
  task_input_material_ids: []
}
```

- **`separate_inputs_required: true`** — the production obligation depends on one or more artefacts that are **not fully contained in `learner_task` / `expected_output`**. DLA must commission those artefacts and list their ids.  
- **`separate_inputs_required: false`** — the production obligation is executable from information stated in the task itself, plus any teaching/scaffold materials that are **not** operands. `task_input_material_ids` is empty. This does **not** mean “no materials.”  
- **Deterministic logic** requires the object, closes referential integrity of listed ids against `required_materials[]`, and enforces the true/false shape. It **must not** fail-close because task prose “looks like it needs a problem set.”  
- **GAM** fulfils every `required_materials[]` row, including task-input rows. GAM must not discover or invent missing task inputs.  
- **P02 remains untouched:** practice operands with `evidence_decision.required: false` must still close. Evidence providers with `required: true` are a **subset** of task inputs, not a replacement for them.

Existing `required_materials[]` is necessary but **not sufficient**. An activity can already commission a worked example, table, and checklist while omitting the practice problems the task refers to (Lagrangian A2). Closure therefore needs an explicit **task-input subset**, not merely “some materials exist.”

**DLA-P01 READY FOR IMPLEMENTATION PLANNING**

---

## B. Definition of task→material closure

**PROPOSED TARGET CONTRACT** — durable, cross-disciplinary:

A **material dependency** exists when the learner cannot execute the activity’s production obligation (`learner_task` + `expected_output`) without using an artefact whose content is **not fully stated in that task prose**.

The discriminating question is **executability**, not noun class:

> If this separate artefact were absent, could the learner still do what the task asks, using only the words in the task (and any teaching/scaffold that is not an operand)?

If **no**, DLA has created a commissioning obligation. That artefact must appear in `required_materials[]` **and** in `task_material_decision.task_input_material_ids`.

If **yes**, there is no task-input commissioning obligation. Teaching or scaffold materials may still be commissioned; they are not what this invariant closes.

**CURRENT FACT** (T-010 principle 8): absence of a structured decision cannot be closed by treating free-text phrases (“the following problems”, “the lambda values”) as if they were ids.

**DESIGN INTERPRETATION:** “Closed” therefore means:

> Every separate task-input dependency DLA **declares** is commissioned, and DLA **must declare** whether any such dependency exists. Validators protect that declaration. They do not reconstruct undeclared dependencies from arbitrary prose.

That is the same generative/deterministic split T-020 accepted for evidence. A wrong `separate_inputs_required: false` is a **generative failure**, not a licence for a `taskLooksLikeItNeedsMaterial()` heuristic.

---

## C. Material dependency model

Roles of artefacts relative to a production obligation. These are **roles**, not a growing list of task nouns, and not new `material_type` values.

| Role | What it is | Creates a P01 task-input commission? |
| ---- | ---------- | ------------------------------------ |
| **Inline task information** | Facts, numbers, stems, constraints stated fully in `learner_task` / `expected_output` | **No** — already present in the obligation |
| **Task input / operand / stimulus** | A separate artefact the learner must **work on** to produce the output: practice problems, cases, values, datasets-as-operands, source extracts, scenarios used as the thing to classify or solve | **Yes** |
| **Teaching material** | Worked example, model, exposition the learner studies; not the thing they operate on | **No** for this invariant (may still be commissioned) |
| **Scaffold / workspace** | Template, construction table, checklist, response frame the learner fills | **No** for this invariant (may still be commissioned) |
| **Evidence provider** | Task input whose particulars are **grounds** for inference (P02 `required: true`) | **Yes** — it is a task input **and** a provider |
| **Learner-generated material (this activity)** | The expected output itself | **No** — not a DLA→GAM commission |
| **Upstream learner product** | Artefact produced in an earlier activity and reused | **Not a GAM commission** — see §I; out of P01 expansion |
| **Optional / supporting** | Useful but not necessary for executability | **No** |

**Principle (when DLA must commission):**

> DLA creates a commissioning obligation when it designs a production obligation that depends on **separate generated or supplied content** as an input to that work.

Not commissioned as task input:

- the procedure stated in the task;  
- a worked example used only as a teaching model;  
- a blank table/checklist used only as a response frame;  
- the learner’s own answer.

**Material ≠ epistemic ≠ provenance** (accepted T-020):

```text
Need a separate artefact to execute?     ── P01  ──►  task_material_decision + required_materials[]
        │
        │  if that artefact’s role is grounds for inference
        ▼
Epistemic evidence required?             ── P02  ──►  evidence_decision.required
        │
        ▼
Provenance                               ── only on evidence-provider rows
```

P01 must **not** be solved by marking ordinary practice as evidence.

---

## D. DLA generative ownership

**What pedagogical/architectural question is DLA answering?**

> Given the production obligation I am designing, must the learner work on one or more artefacts whose content is not fully contained in the task prose?

**What DLA must decide and emit (every activity):**

| Decision | Owner | Output |
| -------- | ----- | ------ |
| Whether separate task inputs are required | DLA generative | `task_material_decision.separate_inputs_required` |
| Which artefacts those are | DLA generative | `task_input_material_ids[]` + matching `required_materials[]` rows |
| What `material_type` / identity each has | DLA generative | existing row fields |
| Teaching vs scaffold vs task input | DLA generative | task-input **ids** distinguish operands; remaining rows are teaching/scaffold/other commissions |
| Ordinary vs evidence-provider vs combined workspace | DLA generative | P02 `evidence_decision` + optional `evidence_requirement`; not a substitute for P01 |
| How many / what variation | DLA generative | belongs in `purpose` / `specification` (**P03**), not in the P01 existence invariant |
| Minimum specification GAM needs | DLA generative | **P03** once the row exists |

**Planning order (conceptual; prompt rewrite is implementation, not this task):**

1. What must the learner **produce**? (`expected_output`)  
2. What must they **work on** that is not already in the task? → `separate_inputs_required` + ids  
3. Commission those as `required_materials[]` (and any teaching/scaffold still wanted)  
4. Write `learner_task` so that it refers only to **inline content** or **commissioned task-input ids**  
5. Then decide P02: are any of those task inputs **grounds**?

**Who must not decide this**

- **EP** — choreography (`archetype`, `beats[]`); does not name concrete problems, λ-values, or datasets (T-010 principle 7).  
- **GAM** — fulfils listed commissions; must not invent missing operands.  
- **Deterministic heuristics** reading `learner_task`.

**Where P01 ends and P03 begins**

- P01: the task-input row **exists** and is **listed**.  
- P03: that row’s `purpose` / `specification` are sufficient for GAM to author the intended artefact (count, variation, difficulty, what “a practice problem” means).

A row whose specification is only `"practice"` is **P01-closed and P03-weak**.

---

## E. Deterministic closure ownership

Assuming DLA has emitted `task_material_decision`, application logic may protect **structured consequences**.

### Legitimate closure (PROPOSED TARGET CONTRACT)

- Object present on every activity (partial and full).  
- `separate_inputs_required` is boolean.  
- `task_input_material_ids` is an array of non-empty strings.  
- If `true`: ≥1 id; each id exists on this activity’s `required_materials[]`; ids unique.  
- If `false`: `task_input_material_ids` is empty.  
- `required_materials[]` is always an array (may be empty only when `separate_inputs_required` is false **and** DLA commissions no teaching/scaffold either). Partial DLA today need not emit the array at all (**CURRENT FACT**); the target requires the array so commissions are a closed set.  
- If `evidence_decision.required` is true: every `provider_material_ids` entry is also in `task_input_material_ids` (providers are task inputs).  
- GAM 1:1 against `required_materials[]` remains as today (when a DLA baseline exists).

### Not legitimate (repeats the P02 failure mode)

A validator that scans `learner_task` for “problems”, “the following”, “lambda”, “cases”, “dataset”, “use the table of values”, etc., and fail-closes when `separate_inputs_required` is false.

**Why that would repeat P02:** T-010/T-020 established that lexical “looks like X” is a second generative judge with worse information. Practice/procedure wording already forced carve-outs (`looksLikeProceduralTaskMaterialPractice`, S75-D15). A material-need heuristic would accumulate the same noun lists, disagree with the prompt, and treat teaching mentions (“see the worked example”) as missing operands. **Absence of structure cannot be repaired by interpreting prose as ids** (T-010 principle 8).

Warnings from such heuristics are an implementation-planning hygiene choice. They must not be fail-closed.

### What validators still cannot guarantee

That DLA’s boolean is **pedagogically correct**. A model that writes “solve each practice problem” and sets `separate_inputs_required: false` has failed generatively, exactly as a wrong `evidence_decision.required` fails generatively. Closure protects the **declaration**, not an independent reading of the sentence.

---

## F. Existing mechanism assessment

**CURRENT FACT** unless marked otherwise.

| Mechanism | What it guarantees | Path | Production Copy? | Solves P01? | Influence on target |
| --------- | ------------------ | ---- | ---------------- | ----------- | ------------------- |
| `activities[]` / `learner_task` / `expected_output` | Production obligation in free text | Copy DLA | Yes | **No** — creates the dependency in prose | Remain the obligation; not the closure key |
| `required_materials[]` | Explicit GAM commissions when present | Copy DLA | Yes | **Partial** — existence of *some* rows; not that **task inputs** were commissioned | Keep as the commission set |
| `material_id` / `material_type` / `purpose` / `specification` | Identity and (optional) authoring brief | Copy DLA | Yes | Ids enable referential closure; purpose/spec are **P03** | Ids used by the new decision; spec quality deferred |
| `evidence_decision.provider_material_ids` | Provider referential integrity when `required: true` | Copy + validate | Yes | Only for evidential inputs; A2/A3 with `required: false` slip | Keep; subset of task inputs when true |
| `validateDlaPartialPageCapture` | Envelope; evidence shape **if** rows/decision present; **does not require** `required_materials` | Copy capture | Yes | **No** | Target: require decision object + array presence |
| `validateDlaEnrichedPage` | Non-empty `required_materials` **only when beats exist**; no task-input check | Full page | After merge | **No** for A2/A3/A4 | Keep beat-linked “some materials” only as a weaker floor; not P01 |
| `buildRequiredMaterialsFromPlan` + `FUNCTION_TO_MATERIAL_TYPE` | One row per beat; `guided_practice` / `independent_performance` → **`template`**, not a problem set | `enrichActivityWithDla` | **No** | **No** — beat→type ≠ task→input | Do **not** treat as P01 equivalence. Copy must remain generative commissioning |
| `validatePageBeatMaterialClosure` | Renderer: beats ↔ **GAM `materials[]`**; empty beats **warn**; conflicts fail | Page composition | Downstream | **No** — not DLA task wording; not operand existence | Do not reuse as task→material closure |
| GAM 1:1 material preservation | Fulfil listed ids; no add/remove/mutate when DLA baseline exists | Merge | Yes, if baseline captured | **Prevents repair** of missing P01 rows (correct) | Preserve: GAM must not invent operands |
| Evidence provider closure | `required: true` ⇒ providers exist with `evidence_requirement` | DLA validate | Yes | Specialised additional invariant | Keep; not a replacement for general material closure |
| Pack OBLIGATION POPULATION / DLA-WB / `dla-38l-obligation-check.js` | Prompt-only / harness type checks (e.g. checklist present); 38-L also uses **lexical** title/task tests | Pack / tests; not Copy contract | Pack not on Copy | **No** for Lagrangian A2–A4; lexical title tests are the anti-pattern | Do not promote 38-L type lists to P01 |
| Instructional archetype on material rows | Optional richer planning on a row | Contract | Prompt | P03-adjacent | Out of P01 existence |

**DESIGN INTERPRETATION:** The architecture **cannot** currently know which material dependencies a generative task created without re-interpreting free-text `learner_task`. The missing structured decision is **whether separate task inputs exist, and which commissioned ids they are**.

That is a **small** addition. It is justified because `required_materials[]` already mixes teaching, scaffold, and (sometimes) operands, so “array non-empty” does not mean “operands commissioned.”

---

## G. Known-failure walkthrough — A2 / A3 / A4

Exhibits from [CONTEXT.md](CONTEXT.md) and T-010/T-020. No fresh generation.

### Lagrangian A2 — task refers to practice problems/statements

**CURRENT FACT:** Task asks learners to construct Lagrangians for practice problems / provided statements. DLA commissioned worked example + analysis table + checklist. `evidence_decision.required: false`. No independent practice-problem row. GAM sometimes stuffed extra problems into an existing body (not guaranteed; not licensed).

**What DLA should have commissioned:** a **task-input** row (problem set / statements to operate on), **in addition to** teaching WE and scaffolds.

**Why:** The production obligation is “do the construction **for each** problem.” Those problems are not fully stated as the sole content of `learner_task` in the failing exhibit; they are separate operands. WE is teaching. Table/checklist are scaffolds.

**P02:** `required: false` remains correct (T-020). P01 still requires the problem set.

**How omission becomes detectable without prose inference:**

Correct emission:

- `separate_inputs_required: true`  
- `task_input_material_ids: ["A2-M-problems"]` (illustrative id)  
- that id present on `required_materials[]`

Detectable failures: missing object; `true` with empty ids; listed id with no row.

If DLA instead emits `false` and only WE+scaffolds, validators **accept** it. That is a generative miss (same class as a wrong evidence boolean). It is **not** solved by regex on “practice problem.” Prompt planning order is what makes the correct `true` likely.

### Lagrangian A3 — solve a new optimisation problem

**CURRENT FACT:** Independent solve of a new problem; no corresponding problem row.

**What DLA should have commissioned:** the new problem as a task-input row (unless the entire problem — objective, constraints, numbers — is fully inline in `learner_task`, in which case `separate_inputs_required: false` is correct).

**Why:** A “new” problem whose stem lives outside the task prose is a separate artefact. GAM must not invent it.

**Detectability:** same as A2 — declared id without a row, or `true` with empty ids. Inline-complete A3 is a genuine `false` and needs **no** problem row.

### Lagrangian A4 — work with / interpret λ values or cases

**CURRENT FACT:** Interpretation exercises; no values/cases commissioned. Benchmark **Major**. Independent of T-020’s boolean (T-020: absence is P01 either way).

**What DLA should have commissioned:** the λ values / cases / exercise stems as a task-input row (ordinary if procedure-on-given-λ; **also** an evidence provider if DLA judges interpretation-from-particulars).

**Why:** The learner cannot interpret λ they do not have. Teaching text about the meaning of λ is not a substitute for the cases.

**Detectability:** `separate_inputs_required: true` + case-set id in `required_materials[]`. Provider closure applies **only if** P02 is `true`; P01 applies regardless.

A4 must not be “fixed” by forcing `evidence_decision.required: true` so that provider closure invents a material requirement. That would collapse P01 into P02.

---

## H. Contrasting cases

| Case | Separate task-input commission? | How closure is represented |
| ---- | ------------------------------- | -------------------------- |
| Task contains all required information inline (e.g. one fully stated optimisation stem in `learner_task`) | **No** | `separate_inputs_required: false`; `task_input_material_ids: []`; optional teaching/scaffold rows still allowed |
| Separate generated practice problem(s) | **Yes** | `true` + problem-set id(s) in `required_materials[]` |
| Separate worked example (study/model only) | **No** as task input | Row in `required_materials[]` but **not** in `task_input_material_ids` |
| Dataset used as an operand (compute / apply procedure to these rows) | **Yes** | `true` + dataset id; P02 typically `false` |
| Dataset used as epistemic evidence (infer/diagnose from particulars) | **Yes** | Same P01 listing; **also** `evidence_decision.required: true` and `evidence_requirement` on that row; provider id ⊆ task-input ids |
| Source attachment (conversation excerpt the learner must use) | **Yes** | Commissioned row (GAM excerpts; does not invent). Usually also a provider (`conversation_attachment`) |
| Response template / checklist | **No** as task input | Scaffold row only |
| Material produced by an earlier activity and reused | **Not a GAM commission** | Must **not** appear as a new `required_materials[]` row for GAM to generate. See §I |

Do **not** invent new `material_type` categories for these roles. Existing types (`worked_example`, `template`, `checklist`, `data_table`, `text`, `scenario`, …) remain. Role is expressed by **whether the id is listed as a task input** (and, separately, whether it is a P02 provider).

---

## I. Cross-activity dependencies

**Question:** Can Activity B require an artefact produced by Activity A?

**CURRENT FACT:**

- There is **no** structured field meaning “this activity consumes `A1` expected output / material X.”  
- `intellectual_coherence_bridge` is **cumulative prose** (A2+ carries prior learning into the current demand). Validators only require it distinct from `activity_preamble` when present. It is not an id graph.  
- `required_materials[]` is per-activity GAM commissions. Putting A1’s learner product on A2’s `required_materials[]` would tell **GAM to generate it again**, which is the wrong owner.

**DESIGN INTERPRETATION:**

| Dependency | Represented today? | P01 treatment |
| ---------- | ------------------ | ------------- |
| B needs a **generated/supplied** artefact DLA should author | Same-activity `required_materials[]` | In scope — commission as task input |
| B needs **learner work from A** | Prose only (`learner_task` / bridge) | **Out of P01.** Not a GAM fulfilment. Do not commission it as if GAM should write the learner’s prior answer |

**Bounded residual problem (do not expand P01):** the architecture cannot distinguish “reuse upstream learner product” from “missing commission” in structure. Record as a **separate, later** concern (cross-activity artefact reference). Solving it here would add an activity-graph schema P01 does not need.

Until that exists, DLA should state prior-product reuse **in task prose** and must **not** list those products in `task_input_material_ids` (those ids are GAM commissions only).

---

## J. Schema/design options

### Option 0 — Existing schema is sufficient (prompt only)

**Structure:** No new fields. Strengthen prompt; maybe require `required_materials[]` on partial.

**DLA emits:** Same as today.

**Deterministic validation:** Array present; still cannot tell A2’s missing problems from present WE+checklist.

**Compatibility:** None.

**Prompt:** More commissioning reminders (P04-like accretion risk).

**GAM:** Unchanged; still cannot repair.

**Risks:** A2-class failures remain valid. Rejects T-010 principle 8 in practice (closure still hopes the model remembers).

**Verdict:** **Not viable** as the P01 contract. Existing schema can *host* commissions; it cannot *express* which commissions are the task’s operands.

### Option 1 — `task_material_decision` object (recommended)

**Structure (small addition):**

```text
activities[].task_material_decision = {
  separate_inputs_required: boolean,
  task_input_material_ids: string[]
}
```

Plus: `required_materials[]` always an array.

**DLA emits:** The decision every activity; commissions listed ids.

**Deterministic validation:** Object presence; true/false shape; id ⊆ `required_materials`; P02 providers ⊆ task-input ids.

**Compatibility / migration:** New object. Historical captures without it fail until backfilled or a one-time compatibility default is defined in implementation planning (prefer **require on new Copy**; do not silently treat missing as `false` if that would hide A4).

**Prompt:** Short planning-order block (essential), not a noun list. Must not duplicate a lexical validator.

**GAM:** No schema change. Fulfils all `required_materials` rows. May assume every **declared** task input has a row. Still must not add rows.

**Risks:** Wrong `false` not fail-closed (accepted, P02-parallel). Dual injection will copy any new contract text (P05). Naming collision with `evidence_decision` is manageable if the object is distinct.

### Option 2 — Beat-conditioned non-empty floor

**Structure:** Option 1, plus: if preserved EP beats include `guided_practice` and/or `independent_performance` (and possibly `guided_reasoning`), then `separate_inputs_required` must be true.

**DLA emits:** Same, but some choreographies forbid `false`.

**Deterministic validation:** Uses **structured EP beats**, not `learner_task` prose.

**Compatibility:** Couples P01 to EP function names.

**Prompt:** “Practice/performance beats need an operand artefact.”

**GAM:** Unchanged.

**Risks:** **Over-fire** on inline-complete practice (“solve: maximise … subject to …”, stem fully in `learner_task`). **Under-fire** on A4 if DLA preserved only `explanation` / `verification` beats. T-010 warned beat→material-type is not task→material; a beat→**existence** floor is weaker but still not equivalent. `FUNCTION_TO_MATERIAL_TYPE` already maps those beats to **`template`**, which would not have commissioned A2’s problems.

**Verdict:** **Not the primary contract.** Implementation planning may add a **warning** (not fail-closed) when those beats exist and `separate_inputs_required` is false.

### Options considered and not developed

- `commission_role` enum on every `required_materials` row (`teaching` \| `scaffold` \| `task_input`) — richer, more migration, overlaps P03 modelling. Derivable later from Option 1’s id list.  
- Structured citation tokens in `learner_task` (`{A2-M3}`) — binds prose to ids but is a larger authoring/render change.  
- Making GAM infer missing problems — violates DLA commissions / GAM fulfils.

---

## K. Recommended target design

**Recommend Option 1** — activity-level `task_material_decision` + always-present `required_materials[]` array + referential closure, including `provider_material_ids ⊆ task_input_material_ids` when P02 is true.

**Why this is preferable**

| Against | Why Option 1 wins |
| ------- | ----------------- |
| Option 0 | A2 is the existence proof that “some materials” ≠ “operands commissioned.” Prompt-only repeats the current failure. |
| Option 2 as fail-closed | Over-constrains inline-complete tasks; under-constrains A4-like activities whose beats are not `guided_practice`; mistakes EP choreography for concrete inputs. |
| Role enum / citation tokens | Stronger formal modelling than P01 needs. Option 1 is the P02-shaped minimum: DLA decides; validators close ids. |
| Collapsing into P02 | Forbidden by accepted T-020. Ordinary practice must close with `evidence_decision.required: false`. |

**Operator choice already made in this design:** do **not** fail-close from EP beat names or from `learner_task` wording. If a later implementation plan wants a **warn-only** beat hint, that is compatible and does not change the contract.

No remaining architecture fork is required to proceed to implementation planning.

**Copy vs enrich:** Production Copy remains generative DLA. `buildRequiredMaterialsFromPlan` must **not** be treated as the P01 implementation (it would still emit templates for practice beats). Non-Copy enrich may later *populate* `task_material_decision` only if that path is explicitly redesigned; it must not define product semantics by beat→type.

---

## L. P01 vs P03 boundary

### P01 — closure / existence

**What must be present so the task is executable?**

- The `task_material_decision` object.  
- If `separate_inputs_required: true`, at least one `required_materials[]` row per listed task-input id.  
- Those rows exist as commissions GAM can fulfil (id + type as today).  
- Teaching/scaffold may exist additionally; they do not satisfy a missing operand.

**Examples**

- Missing practice-problem row while `true` lists that id → P01.  
- A3/A4 historical exhibits: no operand row at all → P01 (today they also omit the declaration; after this contract, omitting the object or listing an absent id is the detectable form).

### P03 — commissioning sufficiency

**How well must that material be specified for GAM to produce the intended artefact?**

- Non-empty, usable `purpose` / `specification` (count, variation, difficulty, what the artefact contains).  
- Checklist diagnostic specification already has a DLA/GAM split (out of P01).  
- Ordinary rows today have **no** purpose/spec presence check (**CURRENT FACT**, T-010 P2-E).

**Examples**

- Practice-problem row exists, specification is `"practice"` → P01 holds, **P03** may fail.  
- λ-case row exists but does not say how many cases or which interpretation is expected → P03.

P03 is **not** designed here beyond this cut. Do not fold specification quality into P01 existence checks.

---

## M. Interaction with P02

Accepted T-020: `evidence_decision.required` is epistemic, not material.

| Situation | P01 | P02 |
| --------- | --- | --- |
| Ordinary procedural material, `required: false` | Must still close task inputs (A2/A3) | Boolean stays false; no providers |
| Evidence providers, `required: true` | Those provider ids **are** task inputs; ordinary material closure **and** provider closure both apply | Provider rows carry `evidence_requirement` |
| Provenance set on a provider | Does not establish P01 for *other* missing operands | Honesty claim only on providers |
| Provider closure | Specialised **additional** invariant | Not a replacement for `task_material_decision` |

**Cross-invariant (PROPOSED TARGET CONTRACT):**  
`evidence_decision.required === true` ⇒ `provider_material_ids` is a non-empty subset of `task_input_material_ids`.

A scaffold-only row must not be used as the sole “material” that “closes” an evidential or ordinary operand need.

---

## N. Interaction with GAM

Preserve: **DLA commissions; GAM fulfils.**

Once P01 holds, GAM may assume:

- Every `required_materials[]` id, including every task-input id, is intentional.  
- 1:1 realisation remains the fulfilment contract.  
- Teaching/scaffold/task-input rows are all bodies to author; GAM does not need a new role enum to fulfil.

GAM must **not**:

- Discover missing practice problems, λ-values, or datasets from `learner_task`.  
- Stuff extra operands into an existing worked-example or table body as compensation (A2 accident).  
- Generate “prior learner products” because a later task mentions them.

Do not redesign GAM. Thin-body / spec-fidelity issues remain P03 + existing GAM floor, not P01.

---

## O. Proposed invariants

**PROPOSED TARGET CONTRACT**, not current behaviour. Approximately seven:

1. **A learner-production obligation must not depend on uncommissioned generated or supplied inputs.** Separate artefacts required for executability are DLA commissions in `required_materials[]`.  
2. **DLA owns the decision that a task needs separate task-input material.** That decision is `task_material_decision.separate_inputs_required`, not EP beats, not GAM, and not a prose heuristic.  
3. **When `separate_inputs_required` is true, DLA must list one or more `task_input_material_ids` that exist as `required_materials[]` rows.** When false, that list is empty; teaching and scaffold commissions may still exist.  
4. **`false` does not mean “no materials.”** It means no **separate operands**. Worked examples, templates, and checklists may still be commissioned.  
5. **GAM fulfils explicit commissions and must not repair missing task inputs.** Apparent stuffing of problems into another body is not closure.  
6. **Deterministic validation closes structured declarations** (object presence, true/false shape, id referential integrity, and provider ids ⊆ task-input ids). It must not infer dependencies from arbitrary `learner_task` prose.  
7. **Material closure is independent of epistemic evidence dependence and of provenance.** Ordinary practice with `evidence_decision.required: false` must still close. Provider closure is additional, not a substitute.  
8. **Upstream learner products are not GAM commissions.** Cross-activity reuse is not expressed by adding a `required_materials[]` row for GAM to generate.

---

## P. Risks / unresolved questions

Not blockers for the closure contract:

| Item | Notes |
| ---- | ----- |
| Wrong `separate_inputs_required: false` | Generative residual, same class as wrong P02 boolean. Mitigate with planning-order prompt (implementation), not fail-closed regex. |
| Migration of stored captures without the new object | Implementation planning: require on new Copy; define whether old pages warn or fail. |
| Prompt size / P05 dual injection | Any new essential block will be copied twice on Copy. Keep the block short; do not solve P05 here. |
| Warn-only beat hint | Optional later; must not become Option 2 fail-closed. |
| Cross-activity learner-product graph | Recorded in §I; out of P01. |
| How often live Copy omits rows vs under-specifies them | T-010 unresolved; weights P01 vs P03 empirically; does not change this contract. |
| Non-Copy `buildRequiredMaterialsFromPlan` | Must not silently become the product definition of P01. |

**No operator architecture choice is required** between Option 0 and Option 1: Option 0 is not a coherent P01 contract. Option 2 is rejected as fail-closed.

Risk if P01 is implemented as “guided_practice ⇒ template/problem via `FUNCTION_TO_MATERIAL_TYPE`”: that is the existing enrich mapper and **does not** commission A2/A3 operands.

Risk if P01 is implemented as “treat practice as evidence so provider closure fires”: that violates T-020 and still misses A2 if the boolean stays false.

---

## Q. Implementation readiness verdict

**DLA-P01 READY FOR IMPLEMENTATION PLANNING**

The target closure contract is specified, exhibit-tested (A2/A3/A4 and contrasts), bounded against P02/P03/GAM, and limited to the smallest structured decision that validators can close without prose inference.

This verdict **does not** authorise prompt edits, validator edits, schema changes, or generation. A subsequent implementation-planning task may sequence: (1) add `task_material_decision` to the DLA shape/contract, (2) require it on partial and full validation with referential closure, (3) add a short planning-order instruction, (4) keep GAM 1:1 unchanged, (5) leave P03 purpose/specification presence as a separate authorised step, (6) leave P04/P05 independent.

---

## Appendix — evidence used

| Kind | Source |
| ---- | ------ |
| Diagnostic | [S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md) DLA-P01, §2, §5 P1-A, principles 7–8, §7 |
| Accepted P02 | [S76-T-020-dla-p02-solution-design.md](S76-T-020-dla-p02-solution-design.md) |
| Opening exhibits | [CONTEXT.md](CONTEXT.md) Lagrangian A2/A3/A4 |
| Partial / full DLA validate | `lib/page-dla-enrich.js` `validateDlaPartialPageCapture`, `validateDlaEnrichedPage` (beats ⇒ non-empty `required_materials` only on full) |
| Enrich mapper (non-Copy) | `buildRequiredMaterialsFromPlan`; `FUNCTION_TO_MATERIAL_TYPE` (`guided_practice` / `independent_performance` → `template`) |
| Renderer beat–material | `lib/beat-material-registry.js` `validatePageBeatMaterialClosure` |
| DLA shape | `lib/ld-dla-page-enrich-contract.js` `required_materials[]` example; evidence_decision; no task-input subset today |
| Pack / harness | `lib/dla-38l-obligation-check.js`; workbook obligation population (prompt-only on Copy) |
| Cross-activity | `intellectual_coherence_bridge` in `lib/page-dla-enrich.js` / `lib/ld-self-directed-rhetoric.js` |

*End of S76-T-021. No implementation is authorised by this artefact.*

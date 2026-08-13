# S76-T-022 — DLA-P03 solution design

**Task:** S76-T-022  
**Problem:** [DLA-P03](S76-T-010-dla-audit-report.md#7-problem-register) — Ordinary material commissioning is weakly contracted  
**Status:** **Solution design complete** (2026-08-13) — not implementation  
**Mode:** DESIGN ONLY — no production code, prompt, schema, validator, test, EP, DLA, GAM, workflow, or Settings changes  
**Diagnostic SSOT:** [S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md)  
**Accepted P02:** [S76-T-020-dla-p02-solution-design.md](S76-T-020-dla-p02-solution-design.md)  
**Accepted P01:** [S76-T-021-dla-p01-solution-design.md](S76-T-021-dla-p01-solution-design.md)  
**Sprint:** 76 Phase 2 (P03 only)

This artefact proposes the **ordinary commissioning-sufficiency contract**. It does not rewrite prompts, change validators, or alter schemas.

---

## A. Executive design decision

**PROPOSED TARGET CONTRACT**

A DLA material commission is **sufficient** when GAM can author the intended artefact **without inventing pedagogically significant requirements** that belong to DLA — in particular: what the artefact is for, what it must contain, and the bounds that make the learner task executable and aligned.

Existing fields already express that brief:

| Field | Responsibility |
| ----- | -------------- |
| `material_id` + `material_type` | Identify the artefact |
| `purpose` | Why this artefact exists for this activity (learner use / pedagogical job) |
| `specification` | What GAM must realise: content bounds, not learner-facing prose |

No new schema is required. The defect is that ordinary rows can pass with empty, type-echo, or label-only `purpose` / `specification` (**CURRENT FACT**, T-010 P2-E), while `evidence_requirement.purpose` is already required **when** that object is present.

**DLA owns** the commissioning brief. **GAM owns** faithful authoring within that brief (wording, worked steps, examples inside stated bounds, layout). GAM must not be the place that decides count, variation, operand nature, or pedagogical job because DLA left `"practice"` in the spec.

Deterministic validation may require **presence** of non-empty `purpose` and `specification`, and may reject a specification that is only the `material_type` token. It must **not** judge whether a free-text specification is pedagogically “good enough.”

**DLA-P03 READY FOR IMPLEMENTATION PLANNING**

---

## B. Definition of commissioning sufficiency

**PROPOSED TARGET CONTRACT** — durable, cross-disciplinary:

A commission is sufficient when it tells GAM:

1. **Identity** — which artefact (`material_id`) in which presentation family (`material_type`).  
2. **Pedagogical job** — how the learner is meant to use it (`purpose`).  
3. **Authoring bounds** — what the body must contain or constrain so the production obligation remains executable and aligned (`specification`).

The discriminating question:

> If GAM honoured only this row plus the activity’s `learner_task` / `expected_output`, would it still have to **invent** a requirement that changes what the learner is asked to do, or whether that work is possible?

If **yes**, the commission is P03-weak (or P01-missing, if the row itself is absent).

If **no**, GAM’s remaining work is **elaboration** (choosing stems, numbers, sentences, table cells **inside** the stated bounds).

**Not** a material-type catalogue. Count, variation, difficulty, and domain appear in `specification` **when they are pedagogically load-bearing for that artefact**, not as universal columns.

---

## C. DLA vs GAM authority boundary

**CURRENT FACT:** T-010 architecture — DLA commissions; GAM fulfils 1:1; GAM must not add/remove/mutate `required_materials[]`. Domain artefacts already define `purpose` as “what the material is used for” and `specification` as “what the material should contain” (`domains/learning-design/domain-learning-design-artefacts.md`).

**PROPOSED TARGET CONTRACT**

| Property | Owner | Notes |
| -------- | ----- | ----- |
| `material_id` / `material_type` | **DLA** | Identity. GAM copies type onto the hydrated body. |
| `purpose` (row) | **DLA** | Pedagogical job / learner use. |
| `specification` | **DLA** | Authoring bounds: required content, count/variation **when load-bearing**, constraints, relation to the task / worked example, what **not** to include (e.g. solutions). |
| Learner role / expected action on this artefact | **DLA** (in `purpose` or `specification`; for providers also `evidence_requirement.learner_action`) | GAM does not invent the action. |
| Relationship to `learner_task` / `expected_output` | **DLA** | Spec should make the row usable as the thing the task refers to; GAM does not rewrite the task. |
| Number / count of items | **DLA when it determines executability or intended practice load** | If unspecified, GAM inventing “3 vs 1” is a DLA failure, not a GAM gift. |
| Variation / range / difficulty / domain–topic bounds | **DLA when they distinguish the intended artefact from a generic instance of the type** | GAM chooses instances **inside** those bounds. |
| Progression vs a teaching model (e.g. parallel to WE, not the same numbers) | **DLA** | Load-bearing for A2-class practice. |
| Constraints (no solutions; delayed disclosure; source unit named) | **DLA** | GAM honours. Source-bound naming already lives in purpose/spec/`processing_notes` (**CURRENT FACT**). |
| Surface wording of the body | **GAM** | |
| Worked solution / explanation prose | **GAM** | DLA specifies *what is demonstrated*; GAM writes the walkthrough. |
| Examples / numerical details / case particulars | **GAM within spec bounds** | Inventing the **existence** of cases is P01; inventing **which** numbers given “three mixed-sign λ cases” is GAM. |
| Formatting / layout | **GAM**, except where DLA already binds a form (table columns, checklist diagnostic criteria in spec, `evidence_layout`, `minimum_suitable_form`) | Guided-review *criterion prose* is GAM; DLA owns diagnostic *criteria names* in checklist specification (**CURRENT FACT**, DLA contract). |
| `instructional_archetype` / `archetype_plan` | **DLA, optional** | Only when a Priority-1 archetype genuinely matches. Not a P03 universal. |
| `evidence_requirement.*` | **DLA when P02 is true** | Additional to ordinary purpose/spec, not a replacement. |
| Non-empty `materials[].body` | **GAM** | Fulfilment floor; not a substitute for a missing brief. |

**Principle:** GAM may be creative about **realisation**. GAM may not be creative about **requirements**.

---

## D. Current ordinary material contract

**CURRENT FACT**

| Field | Required today? | Prompt semantics | Validator | GAM consumption | P03 contribution |
| ----- | --------------- | ---------------- | --------- | --------------- | ---------------- |
| `material_id` | Implied by 1:1 GAM merge; not a dedicated ordinary-row presence check on partial DLA | Identity | GAM 1:1 when DLA baseline exists | Must match | Identity only |
| `material_type` / `type` | Prompt/shape; enrich mapper fills on non-Copy | Presentation family | Not a P03 check | Copied to hydrated material | Identity; not a brief |
| `purpose` | Listed on Copy OUTPUT CONTRACT line (`app.js` `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE`) and domain artefacts | “What the material is used for” | **Ordinary: not required.** `evidence_requirement.purpose` required **if** that object exists | Copy brief: “Include purpose when available.” Fallback body helpers in `page-gam-enrich.js` use purpose when generating stubs | **The pedagogical-job field.** Empty ⇒ GAM infers from type + `learner_task` |
| `specification` | Same OUTPUT CONTRACT line; domain artefacts | “What the material should contain”; checklist: 3–4 diagnostic criteria in spec; `depth_floor` / pack OBLIGATION POPULATION are **prompt-only** (T-010) | **Ordinary: not required.** Canonical DLA shape snippet **omits** `specification` (`lib/ld-dla-page-enrich-contract.js`) | **Not named as binding** in `buildGamV2CopyMaterialAuthoringBrief`. Seen only if DLA JSON is in conversation (partial Copy does **not** embed the page). Pack GAM `promptTemplate` *does* anchor on specifications — **not on Copy** | **The authoring-bounds field.** Empty/label-only ⇒ GAM invents content |
| `instructional_function` / `plan_beat_index` | Enrich / population path | Beat trace | Not ordinary Copy required | Not a commission brief | Choreography trace, not P03 |
| `instructional_archetype` + `archetype_plan` | Optional; “ordinary materials must omit” (DLA contract) | Priority-1 pedagogical skeleton | Shape validated **when present** (`validatePageArchetypePlans`) | Copy: compact routing block when selected (`applyLdInstructionalArchetypeRoutingToDraft`) | Enrichment for some teaching materials; **not** universal sufficiency |
| `evidence_requirement` | Optional; required shape if present | P02 provider contract | `validateEvidenceRequirementShape` | Copy: **binding** when present | Extra obligations for providers; does not license empty ordinary purpose/spec |
| `evidence_layout` / combined workspace fields | On provider rows | Layout | Structural when `combined_evidence_workspace` | Binding for those rows | P02 layout, not ordinary P03 |

Partial `validateDlaPartialPageCapture` does not require `required_materials[]` at all. Full validate requires a non-empty array only when beats exist — still no ordinary purpose/spec check.

Pack/rules already *forbid* “activity-level material requirements that are missing purpose/specification” (`domain-learning-design-prompt-rules.md`) — **prompt/policy, not Copy fail-closed**.

Sprint 59 generation-constraint audit: DLA can satisfy with **label-only specifications**; GAM may echo the spec; body depth is not a DLA field-presence problem. That is the same P03 gap, historically observed on scenarios.

---

## E. Existing-field sufficiency

**DESIGN INTERPRETATION:** `purpose` + `specification` can carry the universal commission. They were designed for it. The architecture does not lack columns; it lacks **enforced semantic responsibility**.

**PROPOSED TARGET CONTRACT — field meanings**

**`purpose`** (one short statement):

> What this artefact is *for* in this activity — the learner’s use of it, not a restatement of `material_type`.

Examples of adequate vs inadequate are generative guidance, not regex: “Practice constructing Lagrangians from new objective–constraint pairs” vs `"practice"` or `"template"`.

**`specification`** (authoring brief for GAM):

> What the body must contain or constrain: required content, load-bearing count/variation/difficulty/domain, relation to other materials or to `learner_task`, and explicit exclusions (solutions, focal answers, summary-only source packs).

It is **not** the learner-facing body. It is **not** allowed to be only the type token.

**When a property must appear in specification:** only if omitting it would force GAM to invent a pedagogically significant requirement (count that changes the task, cases the interpretation needs, “parallel to the worked example”, named source unit, diagnostic criteria for a checklist).

**Not required as new fields:** `count`, `variation`, `difficulty`, `learner_action` on ordinary rows. Those are specification *content* when needed. Copying `evidence_requirement` onto every row would over-structure teaching notes and scaffolds.

**Canonical shape gap:** the DLA partial shape example currently shows `purpose` and `evidence_requirement` but **no** `specification`. Implementation should restore `specification` on the ordinary example. That is a contract-snippet fix, not a schema expansion.

---

## F. Deterministic validation boundary

Respect T-010/T-020/T-021: generative stages decide; validators close structured consequences.

### Legitimate fail-closed (PROPOSED TARGET CONTRACT)

On every `required_materials[]` row (partial and full, once a row exists):

1. `purpose` is a non-empty string.  
2. `specification` is a non-empty string.  
3. After trim/case-fold/underscore–space normalisation, `specification` is **not identical** to `material_type` / `type`.  
4. Optionally the same type-echo ban on `purpose` (same class of check).  
5. P01 closure (when implemented) and P02 provider shape (already) remain **additional**, not substitutes.

### Generative quality (not fail-closed)

Whether the specification actually states count, variation, parallel-to-WE, or enough domain bound. A validator cannot reliably decide that `"Three new equality-constrained problems, distinct from the worked example, no solutions"` is better than a slightly thinner but still usable brief without becoming a second pedagogical judge.

### Warn-only (implementation hygiene, not this contract’s core)

- `purpose` equals `specification` (possible laziness, sometimes legitimate).  
- Very short specification (character floor would punish valid “One fully stated linear programme: …” or duplicate inline-task confirmations).  
- Beat-type mismatches.

### Inappropriate

- Noun lists (“must contain the word problem/case/lambda”).  
- Type-specific regex catalogues (scenario ≥2 named cases, etc.).  
- Inferring missing bounds from `learner_task` (P01/P02 failure mode).  
- Word-count floors on specification as a proxy for sufficiency (Sprint 59 already showed spec length ≠ body quality).

**Conservative rule:** presence + not-a-type-token is the structural floor. Sufficiency of *content* remains DLA generative responsibility, now with a defined meaning of the two fields.

---

## G. GAM consumption / compensation analysis

**CURRENT FACT**

Production Copy GAM (`isGamPageEnrichmentV2CopyStep`):

- Authoring brief: 1:1 ids; include **purpose when available**; **`evidence_requirement` binding**; provenance honesty. **`specification` is not named.**  
- Full GAM contract block is also injected (`buildGamV2CopilotSchemaInstructions`): evidence fulfilment is binding; ordinary spec still not singled out.  
- Partial Copy **does not embed** the DLA page; GAM is told to use Copilot conversation context.  
- Non-partial path can embed DLA JSON (`buildUpstreamDlaPageEmbedSectionForGamCopy`).  
- Pack `promptTemplate` (“Anchor on required_materials, learner_task, and expected_output”) and GAM-PRES / full depth module are **not** the Copy path (T-010).  
- Fulfilment validators: non-empty body + format; guided-review JSON shape. No spec-fidelity check.  
- `page-gam-enrich.js` fallback title/body helpers substitute default sentences from type when purpose is empty — **compensation for weak commissions on non-Copy/enrich helpers**, not licensed product behaviour for Copy.

**DESIGN INTERPRETATION**

| Situation | Legitimate GAM elaboration | Forced invention (P03 failure) |
| --------- | -------------------------- | ------------------------------ |
| Spec: three new problems, distinct from WE, equality constraints, no solutions | Actual objectives, numbers, wording | — |
| Spec: `"practice"` or missing | — | Count, difficulty, whether solutions appear, whether stems duplicate the WE |
| Strong `learner_task` + empty spec | GAM may *guess* from the task | Guessing is compensation; 1:1 still cannot add a missing P01 row; stuffing problems into a WE body is the A2 accident |
| `evidence_requirement` present, ordinary spec empty | Provider fields bound inspectability | Still may under-bound count/variation of ordinary (non-provider) rows in the same activity |
| Checklist spec lists diagnostic criteria | GAM writes criterion prose / guided-review JSON | Inventing which qualities to check if spec is `"checklist"` |

**What GAM should be entitled to assume once P03 holds**

- Every row has a pedagogical job (`purpose`) and authoring bounds (`specification`).  
- Honour **specification as binding** for content bounds, parallel to today’s `evidence_requirement` binding.  
- Use `learner_task` / `expected_output` as activity context, not as a licence to invent missing bounds.  
- Elaboration inside the brief remains GAM’s job.

Do not redesign GAM. A small Copy-brief clarification (specification is binding) is an implementation consequence, not a GAM architecture change.

---

## H. Known-exhibit walkthrough — A2 / A3 / A4

Assume P01 has commissioned the missing task-input row. P02 boolean is independent (T-020: A2/A3 typically `false`; A4 either way still needs cases).

### A2 — practice optimisation statements/problems

**What DLA must specify** so GAM knows what to create (not a type catalogue — load-bearing bounds for this exhibit):

- **Nature:** new objective–constraint **statements/problems** the learner constructs Lagrangians for (operands, not the WE).  
- **Count:** a definite practice load (e.g. two or three). Unspecified count is GAM inventing the activity’s size.  
- **Relation to WE:** distinct stems from the worked example (parallel construction, not the same numbers).  
- **Learner action:** construct / complete the Lagrangian for each (may live in `purpose`).  
- **Exclusion:** do not include completed Lagrangians if the learner must produce them (`expected_output`).

Difficulty/variation only if DLA intends a spread (one slack, one with two variables, etc.). If omitted, GAM may choose similar difficulty — that is elaboration, provided count and distinctness are stated.

`"practice"` or `"guided practice"` is P03-weak even with a P01 row.

### A3 — new optimisation problem

Sufficient vs `"new problem"`:

- **Count:** one independent problem (unless DLA wants more).  
- **Nature:** solvable by the taught method (equality-constrained optimisation / Lagrangian), with an explicit objective and constraint **in the material** (because it is the task input, not inline).  
- **Independence:** not a copy of A2 stems.  
- **Exclusion:** solution not pre-filled if the learner must solve it.

GAM invents the actual function and numbers **inside** those bounds.

### A4 — lambda cases/values

Sufficient commission (ordinary, whether or not P02 is true):

- **Nature:** numerical cases or (x, λ) / constraint-status items the interpretation exercises need.  
- **Count / coverage:** enough cases to support the intended action (e.g. mixed signs, tight vs non-tight — **only if** that coverage is part of the designed task).  
- **Learner action:** interpret / compute meaning of λ (in `purpose`).  
- **Exclusion:** do not pre-state the interpretation the learner must give if delayed disclosure applies (P02 adds this formally when `true`; ordinary spec may still say “do not include the shadow-price conclusion”).

P02 `true` additionally requires `evidence_requirement` (observable features, provenance). That does **not** replace the ordinary spec: provider fields do not by themselves say “four λ values with mixed tightness.”

---

## I. Contrasting material roles

Same two fields; different typical **content** of `specification`. No per-type schema.

| Role | `purpose` answers | `specification` typically bounds | GAM elaborates |
| ---- | ----------------- | -------------------------------- | -------------- |
| Worked example | Model the procedure/concept | What is demonstrated; analogous vs focal; include/exclude solution | Walkthrough wording, numbers |
| Practice problem set | Operand for production | Count, distinctness from WE, method constraints, no solutions | Actual stems |
| Dataset as operand | Data to compute/apply on | Shape, variables, size, no answer key | Cell values inside shape |
| Dataset as evidence | Particulars as grounds | Same ordinary bounds **plus** P02 provider fields | Values that remain inspectable |
| Historical / source extract | Source the task uses | Named unit; inspectable excerpt not summary pack | Selection/ellipsis honesty (source-bound rules) |
| Scenario / case set | Cases to classify/diagnose | Count, contrast, what each case must make observable | Narrative details |
| Checklist | Verification | Diagnostic criteria (3–4) in spec — **CURRENT FACT** | Learner-facing criterion prose / JSON |
| Response template / table | Scaffold to complete | Columns/rows/blank vs fixed | Markdown/pipe realisation |
| Conceptual teaching note | Explain X before doing Y | Concepts that must be covered; not the practice operands | Exposition wording |
| Combined evidence workspace | Provider + response in one artefact | Ordinary spec **and** `fixed_observation_fields` / `learner_response_fields` | Cell content; keep response columns blank |

Teaching/scaffold rows still need purpose + specification. P01 does not list them as task inputs; P03 still applies so GAM does not emit an empty “template” stub.

---

## J. Evidence-requirement comparison

**CURRENT FACT:** Provider rows require `kind`, `purpose`, `learner_action`, `observable_features`; optional provenance, layout, processing notes, disclosure.

**What this teaches**

| Information | Universal ordinary commission? | Evidence-specific? |
| ----------- | ------------------------------ | ------------------ |
| Why the artefact exists | **Yes** → row `purpose` | Provider `purpose` restates *epistemic* why |
| What GAM must put in the body | **Yes** → `specification` | `observable_features` / `minimum_suitable_form` further constrain inspectability |
| What the learner does with it | Often in row `purpose` | **Required** as `learner_action` because the epistemic act is the P02 decision |
| Provenance / simulation honesty / source-bound | No | **Yes** |
| Delayed disclosure | Sometimes an ordinary exclusion in spec | **Yes**, first-class |
| Combined workspace columns | No | **Yes** |

**Do not** copy `evidence_requirement` onto every material. Ordinary rows need the **universal pair** (purpose + specification). Provider rows need that pair **and** the evidence object. Implementation should not treat a filled `evidence_requirement` as a waiver of row `specification` (count/variation of cases can still be missing from provider fields).

---

## K. instructional_archetype assessment

**CURRENT FACT**

- DLA contract: emit `instructional_archetype` + complete `archetype_plan` only when a Priority-1 job matches (`mechanism_explanation`, `process_walkthrough`, `mental_model_building`, `evaluation_judgement`). **Ordinary materials must omit them.** `material_type` is presentation; archetype is pedagogical function.  
- Validators check plan **shape when present**, not whether an ordinary row should have had an archetype.  
- GAM Copy receives a **compact routing block** only for selected materials (`lib/ld-instructional-archetype.js`). Empty selection adds no prompt.  
- Intended as planning skeleton for specific teaching jobs (Sprint 60/61), not as the general DLA→GAM brief.

**DESIGN INTERPRETATION:** Useful **optional enrichment** for matching teaching materials. **Not** required for P03. **Not** a substitute for purpose/specification on practice operands, datasets, or checklists. Do not expand its role to close Lagrangian A2–A4 (those are problem/case commissions, not Priority-1 archetype plans).

---

## L. Combined P01 / P02 / P03 model

**PROPOSED TARGET CONTRACT** composed with accepted T-020 / T-021:

```text
Activity production obligation (learner_task + expected_output)
        │
        ▼
P01  task_material_decision
     separate inputs? which required_materials ids?
        │
        ▼
     required_materials[]   ← every commissioned artefact (teaching, scaffold, task input)
        │
        ▼
P03  each row: purpose + specification sufficient as a GAM brief
        │
        ├── P02 false: stop (ordinary commission only)
        │
        └── P02 true: those task-input ids that are grounds
              evidence_decision + evidence_requirement (+ provenance/layout)
        │
        ▼
GAM fulfils exactly the commissioned rows (1:1); elaborates inside P03 bounds
```

Explicit:

- **P01-present, P03-weak:** problem-set row exists and is listed as a task input; specification is `"practice"`.  
- **P03-sufficient, P02-false:** A2 practice problems fully specified; no `evidence_requirement`.  
- **Evidence providers:** must satisfy P01 (they are task inputs), P03 (ordinary purpose/spec), **and** P02 (provider object).  
- **Teaching/scaffold:** P03 applies; P01 task-input list may omit them; P02 must not attach `evidence_requirement` if `required: false`.

---

## M. Prompt responsibility classification

Do **not** rewrite the DLA prompt in this task. Minimum generative guidance P03 needs later:

**ESSENTIAL**

- `purpose` = pedagogical job / learner use; not the type token.  
- `specification` = GAM authoring bounds (content, load-bearing count/variation/constraints/exclusions/relation to task or WE).  
- Honour the DLA/GAM split: spec is not body prose; checklist spec = diagnostic criteria, GAM writes criterion copy.  
- Planning order already proposed in T-021: production → task inputs (P01) → commission rows with purpose/spec (P03) → evidence boolean (P02).

**USEFUL BUT CONSOLIDATABLE**

- Checklist 3–4 criteria (keep as the one type-specific essential; do not grow a per-type catalogue).  
- Source-bound: name the unit in purpose/spec/`processing_notes` (already present).  
- Domain-artefact / pack “missing purpose/specification” forbid list.  
- OUTPUT CONTRACT already *lists* the two fields.

**DETERMINISTIC CONSEQUENCE** (state once; validators enforce)

- Both fields non-empty on every row.  
- Specification (and purpose) must not be only `material_type`.

**HISTORICAL/DEFENSIVE**

- `depth_floor` tokens in specification as a substitute for stating bounds.  
- Pack OBLIGATION POPULATION / DLA-WB type lists as if they were Copy P03.  
- Another PRE-EMIT self-audit restating “did you write a good spec?” (P04 anti-pattern).

Avoid a new self-audit stack. One short essential pair of meanings is enough.

---

## N. Validator consequences

Do not implement here. Eventual structural checks:

| Check | Fail-closed? |
| ----- | ------------ |
| Each `required_materials[]` row has non-empty `purpose` | **Yes** |
| Each row has non-empty `specification` | **Yes** |
| Specification ≠ type token (normalised) | **Yes** |
| Purpose ≠ type token (normalised) | **Yes** (same class) |
| P01 / P02 referential invariants | Separate, already designed / existing |
| Specification “contains count / variation / quality” | **No** |
| Spec word-count or `depth_floor` presence | **No** |
| Type-specific content regex | **No** |

If a quality check cannot be deterministic, it stays generative (prompt meaning of the two fields). GAM body non-empty remains a fulfilment floor, not P03.

---

## O. Schema/design options

### Option A — Strengthen existing `purpose` + `specification` (recommended)

**Expressive sufficiency:** Yes, as the universal brief. Load-bearing count/variation live in specification prose when needed.  
**Migration:** Existing rows that already fill both are compatible; empty/type-echo rows fail new presence checks.  
**Prompt cost:** Short essential semantics; restore `specification` on the canonical shape example. Dual injection (P05) will copy that text twice — keep it small.  
**Validator capability:** Presence + type-echo ban.  
**GAM impact:** Treat specification as binding on Copy (parity with `evidence_requirement`). No GAM redesign.  
**Complexity:** Lowest.  
**P01/P02:** Independent; purpose/spec apply to all rows including task inputs and providers.

### Option B — Small structured addition (e.g. `count`, `variation`, `learner_action` on every row)

**Expressive sufficiency:** Stronger for problem sets; **vacuous or forced** for teaching notes, checklists, single extracts. Reintroduces a type catalogue.  
**Migration:** New required fields or many nulls.  
**Prompt/validator:** More surface; validators still cannot judge whether `count: 3` is pedagogically right.  
**GAM:** Slightly easier to parse numbers; not required given specification prose.  
**Complexity:** Unjustified for P03. Overlaps P02 `learner_action` if copied universally.

**Option 0 (prompt-only, no presence checks):** Repeats T-010: pack already asks for purpose/spec; Copy still accepts empty. **Not viable.**

---

## P. Recommended target design

**Option A.**

Why: the repository already named these two fields as the DLA→GAM brief. Evidence_requirement shows that **extra structure is for extra obligations**, not for ordinary existence of a brief. Structured count/variation fields would not close A4 better than a specification that states the cases’ job, and would pollute materials that have no count.

Implementation consequences (not authorised now): (1) define the two field meanings in the DLA contract, (2) require them on ordinary rows, (3) type-echo ban, (4) GAM Copy: specification binding, (5) do not add schema, (6) do not expand `instructional_archetype`.

---

## Q. Proposed invariants

**PROPOSED TARGET CONTRACT**

1. **Every DLA `required_materials[]` row is a GAM brief, not a type label.** It identifies the artefact and states its pedagogical job and authoring bounds.  
2. **`purpose` states why the learner needs this artefact in this activity.** It is not `material_type` and not the body.  
3. **`specification` states what GAM must realise** — required content and load-bearing bounds (count, variation, constraints, exclusions, relation to the task or to other materials) **when omitting them would force GAM to invent a pedagogical requirement.**  
4. **GAM elaborates realisation inside the brief and must not invent the brief.** Surface wording, instances within bounds, and layout are GAM; count/job/operand nature/exclusions are DLA.  
5. **Deterministic validation may require non-empty `purpose` and `specification` and reject type-token echoes.** It must not fail-close by judging specification quality from semantic heuristics.  
6. **P03 applies to every commissioned row**, including teaching, scaffold, task inputs (P01), and evidence providers (P02). Provider richness is additional, not a waiver of the ordinary brief.  
7. **`instructional_archetype` remains optional enrichment** for matching Priority-1 teaching jobs. It is not the general sufficiency contract.  
8. **A P01-present row can still be P03-weak; a P03-sufficient row can still be P02-false.** Missing row is P01; `"practice"` spec is P03; epistemic role is P02.

---

## R. Implementation-planning consequences

Likely surfaces (when authorised — **not** this task):

| Surface | P03 touch |
| ------- | --------- |
| `lib/ld-dla-page-enrich-contract.js` | Field meanings; put `specification` on the canonical shape; short essential block |
| `lib/page-dla-enrich.js` | Presence + type-echo on partial and full validate |
| `app.js` OUTPUT CONTRACT line | Already lists the fields; may need “required” wording |
| `app.js` `buildGamV2CopyMaterialAuthoringBrief` | Specification binding (small) |
| Tests | Ordinary-row presence; type-echo; provider rows still need both ordinary + evidence fields |
| Pack / `domain-learning-design-prompt-rules.md` | Already aligned; do not treat pack as Copy enforcement |
| Non-Copy `buildRequiredMaterialsFromPlan` | Must not become the product definition; enrich stubs that copy beat purpose into spec would fail a “not equal to type” check but might still be P03-weak — out of Copy scope |

**Coordinated P01 + P02 + P03 implementation plan: yes, safer than three isolated plans.**

They share the same DLA contract block, the same `validateDlaPartialPageCapture` / `validateDlaEnrichedPage` functions, the same `required_materials[]` shape, and GAM’s consumption of those rows. T-021’s planning order is a **single** prompt sequence (inputs → commissions with purpose/spec → evidence boolean). Isolated passes would thrash those files three times and, because of P05 dual injection, amplify three successive appends.

P04 remains **after** P02 (and should absorb P03’s short essential text rather than adding a fourth audit). P05 remains independent assembly hygiene.

One implementation-planning task should therefore sequence P01 (new decision object), P02 (stop prose fail-closed; keep provider closure), and P03 (purpose/spec presence + meanings + GAM spec binding) as **one** DLA/GAM contract change-set, with tests covering the composed model in §L.

---

## S. Risks / unresolved questions

Not blockers for this contract:

| Item | Notes |
| ---- | ----- |
| Live frequency of empty vs label-only specs | T-010 unresolved; contract is the same either way |
| Partial Copy without DLA embed | GAM depends on conversation JSON; binding language in the brief still matters |
| `purpose === specification` | Warn-only candidate; do not fail-close |
| Enrich-path stub specs | Do not let `materialPurposeForBeat` define product P03 |
| P05 amplification | Keep the essential block short |
| Over-specifying (DLA writing the body into specification) | Prompt meaning: bounds, not prose; generative residual |
| Checklist criteria count | Keep prompt-essential; not a regex validator |

No operator architecture fork: Option B is rejected; Option A is the target.

Risk if P03 is implemented as type-specific specification schemas: catalogue accretion, same failure mode as P02 noun lists.

Risk if P03 is implemented as GAM depth floors only: leaves DLA free to emit `"practice"` and blames fulfilment — T-010 already assigned ownership to DLA.

---

## T. Implementation readiness verdict

**DLA-P03 READY FOR IMPLEMENTATION PLANNING**

The sufficiency contract is specified, schema-compatible (existing `purpose` / `specification`), bounded against P01/P02/GAM, exhibit-tested, and conservative on deterministic checks.

This verdict **does not** authorise prompt edits, validator edits, or schema changes. Together with T-020 and T-021, the three semantic contracts are ready to be implementation-planned **as one coordinated DLA→GAM change-set**.

---

## Appendix — evidence used

| Kind | Source |
| ---- | ------ |
| Diagnostic | [S76-T-010](S76-T-010-dla-audit-report.md) P2-E, DLA-P03, GAM floor |
| P01 / P02 | [S76-T-021](S76-T-021-dla-p01-solution-design.md) §L; [S76-T-020](S76-T-020-dla-p02-solution-design.md) |
| Domain field meanings | `domains/learning-design/domain-learning-design-artefacts.md`; prompt-rules forbid missing purpose/specification |
| DLA contract / shape | `lib/ld-dla-page-enrich-contract.js` (shape omits specification; checklist spec; ordinary materials omit archetype) |
| DLA validate | `lib/page-dla-enrich.js` ordinary rows vs `validateEvidenceRequirementShape` |
| Copy OUTPUT CONTRACT | `app.js` `LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE` |
| GAM Copy | `buildGamV2CopyMaterialAuthoringBrief`; `buildGamV2CopilotSchemaInstructions`; partial non-embed |
| GAM validate / helpers | `lib/page-gam-enrich.js` `pushMaterialBodyAndFormatErrors`; purpose fallbacks |
| Archetype | `lib/ld-instructional-archetype.js`; DLA contract Priority-1; Copy routing |
| Historical thin-spec | Sprint 59 `GENERATION-CONSTRAINT-AUDIT.md` label-only specifications |
| Exhibits | CONTEXT / T-010 Lagrangian A2/A3/A4 |

*End of S76-T-022. No implementation is authorised by this artefact.*

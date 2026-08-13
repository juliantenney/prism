# S76-T-020 — DLA-P02 solution design

**Task:** S76-T-020  
**Problem:** [DLA-P02](S76-T-010-dla-audit-report.md#7-problem-register) — Evidence dependence is re-inferred from task wording; prompt and validator disagree on procedural/practice material  
**Status:** **Solution design complete** (2026-08-13) — not implementation  
**Mode:** DESIGN ONLY — no production code, prompt, schema, validator, test, EP, DLA, GAM, workflow, or Settings changes  
**Diagnostic SSOT:** [S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md)  
**Sprint:** 76 Phase 2 (P02 only)

This artefact proposes the **semantic truth** for `evidence_decision.required`. It does not rewrite prompts, remove heuristics, or change validators.

---

## A. Executive design decision

**PROPOSED TARGET CONTRACT**

`evidence_decision.required` records a **generative pedagogical decision**:

> Does this activity’s learner-production obligation require inspecting **particulars as grounds for an inference, interpretation, comparison, diagnosis, or substantiation**?

It does **not** record whether material exists, whether material was supplied/generated, or where material came from.

- **DLA owns the boolean.**  
- **When `true`:** DLA must name genuine evidence-provider rows (`provider_material_ids`) that carry `evidence_requirement` (including provenance).  
- **When `false`:** DLA must not attach `evidence_requirement` or providers. `false` does **not** mean “no material required.”  
- **Deterministic logic** may require the decision object, close provider referential integrity, and check shape. It **must not** fail-close because task prose “looks evidential.”  
- Existing `evidence_decision` / `evidence_requirement` **shapes are sufficient**. No schema expansion is required for P02.  
- Sprint 72 evidence-product behaviours (providers, provenance, simulation honesty, inspectability, delayed disclosure, source-bound handling) **survive**. P02 is not evidence rollback.

**DLA-P02 READY FOR IMPLEMENTATION PLANNING**

---

## B. Definition of epistemic evidence dependence

**PROPOSED TARGET CONTRACT** — durable, cross-disciplinary:

**`evidence_decision.required: true`** means:

The learner cannot complete the activity’s production obligation without inspecting **particulars** (observations, values, extracts, features, conditions, cases-as-data) **as grounds** for a conclusion they must reach — infer, judge, compare-as-evaluation, interpret-from-particulars, diagnose, or substantiate.

**`evidence_decision.required: false`** means:

The production obligation does **not** require that epistemic use of particulars. The learner may still need materials, examples, problems, tables, simulations, or checklists.

The discriminating question is **epistemic role**, not noun class:

| Role of the material | Typical `required` |
| -------------------- | ------------------ |
| **Grounds** — particulars from which the learner must derive a conclusion | `true` |
| **Operand / given** — inputs to a taught procedure (construct, apply, solve, calculate, complete) | `false` |
| **Model / teaching** — worked example, modelling note, weak/strong instructional contrast | `false` |
| **Scaffold** — response table, template, checklist used to organise the learner’s own work | `false` (unless that same object is also the evidence provider via `combined_evidence_workspace`) |

Words such as *interpret*, *compare*, *example*, *case*, *data*, *supplied*, and *provided* **do not decide the boolean**. Those words appear in both roles.

This is a **principle**, not a lexical exception list. DLA applies it to the intended pedagogy of the activity it is designing.

### Conceptual tests (not a taxonomy)

| Activity kind | Typical judgement |
| ------------- | ----------------- |
| Source / document analysis | `true` — wording, form, claims are grounds |
| Dataset interpretation | `true` — observed values/patterns are grounds |
| Case analysis (judge from case particulars) | `true` |
| Image / artefact inspection | `true` when features must be read as grounds |
| Comparing supplied **sources/extracts** to evaluate a claim | `true` |
| Comparing a **worked construction** to the original statement to check a procedure | `false` |
| Worked example used to teach a method | `false` |
| Practice problems / construct–apply–solve | `false` (material may still be required) |
| Learner-generated material | `false` unless later activities treat that product as inspectable evidence |
| Simulation | Provenance, not the boolean. Simulated **evidence** ⇒ `true` + `system_generated_simulation`. Simulated **practice numbers** used as operands ⇒ `false` |
| Diagnostic / checklist | Usually `false` (verification scaffold). `true` only if the checklist *is* the evidence provider, which it almost never is |
| Supplied reference / formula sheet | `false` if used as a tool; `true` only if the reference *text* is what must be interpreted as grounds |

---

## C. Material vs evidence vs provenance

**CURRENT FACT** (schema can already represent this; T-010 §4):

| Dimension | Question | Primary fields | Collapsing it into another dimension is the P02 defect |
| --------- | -------- | -------------- | ----------------------------------------------------- |
| **Material requirement** | Does the learner need an artefact to perform the task? | `required_materials[]` | Treating “supplied problem/example/table” as evidence |
| **Epistemic evidence dependence** | Must the learner inspect particulars **as grounds**? | `evidence_decision.required` (+ providers / `evidence_requirement` when true) | Treating `required: false` as “no materials” |
| **Provenance / authenticity** | Where did provider material come from, and what honesty claim applies? | `evidence_requirement.provenance` (`system_generated_simulation` \| `conversation_attachment`) | Treating “generated” as “not evidence” or “attached” as automatically evidential |

**Relationships (PROPOSED TARGET CONTRACT):**

```text
Material required?     ── independent ──►  required_materials[]  (DLA-P01 / P03)
        │
        │  if the material’s role is grounds for inference
        ▼
Epistemic required?    ── evidence_decision.required
        │
        │  if true
        ▼
Providers + evidence_requirement
        │
        ▼
Provenance             ── only on evidence-provider rows
```

Ordinary generated practice:

- material required = **yes**  
- epistemic evidence = **no**  
- provenance field = **absent** (not a provider)

Simulated residual table used to diagnose heteroscedasticity:

- material required = **yes**  
- epistemic evidence = **yes**  
- provenance = `system_generated_simulation`

Roman Roads source extract used to support a historical claim:

- material required = **yes**  
- epistemic evidence = **yes**  
- provenance = `conversation_attachment`

---

## D. Generative ownership

**What pedagogical question is DLA answering?**

> Given the learner_task and expected_output I am designing, must the learner inspect particulars as **grounds for a conclusion**, or only use materials as procedure operands, teaching models, or scaffolds?

**What information does DLA have?**

- Brief, attachments, EP beats (choreography, not this boolean).  
- The activity it is itself writing: `learner_task`, `expected_output`, intended materials.  
- Optional Copilot attachments (source-use planning).  
EP does **not** emit `evidence_decision` (**CURRENT FACT**).

**Is the boolean sufficient?**

**Yes** for the dependence decision. Additional structure is **consequent**, not a second boolean:

| When | DLA must additionally specify |
| ---- | ----------------------------- |
| `true` | ≥1 `provider_material_ids`; those rows exist in `required_materials`; each has `evidence_requirement` (`kind`, `purpose`, `learner_action`, `observable_features`; provenance when honesty matters; layout fields when combined workspace). Teaching/scaffolds remain separate rows unless `combined_evidence_workspace`. |
| `false` | Empty `provider_material_ids`; **no** `evidence_requirement` on any row. Still commission whatever **materials** the task needs (P01/P03). `reason` should state the epistemic judgement (procedure / teaching / scaffold), not “no materials.” |

**What `false` explicitly does *not* mean**

- No `required_materials`.  
- No examples, cases, tables, numbers, or simulations.  
- No “supplied” or “provided” wording.  
- The task is easy, non-analytical, or non-STEM.  
- Provenance is generated.

**Who must not decide this**

- EP.  
- GAM (fulfils commissioned providers; does not set the boolean).  
- Deterministic heuristics reading task prose.

---

## E. Deterministic ownership

Assuming DLA has set the boolean, application logic may **protect structured consequences**.

### If `required: true` — legitimate closure

**CURRENT FACT** already implemented in `validateEvidenceDecisionClosure` (`lib/page-dla-enrich.js`):

- `evidence_decision` is an object; `required` is boolean; `reason` non-empty; `provider_material_ids` is an array of non-empty strings.  
- ≥1 provider id.  
- Each id exists on `required_materials`.  
- Each listed provider has `evidence_requirement`.  
- Rows with `evidence_requirement` are listed as providers (no orphan providers).  
- Combined-workspace / response-scaffold role checks that are **structural** (type + declared layout), not lexical.

**PROPOSED TARGET CONTRACT** additions that remain deterministic (implementation planning, not this task):

- `evidence_decision` **present on every activity** (the decision was recorded). Today the contract text requires this; the validator only requires it if the heuristic fires or providers exist (**CURRENT FACT**, T-010 P2-E related).  
- If `provenance` is present, it is one of the two controlled values (today unknown provenance is **warn-only**).

### If `required: false` — legitimate closure

- `provider_material_ids` empty.  
- No `required_materials` row carries `evidence_requirement`.  

These are **CURRENT FACT** and remain correct.

### What deterministic code must not do

**PROPOSED TARGET CONTRACT:** it must **not** reject `required: false` because joined `learner_task` / `expected_output` / spec prose “looks evidential.”

That is the P02 boundary. Catching model inconsistency by re-doing DLA’s pedagogy in regex is not closure. It is a second generative judge with worse information.

Lexical checks, if retained at all, are **diagnostic warnings**, not fail-closed invariants. This design does **not** decide keep-vs-remove of warning diagnostics; it forbids using them as capture blockers for the boolean.

---

## F. Current heuristic assessment

| Heuristic/check | Current purpose | Target responsibility | Design classification |
| --------------- | --------------- | --------------------- | --------------------- |
| `taskLooksEvidenceDependent` | Infer dependence from obligation prose; fail-close if `required: false` | Catch DLA emitting `false` with “evidential” wording (`126dae2` / S74B post-acceptance) | **Generative-only** if used as fail-closed; **diagnostic warning** if demoted. **Not** legitimate deterministic closure |
| `looksLikeProceduralTaskMaterialPractice` | Carve-out so construct/apply/solve + practice nouns do not fire the above (`2156c86`; `tests/s76-dla-procedural-task-evidence-validation.test.js`) | Undo false positives on Lagrangian A2-class tasks | **Historical/defensive**. Becomes **redundant** as fail-closed if the parent heuristic is not fail-closed. Encodes part of the *target principle*, but as a noun/verb list, not a durable invariant |
| `looksLikeInstructionalScaffoldNotSourceEvidence` | S75-D15: weak/strong examples, explanatory review, checklists ≠ source evidence | Same false-positive class as A5 interpret/compare examples | **Historical/defensive** / same as above |
| `looksLikeConceptualTeachingWithoutSourceInspection` | Teaching/overview vs source inspection | Narrow the parent heuristic | **Historical/defensive** |
| `looksLikeSourcePropertyOrTextualEvidenceAnalysis` / literary structure helpers | Preserve genuine source-analysis as evidential | Keep source-analysis `true` paths from being carved out | **Generative-only** as fail-closed; the *pedagogy* is legitimate DLA judgement, not a regex invariant |
| `looksLikeHardSourceEvidenceProductionDemand` | “cite/support with evidence / quotations from…” | Strong lexical cue of substantiation | **Diagnostic warning** at most. Still not a substitute for DLA’s boolean |
| `materialLooksTeachingOnly` | Block `evidence_requirement` on teaching-only rows | Provider-role closure | **Hybrid:** type/layout structure = **legitimate closure**; purpose/spec wording = **heuristic**. Keep structural half; do not grow lexical half |
| `validateEvidenceDecisionShape` + provider id/`evidence_requirement` coupling | Referential integrity | Same | **Legitimate deterministic closure** — **preserve** |
| `buildEvidenceDecisionForActivity` (deterministic enrich) | Sets `required` from “any provider rows exist” | Inverts decide-then-commission | **Misplaced** on Copy (generative). Non-Copy enrich path only; do not treat as the product contract |
| Missing `evidence_decision` allowed unless heuristic/providers | Lenient capture | Record that DLA decided | **Under-protected deterministic property** — requiring the **object** is closure; inferring its **value** is not |

S74B treated the wording contradiction as validator-correct and strengthened the **prompt** (`S74B-POST-manual-acceptance-dla-evidence-decision-prompt.md`). S75-D15 then S76 `2156c86` then patched the **validator** because the same fail-closed inference kept hitting teaching/practice. That sequence is evidence that fail-closed prose inference is unstable, not that the Sprint 72 evidence *product* is wrong.

---

## G. Evidence-product behaviour to preserve

Sprint 72 objective (**CURRENT FACT**, `SPRINT-72-FINAL-REPORT.md`): *Make activities use evidence for reasoning* — not “treat every supplied input as evidence.”

| Behaviour | Depends on | Preserve? |
| --------- | ---------- | --------- |
| Explicit `evidence_decision` on activities | Semantic decision recorded | **Yes** — require the object; DLA sets the boolean |
| Explicit provider relationships | Deterministic closure after `true` | **Yes** |
| `evidence_requirement` on provider rows | Closure + GAM fulfilment spec | **Yes** |
| Provider vs response-scaffold separation | Structural closure + prompt | **Yes** |
| Source-bound (`conversation_attachment`) handling | Generative provenance choice + GAM fulfilment + warn-only inspectability | **Yes** — not P02’s boolean |
| Provenance controlled values | Decision when `true`; optional fail-closed if field present | **Yes** |
| Simulation honesty | Provenance + GAM label + warn | **Yes** |
| Inspectability (source-native particulars, not summaries) | Prompt + GAM + warn-only diagnostics | **Yes** |
| Delayed disclosure | Prompt (DLA+GAM) + warn | **Yes** — independent of how the boolean is *inferred* |
| Source-use planning (PRE-DESIGN inventory) | Generative; attachments present | **Yes** as DLA judgement; not a lexical validator |
| Provider-role / teaching-row must not silently be the only “evidence” | Structural closure | **Yes** |
| Fail-closed “prose looks evidential ⇒ cannot be `false`” | Heuristic re-inference | **Do not preserve as invariant** |
| Prompt self-audit stack restating that contradiction | P04 | Out of P02 implementation; see §L |

P02 must not become rollback of the left-hand column.

---

## H. Known-exhibit walkthrough

### Lagrangian A2 — construct/practice from provided optimisation statements

**CURRENT FACT:** Live/test wording asks learners to study a worked example, compare the original statement with the completed Lagrangian, complete a construction table for new examples, and check a list. DLA set `required: false` with reason *construct expressions from provided optimisation statements*. Current validator accepts after `looksLikeProceduralTaskMaterialPractice`. Prompt lists of “supplied examples/data” can still pressure `true`.

| Question | Target judgement |
| -------- | ---------------- |
| Material required? | **Yes** — worked example, construction table, **and** the practice problems/statements the task refers to (P01 if those problems were never commissioned). |
| Epistemic evidence required? | **No.** Statements and examples are **operands** of a taught construction procedure, plus a teaching model. Comparing statement ↔ completed Lagrangian checks the procedure, it does not evaluate evidential grounds. |
| Provider closure | None. `provider_material_ids: []`. No `evidence_requirement`. |

### Lagrangian A3 — independently solve a new optimisation problem

| Question | Target judgement |
| -------- | ---------------- |
| Material required? | **Yes** — the new problem (P01 if missing). |
| Epistemic evidence required? | **No.** Solve/apply. The problem is an operand. |
| Provider closure | None. |

### Lagrangian A4 — interpret lambda values / cases

**CURRENT FACT:** Benchmark Major was **missing values/cases** (P01), not a recorded wrong `evidence_decision`.

**DESIGN INTERPRETATION** under the target principle:

- If learners are given numerical cases and must **derive** tightness / shadow-price meaning **from those particulars** as a judgement → `required: true` and the cases are providers (often `system_generated_simulation`).  
- If learners **apply a taught interpretation procedure** to given λ as calculation exercises → `required: false`, but the λ values are still **required material** (P01).

Either way, **absence of the cases is P01**. P02 does not license skipping the commission. A4 is not a counterexample to the principle; it is mostly a commissioning hole, with an optional genuine-evidence reading **once cases exist**.

### Contrasts

| Exhibit | Material? | Epistemic? | Why |
| ------- | --------- | ---------- | --- |
| Residual table: infer whether variance is constant (Sprint 72 tests) | Yes | **Yes** | Particulars are grounds for a diagnosis |
| S75-D15 A5: compare weak/strong *instructional* interpretations, write a conceptual summary | Yes | **No** | Models of reasoning quality, not source evidence |
| Roman Roads: reason from a historical source extract | Yes | **Yes** | Source particulars are grounds (`conversation_attachment`) |
| “Classify scenario cards” | Yes | **DLA judges** | If cards contain uninterpreted particulars to be read as grounds → `true`. If cards are already-framed practice items for applying a taught taxonomy → `false`. The word *scenario* does not decide |

The rule distinguishes **using material to perform a procedure** from **inspecting particulars as evidence for a judgement**.

---

## I. Schema compatibility

**PROPOSED TARGET CONTRACT** uses existing shapes:

- `evidence_decision { required, reason, provider_material_ids[] }`  
- `evidence_requirement` on provider rows only (`kind`, `purpose`, `learner_action`, `observable_features`, optional `provenance`, layout fields)

**No schema expansion** is required to express material ≠ epistemic ≠ provenance.

Not needed for P02:

- A third boolean or `epistemic_role` enum (the boolean *is* that role).  
- Provenance on ordinary (non-provider) rows.  
- Task→material links (that is P01).  
- Purpose/specification presence on ordinary rows (P03).

**Limitation (not a P02 blocker):** free-text `learner_task` still cannot be mechanically bound to material ids. That is P01, not a reason to keep prose heuristics for the evidence boolean.

---

## J. Prompt responsibility classification

Informational for later **DLA-P04**. **Do not rewrite the prompt in this task.**

| Category | Current location (indicative) | Classification |
| -------- | ----------------------------- | -------------- |
| Definition of epistemic vs material vs provenance | Planning order; “use evidence_requirement only when…”; CONTEXT working distinctions | **ESSENTIAL** — needs one canonical statement of §B, not three competing lists |
| Decision guidance (production first, then whether inspection-as-grounds) | Evidence-decision planning order steps 1–4 | **ESSENTIAL** |
| Provider guidance (genuine provider, not scaffold-alone; list ids; attach `evidence_requirement` only there) | Contract evidence semantics | **ESSENTIAL** as short rules; much of the rest is **DETERMINISTIC CONSEQUENCE** |
| Provenance / simulation / source-bound / combined workspace | Contract evidence block | **ESSENTIAL** when `true`; not part of deciding the boolean |
| Source-use / PRE-DESIGN inventory | PRE-DESIGN; resource-level source-use | **ESSENTIAL** when attachments exist; independent of A2-class practice |
| Delayed disclosure | Contract | **ESSENTIAL** for `true` activities; GAM also carries it |
| Consistency / PRE-EMIT / per-activity audit / INVALID–VALID | `ld-dla-page-enrich-contract.js`; `126dae2` | **USEFUL BUT CONSOLIDATABLE** for generative reminder; **DETERMINISTIC CONSEQUENCE** for provider empty/non-empty; **HISTORICAL/DEFENSIVE** where they tell the model to match lexical validator behaviour |
| Noun lists (data/cases/images/supplied examples ⇒ `true`) | Planning step 4; “must set required true” | **HISTORICAL/DEFENSIVE** — this is the prompt half of P02. Replace conceptually with §B role test, not a longer list |
| Checklist diagnostic spec (GAM owns criterion prose) | Contract | Out of P02 semantics; keep as DLA/GAM split |

---

## K. Proposed invariants

Approximately seven. **PROPOSED TARGET CONTRACT**, not current behaviour.

1. **`evidence_decision.required` expresses epistemic evidence dependence, not material requirement and not provenance.**  
2. **`required: true` means the learner must inspect particulars as grounds for an inference, interpretation-from-particulars, comparison-as-evaluation, diagnosis, or substantiation.**  
3. **`required: false` means that epistemic use is not required. It does not mean no materials, no examples, no supplied inputs, and no generated/simulated practice artefacts.**  
4. **DLA owns the boolean.** EP does not set it. GAM does not set it. Deterministic code does not infer it from arbitrary task prose.  
5. **When DLA sets `required: true`, it must identify at least one commissioned provider row that carries `evidence_requirement` (and honest provenance where applicable).**  
6. **When DLA sets `required: false`, `provider_material_ids` is empty and no `required_materials` row carries `evidence_requirement`.**  
7. **Deterministic validation may guarantee decision-object presence, shape, and the referential consequences in (5)–(6). It must not fail-close `required: false` because wording “looks evidential.”**  
8. **Sprint 72 evidence-product mechanisms (providers, provenance, simulation honesty, inspectability, delayed disclosure, source-bound fulfilment) remain in force whenever `required: true`. P02 alignment is not rollback.**

---

## L. Interaction with P01 / P03 / P04 / P05

| Problem | Effect of this P02 design |
| ------- | ------------------------- |
| **DLA-P01** task→material closure | **Independent boolean.** A2/A3/A4 can be `required: false` **and** still missing practice/problem/λ commissions. Clarifying P02 **must not** be used to argue that practice inputs are “not materials.” P01 design proceeds on `required_materials[]`, not on `evidence_decision`. |
| **DLA-P03** commissioning sufficiency | **Independent.** Purpose/specification quality is not the evidence boolean. Weak specs still hurt GAM. If A4 is `true`, P03 still requires the cases to be specified as a provider; if `false`, P03 still requires the λ exercises as ordinary rows. |
| **DLA-P04** evidence prompt rationalisation | **Depends on P02.** P04 should consolidate to one definition (§B) plus provider/provenance essentials, and treat self-audit/lexical lists as consolidatable or historical. **Do not rationalise P04 until this contract is accepted.** |
| **DLA-P05** dual Copy injection | **No semantic dependency.** Assembly amplification is independent. A shorter canonical definition may later shrink the duplicated block; that is a size side-effect, not a P02 requirement. |

---

## M. Design risks / unresolved questions

Not blockers for the semantic contract:

| Item | Why it is not a P02 semantic fork |
| ---- | -------------------------------- |
| Keep lexical checks as **warnings** vs remove them | Implementation hygiene. Invariant 7 only forbids fail-closed inference of the boolean. |
| Require `evidence_decision` on every activity vs only when providers exist | Prefer **every activity** (decision recorded). Compatible with existing contract text. Implementation planning detail. |
| A4 `true` vs `false` once cases exist | DLA judges from intended pedagogy (§H). Either value still needs the cases commissioned (P01). |
| Non-Copy `buildEvidenceDecisionForActivity` | Enrich path only; do not let it define product semantics. |

**No operator architecture choice is required** to accept §B–§K. The remaining choices are implementation tactics inside that contract.

Risk if P02 is implemented as “delete evidence_decision”: that would be rollback, which this design **rejects**.

Risk if P02 is implemented as “more carve-outs”: that continues S75-D15 → S76 heuristic accretion and does **not** restore the generative/deterministic boundary.

---

## N. Implementation readiness verdict

**DLA-P02 READY FOR IMPLEMENTATION PLANNING**

The target semantic contract is specified, schema-compatible, exhibit-tested, and bounded so that Sprint 72 evidence-product behaviour is preserved.

This verdict **does not** authorise prompt edits, validator edits, heuristic removal, or schema changes. A subsequent implementation-planning task may sequence: (1) document the canonical definition for implementers, (2) stop fail-closed prose inference of the boolean, (3) keep provider-closure invariants, (4) leave P04 prompt consolidation as a separate authorised step.

---

## Appendix — evidence used

| Kind | Source |
| ---- | ------ |
| Diagnostic | [S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md) DLA-P02, §4, §C, §H |
| Opening distinctions | [CONTEXT.md](CONTEXT.md) §10 working table |
| Current prompt | `lib/ld-dla-page-enrich-contract.js` planning order, evidence semantics, PRE-EMIT, per-activity audit |
| Current validator | `lib/page-dla-enrich.js` `validateEvidenceDecisionClosure`, `taskLooksEvidenceDependent`, `looksLikeProceduralTaskMaterialPractice`, S75 scaffold helper |
| Tests | `tests/s76-dla-procedural-task-evidence-validation.test.js`; `tests/s75-dla-evidence-decision-false-positive.test.js`; Sprint 72 evidence-centred slice |
| History | Sprint 72 final report (evidence for reasoning; `evidence_decision`); S74B post-acceptance prompt strengthening; **S75-D15**; `2156c86` |
| Exhibits | CONTEXT Lagrangian A2/A3/A4; live A2 wording in s76 test |

*End of S76-T-020. No implementation is authorised by this artefact.*

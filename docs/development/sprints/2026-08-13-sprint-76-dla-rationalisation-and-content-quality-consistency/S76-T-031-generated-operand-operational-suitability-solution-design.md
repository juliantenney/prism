# S76-T-031 — Generated-operand operational suitability solution design

**Task:** S76-T-031  
**Problem:** [T-030](S76-T-030-generated-operand-operational-suitability-diagnostic.md) — explicit task operands are commissioned and fulfilled, but PRISM does not reliably ensure a generated operand is operationally suitable for the learner operation it was commissioned to support  
**Status:** **Solution design complete** (2026-08-13) — **implementation deferred until after P04**  
**Mode:** DESIGN ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, Design Page, Graphics, QA, workflow, or Settings changes  
**Depends on:** [T-022](S76-T-022-dla-p03-solution-design.md) · [T-023](S76-T-023-dla-p01-p02-p03-implementation-plan.md) · [T-027](S76-T-027-dla-p01-residual-operand-closure-solution-design.md) · [T-028](S76-T-028-dla-p01-residual-operand-closure-implementation.md) · [T-030](S76-T-030-generated-operand-operational-suitability-diagnostic.md)  
**Out of scope:** implementation · P04 implementation · P05 · P01/P02 reopen · new schema · semantic validators · subject-specific solvers · Design Page / Graphics

This artefact designs the **smallest cross-disciplinary semantic contract** for operational suitability. It does not rewrite prompts. It does not authorise implementation. Live-prompt change is **deferred until after P04**.

**DESIGN COMPLETE — IMPLEMENTATION DEFERRED UNTIL AFTER P04**

---

## A. Executive design decision

**PROPOSED TARGET CONTRACT**

Keep existing fields. Do not add a schema object, role, or validation subsystem.

Refine two already-owned surfaces:

1. **DLA / P03** — `required_materials[].specification` already carries load-bearing count, variation, constraints, and exclusions ([T-022](S76-T-022-dla-p03-solution-design.md); live commissioning-order step 3). Clarify that those constraints include the **method, condition, assumption, boundary, or exclusion** the commissioned operation depends on when omitting it would allow an operand that requires a **different operation or untaught reasoning scope**.  
2. **GAM fulfilment** — the Copy brief already says treat `specification` as binding content bounds ([T-024](S76-T-024-dla-p01-p02-p03-gate-a-b.md)). Clarify that binding includes **operational suitability**: realised particulars must actually support the commissioned learner operation and those bounds. Do not introduce untaught load-bearing reasoning. Do not invent pedagogical constraints the commission does not state.

This is **D — a shared DLA-P03 / GAM fulfilment principle**, not a new DLA contract and not GAM-only.

P01 remains **CLOSED**. P02 semantics unchanged. Deterministic subject-specific validation remains **out**.

**Recommended intervention:** Option 3 — small paired clarification (DLA step 3 + GAM specification-binding sentence). Unique add should stay compact (DLA ~120–250; GAM ~80–180). No PRE-EMIT, no checklist stack, no second canonical JSON activity.

**GENERATED OPERAND VALIDITY DESIGN COMPLETE — IMPLEMENTATION DEFERRED UNTIL AFTER P04**

---

## B. Definition of operational suitability

**CURRENT FACT (T-030):** Structural fulfilment can produce a well-formed Lagrangian stem that cannot be solved with the interior FOC procedure the activity teaches.

**PROPOSED TARGET CONTRACT**

A generated task operand is **operationally suitable** when a learner who has only the knowledge, method, and reasoning scope this activity provides or explicitly expects can **perform the commissioned operation** on that operand.

The candidate in the design brief is accepted with one refinement: suitability is relative to the **commissioned operation and its stated or activity-expected scope**, not to every disciplinarily correct treatment of the same object.

| Nearby concept | Difference |
| -------------- | ---------- |
| **Structural validity** | The row exists; purpose/specification are non-empty; GAM 1:1; the stem *looks like* the requested form. Problem B was structurally valid. |
| **General factual correctness** | Locally well-formed expressions, true statements, internally consistent algebra *as expressions*. Problem B’s Lagrangian is a well-formed expression. Operational suitability can fail while local form holds. |
| **Difficulty / variation** | Harder algebra, different story, less round numbers — **inside** the same operation. Problem B is not harder interior FOCs; it demands a **different** operation (boundary / inconsistency reasoning). |
| **Authenticity** | Realistic context or source-native material. Orthogonal. |
| **Evidence quality** | Inspectability, delayed disclosure, provenance (P02). A3 is ordinary practice. |
| **Task-input closure** | The operand row is commissioned and listed (P01 / P01-R1). This run already had that. |

**A3 demonstration:** The commissioned operation is derive-and-solve a simultaneous **interior** FOC system. Problem B admits writing FOCs but not solving them consistently under that method. It is therefore operationally unsuitable, even though it is a structurally valid generated Lagrangian operand.

---

## C. DLA ownership

**PROPOSED TARGET CONTRACT**

When successful learner performance depends on a **load-bearing method, condition, assumption, boundary, or exclusion** that is a **pedagogical choice** (it distinguishes the intended operation/scope from other legitimate disciplinary treatments of the same kind of object), DLA must express that constraint in `required_materials[].specification` (and may echo the job in `purpose`).

**Minimum generic rule** (not a phrase list):

> If omitting the constraint would allow GAM to generate a particular that requires a different operation, or reasoning the activity does not provide or expect, DLA must state the constraint.

Illustrative intents (wording is GAM-facing bounds, **not** required slogans):

- practise the interior FOC method just taught; do not require boundary/KKT reasoning;  
- dataset usable with the taught test under its taught assumptions (or: include a violation **if** the lesson is checking assumptions);  
- passage contains the target construction;  
- bug diagnosable with concepts introduced so far;  
- sources share the comparison dimension the task requires;  
- values make the commissioned calculation defined.

**DLA does not own** (do not enumerate in every spec):

- obvious fulfilment hygiene once the operation/method is named (consistent FOCs for a “solve by method X” commission; defined arithmetic; a comparison that has something to compare; a worked solution that correctly demonstrates the specified procedure);  
- actual numbers, stems, and wording (GAM elaboration);  
- a new field for “operational suitability”;  
- subject-specific theorem lists.

**DLA also does not change:** `learner_task` remains the production obligation; specification remains authoring bounds, not body prose ([T-022](S76-T-022-dla-p03-solution-design.md)). P01 listing and P02 evidence boolean stay independent.

---

## D. GAM ownership

**PROPOSED TARGET CONTRACT**

When generating an operand (or other commissioned particular), GAM must realise content that **actually supports** the learner operation named by the activity and all load-bearing bounds in that row’s `purpose` / `specification`.

GAM **cannot** satisfy “two problems solvable using method X” by emitting two structurally plausible problems of which one requires method Y.

GAM **must not invent**:

| Invention | Why forbidden |
| --------- | ------------- |
| A different method or framework | Changes the pedagogical job (T-022: GAM must not invent operand nature or pedagogical job) |
| A new learning objective | EP/DLA own progression |
| Additional load-bearing difficulty or coverage | T-022: difficulty/variation only if DLA intends a spread; otherwise similar difficulty is legitimate elaboration |
| Pedagogical constraints absent from the commission | e.g. “integer-only,” “two constraints,” “include a corner case to stretch learners” |

**Elaboration remains GAM’s job:** wording, numbers, stories, and layout **inside** the brief.

---

## E. Inherent correctness vs pedagogical constraint

This is the ownership rule.

**Discriminating question** (extends T-022’s P03 question):

> Given purpose, specification, and `learner_task` / `expected_output`: would GAM still have to **invent a pedagogical requirement**, or could it emit a particular that **cannot be acted on with the commissioned operation** without leaving the brief?

| Class | Owner | Must DLA repeat it in every spec? | Examples |
| ----- | ----- | -------------------------------- | -------- |
| **Inherent fulfilment correctness** | **GAM** | **No** | Values make the commissioned calculation possible; comparison cases contain a task-relevant comparable dimension; a worked example of procedure X correctly demonstrates X; if the commission is practise method X, each operand is actually usable with X; do not substitute an untaught method |
| **Pedagogical constraint** | **DLA** | **Yes, when load-bearing** | Which method among several; interior-only vs include corners; concepts taught so far; assumption-satisfying practice vs assumption-violation practice; withhold solutions/interpretation; specified variation/count |

**Rule:** DLA names the **operation and any scope choice that is not implied by the operation itself**. GAM treats **executability under that named operation/scope** as inherent to fulfilment — parallel to “do not emit an empty body,” not parallel to “invent that corners are out of scope.”

**A3 application of the rule:**

- “Two new Lagrangian problems” does **not** imply interior-only. Interior vs boundary is a **pedagogical scope choice** → DLA must bound it (typically: solvable using the taught interior FOC method; exclude untaught boundary reasoning).  
- Once that method/scope is named, “FOCs must be algebraically consistent / an interior candidate must exist” is **inherent GAM fulfilment**. DLA must not also list disciplinary theorems (“1 − λ and 1 − 2λ must not contradict”).

**Worked examples:** DLA specifies what is demonstrated and whether the solution is shown. Correctness of the demonstrated procedure is inherent GAM fulfilment.

**Calculation problems:** DLA specifies the calculation/procedure. Defined, usable values are inherent GAM fulfilment unless DLA *intentionally* commissions an undefined or impossible case as the lesson.

---

## F. Lagrangian A3 — target chain

| Layer | Owns | A3 target |
| ----- | ---- | --------- |
| **EP** | Learner operation / progression | Practise deriving and solving a simultaneous interior FOC system on new problems (not material ids or numbers) |
| **DLA** | Production + commission | `learner_task`: derive/solve interior FOCs on the supplied problems. Operand row `purpose`: unseen problems for that production. `specification`: count; distinct from WE/A2; explicit objective + constraint in the material; **solvable using the taught interior FOC method; do not require untaught boundary/KKT reasoning**; solutions withheld |
| **GAM** | Realisation inside the brief | Invent actual functions/numbers; each stem must admit the taught interior procedure; do not emit incompatible interior FOCs; do not turn Problem B into a corner-case lesson |

**Sufficient DLA specification (conceptual, not prescribed copy):**

> Two new equality-constrained optimisation problems, distinct from the worked example; each with an explicit objective and one constraint in the material; each solvable using the interior FOC method taught in this activity; do not require boundary or KKT reasoning; do not include solutions.

**What GAM must verify semantically before emitting** (prompt duty, not a validator):

- each stem is usable with that named method;  
- the learner can complete the commissioned production without untaught reasoning;  
- exclusions (no pre-filled solution) are honoured.

GAM does not solve the course for the learner in the operand body when solutions are withheld; it **authors stems that the taught method can solve**.

---

## G. Lagrangian A2 — anti-over-specification

A2’s commissioned operation is **construct** `L = objective + λ(constraint expression)` from supplied objective–constraint statements.

**Well-formed objective + constraint is sufficient** for that operation. An interior candidate, consistent later FOCs, or “no corners” is **not** required merely to practise writing L. Those would be **invented pedagogical constraints** if GAM or DLA imported them from A3.

| | A2 | A3 |
| - | -- | -- |
| Operation | Construct L | Derive and solve interior FOCs |
| Load-bearing DLA constraint | Nature (obj+constraint statements); count; distinct from WE; no completed L | Those **plus** taught interior FOC method / exclude untaught boundary reasoning |
| Inherent GAM obligation | Each item is a well-formed obj+constraint the learner can write L for | Each item is usable with the named interior FOC procedure |
| Unsuitable operand | Missing constraint; already-completed L; not a problem at all | Incompatible interior FOCs (Problem B); a KKT/boundary-only stem |

The target contract **must not** cause DLA to copy A3’s interior-solution clause onto A2, and **must not** cause GAM to “helpfully” restrict A2 stems to interior optima.

This is the anti-accretion test: operational suitability is **relative to the commissioned operation**, not a global “problems must have nice interior maxima” rule.

---

## H. Cross-disciplinary test

The same rule: DLA names operation + load-bearing scope choice; GAM inherently realises particulars that support that operation.

| Domain | Learner operation | Load-bearing DLA constraint (if any) | Inherent GAM obligation | Unsuitable operand |
| ------ | ----------------- | ----------------------------------- | ----------------------- | ------------------ |
| **Statistics** | Practise a taught test | Which test; whether data should satisfy assumptions **or** illustrate a violation | Dataset actually usable for the commissioned test/mode | Dataset that forces an untaught test or undefined statistic |
| **Programming** | Debug using concepts taught so far | Scope: concepts/APIs in play (when that bound is the point) | Bug diagnosable with those concepts | Bug whose only fix is an unintroduced API |
| **Languages** | Identify/practise a construction | Target construction; coverage if load-bearing | Passage actually contains / affords that construction | Passage with no instance of it |
| **History** | Compare sources | Comparison dimension if it is the job | Sources share a task-relevant comparable dimension | Two texts with nothing the task can compare |
| **Chemistry** | Perform a specified calculation | Which calculation; intentional undefined case only if that is the lesson | Values make the calculation defined and executable | Values that make it impossible/undefined |
| **Medicine / professional** | Apply a defined diagnostic/reasoning framework | Which framework; exclusions (e.g. not requiring untaught tests) | Case affords that framework’s moves | Case that can only be resolved by an untaught pathway |

No subject-specific prompt branches. Examples above are **design tests**, not live prompt content.

---

## I. Relationship to P03

**CURRENT FACT:** T-022 already listed A3 nature as “solvable by the taught method” and practice-set specs as typically bounding “method constraints.” Gate B implemented structural presence of purpose/specification, not that exhibit as a model-visible invariant (T-030).

**PROPOSED TARGET CONTRACT:** **D** — shared DLA-P03 / GAM fulfilment principle.

| Reading | Why not (or why yes) |
| ------- | -------------------- |
| **A. Extension of existing P03** | **Yes for the DLA leg.** Same fields; deeper content of “constraints/exclusions.” Not a new P03 object. |
| **B. Separate new DLA contract** | **No.** Would accrete a parallel brief beside purpose/specification. |
| **C. Primarily GAM** | **Incomplete.** GAM-only leaves “two Lagrangian problems” underspecified; GAM then either invents interior-only or emits Problem B. |
| **D. Shared** | **Accepted.** Matches T-030 causal assessment. |

`required_materials[].specification` is already the correct DLA place. `purpose` states the job; `learner_task` states the production. No new schema field.

This is **not** empty-spec P03 (type-echo). It is P03 **content sufficiency** for method/scope when that scope is load-bearing, plus GAM **semantic fulfilment** of ordinary rows (evidence rows already have a semantic fulfilment block).

---

## J. Schema / validator impact

| Change | Decision |
| ------ | -------- |
| **SCHEMA** | **NO** |
| **DETERMINISTIC VALIDATOR** | **NO** |

`purpose` + `specification` already carry the DLA side. Operational suitability is disciplinary/semantic: whether *this* stem supports *this* operation. A generic pipeline must not grow Lagrange solvers, assumption engines, or grammar parsers. `learner_task` inference and regex heuristics remain rejected (T-010 principle 8; T-023; T-030 §8).

Structural P03 (non-empty, not type-echo) stays as it is. It will not detect Problem B; that is accepted.

---

## K. GAM contract surface (do not edit now)

**CURRENT FACT**

- `app.js` `buildGamV2CopyMaterialAuthoringBrief`: “Honour `required_materials[].purpose` and treat specification as binding content bounds.” Evidence_requirement, if present, is separately binding.  
- `lib/ld-gam-page-enrich-contract.js`: 1:1 structural fulfilment + long **evidence-centred** semantic block. Ordinary operand validity is **not** named.  
- T-023: ordinary specification binding is Copy-brief, not a GAM architecture redesign.

**PROPOSED TARGET (later implementation):** **one clarification of specification-as-binding**, not a new audit/checklist stack.

Prefer **replace/extend that single Copy-brief sentence** rather than adding a paragraph to `ld-gam-page-enrich-contract.js` (would duplicate the brief and fight P05). Do not mention `task_material_decision` (GAM still must not interpret it).

Conceptual later wording (not shipped):

> Honour purpose. Treat specification as binding content bounds. Realised particulars must be usable for the commissioned learner operation and those bounds; do not introduce untaught load-bearing reasoning; do not invent pedagogical constraints the commission does not state.

**Likely unique prompt delta:** **~80–180 characters** (replacement/extension of an existing sentence).

---

## L. DLA contract surface (do not edit now)

**CURRENT FACT**

- `lib/ld-dla-page-enrich-contract.js` commissioning-order **step 3**: purpose = job; specification = “binding GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose.”  
- Payload already requires non-empty purpose/specification.  
- Copy dual-injects contract+shape (P05 open).  
- T-028 changed **step 2** only; step 3 untouched.

**PROPOSED TARGET (later implementation):** **refine step 3**, do not add step 6, PRE-EMIT, or a method-constraint example block.

Conceptual later wording (not shipped): keep the current sentence; add that load-bearing constraints/exclusions include the method, condition, assumption, or exclusion the learner operation depends on when omitting it would allow an operand requiring a different operation or untaught reasoning scope. Do not list subject examples in the live prompt.

**Likely unique prompt delta:** **~120–250 characters**. Assembled Copy ×2: **~240–500**. Stay in this band; if implementation creeps, cut examples, not the rule.

Do **not** put this in PRE-DESIGN / PRE-EMIT / per-activity evidence audit (those are P04’s estate).

---

## M. Failure and variance model

Success is **not** “QA can never find a disciplinary defect.”

Success is: the generation contract **assigns responsibility** for operational suitability and **materially reduces avoidable** operand failures of the Problem B class.

Even after the paired clarification, models can still emit a bad stem. That residual is **expected generative variance**, caught by QA and ordinary revision — not a licence to add solvers or a third self-audit.

QA remains the last detection layer for residual maths/disciplinary misses, visual contradiction (A5), and teaching-alignment issues this contract does not own (parts of A4).

---

## N. A4 relationship (not in scope)

Benchmark finding: constraint satisfaction used as evidence of optimality.

**Partially covered.** If A4’s commissioned operation is to interpret λ / distinguish optimality from mere feasibility, and generated cases **cannot support that judgement** (particulars only afford “constraint holds ⇒ optimal”), the operational-suitability principle applies to those cases as operands.

**Also possibly separate:** the activity or model may **teach the wrong inference** (constructive alignment / exposition), which this contract does not repair.

Do **not** broaden this design to force A4 into scope. Investigate A4 later if authorised.

---

## O. A5 visual relationship

**Outside this contract.** A contradictory shadow-price graphic is Design Page → Graphics pedagogical consistency, not DLA/GAM operand fulfilment. T-029 is that lane. Do **not** add Design Page or Graphics requirements here.

---

## P. Design options

### Option 1 — DLA / P03 clarification only

- **Ownership:** DLA names method/scope; GAM unchanged.  
- **Effectiveness:** MEDIUM — better commissions, but GAM may still structurally fulfil and emit Problem B; inherent correctness stays unspoken.  
- **Prompt cost:** DLA ~120–250 unique (×2).  
- **Over-specification:** MEDIUM if step 3 grows examples.  
- **GAM invention:** Unchanged (may still invent scope if spec stays weak).  
- **P04:** Compatible if kept in step 3, not PRE-EMIT.

### Option 2 — GAM fulfilment clarification only

- **Ownership:** GAM must make operands usable for the commissioned operation.  
- **Effectiveness:** MEDIUM — fails when DLA only said “two Lagrangian problems”; GAM must either invent “interior-only” (forbidden pedagogy) or emit Problem B.  
- **Prompt cost:** GAM ~80–180 unique.  
- **Over-specification:** Low on DLA; **high invention risk** on GAM.  
- **P04:** GAM brief is outside P04’s evidence-audit target.

### Option 3 — Small paired clarification **(recommend)**

- DLA states load-bearing operational constraints where pedagogically needed;  
- GAM ensures generated particulars satisfy the commissioned operation and those constraints.  
- **Ownership:** Matches T-030 shared gap.  
- **Effectiveness:** HIGH for the diagnosed class, without solvers.  
- **Prompt cost:** DLA ~120–250 + GAM ~80–180 unique; DLA assembled ×2 ~240–500.  
- **Over-specification:** Controlled if A2 vs A3 relativity is in the DLA gloss (“the commissioned operation,” not global solvability).  
- **GAM invention:** Explicitly forbidden in the GAM sentence.  
- **P04:** Compatible: live change **after** P04 so this add is not immediately rationalised; P04 must not strip step 3 / specification-binding (see §R).

**Recommend Option 3.** Option 1 and 2 each leave one leg of the accepted diagnosis unaddressed.

---

## Q. Acceptance criteria (future implementation)

**Lagrangian A3**  
A commission for practice using the taught interior FOC method should cause GAM to generate operands for which that method is applicable (no Problem-B-class incompatible interior FOCs as the intended practice).

**Lagrangian A2**  
No unnecessary interior-solution constraint when the learner operation is only construction of L.

**Cross-disciplinary**  
Same rule; no subject-specific prompt branches.

**Architecture**

- no new schema;  
- no semantic validator;  
- no `learner_task` heuristic;  
- no new workflow stage;  
- no large self-audit / PRE-EMIT block;  
- P01/P02 semantics unchanged;  
- unique DLA add in the §L band; GAM add in the §K band; still only the existing two DLA contract/shape injection sites.

**QA**  
May still detect occasional disciplinary generation errors.

**Tests (when implemented):** prompt-surface assertions only (step 3 string; GAM binding sentence). No new Gate A semantic cases.

---

## R. P04 sequencing and protection

**Confirm:** design now so the finding is not lost; **live implementation after P04**. That remains the best sequence (T-030 §14). Unlike P01-R1, this is **new** unique text; shipping it before P04 would add DLA/GAM prose that P04 would then have to rationalise (S76-D03).

Do **not** fold this into P04. P04 is evidence-guidance self-audit, not ordinary-operand fulfilment.

**Surfaces P04 must not accidentally delete** (this design later refines them):

| Surface | Why protect |
| ------- | ----------- |
| Commissioning-order **step 3** purpose/specification gloss (`count/variation/constraints/exclusions`) | P03 ordinary commissioning, not evidence accretion |
| Payload bullet requiring non-empty purpose/specification | Structural P03 |
| GAM Copy brief sentence treating **specification as binding** | Ordinary fulfilment SSOT for this design |
| T-022 design language “method constraints” / “solvable by the taught method” | Design SSOT; not live prompt, but do not contradict it in P04 notes |

P04 **may** thin PRE-DESIGN, PRE-EMIT, per-activity evidence audits, and INVALID–VALID contrast. Those are not this contract’s home.

This section is **not** P04 design.

---

## S. Risks / unresolved

| Risk | Handling |
| ---- | -------- |
| DLA still writes “two Lagrangian problems” after step 3 | GAM sentence still requires usability for the **commissioned operation** in `learner_task` / purpose; residual variance → QA |
| GAM over-restricts A2 | Acceptance criterion §Q; DLA gloss is relative to the commissioned operation |
| Unique add creeps (examples, Lagrange FOCs) | Cut examples; keep the generic rule |
| Implementer puts this in PRE-EMIT | Forbidden; step 3 + GAM brief only |
| Live JSON still missing | Does not block this design (T-030) |
| A4/A5 | Out of scope; §N / §O |

---

## T. Verdict

**GENERATED OPERAND VALIDITY DESIGN COMPLETE — IMPLEMENTATION DEFERRED UNTIL AFTER P04**

Option 3 accepted as design. P01 closed. No schema. No validator. No P04 implementation from this artefact. No live prompt change from this artefact.

**HARD STOP.**

---

*End of S76-T-031.*

# S78-T-021 — Check / revision architecture solution design

**Task:** S78-T-021  
**Status:** **DESIGN COMPLETE** (2026-08-17)  
**Mode:** DESIGN ONLY — no implementation  
**Workstream:** 3 — Check / revision architecture  
**Depends on:** [S78-T-003](S78-T-003-check-revision-architecture-diagnostic.md) (diagnostic complete)  
**Production / tests / prompts / schema / validators / assembly / renderer:** **UNCHANGED by this task**

Sprint 78 remains **OPEN**. T-013 remains **OPEN**. Do **not** start T-019. Do **not** extend the T-017/T-018 verifier. Do **not** regenerate.

---

## 0. Accepted T-003 diagnosis (not reopened)

See [S78-T-003-check-revision-architecture-diagnostic.md](S78-T-003-check-revision-architecture-diagnostic.md). Summary:

| Finding | Verdict |
| ------- | ------- |
| A1–A4 Weak Check | No diagnostic checklist commissioned |
| A5 Strong Check | DLA commissioned `material_type: checklist` → GAM authored `guided_criteria` → assembly preserved → renderer already presents why / observable features / repair / confirm |
| Multiple-response production | **Correlated, not causal** |
| GAM / assembly / renderer | **Non-causal** |
| Regression? | **No** — the architectural guarantee never existed |
| Primary cause | Episode/archetype **closure OR** permits production without check/revision (`verification` cardinality 0–1; closure = verification \| reflection \| transfer \| **transition**) |
| Secondary cause | DLA checklist commissioning is optional/non-salient and **not fail-closed**; packed G1/DLA-WB-26 contradicts the salient slot |
| Sufficient realisation | Existing `checklist` + `guided_criteria` |
| Desired pattern | **One** coherent diagnostic review per activity when there is **substantive independent learner production**; multiple criteria **inside** that review |

Fresh QA comparator (not a design target): overall **88/100**; Feedback & Self-Regulation **78**; A1–A4 Check Weak; A5 Check Strong; 0 Critical; 0 Major; no Moderate production defects.

This design repairs the **educational architecture generally**. It does **not** optimise the benchmark score.

---

## 1. Recommended repair architecture (single decision)

**Name:** **Activity-level diagnostic review commissioning (S78-WS-3)**

| Element | Decision |
| ------- | -------- |
| **Canonical owner** | **DLA commissioning contract** + **DLA partial-page capture validator** |
| **Authoritative invariant** | When an activity requires **substantive independent learner production**, it MUST provide **exactly one** coherent post-attempt diagnostic review covering that production |
| **Trigger** | Reuse WS1/WS2 production classification: load-bearing `productionKinds.length > 0` **and not** guided-only |
| **Realisation** | Existing `required_materials[]` row with `material_type: "checklist"` + lightweight `diagnostic_review` binding |
| **Learner-facing body** | Existing GAM `guided_criteria` → existing renderer guided review |
| **EP / archetype** | **Clarification only** — do **not** make `verification` mandatory in productive archetypes |
| **Enforcement** | Stage-1 DLA capture, fail-closed **before GAM** |
| **GAM prompt** | **No change in first implementation** — existing checklist → guided_criteria path is sufficient when the row exists |
| **Assembly / renderer** | **No change** |
| **T-017/T-018 verifier** | **Out of scope** — do not extend, do not treat PASS as review evidence |

This is the **smallest canonical design** that closes the proven T-003 chain without a second review schema, without per-field checklists, without auto-marking, and without over-constraining episode design.

---

## 2. Design decisions (D1–D12)

### D1. Canonical diagnostic-review invariant

**Exact wording (normative):**

> **S78-WS-3:** When an activity requires **substantive independent learner production**, the activity MUST provide **exactly one** coherent **post-attempt diagnostic review** that helps the learner **inspect and improve** that production.

**Scope:**

- One review **per activity**, not per response field, workspace, material, or learner-task sentence.
- Multiple **criteria** may exist **inside** that one review; together they cover the activity’s bound independent production.
- The review is **diagnostic self-review**, not automatic marking, not an answer key, and not the operational-suitability verifier.
- The review is **post-attempt**: it inspects production the learner has already been asked to make.

**Learner-facing obligations per criterion** (realised by existing `guided_criteria`, not by new DLA prose):

| # | Support | Strictness |
| - | ------- | ---------- |
| 1 | **WHAT** to inspect (`statement`) | **MUST** |
| 2 | **WHY** the criterion matters (`why_it_matters`) | **MUST**, but **compact** — one short consequence, not a pedagogical essay; existing GAM already forbids generic motivation |
| 3 | **HOW** to recognise whether the response meets it (`features[].expected`) | **MUST** |
| 4 | **WHAT** to reconsider/change if it does not (`features[].repair`) | **MUST** |
| 5 | Explicit opportunity to **revise, confirm, or improve** (`confirmation_label` + renderer checkbox) | **MUST** at the review as a whole; already rendered per criterion |

Do **not** require bloated feedback prose. DLA **MUST NOT** write learner-facing why / expected / repair / confirm text (current contract already assigns those to GAM). DLA commissions **dimensions**; GAM authors the compact learner-facing criteria.

### D2. Trigger — “substantive independent learner production”

**Reuse existing classification. Do not invent a verb taxonomy.**

Trigger function (conceptual; implement in T-022 by composing existing helpers):

```text
activityRequiresDiagnosticReview(activity)
  ⇔ classifyLearnerProductionSteps(learner_task, expected_output).productionKinds.length > 0
  AND NOT isGuidedOnlyActivity(classification)
```

Sources (already in `lib/dla-production-fulfilment.js` and `lib/dla-practice-independence.js`):

| Input | Role |
| ----- | ---- |
| `learner_task` | Primary — `parseLearnerTask` + step classification into `response_kind` |
| `expected_output` | Corroboration when steps are ambiguous (already used by `classifyLearnerProductionSteps`) |
| `isGuidedOnlyActivity` | Exclusion — all non-study steps match guided-practice scaffolding |
| `response_fulfilment` | **Coverage identity**, not the trigger. WS1 already requires these rows when `productionKinds` exist |

**Not used as trigger:** episode beats, `task_input_material_ids`, material types alone, a new production verb list.

**Why not bind the trigger to `response_fulfilment` presence?** A guided-only activity may still have a bound workspace (scaffolded recording). Presence of a surface is not independence. Classification + guided-only exclusion is the independence signal WS2 already uses for `hasIndependentAttemptProduction`, **without** the workspace-fallback (that fallback would over-trigger review on guided workspaces).

If `productionKinds` exist and `response_fulfilment` is missing, **WS1 already fails** (`S78_WS_UNBOUND_PRODUCTION`). S78-WS-3 then also fails for the missing review. Both gates fire at the same capture; WS1 remains the production-surface owner.

### D3. Exclusions (deterministic)

**Do not automatically require diagnostic review when:**

| Case | Why excluded |
| ---- | ------------ |
| Reading / orientation / study-only | `isStudyOrVerifyStep` — no `productionKinds` |
| Passive explanation / model-only | No classified production; model rows are teaching |
| Trivial acknowledgement | Not classified as table_* or `text_compose` production |
| Genuinely guided-only practice | `isGuidedOnlyActivity` — scaffolding, not independent attempt |
| Verify/checklist/revise-only steps | Already excluded from load-bearing production by WS1 |

**Do not forbid** a deliberately commissioned diagnostic checklist on a non-triggered activity (reflective/review activity). If `diagnostic_review` is present when the trigger is false, validate shape/closure only — do **not** reject it as unexpected.

### D4. Exactly one review per activity

| Trigger | Cardinality |
| ------- | ----------- |
| False | **Zero required.** Zero or one deliberate `diagnostic_review` allowed. |
| True | **Exactly one** `required_materials[]` row with `material_type: "checklist"` **and** `diagnostic_review` |

That one review’s criteria collectively cover the activity’s bound independent production (`covers_response_material_ids` closes over every `response_fulfilment` row — §7).

**Forbidden fragmentations:**

- one checklist per response field
- one checklist per workspace
- one checklist per material
- one checklist per learner-task sentence
- a second automatic diagnostic review on the same activity

Ordinary non-diagnostic checklists (legacy tick-lists without `diagnostic_review`) **do not count** toward the invariant and **must not** satisfy it.

### D5. Earliest authoritative owner

**Selected: C — EP expresses pedagogical intent; DLA owns fail-closed commissioning.**

| Option | Verdict |
| ------ | ------- |
| **A. EP/archetype is authoritative** | **Rejected as fail-closed owner.** Production identity (`response_fulfilment`, productionKinds) is not authoritative until DLA. Making `verification` mandatory in every productive archetype would over-constrain guided practice, legitimate reflection/transfer closure, and orientation-heavy Understand sequences. |
| **B. DLA commissioning is authoritative (EP silent)** | **Almost** — DLA **is** the fail-closed owner, but EP should not silently imply that transition/reflection **are** diagnostic review. |
| **C. Split** | **Selected.** EP may continue to plan `verification` / `reflection` / `transfer` / `transition` as pedagogical beats. **DLA** is the earliest layer that can deterministically know whether substantive independent production exists and must commission the review. |
| **D. Other** | Not needed. |

T-003’s optional idea — require EP `verification` whenever production exists — is **not selected**. Production is not yet bound at EP. A separate EP “review required” semantic would **duplicate DLA**.

### D6. Episode / archetype responsibility

**No EP production change is necessary.**

Smallest permitted follow-up (optional, in T-022 only if cheap): a **comment** in `DEFAULT_ROLE_BY_FUNCTION` / grammar notes, parallel to the S78-WS-2 `independent_performance` note:

> Episode **closure** (verification \| reflection \| transfer \| transition) is **structural**. It does **not** satisfy S78-WS-3 diagnostic review of independent production. That review is commissioned by DLA.

| Question | Answer |
| -------- | ------ |
| Should `verification` become conditionally required? | **No** |
| Should the grammar merely clarify semantics? | **Yes, optionally** — comment only |
| Should productive archetypes carry an intent DLA later realises? | Existing beats already express intent; DLA realises the review when the trigger fires |
| Can reflection satisfy diagnostic review? | **Only if** it is realised as the activity’s `diagnostic_review` checklist covering bound production. A generic “reflect on what you did” beat **cannot** |
| Can transition satisfy diagnostic review after substantive production? | **Never** |
| Separate “review required” EP semantic? | **No** — would duplicate DLA |

`verification` cardinality remains **0–1**. Closure OR-group remains. T5 ordering unchanged **if** verification appears.

### D7. Representation / binding

T-003’s judgement (“existing checklist + guided_criteria is enough; need a lightweight fail-closed commission”) is **confirmed**.

| Option | Verdict |
| ------ | ------- |
| **A. No new metadata** | **Rejected as sole mechanism.** Activity membership can prove a checklist exists; it cannot prove **exactly one diagnostic** review **covers all** bound production, or distinguish a stray tick-list from the review. Same failure class as pre–WS1 specification-prose-only. |
| **B. Lightweight metadata on the checklist** | **Selected** — parallel to `response_fulfilment` / `practice_independence`. |
| **C. Activity-level metadata declaring the review** | **Rejected** — extra object; the checklist row is the natural owner; GAM already keys authoring off that row. |
| **D. New review object / parallel schema** | **Rejected** — existing checklist + `guided_criteria` already renders the A5 pattern. |

**Binding meaning:** “This single diagnostic review covers these learner-owned response obligations.”

Do **not** bind criteria individually.

### D8. GAM / assembly / renderer

| Layer | Change in this architecture |
| ----- | --------------------------- |
| GAM prompt | **None** in first implementation — existing “if checklist → `guided_criteria`” instructions are already strong enough that A5 succeeded whenever the row existed |
| GAM projection | **Yes, mechanical** — `copyOwnFieldIfPresent(..., "diagnostic_review")` so GAM sees coverage ids (same path as `practice_independence`) |
| GAM capture | **Deferred** unless a post-T-022 exhibit emits Markdown instead of `guided_criteria` for a `diagnostic_review` row |
| Assembly | **None** — do not infer missing reviews |
| Renderer | **None** — `renderGuidedReviewBody` already presents what / why / expected / repair / confirm under one “Review your answer” section |

---

## 3. Canonical invariant (expanded)

### 3.1 What the invariant is

A **diagnostic review** is a learner-facing, post-attempt inspection of **the learner’s own production** against explicit quality dimensions, with an opportunity to repair and confirm.

### 3.2 What the invariant is not

- Not “every activity needs a checklist.”
- Not automatic marking or Prism-assessed scoring.
- Not one review per response component.
- Not the T-017/T-018 operational-suitability verifier.
- Not a requirement that EP include a `verification` beat.
- Not a wall of feedback prose.

### 3.3 Relationship to existing contracts

| Contract | Relationship |
| -------- | ------------ |
| **S78-WS-1** | Identifies load-bearing production and binds **blank response surfaces**. Unchanged. Review **covers** those surfaces; it does not create them. |
| **S78-WS-2** | Model must not complete the attempt. Review criteria may name **method** checks; they **MUST NOT** disclose the attempt answer. Unchanged. |
| **P02 / evidence_requirement** | Unrelated. Evidence providers are not review objects. |
| **G1 / DLA-WB-26** | **Superseded** by S78-WS-3 for commissioning. See §15. |

---

## 4. Trigger and exclusions (worked)

### 4.1 Cross-disciplinary trigger examples (all TRUE)

| Domain | Typical `productionKinds` | Review |
| ------ | ------------------------- | ------ |
| Mathematics | `text_compose` and/or table_* for derivation, calculation, interpretation | One review, several criteria |
| Humanities | `text_compose` (argument + evidence + interpretation) | One review, several criteria; no single correct answer |
| Programming | `text_compose` (code + explanation) and/or structured workspace | One review covering behaviour, design/logic, explanation |
| Data / statistics | table_* + `text_compose` interpretation | One review covering table + interpretation |
| Design / creative | artefact workspace + rationale text | One review covering artefact + rationale against explicit criteria |

### 4.2 False-trigger guards

| Case | `productionKinds` | Guided-only | Review required |
| ---- | ----------------- | ----------- | --------------- |
| Read the model; no independent attempt | empty | n/a | **No** |
| Guided practice with hints / jointly completed steps | may be non-empty | **true** | **No** (automatic) |
| Independent table + interpretation | non-empty | false | **Yes** |
| Model + independent attempt (WS2 case) | non-empty | false | **Yes** — review the **attempt**, not the model |
| Capstone interpretation only (A5-shaped) | non-empty (`text_compose`) | false | **Yes** |

---

## 5. DLA commissioning design

This is the central repair.

### 5.1 Where the checklist row is commissioned

In the triggered activity’s `required_materials[]`, as **one** additional row:

- `material_type`: `"checklist"` (existing)
- `purpose`: diagnostic review of the learner’s independent production (short; not a second learner_task)
- `specification`: 3–4 (hard max 5) **quality dimensions** covering the bound production — existing checklist specification rules, made **mandatory when the trigger fires** rather than “when a checklist exists”
- `diagnostic_review`: binding object (§7)
- **MUST NOT** carry `response_fulfilment` (checklists remain teaching/check; WS1 already forbids teaching-only types as production surfaces)

The row coexists with operand, model, workspace, and scaffold rows like any other `required_materials[]` entry. It is **not** a production surface.

### 5.2 Cardinality

Enforced at DLA capture:

- Trigger true → count of rows with `diagnostic_review` **=== 1**
- Trigger false → count **∈ {0, 1}** (deliberate review allowed)

A second `material_type: checklist` **without** `diagnostic_review` does not satisfy or duplicate the invariant (it is simply another material). Prefer **not** commissioning extra checklists; capture does not need to ban them unless they also carry `diagnostic_review`.

### 5.3 How DLA knows which components it reviews

From **WS1 identities already on the activity**: every `required_materials[]` row that carries `response_fulfilment`. Those `material_id`s are the production the review covers.

`learner_task` steps inform **criterion dimensions** in `specification`; they are **not** the binding keys.

### 5.4 Stage-1 fail-closed if missing

```text
activityRequiresDiagnosticReview(activity) === true
AND (no diagnostic_review checklist OR covers_response_material_ids does not close)
→ DLA capture FAIL
```

Do **not** wait for GAM, assembly, renderer, or QA.

### 5.5 Existing specification fields

**Sufficient.** Current salient slot already requires:

- 3–4 diagnostic criteria (hard max 5)
- alignment to task / `expected_output` / outcomes
- quality dimension + features to examine
- criterion-specific correction
- GAM owns learner-facing why / features / repair

T-022 changes the slot from **conditional on checklist presence** to **conditional on the S78-WS-3 trigger**, and requires the `diagnostic_review` object on that row.

---

## 6. Binding / representation (normative shape)

**Owner:** DLA, on the diagnostic `checklist` row only.

**Field name:** `diagnostic_review`

**Shape:**

```json
"diagnostic_review": {
  "covers_response_material_ids": ["A3-M3"]
}
```

Compound production:

```json
"diagnostic_review": {
  "covers_response_material_ids": ["A2-M3", "A2-M4"]
}
```

| Rule | Requirement |
| ---- | ----------- |
| Presence | **MUST** on the unique diagnostic checklist when the trigger is true |
| Type | object; only field `covers_response_material_ids` |
| `covers_response_material_ids` | non-empty array of distinct non-empty strings |
| Closure | set-equal to the set of `material_id`s of same-activity rows that carry `response_fulfilment` |
| Same-activity | every id MUST identify a `required_materials[]` row on **this** activity |
| Forbidden on | non-checklist rows; production/workspace rows; model rows |
| Cardinality | at most one `diagnostic_review` object per activity |
| Projection | T-023 path: `copyOwnFieldIfPresent(rm, row, "diagnostic_review")` |

**Do not** add criterion-level ids, review objects at activity root, or a new material type.

`response_fulfilment` remains the **production identity**. `diagnostic_review.covers_response_material_ids` **references** those identities. It does not duplicate response-space metadata (no `response_kind`, no blank-cell rules).

---

## 7. Relationship to `response_fulfilment` / WS1

Desired chain:

```text
learner produces response
  → WS1 response surface exists (blank, bound)
  → S78-WS-3 diagnostic review inspects that production
  → learner can revise / confirm
```

| Activity shape | Binding |
| -------------- | ------- |
| One response | `covers_response_material_ids: ["A1-M2"]` |
| Several response components | one array listing **all** fulfilment ids |
| Table cells | cover the **table material id**, not each cell |
| Free text | cover the text-production material id |
| Mixed structured / unstructured | cover every fulfilment id; criteria inside the one review address each component |

**Do not modify WS1 semantics.** Checklists still MUST NOT carry `response_fulfilment`. Review does not create, fill, or replace response surfaces.

---

## 8. Checklist commissioning specification (DLA)

Minimum DLA `specification` for the diagnostic checklist row:

1. Name **3–4** (max **5**) diagnostic **dimensions** that cover the bound production as a whole.
2. Each dimension names a **quality aspect of the learner’s production** (not a restatement of “complete the task”).
3. Each dimension names **observable features** the learner should look for.
4. Specification must support **criterion-specific correction** if a feature is missing (GAM will author `repair`).
5. Dimensions for compound production map to components (derivation / calculation / interpretation / …) **inside this one specification**, not as extra rows.
6. **MUST NOT** include the attempt’s target answer, completed model solution, or WS2-forbidden attempt particulars.
7. **MUST NOT** write learner-facing questions, why-it-matters essays, feature arrays, or confirmation labels.

**Compact quality invariant for each criterion (GAM-authored, already contracted):**

> A criterion is adequate iff it states a checkable quality of the learner’s production, a short reason it matters, at least one observable expected feature, a specific repair if that feature is absent, and a confirm/revise action — without disclosing the attempt solution.

Do **not** add a JavaScript semantic judge of “genuinely good feedback.”

---

## 9. One-review aggregation (compound production)

Conceptual activity: derive, calculate, interpret, verify — possibly several response fields.

**DLA represents this as:**

- several `response_fulfilment` rows (or one compound workspace — WS1 decides surfaces)
- **one** checklist with `diagnostic_review.covers_response_material_ids` listing **all** those ids
- **one** specification listing several dimensions (derivation, calculation, interpretation, verification)

**Learner experience:** one “Review your answer” section (existing renderer title) containing several criteria. Not four review panels. Not four checklists.

If WS1 binds a single table covering all components, `covers_response_material_ids` has **one** id and the specification still lists multiple dimensions. Coverage is of **production obligations**, not of “one criterion per id.”

---

## 10. Single-production behaviour

One substantive response → still **one** compact review:

- one `covers_response_material_ids` entry
- fewer dimensions (still 3–4 band; do not invent a special single-field schema)
- same `guided_criteria` path

No extra metadata. No activity-level review object.

---

## 11. Guided-practice, model-only, explanation-only

| Activity class | Automatic S78-WS-3 |
| -------------- | ------------------ |
| Guided-only (`isGuidedOnlyActivity`) | **Does not trigger** |
| Model-only / explanation-only / read-only | **Does not trigger** (`productionKinds` empty) |
| Independent production after a model | **Triggers** (review the attempt) |
| Deliberate review/reflection activity with a commissioned `diagnostic_review` | **Allowed** even if trigger is false |

Guided practice may still contain hints and scaffolds. Independent performance preserves learner-owned reasoning. The trigger reuses that distinction; it does not invent a new one.

---

## 12. Reflection, consolidation, transition

Keep **episode closure** and **feedback architecture** conceptually distinct.

| Beat / material | May satisfy S78-WS-3? |
| --------------- | --------------------- |
| **Reflection** (“reflect on what you did”) | **No**, unless the activity’s diagnostic checklist **is** the review and covers bound production. Generic reflection **coexists**; it does not substitute. Do not force a duplicate section when the diagnostic review already includes a metacognitive criterion. |
| **Consolidation** | **Only if** realised as the diagnostic checklist with full criterion obligations. A summary of content does not inspect production. |
| **Transition** | **Never.** Structural closure only. Cannot silently remove the review. |
| **Transfer** | Transfer tasks may **themselves** be independent production (then they get their **own** activity’s review). Transfer does not replace review of a prior attempt. |

---

## 13. WS2 relationship

Review criteria **may** reinforce the modelled **method**:

- Good: “Check that every constraint term appears in your Lagrangian with the correct sign.”
- Bad: “Your multiplier should equal 4.”

**Design rule only (no WS2 contract change):**

- DLA specification and GAM `repair` / `expected` **MUST NOT** disclose the attempt operand’s target solution (existing guided-review `looksCompleteModelAnswer` / MP-1 spirit).
- `covers_response_material_ids` points at **attempt** surfaces, never at the model row.
- Do **not** alter `practice_independence`.

---

## 14. Operational-suitability verifier boundary

| | T-017 / T-018 verifier | S78-WS-3 |
| - | ---------------------- | -------- |
| Question | Can the learner **complete the commissioned task** from these generated particulars? | After attempting it, can the learner **inspect and improve** their response? |
| Owner | Temporary GAM instrumentation ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)) | DLA commissioning + existing guided review |
| PASS means | Particulars are usable | **Not used.** Do not treat verifier PASS as evidence that review exists |

**Do not:** extend the verifier; make it judge feedback quality; add another verification pass; use it as a Check/revision gate.

---

## 15. G1 / DLA-WB-26 contradiction — resolution

**Selected: A — the historical “every activity MUST have a checklist” rule is too broad and is replaced by S78-WS-3.**

| Surface | Current | Target (T-022) |
| ------- | ------- | -------------- |
| Packed G1 / DLA-WB-26 | every activity MUST list checklist | **Replace** with S78-WS-3 (trigger → exactly one `diagnostic_review` checklist) |
| Salient commissioning slot | “when required_materials includes type checklist” | “when S78-WS-3 trigger is true” |
| `validateDla38LObligations` | not on Copy capture; still says every activity needs checklist | **Do not revive** on Copy capture. Do **not** enforce DLA-WB-26 as written. New capture lives beside WS1/WS2 gates |
| Evaluate pack (DLA-WB-31) | Evaluate-specific checklist among other Evaluate obligations | **Unchanged** as an Evaluate completeness pack; S78-WS-3 still applies if that Evaluate activity has independent production (the Evaluate checklist **should** be the `diagnostic_review` row, not a second list) |

Do **not** blindly revive a rule that would add checklists to passive activities.

`dla-38l-obligation-check.js` remains harness/smoke until a later rationalisation; T-022 **must not** wire it into Copy capture.

---

## 16. GAM propagation

Existing successful path (A5 / T-008 A4):

```text
DLA checklist → GAM authors guided_criteria → assembly → renderer guided review
```

**T-022 must:**

1. Commission the checklist reliably (DLA).
2. Project `diagnostic_review` into the GAM commission JSON (`copyOwnFieldIfPresent`).
3. Leave existing GAM guided-review generation guidance in place.

**T-022 must not** add redundant GAM prompt prose. Authoritative commission + deterministic projection + **local salience only where needed** (S78 principle). Local salience is **not needed** on current evidence: GAM already authors A5-quality `guided_criteria` when a checklist exists.

**T-023 (GAM salience) is authorised only if** a post-T-022 exhibit shows the commissioned diagnostic checklist authored as a Markdown tick-list or otherwise not `review_mode: guided_criteria`.

If T-023 is needed, the change is a **keyed** reminder when `diagnostic_review` is present: emit `guided_criteria` JSON covering the listed response ids; do not add a general essay. Estimate then: a few hundred characters, SP-05 / GAM checklist block only.

---

## 17. `guided_criteria` quality contract

Inspected: `lib/guided-review-generation-contract.js` (`71-GUIDED-REVIEW-QUALITY-2`) and `renderGuidedReviewBody`.

Already expresses:

| Need | Field / UI |
| ---- | ---------- |
| What to inspect | `statement` |
| Why | `why_it_matters` → “Why this matters” |
| Observable evidence | `features[].expected` |
| Repair | `features[].repair` |
| Confirm / revise | `confirmation_label` + checkbox; section title “Review your answer” |

**Reuse unchanged.** No renderer redesign. A5 remains renderable on this path.

Optional compactness guidance (prompt-only, **only if T-023 is opened**): prefer short `why_it_matters`; do not exceed existing 3–4 criteria / 2–3 features band. Not part of T-022.

---

## 18. Assembly / renderer

**No change required.** T-003 classified both as non-causal; this design does not alter that.

Do not infer missing reviews in assembly. Do not manufacture pedagogical content in the renderer.

Accessibility / usability: existing guided-review UI already uses one section, per-criterion panels, progress (“Criterion *n* of *m*”), and confirmation checkboxes. Criterion count stays in the existing 3–4 (max 5) band. **No UI redesign.**

---

## 19. Cross-disciplinary design check

| Domain | One review covering | Diagnostic, not answer-key |
| ------ | ------------------- | -------------------------- |
| Mathematics | derivation + calculation + interpretation (+ method check) | Look-fors on structure/sign/feasibility, not the numeric key |
| Humanities | argument + evidence use + interpretation | Criteria on warrant/qualification, not one correct thesis |
| Programming | behaviour + design/logic + explanation/debug | Observable runtime/logic features, not pasted solution code |
| Data / statistics | table completion + interpretation | Completeness + justified reading of the learner’s figures |
| Design / creative | artefact + rationale against explicit criteria | Stated design criteria, not a hidden model artefact |

The trigger and binding are domain-neutral (`productionKinds` + fulfilment ids).

---

## 20. Regression matrix (R1–R15) — Stage-1 expected behaviour

Stage-1 = DLA capture. PASS = capture accepts (and commissions the review when required). FAIL = capture rejects.

| ID | Scenario | Stage-1 |
| -- | -------- | ------- |
| **R1** | Substantive single independent response | **FAIL** without exactly one `diagnostic_review` checklist covering that fulfilment id; **PASS** with it |
| **R2** | Compound independent production | **FAIL** unless exactly one review; criteria live in that row’s specification (not validated semantically); `covers_response_material_ids` lists all fulfilment ids |
| **R3** | Several response fields | **FAIL** if one checklist per field with multiple `diagnostic_review` objects, or if coverage omits an id; **PASS** with one review covering all ids |
| **R4** | Guided-only practice | **PASS** with zero diagnostic review (automatic requirement off) |
| **R5** | Model-only | **PASS** with zero diagnostic review |
| **R6** | Explanation / read-only | **PASS** with zero diagnostic review |
| **R7** | Independent production + reflection beat | **FAIL** if only reflection and no `diagnostic_review` checklist; reflection does not substitute |
| **R8** | Independent production + transition closure | **FAIL** if transition-only and no diagnostic checklist; transition cannot remove the review |
| **R9** | Open-ended humanities response | **FAIL** without the review row; **PASS** with diagnostic checklist (no answer-key field required) |
| **R10** | Programming task with independent production | same as R1/R2 |
| **R11** | WS1 coexistence | Review row **MUST NOT** carry `response_fulfilment`; workspace rows remain blank-bound; existing WS1 errors still fire |
| **R12** | WS2 coexistence | `practice_independence` unchanged; review must not target the model id; no Stage-1 semantic leak check (same as WS2 Stage-1) |
| **R13** | A5-style positive exemplar | **PASS** if the capstone checklist carries `diagnostic_review` covering its production; same renderer path |
| **R14** | Duplicate automatic diagnostic reviews | **FAIL** if two `diagnostic_review` objects on one activity |
| **R15** | No review-per-field fragmentation | **FAIL** if multiple diagnostic checklists; **PASS** only for the single activity-level review |

Deliberate `diagnostic_review` on a non-triggered activity: **PASS** if shape/ids close (or ids empty only if there is no fulfilment — prefer requiring ids to match whatever fulfilment exists, including empty ⇒ omit binding / do not attach `diagnostic_review` without coverage). **Rule:** if `diagnostic_review` is present, `covers_response_material_ids` MUST equal the activity’s fulfilment-id set (empty set ⇒ **do not** attach the object; a checklist without binding is a non-diagnostic checklist).

---

## 21. Stage-1 validation design

Deterministic capture only. Prefer a small helper (mirror `dla-production-fulfilment.js` / `dla-practice-independence.js`), invoked from `validateDlaPartialPageCapture`.

**Checks:**

1. Compute trigger via existing classifiers.
2. Count `diagnostic_review` objects; enforce cardinality (§5.2).
3. If present: object shape; checklist `material_type`; same activity; `covers_response_material_ids` set-equals fulfilment ids; no duplicate ids; unknown ids fail.
4. `diagnostic_review` forbidden on non-checklist rows.
5. Required specification presence: non-empty `specification` on the diagnostic checklist row (already a generic row obligation — do not parse pedagogical quality).

**Conceptual diagnostic codes** (do not implement in this task):

| Code | Meaning |
| ---- | ------- |
| `S78_DR_MISSING_REVIEW` | Trigger true; no `diagnostic_review` checklist |
| `S78_DR_DUPLICATE_REVIEW` | More than one `diagnostic_review` on the activity |
| `S78_DR_COVERAGE_MISMATCH` | `covers_response_material_ids` ≠ fulfilment ids |
| `S78_DR_UNKNOWN_ID` | Covered id not on this activity |
| `S78_DR_WRONG_HOST` | `diagnostic_review` on a non-checklist row |

**Do not:**

- LLM review pass for feedback
- JavaScript judgement of whether generated feedback is “good”
- Semantic comparison of criteria vs domain answers

If semantic quality remains stochastic after structural repair, that is **later evidence**, not part of this design.

---

## 22. Prompt-salience design

Follow T-009 / WS1 / WS2:

| Surface | T-022 change |
| ------- | ------------ |
| **§4 Production** | After WS1: when trigger true, exactly one diagnostic checklist with `diagnostic_review` is **mandatory** |
| **§6 Commissioning** | Field shape + “covers all `response_fulfilment` ids”; replace “when checklist exists” with “when S78-WS-3 trigger” |
| **§10 OUTPUT** | Conditional **DR-1 closure** invariant + **one** pre-output checklist item |
| Packed G1 / DLA-WB-26 | **Replace** with S78-WS-3 (net size likely **flat or down**) |
| GAM contract | **No change** unless T-023 |

Do not bury the obligation in general packed prose. Keep prompt growth bounded.

**Likely prompt-size impact (T-022):**

| Block | Estimate |
| ----- | -------- |
| §4 invariant sentence | ~200–350 chars |
| §6 field shape | ~400–700 chars |
| §10 DR-1 + checklist item 6 | ~250–450 chars |
| G1 replacement | **−200 to −500** (broad MUST removed) |
| **Net** | **~400–900 chars**, similar to WS2; possibly near-neutral if G1 deletion is complete |

Contract version label (proposed): `78-DLA-WS-3` (extends `78-DLA-WS-2`).

---

## 23. Earliest fail-closed point

```text
DLA Copy capture
  activityRequiresDiagnosticReview === true
  AND missing/illegal diagnostic_review commission
→ FAIL (before GAM)
```

Secondary (not required in T-022): GAM could later reject a `diagnostic_review` row whose body is not `guided_criteria` — **only if T-023 evidence appears**.

EP capture does **not** fail for missing `verification`. Assembly does **not** fail-closed-invent a review.

---

## 24. Historical positive exemplar and 88/100 exhibit

**A5 becomes deterministic:** any activity that triggers S78-WS-3 must emit the same class of commission A5 happened to emit (checklist + later `guided_criteria`). Luck is replaced by capture.

**A1–A4 on the 88/100 run:** those activities had substantive independent production and **no** diagnostic checklist. After implementation they would be **illegal DLA** until one activity-level `diagnostic_review` checklist covering their `response_fulfilment` ids is commissioned. GAM would then author `guided_criteria` on the proven path. Domain-specific feedback content is **not** specified here.

This does **not** claim F&S will become a particular number.

---

## 25. Benchmark expectation

If implementation succeeds and a fresh generation is later authorised:

**Primary evidence (architectural):**

- Substantive productive activities receive **one** coherent diagnostic review
- Compound responses are reviewed **coherently** (one section, multiple criteria)
- A5 quality **pattern** is architectural rather than incidental
- WS1 blank surfaces and WS2 operand independence remain intact
- Passive / guided-only / model-only activities are **not** cluttered with automatic reviews

Feedback & Self-Regulation **should improve if T-003 is correct**, but this design is **not** for a numerical QA score. Do not tune criterion count to the rubric. Do not expect this repair alone to manufacture ≥90 (other dimensions already 88–94).

Out of scope for that regeneration judgement: activity timing (T-019), horizontal rules, stray blank lines, A3 maths workspace presentation, Settings, image persistence, verifier product decision.

---

## 26. Implementation decomposition

Inspected PLAN: **T-021** is this design; **T-019** remains queued timing; **T-022+ are free**.

**Minimise implementation. Prefer one bounded implementation task.**

| Task | Status after T-021 | Scope |
| ---- | ------------------ | ----- |
| **S78-T-022** | **Recommended next** (not started; do not begin until authorised) | DLA S78-WS-3: contract §4/§6/§10 + G1 replacement; `diagnostic_review` shape; capture helper + `validateDlaPartialPageCapture` gate; T-023 projection of the field; prompt-contract + capture tests for R1–R15 structural cases |
| **S78-T-023** | **Conditional — do not open by default** | GAM salience **only if** T-022 exhibit shows insufficient `guided_criteria` authoring for commissioned diagnostic checklists |
| **S78-T-024** | **After T-022** (and T-023 only if opened) | Integration verification / fresh benchmark — **not** T-019; **not** T-013 closure |

**T-022 anticipated files (when authorised):** `lib/ld-dla-page-enrich-contract.js`, `lib/page-dla-enrich.js`, small helper (e.g. `lib/dla-diagnostic-review.js`), `app.js` projection only, `tests/s78-dla-diagnostic-review.test.js` (and existing DLA contract tests). **No** schema redesign, **no** renderer, **no** assembly, **no** verifier, **no** WS1/WS2 semantic edits.

**Do not** pull into T-022: activity timing, HR/blank lines, A3 workspace presentation, Settings, image mismatch, operational-suitability verifier.

Each task authorised separately. Do **not** start T-022 in this task.

---

## 27. Sprint boundary

This repair is **only** diagnostic-review architecture (Workstream 3).

Still separately logged / out of scope:

- activity timing (T-019)
- horizontal rules between activities
- stray blank lines
- A3 maths workspace presentation
- Settings effectiveness
- image persistence/mismatch
- operational-suitability verifier product decision (S78-D02)
- T-013 WS2 / operand validity

---

## 28. Verification (this design task)

| Criterion | Met? |
| --------- | ---- |
| D1–D12 resolved | Yes |
| Trigger reuses existing production classification | Yes |
| Exactly-one review; compound via criteria not extra checklists | Yes |
| Owner C; EP not fail-closed | Yes — no verification cardinality change |
| Smallest representation (`diagnostic_review` on checklist) | Yes |
| No second review schema | Yes |
| WS1/WS2/verifier untouched | Yes |
| G1 superseded, not blindly revived | Yes |
| Stage-1 only | Yes |
| No implementation in T-021 | Yes |
| Sprint 78 remains OPEN | Yes |

---

## 29. Files changed (this task)

| File | Change |
| ---- | ------ |
| This record | Design complete |
| `STATUS.md` | T-021 design complete; T-022 named not started |
| `PLAN.md` | T-021 complete; T-022/T-023/T-024 queued per this design |
| `SPRINT-78-START-HERE.md` | T-021 complete |
| `S78-T-003-check-revision-architecture-diagnostic.md` | Cross-ref: design complete; EP cardinality tightening **not** selected |
| `S78-T-013-workstream-2-integration-verification.md` | Cross-ref only: T-021 does not close T-013 and does not extend the verifier |

**Production / test / prompt / schema / validator / assembly / renderer:** **ALL NO**

---

## 30. Recommended next task

**S78-T-022 is complete.** See [S78-T-022](S78-T-022-dla-diagnostic-review-commissioning-implementation.md). Next: **S78-T-024** integration verification when authorised; **T-023** conditional only.  
Do **not** start T-019.  
Do **not** start T-023 unless a later exhibit proves GAM authoring insufficient.  
**T-013 remains OPEN** (WS2 / operational suitability). Resume that operator path separately; this design does **not** close T-013.

---

## 31. References

- [S78-T-003](S78-T-003-check-revision-architecture-diagnostic.md)  
- [S78-T-004](S78-T-004-learner-production-workspace-fulfilment-solution-design.md) — S78-WS-1 pattern  
- [S78-T-010](S78-T-010-modelling-practice-independence-solution-design.md) — S78-WS-2 pattern  
- [S78-T-009](S78-T-009-dla-p02-provider-row-output-shape-salience-repair.md) — §10 salience pattern  
- `lib/dla-production-fulfilment.js` · `lib/dla-practice-independence.js` · `lib/ld-dla-page-enrich-contract.js` · `lib/guided-review-generation-contract.js` · `lib/episode-plan-v1-archetype-grammar.js` · `lib/learner-renderer-vnext/render-material.js`

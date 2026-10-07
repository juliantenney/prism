# Gate 7 — Assessment Pack product invariants

**Sprint:** 93 — Assessment Pack Educational Contract  
**Gate:** 7 — **COMPLETE / PASSED** (2026-10-07)  
**Depends on:** Gate 6 PASSED · Gate 5 PASSED · Gate 4 PASSED · Gate 3 PASSED (R1/R2) · Gate 2 PASSED · Gate 1 ACCEPTED  
**Decision:** [S93-D08](decisions.md#s93-d08--gate-7-assessment-pack-product-invariants-complete--passed)  
**Invariant:** NON-SUMMATIVE · production code **frozen** · client-side HTML/CSS/JS delivery only (no runtime LLM)

---

## Purpose of this gate

Derive the **smallest strong set of product invariants** every valid Assessment Pack must satisfy — regardless of R1/R2, response form, treatment mechanism, standalone vs commissioned use, determinate vs non-determinate evidence, or eventual pipeline/schema/rendering.

Protect educational identity already earned. Do **not** create an exhaustive quality checklist. Do **not** restate every authoring responsibility as an invariant.

| Kind | Meaning |
| ---- | ------- |
| **Hard invariant** | Violation means the artefact is **no longer a valid Assessment Pack** |
| **Strong authoring norm** | Important for quality; context-sensitive; **not** identity-defining |

Gate 7 does **not** design pipeline, schemas, enums, prompts, or implementation.

---

## Settled contract (Gates 3–6 — not reopened)

Assessment Pack creates a deliberate progression stop whose centre of gravity is **interpretable formative evidence about the learner** (R1 / R2). Learner spine: **visible · honest · formative · forward-looking**. Client-side honesty; NON-SUMMATIVE. Authoring responsibilities AR1–AR5 protect fulfilment but are **not** themselves invariants or stages.

---

## Candidate collapse (A)

Eight candidates were pressure-tested. Overlaps collapsed:

| Candidate | Fate |
| --------- | ---- |
| Evidence-of-learner | **Kept** as AP-I1 (absorbs centre-of-gravity ownership + anti-developmental-absorption) |
| Formative-purpose | **Merged** into AP-I4 (purpose without return is incomplete identity) |
| Epistemic honesty | **Kept** as AP-I2 |
| Proportionate elicitation | **Merged** with capability integrity into AP-I3 |
| Consequential formative return | **Kept** as core of AP-I4 |
| Forward-orientation | **Merged** into AP-I4 (forward meaning is part of formative completeness) |
| Educational handoff | **Kept** as AP-I5 (conditional / standalone expression) |
| Non-summative | **Kept** as AP-I6 |

Long Gate 4 negative list collapsed into the **negative clause of AP-I1**.

---

## 1. Smallest stable hard-invariant set

### AP-I1 — Evidence-of-learner centre of gravity

The **principal educational job** of the experience must be to make learner **state and/or capability inspectable as formative evidence** (R1 and/or R2).

**Negative clause (compact):** Surface form, journey position, recording, feedback presence, independence, resemblance to “assessment,” existence of a correct key, constructed responses, or incidental evidence do **not** confer Assessment Pack identity. The product must **not** absorb substantial developmental machinery merely to manufacture the capability it then inspects (mixed fail-closed).

### AP-I2 — Epistemic honesty

The experience must **never claim or imply** that a learner response has been evaluated in ways the **deterministic client-side learner runtime cannot legitimately determine**.

Authoring-time reasoning may be deep; runtime presentation must remain honest. Partial determination (e.g. one keyed facet) must be **separable** from what was not judged.

### AP-I3 — Evidence-fit elicitation

The requested learner performance must be **capable of revealing** the state/capability the pack claims to make visible.

**Capability-evidence integrity clause:** Assessment Pack must not decompose or scaffold a performance in ways that **destroy the capability** it is intended to make visible.

This protects **fit between evidence design and claimed capability**. It does **not** require all R2 work to be integrated or extended. Closed-form Gate 1 checks remain valid when the claimed visibility is appropriately closed-form. Integrated Gate 2 performances (A `c7`/`c9`, B terminal, C `c9`) must not be atomised into trivial items that falsify the claim.

### AP-I4 — Formative completeness

After elicitation, the learner must receive **enough authored return** to make **meaningful formative use** of the elicited evidence, including an **intelligible implication for their next learning move**.

- Never “responded → stored → complete.”
- Determinate work: honesty-compatible correctness/explanatory return is legitimate.
- Non-determinate work: **self-evaluation sufficiency** applies (see §3).
- Forward orientation is **advisory** — the pack orients without controlling pathway (no locks/skips/remediation routing as product behaviour).

### AP-I5 — Dependency and entry-assumption honour

When the pack depends on prior learner work or claimed prerequisites:

- honour explicit educational dependencies;
- **name** what the learner must bring forward and how it will be used;
- do **not** recreate, replace, or independently determine work the journey assigns to earlier experiences;
- do **not** depend on inaccessible hidden runtime state.

**Standalone:** establish **explicit entry assumptions** rather than inventing hidden prior work or silently teaching substantial prerequisites.

(Universal LJ commission handoff is **referenced**, not redefined — see §5.)

### AP-I6 — Non-summative

The product must not perform grading, certification, high-stakes progression decisions, formal marking, moderation, gradebooks, academic-integrity enforcement, or institutional assessment-management functions.

“Readiness” remains formative information for the learner’s next move — never a high-stakes gate.

---

## 2. Strong authoring norms — explicitly NOT invariants

These matter for quality but are **context-sensitive** and not identity-defining:

| Norm (not invariant) | Why not hard |
| -------------------- | ------------ |
| Exact amount of scaffolding / framing | Varies with role and independence |
| Whether light revision is offered | Useful often; not always required |
| Whether a model response is used | Often wrong under plurality |
| Whether criteria are explicit lists vs other supports | Self-eval sufficiency is the invariant; form of support is free |
| Whether the learner retains a revised artefact | Persistence design deferred |
| Exact length / effort / component count | Proportion is about fit (AP-I3), not quotas |
| Particular feedback presentation / timing UI | Mechanism freedom |
| Role-specific wording patterns | AR emphasis, not identity |
| Depth of misconception diagnostics beyond honest determination | Quality enhancement within AP-I2 |

Legitimate educational design freedom remains inside the hard set.

---

## 3. Self-evaluation sufficiency invariant

**Clause of AP-I4 (non-determinate cases):**

> When the learner runtime cannot legitimately determine the quality of a response, the authored Assessment Pack must provide **sufficient material for the learner to inspect that response meaningfully themselves**.

**What “sufficient” minimally entails (educational, not a treatment enum):**

The support must enable the learner to establish at least some meaningful relationship between:

1. **their response**;
2. **qualities, reasoning, considerations, or contrasts** relevant to the intended state/capability;
3. **implication** for reconsideration and/or subsequent learning.

It does **not** prescribe model answers, rubrics, criteria lists, comparison examples, widgets, or a fixed pattern. Authoring selects the **smallest sufficient** support for the epistemic case (Gate 6 AR4).

**Plurality protection (also under AP-I2):** A model response must not falsely collapse legitimate plural conclusions.

---

## 4. Capability-evidence integrity rule

Retained as the integrity clause of **AP-I3** (see above).

| Valid | Invalid under AP-I3 |
| ----- | ------------------- |
| Gate 1 closed forms when claim is closed-form knowledge/understanding visibility | Atomising A `c7`/`c9`, B terminal, or C `c9` into trivial keyed items that no longer elicit the claimed integrated capability |
| Integrated constructed performance when that is the claim | Scaffolding that turns independent judgement evidence into guided developmental practice (also risks AP-I1) |

---

## 5. Commission / handoff relationship

| Layer | Status |
| ----- | ------ |
| **Universal PRISM / Learning Journey commission handoff** | Already settled (Sprint 92+): honour explicit dependencies; no recreate/replace/independently determine earlier work; learner-facing bring-forward; no hidden state. Gate 7 **references** this — does not duplicate a second universal rule set. |
| **Assessment Pack-specific expression (AP-I5)** | Same honour duties applied to evidence stops: design elicitation/return around named prior work; standalone uses explicit entry assumptions; never silently teach prerequisites inside AP. |

Shared invariant spirit; AP-I5 is the Assessment Pack identity expression of that spirit for this product.

---

## 6. Compact negative invariant

Absorbed into **AP-I1 negative clause** — not a separate numbered invariant:

> Surface form, position, and incidental evidence do not determine Assessment Pack ownership; educational centre of gravity does — and developmental absorption falsifies that centre of gravity.

---

## 7. Pressure-test results (valid cases)

| # | Case | AP-I1…I6 hold? | Accidental exclusion? | Form/impl encoded? |
| - | ---- | -------------- | --------------------- | ------------------ |
| 1 | Diagnostic MCQs | **Yes** — R1 evidence stop; determinate honesty; fit; formative+advisory forward; entry/journey context; non-summative | No | No |
| 2 | Mid-journey knowledge check | **Yes** | No | No |
| 3 | Short explanation + authored comparison | **Yes** — non-determinate self-eval sufficiency | No | No |
| 4 | A `c7` readiness checkpoint | **Yes** — integrated fit protected by AP-I3 | No | No |
| 5 | A `c9` independent causal evaluation | **Yes** — plurality under I2/I4 | No | No |
| 6 | B terminal professional judgement | **Yes** — I5 handoff critical | No | No |
| 7 | C `c9` contested-claim investigation | **Yes** — unresolved excellence under I2/I3/I4 | No | No |

Could an educationally **invalid** pack satisfy a weaker set? Yes — hence I4 (blocks storage-only), I2 (blocks fake marking), I1 (blocks teaching-then-check absorption), I3 (blocks atomisation). See §8.

---

## 8. Invalid counterexamples (rejected)

| Counterexample | Hard invariant(s) violated | Why educationally rejected |
| -------------- | -------------------------- | -------------------------- |
| Essay collected and merely stored (“assessment complete”) | **AP-I4** (also formative purpose collapse) | No meaningful formative use; evidence collection ≠ Assessment Pack |
| Auto-check quiz claiming to judge nuanced professional reasoning | **AP-I2** (+ often **AP-I3**) | Runtime cannot determine that judgement; dishonest evaluation claim; fit mismatch |
| Pack with extensive teaching/practice before its check | **AP-I1** | Centre of gravity becomes development; violates mixed fail-closed |
| Final task atomising integrated capability into trivial items | **AP-I3** | Evidence design destroys the claimed capability |
| Commissioned pack silently recreating earlier learner work | **AP-I5** | Breaks educational handoff; replaces prior product’s work |

---

## 9. AR1–AR5 → invariant protection mapping

| Hard invariant | Primarily protected by authoring responsibility |
| -------------- | ----------------------------------------------- |
| **AP-I1** Evidence-of-learner | **AR1** interpret purpose / product coherence; constrained by **AR2** (non-developmental elicitation design) |
| **AP-I2** Epistemic honesty | **AR3** determine judgement boundaries; enforced in **AR4** return design |
| **AP-I3** Evidence-fit elicitation | **AR2** design elicitation; purpose fidelity from **AR1** |
| **AP-I4** Formative completeness | **AR4** formative return + forward orientation; epistemic class from **AR3** |
| **AP-I5** Dependency / entry honour | **AR5** handoffs and entry assumptions; shapes **AR1**/**AR2** |
| **AP-I6** Non-summative | Cross-cutting constraint on **AR1** purpose and **AR4** return (never grades/gates) |

**For Gate 8 (dependency hint only — not topology):**  
AR1 before AR2; AR3 before honest AR4; AR5 constrains AR1–AR4 whenever dependencies/assumptions apply. This is **reasoning dependence**, not a stage list.

---

## 10. Exact questions carried into Gate 8

Gate 8 (predetermined pipeline) should answer, using AP-I1…I6 and AR1–AR5:

1. How should AR1–AR5 map onto predetermined continuous-conversation stages (merge, split, or shared stages with intent parameters)?
2. Does R1 vs R2 warrant differentiated stage topology, or only role/intent parameters within shared stages?
3. Where must epistemic classification (AR3 / AP-I2) occur relative to elicitation design (AR2) and return authoring (AR4) so honesty cannot be bypassed?
4. How does the pipeline ensure formative completeness (AP-I4) is authored before the artefact boundary — including self-evaluation support when non-determinate?
5. How are commission handoffs / entry assumptions (AP-I5) made binding inputs to authoring without inventing runtime state transport?
6. What must remain true of the **current** Gate 1 three-stage assessment pipeline, and what must change for Gate 2 constructed / non-determinate demand — still without schema freeze?

Deferred to Gate 9+: canonical structured artefact; response/treatment enums; prompts; implementation.

---

## Gate 7 decision checklist

| Criterion | Assessment |
| --------- | ---------- |
| Small hard set protects identity across Gate 1 + Gate 2 cases | **Met** (AP-I1…I6) |
| Hard vs strong-norm distinction applied aggressively | **Met** |
| Self-evaluation sufficiency without treatment enum | **Met** |
| Capability integrity without privileging essays | **Met** |
| Commission/handoff referenced + AP-specific expression | **Met** |
| Invalid counterexamples clearly rejected | **Met** |
| No pipeline / schema / enum / code | **Met** |

**Recommendation: PASS.**

Stable enough to proceed to Gate 8 (predetermined pipeline).

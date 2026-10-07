# Gate 6 — Assessment Pack authoring responsibilities

**Sprint:** 93 — Assessment Pack Educational Contract  
**Gate:** 6 — **COMPLETE / PASSED** (2026-10-07)  
**Depends on:** Gate 5 PASSED · Gate 4 PASSED · Gate 3 PASSED (R1/R2) · Gate 2 PASSED · Gate 1 ACCEPTED  
**Decision:** [S93-D07](decisions.md#s93-d07--gate-6-assessment-pack-authoring-responsibilities-complete--passed)  
**Invariant:** NON-SUMMATIVE · production code **frozen** · client-side HTML/CSS/JS delivery only (no runtime LLM)

---

## Purpose of this gate

Define the **authoring intellectual responsibilities** required before a valid Assessment Pack can cross the structured artefact boundary.

> What educational reasoning must authoring perform so the learner contract (**visible · honest · formative · forward-looking**) is fulfilable in an ordinary client-side artefact?

**This gate defines RESPONSIBILITIES, not pipeline stages.**  
Several responsibilities may later share one model stage; one responsibility may span more than one stage. Gate 8 decides the predetermined pipeline. Gate 9 decides the canonical artefact. Gate 6 must not freeze either.

Do **not** decide here: stage count/names, prompts, schemas, response-form enums, treatment enums, UI/widgets, rendering, persistence.

---

## Settled input (Gates 3–5 — not reopened)

| Settled | Statement |
| ------- | --------- |
| Product | Deliberate progression stop; centre of gravity = interpretable formative evidence about the learner |
| Roles | **R1** formative state inspection · **R2** formative capability-evidence elicitation |
| Learner spine | **Visible · honest · formative · forward-looking** |
| Honesty | Never imply evaluation beyond what the deterministic learner runtime can determine |
| Mixed rule | AP must not absorb substantial developmental machinery to manufacture the capability it inspects |
| Runtime | Client-side only; determinate check where genuine; otherwise authored self-evaluation |

No contradiction requiring reopening of prior gates was found.

---

## Hard authoring/runtime distinction

| Time | May do |
| ---- | ------ |
| **Authoring (before artefact boundary)** | Deep educational reasoning about purpose, performance, epistemic status, criteria, contrasts, next-move meaning — including model involvement |
| **Learner runtime** | Present authored material; run only determinations the client-side artefact can honestly perform; support learner self-evaluation where judgement is not determinable |

Authoring may be sophisticated. The runtime must remain **honest**.

---

## 1. Minimal authoring responsibility set

Five responsibilities. Order is logical dependence, **not** a pipeline design.

| # | Responsibility | Core question |
| - | -------------- | ------------- |
| **AR1** | **Interpret the evidence purpose** | What about the learner must this stop make visible, why, for which next move — and is that coherently Assessment Pack? |
| **AR2** | **Design the evidence elicitation** | What learner performance would make that state/capability interpretable, without developmental absorption or dishonest atomisation? |
| **AR3** | **Determine epistemic judgement boundaries** | What can the runtime legitimately determine, and what must remain authored self-evaluation? |
| **AR4** | **Author formative return and forward orientation** | What smallest sufficient post-response support makes the stop formative and forward-looking? |
| **AR5** | **Honour educational handoffs and entry assumptions** | What prior work or entry assumptions must be named and designed around — without recreation or hidden state? |

AR5 constrains AR1–AR4 whenever dependencies or standalone assumptions apply; it is listed separately because it is a distinct intellectual duty, not a Stage 5.

---

## A. AR1 — Interpret the evidence purpose

Authoring must reason, before designing elicitation, about:

| Duty | Detail |
| ---- | ------ |
| Role | Identify whether the commission is principally **R1**, **R2**, or a coherent combination with a clear primary emphasis |
| Visibility target | Exactly what learner state and/or capability the stop intends to make visible |
| Timing rationale | Why making it visible matters **at this point** (checkpoint, culmination, pre-learning orientation, etc.) |
| Purpose distinction | Separate **evidence purpose** from any adjacent learning/development purpose (that development belongs to siblings) |
| Forward intent | What subsequent learning move the evidence should support (orientation, concentration, capability insight — not pathway control) |
| Product coherence | Confirm the stop is coherent as Assessment Pack rather than Interactive / Situated / Expository (Gate 4 discriminator) |

**Commissioned use** — interpret:

- `specification_text`;
- `journey_context_text`;
- `dependencies`;
- prior learner work expected to exist;
- intended subsequent progression.

**Standalone use** — establish explicit entry assumptions and ensure the requested evidence is coherent with them (see §7).

If interpretation shows substantial development is required to manufacture the capability, authoring must **fail closed or redesign within boundary** (see §8) — not absorb Interactive/Situated/Expository work into AP.

---

## B. AR2 — Design the evidence elicitation

Authoring must design a performance that makes the intended state/capability **interpretable**.

| Duty | Detail |
| ---- | ------ |
| Evidence-bearing performance | Determine what the learner must do/express/produce/demonstrate so the intended evidence exists |
| Integration / decomposition | Choose a degree of integration that matches the capability; **preserve integrated performance when integration is itself part of the capability** (Gate 2 A/B/C) |
| Independence / scaffolding | Set independence appropriate to the stop (checkpoint vs culmination) without turning AP into guided developmental practice |
| Stimulus economy | Provide sufficient context/source/case/stimulus for *this* elicitation — **non-developmental** (Gate 4 framing bound) |
| Judgement vs checklist | Avoid reconstructing a checklist where adaptive judgement is intended |
| Plurality / uncertainty | Preserve legitimate uncertainty and plural defensible conclusions where educationally required |
| Proportion | Effort and stopping conditions proportionate to the evidence purpose |
| Capability vs activity | Distinguish evidence of state/capability from incidental completion |

**Not a response-type catalogue.**  
“Write an essay” is not the responsibility. “Design a performance that makes integrated causal judgement interpretable” is.

---

## C / 4. AR3 — Determine epistemic judgement boundaries

Before authoring formative return, authoring must establish the **epistemic status** of the elicited response — protecting Gate 5 honesty.

Authoring must answer:

1. Is there genuinely **determinate** correctness?
2. Are there important expected elements with **variable legitimate expression**?
3. Are **multiple conclusions** defensible?
4. Is **uncertainty** itself part of good performance?
5. Would a single **model answer** falsely imply one authorised conclusion?
6. Which aspects can the **browser / client artefact** legitimately determine?
7. Which aspects must remain **learner self-evaluation**?

### Determinate / non-determinate authoring distinction

| Classification | Authoring may prepare | Authoring must not prepare as if runtime-judged |
| -------------- | --------------------- | ----------------------------------------------- |
| **Determinate** | Correctness logic the runtime can apply; explanatory feedback; misconception-sensitive explanation **only where deterministically inferable**; advisory next-priority cues from checkable patterns | Soft “quality scores,” AI-style interpretation, or implied marking beyond the key |
| **Non-determinate** (incl. partial) | Authored self-evaluation support; clear separation of any small determinate facets from the rest | Any presentation that reads as PRISM having evaluated the free/constructed judgement |

**Authoring-time depth ≠ runtime authority.** The model may reason deeply at authoring; the learner runtime may not pretend to reproduce that judgement.

---

## D / 5. AR4 — Author formative return and forward orientation

### Formative return

Authoring must produce the **smallest sufficient** post-response support so the stop is formative rather than storage-only.

**Determinate evidence** — authoring may create:

- correctness logic;
- explanatory feedback;
- misconception-sensitive explanation where deterministically inferable;
- orientation toward next learning priorities (advisory).

**Non-determinate evidence** — authoring must create a sufficient **self-evaluation support set** (conceptual, not a widget kit).

### Minimum conceptual self-evaluation-support responsibility

Authoring must **decide** which of the following are necessary for *this* stop, and produce those — not default to “all of them”:

| Ingredient family | Use when… |
| ----------------- | --------- |
| Criteria / qualities worth attending to | Learner needs dimensions of strength |
| Substantive reasoning to compare against | Comparison aids inspection of their own reasoning |
| Contrasting plausible responses/approaches | Plurality is real; single model would mislead |
| Important considerations / common omissions | Helps notice gaps without pretending a score |
| Treatment of uncertainty | Uncertainty is part of excellence (A `c9`, C `c9`) |
| Self-inspection prompts | Guide how to examine one’s own response |
| Light reconsideration / revision | Deepens formative use of *this* evidence (not Interactive development) |
| Next-move implications | Closes the forward-looking contract |

**Selection rule:** Choose the **smallest set** that makes formative sense-making possible for the epistemic status established in AR3. A **model response is only one optional ingredient** and is educationally wrong where multiple conclusions are legitimate.

### Forward move (E)

Authoring must establish what the learner should take away — **orientation, not adaptive runtime routing**.

| Role emphasis | Forward-move authoring typically establishes |
| ------------- | -------------------------------------------- |
| **R1** | Picture of current state; areas needing attention; confidence calibration cues; priorities for subsequent learning |
| **R2** | Strengths/limitations of demonstrated capability; optional light revision outcome; unresolved uncertainty; next development focus; what to carry into subsequent experience |

The product may **orient** the learner without controlling journey progression (no locks, skips, remediation pathways).

---

## F / 6. AR5 — Honour educational handoffs and entry assumptions

### Educational-handoff authoring rule

When Assessment Pack consumes earlier work, authoring must:

1. Understand what prior learner work the commission says exists;
2. Design the elicitation and formative return **around** that work where required;
3. Tell the learner what to bring forward and how it will be used;
4. Avoid recreating or independently determining work owned by earlier products;
5. Avoid assuming inaccessible hidden runtime state.

**Gate 2 B pressure:** Terminal professional judgement must be designed to reconnect with workplace evidence/reasoning produced earlier — not re-run the Situated Task or re-interpret evidence as if AP owned the investigation.

**Underspecified / incoherent dependency:** Authoring must recognise failure (see §8) or redesign within boundary (clarify bring-forward as learner-supplied; narrow the evidence claim). Do **not** invent runtime interoperability.

### Standalone / entry-assumption authoring rule (§7)

For standalone packs, authoring must:

- state explicit entry assumptions (prior knowledge/capability);
- ensure requested evidence is coherent with those assumptions;
- supply task purpose, stimulus, and formative return under those assumptions;
- **not** silently teach missing prerequisites inside AP.

---

## G / 3. R1 vs R2 authoring

### Shared (universal) responsibilities

AR1–AR5 all apply. Honesty, proportion, non-developmental framing, formative return, forward orientation, and handoff/entry coherence are universal.

### Legitimate differences (intent / emphasis — not separate products)

| | **R1** | **R2** |
| - | ------ | ------ |
| Core authoring question | What is true of the learner’s **present state**, and what should that **orient** them toward? | What **performance** would make the intended **capability** interpretable, and what formative use can the learner make of that evidence? |
| Elicitation design (AR2) | Inspectable state probes (knowledge, belief, confidence, readiness) | Capability-bearing performances (understanding, judgement, integrated transfer) |
| Formative return / forward (AR4) | Emphasise advisory concentration / next priorities from state visibility | Emphasise quality dimensions / strength / limits of demonstrated capability, then next-move meaning |

### Status for Gate 8

These differences are **substantial authoring branches in reasoning**, but **not yet** a decision to split pipelines or product IDs. Gate 8 may realise them as:

- shared stages with role-sensitive intent parameters; or
- differentiated stage emphasis within one predetermined pipeline.

Gate 6 records the difference; it does **not** freeze stage topology.

---

## H / 8. Authoring failure conditions

Authoring should recognise that a **valid Assessment Pack cannot be produced** from the request as given when:

| Failure condition | Why |
| ----------------- | --- |
| Requested “assessment” is actually substantial teaching/development | Violates product boundary / mixed fail-closed rule |
| Requested evidence cannot reveal the claimed capability | Elicitation would not fulfil evidence purpose |
| Prerequisite capability neither supplied nor reasonably assumed | Entry/handoff incoherence |
| Dependency refers to learner work that cannot be meaningfully brought forward | Handoff impossible without hidden state or recreation |
| Task requires runtime interpretation PRISM cannot perform | Violates honesty / client-side boundary |
| Requested automatic judgement would be epistemically dishonest | Violates honesty invariant |
| Integrated capability atomised until the intended capability disappears | Falsifies R2 evidence purpose |
| Model answer falsely collapses legitimate plural conclusions | Epistemic misrepresentation |
| Formative return would amount only to recording completion | Violates formative contract |

**Authoring duty:** fail closed or redesign within the Assessment Pack boundary (narrow claim, separate developmental sibling commission, change epistemic classification, strengthen self-eval support). Do **not** design validation codes/errors here.

---

## I / 9. Pressure-test results

| # | Case | AR1 purpose | AR2 performance | AR3 determine? | AR4 return + forward | AR5 handoff/entry | Failure risk |
| - | ---- | ----------- | --------------- | -------------- | -------------------- | ----------------- | ------------ |
| 1 | Diagnostic MCQs | R1: inspect present knowledge for orientation | Closed probes of targeted misconceptions/knowledge | Determinate keys | Correctness + explanation + advisory priorities | Entry assumptions or pre-journey position | Teaching content instead of inspecting |
| 2 | Mid-journey knowledge check | R2 (or R1 if purely orienting): evidence of understanding | Proportionate closed checks | Determinate | Feedback + next-move cues | Builds on prior learning named | Becoming a practice Interactive |
| 3 | Short explanation + comparison | R2: evidence of reasoning | Constructed explanation (integration as needed) | Non-determinate (wording varies) | Criteria/comparison/self-prompts; light reconsider; next move | Prior context named | Pretending free text was “marked”; Interactive re-teach |
| 4 | A `c7` readiness checkpoint | R2 checkpoint: emerging integrated causal capability | Integrated causal-argument performance — **not** atomised MCQ set | Non-determinate / plural | Self-eval on reasoning quality; forward to later work | Prior Interactive development named | Atomisation; developmental coaching inside AP |
| 5 | A `c9` independent causal evaluation | R2 culmination: independent integrated evaluation | Sustained independent argument under uncertainty | Non-determinate; uncertainty legitimate | Contrasts/criteria honouring plural conclusions; no single verdict | Prior checkpoint/learning named | Single model answer as authorised truth |
| 6 | B terminal professional judgement | R2: integrated professional judgement evidence | Judgement performance using prior workplace evidence | Non-determinate; success ≠ criterion | Criteria on judgement/use of evidence; next-move; no certification | **Bring-forward** Situated/Interactive record — reconnect, don’t recreate | Recreating situated work; scoring intervention success |
| 7 | C `c9` contested-claim investigation | R2: sustained independent integrated transfer | Independent investigation/judgement performance | Non-determinate; unresolved can be excellent | Criteria that honour unresolved; contrasts; forward meaning | Prior Interactive `c6`–`c8` development named — not repeated | Predetermined verdict; keeping judgement developmental inside AP |

Responsibilities explain all seven **without** becoming response-form-specific.

---

## 10. Implications Gate 7 should test as product invariants

Gate 7 (product invariants) should pressure-test whether a valid Assessment Pack **must always**:

1. Embody an interpretable evidence purpose (R1 and/or R2) coherent with the product boundary;
2. Elicit a performance proportionate to that purpose, preserving integration when required;
3. Declare (in the artefact’s educational design) what is determinate vs self-evaluated;
4. Provide meaningful formative return — never completion-only;
5. Orient a forward learning move without controlling pathway;
6. Name bring-forward / entry assumptions when dependence exists;
7. Remain NON-SUMMATIVE and runtime-honest (client-side determinations only).

Gate 7 should also test negative invariants already suggested by Gates 4–6 (not AP merely because questions/feedback/independence/end-of-journey/etc.).

---

## 11. Unresolved questions deferred to Gate 7 / 8

**Gate 7 (invariants):**

1. Which of the AR1–AR5 duties are **hard product invariants** vs strong authoring norms?
2. What is the minimal **invariant** statement of self-evaluation sufficiency without enumerating treatment modes?
3. Are there invariants about **commission honour** that Learning Journey and Assessment Pack share?

**Gate 8 (pipeline) — not decided here:**

4. How should AR1–AR5 map onto predetermined stages (merge, split, role-sensitive branches)?
5. Does R1 vs R2 warrant differentiated stage topology or only intent parameters within shared stages?
6. Where does epistemic classification (AR3) sit relative to elicitation design (AR2) and return authoring (AR4) in stage order?

Deferred beyond Gate 8: schemas, response/treatment enums, prompts, implementation.

---

## Gate 6 decision checklist

| Criterion | Assessment |
| --------- | ---------- |
| Responsibilities derived from Gates 3–5 contracts | **Met** |
| Minimal set explains Gate 1 closed-form and Gate 2 constructed cases | **Met** |
| Determinate/non-determinate authoring distinction protects honesty | **Met** |
| Conceptual self-evaluation support without widgets/enums | **Met** |
| Handoff + standalone entry-assumption authoring rules | **Met** |
| Failure conditions without validation design | **Met** |
| Explicitly not a pipeline / schema / enum decision | **Met** |

**Recommendation: PASS.**

Stable enough to proceed to Gate 7 (product invariants). AR1–AR5 are responsibilities awaiting Gate 8 staging — not stages themselves.

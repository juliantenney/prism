# Gate 5 — Assessment Pack learner contract

**Sprint:** 93 — Assessment Pack Educational Contract  
**Gate:** 5 — **COMPLETE / PASSED** (2026-10-07)  
**Depends on:** Gate 4 PASSED · Gate 3 PASSED (R1/R2) · Gate 2 PASSED · Gate 1 ACCEPTED  
**Decision:** [S93-D06](decisions.md#s93-d06--gate-5-assessment-pack-learner-contract-complete--passed)  
**Invariant:** NON-SUMMATIVE · production code **frozen** · client-side HTML/CSS/JS delivery only (no runtime LLM)

---

## Hard runtime boundary (constraint — not mechanism design)

Learner delivery remains ordinary **client-side HTML/CSS/JS**:

- no runtime LLM; no backend; no server-side learner-response evaluation; no automatic AI interpretation, grading, or marking;
- where correctness is genuinely deterministic, deterministic checking is legitimate;
- where a response cannot legitimately be checked deterministically, PRISM must **not** pretend to evaluate it — the authored experience must support meaningful learner self-evaluation;
- **NOWHERE NEAR SUMMATIVE ASSESSMENT.**

Model involvement ends at the structured artefact boundary. Gate 5 does **not** design implementation mechanisms.

---

## Settled input (Gates 3–4 — not reopened)

| Settled | Statement |
| ------- | --------- |
| Product | Deliberate progression stop; centre of gravity = **interpretable formative evidence about the learner** |
| Roles | **R1** formative state inspection · **R2** formative capability-evidence elicitation |
| Dimensions | Role × response/performance form × formative treatment remain **separate** |
| Discriminator | Evidence-of-learner → AP; develop via engagement → Interactive; situated doing → Situated; explain → Expository |
| Mixed rule | Fail closed to **separation**; AP must not manufacture the capability it inspects |
| Handoff | Explicit dependencies; learner-facing bring-forward; no hidden runtime state transport |

No genuine contradiction with Gates 3–4 was found. Product ownership and role discovery are **not** reopened.

---

## 1. Concise Assessment Pack learner contract

> When you enter an Assessment Pack, you are at a **deliberate pause** whose purpose is to make something about your **present state or capability visible as formative evidence**, and then to help you **use that evidence formatively**.
>
> You will be told what is being made visible and why it matters for learning. You will be asked for a performance proportionate to that evidence. After you respond, you will receive a **meaningful formative return** — either deterministic correctness/explanatory feedback where that is legitimate, or authored support for **self-evaluation** where automatic judgement would be dishonest.
>
> PRISM will **never imply** that your response has been evaluated in ways the learner runtime cannot actually determine. Prior work you are asked to bring forward will be named clearly. You will leave knowing what this evidence means for your **next learning move**. This is **not** grading, certification, or a high-stakes gate.

---

## A / 2. Orientation responsibilities

Before elicitation, the learner is entitled to understand:

| Responsibility | Contract expectation |
| -------------- | -------------------- |
| **What is being made visible** | What about their current state (R1) and/or capability (R2) this stop is eliciting |
| **Why formatively** | How that visibility is useful for subsequent learning (orientation, checkpoint information, capability insight) — not assessment-management language |
| **Prior context** | What prior work, knowledge, or materials (if any) they need, and how those will be used |
| **Nature of “correctness”** | Whether this stop has a determinate correct answer, expects important reasoning with variable expression, or admits plural defensible conclusions / justified uncertainty |
| **Formative use ahead** | What kind of formative return they can expect (checkable feedback vs authored self-evaluation support) — so they need not guess whether PRISM is “marking,” inviting judgement, or inviting comparison |

The learner should not have to **infer** the educational character of the stop. Gate 5 does **not** prescribe UI labels or copy patterns — only that orientation make these distinctions intelligible.

**Out of orientation language:** grades, marks, pass/fail, certification, institutional assessment management.

---

## B / 3. Elicitation responsibilities

The Assessment Pack must ask the learner to do, express, produce, or demonstrate something that can yield **evidence appropriate to the educational role**.

| Responsibility | Contract expectation |
| -------------- | -------------------- |
| **Intelligible ask** | The learner understands what is being elicited |
| **Proportion** | The requested performance matches the intended evidence (neither tokenistically thin nor developmentally overloaded) |
| **Sufficient stimulus** | Enough context, source, case, or stimulus material is present for the elicitation itself |
| **Preserve integration** | Where integrated performance **is** the capability being elicited, the pack must not atomise it merely because smaller auto-checkable items are easier (Gate 2 finding 8; A `c7`/`c9`, B terminal, C `c9`) |
| **Legitimate plurality** | Where educationally legitimate, uncertainty and plural defensible conclusions remain possible |
| **Stopping conditions** | Learner effort expectations and when the elicitation is complete are intelligible |

Do **not** prescribe response forms. The same contract covers diagnostic MCQs, short constructed explanations, readiness checkpoints, integrated arguments, and sustained independent judgements with no predetermined verdict.

**Anti-pattern:** changing the educational job into fragmented item performance solely to enable automatic checking.

---

## C / 4. Formative-return responsibilities

### Critical distinction

| After elicitation | Contract |
| ----------------- | -------- |
| **Deterministically checkable** responses | The experience **may** provide correctness and/or explanatory feedback that the runtime can honestly determine |
| **Non-deterministically checkable** responses | The experience **must** provide authored means for meaningful **learner self-evaluation** — PRISM must not pretend to have judged the response |

### Minimum sufficient formative return

The stopping point is formative only if the learner receives enough to make **meaningful formative use** of their response. Minimum educational responsibilities:

1. **Give the learner something substantive to work with** after responding — not storage acknowledgement alone.
2. For checkable responses: **honest correctness/explanatory return** where determination is legitimate.
3. For non-checkable responses: **authored self-evaluation support** that typically includes some combination of:
   - something substantive to compare against (criteria, qualities, model and/or contrasting responses, worked reasoning);
   - help noticing strengths, omissions, alternatives, or uncertainty;
   - clear signal that a model/contrast is **not** the single authorised answer where plural conclusions are legitimate;
   - opportunity for **reconsideration or light revision** where that deepens formative use of *this* evidence — not a large developmental Interactive cycle;
   - reconnection to what the evidence means for the **next learning move**.

### What formative return is *not*

| Forbidden / insufficient | Why |
| ------------------------ | --- |
| “I wrote something; PRISM stored it; assessment complete.” | Evidence collection without formative use |
| Implied AI/human marking the runtime cannot perform | Violates honesty invariant |
| Large developmental feedback / practice / investigation loops | Smuggles Interactive into AP; violates Gate 4 centre of gravity |
| Grades, scores-as-judgement-of-worth, pass/fail | Summative territory |

**Minimum sufficient** = enough for formative sense-making of *this* elicited evidence and orientation to the next move — **not** re-teaching the capability.

---

## D / 5. Determinate vs non-determinate — honesty rule

### Honesty invariant (accepted)

> **Assessment Pack must never imply that a learner response has been evaluated in ways the deterministic learner runtime cannot actually determine.**

Refinement: “Evaluated” includes correctness marking, quality scoring, “your answer is good/weak,” AI interpretation, or any presentation that reads as an authoritative judgement the client-side artefact cannot honestly produce.

### Pressure cases

| Case | PRISM may legitimately determine | Must remain learner judgement | Authored support for formative completeness | Must never claim |
| ---- | -------------------------------- | ----------------------------- | ------------------------------------------- | ---------------- |
| 1. Factual/closed with correct answer | Match to authored key / options | — (beyond optional reflection on why) | Correctness + explanatory note as authored | Nothing beyond what the key supports |
| 2. Short explanation; expected reasoning, variable wording | At most narrow deterministic facets if genuinely keyed; usually **little/nothing** automatic on free text | Quality/completeness of reasoning vs authored criteria | Criteria / model-contrast / self-check prompts | That free text was “marked correct” |
| 3. Causal argument; several defensible judgements | Nothing as categorical correctness of the conclusion | Strength of reasoning, use of evidence, calibration of uncertainty | Criteria, contrasting defensible positions, quality dimensions | A single “right” verdict |
| 4. Professional improvement judgement; success ≠ criterion | Nothing as workplace-success score | Judgement quality / use of prior evidence | Criteria, contrast, next-move prompts | Competence certification or intervention-success marking |
| 5. Contested claim; “unresolved” can be excellent | Nothing as true/false of the claim | Whether justification and epistemic stance are sound | Criteria that honour unresolved conclusions; contrasts | Predetermined claim verdict as the measure of excellence |

Where determination is partial (e.g. one closed facet inside a larger constructed stop), honesty requires **separating** what was checked from what was not.

---

## E / 6–7. Bring-forward and carry-forward

### Bring-forward rule

When Assessment Pack depends on prior journey work:

1. **Name it:** The learner must know what they need from earlier experience (artefact, record, findings, prior response, notes taken outside PRISM, etc.).
2. **Acknowledge without recreating:** AP may reference and use that work for the evidence stop; it must not recreate, replace, or re-determine the earlier learning activity.
3. **How it will be used:** State how brought-forward material figures in the elicitation and/or formative return.
4. **No hidden state:** Must not depend on inaccessible cross-product runtime transport.
5. **Outside PRISM:** If prior work was recorded outside PRISM, the pack still names what to bring and how to use it (learner-supplied), without inventing silent import.

Commission-level honour of explicit dependencies (Gate 4 / Sprint 92 handoff) remains binding.

### Carry-forward rule

The learner should leave the Assessment Pack with **formative meaning**, not merely a stored response. Depending on role and treatment, carry-forward typically includes some combination of:

| Possible carry-forward | Notes |
| ---------------------- | ----- |
| Their response (and any light revision made as part of formative return) | Trace of the elicited evidence |
| A clearer judgement of current state (R1) or of the strength/limits of demonstrated capability (R2) | Formative self-knowledge |
| Identified uncertainty, gaps, or plural live possibilities | Especially where no single verdict |
| A next learning priority or advisory concentration | Especially R1; also R2 when evidence informs next move |

Exact persistence/transport is **out of scope**. Educationally, the learner must be able to **understand what to take forward** from the stop.

---

## F / 8. Standalone entry-assumption rule

Standalone Assessment Pack remains first-class. With no Learning Journey commission context, it owes the learner:

| Owed | Expectation |
| ---- | ----------- |
| **Entry assumptions** | Explicit statement of assumed prior knowledge/capability |
| **Required context** | What the learner needs in place to attempt the stop fairly |
| **Task purpose** | Orientation responsibilities (§2) still apply |
| **Stimulus** | Sufficient material for the elicitation itself |
| **Formative return** | §4 still applies |

If meaningful evidence would require capability the pack cannot reasonably assume, the pack must **make that entry assumption explicit** rather than silently teaching the prerequisite inside Assessment Pack (Gate 4).

**Authoring coherence (educational principle, not validation design):** An Assessment Pack whose requested evidence is incoherent given its own stated entry assumptions is educationally defective. How/when authoring surfaces that failure is deferred — Gate 5 only establishes that coherence is a learner-contract obligation on the authored experience.

---

## G / 9. R1 and R2 — shared vs different

One product; shared contract spine; role-sensitive emphasis.

### Shared across R1 and R2

- Intelligible purpose and formative character  
- Proportionate elicitation with sufficient stimulus  
- Honesty about what is/ isn’t evaluated  
- Meaningful formative return  
- Honour bring-forward; intelligible carry-forward  
- Preserve plurality/uncertainty where legitimate  
- NON-SUMMATIVE; client-side honesty  

### Legitimately different emphasis

| | **R1 — Formative state inspection** | **R2 — Formative capability-evidence elicitation** |
| - | ----------------------------------- | -------------------------------------------------- |
| Visibility ask | Make **present state** (knowledge, belief, confidence, readiness) inspectable | Make **capability evidence** (understanding, judgement, integrated performance) inspectable |
| Formative return emphasis | Orient toward **what to concentrate on next** / advisory next-move meaning | Support judgement about **quality, strength, limits** of the demonstrated performance, then next-move meaning as appropriate |
| Typical carry-forward | State picture + concentration priorities | Performance trace + calibrated sense of capability + next-move implications |

Do **not** split into two products or separate learner-delivery systems on this basis.

---

## H / 10. Learner-facing invariants (minimal set)

1. **Purpose is intelligible** — the learner knows what is being made visible and why formatively.  
2. **Elicitation is proportionate** — the ask matches the intended evidence; integration is preserved when it is the capability.  
3. **No false claims of evaluation** — honesty invariant.  
4. **Meaningful formative return** — never storage-only completion.  
5. **Prior learner work is honoured** — named bring-forward; no recreate; no hidden state.  
6. **Carry-forward is intelligible** — the learner knows what this evidence means for next learning.  
7. **Plurality preserved where appropriate** — uncertainty / plural defensible conclusions remain legitimate when the educational job requires it.

Memorable spine: **visible · honest · formative · forward-looking.**

---

## 11. Pressure-test results

| # | Experience | Contract guidance without form-specific rules? |
| - | ---------- | ---------------------------------------------- |
| 1 | Pre-test diagnostic MCQs | **Yes** — R1 orientation; determinate check + explanatory/advisory return; carry-forward = concentration priorities |
| 2 | Mid-journey closed knowledge check | **Yes** — R2 (or R1 if purely orienting); determinate feedback legitimate; formative, not gate |
| 3 | Short constructed explanation + authored comparison | **Yes** — non-determinate honesty; formative return = comparison/criteria/self-eval; light reconsideration ok; not Interactive re-teach |
| 4 | Gate 2 A `c7` causal-argument readiness checkpoint | **Yes** — R2 checkpoint; preserve integration; no forced single key; self-eval support + next-move meaning; bring-forward prior Interactive learning named |
| 5 | Gate 2 A `c9` independent causal evaluation | **Yes** — R2 culmination; plurality/uncertainty allowed; never claim categorical verdict evaluation; formative return on reasoning quality dimensions |
| 6 | Gate 2 B terminal professional judgement | **Yes** — bring-forward Situated/Interactive record named; success ≠ criterion; no competence certification; reconnect without recreate |
| 7 | Gate 2 C `c9` contested-claim investigation | **Yes** — unresolved can be excellent; honesty forbids predetermined verdict as excellence measure; self-eval criteria must honour that |

All seven are governed by the same contract spine; form remains a separate later dimension.

---

## 12. Unresolved questions for Gate 6 (authoring responsibilities)

Gate 6 should define what the Assessment Pack **pipeline / authoring process** must intellectually produce — without freezing schema or response enums:

1. What authored intellectual work is required to fulfil orientation, elicitation, and formative return for R1 vs R2?
2. What must authors produce differently for determinate vs non-determinate evidence stops (still not a form taxonomy)?
3. What authoring obligations follow from bring-forward / entry-assumption coherence?
4. What is the minimum authored “self-evaluation kit” conceptually (families of support), without designing UI widgets or feedback-mode enums?
5. How should commission text from Learning Journey constrain authoring so handoffs are honoured and development is not absorbed?

Deferred beyond Gate 6: response-form catalogue; treatment catalogue; schema; pipeline stage list; prompts; implementation.

---

## Gate 5 decision checklist

| Criterion | Assessment |
| --------- | ---------- |
| Learner contract covers closed-form and constructed Gate 2 demand | **Met** |
| Orientation / elicitation / formative return defined at contract level | **Met** |
| Honesty invariant for determinate vs non-determinate | **Met** |
| Bring-forward / carry-forward / standalone entry assumptions | **Met** |
| R1/R2 shared spine with role-sensitive emphasis | **Met** |
| Minimal learner-facing invariants | **Met** |
| No form taxonomy / treatment enum / schema / pipeline / code | **Met** |

**Recommendation: PASS.**

Stable enough to proceed to Gate 6 (authoring responsibilities).

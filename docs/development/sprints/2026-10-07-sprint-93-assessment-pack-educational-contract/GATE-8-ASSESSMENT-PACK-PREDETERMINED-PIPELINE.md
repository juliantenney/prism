# Gate 8 — Assessment Pack predetermined pipeline

**Sprint:** 93 — Assessment Pack Educational Contract  
**Gate:** 8 — **COMPLETE / PASSED** (2026-10-07)  
**Depends on:** Gate 7 PASSED (AP-I1…I6) · Gate 6 PASSED (AR1–AR5) · Gates 1–5 PASSED  
**Decision:** [S93-D09](decisions.md#s93-d09--gate-8-assessment-pack-predetermined-pipeline-complete--passed)  
**Invariant:** NON-SUMMATIVE · production code **frozen** · client-side HTML/CSS/JS delivery only (no runtime LLM)

---

## Purpose of this gate

Derive the **predetermined Assessment Pack authoring pipeline** from the educational contract, AR1–AR5, and AP-I1…I6.

> **The product determines the pipeline. Pipeline is part of product definition.**

Do not preserve the current pipeline merely because it exists. Do not copy Situated Task’s five-stage shape. Do not optimise for implementation convenience.

The pipeline is the minimum ordered **model reasoning** required to produce a valid Assessment Pack **before** the structured artefact boundary. After that boundary: validation / rendering / persistence / packaging / publishing are **deterministic** — no AI.

This gate does **not** define canonical schema, write production prompts, or implement.

---

## Settled product definition (not reopened)

Deliberate progression stop; centre of gravity = interpretable formative evidence about the learner (R1/R2). Spine: **visible · honest · formative · forward-looking**. Hard invariants AP-I1…I6. Authoring responsibilities AR1–AR5.

---

## 1. Reasoning dependency analysis (A)

| Responsibility | Needs already known | Produces | Later work that depends on it |
| -------------- | ------------------- | -------- | ----------------------------- |
| **AR5** (handoff / entry) | Commission texts or standalone brief | Named bring-forward / entry assumptions; anti-recreate constraints | Constrains **all** later stages; not a one-shot metadata pass |
| **AR1** Interpret purpose | AR5-bound context; topic/outcomes/commission | Role (R1/R2), visibility target, timing rationale, forward intent, product-coherence check | AR2 cannot design elicitation safely without this |
| **AR2** Design elicitation | AR1 purpose; AR5 constraints | Evidence-bearing performance design (integration/decomposition, stimulus economy, independence) | AR3 class becomes precise; AR4 authors return against this performance |
| **AR3** Epistemic boundaries | Sufficient elicitation design to know what is being asked | Determinate / non-determinate / mixed classification; what runtime may judge; plurality rules | **AR4 must not begin** without this freeze — else honesty is a late repair |
| **AR4** Formative return + forward | Frozen elicitation + frozen epistemic class | Smallest sufficient return; forward orientation; no pathway control | Design Page synthesises; must not invent return |

### AR3 timing (tested — not assumed)

| Placement | Verdict |
| --------- | ------- |
| Before any elicitation design | **Too early** — cannot classify honesty without knowing the performance |
| Only after formative return drafted | **Rejected** — honesty becomes late repair; violates structural AP-I2 protection |
| Entirely separate product branch | **Unnecessary** — same product; parameterised within shared stages |
| **Co-determined during elicitation design, frozen as exit condition before return authoring** | **Accepted** |

**Structural rule:** Stage that designs elicitation must **exit with an explicit epistemic classification**. Stage that authors formative return may **consume** that classification, not reopen it casually.

Merging AR2+AR3 into one stage is safe **if** the stage’s exit product includes the freeze. Splitting AR3 into its own thin stage is optional protection but often under-motivated for determinate closed forms; the exit-freeze rule achieves the same invariant with fewer stages.

Merging AR4 into Design Page is **unsafe** — Design Page must not invent formative completeness.

---

## 2. Current Gate 1 pipeline assessment (B)

Current Assessment-specific stages: **Plan Assessment Evidence → Author Assessment Components → Design Page** (plus shared upstream Learning Design prefix).

| Current piece | Educational reading |
| ------------- | ------------------- |
| Plan Assessment Evidence | Partially **AR1** + early **AR2** planning; valuable “don’t write items yet” discipline; too thin on product-coherence, handoff, forward intent, epistemic intent |
| Author Assessment Components | Collapses detailed elicitation + judgement + feedback into **closed-form components**; wrongly **forbids** constructed performance; **AR3 absent** as explicit duty; AP-I4 reduced to `feedback_note` on keyed items |
| Design Page | Sensible synthesis boundary (“don’t rewrite components”); currently too narrow for constructed/self-eval materials; must remain non-inventive |
| Upstream LD prefix | Still valuable shared context (content/knowledge/outcomes); not Assessment-specific reasoning |
| Five auto-checkable forms | **Valuable determinate capabilities** — keep inside expanded contract, not as the whole product |
| Continuous conversation (current family) | Conceptually right; keep |

**Conclusion:** Keep the **three-beat rhythm** (purpose/plan → author experience → Design Page synthesis) only if expanded into responsibilities that can author Gate 2 demand. Do **not** keep closed-form-only Author as identity.

---

## 3. Candidate pipelines considered (C)

### Candidate α — Minimal three (expanded current)

1. Interpret & Plan Evidence Stop (AR1+AR5+AR2 plan+AR3 intent)  
2. Author Evidence Experience (AR2 detail+AR3 freeze+AR4)  
3. Design Page  

**Pros:** Familiar; few stages.  
**Cons:** Stage 2 densifies too much; honesty and return compete in one stage; closed-form bias likely to return.

### Candidate β — Four stages (selected)

1. **Interpret Evidence Purpose** (AR1 + bind AR5)  
2. **Design Evidence Elicitation** (AR2 + **freeze AR3**)  
3. **Author Formative Return** (AR4)  
4. **Design Page** (synthesis)  

**Pros:** Fewest stages that keep purpose / elicitation+honesty / return / synthesis as distinct reasoning boundaries; AP-I2 structurally before return; fits determinate and constructed; R1/R2 as intent.  
**Cons:** Slightly more than current three Assessment stages.

### Candidate γ — Five stages (AR3 split)

1. Interpret Evidence Purpose  
2. Design Evidence Elicitation  
3. Determine Judgement Boundaries  
4. Author Formative Return  
5. Design Page  

**Pros:** Maximum honesty checkpoint.  
**Cons:** Stage 3 often thin for determinate MCQs; risks artificial serialisation of co-determined AR2/AR3 work.

### Candidate δ — Copy Situated Task five-shape

Situation-like → Activity-like → Support → Return → Design Page  

**Rejected:** Wrong educational grammar for Assessment Pack; elegance is not product fit.

### Selection

**Candidate β wins.**

Fewest stages that preserve meaningful reasoning boundaries, make epistemic freeze a **stage exit** (not a late repair), keep formative return as its own authored duty, and leave Design Page as synthesis-only.

---

## 4. Selected predetermined pipeline

### Upstream (shared Learning Design prefix — retained)

Unchanged in role: topic/source → content / knowledge / outcomes (and normalize when applicable). Supplies domain and outcome context; does **not** replace Assessment-specific reasoning.

### Assessment Pack educational reasoning stages

```text
Interpret Evidence Purpose
  → Design Evidence Elicitation
  → Author Formative Return
  → Design Page
```

After Design Page: **deterministic** validation, assembly/hydration, packaging, publishing. No AI.

---

## 5. Stage-by-stage intellectual responsibilities

### Stage 1 — Interpret Evidence Purpose

| | |
| - | - |
| **Intellectual job** | Establish why this stop exists and what about the learner it must make visible |
| **Inputs** | Upstream LD context; commission (`specification_text`, `journey_context_text`, `dependencies`, prior-work expectations) **or** standalone brief |
| **Must decide** | R1 and/or R2 emphasis; visibility target; timing rationale; evidence purpose vs development purpose; forward-intent (advisory); product-coherence (AP vs Interactive/Situated/Expository); bind AR5 bring-forward / entry assumptions |
| **Hands forward** | Evidence-purpose brief: role, claim, constraints, forward intent, named dependencies/assumptions |
| **Must not** | Write items; invent developmental teaching; invent formative-return content |

### Stage 2 — Design Evidence Elicitation

| | |
| - | - |
| **Intellectual job** | Design the learner performance that makes the claimed state/capability interpretable — and **freeze epistemic judgement boundaries** |
| **Inputs** | Stage 1 purpose brief; active AR5 constraints |
| **Must decide** | Evidence-bearing performance; integration/decomposition fit (AP-I3); independence/scaffolding; stimulus/source/case economy (non-developmental); effort/stopping conditions; **epistemic class** (determinate / non-determinate / mixed) and what the client runtime may honestly determine; plurality/uncertainty rules |
| **Hands forward** | Elicitation design + **frozen epistemic classification** (+ any determinate keys/logic sketched as authored determination, not runtime AI) |
| **Must not** | Author full formative-return kit yet; absorb substantial development; atomise integrated capability claims; imply runtime AI judgement |

### Stage 3 — Author Formative Return

| | |
| - | - |
| **Intellectual job** | Author the smallest sufficient post-response formative support and forward orientation |
| **Inputs** | Elicitation design + **frozen** epistemic class |
| **Must decide** | Determinate: correctness/explanatory return (honesty-compatible). Non-determinate: sufficient self-evaluation support (criteria/comparisons/contrasts/omissions/uncertainty/self-inspection/light reconsideration as needed — not a fixed kit). Forward-move meaning (R1 concentration vs R2 capability insight). Advisory only — no pathway control |
| **Hands forward** | Complete educational design of return + forward orientation bound to the elicitation |
| **Must not** | Reopen epistemic class to invent fake marking; smuggle Interactive developmental cycles; grades/certification |

### Stage 4 — Design Page

| | |
| - | - |
| **Intellectual job** | Synthesise the continuous conversation into the canonical structured educational artefact for deterministic downstream systems |
| **Inputs** | Accumulated Stages 1–3 reasoning |
| **May** | Organise learner-facing framing, instructions, presentation order, and structured expression of already-authored elicitation and return materials for plain HTML/CSS/JS delivery |
| **Must not** | Invent new evidence purpose, new elicitation performances, new epistemic claims, or new formative-return substance; rewrite to restore closed-form-only assumptions; invent hidden runtime state transport |

---

## 6. AR1–AR5 → stage mapping

| AR | Primary stage | Notes |
| -- | ------------- | ----- |
| **AR1** | Stage 1 | Purpose interpretation |
| **AR2** | Stage 2 | Elicitation design |
| **AR3** | Stage 2 **exit freeze** (consumed by Stage 3) | Not a late Stage 3 invention |
| **AR4** | Stage 3 | Formative return + forward orientation |
| **AR5** | **Bound in Stage 1; active constraint Stages 2–4** | Not decorative metadata |

---

## 7. AP-I1…I6 → stage protection mapping

| Invariant | Structural protection |
| --------- | --------------------- |
| **AP-I1** Evidence-of-learner | Stage 1 coherence check; Stage 2 forbids developmental absorption |
| **AP-I2** Epistemic honesty | Stage 2 **must freeze** class; Stage 3 consumes it; Design Page must not invent evaluation claims |
| **AP-I3** Evidence-fit / integrity | Stage 2 primary; Stage 1 claim discipline |
| **AP-I4** Formative completeness | Stage 3 mandatory; Design Page expresses, does not invent |
| **AP-I5** Dependency / entry honour | Stage 1 bind; Stages 2–4 honour |
| **AP-I6** Non-summative | Cross-cutting; Stage 1 purpose + Stage 3 return forbid grades/gates |

---

## 8. R1 / R2 topology decision (D)

**Decision: one pipeline with intent parameters.**

Role/emphasis is established in Stage 1 and parameterises Stages 2–3 (state→orient vs capability-performance→formative use). No separate stage topology; no separate product IDs.

**Pressure:** Diagnostic MCQs (R1) and C `c9` contested investigation (R2) share the same stage jobs; they differ in Stage 1 claim, Stage 2 performance/epistemic freeze, and Stage 3 return shape — not in pipeline shape.

---

## 9. Determinate / non-determinate topology decision (E)

**Decision: parameterised reasoning inside shared stages — not a branch topology.**

- Stage 2 classifies and freezes epistemic character (incl. mixed with separable facets).  
- Stage 3 authors return **according to** that freeze:
  - determinate → legitimate deterministic judgement logic + explanatory formative return;
  - non-determinate → no fake runtime judgement; sufficient self-evaluation support; preserve plurality/uncertainty; forward orientation.

Renderer behaviour is **not** designed here.

---

## 10. Commission / standalone-context handling (F)

| Mode | Pipeline handling |
| ---- | ----------------- |
| **Commissioned** | Stage 1 interprets `specification_text`, `journey_context_text`, `dependencies`, source journey context, prior-work expectations as **binding educational inputs**, not decoration. Constraints remain active through Stages 2–4. |
| **Standalone** | Stage 1 establishes **explicit entry assumptions**; later stages must remain coherent with them. |
| **Reconciliation** | No separate “handoff stage.” If Stage 2/3 cannot honour Stage 1 dependencies without recreate or hidden state → fail closed / redesign within boundary (Gate 6 failure conditions), not invent runtime transport. |

---

## 11. Continuous-conversation decision (H)

**Decision: ONE continuous model conversation across Stages 1–4 (including Design Page synthesis).**

Educational benefits:

- evidence purpose remains available during elicitation design;
- epistemic freeze remains available during formative-return authoring;
- commission/handoff context remains available;
- Design Page synthesises from accumulated reasoning without local reconstruction.

Aligns with Learning Journey and Situated Task precedent **without copying their stage names or counts**.

Do **not** repeatedly serialise and re-paste intermediate artefacts as the primary continuity mechanism.

---

## 12. Design Page boundary responsibility (G)

Design Page is the **structured artefact boundary**.

**Already settled before Design Page:** purpose (AR1), elicitation (AR2), epistemic freeze (AR3), formative return + forward orientation (AR4), handoff/entry honour (AR5).

**Design Page may synthesise:** constrained structured expression of that settled design for deterministic downstream HTML/CSS/JS delivery.

**Design Page must not invent:** new educational decisions listed above; runtime AI; pathway control; summative apparatus.

Schema field design is **Gate 9**.

---

## 13. Pressure-test results (I)

| # | Case | Stage 1 | Stage 2 | Epistemic freeze | Stage 3 | AR5 active | Design Page |
| - | ---- | ------- | ------- | ---------------- | ------- | ---------- | ----------- |
| 1 | R1 diagnostic MCQs | State inspection + orientation | Closed probes fit claim | Determinate | Keys + explanatory + advisory priorities | Entry/journey assumptions | Synthesise closed items + return |
| 2 | R2 deterministic knowledge check | Capability/understanding evidence | Proportionate closed checks | Determinate | Feedback + next-move | Prior learning named | Same pattern |
| 3 | Short explanation + comparison | R2 reasoning evidence | Constructed explanation | Non-determinate | Comparison/criteria/self-eval; light reconsider | Context named | Express constructed + self-eval supports |
| 4 | A `c7` readiness checkpoint | Emerging integrated causal capability | Integrated argument — not atomised | Non-determinate / plural | Reasoning-quality self-eval + forward | Prior Interactive named | Preserve integration in artefact |
| 5 | A `c9` independent causal evaluation | Culminating independent evaluation | Sustained argument under uncertainty | Non-determinate; uncertainty OK | Contrasts/criteria; no single verdict | Prior checkpoint named | No invented “correct” conclusion |
| 6 | B terminal professional judgement | Integrated professional judgement | Judgement using prior workplace evidence | Non-determinate; success ≠ criterion | Judgement-quality self-eval; no certification | **Bring-forward** Situated/Interactive | Reconnect, don’t recreate |
| 7 | C `c9` contested-claim investigation | Sustained independent transfer | Independent investigation/judgement | Non-determinate; unresolved excellent | Criteria honour unresolved | Prior Interactive development named | No predetermined verdict |

**Rejected failure modes avoided:** forced item atomisation; runtime AI; honesty as late repair; lost commission continuity; duplicated substantial reasoning across stages.

---

## 14. Current-pipeline KEEP / EXPAND / REPLACE / RETIRE (K)

| Current piece | Classification | Note |
| ------------- | -------------- | ---- |
| Upstream LD prefix | **KEEP** | Shared context |
| Continuous conversation | **KEEP** | Across new stages |
| Plan Assessment Evidence | **REPLACE →** Interpret Evidence Purpose | Expand purpose/handoff/coherence; retire “plan forms only” as identity |
| Author Assessment Components | **REPLACE →** Design Evidence Elicitation + Author Formative Return | Split; remove closed-form-only identity |
| Design Page as synthesis boundary | **KEEP conceptually / EXPAND** | Must express constructed + self-eval materials without inventing them |
| Five auto-checkable forms | **KEEP** as determinate elicitation capabilities | Fit inside Stage 2 when claim is closed-form |
| Forbid constructed / essay | **RETIRE** | Blocks Gate 2 educational contract |
| `feedback_note`-only return model | **EXPAND** | Remains valid for determinate; insufficient alone for non-determinate |
| Intent `pretest_diagnostic` / `formative_check` | **EXPAND** toward R1/R2 | Mapping refined at prompts/params later — not schema here |
| Pathway non-control / advisory recommendations | **KEEP** | Aligns AP-I4/I6 |
| Deterministic assemble/publish after Design Page | **KEEP** (downstream) | Remains non-AI |
| Weighting / component-count knobs | **Deterministic downstream / param concern** | Not educational stage topology |

**Gate 10 planning impact (not implementing):** family stage registration and prompts must move from 3 Assessment stages to 4; authoring must accept non-determinate artefacts; publish/assemble must carry self-evaluation supports; existing five forms remain supported determinate paths.

---

## 15. Exact questions carried into Gate 9

Gate 9 (canonical structured artefact) should define the Design Page / structured artefact contract such that Stages 1–3 decisions are expressible and AP-I1…I6 are enforceable by deterministic validation where possible:

1. What canonical artefact shapes (or single shape) express purpose, elicitation, epistemic class, formative return, and forward orientation without freezing a response-form enum prematurely?
2. How are determinate judgement structures and non-determinate self-evaluation supports represented as sibling possibilities under one honesty contract?
3. How are bring-forward / entry-assumption declarations represented learner-facingly in the artefact?
4. What must deterministic post-boundary assembly **refuse** to invent if missing (fail closed)?
5. How do existing five auto-checkable forms embed as a determinate subset without re-narrowing the product?
6. What Design Page fields are mandatory vs role/epistemic-conditional?

Deferred: production prompts; code; renderer widgets; persistence mechanisms.

---

## Gate 8 decision checklist

| Criterion | Assessment |
| --------- | ---------- |
| Pipeline derived from product contract, not convenience | **Met** |
| AR3 honesty structurally before return authoring | **Met** (Stage 2 exit freeze) |
| R1/R2 and determinate/non-determinate as parameters, not product split | **Met** |
| Continuous conversation decided | **Met** |
| Design Page = synthesis boundary only | **Met** |
| Pressure-tested on Gate 1 + Gate 2 cases | **Met** |
| Migration KEEP/EXPAND/REPLACE/RETIRE recorded | **Met** |
| No schema / prompts / code | **Met** |

**Recommendation: PASS.**

Selected pipeline:

> **Interpret Evidence Purpose → Design Evidence Elicitation → Author Formative Return → Design Page**  
> (plus retained shared upstream Learning Design prefix; one continuous model conversation)

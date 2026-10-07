# Gate 3 — Assessment Pack educational roles

**Sprint:** 93 — Assessment Pack Educational Contract  
**Gate:** 3 — **COMPLETE / PASSED** (2026-10-07)  
**Depends on:** Gate 1 ACCEPTED · Gate 2 PASSED  
**Decision:** [S93-D04](decisions.md#s93-d04--gate-3-assessment-pack-educational-roles-complete--passed)  
**Invariant:** NON-SUMMATIVE · production code **frozen** · client-side HTML/CSS/JS delivery only (no runtime LLM)

---

## Hard runtime boundary (design constraint — not a mechanism design)

Assessment Pack learner delivery remains ordinary **client-side HTML/CSS/JS**:

- no runtime LLM;
- no backend;
- no server-side learner-response evaluation;
- no automatic AI interpretation, grading, or marking of constructed responses.

Model involvement belongs to **authoring before the structured artefact boundary**.

Where a response cannot be checked deterministically, any formative treatment must ultimately support **learner self-evaluation** using authored material (explanation, criteria, comparison material, model/contrasting responses, reflection/reconsideration prompts, revision opportunities). Those mechanisms are **not designed in Gate 3** — recorded only as a boundary condition.

The Assessment Pack produced by this sprint’s eventual contract must be **educationally complete without** future conversational AI. Optional provider-neutral conversational support may be investigated later; it is not a design dependency.

---

## Purpose of this gate

Determine what stable **educational roles** Assessment Pack needs to fulfil.

Keep three dimensions separate:

| Dimension | Question |
| --------- | -------- |
| **Educational role** | WHY the journey deliberately stops to elicit something |
| **Response / performance form** | WHAT the learner is asked to express, produce, or do |
| **Formative treatment** | WHAT happens educationally after elicitation |

Do **not** begin from implementation forms (MCQ, matching, textarea, essay box, …). Those are possible response mechanisms, not roles.

---

## Starting hypothesis (tested)

> Assessment Pack deliberately creates a stopping point in learning in order to make something about the learner’s current state/capability visible, then uses that elicitation formatively.

**Verdict after evidence:** **Survives**, with precision.

### Refined defining concept

Assessment Pack creates a **deliberate progression stopping point** whose **educational centre of gravity** is:

> to **elicit interpretable evidence about the learner** (present state and/or enacted capability) and to use that evidence **formatively**.

It is **not** principally:

- developing capability through designed consequential engagement (**Interactive**);
- learning by carrying out purposeful activity in authentic context (**Situated Task**);
- developing understanding principally through explanation (**Expository**).

“Stopping point” is useful when it means a **progression pause whose principal job is evidence-of-learner**, not when it means “any moment a learner answers something.” Continuous elicitation inside Interactive/Situated does not become Assessment Pack merely because something was elicited.

---

## A. Candidate role analysis

| Candidate | Verdict | Belongs as… |
| --------- | ------- | ----------- |
| Diagnostic / pre-test | **Survives as a role use** of formative state inspection | Role R1 (orienting timing) |
| Prior-knowledge activation | Usually **not** a distinct AP role | Often Interactive/Expository pedagogy; AP only if principal job is inspectable state for formative orientation (R1) |
| Opinion / belief / confidence elicitation | **Not** a distinct AP role | Response content within R1/R2, or Interactive setup for later challenge |
| Prediction | **Not** typically AP | Usually Interactive pedagogical move (predict–engage–reconcile) |
| Knowledge / understanding check | **Survives** as common R2 (or R1 early) instance | Role use + often closed response form |
| Misconception exposure | **Not** a distinct role | Aim of formative treatment / item design within R1/R2 |
| Readiness / developmental checkpoint | **Survives** as progression use of R1/R2 | Formative information for next learning move — **not** high-stakes gate |
| Integrated capability demonstration | **Survives** as core R2 instance | Gate 2 A/B/C |
| Transfer performance | Collapse into R2 | Contextual demand on capability evidence, not separate role |
| Self-assessment | Usually treatment or Interactive metacognition | AP only if principal job is eliciting inspectable self-evaluative evidence (rare; Case C kept metacognition Interactive) |
| Reflection / metacognition | **Usually Interactive** while developing | Case C `c8` |
| Synthesis | Collapse into R2 when eliciting evidence of synthesising capability | Else Interactive/Expository developmental work |

---

## B. Proposed minimal educational-role model

Two roles. Prefer few strong distinctions over a long menu.

### R1 — Formative state inspection

**Why the journey stops:** to make the learner’s **present** knowledge, understanding, beliefs, confidence, or readiness **inspectable**, so formative information can **orient subsequent learning** (including advisory “what to concentrate on”).

**Evidence:**

- Gate 1 `pretest_diagnostic` — advisory recommendations; no pathway control.
- Conceptual pressure for prior-knowledge / belief visibility when the principal job is orientation, not learning-through-answering.
- Mid-journey “what is my current state?” checkpoints when the stop is for formative orientation (related to A `c7`’s checkpoint function, though A `c7` also elicits capability evidence — see R2).

**Not:** certification of readiness; locks; skips; remedial routing.

### R2 — Formative capability-evidence elicitation

**Why the journey stops:** to **elicit interpretable evidence of a learner capability** (understanding, judgement, reasoned evaluation, transfer, integrated performance) for formative use — whether via closed-form checks or sustained constructed performance.

**Evidence:**

- Gate 1 `formative_check` — closed-form auto-checkable understanding/capability probes + LO evidence summaries.
- Gate 2 A `c7` — developmental checkpoint via integrated constructed causal argument.
- Gate 2 A `c9` — culminating independent causal evaluation (uncertainty allowed).
- Gate 2 B terminal — integrated professional judgement reconnecting with prior situated/interactive work; intervention success ≠ criterion.
- Gate 2 C `c9` — sustained independent integrated transfer performance; no predetermined verdict; justified unresolved conclusion can be excellent.

**Not:** developing that capability principally through the elicitation experience (Interactive); authentic workplace doing as the learning vehicle (Situated Task).

### Shared properties (both roles)

| Property | Rule |
| -------- | ---- |
| Formative only | NON-SUMMATIVE everywhere |
| Centre of gravity | Evidence-of-learner, not development-through-engagement or situated doing |
| Response form | Orthogonal — closed auto-checkable **or** constructed; not the role definition |
| Determinate correctness | **Optional** — required for some closed checks; not required for many R2 performances |
| After elicitation | Formative treatment (deterministic feedback where legitimate; otherwise authored self-evaluation support) — mechanisms deferred |
| Handoffs | May consume/reconnect with earlier constituent work without recreating it (Gate 2 B) |
| Delivery | Client-side complete without runtime AI |

### Mapping Gate 1 intents → roles

| Gate 1 intent | Role |
| ------------- | ---- |
| `pretest_diagnostic` | Primarily **R1** |
| `formative_check` | Primarily **R2** (closed-form instance) |

Gate 1 remains a **valid narrow territory** of R1/R2. Gate 2 shows R2 (and checkpoint uses) also demand constructed integrated performance the current pack cannot yet fulfil.

### Three dimensions (kept separate)

```text
Educational role (R1 | R2)
    ×  Response / performance form  (closed auto-checkable | constructed | mixed | …)
    ×  Formative treatment        (deterministic check+note | authored self-evaluation supports | LO summary | advisory orientation | …)
```

Gate 3 defines **roles only**. Forms and treatments are named as dimensions, not enums.

---

## C. Pressure-test results

| Scenario | Owns? | Why |
| -------- | ----- | --- |
| Five MCQs to discover misconceptions before learning | **AP — R1** (often closed form) | Stop to inspect present state for formative orientation |
| State opinion so later material can challenge it | **Usually not AP** | Pedagogical setup inside Expository/Interactive unless principal job is inspectable-state evidence (R1) |
| Predict outcome before Interactive simulation | **Interactive** | Prediction is part of developing understanding through designed engagement |
| Short knowledge check midway | **AP — R2** (sometimes R1 if purely orienting) | Stop whose job is evidence of understanding |
| Write explanation; compare with authored reasoning | **AP — R2** if principal job is eliciting capability evidence + self-evaluation treatment; **Interactive** if writing/comparing is how capability is being developed | Centre of gravity decides |
| Constructed readiness performance before support withdrawn | **AP — R2** (checkpoint use) | Formative capability evidence; “readiness” = formative info, not high-stakes gate |
| Reflect on how thinking changed | **Usually Interactive** | Metacognitive development (Case C `c8`); AP only if stop’s principal job is eliciting that reflection as inspectable evidence |
| Sustained independent integrated judgement | **AP — R2** | Gate 2 A `c9`, B terminal, C `c9` |
| Authentic workplace activity generating evidence | **Situated Task** | Principal vehicle is situated doing (Case B) |
| Revise answer after additional evidence | **Usually Interactive** while revision develops capability (Case C `c6`); AP if the stop’s principal job is eliciting a revised performance as evidence | Centre of gravity |

---

## D. “Stopping point” — retained with precision

**Yes — with a sharpened meaning.**

Assessment Pack fundamentally creates a **deliberate pause in progression** whose purpose is to make the learner’s present knowledge, understanding, judgement, or capability **inspectable as interpretable evidence**, then to use that elicitation **formatively**.

Differentiator vs continuous elicitation in siblings:

| Product | Elicitation occurs… | Principal job of that moment |
| ------- | ------------------- | ---------------------------- |
| Interactive | Continuously inside designed engagement | Capability is being **developed** through action/reasoning/revision |
| Situated Task | During authentic activity / record | Purposeful **doing in context** is the learning vehicle |
| Assessment Pack | At a progression stop owned by AP | **Evidence-of-learner** is the learning (formative) job |

---

## E. Summative territory — out of scope

NOWHERE NEAR SUMMATIVE ASSESSMENT.

Excluded: grades; certification; pass/fail progression decisions; formal marking; moderation; gradebooks; academic-integrity systems; institutional assessment management.

“Readiness” here is **formative information** supporting the learner’s next learning move — never a high-stakes gate.

---

## Boundaries (explicit)

### Interactive

Interactive owns moments where consequential reasoning, action, judgement, investigation, revision, or metacognition is principally how capability is **being developed**.

Assessment Pack owns moments where the journey **stops** because the principal job is to **elicit interpretable evidence** of state (R1) or capability (R2).

Same surface acts (judge, revise, explain) can appear in either product; **centre of gravity** decides (Gate 2 Case C).

### Situated Task

Situated Task owns purposeful learner activity in authentic/situated context as the principal learning vehicle, including generation of rich records.

Assessment Pack may later elicit judgement/capability evidence that **reconnects** with that record without owning or recreating the situated activity (Gate 2 Case B).

---

## Rejected / collapsed candidates (summary)

| Candidate | Collapse into |
| --------- | ------------- |
| Opinion / confidence / prediction as “roles” | Response content or Interactive pedagogy |
| Misconception exposure | Design aim / treatment within R1–R2 |
| Transfer / synthesis as separate roles | R2 contextual demands |
| Self-assessment / reflection as default AP roles | Usually Interactive; occasional R1/R2 if evidence-of-learner is principal |
| MCQ / essay / slider | Response forms — Gate 5+ / later form dimension |
| Gate 1 vs Gate 2 as different products | Same roles; different form/fulfilment territories |

---

## Unresolved questions for Gate 4+ (not solved here)

Gate 4 (product boundary) should formalise, without reopening role discovery:

1. Can the Interactive ↔ Assessment Pack discriminator be stated as a single operational test authors/commissioners can apply without leaking into response-form choices?
2. When a commission mixes developmental engagement and evidence elicitation, what fail-closed rule chooses the product?
3. How should educational handoffs into R2 be specified so Assessment Pack neither recreates Situated/Interactive work nor assumes runtime learner-state transport?
4. Does R1 require any authoring/pipeline distinction from R2 beyond intent, or is position+purpose enough at commission level?

Deferred beyond Gate 4 (later gates): response-form catalogue; formative-treatment catalogue; schema; pipeline revision; prompts; whether/how constructed R2 is authored for client-side self-evaluation completeness.

---

## Gate 3 decision

| Criterion | Assessment |
| --------- | ---------- |
| Roles derived from Gate 1 + Gate 2 evidence | **Met** |
| Minimal model explains closed-form territory and richer commissions | **Met** (R1 + R2) |
| Role ≠ form ≠ treatment kept separate | **Met** |
| Boundary with Interactive / Situated pressure-tested | **Met** |
| Stopping-point concept tested and refined | **Met** |
| NON-SUMMATIVE + client-side runtime boundary recorded | **Met** |
| No schema / enums / pipeline / implementation | **Met** |

**Recommendation: PASS.**

Stable enough to proceed to Gate 4 (product boundary) without prematurely freezing forms or treatments.

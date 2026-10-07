# Gate 4 — Assessment Pack product boundary

**Sprint:** 93 — Assessment Pack Educational Contract  
**Gate:** 4 — **COMPLETE / PASSED** (2026-10-07)  
**Depends on:** Gate 3 PASSED (R1/R2) · Gate 2 PASSED · Gate 1 ACCEPTED  
**Decision:** [S93-D05](decisions.md#s93-d05--gate-4-assessment-pack-product-boundary-complete--passed)  
**Invariant:** NON-SUMMATIVE · production code **frozen** · client-side HTML/CSS/JS delivery only (no runtime LLM)

---

## Hard runtime boundary (constraint — not mechanism design)

Assessment Pack learner delivery remains ordinary **client-side HTML/CSS/JS**:

- no runtime LLM; no backend; no server-side response evaluation; no AI grading/marking;
- where a constructed response cannot be checked deterministically, formative treatment ultimately supports **learner self-evaluation** using authored material;
- educational completeness must not depend on future conversational AI;
- **NOWHERE NEAR SUMMATIVE ASSESSMENT.**

Gate 4 does **not** design mechanisms for these constraints.

---

## Settled input (Gate 3 — not reopened)

| Settled | Statement |
| ------- | --------- |
| Roles | **R1** formative state inspection · **R2** formative capability-evidence elicitation |
| Defining concept | Deliberate progression stopping point whose centre of gravity is **interpretable evidence about the learner**, used formatively |
| Dimensions | Role × response/performance form × formative treatment remain **separate** |
| Form ≠ product | Surface acts (select, write, judge, explain, investigate, reflect, revise, extended performance) do **not** decide product ownership |

No genuine contradiction with Gate 3 was found. Role discovery is **not** reopened.

---

## 1. Operational product definition

**Assessment Pack** is the first-class PRISM product that creates a **deliberate progression stopping point** whose **educational centre of gravity** is:

> to **elicit interpretable evidence about the learner** — present state (**R1**) and/or enacted capability (**R2**) — and to use that elicitation **formatively**.

It is educationally coherent when it provides enough framing, task context, source/case material, and formative treatment to make that evidence-elicitation job intelligible — without becoming principally a place where capability is **developed through consequential engagement**, understanding is **developed through explanation**, or authentic situated **doing** is the learning vehicle.

---

## A / 2. Single operational discriminator

### Candidate tested

> If the learner activity is principally there to **develop** the capability through consequential engagement, it belongs to **Interactive**.  
> If the journey deliberately pauses principally to make the learner’s present state or capability **inspectable as formative evidence**, it belongs to **Assessment Pack**.

### Verdict

**Survives**, with siblings named for completeness. Usable by Learning Journey commissioning, product authors, and later design work. Independent of response form.

### Operational discriminator (accepted)

Ask one centre-of-gravity question:

> **Is the principal educational job of this experience to make something about the learner inspectable as formative evidence (state and/or capability), or is it to develop understanding/capability (or enact authentic situated activity) through the experience itself?**

| Answer | Product |
| ------ | ------- |
| Principal job = **inspectable formative evidence about the learner** (R1 and/or R2) | **Assessment Pack** |
| Principal job = **develop** capability/understanding through consequential engagement | **Interactive** |
| Principal job = **carry out** purposeful activity in authentic/situated context | **Situated Task** |
| Principal job = **develop** understanding through explanation / representation | **Expository** |

**Surface form must not decide.** Selecting, writing, judging, explaining, investigating, reflecting, revising, or producing an extended performance can appear in more than one product; ownership follows the principal educational job.

**Quick authoring test (Interactive ↔ AP):**

1. After this experience, is the main educational achievement that the learner **became more capable through engaging**, or that the journey now has **interpretable formative evidence of where the learner stands / what they can do**?
2. If removing the “evidence stop” character would leave a coherent developmental experience, prefer **Interactive**.
3. If the experience exists principally so the journey (and learner) can **see** current state/capability and act formatively on that visibility, prefer **Assessment Pack**.

---

## B / 3. Mixed development + evidence — fail-closed commissioning rule

### Hypothesis tested

> Assessment Pack should not acquire substantial developmental machinery merely to manufacture the capability it then claims to inspect.

**Verdict: Confirmed.**

### Legitimate inside one Assessment Pack

Enough learner-facing material to make evidence elicitation **educationally coherent**:

- task framing and instructions;
- what is being asked / what counts as the performance;
- necessary case, source, stimulus, or scenario material for **this** elicitation;
- criteria, model/contrast material, and other authored supports needed for **formative treatment / self-evaluation** (mechanisms deferred);
- limited orienting reminders that establish the stop — not staged teaching of the capability.

### Changes the centre of gravity (not legitimate as AP’s principal work)

Substantial teaching, practice, staged evidence building, consequential interaction loops, guided investigation, repeated revision-as-development, or other developmental machinery whose main purpose is to **create** the capability that the same pack then “assesses.”

### Options pressure-tested

| Pattern | When appropriate |
| ------- | ---------------- |
| One Interactive with incidental evidence | Developmental engagement is principal; evidence capture is by-product — **Interactive** (Gate 2 A mid-journey; C `c6`–`c8`) |
| One AP with limited framing/scaffolding | Evidence-of-learner is principal; framing supports the stop — **Assessment Pack** (Gate 2 A `c7`, `c9`; B terminal; C `c9`) |
| Two commissions: developmental product(s) then AP | Substantial development is required before the evidence stop is meaningful — **preferred default** (Gate 2 B Situated → Interactive → AP; C Interactive sequence → AP `c9`; A Interactive → AP checkpoint → … → AP culmination) |
| Stuff development into AP to “save a commission” | **Rejected** — changes centre of gravity; falsifies the product |

### Fail-closed commissioning rule

When a proposed experience **mixes** substantial development-through-engagement **and** deliberate state/capability evidence elicitation:

1. **Separate** the developmental work into the appropriate sibling product(s) (Interactive / Situated / Expository as centre of gravity requires).
2. Commission **Assessment Pack** for the deliberate evidence stop (R1 and/or R2).
3. Express any dependence as an **explicit educational handoff** (see §7) — never as hidden runtime state.
4. If ownership remains ambiguous after applying the discriminator: **fail closed to separation** (developmental commission + Assessment Pack), **not** to an Assessment Pack that absorbs development, and **not** to an Interactive that pretends a deliberate evidence stop is “just another interaction.”

**Avoid artificial fragmentation:** do not split mere framing, stimulus, or formative treatment out of Assessment Pack merely because text or a short prompt is present. Fragment when **substantial developmental work** would otherwise change AP’s centre of gravity.

### Gate 2 mapping

| Case | Commissioning reading |
| ---- | --------------------- |
| A `c7` | AP checkpoint **after** Interactive development — evidence of emerging capability, not manufacturing it |
| A `c9` | AP culmination **after** prior development (+ prior AP checkpoint) — independent integrated evidence |
| B | Situated (doing) → Interactive (interpretive development) → terminal AP (judgement evidence) — handoff, not recreation |
| C `c6`→`c7`→`c8`→`c9` | Developmental Interactive retained until principal job becomes sustained independent evidence stop (`c9` only) |

---

## C / 4. Assessment Pack ↔ Interactive

**Boundary rule:** Interactive owns experiences whose principal job is **developing** capability through consequential engagement. Assessment Pack owns deliberate progression stops whose principal job is **inspectable formative evidence** of state (R1) or capability (R2). Same surface acts may appear in either; centre of gravity decides.

### Pressure-test set

| # | Scenario | Centre of gravity | Product | Why | Small purpose change that moves it |
| - | -------- | ----------------- | ------- | --- | ---------------------------------- |
| 1 | Predict → reveal → reconcile | Develop understanding through designed engagement | **Interactive** | Prediction is a developmental move | If stop exists only to inspect prior belief for formative orientation with no reconcile-as-learning loop → **AP R1** |
| 2 | Repeated judgement → new evidence → revision | Develop judgement through consequential revision | **Interactive** | Gate 2 C `c6` | If a single independent judgement performance is elicited as evidence after development is done → **AP R2** |
| 3 | Explanation → comparison with authored reasoning | Ambiguous until purpose fixed | **Either** | If writing/comparing is how capability is developed → Interactive; if performance is elicited as evidence then compared for formative self-evaluation → **AP R2** | Flip principal job between develop vs evidence |
| 4 | Low-stakes knowledge check | Inspect understanding as formative evidence | **AP R2** (sometimes R1 if purely orienting) | Deliberate evidence stop | If “check” is embedded as consequential practice inside a larger developmental interaction → **Interactive** |
| 5 | Constructed readiness checkpoint | Inspect capability as formative information for next move | **AP R2** | Gate 2 A `c7`; readiness ≠ high-stakes gate | If checkpoint becomes guided practice that develops the capability → **Interactive** |
| 6 | Sustained independent argument | Evidence of integrated capability | **AP R2** | Gate 2 A `c9`, C `c9` | If argument is staged with intervening teaching/feedback loops whose job is development → **Interactive** (then separate AP if evidence stop still needed) |
| 7 | Learner-controlled investigation with consequences | Develop through investigation | **Interactive** | Gate 2 C `c7` | If investigation is only the stimulus for a later evidence stop, keep investigation Interactive and elicit separately as AP |
| 8 | Independent investigation whose purpose is capability evidence | Evidence of investigative capability | **AP R2** | Purpose is inspectable performance, not development-through-investigation | If consequences and iteration are how capability is being built → **Interactive** |
| 9 | Reflection on changed thinking | Usually develop metacognitive monitoring | **Interactive** | Gate 2 C `c8` | If journey stops principally to elicit reflection as inspectable formative evidence → **AP** (R1/R2 as fits) |
| 10 | Performance → authored comparison → self-evaluation → revision | Depends which phase is principal | **Split or AP** | Comparison/self-eval as **treatment after** evidence elicitation can stay in **AP**; revision-as-development after that often belongs in **Interactive** or a later AP stop | If revision loop is the learning vehicle → Interactive; if one elicited performance + authored self-eval treatment is the stop → AP |

---

## D / 5. Assessment Pack ↔ Situated Task

**Boundary rule (formalises Gate 2 Run B / Sprint 92):**

| Product | Principal learning vehicle |
| ------- | -------------------------- |
| **Situated Task** | Carrying out purposeful activity in authentic/situated context |
| **Assessment Pack** | Eliciting interpretable formative evidence about learner state/capability |

Situated Task may generate rich records. That does **not** make it Assessment Pack. Assessment Pack may later elicit judgement/capability evidence that **reconnects** with that record without owning or recreating the situated activity (Gate 2 B).

Intervention / activity success is **not** the Assessment Pack criterion; evidence of integrated judgement/capability is.

---

## 7. Educational handoff rule (Situated → AP and Interactive → AP)

Preserve the Sprint 92 educational handoff invariant, applied to Assessment Pack:

1. **Commission honour:** A commissioned Assessment Pack must honour explicit educational dependencies in its commission context. It must **not** recreate, replace, or independently determine learner work that the Learning Journey says is produced by an earlier experience.
2. **Learner-facing clarity:** Where the evidence stop depends on prior learner work, the product must clearly identify **what the learner needs to bring forward** and **how it will be used**. It must **not** depend on inaccessible hidden state.
3. **No runtime state interoperability product:** PRISM does not provide hidden cross-product learner-state transport. Handoffs are educational and artefact-intelligible, not silent backend glue.
4. **Ownership:** Prior Situated/Interactive work remains owned by those products’ semantics; AP consumes/reconnects for its evidence job only.

Same rule applies to Interactive → Assessment Pack handoffs (Gate 2 A, C) and to AP checkpoint → later AP culmination (Gate 2 A `c7` → `c9`) when progressive evidence is to be reused formatively.

---

## E / 6. Assessment Pack ↔ Expository

**Boundary rule:** Expository owns experiences whose principal job is developing understanding through **explanation / representation**. Assessment Pack may include explanatory and illustrative material only insofar as it is necessary to:

- establish the assessment task;
- make the elicited evidence interpretable;
- support formative treatment / self-evaluation (authored criteria, model/contrast, explanations of quality — mechanisms not designed here).

| Material | Legitimate in AP when… | Becomes Expository (or should be separate Expository) when… |
| -------- | ---------------------- | ------------------------------------------------------------- |
| Framing / instructions | Makes the stop intelligible | — |
| Case / source / stimulus | Needed for **this** elicitation | Becomes a teaching exposition of the domain as principal job |
| Criteria / model / contrast | Supports formative interpretation of the elicited performance | Turns into the main learning of the concepts via explanation |
| Worked examples / extended explanation | Briefly clarify the task or quality expectations | Principal job is developing understanding through explanation |

**Rule of thumb:** If removing the evidence-elicitation stop would leave a coherent Expository resource, the experience was mis-commissioned as Assessment Pack.

---

## F / 10. R1 ↔ R2 and product boundary

**Resolution (Gate 3 Q4, boundary-only):**

R1 and R2 **share the same product boundary** and the **same operational discriminator**.

- Role/intention determines **why** the progression stops (inspect present state vs elicit capability evidence).
- Product ownership is decided by centre of gravity (evidence-of-learner vs develop vs situated doing vs explain), **not** by R1 vs R2.

Do **not** introduce separate product IDs. Do **not** design separate pipelines here. Whether authoring/pipeline later needs role-sensitive stages remains a Gate 6–8 question.

---

## G / 8. Negative invariants

Assessment Pack does **not** belong merely because:

1. **…the learner answers questions** — answering occurs in many products.
2. **…learner work is recorded** — records arise in Interactive and Situated Task without making them Assessment Pack.
3. **…feedback is provided** — feedback can be developmental (Interactive) or explanatory.
4. **…the learner works independently** — independence is orthogonal (Gate 2 C).
5. **…the activity “looks like assessment”** — surface resemblance is not centre of gravity.
6. **…a correct answer exists** — determinate keys are optional and never define the product (Gate 2).
7. **…a constructed response is produced** — form ≠ product.
8. **…the experience is at the end of a journey** — position is not ownership (mid-journey A `c7` is AP; terminal work can be Interactive/Situated).
9. **…evidence of learning happens to exist** — incidental evidence ≠ deliberate formative evidence stop.

Prefer these nine as one tight set: **incidental elicitation, recording, feedback, independence, resemblance, keys, form, position, or by-product evidence do not confer Assessment Pack ownership.**

---

## H / 9. Standalone-use rule

Assessment Pack remains a **first-class product** and must remain capable of **standalone** use.

A standalone Assessment Pack **may**:

- establish its own task context;
- provide necessary source/case/stimulus material for the elicitation;
- explain what the learner is being asked to demonstrate or make visible;
- provide appropriate formative treatment / authored self-evaluation support.

A standalone Assessment Pack **must not**:

- absorb substantial prerequisite teaching, practice, or developmental Interactive/Situated machinery merely to manufacture the capability it then inspects;
- invent hidden runtime dependencies on other products;
- require another product to be present at learner runtime.

**When meaningful capability evidence would require substantial prerequisite learning that has not occurred:**

- Prefer commissioning the prerequisite learning as the appropriate sibling product(s) (or stating explicit learner entry assumptions in the standalone brief/commission), then the Assessment Pack stop;
- If offered standalone without that development, the pack remains an **evidence stop against its stated entry assumptions** — it does not silently become a teaching product to close the gap;
- Do **not** solve the gap with hidden dependencies or another product loaded at runtime.

(Exact learner-facing entry-assumption language is Gate 5 territory; Gate 4 only fixes the product-boundary rule.)

---

## Pressure-test results (summary)

| Test | Result |
| ---- | ------ |
| Single discriminator independent of form | **Holds** |
| Mixed development + evidence | **Fail closed to separation**; AP keeps framing/treatment only |
| AP must not manufacture capability it inspects | **Confirmed** |
| Gate 2 A/B/C commissioning patterns | **Explained** without role reopening |
| Interactive pressure set (10 cases) | **Allocable** by centre of gravity |
| Situated handoff without recreate / hidden state | **Formalised** |
| Expository material inside AP | **Bounded** to task / interpretability / treatment |
| R1 vs R2 product boundary | **Shared** |
| Standalone vs no-manufacture-development | **Reconciled** via entry assumptions + sibling commissions |
| NON-SUMMATIVE + client-side constraints | **Unchanged** |

---

## Unresolved questions for Gate 5 (learner contract)

Gate 5 should define the learner contract without reopening product ownership:

1. What must the learner **understand** about an Assessment Pack stop (purpose, formative nature, what “success” means when no single key exists)?
2. What must the learner **do / produce / express**, at contract level — without freezing a response-form taxonomy?
3. What must the learner **receive** after elicitation (formative treatment expectations at contract level — still not a treatment catalogue)?
4. What must the learner be able to **bring forward / carry forward**, including explicit handoff payloads stated learner-facingly?
5. How should standalone **entry assumptions** be stated so the pack remains coherent without absorbing prerequisite teaching?

Deferred beyond Gate 5: response-form catalogue; formative-treatment catalogue; schema; pipeline; prompts; implementation.

---

## Gate 4 decision checklist

| Criterion | Assessment |
| --------- | ---------- |
| Operational definition from Gate 3 roles | **Met** |
| Single form-independent discriminator | **Met** |
| Mixed-experience fail-closed rule | **Met** |
| Explicit AP ↔ Interactive / Situated / Expository | **Met** |
| Educational handoff rule | **Met** |
| Negative invariants | **Met** |
| Standalone-use rule | **Met** |
| R1/R2 share product boundary | **Met** |
| No learner-contract detail / forms / treatments / schema / pipeline / code | **Met** |

**Recommendation: PASS.**

Stable enough to proceed to Gate 5 (learner contract).

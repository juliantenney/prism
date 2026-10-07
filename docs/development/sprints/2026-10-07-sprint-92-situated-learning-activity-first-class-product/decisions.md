# Sprint 92 — Decisions

## S92-D01 — Open Sprint 92 — Situated Learning Activity First-Class Product

**Date:** 2026-10-07  
**Status:** Accepted

**Decision:** Open **Sprint 92 — Situated Learning Activity First-Class Product** as a bounded sprint to **define and then implement** PRISM's next first-class educational product for the recurring capability gap surfaced by Learning Journey commissioning.

**Working title:** *Situated Learning Activity First-Class Product* — **not** a commitment to final learner-facing product name, marketing label, or `product_id`.

**Objective:** Derive the product from **educational requirements** before defining implementation architecture. The first implementation work package must not begin until design gates 1–6 in [PRODUCT-DESIGN-MAP.md](PRODUCT-DESIGN-MAP.md) are deliberately resolved and documented.

**Evidence base:** Post–Sprint 91 live Learning Journey experiments (see [SPRINT-92-CHARTER.md](SPRINT-92-CHARTER.md) § Evidence base) — not speculative product expansion.

**Authoritative predecessors:**

- [Sprint 91 — COMPLETE / CLOSED](../2026-10-06-sprint-91-learning-journey-first-class-implementation/SPRINT-91-CLOSURE.md) — Learning Journey first-class; commission intake; do **not** reopen
- [Sprint 90 — COMPLETE / CLOSED](../2026-10-05-sprint-90-learning-journey-foundations/SPRINT-90-CLOSURE.md) — foundations
- [PB-FA-015](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-015--additional-first-class-learning-resource-pipelines) — additional first-class learning-resource pipelines

**Not authorised by opening alone:**

- final `product_id` or schema;
- predetermined pipeline stages beyond the design sequence;
- Create UI / family registration / prompt bodies;
- Learning Journey schema or commissioning changes;
- stretching Interactive, Expository, or Assessment Pack to absorb situated activity by default;
- splitting Interactive into individual/workshop product families;
- generic workflow engine or schema-first design;
- reopening Sprint 91.

**First deliverable:** Complete design gates 1–6 in [PRODUCT-DESIGN-MAP.md](PRODUCT-DESIGN-MAP.md) before [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) is treated as approved for WP1.

**Predecessor:** Sprint 91 remains **COMPLETE / CLOSED**.

---

## S92-D02 — Product design gate 1 — Educational purpose

**Date:** 2026-10-07  
**Status:** Accepted  
**Gate:** 1 — Educational purpose — **COMPLETE**

### Educational purpose

This product enables learning through **purposeful activity undertaken by the learner in an authentic or situated context**, where **carrying out the activity itself is the principal learning vehicle**.

It prepares and bounds that activity, supports the learner in acting appropriately when circumstances vary, preserves the resulting evidence, observations, thinking or other meaningful record, and reconnects that record to subsequent learning.

### Key discriminator

The defining characteristic is:

> Carrying out the activity itself is the principal learning vehicle.

Do **not** define the product merely by whether activity happens “outside PRISM”. The learner may use a PRISM artefact while undertaking the activity; what matters is where the **educational centre of gravity** lies.

### Context

“Authentic or situated context” is deliberately broad enough to include recurring cases such as:

- investigation;
- observation;
- evidence gathering;
- bounded testing;
- workplace activity;
- field or studio activity;
- appropriate forms of practice.

This list is **illustrative**, not a subtype taxonomy and not a commitment that every example necessarily belongs to this product.

### Record

“Record” is intentionally broader than assessment evidence.

Depending on the educational activity, the meaningful thing carried forward may include observations, findings, evidence, practice attempts, decisions, reflections, artefacts, limitations, deviations or other relevant learner-produced material.

The educational requirement is that the product **preserves what matters from the activity** so it can contribute to subsequent learning.

This wording is **not** schema or field definitions.

### Explicit non-purpose

> The product does not exist merely to package independent-study instructions, provide a generic worksheet, or capture learner responses. Its distinctive purpose is to bridge designed learning and purposeful learner action in a context where the generated resource is not itself the substantive learning experience.

### Working grammar (hypothesis only)

Retain **Brief → Activity → Record → Reconnect** as educational hypothesis / grammar — **not** schema and **not** the predetermined pipeline.

Adaptation remains a responsibility that may occur during Activity; it is **not** established as a separate stage or field by this decision.

### Not decided by this gate

Final product name; `product_id`; sibling-product boundary (gate 2); pipeline stages; Design Page / schema; persistence / capture implementation; UI; commissioning implementation.

---

## S92-D03 — Product design gate 2 — Boundary against sibling products

**Date:** 2026-10-07  
**Status:** Accepted  
**Gate:** 2 — Boundary against sibling products — **COMPLETE**  
**Depends on:** [S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose)

### Boundary principle

The product boundary is determined by the **educational centre of gravity**: what principally carries the intended learning or educational job.

| Product | Principal learning vehicle / educational job |
| ------- | -------------------------------------------- |
| Expository | The learner develops understanding principally through explanation / representation. |
| Interactive | Learning is principally mediated by engagement with a deliberately designed or facilitated experience. |
| Assessment Pack | The principal job is eliciting interpretable evidence of learner capability. |
| New situated product | Learning occurs principally through the learner carrying out purposeful activity in context; the product prepares, bounds, supports, records and reconnects it. |
| Learning Journey | Composes experiences into purposeful progression; it does not compete for ownership of the constituent activity itself. |

### Core discriminator

> An activity does not belong to this product merely because it asks the learner to do something.

Every PRISM product may ask learners to act.

The new product applies when the purposeful situated activity itself carries substantial educational weight that cannot appropriately be reduced to:

- consuming explanation;
- engaging with the designed / facilitated experience as the principal learning vehicle; or
- demonstrating capability principally so that performance can be interpreted or judged.

Use educational centre of gravity, **not** superficial delivery characteristics.

### Interactive ↔ situated product

Do **not** distinguish these products using:

- digital vs real-world;
- online vs face-to-face;
- synchronous vs asynchronous;
- individual vs collaborative;
- workplace vs non-workplace.

Interactive may legitimately:

- use authentic learner contexts;
- support individual reasoning;
- operate as a facilitated workshop;
- ask learners to apply ideas to their workplace;
- support planning for later investigation or testing;
- include limited actions outside the immediate interface.

**Test:**

> Would the intended learning still substantially occur through engagement with the deliberately designed/facilitated experience, or does that experience primarily prepare and support the learner to undertake the substantive learning activity themselves in context?

**Examples from live evidence:**

- Design a workplace enquiry → Interactive can own this.
- Conduct the workplace enquiry and learn from what actually happens → situated product.
- Design a bounded product test → Interactive can own this.
- Carry out that test, encounter actual results, and retain what happened → situated product.

Planning vs doing is useful **evidence** for the boundary, but is **not** an absolute product rule. The situated product may itself contain preparation, briefing or scaffolding required for the activity.

### Assessment Pack ↔ situated product

Both products may involve independent learner action, authentic situations, performance, and records or evidence. None of those characteristics alone is sufficient to distinguish them.

**Test:**

> Is the resulting performance principally being elicited so learner capability can be interpreted or judged, or is carrying out the activity itself intended to produce learning that subsequent learning can use?

**Examples:**

- Independent integrated product judgement produced as interpretable evidence of capability → Assessment Pack.
- Workplace investigation whose observations/findings feed subsequent interpretation and decision-making → situated product.

> Producing evidence does not by itself make an activity Assessment.

Assessment Pack owns the case when interpreting / judging learner capability from the performance is the principal educational job.

### Expository ↔ situated product

A resource explaining how to undertake an investigation is not automatically the situated product. Likewise, the situated product may contain explanation / instructions without becoming Expository.

**Distinction:**

> Is explanation itself the principal learning vehicle, or does explanation primarily enable the learner to undertake the purposeful situated activity that carries the learning?

### Learning Journey ↔ situated product

Learning Journey owns composition / progression:

> What sequence of experiences will move these learners towards the intended learning?

The situated product owns production of a particular situated learning experience:

> How should this purposeful activity in context be designed so the learner can undertake it productively, preserve what matters from it, and carry that learning forward?

Therefore:

- Learning Journey may commission the new product like any other commissionable constituent product.
- The new product does not own cross-product journey composition.
- Do **not** introduce recursive Learning Journey semantics.

### Deliberate practice (boundary case — not forced)

Deliberate practice is a useful boundary case for later acceptance testing:

- if the designed / facilitated experience principally mediates the learning → **Interactive**;
- if sustained purposeful practice in context is itself the principal learning vehicle → the new product **may** be appropriate.

Do **not** force a universal classification yet.

### Not decided by this gate

Final product name; `product_id`; learner contract (gate 3); pipeline stages; Design Page / schema; persistence / capture; UI; commissioning implementation; splitting Interactive into workshop / individual variants; “planning vs doing” as a hard-coded taxonomy.

---

## S92-D04 — Product design gate 3 — Learner contract

**Date:** 2026-10-07  
**Status:** Accepted  
**Gate:** 3 — Learner contract — **COMPLETE**  
**Depends on:** [S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose) · [S92-D03](decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products)

### Central design question

> What must PRISM provide so that a learner can undertake the situated activity productively without the learning resource becoming the activity itself?

### Learner-contract responsibilities

#### 1. Purpose

The learner understands why they are undertaking the activity and what they are trying to learn, discover, improve, practise, investigate or test.

The product must not reduce purpose to merely “complete this task.”

#### 2. Action

The learner understands what they are actually expected to do.

Provide enough specificity for purposeful action without scripting away the authentic decisions, encounters or variation that make the activity educational.

#### 3. Context / opportunity

The learner understands the relevant context in which the activity is to occur: where, with what, and where educationally relevant, with whom.

Context is not limited to physical location. It may be physical, professional, workplace, field or studio, social, community-based, practice-based, or another authentic context relevant to the intended learning.

This is a learner-contract responsibility, **not** a schema taxonomy.

#### 4. Boundaries

The learner understands relevant scope, constraints, permissions, ethical/practical limits, and what they should not do.

Boundaries should be proportionate to the activity and context rather than generic compliance text. Where relevant this may include authority, access, privacy, sensitivity, appropriate involvement of other people, safety, available resources, or limits on the activity.

#### 5. Attention

The learner understands what is worth noticing while undertaking the activity. This is distinct from simply giving instructions.

Examples may include behaviours or patterns; discrepancies; unexpected evidence; effects of different attempts; contextual factors; changes from an original plan; limitations of what can be observed or concluded.

The product should support activity becoming learning, rather than merely activity completion. Do **not** encode these examples as fixed fields.

#### 6. Adaptation

The learner is supported in responding appropriately when reality differs from the plan.

The design should make sufficiently clear:

- what may legitimately change;
- what underlying purpose, question, intention or standard needs to remain stable;
- how significant departures should be noticed or retained where educationally relevant.

Situated activity must not be designed as though authentic contexts execute like deterministic workflows.

Adaptation remains a responsibility **within** the activity — **not** a separate pipeline stage or schema field at this gate.

#### 7. Record

The learner understands what needs to survive the experience.

The meaningful record may include, where appropriate: observations; findings; evidence; attempts; decisions; reflections; artefacts; limitations; departures from the plan; other material needed by subsequent learning.

Where educationally important, the design may ask the learner to preserve distinctions such as observation vs interpretation; planned vs actual activity; evidence vs conclusion.

Do **not** require exhaustive recording merely because PRISM can provide a capture mechanism.

“Record” remains an educational responsibility, **not yet** a persistence or schema decision.

#### 8. Reconnect

The learner understands how what they have done and retained contributes to subsequent learning.

The resulting record may later support interpretation, reflection, discussion, comparison, decision-making, further activity, assessment, or another constituent learning experience.

The situated activity should not terminate in a pedagogical cul-de-sac.

### Effort / stopping criterion

Effort and stopping are an important design consideration but **not** necessarily a separate universal learner-contract category.

Where an activity does not have an obvious natural completion point, the learner should have enough guidance to understand:

- the expected scale or effort;
- what counts as sufficient activity / evidence / practice;
- when to stop.

This is especially important for open-ended investigation, research and evidence gathering.

### Social learning

> Learner-directed does not mean learner-alone.

Situated activity may deliberately create learning through encounter with other learners, colleagues, practitioners, users or stakeholders where appropriate and permitted, different perspectives, existing practices, or groups or communities.

Illustrative (not required subtypes): interviewing; observing practice; collaborative investigation; practising with another person; gathering perspectives; peer activity in context; seeking critique.

A situated product may therefore be selected for a **positive pedagogical reason**: the intended learning may require participation, dialogue, observation, collaboration, encounter with other perspectives, or purposeful action in a social setting.

Do **not** treat social learning as synonymous with the situated product. The Gate 2 centre-of-gravity boundary still applies ([S92-D03](decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products)).

Examples:

- PRISM orchestrates a designed peer-comparison exercise and the designed interaction principally mediates learning → **Interactive**.
- Learners undertake a purposeful investigation together and the investigation itself principally carries the learning → **situated product**.
- A learner gathers perspectives from colleagues in authentic practice and retains what those encounters changed or revealed → **situated product**.
- Facilitated cohort critique where the designed / facilitated experience principally mediates learning → **Interactive**.

This preserves the existing Interactive boundary rather than moving all collaborative activity into the new product.

### Gate 3 invariant

> The learner must be sufficiently oriented to act purposefully, safely and productively in the relevant physical, professional, social or other authentic context; sufficiently supported to respond to relevant variation without losing the educational purpose; clear about what matters enough to notice and retain; and able to carry the resulting learning forward.

> The product must not confuse learner autonomy with instructional absence.

PRISM should provide sufficient educational framing and support while preserving the learner agency and contextual variation that make the situated activity educational.

### Relationship to working grammar

Retain **Brief → Activity → Record → Reconnect** as the strongest current educational grammar.

The learner contract elaborates what good design must accomplish across that grammar. It does **not** establish:

- mandatory learner-facing headings;
- one schema field per responsibility;
- pipeline stages;
- UI structure;
- persistence / capture mechanics.

A well-designed artefact may satisfy several responsibilities together.

### Naming implication — observation only

The social-learning dimension further demonstrates why provisional language such as “Self-Directed” or “Independent Task” may be too narrow if interpreted as solitary study.

This is a **design observation**, not a naming decision. Do **not** settle final product name or `product_id` at Gate 3.

### Not decided by this gate

Authoring / design responsibilities (gate 4); product invariants (gate 5); pipeline stages; Design Page / schema fields; persistence / capture; UI; final name / `product_id`; altering Gate 2 sibling boundaries; making social interaction mandatory.

---

## S92-D05 — Product design gate 4 — Authoring / design responsibilities

**Date:** 2026-10-07  
**Status:** Accepted  
**Gate:** 4 — Authoring / design responsibilities — **COMPLETE**  
**Depends on:** [S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose) · [S92-D03](decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products) · [S92-D04](decisions.md#s92-d04--product-design-gate-3--learner-contract)

Gate 3 established what the learner must receive. Gate 4 defines the **intellectual design work** PRISM must perform to produce a good instance of this product.

Do **not** simply convert Gate 3 learner-contract responsibilities into pipeline stages or schema fields.

### Authoring / design responsibilities

#### 1. Interpret the learning purpose and situated opportunity

PRISM must determine why carrying out this activity is educationally valuable.

The design should understand:

- what the learner is intended to learn, discover, improve, practise, investigate or test through action;
- why carrying out the activity itself should be a principal learning vehicle;
- what authentic / situated opportunity makes that learning possible;
- how the activity contributes to the supplied learning context or commission.

The design must not assume that external activity is educational merely because the learner is active.

#### 2. Design the activity

PRISM must translate the educational intention into purposeful, feasible learner action.

The design should make appropriate judgements about matters such as:

- what the learner actually does;
- relevant context;
- people, practices, materials, evidence or resources involved where appropriate;
- scope;
- expected effort;
- useful stopping conditions;
- the appropriate balance between structure and learner agency.

The activity should be sufficiently designed to support productive learning without scripting away the authentic decisions, encounters and variation that make the activity educational.

#### 3. Design the boundaries

PRISM must determine the practical, ethical and contextual limits relevant to this particular activity.

Where appropriate this may include authority; access; privacy; sensitivity; involvement of other people; safety; available resources; limits on investigation, observation, testing or practice.

These must be proportionate and context-sensitive. Do **not** turn this responsibility into generic compliance boilerplate.

#### 4. Design attention and adaptation

PRISM must determine what is educationally worth noticing while the learner acts and how the learner can respond when reality differs from expectation.

Attention may concern, where relevant: observations; behaviours or patterns; discrepancies; unexpected evidence; effects of different attempts; contextual influences; departures from a plan; limitations.

Adaptation design should help preserve the underlying educational purpose, question, intention or standard while allowing appropriate changes in response to authentic circumstances.

This is a distinctive intellectual responsibility of designing situated activity. Do **not** make “Adapt” a separate mandatory stage or schema field at this gate.

#### 5. Design the record

PRISM must determine what should survive the activity because it has educational value later.

The record should follow from the learning purpose, the activity, what matters to notice, and what subsequent learning needs.

Where educationally important, the design may preserve distinctions such as observation vs interpretation; intended vs actual activity; evidence vs conclusion; expected vs unexpected results; attempts and changes between attempts; limitations or departures.

Do **not** create exhaustive documentation requirements merely because capture is technically possible. Do **not** decide persistence, storage, upload, field or UI mechanisms at Gate 4.

#### 6. Design the reconnection

PRISM must determine how the situated experience closes educationally and how what the learner has done and retained can contribute to subsequent learning.

The resulting material may feed interpretation, reflection, comparison, discussion, decision-making, further activity, assessment, or another constituent learning experience.

When commissioned by a Learning Journey, supplied journey context should inform this design responsibility. However:

- Learning Journey continues to own composition / progression;
- the constituent product owns production of this particular situated learning experience.

Do **not** move cross-product composition into this product.

### Cross-cutting design judgements

These are judgements, **not** additional pipeline stages.

#### Scaffolding

PRISM must judge:

> How much support does this learner need to undertake this activity productively without PRISM taking over the substantive work?

Too little support risks confusing autonomy with instructional absence. Too much support risks moving the educational centre of gravity back into the generated resource.

#### Social configuration

Where other people are educationally relevant, PRISM must judge:

> What form of encounter, participation or collaboration serves the learning purpose?

This may include activity with peers, colleagues, practitioners, stakeholders, groups or communities where appropriate.

Social participation is not automatically Interactive. Retain the Gate 2 centre-of-gravity boundary ([S92-D03](decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products)):

- if the deliberately designed / facilitated experience principally mediates learning → **Interactive**;
- if purposeful activity / participation in context principally carries the learning → **situated product**.

Do **not** define fixed social-learning subtypes at this gate.

### Authoring invariant

> Design from the intended learning and situated activity outward; do not design backwards from available UI controls, recording mechanisms or templates.

The educational design must determine what the learner needs. Later implementation should serve that design rather than constrain the product definition to whatever capture widgets or authoring controls are easiest to build.

### AI / deterministic boundary observation

Architectural consequence of these design responsibilities — **not** yet a pipeline decision (Gate 6):

The responsibilities above involve **educational judgement**. Therefore they belong on the intellectual / model side of PRISM's established boundary.

Deterministic processing may later validate, associate, render, package, publish, or perform other mechanical transformations of an authoritative structured artefact.

It must **not** invent missing educational purpose, activity design, boundaries, attention, adaptation, record design or reconnection after the structured artefact boundary.

Do **not** use this observation to define Gate 6 pipeline stages yet.

### Relationship to Gate 3

Gate 3 remains the learner contract. Gate 4 describes the design work needed to satisfy that contract.

There is deliberately **not** a required one-to-one mapping between learner-contract responsibilities, authoring responsibilities, future pipeline stages, future schema fields, or learner-facing headings.

### Not decided by this gate

Product invariants (gate 5); predetermined pipeline stages (gate 6); Design Page / schema fields; final product name / `product_id`; UI; persistence / capture implementation; fixed activity subtypes; making social participation mandatory; altering sibling-product boundaries.

---

## S92-D06 — Product design gate 5 — Product invariants

**Date:** 2026-10-07  
**Status:** Accepted  
**Gate:** 5 — Product invariants — **COMPLETE**  
**Depends on:** [S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose) · [S92-D03](decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products) · [S92-D04](decisions.md#s92-d04--product-design-gate-3--learner-contract) · [S92-D05](decisions.md#s92-d05--product-design-gate-4--authoring--design-responsibilities)

These invariants define truths that must hold for a valid instance of the new situated product regardless of eventual pipeline, schema, UI, delivery mode or persistence mechanism.

They were pressure-tested against live undergraduate and workplace-CPD Learning Journey evidence and against near-neighbour cases belonging to Interactive and Assessment Pack.

### Product invariants

#### 1. Activity-as-learning invariant

> Carrying out the purposeful activity in context must itself be a principal vehicle through which the intended learning develops.

It must not principally be:

- a means of consuming explanation;
- engagement with a deliberately designed / facilitated experience where that experience principally mediates learning; or
- performance elicited principally so learner capability can be interpreted or judged.

Retain the Gate 2 educational-centre-of-gravity test ([S92-D03](decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products)). The mere presence of learner action does not satisfy this invariant.

#### 2. Purposeful-action invariant

> The learner must be sufficiently oriented to undertake educationally meaningful action, not merely given a task instruction.

The activity must have an intelligible educational purpose and enough orientation for purposeful action.

A generic instruction such as “go away and research X” is not sufficient merely because activity occurs outside the generated resource.

#### 3. Contextual-agency invariant

> The activity must preserve sufficient learner agency for authentic decisions, encounters, observations, participation or practice to carry educational weight.

The product may scaffold and bound the activity. It must not script away the meaningful learner action through which the situated learning is intended to occur.

Agency does not imply solitary work: the activity may deliberately involve other learners, colleagues, practitioners, groups or communities where appropriate.

#### 4. Context-fit invariant

> The activity must be designed for the circumstances in which the learner will actually undertake it.

This includes relevant practical, ethical and contextual boundaries.

Where material variation is foreseeable, the design must support appropriate adaptation without losing the educational purpose, question, intention or standard.

Do **not** require every situated activity to contain variation, contingency or adaptation. Some valid activities may occur in relatively stable contexts.

This invariant **replaces** the earlier candidate “productive variation” invariant because variation is not universally required; **fitness for authentic context** is.

#### 5. Consequential-record invariant

> The activity must produce or preserve something educationally meaningful from the learner's experience that subsequent learning can work with.

Depending on the activity, this may include observations; findings; evidence; attempts; artefacts; decisions; reflections; limitations; departures; other consequential material.

“Record” is educational, not technological. This invariant does **not** imply a textbox, worksheet, upload, form, database, persistent learner account, or any particular capture mechanism.

What matters is that something consequential from the doing survives for educational use.

#### 6. Reconnection invariant

> What is learned, observed, produced or preserved through the activity must have an explicit educational destination beyond mere task completion.

It may reconnect to interpretation, reflection, discussion, comparison, decision-making, further activity, another learning experience, or assessment.

A valid instance must not terminate merely because the learner has completed the instructed action.

### Compressed product signature

> A valid instance makes purposeful doing a vehicle for learning, preserves meaningful agency in context, retains something consequential from the experience, and carries that learning forward.

This compresses the six invariants; it does **not** replace them.

### Pressure-test evidence

#### Cases admitted

**Undergraduate:** investigation of a product situation; gathering evidence for a product question; conducting a bounded product test.

**Workplace CPD:** conducting a workplace enquiry.

Across these cases: carrying out the activity itself carries substantive learning; meaningful learner agency remains; the authentic context matters; consequential observations / evidence / results are retained; later learning uses those results.

#### Near-neighbour cases rejected

- **Facilitated workshop reasoning** → remains **Interactive** when the deliberately designed / facilitated experience principally mediates learning.
- **Enquiry / test planning** → remains **Interactive** when the designed interaction principally carries the learning; planning an authentic activity does not itself make the experience situated.
- **Independent integrated product judgement** → remains **Assessment Pack** where the principal educational job is eliciting interpretable evidence of capability, even if the learner acts independently in an authentic context and produces a record.
- **Generic task / worksheet** → instructions plus response fields do not constitute situated learning where purposeful activity in context has not been educationally designed.

### Important consequences

Insufficient alone: learner action; external location; social participation; independence; authentic context; producing evidence; having a record / capture mechanism.

Product identity follows the educational centre of gravity and satisfaction of the invariants **together**.

Boundaries, attention, scaffolding and social configuration remain important design responsibilities / judgements from Gates 3–4 ([S92-D04](decisions.md#s92-d04--product-design-gate-3--learner-contract), [S92-D05](decisions.md#s92-d05--product-design-gate-4--authoring--design-responsibilities)), but are **not** promoted to separate universal product invariants. Their required form and prominence depend on the activity.

### Not decided by this gate

Predetermined pipeline stages (gate 6); Design Page / schema fields; final product name / `product_id`; UI; persistence / capture implementation; requiring adaptation in every instance; equating record with technical storage; mandatory learner-facing headings; altering sibling-product boundaries.

---

## S92-D07 — Product design gate 6 — Predetermined design pipeline

**Date:** 2026-10-07  
**Status:** Accepted  
**Gate:** 6 — Predetermined design pipeline — **COMPLETE**  
**Depends on:** [S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose) … [S92-D06](decisions.md#s92-d06--product-design-gate-5--product-invariants)

Derive the product pipeline from the educational decisions already established in Gates 1–5.

### Predetermined pipeline

```text
Situation → Activity → Support → Learning Return → Design Page
```

- Stages **1–4** are intellectual / model reasoning stages.
- **Design Page** is the structured synthesis boundary into PRISM.
- Use **one continuous model conversation** across the reasoning stages and Design Page synthesis, consistent with the successful Learning Journey architecture.

Do **not** treat these stages as a one-to-one translation of Gate 3 learner-contract responsibilities, Gate 4 authoring responsibilities, Gate 5 invariants, or future schema fields. Each stage exists because it performs a **distinct educational reasoning job**.

### Stage 1 — Situation

**Purpose:** Establish why situated activity is educationally warranted here and what authentic circumstances the design must work within.

**Core question:**

> What learning needs to happen through action, and in what real circumstances will that action occur?

Reason about matters such as: intended learning; learner characteristics and relevant prior position; authentic / situated opportunity; physical, professional, social or other relevant context; people, practices, resources or evidence potentially involved; constraints and boundaries already supplied; relevant preceding / subsequent learning or commission context; why purposeful doing is an appropriate principal learning vehicle.

This stage protects the pipeline from prematurely reducing the requirement to “write a task.” Retain the Gate 2 centre-of-gravity boundary ([S92-D03](decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products)). If the requirement is principally Expository, Interactive or Assessment, the reasoning should be able to identify that mismatch rather than manufacturing a situated product.

### Stage 2 — Activity

**Purpose:** Design the substantive purposeful activity the learner will actually undertake.

**Core question:**

> What should the learner actually undertake so that doing it develops the intended learning?

Reason about matters such as: purposeful learner action; scope; meaningful learner agency; context; relevant participation / encounters; expected effort; useful stopping conditions; what the learner needs to encounter, observe, investigate, practise, test or otherwise do for themselves.

Explicitly identify what must remain learner work. The activity should be sufficiently designed to support purposeful action without scripting away the authentic decisions, encounters, observations or variation through which learning is intended to occur. Do **not** define fixed activity subtypes.

### Stage 3 — Support

**Purpose:** Given the activity already designed, determine what support enables the learner to undertake it productively without PRISM taking over the substantive learning.

**Core question:**

> What support does this learner need to act productively in this context without PRISM taking over the substantive learning?

Reason about matters such as: appropriate scaffolding; relevant boundaries; what is worth attending to; context fit; social configuration where relevant; authority / access / privacy / sensitivity where relevant; practical limits; adaptation where material variation is foreseeable; preserving the educational purpose when circumstances differ from expectation.

Support follows Activity deliberately. Do **not** design controls / instructions first and then squeeze an activity into them. Do **not** require adaptation or social participation where they are not educationally relevant.

### Stage 4 — Learning Return

**Purpose:** Determine what should survive the situated experience educationally and how subsequent learning will use it.

**Core question:**

> What must survive the experience, and how will subsequent learning use it?

Reason jointly about consequential record and reconnection. Determine: what observations, findings, evidence, attempts, artefacts, decisions, reflections, limitations, departures or other material are educationally consequential; what distinctions should be preserved where useful; how much recording is proportionate; what the learner needs to recognise or retain; what later interpretation, reflection, discussion, comparison, decision, further activity or assessment will do with it; relevant handoff into subsequent Learning Journey experience where commission context supplies one.

Do **not** treat “record” as synonymous with a technical capture mechanism. Do **not** create recording requirements without an educational reason for retaining the material. Record and Reconnect are deliberately reasoned together because what should be retained depends on what subsequent learning needs.

### Stage 5 — Design Page

**Purpose:** Using the same continuous conversation, synthesize the completed reasoning into the constrained structured artefact accepted by PRISM.

This is the structured artefact boundary. The Design Page should faithfully express the resolved educational design rather than introduce a new round of educational reasoning.

After this boundary: deterministic validation / rendering / association / packaging / publishing may operate on the structured artefact; established Authoring capabilities may perform their own explicitly owned work where applicable; deterministic plumbing must **not** invent missing situated-learning design.

Do **not** define the Design Page schema at Gate 6 — that belongs to Gate 7.

### Continuous conversation

The pipeline uses **one continuous model conversation** across Situation → Activity → Support → Learning Return → Design Page.

Later stages therefore have access to the reasoning established earlier without requiring the user to paste intermediate model outputs back into PRISM.

This follows the architectural pattern proven by Learning Journey while retaining a **product-specific** predetermined pipeline. Do **not** infer that the actual prompts should duplicate Learning Journey prompts.

### Classification challenge

Each reasoning stage may expose evidence that the requested product classification is wrong.

The model should **not** dutifully manufacture a situated product when the emerging design shows that the educational centre of gravity properly belongs to a sibling product.

Examples:

- substantive learning principally through explanation → **Expository**;
- substantive learning principally mediated by the deliberately designed / facilitated experience → **Interactive**;
- principal job is eliciting interpretable evidence of capability → **Assessment Pack**.

Do **not** design runtime dynamic product switching at this gate. This is an educational reasoning requirement; any eventual UX / handling of a classification challenge belongs to later implementation design.

### Pressure-test evidence

Pipeline pressure-tested conceptually against four recurring live cases.

| Case | Situation | Activity | Support | Learning Return |
| ---- | --------- | -------- | ------- | --------------- |
| Product-situation investigation | why encountering a real product situation matters | bounded investigation | scope, attention, observation/interpretation distinction, relevant constraints | observations retained for subsequent reframing |
| Evidence gathering | product question / claim and authentic evidence context | purposeful evidence gathering | appropriateness, access, boundaries, attention | findings / evidence preserved for later scrutiny and interpretation |
| Bounded product test | assumption / uncertainty and relevant context | learner carries out the bounded test | boundaries, attention to expected/unexpected evidence, adaptation where required | what actually happened retained so subsequent learning can update the decision |
| Workplace enquiry | workplace uncertainty / opportunity | sustained proportionate enquiry | access, authority, social participation, emerging evidence, adaptation where relevant | question / activity / evidence / deviations / limitations retained for subsequent interpretation |

The same pipeline accommodates all four **without** introducing activity subtypes.

### Hostile-test evidence

- **Generic task / worksheet** fails because Situation has not established why situated doing is the learning vehicle and later structure cannot compensate for weak educational design.
- **Interactive enquiry / test planning** remains Interactive when the designed experience principally mediates the learning and the learner has not yet undertaken the situated activity.
- **Assessment performance** remains Assessment where the principal job is eliciting interpretable evidence of capability.
- **Social learning** requires no special pipeline: social context may be reasoned through Situation, Activity and Support, with Learning Return preserving what matters from the encounter.

### Pipeline rationale

> The product determines the pipeline. Pipeline is part of product definition.

For this product, the smallest currently supported sequence of distinct intellectual jobs is:

> Situation → Activity → Support → Learning Return → Design Page

The pipeline is deliberately compact. Do **not** add stages merely to mirror the learner contract or authoring-responsibility lists.

### Not decided by this gate

Design Page / schema fields (gate 7); final product name / `product_id`; UI; persistence / capture implementation; fixed activity subtypes; runtime product switching; sibling-product architecture changes.

---

## S92-D08 — Product design gate 7 — Structured artefact / Design Page contract

**Date:** 2026-10-07  
**Status:** Accepted  
**Gate:** 7 — Structured artefact / Design Page contract — **COMPLETE**  
**Depends on:** [S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose) … [S92-D07](decisions.md#s92-d07--product-design-gate-6--predetermined-design-pipeline)

Record the canonical Design Page / structured-artefact contract for this product. Exact nested field names for conditional sub-elements may be refined during Gate 8 implementation so long as the semantic contract below is preserved.

### Canonical artefact

Stage 5 output is a **canonical PRISM page**:

- `artifact_type: "page"`
- `schema_version: "2.0.0"`
- title
- learner-facing page composition
- product-specific situated-learning semantic truth
- optional authoritative visual planning when educationally required
- ordinary assembly-state conventions as required by existing page architecture

Stage 5 synthesises this page from the **same continuous model conversation** used for:

```text
Situation → Activity → Support → Learning Return → Design Page
```

([S92-D07](decisions.md#s92-d07--product-design-gate-6--predetermined-design-pipeline))

The Design Page is the **structured artefact boundary**. After that boundary, deterministic Authoring / rendering / publishing may validate, assemble/hydrate, compile graphics requirements, associate resources and package output, but **must not invent** missing situated-learning educational decisions.

Do **not** introduce a special artefact type.

### Product-specific semantic core

The canonical page must preserve four required semantic concepts as a product-specific **`situated_learning`** namespace/object:

1. **Purpose** — intended learning; why learner-owned situated activity is the appropriate principal learning vehicle ([S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose)).
2. **Activity** — what the learner actually undertakes; relevant situated/authentic context; what substantive work and agency remain with the learner ([S92-D04](decisions.md#s92-d04--product-design-gate-3--learner-contract), [S92-D06](decisions.md#s92-d06--product-design-gate-5--product-invariants)).
3. **Record** — what consequential trace of the learner's experience must survive for educational use ([S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose), [S92-D06](decisions.md#s92-d06--product-design-gate-5--product-invariants) consequential-record invariant).
4. **Reconnection** — where that learning/record goes next; how subsequent learning will use it ([S92-D06](decisions.md#s92-d06--product-design-gate-5--product-invariants) reconnection invariant).

Exact implementation field names for conditional sub-elements need not be over-specified here before implementation validates the smallest useful representation.

### Conditional educational content

Important when educationally relevant; **not** universal mandatory empty schema furniture ([S92-D05](decisions.md#s92-d05--product-design-gate-4--authoring--design-responsibilities), Gate 5 context-fit vs adaptation distinction in [S92-D06](decisions.md#s92-d06--product-design-gate-5--product-invariants)):

- boundaries;
- attention guidance;
- adaptation guidance;
- social configuration;
- stopping/effort guidance;
- scaffolding;
- distinctions to preserve in the record;
- recording depth.

**Omit** irrelevant optional content rather than requiring meaningless placeholders.

### Learner-facing composition

`sections[]` owns coherent learner-facing presentation.

Do **not** require sections to mechanically mirror Purpose → Activity → Record → Reconnection. Those concepts are the canonical educational semantics; learner-facing sections may compose them in whatever coherent structure the resolved design requires.

Do **not** turn pipeline stages or design-analysis vocabulary into mandatory learner headings.

### Activities

Do **not** treat the situated activity as an Interactive `activities[]` item merely because both use the word “activity”.

Current Gate 7 design uses the ordinary page convention with **`activities: []`** unless implementation evidence identifies a genuine shared-page requirement to do otherwise.

The product-specific `situated_learning` object — **not** Interactive activity semantics — owns the educational activity contract.

### Product identity and provenance

Do **not** create a duplicate provenance system in the page.

Existing workflow/family identity continues to own ordinary product/commission provenance including `sourceWorkflowId` / `sourceCommissionId`.

Do **not** require page-level Learning Journey provenance.

Do **not** add `product_id` merely for symmetry. Existing architecture normally routes ordinary first-class product behaviour through workflow identity; only add a page-level identifier later if an actual consumer requires it.

### Learner record vs persistence

The canonical artefact specifies educationally:

- what should survive the experience;
- why it matters;
- relevant distinctions/depth;
- how it reconnects to later learning.

It does **not** specify a persistence implementation.

Do **not** bake into the Design Page: localStorage; text boxes; forms; uploads; account storage; LMS persistence; workflow-resource storage; or any other delivery-specific recording mechanism.

Do **not** store learner answers or completed record content in the canonical page.

**Gate 8 Slice 5 clarification (2026-10-07, live E2E enactability + record surface):**

| Layer | Role |
| ----- | ---- |
| `situated_learning.record.retain` (+ distinctions/depth where relevant) | Educational semantics — what must survive and why |
| `situated_learning.record.entries[]` (optional) | Educational specification of ordered learner-facing capture prompts (`entry_id`, `order`, `label`, optional `prompt`, optional `placement.after_section_id`) decided before the Design Page boundary |
| Shared `text_entry` workspace + draft runtime | Delivery capability — mechanical presentation of entries; not the principal learning experience |
| Browser local draft persistence | Delivery/runtime capability only (same-origin restore; not packaged in ZIP; not account/LMS) |

Embedded recording is optional (`entries` omitted or `[]` when external recording is intentional). External record destination remains allowed.

**Optional record placement (2026-10-07 presentation refinement):** Stage 5 may attach `placement.after_section_id` so an entry renders immediately after a named learner-facing `sections[].section_id` (embedded). Entries without placement remain in the consolidated `data-region="situated-record"` region after exposition. Hybrid pages may mix both. Placement is an educational/presentation decision at Stage 5 — deterministic code validates section existence and honours placement; it does not infer placement from labels or semantics. Workspace / responsePartId / draft identity are unchanged by placement.

**Learner page-kind (2026-10-07):** Situated Task learner HTML stamps `data-page-kind="situated_task"` when the canonical page carries `situated_learning` (authoritative product marker). Interactive pages retain `data-page-kind="interactive"`. Detection does not use activities[] / workspace heuristics.

**Standalone enactability invariant (Gate 8 Slice 5):** A published Situated Task must contain enough educational information for the learner to undertake the intended activity without access to PRISM's authoring conversation or a parent Learning Journey. `activity.undertaking` must be independently enactable (not elliptical references to hidden Stage 1–4 reasoning).

**Enforcement:** Stage 5 synthesis prompt + live acceptance. Deterministic schema validation checks only structural presence of a non-empty `activity.undertaking` string — it does **not** judge educational self-containment via natural-language heuristics (live Workplace Investigation false-positive, 2026-10-07).

**Learning Journey educational handoffs (Gate 8, 2026-10-07):** A standalone Situated Task must establish everything required to undertake it. A Situated Task commissioned from a Learning Journey may intentionally depend on learner work from an earlier experience when that dependency is explicit in commission `specification_text` / `journey_context_text` / `dependencies`. Synthesis must honour the handoff, make the prior artefact to bring forward intelligible on the learner-facing page, and must not recreate the earlier constituent's learning work. PRISM does **not** provide runtime cross-product learner-state transfer. Explicit handoff architecture beyond this synthesis contract remains future work — do not invent a dependency graph here.

Persistence remains a **capability**, not the educational product definition.

#### Gate 8 Slice 5 amendment — record layers (live E2E correction)

Distinguish three layers (Hybrid A′):

1. **Record semantics** (`situated_learning.record.retain`, and optional distinctions/depth) — educational responsibility: what consequential material must survive and why.
2. **Record-entry specification** (`situated_learning.record.entries[]` when warranted) — educational decision, authored at Stage 5 from Learning Return, about which ordered learner-facing capture prompts externalise that record. Entries carry stable `entry_id`, `order`, `label`, optional `prompt`, optional `placement.after_section_id`. They must **not** contain learner answers/values or persistence concepts. Omit `entries` (or emit `[]`) when embedded capture is educationally unwarranted and external recording is intentional. Placement (embedded / consolidated / hybrid) is optional and model-owned.
3. **Workspace / local draft** — delivery/runtime capability only: deterministic mapping of entries → shared `text_entry` workspaces + browser same-origin draft persistence. Not part of the canonical educational definition; not packaged inside ZIP; not account/LMS/cross-device sync.

#### Standalone enactability invariant (Gate 8 Slice 5)

> A published Situated Task must contain enough educational information for the learner to undertake the intended activity without access to PRISM's authoring conversation or a parent Learning Journey.

In particular, `situated_learning.activity.undertaking` must be independently enactable (concrete task statement), not an elliptical reference to hidden Stage 1–4 reasoning.

### Graphics

Graphics are an **optional** shared Authoring capability when educationally warranted.

Preserve:

```text
canonical educational page
  → deterministic visual planning/compiler
  → required briefs
  → durable owner-store images
  → completion assessment
  → learner package
```

Do **not** persist compiled graphics briefs, workspace state, or completion ledgers in the Design Page.

When a visual is required, the authoritative pre-boundary artefact must already express:

- that the visual is educationally warranted;
- what educational work it performs;
- sufficient subject/context;
- binding/evidence anchors to the learner-facing content it serves.

The deterministic compiler must **not** invent the educational purpose.

#### Shared visual-purpose generalisation (Gate 7 compatibility result **B**)

The existing graphics pipeline is suitable and product-agnostic enough to reuse.

However, the Sprint 38 closed `purpose` vocabulary does **not** honestly represent visuals whose job is to support learner-owned enactment/orientation in context.

Do **not** redefine the existing `mechanism` purpose; it retains its causal-mechanism meaning.

**Gate 8** should make the smallest **additive, product-neutral** generalisation to the shared `purpose` vocabulary: **one** new educational-function token unless implementation evidence proves a second is necessary.

Working semantic definition:

> Supports the learner in carrying out, orienting within, or noticing appropriately during a learner-owned action or process, without performing the substantive learning work for them.

A working token such as `action_support` may be used during implementation; the decision is the **semantic addition**, not attachment to that exact spelling unless existing naming conventions make it clearly appropriate.

Reuse existing representations, scopes, evidence-anchor model, planner/compiler, owner store, completion semantics and packaging unless Gate 8 implementation evidence demonstrates a concrete incompatibility.

### Maths

Do **not** introduce a Situated-specific maths schema.

Use the existing shared maths contract:

- TeX `\(...\)` for inline maths;
- TeX `\[...\]` for display maths;
- existing Markdown delimiter protection;
- MathJax preview/export/package path;
- local package assets when required.

Learner-facing situated content may contain maths wherever the shared learner-facing Markdown path supports it.

Maths **entry** is a separate delivery/recording capability. Do **not** add it to the canonical contract merely because display maths is supported.

### Explicit exclusions from the canonical Design Page

Do **not** include:

- learner response values;
- persistence implementation;
- commission provenance duplicated from workflow identity;
- compiled graphics briefs;
- graphics completion state;
- Authoring workspace state;
- runtime resource manifests;
- situated subtypes;
- delivery-mode taxonomy;
- special maths structures;
- automatic product switching/classification UX.

### Rationale — prior gates

| Prior decision | How this contract preserves it |
| -------------- | ------------------------------ |
| [S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose) | Activity itself is principal learning vehicle — encoded in `situated_learning` Purpose + Activity |
| [S92-D03](decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products) | Centre-of-gravity boundary — page is an ordinary first-class page with product-specific semantics, not a stretch of Interactive/Expository/Assessment |
| [S92-D04](decisions.md#s92-d04--product-design-gate-3--learner-contract) | Learner contract — Purpose / Activity / Record / Reconnection core; conditional support content omitted when irrelevant |
| [S92-D05](decisions.md#s92-d05--product-design-gate-4--authoring--design-responsibilities) | Authoring responsibilities resolved before the artefact boundary; deterministic plumbing does not invent missing design |
| [S92-D06](decisions.md#s92-d06--product-design-gate-5--product-invariants) | Six invariants carried as semantic requirements, not as mandatory empty furniture or persistence mechanism |
| [S92-D07](decisions.md#s92-d07--product-design-gate-6--predetermined-design-pipeline) | Design Page is Stage 5 synthesis of the continuous conversation, not a new educational-reasoning round |

### Rationale — Gate 7 architecture evidence

- `page` / `2.0.0` is the shared canonical page identity;
- product-specific page structures legitimately differ (LJ overview, Interactive, Expository precedents);
- compiled Authoring state is derived rather than canonical;
- persistence is already separable from educational specification;
- display maths is a shared renderer/package capability;
- graphics architecture is reusable but its closed educational-purpose vocabulary needs the small additive generalisation above (compatibility result **B**).

### Not decided by this gate

Exact nested JSON field names under `situated_learning` beyond the four required concepts (settled at Gate 8 Slice 1 implementation); exact spelling of the new shared visual `purpose` token (semantic addition decided; token spelling may follow naming conventions at implementation); persistence mechanism; runtime product-switching UX; sibling-product architecture changes; whether page-level `product_id` ever becomes necessary for a concrete consumer.

**Implementation authorised:** Gate 8 — Implementation — may now proceed from [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md).

---

## S92-D09 — Product name and identity — Situated Task

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** [S92-D08](decisions.md#s92-d08--product-design-gate-7--structured-artefact--design-page-contract)

**Decision:**

| Field | Value |
| ----- | ----- |
| Product name | **Situated Task** |
| Canonical `product_id` | `situated_task` |
| Commissionability | `acceptsCommission: true` |

The Sprint 92 pack folder and historical discovery evidence may retain earlier working labels (e.g. “Situated Learning Activity First-Class Product”) where historically meaningful.

Create UI label: **Situated Task**.

---

## S92-D10 — Close Sprint 92 — Situated Task First-Class Product complete

**Date:** 2026-10-07  
**Status:** Accepted  
**Depends on:** [S92-D01](decisions.md#s92-d01--open-sprint-92--situated-learning-activity-first-class-product) … [S92-D09](decisions.md#s92-d09--product-name-and-identity--situated-task)

**Decision:** Mark **Sprint 92 — Situated Task First-Class Product** **COMPLETE / CLOSED**.

**Gate 8 — Live end-to-end acceptance: PASS.**

**Basis:** Exit criteria and live E2E acceptance in [SPRINT-92-CLOSURE.md](SPRINT-92-CLOSURE.md) are met. First-class product **Situated Task** / `situated_task` is implemented with the accepted five-stage pipeline, canonical `situated_learning` artefact, optional record entries + placement, shared text_entry / local draft delivery, LJ commissioning, educational handoff synthesis contract, shared `action_support` graphics, and shared page packaging.

**Explicitly not authorised by this close:**

- account / LMS / cross-device / Learning Journey learner-state Record interoperability;
- dedicated Assessment Pack revisit ([PB-FA-017](../../../backlog/PRODUCT-BACKLOG.md));
- Course Home / programme-level design;
- LMS/SCORM or other delivery packaging;
- Situated-specific renderer or package format;
- automatic opening of Sprint 93 or any successor.

**Successor:** [Sprint 93 — Assessment Pack Educational Contract](../2026-10-07-sprint-93-assessment-pack-educational-contract/SPRINT-93-START-HERE.md) opened 2026-10-07 by explicit decision [S93-D01](../2026-10-07-sprint-93-assessment-pack-educational-contract/decisions.md#s93-d01--open-sprint-93--assessment-pack-educational-contract). Sprint 92 remains **CLOSED**.

# Learning Journey Foundations

**Sprint:** 90 — Learning Journey Foundations  
**Status:** **COMPLETE** — authoritative foundation record for closed Sprint 90  
**Opened:** 2026-10-05  
**Closed:** 2026-10-05  
**Last post-closure update:** 2026-10-05 (90-minute / 1-day sanity-check corroboration)  
**Closure:** [SPRINT-90-CLOSURE.md](SPRINT-90-CLOSURE.md)  
**Not:** a production product specification; not an implementation plan; Sprint 90 remains **CLOSED**

This document records architectural conclusions for Learning Journey using three statuses:

| Status | Meaning |
| ------ | ------- |
| **Established** | Accepted for subsequent planning and implementation decisions. Do not reverse casually. |
| **Working hypothesis** | Strongest current hypothesis; subject to revision from real Learning Journey use. |
| **Open question** | Explicitly unresolved; deferred to implementation or further discovery. |

Related backlog context: [PB-FA-014 — Outcomes Map](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-014--outcomes-map), [PB-FA-015](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-015--additional-first-class-learning-resource-pipelines), [PB-FA-016 — Course Home](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-016--course-home--course-assembly).

---

## 1. Core definition

### Established

**Learning Journey** designs the progression of learning experiences required to move a particular group of learners towards intended learning, within the available **learning-time** and **duration** constraints.

- **Outcomes** describe where learners need to get to.
- **Learning Journey** describes how the learning should develop to get them there.

**Learning Journey is scale-independent** within current scope: short interventions through approximately module-scale learning (currently up to roughly a ten-week module).

**Programme-level curriculum design is out of current scope.**

---

## 2. Author-supplied learning envelope

### Established

The author supplies **learning time** and **duration** as constraints. PRISM does **not** adjudicate whether the author was right to allocate that amount of time.

PRISM reasons about the **educational implications** of those constraints (what can reasonably be achieved; progression; spacing, retrieval, revisiting, consolidation, increasing independence).

> The Learning Journey scales to the available learning envelope; it does not determine that envelope.

PRISM may reason about ambition/time trade-offs. That is different from telling the author that the supplied duration is wrong.

**Learning time** and **duration** are distinct pedagogical constraints. The journey does **not** organise primarily by week / session / course abstractions.

---

## 3. Elicitation boundary

### Established

> Elicitation acquires information; it does not perform educational reasoning.

The form collects facts, constraints, source material, and author intent. Model reasoning begins within the Learning Journey workflow.

Intended learning outcomes are **not** a mandatory elicitation field. Authoritative outcomes may arrive via source material; otherwise the workflow may derive intended learning.

A body of knowledge may be **supplied** or **developed within the workflow**.

**Source structure must not automatically become learning structure.**

### Working hypothesis — elicitation inputs

Learners; journey purpose / brief; learning time; duration; body of knowledge / sources; required constraints; optional preferences / context.

### Open question

- How authoritative existing outcomes are recognised in source material.
- How supplied vs PRISM-developed bodies of knowledge affect workflow reasoning.

---

## 4. Dynamic composition and product boundary

### Established

| Era | Composition locus |
| --- | ----------------- |
| Original PRISM | Dynamically composed **steps** into workflows |
| Emerging PRISM | Dynamically composes **products** into **learning journeys** |

> Dynamic composition belongs **between** products. Deterministic process belongs **within** products.

First-class product pipelines remain predetermined ([S89-D02](../2026-10-02-sprint-89-architectural-consolidation/decisions.md#s89-d02--first-class-product-pipelines-are-predetermined)).

> Learning Journey commissions; the product workflow designs.

**Learning Journey owns:** what learner-facing experiences need to exist; developmental sequence; educational jobs; important dependencies; appropriate product commissioning.

**The receiving first-class product owns:** how that commissioned educational job is designed through its predetermined pipeline.

Product-to-product relationships remain **source / specification ingestion**, not workflow splicing.

---

## 5. Experimental reasoning pipeline

### Established (experimentally supported candidate — not frozen production topology)

The completed experimental pipeline:

| Stage | Authoritative artefact |
| ----- | ---------------------- |
| JourneyRequirements | `learning_requirements` |
| JourneyProgression | `learning_progression` |
| JourneyElements | `learning_elements` |
| JourneyCommissioning | `learning_commissions` |

The experiment supports:

> Learning Journey can be produced as a chain of authoritative, **human-readable** reasoning artefacts.

Those artefacts should remain human-readable rather than being converted to JSON merely for implementation convenience.

### Working hypothesis — production assembly stage

Production Learning Journey will later require a final **deterministic design-page / assembly** stage that consumes the authoritative upstream artefacts and produces the actual PRISM Learning Journey product (author-facing output + structured data PRISM requires).

The exact JSON / schema contract for downstream product creation is **intentionally deferred** until implementation.

### Intellectual ownership of stages

**JourneyRequirements / `learning_requirements`:** what learning is required; starting point; intended learning; body of knowledge; capabilities; dependencies; constraints and trade-offs.

**JourneyProgression / `learning_progression`:** how learning must develop; developmental sequence; sequencing / dependencies; learner experiences; use of learning time and duration; scaffolding / fading; evidence / feedback progression.

**JourneyElements / `learning_elements`:** coherent parts of the learner experience with distinct educational jobs — **not** automatically products, lessons, weeks, pages, or content items.

**JourneyCommissioning / `learning_commissions`:** how required experiences could be realised through PRISM products; exposes experiences the current product family cannot yet realise.

### Open question

- Exact production wiring of these stages (boundaries, handoffs, Adjustments surfaces).
- Where constituent-journey reasoning should live in the production pipeline.
- How much of final assembly is deterministic vs model synthesis.

---

## 6. Worked experiments

### Established (experimental evidence — not formal validation)

Earlier monolithic clean-chat scale variants (1h/1d; 3h/1w; 30h/10w) showed qualitative scaling with learning time and duration. Retained as background evidence.

### Experiment A — undergraduate political philosophy

**Context:** first-year undergraduates; no previous formal political philosophy; Hobbes, Locke, Rousseau; **30 hours** over **10 weeks**; independent online learning; no live teaching.

**Results:**

- Progression successfully handled a substantial university-scale learning problem.
- **Four constituent Learning Journeys** emerged from **developmental changes**, not calendar structure.
- One constituent journey was **11 hours**, confirming that the earlier ~5-hour idea is **not** a threshold.
- JourneyElements produced **24** coherent, learner-manageable elements.
- Commissioning **completely accounted** for the 30-hour learning envelope.
- **19.25 hours** could be realised through current product capabilities.
- **10.75 hours** exposed **unsupported** learner-facing experiences.
- Unsupported experiences clustered around a recurring educational job: **purposeful learner-controlled activity** (directed study, retrieval, independent reconstruction, preparation, revision, reflection).
- No required learning was left as invisible / non-product activity.

### Experiment B — assessment and feedback CPD

**Context:** university teaching staff with little/no formal assessment-and-feedback education; **9 hours** over **3 weeks**; primarily independent online; current teaching practice available as authentic context; no scheduled live teaching.

**Results:**

- The pipeline **scaled down** successfully.
- Progression created **three constituent Learning Journeys** because of meaningful developmental changes, **not** because there were three weeks (allocations **3h / 2.5h / 3.5h**).
- JourneyElements produced **12** elements; boundaries remained educationally driven rather than duration-driven.
- Substantial integrated performance was retained where educational coherence justified it.
- Commissioning accounted for the complete **9-hour** envelope.
- Commissioning attempted to realise contextual independent work through a **broad interpretation of Interactive** — useful **product-discovery evidence**, not a reason to expand Interactive.
- Contextual activities (analysing an existing assessment, mapping feedback practice, developing alternatives, sustained design work) exhibit the **same underlying design problem** as the unsupported independent-study commissions in Experiment A.

### Established — cross-experiment conclusion

> Independent academic study and situated professional application appear to be variants of the same product-level educational job rather than evidence for separate products.

### Post-closure corroboration — Experiment C (90 minutes / 1 day)

**Status:** Corroborating evidence only. **Not** required for Sprint 90 closure. Sprint 90 remains **COMPLETE / CLOSED**.

**Context:** university students learning to make defensible credibility judgements about online claims; **90 minutes** over **1 day**.

The **unchanged** experimental pipeline produced:

- **one** continuous Learning Journey;
- **four** developmental phases;
- **seven** Learning Elements;
- **five** learner-facing commissioned experiences:

| # | Duration | Product / status | Title / role |
| - | -------- | ---------------- | ------------ |
| 1 | 15m | Interactive | Challenge the First Impression — combines Elements 1–2 |
| 2 | 25m | Interactive | Learn How to Investigate a Claim — combines Elements 3–4 |
| 3 | 25m | Interactive | Compare and Weigh the Evidence — combines Elements 5–6 |
| 4 | 15m | **Unsupported commission** (Independent Task job) | Conduct an Independent Credibility Investigation — authentic learner-controlled investigation using external online sources |
| 5 | 10m | Assessment Pack | Make and Evaluate a Defensible Judgement — uses findings from the independent investigation |

Commissioning found that for the independent investigation:

- **Expository** would distort the purpose (structured explanation is not the primary mechanism);
- **Interactive** could simulate or contain the investigation, but would change the requirement for learner-controlled activity in an authentic external environment;
- **Assessment Pack** could require/evaluate the resulting performance, but the principal purpose of the independent activity is not itself assessment.

Together with Experiments A and B, this is a third materially different recurrence of the same product-level design problem.

### Established — decomposition without fragmentation

> Learning Journey decomposition is not resource fragmentation.

A single coherent Learning Journey may contain multiple learning elements, which commissioning may **recombine or divide** into product-sized experiences according to educational purpose.

Experiment C makes the distinction particularly clear:

- the Journey remained **one** coherent Learning Journey;
- seven elements did **not** become seven resources;
- Elements 1–2, 3–4, and 5–6 were each **recombined** into coherent product-sized Interactive experiences;
- Element 7 remained one coherent learning element, but commissioning **split** its realisation across two materially different product-level jobs: independent investigation followed by assessed judgement.

This demonstrates the distinction among:

- **journey architecture**;
- **learning-element architecture**;
- **product architecture**.

It also shows Learning Journey can address the previous tendency to force a complete learning requirement into one oversized resource **without** replacing that problem with arbitrary micro-resource fragmentation.

Do **not** establish preferred product durations or numerical decomposition rules from this evidence.

### Historical note

Earlier partial staged political-philosophy snapshots (e.g. 12 elements / six product commissions before the completed Experiment A run) are superseded by Experiment A above for final Sprint 90 evidence. Lessons retained from earlier commissioning work: learning-element time ≠ product duration; learning element ≠ PRISM product; explanation may live inside Interactive when consequential action remains structurally important; evidence/feedback do not automatically imply Assessment Pack.

---

## 7. Constituent Learning Journeys

### Established (principle) / Working hypothesis (structure)

> Learning Journey owns chunking. It may create constituent journeys whenever educational coherence or learner manageability justifies them. Scale makes subdivision increasingly likely, but does not mechanically determine it.

Constituent journeys are **not** created by calendar or duration thresholds. Experiment A’s **11-hour** constituent journey confirms ~5 hours is **not** a hard rule and should not be encoded as one.

**Candidate hierarchy:**

Module-scale Learning Journey → constituent journeys where justified → learning elements / experiences → PRISM product commissions

Short Learning Journey → learning elements / experiences → PRISM product commissions

Do **not** prescribe a pedagogical template for every constituent journey.

### Open question

- Exact relationship among constituent journeys, learning elements, and production commissions in production artefacts.

---

## 8. Commissioning invariant

### Established

> Every required Learning Element must ultimately be realisable through one or more learner-facing PRISM product outputs. Where the current product family cannot appropriately realise an experience, preserve the requirement as an **unsupported commission** rather than making the learning invisible.

This does **not** mean one Learning Element = one product. Products may span adjacent elements where coherent; an element may be served by multiple products.

> Learning-element time is not product duration.  
> Learning element ≠ PRISM product.

Do **not** leave required contextual application, retrieval, reflection, or independent work as invisible non-product “VLE activity”.

Learning Journey designs what learning requires **without** being artificially constrained by the current catalogue — but unsupported commissions stay **visible** as product-discovery evidence.

---

## 9. Provisional product-family hypothesis

### Working hypothesis (intended family for subsequent planning — not permanently closed taxonomy)

Provisional Learning Journey product family:

1. **Expository**
2. **Interactive**
3. **Independent Task** — **intended first-class product for subsequent implementation planning**
4. **Assessment Pack**

Retain [PB-FA-015](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-015--additional-first-class-learning-resource-pipelines):

> A new first-class PRISM product should exist because achieving its educational purpose requires a **materially different design process**, not because the finished resource has a recognisable format.

Prefer a small number of pedagogically distinct flexible products over proliferation.

### Expository — conceptually healthy

Principal educational job: structured learning information / explanation.

Text, audio, video, podcast, illustrated material, etc. are **media / form choices**, not separate products.

Possible future capability: lightweight interaction where explanation remains primary. **Not** Sprint 90 implementation.

### Interactive — conceptually healthy; unchanged by Sprint 90

Do **not** recommend changes to Interactive arising from Sprint 90. Assume the existing product can serve the Interactive role for now.

Experiment B’s stretch of Interactive into extended contextual independent work is evidence for **Independent Task**, not a requirement to modify Interactive. Experiment C likewise refused to force authentic open-web investigation into Interactive.

### Independent Task — intended first-class product for subsequent implementation planning

Across three materially different cases, the same product-level design problem has recurred:

- undergraduate political philosophy — directed independent study, reconstruction, preparation, revision, reflection;
- university staff CPD — contextual application and design work using the learner’s own professional context;
- 90-minute online-information journey — authentic independent open-web investigation.

The three cases are sufficient evidence that the **product category is real**. Further discovery should focus on designing / implementing the product **when authorised**, rather than repeatedly testing whether the category exists.

**This does not mean:** Independent Task is implemented; its production pipeline is designed; its exact specification is settled; or implementation is authorised by Sprint 90 (which remains closed).

**Provisional educational purpose:** Independent Task frames purposeful learner activity undertaken substantially **outside** the product itself, and provides a structured place for the learner to **record** the resulting thinking, findings, observations, or conclusions.

**Basic design grammar:** brief → purposeful activity → record → reconnect

May include (same product, not separate products unless later evidence shows distinct design processes): directed reading / source study; research / inquiry; retrieval / consolidation; independent practice; observation; workplace / situated application; preparation; composition; revision; reflection.

The **learner record** matters: capture findings, observations, thinking, decisions, notes, summaries, or other outputs so later products can use the learner’s work.

Not implemented in Sprint 90.

### Assessment Pack — retain; broader future capability

Intended capability is broader than the current alpha implementation. It should ultimately support extended constructed performances (essays, case analyses, structured critiques, worked solutions, and similar) where the **principal** educational purpose is gathering interpretable evidence of learning.

Record as **future product capability work**, not Sprint 90 implementation.

### Research alignment (careful)

The emerging model is **broadly consistent** with established learning-design traditions such as Laurillard’s Conversational Framework / ABC Learning Design (acquisition, inquiry, practice, production, discussion, collaboration).

Do **not** claim that research proves PRISM’s four-product taxonomy or that PRISM implements Laurillard / ABC.

Relevant conclusion:

> PRISM’s emerging product family is consistent with established accounts of different ways in which learning is developed and evidenced, while deliberately grouping learning mechanisms more coarsely where they can be served by the same educational design process.

Social / collaborative learning remains a useful future test of sufficiency. Do **not** create another product speculatively.

---

## 10. Persistence (cross-product capability)

### Established

Persistence is **not** a first-class product.

PRISM products and eventual delivery / VLE integration need to preserve learner contributions so later products can retrieve / use them.

**Pattern:** product → learner contribution → persistence → later product

Enables initial positions, analyses, observations, notes, designs, and other learner-generated work to be revisited, compared, revised, or used later.

Do **not** invent a Portfolio, Journal, Notebook, or Learning Record product merely to provide persistence.

**Post-closure compact example (Experiment C):** Interactive development → Independent Task investigation / findings → Assessment Pack judgement. The learner’s sources / findings need to survive the transition into the Assessment Pack. This reinforces, but does not change, the established conclusion that persistence is a cross-product capability rather than a separate product.

---

## 11. Delivery-platform independence

### Established

Learning Journey should **not** design around a particular VLE.

**Target architecture:** Learning Journey → learning elements / constituent journeys → PRISM product commissions → PRISM products → delivery / publishing environment.

Xerte / VLE is a delivery / assembly environment, not part of the Learning Journey educational ontology.

---

## 12. Intended final Learning Journey output

### Working hypothesis

The eventual first-class Learning Journey product should expose:

1. **Rationale** — why the journey has this shape; starting point and intended development; important constraints, dependencies, and design decisions.
2. **Human-readable Journey** — learner progression; constituent journeys where useful; learner-facing experiences; sequence, learning time, and relationships.
3. **PRISM product specifications and transfer / journey-context text** — authoritative specifications capable of instantiating downstream first-class pipelines; learner-facing connective text (what has happened, what comes next, why it matters, what prior work to retain / reuse).

Provisional author-facing presentation model may remain **Rationale / Journey / Elements**.

The final deterministic design-page / assembly stage transforms authoritative human-readable reasoning artefacts into this usable output and the structured data PRISM requires.

**Do not** define the exact JSON schema now.

### Transition / journey-context text (established desire)

Keep short learner-facing context alongside each specification. Conceptual form (not rigid template): “You have done X and Y. In this part you will do A and B. This will prepare you for C.”

---

## 13. Specification contract

### Working hypothesis / provisional contract

> A learning-element / product specification is an authoritative input to product creation whose educational intent and constraints must remain traceable through the product’s predetermined pipeline.

> Learning Journey commissions; the product workflow designs.

The specification describes the educational commission, not the target product’s internal workflow stages. It should become self-contained enough that the receiving product does not need hidden Learning Journey context.

Exact schema deferred to implementation.

---

## 14. Adjustments / iteration

### Established

Do not invent a separate Learning Journey iteration architecture. Use existing **Adjustments**.

Pattern: elicitation → Learning Journey workflow reasons → output exposes consequences → Adjustments alter selected reasoning → workflow reruns.

Not every reasoning decision should become an Adjustment.

### Open question

- Which reasoning decisions deserve Adjustments in production.

---

## 15. Consolidated status tables

### Established (summary)

| # | Conclusion |
| - | ---------- |
| E1 | Learning Journey designs progression toward intended learning within learning-time and duration |
| E2 | Outcomes = destination; Journey = how learning develops |
| E3 | Scale-independent within short-to-~module scope; programme-level out of scope |
| E4 | Author owns learning envelope; Journey scales to it |
| E5 | Elicitation acquires information; does not perform educational reasoning |
| E6 | Source structure ≠ learning structure |
| E7 | Dynamic composition between products; deterministic process within products |
| E8 | Learning Journey commissions; product workflow designs |
| E9 | Experimental pipeline: Requirements → Progression → Elements → Commissioning (human-readable artefacts) |
| E10 | Two worked experiments (30h political philosophy; 9h assessment CPD) support the pipeline |
| E11 | Constituent journeys from developmental change, not calendar; ~5h is not a threshold |
| E12 | Learning element ≠ product; learning-element time ≠ product duration |
| E13 | Every required element must ultimately be realisable via PRISM product output(s); unsupported commissions stay visible |
| E14 | Independent study and situated application are variants of one product-level job |
| E15 | Decomposition ≠ fragmentation: journey / element / product architectures are distinct; commissioning may recombine or divide |
| E16 | Expository and Interactive conceptually healthy; Sprint 90 recommends no Interactive changes |
| E17 | Persistence is a cross-product capability, not a product |
| E18 | Delivery platforms are not Learning Journey ontology |
| E19 | Transition / journey-context text belongs with specifications |
| E20 | Use Adjustments; no separate iteration architecture |
| E21 | Post-closure 90m/1d sanity-check corroborates pipeline, Independent Task job, and decomposition-without-fragmentation |

### Working hypothesis (summary)

| # | Hypothesis |
| - | ---------- |
| H1 | Production needs a final deterministic design-page / assembly stage |
| H2 | Product family for subsequent planning: Expository · Interactive · Independent Task (intended) · Assessment Pack |
| H3 | Independent Task grammar: brief → purposeful activity → record → reconnect |
| H4 | Assessment Pack future capability includes extended constructed performances |
| H5 | Possible future lightweight interaction within Expository (explanation primary) |
| H6 | Author-facing IA: Rationale / Journey / Elements |
| H7 | Specs are authoritative Create inputs without changing product topology |
| H8 | Research alignment with Laurillard/ABC is consistency, not proof of taxonomy |

### Open questions (summary) — sufficient for bounded follow-on implementation decision

| # | Question |
| - | -------- |
| Q1 | Exact production wiring of the four reasoning stages + assembly stage |
| Q2 | Where constituent-journey reasoning lives in production |
| Q3 | Exact specification / JSON schema (deferred to implementation) |
| Q4 | How Independent Task should be designed / implemented as a first-class product (category existence no longer the open question) |
| Q5 | Assessment Pack extended-performance capability work |
| Q6 | Persistence implementation across products and delivery |
| Q7 | How much final HTML / product output is deterministic vs model synthesis |
| Q8 | Which Adjustments to expose |
| Q9 | Whether social/collaborative learning later requires further product discovery |
| Q10 | Authoritative-outcome recognition and supplied vs developed knowledge effects |

---

## 16. Sprint 90 boundaries (historical)

Sprint 90 did **not**: implement Learning Journey; implement Independent Task; extend Assessment Pack; change Expository or Interactive; fix Learning Journey JSON/schema; implement delivery/VLE persistence; invent a permanent product taxonomy; open a successor sprint automatically.

See [SPRINT-90-CLOSURE.md](SPRINT-90-CLOSURE.md).

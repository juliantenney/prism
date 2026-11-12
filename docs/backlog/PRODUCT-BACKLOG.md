# PRISM Product Backlog

**Canonical location:** `docs/backlog/PRODUCT-BACKLOG.md`  
**Status:** Active — **alpha-use period** (Alpha development complete, 2026-09-02)  
**Last updated:** 2026-11-12 (Sprint 97 CLOSED — ACCEPTED, qualified — PB-FA-028 delivered; PB-FA-029 deferred)
**Open sprint:** None — last closed [Sprint 97](../development/sprints/2026-11-12-sprint-97-learning-journal-and-design-pattern-foundations/SPRINT-97-CLOSURE.md)
**Last closed sprint:** [Sprint 96 — Unified Learning Journey Experience & Compatibility](../development/sprints/2026-11-03-sprint-96-unified-learning-journey-experience/SPRINT-96-CLOSURE.md) — **CLOSED — ACCEPTED**. Prior: [Sprint 95](../development/sprints/2026-11-03-sprint-95-unified-learning-journey-runtime/SPRINT-95-CLOSURE.md).

This file answers: **what might we actually choose to work on next?**

It is **not** a catalogue of every historical observation. Sprint debt ledgers and governance records remain historical evidence; they are not automatically planning obligations.

**Planning principle:** A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria. Do **not** pre-assign a sprint number until a sprint pack is opened.

**How next work is selected:** Deliberately from this backlog and/or **evidenced alpha-use findings**. Open a new sprint only via an explicit opening decision.

---

## 1. Significant product investigations / capabilities

### PB-FA-011 — Expository Resource

**Status:** First-class Expository Resource **implemented** ([Sprint 85 COMPLETE / CLOSED](../development/sprints/2026-09-21-sprint-85-expository-resource-implementation/SPRINT-85-CLOSURE.md)).

A high-quality, richly written and illustrated explanatory learning resource analogous to a strong book chapter, designed for understanding through exposition rather than learner activity.

**Delivered (S83–S85):** investigation → planning → implementation of Create product `expository_resource`, sibling EJP/XD/XM pedagogy, ordered exposition sections, shared graphics/formal-notation/assembly/render/export path, Adjustments Scope / extent, learner closing paragraph — Interactive baseline protected.

**Closure distinction (S85):** establishes **functional** first-class Expository capability; does **not** claim learner-facing presentation is polished or final. Non-blocking polish/refinement observations remain observations only — not an automatic follow-on programme.

**Key architectural hypothesis (still open):** Expository Resource may also be a rich realised-content input to other PRISM products (e.g. Interactive generation after grounded exposition; later Podcast/Presentation). That relationship is **not** resolved by S85.

**Unresolved relationship to Research Synthesis** (remains open — do not treat as delivered):

> Is Research Synthesis a distinct PRISM product/domain, or is it a specialised source/provenance treatment of Expository Resource?

A possible distinction: Research Synthesis may require stronger multi-source synthesis, provenance, evidence and citation semantics; Expository Resource is concerned more generally with producing a rich, coherent explanation. Former **PB-FA-009** (Research domain pack maturation) is **merged into this open question** — not retained as an independent future product.

**Sprint allocation:** **Sprint 83 CLOSED** (investigation). **Sprint 84 CLOSED** — [Planning](../development/sprints/2026-09-21-sprint-84-expository-resource-planning/SPRINT-84-CLOSURE.md). **Sprint 85 CLOSED** — [Implementation](../development/sprints/2026-09-21-sprint-85-expository-resource-implementation/SPRINT-85-CLOSURE.md) ([S85-D08](../development/sprints/2026-09-21-sprint-85-expository-resource-implementation/decisions.md#s85-d08--close-sprint-85--expository-resource-implementation-complete)). Gates at close: focused **78/78** · first-class **339/339**. Binding remains accepted [S84 design](../development/sprints/2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md) · [S83-D04](../development/sprints/2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline).

**Remaining planning interest under this ID:** Research Synthesis relationship question only — not unimplemented Expository product work. Editorial quality of delivered Expository Resources was investigated and first-sliced under [PB-FA-012](#pb-fa-012--expository-editorial-quality--qa) (Sprint 86–87 — **CLOSED**).

### PB-FA-012 — Expository Editorial Quality & QA

Investigate and design the **editorial** quality layer for first-class Expository Resources — distinct from the instructional architecture already delivered in Sprint 85 — then implement and validate the bounded first successor slice.

**Problem frame:** A resource can be factually correct, pedagogically sensible and technically valid yet still feel editorially mediocre (assembled from competent components rather than authored as a coherent intellectual reading experience).

**Scope sketch:** general editorial quality model; repeatable Expository QA process (qualitative human judgement — not a numerical score programme); small diverse generated evidence set; pipeline responsibility map on the **existing** Expository topology; XD→XM prose/representation integration finding; typography/editorial rendering requirements; bounded successor implementation design; first-slice implementation + live validation.

**Explicit non-scope (never first-slice acceptance):** full T-009 Option B; semantic H3 programme; font/serif programme; callout kit; post-XM rewrite stage; mandatory material↔figure 1:1; broad design-system programme; CAS/per-cell table maths; Interactive prompt generalisation; Research Synthesis identity; Expository→Interactive architecture.

**Sprint allocation:** **Sprint 86 COMPLETE / CLOSED** (investigation/design). **Sprint 87 COMPLETE / CLOSED** (first-slice implementation + validation) — [T-008](../development/sprints/2026-09-22-sprint-87-expository-quality-first-successor-implementation/T-008-SPRINT-87-CLOSURE.md).

**Readiness:** **CLOSED** with Sprint 87. Deferred capabilities above remain future/backlog only if later authorised — not incomplete PB-FA-012 delivery.

### PB-FA-002 — Programming / code learning-resource support

Genuine missing future capability for programming learning resources.

**Scope sketch:** learner code handling; programming-specific workspaces; language-aware rendering; programming evidence and feedback.

**Evidence basis:** `S71-F-014` (Confirmed). Former research question PB-R-002 (which languages / IO affordances first) is absorbed here as discovery work when this item is planned — not a separate standing research theme.

**Readiness:** Evidence of need exists; approach and acceptance criteria not yet written — **not sprint-allocated**.

### PB-S-005 — Release / deployment packaging

Establish a repeatable path from active development to a **known-good stable release** (version/build identity, cache-bust discipline, regression gate, checklist, rollback, deployment/update procedure).

**Evidence:** Sprint 75 operator/debug experience; governance [D-006](../development/governance/ARCHITECTURAL-DEBT.md#d-006--release-packaging).

**Immediate concern:** a clean, reproducible deployment folder/package that separates what a deployable PRISM build needs from development and repository material. D-006 already states this: produce a package from known-good source rather than deploying the working project folder, and record what is shipped and from which verified state. The wider release path already noted here (version/build identity, cache-bust discipline, regression gate, checklist, rollback, update procedure) stays part of the same item.

**Boundary:** Do not use this item to design hosting, authentication, publishing, server-side user persistence, or other production infrastructure. Those are separate questions. Authentication is [PB-S-006](#pb-s-006--institutional-authentication-university-of-nottingham).

**Readiness:** Problem documented; approach and acceptance criteria not yet written — **not sprint-allocated**.

### PB-FA-018 — Shared data and mathematical visualisation

**Status:** Proposed — deferred to a dedicated future sprint. **Not sprint-allocated.**  
**Scope:** Cross-product platform capability. Does **not** change Sprint 93’s Assessment Pack educational contract.

Establish a shared, accessible, deterministic visualisation capability available to all PRISM products, supporting both authored data and learner-responsive interactions.

**Educational opportunity:** Learners inspect, manipulate, and reason with visual representations of data and mathematical relationships, rather than relying only on static graphics.

Charting and deterministic diagramming are potential capabilities inside this same shared graphics pipeline, available across products. They sit alongside mathematical visualisation. They do not retire generative image briefs.

Potential applications include:

- Interactive normal distributions, skewness, sampling distributions, and confidence intervals.
- Statistical plots, regression, and other research-methods visualisations.
- Learner-responsive spidergrams and formative feedback profiles.
- Charts based on learner-generated observations and data.
- Accessible visual explanations in Expository and evidence inspection in Assessment Pack.
- Deterministic concept maps and relationship diagrams whose nodes, labels, and connector conventions are authored as data.
- Learner-responsive visualisations that update from learner action in Expository, Interactive, Assessment Pack, and Situated Task.

**Architectural principles:**

- One shared capability, available to all products.
- Product identity remains determined by educational responsibility.
- Authoritative data and mathematically correct computations.
- Declarative specifications wherever possible; no routine generation of bespoke JavaScript.
- Browser-side interactivity without runtime AI or backend dependencies.
- Accessibility by design: keyboard interaction, meaningful descriptions, numerical and tabular alternatives.
- Consistent behaviour in Preview, standalone HTML, and Learning Journey packages.
- Explicit versioning and validation of supported visualisation specifications.

**Existing foundation:** Assessment Pack already compiles a deterministic horizontal-bar SVG from `data_figure` and authoritative numeric data (`lib/assessment-pack-publish.js` · `realiseDataFigure`). That path should inform the shared architecture. It is not a general charting library, and it is not discarded by this item. Generated image briefs (`ordered_bar_strip`, `evidence_t_chart`, and related visual-affordance tokens) remain pictures, not data-bound charts. Where those pictures should stay generative but need a more faithful brief, explicit authored structure is [PB-FA-020](#pb-fa-020--structured-visual-specifications-for-generated-graphics). Optional maths follow-ons stay [PB-M-001](#pb-m-001--future-maths-capabilities).

**Sprint discovery questions:**

1. Which charting and mathematical libraries best fit PRISM’s offline, self-contained publishing model?
2. What common specification can support fixed and learner-responsive visualisations?
3. How should learner workspace data bind to charts safely?
4. What accessible alternatives and interactions must every visualisation provide?
5. How should all Design Page pipelines discover and use the shared capability?

**Initial acceptance demonstrations:**

- An accessible, parameter-adjustable normal distribution in an Interactive experience.
- A learner-responsive diagnostic spidergram in Assessment Pack.
- A fixed statistical chart in Expository.
- Equivalent functionality in Preview and exported learner packages.

**Out of scope:** A comprehensive statistical analysis package; arbitrary generated JavaScript; changes to Sprint 93’s educational contract.

**Readiness:** Proposed from the 2026-10-08 charting audit. Approach not yet chosen — **not sprint-allocated**.

### PB-FA-019 — Interactive V2: educational solution design and interaction surfaces

**Status:** Proposed — future development. **Not sprint-allocated.**  
**Type:** Major product discovery → later implementation (discovery first).  
**Priority:** Future development.

**Dependencies:**

- Learning Journey commissioning model (in place).
- Shared-material pipeline — Phase 1 handoff (parent LJ `source_context` → constituent prompts) landed 2026-11-05; **Phase 2** (automatic detection / generate-once shared material) and live stability of LJ generation should be proven before Interactive workflow changes.
- Accepted Assessment Pack educational-contract revisit [Sprint 93](../development/sprints/2026-10-07-sprint-93-assessment-pack-educational-contract/SPRINT-93-CLOSURE.md) ([PB-FA-017](#pb-fa-017--assessment-pack-first-class-product-revisit)) — **CLOSED — ACCEPTED** (pattern reference for educational-solution design).

**Rationale:** The original Interactive workflow was designed to support a complete learning experience within a standalone resource. Learning Journeys now provide a stronger mechanism for orchestrating pedagogical progression across resources. Interactive v2 should adopt the educational-solution design approach already working well for Assessment Packs and other Learning Journey components.

**Design principle:** *Learning Journeys orchestrate progression between learning experiences; Interactive designs the pedagogy within an individual experience.*

**Central question:** How should Interactive be redesigned when Learning Journey establishes educational context, progression, commissioning brief, and (when present) authoritative shared material, so Interactive concentrates on designing and realising the consequential engagement required inside one experience?

**Proposed direction:**

- Commission Interactive to design an educational solution from learning purpose, audience, context and constraints.
- Allow the designer to select appropriate interaction capabilities rather than prescribe a fixed structure.
- Develop a small, reusable repertoire of accessible, tested **interaction surfaces** (candidates: data exploration, decision-making scenarios, simulations, classification, annotation, constructed responses).
- Allow surfaces to be combined where pedagogically appropriate.
- Support authoritative shared datasets and scenarios inherited from Learning Journeys, while retaining standalone resource generation.
- Reduce duplication of pedagogical decisions already made at Learning Journey level.
- Related platform capability where visuals/data apply: [PB-FA-018](#pb-fa-018--shared-data-and-mathematical-visualisation).

**Initial investigation (when opened):**

1. Review the current Interactive workflow against the Learning Journey commissioning model.
2. Identify which stages can be simplified, retained or replaced.
3. Assess a small initial set of interaction surfaces.
4. Clarify division of responsibility between Learning Journey and Interactive; propose an Interactive V2 educational contract.
5. Evaluate architectural options (evolve existing pipeline vs more fundamental redesign). Do not assume replacement is necessary.
6. Use authentic commissions (including demanding LJ briefs) as discovery evidence.

**Guardrails / out of scope for now:**

- **No changes to the current Interactive workflow** until the shared-material pipeline is proven and existing Learning Journey generation is stable.
- No implementation during discovery.
- No assumption that more widgets equal better learning.
- No routine stochastic JavaScript generation.
- Preserve standalone Interactive capability.
- No weakening of deterministic execution or learner-facing reliability.

**Success criterion (discovery):** We understand what Interactive must become educationally — including the interaction-surface repertoire and LJ/shared-material contract — before deciding how to build it.

This is a revisit of the existing Interactive product, not a new first-class product under [PB-FA-015](#pb-fa-015--additional-first-class-learning-resource-pipelines).

**Readiness:** Proposed. Dependencies partially met (LJ commissioning + Assessment Pack pattern + Phase 1 shared-material handoff). Remains **not sprint-allocated**. Do not open until shared-material Phase 2 / LJ generation stability criteria are accepted. Interactive V1 expansion (forced activity structure / transfer beats) remains Sprint 94 debt, not absorbed.

### PB-FA-020 — Structured visual specifications for generated graphics

**Status:** Proposed — unassigned. **Not sprint-allocated.**

Author explicit visual structure — nodes, relationships, labels, visual conventions, and constraints — so image-generation briefs can be compiled from that structure rather than from unstructured prose alone.

**Intent:** Generative graphics remain a valid rendering route. The specification makes the brief more faithful. It does not replace image generation with a diagram renderer.

**Related:** Charting and deterministic diagramming, including concept maps, relationship diagrams, and learner-responsive visualisations across products, belong to [PB-FA-018](#pb-fa-018--shared-data-and-mathematical-visualisation). This item supplies structured authorship for briefs that still generate images.

**Readiness:** Proposed 2026-10-08. Approach not yet chosen — **not sprint-allocated**.

### PB-FA-021 — Expository editorial integration and publication quality

**Status:** Proposed — unassigned. **Not sprint-allocated.**

Author and publish Expository resources with a coherent editorial hierarchy, so the learner experience reads as a deliberately edited educational publication rather than an assembly of authored components.

**Context:** *Choosing a Clinical Study Design: Questions, Evidence and Trade-offs* scored 84/100 on PRISM Expository Resource Quality Benchmark v1.2, with no identified Critical or Major production defects. Its educational purpose, intellectual progression, and disciplinary reasoning are strong. The principal remaining weakness is editorial integration: diagrams, captions, explanatory tables, descriptive equivalents, and prose sometimes compete for attention.

**Desired capability:**

- Each representation has a clear, distinct educational purpose.
- Figures, tables, captions, and prose complement rather than unnecessarily repeat one another.
- Supporting materials are proportionate to the intellectual argument.
- Section transitions and explanatory emphasis support a continuous reading experience.
- Legitimate accessible descriptions and alternative representations are preserved, with appropriate presentation rather than indiscriminate removal.
- Learner-facing output feels like a deliberately edited educational publication.

**Evidence:** Benchmark v1.2: 84/100. Representation 76, Information Architecture 78, Typography/Hierarchy 78. No production cap. Strong educational foundations should be preserved.

**Acceptance direction:** Compare actual published learner experiences with their intended educational purpose. Identify where editorial structure adds to or detracts from understanding. Evaluate improvements through live publication inspection and independent QA. Aim for consistent 90+ quality without treating the score itself as the optimisation target.

**Boundaries:** Do not modify benchmark workflows or scoring rules. Do not weaken accessibility to make pages visually simpler. Do not reopen the recently fixed metadata leakage or alt-text defects unless new evidence warrants it. This is not shared graphics, deterministic diagramming, or structured visual specification — those remain [PB-FA-018](#pb-fa-018--shared-data-and-mathematical-visualisation) and [PB-FA-020](#pb-fa-020--structured-visual-specifications-for-generated-graphics).

**Related:** First-class Expository capability is [PB-FA-011](#pb-fa-011--expository-resource). The earlier editorial-quality investigation and first slice are closed under [PB-FA-012](#pb-fa-012--expository-editorial-quality--qa). This item does not reopen that delivery.

**Readiness:** Proposed 2026-10-08. Approach not yet chosen — **not sprint-allocated**.

### PB-FA-025 — Duration fidelity: learner workload budgeting

**Status:** Proposed — unassigned. **Not sprint-allocated.**  
**Priority:** Medium–high (recurring, systemic instructional-design issue).

**Problem:** PRISM frequently generates resources whose actual learner workload substantially exceeds the duration specified during commissioning. The issue is insufficient control of cumulative learner workload, not poor activity quality.

**Evidence:** *The Impossible Alibi: The Blackthorn Notebook Mystery* was commissioned as a 25-minute standalone Interactive resource, but review of the complete experience suggests approximately 60–85 minutes of learner activity (QA benchmark 88/100). The same overshoot pattern has been observed repeatedly across PRISM resources.

**Proposed direction:** Investigate a lightweight, cross-resource approach to duration fidelity using existing workflow stages and generation contracts. Treat commissioned duration as a meaningful design constraint; allocate realistic time budgets across activities; account for reading, evidence examination, cognitive processing, response production and self-review; prevent later material generation from expanding workload beyond the original allocation; check cumulative duration plausibility at Design Page and QA; validate against several existing resources rather than optimising for one example.

**Avoid:** Simplistic word-count calculations; rigid timing formulas; new workflow stages; unnecessary architectural complexity.

**Acceptance criteria (eventual implementation):**

1. Generated activity workloads are plausibly consistent with the commissioned duration.
2. Time allocations account for learner actions, not just content volume.
3. Later generation stages preserve the agreed workload budget.
4. Verification identifies material duration mismatches.
5. Existing resource types and workflows remain compatible.

**Boundaries:** Backlog investigation / eventual contract and QA improvements only when sprint-allocated. Do not absorb into Interactive V2 ([PB-FA-019](#pb-fa-019--interactive-v2-educational-and-architectural-discovery)) as a substitute for this cross-resource concern.

**Readiness:** Proposed 2026-11-09 from alpha-use / QA evidence. Approach not yet chosen — **not sprint-allocated**.

### PB-FA-026 — Assisted brief development: from teaching intention to learning experience

**Status:** Proposed — unassigned. **Not sprint-allocated.**  
**Priority:** Medium (strategic enhancement; not an immediate implementation priority).

**Problem:** PRISM’s commissioning form captures structured requirements well, but offers limited support for authors who have a teaching intention without a clear learning experience in mind. Creative briefs that unlock sophisticated generation can emerge through conversation outside PRISM rather than through the commissioning interface — suggesting generation capability may outpace support for formulating imaginative, pedagogically purposeful commissions.

**Evidence:** The *Impossible Alibi* experiment showed PRISM can construct detailed, internally coherent fictional scenarios (characters, events, evidence, contradictions, authentic reasoning opportunities). The enabling creative brief was developed conversationally outside PRISM.

**Proposed direction:** Explore an optional conversational brief-development experience that helps authors move from an initial teaching problem or intention towards a well-defined resource commission. It could help clarify what learners should understand, practise, decide or produce; explore pedagogical approaches and learning experiences; consider scenarios, simulations, investigations, explanations, practice and authentic assessment; identify contexts, evidence, decisions, tensions or uncertainties; develop a promising idea into a structured commission compatible with existing workflows; and review/refine the brief before proceeding. Support different disciplines and resource types, including Learning Journeys. Do not privilege fictional scenarios over other appropriate approaches.

**Design principles:**

- Optional — retain direct access to the existing commissioning form.
- Conversational and exploratory rather than another lengthy questionnaire.
- Support author agency and creative choice.
- Ground suggestions in intended learning, audience and constraints.
- Produce structured outputs compatible with existing commissioning requirements.
- Avoid duplicating existing generation stages or introducing unnecessary architectural complexity.
- Preserve the distinction between developing a brief and generating the resource.

**Potential acceptance criteria:**

1. An author can begin with an incomplete teaching intention and explore plausible learning-design approaches.
2. The author can compare, select and refine ideas before committing to a resource design.
3. The resulting brief can populate or inform PRISM’s existing commissioning process.
4. Authors can inspect and edit the brief before generation.
5. Existing direct commissioning workflows remain unchanged.

**Boundaries:** Backlog investigation only until sprint-allocated. Do not redesign the commissioning form or change generation contracts under this entry alone. Distinct from Interactive V2 redesign ([PB-FA-019](#pb-fa-019--interactive-v2-educational-and-architectural-discovery)) and from duration/workload fidelity ([PB-FA-025](#pb-fa-025--duration-fidelity-learner-workload-budgeting)).

**Readiness:** Proposed 2026-11-10 from alpha-use / Impossible Alibi commissioning experience. Approach not yet chosen — **not sprint-allocated**.

### PB-FA-027 — Learning Design Extraction: technology-independent designs from completed resources

**Status:** Proposed — unassigned. **Not sprint-allocated.**  
**Priority:** Medium (future capability / proposed enhancement; not an immediate implementation priority).

**Objective:** Enable PRISM to analyse a completed learning resource or assembled Learning Journey and extract a reusable learning design specification that another educator could implement using different technologies, formats or teaching approaches, including face-to-face delivery.

**Problem:** Completed PRISM resources and Learning Journeys embody substantial pedagogical design (outcomes, sequence, activities, dependencies, assessment, reflection), but that design is currently bound to PRISM’s product forms and delivery mechanisms. Educators who want to reuse the *learning design* elsewhere lack a readable, technology-independent specification that separates pedagogically essential features from implementation-specific choices.

**Proposed scope:**

- Identify intended learning outcomes and the overall pedagogical approach.
- Extract the learning sequence, learner activities, expected learner outputs, feedback, assessment and reflection.
- Identify essential dependencies, including activity ordering, staged information disclosure and opportunities for learners to reconsider earlier judgements.
- Describe the role of case materials, evidence and other supporting resources.
- Distinguish pedagogically essential features from implementation-specific choices.
- Distinguish directly observable design features from inferred educational rationale; avoid presenting inferred intentions as established facts.
- Produce a readable, implementation-independent specification suitable for adaptation by educators.

**Illustrative use case:** Given the completed Learning Journey *The Decision That Went Wrong*, PRISM extracts a design that an educator could implement as a face-to-face seminar, blended workshop, Moodle course, Xerte resource or another suitable format, while preserving the essential progression from initial judgement through evidence appraisal, reconsideration, stakeholder evaluation and independent recommendation.

**Acceptance criterion (eventual implementation):** An educator unfamiliar with PRISM can use the extracted specification to plan an alternative implementation without reproducing the original technology, while retaining the essential learning activities, dependencies, assessment and pedagogical intent evident in the source.

**Boundaries:** Future capability investigation only until sprint-allocated. Do not implement extraction workflows, schemas or generation changes under this entry alone. Distinct from assisted brief development ([PB-FA-026](#pb-fa-026--assisted-brief-development-from-teaching-intention-to-learning-experience)) — that item helps authors *compose* a commission; this item would *abstract* a design from a completed resource or journey. Distinct from Course Home / programme assembly ([PB-FA-016](#pb-fa-016--course-home--course-assembly)) and from Learning Journey continuity/runtime delivery (closed under [PB-FA-022](#pb-fa-022--learning-journey-continuity-contract)–[PB-FA-024](#pb-fa-024--unified-learning-journey-experience--compatibility)).

**Readiness:** Proposed 2026-11-10 from alpha-use / Learning Journey design-reuse interest. Approach not yet chosen — **not sprint-allocated**. Not implemented.

---

## 2. Optional engineering / capability follow-ons

### PB-FA-010 — Prompt-contract consistency

Optional consistency / standardisation exercise: determine whether remaining PRISM prompts should be migrated to the structured prompt-contract format established for DLA/GAM **where this improves consistency, inspectability and testability**.

**Not:** architectural uncertainty, an alpha issue, or a required system-wide rewrite. Rationalise prompts individually in later bounded work if chosen.

**Readiness:** Method proven on DLA (Sprint 77); optional follow-on — **not sprint-allocated**.

### PB-M-001 — Future maths capabilities

Light future capabilities — **no commitment or scheduling**:

| Capability | Notes |
| ---------- | ----- |
| Mixed prose + maths editing | Rich editor spanning prose and mathematics |
| Per-cell maths in table-style response surfaces | Table cells with `input_modality: math` |
| CAS / symbolic correctness support | Symbolic checking beyond TeX entry/display |

Sprint 82 delivered first-class MathLive entry + MathJax display for dedicated maths fields. These remain optional post-alpha follow-ons. Shared data and mathematical **visualisation** (charts, distributions, learner-responsive plots) is a separate platform item: [PB-FA-018](#pb-fa-018--shared-data-and-mathematical-visualisation).

### Assessment Pack real-use calibration (Sprint 88 remainder)

**Status:** **Not done.** Not a new architecture. Sprint 89 is closed and did not do this work.

Sprint 88 closed with the Assessment Pack architecture in place. Further real use was not completed. Remaining acceptance, before any change to depth, count, or form-selection defaults:

- exercise fresh Assessment Packs;
- observe what automatic component count actually chooses;
- compare Quick, Standard, and Thorough (still an uncalibrated hypothesis);
- inspect Plan Assessment Evidence rationale and form selection;
- inspect the learner experience;
- fix only concrete findings from that use.

Record: [Sprint 88 closure](../development/sprints/2026-09-28-sprint-88-default-product-workflows-and-assessment-architecture/SPRINT-88-CLOSURE.md). Sprint 89 did not reopen Assessment architecture.

This calibration remains about exercising depth, count, and form-selection defaults. Sprint 93 closed the evidence-led product revisit as [PB-FA-017](#pb-fa-017--assessment-pack-first-class-product-revisit). That acceptance does not complete this calibration.

### PB-S-007 — Broad-suite renderer/page-render failure reconciliation

**Status:** **Complete** (2026-10-05). Diagnostic + remediation done. Not sprint-allocated (no sprint opened; Sprint 89 remains CLOSED).

**Record:** [PB-S-007-broad-suite-failure-reconciliation.md](../development/governance/PB-S-007-broad-suite-failure-reconciliation.md) (§12 remediation)  
**Prior ancestor:** [D-014](../development/governance/D-014-test-suite-confidence-diagnostic.md)

| | Tests | Passed | Failed | Skipped |
| - | ----: | -----: | -----: | ------: |
| Sprint 89 Slice 4 baseline | 4220 | 3702 | 517 | 1 |
| After PB-S-007 remediation | **3705** | **3704** | **0** | **1** |
| First-class gate | **339** | **339** | **0** | 0 |

The 517 failures were not 517 product bugs. Remediation fixed harness gaps (GAM assembler + first-class family inject; DOM stubs; sections→activities test convert), retired superseded HTML/golden/prompt archaeology, and updated stale current-contract asserts. **No production `app.js` / `lib/` changes.** Suspected “A” Expository KS and Assessment Pack publish failures were harness/identity gaps, not renderer defects.

**Outcome:** Broad suite green; first-class still 339/339; confidence restored without restoring obsolete architecture.
---

## 3. Lightweight future product ideas

Concise only. **No implementation commitment.**

| Idea | Note |
| ---- | ---- |
| **Audiovisual / podcast script** | Adaptation of an existing learning resource into a production-ready educational script. A Custom workflow has already shown a credible sequence: Expository Resource → Design Media Adaptation → Author Audiovisual Script (spoken treatment, semantic speech intent, purposeful visual direction). The intellectual workflow is prototyped. A later question is whether this deserves a first-class capability, and how production would be handled if it does. Keep script and design separate from production infrastructure (TTS, audio rendering, video assembly, hosting). Not TTS of an Expository Resource, and not a committed product. |
| **Presentation / slideshow** | Distinct visual/presenter treatment. Hypothesis only: may be downstream of Expository Resource. **Not** PRISM's next architecture extensibility test (former PB-FA-008 superseded). |

---

## 4. Research

### PB-R-011 — Expository vs Interactive comparison

Given comparable Expository and Interactive resources derived from the same Content, Model Knowledge and Learning Outcomes:

1. which do **learners** prefer;
2. which produces better demonstrated **learning, retention and/or transfer**;
3. which do **educators** actually choose to create and deploy?

The educator question concerns **actual behaviour**, not merely stated pedagogical preference.

**Readiness:** Post-alpha research opportunity — no implementation commitment; informs PB-FA-011.

---

## 5. Exploratory future directions

**Not sprint-allocated. Not committed roadmap items.** Captured so the current line of thought is still intelligible later. Opening a sprint still requires an explicit decision and a concrete approach. Do not treat these as designs.

### PB-FA-013 — PRISM-aware model context

Explore what contextual understanding of PRISM itself should be available to model stages during a workflow: the product, its educational purposes, its terminology, and the relevant workflow boundaries.

The aim is better PRISM-aware reasoning, not larger prompts or indiscriminately more context. Do not design a context subsystem from this note.

### PB-FA-014 — Outcomes Map

Explore a first-class planning capability whose backbone is intended learning. Developed in Sprint 90 under the name **Learning Journey**.

**Foundations status:** [Sprint 90 — COMPLETE / CLOSED](../development/sprints/2026-10-05-sprint-90-learning-journey-foundations/SPRINT-90-CLOSURE.md) · authoritative record [LEARNING-JOURNEY-FOUNDATIONS.md](../development/sprints/2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md)

**Implementation:** [Sprint 91 — COMPLETE / CLOSED](../development/sprints/2026-10-06-sprint-91-learning-journey-first-class-implementation/SPRINT-91-CLOSURE.md) · [IMPLEMENTATION-MAP.md](../development/sprints/2026-10-06-sprint-91-learning-journey-first-class-implementation/IMPLEMENTATION-MAP.md)

**Live E2E (S91):** Learning Journey → supported commissions → ordinary constituent workflows → derived Complete status → deterministic learner ZIP (Journey Home + nested `cN/` packages) — **PASSED**. Architecture recorded in the Sprint 91 closure.

**Working principle:** Learning Journey designs the progression of learning experiences required to move a particular group of learners towards intended learning, within learning time and duration constraints. Outcomes describe where learners need to get to; the journey describes how learning should develop to get them there.

Foundations conclusions (see foundation document for Established / Working hypothesis / Open question):

- PRISM should derive appropriate intended learning where authoritative outcomes are not supplied; do not mandate outcomes as an elicitation field.
- Learning time and duration are distinct author-owned constraints; do not organise primarily by week/session/course abstractions.
- Source structure must not automatically become learning structure.
- Dynamic composition belongs between products; deterministic process belongs within first-class products.
- Every required learning element must ultimately be realisable through one or more learner-facing PRISM product outputs; unsupported commissions stay visible rather than becoming invisible non-product activity.
- Product-family note: Expository, Interactive, Situated Task (**implemented**, Sprint 92 / `situated_task`), Assessment Pack — see [PB-FA-015](#pb-fa-015--additional-first-class-learning-resource-pipelines). (Sprint 90 “Independent Task” was the discovery label for the Situated Task educational job.)

**Optional author-supplied meta-design:** An author may specify a higher-level pedagogical pattern (for example diagnostic → exposition → application → formative check; problem-first; case-centred; worked example → scaffolded practice → independent performance; or another sequence they define). PRISM should derive a sensible design when no pattern is supplied, and respect one when it is. Do not hard-code a single pedagogical sequence as the Learning Journey architecture.

Do not redesign Learning Journey architecture from this note. Foundations are closed under Sprint 90; first-class implementation and final learner package are closed under Sprint 91. Richer Course Home / programme assembly remains related to [PB-FA-016](#pb-fa-016--course-home--course-assembly).

**Continuity (Sprint 94):** Independently generated constituents must preserve essential shared context and know what earlier components asked learners to do. That work is [PB-FA-022](#pb-fa-022--learning-journey-continuity-contract) — **Complete**. It does not reopen Sprint 91.

**Unified runtime (Sprint 95):** Single-document Learning Journey delivery with container-scoped resource lifecycle and explicit artefact handoff. That work is [PB-FA-023](#pb-fa-023--unified-learning-journey-runtime) — **Complete**.

### PB-FA-022 — Learning Journey continuity contract

**Status:** **Complete — Sprint 94 CLOSED — ACCEPTED** ([SPRINT-94-CLOSURE.md](../development/sprints/2026-11-02-sprint-94-learning-journey-continuity/SPRINT-94-CLOSURE.md)). Do **not** reopen.

Make Learning Journey continuity a reliable commissioning contract so later independently generated components preserve essential shared scenario facts and understand what earlier components asked learners to do.

Constituents remain standalone. Sprint 94 intentionally excluded cross-component learner-response sharing and unified runtime (see [PB-FA-023](#pb-fa-023--unified-learning-journey-runtime)).

**Delivered:** required continuity surviving Design Page and product intake; preceding-activity descriptions; binding first-stage prompts; author inspectability; WP6 regression evidence.

**Out of scope (unchanged):** Interactive V2 ([PB-FA-019](#pb-fa-019--interactive-v2-educational-and-architectural-discovery)); home-page redesign; Assessment Pack calibration; Course Home; unified runtime.

### PB-FA-023 — Unified Learning Journey runtime

**Status:** **Complete — Sprint 95 CLOSED — ACCEPTED** ([SPRINT-95-CLOSURE.md](../development/sprints/2026-11-03-sprint-95-unified-learning-journey-runtime/SPRINT-95-CLOSURE.md)). Do **not** reopen.  
**Type:** Architectural foundations → bounded implementation.  
**Pack:** [Sprint 95](../development/sprints/2026-11-03-sprint-95-unified-learning-journey-runtime/SPRINT-95-START-HERE.md)

Establish foundations for a unified, accessible, single-document Learning Journey runtime: persistent navigation, one active mounted resource, container-scoped init/dispose, explicit learner-artefact produce/reference handoff — while preserving standalone publishing and (until superseded) multi-document Journey packages.

**Delivered:** M1 Assessment Pack lifecycle; M2 additive unified shell; M3 explicit artefact handoff; M4 wider compatibility (qualified); M5 author-facing **Download Unified Learning Journey** with automatic artefact proposal; live *Deciding Under Uncertainty* verified.

**Deferred items absorbed and largely delivered by Sprint 96 / [PB-FA-024](#pb-fa-024--unified-learning-journey-experience--compatibility)** (CLOSED — ACCEPTED). Residual a11y / maths VK / QA cross-journey debt remains on the Sprint 96 debt ledger — not a reopen of Sprint 95.

**Out of scope (unchanged):** iframes; server learner accounts; AI marking; new application framework; regenerating existing journeys; Interactive V2; Course Home.

### PB-FA-024 — Unified Learning Journey experience & compatibility

**Status:** **Complete — Sprint 96 CLOSED — ACCEPTED** ([SPRINT-96-CLOSURE.md](../development/sprints/2026-11-03-sprint-96-unified-learning-journey-experience/SPRINT-96-CLOSURE.md)). Do **not** reopen.

**Type:** Bounded implementation — experience polish + mathematics compatibility + publishing default gate.  
**Pack:** [Sprint 96](../development/sprints/2026-11-03-sprint-96-unified-learning-journey-experience/SPRINT-96-START-HERE.md)  
**Baseline:** `c5d93e85cb4bf1457f499ccac76763d75d272dad`

**Delivered:** Unified-only LJ download; navigation/layout; visual coherence; resource fidelity; contextual guidance (qualified); viewport-centred reading (qualified); mathematics packaging (qualified); M5 acceptance (qualified).

**Deferred (not reopen triggers):** comprehensive a11y / AT; MathLive VK residual; stored C5/C6 transfer-prose cleanup; QA v1.2 cross-journey validation — see Sprint 96 [ARCHITECTURAL-DEBT.md](../development/sprints/2026-11-03-sprint-96-unified-learning-journey-experience/ARCHITECTURAL-DEBT.md) and [SPRINT-96-CLOSURE.md](../development/sprints/2026-11-03-sprint-96-unified-learning-journey-experience/SPRINT-96-CLOSURE.md) next-phase priorities.

**Out of scope (unchanged):** regenerating journeys as part of S96; new frameworks; server learner storage; AI marking; Interactive V2; Course Home; accepting MathLive via textarea fallback alone.

### PB-FA-028 — Learning Journal (unified Learning Journeys)

**Status:** **Delivered — Sprint 97 CLOSED — ACCEPTED** (qualified; Level 3 pipeline journals deferred).  
**Type:** Bounded foundations — unified-shell Learning Journal.  
**Pack:** [Sprint 97 closure](../development/sprints/2026-11-12-sprint-97-learning-journal-and-design-pattern-foundations/SPRINT-97-CLOSURE.md)  
**Baseline:** `a8c2fd3b6e7dbeaa11bb418c71bf4eb472f150c5`

**Objective:** A permanent read-only **Your Learning Journal** destination in the unified Learning Journey TOC (beneath constituent resources). Ordered entries are designed by the Learning Journey pipeline; each entry has a learner-facing title, authored framing, and a reference to a declared constituent learner artefact. Entries populate from existing same-browser saved drafts. A notification count indicates new/updated entries since last view. Missing artefacts are represented truthfully.

**Pedagogical north star (S97-D04):** PRISM aims at better judgement, better capability, or both. The journal makes intended progression inspectable via learner-produced evidence; it must not claim improvement without evidence.

**Reuse / incremental:** Existing artefact contract, draft storage, and unified shell — no new persistence system. Journal iteration must not force full Learning Journey or unchanged-constituent regeneration (S97-D04 Levels 1–3). Journey data contracts (constituents, artefacts, references, journal) evolve additively and stay separable from shell presentation (S97-D05 compatibility principle).

**Non-goals:** Journal editing, branching, export, journal-specific assessment, AI interpretation, regenerating unchanged constituents for journal work, new caching/regeneration frameworks, conditional/adaptive pathways or rules engines in Sprint 97, changing standalone or carry-forward behaviour.

**Related:** Pattern catalogue [PB-FA-029](#pb-fa-029--pedagogical-design-pattern-catalogue). Assisted brief development remains [PB-FA-026](#pb-fa-026--assisted-brief-development-from-teaching-intention-to-learning-experience).

### PB-FA-029 — Pedagogical design-pattern catalogue

**Status:** **Open — carry forward** (Sprint 97 M4 deferred; catalogue not created).  
**Type:** Version-controlled catalogue foundations.  
**Pack:** [Sprint 97 closure](../development/sprints/2026-11-12-sprint-97-learning-journal-and-design-pattern-foundations/SPRINT-97-CLOSURE.md) (deferred from Sprint 97)

**Objective:** A central catalogue of Learning Journey pedagogical design patterns, starting with:

1. Progressive Evidence Disclosure — *The Decision That Went Wrong* / DUU.  
2. Draft, Judge, Revise — *Explaining Research: From First Draft to Better Judgement*.  
3. Ten provisional, pedagogically distinct candidate patterns.

Each pattern uses a standard specification (purpose, cognitive mechanism, sequence, artefacts, journal opportunities, constraints, examples). Demonstrators use a standard pack including commissioning fields, rationale, cognitive map, artefact/journal map, adaptation guidance, and a copyable Create Your Own LLM prompt. Pattern specs are informed by PRISM’s pedagogical north star (better judgement and/or capability; inspectable learner evidence — S97-D04).

**Non-goals:** Demonstrator website; in-product AI brief-development service (see [PB-FA-026](#pb-fa-026--assisted-brief-development-from-teaching-intention-to-learning-experience)).

**Related:** Learning Journal [PB-FA-028](#pb-fa-028--learning-journal-unified-learning-journeys).

### PB-FA-016 — Course Home / course assembly

Explore a learner-facing way to represent, and eventually publish, the whole journey an Outcomes Map designs — not only the individual PRISM resources inside it. This emerged from [PB-FA-014](#pb-fa-014--outcomes-map) experiments. Investigate it with Outcomes Map, not as an unrelated feature.

**Opportunity:** An Outcomes Map can describe more than a list of resources: title and purpose, intended outcomes, progression and dependencies, delivery groupings, ordered learner sequences, generated resources, selected source material, activities outside PRISM, workplace application, reflection, approximate workload, and how one part leads to the next. If PRISM only emits the separate resources, that larger design is lost or has to be rebuilt by hand.

**Working hypothesis, not architecture:** Outcomes Map is a design layer (the journey). First-class resources are a production layer (particular learner experiences). Course Home / course assembly is an assembly and delivery layer (the complete journey and the links among its parts). Do not treat Course Home as another first-class learning-resource product beside Expository, Interactive, and Assessment.

A possible authoring flow, not a prescribed build: course brief → Outcomes Map → course skeleton → generate the commissioned resources → those resources take the places already reserved for them → publish. The skeleton could exist before the resources do, with not-yet-generated positions. Generating from a position might later pass that commission into the existing first-class workflow, so the finished resource occupies its place without the author reconstructing the course.

**Product-discovery principle:** A new first-class product still has to be justified by a materially different design process, not merely by needing a place in the course. See [PB-FA-015](#pb-fa-015--additional-first-class-learning-resource-pipelines). **Sprint 90 commissioning invariant:** every required Learning Journey element must ultimately be realisable through one or more learner-facing PRISM product outputs; where the current family cannot realise an experience, keep it as an unsupported commission rather than making the learning invisible ([LEARNING-JOURNEY-FOUNDATIONS.md](../development/sprints/2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md)). That does not mean one element equals one product.

Emerging chain: Outcomes Map designs the journey → identifies the educational jobs → commissions first-class resources where appropriate → Course Home assembles the learner-facing journey → generated resources fill their commissioned positions.

Do not prescribe UI, storage, publishing, URLs, navigation, linking, tracking, LMS integration, authentication, persistence, or the exact representation of an Outcomes Map or of generating from a course position.

### PB-FA-017 — Assessment Pack first-class product revisit

**Status:** **Complete — Sprint 93 CLOSED — ACCEPTED** ([SPRINT-93-CLOSURE.md](../development/sprints/2026-10-07-sprint-93-assessment-pack-educational-contract/SPRINT-93-CLOSURE.md)). Do **not** reopen.

Revisit Assessment Pack using the evidence-led first-class product design method now established through Learning Journey and Sprint 92 ([PB-FA-015 discovery pattern](#learning-journey-as-a-product-discovery-mechanism)).

#### Motivation

The current Assessment Pack provides useful but limited functionality.

Rather than extending it feature-by-feature from its existing implementation, the future sprint should **re-elicit the educational requirements for assessment** using that product-discovery / design method.

Treat the existing Assessment Pack implementation as:

- evidence of current capability;
- a source of compatibility / migration constraints;
- implementation that may contain useful reusable components;

but **not** as the specification of what the mature first-class Assessment product must be.

Near-term calibration of the current pack remains [Assessment Pack real-use calibration](#assessment-pack-real-use-calibration-sprint-88-remainder) — a different, narrower concern.

#### Proposed discovery method

Use Learning Journey as an evidence-generating environment.

Design several materially different, authentic Learning Journeys in which assessment is genuinely required. Potential contexts (illustrative — **not** a predetermined Assessment taxonomy):

- undergraduate / module learning;
- workplace or professional learning;
- practical / performance-oriented learning;
- formative learning / checkpoint contexts.

Inspect what assessment experiences those journeys actually require. Use the evidence to determine discovery questions such as:

- What educational job is the assessment performing?
- What learner performance or evidence needs to be elicited?
- What makes that evidence interpretable?
- Who or what needs to interpret / judge it?
- What feedback relationship is required?
- What distinctions between formative and summative purposes matter to product design?
- Does assessment concern an artefact, judgement, performance, process, reflection, or combinations?
- What does the assessment need from preceding learning?
- What happens educationally after the assessment?

Do **not** answer these questions in this backlog item. They are discovery questions for the future sprint.

#### Product-design method

If the evidence justifies redesign, apply the same disciplined sequence:

Purpose → sibling-product boundary → learner / assessment contract → authoring / design responsibilities → product invariants → predetermined pipeline → structured artefact contract → implementation and integration.

#### Situated / Assessment boundary (existing principle to investigate further)

> Situated activity principally asks the learner to act because carrying out the activity develops learning.

> Assessment principally elicits performance / evidence so learner capability can be interpreted or judged.

A Learning Journey may legitimately require both, including sequences such as situated learning activity → consequential learning / record → subsequent Assessment performance.

The future Assessment Pack work should use such cases to sharpen requirements rather than collapsing authentic learning activity and assessment into one product. See also Sprint 92 Gate 2 ([S92-D03](../development/sprints/2026-10-07-sprint-92-situated-learning-activity-first-class-product/decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products)).

#### Scope posture

**Sprint 93** completed this revisit. Hard invariant: Assessment Pack remains **NON-SUMMATIVE**. Do **not** reopen Sprint 93 or Sprint 92. Near-term calibration of depth, count, and form-selection defaults remains the separate narrower item above.

#### Sprint 93 outcome

Accepted first-class Assessment Pack. Close: [S93-D12](../development/sprints/2026-10-07-sprint-93-assessment-pack-educational-contract/decisions.md#s93-d12--close-sprint-93--assessment-pack-accepted). Record: [SPRINT-93-CLOSURE.md](../development/sprints/2026-10-07-sprint-93-assessment-pack-educational-contract/SPRINT-93-CLOSURE.md).

### PB-S-006 — Institutional authentication (University of Nottingham)

Investigate the University's supported route for making PRISM available to authenticated University of Nottingham users.

**Working intent:** If you can authenticate with a UoN account, you can use PRISM.

The initial requirement is an institutional identity gate, not a PRISM allow-list, invitation system, approval process, role hierarchy, or administration system. The next step is to find the University's supported integration or application-registration route, not to infer a protocol or implement authentication speculatively.

Keep this item to authentication. Publishing, server-side user-owned persistence, and broader multi-user architecture are related later concerns and are not part of this item. Deployment packaging remains [PB-S-005](#pb-s-005--release--deployment-packaging).

### PB-FA-015 — Additional first-class learning-resource pipelines

One exploratory question: whether any further first-class Learning Design product is justified.

PRISM currently has four first-class learning-resource / composition products relevant to this item: Expository Resource (understanding through structured explanation), Interactive Resource (engagement with a designed/facilitated experience), Assessment Pack (interpretable evidence for judgement), and **Situated Task** (purposeful learner action in authentic/situated context — **implemented**, Sprint 92). Learning Journey composes progression across experiences. A later redesign of Interactive itself is [PB-FA-019](#pb-fa-019--interactive-v2-educational-and-architectural-discovery), not a new product row here.

**Working criterion:** A new first-class product should exist because achieving its educational purpose needs a materially different design process, not because the finished resource has a familiar format. Video, podcast, debate, reflection, comparison, quiz, or worked example may simply be ways of realising an existing product. Do not open a backlog row for every named format.

**Sprint 92 (COMPLETE / CLOSED):** [Situated Task First-Class Product](../development/sprints/2026-10-07-sprint-92-situated-learning-activity-first-class-product/SPRINT-92-CLOSURE.md) — product definition and implementation for the recurring situated-activity gap evidenced by post–S91 Learning Journey experiments. Final name **Situated Task** / `product_id` **`situated_task`** (`acceptsCommission: true`). Pipeline: Situation → Activity → Support → Learning Return → Design Page. Gate 8 live E2E **PASS**. Learning Journey can commission Situated Task via shared intake. See [S92-D09](../development/sprints/2026-10-07-sprint-92-situated-learning-activity-first-class-product/decisions.md#s92-d09--product-name-and-identity--situated-task) · [S92-D10](../development/sprints/2026-10-07-sprint-92-situated-learning-activity-first-class-product/decisions.md#s92-d10--close-sprint-92--situated-task-first-class-product-complete).

**Sprint 90 status/reference (historical):** Learning Journey commissioning established the same educational job under the working label **Independent Task**. Sprint 92 delivered that job under the final product name **Situated Task** — not a separate second product.

Candidates remaining (none of them agreed products; Situated Task is no longer a candidate):

- **Situated Task — IMPLEMENTED (Sprint 92).** Label **Situated Task** / `situated_task`. Delivers the Sprint 90 Independent Task educational job: purposeful learner-controlled activity in authentic/situated context with structured record and reconnection. Five-stage predetermined pipeline; LJ commissionable. Durable Record transport remains a separate backlog concern. The Assessment Pack revisit was completed in Sprint 93 (**CLOSED — ACCEPTED**).
- **Scenario Resource — candidate for experiment.** Purpose: develop judgement, interpretation, and decision-making through a situated, possibly unfolding context. The possible distinction from Interactive is that the central design object is the situation: what the learner can know, what they must decide or interpret, how the situation develops, what is disclosed when, and how debrief works. Relevant to professional judgement (management, clinical, ethics, law, policy, and similar). Experiment only.
- **Problem Resource — candidate to investigate.** Purpose: organise learning around understanding and resolving a substantive problem (interpretation, what must be learned, attempt, feedback, revision, resolution). The problem might be the architecture, not only an activity inside an Interactive Resource. Not a committed product.
- **Guided practice / worked example — hypothesis only, weaker than the other two.** A responsibility-fade sequence (model, explain, worked example, scaffolded attempt, fade support, independent performance, feedback) might be a distinct process, or it might already be an Interactive Resource, or Expository plus Interactive. First test: whether the existing workflows can design it convincingly.
- **Independent Task — historical Sprint 90 working label.** Superseded as the delivery name by **Situated Task** (Sprint 92). Retain only as historical discovery vocabulary; do not treat as a separate unimplemented product.

#### Learning Journey as a product-discovery mechanism

PRISM should preferentially discover new first-class educational products from **demonstrated learning-design demand** rather than from feature brainstorming or attempts to complete a predefined taxonomy.

Do not invent a catalogue of resource types in advance. The question remains which PRISM product has the design process appropriate to the educational job.

**Working discovery pattern:**

1. Design real Learning Journeys for materially different educational contexts.
2. Allow educationally justified experiences that existing first-class products cannot coherently produce to remain explicitly **unsupported**.
3. Treat unsupported commissions as **evidence** rather than automatically forcing them into the nearest existing product.
4. Look for recurring educational structure across unsupported commissions.
5. Determine whether those cases share a coherent educational purpose / centre of gravity that is genuinely distinct from existing products.
6. Derive learner requirements and authoring responsibilities from that evidence.
7. Only where the evidence supports a recurring production capability, design a new first-class product: purpose → sibling boundary → learner contract → authoring responsibilities → invariants → predetermined pipeline → structured artefact contract → implementation.
8. Once implemented, the new product expands the capabilities that future Learning Journeys can commission.

**Feedback loop:**

> Learning Journey discovers educational demand; recurring educational demand can justify new first-class products; new first-class products increase what future Learning Journeys can commission.

**Unsupported commissions as discovery evidence:**

> Unsupported is not necessarily a defect. It can be product-discovery evidence.

A single unsupported commission is weak evidence for a new product. Repeated structurally similar requirements across materially different Learning Journeys provide stronger evidence that PRISM may lack a coherent educational production capability.

**Guard against product proliferation:**

> “Can we imagine a use for this product?” is not sufficient justification for making it first-class. Stronger evidence comes from real Learning Journey designs repeatedly requiring an educational capability that existing products cannot coherently satisfy.

**Illustrative example (not a closed taxonomy):** Post–Sprint 91 Learning Journey experiments independently required situated investigation, evidence gathering and conducting a bounded test (undergraduate Product Ways of Working), and conducting a workplace enquiry (workplace CPD Product Judgement). The recurring pattern was analysed before defining a candidate first-class product (Sprint 92 design work). Those examples must not harden into a permanent subtype catalogue.

**Architectural distinction:**

- Learning Journey does **not** dynamically invent product architecture at runtime.
- It exposes educational requirements through its design work.
- Product discovery is a **human / product-development** activity informed by that evidence.
- Once a capability becomes first-class, its production pipeline remains **predetermined** as part of the product definition (S89-D02).

Unsupported commissions should remain visible rather than becoming invisible non-product activity; every required learning element must ultimately be realisable through one or more learner-facing PRISM product outputs (not necessarily 1:1).

No workflow stages, UI options, product-selector entries, or generic product registry follow from this note alone. Existing Expository, Interactive, Assessment Pack, and Learning Journey architecture stays as it is unless a later sprint explicitly changes them.

---

## 6. Retired / superseded (planning authority only)

These IDs are **no longer live planning items**. Historical detail remains in prior backlog revisions, sprint packs, and governance records.

| Former ID | Disposition |
| --------- | ----------- |
| **PB-FA-001** | **Retired** — Workflow Resources core closed in Sprint 73; no standing FA theme |
| **PB-FA-003** | **Retired** — pipeline integrity not permanently open work; handle evidenced defects from alpha use |
| **PB-FA-004** | **Retired** — manually uploaded graphics; current graphics authoring sufficient |
| **PB-FA-005** | **Retired** — old Settings/parameterisation problem; Sprint 80 Adjustments answered the architectural question |
| **PB-FA-006** | **Retired** — QA/refinement productisation; operating QA is Part 1 Benchmark + Part 2 Validation as custom ChatGPT workflow |
| **PB-FA-007** | **Retired** — user-controlled storage management; workflow deletion is sufficient practical control |
| **PB-FA-008** | **Superseded** — Slideshow-as-architecture-test; Presentation remains a lightweight idea only (§3) |
| **PB-FA-009** | **Merged** into PB-FA-011 Research Synthesis relationship question |
| **PB-S-001…PB-S-004** | **Retired** from canonical planning (historical suite/UX notes; not current “what next” items) |
| **PB-R-001** | **Retired** from canonical planning (conversation-attachment store) |
| **PB-R-002** | **Absorbed** into PB-FA-002 discovery when planned |
| **PB-R-003** | **Retired** — raise-the-ceiling measurement; addressed operationally by Benchmark Part 1 + Validation Part 2 |
| **PB-R-004** | **Merged** into Expository Resource richness (PB-FA-011); not a distinct page-type programme |
| **PB-R-005** | **Retired** — progressive-disclosure elicitation; no concrete current product problem stated |
| **PB-R-006** | **Retired** from canonical planning |
| **PB-R-007** | **Retired** — Benchmark/Validation instrument homes; custom workflow is accepted operating architecture |
| **PB-R-008** | **Retired** from canonical planning (orphan Workflow Resources cleanup) |
| **PB-R-009** | **Retired** — per-run configuration/profile; Adjustments substantially answered the need |
| **PB-R-010** | **Retired** — QA feedback destination; with PB-FA-006 |

**Not promoted into this backlog:** Sprint 81 debt (S81-D-001…007), RC3–RC8 (D-014 residue), Group F tooling, and older governance D-IDs remain in their historical ledgers unless alpha use produces a concrete new requirement.

---

## Related

- Programme pointer: [docs/sprints/NEXT-SPRINT.md](../sprints/NEXT-SPRINT.md)  
- Alpha close: [SPRINT-82-CLOSURE.md](../development/sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/SPRINT-82-CLOSURE.md) · [S82-D04](../development/sprints/2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete)  
- Legacy notes (non-planning): [ideas.md](ideas.md) · [known-issues.md](known-issues.md) · [future-directions.md](future-directions.md)  

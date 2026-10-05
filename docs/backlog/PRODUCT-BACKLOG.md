# PRISM Product Backlog

**Canonical location:** `docs/backlog/PRODUCT-BACKLOG.md`  
**Status:** Active — **alpha-use period** (Alpha development complete, 2026-09-02)  
**Last updated:** 2026-10-05 (Sprint 90 closed — Learning Journey Foundations)  
**Active sprint:** none. Last closed: [Sprint 90 — Learning Journey Foundations](../development/sprints/2026-10-05-sprint-90-learning-journey-foundations/SPRINT-90-CLOSURE.md) — **COMPLETE / CLOSED** (discovery / prototyping; not implementation)

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

Sprint 82 delivered first-class MathLive entry + MathJax display for dedicated maths fields. These remain optional post-alpha follow-ons.

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

**Working principle:** Learning Journey designs the progression of learning experiences required to move a particular group of learners towards intended learning, within learning time and duration constraints. Outcomes describe where learners need to get to; the journey describes how learning should develop to get them there.

Foundations conclusions (see foundation document for Established / Working hypothesis / Open question):

- PRISM should derive appropriate intended learning where authoritative outcomes are not supplied; do not mandate outcomes as an elicitation field.
- Learning time and duration are distinct author-owned constraints; do not organise primarily by week/session/course abstractions.
- Source structure must not automatically become learning structure.
- Dynamic composition belongs between products; deterministic process belongs within first-class products.
- Every required learning element must ultimately be realisable through one or more learner-facing PRISM product outputs; unsupported commissions stay visible rather than becoming invisible non-product activity.
- Provisional product-family hypothesis from Sprint 90 discovery: Expository, Interactive, Independent Task (candidate), Assessment Pack — see [PB-FA-015](#pb-fa-015--additional-first-class-learning-resource-pipelines).

**Optional author-supplied meta-design:** An author may specify a higher-level pedagogical pattern (for example diagnostic → exposition → application → formative check; problem-first; case-centred; worked example → scaffolded practice → independent performance; or another sequence they define). PRISM should derive a sensible design when no pattern is supplied, and respect one when it is. Do not hard-code a single pedagogical sequence as the Learning Journey architecture.

Do not implement Learning Journey or Outcomes Map from this note alone. Sprint 90 closed foundations only; production implementation requires a new explicit sprint. How the designed journey would be assembled for the learner remains related to [PB-FA-016](#pb-fa-016--course-home--course-assembly).

### PB-FA-016 — Course Home / course assembly

Explore a learner-facing way to represent, and eventually publish, the whole journey an Outcomes Map designs — not only the individual PRISM resources inside it. This emerged from [PB-FA-014](#pb-fa-014--outcomes-map) experiments. Investigate it with Outcomes Map, not as an unrelated feature.

**Opportunity:** An Outcomes Map can describe more than a list of resources: title and purpose, intended outcomes, progression and dependencies, delivery groupings, ordered learner sequences, generated resources, selected source material, activities outside PRISM, workplace application, reflection, approximate workload, and how one part leads to the next. If PRISM only emits the separate resources, that larger design is lost or has to be rebuilt by hand.

**Working hypothesis, not architecture:** Outcomes Map is a design layer (the journey). First-class resources are a production layer (particular learner experiences). Course Home / course assembly is an assembly and delivery layer (the complete journey and the links among its parts). Do not treat Course Home as another first-class learning-resource product beside Expository, Interactive, and Assessment.

A possible authoring flow, not a prescribed build: course brief → Outcomes Map → course skeleton → generate the commissioned resources → those resources take the places already reserved for them → publish. The skeleton could exist before the resources do, with not-yet-generated positions. Generating from a position might later pass that commission into the existing first-class workflow, so the finished resource occupies its place without the author reconstructing the course.

**Product-discovery principle:** A new first-class product still has to be justified by a materially different design process, not merely by needing a place in the course. See [PB-FA-015](#pb-fa-015--additional-first-class-learning-resource-pipelines). **Sprint 90 commissioning invariant:** every required Learning Journey element must ultimately be realisable through one or more learner-facing PRISM product outputs; where the current family cannot realise an experience, keep it as an unsupported commission rather than making the learning invisible ([LEARNING-JOURNEY-FOUNDATIONS.md](../development/sprints/2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md)). That does not mean one element equals one product.

Emerging chain: Outcomes Map designs the journey → identifies the educational jobs → commissions first-class resources where appropriate → Course Home assembles the learner-facing journey → generated resources fill their commissioned positions.

Do not prescribe UI, storage, publishing, URLs, navigation, linking, tracking, LMS integration, authentication, persistence, or the exact representation of an Outcomes Map or of generating from a course position.

### PB-S-006 — Institutional authentication (University of Nottingham)

Investigate the University's supported route for making PRISM available to authenticated University of Nottingham users.

**Working intent:** If you can authenticate with a UoN account, you can use PRISM.

The initial requirement is an institutional identity gate, not a PRISM allow-list, invitation system, approval process, role hierarchy, or administration system. The next step is to find the University's supported integration or application-registration route, not to infer a protocol or implement authentication speculatively.

Keep this item to authentication. Publishing, server-side user-owned persistence, and broader multi-user architecture are related later concerns and are not part of this item. Deployment packaging remains [PB-S-005](#pb-s-005--release--deployment-packaging).

### PB-FA-015 — Additional first-class learning-resource pipelines

One exploratory question: whether any further first-class Learning Design product is justified.

PRISM currently has three: Expository Resource (understanding through structured explanation), Interactive Resource (purposeful learner action), and Assessment Pack (interpretable evidence of what a learner knows or can do, with formative feedback).

**Working criterion:** A new first-class product should exist because achieving its educational purpose needs a materially different design process, not because the finished resource has a familiar format. Video, podcast, debate, reflection, comparison, quiz, or worked example may simply be ways of realising an existing product. Do not open a backlog row for every named format.

**Sprint 90 status/reference:** Learning Journey commissioning experiments identified **Independent Task** as the strongest current additional first-class product candidate (purposeful learner-controlled activity with a structured record; grammar brief → activity → record → reconnect). Independent academic study and situated professional application were treated as variants of the same product-level job. See [LEARNING-JOURNEY-FOUNDATIONS.md](../development/sprints/2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md). This is discovery evidence, not an implementation commitment and not a permanently closed taxonomy.

Candidates to retain, none of them agreed products:

- **Independent Task — strongest current candidate (Sprint 90).** Purpose: frame purposeful learner activity undertaken substantially outside the product itself, and provide a structured place to record resulting thinking, findings, observations, or conclusions. Supersedes the earlier “Situated Task” label as the primary name for this job while retaining the same underlying concern. Not implemented.
- **Scenario Resource — candidate for experiment.** Purpose: develop judgement, interpretation, and decision-making through a situated, possibly unfolding context. The possible distinction from Interactive is that the central design object is the situation: what the learner can know, what they must decide or interpret, how the situation develops, what is disclosed when, and how debrief works. Relevant to professional judgement (management, clinical, ethics, law, policy, and similar). Experiment only.
- **Problem Resource — candidate to investigate.** Purpose: organise learning around understanding and resolving a substantive problem (interpretation, what must be learned, attempt, feedback, revision, resolution). The problem might be the architecture, not only an activity inside an Interactive Resource. Not a committed product.
- **Guided practice / worked example — hypothesis only, weaker than the other two.** A responsibility-fade sequence (model, explain, worked example, scaffolded attempt, fade support, independent performance, feedback) might be a distinct process, or it might already be an Interactive Resource, or Expository plus Interactive. First test: whether the existing workflows can design it convincingly.
- **Situated Task — earlier label; see Independent Task above.** Historical Outcomes Map language for authentic external action with deliberate design and capture. Sprint 90 reframes this under Independent Task rather than as a separate product from independent study commissions.

**Discovery principle:** Do not invent a catalogue of resource types in advance. If Learning Journey / Outcomes Map work repeatedly finds educational jobs that Expository, Interactive, and Assessment represent awkwardly, that is evidence to investigate another pipeline. The question is which PRISM product has the design process appropriate to the job. Unsupported commissions should remain visible rather than becoming invisible non-product activity; every required learning element must ultimately be realisable through one or more learner-facing PRISM product outputs (not necessarily 1:1).

No workflow stages, UI options, product-selector entries, or generic product registry follow from this note. Existing Expository, Interactive, and Assessment architecture stays as it is unless a later sprint explicitly changes them.

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

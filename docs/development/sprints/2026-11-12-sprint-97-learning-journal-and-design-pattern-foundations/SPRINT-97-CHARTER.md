# Sprint 97 — Charter

**Sprint:** 97 — Learning Journal and Design Pattern Foundations  
**Status:** **OPEN**  
**Opened:** 2026-11-12  
**Type:** Bounded foundations — unified-shell capability + documentation catalogue  
**Predecessor:** [Sprint 96 — CLOSED — ACCEPTED](../2026-11-03-sprint-96-unified-learning-journey-experience/SPRINT-96-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-028](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-028--learning-journal-unified-learning-journeys) · [PB-FA-029](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-029--pedagogical-design-pattern-catalogue)  
**Opening:** [S97-D01](decisions.md#s97-d01--open-sprint-97--learning-journal-and-design-pattern-foundations)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Start here:** [SPRINT-97-START-HERE.md](SPRINT-97-START-HERE.md)  
**Baseline:** `a8c2fd3b6e7dbeaa11bb418c71bf4eb472f150c5`

---

## Mission

Introduce a reusable **Learning Journal** destination for unified Learning Journeys, and establish a central, version-controlled **pedagogical design-pattern catalogue** that documents established and provisional Learning Journey patterns — including demonstrator specifications that help academics develop PRISM-ready briefs.

---

## Programme context

Sprints 90–96 established Learning Journey as a first-class composition product, continuity commissioning, unified single-document delivery, explicit artefact produce/reference contracts, and unified publishing as the author download default.

What remains missing for sector demonstration and academic adoption:

1. A journey-level place where learners can **revisit their own saved work** with authored pedagogical framing (without inventing a new persistence layer).  
2. A durable catalogue of **pedagogical design patterns** that Learning Journeys can instantiate, so underspecified teaching intentions can become compelling commissions.

This sprint delivers those foundations. It does **not** reopen educational QA of the two reference journeys, regenerate their constituents, or build an AI brief-development product (related backlog: [PB-FA-026](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-026--assisted-brief-development-from-teaching-intention-to-learning-experience)).

---

## Workstreams

### A — Learning Journal

- Permanent **LEARNING JOURNAL / Your Learning Journal** TOC destination beneath constituent resources in the unified shell (order locked: Overview → resources → journal — [S97-D03](decisions.md#s97-d03--resolve-q1q7-and-lock-m1-contract)).  
- Spec at `page.learning_journey.journal` (`enabled`, `title`, ordered `entries[]`).  
- Read-only throughout the journey.  
- Ordered entries designed by the Learning Journey **Design Page** commissioning pipeline (M3 mandatory; M2 fixtures for runtime proof only).  
- Each entry: learner-facing title, pipeline-authored narrative framing, reference to a **declared producer** artefact (may be unconsumed by later resources).  
- Progressive population from existing saved drafts (same-browser/device guarantees).  
- Notifications use learner-visible **content fingerprints**; acknowledgement is journey-scoped and separate from constituent drafts.  
- Truthful missing/unavailable representation; no undeclared workspace exposure.  
- Existing artefact carry-forward and standalone behaviour unchanged.

Reflection remains the responsibility of constituent resources (e.g. Assessment Packs). The journal may display the resulting artefact; it does not host journal-specific assessment, editing, branching, export, or AI interpretation. Framing describes intended progression — it must not claim unverifiable cognitive improvements.

### B — Design Pattern Catalogue

Version-controlled catalogue at **`docs/design-patterns/`** containing:

1. **Progressive Evidence Disclosure** — *The Decision That Went Wrong* (*Deciding Under Uncertainty*).  
2. **Draft, Judge, Revise** — *Explaining Research: From First Draft to Better Judgement*.  
3. Ten provisional, pedagogically distinct candidate patterns — **not** claimed technically validated or demonstrated until their demonstrators develop.  
4. Standard pattern specification fields and standard demonstrator specification fields (including a copyable **Create Your Own** LLM conversation prompt).  
5. Demonstrators reuse actual PRISM commissioning briefs / form fields where available; do not invent missing historical values.

Document the intended capability. Do **not** build a demonstrator website or AI brief-development service in this sprint (PB-FA-026 remains separate).

---

## Pedagogical north star

**PRISM's pedagogical north star is the development of better judgement, better capability, or both.**

These are complementary dimensions of learning, not mutually exclusive product categories. Learning Journey design should identify the intended development in judgement and/or capability, select an appropriate cognitive sequence, and identify learner-produced evidence that can make the process visible.

The Learning Journal is one mechanism for making that progression inspectable. It must not claim that improvement has occurred without evidence.

Recorded under [S97-D04](decisions.md#s97-d04--incremental-journal-development--pedagogical-north-star). Informs M3 commissioning guidance and M4 design-pattern specifications; does not expand journal runtime scope.

---

## Architectural principles

1. Extend Sprint 95/96 unified shell and artefact contracts additively.  
2. Journal entries reference **declared producer** artefacts only (including those with no later consumer); do not invent carry-forward or expose undeclared drafts.  
3. Reuse existing draft storage, `resolveArtefactReference`, and commission/artefact identity conventions (e.g. `c1.E1`-style produce ids).  
4. Standalone resource publishing remains fully supported and regression-locked.  
5. No new learner-work persistence system; journal acknowledgement storage is separate from constituent drafts; no server learner accounts.  
6. No AI marking, journal editing, branching, or journal export.  
7. **Incremental journal development** — changing journal specification, framing, or presentation must not regenerate unchanged constituent resources or force a full Learning Journey rebuild ([S97-D04](decisions.md#s97-d04--incremental-journal-development--pedagogical-north-star)).  
8. Catalogue is documentation-first at `docs/design-patterns/`; PB-FA-026 assisted brief service is out of scope.  
9. Safe rendering of titles, framing, and learner content; journal remains read-only.  
10. No new caching system or regeneration framework for journal iteration.  
11. **Journey-level data-model extensibility** — Sprint 97 extends a reusable model connecting constituents, declared artefacts, references, and journal entries; keep data contracts separate from unified-shell presentation; use stable identities, explicit relationships, and additive backward-compatible schema evolution so future pedagogical behaviours could consume declared journey state without fundamental redesign ([S97-D05](decisions.md#s97-d05--learning-journey-data-model-extensibility-compatibility-principle)). This is a compatibility principle only — **not** authorisation for conditional logic, branching, a rules engine, or extra learner-state infrastructure in Sprint 97. Avoid speculative abstractions; extend existing contracts only as required by the Learning Journal.

---

## Scope (milestones)

| ID | Title |
| -- | ----- |
| M1 | Sprint setup, documentation and architectural baseline |
| M2 | Journal runtime, TOC and notifications |
| M3 | Journal specification and LJ commissioning pipeline integration |
| M4 | Central design-pattern catalogue and demonstrator specification |
| M5 | Integration testing with both reference journeys, regression verification and sprint closure |

Milestone structure matches the proposed plan. No structural change was required by protocol; acceptance criteria are recorded in [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md).

---

## Stopping condition

Sprint 97 may close when:

- M2–M3 deliver a working journal in the unified shell for journeys that declare a journal specification, including **Design Page–commissioned** journal specs (fixtures alone are insufficient);  
- journeys without an enabled journal specification remain compatible;  
- M4 delivers the catalogue at `docs/design-patterns/` with both established patterns fully specified and ten provisional candidates listed (provisionals unmarked as validated);  
- M5 demonstrates journey-level pipeline journal generation from original LJ briefs for both patterns, with incremental unified reassembly reusing constituents; regressions remain green; closure recorded;  
- non-goals remain intact.

---

## Explicit non-goals

- New persistence architecture; cloud sync; learner accounts.  
- Journal editing, branching, export, or journal-specific assessment.  
- AI interpretation of journal entries; AI marking.  
- Regenerating unchanged DUU / Explaining Research constituents, or reopening their educational QA, merely to develop or revise the journal.  
- Full Learning Journey regeneration as a precondition for journal iteration.  
- New caching / regeneration frameworks for journal work.  
- Conditional logic, branching, adaptive pathways, rules engines, or additional learner-state infrastructure in Sprint 97 (compatibility only — [S97-D05](decisions.md#s97-d05--learning-journey-data-model-extensibility-compatibility-principle)).  
- Speculative data-model abstractions beyond what the Learning Journal requires.  
- Building a demonstrator website or assisted brief-development service (PB-FA-026 remains separate).  
- Interactive V2, Course Home, or new first-class products.  
- Reopening Sprint 94–96 closed architecture except by additive extension.

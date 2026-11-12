# Sprint 97 — Decisions

## S97-D01 — Open Sprint 97 — Learning Journal and Design Pattern Foundations

**Date:** 2026-11-12  
**Status:** Accepted  
**Depends on:** [Sprint 96 CLOSED — ACCEPTED](../2026-11-03-sprint-96-unified-learning-journey-experience/SPRINT-96-CLOSURE.md) (S96-D20)  
**Baseline commit:** `a8c2fd3b6e7dbeaa11bb418c71bf4eb472f150c5`  
**Numbering authority:** [docs/sprints/NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md) (no open sprint; last closed = 96 → allocate **97**)

**Decision:** Open **Sprint 97 — Learning Journal and Design Pattern Foundations** as a bounded foundations sprint with two workstreams: (A) Learning Journal for unified Learning Journeys; (B) central pedagogical design-pattern catalogue.

**Objective:** Deliver a reusable read-only Learning Journal destination that progressively surfaces declared learner artefacts with authored framing, plus a version-controlled catalogue of established and provisional Learning Journey design patterns with demonstrator specifications.

**Authoritative basis:**

- Sprint 96 closure: unified experience accepted; artefact contracts and same-browser draft persistence remain the handoff substrate.  
- Product need: journey-level revisit of learner work without new persistence; academic-facing pattern catalogue without building an AI brief service.  
- Reference journeys (DUU; Explaining Research) already embody the two established patterns and will be used as journal/catalogue fixtures only.

**Not authorised by opening alone:**

- journal runtime or shell implementation (await M1 acceptance + M2 authorisation);  
- Design Page prompt changes;  
- regenerating DUU or Explaining Research constituents;  
- new learner persistence, AI marking, journal editing/export/branching;  
- demonstrator website or in-product assisted brief development (PB-FA-026);  
- reopening Sprint 94–96;  
- Git operations without separate authorisation.

**First deliverable:** Documentation pack + [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) + [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md).

**Predecessor:** Sprint 96 remains **CLOSED — ACCEPTED**. Do not reopen.

---

## S97-D02 — Accept M1 architectural baseline (investigation)

**Date:** 2026-11-12  
**Status:** Accepted (documentation)  
**Depends on:** [S97-D01](#s97-d01--open-sprint-97--learning-journal-and-design-pattern-foundations)

**Decision:** Accept **M1 — Sprint setup, documentation and architectural baseline** as complete for investigation and planning purposes.

**Delivered:** Portable pack, programme stub, NEXT-SPRINT update, backlog entries PB-FA-028/029, architectural baseline in INITIAL-INVESTIGATION, milestone map with acceptance criteria and targeted tests.

**Amended:** Programme review on 2026-11-12 accepted M1 subject to documentation amendments and [S97-D03](#s97-d03--resolve-q1q7-and-lock-m1-contract). Schema and milestone criteria are locked by S97-D03; M2 implementation remains unauthorised until explicitly approved.

---

## S97-D03 — Resolve Q1–Q7 and lock M1 contract

**Date:** 2026-11-12  
**Status:** Accepted  
**Depends on:** [S97-D02](#s97-d02--accept-m1-architectural-baseline-investigation)

**Decision:** Record programme answers to M1 open questions Q1–Q7 and lock the corresponding contracts for M2–M5 planning. Amend M3/M4/M5 acceptance criteria, artefact eligibility, and minor runtime requirements as stated below. **M2 implementation is still not authorised** by this decision alone.

### Q1 — Journal specification location

**Accepted:** Journal specifications live at `page.learning_journey.journal` with:

- `enabled` (boolean)  
- `title` (learner-facing TOC / heading)  
- ordered `entries[]`, each with entry identity, learner-facing title, authored framing, and a reference to a **declared** producer artefact (`artefact_id`)

Synthetic `commissions[]` product rows for the journal remain rejected.

### Q2 — TOC order

**Accepted:** Overview (where present) → constituent resources → Learning Journal.

### Q3 — Journeys without an enabled journal

**Accepted:** Retain existing Sprint 96 behaviour; **no** journal TOC destination when the journal is absent or not enabled.

### Q4 — Notifications

**Accepted:**

- Fingerprints are of **resolved learner-visible artefact content**, not `savedAt` alone.  
- Missing→populated transitions and **substantive content changes** count as new/updated.  
- Repeated saves of **unchanged** content must **not** generate notifications.  
- Opening the journal acknowledges the **currently displayed** state.  
- Acknowledgement state is **journey-scoped** and stored separately from constituent draft storage.  
- Counts are exposed accessibly.

### Q5 — Fixture runtime vs Design Page commissioning

**Accepted:**

- **M2** may use hand-authored fixture journal JSON to prove runtime behaviour.  
- **M3** must implement normal Learning Journey Design Page commissioning of journal specifications.  
- Fixture-only commissioning is **not** sufficient for sprint acceptance.

### Q6 — Catalogue path

**Accepted:** Durable catalogue location is `docs/design-patterns/`.

### Q7 — Catalogue vs PB-FA-026

**Accepted:** Catalogue and copyable offline Create Your Own prompts are in scope. Assisted brief-development service ([PB-FA-026](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-026--assisted-brief-development-from-teaching-intention-to-learning-experience)) remains out of scope.

### Artefact eligibility (locked)

- Journal entries may reference **any valid, declared producer artefact**, even if no later constituent resource consumes it.  
- They must **not** reference undeclared workspaces or expose arbitrary saved draft fields.  
- Reuse the existing artefact contract and resolution machinery; do not introduce a parallel learner-work system.

### Pipeline honesty (locked)

The design pipeline must not claim actual cognitive changes or improvements that cannot be established from learner work. Framing describes intended cognitive progression / pedagogical purpose, not unverifiable claims about what the learner has achieved.

### Minor runtime requirements (locked)

- Render journal titles, framing, and saved learner content safely.  
- Maintain same-browser/device persistence guarantees for artefact population.  
- Keep journal notification acknowledgement separate from constituent draft storage.  
- Journal remains read-only; no new persistence system for learner work.

### Milestone amendments under this decision

- **M3** — End-to-end Design Page commissioning of journal specs is mandatory (select meaningful declared producer artefacts; write pedagogical framing; preserve references through normalisation and assembly; produce an ordered journal the shell can render). Fixtures must not substitute for this capability.  
- **M4** — Two established patterns + ten provisional candidates; provisionals are **not** claimed technically validated or demonstrated until their demonstrators develop; reuse actual PRISM commissioning briefs/form fields where available; do not invent missing historical field values.  
- **M5** — Both established Learning Journeys must be **rerun from their original Learning Journey briefs** through the updated design pipeline, producing **fresh pipeline-authored** journal specifications; verify meaningful artefacts and pedagogically appropriate narration for Progressive Evidence Disclosure and Draft, Judge, Revise; existing constituents may be reused where compatible; distinguish runtime fixture tests from successful end-to-end pipeline generation.

**Authoritative criteria text:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) (M5 wording further clarified by [S97-D04](#s97-d04--incremental-journal-development--pedagogical-north-star)).

**Not authorised:** M2 (or later) production implementation; Git operations without separate authorisation.

---

## S97-D04 — Incremental journal development + pedagogical north star

**Date:** 2026-11-12  
**Status:** Accepted  
**Depends on:** [S97-D03](#s97-d03--resolve-q1q7-and-lock-m1-contract)

**Decision:** Journal development must **not** require regenerating an entire Learning Journey. The Learning Journal is a journey-level capability that consumes existing declared learner artefacts. Changes to journal specification, pedagogical framing, or presentation must not trigger regeneration of unchanged constituent learning resources.

### Three-level development and testing workflow

| Level | Milestone | Intent |
| ----- | --------- | ------ |
| **1 — Runtime testing** | M2 | Hand-authored journal specs + existing artefact contracts + saved-draft fixtures. Test rendering, TOC, population, missing work, and notifications **independently** of the commissioning pipeline. |
| **2 — Journal commissioning** | M3 | Generate or revise journal specs through normal Learning Journey Design Page process. Reuse existing LJ design information and declared constituent artefacts. **Do not** regenerate constituents merely to revise journal entries or narration. |
| **3 — Integration testing** | M5 | Verify **pipeline-authored** journals for both established reference journeys and unified package assembly. Reuse existing constituent outputs and artefact contracts wherever compatible. Reassemble the unified Learning Journey with the revised journal specification **without** repeating constituent commissioning, content generation, or educational QA. |

### M5 clarification (supersedes ambiguous “rerun” wording)

M5 must demonstrate that the updated Learning Journey design pipeline can generate journal specifications **from the original Learning Journey briefs** for both established patterns (Progressive Evidence Disclosure; Draft, Judge, Revise).

This requires a fresh **journey-level design / journal generation step**, **not** regeneration of all constituent resources.

Where existing assembly APIs already support reuse of constituent outputs, use them. If a genuine limitation prevents incremental reassembly, document the limitation and propose the **smallest** correction before implementing a new mechanism. Do **not** introduce a new caching system, regeneration framework, or unrelated architecture.

### Pedagogical north star (programme-facing; does not expand runtime scope)

**PRISM's pedagogical north star is the development of better judgement, better capability, or both.**

These are complementary dimensions of learning, not mutually exclusive product categories. Learning Journey design should identify the intended development in judgement and/or capability, select an appropriate cognitive sequence, and identify learner-produced evidence that can make the process visible.

The Learning Journal is one mechanism for making that progression inspectable. It must **not** claim that improvement has occurred without evidence.

This principle informs **M3 commissioning guidance** and **M4 design-pattern specifications**. It does not add journal runtime features.

### Preserved

All contracts under [S97-D03](#s97-d03--resolve-q1q7-and-lock-m1-contract) remain in force (schema, TOC, notifications, artefact eligibility, fixture vs pipeline distinction, catalogue path, PB-FA-026 boundary).

**Not authorised:** M2 (or later) production implementation; Git operations without separate authorisation.

---

## S97-D05 — Learning Journey data-model extensibility (compatibility principle)

**Date:** 2026-11-12  
**Status:** Accepted  
**Depends on:** [S97-D03](#s97-d03--resolve-q1q7-and-lock-m1-contract), [S97-D04](#s97-d04--incremental-journal-development--pedagogical-north-star)

**Decision:** Sprint 97 extends a **reusable, journey-level data model** that connects:

- constituent resources;  
- declared learner artefacts (`produces`);  
- cross-resource references (`references`);  
- journal entries (`learning_journey.journal.entries[]`).

### Compatibility principles

1. **Separate data contracts from presentation** — Underlying journey/artefact/journal contracts must remain usable independently of their current unified-shell TOC and journal UI. Shell presentation may change without requiring a new data model.  
2. **Stable identities** — Prefer durable ids for commissions, artefacts, and journal entries (e.g. `commission_id`, `artefactId`, `entry_id`) so later behaviours can address the same declared state.  
3. **Explicit relationships** — Relationships among resources, artefacts, references, and journal entries remain declared and inspectable; do not invent implicit coupling.  
4. **Additive, backward-compatible schema evolution** — Extend existing contracts only as required by the Learning Journal. Journeys and packages without journal fields must continue to work. Prefer additive fields/objects over breaking renames.  
5. **Future pedagogical behaviours** — Conditional logic, adaptive pathways, and richer feedback may later consume this declared journey state **without fundamental redesign**. That possibility is a compatibility goal only.

### Explicitly not authorised by this decision

- Conditional logic, branching, or adaptive pathways in Sprint 97.  
- A rules engine.  
- Additional learner-state infrastructure beyond existing draft storage and journal acknowledgement.  
- Speculative abstractions or parallel data models “for the future”.

**Implementation discipline:** Extend existing Learning Journey / artefact contracts only as required to deliver the Learning Journal (S97-D03 schema and eligibility). Do not pre-build unused extension points.

**Preserved:** S97-D03 and S97-D04 in full.

**Not authorised:** M2 (or later) production implementation; Git operations without separate authorisation.

---

## Resolved questions (archive)

Q1–Q7 from the M1 investigation are **resolved** by [S97-D03](#s97-d03--resolve-q1q7-and-lock-m1-contract). No open M1 product/architecture questions remain for those items.

Incremental development / M5 “rerun” ambiguity is **resolved** by [S97-D04](#s97-d04--incremental-journal-development--pedagogical-north-star).

Data-model extensibility as a compatibility principle (not Sprint 97 feature scope) is **recorded** by [S97-D05](#s97-d05--learning-journey-data-model-extensibility-compatibility-principle).

## S97-D06 — Accept M2–M3 Learning Journal foundations (qualified)

**Date:** 2026-11-12  
**Status:** **Accepted** (qualified)  
**Depends on:** S97-D03, S97-D04, S97-D05

**Decision:** Accept Sprint 97 **M2** (journal runtime / TOC / notifications) and **M3** (Design Page journal commissioning + journal-only producer declaration), with qualifications. Supporting presentation and LJ authoring hardening in the same tree (journal reading-column / metadata presentation; delivery-context retention guidance; caption/framework terminology guards; coalesced workflow-list status hydrate) are accepted as part of this close.

**Qualifications:**

1. **M4** design-pattern catalogue (`docs/design-patterns/`) was **not** delivered.  
2. **M5 Level 3** journey-level pipeline journal generation from original LJ briefs for both established patterns was **not** executed as integration evidence.  
3. Fixture Level 1 evidence and Design Page Level 2 tests must not be described as Level 3 pipeline proof.

**Not authorised by this acceptance alone:** Sprint 97 closure (see S97-D07); claiming M4/M5 complete; PB-FA-026.

**Evidence:** [VALIDATION.md](VALIDATION.md); focused `tests/s97-*.test.js` and related suites listed in [SPRINT-97-CLOSURE.md](SPRINT-97-CLOSURE.md).

---

## S97-D07 — Close Sprint 97 — Learning Journal and Design Pattern Foundations (Accepted)

**Date:** 2026-11-12  
**Status:** **Accepted**  
**Depends on:** [S97-D06](#s97-d06--accept-m2m3-learning-journal-foundations-qualified)

**Decision:** Close **Sprint 97 — Learning Journal and Design Pattern Foundations** as **CLOSED — ACCEPTED** (qualified).

**Completed:** M1–M3 (journal foundations). Related presentation and LJ runtime hardening listed under S97-D06.

**Deferred / carry-forward:** M4 catalogue (PB-FA-029); M5 Level 3 pipeline journals + incremental reassembly evidence; S97-AD-010 verification at successor work. Sprint 96 residual a11y / maths / QA items remain on the Sprint 96 ledger.

Do **not** reopen Sprint 97 for deferred catalogue or Level 3 integration. Select next work from [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md).

**Evidence:** [SPRINT-97-CLOSURE.md](SPRINT-97-CLOSURE.md); [VALIDATION.md](VALIDATION.md).

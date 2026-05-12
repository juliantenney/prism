# Sprint Context

Sprint:

- Sprint 07 — Workflow Generation Rationalisation Review

Status:

- Sprints 03–06 stabilised manual workflow builder, definition ownership, validation vocabulary, compatibility semantics, and continuity docs.
- Sprint 07 is **review-first** on workflow **generation**, **domain packs**, **elicitation**, and **workflow brief** design—**no implementation** in the preparation phase; default execution remains audit-only until explicitly scoped.

Purpose:

- Map the workflow generation pipeline against v1.0 foundations before any generator or domain-pack rewrite.
- Analyse balance between **up-front brief capture**, **elicitation chat**, and **step-level settings** (especially for LD: learning activities vs assessment).

Scope:

- domain-pack structure and rationalisation options (review only)
- domain-specific logic location audit (`workflowGenerationContext.js`, `app.js` design regions, `domains/`)
- elicitation lifecycle and version state
- workflow brief / factory form review
- generated workflow quality vs canonical workflow-definition contracts
- LD design-information capture concern (analysis, not feature build)

Non-goals:

- no generator rewrite
- no domain-pack rewrite or reset **in this sprint**
- no `app.js` restructuring
- no execution-engine redesign
- no new v1 feature expansion
- no domain-specific logic added to general app/runtime code

Canonical planning:

- `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`

Review findings (canonical body lives in consolidation doc):

- **2026-05-12** — Documented in consolidation doc: conceptual model mix (scaffold / chat / LD pack), brief/form first-principles review note, early elicitation hypothesis, student-facing HTML as primary LD path, form+targeted-chat framing, review-only constraint, unscoped backlog candidates. Portable copy: `context-files/sprint-07-workflow-generation-rationalisation-review.md`.
- **2026-05-12 (full generation review)** — **Learner-Facing Page Generation Pass** in consolidation doc (pipeline coherence, page as assembly surface, stable vs unstable matrix, assessment-planning principle, etc.).
- **2026-05-12 (composition model)** — **Page composition model (emerging):** orientation / learning activities / assessment; valid page variants; link from desired outputs to composition questions (review-only).
- **2026-05-12 (closing mental model)** — **Current Mental Model After Workflow Review** in consolidation doc (closing synthesis, stable vs unstable summary, assessment as planning dimension). Review-only.
- **2026-05-12 (planning resolution model)** — **Planning Resolution and Workflow-Aware Configuration Model** (six-phase lifecycle, principles, classification, phase-two clarification, terminology table). Review-only.
- **2026-05-12 (pedagogic dimensions review)** — **Candidate Structural Pedagogic Dimensions Review** (governing question, dimension table, synthesis). Review-only.
- **2026-05-12 (sequencing dimensions review)** — **Pedagogic Sequencing Dimensions Review** (implicit sequencing intelligence, observed patterns, candidate table, caution on preserving compactness). Review-only.
- **2026-05-12 (Sprint 07 closeout)** — **Open Questions and Deferred Implementation Areas** + **Sprint 07 closing conclusion** (deferred implementation; no generator/engine/domain-pack rewrite at this stage). Review-only.

# PRISM Current State

## Strategic Position

PRISM is in a **v1.0 stabilisation and rationalisation** phase focused on architectural clarity, continuity, and reduction of conceptual drift—not open-ended feature expansion.

## Strongest Current Capabilities

- Prompt Studio for structured prompt refinement
- Prompt Library for reusable prompt storage and management
- Manual Workflow Builder and step-by-step workflow execution
- Utilities pipeline for HTML-oriented rendering and export
- Domain-pack constrained workflow context loading

## Current Consolidation Priorities

- preserve runtime and manifest path stability
- keep architecture and filesystem structure coherent
- maintain explicit workflow semantics and artefact contracts
- improve continuity documentation and check-in discipline
- archive legacy content rather than deleting

## Focus and Scope Notes

- workflow generation rationalisation **review** (Sprint 07) is **documented**; **brief and planning semantics alignment** (Sprint 08) is **complete (planning documentation)** — see `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md` (closure summary and **not approved** implementation-candidate table); **Sprint 09 Pass 1** — **closed** (implementation + **local browser smoke passed** on **`3d88600`**; optional design-from-brief and run-mode **skipped**; **no** regressions **observed** in runtime, generation, persistence, import/export, domain-pack, renderer, assessment, or sequencing — see `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md` **Sprint 09 Pass 1 closure**)
- domain-pack **rewrite** remains out of scope until explicitly scoped; Sprint 08 **did not** target domain-pack overhaul (**documentation-only**); same boundary applies until a sprint explicitly rescopes it
- tidy-up/governance phase is complete
- continuity workflow is now operational
- shared operational vocabulary is established
- recent documentation cleanup and archive moves are complete
- conservative artefacts naming policy is retained for stability
- consolidation sprint structure now exists under `docs/consolidation/`
- sprint transition portability now uses `docs/development/sprints/YYYY-MM-DD-sprint-name/`
- backlog system now exists under `docs/backlog/`
- manual workflow builder and definition foundations are stabilised; **Sprint 07** captured workflow-generation rationalisation in **review documentation**; **Sprint 08** completed **planning and brief semantics alignment** (audit, classification, boundary and assessment/sequencing notes, consolidation closure—**documentation only**; outputs are **planning foundations**, not approved implementation); **Sprint 09 Pass 1** — **closed** on **`3d88600`** after **local browser smoke passed** (see Sprint 09 canonical **Sprint 09 Pass 1 closure**)
- Prompt Studio consolidation model is now explicit:
  - brief state = user-authored refinement inputs/parameters
  - runtime refinement session state = transient conversational refinement lifecycle
  - prompt asset state = durable Prompt Library entity
- workflow prompt context is treated as a secondary/future consideration in Sprint 01, not a driver of current Prompt Studio design

## Next Active Focus

- **Sprint 09 — Workflow Brief Semantics Alignment (Pass 1)** — **closed (2026-05-12)** — **implementation- and verification-complete** on **`3d88600`**: **local browser smoke passed** (Workflow Factory + Workflows without console errors; existing workflow loaded; export/import round-trip; optional design-from-brief and run-mode **skipped**; **no** regressions **observed** in runtime, generation, persistence, import/export, domain-pack, renderer, assessment, or sequencing). Canonical closure: `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md` (**Sprint 09 Pass 1 closure**). Portable pack: `docs/development/sprints/2026-05-12-sprint-09-workflow-brief-semantics-alignment-pass-1/`.
- **Next:** pick follow-on work from Sprint 08 **Potential follow-on implementation candidates (not approved)** or backlog only when a **new** sprint is chartered — not auto-approved by Sprint 09 closure.
- **Sprint 08 — Workflow Planning and Brief Semantics Alignment** — **closed (planning / documentation complete)**; canonical consolidation: `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md` (includes **Potential follow-on implementation candidates (not approved)** and historical **Recommended Sprint 09 direction**).
- Portable sprint pack (reference): `docs/development/sprints/2026-05-12-sprint-08-workflow-planning-and-brief-semantics-alignment/`
- **Sprint 07 — Workflow Generation Rationalisation Review** — **review documentation complete** (input to Sprint 08): `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`
- Prior sprint pack (reference): `docs/development/sprints/2026-05-12-sprint-07-workflow-generation-rationalisation-review/`
- **Sprint 06 documentation alignment is complete** — closure: `docs/consolidation/sprint-06-check-in-closure.md`
- Consolidation vocabulary baseline: `docs/development/shared-vocabulary.md` (validation lifecycle, prompt attachment modes, import/export narrative, step identity, continuity artefacts)

## Sprint Status Notes

- Sprint 01 - Prompt Studio Consolidation completed its first pass.
- Sprint 01 outcomes: clearer Prompt Studio semantics/state boundaries, improved refinement lifecycle and payload/display clarity, and narrow accessibility/technical-debt cleanup.
- Sprint 02 - Prompt Library Consolidation passes 1-3 completed:
  - lifecycle contract comments and helper extraction landed in `app.js` without schema/runtime redesign
  - Prompt Library lifecycle flows (new/save/delete/duplicate/use/copy/export/import) were verified stable
  - canonical durable state remains `state.prompts` + `state.selectedPromptId`; filters/list/detail/version views remain derived projections
  - preserved policy: `usageCount` increments only on Use as template; duplicate keeps historical versions and adds duplicate/save snapshots; metadata ownership remains split between handlers and `Library` persistence
- Sprint 02 Prompt Library Consolidation is completed and committed.
- Sprint 03 Workflow Runtime Consolidation (review + passes 1-2) completed:
  - clarified workflow definition vs runtime navigation semantics
  - documented and stabilized run-mode lifecycle/reset inspectability without behavior redesign
  - clarified Prompt Studio workflow hydration/save boundary semantics for step outcomes
  - improved internal input-binding chip inspectability with source-step identity display only
  - manual smoke checks confirmed workflow runtime compatibility preserved
- Sprint 03 intentionally deferred:
  - run-mode redesign/state-machine work
  - schema/storage restructuring
  - workflow generation/domain-pack redesign
  - app.js module-boundary restructuring
- Sprint 03 Workflow Runtime Consolidation is completed, continuity-updated, smoke-checked, and stabilised for check-in.
- Sprint 04 — Workflow Definition Consolidation — completed and checked in (bounded, behavior-preserving):
  - Pass 1: prompt attachment canonicalization helper extraction
  - Pass 2: UI read-path consolidation for prompt attachment state projection
  - Pass 3: canonical step identity clarification (`step.id` vs `canonical_step_id`)
  - Pass 4: validation lifecycle clarification (normalize→validate where owned; warning-only/non-mutating contract; caller-owned surfacing)
  - no schema/runtime/import/export redesign introduced
- Sprint 05 — Manual verification (post-Sprint 04) — **closed, verification-only, checked in:**
  - smoke passed: load/select/render, create/edit/save, prompt attachment modes, validation warnings non-blocking, import/export, run-mode boundary sanity
  - no regressions requiring implementation changes
  - domain-pack generated workflows use local override for unsaved/default prompt assets as expected
  - closure: `docs/consolidation/sprint-05-check-in-closure.md`
- Sprint 06 — Continuity & documentation alignment — **closed (docs-only):**
  - terminology aligned across consolidation notes, `shared-vocabulary.md`, and `development-protocol.md`
  - closure: `docs/consolidation/sprint-06-check-in-closure.md`
- Sprint 07 — Workflow Generation Rationalisation Review — **review documentation complete** (learner-facing model, planning lifecycle, pedagogic dimensions, sequencing, open questions, closing conclusion): `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`
- Sprint 08 — Workflow Planning and Brief Semantics Alignment — **closed (planning / documentation complete):**
  - field/factor audit, planning-factor classification, pre/post-synthesis boundary note, **assessment planning** and **sequencing semantics** notes, terminology consolidation, backlog-vs-decision separation, closure summary, **implementation candidates extracted (not approved)**
  - **no** source, runtime, domain-pack **content**, **renderer**, or **generation behaviour** changes under Sprint 08
  - planning foundation only: `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md`
- Sprint 09 — Workflow Brief Semantics Alignment (Pass 1) — **closed** (2026-05-12): **local browser smoke passed** on **`3d88600`** (Workflow Factory + Workflows, console clean, existing workflow load, export/import round-trip; optional design-from-brief + run-mode **skipped**); **no** regressions **observed** in runtime, generation, persistence, import/export, domain-pack, renderer, assessment, or sequencing; closure: `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`
- Deferred from Sprint 01 by design:
  - major `app.js` size reduction (requires later module-boundary sprint)
  - generated workflow integration decisions
  - broader UI polish

## Active Focus Areas

- Prompt Studio
- Prompt Library
- Manual Workflow Builder
- workflow semantics
- artefact contracts
- workflow planning and brief semantics (**Sprint 08** — **complete**, planning-only foundation); **Sprint 09 Pass 1** — **closed** on **`3d88600`** after **local browser smoke passed** (`docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`)

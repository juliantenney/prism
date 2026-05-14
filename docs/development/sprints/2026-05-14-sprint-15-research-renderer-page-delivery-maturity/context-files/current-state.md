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

- workflow generation rationalisation **review** (Sprint 07) is **documented**; **brief and planning semantics alignment** (Sprint 08) is **complete (planning documentation)** — see `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md` (closure summary and **not approved** implementation-candidate table); **Sprint 09** — **closed** (2026-05-12): **bounded**, **semantics-first**, **compatibility-preserving** Pass 1 on **`3d88600`** + **governance / contract boundary** on **`4b9f5ca`**; formal closure `docs/consolidation/sprint-09-pass-1-closure.md`; charter + audit `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`; **Sprint 10** — **bootstrap contract audit and governance synthesis** **complete and committed** on **`3bd6d10`** — **canonical** audit artefact `docs/consolidation/sprint-10-contract-audit.md` (**documentation only**; **no** implementation charter); Sprint 09 **contract-boundary governance** **unchanged**
- domain-pack **rewrite** remains out of scope until explicitly scoped; Sprint 08 **did not** target domain-pack overhaul (**documentation-only**); same boundary applies until a sprint explicitly rescopes it
- tidy-up/governance phase is complete
- continuity workflow is now operational
- shared operational vocabulary is established
- recent documentation cleanup and archive moves are complete
- conservative artefacts naming policy is retained for stability
- consolidation sprint structure now exists under `docs/consolidation/`
- sprint transition portability now uses `docs/development/sprints/YYYY-MM-DD-sprint-name/`
- backlog system now exists under `docs/backlog/`
- manual workflow builder and definition foundations are stabilised; **Sprint 07** captured workflow-generation rationalisation in **review documentation**; **Sprint 08** completed **planning and brief semantics alignment** (audit, classification, boundary and assessment/sequencing notes, consolidation closure—**documentation only**; outputs are **planning foundations**, not approved implementation); **Sprint 09** — **closed** (Pass 1 **`3d88600`**, governance **`4b9f5ca`**, closure note **`sprint-09-pass-1-closure.md`**); **workflow-generation contract surface** documented as outside Sprint 09 scope — see closure note and Sprint 09 canonical **Sprint 09 governance**
- Prompt Studio consolidation model is now explicit:
  - brief state = user-authored refinement inputs/parameters
  - runtime refinement session state = transient conversational refinement lifecycle
  - prompt asset state = durable Prompt Library entity
- workflow prompt context is treated as a secondary/future consideration in Sprint 01, not a driver of current Prompt Studio design

## Next Active Focus

- **Sprint 15 — Research Renderer and Page Delivery Maturity** (**active focus**): **Research-first** verification and improvement of **Design Page → `page` JSON → Utilities → HTML**; **minimal Research `page` contract**; briefing-oriented typography/presentation — **not** a broad renderer redesign, **not** LD renderer overhaul, **not** workflow schema or portability work. **Map / charter:** `docs/consolidation/sprint-15-index.md`, `sprint-15-charter.md`. **Portable pack:** `docs/development/sprints/2026-05-14-sprint-15-research-renderer-page-delivery-maturity/`. **Recommended first task:** one **E2E** Research run through Utilities, then document the **minimal `page` contract** (charter §**9**).
- **Sprint 14 — Research Domain Runnable Maturity** (**closed baseline, 2026-05-14**): runnable Research + **Design Page** endpoint + save/export/normalisation integrity — **not** reopened as active sprint focus. **Record:** `docs/consolidation/sprint-14-index.md`, `sprint-14-current-known-issues.md` §**10** (completed work).
- **Cross-sprint architecture & portability backlog (descriptive only, not a roadmap):** [`docs/consolidation/prism-architecture-portability-backlog.md`](../consolidation/prism-architecture-portability-backlog.md) — unfinished themes after Sprint 12–13 consolidation; **no** implementation charter implied. **Sprint 14** / **Sprint 15** are linked there as **parallel product work** (§§**2.1–2.2**), **not** portability redesign.
- **Sprint 13 — first-pass is documented and closed in consolidation** (post-commit posture). **Map:** `docs/consolidation/sprint-13-index.md`. **Closure and verification:** `docs/consolidation/sprint-13-first-pass-closure.md`. **Delivered:** **S13-07** — v1 reference doc (`docs/consolidation/sprint-13-general-alwayson-first-structured-domain-behaviour.md`); **S13-01** — narrow Workflow Factory **`#wfDesignDomainSelect`** strict-parity tidy (see closure; `app.js` only). **Decision-gated / not implemented:** **S13-02** default-domain rule; **S13-03** display-only hint neutralisation — audits and gate notes are linked from the index (no implementation closure). **Sprint 12** first-pass structural observability (A–E) remains **closed** (`docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`) — **not** reopened. **No** full drop-in domain-pack portability claim in Sprint 13 first-pass artefacts. **Further Sprint 13 work remains unchartered** unless explicitly approved (no implied roadmap commitment).
- **Workflow Factory — General baseline-only (v1, post–first-pass doc alignment 2026-05-14):** **General** remains **always-on baseline** context (merged via manifest / normalisation); **Learning Design** and **Research** are the **runnable** Factory domains; **generation** requires an explicit runnable choice (general-only is blocked in Factory). **S13-01** parity matrices / runtime baselines for **`#wfDesignDomainSelect`** remain **historical** for the **2026-05-13** option list (**superseded** for ordered options and initial value). Authoritative **current** wording: **`sprint-13-general-alwayson-first-structured-domain-behaviour.md`** §**Current v1 — General baseline-only**. **Sprint 12** remains **closed**; **no** full portability claim added here.

- **Sprint 11 is closed** — closure summary: `docs/consolidation/sprint-11-closure.md`.

- **Sprint 10 — Workflow Brief Contract Rationalisation** — **bootstrap audit complete** (2026-05-12, commit **`3bd6d10`**): **canonical** `docs/consolidation/sprint-10-contract-audit.md` (inventories §§3–8 + governance synthesis §§9–12); **documentation only** — **no** implementation charter. Framing: `docs/consolidation/sprint-10-workflow-brief-contract-rationalisation-bootstrap.md`. Portable pack: `docs/development/sprints/2026-05-12-sprint-10-workflow-brief-contract-rationalisation/` (**`GPT-BOOTSTRAP-PROMPT.md`**).

- **Sprint 11 — Workflow Generation Fixture & Regression Foundations** — **closed**; completed channels and deferred items are recorded in `docs/consolidation/sprint-11-closure.md`. Deferred WGC/runtime orchestration coverage remains explicitly out of completed Sprint 11 scope.
- **Sprint 09 — Workflow Brief Semantics Alignment** — **sprint closed (2026-05-12)** — **completed**, **bounded**, **semantics-first**, **compatibility-preserving**; **governance boundary** between UI semantics alignment and **workflow-generation contract** semantics is **established** and documented. Formal closure: `docs/consolidation/sprint-09-pass-1-closure.md`. Charter + verification: `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`. Commits: **`3d88600`** (Pass 1 implementation), **`4b9f5ca`** (contract-boundary documentation). Portable pack: `docs/development/sprints/2026-05-12-sprint-09-workflow-brief-semantics-alignment-pass-1/`.
- **Deferred contract work** (`briefLines`, `extractWorkflowBriefExplicitFactors`, step-context builders, `workflowGenerationContext.js`, domain-pack contract fields, persistence/import/export contract changes) remains governed by explicit sprint/pass charters. Sprint 11 completed bounded regression foundations only; deferred WGC/runtime orchestration coverage is recorded in `docs/consolidation/sprint-11-closure.md`.
- **Sprint 12 — first-pass structural observability (Phases A–E)** is **closed** — `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md` (**bounded structural tests only**; **no** required production behavior changes for this pass). This closure **does not** complete broader Sprint 12 or deferred WGC/runtime orchestration work recorded in `docs/consolidation/sprint-11-closure.md`. **Sprint 13 first-pass** did **not** reopen Sprint 12.
- **Broader Sprint 12 / deferred orchestration** remains **future** and **explicitly chartered** only; candidate preparation context (not a blanket implementation approval): `docs/consolidation/sprint-12-candidate-prep-note.md`. Semantic contract migration remains out of scope until separately chartered.
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
- Sprint 09 — Workflow Brief Semantics Alignment — **sprint closed** (2026-05-12): Pass 1 **`3d88600`** + governance **`4b9f5ca`**; **local browser smoke passed** on **`3d88600`**; **no** regressions **observed** in runtime, generation, persistence, import/export, domain-pack, renderer, assessment, or sequencing; formal closure `docs/consolidation/sprint-09-pass-1-closure.md`; charter + tables `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`
- Sprint 10 — Workflow Brief Contract Rationalisation — **bootstrap contract audit complete** (2026-05-12, docs commit **`3bd6d10`**): **canonical** `docs/consolidation/sprint-10-contract-audit.md` — **documentation / governance synthesis only**; **no** implementation pass chartered during bootstrap; Sprint 09 **contract surface** boundary **unchanged** (`docs/consolidation/sprint-09-pass-1-closure.md`)
- Sprint 11 — Workflow Generation Fixture & Regression Foundations — **closed**; see `docs/consolidation/sprint-11-closure.md` for completed channels, pinned baseline behaviours, and deferred WGC/runtime coverage.
- Sprint 13 — first-pass — **documented/closed in consolidation** (2026-05-13): map `docs/consolidation/sprint-13-index.md`; closure `docs/consolidation/sprint-13-first-pass-closure.md`; **delivered** S13-07 (v1 reference) + S13-01 (narrow `#wfDesignDomainSelect` parity tidy); **S13-02** / **S13-03** remain decision-gated (no implementation closure); **no** full drop-in portability claim; further Sprint 13 work **unchartered** unless explicitly approved. **Doc alignment (2026-05-14):** **General baseline-only** Workflow Factory — see `sprint-13-general-alwayson-first-structured-domain-behaviour.md` §**Current v1**; S13-01 matrices **historical** for Factory option list.
- Sprint 15 — **Research Renderer and Page Delivery Maturity** — **chartered (2026-05-14):** index `docs/consolidation/sprint-15-index.md`; charter `sprint-15-charter.md`; portable pack `docs/development/sprints/2026-05-14-sprint-15-research-renderer-page-delivery-maturity/`. **Research-first** Utilities / **`page`** path; **not** LD renderer overhaul or schema redesign.
- Sprint 14 — **Research Domain Runnable Maturity** — **baseline closed for active focus (2026-05-14):** first implementation slice + consolidation — `sprint-14-index.md`, **`sprint-14-current-known-issues.md`** §**10**; **`page`**/renderer follow-up → **Sprint 15**.
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
- workflow planning and brief semantics (**Sprint 08** — **complete**, planning-only foundation); **Sprint 09** — **sprint closed** (bounded Pass 1 + contract-boundary governance; `docs/consolidation/sprint-09-pass-1-closure.md`); **Sprint 10** — **bootstrap audit complete** (**canonical** `docs/consolidation/sprint-10-contract-audit.md`, **`3bd6d10`**); **Sprint 11** — **closed** (`docs/consolidation/sprint-11-closure.md`); **Sprint 12 first-pass structural observability (A–E)** — **closed** (`docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`); **broader Sprint 12** candidate directions and deferred orchestration remain **future** / prep-only context in `docs/consolidation/sprint-12-candidate-prep-note.md` (**not** implied complete); **Sprint 13 first-pass** — **documented/closed** in consolidation (`docs/consolidation/sprint-13-index.md`; S13-02/S13-03 decision-gated; **no** full drop-in portability claim); further Sprint 13 work **unchartered** unless explicitly approved; **Sprint 14 — Research Domain Runnable Maturity** — **baseline closed (2026-05-14)** (`docs/consolidation/sprint-14-index.md`; runnable Research + **Design Page**); **Sprint 15 — Research Renderer and Page Delivery Maturity** — **active** (`docs/consolidation/sprint-15-index.md`; Utilities **`page`** path, **not** LD renderer overhaul)

# Sprint 06 — Continuity & Documentation Alignment

## Purpose

Align PRISM **documentation**, **terminology**, and **ownership narratives** with the stabilized behavior verified in Sprint 04 (implementation) and Sprint 05 (manual verification). Reduce conceptual drift across consolidation artefacts without changing product behavior.

## Context

- Sprint 04 bounded workflow-definition consolidation landed with behavior-preserving code and clarification comments.
- Sprint 05 confirmed smoke passage across workflow definition/runtime boundaries, prompt attachment modes, validation lifecycle, import/export, and run mode.
- Sprint 06 intentionally shifts to **docs-only** refinement so vocabulary and check-in discipline match what the codebase already does.

## Scope

- **Documentation and ownership alignment**
  - Single narrative for canonical workflow definition state vs derived UI/runtime projections (consistent across consolidation docs and handovers).
- **Validation lifecycle terminology alignment**
  - Align words such as normalize → validate → surface warnings with the actual contract (warning-only, non-mutating, caller-owned surfacing).
- **Prompt attachment semantics clarification**
  - Document `library_prompt`, `local_override`, and none/empty paths and compatibility fields (`prompt_source` / `prompt_source_type`) without implying schema changes.
- **Import/export compatibility documentation clarification**
  - Document bundle shape expectations and merge semantics at the documentation layer only.
- **Workflow-definition ownership terminology cleanup**
  - Clarify `step.id` vs `canonical_step_id`, titles, and gather/save/import boundaries in prose.
- **Continuity / check-in discipline refinement**
  - Templates or conventions for sprint closure notes, pointers in `current-state`, and handover freshness.

## Non-Goals

- No implementation changes in application code (`app.js`, `library.js`, HTML/CSS, etc.).
- No schema, storage, or migration redesign.
- No runtime execution or import/export **behavior** changes.
- No workflow-generation redesign.
- No domain-pack redesign.
- No module restructuring.

## Constraints

- **Behavior-preserving posture only:** documentation must describe current behavior; where behavior is ambiguous, document ambiguity and defer redesign.
- Sprint 06 outputs are **markdown and continuity artefacts** unless a future sprint explicitly approves code edits.

## Deliverables (Suggested)

1. Updated or new consolidation notes under `docs/consolidation/` as needed (terminology glossary fragments, import/export narrative, validation glossary).
2. Optional alignment passes on `docs/development/shared-vocabulary.md` and `docs/development/development-protocol.md` if terminology drift is found.
3. Sprint 06 closure note when documentation passes complete (same pattern as Sprint 05 closure).
4. Optional portable sprint folder under `docs/development/sprints/` if team wants frozen snapshots for the next chat.

## Success Criteria

- Sprint 05 is formally closed in continuity artefacts (closure note + current-state + handover).
- Sprint 06 planning artefacts are internally consistent with Sprint 04/05 outcomes and constraints.
- `docs/development/current-state.md` and session handover reflect **post-Sprint 05** status and **Sprint 06** as next bounded focus.
- No code changes outside documentation and continuity paths for Sprint 06 scope.

## Recommended First Task

Audit consolidation docs (`sprint-04-workflow-definition-review.md`, `sprint-04-check-in-note.md`, `sprint-05-manual-verification-planning.md`, `sprint-05-check-in-closure.md`) against `shared-vocabulary.md` and list **terminology deltas only** (table of term → intended meaning → doc locations to edit). Implement edits in a single bounded documentation pass after the audit list is reviewed.

---

## Status (Current)

**Documentation alignment pass completed** (docs-only). Canonical glossary additions: `docs/development/shared-vocabulary.md`. Protocol reinforcement: `docs/development/development-protocol.md`. Sprint closure: `docs/consolidation/sprint-06-check-in-closure.md`.

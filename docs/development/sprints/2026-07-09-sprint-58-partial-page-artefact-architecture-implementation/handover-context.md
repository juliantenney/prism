# Handover Context — Sprint 58

## Sprint status

**Phase 5 hardening complete** — 2026-07-09

## Predecessors

| Sprint | Outcome |
| ------ | ------- |
| 56F | v2 schema frozen; ownership defined; full-page enrichment planned |
| 57A | Instructional budgeting defined; full-page enrichment **failed** E2E testing |

## Architecture decision

Partial page artefacts + deterministic assembly. See [ADR-partial-page-artefact-assembly.md](ADR-partial-page-artefact-assembly.md).

## Implemented architecture state

- `isPageEnrichmentV2WorkflowEnabled()` uses workflow config (no hard-coded `true`)
- Partial gate implemented: `isPartialPageOutputWorkflowEnabled()`
- Post-EP no-injection gate implemented: `shouldInjectUpstreamCaptureIntoPrompt()`
- Deterministic assembly module implemented: `lib/page-vnext-assemble.js`
- Render path assembles from stored partial captures before rendering: `resolvePageForRenderOrAssembly()`
- Partial validators implemented for post-EP stages including assessment partials

Assessment partial support is intentionally limited to:

- `step_design_assessment` → `assessment_design`
- `step_generate_assessment_items` → `assessment_items`

Excluded from assessment partial scope (by design):

- `step_design_feedback`
- `step_validate_learning_design`
- `step_revise_assessment_based_on_qa`
- `step_design_marking_rubric`

## Phase 5 regression summary

- Targeted Sprint 58 regression suite: pass
- Affected v2 suite: pass
- Full suite run executed: `1513 pass / 56 fail`
- Remaining full-suite failures are outside Sprint 58 hardening scope

## New chat entry

[SPRINT-58-CONTEXT-FOR-NEW-CHAT.md](SPRINT-58-CONTEXT-FOR-NEW-CHAT.md)

## Constraints (non-negotiable)

- No API
- No LLM reconciliation
- No upstream capture injection (post-EP)
- No full-page enrich-in-place (post-EP)
- No `finalise_page` stage implementation in Sprint 58

## Operational limitations retained

- Manual Copilot paste workflow remains the run-mode interaction path.
- No API artefact passing between stages.

## Reference material (read-only)

- 57A budgeting docs — prompt authoring guidance only
- 56F schema and ownership matrix — unchanged

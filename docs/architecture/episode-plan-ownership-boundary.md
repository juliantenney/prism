# Episode Plan ownership boundary (producer ↔ renderer)

**Date:** 2026-07-23  
**Status:** Active  
**Related:** [learner-renderer-vnext.md](./learner-renderer-vnext.md) · ADR-012

## Boundary

Episode Plan owns archetype and beat sequence.

Downstream learning-design and manifestation stages may enrich activities
but must not replan or replace canonical Episode Plan semantics.

Renderer consumes the preserved canonical sequence and fails closed when
the producer contract is violated.

## Enforcement points

| Layer | Mechanism |
| ----- | --------- |
| Episode Plan capture | `validatePageShellAgainstVNextSchema` + `validatePageEpisodePlanVocabulary` (FunctionEnum) |
| Capture repair | `applyEpisodePlanCaptureCanonicalEnforcement` derives frozen V1 from learning outcomes (including LOs embedded on an invalid shell when the LO step capture is empty) |
| Page assembly | `mergeActivitiesById` preserves `activity.episode_plan` (`DOWNSTREAM_EPISODE_PLAN_OVERWRITE_IGNORED`) |
| Renderer | Exact variant match on the preserved sequence; `UNKNOWN_ARCHETYPE_VARIANT` if producer emits an unregistered **legal** FunctionEnum sequence |

Illegal vocabulary such as beat function `consolidation` must be rejected at Episode Plan capture with `NON_CANONICAL_EPISODE_PLAN_BEAT`, not discovered first by the renderer.

## Deferred — Sprint 69

Evaluate replacing whole-sequence enumeration with shared archetype grammar validation.

Do not treat registry growth as the long-term contract model; grammar validation remains the intended successor abstraction.

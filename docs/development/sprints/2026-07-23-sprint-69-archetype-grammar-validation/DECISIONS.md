# Sprint 69 Decision Log (Seed)

**Related:** [WHY-SPRINT-69.md](WHY-SPRINT-69.md) · [HANDOVER.md](HANDOVER.md) · [PLAN.md](PLAN.md)

## D69-01 Episode Plan ownership remains authoritative
Episode Plan owns archetype and beat sequence semantics. Downstream stages may enrich but not replan.

## D69-02 Canonical beat vocabulary
FunctionEnum remains canonical vocabulary source for producer-side legality.

## D69-03 Validation boundary
Illegal beat vocabulary must fail at producer/capture validation boundary, not first at renderer.

## D69-04 Renderer role
Renderer interprets preserved educational semantics; it does not invent pedagogy.

## D69-05 Manifestation boundary
Manifestation/assembly are deterministic transport/merge layers, not semantic replanning layers.

## D69-06 Diagnostics philosophy
Fail closed, explicit ownership, no silent fallback.

## D69-07 Sprint 69 migration target
Move exact validation from sequence enumeration to shared archetype grammar.

## D69-08 Excluded strategy
No fuzzy matching and no nearest-sequence fallback.

Related:
- [ADR-012](../../../architecture/adr/ADR-012-learner-renderer-interprets-educational-semantics.md)
- [Episode Plan ownership boundary](../../../architecture/episode-plan-ownership-boundary.md)

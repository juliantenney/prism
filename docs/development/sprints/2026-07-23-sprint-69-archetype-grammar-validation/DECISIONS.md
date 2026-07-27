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

## D69-09 Phase 4 validation routing
Canonical all-FunctionEnum sequences are validated by shared grammar at renderer runtime. Journey-compressed sequences (any known non-FunctionEnum compatibility beat) remain on the explicit compatibility-registry path. Mixed/unknown/malformed vocabulary fails closed. No grammar→registry rescue and no compressed→FunctionEnum normalisation.

## D69-10 Phase 4 binding derivation
Educational legality and manifestation binding remain separate. Grammar decides legality; renderer composition metadata is either exact registry composition (when present) or deterministic `buildCanonicalFunctionEnumVariant` from archetype + FunctionEnum + shared role map.

## D69-11 Phase 5 mixed-known vocabulary (superseded by D69-13)
Originally retained mixed FE+compressed as compatibility. Superseded: Prism has no deployed legacy content; mixed vocabulary now fails closed.

## D69-12 Phase 5 registry demotion (superseded by D69-13)
Whole-sequence enumeration demoted; journey + continuity registries remained temporarily. Superseded by full removal in Phase 5B.

## D69-13 Phase 5B pre-launch compatibility removal
Internal fixtures are not legacy contracts. Production runtime has one educational validation route: canonical Episode Plan → FunctionEnum → shared archetype grammar → deterministic canonical binding. Journey-compatibility registry and composition-continuity overlays are removed. Mixed FunctionEnum/compressed → `MIXED_EPISODE_PLAN_VOCABULARY` fail closed. Compressed-only → `UNKNOWN_EPISODE_PLAN_BEAT` fail closed. No renderer compressed→FunctionEnum mapping. No exact whole-sequence legality. `UNKNOWN_ARCHETYPE_VARIANT` is catalog history only.

## D69-14 Material audit — consolidation over proliferation
Unsupported learner material count is reduced through alias normalisation, non-renderable boundaries, and shared renderer families — not by introducing new renderer families per legacy token.

## D69-15 Material audit — non-renderable structural boundary
Workflow, instructional, metadata, and activity-field tokens (`support_note`, `support_notes`, `expected_output`, etc.) are classified `NON_RENDERABLE` and excluded from learner material inventory.

## D69-16 Material audit — strategy → task_card
`strategy`, `strategy_options`, and `strategies` are lossless aliases of `task_card`. Static exposition only; no selection UI in Sprint 69.

## D69-17 Material audit — rubric → checklist
`rubric` is a lossless alias of `checklist` for markdown/bullet payloads. Structured scoring objects → `AMBIGUOUS_MATERIAL_TYPE`; empty → `INVALID_MATERIAL_PAYLOAD`.

## D69-18 Material audit — guarded table/worksheet compatibility
Generic `table` and `worksheet` remain in the unsupported ledger as intentional guarded compatibility paths to `table_workspace` — not missing renderers for resolved types.

## D69-19 Material audit — video deferred
`video` remains unsupported intentionally. Video rendering is future capability, not a Sprint 69 implementation gap.

Related:
- [ADR-012](../../../architecture/adr/ADR-012-learner-renderer-interprets-educational-semantics.md)
- [Episode Plan ownership boundary](../../../architecture/episode-plan-ownership-boundary.md)

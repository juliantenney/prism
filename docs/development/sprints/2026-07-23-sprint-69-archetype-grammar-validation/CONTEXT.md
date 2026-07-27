# Sprint 69 Context (Primary onboarding document)

**Status:** Sprint 69 **COMPLETE** (closed 2026-07-27). For active work, use [Sprint 70 CONTEXT](../2026-07-27-sprint-70-visual-affordance-pipeline/CONTEXT.md).

**Related:** [sprint-69-closeout.md](../../../sprints/sprint-69-closeout.md) · [HANDOVER.md](HANDOVER.md)

---

## Final repository state (Sprint 69 closeout)

- Shared archetype grammar is the production validation authority.
- Journey-compressed / mixed vocabulary fails closed in production runtime.
- Learner material canonicalisation audit complete; unsupported count **9 → 3**.
- Certification: **CERTIFIED** (6 workflows, 25 activities, 91 moments).
- Git revision at closeout: `458b598`.

## Important architectural decisions

- Renderer interprets semantics, does not author them ([ADR-012](../../../architecture/adr/ADR-012-learner-renderer-interprets-educational-semantics.md)).
- Episode Plan owns archetype and beat sequence semantics ([ownership boundary](../../../architecture/episode-plan-ownership-boundary.md)).
- One educational validation route: FunctionEnum → grammar → canonical binding (D69-13).
- Material types resolve via aliases → non-renderable boundary → shared renderer families.
- No fuzzy matching; no new renderer families for resolved material types.

## Active contracts (post-Sprint 69)

### Episode Plan / grammar

- `lib/episode-plan-v1-vocabulary.js`
- `lib/episode-plan-v1-archetype-grammar.js`
- `lib/learner-renderer-vnext/archetype-validation-route.js`
- `lib/episode-plan-v1-persistence-migration.js`
- `lib/page-vnext-assemble.js`

### Learner material

- `lib/learner-renderer-vnext/parse-material.js`
- `lib/learner-renderer-vnext/validate-input.js`
- `lib/beat-material-registry.js`
- `lib/page-render-normalize.js`

## Material audit retrospective

- Consolidation over proliferation: task_card, checklist, table_workspace extended — not duplicated.
- Remaining unsupported: `table`, `video`, `worksheet` — intentional guarded compatibility / future capability.

## Successor

[Sprint 70 — Visual Affordance Pipeline](../2026-07-27-sprint-70-visual-affordance-pipeline/CONTEXT.md)

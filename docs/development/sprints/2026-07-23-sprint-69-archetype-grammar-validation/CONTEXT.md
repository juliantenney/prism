# Sprint 69 Context (Primary onboarding document)

**Related:** [SPRINT-69-START-HERE.md](SPRINT-69-START-HERE.md) · [WHY-SPRINT-69.md](WHY-SPRINT-69.md) · [HANDOVER.md](HANDOVER.md) · [GOALS.md](GOALS.md) · [PLAN.md](PLAN.md)

---

## Current repository state

- Sprint 68 complete and closed.
- Post-closeout Educational Psychology contract repair merged in local workspace.
- Sprint 69 Phases 1–4 implemented; Phase 4 cutover complete for canonical FunctionEnum renderer legality.

## Important architectural decisions

- Renderer interprets semantics, does not author them ([ADR-012](../../../architecture/adr/ADR-012-learner-renderer-interprets-educational-semantics.md)).
- Episode Plan owns archetype and beat sequence semantics ([ownership boundary](../../../architecture/episode-plan-ownership-boundary.md)).
- Validation must fail closed with explicit diagnostics.
- Exact validation will move from sequence enumeration to shared archetype grammar — not fuzzy matching. See [WHY-SPRINT-69.md](WHY-SPRINT-69.md).

## Active contracts

- `lib/episode-plan-v1-vocabulary.js` — canonical FunctionEnum membership (Sprint 69 Phase 1)
- `lib/episode-plan-v1-archetype-grammar.js` — shared archetype legality grammar (Sprint 69 Phase 2)
- `lib/learner-renderer-vnext/archetype-grammar-dual-validation.js` — observational registry↔grammar compare (updated Phase 4)
- `lib/learner-renderer-vnext/archetype-validation-route.js` — Phase 4 explicit validation routing
- `scripts/report-episode-plan-grammar-parity.js` — Phase 4 authority-aware parity report
- `lib/episode-plan-v1-validation.js` — EP legality (consumes shared vocabulary)
- `lib/page-shell-create.js` — shell validation and EP vocabulary checks
- `lib/page-vnext-assemble.js` — deterministic assembly + EP overwrite protection
- `lib/learner-renderer-vnext/archetype-rules.js` — registry + canonical binding helper (journey compatibility + FE composition metadata)

## Deferred work

- Phase 5: retire redundant whole-sequence registry legality for FunctionEnum; keep journey compatibility until ownership/mapping is resolved.
- Keep exact deterministic validation semantics; no fuzzy matching.

## Risks

- Grammar mismatch between producer and renderer
- Over/under-constrained grammar
- Diagnostic regressions during migration
- Journey-compressed compatibility vocabulary still depends on registry until Phase 5 ownership decision

See [RISKS.md](RISKS.md).

## Open questions

1. Final grammar representation format (code-first vs declarative schema).
2. Dual-validation window length before registry retirement.
3. Backward compatibility strategy for legacy sequence fixtures.

## Expected implementation order

1. shared vocabulary
2. shared grammar
3. dual validation
4. renderer migration
5. registry retirement
6. certification and closeout

Details: [PLAN.md](PLAN.md)

## Important files

- `docs/architecture/learner-renderer-vnext.md`
- `docs/architecture/learner-renderer-vnext-diagnostics.md`
- `docs/architecture/learner-renderer-vnext-extension-guide.md`
- `docs/architecture/episode-plan-ownership-boundary.md`
- `docs/architecture/adr/ADR-012-learner-renderer-interprets-educational-semantics.md`
- `docs/sprints/sprint-68-closeout.md`
- `tests/fixtures/educational-psychology-post-s68/`

## Existing diagnostics

Primary error families:
- archetype/variant mismatch
- assignment integrity
- unsupported surfaces/capabilities
- producer-boundary vocabulary violations

## Existing tests

- EP validation: `tests/episode-plan-v1-validation.test.js`
- EP workflow enforcement: `tests/workflow-ld-episode-plan-step.test.js`
- assembly: `tests/page-vnext-assemble.test.js`
- Educational Psychology regression: `tests/educational-psychology-episode-plan-contract.test.js`
- renderer suites: `tests/learner-renderer-vnext*.test.js`

## Completion criteria

Authoritative checklist: [HANDOVER.md — Sprint 69 Definition of Done](HANDOVER.md#sprint-69-definition-of-done).


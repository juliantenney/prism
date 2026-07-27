# Sprint 69 Task Breakdown

**Status:** All tasks complete (closed 2026-07-27)

## T1 Vocabulary ownership
- [x] inventory current vocab sources
- [x] resolve canonical ownership boundary
- [x] add shared vocabulary contract tests

## T2 Grammar definition
- [x] encode per-archetype required/optional beats
- [x] encode ordering + terminal constraints
- [x] define legal variation boundaries

## T3 Producer validation integration
- [x] apply shared grammar in EP capture/validation path
- [x] ensure fail-closed producer diagnostics

## T3b Dual validation (Phase 3)
- [x] run registry + grammar side by side
- [x] observational disagreement diagnostics
- [x] parity report over templates, registry, corpus, Ed Psych fixture
- [x] journey-compressed classified as non-applicable

## T4 Renderer validation integration
- [x] bind renderer through shared grammar for canonical FunctionEnum
- [x] Phase 5B: remove journey-compressed compatibility registry path
- [x] preserve deterministic exact matching / fail-closed semantics

## T5 Diagnostics and migration
- [x] add Phase 4 route + grammar failure diagnostics
- [x] retain explicit error codes and ownership metadata
- [x] Phase 5: demote whole-sequence registry
- [x] Phase 5B: remove journey/continuity compatibility; migrate fixtures
- [x] Phase 5B residual: runstate persistence migration
- [x] Sprint closeout artefacts (Phase 6)

## T6 Regression and certification
- [x] run Educational Psychology fixture/regression
- [x] run full renderer suite and certification runner
- [x] Sprint closeout documentation

## T7 Learner material canonicalisation audit

### Phase 0 — Inventory
- [x] regenerate GAM renderer type inventory
- [x] regenerate unsupported learner interactions ledger

### Phase 1 — Alias normalisation
- [x] canonical alias map in `parse-material.js` + `page-render-normalize.js`
- [x] phase regression tests

### Phases 2–3 — Non-renderable boundaries
- [x] `NON_RENDERABLE_MATERIAL_TYPES` structural/workflow/instructional leakage
- [x] beat-material-registry cleanup
- [x] phase regression tests

### Phase 4 — Card family
- [x] consolidate card variants onto shared renderer
- [x] phase regression tests

### Phase 5 — Table / worksheet guarded compatibility
- [x] generic `table` → `table_workspace` guarded path
- [x] generic `worksheet` guarded compatibility
- [x] phase regression tests

### Phase 6 — Support family
- [x] `support_note` / `support_notes` → non-renderable
- [x] obsolete `support` → unknown
- [x] phase regression tests

### Phase 7 — Strategy family
- [x] `strategy`, `strategy_options`, `strategies` → `task_card` alias
- [x] static exposition (no selection UI)
- [x] phase regression tests

### Phase 8 — Rubric
- [x] `rubric` → `checklist` alias
- [x] structured scoring objects fail closed
- [x] phase regression tests

### Audit closeout
- [x] unsupported count 9 → 3 (intentional remainder documented)
- [x] inventory artefacts regenerated

# Sprint 69 Status

**Related:** [HANDOVER.md](HANDOVER.md) · [WHY-SPRINT-69.md](WHY-SPRINT-69.md) · [SPRINT-69-START-HERE.md](SPRINT-69-START-HERE.md)

**State:** Phase 5B complete (including residual hetero producer migration); ready for Phase 6 certification closeout.  
**Preparation type:** Documentation + handover complete; Phases 1–5B implementation landed.

## Current checkpoint

- [x] Sprint folder created
- [x] handover and context docs created
- [x] roadmap and task breakdown created
- [x] risk/decision logs created
- [x] start-here guide created
- [x] architecture principles and Definition of Done documented
- [x] WHY-SPRINT-69 rationale document created
- [x] cross-reference links added across core pack
- [x] Phase 1 — shared FunctionEnum vocabulary module (`lib/episode-plan-v1-vocabulary.js`)
- [x] Phase 2 — shared archetype grammar (`lib/episode-plan-v1-archetype-grammar.js`)
- [x] Phase 3 — dual validation + parity report
- [x] Phase 4 — renderer migration (grammar authority for canonical FunctionEnum)
- [x] Phase 5 — registry demotion + compatibility boundary clarification
- [x] Phase 5B — remove journey-compressed / whole-sequence compatibility from production runtime
- [x] Phase 5B residual — heteroscedasticity positive producer + kitchen-sink builder aligned to FunctionEnum
- [ ] Phase 6 — certification closeout

## Phase 5B notes

- Journey compatibility registry and composition-continuity overlays **removed** from runtime.
- Sole educational validation route: FunctionEnum → shared grammar → canonical binding.
- Compressed and mixed vocabulary fail closed (`UNKNOWN_EPISODE_PLAN_BEAT` / `MIXED_EPISODE_PLAN_VOCABULARY`).
- VTT, Heteroscedasticity, RNA, kitchen-sink, Ed Psych repaired fixtures migrated to canonical FunctionEnum.
- `UNKNOWN_ARCHETYPE_VARIANT` retired from production validation (catalog history only).
- Retirement targets: zero runtime compatibility entries; all positive cases `canonical-grammar`.

## Residual blocker (resolved)

**Symptom:** Heteroscedasticity interactive render failed all five activities with `MIXED_EPISODE_PLAN_VOCABULARY` / `validationRoute: unknown-or-mixed-vocabulary`.

**Authoritative source:** stale compressed Episode Plan functions in workflow **runstate / assembled page captures** (production keys `promptr.workflows.v1` + `promptr.workflows.runstate.v1`). Certification golden fixture migration alone did not repair the interactive path.

**Why it escaped inventory:** Phase 5B migrated page-render fixtures, but live interactive validation reads Episode Plan from runstate captures / Utilities page JSON. Those retained compressed vocabulary (`check_understanding`, `worked_example` as EP function, etc.).

**Fix:** production persistence migration `lib/episode-plan-v1-persistence-migration.js` on runstate load and assembly/page selection (not grammar aliases).

**Canonical sequences now:**

| Activity | Archetype | Sequence |
|---|---|---|
| A1 | understand | orientation → explanation → verification |
| A2 | analyse | orientation → worked_thinking → guided_practice → verification |
| A3 | apply | orientation → worked_thinking → guided_practice → reflection |
| A4 | understand | orientation → explanation → guided_practice → verification |
| A5 | evaluate | orientation → worked_judgement → guided_practice → reflection |

**Regression:** `tests/heteroscedasticity-interactive-workflow-path.test.js` (workflow storage loaders) + prior fixture/scan tests.

# Sprint 69 Regression Corpus

## Primary fixtures

| Fixture | Path | Why it exists |
| --- | --- | --- |
| Educational Psychology post-S68 | `tests/fixtures/educational-psychology-post-s68/` | Captures real producer↔renderer contract failure and repaired path |
| Renderer certification corpus | `lib/learner-renderer-vnext/certification-corpus.js` | Authoritative release gate across multiple workflows |
| Canonical EP templates | `lib/episode-plan-v1-templates.js` | Frozen deterministic producer source-of-truth |
| Browser/Node parity cases | `tests/learner-renderer-vnext-videotranscripttest-production.test.js`, `tests/learner-renderer-vnext-browser-registration.test.js` | Ensures bundle and node render parity |

## Diagnostic focus

Track these codes as migration invariants:

- `UNKNOWN_ARCHETYPE_VARIANT`
- `NON_CANONICAL_EPISODE_PLAN_BEAT`
- `DOWNSTREAM_EPISODE_PLAN_OVERWRITE_IGNORED`
- `UNASSIGNED_*` and `MULTIPLY_ASSIGNED_*` families

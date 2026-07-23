# Sprint 69 Notes

## Regression corpus references

- Educational Psychology post-S68 fixture:  
  `tests/fixtures/educational-psychology-post-s68/`
- Certification corpus modules:  
  `lib/learner-renderer-vnext/certification-corpus.js`
- Canonical EP templates:  
  `lib/episode-plan-v1-templates.js`
- Browser/Node parity references:  
  `tests/learner-renderer-vnext-videotranscripttest-production.test.js`,  
  `tests/learner-renderer-vnext-browser-registration.test.js`

## Current known metrics snapshot

- Certification: **CERTIFIED** (6 workflows, 25 activities, 88 moments)
- Capability coverage: text_entry 31, table_entry 18, ordering 1
- Architecture docs test: 13 pass / 0 fail
- Educational Psychology contract regression: pass
- Renderer vNext suite: 476 pass / 0 fail (latest run)

## Important diagnostics already in use

- `UNKNOWN_ARCHETYPE_VARIANT`
- `NON_CANONICAL_EPISODE_PLAN_BEAT`
- `DOWNSTREAM_EPISODE_PLAN_OVERWRITE_IGNORED`
- assignment integrity diagnostics (`UNASSIGNED_*`, `MULTIPLY_ASSIGNED_*`)

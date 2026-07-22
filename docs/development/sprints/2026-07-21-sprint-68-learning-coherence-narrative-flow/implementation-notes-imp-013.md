# S68-IMP-013 — Generic moments composition

## Summary

Replaced A1–A5-specific composition gates with semantic beat-function classification.
All schema-valid activities are now considered for moments composition by default.

## Design

### Page composer (`compose-page-model.js`)

- Removed production dependency on `DEFAULT_MOMENTS_ACTIVITY_IDS`.
- All model activities are composed unless an optional `activityIds` filter is supplied (tests/diagnostics).
- Fallback policy: activities with zero composed moments use `beats-fallback`; partial moment sets are allowed.

### Semantic classification (`compose-moment-classification.js`)

Primary signal: `beat.learnerRole` from the canonical page model.
Secondary signal: `beat.sourceFunction` inventory documented in `beat-function-to-moment-map.json`.

Split policy for mixed Do/Check beats (`check_understanding`, `practice`, `evaluation`):

- Task instructions/materials → Do
- Verify instructions/check materials → Check

### Generic composer (`compose-generic-moments.js`)

- Builds Orient/Learn/Do/Check from classified beats in authored order.
- Interleaves instructions and materials per step within Do/Check moments.
- Attaches `expectedOutput` from check beats when Do beats lack one.

### Workspace routing (`compose-workspace.js`)

- `text_entry`: evidence-based step patterns (`Write`, `Complete the prompt set`, etc.)
- `table_entry`: unchanged — `shouldComposeTableWorkspaceMaterial` for completion tables in Do moments

### Diagnostics

Page: `data-composed-activity-count`, `data-beats-fallback-activity-count`
Activity: `data-render-path="moments"|"beats-fallback"`

## Remaining compatibility specificity

- `sample_output` in Check moments always receives details reveal (type-based, not A1-M3 ID)
- Transfer/reflection beats with `learnerRole: transfer` are omitted from beat rendering when fully consumed by Check
- Reference constants `A1_WRITTEN_RESPONSE_STEP` etc. retained for heteroscedasticity regression tests only

## Verification

```bash
node --test tests/learner-renderer-vnext-generic-moments.test.js
node --test tests/learner-renderer-vnext-compose*.test.js
node scripts/capture-imp-013-generic-moments-artefacts.js
```

# Sprint 70 Testing Strategy

## Mandatory suites (baseline — must stay green)

```bash
node --test tests/sprint-38*.test.js
node --test tests/utility-visual-affordance-hooks.test.js
node --test tests/learner-renderer-vnext*.test.js
node scripts/certify-learner-renderer-vnext.js
```

Sprint 70 must not regress Sprint 38 affordance validation, renderer hooks, or vNext certification.

## New Sprint 70 suites

```bash
node --test tests/visual-affordance-pipeline*.test.js
```

Suggested test files:

| Test file | Coverage |
| --------- | -------- |
| `visual-affordance-pipeline-jobs.test.js` | Job generation count, gate filtering, defer/reject exclusion |
| `visual-affordance-pipeline-prompt.test.js` | Deterministic golden prompts from fixture affordances |
| `visual-affordance-pipeline-filename.test.js` | Filename sanitisation and assignment |
| `visual-affordance-pipeline-assemble.test.js` | Hook → figure insertion, media paths |
| `visual-affordance-pipeline-manifest.test.js` | Manifest schema, ledgers |
| `visual-affordance-pipeline-export.test.js` | End-to-end package structure |

## Fixtures

- Reuse Sprint 38 probe fixtures:  
  `docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/fixtures/probe-38-4-enriched-affordance-example.yaml`
- Add minimal HTML fixture with hooks + affordance ids for assembly tests.
- Golden prompt snapshots stored alongside tests (small text files).

## Validation gates

1. N `generate` affordances → exactly N jobs.
2. Prompt builder: identical input → identical output (run twice).
3. Uploaded asset appears at `media/{filename}` in export.
4. `index.html` img src paths resolve relative to package root.
5. No base64 `data:image` in exported HTML.
6. Defer/reject affordances absent from jobs and figures.
7. Certification remains **CERTIFIED**.

## Manual test checklist

1. Open page with Sprint 38 affordances in authoritative mode.
2. Open Visual Pipeline panel — verify job list.
3. Copy prompt → generate image externally → upload.
4. Replace image — verify filename unchanged, binary updated.
5. Remove image — verify status and export block/partial behaviour.
6. Export package — open `index.html` locally — images visible.
7. Inspect `visual-manifest.json` — jobs and ledgers correct.

## Metrics to track

- visual-affordance-pipeline test pass/fail counts
- certification status (must remain CERTIFIED)
- export package size and asset count vs job count

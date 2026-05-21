# Sprint 29 context files

## Page JSON inputs (Sprint 28 post-5d)

Use composed page sections from:

| File | Probe |
|------|-------|
| [`../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-01-post-5d.md`](../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-01-post-5d.md) | R29-P01 |
| [`../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-02-post-5d.md`](../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-02-post-5d.md) | R29-P02 |
| [`../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-07-post-5d.md`](../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-07-post-5d.md) | R29-P07 |

## Fixtures

| File | Probe |
|------|-------|
| [`../../../tests/fixtures/page-render/renderer-kitchen-sink-page.json`](../../../tests/fixtures/page-render/renderer-kitchen-sink-page.json) | R29-P09 |
| [`../../../tests/fixtures/page-render/ld-climate-misconception-discussion-page.json`](../../../tests/fixtures/page-render/ld-climate-misconception-discussion-page.json) | Pre-S28 baseline (optional) |

## 29-1 HTML capture (complete)

| File | Probe |
|------|-------|
| [`r29-p01-html-capture.md`](r29-p01-html-capture.md) | R29-P01 |
| [`r29-p02-html-capture.md`](r29-p02-html-capture.md) | R29-P02 |
| [`r29-p07-html-capture.md`](r29-p07-html-capture.md) | R29-P07 |

**Runner:** [`29-1-html-capture-runner.js`](29-1-html-capture-runner.js) — reads [`28-5d-stabilisation-capture.json`](../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/28-5d-stabilisation-capture.json); writes summary [`29-1-html-capture-summary.json`](29-1-html-capture-summary.json).

Regenerate from repo root:

```bash
node docs/development/sprints/2026-05-21-sprint-29-renderer-cognition-semantics/context-files/29-1-html-capture-runner.js
```

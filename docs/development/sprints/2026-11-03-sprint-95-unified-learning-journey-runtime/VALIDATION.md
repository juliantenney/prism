# Sprint 95 — Validation ledger

**Sprint:** 95 — Unified Learning Journey Runtime  
**Status:** **OPEN** — M1 ready; not started

## Planned evidence

| Evidence | Expected |
| -------- | -------- |
| M1 mount/unmount/remount | Assessment Pack fragment mounts into a container; dispose clears listeners; remount restores draft text |
| M1 no duplicate handlers | Second mount after dispose does not double-fire assessment/draft handlers |
| M1 standalone lock | Existing `s93-assessment-pack-learner-render` and `s93-assessment-pack-response-persistence` remain green; standalone export still auto-boots |
| M1 LJ publish unchanged | `s91-learning-journey-learner-package` / home suites remain green with no intentional publish behaviour change |
| M2 shell a11y | Single `<main>`; focus + live announcement on resource change; TOC keyboard operable |
| M3 artefact handoff | C5 judgement appears read-only in C6 when present; missing-input notice when absent; no scoring |
| Multi-doc ZIP | Remains available and tested until an accepted superseding path is recorded |

## Recorded evidence

| Date | Evidence | Result |
| ---- | -------- | ------ |
| 2026-11-03 | Sprint open / documentation only | No Sprint 95 production code |
| 2026-11-03 | Predecessor Sprint 94 WP6 regressions (closure verification) | 139 passed + 29 adjacent — baseline for M1 non-regression |

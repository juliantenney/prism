# Sprint 34-2 — Scenario heading preservation

**Date:** 2026-06-03  
**Outcome:** `node --test tests/*.test.js` → **587 pass / 0 fail**

## Change

`resolveScenarioCardLabel` in `renderScenarioBlocks` now reads `entry.heading` (before label/title/name/scenario_title). Object-path `rawTitle` uses the same field order.

## Tests

- `utility-marx-self-study-design-quality.test.js` — `Factory Scenario` restored
- `utility-markdown-bullet.test.js` — singular `materials.scenario` + `scenarios[]` fallback

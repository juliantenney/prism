# Sprint 42 — Slice 42-3: Activity-Level Authorial Exposition

**Date:** 2026-06-11  
**Type:** DLA prompt contract (generation guidance only)  
**Scope:** `activity_preamble` on Design Learning Activities for learner-facing page workflows

## Problem

Slice 42-1 audit and validation runs showed that mandatory `activity_preamble` fields often read as **procedural stage directions** (“Study the model row…”, “Complete the table…”) rather than **explanatory educational prose**. Slice 42-2 improved Design Page compose voice; Slice 42-3 targets **DLA source generation** so teachable preambles reach Design Page upstream.

## Solution

New module `lib/ld-activity-preamble-exposition.js` with marker `LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT (auto-applied)`, wired on **Design Learning Activities** only when `shouldApplyLearnerPagePedagogicFramingScaffold` is true.

### Constraints honoured

- No new fields, schema, workflow stages, or EQF dimensions
- Existing `activity_preamble` key only
- Design Page compose contract unchanged (42-2)
- Renderer unchanged

## Files changed

| File | Change |
| ---- | ------ |
| `lib/ld-activity-preamble-exposition.js` | New DLA contract + diagnostic heuristic |
| `app.js` | Resolver, apply hook, OUTPUT CONTRACT / framing line updates, example JSON preamble |
| `index.html` | Load `ld-authorial-exposition.js` (42-2 browser gap) + `ld-activity-preamble-exposition.js` |
| `tests/prism-vm-lib-bootstrap.js` | Register new lib |
| `tests/ld-activity-preamble-exposition.test.js` | Lib unit tests |
| `tests/workflow-learner-page-preamble-exposition.test.js` | DLA pipeline + idempotency |
| `tests/fixtures/page-render/marx-self-study-page.json` | Validation artefact — narrative preambles |
| `captures/sprint-42-exposition/marx-preamble-before-after.json` | Before/after capture |

## Prompt changes (summary)

1. **New block** — five authorial purposes, prefer/avoid lists, Marx-themed bad/good exemplars.
2. **`buildSelfDirectedLearnerPageActivityFramingPromptBlock`** — preamble must be explanatory prose; anti-procedural opener rule.
3. **`buildLearnerPageDlaOutputContractOverrideBlock`** — preamble definition upgraded to narrative/significance language.
4. **`buildSelfDirectedLearnerPageDlaOutputContractExampleBlock`** — authoritative JSON example uses narrative preamble (not “Before you read the extracts…”).

## Before / after (Marx A2)

**Before (procedural):**

> Study the model row before completing the full comparison table.

**After (explanatory):**

> Comparing two major works is not the same as summarising them: each text was written for a different purpose and audience. Before you complete the full table, notice how a modelled row names the author's aim and a defensible contrast — that move is what makes comparison evidence-based rather than descriptive.

**learner_task** (unchanged — actions stay in task):

> Read the worked example, then write one sentence stating what makes the difference column defensible (not a plot summary).

## Validation audit (Marx benchmark fixture)

| Check | Pre-42-3 | Post-42-3 fixture |
| ----- | -------- | ------------------- |
| Preamble coverage | 3/3 | 3/3 |
| Procedural openings | 3/3 (A2, A3, A4) | 0/3 |
| `meetsAuthorialExposition` heuristic | false | true |
| Preamble ↔ learner_task duplication | Low | Low (preamble teaches; task instructs) |
| Narrative progression | Scaffolding labels | Significance → comparison → application arc |

Full before/after strings: `captures/sprint-42-exposition/marx-preamble-before-after.json`.

## Test commands

```bash
node --test tests/ld-activity-preamble-exposition.test.js
node --test tests/workflow-learner-page-preamble-exposition.test.js
node --test tests/workflow-self-directed-activity-framing-adoption.test.js
node --test tests/workflow-learner-page-authorial-exposition.test.js
node --test tests/utility-marx-page-render.test.js
```

## Next slice (42-4)

- Live workflow before/after captures
- Optional exposition diagnostic CLI (non-blocking)
- EQF regression check on updated Marx fixture

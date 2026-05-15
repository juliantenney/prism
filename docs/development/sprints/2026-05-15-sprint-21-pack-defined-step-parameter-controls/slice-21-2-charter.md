# Sprint 21 Slice 21-2 — Grouping, visibility, and Settings polish

**Date:** 2026-05-15  
**Status:** **Closed**  
**Sprint:** 21 — Pack-defined Step Parameter Controls  
**Slice:** 21-2

**Predecessor:** [`slice-21-1-closeout.md`](slice-21-1-closeout.md) — **145 tests**; generic pack parameter renderer MVP

---

## Objective

Make pack-defined parameter controls **scale cleanly** in Workflow step Settings now that Slice 21-1 made them editable — through visibility, basic/advanced grouping, optional section labels, and summary label polish.

**Thesis:** *Metadata-driven grouping only; no per-param UI branches.*

---

## Scope

| # | Item | Acceptance |
|---|------|------------|
| 1 | **`visible: false`** | No render; no duplicate `userOptions`; persisted `[PRISM_STEP_PARAMS]` values untouched |
| 2 | **Basic / advanced grouping** | `advanced: false` or omitted → Basic; `advanced: true` → Advanced; Advanced collapsed by default; Basic expanded |
| 3 | **Optional `group`** | Section label when set; else Basic / Advanced fallback |
| 4 | **Summary labels** | Prefer pack `label` when control exists; keep `humanizeWorkflowSettingsParamKey` fallback |
| 5 | **LD pilot (optional)** | Small number of obvious `settings-only` controls for existing mapped `stepParams` only |

---

## Non-goals

- Provenance redesign; explicit override provenance tier
- Pack validation framework; Research adoption; metadata versioning
- Migration away from legacy `userOptions`
- Prompt Studio; renderer rewrite; new wizard questions
- `applyWorkflowBriefMappings` changes

---

## Constraints

- Runtime branches on **metadata / controlType / grouping** only
- Preserve workflow-mode Prompt Factory UX adjunct
- Preserve `[PRISM_STEP_PARAMS]` persistence
- Preserve standalone Prompt Factory behaviour

---

## Verification

```bash
node --test tests/*.test.js
```

**Expected:** **145+** passed, 0 failed

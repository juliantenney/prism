# Sprint 22 — context-files (placeholder)

**Pack path:** `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/context-files/`

This folder holds **bounded snapshots** for fresh-chat upload — **not** canonical replacements for live repo paths.

## When to add files

Add copies here when chartering implementation slices (e.g. Slice 22-1), typically:

| Snapshot | Purpose |
|----------|---------|
| Short `current-state.md` excerpt | Test floor + sprint phase |
| Key `app.js` helper signatures | Aggregation/render entry points (excerpt only) |
| LD pack `stepParameterControls` excerpt | Metadata reference |
| Sprint 21 renderer notes | Reuse contract reminder |

## Rules

- Keep files **minimal** — pointers and excerpts, not full `app.js` or pack dumps unless a slice explicitly requires it.  
- Prefer **live repo paths** when implementing: `app.js`, `domains/learning-design/domain-learning-design-step-patterns.md`.  
- Do **not** treat this folder as authoritative over consolidation closeouts or the sprint pack root.

## Authoritative bootstrap

Use [`../GPT-bootstrap-sprint-22.md`](../GPT-bootstrap-sprint-22.md) to restore Sprint 22 in a new chat.

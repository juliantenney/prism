# Sprint 66 — Findings Log

| ID | Date | Finding | Severity | Status |
| -- | ---- | ------- | -------- | ------ |
| S66-F01 | 2026-07-16 | Sprint 65 closed without production change; renderer work must start from fresh live inputs | High | **Settled inheritance** — SPRINT-65-CLOSURE |
| S66-F02 | 2026-07-17 | Learner-facing beat association is split across compose heuristics and registry diagnostics (dual planner) | High | **Settled** — drives S66-D09/D10 |
| S66-F03 | 2026-07-17 | Material/step assignment uses English scoring and soft fixture coupling rather than declarative rules | High | **Settled** |
| S66-F04 | 2026-07-17 | Empty episode-plan beats (e.g. orientation without prompts/materials) still emit empty `.util-beat-section` | High | **Settled** — omit-empty in vNext model |
| S66-F05 | 2026-07-17 | Global `orientation → Reflect` mislabels study-bearing orientations (e.g. A5 criteria text) | High | **Settled** — role-based labels in vNext |
| S66-F06 | 2026-07-17 | Authored learner-task order can require material order different from `materials[]` array order | Medium | **Settled** — declarative materialOrder in archetype rules |
| S66-F07 | 2026-07-17 | Post-render expected-output insertion and consumption flags are incompatible with a single canonical model | High | **Settled** — expected output owned in model |
| S66-F08 | 2026-07-17 | Further in-place legacy patches increase brittleness; rewrite boundary is required | High | **Settled** — Sprint 67 |

Add no further Sprint 66 findings after pause unless correcting the historical record.

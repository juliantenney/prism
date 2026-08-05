# Sprint 72 — Productising the Instructional Architecture Validated in Sprint 71

**Status:** **OPEN / IN PROGRESS** (implementation underway; evidence-centred slice implemented; final verification/commit pending)  
**Type:** Implementation successor to Sprint 71 (evaluation → productisation)  
**Success criteria:** Accepted (`S72-D07`)  
**Portable pack:** [docs/development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-START-HERE.md)

## Theme

Embed validated Sprint 71 principles so high-quality instructional design is produced by default; authors are asked only for information the system genuinely needs; and discipline-specific evidence can be supplied and retained where Prism must not invent it.

## Sprint 72 purpose (authoritative)

Prove Prism can produce evidence-centred learning activities from sparse briefs **without** introducing a new pipeline stage, new page type, or complex evidence architecture.

Governing principle: **“Make activities use evidence for reasoning.”**

## Current implementation snapshot

- Activity-level evidence design implemented (selective per activity; provider/response separation; separate-provider and combined-evidence-workspace layouts).
- DLA/GAM evidence contracts and diagnostics implemented, including simulated provenance (`system_generated_simulation`) and source-bound provenance (`conversation_attachment`) boundaries.
- Bridge semantics correction implemented (every activity requires preamble + bridge, distinct semantics for A1 vs A2+); reported 73/73 related tests passing.
- Learner-page presentation refinement implemented (orientation divider, table wrapping/column sizing fixes, Check→Transfer ordering, template prompt specificity); reported 118/118 related tests passing.
- Source-bound uploaded-byte ingestion/storage remains intentionally out of scope in this slice (`S72-D10`).
- Working tree currently contains uncommitted implementation and test changes; sprint docs treat this state explicitly as uncommitted pending final verification and commit.

## Priority order

1. Platform / system instructional architecture  
2. Workflow elicitation  
3. Author-supplied evidence  
4. Product / UX  
5. Raise the ceiling (~90–91 → aspirational 95–98)

## Authoritative opening docs

- [SPRINT-72-START-HERE.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-START-HERE.md)  
- [SPRINT-72-CHARTER.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-CHARTER.md)  
- [HANDOVER.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/HANDOVER.md)  
- [findings-traceability.md](../development/sprints/2026-07-31-sprint-72-productising-instructional-architecture/findings-traceability.md)

## Predecessor

Sprint 71 — **Closed**: [sprint-71-closeout.md](sprint-71-closeout.md)

# Sprint 72 — Handover

**From:** Sprint 71 (COMPLETE / Closed 2026-07-31)  
**To:** Sprint 72 implementation sessions  
**Pack opened:** 2026-07-31  
**Implementation:** Not started at pack open

---

## Current state (2026-08-05)

- Sprint 72 implementation is now substantially progressed.
- Evidence-centred activity architecture is implemented in the existing activity-oriented pipeline.
- Simulated evidence (`system_generated_simulation`) and source-bound conversation-attachment evidence (`conversation_attachment`) routes are implemented.
- Bridge and learner-page presentation refinements are implemented but currently uncommitted in the working tree.
- Immediate next task is `S72-T-073` (rerender and inspect Owen), then focused QA if needed, then commit the verified slice.

---

## Concise predecessor outcome

Sprint 71 proved instructional quality is **steerable** through pedagogically informed workflow guidance and attributed recurring gaps to pipeline stages. It froze a three-layer responsibility model and candidate architectural principles. Residual Critical limits often = **evidence availability**. Diagnostic feedback remains a High platform gap. Semantic headings remain open. See [SPRINT-71-FINAL-REPORT.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-FINAL-REPORT.md).

---

## Binding Sprint 71 evidence and decisions

| Kind | Authority |
| ---- | --------- |
| Final report | [SPRINT-71-FINAL-REPORT.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-FINAL-REPORT.md) |
| Closure | [SPRINT-71-CLOSURE.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-CLOSURE.md) |
| Design principles | [design-principles.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/design-principles.md) |
| Synthesis | [cross-resource-synthesis.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/cross-resource-synthesis.md) |
| Improvement Register | [improvement-register.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/improvement-register.md) |
| Reviews | `S71-R-001` … `S71-R-011` |
| Attribution map | [learning-design-pipeline-attribution-map.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/learning-design-pipeline-attribution-map.md) |
| S71 decisions | [decisions.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/decisions.md) |
| S70 method (`S70-D01`…`S70-D10`) | [SPRINT-70-CLOSURE.md](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-CLOSURE.md) |

Sprint 72 opening decisions (priority order, three-layer routing, elicitation authorised): [decisions.md](decisions.md).

---

## Unresolved carry-forwards (high signal)

| ID | Summary | Likely S72 destination |
| -- | ------- | ---------------------- |
| `S71-F-001` | Evidence sufficiency / availability (Critical) | Dual-routed: **A** instructional (primary) → **B** elicitation → **C** author supply |
| `S71-F-002` | Diagnostic feedback (High, Confirmed) | A — Design Feedback / related |
| `S71-F-004` / `005` / `009` | Uncertainty / competing interpretations / ambiguous evidence | A (platform) ± B |
| `S71-F-007` | Source / evidence evaluation (discipline-appropriate) | A |
| `S71-F-014` | Disciplinary representation (e.g. code) | A + D (`S72-B-003`) |
| `S71-F-015` | Pedagogical timing of representations | A |
| `S71-O-005` | Semantic heading hierarchy | D |
| `S71-O-006` | Steerability / three-layer insight | Architecture — informs all layers |
| `S71-O-001` | Long-title abbreviation | D (`S72-B-005`) |
| Operator | Image consistency / persistence | D (`S72-B-001`, `S72-B-002`) |

Full categorisation: [findings-traceability.md](findings-traceability.md).

---

## Sprint 72 priority order

1. Platform instructional architecture  
2. Workflow elicitation  
3. Author-supplied evidence  
4. Product / UX  
5. Raise the ceiling  

---

## Roadmap (ordered)

1. Platform instructional architecture  
2. Workflow elicitation redesign  
3. Evidence architecture  
4. Product / UX  
5. Raise ~90–91 → aspirational 95–98  

Dependency chain: evidence → classify → Layer 1 → Layer 2 → Layer 3 → regenerate → Benchmark + Validation → refine ceiling.

---

## Immediate recommended sequence

1. Re-render Owen after bridge and presentation refinements.
2. Inspect learner-facing output.
3. Run focused QA if needed.
4. Commit the verified Sprint 72 slice.
5. Continue deferred backlog only after demo-day verification.

---

## Risks and dependencies

| Risk | Mitigation |
| ---- | ---------- |
| Collapsing into “prompt improvement” | Enforce three-layer routing in every task (`S72-D01`) |
| Overcommitting full roadmap | Use committed / stretch / discovery / deferred labels in PLAN |
| Score-chasing | Validation loop requires dimension + regression checks |
| Layer-3 evidence blocked by missing storage UX | Spec architecture early (Phase 4) even if implementation is stretch |
| Image persistence blocked by storage design | Document path before optional implementation |
| Specialist renderers scope creep | Architecture path only unless capacity + evidence support thin slice |
| Editing Sprint 71 evidence | Hard rule: link only |

---

## What not to do

- Do not reopen Sprint 71  
- Do not modify Sprint 71 evidence files  
- Do not invent Sprint 71 IDs  
- Do not treat Partial recurrence as Confirmed recurrence  
- Do not assume all issues are prompt issues  
- Do not imply authors should write longer prompts  
- Do not open Sprint 72 closure / final report prematurely  
- Distinguish implemented-but-uncommitted work from committed baseline state  

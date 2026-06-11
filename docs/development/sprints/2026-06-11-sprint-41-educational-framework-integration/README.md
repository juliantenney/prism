# Sprint 41: Educational Framework Integration

**Status: Closed (implementation complete)**

## Purpose

Sprint 41 integrated the Sprint 40 Educational Quality Framework into PRISM generation workflows and completed learner-framing integration for all learner-facing pages.

## Sprint objective

Integrate the Educational Quality Framework so generated resources more consistently support understanding, capability, judgement, independence, metacognition, learning success, and progressive independence.

## Slices delivered

| Slice | Deliverable |
| ----- | ----------- |
| 1 | EQF prompt foundation (`lib/educational-quality-framework-prompt.js`) |
| 2 | Step-specific manifestation guidance |
| 3 | EQF evaluator (`lib/educational-quality-framework-evaluator.js`) |
| 4 | Diagnostics tooling (`tools/evaluate-educational-quality-framework.js`) |
| 5 | Delivery-mode-independent learner framing |
| 5 follow-up | Design Page preservation repair |
| 5 finalisation | Mandatory learner framing at DLA |

## Closure and handover

| Document | Role |
| -------- | ---- |
| [`sprint-41-closure-report.md`](sprint-41-closure-report.md) | **Authoritative closure report** |
| [`handover-from-sprint-41.md`](handover-from-sprint-41.md) | Sprint 42 entry point |
| [`sprint-41-validation-report.md`](sprint-41-validation-report.md) | Validation phase evidence |
| [`sprint-41-framework-impact-report.md`](sprint-41-framework-impact-report.md) | Impact validation (captures pending) |
| [`educational-quality-diagnostics.md`](educational-quality-diagnostics.md) | CLI usage |

## Principal conclusion

The educational architecture is functioning well. The primary remaining weakness is **learner-facing exposition** (narrative flow, explanatory depth, publication-quality prose), not workflow structure, alignment, sequencing, judgement, transfer, or metacognitive support.

**EQF and PEL/learner framing integration are complete.** No further framework architecture work is currently recommended.

## Recommended next sprint

**Sprint 42 — Authorial Quality / Educational Exposition**

See [`handover-from-sprint-41.md`](handover-from-sprint-41.md).

## Framework source documents

- `docs/educational design/framework/north-star.md`
- `docs/educational design/framework/educational-quality-framework.md`
- `docs/educational design/framework/educational-prompting-guide.md`
- `docs/educational design/framework/framework-overview.md`

## Implementation reference

- [`implementation-start-points.md`](implementation-start-points.md) — post-closure file map
- [`source-documents.md`](source-documents.md) — authoritative paths and modules
- [`context-files/`](context-files/) — Sprint working extracts

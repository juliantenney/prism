# Sprint 42: Authorial Quality / Educational Exposition

**Status:** In progress — through Slice 42-10 (investigations + selective implementation)

**Resume here:** [`handover-from-sprint-41.md`](handover-from-sprint-41.md) → **Current Position**

## Purpose

Sprint 41 completed educational architecture integration: EQF prompt contracts, learner-framing pipeline, Design Page preservation, and mandatory DLA orientation fields. Sprint 42 addresses the **remaining quality gap** — learner resources that are structurally sound but **read as assembled rather than authored**.

Investigations through 42-8 established that upstream journey and pedagogy exist; the primary weakness is **Design Page composition** — activity-centred assembly rather than resource-centred investigation. Sprint 42-10 ensured both topic and source-ingest routes produce `learning_content` before Model Knowledge.

## Starting hypothesis (refined)

PRISM can now generate coherent learner journeys, judgement tasks, transfer cues, metacognitive framing, and learner-facing activity scaffolds. The primary weakness is **not** missing workflow stages, upstream journey, or materials fidelity — it is **how Design Page composes** upstream signals into a learner-facing resource.

## Sprint objective

Improve how final learner pages **read** while **preserving** the educational structure Sprint 40–41 established.

Target outcomes:

- Richer learner-facing prose
- Explanatory depth (orientation that teaches, not only cues)
- Conceptual narrative across the page
- Smoother transitions between activities
- Publication-ready learning resource quality
- Better integration of `activity_preamble` and cognition cues into readable prose
- Preserved framing fields and activity contracts — improved **voice**, not new schema

## Working assumption

Implementation is expected to be **primarily prompt-architecture and compose-guidance work** on DLA, Design Page, and possibly page-level rhetoric — not renderer redesign, new workflow steps, or framework expansion.

## Explicitly out of scope (unless later agreed)

- New EQF dimensions or framework discovery
- New workflow steps
- Schema redesign
- Renderer structural redesign
- GAM structural redesign
- Further PEL/EQF architecture work

## Handover pack

| Document | Role |
| -------- | ---- |
| [`handover-from-sprint-41.md`](handover-from-sprint-41.md) | **Entry point** — Current Position, findings through 42-10, next investigation |
| [`source-documents.md`](source-documents.md) | Authoritative paths, modules, fixtures, prior sprint references |
| [`implementation-start-points.md`](implementation-start-points.md) | Historical implementation surfaces (superseded by Current Position for next work) |
| [`sprint-42-slice-10-source-ingest-learning-content-parity.md`](sprint-42-slice-10-source-ingest-learning-content-parity.md) | 42-10 implementation record |

## Prior sprint closure (source of truth)

- [`../2026-06-11-sprint-41-educational-framework-integration/sprint-41-closure-report.md`](../2026-06-11-sprint-41-educational-framework-integration/sprint-41-closure-report.md)
- [`../2026-06-11-sprint-41-educational-framework-integration/handover-from-sprint-41.md`](../2026-06-11-sprint-41-educational-framework-integration/handover-from-sprint-41.md)

## Benchmark workflows (validation reference)

| Workflow | Fixture | Sprint 41 EQF baseline | Exposition focus |
| -------- | ------- | ---------------------- | ---------------- |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` | 7/8 | Strong structure — prose baseline for “authored” target |
| Inflation workshop | `tests/fixtures/page-render/ld-inflation-workshop-page.json` | 5/8 | Session-shaped — transition and wrapper prose |
| Marx / climate workshop | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | 5/8 | Discussion framing readability |

## Next work (post 42-10)

Investigate how Design Page can use `learning_content` as a stronger organising spine (**Question → Explanation → Investigation → Judgement → Reflection**) without new schemas, workflow stages, or renderer changes. Prefer fresh manual workflow runs over harness captures for learner-experience judgements.

## Key principle

Preserve cognitive activity and educational structure. Improve **how** the learner reads and follows the journey — not **whether** the journey exists.

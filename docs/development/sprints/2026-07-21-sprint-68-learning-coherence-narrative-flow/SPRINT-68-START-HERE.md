# Sprint 68 — START HERE

**Learning Coherence and Narrative Flow**

**Document role:** Reading order for a fresh conversation. Authoritative scope: [SPRINT-68-CHARTER.md](SPRINT-68-CHARTER.md) · [canonical charter](../../../sprints/sprint-68-learning-coherence-narrative-flow.md).

## Status

- **Sprint:** 68 — **Chartered / planning complete** (2026-07-21)
- **Predecessor:** Sprint 67 **Closed** — vNext renderer functionally complete
- **Nature:** Learner experience and pedagogical coherence (not a renderer rewrite)
- **Do not:** redesign navigation, layout, Sprint 67 CSS, semantic iconography, or export architecture in this sprint

---

## Read in this order

1. [next-chat-briefing.md](next-chat-briefing.md) (paste into new chat)
2. [HANDOVER.md](HANDOVER.md)
3. [SPRINT-68-CHARTER.md](SPRINT-68-CHARTER.md)
4. [context/README.md](context/README.md)
5. [sprint-summary.md](sprint-summary.md) · [backlog.md](backlog.md) · [investigation-log.md](investigation-log.md)
6. Sprint 67 close: [SPRINT-67-CLOSURE.md](../2026-07-17-sprint-67-learner-renderer-vnext/SPRINT-67-CLOSURE.md)
7. vNext model reference: [`lib/learner-renderer-vnext/MODEL_REVIEW.md`](../../../../lib/learner-renderer-vnext/MODEL_REVIEW.md)

---

## Guiding principle

> Improve the learner experience using authoritative lesson data before extending the lesson schema.

Exhaust renderer-first improvements from the existing page model before proposing schema enhancements.

## Architectural principle (inherited)

> **The renderer renders. The pipeline authors.**

The learner renderer is a deterministic presentation layer. It faithfully renders authoritative pedagogical information from the lesson model. It does not invent instructional content, narrative transitions, conceptual relationships or pedagogical scaffolding absent from the lesson model.

## Dual purpose

1. Improve learner coherence where existing authoritative data supports it
2. Validate the pipeline/renderer boundary — document where limitations are lesson-model or pipeline gaps, not renderer gaps

## Immediate next task

**S68-BL-001** — Investigate activity-to-activity bridging: locate authoritative bridge content, determine why only one `intellectual_coherence_bridge` appears, and whether it is misplaced inside Activity 5 rather than functioning as an inter-activity transition.

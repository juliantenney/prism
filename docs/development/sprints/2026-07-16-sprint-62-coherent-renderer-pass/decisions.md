# Sprint 62 — Decisions

**Updated:** 2026-07-16 (minimum learner-journey presentation slice)

---

## S62-D01 — Open Sprint 62 as renderer coherence pass

**Decision:** Open Sprint 62 — Coherent Renderer Pass as a presentation-only sprint focused on learner-facing coherence.

**Date:** 2026-07-16

---

## S62-D02 — Preserve educational architecture

**Decision:** Sprint 62 must not change DLA, GAM, archetype logic, assessment generation, persistence, assembly, or architecture.

**Date:** 2026-07-16

---

## S62-D03 — Render for the learner, not the schema

**Decision:** Prioritise learner-facing narrative flow over schema-facing labels. Remove/replace wrappers that expose internal structure without pedagogical value.

**Date:** 2026-07-16

---

**Date:** 2026-07-16

---

## S62-D04 — Frozen acceptance evidence page set

**Decision:** Adopt the four-page baseline in [acceptance-evidence-pages.md](acceptance-evidence-pages.md) as the authoritative Sprint 62 renderer coherence acceptance set:

| ID | Category | Fixture |
| -- | -------- | ------- |
| S62-EV-01 | Classification | `ld-inflation-workshop-page-full.json` (A1) |
| S62-EV-02 | Evaluation / judgement | `marx-beat-render-page.json` (A4) |
| S62-EV-03 | Worked-example-led | `marx-self-study-page.json` (A2) |
| S62-EV-04 | Transfer challenge | `marx-beat-render-page.json` (A5) |

All Sprint 62 renderer changes are evaluated against before/after snapshots on this set. Optional breadth check: `renderer-kitchen-sink-page.json` (non-blocking).

**Rationale:** Representative instructional behaviours from existing project fixtures; avoids ad-hoc page selection per change.

**Date:** 2026-07-16

---

## S62-D05 — Presentation may reorganise existing meaning only

**Decision:** Sprint 62 may reorganise, relabel, and deduplicate existing meaning, but must not invent new instructional meaning (no generated goals, criteria, closure copy, or body-derived contextual labels).

**Date:** 2026-07-16

---

## S62-D06 — Learner journey is a presentation direction, not a schema

**Decision:** Adopt Frame → Understand → [Model] → Apply → Verify → Complete (+ optional Transfer) as a **renderer presentation direction**. Do not add schema fields or planning beats for this contract in Sprint 62.

**Date:** 2026-07-16

---

## S62-D07 — Minimum learner-journey presentation slice rules

**Decision:** Ship the A2-primary presentation slice with:

1. Fixed beat-function → learner-facing label map; unknown functions fall back to structural `episodeFunctionLabel`.
2. Conservative goal-shaped `learner_task` gate; inventory tasks keep “What to do”.
3. Promote checklist/`expected_output` into “Success looks like” without paraphrasing; suppress trailing Output only on deterministic equivalence.
4. Checklist remains in Verify.
5. Suppress material titles only for the explicit RNA fixture pattern `S## RNA A#-M# …`.
6. Preserve authored Transfer order (do not move Transfer after Verify in this slice).
7. Output “checklist restatement” suppression uses a **tight** pattern (`… verified with/against the checklist`) so substantive deliverables that merely mention a checklist remain visible (promoted into Success looks like).

Full rules: [learner-journey-presentation-slice.md](learner-journey-presentation-slice.md).

**Date:** 2026-07-16

---

## S62-D08 — Close Sprint 62; open Sprint 63 as discovery

**Decision:** Close Sprint 62 as successful and complete (PASS). Open Sprint 63 — Cognitive Flow & Reasoning Visibility as a **discovery and architecture** sprint (not schema redesign). No further Sprint 62 implementation work.

**Date:** 2026-07-16

---

## Closed

Sprint 62 decision log is complete. Successor: [Sprint 63 charter](../../../sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md).

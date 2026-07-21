# Sprint 67 — Heteroscedasticity vNext Field Coverage Audit

Fixture: `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json`

| Field / region | Status | Notes |
|---|---|---|
| **Page title** | Rendered directly | `<h1>` in export sticky header |
| **Duration** | Rendered through transformation | Summed from activity durations → header meta |
| **Overview** | Rendered directly | Orientation section; duplicate `## Overview` stripped at model build |
| **Learning purpose** | Rendered directly | Orientation section; duplicate heading stripped |
| **Knowledge summary** | Rendered directly | Orientation section; duplicate heading stripped |
| **Learning outcomes LO1–LO5** | Rendered directly | New orientation subsection with numbered list |
| **Study tips** | Rendered directly | Aside region; duplicate `## Study tips` stripped |
| **Progression guidance** | Rendered directly | `learning_sequence.navigation_guidance.progression_logic` |
| **Activity ID / title** | Rendered directly | Activity header + journey nav `#activity-A*` |
| **Grouping / duration badges** | Rendered directly | Activity header badges |
| **Mapped learning outcomes** | Rendered directly | `Supports LO*` at activity level |
| **Activity preamble** | Rendered directly | Activity framing |
| **Reasoning orientation** | Rendered directly | Semantic `util-pedagogical-guidance--reasoning-orientation` |
| **Learner-task instructions** | Rendered through transformation | Interleaved via `contentSequence` (1:1 with materials, then expected output) |
| **Expected output** | Rendered directly | Follows final instruction in owning beat |
| **Pedagogical prompts** | Rendered directly | Beat-level prompts with labels + `data-guidance-type` |
| **Episode beats / materials** | Rendered directly | Archetype assignment unchanged; all realised materials once |
| **Assessment stem / options** | Rendered directly | Formative MCQ list |
| **Correct answer / rationale** | Rendered directly | `<details class="util-assessment-feedback">` |
| **Related assessment outcomes** | Rendered directly | Inside feedback block when present |
| **Ordered activities** | Rendered directly | `learning_sequence.ordered_activity_ids` |
| **Timeline per-activity purpose** | Intentionally excluded | Duplicates `activity_preamble`; authoring/planning overlap |
| **Study flow phases** | Intentionally excluded | Redundant with activity sequence + progression guidance |
| **required_materials[]** | Intentionally excluded | Authoring specifications; rendered body comes from `materials[]` |
| **assembly_state / metadata / constraints** | Intentionally excluded | Authoring metadata |
| **Assessment item_id / difficulty / topic** | Intentionally excluded | Internal generation metadata |
| **Archetype names / beat functions (visible)** | Intentionally excluded | `data-beat-function` metadata only; learner labels shown |

## Remaining gaps (deferred to next sprint)

- Per-beat journey navigation (explicitly out of scope)
- Timeline phase labels as learner-facing progression cards
- Final visual polish for pedagogical guidance components
- Rich markdown rendering for short prompt fields (currently lightweight markdown)

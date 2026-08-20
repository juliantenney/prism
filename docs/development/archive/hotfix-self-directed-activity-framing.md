# Self-directed learner-page activity framing (hotfix)

**Date:** 2026-05-21  
**Evidence:** Regenerated Marx self-study page — activities jump straight to “What to do”, materials, and tables with minimal orientation.

---

## Investigation summary

| Question | Finding |
|----------|---------|
| Hidden renderer fields? | **`activity_preamble` and related fields were not in use** — not omitted by renderer. Sprint 28 cognition fields (`self_explanation_prompt`, `transfer_or_application_task`, `scaffold_hint_sequence`) were **not rendered** on the learner-page activity path (only revision/repair/uncertainty/transformation groups existed). |
| Can DLA generate preambles? | **Yes** — activities already support free-form string fields; DLA can populate `activity_preamble` and optional cognition-orientation fields without new workflow steps. |
| Map to Sprint 28 semantics? | **Yes** — preambles carry prior-knowledge activation and reasoning orientation; optional `self_explanation_prompt`, `uncertainty_tension_prompt`, `transfer_or_application_task`, and `scaffold_hint_sequence` surface cognition semantics when populated. |
| Auto for self-directed pages? | **Yes** — same gate as material-shape scaffold: `delivery_context` self-directed/async + learner-page output signals on **Design Learning Activities**. |

---

## Why activity framing was added

Self-directed pages need short pedagogic orientation before task instructions. Without it, learners face abrupt templates and checklists, higher cognitive load, and no visible link to Sprint 28 cognition-oriented design.

---

## Relationship to Sprint 28 cognition surfacing

Sprint 28 cognition packs often stay inactive on ordinary briefs (no `cognitive_engagement_required`). This hotfix:

1. **Prompts DLA** to populate `activity_preamble` and light cognition-orientation fields on every substantial self-directed activity.
2. **Renders** those fields when present — including `self_explanation_prompt`, `transfer_or_application_task`, and `scaffold_hint_sequence` — using existing `util-cognition*` presentation (no new Sprint 29 scope).

Generation remains authoritative (generation-level change only); the renderer does not invent prose.

---

## Implementation (bounded)

| Layer | Change |
|-------|--------|
| **DLA** | `buildSelfDirectedLearnerPageActivityFramingPromptBlock()` appended via `applyPedagogicCognitionContractScaffoldToDraft` for self-directed learner-page DLA runs. |
| **Renderer** | `renderActivityFramingForActivity()` — displays `activity_preamble` (and aliases) before “What to do”; extended cognition render groups for self-study fields. |
| **Out of scope** | New workflow steps, tutoring layer, renderer-generated copy, Design Page pedagogy rewrite. |

---

## Tests

- `tests/utility-self-directed-activity-framing.test.js`
- `tests/fixtures/page-render/self-directed-activity-framing-page.json`
- Adoption follow-up: `tests/workflow-self-directed-activity-framing-adoption.test.js`, `hotfix-self-directed-activity-framing-adoption.md`

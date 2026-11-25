# Sprint 105 — Architectural Debt & Confirmed Defects Ledger

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Updated:** 2026-11-25 (Phase 105A)

---

## Confirmed defects addressed in Sprint 105

| ID | Location | Defect | Target Milestone |
| -- | -------- | ------ | ---------------- |
| `S105-AD-001` | `app.js:7845–7985`, `lib/learning-journey-sibling-prompts.js`, `lib/learning-journey-design-page.js` | Monolithic Step 5 LJ Design Page capture following ~14,000-word conversational Step 4 prose hits model output-length limits; Steps 1–4 lack validated structured stage capture and deterministic final assembly | Milestones 1–3 |
| `S105-AD-002` | `app.js:42117–42128` → `domains/learning-design/domain-learning-design-step-patterns.md:2696–2697` | Generic Interactive `step_design_page` `Runner guidance` (`page_synthesis`, `activities[].materials[]`, `visual_affordance_schema_version 38.4`, `activities_visual_review[]`, `visual_affordances[]`) leaks into Learning Journey Step 5 Copy prompts because `workflowRecordIsLearningJourney` / `isLearningJourneyWorkflow` was omitted from the suppression check alongside Assessment Pack and Situated Task | **Resolved in Milestone 2** (verified in `tests/s105-m2-prompts-and-continuity.test.js`) |
| `S105-AD-003` | `lib/learning-journey-design-page.js:574–770, 848, 965` & `lib/learning-journey-sibling-prompts.js:27` | Residual pre-Sprint 95/96/103 learner artefact continuity prohibition (`"claim that PRISM transfers, retrieves, or makes stored answers / previous published outputs available across components"`) blurs authoring-time non-inspection / no response-aware adaptation / no pre-feedback snapshots with unified LJ runtime read-only learner artefact availability (`{commission_id}.{elicitation_id}` and Learning Journal) | **Resolved in Milestone 2** (verified in `tests/s105-m2-prompts-and-continuity.test.js` & `tests/s94-learning-journey-wp2-continuity-validation.test.js`) |
| `S105-AD-004` | `app.js:40483–40519` (`handleDuplicateWorkflow`) & `app.js:31155–31265` (`clearWorkflowRunCaptureState`) | Run-derived Learning Journey metadata written onto `wf.deliverySeed` (`source_context` generated during Step 4 and `commissioned_component_durations`) is cloned verbatim on workflow duplication and needs origin-aware reset on clear-run / upstream invalidation without disturbing brief-provided `source_context` | Milestone 3 |

---

## Explicitly excluded (not pulled into Sprint 105)

- **`PB-S-008`** pre-existing full-suite test failures (tracked separately on `docs/backlog/PRODUCT-BACKLOG.md`).
- **`S104-AD-009`** remaining Practice criterion caps (tracked under Sprint 104).
- **Production prose-migration parser** for the incomplete 14,000-word Economics Step 4 run (rejected per `S105-D02` to avoid brittle prose scraping).
- **Other product families** (Interactive, Practice, Expository, Assessment Pack, Situated Task — regression-protected only).

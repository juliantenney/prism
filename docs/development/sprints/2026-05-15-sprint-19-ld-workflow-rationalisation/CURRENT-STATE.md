# Sprint 19 — current state

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`  
**Sprint:** 19 — Learning Design Workflow Rationalisation  
**Status:** **Active** — bootstrap / audit-first (docs-only; implementation charter-gated)

**Entry point (fresh chat):** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md)

---

## Active sprint summary

| Sprint | Status |
|--------|--------|
| **Sprint 19** | **Active** — audit + portable pack; Slice 19-1+ not started |
| **Sprint 18** | **Closed** — Research contextual refinement; **100 tests** — [`../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md`](../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) |

**Primary audit:** [`docs/audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md)

---

## Verification floor

```bash
node --test tests/*.test.js
```

| Metric | Value |
|--------|-------|
| **Tests** | **100 passed**, 0 failed |
| **Sprint 19 code changes** | **None** (docs-only bootstrap) |
| **Research fixtures** | S1–S13 — **do not modify** without charter |

---

## Sprint 18 closeout (Research — reference model)

| Area | State |
|------|-------|
| `planningAdequacyChecks` | Research pack — checks A, B + topic_scope |
| Runtime | `evaluateWorkflowBriefPlanningAdequacyChecks`, `applyWorkflowBriefPlanningAdequacyAfterDesign` |
| Conflict | `objective_type_mixed_signals` + exceptions (S13) |
| Tests | `workflow-research-adequacy.test.js`, `workflow-research-conflict-exceptions.test.js`, sparse S1–S6 |

---

## Learning Design — policy state (unchanged in bootstrap)

**Pack:** `domains/learning-design/domain-learning-design-step-patterns.md`

| `workflowBriefConfig` area | Current |
|----------------------------|---------|
| `requiredFactors` | 5: topic, learner_level, design_scope, delivery_pattern, input_strategy |
| `refinementFactors` | ~15 (assessment, page, activity, sequencing) |
| `optionalFactors` | assessment_required, session_materials, duration_minutes, page_profile, … |
| `questionPolicy` | `askRefinementByDefault: true`, `maxRefinementQuestions: 8` |
| `stepRefinementProfiles` | assessment_pack, design_page, learner_page_pack |
| `intentClasses` | assessment_pack elicitation ordering |
| `planningAdequacyChecks` | **Not present** |
| `validationRules` / `conflictPolicies` | **Not present** (unlike Research) |

---

## Runtime — LD-relevant (no Sprint 19 edits)

| Location | Behaviour |
|----------|-----------|
| `app.js` — `getWorkflowRefinementQueue` | Pre-design refinement when pack allows |
| `app.js` — `continueWorkflowDesignGeneration` | Post-gen queue; profile overrides; blocks Ready |
| `app.js` — `PROMPT_LEVEL_ASSESSMENT_FACTOR_IDS` | Suppresses some factors pre-design |
| `app.js` — `applyWorkflowBriefMappings` | Maps resolved factors to workflow + steps |
| `app.js` — `callOpenAIForWorkflowReview` | Optional AI step suggestions |

Research adequacy hooks in `continueWorkflowDesignGeneration` apply when domain pack defines `planningAdequacyChecks` — **LD does not trigger them today**.

---

## Sprint 19 deliverables (this session)

| Artefact | Path | Status |
|----------|------|--------|
| LD audit | `docs/audits/ld-workflow-generation-rationalisation-audit.md` | **Done** |
| Bootstrap pack | This folder (7 files) | **Done** |
| Slice 19-1 implementation | — | **Not started** |

---

## Deferred backlog (cross-sprint)

| Item | Domain |
|------|--------|
| Research checks C–E, fixtures S10–S12 | Research |
| Slice 3A manual Factory validation | Research |
| Slice 3B dismiss / lifecycle | Research |
| LD adequacy rules + fixtures L1+ | LD (Sprint 19-2+) |
| `explicitExtract` | Research (deferred Sprint 17) |

---

## Canonical read order

1. `GPT-BOOTSTRAP-PROMPT.md`  
2. `docs/audits/ld-workflow-generation-rationalisation-audit.md`  
3. `sprint-19-bootstrap.md`  
4. `domains/learning-design/domain-learning-design-step-patterns.md` (workflowBriefConfig block)  
5. Sprint 18 `SPRINT-18-CHECKPOINT.md`

# Session Handover — Sprint 19 portable pack

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`

**Date:** 2026-05-15

---

## What this pack is for

Portable context for **Sprint 19 — Learning Design Workflow Rationalisation**. Sprint 18 proved **contextual refinement on Research**; Sprint 19 **plans** the same discipline for **Learning Design** without default implementation in the bootstrap phase.

**Entry point for a fresh chat:** **`GPT-BOOTSTRAP-PROMPT.md`** (includes copy-paste block).

---

## Sprint 18 closed — Sprint 19 bootstrap

| Sprint | Status |
|--------|--------|
| **Sprint 18** | **Closed** — Slices 1–2 + 3C-1/3C-2 + method-vs-output conflict; **100 tests** |
| **Sprint 19** | **Active** — bootstrap / audit-first; audit + pack complete; implementation **charter-gated** |

**Sprint 18 closeout (Research reference):** [`../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md`](../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) — **Closed**, **100 passed** at closeout; forwards to this sprint.

**LD rationalisation audit (required read):** [`docs/audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md)

---

## Sprint 19 purpose

Rationalise **LD workflow generation** using the Sprint 18 model:

1. **Keep** five **deterministic essentials** (topic, learner_level, design_scope, delivery_pattern, input_strategy).  
2. **Stop** treating ~15 **refinementFactors** + **stepRefinementProfiles** as a pre/post-design **form wizard**.  
3. **Plan** **post-synthesis planning_adequacy** (pack-declared, non-blocking) for assessment/page/activity fit — **Research interpreter reused** when chartered.  
4. **Keep** **step Settings** (`mappingRules` → `stepParams`) as expert tuning.  
5. Apply **Prompt Studio lessons** (concrete session object = designed workflow; delta-oriented refinement).

**Not in scope (bootstrap):** LD code changes, Research regression, renderer, schema, Prompt Studio merge.

---

## Architectural handoff (one sentence)

> **Resolving LD essentials makes planning safe; seeing the designed workflow makes assessment and page tuning discussable — in the Planning panel and Settings, not in a third chat interrogation.**

---

## Primary audit artefact

| Document | Content |
|----------|---------|
| [`docs/audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md) | Nine audit questions; factor classification; first slice recommendation |

---

## LD policy snapshot (canonical)

**File:** `domains/learning-design/domain-learning-design-step-patterns.md` → `workflowBriefConfig`

| Mechanism | Count / flag | Sprint 19 direction |
|-----------|--------------|---------------------|
| `requiredFactors` | 5 | **Keep** |
| `refinementFactors` | ~15 | **Convert** majority → future `planningAdequacyChecks` |
| `questionPolicy.askRefinementByDefault` | `true` | **Remove/defer** default-on (charter) |
| `stepRefinementProfiles` | 3 | **Remove/defer** after adequacy + Settings path |
| `post_generation_refinement` | Runtime stage | **Remove/defer** as default blocker |
| `mappingRules` | Many factors → stepParams | **Keep** as Settings |
| `planningAdequacyChecks` | Absent | **Add** in Slice 19-2+ (charter) |

---

## Runtime touchpoints (read-only for Sprint 19)

| Function / stage | Role |
|------------------|------|
| `getWorkflowRefinementQueue` | Pre-design refinement queue when `askRefinementByDefault` |
| `continueWorkflowDesignGeneration` | Post-gen `post_generation_refinement`, profile merge |
| `getPostGenerationElicitationQueueFromProfile` | Profile required/optional tiers |
| `applyWorkflowBriefMappings` | Factor → workflow + step constraints |
| `callOpenAIForWorkflowReview` | Optional AI graph suggestions — **separate** from adequacy |
| `applyWorkflowBriefPlanningAdequacyAfterDesign` | Research today — **reuse** for LD when chartered |

---

## Recommended slice sequence

| Slice | Scope | Sprint 19 bootstrap |
|-------|--------|---------------------|
| **19-0** | Audit + pack (this sprint) | **Done** |
| **19-1** | Sign-off + optional pack flags pilot (`askRefinementByDefault: false` or low cap) | Charter next |
| **19-2** | LD `planningAdequacyChecks` (3–5 rules) + Planning panel | Charter |
| **19-3** | Thin post-gen profiles; LD fixtures L1–L4 | Charter |
| **19-4** | LD validation/conflict port (if evidence) | Charter |

---

## Verification

```bash
node --test tests/*.test.js
```

**Expected:** **100 passed**, 0 failed (bootstrap is docs-only).

---

## Files in this pack

| File | Role |
|------|------|
| `GPT-BOOTSTRAP-PROMPT.md` | Fresh-chat entry + copy-paste block |
| `HANDOVER.md` | This document |
| `SPRINT-CONTEXT.md` | Goals, constraints, success criteria |
| `CURRENT-STATE.md` | Repo map and test floor |
| `sprint-19-bootstrap.md` | Full thesis and phases |
| `sprint-19-index.md` | Index of pack + canonical links |
| `review-log.md` | Decisions — ends with **Sprint 19 ready** |

---

## Next session actions

1. Review audit §9 with stakeholders (essentials cap, adequacy candidates).  
2. Charter **Slice 19-1** if ready to edit LD pack flags only.  
3. Do **not** implement LD adequacy until Slice 19-2 charter references Research interpreter contract and fixture plan.

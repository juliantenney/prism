# Learning Design — workflow generation rationalisation audit

**Date:** 2026-05-15  
**Path:** `docs/audits/ld-workflow-generation-rationalisation-audit.md`  
**Status:** Read-only audit for **Sprint 19** — no implementation in this document.

**Sprint pack:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`

**Foundation:** Sprint 18 four-layer model ([`contextual-refinement-architecture-note.md`](../consolidation/contextual-refinement-architecture-note.md)); Research proved on pack-driven essentials + `planningAdequacyChecks` + Planning panel ([`SPRINT-18-CHECKPOINT.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md)).

**Sources:** `domains/learning-design/domain-learning-design-step-patterns.md`; `app.js` (`getWorkflowRefinementQueue`, `stepRefinementProfiles`, `post_generation_refinement`, `applyWorkflowBriefMappings`, `continueWorkflowDesignGeneration`, `callOpenAIForWorkflowReview`); [`existing-refinement-infrastructure-audit.md`](existing-refinement-infrastructure-audit.md).

---

## Executive summary

| Finding | Implication |
|---------|-------------|
| LD has **5 required factors** but **~15 refinementFactors** + **3 stepRefinementProfiles** | Form-wizard fatigue after essentials |
| Many refinement factors **duplicate** post-gen chat questions and **step Settings** (`mappingRules` → `stepParams`) | Triple-ask risk (pre-design, post-gen, Settings) |
| Research has **no** `refinementFactors`; LD has **no** `planningAdequacyChecks` yet | Sprint 19 = audit + rationalise LD pack **policy**, not port LD queues wholesale |
| `callOpenAIForWorkflowReview` is generic graph surgery | Keep separate from adequacy; do not merge with pack rules in v1 |
| Safest first slice | **Inventory + cap essentials** + **classify refinementFactors** + **defer** profile/chat thinning until chartered |

**Rule:** Runtime interprets policy; packs declare policy. Sprint 19 does **not** rewrite runtime until a slice is chartered.

---

## 1. What LD factors are true deterministic essentials?

### 1.1 Pack-declared required (`workflowBriefConfig.requiredFactors`)

| Factor | Why essential (blocking) | Notes |
|--------|--------------------------|-------|
| `topic` | Subject matter for generation / normalization | Often auto-extracted from goal |
| `learner_level` | Audience calibration | Strong inference rules from cohort text |
| `design_scope` | `single_activity` / `session` / `sequence` / `module` drives chain shape | Default `session` |
| `delivery_pattern` | `face_to_face` / `blended` / `mostly_online` | Affects page/facilitator bias |
| `input_strategy` | `generate_from_topic` vs `provided_source_content` vs `mixed` | Safety parallel to Research S2 |

These five are the **contractual minimum** before workflow synthesis should proceed with confidence.

### 1.2 Strong optional factors that behave like soft essentials

| Factor | Role | Classification recommendation |
|--------|------|------------------------------|
| `assessment_required` | Gates assessment steps via `triggerRules` | **Keep optional** with clear default `false`; adequacy can suggest enabling |
| `session_materials` | `page` / `slide_deck` — drives Design Page | **Keep optional**; default `["page"]` in pack |
| `duration_minutes` | Sequence timing | **Keep optional**; infer from scope text when possible |
| `page_profile` | Learner vs facilitator page | **Convert** to Settings / post-design adequacy when page step exists |

### 1.3 Not essentials (do not promote to required in Sprint 19)

All `refinementFactors` ids (assessment tuning, page tone, activity mix, etc.) — see §2.

**Target essentials set (rationalised):** Keep the **five required**; do **not** add assessment/page refinement as required without evidence from audit workshops.

---

## 2. Which `refinementFactors` are really workflow adequacy recommendations?

Post-synthesis **planning_adequacy** (Sprint 18 pattern) answers: *“Given this step list, what should the user consider?”* — **non-blocking**, pack-declared, Planning panel.

| Factor id | True role today | Sprint 19 classification |
|-----------|-----------------|---------------------------|
| `coverage_scope` | Assessment breadth vs themes | **Convert to planning adequacy** (when assessment steps present) |
| `cognitive_demand` | Bloom-level target for items | **Convert to planning adequacy** |
| `question_style_mix` | MCQ vs constructed mix | **Convert to planning adequacy** |
| `assessment_type` | Item format | **Split:** essential only if `assessment_required` + no type in brief; else adequacy |
| `assessment_total_items` | Count of items | **Convert to planning adequacy** or **Settings** default on generate step |
| `feedback_required` | Feedback mode | **Convert to planning adequacy** |
| `difficulty_profile` | Item difficulty spread | **Convert to planning adequacy** |
| `activity_pattern_mix` | Activity design style | **Convert to planning adequacy** (when activity steps present) |
| `sequencing_granularity` | Sequence detail level | **Convert to planning adequacy** |
| `assessment_cadence` | Formative/summative spread | **Convert to planning adequacy** |
| `tone_style` | Page voice | **Keep as advanced Settings** (`stepParams.step_design_page.tone_style`) |
| `depth_level` | Page depth | **Keep as advanced Settings** |
| `include_examples` | Page content | **Keep as advanced Settings** |
| `include_practice_tasks` | Page interactivity | **Keep as advanced Settings** |
| `compact_vs_detailed` | Page density | **Keep as advanced Settings** |

**Rationale:** Factors that change **step graph shape** or **major artefact class** belong in essentials/optional + heuristics. Factors that tune **how a step runs** belong in Settings or assistive adequacy **after** the user sees the plan.

---

## 3. Post-generation questions vs step Settings overlap

| Factor / question | Pre-design `refinementFactors` | Post-gen profile (`stepRefinementProfiles`) | `mappingRules` → Settings |
|-------------------|-------------------------------|-------------------------------------------|-------------------------|
| `assessment_type` | Yes (`mustAsk` possible) | **Required** in `assessment_pack` | `step_design_assessment`, generate step |
| `assessment_total_items` | Yes (`mustAsk`) | **Required** in profile | `number_of_items` on generate step |
| `difficulty_profile` | Yes | Optional tier in profile | `step_design_assessment`, generate |
| `coverage_scope` | Yes | Optional in profile | workflow + design_assessment |
| `feedback_required` | Yes | Optional in profile | design_feedback |
| `question_style_mix` | Yes | Optional in profile | generate step |
| `cognitive_demand` | Yes | Optional in profile | design_assessment |
| `page_profile` | optionalFactor | **Required** in `design_page` / `learner_page_pack` | `step_design_page.page_profile` |
| `learner_level` | **requiredFactor** | Re-asked in page profile | `audience_level` on Design Page |
| `tone_style` | refinementFactor | Optional in profile | `step_design_page.tone_style` |
| `depth_level` | refinementFactor | Optional in profile | `step_design_page.depth_level` |
| `include_examples` | refinementFactor | Optional in profile | `step_design_page.include_examples` |
| `include_practice_tasks` | refinementFactor | Optional in profile | `step_design_page.include_practice_tasks` |
| `compact_vs_detailed` | refinementFactor | Optional in profile | `step_design_page.output_density` |

**Overlap verdict:** Post-gen profiles largely **re-ask** the same knobs Settings already expose. Users answer in chat, then see the same fields in Settings.

**Sprint 19 direction:** **Defer** thinning post-gen queues in Slice 1; document overlap; Slice 2+ charter **profile → adequacy notices** or **profile → Settings defaults only**.

---

## 4. Which questions should only appear after the workflow is visible?

| Question class | When user can judge | Current timing | Should be |
|----------------|---------------------|----------------|-----------|
| “Is this the right **step chain** for scope?” | After step list | Partially pre-design (`design_scope` only) | **Post-synthesis adequacy** |
| Assessment item count / difficulty / coverage | After seeing Generate Assessment Items | Pre-design + post-gen | **Post-synthesis** (assistive) |
| Page tone / depth / examples | After Design Page in plan | Pre-design + post-gen profile | **Post-synthesis** or Settings |
| `learner_level` for page | After knowing page is terminal deliverable | Re-asked in page profile | **Essentials once**; not again in profile |
| Activity pattern / sequencing detail | After activities + sequence steps visible | Pre-design refinementFactors | **Post-synthesis** |
| “Add Validate Learning Design?” | After seeing validate-worthy chain | `callOpenAIForWorkflowReview` only | **Adequacy** or optional review button |

**Principle (from Sprint 18):** If the user cannot see **why** the question matters (which steps exist), defer to post-synthesis or Settings.

---

## 5. Pack rules: brittle, redundant, or over-specific?

| Area | Issue | Classification |
|------|-------|----------------|
| `triggerRules` (many `whenGoalMentionsAnyOf` + `include`/`exclude`) | High combinatorial surface; hard to test | **Keep** but **needs fixture suite** (LD-L1+) |
| Duplicate `learner_page_pack` vs `design_page` profiles | Near-identical tiers | **Remove/defer** merge to one page profile |
| `intentClasses.assessment_pack.elicitation.orderedFactors` | Parallel ordering to refinementFactors + profile | **Remove/defer** consolidate to one ordering source |
| `PROMPT_LEVEL_ASSESSMENT_FACTOR_IDS` hard-coded in `app.js` | Brittle coupling | **Needs further evidence** before moving to pack |
| `assessmentMustAskIds` in `continueWorkflowDesignGeneration` | Runtime special-case | **Convert** to pack-only `mustAsk` flags |
| `stepBiasHints.preferLeanAssessmentFlow` | Intent-specific graph bias | **Keep** — deterministic heuristic |
| `inferenceRules` (long cohort lists) | Maintainable but verbose | **Keep** — deterministic |
| No `validationRules` / `conflictPolicies` (LD) | Unlike Research | **Needs further evidence** — port Research-style safety selectively? |
| `filterRefinementFactorsByGeneratedSteps` | Good guard | **Keep** runtime behaviour |

---

## 6. Where LD feels like a form wizard

| Symptom | Mechanism | User impact |
|---------|-----------|-------------|
| Essentials queue (5 factors) | `requiredFactors` | Necessary but long for sparse briefs |
| Pre-design refinement queue | `askRefinementByDefault: true`, up to 8 questions | Chat interrogation before design |
| Post-gen mandatory queue | `post_generation_refinement` stage blocks “Ready” | Second interrogation after seeing plan |
| Two-tier assessment opt-in | `assessmentOptionalOptIn` + optional tier | Third beat of questions |
| Re-asking `learner_level` | Page profile required tier | Feels like the system forgot prior answers |
| Intent class ordering | `intentClasses.elicitation` | Another ordering path |
| “Recommend: use default” loops | `buildWorkflowBriefQuestionText` | OK for experts; novices see form fields |

**Wizard score drivers:** Count of chat turns before “Ready”; duplication across channels; questions that only make sense **after** steps are visible but fire **before** or **instead of** showing the plan.

---

## 7. Prompt Studio lessons that apply

From [`prompt-studio-workflow-factory-lessons.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/context-files/prompt-studio-workflow-factory-lessons.md):

| PS lesson | LD application (Sprint 19+) |
|-----------|----------------------------|
| **Session object is concrete** | Treat **designed workflow JSON** (steps + roles) as the session object after first synthesis |
| **Assumptions visible** | Planning panel: essentials resolved, gates, rejected inference (when LD gains disclosures) |
| **Delta-oriented refinement** | Adequacy notices suggest plan changes, not new factor IDs |
| **Non-blocking ambiguity** | Do not block save on tone/depth/item-count tuning |
| **Do not merge products** | No Prompt Studio orchestration merge in Sprint 19 |

**Anti-pattern to avoid:** Asking LD users to refine **abstract factor ids** in chat when they have not yet seen **Design Page** / **Generate Assessment Items** in the step list.

---

## 8. What should remain untouched until after v10?

| Area | Reason |
|------|--------|
| **Renderer / Utilities HTML** | Sprint 16 closed; separate charter |
| **Workflow schema / orchestration** | No Sprint 19 redesign |
| **Prompt Studio product** | Patterns only |
| **Research pack / tests S1–S13** | No regression changes |
| **`callOpenAIForWorkflowReview` prompt** | Generic; revisit after adequacy layer exists |
| **LD step pattern catalogue** (canonical steps body) | Policy JSON only in rationalisation phase |
| **Production Factory UI layout** | Docs + pack policy first |
| **Full removal of post-gen profiles** | Defer until adequacy + Settings path proven |

**Safe before v10:** Pack policy edits in `workflowBriefConfig`; optional generic runtime for `planningAdequacyChecks` (reuse Research interpreter); LD fixture suite charter.

---

## 9. Safest first LD simplification slice

**Slice 19-1 (recommended charter — audit only in Sprint 19 bootstrap):**

1. **Freeze** Research regression (**100 tests**).
2. **Publish** this audit + factor classification table sign-off.
3. **Cap** pre-design refinement: set `askRefinementByDefault: false` in pack **or** `maxRefinementQuestions: 2` for pilot — **charter only**, not implemented in Sprint 19 bootstrap.
4. **Draft** 3–5 LD `planningAdequacyChecks` candidates (mirror Research shape) — docs only.
5. **Defer** deleting `stepRefinementProfiles` until Slice 19-2 proves adequacy + Settings cover the same ground.

**Slice 19-2 (later):** Implement LD `planningAdequacyChecks` + thin post-gen profiles (required tiers → notices).

**Slice 19-3 (later):** LD sparse fixtures L1–L4 + conflict/validation port if needed.

---

## 10. Master classification table

| Mechanism | Classification |
|-----------|----------------|
| `requiredFactors` (5) | **Keep as deterministic essential** |
| `optionalFactors` (assessment_required, session_materials, …) | **Keep optional** with defaults |
| `refinementFactors` (assessment/page/activity) | **Convert to planning adequacy** (majority) |
| Page tuning refinementFactors | **Keep as advanced Settings** |
| `stepRefinementProfiles` | **Remove/defer** (replace with adequacy + Settings) |
| Pre-design `getWorkflowRefinementQueue` | **Remove/defer** default-on; max 0–2 when retained |
| `post_generation_refinement` chat | **Remove/defer** as default path |
| `intentClasses.elicitation` ordering | **Remove/defer** duplicate of profiles |
| `mappingRules` → `stepParams` | **Keep as advanced Settings** |
| `inferenceRules` | **Keep as deterministic essential** |
| `workflowPolicy.triggerRules` | **Keep** (heuristics) |
| `callOpenAIForWorkflowReview` | **Keep**; separate from adequacy |
| LD `planningAdequacyChecks` (future) | **Convert to planning adequacy** (new) |
| LD `validationRules` / `conflictPolicies` (future) | **Keep as deterministic essential** (port from Research pattern when chartered) |

---

## 11. Related artefacts

| Document | Role |
|----------|------|
| [`sprint-19-bootstrap.md`](../development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/sprint-19-bootstrap.md) | Sprint 19 thesis and phases |
| [`existing-refinement-infrastructure-audit.md`](existing-refinement-infrastructure-audit.md) | Cross-domain inventory (Sprint 18) |
| [`contextual-refinement-architecture-note.md`](../consolidation/contextual-refinement-architecture-note.md) | Four-layer model |

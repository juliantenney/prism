# Sprint 27 charter — Assessment & feedback elicitation semantics

**Pack:** `docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/`  
**Date:** 2026-05-21  
**Mode:** Investigation first — **no implementation** until ontology and evidence are agreed

---

## Primary goal

Investigate how **pedagogical assessment intent** is:

1. **Elicited** (Factory brief, refinement, resolved factors)  
2. **Preserved** (workflow topology, step params, pack policy)  
3. **Propagated** (assessment blueprint → items → feedback pack)  
4. **Composed** (Design Page, `page.sections[]`, metadata)  
5. **Rendered** (export HTML — presentation only where it affects semantic investigation)

---

## Core question

> How does PRISM model and preserve pedagogical assessment intent — not merely whether it can emit MCQs?

---

## Hypotheses under test

### H1 — Generation richer than downstream preservation

Assessment item **generation** (and activity design) may encode misconception discussion, delayed correctness, or analysis-heavy tasks, but **Design Page composition** and **renderer** may collapse that into retrieval-quiz presentation.

**Probe:** Compare `assessment_items` JSON vs `page.sections[].assessment_check` vs exported HTML for the same workflow run.

### H2 — Default retrieval/correctness semantics

Unless brief/heuristics explicitly signal discussion-oriented assessment, workflows bias toward:

- `Generate Assessment Items` without `Design Assessment` / `Design Feedback`  
- MCQ + correct-answer fields  
- `feedback_display: none` or answer-forward page profiles  

**Probe:** Climate misconception vs inflation retrieval brief — topology and step params side by side.

### H3 — Feedback under-elicited

Current elicitation **weights strongly:**

| Higher weight (observed) | Lower weight (hypothesis) |
|------------------------|---------------------------|
| Assessment type (MCQ, T/F) | Answer visibility timing |
| Item count | Feedback timing (immediate vs delayed) |
| `assessment_required` | Discussion / peer instruction mode |
| Page profile (learner vs assessment) | Facilitation strategy |
| | Learner interaction model |

**Probe:** Audit `workflowBriefConfig` required/optional factors vs what `extractWorkflowBriefExplicitFactors` actually sets.

### H4 — Answer visibility as presentation not pedagogy

`include_answers`, `feedback_display`, `feedback_required` flow through:

- Regex extract → resolved factors → Design Page step params → renderer  

They may be **downstream presentation switches** without upstream **pedagogical contracts** in assessment generation prompts.

**Probe:** Trace `include_answers` from brief text to `assessment_items` item fields to HTML.

### H5 — Activities richer than assessment steps

**Design Learning Activities** prompts emphasise learner_task, facilitator_moves, misconception handling, materials.  
**Generate Assessment Items** prompts emphasise coverage, difficulty, item types, distractors.

**Probe:** Compare pack `promptTemplate` contracts for `step_design_learning_activities` vs `step_generate_assessment_items`.

### H6 — Intent loss across pipeline

| Stage | Risk |
|-------|------|
| Elicitation | Sparse brief → weak factors |
| Orchestration | Lean assessment heuristics drop pedagogy steps |
| Generation | Model invents retrieval-shaped items |
| Composition | Section omission or flattening |
| Rendering | Was presentation (largely fixed Sprint 26) |

**Probe:** Fill [`elicitation-evidence-matrix.md`](elicitation-evidence-matrix.md) per evidence case.

---

## Sprint scope

### In scope

- Read-only code and pack audit  
- Evidence matrix completion for three Sprint 26 cases  
- Elicitation factor gap analysis (`workflowBriefConfig`, inference rules)  
- Assessment vs feedback **ontology** draft  
- Workflow **probe catalogue** (brief templates, expected semantic dimensions)  
- Comparison of artefacts and fixtures (no live API required for 27-1)  
- Decision log entries (R27-001+)  

### Explicit non-goals

| Non-goal | Reason |
|----------|--------|
| Renderer CSS/HTML cleanup sprint | Sprint 26 closed; reopen only if semantic probe blocked |
| New renderer features (layouts, themes) | Out of charter |
| Workflow topology overhaul | Sprint 26 Track A addressed activity chain; 27 focuses assessment/feedback |
| Design Page prompt rewrites | 27-4 only after investigation sign-off |
| Full domain-pack rewrite | Bounded LD assessment/feedback surface only |
| Live OpenAI regression suite in CI | 27-3 may capture snapshots manually |
| Changing Sprint 25 composition authority | Frozen unless explicit re-charter |

---

## Architectural diagnosis (current)

```
Educator brief (sparse)
  → workflowBriefConfig questions + extractWorkflowBriefExplicitFactors (regex)
  → applyWorkflowBriefInferenceRules + resolveWorkflowBriefFactors
  → [optional] resolveAssessmentIntentClassMetadata (post-gen queue)
  → AI workflow design + applyWorkflowDesignHeuristics (topology)
  → Step execution (pack prompts + step params)
  → Artefacts: learning_activities, activity_materials, assessment_items, feedback_pack, page
  → buildUtilityStructuredHtml (render; feedback_display, include_answers)
```

**Asymmetry (working diagnosis):**

| Signal | Topology strength | Generation contract strength |
|--------|-------------------|------------------------------|
| `assessment_required` | **Strong** (pack triggerRules) | Moderate |
| `activities_required` | Fixed Sprint 26 | Strong in activity step |
| Discussion-mode assessment | **Weak / implicit** | Variable |
| Answer visibility | Extract + page param | **Not first-class in item schema** |
| Feedback timing | Partial (`feedback_required`) | Often conflated with display |

---

## Evidence base (Sprint 26)

| Case | What it proves |
|------|----------------|
| **RNA/HCV** | Topology can drop activities when assessment co-mentioned; elicitation now has `activities_required` |
| **Inflation retrieval** | Assessment on page works; answer-centric export; `feedback_display` drives renderer |
| **Climate misconception** | Strong activity pedagogy; discussion-oriented materials; T/F assessment; renderer materials hotfixed |

---

## Success criteria (investigation complete)

- [ ] Evidence matrix filled for all three cases with artefact paths  
- [ ] H1–H6 each marked Supported / Refuted / Partial with citations  
- [ ] Gap list: missing elicitation factors vs missing propagation vs missing composition  
- [ ] Probe catalogue prioritised (≥3 probes run or fixture-backed)  
- [ ] 27-4 implementation charter drafted **only if** ontology agreed  

---

## Dependencies

| Dependency | Status |
|------------|--------|
| Sprint 26 Track B renderer | **Closed** |
| Sprint 26 Track A topology | **Fixed** (verify browser optional) |
| Test floor 259 | Green |
| LD pack `workflowBriefConfig` | Authoritative for elicitation audit |

---

## Related packs

- [`../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/`](../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/)  
- [`../2026-05-20-sprint-26-renderer-presentation-consolidation/`](../2026-05-20-sprint-26-renderer-presentation-consolidation/)  
- [`../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/`](../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/)

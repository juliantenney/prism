# Slice 35-1 — Instructional clarity and learner-action rhetoric

**Date:** 2026-06-03  
**Status:** Complete (prompt/domain + exemplar fixtures; no workflow/schema/renderer restructuring)  
**Regression:** `node --test tests/*.test.js` → **589 pass / 0 fail**

---

## Evaluation anchors used

| Anchor | Role |
|--------|------|
| `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | Quantitative golden page — before/after exemplar refresh |
| `tests/fixtures/page-render/marx-self-study-page.json` | Humanities page — added `expected_output` / `support_note` exemplars |
| `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/probe-brief-rna-transcript-self-study.md` | RNA self-study brief shape (topology + orientation expectations) |
| `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/presentation-review-rubric.md` | Manual rubric (hierarchy, primary action, cue subordination) |
| `docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/context-files/manual-validation-observation-log.md` | Cross-programme manual validation patterns |

---

## Before (patterns observed)

### Confidence-interval golden fixture (pre-35-1)

| Field | Issue |
|-------|--------|
| A2 `learner_task` | Action present but vague on *what* to write in cells ("where needed") |
| A2 `expected_output` | Good direction; could stress peer-reviewable evidence |
| A4 `learner_task` | Solid verbs; could require quoting endpoints explicitly |
| Assessment `question` | Numbered list good; sub-prompt 3 mixed MCQ with open "practically significant" without framing |
| Overview | Imperative OK; reads as topic pointer not session goal |

### Marx self-study fixture (pre-35-1)

| Field | Issue |
|-------|--------|
| A3 `learner_task` | "using prompts and identify" — materials named, action underspecified |
| A3 | Missing `expected_output` and `support_note` — no completion evidence or misconception guard |
| A4 `learner_task` | Passive "read … write" without checklist operationalisation |
| A4 | Missing `expected_output` / `support_note` |

### Producer guidance (pre-35-1)

- DLA template already required `learner_task` and `expected_output` but did not distinguish **action** vs **coverage** or **evidence** vs **summary**.
- Assessment producer encouraged discussion-oriented stems but lacked explicit **judgement-over-recall** rule for self-directed pages.
- Design Page preservation listed cognition fields but did not explicitly require **verbatim** `expected_output` / `support_note`.

---

## After (35-1 changes)

### 1. Auto-applied prompt block (`app.js`)

`buildSelfDirectedLearnerActionRhetoricPromptBlock()` appended for self-directed learner-page workflows on:

- Design Learning Activities  
- Generate Activity Materials  
- Design Page  
- Assessment producer steps (`isWorkflowStepAssessmentProducer`)

Covers: `learner_task`, `expected_output`, `support_note`, preamble/cognition boundaries, materials vs task, assessment stems.

### 2. Domain pack

- `domain-learning-design-prompt-rules.md` — §6b Learner-action rhetoric table  
- `domain-learning-design-step-patterns.md` — DLA + Generate Assessment Items `defaultPromptNotes` tightened  

### 3. Exemplar fixtures (regression-locked shapes unchanged)

**Confidence interval:** stronger action/evidence wording; assessment sub-questions rephrased for decision + justification; renderer/MathJax/table contracts unchanged.

**Marx:** added `expected_output` and `support_note` per activity; clearer task verbs.

### 4. DLA JSON example (`app.js`)

Updated authoritative example with `support_note` and evidence-based `expected_output`.

### 5. Design Page preservation

Explicit verbatim copy for `expected_output` and `support_note`.

---

## Presentation rubric preview (manual)

Applied informally to rendered confidence-interval HTML (same structure as CI golden test):

| Criterion | Before → After (expected) |
|-----------|---------------------------|
| Primary action obvious | Partial → Pass (task verbs and output blocks separated) |
| Materials support task | Pass (unchanged structure; copy clarifies use) |
| Secondary cues subordinate | Pass (preamble/cognition not expanded in this slice) |
| Assessment reasoning | Partial → Pass (numbered judgement sub-steps) |

Full browser/print review deferred to slice close checklist; automated golden test still green.

---

## Pedagogical delta (summary)

1. **Tasks** — Observable verbs + what to do with materials.  
2. **Outputs** — Peer-reviewable evidence, not "understanding".  
3. **Support notes** — Misconception/evidence guards, not tutoring.  
4. **Assessments** — Decision + justification stems for self-directed pages.  
5. **Page compose** — Preserve output/support fields on export.

---

## Rejected scope creep

| Rejected | Reason |
|----------|--------|
| New workflow steps | Sprint 35 charter |
| Schema / PEC new fields | Charter |
| Renderer restructuring | Sprint 34 stable; HTML semantics unchanged |
| CSS / V31_8 typography | Sprint 34-5 scope |
| Sprint 32 diagram pipeline | Deferred programme |
| Adaptive hints / tutoring loops | Charter |
| Post-render copy rewriting in `app.js` | Prefer upstream generation |
| New artefact types (workbook, faded-example type enum) | Topology frozen |
| Mandatory `activity_preamble` rewrite in fixtures | 35-1 focuses on task/output/support/assessment rhetoric |

---

## Files touched

| Path | Change |
|------|--------|
| `app.js` | Rhetoric block + scaffold wiring + DLA example + Design Page preservation |
| `domains/learning-design/domain-learning-design-prompt-rules.md` | §6b |
| `domains/learning-design/domain-learning-design-step-patterns.md` | DLA + assessment notes |
| `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | Exemplar copy |
| `tests/fixtures/page-render/marx-self-study-page.json` | Exemplar copy + output/support |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | Rhetoric block assertions |
| `docs/.../fixtures/35-1-rhetoric-exemplar.md` | Snippet reference |
| `docs/.../observations/35-1-instructional-clarity.md` | This note |

---

## Next slice hint

**35-2** — Worked-example and faded-support patterns in `required_materials` specifications and template row labelling (still no schema expansion).

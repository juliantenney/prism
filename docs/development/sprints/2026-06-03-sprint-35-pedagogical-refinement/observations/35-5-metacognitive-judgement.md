# Slice 35-5 — Metacognitive closure and evaluative judgement prompts

**Date:** 2026-06-03  
**Status:** Complete  
**Regression:** `node --test tests/*.test.js` → **589 pass / 0 fail**

---

## Goal

Pages end with concise consolidation and evaluative judgement — not abrupt task completion or long reflective prose.

---

## Evaluation (fixtures)

### Confidence-interval golden page

| Surface | Evidence |
|---------|----------|
| A2 `template` ### Closure | Hardest justify; reliability to peer |
| A2 `self_explanation_prompt` | One-sentence interpretation test |
| A2 `expected_output` | Hardest row + why |
| A4 scenario ### Debrief | Understanding change; evidence strength |
| A4 `transfer_or_application_task` | Where else endpoints matter |
| Q1 stem item 5 | Statistical vs practical — harder to defend |
| `study_tips` | Changed understanding; hardest justify; transfer |

### Marx self-study page

| Surface | Evidence |
|---------|----------|
| A3 ### Closure | Harder work to compare; reliable purpose cells |
| A3 `self_explanation_prompt` | Comparison vs summary |
| A4 checklist | Closure bullets on understanding / weakest evidence |
| A4 scenario debrief | Compare explanations — stronger evidence |
| A4 `transfer_or_application_task` | Assumption fails elsewhere |
| `study_tips` | Changed understanding; sceptical peer; transfer |

---

## Changes delivered

### 1. `buildSelfDirectedMetacognitiveJudgementPromptBlock()` (`app.js`)

Auto-applied with 35-1–35-4 on self-directed DLA, GAM, Design Page, assessment producer.

### 2. GAM block (extend)

Realise ### Closure / ### Debrief when specified.

### 3. Domain pack

- `domain-learning-design-prompt-rules.md` — §6f  
- `domain-learning-design-step-patterns.md` — DLA, GAM, assessment notes  

### 4. Fixtures + tests

- CI and Marx fixtures  
- Adoption + golden render assertions  

---

## Rejected scope creep

| Rejected | Reason |
|----------|--------|
| Adaptive reflection / coaching loops | Charter |
| New reflection artefact type | Schema frozen |
| Diary-length reflective essays | Concise prompts only |
| Generic “reflect on your learning” | Instructionally empty |
| Renderer reflection UI | No restructuring |
| Conversational tutoring closure | Not self-study page shape |

---

## Programme note

Sprint **35** slice set (35-1–35-5) is complete for chartered pedagogical refinement inside existing structures.

---

## Files touched

| Path |
|------|
| `app.js` |
| `domains/learning-design/domain-learning-design-prompt-rules.md` |
| `domains/learning-design/domain-learning-design-step-patterns.md` |
| `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| `tests/fixtures/page-render/marx-self-study-page.json` |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` |
| `tests/utility-page-render.test.js` |
| `fixtures/35-5-metacognitive-judgement-exemplar.md` |
| `observations/35-5-metacognitive-judgement.md` |

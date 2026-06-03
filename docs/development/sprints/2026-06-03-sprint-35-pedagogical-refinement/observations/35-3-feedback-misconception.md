# Slice 35-3 — Embedded feedback and misconception interruption

**Date:** 2026-06-03  
**Status:** Complete  
**Regression:** `node --test tests/*.test.js` → **589 pass / 0 fail**

---

## Goal

Help self-study learners check reasoning during activities before misconceptions consolidate — using existing fields only.

---

## Evaluation (fixtures)

### Confidence-interval golden page

| Surface | Evidence |
|---------|----------|
| A1 `support_note` | Check your thinking: one-interval vs long-run method |
| A2 `template` | Self-check prompts (plausible interpretations; n vs width) |
| A2 `support_note` | Incomplete Yes/No without procedure-linked reason |
| A4 `support_note` | Midpoint vs quoted endpoints |
| Q1 `explanation` | p-value vs practical significance (concise) |
| `study_tips` | Common slip named before filling rows |

**Rubric:** Cues are short; no full answer keys in materials; no adaptive language.

### Marx self-study page

| Surface | Evidence |
|---------|----------|
| A2 `support_note` | Plot summary vs purpose/difference |
| A3 template | Self-check bullets under comparison table |
| A4 `support_note` | Generic definitions without scenario detail |
| A4 checklist | Guard on final judgement item |

---

## Changes delivered

### 1. `buildSelfDirectedEmbeddedFeedbackMisconceptionPromptBlock()` (`app.js`)

Auto-applied with 35-1/35-2 on self-directed DLA, GAM, Design Page, assessment producer.

Covers: support_note Check your thinking pattern, prompt_set/checklist self-check bullets, expected_output quality signals, formative explanations, study_tips, Design Page preservation, GAM realisation.

### 2. GAM reasoning materials block (extend)

Realise prompt_set misconception-interrupt bullets when specified.

### 3. Domain pack

- `domain-learning-design-prompt-rules.md` — §6d  
- `domain-learning-design-step-patterns.md` — DLA, GAM, assessment producer `defaultPromptNotes`

### 4. Fixtures + tests

- CI and Marx fixtures updated with embedded feedback exemplars  
- `workflow-self-directed-activity-framing-adoption.test.js` — block present/absent by delivery context  
- `utility-page-render.test.js` — golden self-check and assessment explanation assertions  

---

## Before → after (pattern)

| Before (typical) | After (35-3 target) |
|------------------|---------------------|
| Generic “be careful” support | Check your thinking: if X, revisit Y |
| Empty prompt_set | 1–3 self-check bullets |
| Assessment explanation = correct answer only | Error pattern + concept link |
| expected_output = topic summary | Quality signals exposing weak reasoning |

---

## Rejected scope creep

| Rejected | Reason |
|----------|--------|
| Adaptive feedback engine | Charter |
| Tutoring / remediation loops | Charter |
| New `misconception_feedback` schema field | Topology frozen |
| Hidden branching (“if wrong go to…”) | No adaptive systems |
| feedback_pack step on every learner page | Existing fields sufficient |
| Renderer feedback UI changes | No renderer restructuring |
| Long MCQ explanation keys | Not tutoring |

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
| `fixtures/35-3-feedback-misconception-exemplar.md` |
| `observations/35-3-feedback-misconception.md` |

---

## Next slice

**35-4** — Concept/procedure integration cues (still prompt + existing fields only).

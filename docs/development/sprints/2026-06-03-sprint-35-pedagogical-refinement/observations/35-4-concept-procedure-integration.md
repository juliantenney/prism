# Slice 35-4 — Concept/procedure integration cues

**Date:** 2026-06-03  
**Status:** Complete  
**Regression:** `node --test tests/*.test.js` → **589 pass / 0 fail**

---

## Goal

Make procedures meaningful: learners see what each step means conceptually and when it applies — without new schema or renderer work.

---

## Evaluation (fixtures)

### Confidence-interval golden page

| Surface | Evidence |
|---------|----------|
| `knowledge_summary` | Standard error → uncertainty; **In activities:** preview |
| A1 `worked_example` | **Step → meaning** (Judge Correct?, Write Reason) |
| A2 `template` | Step → meaning + **Use this when…** before tables |
| A4 `expected_output` | Result + interpretation of overlap |
| Q1 stem | Sub-question 3: why comparing p-value to α is appropriate |

### Marx self-study page

| Surface | Evidence |
|---------|----------|
| `knowledge_summary.use_in_activities` | Links concepts to comparison + scenario procedures |
| A2 `worked_example` | Purpose/difference step → meaning |
| A3 `template` | Step → meaning + Use this when |
| A4 `checklist` | Each item: procedure → conceptual purpose |

---

## Changes delivered

### 1. `buildSelfDirectedConceptProcedureIntegrationPromptBlock()` (`app.js`)

Auto-applied with 35-1–35-3 on self-directed DLA, GAM, Design Page, assessment producer.

### 2. GAM reasoning block (extend)

Realise step → meaning and Use this when when specified in `required_materials`.

### 3. Domain pack

- `domain-learning-design-prompt-rules.md` — §6e  
- `domain-learning-design-step-patterns.md` — DLA, GAM, assessment `defaultPromptNotes`

### 4. Fixtures + tests

- CI and Marx fixtures updated  
- Adoption test: block on self-directed paths; absent on facilitated workshop  
- Golden test: Step → meaning, Use this when, In activities, assessment “appropriate procedure”  

---

## Rejected scope creep

| Rejected | Reason |
|----------|--------|
| New `procedure_meaning` schema field | Topology frozen |
| Long theory sections in activities | Concise cues only |
| Duplicating full knowledge_summary per activity | Preview in summary + step lines in materials |
| Renderer column for “meaning” | Existing markdown bullets |
| MathJax policy changes | Out of slice scope |
| Concept glossary without learner action | 35-1 conflict |

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
| `fixtures/35-4-concept-procedure-integration-exemplar.md` |
| `observations/35-4-concept-procedure-integration.md` |

---

## Next slice

**35-5** — Metacognitive closure and evaluative judgement prompts.

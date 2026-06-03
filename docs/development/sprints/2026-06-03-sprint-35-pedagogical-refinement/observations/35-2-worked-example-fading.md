# Slice 35-2 — Worked-example and faded-support patterns

**Date:** 2026-06-03  
**Status:** Complete  
**Regression:** `node --test tests/*.test.js` → **589 pass / 0 fail**

---

## Goal

Make expert reasoning visible before independent work, using existing `required_materials` / `materials.*` shapes only.

---

## Evaluation (fixtures)

### Confidence-interval golden page

| Activity | Stage | Evidence |
|----------|-------|----------|
| A1 Modelled interval judgement | Modelled | `materials.worked_example` + `util-worked-example`; **Move to reuse** labels reasoning |
| A2 Confidence interval template | Faded | One pre-filled row; empty cells remain; task says "remaining empty cells" |
| A4 Interval comparison scenario | Independent | Scenario only; preamble says no model row; bridge references prior move |

**Rubric (informal):** Primary action clear per stage; modelled block subordinate to task; no full-table answer dump in faded activity.

**Renderer note:** A1 `worked_example` uses labelled prose (`**Statement:**` / **Reason:**) rather than a pipe table — `util-worked-example` does not normalise tables like `template`, so pipe rows leaked into `<p>` tags (golden `doesNotMatch` on `| Statement |`).

### Marx self-study page

| Activity | Stage | Evidence |
|----------|-------|----------|
| A2 Modelled comparison row | Modelled | `worked_example` with purpose/difference move |
| A3 Comparing Marx's Major Works | Faded | `template` with Manifesto row filled; Kapital empty |
| A4 Explaining Marx's Core Concepts | Independent | Scenario + checklist without model row |

A3 `template` **Prompts** retain `Key Difference:` / `Second Difference:` / `Similarity:` bullets (no `---` horizontal rule before them) so slice 31.x comparison-prompt renderer tests stay green.

---

## Changes delivered

### 1. `buildSelfDirectedWorkedExampleFadingPromptBlock()` (`app.js`)

Auto-applied with 35-1 scaffolds on self-directed DLA, GAM, Design Page, assessment producer.

Covers: activity sequencing, `required_materials` specs, modelled/faded/independent material realisation, Design Page verbatim preservation, support_note cues.

### 2. GAM reasoning materials block (extend)

Explicit realise rules for `worked_example` / faded template partial rows.

### 3. Domain pack

- `domain-learning-design-prompt-rules.md` — §6c table  
- `domain-learning-design-step-patterns.md` — DLA + GAM `defaultPromptNotes`

### 4. Fixtures + tests

- Confidence-interval and Marx pages restructured for three-stage progression  
- Golden test: `util-worked-example`, modelled section, faded row present  
- Adoption test: fading block on self-directed DLA/Design Page; absent on facilitated workshop  

---

## Before → after (pattern)

| Before (typical) | After (35-2 target) |
|------------------|---------------------|
| Empty template only | Prior worked_example or model row |
| All cells empty or all filled | One model row + learner completes rest |
| Same table repeated with answers | New context (scenario) for transfer |
| Materials restate task | Materials show reasoning move |

---

## Rejected scope creep

| Rejected | Reason |
|----------|--------|
| New `faded_example` schema field | Topology frozen |
| New workflow step for worked examples | Charter |
| Renderer template engine for fading | Restructuring |
| Adaptive fading based on learner performance | No adaptive systems |
| Auto-generate model rows in `app.js` post-process | Prompt/materials only |
| Separate artefact type for worked-example pack | Existing keys sufficient |
| Full solution keys in formative MCQ stems | Assessment slice 35-3+ |

---

## Files touched

| Path |
|------|
| `app.js` |
| `domains/learning-design/domain-learning-design-prompt-rules.md` |
| `domains/learning-design/domain-learning-design-step-patterns.md` |
| `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| `tests/fixtures/page-render/marx-self-study-page.json` |
| `tests/utility-page-render.test.js` |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` |
| `fixtures/35-2-worked-example-fading-exemplar.md` |
| `observations/35-2-worked-example-fading.md` |

---

## Next slice

**35-3** — Embedded feedback and misconception interruption (support_note + assessment rhetoric, still no new feedback engine).

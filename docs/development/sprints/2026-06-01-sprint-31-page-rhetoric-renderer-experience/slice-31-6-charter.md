# Slice 31-6 charter — Assessment presentation refinement

**Status:** **Complete** (implemented 2026-06-01 — R31-007)  
**Slice:** 31-6  
**Date:** 2026-06-01

**Parent:** [`sprint-31-charter.md`](sprint-31-charter.md) §5–6  
**Predecessors:** [31-1](slice-31-1-charter.md) (R31-002) through [31-5](slice-31-5-charter.md) (R31-006)

---

## Goal

Improve **readability, pacing, scan hierarchy, and calmness** of **assessment** and **formative-check** presentation in rendered learner pages — so MCQ blocks and `assessment_check` sections feel **intentionally authored**, not mechanically dumped — while **preserving assessment semantics, correctness, feedback visibility rules, item order, and all wording** already in JSON.

**Governance line (non-negotiable):** Slice 31-6 may refine **assessment presentation and readability only**; it must **not** alter assessment meaning, correctness, feedback semantics, grading/visibility behaviour, or pedagogic intent.

**Second governance line:** Assessment rendering improvements must remain **structurally transparent** and **fully testable** — every visual change paired with fixture assertions; no untested CSS-only edits.

---

## Problem (observed)

Slices 31-1–31-5 improved metadata boundaries, cue hierarchy, knowledge-summary patterns, material polish, and activity-level dedupe/pacing. **Assessment sections** remain a distinct readability gap on RNA/kitchen-sink and shape fixtures ([`sprint-31-charter.md`](sprint-31-charter.md) §4; [`probe-31-10-rna-density-notes.md`](context-files/probe-31-10-rna-density-notes.md)):

| Issue | Observation |
|-------|-------------|
| **Question vs options visually similar** | Stem (`.util-assessment-item-body`) and options (`.util-assessment-options`) share similar font size/weight; scan path from “Question N” to choices is not crisp |
| **Formative section density** | `.util-assessment-list` stacks many `article.util-assessment-item` cards with similar chrome to activity `.util-task-block` — formative checks can feel as heavy as full activities |
| **Option rhythm** | Lettered MCQ options need consistent line-height, spacing, and separation from stem; true/false lists (`.util-true-false-options`) should stay distinct from checkbox materials |
| **Inline vs grid feedback** | `renderQuestionBlocks` supports `feedbackDisplay` modes (`answer_grid_end`, `reflection_then_answers`, etc.) — presentation polish must **not** change when answers/explanations appear |
| **Answer key block** | `.util-assessment-key` at section end needs calm hierarchy vs question cards |
| **Checkbox confusion risk** | Rubric **row 12**: MCQ letter options must not read as `util-checkbox-list` (guarded in `utility-page-render.test.js`) |
| **STEM / humanities / future stats** | RNA `assessment_check` (10 items); kitchen-sink formative section; `shape-structured-assessment-mcq.json` — no dedicated quantitative stats page yet ([`evidence-pages-marx-rna.md`](context-files/evidence-pages-marx-rna.md) P31-03 placeholder) |
| **Prior slices deferred assessment** | 31-4/31-5 explicitly limited assessment changes to **regression only** — 31-6 is the dedicated assessment presentation slice |

**31-5 resolved:** activity dedupe and framing pacing. **31-6 targets:** `assessment_check` section and item chrome only.

---

## In scope

| Item | Detail |
|------|--------|
| **R-layer only** | `renderAssessmentCheckSectionBlock`, `renderQuestionBlocks`, `renderAssessmentItemArticle`, MCQ/TF option list renderers, `utilityRenderPageSections` assessment dispatch; embedded CSS |
| **Section shell** | `.util-assessment-section`, `.util-assessment-list` — spacing, section→first-item rhythm |
| **Item card** | `article.util-assessment-item` — calmer borders/background vs activity task cards; preserve `.util-assessment-number`, `.util-assessment-title`, `.util-assessment-item-header` |
| **Stem vs options** | Visual tier: e.g. `.util-assessment-stem` / `.util-assessment-prompt` wrapper or CSS on `.util-assessment-item-body` vs `.util-assessment-options` — **no** stem text edits |
| **MCQ option list** | `.util-assessment-options` typography, margins, list-style rhythm; preserve option **order** and **letter+text** concatenation from JSON |
| **True/false** | `.util-true-false-options` distinct from materials checkbox lists |
| **Answer key / grid** | `.util-assessment-key`, `.util-assessment-key-title` spacing only when touched — **do not** change grid content assembly |
| **Formative heading** | Section icon + `h2.util-section-heading` for `assessment_check` — presentation only |
| **Print / export** | Extend existing `@media print` rules for `article.util-assessment-item` where already in V26_5 |
| **`getUtilityPagePresentationCssV31_6()`** | Assessment-specific pacing rules; append via `getUtilityPagePresentationCss()` |
| **Tests** | Extend listed utility tests; optional `shape-assessment-formative-rhythm.json` only if kitchen-sink + `shape-structured-assessment-mcq.json` insufficient |
| **Manual review** | Kitchen-sink formative section + RNA `assessment_check`; rubric **row 12**; probes `probe-31-11-kitchen-sink-assessment-notes.md`, `probe-31-12-rna-assessment-notes.md` (create on implement) |

### Assessment kinds (implementation map)

| Kind | Existing hooks | 31-6 intent |
|------|----------------|-------------|
| **Structured MCQ** | `extractRenderableMcqOptions`, `renderMcqOptionsList`, `shape-structured-assessment-mcq.json` | Stem/options hierarchy; options not checkbox lists |
| **Object-key options** | RNA fixture rows with `options` object/array | Preserve keys and order; improve list rhythm |
| **True/false** | `renderTrueFalseOptionsList`, `.util-true-false-options` | Calm binary choice presentation |
| **Primitive / fallback rows** | `renderAssessmentItemArticle` + `utilityRenderPrimitive` | Softer fallback chrome without dropping content |
| **Feedback modes** | `renderQuestionBlocks` + `renderOpts.feedbackDisplay` | **Regression only** — visibility unchanged |
| **Composition visibility** | `utility-ld-assessment-visibility-render.test.js` | **Regression only** — no change to hide/show rules |

---

## Out of scope (31-6)

| Excluded | Notes |
|----------|--------|
| **Answer correctness changes** | No regrading, no changing which option is “correct” |
| **Feedback logic** | No new explanations, rationales, or hints; no `areNearDuplicateFeedbackTexts` behaviour changes |
| **Visibility / grading semantics** | `feedbackDisplay`, `pageProfile`, answer-grid modes — regression tests only |
| **Item merge / suppress / reorder** | No omitting questions; no dedupe of assessment text (31-5 scope was activities) |
| **Rewriting stems or options** | No copy edits to assessment strings |
| **Generation / composition / schema** | Frozen |
| **PEC / metacognition / workflow** | Frozen |
| **Adaptive learner modelling** | No profile-based assessment adaptation |
| **Activity / material / knowledge layers** | Regression guards for 31-2–31-5 |
| **Metadata fold** | **31-1** — no regression |
| **Facilitated workshop inflation** | Character regression via `utility-ld-inflation-page-render.test.js` |
| **New assessment types** | No new parsers for novel JSON shapes beyond existing render paths |

---

## Current behaviour (baseline)

### Primary code paths

| Function | Role (approx.) |
|----------|----------------|
| `utilityRenderPageSections` | Dispatches `assessment_check` sections (~29107+) |
| `renderAssessmentCheckSectionBlock` | ~28706 — resolves rows, section heading, list wrapper |
| `renderQuestionBlocks` | ~28458 — per-item cards, feedback modes, answer grid |
| `renderAssessmentItemArticle` | ~28402 — `Question N` header + body |
| `renderMcqOptionsList` / option extractors | ~28390 — `<ul class="util-assessment-options">` |
| `renderTrueFalseOptionsList` | ~28452 — `.util-true-false-options` |
| `buildUtilityStructuredHtml` | Embeds `getUtilityPagePresentationCss()` including V26_5 assessment rules (~29502–29516) |

### Existing CSS (representative — V26_5)

| Class | Current role |
|-------|----------------|
| `.util-assessment-section` | Section margin |
| `.util-assessment-list` | Column flex, 14px gap |
| `article.util-assessment-item` | Cyan left border, `#fafcff` background |
| `.util-assessment-item-header` | Number badge + “Question N” |
| `.util-assessment-options` | Indented `<ul>` for lettered options |
| `.util-assessment-explanation` / `.util-assessment-answer` | Inline feedback blocks (when mode allows) |
| `.util-assessment-key` | End-of-section answer grid |

### Existing tests

| Test / fixture | Guards |
|----------------|--------|
| `tests/utility-page-render.test.js` | `shape-structured-assessment-mcq.json`; `assertMcqOptionsNotCheckboxLists` |
| `tests/utility-ld-rna-assessment-page-render.test.js` | 10 questions, options, section order, 31-1–31-5 smoke |
| `tests/utility-ld-assessment-visibility-render.test.js` | Composition `feedbackDisplay` / visibility modes |
| `tests/utility-renderer-kitchen-sink.test.js` | Formative section, answer-grid hides inline answers, no `util-assessment-explanation` in grid mode |
| `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` | Live-shaped RNA assessment |
| `tests/fixtures/page-render/renderer-kitchen-sink-page.json` | Formative assessment check section |

**Gaps to close in 31-6:** clearer stem/options visual tier; calmer item card weight vs activities; rubric row 12 on kitchen-sink + RNA; testable V31_6 CSS markers.

---

## Design intent

### Visual hierarchy (within assessment section)

| Tier | Elements | Intent |
|------|----------|--------|
| **Section** | `h2` + `.util-assessment-section` | Clear “formative check” landmark |
| **Item header** | Number + “Question N” | Scan anchor per item |
| **Stem** | Statement / stem in item body | Primary reading focus for the question |
| **Options** | `.util-assessment-options` | Secondary, easy vertical scan |
| **Feedback** | Answer/explanation (when visible) | Tertiary; subordinate to stem/options |
| **Answer key** | `.util-assessment-key` | End block; visually separated from items |

### Presentation rules

1. **Preserve all assessment text** — stems, options, rationales (when rendered) appear verbatim.  
2. **Preserve item order** — array iteration order unchanged.  
3. **Preserve option order** — A, B, C… sequence from JSON.  
4. **Preserve feedback visibility** — same HTML presence/absence per `feedbackDisplay` / composition metadata as today.  
5. **No new assessment content** — no placeholder questions, no invented distractors.  
6. **Calmer than activities** — assessment cards slightly lighter or more compact than `.util-activity-task--primary` so formative checks do not dominate the page.  
7. **Checkbox disambiguation** — MCQ options remain `<ul class="util-assessment-options">`, never `util-checkbox-list`.  
8. **Print-friendly** — items avoid awkward breaks where existing print rules allow.

### Resolved programme decision (R31-007 candidate)

**Slice 31-6 = renderer presentation refinement for assessment blocks only** — no answer-semantic, feedback, grading, schema, or generation-layer changes.

---

## Acceptance criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-1 | All assessment items in kitchen-sink, RNA, and `shape-structured-assessment-mcq.json` still render | Existing + new 31-6 tests |
| AC-2 | MCQ options use `.util-assessment-options` (not `util-checkbox-list`) | `assertMcqOptionsNotCheckboxLists`, kitchen-sink |
| AC-3 | Option **order** and **wording** preserved | RNA option strings; shape fixture Option alpha/beta/gamma |
| AC-4 | Question **stems** preserved exactly | Regex on known stems |
| AC-5 | **No new** assessment instructional text in HTML | Negative assertion on invented placeholders |
| AC-6 | **No** answer-semantics or feedback-visibility behaviour change | `utility-ld-assessment-visibility-render.test.js` unchanged pass; kitchen-sink answer-grid tests |
| AC-7 | **No** JSON, generation, composition, or schema changes | Diff scope review |
| AC-8 | **31-1** metadata intact | `About this page`, `util-meta` |
| AC-9 | **31-2–31-5** regression intact | Framing, knowledge-summary, materials stack, activity dedupe tests |
| AC-10 | Rubric **row 12** pass on kitchen-sink + RNA | Probes 31-11/31-12 |
| AC-11 | Full suite **≥ 497** pass / **0** fail | `node --test tests/*.test.js` |
| AC-12 | `getUtilityPagePresentationCssV31_6()` rules testable in export HTML | CSS substring assertions |

---

## Implementation checklist

- [x] Audit `renderAssessmentCheckSectionBlock` / `renderQuestionBlocks` / `renderAssessmentItemArticle` — document stem/options DOM
- [x] Audit feedback modes — confirm no visibility logic changes in 31-6 diff
- [x] Add stem wrapper `.util-assessment-prompt` and `.util-assessment-choices` (presentation only)
- [x] Tune `.util-assessment-item--formative` / `.util-assessment-list` spacing vs activity cards
- [x] Add `getUtilityPagePresentationCssV31_6()` — stem/options rhythm, section pacing, print tweaks
- [x] Extend tests — stem present, options order, MCQ≠checkbox, visibility regression, V31_6 CSS
- [x] Optional `shape-assessment-formative-rhythm.json` skipped — existing fixtures sufficient
- [x] Manual probes kitchen-sink + RNA (row 12); probes 31-11/31-12
- [x] Record **R31-007** in [`review-log.md`](review-log.md)
- [x] Update [`CURRENT-STATE.md`](CURRENT-STATE.md), [`baseline-test-floor.md`](baseline-test-floor.md)
- [x] Update [`context-files/renderer-hooks.md`](context-files/renderer-hooks.md)
- [x] Programme close review — Sprint 31 complete

---

## Regression guards

| Page / suite | Test file | Expect |
|--------------|-----------|--------|
| Structured MCQ shape | `tests/utility-page-render.test.js` | Options not checkbox lists; stem preserved |
| RNA assessment | `tests/utility-ld-rna-assessment-page-render.test.js` | 10 items, options, order; 31-1–31-5 smoke |
| Assessment visibility | `tests/utility-ld-assessment-visibility-render.test.js` | **No behaviour change** — full pass |
| Kitchen-sink formative | `tests/utility-renderer-kitchen-sink.test.js` | Section, answer-grid mode, item count |
| Marx / framing | `tests/utility-marx-page-render.test.js` | No assessment regression on non-assessment pages |
| Activity dedupe | `tests/utility-page-render.test.js` (`shape-activity-echo-dedupe.json`) | 31-5 intact |
| Workshop inflation | `tests/utility-ld-inflation-page-render.test.js` | Facilitated assessment section still renders |
| Metadata fold | `tests/utility-page-render.test.js` | `util-meta` |

---

## Manual review rubric focus

Primary: [`presentation-review-rubric.md`](context-files/presentation-review-rubric.md)

| Rows | Focus |
|------|--------|
| **12** | **Primary** — MCQ/options readable; no checkbox-list confusion |
| **1–3** | Regression — page calmness with assessment section present |
| **4–5** | Regression — activity task hierarchy (31-2) |
| **6–9** | Regression — metadata (31-1) |
| **10–11** | Regression — knowledge + materials (31-3, 31-4) |
| **13–14** | Pedagogy preserved; no facilitator leakage |

**Evidence:** [`evidence-pages-marx-rna.md`](context-files/evidence-pages-marx-rna.md) — **P31-02 RNA** (`assessment_check`), kitchen-sink formative section, `shape-structured-assessment-mcq.json`.

---

## Tests likely extended

| File | Planned assertions |
|------|-------------------|
| `tests/utility-page-render.test.js` | MCQ shape stem/options classes; order; CSS markers |
| `tests/utility-ld-rna-assessment-page-render.test.js` | Item/options structure; 31-6 presentation smoke |
| `tests/utility-ld-assessment-visibility-render.test.js` | **Run unchanged** — must still pass |
| `tests/utility-renderer-kitchen-sink.test.js` | Formative section hierarchy; answer-grid regression; V31_6 CSS |

**Optional fixture:** `tests/fixtures/page-render/shape-assessment-formative-rhythm.json` — multi-item formative block with stem + 4 options (only if existing fixtures insufficient).

**Pattern:** class names, stem/option text, option order index, `feedbackDisplay` outcomes, embedded `<style>` substrings — not screenshots.

---

## Files likely touched (implementation phase only)

| File | Change |
|------|--------|
| `app.js` | `renderAssessmentItemArticle`, `renderQuestionBlocks`, `renderMcqOptionsList`, `getUtilityPagePresentationCssV31_6` |
| `tests/utility-page-render.test.js` | MCQ + presentation assertions |
| `tests/utility-ld-rna-assessment-page-render.test.js` | RNA assessment polish smoke |
| `tests/utility-renderer-kitchen-sink.test.js` | Formative section + grid regression |
| `tests/utility-ld-assessment-visibility-render.test.js` | **Verify pass only** (no test edits unless fixture drift) |
| `tests/fixtures/page-render/shape-assessment-formative-rhythm.json` | Optional |
| Sprint 31 docs | CURRENT-STATE, review-log R31-007, probes, baseline, renderer-hooks, programme close note |

---

## Success rubric (manual)

| Question | Pass |
|----------|------|
| Can a learner scan Question → options in one pass? | **Yes** |
| Do MCQ options look like choices, not checklist tasks? | **Yes** |
| Is every question and option from JSON still on the page? | **Yes** |
| Does answer-grid / hidden-answer mode behave as before? | **Yes** |
| Does the formative section feel calmer than pre–31-6 without feeling empty? | **Yes** |

---

## Programme note

Slice **31-6** is the **final planned slice** in [`sprint-31-charter.md`](sprint-31-charter.md) §6. After implementation and R31-007, update programme status to **complete** (or open a follow-up charter only for out-of-scope items such as P31-03 stats fixture capture).

---

**Implemented 2026-06-01 (R31-007). Sprint 31 programme complete.**

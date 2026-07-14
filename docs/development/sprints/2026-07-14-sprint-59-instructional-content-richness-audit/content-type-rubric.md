# Sprint 59 — Content-Type Richness Rubric

**Status:** Initial rubric. Numeric ranges are **hypotheses to validate** during Sprint 59 — not final product gates.

**Companion:** Content type scores presentation-shaped units. Pedagogical function is tracked separately via the [Instructional Archetype Framework](instructional-archetype-framework.md) (`Material type ≠ Instructional archetype`).

## Richness scores (standard terminology)

| Score | Label | Meaning |
| ----- | ----- | ------- |
| `1` | Thin | Below minimum acceptable richness for the content type |
| `2` | Barely adequate | Meets minimum but weak; notable gaps |
| `3` | Sufficient | Meets validated (or provisional) richness criteria |
| `4` | Rich | Clearly above minimum; still proportionate |

**Verbosity flag:** `V` — **separate from** the 1–4 richness score. Mark when content is over-verbose regardless of whether the richness score is 1, 2, 3, or 4. `V` is not a fifth richness level. Do not use “Excessive” as an alternative score label.

A lesson may show e.g. score `3` Sufficient **and** `V` if content meets richness but is unnecessarily long.

---

## How to use

1. Score only types **present** in the sample.
2. Record score (1–4), optional `V`, 1-line rationale, canonical owner, and JSON path.
3. If HTML looks thin but JSON is rich → prefer **renderer** classification, not a low generation score.
4. After pilot calibration (~3 lessons), update criteria and bump rubric version — see [audit-plan.md](audit-plan.md#rubric-calibration-checkpoint).

---

## Knowledge summary

| | |
| --- | --- |
| **Purpose** | Orient learners to core concepts and relations before/alongside activities |
| **Minimum acceptable richness (hypothesis)** | ~120–250 words; names ≥3 substantive concepts and ≥1 relationship or contrast |
| **Too thin** | Glossary dump; restates LOs only; &lt;80 words with no relations |
| **Unnecessary verbosity** | Essay replacing activity learning; repeats full materials |
| **Renderer dependencies** | Section placement, typography, collapse/overflow of `page_synthesis` |
| **Measurable indicators** | Word count; concept mentions; presence of relations/contrast |

## Learning journey

| | |
| --- | --- |
| **Purpose** | Overview / purpose / sequencing frame across the page |
| **Minimum (hypothesis)** | Clear start state, path through activities, end state; ~80–180 words combined overview+purpose |
| **Too thin** | Single sentence; no path; no reason to care |
| **Unnecessary verbosity** | Narrative that re-teaches content |
| **Renderer dependencies** | Order of overview vs activities; journey chrome |
| **Indicators** | Presence of overview + purpose; mentions of activity order |

## Activity instructions

| | |
| --- | --- |
| **Purpose** | What the learner does, produces, and how they know they are done |
| **Minimum (hypothesis)** | Explicit task + expected output; ≥2 learner actions; references available materials by role |
| **Too thin** | Vague “discuss/reflect”; no product; actions exceed materials |
| **Unnecessary verbosity** | Repeats full material bodies inside instructions |
| **Renderer dependencies** | Field visibility (preamble, cognition, expected_output) |
| **Indicators** | Action count; presence of expected_output; material references |

## Explanatory text

| | |
| --- | --- |
| **Purpose** | Teach or clarify concepts (often GAM text material) |
| **Minimum (hypothesis)** | Multi-paragraph explanation with ≥1 example or illustration (~150+ words depending on LO) |
| **Too thin** | Definition-only; placeholder/synopsis line |
| **Unnecessary verbosity** | Unbounded essay without checkpoints |
| **Renderer dependencies** | Markdown rendering, heading hierarchy |
| **Indicators** | Word count; example count; heading structure |

## Worked example

| | |
| --- | --- |
| **Purpose** | Show expert process step-by-step |
| **Minimum (hypothesis)** | ≥3 visible steps; intermediate reasoning; final result; brief “why this move” |
| **Too thin** | Answer only; one-step leap |
| **Unnecessary verbosity** | Unrelated digressions |
| **Renderer dependencies** | Ordered lists, math, code blocks |
| **Indicators** | Step count; presence of intermediate products |

## Scenario

| | |
| --- | --- |
| **Purpose** | Situated decision / application context |
| **Minimum (hypothesis)** | Named actors/roles; stakes; ≥2 concrete constraints or data points; decision prompt |
| **Too thin** | Two generic sentences; no stakes; no particulars |
| **Unnecessary verbosity** | Novel-length prose with no task |
| **Renderer dependencies** | Scenario block styling; length truncation |
| **Indicators** | Scenario detail count; presence of decision prompt |

## Case study

| | |
| --- | --- |
| **Purpose** | Extended real/realistic case for analysis |
| **Minimum (hypothesis)** | Background + evidence/data + analysis prompt; enough context to answer without inventing facts |
| **Too thin** | Headline + question only |
| **Unnecessary verbosity** | Unstructured dump |
| **Renderer dependencies** | Multi-section case layout |
| **Indicators** | Context paragraphs; evidence artefacts; prompt clarity |

## Reflection prompt

| | |
| --- | --- |
| **Purpose** | Metacognitive / sense-making response |
| **Minimum (hypothesis)** | Specific referent (activity/concept); answerable in short prose |
| **Too thin** | “What did you think?” |
| **Unnecessary verbosity** | Multi-essay demands for short sessions |
| **Renderer dependencies** | Prompt placement near related activity |
| **Indicators** | Specificity; time-to-answer estimate |

## Discussion prompt

| | |
| --- | --- |
| **Purpose** | Peer/dialogic exchange (when delivery supports it) |
| **Minimum (hypothesis)** | Contestable claim or comparison; roles clear |
| **Too thin** | Yes/no or content-free chat seed |
| **Unnecessary verbosity** | Too many simultaneous threads |
| **Renderer dependencies** | Visibility in self-study vs facilitated profiles |
| **Indicators** | Contestable focus; role clarity |

## Formative assessment

| | |
| --- | --- |
| **Purpose** | Practice / checkpoint aligned to learning |
| **Minimum (hypothesis)** | Clear intent in design; items answerable from page materials; feedback path |
| **Too thin** | Token quiz; unaligned |
| **Unnecessary verbosity** | High-stakes volume mid-learning |
| **Renderer dependencies** | Check interaction; feedback display |
| **Indicators** | Item–LO map; feedback presence |

## Summative assessment

| | |
| --- | --- |
| **Purpose** | Endpoint evidence of LO mastery |
| **Minimum (hypothesis)** | Design states evidence model; items cover priority LOs; marking path |
| **Too thin** | Single shallow item for multi-LO lesson |
| **Unnecessary verbosity** | Unrealistic length for stated duration |
| **Renderer dependencies** | Assessment section ordering |
| **Indicators** | Coverage; marking guidance presence |

## MCQ

| | |
| --- | --- |
| **Purpose** | Selected-response check |
| **Minimum (hypothesis)** | Clear stem; ≥3 options; plausible distractors; keyed answer when profile allows |
| **Too thin** | Obvious options; stem without concept |
| **Unnecessary verbosity** | Overlong stems; trick trivia |
| **Renderer dependencies** | Option layout; answer reveal policy |
| **Indicators** | Distractor plausibility note; LO link |

## Short-answer item

| | |
| --- | --- |
| **Purpose** | Brief constructed response |
| **Minimum (hypothesis)** | Constrained scope; sample/marking points |
| **Too thin** | Unbounded short box question |
| **Unnecessary verbosity** | Multiple full LO essays under “short” |
| **Renderer dependencies** | Input affordance; guidance text |
| **Indicators** | Scope words; marking points present |

## Extended-response item

| | |
| --- | --- |
| **Purpose** | Sustained argument/analysis |
| **Minimum (hypothesis)** | Criteria/rubric cues; evidence expectation; align to case/scenario materials |
| **Too thin** | Broad essay with no scaffold |
| **Unnecessary verbosity** | Multiple unprioritised essays |
| **Renderer dependencies** | Space/layout for long answers |
| **Indicators** | Criteria presence; material dependency |

## Feedback / rationale

| | |
| --- | --- |
| **Purpose** | Explain correctness / misconception |
| **Minimum (hypothesis)** | Concept-linked reason, not “correct/incorrect” only |
| **Too thin** | Binary only |
| **Unnecessary verbosity** | Full retelling of chapter |
| **Renderer dependencies** | Expand/collapse; answer-key policy |
| **Indicators** | Presence of rationale text length |

## Study tips

| | |
| --- | --- |
| **Purpose** | Closure / how to consolidate learning |
| **Minimum (hypothesis)** | ≥2 actionable tips tied to this lesson’s activities |
| **Too thin** | Generic “revise your notes” |
| **Unnecessary verbosity** | Second mini-lesson |
| **Renderer dependencies** | Placement at end |
| **Indicators** | Tip count; lesson specificity |

---

## Validation / calibration log (fill after pilot)

Complete after the ~3-lesson pilot per [audit-plan.md](audit-plan.md#rubric-calibration-checkpoint).

| Content type | Criterion retained / revised | Reason | Supporting lesson IDs | Rubric version | Pilot rescored? |
| ------------ | ----------------------------- | ------ | --------------------- | -------------- | --------------- |
| Scenario | | | | v0.1 | |
| Worked example | | | | | |
| … | | | | | |

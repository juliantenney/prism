# Slice 31-2 charter — Cue hierarchy & visual weighting

**Status:** **Complete** (2026-06-01 — R31-003)  
**Slice:** 31-2  
**Date:** 2026-06-01

**Parent:** [`sprint-31-charter.md`](sprint-31-charter.md) §5–6  
**Predecessor:** [Slice 31-1 complete](slice-31-1-charter.md) (R31-002)

---

## Goal

Improve **rendered cue hierarchy** on self-directed learner pages so activity blocks feel **calmer and more authored**, while **preserving every Sprint 30 pedagogic cue** that exists in JSON. Learners should scan **what to do first**; orientation, reasoning, cognition, and support content remain **available** but read as **secondary rails**, not competing headlines.

**Design position (non-negotiable for this slice):** Sprint 31-2 may **reduce visual prominence** of support cues; it must **not** reduce their availability or semantic completeness.

---

## Problem (observed)

Recorded in programme charter, Sprint 30 retrospective, and post–31-1 probes ([`probe-31-01-marx-render-notes.md`](context-files/probe-31-01-marx-render-notes.md), [`probe-31-02-rna-render-notes.md`](context-files/probe-31-02-rna-render-notes.md)):

| Issue | Observation |
|-------|-------------|
| **Equal visual weight on cues** | `.util-pel-orientation-cue` and `.util-pel-reasoning-cue` share similar size, colour, and spacing (~`.92rem`, `#334155` body); hard to distinguish support from action |
| **Preamble blocks compete with task** | `.util-activity-preamble` uses indigo left border + `#f8fafc` fill — visually similar weight to `.util-cognition` boxes |
| **Stacked cue fatigue** | Marx/RNA activities stack study orientation, intellectual frame, coherence bridge, “How to think”, evidence/contrast cues, then cognition — reads as **assembled template**, not authored flow |
| **Task not dominant enough** | `.util-activity-task` has spacing/border but heading scale is only modestly stronger than preamble cues |
| **Cognition vs PEL unclear** | `.util-cognition` blocks (~`.92rem` body) sit between task and materials with similar “boxed” treatment to framing |
| **Rubric gap after 31-1** | Metadata boundary (rubric rows 7–9) passes; **calmness/hierarchy rows 1–5** still partial on Marx/RNA |

**31-1 resolved:** production metadata demoted to `details.util-meta`. **31-2 targets:** in-activity hierarchy only.

---

## In scope

| Item | Detail |
|------|--------|
| **R-layer only** | `renderActivityFramingForActivity`, `renderLearningActivitiesBlocks`, `renderCognitionFieldsForActivity`; embedded CSS in `getUtilityPagePresentationCss()` / `getUtilityCognitionPresentationCss()` / `buildUtilityStructuredHtml` style assembly |
| **Visual weighting** | Typography, colour, spacing, borders, margins — de-emphasise framing/cognition relative to **What to do** |
| **PEL cue classes preserved** | Keep `.util-pel-orientation-cue`, `.util-pel-reasoning-cue`, labels (`Study orientation:`, `How to think:`, etc.) — tests depend on them |
| **Cue order preserved** | Orientation cues before reasoning cues where already rendered (see `renderActivityFramingForActivity` order + existing framing tests) |
| **Optional structural wrapper** | e.g. `.util-activity-framing` wrapping framing HTML only — **no** content omission |
| **Differentiate cue tiers in CSS** | e.g. orientation vs reasoning vs generic preamble-cue vs study-orientation block — **presentation only** |
| **Task prominence** | Strengthen `.util-activity-task` (heading size/weight, spacing before materials) without changing task **copy** |
| **Cognition demotion** | Lighter `.util-cognition` chrome vs task block; preserve `data-cognition-field`, modifiers (`util-cognition--revision`, etc.) |
| **Support notes** | `.util-support-note` remains subordinate to task (size/colour/spacing only if touched) |
| **Tests** | Extend listed utility test files with **structural + CSS-in-HTML** assertions (no visual-only change) |
| **Manual review** | Marx + RNA live re-render; score rubric rows **1–5** and **13–14**; capture in `probe-31-03-*.md`, `probe-31-04-*.md` |

---

## Out of scope (31-2)

| Excluded | Notes |
|----------|--------|
| **Cue dedupe / omit** | Slice **31-5** — no `display:none`, no skipping cues because text duplicates task |
| **Cue prose rewrite** | No label copy changes unless required for a11y (unlikely) |
| **PEL / JSON schema** | No new fields, no `orientation_contract` / `reasoning_contract` changes |
| **Generation / composition / orchestration** | No DLA, GAM, Design Page, workflow, prompts |
| **`metacognition_contract`** | Deferred Phase 3 — do not reopen |
| **Adaptive visibility / learner modelling** | No runtime show/hide based on profile beyond existing gates |
| **Metadata boundary** | **31-1** complete — do not regress `util-meta` |
| **Concept / material / assessment polish** | Slices **31-3**, **31-4**, **31-6** |
| **Facilitated workshop character** | Inflation/climate pages — regression guard only |
| **Changing activity block DOM order** | Framing → task → cognition → materials order stays as today |

---

## Current behaviour (baseline)

### Render order inside `renderLearningActivitiesBlocks` (~27177–27205)

1. Activity header (`h3` + badges)  
2. `renderActivityFramingForActivity(row)` — preamble + PEL cues  
3. Optional legacy `Task:` paragraph (`purposeTask`)  
4. **What to do** — `.util-activity-task`  
5. Optional **Guidance**  
6. `renderCognitionFieldsForActivity` — `.util-cognition`  
7. Materials — `.util-activity-materials`  
8. Expected output / support note  

### `renderActivityFramingForActivity` (~25293–25381)

| Output | Classes / labels |
|--------|------------------|
| Study orientation block | `.util-activity-preamble.util-activity-study-orientation`, label **Study orientation:** |
| Orientation PEL cues | `.util-activity-preamble-cue.util-pel-orientation-cue` — Intellectual frame, Connection, Disciplinary lens, Using evidence, etc. |
| Generic preamble | `.util-activity-preamble` (markdown body) |
| Prior knowledge | `.util-activity-preamble-cue` — **Before you start:** (no `util-pel-orientation-cue` today) |
| Reasoning | `.util-activity-preamble-cue.util-pel-reasoning-cue` — **How to think:** |
| Dedupe | `comparableSeen` / `isDuplicateOfSeen` — **unchanged in 31-2** |

### Embedded CSS (representative, `getUtilityCognitionPresentationCss` ~29355–29378)

| Selector | Current feel |
|----------|----------------|
| `.util-activity-preamble` | `.95rem`, indigo border, filled background — **loud** |
| `.util-activity-preamble-cue` | `.92rem`, `#334155` |
| `.util-pel-orientation-cue` / `.util-pel-reasoning-cue` | Shared strong colour `#475569` — **similar weight** |
| `.util-activity-task` | Border-bottom, modest padding — **not clearly primary** |
| `.util-cognition` | Bordered box, `.92rem` body — **competes with framing** |

### Existing test contracts (must not break)

| File | Guards |
|------|--------|
| `tests/utility-self-directed-activity-framing.test.js` | PEL labels, orientation-before-reasoning index, Marx brief adoption |
| `tests/utility-renderer-kitchen-sink.test.js` | KS-A6/A7 cue labels and order |
| `tests/utility-renderer-cognition-fields.test.js` | Cognition blocks vs PEL; field labels in HTML |
| `tests/utility-marx-page-render.test.js` | Materials + 31-1 metadata boundary |
| `tests/utility-ld-rna-assessment-page-render.test.js` | Assessment section + 31-1 metadata |

**Gaps to close in 31-2:** CSS hierarchy so rubric rows 1–5 pass on Marx/RNA; automated checks that task styling is visually dominant **and** cue content remains in HTML.

---

## Design intent

### Visual hierarchy (learner-facing)

| Tier | Elements | Intent |
|------|----------|--------|
| **Primary** | `.util-activity-task` (“What to do”), activity `h3` | Dominant scan target — learner action |
| **Secondary** | `.util-pel-orientation-cue`, `.util-pel-reasoning-cue`, `.util-activity-preamble`, prior-knowledge cue | Support rails — smaller/lighter; readable on demand |
| **Tertiary** | `.util-cognition`, `.util-support-note` | Pedagogic depth — present, not headline |
| **Background** | Materials, meta fold | Separated by spacing; materials follow task |

### Presentation rules (implementation guidance)

1. **Task first visually** — increase contrast for `.util-activity-task` heading vs preamble cues (size, weight, colour).  
2. **Soften preamble boxes** — reduce border saturation / background fill on `.util-activity-preamble` and study-orientation block.  
3. **Differentiate PEL tiers** — orientation cues slightly lighter than reasoning **or** both subordinate with distinct left-accent; **do not** remove classes.  
4. **Group framing (optional)** — wrap `renderActivityFramingForActivity` output in `.util-activity-framing` with shared margin/padding so cues read as one rail.  
5. **Cognition quieter than task** — smaller labels, lighter border, more top margin after task.  
6. **Whitespace** — more space before task, less between stacked cues; rubric row 3.  
7. **No hiding** — every cue string present in JSON must still appear in HTML (unless already deduped by existing comparable-text logic).

### Resolved programme decision (R31-003 candidate)

**Cue de-emphasis for 31-2 = CSS / wrapper weighting only** — not structural collapse or omission. Renderer dedupe policy remains **31-5**.

---

## Acceptance criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-1 | PEL orientation + reasoning **content** still in HTML when present in JSON | `utility-self-directed-activity-framing.test.js`, kitchen-sink KS-A6/A7 |
| AC-2 | **Orientation before reasoning** where both present (index/order) | Existing framing tests unchanged |
| AC-3 | Cue **labels and classes** remain (`util-pel-orientation-cue`, `util-pel-reasoning-cue`, `Study orientation:`, `How to think:`, etc.) | Regex assertions in framing + kitchen-sink tests |
| AC-4 | **CSS or wrapper** changes make hierarchy testable — embedded stylesheet rules reference task prominence and cue de-emphasis (e.g. `.util-activity-task` font-size/weight > `.util-activity-preamble-cue`; preamble/cognition softened) | New assertions in kitchen-sink or dedicated 31-2 test block |
| AC-5 | **What to do** block appears after framing HTML in activity card DOM | Structural assertion on kitchen-sink / self-directed fixture |
| AC-6 | Cognition fields still render with `.util-cognition` / `data-cognition-field` when in JSON | `utility-renderer-cognition-fields.test.js` |
| AC-7 | **No facilitator leakage** on learner self-directed pages | Marx/RNA fixture + live render; no new facilitator-only headings in body |
| AC-8 | Marx fixture + Marx live JSON — rubric **1–5**, **13–14** pass | [`probe-31-03-marx-render-notes.md`](context-files/probe-31-03-marx-render-notes.md) (create on implement) |
| AC-9 | RNA fixture + RNA live JSON — rubric **1–5**, **13–14** pass | [`probe-31-04-rna-render-notes.md`](context-files/probe-31-04-rna-render-notes.md) (create on implement) |
| AC-10 | Full suite **≥ 475** pass / **0** fail | `node --test tests/*.test.js` |
| AC-11 | **31-1 metadata boundary** not regressed | Existing 31-1 tests in page-render, Marx, RNA |

---

## Implementation checklist

- [x] Audit `renderActivityFramingForActivity` output — order/labels unchanged; wrapper only
- [x] `.util-activity-framing` wrapper on framing join
- [x] Tune `getUtilityCognitionPresentationCss` — preamble, PEL cues, study-orientation
- [x] Tune `getUtilityPagePresentationCssV26_5` + `getUtilityPagePresentationCssV31_2` — primary task
- [x] Soften `.util-cognition` chrome
- [x] Secondary-tier styling for generic `.util-activity-preamble-cue` inside framing rail
- [x] Tests extended (+6); floor **481**
- [x] Probes [`probe-31-03-marx-render-notes.md`](context-files/probe-31-03-marx-render-notes.md), [`probe-31-04-rna-render-notes.md`](context-files/probe-31-04-rna-render-notes.md)
- [x] **R31-003** recorded
- [x] CURRENT-STATE, baseline-test-floor, HANDOVER updated

---

## Regression guards

| Page / suite | Test file | Expect |
|--------------|-----------|--------|
| Self-directed framing | `tests/utility-self-directed-activity-framing.test.js` | Cue order, labels, content |
| Kitchen-sink PEL | `tests/utility-renderer-kitchen-sink.test.js` | KS-A6/A7 + new hierarchy CSS markers |
| Cognition semantics | `tests/utility-renderer-cognition-fields.test.js` | Blocks present; PEL distinct |
| Marx materials + 31-1 | `tests/utility-marx-page-render.test.js` | No regression on materials/metadata |
| RNA assessment + 31-1 | `tests/utility-ld-rna-assessment-page-render.test.js` | Assessment order intact |
| Workshop inflation | `tests/utility-ld-inflation-page-render.test.js` | Facilitated character unchanged |
| Climate misconception | `tests/utility-ld-climate-misconception-page-render.test.js` | Facilitated regression |
| Metadata fold | `tests/utility-page-render.test.js` | `util-meta` / About this page |

---

## Manual review rubric focus

Primary: [`presentation-review-rubric.md`](context-files/presentation-review-rubric.md)

| Rows | Focus |
|------|--------|
| **1–3** | Calmness, density, whitespace — less stacked cue fatigue |
| **4–5** | Task dominant; orientation/reasoning subordinate |
| **13–14** | Sprint 30 cues still in HTML; no facilitator leakage |
| **6–9** | Regression check only (31-1) — should remain pass |
| **10–12** | Out of scope — note only |

---

## Tests likely extended

| File | Planned assertions |
|------|-------------------|
| `tests/utility-self-directed-activity-framing.test.js` | Content present; orientation index &lt; reasoning index; optional CSS rule substring in HTML |
| `tests/utility-renderer-kitchen-sink.test.js` | Hierarchy CSS markers; KS-A6/A7 content + order preserved |
| `tests/utility-renderer-cognition-fields.test.js` | Cognition blocks still rendered; not visually removed from DOM |
| `tests/utility-marx-page-render.test.js` | Live/fixture: PEL cue strings present; task section exists |
| `tests/utility-ld-rna-assessment-page-render.test.js` | Live/fixture: reasoning cues present where in JSON; assessment untouched |

**Pattern:** assert on **class names**, **label text**, **DOM order**, and **embedded `<style>` rule substrings** — not pixel/screenshot comparison.

---

## Files likely touched (implementation phase only)

| File | Change |
|------|--------|
| `app.js` | `renderActivityFramingForActivity` (wrapper only if needed); `getUtilityCognitionPresentationCss`, `getUtilityPagePresentationCssV26_5` |
| `tests/utility-self-directed-activity-framing.test.js` | Hierarchy / preservation |
| `tests/utility-renderer-kitchen-sink.test.js` | CSS + KS-A6/A7 guards |
| `tests/utility-renderer-cognition-fields.test.js` | Preservation |
| `tests/utility-marx-page-render.test.js` | Cue presence + hierarchy smoke |
| `tests/utility-ld-rna-assessment-page-render.test.js` | Cue presence + hierarchy smoke |
| Sprint 31 docs | CURRENT-STATE, review-log, probes 31-03/31-04, baseline floor |

---

## Success rubric (manual)

| Question | Pass |
|----------|------|
| Can a learner find **what to do** within ~5s? | **Yes** |
| Do orientation/reasoning cues feel like **support**, not the main lesson? | **Yes** |
| Is full Sprint 30 guidance still visible when scrolling an activity? | **Yes** |
| Does Marx/RNA feel less like stacked template chrome? | **Yes** |

---

**Implemented** 2026-06-01 per R31-003.

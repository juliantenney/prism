# Slice 36-3 — Semantic visual grammar for pedagogical roles

**Date:** 2026-06-03  
**Status:** Complete  
**Regression:** `node --test tests/*.test.js` → **589 pass / 0 fail**

**Predecessors:** [36-1-hierarchy-scanability-ci-marx-climate.md](36-1-hierarchy-scanability-ci-marx-climate.md), [36-2-pacing-density-choreography.md](36-2-pacing-density-choreography.md)

---

## Goal

Answer: can a learner quickly distinguish task/action, cognition, worked example, faded template, scenario/judgement, output milestone, support note, assessment checkpoint, and closure/debrief — using **subtle, consistent** cues — without louder decoration or a new theme?

---

## Implementation summary

### Presentation layer: `getUtilityPagePresentationCssV31_9()`

Appended after V31_8 in `getUtilityPagePresentationCss()`. Restrained grammar: left borders, light backgrounds, typography, spacing — no new card types, gradients, or badge expansion.

| Role hook | CSS intent |
|-----------|------------|
| `util-material-role-action` | Primary task: slate left border, heading weight |
| `util-material-role-thinking` | Cognition band: neutral fill, no warning box; variant borders for explain / transfer / uncertainty / scaffold / revision |
| `util-material-role-model` | Worked example: solid slate border, cool grey fill (modelled reasoning) |
| `util-material-role-practice` | Template/worksheet: dashed border, lighter fill (partial practice) |
| `util-material-role-scenario` | Scenario card: teal accent, judgement-oriented title tone |
| `util-material-role-inquiry` | Prompt set: blue inquiry band |
| `util-material-role-checklist` | Self-check list: slate checklist band |
| `util-material-role-deliverable` | Output milestone: green left rule, deliverable heading tone |
| `util-material-role-guidance` | Support note: thinner border, muted label (uppercase micro-label) |
| `util-material-role-checkpoint` | Assessment section: top rule, item background (checkpoint, not activity card) |
| `util-material-role-phase` + close/orient/selfcheck | Phase cues: distinct from material `h4` headings (36-2 compatibility) |

**Print:** Role backgrounds forced to white; checkpoint border desaturated.

### Minimal renderer hooks (`util-material-role-*`)

Stable semantics on existing wrappers only — no workflow or schema change.

| Class | Wired on |
|-------|----------|
| `util-material-role-action` | `.util-activity-task--primary` |
| `util-material-role-thinking` | `.util-cognition` |
| `util-material-role-model` | `.util-worked-example` |
| `util-material-role-practice` | `.util-template-block.util-material-template` |
| `util-material-role-scenario` | `.util-scenario-card` |
| `util-material-role-inquiry` | `.util-prompt-set` |
| `util-material-role-checklist` | `.util-checklist-block` |
| `util-material-role-deliverable` | `.util-output-block` |
| `util-material-role-guidance` | `.util-support-note` |
| `util-material-role-checkpoint` | `.util-assessment-section` |
| `util-material-role-phase` / `close` / `orient` / `selfcheck` | `utilityMaterialSessionPhaseCueClass(title)` on session phase subheads |

---

## Before → after (36-2 baseline → 36-3)

### Role legibility (primary question)

| Role | Before (36-2) | After (36-3) |
|------|---------------|--------------|
| Task / action | Strong card + primary box; similar weight to dense materials | **Slate left rule** on primary task distinguishes “do this” from materials |
| Cognition | Stronger band (36-2) but same border for all types | **Thinking** role: neutral band; **variant** left accents (not warning boxes) |
| Worked example vs template | Both in materials stack; template dashed, example prose block | **Model** (solid slate) vs **practice** (dashed, worksheet fill) — side-by-side scan |
| Scenario / judgement | Scenario card + debrief `h3` (36-2) | **Teal scenario** role + title tone — evaluative, not generic prose |
| Output vs support | Milestone rule + dashed support (36-2) | **Deliverable** green milestone vs **guidance** muted aside with micro-label |
| Assessment | Section margin (36-2) | **Checkpoint** top rule + item tint — distinct from `article.util-task-block` |
| Closure / debrief | Phase cue uppercase (36-2) | Phase **close** sub-role; material `h4` headings keep letter-spacing without competing cues |

### Anchor pages (manual review targets)

| Anchor | 36-3 effect |
|--------|-------------|
| CI golden (`confidence-interval-a2-multitable-page.json`) | A1 model vs A2 template; A4 scenario; cognition before materials; assessment checkpoint; closure phase |
| Marx self-study | Template practice + phase cues; scenario/discussion materials inherit inquiry/scenario grammar where rendered |
| Kitchen sink | All major material roles present in one HTML contract |
| Climate misconception | Template + prompt set + checklist + deliverable output; card grid unchanged structurally |
| Inflation workshop (fixture) | Scenario counts preserved; multi-class attributes on scenario divs |

---

## Visual calmness

- No new icons, gradients, or saturated badges.
- Cognition deliberately **not** styled as alerts (no amber/red warning panels).
- Worked example **less** yellow than template accent — model reads as reference, practice as incomplete worksheet.
- Phase cues from 36-2 retained; V31_9 only adds sub-role nuance (close vs orient vs self-check).

---

## Cognition emphasis

- `util-material-role-thinking` reinforces “prompt to think” without competing with task box.
- Field modifiers (`--explain`, `--transfer`, `--uncertainty`, `--scaffold`, `--revision`) remain; V31_9 adds 2px left accents only.
- Misconception/repair paths keep `--repair` modifier (unchanged semantics).

---

## Assessment separation

- `util-material-role-checkpoint` on assessment **section** wrapper — visually breaks from activity card rhythm.
- Formative items keep existing `util-assessment-item` structure; light background tint only.

---

## Print impact

- `@media print` in V31_9: role tinted backgrounds → white; checkpoint border → `#ccc`.
- No `break-before` changes beyond 36-2; scenario/prompt avoid rules unchanged.

---

## Rejected scope creep

| Rejected | Reason |
|----------|--------|
| New theme engine / design tokens | Charter: presentation CSS only |
| Decorative icon set per role | Existing FA icons sufficient |
| Misconception as warning cards | Would read as errors, not pedagogy |
| New card components for assessment | Checkpoint = section grammar |
| Sprint 32 diagram workflow | Out of charter |
| Schema / workflow / producer changes | Out of scope |
| High-saturation role colours | Breaks calm academic tone |

---

## Tests updated

| File | Change |
|------|--------|
| `utility-page-render.test.js` | Golden role-class asserts; scenario in A4 scope |
| `utility-renderer-kitchen-sink.test.js` | Checkpoint + practice role classes |
| `utility-renderer-cognition-fields.test.js` | Cognition block includes `util-material-role-thinking` |
| `utility-ld-climate-misconception-page-render.test.js` | Deliverable output class list |
| `utility-ld-inflation-page-render.test.js` | `countElementsWithClass` token match (multi-class attributes) |

---

## Regression

```text
node --test tests/*.test.js
→ 589 pass / 0 fail
```

Targeted suites from brief: all green after class-list test fixes.

---

## Forward (36-4 / 36-5)

- **36-4:** Image/graph/diagram placement guidance (observation + producer notes; no diagram workflow).
- **36-5:** Print/session polish pass on top of V31_7–V31_9 stack.

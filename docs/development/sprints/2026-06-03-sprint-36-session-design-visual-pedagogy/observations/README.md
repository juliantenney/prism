# Sprint 36 — observations

Store **visual and session-design review notes** here: hierarchy, pacing, density, affordances, accessibility, and print suitability.

Prefer short markdown with fixture IDs, render method, and date. Do not commit large HTML dumps unless needed for diff review; reference test render paths instead.

---

## Visual review template (copy per slice)

```markdown
# Slice 36-X — [title]

**Date:** YYYY-MM-DD  
**Reviewer lens:** learning designer | session designer | graphic designer | cognitive load | accessibility  
**Anchors:** [fixture paths + probe ID if any]  
**Change type:** observation only | CSS (V31_*) | renderer class hook | guidance doc

## Render method
- Fixture: `tests/fixtures/page-render/….json`
- API: `buildUtilityStructuredHtmlForTest` (see `tests/utility-page-render.test.js`)
- Browser / print preview: yes / no

## Before
- Hierarchy: …
- Scan path: …
- Pacing / density: …
- Visual affordances: …

## After (if changes landed)
- …

## Rubric scores

| Category | Score (Pass / Partial / Fail) | Notes |
|----------|-----------------------------|-------|
| Hierarchy | | |
| Scanability | | |
| Pacing | | |
| Density | | |
| Cognitive emphasis | | |
| Visual affordance | | |
| Accessibility | | |
| Print / session suitability | | |

## Proposed changes (sized small)
1. …

## Rejected scope creep
- …

## Regression
- `node --test tests/*.test.js` → pass / fail count
```

---

## Before/after capture format

| Capture | Format | When |
|---------|--------|------|
| **Baseline** | Screenshot or annotated browser snapshot | Start of slice |
| **HTML reference** | Fixture name + section_id / activity_id | Always |
| **CSS delta** | Class names + `getUtilityPagePresentationCssV31_*` section | When code changes |
| **After** | Second screenshot or rubric re-score | End of slice |

Keep captures **learner-body only** — exclude expanded `util-meta` unless reviewing metadata boundary.

---

## Rubric categories

Score each **Pass / Partial / Fail** unless noted.

### Hierarchy

- Primary task (“What to do”) visually dominant over materials and orientation cues.
- Section `h2` → activity `h3` → material `h4` ladder is obvious in browser.
- Assessment and study_tips visually distinct from learning activities.
- No production metadata competing with lesson content in main flow.

### Scanability

- Learner can orient to “what this page is” in under ~30 seconds.
- F-pattern or Z-pattern scan path is intentional (not accidental table walls).
- Lists, tables, and cognition blocks have clear entry points.

### Pacing

- Activities feel sequenced (build → practise → transfer → close).
- Cognitive rhythm: not every card same duration/weight signals.
- Closure (`study_tips`, debrief) reads as session end, not another task card.

### Density

- No more than one “loud” competing cue block per activity.
- Table-heavy stretches broken by headings, whitespace, or subheadings.
- Long template strings (multi-`###`) breathe between sections.

### Cognitive emphasis

- `util-cognition` regions (PEL fields) scannable as “thinking prompts,” not body filler.
- Support notes and output blocks subordinate to task but findable.
- Sprint 35 instructional patterns still visible after visual tweaks.

### Visual affordance

- Pedagogical roles map to consistent borders/icons (task, scenario, template, assessment).
- Moments that **invite** a diagram/chart/matrix are named (even if image not generated).
- Quantitative pages: intervals, overlap, uncertainty have a plausible visual substitute noted.

### Accessibility

- Heading order logical; contrast sufficient on badges and borders.
- Tables wrapped for horizontal scroll without hiding structure.
- Icon-only meaning avoided (text label or `aria-label` present).

### Print / session suitability

- Print preview: cards avoid awkward breaks where possible.
- Long tables scroll or break sensibly on paper.
- Session handout usable without live tutor (self-directed).

---

## Cross-references

| Source | Path |
|--------|------|
| Sprint 31 rubric (overlap) | `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/presentation-review-rubric.md` |
| Sprint 35 pedagogical intent | `../2026-06-03-sprint-35-pedagogical-refinement/observations/` |
| Golden CI page | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Climate fixture | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |

---

## File naming

- `36-1-hierarchy-scanability-ci-marx-climate.md`
- `36-3-semantic-grammar-cognition-blocks.md`

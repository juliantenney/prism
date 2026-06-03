# Slice 36-1 — Visual hierarchy and scanability review

**Date:** 2026-06-03  
**Status:** Complete (observation-only; no code changes)  
**Method:** Fixture render via `buildUtilityStructuredHtmlForTest`; DOM structure probe (`fixtures/_36-1-render-structure-probe.js`, style block stripped); cross-read `getUtilityPagePresentationCssV31_7()` and activity render order in `app.js`; Sprint 31 + Sprint 36 rubrics.

**Anchors:**

| Page | Source | Role |
|------|--------|------|
| Confidence intervals (golden) | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | Quantitative self-study; multi-table; Sprint 35 closure/debrief/cognition |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` | Humanities self-study; checklist density; `study_tips` |
| Climate misconception (fixture proxy) | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | Discussion materials + card grid + formative T/F |
| Climate live probe (reference) | `docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-01-live.md` | Richer generated seminar/handout (named scenarios, policy/evidence rhetoric) — **not re-rendered in this slice** |

**Regression:** Not run (no code changes). Floor remains **589 pass / 0 fail** per Sprint 35 close.

---

## Executive summary

PRISM learner pages already deliver a **calm academic document** with a credible heading ladder and a strong **“What to do”** primary task treatment (`util-activity-task--primary`). They read as **structured learning documents** more than **choreographed study sessions** because:

1. **Activity cards repeat the same chrome** (border, padding, badge row) — pacing feels uniform, not staged.
2. **Materials stacks absorb high-value pedagogy** (Step → meaning, Closure, Debrief, self-check) as **peer-weight `h3` lists** inside template/scenario blocks — easy to miss before table work.
3. **`purpose` duplicates task** as a plain `<p><strong>Task:</strong>…</p>` above the boxed primary task — flat mid-band hierarchy.
4. **Cognition regions** (`util-cognition`) are semantically important but **visually near materials** (same grey band, small caps label).
5. **Climate fixture** front-loads **21 task cards** in one activity — scan path hits a **card wall** before templates, prompts, or output.

**Session-design verdict:** Partial — instructionally rich (especially post–Sprint 35 CI/Marx), visually disciplined (Sprint 34/31), but **hierarchy and pacing need targeted presentation cues** in later slices (36-2–36-3), not a redesign.

---

## Render-order reference (focal-point baseline)

Per `renderLearningActivitiesBlocks`, each activity body order is:

```text
activity header (h3 + badges)
→ framing (preamble / bridge)
→ purpose as <p><strong>Task:</strong> …</p>  [when purpose present]
→ util-activity-task--primary (“What to do”)
→ util-cognition (PEL fields)
→ util-activity-materials (stack)
→ util-output-block
→ util-support-note
```

Learner attention **should** land on **h3 title → What to do → materials**. In practice **purpose Task**, **framing**, and **material subheadings** compete at similar visual weight.

---

## Lens summaries

### Learning designer

| Page | Session arc readable? | Notes |
|------|----------------------|-------|
| CI golden | **Yes** | Clear A1 modelled → A2 faded → A4 transfer; `study_tips` closes page |
| Marx | **Partial** | A2→A3→A4 progression clear in copy; no `assessment_check`; ends on heavy A4 checklist |
| Climate fixture | **Partial** | One 40-min block bundles cards + template + prompts + checklist + output — arc is **content order**, not visual acts |

### Session designer

| Page | Pacing feel | Weakest region |
|------|-------------|----------------|
| CI golden | **Moderate** | A2 long materials band (meaning bullets + two tables + self-check + closure) before output |
| Marx | **Moderate** | A4 checklist + scenario debrief sentence — long vertical commitment |
| Climate | **Weak** | Card grid dominates first screenful; no `study_tips` section; assessment feels appended |

### Graphic designer

| Strength | Weakness |
|----------|----------|
| Restrained palette; V31_7 heading ladder | All `article.util-task-block` cards share same weight |
| Uppercase muted `h4` material headings | In-material `h3` (### Closure, ### Debrief) **not** in material-heading style |
| Primary task box (left rule, shadow) | Output block and support note **below fold** on long activities — easy to skip |

### Cognitive load reviewer

| Hotspot | Load driver |
|---------|-------------|
| CI A2 | Two tables + 4 markdown sections in one template string |
| CI A1 | Worked example + step → meaning — acceptable |
| Marx A3 | Comparison table + prompts + self-check + closure |
| Climate | 10+ misconception cards before worksheet — **split attention** |

### Accessibility reviewer

| Check | CI | Marx | Climate |
|-------|-----|------|---------|
| Heading order | Pass | Pass | Pass |
| Task in list inside primary box | Pass | Pass | Pass |
| Cognition `aria-label` regions | Pass (2 fields) | Pass | N/A (no cognition) |
| Table scroll wrappers | Pass | Pass | N/A |
| Icon + text labels on headings | Pass | Pass | Pass |
| T/F assessment without answer leak | Pass | N/A | Pass |

**Partial:** Closure/debrief bullets inside materials are not announced as “session reflection” landmarks (no `role="region"` cue).

---

## Focal-point analysis

### Where attention lands first (typical desktop scan)

1. **Page `h1`** — clear entry.
2. **Section `h2.util-section-heading`** (icon + border-bottom) — “Learning activities” landmark.
3. **First activity `h3`** in header — activity title + duration badge.
4. Then scan **splits**:
   - **Disciplined path:** “What to do” box (primary).
   - **Document path:** materials `h4` (“Template”, “Scenario”) and in-body `h3` subsection titles.

### CI golden — attention map

| Region | Lands well? | Why |
|--------|-------------|-----|
| Overview + Key ideas | **Yes** | `h2` + prose/MathJax block distinct from activities |
| A1 worked example | **Partial** | `util-worked-example` subtle (left bar only); task box still dominates |
| A2 template | **No** (first pass) | Step → meaning / Use this when / Self-check / Closure render as **lists under generic `h3`** — same band as table titles |
| A4 scenario + Debrief | **Partial** | Scenario table small; debrief bullets **after** table — good order, low visual “closure” signal |
| Assessment | **Yes** | Formative card tint (`#f8fafc`, cyan border) separates from activities |
| Study tips | **Yes** | Own `h2` — reads as page epilogue |

### Marx — attention map

| Region | Lands well? | Why |
|--------|-------------|-----|
| Knowledge summary | **Yes** | Structured concepts (if rendered as summary block) before activities |
| A2 model row | **Partial** | Table inside worked example path |
| A3 comparison | **Partial** | Single large template stack |
| A4 factory + checklist | **No** (density) | Long checklist with `→` clauses; debrief bold line in scenario easy to skim past |
| Study tips | **Yes** | Three bullets — concise closure |

### Climate fixture — attention map

| Region | Lands well? | Why |
|--------|-------------|-----|
| Overview | **Yes** | Short |
| Task cards grid | **Dominant** | `util-card-grid` + many `util-task-card` — **attention trapped** in grid |
| Analysis template | **Weak** | Below grid; dashed template block similar weight to cards |
| Discussion prompts | **Weak** | Prompt set styling close to template |
| Output block | **Partial** | Appears after long materials — correct order, late discovery |
| Assessment | **Partial** | Separated by `h2`; T/F compact (`max-width: 14rem`) — good |

**Live probe note (P28-01):** Generated climate seminar materials include **named scenarios, roles, and conflicting claims** — higher narrative pull than the simplified fixture. Visual hierarchy issues (card dominance, flat subsections) likely **amplify** on live HTML; fixture review is **conservative**.

---

## Hierarchy flat-spots

| # | Flat-spot | Evidence | Pages |
|---|-----------|----------|-------|
| H1 | **Purpose duplicates primary task** | `purpose` → `<p><strong>Task:</strong>…</p>` then identical action in “What to do” | CI (×3), Marx (×3), Climate (×1) |
| H2 | **Activity cards visually identical** | Same `article.util-task-block` padding/border; only title/badge differ | All |
| H3 | **In-material pedagogical `h3`** | `### Step → meaning`, `### Closure`, `### Debrief` not styled as `util-material-heading` | CI, Marx |
| H4 | **Cognition ≈ materials** | `.util-cognition` grey box vs `.util-template-block` / scenario — similar salience | CI A2/A4, Marx A3/A4 |
| H5 | **Output vs materials** | Output has heading but less “milestone” feel than primary task; support note **after** output — correct pedagogy, easy to overlook | All with output |
| H6 | **Study tips vs last activity** | `h2` helps; still another bordered section — could blur “done” feeling | CI, Marx |
| H7 | **Climate: no framing/cognition** | Single activity; no preamble region — jumps to cards | Climate fixture |

---

## Density map (qualitative)

```text
CI golden (vertical rhythm)
[Overview      ░]
[Key ideas     ▓▓  MathJax block]
[A1            ▓   task + worked example]
[A2            ▓▓▓▓▓  bullets + 2 tables + closure  ← peak density]
[A4            ▓▓   scenario + debrief + cognition]
[Assessment    ▓▓]
[Study tips    ▓]

Marx
[Knowledge     ▓▓]
[A2            ▓]
[A3            ▓▓▓  table + prompts]
[A4            ▓▓▓▓ checklist + scenario  ← peak]
[Study tips    ░]

Climate fixture
[Overview      ░]
[Activity      ▓▓▓▓▓▓▓▓  card grid  ← peak + long scroll]
[              ▓▓   template + prompts + checklist]
[Assessment    ▓▓]
(no study_tips ░)  ← abrupt end
```

**Table-wall stretches:** CI A2 (two tables contiguous in materials stack); Marx A3 (one wide comparison table). **Not** raw pipe-in-`<p>` failures — presentation is clean; **pacing** is the issue.

---

## Activity visual repetition

All three pages use the **same activity envelope**:

- Header `h3` + time badge  
- Optional framing block  
- Primary task box  
- Materials stack with uppercase `h4` labels  
- Output + support note  

**Effect:** Multi-activity pages (CI, Marx) feel like **three chapters in one template**, not **ramped intensity** (modelled → faded → transfer). Sprint 35 **copy** differentiates stages; **visual grammar** does not yet.

---

## Cognition and support regions

| Element | Semantic role | Visual weight today | Gap |
|---------|---------------|---------------------|-----|
| `util-activity-framing` | Orient / bridge | Light prose | OK subordinate |
| `util-cognition` | Thinking mode / transfer | Small label, grey box | **Under-signalled** vs task |
| `util-support-note` | Misconception guard | Bottom aside, life-ring icon | Correct position; **low contrast** vs materials |
| `util-output-block` | Deliverable | Green left border | Clear but **not milestone** on long cards |

CI: `self_explanation_prompt` + `transfer_or_application_task` render in cognition — **easy to miss** before A2 tables.

---

## Visual affordance opportunities (no Sprint 32 workflow)

Document **where visuals would reduce load** — implementation deferred to imaging guidance (36-4) / Sprint 32.

| Opportunity | Page / locus | Suggested visual (guidance only) |
|-------------|--------------|----------------------------------|
| Interval on number line | CI overview / A4 | Sketch axis with two intervals — overlap visible |
| Procedure vs interval Venn | CI A1/A2 | Simple two-set diagram |
| Confidence level vs width | CI A2 second table | Small line chart or ordered bar |
| Comparison matrix | Marx A3 | 2×2 purpose/difference grid |
| Concept application map | Marx A4 | Factory sketch + class labels |
| Evidence for/against | Climate template | T-chart replacing blank lines |
| Policy trade-off | Climate live probe | Matrix (options × criteria) |
| Uncertainty band | Climate / stats probes | Model spread graphic |

---

## Scan-path observations

### Intended path (designer)

`h1` → section purpose → activity title → **What to do** → materials → output → next activity → assessment → study tips.

### Observed learner path (likely)

`h1` → skim activities → **largest visual mass** (tables or card grid) → lose output/support → jump to assessment if time-limited.

### Narrow viewport (~360px)

- `util-table-scroll` — **Pass** (horizontal scroll preserves structure).  
- Card grid — stacks; climate cards remain **many screens** before template.  
- Assessment T/F — narrow column OK.  
- Primary task box — remains readable; materials **`h4` uppercase** still small but legible.

### Print preview

- Activity cards: `break-inside: avoid` on cards — **good** for handouts.  
- Long tables: V31_7 `break-inside: auto` — **good** for CI A2 (avoids blank gaps).  
- Assessment formative card avoids break — **good**.  
- **Risk:** Climate 10-card grid may print as **multi-page card list** before worksheet — poor session pacing on paper.

---

## Assessment separation

| Page | Separation | Notes |
|------|------------|-------|
| CI | **Pass** | Distinct `util-assessment-section`; formative styling; numbered `<ol>` in prompt |
| Marx | N/A | No assessment section in fixture |
| Climate | **Pass** | T/F layout clean; answers hidden (`feedback_display: none`) |

**Partial (CI):** MCQ options appear below long stem — hierarchy OK; explanation inline when shown (golden includes explanation in JSON; display mode may hide in some profiles).

---

## Closure / debrief transitions

| Page | Closure content | Visual “session end” cue |
|------|-----------------|---------------------------|
| CI | A2 Closure bullets, A4 Debrief, `study_tips` | **Strong** only at `study_tips` `h2`; in-activity closure **weak** |
| Marx | A3 Closure, A4 checklist closure, scenario debrief, `study_tips` | **Partial** |
| Climate | None in fixture | **Fail** — ends at assessment |

Sprint 35 **copy** delivers closure; Sprint 36 **presentation** does not yet signal “pause and reflect” distinct from instructional bullets.

---

## Rubric scores (Sprint 36 categories)

| Category | CI golden | Marx | Climate fixture |
|----------|-----------|------|-----------------|
| Hierarchy | Partial | Partial | Partial |
| Scanability | Partial | Pass | Fail |
| Pacing | Partial | Partial | Fail |
| Density | Partial | Partial | Fail |
| Cognitive emphasis | Partial | Partial | Fail |
| Visual affordance | Partial (noted) | Partial | Partial |
| Accessibility | Pass | Pass | Pass |
| Print / session | Partial | Partial | Fail |

**Scale:** Pass / Partial / Fail — per `observations/README.md`.

---

## Strongest existing visual behaviours (keep)

1. **Primary task box** (`util-activity-task--primary`) — clearest learner action anchor.  
2. **Section headings** (`h2.util-section-heading` + icon + rule) — reliable landmarks.  
3. **Materials stack** + table wrappers — no pipe soup; academic tables readable.  
4. **Formative assessment styling** — visually separable from activities.  
5. **Calm palette and typography** (V31_7) — not SaaS-noisy; print-friendly baseline.  
6. **`study_tips` as terminal section** (CI, Marx) — session epilogue pattern worth extending.  
7. **MathJax in knowledge summary** — block equation establishes “quantitative seriousness” without clutter.

---

## Weakest pacing regions (prioritise in 36-2)

1. **CI A2** — pre-table bullet stack + dual tables + closure in one materials band.  
2. **Climate card grid** — front-loaded misconception list.  
3. **Marx A4** — checklist length + scenario in one activity.  
4. **Purpose/task duplication** — mid-card flat band on every activity.  
5. **Climate: missing study_tips / debrief section** — abrupt termination.

---

## Highest-value, low-risk presentation improvements (proposed — not implemented)

Ranked for **36-2 / 36-3**; CSS-only where noted; **no `app.js` in 36-1**.

| # | Proposal | Rationale | Risk |
|---|----------|-----------|------|
| P1 | **Demote `purpose` Task paragraph** — smaller type, muted colour, or merge suppress when duplicate of learner_task | Removes H1 flat-spot | Low (CSS adjacent-sibling / class on purpose line if hook exists; may need tiny render class) |
| P2 | **Strengthen `util-cognition`** — slightly stronger left accent + label contrast (reuse existing modifier colours) | Surfaces transfer/self-explanation before tables | Low |
| P3 | **Style in-material pedagogical subheads** — e.g. `h3` following template block that matches `/Closure|Debrief|Step → meaning/i` via CSS `:has()` or renderer class in 36-3 | Closure/debrief visible without new schema | Medium (may need one semantic class on `h3`) |
| P4 | **Session cue for `study_tips`** — top border + subtle background on section content | Clear “you are done” | Low |
| P5 | **Output block milestone** — slightly stronger top margin / rule when following large materials | Reduces skip rate | Low |
| P6 | **Climate card grid density** — max-height + “show more” **rejected** (interaction); prefer **producer guidance** to split activities in 36-2 notes | — | Out of scope |
| P7 | **Support note icon weight** — optional slightly darker border; keep aside pattern | Misconception guards scannable | Low |

**Not proposed:** new colour system, card redesign, icon set expansion, hero sections, dashboard layout.

---

## Before observations (baseline)

Captured at Sprint 36-1 charter time — **no presentation CSS changes** since Sprint 34-5 / 35.

- Presentation layer: `getUtilityPagePresentationCssV31_7()` active.  
- CI golden encodes Sprint 35 pedagogical patterns (closure copy present; visual closure weak).  
- Climate fixture encodes typed materials renderer (cards, template, prompts, checklist) — not live P28 multi-scenario page.  
- Marx includes `study_tips`; climate fixture does not.

---

## Rejected scope creep

| Rejected | Reason |
|----------|--------|
| Full card / design system redesign | Charter |
| New workflow or diagram steps (Sprint 32) | Deferred programme |
| Adaptive layout or personalised density | Charter |
| Decorative imagery / stock photos | Not instructional |
| Hero sections, gradients, SaaS aesthetics | Violates calm academic tone |
| `app.js` changes in 36-1 | Observation-first slice |
| Promoting climate fixture to golden without review | Fixture is shape proxy, not richest probe |
| Collapsing task cards by default | Interaction / restructuring |

---

## Recommended next slices

| Slice | Focus |
|-------|--------|
| **36-2** | Pacing and density — A2 materials choreography; climate card sequencing guidance |
| **36-3** | Semantic visual grammar — cognition, closure subheads, purpose demotion (P1–P3) |
| **36-4** | Imaging opportunity catalogue from table above |
| **36-5** | Print/session polish — climate handout, CI A2 print break review |

---

## Artifacts

| File | Purpose |
|------|---------|
| `fixtures/_36-1-render-structure-probe.js` | Optional DOM counts (body only, no `<style>`) |
| This note | Authoritative 36-1 deliverable |

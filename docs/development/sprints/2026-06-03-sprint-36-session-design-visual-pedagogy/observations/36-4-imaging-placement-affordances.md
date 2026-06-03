# Slice 36-4 — Imaging opportunity placement and visual affordance refinement

**Date:** 2026-06-03  
**Status:** Complete  
**Regression:** `node --test tests/*.test.js` → **589 pass / 0 fail**

**Predecessors:** [36-1](36-1-hierarchy-scanability-ci-marx-climate.md) · [36-2](36-2-pacing-density-choreography.md) · [36-3](36-3-semantic-visual-grammar.md)

**Architectural boundary:** Sprint 36 does **not** generate images or reopen [Sprint 32](../../2026-06-02-sprint-32-pedagogic-diagram-enhancement/). The **Utilities HTML export** path (`buildUtilityStructuredHtml` → `sanitizeUtilityHtmlOutput`) and **Workflow Factory image output type** remain the integration surfaces for downstream augmentation. This slice names **where** visuals would reduce load and whether current DOM/CSS **accommodates** insertion.

---

## Executive answer

| Question | Verdict |
|----------|---------|
| Where would graphs/diagrams/matrices meaningfully help? | **Yes — many high-value loci** (see inventories below), especially CI interval overlap, CI level–width relationship, climate evidence weighing, Marx comparison structure. |
| Do current structures accommodate insertions gracefully? | **Partial** — role grammar (36-3) and pacing (36-2) provide stable anchors; **no** first-class figure material type; markdown does not emit `<img>` today; dense table/card regions need **explicit** placement discipline from the utility workflow. |

Post–36-2/36-3 pages are **visually ready for augmentation** in the sense that hierarchy, role bands, and spacing rhythms define **credible insertion points** — not that figures are wired in the renderer.

---

## Method

| Anchor | Source | Review focus |
|--------|--------|--------------|
| CI golden | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | Multi-table stats, overlap transfer, assessment |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` | Comparison table, factory scenario, checklist |
| Climate fixture | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | Card grid → template → prompts |
| Climate live probe | `docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-01-live.md` | Named scenarios, role conflicts, formative arc |
| Kitchen sink | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` | Material-type diversity (contract stress) |

Render order per activity (unchanged): header → framing → purpose cue → **action** → **thinking** → **materials stack** → **deliverable** → **guidance** → (page-level) **checkpoint** / study tips.

---

## Quantitative affordances

| Opportunity | Anchor | Cognitive load reduced | Natural DOM role / insertion point | Visual type |
|-------------|--------|------------------------|-----------------------------------|-------------|
| **Interval overlap on a number line** | CI A4 `scenario` table | Endpoint comparison without mental sketching | Inside `util-material-role-scenario`, **immediately after** `util-table-scroll` (Control vs Treatment intervals) | Graph (1D axis, two segments) |
| **Procedure vs single-interval interpretation** | CI A1 model, A2 template row 1 | Disambiguates “95%” claims | After first table in `util-material-role-practice` or beside `util-material-role-model` worked example | Small Venn / two-path diagram |
| **Confidence level vs interval width** | CI A2 “Confidence Levels” table | Links level % to width without scanning empty cells | **Between** the two `util-table-scroll` blocks (36-2 already adds 20px gap — ideal figure slot) | Bar or ordered strip chart |
| **Standard error / n effect** | CI overview `knowledge_summary` (equation) | Connects formula to width intuition | Below MathJax block in `util-knowledge-summary--prose` | Annotated formula diagram or mini plot |
| **p-value vs α decision** | CI assessment Q1 | Separates statistical vs practical significance | Above `util-assessment-list` inside `util-material-role-checkpoint` (optional; keep sparse) | Flowchart (decision tree) |
| **Inflation indicator comparison** | Inflation workshop fixture (reference) | CPI vs deflator spread | After impact/classification table | Line or small multiples |
| **Overlap + effect size** | CI A4 debrief bullets | Evidence weighting beyond overlap alone | After scenario figure, before `### Debrief` phase cue | Side-by-side intervals + caption |

**Study tips already cue sketching** (“Sketch intervals on a number line”) — a generated figure at A4 would **align copy with practice**, not replace it.

---

## Conceptual / process affordances

| Opportunity | Anchor | Load reduced | Insertion point | Visual type |
|-------------|--------|--------------|-----------------|-------------|
| **Greenhouse / radiative balance** | Climate cards (CO₂ claim), live probe scenarios | Mechanism vs slogan | **After** `util-card-grid`, **before** `util-material-role-practice` template — image-first decompression (36-2 margin already separates grid from worksheet) | Process diagram (inputs/outputs) |
| **Weather vs climate** | Climate discussion prompt #3 | Temporal scale confusion | Adjacent to `util-material-role-inquiry` prompt set or inline in template | Dual-axis or layered timeline |
| **Evidence pipeline** | Climate `analysis_template` | Blank “for/against” lines are abstract | Inside template block above classification checkboxes | T-chart / evidence table graphic |
| **Historical materialism chain** | Marx `knowledge_summary` relationships | Concept links in prose only | `util-knowledge-summary` after relationships paragraph | Simple causal chain |
| **Class structure in factory** | Marx A4 `summary_text` scenario | Applies abstract terms to case | Top of `util-scenario-card` or checklist intro | Factory sketch with role labels |
| **Purpose vs plot** | Marx A2 model row | Humanities analogue to CI procedure move | Inside `util-material-role-model` | Two-column contrast diagram |
| **Peer-instruction reasoning flow** | Cognition fixtures (revision fields) | Position → trigger → revision | Below `util-material-role-thinking`, above materials | Three-step flow (minimal) |

**Live climate probe (P28-01):** Named roles (Mr. Johnson, Dr. Lee, Ms. Davis) invite **annotated scenario diagrams** per card — higher value than a single decorative hero image.

---

## Evaluative / judgement affordances

| Opportunity | Anchor | Why visual helps | Insertion point | Visual type |
|-------------|--------|------------------|-----------------|-------------|
| **Evidence for/against matrix** | Climate template | Weighing claims is core task | Replace or flank blank “Evidence for / against” lines | 2×2 or for/against matrix |
| **Misconception vs supported classification** | Climate template + T/F assessment | Links worksheet to checkpoint | Between template and `util-material-role-checkpoint` | Decision matrix (claim × evidence strength) |
| **Competing interpretations (intervals)** | CI A4 debrief | Overlap vs effect size | `util-material-role-scenario` debrief `h3` region | Comparison panel |
| **Policy / strategy trade-offs** | Live probe Metroville scenario | Multiple stakeholders | Per `util-task-card` or scenario subsection | Options × criteria matrix |
| **Text comparison (Manifesto vs Kapital)** | Marx A3 table | Purpose/difference dimensions | Above or beside comparison `util-table-scroll` | 2×2 (aim × audience) matrix |
| **Formative evidence weighting** | CI assessment stem item 4–5 | Judgement under uncertainty | Optional small figure in checkpoint (low priority — keep text-first) | Rubric strip |

Scenario cards (`util-material-role-scenario`) are the **preferred** home for judgement visuals — they already signal evaluative tone (36-3 teal accent).

---

## Pacing / decompression affordances

| Moment | Anchor | Session function | Recommended placement | Notes |
|--------|--------|------------------|----------------------|-------|
| **Image-first orient** | CI A1 before tables | Model the move visually | After `util-material-role-model`, before learner fills A2 | One figure beats prose for “procedure vs interval” |
| **Table-wall relief** | CI A2 mid-materials | Pause between two tables | **Between** `util-table-scroll` wrappers | Strongest quantitative insertion point on golden page |
| **Card-grid decompression** | Climate fixture | Recover attention after 10 cards | `util-card-grid` → gap (36-2) → optional figure → template | Without figure, grid still dominates first screenful |
| **Pre-output synthesis** | All anchors with `util-material-role-deliverable` | “What you hand in” | Above output block, not inside milestone box | Keeps deliverable clean |
| **Post-cognition pause** | CI A2 (`self_explanation_prompt`) | Think before table work | After `util-material-role-thinking`, before `util-activity-materials` | Cognition band already separated (36-2) |
| **Checkpoint breather** | Climate / CI assessment | Distinct act | Top of `util-material-role-checkpoint` only if figure is **summary** scale | Avoid competing with MCQ/T/F stems |
| **Study tips epilogue** | CI / Marx | Optional recap figure | Below `h2` study tips — **low priority** (text-first closure) | Risk of decorative feel |

**Pause-and-inspect regions** that read well today: phase cues (`util-session-phase-cue`), scenario debrief `h3`, self-check lists — figures should **not** replace these; they should **precede** heavy tables where possible.

---

## Insertion-point observations (placement semantics)

### Preferred hierarchy (downstream utility workflow)

```text
section h2 (Overview / Key ideas / Learning activities)
  article.util-task-block
    util-material-role-action
    util-material-role-thinking          ← optional small process figure (rare)
    util-activity-materials
      util-material-role-model           ← model diagram
      util-material-role-practice
        util-table-scroll                ← table
        [FIGURE: chart/matrix]           ← highest-value slot (between tables)
        util-table-scroll
        util-session-phase-cue (orient/selfcheck/close)
      util-material-role-scenario        ← judgement figure after table, before debrief h3
      util-card-grid                     ← per-card thumb OR one decompression figure after grid
      util-material-role-inquiry
      util-material-role-checklist
    util-material-role-deliverable
    util-material-role-guidance
  util-material-role-checkpoint          ← summary-scale figure only
```

### Role ↔ visual type mapping (guidance for inspectors)

| Pedagogical role | Suitable visuals | Unsuitable |
|----------------|------------------|------------|
| **model** | Annotated worked diagram, labelled number line | Stock photo |
| **practice** | Faded diagram with blanks, template overlay | Full solution chart |
| **scenario** | Comparison graphic, stakeholder map | Decorative scene |
| **thinking** | Minimal flow (3 nodes) | Dense infographic |
| **inquiry** | Prompt-referenced inset (small) | Unrelated chart |
| **checkpoint** | Rubric / decision strip | Tutorial-length diagram |

### Accommodation assessment (post–36-3)

| Region | Ready? | Gap |
|--------|--------|-----|
| Between adjacent tables | **Strong** | V31_8/V31_10 spacing; workflow must target DOM between scroll wrappers |
| Inside scenario card | **Strong** | Table + debrief `h3` structure stable |
| After card grid | **Moderate** | Margin exists; no semantic “slot” class |
| Knowledge summary | **Moderate** | Prose + MathJax; `img`/`figure` unstyled until V31_10 |
| Inside task cards | **Weak** | Small cards; figures would dominate — prefer icons + text |
| Markdown materials | **Weak** | No `![alt](url)` → `<img>` path in `utilityRenderMarkdownBlock` |
| Assessment items | **Weak** | Text-first contract; figures risk answer leakage layout |

---

## Print implications

| Insertion context | Print behaviour today | Risk if figure added |
|-------------------|----------------------|------------------------|
| Activity cards | `break-inside: avoid` on `article.util-task-block` | Tall figure + long tables may **push** output/support to next page — acceptable |
| Tables | `break-inside: auto` (V31_7) | Good — figure between tables can `break-after: avoid` on figure (V31_10) |
| Card grid | No forced break between cards | Multi-page card list **before** worksheet on climate — figure after grid **helps** pacing on paper |
| Role tinted backgrounds | Print → white (V31_9) | Figures should not rely on background tint for meaning |
| Self-contained HTML | Download path stores single HTML | Workflow must embed at export boundary (Sprint 32 target) — external URLs break offline |

**Rule:** Pedagogic figures should be **≤ ~920px** content width, with **caption** (figcaption) for accessibility; avoid full-bleed hero layouts.

---

## Inventories (explicit)

### Strongest image opportunities (illustration / annotated scene)

| Rank | Locus | Rationale |
|------|-------|-----------|
| 1 | Climate — after card grid | Greenhouse / Earth energy balance reduces slogan-level debate |
| 2 | Marx A4 — factory scenario | Grounds class struggle in spatial layout |
| 3 | Live probe — per scenario card | Named roles + place (Metroville) invite contextual scene **with labels**, not stock art |
| 4 | CI A1 — procedure vs interval | Conceptual “two interpretations” graphic |

### Strongest graph opportunities (quantitative / axis-based)

| Rank | Locus | Rationale |
|------|-------|-----------|
| 1 | CI A4 — dual intervals on number line | Directly answers learner_task (overlap, narrow/wider) |
| 2 | CI A2 — level vs width | Second table empty cells expect relational understanding |
| 3 | CI overview — SE vs n | Equation in knowledge summary wants geometric intuition |
| 4 | Inflation workshop — CPI series (reference fixture) | Trend vs variability teaching |

### Strongest matrix opportunities (comparison / judgement)

| Rank | Locus | Rationale |
|------|-------|-----------|
| 1 | Climate analysis template | Evidence for/against is matrix-native |
| 2 | Marx A3 comparison table | Purpose × work dimension |
| 3 | Live probe — policy trade-off scenarios | Options × criteria |
| 4 | CI A2 — statement classification | Procedure vs probability × example statements |

### Weakest current accommodation regions

| Region | Why weak |
|--------|----------|
| Task card grid cells | No inner figure wrapper; high density |
| Long markdown without tables | No figure anchor in renderer |
| Assessment item bodies | Stem/option layout not figure-aware |
| Facilitator-only metadata | Not in learner export |
| Placeholder / decorative boxes | No schema — correctly absent |

### High-value utility-workflow enhancement targets

These are **inspection and augmentation** targets for the existing Utilities + workflow image path — **not** new steps in Sprint 36.

| Target | Suggested inspector cue | Placement rule |
|--------|-------------------------|----------------|
| **CI golden page export** | “Interval table without number line” | Insert after first scenario table scroll |
| **Climate discussion export** | “Card wall before worksheet” | One decompression figure between grid and template |
| **Climate template block** | “Evidence lines are blank prose” | Matrix or T-chart in template |
| **Marx A3 export** | “Comparison is table-only” | 2×2 above table |
| **Design Page → Utilities HTML** | DOM scan: `util-table-scroll` pairs in same `util-material-role-practice` | Prefer inter-table slot |
| **Workflow image output** | Brief `imageScene` / pedagogic subject aligned to **role** | Map to role wrapper class from 36-3 |
| **Post-render HTML pass** (Sprint 32) | Tier-1 opportunities only (overlap, evidence matrix, greenhouse) | Never inside `util-material-role-checkpoint` without stem rewrite |

---

## Implementation (this slice only)

### `getUtilityPagePresentationCssV31_10()` — figure accommodation

Low-risk rules for **future** `<img>` / `<figure>` inserted by utility workflow or manual HTML:

- `max-width: 100%`, auto height, calm margins in knowledge summary, materials, scenario, worked example
- `figcaption` muted centred caption style
- Extra margin after `util-table-scroll` and after `util-card-grid` when followed by figure/img
- Print: `page-break-inside: avoid` on figures/images

**No** placeholder boxes, **no** renderer blocks, **no** fake diagrams.

---

## Rejected scope creep

| Rejected | Reason |
|----------|--------|
| Sprint 32 diagram orchestration | Charter; separate programme |
| New workflow steps | Charter |
| Schema fields (`figure_ref`, `visual_tier`) | Charter |
| `util-figure-placeholder` renderer blocks | Decorative / fake-diagram risk |
| Stock photos, hero banners, gradients | Breaks calm academic tone |
| Media galleries / carousels | Not session design |
| Auto-generate on every table | Noise; tiering required |
| Markdown image syntax without governance | Would bypass inspection tier |
| Infographic redesign of activity cards | Uniformity already addressed in 36-3 |
| Reopening MathJax / table contracts | Sprint 33/34 closed |

---

## Before → after (36-3 → 36-4)

| Dimension | Before | After (36-4) |
|-----------|--------|--------------|
| Imaging guidance | Scattered in 36-1 table | **Ranked inventories** + DOM placement rules |
| Utility workflow clarity | Implicit | **Explicit targets** and role mapping |
| Figure CSS | None | **V31_10** accommodation for inserted `img`/`figure` |
| Placeholder visuals | N/A | Still **absent** (correct) |
| Charter compliance | — | No workflow/schema/Sprint 32 leakage |

---

## Regression

```text
node --test tests/*.test.js
→ 589 pass / 0 fail
```

No golden HTML contract changes (CSS-only additive layer).

---

## Forward (36-5)

- Print polish: figure + table break combinations on CI and climate handouts
- Final visual review rubric pass across anchors with **optional** probe re-render
- Optional domain **wording** note: when producers should request a matrix vs table (copy-only, not schema)

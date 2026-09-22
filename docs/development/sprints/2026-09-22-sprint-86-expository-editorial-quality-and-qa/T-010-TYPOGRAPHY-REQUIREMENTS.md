# Sprint 86 — T-010 typography & editorial presentation requirements

**Task:** S86-T-010 / WP5  
**Status:** **COMPLETE**  
**Quality model:** EQ2–EQ8 (esp. EQ7) · [DRAFT-EDITORIAL-PRINCIPLES.md](DRAFT-EDITORIAL-PRINCIPLES.md)  
**Evidence:** Frozen C01–C05 · T-007/T-008/T-009  
**Date:** 2026-09-22  
**Discipline:** Requirements only — no CSS/renderer/prompt edits, no T-011 design sequence.

---

## 1. North star

> Good typography should make the intellectual structure easier to perceive without making the reader notice the typography.

> The page should reveal the structure of the argument before the reader consciously notices its design.

> Use typography to encode intellectual hierarchy, not to decorate content.

**Target character:** calm, authoritative, highly readable educational publishing.

**Not:** busy app UI · card-heavy LMS · decorative magazine · generic AI document.

Current baseline (C01–C05 + renderer): **functional UI-adjacent educational page** — readable, but hierarchy stops at H2, orientation/Closing labelled like admin regions, figures bordered like cards, body face is system UI sans. Publishing-grade expression is the gap, not basic legibility.

---

## 2. Semantic vs typographic boundary

| Layer | Meaning | Example |
| ----- | ------- | ------- |
| **A. Semantic / editorial structure** | Must exist upstream | Subsection identity; worked-example identity; commission participation; authoritative close identity |
| **B. Typographic expression** | Renderer may apply when semantics exist | H3 style; quieter caption; equation display spacing; continuous chapter rhythm |
| **C. Visual decoration** | Does not encode structure | Rounded cards on ordinary prose; colour chips; tip/info/warning kits |

**Rule:** Renderer must **not** infer pedagogy, epistemic form, or rhetorical importance from prose texture. Generative stages must **not** specify pixel styling.

**Smallest upstream vocabulary justified for useful variation:**

| Semantic signal | Likely owner (responsibility only) | Typographic expression |
| --------------- | ---------------------------------- | ---------------------- |
| Resource title | DP / EJP title | H1 |
| Major exposition section | EJP/XD section | H2 |
| Meaningful subsection | XD (optional) | H3 — only when warranted |
| Supporting material identity | XD commission → XM | Differentiated block grammar |
| Figure / caption | DP VA (+ T-009 binding) | Figure + quiet caption |
| Authoritative close | XD final consolidation (EQ8) | Continuous close — not a second labelled admin region |
| Display maths | XD/XM prose delimiters | Display equation spacing |

---

## 3. Restrained visual vocabulary

| Item | Purpose | When | When not | Upstream signal? | Renderer |
| ---- | ------- | ---- | -------- | ---------------- | -------- |
| Resource title | Name the chapter | Always | — | Title field | H1 |
| Section heading | Major intellectual move | Each exposition section | Not for orientation labels if furniture removed | Section title | H2 |
| Subsection heading | Group a multi-move section | When section has ≥2 distinct sub-moves that learners must navigate | Routine paragraphs; every section; bold lead-ins | Optional semantic subsection (XD) | H3 |
| Body prose | Sustained explanation | Default | — | Exposition | Measure + body rhythm |
| Opening lead | Enter commissioned need | First substantive prose | Decorative hero | EQ2 entry in XD S1 | Slightly stronger first block optional — **SHOULD** |
| Display equation | Isolate formal relation | When equation is a threshold object | Every inline formula | Math delimiters | Display spacing |
| Figure + caption | Perceptibility support | Warranted VA | Forced figures | T-009 / DP VA | Full-bleed-in-measure figure; quiet caption |
| Table | Compare structured data | When table form earns place | Prose-as-table | Material / markdown table | Editorial table, horizontal scroll if needed |
| List | Sequence or unordered set | Genuine enumeration | Bulletising prose | Markdown / structure | Quiet lists |
| Worked example / structured support | Artefact distinct from chapter prose | Commissioned supporting artefact | Ordinary paragraphs in a box | XM structured / commission kind | Light differentiation — not app card |
| Bounded callout | Rare intellectual signal | Definition / caution / key distinction **only if recurring and warranted** | Tips, info boxes, warnings kits | Semantic role (if any) | Minimal; prefer fewer |
| Close | Consolidate once | End of journey | Second “Closing” furniture | EQ8 body close | Continuous with chapter — not admin H2 “Closing” |

---

## 4. Reading measure & body typography

### Measure

| Requirement | Stance |
| ----------- | ------ |
| Target prose measure | **~65–75ch** (current `--learner-reading-width: 70ch` is already in range — **retain as target**) |
| Nature | Target range for sustained prose, not a hard maximum for all content |
| Tables / wide figures / long display maths | May **break out** of measure (already partially true for tables) with controlled overflow |
| Narrow viewports | Full available width minus gutter; preserve readable leading; do not shrink type below usable size |

### Body

| Requirement | Stance |
| ----------- | ------ |
| Size | Comfortable reading size (~1rem class) — keep order of magnitude |
| Line-height | ~1.55–1.7 for body (current 1.65 acceptable) |
| Paragraph model | **Block spacing** preferred over first-line indent for screen educational reading |
| Density | Continuous chapter density — neither airy marketing whitespace nor cramped reprint |
| Face | Requirement is **strong reading/chrome distinction** and **reliable Unicode + maths**, not “serif is mandatory”. Current Segoe UI stack is **UI-adjacent**; a dedicated reading face **SHOULD** be considered later only if deployment/maths/licensing allow. **MUST NOT** casually add fragile webfont dependencies. |

**Serif hypothesis:** Not accepted as requirement. Accept **optional SHOULD** exploration in T-011 if evidence of better long-form reading without maths/a11y regression.

---

## 5. Hierarchy / H3

| Level | Role |
| ----- | ---- |
| H1 | Resource title only |
| H2 | Major exposition section (and, today, orientation/Closing labels — see §13/EQ7) |
| H3 | **Optional** meaningful subsection within a long section |

**H3 function (if used):** Mark a distinct sub-move the learner must recognise as a unit (e.g. “Individual change vs population change” inside a larger section) — not a bold sentence.

**Upstream:** XD may emit subsection structure only when warranted; not every section.  
**Absent by default** when the section is a single progressive argument (C05-style).  
**Not solved by CSS alone:** C01–C05 had 0×H3 because **content did not emit subsections**, even though markdown→`util-md-heading` styles exist.

**Distinguish from:** run-in lead · bold phrase · callout title · material internal labels.

**MUST:** Preserve semantic heading order; do not invent H3 from “important-looking” paragraphs.  
**SHOULD:** Enable genuine H3 when upstream emits subsections; style bare structured-material `<h3>` consistently.  
**NOT NOW:** Deep H4–H6 learner hierarchy for Expository chapters.

---

## 6. Opening, rhythm, emphasis

### Opening (EQ2)

Typography should support a **direct start into commissioned intellectual need** (question, phenomenon, case, contrast, proposition).  
**MUST NOT** require a decorative hero.  
Assume later furniture reduction (EQ7) may remove stacked Overview/Purpose/Summary — typography of the **first exposition block** matters more than styling admin regions.

### Rhetorical rhythm (EQ3/EQ4/EQ6)

Support via **spacing and selective emphasis**, not many components:

- ordinary paragraphs (default);
- occasional short threshold paragraph (same type, not a box);
- definitions/examples as prose or rare bounded callout;
- transitions as ordinary prose.

**Small vocabulary only** — do not create “threshold / transition / qualification” CSS components.

### Emphasis (EQ6)

| Allowed | Avoid |
| ------- | ----- |
| Sparse **bold** for true key terms | Bold-heavy AI-document style |
| *Italics* for terms/titles where conventional | Colour as primary emphasis |
| Rare displayed statement (indented/isolated paragraph) | Boxes for ordinary claims |
| One emphasis system | Competing highlight systems |

---

## 7. Display maths (Bayes-class need)

| Requirement | Stance |
| ----------- | ------ |
| Inline maths | Flows with prose; no card |
| Display equations | Vertically isolated; readable overflow/scroll on narrow viewports |
| Labels | Only when educationally useful — not automatic numbering theatre |
| Prose relationship | Equation participates in argument; caption-like gloss only if needed |
| Accessibility | Preserve MathJax (or equivalent) accessible path already used; do not strip delimiters |
| Boxing | **MUST NOT** put every equation in a rounded card |

**Current gap:** Delimiters protected; MathJax boots; **no** dedicated vNext equation spacing tokens — **SHOULD** add restrained display spacing in renderer CSS later.

Do not reopen CAS / per-cell table maths.

---

## 8. Figures & captions (EQ5 + T-009)

| Requirement | Stance |
| ----------- | ------ |
| Placement | Prefer after the prose move they support (current section-after-content acceptable for MUST) |
| Width | Within or thoughtfully break out of measure; avoid tiny inset “widget” figures |
| Caption | Quieter than body (`text-sm` class OK); readable; not decorative |
| Labels | Optional “Figure n” if helpful for cross-reference — **SHOULD**, not mandatory everywhere |
| Chrome | Prefer whitespace over heavy card chrome; current 1px border + 8px radius is mild cardification — **SHOULD** soften toward publishing figure grammar |
| A11y | Alt + detailed description remain VA-owned (T-009); prose keeps essentials |

Do not re-solve XD/XM binding here.

---

## 9. Tables & lists

### Tables

Editorial content, not widgets: clear headers, scanable rows, restrained borders, horizontal scroll when needed (current `min-width` + scroll is acceptable pattern).  
**Avoid** heavy fills, zebra as decoration, UI control styling.  
Captions/intro prose in body preferred over ornamental table titles.

### Lists

Use for genuine sequences/sets. Spacing quiet; nest only when structure requires.  
**MUST NOT** convert explanatory prose into bullets for visual ease (EQ6/EQ4).

---

## 10. Worked examples / structured materials & callouts

### Worked examples / supporting artefacts

| Question | Requirement |
| -------- | ----------- |
| When differentiate? | When identity is a **supporting artefact** (commission/XM), not ordinary chapter prose |
| How much? | Enough to scan as “example/support” — spacing, modest rule, or quiet label — **not** generic rounded LMS card |
| Internal hierarchy | Title / stages / synthesis must be styled if markup emits them (bare `<h3>` today underserved) |
| Materials ≠ figures | Structured body may exist without VA; VA may amplify without dumping structure |

**AD-010:** Out of scope — do not fix unsupported fallback styling as if it were editorial grammar.

### Callouts

| Candidate | Verdict |
| --------- | ------- |
| Tip / info / warning kits | **NOT NOW** — decorative component sprawl |
| Definition | **SHOULD** only if recurring semantic role exists upstream |
| Caution / qualification | **SHOULD** rare; prefer prose emphasis |
| Key distinction | Often better as H3 or short threshold paragraph |
| Worked example | Prefer **material grammar**, not “callout” |

**Prefer fewer types.** Ordinary prose must not wear a box.

---

## 11. Closure & vertical rhythm (EQ8)

### Closure

Typography should support **one authoritative consolidation** continuous with the chapter.  
**MUST NOT** create a second decorative conclusion region.  
Special treatment for the final substantive section is **optional and subtle** (slightly more spacing before) — **SHOULD NOT** restyle it as a banner.  
Ownership of Closing furniture is EQ7/EQ8 architecture (T-008) — typography follows once regions are reduced.

### Vertical rhythm

Prefer **spacing and hierarchy over borders/panels/backgrounds**.

Articulate:

- title → opening;
- H2 → first paragraph;
- paragraphs;
- figure ↔ caption ↔ following prose;
- display equation isolation;
- table ↔ surrounding prose;
- supporting artefact ↔ chapter prose;
- final close.

Feel: **continuous but clearly articulated** — not marketing airiness, not gray textbook crush.

---

## 12. Responsive & accessibility

### Responsive

- Prose uses full narrow width minus gutter; keep leading.  
- Headings scale modestly (current ≤720px reductions acceptable pattern).  
- Tables/figures/maths: scroll or reflow without trapping meaning.  
- Captions remain readable.  
- Desktop is not the only design; narrow is first-class.

### Accessibility (typographic scope)

- Semantic heading order (H1→H2→H3).  
- Zoom/reflow readable.  
- Sufficient contrast for text/captions.  
- No meaning by colour alone.  
- Figures: alt/detailed description (VA).  
- Tables: header cells / scope where applicable.  
- Maths: keep accessible rendering path.  
- Reading order matches intellectual order.  
- Do not claim formal WCAG conformance in this doc.

---

## 13. Anti-patterns

1. Cardification of ordinary prose  
2. Excessive rounded rectangles / borders / fills  
3. Decorative colour coding  
4. Bold-heavy AI-document emphasis  
5. Over-labelled admin regions (stacked Overview / Purpose / Summary / Closing)  
6. Duplicate conclusion treatments  
7. Forced H3 density / heading fragmentation  
8. Forced or weakly warranted figures  
9. UI-like control tables  
10. Large empty “marketing” whitespace  
11. Cramped reprint density  
12. Identical visual treatment for all intellectual functions  
13. Renderer-inferred “important” styling without semantics  
14. Equation-in-a-card as default  

---

## 14. Upstream semantic requirements (CSS alone cannot do)

| Need | Why CSS insufficient | Likely owner |
| ---- | -------------------- | ------------ |
| Meaningful H3/subsections | Content must emit structure | XD |
| Worked-example identity | Commission/kind/body shape | XD → XM |
| Representation participation anchors | T-009 Option B | XD/XM/DP |
| Authoritative single close | Region/ownership | EJP/XD/DP (EQ8) — not typography |
| Definition/distinction roles | Only if callouts retained | XD (optional) |
| Furniture reduction | Fields/regions | DP + renderer policy (EQ7) |

---

## 15. Renderer capability requirements (conceptual)

```text
IF resource title exists        → express as H1
IF exposition section exists   → express as H2 + body measure
IF semantic subsection exists  → express as H3
IF display maths delimiter     → isolate with display spacing (no card)
IF figure/VA exists            → figure + quiet caption; a11y attrs preserved
IF table exists                → editorial table + overflow strategy
IF supporting material identity→ light artefact grammar (not LMS card)
IF ordinary paragraph          → body rhythm only — NEVER infer callout
DO NOT invent H3 from prose tone
DO NOT style orientation furniture as more “chapter-like” than the chapter
```

Deterministic only.

---

## 16. MUST / SHOULD / NOT NOW

### MUST

- Retain ~65–75ch prose measure target (70ch OK).  
- Preserve calm body size/leading; block paragraph spacing.  
- H1 title / H2 section grammar; semantic heading order.  
- Quiet captions; non-widget tables with overflow.  
- Display maths readable without default boxing.  
- Spacing-led vertical rhythm over panels.  
- Narrow viewport first-class behaviour.  
- Accessibility basics above.  
- Explicit anti-patterns for cardification / bold-heavy / inferred styling.

### SHOULD

- Soften figure/material chrome away from app cards.  
- Consistent styling for structured-material internal headings.  
- Optional reading/chrome face distinction **if** maths/licensing/deploy safe.  
- Modest display-equation spacing tokens.  
- Optional Figure n labelling when cross-reference helps.  
- Support genuine H3 when upstream emits subsections.  
- Subtle pre-close spacing — not a second close style.

### NOT NOW

- Mandatory serif redesign.  
- Tip/info/warning callout kits.  
- Deep H4+ learner hierarchy.  
- Mid-section figure pin grammar beyond T-009.  
- Decorative heroes / magazine layouts.  
- Component library / design-system programme.  
- AD-010 visual “design” of error fallback.  
- Formal WCAG certification programme in WP5.  
- Pixel-perfect visual snapshot suite as primary acceptance.

---

## 17. Validation approach (later implementation)

Qualitative human inspection on contrasting frozen types (re-export after changes; **do not** regenerate intellectual content for T-010):

| Resource type | Look for |
| ------------- | -------- |
| Bayes | Display maths calm; figures not card-loud; measure holds with equations |
| Interview protocol | Prose rhythm; low-visual restraint; no fake figure pressure |
| Selection vs Lamarck | Mechanism figures participate; captions quiet |
| WWI interpretive | Long-form readability; hierarchy without fragmentation |
| Deductive validity | Abstract conceptual clarity; lists/examples not bullet-spam |

**Checks (pass/fail qualitative):**

- Can the reader see argument structure before noticing design?  
- Are ordinary paragraphs unboxed?  
- Is emphasis selective?  
- Does zoom/narrow still read?  
- Are headings honest (no fake H3 density)?  
- Does one close feel like one close?

Avoid pixel-perfect snapshots as primary gate; optional deterministic CSS regressions only where stable.

---

## 18. Implementation surfaces (feed T-011; do not sequence here)

| Class | Examples |
| ----- | -------- |
| **A. Renderer/CSS-only** | Measure/rhythm tokens; caption quieting; soften borders; display-math spacing; style bare material `h3`; list/table polish |
| **B. Needs upstream semantics** | Real H3 subsections; furniture reduction; single close identity; material role signalling |
| **C. Already T-009** | Commission↔VA binding; participation intent — typography expresses, does not invent |
| **D. Deferred** | Serif programme; callout kits; deep hierarchy; AD-010 |

Primary CSS injection today: `app.js` → `getUtilityVnextProseMeasureCss()` (standalone export). Markup: `lib/learner-renderer-vnext/*`.

---

## 19. Production files inspected (read-only)

| File / symbol | Relevance |
| ------------- | --------- |
| `app.js` → `getUtilityVnextProseMeasureCss` | Measure `70ch`, body face/size/leading, headings, tables, figures, responsive |
| `app.js` → `composeStandaloneVnextLearnerExport` | Export CSS composition |
| `lib/learner-renderer-vnext/build-page-model.js` | `ORIENTATION_SECTION_DEFINITIONS` |
| `lib/learner-renderer-vnext/render-page.js` | Regions / headings |
| `lib/learner-renderer-vnext/render-html-utils.js` | Markdown → `util-md-heading` (always `h3`) |
| `lib/learner-renderer-vnext/render-visual-affordance.js` | Figure/caption markup |
| `lib/learner-renderer-vnext/expository-structured-materials.js` | Worked example / unsupported / bare `h3` |
| `lib/learner-renderer-vnext/math-entry-runtime.js` | Math entry (not display chapter maths) |

No production files modified.

---

## 20. Task / WP status

| Item | Status |
| ---- | ------ |
| S86-T-010 | **COMPLETE** |
| WP5 | **IN PROGRESS** — requirements done; T-011 successor implementation design pending |
| Next | **S86-T-011** when authorised |

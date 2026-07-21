# Sprint 68 — A1 Composition UX Review (S68-CHK-001)

**Date:** 2026-07-21  
**Scope:** Heteroscedasticity Activity 1 after S68-IMP-004  
**Comparison:** `compositionMode: "beats"` vs `compositionMode: "moments"`  
**Reviewer task:** Learner-experience review (not architecture investigation)

---

## 1. Review artefacts

Generated from the authoritative fixture  
`tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json`  
using production export shell CSS (`composeStandaloneVnextLearnerExportForTest`).

| Artefact | Path |
| -------- | ---- |
| Beats-mode full export | [`artefacts/heteroscedasticity-a1-beats-mode-export.html`](artefacts/heteroscedasticity-a1-beats-mode-export.html) |
| Moments-mode full export | [`artefacts/heteroscedasticity-a1-moments-mode-export.html`](artefacts/heteroscedasticity-a1-moments-mode-export.html) |
| A1-only beats HTML | [`artefacts/heteroscedasticity-a1-beats-mode-a1-only.html`](artefacts/heteroscedasticity-a1-beats-mode-a1-only.html) |
| A1-only moments HTML | [`artefacts/heteroscedasticity-a1-moments-mode-a1-only.html`](artefacts/heteroscedasticity-a1-moments-mode-a1-only.html) |
| A1 review pages (export CSS) | [`artefacts/heteroscedasticity-a1-beats-mode-a1-review.html`](artefacts/heteroscedasticity-a1-beats-mode-a1-review.html), [`artefacts/heteroscedasticity-a1-moments-mode-a1-review.html`](artefacts/heteroscedasticity-a1-moments-mode-a1-review.html) |
| Structural comparison JSON | [`artefacts/heteroscedasticity-a1-composition-structural-comparison.json`](artefacts/heteroscedasticity-a1-composition-structural-comparison.json) |
| Capture metadata | [`artefacts/heteroscedasticity-a1-composition-ux-review.capture.json`](artefacts/heteroscedasticity-a1-composition-ux-review.capture.json) |
| Regeneration script | [`artefacts/capture-a1-composition-ux-review.js`](artefacts/capture-a1-composition-ux-review.js) |

**Screenshots:** Full-page and A1-focused captures were taken during review via browser inspection of the HTML artefacts served locally. Regenerate by opening the review HTML files above in a browser at ~1280px width.

---

## 2. Structural verification (moments mode)

### Expected composed structure

| # | Moment | Present | Notes |
| - | ------ | ------- | ----- |
| 1 | Orient | Yes | `data-composition-moment="orient"` |
| 2 | Learn | Yes | `data-composition-moment="learn"` |
| 3 | Do | Yes | `data-composition-moment="do"` |
| 4 | Check | Yes | `data-composition-moment="check"` |

**Moment order:** orient → learn → do → check (confirmed in composed model and rendered HTML).

### Legacy beat wrappers

| Beat function | Beats mode | Moments mode |
| ------------- | ---------- | ------------ |
| `orientation` | Present (`Reflect` heading) | Absent (consumed by Orient) |
| `explanation` | Present (`Understand` heading) | Absent (consumed by Learn) |
| `check_understanding` | Present (`Check your work` heading) | Absent (consumed by Do + Check) |

Moments mode A1 has **zero** `util-beat-section` wrappers.

### Content singularity

| Content | Occurrences (moments) | Location |
| ------- | --------------------- | -------- |
| A1-M1 | 1 | Learn moment |
| A1-M2 | 1 | Do moment |
| A1-M3 | 1 | Check moment (`<details>`, closed) |
| A1-M4 | 1 | Check moment (visible) |
| Step 1 (study) | 1 | Learn moment |
| Steps 2, 5 (do) | 1 each | Do moment |
| Steps 3, 4 (check) | 1 each | Check moment |
| Expected output | 1 | Do moment (`What to produce`) |
| Workspace textarea | 1 | Do moment |
| Activity framing (preamble + reasoning) | 0 duplicate | Consolidated into Orient; `util-activity-framing` suppressed |

**No authored content disappeared.** All five learner-task steps and four materials render exactly once.

### Check reveal and workspace

- **Workspace:** `<textarea>` present with `aria-label="Record your response"` and non-persistence note.
- **A1-M3 reveal:** `<details>` without `open` attribute; summary text *Review the example response*.
- **Beats mode contrast:** A1-M3 is immediately visible; no workspace textarea.

### Structural discrepancies

None found. Composition model, source assignment, and rendered output align.

---

## 3. Structural comparison summary

| Metric | Beats mode A1 | Moments mode A1 |
| ------ | ------------- | --------------- |
| Beat sections | 3 | 0 |
| Composition moments | 0 | 4 |
| Activity framing block | Yes (preamble + reasoning with icon labels) | No (in Orient) |
| Study phase / activity purpose | Not shown | Shown in Orient |
| Workspace | No | Yes |
| Sample output default | Visible | Hidden in `<details>` |
| Expected output label | "Expected output" (beat icon heading) | "What to produce" (Do subheading) |
| Self-explanation prompt | In orientation beat with "Explain it to yourself" label | In Orient as plain composed text |
| HTML size (A1 fragment) | ~15.8 KB | ~13.6 KB |

---

## 4. Learner-experience findings

### 4.1 Orientation

**Beats mode**

- Activity opens with icon-labelled preamble and "How to think" reasoning box, then a separate **Reflect** beat with another icon-labelled prompt box.
- Study phase and timeline purpose are **not** visible at activity level.
- Feels like three stacked framing layers before substantive content.

**Moments mode**

- Orient consolidates study phase, activity purpose, preamble, reasoning orientation, and self-explanation into one section without beat heading.
- Semantically clearer: one framing block before learning begins.
- **Presentation issue:** Orient reads as five similar-weight paragraphs with no visual hierarchy. Study phase (*Build understanding*) and purpose line feel like metadata but use the same typography as instructional prose.
- **Density:** Orient is the longest uninterrupted text block in A1. Useful content, but visually flat and potentially skippable.

**Verdict:** Composition is **semantically better**; presentation needs hierarchy to distinguish metadata from learner-facing framing.

### 4.2 Concept learning (Learn)

**Beats mode**

- **Understand** beat heading creates a clear section restart.
- Step 1 instruction uses beat-instruction styling (left border + pencil icon).
- A1-M1 follows with material heading + body.

**Moments mode**

- **Explore the idea** moment heading replaces beat label — learner-friendly.
- Step 1 and A1-M1 are grouped under one moment — better narrative connection.
- **Presentation issue:** A1-M1 still renders with full `util-material-heading` (icon + title) inside a `util-composition-learn-item` wrapper. Material feels like an inserted artefact rather than integrated explanation.
- Learn instruction retains beat-instruction left-border styling inside a composed moment — visual cue from beat era persists.

**Verdict:** Flow is improved; material still looks "placed" rather than authored as one Learn section.

### 4.3 Learner action (Do)

**Beats mode**

- Do-related steps (2, 5), A1-M2, and expected output sit inside **Check your work** beat alongside verification steps and materials.
- Learner must parse which instructions are "do now" vs "check later".
- No workspace — step 5 is instruction only.

**Moments mode**

- **Your task** moment clearly separates action from verification.
- Task order preserved: step 2 → A1-M2 → step 5 → expected output → workspace.
- **Presentation issue:** `What to produce`, workspace label, and moment heading compete at similar visual levels (all h3/h4 without distinct treatment).
- Workspace is a bare `<textarea>` with no container styling — functional but visually disconnected from the task block.
- Non-persistence note is appropriately subtle.

**Verdict:** Major semantic improvement. "What to do now" is unmistakable. Workspace needs visual association with the writing task.

### 4.4 Verification (Check)

**Beats mode**

- Check content mixed with Do content under one beat heading.
- Sample response visible immediately — undermines compare-first intent of step 3.

**Moments mode**

- **Check your response** follows Do with explicit guidance: *Complete your response first, then use this material to check or improve it.*
- Sample response hidden behind native `<details>` — semantically correct.
- Checklist (A1-M4) visible — appropriate for self-check criteria.
- **Presentation issue:** `<summary>` uses browser default styling only; no visual grouping between comparison instruction, reveal, self-check step, and checklist.
- Step 4's misconception language remains in Check (authored); acceptable for this slice but reads as reflective prompt inside verification section.

**Verdict:** Verification flow is **meaningfully better**. Presentation of reveal and checklist grouping needs polish.

### 4.5 Overall flow

**Beats mode:** Feels mechanically assembled — three beat headings (Reflect / Understand / Check your work) create repeated visual restarts. Do and Check tasks are interleaved without narrative separation.

**Moments mode:** Reads as one guided activity with four labelled phases. Semantic arc is clear: frame → learn → do → check.

**Remaining presentation gaps:**

1. **No composition-specific CSS exists** — moments inherit beat-era instruction styling and generic h3 sizing.
2. **Four moment headings** (`Explore the idea`, `Your task`, `Check your response`) help, but spacing/rhythm between moments is identical to paragraph gaps.
3. **Icon + label repetition** on every instruction and material heading adds visual noise.
4. **Not too fragmented** — risk is opposite: moments may be **insufficiently differentiated** rather than over-separated.
5. **Length:** Total content unchanged; moments mode removes duplicate wrappers but adds Orient metadata (study phase, purpose), making the opening slightly longer.

**Net assessment:** The composition architecture produces a **meaningfully better learner experience** at the semantic level. The learner-visible gap is almost entirely **presentation**, not composition logic.

---

## 5. Composition findings

No composition defects requiring architecture reopen.

| Finding | Severity | Notes |
| ------- | -------- | ----- |
| Step 4 misconception prompt in Check | Informational | Authored verification task; standalone Reflect deferred by design. Not a misassignment for this slice. |
| Self-explanation loses "Explain it to yourself" label in Orient | Informational | Content preserved; label removal is presentation choice in composed renderer. Could restore via styling if desired. |
| Study phase / purpose only in moments Orient | By design | Sequence context composed in IMP-001; beats mode never showed these at activity level. |

---

## 6. Presentation findings

| # | Finding | Affected selectors / areas |
| - | ------- | -------------------------- |
| P1 | **No CSS for composed moments** — classes emitted but unstyled | `.util-composition-moment`, `.util-composition-moment-heading`, `.util-composition-moment__body` |
| P2 | Orient metadata (study phase, purpose) same weight as preamble | `.util-composition-framing`, `.util-composition-study-phase`, `.util-composition-activity-purpose` |
| P3 | Beat instruction left-border styling inside composed moments | `.util-beat-instruction` used inside `.util-composition-moment__body` |
| P4 | Learn material double heading (moment + material heading) | `.util-composition-learn-item` wrapping `.util-material-block` |
| P5 | Do expected output block lacks distinct "criteria" treatment | `.util-composition-expected-output`, `.util-composition-subheading` |
| P6 | Workspace unstyled — bare textarea | `.util-learner-workspace`, `.util-learner-workspace__input`, `.util-learner-workspace__note` |
| P7 | Check reveal uses browser-default `<details>` styling | `.util-composition-reveal`, `.util-composition-reveal__body`, `summary` |
| P8 | Check guidance paragraph undifferentiated | `.util-composition-check-guidance` |
| P9 | Moment-to-moment spacing identical to in-moment paragraph spacing | No margin rules on `.util-composition-moment` |
| P10 | Moment headings same typographic scale as beat headings | `.util-composition-moment-heading` vs `.util-beat-heading` — both render as h3 with similar export CSS |

---

## 7. Styling ownership

### Primary export CSS (production learner view)

| File | Function | Relevant selectors |
| ---- | -------- | ------------------ |
| [`app.js`](../../../app.js) | `getUtilityVnextProseMeasureCss()` (~L42861) | `.util-learner-renderer-vnext .util-beat-section`, `.util-beat-heading`, `.util-beat-instruction`, `.util-material-block`, `.util-output-block`, `.util-activity`, `.util-prose-measure` |
| [`app.js`](../../../app.js) | `getUtilityStandaloneExportBaseCss()` (~L42857) | Legacy `.util-task-block` card styling (mostly overridden for vNext activities) |

### Renderer HTML emitters (classes without CSS)

| File | Role |
| ---- | ---- |
| [`lib/learner-renderer-vnext/render-composed-moment.js`](../../../lib/learner-renderer-vnext/render-composed-moment.js) | Emits all `.util-composition-*` and `.util-learner-workspace*` classes |
| [`lib/learner-renderer-vnext/render-beat.js`](../../../lib/learner-renderer-vnext/render-beat.js) | Beat wrappers (suppressed in moments when empty) |
| [`lib/learner-renderer-vnext/render-material.js`](../../../lib/learner-renderer-vnext/render-material.js) | Material wrappers reused inside composed moments |
| [`lib/learner-renderer-vnext/learner-icon-renderer.js`](../../../lib/learner-renderer-vnext/learner-icon-renderer.js) | `getLearnerIconPresentationCss()` — icon spacing; `.util-beat-instruction` label rules |

### Beat styling inherited by composed content

Composed moments **reuse beat-era classes** for instructions and materials:

- Instructions → `util-beat-instruction util-icon-heading` (from `learner-icon-renderer.renderInstructionBlock`)
- Materials → `util-material-block`, `util-worked-example`, etc. (from `render-material`)
- Expected output in Do → custom `util-composition-expected-output` (no dedicated CSS)

**Conclusion:** Composed moments inherit beat-oriented instruction and material styling. A narrow presentation pass should **override beat cues inside `.util-composition-moment`** rather than refactor material renderers.

---

## 8. Recommended next slice — S68-IMP-005

### Title

**A1 composition moment presentation CSS pass**

### Rationale

Composition architecture is validated. The smallest high-impact next step is a **focused CSS pass** in the export stylesheet that makes the four composed moments read as one coherent guided activity — without changing composition logic, source assignment, or beats-mode output.

### Files to change

1. **`app.js`** — extend `getUtilityVnextProseMeasureCss()` with composition-moment rules (primary delivery path for exported learner pages).
2. **Optional:** `lib/learner-renderer-vnext/learner-icon-renderer.js` — add composition-scoped icon/instruction overrides to `getLearnerIconPresentationCss()` if export-only CSS proves insufficient for preview parity.

**Do not change:** `compose-activity-moments.js`, `compose-page-model.js`, beat suppression, or material renderer logic.

### Presentation changes (minimum set)

| Area | Change |
| ---- | ------ |
| Moment rhythm | Add top margin/padding between `.util-composition-moment` sections; first moment flush after activity header |
| Moment headings | Style `.util-composition-moment-heading` with distinct but calm hierarchy (e.g. size between activity title and body; optional subtle bottom border) |
| Orient metadata | De-emphasise `.util-composition-study-phase` and `.util-composition-activity-purpose` (smaller, muted colour); keep preamble/reasoning at body weight |
| Instructions in moments | Inside `.util-composition-moment`, soften or remove beat left-border on `.util-beat-instruction` |
| Learn integration | Reduce visual weight of material heading inside `.util-composition-learn-item--definition` OR add subtle inset panel for definition content |
| Do workspace | Style `.util-learner-workspace` with light border, padding, rounded container; full-width textarea |
| Do expected output | Style `.util-composition-expected-output` consistently with check guidance (subtle panel, not beat output block) |
| Check reveal | Style `.util-composition-reveal summary` (cursor, padding, chevron via CSS); panel for `.util-composition-reveal__body` |
| Check guidance | Muted italic or callout styling for `.util-composition-check-guidance` |

### Must remain unchanged

- Composition adapter and source assignment (IMP-001–004)
- Authored content text
- Moment order and semantic grouping
- Check reveal default closed; no JavaScript
- Workspace non-persistence semantics and copy
- Beats mode HTML output (CSS selectors must be scoped to `.util-composition-moment` descendants only)
- A2–A5 rendering
- No Reflect/Transition composition
- No PRISM schema or pipeline changes

### Acceptance criteria

1. A1 moments mode: four moments visually distinguishable as sequential phases of one activity.
2. No beat-section visual restarts inside A1 (no beat headings; no beat-style section gaps).
3. Orient metadata visually subordinate to Learn/Do/Check headings.
4. Do workspace visually grouped with step 5 and "What to produce".
5. Check `<details>` summary clearly interactive; checklist and instructions visually grouped.
6. Beats mode A1 export **pixel-unchanged** (verify with existing golden/HTML tests).
7. All 210+ vNext tests continue to pass.
8. No new authored instructional text introduced.

---

## 9. Conclusion

S68-IMP-001 through S68-IMP-004 successfully transform A1 from beat-serialised output into a four-moment learner flow with correct source consumption, workspace, and verification reveal. The composition model is **fit for purpose**.

The learner-visible gap is **presentation**: composed moments emit semantic HTML classes but ship with **zero dedicated styling**, inheriting beat-era instruction and material treatments that undermine the coherence the composition layer achieves structurally.

**S68-IMP-005** should be a narrow CSS pass scoped to `.util-composition-moment` in `getUtilityVnextProseMeasureCss()` — sufficient to make A1 feel like one guided activity without reopening composition architecture.

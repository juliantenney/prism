# Visual Enhancement Utility v1.1.1 — figure placement patch

**Date:** 2026-06-03  
**Fixes:** Figures inserted inside `.util-activity-header` (between `h3` and `.util-badge-row`), breaking flex header layout on climate (and similar) enhanced pages.

**Bundle:** [`visual-enhancement-utility-v1.1.1.json`](visual-enhancement-utility-v1.1.1.json)  
**Scope:** Prompt guidance on the **embed** step only — no workflow schema, renderer, or LD generation changes.

**Step index:**

| Workflow in bundle | Embed step in Run UI | Prompt id |
|--------------------|----------------------|-----------|
| `Visual Enhancement Utility (embed only) v1.1.1` | **Step 1** | `prompt-veu-03-embed-html-v111` |
| `Visual Enhancement Utility v1.1.1` (3-step) | **Step 3** | same prompt |

Use the **embed-only** workflow if your v1.1.0 bug appeared on Step 1 of a compact augment pass. The placement fix is always in the embed prompt, not analysis or generation.

---

## What changed (v1.1.0 → v1.1.1)

| Area | v1.1.0 | v1.1.1 |
|------|--------|--------|
| Embed-step prompt | Allowed figures near activity titles | **Hard forbid** figures inside headers, badge rows, headings, icon/section heading wrappers |
| DOM placement | Implicit / “near activity” | **Explicit** block-level sibling rules after header/framing |
| CSS (renderer) | V31_10 materials/summary only | Adds `.util-activity-header + .util-figure--pedagogic` spacing (accommodation, not fix) |

---

## Embed-step prompt — add or replace this block

Apply to prompt **`prompt-veu-03-embed-html-v111`** (title: *Embed pedagogic figures into learner HTML*) — workflow **Step 3** in the bundled export. If your v1.1.0 lists this as **Step 1**, merge the **Figure placement — HARD RULES** section into that step’s body; do not remove artefact-handling or accessibility instructions already present.

### Forbidden containers (never insert a figure inside)

- `.util-activity-header`
- `.util-badge-row`
- Any `h1`–`h4`
- `.util-icon-heading` and inline heading/icon wrappers
- `.util-section-heading`

### Placement rule (required)

Figures must be **block-level siblings** after the relevant header/framing block — **never** children of `.util-activity-header`.

**Correct (activity-level):**

```html
<div class="util-activity-header">
  <h3>…</h3>
  <div class="util-badge-row">…</div>
</div>
<figure class="util-figure util-figure--pedagogic">…</figure>
```

**Wrong:**

```html
<div class="util-activity-header">
  <h3>…</h3>
  <figure class="util-figure util-figure--pedagogic">…</figure>
  <div class="util-badge-row">…</div>
</div>
```

### Preferred placement (activity-level visuals)

1. **After** `.util-activity-header` and **before** `.util-activity-framing`, when the figure orients the activity; OR  
2. **After** `.util-activity-framing` and **before** `.util-activity-task--primary` when the figure supports framing; OR  
3. **Inside** `.util-activity-materials` only when the figure directly supports a worksheet, table, or named material block.

### Do not place figures

- Between `h3` and `.util-badge-row`
- Between task instruction (`.util-activity-task--primary` / “What to do”) and the worksheet/table it references
- Inside flex header containers
- Inside `.util-icon-heading` or `.util-section-heading`

### Markup

Use `<figure class="util-figure util-figure--pedagogic">` with `<img alt="…">` and `<figcaption>` per Sprint 32 accessibility guidance. Embed images at the export boundary only (no base64 in prompts).

---

## Import / upgrade

1. In PRISM: **Import workflow** → select `visual-enhancement-utility-v1.1.1.json` (merge **newerWins** if prompted).  
2. Or: open the **embed** step prompt in Prompt Library and paste the block above (Step 3 in bundle; Step 1 if single-step).  
3. Re-run the embed step on climate enhanced HTML (or full utility run from rendered export + image artefacts).  
4. Confirm DOM: no `figure` inside `.util-activity-header`; badge row remains in header; figure is full-width below header.

---

## Manual regression (climate enhanced HTML)

- [ ] Each activity `h3` sits above the figure (not beside it in a flex row)  
- [ ] `.util-badge-row` remains inside `.util-activity-header`  
- [ ] Figure appears below header as a block sibling  
- [ ] Task instruction stays adjacent to its worksheet/table  
- [ ] No `<figure>` descendant of `.util-activity-header`

**Renderer:** Sprint 36 V31_10 figure accommodation unchanged in spirit; `app.js` adds header-adjacent margin for correctly placed figures only.

**PRISM affordance anchors (renderer):** Learner pages now emit hidden block-level hooks (`.util-visual-affordance`, `data-visual-slot="…"`) at safe positions — e.g. immediately after `.util-activity-header` (`activity-after-header`), after `.util-card-grid` (`materials-card-grid-after`), between paired `.util-table-scroll` wrappers (`materials-table-pair-between`). Utilities should insert figures **at or adjacent to these slots**, not inside headings or `.util-activity-header`. Hooks are hidden in the learner view via `.util-visual-affordance{display:none!important}`.

---

## Related

- Sprint 36 observation: [`36-4-imaging-placement-affordances.md`](../../development/sprints/2026-06-03-sprint-36-session-design-visual-pedagogy/observations/36-4-imaging-placement-affordances.md)  
- Sprint 31 activity order: [`sprint-31-renderer-architecture-summary.md`](../../development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/sprint-31-renderer-architecture-summary.md)

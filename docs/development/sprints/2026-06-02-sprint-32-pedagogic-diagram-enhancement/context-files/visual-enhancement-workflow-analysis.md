# Visual enhancement workflow analysis (audit frame)

**Status:** Planning template — **populate during first Sprint 32 implementation chat**  
**Date:** 2026-06-02

---

## Purpose

Document **current-state** workflow and export paths related to visuals **before** designing Sprint 32 steps. This file is an **audit checklist**, not an approved design.

---

## Target architecture (Sprint 32 north star)

```text
Rendered learner HTML
  → analyse pedagogic visual opportunities (tiered)
  → generate educational graphics → FILE ARTEFACTS
  → (optional human review)
  → place figures respecting Sprint 31 DOM hierarchy
  → final assembly: embed images → self-contained HTML download
```

| Principle | Detail |
|-----------|--------|
| **Artefacts** | Images as workflow step outputs (files / refs) |
| **No base64 in prompts** | Never pass image bytes through LLM context |
| **Base64 at boundary** | Final HTML embedding step only |
| **Fallback** | User download + re-upload if persistence missing |

---

## Legacy SVG workflow (historical — not final target)

> **The existing SVG-oriented workflow (if present in repo or author practice) is useful historical context but is NOT the final architecture target for Sprint 32.**

During audit, record:

| Question | Finding (TBD) |
|----------|----------------|
| Where is SVG generation invoked? | |
| Is SVG inline in HTML or a separate artefact? | |
| Does SVG flow through prompts as text? | |
| Known limitations (accessibility, editability, model quality)? | |
| Deprecation vs migration recommendation? | |

**Likely audit locations** (confirm in codebase):

- `app.js` — workflow run/export helpers  
- `workflowGenerationContext.js` — generation context  
- Saved workflow JSON under author exports / examples  
- `docs/workflow/workflow-spec.md` — step `inputKind` / artefact rules  
- Any prompts mentioning diagram, illustration, SVG, or image  

---

## Audit checklist

### A. Inputs

- [ ] What artefact is the **first** visual-analysis step input? (rendered HTML path, JSON path, both?)  
- [ ] How is learner HTML produced today? (`buildUtilityStructuredHtml` export?)  
- [ ] Is HTML stable enough for DOM-targeted placement?

### B. Workflow topology

- [ ] List existing workflows with visual/diagram steps  
- [ ] Step types: extraction vs generation vs synthesis  
- [ ] `outputName` / `inputFromStepId` chains for images  
- [ ] Human review gates present or needed?

### C. Artefact persistence

- [ ] Where are step outputs stored (browser, file picker, download)?  
- [ ] Maximum artefact size / type restrictions  
- [ ] Can binary image files round-trip between steps?  
- [ ] Document **re-upload fallback** UX if persistence fails

### D. Export / self-contained HTML

- [ ] Current “download HTML” behaviour  
- [ ] Are external image URLs used today? (breaks offline)  
- [ ] MIME types and embedding strategy at export  
- [ ] CSP / `file://` offline open requirements

### E. Governance gaps

- [ ] Any step that encourages decorative images?  
- [ ] Any prompt that inlines base64? (**flag for removal**)  
- [ ] Scoring / tier enforcement absent?

---

## Comparison: legacy SVG vs target pipeline

| Dimension | Legacy SVG (audit) | Sprint 32 target |
|-----------|-------------------|------------------|
| Primary output | SVG text / inline? | Raster/vector **files** |
| Prompt payload | Often large text | Text **descriptions** + artefact refs |
| Accessibility | Variable | Required alt + figure semantics |
| Pedagogic tiers | Unknown | Essential → rejected |
| Offline HTML | Unknown | Self-contained embedded |

---

## Outputs of audit (to record in review-log)

1. **R32-002** (future): workflow baseline decision after audit complete.  
2. Recommended **deprecation** or **parallel run** for SVG path.  
3. Artefact contract sketch for slice 32-1 charter.

---

## Related docs

- [`proposed-sprint-32-slices.md`](proposed-sprint-32-slices.md)  
- [`sprint-31-boundary-summary.md`](sprint-31-boundary-summary.md)  
- [`../../workflow/workflow-spec.md`](../../../workflow/workflow-spec.md)

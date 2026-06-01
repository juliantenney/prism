# Proposed Sprint 32 slices (draft — NOT approved)

**Status:** Planning draft only — **no `slice-32-N-charter.md` files exist**  
**Approval:** Requires `R32-002+` entries in [`../review-log.md`](../review-log.md)

---

## Slice overview

| Slice | Name | Layer | Depends on |
|-------|------|-------|------------|
| **32-1** | Workflow redesign & artefact handoff | Workflow | Audit complete |
| **32-2** | Pedagogic visual opportunity scoring | Workflow / analysis | 32-1 |
| **32-3** | Educational image prompt architecture | Workflow / generation | 32-2 |
| **32-4** | Accessibility & figure semantics | Workflow + export | 32-3 |
| **32-5** | Placement & layout strategy | Workflow + HTML transform | 32-1, 31 boundaries |
| **32-6** | Final HTML assembly / export robustness | Export | 32-4, 32-5 |
| **32-7** | Quantitative / STEM visual foundations *(optional)* | TBD | 32-6 or separate programme |

---

## 32-1 — Workflow redesign & artefact handoff

**Goal:** Define step topology and **file-based** image artefact contract between workflow steps.

**Deliverables (when chartered):**

- Step sequence: HTML in → analysis → generation → (review) → assembly  
- Artefact schema: mime type, filename, pedagogic metadata (tier, anchor selector)  
- Explicit **no base64 in prompts** enforcement  
- Re-upload fallback documented  

**Out of scope:** Image model vendor selection unless blocking.

---

## 32-2 — Pedagogic visual opportunity scoring

**Goal:** Analyse rendered HTML and emit **scored, tiered** visual opportunities.

**Deliverables:**

- Rubric aligned with charter tiers: essential / valuable / optional / decorative-rejected  
- Structured output (JSON) listing candidate figures with justification  
- **No fixed image cap** — density-aware downgrade of optional tier  
- Preserve learning design — analysis references existing tasks/materials  

**Out of scope:** Rewriting instructional prose.

---

## 32-3 — Educational image prompt architecture

**Goal:** Turn approved opportunities into **high-quality image generation prompts** and produce **file artefacts**.

**Deliverables:**

- Prompt templates per figure type (process, comparison, structure, timeline)  
- Quality rules from [`diagram-quality-targets.md`](diagram-quality-targets.md)  
- Model invocation returns **files**, not inline bytes in chat context  
- Rejection path for decorative-rejected tier  

**Out of scope:** Sketch/stock styles; base64 in prompts.

---

## 32-4 — Accessibility & figure semantics

**Goal:** Every figure has alt text, caption policy, and semantic HTML wrapper.

**Deliverables:**

- Generation or templating of `alt` + `figcaption`  
- `<figure>` assembly rules  
- Non-colour-only signalling checklist  
- Assessment-specific alt rules (no answer leakage)  

See [`accessibility-principles.md`](accessibility-principles.md).

---

## 32-5 — Placement & layout strategy

**Goal:** Insert figures **without breaking** Sprint 31 visual hierarchy.

**Deliverables:**

- DOM anchor rules (materials stack, knowledge summary, etc.)  
- CSS for figure containers that harmonise with V31_* presentation  
- Density rules — avoid crowding primary task  
- Manual override hook for authors (future UX detail)  

**Out of scope:** Sprint 31 renderer rewrites.

Reference: [`sprint-31-boundary-summary.md`](sprint-31-boundary-summary.md).

---

## 32-6 — Final HTML assembly / export robustness

**Goal:** Produce **self-contained downloadable HTML** with embedded images.

**Deliverables:**

- **Base64 (or inline) encoding at this step only**  
- Offline-open validation  
- Relative / external URL policy documented  
- Export size and performance notes  

**Fallback:** Document download + re-upload path when artefacts not persisted.

---

## 32-7 — Quantitative / STEM visual foundations *(optional)*

**Goal:** Establish whether charts, plots, and notation belong in Sprint 32 or a follow-on programme.

**Deliverables (if approved):**

- Scope note for tables → charts, simple math notation  
- Accuracy validation concept  
- Decision recorded in review-log  

See [`future-quantitative-rendering-notes.md`](future-quantitative-rendering-notes.md).

**Default:** defer until 32-6 complete.

---

## Implementation gate

Before any slice work:

1. `R32-001` — pack created (**done**)  
2. Workflow audit populated — [`visual-enhancement-workflow-analysis.md`](visual-enhancement-workflow-analysis.md)  
3. `R32-002` — approve slice 32-1 charter  
4. Test floor **502** maintained — [`../baseline-test-floor.md`](../baseline-test-floor.md)

**Do not create implementation tasks in `app.js` or workflow JSON until the corresponding slice charter is approved.**

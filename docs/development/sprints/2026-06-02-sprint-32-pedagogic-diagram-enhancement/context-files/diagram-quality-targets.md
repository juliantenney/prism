# Diagram quality targets

**Programme:** Sprint 32 — pedagogic diagram enhancement  
**Status:** Governance baseline — applies when generation is implemented

---

## Quality bar

Generated figures must meet **publication-quality educational** standards suitable for **university learning materials**.

| Criterion | Target |
|-----------|--------|
| **Clarity** | Single focal concept per figure; legible labels at export resolution |
| **Accuracy** | Faithful to page content; no invented facts or misleading simplification |
| **Pedagogic alignment** | Directly supports a stated learning need (see inclusion tiers in charter) |
| **Editorial style** | Clean, professional, textbook-quality layout |
| **Consistency** | Coherent palette, typography, and line weight within one page export |

---

## Style direction

### Encouraged

- Simplified **educational diagrams** (process flows, labelled structures, comparison panels)  
- **Annotated** elements tied to vocabulary in the page  
- High contrast for projection and print  
- Generous whitespace; readable label font sizes  

### Discouraged / rejected

| Style | Tier |
|-------|------|
| **Sketch / doodle** aesthetic | Rejected for default pipeline |
| **Decorative stock-art** | **Decorative / rejected** |
| **Meme / clipart** | Rejected |
| **3D gimmick** without pedagogic need | Optional at best |
| **Dense infographic** replacing prose | Usually optional or rejected (density) |

---

## Technical quality

| Requirement | Notes |
|-------------|--------|
| **Resolution** | Sufficient for retina and print (define per slice charter) |
| **Format** | PNG/WebP for photos; SVG only if accessibility and export path chartered |
| **Text in image** | Prefer real text in HTML caption/alt where possible; minimise baked-in tiny text |
| **Colour** | Not sole carrier of meaning (see accessibility doc) |

---

## Prompt architecture hints (for slice 32-3)

Prompts should specify:

1. **Pedagogic job** of the figure (compare, sequence, locate, classify)  
2. **Audience** (self-directed university learner)  
3. **Must include** labels from source content  
4. **Must avoid** decorative framing, characters, stock backgrounds  
5. **Output** description for image model — **not** base64  

---

## Review rubric (manual QA)

Score 1–5 on representative exports (Marx, RNA, kitchen sink):

| Dimension | 1 (poor) | 5 (excellent) |
|-----------|----------|---------------|
| Pedagogic necessity | Decorative | Essential tier justified |
| Accuracy | Misleading | Faithful |
| Visual clarity | Cluttered | Scannable |
| Accessibility | Missing alt | Full figure semantics |
| Fit with page | Disrupts hierarchy | Respects Sprint 31 rhythm |

---

## No fixed image cap

Quality and tier govern inclusion — **not** a maximum count. Dense pages should **downgrade** optional tiers before adding figures.

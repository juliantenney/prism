# Why Sprint 70 Exists

**Related:** [HANDOVER.md](HANDOVER.md) · [CONTEXT.md](CONTEXT.md) · [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Why isn't the current workflow sufficient?

Sprint 38 established **pedagogical authority** for visuals: `visual_affordances[]` with `generate | defer | reject`, activity-level gating, and rich generate fields (`purpose`, `must_show`, `representation_avoid`, etc.).

Sprint 36 established **placement authority**: hidden `.util-visual-affordance` hooks with `data-visual-slot` and `data-affordance-id`.

The **Visual Enhancement Utility (VEU v1.2.1)** bridges HTML and images today — but as an **external Copilot workflow**, not as native Prism capability. Authors must:

1. Export learner HTML from Prism Utilities.
2. Attach compose JSON separately.
3. Run VEU Step 1 (LLM scans HTML, inserts figures, emits `image_queue`).
4. Run VEU Step 2 once per queue item (LLM generates one PNG).
5. Manually manage filenames, folder layout, and package integrity.

This is fragile, opaque, and splits ownership across tools.

## Why not integrate an image API now?

Image generation APIs change rapidly, have cost/compliance implications, and are not required to prove the **pipeline architecture**. Sprint 70 validates that Prism can own jobs, prompts, assets, and assembly **before** automating generation.

Manual generation (Copilot, DALL·E, designer tools) remains sufficient for production authoring during Sprint 70.

## Why not base64 / self-contained HTML?

Self-contained HTML (base64 embedding) simplifies single-file sharing but:

- breaks caching and accessibility tooling expectations;
- inflates package size;
- obscures asset provenance;
- diverges from the established `<img src="media/...">` learner renderer contract.

Linked media folders are the correct delivery shape. Base64 export is explicitly deferred.

## Why is Prism ownership the correct next step?

| Concern | Today | Sprint 70 target |
| ------- | ----- | ---------------- |
| Which visuals to generate | Sprint 38 affordances (authoritative) | Same — no change |
| Prompt composition | VEU Step 1 LLM inference | **Prism deterministic builder** from affordance fields |
| Filename assignment | VEU rename checklist | **Prism auto-assign** from job model |
| Asset storage | Manual `images/` folder | **Prism upload + tracking** |
| Figure insertion | VEU Step 1 LLM | **Prism assembler** at known hook locations |
| Package export | Manual assembly | **Prism export** (`index.html` + `media/` + manifest) |

Prism already owns affordance decisions and hook placement. Sprint 70 completes the loop for **orchestration and delivery** without owning pixel synthesis.

## Why is this a natural evolution from Sprint 38?

Sprint 38 answered: *should we generate a visual, where, and with what pedagogical constraints?*

Sprint 70 answers: *how does Prism operationalise approved affordances into a shippable learner package?*

The renderer contract (`<img src="media/...">`) and Sprint 38 schema remain unchanged. Only the **workflow surface** moves in-process.

---

Sprint 70 is a **workflow consolidation sprint**, not a pedagogical redesign sprint.

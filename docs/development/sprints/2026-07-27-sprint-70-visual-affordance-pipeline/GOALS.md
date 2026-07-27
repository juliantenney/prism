# Sprint 70 Goals

**Related:** [WHY-SPRINT-70.md](WHY-SPRINT-70.md) · [HANDOVER.md](HANDOVER.md) · [PLAN.md](PLAN.md)

---

## Primary goal

Replace the manual multi-tool visual workflow with a **Prism-owned visual affordance pipeline** while keeping image generation external.

## Objectives (minimal v1)

Prism should:

1. **Generate one visual job per approved visual affordance** (`visual_decision: generate`), containing:
   - `affordance_id`
   - `activity_id`
   - `filename`
   - `prompt`
   - `caption`
   - `alt` text
   - `visual_status`

2. **Provide a UI** that allows:
   - copy prompt
   - paste/upload generated image
   - replace image
   - remove image

3. **Store uploaded images** against the affordance with the expected filename.

4. **Automatically assign** the expected filename per job.

5. **Assemble** the finished learner package:
   - `index.html`
   - `media/` folder
   - visual manifest

6. **Export** the completed HTML package.

## Non-goals (explicit)

Do **not** implement in Sprint 70:

- API image generation
- automatic Copilot integration
- image editing
- AI image QA
- base64 embedding / self-contained HTML export
- provider abstraction
- automatic retries

Those remain future work.

## Architectural principles

**Prism owns:**

- visual affordance decisions (consume Sprint 38 schema)
- prompt generation (deterministic from affordance fields)
- filenames and asset tracking
- figure insertion at renderer hook locations
- package assembly and export

**External tools own:**

- image generation only (manual Copilot or other tools)

**Renderer contract:**

- continue using standard linked images: `<img src="media/...">`
- do not implement base64 export during Sprint 70

## Definition of Done

Authoritative checklist: [HANDOVER.md — Sprint 70 Definition of Done](HANDOVER.md#sprint-70-definition-of-done).

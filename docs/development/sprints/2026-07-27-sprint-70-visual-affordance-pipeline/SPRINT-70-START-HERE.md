# Sprint 70 — START HERE

**Related:** [WHY-SPRINT-70.md](WHY-SPRINT-70.md) · [HANDOVER.md](HANDOVER.md) · [CONTEXT.md](CONTEXT.md) · [PLAN.md](PLAN.md)

---

## What is already complete?

- **Sprint 38** — pedagogical visual affordance schema (`38.4`), compose validation, renderer hook plan, VEU v1.2.1 alignment spec.
- **Sprint 36** — placement hooks (`.util-visual-affordance`, `data-visual-slot`).
- **Sprint 69** — learner-renderer-vNext certified; material canonicalisation complete.
- **VEU v1.2.1** — external workflow that today performs Step 1 (HTML scan + figure insert + `image_queue`) and Step 2 (one image per queue item).

## What problem remains?

Authors still run a **manual multi-tool workflow**: export HTML from Prism → attach JSON → run VEU in Copilot → copy prompts → generate images externally → rename files → manually verify package integrity.

Prism does not yet own job generation, prompt composition, asset storage, or package assembly end-to-end.

## Why does it matter?

Sprint 38 fixed **what** to generate (pedagogical affordances). Sprint 70 fixes **how** Prism orchestrates generation handoff and delivery — without coupling to a specific image API.

## What should be implemented first?

1. Visual job model — one job per approved `visual_decision: generate` affordance.
2. Deterministic prompt builder from Sprint 38 generate fields.
3. Minimal UI — copy prompt, upload/replace/remove image per job.
4. Package assembler — `index.html` + `media/` + visual manifest + export.

Details: [PLAN.md](PLAN.md)

## What must not be broken?

- Sprint 38 affordance validation and renderer hook contract
- Linked image references: `<img src="media/...">` (no base64 in Sprint 70)
- Fail-closed affordance semantics (`generate` / `defer` / `reject`)
- Learner-renderer-vNext certification baseline

## Read next

1. [WHY-SPRINT-70.md](WHY-SPRINT-70.md) — why this sprint exists
2. [CONTEXT.md](CONTEXT.md) — current architecture and manual workflow
3. [HANDOVER.md](HANDOVER.md) — principles, scope, Definition of Done
4. [ARCHITECTURE.md](ARCHITECTURE.md) — pipeline design
5. [PLAN.md](PLAN.md) — phased roadmap
6. [TASKS.md](TASKS.md) — task breakdown

Context: **Sprint 08** closed as **planning-only**. **Sprint 09** is **opened** as the first **bounded implementation** sprint: **workflow brief semantics alignment pass 1** (terminology, UI/help copy, narrow brief-field clarification, reduced workflow leakage in user-facing wording). **Sprint 07** review and **Sprint 08** consolidation define the **learner-facing page**, **page composition**, and lifecycle vocabulary.

Task: Execute **Sprint 09 — Workflow Brief Semantics Alignment (Pass 1)** per `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`.

Priority:

1. **Audit first** — fill the **UI term / field** audit table (current vs proposed wording, behaviour risk, code flag).
2. **Implement only** what the audit marks as **low blast radius** (typically label/tooltip/help copy), preserving runtime and generation behaviour.

Constraints:

- **No** generator rewrite, workflow-engine redesign, sequencing engine, renderer redesign, domain-pack rewrite, broad brief-field restructuring, **hidden** behaviour changes, major `app.js` restructuring, or assessment-system redesign unless the user **explicitly** rescopes.
- **No silent semantic migrations** (persisted keys, prompt contracts, save formats) without explicit charter amendment and audit sign-off.
- Preserve **compact workflows**, **lightweight elicitation**, **artefact chaining**, **learner-facing coherence**, **emergent pedagogic sequencing behaviour**.

Starter pack:

- `docs/development/sprints/2026-05-12-sprint-09-workflow-brief-semantics-alignment-pass-1/` including `context-files/`

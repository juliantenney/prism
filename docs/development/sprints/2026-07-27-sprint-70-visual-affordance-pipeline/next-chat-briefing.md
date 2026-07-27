# Sprint 70 — Next Chat Briefing

Sprint 69 is closed. Begin Sprint 70.

Use this pack: `docs/development/sprints/2026-07-27-sprint-70-visual-affordance-pipeline/`

Start with:
1. [SPRINT-70-START-HERE.md](SPRINT-70-START-HERE.md)
2. [WHY-SPRINT-70.md](WHY-SPRINT-70.md)
3. [CONTEXT.md](CONTEXT.md)
4. [HANDOVER.md](HANDOVER.md)
5. [PLAN.md](PLAN.md)

Mission:
- replace manual multi-tool visual workflow with Prism-owned visual affordance pipeline
- generate one visual job per approved `generate` affordance (affordance_id, activity_id, filename, prompt, caption, alt, status)
- UI: copy prompt, paste/upload image, replace, remove
- assemble `index.html`, `media/`, visual manifest; export HTML package
- **keep image generation external** (Copilot/manual)

Explicit non-goals:
- no API image generation
- no automatic Copilot integration
- no base64 HTML export
- no provider abstraction or automatic retries

Key existing modules:
- `lib/sprint38-visual-affordances.js`
- `lib/learner-renderer-vnext/sprint38-visual-affordance-plan.js`
- `utilities/visual-enhancement-utility/` (reference behaviour — do not redesign in Sprint 70)

Predecessor closeout: [sprint-69-closeout.md](../../../sprints/sprint-69-closeout.md)

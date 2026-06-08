# Sprint 38-S — Phase 2 (Prompt sanitisation + manual workflow)

**Sprint pack:** [../README.md](../README.md) · **Charter:** [../IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)  
**Handover:** [38S-handover-pack.md](38S-handover-pack.md)

Phase 2 follows **38S-6 harness closure**. It reduces prompt debt after Episode Plan V1 integration and hardens the **manual Copilot copy/paste workflow** (LO → Episode Plan → DLA → GAM → Page).

---

## Phase index

| Phase | Title | Doc | Status |
|-------|-------|-----|--------|
| **Pre** | Prompt responsibility audit | [38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md](38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md) | Complete |
| **1** | Deletion potential (read-only) | [38S-prompt-sanitisation-phase-1-deletion-potential.md](38S-prompt-sanitisation-phase-1-deletion-potential.md) | Complete |
| **2A** | DLA pack subtraction | [38S-prompt-sanitisation-phase-2a-dla-only.md](38S-prompt-sanitisation-phase-2a-dla-only.md) | Complete |
| **2B** | GAM audit (read-only) | [38S-prompt-sanitisation-phase-2b-gam-audit.md](38S-prompt-sanitisation-phase-2b-gam-audit.md) | Complete |
| **2B** | GAM dedupe (first 3 items) | [38S-prompt-sanitisation-phase-2b-gam-dedupe.md](38S-prompt-sanitisation-phase-2b-gam-dedupe.md) | Complete |
| **2B-b** | PEL / runtime audit (read-only) | [38S-prompt-sanitisation-phase-2b-b-pel-audit.md](38S-prompt-sanitisation-phase-2b-b-pel-audit.md) | Complete |
| **2B-b.1** | Runtime thinness alignment | [38S-prompt-sanitisation-phase-2b-b1-runtime-thinness-alignment.md](38S-prompt-sanitisation-phase-2b-b1-runtime-thinness-alignment.md) | Complete |
| **2C** | Design Page responsibility audit (read-only) | [38S-phase-2c-page-responsibility-audit.md](38S-phase-2c-page-responsibility-audit.md) | Complete |
| **WF** | Episode Plan → DLA chaining (PF-11 round 1) | [38S-episode-plan-dla-chaining-fix.md](38S-episode-plan-dla-chaining-fix.md) | Complete |
| **WF** | PF-11 upstream resolution + instrumentation | [38S-pf11-dla-upstream-resolution-fix.md](38S-pf11-dla-upstream-resolution-fix.md) | Complete |

**Code fixes not yet documented:** PF-11 round 2 (upstream-section dedup regex) + Episode Plan STEP footer restore — see [38S-handover-pack.md](38S-handover-pack.md) §9.

---

## Metrics artefacts

| Phase | Artefact |
|-------|----------|
| 2A | [../artefacts/EV-38S-2A-dla-prompt-metrics.json](../artefacts/EV-38S-2A-dla-prompt-metrics.json) |
| 2B | [../artefacts/EV-38S-2B-gam-prompt-metrics.json](../artefacts/EV-38S-2B-gam-prompt-metrics.json) |

---

## Reading order

1. [Responsibility audit](38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md)
2. [Phase 1 deletion potential](38S-prompt-sanitisation-phase-1-deletion-potential.md)
3. [Phase 2A DLA](38S-prompt-sanitisation-phase-2a-dla-only.md) → [Phase 2B GAM audit](38S-prompt-sanitisation-phase-2b-gam-audit.md) → [Phase 2B dedupe](38S-prompt-sanitisation-phase-2b-gam-dedupe.md)
4. [Phase 2B-b PEL audit](38S-prompt-sanitisation-phase-2b-b-pel-audit.md) → [Phase 2B-b.1 runtime alignment](38S-prompt-sanitisation-phase-2b-b1-runtime-thinness-alignment.md)
5. [Handover pack](38S-handover-pack.md) — start here for a new chat

---

## Open work (Phase 2 continuation)

- Manual **Inflation** UI re-run (LO → EP → DLA → GAM → Page)
- Phase **2C-a** — Page pack/runtime preserve tightening (see [38S-phase-2c-page-responsibility-audit.md](38S-phase-2c-page-responsibility-audit.md))
- Phase **2B-b.2** — align `buildSelfDirectedGamPelReasoningMaterialPromptBlock`
- Phase **2B-c** — GAM `defaultPromptNotes` rewrite; further dedupe
- Observation doc for PF-11 round 2 + EP footer restore

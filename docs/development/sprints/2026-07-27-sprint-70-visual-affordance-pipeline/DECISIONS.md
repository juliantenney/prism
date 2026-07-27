# Sprint 70 Decision Log

**Related:** [HANDOVER.md](HANDOVER.md) · [ARCHITECTURE.md](ARCHITECTURE.md)

## D70-01 Prism owns orchestration, not generation
Prism generates jobs, prompts, filenames, assembly, and export. External tools generate pixels only. No API integration in Sprint 70.

## D70-02 Filename convention (TBD — resolve Phase 2)
**Proposal:** `{sanitized-affordance-id}.png` e.g. `va-a2-mechanism-01.png`.  
**Alternative:** sequential `VO{n}-{slug}.png` matching VEU legacy.  
**Decision needed before UI implementation.**

## D70-03 Asset storage location (TBD — resolve Phase 1)
**Options:**
- workflow runstate blob (consistent with existing PRISM persistence)
- page-scoped directory under workflow artefacts path
**Decision needed before upload UI.**

## D70-04 Media folder name
**Proposal:** `media/` in export package (Sprint 70 convention).  
VEU v1.2.1 historically uses `images/` — export uses `media/`; document in manifest for consumers.

## D70-05 Linked images only
Export uses `<img src="media/...">`. No base64 embedding in Sprint 70. Self-contained HTML deferred.

## D70-06 Deterministic prompts
Prompt text composed from Sprint 38 generate fields in code — no LLM in job creation step. Matches VEU v1.2.1 field consumption semantics.

## D70-07 Job eligibility
Only `visual_decision: generate` rows with passing `activities_visual_review` gate become jobs. `defer` and `reject` appear in manifest ledgers only — no figures, no jobs.

## D70-08 Export completeness policy (TBD — resolve Phase 6)
**Proposal:** block export when any required job lacks uploaded asset unless author explicitly marks skipped.  
**Alternative:** allow partial export with `export_status: partial` in manifest.

## D70-09 VEU coexistence
VEU v1.2.1 bundle is not redesigned in Sprint 70. Prism pipeline is the in-app path; VEU remains reference/legacy for HTML-only workflows.

## D70-10 Renderer hook contract frozen
Sprint 70 does not change `.util-visual-affordance` slot enum, hook attributes, or renderer placement rules from Sprint 36/38.

Related:
- [Sprint 38 ARCHITECTURE.md](../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md)
- [utilities/visual-enhancement-utility/README.md](../../../../utilities/visual-enhancement-utility/README.md)

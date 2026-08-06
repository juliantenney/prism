# Sprint 74A — Final Report

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Opened:** 2026-08-06  
**Closed:** 2026-08-06  
**Status:** **COMPLETE / Closed**  
**Parent:** Sprint 74 programme wrapper (**OPEN**)  
**Decisions:** `S74A-D01` · **`S74A-D02`** · parent **`S74-D07`**

---

## Outcome

Sprint 74A established **vNext as Prism’s sole learner-page renderer**, removed the obsolete selectable Legacy learner-page path, preserved corrected activity/task interleaving (T-042), retained `slide_deck` structured HTML ownership, and verified the Authoring → Preview / HTML / ZIP / Open spine on the production browser path (T-050).

---

## What was delivered

| Task | Result |
| ---- | ------ |
| T-001…T-010 | Pack + export documentation audit |
| T-020 | Generated browser artefact freshness gate |
| T-030 | Production-browser baseline (§8 + §8a) |
| T-040 | Obsolete-renderer removal inventory |
| T-042 | Activity/task interleaving definitive-path repair |
| T-045 | Obsolete learner renderer removal (slices S1–S8) |
| T-050 | Sole-renderer verification, residue cleanup, closure |

---

## Architecture after 74A

```text
Authoring → Assemble / paste page JSON
  → Preview / HTML / ZIP / Open
  → runUtilityPageExportPipeline
  → runLearnerRendererVNextExport
  → window.PRISM_LEARNER_RENDERER_VNEXT (generated browser artefact)
```

Non-page `slide_deck` continues via `runUtilityRendererByPlan` → `buildUtilityStructuredHtml` (pages rejected).

---

## Evidence anchors

- [S74A-T-050-sole-renderer-final-verification.md](S74A-T-050-sole-renderer-final-verification.md)  
- [S74A-T-045-obsolete-learner-renderer-removal.md](S74A-T-045-obsolete-learner-renderer-removal.md)  
- [S74A-T-042-activity-task-interleaving-definitive-path-repair.md](S74A-T-042-activity-task-interleaving-definitive-path-repair.md)  
- [S74A-T-030-production-browser-baseline.md](S74A-T-030-production-browser-baseline.md)  

Pre-removal rollback: `065b3ac`.

---

## Known limitations retained

- Assemble-from-current-run live E2E when saved runs lack prompts  
- Sprint-70 E4 Node harness drift (not a production-path failure)  
- Open-in-New-Tab popup not automation-opened during T-050  

---

## Programme posture

Sprint 74A **closed**. Sprint 74 wrapper remains **OPEN**. **74B / 74C not opened.**

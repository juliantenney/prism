# Sprint 74A — Handover

**From:** Sprint 74A (**COMPLETE / Closed**)  
**To:** Parent Sprint 74 programme wrapper (**OPEN**)  
**Decisions:** [S74A-D01](decisions.md) · [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) · parent [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)

---

## Current state

- Sprint 74A **COMPLETE / Closed**  
- Sole learner-page renderer: **vNext**  
- Verification: [S74A-T-050-sole-renderer-final-verification.md](S74A-T-050-sole-renderer-final-verification.md)  
- Final report: [SPRINT-74A-FINAL-REPORT.md](SPRINT-74A-FINAL-REPORT.md)  
- Pre-removal rollback: `065b3ac`  
- 74B / 74C: **Not opened**

---

## Durable architecture

Authoring learner pages export unconditionally through `runLearnerRendererVNextExport` / `PRISM_LEARNER_RENDERER_VNEXT`.  
`slide_deck` remains on `runUtilityRendererByPlan` → `buildUtilityStructuredHtml`.  
Activity/task interleaving owned by vNext parse + compose (T-042).

---

## Do not

- Reopen obsolete learner-renderer selection  
- Open 74B/74C automatically  
- Treat Node suites as deployment proof  

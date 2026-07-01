# Sprint 56 — Initiation Pack

**Sprint:** 56 — Prompt Rationalisation & Contract Consolidation  
**Opened:** 2026-07-01  
**Predecessor:** [Sprint 55 Closure](../2026-06-29-sprint-55-educational-product-experience/SPRINT-55-CLOSURE-REPORT.md)

---

## Package contents

| # | Document | Section |
|---|----------|---------|
| — | [SPRINT-56-CHARTER.md](SPRINT-56-CHARTER.md) | §2 Charter |
| — | [SPRINT-56-EXECUTIVE-HANDOVER.md](SPRINT-56-EXECUTIVE-HANDOVER.md) | §8 Executive handover |
| — | [SPRINT-56-BASELINE-METRICS.md](SPRINT-56-BASELINE-METRICS.md) | §7 Baseline metrics |
| — | [SPRINT-56-DLA-RATIONALISATION-PROGRAMME.md](SPRINT-56-DLA-RATIONALISATION-PROGRAMME.md) | §4 DLA programme |
| — | [SPRINT-56-PROMPT-GOVERNANCE.md](SPRINT-56-PROMPT-GOVERNANCE.md) | §5 Governance |
| — | [SPRINT-56-BACKLOG.md](SPRINT-56-BACKLOG.md) | §6 Backlog |
| — | This document | §3 Priority areas |

**Sprint 55 evidence (inputs):**

- [SPRINT-55-DLA-EMITTED-PROMPT-AUDIT.md](../2026-06-29-sprint-55-educational-product-experience/SPRINT-55-DLA-EMITTED-PROMPT-AUDIT.md)
- [SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md](../2026-06-29-sprint-55-educational-product-experience/SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md)
- [SPRINT-55-GUIDED-LEARNING-QUALITY-AUDIT.md](../2026-06-29-sprint-55-educational-product-experience/SPRINT-55-GUIDED-LEARNING-QUALITY-AUDIT.md)

---

## §3 — Priority areas for rationalisation

Ranked by rationalisation priority. DLA findings inform early GAM and Design Page audits (similar `apply*ToDraft` layering suspected).

---

### P1 — DLA / Guided Learning

| Attribute | Assessment |
|-----------|------------|
| **Current risk level** | **Critical** — Copy-path output quality blocked; 50k emitted prompt |
| **Evidence of accretion** | +36,748 chars; 82% from one scaffolds function |
| **Estimated duplication risk** | **High** — ~19k chars redundant scaffold guidance |
| **Maintainability risk** | **Critical** — 5 overlapping SSOT candidates; 4 exemplar systems |
| **Recommendation** | Implement full rationalisation programme in Sprint 56 |
| **Suggested audit approach** | Char-delta instrumentation per `apply*ToDraft`; marker inventory; conflict regex |
| **Rationalisation opportunities** | Merge 5 layers → 1 SSOT; remove EQF/PEL pointers; thin OUTPUT CONTRACT; single exemplar set; unified PRE-EMIT |

**Traceability:** DLA-01 through DLA-09 in backlog.

---

### P2 — GAM (Generate Activity Materials)

| Attribute | Assessment |
|-----------|------------|
| **Current risk level** | **High** (unmeasured) — shares `applySelfDirectedLearnerPageStepScaffoldsToDraft` patterns, instructional-pattern block, materials-copy, table fidelity |
| **Evidence of accretion** | DLA sibling step uses parallel chain; `applyInstructionalPatternPromptBlockToDraft` GAM-only; rhetoric + PEL GAM riders exist |
| **Estimated duplication risk** | **High** — likely overlaps DLA preservation rules and SP-06 instructional pattern |
| **Maintainability risk** | **High** — multiple L4/L5 contracts |
| **Recommendation** | **Audit in Sprint 56 week 1** (GAM-01); plan only unless capacity |
| **Suggested audit approach** | Same RNA HCV workflow GAM step; measure augmentation; map to `instructional-pattern-prompt.js`, `ld-materials-copy.js`, `ld-table-fidelity.js` |
| **Rationalisation opportunities** | SSOT for material bodies vs cognition cues; dedupe DLA-upstream preservation vs generation rhetoric |

**Traceability:** GAM-01 through GAM-04.

---

### P3 — Design Page

| Attribute | Assessment |
|-----------|------------|
| **Current risk level** | **High** (unmeasured) — `applyLdDesignPageComposeContractToDraft` also applies guided scaffold + journey assimilation + authorial exposition |
| **Evidence of accretion** | Code path appends compose, journey, guided scaffold on Design Page |
| **Estimated duplication risk** | **High** — scaffold ranges may duplicate DLA SSOT on compose step |
| **Maintainability risk** | **High** — L4 preservation vs L5 rhetoric boundary |
| **Recommendation** | Audit Sprint 56 week 2 (DP-01); plan rationalisation for Sprint 57 |
| **Suggested audit approach** | Measure Design Page emitted prompt; separate preservation rules from generation duplicates |
| **Rationalisation opportunities** | Compose step references DLA SSOT by pointer only; no generation of scaffold ranges on compose |

**Traceability:** DP-01 through DP-03.

---

### P4 — Remaining prompt systems

| System | Risk | Audit approach |
|--------|------|----------------|
| Construct Learning Sequence | Medium | EQF manifestation; journey wrappers |
| Episode Plan | Low–Medium | Strict JSON block; population block ~789 chars |
| Learning Outcomes / KM | Low | Strict JSON where applicable |
| Assessment producers | Medium | EQF + item contracts |
| Pedagogic cognition packs | Medium (conditional) | “Short hints” when active — conflicts with scaffold |
| Educational Quality Framework | Medium | Cross-step duplication; DLA trim candidate |

**Recommendation:** Inventory in GOV-03; no implementation in Sprint 56 unless blocking.

---

## Traceability summary

```
Sprint 55 audits
  ├─→ Sprint 55 Closure Report (outcomes)
  ├─→ Sprint 56 Baseline Metrics (§7)
  ├─→ DLA Rationalisation Programme (§4)
  │     └─→ Backlog DLA-01 … DLA-09
  ├─→ Prompt Governance (§5)
  │     └─→ Backlog GOV-01 … GOV-03
  └─→ Priority areas P2/P3 (GAM-01, DP-01)
```

---

## Sprint 56 entry criteria (met)

- [x] Sprint 55 scaffold requirements codified  
- [x] Copy-path root cause identified  
- [x] Prompt size and duplication measured  
- [x] Conflict and gate inventories complete  
- [x] Rationalisation programme drafted  
- [x] Governance proposal drafted  
- [x] Backlog prioritised  
- [x] Baseline metrics recorded  

---

## Sprint 56 exit criteria

See [SPRINT-56-CHARTER.md](SPRINT-56-CHARTER.md) success criteria and [SPRINT-56-BACKLOG.md](SPRINT-56-BACKLOG.md) sequencing.

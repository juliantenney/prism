# Final Architecture Cleanup Pass

**Status:** Completed  
**Date:** 2026-07-01  
**Scope:** Close-out for F-01, F-03, F-04 from `CROSS-PROMPT-AUTHORITY-PLACEMENT-AUDIT.md`  
**Constraint:** Low-risk, behaviour-preserving, single-pass — no new contracts, governance layers, or rationalisation programme.

---

## Summary

Targeted hygiene pass after DLA (S56), GAM (S57), Design Page (S57), and cross-prompt placement audits. Three findings addressed; one intentionally left unchanged with documented rationale.

| Finding | Action | Result |
| ------- | ------ | ------ |
| **F-01** GAM depth co-teaching | SP-06 bridge word bands → GAM-PRES refs; PEL reasoning merged pattern/depth lines | **Done** |
| **F-02** Design Page wrapper overlap | No change | **Deferred** (see below) |
| **F-03** DLA pack note staleness | DLA pack `promptTemplate` + `defaultPromptNotes` synced to S56 runtime | **Done** |
| **F-04** GAM dual L4 call sites | Removed duplicate table/materials injection from self-directed sub-chain | **Done** |

---

## Changes made

### F-01 — GAM depth co-teaching (references over reteaching)

| File | Change |
| ---- | ------ |
| `lib/instructional-pattern-prompt.js` | SP-06: `(35–70 words)` and `under 25 words` stub rule replaced with `word band per GAM-PRES-08` / `below GAM-PRES-08 minima` references |
| `app.js` | `buildSelfDirectedGamPelReasoningMaterialPromptBlock`: merged separate SP cross-ref + depth lines into one line deferring shape to SP blocks and depth to GAM-PRES-08/09 |

**Ownership preserved:** Pack GAM-PRES-08/09 remains depth SSOT; SP owns pattern shape + FM codes; PEL owns cross-material reasoning behaviours only.

### F-03 — DLA pack documentation sync

| File | Change |
| ---- | ------ |
| `domains/learning-design/domain-learning-design-step-patterns.md` §5 | `promptTemplate`: `LD-SELF-DIRECTED-RHETORIC when self_directed` → `LD-GUIDED-LEARNING-SCAFFOLD SSOT + PRE-EMIT when self_directed learner-page` |
| Same §5 | `defaultPromptNotes`: rhetoric runtime mention → `LD-GUIDED-LEARNING-SCAFFOLD SSOT + PRE-EMIT at runtime (rhetoric: GAM/Design Page only)` |

Aligns pack documentation with runtime gate (`applyLearnerActionRhetoric && !isDla`) and Sprint 56 deprecation register. **No emit-path behaviour change.**

### F-04 — GAM dual L4 call-site hygiene

| File | Change |
| ---- | ------ |
| `app.js` | Removed `applyLdTableFidelityContractToDraft` / `applyLdMaterialsCopyContractToDraft` from GAM branch inside `applySelfDirectedLearnerPageStepScaffoldsToDraft` |
| `app.js` | Comment on shared augmentation chain documenting single L4 injection point after self-directed sub-chain |

**Before:** GAM path called L4 in sub-chain (~11097) then again in main chain (~11007) — second call no-oped via markers.  
**After:** Single injection in main chain only; same gates (`shouldApplySelfDirectedLearnerPageGamMaterialScaffold`) unchanged.

### Test updates (assertion sync only)

| File | Reason |
| ---- | ------ |
| `tests/workflow-self-directed-learner-page-formatting.test.js` | GAM L4 test uses full `applyWorkflowStepRuntimePromptAugmentations` (canonical path) |
| `tests/sprint-51-annotated-models-generation.test.js` | PEL block SP cross-ref wording |
| `tests/sprint-51-evaluative-coaching-generation.test.js` | Same |
| `tests/workflow-pel-reasoning.test.js` | Stale S56 assertions (`HOW TO THINK`, `do not repeat activity_preamble`) → current SSOT/PEL wording |

---

## Findings intentionally left untouched

### F-02 — Design Page wrapper overlap (journey + rhetoric + EQF)

**Decision:** No modification.

| Criterion | Assessment |
| --------- | ---------- |
| Clear low-risk simplification? | **No** — modules have distinct documented scopes (journey: wrapper arc; rhetoric: learner voice; EQF: quality dimensions) |
| Behavioural risk | **Medium** — deduplicating transition/closure guidance could weaken one contract without explicit precedence merge |
| Scope | Would require choosing an SSOT among three L5 modules — exceeds single-pass hygiene |
| Mitigation in place | Journey CORE defers to materials PREC-02; compose contract owns field/material preservation |

**Optional future tranche** (not part of this pass): journey ↔ rhetoric wrapper dedupe (~0.8–1.2k chars est.) per `DESIGN-PAGE-REMEDIATION-RESULTS.md`.

### Residual F-01 co-teaching (acceptable)

- Pack GAM-PRES template depth rules + runtime SP shape blocks — intentional pack/runtime split
- Self-study material voice block retains GAM-PRES-08 anti-redundancy carve-out — authoritative for voice/depth tension, not duplicate depth floors

---

## Before / after metrics

Probe: `node scripts/probe-gam-s57-audit-metrics.js` · RNA/HCV self-directed brief · full lib bootstrap

| Metric | Pre-cleanup (post-S57 GAM remediation) | Post-cleanup | Δ |
| ------ | -------------------------------------: | -----------: | --: |
| **GAM augmented total** | 41,558 | **41,538** | **−20 (−0.05%)** |
| Seeded (pack) | 15,145 | 15,145 | 0 |
| SP blocks (total) | 13,369 | **13,414** | +45* |
| PEL reasoning block | 1,501 | **1,436** | **−65** |
| `GAM-PRES-08` phrase count | 14 | **16** | +2 (more refs, less reteaching) |
| `80 words` phrase count | 5 | 5 | 0 |

\*SP total slightly higher in probe due to wording substitution length; net augmented prompt still decreased.

DLA / Design Page emit sizes unchanged (documentation-only and GAM-path changes).

### Tests executed

```bash
node scripts/probe-gam-s57-audit-metrics.js
node --test tests/workflow-self-directed-learner-page-formatting.test.js
node --test tests/workflow-instructional-pattern-prompt.test.js
node --test tests/workflow-pel-reasoning.test.js
node --test tests/sprint-51-annotated-models-generation.test.js
node --test tests/sprint-51-evaluative-coaching-generation.test.js
```

**52/52** focused tests passed.

---

## Final assessment — architecture health

### Programme status: **CLOSED**

| Layer | Health | Notes |
| ----- | ------ | ----- |
| **Orchestration boundaries** | **GREEN** | DLA specifies → GAM realises → Design Page assembles; no cross-stage authority leaks |
| **Authority placement** | **GREEN** | All High-severity misplacements remediated (S56/S57 + this pass) |
| **Prompt estate maintainability** | **AMBER (stable)** | Residual wrapper overlap (F-02) and pack density remain; optional size tranches only |
| **Learner-facing behaviour** | **Unchanged** | No schema, capture, repair, or governance gate changes |

### Classification evolution

| Audit | Classification |
| ----- | -------------- |
| Cross-prompt placement (pre-cleanup) | AMBER — minor drift, clean boundaries |
| **Post final cleanup** | **GREEN (orchestration)** / **AMBER (optional size)** |

### What was *not* done (by design)

- No new contracts or PRE-EMIT gates
- No Design Page journey/rhetoric/EQF merge
- No GAM pack rationalisation
- No DLA emit-path changes beyond documentation

The prompt estate is in a **stable, maintainable state** suitable for product work. Further changes should be demand-driven (charter targets, observed learner defects), not architecture-programme continuation.

---

## Traceability

| Artefact | Path |
| -------- | ---- |
| Cross-prompt audit | `CROSS-PROMPT-AUTHORITY-PLACEMENT-AUDIT.md` |
| GAM remediation | `GAM-REMEDIATION-RESULTS.md` |
| Design Page remediation | `DESIGN-PAGE-REMEDIATION-RESULTS.md` |
| DLA SSOT / deprecation | `DEPRECATION-REGISTER.md` |
| Augmentation chain | `app.js` ~10993–11016 |
| GAM probe | `scripts/probe-gam-s57-audit-metrics.js` |

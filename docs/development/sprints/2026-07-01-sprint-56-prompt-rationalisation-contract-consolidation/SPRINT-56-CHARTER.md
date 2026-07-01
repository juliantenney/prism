# Sprint 56 — Charter

**Sprint:** 56 — Prompt Rationalisation & Contract Consolidation  
**Opened:** 2026-07-01  
**Predecessor:** Sprint 55 (closed)  
**Baseline:** [SPRINT-56-BASELINE-METRICS.md](SPRINT-56-BASELINE-METRICS.md)  
**Evidence:** [SPRINT-55-CLOSURE-REPORT.md](../2026-06-29-sprint-55-educational-product-experience/SPRINT-55-CLOSURE-REPORT.md)

---

## Primary Goal

Reduce prompt accretion, remove superseded guidance, establish **authoritative prompt contracts (SSOT)**, and improve instruction clarity through **simplification rather than addition**.

---

## Guiding Principle

> **No new prompt layer may be introduced unless superseded guidance is removed, consolidated, or formally deprecated.**

---

## Mission Statement

Sprint 56 converts Sprint 55’s discovery — that emitted DLA prompts already contain scaffold requirements yet fail in practice due to duplication, conflict, and dilution — into a **maintainable prompt architecture**. The sprint prioritises **investigation-first rationalisation** of DLA, then GAM and Design Page, under lightweight governance so prompt size, rule duplication, and contract conflict are measured and blocked going forward.

Success is measured by **smaller, clearer, single-authority prompts** that preserve Sprint 55 scaffold semantics, not by adding further augmentation blocks.

---

## Success Criteria

| # | Criterion | Measure |
|---|-----------|---------|
| 1 | DLA emitted prompt size reduced | ≥35% reduction vs 49,949 char baseline (target ≤32k core) |
| 2 | Single DLA scaffold SSOT | One consolidated contract block; ≤1 exemplar set |
| 3 | Word-count rules aligned | Zero conflicting numeric ranges for Sprint 55 fields |
| 4 | Gate unification | One pre-emit gate combining presence **and** word minimums |
| 5 | Superseded layers removed or deprecated | Documented deprecation log; no orphan duplicate blocks |
| 6 | GAM prompt audit complete | Accretion inventory + rationalisation plan |
| 7 | Design Page prompt audit complete | Accretion inventory + rationalisation plan |
| 8 | Governance framework adopted | SSOT, lifecycle, monitoring checklist in repo |
| 9 | Regression safety | Existing sprint-55 tests updated to assert SSOT markers, not duplicate markers |
| 10 | External generation spot-check | At least one Copy → external model run shows improved scaffold word counts (manual QA) |

---

## Non-Goals

- New learner-facing fields or schema changes
- New product features or export UI work
- Workflow redesign or episode-plan architecture changes
- Copilot auto-repair or paste-back capture workflows
- Adding prompt layers without supersession
- Re-opening Sprint 55 product-layer scope unless regression-blocking

---

## Expected Deliverables

1. DLA rationalisation programme (phased, implemented)  
2. GAM prompt accretion audit + rationalisation plan  
3. Design Page prompt accretion audit + rationalisation plan  
4. Prompt governance proposal (approved)  
5. Consolidated `LD-GUIDED-LEARNING-SCAFFOLD` (or successor) as DLA SSOT  
6. Deprecation register for removed/superseded prompt blocks  
7. Updated baseline metrics post-rationalisation  
8. Sprint 56 closure report with before/after char counts  

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Removing block breaks obscure workflow brief | Medium | High | Investigation-first; brief-matrix testing |
| Over-consolidation loses IFP/DLA-WB obligations | Medium | High | Keep base domain-pack; consolidate scaffold only |
| GAM/Page audits expand scope | High | Medium | Time-box audits; plan-only for non-DLA in Sprint 56 |
| Team re-adds layers under pressure | Medium | High | Governance DoD + size budget |
| External model still terse after rationalisation | Medium | Medium | Spot-check QA; iterate exemplars only within SSOT |
| Test coupling to duplicate markers | Low | Medium | Update tests to SSOT markers in Phase 4 |

---

## Success Metrics

| Metric | Sprint 55 baseline | Sprint 56 target |
|--------|-------------------|------------------|
| DLA emitted core prompt chars | 49,949 | ≤32,000 |
| DLA augmentation chars | 36,748 | ≤18,000 |
| Overlapping scaffold contract layers | 5 | 1 |
| Conflicting word-count rule classes | 7 | 0 |
| Presence-only pre-emit gates (scaffold) | 7 | 0 (merged into unified gate) |
| Exemplar systems (scaffold) | 4 | 1 |
| Duplicate scaffold guidance chars | ~19,000 | ≤2,000 |

---

## Exit

Sprint 56 exits when DLA rationalisation is implemented and validated against metrics, GAM and Design Page audits are complete with approved plans, governance is documented, and closure report records before/after measurements.

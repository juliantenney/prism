# Sprint 25 Slice 25-2 — Design Page composition contract

**Date:** 2026-05-19  
**Status:** **Closed (documentation)**  
**Sprint:** 25 — Design Page composition and renderer consolidation  
**Slice:** 25-2

**Baseline:** [Slice 25-1 investigation](design-page-composition-pipeline-investigation.md)

---

## Objective

Define an explicit, testable **Design Page composition contract** covering activity membership authority, preservation semantics, omission traceability, canonical `sections[]` authority, and export alignment principles.

**No pack, runtime, renderer, or test implementation in this slice.**

---

## Deliverable

| Artefact | Path |
|----------|------|
| **Composition contract (normative draft)** | [`design-page-composition-contract.md`](design-page-composition-contract.md) |

---

## Scope delivered

| Task | Section in contract |
|------|---------------------|
| Authority ownership rules | §2–§3 |
| Preservation + omission semantics | §4–§5 |
| Prompt wording audit + proposals | §7 |
| Closure validation model (doc only) | §8 |
| Canonical page / export authority | §6, §10 |
| 25-3 recommendation | §10 |

---

## Constraints (honoured)

| Constraint | Status |
|------------|--------|
| Documentation only | ✓ |
| No renderer changes | ✓ |
| No runtime validators | ✓ |
| No export logic changes | ✓ |
| No fixture/test changes | ✓ |

---

## Follow-on

| Slice | Action |
|-------|--------|
| **25-3** | Charter export contract (`sections[]` authority, `pageSections`, catalog parity) |
| **25-5** | Apply pack prompt changes; implement §8 validator (if approved) |
| **25-1 evidence** | Live workshop JSON capture still recommended before remediation |

---

## Verification

No code changes. Test floor unchanged.

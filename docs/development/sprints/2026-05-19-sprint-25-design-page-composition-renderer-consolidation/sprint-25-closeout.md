# Sprint 25 closeout — Design Page composition and renderer consolidation

**Date:** 2026-05-19  
**Status:** **CLOSED** (live A1–A5 preservation validated). Successor: [Sprint 26 — renderer presentation](../2026-05-20-sprint-26-renderer-presentation-consolidation/sprint-26-index.md).

---

## Summary

Sprint 25 moved from ad hoc renderer fixes to **governed composition and export contracts**, then delivered **Slice 25-5 remediation** for activity preservation and omission traceability.

**Root cause (confirmed):** Activity **A2** was absent from live `page.sections[]` **before** Utilities export. Export/renderer paths render all five activities when `sections[]` is complete (fixture-backed).

---

## Slices delivered

| Slice | Deliverable | Status |
|-------|-------------|--------|
| **25-1** | Pipeline investigation | Closed |
| **25-2** | Composition contract | Closed → implemented in 25-5 (pack) |
| **25-3** | Export contract | Closed → implemented in 25-5 (strict mode) |
| **25-5** | Prompt + validation + tests | **Closed** |
| **25-4** | Renderer governance charter | Not started (optional) |

---

## 25-5 implementation (what shipped)

1. **Design Page pack prompt** — full upstream activity membership; `learning_sequence` order/timing only; `activity_materials` enrich only; `generation_notes.activities_omitted[]` for intentional drops.
2. **Runtime closure validation** — `(U \ X) ⊆ C` check on workflow page capture and Utilities generate; appends `generation_notes` warnings; **no auto-repair**.
3. **Strict export** — `strictCompositionClosure` when `sections[]` is authoritative; renderer does not invent activities from sequence/materials probes.
4. **Regression tests** — `tests/utility-page-composition-closure.test.js` + updated inflation render tests.

---

## Verification

```bash
node --test tests/*.test.js
```

| Milestone | Result |
|-----------|--------|
| Sprint entry | 220 passed |
| After 25-5 | **229 passed**, 0 failed |

---

## Closeout recommendation

| Action | Owner | Notes |
|--------|-------|-------|
| **Accept sprint closure** | Product / dev | Bounded scope met; contracts + remediation delivered |
| **Re-run inflation workshop Design Page** | User / QA | Confirm live `page.sections[].learning_activities.content` includes **A2** after pack reload |
| **Inspect `generation_notes`** on any shortened page | QA | Silent omissions should now surface as limitations + `activities_omitted[]` |
| **Defer 25-4** unless visual governance is priority | Planning | No blocker for composition closure |

---

## Residual risks

- **LLM non-determinism:** Prompt changes reduce omission risk but do not guarantee live runs; validation warns only.
- **Legacy pages without `sections[]`:** Fallback export paths may still use top-level keys; migrate to array `sections[]` for authoritative body.
- **Probe recovery:** Still available when `strictCompositionClosure` is false (isolated section render without full page context).

---

## References

- [`design-page-composition-contract.md`](design-page-composition-contract.md)
- [`design-page-export-contract.md`](design-page-export-contract.md)
- [`design-page-composition-pipeline-investigation.md`](design-page-composition-pipeline-investigation.md) §13
- [`review-log.md`](review-log.md) R25-031–R25-035

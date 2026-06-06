# 38M-4 — A3 Analyse sequencing fidelity

**Date:** 2026-06-05  
**Sprint:** 38-M Page Composition Fidelity  
**Phase:** 38M-4  
**Depends on:** [38M-2](38M-2-page-composition-preservation-model.md) · [38M-3](38M-3-a4-evaluate-fidelity-implementation.md)  
**Baseline:** [38M-1](38M-1-baseline-page-fidelity-analysis.md)

---

## §1 Executive summary

**Problem:** A3 Analyse materials survived L4 compose at **100% GAM→Page body fidelity** (38M-1), but learner-facing render order was instructionally inverted: checklist and worksheet appeared before worked analytic pass and scenario.

**Solution:** Introduced compose-layer `materials_order` for A3 Analyse activities and renderer support that renders declared-order material blocks before legacy early-path handlers (checklist-first, worksheet resolution).

**Result:** On `EV-38L-AFTER` replay, A3 h4 material headings now appear in charter order:

```text
Worked analytic pass → Worksheet (analysis table) → Scenario Maya households → Checklist
```

**Regression:** All 38M-3 A4 preservation tests and 38L preservation tests pass (17/17). `validate38MPageFidelity` unchanged for A4.

---

## §2 Root cause analysis

### What was not broken

| Layer | A3 status (38M-1) |
|-------|-------------------|
| GAM generation | Full bodies |
| L4 page compose | 100% char parity — exact GAM copy |
| Material keys | All four present |

### What was broken

| Layer | Symptom | Mechanism |
|-------|---------|-----------|
| **Renderer ordering** | Checklist rendered **first**; worksheet before worked pass | `renderMaterialsForActivity` in `app.js` uses hardcoded early paths: checklist block (~L30099) and `resolveWorksheetTableSource` (~L30044) run **before** the `Object.keys` fallback that renders `worked_analytic_pass` and `scenario_maya_households` |
| **Page JSON key order** | Insufficient alone | Renderer ignores object key insertion order; uses type-based priority paths |
| **Cognition scaffold** | Correct intent documented | `scaffold_hint_sequence`: `Study worked analytic pass → Examine scenarios → Complete analysis table → Verify with checklist` — not enforced at render |

### Authoritative sequence (38M-4)

Aligned to IMPLEMENTATION-CHARTER 38M-4 and task spec:

| Step | Page key | Learner function |
|------|----------|------------------|
| 1 | `worked_analytic_pass` | Worked analytic pass |
| 2 | `analysis_table` | Analysis table (Worksheet) |
| 3 | `scenario_maya_households` | Scenario context |
| 4 | `checklist` | Verification |

*Note:* DLA `scaffold_hint_sequence` places scenario before table; charter/task order places table before scenario. 38M-4 implements **charter order** (worked → table → scenario → checklist).

### Secondary issue found during implementation

`applyRendererCanonicalAliases` sets `materials.scenarios = [scenario_maya_households]` after GAM merge. Without marking `scenarios` consumed after ordered scenario render, a duplicate **Scenarios** block could appear in the fallback loop. Fixed by marking alias keys rendered when `scenario_maya_households` is rendered in declared order.

---

## §3 Implementation summary

### New module: `lib/page-a3-materials-sequencing.js`

| Export | Role |
|--------|------|
| `A3_ANALYSE_MATERIALS_ORDER` | Canonical four-key sequence |
| `isA3AnalyseActivityRow` | Detect A3 by `activity_id`, title, or material signature |
| `applyA3MaterialsSequencingToComposedPage` | Set `materials_order`, reorder `materials` keys, metadata |
| `validateA3MaterialsSequencing` | Page JSON sequencing gates G15–G16 |
| `validateA3RenderMaterialOrder` | h4 heading position gates for render proof |

### Compose hook (`app.js`)

Chained after GAM preserve in `applyComposedPageGamMaterialsPreserve`:

```text
applyGamMaterialsToComposedPage → applyA3MaterialsSequencingToComposedPage
```

Metadata: `a3_materials_sequencing_applied: true`, `a3_materials_sequencing_rows: 1`

### Renderer (`app.js` — sequencing logic, not CSS)

When `activityRow.materials_order` is present:

1. Iterate `materials_order` and render each key via `renderOrderedMaterialKeyBlock`
2. Skip legacy early checklist path if checklist already rendered
3. Skip `resolveWorksheetTableSource` if table already rendered from order
4. Skip fallback `Object.keys` entries already rendered (including `scenarios` alias)

**No stylesheet changes.** No workflow or schema changes.

### Files changed

| File | Change |
|------|--------|
| `lib/page-a3-materials-sequencing.js` | **New** — compose + validation |
| `app.js` | Compose hook; declared-order render path; test API exports |
| `index.html` | Script tag for sequencing lib |
| `tests/page-38m-a3-sequencing.test.js` | **New** — 6 tests |

**Unchanged:** `lib/page-gam-materials-preserve.js` A4 logic, DLA/GAM packs, schema, ACM, renderer CSS.

---

## §4 Validation results

### Test command

```bash
node --test tests/page-38m-a3-sequencing.test.js tests/page-38m-gam-preservation.test.js tests/page-38l-gam-preservation.test.js
```

**Result:** **17/17 pass**

### A3 sequencing tests (new)

| Test | Result |
|------|--------|
| `materials_order` + key reorder on composed page | PASS |
| 100% A3 body fidelity preserved | PASS |
| h4 render order: worked → worksheet → scenario → checklist | PASS |
| Full compose path applies sequencing after GAM preserve | PASS |
| No A4 regression (`validate38MPageFidelity`) | PASS |
| A4 row does not receive `materials_order` | PASS |

### Render order evidence (`EV-38L-AFTER` replay)

h4 `util-material-heading` positions within A3 activity block:

| Position | Heading |
|----------|---------|
| 1 | Worked analytic pass |
| 2 | Worksheet |
| 3 | Scenario Maya households |
| 4 | Checklist |

Pre-38M-4 order (38M-1): Checklist → Worksheet → Worked analytic pass → Scenario.

### Page JSON validation

`validateA3MaterialsSequencing(composedPage)` checks:

- `materials_order` array matches canonical order
- `Object.keys(materials)` leading keys match order
- `metadata.a3_materials_sequencing_applied === true`

### A3 body fidelity (G7 regression)

| Material | Pre/post merge chars | Ratio |
|----------|---------------------|-------|
| M8 worked_analytic_pass | 1,616 | 100% |
| M9 scenario_maya_households | 733 | 100% |
| M10 analysis_table | 1,901 | 100% |
| M11 checklist | 604 | 100% |

---

## §5 Regression results

| Suite | Tests | Status |
|-------|-------|--------|
| `page-38m-a3-sequencing.test.js` | 6 | **PASS** |
| `page-38m-gam-preservation.test.js` | 7 | **PASS** |
| `page-38l-gam-preservation.test.js` | 4 | **PASS** |

**A4 spot checks after full compose:**

- M12 scenario contains `Strategy A: Budget Tightening`
- M15 guided table has no `Partial example` shell
- `validate38MPageFidelity` hard gates G1–G10 pass
- A4 activity row has **no** `materials_order` (sequencing A3-only)

---

## §6 Remaining risks for 38M-5 proof run

| Risk | Severity | Notes |
|------|----------|-------|
| Live LLM compose without GAM preserve hook | Medium | 38M-5 harness must chain preserve + A3 sequencing (same as UI path) |
| `materials_order` absent on non-inflation workbooks | Low | Sequencing applies only when `isA3AnalyseActivityRow` matches |
| DLA vs charter scenario/table order mismatch | Low | Documented; charter order implemented. DLA cognition string still says scenario before table |
| Duplicate scenario from `scenarios` alias | **Mitigated** | Alias keys marked rendered in ordered path |
| M16 independent template depth | Low | Unchanged from 38M-3; G13 soft warning |
| Render G14 spot-check in harness | Medium | 38M-5 should call `validateA3RenderMaterialOrder` on HTML capture |
| Episode framing (38I-style Step headings) | Out of scope | Sequencing fix only; no step choreography added |

### Recommended 38M-5 harness gates

| Gate | Check |
|------|-------|
| G15 | `validateA3MaterialsSequencing` pass on post-compose page |
| G16 | `validateA3RenderMaterialOrder` pass on rendered A3 block |
| G7 | A3 body ratio ≥ 99% (existing 38M validator) |
| G1–G10 | A4 preservation (existing 38M validator) |

---

## §7 Success condition check (38M-4)

| Criterion | Status |
|-----------|--------|
| A3 materials in pedagogically correct order | ✓ |
| No A3 content loss | ✓ |
| No A4 regression | ✓ |
| 38M/L preservation tests pass | ✓ (17/17) |
| Sequencing validation added | ✓ |
| No renderer CSS redesign | ✓ |
| No schema/ACM/workflow changes | ✓ |

**38M-4 complete.** Next: **38M-5** inflation proof run (`EV-38M-AFTER`).

---

## References

- [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)
- [38M-1 baseline analysis](38M-1-baseline-page-fidelity-analysis.md)
- [38M-3 A4 implementation](38M-3-a4-evaluate-fidelity-implementation.md)
- `lib/page-a3-materials-sequencing.js` · `tests/page-38m-a3-sequencing.test.js`

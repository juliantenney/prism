# PR-W2b-2 — Wire `LD-TABLE-FIDELITY` spec role into DLA

**Date:** 2026-06-04  
**Change class:** CC-MODULE ref (runtime wiring only)  
**Charter:** [38B-W2B](38B-W2B-DLA-authority-review.md) §9 PR-W2b-2  
**Depends on:** [38B-W2B-1](38B-W2B-1-DLA-pack-authority-trim.md) (pack refs)

---

## 1. Summary

`applyLdTableFidelityContractToDraft` now appends **`LD-TABLE-FIDELITY` with `{ role: "dla" }`** on the self-directed Design Learning Activities path, gated by `shouldApplySelfDirectedLearnerPageMaterialShapeScaffold` (same gate as DLA material-shape scaffolds).

**Authority chain (active):**

```text
DLA spec (LD-TABLE-FIDELITY core + spec role)
  ↓
GAM author (LD-TABLE-FIDELITY author role)
  ↓
Design Page preserve (embedded in materials fidelity block — unchanged)
```

**No changes** to `lib/ld-table-fidelity.js`, pack, Design Page preserve path, GAM author path, Sprint 38, renderer, or VEU.

---

## 2. Runtime audit (pre-change)

| Step | `applyLdTableFidelityContractToDraft` behaviour |
|------|-----------------------------------------------|
| GAM | Self-directed → `{ role: "author" }` |
| DLA | **No append** (fell through) — one-line ref in material-shape block only |
| Design Page | **No append** here — preserve via `buildDesignPageActivityMaterialsFidelityPromptBlock` (embedded, no marker) |

Augmentation order (unchanged):

```text
applyPedagogicCognitionContractScaffoldToDraft
  → applySelfDirectedLearnerPageStepScaffoldsToDraft (DLA shape / framing / OUTPUT CONTRACT / timeline)
  → applyLdTableFidelityContractToDraft  ← DLA spec wired here
  → applyLdMaterialsCopyContractToDraft (GAM only)
  → applyPedagogicEnrichmentContractScaffoldToDraft
  → … Design Page / math
```

---

## 3. Implementation

### 3.1 `app.js` — `applyLdTableFidelityContractToDraft`

After the GAM `author` branch, when `isDla`:

1. Require `shouldApplySelfDirectedLearnerPageMaterialShapeScaffold(context, resolved, base)`.
2. Skip if `LD-TABLE-FIDELITY (auto-applied)` or legacy GAM row-adequacy marker already present (idempotent).
3. Append `buildLdTableFidelityPromptBlock({ role: "dla" })` — lib alias for `role: "spec"` (CORE + SPEC_LINES only; no author or preserve lines).

### 3.2 Duplication controls

| Risk | Mitigation |
|------|------------|
| Double append on same draft | Marker regex guard |
| GAM author lines on DLA | `role: "dla"` excludes AUTHOR_LINES |
| Design Page preserve on DLA | `isDla` branch returns before fall-through; Design Page still uses embedded preserve only |
| Pack + runtime duplicate | Pack one-liner + module marker — acceptable until optional PR-W2b-3 scaffold merge |

---

## 4. Probe impact (self-directed)

Command: `node scripts/probe-38b1-ld-workflow-prompt-audit.js`

| Metric | Post W2b-1 | Post W2b-2 | Δ |
|--------|------------|------------|--:|
| DLA `augmentedChars` | **18,307** | **20,274** | **+1,967** |
| DLA `blockCount` | 5 | **6** | **+1** |
| DLA markers | 5 (no table module) | **+ `LD-TABLE-FIDELITY (auto-applied)`** | +1 |
| GAM `augmentedChars` | 15,806 | 15,806 | 0 |
| Design Page `augmentedChars` | 27,345 | 27,345 | 0 |
| Assessment `augmentedChars` | 11,109 | 11,109 | 0 |

**Module block size:** `buildLdTableFidelityPromptBlock({ role: "dla" })` ≈ **1,967** chars (CORE + spec line).

**Four-step sum:** **72,567** → **74,534** (**+1,967**; DLA-only delta).

**Facilitated DLA:** unchanged (**4,943** augmented; no table marker).

---

## 5. Validation

| Check | Result |
|-------|--------|
| `node --test tests/*.test.js` | **724/724** pass (+2 tests) |
| `tests/workflow-self-directed-learner-page-formatting.test.js` | DLA spec role present; facilitated omits marker |
| `tests/ld-table-fidelity.test.js` | Unchanged (lib contract) |
| GAM author / DP preserve tests | Unchanged |

---

## 6. Authority boundaries (post-wire)

| Step | `LD-TABLE-FIDELITY` role | Marker on prompt |
|------|--------------------------|------------------|
| **DLA** (self-directed) | **spec / dla** | **Yes** |
| **GAM** (self-directed) | **author** | **Yes** |
| **Design Page** | **preserve** (embedded) | No (materials fidelity block) |
| DLA facilitated | — | No |

---

## 7. Next steps

| Item | Scope |
|------|--------|
| **PR-W2b-3** (optional) | Merge OUTPUT CONTRACT + material-shape one-liner dedupe |
| **Wave 3** | Design Page compose contract + PREC live gate |
| **EV-38B4** | Factory rerun with full stack |

---

## 8. Governance

[38B-7](38B-7-governance-and-maintenance.md) MR-10 — table fidelity on L4 DLA change: spec role wired; materials fidelity owner sign-off on prompt delta (+1,967 DLA augmented).

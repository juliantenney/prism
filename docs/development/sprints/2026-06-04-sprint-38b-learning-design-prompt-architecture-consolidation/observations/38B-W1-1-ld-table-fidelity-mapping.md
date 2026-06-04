# PR-W1-1 — LD-TABLE-FIDELITY mapping and impact

**Date:** 2026-06-04  
**Change class:** CC-MODULE  
**Module lifecycle:** experimental  
**Canonical source:** `lib/ld-table-fidelity.js`

---

## 1. Inventory (pre-change)

| Source | Location | Taxonomy / layer | Steps |
|--------|----------|------------------|-------|
| GAM pack pipe-table rule | `domain-learning-design-step-patterns.md` §6 `promptTemplate` | table fidelity / L4 | GAM (pack seed) |
| GAM pack markdown subset | §6 `defaultPromptNotes` | rendering / L7 | GAM |
| DLA pack pipe tables in learner_task | §5 `promptTemplate` | table fidelity / L4 | DLA (pack seed) |
| DLA material shape multiline tables | `buildSelfDirectedLearnerPageMaterialShapePromptBlock` | table fidelity / L4 | DLA |
| DLA integrated template/analysis_table | same block | composition / L4 | DLA |
| GAM table row adequacy | `buildSelfDirectedGamTableRowAdequacyPromptBlock` | table fidelity / L4 | GAM |
| Design Page materials “actual tables” | `buildDesignPageActivityMaterialsFidelityPromptBlock` | materials / L4 | Design Page |
| Design Page pack table placement | §13 `promptTemplate` / `what_to_check` | table fidelity / L4 | Design Page (pack) |
| Math coexistence with tables | `buildMathSafeOutputContractPromptBlock` | L7 | DLA, GAM, Assessment, Design Page |
| Sprint 38 duplicate table (figures) | `buildSprint38PedagogicalAddedValuePromptLines` | L6 | Design Page only |

---

## 2. Mapping into `LD-TABLE-FIDELITY`

| Former instruction | Module section | Role |
|--------------------|----------------|------|
| Row adequacy bullets (5) | Author rider | `author` / GAM append |
| Pack “complete pipe table…” | Core `If a table is needed…` | all consumers (pack unchanged Wave 1) |
| 38B-4 forbidden comma-row / Headers+Rows | Core FORBIDDEN | all |
| 38B-4 GOOD pipe example | Core GOOD example | all |
| Precedence ladder + PREC-01 | Core | all |
| Figure duplicate scope | Core | all |
| Design Page preserve upstream pipes | Preserve rider | embedded in materials fidelity (`includeMarker: false`) |
| DLA spec vocabulary | Spec line in material shape + spec role available | `spec` / DLA |
| Materials “actual tables” bullet | Replaced by preserve rider + pointer | Design Page |

---

## 3. Duplicates / conflicts / gaps

| Finding | Resolution (PR-W1-1) |
|---------|----------------------|
| **Duplicate:** row adequacy vs pack pipe rule | Single `author` append via `LD-TABLE-FIDELITY` |
| **Duplicate:** Design Page “actual tables” vs preserve | Merged into materials fidelity body from module |
| **Conflict:** Sprint 38 “duplicate table” vs page tables | Core: figures only |
| **Conflict:** summarisation vs tables | Core precedence + PREC-01 |
| **Gap (38B-4):** no comma-row ban on Design Page | Core FORBIDDEN + preserve rider (stricter clarifier) |
| **Gap:** no canonical pipe example on Design Page | Core GOOD example embedded in materials fidelity |

---

## 4. Runtime wiring (post-change)

| Step | Mechanism | Marker count delta |
|------|-----------|-------------------|
| **GAM** | `applyLdTableFidelityContractToDraft` → `LD-TABLE-FIDELITY (auto-applied)` | 0 (replaces “table row adequacy” title) |
| **Design Page** | `buildDesignPageActivityMaterialsFidelityPromptBlock` embeds module body | 0 (same materials fidelity marker) |
| **DLA** | One line in material shape block | 0 |
| **Workflow order** | `applyLdTableFidelityContractToDraft` after scaffolds, before PEL/Sprint 38 | GAP-04 |

---

## 5. Prompt-size impact (probe)

Record after merge:

```bash
node scripts/probe-38b1-ld-workflow-prompt-audit.js
node scripts/probe-38b1-design-page-prompt-size.js
```

| Step | Baseline aug | Post PR-W1-1 | Δ | Markers before → after |
|------|-------------:|-------------:|---:|------------------------|
| GAM | 34,482 | 36,356 | +1,874 | 15 → 15 (`LD-TABLE-FIDELITY` replaces table row adequacy title) |
| Design Page | 45,791 | 47,944 | +2,153 | 15 → 15 (module embedded in materials fidelity) |
| DLA | 39,201 | 39,380 | +179 | 14 → 14 (spec cross-ref line) |
| Assessment | 32,308 | 32,308 | 0 | 11 → 11 |
| **Four-step sum** | **152,782** | **155,988** | **+3,206 (+2.1%)** | — |

**Deferral note (MR-12 / Wave 1 exit):** PR-W1-1 adds 38B-4 L4 clarifiers (forbidden comma-row, GOOD pipe example, precedence). Combined −15% is **not** expected until PR-W1-4 rhetoric merge; record at Wave 1 exit.

---

## 6. Validation (38B-6 / charter)

| Check | Status |
|-------|--------|
| L8-01 full suite | **PASS** — 710/710 (`2026-06-04`) |
| L4-01–L4-03 materials fidelity | `tests/design-page-materials-fidelity.test.js` |
| L5-04 LD-TABLE-FIDELITY in augmented prompt | PROBE / GAM + Design Page materials block |
| Single authority (MR-04) | `lib/ld-table-fidelity.js` |
| MR-10 GAM + Design Page | preserve + author roles |
| Net markers (GAP-02) | GAM: rename only; Design Page: 0 delta |

---

## 7. Deferred (not PR-W1-1)

- Pack §6/§13 table prose trim (Wave 2a/3)
- `LD-MATERIALS-COPY` split (PR-W1-2)
- B4-01/B4-02 closure / live Inflation rerun
- AUTO* L4-04–L4-06 detectors

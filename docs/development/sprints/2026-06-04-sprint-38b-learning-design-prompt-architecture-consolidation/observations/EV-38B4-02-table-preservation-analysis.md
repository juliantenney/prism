# EV-38B4-02 — Table preservation analysis (GAM → Design Page)

**Date:** 2026-06-04  
**Same-run artefacts:** [EV-38B4-01](EV-38B4-01-design-page-evidence.md) · [EV-38B4-03](EV-38B4-03-inflation-gam-evidence.md)  
**Contract:** `LD-TABLE-FIDELITY` author (GAM) + preserve (Design Page) · [38B-6](38B-6-regression-validation-plan.md) L4-05, L4-07, PREC-01

---

## 1. Purpose

Determine **where** table fidelity is lost (if anywhere) across:

```text
DLA (specs) → GAM (author) → Design Page (compose/preserve) → renderer (downstream, read-only)
```

This analysis uses the **2026-06-04 same-run** pipeline capture ([fixtures/ev-38b4-01-02-pipeline-analysis.json](../fixtures/ev-38b4-01-02-pipeline-analysis.json)).

---

## 2. Stage-by-stage fidelity

| Stage | Role | Table authority | This run |
|-------|------|-----------------|----------|
| DLA | Spec `required_materials` types | Vocabulary only | Emitted `classification_table`, `comparison_table`, `analysis_table`, `impact_table` on A1–A5 |
| GAM | **Author** | `LD-TABLE-FIDELITY` (intended; see prompt caveat) | **8** pipe table blocks in GAM text (incl. duplicate sets on A5) |
| Design Page | **Preserve / merge** | `LD-TABLE-FIDELITY` preserve + materials fidelity | **8/8** table fields in page JSON are pipes |
| Renderer | Display | Frozen | Excerpt: **no** `<table>` in first 8k — shape mismatch on `heading` vs `section_id` |

---

## 3. Degradation taxonomy (this run)

| Degradation mode | Definition | Observed? |
|------------------|------------|-----------|
| **D1 Author compression** | GAM emits comma-rows / Headers+Rows | **No** |
| **D2 Preserve failure** | DP replaces pipes with CSV/prose | **No** |
| **D3 Merge omission** | `materials` empty while tables elsewhere | **No** — tables in `materials.*` |
| **D4 Section orphaning** | Tables only in `activity_materials` section, not on activity row | **No** — no separate section; embedded merge |
| **D5 Partial field** | Scenario OK, table bad | **No** |
| **D6 Renderer flattening** | JSON good, HTML bad | **Inconclusive** (non-canonical page sections) |

---

## 4. GAM → Design Page diff (per activity)

### 4.1 A1–A4 (primary table activities)

| Check | GAM | Design Page |
|-------|-----|-------------|
| Field naming | `Material: M* (classification_table)` etc. | `materials.classification_table` (normalised key) |
| Syntax | Markdown pipe | Markdown pipe **preserved** |
| Row content | Model-filled example rows | **Same rows** carried into page JSON |
| Forbidden B4 shapes | Absent | Absent |

**Verdict:** **No transformation degradation** between GAM output and Design Page `materials` for A1–A4.

### 4.2 A5 (synthesis)

Design Page attached **all four** upstream table bodies to A5 `materials` (duplicate of A1–A4 tables).  

| Assessment | Detail |
|------------|--------|
| Fidelity | Pipes preserved |
| Pedagogy | Redundant copy — not B4-01/B4-02 |
| Membership | No activity loss |

---

## 5. Comparison to historical failure modes

| Historical bad shape ([38B-4](../38B-4-materials-and-table-fidelity.md), [CONTEXT-FOR-NEXT-CHAT](../CONTEXT-FOR-NEXT-CHAT.md)) | Same-run pipeline |
|------------------------------------------------------------------|-------------------|
| `Scenario 1,,,` comma rows | **Not found** |
| `Headers` / `Rows` prose blocks | **Not found** |
| CSV array `comparison_table: ["Year,Index", ...]` ([csv worksheet fixture](../../../tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json)) | **Not found** |

**Interpretation:** Prior regression likely **run-dependent** (prompt stack, brief, model compression, or facilitated delivery). Wave 1 + W2a + full **Design Page** augmented stack (**22,560** chars) on this run correlated with **preserve success** when GAM already produced pipes.

---

## 6. Prompt-stack asymmetry (important)

| Step | Augmented chars (this runner) | Full self-directed probe ([38B-1](../scripts/probe-38b1-ld-workflow-prompt-audit.js)) |
|------|--------------------------------:|------------------:|
| GAM | **5,033** | **~15,806** |
| DLA | **4,690** | **~18,054** |
| Design Page | **22,560** | **~27,345** |

Design Page had **full** augmented instruction on this capture; GAM/DLA did **not**.  

**Conservative reading:** Preserve path is validated; author path on this run succeeded with **pack + partial runtime** only. Production should still use full `LD-TABLE-FIDELITY` author on GAM per [38B-W2A-1](38B-W2A-1-GAM-pack-authority-trim.md).

---

## 7. B4 classification (programme view)

| Case | GAM (EV-38B4-03 / pipeline GAM) | Design Page (EV-38B4-01) | Programme status |
|------|--------------------------------|--------------------------|------------------|
| **B4-01** | **PASS** (both captures) | **PASS** | **OPEN** — historical failure not reproduced; keep guardrails |
| **B4-02** | **PASS** | **PASS** | **OPEN** — same |
| **B4-03** | **PASS** | **PASS** | **Improved** vs earlier PARTIAL at compose |

### 7.1 Overall B4 risk assessment

| Verdict | Detail |
|---------|--------|
| **B4 risk reduced** | Yes — same-run shows **no** Design Page introduction of comma-row or Headers/Rows when upstream pipes exist |
| **B4 resolved at GAM** | **Partially** — author emits pipes (EV-38B4-03 + pipeline) |
| **B4 resolved at Design Page** | **Partially** — this run preserves pipes in `materials.*` |
| **B4 programme closed** | **No** — need repeatable Factory run with canonical `section_id` page + renderer table HTML check |

---

## 8. Recommendations

| Priority | Action |
|----------|--------|
| P0 | Wave 3: enforce `LD-TABLE-FIDELITY` preserve in compose contract + PREC live gate |
| P1 | Re-run Inflation in **production Factory** with full probe wf on GAM **and** DP; confirm `section_id` page shape |
| P2 | Add AUTO detector for comma-row / Headers+Rows on composed `materials.*` (38B-6 backlog) |
| P3 | Optional PR-W2a-2 — not required to explain this successful preserve run |

---

## 9. References

| Asset | Role |
|-------|------|
| [ev-38b4-01-design-page.json](../fixtures/ev-38b4-01-design-page.json) | Composed page |
| [ev-38b4-01-pipeline-gam.txt](../fixtures/ev-38b4-01-pipeline-gam.txt) | Upstream GAM same run |
| [ev-38b4-03-inflation-gam-live.txt](../fixtures/ev-38b4-03-inflation-gam-live.txt) | Earlier GAM-only capture (inflation-specific tables) |
| [ld-inflation-workshop-page-full.json](../../../tests/fixtures/page-render/ld-inflation-workshop-page-full.json) | Golden reference (fixture, not this run) |

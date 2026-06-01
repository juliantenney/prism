# Future quantitative / STEM rendering notes

**Status:** Deferred boundary document — informs optional **slice 32-7** or a **separate programme**  
**Date:** 2026-06-02

---

## Relationship to Sprint 32

Sprint 32 focuses on **pedagogically justified educational diagrams** for general self-directed pages (Marx, RNA, kitchen-sink profiles).

**Quantitative and STEM visuals** (equations, plots, statistical charts, chemical structures, coordinate geometry) may require:

- different generation models or tools  
- symbolic notation (LaTeX/MathML)  
- data-binding from tables in page JSON  
- stricter accuracy validation  

These needs are **related but not identical** to narrative diagram enrichment.

---

## Sprint 31 / 30 deferred items

| Item | Source |
|------|--------|
| **P31-03** stats / quantitative representative page fixture | Sprint 31 retrospective — not captured |
| **Quantitative / math rendering programme** | Listed as future candidate post–Sprint 31 |
| Illustration pipeline (general) | Sprint 29–30 charters — deferred to visual track |

---

## Options for programme structure

| Option | Description |
|--------|-------------|
| **A. Slice 32-7 inside Sprint 32** | STEM foundations only: charts from tabular materials, simple plots |
| **B. Separate sprint** | “Quantitative & math rendering” after 32-6 proves artefact + export path |
| **C. Parallel track** | Shared export assembly (32-6); different generation prompts |

**Planning default:** treat **32-7 as optional** until 32-1–32-6 artefact and export contracts are proven.

---

## Technical considerations (future)

| Topic | Notes |
|-------|--------|
| **Math notation** | MathML / LaTeX in HTML vs image fallback |
| **Charts** | Data from `util-material-table` pipe tables? |
| **Accuracy** | Validation step for numeric labels |
| **Accessibility** | MathML preferred over image-only equations |
| **Base64 rule** | Same as Sprint 32 — **no** equation images stuffed in prompts |

---

## Governance

- No adaptive learner modelling  
- No semantic rewriting of assessment items  
- Preserve Sprint 31 renderer hierarchy  
- Figures must map to **Essential** or **Valuable** tier — not decorative chart junk  

---

## Decision needed (record in review-log when made)

> Include STEM in Sprint 32 as slice 32-7, or charter a separate quantitative programme after visual pipeline MVP?

Until decided: **do not implement** 32-7.

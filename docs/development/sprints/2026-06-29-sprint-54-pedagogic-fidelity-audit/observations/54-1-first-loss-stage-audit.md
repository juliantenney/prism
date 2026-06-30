# Sprint 54 — First-Loss Stage Audit Log

**Sprint:** 54 — Pedagogic Fidelity Audit  
**Date:** 2026-06-29  
**Status:** Closed — summary record for closure pack

---

## Audit corpora

| Corpus | Role | Artefact evidence |
| ------ | ---- | ----------------- |
| **Marx self-study** | Humanities self-directed reference | Sprint 50 verification run; Marx run2; `tests/fixtures/page-render/marx-self-study-page.json` |
| **RNA / HCV self-study** | STEM quantitative stress (A1–A5, M1–M16) | Live workflow reruns; `tests/fixtures/design-page-compose/rna-abbreviated-materials-page.json` |
| **Inflation workshop** | Workshop-format material-depth stress | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json`; live inflation runs |
| **Accessibility-constrained briefs** | Brief policy propagation (matrix row A83) | Matrix checklist; brief `scopeAndConstraints` templates in domain pack |

---

## Localisation summary (where first loss occurs)

| Element family | Marx (healthy run) | RNA (M1–M16) | Inflation workshop |
| -------------- | ------------------ | ------------ | ------------------ |
| **PEL row fields** | Preserved through DP → HTML when present on DP JSON | Preserved on audited rows when DP complete | Preserved in golden fixture |
| **GAM material bodies** | Present when GAM + DP generation succeed | **First loss: Copilot Design Page** (A1 survives; M4+ truncated / `page_generation_failure`) | **B-stage:** DP row `materials` empty while `activity_materials` section rich; **PRISM merge** (fixed) |
| **Wrapper sections** | Present when DP includes overview / purpose | Present when DP completes | Present in full fixture |
| **Renderer display** | **C passes** when DP JSON complete | **C passes** when DP JSON complete | **C passes** when DP JSON complete |

**Uniformity conclusion:** First-loss stage **differs by family and workload**. Material bodies fail earlier than PEL row fields under high material count (RNA). PRISM-side merge defects are a **separate** localisation from Copilot compose capacity.

---

## Root-cause evidence (why loss occurs)

### Copilot Design Page generation (RNA)

| Evidence | Conclusion |
| -------- | ---------- |
| Full GAM upstream; DP returns `page_generation_failure` or abbreviated M4+ bodies | Single-shot output budget exhaustion — model emits closure checklist while compressing later bodies |
| Prompt-contract inspection (Step 9) | Contract requires full inline bodies + `material_bank` fidelity; competing objectives (page shape, VA metadata, brevity history) |
| PRISM does not observe Copilot | Root cause is **external generation under capacity**, not renderer |

### PRISM merge / assembly (inflation, RNA partial)

| Evidence | Conclusion |
| -------- | ---------- |
| `activity_materials` section populated; `learning_activities.content[].materials` empty | Embed-before-merge gap (`embedPageActivityMaterialsSectionIntoLearningActivities`) |
| One material per type key after merge | Type-key collapse in `mergeMaterialsFromGamList` / `buildMaterialsObjectFromGamList` |
| `tests/page-materials-closure.test.js` | Per-`material_id` preservation enforced after fix |

### Renderer (historical — closed)

| Evidence | Conclusion |
| -------- | ---------- |
| HTML audit vs DP JSON | **AH-53-01** holds post-fix: renderer follows JSON |
| Array-shaped materials collapsed by type in `normalizeActivityMaterialsForRender` | **Fixed** — confirmed renderer defect class B, not primary chain loss |

---

## Implementation recommendations (deferred — not Sprint 54)

| ID | Candidate | Target sprint |
| -- | --------- | ------------- |
| RC-54-01 | Workflow Next gate on material-closure `fail` | Post-audit implementation |
| RC-54-02 | Design Page packaging strategy (`material_bank` + `content_ref`) for large workloads | Compose / prompt redesign |
| RC-54-03 | Product-layer journey navigator, TOC, progress | **Sprint 55** |
| RC-54-04 | Live workshop facilitator mode investigation | Deferred |

---

*Supporting closure: [SPRINT-54-CLOSURE-REPORT.md](../SPRINT-54-CLOSURE-REPORT.md)*

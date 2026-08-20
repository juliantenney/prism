# GAM Prompt Inventory (Sprint 57 Discovery)

**Status:** Evidence record — no behaviour changes  
**Date:** 2026-07-01  
**Scope:** `step_generate_activity_materials` · self-directed learner-page path (primary)  
**Method:** Static trace of `app.js` augmentation chain + domain pack §6 + runtime libs; size probe RNA/HCV self-directed brief

---

## 1. Assembly sequence

```
Domain pack §6 promptTemplate (seeded)
  → applyWorkflowStepRuntimePromptAugmentations (app.js ~10997)
      1. applyLdGuidedLearningScaffoldContractToDraft — SKIP (DLA-only)
      2. applyPedagogicCognitionContractScaffoldToDraft — conditional (pack cognition active)
      3. applyEducationalQualityFrameworkPromptBlockToDraft
      4. applyInstructionalPatternPromptBlockToDraft — GAM-only (SP-01..07)
      5. applySelfDirectedLearnerPageStepScaffoldsToDraft — GAM sub-chain
      6. applyLdTableFidelityContractToDraft — deduped if already present
      7. applyLdMaterialsCopyContractToDraft — deduped if module id in text
      8. applyPedagogicEnrichmentContractScaffoldToDraft — PEL reasoning materials (GAM)
      9. applyLdDesignPageComposeContractToDraft — SKIP
     10. applySprint38VisualAffordanceContractToDraft — SKIP
     11. applyMathSafeOutputContractToDraft
     12. applyStrictJsonArtefactContractToDraft — SKIP (text output)
     13. applyEpisodePlanDlaPopulationPromptBlockToDraft — SKIP
```

**GAM sub-chain** inside `applySelfDirectedLearnerPageStepScaffoldsToDraft` when `shouldApplySelfDirectedLearnerPageGamMaterialScaffold` (~11101):

```
applyLdTableFidelityContractToDraft (author)
→ applyLdMaterialsCopyContractToDraft (author, no marker)
→ buildSelfDirectedGamSelfStudyMaterialsPromptBlock
→ applyLdSelfDirectedRhetoricContractToDraft (role: gam)
```

**Gate:** Self-directed + learner-page output (`shouldApplySelfDirectedLearnerPageGamMaterialScaffold`, app.js ~7225). Facilitated brief skips SP, self-study, rhetoric, PEL reasoning block.

---

## 2. Prompt contributors inventory

| # | Component | Source | Purpose | Approx size (chars) | Authority type |
|---|-----------|--------|---------|--------------------:|----------------|
| 1 | Pack `promptTemplate` | `domain-learning-design-step-patterns.md` §6 | GAM task, GAM-PRES/GAM-WB, output shape | **15,241** | Contract (pack SSOT) |
| 2 | Pack `defaultPromptNotes` | Same §6 | Pointer to GAM-PRES, runtime modules | 471 | Guidance |
| 3 | GAM-PRES-00..10 (embedded) | Pack template | Instructional function preservation, depth, Evaluate | ~8,822 | Contract |
| 4 | GAM-WB block (embedded) | Pack template | Workbook genre, table/scenario rules | ~10,208 | Contract |
| 5 | Output organisation template | Pack template | `Activity:` / `Material:` block shape | ~600 | Example / contract |
| 6 | EDUCATIONAL-QUALITY-FRAMEWORK | `lib/educational-quality-framework-prompt.js` | Journey, judgement, progressive independence | **1,727** (Δ) / 1,189 block | Governance |
| 7 | INSTRUCTIONAL-PATTERN-SP-01 | `lib/instructional-pattern-prompt.js` | Text exposition genre + GOOD example | 1,695 | Contract + example |
| 8 | INSTRUCTIONAL-PATTERN-SP-02 | Same | Decision table partial exemplar + example | 1,532 | Contract + example |
| 9 | INSTRUCTIONAL-PATTERN-SP-03 | Same | Transfer prompt + example | 1,937 | Contract + example |
| 10 | INSTRUCTIONAL-PATTERN-SP-04 | Same | Consolidation_summary + example | 2,058 | Contract + example |
| 11 | INSTRUCTIONAL-PATTERN-SP-05 | Same | Checklist verification + example | 3,101 | Contract + example |
| 12 | INSTRUCTIONAL-PATTERN-SP-06 | Same | Worked_example bridge + example | 2,987 | Contract + example |
| 13 | INSTRUCTIONAL-PATTERN-SP-07 | Same | Sample_output annotated + example | 1,676 | Contract + example |
| 14 | LD-TABLE-FIDELITY (author) | `app.js` bootstrap + `lib/ld-table-fidelity.js` | Pipe tables, row adequacy | **2,693** | Contract |
| 15 | LD-MATERIALS-COPY (author) | `app.js` bootstrap + `lib/ld-materials-copy.js` | Full bodies, no catalogue labels | **1,259** | Contract |
| 16 | Self-study materials block | `app.js` `buildSelfDirectedGamSelfStudyMaterialsPromptBlock` | Reading depth, voice, sequencing | **3,530** | Guidance |
| 17 | LD-SELF-DIRECTED-RHETORIC (gam) | `lib/ld-self-directed-rhetoric.js` | Facilitator ban, worked/fading, closure | **1,949** | Governance |
| 18 | PEL reasoning materials | `app.js` `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | SP cross-refs, weak/strong, depth | **3,875** | Guidance / contract |
| 19 | LD-MATH-RENDER | `app.js` / `lib/ld-math-render.js` | TeX delimiters | **1,220** | Contract |
| 20 | Pedagogic cognition (GAM) | `app.js` `buildPedagogicCognitionContractPromptBlock` | Cognition cues in non-text materials | 0–800 (conditional) | Contract |
| 21 | `buildGamOutputContractSystemPrompt` | `lib/gam-output-format.js` | Retry/system prompt for probes | **1,250** | Validation (not in main emit) |

**Measured totals (RNA/HCV self-directed, 2026-07-01 probe):**

| Metric | Chars |
|--------|------:|
| Seeded (pack only) | 15,145 |
| Augmented (runtime) | **46,349** |
| Runtime delta | +31,204 |
| Facilitated augmented | ~21,967 (+6,822) |

---

## 3. Ownership map

| Concern | Primary owner | Secondary / overlapping |
|---------|---------------|------------------------|
| Material membership & order | Pack GAM-PRES-01/02 | — |
| Depth floors (L3, checklist, transfer) | Pack GAM-PRES-08/09 | SP-03/04/05, PEL reasoning block |
| Evaluate archetype realisation | Pack GAM-PRES-06/10 | SP-02/06, `gam-output-format` A4 compose |
| Workbook genre | Pack GAM-WB | GAM-PRES-09 FAIL taxonomy |
| Table shape | LD-TABLE-FIDELITY | Pack GAM-WB-38F-01 |
| Material body fidelity | LD-MATERIALS-COPY | Pack usability lines |
| Per-type material genre | INSTRUCTIONAL-PATTERN SP-01..07 | PEL reasoning cross-refs |
| Learner voice / facilitator ban | Self-study block + LD-SELF-DIRECTED-RHETORIC | Pack template line |
| Capture format | `lib/gam-output-format.js` | Pack output organisation |
| Post-capture sanitization | `sanitizeSelfDirectedGamMaterialsOutput` | — |
| Design Page merge | `lib/page-gam-materials-preserve.js` | Not generation path |

---

## 4. Domain-pack contributions (§6)

| Field | Value |
|-------|-------|
| `canonicalStepId` | `step_generate_activity_materials` |
| `preferredOutputFormat` | `text` |
| `promptScope` | `step_only` |
| Inputs | `learning_activities`, optional KM/content |
| Outputs | `activity_materials`, `session_materials` |
| Parameter | `session_materials` (page / slide_deck) |

Pack template embeds **GAM-PRES**, **GAM-WB**, FAIL taxonomies (F1–F9, AP, EV-GAM-FAIL, DEPTH-COLLAPSE), and references runtime modules by name (LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-MATH-RENDER, LD-SELF-DIRECTED-RHETORIC).

---

## 5. Assessment / rubric note

GAM does **not** invoke the separate **Design Assessment** or **Generate Assessment Items** steps. Rubric appears as a **material type** in GAM-PRES-03/06 (criteria exposition), not as a standalone assessment-generation contract on this path.

---

## 6. Traceability

| Artefact | Path |
|----------|------|
| Augmentation chain | `app.js` ~10997–11020, ~11022–11112 |
| GAM capture gate | `app.js` ~11858; `lib/gam-output-format.js` |
| Instructional patterns | `lib/instructional-pattern-prompt.js` |
| Pack §6 | `domains/learning-design/domain-learning-design-step-patterns.md` ~2792–2839 |
| Prior audit | `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-1-prompt-audit.md` |

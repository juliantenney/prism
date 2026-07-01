# GAM Authority Map (Sprint 57 Discovery)

**Status:** Evidence record  
**Date:** 2026-07-01

---

## 1. Authority inventory

| Authority | Location | Purpose | Owner layer | Invocation |
|-----------|----------|---------|-------------|------------|
| **GAM-PRES-00..10** | Pack §6 `promptTemplate` | IFP realisation, depth, Evaluate preservation | Pack (L4 author) | Seeded template |
| **GAM-WB-00..38F-01** | Pack §6 `promptTemplate` | Workbook genre, table/scenario | Pack (L4 author) | Seeded template |
| **FAIL taxonomies** | Pack (F1–F9, AP, EV-GAM, DEPTH-COLLAPSE) | Contract failure codes | Pack | Seeded + capture gate |
| **Output organisation** | Pack §6 | `Activity:` / `Material:` / `Content:` shape | Pack | Seeded |
| **LD-TABLE-FIDELITY** | `lib/ld-table-fidelity.js` + app bootstrap | Pipe tables, row adequacy | Runtime L4 | `applyLdTableFidelityContractToDraft` |
| **LD-MATERIALS-COPY** | `lib/ld-materials-copy.js` + app bootstrap | Full bodies, anti-catalogue | Runtime L4 | `applyLdMaterialsCopyContractToDraft` |
| **INSTRUCTIONAL-PATTERN SP-01..07** | `lib/instructional-pattern-prompt.js` | Per material-type genre + examples | Runtime L4 | `applyInstructionalPatternPromptBlockToDraft` |
| **EDUCATIONAL-QUALITY-FRAMEWORK** | `lib/educational-quality-framework-prompt.js` | Journey, judgement, independence | Runtime L5 | `applyEducationalQualityFrameworkPromptBlockToDraft` |
| **LD-SELF-DIRECTED-RHETORIC (gam)** | `lib/ld-self-directed-rhetoric.js` | Facilitator ban, closure/debrief | Runtime L7 | `applyLdSelfDirectedRhetoricContractToDraft` |
| **Self-study materials block** | `app.js` ~10255 | Reading depth, voice, sequencing | Runtime guidance | `buildSelfDirectedGamSelfStudyMaterialsPromptBlock` |
| **PEL reasoning materials** | `app.js` ~10425 | Weak/strong, SP cross-refs, depth | Runtime L5 | `applyPedagogicEnrichmentContractScaffoldToDraft` |
| **LD-MATH-RENDER** | `lib/ld-math-render.js` | TeX delimiters | Runtime L7 | `applyMathSafeOutputContractToDraft` |
| **Pedagogic cognition (GAM)** | `app.js` ~6992 | Cognition cues in materials | Runtime L5 | `applyPedagogicCognitionContractScaffoldToDraft` |
| **GAM-FMT capture gate** | `lib/gam-output-format.js` | Pack text structure, coverage, depth warn | Capture L4 | `applyGamPackTextValidationToCapture` |
| **GAM A4 compose contract** | `lib/gam-output-format.js` | Pre-compose Evaluate markers | Compose L4 | `validateGamA4ComposeContract` |
| **Materials preserve** | `lib/page-gam-materials-preserve.js` | GAM → page merge fidelity | Compose L4 | `applyGamMaterialsToComposedPage` |

**Distinct governance authorities on generation path:** **12** (pack GAM-PRES/WB counts as 1 pack authority + 11 runtime modules/blocks).

---

## 2. Invocation path diagram

```
Copy / Run prompt
  └─ buildSeededStepPromptForWorkflowStep (pack §6)
  └─ applyWorkflowStepRuntimePromptAugmentations
        ├─ Pedagogic cognition (conditional)
        ├─ EQF
        ├─ Instructional patterns (GAM only)
        ├─ Self-directed scaffolds (GAM sub-chain)
        ├─ Table fidelity (dedupe)
        ├─ Materials copy (dedupe)
        ├─ PEL reasoning materials (GAM)
        └─ Math render

Capture paste
  └─ sanitizeWorkflowRunCapturedOutputForStep
        └─ sanitizeSelfDirectedGamMaterialsOutput
  └─ applyGamPackTextValidationToCapture
        └─ validateGamPackTextCaptureGate (lib/gam-output-format.js)

Design Page compose (downstream)
  └─ applyGamMaterialsToComposedPage (page-gam-materials-preserve.js)
```

---

## 3. Overlapping responsibilities

| Topic | Authority A | Authority B | Overlap |
|-------|-------------|-------------|---------|
| Transfer prompt ≥80w | GAM-PRES-08 (T1) | SP-03 + PEL reasoning | Same floor, three sources |
| Checklist ≥4 items | GAM-PRES-08 (V1) | SP-05 + PEL reasoning | Same floor, three sources |
| Worked_example bridge | GAM-PRES-08 (A1) | SP-06 + PEL reasoning | Bridge + What experts notice |
| Consolidation ≥80w | GAM-WB-06 / GAM-PRES-08 | SP-04 | Scaffold-only rules duplicated |
| Table pipe shape | GAM-WB-38F-01 | LD-TABLE-FIDELITY | Pack + runtime |
| Full material bodies | GAM-PRES-00 | LD-MATERIALS-COPY | Pack + runtime |
| Anti-spoiler / scaffold-only | GAM-PRES-05 | GAM-WB-06b, SP-04/06/07 | Multiple anti-spoiler clauses |
| Facilitator ban | Pack template | Self-study block + rhetoric | Triple coverage |
| Progressive independence | EQF | GAM-PRES fade/implied | Journey vs material depth |
| Depth vs brevity | Self-study anti-redundancy | GAM-PRES-08 minima | Explicit tension |

---

## 4. Authoritative vs advisory

| Concern | Authoritative | Notes |
|---------|---------------|-------|
| Material order/membership | **GAM-PRES-01/02** (pack) | Runtime does not override |
| Depth floors L3 | **GAM-PRES-08/09** (pack) | SP blocks reinforce per type |
| Output text shape | **Pack output organisation** + **GAM-FMT-02** (capture) | |
| Per-type body genre | **SP-01..07** (runtime) | Applied in addition to pack |
| Table pipe syntax | **LD-TABLE-FIDELITY** | Overrides brevity (PREC-01) |
| Capture blocking | **GAM-FMT-01..03,05** | Tiered gate Sprint 44 |

**No single SSOT module** equivalent to Sprint 56 `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` for GAM. Pack GAM-PRES is the nearest pack authority; runtime SP + PEL layers add second and third authorities for the same material genres.

---

## 5. Comparison to DLA pre-rationalisation

| Aspect | DLA pre-S56 | GAM current |
|--------|-------------|-------------|
| Pack contract density | Moderate template + OUTPUT CONTRACT accretion | **Very dense pack** (GAM-PRES+WB ~19k in template) |
| Runtime stack | Rhetoric + cognition + EQF + PEL + examples | SP (15k) + EQF + PEL + rhetoric + self-study |
| Single SSOT marker | None (fixed in S56) | None |
| Word-range conflicts | Multiple conflicting floors | Depth floors concentrated in GAM-PRES-08 |
| PRE-EMIT gate | Added (DLA) | **None** |

---

## 6. Traceability

| File | Lines / role |
|------|----------------|
| `app.js` | 6907–6917 step detect; 10997–11112 augment; 10606–10649 sanitize; 11858–11911 capture gate |
| `lib/instructional-pattern-prompt.js` | SP-01..07 blocks |
| `lib/gam-output-format.js` | Capture validation, A4 compose |
| `domain-learning-design-step-patterns.md` | §6 ~2838 `promptTemplate` |

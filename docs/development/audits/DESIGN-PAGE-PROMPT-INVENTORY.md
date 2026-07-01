# Design Page Prompt Inventory (Sprint 57 Discovery)

**Status:** Evidence record — no behaviour changes  
**Date:** 2026-07-01  
**Scope:** `step_design_page` · self-directed learner-page path (primary)  
**Method:** Static trace of `app.js` augmentation chain + domain pack §13 + runtime libs; size probe RNA/HCV self-directed brief (`scripts/probe-design-page-s57-audit-metrics.js`)

---

## 1. Assembly sequence

```
Domain pack §13 promptTemplate (seeded)
  → applyWorkflowStepRuntimePromptAugmentations (app.js ~10990)
      1. applyLdGuidedLearningScaffoldContractToDraft — SKIP (dlaLearnerPageScaffoldSsot only on DLA)
      2. applyPedagogicCognitionContractScaffoldToDraft — SKIP (cognition inactive for default RNA brief)
      3. applyEducationalQualityFrameworkPromptBlockToDraft
      4. applyInstructionalPatternPromptBlockToDraft — SKIP (GAM-only gate)
      5. applySelfDirectedLearnerPageStepScaffoldsToDraft — rhetoric only (design_page role)
      6. applyLdTableFidelityContractToDraft — SKIP (Design Page falls through at ~10226)
      7. applyLdMaterialsCopyContractToDraft — SKIP (GAM-only gate)
      8. applyPedagogicEnrichmentContractScaffoldToDraft — SKIP (PEL orientation/reasoning DLA-only)
      9. applyLdDesignPageComposeContractToDraft — **primary Design Page stack**
     10. applySprint38VisualAffordanceContractToDraft — Design Page only
     11. applyMathSafeOutputContractToDraft
     12. applyStrictJsonArtefactContractToDraft — SKIP (no `page` kind in strict lib)
     13. applyEpisodePlanDlaPopulationPromptBlockToDraft — SKIP (DLA-only)
```

**Design Page compose sub-chain** inside `applyLdDesignPageComposeContractToDraft` (~10059–10108) when `shouldApplyLearnerPagePedagogicFramingScaffold`:

```
buildLdDesignPageComposePromptBlock (with embedded LD-AUTHORIAL-EXPOSITION block)
  → applyLdJourneyAssimilationContractToDraft
  → applyLdGuidedLearningScaffoldContractToDraft (includeCompose: true, includeDlaPreEmit: false)
```

**Self-directed rhetoric sub-chain** inside `applySelfDirectedLearnerPageStepScaffoldsToDraft` (~11101–11103):

```
applyLdSelfDirectedRhetoricContractToDraft (role: design_page)
```

**Gate:** Self-directed + learner-page framing (`shouldApplyLearnerPagePedagogicFramingScaffold`). Facilitated brief skips compose stack, journey, scaffold, rhetoric — retains EQF, Sprint 38, math.

---

## 2. Prompt contributors inventory

| # | Component | Source | Purpose | Approx size (chars) | Authority type |
|---|-----------|--------|---------|--------------------:|----------------|
| 1 | Pack `promptTemplate` | `domain-learning-design-step-patterns.md` §13 | Assembly task, materials fidelity, episode plans, membership, visual pointer, output JSON shape | **10,927** | Contract (pack) |
| 2 | Pack `defaultPromptNotes` | Same §13 | Runtime module pointers (compose, rhetoric, Sprint 38, math) | **1,122** | Guidance |
| 3 | Pack `runnerInstructions` | Same §13 | Human checklist (sections, episode_plans, compose closure) | ~1,400 (in notes/runner) | Validation / guidance |
| 4 | EDUCATIONAL-QUALITY-FRAMEWORK | `lib/educational-quality-framework-prompt.js` | Journey, judgement, progressive independence (design_page slice) | **1,643** | Governance |
| 5 | LD-SELF-DIRECTED-RHETORIC (design_page) | `lib/ld-self-directed-rhetoric.js` | Wrapper prose voice; journey assimilation cross-ref | **2,313** | Governance |
| 6 | LD-DESIGN-PAGE-COMPOSE-CONTRACT | `lib/ld-design-page-compose-contract.js` | Membership, field preservation, episode plans, materials bridge | **9,978** | Contract |
| 7 | LD-AUTHORIAL-EXPOSITION-CONTRACT | `lib/ld-authorial-exposition.js` (embedded in compose block) | Wrapper voice, preservation boundary | **2,728** | Contract |
| 8 | LD-JOURNEY-ASSIMILATION-CONTRACT | `lib/ld-journey-assimilation.js` | Inquiry arc, wrapper transitions, closure synthesis | **4,808** | Contract |
| 9 | LD-GUIDED-LEARNING-SCAFFOLD (compose mode) | `lib/ld-guided-learning-scaffold.js` | Field word ranges, exemplars, compose preservation rider | **4,332** | Contract + example |
| 10 | Sprint 38 visual affordance contract | `app.js` `buildSprint38VisualAffordanceDesignPagePromptBlock` | Schema 38.4, generate/defer/reject rules, 3 JSON examples | **5,476** | Contract + example |
| 11 | Sprint 38 pedagogical added-value contract | `app.js` `buildSprint38PedagogicalAddedValuePromptLines` | Figure QA, must_add/must_not_duplicate | **1,123** | Contract |
| 12 | LD-MATH-RENDER | `app.js` / `lib/ld-math-render.js` | TeX delimiters | **1,219** | Contract |
| 13 | LD-MATERIALS-COPY (referenced, not injected) | Pack + compose deferral text | Named in pack template and compose CORE_LINES — **not appended** on Design Page emit | 0 (reference only) | Contract (deferred) |
| 14 | LD-TABLE-FIDELITY (referenced, not injected) | Pack template | Named in pack — **not appended** (`applyLdTableFidelityContractToDraft` returns draft for Design Page) | 0 (reference only) | Contract (deferred) |

**Measured totals (RNA/HCV self-directed, 2026-07-01 probe):**

| Metric | Chars |
|--------|------:|
| Seeded (pack + workflow seed wrapper) | 10,757 |
| Augmented (runtime) | **44,386** |
| Runtime delta | +33,629 |
| Facilitated augmented | 42,265 (+31,508) |
| Auto-applied block count | **9** |

---

## 3. Incremental augmentation trace (self-directed)

| Step | Δ chars | Cumulative |
|------|--------:|-----------:|
| Seeded pack | — | 10,757 |
| Pedagogic cognition | 0 | 10,757 |
| EQF | +1,644 | 12,401 |
| Instructional pattern | 0 | 12,401 |
| Self-directed scaffolds (rhetoric) | +2,314 | 14,715 |
| Table fidelity | 0 | 14,715 |
| Materials copy | 0 | 14,715 |
| PEL enrichment | 0 | 14,715 |
| **Design Page compose stack** | **+21,850** | **36,565** |
| Sprint 38 visual | +6,601 | 43,166 |
| Math render | +1,220 | 44,386 |
| Strict JSON | 0 | 44,386 |

The compose stack single step accounts for **65%** of runtime delta.

---

## 4. Ownership map

| Concern | Primary owner | Secondary / overlapping |
|---------|---------------|------------------------|
| Page JSON schema & membership | LD-DESIGN-PAGE-COMPOSE-CONTRACT | Pack template (duplicate rules) |
| Materials body fidelity | Compose MATERIALS_BRIDGE + pack template | Post-capture `page-gam-materials-preserve.js` |
| Activity-row field preservation | Compose FIELD_PRESERVATION + LD-GUIDED-LEARNING-SCAFFOLD compose rider | `page-activity-field-preserve.js` (capture) |
| Episode plans portable schema | Compose EPISODE_PLAN_LINES | Pack template episode section |
| Wrapper / journey prose | LD-JOURNEY-ASSIMILATION | LD-SELF-DIRECTED-RHETORIC design_page rider; pack overview rules |
| Authorial voice / boundary | LD-AUTHORIAL-EXPOSITION | Journey assimilation PRESERVATION BOUNDARY cross-ref |
| Visual affordances metadata | Sprint 38 runtime block | Pack pointer + compose additive-only rule |
| Table pipe / adjunct prose | Pack template (38H-3 / DP-TABLE-ADJ-01) | **LD-TABLE-FIDELITY not injected** |
| Learner voice / facilitator ban | LD-SELF-DIRECTED-RHETORIC | Pack learner profile instructions |
| Educational quality | EDUCATIONAL-QUALITY-FRAMEWORK | Journey closure lines |
| Maths notation | LD-MATH-RENDER | Pack inline math note |
| Post-compose repair | `applyComposedPageGamMaterialsPreserve`, validation suite | Not on emit path |

---

## 5. Domain-pack contributions (§13)

| Field | Value |
|-------|-------|
| `canonicalStepId` | `step_design_page` |
| `preferredOutputFormat` | `json` |
| `promptScope` | `step_only` |
| Inputs | `learning_outcomes`, `learning_activities`, `activity_materials`, `episode_plans`, optional sequence/content/KM/assessment |
| Outputs | `page` |
| User options | `page_profile`, `include_answers`, `include_marking_guidance`, `include_feedback_guidance` |

Pack `promptTemplate` (~10.9k) embeds full materials-fidelity taxonomy, episode-plan portable schema, activity membership closure, visual affordance pointer, inflation-collapse FAIL substitutes, and pre-emit validation checklist — largely overlapping runtime compose contract.

---

## 6. Post-generation path (not in emitted prompt)

| System | File | Role |
|--------|------|------|
| GAM materials overlay | `lib/page-gam-materials-preserve.js` | Merge upstream `activity_materials` when compose thins |
| Activity field preserve | `lib/page-activity-field-preserve.js` | Field closure validation / prefer-upstream |
| Page composition validation | `app.js` ~38993+ | Activity, materials, episode, field, beat closure |
| Facilitator row sanitization | `app.js` `sanitizeSelfDirectedLearnerPageActivityRows` | Strip facilitator-only fields on capture |
| Sprint 38 compose enforcement | `app.js` `applySprint38VisualAffordancesToComposedPage` | Strict validation on composed page |
| Capture normalisation | `app.js` `normalizePageWorkflowRunCapture` | JSON shape normalise on workflow capture |

---

## 7. Traceability

| Artefact | Path |
|----------|------|
| Augmentation chain | `app.js` ~10990–11012, ~10059–10108, ~11015–11104 |
| Compose contract | `lib/ld-design-page-compose-contract.js` |
| Journey assimilation | `lib/ld-journey-assimilation.js` |
| Guided scaffold compose mode | `lib/ld-guided-learning-scaffold.js` ~211–234 |
| Sprint 38 block | `app.js` ~10302–10341 |
| Pack §13 | `domains/learning-design/domain-learning-design-step-patterns.md` ~3379–3453 |
| Prior audit | `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-1-prompt-audit.md` |
| Probe | `scripts/probe-design-page-s57-audit-metrics.js` |

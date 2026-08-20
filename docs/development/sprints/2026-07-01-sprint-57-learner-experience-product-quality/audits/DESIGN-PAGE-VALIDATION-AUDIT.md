# Design Page Validation and Repair Audit (Sprint 57 Discovery)

**Status:** Evidence record  
**Date:** 2026-07-01  
**Scope:** PRE-EMIT, validation layers, repair, capture processing, post-generation transforms, rendering-time enforcement

---

## 1. Summary

| Category | Count | Authoritative layer |
|----------|------:|---------------------|
| PRE-EMIT on emit | **0** | — |
| Prompt-side validation checklists | **2** | Pack pre-return checklist + Sprint 38 field-type rules |
| Capture-side validation systems | **6** | Page composition validation suite (primary) |
| Repair / overlay systems | **4** | GAM materials preserve, field prefer-upstream, cognition merge, facilitator sanitization |
| Rendering-time enforcement | **2** | Sprint 38 compose normalisation; utility preview composition |

**Authoritative validation for workflow advance:** `validateStrictJsonWorkflowRunStepCapture` (syntax) + `applyPageCompositionValidationForCapturedPage` (semantic closure, warn/fail → `generation_notes`).

---

## 2. PRE-EMIT systems

| System | On Design Page? | Location | Notes |
|--------|-----------------|----------|-------|
| DLA PRE-EMIT SCAFFOLD GATE | **No** | `lib/ld-guided-learning-scaffold.js` DLA_PRE_EMIT_LINES | `includeDlaPreEmit: false` on Design Page (`app.js` ~9703) |
| Pack pre-return checklist | **Prompt-only** | Pack `promptTemplate` tail | “Before returning JSON, validate…” — not executable |
| Sprint 38 type strictness | **Prompt-only** | `buildSprint38VisualAffordanceDesignPagePromptBlock` | Boolean/array field rules |

Probe evidence: `PRE-EMIT` phrase count **0** in augmented prompt.

**Conclusion:** Design Page has **no executable PRE-EMIT gate** on emit — healthier than pre-S56 DLA.

---

## 3. Validation layers (capture-side)

### 3.1 `applyPageCompositionValidationForCapturedPage` (PRIMARY)

**Location:** `app.js` ~38993–39093  
**Invocation:** `syncWorkflowRunCapturedOutput` when `outputName === "page"` (~19847–19848)  
**Authority level:** **Authoritative** for workflow capture warnings and `generation_notes` mutation

| Sub-validator | Function | Purpose | Outcome handling |
|---------------|----------|---------|------------------|
| Activity closure | `validatePageActivityClosure` | Upstream DLA ids vs composed page ids; phantom detection | `appendPageCompositionClosureWarnings` |
| Episode plans closure | `validatePageEpisodePlansClosure` | Portable `episode_plans[]` alignment | `appendPageCompositionEpisodePlansClosureWarnings` |
| Materials closure | `validatePageMaterialsClosureFromLib` | GAM body presence vs upstream | `appendPageCompositionMaterialsClosureWarnings` |
| Activity field closure | `validatePageActivityFieldClosureFromLib` | Thin/thinned DLA fields on page rows | `generation_notes.composition_warnings` |
| Beat-material closure | `validatePageBeatMaterialClosureFromLib` | Episode beat vs material alignment | `appendPageCompositionBeatMaterialClosureWarnings` |

**Pre-validation transform:** `applyPedagogicCognitionSemanticsToComposedPage` runs **before** validators (~39015).

---

### 3.2 Strict JSON capture gate

**Location:** `app.js` `validateStrictJsonWorkflowRunStepCapture` (~19830)  
**Purpose:** Parse validity for JSON workflow steps  
**Authority:** Blocks step completion on failure  
**Overlap:** Duplicates pack “Return JSON only” instruction — syntax only, not semantic.

---

### 3.3 Page capture normalisation

**Location:** `app.js` `normalizePageWorkflowRunCapture` (~8204, ~19787)  
**Purpose:** Normalise captured page JSON shape on sync  
**Authority:** Mutates capture text before validation  
**Level:** **Repair-adjacent** (shape fix, not content generation)

---

### 3.4 Facilitator row sanitization (capture + compose)

**Location:** `app.js` `sanitizeSelfDirectedLearnerPageActivityRows` (~10744)  
**Invocation:** `applySelfDirectedLearnerPageActivityRowSanitizationToComposedPage` in composition pipeline (~38384)  
**Purpose:** Strip facilitator-only fields from learner-facing page activities  
**Authority:** **Governance** — aligns output with self-directed rhetoric bans  
**Overlap:** Prompt bans facilitator language; capture removes facilitator fields — complementary, not duplicate gates.

---

### 3.5 Utilities / preview validation

**Location:** `applyPageCompositionValidationForUtilitiesPage` (~39095)  
**Purpose:** Same closure suite for utility preview paths  
**Authority:** Advisory for preview; mirrors capture validators

---

### 3.6 Sprint 38 visual affordance strict validation

**Location:** `applySprint38VisualAffordancesToComposedPage` (~38448)  
**Invocation:** Composition pipeline with `{ strictValidation: true }` (~38383)  
**Purpose:** Normalise and validate `visual_affordances[]` rows against schema 38.4  
**Authority:** **Compose-time canonical** for visual metadata  
**Overlap:** Sprint 38 prompt block teaches schema; compose function enforces — **prompt + code pair** (similar to GAM-FMT pattern).

---

## 4. Repair systems

| System | Location | Purpose | Authority | When runs |
|--------|----------|---------|-----------|-----------|
| GAM materials preserve | `lib/page-gam-materials-preserve.js` | Overlay upstream `activity_materials` when page materials thin/placeholder | **L4 repair canonical** | Composition pipeline `applyComposedPageGamMaterialsPreserve` |
| Activity field prefer-upstream | `lib/page-activity-field-preserve.js` | `shouldPreferUpstreamFieldContent` — thin page field replaced | Validation support | Field closure validator |
| Learner page composition repair | `app.js` `repairLearnerPageCompositionFromUpstream` | Framing field merge from upstream DLA | Compose repair | Before cognition semantics (~38362) |
| Episode plans preserve | `lib/page-episode-plans-preserve.js` (via app) | Attach missing episode plans from upstream | Compose repair | End of composition pipeline |
| Guided learning scaffold repair | `lib/ld-guided-learning-scaffold.js` repair fns | DLA capture repair | **DLA-only** — not on Design Page capture path | `applyGuidedLearningScaffoldRepairToDlaCapture` (~19808) — gated `isDlaStep` |

**Design Page capture path** (~19786–19848): `normalizePageWorkflowRunCapture` → strict JSON → `applyPageCompositionValidationForCapturedPage`. **No DLA scaffold repair** on page capture.

---

## 5. Post-generation transforms (composition pipeline)

**Entry:** `applyLearnerPageCompositionPipeline` / related (~38360+)

| Step | Function | Purpose |
|------|----------|---------|
| 1 | `repairLearnerPageCompositionFromUpstream` | Merge upstream framing fields |
| 2 | `applyPedagogicCognitionSemanticsToComposedPage` | Cognition-aware section normalisation (conditional) |
| 3 | `applySequencingInteractionMetadataToPageActivities` | Sequence metadata on rows |
| 4 | `applySprint38VisualAffordancesToComposedPage` | Visual affordance normalisation |
| 5 | `applySelfDirectedLearnerPageActivityRowSanitizationToComposedPage` | Facilitator field strip |
| 6 | `applyComposedPageGamMaterialsPreserve` | Materials overlay |
| 7 | `applyComposedPageEpisodePlansPreserve` | Episode plan overlay |

**Authority:** Repair layers **supplement** prompt contracts when LLM output drifts — especially materials (L4) and episode plans.

---

## 6. Rendering-time enforcement

| System | Location | Purpose |
|--------|----------|---------|
| Utility HTML preview | `applyPageCompositionValidationForUtilitiesPage` + preview renderers | Pre-render closure check |
| Math render | Renderer consumes LD-MATH-RENDER delimiters | Not prompt validation |
| Assessment semantics | `applyAssessmentSemanticsToComposedPage` | Assessment profile pages (conditional) |

Rendering does not re-prompt; it consumes composed JSON validated at capture.

---

## 7. Duplication and overlap

| Overlap | Layers | Assessment |
|---------|--------|------------|
| Activity membership | Pack checklist + compose MEMBERSHIP + `validatePageActivityClosure` | Prompt + capture — **acceptable tiering** |
| Materials fidelity | Pack + compose + prompt + `validatePageMaterialsClosure` + GAM preserve | **Heavy** — repair compensates for prompt gaps (C-01) |
| Visual schema | Sprint 38 prompt + `applySprint38VisualAffordancesToComposedPage` | **Intentional** prompt/code pair |
| Facilitator leak | Rhetoric prompt + `sanitizeSelfDirectedLearnerPageActivityRows` | Complementary |
| Scaffold word floors | LD-GUIDED-LEARNING-SCAFFOLD prompt + field closure validator | **Misaligned** — generation floors on compose step |

**No dual PRE-EMIT gates.** Primary duplication risk: **materials closure + GAM preserve** compensating for missing LD-MATERIALS-COPY injection on emit.

---

## 8. Validation system count

| Tier | Systems |
|------|--------|
| Emit prompt checklists | 2 (pack tail, Sprint 38 inline) |
| Capture validators | 6 (closure suite + strict JSON) |
| Compose repair | 4 active on learner-page path |
| **Total distinct validation/repair authorities** | **12** |

**Authoritative validation layer:** Capture-side `applyPageCompositionValidationForCapturedPage` + strict JSON gate. Repair layer: `applyComposedPageGamMaterialsPreserve` for materials drift.

---

## 9. Traceability

| Evidence | Path |
|----------|--------|
| Capture sync | `app.js` ~19786–19848 |
| Validation suite | `app.js` ~38488–39093 |
| Composition pipeline | `app.js` ~38360–38446 |
| GAM preserve | `lib/page-gam-materials-preserve.js` |
| Field preserve | `lib/page-activity-field-preserve.js` |
| PRE-EMIT absence | `scripts/probe-design-page-s57-audit-metrics.js` |
| DLA repair gate | `app.js` ~19808–19820 (`isDlaStep` only) |

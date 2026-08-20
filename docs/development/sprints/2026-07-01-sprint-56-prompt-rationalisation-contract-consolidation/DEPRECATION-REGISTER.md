# Prompt Contract Deprecation Register

**Governance:** [SPRINT-56-PROMPT-GOVERNANCE.md](../sprints/2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-PROMPT-GOVERNANCE.md)  
**SSOT spec:** [SPRINT-56-DLA-SSOT-SPEC.md](SPRINT-56-DLA-SSOT-SPEC.md)

---

## Active deprecations (Sprint 56 DLA-05)

| Deprecated block | Marker / emitter | Superseded by | Removal sprint | DLA emission status |
|------------------|------------------|---------------|----------------|---------------------|
| Learner-page activity framing scaffold prose | `Learner-page activity framing (auto-applied)` · `buildSelfDirectedLearnerPageActivityFramingPromptBlock` | `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` | Sprint 56 | **Removed** from DLA path |
| OUTPUT CONTRACT duplicate scaffold prose | Word ranges, depth rules, exemplars in `buildLearnerPageDlaOutputContractOverrideBlock` | Thin field index + SSOT pointer | Sprint 56 | **Removed** — thin index retained |
| LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT | `applyLdActivityPreambleExpositionContractToDraft` | `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` | Sprint 56 | **Removed** from DLA stack (lib retained for evaluators) |
| LD-COGNITION-ORIENTATION-CONTRACT | `applyLdCognitionOrientationContractToDraft` | `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` | Sprint 56 | **Removed** from DLA stack (lib retained for evaluators) |
| LD-COGNITION PRE-EMIT checklist | `PRE-EMIT CHECKLIST` in cognition block | Unified `DLA PRE-EMIT SCAFFOLD GATE` | Sprint 56 | **Removed** |
| Duplicate weak/strong exemplar sets | Preamble + cognition modules | Single SSOT exemplar set | Sprint 56 | **Removed** |
| `self_explanation_prompt` 25–80 range | OUTPUT CONTRACT + lib baseline | SSOT 35–80 | Sprint 56 | **Removed** |
| `transfer_or_application_task` 30–70 duplicate | OUTPUT CONTRACT | SSOT 35–80 | Sprint 56 | **Removed** |
| LD-SELF-DIRECTED-RHETORIC DLA rider | `applyLdSelfDirectedRhetoricContractToDraft` (DLA) | SSOT header + thin OUTPUT CONTRACT | Sprint 56 | **Removed** from DLA path |

---

## Retained (orthogonal — not deprecated)

| Block | Reason |
|-------|--------|
| `LD-TABLE-FIDELITY` | Table spec shape — orthogonal to scaffold |
| `LD-MATH-RENDER` | Math notation — orthogonal |
| Domain-pack obligation population | Base template — out of SSOT scope |
| Self-directed activity JSON example | Sole structural exemplar — retained once |
| Material shape + timeline blocks | Spec authoring — orthogonal |

---

## Lifecycle notes

- **Deprecated** lib modules (`ld-activity-preamble-exposition.js`, `ld-cognition-orientation.js`) remain in repo for evaluator/tests; DLA prompt path must not emit full blocks.
- **Soak period:** deprecated markers may be removed from codebase after one sprint unless still referenced by non-DLA steps.
- **Design Page / GAM:** rhetoric and compose contracts unchanged in DLA-05; separate rationalisation planned (DP-*, GAM-*).

---

## Active deprecations (Sprint 56C Wave 1 — Design Page CP-4 migration)

**Authority:** [CP-4 Approval Brief](../sprints/2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) · [Wave 1 Cleanup Analysis](../sprints/2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-WAVE-1-ARCHITECTURE-CLEANUP-ANALYSIS.md)

| Removed responsibility | Marker / emitter | Governing decision | Removal phase | Replacement / relocation | Validation evidence |
|------------------------|------------------|--------------------|---------------|--------------------------|---------------------|
| Design Page journey assimilation injection | `LD-JOURNEY-ASSIMILATION-CONTRACT` via `applyLdJourneyAssimilationContractToDraft` on DP path | CP-4 D2 · Assembly-Time Ownership | Wave 1 Phase 1 | Upstream DLA/sequence ownership; transport on compose | `sprint-56c-wave1-phase1-gates.test.js` · `workflow-learner-page-journey-assimilation.test.js` (56C) |
| Design Page authorial exposition injection | `LD-AUTHORIAL-EXPOSITION-CONTRACT` via `applyLdAuthorialExpositionContractToDraft` on DP path | CP-4 D2 · Preservation First | Wave 1 Phase 1 | Upstream field authoring; compose preservation | `sprint-56c-wave1-phase1-gates.test.js` · `workflow-learner-page-authorial-exposition.test.js` (56C) |
| Design Page wrapper rhetoric injection | `LD-SELF-DIRECTED-RHETORIC` design_page rider via runtime augment | CP-4 D3 · R-43/R-49/R-51 | Wave 1 Phase 1 | DLA/GAM rhetoric paths unchanged | `sprint-56c-wave1-phase1-gates.test.js` · `ld-self-directed-rhetoric.test.js` (56C) |
| Design Page EQF augmentation | `EDUCATIONAL-QUALITY-FRAMEWORK` on `step_design_page` | CP-4 · DP transport-only | Wave 1 Phase 1 | EQF retained on DLA, sequence, GAM, assessment | `sprint-56c-wave1-phase1-gates.test.js` · `workflow-educational-quality-framework-prompt.test.js` (56C) |
| Design Page generative VA | Sprint 38 VA authoring contract on DP prompt + post-compose emission | OQ-13–16 · CP-4 D5 | Wave 1 Phase 3 | Renderer inference default; transport upstream VA if present | `sprint-56c-wave1-phase3-va-gates.test.js` |
| DP knowledge_summary / study_tips synthesis mandates | Compose contract authorable list · domain template | OQ-17 transport-or-omit | Wave 1 Phase 2A/2B | Transport slots; omit when absent upstream | `sprint-56c-wave1-phase2a-gates.test.js` · `sprint-56c-wave1-phase2b-gates.test.js` |
| DP brevity content-shaping params | `tone_style`, `depth_level`, `output_density` on `step_design_page` | CP-4 R-78–R-80 | Wave 1 Phase 2B | Profile detached via `filterDesignPageBrevityRefinementProfile` | `sprint-56c-wave1-phase2b-gates.test.js` |
| Mandatory `source_basis` on default DP path | Compose materials bridge | OQ-15 | Wave 1 Phase 2A | Removed from default transport obligations | `sprint-56c-wave1-phase2a-gates.test.js` |

**Lib soak (evaluator/tests only — not emitted on Design Page path):** `ld-journey-assimilation.js`, `ld-authorial-exposition.js`, `ld-self-directed-rhetoric.js` (design_page role), `educational-quality-framework-prompt.js` (design_page manifestation lines), `sprint38-visual-affordances.js` direct API.

---

## Superseded / retired (Sprint 56C Wave 2 — Design Page boundary refactor)

**Authority:** [Thin Bridge Definition](../sprints/2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-WAVE-2-THIN-ASSEMBLY-COHERENCE-BRIDGE-DEFINITION.md) · [Wave 2 Governance Closure Report](../sprints/2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-WAVE-2-GOVERNANCE-CLOSURE-REPORT.md)

| Retired authority / wording | Former locus | Superseded by | Wave 2 phase | Validation evidence |
| --------------------------- | ------------ | ------------- | ------------ | ------------------- |
| R-40 label-only assembly-coherence (`thin assembly-coherence only (R-40)` in compose) | `FIELD_AUTHORIZING_LINES` · `ld-materials-copy.js` transport slots | `LD-THIN-ASSEMBLY-COHERENCE-CONTRACT` SSOT + runtime inject | W2.3C | `sprint-56c-wave2-gates.test.js` · `ld-design-page-compose-contract.test.js` |
| R-44 / R-45 / R-47 as separate DP authorial modules | `ld-authorial-exposition.js` · `ld-journey-assimilation.js` (lib soak — never on DP path) | Merged constraints in thin bridge contract | W2.3A + W2.3C | `ld-thin-assembly-coherence.test.js` · `sprint-56c-wave2-gates.test.js` |
| Duplicate assembly-coherence procedural text in compose/materials | Inline R-40 mandates across compose + materials | Pointer-only cross-refs to thin bridge SSOT | W2.3C | `ld-materials-copy.test.js` (W2.3C) |
| Ambiguous “readable page” optimise mandate | Domain §13 Purpose · Task line · `what_this_step_does` | R-83 narrowed Layer 2 delimiter guardrail | W2.5 | `sprint-56c-wave2-gates.test.js` (W2.5) · `sprint-56c-wave1-phase2b-gates.test.js` |
| Legacy “Readable page assembly applies to…” materials wording | `ld-materials-copy.js` PRESERVE role | `READABLE ASSEMBLY (R-83 guardrail)` structural delimiter | W2.5 | `ld-materials-copy.test.js` (W2.5) |

**Retained on DP path (Wave 2):** `LD-DESIGN-PAGE-COMPOSE-CONTRACT` (transport/preservation), `LD-THIN-ASSEMBLY-COHERENCE-CONTRACT` (sole Layer 3 generative prose), R-83 guardrail (non-generative delimiter via compose + domain).

**Lib soak unchanged:** `ld-authorial-exposition.js`, `ld-journey-assimilation.js` remain in repo for evaluators; DP path must not reinject.

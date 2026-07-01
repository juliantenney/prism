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

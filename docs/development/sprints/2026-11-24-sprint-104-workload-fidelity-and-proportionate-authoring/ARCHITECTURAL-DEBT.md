# Sprint 104 — Architectural defects and risks (carry-in & 104A findings)

**Sprint status:** **OPEN — S104-D02 AGREED; MILESTONE 1 IN PROGRESS**  
**Baseline:** `1515cd4` (`104A` committed at `f3bb47d`)  
**Resolution map:** See [S104-D02](decisions.md#s104-d02--architectural-agreement-principles-a-e-and-separately-gated-milestones) and [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md).

---

## Proportionality & pipeline defects tracked across Milestones 1–5

| ID | Location | Finding | Target Milestone & State |
| -- | -------- | ------- | ------------------------ |
| **S104-AD-001** | `lib/learning-journey-sibling-prompts.js`, `lib/learning-journey-design-page.js`, `lib/first-class-commission-intake.js`, `lib/first-class-workflow-family.js`, `app.js` | Authoritative component duration existed only in `specification_text` prose (`Approximate learner time`); intake and `deliverySeed` omitted structured duration, leaving `resolvedFactors.duration_minutes` `undefined`, `resolveEffectiveWorkflowDurationMinutes` `null`, `"Duration"` absent from `AUTHORITATIVE WORKFLOW PARAMETERS`, and `appendLearningSequenceDurationComplianceErrors` bypassed across commissioned products. (Extends `S100-AD-006`.) | **Milestone 1** (active — structured origin + lossless transport without prose fallback) |
| **S104-AD-002** | `lib/episode-plan-v1-templates.js` (`deriveEpisodePlansFromLearningOutcomes`), `app.js` (`deriveDesignEpisodePlanCaptureJson`, `applyEpisodePlanCaptureCanonicalEnforcement`) | `step_design_episode_plan` runs in `deterministic_derive` and ignores duration and product context, forcing 1 LO → 1 full 12–15 beat Interactive Activity (`ARCHETYPE_TEMPLATES`). | **Milestone 2** (gated — move Practice EP to AI-authored, deterministically validated design authority) |
| **S104-AD-003** | `lib/episode-plan-population-contract.js`, `lib/episode-plan-dla-integration.js`, `lib/ld-practice-presentation-contracts.js`, `domain-learning-design-step-patterns.md` | DLA is strictly population-locked to EP beats and `ld-practice-presentation-contracts.js` prescribes a full control-led justification stack regardless of selected pedagogical design. | **Milestone 3** (gated — conditional DLA obligations fulfilling EP design) |
| **S104-AD-004** | `lib/guided-review-generation-contract.js:285–307`, `lib/ld-gam-page-enrich-contract.js:56–61`, `lib/episode-plan-population-contract.js:115` | Unconditional GAM contract mandates `"3–4 criteria"` (`< 3 = FAIL`), overriding Practice guidance and forcing 6+ diagnostic criteria across multi-activity pages. | **Milestone 3** (gated — conditional feedback depth & criteria) |
| **S104-AD-005** | `lib/gam-canonical-assembler.js:251`, `lib/ld-gam-page-enrich-contract.js:104–106`, `lib/ld-design-page-partial-contract.js` | Unconditional `S78-D04` closure, depth contract, `knowledge_summary`, and `editorial_opening_image` requirements impose inherited Interactive editorial prescriptions on Practice. | **Milestone 3** (gated — make editorial furniture optional for Practice; remove redundant prescriptions) |
| **S104-AD-006** | `lib/learning-journey-sibling-prompts.js` | Journey commissioning distributes insufficient guidance across components (repeated functions, familiar evidence reuse, complete workload including feedback, Journal discipline, surfacing infeasibility). | **Milestone 4** (gated — proportionate journey commissioning) |
| **S104-AD-007** | `lib/learning-journey-workload-feasibility-adapter.js:182–186` | Operator-precedence bug `(regex && product === "interactive") || product === "practice"` unconditionally classifies every Practice commission as `"mathematical_problem"` (`10–18 min` floor). Also reads prose instead of structured `allocated_minutes`. | **Milestone 5** (gated — workload estimation fixes) |
| **S104-AD-008** | `lib/workload-feasibility-estimator.js`, `lib/interactive-workload-feasibility-adapter.js` | Silent `warnings: []` when activity `duration_minutes` is absent (proven on `C01`), no cumulative check vs authoritative duration, blind to datasets/decisions/checklists/feedback engagement, and weak familiar vs new / optional vs expected separation. | **Milestone 5** (gated — cumulative advisory feasibility estimation) |

---

## Excluded / protected boundaries (do not pull into Sprint 104)

- **PB-S-008** (86 pre-existing full-suite test failures recorded in [PB-S-008-full-suite-failure-baseline-2026-11-24.md](../../../development/governance/PB-S-008-full-suite-failure-baseline-2026-11-24.md)) — explicitly **out of scope**.
- **PB-FA-018** (shared statistical visualisation architecture), **new interaction types**, **snapshot persistence**, **general renderer refactoring**, **new pedagogical capabilities**, and **automatic changes to authoritative durations** — explicitly **excluded non-goals**.
- **Pre-intervention Economics baseline** — retain existing journey and captures untouched.

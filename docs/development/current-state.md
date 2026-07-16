# PRISM Current State

## Strategic Position

PRISM is in a **v1.0 stabilisation and rationalisation** phase focused on architectural clarity, continuity, and reduction of conceptual drift—not open-ended feature expansion.

## Strongest Current Capabilities

- Prompt Studio for structured prompt refinement
- Prompt Library for reusable prompt storage and management
- Manual Workflow Builder and step-by-step workflow execution
- Utilities pipeline for HTML-oriented rendering and export
- Domain-pack constrained workflow context loading

## Current Consolidation Priorities

- preserve runtime and manifest path stability
- keep architecture and filesystem structure coherent
- maintain explicit workflow semantics and artefact contracts
- improve continuity documentation and check-in discipline
- archive legacy content rather than deleting

## Focus and Scope Notes

- workflow generation rationalisation **review** (Sprint 07) is **documented**; **brief and planning semantics alignment** (Sprint 08) is **complete (planning documentation)** — see `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md` (closure summary and **not approved** implementation-candidate table); **Sprint 09** — **closed** (2026-05-12): **bounded**, **semantics-first**, **compatibility-preserving** Pass 1 on **`3d88600`** + **governance / contract boundary** on **`4b9f5ca`**; formal closure `docs/consolidation/sprint-09-pass-1-closure.md`; charter + audit `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`; **Sprint 10** — **bootstrap contract audit and governance synthesis** **complete and committed** on **`3bd6d10`** — **canonical** audit artefact `docs/consolidation/sprint-10-contract-audit.md` (**documentation only**; **no** implementation charter); Sprint 09 **contract-boundary governance** **unchanged**
- domain-pack **rewrite** remains out of scope until explicitly scoped; Sprint 08 **did not** target domain-pack overhaul (**documentation-only**); same boundary applies until a sprint explicitly rescopes it
- tidy-up/governance phase is complete
- continuity workflow is now operational
- shared operational vocabulary is established
- recent documentation cleanup and archive moves are complete
- conservative artefacts naming policy is retained for stability
- consolidation sprint structure now exists under `docs/consolidation/`
- sprint transition portability now uses `docs/development/sprints/YYYY-MM-DD-sprint-name/`
- backlog system now exists under `docs/backlog/`
- manual workflow builder and definition foundations are stabilised; **Sprint 07** captured workflow-generation rationalisation in **review documentation**; **Sprint 08** completed **planning and brief semantics alignment** (audit, classification, boundary and assessment/sequencing notes, consolidation closure—**documentation only**; outputs are **planning foundations**, not approved implementation); **Sprint 09** — **closed** (Pass 1 **`3d88600`**, governance **`4b9f5ca`**, closure note **`sprint-09-pass-1-closure.md`**); **workflow-generation contract surface** documented as outside Sprint 09 scope — see closure note and Sprint 09 canonical **Sprint 09 governance**
- Prompt Studio consolidation model is now explicit:
  - brief state = user-authored refinement inputs/parameters
  - runtime refinement session state = transient conversational refinement lifecycle
  - prompt asset state = durable Prompt Library entity
- workflow prompt context is treated as a secondary/future consideration in Sprint 01, not a driver of current Prompt Studio design

## Next Active Focus

### No active investigation sprint

Sprint 64 is **closed** (Outcome C). No successor sprint was opened. A future production-readiness **investigation** (frequency / value / retention) is recommended only — see [sprint-64-final-recommendation.md](sprints/2026-07-16-sprint-64-cognitive-structure-preservation-investigation/sprint-64-final-recommendation.md). Do **not** treat that recommendation as implementation authorisation.

### Closed — Sprint 64 — Cognitive Structure Preservation Investigation (**Closed / Outcome C**, 2026-07-16)

**Portable pack:** [`sprints/2026-07-16-sprint-64-cognitive-structure-preservation-investigation/`](sprints/2026-07-16-sprint-64-cognitive-structure-preservation-investigation/)  
**Canonical charter:** [`docs/sprints/sprint-64-cognitive-structure-preservation-investigation.md`](../sprints/sprint-64-cognitive-structure-preservation-investigation.md)

| Entry | Path |
|-------|------|
| **Final recommendation** | [`sprint-64-final-recommendation.md`](sprints/2026-07-16-sprint-64-cognitive-structure-preservation-investigation/sprint-64-final-recommendation.md) |
| **Sprint summary** | [`sprint-summary.md`](sprints/2026-07-16-sprint-64-cognitive-structure-preservation-investigation/sprint-summary.md) |
| **START HERE** | [`SPRINT-64-START-HERE.md`](sprints/2026-07-16-sprint-64-cognitive-structure-preservation-investigation/SPRINT-64-START-HERE.md) |
| **Prototype** | [`bounded-prototype-ephemeral-verbatim-envelope.md`](sprints/2026-07-16-sprint-64-cognitive-structure-preservation-investigation/bounded-prototype-ephemeral-verbatim-envelope.md) |

**Outcome:** Architecture + experimental feasibility established for path-gated ephemeral verbatim manifestation. Production implementation **not** justified. Future production-readiness investigation recommended only (not started).

### Closed — Sprint 63 — Cognitive Flow & Reasoning Visibility (**Closed / Outcome A**, 2026-07-16)

**Portable pack:** [`sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/`](sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/)  
**Canonical charter:** [`docs/sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md`](../sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md)

| Entry | Path |
|-------|------|
| **Close-out** | [`sprint-63-closeout.md`](sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/sprint-63-closeout.md) |
| **Authoritative findings** | [`sprint-63-authoritative-findings.md`](sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/sprint-63-authoritative-findings.md) |
| **Final validation** | [`cognitive-structure-final-validation.md`](sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/cognitive-structure-final-validation.md) |
| **Synthesis** | [`cognitive-structure-preservation-and-manifestation-synthesis.md`](sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/cognitive-structure-preservation-and-manifestation-synthesis.md) |

**Outcome:** Discovery + validation complete. Architecture investigation justified; schema redesign and production implementation **not** approved.

### Closed — Sprint 62 — Coherent Renderer Pass (**Closed PASS**, 2026-07-16)

**Portable pack:** [`sprints/2026-07-16-sprint-62-coherent-renderer-pass/`](sprints/2026-07-16-sprint-62-coherent-renderer-pass/)

| Entry | Path |
|-------|------|
| **Closure** | [`SPRINT-62-CLOSURE.md`](sprints/2026-07-16-sprint-62-coherent-renderer-pass/SPRINT-62-CLOSURE.md) |
| **Presentation slice** | [`learner-journey-presentation-slice.md`](sprints/2026-07-16-sprint-62-coherent-renderer-pass/learner-journey-presentation-slice.md) |
| **Charter** | [`SPRINT-62-CHARTER.md`](sprints/2026-07-16-sprint-62-coherent-renderer-pass/SPRINT-62-CHARTER.md) |

**Outcome:** Renderer correctness + minimum learner-journey presentation slice complete within hard boundary (no invented instructional meaning; no DLA/GAM/schema changes).

### Closed — Sprint 59 / 60 / 61 / 62

| Sprint | Outcome | Closure |
| ------ | ------- | ------- |
| **59** | Priority-1 MVP transfer PASS (mechanism · process · mental model) | [SPRINT-59-CLOSURE.md](sprints/2026-07-14-sprint-59-instructional-content-richness-audit/SPRINT-59-CLOSURE.md) |
| **60** | Production SoT + `__PRISM_FINAL_GAM_PROMPT.archetype_delivery` + mixed-archetype acceptance PASS | [SPRINT-60-CLOSURE.md](sprints/2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CLOSURE.md) |
| **61** | Priority-1 selection-reliability docs/process complete + `evaluation_judgement` shipped + evaluative worked-example refinement + 99/99 tests | [SPRINT-61-CLOSURE.md](sprints/2026-07-15-sprint-61-priority-1-archetype-selection-reliability/SPRINT-61-CLOSURE.md) |
| **62** | Renderer correctness + learner-journey presentation PASS; A2 acceptance; A6 boundary documented | [SPRINT-62-CLOSURE.md](sprints/2026-07-16-sprint-62-coherent-renderer-pass/SPRINT-62-CLOSURE.md) |

**Locked facts:** Production SoT = `required_materials[].instructional_archetype` + `archetype_plan`. Delivery gate: do not evaluate archetype quality until `archetype_delivery.pass` is true. `evaluation_judgement` is part of the production Priority-1 set (`SCRIPT_VERSION` `20260715-e01w`). Sprint 62 may reorganise/relabel/deduplicate existing meaning only — no invented instructional meaning.

**Non-goals (Sprint 64 closed):** Schema redesign; production propagation/merge; renderer rewrite; inventing instructional meaning; reopening settled Sprint 63/64 conclusions without contradictory evidence.

---

### Sprint 30 — Pedagogic Enrichment Layer (PEL) (**historical note**, initialised 2026-05-21; superseded as active focus)


**Portable pack:** [`sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/`](sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/)

| Entry | Path |
|-------|------|
| **Handover (new chat)** | [`HANDOVER.md`](sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/HANDOVER.md) |
| **Charter** | [`sprint-30-charter.md`](sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/sprint-30-charter.md) |
| **Current state** | [`CURRENT-STATE.md`](sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/CURRENT-STATE.md) |
| **PEC registry** | [`pec-registry.md`](sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/pec-registry.md) |
| **Slice 30-1** | [`slice-30-1-charter.md`](sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/slice-30-1-charter.md) |
| **Context files** | [`context-files/`](sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/) |
| **Probe catalogue** | [`workflow-probe-catalogue.md`](sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/workflow-probe-catalogue.md) |
| **Evidence matrix** | [`enrichment-evidence-matrix.md`](sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/enrichment-evidence-matrix.md) |
| Short pointer | [`sprint-30-pedagogic-enrichment-layer.md`](sprint-30-pedagogic-enrichment-layer.md) |

**Intent:** Deepen **pedagogic richness** of **self-directed learner-page** outputs via **Pedagogic Enrichment Contracts (PECs)** on DLA / GAM / Design Page — not new workflow steps.

**Architectural constraints:** **No new workflow steps.** **No** adaptive tutoring. **No** orchestration redesign. **No** Sprint 29 renderer reopen. Renderer **passive**. Preserve self-directed / learner-resource brief direction.

**Status:** **30-0 complete** (full handover pack + context files). **30-1** not started.

**Test baseline:** **430** passing — [`context-files/baseline-test-floor.md`](sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/baseline-test-floor.md)

---

### Marx self-study design-quality hotfix (**applied**, 2026-05-21)

**Investigation:** [`hotfix-marx-self-study-design-quality-investigation.md`](hotfix-marx-self-study-design-quality-investigation.md)

**Outcome:** Bounded DLA prompt scaffold in `applyPedagogicCognitionContractScaffoldToDraft` steers self-directed learner-page activity design toward integrated scaffolds, orient-before-compare, staged concept application, and capped checklists—without renderer, Design Page, GAM, or workflow-step changes.

**Tests:** `tests/utility-marx-self-study-design-quality.test.js` (renderer fidelity + DLA scaffold guards).

**Test floor:** **371** passing.

---

### Assessment item-count elicitation hotfix (**applied**, 2026-05-21)

**Outcome:** Post-generation assessment elicitation no longer asks “How many assessment items…” when `assessment_total_items`, brief-stated counts, `number_of_items` / `total_items`, or mapped Generate Assessment Items settings already supply a count. Vague briefs (pack default only) may still ask.

**Tests:** `tests/workflow-ld-assessment-item-count.test.js` (Marx 10-question + vague-count scenarios).

**Test floor:** **376** passing.

---

### Self-directed activity framing hotfix (**applied**, 2026-05-21)

**Doc:** [`hotfix-self-directed-activity-framing.md`](hotfix-self-directed-activity-framing.md)

**Outcome:** DLA scaffold requests concise `activity_preamble` and optional cognition-orientation fields on self-directed learner-page activities; renderer shows preambles before “What to do” and renders self-study cognition fields when generated.

**Tests:** `tests/utility-self-directed-activity-framing.test.js`, `tests/workflow-self-directed-activity-framing-adoption.test.js`

**Adoption fix (2026-05-21, strengthened):** Domain DLA/Design Page Output bullets aligned with runtime OUTPUT CONTRACT + JSON example; Output-section pointer; goal-text gate fallback when `delivery_context` unset; merge on compose without cognition pack. **Runtime fix:** `resolveStepPromptText` / `buildWorkflowStepInstructions` now apply the same augmentations as Prompt Factory prefill (library/local prompts were previously un-augmented at run time). See `hotfix-self-directed-activity-framing-adoption.md`.

**Test floor:** **389** passing (after adoption tests).

---

### Brief learner-resource defaults hotfix (**complete**, 2026-05-21)

**Doc:** [`hotfix-brief-learner-resource-defaults.md`](hotfix-brief-learner-resource-defaults.md)

**Outcome:** Self-study / transcript / learner-page briefs resolve to `self_directed` + `async` + `mostly_online` (not `face_to_face` / `classroom`); facilitated workshop briefs keep in-person/classroom defaults; placeholder topics like “the uploaded transcript” yield source-derived subjects when available.

**Tests:** `tests/workflow-brief-learner-resource-defaults.test.js`

**Test floor:** **430** passing.

---

### Self-directed learner-page formatting hotfix (**complete**, 2026-05-21)

**Doc:** [`hotfix-self-directed-learner-page-formatting.md`](hotfix-self-directed-learner-page-formatting.md)

**Outcome:** Learning Purpose list items no longer show literal `- ` prefixes (renderer normalisation); GAM prompts require adequate table rows and substantial readings for self-directed pages; generic material headings (`Text`, `Support Text`, …) suppress when a clearer inner title exists.

**Timeline ordering (2026-05-21):** DLA/GAM **timeline sequencing alignment** scaffold — when `learner_task` requires chronological ordering, source event lists must be mixed/non-chronological; interpretation tasks may use chronological reference text. See [`hotfix-marx-self-study-design-quality-investigation.md`](hotfix-marx-self-study-design-quality-investigation.md).

**Tests:** `tests/workflow-self-directed-learner-page-formatting.test.js`

**Test floor:** **430** passing.

---

### Assessment step assembly hotfix (**complete**, 2026-05-21)

**Doc:** [`hotfix-assessment-step-assembly.md`](hotfix-assessment-step-assembly.md)

**Outcome:** Resolved `assessment_required` / `assessment_total_items` again produce **Generate Assessment Items** on self-directed learner-page workflows; page trigger excludes no longer drop assessment when the brief requires it.

**Tests:** `tests/workflow-assessment-step-assembly.test.js`

**Test floor:** **402** passing.

---

### Renderer kitchen-sink stabilisation (**complete**, 2026-05-21)

**Doc:** [`hotfix-renderer-kitchen-sink-stabilisation.md`](hotfix-renderer-kitchen-sink-stabilisation.md)

**Outcome:** Extended synthetic kitchen-sink fixture and renderer fixes for template tables, text-like material objects, generic heading suppression, assessment explanation leakage, and list-marker normalisation in template bullets.

**Tests:** `tests/utility-renderer-kitchen-sink.test.js` (32 tests)

**Test floor:** **430** passing.

---

### Workflow brief pedagogic precedence (**complete**, 2026-05-21)

**Investigation:** [`workflow-brief-pedagogic-precedence-investigation.md`](workflow-brief-pedagogic-precedence-investigation.md)

**Outcome:** Clinical-reasoning-lab–style briefs no longer default to assessment-page profile, MCQ-only type, or 10-item counts when seminar/dialogic cognition is primary; assessment-first briefs still resolve correctly. Change is **resolver-only** in `app.js` (`reconcileWorkflowBriefPedagogicFactors` + extract/inference tweaks).

**Tests:** `tests/workflow-ld-clinical-reasoning-lab-resolver.test.js` + existing Pass 1 pins.

**Test floor:** **358** passing.

---

### Sprint 29 — Renderer cognition semantics (**closed**, 2026-05-21)

**Portable pack:** [`docs/development/sprints/2026-05-21-sprint-29-renderer-cognition-semantics/`](sprints/2026-05-21-sprint-29-renderer-cognition-semantics/)

| Entry | Path |
|-------|------|
| Closure | [`sprint-29-closure.md`](sprints/2026-05-21-sprint-29-renderer-cognition-semantics/sprint-29-closure.md) |
| Index | [`sprint-29-index.md`](sprints/2026-05-21-sprint-29-renderer-cognition-semantics/sprint-29-index.md) |
| Handover | [`HANDOVER.md`](sprints/2026-05-21-sprint-29-renderer-cognition-semantics/HANDOVER.md) |

**Outcome:** Top-level activity-row cognition fields render as `util-cognition*` semantic blocks (29-2). HTML audit complete (29-1). Workflow, generation, composition, and assessment rendering unchanged.

**Residual:** Cognition inside `task_cards` markdown stays generic; row promotion is composition scope (Sprint 28).

**Test floor:** **355** passing (superseded by brief-precedence fix floor **358**).

---

### Sprint 28 — Pedagogic richness & cognitive engagement architecture (**closed**, 2026-05-21)

**Portable pack:** [`docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/`](sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/)

| Entry | Path |
|-------|------|
| Index | [`sprint-28-index.md`](sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-index.md) |
| Charter | [`sprint-28-charter.md`](sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-charter.md) |
| Handover | [`HANDOVER.md`](sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/HANDOVER.md) |
| Evidence matrix | [`pedagogic-richness-evidence-matrix.md`](sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/pedagogic-richness-evidence-matrix.md) |
| Implementation charter | [`slice-28-4-charter.md`](sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/slice-28-4-charter.md) (**draft**) |

**Status:** **Closed** after post-5d live validation (P28-01/02/07). Closure: [`sprint-28-closure.md`](sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-closure.md).

**Delivered:** 28-5a factors/packs → 28-5b topology → 28-5c DLA/GAM contracts → 28-5d composition parity. **350** tests; Sprint 27 assessment semantics preserved.

**28-5e (harness automation):** **Deferred.** Recommended next work: new thematic track (renderer/illustration) or optional governance slice — not further cognition ontology without a new charter.

**Verification floor:** `node --test tests/*.test.js` → **332 passed**.

---

### Sprint 27 — Assessment & feedback elicitation semantics (**complete / stabilised**, 2026-05-21)

**Portable pack:** [`docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/`](sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/)

| Entry | Path |
|-------|------|
| Index | [`sprint-27-index.md`](sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/sprint-27-index.md) |
| Charter | [`sprint-27-charter.md`](sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/sprint-27-charter.md) |
| Handover | [`HANDOVER.md`](sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/HANDOVER.md) |
| Evidence matrix | [`elicitation-evidence-matrix.md`](sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/elicitation-evidence-matrix.md) |

**Scope:** Assessment/feedback **elicitation semantics** (E → O → G → C → R). **Investigation complete** (27-1–27-3). **Implementation complete** (27-4a–4f): [`slice-27-4-charter.md`](sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/slice-27-4-charter.md), [`CURRENT-STATE.md`](sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/CURRENT-STATE.md).

**Stabilisation (post–27-4f):** Epistemic grounding (facilitator notes ≠ provided source); Design Feedback ordering; assessment item-count extraction; negative assessment intent; post-Sprint-27 observation harness.

**Key question (answered for assessment path):** How does PRISM model and preserve pedagogical assessment intent — not merely whether it can generate MCQs?

**Verification floor:** `node --test tests/*.test.js` → **311 passed**.

---

### Sprint 26 — Pedagogical intent & workflow topology (**closed**, 2026-05-20)

**Portable pack:** [`docs/development/sprints/2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/`](sprints/2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/)

| Entry | Path |
|-------|------|
| Index | [`sprint-26-index.md`](sprints/2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/sprint-26-index.md) |
| Handover | [`HANDOVER.md`](sprints/2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/HANDOVER.md) |

**Outcome:** **Track A fixed** (`activities_required`, topology); **Track B closed** (assessment export render). Superseded by Sprint 27 for assessment/feedback **semantics**.

---

### Sprint 26 — Renderer presentation consolidation (**paused**, 2026-05-20)

**Portable pack:** [`docs/development/sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/`](sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/)

| Entry | Path |
|-------|------|
| Index | [`sprint-26-index.md`](sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/sprint-26-index.md) |
| Charter | [`sprint-26-charter.md`](sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/sprint-26-charter.md) |
| Sprint state | [`CURRENT-STATE.md`](sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/CURRENT-STATE.md) |
| Governance | [`renderer-governance.md`](sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/renderer-governance.md) |
| Backlog | [`renderer-refinement-backlog.md`](sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/renderer-refinement-backlog.md) |

**Scope:** Presentation-only renderer refinement (spacing, typography, material patterns, a11y, print). **Frozen:** composition contract, export authority, activity closure, `page.sections[]` semantics.

**Benchmarks:** inflation full (`ld-inflation-workshop-page-full.json`) + renderer kitchen sink (`renderer-kitchen-sink-page.json`) — see [`renderer-kitchen-sink-fixture-design.md`](sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/renderer-kitchen-sink-fixture-design.md).

**Status:** **Paused** — slices **26-2–26-5** complete; renderer structurally safe and visually polished. **Pause note:** [`sprint-26-pause-note.md`](sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/sprint-26-pause-note.md).

**Verification floor:** `node --test tests/*.test.js` → **259 passed**, 0 failed. Pre–Sprint 27 typed-materials hotfix included. Manual browser/print checks outstanding (see pause note).

---

### Completed predecessors (Sprint 25–26 programme)

- **Sprint 25 — Design Page composition and export** (**closed**, 2026-05-19): composition + export contracts implemented; live **A1–A5** validated; **229** tests. **Closeout:** [`sprint-25-closeout.md`](sprints/2026-05-19-sprint-25-design-page-composition-renderer-consolidation/sprint-25-closeout.md).

---

### Earlier completed (Sprint 23–24)

- **Sprint 23 — Learning Design pack rationalisation** (**complete**, 2026-05-18): declarative LD pack semantics; elicitation, PF/Settings ownership, Design Assessment semantics. **Closeout:** [`sprint-23-closeout.md`](sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/sprint-23-closeout.md).
- **Sprint 24 — Research pack semantic conformance** (**complete**, 2026-05-19): Research pack conforms sufficiently to Sprint 23 governance; **no LD-style remediation** required. **Index:** [`sprint-24-index.md`](sprints/2026-05-19-sprint-24-research-pack-conformance/sprint-24-index.md).

---

### Earlier sprints (reference continuity)

- **Sprint 19 — Learning Design Workflow Rationalisation** (**closed** for active focus; audit delivered 2026-05-15): `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`. Superseded as active focus by Sprints 23–25.
- **Sprint 18 — Contextual Workflow Refinement** (**closed**, 2026-05-15): `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md`.
- **Sprint 15 — Research Renderer and Page Delivery Maturity** (**prior focus; renderer/page delivery themes continue under Sprint 25**): `docs/consolidation/sprint-15-index.md`; portable pack `docs/development/sprints/2026-05-14-sprint-15-research-renderer-page-delivery-maturity/`.
- **Sprint 14 — Research Domain Runnable Maturity** (**closed baseline, 2026-05-14**): runnable Research + **Design Page** endpoint + save/export/normalisation integrity — **not** reopened as active sprint focus. **Record:** `docs/consolidation/sprint-14-index.md`, `sprint-14-current-known-issues.md` §**10** (completed work).
- **Cross-sprint architecture & portability backlog (descriptive only, not a roadmap):** [`docs/consolidation/prism-architecture-portability-backlog.md`](../consolidation/prism-architecture-portability-backlog.md) — unfinished themes after Sprint 12–13 consolidation; **no** implementation charter implied. **Sprint 14** / **Sprint 15** are linked there as **parallel product work** (§§**2.1–2.2**), **not** portability redesign.
- **Sprint 13 — first-pass is documented and closed in consolidation** (post-commit posture). **Map:** `docs/consolidation/sprint-13-index.md`. **Closure and verification:** `docs/consolidation/sprint-13-first-pass-closure.md`. **Delivered:** **S13-07** — v1 reference doc (`docs/consolidation/sprint-13-general-alwayson-first-structured-domain-behaviour.md`); **S13-01** — narrow Workflow Factory **`#wfDesignDomainSelect`** strict-parity tidy (see closure; `app.js` only). **Decision-gated / not implemented:** **S13-02** default-domain rule; **S13-03** display-only hint neutralisation — audits and gate notes are linked from the index (no implementation closure). **Sprint 12** first-pass structural observability (A–E) remains **closed** (`docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`) — **not** reopened. **No** full drop-in domain-pack portability claim in Sprint 13 first-pass artefacts. **Further Sprint 13 work remains unchartered** unless explicitly approved (no implied roadmap commitment).
- **Workflow Factory — General baseline-only (v1, post–first-pass doc alignment 2026-05-14):** **General** remains **always-on baseline** context (merged via manifest / normalisation); **Learning Design** and **Research** are the **runnable** Factory domains; **generation** requires an explicit runnable choice (general-only is blocked in Factory). **S13-01** parity matrices / runtime baselines for **`#wfDesignDomainSelect`** remain **historical** for the **2026-05-13** option list (**superseded** for ordered options and initial value). Authoritative **current** wording: **`sprint-13-general-alwayson-first-structured-domain-behaviour.md`** §**Current v1 — General baseline-only**. **Sprint 12** remains **closed**; **no** full portability claim added here.

- **Sprint 11 is closed** — closure summary: `docs/consolidation/sprint-11-closure.md`.

- **Sprint 10 — Workflow Brief Contract Rationalisation** — **bootstrap audit complete** (2026-05-12, commit **`3bd6d10`**): **canonical** `docs/consolidation/sprint-10-contract-audit.md` (inventories §§3–8 + governance synthesis §§9–12); **documentation only** — **no** implementation charter. Framing: `docs/consolidation/sprint-10-workflow-brief-contract-rationalisation-bootstrap.md`. Portable pack: `docs/development/sprints/2026-05-12-sprint-10-workflow-brief-contract-rationalisation/` (**`GPT-BOOTSTRAP-PROMPT.md`**).

- **Sprint 11 — Workflow Generation Fixture & Regression Foundations** — **closed**; completed channels and deferred items are recorded in `docs/consolidation/sprint-11-closure.md`. Deferred WGC/runtime orchestration coverage remains explicitly out of completed Sprint 11 scope.
- **Sprint 09 — Workflow Brief Semantics Alignment** — **sprint closed (2026-05-12)** — **completed**, **bounded**, **semantics-first**, **compatibility-preserving**; **governance boundary** between UI semantics alignment and **workflow-generation contract** semantics is **established** and documented. Formal closure: `docs/consolidation/sprint-09-pass-1-closure.md`. Charter + verification: `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`. Commits: **`3d88600`** (Pass 1 implementation), **`4b9f5ca`** (contract-boundary documentation). Portable pack: `docs/development/sprints/2026-05-12-sprint-09-workflow-brief-semantics-alignment-pass-1/`.
- **Deferred contract work** (`briefLines`, `extractWorkflowBriefExplicitFactors`, step-context builders, `workflowGenerationContext.js`, domain-pack contract fields, persistence/import/export contract changes) remains governed by explicit sprint/pass charters. Sprint 11 completed bounded regression foundations only; deferred WGC/runtime orchestration coverage is recorded in `docs/consolidation/sprint-11-closure.md`.
- **Sprint 12 — first-pass structural observability (Phases A–E)** is **closed** — `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md` (**bounded structural tests only**; **no** required production behavior changes for this pass). This closure **does not** complete broader Sprint 12 or deferred WGC/runtime orchestration work recorded in `docs/consolidation/sprint-11-closure.md`. **Sprint 13 first-pass** did **not** reopen Sprint 12.
- **Broader Sprint 12 / deferred orchestration** remains **future** and **explicitly chartered** only; candidate preparation context (not a blanket implementation approval): `docs/consolidation/sprint-12-candidate-prep-note.md`. Semantic contract migration remains out of scope until separately chartered.
- **Sprint 08 — Workflow Planning and Brief Semantics Alignment** — **closed (planning / documentation complete)**; canonical consolidation: `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md` (includes **Potential follow-on implementation candidates (not approved)** and historical **Recommended Sprint 09 direction**).
- Portable sprint pack (reference): `docs/development/sprints/2026-05-12-sprint-08-workflow-planning-and-brief-semantics-alignment/`
- **Sprint 07 — Workflow Generation Rationalisation Review** — **review documentation complete** (input to Sprint 08): `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`
- Prior sprint pack (reference): `docs/development/sprints/2026-05-12-sprint-07-workflow-generation-rationalisation-review/`
- **Sprint 06 documentation alignment is complete** — closure: `docs/consolidation/sprint-06-check-in-closure.md`
- Consolidation vocabulary baseline: `docs/development/shared-vocabulary.md` (validation lifecycle, prompt attachment modes, import/export narrative, step identity, continuity artefacts)

## Sprint Status Notes

- Sprint 01 - Prompt Studio Consolidation completed its first pass.
- Sprint 01 outcomes: clearer Prompt Studio semantics/state boundaries, improved refinement lifecycle and payload/display clarity, and narrow accessibility/technical-debt cleanup.
- Sprint 02 - Prompt Library Consolidation passes 1-3 completed:
  - lifecycle contract comments and helper extraction landed in `app.js` without schema/runtime redesign
  - Prompt Library lifecycle flows (new/save/delete/duplicate/use/copy/export/import) were verified stable
  - canonical durable state remains `state.prompts` + `state.selectedPromptId`; filters/list/detail/version views remain derived projections
  - preserved policy: `usageCount` increments only on Use as template; duplicate keeps historical versions and adds duplicate/save snapshots; metadata ownership remains split between handlers and `Library` persistence
- Sprint 02 Prompt Library Consolidation is completed and committed.
- Sprint 03 Workflow Runtime Consolidation (review + passes 1-2) completed:
  - clarified workflow definition vs runtime navigation semantics
  - documented and stabilized run-mode lifecycle/reset inspectability without behavior redesign
  - clarified Prompt Studio workflow hydration/save boundary semantics for step outcomes
  - improved internal input-binding chip inspectability with source-step identity display only
  - manual smoke checks confirmed workflow runtime compatibility preserved
- Sprint 03 intentionally deferred:
  - run-mode redesign/state-machine work
  - schema/storage restructuring
  - workflow generation/domain-pack redesign
  - app.js module-boundary restructuring
- Sprint 03 Workflow Runtime Consolidation is completed, continuity-updated, smoke-checked, and stabilised for check-in.
- Sprint 04 — Workflow Definition Consolidation — completed and checked in (bounded, behavior-preserving):
  - Pass 1: prompt attachment canonicalization helper extraction
  - Pass 2: UI read-path consolidation for prompt attachment state projection
  - Pass 3: canonical step identity clarification (`step.id` vs `canonical_step_id`)
  - Pass 4: validation lifecycle clarification (normalize→validate where owned; warning-only/non-mutating contract; caller-owned surfacing)
  - no schema/runtime/import/export redesign introduced
- Sprint 05 — Manual verification (post-Sprint 04) — **closed, verification-only, checked in:**
  - smoke passed: load/select/render, create/edit/save, prompt attachment modes, validation warnings non-blocking, import/export, run-mode boundary sanity
  - no regressions requiring implementation changes
  - domain-pack generated workflows use local override for unsaved/default prompt assets as expected
  - closure: `docs/consolidation/sprint-05-check-in-closure.md`
- Sprint 06 — Continuity & documentation alignment — **closed (docs-only):**
  - terminology aligned across consolidation notes, `shared-vocabulary.md`, and `development-protocol.md`
  - closure: `docs/consolidation/sprint-06-check-in-closure.md`
- Sprint 07 — Workflow Generation Rationalisation Review — **review documentation complete** (learner-facing model, planning lifecycle, pedagogic dimensions, sequencing, open questions, closing conclusion): `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`
- Sprint 08 — Workflow Planning and Brief Semantics Alignment — **closed (planning / documentation complete):**
  - field/factor audit, planning-factor classification, pre/post-synthesis boundary note, **assessment planning** and **sequencing semantics** notes, terminology consolidation, backlog-vs-decision separation, closure summary, **implementation candidates extracted (not approved)**
  - **no** source, runtime, domain-pack **content**, **renderer**, or **generation behaviour** changes under Sprint 08
  - planning foundation only: `docs/consolidation/sprint-08-workflow-planning-and-brief-semantics-alignment.md`
- Sprint 09 — Workflow Brief Semantics Alignment — **sprint closed** (2026-05-12): Pass 1 **`3d88600`** + governance **`4b9f5ca`**; **local browser smoke passed** on **`3d88600`**; **no** regressions **observed** in runtime, generation, persistence, import/export, domain-pack, renderer, assessment, or sequencing; formal closure `docs/consolidation/sprint-09-pass-1-closure.md`; charter + tables `docs/consolidation/sprint-09-workflow-brief-semantics-alignment-pass-1.md`
- Sprint 10 — Workflow Brief Contract Rationalisation — **bootstrap contract audit complete** (2026-05-12, docs commit **`3bd6d10`**): **canonical** `docs/consolidation/sprint-10-contract-audit.md` — **documentation / governance synthesis only**; **no** implementation pass chartered during bootstrap; Sprint 09 **contract surface** boundary **unchanged** (`docs/consolidation/sprint-09-pass-1-closure.md`)
- Sprint 11 — Workflow Generation Fixture & Regression Foundations — **closed**; see `docs/consolidation/sprint-11-closure.md` for completed channels, pinned baseline behaviours, and deferred WGC/runtime coverage.
- Sprint 13 — first-pass — **documented/closed in consolidation** (2026-05-13): map `docs/consolidation/sprint-13-index.md`; closure `docs/consolidation/sprint-13-first-pass-closure.md`; **delivered** S13-07 (v1 reference) + S13-01 (narrow `#wfDesignDomainSelect` parity tidy); **S13-02** / **S13-03** remain decision-gated (no implementation closure); **no** full drop-in portability claim; further Sprint 13 work **unchartered** unless explicitly approved. **Doc alignment (2026-05-14):** **General baseline-only** Workflow Factory — see `sprint-13-general-alwayson-first-structured-domain-behaviour.md` §**Current v1**; S13-01 matrices **historical** for Factory option list.
- Sprint 15 — **Research Renderer and Page Delivery Maturity** — **chartered (2026-05-14):** index `docs/consolidation/sprint-15-index.md`; charter `sprint-15-charter.md`; portable pack `docs/development/sprints/2026-05-14-sprint-15-research-renderer-page-delivery-maturity/`. **Research-first** Utilities / **`page`** path; themes carried forward under **Sprint 25** for LD composition/export.
- Sprint 14 — **Research Domain Runnable Maturity** — **baseline closed for active focus (2026-05-14):** first implementation slice + consolidation — `sprint-14-index.md`, **`sprint-14-current-known-issues.md`** §**10**; **`page`**/renderer follow-up → **Sprint 15** → **Sprint 25**.
- Sprint 23 — **Learning Design pack rationalisation** — **complete (2026-05-18):** declarative pack semantics, elicitation alignment, PF/Settings ownership, Design Assessment semantics; closeout `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/sprint-23-closeout.md`.
- Sprint 24 — **Research pack semantic conformance review** — **complete (2026-05-19):** Research conforms sufficiently to Sprint 23 governance; no LD-style remediation; `docs/development/sprints/2026-05-19-sprint-24-research-pack-conformance/sprint-24-index.md`.
- Sprint 25 — **Design Page composition and renderer consolidation** — **open (2026-05-19):** Slice **25-1** investigation/governance only (no fixes); pack `docs/development/sprints/2026-05-19-sprint-25-design-page-composition-renderer-consolidation/`; slices **25-2–25-5** proposed, **not chartered**.
- Deferred from Sprint 01 by design:
  - major `app.js` size reduction (requires later module-boundary sprint)
  - generated workflow integration decisions
  - broader UI polish

## Active Focus Areas

- **Sprint 25 — Design Page composition and renderer consolidation** (**active**): investigation-led delivery on **`page` artefact fidelity**, **export / `pageSections` integration**, and **bounded utility renderer consolidation** — [`sprint-25-index.md`](sprints/2026-05-19-sprint-25-design-page-composition-renderer-consolidation/sprint-25-index.md); Slice **25-1** investigation only
- Design Page → `page` JSON → Utilities → HTML (LD workshop path; A2 trace as anchor case)
- Utility renderer v1 presentation patterns (task cards, scenarios, materials, export fixtures)—**no broad rewrite**
- Prompt Studio, Prompt Library, Manual Workflow Builder (stable foundations)
- Declarative pack semantics (**Sprint 23** — complete) and Research conformance (**Sprint 24** — complete)
- Workflow planning / brief semantics foundations (**Sprint 08–11** — closed; historical reference in consolidation docs)

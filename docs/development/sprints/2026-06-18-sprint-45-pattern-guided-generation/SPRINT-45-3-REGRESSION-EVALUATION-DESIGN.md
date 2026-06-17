# Sprint 45.3 Regression Evaluation Design

**Date:** 2026-06-17  
**Type:** Comparative evaluation design (not execution)  
**Status:** Pre-execution design complete  
**Purpose:** Specify evaluation architecture for Sprint 45.3 under frozen D1-D3 decisions  
**Design authority:** `SPRINT-45-3-CHARTER.md` · `sprint-45-slice-index.md` · `../2026-06-15-sprint-44/sprint-45-proposal.md` · `SPRINT-45-1-CLOSURE-REVIEW.md` · `SPRINT-45-2-EXECUTION-STATUS.md` · `45-2-recommendation-i5-closure-addendum.md`

**Non-goals:** Scoring, result computation, threshold invention, scope expansion.

---

## Design Objective

Implement a design-ready comparison model that can evaluate whether the completed 45.1 generation cohort exhibits distributional and segment-level improvement relative to the frozen benchmark target-type population, while preserving cross-domain and non-target regression diagnostics.

---

## Corpus Definition

### Frozen reference population

- Source corpus: Sprint 44 frozen benchmark corpus.
- Included segment: `decision_table` + `transfer_prompt` bodies across Marx and Photosynthesis.
- Role: fixed reference population for comparative and distributional baselines.

### Corpus boundaries

- No benchmark re-freeze in 45.3.
- No expansion to new domains or unevidenced material families.
- Corpus references remain read-only.

---

## Generation Cohort Definition

- Cohort source: completed Sprint 45.1 artefacts.
- Composition: paired baseline/treatment bodies across six defined injection slots.
- Primary generation focus for 45.3: treatment bodies (with baseline bodies retained for pair-context interpretation).
- No new generation run required by design.

---

## Comparison Model

The design uses a hybrid, multi-level model:

1. **Body level:** per-artefact evaluation records.
2. **Pair level:** BL/TR slot-level interpretation (for the six 45.1 pairs).
3. **Segment level:** target-type and domain segments.
4. **Distribution level:** verdict-pattern distributions by segment.

Comparisons represented:

- 45.1 generation cohort vs frozen target-type reference population.
- Target type (`decision_table` vs `transfer_prompt`) distribution shifts.
- Domain segment behaviour (Marx vs Photosynthesis).
- Non-target regression indicator channel (type-level, per D3).

---

## Evaluation Units

Primary unit stack:

- **Individual artefact unit:** one material body record.
- **Paired artefact unit:** one BL/TR pair (only for six 45.1 slots).
- **Segment unit:** one domain-type slice (for example, Photosynthesis `transfer_prompt`).
- **Distribution unit:** verdict distribution vector within a segment.

Unit constraints:

- Holdout and corpus references are treated as fixed inputs, not newly generated units.
- Non-target unit is type-classified and not same-run-generated unless separately authorised.

---

## Metrics (Design-level)

No thresholds are declared here. Metrics are defined for collection and reporting structure only.

### Core evaluation metrics

- L1 verdict tier.
- Target FM presence/absence channel.
- Ownership pass/regression channel.
- Mimicry/superficial-match diagnostic channel.

### Comparative metrics

- Pair outcome class for six BL/TR pairs.
- Segment-level verdict distributions by target type.
- Domain-stratified verdict distributions (Marx vs Photosynthesis).
- Distribution delta descriptors between generation cohort and frozen reference population.

### Non-target metrics

- Non-target-type inventory coverage.
- Non-target-type regression indicators relative to frozen reference expectation.
- Documentation field for same-run co-generation not assessed (if out of scope).

---

## Distribution Analyses

Planned analyses (template-only):

1. Target-type verdict distribution summary for generation cohort.
2. Target-type verdict distribution summary for frozen reference population.
3. Comparative distribution table and narrative interpretation fields.
4. Pair-aware context notes to prevent distribution-only misread of BL/TR dynamics.

No computed outputs are produced in this design document.

---

## Cross-Domain Analyses

Required domain comparisons:

- Marx segment outcomes.
- Photosynthesis segment outcomes.
- Relative domain movement notes (generalisation vs overfit framing).

Cross-domain interpretation rules:

- Treat domain comparison as distributional and segmental, not single-body anecdote.
- Preserve distinction between maintain-test and remediation contexts from 45.1.

---

## Non-Target Regression Analysis

Definition used:

- Non-target = material types not subject to SP-02/SP-03 injection.

Planned non-target analysis channels:

1. Non-target inventory list.
2. Non-target data availability status.
3. Non-target regression assessment field (supported/unsupported/inconclusive) with evidence citation.
4. Explicit note field for same-run co-generation interpretation remaining out of scope unless authorised.

---

## Governance Assumptions

1. Sprint 44 remains authoritative for contracts and corpus freeze.
2. Sprint 45.1 and 45.2 outputs are consumed as fixed evidence inputs.
3. 45.3 does not amend protocol authority or historical verdict records.
4. Recommendation route options remain Proceed / Repeat / Stop.
5. Any deviation from D1-D3 requires explicit investigator rescoping before execution.

---

## Design Outputs Required

Execution-facing design outputs:

- Corpus and cohort registers.
- Body/pair/segment/distribution table templates.
- Domain comparison templates.
- Non-target regression template section.
- Recommendation-ready evidence summary structure.

---

## Design Completion Statement

Sprint 45.3 evaluation design is complete at pre-execution level and consistent with frozen D1-D3 scope, without introducing new datasets, material types, or scoring activity.


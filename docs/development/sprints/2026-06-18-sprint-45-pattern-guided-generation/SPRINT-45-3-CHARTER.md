# Sprint 45.3 Charter

**Date:** 2026-06-17  
**Type:** Research charter (design authority)  
**Status:** Proposed for execution design package; execution not started  
**Purpose:** Define the Sprint 45.3 corpus-regression study question, scope, and gate logic under frozen decisions D1-D3  
**Authority:** `sprint-45-slice-index.md` · `../2026-06-15-sprint-44/sprint-45-proposal.md` · `sprint-45-current-frontier.md` · `README.md` · `SPRINT-45-1-CLOSURE-REVIEW.md` · `45-1-evidence-workbook.md` · `SPRINT-45-2-EXECUTION-STATUS.md` · `45-2-recommendation-i5-closure-addendum.md` · `45-2-i5-closure-report.md`

**Non-goals:** Execution activity, scoring, comparative analysis, threshold setting, scope expansion.

---

## Objective

Compare the completed Sprint 45.1 generation cohort against the frozen Sprint 44 benchmark reference population for target material types (`decision_table`, `transfer_prompt`) across Marx and Photosynthesis, using standing 45.2 evaluation infrastructure, to determine whether pattern-guided generation signals generalisation without non-target regression.

---

## Research Question

Primary question:

> Does the Sprint 45.1 pattern-guided generation cohort show distributional improvement relative to the frozen benchmark reference population on target types (`decision_table`, `transfer_prompt`) across Marx and Photosynthesis, without evidence of regression on non-target material types?

Sub-questions:

1. Does verdict distribution shift on target types move toward stronger realisation profiles?
2. Is cross-domain behaviour consistent (Marx vs Photosynthesis) rather than overfit to Marx-only strong shapes?
3. Is any regression indicated on non-target material types (defined as types not subject to SP-02/SP-03 injection)?

---

## Frozen Scope

### D1 — Generation set

- Generation cohort is the completed Sprint 45.1 set.
- No new generation run is required for Sprint 45.3 design or execution start.

### D2 — Corpus scope

- Hybrid scope:
  - Generation comparison set: Sprint 45.1 cohort (paired BL/TR bodies).
  - Frozen reference population: benchmark corpus segment for `decision_table` and `transfer_prompt` across Marx and Photosynthesis.

### D3 — Non-target definition

- Non-target means material types not subject to SP-02/SP-03 injection.
- Same-run co-generation interpretation is recorded as a residual interpretation but is out of scope unless explicitly authorised.

### Included

- Two domains: Marx, Photosynthesis.
- Two target material types: `decision_table`, `transfer_prompt`.
- Distribution-level, segment-level, and body-level comparative framing.
- Governance chain from completed 45.2 closure and I5 closure addendum.

### Excluded

- New pattern families (SP-01, SP-04, SP-05, SP-06 expansion).
- New material types not already in the authoritative 45.x chain.
- New datasets or benchmark re-freeze.
- Protocol redesign or Sprint 44 contract redesign.
- Scoring/execution activity inside charter.

---

## Dependencies

Mandatory dependency chain:

1. Sprint 44 frozen corpus and contract authority.
2. Sprint 45.1 completed generation/evidence artefacts.
3. Sprint 45.2 standing evaluation closure state, including I5 closure.

Dependency assertions:

- 45.3 does not supersede 45.1 or 45.2 findings.
- 45.3 consumes prior artefacts as fixed inputs.
- 45.3 design remains inside SP-02/SP-03 target-type boundary.

---

## Success Conditions

Charter-level success (directional; no numeric thresholds set in this document):

1. A complete evidence chain exists linking generation cohort, frozen target-type reference population, and comparative outputs.
2. Comparative outputs can answer all three 45.3 research questions at the required levels:
   - target-type distribution shift,
   - cross-domain comparison,
   - non-target regression check.
3. Governance and interpretation remain consistent with frozen D1-D3 decisions and 45.2 closure state.
4. Recommendation can be made with explicit support for Proceed / Repeat / Stop routes.

---

## Failure Conditions

Charter-level failure signals:

1. Required evidence chain cannot be completed without adding unauthorised datasets or scope.
2. Comparison model cannot represent target-type distribution and cross-domain questions simultaneously.
3. Non-target regression question cannot be operationalised under D3 without undeclared scope expansion.
4. Governance inconsistency appears (for example, reopening frozen protocol/corpus decisions in 45.3).
5. Outputs are insufficient to route to Proceed / Repeat / Stop recommendation.

---

## Governance Position

- Sprint 45.2 is closed and provides route authority to instantiate 45.3 planning artefacts.
- This charter authorises only design-package structure and intended evidence channels.
- Execution must be explicitly started in execution-state artefacts; this charter does not start scoring.

---

## Charter Decision

Sprint 45.3 is chartered as a **comparative corpus-regression study on frozen inputs**, bounded by D1-D3 and the completed 45.1/45.2 evidence stack.


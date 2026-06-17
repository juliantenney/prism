# Sprint 45.3-NTX Scope Addendum

**Experiment:** 45.3-NTX Non-Target Comparator Extension  
**Type:** Scope/governance addendum (design only)  
**Status:** Drafted for approval  
**Authority:** `SPRINT-45-3-REGRESSION-EVALUATION-DESIGN.md` · `45-3-evidence-workbook.md` · `45-3-recommendation.md` · `SPRINT-45-3-EXECUTION-STATUS.md` · Sprint 44 instructional-depth contracts and frozen benchmark corpus

---

## 1) Purpose

Define the smallest valid extension needed to resolve the remaining Sprint 45.3 non-target regression blocker through a bounded comparator channel, without altering completed 45.3 history or recommendation records.

## 2) Research Question

Under frozen D1-D3 constraints, do sampled D3 non-target material bodies show regression versus frozen Sprint 44 non-target reference expectations when observed in a minimal treatment-era comparator extension?

## 3) Scope

- Design and execute a minimal non-target comparator extension only.
- Use existing contract authority and frozen corpus references only.
- Add extension evidence through new extension artefacts only.
- Keep all base Sprint 45.3 artefacts unchanged.

## 4) Non-Goals

- No re-execution of base 45.3 phases.
- No re-opening or rewriting of base 45.3 recommendation.
- No extension of target-type SP-02/SP-03 study scope.
- No contract redesign, pattern-library redesign, or new authority creation.
- No generation beyond the minimum non-target comparator need.

## 5) D3 Relationship

D3 remains frozen and controlling:

- Non-target = material types not subject to SP-02/SP-03 injection.
- Same-run co-generation interpretation remains out of scope unless separately authorised.

NTX operationalises D3 by adding direct non-target comparator evidence; it does not reinterpret D3.

## 6) Selected Non-Target Material Types

Minimum selected set (bounded and contract-backed):

- `text` (cross-domain)
- `worked_example` (cross-domain)
- `checklist` (single-domain cross-check lane, default Photosynthesis)

Rationale: smallest mixed set with established Sprint 44 contract/evidence anchors and known historical variance sensitivity.

## 7) Domains

- Marx
- Photosynthesis

Cross-domain inclusion is required for `text` and `worked_example`; `checklist` is minimum one-domain cross-check unless governance requests full cross-domain expansion.

## 8) Comparator Structure

### Treatment-Era Comparator

Extension-captured non-target bodies generated under a minimal treatment-era condition aligned to 45.x run context, without adding non-target pattern injection objectives.

### Frozen Reference Comparator

Matched Sprint 44 frozen non-target bodies for the same domain/activity/material-type obligations.

### Baseline/Control Requirement

Not required for minimum NTX closure if frozen matched reference is available and comparator mapping is obligation-matched. A baseline/control arm is optional escalation only when first-pass evidence remains ambiguous.

## 9) Minimum Evidence Package

Required artefacts/evidence records:

1. Comparator register (reference ID to extension ID mapping).
2. Extension body files for sampled non-target slots.
3. Body-level evaluation records with:
   - contract section anchor,
   - L1 verdict,
   - relevant FM channel fields,
   - ownership pass/regression field,
   - mimicry/superficial-match field,
   - regression indicator (`none` / `possible` / `confirmed` / `inconclusive`),
   - provenance citations.
4. Type-level and overall non-target regression rollup with sufficiency state and uncertainty statement.

## 10) Evaluation Authority

- Normative authority: Sprint 44 instructional-depth contracts (existing accepted authority).
- Frozen comparator authority: Sprint 44 benchmark corpus.
- Method framing continuity: Sprint 45 evaluation stack conventions (verdict-first, FM/ownership channels, explicit boundary declaration when needed).

Non-target types are evaluated against their own contract sections (not SP-02/SP-03 detection signals).

## 11) Success / Repeat / Stop Conditions

### Success (closes non-target blocker)

- Minimum sample completed with provenance-complete body-level records.
- Evidence sufficiency marked adequate for bounded judgement.
- No confirmed non-target regression signal across sampled comparator lanes.

### Repeat

- Evidence collected but insufficiency remains due bounded sample ambiguity, unresolved boundary condition, or mapping gaps.
- Triggered action: one-step bounded sample expansion only.

### Stop/Redesign

- Confirmed non-target regression with reproducible comparator evidence, or
- Comparator mapping cannot be made valid under frozen scope/governance.

## 12) Execution Phases (NTX-0 to NTX-5)

### NTX-0 — Prerequisite Lock

- Confirm D1-D3 continuity, selected type/domain set, and slot-mapping rules.

### NTX-1 — Comparator Register

- Build reference-to-extension mapping table for sampled non-target slots.

### NTX-2 — Minimal Comparator Capture

- Capture extension-era non-target bodies for mapped slots only.

### NTX-3 — Body-Level Evaluation Population

- Populate verdict/FM/ownership/mimicry/regression fields with citations.

### NTX-4 — Non-Target Regression Determination

- Produce type-level and aggregate non-target judgement with sufficiency state.

### NTX-5 — Extension Closeout Addenda

- Publish evidence report and recommendation addendum (without rewriting base recommendation).

## 13) Artefacts to Create

- `45-3-ntx-scope-addendum.md` (this file)
- `45-3-ntx-comparator-workbook.md`
- `45-3-ntx-evidence-report.md`
- `45-3-recommendation-ntx-addendum.md`

## 14) Governance Constraints

- Preserve original Sprint 45.3 history and artefacts unchanged.
- Add new evidence via NTX extension artefacts only.
- Do not rewrite `45-3-recommendation.md`; issue addendum only.
- Do not expand pattern scope beyond minimum regression assessment need.
- Do not invent new contract authority.
- Do not score or decide outside extension artefacts.

## 15) Go / No-Go Prerequisites

### Go

- Selected non-target slot list approved.
- Comparator mapping validity confirmed against frozen corpus.
- Contract anchors for each selected type confirmed.
- Extension artefact set approved.
- Explicit confirmation that base 45.3 artefacts remain immutable.

### No-Go

- Request to reopen target-type 45.3 evidence lanes.
- Request to redesign contract authority or add new pattern families.
- Missing matched frozen references for selected slots.
- Inability to capture minimal extension comparator bodies.

---

## Scope Readiness Assessment

Status: **Conditionally ready (design-complete)**.

Ready elements:

- Objective, scope boundaries, comparator structure, evaluation authority, and phase model are fully specified.
- Governance protections for base 45.3 history and recommendation integrity are explicit.

Readiness dependencies before execution:

1. Final approval of exact sampled slot IDs (activity/material IDs).
2. Confirmation of one-domain vs two-domain `checklist` lane.
3. Approval of minimum sample size as sufficient for blocker-closure governance.

## Unresolved Decisions

1. Exact slot-level sample list for each selected non-target type.
2. Whether to include optional baseline/control arm on first pass or only on ambiguity-trigger.
3. Whether `checklist` is kept as single-domain minimum or expanded cross-domain at start.

## Recommended Next Step

Run a short NTX-0 governance lock session to ratify slot IDs and sample sufficiency, then open NTX-1 comparator workbook population with no changes to base 45.3 artefacts.

---

## NTX-0 Governance Lock Closeout

Status: **closed**.

Frozen decisions recorded:

1. **Slot list frozen**
   - `text` (Marx): A1 / M1
   - `text` (Photosynthesis): A1 / M1
   - `worked_example` (Marx): A1 / M2
   - `worked_example` (Photosynthesis): A1 / M2
   - `checklist` (Photosynthesis): A2 / M7

2. **Baseline/control policy frozen**
   - Comparator policy: frozen-reference-only comparator.
   - Baseline arm: optional escalation only if first-pass evidence is inconclusive.

3. **Calibration declarations required (mandatory)**
   - Photosynthesis M1 `text`: Pass-1 vs Inter-Rater Strong/Minimum split declaration required at evaluation time.
   - Marx M2 `worked_example`: Pass-1 vs Inter-Rater Strong/Minimum split declaration required at evaluation time.

4. **Checklist lane policy frozen**
   - Single-domain checklist lane (Photosynthesis M7) for first-pass NTX.
   - Cross-domain checklist expansion allowed only as bounded Repeat escalation.

5. **Sufficiency criteria frozen**
   - Minimum sampled types: `text`, `worked_example`, `checklist`.
   - Minimum sampled domains: Marx + Photosynthesis overall; cross-domain for `text` and `worked_example`.
   - Minimum comparator lanes: 5 mapped slots.
   - Minimum evidence fields: slot identity, provenance, contract anchor, calibration declaration status, and completeness checks (evaluation fields populated later in NTX-3/NTX-4 only).

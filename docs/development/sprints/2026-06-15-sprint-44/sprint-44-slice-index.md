# Sprint 44 — Slice Index

**Date:** 2026-06-15  
**Sprint:** Instructional depth and GAM validation

---

## Overview

| Slice | Title | Status | Type |
| ----- | ----- | ------ | ---- |
| **44-1** | Tiered GAM capture validation gate | Designed — ready for implementation | Runtime capture gate |
| **44-2** | Instructional depth contracts | Draft 1 accepted as reference | Educational design spec |
| **44-3** | Instructional pattern library | Draft 1 complete | Educational design |

---

## 44-1 — Tiered GAM Capture Validation Gate

| Field | Value |
| ----- | ----- |
| **Status** | Designed — ready for implementation |
| **Document** | [`sprint-44-slice-1-tiered-gam-capture-gate.md`](sprint-44-slice-1-tiered-gam-capture-gate.md) |
| **Purpose** | Prevent structurally bad GAM captures from silently entering learner-page composition |
| **Scope** | Self-directed learner-page Generate Activity Materials capture only |

### Key decisions

- Tier 1 (structural): JSON stub, missing pack format — **blocking**
- Tier 2 (coverage): material count and activity coverage vs upstream DLA — **blocking** when DLA available
- Tier 3 (thin bodies): checklist &lt; 80ch, other types &lt; 120ch — **warning only**
- FMT-06/07/08 (inflation A4 scenario, worked judgement, transfer word-band) — **excluded** from universal gate
- No LLM repair, no renderer changes, no prompt changes

### Depends on

- Sprint 38-S `lib/gam-output-format.js` (existing validation primitives)
- Upstream DLA capture for coverage tier

### Unblocks

- Safer manual and automated GAM runs before Design Page
- 44-2 material evaluation on captures that are structurally valid

---

## 44-2 — Instructional Depth Contracts

| Field | Value |
| ----- | ----- |
| **Status** | Draft 1 accepted as reference |
| **Document** | [`sprint-44-2-instructional-depth-contracts.md`](sprint-44-2-instructional-depth-contracts.md) |
| **Purpose** | Make implicit instructional contracts explicit as educational design standards |
| **Type** | Educational design artefact — **not** implementation spec |

### Material types

`text` · `worked_example` · `modelling_note` · `misconception_note` · `sample_output` · `decision_table` · `checklist` · `transfer_prompt` · `consolidation_summary` · `rubric` · `quality_criteria`

### Per-type sections

Educational purpose · Learner effect · Existing implicit contract · Minimum realisation · Strong realisation · Failure modes · Potential validation signals

### Depends on

- Sprint 43 closure (architecture settled; material realisation is the gap)
- Distributed contracts consolidated from workbook, preservation, and self-directed rhetoric intent

### Unblocks

- Marx and Photosynthesis material realisation evaluation
- 44-3 pattern library design (if contracts discriminate)

---

## 44-3 — Instructional Pattern Library

| Field | Value |
| ----- | ----- |
| **Status** | Draft 1 complete |
| **Document** | [`sprint-44-3-instructional-pattern-library.md`](sprint-44-3-instructional-pattern-library.md) |
| **Patterns** | [`patterns/`](patterns/) — SP-01 through SP-06 |
| **Purpose** | Reusable strong-realisation patterns per material type |
| **Trigger** | Met — 44-2 evaluation discriminated; Readiness Assessment authorised Draft 1 |

### Delivered

- Hybrid index architecture (material-type primary, failure-mode secondary)
- Six pattern entries for evaluated core material types
- Meta-principles MP-1–MP-8
- Failure-mode registry FM-02–FM-11 (+ capture artefacts FM-01, FM-12 in conventions)

### Depends on

- 44-2 accepted contracts
- Cross-domain evaluation complete (Pass 1, Pass 2, Inter-Rater)

---

## Recommended execution order

```text
44-1 implement  →  44-2 evaluate (Marx, Photosynthesis)  →  44-3 design (if warranted)
```

44-1 and 44-2 can proceed in parallel for **design/evaluation** work; implementation of depth enforcement (if any) should follow contract validation.

---

## Related

| Document / folder | Contents |
| ----------------- | -------- |
| [`README.md`](README.md) | Sprint 44 entry point and folder index |
| [`sprint-44-review.md`](sprint-44-review.md) | Sprint closure narrative review |
| [`sprint-44-outcomes.md`](sprint-44-outcomes.md) | Deliverables, evidence chain, definition of done |
| [`sprint-45-proposal.md`](sprint-45-proposal.md) | Proposed next sprint (not approved) |
| [`benchmark-corpus/`](benchmark-corpus/) | Frozen Marx and Photosynthesis evaluation corpus |
| [`context-pack/`](context-pack/) | Fresh ChatGPT continuation package |
| [`../2026-06-12-sprint-43-educational-salience/`](../2026-06-12-sprint-43-educational-salience/) | Closed Sprint 43 — reference only |

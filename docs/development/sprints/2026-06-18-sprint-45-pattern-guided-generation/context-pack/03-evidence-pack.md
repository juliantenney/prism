# Evidence Pack — Sprint 45 Context

**Date:** 2026-06-18  
**Purpose:** Sprint 44 evidence chain for Sprint 45 continuation — conclusions and artefact pointers  
**Note:** Evaluation pass reports are accepted session evidence codified in pattern entries; standalone `.md` evaluation files are **not** in the repo

---

## Benchmark Corpus

Frozen cross-domain fixtures for reproducible evaluation.

| Domain | ID | GAM bodies | Location |
| ------ | -- | ---------- | -------- |
| Marx | `marx-capitalism-v1` | `activity-materials.txt` | [`../../2026-06-15-sprint-44/benchmark-corpus/marx/`](../../2026-06-15-sprint-44/benchmark-corpus/marx/) |
| Photosynthesis | `photosynthesis-v1` | `learning-materials.txt` | [`../../2026-06-15-sprint-44/benchmark-corpus/photosynthesis/`](../../2026-06-15-sprint-44/benchmark-corpus/photosynthesis/) |

DLA obligations: `design-learning-activities.json` per domain — used for obligation verification, not body scoring.

Readme: [`../../2026-06-15-sprint-44/benchmark-corpus/readme.txt`](../../2026-06-15-sprint-44/benchmark-corpus/readme.txt)

**Evaluation unit:** GAM material **bodies**. Page composition (`page.json`, FM-12) is a separate channel.

---

## Evaluation Passes

Three passes against 44-2 contracts ([`../../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md`](../../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md)):

| Pass | Scope | Key outcomes |
| ---- | ----- | ------------ |
| **Pass 1** | Sentinel: `text` (M1), `worked_example` (M2) | Contracts discriminate; FM-05 cross-domain on M2; FM-07 on Photosynthesis exposition |
| **Pass 2** | Verification, transfer, judgement, closure | Sharpest splits on transfer (M16 Strong vs M14 Failed) and decision table (M13 Strong vs M12/M19 Minimum) |
| **Inter-Rater Validation** | Independent cross-type scoring | High agreement on primary Strong/Failed; boundary splits on Marx M2, checklists, Photosynthesis M23/M22/M1 |

Supporting assessments (session evidence; summarised in [`../../2026-06-15-sprint-44/sprint-44-review.md`](../../2026-06-15-sprint-44/sprint-44-review.md)):

- 44-3 Readiness Assessment — authorised Pattern Library Draft 1
- 44-3 Architecture Review — architecture validated
- Sprint 44 Pattern Synthesis — MP-1–MP-8

**Missing repo files:** Standalone evaluation report `.md` files for Pass 1, Pass 2, and Inter-Rater were not committed. Findings are authoritative via pattern entries and Sprint 44 closure docs.

---

## Verdict Discrimination (Summary)

Contracts produced Strong, Minimum, and Failed spreads — not uniform pass clustering.

| Material type | Strong reference | Weak / Failed contrast |
| ------------- | ---------------- | ---------------------- |
| `decision_table` | Marx M13 (unanimous Strong) | Photosynthesis M12, M19 (Minimum; FM-04) |
| `transfer_prompt` | Marx M16 (unanimous Strong) | Photosynthesis M14 (unanimous Failed; FM-02, FM-03) |
| `consolidation_summary` | Marx M17 (unanimous Strong) | M23 boundary (Pass 2 Min / IR Strong) |
| `checklist` | Marx cluster (mixed Strong/Min) | Photosynthesis M13 stub (Failed; FM-01) |
| `worked_example` | — | Both M2 Minimum (FM-05) |
| `text` | Marx M1 (unanimous Strong) | Photosynthesis M1 split |

Photosynthesis systematically thinner on evaluative-arc materials; Marx capstone sequence (M12→M17) is a coherent strong reference arc.

---

## Failure Modes

Instructional (Secondary Index in Pattern Library):

| ID | Name |
| -- | ---- |
| FM-02 | Thin transfer body |
| FM-03 | Third-person procedural transfer |
| FM-04 | Decision-table shell without partial exemplar |
| FM-05 | Worked example without parallel-task bridge |
| FM-07 | Cognition-cue collapse |
| FM-09 | Verification completeness bias |
| FM-10 | Thin judgement/closure scaffold |
| FM-11 | Checklist at minimum threshold only |

Capture / channel (Conventions — not instructional patterns):

| ID | Name |
| -- | ---- |
| FM-01 | Material body stub (`"as above"`) |
| FM-12 | Page-composition loss |

Boundary-sensitive: FM-08 (exposition without applied bridge — Pass 1 only).

Full registry: [`../../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md`](../../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) § Secondary Index.

---

## Strong Patterns (Draft 1)

| ID | Material type | File |
| -- | ------------- | ---- |
| SP-01 / TEXT-SP-01 | `text` | [`../../2026-06-15-sprint-44/patterns/SP-01-TEXT-SP-01-connective-exposition-prose.md`](../../2026-06-15-sprint-44/patterns/SP-01-TEXT-SP-01-connective-exposition-prose.md) |
| SP-02 / DT-SP-01 | `decision_table` | [`../../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md`](../../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md) |
| SP-03 / TP-SP-01 | `transfer_prompt` | [`../../2026-06-15-sprint-44/patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md`](../../2026-06-15-sprint-44/patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md) |
| SP-04 / CS-SP-01 | `consolidation_summary` | [`../../2026-06-15-sprint-44/patterns/SP-04-CS-SP-01-multi-angle-consolidation-scaffold.md`](../../2026-06-15-sprint-44/patterns/SP-04-CS-SP-01-multi-angle-consolidation-scaffold.md) |
| SP-05 / CL-SP-01 | `checklist` | [`../../2026-06-15-sprint-44/patterns/SP-05-CL-SP-01-criteria-linked-verification-checklist.md`](../../2026-06-15-sprint-44/patterns/SP-05-CL-SP-01-criteria-linked-verification-checklist.md) |
| SP-06 / WE-SP-01 | `worked_example` | [`../../2026-06-15-sprint-44/patterns/SP-06-WE-SP-01-visible-reasoning-worked-example.md`](../../2026-06-15-sprint-44/patterns/SP-06-WE-SP-01-visible-reasoning-worked-example.md) |

Unevaluated 44-2 types (no SP entry): `modelling_note`, `misconception_note`, `sample_output`, `rubric`, `quality_criteria`.

---

## Meta-Principles (MP-1–MP-8)

Documentary synthesis only — subordinate to 44-2; do not add verdict tiers.

| ID | Principle |
| -- | --------- |
| MP-1 | Scaffold ≠ deliverable |
| MP-2 | Model the move before independent production |
| MP-3 | Explicit bridge to the learner's next task |
| MP-4 | Criteria linkage across adjacent materials |
| MP-5 | Operational production criteria |
| MP-6 | Reasoning quality over structural completeness |
| MP-7 | Multi-cue / multi-angle structure |
| MP-8 | One instructional move per material |

Source: [`../../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md`](../../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) § Pattern Library Meta-Principles.

---

## Why SP-02 and SP-03 Are First-Generation Candidates

Proposed for **45-1 Pattern Injection Experiment** only:

| Criterion | SP-02 (decision_table) | SP-03 (transfer_prompt) |
| --------- | ---------------------- | ------------------------- |
| Evidence strength | Marx M13 unanimous Strong | Marx M16 unanimous Strong |
| Failed contrast | FM-04 on Photosynthesis M12/M19 | M14 unanimous Failed (FM-02, FM-03) |
| Inter-rater agreement | High on M13 | High on M16 and M14 |
| Detection signals | Partial exemplar row, empty judgement cells | Substantive body, learner-context selection, operational completion criteria |
| Learner ownership | Explicit in pattern | No pre-written transfer answer |
| Bounded experiment | Single instructional move (FM-04 remediation) | Single instructional move (transfer function) |

**Deferred patterns** (calibration-sensitive or weaker boundary agreement): SP-01 (FM-07 emission; M1 split), SP-04 (M23 split), SP-05 (Marx checklist Strong/Min split), SP-06 (FM-05 cross-domain; M2 never Strong in corpus).

---

## Evidence Chain (Validated Sprint 44)

```text
Frozen benchmark corpus
    → 44-2 contract evaluation (Pass 1 + Pass 2)
    → Inter-Rater Validation
    → Pattern extraction (SP-01–SP-06)
    → Meta-Principles (MP-1–MP-8)
```

Sprint 45 would extend: **pattern injection → generation → pattern-aware evaluation → corpus regression**.

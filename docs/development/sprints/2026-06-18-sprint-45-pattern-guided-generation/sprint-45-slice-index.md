# Sprint 45 — Slice Index

**Date:** 2026-06-18  
**Sprint:** Pattern-Guided Generation  
**Status:** Closed historical sprint

---

## Overview

| Slice | Title | Status | Type |
| ----- | ----- | ------ | ---- |
| **45-1** | Pattern Injection Experiment | Complete | Generation experiment |
| **45-2** | Pattern-Aware Evaluation | Complete (I5 closed) | Evaluation method |
| **45-3** | Regression Against Benchmark Corpus | Complete (NTX addendum closed blocker; effective standing Proceed) | Comparative evaluation |
| **45-4** | Material-Level Repair Strategy | Deferred / Not Executed | Exploratory repair design |

---

## 45-1 Pattern Injection Experiment

**Design:** [`45-1-pattern-injection-experiment-design.md`](45-1-pattern-injection-experiment-design.md) (accepted)  
**Execution:** [`45-1-experiment-execution-plan.md`](45-1-experiment-execution-plan.md)  
**Workbook:** [`45-1-evidence-workbook.md`](45-1-evidence-workbook.md)

| Field | Value |
| ----- | ----- |
| **Status** | Complete |
| **Goal** | Test whether selected patterns can be deliberately induced in generated GAM materials |
| **Initial target patterns** | SP-02 / DT-SP-01 (`decision_table`); SP-03 / TP-SP-01 (`transfer_prompt`) |
| **Material types** | `decision_table`, `transfer_prompt` |
| **Benchmark references** | Marx M13 (Strong decision table); Marx M16 (Strong transfer); Photosynthesis M14 (Failed transfer contrast) |
| **Depends on** | Sprint 44 Pattern Library; 44-2 contracts; benchmark corpus |
| **Does not include** | Injection of all six patterns; prompt changes without evaluation plan |
| **Closure references** | `45-1-recommendation.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` |

### Rationale for SP-02 + SP-03 first

- Strongest evidence base (unanimous Strong on Marx M13, M16; unanimous Failed on M14)
- Clearest Strong / Minimum / Failed discrimination
- High inter-rater agreement on primary exemplars
- Directly observable generation signals in pattern Detection Signals sections

---

## 45-2 Pattern-Aware Evaluation

| Field | Value |
| ----- | ----- |
| **Status** | Complete (I5 closed) |
| **Goal** | Evaluate generated materials for pattern presence, missing signals, and failure modes |
| **Method** | 44-2 contract verdicts + pattern Detection Signals + FM absence checks |
| **Conventions** | Body vs composition separation; stub detection (FM-01); learner-ownership preservation |
| **Depends on** | 45-1 outputs (or baseline generation for comparison) |
| **Does not include** | New verdict tiers; contract redesign |
| **Closure governance references** | `45-2-recommendation-i5-closure-addendum.md`; `SPRINT-45-2-EXECUTION-STATUS.md` |

---

## 45-3 Regression Against Benchmark Corpus

| Field | Value |
| ----- | ----- |
| **Status** | Complete (NTX addendum resolved non-target blocker; effective standing Proceed) |
| **Goal** | Compare new generation against frozen Marx / Photosynthesis corpus |
| **Questions** | Verdict distribution shift on target types? Cross-domain generalisation? Regression on non-target types? |
| **Corpus** | [`../2026-06-15-sprint-44/benchmark-corpus/`](../2026-06-15-sprint-44/benchmark-corpus/) |
| **Depends on** | 45-1 and/or 45-2 |
| **Does not include** | Re-freezing benchmark corpus without explicit decision |
| **Closure governance references** | `45-3-recommendation-ntx-addendum.md`; `SPRINT-45-3-EXECUTION-STATUS.md`; `45-3-ntx-execution-status.md` |

---

## 45-4 Material-Level Repair Strategy

| Field | Value |
| ----- | ----- |
| **Status** | Deferred / Not Executed |
| **Goal** | Explore whether weak material bodies can be repaired without re-running the whole workflow |
| **Scope** | Single material body repair vs activity vs session — design exploration |
| **Target FMs (examples)** | FM-01 stub; FM-02 thin transfer; FM-04 table shell |
| **Depends on** | 45-1 results showing which FMs persist after injection |
| **Does not include** | Full autonomous repair pipeline in first slice |

---

## Historical Execution Order

```text
45-1 experiment execution
    → 45-2 evaluate outputs
    → 45-3 compare to frozen corpus
    → 45-3-NTX bounded non-target comparator extension
    → 45-4 deferred (not executed in Sprint 45)
```

---

## Related

| Document | Contents |
| -------- | -------- |
| [`README.md`](README.md) | Sprint 45 entry point and closure state |
| [`sprint-45-current-frontier.md`](sprint-45-current-frontier.md) | Post-close frontier transition |
| [`../2026-06-15-sprint-44/sprint-45-proposal.md`](../2026-06-15-sprint-44/sprint-45-proposal.md) | Source proposal |
| [`../2026-06-15-sprint-44/sprint-44-outcomes.md`](../2026-06-15-sprint-44/sprint-44-outcomes.md) | Sprint 44 deliverables |
| [`SPRINT-45-CLOSURE-SUMMARY.md`](SPRINT-45-CLOSURE-SUMMARY.md) | Formal Sprint 45 closure summary |

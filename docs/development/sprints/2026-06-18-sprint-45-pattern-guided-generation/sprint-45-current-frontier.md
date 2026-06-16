# Sprint 45 Current Frontier

**Date:** 2026-06-18  
**Status:** Proposed — not yet started  
**Type:** Frontier definition for a proposed sprint

---

## Where We Are

Sprint 44 closed with a complete educational-design layer:

- Instructional depth **contracts** validated on Marx and Photosynthesis
- **Benchmark corpus** frozen for reproducible evaluation
- **Pattern Library Draft 1** — six evidence-backed patterns + failure-mode registry + meta-principles
- **44-1 capture gate** designed (runtime implementation may continue in parallel)

The active question is no longer whether materials can be **evaluated** — Sprint 44 answered that. The proposed question is whether validated patterns can **influence generation**.

Sprint 45 is **not approved**. This document describes the proposed frontier only.

---

## What Is Open (Proposed Sprint 45)

| Question | Proposed slice |
| -------- | -------------- |
| Can patterns be deliberately induced in GAM output? | **45-1** Pattern Injection Experiment |
| Can we measure pattern signals and failure-mode absence on generated bodies? | **45-2** Pattern-Aware Evaluation |
| Does new generation improve vs frozen benchmark corpus? | **45-3** Regression Against Benchmark Corpus |
| Can weak bodies be repaired at material level? | **45-4** Material-Level Repair Strategy |

### Supporting open questions

- What injection mechanism carries pattern specs into GAM without treating them as unvalidated prompts?
- Does pattern guidance generalise across domains or overfit Marx?
- Does 44-1 runtime capture gate change experiment baselines?
- Do calibration-sensitive patterns (SP-01, SP-04, SP-05, SP-06) need deferred injection until 45-1 succeeds on SP-02/SP-03?

---

## What Is Not Open

| Topic | Status |
| ----- | ------ |
| Ownership model | Settled Sprint 43 |
| Missing workflow stage / missing pedagogy | Disproved |
| 44-2 contract redesign | Closed Sprint 44 |
| Pattern Library architecture redesign | Closed Sprint 44 |
| Full autonomous repair pipeline | Out of first slice |
| Unevaluated material types (`rubric`, `modelling_note`, etc.) | No SP entries — defer |
| Renderer / page layout redesign | Out of scope |
| Universal Strong enforcement gates | 44-1 excludes semantic depth blocking |
| Resolving all Strong/Minimum calibration disputes | Document only — do not legislate via generation |

---

## Proposed Frontier Order

```text
1. 45-1 Pattern Injection Experiment     (SP-02 + SP-03 first)
2. 45-2 Pattern-Aware Evaluation         (44-2 + Detection Signals)
3. 45-3 Regression Against Benchmark Corpus
4. 45-4 Material-Level Repair Strategy   (exploratory; after 45-1 results)
```

**Parallel (optional):** 44-1 capture gate runtime implementation — complementary to quality experiments, not a substitute for 45-1.

---

## Recommended Entry Point

If the user asks to continue PRISM after Sprint 44:

1. Confirm whether Sprint 45 is **approved**
2. If approved, begin **45-1** design for `decision_table` and `transfer_prompt` only
3. If not approved, remain in proposal/design discussion — no code changes

Source proposal: [`../2026-06-15-sprint-44/sprint-45-proposal.md`](../2026-06-15-sprint-44/sprint-45-proposal.md)

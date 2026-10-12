# Sprint 93 — Architectural debt

**Sprint:** 93 — Assessment Pack Educational Contract  
**Status:** **CLOSED — ACCEPTED**  
**Closure:** [SPRINT-93-CLOSURE.md](SPRINT-93-CLOSURE.md)

Ledger for deferred findings discovered during Sprint 93. Do not invent speculative items at open beyond known baseline gaps already recorded in Gate 1.

---

## Protected prior state

| Item | State |
| ---- | ----- |
| Sprint 92 | **COMPLETE / CLOSED** — do not reopen |
| Sprint 91 | **COMPLETE / CLOSED** |
| Situated Task | First-class `situated_task` |
| Assessment Pack | **CLOSED — ACCEPTED** first-class product — [SPRINT-93-CLOSURE.md](SPRINT-93-CLOSURE.md) |

---

## Debt ledger

| ID | Finding | Status | Notes |
| -- | ------- | ------ | ----- |
| — | *(none opened beyond Gate 1 documented limitations)* | — | Gate 1 limitations are evidence for Gate 2, not automatic debt |

Known baseline gaps recorded at Gate 1 (discovery pressure, not acceptance blockers, and not re-audited as a set at close): LJ ZIP exclusion for Assessment Pack; draft adapter radio-centric; LJ commission language vs five-form authoring; no Situated Task product-output grounding.

## Resolved at close

| Finding | Status | Notes |
| ------- | ------ | ----- |
| Design Page `attempt_instructions` emitted as an array | **Resolved** | Prompt and copy contract require one string. Validator still rejects arrays. Existing saved workflows may retain older stored prompts. |

## Later work (not Sprint 93 blockers)

- Automatic judgement of constructed performance
- PRISM listening to or assessing externally retained performance evidence
- A full learner interaction test of C13
- Assembly of the thirteen commissioned products into the jazz Learning Journey
- Further performance-evidence handling or Learning Journey assembly

No successor sprint is opened by Sprint 93 closure.

---

## Explicitly out of scope

Summative / grading / certification / high-stakes / institutional assessment-management; feature implementation before Gates 2–9; cross-product learner-state transport as a starting assumption.

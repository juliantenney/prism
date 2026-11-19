# Sprint 100 — Validation ledger

**Sprint:** 100 — Learner Workload and Timing Realism  
**Sprint status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS** (2026-11-17)  
**Closure:** [SPRINT-100-CLOSURE.md](SPRINT-100-CLOSURE.md)

Results below are **historical checkpoint records**. Closure does **not** claim that these suites were re-run on the closure date.

---

## 100A (recorded)

```text
node --test tests/s100a-workload-feasibility-estimator.test.js
node --test tests/s80-s6-duration-parameter.test.js
node --test tests/page-learning-sequence-enrich.test.js
```

**Result:** 14/14 · 32/32 · 7/7 pass

---

## 100B-1 (2026-11-17)

```text
node --test tests/s100b1-interactive-workload-feasibility.test.js tests/s100a-workload-feasibility-estimator.test.js tests/page-partial-capture-validate.test.js tests/s80-s6-duration-parameter.test.js tests/page-learning-sequence-enrich.test.js
```

**Result:** **81 pass / 0 fail** (10 + 14 + 18 + 32 + 7)

| Claim | Check |
| ----- | ----- |
| Writing-intensive explicit demands map and warn | **Claimed** |
| Short MCQ not falsely flagged | **Claimed** |
| Ambiguous / free-text-only activities produce no clutter | **Claimed** |
| LS capture remains `ok` with advisory `warnings` | **Claimed** |
| LS arithmetic mismatch still blocks | **Claimed** |
| No schema / duration auto-rewrite | **Claimed** |

### Limitations recorded

- Warnings only fire when explicit demand signals are present (especially word-length cues).  
- Partial LS captures without baseline activity prose may under-warn until baseline merge is available.  
- Heuristic ranges remain provisional (S100-AD-001).

---

## 100B-2 (2026-11-17)

```text
node --test tests/s100b2-assessment-pack-workload-feasibility.test.js tests/s100b1-interactive-workload-feasibility.test.js tests/s100a-workload-feasibility-estimator.test.js tests/page-partial-capture-validate.test.js tests/s80-s6-duration-parameter.test.js tests/page-learning-sequence-enrich.test.js
```

**Result:** **93 pass / 0 fail** (12 + 10 + 14 + 18 + 32 + 7)

| Claim | Check |
| ----- | ----- |
| 300–400-word philosophical argument with short allocation warns | **Claimed** |
| 350–500-word evidence-based recommendation warns | **Claimed** |
| Short MCQ remains plausible | **Claimed** |
| Feedback + revision overhead distinguished | **Claimed** |
| Ambiguous / text-entry-only elicitations produce no clutter | **Claimed** |
| AP elicitation + Design Page capture remain `ok` with advisory `warnings` | **Claimed** |
| No mutation of Assessment Pack artefacts | **Claimed** |
| No regression in 100A / 100B-1 | **Claimed** |

### Limitations recorded

- Explicit word-length cues are required before substantial writing production is estimated.  
- Nested indicative-time stage prose is not summed (first clear minutes mention / numeric field only).  
- Same elicitation may warn again at Formative Return and Design Page if re-captured (per-step, not duplicated within one capture).  
- Heuristic ranges remain provisional (S100-AD-001).

---

## 100C (2026-11-17)

```text
node --test tests/s100c-learning-journey-workload-feasibility.test.js tests/s100b2-assessment-pack-workload-feasibility.test.js tests/s100b1-interactive-workload-feasibility.test.js tests/s100a-workload-feasibility-estimator.test.js tests/page-partial-capture-validate.test.js tests/s80-s6-duration-parameter.test.js tests/page-learning-sequence-enrich.test.js
```

**Result:** **105 pass / 0 fail** (12 + 12 + 10 + 14 + 18 + 32 + 7)

| Claim | Check |
| ----- | ----- |
| Demanding writing commission with short allocation warns | **Claimed** |
| Simple MCQ commission remains plausible | **Claimed** |
| Insufficient evidence → no clutter | **Claimed** |
| Correct arithmetic sum with overloaded commission still warns (journey) | **Claimed** |
| Multiple independent commission concerns | **Claimed** |
| Overlapping scopes not safely aggregated | **Claimed** |
| Element allocations not double-counted with commissions | **Claimed** |
| Design Page capture remains `ok` with advisory warnings | **Claimed** |
| No regression in 100A / 100B-1 / 100B-2 | **Claimed** |

### Limitations recorded

- Commission durations are parsed from specification prose (no structured duration field on Design Page commissions).  
- Vague commissions without explicit word bands / typed demands stay silent by design.  
- Sibling TIME CHECK prompts remain prose-only; 100C does not replace them with blocking arithmetic.  
- Heuristic ranges remain provisional (S100-AD-001).

---

## 100D / 100E (closure record — 2026-11-17)

| Item | Record |
| ---- | ------ |
| 100D | Five external QA workflows updated to v1.3 outside Cursor (Learning Journey, Interactive, Assessment Pack, Situated Task, Expository). JSON not necessarily in this repository. |
| 100E | Implementation evidence and limitations reviewed; sprint closed with qualifications. |
| Last reported automated checkpoint | **105 pass / 0 fail** at 100C (historical; not re-run at closure) |

**Not claimed at close:** empirical learner-time validation; systematic exemplar-corpus calibration of the revised external QA workflows.

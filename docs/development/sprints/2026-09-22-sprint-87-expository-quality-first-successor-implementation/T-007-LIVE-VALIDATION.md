# S87-T-007 — Live validation record

**Status:** **COMPLETE** (2026-09-23)  
**Instrument:** [EXPOSITORY-QA-v0.2.md](EXPOSITORY-QA-v0.2.md)  
**Closure:** [T-008-SPRINT-87-CLOSURE.md](T-008-SPRINT-87-CLOSURE.md) · [S87-D14](decisions.md#s87-d14--close-sprint-87--expository-quality--first-successor-implementation)  
**Last updated:** 2026-09-23

---

## Overall

Five-case live QA v0.2 supports the Sprint 87 first slice overall. AD-010 remains **resolved** under live pressure (no learner-facing “Structured material body is not supported…” slogan; structured bodies survive). Publication-quality, terminal-closure, A/B/C refinement, and Figure 4 brief-quality repairs are landed and gated. **No further general editorial refinement is warranted by the current validation evidence.**

---

## Final T-007 evidence (authoritative — do not overstate)

- Five matched live Expository cases were generated and reviewed against QA v0.2 **D1–D15** plus the production-defect channel.
- S86 findings around prospectus furniture, dual closure, AD-010 unsupported structured bodies, flat learner-facing hierarchy, representation behaviour, and C04 epistemic-form failure were re-tested through fresh generation.
- Structured-material publication-quality defects were repaired and validated ([S87-D10](decisions.md#s87-d10--structured-material-publication-quality)).
- Terminal authorial-close displacement was repaired and live-validated ([S87-D11](decisions.md#s87-d11--expository-terminal-closure-order)).
- Expository QA Benchmark v1.0 and Validator v1.0 were established and frozen.
- Bayes post-repair baseline: **88/100 — Strong** — independently Validated at **88/100**.
- External calibration probe demonstrated that the benchmark can recognise strong professional authorship while distinguishing persuasive opinion writing from commissioned educational exposition. **Do not make the external article or its author part of PRISM’s editorial specification.**
- Final evidence-led A/B/C refinement ([S87-D12](decisions.md#s87-d12--final-evidence-led-expository-refinement-benchmark-88100)):
  - **A** — authorised relationship semantics now survive into image briefs;
  - **B** — EQ6 now positively targets confident, continuous authorial explanation while preserving epistemic qualification;
  - **C** — supporting representations/materials are asked to add distinct explanatory or perceptual value rather than merely restating completed prose.
- Final Bayes benchmark after those refinements: **89/100**.
- Independent validator: **Validated with revisions**, validated score **90/100 — Professional / excellent**.
- Previous Figure 3 incorrect-connector defect **did not recur**.
- Figure 4 Moderate visual defect traced ([S87-D13](decisions.md#s87-d13--exact-match-show-fidelity-vs-anti-answer-key-conflict-figure-4)): exact numerical semantics survived through DP and the compiled brief; generic anti-answer-key / qualitative-label instructions conflicted with `requires_exact_data_match`. Narrow generic repair makes exact on-image data requirements authoritative when that flag is true and suppresses conflicting generic guidance.
- Figure 4 regression **3/3**; focused brief/S87 suites **63/63** (full focused acceptance pack at closure **96/96**).
- No further general editorial refinement is warranted by the current validation evidence.

**Preserve the distinction:** validated product/editorial behaviour · bounded remaining limitations · deferred future capabilities. Do **not** claim Expository is perfect, defect-free, or production-ready in every context. Do **not** treat 90/100 as universal Expository quality proof.

---

## AD-010 live confirm

| Check | Result |
| ----- | ------ |
| Unsupported-body slogan | **Gone** across five fresh post-S87 cases |
| Structured bodies survive | **Yes** (T-004 lossless principle holds) |
| Unique instructional content | Preserved where specialised or fallback applies |

---

## Publication-quality follow-ons (REPAIR 1) — repaired

Decision: [S87-D10](decisions.md#s87-d10--structured-material-publication-quality)  
Debt: [S87-AD-009](ARCHITECTURAL-DEBT.md) · [S87-AD-010](ARCHITECTURAL-DEBT.md)

Blank structured tables (C03-class key mismatch) and schema/internal-ID leakage (C04; milder C05) repaired with regressions in `tests/s87-t007-structured-publication-quality.test.js`.

---

## Terminal closure displacement (REPAIR 2) — repaired

Decision: [S87-D11](decisions.md#s87-d11--expository-terminal-closure-order)  
Debt: [S87-AD-011](ARCHITECTURAL-DEBT.md)

Final substantive section: materials + VA before terminal exposition. Regression: `tests/s87-t007-terminal-closure-order.test.js`.

---

## Independent Bayes baseline (post-S87 repairs, pre-A/B/C)

| Item | Value |
| ---- | ----- |
| Benchmark | **88/100 — Strong** |
| Independent validator | **Validated, 88/100** |

---

## Final evidence-led refinement (S87-D12) — accepted / frozen

A/B/C engineering landed; B and C accepted as editorial refinements; no further general editorial programme.

---

## Post-refinement Bayes QA — recorded

| Item | Value |
| ---- | ----- |
| Benchmark | **89/100** |
| Independent validator | **Validated with revisions** |
| Validated final score | **90/100 — Professional / excellent** |
| Critical / Major | **None** |
| Remaining Moderate (at validation) | Figure 4 — brief-quality conflict repaired under S87-D13 |
| Figure 3 connector defect | **Did not recur** |

---

## Figure 4 diagnosis — COMPLETE

See prior detailed trace in this file’s history / [S87-D13](decisions.md#s87-d13--exact-match-show-fidelity-vs-anti-answer-key-conflict-figure-4). Classification: **mixed / Case C**. Repair: exact-match Show fidelity in human image briefs. Regression **3/3**.

---

## T-007 closure checklist

| Item | State |
| ---- | ----- |
| REPAIR 1 — publication quality | **COMPLETE** (S87-D10) |
| REPAIR 2 — terminal closure | **COMPLETE** (S87-D11) |
| Final refinement A/B/C | **COMPLETE / frozen** (S87-D12) |
| Figure 4 brief-quality conflict | **COMPLETE** (S87-D13) |
| Live five-case + Bayes calibration evidence | **COMPLETE** |
| T-007 | **COMPLETE** |
| Sprint 87 | Closed under **T-008 / S87-D14** |

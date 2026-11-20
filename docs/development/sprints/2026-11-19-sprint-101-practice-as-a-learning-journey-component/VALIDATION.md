# Sprint 101 — Validation plan / ledger

**Sprint:** 101 — Practice as a Learning Journey Component  
**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Closure:** [SPRINT-101-CLOSURE.md](SPRINT-101-CLOSURE.md)

---

## 101A (2026-11-19)

**Mode:** Read-only architectural investigation.  
**Automated tests:** **Not run** (no implementation changes; per opening constraints).

| Claim | Evidence |
| ----- | -------- |
| Interactive stage order and family titles documented from code | [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) §1 · `lib/first-class-workflow-family.js` |
| Learner-facing prose sources traced to fields + renderer | Investigation §2 · `learner-renderer-vnext` |
| LJ Interactive commission path mapped | Investigation §3 · LJ design-page / intake / package libs |
| Three reuse approaches compared; provisional recommendation recorded | Investigation §§5–6 |
| Wireframe method proposed (not executed) | Investigation §8 |

---

## 101B (2026-11-19) — design gate **accepted**

**Mode:** Documentation / instructional design only.  
**Automated tests:** **Not run** (no implementation changes).

| Claim | Evidence |
| ----- | -------- |
| Practice purpose, boundaries and LJ inheritance | [PRACTICE-INSTRUCTIONAL-CONTRACT.md](PRACTICE-INSTRUCTIONAL-CONTRACT.md) |
| Learner-facing elements classified required / optional / normally omitted | Contract §3 |
| Commissioning uses existing fields + stronger prose guidance | Contract §§2, 6 |
| Design acceptance criteria D1–D8 recorded | Contract §8 |
| Author design approval | [S101-D02](decisions.md#s101-d02--propose-practice-instructional-contract-101b) **Accepted** |

---

## 101C (2026-11-19) — design gate **accepted** (foundation)

**Mode:** Design wireframe / comparison only.  
**Automated tests:** **Not run**.

| Claim | Evidence |
| ----- | -------- |
| Interactive C2 inspected from real export | [WIREFRAME-C2-COMPARISON.md](WIREFRAME-C2-COMPARISON.md) |
| Practice prototype uses C2 mathematics | [wireframe/practice-c2-seeing-gradients-and-tangency.html](wireframe/practice-c2-seeing-gradients-and-tangency.html) |
| Accepted as foundation, not a mandatory template | [S101-D03](decisions.md#s101-d03--propose-practice-c2-learner-experience-wireframe-101c) **Accepted** |

---

## 101C-3 (2026-11-19) — readiness gate **accepted**

**Mode:** Read-only technical audit + documentation.  
**Evidence:** [PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md](PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md) · [S101-D04](decisions.md#s101-d04--propose-practice-technical-capability-audit-101c-3)

---

## 101D (2026-11-19) — implementation **complete**

| Claim | Evidence |
| ----- | -------- |
| Practice product identity + intake | `tests/s101-practice-product-identity-and-intake.test.js` |
| Practice render + package | `tests/s101-practice-render-and-package.test.js` |
| Slice report | [101D-IMPLEMENTATION-REPORT.md](101D-IMPLEMENTATION-REPORT.md) · [S101-D05](decisions.md#s101-d05--complete-practice-v1-implementation-101d) |

---

## 101E (2026-11-19…20) — validation **complete**

| Claim | Evidence |
| ----- | -------- |
| Selection controls / export / layout | `tests/s101e-practice-selection-*.test.js` |
| Progressive + discipline-first contracts | `tests/s101e-practice-progressive-interaction.test.js`, `tests/s101e-practice-discipline-first.test.js` |
| Run-data persistence + IndexedDB runstate | `tests/s101e-run-data-persistence-failure.test.js`, `tests/s101e-runstate-indexeddb-migration.test.js` |
| DP visual affordances / editorial | `tests/s101e-practice-dp-visual-affordances.test.js`, `tests/s101e-practice-editorial-opening.test.js` |

---

## 101F (2026-11-20) — workload proportion **complete**

| Claim | Evidence |
| ----- | -------- |
| Practice DLA/GAM gates; Interactive/AP unaffected | `tests/s101f-practice-workload-proportion.test.js` |

---

## 101G (2026-11-20) — commission-native feasibility **complete** (investigation only)

| Claim | Evidence |
| ----- | -------- |
| EP hard LO dependency; Option C recommended | Canvas `s101g-commission-native-lj-components` · [STATUS.md](STATUS.md) |
| Control-led + concise justification contracts | `tests/s101g-practice-control-led-justification.test.js` |

---

## 101H (2026-11-20) — image-brief precision **complete**

| Claim | Evidence |
| ----- | -------- |
| Exact C4-style equations extracted and preferred over generics | `tests/s101h-image-brief-precision-completeness.test.js` |
| Completeness gate when Show demands equations but only generics authorised | Same suite |
| Prior precision fidelity + Sprint 70 visual regressions | `tests/image-prompt-precision-fidelity.test.js`, Sprint 70 slice 5/7/7a suites |
| Final prompt can include all three authorised equations | 101H tests + STATUS note |
| Corrected image render independently verified | **Not claimed** — non-blocking follow-up |

---

## Closure (2026-11-20)

| Claim | Evidence |
| ----- | -------- |
| Sprint closed with qualifications | [S101-D06](decisions.md#s101-d06--close-sprint-101--accepted-with-qualifications) · [SPRINT-101-CLOSURE.md](SPRINT-101-CLOSURE.md) |

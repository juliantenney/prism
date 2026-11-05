# Sprint 96 — Closure Record

**Sprint:** 96 — Unified Learning Journey Experience & Compatibility  
**Opened:** 2026-11-03  
**Closed:** 2026-11-05  
**Status:** **CLOSED — ACCEPTED**  
**Type:** Bounded implementation — experience polish + mathematics compatibility + publishing default  
**Opening:** [S96-D01](decisions.md#s96-d01--open-sprint-96--unified-learning-journey-experience--compatibility)  
**M5 accept:** [S96-D19](decisions.md#s96-d19--accept-m5-final-acceptance-qualified)  
**Close:** [S96-D20](decisions.md#s96-d20--close-sprint-96--unified-learning-journey-experience--compatibility-accepted)  
**Predecessor:** [Sprint 95 — CLOSED — ACCEPTED](../2026-11-03-sprint-95-unified-learning-journey-runtime/SPRINT-95-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-024](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-024--unified-learning-journey-experience--compatibility)  
**Baseline:** `c5d93e85cb4bf1457f499ccac76763d75d272dad`

## Closure statement

Sprint 96 closed with a **polished, accessible unified Learning Journey experience** accepted as the **standard author-facing Learning Journey download**, while preserving standalone resource publishing and retaining the multi-document assembler as an internal compatibility path.

Authors download a self-contained unified shell ZIP through the normal **Download Learning Journey** action. Constituents mount with container-scoped lifecycle; journey TOC and resource section navigation coexist; declared produce/reference artefacts resolve as labelled read-only references; need-based MathLive/MathJax packaging supports mathematics-bearing journeys offline; viewport-centred reading and targeted accessibility shell improvements (skip link, named main) are in force.

**Closing Sprint 96 does not mean** any of the following have been done:

- comprehensive WCAG conformance or full screen-reader / AT audit;  
- formal screen-reader acceptance of enhanced mathematics fields;  
- resolving residual MathLive virtual-keyboard singleton risk;  
- regenerating or cleaning stored *Deciding Under Uncertainty* C5/C6 source prose;  
- claiming general inter-reviewer reliability for Learning Journey QA v1.2;  
- cross-disciplinary validation of QA v1.2;  
- Interactive V2, Course Home, server learner accounts, or AI marking.

Those remain deferred (see [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md)). Do not reopen Sprint 96 for deferred assurance.

---

## Completed scope

| ID | Title | Status |
| -- | ----- | ------ |
| M1 | Navigation and layout | **ACCEPTED** (S96-D08) |
| M2 | Visual coherence | **ACCEPTED** (S96-D09) |
| — | Resource-fidelity repair gate | **ACCEPTED** (S96-D10/D11) |
| M3 | Contextual guidance | **ACCEPTED** (qualified, S96-D13) |
| — | Publishing UI (unified-only normal LJ download) | **ACCEPTED** (S96-D14) |
| — | Viewport-centred reading | **ACCEPTED** (qualified, S96-D15) |
| M4 | Mathematics compatibility gate | **ACCEPTED** (qualified, S96-D16) |
| M5 | Final acceptance | **ACCEPTED** (qualified, S96-D19) |

Acceptance criteria in [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) are met for M1–M5 with recorded qualifications.

---

## Delivered Learning Journey capabilities

- Measured sticky layout / collapsible accessible journey TOC; resource section nav coexistence.  
- Compact shell chrome; overflow-safe tables beside sidebar; viewport-centred 70ch reading column.  
- Package-HTML preference + `media/` path rewrite restoring graphics and editable table workspaces.  
- Delivery-neutral commissioning prompts + unified-runtime neutralization of obsolete transfer prose when an artefact contract applies.  
- **Download Learning Journey** → unified package only; multi-doc assembler retained internally.  
- Need-based local MathLive/MathJax packaging; post-mount typeset; MathLive enhance + remount/draft restore (fixture evidence).  
- Skip-to-main link; `<main aria-label="Learning content">`.  
- Explicit artefact handoff contracts preserved from Sprint 95.

---

## M5 gate dispositions (at close)

| Gate | Disposition | Decision / evidence |
| ---- | ----------- | ------------------- |
| M5.1 DUU unified experience | **Accepted** (qualified provenance) | S96-D19; [M5-VERIFICATION.md](M5-VERIFICATION.md) |
| M5.2 Maths journey | **Satisfied** | S96-D18 / S96-D16 |
| M5.3 A11y smoke | **Accepted** (qualified) | S96-D17 |
| M5.4 Standalone + multi-doc | **Satisfied** | S96-D14 + regression suites |
| M5.5–M5.6 Unified default | **Satisfied** | S96-D14 |
| **M5 final** | **ACCEPTED (qualified)** | S96-D19 |

Full ledger: [VALIDATION.md](VALIDATION.md). Plan detail: [M5-VERIFICATION.md](M5-VERIFICATION.md).

---

## Educational QA calibration baseline

Author-supplied summary of two independent DUU evaluations under Learning Journey QA **v1.2**:

| Run | Verified score | Readiness |
| --- | -------------: | --------- |
| 1 | 86/100 | Ready with qualifications |
| 2 | 87/100 | Ready with qualifications |

**Status:** **Provisionally calibrated and frozen pending cross-journey validation.**  
Summary: [evidence/lj-qa-v1.2-calibration/CALIBRATION-SUMMARY.md](evidence/lj-qa-v1.2-calibration/CALIBRATION-SUMMARY.md).  
Original external reports are **not** in the repository. Not general inter-reviewer reliability. Not accessibility acceptance.

---

## Known qualifications and architectural debt

Outstanding a11y / AT assurance remains **open** — do **not** treat as resolved:

| ID | Topic | Status at close |
| -- | ----- | --------------- |
| S95-AD-020 / S96-AD-007 | Comprehensive keyboard / SR / zoom / AT | **Open** |
| S95-AD-011 residual | MathLive VK singleton | **Documented residual** |
| S96-AD-013 / S96-AD-015 | Stored C5/C6 transfer-prose cleanup | **Deferred** |
| S96-AD-016 | QA v1.2 cross-journey validation | **Deferred** |

Full register: [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md).

---

## Next-phase priorities (not launched)

Recorded without opening a new sprint or duplicating backlog items:

1. Cross-disciplinary Learning Journey validation using **unchanged** QA v1.2 (S96-AD-016).  
2. Evidence-led improvements to generation and commissioning (informed by QA qualifications such as C4 guidance / repeated explanatory material).  
3. Authoring workflow and usability evaluation.  
4. Preparation for the sector-wide demonstration.

Select next work deliberately from [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) and evidenced findings. Do not invent duplicate PB items for the above.

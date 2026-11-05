# Sprint 96 — M5 verification

**Status:** **M5 ACCEPTED (qualified)** — [S96-D19](decisions.md#s96-d19--accept-m5-final-acceptance-qualified)  
**Sprint:** 96 — **CLOSED — ACCEPTED** ([S96-D20](decisions.md#s96-d20--close-sprint-96--unified-learning-journey-experience--compatibility-accepted); [SPRINT-96-CLOSURE.md](SPRINT-96-CLOSURE.md))  
**Authoritative gates:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) § M5  
**Shell / evidence tip:** commit `6fdd423` (skip-to-main + S96-D17)

This record preserves qualifications and evidence provenance. It does **not** claim comprehensive WCAG or full screen-reader testing.

---

## Export under acceptance

| Item | Value |
| ---- | ----- |
| Journey | Author-stored Complete *Deciding Under Uncertainty* (DUU) |
| Author path | **Download Learning Journey** → unified package ([S96-D14](decisions.md#s96-d14--learning-journeys-publish-as-unified-experiences)) |
| Assemble | `assembleLearningJourneyUnifiedShellPackage` + automatic artefact-contract proposal |
| Provenance | S95-D06 author live C5→C6; S96 author accepts on exported DUU (M2 / fidelity / D15); S96 author NVDA/keyboard (M5.3); S96 browser suites |

---

## Gate dispositions (accepted)

| Gate | Disposition | Decision |
| ---- | ----------- | -------- |
| M5.1 Consolidated DUU | **Accepted** (qualified layered provenance) | S96-D19 |
| M5.2 Maths journey | **Satisfied** (D16 evidence; no DUU-native maths smoke) | S96-D18 |
| M5.3 A11y smoke | **Accepted** (representative keyboard/NVDA; skip + named main) | S96-D17 |
| M5.4 Standalone + multi-doc | **Satisfied** | S96-D14 + suites |
| M5.5–M5.6 Unified default | **Satisfied** | S96-D14 |
| **M5 final** | **ACCEPTED (qualified)** | S96-D19 |

### M5.1 provenance (preserved)

| Check | Recorded basis |
| ----- | -------------- |
| TOC / transitions / section nav | S96 M1/M2/fidelity browser + author M5.3 DUU transitions |
| Graphics + editable tables | S96-D11 on real DUU |
| Ordinary zoom/responsive | S96 M1/M2/D15 + DUU screenshots |
| Drafts across resources | S96 fidelity C2↔C4 + M1/M2 |
| C5→C6 labelled read-only / missing / reload | **S95-D06 author live DUU** + S96 artefact/M3 automated regressions — not a fresh S96 author C5→C6 checklist |

### M5.2 qualifications (preserved from D16)

Formal maths SR not demonstrated; MathLive VK residual; fixture ≠ DUU-native maths.

### M5.3 qualifications (preserved from D17)

Representative smoke only — not a WCAG audit. Skip link automated browser coverage only (not retested with NVDA). Broader AT assurance: [S95-AD-020](ARCHITECTURAL-DEBT.md) / [S96-AD-007](ARCHITECTURAL-DEBT.md).

Automated: `tests/s96-m5-skip-main-a11y.test.js` — **2 passed**.  
Regression: `tests/s96-m1-navigation-layout.test.js` — **2 passed**.

### Manual NVDA / keyboard observations (author, unified DUU)

| Observation | Result |
| ----------- | ------ |
| Sidebar keyboard navigation | Works |
| Interactive controls reachable | Yes |
| Resource selection moves focus to resource heading | Yes |
| NVDA recognises main + navigation landmarks | Yes |
| NVDA heading navigation + static content reading | Yes |
| NVDA begins reading newly displayed resource after transition | Yes |
| Sidebar keyboard trap | Not demonstrated |
| Skip link retested with NVDA after implementation | **Not done** |

---

## Educational QA v1.2 (supporting; not an M5 map gate alone)

**Status:** **Provisionally calibrated and frozen pending cross-journey validation.**  
Summary: [evidence/lj-qa-v1.2-calibration/CALIBRATION-SUMMARY.md](evidence/lj-qa-v1.2-calibration/CALIBRATION-SUMMARY.md) (author-supplied; original reports not in repo).

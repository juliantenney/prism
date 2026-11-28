# Sprint 104 — START HERE

**Sprint:** 104 — Workload Fidelity and Proportionate Authoring  
**Status:** **CLOSED — COMPLETE WITH QUALIFICATIONS** (`S104-D09`, 2026-11-27) — see [S104-D09](decisions.md#s104-d09--sprint-104-closure-with-qualifications) and the [closure entry](STATUS.md#2026-11-27--sprint-104-closed-with-qualifications-s104-d09). Deterministic workload estimation is **disabled and not calibrated or validated** (S104-D08); estimator development deferred. Milestones 1–5 committed (c461770 → 1f1269); [Sprint 105 CLOSED — COMPLETE](../2026-11-25-sprint-105-learning-journey-progressive-capture-and-assembly/SPRINT-105-CLOSURE.md) (76f44ef)  
**Resumption baseline:** `76f44ef` (Sprint 104 M1–M5 `c461770`–`f1f1269` + Sprint 105 M1–M4 & closure `4b698db`–`76f44ef`)  
**Primary backlog item:** [PB-FA-025](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-025--duration-fidelity-learner-workload-budgeting)  
**Decisions:** [S104-D01](decisions.md#s104-d01--open-sprint-104--workload-fidelity-and-proportionate-authoring) · [S104-D02](decisions.md#s104-d02--architectural-agreement-principles-a-e-and-separately-gated-milestones) · [S104-D03](decisions.md#s104-d03--milestone-2-multi-lo-compatibility-and-milestone-3-contract-reconciliation) · [S104-D04](decisions.md#s104-d04--suspend-sprint-104-at-live-acceptance-pending-sprint-105) · [S104-D05 (Resumption)](decisions.md#s104-d05--resume-sprint-104-at-live-acceptance-after-sprint-105-closure) · [S104-D06 (Workload-Fidelity Corrections & Acceptance Sequence)](decisions.md#s104-d06--focused-progressive-learning-journey-workload-fidelity-corrections-and-revised-live-acceptance-sequence)

---

## Read in order

1. [decisions.md](decisions.md) — `S104-D01`–`S104-D05` plus **`S104-D06` progressive LJ workload-fidelity corrections & revised live acceptance sequence**
2. [STATUS.md](STATUS.md) — completed M1–M5 commits, `S104-D06` corrections (stopped for review), and revised live acceptance posture
3. [VALIDATION.md](VALIDATION.md) — baseline measurements (`C01`, `C06`, Economics reference case), M1–M5 automated evidence, accepted C1 carry-forward (`91/100`), `S104-D06` verification (`48 / 48 pass`), and sequenced M1/M7/M6 gates
4. [SPRINT-104-CHARTER.md](SPRINT-104-CHARTER.md) — objective, reference case, agreed principles, milestones, non-goals
5. [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) — completed implementation milestones (`M1`–`M5`) and active live milestones (`M6`–`M7`)
6. [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) — Phase 104A `C04` trace, `C01`/`C03`/`C05` systemic evidence, contract/validator audit

## Current posture

- **Completed & committed:** Phase 104A (`f3bb47d`), Implementation Milestones **1–5** (`c461770`, `9db45bf`, `53bd50c`, `43db3f4`, `f1f1269`), and unblocking prerequisite **[Sprint 105 CLOSED — COMPLETE](../2026-11-25-sprint-105-learning-journey-progressive-capture-and-assembly/SPRINT-105-CLOSURE.md)** (`4b698db`–`76f44ef`).
- **Implemented & stopped for review (`S104-D06`):**
  1. Restored Sprint 104 M4 workload-fidelity & pre-finalisation achievability verification instructions across progressive Learning Journey Stages 1–4 (`lib/learning-journey-sibling-prompts.js`);
  2. Surfaced non-blocking advisory workload feasibility warnings at Stage 4 capture with exact Stage 5 diagnostic consistency and full lifecycle hygiene (`app.js`, `index.html`);
  3. Added targeted regression suite `tests/s104-lj-progressive-workload-fidelity.test.js` (**48 / 48 pass** across the 9-file focused regression suite).
- **Approved subsequent live acceptance sequence (`S104-D06`, gated on review of these corrections):**
  1. Generate **Economics C6 and C2** as the diagnostic pair, recording **M1** duration-transport evidence concurrently;
  2. Review the relationship between upstream commissioning demand and realised downstream workload;
  3. Complete the remaining Economics components and integrated **M7** acceptance (holistic workload assessment, baseline comparison against preserved pre-intervention captures, educational QA, and unified learner-runtime acceptance);
  4. Conduct **M6** through the proposed disposable **50-minute Learning Journey** containing three comparable Practice commissions at **5, 15, and 30 minutes** (probe brief reviewed separately so duration, rather than progression or prior familiarity, is the principal variable).
- **Canonical parent & baselines:** Preserve the accepted **90-minute Economics Learning Journey**, accepted regenerated **C1** (`91/100`), Political Economy reference module, and **both historical Economics baselines** without modification or regeneration.
- **Scope discipline:** No further estimator tuning or unrelated component-type improvements. Fix only defects blocking generation, publication, meaningful workload assessment, or integrated LJ operation; record and defer unrelated editorial, presentation, or component-type enhancements. The Political Economy module remains an independent reference implementation/stress test and is **not** a Sprint 104 closure dependency.

# Sprint 101D — Practice v1 implementation report

**Status:** **COMPLETE — ready for 101E authorisation**  
**Date:** 2026-11-19  
**Audit basis:** [PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md](PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md) (**APPROVED**)

No commit/push performed.

---

## Slice reports

### D0 — Product identity, intake, LJ identifiers

**Changed:** `lib/first-class-workflow-family.js` (Practice product + `LD_PRACTICE` + family build); `lib/first-class-commission-intake.js`; `lib/learning-journey-design-page.js` (`SUPPORTED_PRODUCT_IDS`, guidance, labels); `lib/learning-journey-sibling-prompts.js` (Practice centre-of-gravity).

**Tests:** `tests/s101-practice-product-identity-and-intake.test.js` (+ regression `s91-learning-journey-wp4-commission-intake.test.js`).

**Results:** Pass. Practice commissionable; Create-menu unchanged; unknown products fail closed; Interactive intake unchanged.

**Deviations:** None.

### D1 — Workflow + promptRoute skeleton

**Changed:** Practice reuses Interactive stage titles via family builder; `promptRoute: "practice"`; `app.js` Practice branch in `applyWorkflowStepRuntimePromptAugmentations` (does not enter Interactive scaffold stack); LJ create intake uses `ldCreateOutputType: "practice"`.

**Tests:** Identity/promptRoute assertions in s101 suite.

**Results:** Pass.

**Deviations:** None. Stage titles reused as approved.

### D2 — Practice instructional/presentation contracts

**Changed:** New `lib/ld-practice-presentation-contracts.js`; loaded in `index.html`; applied on Practice promptRoute; Design Page capture validator exempts Practice from mandatory knowledge summary (Interactive retained).

**Tests:** Contract content assertions; KS exemption covered via validator logic + package fixture without KS.

**Results:** Pass.

**Deviations:** Practice contracts are a consolidated presentation module (EP/DLA/GAM/LS/DP guidance in one block) rather than separate forked Interactive contract files — smaller surface, Practice-owned.

### D3 — Renderer + packaging

**Changed:** `build-page-model.js` `isPracticeLearnerPage` + `pageKind: "practice"`; `render-page.js` recognises practice; packaging via existing `learner_page` / `buildLearnerPackage`.

**Tests:** `tests/s101-practice-render-and-package.test.js`.

**Results:** Pass — Practice page renders with `data-page-kind="practice"` and packages without KS.

**Deviations:** None. Attempt-before scaffold relocation remains Interactive-only (aligns with “no universal attempt-before rule”).

### D4 — LJ E2E integration + workload

**Changed:** Commissioning prompts/guidance prefer Practice; workload adapter treats `practice` like Interactive activity work; production/create path uses family + intake (no silent Interactive remap).

**Tests:** Workload mapping test; commissioning prompt tests; intake topology tests.

**Results:** Pass.

**Deviations:** Full live GPT generation of a new LJ was not executed in this environment (author-facing 101E). Wiring required for commissioning→intake→render→package is in place and unit-tested.

### D5 — Hardening

**Changed:** `index.html` script tags/cache busts; bootstrap lib list; Interactive regression suites re-run.

**Results:** s91 WP3/WP4 green; s101 suites green (14/14).

---

## Minimum viable Practice v1 delivered

| Capability | Status |
| ---------- | ------ |
| `product_id: "practice"` + own promptRoute | Done |
| LJ-only commissioning (no Create declaration) | Done |
| GLC→…→DP topology reuse | Done |
| Practice-owned presentation contracts | Done |
| Explicit `pageKind: "practice"` | Done |
| Render + package without mandatory KS | Done |
| Maths content renderable in Practice pages | Done (fixture TeX) |
| Workload mapping | Done |
| Interactive unchanged | Confirmed by regression |

---

## Ready for 101E?

**Yes, pending author approval to start 101E.**

101E must generate a **new** Learning Journey from scratch using updated commissioning (prefer Practice for activity), produce Practice constituents, and review the unified learner package. Do **not** retrofit Lagrange.

---

## Not in this implementation (as approved)

- New interaction types  
- Journal / Assessment Pack Practice integration  
- Create-standalone Practice  
- GLC/MK/DLO redesign  
- Auto-migration of Interactive commissions  
- Exemplar / Lagrange modifications  

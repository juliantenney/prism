# Sprint 78 — START HERE

**Sprint:** 78 — Learner Resource Quality Recovery  
**Status:** **OPEN** (opened 2026-08-17)  
**Predecessor:** [Sprint 77 — COMPLETE / Closed](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/SPRINT-77-START-HERE.md)  
**Opening decision:** [S78-D01](decisions.md#s78-d01--open-sprint-78--learner-resource-quality-recovery)  
**Reliability decision:** [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)  
**Dashboard:** [STATUS.md](STATUS.md)  
**Plan:** [PLAN.md](PLAN.md) · **Handover:** [HANDOVER.md](HANDOVER.md) · **Briefing:** [next-chat-briefing.md](next-chat-briefing.md)

---

## If you are starting a new session

Read **[HANDOVER.md](HANDOVER.md)** first, then [STATUS.md](STATUS.md) and [PLAN.md](PLAN.md).

> **Sprint 78 is OPEN.** T-022 WS3 DLA implementation **complete**. **T-013 remains OPEN.** Next quality task: **S78-T-025** (not started). Do **not** reopen Sprint 77. Do **not** execute T-019.

---

## Working theme

Restore generated learner-resource quality by repairing instructional relationships exposed by the Lagrangian QA baseline:

```text
MODEL → ATTEMPT → CHECK → REVISE / TRANSFER
```

This is **not** “fix the Lagrangian resource.” Architectural/contract improvements should produce better resources on **regeneration**. **“Regenerate until it passes” is not an acceptable reliability outcome.**

---

## QA baseline (reference)

[POST-S77-lagrangian-qa-baseline-2026-08-14.md](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/POST-S77-lagrangian-qa-baseline-2026-08-14.md) — uncapped **70/100**; **2 Major**; F&S **30**; strengths preserved; architecture **not** failed.

Fresh interim (T-008): **87/100**; **0 Critical**; **0 Major** — WS1 **CLOSED**. Not sprint exit.

T-013-path QA (T-003 exhibit): **88/100**; F&S **78**; A5 Check Strong; A1–A4 Weak. Does **not** close T-013.

Candidate 6 (GAM attempt 2): **88/100**; F&S **92**; Subject **84**; all four activities Check Strong. Different package from the T-003 exhibit. [Disciplinary diagnostic](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md). Does **not** close T-013.

---

## Immediate priority

| Priority | Work |
| -------- | ---- |
| **Now** | Authorise **S78-T-025** disciplinary-precision design. E2 architecture diagnostic remains queued. Do not start T-019 |
| **Complete** | T-022 WS3 DLA capture · T-021 Check/revision design · T-003 diagnostic · T-018A · WS1 **87/100** · C6 disciplinary diagnostic |
| **Queued** | S78-T-024 (WS3 integration / benchmark) · S78-T-019 (activity timing) · E2 upstream-response architecture diagnostic |
| **Do not start** | Sprint 77 reopen · Lagrangian hand-edits · T-023 by default · T-019 execution · E2 sanitiser · verifier expansion |

---

## Exit benchmark

Fresh from-top Lagrangian EP → package → independent QA: **≥ 90** uncapped; **0 Critical**; **0 Major**. Must be achieved through **general architectural reliability**, not hand-tuning the Lagrangian resource. Do not weaken the QA instrument.

---

## Pack contents

| Doc | Role |
| --- | ---- |
| [SPRINT-78-CHARTER.md](SPRINT-78-CHARTER.md) | Mission, workstreams, exit gate, boundaries |
| [CONTEXT.md](CONTEXT.md) | Baseline summary, exhibits, reliability strategy, out-of-sprint items |
| [PLAN.md](PLAN.md) | Task definitions + Final Gate |
| [STATUS.md](STATUS.md) | Authoritative current snapshot |
| [decisions.md](decisions.md) | `S78-D##` decision log |
| [S78-T-001-learner-production-workspace-fulfilment-diagnostic.md](S78-T-001-learner-production-workspace-fulfilment-diagnostic.md) | WS1 diagnostic **complete** |
| [S78-T-004-learner-production-workspace-fulfilment-solution-design.md](S78-T-004-learner-production-workspace-fulfilment-solution-design.md) | WS1 design **complete** |
| [S78-T-005-dla-response-fulfilment-implementation.md](S78-T-005-dla-response-fulfilment-implementation.md) | WS1 DLA repair **complete** |
| [S78-T-007-gam-workspace-blank-cell-implementation.md](S78-T-007-gam-workspace-blank-cell-implementation.md) | WS1 GAM guard **complete** |
| [S78-T-002-modelling-practice-independence-diagnostic.md](S78-T-002-modelling-practice-independence-diagnostic.md) | WS2 diagnostic **complete** |
| [S78-T-010-modelling-practice-independence-solution-design.md](S78-T-010-modelling-practice-independence-solution-design.md) | WS2 design **complete** |
| [S78-T-011-dla-model-practice-independence-commissioning.md](S78-T-011-dla-model-practice-independence-commissioning.md) | WS2 DLA repair **complete** |
| [S78-T-012-gam-operand-aware-model-practice-independence-authoring.md](S78-T-012-gam-operand-aware-model-practice-independence-authoring.md) | WS2 GAM repair **complete** |
| [S78-T-014-gam-operational-suitability-solution-design.md](S78-T-014-gam-operational-suitability-solution-design.md) | Suitability/validity design **complete** |
| [S78-T-015-gam-operational-suitability-authoring-salience-implementation.md](S78-T-015-gam-operational-suitability-authoring-salience-implementation.md) | Suitability GAM repair **complete** (Stage-1 insufficient) |
| [S78-T-013-workstream-2-integration-verification.md](S78-T-013-workstream-2-integration-verification.md) | WS2 integration verification **OPEN** |
| [S78-T-013-candidate-4-post-t015-operational-suitability-fail.md](S78-T-013-candidate-4-post-t015-operational-suitability-fail.md) | Candidate 4: WS2 PASS + suitability FAIL |
| [S78-T-013-candidate-5-operational-suitability-review-coverage-diagnostic.md](S78-T-013-candidate-5-operational-suitability-review-coverage-diagnostic.md) | Candidate 5: A4-only review PASS = collector under/over-coverage (diagnostic only) |
| [S78-T-013-candidate-5-t015-collector-binding-repair.md](S78-T-013-candidate-5-t015-collector-binding-repair.md) | Candidate 5: T-015 collector binding repair ✅ (instrumentation only) |
| [S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md](S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md) | Candidate 6: confirmed E2-family; Copilot-visible splice upstream of Prism |
| [S78-T-013-candidate-6-disciplinary-precision-diagnostic.md](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md) | Candidate 6 attempt 2: QA 88/100; FOC/shadow-price/visual warrant gap; T-025 defined |
| [S78-T-016-operational-suitability-stage-2-enforcement-design.md](S78-T-016-operational-suitability-stage-2-enforcement-design.md) | Stage-2 enforcement design **complete** |
| [S78-T-017-gam-operational-suitability-review-pass-implementation.md](S78-T-017-gam-operational-suitability-review-pass-implementation.md) | Review pass **complete** (temporary instrumentation) |
| [S78-T-017A-operational-suitability-review-binding-hardening.md](S78-T-017A-operational-suitability-review-binding-hardening.md) | Review-scope fingerprint **complete** |
| [S78-T-018-operational-suitability-review-ux-workflow-integration.md](S78-T-018-operational-suitability-review-ux-workflow-integration.md) | GAM verification UX **complete** |
| [S78-T-018A-gam-review-scope-regression-verification-copy-paste-fix.md](S78-T-018A-gam-review-scope-regression-verification-copy-paste-fix.md) | DLA-scope leak + fenced review JSON **complete** |
| [S78-T-020-final-workflow-continue-to-authoring-cta-fix.md](S78-T-020-final-workflow-continue-to-authoring-cta-fix.md) | Final-step Continue to Authoring CTA **complete** (UI refinement) |
| [S78-T-013-candidate-2-gam-malformed-json-diagnostic.md](S78-T-013-candidate-2-gam-malformed-json-diagnostic.md) | Candidate 2 GAM E2 malformed-JSON diagnostic |
| [S78-T-003-check-revision-architecture-diagnostic.md](S78-T-003-check-revision-architecture-diagnostic.md) | WS3 diagnostic (**complete**) |
| [S78-T-021-check-revision-architecture-solution-design.md](S78-T-021-check-revision-architecture-solution-design.md) | WS3 solution design (**complete**) |
| [S78-T-022-dla-diagnostic-review-commissioning-implementation.md](S78-T-022-dla-diagnostic-review-commissioning-implementation.md) | WS3 DLA implementation (**complete**) |
| [S78-T-019-activity-timing-duration-diagnostic.md](S78-T-019-activity-timing-duration-diagnostic.md) | Activity timing diagnostic (**queued**) |

Inherited constraints: [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)

---

## Do not

- Frame Sprint 78 as hand-tuning one Lagrangian artefact  
- Treat “regenerate until it passes” as reliability success  
- Describe T-017–T-018 as rejected **or** as final architecture  
- Assume DLA / GAM / assembler / renderer ownership before diagnosis  
- Weaken the QA benchmark to hit ≥ 90  
- Reopen Sprint 77 or pull E2 / Settings / PB-FA-010 into sprint without blocking evidence  
- Claim learner-facing defect closed on unit tests alone

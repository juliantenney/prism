# Sprint 80 — START HERE

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture  
**Status:** **OPEN** (opened 2026-08-26)  
**Type:** Discovery / planning only — **not** an implementation sprint  
**Predecessor:** [Sprint 79 — CLOSED](../2026-08-26-sprint-79-gam-architecture-and-maintainability/SPRINT-79-START-HERE.md)  
**Opening decision:** [S80-D01](decisions.md#s80-d01--open-sprint-80--settings-discovery-product-value-and-policy-architecture)  
**Dashboard:** [STATUS.md](STATUS.md)  
**Plan:** [PLAN.md](PLAN.md) · **Handover:** [HANDOVER.md](HANDOVER.md) · **Briefing:** [next-chat-briefing.md](next-chat-briefing.md)

---

## If you are starting a new session

> **Read this block first.**

| Fact | State |
| ---- | ----- |
| Sprint 79 | **CLOSED** |
| DLA Phase D retirement | **COMPLETE** (post–Sprint 79 maintenance) |
| DLA live path | **Canonical-only** (`assembleDlaCanonicalContract` / `78-DLA-WS-3`) |
| GAM live path | **Canonical-only** (Sprint 79 assembler; temporary rollback retired) |
| Sprint 80 | **OPEN** |
| Sprint 80 mode | **Discovery / planning only** |
| Current task | **S80-T-007 PLAN delivered** — awaiting operator review and answers to Q1–Q4 |
| S80-T-001 … T-004 | **COMPLETE — ACCEPTED** |
| S80-T-005 | **COMPLETE** (awaiting acceptance unless separately accepted) |
| S80-T-005A | **COMPLETE** (awaiting acceptance) |
| S80-T-005B | **COMPLETE** (awaiting acceptance) |
| S80-T-005B.1 | **COMPLETE** (awaiting acceptance) — brief-factor inventory, corrected to 44 keys by T-005B.2 |
| S80-T-005B.2 | **COMPLETE — ACCEPTED** — effectiveness audit: 25 effective, 17 with no proven effect |
| S80-T-006 | **DECIDED** — Option C: Adjustments = typed workflow parameters + per-step author instruction |
| S80-T-007 | **PLAN** — target architecture + slices S1–S10; corrects T-006's projection chokepoint |
| Settings runtime implementation | **Not authorised** |
| Existing Settings catalogue | **Hypotheses**, not requirements |
| Supersession by later architecture | **Must be considered** |
| Operator decision gate | **S80-T-006** |

Do **not** activate Settings merely because controls exist.  
Do **not** implement parameterisation from T-005A.  
Cursor must **not** choose A/B/C/D.

---

## Priority now

| Priority | Work |
| -------- | ---- |
| **Now** | Operator review of [S80-T-007](S80-T-007-adjustments-target-architecture-and-implementation-plan.md) + answers to **Q1–Q4** (§22). Then authorise slice **S1** and/or **S3** |
| **Next** | **S80-T-006** — operator product/architecture decision gate (HUMAN) |
| **Stop for humans** | S80-T-006 — Cursor prepares matrix only; operator decides |
| **Do not** | Settings activation; schema migration; parameter schemas; choosing A/B/C/D in Cursor |

---

## Critical product principle (binding for this sprint)

Do **not** assume an existing Setting should be made operational merely because it exists.

For every setting, ask:

1. What user/product problem was this originally intended to solve?  
2. Is that problem still real?  
3. Has later PRISM architecture superseded the need for this control?  
4. Can PRISM now infer or determine the decision better than a global user setting?  
5. Is this genuinely authorial policy/constraint?  
6. Is it a legitimate explicit override?  
7. Would exposing it create competing authority with a stage that should own the decision?

**Hypothesis to test (not a mechanical conclusion):** generic controls such as “scaffolding level” / global pedagogical intensity may now be **SUPERSEDED** by PEL and stage-owned instructional design (DLA / GAM / Design Page), rather than dormant Settings waiting for activation.

Settings should express **authorial policy / constraint / intent**, not micromanagement of pedagogical decisions PRISM can now make contextually.

---

## Candidate strategic outcomes (all remain open)

| Code | Outcome |
| ---- | ------- |
| **A** | **DELETE SETTINGS** — insufficient product value |
| **B** | **RETAIN A REDUCED / PURPOSEFUL OVERRIDE SURFACE** |
| **C** | **RETAIN AND SUBSTANTIALLY REDESIGN SETTINGS** |
| **D** | **FURTHER EVIDENCE / PROTOTYPE REQUIRED** |

Do not structure work so that B or C is predetermined.

---

## Pack contents

- [SPRINT-80-CHARTER.md](SPRINT-80-CHARTER.md)
- [STATUS.md](STATUS.md)
- [PLAN.md](PLAN.md)
- [decisions.md](decisions.md)
- [HANDOVER.md](HANDOVER.md)
- [next-chat-briefing.md](next-chat-briefing.md)
- [README.md](README.md)
- [S80-T-001-sprint-opening-settings-history-and-current-state-diagnostic.md](S80-T-001-sprint-opening-settings-history-and-current-state-diagnostic.md) — COMPLETE / ACCEPTED
- [S80-T-002-existing-settings-catalogue-provenance-supersession-audit.md](S80-T-002-existing-settings-catalogue-provenance-supersession-audit.md) — COMPLETE / ACCEPTED
- [S80-T-003-settings-product-value-catalogue-philosophy-and-ux-framing.md](S80-T-003-settings-product-value-catalogue-philosophy-and-ux-framing.md) — COMPLETE / ACCEPTED
- [S80-T-004-policy-authority-and-stage-ownership-architecture-options.md](S80-T-004-policy-authority-and-stage-ownership-architecture-options.md) — COMPLETE / ACCEPTED
- [S80-T-005-policy-persistence-lifecycle-provenance-and-compatibility-options.md](S80-T-005-policy-persistence-lifecycle-provenance-and-compatibility-options.md) — COMPLETE (awaiting acceptance)
- [S80-T-005A-elicitation-to-workflow-to-run-parameterisation-diagnostic.md](S80-T-005A-elicitation-to-workflow-to-run-parameterisation-diagnostic.md) — COMPLETE (awaiting acceptance)
- [S80-T-005B-minimal-runtime-parameter-contract-diagnostic.md](S80-T-005B-minimal-runtime-parameter-contract-diagnostic.md)
- [S80-T-005B.1-complete-brief-factor-inventory-and-resolution-diagnostic.md](S80-T-005B.1-complete-brief-factor-inventory-and-resolution-diagnostic.md)
- [S80-T-005B.2-resolved-brief-factor-effectiveness-live-consumer-audit.md](S80-T-005B.2-resolved-brief-factor-effectiveness-live-consumer-audit.md)
- [S80-T-006-operator-product-architecture-decision-gate.md](S80-T-006-operator-product-architecture-decision-gate.md) — **authoritative product decision**
- [S80-T-007-adjustments-target-architecture-and-implementation-plan.md](S80-T-007-adjustments-target-architecture-and-implementation-plan.md) — **authoritative architecture plan** (corrects T-006 §17C)

Related prior evidence (read when needed; not rewritten here):

- [workflow-settings-catalogue-effectiveness-diagnostic.md](../../../architecture/workflow-settings-catalogue-effectiveness-diagnostic.md) — verdict **C** (redesign)
- [PB-FA-005](../../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency)
- Sprint 21 / 22 Settings operability history under `docs/development/sprints/`

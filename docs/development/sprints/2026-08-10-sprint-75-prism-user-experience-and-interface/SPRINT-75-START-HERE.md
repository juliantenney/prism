# Sprint 75 — START HERE

**Sprint:** 75 — PRISM User Experience and Interface  
**Status:** **OPEN** (opened 2026-08-10)  
**Predecessor:** [Sprint 74 — COMPLETE / Closed](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md) — do **not** reopen Sprint 74 architecture  
**Theme:** UX / interaction-design programme (not visual polish alone)  
**Charter:** [SPRINT-75-CHARTER.md](SPRINT-75-CHARTER.md)  
**Opening decisions:** [S75-D01](decisions.md#s75-d01--open-sprint-75--prism-user-experience-and-interface) · [S75-D02](decisions.md#s75-d02--sprint-75-follows-the-product-journey-and-major-product-surfaces-sequentially)  
**Methodology:** observe → understand → decide → plan → implement → verify ([ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md))  
**Successor:** Sprint 76 — **Not opened**

---

## Purpose (summary)

Systematically improve Prism’s user experience and interface so the product works as well as possible for its eventual users, now that underlying architecture has been consolidated and validated (Sprint 74 closed).

This is a **UX / interaction-design** programme. Discovery proceeds **sequentially through five programme domains** (`S75-D02`), not as one undifferentiated whole-application audit.

---

## Programme domains (`S75-D02`)

| Domain | Name |
| ------ | ---- |
| **A** | Elicitation & Workflow Generation |
| **B** | My Workflows |
| **C** | Authoring |
| **D** | Prompt Studio |
| **E** | Prompt Library |

First detailed discovery: **Domain A** (T-010). **Domains B Run and C Authoring** operator evidence recorded 2026-08-10. **Primary journey evidence complete.** Domains D–E: detailed audit when authorised.

---

## Current programme position (2026-08-11)

| Area | Status |
| ---- | ------ |
| **Create UX pass** | **COMPLETE** (`S75-D22`–`D25`) |
| **Persistence** | **SETTLED** (`S75-D21`) — do not casually reopen |
| **NEXT review** | **My Workflows** — functional / operator audit first; UI simplification after behaviour is understood |
| **Settings / parameterisation** | Later major review → [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) |
| Sprint 76 | **Not opened** |

Authoritative detail: [STATUS.md](STATUS.md) · [decisions.md](decisions.md) · [next-chat-briefing.md](next-chat-briefing.md).

### Discovery / earlier programme context (still true)

| Area | Status |
| ---- | ------ |
| Primary journey evidence (A→B→C→export) | **Recorded** (historical T-010 / T-020) |
| Domain B Settings investigation | **Complete** as investigation — implementation deferred **PB-FA-005** |
| Generic Create Workflow reviewer | **Retired** — [S75-D03](decisions.md#s75-d03--retire-generic-create-workflow-workflow-review-step-insertion) · [PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle) |
| T-020 slices C-01…C-08 / C-10 | Implemented or resolved as recorded in [STATUS.md](STATUS.md) / [decisions.md](decisions.md) |
| T-020 slices **C-09 / C-11 / C-12** | **Deferred** |
| Domains D–E detailed discovery | **Not started** |
| Domain A T-011/012/013 | **Superseded/retired** — S75-T-020 |

---

## Core UX question

For every interface surface ask:

> What is the user trying to accomplish here?

Distinguish:

| Layer | Question |
| ----- | -------- |
| **Journey** | Can the user accomplish their goal coherently? |
| **Interaction** | Are the right choices and actions presented at the right moment? |
| **Presentation** | Is the interface clear, accessible, consistent, and visually effective? |

Do **not** mistake presentation problems for interaction or journey problems.

---

## Experience before implementation

**Actual use of Prism is the primary source of UX evidence.**

Operator observation while exercising real product journeys is first-class evidence. Implementation inspection is **supporting** evidence only. Do not derive usability findings solely from static code inspection where behaviour can be observed directly.

---

## Pre-release principle

Prism remains **pre-user / pre-release**.

- Do **not** preserve existing UI merely because it exists (`S74-D09` carry-forward).  
- Historical UI behaviour is **not** a Compatibility requirement unless a current product requirement explicitly requires it.  
- Do **not** redesign during discovery — first understand what exists.

---

## Reading order

1. This file  
2. [SPRINT-75-CHARTER.md](SPRINT-75-CHARTER.md)  
3. [CONTEXT.md](CONTEXT.md) · [decisions.md](decisions.md) — **S75-D02**  
4. [STATUS.md](STATUS.md) · [PLAN.md](PLAN.md) · [decisions.md](decisions.md) — **S75-D02**  
5. [S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md](S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md) — themes & candidate slices  
6. [S75-T-010-domain-a-operator-observation-synthesis.md](S75-T-010-domain-a-operator-observation-synthesis.md) — operator evidence

Inherited (link, do not rewrite):

- [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)  
- [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
- Sprint 74 programme closure: [S74C-T-050](../2026-08-07-sprint-74c-repository-hygiene-and-historical-residue-rationalisation/S74C-T-050-final-verification-and-programme-closure.md)

---

## Immediate next action

| State | Action |
| ----- | ------ |
| **Done** | Create UX pass (`S75-D22`–`D25`); persistence **SETTLED** (`S75-D21`); earlier T-020 slices as recorded |
| **NEXT** | **My Workflows** functional / operator audit (Rename known defect; Duplicate = clean Run state — decided) |
| **After audit** | My Workflows UI simplification only once behaviour is understood |
| **Later** | Settings / parameterisation → **PB-FA-005** |
| **Deferred** | T-020 **C-09 / C-11 / C-12**; Domains D–E detailed discovery; QA lifecycle **PB-FA-006** |
| **Do not** | Casually reopen persistence; reopen Duplicate Run-state inheritance; open Sprint 76 |
| **Do not** | Reopen Sprint 74 architecture |

---

## Hard rules (this programme open)

- No UI / runtime product changes without explicit authorisation.  
- No runtime / generation / renderer / pedagogic-contract redesign casually from UX work.  
- Evidence before decisions; decisions before implementation.  
- **Experience before implementation** — use the product first.  
- Programme structure remains **evidence-led** — do not invent unauthorised implementation scope.

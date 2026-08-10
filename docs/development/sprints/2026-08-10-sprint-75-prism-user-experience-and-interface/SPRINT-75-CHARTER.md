# Sprint 75 — Charter

**Sprint:** 75 — PRISM User Experience and Interface  
**Status:** **OPEN** (opened 2026-08-10)  
**Opened:** 2026-08-10  
**Predecessor:** Sprint 74 — COMPLETE / Closed (2026-08-07) — do not reopen architecture  
**Type:** UX / interaction-design programme (discovery-led opening)  
**Start here:** [SPRINT-75-START-HERE.md](SPRINT-75-START-HERE.md)  
**Opening decisions:** [S75-D01](decisions.md#s75-d01--open-sprint-75--prism-user-experience-and-interface) · [S75-D02](decisions.md#s75-d02--sprint-75-follows-the-product-journey-and-major-product-surfaces-sequentially)  
**Related backlog (signals only — not auto-consumed):** [PB-S-003](../../../backlog/PRODUCT-BACKLOG.md) · [PB-S-004](../../../backlog/PRODUCT-BACKLOG.md)

---

## Mission

Systematically improve Prism’s **user experience and interface** so the product works as well as possible for its eventual users.

The goal is **not** simply visual polish.

The goal is coherent journeys, right-time interactions, and clear presentation — grounded in evidence about what users are trying to accomplish.

Discovery and improvement proceed **sequentially through five programme domains** (`S75-D02`), not as one undifferentiated whole-application audit.

---

## Programme intent

Sprint 74 consolidated and validated the underlying architecture (sole vNext renderer, partial→assemble generation, repository hygiene). Sprint 75 begins a **new programme** focused on the product experience those foundations support.

Treat this as a UX / interaction-design programme:

- information architecture and navigation may eventually change;  
- workflow and interaction design may eventually change;  
- terminology, visual design, feedback, accessibility, and responsive behaviour may eventually change;

…but **only** after discovery, decisions, and authorised implementation slices.

---

## Central question

Can Prism’s current interface surfaces be understood — **domain by domain, journey stage by journey stage** — well enough to decide what to improve next, without redesigning during discovery?

---

## Initial UX principles

1. **Goal first** — For every surface: what is the user trying to accomplish?  
2. **Layer discipline** — Separate journey / interaction / presentation problems.  
3. **Evidence before redesign** — Observe and understand before deciding or changing.  
4. **Pre-release honesty** — Do not retain UI solely for historical existence (`S74-D09`).  
5. **Architecture boundary** — UX work must not casually leak into generation, capture/validation/assemble, learner-renderer, or pedagogic-contract redesign.  
6. **Experience before implementation** — Actual use of Prism is the **primary** source of UX evidence; implementation inspection is **supporting** evidence (see below).  
7. **Personas not invented** — Record apparent users/goals implied by the product; flag insufficient evidence for operator discussion.  
8. **Sequential domains** — Follow product journey / major surfaces sequentially (`S75-D02`); do not assume equal effort or correct current navigation prominence.

---

## Experience before implementation (standing principle)

**Actual use of Prism is the primary source of UX evidence.**

Operator observation while exercising **real product journeys** is first-class evidence.

Implementation inspection is **supporting** evidence used to:

- explain observed behaviour;  
- locate the responsible UI/state implementation;  
- identify constraints;  
- distinguish superficial presentation issues from deeper interaction/journey issues.

Code inspection must **not** substitute for experiencing the product. Do not derive usability findings solely from static code inspection where the behaviour can be observed directly.

---

## Programme domains (`S75-D02`)

| Domain | Name | Notes |
| ------ | ---- | ----- |
| **A** | Elicitation & Workflow Generation | First detailed discovery area (T-010) |
| **B** | My Workflows | First-class; role/audience via evidence |
| **C** | Authoring | Includes preview, resources, export flows |
| **D** | Prompt Studio | First-class; relationship to primary workflow TBD |
| **E** | Prompt Library | First-class; relationship to primary workflow TBD |

Programme domains — **not** fixed implementation-task boundaries. Each may decompose into smaller journey stages where evidence supports it. Do **not** assume equal effort or that current tab prominence/navigation is correct.

Apparent primary narrative (hypothesis — verify in T-010):

> Domain A → Domain B → Domain C (Authoring, Preview, export)

Domains D and E require evidence for role, audience, and relationship to the primary workflow.

---

## Cross-cutting UX concerns

Assessed **(1) in context within each domain** and **(2) later across the product as a whole** where useful. **Not** disconnected implementation workstreams at programme opening:

navigation · orientation · terminology · progress/state feedback · errors/recovery · empty/disabled/enabled states · discoverability · cognitive load · accessibility · consistency · responsive behaviour · visual hierarchy · engineering/implementation concept leakage

---

## Goals (ordered — programme opening)

1. **Initialise** the Sprint 75 pack (`S75-T-001`) — **Done**.  
2. **Refine** programme structure — five domains, experience-before-implementation (`S75-D02`) — **Accepted**.  
3. **Define** (not yet execute) primary journey map + Domain A decomposition (`S75-T-010`).  
4. **Await authorisation** before executing T-010.  
5. **Derive** later programme structure from T-010 evidence (not invented in detail at open).

---

## Explicit non-scope (until further decision)

- Any UI / CSS / copy / interaction **implementation**  
- Runtime behaviour changes  
- Test or fixture changes (except docs-only pack work)  
- Executing **S75-T-010** without explicit authorisation  
- Detailed UX audit of Domains B–E in T-010  
- Inventing detailed later implementation tasks before T-010 evidence  
- Reopening Sprint 74 architecture  
- Generation architecture; partial / capture / validation / assemble  
- Learner renderer architecture  
- Pedagogic contracts; workflow semantics redesign  
- Opening Sprint 76  

Architectural work is allowed later **only** if UX evidence shows a genuine product requirement **and** the operator explicitly authorises it.

---

## Success criteria (programme open)

| Criterion | Measure |
| --------- | ------- |
| Pack exists | README, START-HERE, CHARTER, CONTEXT, PLAN, STATUS, HANDOVER, next-chat-briefing, decisions, T-001 |
| Top-level overview exists | `docs/sprints/sprint-75-….md` |
| Sprint 74 recorded | COMPLETE / predecessor; architecture not reopened |
| Sprint 75 recorded | OPEN |
| Five domains explicit | `S75-D02` Accepted |
| T-010 defined | Journey map + Domain A decomposition; B–E map-level only |
| T-010 not started | Awaiting operator authorisation |
| No product change | No UI/runtime/test/fixture edits |

---

## Decision and task IDs

- Decisions: `S75-D##` in [decisions.md](decisions.md)  
- Tasks: `S75-T-###` in [PLAN.md](PLAN.md)

---

## Inherited authority (link — do not duplicate)

| Document | Role |
| -------- | ---- |
| [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) | Browser-only, one definitive path, pre-release Compatibility (`S74-D03`…`S74-D09`) |
| [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) | Evidence, ownership, small reversible slices, verify before commit |
| [S74-D11](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md) | Sprint 74 programme closed |
| [S74C-D02](../2026-08-07-sprint-74c-repository-hygiene-and-historical-residue-rationalisation/decisions.md) | Git history as default archive |

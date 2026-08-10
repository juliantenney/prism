# S75-T-001 — Sprint pack initialisation

**Task:** S75-T-001  
**Status:** **Done** (2026-08-10)  
**Mode:** Documentation only — no product / UI / runtime / test / fixture changes  
**Opening decision:** [S75-D01](decisions.md#s75-d01--open-sprint-75--prism-user-experience-and-interface)  
**Sprint status after this task:** **OPEN**

---

## 1. Programme purpose

Sprint 75 systematically improves Prism’s **user experience and interface** so the product works as well as possible for its eventual users, now that underlying architecture has been consolidated and validated.

This is a **UX / interaction-design programme**, not a visual-polish sprint and not a continuation of Sprint 74 architectural rationalisation.

---

## 2. Boundaries

| In programme (eventually, after evidence + decisions) | Out of T-001 / until further authorisation |
| ----------------------------------------------------- | ------------------------------------------ |
| Information architecture, navigation, workflow UX | Any UI implementation |
| Interaction design, terminology, visual design | Runtime behaviour changes |
| Feedback / state presentation, accessibility, responsive behaviour | Test / fixture product changes |
| Discovery audit (T-010 when authorised) | Executing T-010 without authorisation |
| Evidence-led later tasks | Inventing detailed implementation tasks now |
| | Reopening Sprint 74 architecture |
| | Generation / partial·capture·validation·assemble redesign |
| | Learner renderer architecture; pedagogic contracts; workflow semantics |
| | Opening Sprint 76 |

Architectural change is allowed later **only** if UX evidence demonstrates a genuine product requirement **and** the operator explicitly authorises it.

---

## 3. Initial UX principles

1. Goal first — what is the user trying to accomplish?  
2. Layer discipline — journey ≠ interaction ≠ presentation.  
3. Evidence before redesign; do not redesign during discovery.  
4. Pre-release honesty — historical UI is not Compatibility by default (`S74-D09`).  
5. Architecture boundary — UX must not casually leak into architecture redesign.  
6. Operator observation is first-class evidence.  
7. Do not invent personas; flag insufficient evidence.

---

## 4. Proposed T-010 scope

**S75-T-010 — Current-state UX and user-journey audit** (discovery only).

Minimum surfaces: entry/orientation; Create Workflow; configuration; generation/execution; progress/feedback; errors/recovery; My Workflows; Authoring; Preview; Resources; export/download/open; navigation; terminology; empty/disabled/enabled states; discoverability; cognitive load; accessibility; visual hierarchy; consistency; engineering-concept leakage. Classify Prompt Studio / Prompt Library.

Full checklist and exclusions: [PLAN.md](PLAN.md#s75-t-010--current-state-ux-and-user-journey-audit).

**Not executed** under T-001.

---

## 5. Evidence sources T-010 will use

| Source | Role |
| ------ | ---- |
| A. Operator observation | Actual use + reported friction |
| B. Implementation evidence | Inspection of UI structure / interaction paths (no edits) |
| C. Product intent | Docs, constraints, supported workflows |

---

## 6. Explicit exclusions (T-001)

- UI / CSS / copy / interaction changes  
- Runtime / generation / renderer / pedagogic / workflow-semantics changes  
- Beginning S75-T-010  
- Detailed later implementation task invention  
- Reopening Sprint 74  
- Opening Sprint 76  

---

## 7. First task identifiers

| ID | Role | State after T-001 |
| -- | ---- | ----------------- |
| **S75-T-001** | Sprint pack initialisation | **Done** |
| **S75-T-010** | Current-state UX and user-journey audit | **Defined — Not started** (await authorisation) |
| **S75-D01** | Open Sprint 75 | **Accepted** |

---

## 8. Scope establishment (inspection for boundaries — not the audit)

Enough existing documentation and chrome was inspected to establish programme scope — **not** to perform T-010:

| Evidence | Finding used for boundaries |
| -------- | --------------------------- |
| Sprint 74 START-HERE / S74-D11 / S74C-T-050 | Predecessor COMPLETE / Closed; architecture not reopened |
| ARCHITECTURAL-CONSTRAINTS + ENGINEERING-DISCIPLINES | Inherited constraints and methodology |
| `index.html` primary tabs | Create Workflow · My Workflows · Authoring · Prompt Studio · Prompt Library |
| Sprint 74 CONTEXT product narrative | Create Workflow → My Workflows → Authoring → Preview / HTML / ZIP |
| PRODUCT-BACKLOG PB-S-003 / PB-S-004 | Related UX friction signals; not auto-consumed |

---

## 9. Files created / updated

### Created

| Path |
| ---- |
| `docs/development/sprints/2026-08-10-sprint-75-prism-user-experience-and-interface/README.md` |
| `…/SPRINT-75-START-HERE.md` |
| `…/SPRINT-75-CHARTER.md` |
| `…/CONTEXT.md` |
| `…/PLAN.md` |
| `…/STATUS.md` |
| `…/HANDOVER.md` |
| `…/next-chat-briefing.md` |
| `…/decisions.md` |
| `…/S75-T-001-sprint-pack-initialisation.md` |
| `docs/sprints/sprint-75-prism-user-experience-and-interface.md` |

### Updated (predecessor pointers only — no architecture reopen)

| Path | Change |
| ---- | ------ |
| Sprint 74 README / START-HERE / STATUS / top-level overview | Next programme → Sprint 75 **OPEN** (link) |
| Sprint 74C STATUS / HANDOVER / next-chat-briefing | Next programme → Sprint 75 **OPEN** (link) |

### Not modified

Runtime (`app.js`, `lib/**`, CSS product sheets), tests, fixtures, generation/renderer architecture.

---

## 10. Programme state

| Item | State |
| ---- | ----- |
| Sprint 74 | **COMPLETE / Closed** (predecessor) |
| Sprint 75 | **OPEN** |
| S75-T-001 | **Done** |
| S75-T-010 | **Defined — Not started** |
| Sprint 76 | **Not opened** / not relevant yet |
| Product / UI changes | **None** |

---

## Stop condition

**Stop after T-001.** Do not begin S75-T-010. Do not make product/UI changes.

---

## 11. Post-init refinement (2026-08-10 — after T-001; not part of original T-001 scope)

Operator-reviewed programme structure refinement recorded separately from T-001 completion:

| Item | Change |
| ---- | ------ |
| **S75-D02** | Accepted — five programme domains (A–E); sequential discovery; experience-before-implementation; cross-cutting concerns posture |
| **S75-T-010** | Reframed from undifferentiated whole-application audit to **Primary journey map and Domain A decomposition** |
| **First detailed area** | Domain A — Elicitation & Workflow Generation |
| **Domains B–E** | Identified at programme-map level; not audited in detail in T-010 |

Original T-001 scope and completion (§§1–10) unchanged. See [decisions.md](decisions.md#s75-d02--sprint-75-follows-the-product-journey-and-major-product-surfaces-sequentially) and [PLAN.md](PLAN.md).

**Note:** At T-001 completion, T-010 was defined as a broad current-state UX audit. That definition was superseded for planning purposes by S75-D02 — not retroactively applied to T-001 history.

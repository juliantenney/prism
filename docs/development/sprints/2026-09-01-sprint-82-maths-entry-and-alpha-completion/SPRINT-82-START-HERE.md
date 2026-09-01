# Sprint 82 — START HERE

**Sprint:** 82 — Maths Entry & Alpha Completion  
**Status:** **OPEN** (opened 2026-09-01)  
**Product status:** **WORKING ALPHA** (first-class self-study / workshop; boundary = Sprint 80 T-008)  
**Predecessor:** [Sprint 81 — CLOSED](../2026-08-28-sprint-81-learner-workspace-investigation-and-surface-architecture/SPRINT-81-START-HERE.md)  
**Opening decision:** [S82-D01](decisions.md#s82-d01--open-sprint-82--maths-entry--alpha-completion)  
**Dashboard:** [STATUS.md](STATUS.md)  
**Plan:** [PLAN.md](PLAN.md) · **Handover:** [HANDOVER.md](HANDOVER.md) · **Briefing:** [next-chat-briefing.md](next-chat-briefing.md)

---

## If you are starting a new session

> **Read this block first.**

| Fact | State |
| ---- | ----- |
| Product | **WORKING ALPHA** — not production-ready; no formal WCAG claim |
| First-class gate | `npm run test:first-class` → **339/339** |
| D-014 | **RESOLVED** |
| Sprint 81 | **CLOSED** — B shipped (revision loop); do not reopen |
| Sprint 82 | **OPEN** — bounded maths-entry alpha completion |
| Current gate | **S82-G3** — realistic Lagrangian colleague validation |
| S82-G2A | **COMPLETE** — [evidence](S82-G2A-spike-evidence.md) · [S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive) accepted |
| S82-G1 | **COMPLETE** — semantic input modality ([Gate 1](../../governance/semantic-learner-input-modality-gate-1.md)) |
| S82-G2 | **COMPLETE** — [T-001](S82-T-001-maths-entry-gate-2-learner-interaction-diagnostic.md) |
| Graphics material-role fix | **CLOSED** (pre-S82); not an active stream |

Do **not** reopen Sprint 81 surface-family architecture, criterion→field mapping, or free-text diagnosis.

---

## Priority now

| Priority | Work |
| -------- | ---- |
| **Now** | **S82-G3** — realistic Lagrangian colleague validation ([PLAN.md](PLAN.md) §S82-G3) |
| **Then** | G3 Lagrangian validation · G4 a11y/keyboard · G5 closeout |
| **Do not** | Rich mixed editor; CAS; table maths (unless live validation forces it); Graphics redesign |

---

## Pack contents

- [SPRINT-82-CHARTER.md](SPRINT-82-CHARTER.md)
- [STATUS.md](STATUS.md)
- [PLAN.md](PLAN.md)
- [decisions.md](decisions.md)
- [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md)
- [HANDOVER.md](HANDOVER.md)
- [next-chat-briefing.md](next-chat-briefing.md)
- [S82-T-001](S82-T-001-maths-entry-gate-2-learner-interaction-diagnostic.md) — Gate 2 diagnostic (complete)
- [S82-G2A](S82-G2A-mathlive-interaction-spike.md) — Gate 2A spike (**COMPLETE**)

Governance: [Gate 1](../../governance/semantic-learner-input-modality-gate-1.md) · [Gate 2 diagnostic](../../governance/semantic-learner-input-modality-gate-2-diagnostic.md)

Programme pointer: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)

---

## Critical principles (binding)

1. Dedicated mathematical evidence requires an appropriate learner interaction — not merely semantic commissioning.  
2. `surfaceKind` remains `text_entry`; canonical evidence remains opaque string/TeX.  
3. DLA owns `input_modality`; GAM preserves; composition joins by governed exact label.  
4. Learner TeX is untrusted — never route through Markdown emphasis transforms.  
5. Native textarea remains graceful fallback and canonical persistence source.  
6. Accessibility alpha baseline must not be materially degraded.  
7. This sprint is **not** a general mathematical authoring programme.

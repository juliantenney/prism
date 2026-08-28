# Sprint 81 — Charter

**Sprint:** 81 — Learner Workspace Investigation & Surface Architecture  
**Status:** **CLOSED / COMPLETE** (2026-08-28)  
**Type:** Investigation / planning / architecture → bounded B implementation  
**Outcome:** **B — TARGETED ENHANCEMENT** ([S81-D02](decisions.md#s81-d02--b-targeted-enhancement-narrowed))  
**Predecessor:** Sprint 80 — CLOSED; WORKING ALPHA; D-014 RESOLVED  
**Closure:** [SPRINT-81-CLOSURE.md](SPRINT-81-CLOSURE.md)  
**Start here:** [SPRINT-81-START-HERE.md](SPRINT-81-START-HERE.md)  
**Opening decision:** [S81-D01](decisions.md#s81-d01--open-sprint-81--learner-workspace-investigation--surface-architecture)

---

## Mission (fulfilled)

Establish evidence-backed understanding of what learning activities PRISM currently produces, what learners are asked to do, what evidence those activities generate for diagnostic feedback, and whether (and how) alternative interaction surfaces would materially improve the learner experience — **without presupposing that change is required**.

**Final conclusion:** existing surfaces were substantially appropriate; the evidenced weakness was the revision/self-review loop. Sprint closed after shipping asymmetric R1 + R4 accompaniment under outcome **B**.

## Outcome options (resolved)

| ID | Outcome | Disposition |
| -- | ------- | ----------- |
| **A** | DO NOTHING | Considered; not selected |
| **B** | TARGETED ENHANCEMENT | **ACCEPTED / SHIPPED** |
| **C** | SURFACE-FAMILY ARCHITECTURE | **Rejected** on evidence |
| **D** | SUBSTANTIAL OVERHAUL | **Rejected** on evidence |

## Scope guard (binding — historical)

Investigation kickoff forbade premature implementation. Authorised B work was limited to R1 + R4. The sprint did **not** implement surface families, GAM redesign, diagnostic engines, criterion→field mapping, accessibility remediation programmes, RC3–RC8 reopen, or Maths Entry.

## Non-negotiable design constraints (retained)

### Diagnostic feedback

```text
learning intent → activity → learner action → learner evidence
  → interaction surface → diagnostic feedback
```

Not merely: `activity type → widget`.

### Accessibility

Preserve the established alpha accessibility baseline. **No formal WCAG conformance claimed.**

### Progressive enhancement

Specialised surfaces are not assumed better than text. Existing representations remain the default.

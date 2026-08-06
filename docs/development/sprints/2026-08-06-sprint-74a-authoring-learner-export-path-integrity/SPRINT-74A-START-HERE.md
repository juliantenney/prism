# Sprint 74A — START HERE

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Status:** **COMPLETE / Closed**  
**Opened:** 2026-08-06  
**Closed:** 2026-08-06  
**Type:** Implementation sprint  
**Parent:** [Sprint 74](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md) — **OPEN**  
**Charter:** [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md)  
**Final report:** [SPRINT-74A-FINAL-REPORT.md](SPRINT-74A-FINAL-REPORT.md)  
**Verification:** [S74A-T-050-sole-renderer-final-verification.md](S74A-T-050-sole-renderer-final-verification.md)  
**Opening:** [S74A-D01](decisions.md#s74a-d01-open-sprint-74a-for-authoring--learner-export-path-integrity)  
**Sole renderer:** [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) — **Accepted**  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)

---

## Mission

Establish **vNext as Prism’s sole learner-renderer implementation**, remove the **obsolete** renderer and its redundant paths, and verify that all existing learner-export functionality remains stable through the **production browser path**.

One definitive codebase — not documentation-only “one supported path.”

## Product spine (definitive)

```text
Create Workflow → My Workflows → Authoring → Assemble → Preview (vNext)
  → HTML / learner ZIP / Open in New Tab
```

## Hard constraints

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)

- Browser-only runtime; static `index.html` deployment  
- Node = development/test tooling; Node-based tests ≠ deployment proof  
- Production browser path = deployment confidence  
- One definitive implementation per established responsibility (`S74-D07`)  
- Evidence-led removal of obsolete alternatives; Compatibility only for current product requirements  
- `app.js` by ownership, not size  

## Scope / non-scope (summary)

| In | Out |
| -- | --- |
| Artefact integrity; pre-/post-removal browser verification | Indiscriminate deletion |
| Exact obsolete-renderer removal inventory (T-040) | Retaining obsolete renderer as Compatibility |
| Remove obsolete implementation (T-045) | In-tree archive / dead flags / hidden selectors |
| Docs/tests for one definitive renderer | 74B/74C; schema redesign; size-driven `app.js` split |

## Sprint outcome

T-001…**T-050** are **Done**. Sprint 74A is **COMPLETE / Closed**.

- Sole learner-page renderer: **vNext**  
- Verification: [S74A-T-050](S74A-T-050-sole-renderer-final-verification.md)  
- Final report: [SPRINT-74A-FINAL-REPORT.md](SPRINT-74A-FINAL-REPORT.md)  
- Parent Sprint 74 remains **OPEN**; **74B / 74C not opened**

## Reading order (post-closure)

1. [SPRINT-74A-FINAL-REPORT.md](SPRINT-74A-FINAL-REPORT.md)  
2. [S74A-T-050-sole-renderer-final-verification.md](S74A-T-050-sole-renderer-final-verification.md)  
3. [SPRINT-74A-CLOSURE.md](SPRINT-74A-CLOSURE.md) · [STATUS.md](STATUS.md)  
4. Parent [Sprint 74 STATUS](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/STATUS.md)

## Immediate next action

Do **not** open Sprint 74B or 74C automatically. Continue only under the parent Sprint 74 programme if authorised.

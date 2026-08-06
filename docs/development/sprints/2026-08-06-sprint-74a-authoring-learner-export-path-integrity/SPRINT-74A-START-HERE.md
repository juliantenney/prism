# Sprint 74A — START HERE

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Status:** **OPEN**  
**Opened:** 2026-08-06  
**Type:** Implementation sprint  
**Parent:** [Sprint 74](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md)  
**Charter:** [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md)  
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

## Current task

**S74A-T-020** — vNext generated browser artefact integrity (**Not started — next**).

T-001 and T-010 **Done**. T-010 Compatibility-era audit is historical — see supersession note on the evidence report. Implementation removal is **T-045** after T-030 and T-040.

## Reading order

1. This file → [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md)  
2. [decisions.md](decisions.md) (`S74A-D02`) · parent `S74-D07`  
3. [PLAN.md](PLAN.md) · [STATUS.md](STATUS.md) · [next-chat-briefing.md](next-chat-briefing.md)  

## Immediate next action

When authorised: begin **S74A-T-020**. Do not begin T-045 in the same change. Do not open 74B/74C.

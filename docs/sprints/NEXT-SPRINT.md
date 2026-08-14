# Next sprint — selection pointer

**Status:** Sprint 76 **COMPLETE / Closed** (2026-08-14). Sprint 75 **COMPLETE / Closed**.  
**Updated:** 2026-08-14

---

## Current programme — Prompt Contract Architecture

**Working title:** Prompt Contract Architecture  

**Intent:** Make model-visible instruction architecture comprehensible, traceable, and maintainable while **preserving established behavioural contracts**. This is **not** initially a “make prompts shorter” sprint.

**Sprint pack:** not opened in the Sprint 76 close-out. Open a dated pack when authorised.

**Close-out SSOT:** [S76-T-049-sprint-76-closeout-and-prompt-architecture-handover.md](../development/sprints/2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/S76-T-049-sprint-76-closeout-and-prompt-architecture-handover.md) · [sprint-76-closeout.md](sprint-76-closeout.md)

### Immediate task

**DIAGNOSTIC / INVENTORY** of model-visible prompt construction across relevant workflow stages (blocks, authorship, injection sites and multiplicity, assembled order, invariant ownership, duplication, examples that introduce semantics, validator vs authoring guidance, unique vs assembled cost, dead surfaces, defect-to-instruction traceability).

Do **not** implement P05, GAM D/E, Graphics, or prompt restructuring from this pointer. Do **not** reopen T-031. Do **not** add a generic DLA “must be solvable” clause.

### Carry-forward (do not drop)

| Item | Status |
| ---- | ------ |
| P05 dual DLA contract/shape Copy injection | OPEN / deferred until architecture is known |
| GAM D pedagogical-function fulfilment | OPEN |
| GAM E learner-facing corruption | OPEN (separate from D and T-031) |
| Graphics / image lifecycle | OPEN / SEPARATE |
| T-032 A4 constructive alignment | OPEN diagnostic; T-033 stays closed |
| Settings (PB-FA-005) | Deferred unless re-prioritised |
| S76-D03 prompt-engineering discipline | Transferred here as architecture work |

### Principles (not a designed hierarchy)

Behaviour preservation first · inventory before restructuring · structure before deletion · one canonical home per invariant where possible · examples illustrate rather than silently contract · authoring guidance ≠ validators · inspectable assembly/order · preserve stage/layer ownership · UNIQUE and ASSEMBLED costs measured separately · do not change behaviour merely to tidy prose.

---

## Closed — Sprint 76

**DLA rationalisation, task–material sufficiency, and content-quality consistency**

| Resource | Path |
| -------- | ---- |
| Closeout | [sprint-76-closeout.md](sprint-76-closeout.md) |
| Close-out artefact | [S76-T-049-sprint-76-closeout-and-prompt-architecture-handover.md](../development/sprints/2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/S76-T-049-sprint-76-closeout-and-prompt-architecture-handover.md) |
| Start here | [SPRINT-76-START-HERE.md](../development/sprints/2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/SPRINT-76-START-HERE.md) |
| Handover | [HANDOVER.md](../development/sprints/2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/HANDOVER.md) |
| Status | [STATUS.md](../development/sprints/2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/STATUS.md) |
| Top-level charter | [sprint-76-dla-rationalisation-and-content-quality-consistency.md](sprint-76-dla-rationalisation-and-content-quality-consistency.md) |

Live contract at close: **`76-DLA-PARTIAL-9`**. Unique DLA contract+shape **18,872**; Copy assembled ×2 **37,744**.

---

## Closed — Sprint 75

| Resource | Path |
| -------- | ---- |
| Closeout | [sprint-75-closeout.md](sprint-75-closeout.md) |
| Final report | [SPRINT-75-FINAL-REPORT.md](../development/sprints/2026-08-10-sprint-75-prism-user-experience-and-interface/SPRINT-75-FINAL-REPORT.md) |
| Closure record | [SPRINT-75-CLOSURE.md](../development/sprints/2026-08-10-sprint-75-prism-user-experience-and-interface/SPRINT-75-CLOSURE.md) |
| Portable pack | [SPRINT-75-START-HERE.md](../development/sprints/2026-08-10-sprint-75-prism-user-experience-and-interface/SPRINT-75-START-HERE.md) |
| Top-level charter | [sprint-75-prism-user-experience-and-interface.md](sprint-75-prism-user-experience-and-interface.md) |

---

## Historical — Sprint 74 programme (closed)

Sprint 74 architecture consolidation remains **COMPLETE / Closed**. Do not reopen from next-work pointers.

| Resource | Path |
| -------- | ---- |
| Sprint 74 | [sprint-74-architecture-consolidation-and-rationalisation.md](sprint-74-architecture-consolidation-and-rationalisation.md) |
| Constraints | [ARCHITECTURAL-CONSTRAINTS.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) |

---

## Planning principle

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria.

---

## Navigation

| Resource | Path |
| -------- | ---- |
| Product backlog | [PRODUCT-BACKLOG.md](../backlog/PRODUCT-BACKLOG.md) |
| Sprint index | [README.md](README.md) |
| Engineering disciplines | [ENGINEERING-DISCIPLINES.md](../development/ENGINEERING-DISCIPLINES.md) |

# Sprint 56B — Planning Backlog

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Status:** Complete (2026-07-06) — successor: [Sprint 56C](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-START-HERE.md)  
**Seeded from:** [DESIGN-PAGE-MIGRATION-STRATEGY.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-MIGRATION-STRATEGY.md)

**Legend:** `Pending` · `In progress` · `Done` · `Deferred`

---

## Workstream 1 — Open Question Resolution

**Migration strategy phase:** A (Clarification)  
**Prerequisite for:** Workstreams 2–5

| ID | Item | OQ | Status | Notes |
| -- | ---- | -- | ------ | ----- |
| W1-01 | **Author vs organise** — evidence gather and decision | OQ-02 | Pending | **Critical path** — blocks wrapper review |
| W1-02 | **VA placement** — renderer consumption audit; stay vs relocate | OQ-13 | Pending | Blocks C8 boundary review |
| W1-03 | **Knowledge summary policy** — transport vs author vs omit options | OQ-17 | Pending | Blocks C7 boundary review |
| W1-04 | **Dual-path strategy** — Copilot-primary vs PRISM-repair backstop | OQ-24 | Pending | Blocks validation strategy in plan |
| W1-05 | **Canonical acceptance fixtures** — identify baseline workflows | OQ-25 | Pending | Blocks plan §validation |
| W1-06 | **Programme sequencing** — Sprint 56C vs Sprint 57 | OQ-23 | Done | Migration = 56C; 57 reserved |
| W1-07 | Register resolutions in open questions log | — | Pending | After W1-01–W1-06 |

---

## Workstream 2 — Boundary Review

**Migration strategy phase:** B (Boundary review)  
**Prerequisite:** W1-01 for wrapper; W1-02 for VA; W1-03 for knowledge  
**Order:** Low → high sensitivity (analysis only — no changes)

| ID | Area | Cluster | Status | Depends on | Notes |
| -- | ---- | ------- | ------ | ---------- | ----- |
| W2-01 | Generation notes | C12 | Pending | — | Low sensitivity |
| W2-02 | EQF on emit | R-74 | Pending | — | External Candidate |
| W2-03 | Intent-class elicitation | R-82 | Pending | — | Not on compose path |
| W2-04 | Guardrail-to-risk mapping | C9 | Pending | — | Descriptive; informs consolidation |
| W2-05 | Brevity / density params trace | R-78–R-80 | Pending | — | Document conflict with R-22 |
| W2-06 | Profiles matrix | C11 | Pending | — | Learner / facilitator / assessment |
| W2-07 | Knowledge summaries | C7 | Pending | W1-03 | OQ-17 |
| W2-08 | Wrapper stack overlap | C6 | Pending | W1-01 | Journey + authorial + rhetoric |
| W2-09 | Visual affordances | C8 | Pending | W1-02 | OQ-13 |
| W2-10 | Transport core affirmation | C1–C3 | Pending | — | **Validation anchor** — baseline last |

**Exit:** Boundary disposition **options** documented per area (not selected until Workstream 4).

---

## Workstream 3 — Dependency Impact Review

**Migration strategy phase:** C (Dependency resolution)  
**Prerequisite:** Workstream 2 options drafted

| ID | Item | Status | Notes |
| -- | ---- | ------ | ----- |
| W3-01 | Export contract impact per boundary option | Pending | C14 — `sections[]` + `materials.*` invariant |
| W3-02 | Validator / repair tier alignment per option | Pending | C10; OQ-24 outcome |
| W3-03 | Renderer compatibility assessment | Pending | `renderer-export-behavior.md` |
| W3-04 | Learner output impact summary | Pending | Failure modes A–G mapping |
| W3-05 | Compose contract / ADR-06 coherence check | Pending | DQ-02 |
| W3-06 | Produce dependency impact matrix | Pending | Consolidate W3-01–W3-05 |

---

## Workstream 4 — Architecture Approval

**Migration strategy phase:** D (Architecture approval)  
**Prerequisite:** Workstreams 1–3 substantially complete

| ID | Item | Status | Notes |
| -- | ---- | ------ | ----- |
| W4-01 | Present derived identity + Layer 3 disposition options | Pending | From target derivation |
| W4-02 | Stakeholder review session | Pending | |
| W4-03 | Record approvals in architecture approval tracker | Pending | |
| W4-04 | Resolve deferrals with owners and accepted risk | Pending | |
| W4-05 | Programme sequencing statement finalised | Done | OQ-23 — Sprint 56C execution |

---

## Workstream 5 — Implementation Plan Population

**Migration strategy phase:** E (Implementation planning)  
**Prerequisite:** W4-03 architecture approval

| ID | Item | Status | Notes |
| -- | ---- | ------ | ----- |
| W5-01 | Populate §1 approved architecture | Pending | |
| W5-02 | Populate §2 dependency decisions | Pending | From W3-06 |
| W5-03 | Populate §3 migration phases (engineering) | Pending | Derived from approved disposition |
| W5-04 | Populate §4 validation strategy | Pending | From migration strategy Phase 5 |
| W5-05 | Populate §5 implementation order | Pending | |
| W5-06 | Populate §6 risks | Pending | |
| W5-07 | Sign-off block completed | Pending | |
| W5-08 | Charter implementation sprint (out of 56B scope) | Pending | Separate charter TBD |

---

## Cross-workstream dependencies

```
W1 (OQ resolution)
  → W2 (boundary review)
    → W3 (dependency impact)
      → W4 (approval)
        → W5 (implementation plan)
```

**Critical path:** W1-01 (OQ-02) → W2-08 (wrapper) → W3-06 → W4-03 → W5-07

---

## References

| Document | Role |
| -------- | ---- |
| [DESIGN-PAGE-MIGRATION-STRATEGY.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-MIGRATION-STRATEGY.md) | Phase definitions |
| [DESIGN-PAGE-DEPENDENCY-ANALYSIS.md](../2026-07-06-sprint-56a-design-page-simplification-planning/DESIGN-PAGE-DEPENDENCY-ANALYSIS.md) | Cluster reference |
| [SPRINT-56B-OPEN-QUESTIONS.md](SPRINT-56B-OPEN-QUESTIONS.md) | OQ tracker |
| [SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md](SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md) | Approval gate |

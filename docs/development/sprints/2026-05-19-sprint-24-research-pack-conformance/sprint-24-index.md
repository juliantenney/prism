# Sprint 24 index — Research pack semantic conformance review

**Pack path:** `docs/development/sprints/2026-05-19-sprint-24-research-pack-conformance/`  
**Date:** 2026-05-19  
**Status:** **Slice 24-1 closed** — conformance audit delivered

**Predecessor:** [Sprint 23 — Learning Design pack rationalisation](../2026-05-18-sprint-23-learning-design-pack-rationalisation/sprint-23-closeout.md)

**Verification:** **195 passed**, 0 failed (`node --test tests/*.test.js`)

---

## Purpose

Evaluate whether the **Research pack** already conforms sufficiently to the **Sprint 23 governance model**, without assuming Learning Design-level remediation is required.

**Intentionally a short audit sprint** — not a major architectural programme.

---

## Comparison baseline (Sprint 23)

| Pattern | Use in audit |
|---------|--------------|
| Declarative pack semantics | Pack owns meaning; runtime interprets |
| Ownership classes | Workflow / step / topology / artefact / prompt-local |
| Settings operational authority | `*ParameterControls` where declared |
| Elicitation initialisation | Brief → constraints / patches |
| PF vs Settings alignment | No duplicate surfaces |
| Topology vs parameter semantics | Graph gates ≠ tunables |
| Inheritance doctrine | Where cross-step defaults exist |
| Canonical-step governance | `canonical_step_id` + pack metadata |

**Primary targets:**

- `domains/research/domain-research-step-patterns.md`
- Related PF sections, `workflowBriefConfig`, `mappingRules`
- Research-specific runtime branches in `app.js` (review only)

---

## Portable pack (this folder)

| File | Purpose |
|------|---------|
| [`sprint-24-index.md`](sprint-24-index.md) | This index |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Status + verdict |
| [`review-log.md`](review-log.md) | Decisions R24-001+ |
| [`slice-24-1-charter.md`](slice-24-1-charter.md) | Slice 24-1 charter (closed) |
| [`research-pack-conformance-audit.md`](research-pack-conformance-audit.md) | **Slice 24-1 deliverable** |

---

## Slice sequence

| Slice | Focus | Status |
|-------|--------|--------|
| **24-1** | Research pack semantic conformance audit | **Closed** |

Optional future slices (24-2+) only if product charters Settings parity or canonical-step expansion — **not** implied by 24-1.

---

## Programme constraints

- No runtime redesign  
- No Settings redesign  
- No provenance redesign  
- No workflow graph redesign  
- No automatic metadata rationalisation unless evidence demands it  

---

## 24-1 headline result

> **Research pack already sufficiently conforms.**  
> Valid variant: **workflow-constraint + PF-authoritative** (0 `stepParameterControls`, rich declarative `workflowPolicy`).  
> **Minor drift only** — no LD-style remediation required by default.

---

## Verification

```bash
node --test tests/*.test.js
```

**Result:** **195 passed**, 0 failed.

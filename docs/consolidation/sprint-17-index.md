# Sprint 17 — consolidation index

**Date:** 2026-05-15  
**Sprint title:** Sprint 17 — Research Elicitation & Sparse Brief Testing

**Status:** **Closed (implementation)** — Slices 0–5 landed; Slice 4 extract proposal deferred. **85 tests green.**

---

## Core artefacts

| Document | Role |
|----------|------|
| [`sprint-17-implementation-summary.md`](sprint-17-implementation-summary.md) | **Closeout** — slices 0–5, policy mechanisms, tests, risks, deferments |
| [`sprint-17-research-elicitation-sparse-brief-prep.md`](sprint-17-research-elicitation-sparse-brief-prep.md) | Prep note: audit, factor inventory, sparse examples, cross-domain lessons |
| [`sprint-17-explicit-extract-profile-proposal.md`](sprint-17-explicit-extract-profile-proposal.md) | Slice 4 — `workflowBriefConfig.explicitExtract` audit/proposal; **implementation deferred** |

---

## Implementation slices

| Slice | Status | Summary |
|-------|--------|---------|
| 0 | Landed | Sparse-brief golden fixtures S1–S6; `tests/workflow-research-sparse-briefs.test.js` |
| 1 | Landed | `validationRules`, `disclosurePolicy`, Planning notices |
| 2 | Landed | `conflictPolicies` (chained in validation pass) |
| 3 | Landed | Heuristic proceed gates on `workflowPolicy` |
| 4 | Docs only | Explicit extract profile proposal — no runtime |
| 5 | Landed | Structured planning disclosure (categories, rejected inference, gate notices) |

**Verification:** `node --test tests/*.test.js` → **85 passed**, **0 failed**.

---

## Baseline

| Sprint | Role |
|--------|------|
| **Sprint 16** | **Closed** — shared `page` renderer; shape-first tests; 80 green |
| **Sprint 15** | Research → Design Page → Utilities E2E proof |
| **Sprint 14** | Runnable Research + save/export integrity |

---

## Out of scope (Sprint 17)

- Renderer / Utilities HTML
- Workflow schema redesign
- Domain-pack rewrite (beyond bounded config keys)
- Orchestration architecture
- **LD implementation sprint**
- Broad UI redesign
- Prompt Studio merge
- **`explicitExtract` runtime** (proposal only)

---

## Follow-on (post-closeout, not Sprint 17 scope)

| Candidate | Source | Doc |
|-----------|--------|-----|
| **Topic-generation sufficiency / high-impact clarification** | Manual smoke test — required factors resolved but topic scope under-specified for `generate_from_topic` | [`sprint-17-implementation-summary.md` §12](sprint-17-implementation-summary.md) |
| `explicitExtract` 4a/4b | Slice 4 proposal | [`sprint-17-explicit-extract-profile-proposal.md`](sprint-17-explicit-extract-profile-proposal.md) |

Possible future pack/runtime concepts (documentation only): `highImpactClarificationRules`, `topicSpecificityChecks`, `minimumContextForTopicGeneration`, planning adequacy notices.

---

## Review log

- **2026-05-15** — Sprint 17 index and prep note created.
- **2026-05-15** — Slices 0–3 landed; 85 tests green.
- **2026-05-15** — Slice 4 explicit-extract proposal; Slice 5 planning disclosure; implementation summary and closeout.
- **2026-05-15** — Post-closeout: topic-generation sufficiency gap recorded as future candidate (not a Sprint 17 defect).

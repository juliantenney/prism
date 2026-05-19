# Context files — Sprint 26 (pedagogical intent)

**Pack:** `docs/development/sprints/2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/context-files/`

---

## Rules

1. **Live repo is authoritative** — paths at the top of each file point to canonical sources.
2. **Bounded excerpts only** — no full `app.js`, no full pack markdown dumps.
3. **Explain why** each excerpt matters for topology / elicitation investigation.
4. **Refresh** when `extractWorkflowBriefExplicitFactors`, `applyWorkflowDesignHeuristics`, or LD `workflowPolicy` change materially.
5. **Screenshots** are described in prose here; attach PNGs to this folder if captured (optional).

---

## Inventory

| File | Purpose |
|------|---------|
| [`rna-virus-brief-case.md`](rna-virus-brief-case.md) | Primary sparse-brief scenario |
| [`resolved-brief-screenshot-notes.md`](resolved-brief-screenshot-notes.md) | Resolved assumptions panel (observed) |
| [`generated-workflow-screenshot-notes.md`](generated-workflow-screenshot-notes.md) | Workflow steps UI (observed vs expected) |
| [`generated-page-output-excerpt.md`](generated-page-output-excerpt.md) | Page symptom when activities missing upstream |
| [`elicitation-runtime-entrypoints.md`](elicitation-runtime-entrypoints.md) | Function map + line anchors |
| [`workflow-topology-rules-current-state.md`](workflow-topology-rules-current-state.md) | Pack triggerRules + runtime pruning |
| [`ld-step-trigger-reference.md`](ld-step-trigger-reference.md) | Canonical step IDs and artefact deps |
| [`brief-resolution-ui-notes.md`](brief-resolution-ui-notes.md) | Factory resolved-brief UX |
| [`regression-fixture-candidates.md`](regression-fixture-candidates.md) | Proposed 26-3 fixtures |
| [`assessment-items-output-trace.md`](assessment-items-output-trace.md) | **Track B** — artefact → page trace |
| [`design-page-assessment-inclusion-notes.md`](design-page-assessment-inclusion-notes.md) | **Track B** — Design Page / omitIfMissing |
| [`page-assessment-renderer-notes.md`](page-assessment-renderer-notes.md) | **Track B** — renderer + inflation compare |

---

## Not snapshotted here

| Item | Canonical path |
|------|----------------|
| Full LD pack | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Full runtime | `app.js` |
| Sprint 23 assessment semantics | `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/ld-design-assessment-semantics.md` |

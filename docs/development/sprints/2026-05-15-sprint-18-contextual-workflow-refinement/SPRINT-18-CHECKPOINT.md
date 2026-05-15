# Sprint 18 — checkpoint (closed)

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`  
**Sprint title:** Sprint 18 — Contextual Workflow Refinement  
**Status:** **Closed** — verification baseline **100 passed**, 0 failed

**Purpose:** Authoritative closeout for Research contextual refinement (Slices 1–2, 3C, method-vs-output conflict). **Successor sprint:** Sprint 19 — LD workflow rationalisation (audit-first bootstrap).

**Next active sprint entry point:**  
[`docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/GPT-BOOTSTRAP-PROMPT.md`](../2026-05-15-sprint-19-ld-workflow-rationalisation/GPT-BOOTSTRAP-PROMPT.md)

---

## Status summary

| Sprint | Status |
|--------|--------|
| **Sprint 17** | **Closed** — S1–S6 sparse-brief safety; **85 tests** at closeout |
| **Sprint 18** | **Closed** — Slices 1–2, 3C-1/3C-2, conflict exceptions (S13); **100 tests** at closeout |
| **Sprint 19** | **Active** — bootstrap / audit-first; LD rationalisation pack (docs-only bootstrap) |

---

## Slice 1 closed (interpreter + pack policy)

| Deliverable | Notes |
|-------------|--------|
| **Refinement context contract** | `buildWorkflowRefinementContext` — brief, resolved factors, design snapshot, heuristics, validation meta |
| **Research adequacy rule** | `planningAdequacyChecks[]` — `topic_scope_under_specified` when `generate_from_topic` + analysis steps + weak topic scope |
| **Disclosure policy** | Category `planning_adequacy` (order 6); deterministic pack message/action (RQ-P1) |
| **Runtime interpreter** | `workflowBriefAdequacyWhenMatches`, `evaluateWorkflowBriefPlanningAdequacyChecks`, `__PRISM_TEST_API` |
| **S7 fixture** | `S7-topic-sufficiency-smoke.json` — post-elicitation essentials complete, broad topic, analysis chain |
| **Tests** | `tests/workflow-research-adequacy.test.js` — S7 positive; S1/S3 evaluator negatives |

**Architectural decisions (locked):** RQ-T1 post-synthesis evaluation; RQ-B1 assistive only; RQ-UX1 Planning panel target; RQ-P1 deterministic pack text.

**Charter:** [`docs/consolidation/sprint-18-slice-1-charter.md`](../../../consolidation/sprint-18-slice-1-charter.md)

Slice 1 intentionally **did not** wire Factory UI — interpreter and tests only.

---

## Slice 2 closed (Planning-panel visibility)

| Deliverable | Notes |
|-------------|--------|
| **Disclosure merge** | `buildWorkflowBriefPlanningDisclosures` accepts `planningAdequacyRows` after gate disclosures |
| **Post-design apply** | `applyWorkflowBriefPlanningAdequacyAfterDesign` when design snapshot exists and `missing` is empty |
| **Factory wiring** | `continueWorkflowDesignGeneration` refreshes `planningDisclosures` + resolved panel after heuristics |
| **Tests** | S7 post-design `planning_adequacy` in panel; S1/S2/S3/S4/S6 pre-design omit; S3 post-design negative |

Adequacy runs **only** when all required factors are resolved and a post-heuristic workflow snapshot exists. Does **not** mutate `resolvedFactors`.

---

## Verification

```bash
node --test tests/*.test.js
```

| Milestone | Result |
|-----------|--------|
| Sprint 17 closeout | **85 passed**, 0 failed |
| After Slice 1 (Phase D) | **88 passed**, 0 failed (+3 adequacy evaluator tests) |
| **After Slice 2** | **91 passed**, 0 failed |
| **After Slice 3C (3C-1 + 3C-2)** | **95 passed**, 0 failed (+4 adequacy tests) |
| **Sprint 18 closeout** (conflict exceptions + S13) | **100 passed**, 0 failed |

**Regression:** `tests/workflow-research-sparse-briefs.test.js` — **S1–S6 semantics unchanged**.

**Adequacy proving surface:** `tests/workflow-research-adequacy.test.js` — fixtures **S7–S9**.

**Conflict proving surface:** `tests/workflow-research-conflict-exceptions.test.js` — fixture **S13**; **S4** unchanged.

---

## S7 — what it proves now

**S7** closes the Sprint 17 post-closeout gap in automated tests:

- Brief: *“Analyse the evidence and produce an executive briefing on AI governance risks”*
- Essentials complete (`generate_from_topic`, audience, objective, output depth)
- Heuristic plan includes analysis steps (e.g. Build Evidence Map, Conduct Thematic Analysis)
- **Assistive** `planning_adequacy` notice `topic_scope_under_specified` appears in Planning disclosures **after** synthesis — not a new required factor, not blocking save/run

See `context-files/sprint-17-topic-sufficiency-gap.md` for the original smoke narrative.

---

## Remaining out of scope (unless separately chartered)

| Item | Notes |
|------|--------|
| **Chat clarification** | Conversational scope follow-up in Factory |
| **Dismiss / suppress state** | Per-session or per-workflow recommendation lifecycle |
| **LD rollout** | Research-first proved; LD `refinementFactors` alignment deferred |
| **AI phrasing** | Adequacy messages stay pack-deterministic (RQ-P1) |
| **Renderer / schema redesign** | Separate sprint boundary |
| **Prompt Studio merge** | Lessons in pack; no orchestration merge |

---

## Next candidate slices (not chartered)

These are **candidates only** — require explicit slice charter before implementation.

### 1. Slice 3A — manual validation pass + copy polish (**planned**)

**Guide:** [`docs/consolidation/sprint-18-slice-3a-manual-validation.md`](../../../consolidation/sprint-18-slice-3a-manual-validation.md)

- Manual matrix: broad executive (M0), concise/heavy (M1), page delivery (M2), scoped/unscoped topic (M3–M4), sparse (M5), conflicting intent (M6)
- Planning panel behaviour, stacking (≤3 adequacy rows), noise rubric, copy candidates
- Optional pack-only polish after manual log — **no** runtime, dismiss, or grouping implementation

### 2. Slice 3B — recommendation lifecycle / dismiss state

- Per-workflow or per-session suppress/dismiss for `planning_adequacy` rows
- Persist dismissed disclosure IDs; do not re-surface until brief/design materially changes
- Tests for dismiss semantics; no change to essentials or blocking validation

### 3. Slice 3C — additional Research adequacy checks (**closed**)

- **Charter:** [`docs/consolidation/sprint-18-slice-3c-charter.md`](../../../consolidation/sprint-18-slice-3c-charter.md)
- **3C-1:** Runtime predicates + cap **3** rows
- **3C-2:** Checks **A** (`evidence_language_generate_from_topic_mismatch`), **B** (`plan_heavy_for_output_depth`); **S8**, **S9**
- **Deferred:** Checks **C–E**; **S10–S12** (3C-pass-2)
- **Verification:** **95 passed**, 0 failed

### 4. Renderer contract work — separate track

- Sprint 16 / renderer schema and orchestration remain **out of Sprint 18**
- Any renderer contract changes need their own charter; do not bundle with adequacy slices

### 5. Research conflict refinement — method vs output (**done**)

**Docs:** [`docs/consolidation/sprint-18-research-method-vs-output-conflict-proposal.md`](../../../consolidation/sprint-18-research-method-vs-output-conflict-proposal.md)

- Pack `exceptions` on `objective_type_mixed_signals` — suppress `analysis` when explicit briefing deliverable + method language (AND); `excludeMentionAnyOf` guards S4
- **S13** fixture + `workflow-research-conflict-exceptions.test.js`; **S4** sparse golden unchanged
- **Verification:** **100 passed**, 0 failed

---


## Live repo anchors (post-checkpoint)

| Layer | Path |
|-------|------|
| Research pack | `domains/research/domain-research-step-patterns.md` |
| Adequacy runtime | `app.js` — `buildWorkflowRefinementContext`, `evaluateWorkflowBriefPlanningAdequacyChecks`, `applyWorkflowBriefPlanningAdequacyAfterDesign` |
| Planning disclosures | `app.js` — `buildWorkflowBriefPlanningDisclosures`, `attachWorkflowBriefPlanningToResolvedState` |
| Sparse regression | `tests/workflow-research-sparse-briefs.test.js`, fixtures S1–S6 |
| Adequacy tests | `tests/workflow-research-adequacy.test.js`, fixtures S7–S9 |

---

## Forward to Sprint 19

Sprint 18 proved **contextual refinement on Research**. Sprint 19 applies the same four-layer model to **Learning Design** — audit-first, no LD implementation until chartered.

| Artefact | Path |
|----------|------|
| **Sprint 19 entry** | [`../2026-05-15-sprint-19-ld-workflow-rationalisation/GPT-BOOTSTRAP-PROMPT.md`](../2026-05-15-sprint-19-ld-workflow-rationalisation/GPT-BOOTSTRAP-PROMPT.md) |
| LD rationalisation audit | [`docs/audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md) |
| Sprint 19 handover | [`../2026-05-15-sprint-19-ld-workflow-rationalisation/HANDOVER.md`](../2026-05-15-sprint-19-ld-workflow-rationalisation/HANDOVER.md) |

**Verification baseline (ongoing):** `node --test tests/*.test.js` → **100 passed**, 0 failed.

---

## Pack documents (read order — historical Sprint 18)

1. **`SPRINT-18-CHECKPOINT.md`** (this file)
2. **`HANDOVER.md`** / **`CURRENT-STATE.md`**
3. **`review-log.md`**
4. **`sprint-18-index.md`**
5. **`docs/consolidation/sprint-18-slice-1-charter.md`**

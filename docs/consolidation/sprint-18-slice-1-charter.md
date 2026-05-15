# Sprint 18 — Slice 1 charter (Phase A)

**Date:** 2026-05-15  
**Path:** `docs/consolidation/sprint-18-slice-1-charter.md`  
**Status:** **Closed (implementation)** — Phases A–D complete; Slice 2 visibility closed; Sprint 18 **checkpoint** recorded.

**Pack:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`

**Checkpoint:** [`SPRINT-18-CHECKPOINT.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md)

**Verification:** `node --test tests/*.test.js` → **91 passed**, **0 failed** (2026-05-15). Baseline 85 (S17) → 88 (Slice 1) → 91 (Slice 2). S1–S6 unchanged.

---

## 1. Slice scope

| In scope (Slice 1 overall) | Out of scope (Slice 1 and later phases until chartered) |
|----------------------------|--------------------------------------------------------|
| Refinement **context contract** (specified here; implemented in Phase B+) | Factory wiring (`continueWorkflowDesignGeneration`, chat) |
| One Research **topic sufficiency** adequacy rule (pack shape specified) | LD implementation |
| **S7** fixture proposal + test plan | Prompt Studio merge |
| **Assistive**, **post-synthesis**, **pack-driven**, **deterministic** | Renderer / schema / orchestration redesign |
| Planning panel surfacing (interpreter + tests only; **UI wiring deferred to Slice 2**) | `explicitExtract` migration |
| Preserve Sprint 17 safety (validation, conflict, gates, S1–S6) | AI phrasing of adequacy messages |
| | Dismiss / session suppress state (Slice 2+) |

**Delivered (Phases A–D):** charter; Research `planningAdequacyChecks` + `planning_adequacy` disclosure; `buildWorkflowRefinementContext`, `workflowBriefAdequacyWhenMatches`, `evaluateWorkflowBriefPlanningAdequacyChecks` + `__PRISM_TEST_API`; S7 fixture + `workflow-research-adequacy.test.js`. **No** Factory wiring in Slice 1.

---

## 2. Architectural placement

```text
Brief → deterministic essentials [blocking when unsafe/incomplete]
     → proceedability gates
     → workflow synthesis (heuristics + model steps)
     → workflow record = semantic substrate
     → planning adequacy [Slice 1: assistive, post-synthesis]
     → save / run
```

**Four concepts (unchanged from Sprint 18 bootstrap):**

| Concept | Slice 1 |
|---------|---------|
| **Required essentials** | Unchanged — Sprint 17 |
| **Proceedability** | Unchanged — proceed gates |
| **Refinement opportunities** | Slice 1 adds **one** adequacy opportunity (assistive) |
| **Workflow-quality enrichment** | `weakTopicScope` folded into adequacy `when` (no separate signal engine in Slice 1) |

**Rule:** Runtime interprets policy; domain packs declare policy.

---

## 3. Locked design decisions

| ID | Decision |
|----|----------|
| **RQ-T1** | Adequacy evaluated **after** heuristic step list exists (post-synthesis snapshot in context). Does **not** gate `continueWorkflowDesignGeneration` in Slice 1. |
| **RQ-B1** | Topic sufficiency is **assistive only** — `planning_adequacy` category; not a new required factor; does not block save/run. |
| **RQ-UX1** | **Planning panel only** for Slice 1 — reuse disclosure pipeline; no chat, no dismiss state. |
| **RQ-P1** | **Deterministic** pack rule + fixed message/action — **no** AI phrasing in Slice 1. |

---

## 4. Refinement context contract

**Builder (Phase B):** `buildWorkflowRefinementContext(options)` in `app.js`, exposed on `__PRISM_TEST_API`.

### 4.1 `WorkflowRefinementContext` (input shape)

| Field | Type | Purpose |
|-------|------|---------|
| `brief` | `WorkflowDesignBase` | `buildWorkflowDesignBase` output |
| `config` | `NormalizedWorkflowBriefConfig` | Normalized pack `workflowBriefConfig` |
| `resolvedFactors` | `Record<string, string>` | Post-resolve factor map |
| `resolvedSources` | `Record<string, string>` | Optional provenance |
| `explicitValues` | `Record<string, string>` | Optional extract snapshot |
| `inferredValues` | `Record<string, string>` | Optional inference snapshot |
| `missingFactorIds` | `string[]` | Must be **empty** before adequacy runs |
| `design` | `{ summary?, steps: StepSnapshot[] }` | Post-`applyWorkflowDesignHeuristics` plan |
| `heuristics` | `{ stepTitles[], hasGenerateResearchContent, hasDesignPage, hasValidateResearchOutput }` | Optional mirror of sparse fixtures |
| `validation` | `{ disclosures?, rejectedInference? }` | Optional pass-through |
| `meta` | `{ domainId?, fixtureId? }` | Test/diagnostic |

**`StepSnapshot`:** `{ title, role?, depends_on?, canonical_step_id? }`

### 4.2 Outputs (Phase C)

**`evaluateWorkflowBriefPlanningAdequacyChecks(config, ctx)`** →

| Field | Purpose |
|-------|---------|
| `triggeredChecks[]` | `{ id, disclosureId, severity, message, action, relatedStepTitles? }` |
| `qualitySignals` | Optional stub in Slice 1 — may inline into `when` |

### 4.3 Invariants

- Adequacy **must not** mutate `resolvedFactors`.
- Evaluate only when `missingFactorIds.length === 0`.
- `design.steps` must reflect **post-heuristic** titles (same source as S1–S6 `expectedCurrent.heuristics`).

---

## 5. One Research topic sufficiency adequacy rule

**Pack section:** `workflowBriefConfig.planningAdequacyChecks[]` (single entry in Slice 1).

**Interpreter (Phase C):** generic `workflowBriefAdequacyWhenMatches` + `evaluateWorkflowBriefPlanningAdequacyChecks`; merge rows into `buildWorkflowBriefPlanningDisclosures` when `opts.refinementContext` or `opts.design` + resolved map supplied.

### 5.1 Rule definition (pack JSON — to be added in Phase B)

```json
{
  "id": "generate_from_topic_broad_scope_with_analysis_chain",
  "when": {
    "allRequiredFactorsResolved": true,
    "resolvedFactorEquals": {
      "input_strategy": "generate_from_topic"
    },
    "designIncludesAnyStepTitles": [
      "Conduct Thematic Analysis",
      "Build Evidence Map"
    ],
    "weakTopicScope": {
      "topicFactorIds": ["topic", "workshop_subject"],
      "maxSignificantTokens": 6,
      "scopeCueMentionAnyOf": [
        "sector", "region", "country", "jurisdiction",
        "horizon", "framework", "policy frame", "evidence base",
        "2020", "2021", "2022", "2023", "2024", "2025", "2026"
      ],
      "scopeCueFields": ["designIntent", "goal", "scopeConstraints"]
    }
  },
  "effect": {
    "disclosureId": "topic_scope_under_specified",
    "severity": "assistive",
    "relatedStepTitles": ["Conduct Thematic Analysis"]
  }
}
```

### 5.2 `weakTopicScope` semantics (runtime, generic)

1. Topic string = first non-empty value among `topicFactorIds` in `explicitValues` ∪ `resolvedFactors`.
2. **Weak** when significant token count ≤ `maxSignificantTokens` **and** no substring from `scopeCueMentionAnyOf` appears in any `scopeCueFields` on `brief`.
3. Post-closeout smoke *“AI governance risks”* → weak (≈3 tokens, no scope cues).

### 5.3 `disclosurePolicy` extensions (Phase B)

| Key | Value |
|-----|--------|
| `messages.topic_scope_under_specified` | The topic looks broad for generate-from-topic research with analysis steps; narrowing scope will improve the plan. |
| `categories.planning_adequacy` | `{ "label": "Planning adequacy", "order": 6 }` |
| `entries.topic_scope_under_specified` | `{ "category": "planning_adequacy", "action": "Add sector, region, time horizon, or policy frame in the brief (or confirm you want a broad scan)." }` |

### 5.4 When the rule must **not** fire

| Case | Reason |
|------|--------|
| **S1**, **S6** | Essentials missing |
| **S2**, **S4** | Missing factors or blocking validation/conflict |
| **S3** | `input_strategy: provided_source_content` |
| Any brief | `input_strategy` ≠ `generate_from_topic` |
| Any brief | Analysis step titles absent from design |

**Not in Slice 1:** `highImpactClarificationRules` as a separate interpreter (adequacy check only).

---

## 6. S7 fixture proposal

**Path:** `tests/fixtures/workflow-brief-research-sparse/S7-topic-sufficiency-smoke.json`

| Field | Content |
|-------|---------|
| `caseId` | `S7-topic-sufficiency-smoke` |
| `scenario` | Post-closeout smoke: essentials complete, generate-from-topic, analysis chain, broad topic |
| `baseInput.designIntent` | `Analyse the evidence and produce an executive briefing on AI governance risks` |
| `baseInput` | Audience and desired outputs populated; `inputs` empty (topic-only path) |
| `expectedCurrent` | Pin `explicitSubset`, `resolvedFactors`, `resolvedSources`, `missingFactorIds: []`, `elicitationRequired: false`, `heuristics` (chain **with** Conduct Thematic Analysis) |
| `expectedCurrent.planningAdequacy` | One row: `topic_scope_under_specified`, category `planning_adequacy` |
| `desiredFuture` | Chat clarification, dismiss, scope facets — **documentation only, not asserted** |

**Negative controls (Phase D tests, same file):**

- **S3** — provided sources → **no** `planning_adequacy` row.
- **S1** — missing essentials → **no** `planning_adequacy` row.

**S1–S6 JSON files:** unchanged semantics; adequacy asserted only in new test file.

---

## 7. Files by implementation phase

| Phase | Files | Status |
|-------|-------|--------|
| **A** | `docs/consolidation/sprint-18-slice-1-charter.md`, `review-log.md` | **Done** |
| **B** | `domains/research/domain-research-step-patterns.md` | **Done** — `planningAdequacyChecks`, `topic_scope_under_specified` disclosure |
| **C** | `app.js` | **Done** — context builder, adequacy interpreter, test API (no Factory wiring) |
| **D** | `S7-topic-sufficiency-smoke.json`, `tests/workflow-research-adequacy.test.js` | **Done** — 3 tests; S1/S3 negative controls |
| **E** | Manual M0, M2, M4 | **Optional** — not required for Slice 1 closeout |

**Explicitly not in Slice 1 file list:** `index.html`, LD pack, Prompt Studio, renderer, workflow schema.

---

## 8. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| S1–S6 regression | Separate test file; do not edit S1–S6 fixtures |
| False positive on incomplete briefs | `allRequiredFactorsResolved` + empty `missingFactorIds` |
| Pre-design adequacy | Only evaluate when `design.steps` provided |
| Planning category sort | `planning_adequacy` order 6; existing categories unchanged |
| Accidental Factory prompt | No call from `continueWorkflowDesignGeneration` until Slice 2 |

---

## 9. Verification

```bash
node --test tests/*.test.js
```

| Milestone | Result |
|-----------|--------|
| Sprint 17 baseline | **85 passed**, 0 failed |
| **Slice 1 closeout** | **88 passed**, 0 failed |

S1–S6 sparse-brief semantics unchanged (`workflow-research-sparse-briefs.test.js`).

---

## 10. Slice 2 (closed — visibility, 2026-05-15)

**Delivered:** Planning-panel integration / post-synthesis surfacing — `evaluateWorkflowBriefPlanningAdequacyChecks` merged via `planningAdequacyRows` in `buildWorkflowBriefPlanningDisclosures`; `applyWorkflowBriefPlanningAdequacyAfterDesign` called from `continueWorkflowDesignGeneration` when a post-heuristic `design` snapshot exists and required factors are resolved. Tests: S7 post-design positive; S1/S2/S3/S4/S6 pre-design negative; S3 post-design negative. **91 passed**, 0 failed.

**Explicitly not in Slice 2 unless separately chartered:**

| Out of scope (default) | Notes |
|------------------------|--------|
| Chat clarification | Conversational scope follow-up |
| Dismiss / suppress state | Per-session or per-workflow memory |
| LD rollout | Research-only proved in Slice 1 |
| AI phrasing of adequacy messages | RQ-P1: deterministic pack text only |
| Renderer / schema redesign | Sprint boundary |
| Prompt Studio merge | Sprint boundary |

---

## 11. Related artefacts

| Document | Role |
|----------|------|
| [`sprint-18-bootstrap.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/sprint-18-bootstrap.md) | Sprint 18 thesis |
| [`sprint-18-research-questions.md`](../exploration/sprint-18-research-questions.md) | Open questions (RQ-* resolved for Slice 1) |
| [`existing-refinement-infrastructure-audit.md`](../audits/existing-refinement-infrastructure-audit.md) | Current code inventory |
| [`sprint-17-implementation-summary.md`](sprint-17-implementation-summary.md) | Closed baseline §12 topic gap |
| `context-files/sprint-17-topic-sufficiency-gap.md` | Smoke test narrative |

---

## 12. Review log

- **2026-05-15** — Slice 1 charter (Phase A): contract, adequacy rule shape, S7 proposal, decisions RQ-T1 through RQ-P1.
- **2026-05-15** — Slice 1 **closed** (Phases B–D): pack policy, generic interpreter, S7 + adequacy tests; **88 passed**; Factory UI wiring deferred to Slice 2 candidate.
- **2026-05-15** — Slice 2 **closed** (visibility): post-synthesis `planningDisclosures` merge + `continueWorkflowDesignGeneration` wiring; **91 passed**.
- **2026-05-15** — **Docs-only checkpoint** — pack `SPRINT-18-CHECKPOINT.md`; next candidates 3A–3C; renderer separate.

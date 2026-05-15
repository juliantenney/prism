# Sprint 17 — implementation summary

**Date:** 2026-05-15  
**Sprint title:** Research Elicitation & Sparse Brief Testing  
**Status:** **Closed (implementation)** — docs + bounded runtime; **85 tests green**.

**Related:** [`sprint-17-index.md`](sprint-17-index.md), [`sprint-17-research-elicitation-sparse-brief-prep.md`](sprint-17-research-elicitation-sparse-brief-prep.md), [`sprint-17-explicit-extract-profile-proposal.md`](sprint-17-explicit-extract-profile-proposal.md).

**Architectural rule (held throughout):** Runtime interprets policy; domain packs declare policy. No Research-only planning logic hard-coded beyond generic interpreters and pre-existing safety nets.

**Verification:** `node --test tests/*.test.js` → **85 passed**, **0 failed**.

---

## 1. Original goal

Use the **Research** domain as a bounded proving surface for workflow planning under **sparse briefs**:

- What does PRISM **assume** vs **ask** when the Factory brief is thin?
- Is the resulting step plan **safe** before generation?
- Can elicitation policy live in the **pack** and be interpreted by **generic** `app.js` paths (reusable lessons for LD later)?

**Explicitly not in scope:** renderer, schema redesign, orchestration rewrite, LD implementation sprint, Prompt Studio merge, broad UI redesign.

---

## 2. Slices delivered (0–5)

| Slice | Deliverable |
|-------|-------------|
| **0** | Golden sparse fixtures **S1–S6** (`tests/fixtures/workflow-brief-research-sparse/`); `tests/workflow-research-sparse-briefs.test.js` pins extract, infer, resolve, heuristics |
| **1** | Pack `validationRules` + `disclosurePolicy`; runtime `applyWorkflowBriefValidationRules`; **Planning notices** in resolved panel |
| **2** | Pack `conflictPolicies`; chained in validation pass; mixed-intent blocking (S4) |
| **3** | Pack `generateResearchContentHeuristic` + `researchDesignPageAppend.requiresResolvedFactors`; `workflowBriefHeuristicGateSatisfied`; model-chain fallback when dependency ordering stalls |
| **4** | **Docs only** — [`sprint-17-explicit-extract-profile-proposal.md`](sprint-17-explicit-extract-profile-proposal.md); `explicitExtract` implementation **deferred** |
| **5** | Structured planning disclosure: categories, `rejectedInference`, `planningGateDisclosures`, grouped resolved-panel notices; S2/S4 fixture assertions extended |

---

## 3. Final policy mechanisms (Research pack → generic runtime)

| Mechanism | Pack location | Runtime (`app.js`) | Sparse fixtures |
|-----------|---------------|--------------------|-----------------|
| **validationRules** | `workflowBriefConfig.validationRules` | `applyWorkflowBriefValidationRules`, `workflowBriefValidationRuleWhenMatches` | **S2** |
| **conflictPolicies** | `workflowBriefConfig.conflictPolicies` | `applyWorkflowBriefConflictPolicies` (chained at end of validation) | **S4** |
| **disclosurePolicy** | `workflowBriefConfig.disclosurePolicy` (`messages`, `entries`, `categories`) | `getWorkflowBriefDisclosureEntry`, enriched disclosure rows | **S2**, **S4** |
| **Planning notices (UI)** | — | `renderWorkflowBriefResolvedPanel` + `formatWorkflowBriefPlanningNoticesLines` | **S2**, **S4** (grouped) |
| **Heuristic proceed gates** | `workflowPolicy.generateResearchContentHeuristic`, `researchDesignPageAppend.requiresResolvedFactors` | `workflowBriefHeuristicGateSatisfied`; topic seed / GRC insert / Design Page append / final strip | **S1**, **S2**, **S4**, **S5**, **S6** |
| **planningGateDisclosures** | `workflowBriefConfig.planningGateDisclosures` | `buildWorkflowBriefPlanningDisclosures` | **S2**, **S4** (gated_planning category) |
| **rejectedInference** | — (derived from validation/conflict) | Recorded when values blocked; surfaced under **Inferred but not used** | **S2**, **S4** |

**Unchanged by design:** runtime step-generation / Run elicitation gate; renderer; workflow schema.

---

## 4. Research pack changes

**File:** `domains/research/domain-research-step-patterns.md`

- **`workflowBriefConfig`:** `validationRules` (`upload_language_requires_inputs`), `conflictPolicies` (`objective_type_mixed_signals`), expanded `disclosurePolicy`, `planningGateDisclosures`
- **`workflowPolicy`:** `generateResearchContentHeuristic`, `requiresResolvedFactors` on `researchDesignPageAppend`
- Existing: `inferenceRules`, `requiredFactors`, `triggerRules`, `researchValidationIntent`, dependencies — used as before; gates added on top

---

## 5. `app.js` generic interpreter changes (summary)

| Area | Functions / behaviour |
|------|---------------------|
| Brief config normalisation | `normalizeWorkflowBriefConfig` — preserves `validationRules`, `conflictPolicies`, `disclosurePolicy`, `planningGateDisclosures` |
| Validation / conflict | `applyWorkflowBriefValidationRules`, `applyWorkflowBriefConflictPolicies`, `collectWorkflowBriefConflictSignalValues` |
| Disclosure enrichment | `getWorkflowBriefDisclosureEntry`, `enrichWorkflowBriefDisclosureRow`, `rejectedInference` on block |
| Planning assembly | `buildWorkflowBriefPlanningDisclosures`, `attachWorkflowBriefPlanningToResolvedState`, `formatWorkflowBriefPlanningNoticesLines` |
| Factory / elicitation | `attachWorkflowBriefPlanningToResolvedState` on resolved-state writes; `briefConfig` on panel for grouping |
| Heuristics | `workflowBriefHeuristicGateSatisfied`; gated topic / GRC / Design Page; `stepsBeforeDependencyOrder` fallback |
| Test API | `__PRISM_TEST_API`: validation, resolve, heuristics, planning disclosure helpers |

**Not migrated:** `extractWorkflowBriefExplicitFactors` remains shared LD+Research blob parser (see Slice 4 proposal).

---

## 6. Fixture and test coverage

| Asset | Role |
|-------|------|
| `tests/fixtures/workflow-brief-research-sparse/S1`–`S6` | Golden `expectedCurrent` (explicit, resolve, heuristics, disclosures where applicable); `desiredFuture` documentation-only |
| `tests/workflow-research-sparse-briefs.test.js` | 5 tests: fixture hygiene, extract, infer, resolve (+ disclosures / rejected / planning categories), heuristics |
| `tests/workflow-research-design-page-heuristic.test.js` | Updated gate assertions (Design Page withheld without `objective_type`) |
| `tests/workflow-research-validation-intent.test.js` | Unchanged regression |
| `tests/workflow-brief-pass1.test.js` | LD extract baseline unchanged (80 → 85 total with sparse file) |

**S1–S6 heuristic snapshot (post–Slice 3):** seven-step model chain without **Generate Research Content** or **Design Page** when `objective_type` / `input_strategy` not resolved; **S3** still appends **Design Page** when both resolved.

---

## 7. Prompt Studio comparison — lessons (no merge)

From prep audit; applied in spirit, not by copying PS UI:

| Prompt Studio strength | Sprint 17 analogue |
|------------------------|-------------------|
| Visible assumptions before proceed | Grouped **Planning notices**, **Inferred but not used**, user-provided vs inferred blocks in resolved panel |
| Clear “why we’re asking” | **Still needed** rows tie to pack `requiredFactors[].question` |
| Rejected / unsafe guesses surfaced | **Blocked unsafe inference** + **rejectedInference** |
| Policy over ad-hoc prompts | Pack `validationRules` / `conflictPolicies` / gates — runtime interprets |

**Not done:** PS session model, template merge, or assumption editor — out of charter.

---

## 8. `explicitExtract` — deferred (Slice 4)

Proposal: optional `workflowBriefConfig.explicitExtract` with pack-declared rules and `suppressLegacyGroups` so Research stops inheriting LD assessment/delivery regexes.

**Why deferred:** Slices 1–3 + 5 make sparse-brief planning **safe**; extract migration touches Sprint 11–pinned shared parser and needs dual-run parity (`workflow-brief-pass1` + S1–S6).

**Optional follow-on:** 4a `suppressLegacyGroups` only; 4b migrate `objective_type` blob rules first. See [`sprint-17-explicit-extract-profile-proposal.md`](sprint-17-explicit-extract-profile-proposal.md).

---

## 9. Remaining risks and follow-on candidates

| Risk / gap | Notes |
|------------|--------|
| Shared **explicit extract** | LD regex bleed; last-wins `objective_type` before conflict |
| **First structured domain** (LD+Research) | WGC loads LD brief config first — Research profile would not apply on dual-domain selection |
| **Audience from goal text** | Not inferred; relies on field or elicitation |
| **Minimum viable threshold** | `stopConditions` still “all required”; no bundled “2-of-4 essentials” gate on Factory auto-continue |
| **Runtime generation gate** | Factory planning gated; Run path not changed |
| **Dual-domain workflows** | Research policy proven for `["general","research"]` only |

**Follow-on candidates (priority order):**

1. **Topic-generation sufficiency / high-impact clarification** (post-closeout smoke test — see §12)
2. `explicitExtract` 4a/4b (Research only)
3. Pack `inferenceRules` expansion + audience promotion from goal
4. Factory auto-continue aligned with `objective_type` + `input_strategy` MVP threshold
5. Assumption block in Factory log (read-only export of `planningDisclosures`)
6. LD domain-scoped extract profile (separate sprint)

---

## 10. Why LD implementation remains out of scope

- Sprint 17 charter: **Research as elicitation lab**, capture **cross-domain lessons** in docs — not LD refactors.
- LD brief config is larger (`refinementFactors`, assessment IDs, high-impact inferred confirm); changes require LD fixtures and regression across assessment/page flows.
- Shared `extractWorkflowBriefExplicitFactors` and `getPendingHighImpactInferredFactors` are LD-centric; touching them without an LD sprint risks **80+** pass1 regressions.
- Policy pattern (validation / conflict / disclosure / gates) is **proven portable**; LD can adopt the same JSON shapes in a future sprint with its own golden fixtures.

---

## 11. Review log

- **2026-05-15** — Slices 0–5 implementation complete; 85 tests green; Slice 4 extract proposal deferred; closeout summary added.
- **2026-05-15** — Post-closeout manual smoke test: topic-generation sufficiency gap documented (§12); not a Sprint 17 defect.

---

## 12. Post-closeout observation — topic-generation sufficiency / high-impact clarification

**Label (future candidate):** Topic-generation sufficiency / high-impact clarification  
**Status:** Documented after Sprint 17 closeout — **not** a Sprint 17 defect; no reopen of implementation.

### Manual smoke test (Research Factory)

**Brief used:**  
“Analyse the evidence and produce an executive briefing on AI governance risks.”

**Observed behaviour (positive):**

- Conflict detection behaved as expected when applicable.
- **objective_type** was elicited.
- **input_strategy** was elicited as `generate_from_topic`.
- **audience** and **output_depth** were elicited.
- Workflow generation completed successfully.

**Observed gap:**

- No clarification was asked about the **topic or scope** of “AI governance risks” (geography, sector, time horizon, evidence base, policy frame, etc.).
- The generated plan included analysis-oriented steps (e.g. evidence map, thematic analysis) consistent with the brief wording, but **planning adequacy** for topic-only generation was not validated beyond resolving the four required factors.

### Interpretation

This is **not** a renderer failure, an extraction bug, or a hard planning crash. Sprint 17 mechanisms (validation, conflict, disclosure, proceed gates) address **unsafe inference**, **mixed intent**, and **withholding GRC/Design Page** until `objective_type` and `input_strategy` are resolved.

The gap is **elicitation quality / planning adequacy**:

> `requiredFactors` resolved ≠ topic scope sufficiently specified for `input_strategy = generate_from_topic`.

A broad label in the design intent can satisfy explicit extract (`topic`-like phrasing) without giving the planner enough bounded context to justify a full analysis chain from generated material alone.

### Future policy concepts (Research pack + generic runtime — not implemented)

| Concept | Purpose |
|---------|---------|
| **highImpactClarificationRules** | Ask one targeted question when a high-impact factor is chosen but scope signals are weak |
| **topicSpecificityChecks** | Pack-declared heuristics for under-specified topic-only briefs (breadth markers, missing constraints) |
| **minimumContextForTopicGeneration** | Minimum viable context beyond factor IDs (e.g. intent + audience + bounded topic facet) before auto-continue |
| **planning adequacy notices** | Planning-panel disclosures distinct from validation/conflict (e.g. “Topic scope assumed broad”) |

Implementation would follow the Sprint 17 pattern: declare in `workflowBriefConfig`, interpret in `app.js`, prove with sparse fixtures — **Research only**; LD remains a separate adoption sprint.

### Relationship to S1–S6 fixtures

Golden fixtures S1–S6 pin **factor resolution and step gating**, not **topic sufficiency** for generate-from-topic paths. A future fixture family (e.g. S7+) could pin “clarify scope before continue” without reopening Sprint 17 closure.

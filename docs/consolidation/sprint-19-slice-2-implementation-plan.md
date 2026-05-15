# Sprint 19 Slice 19-2 — implementation plan (LD Planning Adequacy Pilot)

**Date:** 2026-05-15  
**Status:** **Plan only** — no implementation in this document  
**Charter:** [`sprint-19-slice-2-charter.md`](sprint-19-slice-2-charter.md)  
**Prior slice:** [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md)

**Goal:** Smallest safe path to add LD `planningAdequacyChecks` using **existing** Research adequacy infrastructure — **no `app.js` changes** unless feasibility proves unavoidable (default: **avoid**).

**Verification before implementation PR:**

```bash
node --test tests/*.test.js
```

**Expected:** **100 passed**, 0 failed

---

## 1. Existing runtime hooks (already available)

No new evaluator functions. LD activates adequacy by pack policy only.

| Hook | Location / behaviour |
|------|----------------------|
| **`evaluateWorkflowBriefPlanningAdequacyChecks(config, ctx)`** | `app.js` — iterates `cfg.planningAdequacyChecks`; each `when` via `workflowBriefAdequacyWhenMatches`; message/action from `disclosurePolicy` via `disclosureId` |
| **`applyWorkflowBriefPlanningAdequacyAfterDesign(config, resolvedState, base, design, options)`** | Runs only when `design.steps.length > 0` and `resolvedState.missing` is empty; builds `buildWorkflowRefinementContext`; merges adequacy into `planningDisclosures` |
| **Planning panel path** | `applyWorkflowBriefPlanningAdequacyAfterDesign` → `buildWorkflowBriefPlanningDisclosures({ planningAdequacyRows })` → `renderWorkflowBriefResolvedPanel` (via `continueWorkflowDesignGeneration` after heuristics) |
| **Row cap** | `WORKFLOW_BRIEF_PLANNING_ADEQUACY_MAX_ROWS = 3` — first three matching checks in **pack declaration order**; exported on `__PRISM_TEST_API` |
| **Pre-design guard** | If `missingFactorIds.length > 0`, evaluator returns `[]` |
| **Factory wiring** | `continueWorkflowDesignGeneration` already calls `applyWorkflowBriefPlanningAdequacyAfterDesign` when Research pack has checks — **same path for LD** once pack defines checks |

**Supported `when` predicates (Sprint 18 3C-1 — no new operators in 19-2):**

| Predicate | Use in LD |
|-----------|-----------|
| `resolvedFactorEquals` | `{ factorId: value }` — exact match on resolved map |
| `stepsIncludeAny` | Canonical step **titles** in post-heuristic design |
| `stepsIncludeAll` | All listed titles present |
| `stepsLackAny` / `stepsExclude` | None of listed titles present |
| `stepCountAtLeast` | `{ minSteps: n }` on `design.steps.length` |
| `briefFieldMentionAnyOf` | `{ fields, terms }` on brief base fields |
| `weakTopicScope` | Research-shaped; optional for LD topic rules (defer unless needed) |
| `weakAudienceCue` | Optional; defer in pilot |

**Not available without runtime change:** `resolvedFactorAbsent`, `resolvedSourceEquals`, negation, `resolvedFactorNotEquals`.

---

## 2. Exact LD pack location

**File:** `domains/learning-design/domain-learning-design-step-patterns.md`

**Section:** `### Workflow Brief Config` → JSON block `workflowBriefConfig`

**Insert order (match Research):** Add new siblings **inside** `workflowBriefConfig`, **immediately before** `stopConditions`:

```text
workflowBriefConfig
  ├── requiredFactors …
  ├── optionalFactors …
  ├── refinementFactors …
  ├── inferenceRules …
  ├── triggerRules …
  ├── mappingRules …
  ├── intentClasses …
  ├── stepRefinementProfiles …
  ├── disclosurePolicy          ← NEW (LD has none today)
  ├── planningAdequacyChecks    ← NEW
  ├── stopConditions            ← existing
  └── questionPolicy            ← existing (19-1: askRefinementByDefault false)
```

**Line anchor (current):** `stopConditions` at ~1406; insert **above** that key.

**Do not move** `stepRefinementProfiles`, `questionPolicy`, or 19-1 policy in this slice.

---

## 3. Proposed `planningAdequacyChecks` shape (same as Research)

Use the **Research pack shape exactly** — one object per check:

```json
{
  "id": "rule_id",
  "category": "planning_adequacy",
  "severity": "recommendation",
  "when": { },
  "disclosureId": "rule_id"
}
```

**Companion `disclosurePolicy` (Research-shaped):**

```json
"disclosurePolicy": {
  "messages": { "rule_id": "…" },
  "categories": {
    "planning_adequacy": { "label": "Planning adequacy", "order": 6 }
  },
  "entries": {
    "rule_id": {
      "category": "planning_adequacy",
      "action": "…"
    }
  }
}
```

`evaluateWorkflowBriefPlanningAdequacyChecks` reads `entry.message` from `disclosurePolicy.messages[disclosureId]` and `entry.action` from `entries[disclosureId]`. **Do not invent** a second message format.

---

## 4. Recommended first rules (smallest safe set: **3**)

Ship **three** rules expressible with existing predicates. Defer charter candidates that require “factor absent” detection.

| Priority | `id` | Rationale |
|----------|------|-----------|
| **P1** | `ld_generate_without_source` | Proven Research S8 pattern; L3 test |
| **P2** | `ld_scope_step_mismatch` | `resolvedFactorEquals` + `stepCountAtLeast`; L4 test |
| **P3** | `ld_assessment_generate_step_missing` | Assessment brief without generate step in plan; L1 test |

**Optional P4 (if cap allows and L2 needs coverage):** `ld_page_profile_facilitator_mismatch` — not `page_profile_unspecified` (see §5).

**Defer (this slice):** `assessment_type_unspecified`, `assessment_volume_unspecified`, `page_profile_unspecified` as originally named — see §5.

---

## 5. Predicate feasibility check

| Rule (charter name) | Feasible with existing predicates? | Verdict | Notes |
|---------------------|--------------------------------------|---------|-------|
| **`assessment_type_unspecified`** | **No** | **Defer** | `assessment_type` has pack `default: "mixed"`; inference sets concrete types from brief. `resolvedFactors` almost always includes `assessment_type` before adequacy. No “absent” or `source: default`-only `when` clause. |
| **`assessment_volume_unspecified`** | **No** | **Defer** | `assessment_total_items` has `default: 10`; resolves with `source: default` when relevant. Cannot detect “user did not specify count” without `resolvedSourceEquals` or absent-factor predicate. |
| **`page_profile_unspecified`** | **No** | **Defer** | `page_profile` optional factor `default: "learner"` — always present when relevant. |
| **`generate_without_source`** | **Yes** | **Ship as `ld_generate_without_source`** | Mirror Research: `resolvedFactorEquals.input_strategy: generate_from_topic` + `briefFieldMentionAnyOf` (evidence/upload/PDF terms) + `stepsIncludeAny: ["Normalize Content"]` (LD canonical title). |
| **`scope_step_mismatch`** | **Yes** | **Ship as `ld_scope_step_mismatch`** | `resolvedFactorEquals.design_scope: session` (or `single_activity`) + `stepCountAtLeast: { minSteps: 8 }` + optional `stepsIncludeAny: ["Construct Learning Sequence"]`. Tune `minSteps` in fixture. |
| **`ld_assessment_generate_step_missing`** (substitute) | **Yes** | **Ship (P3)** | `briefFieldMentionAnyOf` (assessment/quiz/Mcq terms) + `stepsLackAny: ["Generate Assessment Items"]` + optional `resolvedFactorEquals.assessment_required: true`. Addresses L1 “assessment intent but plan lacks generate step”. |
| **`ld_page_profile_facilitator_mismatch`** (substitute) | **Yes** | **Optional P4** | `stepsIncludeAny: ["Design Page"]` + `briefFieldMentionAnyOf` (facilitator/tutor/handout) + `resolvedFactorEquals.page_profile: learner`. Nudges profile mismatch, not “unspecified”. |

**`app.js` required?** **No** for the three-rule pilot.

**19-2b (future):** Charter `resolvedFactorAbsent` / `resolvedSourceIn` predicates if product insists on type/volume/profile “unspecified” rules.

---

## 6. Deterministic messages (draft copy)

Short, non-blocking, Planning-panel tone. Final text in pack JSON.

| `disclosureId` | Message (draft) | Action (draft) |
|----------------|-----------------|----------------|
| `ld_generate_without_source` | The brief mentions uploaded or source material, but the plan is set to generate from a topic without a normalize-from-source path aligned to that intent. | Attach source content in Inputs, set starting point to uploaded material, or confirm topic-only generation. |
| `ld_scope_step_mismatch` | A session-scale (or single-activity) design was requested, but the draft plan has a relatively long step chain. | Narrow design scope, remove optional steps, or change scope to sequence/module if a longer workflow is intended. |
| `ld_assessment_generate_step_missing` | The brief targets assessment outputs, but the draft plan does not yet include a step to generate assessment items. | Add or confirm a Generate Assessment Items step, or adjust the brief if assessment is not required. |
| `ld_page_profile_facilitator_mismatch` (optional) | The brief points to facilitator or tutor materials, but the page profile is set to learner. | Set page profile to facilitator in the brief or step Settings, or confirm a learner-facing page is intended. |

**Severity:** `recommendation` only. **Category:** `planning_adequacy`.

---

## 7. Interaction with `stepRefinementProfiles`

| Topic | Plan |
|-------|------|
| **Profiles in 19-2** | **Remain active** — no profile edits in this slice |
| **Generic refinement queue** | Already off (19-1 `askRefinementByDefault: false`) |
| **Duplication** | Adequacy may **temporarily** overlap profile prompts (e.g. assessment type/count, `page_profile`, `learner_level`) |
| **Acceptance** | Duplication is **acceptable for observation** in 19-2 manual validation (charter V1–V2) |
| **19-3** | Remove duplication: thin profile required tiers; stop `forceAsk` re-ask when factor already resolved; prefer adequacy + Settings |

**Manual rubric:** Flag scenario **fail** only if adequacy and profile ask the **same** question with the **same** factor id in one run without user action between — log for 19-3.

---

## 8. Expected file diff footprint

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | Add `disclosurePolicy` + `planningAdequacyChecks` (3 rules); no other pack sections |
| `tests/workflow-ld-adequacy.test.js` | **New** — mirror `workflow-research-adequacy.test.js` structure |
| `tests/fixtures/workflow-brief-ld-adequacy/L1.json` | Sparse assessment brief — expect `ld_assessment_generate_step_missing` |
| `tests/fixtures/workflow-brief-ld-adequacy/L2.json` | Page workflow — optional P4 or negative (no false assessment rules) |
| `tests/fixtures/workflow-brief-ld-adequacy/L3.json` | Source/generate mismatch — expect `ld_generate_without_source` |
| `tests/fixtures/workflow-brief-ld-adequacy/L4.json` | Session scope + long chain — expect `ld_scope_step_mismatch`; negative controls |
| `docs/consolidation/sprint-19-slice-2-closeout.md` | **After** implementation + manual validation (not in implementation PR) |

**Avoid:**

| File | Reason |
|------|--------|
| `app.js` | No predicate gaps in 3-rule pilot |
| `domains/research/domain-research-step-patterns.md` | Frozen |
| `tests/workflow-research-*.test.js` | Frozen |
| `tests/fixtures/workflow-brief-research-sparse/*` | Frozen S1–S13 |

---

## 9. Testing strategy

**Pattern:** Copy `tests/workflow-research-adequacy.test.js` helpers:

- `loadPrismTestApi()` from `app.js`
- `extractJsonBlockAfterHeading` for LD pack
- `resolveLdBriefPass` — `resolveWorkflowBriefFactors` + inference (domain `learning-design` only)
- `applyLdHeuristics` — `applyWorkflowDesignHeuristics` with LD `workflowPolicy` + fixture step chain
- `evaluatePlanningAdequacy` / `buildResolvedPlanningDisclosures` with `withPostDesignAdequacy: true`

### Fixture scenarios

| Fixture | Brief intent | Model step chain (minimal) | Expected adequacy |
|---------|--------------|----------------------------|-------------------|
| **L1** | Formative assessment pack, biology, no “10 questions” in text | Outcomes + activities + sequence (**no** Generate Assessment Items) | `ld_assessment_generate_step_missing` |
| **L2** | Learner pages, postgraduate ethics | Include **Design Page**; resolved `page_profile: learner` | No assessment rules; optional `ld_page_profile_facilitator_mismatch` only if P4 shipped with facilitator cues in brief |
| **L3** | Workshop from PDF; `generate_from_topic` + upload language | Include **Normalize Content** | `ld_generate_without_source` |
| **L4** | Session scope; concise chain intent | ≥8 steps in heuristic output; `design_scope: session` | `ld_scope_step_mismatch`; **negative:** `provided_source_content` must **not** fire `ld_generate_without_source` |

### Test cases (minimum)

1. **L1 positive** — post-design `planning_adequacy` includes `ld_assessment_generate_step_missing`.  
2. **L3 positive** — includes `ld_generate_without_source`.  
3. **L4 positive** — includes `ld_scope_step_mismatch`.  
4. **L4 negative** — L3 inverse: `provided_source_content` + source brief → **excludes** `ld_generate_without_source`.  
5. **Pre-design negative** — essentials missing → **no** `planning_adequacy` rows.  
6. **Cap** — fixture engineered to match 4 rules → at most **3** rows returned.  
7. **Research regression** — run full suite; no Research file edits.

**Ready state:** Tests do not drive Factory UI; assert `planningDisclosures` only. Manual validation confirms **Ready** not blocked.

---

## 10. Research regression requirements

| Requirement | Detail |
|-------------|--------|
| Research pack | **No edits** |
| Research fixtures | **S1–S13 unchanged** |
| Research tests | **No edits** to `workflow-research-sparse-briefs.test.js`, `workflow-research-adequacy.test.js`, `workflow-research-conflict-exceptions.test.js` |
| Baseline before implementation PR | **100 passed**, 0 failed |
| New tests | Add **only** `workflow-ld-adequacy.test.js` + L1–L4 fixtures in implementation PR |
| Expected after implementation | **100 + N passed** (N = new LD tests, target ~6–8 cases), **0 failed** |

---

## 11. Implementation sequence (smallest path)

| Step | Task | Verification |
|------|------|--------------|
| 1 | Confirm **100 passed** on main branch | `node --test tests/*.test.js` |
| 2 | Add LD `disclosurePolicy` + 3 `planningAdequacyChecks` entries | Pack JSON valid |
| 3 | Add L1–L4 fixtures + `workflow-ld-adequacy.test.js` | New tests green |
| 4 | Full suite | 100+ passed, Research tests unchanged |
| 5 | Manual 19-2-V1–V4 (Factory + API if available) | Log in closeout doc |
| 6 | Write `sprint-19-slice-2-closeout.md` | Docs only PR |

**Single implementation PR** recommended (pack + tests together) to avoid pack-only state without regression coverage.

---

## 12. Exit criteria for Slice 19-3

Move to profile thinning only when:

| Criterion | Evidence |
|-----------|----------|
| Adequacy covers enough assessment/page **awareness** | At least 3 shipped rules + manual log shows contextual notices after step list visible |
| **Duplicate** `learner_level` / `page_profile` / assessment **forceAsk** documented | 19-2 manual V1–V2 log lists overlapping profile questions |
| **Ready** non-blocked | Manual + tests: adequacy never in `missing_essential`; Factory reaches Ready without answering adequacy |
| Research stable | S1–S13 + full suite green |
| Deferred rules triaged | Product decision on 19-2b predicates OR accept profile/Settings for type/volume |

---

## 13. References

| Document | Role |
|----------|------|
| [`sprint-19-slice-2-charter.md`](sprint-19-slice-2-charter.md) | Charter |
| [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) | 19-1 context |
| `domains/research/domain-research-step-patterns.md` | Reference `planningAdequacyChecks` + `disclosurePolicy` |
| `tests/workflow-research-adequacy.test.js` | Test template |
| `app.js` | `evaluateWorkflowBriefPlanningAdequacyChecks`, `applyWorkflowBriefPlanningAdequacyAfterDesign` |

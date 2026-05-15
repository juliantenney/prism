# Sprint 19 Slice 19-3 — closeout (LD Profile Thinning)

**Date:** 2026-05-15  
**Status:** **Closed** — implementation + tests complete  
**Charter:** [`sprint-19-slice-3-charter.md`](sprint-19-slice-3-charter.md)  
**Implementation plan:** [`sprint-19-slice-3-implementation-plan.md`](sprint-19-slice-3-implementation-plan.md)  
**Prior slice:** [`sprint-19-slice-2-closeout.md`](sprint-19-slice-2-closeout.md)  
**Sprint pack:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`

**Verification:**

```bash
node --test tests/*.test.js
```

**Result:** **118 passed**, 0 failed

---

## 1. Implementation summary

Slice 19-3 thinned Learning Design **`stepRefinementProfiles`** using **pack-only** tier membership changes (Phase A + `page_profile` demotion). No runtime edits.

**Shipped scope:**

- **`assessment_pack`** — emptied `tiers.required`; demoted `assessment_type` and `assessment_total_items` to **optional**; retained other assessment optional tuning factors.
- **`design_page`** — emptied `tiers.required`; removed `learner_level` from profiles; demoted `page_profile` to **optional**; kept tone/depth/examples/practice/compactness optional.
- **`learner_page_pack`** — mirrored `design_page` thinning; profiles **not** removed.

**User-visible intent:** Post-generation profile refinement may still exist via **optional opt-in**, but **Ready** is no longer blocked by forced required-tier questions for factors already resolved by essentials, inference, or pack defaults.

---

## 2. Files changed

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | `stepRefinementProfiles` tier edits for all three profiles; page `optionalOptInPrompt` mentions Settings |
| `tests/workflow-ld-profile-thinning.test.js` | **New** — pack contract + queue-mirror tests (+10) |

**Not changed:**

| Path | Reason |
|------|--------|
| `app.js` | Pack-only mechanism; existing `forceAsk` / Ready path sufficient |
| `domains/research/domain-research-step-patterns.md` | Research frozen |
| Research tests / fixtures **S1–S13** | Regression anchor unchanged |
| `planningAdequacyChecks`, `disclosurePolicy` | Adequacy runtime and rules unchanged (19-2) |
| Renderer, schema, Prompt Studio | Out of scope |

---

## 3. Before / after — required tiers

| Profile | **Before (required)** | **After (required)** |
|---------|------------------------|----------------------|
| **`assessment_pack`** | `assessment_type`, `assessment_total_items` | **`[]`** |
| **`design_page`** | `page_profile`, `learner_level` | **`[]`** |
| **`learner_page_pack`** | `page_profile`, `learner_level` | **`[]`** |

All three profiles remain defined with unchanged `applicability` and `bindingMode`.

---

## 4. Optional tier changes

| Profile | Change |
|---------|--------|
| **`assessment_pack`** | `assessment_type`, `assessment_total_items` **prepended** to existing optional list (`difficulty_profile`, `coverage_scope`, `feedback_required`, `question_style_mix`, `cognitive_demand` unchanged) |
| **`design_page`** | `page_profile` **moved** from required to optional (first optional row); `learner_level` **removed**; tone/depth/examples/practice/compactness unchanged |
| **`learner_page_pack`** | Same as `design_page` |
| **Copy** | Page profiles: `optionalOptInPrompt` now references page profile + **step Settings** |

---

## 5. Frozen layers (confirmations)

| Layer | Status |
|-------|--------|
| **`app.js`** | **Unchanged** |
| **Research** pack, tests, fixtures **S1–S13** | **Unchanged** |
| **Planning adequacy** (`planningAdequacyChecks`, interpreter, cap 3) | **Unchanged** |

---

## 6. Pack-only mechanism (no runtime change)

`getPostGenerationElicitationQueueFromProfile` (`app.js`) maps profile tiers to queues:

| Pack tier | Runtime | Behaviour |
|-----------|---------|-----------|
| **`tiers.required`** | `buildQueue(ids, **true**)` | **forceAsk** — re-queues unless `explicit` / `elicited` (inferred values on required tier were re-asked pre-19-3) |
| **`tiers.optional`** | `buildQueue(ids, **false**)` | Skips when value present and source ≠ `default`; may queue on opt-in when unresolved or `default` |
| **Empty required** | `profileRequiredQueue === []` | `continueWorkflowDesignGeneration` → **Ready** without blocking post-gen chat (~6659–6671) |

**Slice 19-3 lever:** Edit tier membership only — empty required tiers avoid blocking; optional tiers remain for **opt-in** refinement after Ready.

**Not implemented:** Runtime treatment of **inferred** as `userProvided` on required tier (would need `app.js` change — charter non-goal).

---

## 7. Settings route

Assessment and page parameters remain editable via existing **`mappingRules`** → step **Settings** (unchanged):

| Factor | Mapping (representative) |
|--------|--------------------------|
| `learner_level` | `workflow.workflowOutputSpec.audience`, `step_define_learning_outcomes.learnerLevel`, `step_design_page.audience_level` |
| `assessment_type` | `constraints.assessment_type`, `step_design_assessment.activity_type` |
| `assessment_total_items` | `constraints.assessment_total_items`, `step_generate_assessment_items.number_of_items` |
| `page_profile` | `constraints.page_profile`, `step_design_page.page_profile` |
| Page tuning | `tone_style`, `depth_level`, `include_examples`, `include_practice_tasks`, `compact_vs_detailed` → `step_design_page.*` |

Profiles no longer duplicate essentials-level `learner_level` or force required-tier reassessment of inferred assessment controls.

---

## 8. Test results

```bash
node --test tests/*.test.js
```

| Milestone | Result |
|-----------|--------|
| Before Slice 19-3 | **108 passed**, 0 failed |
| **After Slice 19-3** | **118 passed**, 0 failed (**+10** `workflow-ld-profile-thinning.test.js`) |

**Coverage highlights:**

- Required tiers empty for all three profiles; `learner_level` absent from profile tiers.
- Queue mirror: inferred `assessment_type` / `assessment_total_items` not in required queue; essentials `learner_level` not in page required queue.
- `mappingRules` presence guard; adequacy pack block regression guard.
- **`workflow-ld-adequacy.test.js`** — still passes (108-suite regression).

---

## 9. Defects / unexpected dependencies

| Item | Status |
|------|--------|
| Blocking defects | **None** |
| **`getAssessmentPostGenerationElicitationQueue` fallback** | **Unchanged** — still used when no profile meta; profiles remain defined with non-empty optional tiers |
| Optional opt-in with `default` source | **Expected** — e.g. `page_profile: learner` may still appear on optional opt-in path; not required-blocking |

---

## 10. Recommendation

**Next step:** Manual LD Factory validation **M1–M4** (charter matrix) with:

```bash
npm run dev
```

Use **`.env.local`** API access; observe post-gen prompts, Ready timing, Planning adequacy panel, and step **Settings** for assessment/page workflows.

| ID | Scenario |
|----|----------|
| **M1** | Sparse assessment workflow |
| **M2** | `design_page` workflow |
| **M3** | `learner_page_pack` workflow |
| **M4** | Source-provided workflow |

Record remaining prompts vs duplicates removed in sprint review-log after manual pass.

---

## 11. Deferred

| Item | Notes |
|------|--------|
| **Optional profile copy cleanup** | Trim assessment optional list or shorten opt-in prompts if M1–M4 still feel noisy |
| **LD validation / conflict policies** | **Slice 19-4** — only if evidence emerges |
| **Richer parameter adequacy predicates** | `assessment_type_unspecified`, volume, page profile unspecified — only if needed; prefer Settings |
| **Runtime inferred suppression on required tier** | Not needed while required tiers stay empty |

---

## 12. Sprint 19 slice sequence (updated)

| Slice | Status |
|-------|--------|
| **19-1** | Closed — generic post-synthesis refinement queue off |
| **19-2** | Closed — structural planning adequacy |
| **19-3** | **Closed** — profile thinning (this document) |
| **19-4** | Charter when ready — LD validation/conflict port (optional) |

---

## 13. References

| Document | Role |
|----------|------|
| [`sprint-19-slice-3-charter.md`](sprint-19-slice-3-charter.md) | Charter |
| [`sprint-19-slice-3-implementation-plan.md`](sprint-19-slice-3-implementation-plan.md) | Phase A + page_profile demotion plan |
| [`sprint-19-slice-2-closeout.md`](sprint-19-slice-2-closeout.md) | Adequacy rules + Settings division |
| [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) | `askRefinementByDefault` / profile primary path |

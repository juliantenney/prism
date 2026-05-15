# Sprint 19 Slice 19-3 — implementation plan (LD Profile Thinning)

**Date:** 2026-05-15  
**Status:** **Plan only** — no implementation in this document  
**Charter:** [`sprint-19-slice-3-charter.md`](sprint-19-slice-3-charter.md)  
**Prior slices:** [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md), [`sprint-19-slice-2-closeout.md`](sprint-19-slice-2-closeout.md)

**Goal:** Smallest **pack-only** diff to `stepRefinementProfiles` that reduces redundant LD post-generation prompts — **`app.js` frozen**.

**Verification before implementation PR:**

```bash
node --test tests/*.test.js
```

**Expected:** **108 passed**, 0 failed

---

## 1. Runtime constraint (non-negotiable)

| Fact | Implication |
|------|-------------|
| `getPostGenerationElicitationQueueFromProfile` maps `tiers.required` → `buildQueue(ids, **true**)` | **Required** = runtime **forceAsk** — re-queues unless `explicit` / `elicited` in session |
| **Inferred** values are **not** treated as `userProvided` on required tier | Inference does **not** suppress required-tier prompts |
| `tiers.optional` → `buildQueue(ids, **false**)` | Skips when value present and source ≠ `default`; may still ask on opt-in when `default` or unresolved |
| Empty `profileRequiredQueue` → **immediate Ready** (`continueWorkflowDesignGeneration` ~6659–6671) | Emptying required tier is valid — optional factors surface only via later opt-in path |
| `__PRISM_TEST_API` does **not** export profile queue helpers | Tests must use **pack contract** + **test-local queue mirror** (no `app.js` change for exports) |

**Therefore Slice 19-3 works by editing LD `stepRefinementProfiles` tier membership only** — move factors **required → optional** or **remove** from profile tiers; do not change runtime `forceAsk` semantics.

**Out of scope:** `getAssessmentPostGenerationElicitationQueue` fallback logic (runs when no profile meta); `intentClasses.assessment_pack.elicitation.mustAskFactors` (separate path — **do not widen** in 19-3).

---

## 2. Exact pack location

| Item | Value |
|------|--------|
| **File** | `domains/learning-design/domain-learning-design-step-patterns.md` |
| **Section** | `### Workflow Brief Config` → JSON `workflowBriefConfig` |
| **Key** | `stepRefinementProfiles` (sibling of `disclosurePolicy`, `planningAdequacyChecks`, `questionPolicy`) |
| **Line anchor (current)** | `stepRefinementProfiles` ~1081; profiles end ~1405 before `disclosurePolicy` |

**Do not edit in 19-3:** `planningAdequacyChecks`, `disclosurePolicy`, `questionPolicy`, `mappingRules`, `intentClasses`, Research pack, `app.js`.

---

## 3. Proposed profile changes (per profile)

### 3.1 `assessment_pack`

**Applicability (unchanged):** `intentClassAnyOf: ["assessment_pack"]`, `requiresAnyCanonicalSteps: ["generate_assessment_items"]`.

| Factor | Current tier | Proposed | Rationale |
|--------|--------------|----------|-----------|
| `assessment_type` | **required** | **optional** (move row to `tiers.optional`, preserve `questionText` / `parseHints`) | Pack default `mixed` + inference from goal (`mcq`, `essay`, etc.); required tier **forceAsk** re-prompts after inference; optional tier skips when inferred value present |
| `assessment_total_items` | **required** | **optional** (same) | Pack default `10`; inference from goal numbers; same duplication issue |
| `difficulty_profile` | optional | **optional** (keep) | Settings via `stepParams.step_generate_assessment_items.difficulty_profile` |
| `coverage_scope` | optional | **optional** (keep) | Settings-mappable |
| `feedback_required` | optional | **optional** (keep) | Settings-mappable |
| `question_style_mix` | optional | **optional** (keep) | Settings-mappable |
| `cognitive_demand` | optional | **optional** (keep) | Settings-mappable |
| *(none)* | — | **required: empty** | After demotion, no required-tier factors — post-gen goes **Ready** unless user accepts optional opt-in |

**Keep required (minimal diff):** **none** — assessment run-blocking controls are covered by workflow essentials (`assessment_required`), synthesis, and step Settings defaults.

**Risk note:** Sparse assessment brief with **no** inference and only defaults → optional tier may still offer type/count on opt-in; essentials `mustAsk: true` on factors may still apply **pre-synthesis** (unchanged).

---

### 3.2 `design_page`

**Applicability (unchanged):** `requiresAnyCanonicalSteps: ["design_page"]` + `whenGoalMentionsAnyOf` page phrases.

| Factor | Current tier | Proposed | Rationale |
|--------|--------------|----------|-----------|
| `learner_level` | **required** | **remove** from profile (both tiers) | **Required essential** (`requiredFactors`) + inference rules; `mappingRules` → `stepParams.step_design_page.audience_level`; profile re-ask is pure duplication |
| `page_profile` | **required** | **Phase A (minimal):** keep required — **Phase B (recommended):** demote to **optional** | Required tier **forceAsk** re-asks even when `page_profile` is `default` (`learner`) — see §4; adequacy `ld_page_profile_facilitator_mismatch` covers structural facilitator mismatch |
| `tone_style` … `compact_vs_detailed` | optional | **optional** (keep) | Settings-first tuning |

**Keep required (minimal diff only):** `page_profile` only.

**Keep required (recommended diff):** **none** — demote `page_profile` to optional; structural gaps via adequacy + Settings.

---

### 3.3 `learner_page_pack`

**Applicability (unchanged):** same goal triggers as `design_page`; `requiresAnyCanonicalSteps: ["design_page"]`.

| Factor | Current tier | Proposed | Rationale |
|--------|--------------|----------|-----------|
| `learner_level` | **required** | **remove** from profile | Mirror `design_page` |
| `page_profile` | **required** | Same as `design_page` (Phase A keep / Phase B demote) | Duplicate profile; apply **identical** tier edits |
| Optional factors | optional | **optional** (keep) | Same Settings overlap as `design_page` |

**Profile retention:** Do **not** delete `learner_page_pack` — precedence vs `design_page` unchanged; only tier membership changes.

**Optional copy tweak (Phase B, pack-only):** Update `optionalOptInPrompt` on both page profiles to mention **step Settings** for tone/depth/examples (one sentence each).

---

## 4. Recommended minimal diff (implementation order)

**Strong preference — ship as single PR (Phase A only):**

```text
assessment_pack.tiers.required     → []  (move assessment_type, assessment_total_items to optional)
design_page.tiers.required         → [ page_profile ]  (remove learner_level row)
learner_page_pack.tiers.required     → [ page_profile ]  (remove learner_level row)
```

**Do not:**

- Remove profiles entirely  
- Change `applicability`, `bindingMode`, or `intentClasses`  
- Touch `mappingRules` or step schema Settings keys  
- Edit `app.js`

**Phase B (separate PR or same PR if manual M2/M3 still noisy):**

```text
design_page.tiers.required           → []
design_page.tiers.optional           → add page_profile (from required)
learner_page_pack                    → mirror
assessment_pack optional tier trim   → optional (drop 1–2 low-value optional factors + shorter opt-in prompt)
```

### Why Phase B matters for `page_profile`

Required-tier logic (`forceAsk: true`):

```javascript
if (forceAsk || !hasResolvedValue || src === "default") { /* queue */ }
```

With `page_profile: "learner"` and `resolvedSources.page_profile === "default"`, **required tier still queues** `page_profile` after synthesis. Phase A alone fixes **learner_level** duplication; **page_profile** repetition needs **demotion to optional** (or removal from profile).

### Expected post-gen behaviour after Phase A

| Workflow | Before | After Phase A |
|----------|--------|----------------|
| Assessment + inferred type/count | Required re-ask type/count | **Ready** (optional opt-in only) |
| Page + essentials learner_level | Re-ask learner_level + page_profile | Re-ask **page_profile** only |
| Source-only (no assessment/page profile) | No profile / fallback only | Unchanged |

---

## 5. Settings mapping check

Confirm every demoted/removed profile factor remains tunable via existing `mappingRules` and step Settings UI.

| Factor | Profile change | Settings / mapping route | Run without profile prompt? |
|--------|----------------|--------------------------|----------------------------|
| `learner_level` | Remove from page profiles | `mappingRules`: `workflow.workflowOutputSpec.audience`, `step_define_learning_outcomes.learnerLevel`, `step_design_page.audience_level` | **Yes** — essential + inference |
| `assessment_type` | Demote to optional | `workflow.workflowOutputSpec.constraints.assessment_type`, `step_design_assessment.activity_type` | **Yes** — default `mixed` + inference |
| `assessment_total_items` | Demote to optional | `constraints.assessment_total_items`, `step_design_assessment.total_items`, `step_generate_assessment_items.number_of_items` | **Yes** — default `10` + inference |
| `page_profile` | Phase B demote | `constraints.page_profile`, `stepParams.step_design_page.page_profile`; Design Page step option `page_profile` | **Yes** — default `learner` + adequacy for mismatch |
| `difficulty_profile` | Stay optional | `step_generate_assessment_items.difficulty_profile` | Yes (default `balanced`) |
| `coverage_scope` | Stay optional | `step_design_assessment.coverage_scope` | Yes |
| `feedback_required` | Stay optional | `step_design_feedback.feedback_required` | Yes |
| `question_style_mix` | Stay optional | `step_generate_assessment_items.question_style_mix` | Yes |
| `cognitive_demand` | Stay optional | `step_design_assessment.cognitive_demand` | Yes |
| `tone_style` | Stay optional | `step_design_page.tone_style` | Yes |
| `depth_level` | Stay optional | `step_design_page.depth_level` | Yes |
| `include_examples` | Stay optional | `step_design_page.include_examples` | Yes |
| `include_practice_tasks` | Stay optional | `step_design_page.include_practice_tasks` | Yes |
| `compact_vs_detailed` | Stay optional | `step_design_page.output_density` | Yes |

**No new mappings required** for Phase A.

---

## 6. Planning adequacy interaction (Slice 19-2)

Adequacy is **assistive**, **non-blocking**, Planning panel only — does **not** replace Settings.

| Adequacy rule | Structural warning (not profile chat) | Related factors |
|---------------|--------------------------------------|-----------------|
| `ld_generate_without_source` | Topic-only strategy vs source language + `Normalize Content` | `input_strategy` — essentials |
| `ld_scope_step_mismatch` | Session scope vs long step chain | `design_scope` — essentials |
| `ld_assessment_generate_step_missing` | Assessment brief without `Generate Assessment Items` | `assessment_required`, step graph |
| `ld_page_profile_facilitator_mismatch` | Facilitator brief language vs `page_profile: learner` + `Design Page` | `page_profile` — **Settings** + brief, not profile required tier |

**Deferred adequacy (19-2) — remain Settings-only in 19-3:**

| Factor | Why not adequacy |
|--------|------------------|
| `assessment_type_unspecified` | Always has default/inference |
| `assessment_volume_unspecified` | Default `10` |
| `page_profile_unspecified` | Default `learner` |

**Division of labour after 19-3:**

- **Profiles:** run-blocking gaps only (ideally empty required tiers)  
- **Adequacy:** plan/brief **shape** mismatches  
- **Settings:** parameter tuning (type, count, tone, depth, etc.)

---

## 7. Test plan

**File (proposed):** `tests/workflow-ld-profile-thinning.test.js`  
**Fixtures (proposed):** `tests/fixtures/workflow-brief-ld-profiles/`

No `app.js` edits — use patterns from `tests/workflow-ld-adequacy.test.js` (load LD pack JSON, `__PRISM_TEST_API` for factor resolution only).

### 7.1 Pack contract tests (Tier A — required)

Parse `workflowBriefConfig.stepRefinementProfiles` and assert:

| Test | Assertion |
|------|-----------|
| `design_page` required IDs | Does **not** include `learner_level` |
| `learner_page_pack` required IDs | Does **not** include `learner_level` |
| `assessment_pack` required IDs | Does **not** include `assessment_type`, `assessment_total_items` |
| `assessment_pack` optional IDs | **Includes** `assessment_type`, `assessment_total_items` (after move) |
| Profiles exist | All three profile keys still present |

### 7.2 Queue mirror tests (Tier B — recommended)

Add **test-local** helper mirroring `getPostGenerationElicitationQueueFromProfile` `buildQueue` (~25 lines, comment: keep in sync with `app.js` 6304–6335). Inputs: resolved map + `resolvedSources` + `elicitedValues`.

| Fixture | `resolved` / `sources` | Design steps | Expect `requiredQueue` IDs |
|---------|------------------------|--------------|----------------------------|
| **P1** | Inferred `assessment_type: mcq`, `assessment_total_items: 10`, sources `inferred` | `Generate Assessment Items` | **[]** |
| **P2** | Explicit `learner_level: undergraduate` (essential), `page_profile: learner` default | `Design Page` | Phase A: `["page_profile"]` only; Phase B: **[]** |
| **P3** | Unresolved `assessment_type` (absent), default count only | `Generate Assessment Items` | **[]** (required empty); optional may include type on opt-in — document |
| **P4** | Coherent page brief | `Design Page` | No `learner_level` in required |

### 7.3 Regression

| Suite | Expectation |
|-------|-------------|
| `tests/workflow-ld-adequacy.test.js` | Unchanged pass (pack adequacy block untouched) |
| All `tests/*.test.js` | **108+** pass, 0 fail |

### 7.4 Ready semantics (manual + trace)

When `requiredQueue` empty, trace `[PRISM][WizardFlow] no required post-generation queue; finalizing` and badge **Ready** — no new automated test unless Tier B fixtures cover it.

### 7.5 Profiles still useful

| Case | Expect |
|------|--------|
| Assessment optional opt-in | User says **yes** → optional queue may include type/count if `default`/unresolved |
| Page workflow | Profile still activates (`design_page` or `learner_page_pack` id in trace) even if required empty |

---

## 8. Manual validation

| ID | Scenario | Pass criteria |
|----|----------|---------------|
| **M1** | Sparse **assessment** workflow — goal mentions quiz/MCQ, essentials complete, synthesis includes `Generate Assessment Items` | No post-gen re-ask for **type/count** when inferred; **Ready** or optional opt-in only; difficulty adjustable in **Settings** |
| **M2** | **design_page** — learner-facing page goal, `learner_level` from essentials | **No** `learner_level` profile question; Phase B: no redundant `page_profile` force-ask |
| **M3** | **learner_page_pack** — same as M2 | Same as M2; compare prompt count to `design_page` |
| **M4** | **Source-provided** workflow — upload/source strategy, no assessment/page steps | No `assessment_pack` / page profile prompts; adequacy may show `ld_generate_without_source` only in Planning panel |

**Record in closeout:** remaining post-gen prompt IDs, duplicates removed, Settings usability, Planning adequacy overlap (M5 from charter optional).

---

## 9. Risks and rollback

| Risk | Mitigation |
|------|------------|
| Over-thinning — sparse assessment missing type/count before run | Pre-synthesis `mustAsk` on factors unchanged; optional opt-in; Settings defaults |
| `page_profile` still asked (Phase A) | Ship Phase B demotion if M2/M3 fail |
| Empty required → users miss optional tuning | Opt-in prompt + Settings; manual M1–M3 |
| Test mirror drifts from `app.js` | Keep mirror minimal; prefer Tier A pack tests |

**Rollback:** Restore previous `stepRefinementProfiles` JSON blocks from git (required tiers as of pre-19-3). No runtime rollback needed.

---

## 10. Recommendation

| Approach | Verdict |
|----------|---------|
| **Implement minimal thinning first (Phase A)** | **Yes** — matches charter “smallest pack-only diff”: remove `learner_level` from page required; demote assessment type/count; **low risk**, immediate win on M1 + learner_level |
| **Include optional tier cleanup in same PR** | **Defer** — trim assessment optional list + page `optionalOptInPrompt` copy is **Phase B** unless Phase A manual still feels noisy |
| **Include `page_profile` demotion in Phase A** | **Strongly consider** if M2/M3 are in the same validation pass — one extra tier move, fixes `default` forceAsk without runtime |

**Suggested PR scope:** **Phase A + `page_profile` demotion (Phase B page part only)** in one implementation PR; defer assessment optional list trimming to a follow-up doc-only polish if tests and M1–M4 pass.

---

## 11. Implementation checklist (for follow-on PR)

1. [ ] Edit `stepRefinementProfiles` only in LD pack (~1081–1405).  
2. [ ] Add `tests/workflow-ld-profile-thinning.test.js` + fixtures (Tier A minimum).  
3. [ ] `node --test tests/*.test.js` — 108+ pass.  
4. [ ] Manual M1–M4 on XAMPP.  
5. [ ] `docs/consolidation/sprint-19-slice-3-closeout.md` + sprint `review-log.md` entry.

---

## 12. Verification

```bash
node --test tests/*.test.js
```

| Milestone | Expected |
|-----------|----------|
| Plan commit (this doc) | **108 passed**, 0 failed |
| After implementation | **108+** passed; +4–8 profile tests typical |

---

## 13. References

| Document | Role |
|----------|------|
| [`sprint-19-slice-3-charter.md`](sprint-19-slice-3-charter.md) | Scope, acceptance, risks |
| [`sprint-19-slice-2-closeout.md`](sprint-19-slice-2-closeout.md) | Adequacy rules, cap-3, fixture notes |
| `app.js` ~6304–6671 | Profile queue + Ready path (read-only) |
| `docs/audits/ld-workflow-generation-rationalisation-audit.md` | Original duplication findings |

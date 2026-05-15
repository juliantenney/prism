# Sprint 19 Slice 19-2 — closeout (LD Planning Adequacy Pilot)

**Date:** 2026-05-15  
**Status:** **Closed** — implementation + tests complete  
**Charter:** [`sprint-19-slice-2-charter.md`](sprint-19-slice-2-charter.md)  
**Implementation plan:** [`sprint-19-slice-2-implementation-plan.md`](sprint-19-slice-2-implementation-plan.md)  
**Prior slice:** [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md)  
**Sprint pack:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`

**Verification:**

```bash
node --test tests/*.test.js
```

**Result:** **108 passed**, 0 failed

---

## 1. Implementation summary

Slice 19-2 added **Learning Design** `planningAdequacyChecks` and a Research-shaped **`disclosurePolicy`** to the LD domain pack. Adequacy is **assistive**, **deterministic**, and **non-blocking** — surfaced in the Planning panel **after workflow synthesis** when essentials are complete.

**No runtime changes:** LD reuses the existing Research adequacy interpreter (`evaluateWorkflowBriefPlanningAdequacyChecks`, `applyWorkflowBriefPlanningAdequacyAfterDesign`, `continueWorkflowDesignGeneration` wiring from Sprint 18).

**Structural focus only:** Rules detect **workflow-shape / brief-plan mismatches** (source strategy, scope vs step count, missing assessment generate step, page profile vs facilitator language). **Not** “missing nuanced parameter” rules — those remain deferred because LD defaults and inference populate most tuning factors before adequacy runs.

**Profiles unchanged:** `stepRefinementProfiles` remain active in 19-2; overlap with profile post-gen chat is expected until Slice 19-3.

---

## 2. Files changed

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | `disclosurePolicy` + `planningAdequacyChecks` (4 rules) inserted before `stopConditions` |
| `tests/workflow-ld-adequacy.test.js` | **New** — evaluator + Planning-panel integration tests |
| `tests/fixtures/workflow-brief-ld-adequacy/L1-generate-without-source.json` | **New** |
| `tests/fixtures/workflow-brief-ld-adequacy/L2-scope-step-mismatch.json` | **New** |
| `tests/fixtures/workflow-brief-ld-adequacy/L3-assessment-generate-step-missing.json` | **New** |
| `tests/fixtures/workflow-brief-ld-adequacy/L4-coherent-no-false-positives.json` | **New** |
| `tests/fixtures/workflow-brief-ld-adequacy/L5-page-profile-facilitator-mismatch.json` | **New** (optional 4th rule) |

**Not changed:**

| Path | Reason |
|------|--------|
| `app.js` | No runtime rewrite; existing interpreter sufficient |
| `domains/research/domain-research-step-patterns.md` | Research frozen |
| `tests/workflow-research-sparse-briefs.test.js` | S1–S6 unchanged |
| `tests/workflow-research-adequacy.test.js` | S7–S9 unchanged |
| `tests/workflow-research-conflict-exceptions.test.js` | S13 unchanged |
| `tests/fixtures/workflow-brief-research-sparse/S1`–`S13.json` | Research golden fixtures frozen |
| `stepRefinementProfiles` | Deferred to Slice 19-3 |
| Renderer, schema, Prompt Studio | Out of scope |

---

## 3. Implemented adequacy rule IDs

| `id` | Intent |
|------|--------|
| **`ld_generate_without_source`** | `generate_from_topic` + source/upload language in brief + `Normalize Content` in plan |
| **`ld_scope_step_mismatch`** | `design_scope: session` + plan with ≥ 8 steps |
| **`ld_assessment_generate_step_missing`** | Assessment-oriented brief + no `Generate Assessment Items` in plan |
| **`ld_page_profile_facilitator_mismatch`** | Facilitator/tutor brief language + `Design Page` + `page_profile: learner` |

All rules use `category: planning_adequacy`, `severity: recommendation`, and pack-authored `disclosurePolicy` messages/actions.

---

## 4. Deferred rules (not implemented)

| Rule (charter / plan name) | Reason |
|----------------------------|--------|
| **`assessment_type_unspecified`** | `assessment_type` has pack default `mixed`; inference sets concrete types — no “absent factor” predicate |
| **`assessment_volume_unspecified`** | `assessment_total_items` default `10` resolves before adequacy — no `resolvedSourceEquals` / absent-factor `when` clause |
| **`page_profile_unspecified`** | `page_profile` optional default `learner` — always present when relevant |

**Future:** Slice **19-2b** (charter) if new predicates are approved; otherwise address tuning via **Settings** and **19-3** profile thinning.

---

## 5. Runtime and test behaviour notes

### Reuses Research interpreter

LD activates adequacy **only** by declaring `planningAdequacyChecks` and `disclosurePolicy` in the LD pack. The same code path as Research:

- `buildWorkflowRefinementContext`
- `evaluateWorkflowBriefPlanningAdequacyChecks`
- `applyWorkflowBriefPlanningAdequacyAfterDesign` → `buildWorkflowBriefPlanningDisclosures` → Planning panel

### Fixture design: post-synthesis snapshots

LD adequacy tests pass **`modelSteps` as the designed workflow** without running `applyWorkflowDesignHeuristics` on the fixture chain. This prevents heuristics from **appending** steps (e.g. `Generate Assessment Items` when `assessment_required` is true) and **masking** structural rules under test.

Factory runs still use full synthesis + heuristics; tests isolate **pack policy** against a controlled step list.

### Cap of 3 rows — declaration order matters

`WORKFLOW_BRIEF_PLANNING_ADEQUACY_MAX_ROWS = 3`. The evaluator returns the **first three matching** checks in **pack declaration order**:

1. `ld_generate_without_source`  
2. `ld_scope_step_mismatch`  
3. `ld_assessment_generate_step_missing`  
4. `ld_page_profile_facilitator_mismatch` (fourth — shown only if earlier rules do not fill the cap)

Briefs that match multiple rules may not surface the fourth rule in the Planning panel until earlier rules stop matching or pack order changes.

### Ready state

Adequacy is **non-blocking** — it does not gate `continueWorkflowDesignGeneration` completion or Factory **Ready**; profile post-gen queues remain separate.

---

## 6. Test results

```bash
node --test tests/*.test.js
```

| Milestone | Result |
|-----------|--------|
| Before Slice 19-2 | **100 passed**, 0 failed |
| **After Slice 19-2** | **108 passed**, 0 failed (**+8** LD adequacy tests) |

**LD test file:** `tests/workflow-ld-adequacy.test.js` — L1–L5 fixtures, essentials-missing negative, post-synthesis panel merge, pack rule inventory.

**Research regression:** No Research files edited; existing Research adequacy count unchanged.

---

## 7. Recommendations

### Slice 19-3 — profile thinning

- Thin **`stepRefinementProfiles`** required tiers — especially **`forceAsk`** duplication and **`learner_level` re-ask** when essentials already resolved.  
- Skip profile questions when factors are already resolved with explicit/inferred/elicited provenance.  
- Reduce overlap between adequacy notices and profile chat documented in 19-1 manual validation.

### Parameter tuning — prefer Settings

- Keep **assessment/page tuning** in **step Settings** (`mappingRules` → `stepParams`) unless a factor is **genuinely run-blocking**.  
- Use **planning adequacy** for **structural** plan/brief fit, not every unset refinement factor.

### Slice 19-4 (later)

- Port Research-style **`validationRules`** / **`conflictPolicies`** to LD only when evidence supports — separate charter.

---

## 8. Exit criteria for Slice 19-3 (from implementation plan)

| Criterion | Status after 19-2 |
|-----------|-------------------|
| Structural adequacy live | **Done** — 4 rules + tests |
| Research stable | **Done** — 108 tests, S1–S13 untouched |
| Profile duplication documented | **Known** — manual 19-1 + overlap risk with assessment/page profiles |
| Ready non-blocked by adequacy | **Done** — assistive-only contract |

---

## 9. References

| Document | Role |
|----------|------|
| [`sprint-19-slice-2-charter.md`](sprint-19-slice-2-charter.md) | Charter |
| [`sprint-19-slice-2-implementation-plan.md`](sprint-19-slice-2-implementation-plan.md) | Feasibility + test plan |
| [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) | Generic post-synthesis queue off |
| `domains/research/domain-research-step-patterns.md` | Reference pack shape |

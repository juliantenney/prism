# 38S — First-class Episode Plan workflow step

**Date:** 2026-06-08  
**Status:** **COMPLETE** (production workflow integration)  
**Type:** Implementation completion — workflow graph + runtime wiring  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)  
**Inputs:** [38S-1 integration](38S-1-episode-plan-v1-integration.md) Option A · [38S-3 DLA wiring](38S-3-dla-obligation-tagging.md) · production workflow audit (2026-06-08)

---

## Executive answer

**Can Episode Plan V1 be represented, executed, persisted, and passed downstream as a real workflow artefact?**

**Yes — after this change.** Episode Plan is now a registered LD workflow step with `outputName: episode_plans`, deterministic run-mode capture, DLA upstream consumption, and population-contract enforcement.

**Sprint 38S closure:** Ready for **38S-6** after manual UI re-run confirms V1 replace behaviour on Design Episode Plan step. Automated chase: **EV-38S-PRODUCTION-CHASE** — `fullOk: true`.

---

## Wrong taxonomy root cause

Manual run produced invented taxonomy (`concept_explanation`, `introduce_concept`, `explain_key_ideas`, etc.) because:

| Factor | Finding |
|--------|---------|
| **Pack prompt / LLM generation** | **Primary cause.** `executionMode: deterministic_derive` was documented in pack JSON but **not enforced** in runtime. Users could Copy step instructions → run in an LLM → paste output into Run capture. |
| **UI auto-fill helper** | **Secondary.** `maybeAutoPopulateDesignEpisodePlanRunCapture()` only filled **empty** captures; LLM paste was preserved. |
| **Proof harness vs production** | Harness always calls `deriveEpisodePlansFromLearningOutcomes()` before DLA. Production exposed a prompt-shaped step without mandatory canonical enforcement. |
| **Old template / fallback** | **Not the cause.** `lib/episode-plan-v1-templates.js` only emits frozen `understand|apply|analyse|evaluate` + approved FunctionEnum beats. |
| **DLA hidden derive** | DLA does not invent archetypes; invalid captures were accepted at Episode Plan step and passed downstream. |

**Fix (2026-06-08):** `lib/episode-plan-v1-validation.js` + capture-time canonical replace via `applyEpisodePlanCaptureCanonicalEnforcement()` — invalid taxonomy is replaced with `deriveEpisodePlansFromLearningOutcomes()` when LO is available.

---

## Runtime path

### Before

```text
KM → LO → DLA (+ hidden JS derive/enforce from LO at capture sync) → GAM → Page
```

Episode Plan existed only as transient JS inside DLA post-capture enforcement.

### After

```text
KM → LO → Design Episode Plan (episode_plans capture) → DLA → GAM → Page
```

| Stage | Behaviour |
|-------|-----------|
| **Design Episode Plan** | Deterministic derive from `learning_outcomes` (38R-2 templates); auto-populates when empty; **replaces non-V1 captures** at sync |
| **DLA prompt** | Receives upstream `episode_plans` JSON + population-only contract block |
| **DLA capture** | Population contract merge/tags still applied post-capture |
| **Legacy workflows** | Without Design Episode Plan step: non-canonical LO fallback (`source: learning_outcomes_fallback_non_canonical`) |

---

## Generation mode (Task 3)

**Option A — deterministic template step** (chosen).

- No LLM replanning for Episode Plan V1
- `lib/episode-plan-v1-templates.js` → `deriveEpisodePlansFromLearningOutcomes()`
- Pack `executionMode: deterministic_derive` documents intent; run mode auto-fills capture

---

## V1 vocabulary enforcement (2026-06-08)

- **Archetypes (frozen):** `understand`, `apply`, `analyse`, `evaluate` only
- **Beat functions:** approved FunctionEnum from `episode-plan-population-contract.js` / 38Q-2
- **Validation:** `validateEpisodePlansContainerV1()` — rejects invented archetypes, beat functions, non-V1 fields
- **Capture enforcement:** invalid plans replaced with canonical derive; DLA ignores invalid upstream captures

## Files changed

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | Policy graph, trigger rules, §5 Design Episode Plan |
| `domains/learning-design/domain-learning-design-artefacts.md` | `episode_plans` artefact definition |
| `lib/episode-plan-v1-validation.js` | **New** — frozen archetype + FunctionEnum validation |
| `lib/episode-plan-population-contract.js` | Archetype enum check in `assertPlanBeforePopulateGate` |
| `lib/episode-plan-dla-integration.js` | Container gate delegates to V1 validation |
| `app.js` | Canonical capture enforcement, invalid-capture rejection for DLA |
| `index.html` | Load validation module |
| `tests/episode-plan-v1-validation.test.js` | V1 taxonomy tests |
| `tests/workflow-ld-episode-plan-step.test.js` | Policy + canonical replace tests |
| `artefacts/ev-38s-production-pipeline-chase.mjs` | Automated pipeline chase |

---

## Policy graph changes

- **canonicalSteps:** `Design Episode Plan` after `Define Learning Outcomes`
- **dependencies:** `Design Episode Plan` requires `learning_outcomes`, produces `episode_plans`
- **dependencies:** `Design Learning Activities` requires `learning_outcomes` + `episode_plans`
- **precedenceRules:** LO → Episode Plan → DLA
- **stepRoleAnchors:** Episode planning purpose string

---

## Fallback behaviour

| Condition | Resolution |
|-----------|------------|
| Workflow has Design Episode Plan step + `episode_plans` capture | **Canonical** — used by DLA prompt and enforcement |
| Workflow has Design Episode Plan step + missing capture | **Fail** — PF-11; DLA prompt gate text; step marked incomplete |
| Workflow has **no** Design Episode Plan step + LO capture | **Non-canonical fallback** — derive from LO (backward compat) |
| Harness `ev-38l-inflation-pipeline-capture-once.mjs` | Unchanged explicit derive path |

---

## Manual workflow visibility

**Automated:** `tests/workflow-ld-episode-plan-step.test.js` confirms heuristics insert **Design Episode Plan** between LO and DLA for activity-shaped briefs.

**Manual UI:** Generate or open an LD workflow with activities → step list should show:

```text
Define Learning Outcomes
→ Design Episode Plan
→ Design Learning Activities
```

Run mode on Design Episode Plan auto-fills `episode_plans` JSON when capture is empty (requires completed LO capture upstream).

---

## Construct Learning Sequence note (Task 8)

**Construct Learning Sequence remains unaudited** after Episode Plan insertion. Future work should classify it as delivery sequencing, session sequencing, obsolete instructional sequencing, or mixed. Not addressed in this task.

---

## Test results

| Suite | Result |
|-------|--------|
| `tests/episode-plan-v1-validation.test.js` | **3/3 pass** |
| `tests/workflow-ld-episode-plan-step.test.js` | **6/6 pass** |
| `tests/episode-plan-dla-integration.test.js` | **10/10 pass** |
| `tests/page-38p-role-supersession.test.js` | **13/13 pass** — EV-38S-AFTER-4 RF1 / SC-7 |
| `ev-38s-production-pipeline-chase.mjs` | **PASS** — V1 archetypes, DLA contract, GAM text, `fullOk: true` |

---

## Remaining risks

1. **Saved legacy workflows** without Design Episode Plan still use LO fallback — reviewers should migrate workflows or accept non-canonical path.
2. **Manual production UI run** not yet recorded in this observation — recommended before sprint closure.
3. **Construct Learning Sequence** relationship to Episode Plan undefined (see above).
4. Pack §6 DLA prompt still contains IFP planning language; runtime population block + upstream `episode_plans` override intent — full pack §6 refactor is follow-on.

---

## Manual production chase evidence (automated)

**Report:** `artefacts/EV-38S-PRODUCTION-CHASE-report.json`

| Check | Result |
|-------|--------|
| Episode Plan V1 taxonomy | `understand`, `apply`, `analyse`, `evaluate` |
| DLA population contract | Pass |
| GAM pack text | Pass (44k+ chars, not JSON stub) |
| Page fidelity replay | `proofOk` / `roleOk` / `fullOk` **true** |

**Artefact paths (EV-38S-AFTER-4):**

- `.../EV-38S-AFTER-4-episode-plans.json`
- `.../EV-38S-AFTER-4-dla-learning-activities.json`
- `.../EV-38S-AFTER-4-gam.txt`
- `.../EV-38S-AFTER-4-design-page-replay.json`
- `.../EV-38S-AFTER-4-render.html`

## Success condition checklist

| Criterion | Status |
|-----------|--------|
| Episode Plan visible in workflow graph | **Yes** |
| Persisted as `episode_plans` | **Yes** |
| Frozen V1 taxonomy enforced | **Yes** — validation + canonical replace |
| DLA consumes artefact | **Yes** — invalid captures rejected |
| GAM pack text | **Yes** — chase pass |
| Rendered learner page | **Yes** — replay `fullOk` |
| 38S closure | **Ready** — confirm one fresh UI run with V1 replace message |

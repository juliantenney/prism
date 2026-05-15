# Sprint 19 Slice 19-3 — LD Profile Thinning and De-duplication

**Date:** 2026-05-15  
**Status:** **Closed** — see [`sprint-19-slice-3-closeout.md`](sprint-19-slice-3-closeout.md)  
**Sprint:** 19 — Learning Design Workflow Rationalisation  
**Slice:** 19-3

**Prior slices:**

| Slice | Outcome |
|-------|---------|
| **19-1** | [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) — `askRefinementByDefault: false`; generic post-synthesis `refinementFactors` queue **disabled** |
| **19-2** | [`sprint-19-slice-2-closeout.md`](sprint-19-slice-2-closeout.md) — LD `planningAdequacyChecks` (4 structural rules); **108** tests; `app.js` unchanged |

**Context pack:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`  
**LD audit:** `docs/audits/ld-workflow-generation-rationalisation-audit.md`  
**LD pack (target):** `domains/learning-design/domain-learning-design-step-patterns.md` → `workflowBriefConfig.stepRefinementProfiles`

**Verification baseline:**

```bash
node --test tests/*.test.js
```

**Expected:** **108 passed**, 0 failed (charter commit); same after implementation unless new profile tests are added.

---

## 1. Purpose

Reduce **redundant post-generation refinement prompts** by thinning **`stepRefinementProfiles`** and aligning profile behaviour with provenance-aware suppression — without removing legitimate **run-blocking** elicitation.

After 19-1 and 19-2, **`stepRefinementProfiles` are the primary remaining “wizard” source** for Learning Design. This slice rebalances the four guidance layers so chat asks only what profiles must still own.

---

## 2. Architectural principle

| Layer | Role in Slice 19-3 |
|-------|-------------------|
| **Required essentials** | Asked **once** when missing — still **blocking** pre-synthesis |
| **Planning adequacy** | **Structural** fit signals in the Planning panel (19-2) — assistive, non-blocking |
| **Step Settings** | **Primary** surface for advanced parameter tuning (`mappingRules` → `stepParams`) |
| **Profile post-gen** | Reserved for **genuinely unresolved, run-blocking** step parameters only |

**Rule:** Runtime interprets policy; domain packs declare policy. Prefer **pack-tier changes** (required → optional, factor removal, opt-in copy) over runtime rewrites.

### Runtime wiring (authoritative — pack design must respect this)

`getPostGenerationElicitationQueueFromProfile` (`app.js`) maps profile tiers to queues:

| Pack tier | Runtime `forceAsk` | Ask behaviour (simplified) |
|-----------|-------------------|----------------------------|
| `tiers.required` | **`true`** | Queues factor unless **explicit** / **elicited** in session map — **inferred values are still re-asked** |
| `tiers.optional` | **`false`** | Queues only when **unresolved** or source is **`default`**; skips when value present (including **inferred**) |

**Implication for 19-3 (no `app.js` change):** thinning **required** tiers (demote or remove factors) is the primary pack lever. Treating **inferred** like “already answered” on required tiers would need a **runtime** change — **out of scope** unless a blocking defect is found.

When a profile matches, `continueWorkflowDesignGeneration` replaces the generic post-synthesis queue with **`profileRequiredQueue`**; optional profile factors follow the opt-in path. Generic `refinementFactors` remain off (19-1).

---

## 3. Context from Slices 19-1 and 19-2

### Slice 19-1

- `askRefinementByDefault` controls **`getWorkflowRefinementQueue`** only — **after** synthesis.
- **Profiles unchanged** in 19-1; they became the **main** post-gen chat path once the generic queue was empty.

### Slice 19-2

- Structural guidance moved to **Planning adequacy** (`ld_generate_without_source`, scope/step mismatch, assessment generate step, page profile mismatch).
- **No runtime changes** — Research adequacy interpreter reused.
- **Settings** and **mappingRules** already expose tone, depth, examples, assessment tuning on steps.
- **Deferred** adequacy rules for “unspecified tuning” factors (defaults/inference always present).

**Combined effect:** Profiles should stop duplicating **inferred essentials**, **structural nudges** (adequacy), and **Settings-tunable** parameters.

---

## 4. Scope

| In scope (Slice 19-3) | Out of scope (Slice 19-3) |
|------------------------|---------------------------|
| Modify LD **`stepRefinementProfiles` only** (`assessment_pack`, `design_page`, `learner_page_pack`) | Runtime rewrite (`app.js`) |
| Reduce **required-tier** duplication (runtime `forceAsk: true` semantics) | Research pack / tests / fixtures **S1–S13** |
| Demote or remove profile factors already resolved at workflow level | Renderer, workflow schema, Prompt Studio |
| Remove **`learner_level`** from page profile **required** tiers when essentials already set it | Remove **`mappingRules`** or Settings UI |
| Tighten **optional** tiers and opt-in prompts toward Settings | AI-generated adequacy or profile copy |
| Align profile questions with **run-blocking** step params only | LD `validationRules` / `conflictPolicies` (**19-4**) |
| Manual validation matrix (§8) | New adequacy predicates (**19-2b** / later) |
| Optional: pack-only regression tests for profile queue shape | Changing `askRefinementByDefault` or adequacy rules |

**Ready semantics:** Preserve **Ready** unless a step **truly cannot run** without a parameter that cannot be defaulted, inferred, or set in Settings.

---

## 5. Non-goals

- No **runtime rewrite** (including changing required-tier `forceAsk` or inferred suppression in `app.js`)
- No **Research** domain pack, tests, or golden fixture edits
- No **renderer** or **workflow schema** changes
- No removal of **Settings** `mappingRules` or step-parameter surfaces
- No **AI-generated** adequacy or profile questions
- No **validation / conflict** port (**Slice 19-4**)
- No re-enable of generic post-synthesis **`refinementFactors`** queue

---

## 6. Candidate profile changes

Current profiles live in `domains/learning-design/domain-learning-design-step-patterns.md` under `workflowBriefConfig.stepRefinementProfiles`.

| Profile | Current issue | Proposed change |
|---------|----------------|-----------------|
| **`assessment_pack`** | **Required** tier lists `assessment_type` and `assessment_total_items`; runtime **forceAsk** re-prompts even when brief inference already set them | **Demote** both to **optional** (or drop from profile if intent-class / defaults suffice); ask only when **unresolved** or `default` source — preserve run-blocking path via essentials + Settings |
| **`assessment_pack`** | Optional tier duplicates difficulty, coverage, feedback, mix — all **Settings-mappable** | Keep **short opt-in** only; trim optional factor list to factors that change **execution** if unset; defer fine tuning to Settings |
| **`design_page`** | **Required** `learner_level` **re-asks** after essentials / inference (`learner_level` is a workflow essential with inference rules) | **Remove** `learner_level` from profile **required** (and optional if redundant); rely on essentials + `mappingRules` → `stepParams.step_design_page.audience_level` |
| **`design_page`** | **Required** `page_profile` may duplicate brief defaults / adequacy notice `ld_page_profile_facilitator_mismatch` | Keep only if **unresolved** after synthesis; consider **optional** + adequacy for structural mismatch |
| **`learner_page_pack`** | Near-duplicate of `design_page` (same required/optional shape, overlapping goal triggers) | **Consolidate** applicability or **mirror** thinning; move tone/depth/examples/practice/compactness to **Settings**-first messaging in opt-in copy |
| **`learner_page_pack`** | Same `learner_level` re-ask as `design_page` | Same as `design_page` — remove `learner_level` from profile tiers |

**Profile precedence (unchanged):** `assessment_pack` wins when `Generate Assessment Items` is present; else `design_page` / `learner_page_pack` for `Design Page` workflows.

**Note:** `getAssessmentPostGenerationElicitationQueue` remains a **fallback** when no profile meta resolves; 19-3 should avoid widening that fallback while thinning profiles.

---

## 7. Proposed suppression logic (document-only — target behaviour)

Implementation should achieve this behaviour **via pack tiers** (and existing optional-tier runtime rules) unless a charter exception approves minimal runtime work.

### Do not ask profile questions when factor provenance is

| Source | Profile behaviour |
|--------|-------------------|
| **explicit** | Skip (already in runtime `userProvided`) |
| **elicited** | Skip (session / source map) |
| **inferred** | Skip on **optional** tier today; on **required** tier → **demote factor** or remove from profile (pack change) |
| **default** | Optional tier may still ask; required tier should not host factors that only exist as pack defaults |

### Tier policy (target)

- **`forceAsk` semantics** (required tier) should become **exceptional** — only factors that are **run-blocking** and cannot be satisfied by essentials, inference, or Settings defaults.
- **Optional** tier: keep for **high-value** opt-in refinement; prefer **“open Settings”** hints in `optionalOptInPrompt` over long factor lists.
- **Planning adequacy** handles **structural** “your plan doesn’t match your brief” — not duplicate in profile required tiers.

### Run-blocking test (pack author checklist)

Before keeping a factor in `tiers.required`, confirm:

1. Step execution fails or is unsafe without it **and**
2. Essentials + inference cannot set it **and**
3. Settings default is insufficient for a minimal viable run **and**
4. Adequacy does not already surface the gap structurally

---

## 8. Manual validation plan

**Environment:** XAMPP local; observation + simulation acceptable; API key not required for queue/trace review.

Record for each scenario: **remaining post-gen prompts**, **duplication removed**, **safe parameterisation**, **Settings as tuning home**.

| ID | Scenario | Brief / setup | Record |
|----|----------|---------------|--------|
| **M1** | Sparse **assessment** workflow | Assessment-oriented goal; minimal factors; `Generate Assessment Items` in plan | Post-gen queue IDs; whether `assessment_type` / count re-asked after inference; Settings hold difficulty/coverage |
| **M2** | **Page** workflow (`design_page`) | Learner-facing page goal; essentials supply `learner_level` | Confirm **no** `learner_level` profile prompt; `page_profile` only if truly unresolved |
| **M3** | **Learner page pack** workflow | Same as M2 but `learner_page_pack` applicability | Compare prompt count to M2; opt-in mentions Settings |
| **M4** | **Source-provided** workflow | Upload/source strategy; non-assessment plan | No assessment profile; no spurious assessment/page profile prompts |
| **M5** | **Adequacy + profile** overlap | Brief triggering `ld_page_profile_facilitator_mismatch` | Planning panel shows adequacy; profile does not repeat same factor interrogate |
| **M6** | **Ready** path | Complete essentials + synthesis | **Ready** still available; blocking only for true essentials gaps |

**Trace hooks:** `[PRISM][Trace][Queues]`, profile id in `resolveActivePostGenerationRefinementProfile`, Factory Planning panel + step Settings inspection.

---

## 9. Acceptance criteria

| Criterion | Measure |
|-----------|---------|
| **`learner_level` not re-asked** in page flows | M2/M3 — no profile question when essentials/inference set `learner_level` |
| **Inferred assessment factors not redundantly requested** | M1 — `assessment_type` / `assessment_total_items` not in required post-gen queue when inferred |
| **Ready still available** | M6 — non-blocking profile/adequacy; essentials-only blocking |
| **No runtime changes required** | `app.js` diff empty unless defect fix separately approved |
| **Research untouched** | No edits under Research pack, `workflow-research-*` tests, S1–S13 fixtures |
| **Tests green** | `node --test tests/*.test.js` — **108+** pass, 0 fail |
| **Settings remain primary for tuning** | M1–M3 — tone, depth, examples, assessment fine-tuning adjustable in step Settings |

---

## 10. Risks

| Risk | Mitigation |
|------|------------|
| **Over-thinning** removes genuinely needed prompts | Run-blocking checklist (§7); keep required tier minimal; manual M1–M6 |
| **Settings discoverability** insufficient after chat removal | Update opt-in copy to mention Settings; manual check step Settings panel |
| **Profile suppression too aggressive** for sparse briefs | Sparse-brief scenarios M1/M4; demote to optional rather than delete factors entirely |
| **Required-tier runtime** cannot suppress **inferred** without `app.js` | Documented in §2; use tier demotion, not runtime change, in 19-3 |
| **`design_page` vs `learner_page_pack` drift** | Apply parallel thinning; consider single applicability story in implementation plan |

---

## 11. Deferred beyond Slice 19-3

| Item | Notes |
|------|--------|
| LD **validation / conflict** system | **Slice 19-4** — Research-shaped `validationRules` / `conflictPolicies` |
| Richer **adequacy** predicates | `assessment_type_unspecified`, volume, page profile unspecified (19-2 deferred) |
| **AI review** integration | Out of Sprint 19 scope |
| **Schema / renderer** redesign | Separate programme |
| Runtime **inferred** suppression on required tier | Only if pack thinning insufficient — separate mini-charter |
| Generic **`refinementFactors`** queue policy | Frozen at 19-1 Option A unless product reverses |

---

## 12. Verification

```bash
node --test tests/*.test.js
```

| Milestone | Expected |
|-----------|----------|
| Charter commit | **108 passed**, 0 failed |
| After implementation | **108+** passed; add LD profile queue tests only if implementation plan requires |

**Research regression:** No Research files edited; existing Research adequacy and sparse-brief counts unchanged.

---

## 13. Implementation notes (for follow-on plan, not this charter)

1. Edit **`domains/learning-design/domain-learning-design-step-patterns.md`** only (unless defect in runtime).  
2. Prefer **tier moves** over new factors.  
3. Update **`optionalOptInPrompt`** strings to point users to **Settings** for tone/depth/examples/assessment mix.  
4. Re-run manual matrix M1–M6 and append results to sprint **review-log**.  
5. Closeout: `docs/consolidation/sprint-19-slice-3-closeout.md` + review-log entry.

---

## 14. References

| Document | Role |
|----------|------|
| [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) | Generic queue off; profiles primary |
| [`sprint-19-slice-2-closeout.md`](sprint-19-slice-2-closeout.md) | Adequacy + Settings recommendation |
| [`sprint-19-slice-2-charter.md`](sprint-19-slice-2-charter.md) | Deferred tuning adequacy rules |
| `docs/audits/ld-workflow-generation-rationalisation-audit.md` | Original profile duplication findings |

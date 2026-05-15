# Sprint 19 Slice 19-2 — LD Planning Adequacy Pilot

**Date:** 2026-05-15  
**Status:** **Closed** — see [`sprint-19-slice-2-closeout.md`](sprint-19-slice-2-closeout.md)  
**Sprint:** 19 — Learning Design Workflow Rationalisation  
**Slice:** 19-2

**Prior slice:** [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) — Option A (`askRefinementByDefault: false`) closed; generic **post-synthesis** `refinementFactors` queue disabled; **`stepRefinementProfiles`** unchanged.

**Context pack:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`  
**LD audit:** `docs/audits/ld-workflow-generation-rationalisation-audit.md`  
**Research reference:** `domains/research/domain-research-step-patterns.md` (`planningAdequacyChecks`, `disclosurePolicy`); Sprint 18 [`sprint-18-slice-1-charter.md`](sprint-18-slice-1-charter.md), [`sprint-18-slice-3c-charter.md`](sprint-18-slice-3c-charter.md)

**Verification baseline:**

```bash
node --test tests/*.test.js
```

**Expected:** **100 passed**, 0 failed (charter commit); same after implementation.

---

## 1. Purpose

Add **non-blocking** Learning Design **planning adequacy** notices after workflow synthesis, using the **existing Research adequacy interpreter** in `app.js` — no new evaluator.

Slice 19-1 reduced **generic post-synthesis `refinementFactors`** chat. Remaining LD “wizard” feel largely comes from **`stepRefinementProfiles`** (`forceAsk` duplication). Slice 19-2 introduces **assistive** Planning-panel guidance so users see **contextual fit signals** once the **step graph is visible**, without removing profiles or blocking **Ready**.

---

## 2. Architectural principle

| Layer | Role in Slice 19-2 |
|-------|-------------------|
| **Required essentials** | **Blocking** when missing — unchanged |
| **Workflow synthesis** | Produces the step graph — substrate for adequacy |
| **Planning adequacy** | **Assistive** — `planning_adequacy` disclosures **after** synthesis when essentials are complete |
| **Step Settings** | **Preferred** home for advanced tuning (`mappingRules` → `stepParams`) |
| **Profile post-gen** | **Still legitimate** for unresolved step parameters — **not removed** in 19-2 |

**Rule:** Runtime interprets policy; domain packs declare policy. LD activates adequacy **only** by defining `planningAdequacyChecks` (and matching `disclosurePolicy`) in the LD pack.

**Four concepts (unchanged from Sprint 18):** adequacy is **refinement opportunity**, not a new required factor and not proceedability.

---

## 3. Scope

| In scope (Slice 19-2) | Out of scope (Slice 19-2) |
|------------------------|---------------------------|
| Add `planningAdequacyChecks[]` to LD `workflowBriefConfig` | Runtime rewrite or new adequacy interpreter |
| Add LD `disclosurePolicy` entries for adequacy messages/actions (Research-shaped) | Remove or thin `stepRefinementProfiles` |
| Reuse `evaluateWorkflowBriefPlanningAdequacyChecks` | Research pack / test / fixture changes |
| Reuse `applyWorkflowBriefPlanningAdequacyAfterDesign` + existing Factory wiring | Renderer, schema, Prompt Studio merge |
| Planning panel surfacing (existing Slice 18 path) | AI-generated adequacy phrasing |
| Cap active adequacy rows at **3** per evaluation | LD `validationRules` / `conflictPolicies` |
| Deterministic pack-authored `messages` + `entries` only | Changing `askRefinementByDefault` (19-1 done) |
| LD golden fixtures **L1–L4** (or subset) + `workflow-ld-adequacy.test.js` | Generic `refinementFactors` queue re-enable |

**Recommended implementation size:** ship **3–4** adequacy rules in the pilot PR (not necessarily all five candidates below); preserve pack declaration order for cap behaviour.

---

## 4. Non-goals

- No runtime rewrite (`app.js` behaviour change only if a **blocking defect** in existing interpreter is found — otherwise frozen)  
- No new adequacy interpreter or new `when` predicates (unless separately chartered; default is **Sprint 18 3C-1 predicate set only**)  
- No `stepRefinementProfiles` removal, `forceAsk` changes, or `learner_level` de-duplication (**Slice 19-3**)  
- No Research domain pack, Research tests, or fixtures **S1–S13** edits  
- No renderer or workflow schema redesign  
- No Prompt Studio product merge  
- No AI-generated adequacy copy (RQ-P1: deterministic pack text)  
- No LD validation/conflict system (**Slice 19-4**)

---

## 5. Context from Slice 19-1 (inputs to this slice)

| Finding | Implication for 19-2 |
|---------|----------------------|
| `askRefinementByDefault` controls **post-synthesis** `getWorkflowRefinementQueue` only | Adequacy fills **assistive** gap left by disabled generic refinement queue |
| **`stepRefinementProfiles`** still drive most post-gen chat | Adequacy must **not duplicate** profile required questions; prefer gaps profiles do not cover |
| **Settings** already expose page/assessment tuning | Adequacy **nudges**; Settings remain authoritative for execution |
| Profile **`forceAsk`** may re-ask inferred factors | Known duplication — **19-3**, not 19-2 |

---

## 6. Proposed adequacy candidates

All messages must be **assistive**, **deterministic**, and **non-blocking** (`severity: recommendation`, category `planning_adequacy`). Each rule needs a matching `disclosurePolicy.messages` + `entries` key (LD pack does not yet define `disclosurePolicy` — add Research-shaped block in implementation).

| id | Trigger sketch (pack `when`) | Message intent |
|----|-------------------------------|----------------|
| `assessment_type_unspecified` | `Generate Assessment Items` (or equivalent canonical step) in plan **and** assessment workflow signals (e.g. `assessment_required` or brief mentions quiz/assessment) **and** `assessment_type` weak/default-only — express with **existing** predicates only; if not expressible without “factor absent”, defer rule or narrow to `resolvedFactorEquals` + known weak value | Suggest choosing an assessment type (MCQ, short answer, mixed, etc.) before running the step |
| `assessment_volume_unspecified` | Generate-assessment step present **and** `assessment_total_items` missing or only default-inferred | Suggest item count or accepting a default (e.g. 8–10) |
| `page_profile_unspecified` | `Design Page` in plan **and** `page_profile` not confidently set (learner vs facilitator) — use predicates available; avoid firing when profile post-gen will ask the same question in the same session | Suggest learner vs facilitator (tutor) page profile |
| `scope_step_mismatch` | `design_scope` = `session` (or `single_activity`) **and** `stepCountAtLeast` above threshold (e.g. ≥ 8) with sequence-heavy steps | Scope vs plan weight awareness — session brief but long chain |
| `generate_without_source` | `input_strategy` = `generate_from_topic` **and** brief mentions source/upload/PDF **and** plan includes `Normalize Content` or source-ingest steps (`briefFieldMentionAnyOf` + `stepsIncludeAny`, Research S8 pattern) | Source/generation mismatch — attach sources or confirm topic-only generation |

**Pilot recommendation (implement first):**

1. `generate_without_source` — reuses proven Research predicate pattern.  
2. `scope_step_mismatch` — `resolvedFactorEquals` + `stepCountAtLeast`.  
3. `page_profile_unspecified` — only if expressible without overlapping active `design_page` profile **forceAsk** (manual rubric in §8).  
4. One assessment rule (`assessment_type_unspecified` **or** `assessment_volume_unspecified`) — not both if cap of 3 would hide others.

**Deferred within 19-2** if not expressible with current `when` vocabulary: rules requiring “factor absent” / `resolvedSources` guards — document in implementation PR or spin **19-2b** predicate charter (out of default 19-2 scope).

---

## 7. Runtime integration notes (documentation only)

No new functions in Slice 19-2. LD pack policy drives existing paths:

| Function | Role |
|----------|------|
| `buildWorkflowRefinementContext` | Builds post-synthesis context (brief, resolved factors, design steps) |
| `evaluateWorkflowBriefPlanningAdequacyChecks(config, ctx)` | Evaluates LD `planningAdequacyChecks`; **max 3 rows** (`WORKFLOW_BRIEF_PLANNING_ADEQUACY_MAX_ROWS`) |
| `applyWorkflowBriefPlanningAdequacyAfterDesign` | Merges adequacy into `resolvedState` when design snapshot exists and essentials complete |
| `buildWorkflowBriefPlanningDisclosures` | Emits `planning_adequacy` rows to Planning panel |
| `continueWorkflowDesignGeneration` | Already calls adequacy apply after heuristics (Sprint 18) — **no change required** for LD beyond pack |

**Activation:** LD adequacy runs when **Learning Design** is the structured domain and `workflowBriefConfig.planningAdequacyChecks` is non-empty. **No** domain switch in `app.js`.

**Test API:** Reuse `__PRISM_TEST_API` exports from Sprint 18 (no new exports required unless a predicate gap is chartered).

---

## 8. Manual validation plan

Run in Workflow Factory with **Learning Design** selected. Prefer `npm run dev` + `.env.local` for full synthesis; record Planning panel + design log.

| ID | Scenario | Record |
|----|----------|--------|
| **19-2-V1** | **Sparse assessment brief** — e.g. formative assessment pack on cell structure | Adequacy row ids shown; ≤ 3 rows; **Ready** still reachable; profile post-gen may still run |
| **19-2-V2** | **Page workflow** — learner pages for postgraduate seminar | Page-related adequacy (if shipped); no block on Ready; compare with profile `learner_level` re-ask |
| **19-2-V3** | **Source-provided** — workshop from uploaded PDF; `provided_source_content` | No false `generate_without_source`; essentials OK |
| **19-2-V4** | **Intentionally underspecified** — broad topic, session scope, analysis-like chain if applicable | `scope_step_mismatch` or similar fires when applicable; still non-blocking |

**Per scenario log:**

- Adequacy row **ids** and message text (deterministic)  
- Whether **Ready** remains available without answering adequacy  
- Whether notices feel **contextual** once workflow steps are visible  
- Whether adequacy **duplicates** profile chat for the same factor (fail rubric if redundant)

**Research regression:** Run one Research S7-style brief — **no** new adequacy ids; S1–S13 tests unchanged.

---

## 9. Acceptance criteria

| Criterion | Required |
|-----------|----------|
| Charter approved before implementation | This document |
| Adequacy appears **only after synthesis** (post-heuristic design snapshot, essentials complete) | Yes |
| Max **3** `planning_adequacy` rows per evaluation | Yes |
| Wording from pack `disclosurePolicy` only | Yes |
| Does **not** block **Ready** or save/run | Yes |
| `stepRefinementProfiles` behaviour unchanged | Yes |
| Research pack/tests/fixtures **unchanged** | Yes |
| `node --test tests/*.test.js` → **100 passed** (existing) + new LD tests green | Yes |
| Manual **19-2-V1–V4** logged | Yes before closeout |

---

## 10. Risks

| Risk | Mitigation |
|------|------------|
| Adequacy **duplicates** profile required questions | Prefer rules profiles do not cover; manual rubric flags overlap; 19-3 removes profile duplication |
| **Triple signal** (adequacy + profile chat + Settings) for same knob | Short messages pointing to Settings; cap 3 rows; defer noisy rules |
| Users **ignore** adequacy entirely | Acceptable for pilot — assistive only; measure in 19-2 manual log |
| Rules not expressible without new predicates | Defer rule; do not expand runtime in default 19-2 |
| LD pack missing `disclosurePolicy` | Add full Research-shaped block in same PR as checks |

---

## 11. Deferred to Slice 19-3

- **`stepRefinementProfiles` thinning** — reduce required tiers  
- **`learner_level` de-duplication** — do not re-ask in page profile when essentials resolved  
- Reduce **`forceAsk`** duplication for inferred factors  
- Convert profile required tiers → adequacy notices and/or Settings defaults where safe  

Slice 19-2 **must not** remove profiles or change profile queues.

---

## 12. Deferred to Slice 19-4

- Port Research-style **`validationRules`** / **`conflictPolicies`** to LD where evidence supports  
- LD sparse safety fixtures (parallel to Research S1–S6)  

Out of scope for adequacy pilot.

---

## 13. Files expected to change (implementation PR — not this charter)

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | `disclosurePolicy` (messages, categories, entries) + `planningAdequacyChecks` (3–4 rules) |
| `tests/workflow-ld-adequacy.test.js` | **New** — evaluator + post-design disclosure tests |
| `tests/fixtures/workflow-brief-ld-adequacy/L1`–`L4.json` | **New** — golden briefs aligned to §8 scenarios |

**Frozen:**

| Path |
|------|
| `app.js` (unless defect fix chartered) |
| `domains/research/domain-research-step-patterns.md` |
| `tests/workflow-research-*.test.js` |
| `tests/fixtures/workflow-brief-research-sparse/S1`–`S13.json` |

---

## 14. Verification

```bash
node --test tests/*.test.js
```

| Milestone | Expected |
|-----------|----------|
| Charter commit (this doc only) | **100 passed**, 0 failed |
| After implementation | **100+ passed** (new LD tests added), Research count unchanged, 0 failed |

---

## 15. References

| Document | Role |
|----------|------|
| [`sprint-19-slice-1-closeout.md`](sprint-19-slice-1-closeout.md) | 19-1 findings |
| [`sprint-19-slice-1-charter.md`](sprint-19-slice-1-charter.md) | Post-synthesis queue semantics |
| [`contextual-refinement-architecture-note.md`](contextual-refinement-architecture-note.md) | Four-layer model |
| `domains/research/domain-research-step-patterns.md` | Reference pack shape |

---

## Charter approval

| Field | Value |
|-------|--------|
| **Slice** | 19-2 |
| **Implementation authorised** | **No** — charter only until explicit approval |
| **Target** | 3–4 LD `planningAdequacyChecks` + disclosures + LD fixtures/tests |

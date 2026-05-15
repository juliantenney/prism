# Sprint 19 review log — Learning Design Workflow Rationalisation

**Pack path:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`  
**Date:** 2026-05-15

---

## 2026-05-15 — Bootstrap session

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R19-001 | Sprint 19 is **audit-first**; no LD code in bootstrap | Reduces risk; Research remains reference at 100 tests |
| R19-002 | Keep **five** LD `requiredFactors` unchanged | Already minimal contract; expanding recreates wizard |
| R19-003 | Classify most `refinementFactors` → **future planning_adequacy** | Aligns with Sprint 18 Research model |
| R19-004 | Page tuning factors → **Settings** primary channel | `mappingRules` already maps to `stepParams` |
| R19-005 | `stepRefinementProfiles` → **remove/defer** after Slice 19-2 | Avoid removing blocking post-gen without replacement |
| R19-006 | `askRefinementByDefault: true` → **charter pilot off** in Slice 19-1 | Fastest lever to reduce pre-design wizard |
| R19-007 | Reuse Research adequacy **interpreter** for LD Slice 19-2 | Runtime interprets policy; no second evaluator |
| R19-008 | `callOpenAIForWorkflowReview` stays **separate** from adequacy | Different trust model and UX |
| R19-009 | Research pack/tests **frozen** for Sprint 19 programme | Regression anchor S1–S13 |
| R19-010 | Cap LD adequacy at **3** rows when implemented | Matches Research `evaluateWorkflowBriefPlanningAdequacyChecks` cap |

### Artefacts created

- `docs/audits/ld-workflow-generation-rationalisation-audit.md` (9 questions + master classification)
- Sprint 19 portable pack (7 files in this folder)

### Verification

```bash
node --test tests/*.test.js
```

**Result:** 100 passed, 0 failed (docs-only bootstrap; confirm on merge).

### Open questions (for Slice 19-1 charter)

1. Pilot `askRefinementByDefault: false` globally vs domain-flag only?  
2. Which 3–5 LD adequacy rules ship first in 19-2?  
3. Is LD `validationRules` port (19-4) required before production LD rollout?

---

## 2026-05-15 — Slice 19-1 closed (Option A)

| Record | Value |
|--------|--------|
| Implementation | LD pack `askRefinementByDefault: false` only |
| Tests | **100 passed**, 0 failed |
| Research | **No changes** |
| Manual validation | M1–M4 logged — see [`docs/consolidation/sprint-19-slice-1-closeout.md`](../../../consolidation/sprint-19-slice-1-closeout.md) |
| Interpretation correction | Option A disables **generic post-synthesis** `refinementFactors` queue (`getWorkflowRefinementQueue` after synthesis), **not** a pre-design queue; essentials + `stepRefinementProfiles` unchanged |
| Defects | **None** immediate; profile `forceAsk` duplication deferred to 19-3 |

**Closeout:** [`docs/consolidation/sprint-19-slice-1-closeout.md`](../../../consolidation/sprint-19-slice-1-closeout.md)

---

## 2026-05-15 — Slice 19-2 closed (LD Planning Adequacy Pilot)

| Record | Value |
|--------|--------|
| Implementation | LD `disclosurePolicy` + 4 `planningAdequacyChecks` (structural rules only) |
| Rules shipped | `ld_generate_without_source`, `ld_scope_step_mismatch`, `ld_assessment_generate_step_missing`, `ld_page_profile_facilitator_mismatch` |
| Deferred | `assessment_type_unspecified`, `assessment_volume_unspecified`, `page_profile_unspecified` (no absent-factor predicates) |
| `app.js` | **Not changed** — reuses Research adequacy interpreter |
| Research | Pack, tests, fixtures **S1–S13 untouched** |
| Tests | **108 passed**, 0 failed (+8 `workflow-ld-adequacy.test.js`) |
| Notes | Fixture `modelSteps` = post-synthesis snapshot (heuristics do not mask rules in tests); cap **3** → pack order matters |
| Profiles | **Unchanged** — thinning deferred to 19-3 |

**Closeout:** [`docs/consolidation/sprint-19-slice-2-closeout.md`](../../../consolidation/sprint-19-slice-2-closeout.md)

---

## 2026-05-15 — Slice 19-3 closed (LD Profile Thinning)

| Record | Value |
|--------|--------|
| Implementation | LD `stepRefinementProfiles` tier thinning only (pack-only) |
| Required tiers | All three profiles → **`[]`** (was: assessment type/count; page profile + learner_level) |
| Optional | `assessment_type`, `assessment_total_items`, `page_profile` demoted; `learner_level` removed from profiles |
| `app.js` | **Not changed** |
| Adequacy | **Unchanged** (19-2 rules + interpreter) |
| Research | **S1–S13 untouched** |
| Tests | **118 passed**, 0 failed (+10 `workflow-ld-profile-thinning.test.js`) |
| Defects | **None blocking**; assessment fallback unchanged |
| Manual validation | **Pending** — M1–M4 with `npm run dev` + `.env.local` |

**Closeout:** [`docs/consolidation/sprint-19-slice-3-closeout.md`](../../../consolidation/sprint-19-slice-3-closeout.md)

---

## Status

**Sprint 19 active** — Slices **19-1**, **19-2**, and **19-3** **closed**; manual Factory validation M1–M4 recommended; next: **Slice 19-4** charter (LD validation/conflict port) if evidence supports.

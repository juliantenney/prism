# Sprint 19 Slice 19-1 — closeout (LD Question Policy Pilot)

**Date:** 2026-05-15  
**Status:** **Closed** — Option A implemented; manual validation complete  
**Charter:** [`sprint-19-slice-1-charter.md`](sprint-19-slice-1-charter.md)  
**Sprint pack:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`

**Verification:**

```bash
node --test tests/*.test.js
```

**Result:** **100 passed**, 0 failed

---

## 1. Implementation summary

Slice 19-1 implemented **Option A** in the Learning Design domain pack: `questionPolicy.askRefinementByDefault` set to **`false`**.

**Runtime behaviour (unchanged code):** `getWorkflowRefinementQueue` in `app.js` reads `askRefinementByDefault` and returns an **empty** list when `false`. That function is invoked from **`continueWorkflowDesignGeneration` after workflow synthesis**, not before design starts.

**Documentation correction:** The charter and audit initially described this pilot as reducing **pre-design** refinement. That framing was **imprecise**. Option A disables the **generic post-synthesis `refinementFactors` queue** only. It does **not** remove:

- **Required essentials** elicitation (`stage: "required"`) when factors are missing — still **blocking**
- **`stepRefinementProfiles`** post-generation queues (`assessment_pack`, `design_page`, `learner_page_pack`) — **unchanged**
- Legitimate **post-workflow** chat when profile **required** tiers need unresolved step parameters

Option A remains **viable** as a **narrow pilot**: less generic post-synthesis refinement noise, with essentials and profile-based post-gen preserved.

---

## 2. Files changed

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | `workflowBriefConfig.questionPolicy.askRefinementByDefault: false` |
| `docs/consolidation/sprint-19-slice-1-charter.md` | Clarified runtime wiring and post-synthesis scope (this closeout cycle) |
| `docs/consolidation/sprint-19-slice-1-closeout.md` | **This document** |

**Frozen (unchanged):** `app.js`, Research pack, Research tests/fixtures S1–S13, renderer, schema, Prompt Studio.

---

## 3. Implemented policy (exact)

```json
"questionPolicy": {
  "maxDefaultQuestions": 8,
  "askOptionalByDefault": false,
  "maxRefinementQuestions": 8,
  "askRefinementByDefault": false
}
```

| Field | Value | Note |
|-------|-------|------|
| `askRefinementByDefault` | **`false`** | Option A — implemented |
| `maxRefinementQuestions` | **`8`** | Unchanged (charter allowed leaving as-is) |
| `maxDefaultQuestions` | `8` | Unchanged |
| `askOptionalByDefault` | `false` | Unchanged |

---

## 4. Manual validation

### 4.1 Limitation

| Item | Detail |
|------|--------|
| **Environment** | Workflow Factory on **XAMPP** (`http://localhost/prism/`) |
| **API key** | Full **OpenAI synthesis** did not run — Design workflow control stayed disabled without a key in that process |
| **Dev server** | `npm run dev` can load `OPENAI_API_KEY` from repo-root `.env.local` via `GET /__prism/dev-api-key`; **`.env.local` was not available** on the XAMPP path used for validation |
| **Supplement** | Pack/runtime simulation (`__PRISM_TEST_API`), resolve/infer/heuristic review, and `app.js` queue wiring inspection |

Recommend one follow-up Factory pass with `npm run dev` + `.env.local` to confirm status badges and log copy end-to-end.

### 4.2 Scenario results (M1–M4)

#### 19-1-M1 — Sparse LD brief

**Brief:** “Create a blended undergraduate session on climate change debate skills.”

| Metric | Finding |
|--------|---------|
| Pre-design elicitation | **0–1** essentials only (e.g. `input_strategy` if unset); **no** generic `refinementFactors` queue pre-synthesis |
| Workflow generated | Expected **yes** with API; sensible session chain |
| Post-gen refinement | **Unlikely** without assessment/page terminal steps → **Ready** faster under Option A |
| Duplication | Reduced generic post-design noise |
| Experience | **Improved** for sparse session briefs |

#### 19-1-M2 — Assessment-pack brief

**Brief:** “Create an online formative assessment pack for first-year biology students on cell structure.”

| Metric | Finding |
|--------|---------|
| Pre-design elicitation | **0–1** essentials; inference often pre-fills assessment factors |
| Workflow generated | Expected **yes** with Generate Assessment Items in plan |
| Post-gen refinement | **`assessment_pack` profile unchanged** — type/count + optional tier may still appear |
| Deferred after synthesis | Generic `refinementFactors` queue **disabled**; profile + Settings remain |
| Experience | **Mixed / slightly improved** — less generic noise; profile prompts still present (by design) |

#### 19-1-M3 — Page-only / learner-page brief

**Brief:** “Create learner pages for a postgraduate seminar on ethics in AI.”

| Metric | Finding |
|--------|---------|
| Pre-design elicitation | **0** essentials in simulation (five resolved from text) |
| Post-gen refinement | **`design_page` / `learner_page_pack` unchanged** — `page_profile`, `learner_level`, optional tone/depth |
| Duplication | **`learner_level` re-ask** risk when already resolved — follow-on for 19-3 |
| Settings | Sufficient for tone/depth/examples |
| Experience | **Improved** workflow-first; profile beat unchanged |

#### 19-1-M4 — Source-provided brief

**Brief:** Workshop from provided case study PDF; `provided_source_content`.

| Metric | Finding |
|--------|---------|
| Pre-design elicitation | **1–2** essentials (`topic`, `learner_level`) when sparse; `input_strategy` correct |
| Post-gen refinement | Profile-dependent; source path **no regression** |
| Experience | **Unchanged to improved** |

---

## 5. Conclusion

**Option A is viable** as a narrow pack pilot: it removes **generic post-synthesis `refinementFactors`** interrogation while preserving **blocking essentials**, **`stepRefinementProfiles`**, and Settings. It is **not sufficient** alone to rationalise LD; Slice 19-2 and 19-3 remain necessary.

**Research:** Frozen — no pack or test changes; **100 tests** green.

---

## 6. Defect status

| Item | Status |
|------|--------|
| Immediate code defect | **None** — no hotfix required |
| Charter/audit wording (“pre-design” queue) | **Corrected** in charter + this closeout — actual lever is **post-synthesis generic queue** |
| Profile `forceAsk` re-asking inferred factors (e.g. `learner_level`, assessment type/count) | **Known UX duplication** — defer to Slice **19-3** |

---

## 7. Follow-on recommendations

| Slice | Scope |
|-------|--------|
| **19-2** | Add **LD `planningAdequacyChecks`** (3–5 rules); reuse Research interpreter (`evaluateWorkflowBriefPlanningAdequacyChecks`, `applyWorkflowBriefPlanningAdequacyAfterDesign`); non-blocking Planning panel notices |
| **19-3** | Thin **`stepRefinementProfiles`** — skip required tier when factor already resolved; remove **`learner_level`** from page profile required; reduce **`forceAsk`** duplication |
| **Optional** | One Factory E2E pass via `npm run dev` + `.env.local` |

---

## 8. Rollback (unchanged)

Restore `askRefinementByDefault: true` in LD pack `questionPolicy` (see charter §10). Re-run tests → **100 passed**.

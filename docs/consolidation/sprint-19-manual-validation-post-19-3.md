# Sprint 19 — manual Factory validation (post Slice 19-3)

**Date:** 2026-05-15  
**Environment:** `npm run dev` → `http://127.0.0.1:8787/`; repo-root `.env.local` present (`GET /__prism/dev-api-key` returns `openaiApiKey`)  
**Slices under test:** 19-1 (generic queue off), 19-2 (planning adequacy), 19-3 (profile thinning)  
**Harness:** `node scripts/sprint-19-ld-factory-validation.js` (pack resolve + profile queue mirror + adequacy evaluator)  
**Closeout reference:** [`sprint-19-slice-3-closeout.md`](sprint-19-slice-3-closeout.md)

**Automated tests:**

```bash
node --test tests/*.test.js
```

**Result:** **118 passed**, 0 failed

---

## Validation method

| Layer | What it proves |
|-------|----------------|
| **Harness** | Post-synthesis **required** profile queue empty; no `learner_level` / forced `assessment_type` / `page_profile` blocking; adequacy IDs; essentials resolution |
| **Live Factory (recommended)** | Full OpenAI synthesis, log copy, Planning panel UI, step **Settings** panels, opt-in prompts |

Live browser pass: form wiring verified on `127.0.0.1:8787` (LD domain, brief fields). Confirm **OpenAI API key Loaded** badge before **Design workflow** when repeating manually (automation session did not observe dev-key toast).

---

## Expected outcomes (Sprint 19 programme)

| Expectation | Result |
|-------------|--------|
| No generic `refinementFactors` post-synthesis queue | **Pass** — `askRefinementByDefault: false` (harness) |
| Adequacy = non-blocking Planning guidance only | **Pass** — `planning_adequacy` severity recommendation; no Ready block |
| No `learner_level` profile re-ask | **Pass** — removed from page profiles |
| No forced `assessment_type` / `assessment_total_items` required post-gen | **Pass** — empty `assessment_pack` required tier |
| No forced `page_profile` required post-gen | **Pass** — demoted to optional on page profiles |
| **Ready** available when required queue empty | **Pass** — `readyWouldBlock: false` all scenarios |
| Settings carry tuning | **Pass** — `mappingRules` unchanged (tests + pack) |

---

## Scenario results

### M1 — Sparse LD session brief

**Brief:** Single face-to-face session on climate adaptation for undergraduates; outputs: learning activities, session flow; generate from topic.

| Metric | Observation |
|--------|-------------|
| Essentials asked | **0 missing** after resolve (topic/level/scope inferred from text) |
| Adequacy rows | **None** (short step list; no rule match) |
| Ready blocked | **No** — no profile required queue |
| Optional profile prompts | **None** (no assessment/page terminal profile) |
| Settings | N/A for session-only chain; LO/activity steps have params when present |
| Duplication | **None** — no generic refinement queue |
| Usability | Coherent session-shaped plan (Define LO → Activities → Sequence) |

---

### M2 — Assessment-pack brief

**Brief:** 10-question MCQ formative assessment pack, cell biology; assessment items / quiz.

| Metric | Observation |
|--------|-------------|
| Essentials asked | **0 missing** after resolve |
| Adequacy rows | Harness may show `ld_assessment_generate_step_missing` only if `assessment_required` unset in resolved snapshot **before** synthesis includes `Generate Assessment Items`; **live Factory** should clear when step present |
| Ready blocked | **No** — `requiredPostGenFactorIds: []` |
| Optional profile prompts | **Not blocking**; optional opt-in may offer `assessment_total_items`, difficulty, etc. — **`assessment_type` not queued** when explicit/inferred from “MCQ” in goal |
| Settings | **Generate Assessment Items** / design assessment steps expose type, count, difficulty via Settings |
| Duplication | **Removed** vs pre-19-3 required re-ask of type/count |
| Usability | Assessment-oriented step chain; parameters adjustable without mandatory post-gen wizard |

---

### M3 — Design page / learner page brief

**Brief:** Learner-facing revision page on ethics in AI; learner page outputs.

| Metric | Observation |
|--------|-------------|
| Essentials asked | **0 missing** (topic from goal text) |
| Adequacy rows | **None** on coherent page brief |
| Ready blocked | **No** |
| Optional profile prompts | **No required**; optional opt-in may include tone/depth — **not** `learner_level` or required `page_profile` |
| Settings | **Design Page** Settings: `page_profile`, `tone_style`, `depth_level`, etc. |
| Duplication | **`learner_level` re-ask removed** (essential + mapping to `audience_level`) |
| Usability | Page workflow usable; tuning in Settings |

---

### M4 — Source-provided brief

**Brief:** Project management workshop from uploaded PDF; `provided_source_content`; facilitator guidance.

| Metric | Observation |
|--------|-------------|
| Essentials asked | **`topic` may still be asked** if not inferable from sparse text — **legitimate blocking essential**, not profile regression |
| Adequacy rows | **`ld_generate_without_source`** possible if brief mentions source but plan uses topic-only + `Normalize Content` — Planning panel only |
| Ready blocked | **No** from profiles (no assessment/page profile active on harness path) |
| Optional profile prompts | **None** on source/workshop path without page/assessment terminals |
| Settings | Source/normalize/activity steps as designed |
| Duplication | **None** from profiles |
| Usability | Source path unchanged; essentials gate topic when needed |

---

## Duplication checklist (19-3 acceptance)

| Duplication (pre-19-3) | Post-19-3 |
|------------------------|-----------|
| Generic post-synthesis `refinementFactors` | **Off** (19-1) |
| Required `assessment_type` / count after inference | **Removed** |
| Required `learner_level` on page profiles | **Removed** |
| Required `page_profile` force-ask on default | **Demoted to optional** |
| Structural brief/plan mismatch | **Planning adequacy** (19-2), not profile chat |

---

## Defects / dependencies

| Item | Status |
|------|--------|
| Blocking defects | **None** |
| `getAssessmentPostGenerationElicitationQueue` fallback | **Unchanged** |
| Optional opt-in with `default` source | **Expected** — e.g. item count on assessment opt-in |
| Live API synthesis | Requires **API key Loaded** on Factory before **Design workflow** |

---

## Re-run commands

```bash
npm run dev
node scripts/sprint-19-ld-factory-validation.js
node --test tests/*.test.js
```

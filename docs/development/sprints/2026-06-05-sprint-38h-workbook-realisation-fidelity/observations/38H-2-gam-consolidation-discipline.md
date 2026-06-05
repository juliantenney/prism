# Slice 38H-2 — GAM Consolidation Discipline

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Pack-only implementation (§6 GAM)  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38H-2  
**Inputs:** [38H-1](38H-1-workbook-realisation-fidelity-analysis.md) · [38G-5](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-5-acm-realisation-trace.md) · [38G-6](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-6-sprint-closure-and-retrospective.md)  
**Target:** H-01 — GAM anti-spoiler `consolidation_summary`

---

## 1. Root cause recap

[38H-1](38H-1-workbook-realisation-fidelity-analysis.md) traced `EV-38G-AFTER` A4:

| Stage | Behaviour |
|-------|-----------|
| **DLA** | `learner_task` requires learner-written synthesis + strategy reflection; `required_materials` purpose: *"template and guidance"* |
| **GAM** | Authors **completed** past-tense session essay (`"you have learned…"`) with named strategies |
| **Design Page** | Copies GAM **verbatim** — no compose loss |

**Root cause:** GAM genre mis-realisation. **GAM-WB-06** mandated ≥80 words and ≥3 key ideas but **F1–F6** did not forbid model-answer consolidation when learner production is required. **F2** only blocked prompt_set-only closure.

---

## 2. Exact clauses modified

**File:** `domains/learning-design/domain-learning-design-step-patterns.md` — **§6 Generate Activity Materials** only.

| Clause | Change |
|--------|--------|
| **Material-type guidance** (`consolidation_summary` genre line) | Scaffold-only when learner-production required; forbid model essays / past-tense session summaries / pre-written synthesis |
| **GAM-WB-06** | Extended with 38H-2; requires reading `learner_task` / `expected_output`; references GAM-WB-06b; F1 cross-reference |
| **GAM-WB-06b** (new) | 38H-2 mandatory row — scaffold patterns, forbidden patterns, F7 fail, learner-production exception path |
| **F1** | ≥80 words as scaffold prompts when learner-production required (not closure body only) |
| **F7** (new) | Model essay / completed response when learner-write required = FAIL |
| **GAM-WB-21** | Reflection on learner-write closure — scaffold per GAM-WB-06b |
| **AP-05** (new) | Spoiler consolidation anti-pattern |
| **Anti-patterns footer** | F1–F4 → F1–F7 |
| **`defaultPromptNotes`** | F1–F7; 38H-2; GAM-WB-06b; AP-05 |

**Not modified:** §5 DLA · §13 Design Page · `app.js` · `lib/*` · schemas · harnesses · ACM.

**Tests:** `tests/workbook-contract-prompt-surface.test.js` — new `38H-2` test; `defaultPromptNotes` F1–F7 assertion.

---

## 3. Before / after behaviour examples

### 3.1 Before (EV-38G-AFTER A4 — spoiler)

```text
### Consolidation Summary: Managing Inflation Effects on Personal Budgets

In this session, you have learned that inflation is a general rise in prices…
You also reflected on strategies… such as budgeting carefully, seeking income
adjustments, and controlling expenses.
```

**Problem:** Directly fulfils learner-write task; undermines practice (GQ-10).

### 3.2 After (expected on EV-38H-AFTER)

```text
### Consolidation Framework: Your Session Summary

Before you finish, write at least 80 words in your own voice.

**What to remember** — Can you name at least three ideas from this session
about inflation, CPI, and household impacts? (Do not copy this list; use your
own words.)

**What changed in your thinking** — How has your view of inflation measurement
or household budgets shifted?

**How to apply** — Identify at least two strategies you could use to manage
inflation on your personal budget. For each, note one advantage and one risk.

**Self-check** — Review your draft: Does it move beyond description to
evaluation? Does it connect CPI analysis to your own context?
```

**Acceptable patterns:** reflection prompts, self-check, comparison against criteria, sentence starters, completion frameworks, checklist-style review, transfer cues.

### 3.3 Forbidden (F7 / AP-05)

- Past-tense `"you have learned"` / `"In this session I learned"` session essays  
- Pre-written strategy lists answering the learner task  
- Model essays that satisfy `expected_output` on the learner's behalf  

### 3.4 When learner-production is NOT required

Informational consolidation bodies may remain — no change to non-learner-write closure paths.

---

## 4. Traceability to H-01

| 38H-1 finding | 38H-2 response |
|---------------|----------------|
| GAM primary owner | GAM-WB-06b + F7 + AP-05 in §6 only |
| GAM-WB-06 word count incentivised essays | Reframed: ≥80 words of **scaffold prompts**, not model answer |
| F1–F6 gap | **F7** explicit fail for spoiler consolidation |
| GAM-WB-21 reflection component | Extended — scaffold reflection, not supply answer |
| Design Page not implicated | **No §13 change** (correct per 38H-1) |
| Acceptance: no past-tense spoiler on rerun | Validated in 38H-5 (planned) |

---

## 5. Hold-condition verification

| Hold | Check | Result |
|------|-------|--------|
| V-01 table family | No §5/§6 table row changes | **PASS** |
| V-05 scenario Material | GAM-WB-10 untouched | **PASS** |
| 38E-8/9 mandatory types | `consolidation_summary` still required; GAM-WB-02/06 present | **PASS** — tests green |
| 38G-3 GAM-WB-21 | Extended, not removed | **PASS** |
| DLA-WB-20/21 | §5 untouched | **PASS** |
| Preservation V-13 | `ld-table-fidelity.js`, `ld-materials-copy.js`, `ld-design-page-compose-contract.js` unchanged | **PASS** |
| `app.js` / renderer | Not touched | **PASS** |
| Schema | Not touched | **PASS** |

**Test run:** `node --test tests/workbook-contract-prompt-surface.test.js` — **13/13 PASS** (was 12/12 + 38H-2).

---

## 6. Risks

| Risk | Mitigation |
|------|------------|
| Model still authors spoiler despite prompt | 38H-5 `EV-38H-AFTER` trace; iterate clause wording only if needed |
| Scaffold too thin (<80 words) | GAM-WB-06b retains ≥80-word scaffold requirement |
| Scaffold too close to answer key | Forbidden list + self-check framing; monitor on anchor |
| Conflict with worked_example/sample_output genres | Changes isolated to `consolidation_summary` only |
| KM-not-in-harness masks DLA exploitation | Separate track — 38H-4 |

---

## 7. Recommended validation approach

### 7.1 Immediate (this slice)

- [x] Prompt-surface tests — 13/13 PASS  
- [x] No `lib/` or `app.js` diff  
- [x] §5 DLA byte-stable for workbook rows  

### 7.2 On 38H-5 (`EV-38H-AFTER`)

1. Re-run inflation capture with **current pack** (post-38H-2; pre/post 38H-3 table fix optional).  
2. Inspect A4 `consolidation_summary` in GAM + page:  
   - **FAIL** if past-tense completed essay or pre-stated strategies  
   - **PASS** if scaffold-only; learner_task still requires write  
3. Compare to `EV-38G-AFTER` A4 — spoiler pattern must **not** recur.  
4. Confirm no regression: 4 activities, worked_example, sample_output, tables, scenario, checklist, prompt_sets.  

### 7.3 Out of scope for 38H-2 validation

- Design Page table adjunct (38H-3)  
- KM harness (38H-4)  
- Evaluate-activity arc (H-04 deferred)  

---

## 8. Success criterion

| Criterion | Status |
|-----------|--------|
| Pack encodes learner-task-aware consolidation discipline | **DONE** |
| No schema / app / renderer / DLA / Design Page / harness changes | **DONE** |
| Hold tests green | **DONE** (13/13) |
| Future rerun produces scaffold-not-essay consolidation | **Pending** — 38H-5 |

**Slice 38H-2:** **COMPLETE**  
**Next:** **38H-3** (H-02 table adjunct) and/or **38H-4** (H-03 harness) — may parallel

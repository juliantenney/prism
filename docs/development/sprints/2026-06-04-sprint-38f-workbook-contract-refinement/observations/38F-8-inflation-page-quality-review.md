# Slice 38F-8 — Inflation page quality review

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Type:** **Analysis only** — no pack/code/tests · no pipeline run · **do not charter 38-G yet**  
**Authority:** [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) · [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38F-7](38F-7-retrieval-definition-and-page-review-setup.md)  
**Artefacts:** [EV-38F-AFTER-design-page.json](../artefacts/EV-38F-AFTER-design-page.json) · [EV-38F-AFTER-render-excerpt.html](../artefacts/EV-38F-AFTER-render-excerpt.html) · [EV-38F-AFTER-gam.txt](../artefacts/EV-38F-AFTER-gam.txt)  
**Comparator:** [EV-38E10-AFTER-design-page.json](../../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E10-AFTER-design-page.json)  
**Prior calibration:** [38F-6](38F-6-retrieval-validation-calibration.md) · [38F-7](38F-7-retrieval-definition-and-page-review-setup.md)

---

## 1. Purpose

Review **`EV-38F-AFTER`** as a **learner-facing self-study workbook** (pedagogy, guidance, workload, coherence) — not only as a contract-validation artefact.

Close the **38-F programme narrative** by separating:

- **Structural contract success** (V-01, V-05, 38E-8/9, preservation)  
- **Professional workbook quality** (first-glance and activity-level)

---

## 2. Inputs and authority

| Input | Role |
|-------|------|
| [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | R1–R7 function rubric; workbook vs activity-sheet genre |
| [38F-7 §7](38F-7-retrieval-definition-and-page-review-setup.md) | Review checklist and function-first R3 |
| [38F-4](38F-4-inflation-after-scorecard.md) | Contract scorecard baseline |
| User manual review notes | Integrated in §5–§6 (mapped to frozen artefact) |

**Artefact fact:** `EV-38F-AFTER` has **3** learning activities (55 min labelled). Comparator **38E10** has **4** activities (60 min). User notes referencing “Activity 4” align with **38E10’s** strategy-evaluation activity, which **38F omits** — mapping in §5.

---

## 3. First-glance verdict

| Lens | Verdict |
|------|---------|
| **Professional self-study workbook (first glance)** | **FAIL** |
| **Contract structure (V-01/V-05/types)** | **PASS** on scored rules |
| **Preservation** | **PASS** |
| **Genre ([38C-1 §2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md))** | **Hybrid** — teaching + worked example present, but rhythm is **read → worksheet → model answer closure**; weak verify-before-continue; feels **assembled** not **coached** |

**One-line:** The page delivers required **material types** but not a **credible 55–60 minute coached solo session** — thin “what to do” text, inflated timings on shallow practice, missing explicit teaching preamble and mid-session strategy work, consolidation **spoiled** by pre-written model summary.

---

## 4. Whole-page review

### 4.1 Investigation matrix (page-level)

| # | Question | Finding |
|---|----------|---------|
| 1 | **Teach enough vs assume prior knowledge?** | **Partial teaching only.** A1 exposition + worked example are adequate for CPI/inflation **intro**, but brief assumes learner can analyse households and “evaluate strategies” in outcomes **without** a dedicated strategy-teaching or evaluation activity (dropped vs 38E10). |
| 2 | **Teaching preamble before acting?** | **Weak.** No `activity_preamble` on any 38F activity (38E10 had preambles on all four). Only generic Welcome / Study Tips. |
| 3 | **“What to do” clear and complete?** | **No.** Tasks are **terse bullet lists**; A1 references questions **not authored**; A2 gives steps but not calculation method per cell; A3 says “write summary” while material is a **full model essay**. |
| 4 | **Worked examples substantive?** | **Yes for A1** — 4 steps, formula, numeric worked CPI example. **Adequate** not exceptional. |
| 5 | **Scenarios rich enough?** | **No.** Two parallel bullet households + category % shocks; **no narrative**, constraints, or decision hooks; identical inflation pattern both cases; **label-like** not case-study quality. |
| 6 | **Calculation workload appropriate?** | **Under-scaffolded, over-labelled.** A2 is **twelve** trivial “budget × inflation%” cells with **no** worked partial row, formula reminder, or sanity check — **~8–12 min** mechanical work vs **20 min** label. |
| 7 | **Timings credible?** | **No.** Sum **55 min**; realistic attentive completion **~35–45 min** unless learner writes extensively from thin prompts; several labels **2×** actual effort. |
| 8 | **Guidance to complete each activity?** | **Insufficient.** Missing checklists, support_note, reasoning_orientation, step-by-step decision sequence (present on 38E10 A2–A3). |
| 9 | **Commentary/coaching between tasks?** | **Minimal.** Study Tips generic; **no** “before you continue” beats; no bridge from CPI lesson to household table. |
| 10 | **Professional workbook vs worksheet parts?** | **Worksheet assembly** — strong blocks (worked example, table) with **thin connective tissue**. |
| 11 | **Retrieval: types vs verification beats?** | **Verification beats missing** ([38F-7](38F-7-retrieval-definition-and-page-review-setup.md)). Not primarily “wrong material type” on frozen page — **tasks lack explicit self-check**; 38E10 checklist/cards removed in 38F compression. |
| 12 | **Layer blame?** | **Primary: DLA activity design + GAM density**; **secondary: Design Page** dropping rhetorical fields; **not renderer** for core failures. |

### 4.2 Front matter (sections 1–3)

| Section | Strength | Weakness |
|---------|----------|----------|
| **Welcome** | Clear topic promise | Marketing tone; no time budget, path map, or “how to use this workbook” |
| **Learning Purpose / Outcomes** | Four aligned LOs | Outcome 4 (evaluate strategies) **not practised** in an activity on 38F |
| **Study Tips** | Mentions table + reflection | No misconceptions, no self-check habit, no pacing table |

### 4.3 [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) function scores (page review)

| Function | Score | Rationale |
|----------|-------|-----------|
| **R1** Teaching | **Present** | A1 explanatory_text + worked example |
| **R2** Guided practice | **Present** | A2 scenario + empty analysis_table |
| **R3** Retrieval | **Absent** | No ≥2 verification episodes; no checklist/cards; A1 questions absent |
| **R4** Consolidation | **Partial** | Task asks learner write; **material spoils** with completed model summary |
| **R5** Worked example | **Present** | A1 |
| **R6** Synthesis / transfer | **Partial** | Strategies in model text only; no evaluation activity; no personal transfer task |
| **R7** Duration / solo | **Pass** (label) / **Partial** (credibility) | Solo OK; **timing labels overstated** |

**V-10 (function-first):** **FAIL** (R3 Absent; R4 Partial; R6 weak).

---

## 5. Activity-by-activity review

**Frozen run:** 3 activities. User “Activity 1–4” notes mapped below.

| User ref | Maps to (38F) | Maps to (38E10 comparator) |
|----------|---------------|----------------------------|
| Activity 1 | **A1** Worked example | A1 (similar) |
| Activity 2 | **A2** Scenario + table | A2 Task cards + checklist (no table on 38E10) |
| Activity 3 | **A2** scenarios (thin) | A2 scenarios in cards |
| Activity 4 | **N/A — omitted** | **A3** Evaluate strategies (prompt_set + modelling_note) |

### A1 — Studying Inflation Concepts with Worked Example

| Field | Assessment |
|-------|------------|
| **Current learner experience** | Read exposition → study 4-step worked CPI example → read sample output → vague instruction to “answer questions” with **no questions supplied**. |
| **Strengths** | Substantive worked example; duplicate reinforcement via sample_output; causes of inflation listed; formula visible. |
| **Weaknesses** | No `activity_preamble`; learner_task **incomplete**; no self-check; passive read path **~10–12 min**; user: **“mostly fine”** but time **not 15 min** unless extended writing invented by learner. |
| **Realistic duration** | **10–12 min** (read + follow worked example); **18–22 min** only if learner drafts answers to **unlisted** questions |
| **Labelled** | 15 min — **overstated** for authored content |
| **Teaching / preamble** | Teaching **in materials**; **no** activity-level preamble |
| **Task clarity** | **Poor** — “answer questions about…” without items |
| **Material quality** | **Good** for worked_example / text |
| **Worked / example** | **Good** |
| **Retrieval / self-check** | **Absent** |
| **User notes** | Activity 1 mostly fine; not ~12–15 min of warranted work as authored |
| **Recommended fix** | Add numbered **prompt_set** or questions; **teaching preamble**; **checklist** “I can apply CPI formula”; optional **try-then-check** mini problem |

### A2 — Analyzing Inflation Impact with Household Scenarios and Analysis Table

| Field | Assessment |
|-------|------------|
| **Current learner experience** | Read two bullet households → fill 6×2 dollar impact cells (same % column already given) → short comparative notes **without** method template. |
| **Strengths** | Genuine `scenario` Material; empty learner cells; both households present; pipe table structurally valid. |
| **Weaknesses** | Scenarios **not developed** (user: thin, inconsistent depth); **one easy calculation pattern** repeated; **no** checklist (38E10 had 7 items); **no** decision sequence; table **column balance** poor (wide empty Notes vs narrow impact columns — user); **no** bridge from A1. |
| **Realistic duration** | **8–12 min** mechanical; **15–18 min** with thoughtful notes — **not 20 min** |
| **Labelled** | 20 min — **overstated** (user: cannot justify 10+ min) |
| **Teaching / preamble** | **Absent** — jumps to “complete table” |
| **Task clarity** | **Partial** — steps listed but **how** to compute dollar impact unstated |
| **Material quality** | **Low** for scenarios; **OK** for table scaffold |
| **Retrieval / self-check** | **Absent** (practice only) |
| **User notes** | Scenarios under-developed; guidance thin; easy calc |
| **Recommended fix** | Richer scenario narratives; **one worked table row**; formula box; **checklist**; optional **task_cards** with per-household questions; teaching preamble linking CPI → budget impact |

### A3 — Consolidation Summary and Reflection (user “Activity 4” confusion point)

| Field | Assessment |
|-------|------------|
| **Current learner experience** | Read **pre-written** consolidation essay → task says write your own ≥80 words — **contradictory**. |
| **Strengths** | Closure activity exists; reflection on strategies mentioned in task |
| **Weaknesses** | **Spoiler material**; user: **difficult to understand what to do** / lacks sequence — model answer removes learner writing purpose; **no** reflection_prompts (38E10 had 5); strategies **told** not **evaluated** in prior activity |
| **Realistic duration** | **10–15 min** if learner still writes original summary; **3–5 min** if learner reads model only |
| **Labelled** | 20 min — **overstated** |
| **Teaching / preamble** | **Absent** |
| **Task clarity** | **Poor** — competes with supplied “Consolidation Summary” body |
| **Material quality** | **Unfit** as learner template — reads as **answer key** |
| **Retrieval / self-check** | N/A |
| **User notes** | Activity 4 hard to follow — on 38F this is **A3**; on 38E10 **A4** had clearer template + prompts |
| **Recommended fix** | **Empty** consolidation template + reflection_prompts; move strategies **evaluation** to dedicated prior activity (restore 38E10-like A3) |

### Missing activity (38E10 A3 — Evaluate Strategies)

| Field | Assessment |
|-------|------------|
| **38F gap** | Entire **strategy evaluation** activity removed (prompt_set, modelling_note, 15 min). Explains LO “evaluate strategies” **orphaned** and user sense of **missing decision sequence**. |
| **Recommended fix** | Restore **4-activity arc** or embed strategy evaluation + modelling before consolidation |

---

## 6. Cross-cutting quality issues

| Issue | Severity | Evidence |
|-------|----------|----------|
| **Assumes external teaching** | **High** | Jumps to table/strategy outcomes without in-page coaching arc |
| **Missing explicit teaching preamble** | **High** | No `activity_preamble`; [38F-7](38F-7-retrieval-definition-and-page-review-setup.md) hypothesis **confirmed** |
| **Terse “what to do”** | **High** | All `learner_task` blocks short vs 38E10 |
| **Timing inflation** | **Medium** | 55 min labelled vs ~35–45 min realistic |
| **3-activity compression** | **High** | Lost strategy evaluation + retrieval materials vs 38E10 |
| **Consolidation spoiler** | **High** | Full model summary in `materials.consolidation_summary` |
| **Workbook coherence** | **High** | Blocks present; **session rhythm** weak |
| **Table UX** | **Low–medium** | Notes column dominates; impact columns narrow (user; render/layout secondary) |
| **Canonical sections** | **Low** | Heading-only sections; no `assessment_check` ([38F-6](38F-6-retrieval-validation-calibration.md)) |

---

## 7. Retrieval interpretation after page review

| Question | Answer |
|----------|--------|
| **Missing material types only?** | **No.** Even with function-first R3 ([38F-7](38F-7-retrieval-definition-and-page-review-setup.md)), page lacks **verification beats** — not fixed by counting table fill as retrieval. |
| **Root cause** | **Qualitative composition:** dropped checklist/task_cards **and** no substitute self-check questions; A1 “answer questions” **hollow**. |
| **Vs 38F-4 score** | **Confirms** R3 **Partial/Absent** → V-10 **Fail**; adds that failure is **pedagogically real**, not scorer artefact alone. |
| **38E10 contrast** | Checklist + task_cards gave **explicit verification** — 38F traded for table/scenario **structure** without replacing checks. |

---

## 8. Layer attribution

| Layer | Responsibility | Examples on EV-38F-AFTER |
|-------|----------------|---------------------------|
| **DLA** | **Primary** | 3-activity compression; no `activity_preamble` / `support_note` / `prior_knowledge_activation`; no WB-11 retrieval rows; no strategy-evaluation activity; thin `learner_task` strings |
| **GAM** | **Primary** | Scenario prose minimal; consolidation material is **finished essay** not template; no checklist/task_cards/prompt_set |
| **Design Page** | **Secondary** | Omits rhetorical fields present on 38E10 page JSON; does not add coaching beats; preserves spoiler consolidation; heading-only section structure |
| **Renderer** | **Minor / out of scope** | Possible table column width imbalance; **not** driver of pedagogic FAIL |

```text
DLA (thin tasks, 3-act compression)
  → GAM (minimal scenarios, spoiler consolidation)
    → Design Page (drops preambles/support)
      → Learner sees worksheet assembly
```

---

## 9. Candidate next-sprint focus

| Option | Fit after 38F-8 |
|--------|-----------------|
| **A. Retrieval-density sprint** | **Insufficient alone** — genres absent because **activity design** thin; need verification **and** richer tasks |
| **B. Activity component quality sprint** | **Best fit** — preambles, task clarity, scenario depth, workload, timings, anti-spoiler consolidation |
| **C. Validation calibration sprint** | **Parallel planning** — function-first V-10; separate V-09 ([38F-6](38F-6-retrieval-validation-calibration.md)) |
| **D. Renderer / layout sprint** | **Defer** — table columns minor |

---

## 10. Recommended next step

**Do not charter yet in this slice** — programme recommendation for when chartering is allowed:

**Sprint 38-G — Activity Component Quality** (rename from “retrieval density”)

| In scope | Rationale |
|----------|-----------|
| **Explicit `activity_preamble` / teaching beats** | [38F-8](38F-8-inflation-page-quality-review.md) §4.1 #2 — confirmed gap |
| **Richer `learner_task` (“what to do”)** | Numbered steps, authored questions, calculation method |
| **Minimum practice density** | Worked table row; ≥2 scenario depth; restore 4th activity or merge with integrity |
| **Richer `scenario` bodies** | Narrative + constraints, not bullet labels |
| **Realistic `duration_minutes`** | Match authored workload |
| **Self-check / verification** | Checklist or prompt_set per activity — satisfies R3 **and** WB-11 |
| **Consolidation template discipline** | Empty template + reflection_prompts; no spoiler summary in materials |
| **Retain 38F-2** table + scenario **structural** rows | Do not regress V-01/V-05 |

**Parallel (docs-only):** **C** — [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) V-10 scorer amendment per [38F-7](38F-7-retrieval-definition-and-page-review-setup.md).

**Non-goals for 38-G:** Renderer/CSS; `app.js`; preservation architecture; Design Page compose rewrite.

---

## 11. Closure implication for 38-F

| Dimension | How 38-F should be understood |
|-----------|-------------------------------|
| **Sprint 38-F mission (V-01/V-05 + preserve 38E-8/9)** | **Achieved** on anchor ([38F-5](38F-5-final-evaluation-and-sprint-closure.md)) |
| **Preservation** | **PASS** |
| **Workbook PASS ([38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md))** | **FAIL** — correctly |
| **Post-closure slices 38F-6 … 38F-8** | Complete the story: retrieval scoring ([38F-6](38F-6-retrieval-validation-calibration.md)), function vs type ([38F-7](38F-7-retrieval-definition-and-page-review-setup.md)), **professional quality** ([38F-8](38F-8-inflation-page-quality-review.md)) |
| **Remaining programme issue** | **Qualitative activity composition** — not missing V-01/V-05 **structures** |

**38-F status:** Remains **CLOSED** (2026-06-04, [38F-5](38F-5-final-evaluation-and-sprint-closure.md)). **38F-8** is the **authoritative learner-product review** for programme handoff; it **does not reopen** 38-F implementation but **refines** the successor recommendation from “retrieval density” to **activity component quality**.

---

## 12. Completion statement

| Criterion | Met? |
|-----------|------|
| Clear first-glance verdict | **Yes** — §3 FAIL professional workbook |
| Structural vs professional quality distinguished | **Yes** — §3, §11 |
| Evidence-based next sprint recommendation | **Yes** — §10 **38-G Activity Component Quality** |
| User review observations integrated | **Yes** — §5 mapping |
| No implementation | **Yes** |
| 38-G not chartered | **Yes** |

**Slice 38F-8:** **COMPLETE**  
**Programme:** Charter **38-G** only after explicit approval — scope per §10.

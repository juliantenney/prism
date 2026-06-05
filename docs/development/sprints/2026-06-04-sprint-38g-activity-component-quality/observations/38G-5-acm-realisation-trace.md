# Slice 38G-5 — ACM realisation trace

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** **Evidence and traceability only** — no pack/code/schema/pipeline fixes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38G-5 (ACM trace focus)  
**Inputs:** [38G-1](38G-1-first-glance-workbook-quality-analysis.md) · [38G-2](38G-2-activity-component-model.md) · [38G-3](38G-3-dla-gam-implementation.md) · [38G-4](38G-4-regression-and-preservation-review.md)  
**Artefacts:** [EV-38G-AFTER-dla-learning-activities.json](../artefacts/EV-38G-AFTER-dla-learning-activities.json) · [EV-38G-AFTER-gam.txt](../artefacts/EV-38G-AFTER-gam.txt) · [EV-38G-AFTER-design-page.json](../artefacts/EV-38G-AFTER-design-page.json) · [EV-38G-AFTER-run-log.json](../artefacts/EV-38G-AFTER-run-log.json)  
**Comparator:** [EV-38F-AFTER-design-page.json](../../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/EV-38F-AFTER-design-page.json) (3 activities, pre-38G)

**Capture note:** `EV-38G-AFTER` produced by [ev-38g-inflation-pipeline-capture-once.mjs](../artefacts/ev-38g-inflation-pipeline-capture-once.mjs) using current pack (38G-3 ACM). Harness does **not** run Model Knowledge — LOs synthesised; no frozen `knowledge_model.json` (same limitation as [38G-1](38G-1-first-glance-workbook-quality-analysis.md) §2.1).

---

## 1. Executive summary

### 1.1 Programme question answered

> Prism is generating richer instructional design. Exactly where is that richness being preserved or lost before reaching the learner?

**Answer:** On `EV-38G-AFTER`, **38G-3 ACM prompts materially increased instructional richness at DLA and GAM** compared to `EV-38F-AFTER`. **Most ACM components now reach the learner-facing page intact** — a major shift from the 38F baseline where preambles and cognition fields were dropped at compose.

| Layer | 38F (`EV-38F-AFTER`) | 38G (`EV-38G-AFTER`) |
|-------|----------------------|----------------------|
| Activities | 3 | **4** |
| DLA cognition fields | Sparse | **Rich** (`prior_knowledge_activation`, `reasoning_orientation`, `scaffold_hint_sequence`, etc.) |
| Retrieval types in GAM | **None** (no checklist/cards/prompt_set) | **task_cards, prompt_set, checklist** on 3 activities |
| Page `activity_preamble` | **Absent** on all activities | **Present** on all 4 |
| Page cognition fields | **Absent** | **Present** where authored in DLA |
| Scenario depth | Thin bullets | **Named households, income/expense detail** |

### 1.2 Where richness is preserved

- **DLA → Page:** Orientation, knowledge activation (A1), guidance, worked reasoning, practice materials, verification beats, reflection prompts, transfer task (A4) — **largely preserved**.
- **GAM → Page:** Full material bodies for worked_example, sample_output, task_cards, prompt_set, checklist, scenario, tables — **preserved** (pipe tables verbatim).

### 1.3 Where richness is still lost or weakened

| Pattern | Example | Primary layer |
|---------|---------|---------------|
| **Spoiler consolidation** | A4 `consolidation_summary` is a completed essay while `learner_task` asks learner to write | **GAM** (genre mis-realisation) |
| **Table adjunct prose dropped** | GAM `analysis_table` includes `*Instructions:*` after pipe table; page keeps pipe table only | **Page composition** |
| **KM affordances never authored** | Brief mentions GDP deflator, policy communication — not in DLA/GAM/page | **Harness + DLA** (no KM artefact in capture) |
| **Uneven activation** | `prior_knowledge_activation` only on A1; A2/A3 omit | **DLA generation** |
| **Evaluate practice thin** | A4 maps Evaluate LO but no dedicated evaluate activity with criteria/modelling | **DLA arc design** (partial vs 38E10) |
| **Transition bridges** | Preambles orient per activity; weak explicit A→B bridges | **DLA** (authoring choice) |

### 1.4 Verdict

| Lens | Result |
|------|--------|
| **ACM richer than 38F?** | **Yes** — substantively at DLA, GAM, and page |
| **ACM fully realised on page?** | **No** — remaining gaps: spoiler closure, table instruction trimming, KM-not-in-pipeline, uneven activation |
| **Primary regression layer (38F→38G)?** | **None** — 38G improves; losses are selective not wholesale |

---

## 2. Activity-by-activity trace tables

Activity mapping: **A1** = `inflation_wb_01` · **A2** = `inflation_wb_02` · **A3** = `inflation_wb_03` · **A4** = `inflation_wb_04`

Legend: **P** = Preserved · **W** = Weakened · **C** = Compressed · **L** = Lost · **S** = Strengthened

---

### 2.1 A1 — Understanding Inflation: Worked Example and Sample Output

| ACM component | DLA evidence | GAM evidence | Page evidence | Status |
|---------------|--------------|--------------|---------------|--------|
| **Orientation** | `activity_preamble` (introduces worked example path) | — (DLA field) | `activity_preamble` verbatim | **P** |
| **Concept elucidation** | `worked_example` + `sample_output` specs; purpose “concept elucidation” | 3-step worked body (1244 chars); sample learner explanation (576 chars) | `materials.worked_example`, `materials.sample_output` full | **P** |
| **Knowledge activation** | `prior_knowledge_activation`: recall price changes / money value | — | Same field on page activity | **P** |
| **Misconception handling** | `support_note`: single-item vs general inflation | Task card 4 checklist item “avoid confusing inflation with price changes of single items” | `support_note` + embedded in `task_cards` | **S** |
| **Worked reasoning** | `worked_example` spec: stepwise KM definitions/relationships | Steps 1–3 with demand-pull / cost-push | Full worked example on page | **P** |
| **Guidance** | `learner_task` + `scaffold_hint_sequence` (3 steps) | 4 task cards with imperative steps | `learner_task` + `task_cards` material | **P** |
| **Practice** | Task: write own explanation | Cards 1–3 drive production | Learner writing task clear | **P** |
| **Verification / self-check** | `task_cards` spec includes checklist | Card 4 verification checklist (4 items) | Checklist inside `task_cards` | **P** |
| **Reflection** | `self_explanation_prompt` | — | Field preserved on page | **P** |
| **Transition** | Preamble: “before applying … in later tasks” | — | Preamble only; no explicit “next activity” bridge | **W** |

---

### 2.2 A2 — Analyzing CPI Trends (analysis_table)

| ACM component | DLA evidence | GAM evidence | Page evidence | Status |
|---------------|--------------|--------------|---------------|--------|
| **Orientation** | `activity_preamble` (CPI analysis focus) | — | `activity_preamble` verbatim | **P** |
| **Concept elucidation** | No separate `text` / exposition material | Table only + formula in prompt_set | No teaching block before table | **W** |
| **Knowledge activation** | **No** `prior_knowledge_activation` | — | **Absent** | **L** (never authored) |
| **Misconception handling** | `support_note`: short-term vs long-term trends | Prompt 5: short-term fluctuations | `support_note` on page | **P** |
| **Worked reasoning** | `scaffold_hint_sequence` (calc → classify → interpret) | Formula in `prompt_set`; **no** worked table row | Scaffold fields on page; no worked partial row | **W** |
| **Guidance** | `learner_task` + `prompt_set` spec | 5 numbered prompts with formula | `learner_task` + `materials.prompt_set` | **P** |
| **Practice** | `analysis_table` with empty learner columns | Pipe table 2018–2022 CPI | `materials.analysis_table` pipe only | **P** |
| **Verification / self-check** | `prompt_set` purpose: verify calculations | 5 self-check questions | `materials.prompt_set` full | **P** |
| **Reflection** | `self_explanation_prompt` | — | Field on page | **P** |
| **Transition** | No bridge from A1 CPI concept to this table | — | No inter-activity bridge text | **L** |

**Compression note:** GAM `analysis_table` Content includes `*Instructions:* Calculate the annual inflation rate…` after the pipe table. Page `materials.analysis_table` contains **pipe rows only** — instruction prose **lost at page**.

---

### 2.3 A3 — Household Scenarios: Impact on Finances

| ACM component | DLA evidence | GAM evidence | Page evidence | Status |
|---------------|--------------|--------------|---------------|--------|
| **Orientation** | `activity_preamble` (apply to real households) | — | `activity_preamble` verbatim | **P** |
| **Concept elucidation** | Scenario spec: income, expense, inflation context | Smith + Lee narratives (776 chars) | `materials.scenario` full | **S** vs 38F |
| **Knowledge activation** | **No** `prior_knowledge_activation` | — | **Absent** | **L** |
| **Misconception handling** | `support_note`: equal impact assumption | Checklist item 6: avoid equal-impact assumption | Both on page | **S** |
| **Worked reasoning** | `scaffold_hint_sequence`; **no** worked table row spec | Empty learner cells; instructions after table in GAM | Table on page; **no** worked row | **W** |
| **Guidance** | `learner_task` + checklist spec | Checklist 6 items + scenario | `learner_task`, `checklist`, `scenario` | **P** |
| **Practice** | `scenario` + `analysis_table` | Both materials with named cases | Both on page | **P** |
| **Verification / self-check** | `checklist` required_materials | 6 checkable items | `materials.checklist` | **S** vs 38F |
| **Reflection** | `self_explanation_prompt` | — | On page | **P** |
| **Transition** | Preamble links to “structured analysis” only | — | Weak session arc cue | **W** |

**Compression note:** GAM table includes `*Instructions:* Complete the table…` — **not** on page `materials.analysis_table`.

---

### 2.4 A4 — Consolidation Summary: Managing Inflation Effects

| ACM component | DLA evidence | GAM evidence | Page evidence | Status |
|---------------|--------------|--------------|---------------|--------|
| **Orientation** | `activity_preamble` (final consolidation) | — | `activity_preamble` verbatim | **P** |
| **Concept elucidation** | — (closure activity) | — | — | **N/A** |
| **Knowledge activation** | — | — | — | **N/A** |
| **Misconception handling** | `support_note`: integrate outcomes, move to evaluation | — | `support_note` on page | **P** |
| **Worked reasoning** | — | — | — | **N/A** |
| **Guidance** | `learner_task` + `prompt_set` spec | Reflection prompts (5) | Both on page | **P** |
| **Practice** | Task: write ≥80 word summary + 2 strategies | — | Task present | **W** (spoiler competes) |
| **Verification / self-check** | `prompt_set` reflection questions | 5 prompts | `materials.prompt_set` | **P** |
| **Reflection** | `self_explanation_prompt`, `transfer_or_application_task` | Prompt set | All fields on page | **P** |
| **Transition** | Capstone — session close | — | N/A | **N/A** |

**Critical pattern:** DLA spec says consolidation is “template and guidance”; GAM authors **completed** `consolidation_summary` (899 words, past-tense “you have learned…”). Page preserves full essay. Learner write task **undermined** — same **GQ-10** pattern as [38G-1](38G-1-first-glance-workbook-quality-analysis.md) / [38F-8](../../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md).

---

## 3. ACM component preservation matrix

Aggregate across A1–A4 (40 scored cells; N/A excluded).

| ACM component | P | W | C | L | S | Primary loss layer (if not P/S) |
|---------------|---|---|---|---|---|--------------------------------|
| Orientation | 4 | 0 | 0 | 0 | 0 | — |
| Concept elucidation | 1 | 1 | 0 | 0 | 1 | A2: DLA (no exposition row) |
| Knowledge activation | 1 | 0 | 0 | 2 | 0 | A2, A3: DLA never authored |
| Misconception handling | 2 | 0 | 0 | 0 | 2 | — |
| Worked reasoning | 1 | 2 | 0 | 0 | 0 | A2, A3: DLA (no worked partial) |
| Guidance | 4 | 0 | 0 | 0 | 0 | — |
| Practice | 3 | 1 | 0 | 0 | 0 | A4: GAM spoiler weakens practice |
| Verification | 4 | 0 | 0 | 0 | 0 | — |
| Reflection | 4 | 0 | 0 | 0 | 0 | — |
| Transition | 0 | 2 | 0 | 1 | 0 | DLA: weak bridges |

**Headline:** **8/10** component types are predominantly **Preserved or Strengthened** on the page. **Transition** and **knowledge activation** remain the weakest chain.

---

## 4. Special focus areas

### 4.1 Knowledge activation

| Stage | Evidence |
|-------|----------|
| **DLA** | `prior_knowledge_activation` on **A1 only**; Session Overview section on page **repeats** A1 activation text globally |
| **GAM** | No separate activation material type |
| **Page** | A1 field preserved; A2/A3 lack field; overview front-loads partial activation |

**Verdict:** **Preserved for A1**; **lost by omission** on A2/A3 (DLA authoring, not compose drop). Session overview **transforms** A1 activation into session-level framing — **not lost**, but **not activity-scoped** for later tasks.

### 4.2 Misconceptions (KM → page)

| KM misconception (programme/brief) | DLA | GAM | Page | Status |
|-----------------------------------|-----|-----|------|--------|
| Single price rise vs general inflation | A1 `support_note` | Task card 4 | Both | **Surfaced** |
| Equal impact across households | A3 `support_note` | Checklist item 6 | Both | **Surfaced** |
| Short-term fluctuation vs trend | A2 `support_note` | Prompt 5 | Both | **Surfaced** |
| CPI vs GDP deflator | — | — | — | **Lost** (no KM in run) |
| Nominal vs CPI-measured inflation | — | — | — | **Lost** |
| Income rise beats inflation automatically | Implied in A3 checklist | Checklist income erosion | **Implied** |

**Verdict:** Misconceptions that **reach DLA** are **surfaced** through page. Brief/KM misconceptions **without KM artefact** are **lost upstream** of DLA.

### 4.3 Worked reasoning (KM processes → page)

| Process | DLA | GAM | Page | Status |
|---------|-----|-----|------|--------|
| CPI inflation rate calculation | A2 table + prompt formula | Formula in prompt_set | Preserved | **P** |
| Inflation causes explanation | A1 worked_example | 3-step expert path | Preserved | **P** |
| Household budget impact | A3 scenario + table | Named cases + empty cells | Preserved; **no worked row** | **W** |
| Strategy evaluation | A4 LO mapping only | Spoiler summary asserts strategies | No evaluative practice activity | **L** |

### 4.4 Reflection and transition

| Element | DLA | GAM | Page | Status |
|---------|-----|-----|------|--------|
| Closure prompts | A4 `prompt_set` spec | 5 reflection prompts | `materials.prompt_set` | **P** |
| Transfer task | A4 `transfer_or_application_task` | — | Field on page | **P** |
| Self-explanation | All activities | — | All preserved | **P** |
| Inter-activity bridges | Weak in preambles | — | No dedicated bridge material | **W/L** |
| Spoiler closure body | Spec says “template” | Full model essay | Full essay on page | **Undermines reflection** |

---

## 5. Compression patterns

Documented instances with evidence:

### Pattern A — DLA field exists → GAM N/A → Page preserved

```text
activity_preamble / cognition fields (A1–A4)
  DLA: authored
  GAM: (activity-level fields not GAM output)
  Page: preserved verbatim
```

**Contrast with 38F:** `EV-38F-AFTER` page had **no** `activity_preamble` despite DLA authorship — **38G page compose preserved fields** in this capture.

### Pattern B — DLA rich → GAM rich → Page trims adjunct prose

```text
A2 analysis_table instructions
  GAM: pipe table + "*Instructions:* Calculate the annual inflation rate…"
  Page: pipe table only (instructions dropped)

A3 analysis_table instructions  
  GAM: pipe table + "*Instructions:* Complete the table…"
  Page: pipe table only
```

**Layer:** Page composition (material body subset) or merge logic retaining pipe-only for table keys.

### Pattern C — DLA metadata → never reaches learner

```text
outcome_alignment object (DLA JSON)
  Not surfaced on learner page (by design)

mapped_learning_outcomes on activities
  Page: not repeated per activity block (LOs in Session Overview only)
```

**Layer:** Page schema / assembly (acceptable metadata).

### Pattern D — DLA rich → GAM mis-realises → Page preserves error

```text
A4 consolidation_summary
  DLA spec: "template … summarizing ≥3 key ideas"
  GAM: completed 899-word session essay (past tense)
  Page: full essay in materials.consolidation_summary
  learner_task: still asks learner to write summary
```

**Layer:** **GAM** genre realisation (F1/F2 family — model answer not template).

### Pattern E — Brief/KM rich → DLA never receives

```text
Brief: GDP deflator, policy communication
  No knowledge_model.json in capture harness
  DLA/GAM/Page: silent on GDP deflator contrast
```

**Layer:** Pipeline harness (KM step skipped) + DLA cannot exploit absent artefact.

### Pattern F — Session overview absorbs activation

```text
A1 prior_knowledge_activation
  Also copied into page Section 1 "Session Overview"
  Duplicated, not lost — transformed to session-level framing
```

---

## 6. Root cause assessment

Evidence-based layer attribution (no speculation beyond artefacts):

| Issue | Primary layer | Evidence |
|-------|---------------|----------|
| **Major 38G quality uplift** (4 acts, retrieval, preambles, cognition) | **DLA generation** | `EV-38G-AFTER-dla-learning-activities.json` vs `EV-38F-AFTER-dla-learning-activities.json`; promptChars DLA 15755 vs 13676 |
| **Rich GAM bodies** (checklist, cards, prompts) | **GAM generation** | `EV-38G-AFTER-gam.txt` — 10 materials, 8 types; 38F run-log: no checklist/cards/prompt_set |
| **Preambles/cognition on page** (38G vs 38F) | **Page composition** (this run **preserved**) | 38G page JSON includes all fields; 38F page grep: zero matches for preamble/cognition |
| **Table instruction trimming** | **Page composition** | GAM Content longer than page `materials.analysis_table` strings |
| **Spoiler consolidation** | **GAM generation** | GAM authors finished essay; DLA asked for template; page copies GAM faithfully |
| **Missing KM misconceptions** | **Pipeline harness** | No `knowledge_model` in capture; brief affordances not translated |
| **Weak transitions** | **DLA generation** | No `transition` cues in specs beyond preamble tone |
| **Renderer / layout** | **Not primary** for ACM trace | No evidence of renderer stripping text fields; material truncation precedes render |

```text
Harness (no KM)
  → DLA (38G-3 ACM: STRONG in this run)
    → GAM (STRONG; consolidation spoiler exception)
      → Design Page (MOSTLY FAITHFUL; table adjunct trim)
        → Learner page (RICH vs 38F; not yet professional PASS — spoiler + uneven teach)
```

---

## 7. Comparison to 38F baseline

| Metric | EV-38F-AFTER | EV-38G-AFTER | Delta |
|--------|--------------|--------------|-------|
| Activities | 3 | 4 | **+1** (evaluate LO has mapped capstone) |
| DLA cognition fields | 0 optional fields used | 15+ field instances | **Major gain** |
| GAM verification types | 0 | task_cards, prompt_set, checklist | **Major gain** |
| Page preambles | 0/3 | 4/4 | **Fixed** (this run) |
| Page checklist/cards/prompts | 0 | 3 activity types | **Fixed** |
| Scenario quality | Bullet households | Named families + numbers | **Strengthened** |
| Spoiler consolidation | Yes (A3) | Yes (A4) | **Unchanged pattern** |
| Hollow “answer questions” | Yes (A1) | No — task_cards + prompts | **Fixed** |

---

## 8. Recommended target area for 38G-6

| Priority | Target | Rationale | Type |
|----------|--------|-----------|------|
| **1** | **GAM consolidation discipline** | A4 spoiler is the largest remaining **learner-visible** ACM failure; DLA→GAM→page chain intact but GAM mis-realises template | Pack prompt (GAM-WB-06 / anti-spoiler) — **already partially specified**; needs empirical closure in sprint narrative |
| **2** | **Page table material fidelity** | Instruction prose after pipe tables dropped — weakens guidance component | Compose contract / Design Page step — **out of 38G charter** unless programme amends |
| **3** | **DLA activation consistency** | A2/A3 lack `prior_knowledge_activation` despite Analyse demands | Pack + generation behaviour — monitor in closure |
| **4** | **Pipeline KM inclusion** | GDP deflator / programme misconceptions never enter chain | Harness / workflow — separate from 38G pack scope |
| **5** | **Sprint closure (38G-6)** | Document hypothesis judgement: **38G-3 ACM prompts work**; remaining gaps are **selective** not **systemic** | Docs |

**38G-6 recommendation:** **Close sprint** with explicit judgement that **38G-3 succeeded in connecting KM/LO intent to richer DLA/GAM/page output** on anchor, while recording **GAM consolidation spoiler** and **table adjunct trimming** as programme follow-ups (not 38G pack regressions).

---

## 9. Success criterion

| Question | Answer |
|----------|--------|
| Is richer instructional design being generated? | **Yes** — evidenced vs `EV-38F-AFTER` |
| Where preserved? | DLA fields, GAM materials, most page activity blocks |
| Where lost? | GAM consolidation essay; table instructions at page; KM-not-in-pipeline; uneven activation; weak transitions |
| Primary layer for remaining loss? | **GAM** (spoiler) > **Page compose** (table trim) > **DLA** (omissions) > **Harness** (no KM) |

**Slice 38G-5:** **COMPLETE**  
**Next:** **38G-6** — Sprint closure

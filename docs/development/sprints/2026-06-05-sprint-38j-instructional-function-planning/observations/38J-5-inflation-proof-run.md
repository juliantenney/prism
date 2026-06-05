# Slice 38J-5 — Inflation proof run

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Evaluation and evidence sprint — no pack or code fixes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38J-5  
**Harness:** `artefacts/ev-38j-inflation-pipeline-capture-once.mjs` (v38J-5)  
**Model:** `gpt-4.1-mini` · temperature 0.35

**Comparators:** [EV-38G-AFTER](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/) · [EV-38H-AFTER-knowledge-model.json](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/EV-38H-AFTER-knowledge-model.json) · [38I-4 target states](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) · [38J-3](38J-3-dla-implementation.md) · [38J-4](38J-4-gam-implementation.md)

---

## Section 1 — Generation summary

### Run metadata

| Field | Value |
|-------|-------|
| **Run ID** | `EV-38J-AFTER` |
| **Captured** | 2026-06-05T10:22:30Z |
| **Activities** | 4 (A1–A4) |
| **GAM materials** | 14 (vs 10 on `EV-38G-AFTER`) |
| **DLA augmented prompt** | 23,718 chars (vs 15,755 on 38G — +50%) |
| **GAM augmented prompt** | 23,040 chars (vs 14,796 on 38G — +56%) |
| **KM concepts** | 5 |

### Artefacts written

| File | Role |
|------|------|
| `artefacts/EV-38J-AFTER-knowledge-model.json` | Frozen KM for this run |
| `artefacts/EV-38J-AFTER-learning-objectives.json` | LOs (alias of learning-outcomes) |
| `artefacts/EV-38J-AFTER-dla-learning-activities.json` | DLA with IFP-shaped specs |
| `artefacts/EV-38J-AFTER-gam.json` | Structured GAM parse |
| `artefacts/EV-38J-AFTER-gam.txt` | Raw GAM bodies |
| `artefacts/EV-38J-AFTER-workbook.md` | Learner-facing stitch |
| `artefacts/EV-38J-AFTER-design-page.json` | Composed page |
| `artefacts/EV-38J-AFTER-run-log.json` | Run metadata |
| `artefacts/EV-38J-vs-38G-comparison.json` | Structured comparator |

### Pipeline path

```text
Brief → Learning Content → Knowledge Model → LO → DLA (§5 IFP) → GAM (§6 GAM-PRES) → Design Page → workbook.md
```

Outputs were **not manually edited**.

### Primary question (headline)

> Did the implementation transform activity-shell generation into instructional-episode generation?

**Answer:** **Substantially yes at DLA planning and early GAM realisation** — recognisable episode shapes appear on all four activities, with the largest gain on A2 (Apply) and A4 (Evaluate form). **Not yet at 38I-4 target density or A4 household-judgement benchmark.** The old shell failure mode is **broken** on A1–A3 and **partially broken** on A4.

---

## Section 2 — A1 comparison (Understand)

**Archetype intent:** Understand — CPI vs GDP deflator discrimination + household impact framing.

### EV-38G-AFTER (baseline)

**DLA `learner_task` (excerpt):**

```text
Study the worked example carefully… Then, write your own explanation of inflation and its main causes…
```

Single imperative block (~45 words). Materials: `worked_example` + `sample_output` + `task_cards` only. No exposition text row.

**GAM:** Rich worked example on demand-pull/cost-push (~200 words) but **no** dedicated misconception challenge, non-example, or verification section.

### EV-38J-AFTER

**DLA `learner_task` (segmented):**

```text
- Read the explanatory text on inflation, CPI, GDP Deflator…
- Study the worked example illustrating the differences…
- Review the sample output…
- Then, write your own explanation contrasting CPI and GDP Deflator…
```

**Materials (function-ordered):** `text` (exposition) → `worked_example` → `sample_output`.

**GAM text exposition (excerpt):**

```text
The key difference lies in basket composition and scope: CPI uses a fixed basket…
GDP Deflator uses a variable basket covering all domestically produced goods…
```

**GAM worked_example — misconception challenge (excerpt):**

```text
3. Common Misconceptions
   - Some think CPI and GDP Deflator measure inflation the same way…
   - Another misconception is that both cover the same goods…
```

### Assessment vs 38I-4 target (~950 words integrated)

| Dimension | 38G | 38J | 38I-4 target |
|-----------|-----|-----|--------------|
| Instructional density | Low shell | **Moderate** (~4.5k chars GAM) | High (~950 words integrated) |
| Sequencing | Study → write | **Read → study → review → write** | Full Understand template |
| Worked thinking | Present | **Present + misconceptions** | Present |
| Misconception handling | `support_note` only | **Dedicated section in worked_example** | Standalone challenge |
| Verification | Task_cards checklist | **Absent** | ≥4 check items |
| Guided → independent classification | Absent | **Absent** | Required |
| Transfer | Absent | **Partial** (`transfer_or_application_task` field) | Reflection + transition |

**Archetype match:** **Partial** — Understand teaching moves present; missing verification and classification functions.

**Verdict A1:** Clear improvement over 38G; not yet 38I-4 A1 target state.

---

## Section 3 — A2 comparison (Apply)

**Archetype intent:** Apply — CPI calculation with worked thinking fade.

### EV-38G-AFTER

**Materials:** `analysis_table` + `prompt_set` only — **no `worked_example`** (classic shell).

**GAM:** Empty CPI table + formula in prompt_set. Purest task-first failure ([38J-1 §3.3](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-1-baseline-inspection.md)).

### EV-38J-AFTER

**Materials:** `worked_example` → `sample_output` → `classification_table` (practice).

**DLA specification (excerpt):**

```text
Detailed stepwise worked example calculating CPI inflation rate using weighted average price changes…
includes intermediate calculations and reasoning.
```

**GAM worked_example (excerpt):**

```text
1. Identify Basket Items and Prices…
2. Calculate Price Changes… Bread: (2.20-2.00)/2.00 × 100 = 10%
3. Apply Weights…
4. Calculate Overall CPI Inflation Rate… 10.0%
```

**Practice table:** Learner-empty price change and weighted columns (fade to independent).

### Assessment

| Dimension | 38G | 38J |
|-----------|-----|-----|
| Worked thinking | **Missing** | **Present** (KM-T03 satisfied) |
| Guided practice | Table only | **Worked → sample → partial table** |
| Instructional sequencing | Task-first | **Teach → model → perform** |
| Verification | prompt_set | **Implicit in table completion** |

**Archetype match:** **Substantial** — matches Apply template core (criteria/process → worked thinking → guided → independent practice). Missing explicit verification checklist.

**Verdict A2:** **Largest single-activity win** — directly addresses 38G/38I-2 A2 failure mode.

---

## Section 4 — A3 comparison (Analyse)

**Archetype intent:** Analyse — household comparison with justification.

### EV-38G-AFTER

**Materials:** `scenario` + `analysis_table` + `checklist`. Solid Analyse practice shape but thin analytical framing.

### EV-38J-AFTER

**Materials:** `scenario` → `analysis_table` → `prompt_set` (guided inquiry).

**GAM scenario (excerpt):**

```text
Household A: The Smith Family… High proportion on groceries, utilities…
Household B: The Lee Family… dining out, entertainment…
Inflation Context: Overall 6%; Groceries +8%…
```

**Guided inquiry (excerpt):**

```text
1. How does the higher inflation in groceries and transportation affect Household A's real income…?
3. How might the fixed-rate mortgage… and variable-rate loan… influence borrowing costs…?
```

### Assessment

| Dimension | 38G | 38J |
|-----------|-----|-----|
| Scenario depth | Present | **Present + inflation context** |
| Analytic matrix | Present | **Present with justification column** |
| Worked analytic pass | Absent | **Absent** |
| Verification | checklist | **prompt_set only** (checklist dropped) |
| Criteria exposition | Implicit | **Partial** (impact categories) |

**Archetype match:** **Partial** — Analyse practice and guided inquiry present; missing worked analytic thinking and explicit criteria lenses per 38I-4 A3 target.

**Verdict A3:** Improvement in scenario/context; regression vs 38G on checklist verification.

---

## Section 5 — A4 comparison (Evaluate — highest priority)

### EV-38G-AFTER (failure mode reference)

**Materials:** `consolidation_summary` + `prompt_set` only. Maps all 4 LOs on capstone.

**GAM consolidation (spoiler — pre-38H class):**

```text
In this session, you have learned that inflation is a general rise in prices…
You also reflected on strategies… such as budgeting carefully…
```

Classic **EV-SHELL-01** — summary label on consolidation; no criteria, perspectives, or judgement sequence.

### EV-38J-AFTER

**Materials (function-ordered):** `text` (criteria) → `scenario` (perspectives) → `modelling_note` (weak/strong) → `decision_table` (guided) → `consolidation_summary` (scaffold).

**Note:** A4 LO is *Summarize policy communication* — **not** the 38I-4 household-strategy Evaluate LO. Episode shape is Evaluate-like but **domain shifted** to policy communication.

### Evaluate function checklist (Present / Partial / Missing)

| Function | 38G | 38J | 38I-4 A4 benchmark |
|----------|-----|-----|---------------------|
| **Perspective building** | Missing | **Present** — two policy scenarios | Present — household gains/loses |
| **Criteria exposition** | Missing | **Present** — 4 criteria in text | Present — 4 household criteria |
| **Worked judgement** | Missing | **Present** — weak vs strong in modelling_note | Present — weak slogan vs criteria-led |
| **Guided judgement** | Missing | **Present** — partial decision_table | Present — partial ranking table |
| **Independent judgement** | Missing | **Missing** — no memo scaffold/template | Present — 220–280 word memo |
| **Verification** | Missing | **Missing** — no checklist/rubric checkpoints | Present — 5-item rubric check |
| **Transfer** | Field only | **Missing** — no `transfer_prompt` material | Present — own-context 120–160 words |
| **Anti-spoiler consolidation** | **FAIL** (model essay) | **PASS** (scaffold prompts) | Scaffold only |

**GAM weak/strong judgement (excerpt):**

```text
Weak Judgement (Scenario 2): … lacks detailed information… inflation expectations may become unanchored…
Strong Judgement (Scenario 1): … transparent approach provides clear, consistent, and credible communication…
```

**GAM consolidation — scaffold (excerpt):**

```text
To consolidate your learning… reflect on the following prompts as you write your summary:
- How do the differences between CPI and GDP Deflator…?
- Why is effective policy communication crucial…?
```

No pre-written learner memo — **GAM-WB-06b preserved** ([38J-4](38J-4-gam-implementation.md)).

### vs 38I-4 target-state A4

38I-4 requires **household budget strategy evaluation** (Maya scenario, purchasing-power criteria, trade-offs). 38J A4 evaluates **policy communication strategies** — structurally closer to Evaluate archetype than 38G, but **wrong substantive anchor** for inflation workbook closure.

**Verdict A4:** **Partial Evaluate episode** — form improved dramatically; content and independent/transfer/verification gaps remain vs A4 benchmark.

---

## Section 6 — Anti-shell assessment

**Failure mode:** Task + resources + output **without** instructional presentation.

| Activity | 38G | 38J | Evidence |
|----------|-----|-----|----------|
| **A1** | **FAIL** — study-then-write shell | **PASS** | Text exposition + worked + sample before write; segmented task |
| **A2** | **FAIL** — table + prompts only | **PASS** | Full worked calculation before practice table |
| **A3** | **PARTIAL** — scenario helps | **PASS** | Scenario + guided inquiry before matrix completion |
| **A4** | **FAIL** — consolidation-only capstone | **PARTIAL** | Criteria→scenarios→modelling→table sequence; but `expected_output` bundles table + consolidation without independent memo |

**IFP-05 / AS-FAIL on 38J DLA:** Would likely **pass** A1–A3 (≥80% R functions populated). A4 passes **EV-SHELL-02..05** partially; fails **EV-SHELL-07** (transfer absent) and **independent judgement** depth.

**Overall:** Old dominant failure mode **largely eliminated** on A1–A3. A4 no longer collapses to summary-only — but not full 38I-4 Evaluate.

---

## Section 7 — Preservation assessment (GAM)

| Preservation rule | Result | Evidence |
|-------------------|--------|----------|
| **Function ordering** | **PASS** | GAM Material order matches DLA `required_materials` on all activities (see `EV-38J-AFTER-gam.txt`) |
| **No collapse (F8)** | **PASS** | 14 Materials for 14 DLA rows — one body per row |
| **Worked reasoning** | **PASS** | A1, A2 full worked bodies (1456–1912 chars) |
| **Worked judgement** | **PASS** | A4 modelling_note weak/strong contrast (1117 chars) |
| **Verification** | **PARTIAL** | No dedicated checklist on A1/A4; A3 lost checklist vs 38G |
| **Transfer** | **FAIL** | No `transfer_prompt` Material despite DLA `transfer_or_application_task` on A1/A4 |
| **Anti-spoiler** | **PASS** | A4 consolidation is prompt scaffold; strong judgement ≠ expected_output |
| **Evaluate depth** | **PARTIAL** | Guided table present; independent memo and verification absent |

**Collapse instances:** None observed — GAM-PRES-02 honoured. No prompt_set-only replacement of teaching sequence.

---

## Section 8 — Remaining gaps

### Missing functions

- A1: Non-example table, guided/independent classification, verification checklist  
- A2: Explicit verification checklist post-practice  
- A3: Worked analytic pass, checklist (present in 38G, absent in 38J)  
- A4: Independent judgement memo scaffold, verification rubric, `transfer_prompt` material  

### Weak functions

- A1 `sample_output` — full model answer risks copy bias (SP-02 tension; not marked “not for copying” in spec)  
- A3 `prompt_set` substitutes for checklist — weaker verification  
- A4 `expected_output` combines table + consolidation — blurs Evaluate judgement vs session reflection  

### Over-generation / length

- GAM bodies are **longer** than 38G (14 materials, +40% prompt surface) but still **below** 38I-4 ~8× density target  
- A1 text + worked + sample may be **redundant** with sample_output echoing worked content  

### Inference failures

- **LO–archetype mismatch:** LO4 *Summarize policy communication* drove Evaluate **form** on **policy** topic instead of household strategy Evaluate per 38I-4  
- **AP-OVERRIDE not visible on A1:** LO cognitive_level `Analyze` on CPI contrast — activity still Understand-shaped (acceptable) but dual LO on A1 blurs focus  
- **KM under-used:** 5 concepts vs richer `EV-38H-AFTER` KM — processes/misconceptions partially surfaced  

### DLA planning vs GAM preservation

38J-3 IFP visible in DLA purpose/specification language (`criteria exposition`, `worked judgement contrast`, `guided judgement table`). 38J-4 GAM-PRES **preserved** what DLA specified — gaps are primarily **DLA planning omissions** (transfer material row, independent memo, verification), not GAM collapse.

---

## Section 9 — Overall verdict

### **C. Substantial improvement**

### Evidence summary

| Criterion | 38G baseline | 38J after |
|-----------|--------------|-----------|
| Episode vs shell | Shell-dominant | **Episode recognisable on all four** |
| A2 Apply worked thinking | Absent | **Present** |
| A4 Evaluate shape | Summary-only | **Criteria → perspectives → worked judgement → guided table** |
| Anti-spoiler A4 | Model essay | **Scaffold consolidation** |
| GAM function collapse | N/A | **None detected** |
| 38I-4 target density | ~8× gap | **~2–3× improvement; gap remains** |
| A4 household benchmark | Not met | **Not met** (policy communication substitute) |

**Not A (Failed):** IFP + GAM-PRES clearly changed outputs — not cosmetic.  
**Not D (Target achieved):** 38I-4 A1/A3/A4 depth and A4 household Evaluate still not reached.

---

## Section 10 — Recommendations for 38J-6

1. **Close sprint SUCCESS (conditional)** — pedagogical hypothesis validated: internal function planning + GAM preservation produces episode-shaped output without schema change.  
2. **Document LO inference gap** — Evaluate LO wording must anchor household judgement (38I-4) or harness brief must require fourth LO verb *Evaluate* household strategies.  
3. **DLA-WB row tightening (future sprint)** — mandate `transfer_prompt` Material row when `transfer_or_application_task` set; mandate `checklist` or `template` for independent judgement on Evaluate activities.  
4. **Optional 38J-5b** — re-run with frozen `EV-38H-AFTER-knowledge-model.json` injected (KM-only swap) to isolate KM richness vs planning.  
5. **Do not rewrite §6** — preservation worked; remaining gaps are planning/spec emission.  
6. **38J-6 closure artefact** — cite `EV-38J-AFTER` as proof; recommend programme continuation on LO harness + Evaluate LO contract, not renderer/ACM.

---

## References

- `artefacts/EV-38J-AFTER-*`  
- `artefacts/EV-38J-vs-38G-comparison.json`  
- [38J-3 DLA implementation](38J-3-dla-implementation.md)  
- [38J-4 GAM implementation](38J-4-gam-implementation.md)  
- [38I-6 closure](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-6-sprint-closure.md)

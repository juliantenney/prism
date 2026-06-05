# Slice 38K-4 — Target-state depth examples

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Demonstration only — no pack, code, schema, renderer, or prompt changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38K-4  
**Authority:** [38K-3 archetype depth rules](38K-3-archetype-specific-depth-rules.md) · [38K-2 function depth model](38K-2-function-depth-model.md)  
**Baseline:** `EV-38J-AFTER-workbook.md` · **Calibration:** [38I-4 mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

**Note:** Examples show **minimum Level 3 sufficient** learner-facing content for gap functions — not full 38I-4 episode length. Existing strong content (A2 worked example) is **retained**, not rewritten.

---

## Purpose

Make [38K-2](38K-2-function-depth-model.md) depth contracts and [38K-3](38K-3-archetype-specific-depth-rules.md) archetype floors **visible** in prose a solo learner would read.

**Demonstration target:**

```text
Present but thin   →   Instructionally sufficient (Level 3)
```

---

# E1 — Understand (A1)

## 1. Current state summary

`EV-38J-AFTER` A1 teaches CPI vs GDP deflator in exposition and worked_example (Level 3 on explanation). Misconceptions appear as a subsection inside the worked example (Level 2). There is **no** non-example table, **no** standalone conceptual contrast with reconciliation prompt, and **no** verification checklist. `sample_output` offers a full model paragraph (copy risk). Final task is a generic write imperative.

**38J assessed levels (focus functions):** Explanation L3 · Conceptual contrast L2–3 (prose only) · Non-example L0 · Verification L0.

---

## 2. Missing functions

| Function | 38J status | 38K-3 floor |
|----------|------------|-------------|
| Non-example | Absent | Level 3 required* |
| Conceptual contrast (standalone) | Partial in prose | Level 3 required* |
| Verification | Absent | Level 3 required |
| Guided/independent classification | Absent | Level 3 required |

\*Required when CPI/GDP confusable pair present (Inflation anchor).

**Focus of this example:** explanation enhancement + non-example + conceptual contrast + verification (per charter).

---

## 3. Target-state learner-facing example

### Current — `EV-38J-AFTER` excerpt (explanation tail)

> The key difference lies in **basket composition and scope**: CPI uses a fixed basket focused on consumer goods and services, while the GDP Deflator uses a variable basket covering all domestically produced goods and services.
>
> Inflation impacts household budgets in several ways: **Real income** decreases… **Savings** lose value… **Borrowing costs** may increase…

*Teaching is present but does not teach **discrimination** — learner is not shown what a measure does **not** capture.*

---

### Level 3 sufficient — added sections (learner-facing)

#### Conceptual contrast — CPI and GDP deflator on shared dimensions

| Dimension | **CPI** | **GDP deflator** |
|-----------|---------|------------------|
| **Basket** | Fixed set of consumer goods/services households buy | All domestically produced goods/services; basket **changes** with production |
| **Typical use** | Cost of living, household-facing | Whole-economy price level |
| **Includes investment & government output?** | **No** | **Yes** |
| **Can the two diverge?** | **Yes** — e.g. when production mix or import prices shift | **Yes** — same reason |

**Takeaway rule:** CPI answers *"What happened to prices of what households buy?"* GDP deflator answers *"What happened to prices of everything produced here?"*

#### Non-example — when a headline is **not** the same story as CPI

| Situation | Same as CPI inflation? | Why |
|-----------|------------------------|-----|
| Only avocado prices double after a crop frost | **No** (alone) | Single-product shock, not general consumer basket |
| CPI rises 5% but households switched spending toward cheaper goods | **Complicated** | CPI fixed basket may **overstate** "felt" inflation if substitution is large |
| CPI and GDP deflator both rise ~5% for two years | **Related but not identical** | Measures can move together yet still differ in **level** and **timing** |

**Write one sentence:** Give one case where CPI could rise while households' *felt* cost pressure differs — use the table above.

#### Misconception reconciliation (learner attempt)

A colleague says: *"CPI and GDP deflator always tell the same story — they're both inflation."*

**Your task — two sentences:** Why can both be valid measures yet show different pictures? Name **one** dimension from the contrast table.

#### Verification — self-check before you write your explanation

Mark each **Yes** / **Not yet**:

| Checkpoint | Response |
|------------|----------|
| I can state **fixed vs variable basket** in my own words | |
| I named **one thing CPI excludes** that GDP deflator includes | |
| My non-example is **genuinely different** from my CPI example | |
| I explained **one** household budget effect of inflation (real income, savings, or borrowing) | |

**Repair path:** If "Not yet" on basket difference, reread the contrast table only — then rewrite **one sentence** on basket before continuing.

---

## 4. Sufficiency analysis (E1)

| Dimension | 38J (focus functions) | Level 3 sufficient (added) |
|-----------|----------------------|----------------------------|
| **What to do** | Partial — "write explanation" | **Yes** — contrast table, non-example labelling, reconciliation, verification rows |
| **Why it matters** | Partial — exposition states importance | **Yes** — takeaway rule links measure to household vs economy question |
| **Expert reasoning** | Yes — worked example steps | **Yes** — contrast structure models how economists discriminate measures |
| **Independent attempt** | Partial — open write task | Unchanged in this excerpt; classification task remains separate 38K-3 obligation |
| **Check/revise** | **No** | **Yes** — four-item checklist + repair path |

**What changed:** Not length of exposition — **added discrimination machinery** (contrast + non-example + verification) so the learner can self-repair before the independent write.

**Why still thinner than 38I-4 A1:** Full target adds guided classification, independent classification band, reflection, transition ([38I-4 A1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)). This excerpt closes the **four charter focus functions** only.

---

# E2 — Apply (A2)

## 1. Current state summary

`EV-38J-AFTER` A2 is the **strongest post-38J activity**. Worked_example (A2-M1) is **Level 4** — stepped basket calculation with weights and interpretation. Guided fade via sample_output + empty practice table reaches **Level 3**. Missing: standalone **process exposition** (rules/errors), **verification** checklist with keyed answers, **transfer** prompt with new data.

**Retained unchanged:** A2-M1 worked_example, A2-M2 sample_output, A2-M3 practice table.

---

## 2. Missing functions

| Function | 38J status | 38K-3 floor |
|----------|------------|-------------|
| Process exposition | L2 (embedded in steps) | L3 required |
| Verification | L0 | L3 required |
| Transfer | L0 | L3 optional (shown here) |

---

## 3. Target-state learner-facing example

### Current — `EV-38J-AFTER` excerpt (practice table instructions only)

> Instructions:
> - Calculate the price change percentage for each item using the formula:
>   (Current Price − Base Price) / Base Price × 100
> - Multiply each price change by the item's weight…
> - Sum all weighted price changes to find the overall CPI inflation rate.

*Procedure is named but **common errors**, **rounding**, and **self-check** are absent.*

---

### Level 3 sufficient — closure sections only (insert after practice table)

#### Process exposition — CPI basket inflation rules

Before you submit, confirm you used the **same method** as the worked example:

1. **Price change (%)** = ((Current − Base) / **Base**) × 100 — divide by **base**, not current.  
2. **Weighted change** = Price change (%) × weight (as decimal).  
3. **CPI inflation rate** = **sum** of weighted changes for the basket.  
4. Round final rate to **one decimal place** unless told otherwise.

**Common errors to avoid:**

- Dividing by current price instead of base price  
- Forgetting to multiply by weight before summing  
- Reporting a single item's price change as the basket inflation rate

*Why this matters here:* The practice table uses **different numbers** than the worked example — only the **rules** transfer.

#### Verification — check your practice table

| Check | Pass? |
|-------|-------|
| Every price change uses **base** price as denominator | |
| Each weighted change = price change % × weight | |
| Basket total equals sum of weighted changes (±0.1%) | |
| Final CPI rate stated clearly with % symbol | |

**Keyed answers for this practice table:** Bread 10.0% / 3.5 weighted; Milk 10.0% / 2.5; Eggs 10.0% / 4.0 → **Total CPI inflation rate: 10.0%**

**Revision:** If your total differs, rework **one row** using the worked example steps only — do not change weights.

#### Transfer — same method, new basket item

**New surface (calculate only):** Replace Eggs with **Rice**: Base $1.80, Current $1.98, Weight 0.40 (Bread and Milk unchanged from practice table).

1. Price change for Rice: ______%  
2. Weighted change for Rice: ______%  
3. New basket CPI inflation rate: ______%

*You do not need new teaching — apply the rules above.*

---

## 4. Sufficiency analysis (E2)

| Dimension | 38J (closure functions) | Level 3 sufficient (added) |
|-----------|-------------------------|----------------------------|
| **What to do** | Partial — formula in table footer | **Yes** — numbered rules + error list + verification rows + transfer task |
| **Why it matters** | Partial — worked example interprets once | **Yes** — "only rules transfer" explains why exposition is separate from one numeric run |
| **Expert reasoning** | **Yes** (worked example — unchanged) | Unchanged — not rewritten |
| **Independent attempt** | **Yes** — practice table | **Yes** — unchanged |
| **Check/revise** | **No** | **Yes** — keyed answers + conditional revision |

**What changed:** A2 already taught **how** to calculate. Sufficiency gap was **closure** — learner could not confirm correctness or reuse method on new data without a tutor.

**Distance to 38I-4 A2:** Target adds guided partial row before full table ([38I-4 A2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)). This excerpt supplies **minimum L3 closure** only.

---

# E3 — Analyse (A3)

## 1. Current state summary

`EV-38J-AFTER` A3 provides a usable **scenario** (Smith/Lee households + inflation context, Level 3) and **guided inquiry** prompt_set (Level 3). The **analysis_table** is an empty grid (guided analysis Level 2). There is **no** analytical criteria/lens table, **no** worked analytic pass, and **no** verification (38G checklist **regressed**). ~295 material words vs ~1,050 target — among the largest relative gaps.

**Context note:** 38I-4 A3 target uses inflation **typology**; 38J A3 uses **household comparison**. Level 3 sufficient below respects **38J topic** while applying [38K-3 Analyse](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) floors.

---

## 2. Missing functions

| Function | 38J status | 38K-3 floor |
|----------|------------|-------------|
| Criteria exposition (lenses) | L2 (implicit categories) | L3 required |
| Worked analytic pass | L0 | L3 required |
| Guided analysis (partial exemplar) | L2 | L3 required |
| Verification | L0 | L3 required |

---

## 3. Target-state learner-facing example

### Current — `EV-38J-AFTER` excerpt (empty table)

> | Impact Category | Household A Effect | Household B Effect | Justification / Explanation |
> | Real Income     |                    |                    |                               |
> | Savings Erosion |                    |                    |                               |
> | Borrowing Costs |                    |                    |                               |
>
> Instructions: For each impact category, describe how inflation affects Household A and Household B…

*Structure without **modelling** — learner has not seen how an analyst moves from scenario facts to justified cells.*

---

### Level 3 sufficient — Analyse sequence (learner-facing)

#### Criteria exposition — lenses for household comparison

| Lens | What to look for in this scenario |
|------|-------------------------------------|
| **Expense exposure** | Which spending categories rise fastest for each household? |
| **Income flexibility** | Can income adjust within 6–12 months (bonus, review, hours)? |
| **Savings real return** | Nominal savings rate vs inflation rate |
| **Debt structure** | Fixed vs variable borrowing; who faces rising interest costs? |

Keep these visible while you complete the table.

#### Worked analytic pass — one row modelled (Real Income)

**Facts to use:** Smith: $4,000 income, grocery/transport inflation 8%/7%. Lee: $7,000 income, dining/entertainment 4%/3%.

**Analyst walkthrough:**

1. **Lens:** Expense exposure — Smith spends heavily on categories rising **above** 6% headline inflation.  
2. **Mechanism:** Unless wages rise, **real income** falls when essentials absorb a larger share of unchanged nominal pay.  
3. **Contrast:** Lee's faster-rising categories are **below** headline on average — pressure exists but **less acute** on essentials share.  
4. **Draft cell (Smith, Real Income):** *Negative — grocery and transport inflation outpaces likely wage adjustment on fixed monthly income.*

*This is one row — you complete the rest.*

#### Guided analysis — complete **Savings Erosion** row only

| Impact Category | Household A (Smith) | Household B (Lee) | Justification |
|-----------------|---------------------|-------------------|---------------|
| Savings Erosion | *Example: Negative — 2% return < 6% inflation; purchasing power falls* | | *Use lens: savings real return. Cite 1.5% vs 6%.* |

**Your task:** Fill **Lee** column for Savings Erosion only. Then complete **all rows** for Real Income, Savings Erosion, and Borrowing Costs without copying the Smith Real Income draft verbatim — apply lenses.

#### Verification — logic audit

| Audit question | Yes / No |
|----------------|----------|
| Each justification cites **at least one scenario number** (income, rate, or category inflation) | |
| Smith and Lee differ on ≥1 row for a **structural reason**, not only adjectives | |
| Borrowing Costs row mentions **fixed vs variable** debt | |

**Repair:** If "No" on row 3, reread scenario borrowing lines only — revise Borrowing Costs cells.

---

## 4. Sufficiency analysis (E3)

| Dimension | 38J | Level 3 sufficient |
|-----------|-----|-------------------|
| **What to do** | Partial — "fill table" | **Yes** — lenses named, one row modelled, partial guided row, audit questions |
| **Why it matters** | Partial — scenario states context | **Yes** — lenses explain *why* comparison is structured, not anecdotal |
| **Expert reasoning** | **No** | **Yes** — worked pass shows fact → lens → mechanism → cell |
| **Independent attempt** | Partial — empty grid | **Yes** — guided partial + full table with justification rule |
| **Check/revise** | **No** | **Yes** — three audit questions + repair path |

**What changed:** Largest gap was **absent analytic modelling**. Scenario + questions alone feel like a worksheet; worked pass + lenses + verification feel like **teaching analysis**.

---

# E4 — Evaluate (A4)

## 1. Current state summary

`EV-38J-AFTER` A4 evaluates **policy communication** strategies. Evaluate **shape** exists: criteria text (L3), two scenarios (L3), weak/strong modelling_note (L3), empty decision_table (L2), consolidation_summary (L3 synthesis). **Independent judgement memo**, **verification rubric**, and **transfer** Material are **absent** (L0). `expected_output` bundles table + session summary — blurs Evaluate with synthesis.

**Calibration:** [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) — household Maya scenario. Below is **minimum Level 3 floor**, not full benchmark richness.

---

## 2. Missing functions

| Function | 38J status | 38K-3 floor |
|----------|------------|-------------|
| Perspective building (household) | Policy scenarios only | L3 required |
| Trade-off analysis | L2 implicit | L3 required |
| Guided judgement (depth) | L2 empty table | L3 required |
| Independent judgement | L0 | L3 required |
| Verification | L0 | L3 required |
| Transfer | L0–1 field only | L3 required |

**Present at floor already:** Criteria exposition · Worked judgement (weak/strong).

---

## 3. Target-state learner-facing example

### Current — `EV-38J-AFTER` excerpt (task + consolidation)

> ### Evaluate inflation management strategies based on policy communication
> - Read the evaluation criteria…
> - Complete the guided judgement table…
> - Finally, write a consolidation summary synthesizing your key learnings from the session…
>
> **Material A4-M5:** To consolidate your learning… reflect on the following prompts… write a clear and concise summary of at least 80 words…

*Evaluate form on **policy** topic; capstone collapses to **session summary** — no defended household plan, no rubric, no personal transfer.*

---

### Level 3 sufficient — minimum Evaluate episode (household anchor)

*Substance aligned to 38I-4 A4; depth = minimum L3 per [38K-3 §6](38K-3-archetype-specific-depth-rules.md).*

#### Perspective building

**Maya's household:** £2,400/month fixed income; ~£1,900 essentials; £300 discretionary; £800 emergency fund; £150/month saving. Inflation **5%**; groceries/utilities rising faster than rent.

**James (contrast):** Variable income ~£2,800; rent frozen 12 months; more scope to switch suppliers.

**Pause and write:** Who is more exposed on **essential-expense resilience** in the next six months? Two sentences — cite income type.

**Competing priorities (do not resolve yet):**

- *Protect essentials first* vs *keep saving every month*  
- *Cut discretionary* vs *seek pay review now*

#### Criteria exposition

| Criterion | What you judge | Why it matters for Maya |
|-----------|----------------|-------------------------|
| **Purchasing-power protection** | Offsets real income loss? | Income fixed; prices not |
| **Essential-expense resilience** | Protects rent, food, utilities? | Discretionary cuts may not cover essentials spike |
| **Feasibility** | Doable in six months without specialist finance? | Plan must be executable |
| **Downside risk** | What fails if inflation worsens? | Thin buffer vs saving pause |

#### Worked judgement (weak vs strong — not your answer)

**Weak:** *"Inflation is bad. Budget better and save more."* — No criteria, no trade-offs.

**Stronger:** *"Priority: **essential-expense resilience** under fixed income. Partial **C**: redirect £90 of £150 saving for three months to food/utilities buffer; keep £60 saving. Parallel **D**: pay review request — highest upside if it succeeds. **A** necessary but insufficient alone. Defer **E** — downside risk too high without advice. **Trade-off:** slower saving growth vs lower essentials shortfall risk."*

#### Guided judgement — three strategies, partial scoring guide

Score **1–3** per criterion (3 = strong **for Maya**). Complete **strategy C** row as exemplar; you choose two others.

| Strategy | Purchasing-power | Essential resilience | Feasibility | Downside risk | Justification |
|----------|------------------|----------------------|-------------|---------------|---------------|
| **C** — Essentials buffer | 2 | 3 | 3 | 2 | *Redirects saving to spike-prone categories; preserves partial habit* |
| | | | | | |
| | | | | | |

**Trade-off prompt:** Where did two criteria **pull against** each other? One sentence in a justification cell.

#### Independent judgement — decision memo

Write **220–280 words** for Maya:

1. **Priority criterion** — what matters most and why  
2. **Primary and secondary strategy** — named, ordered  
3. **Trade-off** — what she gives up  
4. **Revision condition** — one evidence event that would change your advice  

*Do not copy the strong exemplar.*

#### Verification

| Checkpoint | Yes / Partial / No |
|------------|-------------------|
| Compared ≥2 strategies with rubric | |
| ≥2 criteria appear in memo | |
| Named a trade-off | |
| Rejected one strategy with criterion-based reason | |
| Advice specific to **fixed income**, not generic | |

**If ≥2 No:** Revise memo before transfer.

#### Transfer

Apply the **same four criteria** to your budget or a household you know. **120–160 words:**

- Which strategy rises in priority?  
- Which drops?  
- One constraint Maya's scenario did not include  

---

## 4. Sufficiency analysis (E4)

| Dimension | 38J A4 | Level 3 sufficient (household floor) |
|-----------|--------|--------------------------------------|
| **What to do** | Partial — table + summary | **Yes** — memo structure, rubric, transfer prompts |
| **Why it matters** | Partial — policy criteria | **Yes** — criteria tied to Maya facts; perspectives named |
| **Expert reasoning** | **Yes** — weak/strong (policy) | **Yes** — household exemplar with criteria + trade-off |
| **Independent attempt** | **No** — summary only | **Yes** — owned memo with word band |
| **Check/revise** | **No** | **Yes** — five-row rubric + conditional revision |

**What changed:** 38J proved Evaluate **topology** on the wrong anchor. Minimum sufficiency requires **household judgement artefact + rubric + transfer**, not a longer policy table or session consolidation.

**Distance to 38I-4 A4 benchmark:** Full episode adds richer inquiry (Steps 4–8), strategy menu A–E, reflection depth, closing transition. This excerpt is the **floor** charter requested.

---

# §5 Cross-example findings

| Pattern | E1 | E2 | E3 | E4 | Recurrence |
|---------|----|----|----|----|------------|
| **Core teach block adequate** | Explanation L3 | Worked L4 | Scenario L3 | Criteria L3 | 38J populates **middle** adequately on best functions |
| **Closure absent** | Verification | Verification, transfer | Verification | Memo, verification, transfer | **All four** — dominant thinness |
| **Empty scaffold** | — | — | Empty table | Empty decision table | Present ≠ sufficient |
| **Cognition field ≠ teaching** | — | — | — | Transfer field only | Structural emission gap |
| **Wrong function substitute** | sample_output for classification | — | — | consolidation for judgement | Function present, wrong role |
| **Sufficiency needs modelling** | Contrast tables | Keyed check | Worked analytic row | Weak/strong + memo | Expert reasoning is the differentiator |

### Recurring insight

`EV-38J-AFTER` feels thinner than 38I-4 because:

1. **Verification is Level 0 everywhere** — solo learners never get check/revise.  
2. **Tables and tasks are shells** without partial exemplars, lenses, or scoring guides.  
3. **Evaluate and Understand** stop before **owned performance** (memo, discrimination check).  
4. **Transfer** is named in metadata but not taught on the page.  
5. **Strongest depth (A2 worked example)** shows the pipeline works — gap is **specification**, not architecture.

```text
38J:  teach → do (sometimes) → stop
38I-4: teach → model → guided → do → verify → transfer (archetype-dependent)
```

---

# §6 Implications for 38K-5

Highest instructional return from depth improvements (evidence-led; **not** implementation proposals):

| Rank | Improvement | Examples | Return |
|:----:|-------------|----------|--------|
| **1** | **Universal verification floor (L3)** | E1 checklist, E2 keyed answers, E3 audit, E4 rubric | Closes #1 gap on all activities; enables check/revise dimension |
| **2** | **Evaluate independent judgement + transfer (L3)** | E4 memo + personal apply | Transforms capstone from summary to Evaluate evidence |
| **3** | **Analyse worked pass before matrix (L3)** | E3 one-row walkthrough | Largest perceived teaching gain on A3 for lowest word-count add |
| **4** | **Apply closure pack (process + verify + transfer)** | E2 three sections | Completes best current activity without touching worked example |
| **5** | **Understand discrimination pack (contrast + non-example + verify)** | E1 added sections | Upgrades session foundation; reduces copy reliance on sample_output |
| **6** | **Guided scaffold depth (partial row / scoring guide)** | E3 Savings row, E4 strategy C row | Converts empty tables to guided practice |
| **7** | **Criteria/lens exposition blocks** | E3 four lenses, E4 four criteria (already partial on A4 policy) | Low cost when topic is comparison or judgement |
| **8** | **Substance contract for Evaluate** | E4 household vs 38J policy | Structural prerequisite for depth rules to land |

### 38K-5 should translate (design level only)

- **Depth floors** → which §5/§6 population obligations to extend  
- **Emission gates** → when `checklist`, `transfer_prompt`, `template` must appear  
- **Anti-patterns** → consolidation ≠ judgement; sample_output ≠ verification; empty table ≠ guided practice  

### 38K-5 should not

- Specify prompt wording or pack line edits in this sprint phase  
- Reopen 38-J IFP/GAM-PRES topology  
- Set word-count targets  

---

## Reader test (success criterion)

After E1–E4, a reader should see:

| Question | Answer |
|----------|--------|
| Why does 38J feel thinner than 38I-4? | Closure and scaffold **depth** missing — not episode shape |
| What does "present but thin" look like? | Empty tables, cognition-only transfer, summary instead of memo |
| What does "instructionally sufficient" look like? | Same topics + lenses, modelled row, keyed/rubric check, owned artefact |
| What proved depth is achievable? | A2 worked example — **extend pattern**, do not redesign |

---

## References

- `EV-38J-AFTER-workbook.md`  
- [38K-1](38K-1-baseline-depth-analysis.md) · [38K-2](38K-2-function-depth-model.md) · [38K-3](38K-3-archetype-specific-depth-rules.md)  
- [38I-4 mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)  
- [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

---

**Parent:** [38K observations index](README.md) · **Charter:** 38K-4 · **Next:** 38K-5 Implementation implications

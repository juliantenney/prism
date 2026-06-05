# Slice 38I-4 — Target-State Workbook Mock-Ups (Inflation Anchor)

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Proof-of-concept — pedagogical realisation only; no schema, pack, ACM, or implementation changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38I-4  
**Inputs:** [38I-2 episode model](38I-2-instructional-episode-model.md) · [38I-3 KM/LO mapping](38I-3-km-lo-episode-mapping.md) · [38H-1 H-04 analysis](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-1-workbook-realisation-fidelity-analysis.md)

**Comparator (current state):** [EV-38G-AFTER-dla-learning-activities.json](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-dla-learning-activities.json) · [EV-38G-AFTER-gam.txt](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-gam.txt)  
**KM anchor:** [EV-38H-AFTER-knowledge-model.json](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/EV-38H-AFTER-knowledge-model.json)

**Supplementary artefact (A4 learner-facing episode):** [artefacts/38I-4-a4-evaluate-learner-episode.md](artefacts/38I-4-a4-evaluate-learner-episode.md) — complete deliverable-as-workbook content (~1,300 words), separate from analysis sections below.

---

## Guiding question

> Can the existing architecture support workbook activities that function as **self-contained instructional episodes** rather than sparse task descriptions?

**Short answer:** **Yes — plausibly.** The frozen ACM already provides material types (`worked_example`, `task_cards`, `analysis_table`, `scenario`, `checklist`, `prompt_set`, `consolidation_summary`) and DLA cognition fields (`activity_preamble`, `scaffold_hint_sequence`, `self_explanation_prompt`, etc.) sufficient to **carry** the episode structures below. What is missing today is **DLA choreography** — ordered instructional functions populated from KM substance — not new schema slots.

---

## Session arc note

Target-state titles reflect **pedagogical intent** by cognitive demand. Current `EV-38G-AFTER` activity IDs and titles differ in places (e.g. A2 LO says *Analyze* but CPI calculation is **Apply**; A3 is household *Assess* not types/causes *Analyse*). Mock-ups use the charter titles; comparison notes cite actual comparator artefacts.

**Priority:** **A4 (Evaluate)** — closes inherited gap **H-04**.

---

## Cross-activity comparison (summary)

| Activity | Archetype | Current ~words (learner-facing task + preamble) | Target episode scale | Primary functions added |
|----------|-----------|--------------------------------------------------|----------------------|-------------------------|
| A1 | Understand | ~120 | ~950 | Non-example, misconception challenge, guided → independent classification, verification |
| A2 | Apply | ~110 | ~900 | Criteria exposition, worked thinking fade, guided → independent practice, transfer |
| A3 | Analyse | ~115 | ~1,050 | Analytical criteria, worked analytic model, guided inquiry, justified comparison |
| A4 | Evaluate | ~130 | ~1,350 | Criteria exposition (LO-authored), trade-offs, exemplar contrast, evaluative judgement, transfer **R** |

---

# A4 — Who Gains, Who Loses, and What Should Be Done? *(Priority 1 — Evaluate)*

## 1. Current state summary

**Comparator:** `inflation_wb_04` — *Consolidation Summary: Managing Inflation Effects on Personal Budgets*

The current activity compresses **all four LOs** into a single capstone write task (~130 words of instructions). Materials are `consolidation_summary` + `prompt_set`. The consolidation body on `EV-38G-AFTER` **pre-answers** the task (spoiler model essay — H-01 class, fixed in 38H-2 pack). There is **no** dedicated Evaluate episode: no decision criteria, no strategy comparison, no trade-off exploration, no rubric verification. The Evaluate LO (*"Evaluate various strategies to manage and mitigate the effects of inflation on personal budgets"*) is **mapped** but **not instructionally realised**. Learner support is a reflection prompt list; teaching is absent.

## 2. Episode archetype

**Evaluate** — LO-ARC-01: primary selector = max `cognitive_level` across mapped LOs → **Evaluate** (fourth outcome). Lower LOs (Explain, Analyze, Assess) serve **Activation** only, not episode shape.

## 3. Episode trace

| # | Function | Tag | KM / LO population |
|---|----------|-----|-------------------|
| 1 | Orientation | R | Session arc — from measurement and analysis to **personal decision** |
| 2 | Framing | R | Authentic budget decision under 5% inflation |
| 3 | Activation | C | Recall: inflation, CPI, fixed vs variable income (prior episodes) |
| 4 | Criteria exposition | R | **LO-authored** — four decision dimensions (see mock-up); KM `affects` relationships |
| 5 | Explanation | C | Fixed Income → Household Budgets; Variable Income → Household Budgets |
| 6 | Worked thinking (exemplar judgement) | C | Strong vs weak strategy defence (non-spoiler for learner task) |
| 7 | Guided inquiry | C | Trade-off tensions (short-term pain vs long-term stability) |
| 8 | Guided practice | C | Partial ranking with justification prompts |
| 9 | Independent practice | R | Learner strategy recommendation |
| 10 | Evaluative judgement | R | Compare ≥3 strategies using criteria |
| 11 | Verification | R | Rubric self-audit |
| 12 | Reflection | R | What would change your judgement? |
| 13 | Transfer | R | Apply to learner's own budget context |
| 14 | Transition | O | Session closure |

```text
Orientation → Framing → Activation → Criteria exposition → Explanation
  → Worked thinking (exemplar contrast) → Guided inquiry → Guided practice
  → Independent practice → Evaluative judgement → Verification → Reflection → Transfer
```

**Gap callout (38I-3):** KM has no `criteria`, `perspectives`, or `trade_offs` slots. Criteria exposition is **authored from LO statement + relationships + brief** — demonstrated below.

## 4. Target-state mock-up

---

### Who Gains, Who Loses, and What Should Be Done?

#### Why this episode now

You have learned **what inflation is**, **how it is measured**, and **how it affects households differently**. This episode asks you to do something harder: **decide what to do about it**. Evaluation is not summarising what you learned. It is **choosing among imperfect options** and **defending your choice** when every strategy involves trade-offs.

#### The decision you face

Imagine you manage a household budget similar to many learners in this module:

- **Income:** £2,400/month net (largely **fixed** — salary reviewed annually, not monthly)
- **Essential expenses:** ~£1,900/month (rent, food, utilities, transport)
- **Discretionary:** ~£300/month
- **Savings:** £800 emergency fund; £150/month regular saving until now
- **Context:** Inflation is **5%**; groceries and utilities rising faster than rent; no immediate pay rise confirmed

**Your task:** Recommend a **coherent inflation-management plan** for the next six months — not a single tip, but a prioritised set of choices you would actually make.

#### Who gains and who loses when inflation rises?

Before choosing strategies, name the **distribution** of inflation's effects. Use these lenses:

| Lens | Who tends to gain / hold ground | Who tends to lose |
|------|--------------------------------|-------------------|
| **Income type** | Variable income, index-linked payments | **Fixed income** (pensions, fixed salaries) |
| **Expense profile** | Low essential-share, flexible lifestyle | High essential-share, little discretionary room |
| **Assets vs debt** | Moderate fixed-rate debt (real value erodes) | Cash savers without inflation protection |
| **Bargaining power** | Can renegotiate rent, switch suppliers | Locked contracts, essential goods with few substitutes |

**Think first:** In the scenario above, which lenses hurt this household most? Write two sentences before continuing.

*KM basis: Fixed Income / Variable Income → affects → Household Budgets; Inflation concept definition.*

#### Decision criteria (use these to evaluate strategies)

Because the knowledge model does not list ready-made rubric rows, this episode makes criteria **explicit**. Any strategy you recommend should be judged on:

1. **Purchasing-power protection** — Does it slow or offset real income erosion?
2. **Essential-expense resilience** — Does it protect rent, food, utilities, and transport first?
3. **Feasibility** — Can a household without specialist finance knowledge do this in six months?
4. **Downside risk** — What could go wrong if the strategy fails or inflation worsens?

Keep these four criteria **visible** throughout. Evaluation collapses into opinion when criteria disappear.

#### Strategy menu (do not rank yet)

Consider these common responses to inflation:

| Strategy | What it involves |
|----------|------------------|
| **A. Tighten discretionary spending** | Cut non-essentials; redirect to essentials and small buffer |
| **B. Renegotiate or switch** | Rent discussion, utility tariff change, brand switching |
| **C. Build essential-only buffer** | Pause general saving; short-term cushion for price spikes |
| **D. Seek income adjustment** | Pay review, overtime, secondary income, benefits check |
| **E. Long-term inflation hedging** | Index-linked savings, investment shift (higher complexity/risk) |

#### Exemplar contrast: weak vs strong judgement

Read both responses. Neither is "the answer" — your context may differ. Notice **how** each uses criteria.

**Weak judgement (typical thin capstone):**  
*"Inflation is bad. I would save more and spend less. People should budget better."*  
→ No trade-offs. No criteria. No acknowledgement of fixed income. Reads like a slogan.

**Stronger judgement:**  
*"With fixed monthly income and groceries/utilities rising fastest, I would prioritise **essential-expense resilience** first. I'd pause the £150 general saving for three months and redirect £90 to a utilities/food buffer (**C**, partial). In parallel I'd request a structured pay review citing CPI-linked cost pressure (**D**) — feasibility is moderate but high upside. I'd cut discretionary subscriptions (**A**) but avoid aggressive long-term hedging (**E**) because downside risk and knowledge requirements are high for this household. Trade-off: short-term saving goals delay; gain: lower risk of essential shortfall if inflation persists."*  
→ Criteria cited. Trade-offs named. Recommendation is defensible, not complete.

#### Guided inquiry — explore the tensions

Work through these prompts. Write brief notes.

1. If you **only** cut discretionary spending (**A**), what happens when essentials still rise 6–7%?
2. If you **only** chase higher income (**D**), what happens if negotiation fails for four months?
3. Why might **E** score well on purchasing-power protection but poorly on feasibility and downside risk **for this scenario**?
4. Which criteria conflict? (e.g. building a buffer vs maintaining saving habits)

#### Guided practice — partial evaluation

Complete this table for **three** strategies you take seriously (not all five):

| Strategy | Purchasing-power protection (1–3) | Essential resilience (1–3) | Feasibility (1–3) | Downside risk (1=low, 3=high) | One-sentence justification |
|----------|-----------------------------------|---------------------------|-------------------|-------------------------------|----------------------------|
| | | | | | |
| | | | | | |
| | | | | | |

**Scoring guide:** 3 = strong for that criterion in **this** scenario; 1 = weak. Justifications must cite a **concrete feature** of the scenario (fixed income, £800 buffer, etc.).

#### Independent practice — your recommendation

Write **200–250 words** recommending a **prioritised plan** (primary + secondary strategy). Structure:

1. **Opening:** One sentence — what matters most for this household and why (criteria-led).
2. **Recommendation:** Name strategies; explain priority order.
3. **Trade-offs:** What you are giving up; why the trade-off is acceptable.
4. **Risk:** One thing that could change your plan.

Do **not** copy the strong exemplar. Apply the criteria to **your** reasoning.

#### Evaluative judgement checkpoint

Before verification, answer honestly:

- Did you **compare** at least two strategies, or only advocate one?
- Did you use **all four criteria**, or drift into general advice?
- Would a reader understand **why** your second-choice strategy was rejected?

#### Verification — rubric self-audit

| Checkpoint | Yes / Partial / No |
|------------|-------------------|
| Recommendation cites ≥2 criteria by name or clear paraphrase | |
| At least one trade-off is explicit | |
| Reasoning distinguishes this household (fixed income, expense mix) from a generic "everyone" | |
| Strategy rejected with criterion-based reason (not "bad idea") | |
| Transfer section completed (below) | |

**If ≥2 "No":** Revise recommendation before continuing.

#### Reflection

1. Which criterion was hardest to apply fairly?
2. What evidence would make you **reverse** your primary strategy?
3. How is **evaluate** different from **analyse** in this episode? (One sentence — analyse mapped who loses; evaluate chose what to do.)

#### Transfer — your context

Apply the **same four criteria** to your own budget or a household you know well (real or realistic composite). Write **100–150 words**:

- Which strategy would rise in priority?
- Which would drop?
- One constraint in your context that the scenario did not include

This is **required** for Evaluate episodes (38I-2 §5.3 Transfer **R**).

#### Session closure

You have moved from **measuring** inflation to **judging** responses under uncertainty. The session does not end with "inflation is important." It ends with a **defended plan** you could revisit when new evidence arrives.

---

## 5. Comparison notes

| Added function | Why | Current gap |
|----------------|-----|-------------|
| Criteria exposition | Evaluate without criteria = opinion | Absent — only open reflection prompts |
| Who gains / loses framing | Grounds judgement in distributional analysis | Buried in prior activity; not linked to decision |
| Exemplar contrast | Models **quality** of judgement without spoiler answer | `consolidation_summary` gave full spoiler essay |
| Guided inquiry + partial ranking | Scaffolds trade-off thinking | No intermediate steps |
| Evaluative judgement | Distinct from summary/synthesis | Capstone conflated all LOs into one paragraph task |
| Rubric verification | Self-audit without tutor | Checklist absent |
| Transfer **R** | LO requires personal budget application | Single sentence `transfer_or_application_task` |

## Evaluation questions — A4

| Question | Assessment |
|----------|------------|
| Does the episode **teach** rather than merely instruct? | **Yes** — teaches criteria, distributional lenses, exemplar quality, trade-off method |
| Is the learner supported without tutor intervention? | **Yes** — guided table, rubric, exemplar contrast, scenario constants |
| Are instructional functions visible? | **Yes** — trace maps 1:1 to sections |
| Does the episode match cognitive demand? | **Yes** — Evaluate: criteria stay visible; learner owns recommendation |
| Could current architecture plausibly carry this? | **Yes** — `scenario` + `prompt_set` + `checklist` + `consolidation_summary` (learner-write template) + cognition fields; no new schema |

---

# A1 — What Counts as Inflation? (Understand)

## 1. Current state summary

**Comparator:** `inflation_wb_01` — *Understanding Inflation: Worked Example and Sample Output*

~120 words of instructions direct the learner to study a worked example and produce an explanation. GAM materials teach **demand-pull and cost-push** in the worked example (~200 words), but the **activity shell** is thin: read → write → checklist. `sample_output` risks answer-copying. Misconception support is a single `support_note` line. No non-example, no guided classification, no explicit verification section. Preamble orients; it does not teach discrimination.

## 2. Episode archetype

**Understand** — LO: *Explain the concept of inflation and its causes within an economic context.* Verb **Explain** → Understand (LO-ARC-02). Misconception challenge → **R** (KM lists CPI/GDP deflator misconception; grouping *Inflation Measurement Methods*).

## 3. Episode trace

```text
Orientation (R) → Framing (C) → Activation (C) → Explanation (R) → Example (R)
  → Non-example (C) → Misconception challenge (R†) → Guided classification (C)
  → Independent classification (R) → Verification (R) → Reflection (C) → Transition (C)
```

**KM reads:** `Inflation` concept; `Consumer Price Index (CPI)`; `GDP Deflator`; grouping *Inflation Measurement Methods*; relationship `contrasts_with`; misconception *CPI and GDP Deflator Measure the Same Inflation*.

## 4. Target-state mock-up

---

### What Counts as Inflation?

#### Orientation

This session begins with a precise question: **What counts as inflation — and what only looks like it?** Later you will measure inflation and judge household responses. If your mental model is loose here, everything downstream wobbles.

#### Framing

Economists, journalists, and households all talk about "prices going up." Not every price rise is inflation. This episode builds **discrimination** — telling general inflation apart from nearby ideas.

#### Activation

Before reading on, write one sentence: *When have you noticed prices changing in the past year?*  
Then answer: *Did everything seem to rise, or mainly one type of product?*  
Keep your answer. You will revisit it.

#### Explanation — the core idea

**Inflation** is the **general, sustained increase** in the price level of goods and services over time. It means money's **purchasing power** falls: the same amount buys less on average.

Three features matter:

1. **General** — many prices move in the same broad direction.
2. **Over time** — a persistent pattern, not a one-day sale.
3. **Purchasing power** — the economic consequence that matters to households.

*KM: Inflation definition.*

#### Example — inflation in plain terms

Suppose a typical basket of household goods that cost £100 last year costs £105 this year, and the pattern appears across food, transport, and services — not one luxury item. Average prices rose **5%**. That is inflation in everyday terms.

#### Non-example — what inflation is not

| Situation | Inflation? | Why |
|-----------|------------|-----|
| Avocados double after a frost | **No** (alone) | Single-product shock, not general price level |
| Your rent rises but other prices stable | **Partial / complicated** | One large expense hurts; economists still ask whether **many** prices rose |
| Everything you buy is ~5% dearer for two years | **Yes** | General, sustained pattern |

**Rule of thumb:** Ask *"Is it the whole price level moving, or one corner of my spending?"*

#### Misconception challenge — "CPI and GDP deflator are the same thing"

Many learners assume all inflation measures tell the same story. They do not.

| | **CPI** | **GDP deflator** |
|---|---------|------------------|
| **Basket** | Fixed set of **consumer** goods/services | **All domestically produced** goods/services; basket **changes** with production |
| **Typical use** | Cost of living, household-facing | Whole-economy price level |
| **Can diverge?** | **Yes** — e.g. when import prices or production mix shifts |

*KM: concepts, grouping, `contrasts_with`, misconception.*

**Reconciliation prompt:** A headline says *"CPI inflation 5%."* A colleague says *"GDP deflator shows a different picture."* Explain in **two sentences** why both can be valid without contradiction.

#### Guided classification

Label each statement **Inflation** / **Not inflation** / **Needs more information**. Brief reason required.

1. Petrol prices rise 20% after a supply shock; most other prices unchanged.  
2. Wages and prices creep up together for three years across most sectors.  
3. A shop raises prices because its rent increased.  
4. The same £50 buys fewer groceries **and** fewer services than last year.

*Hints:* (1) Not alone — not general. (2) Inflation pattern. (3) Needs more — one seller vs economy-wide. (4) Inflation symptom.

#### Independent classification

Write **80–100 words** defining inflation in your own words and giving **one example** and **one non-example**. Use the phrase **purchasing power** correctly.

#### Verification

Self-check — mark each **Yes / Not yet**:

- [ ] Defined inflation as **general** price level rise, not single-product rise  
- [ ] Explained purchasing power consequence  
- [ ] Distinguished CPI from GDP deflator on **basket** difference  
- [ ] Non-example is genuinely different from your example  

**Repair path:** If "Not yet" on CPI/deflator, reread misconception challenge table only — then rewrite one sentence.

#### Reflection

Why do policymakers care whether inflation is **general** rather than a single price spike? (2–3 sentences.)

#### Transition

Next you will **apply** a measurement procedure — calculating inflation from CPI data — using the definition you stabilised here.

---

## 5. Comparison notes

| Added function | Why |
|----------------|-----|
| Non-example table | Confusable cases (38I-2 Understand **C** → **R** for this topic) |
| Misconception challenge | KM lists CPI/GDP deflator misconception — obligation upgrade |
| Guided → independent classification | Evidence of discrimination, not only prose explanation |
| Verification with repair path | 38C retrieval minimum; solo learner self-repair |
| Transition | Links to Apply episode |

**Removed risk:** `sample_output` as copy source — target state uses classification + verification instead of model paragraph replication.

## Evaluation questions — A1

| Question | Assessment |
|----------|------------|
| Teaches vs instructs? | **Yes** — teaches definition, boundaries, measurement distinction |
| Solo support? | **Yes** — hints, repair path, tables |
| Functions visible? | **Yes** |
| Matches cognitive demand? | **Yes** — discrimination-focused Understand |
| Architecture plausible? | **Yes** — `worked_example` + `task_cards` + cognition fields |

---

# A2 — Measuring Inflation in Practice (Apply)

## 1. Current state summary

**Comparator:** `inflation_wb_02` — *Analyzing Inflation Trends Using Consumer Price Index (CPI) Table*

Instructions (~110 words) ask learners to complete an empty CPI table: calculate rates, classify trends, interpret. LO verb is **Analyze**, but the core skill is **procedure execution** (Apply). No worked thinking visible in activity shell — formula appears only in `prompt_set`. No guided practice row; no fade sequence. Trend **interpretation** bleeds into Analyse; **measurement** procedure is under-taught.

**Target-state correction:** Treat as **Apply** episode per 38I-3 P3 (CPI calculation + fade).

## 2. Episode archetype

**Apply** — primary purpose: execute **Calculating CPI Inflation** process (KM `processes.steps`).

## 3. Episode trace

```text
Orientation (R) → Framing (R) → Activation (O) → Criteria exposition (R) → Worked thinking (R)
  → Guided practice (R) → Independent practice (R) → Verification (R) → Reflection (C) → Transfer (C) → Transition (C)
```

**KM reads:** `Consumer Price Index (CPI)`; `Calculating CPI Inflation` process (3 steps); relationship CPI `measures` Inflation.

## 4. Target-state mock-up

---

### Measuring Inflation in Practice

#### Orientation

You know **what** inflation means. This episode teaches **how** we measure it in practice using the **Consumer Price Index (CPI)** — the same measure you will later interpret in context.

#### Framing — the measurement situation

Statisticians track a **fixed basket** of goods and services a typical household buys. By comparing the basket's cost across years, they estimate how much the price level rose. You will complete the core calculation yourself.

#### Activation (optional)

In one sentence, recall: *What does CPI measure?* (Check: consumer cost of living, not all GDP output.)

#### Criteria exposition — the procedure rules

**Calculating year-on-year CPI inflation rate:**

1. Identify CPI for **current year** and **previous year**.
2. Apply:  
   **Inflation rate (%) = ((CPI_current − CPI_previous) / CPI_previous) × 100**
3. Round to **one decimal place** unless told otherwise.
4. **Base year** has no prior-year rate — mark as "n/a" or "base year."

*KM: process steps 1–3.*

**Common errors to avoid:**

- Dividing by current year instead of previous  
- Treating CPI level (108) as the inflation rate  
- Calling one year's blip a "trend" without looking at neighbours

#### Worked thinking — expert run (Year 2018 → 2019)

**Given:**

| Year | CPI |
|------|-----|
| 2018 | 100 |
| 2019 | 103 |

**Thinking aloud:**

- Previous year = 2018 → CPI = 100. Current = 2019 → CPI = 103.  
- Change = 103 − 100 = 3.  
- Rate = (3 / 100) × 100 = **3.0%**.  
- Interpretation: average consumer basket costs **3% more** than base year.  
- I do **not** conclude "inflation will stay 3%" — one calculation is one observation.

#### Guided practice — complete with hints

Fill **2019 → 2020** only. CPI: 2019 = 103, 2020 = 105.

| Step | Your work | Hint if stuck |
|------|-----------|---------------|
| Change | | 105 − 103 = ? |
| Rate | | Divide change by **103**, not 105 |
| % | | × 100 |

**Expected:** 1.9% (to one decimal).

#### Independent practice — full table

Complete:

| Year | CPI | Annual inflation rate (%) | Notes |
|------|-----|----------------------------|-------|
| 2018 | 100 | n/a (base) | |
| 2019 | 103 | | |
| 2020 | 105 | | |
| 2021 | 108 | | |
| 2022 | 110 | | |

**Answers for verification:** 3.0%; 1.9%; 2.9%; 1.9%.

#### Brief interpretation (Apply boundary)

For **Apply**, interpretation stays **procedural**: each rate answers *"By what percent did the measured basket rise compared to last year?"*  
Do **not** yet write multi-paragraph economic analysis — that is **Analyse** in A3.

#### Verification

| Check | Pass? |
|-------|-------|
| All non-base years calculated | |
| Denominator is always **previous year CPI** | |
| Rates match keyed answers ±0.1% | |
| Base year not forced into formula | |

**Revision:** If 2021 wrong, rework one row using worked thinking steps only.

#### Reflection

Which step did you almost skip mentally? Why does the denominator matter?

#### Transfer

New data: 2022 CPI = 112 (not 110). **Calculate only** — what is 2022 inflation rate?

#### Transition

You can now **produce** inflation measurements. Next you will **analyse** what different inflation **types and causes** mean for the economy.

---

## 5. Comparison notes

| Added function | Why |
|----------------|-----|
| Criteria exposition before practice | Apply **R** — method explicit |
| Worked thinking with reasoning visible | 38C R5; not only formula in appendix |
| Guided → independent fade | Defining Apply arc |
| Keyed verification | Solo procedural feedback |
| Transfer (new number) | Same method, new surface |

**Archetype correction:** LO says Analyze; episode is **Apply** — measurement procedure. Trend narrative analysis deferred to A3.

## Evaluation questions — A2

| Question | Assessment |
|----------|------------|
| Teaches vs instructs? | **Yes** — models procedure and errors |
| Solo support? | **Yes** — hints, keyed answers, revision path |
| Functions visible? | **Yes** |
| Matches cognitive demand? | **Yes** — procedure-centred Apply |
| Architecture plausible? | **Yes** — `analysis_table` + `worked_example` + `prompt_set` |

---

# A3 — Types and Causes of Inflation (Analyse)

## 1. Current state summary

**Comparator:** `inflation_wb_03` — *Household Scenarios: Impact of Inflation on Finances*

Current A3 is an **Assess** LO household comparison (~115 words), not types/causes analysis. It has useful materials (`scenario`, `analysis_table`, `checklist`) but **archetype mismatch**: comparative impact analysis, not inflation **typology/causal structure**. GAM scenarios teach context; activity does not teach **analytical lenses** for demand-pull vs cost-push vs imported inflation.

**Target-state:** **Analyse** episode on inflation types/causes — content aligned with A1 GAM causes + KM relationships; uses analytic criteria matrix (38I-3: relationships + groupings **strong** for Analyse).

**KM gap note:** Cause taxonomy not a KM object — populated from LO *Explain…causes* scope + standard economic distinctions already in worked example content.

## 2. Episode archetype

**Analyse** — decompose inflation by **type/cause** using explicit comparison dimensions.

## 3. Episode trace

```text
Orientation (R) → Framing (R) → Activation (C) → Criteria exposition (R) → Explanation (C)
  → Worked thinking (R) → Guided inquiry (C) → Guided practice (R) → Independent practice (R)
  → Verification (R) → Reflection (R) → Transfer (C) → Transition (C)
```

## 4. Target-state mock-up

---

### Types and Causes of Inflation

#### Orientation

Measuring inflation tells you **how much** prices rose. Analysis asks **why** and **what kind** — because causes suggest different household and policy responses.

#### Framing — analytical question

**Analytical question:** *How do major inflation types differ in trigger, transmission, and who feels them first?*

You will not list causes from memory. You will **compare** types using shared dimensions.

#### Activation

List two causes you remember from earlier. Then read on — you may revise.

#### Criteria exposition — comparison dimensions

| Dimension | What to look for |
|-----------|------------------|
| **Primary trigger** | Demand pressure vs cost increase vs external price shock |
| **Typical starting point** | Consumer spending, production costs, import prices |
| **First-hit groups** | Who feels it in month 1–6 |
| **Policy lever (broad)** | Demand management vs supply support vs exchange rate/energy |

#### Explanation — three types to compare

**Demand-pull:** Aggregate demand grows faster than economy can supply → broad upward pressure on prices.  
**Cost-push:** Production costs rise (wages, energy, inputs) → firms pass costs into prices.  
**Imported / external:** World prices or exchange rate moves raise domestic prices of imports.

*Population: A1 worked content + Inflation concept; not a new KM slot.*

#### Worked thinking — one mini-analysis

**Case sketch:** Energy prices surge abroad; domestic petrol and food import costs rise; wages not yet adjusted.

Walkthrough:

1. **Trigger:** External cost shock → imported component strong.  
2. **Transmission:** Import prices → consumer goods → expectations may spread.  
3. **First-hit:** Households with high energy/food share; fixed incomes.  
4. **Not yet demand-pull:** Consumers did not suddenly get richer — supply-side pressure dominates.

#### Guided inquiry

For **demand-pull** and **cost-push** only:

- Which dimension is hardest to observe in real time? Why?  
- Can both types coexist? What would evidence look like?

#### Guided practice — partial matrix

Complete **Primary trigger** and **First-hit groups** rows only:

| Type | Primary trigger | First-hit groups |
|------|-----------------|------------------|
| Demand-pull | | |
| Cost-push | | |
| Imported | | |

**Guide:** Demand-pull → spending/investment boom; Cost-push → input costs; Imported → world prices / currency.

#### Independent practice — full analysis

Complete the matrix and add **120–150 words** justification:

| Type | Primary trigger | First-hit groups | Policy lever |
|------|-----------------|------------------|--------------|
| Demand-pull | | | |
| Cost-push | | | |
| Imported | | | |

**Justification must:** cite **two relationships** from the session model (e.g. inflation erodes purchasing power; fixed income households affected differently).

#### Verification

| Audit question | Yes / No |
|----------------|----------|
| Each type differs on ≥2 dimensions (not copy-paste) | |
| Justification cites **evidence**, not opinion only | |
| Imported inflation not labelled demand-pull | |

#### Reflection

Why is **analyse** insufficient for choosing a household strategy? (Bridge to Evaluate — one paragraph.)

#### Transfer

Pick a recent news headline about rising prices. Which type(s) might it illustrate? One dimension of evidence.

#### Transition

Next: **who gains and loses** in concrete households — and **what you should do** given trade-offs.

---

## 5. Comparison notes

| Added function | Why |
|----------------|-----|
| Criteria exposition (analytic lenses) | Prevents cause-listing without structure |
| Worked analytic walkthrough | Models reasoning pattern, not definition |
| Guided → full matrix | Analyse scaffold fade |
| Reflection bridge to Evaluate | Session arc cohesion |

**Comparator delta:** `EV-38G` A3 household content **migrates** to A4 Activation/framing (who gains/loses); A3 target refocuses on typology/causes per charter title.

## Evaluation questions — A3

| Question | Assessment |
|----------|------------|
| Teaches vs instructs? | **Yes** — teaches analytic dimensions and worked pass |
| Solo support? | **Yes** — partial matrix, audit |
| Functions visible? | **Yes** |
| Matches cognitive demand? | **Yes** — structured comparison + justification |
| Architecture plausible? | **Yes** — `analysis_table` + `prompt_set` + `checklist` |

---

# Synthesis — What changed between activity instructions and instructional episodes?

## Instructional density

| Dimension | Current (`EV-38G-AFTER`) | Target state |
|-----------|--------------------------|--------------|
| **Words learner reads** | ~50–150 instructions; teaching buried in materials or absent | **800–1,350** integrated teaching + practice |
| **Moves per activity** | 2–4 (preamble, task, optional hints) | **10–14** named functions per archetype |
| **Checks** | Occasional checklist mention | Verification **R** every episode; repair paths |
| **Evaluate** | Reflection prompt + spoiler summary | Full criteria → judgement → rubric → transfer |

Current activities **allocate** work. Target episodes **coach** through it.

## Learner support

| Support type | Current | Target |
|--------------|---------|--------|
| **Modelling** | Worked example in A1 only; A2 formula in prompt_set | Worked thinking in Apply/Analyse/Evaluate (exemplar contrast) |
| **Scaffold fade** | Flat `scaffold_hint_sequence` | Guided → independent within episode; session assumes more independence by A4 |
| **Misconception repair** | One `support_note` | Dedicated challenge + reconciliation (A1) |
| **Evaluate criteria** | Absent | LO-authored rubric dimensions (A4) — KM gap explicitly filled |

Self-directed learners no longer depend on **inferring** pedagogy from task verbs.

## Reasoning visibility

| Archetype | Current visibility | Target visibility |
|-----------|-------------------|-------------------|
| Understand | Definition in worked example | Discrimination, non-examples, CPI/deflator repair |
| Apply | Empty table cells | Thinking-aloud calculation + error rules |
| Analyse | Scenario comparison (A3) or trend labels (A2) | Criteria matrix + justified analytic narrative |
| Evaluate | "Reflect on strategies" | Trade-offs, exemplar quality contrast, defended plan |

**H-04 resolution (conceptual):** Evaluate is no longer a **summary label** on a consolidation task. It is a **distinct episode shape** with more instructional moves than Understand, not fewer (38I-2 §1.2).

## Architecture plausibility (no implementation proposals)

The target states **do not require** new KM keys, ACM rows, or renderer features. They require **richer population** of existing surfaces:

| Layer | Already carries |
|-------|-------------------|
| **KM** | Concepts, processes, relationships, misconceptions — read lists in each mock-up |
| **LO** | Archetype selection, Evaluate criteria when KM lacks rubric objects |
| **DLA** | Ordered materials + cognition fields sequenced as episode sections |
| **GAM** | Long-form teaching in `worked_example`, `scenario`, `prompt_set`, tables |
| **Page** | Preservation path proven in 38H — issue is **upstream richness**, not compose loss |

**Session-level scaffold fading** remains a **design** obligation across A1→A4, not a KM field (38I-3 §5.1).

## Implications for future implementation (38I-5 scope only)

1. **DLA must emit function-ordered content**, not LO→task shells — even when LO verb mismatches archetype (A2).  
2. **Evaluate episodes need explicit criteria exposition** in DLA/GAM when KM has no criteria slot.  
3. **`sample_output` / `consolidation_summary` discipline** — exemplar contrast yes; spoiler answers no (38H-2).  
4. **Archetype selection** should follow 38I-3 rules before material selection.  
5. **Minimum verification depth** differs by archetype — checklist (Understand/Apply) vs rubric (Evaluate).

---

## Success criterion assessment

| Criterion | Verdict |
|-----------|---------|
| Subject expert recognises target states as **teaching episodes** | **Pass** — explicit teaching, modelling, checks, not task-only |
| Difference from current workbook **visible** | **Pass** — comparison tables + ~8× content depth |
| No schema / ACM / implementation drift | **Pass** — constraints held |
| A4 closes H-04 **conceptually** | **Pass** — dedicated Evaluate shape with criteria and transfer |

---

## References

- [38I-2 instructional episode model](38I-2-instructional-episode-model.md)
- [38I-3 KM/LO episode mapping](38I-3-km-lo-episode-mapping.md)
- [38H-1 workbook realisation fidelity — H-04](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-1-workbook-realisation-fidelity-analysis.md)
- [EV-38G-AFTER DLA](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-dla-learning-activities.json)
- [EV-38H-AFTER knowledge model](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/EV-38H-AFTER-knowledge-model.json)

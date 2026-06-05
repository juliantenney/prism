# Slice 38K-3 — Archetype-specific depth rules

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Pedagogical modelling only — no pack, code, schema, or harness changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38K-3  
**Inputs:** [38K-1 baseline depth analysis](38K-1-baseline-depth-analysis.md) · [38K-2 function depth model](38K-2-function-depth-model.md) · [38I-2 episode model](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)

**Calibration:** `EV-38J-AFTER-*` · [38I-4 targets](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

---

## §1 Executive summary

[38K-1](38K-1-baseline-depth-analysis.md) found that Sprint 38-J **solved episode structure** but `EV-38J-AFTER` remains far from [38I-4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md): **~65–70%** of the remaining gap is **thin function population**; **~30–35%** is **missing structural emission** (verification, transfer, independent judgement).

[38K-2](38K-2-function-depth-model.md) supplied the cross-archetype vocabulary: a **0–4 depth scale**, **28 function contracts**, and the **instructional sufficiency test** — a function reaches **Level 3** when the solo learner can understand what to do, why it matters, see expert reasoning, attempt independently, and check/revise without tutor support.

**Purpose of 38K-3:** Translate function contracts into **archetype-specific depth floors**:

```text
Function → depth contract   (38K-2)
Archetype → required functions → minimum/preferred depth   (38K-3)
```

**Why depth must vary by archetype**

| Reason | Explanation |
|--------|-------------|
| **Different evidence of learning** | Understand proves **discrimination**; Apply proves **procedure**; Analyse proves **justified structure**; Evaluate proves **defended choice** |
| **Different modelling centre** | Concept instances → process steps → reasoning patterns → quality of judgement |
| **Different closure obligations** | Transfer **R** on Evaluate; verification **R** on all; criteria must **remain visible** on Evaluate but **fade** on Apply |
| **38J evidence** | A2 Apply reached strong depth when specified; A4 Evaluate has shape but not closure depth — archetype rules must encode that asymmetry |

**Headline rules (all archetypes)**

1. **Level 3 is the minimum floor** for every **Required** function in an archetype profile.  
2. **Verification → Level 3 minimum on all four archetypes** — absent on `EV-38J-AFTER`; highest cross-archetype leverage.  
3. **Evaluate carries the most Level 3+ obligations**; **Apply** is the proof archetype (extend A2, do not redesign).  
4. **Present ≠ sufficient** — emission without Level 3 population is still a depth failure.

**38K-3 does not propose implementation.** It is the specification 38K-4 will exemplify and 38K-5 will translate into pack implications.

---

## §2 Archetype depth principles

Depth principles restate what **instructional sufficiency** means per archetype — the performance the episode must make possible.

### Understand

| Principle | Content |
|-----------|---------|
| **Primary sufficiency** | Learner can **discriminate** — say what the concept is, what it is not, and repair at least one confusable error |
| **Modelling centre** | Concept boundaries and relationships — not full procedures |
| **Scaffold arc** | High through explanation/contrast; moderate at first classification; verification before transition |
| **Failure signature** | Definition + write task; `sample_output` copy; no self-check |
| **38J gap** | A1 teaches CPI/GDP contrast (Level 3 exposition) but omits discrimination ladder and verification |

### Apply

| Principle | Content |
|-----------|---------|
| **Primary sufficiency** | Learner can **execute the method** with decreasing help and **confirm** result against rules |
| **Modelling centre** | Visible procedure — steps, intermediate values, interpretation of result |
| **Scaffold arc** | Peak at worked thinking; **fade** guided → independent; verification against keyed method |
| **Failure signature** | Formula in appendix; empty table; no worked run before practice |
| **38J reference** | A2 `worked_example` is the **calibration win** — pipeline reaches strong depth when IFP specifies it |

### Analyse

| Principle | Content |
|-----------|---------|
| **Primary sufficiency** | Learner can **structure a comparison** using explicit lenses and **justify** with scenario or relational evidence |
| **Modelling centre** | Analytic reasoning path — from evidence to classified conclusion |
| **Scaffold arc** | High at criteria + worked analytic pass; partial matrix before full analysis |
| **Failure signature** | Empty grid + open questions; no worked pass; checklist dropped |
| **38J gap** | A3 scenario + inquiry adequate; **worked analytic pass**, **guided analysis depth**, **verification** underdeveloped |

### Evaluate

| Principle | Content |
|-----------|---------|
| **Primary sufficiency** | Learner can **choose among imperfect options**, **defend** using criteria, **name trade-offs**, and **audit** own judgement |
| **Modelling centre** | Quality of judgement — weak vs strong exemplar, not spoiler answer |
| **Scaffold arc** | Criteria and perspectives stay visible; independence at memo; rubric + transfer close episode |
| **Failure signature** | Summary capstone; policy essay; table without memo; synthesis substitutes for judgement |
| **38J gap** | A4 has criteria, perspectives, worked judgement (Level 3) but **independent judgement**, **verification**, **transfer** at Level 0 |

### Sufficiency test weighting by archetype

| Test dimension | Understand | Apply | Analyse | Evaluate |
|----------------|:----------:|:-----:|:-------:|:--------:|
| What to do | High | High | High | High |
| Why it matters | High | Medium | High | **High** |
| Expert reasoning | Medium | **High** | **High** | High (judgement quality) |
| Independent attempt | High | **High** | **High** | **High** |
| Check/revise | **High** | **High** | **High** | **High** |

---

## §3 Understand depth model

**Authority:** [38I-2 §2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-4 A1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · `EV-38J-AFTER` A1

**Legend:** **Req** = Required · **Opt** = Optional · **Min** = minimum depth level · **Pref** = preferred depth level · **—** = not applicable

### Function rules

| Function | Req? | Min | Pref | Rationale |
|----------|:----:|:---:|:----:|-----------|
| **Orientation** | Req | 3 | 3 | Solo learners skip teaching without session-arc link; 38J A1 at Level 1 |
| **Framing** | Opt | 3 | 3 | Valuable when concepts confusable; pose discrimination question |
| **Activation** | Opt | 3 | 3 | On-page retrieval prompt before exposition |
| **Explanation** | Req | 3 | 4 | Core teaching; must include why it matters for episode task |
| **Example** | Req | 3 | 3 | Concrete instance of target idea |
| **Non-example** | Req* | 3 | 4 | *Required when confusable cases exist (CPI/GDP, inflation vs single-price shock) |
| **Conceptual contrast** | Req* | 3 | 4 | *Required with non-example obligation — shared-dimension table |
| **Misconception challenge** | Req* | 3 | 4 | *Required when KM lists misconception; reconciliation prompt mandatory |
| **Guided classification** | Opt | 3 | 4 | First discrimination attempt with hints |
| **Independent classification** | Req | 3 | 3 | Observable evidence — structured write or classification, not generic paragraph only |
| **Verification** | Req | 3 | 4 | ≥4 discrimination checks + repair path; 38J Level 0 |
| **Reflection** | Opt | 3 | 3 | Meaning consolidation |
| **Transfer** | Opt | 3 | 3 | Bounded analogy; dedicated Material if included |
| **Transition** | Opt | 3 | 3 | Bridge to Apply |

\*KM-triggered upgrades per [38I-2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md).

### Complete Understand depth matrix

| Function | Required | Min L | Pref L | EV-38J A1 | Gap to floor |
|----------|:--------:|:-----:|:------:|:---------:|:------------|
| Orientation | Yes | 3 | 3 | 1–2 | Depth |
| Framing | Optional | 3 | 3 | 1–2 | Depth |
| Activation | Optional | 3 | 3 | 1 | Structural + depth |
| Explanation | Yes | 3 | 4 | 3 | At floor |
| Example | Yes | 3 | 3 | 3 | At floor |
| Non-example | Yes* | 3 | 4 | 0 | Structural |
| Conceptual contrast | Yes* | 3 | 4 | 2–3 | Depth (prose only) |
| Misconception challenge | Yes* | 3 | 4 | 2 | Depth |
| Guided classification | Optional | 3 | 4 | 0 | Structural |
| Independent classification | Yes | 3 | 3 | 2 | Depth |
| Verification | Yes | 3 | 4 | 0 | Structural |
| Reflection | Optional | 3 | 3 | 0 | Structural |
| Transfer | Optional | 3 | 3 | 1 | Structural |
| Transition | Optional | 3 | 3 | 0 | Structural |

**Understand profile summary:** Minimum **8 Required functions at Level 3** (orientation, explanation, example, non-example*, conceptual contrast*, misconception*, independent classification, verification). `EV-38J-AFTER` A1 meets **3 of 8** at floor; **2 absent structurally**.

---

## §4 Apply depth model

**Authority:** [38I-2 §3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-4 A2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · `EV-38J-AFTER` A2

### Function rules

| Function | Req? | Min | Pref | Rationale |
|----------|:----:|:---:|:----:|-----------|
| **Orientation** | Req | 3 | 3 | Link measurement skill to session arc |
| **Framing** | Req | 3 | 3 | Measurement situation with authentic data context |
| **Process exposition** | Req | 3 | 4 | Explicit procedure rules + common errors **before** practice (38I-4 A2 criteria block) |
| **Worked example** | Req | 3 | 4 | Full expert run — reference calibration below |
| **Worked thinking** | Req | 3 | 4 | Same Material on Apply; think-aloud between steps |
| **Guided practice** | Req | 3 | 4 | Partial step or row before full table |
| **Independent practice** | Req | 3 | 3 | Complete performance with reduced scaffold |
| **Verification** | Req | 3 | 4 | Keyed answers or checklist + revision instruction |
| **Transfer** | Opt | 3 | 3 | Same method, new numbers — dedicated `transfer_prompt` |
| **Reflection** | Opt | 3 | 3 | Metacognitive on hardest step |
| **Transition** | Opt | 3 | 3 | Preview Analyse use of skill |

*Process exposition* maps to **criteria exposition** in [38K-2](38K-2-function-depth-model.md) — procedure rules, not decision criteria.

### A2 inflation calibration — worked example Level 3 or 4?

**`EV-38J-AFTER` A2-M1 assessed against [38K-2 §3–§4](38K-2-function-depth-model.md):**

| Criterion | Met? | Evidence |
|-----------|:----:|----------|
| Sufficiency 1–2 (what/why) | Yes | Four named steps; basket context stated |
| Sufficiency 3 (expert reasoning) | Yes | Intermediate calculations shown per item |
| Sufficiency 4 (attempt) | Yes | Paired with empty practice table |
| Sufficiency 5 (check/revise) | Partial | No verification Material — learner cannot self-check without keyed section |
| Level 4 rich traits | Partial | Final interpretation sentence present; **no** explicit error catalogue or decision points |

**Verdict:**

| Classification | Level | Reason |
|--------------|-------|--------|
| **Worked example / worked thinking (A2-M1)** | **Level 4** | Exceeds Level 3 floor: ≥4 numbered steps, think-aloud calculations, weighted sum, **interpretation** of 10.0% in context — satisfies rich trait "interpretation of result" for Apply |
| **Process exposition (episode-wide)** | **Level 2** | Rules embedded in worked steps and table instructions only — no standalone error catalogue per 38I-4 A2 |
| **Episode Apply profile** | **Mixed** | Core modelling at Pref L4; closure functions (verification, transfer, explicit process block) below Min L3 |

**Rule for 38K-3:** Apply archetype **minimum Level 3** on worked example; **preferred Level 4** on worked example when procedure is non-trivial. **A2 proves Level 4 is achievable** without schema change. **Preferred Level 4** for full 38I-4 A2 match also requires **process exposition Level 3+** and **verification Level 3+** — which A2 lacks.

### Complete Apply depth matrix

| Function | Required | Min L | Pref L | EV-38J A2 | Gap to floor |
|----------|:--------:|:-----:|:------:|:---------:|:------------|
| Orientation | Yes | 3 | 3 | 1–2 | Depth |
| Framing | Yes | 3 | 3 | 2 | Depth |
| Process exposition | Yes | 3 | 4 | 2 | Depth |
| Worked example | Yes | 3 | 4 | **4** | At pref |
| Worked thinking | Yes | 3 | 4 | **4** | At pref |
| Guided practice | Yes | 3 | 4 | 3 | At min; pref needs partial row |
| Independent practice | Yes | 3 | 3 | 3 | At floor |
| Verification | Yes | 3 | 4 | 0 | Structural |
| Transfer | Optional | 3 | 3 | 0 | Structural |
| Reflection | Optional | 3 | 3 | 0 | Structural |
| Transition | Optional | 3 | 3 | 0 | Structural |

**Apply profile summary:** Minimum **6 Required functions at Level 3** (orientation, framing, process exposition, worked example/thinking, guided practice, independent practice, verification). A2 meets **5 of 7** at or above floor on core teach-do chain; **verification structurally absent**.

---

## §5 Analyse depth model

**Authority:** [38I-2 §4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-4 A3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · `EV-38J-AFTER` A3

**38K-1 finding:** A3 **~295 words** vs ~1,050 target — largest relative shortfall after Evaluate substance mismatch.

### Function rules

| Function | Req? | Min | Pref | Rationale |
|----------|:----:|:---:|:----:|-----------|
| **Orientation** | Req | 3 | 3 | State analytical purpose — not "answer questions" |
| **Framing** | Req | 3 | 3 | Bounded analytical question with stakes |
| **Criteria exposition** | Req | 3 | 4 | Comparison dimensions explicit before matrix |
| **Conceptual contrasts** | Opt | 3 | 3 | When analysis compares types/cases on shared lenses |
| **Explanation** | Opt | 3 | 3 | Relational ideas when non-obvious |
| **Worked analytic pass** | Req | 3 | 4 | Model reasoning from evidence to classified conclusion — **38J Level 0** |
| **Guided inquiry** | Opt | 3 | 3 | Productive uncertainty bridge |
| **Guided analysis** | Req | 3 | 4 | Partial row or exemplar cell + justification column |
| **Independent analysis** | Req | 3 | 3 | Full matrix + every row justified with scenario fact |
| **Verification** | Req | 3 | 4 | Logic/evidence checklist; 38G had checklist — 38J regression |
| **Reflection** | Req | 3 | 3 | Why analysis holds |
| **Transfer** | Opt | 3 | 3 | New case, same criteria frame |
| **Transition** | Opt | 3 | 3 | Link to Evaluate if follows |

### Underdeveloped functions on `EV-38J-AFTER` A3

| Function | 38J level | Priority fix |
|----------|-----------|--------------|
| **Worked analytic pass** | 0 | **Structural** — highest Analyse gap |
| **Verification** | 0 | **Structural** — regression vs 38G |
| **Criteria exposition** | 2 | **Depth** — impact categories only, no lens table |
| **Guided analysis** | 2 | **Depth** — empty grid, no partial exemplar |
| **Independent analysis** | 2 | **Depth** — implied but not scaffolded to justification standard |
| **Conceptual contrasts** | 2 | **Depth** — scenario implies contrast, not dimension-led |
| **Worked thinking** | 0 | Same as worked analytic pass |

**Adequate on 38J:** Scenario (Level 3), guided inquiry prompt_set (Level 3).

### Complete Analyse depth matrix

| Function | Required | Min L | Pref L | EV-38J A3 | Gap to floor |
|----------|:--------:|:-----:|:------:|:---------:|:------------|
| Orientation | Yes | 3 | 3 | 1–2 | Depth |
| Framing | Yes | 3 | 3 | 3 | At floor |
| Criteria exposition | Yes | 3 | 4 | 2 | Depth |
| Conceptual contrasts | Optional | 3 | 3 | 2 | Depth |
| Worked analytic pass | Yes | 3 | 4 | 0 | Structural |
| Guided inquiry | Optional | 3 | 3 | 3 | At floor |
| Guided analysis | Yes | 3 | 4 | 2 | Depth |
| Independent analysis | Yes | 3 | 3 | 2 | Depth |
| Verification | Yes | 3 | 4 | 0 | Structural |
| Reflection | Yes | 3 | 3 | 0 | Structural |
| Transfer | Optional | 3 | 3 | 0 | Structural |
| Transition | Optional | 3 | 3 | 0 | Structural |

**Analyse profile summary:** Minimum **7 Required functions at Level 3**. A3 meets **2 of 7** at floor (framing, guided inquiry); **3 structurally absent**.

---

## §6 Evaluate depth model

**Authority:** [38I-2 §5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) · `EV-38J-AFTER` A4

### Function rules

| Function | Req? | Min | Pref | Rationale |
|----------|:----:|:---:|:----:|-----------|
| **Orientation** | Req | 3 | 3 | Distinguish evaluation from summary |
| **Framing** | Req | 3 | 4 | Authentic decision with constants (income, inflation %, horizon) |
| **Activation** | Opt | 3 | 3 | Integrate prior episode concepts |
| **Perspective building** | Req | 3 | 4 | Who gains/loses or competing priorities before judgement |
| **Criteria exposition** | Req | 3 | 4 | ≥3 decision dimensions with "why here" — must stay visible |
| **Trade-off analysis** | Req | 3 | 4 | Named tensions; criteria may conflict |
| **Worked judgement** | Req | 3 | 4 | Weak vs strong; anti-spoiler; criteria cited in strong |
| **Guided inquiry** | Opt | 3 | 3 | Explore trade-offs before table |
| **Guided judgement** | Req | 3 | 4 | Partial ranking + scoring guide + justification column |
| **Independent judgement** | Req | 3 | 4 | Structured decision memo — **primary Evaluate evidence** |
| **Evaluative judgement** | Req | 3 | 3 | Compare ≥2 options on ≥2 criteria before memo |
| **Verification** | Req | 3 | 4 | Rubric self-audit + conditional revision |
| **Reflection** | Req | 3 | 4 | What would change your judgement? |
| **Transfer** | Req | 3 | 4 | Own-context apply with criterion-level prompts |
| **Synthesis** | Opt | 3 | 3 | Session integration — **must not replace** independent judgement |
| **Transition** | Opt | 3 | 3 | Session closure |

### Calibration: 38I-4 A4 vs `EV-38J-AFTER` A4

| Function | 38I-4 A4 (target) | EV-38J A4 | Min floor met? |
|----------|-------------------|-----------|:--------------:|
| Perspective building | Household A/B + lenses | Policy scenarios | Shape yes; substance contract no |
| Criteria exposition | 4 household criteria | 4 policy criteria | **Yes** (L3) |
| Trade-off analysis | Guided inquiry §4 tensions | Implicit in modelling_note | **No** (L2) |
| Worked judgement | Weak slogan vs criteria-led | Weak vs strong policy | **Yes** (L3) |
| Guided judgement | Partial table + scoring guide | Empty decision table | **No** (L2) |
| Independent judgement | 220–280 word memo | Absent (consolidation only) | **No** (L0) |
| Verification | 5-item rubric | Absent | **No** (L0) |
| Transfer | 120–160 word own context | Cognition field only | **No** (L0–1) |
| Reflection | Judgement-focused 3 prompts | Buried in consolidation | **No** (L2) |

### Minimum depth floor for genuine Evaluate episodes

An Evaluate episode is **instructionally sufficient** only when **all** of the following reach **Level 3+**:

1. **Criteria exposition** — learner can name and apply dimensions  
2. **Perspective building** — learner sees distributional or stakeholder difference  
3. **Worked judgement** — learner has seen quality contrast without spoiler answer  
4. **Guided judgement** — learner completes partial criteria-led comparison  
5. **Independent judgement** — learner produces **owned** defended recommendation  
6. **Verification** — learner self-audits against rubric  
7. **Transfer** — learner applies criteria to personal/authentic context  

**Trade-off analysis** and **reflection** at Level 3+ **strongly recommended**; omission collapses Evaluate toward Analyse or summary.

**38J A4:** **3 of 9** core functions at floor (criteria, perspectives, worked judgement). **Genuine Evaluate not yet achieved** despite episode shape.

### Complete Evaluate depth matrix

| Function | Required | Min L | Pref L | EV-38J A4 | Gap to floor |
|----------|:--------:|:-----:|:------:|:---------:|:------------|
| Orientation | Yes | 3 | 3 | 1–2 | Depth |
| Framing | Yes | 3 | 4 | 2 | Depth |
| Perspective building | Yes | 3 | 4 | 3 | At min |
| Criteria exposition | Yes | 3 | 4 | 3 | At min |
| Trade-off analysis | Yes | 3 | 4 | 2 | Depth |
| Worked judgement | Yes | 3 | 4 | 3 | At min |
| Guided judgement | Yes | 3 | 4 | 2 | Depth |
| Independent judgement | Yes | 3 | 4 | 0 | Structural |
| Evaluative judgement | Yes | 3 | 3 | 2 | Depth |
| Verification | Yes | 3 | 4 | 0 | Structural |
| Reflection | Yes | 3 | 4 | 2 | Depth |
| Transfer | Yes | 3 | 4 | 0–1 | Structural |
| Synthesis | Optional | 3 | 3 | 3* | *Must not substitute for judgement |

**Evaluate profile summary:** Minimum **10 Required functions at Level 3** (highest count of any archetype). `EV-38J-AFTER` A4 meets **3 of 10** at floor.

---

## §7 Cross-archetype comparison

**Legend:** **—** = not needed · **Opt** = optional (Level 3 if present) · **L3** = Level 3 required · **L4** = Level 4 required (preferred richness)

| Function | Understand | Apply | Analyse | Evaluate |
|----------|:----------:|:-----:|:-------:|:--------:|
| Orientation | L3 | L3 | L3 | L3 |
| Framing | Opt | L3 | L3 | L3 |
| Activation | Opt | Opt | Opt | Opt |
| Explanation | L3 | — | Opt | Opt |
| Example | L3 | — | Opt | — |
| Non-example | L3* | — | Opt | Opt |
| Conceptual contrast | L3* | Opt | L3 | Opt |
| Misconception challenge | L3* | — | Opt | — |
| Process / criteria exposition | Opt | L3 | L3 | L3 |
| Perspective building | — | — | Opt | L3 |
| Trade-off analysis | — | — | Opt | L3 |
| Worked thinking | Opt | L3 | L3 | Opt |
| Worked example | Opt | L3 (pref L4) | — | — |
| Worked judgement | — | — | — | L3 |
| Guided inquiry | — | — | Opt | Opt |
| Guided practice | Opt | L3 | — | — |
| Guided analysis | — | — | L3 | — |
| Guided judgement | — | — | — | L3 |
| Independent practice | L3 | L3 | — | — |
| Independent analysis | — | — | L3 | — |
| Independent judgement | — | — | — | L3 |
| Evaluative judgement | — | — | Opt | L3 |
| Verification | L3 | L3 | L3 | L3 |
| Reflection | Opt | Opt | L3 | L3 |
| Transfer | Opt | Opt | Opt | L3 |
| Synthesis | — | — | — | Opt |
| Transition | Opt | Opt | Opt | Opt |

\*Required when KM/confusion triggers apply (Understand).

### Where expectations increase across archetypes

| Escalation | Pattern |
|------------|---------|
| **Understand → Apply** | Modelling shifts concept → **procedure**; process exposition and worked example become **L3**; verification remains **L3** |
| **Apply → Analyse** | Performance shifts execution → **justified structure**; worked analytic pass + independent analysis **L3**; reflection becomes **L3** |
| **Analyse → Evaluate** | Output shifts analysis → **defended choice**; perspective, trade-offs, worked judgement, guided/independent judgement, transfer all **L3**; criteria **stay visible** (no fade) |
| **Uniform** | **Verification L3** on all four — only function with unchanged minimum across archetypes |

```text
Understand:  teach discrimination → verify
Apply:       teach procedure → fade → verify → [transfer]
Analyse:     teach lenses → model analysis → justify → verify → reflect
Evaluate:    perspectives → criteria → model quality → partial rank → memo → rubric → transfer → reflect
```

---

## §8 Richness leverage analysis

Archetype upgrades ranked by **perceived workbook richness** gain — evidence from [38K-1](38K-1-baseline-depth-analysis.md) gap analysis and `EV-38J-AFTER` word-count / function inventory.

| Rank | Upgrade | Archetype | Evidence | Expected richness gain |
|:----:|---------|-----------|----------|------------------------|
| **1** | Add **verification** at L3+ | **All** | Level 0 on all activities; 38I-2 **R** everywhere | **High** — solo learner gains feedback loop |
| **2** | Add **independent judgement** memo at L3+ | **Evaluate** | A4 largest gap; consolidation ≠ judgement | **Very high** on capstone |
| **3** | Add **transfer** Material at L3+ | **Evaluate** | 38I-2 Transfer **R**; field-only on 38J | **High** on capstone authenticity |
| **4** | Extend **A2 pattern** (worked L4 + verification + transfer) | **Apply** | A2 proves pipeline; missing only closure | **High** — completes best current activity |
| **5** | Add **worked analytic pass** at L3+ | **Analyse** | A3 Level 0; 38K-1 structural gap | **High** — converts matrix shell to teaching |
| **6** | Deepen **guided judgement** (scoring guide, partial cells) | **Evaluate** | A4 table Level 2 | **Medium–high** |
| **7** | Add **discrimination ladder** (non-example, guided classification) | **Understand** | A1 has exposition, no practice path | **Medium–high** on session foundation |
| **8** | Deepen **criteria exposition** (lens tables) | **Analyse** | A3 impact categories only | **Medium** |
| **9** | Deepen **trade-off inquiry** sequence | **Evaluate** | 38I-4 A4 Steps 1–4; 38J implicit only | **Medium** |
| **10** | Deepen **orientation/framing** to L3 | **All** | Uniformly L1 on 38J | **Low–medium** — polish, not bottleneck |

**Programme insight:** Ranks **1–3** are **closure functions** on **Evaluate** (and verification universal). Rank **4** validates **extend, don't redesign** for Apply. Ranks **5–8** address **middle-episode** depth on Analyse and Understand.

**Single highest ROI sprint focus:** **Evaluate archetype depth rules** + **universal verification floor** — matches 38K-1 dominant bottleneck (thin population) on the functions 38J never populated.

---

## §9 Implications for 38K-4

38K-4 (**Target-state depth examples**) should demonstrate depth rules in **concrete before/after** form — not implementation.

### Priority examples (mandatory)

| # | Example pair | Archetype | Functions to demonstrate | Authority |
|---|--------------|-----------|--------------------------|-----------|
| **E1** | `EV-38J-AFTER` A2 worked_example vs [38I-4 A2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) worked thinking + verification | **Apply** | Worked example L4, process exposition, guided partial, verification, transfer | A2 reference win |
| **E2** | `EV-38J-AFTER` A4 vs [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | **Evaluate** | Perspective, criteria, worked judgement, guided judgement, independent memo, verification, transfer | Programme H-04 benchmark |
| **E3** | `EV-38J-AFTER` A1 vs [38I-4 A1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | **Understand** | Non-example, misconception challenge, guided/independent classification, verification | Discrimination ladder |
| **E4** | `EV-38J-AFTER` A3 vs [38I-4 A3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | **Analyse** | Criteria lenses, worked analytic pass, guided analysis partial row, verification | Largest analytic gap |

### Secondary examples (if space)

| Example | Functions |
|---------|-----------|
| Verification-only cross-cut | Same rubric pattern on Understand checklist vs Evaluate rubric vs Apply keyed answers |
| Structural vs depth boundary | A4 decision table present-but-thin vs independent judgement absent |
| Synthesis vs judgement | A4 consolidation_summary correctly populated but wrong substitute for memo |

### 38K-4 format guidance (design only)

Each example should show:

1. **38J excerpt** — function + assessed level  
2. **38I-4 target excerpt** — same function at Min/Pref level  
3. **Depth rule citation** — pointer to §3–§6 row in this document  
4. **Sufficiency test** — which of the five dimensions failed/passed  

### What 38K-4 must not do

- Pack §5/§6 edits (38K-5)  
- Prompt rewrites  
- Renderer changes  
- Word-count targets as success metrics  

### Handoff question for 38K-4

> For each inflation activity A1–A4, what does **Level 3 sufficient** look like in learner-facing prose for the **top 3 gap functions**?

---

## Archetype depth specification summary

| Archetype | Required L3+ functions (count) | EV-38J inflation met | Critical missing |
|-----------|:--------------------------------:|:--------------------:|------------------|
| **Understand** | 8 | ~3 | Verification, non-example, classification |
| **Apply** | 7 | ~5 | Verification, process exposition block |
| **Analyse** | 7 | ~2 | Worked analytic pass, verification |
| **Evaluate** | 10 | ~3 | Independent judgement, verification, transfer |

**Universal floor:** **Verification Level 3** on every archetype.

**Present → sufficient:** A function moves from **present** (emitted, any level ≥1) to **instructionally sufficient** when it meets the **Min** column for its archetype in §3–§6 and passes all five sufficiency dimensions in [38K-2 §1](38K-2-function-depth-model.md).

---

## References

- [38K-1 baseline depth analysis](38K-1-baseline-depth-analysis.md)  
- [38K-2 function depth model](38K-2-function-depth-model.md)  
- [38I-2 instructional episode model](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)  
- [38I-4 target-state mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)  
- [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)  
- [38J-5 proof run](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)

---

**Parent:** [38K observations index](README.md) · **Charter:** 38K-3 · **Next:** 38K-4 Target-state depth examples

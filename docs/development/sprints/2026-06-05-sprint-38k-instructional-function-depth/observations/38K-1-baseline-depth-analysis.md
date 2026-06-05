# Slice 38K-1 — Baseline depth analysis

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Analysis only — no pack, code, schema, or harness changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38K-1  
**Baselines:** `EV-38J-AFTER-*` ([38J artefacts](../../2026-06-05-sprint-38j-instructional-function-planning/artefacts/))  
**Targets:** [38I-4 mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)  
**Prior evidence:** [38J-5 proof run](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) · [38J-6 closure](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md)

---

## §1 Executive summary

Sprint 38-J **solved episode structure**. `EV-38J-AFTER` produces recognisable instructional episodes on all four activities — segmented learner tasks, function-ordered materials, worked reasoning on A1/A2, and an Evaluate-shaped sequence on A4. GAM-PRES preserved what DLA planned; no collapse detected.

The workbook nevertheless remains **substantially below** [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) target density and instructional sufficiency. Measured learner-facing material bodies (workbook stitch, excluding cognition fields) total roughly **685 / 359 / 295 / 696 words** on A1–A4 against 38I-4 integrated targets of **~950 / ~900 / ~1,050 / ~1,350** — roughly **55–75% short** on A1/A4, **40–60% short** on A2/A3.

**Dominant bottleneck: B — thin function population**, with a significant **structural** secondary layer on Evaluate and verification/transfer functions.

| Gap class | Share of remaining distance to 38I-4 | Evidence |
|-----------|----------------------------------------|----------|
| **Population-depth** | **~65–70%** | Present functions carry teaching but lack discrimination practice, analytic modelling, exemplar partial cells, rubric checkpoints, and independent judgement scaffolds |
| **Structural** | **~30–35%** | DLA omits material rows for verification checklist, independent memo/template, transfer_prompt, non-example/classification (A1), worked analytic pass (A3) |
| **LO/substance contract** | **Cross-cutting (A4)** | LO4 *Summarize policy communication* drives policy-judgement content instead of household-strategy Evaluate per 38I-4 A4 |

**Core answer to the programme question:**

> What is missing between "episode structure exists" and "episode feels like substantial teaching"?

38-J ensures functions are **planned and emitted in order**. What remains missing is **population richness per function** — each stage must carry enough expert modelling, learner attempt, and self-check for a solo learner to experience teaching. Where functions are absent (verification, transfer, independent judgement), structure cannot compensate. Where functions exist but bodies are cue-level or single-pass exposition, the episode reads as **improved shell**, not **self-contained instruction**.

**38K-2 priority:** Depth floors for **worked thinking**, **guided practice**, **verification**, **independent judgement**, and **transfer** — with Evaluate archetype and A4 household benchmark as the hardest case.

---

## §2 Understand depth analysis (A1 vs 38I-4 Understand target)

**Comparator:** `EV-38J-AFTER` A1 — *Understand Inflation Measurement Methods and Differences*  
**Target:** 38I-4 A1 — *What Counts as Inflation?* (~950 words integrated)

### Present functions

| Function | 38J evidence | Depth |
|----------|--------------|-------|
| Orientation / framing | `activity_preamble` + workbook header | **Shallow** — one sentence, no session-arc link |
| Activation | `prior_knowledge_activation` field | **Shallow** — cognition field only, no on-page prompt |
| Explanation | `text` (A1-M1) — CPI vs GDP deflator + household impacts | **Adequate** — definitions and distinctions present |
| Worked thinking | `worked_example` (A1-M2) — basket, scope, misconceptions | **Adequate** — stepwise with misconception subsection |
| Model answer | `sample_output` (A1-M3) | **Strong** body but **pedagogically risky** — full paragraph model invites copy bias |
| Independent practice | Final write task in `learner_task` | **Shallow** — imperative only, no word band or structure |

### Shallow functions

- **Framing** — does not pose discrimination question ("what counts as inflation?") or link downstream arc.  
- **Misconception challenge** — embedded inside `worked_example` §3, not standalone challenge with reconciliation prompt.  
- **Transfer** — `transfer_or_application_task` cognition field only; no `transfer_prompt` Material.  
- **Reflection / transition** — absent as learner-facing sections.

### Missing functions (vs 38I-4 Understand template)

| Function | 38I-4 target | 38J |
|----------|--------------|-----|
| Non-example table | Confusable cases (single-product vs general inflation) | **Missing** |
| Standalone misconception challenge | CPI/GDP table + reconciliation prompt | **Partial** (subsection only) |
| Guided classification | Label statements with hints | **Missing** |
| Independent classification | 80–100 word discriminated write | **Missing** (generic explanation task instead) |
| Verification checklist | ≥4 self-check items + repair path | **Missing** |

### Density

- **38J A1 material words:** ~685 (3 materials).  
- **38I-4 A1 target:** ~950 integrated across 10+ instructional sections.  
- **Gap type:** ~30% structural (missing sections) + ~70% population (explanation/worked adequate but no practice ladder or verification).

**A1 verdict:** Clear teaching on CPI/GDP contrast exists; episode does not yet **teach discrimination** or **verify understanding** — the defining Understand moves in 38I-4.

---

## §3 Apply depth analysis (A2 vs 38I-4 Apply target)

**Comparator:** `EV-38J-AFTER` A2 — *Apply CPI Inflation Rate Calculation*  
**Target:** 38I-4 A2 — *Measuring Inflation in Practice* (~900 words)

### Present functions

| Function | 38J evidence | Depth |
|----------|--------------|-------|
| Worked example | A2-M1 — 4-step basket calculation with weights | **Strong** — best single function in the run |
| Model calculation | A2-M2 — completed table + 10.0% rate | **Adequate** |
| Guided → independent practice | A2-M3 — learner-empty price/weight columns | **Adequate** — fade present |
| Criteria exposition | Implicit in worked steps | **Partial** — no explicit "procedure rules" or error catalogue |

### Shallow functions

- **Orientation / framing** — preamble states calculation intent; no measurement situation narrative.  
- **Verification** — table completion substitutes for rubric; no keyed self-check table or revision path.  
- **Transfer** — no new-data calculation prompt (38I-4: "2022 CPI = 112 — calculate only").  
- **Reflection** — absent.

### Missing functions

| Function | 38I-4 | 38J |
|----------|-------|-----|
| Criteria exposition (explicit) | Procedure rules + common errors | **Partial** (in worked steps only) |
| Guided practice (partial row) | Single year with hint table | **Missing** — jumps worked → full practice table |
| Verification checklist | Pass/fail rows + revision instruction | **Missing** |
| Transfer task | New CPI value, same method | **Missing** |

### Focus areas (charter request)

| Area | Assessment |
|------|------------|
| **Worked example depth** | **Strong** — addresses 38G/38I A2 failure mode directly |
| **Worked thinking depth** | **Strong** — think-aloud calculations visible |
| **Guided practice depth** | **Partial** — fade exists but no intermediate guided row |
| **Verification depth** | **Missing** — implicit completion only |

**A2 verdict:** **Closest match to 38I-4** of the four activities. Remaining gap is **population-depth** on criteria/errors, guided partial step, verification, and transfer — not missing core Apply arc.

---

## §4 Analyse depth analysis (A3 vs 38I-4 Analyse target)

**Comparator:** `EV-38J-AFTER` A3 — *Analyse Inflation Impact on Household Budgets*  
**Target:** 38I-4 A3 — *Types and Causes of Inflation* (~1,050 words) — **note:** 38I-4 target uses typology/causal Analyse; 38J uses household-comparison Analyse. Comparison is **archetype-depth**, not identical topic.

### Present functions

| Function | 38J evidence | Depth |
|----------|--------------|-------|
| Scenario | A3-M1 — Smith/Lee households + inflation context | **Adequate** — numeric context, category price rises |
| Analysis table | A3-M2 — real income, savings, borrowing + justification column | **Shallow** — empty grid, no partial exemplar row |
| Guided inquiry | A3-M3 — 5 prompt_set questions | **Adequate** — supports comparison reasoning |

### Shallow functions

- **Criteria visibility** — impact categories only; no analytical lenses table (trigger, transmission, first-hit).  
- **Causal reasoning support** — scenario describes effects; does not model *how* analyst walks from evidence to classification.  
- **Comparison support** — table structure present; no guided partial completion.  
- **Verification** — 38G had `checklist`; 38J replaced with `prompt_set` only (**regression** on verification depth).

### Missing functions

| Function | 38I-4 Analyse template | 38J |
|----------|------------------------|-----|
| Criteria exposition | Comparison dimensions table | **Partial** (implicit categories) |
| Worked analytic pass | Mini walkthrough before matrix | **Missing** |
| Guided practice (partial matrix) | Pre-filled exemplar row | **Missing** |
| Independent practice | Full comparison write | **Partial** (table only) |
| Verification checklist | Rubric self-audit | **Missing** (checklist dropped vs 38G) |
| Transfer | Apply lenses to new case | **Missing** |

### Focus areas

| Area | Assessment |
|------|------------|
| **Criteria visibility** | **Partial** |
| **Causal reasoning support** | **Shallow** |
| **Comparison support** | **Partial** — inquiry good, matrix thin |
| **Modelling depth** | **Missing** — no worked analytic thinking |

**A3 verdict:** Scenario + inquiry improved over 38G shell, but **analytic modelling and verification** are the depth bottlenecks. Gap is **both** structural (no worked pass) and population (empty table, no criteria exposition).

---

## §5 Evaluate depth analysis (A4 vs 38I-4 A4 benchmark)

**Comparator:** `EV-38J-AFTER` A4 — *Evaluate Inflation Management Strategies Using Policy Communication Criteria*  
**Target:** [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) (~1,350 words; household Maya scenario)

**Substance mismatch:** 38J A4 evaluates **central bank vs government policy communication**. 38I-4 A4 evaluates **household budget strategies** (Maya, fixed income, strategies A–E). Episode **shape** aligns; **anchor content** does not.

### Function checklist (Present / Partial / Missing)

| Function | 38J | Depth | 38I-4 A4 |
|----------|-----|-------|----------|
| **Perspective building** | **Present** — two policy scenarios | Adequate for policy domain | Present — fixed vs variable households, competing priorities |
| **Criteria exposition** | **Present** — 4 policy communication criteria (A4-M1) | Adequate | Present — 4 household decision criteria |
| **Worked judgement** | **Present** — weak vs strong in `modelling_note` | Adequate | Present — slogan vs criteria-led defence |
| **Guided judgement** | **Present** — `decision_table` empty cells | **Shallow** — no partial exemplar, no scoring guide | Present — partial ranking with scenario-tied guide |
| **Independent judgement** | **Missing** — no memo `template`/`task_cards` | — | Present — 220–280 word decision memo |
| **Verification** | **Missing** — no rubric checklist | — | Present — 5-item self-audit |
| **Transfer** | **Missing** — cognition field only | — | Present — 120–160 word own-context apply |
| **Reflection** | **Partial** — buried in consolidation prompts | Shallow | Present — dedicated reflection prompts |
| **Anti-spoiler** | **Present** — consolidation is scaffold, not model essay | Strong | Present |

### Additional gaps vs 38I-4 A4

- No **who gains / who loses** distributional framing linked to decision.  
- No **strategy menu** (A–E) or trade-off inquiry sequence.  
- `expected_output` bundles **guided table + session consolidation** — blurs Evaluate judgement with session summary.  
- LO4 verb **Summarize** drove capstone synthesis weight over independent Evaluate memo.

**A4 verdict:** Largest **structural** gap in the workbook. Evaluate **form** emerged (38J win); **depth and contract** remain far from 38I-4 A4. Even if policy topic were accepted, independent judgement, verification, and transfer are still absent.

---

## §6 Structural vs population-depth matrix

Every observed gap classified **once** — primary type only.

| # | Gap | Activity | Type |
|---|-----|----------|------|
| G-01 | No verification checklist Material | A1 | **Structural** |
| G-02 | No non-example / classification materials | A1 | **Structural** |
| G-03 | Exposition body thin on discrimination framing | A1 | **Population-depth** |
| G-04 | Misconception only as worked subsection | A1 | **Population-depth** |
| G-05 | `sample_output` full model without copy guard | A1 | **Population-depth** |
| G-06 | No `transfer_prompt` Material | A1 | **Structural** |
| G-07 | No explicit criteria/error exposition block | A2 | **Population-depth** |
| G-08 | No guided partial practice row | A2 | **Structural** |
| G-09 | No verification checklist post-practice | A2 | **Structural** |
| G-10 | No transfer calculation prompt | A2 | **Structural** |
| G-11 | No worked analytic pass Material | A3 | **Structural** |
| G-12 | No analytical criteria lenses table | A3 | **Population-depth** |
| G-13 | Empty analysis table without partial exemplar | A3 | **Population-depth** |
| G-14 | Checklist verification dropped | A3 | **Structural** |
| G-15 | No independent judgement memo scaffold | A4 | **Structural** |
| G-16 | No verification rubric Material | A4 | **Structural** |
| G-17 | No `transfer_prompt` Material | A4 | **Structural** |
| G-18 | Guided decision table without scoring guide | A4 | **Population-depth** |
| G-19 | Consolidation substitutes for Evaluate memo | A4 | **Population-depth** |
| G-20 | Wrong Evaluate substantive anchor (policy vs household) | A4 | **Structural** (LO/harness contract) |
| G-21 | Cognition fields present but not rendered as teaching sections | All | **Population-depth** |
| G-22 | Orientation/framing one-line preambles | All | **Population-depth** |

**Count:** Structural **11** · Population-depth **11** (G-20 counted structural as contract emission).

---

## §7 Function depth inventory

Assessment across `EV-38J-AFTER` DLA plan + GAM bodies + workbook stitch.

| Instructional function | A1 | A2 | A3 | A4 | Overall |
|------------------------|----|----|----|----|---------|
| Orientation | Shallow | Shallow | Shallow | Shallow | **Shallow** |
| Framing | Shallow | Shallow | Shallow | Shallow | **Shallow** |
| Activation | Shallow | Shallow | Shallow | Shallow | **Shallow** |
| Explanation / exposition | Adequate | — | — | Adequate | **Adequate** |
| Criteria exposition | — | Partial | Partial | Adequate | **Partial** |
| Worked example / worked thinking | Adequate | **Strong** | Absent | — | **Mixed** |
| Worked judgement / modelling_note | — | — | — | Adequate | **Adequate** (A4 only) |
| Non-example | Absent | — | — | — | **Absent** |
| Misconception challenge | Shallow | — | — | — | **Shallow** |
| Scenario / perspectives | — | — | Adequate | Adequate | **Adequate** |
| Guided inquiry | — | — | Adequate | — | **Adequate** |
| Guided practice | — | Adequate | Shallow | Shallow | **Partial** |
| Independent practice | Shallow | Adequate | Partial | Absent | **Partial** |
| Evaluative judgement | — | — | — | Partial | **Partial** |
| Verification | Absent | Absent | Absent | Absent | **Absent** |
| Transfer | Absent | Absent | Absent | Absent | **Absent** |
| Reflection | Absent | Absent | Absent | Shallow | **Shallow** |
| Transition | Absent | Absent | Absent | Absent | **Absent** |
| Sample output / model answer | Adequate* | Adequate | — | — | **Adequate** |

\*A1 sample_output strong as text but weak as pedagogy (copy risk).

**Pattern:** Core **teach-then-do** blocks (exposition, worked example, scenario) reach **adequate** on best activities. **Solo-learning closure functions** — verification, transfer, independent judgement, reflection — are **absent or shallow** across the workbook.

---

## §8 Dominant bottleneck

### **B. Thin function population** (with structural secondary layer)

**Choice:** **B**, not **C (both equally)**, because:

1. **38J already emits function sequences** on all four activities — the anti-shell failure mode is largely broken ([38J-5 §6](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)).  
2. **GAM-PRES preserved DLA plans** — gaps trace to **what DLA specified**, not collapse in GAM ([38J-5 §7](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)).  
3. **A2 worked example is Strong** — proof that when IFP specifies depth, the pipeline can carry it without schema change.  
4. Remaining distance to 38I-4 is mostly **bodies too thin** (empty tables, one-line framing, cognition-only transfer) rather than **wrong topology**.

**Structural gaps matter most on A4 and verification/transfer** — without new Material rows, depth rules cannot attach. So 38K-2 must pair **depth floors** with **emission rules** for: `checklist`, `template`/`task_cards`, `transfer_prompt`, and Evaluate independent memo.

**Not D (Other):** Renderer, ACM, and schema are not limiting; workbook stitch carries what GAM produces.

---

## §9 Implications for 38K-2

Priority order for function depth model definition:

| Priority | Function | Rationale |
|----------|----------|-----------|
| **1** | **Verification** | Absent on all activities; 38I-4 treats as **R** on every archetype; 38G A3 regression shows checklist dropped when not mandated |
| **2** | **Independent judgement / practice** | A4 bottleneck; Evaluate archetype cannot complete without learner-owned memo |
| **3** | **Transfer** | Cognition fields without Materials on A1/A4; 38I-2 §5.3 Transfer **R** on Evaluate |
| **4** | **Worked thinking (analytic / evaluative)** | A3 missing analytic pass; A4 modelling_note adequate but needs pairing with independent task |
| **5** | **Guided practice depth** | Partial exemplar cells, scoring guides, hint tables — A3/A4 tables too empty |
| **6** | **Criteria exposition** | Adequate on A4 policy; must generalise + align to LO anchor (household Evaluate) |
| **7** | **Orientation / framing / activation** | Uniformly shallow — session arc and on-page prompts, not pack headers only |
| **8** | **Misconception / non-example / classification** | A1-specific Understand depth |

**Archetype weighting for 38K-3:**

- **Evaluate** — highest depth floor count (perspectives, criteria, worked judgement, guided, independent, verification, transfer).  
- **Apply** — extend A2 win; add verification + transfer floors.  
- **Analyse** — require worked analytic pass + criteria lenses.  
- **Understand** — discrimination ladder + verification over `sample_output` reliance.

**Contract item (parallel track):** Evaluate LO/harness alignment for household A4 — structural for **substance**, not only depth.

---

## References

- `EV-38J-AFTER-workbook.md` · `EV-38J-AFTER-dla-learning-activities.json` · `EV-38J-AFTER-gam.json`  
- [38J-5 inflation proof run](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)  
- [38J-6 sprint closure](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md) §5  
- [38I-4 target-state mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)  
- [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

---

**Parent:** [38K observations index](README.md) · **Charter:** 38K-1 · **Next:** 38K-2 Function depth model

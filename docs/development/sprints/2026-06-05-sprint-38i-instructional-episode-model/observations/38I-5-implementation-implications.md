# Slice 38I-5 — Implementation Implications

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Evidence and implications review — no schema, pack, ACM, code, or renderer changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38I-5  
**Inputs:** [38I-1](38I-1-prior-pedagogical-journey-review.md) · [38I-2](38I-2-instructional-episode-model.md) · [38I-3](38I-3-km-lo-episode-mapping.md) · [38I-4](38I-4-target-state-workbook-mockups.md) · [A4 learner episode](artefacts/38I-4-a4-evaluate-learner-episode.md)  
**Comparator:** [EV-38G-AFTER-dla-learning-activities.json](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-dla-learning-activities.json)

---

## Guiding question

> What is the **smallest set of changes** required for rich instructional episodes to become the **normal output** of the architecture rather than an exceptional authoring exercise?

**Short answer:** Add one **conceptual planning layer** — **Instructional Function Plan** — between LO and DLA, driven by **episode archetype selection** and **KM trigger rules**, with **pack obligations** that forbid LO→task shells and require function-ordered population of existing ACM surfaces. **No schema expansion is required** for first implementation. Reliability gaps concentrate on **Evaluate functions** (criteria, perspectives, trade-offs) and **session-level scaffold fading** — addressable through **prompt guidance and inference rules** before any new KM keys.

---

## Section 1 — Which instructional functions were easiest to realise?

Evidence from target-state A1–A4 ([38I-4](38I-4-target-state-workbook-mockups.md), [A4 episode](artefacts/38I-4-a4-evaluate-learner-episode.md)) and comparator `EV-38G-AFTER`.

### 1.1 Cross-activity classification

| Instructional function | Support level | A1 | A2 | A3 | A4 | Primary evidence |
|------------------------|---------------|:--:|:--:|:--:|:--:|------------------|
| **Orientation** | **Strongly supported** | ✓ | ✓ | ✓ | ✓ | `activity_preamble`; session arc prose; 38G already emits |
| **Activation** | **Strongly supported** | ✓ | ○ | ✓ | ✓ | `prior_knowledge_activation`; prior-episode recall |
| **Worked thinking** | **Strongly supported** | ○ | ✓ | ✓ | ✓ | KM `processes.steps` (A2); analytic walkthrough (A3); exemplar judgement (A4); `worked_example` |
| **Misconception challenge** | **Strongly supported** | ✓ | ○ | ○ | ○ | KM `misconceptions[]` + `contrasts_with` (A1); sparse KM elsewhere |
| **Guided practice** | **Strongly supported** | ✓ | ✓ | ✓ | ✓ | Partial tables, hint columns, `scaffold_hint_sequence`, `task_cards` |
| **Verification** | **Strongly supported** | ✓ | ✓ | ✓ | ✓ | `checklist`, `prompt_set`, keyed answers, rubric rows — pattern exists; depth varies |
| **Reflection** | **Partially supported** | ✓ | ✓ | ✓ | ✓ | `self_explanation_prompt` exists; target state adds metacognitive depth via episode structure |
| **Transfer** | **Partially supported** | ○ | ✓ | ✓ | ✓ | `transfer_or_application_task` underused in 38G; **R** for Evaluate in target state |
| **Criteria exposition** | **Partially supported** | ○ | ✓ | ✓ | ✓ | Strong when KM `processes.steps` or `relationships` supply lenses (A2, A3); **weak** for Evaluate (A4) |
| **Perspective building** | **Partially supported** | ○ | ○ | ○ | ✓ | KM groupings + `affects` help; competing perspectives require inference (A4) |
| **Trade-off analysis** | **Partially supported** | ○ | ○ | ○ | ✓ | Guided inquiry pattern in episode structure; no KM slot |
| **Scaffold fading** | **Weakly supported** | ✓ | ✓ | ✓ | ✓ | Within-episode fade achievable; **session-level** fade has no KM/LO field — design obligation only |

**Legend:** ✓ = realised in target mock-up · ○ = optional or thinner in that activity

### 1.2 By archetype — easiest functions

| Archetype | Easiest to realise | Hardest to realise |
|-----------|-------------------|-------------------|
| **Understand (A1)** | Explanation, Example, Misconception challenge, Verification | Non-example when no KM misconception; Transfer |
| **Apply (A2)** | Criteria exposition (process steps), Worked thinking, Guided → independent practice, Verification | LO verb mismatch (Analyze vs Apply); session fade |
| **Analyse (A3)** | Criteria exposition (relationship types), Worked thinking, Guided matrix, Reflection | Cause taxonomy not in KM — inference; Transfer |
| **Evaluate (A4)** | Orientation, Framing (scenario), Verification pattern, Transfer intent | Criteria exposition, Perspective building, Trade-off analysis, Exemplar judgement |

### 1.3 Programme pattern

**Strongly supported** functions map to **KM objects with clear read paths** (`concepts`, `processes`, `misconceptions`, `relationships`, `groupings`) and **existing DLA/GAM surfaces** ([38G-2 §3.7 bridge](38I-3-km-lo-episode-mapping.md)).

**Partially / weakly supported** functions map to **episode structure** and **authoring inference** — especially Evaluate and session design.

---

## Section 2 — Where did richness come from?

### 2.1 Per-activity dominance

| Activity | Archetype | Dominant richness source | Secondary sources | Evidence |
|----------|-----------|--------------------------|-------------------|----------|
| **A1** What Counts as Inflation? | Understand | **KM content** | Episode structure; LO scope | Definitions, `contrasts_with`, misconception, grouping *Inflation Measurement Methods* populated Explanation, Non-example, Misconception challenge |
| **A2** Measuring Inflation in Practice | Apply | **KM content** | Episode structure | `Calculating CPI Inflation` process steps drove Criteria exposition + Worked thinking + Verification keys |
| **A3** Types and Causes of Inflation | Analyse | **Episode structure** | Instructional inference; KM relationships | Analytic criteria matrix and worked pass are archetype-shaped; cause taxonomy inferred from A1 GAM + LO, not KM object |
| **A4** Who Gains, Who Loses… | Evaluate | **Episode structure** | Instructional inference; partial KM | Function sequence (perspectives → criteria → exemplar → judgement) carries pedagogy; KM supplies income types and `affects`; criteria, perspectives, scenario numerics, strategy menu inferred |

### 2.2 Aggregate accounting

| Source | Share of target-state richness | Reliable without new guidance? |
|--------|-------------------------------|------------------------------|
| **KM content** | **~40%** (A1, A2 core; A4 distributional substance) | **Yes** for Understand/Apply when KM is populated |
| **Episode structure** (38I-2 archetype sequences) | **~35%** (all activities; dominant for A3, A4) | **Only if** generation follows archetype plans — not today |
| **Instructional inference** (brief + LO + domain convention) | **~20%** (A3 taxonomy; A4 criteria/perspectives/scenario) | **Fragile** — exceptional authoring today |
| **LO guidance alone** | **~5%** | **Insufficient** — `EV-38G` proves LO→task collapse |

**Conclusion:** Richness is **not** limited by missing KM inventory on the inflation anchor. It is limited by **missing choreography** — the pipeline does not yet **select archetype → plan functions → populate from KM → fill inference gaps** in a fixed order.

---

## Section 3 — What required the greatest inference?

### 3.1 Inference burden table

| Function | Burden | Why |
|----------|--------|-----|
| **Orientation** | Low | Preamble + session arc templates; LO progression |
| **Activation** | Low | Prior LOs / concept names in KM |
| **Worked thinking** | Low–Medium | Low when `processes.steps` exist (A2); medium when analytic/judgement modelling must be authored (A3, A4) |
| **Misconception challenge** | Low | When KM `misconceptions[]` present; **high** when confusable pair has no misconception row |
| **Guided practice** | Low | Tables, scenarios, hint sequences — ACM surfaces exist |
| **Verification** | Low–Medium | Low for keyed procedural checks; medium for rubric depth on Evaluate |
| **Reflection** | Medium | Field exists; quality requires archetype-specific prompts |
| **Transfer** | Medium | LO transfer cues + brief; personal context not in KM |
| **Criteria exposition** | **High** (Evaluate) / Low (Apply) | Process steps **are** criteria for Apply; Evaluate has **no** KM criteria slot — full rubric inferred (A4) |
| **Perspective building** | **High** | Competing household/policy views not first-class KM objects (A4 commentary) |
| **Trade-off analysis** | **High** | Tensions named in episode design; no `trade_offs` affordance |
| **Scaffold fading** | **High** | Session-level independence across A1→A4 not represented in KM/LO/DLA fields |
| **Evaluative judgement (exemplar)** | **High** | Strong/weak exemplar quality is pedagogical authoring, not KM read |

### 3.2 Inference hotspots by activity

| Activity | Highest-inference elements |
|----------|---------------------------|
| A1 | Example/non-example selection among concepts (author choice, not wrong) |
| A2 | Archetype override (LO says Analyze; episode is Apply) |
| A3 | Inflation **type/cause taxonomy** as comparison dimensions |
| A4 | **Criteria rows**, **strategy menu**, **scenario numerics**, **competing perspectives**, **exemplar judgements**, **rubric checkpoints** |

---

## Section 4 — Reliability assessment

**Definitions:**

| Term | Meaning |
|------|---------|
| **Can generate now?** | `EV-38G`-class pipeline can emit *something* in this function without charter change |
| **Can generate reliably?** | Emission is **consistently rich** across topics without expert rework |
| **Requires additional guidance?** | Needs new **pack rules, inference contracts, or function plans** — not necessarily schema |

### 4.1 Function reliability matrix

| Function | Generate now? | Generate reliably? | Additional guidance needed |
|----------|:-------------:|:------------------:|---------------------------|
| Orientation | Yes | Partial | Archetype-specific orientation templates per 38I-2 |
| Activation | Yes | Partial | Tie to prior episode LOs in session arc rules |
| Explanation | Yes | **Yes** (when KM concepts present) | KM quality gate (38H-4b) |
| Worked thinking | Yes | Partial | Obligation: model reasoning when `processes` or Analyse/Evaluate archetype |
| Misconception challenge | Yes | Partial | KM trigger: misconception → **R** (38I-3 §3.6) |
| Guided practice | Yes | Partial | Function plan must precede `learner_task` |
| Independent practice | Yes | Partial | Anti-shell rule: performance task follows teaching blocks |
| Verification | Yes | Partial | Minimum depth per archetype (checklist vs rubric) |
| Reflection | Yes | No | Archetype-specific metacognitive prompts |
| Transfer | Yes | No | Evaluate **R**; explicit brief/LO transfer cue handling |
| Criteria exposition | Partial | No | **Inference contract** for Evaluate; process-read for Apply |
| Perspective building | Partial | No | Evaluate episode plan + inference from groupings/relationships |
| Trade-off analysis | No | No | Episode structure + guided inquiry prompts in function plan |
| Scaffold fading | Partial | No | **Session design rules** across activities — not per-activity field |
| Evaluative judgement | Partial | No | Exemplar contrast pattern + rubric in function plan |

### 4.2 Archetype reliability summary

| Archetype | Reliable today? | Blocker |
|-----------|:-------------:|---------|
| Understand | **Nearest** | KM misconception sparsity; thin preamble-only shells |
| Apply | **Near** | LO/archetype mismatch; worked thinking skipped |
| Analyse | **Partial** | Criteria from relationships needs prompt rules; taxonomy gaps |
| Evaluate | **No** | H-04 class — capstone/summary substitution; high inference |

### 4.3 What additional guidance means (non-schema)

| Guidance type | Addresses | Example |
|---------------|-----------|---------|
| **Archetype selection rules** | LO verb vs cognitive_level mismatch | A2: Apply despite Analyze LO |
| **Function plan templates** | LO→task shell | 38I-2 canonical sequences as DLA planning output |
| **KM trigger table** | Obligation upgrades | Misconception → Misconception challenge **R** |
| **Inference contracts** | Evaluate criteria, perspectives | "When archetype = Evaluate and no process criteria, derive 3–5 rubric dimensions from LO statement + `affects` relationships" |
| **Session arc contract** | Scaffold fading | A1 high support → A4 high independence; cross-activity assumption notes |
| **Anti-patterns** | Spoilers, sample_output copy | 38H-2 consolidation discipline; exemplar contrast not model answer |
| **Minimum word/teaching depth** | Thin GAM | Function-level content budgets (pedagogical, not renderer) |

---

## Section 5 — Candidate future affordances

*Completed after Sections 1–4. Assessment is evidence-based from A1–A4; **not** a schema proposal.*

| Candidate | Verdict | Evidence | Rationale |
|-----------|---------|----------|-----------|
| **criteria** | **Potentially valuable** | A4 high inference for rubric rows; A2/A3 criteria from processes/relationships work without slot | Dedicated slot would **stabilise Evaluate** and reduce prompt variance; **not required** if inference contracts work |
| **perspectives** | **Helpful** | A4 Step 1 competing views inferred from groupings + domain | Would reduce Evaluate authoring load; KM `relationships` + groupings partially suffice |
| **trade_offs** | **Helpful** | A4 trade-off prompts entirely episode-authored | Often paired with perspectives; episode structure can carry interim |
| **anticipated responses** | **Helpful** | Weak vs strong exemplar in A4; distractors in A1 verification | Supports verification and misconception repair; overlaps `misconceptions` + inference |
| **scaffold patterns** | **Potentially valuable** | Session fade high burden; within-episode fade works via guided→independent | Session-level fade is the **reliability gap**; pattern library may beat ad hoc DLA |
| **judgement rubrics** | **Helpful** | A4 verification table inferred | Overlaps **criteria**; Evaluate-specific; inference contract may suffice first |

| Candidate | Verdict | Evidence |
|-----------|---------|----------|
| New material types | **Not needed** | 38I-4 carried all functions via existing `worked_example`, `scenario`, `checklist`, etc. |
| ACM redesign | **Not needed** | [38G-2](38G-2-activity-component-model.md) bridge covers 38I-2 moves |
| Renderer changes | **Not needed** | 38H preservation — upstream richness is the gap |
| `cognitive_level` on every LO | **Helpful** not blocking | Verb inference works; explicit levels improve archetype reliability |

**Ordering if affordances are ever added:** **criteria** and **scaffold patterns** first (highest reliability impact); **perspectives** / **trade_offs** second (Evaluate concentration); **anticipated responses** third (cross-archetype verification).

---

## Section 6 — Proposed generation architecture

Minimum **conceptual** flow for normal rich output — no implementation detail.

```text
Knowledge Model (KM)
        ↓  substance: concepts, relationships, processes, misconceptions, groupings
Learning Outcomes (LO)
        ↓  performance intent, cognitive signal, concept scope
Episode Archetype Selector (38I-2 + 38I-3 LO-ARC rules)
        ↓  Understand | Apply | Analyse | Evaluate
Instructional Function Plan (NEW PLANNING LAYER — not schema)
        ↓  ordered R/C/O functions per archetype
        ↓  KM trigger upgrades (e.g. misconception → challenge R)
        ↓  inference contracts for gap-fill (Evaluate criteria, scenario framing)
ACM Component Selection (38G-2 — frozen)
        ↓  map each function to existing components + material types
DLA Population
        ↓  cognition fields + required_materials + learner_task segments
        ↓  function-ordered content blocks (not single task shell)
GAM Realisation
        ↓  long-form teaching in materials; anti-spoiler discipline (38H-2)
Workbook Page
        ↓  preservation compose (38H — no change required)
```

### 6.1 Critical new layer: Instructional Function Plan

The **smallest architectural addition** is not a KM key. It is a **planned intermediate artefact** (conceptual or future JSON) between LO and DLA:

| Field (conceptual) | Purpose |
|--------------------|---------|
| `primary_archetype` | From LO-ARC rules |
| `function_sequence[]` | Ordered 38I-2 moves with R/C/O tags |
| `km_reads[]` | Which concepts/relationships/processes populate each **R** function |
| `inference_flags[]` | Which functions need LO/brief gap-fill |
| `session_position` | Index in session; fade assumptions |
| `anti_patterns` | e.g. no spoiler consolidation; no sample_output as copy target |

Today `EV-38G` skips this layer → `learner_task` + materials list without function order.

### 6.2 Minimum change set (smallest path to normal rich output)

| # | Change | Layer | Schema? |
|---|--------|-------|:-------:|
| 1 | **Archetype selection before DLA** | Pack / planning | No |
| 2 | **Function plan templates per archetype** | Pack / planning | No |
| 3 | **KM trigger obligations** | Pack §5 (DLA) | No |
| 4 | **Inference contracts** (Evaluate criteria, perspectives) | Pack §5/§6 | No |
| 5 | **Session arc contract** (scaffold fade, LO distribution) | Pack §5 session design | No |
| 6 | **Anti-shell + anti-spoiler rules** | Pack §5/§6 (extend 38G, 38H) | No |
| 7 | **Archetype-over-LO-verb override** when process/criteria signal Apply | Pack logic | No |
| 8 | **Function-ordered GAM emission** | GAM generation prompt | No |

**Not in minimum set:** new KM keys, ACM rows, renderer, `app.js` changes.

### 6.3 What stays frozen

- KM top-level keys ([38I-3 §1.5](38I-3-km-lo-episode-mapping.md))
- [38G-2 ACM](38G-2-activity-component-model.md) component definitions
- 38H preservation path and consolidation discipline
- Material type vocabulary (38F)

---

## Synthesis — What did 38-I prove?

### What is now proven?

1. **Rich instructional episodes can exist** within fixed KM, LO, and ACM — demonstrated in [38I-4](38I-4-target-state-workbook-mockups.md) and the [A4 learner episode](artefacts/38I-4-a4-evaluate-learner-episode.md) (~8× instructional density vs `EV-38G-AFTER`).

2. **Episode archetypes differ measurably** in function sequences, scaffold curves, and verification depth ([38I-2](38I-2-instructional-episode-model.md) §6 matrix).

3. **KM+LO can populate most Understand, Apply, and Analyse functions** without schema expansion ([38I-3](38I-3-km-lo-episode-mapping.md) §4 — **strong** coverage).

4. **Evaluate is the reliability bottleneck** — archetype selectable from LO, but criteria, perspectives, and trade-offs require **inference** (H-04 root cause confirmed pedagogically, not as fidelity loss).

5. **The pipeline failure mode is identified:** **LO → activity shell**, skipping **archetype → function plan → populated teaching**. 38G improved hints; it did not install the planning layer.

6. **Downstream compose is not the blocker** — 38H showed DLA→GAM→Page can preserve richer intent when upstream emits it.

### What remains uncertain?

| Uncertainty | Why it matters |
|-------------|----------------|
| **Inference contracts without schema** — can packs reliably generate A4-class Evaluate without expert rework? | Determines whether criteria/perspectives slots are eventually necessary |
| **LO verb vs archetype mismatches** — how often will override rules fire? | A2-style cases may be common |
| **KM sparsity** — misconceptions, relationships vary by topic | Misconception challenge **R** triggers inconsistently |
| **Session-level scaffold fading** — can pack session design enforce cross-activity fade without structured session object? | High inference burden remains |
| **Token/cost budget** — ~1,000-word episodes × 4 activities | Operational constraint for future implementation sprint |
| **Harness observability** — can function coverage be scored automatically? | Quality gate for "normal output" claim |

### What should happen next?

| Priority | Action | Sprint/home |
|----------|--------|-------------|
| **1** | **38I-6 closure** — programme recommendation and success verdict | 38I (this sprint) |
| **2** | **Implementation sprint (future)** — pack §5 DLA function-plan obligations; §6 GAM function-ordered emission; inference contracts; session arc rules | Post-38I |
| **3** | **Harness extension (optional)** — function coverage scoring against 38I-2 R moves | Future QA |
| **4** | **Affordance review (deferred)** — criteria / scaffold_patterns slots only if inference contracts fail on second anchor topic | Post-implementation eval |
| **5** | **Re-run inflation pipeline** — compare `EV-38G-AFTER` to post-implementation capture | Validation |

### Smallest-set answer (one paragraph)

Rich episodes become **normal** when generation inserts an **Instructional Function Plan** between LO and DLA, selects **episode archetype** via 38I-3 rules, populates **R** functions from KM triggers, applies **documented inference contracts** for Evaluate and session fade, and emits **function-ordered** content through existing ACM surfaces — under **anti-shell and anti-spoiler** pack discipline. That is **eight pack/planning changes**, zero schema expansion, zero ACM redesign, zero renderer work — aligned with everything 38-I proved on the inflation anchor.

---

## References

- [38I-1 prior pedagogical journey review](38I-1-prior-pedagogical-journey-review.md)
- [38I-2 instructional episode model](38I-2-instructional-episode-model.md)
- [38I-3 KM/LO episode mapping](38I-3-km-lo-episode-mapping.md)
- [38I-4 target-state workbook mock-ups](38I-4-target-state-workbook-mockups.md)
- [38I-4 A4 learner episode](artefacts/38I-4-a4-evaluate-learner-episode.md)
- [38G-2 activity component model](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md)
- [38H-1 H-04 analysis](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-1-workbook-realisation-fidelity-analysis.md)
- [EV-38G-AFTER DLA](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-dla-learning-activities.json)

# Slice 38L-1 — Implementation planning review

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Review and planning checkpoint only — no pack, prompt, code, schema, renderer, or harness edits  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38L-1  
**Authority:** [38J-5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) · [38J-6](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md) · [38K-1](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md) · [38K-2](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md) · [38K-3](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) · [38K-4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) · [38K-5](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md)

**Baselines (frozen):** `EV-38G-AFTER-*` · `EV-38J-AFTER-*`  
**Proof target:** `EV-38L-AFTER-*`

---

## §1 Executive summary

Sprint 38-L implements **instructional sufficiency obligations** (R1–R7) within the existing 38-J architecture — extending pack §5 IFP and §6 GAM-PRES only. No schema, ACM, renderer, or workflow changes.

**Implementation target:** Move `EV-38L-AFTER` from post-38J **episode structure** (~2–3× richer than 38G) toward [38I-4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) **minimum instructional sufficiency floor** — not full benchmark length.

**Inherited diagnosis ([38K-1](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md) §8):**

| Gap class | Share | Nature |
|-----------|-------|--------|
| Thin function population | **~65–70%** | Functions emitted but below Level 3 |
| Missing closure emission | **~30–35%** | Verification, transfer, independent judgement absent as Materials |

**38J proved:** GAM-PRES preserves what DLA plans ([38J-5 §7](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)). Gaps trace to **DLA planning omissions** and **thin specification**, not platform collapse.

**Planning conclusion:** All seven required upgrades (R1–R7) belong in 38-L scope. The **smallest change set** that satisfies R1–R7 and delivers the largest instructional gain is:

1. **Universal verification** (R1) + **closure emission gates** (R4) — cross-archetype, structural  
2. **Evaluate completion pack** (R5) + **Evaluate substance contract** (R7) — capstone bottleneck  
3. **DLA depth-floor specifications** (R2) + **function-shaped GAM bodies** (R3) — population mechanism  
4. **Analyse worked analytic pass** (R6) — highest Analyse leverage  

**Defer to future (not blocking R1–R7 or minimum sufficiency):** Understand discrimination pack (38K-5 O1), orientation/activation polish (O3), transition paragraphs (O4), `sample_output` copy guard (O5), KM-only swap run (O6).

**Production surface:** `domains/learning-design/domain-learning-design-step-patterns.md` §5 (planning + specs) and §6 (body depth + preservation). Secondary: evaluation harness LO/brief contract for R7.

---

## §2 Review of R1–R7

Classification uses [38K-5 §3](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md): **Required** = archetype cannot reach Level 3 profile without it; **Optional** = moves toward Level 4 / full 38I-4 length; **Future** = out of 38-L charter or post-proof refinement.

### R1 — Universal verification obligation

| Field | Assessment |
|-------|------------|
| **Classification** | **Required for 38L** |
| **Evidence** | Level 0 on **all four** activities in `EV-38J-AFTER` ([38K-1 §7](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md)); A3 **regression** vs 38G checklist ([38J-5 §4](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)); 38K-3 universal floor — verification L3 on every archetype |
| **38J gap** | Table completion treated as implicit check; no `checklist` Material on A1/A2/A4 |
| **Implementation surface** | §5: plan `checklist` (or rubric Material) for every activity; §6: populate ≥4 checks + repair path per [38K-4 E1–E4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) |
| **Leverage** | Highest cross-archetype single function ([38K-2 §6](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md)) |

### R2 — Level 3 depth floors in DLA specifications

| Field | Assessment |
|-------|------------|
| **Classification** | **Required for 38L** |
| **Evidence** | IFP-08 population discipline exists but specs lack **content obligations** ([38K-5 §7](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md)); A2 succeeds when depth specified ([38K-3 §4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) — Level 4 worked example); empty tables and one-line framing elsewhere ([38K-1 §6–§7](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md)) |
| **38J gap** | Specifications name material types and topics but not sufficiency elements (exemplar row, scoring guide, word band, check count) |
| **Implementation surface** | §5 IFP-08 extension: per Required function attach depth_floor L3 + sufficiency checklist from [38K-2 §1](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md) |
| **Dependency** | Enables R1, R5, R6 body quality; pairs with R4 for structural rows |

### R3 — Function-shaped GAM body rules

| Field | Assessment |
|-------|------------|
| **Classification** | **Required for 38L** |
| **Evidence** | GAM-PRES preserved 14/14 bodies ([38J-5 §7](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)); type-centric expansion insufficient per [38J-4 §1](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md); thin bodies despite correct types (empty `decision_table`, header-only grids) |
| **38J gap** | No purpose → body template mapping for verification, transfer, analytic pass, independent memo |
| **Implementation surface** | §6 GAM-PRES extension: map `purpose` keywords to minimum structural elements (checklist ≥4 rows, table ≥1 exemplar row, transfer word band) |
| **Dependency** | Without R3, R2 specs may not survive GAM population |

### R4 — Closure emission gates

| Field | Assessment |
|-------|------------|
| **Classification** | **Required for 38L** |
| **Evidence** | Structural gaps G-06, G-09, G-10, G-11, G-14–G-17 ([38K-1 §6](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md)); `transfer_or_application_task` cognition field without `transfer_prompt` Material on A1/A4 ([38J-5 §7](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)); anti-emission patterns catalogued in [38K-5 §6](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md) |
| **38J gap** | ~30–35% of distance is **missing Material rows**, not renderer loss |
| **Implementation surface** | §5 IFP: when function Required → mandate matching Material type; forbid cognition-field-only closure |
| **Gates (minimum)** | Verification row (all); `transfer_prompt` (Evaluate Required); `template`/`task_cards` (Evaluate independent judgement); worked analytic pass row (Analyse, before matrix) |

### R5 — Evaluate completion pack

| Field | Assessment |
|-------|------------|
| **Classification** | **Required for 38L** |
| **Evidence** | A4: 3/10 Required functions at floor ([38K-3 §6](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md)); independent judgement, verification, transfer **Missing** ([38J-5 §5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)); consolidation substitutes for memo ([38K-1 §5](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md) G-19) |
| **38J gap** | Evaluate **shape** present; closure functions at Level 0 |
| **Implementation surface** | §5/§6: independent memo scaffold + rubric verification + transfer Material; anti-pattern: consolidation as sole capstone artefact |
| **Calibration** | [38K-4 E4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) · [38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |

### R6 — Analyse worked analytic pass

| Field | Assessment |
|-------|------------|
| **Classification** | **Required for 38L** |
| **Evidence** | A3: 2/7 Required at floor; worked analytic pass **structurally absent** (G-11); scenario + inquiry adequate but matrix empty ([38K-1 §4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md)); [38K-4 E3](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) demonstrates largest Analyse teaching upgrade for moderate add |
| **38J gap** | Analyse reads as empty worksheet without modelling |
| **Implementation surface** | §5: hard-require `worked_example` or `modelling_note` analytic pass before `analysis_table`; §6: fact → lens → mechanism → draft cell body shape |
| **Note** | Complements R1 (A3 verification restore) and R2 (guided analysis partial row spec) |

### R7 — Evaluate LO / harness alignment

| Field | Assessment |
|-------|------------|
| **Classification** | **Required for 38L** |
| **Evidence** | G-20: LO4 *Summarize policy communication* drove policy-judgement A4 vs household Evaluate benchmark ([38K-1 §5](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md)); [38J-5 §5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) substance mismatch; [38J-6 §5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md) recommends LO contract |
| **38J gap** | Evaluate **form** without household **anchor** — comparator to 38I-4 A4 fails on substance even if closure fixed |
| **Implementation surface** | Harness brief + frozen fourth LO (*Evaluate household budget strategies* or equivalent); §5 IFP inference reinforcement if pack alone insufficient |
| **Phase placement** | Confirm contract in 38L-1; implement in **38L-4**; validate in **38L-5** proof run |

### Optional items (38K-5 — not R1–R7)

| ID | Item | Classification | Rationale |
|----|------|----------------|-----------|
| **O1** | Understand discrimination pack (non-example, guided classification) | **Optional for 38L** | Improves A1 toward 38I-4 E1; not blocking Evaluate/verification minimum ([38K-5 §5](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md) — Understand priority fourth) |
| **O2** | Apply process exposition block | **Optional for 38L** | A2 already strongest activity; verification (R1) is Apply's critical gap |
| **O3** | Orientation/framing/activation L3 | **Future** | Uniformly L1 on 38J; polish not primary bottleneck ([38K-1 §7](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md)) |
| **O4** | Transition paragraphs | **Future** | Session coherence; no evidence as blocking sufficiency |
| **O5** | `sample_output` copy guard | **Future** | A1 copy-risk noted; address after discrimination ladder if O1 deferred |
| **O6** | Frozen KM injection run | **Future** | Isolates KM richness; not required for depth implementation ([38J-5 §10](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) |

---

## §3 Smallest viable implementation

**Research question:** What is the smallest implementation change set that satisfies R1–R7 and delivers the largest instructional improvement?

### Answer (scope only — no prompt text)

The minimum viable 38-L implementation is **seven obligation classes** across **two pack surfaces**, not seven independent features. Several R items collapse into shared edit locations.

### Core change set (required)

| # | Obligation cluster | Pack surface | What changes (scope) |
|---|-------------------|--------------|----------------------|
| **1** | **Closure emission gates** (R4) | §5 IFP | Mandatory Material rows when Required: `checklist` (all activities), `transfer_prompt` (Evaluate), `template`/`task_cards` (Evaluate independent judgement), analytic pass Material (Analyse, before matrix) |
| **2** | **Universal verification** (R1) | §5 + §6 | Every activity plans verification Material; §6 enforces checklist/rubric body shape (≥4 checks, repair path) |
| **3** | **DLA depth-floor specs** (R2) | §5 IFP-08 | Each Required function: `depth_floor: L3` + content obligations in `specification` (exemplar row, scoring guide, word band, analytic walkthrough elements) |
| **4** | **GAM depth-shaped bodies** (R3) | §6 GAM-PRES | Purpose → body template map; forbid header-only tables; honour verification/transfer/memo specs |
| **5** | **Evaluate completion pack** (R5) | §5 + §6 | Independent judgement artefact separate from synthesis; guided judgement depth (partial exemplar); rubric + transfer Materials |
| **6** | **Analyse modelling** (R6) | §5 + §6 | Worked analytic pass obligation before `analysis_table`; criteria lenses in spec; guided analysis partial row |
| **7** | **Evaluate substance contract** (R7) | Harness (+ §5 if needed) | Fourth LO / brief anchors household strategy Evaluate per 38I-4 A4 |

### What is explicitly out of smallest viable scope

| Item | Reason |
|------|--------|
| O1 Understand full discrimination ladder | Not in R1–R7; A1 already has L3 exposition |
| O3/O4 framing polish | No sufficiency-blocking evidence |
| New material types / archetypes | 38K architecture hold |
| Renderer / schema / ACM | Out of charter |

### Expected material count shift (qualitative)

| Comparator | GAM materials | Source |
|------------|---------------|--------|
| `EV-38J-AFTER` | 14 | [38J-5 §1](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) |
| Hypothetical post-38L | **~18–20** | +4 verification rows; +1 A3 analytic pass; +1–2 A4 closure (template, transfer); possible A3 checklist restore — [38K-5 §8](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md) |

### Largest instructional improvement per change (leverage order)

```text
1. R1 + R4 (verification everywhere)     — solo-learning closure on all four
2. R5 + R7 (Evaluate pack + household)   — capstone perception + benchmark alignment
3. R6 (Analyse worked pass)              — A3 teaching quality
4. R2 + R3 (specs + bodies)              — makes 1–3 reliable, extends A2 closure
```

**A2 Apply:** Preserve existing worked example (Level 4); add only verification Material + spec depth — **extend, do not redesign** ([38K-3 §4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md)).

---

## §4 Implementation order

Recommended sequence for 38L-2 → 38L-3 → 38L-4.

### 38L-2 — DLA depth-floor implementation (first)

| Scope | R items | Rationale |
|-------|---------|-----------|
| IFP-08 depth-floor extension | **R2** | Specs are upstream; GAM cannot populate what DLA does not obligate ([38J-5 §8](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) |
| Closure emission gates | **R4** | Structural rows must exist before body rules attach |
| Verification planning | **R1** (planning) | Mandate `checklist` row per activity in `required_materials` |
| Evaluate / Analyse planning packs | **R5, R6** (planning) | Memo template row, transfer row, analytic pass row, guided judgement partial spec |
| Anti-emission patterns | **R4** | Forbid cognition-only transfer; forbid consolidation-only Evaluate performance |

**Why first:** 38J proved GAM preserves DLA plans. Depth implementation must fix **planning omissions** before **body population**.

### 38L-3 — GAM depth-floor implementation (second)

| Scope | R items | Rationale |
|-------|---------|-----------|
| Purpose → body template map | **R3** | Type-centric rules insufficient for Level 3 bodies |
| Verification bodies | **R1** (bodies) | Checklists/rubrics with ≥4 items + repair |
| Evaluate / Analyse body shapes | **R5, R6** (bodies) | Memo scaffold, transfer section, analytic walkthrough |
| Preserve GAM-PRES core | Hold | Ordering, F8 no-collapse, anti-spoiler ([38J-4](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md)) |

**Why second:** §6 implements what §5 specifies; 38L-3 depends on stable DLA obligation set from 38L-2.

### 38L-4 — Closure-function implementation (third)

| Scope | R items | Rationale |
|-------|---------|-----------|
| Evaluate completion integration | **R5** | Anti-pattern enforcement: synthesis ≠ independent judgement |
| Evaluate LO / harness contract | **R7** | Substance anchor cannot be validated until closure pack exists |
| Cross-archetype closure polish | **R4** | Transfer on Evaluate; restore A3 checklist if emission gate alone insufficient |
| Guided judgement depth | **R2, R5** | Partial exemplar cells, scoring guide on A4 `decision_table` |

**Why third:** R7 requires proof-run LO set; closure anti-patterns need both §5 and §6 in place; Evaluate is integration point for R1+R4+R5+R7.

### Dependency graph

```text
38L-2  §5: R2 + R4 + R1/R5/R6 planning
         ↓
38L-3  §6: R3 + R1/R5/R6 bodies
         ↓
38L-4  §5/§6 + harness: R5 closure + R7 substance
         ↓
38L-5  EV-38L-AFTER proof run
```

---

## §5 Success measures

Observable signs that implementation succeeded — checked at four pipeline layers.

### DLA checkpoints (`EV-38L-AFTER-dla-learning-activities.json`)

| # | Measure | Pass condition |
|---|---------|----------------|
| D-01 | Verification planned | Every activity has `checklist` (or rubric Material) in `required_materials` |
| D-02 | Transfer planned | A4 (Evaluate) has `transfer_prompt` Material row |
| D-03 | Independent judgement planned | A4 has `template` or `task_cards` for memo — separate from `consolidation_summary` |
| D-04 | Analytic pass planned | A3 has `worked_example` or `modelling_note` **before** `analysis_table` in function order |
| D-05 | Depth in specs | Required functions include L3 content obligations in `specification` (not type-only) |
| D-06 | Evaluate substance | A4 purpose/scenario references household budget strategy (post-R7) |

### GAM checkpoints (`EV-38L-AFTER-gam.json` / `EV-38L-AFTER-gam.txt`)

| # | Measure | Pass condition |
|---|---------|----------------|
| G-01 | Material parity | One GAM body per DLA Material row (F8 no-collapse preserved) |
| G-02 | Verification bodies | ≥4 check items per activity checklist; repair path present |
| G-03 | Analytic pass body | A3 worked pass shows fact → lens → mechanism → draft cell |
| G-04 | Evaluate closure bodies | A4: memo template scaffold + rubric + transfer sections populated |
| G-05 | Guided depth | A4 `decision_table` has ≥1 exemplar row or scoring guide (not header-only) |
| G-06 | Anti-spoiler | A4 consolidation remains scaffold; strong judgement ≠ learner memo |

### Page artefact checkpoints (`EV-38L-AFTER-design-page.json`)

| # | Measure | Pass condition |
|---|---------|----------------|
| P-01 | Material composition | Page includes verification, transfer, template Materials where DLA requires |
| P-02 | Function order | Material sequence matches DLA `required_materials` order |
| P-03 | No orphan fields | Cognition transfer fields have matching rendered Material |

### Workbook checkpoints (`EV-38L-AFTER-workbook.md`)

| # | Measure | Pass condition |
|---|---------|----------------|
| W-01 | Verification visible | Learner can self-check on **all four** activities without tutor |
| W-02 | A3 modelling | Worked analytic pass appears **before** empty analysis matrix |
| W-03 | A4 judgement | Independent memo scaffold present; not consolidation-only capstone |
| W-04 | A4 transfer | Dedicated transfer section (new/personal context) |
| W-05 | vs `EV-38J-AFTER` | Documented improvement on closure functions (verification, transfer, independent judgement) |
| W-06 | vs 38I-4 | Minimum L3 profile per [38K-3 summary](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md); benchmark distance reported |

### Archetype floor summary (workbook-level)

| Activity | 38J met (38K-3) | 38L target |
|----------|-----------------|------------|
| A1 Understand | 3/8 | ≥6/8 (defer O1 non-example if scoped) |
| A2 Apply | 5/7 | 7/7 with verification |
| A3 Analyse | 2/7 | ≥5/7 (worked pass + verification + guided depth) |
| A4 Evaluate | 3/10 | ≥8/10 (closure + household anchor) |

---

## §6 Risks

Evidence-based implementation risks only.

### Token / prompt growth

| Risk | Evidence | Mitigation scope |
|------|----------|------------------|
| DLA + GAM prompt surface expands further | 38J already +50% DLA / +56% GAM vs 38G ([38J-5 §1](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)); 38K-5 estimates ~18–22 materials vs 14 | Implement minimum L3 floors only; defer O1/O3/O4; measure on 38L-5 capture |

### Over-generation

| Risk | Evidence | Mitigation scope |
|------|----------|------------------|
| Redundant teaching sections | A1 text + worked + sample may echo ([38J-5 §8](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) | R2 specs should distinguish function purpose; avoid duplicating worked content in sample_output when independent practice follows (O5 — future) |
| Length without sufficiency | 38J longer than 38G but still below 38I-4 density | Success = Level 3 function coverage, not word count ([38K-2 §1](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md)) |

### Duplication

| Risk | Evidence | Mitigation scope |
|------|----------|------------------|
| Verification + guided practice overlap | Table completion already implicit check on A2 | R1 specs: verification checks **method/rules**, not only cell completion ([38K-4 E2](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md)) |
| Consolidation + memo both present | A4 `expected_output` bundles table + consolidation ([38K-1 G-19](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md)) | R5 anti-pattern: independent judgement artefact distinct from synthesis |

### Anti-spoiler regression

| Risk | Evidence | Mitigation scope |
|------|----------|------------------|
| Memo template becomes model essay | 38G A4 failed anti-spoiler; 38J fixed with scaffold consolidation ([38J-5 §5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) | Preserve GAM-WB-06b; template = structure prompts not pre-written judgement; worked judgement stays weak/strong contrast |
| Strong modelling_note copied as answer | 38J A4 modelling_note 1117 chars | R5: independent memo must be learner-empty scaffold |

### Evaluate inflation

| Risk | Evidence | Mitigation scope |
|------|----------|------------------|
| Wrong substantive anchor | Policy communication vs household ([38J-5 §5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) | **R7** harness LO contract — structural for benchmark comparison |
| Consolidation substitutes for judgement | 38J A4 ends on synthesis prompts | **R5** emission gate + anti-pattern |
| Evaluate shape without closure | 3/10 at floor ([38K-3 §6](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md)) | R1+R4+R5 together — shape alone insufficient |

### Model compliance uncertainty

| Risk | Evidence | Mitigation scope |
|------|----------|------------------|
| Specs not populated to L3 | 38K-5 §10 uncertainty #1 | 38L-5 proof run; iterate §6 body templates if needed |
| Checklist dropped when not mandated | A3 regression vs 38G ([38J-5 §4](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) | R4 emission gate + R1 universal obligation |

---

## §7 Go / No-Go assessment

### Can 38L proceed using existing architecture?

## **Yes**

### Evidence chain

| # | Proposition | Source |
|---|-------------|--------|
| 1 | Episode **structure** already works | 38J IFP + GAM-PRES; `EV-38J-AFTER` recognisable on all four ([38J-5 §9](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) |
| 2 | **Depth** achievable without new types | A2 Level 4 worked example on existing `worked_example` ([38K-3 §4](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md)) |
| 3 | 38I-4 targets use existing catalogue | `checklist`, `template`, `transfer_prompt`, `modelling_note`, `decision_table` ([38K-5 §9](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md)) |
| 4 | Gaps are planning + population | GAM preserved DLA; no collapse ([38J-5 §7–§8](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) |
| 5 | No renderer emission loss | Workbook stitches emitted bodies ([38K-1 §8](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md)) |
| 6 | Implementation surface identified | Pack §5/§6 only ([38K-5 §3](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md)) |
| 7 | R1–R7 map cleanly to phases | This review §2–§4 |

### Conditions for Go

| Condition | Status |
|-----------|--------|
| Extend 38J IFP/GAM-PRES — do not weaken | Acknowledged |
| R7 harness alignment before proof run | Planned 38L-4 |
| Frozen comparators preserved | `EV-38G-AFTER-*` · `EV-38J-AFTER-*` |
| Success judged on sufficiency not length | [38K-2](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md) |

### No-Go triggers (none met)

| Trigger | Present? |
|---------|----------|
| Schema expansion required | **No** — 38K-5 §9 |
| Renderer fix required for gaps | **No** — 38K-1 §8 |
| Architecture reopening needed | **No** — 38K-6 §4 |

**Verdict:** **Proceed to 38L-2** — DLA depth-floor and emission-gate implementation.

---

## Readiness summary for 38L-2

| Item | Status |
|------|--------|
| R1–R7 classified | Complete |
| Smallest viable scope defined | Complete |
| Phase order justified | Complete |
| Success measures defined | Complete |
| Risks documented | Complete |
| Go/No-Go | **Go** |

**Next phase:** **38L-2** — pack §5 IFP extension (R2, R4, R1/R5/R6 planning). No 38L-3 until 38L-2 deliverable complete.

---

## References

- [38L IMPLEMENTATION-CHARTER](../IMPLEMENTATION-CHARTER.md) · [38L HANDOVER](../HANDOVER.md)  
- [38J-3 §5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md) · [38J-4 §6](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md)  
- [38K-6 closure](../../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-6-sprint-closure.md) §9

---

**Parent:** [38L observations index](README.md) · **Sprint:** 38-L · **Next:** **38L-2** DLA depth-floor implementation

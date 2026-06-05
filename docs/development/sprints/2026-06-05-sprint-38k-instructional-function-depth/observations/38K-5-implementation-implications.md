# Slice 38K-5 — Implementation implications

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Recommendations only — no pack, code, schema, renderer, workflow, or prompt edits  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38K-5  
**Inputs:** [38K-1](38K-1-baseline-depth-analysis.md) · [38K-2](38K-2-function-depth-model.md) · [38K-3](38K-3-archetype-specific-depth-rules.md) · [38K-4](38K-4-target-state-depth-examples.md) · [38J-3 §5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md) · [38J-4 §6](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md)

**Baselines:** `EV-38G-AFTER-*` · `EV-38J-AFTER-*` · [38I-4 targets](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)

---

## §1 Executive summary

Sprint 38-K investigated why `EV-38J-AFTER` — produced after successful Instructional Function Planning (IFP) and GAM-PRES implementation — remains substantially below [38I-4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) target-state richness.

### Central conclusion

**The remaining gap is mixed, with depth-related population failure dominant.**

| Gap class | Share | Primary evidence |
|-----------|-------|------------------|
| **Depth-related (thin population)** | **~65–70%** | Functions emitted but below Level 3: empty tables, one-line framing, cognition-only transfer, consolidation substituting for judgement ([38K-1](38K-1-baseline-depth-analysis.md)) |
| **Structural (missing emission)** | **~30–35%** | Verification absent on all activities; transfer Material absent; independent judgement absent on A4; worked analytic pass absent on A3 ([38K-1](38K-1-baseline-depth-analysis.md) §6) |
| **Contract (substance alignment)** | **Cross-cutting** | A4 Evaluate shape on policy communication vs household benchmark ([38K-1](38K-1-baseline-depth-analysis.md) §5) |

**Neither class alone explains the distance to 38I-4.** Structural omissions cap achievable depth; thin population on emitted functions explains why episode **shape** still feels like an improved shell.

### Implementation roadmap (headline)

Generation behaviour can move materially closer to 38I-4 **by extending** pack §5 IFP and §6 GAM-PRES with:

1. **Universal verification obligation** (all archetypes)  
2. **Depth-floor population rules** (Level 3 minimum per [38K-3](38K-3-archetype-specific-depth-rules.md))  
3. **Archetype closure packs** — Evaluate completion, Apply closure, Analyse modelling, Understand discrimination  
4. **Structural emission gates** — mandatory Material rows when functions are Required  
5. **Evaluate LO/harness substance contract** — household judgement anchor for inflation capstone  

**No schema, ACM, renderer, or workflow changes required** — evidenced by A2 Level 4 worked example on existing Material types ([38K-1](38K-1-baseline-depth-analysis.md) §8; [38K-4 E2](38K-4-target-state-depth-examples.md)).

### Recommended implementation sequence

```text
Phase A — Universal floors (verification + depth population spec in §5/§6)
Phase B — Archetype packs (Evaluate first, then Apply closure, Analyse, Understand)
Phase C — Harness/LO contract for Evaluate substance
Phase D — Proof run EV-38K-AFTER vs EV-38J-AFTER + 38I-4
```

This document is the **design authority** for that work — not the implementation itself.

---

## §2 What 38J already solved

The following **must remain unchanged**. [38K-1](38K-1-baseline-depth-analysis.md) and [38J-5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) provide evidence.

### Preserve — do not revisit

| Capability | Evidence it works | Hold rule |
|------------|-------------------|-----------|
| **Archetype selection** | LO-ARC rules produce Understand/Apply/Analyse/Evaluate-shaped plans on four activities | Do not add archetypes or change selector logic unless LO contract changes |
| **Instructional function planning (IFP)** | DLA plans function-ordered `required_materials`; A2 gained `worked_example`; A4 gained criteria → scenarios → modelling → table | **Extend** IFP with depth floors — do not remove IFP-00..08 sequence ([38J-3](38J-3-dla-implementation.md)) |
| **GAM preservation (GAM-PRES)** | 14/14 Material bodies; function order preserved; no collapse ([38J-5 §7](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) | **Extend** §6 with depth-shaped body rules — do not weaken ordering or anti-collapse |
| **Anti-shell controls** | A1–A3 pass EV-SHELL on 38J; segmented learner tasks | Keep IFP-05; add depth gates, not task-first regression |
| **Anti-spoiler consolidation** | A4 consolidation is scaffold, not model essay ([38H-2](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-2-gam-consolidation-discipline.md)) | Preserve; clarify synthesis ≠ independent judgement on Evaluate |
| **Stable chain** | `KM → LO → ACM → DLA → GAM → Workbook` unchanged across 38-I/38-J | No new pipeline steps or persistent IFP artefact |
| **Frozen ACM / material types** | Existing types carry 38I-4 targets: `checklist`, `template`, `transfer_prompt`, `modelling_note`, `decision_table`, etc. ([38I-4 evaluation questions](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) | No new material types |

### What 38J proved

> Episode **structure** can be generated without platform expansion.

38-K proved what 38J did **not** specify:

> Episode **depth** and **closure** require additional generation obligations.

**Do not re-litigate:** schema expansion, ACM redesign, renderer fidelity, workflow steps, or removing IFP/GAM-PRES to "start over."

---

## §3 Required generation upgrades

Minimum set of **generation behaviour** changes. Primary production surface: `domains/learning-design/domain-learning-design-step-patterns.md` **§5** (planning + population specs) and **§6** (body depth + preservation). Secondary: evaluation harness brief/LO contract for Evaluate substance.

### Required changes

| # | Upgrade | Layer | Rationale |
|---|---------|-------|-----------|
| **R1** | **Universal verification obligation** | §5 IFP + §6 GAM | Level 0 on all four activities; highest leverage ([38K-4 §6](38K-4-target-state-depth-examples.md)) |
| **R2** | **Depth-floor specification in DLA `required_materials`** | §5 IFP-08 | Specifications must encode Level 3 content obligations per [38K-2 §4](38K-2-function-depth-model.md) |
| **R3** | **Depth-shaped GAM body rules** | §6 GAM-PRES extension | Type-centric expansion insufficient ([38J-4 §1](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md)); map function purpose → body shape |
| **R4** | **Closure emission gates** | §5 IFP | When function Required, emit matching Material row — not cognition field only |
| **R5** | **Evaluate completion pack** | §5/§6 | Independent judgement + verification rubric + transfer Material; anti-pattern: consolidation as sole capstone artefact |
| **R6** | **Analyse modelling obligation** | §5/§6 | Worked analytic pass Material before empty analysis matrix |
| **R7** | **Evaluate substance contract** | Harness + IFP inference | Capstone LO/brief must anchor household strategy Evaluate per 38I-4 A4 ([38K-1](38K-1-baseline-depth-analysis.md) G-20) |

### Optional changes (high value, not blocking minimum sufficiency)

| # | Upgrade | Layer | Rationale |
|---|---------|-------|-----------|
| **O1** | Understand discrimination pack (non-example, guided classification) | §5/§6 | Session foundation; KM-triggered ([38K-3 §3](38K-3-archetype-specific-depth-rules.md)) |
| **O2** | Apply closure pack (explicit process exposition block) | §5/§6 | Completes A2 without touching worked example ([38K-4 E2](38K-4-target-state-depth-examples.md)) |
| **O3** | Orientation/framing/activation Level 3 templates | §5 cognition + preamble | Uniformly L1 on 38J — polish, not primary bottleneck |
| **O4** | Transition paragraphs per archetype | §5/§6 | Session coherence |
| **O5** | `sample_output` copy guard when independent practice follows | §5 IFP-06 / §6 | A1 copy-risk ([38K-2](38K-2-function-depth-model.md)) |
| **O6** | Second proof run with frozen `EV-38H-AFTER` KM injection | Harness | Isolate KM richness vs depth spec ([38J-5 §10](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) |

### Distinguishing required vs optional

**Required** = without it, archetype **cannot** reach Level 3 profile in [38K-3](38K-3-archetype-specific-depth-rules.md) on a future proof run.

**Optional** = moves toward 38I-4 **rich** (Level 4) or full benchmark length; not needed for minimum instructional sufficiency.

---

## §4 Function-level implications

High-leverage functions from [38K-2 §6](38K-2-function-depth-model.md) and [38K-4](38K-4-target-state-depth-examples.md).

### Verification

| Field | Content |
|-------|---------|
| **Current state** | Level 0 all activities; table completion treated as implicit check; A3 checklist regression vs 38G |
| **Target state** | Level 3 minimum: ≥4 checks or keyed answers + repair path; archetype-specific rubric shape ([38K-4 E1–E4](38K-4-target-state-depth-examples.md)) |
| **Expected impact** | Enables sufficiency dimension **check/revise** for solo learners; largest single cross-archetype richness gain |
| **Generation change** | §5: plan `checklist` or rubric Material for every activity; §6: populate checklist bodies, honour DLA verification specs |

### Transfer

| Field | Content |
|-------|---------|
| **Current state** | `transfer_or_application_task` cognition field on A1/A4; no `transfer_prompt` Material |
| **Target state** | Level 3: dedicated section with new case or personal context + ≥3 prompts + word band; **Required** on Evaluate |
| **Expected impact** | Evaluate episodes become authentically applied; Apply/Analyse gain method/frame reuse evidence |
| **Generation change** | §5: emission gate — if transfer Required or cognition field set → `transfer_prompt` row; §6: body depth rules |

### Worked analytic pass

| Field | Content |
|-------|---------|
| **Current state** | Absent on A3; scenario + prompt_set only |
| **Target state** | Level 3: fact → lens → mechanism → draft cell walkthrough before matrix ([38K-4 E3](38K-4-target-state-depth-examples.md)) |
| **Expected impact** | Analyse stops feeling like empty worksheet; teaches reasoning pattern not only structure |
| **Generation change** | §5: Analyse template hard-require `worked_example` or `modelling_note` analytic pass before `analysis_table`; §6: analytic body shape |

### Independent judgement

| Field | Content |
|-------|---------|
| **Current state** | Absent on A4; `consolidation_summary` + session reflection substitutes |
| **Target state** | Level 3: structured memo (`template`/`task_cards`) — priority criterion, strategies, trade-off, revision condition ([38K-4 E4](38K-4-target-state-depth-examples.md)) |
| **Expected impact** | Capstone produces Evaluate **evidence** not summary; closes H-04 class gap |
| **Generation change** | §5: Evaluate IFP mandates independent judgement artefact separate from synthesis; §6: template scaffold, anti-spoiler |

### Guided judgement

| Field | Content |
|-------|---------|
| **Current state** | A4 `decision_table` empty; no scoring guide or exemplar row (Level 2) |
| **Target state** | Level 3: rating scale + justification column + ≥1 exemplar row ([38K-4 E4](38K-4-target-state-depth-examples.md)) |
| **Expected impact** | Learner practises criteria application before memo; reduces jump from modelling to open write |
| **Generation change** | §5: guided judgement spec must require partial completion; §6: GAM must not emit header-only tables |

### Discrimination activities (Understand)

| Field | Content |
|-------|---------|
| **Current state** | A1 prose contrast in exposition; misconception subsection in worked example; no non-example table or classification |
| **Target state** | Level 3: contrast table + non-example cases + verification discrimination checks ([38K-4 E1](38K-4-target-state-depth-examples.md)) |
| **Expected impact** | Understand episode teaches boundaries not only definitions; reduces `sample_output` copy bias |
| **Generation change** | §5: KM-T triggers for non-example/misconception → Material rows; §6: contrast/non-example body templates |

---

## §5 Archetype implications

Summary from [38K-3](38K-3-archetype-specific-depth-rules.md) with `EV-38J-AFTER` maturity.

### Understand

| Field | Content |
|-------|---------|
| **Current maturity** | Core exposition L3; ~3/8 Required functions at floor; verification and discrimination ladder absent |
| **Required upgrades** | R1 verification; O1 discrimination pack; depth on contrast/misconception |
| **Expected gains** | Session foundation stabilised; downstream Apply/Analyse less misconception carry-forward |
| **Priority** | **Fourth** — important but not capstone bottleneck |

### Apply

| Field | Content |
|-------|---------|
| **Current maturity** | **Highest** — worked example L4; guided/independent L3; ~5/7 at floor; missing closure only |
| **Required upgrades** | R1 verification; O2 process exposition; transfer Material |
| **Expected gains** | Completes best post-38J activity; proof that extend-not-redesign works |
| **Priority** | **Second** — fast win after universal floors |

### Analyse

| Field | Content |
|-------|---------|
| **Current maturity** | **Low** — ~2/7 at floor; scenario L3; worked pass and verification absent |
| **Required upgrades** | R1 verification; R6 worked analytic pass; criteria lenses; guided analysis partial row |
| **Expected gains** | Largest **perceived** teaching upgrade for moderate word-count add ([38K-4 E3](38K-4-target-state-depth-examples.md)) |
| **Priority** | **Third** — after Evaluate contract and Apply closure pattern validated |

### Evaluate

| Field | Content |
|-------|---------|
| **Current maturity** | Shape L3 on criteria/perspectives/modelling; **3/10** Required at floor; closure absent; wrong substance anchor on 38J run |
| **Required upgrades** | R5 Evaluate pack; R7 substance contract; R1 verification; transfer; independent judgement; guided judgement depth |
| **Expected gains** | Closes programme gap H-04; capstone matches 38I-4 minimum floor |
| **Priority** | **First** — most Required functions; highest richness leverage |

### Archetype priority order

```text
1. Evaluate  (R5 + R7 + closure)
2. Apply     (extend A2 closure — R1 + O2)
3. Analyse   (R6 + verification + guided depth)
4. Understand (O1 + R1)
```

**Rationale:** Evaluate has the most Level 3+ obligations and defines session success perception; Apply provides a validated extension pattern; Analyse and Understand follow.

---

## §6 Structural obligations

Functions that must become **mandatory Material emissions** when archetype marks them Required — not cognition fields alone.

### Universal obligations

| Function | Material type(s) | Trigger | Evidence |
|----------|------------------|---------|----------|
| **Verification** | `checklist`, rubric table, or keyed-answer block | **Every** workbook activity, all archetypes | 38I-2 **R** all archetypes; 38J Level 0 ([38K-3 §7](38K-3-archetype-specific-depth-rules.md)) |

### Archetype-specific obligations

| Function | Archetype(s) | Material type(s) | Trigger |
|----------|--------------|------------------|---------|
| **Transfer** | Evaluate (**R**), Apply/Analyse (**C** → emit when in plan) | `transfer_prompt` | Evaluate always; others when IFP includes transfer |
| **Independent judgement** | Evaluate | `template`, `task_cards` | Evaluate archetype; `expected_output` must reference memo not summary only |
| **Worked analytic pass** | Analyse | `worked_example`, `modelling_note` | Before `analysis_table` in function order |
| **Independent practice (structured)** | Understand, Apply | `task_cards`, write band in `learner_task` | When classification or memo required |
| **Non-example / contrast** | Understand (KM-triggered) | `text` section, `task_cards` | KM misconception or `contrasts_with` present |
| **Process exposition** | Apply | `text` block before worked example | Apply archetype **R** per 38K-3 |

### Anti-emission patterns (forbid)

| Pattern | Replace with |
|---------|--------------|
| `transfer_or_application_task` only | `transfer_prompt` Material + field |
| `consolidation_summary` as sole Evaluate performance | Independent judgement Material + optional synthesis |
| Empty `decision_table` / `analysis_table` without partial spec | DLA spec requiring exemplar row or hint column |
| Verification implied by "complete the table" | Explicit `checklist` or keyed verification section |

### Assessment: universal vs archetype-specific

| Obligation type | Scope |
|-----------------|-------|
| **Verification** | **Universal** |
| **Transfer** | **Evaluate Required**; optional elsewhere with emission gate |
| **Independent judgement** | **Evaluate only** |
| **Worked analytic pass** | **Analyse only** |
| **Discrimination pack** | **Understand** (KM-triggered) |

---

## §7 Depth obligations

Functions that must move from **present (any level)** or **absent** to **Level 3 minimum floor** on future runs.

### Recommended depth-floor table

**Legend:** **U** = universal · Archetype initial = primary owner · **Min L3** = mandatory floor · **Pref L4** = target richness where noted

| Function | U | Understand | Apply | Analyse | Evaluate | Generation note |
|----------|:-:|------------|-------|---------|----------|-----------------|
| Verification | **U** | L3 | L3 | L3 | L3 | §5 plan + §6 body: checks + repair |
| Transfer | | Opt L3 | Opt L3 | Opt L3 | **L3 Req** | `transfer_prompt` depth spec |
| Independent judgement | | — | — | — | **L3 Req** | Memo structure in spec |
| Worked analytic pass | | — | — | **L3 Req** | — | Analytic walkthrough shape |
| Worked example/thinking | | Opt L3 | **L3** (pref **L4**) | L3 | — | A2 pattern as Apply reference |
| Process/criteria exposition | | Opt L3 | **L3 Req** | **L3 Req** | **L3 Req** | Explicit block, not embedded only |
| Guided practice/analysis/judgement | | Opt L3 | **L3 Req** | **L3 Req** | **L3 Req** | Partial row or scoring guide in spec |
| Perspective + trade-offs | | — | — | Opt L3 | **L3 Req** | Evaluate inquiry depth |
| Worked judgement | | — | — | — | **L3 Req** | Weak/strong; anti-spoiler |
| Explanation + contrast | | **L3 Req** | — | Opt L3 | Opt L3 | Discrimination tables when KM triggers |
| Orientation/framing | | L3 | L3 | L3 | L3 | **Optional** polish phase (O3) |

### Depth specification mechanism (recommended)

Extend IFP-08 population discipline:

1. For each **R** function in archetype plan, attach **depth_floor: L3** and **sufficiency checklist** (five dimensions from [38K-2 §1](38K-2-function-depth-model.md)).  
2. DLA `specification` field must include **content obligations** from [38K-2 §4](38K-2-function-depth-model.md) sufficient column — not only material type.  
3. §6 GAM maps `purpose` keywords (`verification`, `worked analytic pass`, `transfer`, `independent judgement`) to **body templates** with minimum structural elements (e.g. checklist ≥4 rows, table ≥1 exemplar row).

**No new JSON schema fields required** — depth obligations live in specification prose and §6 templates, consistent with 38J approach.

---

## §8 Expected outcome

Hypothetical **`EV-38K-AFTER`** inflation rerun if recommendations R1–R7 implemented (no architecture change).

### Comparator table

| Dimension | EV-38G-AFTER | EV-38J-AFTER | Hypothetical EV-38K-AFTER |
|-----------|--------------|--------------|---------------------------|
| **Episode shape** | Shell-dominant | Recognisable on all four | Preserved from 38J |
| **GAM materials count** | 10 | 14 | **~18–22** (verification + transfer + templates per activity) |
| **Verification** | Sparse/absent | **L0 all** | **L3 all** — checklists/rubrics |
| **A1 Understand** | Study-write shell | Exposition + worked | + contrast, non-example, verification ([38K-4 E1](38K-4-target-state-depth-examples.md)) |
| **A2 Apply** | No worked example | Worked L4 + table | + process block, keyed verify, transfer ([38K-4 E2](38K-4-target-state-depth-examples.md)) |
| **A3 Analyse** | Scenario + table | Scenario + inquiry | + lenses, worked pass, partial row, audit ([38K-4 E3](38K-4-target-state-depth-examples.md)) |
| **A4 Evaluate** | Summary capstone | Policy Evaluate shape | Household memo + rubric + transfer ([38K-4 E4](38K-4-target-state-depth-examples.md)) |
| **Anti-spoiler** | FAIL A4 | PASS | PASS preserved |
| **Distance to 38I-4** | ~8× gap (38J-5) | ~2–3× improvement | **~1.3–1.8×** remaining (estimate) — approach minimum sufficiency, not full benchmark length |

*Distance estimate is qualitative — based on function coverage and [38K-1](38K-1-baseline-depth-analysis.md) word-count ratios; not a word-count target.*

### Likely learner experience changes

| Learner experience | 38G | 38J | 38K (if implemented) |
|--------------------|-----|-----|----------------------|
| "What do I do?" | Thin imperative | Segmented journey | Clearer closure steps per archetype |
| "Am I right?" | No | No | **Yes** — verification on every activity |
| "How does an expert think?" | Sometimes in GAM only | A2 strong; A3 weak | Modelling on Apply **and** Analyse **and** Evaluate |
| "What is my decision?" | N/A | Policy table + summary | **Owned memo** on Evaluate |
| "Does this apply to me?" | Rare | Field mention | **Transfer section** on Evaluate (required) |
| Overall feel | Task list | Improved coaching | **Self-contained instruction** approaching 38I-4 floor |

### What would **not** change

- Activity count (4)  
- Material type catalogue  
- Renderer/page composition path  
- KM/LO schema  
- IFP archetype topology  

---

## §9 Architecture assessment

Core question: *Are platform changes required to reach 38I-4 minimum sufficiency?*

| Layer | Required? | Conclusion | Evidence |
|-------|-----------|------------|----------|
| **Schema (KM/LO/DLA)** | **No** | Existing DLA fields carry depth in `specification`; no persistent IFP artefact needed | 38J implemented IFP without schema change ([38J-3](38J-3-dla-implementation.md)) |
| **ACM** | **No** | 38I-4 targets use existing types: `checklist`, `template`, `transfer_prompt`, `modelling_note`, `decision_table`, `analysis_table` | [38I-4 A4 evaluation questions](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) |
| **Renderer / app.js** | **No** | `EV-38J-AFTER-workbook.md` stitches all emitted bodies; gaps are emission/population not render loss | [38K-1 §8](38K-1-baseline-depth-analysis.md) |
| **Workflow** | **No** | Depth is §5 planning + §6 population; no new step | 38J charter hold |
| **Pack §5/§6 prompts** | **Yes** (future sprint) | **Only** recommended production surface for depth — not schema/renderer | This document §3 |

### Supporting evidence chain

```text
38I-4 plausibility (38I-4) → existing types sufficient
38J IFP + GAM-PRES → structure without schema
A2 Level 4 worked example → depth without new types
38K gap analysis → missing specs + thin bodies, not platform limits
```

**Conclusion:** Materially closer to 38I-4 is achievable through **generation behaviour changes alone** — specifically pack §5/§6 depth extensions and harness LO contract for Evaluate substance.

---

## §10 Implications for closure (38K-6)

### What 38K has proven

| # | Proposition | Evidence |
|---|-------------|----------|
| 1 | Episode structure problem is **largely solved** by 38J | [38K-1](38K-1-baseline-depth-analysis.md), [38J-5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) |
| 2 | Remaining gap is **primarily thin population** with structural secondary layer | 38K-1 §8 (~65–70% / ~30–35%) |
| 3 | **Level 3 sufficiency** is operable and teachable | [38K-2](38K-2-function-depth-model.md) five-dimension test |
| 4 | Depth requirements **differ by archetype** | [38K-3](38K-3-archetype-specific-depth-rules.md) |
| 5 | Minimum sufficient content is **concrete** | [38K-4](38K-4-target-state-depth-examples.md) E1–E4 |
| 6 | **No architecture expansion** required for minimum floor | [38K-1 §8](38K-1-baseline-depth-analysis.md), §9 above |
| 7 | **A2** proves pipeline can deliver Level 4 when specified | [38K-3 §4](38K-3-archetype-specific-depth-rules.md), [38K-4 E2](38K-4-target-state-depth-examples.md) |

### Remaining uncertainties

| # | Uncertainty | Resolution path |
|---|-------------|-----------------|
| 1 | Will models reliably populate Level 3 bodies from spec alone? | **EV-38K-AFTER** proof run after §5/§6 implementation |
| 2 | Is Evaluate substance fix harness-only or pack inference-only? | Trial with frozen household Evaluate LO set |
| 3 | Optimal checklist vs rubric vs keyed-answer per archetype | 38K-4 patterns; refine in implementation sprint |
| 4 | Full 38I-4 **benchmark** vs **minimum floor** distance after 38K | Compare EV-38K-AFTER word/function coverage to 38I-4 |
| 5 | KM richness interaction (5-concept vs richer KM) | Optional KM-only swap run ([38J-5 §10](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)) |

### Recommendations for 38K-6 closure

1. **Close 38-K SUCCESS** — depth model complete; implementation roadmap defined.  
2. **Charter successor implementation sprint** (38-K implementation or 38-L) scoped to: §5/§6 depth extensions R1–R7 only.  
3. **Mandate proof artefact** `EV-38K-AFTER-*` with comparator matrix vs `EV-38J-AFTER` + 38I-4.  
4. **Freeze design authority:** 38K-2 depth scale, 38K-3 archetype floors, 38K-4 examples, 38K-5 recommendations.  
5. **Explicit non-goals for implementation sprint:** schema, ACM, renderer, workflow, archetype count.  
6. **Success criterion for implementation:** All four activities meet [38K-3](38K-3-archetype-specific-depth-rules.md) minimum L3 profile on Required functions; Evaluate household anchor; verification on all.

### 38K programme verdict (draft for 38K-6)

> **38-K succeeded** at defining an evidence-backed depth model explaining how generation can move from episode **structure** to episode **sufficiency** without architecture changes. **Implementation** is the next programme step, not a platform redesign.

---

## Implementation roadmap summary

| Phase | Scope | Required refs |
|-------|-------|---------------|
| **A** | Universal verification (R1) + depth spec in IFP-08 (R2) | 38K-3 §7, 38K-4 E1–E4 verification sections |
| **B** | Evaluate pack (R5, R7) + GAM depth bodies (R3) | 38K-4 E4, 38I-4 A4 |
| **C** | Apply closure (O2) + Analyse modelling (R6) | 38K-4 E2, E3 |
| **D** | Understand discrimination (O1) | 38K-4 E1 |
| **E** | `EV-38K-AFTER` proof + 38K-6 closure | 38J-5 harness pattern |

---

## References

- [38K-1](38K-1-baseline-depth-analysis.md) · [38K-2](38K-2-function-depth-model.md) · [38K-3](38K-3-archetype-specific-depth-rules.md) · [38K-4](38K-4-target-state-depth-examples.md)  
- [38J-3 DLA](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md) · [38J-4 GAM](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md) · [38J-5 proof](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)  
- [38I-4 targets](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

---

**Parent:** [38K observations index](README.md) · **Charter:** 38K-5 · **Next:** 38K-6 Sprint closure

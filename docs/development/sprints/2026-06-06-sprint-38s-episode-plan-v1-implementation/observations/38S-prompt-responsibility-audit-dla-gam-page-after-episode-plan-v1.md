# 38S Prompt Responsibility Audit — DLA/GAM/Page after Episode Plan V1

**Date:** 2026-06-08  
**Status:** **COMPLETE — investigation only; no behaviour changes**  
**Type:** Read-only prompt and prompt-building audit  
**Sprint:** [38S Episode Plan V1 implementation](../README.md)  
**Inputs:** `domains/learning-design/domain-learning-design-step-patterns.md` (§5, §6, §7, §14) · `app.js` (`applyWorkflowStepRuntimePromptAugmentations`, shared contract blocks) · `lib/episode-plan-dla-integration.js` · `lib/ld-materials-copy.js` · `lib/gam-output-format.js` · [38Q-3 gap analysis](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) · production run artefacts `EV-38S-AFTER-4-*`

---

## Executive summary

**Primary question:** Is prompt responsibility debt the reason the architecture works structurally but learner-facing materials remain educationally thin?

**Answer: Yes — predominantly at DLA; secondarily via cross-layer prompt conflicts that weaken GAM depth despite strong pack text.**

Episode Plan V1 and runtime population injection (38S-3) are **correct in intent** but **dwarfed in the live prompt** by a ~30k-character DLA pack block that still performs full pre–Episode Plan instructional planning (IFP-00…IFP-10). The DLA pack **does not mention `episode_plans` in Context/Task** even though workflow policy requires it as input. GAM pack text is **depth-forward** (L3 floors, word minima, anti-collapse) but competes with runtime blocks that use **“short” / “concise”** language, and it receives **thin obligation specifications** when the LLM follows IFP planning instead of beat-population. Page prompts are **preserve-oriented** and are **unlikely to be the primary thinness driver** after 38S materials-projection fixes.

**Recommended next fix target:** DLA pack de-scope (remove IFP archetype replanning; reframe Task as population-only; anchor Context on `episode_plans`). **Do not change:** Episode Plan V1 schema, archetypes, FunctionEnum, deterministic derive, or proven population-contract code paths until DLA prompt realignment is drafted.

---

## 1. Pre–Episode Plan legacy prompt text still present?

**Yes — extensively in DLA; minimally in GAM/Page.**

### DLA (`domain-learning-design-step-patterns.md` §6)

| Legacy responsibility | Present in pack? | Location / evidence |
|----------------------|:----------------:|---------------------|
| Design learning activity sequence | **Yes** | Task: *“Design executable learning_activities…”*; IFP-00 SEQUENCE; IFP-07 SESSION ARC |
| Decide instructional flow / progression | **Yes** | *“Ensure activities collectively cover all outcomes and progress from understanding → application → evaluation”*; DLA-WB-05 ordering/fading; IFP-02 full archetype function orders |
| Choose archetype | **Yes** | IFP-01 ARCHETYPE SELECTION (LO-ARC, AP-OVERRIDE, AN-ASSESS rules) — **duplicates Episode Plan** |
| Plan transitions / episode choreography | **Yes** | IFP-07 ARC-01…06; Transition in preamble guidance |
| Create activity choreography | **Yes** | IFP-08 derive materials from function plan; session arc by `activity_index` |
| Generate material obligations (inventing structure) | **Yes** | IFP-08/09/10 + DLA-WB-22…31 — obligations invented from IFP, not strictly from upstream beats |
| Realise materials (bodies) | **No** (correct) | *“do not generate full material content”*; LD-MATERIALS-COPY spec role |
| Summarise / describe resources only | **Partial** | Correct at obligation layer, but IFP anti-shell language still allows type-only specs if gates pass nominally |

**Critical mismatch:** Pack **Input** lists `episode_plans`, but **Context** reads: *“You are provided with learning_outcomes (and optionally knowledge_model or learning_content)”* — **`episode_plans` omitted from the primary task framing.**

### GAM (`domain-learning-design-step-patterns.md` §7)

| Legacy responsibility | Present? | Notes |
|----------------------|:--------:|-------|
| Re-plan episode / select archetype | **Explicitly forbidden** | GAM-PRES-00, *“do not redesign activities”* |
| Summarise materials | **Forbidden** | LD-MATERIALS-COPY, GAM-WB-00, usability anti-patterns |
| Describe-only output | **Forbidden** | *“do not restate the specification only”*; forbids *“should include”*, *“describe”*, *“specification”* in output |

**Residual legacy (weaker):** `defaultPromptNotes` includes *“Use DLA LO/KM intent to realise richer instructional episodes (orientation/activation/…)”* — episode-shaping language that belongs upstream, though GAM-PRES blocks partially counter it.

### Page (`domain-learning-design-step-patterns.md` §14)

| Legacy responsibility | Present? | Notes |
|----------------------|:--------:|-------|
| Generate page from activities (redesign) | **No** | *“read-only composition step; do not redesign pedagogy”* |
| Summarise materials | **Discouraged** | LD-MATERIALS-COPY preserve; forbidden placeholder labels |
| Summary-oriented assembly | **Partial guard only** | *“shorten only clearly non-essential prose when genuinely too long”* — could still justify thinning if model interprets bodies as “non-essential” |

### Shared runtime helpers (`app.js`)

| Helper | Steps | Legacy / conflict signal |
|--------|-------|--------------------------|
| `buildDlaPopulationOnlyPromptBlock` | DLA | **38S-correct** — population-only, forbids replanning (~789 chars) |
| `buildEpisodePlanUpstreamPromptSection` | DLA | Injects authoritative JSON when capture exists |
| IFP block in pack | DLA | **Pre-38S planning authority** (~majority of 30k template) |
| `buildPelOrientationContractPromptBlock` | DLA, Page | Session journey / overview — appropriate for Page; **overlaps IFP-07 on DLA** |
| `buildPelReasoningContractPromptBlock` | DLA, GAM | Cognition fields — additive, not structural replanning |
| `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | GAM | **“short worked micro-example”**, **“concise … cues”** — conflicts with GAM-PRES-08 depth |
| `buildSelfDirectedGamReadingSufficiencyPromptBlock` | GAM | **Pro-depth** (150–300+ words) — aligns with North Star |
| `buildLdMaterialsCopyPromptBlock` | GAM (runtime author role); Page (preserve via compose) | **Not injected at runtime for DLA** — DLA relies on pack inline mention only |
| `buildLdDesignPageComposePromptBlock` | Page | Preserve merge — aligns with 38S architecture |

---

## 2. Sections duplicating Episode Plan responsibility

Episode Plan V1 owns: **archetype**, **ordered instructional-function beats**, **episode choreography (at plan level)**.

| Duplicated responsibility | Owner (38S) | Still claimed by | Conflict severity |
|---------------------------|-------------|------------------|:-----------------:|
| Archetype selection | Episode Plan derive | DLA IFP-01 LO-ARC, AP-OVERRIDE, AN-ASSESS | **Critical** |
| Ordered function sequence | Episode Plan `beats[].function` | DLA IFP-02 templates (Understand/Apply/Analyse/Evaluate orders) | **Critical** |
| KM trigger upgrades to sequence | Episode Plan + population contract | DLA IFP-03 KM-T01…T08 (replan function_sequence) | **High** |
| Session / activity arc | Episode Plan + LO mapping | DLA IFP-07, DLA-WB-25, PEL orientation on DLA | **High** |
| Beat → obligation mapping | Population contract (38S-2) | DLA IFP-08/09/10 + DLA-WB rows | **High** — parallel obligation systems |
| Transition planning | Deferred in V1 | DLA IFP-07 Transition cues in preamble | **Medium** |

**Runtime 38S block explicitly forbids** archetype selection, beat sequencing, fade choreography, transition planning, and inventing functions not in the plan — but it is **~2.4% of DLA pack size** and appears **after** thousands of characters of contradictory IFP instructions. Models typically weight early Task/Instructions heavily.

---

## 3. Prompt language that may explain thin materials

### DLA — obligation layer thinned by role confusion

| Signal | Effect |
|--------|--------|
| LD-MATERIALS-COPY in DLA: *“specify types/requirements only; GAM authors material bodies”* | Correct split, but encourages **specification prose** not **L3 teaching obligations** unless IFP-09 gates win attention |
| *“concise support_note when useful”* (`defaultPromptNotes`) | Minor; not primary |
| IFP internal planning framed as *“not a stored artefact”* | Model may under-invest in specification depth |
| DLA-WB rows require `depth_floor: L3` in spec | **Strong on paper**; undermined when LLM replans via IFP instead of mirroring beats |
| *“descriptive-only”* forbidden for **activities** | Does not forbid thin **material specifications** |

### GAM — depth rules present but competing signals

**Pro-depth (pack):**

- GAM-PRES-08: verification ≥4 items; worked analytic pass ≥120 words; transfer ≥80 words
- GAM-WB-01: exposition ≥120 words
- GAM-WB-02: full worked_example / sample_output bodies
- Usability: *“Materials must be complete enough to use without major rewriting”*
- Forbids *“describe”*, *“specification”* in output

**Anti-depth / thinness signals:**

| Source | Text | Risk |
|--------|------|------|
| GAM `reflection_prompt` guidance | *“brief reflection cues”* | Low if not substituting checklist/transfer |
| GAM output org | `Purpose: <brief purpose>` | Labels only — low risk |
| Runtime `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | *“one **short** worked micro-example”*; *“concise … cues”*; closure *“2–3 items”* | **Medium–High** — contradicts GAM-PRES-08 minima |
| Runtime LD-SELF-DIRECTED-RHETORIC (GAM role) | Scope excludes materials bodies — good | — |
| `lib/gam-output-format.js` | `MIN_TEACHING_BODY = 120`, `MIN_CHECKLIST_BODY = 80` | **Validator exists**; prompt compliance not guaranteed at generation time |

### Page — summary risk lower post-38S

- Strong preserve language; PREC-02 materials over overview
- Residual: *“near-verbatim”* + optional shortening of non-essential prose
- Sprint 38 visual affordance block warns figures must not *“omit or shorten page materials”*
- **Recent 38S code fixes** (materials fidelity merge) addressed synopsis substitution — thin page was often **compose/merge**, not pack wording alone

---

## 4. Prompt size / profile comparison

Measured from pack JSON (`promptTemplate` + `defaultPromptNotes`) on 2026-06-08:

| Step | Pack section | `promptTemplate` chars | Notes chars | Template lines | 38S-aligned responsibility in pack | Legacy / conflicting responsibility |
|------|--------------|------------------------:|------------:|---------------:|-------------------------------------|-------------------------------------|
| **Episode Plan** | §5 | 753 | 218 | 17 | **Yes** — deterministic derive, V1 shape | None significant |
| **DLA** | §6 | **30,550** | 2,671 | 113 | **Partial** — LD-MATERIALS-COPY spec role; depth_floor in IFP-09 | **IFP-00…IFP-10**, DLA-WB session design, archetype templates, progression |
| **GAM** | §7 | **26,544** | 1,810 | 126 | **Yes** — GAM-PRES, L3 realisation, anti-collapse | Residual “richer instructional episodes” in notes |
| **Page** | §14 | 8,460 | 1,600 | 66 | **Yes** — compose/preserve | Optional shortening clause |

**Runtime augmentation (DLA only — 38S-specific):**

| Block | Approx. size | Role |
|-------|-------------|------|
| `buildDlaPopulationOnlyPromptBlock` | ~789 chars | Population-only gate |
| `buildEpisodePlanUpstreamPromptSection` | Variable (full plan JSON) | Authoritative beats |

**Estimated fully augmented prompt (self-directed learner-page workflow, typical):**

| Step | Pack base | + Runtime contracts (order of magnitude) | Dominant voice |
|------|-----------|------------------------------------------|----------------|
| DLA | ~33k | +2–8k (self-directed scaffolds, PEL, table fidelity, math, JSON, 38S block, plan JSON) | **IFP / DLA-WB** |
| GAM | ~28k | +3–6k (materials copy, table fidelity, reading sufficiency, voice, PEL reasoning, timeline) | **GAM-PRES / GAM-WB** (pack) with PEL thinning overlay |
| Page | ~10k | +4–8k (compose, materials preserve, Sprint 38 VA, rhetoric, math, JSON) | **Preserve** |

---

## 5. Does prompt architecture reflect the intended responsibility split?

**Intended:**

```text
LO → Episode Plan (archetype + beats)
   → DLA (obligations + metadata, beat order preserved)
   → GAM (full material bodies per obligation)
   → Page (compose/preserve)
```

**Actual prompt authority (what the model is told):**

```text
LO → Episode Plan (deterministic — correct)
   → DLA: IFP replans archetype + function sequence + session arc
          THEN 38S footer says “population-only”
   → GAM: “DLA is source of truth” BUT also “realise richer episodes”
          + runtime “short micro-example” overlay
   → Page: preserve (aligned)
```

| Layer | Intended | Prompt reality | Match? |
|-------|----------|----------------|:------:|
| Episode Plan | Planning authority | Pack + derive — aligned | ✅ |
| DLA | Beat → obligations | IFP still planning authority in pack | ❌ |
| GAM | Obligation realisation | Mostly aligned; runtime conflicts | ⚠️ |
| Page | Preserve materials | Aligned post-38S | ✅ |

**Post-capture enforcement** (`applyPopulationContractToLearningActivities`, merge scaffold) can **correct structure after LLM emission** — but raw LLM output and obligation **specification richness** still follow the dominant IFP prompt. That matches observed production: **correct tags/order, thin specification prose, thin GAM bodies.**

---

## 6. Did DLA and GAM prompts shrink after Episode Plan?

**No.**

| Observation | Detail |
|-------------|--------|
| Episode Plan added | New §5 prompt ~971 chars total — minimal |
| DLA size | **~33k chars** — IFP-00…IFP-10 and DLA-WB-01…31 accumulated across 38E–38L **before** 38S; **not removed** when Episode Plan was introduced |
| GAM size | **~28k chars** — GAM-PRES / GAM-WB depth blocks added in 38J–38L; **not shrunk** after Episode Plan |
| 38S addition | ~789-char runtime DLA block + upstream JSON injection — **<3% of DLA prompt mass** |

**Why shrink did not happen:**

1. 38S implemented **runtime population contract + merge** without **pack de-scoping** of IFP.
2. Depth/emission gates (38L) were **layered onto IFP** rather than replacing it with beat-driven population specs.
3. Charter explicitly deferred prompt trimming to post-proof diagnosis (this audit).

---

## 7. Prompt debt register

| Prompt / Function | Legacy responsibility found | Why it conflicts with 38S | Likely effect | Recommended future action |
| ----------------- | --------------------------- | ------------------------- | ------------- | ------------------------- |
| DLA pack `promptTemplate` — IFP-01…02 | Archetype + function template selection | Episode Plan V1 already derives `archetype` + `beats[].function` | Model replans beats; ignores or fights upstream plan JSON | **Remove IFP-01/02**; replace Task with “populate from `episode_plans`” |
| DLA pack — IFP-03 KM triggers | Replan `function_sequence` after template load | Beat set should come from plan + deterministic population contract | Extra/missing beats vs canonical plan | Move KM triggers to **population contract** or Episode Plan derive rules — not LLM DLA |
| DLA pack — IFP-07 / DLA-WB-25 | Session arc, fade, capstone choreography | Multi-activity arc is LO/session design, not beat population | Wrong activity count, capstone table dumps, misfaded materials | Retain **only** beat-order preservation + `learner_task` assembly from beats |
| DLA pack — Context/Task | *“Design executable learning_activities”* from LO/KM | Implies greenfield activity design | LLM treats step as designer, not populator | Rewrite Context to lead with **`episode_plans`**; Task = obligation population |
| DLA pack — progression line | *“understanding → application → evaluation”* across activities | Session progression ≠ beat population | Spurious multi-activity structure | Remove or relocate to Construct Learning Sequence / brief options |
| DLA `defaultPromptNotes` — IFP reference | *“IFP archetype templates … mandatory internal planning”* | Directly contradicts 38S-3 runtime block | Reinforces replanning after footer correction | Replace with population-contract summary |
| DLA runtime 38S block | Population-only (correct) | Appended **after** IFP; low salience | Insufficient to override IFP | Move to **top** of Task; shorten IFP removal rather than append-only |
| GAM `defaultPromptNotes` | *“realise richer instructional episodes”* | Implies episode replanning | Model reorders or collapses materials | Narrow to *“realise each required_materials row per GAM-PRES”* |
| GAM runtime PEL reasoning materials | *“short worked micro-example”*, *“concise cues”* | Conflicts GAM-PRES-08 ≥120w / A1 walkthrough | M1 definition-only, M2 minimal steps, M8 thin analytic pass | Align runtime block with GAM-PRES-08 minima or gate behind weak-spec detection |
| GAM pack — dual depth systems | GAM-PRES-08 L3 + GAM-WB + 38K sufficiency | Long prompt; attention decay | Model satisfies checklist structurally, not pedagogically | After DLA fix, **trim redundant** GAM-WB duplicates (keep GAM-PRES + one WB gate set) |
| Page pack — shorten clause | Non-essential prose reduction | Could thin bodies if misapplied | Secondary risk post merge-fix | Keep; rely on LD-MATERIALS-COPY PREC-02 (already runtime) |
| Page — knowledge_summary | Synthesis section | Not material bodies | Overview thinning separate from M1–M8 | No change in prompt pass |
| LD-MATERIALS-COPY runtime on DLA | Not injected (GAM-only author block) | DLA only sees inline “spec only” | Correct for role; specs still thin | Add **obligation-depth** author analogue for DLA specs (not bodies) in future |
| `gam-output-format.js` validators | L3 body minima | Not wired as hard pre-capture prompt feedback in all paths | Thin bodies pass manual review until validated | Ensure generation UI surfaces DEPTH-FAIL before accept (operational, not pack) |

---

## 8. Root cause of thin North-Star gap (A–G)

| Code | Hypothesis | Verdict | Confidence |
|------|------------|:-------:|:----------:|
| **A** | DLA prompt still doing planning work | **Primary cause** | **High** |
| **B** | GAM prompt too vague about depth | **Partial** — pack is explicit; vagueness is in **competing runtime blocks** | Medium |
| **C** | GAM constrained toward short summaries | **Secondary** — PEL “short/concise” + weak upstream specs | Medium |
| **D** | Page prompt summary-oriented | **Unlikely primary** after 38S projection fixes | Low |
| **E** | Prompt-role conflicts across DLA/GAM/Page | **Yes** — IFP vs 38S block; GAM-PRES vs PEL thinning | **High** |
| **F** | Missing operational `depth_floor: L3` | **Partial** — specified in DLA IFP-09/GAM-PRES-08 but **not operationalised in LLM obedience**; validators exist in `gam-output-format.js` | Medium |
| **G** | Other (merge, token limits, model behaviour) | Merge/post-process can drop rows — **implementation**, documented in 38S-5; not this audit’s focus but can compound prompt debt | Medium |

**Synthesis:** Thin M1/M2/M8/A4 in the manual production run is **most consistent with A + E + F**: DLA still plans like pre-38S, produces structurally tagged but **pedagogically thin obligations**; GAM receives weak specs and **mixed depth signals**; Page preserves what it gets.

**Not the primary explanation:** Page summarisation (D) — recent fixes show full GAM bodies **can** reach render when merge runs.

---

## 9. What should not be changed (per charter)

- Episode Plan V1 schema (`archetype` + `beats[].function` only)
- Archetypes and FunctionEnum taxonomy
- Deterministic `deriveEpisodePlansFromLearningOutcomes`
- Population contract logic in `lib/episode-plan-population-contract.js` / merge annotate path
- GAM-PRES / depth_floor **semantics** (38K–38L) — **trim duplication**, do not weaken bars
- Page preserve contracts and 38S materials-projection code

---

## 10. Recommended next actions (future sprint — not implemented here)

1. **DLA pack rewrite (highest leverage):** Remove IFP-01…07; reframe §6 as population-only; Context = `episode_plans` + optional KM; Task = map each beat → `required_materials[]` row with L3 specification obligations from `FUNCTION_SPECS`; keep DLA-WB **row-type checklist** only where not redundant with beats.
2. **Prompt ordering:** Place 38S population contract + upstream JSON **immediately after Task**, before any legacy text, until pack is cleaned.
3. **GAM runtime alignment:** Revise `buildSelfDirectedGamPelReasoningMaterialPromptBlock` to reference GAM-PRES-08 minima instead of “short/concise”.
4. **GAM pack trim (second pass):** Collapse overlapping GAM-WB / GAM-PRES repeats to reduce attention decay (~28k → target ~15k).
5. **Operational depth gate:** Surface `gam-output-format.js` DEPTH-FAIL at capture time for manual workflow.
6. **Re-proof:** Same inflation workbook path (`EV-38S-AFTER-4` harness) after prompt-only changes.

---

## 11. Acceptance criteria checklist

| Criterion | Met? |
|-----------|:----:|
| Old prompt responsibilities identified | ✅ |
| DLA/GAM/Page match 38S architecture | ❌ DLA mismatch; GAM/Page partial |
| Prompt bloat / overlap likely causing thin materials | ✅ |
| Next fix target identified | ✅ DLA de-scope + GAM runtime conflict trim |
| What not to change documented | ✅ |

---

## Appendix — Key file references

| Asset | Path |
|-------|------|
| DLA pack | `domains/learning-design/domain-learning-design-step-patterns.md` §6 |
| GAM pack | Same file §7 |
| Page pack | Same file §14 |
| Episode Plan pack | Same file §5 |
| Runtime augmentation entry | `app.js` → `applyWorkflowStepRuntimePromptAugmentations` |
| 38S DLA population block | `lib/episode-plan-dla-integration.js` → `buildDlaPopulationOnlyPromptBlock` |
| Materials copy contract | `lib/ld-materials-copy.js` |
| GAM depth validation | `lib/gam-output-format.js` |
| Population contract specs | `lib/episode-plan-population-contract.js` → `FUNCTION_SPECS` |

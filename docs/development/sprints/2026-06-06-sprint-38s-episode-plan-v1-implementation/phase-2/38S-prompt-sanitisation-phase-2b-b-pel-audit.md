# 38S Phase 2B-b — PEL / Runtime Responsibility Audit (Read Only)

**Date:** 2026-06-08  
**Status:** **COMPLETE — audit only; no prompt or code changes**  
**Type:** Read-only PEL/runtime augmentation audit  
**Sprint:** [38S Episode Plan V1 implementation](../README.md)  
**Predecessors:** [Phase 2A DLA sanitisation](./38S-prompt-sanitisation-phase-2a-dla-only.md) · [Phase 2B GAM audit](./38S-prompt-sanitisation-phase-2b-gam-audit.md) · [Phase 2B GAM dedupe](./38S-prompt-sanitisation-phase-2b-gam-dedupe.md) · [Responsibility audit (DLA/GAM/Page)](./38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md)  
**Inputs:** `app.js` (`applyWorkflowStepRuntimePromptAugmentations`, PEL blocks ~6970–9380, scaffolds ~9890–9984) · `lib/ld-self-directed-rhetoric.js` · `lib/episode-plan-dla-integration.js` · post-2B pack sizes from `probe-38b1-ld-workflow-prompt-audit.js`

---

## Executive summary

**Question:** Which PEL/runtime blocks still uniquely own behaviour after Episode Plan → DLA population → GAM realisation — and which explain shallow Inflation materials?

**Answer:**

1. **Runtime augmentation is large and mostly pre–Episode Plan self-directed workbook scaffolding**, not Episode Plan or population-contract logic. For a typical self-directed learner-page workflow, runtime adds **~17.9k chars to DLA** (+41%) and **~12.0k chars to GAM** (+60%) on top of post-2B packs.

2. **The highest-conflict thinness signals (`short worked micro-example`, `concise cues`, closure `2–3 items`) live in `buildSelfDirectedGamPelReasoningMaterialPromptBlock` — but that block is often NOT injected** because `resolvePedagogicEnrichmentContractIds()` returns `[]` when the brief blob matches facilitated-delivery heuristics (notably the word **`workshop`**). Inflation EV runs use *“inflation workshop”* language → PEC blocks suppressed → **GAM-PRES-08 conflicts from this block are absent in those runs**.

3. **Shallow signals that DO apply to Inflation workshop runs** come from: DLA self-directed output contract (concise preambles, short hints, thin example JSON), `LD-SELF-DIRECTED-RHETORIC` (closure `2–3 epistemic bullets`), and material-shape cap on checklist scope — plus **residual pack debt** (GAM `brief`/`minimal`, DLA IFP planning — out of 2B-b scope but still dominant).

4. **Unique keepers:** L4 fidelity (table + materials copy), math render, timeline sequencing, GAM learner voice, Episode Plan population block, and conditional reading sufficiency. **Merge/remove candidates:** PEL orientation/reasoning duplicated across DLA output contract + PEL blocks + LD-SELF-DIRECTED-RHETORIC; GAM PEL reasoning materials when GAM-PRES-08 already governs depth.

**Hypothesis verdict:** Residual PEL **partly** explains shallowness via **signal competition and attention decay**, but for Inflation specifically the **`workshop` gate suppresses the worst GAM PEL conflict block**. Primary thinness drivers remain **DLA pack replanning debt** + **runtime DLA field/rhetoric blocks that pre-specify thin cognition shapes** + **pack-level GAM thinness tokens** — not absence of depth rules.

---

## A. PEL Responsibility Map

Entry point: `applyWorkflowStepRuntimePromptAugmentations()` — ordered chain:

```
Pedagogic cognition → Self-directed scaffolds → LD-TABLE-FIDELITY → LD-MATERIALS-COPY
→ Pedagogic enrichment (PEL) → Sprint 38 visual (Page only) → Design Page compose
→ LD-MATH-RENDER → Strict JSON → Episode Plan population (DLA only)
```

Gating: self-directed learner-page scaffolds require `delivery_context ∈ {self_directed, async, online_async}` (or self-study language in goal) **and** learner-page output intent. **PEL enrichment uses an additional gate:** `isWorkflowBriefFacilitatedDeliveryIntent()` — **`workshop` in goal suppresses all PEC blocks even when delivery is self_directed.**

### DLA — self-directed learner page (measured: +17,902 chars runtime, pack seeded 24,491 → augmented 42,393)

| Runtime block | ~Chars | Purpose | Recommendation |
|---------------|-------:|---------|----------------|
| **Episode Plan population contract** | 789 | Population-only gate; forbids replanning | **Keep (A)** — unique 38S authority |
| **Self-directed material shape** | ~1,450 | Markdown/table structure; checklist scope cap | **Merge (B)** — partial overlap with LD-TABLE-FIDELITY spec role + DLA pack IFP-09 |
| **Self-directed activity framing** | ~1,050 | `activity_preamble` + cognition field coverage | **Merge (B)** — duplicated by DLA output contract + PEL orientation/reasoning |
| **DLA output contract override** | ~2,850 | Field schema for PEL cognition keys | **Merge (B)** — overlaps PEL blocks + pack removed IFP-07 residue; keep one canonical surface |
| **DLA output contract example** | ~2,200 | JSON shape example; warns against thin single-material | **Keep with trim (D)** — example embeds “Short paired excerpts” (thinness signal in demo) |
| **Timeline sequencing alignment** | ~1,522 | Sequencing task / non-chronological source lists | **Keep (A)** — unique cognitive-task alignment |
| **LD-TABLE-FIDELITY (spec role)** | ~1,967 | Pipe-table obligation specs for GAM | **Keep (A)** — unique DLA→GAM handoff |
| **LD-SELF-DIRECTED-RHETORIC (dla rider)** | ~3,412 | Session journey, progression, closure rhetoric | **Merge (B)** — overlaps PEL orientation + DLA output contract |
| **LD-MATH-RENDER** | ~1,220 | TeX delimiter contract | **Keep (A)** — unique renderer contract |
| **PEL orientation contract** | ~1,594 | Session/overview/study_orientation rules | **Remove on DLA (B)** — gated off for “workshop” briefs; duplicated on Page; EP owns arc |
| **PEL reasoning contract** | ~1,637 | Cognition field semantics | **Merge (B)** — duplicated in DLA output contract |
| **Pedagogic cognition contract** | 0–800 | Brief-driven cognition packs | **Keep if packs active (A)** — conditional |

### GAM — self-directed learner page (measured: +11,993 chars runtime, pack seeded 20,013 → augmented 32,006)

| Runtime block | ~Chars | Purpose | Recommendation |
|---------------|-------:|---------|----------------|
| **LD-TABLE-FIDELITY (author role)** | ~2,693 | Pipe tables, row adequacy | **Keep (A)** — unique material shape enforcement |
| **LD-MATERIALS-COPY (author role)** | ~1,160 | Full bodies not catalogue labels | **Keep (A)** — aligns with GAM-PRES anti-collapse |
| **Reading sufficiency** | ~717 | 150–300+ word readings | **Keep (A)** — pro-depth; unique runtime floor |
| **Material voice** | ~1,071 | Ban facilitator headings/choreography | **Keep (A)** — unique self-directed guard |
| **Timeline sequencing alignment** | ~1,522 | Same as DLA | **Keep (A)** |
| **LD-SELF-DIRECTED-RHETORIC (gam rider)** | ~3,608 | Closure/debrief realisation | **Merge (B)** — “full prose not outline” overlaps GAM-PRES; closure `2–3 bullets` **conflicts (C)** |
| **LD-MATH-RENDER** | ~1,220 | TeX | **Keep (A)** |
| **PEL reasoning contract** | ~1,637 | Cognition field semantics | **Remove on GAM (B)** — fields live on DLA row; GAM should realise specs |
| **GAM PEL reasoning materials** | ~2,039 | Worked micro-example, concise cues, 2–3 closure | **Remove/replace (C)** — conflicts GAM-PRES-07/08; **often absent** due to workshop gate |
| **Pedagogic cognition contract** | 0–800 | Cognition cue sections in materials | **Keep if packs active (D)** — verify pack overlap |

### Workbook scope note

“Self-directed workbook generation” in this codebase = **DLA obligation population + GAM material realisation + Page compose** for `delivery_context: self_directed` with learner-page outputs. There is no separate workbook runtime chain — PEL blocks above *are* the workbook augmentation surface.

---

## B. Ownership Analysis

Classification key: **A** unique keep · **B** duplicate · **C** conflict · **D** unclear / manual review

### DLA — major instructions

| Instruction | Class | PEL → Owner? | If removed, behaviour lost? |
|-------------|:-----:|--------------|----------------------------|
| Episode Plan population-only; PF-11 gate | **A** | **Unique (38S)** | DLA replans beats; obligations untagged |
| Material shape: markdown line breaks, multiline tables | **A** | **Unique (runtime formatting)** | Compressed one-line markdown in specs |
| Material shape: cap checklist ~4 items per short writing task | **C** | **Conflicts depth_floor L3** | Possibly broader checklists — **may improve depth** |
| Material shape: short orienting text before comparison | **D** | GAM-PRES-03 partial | Thin orienting passages vs named entity intros |
| Activity framing: 1–3 concise preamble sentences | **B** | DLA contract + PEL orientation | Same preamble rule elsewhere |
| Activity framing: scaffold_hint_sequence 2–3 short hints | **B** | DLA output contract | Same |
| DLA output contract: full PEL field schema | **B** | DLA pack + PEL blocks | Field list still in pack schema |
| DLA output contract: self_explanation “one short sentence” | **C** | Conflicts generative retrieval depth | Shorter prompts — **may worsen depth** |
| DLA example: “Short paired excerpts” in demo JSON | **C** | Teaches thin spec pattern | Model may copy thin example |
| Timeline sequencing: non-chronological source lists | **A** | **Unique** | Sequencing tasks broken |
| LD-TABLE-FIDELITY spec role | **A** | **Unique L4** | Table specs become prose descriptions |
| LD-SELF-DIRECTED-RHETORIC: session journey / progression | **B** | EP + Page overview; was IFP-07 | Journey framing on activity JSON |
| LD-SELF-DIRECTED-RHETORIC: closure 2–3 epistemic bullets | **C** | Conflicts GAM-PRES-08 transfer/closure depth | Thinner closure sections |
| PEL orientation: study_orientation, intellectual_frame | **B** | DLA output contract + Page | Duplicate orientation rules |
| PEL orientation: session journey in overview | **B** | EP beats + Page compose | Duplicate arc planning on DLA |
| PEL reasoning: reasoning_orientation, evidence_use, etc. | **B** | DLA output contract | Same cognition semantics |
| PEL reasoning: “one concise reasoning cue set per activity” | **C** | Conflicts depth_floor expansion | Thinner reasoning scaffolds |

### GAM — major instructions

| Instruction | Class | PEL → Owner? | If removed, behaviour lost? |
|-------------|:-----:|--------------|----------------------------|
| LD-MATERIALS-COPY: full usable bodies not outlines | **A** | **Unique L4** (also GAM-PRES) | **Reinforcement** — pack already says this |
| LD-TABLE-FIDELITY: row adequacy, pipe tables | **A** | **Unique L4** | Thin/CSV tables |
| Reading sufficiency: 150–300+ words | **A** | **Unique runtime floor** | Ultra-short readings |
| Reading sufficiency: “brief explanations” | **D** | Ambiguous vs 150–300+ rule | Minor — pro-depth rule dominates |
| Material voice: no facilitator headings | **A** | **Unique** | Facilitator prose in materials |
| Material voice: do not restate activity fields in prose | **A** | **Unique anti-duplication** | Verbose duplication in bodies |
| LD-SELF-DIRECTED-RHETORIC gam rider: full prose not outline labels | **B** | GAM-PRES-09 anti-collapse | Duplicate anti-outline |
| LD-SELF-DIRECTED-RHETORIC: closure 2–3 epistemic bullets | **C** | **Conflicts GAM-PRES-08** | May **increase** closure depth if removed |
| PEL reasoning on GAM | **B** | DLA fields + GAM-PRES realisation | Duplicate HOW-TO-THINK on author step |
| GAM PEL reasoning: “one short worked micro-example” | **C** | **Conflicts GAM-PRES-08 ≥120w** | Model may still minify — **removal reduces conflict** |
| GAM PEL reasoning: “concise if X revisit Y cues” | **C** | Conflicts verification checklist depth | Thinner misconception interrupts |
| GAM PEL reasoning: closure/debrief “2–3 items” | **C** | Conflicts transfer ≥80w | Thin closure bullets |
| GAM PEL reasoning: realise as “short worked examples only” | **C** | Conflicts material fidelity | Bodies stay artefact-thin |

### Cross-step duplicates (same text, multiple steps)

| Text / responsibility | Steps | Owner should be |
|----------------------|-------|-----------------|
| Timeline sequencing | DLA, GAM | **DLA spec** + **GAM realisation** — keep both but **single shared module (already is)** |
| Cognition field definitions | DLA contract, PEL orientation, PEL reasoning, LD-SELF-DIRECTED-RHETORIC | **DLA population contract only** |
| Session / intellectual journey | PEL orientation, LD-SELF-DIRECTED-RHETORIC, (removed) IFP-07 | **Episode Plan + Page** |
| Anti-facilitator language | Material voice, PEL orientation, LD-SELF-DIRECTED-RHETORIC | **One L7 voice module** |
| Table/material fidelity | LD-TABLE-FIDELITY, LD-MATERIALS-COPY, GAM-PRES, pack | **Keep L4 modules**; pack duplication trimmed in 2B |

---

## C. Conflict Analysis — instructions vs depth expectations

| Source | Conflicting text | Competes with | Severity (Inflation workshop run) |
|--------|------------------|---------------|:---------------------------------:|
| `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | *“one **short** worked **micro-example**”* | GAM-PRES-08 worked analytic ≥120 words | **High** — but **block absent** when brief contains `workshop` |
| Same | *“**concise** if X, revisit Y cues”* | GAM-PRES-08 verification ≥4 items | **High** (when block present) |
| Same | *“Closure … **(2–3 items)** — **concise** judgement/transfer”* | GAM-PRES-08 transfer ≥80 words | **High** (when block present) |
| `LD-SELF-DIRECTED-RHETORIC` | *“### Closure or ### Debrief with **2–3** epistemic bullets”* | GAM-PRES-08 closure depth | **Medium** — **always on GAM** |
| DLA output contract | *“one **short** generative-retrieval sentence”* | IFP-09 / depth_floor L3 self-explanation | **Medium** — **always on DLA** |
| DLA output contract / framing | *“**1–3 concise** sentences”* preamble | None (field length) — but sets tone | **Low–Medium** |
| DLA material shape | *“~four meaningful items per **short writing** task”* | L3 checklist minima | **Medium** |
| DLA example JSON | *“**Short** paired excerpts”* | Reading sufficiency 150–300+ | **Medium** — teaches thin spec |
| GAM reading sufficiency | *“**brief** explanations”* (same block as 150–300+) | Same block’s word minimum | **Low** — net pro-depth |
| Pack GAM (not PEL) | `brief`, `minimal assumptions` in template | GAM-PRES-07/08 | **High** — see Phase 2B audit |

**Plausibility for shallow Inflation materials:**

| Mechanism | Plausible? | Evidence |
|-----------|:----------:|----------|
| GAM PEL micro-example / concise closure | **Partial** | Suppressed for “workshop” briefs; active for clean self-study briefs |
| LD-SELF-DIRECTED-RHETORIC 2–3 closure bullets on GAM | **Yes** | Always injected (+3,608 chars); models satisfy bullet count not word floor |
| DLA thin obligation specs + example JSON | **Yes** | Runtime teaches short excerpts; EP population block too small vs IFP pack |
| Prompt length / attention decay | **Yes** | 32k GAM prompt; depth rules in first 20k, thin rhetoric in last 12k |
| Missing PEL depth blocks | **No** | Reading sufficiency + materials copy are pro-depth; problem is **competition** not absence |

---

## D. Reduction Estimate

Baseline: self-directed learner-page **runtime only** (DLA ~17.9k + GAM ~12.0k ≈ **29.9k** combined), excluding pack debt.

| Tier | Scope | DLA Δ | GAM Δ | Combined | Notes |
|------|-------|------:|------:|---------:|-------|
| **Conservative** | Remove PEL orientation+reasoning on DLA; dedupe DLA output contract vs rhetoric; fix workshop gate bug | −4k | −0 | **−4k (~13%)** | No GAM change if workshop briefs |
| **Likely** | Above + remove GAM PEL reasoning materials; align LD-SELF-DIRECTED-RHETORIC closure with GAM-PRES-08; trim DLA example | −6k | −4k | **−10k (~33%)** | Requires brief-gate fix so PEC isn’t silently skipped |
| **Aggressive** | Collapse DLA self-directed scaffolds to: EP population + table spec + timeline + math; GAM to: L4 fidelity + voice + reading; move journey to Page only | −12k | −6k | **−18k (~60%)** | Needs regression harness on cognition field coverage |

**Not counted here:** DLA pack IFP debt (~Phase 2A follow-on) and remaining GAM pack thin tokens — those dominate total prompt size.

---

## E. Recommended Implementation Order

Smallest safest changes first (future implementation pass — **not executed in 2B-b**):

1. **Fix PEC gating bug (D)** — `isWorkflowBriefFacilitatedDeliveryIntent` treats `workshop` as facilitated even when `delivery_context: self_directed`. Document or fix so audit predictions match production. *No prompt deletion until gate is understood.*

2. **Align GAM PEL reasoning materials with GAM-PRES-08 (C→A)** — Replace *“short micro-example”* / *“2–3 items”* with explicit back-references to GAM-PRES-08 word minima. **Highest ROI when block is active.** Safe because it ** strengthens** depth; does not remove guards.

3. **LD-SELF-DIRECTED-RHETORIC closure line (C)** — Change GAM rider closure from *“2–3 epistemic bullets”* to *“meet GAM-PRES-08 transfer/closure minima”*. Small diff; removes direct conflict on every GAM run.

4. **DLA output contract example (C)** — Replace *“Short paired excerpts”* with L3-shaped spec (`depth_floor: L3; ≥150 words per extract`). Reduces thin-spec mimicry.

5. **Dedupe DLA cognition schema (B)** — Keep **one** of: output contract override, PEL reasoning, PEL orientation field rules. Prefer **output contract** (structured) + drop PEL blocks on DLA.

6. **Merge activity framing into population contract (B)** — `activity_preamble` rules belong in DLA pack population section once IFP-07 fully removed.

7. **Remove PEL orientation from DLA entirely (B)** — Session journey → Episode Plan + Page; DLA should populate beats not compose overview arc.

8. **Conditional pedagogy cognition packs (D)** — Audit brief-driven packs for overlap with DLA contract before expansion.

9. **Aggressive scaffold collapse (B)** — Only after EV-38S chase proves obligation tagging + GAM depth on Inflation with steps 1–4 done.

---

## Appendix — measured augmentation (2026-06-08)

Probe: `scripts/probe-38b1-ld-workflow-prompt-audit.js` + block builder sizes via `__PRISM_TEST_API`.

| Step | Brief | Seeded | Augmented | Runtime Δ |
|------|-------|-------:|----------:|----------:|
| DLA | “inflation **workshop**” + self_directed | 24,491 | 42,393 | **+17,902** |
| DLA | “inflation page” (no workshop) | 24,491 | 45,624 | **+21,133** |
| GAM | workshop | 20,013 | 32,006 | **+11,993** |
| GAM | clean | 20,013 | 35,682 | **+15,669** |

PEC presence:

| Block | DLA workshop | DLA clean | GAM workshop | GAM clean |
|-------|:------------:|:---------:|:------------:|:---------:|
| PEL orientation | ✗ | ✓ | ✗ | ✗ |
| PEL reasoning | ✗ | ✓ | ✗ | ✓ |
| GAM PEL reasoning materials | ✗ | ✗ | ✗ | ✓ |

---

## Success criterion checklist

| Criterion | Met? |
|-----------|:----:|
| What PEL still uniquely owns | ✓ L4 fidelity, voice, timeline, reading floor, EP population, math |
| What PEL duplicates | ✓ Cognition schema ×3; journey ×2; anti-facilitator ×3 |
| What PEL conflicts | ✓ GAM micro-example/2–3 closure; DLA short self-explanation; rhetoric closure bullets |
| What can be removed safely | ✓ Ordered list in §E with behaviour-loss notes |
| No prompt/code changes | ✓ |

---

*End of Phase 2B-b audit.*

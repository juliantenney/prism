# 38S Phase 2B-b.2 — GAM Reasoning-Material Alignment Audit (Read Only)

**Date:** 2026-06-08  
**Status:** **COMPLETE — audit only; no prompt or code changes**  
**Type:** GAM reasoning-material / PEL surface audit  
**Sprint:** [38S Episode Plan V1 implementation](../README.md)  
**Authority:** [38S-handover-pack.md](./38S-handover-pack.md) · post–Phase 2C-a Inflation rerun observations · [Phase 2B GAM audit](./38S-prompt-sanitisation-phase-2b-gam-audit.md) · [Phase 2B-b PEL audit](./38S-prompt-sanitisation-phase-2b-b-pel-audit.md) · [Phase 2B-b.1 runtime alignment](./38S-prompt-sanitisation-phase-2b-b1-runtime-thinness-alignment.md)  
**Probe:** `scripts/probe-38b1-ld-workflow-prompt-audit.js` (2026-06-08) · `app.js` GAM/PEL builders ~6970–9420, ~9806–10020

---

## Executive summary

**Question:** Why does Inflation GAM realisation remain structurally faithful but educationally shallow — correct beat-aligned material types, coherent pedagogy, moderate depth — while PEL reasoning support feels weak?

**Answer:**

1. **GAM depth authority already exists in the pack.** `GAM-PRES-07/08/09` and `GAM-WB-01/02` specify L3 floors (exposition ≥120 words, worked analytic pass ≥120 words, verification ≥4 items, transfer ≥80 words, function-shaped bodies). The Inflation rerun confirms **structure and preservation** — not missing rules.

2. **Shallowness is a signal-competition problem, not a missing-architecture problem.** Competing thinness cues (`brief`, `minimal assumptions`, anti-redundancy → “short worked examples only”, checklist caps, optional micro-examples) sit **alongside** strong depth rules in a **~32k-character** augmented GAM prompt. Models satisfy type/order contracts at **minimum viable prose** within word-band floors.

3. **The deferred `buildSelfDirectedGamPelReasoningMaterialPromptBlock` is the highest-conflict reasoning-material surface — but it is usually absent on Inflation.** `resolvePedagogicEnrichmentContractIds()` returns `[]` when the brief blob matches facilitated-delivery heuristics (`workshop`). Probe confirms Inflation self-directed GAM augmentation **does not include** PEL reasoning or GAM reasoning-materials blocks. Inflation shallow depth therefore **cannot** be explained primarily by that block today; it **will** bite clean self-study briefs and any future gate fix.

4. **Active Inflation GAM surfaces that explain moderate depth:** pack `GAM-PRES-*` (early, strong), `LD-MATERIALS-COPY` author role, `LD-TABLE-FIDELITY`, reading sufficiency (pro-depth), **material voice anti-redundancy** (pushes thin artefacts), `LD-SELF-DIRECTED-RHETORIC` GAM rider (post–2B-b.1 closure aligned to PRES-08), plus upstream DLA obligation specs (often thin despite 2B-b.1 runtime fixes on DLA).

5. **Smallest safe implementation (2B-b.2 implementation pass, not this audit):** Rewrite **only** `buildSelfDirectedGamPelReasoningMaterialPromptBlock` + two material-voice lines to back-reference `GAM-PRES-08` minima; add prompt-surface tests. **Do not** change PEC gating, pack, DLA, Page, or workflow chaining in the first pass. Optional follow-on: decouple reasoning-material depth from `workshop` PEC suppression (documented, not 2B-b.2 minimum).

---

## Benchmark: Inflation rerun evidence (post–2C-a)

Authoritative user observation after Episode Plan + DLA population + Phase 2C-a Page preservation fixes:

| Dimension | Inflation rerun finding | Implication |
|-----------|-------------------------|-------------|
| Episode Plan / DLA population | Stable | Obligations and beats correct upstream |
| GAM structure | Faithful to DLA | `GAM-PRES-01/02/03` working |
| Page materials | Preserved (2C-a) | Collapse was Page-compose, not GAM absence |
| Reasoning chains | Present | Types and fields exist |
| Explanations | Short | Meets floors weakly, not expert modelling |
| Worked examples | Short | Step labels present; expert thinking compressed |
| Analysis / Evaluate | Concise | Checklist/scaffold-heavy, not analytic pass depth |
| PEL support | Limited | Workshop gate + anti-redundancy + no GAM PEL block |

**Pattern name:** *minimum viable L3* — satisfies material type, item count, and word-band validators without rich expert reasoning exposition.

Historical harness note: `EV-38S-AFTER-4` and earlier inflation scorecards show the same arc — structural improvement outpacing depth (see [38E-10 inflation scorecard](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md): worked types appear, bodies remain variable).

---

## A. Responsibility map — GAM reasoning-material surfaces

### Runtime augmentation order (GAM step)

```
Pedagogic cognition (conditional)
→ Self-directed scaffolds (reading, voice, timeline, LD-SELF-DIRECTED-RHETORIC)
→ LD-TABLE-FIDELITY (author)
→ LD-MATERIALS-COPY (author)
→ Pedagogic enrichment (PEL orientation/reasoning + GAM reasoning materials — conditional)
→ LD-MATH-RENDER
```

### Measured sizes (self-directed learner-page, 2026-06-08 probe)

| Surface | ~Chars | Injected on Inflation `workshop` GAM? | Primary reasoning functions affected |
|---------|-------:|:-------------------------------------:|--------------------------------------|
| **GAM pack `promptTemplate`** | 20,109 | Always (seeded) | All — `GAM-PRES-07/08/09`, GAM-WB exposition/worked/modelling/verification/transfer |
| **GAM pack `defaultPromptNotes`** | 1,810 | Always | Reinforcement + episode-shaping residue |
| **Augmented GAM total** | 32,192 | — | (+12,179 runtime) |
| `LD-TABLE-FIDELITY` (author) | ~2,693 | Yes | Table-shaped guided practice, analysis templates |
| `LD-MATERIALS-COPY` (author) | ~1,160 | Yes | Full bodies vs catalogue (structure, not depth floor) |
| `buildSelfDirectedGamReadingSufficiencyPromptBlock` | ~717 | Yes | Exposition / text materials (150–300+ words) |
| `buildSelfDirectedGamLearnerVoicePromptBlock` | ~1,071 | Yes | Anti-facilitator; **anti-redundancy vs cognition fields** |
| `buildSelfDirectedTimelineSequencingAlignmentPromptBlock` | ~1,522 | Yes | Sequencing tasks (orthogonal) |
| `LD-SELF-DIRECTED-RHETORIC` (GAM rider) | ~3,600 | Yes | Worked fading, concept/procedure cues, closure/debrief |
| `buildPelReasoningContractPromptBlock` | ~520 | **No** (workshop gate) | Cognition field semantics pointer |
| **`buildSelfDirectedGamPelReasoningMaterialPromptBlock`** | **~1,400** | **No** (workshop gate) | **worked_thinking, verification, transfer, judgement, modelling** |
| `buildPedagogicCognitionContractPromptBlock` (GAM) | 0–800 | Conditional on brief packs | Optional “Cognition cues” sections in materials |
| `lib/gam-output-format.js` validators | n/a (post-hoc) | n/a | MIN_TEACHING_BODY 120, MIN_CHECKLIST 80 — **not prompt** |

**Inflation GAM runtime blocks actually present (probe):** table fidelity, reading sufficiency, material voice, timeline, LD-SELF-DIRECTED-RHETORIC, math — **six blocks, no PEL**.

---

## B. Audit questions — findings

### 1. Which GAM instructions encourage minimum viable completion?

| Source | Instruction | Mechanism |
|--------|-------------|-----------|
| Pack usability | *“make only **minimal**, reasonable assumptions”* | Licenses filling gaps with thinnest plausible prose |
| Pack output org | `Purpose: **<brief purpose>**` (× every Material) | Normalises brevity labelling across all materials |
| Pack task line | *“not **brief** task shells”* | Ironically contains “brief”; competes with PRES depth |
| **`buildSelfDirectedGamPelReasoningMaterialPromptBlock`** | *“**one short** worked **micro-example**”* | Explicit minimum-size worked thinking |
| Same | *“realise … as tables, spans, and **short worked examples only**”* | Caps material bodies when cognition fields exist on activity row |
| Same | *“**concise** ‘if X, revisit Y’ cues”* | Verification as thin bullets, not repair checklist |
| Same | *“Closure … **(2–3 items)** — **concise** judgement/transfer”* | Transfer/judgement as bullet stubs vs PRES-08 ≥80w |
| Same | *“**one short** meaning line per procedural move”* | Concept/procedure integration minimised |
| `buildSelfDirectedGamLearnerVoicePromptBlock` | *“Do not restate … reasoning_orientation … add **artefacts** (tables, excerpts, worked rows) **only**”* | Without PRES-08 back-ref, model thins bodies to avoid duplication |
| `LD-SELF-DIRECTED-RHETORIC` | *“step → meaning lines and Use this when… **cues**”* | Cue-shaped materials vs modelled expert pass |
| GAM-WB-06 | *“≥80 words”* consolidation scaffold | Word count without reasoning-quality bar — shallow scaffold passes |
| Attention / length | ~32k augmented prompt; depth rules in first ~20k | Late blocks (voice, rhetoric) bias compliance |

### 2. Which instructions reward short outputs, concise reasoning, abbreviated examples, or checklist-heavy completion?

| Source | Instruction | Rewarded shape |
|--------|-------------|----------------|
| **`buildSelfDirectedGamPelReasoningMaterialPromptBlock`** | short micro-example; concise cues; 2–3 closure bullets | Abbreviated worked example; verification bullets; thin transfer |
| Pack `GAM-PRES-08` (V1) | verification → ≥4 items | **Checklist-heavy** completion (model stops at 4 one-liners) |
| Pack `GAM-WB-05` | retrieval via task_cards / checklist | Checklist-as-verification substitute |
| `LD-SELF-DIRECTED-RHETORIC` | misconception *“Check your thinking”* in support_note | Reactive one-liner vs worked misconception interrupt |
| Material voice | artefacts only, no narrative restatement | Table + bullet skeleton without exposition |
| Reading sufficiency | *“**brief** explanations”* (same block as 150–300+ rule) | Ambiguous — net pro-depth but “brief” token remains |
| DLA upstream (out of GAM scope but shapes GAM input) | checklist ~4 items cap in material-shape scaffold | Thin verification specs copied by GAM |

### 3. Which instructions suppress deeper modelling of expert thinking?

| Source | Instruction | Suppression |
|--------|-------------|-------------|
| **`buildSelfDirectedGamPelReasoningMaterialPromptBlock`** | anti-redundancy: do not repeat cognition fields; **short worked examples only** | Expert thinking stays on activity JSON, not in materials |
| Same | *“not full tutoring”* on misconception interrupts | Blocks rich worked repair paths |
| `buildSelfDirectedGamLearnerVoicePromptBlock` | do not restate reasoning_orientation / evidence_use / argument_structure_hint | Materials cannot echo DLA reasoning scaffolds in prose |
| Pack `GAM-PRES-05` / GAM-WB-06b | anti-spoiler / scaffold-only consolidation | Correct for Evaluate — but limits modelled judgement prose |
| Pack length + duplication | GAM-PRES + GAM-WB repeat same depth rules 3–4× | Attention decay → model reads first occurrence weakly |
| **PEC workshop gate** | Suppresses GAM PEL reasoning block entirely | No positive reasoning-material contract on Inflation GAM runs |

**Note:** `GAM-PRES-08 (A1)` explicitly requires expert walkthrough (evidence → lens → steps → conclusion ≥120 words). Suppression happens because **later, more specific “short/concise/only” lines override** in model attention, not because PRES-08 is absent.

### 4. Which instructions duplicate responsibilities already handled elsewhere?

| Instruction | Also owned by | Verdict |
|-------------|---------------|---------|
| `buildPelReasoningContractPromptBlock` on GAM | DLA OUTPUT CONTRACT + activity row cognition fields | **REMOVE on GAM** (pointer only if kept anywhere) |
| **`buildSelfDirectedGamPelReasoningMaterialPromptBlock`** — “support DLA reasoning fields” | `GAM-PRES-03/08` function realisation + material voice | **REWRITE** to PRES-08 back-ref, not duplicate HOW-TO-THINK |
| `LD-SELF-DIRECTED-RHETORIC` GAM rider — “full prose not outline labels” | `GAM-PRES-09` anti-collapse + `LD-MATERIALS-COPY` | **KEEP** (reinforcement) — post–2B-b.1 closure line already aligned |
| `buildSelfDirectedGamLearnerVoicePromptBlock` anti-redundancy | Same intent as PEL reasoning materials anti-redundancy | **MERGE / REWRITE** — single rule with PRES-08 exception for depth |
| Pack GAM-WB-01/02 exposition/worked minima | `GAM-PRES-07/08` | **MERGE** (Phase 2B-c pack dedupe — out of 2B-b.2 scope) |
| `buildPedagogicCognitionContractPromptBlock` GAM “Cognition cues” sections | DLA fields + material voice | **REVIEW** — may duplicate or conflict when active |

### 5. KEEP / REWRITE / REMOVE classification

| Surface | Class | Rationale |
|---------|:-----:|-----------|
| **GAM-PRES-07/08/09/10** (pack) | **KEEP** | Canonical L3 depth + anti-collapse — explains correct Inflation structure |
| **GAM-WB-01/02** worked/modelling minima (pack) | **KEEP** (dedupe later) | Pro-depth; duplicate of PRES-08 |
| **`LD-TABLE-FIDELITY` author** | **KEEP** | Table-shaped guided practice fidelity |
| **`LD-MATERIALS-COPY` author** | **KEEP** | Anti-catalogue; add cross-ref to PRES-08 in 2B-b.2 optional |
| **`buildSelfDirectedGamReadingSufficiencyPromptBlock`** | **KEEP** | Pro-depth floor; trim “brief explanations” token optional |
| **`buildSelfDirectedGamLearnerVoicePromptBlock`** | **REWRITE** (2 lines) | Clarify anti-redundancy does **not** permit bodies below GAM-PRES-08 |
| **`LD-SELF-DIRECTED-RHETORIC` GAM rider** | **KEEP** | Post–2B-b.1 closure aligned; worked-fading guidance pro-depth |
| **`buildPelReasoningContractPromptBlock` on GAM** | **REMOVE** | Duplicate; gated off for workshop anyway |
| **`buildSelfDirectedGamPelReasoningMaterialPromptBlock`** | **REWRITE** | **Primary 2B-b.2 target** — replace short/concise/2–3 with PRES-08 minima |
| **`buildPedagogicCognitionContractPromptBlock` GAM** | **REVIEW** | Conditional; may add thin “Cognition cues” sections |
| Pack *“minimal assumptions”* / *“brief purpose”* | **REWRITE** (2B-c) | High-impact thinness; pack-only |
| Pack *“richer instructional episodes (orientation/activation/…)”* in notes | **REMOVE** (2B-c) | Planning residue post–Episode Plan |
| PEC `workshop` gate suppressing all PEC on self_directed | **REVIEW** (not 2B-b.2) | Architecture; causes absent PEL on Inflation |

### 6. Which prompt surfaces most directly explain Inflation findings?

| Inflation observation | Primary explaining surfaces (ordered) |
|-----------------------|----------------------------------------|
| **Structure correct** | `GAM-PRES-01/02/03`; DLA population + beat order; `LD-MATERIALS-COPY` |
| **Coherent pedagogy** | Episode Plan archetypes; `GAM-PRES-03` function map; DLA `required_materials` sequence |
| **Moderate educational depth** | **Competition:** pack `minimal`/`brief` + **material voice anti-redundancy** + checklist-shaped verification (PRES-08 V1 satisfied minimally) + **no pro-depth PEL block on workshop GAM** + prompt length |
| **Reasoning chains present, explanations short** | DLA cognition fields on activity row; GAM realises **artefact-thin** bodies per voice guard; exposition at ~120w floor not expert modelling |
| **Worked examples short** | PRES-08 (A1) present but min-viable; **would worsen** if PEL micro-example block active |
| **PEL support limited** | **Workshop gate** → no PEL reasoning / GAM reasoning materials; DLA PEL also gated |

### 7. Smallest safe implementation (future pass — not executed here)

**Scope boundary:** Prompt-only; no Episode Plan, DLA pack, Page, population contract, workflow chaining, or PEC gate logic changes.

| Step | Change | ~Δ chars | Risk |
|:----:|--------|--------:|:----:|
| **1** | **Rewrite `buildSelfDirectedGamPelReasoningMaterialPromptBlock`** — replace *short micro-example*, *concise cues*, *2–3 closure* with explicit `GAM-PRES-08` back-references (worked analytic ≥120w, verification ≥4 + repair, transfer ≥80w, guided judgement exemplar row) | +200–400 | Low — strengthens depth |
| **2** | **Rewrite 2 lines in `buildSelfDirectedGamLearnerVoicePromptBlock`** — anti-redundancy must not thin material bodies below GAM-PRES-08; cognition fields on activity card ≠ substitute for material depth | +150 | Low |
| **3** | **Add tests** in `workflow-pel-reasoning.test.js` + `workbook-contract-prompt-surface.test.js` — forbid *short worked micro-example*, require PRES-08 anchors in GAM reasoning block | — | Low |
| **4** | **Optional:** Inject rewritten block via non-PEC path for self-directed GAM only (if gate fix deferred) | +1,400 when active | Med — touches augmentation order |
| **Defer** | PEC workshop gate fix | — | Architecture review |
| **Defer** | Pack `brief`/`minimal` tokens | — | Phase 2B-c |
| **Defer** | GAM-WB / PRES dedupe | — | Phase 2B-c |

**Expected outcome:** Clean self-study briefs gain aligned reasoning-material contract immediately; Inflation `workshop` briefs gain depth **only if** step 4 or gate fix enables block injection — otherwise steps 1–2 still fix **material voice vs PRES-08** conflict that **is** active on Inflation today.

---

## C. Direct mapping — prompt instructions → Inflation behaviour

| Inflation symptom | Likely instruction(s) | Active on Inflation GAM? |
|-------------------|----------------------|:------------------------:|
| Beat-aligned material types present | `GAM-PRES-01/03` | Yes |
| No collapse to single consolidation | `GAM-PRES-02/09` | Yes |
| Explanation sections exist but thin | `GAM-WB-01` ≥120w + usability *minimal*; reading *brief explanations* | Yes |
| Worked example has steps but shallow expert voice | `GAM-PRES-08 (A1)` min band + voice *artefacts only* | Yes |
| Verification = checklist bullets not repair path | `GAM-PRES-08 (V1)` ≥4 items without quality bar; **PEL concise cues** (if ever injected) | Partial |
| Transfer/judgement concise | `GAM-PRES-08 (T1/E1)` vs rhetoric closure bullets | Yes (rhetoric now PRES-08-aligned post–2B-b.1) |
| Modelling note present but not rich | `GAM-PRES-03` modelling_note + **PEL short micro-example** (inactive) | Pack only |
| Reasoning orientation on activity, not in materials | Material voice + **PEL anti-redundancy** | Yes (voice); No (PEL block) |
| PEL feels weak | PEC gate + absent GAM reasoning materials block | Yes |

---

## D. `buildSelfDirectedGamPelReasoningMaterialPromptBlock` — line-by-line audit

Current text (`app.js` ~9399–9414):

| Line | Current wording | Class | Issue |
|------|-----------------|:-----:|-------|
| L1 | Support DLA reasoning fields | KEEP intent | Correct role |
| L2 | worked_example with visible reasoning | KEEP | Aligns with PRES-08 |
| L3 | faded template pre-fill rules | KEEP | Fading discipline |
| L4 | **one short worked micro-example** | **REWRITE** | Conflicts PRES-08 ≥120w analytic pass |
| L5 | quotable spans / evidence cells | KEEP | Pro-depth for evidence_use |
| L6 | optional static generative retrieval | KEEP | Optional |
| L7 | **realise … short worked examples only** | **REWRITE** | Primary anti-modelling signal |
| L8 | preserve comparison scaffolds | KEEP | |
| L9 | **concise "if X, revisit Y" cues** | **REWRITE** | Conflicts verification ≥4 + repair |
| L10 | **one short meaning line** per move | **REWRITE** | Suppresses concept/procedure depth |
| L11 | **Closure (2–3 items) concise** | **REWRITE** | Conflicts transfer ≥80w / PRES-08 closure |

**Suggested rewrite pattern (implementation hint only):**

- Replace *short micro-example* → *when DLA lists worked_thinking / worked analytic pass, model one full GAM-PRES-08 (A1) walkthrough (≥120 words) with visible expert reasoning — not a labelled sample row only*.
- Replace *concise cues* → *verification checklist ≥4 criteria-linked items + explicit repair-if-fail (GAM-PRES-08 V1)*.
- Replace *2–3 concise closure* → *transfer_prompt / debrief materials meet GAM-PRES-08 (T1) ≥80 words when DLA lists transfer or Evaluate closure*.
- Add: *Anti-redundancy does not reduce material bodies below GAM-PRES-08 minima — activity-row cognition fields orient; materials must still carry usable depth.*

---

## E. GAM PEL blocks — secondary surfaces

### `buildPelReasoningContractPromptBlock` (~520 chars)

Post–2B-b.1: pointer to OUTPUT CONTRACT + execution guards. **Low conflict** on GAM; **duplicate** of DLA contract. **REMOVE on GAM** when injected (non-workshop briefs).

### `buildPedagogicCognitionContractPromptBlock` (GAM stage, conditional)

When brief cognition packs active: adds *“Cognition cues section”* per material block. **Risk:** thin additive sections that satisfy pack IDs without PRES-08 bodies. **REVIEW** in brief-specific harness — not Inflation default.

---

## F. Pack excerpts relevant to reasoning depth (read-only)

Not modified in 2B-b.2; listed because they compete with runtime reasoning alignment on every Inflation run:

| Pack clause | Depth effect |
|-------------|--------------|
| `GAM-PRES-08 (A1)` worked analytic ≥120 words | **Pro-depth** — primary authority |
| `GAM-PRES-08 (V1)` verification ≥4 + repair | **Pro-depth** — but checklist-shaped |
| `GAM-PRES-08 (T1)` transfer ≥80 words | **Pro-depth** |
| Usability *minimal, reasonable assumptions* | **Anti-depth** |
| Output `Purpose: <brief purpose>` | **Anti-depth** tone |
| `GAM-WB-06` consolidation ≥80 words scaffold | **Neutral** — word count without reasoning bar |

Post–2B dedupe pack template: **20,109 chars** (was ~26,544 pre–2B).

---

## G. Prompt-size context

| Layer | Chars (2026-06-08) |
|-------|-------------------:|
| GAM pack template | 20,109 |
| GAM pack notes | 1,810 |
| GAM seeded | 20,013 |
| GAM augmented (self-directed) | 32,192 |
| Runtime delta | +12,179 |
| **`buildSelfDirectedGamPelReasoningMaterialPromptBlock`** (standalone) | ~1,400 |
| Rewritten block (est.) | ~1,600–1,800 |

Dedupe in Phase 2B-c (pack) would improve attention to PRES-08 more than adding chars; 2B-b.2 rewrite is **net neutral or +200** chars when block injects.

---

## H. Recommended implementation order (Phase 2B-b.2 implementation — not this audit)

1. Rewrite **`buildSelfDirectedGamPelReasoningMaterialPromptBlock`** per §D (highest ROI).
2. Tighten **`buildSelfDirectedGamLearnerVoicePromptBlock`** anti-redundancy exception for PRES-08 minima.
3. Add **prompt-surface tests** — forbid `short worked micro-example`, `2–3 items` closure in GAM reasoning block; require `GAM-PRES-08` anchors.
4. Run **`workflow-pel-reasoning.test.js`**, **`design-page-materials-fidelity.test.js`** (if cross-step), **`workbook-contract-prompt-surface.test.js`**, **`ev-38s-production-pipeline-chase.mjs`**.
5. Manual Inflation GAM re-run — compare A1 worked_example word count, A2 verification item depth, A4 transfer length vs pre-2B-b.2.
6. **Follow-on (separate decision):** PEC workshop gate vs self_directed delivery; optional always-on slim GAM reasoning-depth rider decoupled from PEC.

---

## I. Success criteria (audit)

| Criterion | Met? |
|-----------|:----:|
| Identified minimum-viable completion signals | ✓ |
| Mapped to Inflation rerun pattern | ✓ |
| KEEP / REWRITE / REMOVE per surface | ✓ |
| Smallest safe implementation without architecture change | ✓ |
| No prompt/code changes in this phase | ✓ |
| Episode Plan / DLA / Page / population / chaining untouched | ✓ |

---

## Related artefacts

- [38S-handover-pack.md](./38S-handover-pack.md)
- [38S-prompt-sanitisation-phase-2b-gam-audit.md](./38S-prompt-sanitisation-phase-2b-gam-audit.md)
- [38S-prompt-sanitisation-phase-2b-b-pel-audit.md](./38S-prompt-sanitisation-phase-2b-b-pel-audit.md)
- [38S-prompt-sanitisation-phase-2b-b1-runtime-thinness-alignment.md](./38S-prompt-sanitisation-phase-2b-b1-runtime-thinness-alignment.md)
- [38S-phase-2c-page-responsibility-audit.md](./38S-phase-2c-page-responsibility-audit.md)
- `scripts/probe-38b1-ld-workflow-prompt-audit.js`
- `lib/gam-output-format.js` — validator floors (not prompt)

---

*End of Phase 2B-b.2 audit (read-only).*

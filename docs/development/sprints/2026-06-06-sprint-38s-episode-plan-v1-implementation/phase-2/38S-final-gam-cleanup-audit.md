# 38S Final GAM Prompt Cleanup Audit (Read Only)

**Date:** 2026-06-08  
**Status:** **COMPLETE — audit only; no prompt or code changes**  
**Type:** Final GAM pack + runtime bloat / duplication audit  
**Sprint:** [38S Episode Plan V1 implementation](../README.md)  
**Authority:** [38S-handover-pack.md](38S-handover-pack.md) · [Phase 2B-b.2 GAM reasoning alignment](38S-phase-2b-b2-gam-reasoning-alignment-audit.md) · [Phase 2B GAM audit](38S-prompt-sanitisation-phase-2b-gam-audit.md) · [Phase 2B GAM dedupe (implemented)](38S-prompt-sanitisation-phase-2b-gam-dedupe.md) · [Page rendering audit](38S-page-rendering-audit.md)

**Probes:** `scripts/audit-gam-phase-2b-readonly.mjs` · `scripts/probe-38b1-ld-workflow-prompt-audit.js` (2026-06-08)

---

## Executive summary

**Question:** After Episode Plan → DLA → GAM → Page stabilisation, what GAM prompt mass is still **architecturally necessary** vs **residual duplication**?

**Answer:**

1. **GAM realisation is working.** `EV-38S-AFTER-4` — `fullOk: true`, `proofOk: true`. Latest Inflation manual evidence (Phase 2C + page rendering audit): GAM bodies survive to Page; defects are **renderer/compose presentation**, not GAM absence or obligation miss.

2. **Phase 2B already removed ~6,435 chars (−22.7%)** from the pack (standalone material-type section + GAM-WB-22..31 archetype packs). Pack template is now **~20,274 chars** — but **~40–46% of remaining template is still duplicate sediment** (GAM-WB inside “Usability requirements”, GAM-WB-11 type index, F-rule repetition, canonical-contract prose that runtime LD-* modules re-teach).

3. **Canonical depth authority is GAM-PRES-07/08/09 (+ PRES-10 Evaluate gate).** GAM-WB-01/02/06 and Usability/F-rules largely **restate** the same L3 floors. **Do not delete depth semantics** — merge and cross-reference.

4. **Runtime on Inflation `workshop` GAM (self-directed):** six blocks inject **~12,500 chars** — `LD-TABLE-FIDELITY` (~3,916), reading sufficiency (~717), material voice (~1,405), timeline (~1,522), `LD-SELF-DIRECTED-RHETORIC` (~3,729), `LD-MATH-RENDER` (~1,219). `LD-MATERIALS-COPY` is **already embedded in pack** (3 mentions) — runtime append is skipped (dedup guard). **Table + anti-catalogue rules appear twice** (pack preamble + runtime table block).

5. **PEL GAM blocks are inactive on Inflation** (`workshop` → `resolvePedagogicEnrichmentContractIds()` returns `[]`). When active, `buildSelfDirectedGamPelReasoningMaterialPromptBlock` **conflicts** with GAM-PRES-08 (“short micro-example”, “concise cues”) — classify as **REWRITE or REMOVE**, not KEEP, in any cleanup that enables PEC.

6. **This pass is bloat reduction only.** North Star teaching-quality enhancements (richer expert modelling, PEC gate expansion, depth beyond L3 floors) are **DEFER** to the next tranche.

**Verdict:** Smallest safe **final cleanup** = pack **Phase 2B-c** remainder (WB↔PRES merge, notes trim, preamble one-liners) + optional runtime **marker merge** (reading/voice/timeline). Projected **pack −4,500 to −8,500 chars**; **augmented GAM −5,000 to −10,000 chars** without weakening material realisation.

---

## Validation evidence (EP → DLA → GAM → Page)

| Layer | Artefact / observation | Implication for GAM cleanup |
|-------|------------------------|---------------------------|
| Harness | `EV-38S-AFTER-4` — `fullOk: true` | GAM contract gates pass; cleanup must preserve proof surface |
| GAM capture | `EV-38S-AFTER-4-gam.txt` / `.json` | Beat-aligned types; bodies variable depth |
| Page | [38S-page-rendering-audit.md](38S-page-rendering-audit.md) | **GAM content preserved**; ordering/escape are renderer issues |
| Manual Inflation | Phase 2B-b.2 rerun pattern | Structure faithful; **minimum viable L3** prose |
| Phase 2B dedupe | [38S-prompt-sanitisation-phase-2b-gam-dedupe.md](38S-prompt-sanitisation-phase-2b-gam-dedupe.md) | Material-type + WB-22..31 already removed; tests green |

**Constraint honoured:** This audit does **not** propose DLA, Page, Episode Plan, schema, population contract, or workflow chaining changes.

---

## Prompt-size map (2026-06-08, post–Phase 2B partial dedupe)

### Pack layer

| Component | Chars | Notes |
|-----------|------:|-------|
| `promptTemplate` | **20,274** | Was 26,544 pre–2B |
| `defaultPromptNotes` | **1,810** | Unchanged since 2B |
| **Pack combined** | **22,084** | Was 28,354 pre–2B |
| Seeded in workflow | 20,178 | Pack minus userOptions substitution |

### Pack internal spans (audit script marker analysis)

| Block | ~Chars | % of template | Status post–2B |
|-------|-------:|:-------------:|----------------|
| Context / Role / Task / Instructions | ~750 | 4% | **KEEP** |
| Canonical contracts preamble (LD-* inline prose) | ~1,665 | 8% | **REWRITE** → one-line refs |
| **GAM-PRES-00..10** | ~7,609 | 38% | **KEEP** (compact mirrors optional) |
| **GAM-WB-00..21 + MIX + F-rules** (inside Usability) | ~7,857 | 39% | **MERGE** into PRES |
| **Usability requirements** wrapper | ~9,229 | 46% | Misnamed — mostly GAM-WB |
| Output organisation + Scope | ~1,034 | 5% | **KEEP** (single copy ✓) |
| Anti-patterns AP-01..05 | ~725 | 4% | **MERGE** into PRES-09 |
| Standalone material-type section | 0 | — | **Removed** (2B ✓) |
| GAM-WB-22..31 archetype packs | 0 | — | **Removed** (2B ✓) |

### Per-clause sizes (first occurrence, current pack)

| Clause | Chars |
|--------|------:|
| GAM-PRES-08 | 1,541 |
| GAM-PRES-10 | 1,942 |
| GAM-WB-06 | 1,532 |
| GAM-WB-11 (type index) | 2,302 |
| GAM-WB-21 | 488 |
| GAM-WB-38 | 600 |
| GAM-WB-01 + WB-02 | 592 |

### Runtime layer (self-directed Inflation `workshop` GAM)

| Block | Chars | On Inflation GAM? |
|-------|------:|:-----------------:|
| **Augmented total** | **32,692–35,349** | Probe vs audit path variance |
| Runtime delta | **+12,514 to +15,171** | |
| `LD-TABLE-FIDELITY` (author) | 3,916 | Yes |
| `LD-MATERIALS-COPY` (author) | ~1,160* | *Skipped — already in pack* |
| Reading sufficiency | 717 | Yes |
| Material voice | 1,405 | Yes (2B-b.1 PRES-08 back-ref) |
| Timeline sequencing | 1,522 | Yes |
| `LD-SELF-DIRECTED-RHETORIC` (GAM rider) | 3,729 | Yes |
| `LD-MATH-RENDER` | 1,219 | Yes |
| `buildPelReasoningContractPromptBlock` | ~520 | **No** (PEC gate) |
| `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | ~1,400 | **No** (PEC gate) |
| `buildPedagogicCognitionContractPromptBlock` | 0–800 | Conditional on brief packs |

---

## Responsibility map

### Architectural roles (post–Episode Plan V1)

| Owner | Responsibility | GAM must still do |
|-------|----------------|-------------------|
| Episode Plan | Archetype + beat order | **Nothing** — consume only |
| DLA | `required_materials` obligations + activity fields | **Realise** every obligation as `activity_materials` body |
| GAM | Material authoring + output shape | Full bodies, type fidelity, anti-collapse, L3 floors |
| Page | Compose + render | **Nothing** for GAM prompt |
| `lib/gam-output-format.js` | Post-hoc validation | Complement prompt — not replace |

### GAM prompt surfaces — who owns what

| Surface | Layer | Primary function | Necessary? |
|---------|-------|------------------|:----------:|
| Context / Task / Instructions | Pack | Realisation-only scope | ✓ |
| **GAM-PRES-00..02** | Pack | Order + membership preservation | ✓ |
| **GAM-PRES-03** | Pack | Type → function map | ✓ |
| **GAM-PRES-04..06** | Pack | Anti-collapse, anti-spoiler, genre | ✓ |
| **GAM-PRES-07/08/09** | Pack | **L3 depth floors + function-shaped bodies** | ✓ **Canonical** |
| **GAM-PRES-10** | Pack | Evaluate trio termination | ✓ |
| **GAM-WB-00..21, MIX, F1–F9** | Pack | Workbook genre + fail taxonomy | ✓ semantics / **dup delivery** |
| **GAM-WB-11..18** | Pack | Type index | **Dup** of PRES-03 |
| Output organisation | Pack | Parse/merge shape | ✓ |
| `defaultPromptNotes` | Pack | Runner reminders | **Partial dup** |
| Canonical contracts preamble | Pack | LD-* authority | **Dup** of runtime |
| `LD-TABLE-FIDELITY` author | Runtime | Pipe tables, row adequacy | ✓ |
| `LD-MATERIALS-COPY` author | Pack (+ runtime guard) | Anti-catalogue bodies | ✓ (once) |
| Reading sufficiency | Runtime | Exposition length 150–300+ | Partial dup WB-01 |
| Material voice | Runtime | Self-study voice + anti-facilitator | ✓ |
| Timeline sequencing | Runtime | Chronological task tables | Orthogonal |
| `LD-SELF-DIRECTED-RHETORIC` GAM | Runtime | Worked fading, closure/debrief | ✓ (post–2B-b.1 aligned) |
| PEL orientation/reasoning | Runtime | Cognition field semantics | **Dup on GAM**; gated off |
| PEL reasoning materials | Runtime | Material-level reasoning | **Conflicts PRES-08**; gated off |

### Runtime augmentation order (GAM step)

```
Pedagogic cognition (conditional, brief packs)
→ Self-directed scaffolds (table fidelity, materials-copy*, reading, voice, timeline)
→ LD-SELF-DIRECTED-RHETORIC (GAM rider)
→ Pedagogic enrichment PEL (conditional — **off on Inflation workshop**)
→ LD-MATH-RENDER
```

---

## Audit questions — findings

### 1. Which GAM instructions are still architecturally necessary?

| Instruction family | Why GAM still needs it |
|--------------------|------------------------|
| **Realisation scope** (no redesign; `learning_activities` source of truth) | DLA specifies obligations; GAM authors bodies |
| **GAM-PRES-01/02** (order + membership) | Prevents reorder/collapse at realisation |
| **GAM-PRES-03** (type → function) | Maps DLA types to function-shaped bodies |
| **GAM-PRES-04/05** (anti-shell, anti-spoiler) | Prevents checklist-only / spoiler consolidation |
| **GAM-PRES-07/08/09** (L3 depth, function-shaped bodies) | **Single canonical depth authority** |
| **GAM-PRES-10** (Evaluate trio) | Termination gate for Evaluate archetype |
| **Fail taxonomy** (F1–F9, AP-01..05, MIX) | Harness + human QA alignment |
| **Output organisation** (`Activity:` / `Material:` / `Content:`) | `gam-output-format.js` + Page merge |
| **Runtime `LD-TABLE-FIDELITY`** | Table shape authority (author role) |
| **Runtime `LD-MATERIALS-COPY`** (once) | Anti-catalogue / full bodies |
| **Runtime material voice** | Self-study facilitator ban |
| **Runtime `LD-SELF-DIRECTED-RHETORIC` GAM rider** | Worked fading + closure aligned to PRES-08 |
| **Runtime `LD-MATH-RENDER`** | TeX delimiter contract |

### 2. Which instructions duplicate GAM-PRES-07/08/09?

| Duplicate source | What it repeats | ~Chars | Action |
|------------------|-----------------|-------:|--------|
| **GAM-WB-01** | Exposition ≥120 words | 105 | **MERGE** → PRES-08 pointer |
| **GAM-WB-02** | worked_example / sample_output / modelling_note full bodies | 487 | **MERGE** → PRES-08 |
| **GAM-WB-06 / 06b** | consolidation ≥80w scaffold-not-essay | 1,532+ | **MERGE** with PRES-08 (T1) + PRES-05 |
| **GAM-WB-MIX-01..06** | Anti-collapse table-only / template-only | ~800 | **MERGE** → PRES-04/09 |
| **GAM-WB-38E-9 F1–F9** | Same fail conditions as AP + PRES mirrors | ~600+ | **MERGE** → single fail taxonomy |
| **Usability “complete enough”** | PRES-04 anti-describe | ~400 | **KEEP** one line |
| **Reading sufficiency runtime** | GAM-WB-01 exposition band | 717 | **KEEP** or merge into one self-study block |
| **Material voice “full bodies”** | PRES-08 + LD-MATERIALS-COPY | 1,405 | **KEEP** (facilitator ban unique) |
| **GAM-PRES-07** vs **GAM-PRES-08** | Depth cues vs body minima | 325 + 1,541 | **KEEP both** — 07 expands, 08 specifies |

**Estimated duplicate mass (pack only):** ~5,500–7,500 chars restating PRES-07/08/09 semantics.

### 3. Which instructions duplicate LD-MATERIALS-COPY or LD-TABLE-FIDELITY?

| Location | Overlap | Action |
|----------|---------|--------|
| Pack **Canonical contracts** paragraph | Full LD-TABLE-FIDELITY + LD-MATERIALS-COPY prose (~1,655 chars pre-trim estimate) | **REWRITE** → `Obey LD-TABLE-FIDELITY and LD-MATERIALS-COPY (runtime).` |
| Pack **Usability / GAM-WB** | “Obey LD-MATERIALS-COPY and LD-TABLE-FIDELITY” + pipe table lines | **REMOVE** prose; keep cross-ref |
| Pack **GAM-WB-38** | Pipe table realisation | **MERGE** into runtime ref |
| Runtime **`LD-TABLE-FIDELITY`** (3,916 chars) | Authoritative — **KEEP** | Do not duplicate in pack |
| Runtime **`LD-MATERIALS-COPY`** | Skipped when pack mentions module | **KEEP** runtime guard; trim pack mentions to 1 |
| **`defaultPromptNotes`** | Re-lists GAM-WB + LD-* + AP/F rules | **REWRITE** to 5–8 lines |

**Net:** Pack should carry **one-line module refs**; runtime carries **full LD-* bodies**. Current state = **double table contract** (~1.6k pack + ~3.9k runtime).

### 4. Which PEL blocks are inactive, duplicated, or conflicting?

| Block | Inflation GAM | Class | Issue |
|-------|:-------------:|:-----:|-------|
| `buildPelOrientationContractPromptBlock` | **Inactive** | **REMOVE on GAM** | DLA/Page scope only |
| `buildPelReasoningContractPromptBlock` | **Inactive** | **REMOVE on GAM** | Duplicates DLA OUTPUT CONTRACT pointer |
| **`buildSelfDirectedGamPelReasoningMaterialPromptBlock`** | **Inactive** | **REWRITE or REMOVE** | When injected: *short micro-example*, *concise cues*, *2–3 closure items* **conflict GAM-PRES-08** |
| `buildPedagogicCognitionContractPromptBlock` | Conditional | **REVIEW** | Thin “Cognition cues” sections may satisfy pack IDs without PRES bodies |
| PEC `workshop` gate | Suppresses all PEL on GAM | **DEFER** | Architecture — not cleanup scope |

**2B-b.1 already fixed:** material voice anti-redundancy now back-references GAM-PRES-08. **PEL reasoning materials block remains the highest-conflict surface if gate opens.**

### 5. Which old brevity/thinness instructions remain?

| Source | Thinness cue | Still present? |
|--------|--------------|:------------:|
| Pack Usability | *“minimal, reasonable assumptions”* | ✓ |
| Pack output org | `Purpose: <brief purpose>` (× per Material) | ✓ |
| Pack / notes | *“brief reflection cues”* (if in WB sections) | Partial |
| Reading sufficiency | *“brief explanations”* (same block as 150–300+ rule) | ✓ |
| `LD-SELF-DIRECTED-RHETORIC` | *“minimal”* (closure context) | ✓ |
| **`buildSelfDirectedGamPelReasoningMaterialPromptBlock`** | *short*, *concise*, *2–3 items* | ✓ in code; **not injected** on Inflation |
| DLA upstream checklist cap | ~4 items | Out of GAM scope — shapes input only |

**Cleanup note:** Removing brevity tokens is **low char savings** but **high signal gain**. Defer North Star depth expansion; do trim conflicting tokens in **REWRITE** passes.

### 6. Which sections are teaching-quality enhancements → DEFER?

| Section | Why defer |
|---------|-----------|
| Richer expert walkthrough quality bar (beyond ≥120w) | North Star teaching tranche |
| PEC gate fix to always inject reasoning materials | Architecture + depth tranche |
| `buildPedagogicCognitionContractPromptBlock` expansion | Cognition pack brief-specific |
| Misconception interrupt “full tutoring” depth | Pedagogic enrichment design |
| Evaluate judgement exemplar richness beyond PRES-08 minima | 38Q / teaching architecture |
| Harness validator tightening (MIN_TEACHING_BODY quality) | Post-prompt cleanup |

### 7. Smallest safe cleanup without weakening realisation?

**Pack-only Phase 2B-c remainder (highest ROI, lowest risk):**

1. Collapse **GAM-WB-11..18** type index into **GAM-PRES-03** cross-ref (~2,300 chars).
2. Merge **GAM-WB-01/02/06** depth lines into **GAM-PRES-08** “see also” (~800–1,000 chars).
3. Consolidate **F1–F9 + MIX + AP-01..05** into **GAM-PRES-09** single fail taxonomy (~2,500–3,500 chars).
4. Trim **canonical contracts preamble** to one-line LD-* refs (~1,200–1,600 chars).
5. **Rewrite `defaultPromptNotes`** to 5–8 lines; remove episode-shaping (*orientation/activation*) residue (~800–1,200 chars).
6. Rename **Usability requirements** → **Workbook genre contract** (clarity; optional ~200 char trim of true-usability dup).

**Optional runtime (second wave, lower priority):**

7. Merge reading sufficiency + material voice + timeline → single `LD-GAM-SELF-STUDY-MATERIALS` marker block (~500 net).
8. **REWRITE** (not expand) `buildSelfDirectedGamPelReasoningMaterialPromptBlock` **only if** PEC gate enables it — replace thin cues with PRES-08 back-refs.

**Do not remove:** GAM-PRES-07/08/09/10 core semantics, output organisation, Evaluate trio gate, runtime LD-TABLE-FIDELITY author body.

---

## KEEP / REWRITE / REMOVE / DEFER

| Surface | Action | Rationale | ~Char impact |
|---------|:------:|-----------|-------------:|
| GAM-PRES-00..10 (core semantics) | **KEEP** | Canonical realisation authority | 0 |
| GAM-PRES-07/08/09 depth floors | **KEEP** | Defines minimum realisation | 0 |
| GAM-WB-11..18 type index | **REMOVE** | Dup PRES-03 | −2,300 |
| GAM-WB-01/02/06 depth clauses | **MERGE** | Dup PRES-08 | −800–1,000 |
| GAM-WB F1–F9 + MIX + AP list (2nd copy) | **MERGE** | Dup PRES-09 | −2,500–3,500 |
| Canonical contracts preamble prose | **REWRITE** | Dup runtime LD-* | −1,200–1,600 |
| `defaultPromptNotes` essay | **REWRITE** | Dup pack + runtime | −800–1,200 |
| Usability “minimal assumptions” | **REWRITE** | Thinness cue | −0–50 (wording) |
| Output `Purpose: <brief purpose>` | **REWRITE** | Tone cue | −0–30 |
| Standalone material-type (removed) | **DONE** | Phase 2B | — |
| GAM-WB-22..31 (removed) | **DONE** | Phase 2B | — |
| `LD-TABLE-FIDELITY` runtime (author) | **KEEP** | Table authority | 0 |
| `LD-MATERIALS-COPY` (pack ref + runtime guard) | **KEEP** | Once | trim pack dup |
| Reading sufficiency | **KEEP** / merge | Pro-depth; partial WB-01 dup | −0–400 if merged |
| Material voice | **KEEP** | Unique facilitator ban | 0 |
| Timeline sequencing | **KEEP** / merge | Orthogonal | −0–300 if merged |
| `LD-SELF-DIRECTED-RHETORIC` GAM | **KEEP** | Post–2B-b.1 aligned | 0 |
| `LD-MATH-RENDER` | **KEEP** | Math contract | 0 |
| `buildPelReasoningContractPromptBlock` on GAM | **REMOVE** | Dup DLA; inactive | −520 when active |
| `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | **REWRITE** | Conflicts PRES-08 | net +0–200 |
| PEC workshop gate | **DEFER** | Architecture | — |
| North Star depth / expert modelling | **DEFER** | Next tranche | — |
| `gam-output-format.js` validators | **KEEP** | Post-hoc safety net | 0 |

---

## Risk assessment

| Change | Risk | Mitigation |
|--------|:----:|------------|
| Remove GAM-WB-11..18 index | **Low** | PRES-03 retains type map; prompt-surface tests |
| Merge WB-01/02/06 into PRES-08 | **Low–Med** | Keep one explicit ≥120w / ≥80w line each in PRES-08 |
| Merge F-rules into PRES-09 | **Med** | Retain F1–F9 IDs for harness grep; single AP list |
| Trim canonical preamble | **Low** | Runtime LD-* remains authoritative |
| Rewrite defaultPromptNotes | **Low** | Drop WB-22..31 refs (already removed) |
| Merge runtime self-study blocks | **Med** | One marker; preserve all semantic bullets |
| Enable PEL reasoning block without rewrite | **High** | **Do not** — reintroduces thinness conflict |
| Aggressive PRES mirror compaction | **Med** | Keep EV-GAM-FAIL IDs referenced in tests |

**Regression floor:** `tests/workbook-contract-prompt-surface.test.js`, `tests/gam-output-format.test.js`, `ev-38s-production-pipeline-chase.mjs` (`fullOk`), manual Inflation GAM type checklist.

---

## Smallest safe implementation plan

### Wave A — Pack cleanup only (recommended first)

| Step | Action | Owner file |
|:----:|--------|------------|
| A1 | Merge GAM-WB-11..18 → PRES-03 see-also | `domain-learning-design-step-patterns.md` §6 GAM |
| A2 | Merge GAM-WB-01/02/06 depth → PRES-08 appendix | Same |
| A3 | Single fail taxonomy in PRES-09; trim duplicate AP/F footer | Same |
| A4 | Canonical contracts → one-line LD-* refs | Same |
| A5 | Rewrite `defaultPromptNotes` (5–8 lines, no episode-shaping) | Same |
| A6 | Replace *minimal assumptions* → *necessary assumptions for complete bodies* | Same |
| A7 | Run prompt-surface + chase harness | Tests |

### Wave B — Runtime trim (optional)

| Step | Action |
|:----:|--------|
| B1 | Merge reading + voice + timeline markers (preserve bullets) |
| B2 | Rewrite PEL reasoning materials block (PRES-08 back-ref) **before** any PEC gate change |
| B3 | Remove `buildPelReasoningContractPromptBlock` from GAM augmentation path |

### Wave C — Explicitly out of scope

- DLA / Page / Episode Plan packs  
- Population contract / workflow chaining  
- PEC gate logic  
- North Star teaching depth expansion  
- `gam-output-format.js` validator changes  

---

## Projected prompt-size reduction

| Scenario | Pack combined | Augmented GAM (SD) | Δ pack | Δ augmented |
|----------|-------------:|-------------------:|-------:|------------:|
| **Current (post–2B)** | 22,084 | 32,692–35,349 | — | — |
| **Wave A conservative** | ~17,500 | ~28,000–30,000 | **−4,500 (~20%)** | **−5,000 (~15%)** |
| **Wave A likely** | ~15,500 | ~26,000–28,000 | **−6,500 (~29%)** | **−7,500 (~22%)** |
| **Wave A + B** | ~15,500 | ~24,500–26,500 | −6,500 | **−9,000 (~27%)** |
| **Aggressive (2B audit floor)** | ~12,000–14,500 | ~24,000–26,000 | −8,500–10,000 | −10,000+ |

**Cumulative from pre–38S GAM pack (~28,354):** Wave A likely → **~45–48% total pack reduction** while retaining GAM-PRES realisation authority.

**Depth outcome:** Cleanup alone improves **attention to PRES-08**; measurable depth gain still requires **PEL block rewrite** (when active) and is **not** the goal of this pass.

---

## Success criteria (this audit)

| Criterion | Met? |
|-----------|:----:|
| Identified architecturally necessary GAM instructions | ✓ |
| Mapped duplication vs GAM-PRES-07/08/09 | ✓ |
| Mapped duplication vs LD-MATERIALS-COPY / LD-TABLE-FIDELITY | ✓ |
| PEL inactive/duplicate/conflict analysis | ✓ |
| Brevity/thinness inventory | ✓ |
| Teaching-quality items deferred | ✓ |
| Smallest safe cleanup + size projection | ✓ |
| No prompt/code changes | ✓ |
| EP / DLA / Page / schema / population / chaining untouched | ✓ |

---

## Related artefacts

- [38S-handover-pack.md](38S-handover-pack.md)
- [38S-phase-2b-b2-gam-reasoning-alignment-audit.md](38S-phase-2b-b2-gam-reasoning-alignment-audit.md)
- [38S-prompt-sanitisation-phase-2b-gam-audit.md](38S-prompt-sanitisation-phase-2b-gam-audit.md)
- [38S-prompt-sanitisation-phase-2b-gam-dedupe.md](38S-prompt-sanitisation-phase-2b-gam-dedupe.md)
- [38S-page-rendering-audit.md](38S-page-rendering-audit.md)
- `../artefacts/EV-38S-2B-gam-prompt-metrics.json`
- `../artefacts/EV-38S-2B-gam-audit-structure.txt`
- `../artefacts/EV-38S-AFTER-4-run-log.json`
- `lib/ld-materials-copy.js` · `lib/ld-table-fidelity.js` · `lib/ld-self-directed-rhetoric.js`

---

*End of Final GAM Prompt Cleanup audit (read-only).*

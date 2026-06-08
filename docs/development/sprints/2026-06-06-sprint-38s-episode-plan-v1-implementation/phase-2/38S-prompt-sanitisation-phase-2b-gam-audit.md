# 38S Prompt Sanitisation Phase 2B — GAM Audit (read-only)

**Date:** 2026-06-08  
**Status:** **COMPLETE — investigation only; no prompt or code changes**  
**Type:** GAM pack + runtime augmentation audit  
**Predecessor:** [Phase 2A DLA sanitisation](38S-prompt-sanitisation-phase-2a-dla-only.md) · [Phase 1 deletion potential](38S-prompt-sanitisation-phase-1-deletion-potential.md) · [Responsibility audit](38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md)  
**Probe:** `scripts/audit-gam-phase-2b-readonly.mjs` · artefacts `EV-38S-2B-gam-*`

---

## Executive summary

**Primary question:** What can GAM lose now that Episode Plan owns planning and DLA owns obligation population?

**Answer:** GAM is **architecturally correct** (realisation-only, anti-collapse, L3 depth intent) but **~35–50% of pack text is sediment**: duplicate blocks, triple-copied output organisation, and GAM-WB ↔ GAM-PRES overlap. **Educational shallowness is not primarily missing GAM rules** — pack depth rules (GAM-PRES-07/08) are strong — but **competing thinness signals** in pack (`brief`, `minimal assumptions`) and runtime (PEL “short/concise” overlays) plus **attention decay** from prompt length.

**Post-2A context:** End-to-end manual runs show correct structure (explanation → worked_thinking → guided_practice → verification → transfer). Phase 2B should **dedupe and sharpen**, not remove realisation authority.

**Measured sizes (2026-06-08):**

| Layer | Chars |
|-------|------:|
| GAM `promptTemplate` | 26,544 |
| GAM `defaultPromptNotes` | 1,810 |
| **Pack combined** | **28,354** |
| Seeded (pack in workflow) | 26,448 |
| **Augmented self-directed** | **~42,117** |
| Runtime delta | ~15,669 |

---

## A. Current GAM responsibility map

| Block | ~Size | % of template | Class | Recommendation | Why GAM still needs it (if keep) |
|-------|------:|:-------------:|:-----:|:--------------:|----------------------------------|
| Context / Role / Task / Instructions | ~750 | 3% | **A Realisation** | **KEEP** (minor trim) | Defines GAM as obligation realiser, not designer |
| Canonical contracts preamble | ~1,655 | 6% | **D Duplicate** | **MERGE** → one-line refs | LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-MATH-RENDER injected at runtime (~8.5k) |
| **GAM-PRES-00..09** | ~6,883 | 26% | **B Fidelity** | **KEEP** (compact EV/AS mirrors) | Order preservation, anti-collapse, L3 body minima — core post-EP authority |
| **GAM-PRES-10** | ~5,963 | 22% | **B Fidelity** | **REWRITE** | Evaluate trio termination — keep gate; **remove embedded Material-type duplicate** |
| **Material-type realisation** (standalone) | ~4,005 | 15% | **D Duplicate** | **MERGE** into GAM-PRES-03 + one type table | Same rules already in GAM-PRES-10 tail and GAM-WB-01..02 |
| **Usability requirements** header | ~400 | 2% | **B Fidelity** | **KEEP** | High-signal “complete bodies, no describe-only” |
| **GAM-WB block** (inside Usability wrapper) | ~10,900 | 41% | **B Fidelity** (60% dup) | **MERGE** with GAM-PRES | F1–F9, MIX, genre rows — largely repeats PRES-04/08/09/10 |
| GAM-WB-11..18 type index | ~2,302 | 9% | **D Duplicate** | **MERGE** | Enumerates types already in material-type section |
| GAM-WB-22..31 Evaluate packs | ~1,965 | 7% | **C Planning residue** | **REMOVE** most | Archetype-conditioned completion rules; DLA + PRES-10 suffice |
| Anti-patterns AP-01..05 | ~800 | 3% | **B Fidelity** | **MERGE** | Keep once with F-rules — currently repeated 3× |
| Output organisation + Scope | ~1,019 × **3 copies** | ~11% | **D Duplicate** | **KEEP once** | Downstream merge depends on `Material:` / `Content:` shape |
| `defaultPromptNotes` | 1,810 | — | **D Duplicate** | **REWRITE** | Re-states entire GAM-WB + runtime modules; episode-shaping line |

**Clause-level sizes (first occurrence):** see `../artefacts/EV-38S-2B-gam-clause-sizes.json`.

---

## 1. Redundant blocks (Q1)

### Exact duplicates

| Duplicate | Occurrences | ~Wasted chars |
|-----------|:-----------:|--------------:|
| **Material-type realisation guidance** | GAM-PRES-10 tail + standalone section | ~3,500–4,000 |
| **Output organisation** (`Activity:` / `Material:` / `Content:`) | GAM-WB-31, Anti-pattern footer, AP-05 footer | ~2,000 |
| **Scope boundaries** | Same three footers | ~400 |
| **Anti-patterns AP-01..05** | GAM-WB-31 + Anti-pattern + cross-refs in notes | ~600 |
| **Pipe table / full bodies / no placeholder** | Pack preamble + `defaultPromptNotes` + runtime LD-* | ~1,200 pack + ~8.5k runtime overlap |
| **worked_example / verification / transfer minima** | GAM-PRES-08, GAM-WB-01/02, material-type lines, Usability/GAM-WB body | ~2,000 |

### Near duplicates

| Theme | Locations |
|-------|-----------|
| Anti-collapse / anti-shell | GAM-PRES-04, GAM-PRES-05, GAM-WB-MIX-01..06, AS-GAM-FAIL-* |
| Evaluate completion trio | GAM-PRES-10, GAM-WB-31, GAM-WB-22..28 |
| Table-only workbook fail | AP-01, GAM-WB-MIX-01, F-rules |
| Consolidation scaffold-not-essay | GAM-WB-06/06b, AP-05, GAM-PRES-04 |
| Exposition ≥120 words | GAM-WB-01, GAM-PRES-08, material-type text/exposition |

### Planning responsibility (remove — Q2C)

| Block | Why redundant post-EP/DLA |
|-------|---------------------------|
| `defaultPromptNotes` — *“Use DLA LO/KM intent to realise richer instructional episodes (orientation/activation/…)”* | Episode shaping belongs upstream |
| **GAM-WB-22..31** archetype-conditioned Evaluate/Analyse completion packs | Beats + DLA obligations + GAM-PRES-10 gate |
| References to inventing function order / session arc inside GAM-WB | No GAM replanning — PRES-00 forbids |

GAM has **no IFP-equivalent** planning block (correct). Residual planning language is **notes + WB-22..31**, not core Task.

---

## 2. Overlap analysis (Q3)

### GAM-PRES vs GAM-WB

| Concern | GAM-PRES owner | GAM-WB repeat | Verdict |
|---------|----------------|---------------|---------|
| Preserve DLA material order | PRES-01, PRES-02 | WB-00 | **Merge** — keep PRES |
| No collapse to checklist-only | PRES-04, PRES-05 | MIX-01..05, F-rules | **Merge** — single fail taxonomy |
| L3 depth bodies | PRES-07, PRES-08 | WB-01, WB-02, WB-06 | **Merge** — PRES-08 is canonical |
| Evaluate trio termination | PRES-10 | WB-31, WB-22..28 | **Keep PRES-10**; trim WB Evaluate pack |
| Workbook genre type mix | PRES-03 map | WB-11..18 index, MIX rules | **One type map** |
| Table pipe realisation | PRES-03 + runtime | WB-38, WB-38F-01 refs | **Runtime LD-TABLE-FIDELITY** |

**Conflict:** GAM-WB-06 demands ≥80 words consolidation while GAM-WB-06b forbids model essays — both valid but stated in **four places**; model may satisfy word count with shallow scaffold.

### Material-type vs GAM-PRES-03/08

Material-type section (~4k) restates PRES-03 type map and PRES-08 minima per type. **Safe to collapse** to PRES-03 table + PRES-08 depth paragraph.

### Usability vs GAM-WB

The heading **“Usability requirements”** (~11.7k span) is misnamed — it contains the **entire GAM-WB workbook contract**, not usability-only bullets. The first ~400 chars are true usability; the rest is WB duplication.

### Runtime vs pack

| Runtime block | Chars | Overlaps pack |
|---------------|------:|---------------|
| LD-TABLE-FIDELITY | ~3,852 | Canonical preamble, GAM-WB-38, material-type tables |
| LD-MATERIALS-COPY | embedded | Usability, GAM-PRES-04, anti-describe rules |
| LD-SELF-DIRECTED-RHETORIC | ~3,607 | Output org facilitator ban |
| Reading sufficiency | ~717 | GAM-WB-01 exposition length |
| Material voice | ~1,070 | Output org, LD-SELF-DIRECTED-RHETORIC |
| Timeline sequencing | ~1,522 | GAM-WB ordering tasks |
| LD-MATH-RENDER | ~1,219 | Pack math lines |
| PEL reasoning materials (conditional) | ~1,400 | **Conflicts** GAM-PRES-08 depth |

Phase 2B pack work should **assume runtime modules stay**; pack dedupes to **cross-ref**, not re-teach.

---

## 3. Depth conflicts (Q4)

### Pro-depth (keep)

- **GAM-PRES-07:** expand DLA depth cues; ≥120 words judgement teaching; do not compress for duration
- **GAM-PRES-08:** verification ≥4 items; worked analytic ≥120 words; transfer ≥80 words; function-shaped bodies
- **GAM-WB-01/02:** exposition ≥120 words; full worked_example bodies
- **Usability:** complete enough to use without major rewriting
- **`lib/gam-output-format.js`:** MIN_TEACHING_BODY 120, MIN_CHECKLIST_BODY 80 (validator — not prompt)

### Anti-depth / thinness signals

| Source | Text | Conflict with |
|--------|------|---------------|
| Output org | `Purpose: <brief purpose>` | Neutral label — 8× “brief” in template |
| Usability | *“minimal, reasonable assumptions”* | L3 full teaching bodies |
| Material-type / reflection | *“brief reflection cues”* | Transfer/reflection depth |
| Runtime reading sufficiency | *“brief explanations”* | 150–300+ word reading bar |
| Runtime PEL reasoning | *“one **short** worked micro-example”* | PRES-08 ≥120w worked pass |
| Runtime PEL reasoning | *“concise … cues”*, closure *“2–3 items”* | Verification ≥4 items |
| Runtime PEL reasoning | *“one concise reasoning cue set per activity”* | Multi-material episodes |

**Verdict:** Shallow outputs are **consistent with signal competition**, not missing GAM-PRES-08. Long prompt + late thinness cues → model satisfies structure (tags, types) at **minimum viable prose**.

**Phase 2B implication:** Dedupe pack **and** align runtime PEL GAM block in Phase 2B-b (runtime sub-phase) — pack-only trim insufficient for depth.

---

## 4. Minimum GAM (Q5)

Assuming **Episode Plan → DLA → GAM** is correct, smallest pack that still guarantees fidelity:

```text
1. Context/Task (realise required_materials; learning_activities source of truth; no redesign)
2. GAM-PRES core (deduped 00–09): order, anti-collapse, type map, L3 depth (07–08)
3. GAM-PRES-10 Evaluate termination (compact)
4. Single fail taxonomy: F1–F7 + AP-01..05 (once)
5. Output organisation (once)
6. One-line runtime refs: LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-MATH-RENDER, LD-SELF-DIRECTED-RHETORIC
7. defaultPromptNotes (5–8 lines, no episode-shaping)
```

**Estimated minimum pack:** ~12,000–14,500 chars  
**Estimated augmented self-directed after pack trim (runtime unchanged):** ~28,000–32,000 chars

**Must not delete (charter):** anti-collapse semantics, L3 depth floors, workbook genre F-rules (deduped), table fidelity authority, output shape, Evaluate trio gate.

---

## B. Top deletion candidates (ranked)

| Rank | Target | ~Savings | Risk |
|:----:|--------|----------:|:----:|
| 1 | Standalone **Material-type realisation** (keep merge in PRES-03) | 3,500–4,000 | Low |
| 2 | **Duplicate Output organisation + Scope** (2 extra copies) | 2,000 | Low |
| 3 | **GAM-WB-22..31** Evaluate/Analyse archetype packs | 1,500–2,000 | Low–Med |
| 4 | **GAM-WB-11..18** type index (types in PRES-03) | 1,500–2,300 | Low |
| 5 | **Canonical contracts preamble** prose (keep refs) | 1,200–1,600 | Low |
| 6 | **GAM-PRES EV-GAM / AS-GAM mirror sentences** | 1,000–1,500 | Med |
| 7 | **defaultPromptNotes** essay + episode-shaping line | 800–1,200 | Low |
| 8 | Repeated **AP-*** list in WB-31 / Anti-pattern footer | 600–800 | Low |
| 9 | **GAM-WB-01..05** after PRES-08 merge | 800–1,000 | Med |
| 10 | Pack inline **pipe table / maths** lines | 400–600 | Low |

---

## C. Top merge candidates (ranked)

| Rank | Merge | Into | ~Savings |
|:----:|-------|------|----------:|
| 1 | GAM-WB F1–F9 + MIX + AP-01..05 | GAM-PRES-09 single fail taxonomy | 2,500–3,500 |
| 2 | GAM-WB-06 + GAM-WB-06b + AP-05 | One consolidation scaffold clause | 800–1,200 |
| 3 | Material-type + GAM-WB-02 worked/sample/modelling | GAM-PRES-03 + PRES-08 | 1,500–2,000 |
| 4 | Usability header + GAM-WB wrapper | Rename; strip WB from “Usability” heading | Clarity |
| 5 | Pack table/materials prose | Runtime LD-* cross-refs only | 1,200–1,800 |
| 6 | Runtime reading + voice + timeline | Single `LD-GAM-SELF-STUDY-MATERIALS` (38B proposal) | ~500 net markers |

---

## D. Estimated reduction

| Scenario | Pack total | Δ from 28,354 | Augmented SD (est.) |
|----------|----------:|---------------:|--------------------:|
| **Conservative** | ~17,000 | −40% | ~36,000 |
| **Likely** | ~14,500 | −49% | ~32,000 |
| **Aggressive** | ~12,000 | −58% | ~28,000 |

Runtime PEL alignment (not counted above): additional depth gain, ~0–200 chars net if “short/concise” removed.

---

## E. Recommended Phase 2B implementation order

1. **Remove duplicate Material-type section** — keep PRES-03/08 only (safest, high chars).
2. **Deduplicate Output organisation + Scope** — single copy at end.
3. **Remove GAM-WB-22..31** archetype packs — retain PRES-10 Evaluate gate.
4. **Merge F1–F9 + AP-* into GAM-PRES-09** — delete GAM-WB-31 fail footer repetition.
5. **Collapse GAM-WB-11..18** into PRES-03 type map.
6. **Trim canonical preamble + defaultPromptNotes** to runtime cross-refs.
7. **Compact GAM-PRES-00..06** EV/AS mirrors (keep semantics).
8. **Re-run** `workbook-contract-prompt-surface.test.js`, `gam-output-format.test.js`, `ev-38s-production-pipeline-chase.mjs`.
9. **Manual LLM run** — Inflation workbook; compare M1/M2/M8 word counts vs EV-38S-AFTER-4.
10. **Phase 2B-b (runtime):** align `buildSelfDirectedGamPelReasoningMaterialPromptBlock` with PRES-08 minima.

---

## Success criterion check

For every **surviving** instruction, GAM must answer: *“Why does GAM still need this now that Episode Plan and DLA exist?”*

| Surviving block | Answer |
|-----------------|--------|
| GAM-PRES order/collapse | DLA specifies obligations; GAM must not reorder or collapse bodies |
| GAM-PRES-07/08 L3 | DLA sets `depth_floor`; GAM authors learner-usable prose at that floor |
| GAM-PRES-10 | DLA Evaluate trio obligations; GAM must realise all three materials |
| Fail taxonomy | Proof/harness alignment; catch table-only and spoiler consolidation |
| Output organisation | Page merge and `gam-output-format.js` parse depend on shape |
| Runtime LD-* modules | Single canonical authority for tables, copy, math, rhetoric |

**Cannot answer for:** duplicate material-type block, triple output org, WB-22..31 archetype packs, notes “richer instructional episodes”, runtime “short micro-example”.

---

## Constraints honoured

- No prompt modifications in this phase  
- No Episode Plan / FunctionEnum / DLA contract / proof harness / renderer changes  
- Audit-only probe script added for reproducibility  

---

## Related artefacts

- `../artefacts/EV-38S-2B-gam-clause-sizes.json`
- `../artefacts/EV-38S-2B-gam-section-excerpts.txt`
- `../artefacts/EV-38S-2B-gam-audit-structure.txt`
- Production GAM sample: `EV-38S-AFTER-4-gam.txt` (structurally correct, depth variable)

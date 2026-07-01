# GAM Duplication Audit (Sprint 57 Discovery)

**Status:** Evidence record  
**Date:** 2026-07-01  
**Probe:** `node scripts/probe-gam-s57-audit-metrics.js` (full lib bootstrap, RNA/HCV self-directed brief)

---

## 1. Summary

| Category | Estimated duplicate footprint | % of augmented prompt (46,349) |
|----------|------------------------------:|-------------------------------:|
| Duplicate guidance (depth, genre, voice) | **~12,000–16,000 chars** | 26–35% |
| Duplicate examples (SP GOOD shapes + PEL cross-refs) | **~4,500–5,500 chars** | 10–12% |
| Duplicate validation semantics (pack FAIL + capture gate) | **~1,500–2,500 chars** | 3–5% |
| **Total estimated duplication** | **~18,000–24,000 chars** | **39–52%** |

Estimates are conservative: they count thematic overlap (same instructional rule restated), not byte-identical strings.

---

## 2. Duplicate guidance

### 2.1 Material depth floors (GAM-PRES-08 ↔ SP ↔ PEL)

| Rule | Authorities | Occurrences in augmented prompt |
|------|-------------|--------------------------------:|
| `transfer_prompt` ≥80 words | Pack GAM-PRES-08 (T1), SP-03, PEL reasoning, LD-SELF-DIRECTED-RHETORIC (gam) | **7** (`80 words` phrase count) |
| GAM-PRES-08 reference | Pack + PEL + rhetoric + self-study | **11** |
| Checklist ≥4 criteria-linked items | Pack GAM-PRES-08 (V1), SP-05, PEL reasoning | 3 rule sets |
| Worked_example bridge + experts notice | Pack GAM-PRES-08 (A1), SP-06, PEL reasoning | **5** (`What experts notice`) |
| Consolidation scaffold-only | Pack GAM-WB-06, SP-04, GAM-PRES-05 | **4** (`scaffold-only`) |
| Anti-spoiler / do not pre-fill | Pack GAM-PRES-05, SP-02/06/07, PEL | **2+** (`Do not pre-fill`) |

**Evidence — PEL reasoning block restates SP markers:**

```10425:10446:app.js
  function buildSelfDirectedGamPelReasoningMaterialPromptBlock() {
    return [
      // ...
      "- When required_materials specifies worked_example, after labelled steps and before Bridge, include `## What experts notice` ... per INSTRUCTIONAL-PATTERN-SP-06.",
      "- When required_materials specifies checklist, include `## Common mistakes` ... per INSTRUCTIONAL-PATTERN-SP-05",
      "- When required_materials specifies closure, debrief, or evaluative-judgement prompts, realise per GAM-PRES-08 (T1)/(E1): transfer_prompt and closure materials ≥80 words",
```

**Estimated char overlap:** SP blocks (14,979) + PEL reasoning (3,874) + pack GAM-PRES-08 segment (~2,500 embedded) ≈ **~8,000–10,000 chars** teaching overlapping depth/genre rules.

### 2.2 Facilitator / learner-voice ban

| Source | Location | `facilitator` mentions |
|--------|----------|------------------------|
| Pack template | §6 `promptTemplate` | 1–2 |
| Self-study materials block | `buildSelfDirectedGamLearnerVoicePromptBlock` | 4+ |
| LD-SELF-DIRECTED-RHETORIC (gam) | `lib/ld-self-directed-rhetoric.js` SHARED_LINES | 2+ |
| PEL reasoning | `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | 1 |

**Probe count:** `facilitator` **9** in full augmented prompt.

**Estimated duplicate footprint:** ~600–900 chars of near-identical bans.

### 2.3 Table / materials fidelity

| Topic | Pack | Runtime |
|-------|------|---------|
| Pipe tables | GAM-WB-38F-01 (~in template) | LD-TABLE-FIDELITY (3,916 chars in probe) |
| Full bodies, no catalogue | GAM-PRES-00 usability lines | LD-MATERIALS-COPY (~1,259, no marker — sub-chain) |

Pack names LD-TABLE-FIDELITY and LD-MATERIALS-COPY in template **and** appends them at runtime (sub-chain dedupes main-chain for table; materials copy has no visible marker).

**Estimated overlap:** ~1,200–1,800 chars.

### 2.4 Anti-redundancy vs completeness

Stated twice with identical carve-out:

```10248:10250:app.js
      "- Do not duplicate content unnecessarily. However, anti-redundancy must never reduce a material below the minimum instructional richness required by GAM-PRES-08.",
      "- Prefer instructional completeness over brevity."
```

PEL reasoning line 10446 repeats the GAM-PRES-08 carve-out.

**Estimated duplicate footprint:** ~200 chars literal + semantic tension (see Contract Conflict Audit).

### 2.5 Worked / fading sequence

Repeated in:
- Pack GAM-PRES / GAM-WB
- LD-SELF-DIRECTED-RHETORIC `GAM_AUTHORING_LINES` (worked example / fading)
- SP-06 (bridge pattern)
- PEL reasoning (walkthrough ≥120 words)

**Estimated overlap:** ~800–1,200 chars.

---

## 3. Duplicate examples

| Example type | Count | Chars (est.) | Duplication note |
|--------------|------:|-------------:|----------------|
| SP GOOD shape examples | **7** (SP-01..07) | ~3,800 (within 14,979 SP total) | Each restates genre already in GAM-PRES-03/08 |
| `## Common mistakes` in SP-05 rules + example | **6** phrase hits | ~400 in rules + ~200 in example | PEL points to SP-05 again |
| Pack output organisation template | 1 | ~600 | Unique |
| JSON exemplars on emit path | **0** | 0 | Healthier than pre-S56 DLA |
| `buildGamOutputContractSystemPrompt` exemplar | 1 | 1,250 | Retry/probe only — not main emit |

**Similar exemplar clusters:**
- SP-05 checklist example + SP-06 worked_example example + SP-07 sample_output example all model “depth with diagnostic coaching” — structurally similar bullet + heading patterns (~1,200 chars thematic overlap).

**Duplicate exemplar footprint estimate:** ~4,500–5,500 chars.

---

## 4. Duplicate validation

| Check | Prompt-side | Capture-side |
|-------|-------------|--------------|
| Thin material bodies | GAM-PRES-09 DEPTH-COLLAPSE, SP FM-* FAIL codes | GAM-FMT-04 (`minBodyForType`: checklist 80ch, teaching 120ch) |
| Transfer word band | GAM-PRES-08 (T1) ≥80 **words** | GAM-FMT-08 `"at least 80 words"` marker (capture normalise can append) |
| JSON stub forbidden | Pack output organisation | GAM-FMT-01 |
| Pack text shape | Pack `Material:` / `Content:` template | GAM-FMT-02 |
| Facilitator labels | Self-study + rhetoric prompt bans | `sanitizeSelfDirectedGamMaterialsOutput` + `evaluatePelGamMaterialStabilisation` |
| A4 Evaluate preservation | GAM-PRES-10 + EV-GAM-FAIL | `validateGamA4ComposeContract` (compose, not emit) |

**No PRE-EMIT gate** on GAM emit (unlike DLA post-S56) — validation duplication is **prompt FAIL taxonomies vs capture tiered gate**, not dual emit-time checklists.

**Estimated validation duplication:** ~1,500–2,500 chars (FAIL taxonomy in pack + thin-body warnings in capture lib comments/docs mirrored in prompt).

---

## 5. Comparison to DLA pre-rationalisation (Sprint 55)

| Duplication pattern | DLA pre-S56 | GAM current |
|---------------------|-------------|-------------|
| Word-range repeated | 4–6× per field (25–80 vs 35–80) | Depth floors concentrated in GAM-PRES-08; SP reinforces per type |
| Weak/strong exemplar modules | 3 near-identical modules | 0 pack exemplar pairs; SP has genre examples only |
| Facilitator ban | 3× | 3× (similar) |
| OUTPUT CONTRACT + SSOT + PRE-EMIT stack | **Yes — severe** | **No** |
| JSON example on emit | Yes (~3,032 chars) | **No** |

GAM duplication is **narrower in topic** (material genre/depth) but **similar in mechanism** (pack + runtime stack restating the same floors).

---

## 6. Traceability

| Evidence | Source |
|----------|--------|
| Phrase counts (`80 words`: 7, `GAM-PRES-08`: 11, etc.) | `scripts/probe-gam-s57-audit-metrics.js` 2026-07-01 |
| SP block sizes | Probe `blockSizes.spTotal`: 14,979 |
| PEL reasoning size | Probe `blockSizes.pelReasoning`: 3,874 |
| Assembly chain | `app.js` ~10997–11112 |
| SP definitions | `lib/instructional-pattern-prompt.js` |

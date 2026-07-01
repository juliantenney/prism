# GAM Remediation Results (Sprint 57)

**Status:** Completed targeted remediation pass  
**Date:** 2026-07-01  
**Baseline probe:** `scripts/probe-gam-s57-audit-metrics.js` · RNA/HCV self-directed brief · full lib bootstrap

---

## Prompt metrics

| Metric | Baseline (pre) | Post-remediation | Δ |
|--------|---------------:|-----------------:|--:|
| **Augmented total** | **46,349** | **41,558** | **−4,791 (−10.3%)** |
| Seeded (pack) | 15,145 | 15,145 | 0 |
| Runtime delta | +31,204 | +26,413 | −4,791 |
| SP blocks (total) | 14,979 | 13,369 | −1,610 |
| PEL reasoning block | 3,874 | 1,501 | −2,373 |
| LD-SELF-DIRECTED-RHETORIC (gam) | 1,948 | 844 | −1,104 |
| Self-study materials | 3,529 | 3,529 | 0 |

### Phrase-level duplication (probe)

| Phrase | Baseline | Post | Δ |
|--------|--------:|-----:|--:|
| `80 words` | 7 | 5 | −2 |
| `GAM-PRES-08` | 11 | 14 | +3 (consolidation refs) |
| `facilitator` | 9 | 9 | 0 |
| `Common mistakes` | 6 | 4 | −2 |
| `INSTRUCTIONAL-PATTERN-SP` | 11 | 8 | −3 |

Pack contribution unchanged (15,145 chars). All size reduction is runtime-layer deduplication.

---

## Changes made

### Remediation 1 — SP ↔ GAM-PRES authority consolidation

| Item | Detail |
|------|--------|
| **Files** | `lib/instructional-pattern-prompt.js` |
| **Ownership** | **GAM-PRES-08/09** remains depth/completeness SSOT (pack). SP blocks own **pattern shape + FM codes + GOOD examples** only. |
| **Change** | Added one-time `INSTRUCTIONAL-PATTERN-PROMPT (GAM depth reference)` prefix deferring depth to GAM-PRES. SP-03/04/05 reference GAM-PRES for word bands and checklist floors instead of restating pack minima in isolation. Removed per-block repeated “domain-appropriate only” tail (moved to prefix). |
| **Removed** | ~1,610 chars of redundant depth/completeness teaching across SP-01..07 (net after prefix). |

### Remediation 2 — PEL reasoning trim

| Item | Detail |
|------|--------|
| **Files** | `app.js` (`buildSelfDirectedGamPelReasoningMaterialPromptBlock`) |
| **Ownership** | PEL reasoning owns **cross-material reasoning behaviours** (weak/strong contrast, diagnostic coaching, source spans, static retrieval). SP-05/06/07 own heading/shape rules. GAM-PRES owns depth. |
| **Change** | Replaced 22-line restatement of SP/GAM-PRES rules with 11-line block using SP cross-references. |
| **Removed** | ~2,373 chars duplicated SP section headings, checklist depth, transfer ≥80w restatement, anti-redundancy carve-out (retained in self-study block). |

### Remediation 3 — Facilitator-ban ownership

| Item | Detail |
|------|--------|
| **Files** | `lib/ld-self-directed-rhetoric.js`, `app.js` (self-study block unchanged) |
| **Authoritative owner** | **`buildSelfDirectedGamLearnerVoicePromptBlock`** inside `buildSelfDirectedGamSelfStudyMaterialsPromptBlock` (`app.js` ~10240) |
| **Change** | GAM rhetoric role uses `GAM_SHARED_LINES` that **delegates** facilitator-ban to self-study materials block. Removed facilitator-ban line from GAM rhetoric shared lines. Trimmed `GAM_AUTHORING_LINES` (removed worked/fading/closure depth duplicates). |
| **Removed** | ~1,104 chars from GAM rhetoric block. Capture sanitization (`sanitizeSelfDirectedGamMaterialsOutput`) unchanged — enforcement layer, not prompt teaching. |
| **Note** | Probe still counts `facilitator` ×9 — pack template + self-study block (authoritative) + capture path references. GAM rhetoric no longer teaches the ban. |

### Remediation 4 — Depth rule alignment

| Item | Detail |
|------|--------|
| **Files** | `lib/gam-output-format.js` |
| **Canonical authority** | **Pack GAM-PRES-08/09** (word floors on generation) |
| **Secondary** | GAM-FMT char heuristics (`MIN_CHECKLIST_BODY` 80, `MIN_TEACHING_BODY` 120) — **capture advisory only** |
| **Change** | Documented hierarchy in module header. GAM-FMT-04 messages now state `GAM-PRES-08/09 word floors authoritative`. `buildGamOutputContractSystemPrompt` separates pack word minima from capture char heuristics. **Numeric thresholds unchanged** — no learner-facing behaviour change. |

---

## Authority inventory (post)

| # | Authority | Role after remediation |
|---|-----------|------------------------|
| 1 | Pack GAM-PRES/GAM-WB | Depth, type, FAIL SSOT |
| 2 | INSTRUCTIONAL-PATTERN prefix + SP-01..07 | Pattern shape; defers depth to GAM-PRES |
| 3 | Self-study materials block | **Facilitator-ban owner** |
| 4 | PEL reasoning materials | Unique reasoning behaviours; defers shape to SP |
| 5 | LD-SELF-DIRECTED-RHETORIC (gam) | Scope + GAM-PRES/SP pointers only |
| 6–12 | EQF, table, materials copy, math, capture gate, sanitization, compose | Unchanged |

No new contracts or governance layers added.

---

## Behaviour verification

| Check | Result |
|-------|--------|
| Schema changes | **None** |
| Contract removals | **None** — SP FM codes, GAM-PRES refs, capture gate tiers preserved |
| Pack template | **Unchanged** (15,145 chars) |
| Tests (GAM-focused) | **86/86 pass** — `workflow-instructional-pattern-prompt`, sprint-51 GAM contracts, `ld-self-directed-rhetoric`, `gam-output-format` |
| Capture gate thresholds | **Unchanged** (80/120 char heuristics; transfer word-band check preserved) |
| Assessment generation path | **Not modified** — no rubric/assessment-step changes |

---

## Final recommendation

### Classification: **AMBER** (improved — trending toward GREEN)

| Criterion | Assessment |
|-----------|------------|
| Prompt size | Reduced **10.3%** (46,349 → 41,558). Meaningful but not at DLA post-rationalisation scale. |
| Duplication | SP/PEL/rhetoric overlap reduced. `facilitator` probe count unchanged (pack + self-study). |
| Ownership | **Clearer** — GAM-PRES depth, self-study facilitator-ban, SP shape. |
| New layers | **None introduced** |
| Further work warranted? | **No dedicated rationalisation programme.** Optional follow-up: pack-internal GAM-PRES trim if size target <40k; 38B probe bootstrap parity (audit P5). |

GAM remains healthier than pre-S56 DLA and does not exhibit RED-level governance drift. Targeted cleanup objectives met; behaviour preserved.

---

## Traceability

| Artefact | Path |
|----------|------|
| Probe script | `scripts/probe-gam-s57-audit-metrics.js` |
| Pre-remediation baseline | `GAM-BASELINE-METRICS.md`, `GAM-RATIONALISATION-RECOMMENDATION.md` |
| SP module | `lib/instructional-pattern-prompt.js` |
| PEL reasoning | `app.js` ~10425 |
| Facilitator owner | `app.js` ~10240–10251 |
| GAM rhetoric (gam role) | `lib/ld-self-directed-rhetoric.js` |
| Depth alignment | `lib/gam-output-format.js` |

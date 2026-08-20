# GAM Baseline Metrics (Sprint 57 Discovery)

**Status:** Evidence record  
**Date:** 2026-07-01  
**Probe:** `buildSeededStepPromptForWorkflowStep` + `applyWorkflowStepRuntimePromptAugmentations` · RNA/HCV self-directed learner-page brief · same methodology as Sprint 38B / DLA-08 probes

---

## 1. Prompt size summary

| Metric | Self-directed | Facilitated |
|--------|--------------:|------------:|
| **Seeded (pack static)** | 15,145 | 15,145 |
| **Augmented (emitted core)** | **46,349** | **~21,967** |
| **Runtime delta** | +31,204 | +6,822 |
| **Augmentation ratio** | 3.06× seeded | 1.45× seeded |

**Historical comparison:**

| Probe | GAM augmented | Source |
|-------|--------------:|--------|
| Sprint 38B (2026-06-04) | 34,482 | `38B-1-prompt-audit.md` |
| **Sprint 57 (2026-07-01)** | **46,349** | This probe |
| **Δ since 38B** | **+11,867 (+34%)** | Accretion trend |

| Reference | Step | Augmented chars |
|-----------|------|----------------:|
| DLA pre-rationalisation (S55) | DLA | 49,949 (with upstream embed context) |
| DLA post-rationalisation (S56) | DLA | 31,932 (core only) |
| **GAM current** | GAM | **46,349** |

GAM augmented size **exceeds post-rationalisation DLA core** by ~14,417 chars and has **grown ~34%** since the 38B baseline.

---

## 2. Prompt size breakdown (self-directed)

| Layer | Component | Chars | % of augmented |
|-------|-----------|------:|---------------:|
| **Static** | Pack `promptTemplate` | 15,145 | 32.7% |
| **Static** | Pack `defaultPromptNotes` | (in seeded) | — |
| **Dynamic** | EDUCATIONAL-QUALITY-FRAMEWORK | 1,727 | 3.7% |
| **Dynamic** | INSTRUCTIONAL-PATTERN SP-01..07 | 14,986 | 32.3% |
| **Dynamic** | Self-directed GAM sub-chain* | 9,396 | 20.3% |
| **Dynamic** | PEL reasoning materials | 3,875 | 8.4% |
| **Dynamic** | LD-MATH-RENDER | 1,220 | 2.6% |
| **Dynamic** | Pedagogic cognition (conditional) | 0† | 0% |

\* Sub-chain includes LD-TABLE-FIDELITY, LD-MATERIALS-COPY (no marker), self-study/voice block, LD-SELF-DIRECTED-RHETORIC (gam). Main-chain table/materials calls dedupe to 0 Δ.

† Cognition contract inactive for default RNA brief probe.

### Pack-internal split (approximate)

| Pack segment | Chars |
|--------------|------:|
| GAM-PRES-00..10 block | ~8,822 |
| GAM-WB block | ~10,208 |
| Usability + output organisation | ~2,200 |
| Context/role/task preamble | ~4,000 |

---

## 3. Example footprint

| Category | Count | Total chars (est.) |
|----------|------:|-------------------:|
| SP GOOD shape examples | **7** (SP-01..07) | ~3,800 (within SP blocks) |
| LD-TABLE-FIDELITY pipe table example | 1 | ~180 |
| Pack output organisation template | 1 structural | ~600 |
| GAM-PRES weak/strong exemplar pairs | **0** | 0 |
| JSON exemplars on GAM emit path | **0** | 0 |
| `buildGamOutputContractSystemPrompt` (retry only) | 1 A4 Evaluate exemplar | 1,250 |

**SP block total:** 14,991 chars (32% of augmented prompt).

**Duplicate exemplar risk:** SP-05 checklist example + SP-06 worked_example example + SP-07 sample_output example restate depth patterns already in GAM-PRES-08 and PEL reasoning block.

---

## 4. Governance footprint

| Contract family | Runtime block size | In pack template |
|-----------------|-------------------:|:----------------:|
| GAM-PRES / GAM-WB | ~19,030 (embedded) | ✓ |
| INSTRUCTIONAL-PATTERN SP-01..07 | 14,986 | Referenced indirectly |
| EDUCATIONAL-QUALITY-FRAMEWORK | 1,727 | No |
| LD-TABLE-FIDELITY | 2,693 | Named |
| LD-MATERIALS-COPY | 1,259 | Named |
| LD-SELF-DIRECTED-RHETORIC (gam) | 1,949 | Named |
| Self-study materials | 3,530 | No |
| PEL reasoning materials | 3,875 | No |
| LD-MATH-RENDER | 1,220 | Named |
| FAIL taxonomies (F/AP/EV/DEPTH) | ~2,500 (in pack) | ✓ |

**Estimated governance + contract chars (excl. pack task prose):** ~31,200 (67% of augmented prompt).

---

## 5. Incremental augmentation trace

| Step | Δ chars | Cumulative |
|------|--------:|-----------:|
| Seeded pack | — | 15,145 |
| Cognition contract | 0 | 15,145 |
| EQF | +1,727 | 16,872 |
| Instructional patterns | +14,986 | 31,858 |
| Self-directed GAM sub-chain | +9,396 | 41,254 |
| Table fidelity (main chain) | 0 | 41,254 |
| Materials copy (main chain) | 0 | 41,254 |
| PEL reasoning | +3,875 | 45,129 |
| Math render | +1,220 | **46,349** |

**Largest single contributor after pack:** INSTRUCTIONAL-PATTERN SP blocks (+14,986).

---

## 6. Measurement command

```bash
node scripts/probe-gam-s57-audit-metrics.js
```

**Requirements:** Full lib bootstrap via `tests/prism-vm-lib-bootstrap.js` (includes `instructional-pattern-prompt.js`, `educational-quality-framework-prompt.js`). The legacy `probe-38b1-ld-workflow-prompt-audit.js` **under-reports** GAM at **30,344 chars** (missing SP blocks) — do not use for Sprint 57 baselines.

**Probe output (2026-07-01):** `phraseCounts` — `80 words`: 7, `GAM-PRES-08`: 11, `facilitator`: 9, `GOOD shape example`: 7.

---

## 7. Traceability

| Metric | Evidence |
|--------|----------|
| 46,349 augmented | Node probe 2026-07-01 |
| Incremental steps | `applyPedagogicCognition` → `EQF` → `SP` → `selfDirected` → `PEL` → `math` |
| Block sizes | `buildSp*PromptBlock`, `buildSelfDirectedGam*`, `buildLd*PromptBlock` |
| 38B baseline 34,482 | `38B-1-prompt-audit.md` |

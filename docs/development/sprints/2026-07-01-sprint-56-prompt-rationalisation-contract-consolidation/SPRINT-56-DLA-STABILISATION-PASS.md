# Sprint 56 — DLA Stabilisation Pass

**Status:** Complete  
**Date:** 2026-07-01  
**Type:** Reliability + prompt-size recovery (not a rationalisation phase)  
**Predecessors:** [SPRINT-56-DLA-SEMANTIC-FRAMING-SPIKE.md](SPRINT-56-DLA-SEMANTIC-FRAMING-SPIKE.md) · [SPRINT-56-COGNITION-FIELD-REMEDIATION.md](SPRINT-56-COGNITION-FIELD-REMEDIATION.md)

---

## 1. Objectives and outcomes

| Objective | Result |
|-----------|--------|
| Recover core prompt to ≤32k | **Achieved — ~31,932 chars** (DLA-07: ~31,769; post-cognition: ~33,651) |
| Stabilise borderline cognition + bridge | **Partial** — genre language strengthened; batch mean pass below cognition best |
| ≥80% mandatory pass reliably | **Not achieved** — 0/3 stabilisation runs met 80%; mean **13.3%** |
| No new layers/contracts/gates | **Met** |

---

## 2. Variance analysis (six probe runs)

### 2.1 Run history

| Run label | Mandatory pass | Mean preamble | Mean expected_output | Mean self_explanation | Notes |
|-----------|---------------:|--------------:|---------------------:|----------------------:|-------|
| Semantic framing (best) | 20% (1/5) | 78w | 41w | 29w | First material gain |
| Cognition remediation #1 | 0% | ~52w | ~23w | ~24w | expected_output regression (variance) |
| Cognition remediation #2 (best) | **60% (3/5)** | 75w | 29w | 38w | Fixture: `rna-hcv-dla-08-cognition-best-run.json` |
| Stabilisation batch #1 | 0% | 41w | 35w | 24w | **Preamble collapse** all 5 activities |
| Stabilisation batch #2 | 0% | 42w | 36w | 29w | Preamble + cognition short |
| Stabilisation batch #3 (best) | **40% (2/5)** | 61w | 30w | 26w | Fixture: `rna-hcv-dla-08-run.json` |

**Batch aggregate:** `node scripts/probe-dla-08-batch.js 3` → mean **13.3%**, best **40%**, worst **0%**, **0/3 runs ≥80%**.

### 2.2 Fields that fluctuate most

| Field | Variance pattern | Failure type |
|-------|------------------|--------------|
| `activity_preamble` | 41–78w across runs | Mix — runs 1–2 **missing floor** (all 5 below 50w); stabilisation run 3 recovered to 61w mean |
| `self_explanation_prompt` | 24–44w | **Borderline length** — most common histogram failure (4–5/5 activities per run) |
| `expected_output` | 23–41w | Borderline + occasional floor miss after exemplar removal |
| `reasoning_orientation` | 0 or 35–51w | Present/absent selection + length when present |
| `conceptual_contrast_prompt` | 25–44w | Borderline when populated (A3–A4 archetype) |
| `argument_structure_hint` | 28–45w | Improved on A5 when Evaluate archetype selected |
| `intellectual_coherence_bridge` | 0 or 30–44w | **Missing-field** on A2 in cognition best; present in stabilisation runs 1–3 (mean 36–39w) |

### 2.3 Borderline vs missing-field failures

| Failure mode | Prevalence | Example |
|--------------|------------|---------|
| **Borderline length** (32–34w on 35w floor) | High for cognition | A4 `conceptual_contrast_prompt` 32w (cognition best) |
| **Missing bridge** | Medium | A2 in cognition-best run (60% pass blocked) |
| **Missing cognition ≥35w** | Medium | Activities with only sub-floor cognition populated |
| **Preamble collapse** | Run-specific | Stabilisation runs 1–2: all preambles 41–42w |

### 2.4 Bridge omissions vs archetype

| Observation | Detail |
|-------------|--------|
| Bridge required | A2+ in 5-activity sessions (SSOT mandatory line) |
| Cognition-best 60% run | A2 **missing bridge** despite strong cognition — mandatory fail |
| Stabilisation runs | Bridges populated on A2–A5 (mean 36–39w) — **bridge clarification worked** when preamble sufficient |
| Archetype correlation | Weak — omissions correlate with **early-session Understand activities** (A2) when model front-loads cognition fields and omits bridge |

### 2.5 A4-style 32–33w failures — cause assessment

| Suspected cause | Assessment |
|-----------------|------------|
| Exemplar length | **Partial** — pre-fix `argument_structure_hint` strong exemplar was ~27w (fixed in cognition remediation) |
| Wording / genre | **Primary** — model writes 2 imperative sentences (~32w) stopping just below floor |
| JSON brevity pressure | **Secondary** — `Return only the JSON` + long `required_materials` still competes; less dominant after semantic framing |
| Missing third sentence cue | **Addressed** — stabilisation adds “three substantive sentences” and “peer learns the reasoning move” |

---

## 3. Consolidation edits (exact)

### 3.1 Merged / removed duplication

| Location | Change | Chars saved (approx.) |
|----------|--------|----------------------:|
| `COMPACT_DLA_FIELD_LINES` | Merged `COGNITION FIELD GENRE` + `OTHER SEMANTICS` → single **`SCAFFOLD GENRE`** line | ~200 |
| `EXEMPLAR_LINES` | Removed `expected_output` weak/strong pair (AS-05 + semantic framing sufficient) | ~250 |
| Exemplars | Shortened reasoning/contrast/argument/self_explanation strong strings | ~350 |
| `app.js` OUTPUT CONTRACT | Removed duplicate cognition genre line; bridge mandatory on one line | ~180 |
| `app.js` archetype block | Removed duplicate cognition prose line (now in SSOT) | ~120 |
| `app.js` PEL | Pointer to SSOT SCAFFOLD GENRE | ~80 |
| `app.js` JSON example | Shortened cognition strings + footnote | ~400 |
| Domain-pack Task | Merged 2 scaffold lines → 1 | ~120 |
| `episode-plan-dla-integration.js` | SSOT pointer replaces repeated genre text | ~60 |
| `DLA_PRE_EMIT` anti-terse line | Compressed | ~40 |

**Net:** ~33,651 → **~31,932** core (−1,719 chars).

### 3.2 Preserved (not removed)

- AS-05 / DLA-WB-19 expected_output quality-threshold wording (domain pack)
- Semantic framing task line (scaffold strings = page copy)
- Cognition strong exemplars for all four cognition fields (trimmed, not removed)
- SSOT word floors and PRE-EMIT gate
- JSON example with full cognition field set

### 3.3 Stabilisation additions (minimal)

| Target | Addition |
|--------|----------|
| Cognition fields | “Three substantive sentences — peer learns the reasoning move” |
| `intellectual_coherence_bridge` | “mandatory A2+ … carried-reasoning synthesis — not connective metadata” |
| OUTPUT CONTRACT | `intellectual_coherence_bridge mandatory on A2+ per SSOT` |
| MANDATORY_LINES | Bridge line strengthened |

---

## 4. Prompt size

| Stage | Core (no upstream embed) | ≤32k budget |
|-------|------------------------:|:-----------:|
| DLA-07 | ~31,769 | ✓ |
| Post-semantic framing | ~32,187 | ✗ (+418) |
| Post-cognition remediation | ~33,651 | ✗ (+1,882) |
| **Post-stabilisation** | **~31,932** | **✓** |

Copy wrapper (with upstream embed, probe): **~38,253 chars**.

---

## 5. Stabilisation batch results (3 probes)

**Settings:** `gpt-4.1-mini`, temperature 0.35, RNA/HCV brief  
**Report:** `artefacts/dla-08-stabilisation-batch-report.json`  
**Fixtures:** `tests/fixtures/dla/rna-hcv-dla-08-stab-run-{1,2,3}.json`

| Run | Pass | Preamble mean | Expected mean | Self-explanation mean | Bridge mean (A2+) |
|-----|-----:|--------------:|--------------:|----------------------:|------------------:|
| 1 | 0% | 41w | 35w | 24w | 36w |
| 2 | 0% | 42w | 36w | 29w | 37w |
| 3 | **40%** | 61w | 30w | 26w | 39w |
| **Mean** | **13.3%** | 48w | 34w | 26w | 37w |

### Field-level floor compliance (run 3 — best stabilisation)

| Activity | Preamble | Cognition ≥35w | Expected | Bridge | Pass |
|----------|----------|----------------|----------|--------|:----:|
| A1 | ✓ | ✓ (`reasoning_orientation` 48w) | ✓ | — | ✓ |
| A2 | ✓ | ✓ (`reasoning_orientation` 42w) | ✓ | ✓ 61w | ✓ |
| A3 | ✓ | ✗ (`self_explanation` 29w) | ✓ | ✗ absent | ✗ |
| A4 | ✓ | ✗ | borderline | ✓ | ✗ |
| A5 | ✓ | ✗ | ✓ | ✓ | ✗ |

---

## 6. Remaining failure mode

1. **`self_explanation_prompt` remains the highest-variance cognition field** — histogram leader in all batch runs.
2. **Preamble length is run-unstable** (41w vs 75w) — consolidation may have reduced salience of preamble floors vs obligation population.
3. **≥80% is intermittent, not reliable** — cognition-best 60% > stabilisation-best 40% on single runs; batch mean 13.3%.
4. **Topic specificity unchanged** — LO-placeholder prose persists (upstream synthetic LO brief).
5. **Removing `expected_output` exemplar pair** may have increased expected_output/preamble variance (trade-off for budget).

---

## 7. Recommendation

| Option | Rationale |
|--------|-----------|
| **Accept partial improvement** | Semantic + cognition fixes confirmed; 60% peak demonstrates SSOT floors are reachable; production may use capture-side `evaluateGuidedLearningScaffoldEvidence` + repair |
| **Continue minimal tuning** | Restore **compact** `expected_output` exemplar pair (~200 chars) if A/B shows reduced variance; consider temperature **0.2** for Copy path |
| **Post-generation repair** | Borderline failures (32–34w) are repair-friendly; evaluator already encodes genre heuristics |
| **Do not add prompt layers** | Further gains unlikely from accretion; budget recovered at cost of some salience |

**Primary recommendation:** **Accept partial improvement** for Copy-path generation quality, **enable capture-side scaffold repair** for borderline/missing-bridge cases, and **spot-check at temperature 0.2** before further prompt edits.

---

## 8. Tests

| Suite | Result |
|-------|--------|
| Sprint 55 guided-learning-quality | 15 pass |
| Sprint 55 content-preservation | pass |
| Sprint 55 typography-foundation | pass |
| Sprint 56 SSOT rationalisation | 11 pass (core ≤32k) |

**Repro:** `node scripts/probe-dla-08-copy-validation.js` · `node scripts/probe-dla-08-batch.js 3`

---

## 9. Traceability

| Artefact | Role |
|----------|------|
| `rna-hcv-dla-08-cognition-best-run.json` | Cognition remediation 60% run |
| `rna-hcv-dla-08-stab-run-*.json` | Stabilisation batch outputs |
| `rna-hcv-dla-08-run.json` | Latest (stab run 3, 40%) |
| [SPRINT-56-DLA-08-COPY-PATH-VALIDATION.md](SPRINT-56-DLA-08-COPY-PATH-VALIDATION.md) | Updated validation record |

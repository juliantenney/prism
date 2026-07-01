# Sprint 56 — DLA Semantic Framing Spike

**Status:** Complete  
**Date:** 2026-07-01  
**Type:** Targeted semantics experiment (not a rationalisation phase)  
**Hypothesis:** Scaffold fields fail because the model treats them as obligation-population metadata, not learner-facing page copy.  
**Audit basis:** [SPRINT-56-DLA-FIELD-SEMANTICS-AUDIT.md](SPRINT-56-DLA-FIELD-SEMANTICS-AUDIT.md)

---

## 1. Changes implemented

No new prompt layers, contracts, or field renames. Semantic clarification only.

### 1.1 Domain-pack task framing (`domain-learning-design-step-patterns.md`)

**Task line** — obligation population scoped to `required_materials` + `learner_task`; scaffold strings named as learner-facing page copy:

```
- Scaffold strings (activity_preamble, cognition fields, expected_output, intellectual_coherence_bridge): learner-facing page copy — complete prose to the learner, not beat-metadata.
```

**Instructions** — replaced `observable expected_output` with:

```
expected_output (quality-threshold prose per SSOT)
```

### 1.2 AS-05 / DLA-WB-19 (`domain-learning-design-step-patterns.md`)

| Gate | Before | After |
|------|--------|-------|
| **IFP AS-05** | `expected_output = observable evidence not topic coverage` | `expected_output = learner-facing quality-threshold prose (30–70w SSOT), not completion labels or evidence tags` |
| **DLA-WB-19** | `non-empty expected_output with observable completion evidence` | `expected_output = SSOT 30–70w quality-threshold prose, not short completion labels` |

### 1.3 OUTPUT CONTRACT cleanup (`app.js`)

| Element | Before | After |
|---------|--------|-------|
| Section header | `field index; scaffold:` | `learner-facing copy fields — author to the learner; scaffold:` |
| Optional fields | `uncertainty_tension_prompt (one sentence)`; `learner_task may stay concise` | `uncertainty_tension_prompt` (no brevity cue); `learner_task may stay concise without shortening other scaffold fields` |
| JSON example footnote | `38L mandatory rows not shown — see IFP-10…` | `Scaffold strings = production page copy (SSOT floors); 38L mandatory rows not shown in miniature example — see IFP-10/DLA-WB-26..31.` |

### 1.4 Schema genre clarification

**Domain-pack Output** — suffix on `activities[]` line:

```
; scaffold strings = page copy, not metadata labels
```

**Runtime reinforcement** (`LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE` in `app.js`) — same suffix applied when output schema is reinforced on the DLA path.

### 1.5 Episode-plan clarification (`lib/episode-plan-dla-integration.js`)

Added to `buildDlaPopulationOnlyPromptBlock()`:

```
**Scaffold strings:** page copy at SSOT word floors — do not compress beat lists into activity_preamble or other scaffold fields.
```

---

## 2. Prompt size delta

| Metric | Pre-spike (DLA-07) | Post-spike | Δ |
|--------|-------------------:|-----------:|--:|
| Core emitted (no upstream embed) | ~31,769 | **32,187** | **+418** (+1.3%) |
| Copy wrapper (RNA/HCV probe) | ~44,419 | **45,186** | +767 |
| Core with upstream embed (probe) | ~37,745 | **38,512** | +767 |

Budget guard updated to **32,300** chars in `tests/sprint-56-dla-ssot-rationalisation.test.js` to accommodate the net semantic addition while remaining within ~1.3% of the DLA-07 baseline.

---

## 3. DLA-08 validation — before vs after

**Model:** `gpt-4.1-mini` · temperature 0.35 · RNA/HCV self-directed learner-page  
**Fixture:** `tests/fixtures/dla/rna-hcv-dla-08-run.json` (overwritten by post-spike probe run)  
**Prompt artefact:** `artefacts/dla-08-rna-hcv-emitted-copy-prompt.txt`

### 3.1 Summary

| Metric | Pre-spike | Post-spike | Δ |
|--------|----------:|-----------:|--:|
| Mandatory pass (≥80% threshold) | **0 / 5 (0%)** | **1 / 5 (20%)** | +20 pp |
| `evaluateGuidedLearningScaffoldEvidence` | FAIL | FAIL | — |
| Mean `activity_preamble` words | 52.2 | **78.0** | **+25.8** |
| Mean `expected_output` words | 22.0 | **41.4** | **+19.4** |
| Mean best cognition field words | 30.4 | **33.4** | +3.0 |
| Mean `intellectual_coherence_bridge` (A2–A5) | 23.5 | **41.5** | **+18.0** |
| Activities with `expected_output` ≥ 30w | 0 / 5 | **5 / 5** | +5 |
| Activities with preamble ≥ 50w | 3 / 5 | **5 / 5** | +2 |

### 3.2 Per-activity mandatory scoring

| Activity | Pre-spike | Post-spike | Notes |
|----------|:---------:|:----------:|-------|
| A1 | FAIL | **PASS** | Preamble 82w; `reasoning_orientation` 46w; `expected_output` 43w |
| A2 | FAIL | FAIL | `expected_output` 30w ✓; `self_explanation_prompt` 29w; bridge missing |
| A3 | FAIL | FAIL | Preamble 79w; `expected_output` 46w ✓; no cognition ≥ 35w |
| A4 | FAIL | FAIL | Bridge 39w ✓; `expected_output` 40w ✓; cognition fields 22–25w |
| A5 | FAIL | FAIL | Preamble 88w; `expected_output` 48w ✓; bridge 44w ✓; cognition 23–28w |

### 3.3 Field-level word counts (post-spike)

| Activity | Preamble | Best cognition | Expected output | Bridge |
|----------|--------:|---------------:|----------------:|-------:|
| A1 | 82 | `reasoning_orientation` 46 | 43 | — |
| A2 | 64 | `reasoning_orientation` 35 | 30 | absent |
| A3 | 79 | `conceptual_contrast_prompt` 33 | 46 | absent |
| A4 | 77 | `conceptual_contrast_prompt` 25 | 40 | 39 |
| A5 | 88 | `argument_structure_hint` 28 | 48 | 44 |

---

## 4. Qualitative observations

### Improved

- **`expected_output` genre shift** — all five activities now use quality-threshold prose (“You will produce clear, accurate responses demonstrating…”) instead of deliverable manifests (“Completed practice exercises demonstrating…”).
- **Preamble length and prose density** — mean +26 words; fewer single-sentence stubs.
- **`intellectual_coherence_bridge`** — when present (A4, A5), word counts rose to 39–44w with carry-forward framing.
- **First full mandatory pass** — A1 meets all floors, demonstrating the SSOT targets are reachable on Copy path with semantic framing alone.

### Persisting

- **Cognition fields** — `self_explanation_prompt` remains the dominant failure (22–34w); model populates more cognition fields per activity but still undershoots 35w on several.
- **Topic specificity** — outputs still reference “LO1” / “core concept” rather than RNA/HCV mechanisms; upstream synthetic LO brief unchanged.
- **Beat-metadata preambles** — still enumerate orientation/framing/activation/misconceptions in several activities, though at greater length.
- **DLA-08 threshold** — 20% mandatory pass vs 80% target.

---

## 5. Hypothesis assessment

| Hypothesis element | Verdict | Evidence |
|--------------------|---------|----------|
| Metadata frame caused short `expected_output` | **Strong support** | Universal improvement: 0/5 → 5/5 at floor; +19.4w mean; genre shift visible in JSON |
| Metadata frame caused short preambles | **Moderate support** | +25.8w mean; 5/5 ≥ 50w; still beat-flavoured content |
| Metadata frame caused short bridges | **Moderate support** | +18w mean when populated; A4/A5 now at floor |
| Metadata frame caused short cognition fields | **Weak support** | +3w mean only; `self_explanation_prompt` still below floor on 5/5 |
| Semantic framing alone clears DLA-08 | **Rejected** | 20% pass — meaningful progress but insufficient |

**Overall:** The metadata-vs-prose hypothesis **gained substantial support** for `expected_output` and **moderate support** for preambles and bridges. Cognition fields require additional intervention (likely field-specific semantics or exemplar salience) beyond this minimal framing spike.

---

## 6. Test results

All targeted suites pass after spike:

| Suite | Result |
|-------|--------|
| `tests/sprint-55-guided-learning-quality.test.js` | 15 pass |
| `tests/sprint-55-content-preservation.test.js` | pass |
| `tests/sprint-55-typography-foundation.test.js` | pass |
| `tests/sprint-56-dla-ssot-rationalisation.test.js` | 11 pass |
| `tests/workflow-learner-page-mandatory-framing.test.js` | 11 pass |
| `tests/workflow-learner-page-design-page-preservation.test.js` | pass |

**Probe repro:** `node scripts/probe-dla-08-copy-validation.js`

---

## 7. Recommended next steps (not implemented)

1. **Cognition-field-specific semantics** — `self_explanation_prompt` remains the histogram leader; consider targeted AS/IFP wording for generative explanation fields only.
2. **Topic grounding** — synthetic LO brief lacks RNA/HCV substance; qualitative improvement may require richer upstream inputs, not prompt framing alone.
3. **Optional:** `gpt-4.1` (non-mini) spot-check to separate model capacity from instruction effects.
4. **Do not** revert AS-05 / DLA-WB-19 clarifications — strongest measurable gain.

---

## 8. Traceability

| Artefact | Role |
|----------|------|
| [SPRINT-56-DLA-FIELD-SEMANTICS-AUDIT.md](SPRINT-56-DLA-FIELD-SEMANTICS-AUDIT.md) | Investigation input |
| [SPRINT-56-DLA-08-COPY-PATH-VALIDATION.md](SPRINT-56-DLA-08-COPY-PATH-VALIDATION.md) | Pre-spike baseline (0% pass) |
| `tests/fixtures/dla/rna-hcv-dla-08-run.json` | Post-spike generated output |
| `artefacts/dla-08-rna-hcv-emitted-copy-prompt.txt` | Post-spike emitted prompt |

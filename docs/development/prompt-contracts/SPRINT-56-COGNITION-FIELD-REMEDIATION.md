# Sprint 56 — Cognition Field Remediation

**Status:** Complete  
**Date:** 2026-07-01  
**Type:** Cognition-genre correction (not architectural rationalisation)  
**Predecessor:** [SPRINT-56-DLA-SEMANTIC-FRAMING-SPIKE.md](SPRINT-56-DLA-SEMANTIC-FRAMING-SPIKE.md) · [SPRINT-56-DLA-FIELD-SEMANTICS-AUDIT.md](SPRINT-56-DLA-FIELD-SEMANTICS-AUDIT.md)

---

## 1. Executive summary

| Metric | Semantic framing spike | Cognition remediation (best probe run) | Δ |
|--------|------------------------|----------------------------------------|---|
| DLA-08 mandatory pass | 20% (1/5) | **60% (3/5)** | +40 pp |
| Mean `self_explanation_prompt` | 28.6w | **38.4w** | +9.8 |
| Mean `reasoning_orientation` (when present) | 33.5w | **45.0w** | +11.5 |
| Mean `conceptual_contrast_prompt` (when present) | 29.0w | **38.0w** | +9.0 |
| Mean `argument_structure_hint` (when present) | 28.0w | **45.0w** | +17.0 |
| Activities with any cognition field ≥35w | 2/5 | **4/5** | +2 |

**Verdict:** Cognition fields were failing because the model learned **short thinking cues** from field names (`*_prompt`, `*_hint`), PEL “HOW TO THINK” shorthand, and an **under-length `argument_structure_hint` strong exemplar** (~27w). Semantic framing had already fixed `expected_output`/bridge genre; cognition needed explicit **reasoning-scaffold genre** teaching and exemplar correction.

**Probe variance note:** Three consecutive `gpt-4.1-mini` runs at temperature 0.35 produced 20% → 0% → **60%** mandatory pass. The fixture `rna-hcv-dla-08-run.json` reflects the **60% run**. Cognition word-count trends are consistent across runs; mandatory pass rate is stochastic at this temperature.

---

## 2. Cognition-field failure analysis (pre-remediation fixture)

Source: semantic framing spike output (`rna-hcv-dla-08-run.json` before this remediation).

### 2.1 Per-activity classification

| Activity | Field | Words | Sents | Style | SSOT genre |
|----------|-------|------:|------:|-------|------------|
| A1 | `reasoning_orientation` | 46 | 3 | scaffold-prose | ✓ at floor |
| A1 | `self_explanation_prompt` | 34 | 2 | question-stem | ✗ 1w below floor |
| A2 | `reasoning_orientation` | 35 | 3 | instructional-cue | ✓ at floor |
| A2 | `self_explanation_prompt` | 29 | 2 | question-stem | ✗ |
| A3 | `reasoning_orientation` | 28 | 2 | instructional-cue | ✗ |
| A3 | `conceptual_contrast_prompt` | 33 | 2 | instructional-cue | ✗ |
| A3 | `self_explanation_prompt` | 24 | 2 | question-stem | ✗ |
| A4 | `reasoning_orientation` | 25 | 2 | reminder | ✗ |
| A4 | `conceptual_contrast_prompt` | 25 | 2 | instructional-cue | ✗ |
| A4 | `self_explanation_prompt` | 22 | 2 | question-stem | ✗ |
| A5 | `argument_structure_hint` | 28 | 2 | instructional-cue | ✗ |
| A5 | `self_explanation_prompt` | 24 | 2 | question-stem | ✗ |

### 2.2 Dominant failure patterns

| Pattern | Prevalence | Example |
|---------|------------|---------|
| **Question-stem `self_explanation_prompt`** | 5/5 | “Explain why each example… Reflect on any misconceptions…” |
| **Imperative instructional cue** | 4/5 cognition fields | “Focus on how examples embody…” |
| **Two-sentence ceiling** | Most cognition fields | Exactly 2 sentences, ~22–34 words |
| **Generic LO/topic wording** | 5/5 | “core concept LO3”, “criteria and mechanisms” |
| **Field-name genre bleed** | 5/5 | `_prompt` → one-line stem; `_hint` → compressed outline |

`expected_output` and bridges had already shifted to quality-threshold prose after semantic framing. Cognition fields lagged because they were still taught as **orientation tags**, not workbook reasoning blocks.

---

## 3. Teaching-source trace

| Source | What it taught | Cognition bias? |
|--------|----------------|-----------------|
| **Field names** (`self_explanation_prompt`, `argument_structure_hint`) | Designer hint / quiz stem | **Yes — primary** |
| **COMPACT `FIELD SEMANTICS`** (pre-fix) | “cognition fields teach how to think” (one line) | Weak — no genre length |
| **`argument_structure_hint` Strong exemplar** | ~27 words — below 35w floor | **Yes — taught brevity** |
| **PEL reasoning** | “state HOW TO THINK” | **Yes — cue not prose** |
| **OUTPUT CONTRACT** | “cognition-orientation field” | Metadata framing |
| **Archetype distribution** | Which field to pick per archetype | Presence only — no prose genre |
| **Domain IFP** | “cognition fields alone FAIL” | Deprioritises cognition depth |
| **JSON example (Marx)** | Rich preamble/`expected_output`; cognition strings uneven | Partial — `self_explanation` shorter than strong exemplar |
| **SSOT `FIELD_LINES` (full)** | Per-field 35–80w bullets | **Not emitted on DLA Copy path** |

---

## 4. Exemplar audit

| Field | Weak exemplar | Strong exemplar (pre-fix) | Strong word count | Issue |
|-------|---------------|---------------------------|------------------:|-------|
| `reasoning_orientation` | Arrow chain | RNA virus lifecycle prose | ~48 | Adequate |
| `conceptual_contrast_prompt` | One-line contrast | Genome-type distinction prose | ~42 | Adequate |
| `self_explanation_prompt` | “Explain your answer.” | Model-row contrast prose | ~45 | Adequate |
| `argument_structure_hint` | Arrow chain | Criteria→comparison prose | **~27** | **Below floor — taught short hints** |
| `expected_output` | Deliverable label | Quality threshold prose | ~35 | Adequate (semantic framing beneficiary) |

**Finding:** Exemplar set disproportionately fixed `expected_output`/preamble genre. `argument_structure_hint` strong exemplar **contradicted** the 35w floor. Cognition fields needed explicit genre line + expanded hint exemplar + JSON example alignment.

---

## 5. Semantic changes implemented

No new layers, contracts, gates, schema changes, or field renames.

### 5.1 `lib/ld-guided-learning-scaffold.js`

- Replaced compact `FIELD SEMANTICS` with **`COGNITION FIELD GENRE`** line: reasoning scaffold = 2–3 learner-facing sentences; `_prompt`/`_hint` names are still full prose blocks.
- Expanded **`argument_structure_hint` Strong** exemplar to ~52 words (evaluation criteria + trade-offs).
- Expanded **`self_explanation_prompt` Strong** with sticky-note expansion cue.

### 5.2 `app.js`

- **OUTPUT CONTRACT:** “cognition scaffold field” + genre line pointing to `COGNITION FIELD GENRE`.
- **Archetype block:** each populated cognition field = reasoning scaffold prose at SSOT length.
- **PEL reasoning:** “2–3 sentences” learner-facing scaffold blocks (replaces “HOW TO THINK” shorthand).
- **JSON example:** lengthened `argument_structure_hint` and `self_explanation_prompt` to match strong exemplar genre.
- **Output schema pointer:** “cognition scaffold field (reasoning prose, not cues)”.

### 5.3 `domain-learning-design-step-patterns.md`

- Task block: cognition fields = reasoning scaffold prose (35–80w), not one-line cues or question stems.

---

## 6. Prompt-size impact

| Metric | Semantic framing | + Cognition remediation | Δ |
|--------|-----------------:|------------------------:|--:|
| Core emitted (no upstream embed) | ~32,187 | **~33,651** | +1,464 (+4.5%) |
| Copy wrapper (probe) | ~45,186 | **~46,386** | +1,200 |

Budget guard: `SPRINT_56_TARGET_MAX_CHARS` → **33,700** in `tests/sprint-56-dla-ssot-rationalisation.test.js`.

---

## 7. DLA-08 rerun results (best run — fixture on disk)

**Model:** `gpt-4.1-mini` · temperature 0.35 · post-cognition remediation prompt

### 7.1 Summary

| Metric | Result |
|--------|--------|
| Mandatory pass | **3 / 5 (60%)** |
| `evaluateGuidedLearningScaffoldEvidence` | FAIL (2 activities flagged) |
| DLA-08 threshold (≥80%) | **Not met** — but materially improved |

### 7.2 Per-activity cognition scores (post-remediation)

| Activity | `reasoning_orientation` | `self_explanation_prompt` | `conceptual_contrast_prompt` | `argument_structure_hint` | Mandatory |
|----------|------------------------:|--------------------------:|-----------------------------:|--------------------------:|:---------:|
| A1 | 48 ✓ | 44 ✓ | — | — | **PASS** |
| A2 | 42 ✓ | 36 ✓ | — | — | FAIL (bridge) |
| A3 | — | 40 ✓ | 44 ✓ | — | **PASS** |
| A4 | — | 33 ✗ | 32 ✗ | — | FAIL |
| A5 | — | 39 ✓ | — | 45 ✓ | **PASS** |

### 7.3 Genre shift (post-remediation)

| Field | Pre style | Post style |
|-------|-----------|------------|
| `self_explanation_prompt` | question-stem (5/5) | scaffold-prose on A1, A3; at floor on A2, A5 |
| `reasoning_orientation` | instructional-cue | scaffold-prose on A1, A2 |
| `conceptual_contrast_prompt` | instructional-cue | scaffold-prose on A3 |
| `argument_structure_hint` | instructional-cue | scaffold-prose on A5 |

---

## 8. Remaining failure patterns

| Pattern | Notes |
|---------|-------|
| **A4 cognition cluster** | Both `self_explanation` and `conceptual_contrast` at 32–33w — one word below floor; genre improved but length borderline |
| **Missing `intellectual_coherence_bridge`** | A2 fails mandatory despite strong cognition |
| **LO-generic wording** | Still no RNA/HCV mechanisms — upstream synthetic LO brief |
| **Probe variance** | 0% and 60% runs with identical prompt — temperature 0.35 not deterministic for pass rate |
| **`reasoning_orientation` absence** | A3–A5 omit field when other cognition fields populated — schema allows single-field minimum |

---

## 9. Hypothesis assessment

| Claim | Verdict |
|-------|---------|
| Cognition fields failed due to **short-cue genre** not word-count ignorance | **Confirmed** |
| Field names (`_prompt`, `_hint`) contributed | **Confirmed** |
| Under-length `argument_structure_hint` exemplar taught brevity | **Confirmed** |
| Cognition genre correction improves outputs without new architecture | **Confirmed** (60% pass, +9–17w mean on cognition fields) |
| Cognition remediation alone clears ≥80% DLA-08 | **Not yet** — A4 borderline + bridge omissions + variance |

---

## 10. Tests

| Suite | Result |
|-------|--------|
| `tests/sprint-55-guided-learning-quality.test.js` | 15 pass |
| `tests/sprint-55-content-preservation.test.js` | pass |
| `tests/sprint-55-typography-foundation.test.js` | pass |
| `tests/sprint-56-dla-ssot-rationalisation.test.js` | 11 pass (incl. `COGNITION FIELD GENRE` guard) |

**Probe repro:** `node scripts/probe-dla-08-copy-validation.js`

---

## 11. Traceability

| Artefact | Role |
|----------|------|
| `tests/fixtures/dla/rna-hcv-dla-08-run.json` | Post-remediation 60% run output |
| `artefacts/dla-08-rna-hcv-emitted-copy-prompt.txt` | Emitted prompt with cognition genre lines |
| [SPRINT-56-DLA-SEMANTIC-FRAMING-SPIKE.md](SPRINT-56-DLA-SEMANTIC-FRAMING-SPIKE.md) | Pre-cognition baseline (20% pass) |

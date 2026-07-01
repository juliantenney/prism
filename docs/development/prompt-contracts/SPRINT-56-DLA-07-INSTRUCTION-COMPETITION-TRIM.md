# Sprint 56 DLA-07 — Instruction Competition Trim

**Status:** Complete  
**Date:** 2026-07-01  
**Predecessor:** DLA-05 SSOT rationalisation · DLA-08 validation (failed ≥80% threshold)  
**Goal:** Improve SSOT salience; remove competing brevity signals without new prompt layers or schema changes.

---

## 1. Problem

DLA-08 (post-DLA-05) showed **0/5 activities** meeting mandatory SSOT scaffold floors despite:

- Single SSOT authority and ~32k emitted core
- Marginal preamble improvement (mean 19 → 47 words)

Root cause: **instruction competition** — EQF “reduce scaffolding”, PEL “one reasoning cue set”, late SSOT placement, and JSON-shape brevity norms still outweighed PRE-EMIT word floors.

---

## 2. Changes (no new layers)

### 2.1 SSOT augmentation order (`app.js`)

- Added `enrichDlaLearnerPageAugmentContext()` — sets `dlaLearnerPageScaffoldSsot` / `eqfDlaLearnerPageScaffoldQualify` for learner-page DLA.
- `applyLdGuidedLearningScaffoldContractToDraft` now runs **first** in `applyWorkflowStepRuntimePromptAugmentations` (before cognition, EQF, PEL, obligation blocks).
- Removed duplicate DLA SSOT call from `applySelfDirectedLearnerPageStepScaffoldsToDraft` (Design Page path unchanged via compose contract).

**Measured position (RNA/HCV core-only):** SSOT marker at char **11,109**; EQF at **17,168**.

### 2.2 EQF qualification (`lib/educational-quality-framework-prompt.js`)

When `dlaLearnerPageScaffoldSsot` / `eqfDlaLearnerPageScaffoldQualify` on DLA step:

| Removed / replaced | Replacement |
|--------------------|-------------|
| `reduce scaffolding across the journey` | Fade support in `learner_task` / materials — **not** SSOT scaffold fields |
| `include brief confidence…` (metacognition) | Short checks in optional fields — **without shortening mandatory scaffold prose** |
| `reduced scaffolding, increased learner decision making` (DLA manifestation) | Progressive independence in tasks/materials; scaffold fields follow SSOT floors |
| — | Added pointer: `DLA learner-page scaffold fields: follow LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT word floors and PRE-EMIT gate.` |

### 2.3 PEL reasoning trim (`app.js`)

On learner-page DLA path, `buildPelReasoningContractPromptBlock({ dlaLearnerPage: true })`:

| Removed | Replacement |
|---------|-------------|
| `one reasoning cue set per activity aligned to depth_floor L3` | `Each populated cognition scaffold field: SSOT word floors (35–80) — not one-line hints or single cues` |

### 2.4 JSON-shape qualifier (`app.js`)

Merged into `augmentSelfDirectedDlaDraftOutputSection` pointer:

> `learner_task may stay concise; do not shorten scaffold prose for JSON brevity`

Does not remove JSON-only output requirements.

---

## 3. Prompt metrics

| Metric | DLA-05 | DLA-07 | Δ |
|--------|-------:|-------:|--:|
| Emitted core (RNA/HCV, no upstream embed) | 31,551 | **31,769** | +218 |
| Sprint 56 ≤32k budget | ✓ | ✓ | — |
| SSOT marker count | 1 | 1 | — |
| Copy wrapper (with upstream episode_plans) | 44,419 | 44,637 | +218 |

DLA-07 adds ~218 chars of qualification pointers; duplicate SSOT block removal prevents budget regression.

---

## 4. DLA-05 preservation checklist

| Guard | Status |
|-------|--------|
| Emitted core ≤32,000 (no upstream embed) | **PASS** (31,769) |
| Single `LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT (auto-applied)` | **PASS** |
| No 25–80 / duplicate 30–70 transfer ranges | **PASS** |
| Deprecated scaffold blocks absent | **PASS** |
| Obligation population semantics unchanged | **PASS** |

---

## 5. Tests

```bash
node --test tests/sprint-56-dla-ssot-rationalisation.test.js
node --test tests/sprint-55-guided-learning-quality.test.js
node --test tests/sprint-55-content-preservation.test.js
```

New DLA-07 guards: SSOT before EQF/PEL, qualified EQF, qualified PEL, JSON brevity qualifier.

---

## 6. Trimmed competing instructions (register)

| Source | Competing fragment | Action |
|--------|-------------------|--------|
| EQF CORE | `reduce scaffolding across the journey` | Qualified — excludes SSOT fields |
| EQF CORE | `brief confidence` metacognition | Qualified — optional fields only |
| EQF DLA manifestation | `reduced scaffolding, increased learner decision making` | Replaced with SSOT floor pointer |
| PEL reasoning | `one reasoning cue set per activity` | Replaced with SSOT word-floor line |
| Runtime augment | (none) | Added JSON brevity carve-out for scaffold fields |
| Augmentation order | SSOT after EQF/PEL | SSOT moved before EQF/PEL |

---

## 7. Traceability

| Backlog | Item |
|---------|------|
| DLA-07 | Instruction competition trim — **complete** |
| DLA-08 | Re-run required — see § DLA-07 rerun below |

---

## 9. DLA-07 rerun (instruction competition trim)

**Date:** 2026-07-01  
**Changes:** [SPRINT-56-DLA-07-INSTRUCTION-COMPETITION-TRIM.md](SPRINT-56-DLA-07-INSTRUCTION-COMPETITION-TRIM.md)  
**Model:** `gpt-4.1-mini` (same probe as §1)  
**Artefact:** `tests/fixtures/dla/rna-hcv-dla-08-run.json` (overwritten)

### Prompt version

| Metric | DLA-05 | DLA-07 |
|--------|-------:|-------:|
| Emitted core (no upstream embed) | 31,551 | **31,769** |
| Copy core (with upstream embed) | 37,745 | **37,963** |
| SSOT position | After EQF/PEL | **Before EQF** (char ~11,109) |

### Scoring table — DLA-07 rerun

| Activity | Preamble | Cognition field(s) | Cognition wc | Expected output | Bridge | Mandatory pass |
|----------|----------|-------------------|-------------:|----------------:|-------:|:--------------:|
| A1 | 48 ❌ | `self_explanation_prompt` | 36 ❌ | 24 ❌ | — | ❌ |
| A2 | 47 ❌ | `self_explanation_prompt` | 23 ❌ | 19 ❌ | 26 ❌ | ❌ |
| A3 | 57 ✓ | `reasoning_orientation` | **37 ✓** | 23 ❌ | 23 ❌ | ❌ |
| A4 | 53 ✓ | `reasoning_orientation` | 25 ❌ | 18 ❌ | 22 ❌ | ❌ |
| A5 | 56 ✓ | `argument_structure_hint` | 31 ❌ | 26 ❌ | 23 ❌ | ❌ |

### Summary vs prior runs

| Metric | Sprint 55 | DLA-08 (DLA-05) | DLA-08 (DLA-07) |
|--------|----------:|----------------:|----------------:|
| Mandatory pass rate | 0% | 0% | **0%** |
| Mean preamble words | 19.4 | 46.8 | **52.2** |
| Preambles ≥ 50 words | 0/5 | 2/5 | **3/5** |
| Cognition fields ≥ 35 words (any field) | 0/5 | 0/5 | **1/5** (A3 `reasoning_orientation`) |
| Bridges populated | 0/5 | 4/5 | 4/5 |
| Bridges ≥ 30 words | 0/5 | 0/5 | 0/5 |

### DLA-08 ≥80% threshold after DLA-07

**NOT MET** — 0/5 activities (0%) meet all mandatory SSOT floors.

### Partial gains

- Preamble length trend continues upward (3/5 now at floor).
- First cognition field at floor (`reasoning_orientation` 37w on A3).
- `self_explanation_prompt` on A1 reached 36w (1 word below floor).

### Remaining failure pattern

1. **`expected_output` still label-like** (18–26 words) — obligation-population AS-05 “observable evidence” competes with SSOT quality-target prose.
2. **Cognition fields** — model still emits stems; PEL/EQF trim insufficient without domain-pack IFP presence-only gates yielding to word floors.
3. **`intellectual_coherence_bridge`** — populated but consistently 22–26 words (below 30).
4. **Generic LO templating** — “LO1/LO2” beat-mirror prose instead of RNA/HCV topic specificity.
5. **Upstream episode-plan embed** — Copy path with full obligation stack still dominates attention after SSOT block.

### Recommended next action (post-DLA-07)

- **DLA-09 / domain-pack salience:** IFP presence-only gates vs PRE-EMIT; opening obligation-population framing without new layers.
- **Optional:** Re-run with `gpt-4.1` (non-mini) to isolate model-capacity effects.
- **Do not** add scaffold prompt layers — DLA-07 partial gains confirm order/qualification helps but is insufficient alone.

### Updated overall verdict

| Criterion | DLA-05 run | DLA-07 rerun |
|-----------|------------|--------------|
| Prompt architecture | PASS | PASS |
| Copy-path ≥80% scaffold floors | **FAIL** | **FAIL** (marginal improvement only) |

# Sprint 56 — DLA Capture-Side Scaffold Repair Implementation

**Status:** Complete  
**Date:** 2026-07-01  
**Design:** [SPRINT-56-DLA-CAPTURE-SIDE-REPAIR-DESIGN.md](SPRINT-56-DLA-CAPTURE-SIDE-REPAIR-DESIGN.md)

---

## 1. Implementation summary

Enhanced the existing Sprint 55 capture repair path (no new prompt layer) to align with DLA-08 mandatory scoring and close production gaps:

| Enhancement | Detail |
|-------------|--------|
| Mandatory issue detection | `collectRowScaffoldIssues` — missing/sub-floor bridge, cognition, expected_output, preamble |
| Bridge repair | `expandIntellectualCoherenceBridge` — synthesize from prior activity + learner_task + materials |
| expected_output | Expand-in-place; label-to-prose conversion preserving deliverable nouns |
| Source hierarchy | General `learner_task` → `required_materials` → archetype → LO → workflow goal |
| RNA/HCV removal | Hardcoded topic templates replaced with `expandInPlace` + sourced clauses |
| Upstream context | `app.js` passes `learning_outcomes` + `episode_plans` into repair |
| Probe parity | `--fixtures-only` reports raw vs post-repair mandatory pass |

---

## 2. Files changed

| File | Change |
|------|--------|
| `lib/ld-guided-learning-scaffold.js` | Mandatory detection, bridge synthesizer, general expanders, context builders |
| `app.js` | Pass `repairOptions` (goal, LO, episode plans) to `repairGuidedLearningScaffoldOnDlaCapture` |
| `scripts/probe-dla-08-copy-validation.js` | Raw + post-repair scoring; `--fixtures-only` mode |
| `tests/sprint-56-dla-capture-repair.test.js` | **New** — 10 repair tests |
| `tests/sprint-55-guided-learning-quality.test.js` | Evidence-based assertions; scheduling bridge positive test |
| `docs/.../artefacts/dla-08-fixtures-repair-parity.json` | Fixture parity summary |

**Not changed:** schema, field names, SSOT floors, prompt augmentation, `required_materials` population.

---

## 3. Raw vs post-repair compliance

Probe: `node scripts/probe-dla-08-copy-validation.js --fixtures-only`

| Fixture | Raw mandatory | Post-repair mandatory | `meetsGuidedLearningScaffoldQuality` |
|---------|--------------:|----------------------:|:------------------------------------:|
| `rna-hcv-dla-08-cognition-best-run.json` | 60% | **100%** | true |
| `rna-hcv-dla-08-run.json` | 40% | **100%** | true |
| `rna-hcv-dla-08-stab-run-1.json` | 0% | **100%** | true |
| `rna-hcv-terse-scaffold-dla.json` | 0% | **100%** | true |

Live Copy probe (`--fixtures-only` off) reports both `current` (raw) and `currentPostRepair` when API key present.

---

## 4. Tests added / updated

### New (`tests/sprint-56-dla-capture-repair.test.js`)

- Missing bridge synthesis on A2+
- Sub-floor bridge expansion
- Borderline cognition expansion via repair
- expected_output label-to-prose preserving deliverable detail
- No-op when already compliant
- `required_materials` immutability
- Schema stability (only mandatory scaffold keys may be added)
- Generic non-RNA brief repair
- DLA-08 fixtures ≥80% post-repair
- Scheduling-only bridge replacement

### Updated (`tests/sprint-55-guided-learning-quality.test.js`)

- Capture tests assert `meetsGuidedLearningScaffoldQuality` instead of exact string removal (expand-in-place preserves fragments)
- Scheduling bridge test confirms repair success (was unrepairable-negative)

### Suite results

| Suite | Result |
|-------|--------|
| `sprint-56-dla-capture-repair.test.js` | 10 pass |
| `sprint-55-guided-learning-quality.test.js` | pass |
| `sprint-55-content-preservation.test.js` | pass |
| `sprint-56-dla-ssot-rationalisation.test.js` | 11 pass |

---

## 5. Remaining risks

| Risk | Mitigation |
|------|------------|
| Expand-in-place may retain terse substrings | Evaluator + mandatory floors gate capture; fragments padded to compliance |
| Generic synthesis prose on sparse rows | Source hierarchy reuses title/task/material tokens |
| Mandatory bridge key added on A2+ | Allowed — fills schema field, not new schema |
| Raw LLM still fails DLA-08 | Expected — production path runs repair on capture |
| Double repair idempotency | No-op when compliant; second capture should not mutate |

---

## 6. Sprint 56 closure recommendation

**Recommend Sprint 56 closure** for DLA learner-page scaffold compliance:

- Prompt-side work complete (≤32k, stabilisation done)
- Capture repair achieves **100% mandatory pass** on all DLA-08 fixtures post-repair
- Evaluator aligned with DLA-08 mandatory rules
- Tests cover bridge, cognition, expected_output, immutability, non-RNA briefs
- Probe parity mode prevents raw-vs-production metric confusion

**Optional follow-up (post-Sprint 56):** live Copy probe with `--fixtures-only` off to confirm raw generation variance; Design Page qualitative review of repaired prose.

---

## 7. Repro

```bash
node --test tests/sprint-56-dla-capture-repair.test.js
node --test tests/sprint-55-guided-learning-quality.test.js
node scripts/probe-dla-08-copy-validation.js --fixtures-only
```

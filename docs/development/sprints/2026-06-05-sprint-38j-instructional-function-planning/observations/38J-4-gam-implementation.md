# Slice 38J-4 — GAM realisation implementation

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Pack §6 implementation — preservation sprint  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38J-4  
**Predecessor:** [38J-3 DLA implementation](38J-3-dla-implementation.md)  
**Design authority:** [38J-2 function-plan design](38J-2-function-plan-prompt-design.md) §11.4 · [38H-2 GAM consolidation](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-2-gam-consolidation-discipline.md) · [38I-4 A4 benchmark](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

---

## Section 1 — Baseline review

**Surface inspected:** `domains/learning-design/domain-learning-design-step-patterns.md` §6 `promptTemplate` + `defaultPromptNotes` (pre-38J-4 baseline captured in `artefacts/gam-prompt-baseline.txt`).

### Ordering behaviour

| Aspect | Pre-38J-4 state |
|--------|-----------------|
| Activity sequence | Preserved from DLA |
| Materials within activity | Output organisation says repeat in listed order — **implicit**, not tied to instructional functions |
| Function-derived order | **Not enforced** — no rule that criteria → worked judgement → guided → independent → verification must survive realisation |
| Risk | Model could merge or reorder Materials for brevity despite DLA list order |

### Consolidation behaviour

| Aspect | Pre-38J-4 state |
|--------|-----------------|
| `consolidation_summary` | GAM-WB-06/06b — ≥80 words; scaffold-only when learner-production required (38H-2) |
| Capstone | GAM-WB-07/MIX-06 — synthesis scaffold, not table dump |
| Gap | No explicit rule forbidding consolidation **absorbing** teaching assigned to other DLA rows (function collapse) |
| Evaluate | Consolidation treated as closure genre — could become sole Evaluate body if DLA over-concentrated there |

### Expansion behaviour

| Aspect | Pre-38J-4 state |
|--------|-----------------|
| Material-type guidance | Strong per-type bodies (worked_example ≥3 steps, scenario ≥2 cases, etc.) |
| Component rhetoric | Line 20–21: realise richer episodes without literal headings |
| Gap | Expansion rules **type-centric**, not **function-sequence-centric** — no mapping from DLA function names in purpose/specification to required body shapes |
| Evaluate depth | No A4-aligned minimum depths for perspectives, criteria, weak/strong judgement |

### Spoiler controls

| Aspect | Pre-38J-4 state |
|--------|-----------------|
| GAM-WB-06b / F7 / AP-05 | Strong anti-spoiler on `consolidation_summary` when learner-production required |
| Gap | No explicit honouring of DLA specification cues (`scaffold-only`, `not for copying`, `weak vs strong`); `sample_output` copy risk when independent judgement planned |

### Worked-example handling

| Aspect | Pre-38J-4 state |
|--------|-----------------|
| GAM-WB-02 | Full expert steps + reasoning when DLA lists `worked_example` |
| MIX-04 / F4 | Template-only FAIL |
| Gap | No worked **judgement** contrast obligation at GAM layer when DLA specifies Evaluate worked judgement; no anti-collapse if DLA lists both `worked_example` and `modelling_note` |

### Baseline conclusion

GAM was **capable of rich expansion** when DLA specified rich materials ([38J-1 §2.5](38J-1-baseline-inspection.md)), but lacked **preservation discipline** to stop function collapse, order inversion, and Evaluate thinning. With 38J-3 IFP now planning function sequences in DLA, §6 needed **realisation guards** — not a second planning engine.

---

## Section 2 — Changes implemented

**File:** `domains/learning-design/domain-learning-design-step-patterns.md` — **§6 only** (§5 untouched).

| Location | Change |
|----------|--------|
| `promptTemplate` — before Material-type realisation guidance | **GAM-PRES-00..07** instructional function preservation block |
| `promptTemplate` — after GAM-WB-21 | **GAM-WB-22..25** workbook preservation rows |
| `promptTemplate` — GAM-WB-38E-9 FAIL list | **(F8)** function-collapse fail |
| `promptTemplate` — anti-patterns footer | F1–F7 → **F1–F8** |
| `defaultPromptNotes` | F1–F8; **38J-4** GAM-PRES reinforcement |

**Supporting artefacts:** `artefacts/gam-pres-pack-block.txt`, `artefacts/gam-wb-pres-rows.txt`, `artefacts/patch-gam-pres.js`

### Minimality rationale (per change)

| Change | Why required | Why GAM not DLA |
|--------|--------------|-----------------|
| **GAM-PRES-00** | States realisation-only role after 38J-3 planning | DLA already plans; GAM must not replan |
| **GAM-PRES-01** | Collapse observed at **expansion** (merge/reorder Materials) | DLA specifies order in `required_materials`; GAM emits bodies |
| **GAM-PRES-02** | Function collapse is a **realisation** failure mode (prompt_set replacing sequence) | DLA cannot enforce post-hoc merge behaviour |
| **GAM-PRES-03** | Maps DLA types → learner-facing function bodies without archetype logic | GAM authors Content; type→body rules belong here |
| **GAM-PRES-04** | Anti-shell must hold at emission — thin GAM output defeats IFP | AS-FAIL in DLA is planning; AS-GAM-FAIL is realisation |
| **GAM-PRES-05** | 38H-2 extended to honour DLA scaffold specs in bodies | GAM writes material bodies that could spoil |
| **GAM-PRES-06** | Evaluate A4 depths are **content realisation** targets | DLA specs intent; GAM must expand to A4-class bodies |
| **GAM-PRES-07** | Depth floors prevent compression during expansion | Same |
| **GAM-WB-22..25** | Regression-testable workbook contract anchors | Mirrors DLA-WB-22..25 at realisation layer |
| **F8** | Explicit FAIL for merge/collapse — enforceable in prompt | N/A |

**Not added (deliberately omitted):**

- No IFP / LO-ARC / `primary_archetype` in §6  
- No new JSON fields or persistent IFP artefact  
- No §5 edits  
- No `app.js` / renderer / ACM changes  
- No full §6 rewrite — GAM-WB-01..21 and 38E/38F/38G/38H rows preserved  

---

## Section 3 — Function-order preservation

**GAM-PRES-01** + **GAM-WB-22:**

- Emit `Material:` blocks in **exact DLA `required_materials` array order**.
- When purpose/specification names instructional functions, preserve **teaching → practice** sequence.
- Explicit anti-pattern: `criteria exposition → worked judgement → guided judgement → independent judgement → verification` must **not** become `prompt_set → reflection_prompt` through consolidation or merging.
- Segmented `learner_task` teaching blocks must appear in **earlier** Material bodies; performance blocks in **later** Materials.

**Why in GAM:** DLA (post-38J-3) plans and lists ordered rows; only GAM can collapse or reorder during body authoring.

---

## Section 4 — Anti-shell preservation

**GAM-PRES-04** + **GAM-WB-25:**

- When DLA lists ≥2 teaching-depth materials, realise **all** with full bodies.
- **AS-GAM-FAIL-01:** DLA lists `worked_example`/`modelling_note` but GAM emits template-only or prompt-only.
- **AS-GAM-FAIL-02:** DLA lists ≥3 distinct types but GAM merges into ≤2 Materials.
- **AS-GAM-FAIL-03:** Evaluate-shaped DLA specs realised as `consolidation_summary` + `prompt_set` only.

Extends 38J-3 IFP-05 without duplicating planning — GAM guards against `episode → task + resources + output` collapse at realisation.

---

## Section 5 — Anti-spoiler preservation

**GAM-PRES-05** (extends **GAM-WB-06b / 38H-2**):

- Honour DLA specification phrases: `scaffold-only`, `not for copying`, `weak vs strong exemplar`.
- `worked_example` / `modelling_note` teach reasoning quality — bodies must **not** match `expected_output` deliverable.
- `sample_output` not a copy target when independent practice/judgement planned.
- No pre-ranked strategies or pre-filled judgement cells when learner ranking expected.
- `consolidation_summary` scaffold-only when learner-production required.

**38J-3 handoff closed:** DLA IFP-06 cites 38H-2 discipline; §6 now explicitly realises scaffold-not-answer per GAM-WB-06b when DLA requires learner-production.

---

## Section 6 — Evaluate preservation

**GAM-PRES-06** + **GAM-WB-24** (38I-4 A4 benchmark):

| Function | GAM realisation minimum |
|----------|-------------------------|
| Perspectives | scenario/text — ≥2 competing viewpoints (≥40 words each when scenario) |
| Criteria exposition | rubric/modelling_note/text — ≥3 operational dimensions |
| Worked judgement | worked_example OR modelling_note — weak vs strong contrast; strong ≠ expected_output |
| Guided judgement | partial table + justification prompts; learner cells empty |
| Independent judgement | template/task_cards memo **scaffold** — not completed memo |
| Verification | checklist ≥4 criteria-linked checkpoints |
| Transfer | transfer_prompt ≥80 words learner-own-context |
| Reflection/closure | consolidation_summary scaffold-only — **never** sole Evaluate vehicle |

**EV-GAM-FAIL-01..06** mirror EV-SHELL at realisation layer.

---

## Section 7 — Verification

| Check | Result |
|-------|--------|
| DLA remains primary decision-maker | ✅ GAM-PRES-00; no archetype/IFP in §6 |
| GAM remains realisation layer | ✅ “expand bodies, do not replan” |
| No archetype logic duplicated | ✅ `doesNotMatch primary_archetype` in tests |
| No schema changes | ✅ JSON factory shape unchanged |
| No ACM changes | ✅ |
| No renderer changes | ✅ |
| No new workflow step | ✅ |
| §5 unchanged | ✅ IFP + DLA-WB-22..25 preserved |
| §6 regression guards preserved | ✅ GAM-WB-01..21, F1–F7 rules extended not removed |
| Tests | `node --test tests/workbook-contract-prompt-surface.test.js` — **23/23 pass** |

**New tests:** five 38J-4 assertions + §5 unchanged check.

---

## Section 8 — Readiness for 38J-5

| Ready | Item |
|-------|------|
| ✅ | §5 IFP plans function sequences and material specs |
| ✅ | §6 GAM-PRES preserves order, depth, anti-shell, anti-spoiler, Evaluate A4 |
| ✅ | F8 explicit function-collapse FAIL |
| ⏳ | `EV-38J-AFTER` inflation proof run — **38J-5** |
| ⏳ | Comparator vs `EV-38G-AFTER` + 38I-4 targets |

**Recommended 38J-5 entry:** Run Inflation harness with `EV-38H-AFTER-knowledge-model.json`; capture `EV-38J-AFTER-dla-learning-activities.json`, `EV-38J-AFTER-gam.txt`, page artefact; trace A4 against EV-GAM-FAIL and A4 benchmark; verify anti-shell passes at DLA (IFP) and GAM (GAM-PRES) layers.

---

## References

- [38J-3 DLA implementation](38J-3-dla-implementation.md)
- [38J-2 function-plan design](38J-2-function-plan-prompt-design.md)
- [38J-1 baseline](38J-1-baseline-inspection.md)
- Pack §6: `domains/learning-design/domain-learning-design-step-patterns.md`
- Tests: `tests/workbook-contract-prompt-surface.test.js`

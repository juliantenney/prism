# Slice 30-2b charter — GAM facilitator leakage & anti-redundancy

**Status:** **Complete** (2026-06-01)  
**Type:** Generation-layer stabilisation (not a new PEC)  
**Date:** 2026-06-01  
**Decision:** [R30-011](review-log.md) — prompt hardening + narrowly gated GAM sanitisation  
**Gap:** [GAP-30-10](enrichment-evidence-matrix.md) — **closed** (GAM materials)  
**Prerequisites:** 30-1c, 30-2 core, 30-2r — see [CURRENT-STATE.md](CURRENT-STATE.md)

**Parent:** [`sprint-30-charter.md`](sprint-30-charter.md) Phase 2 stabilisation  
**Related:** [`slice-30-2-charter.md`](slice-30-2-charter.md) (30-2 core + 30-2r)  
**Decisions:** [R30-007](review-log.md) · [R30-008](review-log.md) · [R30-009](review-log.md) · [R30-010](review-log.md)

---

## 1. Goal

Stabilise **Generate Activity Materials (GAM)** outputs for **self-directed learner pages** so that:

1. **Facilitator-facing voice does not leak** into learner-visible material bodies (headings, labels, or tutor choreography).
2. **Material prose does not redundantly repeat** what already appears in activity JSON (`learner_task`, `activity_preamble`, PEL orientation fields, PEL reasoning fields) now that **30-2r** renders those cues on the composed page.
3. **Worked micro-examples, evidence tables, templates, and generative-retrieval prompts** remain — GAM adds *support*, not a second copy of the task or reasoning contract.

This slice closes **GAP-30-10** as part of Phase 2 stabilisation after `reasoning_contract` + **30-2r**. Design Page row leakage is closed by sibling slice **30-2c** (R30-012). It does **not** change PEC topology, renderer behaviour, or DLA field generation policy beyond GAM-targeted prompt/sanitisation hooks.

---

## 2. Evidence from Factory validation

### Phase 1 (R30-007, R30-008)

| Finding | Source |
|---------|--------|
| Live learner pages improved on orientation vs procedural fixtures; **GAM facilitator voice** and DLA-step field compliance were the main generation gaps — not renderer | R30-007; `probe-p30-01-marx-live.md`, `probe-p30-02-rna-live.md` |
| **30-1c** added `buildSelfDirectedGamLearnerVoicePromptBlock()` forbidding `Facilitator use:`, teacher notes, timing choreography | R30-008 |
| Prompt guard alone was **insufficient** at Factory re-validation after full augmentation | Phase 2 probes below |

### Phase 2 post–30-2 (R30-009, live 2026-06-01)

| Probe | DLA / page reasoning | GAM facilitator leak | Redundancy / crowding |
|-------|----------------------|----------------------|------------------------|
| **P30-01 Marx** | ✅ Strong — 4/4 `reasoning_orientation`; A3 `argument_structure_hint` + `conceptual_contrast_prompt`; evaluator satisfied | ❌ **4+** `Facilitator use:` blocks in `marx-activity-materials.txt` despite 30-1c + `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` | ⚠️ Intro section repeats orientation themes; Marx A2 cause-effect table partly pre-filled (acceptable worked support); evaluator duplication clean on DLA |
| **P30-02 RNA** | ✅ Strong — 4/4 `evidence_use_prompt`; contrast on A1/A3; topic-specific HCV | ❌ **8×** `Facilitator use:` in `rna-activity-materials.txt` | ⚠️ Intro duplicates preamble themes; materials long but not full scaffold explosion |

**Probe rubric scores (unchanged until 30-2b):**

| Criterion | P30-01 | P30-02 |
|-----------|--------|--------|
| `no facilitator choreography` (30-1) | **No** | **No** |
| `facilitator regression` (30-2) | **No** | **No** |
| `redundancy` (30-2) | **Yes** (DLA fields distinct) | **Yes** (DLA fields distinct) |
| `gam worked support` | **Partial** | **Partial** |

**Automated heuristics** (`sprint-30-probe-runner.js`): `facilitatorUse: true` on both live GAM texts; `workedExample: true` (desired).

**Secondary risk (out of 30-2b core, document only):** Marx page rows include `facilitator_notes` copied at Design Page — learner-visible only if renderer surfaces notes; **30-2b does not change renderer** (confirm notes are not rendered before expanding scope).

### Why prompt-only is not enough

| Layer | Already forbids facilitator labels |
|-------|--------------------------------------|
| 30-1c | `buildSelfDirectedGamLearnerVoicePromptBlock()` |
| 30-2 GAM | `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` — “learner-facing only (see material voice guard)” |
| 30-2 PEC | `buildPelReasoningContractPromptBlock()` — no facilitator voice |
| Evaluators | `evaluatePelOrientationContractSatisfaction` / `evaluatePelReasoningContractSatisfaction` flag `facilitator_facing_language` in optional `gamText` — **warn/test only**, no post-generation fix |

Factory output proves **model non-compliance** under full prompt stack. **30-2b should implement prompt hardening *and* a narrow post-generation sanitisation pass** (Option **B** below).

**Additional prompt debt:** Legacy cognition GAM scaffold text still references appending content **“after Facilitator use”** (~`app.js` cognition materials block). That contradicts 30-1c and may **reinforce** the forbidden label. 30-2b prompt work must align or remove that instruction for self-directed learner-page GAM.

---

## 3. In scope

| Item | Detail |
|------|--------|
| **Primary step** | **GAM** on self-directed learner-page workflow runs only (same gate as `applySelfDirectedLearnerPageStepScaffoldsToDraft` + PEC GAM augmentation) |
| **Facilitator label removal** | Prevent or strip forbidden headings/labels (see [Field/material policy](#5-fieldmaterial-policy)) |
| **Anti-redundancy** | GAM materials must not repeat full `learner_task`, `activity_preamble`, or PEL orientation/reasoning field prose already on the activity row |
| **Prompt hardening** | Extend/strengthen existing blocks — `buildSelfDirectedGamLearnerVoicePromptBlock`, `buildSelfDirectedGamPelReasoningMaterialPromptBlock`; fix conflicting legacy GAM instructions |
| **Optional sanitisation** | Post-process GAM text/JSON output before persistence (see [§7](#7-optional-post-processing-strategy)) |
| **Evaluators** | Extend warn/test helpers to score GAM redundancy + post-sanitisation facilitator absence — **no runtime blocking** |
| **Tests** | Unit tests on prompt markers, sanitiser, evaluator; fixture GAM strings from live artefacts |
| **Docs** | R30-011 in `review-log.md`; update `enrichment-evidence-matrix.md` GAP-30-10 on completion |
| **Preserve** | 30-1c learner voice guard (extend, do not replace); worked micro-examples; evidence tables; static generative retrieval in materials |

**Activation:** Same gate as existing self-directed GAM scaffolds — `shouldApplySelfDirectedLearnerPageScaffoldBase` + non-facilitated brief. **Facilitated/workshop GAM is untouched.**

---

## 4. Out of scope

| Item | Defer to |
|------|----------|
| New PEC ids or `resolvePedagogicEnrichmentContractIds` changes | — |
| `metacognition_contract` | **30-3** |
| Workflow topology, new steps, `applyWorkflowDesignHeuristics` | — |
| Renderer / CSS / `renderActivityFramingForActivity` | **Closed** (30-2r) |
| DLA or Design Page generation policy changes (except shared prompt text cleanup if one string is reused) | 30-1 / 30-2 frozen |
| Cognition pack detection or new packs | Sprint 28 |
| Adaptive tutoring, runtime hint engines, learner modelling | — |
| Rewriting pedagogic content for quality/tone (only label strip + obvious duplicate removal) | — |
| Runtime blocking on failed GAM sanitisation | Evaluator warn only (consistent with R30-008, R30-009) |
| `facilitator_notes` on page activities / Design Page composition merge | Separate note unless renderer exposes them |
| Full GAM “scaffold explosion” redesign (card vs table vs prompt taxonomy) | Beyond minimal redundancy rules |

---

## 5. Field/material policy

### Ownership (unchanged)

| Content | Owner layer | GAM role after 30-2r |
|---------|-------------|----------------------|
| `activity_preamble`, `study_orientation`, `intellectual_frame`, `intellectual_coherence_bridge` | `orientation_contract` + page framing | **Do not repeat** in material prose |
| `reasoning_orientation`, `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt`, `disciplinary_lens` | `reasoning_contract` + page framing (30-2r) | **Do not repeat**; may realise as tables/spans/examples only |
| `self_explanation_prompt` | Sprint 28 / reasoning | **Do not repeat** verbatim; optional “cover answer” / retrieval in material OK |
| `learner_task` | DLA | **Do not repeat** full task text in materials |
| Worked micro-example, labelled table row, evidence column, template shell | GAM | **Keep** — topic-specific support |
| `facilitator_moves` | Self-directed DLA contract | **Omit** on self-directed activities (existing DLA rule) |

### Forbidden GAM surface patterns (facilitator leak)

Match and remove or never emit (case-insensitive, line-start headings preferred):

| Pattern class | Examples |
|---------------|----------|
| Facilitator headings | `Facilitator use:`, `Facilitator notes:`, `For the facilitator`, `Teacher notes:`, `Instructor guidance:`, `Tutor notes:` |
| Session choreography | `minutes 5–15`, `at minute 20`, `circulate during`, `report back to class` |
| Facilitated activity framing | `Discuss in groups`, `share with a partner` (unless brief explicitly facilitated — gate excludes) |

### Allowed GAM learner-facing patterns

| Pattern | Example |
|---------|---------|
| Resource purpose | `Purpose: Reference material for…` |
| Learner how-to | `Use this table to…`, `Before moving on…`, `If you get stuck…` |
| Static retrieval | `Before you re-read…`, `Without looking back…` |
| Worked support | One labelled sample row, one worked cause→effect pair |
| Evidence scaffolding | Quotable spans, `your evidence here` cells, comparison table shells |

### Material shape rules (anti-redundancy)

1. **One primary job per material block** — reference text *or* template *or* worked example; avoid three blocks restating the same instruction.
2. **No paste of upstream activity fields** — do not copy `learner_task` or PEL cue sentences into `Content:` bodies.
3. **Realise, don’t re-teach** — if DLA has `evidence_use_prompt`, GAM supplies **spans/rows**, not a second evidence paragraph with the same wording.
4. **Pre-filled template cells** — allowed only as **worked micro-example** (≤1–2 rows); remaining rows empty for learner work (Marx A2 pattern).
5. **Generative retrieval in GAM** — at most one short “before you check” line per activity in materials; must not duplicate `self_explanation_prompt` on the activity row.

---

## 6. Prompt hardening strategy

### Design choice: **Option B** (recommended)

| Option | Description | Verdict |
|--------|-------------|---------|
| **A. Prompt-only** | Strengthen `buildSelfDirectedGamLearnerVoicePromptBlock` / reasoning materials block only | **Insufficient** — proven by P30-01/P30-02 after 30-1c + 30-2 GAM prompts |
| **B. Prompt + narrow sanitisation** | Harden prompts **and** run deterministic post-pass on self-directed GAM output | **Recommended** — closes GAP-30-10 without rewriting pedagogy |

### Prompt changes (in scope)

| Target | Action |
|--------|--------|
| `buildSelfDirectedGamLearnerVoicePromptBlock` | Add **positive** examples (`How to use this resource:`); repeat **forbidden** list; state “never emit a Facilitator use section even if legacy templates suggest it” |
| `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | Explicit **anti-redundancy** bullets: fields listed in [§5](#5-fieldmaterial-policy); “activity JSON already shows How to think / Using evidence — materials add artefacts only” |
| Legacy cognition GAM scaffold | Remove/replace **“after Facilitator use”** instruction for self-directed learner-page path |
| `buildPelReasoningContractPromptBlock` on GAM | Optional one-line cross-reference: “GAM must not duplicate reasoning_orientation or evidence_use_prompt prose” (DLA block unchanged) |

**Order unchanged:** cognition → self-directed scaffolds (voice + table/reading) → PEC (orientation + reasoning on GAM).

### Prompt anti-patterns to add explicitly

- Do not restate the activity title as a second task heading.
- Do not append a facilitator section at the end of every material.
- Do not embed orientation preamble sentences inside `Content:`.
- Do not produce both a long narrative **and** a table that duplicate the same comparison instructions.

---

## 7. Optional post-processing strategy

**Implement as part of 30-2b (Option B)** — not optional if charter is accepted.

### Function (proposed shape)

` sanitizeSelfDirectedGamMaterialsOutput(textOrStructured, context) `

| Constraint | Rule |
|------------|------|
| **When** | Only after GAM step output; only if `shouldApplySelfDirectedLearnerPageScaffoldBase` + non-facilitated |
| **What** | Remove forbidden **headings/labels** and their immediately following paragraph(s) until next `---`, `Material:`, `Activity:`, or markdown heading |
| **What not** | No LLM rewrite; no paraphrase of learner content; no removal of tables/examples solely for length |
| **Redundancy** | Optional second pass: if a material paragraph **substantially overlaps** (`pelReasoningTextsSubstantiallyOverlap` or shared normaliser) with known upstream fields for that `activity_id`, drop **only** the duplicate paragraph — never drop the only table/template |
| **Logging** | Test API hook returns `{ strippedLabels: [], droppedParagraphs: [] }` for assertions |

### Forbidden-label strip algorithm (narrow)

1. Split on activity/material boundaries (preserve structure for JSON and text exports).
2. For each line matching forbidden heading regex (reuse evaluator blob ~`facilitator use:|teacher notes|…`):
   - Remove heading line.
   - Remove following lines until blank line + next structural marker **or** max 8 lines (whichever comes first) to avoid eating unrelated content.
3. Collapse `---\n\n---` artefacts.
4. **Do not** scan inside markdown table cells for substring removal unless whole cell is facilitator-only.

### Facilitated GAM exclusion

If `isWorkflowBriefFacilitatedDeliveryIntent` or workshop/peer profile → **no sanitiser** (same as 30-1c guard).

---

## 8. Anti-redundancy rules

| ID | Rule | Detection (evaluator / sanitiser) |
|----|------|-----------------------------------|
| AR-01 | GAM must not contain full `learner_task` string (≥80% token overlap) | Compare per `activity_id` |
| AR-02 | GAM must not repeat `activity_preamble` or `reasoning_orientation` sentences | Substantial overlap with page/DLA row |
| AR-03 | GAM must not repeat `evidence_use_prompt` / `conceptual_contrast_prompt` as prose blocks | Overlap + field present on row |
| AR-04 | At most **one** “before you check / re-read” retrieval line per activity in GAM if `self_explanation_prompt` exists on row | Count retrieval phrases |
| AR-05 | Worked example ≤2 filled rows in learner templates unless brief requires model answer key | Heuristic row fill ratio |
| AR-06 | No facilitator heading survives sanitisation | Zero forbidden labels in output |

**Crowding principle:** After 30-2r, the learner reads orientation + reasoning cues **once** on the activity card; GAM materials should feel like **artefacts to work on**, not a second lesson plan.

---

## 9. Tests

| Area | File (proposed) | Cases |
|------|-----------------|-------|
| Prompt markers | `tests/workflow-pel-gam-stabilisation.test.js` (new) or extend `workflow-pel-reasoning.test.js` | Self-directed GAM draft includes strengthened voice + anti-redundancy markers; workshop GAM excluded |
| Sanitiser unit | same | Strip `Facilitator use:` + following paragraph from `live-artefacts/marx-activity-materials.txt` snippet; strip 8 blocks from RNA snippet |
| Sanitiser non-regression | same | Preserves table markdown, worked row, `Purpose:` lines |
| Facilitated exclusion | same | Facilitated brief → sanitiser no-op |
| Evaluator | same | `evaluatePelGamMaterialStabilisation` (name TBD): `facilitatorUse: false`, redundancy warnings on synthetic bad fixture |
| Orientation/reasoning regression | `workflow-pel-orientation.test.js`, `workflow-pel-reasoning.test.js` | No change to resolver or PEC ids |
| Renderer regression | `utility-renderer-kitchen-sink.test.js` | **No new assertions** — renderer frozen |

**Fixtures to add:**

| Fixture | Purpose |
|---------|---------|
| `tests/fixtures/workflow-brief/gam-marx-facilitator-leak.txt` | Excerpt from `live-artefacts/marx-activity-materials.txt` |
| `tests/fixtures/workflow-brief/gam-rna-facilitator-leak.txt` | Excerpt from `live-artefacts/rna-activity-materials.txt` |
| `tests/fixtures/workflow-brief/gam-redundant-with-activity.json` | Synthetic GAM + DLA row with overlapping prose |

**Floor:** Maintain **461** minimum; document new count in `baseline-test-floor.md` on implementation.

---

## 10. Regression probes

| Probe | 30-2b pass criteria |
|-------|---------------------|
| **P30-01 Marx** | `marx-activity-materials.txt` (or re-run): **0** `Facilitator use:`; `facilitator regression` → **Yes**; `gam worked support` remains **Partial** or **Yes**; materials still include biographical list + comparison template |
| **P30-02 RNA** | `rna-activity-materials.txt`: **0** forbidden facilitator headings; reference tables + replication template retained |
| **P30-03 Workshop** | No sanitiser on facilitated GAM; no behaviour change |
| **P30-05 Kitchen-sink** | No GAM step — N/A |

**Re-run:** `context-files/sprint-30-probe-runner.js` after implementation; update `probe-p30-01-marx-live.md`, `probe-p30-02-rna-live.md` §GAM sections.

**Automated gate (warn/test):**

```text
evaluatePelGamMaterialStabilisation({ gamText, activities }) → {
  facilitatorLabelsPresent: false,
  redundancyWarnings: [],
  satisfied: true
}
```

Integrate optional call from probe runner heuristics (`facilitatorUse: false`).

---

## 11. Exit criteria

Slice **30-2b** is **complete** when:

1. **GAP-30-10 closed** — live or fixture-equivalent GAM outputs contain **no** forbidden facilitator headings on self-directed probes.
2. **Option B shipped** — prompt hardening **and** narrow `sanitizeSelfDirectedGamMaterialsOutput` (or equivalent) behind self-directed gate.
3. **30-1c guard preserved** — `buildSelfDirectedGamLearnerVoicePromptBlock` still applied; extended, not removed.
4. **Anti-redundancy** — evaluator detects AR-01–AR-04 on synthetic bad fixtures; live Marx/RNA show no full `learner_task` paste in GAM.
5. **Worked support retained** — P30-01/P30-02 `gam worked support` rubric not downgraded to **No**.
6. **No scope violations** — no topology, renderer, new PEC, `metacognition_contract`, cognition-pack, or runtime blocking changes.
7. **Tests** — `node --test tests/*.test.js` pass; floor documented in `review-log.md` (**R30-011**).
8. **Docs** — `enrichment-evidence-matrix.md`, `CURRENT-STATE.md`, `pec-registry.md` § GAM stabilisation updated.

**Not required for 30-2b exit:** Closing GAP-30-11 (DLA field compliance), GAP-30-12 (`intellectual_frame`), or RNA missing `argument_structure_hint` (generation compliance, not GAM leak).

---

## Implementation checklist

- [x] Prompt: strengthen `buildSelfDirectedGamLearnerVoicePromptBlock`
- [x] Prompt: anti-redundancy in `buildSelfDirectedGamPelReasoningMaterialPromptBlock`
- [x] Prompt: remove legacy “after Facilitator use” cognition GAM instruction
- [x] Implement `sanitizeSelfDirectedGamMaterialsOutput` with narrow rules (§7)
- [x] Wire sanitiser on GAM output path (self-directed gate only) + probe runner
- [x] Implement `evaluatePelGamMaterialStabilisation` (warn/test only)
- [x] Tests + fixture `gam-marx-facilitator-leak.txt`
- [x] Re-run `sprint-30-probe-runner.js`; update probe notes
- [x] R30-011 + matrix GAP-30-10 **Closed** (GAM materials)
- [x] `node --test tests/*.test.js` — **466** pass / 0 fail

**Explicitly not closed by 30-2b alone:** Design Page `facilitator_notes` on page activity rows — **closed by 30-2c** (R30-012).

---

## References

| Doc | Use |
|-----|-----|
| [`context-files/probe-p30-01-marx-live.md`](context-files/probe-p30-01-marx-live.md) | Marx GAM leak evidence |
| [`context-files/probe-p30-02-rna-live.md`](context-files/probe-p30-02-rna-live.md) | RNA 8× facilitator blocks |
| [`context-files/live-artefacts/marx-activity-materials.txt`](context-files/live-artefacts/marx-activity-materials.txt) | Regression fixture source |
| [`context-files/live-artefacts/rna-activity-materials.txt`](context-files/live-artefacts/rna-activity-materials.txt) | Regression fixture source |
| [`pec-registry.md`](pec-registry.md) | GAM voice + reasoning material blocks |
| [`slice-30-2-charter.md`](slice-30-2-charter.md) | Phase 2 scope boundary |
| [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md) | GAP-30-10 |

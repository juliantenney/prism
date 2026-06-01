# Slice 30-2 charter — Reasoning & scaffolding

**Status:** **Phase 2 closed / stable** (2026-06-01) — core + **30-2r** + **30-2b** + **30-2c** — see [`slice-30-2b-charter.md`](slice-30-2b-charter.md)  
**PEC:** `reasoning_contract` only (generation); **30-2r** renderer passthrough only  
**Date:** 2026-06-01  
**Decisions:** [R30-009](review-log.md) — generation-layer DLA/GAM PEC; [R30-010](review-log.md) — passive reasoning field render

**Parent:** [`sprint-30-charter.md`](sprint-30-charter.md) Phase 2  
**Prerequisites:** Phase 1 complete (30-1, 30-1b, 30-1c) — see [`CURRENT-STATE.md`](CURRENT-STATE.md)  
**Registry:** [`pec-registry.md`](pec-registry.md) § `reasoning_contract`

---

## Goal

Self-directed learner pages make **disciplinary thinking visible** in activities and materials: learners see **what kind of thinking** each task requires, how to **use evidence**, how to **structure arguments**, and how to **contrast concepts** — using notebook-and-pencil work, not tutoring chat.

Phase 2 strengthens **intellectual work** on top of Phase 1 orientation: tasks and GAM artefacts should read as **topic-specific reasoning scaffolds**, not generic “think critically” or hollow compare/discuss prompts.

**Strategic alignment (Copilot / design critique themes — generation layer only):**

| Theme | 30-2 expression |
|-------|-----------------|
| Make thinking process visible | `reasoning_orientation` on analyse/compare/application activities |
| Worked micro-examples | GAM: short, topic-specific worked steps in materials (not Socratic dialogue) |
| Argument / evidence scaffolds | `argument_structure_hint`, `evidence_use_prompt` |
| Conceptual contrast | `conceptual_contrast_prompt` on compare/distinguish tasks |
| Generative retrieval | DLA/GAM prompts: predict/recall/apply **before** re-reading source (static prompts, not adaptive engine) |
| Assessment alignment | Reasoning fields complement existing assessment items; no new high-stakes items unless brief requires |

---

## In scope

| Item | Detail |
|------|--------|
| PEC implementation | **`reasoning_contract` only** — add to `resolvePedagogicEnrichmentContractIds` alongside `orientation_contract` when gate passes |
| Primary steps | **Design Learning Activities (DLA)**, **Generate Activity Materials (GAM)** |
| Design Page | **Preservation only** — extend field-preservation block if new keys are not already listed; no new composition logic unless merge gaps found in probes |
| Activation | Same self-directed learner-page gate as Phase 1 (`delivery_context: self_directed` + `shouldApplySelfDirectedLearnerPageScaffoldBase`; facilitated/workshop/peer → no PEC) |
| Fields | See [Field policy](#field-policy); extend `SELF_DIRECTED_ACTIVITY_FRAMING_FIELD_IDS` / OUTPUT CONTRACT |
| Prompts | `buildPelReasoningContractPromptBlock()` (marker TBD, e.g. `Pedagogic enrichment — reasoning contract (auto-applied):`) via `applyPedagogicEnrichmentContractScaffoldToDraft` on DLA + GAM |
| GAM | Topic-specific material scaffolds for worked micro-examples and evidence tables; **reuse** 30-1c learner voice guard; **no** facilitator labels |
| Evaluator | Extend `evaluatePedagogicEnrichmentContractSatisfaction` with `evaluatePelReasoningContractSatisfaction` — **warn/test only**, no runtime block |
| Tests | New or extended `tests/workflow-pel-reasoning.test.js` (name TBD) |
| Registry | Update [`pec-registry.md`](pec-registry.md) when field list is frozen |

**Partial overlap with `disciplinary_thinking_contract` (charter Phase 2):** only **`disciplinary_lens`** and source-reading norms expressed as **`evidence_use_prompt`** — not `synthesis_prompt`, `source_handling_note` as separate PEC (defer to 30-3 / disciplinary slice unless folded into evidence prompt).

---

## Out of scope

| Item | Defer to |
|------|----------|
| `metacognition_contract` (`comprehension_check_prompt`, `monitoring_prompt`, `study_strategy_note`, …) | **30-3** |
| `orientation_contract` behaviour changes | Frozen (30-1); reasoning must not duplicate `study_orientation` / bridges |
| New workflow steps or topology changes | — |
| `applyWorkflowDesignHeuristics` changes | — |
| New cognition packs or pack detection changes | Sprint 28 charter |
| Adaptive tutoring, hint engines, learner modelling | — |
| Renderer redesign or new util CSS programme | **30-2r** complete (minimal cue passthrough); **30-2b** is GAM anti-redundancy only |
| **30-2b** GAM anti-redundancy (cards vs tables vs prompts) | Separate slice after 30-2 core |
| Full `disciplinary_thinking_contract` | 30-3 / later |
| `intellectual_coherence_bridge`, `study_orientation`, `intellectual_frame` | **orientation_contract** (30-1) |
| Runtime blocking on thin reasoning fields | Evaluator warn only |
| Assessment topology / Sprint 27 semantics changes | Assessment frozen |

---

## Activation rules

`reasoning_contract` activates when **all** of the following hold (mirror 30-1 unless probe proves a narrower gate):

1. **`resolvePedagogicEnrichmentContractIds`** would return orientation (not facilitated; self-directed learner-page scaffold base).
2. Brief is **not** workshop / peer-instruction / seminar facilitated profile (same exclusions as 30-1 tests).

**Conditional emphasis (prompt block sections, not separate PEC):**

| Signal | Reasoning emphasis |
|--------|-------------------|
| `input_strategy: provided_source_content` or transcript/source in inputs | Require **`evidence_use_prompt`** on source-dependent activities |
| Compare / contrast / distinguish in `learner_task` | Require **`conceptual_contrast_prompt`** and/or **`argument_structure_hint`** |
| Application / policy / contemporary use | **`reasoning_orientation`** + optional **`disciplinary_lens`** |
| Multi-activity page (≥2) | At least **two** activities with non-empty **`reasoning_orientation`**; **`self_explanation_prompt`** on ≥2 (align existing self-directed OUTPUT CONTRACT) |

**Composition with Phase 1:** When both contracts active, prompt order remains **cognition → self-directed → PEC**; append orientation block then reasoning block (or single combined PEC append with two markers — implementation choice, document in review log).

**Explicit non-activation:** P30-03 workshop, facilitated F2F, peer cognition briefs — no reasoning PEC marker in DLA/GAM prompts.

---

## Field policy

### Primary fields (`reasoning_contract`)

| Field id | Scope | Required? | Notes |
|----------|-------|-----------|-------|
| `reasoning_orientation` | Activity | **Strongly expected** on analyse, compare, application, cause-effect activities | **Reuse** Sprint 28 / self-directed scaffold key; 1–2 sentences, topic-specific |
| `evidence_use_prompt` | Activity (and GAM text for source briefs) | **Required** when activity uses transcript/extract/reading | How to cite, quote, or map claims to source — not bibliography cosplay |
| `argument_structure_hint` | Activity | **Expected** on argumentation, comparison, evaluation tasks | Short claim → evidence → implication scaffold |
| `self_explanation_prompt` | Activity | **At least two activities** on multi-activity pages | **Reuse Sprint 28**; supports generative retrieval (“explain in your own words before checking”) |
| `disciplinary_lens` | First activity or page-level once | **Optional** | Named mode of inquiry (historian, virologist, …); do not duplicate `intellectual_frame` prose |
| `conceptual_contrast_prompt` | Activity | **Expected** on compare/distinguish/misconception-repair activities | What to contrast, what mistake to avoid — topic-specific |

### Fields explicitly not in 30-2 PEC

| Field | Owner |
|-------|--------|
| `study_orientation`, `activity_preamble`, `intellectual_frame`, `intellectual_coherence_bridge` | `orientation_contract` |
| `scaffold_hint_sequence`, `uncertainty_tension_prompt`, `transfer_or_application_task` | Sprint 28 cognition / self-directed scaffold (unchanged pack rules) |
| `comprehension_check_prompt`, `monitoring_prompt`, `synthesis_prompt` | **30-3** `metacognition_contract` |

### Coexistence with Sprint 28

- Do **not** add new cognition packs to force reasoning fields.
- When `self_study_cognition_pack` or other packs are active, PEC reasoning block **reinforces** pack OUTPUT CONTRACT — no conflicting rename.
- **`scaffold_hint_sequence`:** remain optional (≤1 activity); 30-2 does not make adaptive sequences mandatory.

### GAM material expectations (not always separate JSON keys)

| Expectation | Layer |
|-------------|--------|
| **Worked micro-example** | GAM: one short worked step (e.g. sample table row, labelled cause→effect pair) per complex activity where task is procedural |
| **Generative retrieval** | DLA: prompt learner to predict/recall before re-read; GAM may include “cover the answer” section |
| **Assessment alignment** | DLA: reasoning prompts reference what will be practised in linked formative items; do not add summative items |

---

## Prompt block expectations

### DLA — `buildPelReasoningContractPromptBlock()`

Must instruct the model to:

1. State **what kind of thinking** each activity requires (`reasoning_orientation`) — e.g. chronological reasoning, mechanism tracing, text comparison, misconception repair.
2. On source-based briefs, include **`evidence_use_prompt`** tied to the actual transcript/extract (RNA, uploaded content) — not generic “use evidence”.
3. On compare/contrast activities, include **`conceptual_contrast_prompt`** naming the concepts and a common confusion.
4. On argument-heavy tasks, include **`argument_structure_hint`** (claim → evidence → implication) in learner-facing prose.
5. Include **`self_explanation_prompt`** on at least two activities (notebook reflection, generative retrieval).
6. Optionally set **`disciplinary_lens`** once per page (complements, does not replace, `intellectual_frame`).
7. Keep **`learner_task`** actionable; reasoning fields sit **above** task in JSON, not inside facilitator notes.
8. **Assessment alignment:** if brief includes formative checks, align reasoning prompts with those skills (wording only).

**Marker (proposed):** `Pedagogic enrichment — reasoning contract (auto-applied):`

### GAM — reasoning material scaffold (via PEC on GAM step or self-directed GAM extension)

Must instruct the model to:

1. Realise DLA reasoning fields in **learner-facing** materials (30-1c voice guard applies).
2. Add **worked micro-examples** where tasks involve tables, mapping, or multi-step analysis — minimal, topic-specific.
3. Support **evidence_use** with quotable spans, labelled columns, or “your evidence here” rows — not empty placeholders.
4. **Generative retrieval:** optional “Before you read…” / “Without looking back…” prompt in material body.
5. Avoid duplicating full `learner_task` + orientation preamble + reasoning_orientation in three places (anti-redundancy guidance — full rules in **30-2b**).

### Design Page — preservation only

- Extend preservation list if any 30-2 field ids missing from `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock`.
- Do not strip `reasoning_orientation`, `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt`, `disciplinary_lens` during composition.

---

## Anti-patterns

| Anti-pattern | Why forbidden |
|--------------|----------------|
| “Think critically” / “Discuss in groups” / “Share with a partner” | Facilitated or hollow |
| Generic reasoning_orientation (“analyse the topic carefully”) | Not topic-specific |
| Duplicating `activity_preamble` + `reasoning_orientation` + `study_orientation` with same sentences | Crowding; Phase 1 owns preamble/orientation |
| Socratic chat loops (“What do you think?” repeatedly) | Tutoring, not PEL |
| Adaptive hint ladders at runtime | Out of scope |
| New assessment items smuggled in as reasoning fields | Sprint 27 assessment semantics |
| `disciplinary_lens` = copy of `intellectual_frame` | Pick one lens per page or differentiate |
| GAM “Facilitator use:” / timing choreography | 30-1c guard |
| Scaffold explosion (card + table + 4 prompt blocks saying the same thing) | 30-2b target |
| Renaming Sprint 28 shipped keys | Migration required |

---

## Implementation checklist

- [x] Add `SPRINT_30_PEC_REASONING_CONTRACT_ID` and extend `SPRINT_30_PEC_IDS` / `PEL_REASONING_FIELD_IDS`
- [x] Extend `resolvePedagogicEnrichmentContractIds` → `["orientation_contract", "reasoning_contract"]` when gate passes
- [x] Implement `buildPelReasoningContractPromptBlock()`
- [x] Wire `applyPedagogicEnrichmentContractScaffoldToDraft` for **DLA** and **GAM** (reasoning block)
- [x] Extend DLA self-directed OUTPUT CONTRACT with reasoning field ids and examples
- [x] Extend Design Page preservation list
- [x] Implement `evaluatePelReasoningContractSatisfaction` + route in `evaluatePedagogicEnrichmentContractSatisfaction` (warn/test)
- [x] Export symbols on `__PRISM_TEST_API`
- [x] Tests: `tests/workflow-pel-reasoning.test.js` (12 tests)
- [x] Renderer (30-2 core): **no change** at core ship — existing paths for `reasoning_orientation` + `self_explanation_prompt` only
- [x] Update [`pec-registry.md`](pec-registry.md), [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md), [`review-log.md`](review-log.md) (R30-009)
- [x] `node --test tests/*.test.js` — **457** pass / 0 fail (30-2 core)
- [ ] Optional: re-run `context-files/sprint-30-probe-runner.js`; record in probe live notes

**30-2r (complete — R30-010):**

- [x] Extend `renderActivityFramingForActivity` — passive passthrough for `disciplinary_lens`, `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt`
- [x] Reuse `pushPelOrientationCue` / dedupe; no PEC, prompt, evaluator, GAM, topology, cognition-pack, or workflow changes
- [x] Fixtures: `renderer-kitchen-sink-page.json` (KS-A7); `self-directed-activity-framing-page.json` (A3)
- [x] Tests: kitchen-sink + framing (label/order/dedupe/absent fields)
- [x] `node --test tests/*.test.js` — **461** pass / 0 fail
- [x] GAP-30-13 closed

**Follow-on:** [x] **30-2b** — GAM anti-redundancy + facilitator leakage ([`slice-30-2b-charter.md`](slice-30-2b-charter.md), R30-011)

---

## Renderer visibility (30-2r — R30-010)

**GAP-30-13 closed** (2026-06-01). Passive passthrough in `renderActivityFramingForActivity` — renderer does not infer or generate reasoning.

| Field | Status | Learner label |
|-------|--------|---------------|
| `reasoning_orientation` | **Renders** (unchanged) | How to think: |
| `self_explanation_prompt` | **Renders** (unchanged) | Reflect (`util-cognition--explain`) |
| `disciplinary_lens` | **Renders** (30-2r) | Disciplinary lens: |
| `evidence_use_prompt` | **Renders** (30-2r) | Using evidence: |
| `argument_structure_hint` | **Renders** (30-2r) | Structuring your response: |
| `conceptual_contrast_prompt` | **Renders** (30-2r) | Key distinction: |

Order: disciplinary lens → how to think → using evidence → structuring → key distinction → What to do. No fallback text; dedupe when cues substantially overlap.

---

## Tests

| Test area | File (proposed) | Cases |
|-----------|-----------------|-------|
| Resolver | `tests/workflow-pel-reasoning.test.js` | Marx + RNA self-study → `reasoning_contract` active; workshop → absent |
| DLA prompt | same | Reasoning marker + field names + evidence/contrast examples |
| GAM prompt | same | Reasoning marker on self-directed GAM; workshop GAM excluded |
| Coexistence | same | Orientation marker still present when both PECs active |
| Evaluator | same | Good fixture: ≥2 `reasoning_orientation`, evidence on source activity; bad: generic strings |
| Preservation | extend `workflow-self-directed-activity-framing-adoption.test.js` if merge tests needed | Reasoning fields survive Design Page prompt |
| Renderer regression | `utility-renderer-kitchen-sink.test.js` | **30-2r:** KS-A7 reasoning labels + order + dedupe |
| Cognition packs | `workflow-ld-cognition-contracts.test.js` | No regression on peer/workshop |
| Brief defaults | `workflow-brief-learner-resource-defaults.test.js` | Facilitated rows unchanged |

**Fixtures to add or extend:**

- `tests/fixtures/workflow-brief/marx-dla-reasoning-good.json` (synthetic DLA with full reasoning fields)
- `renderer-kitchen-sink-page.json` — **KS-A7** (30-2r reasoning showcase)

---

## Regression probes

| Probe | Phase 2 check |
|-------|----------------|
| **P30-01** Marx | ≥2 topic-specific `reasoning_orientation`; compare activity has `conceptual_contrast_prompt` or `argument_structure_hint`; GAM materials include worked micro-example where tables used; no facilitator voice |
| **P30-02** RNA | `evidence_use_prompt` on transcript-dependent activities; misconception activity has contrast/repair reasoning; topic HCV not “uploaded transcript” |
| **P30-03** Workshop | No reasoning PEC marker; cognition pack behaviour unchanged |
| **P30-04** Generic self-directed | Resolver returns reasoning when orientation returns |
| **P30-05** Kitchen-sink | Reasoning fields render if present in JSON (passive) |

**Automated gate:** `evaluatePelReasoningContractSatisfaction` on DLA + optional `gamText` + composed page rows.

**Live capture:** Update `probe-p30-01-marx-live.md`, `probe-p30-02-rna-live.md` after implementation.

---

## Success rubric (manual — live or regenerated page)

| Criterion | Pass indicator |
|-----------|----------------|
| Thinking process visible | Learner can name **what kind of thinking** each major activity requires without reading `learner_task` only |
| Topic-specific reasoning | No generic critical-thinking boilerplate; Marx/RNA examples name concepts |
| Evidence discipline | Source-based activities say **how** to use the provided text |
| Argument structure | Compare/evaluate activities offer claim → evidence → implication scaffold |
| Conceptual contrast | Compare/misconception activities name **what differs** and a common error |
| Generative retrieval | At least one activity or material block asks predict/recall before re-read |
| Worked support | Complex procedural task has a **short** worked micro-example in materials |
| Assessment alignment | Formative items (if any) match reasoning prompts; no surprise summative |
| Orientation preserved | Phase 1 preambles/bridges still present; no facilitator choreography |
| Facilitated regression | Workshop probe unchanged |

Score each **Yes / Partial / No** in probe live notes.

---

## Exit criteria

Slice **30-2 core** is **complete** (2026-06-01):

1. ✅ **`reasoning_contract`** in `app.js` (resolver, DLA + GAM prompts, Design Page preservation).
2. ✅ Checklist above except live probe re-run and **30-2b**.
3. ✅ Automated tests — **461** pass / 0 fail (includes **30-2r**).
4. ✅ `evaluatePelReasoningContractSatisfaction` — warn/test only (R30-009).
5. ☐ P30-01 / P30-02 live rubric re-run post–30-2 (deferred).
6. ✅ [`pec-registry.md`](pec-registry.md) + **R30-009** / **R30-010** in [`review-log.md`](review-log.md).
7. ✅ No `metacognition_contract`, topology change, cognition packs, or runtime blocking.
8. ✅ **30-2r** — reasoning field renderer passthrough; GAP-30-13 closed.
9. ✅ **30-2b** — GAM sanitiser + prompt hardening; GAP-30-10 closed (R30-011).
10. ✅ **30-2c** — Design Page activity-row sanitisation; Design Page `facilitator_notes` closed for self-directed learner pages (R30-012).

**Phase 2 exit:** All stabilisation slices complete; floor **471**. **Next:** Phase 3 **chartering** (`metacognition_contract`) — not implementation.

---

## Phase 2 stabilisation (30-2b + 30-2c)

| Slice | Layer | Status |
|-------|-------|--------|
| **30-2b** | GAM materials text | ✅ `sanitizeSelfDirectedGamMaterialsOutput` |
| **30-2c** | Composed page activity rows | ✅ `sanitizeSelfDirectedLearnerPageActivityRows` |

Both are gated to self-directed learner pages; facilitated/workshop behaviour unchanged. Neither changes renderer, PEC resolver, or workflow topology.

---

## References

| Doc | Use |
|-----|-----|
| [`sprint-30-charter.md`](sprint-30-charter.md) § Phase 2 | Parent goals and risks |
| [`slice-30-1-charter.md`](slice-30-1-charter.md) | Slice charter template |
| [`pec-registry.md`](pec-registry.md) | Field namespace |
| [`context-files/sprint-28-29-boundaries.md`](context-files/sprint-28-29-boundaries.md) | Cognition vs PEL |
| [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md) | P30-01–05 |
| [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md) | Gap tracking post-implementation |

# Sprint 30 enrichment evidence matrix

**Purpose:** Track pedagogic enrichment quality across probes and layers.

**Legend:** ☐ Not run · ✅ Pass · ⚠️ Partial · ❌ Fail · — N/A

**Last update:** 2026-06-01 — **Sprint 30 CLOSED** ([`SPRINT-30-RETROSPECTIVE.md`](SPRINT-30-RETROSPECTIVE.md), R30-999). Phases 1–2 complete; Phase 3 deferred. Final floor **471**. Sprint 31 seeded (presentation only).

---

## Probe summary

| Probe | Brief profile | 30-1 orientation | 30-2 reasoning | 30-3 metacognition | Notes |
|-------|---------------|------------------|----------------|--------------------|-------|
| P30-01 Marx | Self-directed multi-activity | ⚠️ Live G ✅; bridges weak | ⚠️ **Live** G ✅ R ✅ render | ☐ | GAM **sanitized** — 0× facilitator labels; tables/worked rows kept |
| P30-02 RNA | Transcript self-study | ⚠️ Live preambles only | ⚠️ **Live** G ✅ R ✅ render | ☐ | GAM **sanitized**; evidence/contrast strong; argument_structure_hint still missing in DLA |
| P30-03 Workshop | Facilitated | — | — | — | PEC `[]` (automated) |
| P30-04 Generic page | Self-directed lean | ⚠️ Gen only | ☐ | ☐ | Not live-run |
| P30-05 Kitchen-sink | Synthetic render | ✅ | ✅ KS-A7 | ☐ | KS-A6 orientation + KS-A7 reasoning regression |

---

## Layer trace (P30-01 / P30-02 — Factory live 2026-06-01)

| Layer | Question | P30-01 | P30-02 | P30-03 |
|-------|----------|--------|--------|--------|
| **E** | `delivery_context` self_directed? | ✅ | ✅ | ✅ |
| **E** | Topic semantic? | ✅ | ✅ (RNA/HCV) | — |
| **O** | Topology includes DLA → GAM → Design Page? | ✅ | ✅ | ☐ |
| **G** | PEC prompts on DLA/Design Page? | ✅ | ✅ | — |
| **G** | Reasoning PEC on DLA/GAM (30-2)? | ✅ code | ✅ code | — |
| **G** | Reasoning fields in DLA JSON (live)? | ⚠️ partial (pre–30-2 live) | ⚠️ partial | — |
| **G** | Orientation fields in **DLA** JSON? | ⚠️ partial (study on A1; bridges on page not DLA) | ⚠️ preambles only in DLA | — |
| **G** | GAM learner-facing (no facilitator voice)? | ✅ **30-2b** sanitiser | ✅ **30-2b** sanitiser | — |
| **C** | Orientation on **composed page**? | ✅ | ✅ | — |
| **C** | Page rows free of facilitator_notes / choreo support_note (30-2c)? | ✅ sanitiser | ✅ sanitiser | — |
| **R** | Orientation in HTML (30-1b)? | ✅ | ✅ | — |

---

## Slice 30-1 rubric (live — 2026-06-01 post–30-2)

| Criterion | P30-01 | P30-02 |
|-----------|--------|--------|
| Purpose clear quickly | Yes (intro section) | Yes (intro section) |
| Sequentially connected | Partial (no bridges in DLA) | Partial (no bridges in DLA) |
| No facilitator choreography | **Yes** (GAM sanitized) | **Yes** (GAM sanitized) |
| Topic-specific | Yes | Yes (RNA/HCV) |
| Bridges useful | N/A / weak | N/A / weak |

## Slice 30-2 rubric (live — 2026-06-01)

| Criterion | P30-01 | P30-02 |
|-----------|--------|--------|
| Thinking process visible | **Yes** | **Yes** |
| Evidence discipline | N/A | **Yes** (4/4 evidence_use_prompt) |
| Argument structure | **Yes** (A3 hint) | **Partial** (missing hint) |
| Conceptual contrast | **Yes** (A3) | **Yes** (A1, A3) |
| Generative retrieval | **Yes** (DLA self_explanation) | **Yes** |
| GAM worked support | Partial | Partial |
| Redundancy (evaluator) | Yes | Yes |
| Facilitator regression | **Yes** | **Yes** |
| Renderer: reasoning partial | **Closed (30-2r)** — all six reasoning display paths when JSON present | **Closed (30-2r)** — evidence/contrast/lens now learner-visible on re-render |

---

## Automated evidence

| Check | Source | Result |
|-------|--------|--------|
| PEC resolver / prompts | `workflow-pel-orientation.test.js` | ✅ |
| GAM self-directed voice guard (30-1c) | `workflow-pel-orientation.test.js` | ✅ |
| Orientation evaluator (warn/test) | `workflow-pel-orientation.test.js` | ✅ |
| Renderer passthrough (orientation 30-1b) | kitchen-sink + framing tests | ✅ |
| Renderer passthrough (reasoning 30-2r) | kitchen-sink KS-A7 + framing A3 | ✅ |
| Factory live capture | `sprint-30-probe-capture.json` | ✅ (post–30-2, 2026-06-01) |
| Phase 2 probe notes | `probe-p30-01-marx-live.md`, `probe-p30-02-rna-live.md` | ✅ |
| Reasoning PEC resolver / prompts (30-2) | `workflow-pel-reasoning.test.js` | ✅ |
| GAM stabilisation (30-2b) | `workflow-pel-reasoning.test.js` + probe runner sanitiser | ✅ |
| Design Page row sanitisation (30-2c) | `workflow-pel-reasoning.test.js` + probe `auditLearnerPageActivityRowSanitization` | ✅ |
| Reasoning evaluator (warn/test) | `workflow-pel-reasoning.test.js` | ✅ |
| GAM material evaluator (30-2b) | `evaluatePelGamMaterialStabilisation` | ✅ |
| Full suite | `tests/*.test.js` | **471** pass |

---

## Gap list

| ID | Gap | Status |
|----|-----|--------|
| GAP-30-01 | Procedural DLA lacks framing | **Improved live** — 4/4 preambles; orientation on page |
| GAP-30-08 | Orientation not rendered | **Closed** (30-1b) |
| GAP-30-09 | No Factory artefacts | **Closed** — `live-artefacts/` |
| **GAP-30-10** | GAM facilitator voice on self-study | **Closed (30-2b)** — prompt hardening + `sanitizeSelfDirectedGamMaterialsOutput`; Factory probes `facilitatorUse: false` |
| **GAP-30-11** | DLA step omits PEC fields; Design Page invents | **Partially closed** — `evaluatePelOrientationContractSatisfaction` (warn/test only; no runtime block) |
| **GAP-30-12** | `intellectual_frame` rarely generated | **Open** — optional field |
| **GAP-30-13** | Four reasoning PEC fields not rendered | **Closed (30-2r)** — passive passthrough in `renderActivityFramingForActivity` (R30-010) |
| **GAP-30-14** | Reasoning fields duplicate learner_task | **Mitigated (30-2)** — prompt + `evaluatePelReasoningContractSatisfaction` duplication warnings |
| **GAP-30-15** | Design Page `facilitator_notes` on learner activity rows | **Closed (30-2c)** — `sanitizeSelfDirectedLearnerPageActivityRows` before render; facilitated pages unchanged |
| GAP-30-02–07 | See prior rows | Open / closed per matrix history |

---

## Verdict log

| Date | Probe | Verdict |
|------|-------|---------|
| 2026-06-01 | P30-01 | Phase 1 **materially improves** vs procedural fixture; GAM facilitator leak |
| 2026-06-01 | P30-02 | Phase 1 **pass** on topic + coherence; DLA/page split on orientation fields |
| 2026-06-01 | — | 30-1 + 30-1b **complete**; Phase 1 validation done — defer 30-2 |
| 2026-06-01 | — | **30-1c complete** — GAM learner voice guard + orientation evaluator (warn/test); floor **445** |
| 2026-06-01 | — | **30-2 core complete** — `reasoning_contract` on DLA/GAM; floor **457** |
| 2026-06-01 | P30-01 | Phase 2 live: reasoning DLA **strong**; GAM facilitator **fail**; renderer gap **material** |
| 2026-06-01 | P30-02 | Phase 2 live: evidence/contrast **strong**; argument_structure_hint **missing**; GAM facilitator **fail** |
| 2026-06-01 | — | **30-2r complete** — reasoning field renderer passthrough; GAP-30-13 **closed**; floor **461** |
| 2026-06-01 | P30-01 | Phase 2 re-run post–30-2b: GAM **pass** (`facilitatorUse: false`); facilitator regression **Yes** |
| 2026-06-01 | P30-02 | Phase 2 re-run post–30-2b: GAM **pass**; evidence/contrast strong |
| 2026-06-01 | — | **30-2b complete** — GAM sanitiser + prompt hardening; GAP-30-10 **closed**; floor **466** |
| 2026-06-01 | — | **30-2c complete** — Design Page row sanitiser; GAP-30-15 **closed**; **Phase 2 closed**; floor **471** |

---

## Slice 30-2 core (implemented)

| Item | Status |
|------|--------|
| `reasoning_contract` on self-directed learner pages | ✅ |
| Resolver: `orientation_contract` + `reasoning_contract` | ✅ |
| DLA + GAM reasoning PEC scaffolds | ✅ |
| Design Page: reasoning field preservation only (no reasoning PEC block) | ✅ |
| `evaluatePelReasoningContractSatisfaction` | ✅ warn/test only |
| Topology / renderer / cognition packs / `metacognition_contract` / runtime block | ❌ no changes |
| Renderer: `reasoning_orientation`, `self_explanation_prompt` | ✅ existing paths |
| Renderer: `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt`, `disciplinary_lens` | ✅ **30-2r** passive passthrough (R30-010) |

**Phase 2 live verdict (2026-06-01):** Generation-layer reasoning_contract **works** for DLA. **GAP-30-13 closed** by 30-2r. **GAP-30-10 closed** by 30-2b (GAM materials). **GAP-30-15 closed** by 30-2c (Design Page activity rows). Phase 2 is **closed / stable**.

**Recommended order:**

1. ~~**30-2r**~~ — **Complete** (R30-010).
2. ~~**30-2b**~~ — **Complete** (R30-011).
3. ~~**30-2c**~~ — **Complete** (R30-012).
4. **30-3** — **chartering next** (residual: DLA bridges, `intellectual_frame`, field compliance — not facilitator row leakage).

**Artefacts:** `live-artefacts/marx-*.json|txt|html`, `live-artefacts/rna-*.json|txt|html` (post–30-2b capture).

---

## Slice 30-2r (implemented)

| Item | Status |
|------|--------|
| Passive render `disciplinary_lens`, `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt` | ✅ `renderActivityFramingForActivity` |
| Existing `reasoning_orientation`, `self_explanation_prompt` | ✅ unchanged paths |
| PEC / prompt / evaluator / GAM / topology / cognition-pack / workflow | ❌ no changes |
| Dedupe overlapping reasoning cue text | ✅ `comparableSeen` |
| Fixtures | ✅ KS-A7 kitchen-sink; framing A3 |
| Tests | ✅ kitchen-sink + framing (+ cognition test excludes KS-A7) |
| Floor | **461** pass / 0 fail |

---

## Slice 30-1c (implemented)

| Item | Status |
|------|--------|
| Self-directed GAM learner voice guard | ✅ `buildSelfDirectedGamLearnerVoicePromptBlock` |
| Forbids facilitator labels / timing on self-directed GAM | ✅ |
| Workshop/facilitated GAM not mis-constrained | ✅ tested |
| `evaluatePelOrientationContractSatisfaction` | ✅ warn/test only |
| Runtime blocking | ❌ none |
| Renderer / topology / cognition packs / new PEC / `reasoning_contract` | ❌ no changes |

## Slice 30-2b (implemented)

| Item | Status |
|------|--------|
| Prompt hardening — GAM learner voice + reasoning materials | ✅ |
| Legacy cognition GAM wording (no “after Facilitator use”) | ✅ |
| `sanitizeSelfDirectedGamMaterialsOutput` (self-directed GAM gate only) | ✅ |
| Strips facilitator headings; preserves learner pedagogy | ✅ |
| Worked examples, tables, evidence supports preserved | ✅ Factory re-run |
| `evaluatePelGamMaterialStabilisation` | ✅ warn/test only |
| PEC / renderer / topology / runtime block | ❌ no changes |
| GAP-30-10 | ✅ **Closed** |
| Design Page `facilitator_notes` | ✅ **Closed (30-2c)** — row sanitisation before render |
| Floor | **466** pass / 0 fail |

## Slice 30-2c (implemented)

| Item | Status |
|------|--------|
| `sanitizeSelfDirectedLearnerPageActivityRows` | ✅ learner-profile self-directed gate only |
| Strips facilitator row fields (`facilitator_notes`, `facilitator_note`, `facilitator_moves`, `teacher_notes`, `instructor_guidance`, `tutor_guidance`) | ✅ |
| Choreographic `support_note` / `support_notes` removed; learner-facing hints preserved | ✅ |
| Integration in `applyPedagogicCognitionSemanticsToComposedPage` | ✅ before render/export |
| Facilitated/workshop pages unchanged | ✅ tested |
| Probe runner page-row audit | ✅ `auditLearnerPageActivityRowSanitization` |
| PEC / renderer / DLA-GAM prompts / topology | ❌ no changes |
| GAP-30-15 | ✅ **Closed** |
| Floor | **471** pass / 0 fail |

---

**Superseded by 30-2 core + 30-2r + 30-2b + 30-2c** — see tables above.

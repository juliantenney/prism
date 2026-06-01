# Sprint 30 enrichment evidence matrix

**Purpose:** Track pedagogic enrichment quality across probes and layers.

**Legend:** ☐ Not run · ✅ Pass · ⚠️ Partial · ❌ Fail · — N/A

**Last update:** 2026-06-01 — **30-1c complete** (GAM learner voice guard + orientation evaluator); Factory live validation P30-01 / P30-02 (`live-artefacts/` pre–30-1c re-run).

---

## Probe summary

| Probe | Brief profile | 30-1 orientation | 30-2 reasoning | 30-3 metacognition | Notes |
|-------|---------------|------------------|----------------|--------------------|-------|
| P30-01 Marx | Self-directed multi-activity | ⚠️ **Live** G+C+R ✅; rubric partial | ☐ | ☐ | vs procedural fixture: major framing gain |
| P30-02 RNA | Transcript self-study | ⚠️ **Live** G+C+R ✅; rubric partial | ☐ | ☐ | Topic HCV ✅; DLA orientation weak, page compensated |
| P30-03 Workshop | Facilitated | — | — | — | PEC `[]` (automated) |
| P30-04 Generic page | Self-directed lean | ⚠️ Gen only | ☐ | ☐ | Not live-run |
| P30-05 Kitchen-sink | Synthetic render | ✅ | ☐ | ☐ | KS-A6 regression |

---

## Layer trace (P30-01 / P30-02 — Factory live 2026-06-01)

| Layer | Question | P30-01 | P30-02 | P30-03 |
|-------|----------|--------|--------|--------|
| **E** | `delivery_context` self_directed? | ✅ | ✅ | ✅ |
| **E** | Topic semantic? | ✅ | ✅ (RNA/HCV) | — |
| **O** | Topology includes DLA → GAM → Design Page? | ✅ | ✅ | ☐ |
| **G** | PEC prompts on DLA/Design Page? | ✅ | ✅ | — |
| **G** | Orientation fields in **DLA** JSON? | ⚠️ partial (study on A1; bridges on page not DLA) | ⚠️ preambles only in DLA | — |
| **G** | GAM learner-facing (no facilitator voice)? | ⚠️ **Live** leak; ✅ **30-1c** prompt guard | ⚠️ review | — |
| **C** | Orientation on **composed page**? | ✅ | ✅ | — |
| **R** | Orientation in HTML (30-1b)? | ✅ | ✅ | — |

---

## Slice 30-1 rubric (live)

| Criterion | P30-01 | P30-02 |
|-----------|--------|--------|
| Purpose clear quickly | Yes | Yes |
| Sequentially connected | Yes | Yes |
| No facilitator choreography | Partial (GAM live); **30-1c** mitigates | Partial |
| Topic-specific | Yes | Yes |
| Bridges useful | Partial | Partial |

---

## Automated evidence

| Check | Source | Result |
|-------|--------|--------|
| PEC resolver / prompts | `workflow-pel-orientation.test.js` | ✅ |
| GAM self-directed voice guard (30-1c) | `workflow-pel-orientation.test.js` | ✅ |
| Orientation evaluator (warn/test) | `workflow-pel-orientation.test.js` | ✅ |
| Renderer passthrough | kitchen-sink + framing tests | ✅ |
| Factory live capture | `sprint-30-probe-capture.json` | ✅ (pre–30-1c) |
| Full suite | `tests/*.test.js` | **445** pass |

---

## Gap list

| ID | Gap | Status |
|----|-----|--------|
| GAP-30-01 | Procedural DLA lacks framing | **Improved live** — 4/4 preambles; orientation on page |
| GAP-30-08 | Orientation not rendered | **Closed** (30-1b) |
| GAP-30-09 | No Factory artefacts | **Closed** — `live-artefacts/` |
| **GAP-30-10** | GAM facilitator voice on self-study | **Mitigated (30-1c)** — `buildSelfDirectedGamLearnerVoicePromptBlock`; re-run probes to confirm |
| **GAP-30-11** | DLA step omits PEC fields; Design Page invents | **Partially closed** — `evaluatePelOrientationContractSatisfaction` (warn/test only; no runtime block) |
| **GAP-30-12** | `intellectual_frame` rarely generated | **Open** — optional field |
| GAP-30-02–07 | See prior rows | Open / closed per matrix history |

---

## Verdict log

| Date | Probe | Verdict |
|------|-------|---------|
| 2026-06-01 | P30-01 | Phase 1 **materially improves** vs procedural fixture; GAM facilitator leak |
| 2026-06-01 | P30-02 | Phase 1 **pass** on topic + coherence; DLA/page split on orientation fields |
| 2026-06-01 | — | 30-1 + 30-1b **complete**; Phase 1 validation done — defer 30-2 |
| 2026-06-01 | — | **30-1c complete** — GAM learner voice guard + orientation evaluator (warn/test); floor **445** |

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

**Next (not implemented):** charter **30-2** `reasoning_contract`; optional Factory probe re-run post–30-1c.

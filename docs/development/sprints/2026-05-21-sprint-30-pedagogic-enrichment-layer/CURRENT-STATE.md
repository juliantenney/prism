# Sprint 30 — current state

**Date:** 2026-06-01  
**Pack path:** `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/`  
**Status:** **Phase 1 complete** (30-1 + 30-1b + 30-1c + Factory live validation P30-01/P30-02)

**Handover:** [`HANDOVER.md`](HANDOVER.md)  
**Charter:** [`sprint-30-charter.md`](sprint-30-charter.md)  
**First implementation slice:** [`slice-30-1-charter.md`](slice-30-1-charter.md)

---

## At a glance

| Item | State |
|------|--------|
| **30-0** Architecture + pack | **Complete** |
| **30-1** Orientation & narrative coherence (generation) | **Complete** |
| **30-1b** Renderer passthrough (orientation fields) | **Complete** |
| **30-1c** GAM learner voice guard + orientation evaluator (warn/test only) | **Complete** |
| **30-2** Reasoning & scaffolding | **Not started** |
| **30-3** Metacognition & synthesis | **Not started** |
| **Tests** | **445 passing** / 0 failing |
| **Runtime PEC code** | `orientation_contract` — DLA/Design Page prompts + passive HTML display; GAM self-directed voice guard (generation prompt only) |

---

## Programme context

| Prior sprint | Relevance to 30 |
|--------------|-----------------|
| [Sprint 28 cognition](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/) | Typed cognition fields + packs — **extend**, do not replace |
| [Sprint 29 renderer](../2026-05-21-sprint-29-renderer-cognition-semantics/) | `util-cognition*` display — **closed**; 30-1b adds orientation framing only |
| [Sprint 27 assessment](../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/) | Assessment semantics — **frozen** |
| May 2026 hotfixes | Self-directed framing, brief defaults, renderer kitchen-sink — **baseline** |

---

## Slice tracker

| Slice | Name | Status |
|-------|------|--------|
| 30-0 | Pack + PEC architecture docs | **Complete** |
| 30-1 | `orientation_contract` (generation) | **Complete** |
| 30-1b | Renderer passthrough (orientation fields) | **Complete** |
| 30-1c | GAM learner voice guard + orientation evaluator (warn/test) | **Complete** |
| 30-2 | `reasoning_contract` | Not started |
| 30-2b | GAM anti-redundancy (reasoning materials) | Not started |
| 30-3 | `metacognition_contract` + synthesis | Not started |
| 30-close | Evidence matrix + closure | Not started |

---

## 30-1 + 30-1b implementation summary

### Generation (30-1) — unchanged scope

- Resolver, prompt block, DLA/Design Page scaffolds, `SELF_DIRECTED_ACTIVITY_FRAMING_FIELD_IDS` preservation
- Runtime order: **cognition → self-directed → PEC**
- No topology, GAM PEC, cognition pack, or `applyWorkflowDesignHeuristics` changes

### Renderer (30-1b)

- **`renderActivityFramingForActivity`** — passive display when fields exist in activity JSON:
  - `study_orientation` — **Study orientation:** (`util-activity-study-orientation`)
  - `intellectual_frame` — **Intellectual frame:**
  - `intellectual_coherence_bridge` — **Connection to previous activity:**
- Renders **only when present**; no fallback or invented pedagogy
- Placed before **What to do** / main task content
- No changes to generation, composition merge, topology, GAM, PEC resolver, or cognition packs

**Tests:** `tests/workflow-pel-orientation.test.js`; renderer regressions in `tests/utility-renderer-kitchen-sink.test.js`, `tests/utility-self-directed-activity-framing.test.js`

**Fixtures:** `renderer-kitchen-sink-page.json` (KS-A6); `self-directed-activity-framing-page.json` (orientation fields on A2/A3)

### Stabilisation (30-1c)

- **`buildSelfDirectedGamLearnerVoicePromptBlock()`** — appended on self-directed learner-page **GAM** via `applySelfDirectedLearnerPageStepScaffoldsToDraft` (marker: `self-directed learner-page material voice (auto-applied)`).
- Forbids facilitator-facing labels and notes (“Facilitator use:”, “Teacher notes”, “Instructor guidance”, tutor/facilitator notes) and live classroom timing/choreography.
- Requires learner-facing alternatives (“Use this to…”, “Check your notes against…”, “Before moving on…”).
- **Facilitated/workshop GAM** is **not** constrained as self-directed (same gate as other self-directed GAM scaffolds).
- **`evaluatePelOrientationContractSatisfaction`** / **`evaluatePedagogicEnrichmentContractSatisfaction`** — lightweight **warn/test helper only** (`orientation_contract`); counts preambles, `study_orientation`, bridges on activities 2+, facilitator language (optional `gamText`). **Does not block runtime.**
- **No** renderer, topology, cognition-pack, new PEC, or `reasoning_contract` changes.

**Tests:** five additional cases in `tests/workflow-pel-orientation.test.js` (30-1c GAM voice + evaluator pass/fail + live Marx optional).

---

## Test coverage

| Track | Test file |
|-------|-----------|
| **PEL orientation (30-1 + 30-1c)** | `tests/workflow-pel-orientation.test.js` (11 tests) |
| **Renderer orientation (30-1b)** | `tests/utility-renderer-kitchen-sink.test.js`, `tests/utility-self-directed-activity-framing.test.js` |
| Self-directed framing adoption | `tests/workflow-self-directed-activity-framing-adoption.test.js` |
| Brief learner-resource defaults | `tests/workflow-brief-learner-resource-defaults.test.js` |
| Learner-page formatting | `tests/workflow-self-directed-learner-page-formatting.test.js` |
| RNA topology | `tests/workflow-ld-rna-sparse-brief-topology.test.js` |
| Cognition contracts | `tests/workflow-ld-cognition-contracts.test.js` |

**Command:** `node --test tests/*.test.js`

---

## Phase 1 live validation (2026-06-01)

- **Runner:** `context-files/sprint-30-probe-runner.js` → `live-artefacts/`, probe live notes updated.
- **Outcome:** Learner-page coherence **materially improved** vs `marx-dla-procedural-output.json` (preambles, bridges, study orientation on page).
- **Pre-30-1c residual (live artefacts unchanged):** Marx Factory run still had GAM “Facilitator use:” — **mitigated in code** by 30-1c prompt guard; re-run probes to confirm model compliance.
- **Ongoing:** `intellectual_frame` sparse; some orientation duplication (intro + A1); DLA step sometimes omits orientation fields (Design Page compensates).
- **See:** [`probe-p30-01-marx-live.md`](context-files/probe-p30-01-marx-live.md), [`probe-p30-02-rna-live.md`](context-files/probe-p30-02-rna-live.md), [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md).

## Resume

1. Charter **30-2** (`reasoning_contract`) when team accepts Phase 1 residual risk (model compliance, generic bridges).
2. Optional: re-run `sprint-30-probe-runner.js` post–30-1c to refresh live artefacts and confirm GAM voice guard in production prompts.
3. Do not add workflow steps or cognition packs without new charter.

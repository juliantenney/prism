# Sprint 30 — current state

**Date:** 2026-06-01  
**Pack path:** `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/`  
**Status:** **Phase 1 complete** · **Phase 2 closed / stable** (30-2 core + 30-2r + 30-2b + **30-2c** Design Page row sanitisation) — see [`slice-30-2-charter.md`](slice-30-2-charter.md), [`slice-30-2b-charter.md`](slice-30-2b-charter.md)

**Handover:** [`HANDOVER.md`](HANDOVER.md)  
**Charter:** [`sprint-30-charter.md`](sprint-30-charter.md)  
**Phase 1 slice:** [`slice-30-1-charter.md`](slice-30-1-charter.md)  
**Phase 2 slice:** [`slice-30-2-charter.md`](slice-30-2-charter.md) · [`slice-30-2b-charter.md`](slice-30-2b-charter.md)  
**Next:** Sprint 30 **Phase 3** chartering (`metacognition_contract`) — **not implementation**

---

## At a glance

| Item | State |
|------|--------|
| **30-0** Architecture + pack | **Complete** |
| **30-1** Orientation & narrative coherence (generation) | **Complete** |
| **30-1b** Renderer passthrough (orientation fields) | **Complete** |
| **30-1c** GAM learner voice guard + orientation evaluator (warn/test only) | **Complete** |
| **30-2** Reasoning & scaffolding (`reasoning_contract` core) | **Complete** |
| **30-2r** Reasoning field renderer passthrough | **Complete** |
| **30-2b** GAM facilitator leakage & anti-redundancy | **Complete** |
| **30-2c** Design Page activity-row facilitator sanitisation | **Complete** |
| **30-3** Metacognition & synthesis | **Not started** (chartering next) |
| **Tests** | **471 passing** / 0 failing |
| **Runtime PEC code** | `orientation_contract` + `reasoning_contract` — DLA/GAM generation; Design Page orientation PEC + reasoning field preservation; evaluators warn/test only |

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
| 30-2 | `reasoning_contract` (core) | **Complete** |
| 30-2r | Reasoning field renderer passthrough | **Complete** |
| 30-2b | GAM facilitator leakage & anti-redundancy | **Complete** |
| 30-2c | Design Page activity-row facilitator sanitisation | **Complete** |
| 30-3 | `metacognition_contract` + synthesis | Not started (chartering) |
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

### Phase 2 core (30-2)

- **`reasoning_contract`** — `resolvePedagogicEnrichmentContractIds` returns **`["orientation_contract", "reasoning_contract"]`** when the Phase 1 self-directed learner-page gate passes; facilitated/workshop/peer → `[]`.
- **DLA + GAM:** `buildPelReasoningContractPromptBlock()` via `applyPedagogicEnrichmentContractScaffoldToDraft`; GAM also gets `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` (worked micro-examples, evidence spans, static generative retrieval). Reuses **30-1c** learner voice guard.
- **Design Page:** preserves reasoning field ids in the preservation block; **does not** receive the reasoning PEC prompt block (orientation PEC only).
- **Fields:** `reasoning_orientation`, `evidence_use_prompt`, `argument_structure_hint`, `self_explanation_prompt`, `disciplinary_lens`, `conceptual_contrast_prompt` — reasoning prose must explain **HOW TO THINK**, not restate `learner_task` / orientation fields.
- **`evaluatePelReasoningContractSatisfaction`** — warn/test only; routed by `evaluatePedagogicEnrichmentContractSatisfaction`. **No runtime blocking.**
- **No** topology, renderer, cognition-pack, `metacognition_contract`, or adaptive tutoring changes.

**Renderer visibility (30-2r — R30-010):**

| Field | Learner-visible? | Render path |
|-------|------------------|-------------|
| `reasoning_orientation` | Yes | “How to think:” (`util-pel-reasoning-cue`) |
| `self_explanation_prompt` | Yes | `util-cognition--explain` |
| `disciplinary_lens` | Yes | “Disciplinary lens:” (`util-pel-orientation-cue`) |
| `evidence_use_prompt` | Yes | “Using evidence:” |
| `argument_structure_hint` | Yes | “Structuring your response:” |
| `conceptual_contrast_prompt` | Yes | “Key distinction:” |

Passive passthrough only — renderer does not infer, generate, or transform reasoning prose (R30-010). **GAP-30-13 closed.**

**Tests:** `tests/workflow-pel-reasoning.test.js` (12 tests); `utility-renderer-kitchen-sink.test.js` + `utility-self-directed-activity-framing.test.js` (30-2r label/order/dedupe).

### Renderer (30-2r)

- **`renderActivityFramingForActivity`** extended — reuses `pushPelOrientationCue` / dedupe; no new PEC, prompt, evaluator, GAM, topology, cognition-pack, or workflow changes.
- Order: … prior knowledge → **Disciplinary lens** → **How to think** → **Using evidence** → **Structuring your response** → **Key distinction** → **What to do**.
- **Fixtures:** `renderer-kitchen-sink-page.json` (KS-A7); `self-directed-activity-framing-page.json` (A3 reasoning fields).

### GAM stabilisation (30-2b — R30-011)

- **Prompt hardening:** `buildSelfDirectedGamLearnerVoicePromptBlock()` and `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` — explicit forbid of facilitator headings (incl. Tutor guidance), classroom choreography, and restating `learner_task` / preamble / `reasoning_orientation` / PEL reasoning fields; preserve worked micro-examples, evidence tables, retrieval prompts, comparison scaffolds.
- **Legacy cognition GAM wording:** cognition contract block no longer says “after Facilitator use”; learner-facing Cognition cues only.
- **Narrow sanitizer:** `sanitizeSelfDirectedGamMaterialsOutput()` — **self-directed learner-page GAM only** (same gate as 30-1c GAM scaffolds); strips facilitator-facing headings and short following blocks; optional paragraph dedupe vs upstream activity fields; **does not rewrite** learner-facing pedagogy.
- **Runtime:** `sanitizeWorkflowRunCapturedOutputForStep` on workflow run capture; probe runner sanitizes GAM text post-generation.
- **`evaluatePelGamMaterialStabilisation`** — warn/test only; no runtime blocking.
- **GAP-30-10 closed** for GAM materials (Factory P30-01/P30-02 re-run: `facilitatorUse: false`, 0× `Facilitator use:` in saved artefacts).

**Tests:** five additional cases in `tests/workflow-pel-reasoning.test.js` (30-2b); fixture `gam-marx-facilitator-leak.txt`.

### Design Page row sanitisation (30-2c — R30-012)

- **`sanitizeSelfDirectedLearnerPageActivityRows(page, context)`** — applied via `applySelfDirectedLearnerPageActivityRowSanitizationToComposedPage` at end of `applyPedagogicCognitionSemanticsToComposedPage` (after composition merge, before render/export).
- **Gate:** `page_profile === learner` + self-directed delivery (`self_directed` / `online_async` / `async`) + **not** facilitated/workshop/seminar brief intent (`isWorkflowBriefFacilitatedDeliveryIntent` off).
- **Removed row fields:** `facilitator_notes`, `facilitator_note`, `facilitator_moves`, `teacher_notes`, `instructor_guidance`, `tutor_guidance`.
- **`support_note` / `support_notes`:** preserved unless `pelPageSupportNoteLooksFacilitatorChoreography` matches (facilitator/tutor language, circulate, pairs/small groups, minute ranges, during class, etc.). Learner hints (“If you are stuck…”, “Before moving on…”) are kept.
- **Facilitated/workshop pages:** sanitizer **no-op** — unchanged behaviour.
- **Design Page `facilitator_notes` risk closed** for self-directed learner pages (deterministic hardening even when Design Page invents tutor fields).
- **Probe runner:** `auditLearnerPageActivityRowSanitization` — asserts no `facilitator_notes` / choreographic `support_note` on activity rows and no Support note HTML from stripped aliases.

**Tests:** five additional cases in `tests/workflow-pel-reasoning.test.js` (30-2c); Marx live page fixture validation.

---

## Test coverage

| Track | Test file |
|-------|-----------|
| **PEL orientation (30-1 + 30-1c)** | `tests/workflow-pel-orientation.test.js` (11 tests) |
| **PEL reasoning (30-2 + 30-2b + 30-2c)** | `tests/workflow-pel-reasoning.test.js` (22 tests) |
| **Renderer orientation (30-1b)** | `tests/utility-renderer-kitchen-sink.test.js`, `tests/utility-self-directed-activity-framing.test.js` |
| **Renderer reasoning (30-2r)** | same kitchen-sink + framing tests (KS-A7, A3 reasoning cues) |
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
- **Post–30-2b Factory re-run (2026-06-01):** GAM materials sanitized — **no** `Facilitator use:` in `marx-activity-materials.txt` / `rna-activity-materials.txt`; reasoning tables and worked examples retained.
- **Ongoing:** `intellectual_frame` sparse; some orientation duplication (intro + A1); DLA step sometimes omits orientation fields (Design Page compensates).
- **See:** [`probe-p30-01-marx-live.md`](context-files/probe-p30-01-marx-live.md), [`probe-p30-02-rna-live.md`](context-files/probe-p30-02-rna-live.md), [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md).

## Phase 2 closure (2026-06-01)

Phase 2 is **closed and stable**: `reasoning_contract` generation (30-2), reasoning renderer passthrough (30-2r), GAM materials stabilisation (30-2b), and Design Page activity-row sanitisation (30-2c). Facilitator leakage paths for self-directed learner pages are addressed at **GAM text** and **composed page row** layers without renderer or topology changes.

**Residual (Phase 3 / chartering scope):** sparse `intellectual_frame`, DLA field compliance gaps, `argument_structure_hint` on some live DLAs — not facilitator row leakage.

## Resume

1. **Charter Sprint 30 Phase 3** (`metacognition_contract`) — planning and slice charter only; **do not implement** until chartered.
2. Optional: Factory re-run `sprint-30-probe-runner.js` to refresh `pageRowSanitization` capture lines in probe notes.
3. Do not add workflow steps or cognition packs without new charter.

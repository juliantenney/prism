# Pedagogic Enrichment Contract (PEC) registry — Sprint 30

**Status:** `orientation_contract` and `reasoning_contract` **implemented** in `app.js` (30-1–30-1c + 30-2 core + **30-2r** renderer + **30-2b** GAM stabilisation). `metacognition_contract` and full `disciplinary_thinking_contract` remain spec-only.

**Charter reference:** [`sprint-30-charter.md`](sprint-30-charter.md) §5

---

## Registry overview

| PEC id | Phase | Status | Primary steps |
|--------|-------|--------|---------------|
| `orientation_contract` | 30-1 / 30-1b | **Implemented** (generation + renderer) | DLA, Design Page |
| `reasoning_contract` | 30-2 core + 30-2r | **Implemented** (generation + passive render) | DLA, GAM |
| `disciplinary_thinking_contract` | 30-2/30-3 | Spec only | DLA, GAM, Design Page |
| `metacognition_contract` | 30-3 | Spec only | DLA, GAM, Design Page |

**30-1 exclusions (unchanged for PEC scope):** GAM does **not** receive `buildPelOrientationContractPromptBlock` (orientation PEC fields remain DLA/Design Page). **30-1c** adds self-directed **GAM material voice** scaffold only (not a new PEC). **30-1b** added renderer only. No topology, cognition-pack, or `reasoning_contract` changes in 30-1c.

---

## Activation signals (implemented — 30-1 + 30-2)

`resolvePedagogicEnrichmentContractIds(context)` returns **`["orientation_contract", "reasoning_contract"]`** when **all** of:

1. Brief is **not** facilitated (`isWorkflowBriefFacilitatedDeliveryIntent` === false)
2. `shouldApplySelfDirectedLearnerPageScaffoldBase` === true (self-directed delivery + learner-page output signals — same gate as self-directed material-shape scaffolds)

Otherwise returns `[]`.

**Explicit exclusions (tested):** workshop with small-group discussion, facilitated F2F workshop, peer instruction / seminar briefs.

**Transcript self-study:** `provided_source_content` does **not** block activation (RNA probe path).

---

## Runtime composition (implemented)

`applyWorkflowStepRuntimePromptAugmentations` order:

1. Cognition contract scaffold (`applyPedagogicCognitionContractScaffoldToDraft`)
2. Self-directed learner-page scaffolds (`applySelfDirectedLearnerPageStepScaffoldsToDraft`)
3. PEC scaffold (`applyPedagogicEnrichmentContractScaffoldToDraft`)

No workflow topology changes. `applyWorkflowDesignHeuristics` unchanged.

---

## `orientation_contract`

**Purpose:** Situate independent learners — purpose, sequence, effort, intellectual frame.

| Field id | Scope | Required in 30-1? | Sprint 28 overlap |
|----------|-------|-------------------|-------------------|
| `study_orientation` | First activity (multi-activity page) | Prompt contract | — |
| `activity_preamble` | Activity | Strengthen existing (self-directed scaffold) | **Yes** — extend, do not rename |
| `intellectual_frame` | Page or first activity | Optional (prompt) | — |
| `intellectual_coherence_bridge` | Between activities | Prompt on activities after first | — |
| `prior_knowledge_activation` | Activity | Optional | **Yes** — same key as 28 |

**Prompt block:** `buildPelOrientationContractPromptBlock()` — marker `Pedagogic enrichment — orientation contract (auto-applied):`

**Anti-patterns (prompt):** “Welcome to this module”, “In this session”, timing choreography (e.g. “minutes 5–15”).

**Preservation (30-1):** Orientation field ids appended to `SELF_DIRECTED_ACTIVITY_FRAMING_FIELD_IDS`; DLA OUTPUT CONTRACT override; Design Page field-preservation block.

**Renderer (30-1b — complete):** `renderActivityFramingForActivity` passively displays orientation fields when present in activity JSON:

| Field | Label | Markup |
|-------|-------|--------|
| `study_orientation` | Study orientation | `util-activity-study-orientation` (+ preamble styling) |
| `intellectual_frame` | Intellectual frame | `util-pel-orientation-cue` |
| `intellectual_coherence_bridge` | Connection to previous activity | `util-pel-orientation-cue` |

Display order: study orientation → intellectual frame → coherence bridge → `activity_preamble` → prior-knowledge / reasoning cues. **No fallback text** — renderer does not invent pedagogy (R30-006).

### GAM material voice (30-1c + 30-2b — not a PEC)

Self-directed learner-page **GAM** runs append `buildSelfDirectedGamLearnerVoicePromptBlock()` via `applySelfDirectedLearnerPageStepScaffoldsToDraft` (same gate as table-row / reading sufficiency scaffolds). **30-2b** extends the block and adds post-generation sanitisation (R30-011).

| Rule | Detail |
|------|--------|
| Forbid | “Facilitator use:”, “Teacher notes”, “Instructor guidance”, “Tutor guidance”, tutor/facilitator notes; live session timing/choreography; restating `learner_task`, preamble, `reasoning_orientation` in material prose |
| Prefer | “Use this to…”, “Check your notes against…”, “Before moving on…”, “How to use this resource:” |
| Preserve | Worked micro-examples, evidence tables, comparison scaffolds, static retrieval prompts |
| Facilitated GAM | **Excluded** — workshop/facilitated briefs do not get this block or sanitiser |

Marker: `Self-directed learner-page material voice (auto-applied):`

### GAM material stabilisation (30-2b — not a PEC)

| Function | Role |
|----------|------|
| `sanitizeSelfDirectedGamMaterialsOutput(text, context)` | Strips forbidden facilitator headings + short following blocks; optional dedupe vs upstream activity fields; **does not rewrite** learner pedagogy |
| `shouldSanitizeSelfDirectedGamMaterialsOutput(context)` | Gate: self-directed learner-page GAM only |
| `evaluatePelGamMaterialStabilisation(gamText, options)` | Warn/test — facilitator labels + redundancy vs upstream activities |
| `sanitizeWorkflowRunCapturedOutputForStep(raw, stepContext)` | Applied on workflow run capture paste |

**Cognition GAM scaffold (30-2b):** learner-facing “Cognition cues” — no “after Facilitator use” wording.

### Design Page row sanitisation (30-2c — not a PEC)

| Function | Role |
|----------|------|
| `sanitizeSelfDirectedLearnerPageActivityRows(page, context)` | Strips facilitator row fields and choreographic `support_note` on `learning_activities` rows |
| `shouldSanitizeSelfDirectedLearnerPageActivityRows(page, context)` | Gate: `page_profile === learner` + self-directed delivery + not facilitated/workshop brief |
| `pelPageSupportNoteLooksFacilitatorChoreography(text)` | Removes `support_note` / `support_notes` only when tutor/choreography language detected |
| `applySelfDirectedLearnerPageActivityRowSanitizationToComposedPage(page, options)` | Called at end of `applyPedagogicCognitionSemanticsToComposedPage` (before render/export) |

**Removed fields:** `facilitator_notes`, `facilitator_note`, `facilitator_moves`, `teacher_notes`, `instructor_guidance`, `tutor_guidance`.

**Preserved:** learner-facing `support_note` (e.g. “If you are stuck…”, “Before moving on…”). **Facilitated/workshop pages:** no-op.

**Probe:** `auditLearnerPageActivityRowSanitization` in `sprint-30-probe-runner.js`.

### Orientation compliance evaluator (30-1c — warn/test only)

| Function | Role |
|----------|------|
| `evaluatePelOrientationContractSatisfaction(output, options)` | Counts `activity_preamble` on all activities; `study_orientation` on page or activities; `intellectual_coherence_bridge` on activities 2+ (≥1 when applicable); flags facilitator-facing language (incl. optional `gamText`) |
| `evaluatePedagogicEnrichmentContractSatisfaction(output, options)` | Routes `orientation_contract` to evaluator above |

**Does not block runtime generation.** Intended for tests, exports, and probe analysis.

---

## `reasoning_contract`

**Purpose:** Make disciplinary thinking explicit in tasks and materials — **HOW TO THINK**, not a restatement of `learner_task`, `activity_preamble`, `study_orientation`, or `intellectual_frame`.

| Field id | Scope | Notes |
|----------|-------|-------|
| `reasoning_orientation` | Activity | What kind of thinking is required (1–2 sentences, topic-specific) |
| `evidence_use_prompt` | Activity | Source/transcript activities — how to use evidence |
| `argument_structure_hint` | Activity | Claim → evidence → implication |
| `self_explanation_prompt` | Activity | **Reuse Sprint 28** — generative retrieval |
| `disciplinary_lens` | Page / first activity | Short tag-like lens — do not duplicate `intellectual_frame` |
| `conceptual_contrast_prompt` | Activity | Compare/distinguish/misconception repair |

**Prompt block:** `buildPelReasoningContractPromptBlock()` — marker `Pedagogic enrichment — reasoning contract (auto-applied):`

**GAM materials (30-2):** `buildSelfDirectedGamPelReasoningMaterialPromptBlock()` — worked micro-examples, evidence spans, static “before you re-read” retrieval; reuses 30-1c learner voice guard.

**Steps:** PEC scaffold on **DLA** and **GAM** only. **Design Page** preserves reasoning field ids; does **not** append reasoning PEC block.

**Anti-patterns (prompt):** “Think critically”, Socratic loops, facilitator voice, duplicating `learner_task`, scaffold explosion — mitigated by 30-2b prompts + sanitiser (GAP-30-10 closed).

**Evaluator (30-2 — warn/test only):** `evaluatePelReasoningContractSatisfaction` — presence/quality, source evidence, compare/contrast fields, generic phrasing, duplication vs `learner_task`, facilitator language. Routed via `evaluatePedagogicEnrichmentContractSatisfaction` when `contractId: "reasoning_contract"`.

**Renderer visibility (R30-009, R30-010):**

| Field | Render path | Label |
|-------|-------------|-------|
| `reasoning_orientation` | `renderActivityFramingForActivity` — `util-pel-reasoning-cue` | How to think: |
| `self_explanation_prompt` | `util-cognition--explain` | Reflect |
| `disciplinary_lens` | `renderActivityFramingForActivity` — `util-pel-orientation-cue` | Disciplinary lens: |
| `evidence_use_prompt` | same | Using evidence: |
| `argument_structure_hint` | same | Structuring your response: |
| `conceptual_contrast_prompt` | same | Key distinction: |

**30-2r:** Passive passthrough only when field present in activity JSON — no inference, generation, fallback text, or field transformation (R30-010). Dedupe via `comparableSeen` when cues substantially overlap.

---

## `metacognition_contract`

**Purpose:** Self-regulation without tutoring tone.

| Field id | Scope | Notes |
|----------|-------|-------|
| `comprehension_check_prompt` | Activity | Before moving on |
| `monitoring_prompt` | Activity | If stuck |
| `study_strategy_note` | Page | Notebook, spacing, self-test |
| `transfer_or_application_task` | Activity | **Reuse Sprint 28 key** |

**Prompt block id (planned):** `pel_metacognition_contract_v1`

---

## `disciplinary_thinking_contract`

**Purpose:** Domain-appropriate inquiry norms.

| Field id | Scope | Notes |
|----------|-------|-------|
| `disciplinary_lens` | Page / activity | Named mode of inquiry (**also in `reasoning_contract`**) |
| `source_handling_note` | Activity | Transcript / extract reading |
| `synthesis_prompt` | Page tail | Integrate across activities |
| `intellectual_coherence_bridge` | Activity | Link to prior activity |

**Prompt block id (planned):** `pel_disciplinary_thinking_contract_v1`

---

## Composition rules

1. **Precedence:** `orientation_contract` fields apply before task execution in page order; bridges link activities.
2. **No duplicate prose:** If `activity_preamble` satisfies orientation, do not also emit empty `study_orientation`.
3. **Namespace:** New PEC-only fields must be listed here before code; never collide with assessment item keys.
4. **Renderer:** Orientation fields use activity-framing util blocks (see 30-1b table above). Reasoning PEC fields use the same cue pattern (30-2r). Cognition pack fields continue via `util-cognition` (see [`context-files/sprint-28-29-boundaries.md`](context-files/sprint-28-29-boundaries.md)).

---

## `app.js` symbols

| Symbol | Role | Status |
|--------|------|--------|
| `SPRINT_30_PEC_IDS` | Active PEC id list | **Implemented** |
| `SPRINT_30_PEC_ORIENTATION_CONTRACT_ID` | `"orientation_contract"` | **Implemented** |
| `PEL_ORIENTATION_FIELD_IDS` | Orientation field id list | **Implemented** |
| `resolvePedagogicEnrichmentContractIds` | Resolver from brief + resolved factors | **Implemented** |
| `buildPelOrientationContractPromptBlock` | Orientation prompt block | **Implemented** |
| `SPRINT_30_PEC_REASONING_CONTRACT_ID` | `"reasoning_contract"` | **Implemented** |
| `PEL_REASONING_FIELD_IDS` | Reasoning field id list | **Implemented** |
| `buildPelReasoningContractPromptBlock` | Reasoning PEC prompt block | **Implemented** |
| `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | GAM reasoning materials (30-2) | **Implemented** |
| `applyPedagogicEnrichmentContractScaffoldToDraft` | Append PEC blocks per step | **Implemented** (orientation: DLA + Design Page; reasoning: DLA + GAM) |
| `buildSelfDirectedGamLearnerVoicePromptBlock` | GAM self-directed material voice (30-1c + 30-2b hardening) | **Implemented** |
| `sanitizeSelfDirectedGamMaterialsOutput` | GAM post-generation sanitiser (30-2b) | **Implemented** |
| `shouldSanitizeSelfDirectedGamMaterialsOutput` | GAM sanitiser gate (30-2b) | **Implemented** |
| `evaluatePelGamMaterialStabilisation` | GAM stabilisation rubric — warn/test only (30-2b) | **Implemented** |
| `evaluatePelOrientationContractSatisfaction` | Orientation rubric — warn/test only (30-1c) | **Implemented** |
| `evaluatePelReasoningContractSatisfaction` | Reasoning rubric — warn/test only (30-2) | **Implemented** |
| `evaluatePedagogicEnrichmentContractSatisfaction` | PEC router (orientation + reasoning) | **Implemented** |
| `mergePedagogicEnrichmentFieldsIntoPageActivities` | Design Page composition merge | Not implemented |

Exported via `__PRISM_TEST_API` (30-1 + 30-1c + 30-2 symbols above).

**Tests:** `tests/workflow-pel-orientation.test.js` (**11**); `tests/workflow-pel-reasoning.test.js` (**17** — includes 30-2b); renderer: `utility-renderer-kitchen-sink.test.js`, `utility-self-directed-activity-framing.test.js` (30-1b orientation + 30-2r reasoning)

---

## Relationship to Sprint 28 cognition packs

| Sprint 28 | Sprint 30 PEC |
|-----------|---------------|
| Pack-based (`peer_instruction_pack`, …) | Profile-based (self-directed learner page) |
| `resolvePedagogicCognitionPackIds` | `resolvePedagogicEnrichmentContractIds` |
| Typed DLA/GAM cognition fields | Broader orientation / coherence fields |

**Rule:** One prompt pipeline — PEC blocks append **after** cognition and self-directed scaffolds; order documented in [`context-files/app-generation-hooks.md`](context-files/app-generation-hooks.md).

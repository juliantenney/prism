# Pedagogic Enrichment Contract (PEC) registry — Sprint 30

**Status:** Architecture definition (30-0). **Not implemented** in `app.js` until 30-1 slice.

**Charter reference:** [`sprint-30-charter.md`](sprint-30-charter.md) §5

---

## Registry overview

| PEC id | Phase | Status | Primary steps |
|--------|-------|--------|---------------|
| `orientation_contract` | 30-1 | Spec only | DLA, Design Page |
| `reasoning_contract` | 30-2 | Spec only | DLA, GAM |
| `disciplinary_thinking_contract` | 30-2/30-3 | Spec only | DLA, GAM, Design Page |
| `metacognition_contract` | 30-3 | Spec only | DLA, GAM, Design Page |

---

## Activation signals (resolver design — planned)

A PEC activates when **all** of:

1. Brief is **not** facilitated (`isWorkflowBriefFacilitatedDeliveryIntent` === false), **or** PEC has a facilitated variant (none in 30-0)
2. `delivery_context` is `self_directed` or `online_async`, **or** learner-page signals (`page_profile: learner`, `session_materials` includes `page`)
3. PEC-specific signals (e.g. `provided_source_content` for `disciplinary_thinking_contract` source handling)

**Explicit exclusions:** workshop, seminar, peer instruction with revision, facilitator guide briefs.

---

## `orientation_contract`

**Purpose:** Situate independent learners — purpose, sequence, effort, intellectual frame.

| Field id | Scope | Required in 30-1? | Sprint 28 overlap |
|----------|-------|-------------------|-------------------|
| `study_orientation` | Page section or first activity | TBD in 30-1 charter | — |
| `activity_preamble` | Activity | Strengthen existing | **Yes** — extend, do not rename |
| `intellectual_frame` | Page or activity | Optional | — |
| `intellectual_coherence_bridge` | Between activities | Optional | — |
| `prior_knowledge_activation` | Activity | Optional | **Yes** — same key as 28 |

**Prompt block id (planned):** `pel_orientation_contract_v1`

---

## `reasoning_contract`

**Purpose:** Make disciplinary thinking explicit in tasks and materials.

| Field id | Scope | Notes |
|----------|-------|-------|
| `reasoning_orientation` | Activity | What kind of thinking is required |
| `evidence_use_prompt` | Activity / material | Source-based briefs |
| `argument_structure_hint` | Activity | Claim → evidence → implication |
| `self_explanation_prompt` | Activity | **Reuse Sprint 28 key** |

**Prompt block id (planned):** `pel_reasoning_contract_v1`

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
| `disciplinary_lens` | Page / activity | Named mode of inquiry |
| `source_handling_note` | Activity | Transcript / extract reading |
| `synthesis_prompt` | Page tail | Integrate across activities |
| `intellectual_coherence_bridge` | Activity | Link to prior activity |

**Prompt block id (planned):** `pel_disciplinary_thinking_contract_v1`

---

## Composition rules

1. **Precedence:** `orientation_contract` fields apply before task execution in page order; bridges link activities.
2. **No duplicate prose:** If `activity_preamble` satisfies orientation, do not also emit empty `study_orientation`.
3. **Namespace:** New PEC-only fields must be listed here before code; never collide with assessment item keys.
4. **Renderer:** Each field needs a planned util block or explicit reuse of `util-cognition` / card subheading (see [`context-files/sprint-28-29-boundaries.md`](context-files/sprint-28-29-boundaries.md)).

---

## Planned `app.js` symbols (30-1+)

| Symbol | Role |
|--------|------|
| `SPRINT_30_PEC_REGISTRY` | Static contract metadata |
| `resolvePedagogicEnrichmentContractIds` | Resolver from brief + resolved factors |
| `applyPedagogicEnrichmentContractScaffoldToDraft` | Append prompt blocks per step |
| `evaluatePedagogicEnrichmentContractSatisfaction` | Test/monitoring heuristic (optional) |
| `mergePedagogicEnrichmentFieldsIntoPageActivities` | Design Page composition merge |

Export via `__PRISM_TEST_API` when implemented.

---

## Relationship to Sprint 28 cognition packs

| Sprint 28 | Sprint 30 PEC |
|-----------|---------------|
| Pack-based (`peer_instruction_pack`, …) | Profile-based (self-directed learner page) |
| `resolvePedagogicCognitionPackIds` | `resolvePedagogicEnrichmentContractIds` (planned) |
| Typed DLA/GAM cognition fields | Broader orientation / coherence fields |

**Rule:** One prompt pipeline — PEC blocks append **after** cognition and self-directed scaffolds; order documented in [`context-files/app-generation-hooks.md`](context-files/app-generation-hooks.md).

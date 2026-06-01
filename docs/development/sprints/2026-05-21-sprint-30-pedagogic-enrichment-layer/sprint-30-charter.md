# Sprint 30 — Pedagogic Enrichment Layer (PEL)

**Pack path:** `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/`  
**Status:** **Initialised** (30-0 pack complete; implementation not started)  
**Date:** 2026-05-21  
**Mode:** Bounded enrichment — **no** workflow expansion, **no** adaptive tutoring, **no** orchestration redesign

**New chat:** [`HANDOVER.md`](HANDOVER.md) · **Index:** [`sprint-30-index.md`](sprint-30-index.md) · **Status:** [`CURRENT-STATE.md`](CURRENT-STATE.md)

---

## 1. Sprint purpose

Sprint 30 deepens the **pedagogical richness** of Prism **self-directed learner-page** outputs while preserving workflow stability and the existing E → O → G → C → R architecture.

Prism should move further toward:

- **Independent higher-education study** quality
- **Notebook-and-pencil** intellectual work (structured tasks, not chat tutoring)
- **Disciplinary reasoning** and **intellectual coherence**
- **Learner orientation** and **metacognitive support**

without becoming an **AI tutor**, an **adaptive engine**, or a **workflow orchestration** sprint.

**Strategic formulation:**

> Prism is **AI-supported pedagogic design infrastructure for independent learning** — not conversational tutoring.

---

## 2. Architectural constraints (non-negotiable)

| Preserve | Do not change in Sprint 30 |
|----------|----------------------------|
| Workflow step set and topology | No new workflow steps |
| Orchestration model (`applyWorkflowDesignHeuristics`, trigger rules) | No orchestration redesign |
| Renderer philosophy (passive presentation of upstream JSON) | No renderer-generated pedagogy |
| Brief → resolved factors → step prompts pipeline | No major schema instability |
| Self-directed learner-page strategic direction | No return to classroom-default bias |
| Sprint 28 cognition field names (where already shipped) | No new cognition ontology without charter |
| Sprint 29 renderer scope (closed) | Do not reopen R-layer semantics sprint |

**Layer touch policy:**

| Layer | Sprint 30 may touch |
|-------|---------------------|
| **E** (brief extraction / resolution) | Only if bounded alignment (e.g. learner-resource defaults already hotfixed) |
| **O** (topology) | **No** — frozen |
| **G** (DLA / GAM / GAI prompts, contracts) | **Yes** — primary enrichment surface |
| **C** (Design Page composition) | **Yes** — preservation and field passthrough only |
| **R** (renderer) | **Minimal** — display new learner-facing fields if already in JSON; no pedagogy invention |

---

## 3. Implementation boundaries

**In scope (when implementation begins):**

- **Pedagogic Enrichment Contracts (PECs)** — lightweight, compositional, generation-layer enrichments (see §5)
- Prompt scaffolds and OUTPUT CONTRACT extensions for self-directed learner pages
- Optional activity/page fields that improve orientation, reasoning, and metacognition
- Regression tests on fixtures (Marx, RNA transcript, kitchen-sink) — generation quality and preservation
- Domain-pack `defaultPromptNotes` alignment where generation quality depends on it

**Out of scope:**

- Adaptive tutoring, conversational AI, learner modelling at runtime
- Autonomous pedagogic narration engines
- New workflow steps (e.g. “Enrich Pedagogy”, “Generate Reflection Layer”)
- Illustration / diagram generation pipelines
- LMS integration, branching UI, interactive sequencing
- Broad renderer redesign (Sprint 29 closed)
- Reopening Sprint 28 pack/factor ontology without explicit slice charter

---

## 4. Phase structure

Sprint 30 is organised in **three implementation phases**. Each phase adds optional PEC modules; phases are **cumulative** but **independently testable**.

| Phase | Name | Primary PEC families |
|-------|------|----------------------|
| **30-1** | Orientation & narrative coherence | `orientation_contract` |
| **30-2** | Reasoning & scaffolding | `reasoning_contract`, partial `disciplinary_thinking_contract` |
| **30-3** | Metacognitive regulation & synthesis | `metacognition_contract`, synthesis elements of `disciplinary_thinking_contract` |

Detailed phase definitions: **§6**.

---

## 5. Pedagogic Enrichment Contracts (PECs)

### 5.1 Definition

A **Pedagogic Enrichment Contract (PEC)** is a **lightweight, compositional, learner-facing, generation-layer** specification that:

- **Enriches** existing activities and page sections — it does not replace DLA/GAM/Design Page steps
- Remains **optional** — activated by brief signals, `delivery_context`, or explicit pack flags
- Attaches to **prompt augmentation** (like Sprint 28 cognition contracts and self-directed OUTPUT CONTRACT)
- Produces **inspectable JSON / markdown** in named fields — not renderer-invented prose
- Preserves **workflow stability** — no new steps, no runtime branching

PECs are **not**:

- Tutoring dialogues
- Adaptive feedback engines
- Orchestration rules that add/remove workflow steps
- Renderer templates that generate pedagogy when upstream fields are empty

### 5.2 Composition model

```
Brief signals + resolved factors
        ↓
PEC resolver (which contracts apply?)
        ↓
Prompt blocks appended to DLA / GAM / Design Page (per step)
        ↓
Generated artefacts (activities, materials, page JSON)
        ↓
Renderer displays present fields only (passive)
```

Multiple PECs may apply to one workflow (e.g. orientation + reasoning for a transcript self-study page). Contracts must declare **non-conflicting field namespaces** and **precedence** when two contracts suggest similar content.

### 5.3 Candidate PEC categories (architecture only — not implemented in 30-0)

#### `orientation_contract`

**Purpose:** Help independent learners **situate** the study session — what this page is for, how to work through it, what prior knowledge is assumed, how long it may take.

**Candidate fields (illustrative):**

| Field | Level | Pedagogic role |
|-------|-------|----------------|
| `study_orientation` | Page or activity | 2–4 sentences: purpose, sequence, expected effort |
| `prior_knowledge_activation` | Activity | Brief recall bridge (extends Sprint 28 naming where present) |
| `intellectual_frame` | Page section | Disciplinary lens (“you are thinking as a historian / biologist…”) |

**Constraints:** No facilitator choreography; no live-session timing. Wording must suit **solo study**.

#### `reasoning_contract`

**Purpose:** Make **disciplinary thinking visible** — compare, explain, justify, apply evidence, structure arguments.

**Candidate fields:**

| Field | Level | Pedagogic role |
|-------|-------|----------------|
| `reasoning_orientation` | Activity | What kind of thinking the task requires |
| `evidence_use_prompt` | Activity / material | How to use supplied sources or data |
| `argument_structure_hint` | Activity | Short scaffold for claim → evidence → implication |
| `self_explanation_prompt` | Activity | (Align with Sprint 28 — do not duplicate blindly) |

**Constraints:** Prompts must be **topic-specific**, not generic “think critically”. No Socratic chat loops.

#### `metacognition_contract`

**Purpose:** Support **regulation of learning** — monitoring understanding, identifying gaps, planning next steps.

**Candidate fields:**

| Field | Level | Pedagogic role |
|-------|-------|----------------|
| `comprehension_check_prompt` | Activity | “Before moving on, can you explain…” |
| `monitoring_prompt` | Activity | What to notice if stuck |
| `study_strategy_note` | Page | How to use notebook, spacing, self-testing |
| `transfer_or_application_task` | Activity | (Align with Sprint 28 — extend carefully) |

**Constraints:** Metacognition supports **independent study**, not tutor check-ins.

#### `disciplinary_thinking_contract`

**Purpose:** Encode **domain-appropriate** reasoning norms (source criticism in history, mechanism in biology, policy trade-offs in social science).

**Candidate fields:**

| Field | Level | Pedagogic role |
|-------|-------|----------------|
| `disciplinary_lens` | Page / activity | Named mode of inquiry |
| `source_handling_note` | Activity (source-based briefs) | How to read transcript/extracts |
| `synthesis_prompt` | Page tail | Integrate across activities without new tasks |
| `intellectual_coherence_bridge` | Between activities | One sentence linking prior activity to next |

**Constraints:** Must not require facilitator or peer dialogue unless brief explicitly facilitated (then PECs should **not** activate self-study variants).

### 5.4 Relationship to Sprint 28 cognition work

| Sprint 28 (shipped) | Sprint 30 PEL (planned) |
|--------------------|-------------------------|
| Cognition **packs** (`peer_instruction_pack`, `self_study_cognition_pack`, …) | **Cross-cutting enrichment** for self-directed **pages**, not pack proliferation |
| Typed DLA/GAM **contracts** for pack fields | **PEC modules** composable by brief profile |
| Factors: `reasoning_revision_required`, `cognitive_engagement_required`, … | **Orientation / coherence** not fully covered by 28 |
| Dialogic / workshop probes | **Independent study** probes (Marx, RNA transcript) |

**Rule:** Extend Sprint 28 fields where they already exist; add new PEC fields only with explicit namespace and renderer passthrough plan. Do not rename shipped fields.

### 5.5 Relationship to self-directed learner-page direction

Recent stabilisation (2026-05-21) established:

- Runtime **OUTPUT CONTRACT** on DLA/GAM for self-directed learner pages
- `activity_preamble`, cognition-orientation fields, timeline sequencing alignment
- Brief resolution defaults for **learner-resource** workflows (`self_directed`, not `classroom`)
- Renderer kitchen-sink stabilisation (presentation only)

Sprint 30 **builds on** that trajectory: generation quality and **intellectual coherence** of the **whole page**, not more orchestration.

---

## 6. Phase definitions

### Phase 1 — Orientation & narrative coherence (30-1)

**Goals**

- Learners understand **why** they are studying this page and **how** to proceed
- Activities read as parts of a **coherent narrative**, not isolated worksheets
- Page-level and activity-level orientation without facilitator voice

**Candidate fields**

- `study_orientation`, `intellectual_frame`, `activity_preamble` (strengthen existing), `intellectual_coherence_bridge`

**Pedagogic purpose**

Reduce **cognitive overhead** at session start; support **independent pacing**.

**Architectural constraints**

- DLA + Design Page prompts only; GAM may realise orientation text materials
- No new workflow steps
- Fields optional; empty → renderer omits blocks (no synthetic filler)

**Implementation risks**

- Generic boilerplate (“Welcome to this module…”)
- Duplication with `overview` / `learning_purpose` sections
- Over-long orientation crowding out tasks

**Renderer implications**

- Optional `util-orientation` or reuse `util-cognition` / card subheading patterns
- **Display only** if field present in JSON

**Testing strategy**

- Marx self-study fixture: orientation present, non-facilitator tone
- RNA transcript fixture: source-based orientation without “uploaded transcript” as topic
- Regression: facilitated workshop brief **unchanged**

---

### Phase 2 — Reasoning & scaffolding (30-2)

**Goals**

- Tasks make **disciplinary reasoning** explicit
- Scaffolds are **contingent and topic-specific** (not generic “discuss”)
- Source-based activities include **evidence-use** guidance

**Candidate fields**

- `reasoning_orientation`, `evidence_use_prompt`, `argument_structure_hint`, `disciplinary_lens`, `scaffold_hint_sequence` (align 28)

**Pedagogic purpose**

Strengthen **intellectual work** learners do with notebook and pencil — analysis, comparison, application.

**Architectural constraints**

- DLA defines reasoning prompts; GAM realises supporting text/tables
- Timeline / sequencing alignment hotfix must remain satisfied
- No adaptive hint engines — scaffolds are **static** in artefacts

**Implementation risks**

- Scaffold proliferation (cards + table + prompts redundant)
- Hollow “critical thinking” phrases
- Conflicts with lean assessment-only topologies

**Renderer implications**

- Existing cognition blocks; possible grouped “Reasoning focus” subheading
- No renderer logic that infers reasoning type from task text

**Testing strategy**

- Kitchen-sink page: reasoning fields render when present
- Coverage evaluator: N activities with non-empty `reasoning_orientation` on self-directed briefs
- Compare-before-orientation ordering preserved (Marx A3)

---

### Phase 3 — Metacognitive regulation & synthesis (30-3)

**Goals**

- Learners **monitor** understanding and **integrate** across activities
- Closing synthesis without adding heavy new tasks
- CPD / revision resources feel **complete**, not fragmentary

**Candidate fields**

- `comprehension_check_prompt`, `monitoring_prompt`, `study_strategy_note`, `synthesis_prompt`, `transfer_or_application_task`

**Pedagogic purpose**

Support **self-regulated learning** in higher education — not gamification, not chat reflection.

**Architectural constraints**

- Prefer **lightweight** prompts over new assessment items
- Assessment remains Sprint 27 semantics; metacognition must not override item visibility rules

**Implementation risks**

- Metacognitive prompts feel like **surveillance** or **primary school reflection journals**
- Synthesis section duplicates `knowledge_summary`
- Pushing formative assessment when brief says “no quiz”

**Renderer implications**

- Optional end-of-activity or page-level “Study synthesis” block
- Print-friendly; no JS-dependent interaction

**Testing strategy**

- Self-study revision brief with formative subordinate assessment (Sprint 27 pattern)
- Full page coherence rubric (manual + fixture hooks)
- `node --test tests/*.test.js` floor maintained

---

## 7. Technical approach (when implementing)

1. **PEC registry** in `app.js` (parallel to `SPRINT_28_COGNITION_PACK_CONTRACT`) — document before coding
2. **Resolver:** `resolvePedagogicEnrichmentContracts(resolved, explicit, base)` → active PEC ids
3. **Prompt augmentation:** `applyPedagogicEnrichmentContractScaffoldToDraft` on DLA, GAM, Design Page — same hook pattern as cognition/self-directed scaffolds
4. **Composition:** `mergePedagogicEnrichmentFieldsIntoPageActivities` — preserve upstream strings
5. **Renderer:** one bounded pass per phase — map new field keys to existing util blocks
6. **Tests:** contract satisfaction + fixture regression per phase

**30-0 (current):** Steps 1 and documentation only.

---

## 8. Success criteria

| Criterion | Measure |
|-----------|---------|
| Self-directed pages feel **oriented** and **coherent** | Manual rubric on Marx + RNA regeneration |
| No workflow topology regression | Step inclusion tests unchanged |
| No facilitated brief regression | Workshop probe still includes DLA/GAM; classroom defaults preserved |
| Test floor | `node --test tests/*.test.js` — no decrease from **430** baseline |
| Inspectability | All enrichment visible in JSON; no hidden renderer-only pedagogy |
| Strategic alignment | Documented as design infrastructure, not tutoring |

---

## 9. Non-goals

- AI tutor / conversational companion
- Adaptive difficulty or personalised learning paths
- Autonomous pedagogic engines that rewrite activities at runtime
- New workflow steps or artefact types
- Major domain-pack rewrite
- Illustration / diagram generation
- Reopening Sprint 29 renderer semantics programme
- Facilitated workshop/dialogic redesign (separate brief profiles)

---

## 10. Pedagogic rationale (why PEL, why now)

Sprints 26–29 stabilised **intent**, **topology**, **assessment semantics**, **cognition typing**, and **renderer expression**. Live self-study outputs still show:

- Procedural activities without **intellectual framing**
- Materials that are **structurally correct** but **pedagogically thin**
- Weak **cross-activity coherence** on multi-activity pages
- Orientation gaps for **uploaded-source** independent study

PEL addresses the **quality of thinking learners are invited to do** — the layer above structure, below tutoring.

---

## 11. Suggested implementation sequence

1. **30-0** — PEC registry spec + resolver design doc + handover (this sprint init) ✅  
2. **30-1** — `orientation_contract` on DLA/Design Page + tests (Marx, RNA)  
3. **30-1b** — Renderer passthrough for orientation fields (minimal)  
4. **30-2** — `reasoning_contract` + evidence/source variants  
5. **30-2b** — Anti-redundancy rules (cards vs tables) in GAM scaffolds  
6. **30-3** — `metacognition_contract` + page synthesis  
7. **30-close** — Evidence matrix + closure note

---

## 12. References

| Topic | Path |
|-------|------|
| Handover pack | [`HANDOVER.md`](HANDOVER.md) |
| Current state | [`CURRENT-STATE.md`](CURRENT-STATE.md) · [`../../current-state.md`](../../current-state.md) |
| Sprint 28 closure | [`sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-closure.md`](sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-closure.md) |
| Sprint 29 closure | [`sprints/2026-05-21-sprint-29-renderer-cognition-semantics/sprint-29-closure.md`](sprints/2026-05-21-sprint-29-renderer-cognition-semantics/sprint-29-closure.md) |
| Self-directed framing hotfix | [`hotfix-self-directed-activity-framing-adoption.md`](hotfix-self-directed-activity-framing-adoption.md) |
| Learner-resource brief defaults | [`hotfix-brief-learner-resource-defaults.md`](hotfix-brief-learner-resource-defaults.md) |
| Marx design quality | [`hotfix-marx-self-study-design-quality-investigation.md`](hotfix-marx-self-study-design-quality-investigation.md) |

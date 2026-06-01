# Sprint 30 retrospective — Pedagogic Enrichment Layer (PEL)

**Status:** **CLOSED** (2026-06-01)  
**Decision:** [R30-999](review-log.md)  
**Pack path:** `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/`  
**Successor planning:** [`sprint-31-seed-notes.md`](sprint-31-seed-notes.md) (presentation/rhetoric only — not a charter)

---

## Executive summary

Sprint 30 delivered a **generation-layer Pedagogic Enrichment Layer** for self-directed learner pages: two shipped PECs (`orientation_contract`, `reasoning_contract`), passive renderer passthrough, bounded sanitisation, and warn-only evaluators — **without** changing workflow topology, assessment semantics, or cognition-pack architecture.

Validation across **two independent domain Factory probes** (Marx humanities self-study, RNA/HCV transcript self-study) plus a **471-test regression floor** shows the programme **succeeded operationally**: the platform reliably produces richer, learner-facing orientation and reasoning cues, closes facilitator leakage paths, and preserves facilitated workflows. It did **not** succeed as a controlled pedagogic experiment with quantitative effect sizes.

**Phase 3 (`metacognition_contract`)** remains **deferred and not authorised** — governance captured in [`phase-3-design-constraints.md`](phase-3-design-constraints.md).

**Next programme:** Sprint 31 — **presentation quality and renderer rhetoric**, not further PEC expansion.

---

## Original goals vs achieved outcomes

| Original goal (charter) | Outcome | Evidence |
|-------------------------|---------|----------|
| Deepen self-directed learner-page pedagogy | **Achieved** | Live pages vs `marx-dla-procedural-output.json`; preambles, bridges, reasoning fields |
| Notebook-and-pencil intellectual work | **Achieved** | Tasks + materials + static retrieval prompts; no chat loops |
| Disciplinary reasoning & coherence | **Achieved (partial compliance)** | Topic-specific reasoning on Marx/RNA; some DLA field gaps |
| Preserve E→O→G→C→R | **Achieved** | No topology changes; layer fixes only |
| No adaptive tutoring / learner modelling | **Achieved** | No runtime engines added |
| Three-phase PEC programme | **Phases 1–2 shipped; Phase 3 deferred** | `metacognition_contract` spec-only |
| Renderer passive | **Achieved** | 30-1b, 30-2r — JSON-in, HTML-out |
| Regression safety | **Achieved** | **471** pass / 0 fail |

---

## Phase-by-phase summary

### Phase 1 — `orientation_contract`

| Slice | Deliverable |
|-------|-------------|
| **30-1** | Resolver + DLA/Design Page prompts; `SELF_DIRECTED_ACTIVITY_FRAMING_FIELD_IDS`; composition merge |
| **30-1b** | Renderer passthrough: `study_orientation`, `intellectual_frame`, `intellectual_coherence_bridge`, `activity_preamble` |
| **30-1c** | GAM learner voice guard; `evaluatePelOrientationContractSatisfaction` (warn/test) |

**Outcome:** Learner pages read as **sequenced studies** with orienting preamble and page-level study framing. Factory Marx probe: material improvement vs pre-30-1 procedural fixture.

### Phase 2 — `reasoning_contract` + stabilisation

| Slice | Deliverable |
|-------|-------------|
| **30-2** | `reasoning_contract` on DLA/GAM; Design Page field preservation; duplication evaluator |
| **30-2r** | Passive render for `disciplinary_lens`, `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt` |
| **30-2b** | GAM prompt hardening + `sanitizeSelfDirectedGamMaterialsOutput` — **GAP-30-10 closed** |
| **30-2c** | `sanitizeSelfDirectedLearnerPageActivityRows` — **GAP-30-15 closed** |

**Outcome:** Thinking process visible in JSON and HTML when fields are present. Facilitator voice removed from GAM materials and composed activity rows on self-directed learner pages. Worked examples and evidence tables retained.

### Phase 3 — `metacognition_contract`

**Not implemented.** Governance documented; charter not approved. Intentional deferral to avoid scaffold saturation before presentation refinement (Sprint 31).

---

## Architectural outcomes

### PEC layering success

- Pedagogy expressed as **composable generation contracts**, not workflow steps.
- `resolvePedagogicEnrichmentContractIds` returns `["orientation_contract", "reasoning_contract"]` only on gated self-directed learner-page briefs.
- Design Page: **preservation** of upstream fields, not re-generation of full PEC blocks for reasoning.

### E → O → G → C → R integrity

| Layer | Sprint 30 touch |
|-------|-----------------|
| **E** | Brief resolution unchanged in spirit; self-directed defaults from prior hotfixes |
| **O** | **Frozen** — DLA → GAM → Design Page |
| **G** | Primary enrichment (prompts, PECs, model output) |
| **C** | Merge + narrow sanitisation (30-2c) |
| **R** | Passive display only (30-1b, 30-2r) |

### No workflow topology drift

- No new steps for enrichment.
- Facilitated workshop probe (P30-03) continues to resolve **empty** PEC lists.
- Self-study probes do not require `learning_sequence`.

### Passive renderer discipline

- Renderer does not invent, infer, or synthesise pedagogy.
- New cues use explicit labels and dedupe (`comparableSeen`).
- Cognition-pack chrome (`util-cognition*`) remains separate from PEL cues.

### Bounded sanitisation philosophy

- **30-2b:** strip forbidden GAM headings and obvious duplicate paragraphs.
- **30-2c:** strip facilitator row aliases and choreographic `support_note`.
- Both: gated, deterministic, non-semantic, facilitator workflows untouched.

### Proportional pedagogy across domains

The same PEC stack adapts **proportionally** to brief shape:

| Domain probe | Pedagogic emphasis observed |
|--------------|----------------------------|
| **P30-01 Marx** | Historical causation, textual comparison, **transfer/application** to contemporary issues |
| **P30-02 RNA/HCV** | **Evidence use** on transcript, mechanism tracing, **conceptual contrast** (e.g. HCV vs influenza/retrovirus), misconception repair |

No domain-specific PEC forks were required — brief signals and field policy steer emphasis.

---

## Validation summary

### P30-01 — Marx (humanities self-study)

| Dimension | Result |
|-----------|--------|
| Orientation | Preambles 4/4; bridges on page; study orientation present |
| Reasoning | `reasoning_orientation` on activities; A3 argument + contrast hints |
| GAM | Sanitised — 0× `Facilitator use:`; tables and worked rows kept |
| Composition | Page rows clean post–30-2c |
| Rubric (30-2) | Thinking visible **Yes**; facilitator regression **Yes** |

**Artefacts:** `context-files/live-artefacts/marx-*`

### P30-02 — RNA virus / HCV (transcript self-study)

| Dimension | Result |
|-----------|--------|
| Orientation | Preambles 4/4; topic-specific HCV/RNA language |
| Reasoning | **4/4** `evidence_use_prompt`; contrast on compare/misconception activities |
| GAM | Sanitised; replication template and reference tables retained |
| Rubric (30-2) | Evidence discipline **Yes**; thinking visible **Yes** |
| Known gap | `argument_structure_hint` sometimes missing in DLA (generation compliance) |

**Artefacts:** `context-files/live-artefacts/rna-*`

### Statistical significance (interpretation)

Sprint 30 validation is **operational and cross-domain**, not experimental:

- **No** controlled A/B study or learner outcome metrics were in scope.
- **Two independent brief profiles** (humanities page vs transcript STEM session) both pass layer traces (E/G/C/R) and Phase 2 rubrics after stabilisation slices.
- **471 automated tests** provide regression **significance** in the engineering sense: changes are guarded across orientation, reasoning, GAM sanitisation, page-row sanitisation, and renderer fixtures.

**Conclusion:** Results are **replicably good enough to ship the layer**, not proof of a specific learning gain effect size.

### Synthetic and workshop controls

| Probe | Role |
|-------|------|
| **P30-05 Kitchen-sink** | Renderer regression (KS-A6 orientation, KS-A7 reasoning) |
| **P30-03 Workshop** | PEC non-activation on facilitated briefs |

---

## Key emergent behaviours

### Disciplinary reasoning adaptation

Models populated **topic-appropriate** reasoning fields: chronological/causal framing (Marx), evidence-from-transcript and mechanism language (RNA/HCV), without a separate history or biology PEC.

### Pedagogic proportionality

Field counts scale with task type: compare/evaluate activities carry more reasoning cues; simpler tasks carry preamble + one orientation/reasoning line. Evaluators flag **over-duplication**, not absence only.

### Instructional rhetoric

Generated prose tends toward **clear, directive study voice** (“This activity invites you…”, “Before checking…”) suitable for self-study — distinct from facilitator choreography (now stripped when it appears).

### Transformation-task pattern

Final activities often use **`transfer_or_application_task`** (Marx A4 contemporary analysis; RNA misconception/application tasks): a repeatable capstone pattern linking prior activities to application — aligned with Sprint 28 transformation/transcript packs without new workflow steps.

---

## Explicit non-goals / intentionally deferred

| Item | Status |
|------|--------|
| **Adaptive tutoring** | Out of scope — not built |
| **Metacognition escalation** (`metacognition_contract` implementation) | **Deferred** — governance only ([`phase-3-design-constraints.md`](phase-3-design-constraints.md)) |
| **Conversational pedagogy** | Out of scope |
| **Runtime learner modelling** | Out of scope |
| **Topology expansion** | Out of scope |
| **Renderer-generated pedagogy** | Out of scope |
| **Runtime blocking on thin fields** | Out of scope — warn/test evaluators only |
| **Broad post-generation rewriting** | Rejected — narrow sanitisers only |
| **Sprint 31 work** | Not started — see seed notes only |

---

## Known remaining tensions (accepted at close)

| Tension | Notes for Sprint 31 |
|---------|---------------------|
| **Density management** | Multiple cues above “What to do” can feel busy — Sprint 31 density modulation |
| **Visual calmness** | Task blocks, badges, cue labels compete for attention |
| **Renderer rhetoric** | Label wording (“How to think”, “Key distinction”) — tune prominence and tone |
| **Cue prominence** | PEL vs cognition chrome ordering and visual weight |
| **Intro / preamble overlap** | Page overview + `study_orientation` + A1 preamble may repeat |
| **DLA field compliance** | Model sometimes omits optional reasoning fields (RNA `argument_structure_hint`) |
| **Sparse `intellectual_frame`** | Optional field rarely populated — not blocking |

These are **presentation and compliance** tensions, not architectural failures.

---

## Final verdict

> **Sprint 30 succeeded operationally, not experimentally.**

The Pedagogic Enrichment Layer is **frozen as complete** for Phases 1–2: shippable contracts, stable probes, closed facilitator leakage gaps, learner-visible reasoning when JSON carries fields, and a documented ceiling on further generation expansion before presentation work.

Future investment should shift to **how cues read and pace on the page** (Sprint 31), not to adding a third PEC family without new evidence of learner harm from absence.

---

## Close-out artefacts

| Document | Role |
|----------|------|
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Frozen status — Sprint 30 CLOSED |
| [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md) | Gap and probe matrix |
| [`context-files/baseline-test-floor.md`](context-files/baseline-test-floor.md) | Final floor **471** |
| [`review-log.md`](review-log.md) | R30-001 – R30-999 |
| [`phase-3-design-constraints.md`](phase-3-design-constraints.md) | Deferred Phase 3 governance |
| [`sprint-31-seed-notes.md`](sprint-31-seed-notes.md) | Next programme seed |

---

## Review decisions (selected)

| ID | Summary |
|----|---------|
| R30-005 – R30-012 | PEC implementation, renderer, GAM/page sanitisation |
| R30-013 | Phase 3 constrained; no implementation authorised |
| **R30-999** | Sprint 30 formally closed; Sprint 31 presentation focus |

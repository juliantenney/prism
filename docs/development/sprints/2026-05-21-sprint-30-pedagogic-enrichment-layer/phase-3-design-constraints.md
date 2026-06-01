# Sprint 30 — Phase 3 design constraints

**Type:** Design-governance document (not a feature charter)  
**Date:** 2026-06-01  
**Status:** **Planning only** — no Phase 3 implementation authorised  
**Audience:** Charter authors, reviewers, and implementers before `metacognition_contract` work begins

**Related:** [`sprint-30-charter.md`](sprint-30-charter.md) § Phase 3 · [`CURRENT-STATE.md`](CURRENT-STATE.md) · [`pec-registry.md`](pec-registry.md) · [`review-log.md`](review-log.md) (R30-013)

---

## Purpose

Capture architectural and pedagogic constraints learned from Sprint 30 **Phases 1–2** so Phase 3 (`metacognition_contract`) is chartered deliberately small. This document governs **what Phase 3 may do**, not **how to implement it**.

**Out of scope for this doc:** slice tasks, file-level diffs, probe rubrics, or resolver changes.

---

## 1. Why Phase 1/2 succeeded

Phases 1–2 delivered measurable learner-page improvement without destabilising the LD workflow platform. Success factors:

### PEC layering

- Pedagogic enrichment is expressed as **generation-layer PECs** (`orientation_contract`, `reasoning_contract`), not as new workflow steps or renderer programmes.
- Each PEC owns a **narrow field namespace** and prompt block; resolver activation is gated on self-directed learner-page briefs.
- Design Page receives **preservation** instructions for upstream fields, not a third full PEC block for every contract (reasoning fields preserved; reasoning PEC not re-prompted on Design Page).

### Stable E → O → G → C → R separation

| Layer | Role in Sprint 30 | Phase 1–2 discipline |
|-------|-------------------|----------------------|
| **E** | Brief / eligibility (`delivery_context`, page profile) | Self-directed learner intent resolved before generation |
| **O** | Workflow topology | **No new steps**; DLA → GAM → Design Page unchanged |
| **G** | Model generation (DLA, GAM, Design Page) | PEC scaffolds + prompt hardening; model may drift |
| **C** | Composition merge / sanitisation | `mergeSelfDirectedActivityFramingFieldsIntoPageActivities`; 30-2c row sanitiser |
| **R** | Renderer | **Passive** display of JSON only |

Violations were caught by fixing **G** or **C**, not by teaching the renderer to “fix pedagogy.”

### No topology drift

- No `Construct Learning Sequence` requirement for self-study probes.
- No facilitator-only steps added to learner-page workflows.
- Facilitated/workshop briefs continue to resolve **empty** PEC lists.

### Passive renderer discipline

- **30-1b / 30-2r:** `renderActivityFramingForActivity` displays orientation and reasoning cues only when present in activity JSON.
- Renderer does not infer missing fields, summarise tasks, or inject tutoring voice.
- Cognition-pack chrome (`util-cognition*`) remains separate from PEL orientation/reasoning cues.

### Bounded sanitisation

- **30-2b (GAM):** strip forbidden facilitator headings and obvious duplicate paragraphs — not rewrite learner materials.
- **30-2c (Design Page rows):** remove facilitator row aliases and choreographic `support_note` — preserve learner-facing support hints.
- Both sanitizers are **gated**, **deterministic**, and **localised** to self-directed learner pages.

### Compositional preservation

- Post–Design Page merge backfills **missing** PEL framing fields from upstream DLA without overwriting model-composed content.
- Activity membership closure remains explicit (`generation_notes.activities_omitted[]`).

### Evaluator-as-warning pattern

- `evaluatePelOrientationContractSatisfaction`, `evaluatePelReasoningContractSatisfaction`, `evaluatePelGamMaterialStabilisation` — **warn/test only**.
- Factory probes and CI can score compliance without blocking learners at runtime.
- Stabilisation slices (30-2b, 30-2c) address **known failure modes**; evaluators remain observability, not enforcement.

**Implication for Phase 3:** Repeat this pattern — generation PEC + preservation + optional narrow sanitiser + passive render + warn-only evaluator. Do not introduce runtime pedagogic engines.

---

## 2. Anti-scaffold-saturation principles

Learner pages must remain **cognitively elegant**: one coherent task surface, not a wall of instructional chrome.

### Core rules

1. **Avoid cue stacking** — multiple labels above “What to do” compete for attention (preamble + study orientation + frame + bridge + three reasoning lines + support note + cognition block).
2. **Avoid repeated prose** across:
   - `learner_task` (what to do)
   - `activity_preamble` / page intro (why it matters)
   - `study_orientation` / `intellectual_frame` (page-level stance)
   - `reasoning_orientation` and sibling reasoning fields (how to think)
   - `support_note` (optional nudge)
   - GAM material bodies (reference content, not a second task spec)
3. **Prefer fewer, stronger prompts** over many weak generic lines (“think critically”, “analyse carefully”).
4. **Materials carry evidence and worked examples**; activity JSON carries **thinking mode**; `learner_task` carries **action**.

### Redundancy heuristics (already in Phase 2)

- `evaluatePelReasoningContractSatisfaction` flags substantial overlap with `learner_task` and orientation fields.
- GAM sanitizer may drop paragraphs that duplicate upstream activity text.
- Renderer dedupes identical cue text via `comparableSeen` in `renderActivityFramingForActivity`.

### Phase 3 implication

Metacognition fields must **not** become a third prose layer that restates the task or reasoning contract. Each metacognitive cue should be **one short sentence** that adds regulation value only.

---

## 3. Field density guidance

Default density targets for self-directed learner-page activities (unless brief explicitly demands richer scaffolding):

| Field family | Density expectation |
|--------------|---------------------|
| **Orientation** | `activity_preamble` on most activities; `study_orientation` at most once per page; bridges on follow-on activities, not every row |
| **Reasoning** | **1–2 short reasoning cues per activity** for standard tasks; up to **3** only on compare / evaluate / source-analysis activities |
| **Worked examples (GAM)** | **Compact** — one sample row, one worked pair, or one mini walkthrough; not a second lesson |
| **Generative retrieval** | **Lightweight** — one sentence (“Before checking…”, “Without looking back…”) tied to the task artefact |
| **`disciplinary_lens`** | **Tag-like** (≤ ~15 words); must not duplicate `intellectual_frame` |
| **Orientation vs reasoning** | Orientation = **where this sits** in the study path; reasoning = **how to think** for this task; neither restates **what to do** |

### Anti-patterns

- Full `learner_task` repeated inside `reasoning_orientation`.
- Page intro + A1 `activity_preamble` + `study_orientation` all saying the same welcome narrative.
- GAM materials that paste `activity_preamble` or PEL reasoning fields verbatim.
- Long facilitator-style timing or group-work language anywhere on learner pages.

---

## 4. Renderer discipline

**Reaffirmed for Phase 3 and beyond:**

| Rule | Rationale |
|------|-----------|
| Renderer is **passive** | Pedagogy is authored in generation/composition, not inferred at render time |
| **No pedagogic synthesis** | Do not merge fields into new combined cues in HTML |
| **No inferred cues** | If JSON lacks `monitoring_prompt`, HTML must not show one |
| **No runtime pedagogic generation** | No LLM call, template expansion, or “smart defaults” in `utilityRender*` |
| **Render only explicit activity/page JSON** | New metacognition fields follow the same passthrough pattern as 30-2r unless a separate charter explicitly extends renderer (not planned for 30-3 core) |

**Allowed:** new display labels for **new JSON keys** that already exist on the row (same `pushPelOrientationCue` / cognition-item pattern).

**Not allowed:** conditional insertion of metacognition based on task type detection in renderer.

---

## 5. Sanitisation philosophy

Sprint 30 proved that **narrow deterministic sanitisation** is acceptable when:

| Criterion | 30-2b / 30-2c example |
|-----------|------------------------|
| **Architecturally localised** | GAM text pipeline; composed page activity rows only |
| **Reversible in principle** | Strips known keys/phrases; does not destroy structured materials |
| **Non-semantic** | Does not paraphrase learner pedagogy or “improve” arguments |
| **Protects learner-facing invariants** | No facilitator voice; no choreographic support notes on self-study pages |

### When sanitisation is appropriate

- Known model failure modes with **stable signatures** (forbidden headings, alias field names, circulate/minute choreography).
- **After** generation, **before** render/export, on **gated** profiles only.

### When sanitisation is not appropriate

- Broad post-generation rewriting (“make this page clearer”).
- Removing valid learner support because a heuristic is too aggressive.
- Facilitated/workshop pages (must remain no-op).
- Replacing prompt investment — sanitiser is **seatbelt**, not **steering wheel**.

Phase 3 may add a **similarly narrow** row-level rule only if a new stable leak appears (e.g. tutor check-in phrases in `monitoring_prompt`). Prefer **prompt + evaluator** first.

---

## 6. Phase 3 constraints (before `metacognition_contract`)

Phase 3 must remain **static notebook-oriented self-regulation** for independent study.

### Explicitly out of scope

| Capability | Why excluded |
|------------|--------------|
| **Adaptive tutoring** | Requires runtime model + session state |
| **Learner modelling** | No profile, mastery, or history store in PEL |
| **Conversational reflection loops** | No chat UI, no Socratic dialogue engine |
| **Remediation engine** | No branching “if wrong, show hint B” |
| **Runtime blocking** | Evaluators warn only (R30-008, R30-009) |
| **New workflow topology** | Charter frozen |
| **Cognition-pack behaviour changes** | Sprint 28 boundary |
| **Assessment semantics changes** | Sprint 27 frozen |

### In scope (generation layer only)

- Optional **short** metacognitive fields on activities or page.
- Prompt blocks and preservation lists (mirror Phase 1–2).
- Warn/test evaluator for duplication and facilitator language.
- Passive renderer labels **only if** chartered alongside field introduction.

---

## 7. Known remaining tensions

These are **accepted or chartering-time** issues — not blockers for Phase 2 closure.

| Tension | Description | Phase 3 stance |
|---------|-------------|----------------|
| **Intro / preamble overlap** | Page overview + `study_orientation` + A1 `activity_preamble` may repeat | Prefer page-level **or** activity preamble, not both with same wording; evaluator warning |
| **Reasoning density risk** | Six reasoning-related fields × four activities = cue fatigue | Cap metacognition adds; do not add a fourth reasoning-like layer |
| **Support-note ambiguity** | Legitimate learner hints vs choreographic notes share one key | Keep 30-2c choreography heuristic; metacognition must not use `support_note` for tutor voice |
| **Evaluator false positives/negatives** | Overlap detection may flag benign paraphrase or miss subtle duplication | Evaluator informs probes; do not runtime-block |
| **Model compliance variability** | DLA may omit fields Design Page invents; GAM may drift despite prompts | Preservation merge + sanitizers + Factory probes |
| **Sparse `intellectual_frame`** | Optional field rarely generated | Do not compensate by stuffing `disciplinary_lens` |
| **DLA field compliance** | e.g. missing `argument_structure_hint` on some live RNA activities | Generation prompt tightening, not renderer fixes |

---

## 8. Recommended Phase 3 shape

Deliberately **small** `metacognition_contract` — one PEC, minimal field set, same activation gate as Phases 1–2.

### Candidate fields (prioritised)

| Field | Level | Role | Notes |
|-------|-------|------|-------|
| `comprehension_check_prompt` | Activity | “Before moving on, can you explain…” | One sentence; must not duplicate `self_explanation_prompt` |
| `monitoring_prompt` | Activity | What to notice if stuck | Practical, non-tutor (“If your answer has no evidence…”) |
| `confidence_calibration_prompt` | Activity | Optional calibration (“How sure are you? What would change your mind?”) | **Static** — no adaptive follow-up |
| `study_strategy_note` | Page | Notebook, spacing, self-testing | **Once per page**; not repeated per activity |
| `transfer_or_application_task` | Activity | **Reuse** from `reasoning_contract` / Sprint 28 | Extend carefully — do not duplicate application wording in new fields |

### Emphasis

- **Concise** — target one short sentence per field.
- **Optional-feeling** — not every activity needs every metacognitive cue.
- **Learner-facing** — written to the student, never to a facilitator.
- **Non-conversational** — no “Tell me…”, no chat, no “I will help you…”.

### Defer to Sprint 31 or later

- `synthesis_prompt` (page tail integration — higher composition risk).
- Full `disciplinary_thinking_contract` beyond existing `disciplinary_lens` / `evidence_use_prompt`.
- Page-level metacognition sections that compete with `overview` / `study_orientation`.

### Suggested slice split (chartering only)

| Slice | Focus |
|-------|--------|
| **30-3** (core) | Resolver + DLA/GAM prompts + preservation + evaluator |
| **30-3r** (if needed) | Passive renderer labels for new keys only |
| **30-3b** (only if probes show leaks) | Narrow sanitiser for tutor-voice metacognition phrases |

Do not pre-commit to 30-3b; charter after Factory evidence.

---

## 9. Exit guidance — “Sprint 30 complete”

Before opening **Sprint 31**, Sprint 30 should meet:

| Criterion | Evidence |
|-----------|----------|
| **Stable probes** | P30-01 / P30-02 Factory notes + `sprint-30-probe-capture.json` reflect current gates |
| **No facilitator leakage** | GAM sanitiser (30-2b) + page row sanitiser (30-2c); `facilitatorUse: false`; clean `pageRowSanitization` |
| **Acceptable cognitive density** | Manual rubric: no cue-stacking regressions on live HTML; anti-redundancy evaluators clean or documented |
| **Reasoning visible in HTML** | 30-2r passthrough when fields present in JSON |
| **No topology regressions** | Workshop probe P30-03 unchanged; self-directed topology unchanged |
| **Test floor preserved** | `node --test tests/*.test.js` — **≥ 471** pass / 0 fail unless review-log documents justified drop |
| **Phase 3 shipped or explicitly deferred** | Either `metacognition_contract` implemented per chartered slices **or** formal deferral with R30-0xx |

### Documentation expected at Sprint 30 close

- Updated [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md) verdicts.
- [`CURRENT-STATE.md`](CURRENT-STATE.md) → Sprint 30 **complete**.
- Review log entries for each shipped slice (30-3+).
- Optional: `sprint-30-closure.md` (short programme summary).

---

## Governance summary

| Question | Answer for Phase 3 |
|----------|------------------|
| May we add a workflow step? | **No** |
| May we block runtime on thin fields? | **No** — warn/test only |
| May we infer pedagogy in renderer? | **No** |
| May we add metacognition PEC? | **Yes** — one contract, small field set, same gate |
| May we rewrite learner prose post-hoc? | **Only** narrow, gated sanitisation per §5 |
| Is implementation authorised now? | **No** — charter `slice-30-3-charter.md` first |

**Decision:** [R30-013](review-log.md) — Phase 3 constrained by anti-scaffold-saturation and passive-renderer principles.

---

## References

| Document | Use |
|----------|-----|
| [`slice-30-1-charter.md`](slice-30-1-charter.md) | Orientation contract scope |
| [`slice-30-2-charter.md`](slice-30-2-charter.md) | Reasoning contract + Phase 2 closure |
| [`slice-30-2b-charter.md`](slice-30-2b-charter.md) | GAM sanitisation precedent |
| [`context-files/sprint-28-29-boundaries.md`](context-files/sprint-28-29-boundaries.md) | Cognition vs PEL |
| [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md) | Gap and probe tracking |

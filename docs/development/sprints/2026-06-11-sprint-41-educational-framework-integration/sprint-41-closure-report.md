# Sprint 41 Closure Report

**Sprint:** Educational Framework Integration  
**Status:** Implementation complete — closed  
**Closure date:** 2026-06-11

---

## Sprint objective

Integrate the Sprint 40 Educational Quality Framework (EQF) into PRISM generation workflows so that generated learning resources more consistently support:

- Understanding
- Capability
- Judgement
- Independence
- Metacognition
- Learning success
- Progressive independence

Sprint 41 was **implementation**, not framework discovery. Work targeted prompt architecture, generation contracts, diagnostic tooling, and learner-framing integration — not major system redesign.

---

## Slices completed

| Slice | Title | Outcome |
| ----- | ----- | ------- |
| **1** | EQF prompt foundation | `lib/educational-quality-framework-prompt.js` — runtime EQF contract injected via `applyEducationalQualityFrameworkPromptBlockToDraft` on LD generation steps |
| **2** | Step-specific manifestation | Per-step manifestation guidance mapped to Construct Sequence, DLA, GAM, Design Page, assessment, and feedback steps |
| **3** | EQF evaluator | `lib/educational-quality-framework-evaluator.js` — heuristic 8-dimension evidence scanner for saved artefacts |
| **4** | Diagnostics tooling | `tools/evaluate-educational-quality-framework.js`, `tools/evaluate-sprint41-benchmarks.js`; diagnostic-only, never a build gate |
| **5** | Delivery-mode-independent learner framing | Decoupled learner-page PEL/activity framing from self-directed-only gating; workshop learner handouts receive same DLA/Design Page framing scaffolds as self-study |
| **5 follow-up** | Design Page preservation repair | Runtime `repairLearnerPageCompositionFromUpstream` — merges framing from upstream `learning_activities`, restores omitted activity shells, strips unauthorized output-size omissions |
| **5 finalisation** | Mandatory learner framing | DLA OUTPUT CONTRACT requires `activity_preamble` + ≥1 cognition field per learner-page activity; capture validation on procedural-only DLA |

### Slice deliverable references

| Document | Scope |
| -------- | ----- |
| `educational-quality-diagnostics.md` | Slice 4 CLI usage and constraints |
| `sprint-41-validation-report.md` | Validation phase (Slices 1–4 + corpus review) |
| `sprint-41-framework-impact-report.md` | Before/after impact gate (pending manual captures) |
| `sprint-41-slice-5-delivery-mode-framing.md` | Slice 5 prompt gating |
| `sprint-41-slice-5-design-page-preservation-follow-up.md` | Compose preservation repair |
| `sprint-41-slice-5-mandatory-learner-framing.md` | Mandatory DLA framing |

---

## Architectural findings

### What worked as designed

1. **Prompt-augmentation model** — EQF and learner framing integrate through `applyWorkflowStepRuntimePromptAugmentations` without new workflow steps or schema changes.
2. **Modular contracts** — EQF (`EDUCATIONAL-QUALITY-FRAMEWORK`), PEL, LD compose (`LD-DESIGN-PAGE-COMPOSE-CONTRACT`), and learner-page OUTPUT CONTRACT compose cleanly via markers and step gates.
3. **Separation of concerns** — Evaluator and diagnostics operate on saved artefacts only; PRISM does not intercept external LLM output during run mode.
4. **Delivery-mode split** — Self-directed-only scaffolds (GAM voice, LD-SELF-DIRECTED-RHETORIC) remain gated; learner-page pedagogic framing is delivery-independent.
5. **Compose repair layer** — Design Page LLM variance is mitigated by runtime merge/restore without reopening renderer or GAM.

### Key architectural decisions

| Decision | Rationale |
| -------- | --------- |
| EQF as prompt contract, not runtime orchestration | Aligns with PRISM copy-paste workflow model |
| Heuristic evaluator (8 dimensions) | Enables manual benchmarking without blocking builds |
| Mandatory framing at DLA + preservation at Design Page | Two-layer guarantee: emit upstream, carry forward downstream |
| Facilitator-only outputs excluded from learner framing | Preserves facilitator guide / slide deck semantics |

### Profile split (validation)

| Profile | Typical EQF score | Dominant gaps |
| ------- | ----------------- | ------------- |
| Self-study exemplar (e.g. Marx page) | 6–7/8 | learning_success |
| Facilitated workshop learner page | 4–5/8 | independence, metacognition, learning_success |
| Renderer / smoke fixtures | 1–2/8 | most dimensions (not educational exemplars) |

---

## Validation findings

Validation used 17 artefact sources, EQF evaluator runs, and human review. See `sprint-41-validation-report.md` for full dimension analysis.

### Inflation workflow

**Representative artefacts:** `ld-inflation-workshop-page.json` (5/8), `ld-inflation-workshop-page-full.json` (4/8), upstream DLA (4/8), Sprint 38-M workbook baseline (8/8 markdown).

| Finding | Detail |
| ------- | ------ |
| Strengths | Understanding, capability, cognitive activity in workshop learner page |
| Weaknesses | Learner journey diluted in extended full page; independence and learning success absent (facilitated profile) |
| Slice 5 impact | Workshop learner handout now receives mandatory framing scaffolds and compose preservation — not reflected in pre-Sprint 41 fixtures |
| Impact validation | **Pending** — no post–Sprint 41 captures with `EDUCATIONAL-QUALITY-FRAMEWORK (auto-applied)` marker |

### Marx workshop workflow

**Representative artefacts:** `ld-climate-misconception-discussion-page.json` (5/8); Slice 5 workshop learner-handout brief tests.

| Finding | Detail |
| ------- | ------ |
| Strengths | Judgement and understanding via misconception discussion structure |
| Weaknesses | Pre-Sprint 41 DLA often procedural-only; framing fields inconsistent before Slice 5 finalisation |
| Slice 5 impact | Workshop learner handout brief triggers PEL/DLA OUTPUT CONTRACT; mandatory preamble + cognition per activity; Design Page repair preserves fields when emitted |
| Renderer | Already rendered framing when present — confirmed unchanged |

### Marx self-study workflow

**Representative artefacts:** `marx-self-study-page.json` (7/8), `marx-self-study-design-quality-page.json` (4/8), live Sprint 30 captures (4–6/8), procedural DLA fixture (3/8).

| Finding | Detail |
| ------- | ------ |
| Strengths | Strong learner journey, intellectual_coherence_bridge, PEL orientation/reasoning, faded scaffolding A2→A4 |
| Weaknesses | Learning success phrasing weak; design-quality variant thinner (-3 dimensions vs full page on compare) |
| Slice 5 impact | Self-study retains full rhetoric stack; mandatory framing tightens procedural-only DLA rejection |
| Evaluator | Reliable on understanding/capability; occasional misses on nested DLA fields and learning_success vs metacognition boundary |

### Framework impact validation

`sprint-41-framework-impact-report.md` documents that **before/after generation comparison cannot yet be completed** — no Sprint 41–attributed captures exist in the repository. Recommended storage: `captures/sprint-41-impact/`.

### Evaluator tooling fidelity

- Directionally aligns with human judgement on content-rich exemplars
- Conservative on independence and learning_success (appropriate)
- Permissive on cognitive_activity (broad verb patterns)
- Known false negatives: nested preamble fields, learning_success vs metacognition overlap

---

## Key fixes introduced

### Slices 1–4 (EQF integration)

- Runtime EQF prompt injection on LD generation steps
- Step-specific manifestation lines per canonical step
- 8-dimension heuristic evaluator
- CLI diagnostics and benchmark runner

### Slice 5 (learner framing)

- `shouldApplyLearnerPagePedagogicFramingScaffold` — learner handout/page in `desiredOutputs`, any delivery mode
- `buildLearnerPageDlaOutputContractOverrideBlock({ facilitated })` — workshop allows optional `facilitator_moves`
- Design Page field preservation for learner-facing pages

### Slice 5 follow-up (preservation)

- `repairLearnerPageCompositionFromUpstream` in `applyPedagogicCognitionSemanticsToComposedPage`
- `LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS`
- Compose contract: forbid output-size activity omission; framing source is `learning_activities`

### Slice 5 finalisation (mandatory framing)

- Mandatory per-activity `activity_preamble` + cognition field in DLA OUTPUT CONTRACT
- Archetype guidance (understanding, application, analysis, evaluation, synthesis)
- `evaluateLearnerPageDlaActivityFramingCoverage` + capture validation gate

### Principal code locations

| Area | Files |
| ---- | ----- |
| EQF prompt | `lib/educational-quality-framework-prompt.js`, `app.js` (`applyEducationalQualityFrameworkPromptBlockToDraft`) |
| EQF evaluator | `lib/educational-quality-framework-evaluator.js` |
| Learner framing | `app.js` (gates, OUTPUT CONTRACT, repair, validation) |
| Design Page compose | `lib/ld-design-page-compose-contract.js` |
| Diagnostics | `tools/evaluate-educational-quality-framework.js`, `tools/evaluate-sprint41-benchmarks.js` |

---

## Remaining limitations

1. **No automatic post-generation EQF loop** — PRISM does not see external LLM outputs; evaluation requires manual artefact save/import.
2. **Impact validation gap** — Sprint 41 prompt improvement on fresh generations not yet proven with attributed captures.
3. **Evaluator heuristics** — Profile-unaware thresholds; workshop artefacts penalised for absent solo independence; learning_success detection weak.
4. **LLM compliance** — Mandatory framing validated on capture paste; model may still paraphrase or omit until regeneration with augmented prompts.
5. **Fill-missing compose repair** — Does not overwrite paraphrased composed values; restores absent fields only.
6. **Authorial quality** — Framework structure, alignment, sequencing, judgement scaffolds, transfer cues, and metacognitive fields can be present while **exposition remains thin** — see principal conclusion below.

---

## Principal conclusion

**The educational architecture is functioning well.** Workflow structure, brief semantics, episode-plan obligation population, activity alignment, sequencing, judgement scaffolds, transfer orientation, and metacognitive support are integrated and measurable.

**The primary remaining weakness is learner-facing exposition** — narrative flow, explanatory depth, publication-quality instructional prose, and readable integration of framing fields — **not** workflow structure, alignment, sequencing, judgement, transfer, or metacognitive support.

EQF integration is **complete**. PEL/EQF learner framing integration is **complete**. **No further framework architecture work is currently recommended.**

---

## Recommended next sprint focus

### Sprint 42 — Authorial Quality / Educational Exposition

Focus areas (evidence-led):

| Area | Intent |
| ---- | ------ |
| Richer learner-facing prose | Move from scaffold labels to readable instructional voice |
| Explanatory depth | L3+ orientation that teaches, not only cues |
| Narrative flow | Session arc and inter-activity coherence in natural language |
| Educational exposition | Concepts explained before tasks demanded |
| Publication-ready page quality | Section rhythm, redundancy reduction, professional tone |
| Framing readability | Preserve `activity_preamble` and cognition fields while improving how they read on the page |

**Explicitly out of scope for Sprint 42 (unless rescoped):**

- New EQF dimensions or framework discovery
- Workflow step additions
- Schema redesign
- Renderer structural redesign
- GAM body authoring overhaul (unless narrowly scoped for exposition)

**Optional hygiene (non-blocking):**

- Manual Sprint 41 impact captures under `captures/sprint-41-impact/`
- Evaluator pattern tuning for learning_success and nested DLA fields

---

## Final assessment

| Criterion | Verdict |
| --------- | ------- |
| Sprint 41 implementation | **Complete** — all seven delivery units (Slices 1–4, 5, 5 follow-up, 5 finalisation) delivered |
| EQF integrated into generation path | **Yes** |
| PEL/learner framing delivery-independent | **Yes** |
| Design Page preservation | **Yes** (runtime repair + prompt contract) |
| Mandatory DLA framing | **Yes** (prompt + capture validation) |
| Validation phase | **Complete** (corpus + tooling fidelity) |
| Impact proof on new generations | **Pending** manual capture |
| Architecture rework needed | **No** |
| Next major work | **Authorial quality / exposition** (Sprint 42) |

Sprint 41 closes with a stable educational framework layer in PRISM. Future value lies in making generated resources **read as well as they structure** — not in adding more framework machinery.

---

## Related documents

- [`handover-from-sprint-41.md`](handover-from-sprint-41.md) — Sprint 42 entry point
- [`README.md`](README.md) — Sprint folder index
- [`implementation-start-points.md`](implementation-start-points.md) — Updated post-closure
- [`source-documents.md`](source-documents.md) — Authoritative file map

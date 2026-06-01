# Sprint 30 review log

**Format:** `R30-NNN` — decision · evidence · follow-up

---

| ID | Date | Decision | Evidence | Follow-up |
|----|------|----------|----------|-----------|
| R30-001 | 2026-05-21 | Sprint 30 initialised as **PEL** (generation-layer PECs), not workflow expansion | Charter, pack structure | Implement 30-1 per slice charter |
| R30-002 | 2026-05-21 | Sprint 29 renderer programme **closed** — 30-x may add display keys only | `sprint-29-closure.md` | See `context-files/sprint-28-29-boundaries.md` |
| R30-003 | 2026-05-21 | Reuse Sprint 28 field names where listed in `pec-registry.md` | Sprint 28 closure | No renames without migration plan |
| R30-004 | 2026-05-21 | Test baseline **430** before any PEC code | `context-files/baseline-test-floor.md` | Superseded by later floors |
| R30-005 | 2026-05-21 | **`orientation_contract` implemented as generation-layer PEC only** — no O/R-layer changes at ship | `app.js` scaffolds; `tests/workflow-pel-orientation.test.js`; 436 tests | 30-1b renderer |
| R30-006 | 2026-06-01 | **Orientation fields rendered as passive activity framing only** — renderer does not invent pedagogy | `renderActivityFramingForActivity`; kitchen-sink + framing render tests; **440** tests pass | Factory live P30-01/02; 30-2 |
| R30-007 | 2026-06-01 | **Phase 1 Factory validation:** orientation_contract improves learner pages vs pre-30-1 fixtures; gaps are GAM facilitator voice + DLA-step field compliance, not renderer | `sprint-30-probe-runner.js`; `live-artefacts/`; probe live notes | **30-1c** before 30-2 |
| R30-008 | 2026-06-01 | **Phase 1 stabilisation:** self-directed GAM learner voice guard + non-blocking orientation evaluator (`evaluatePelOrientationContractSatisfaction` / `evaluatePedagogicEnrichmentContractSatisfaction`); no renderer, topology, cognition-pack, new PEC, or `reasoning_contract` changes | `buildSelfDirectedGamLearnerVoicePromptBlock`; `tests/workflow-pel-orientation.test.js` (30-1c); **445** tests pass | Re-run Factory probes; **30-2** |
| R30-009 | 2026-06-01 | **`reasoning_contract` implemented as generation-layer DLA/GAM PEC** with Design Page preservation only; resolver returns `orientation_contract` + `reasoning_contract`; evaluators warn/test only; no topology, renderer, cognition-pack, `metacognition_contract`, or runtime blocking | `buildPelReasoningContractPromptBlock`; `evaluatePelReasoningContractSatisfaction`; `tests/workflow-pel-reasoning.test.js`; **457** tests pass | **Visibility gap:** four reasoning fields generated but not rendered — **30-2r**; live probes; 30-2b |
| R30-010 | 2026-06-01 | **Reasoning fields rendered passively from activity JSON** — renderer does not infer or generate reasoning; `disciplinary_lens`, `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt` via `renderActivityFramingForActivity` + `pushPelOrientationCue`; existing `reasoning_orientation` + `self_explanation_prompt` unchanged; no PEC, prompt, evaluator, GAM, topology, cognition-pack, or workflow changes | `renderActivityFramingForActivity`; KS-A7 + framing tests; **461** tests pass | **GAP-30-13 closed**; **30-2b** GAM facilitator leakage / redundancy |
| R30-011 | 2026-06-01 | **30-2b uses prompt hardening plus narrowly gated GAM sanitisation for self-directed learner pages** — `sanitizeSelfDirectedGamMaterialsOutput` strips facilitator headings/short blocks only; does not rewrite learner pedagogy; preserves tables/worked examples; cognition GAM wording corrected; no new PEC, renderer, topology, or runtime blocking | `buildSelfDirectedGamLearnerVoicePromptBlock`; `evaluatePelGamMaterialStabilisation`; `tests/workflow-pel-reasoning.test.js` (30-2b); Factory P30-01/P30-02 re-run; **466** tests pass | **GAP-30-10 closed** (GAM materials); Design Page `facilitator_notes` deferred to 30-2c |
| R30-012 | 2026-06-01 | **Self-directed Design Page row sanitisation closes facilitator_notes leakage before render while preserving facilitated workflows** — `sanitizeSelfDirectedLearnerPageActivityRows` strips facilitator row fields and choreographic `support_note` on learner-profile self-directed pages only; learner-facing support notes preserved; integrated in `applyPedagogicCognitionSemanticsToComposedPage`; probe runner audits page rows; no renderer, PEC resolver, DLA/GAM prompts, or topology changes | `sanitizeSelfDirectedLearnerPageActivityRows`; `tests/workflow-pel-reasoning.test.js` (30-2c); **471** tests pass | **Design Page facilitator_notes risk closed** (self-directed learner pages); **Phase 2 closed** — resume Phase 3 chartering |
| R30-013 | 2026-06-01 | **Phase 3 constrained by anti-scaffold-saturation and passive-renderer principles** — post–Phase 2 governance doc captures PEC layering, E→O→G→C→R discipline, bounded sanitisation, field-density caps, and explicit exclusion of adaptive tutoring / learner modelling; `metacognition_contract` chartering only; **no implementation authorised** | [`phase-3-design-constraints.md`](phase-3-design-constraints.md); [`CURRENT-STATE.md`](CURRENT-STATE.md) Phase 3 planning | Draft `slice-30-3-charter.md` before any Phase 3 code |
| R30-999 | 2026-06-01 | **Sprint 30 formally closed** after successful cross-domain operational validation (P30-01 Marx, P30-02 RNA/HCV, regression floor **471**). Phases 1–2 complete; Phase 3 deferred. Future work moves to **presentation/rhetoric refinement** (Sprint 31 seed) rather than additional pedagogic PEC expansion | [`SPRINT-30-RETROSPECTIVE.md`](SPRINT-30-RETROSPECTIVE.md); [`sprint-31-seed-notes.md`](sprint-31-seed-notes.md); [`CURRENT-STATE.md`](CURRENT-STATE.md) | Charter Sprint 31 when ready — not pedagogy expansion |

---

## Pending decisions

| Topic | Options | Decide by |
|-------|---------|-----------|
| Page-level `study_orientation` section vs activity-only | Section `overview` enrich vs activity JSON only | Live probes / 30-2 if needed |
| PEC evaluator strictness | **Warn/test only** (30-1c) vs block at runtime | **Closed for Phase 1** — warn only; no runtime block |
| GAM role in orientation | DLA-only (30-1 PEC) vs GAM material voice (30-1c) | **Closed** — PEC on DLA/Design Page; GAM gets self-directed **material voice** scaffold only |
| Reasoning field renderer passthrough | Add minimal display for `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt`, `disciplinary_lens` | **Closed** — **30-2r** (R30-010) |
| GAM facilitator leakage / anti-redundancy | Prompt-only vs prompt + sanitiser | **Closed** — **30-2b** (R30-011); Option B (prompt + narrow sanitiser) |
| Design Page `facilitator_notes` on activity rows | Strip vs preserve vs renderer exposure | **Closed** — **30-2c** (R30-012); composition sanitisation before render |
| Phase 3 implementation | Charter first vs implement immediately | **Closed** — governance in [`phase-3-design-constraints.md`](phase-3-design-constraints.md) (R30-013); **no implementation authorised** until `slice-30-3-charter.md` approved |
| Metacognition field set size | Full charter §6 vs small Phase 3 | **Deferred with Sprint 30 close** — see [`phase-3-design-constraints.md`](phase-3-design-constraints.md) |
| Sprint 31 scope | Pedagogy vs presentation | **Closed** — Sprint 31 is presentation/rhetoric only ([`sprint-31-seed-notes.md`](sprint-31-seed-notes.md)) |

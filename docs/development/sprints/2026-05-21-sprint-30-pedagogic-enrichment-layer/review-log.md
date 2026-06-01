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
| R30-008 | 2026-06-01 | **Phase 1 stabilisation:** self-directed GAM learner voice guard + non-blocking orientation evaluator (`evaluatePelOrientationContractSatisfaction` / `evaluatePedagogicEnrichmentContractSatisfaction`); no renderer, topology, cognition-pack, new PEC, or `reasoning_contract` changes | `buildSelfDirectedGamLearnerVoicePromptBlock`; `tests/workflow-pel-orientation.test.js` (30-1c); **445** tests pass | Re-run Factory probes; charter **30-2** |

---

## Pending decisions

| Topic | Options | Decide by |
|-------|---------|-----------|
| Page-level `study_orientation` section vs activity-only | Section `overview` enrich vs activity JSON only | Live probes / 30-2 if needed |
| PEC evaluator strictness | **Warn/test only** (30-1c) vs block at runtime | **Closed for Phase 1** — warn only; no runtime block |
| GAM role in orientation | DLA-only (30-1 PEC) vs GAM material voice (30-1c) | **Closed** — PEC on DLA/Design Page; GAM gets self-directed **material voice** scaffold only |

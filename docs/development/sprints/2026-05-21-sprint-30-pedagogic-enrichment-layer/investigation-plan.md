# Sprint 30 investigation / implementation plan

**Mode:** Phased delivery — 30-0 docs only; 30-1+ implementation per slice charters.

---

## Phase 30-0 — Initialise (complete)

| Step | Action | Output |
|------|--------|--------|
| 0.1 | Charter + PEC architecture | [`sprint-30-charter.md`](sprint-30-charter.md), [`pec-registry.md`](pec-registry.md) |
| 0.2 | Handover pack + context files | [`HANDOVER.md`](HANDOVER.md), [`context-files/`](context-files/) |
| 0.3 | Probe catalogue | [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md) |
| 0.4 | Baseline test floor | **430** — [`context-files/baseline-test-floor.md`](context-files/baseline-test-floor.md) |

---

## Phase 30-1 — Orientation & narrative coherence

| Step | Action | Evidence |
|------|--------|----------|
| 1.1 | Approve [`slice-30-1-charter.md`](slice-30-1-charter.md) | Review log R30-001 |
| 1.2 | Implement `orientation_contract` prompt blocks (DLA, Design Page) | Unit tests |
| 1.3 | Live run P30-01 (Marx) | `context-files/probe-p30-01-marx-live.md` (create on run) |
| 1.4 | Live run P30-02 (RNA) | `context-files/probe-p30-02-rna-live.md` |
| 1.5 | Regression P30-03 (workshop) | Automated tests only |
| 1.6 | Update enrichment matrix rows | [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md) |
| 1.7 | Minimal renderer passthrough (if new keys) | Kitchen-sink or Marx fixture |

**Exit criteria:** Orientation rubric pass on P30-01/02; **430+** tests; P30-03 unchanged topology/defaults.

---

## Phase 30-2 — Reasoning & scaffolding

| Step | Action |
|------|--------|
| 2.1 | Charter `slice-30-2-charter.md` (create when 30-1 closes) |
| 2.2 | `reasoning_contract` + partial `disciplinary_thinking_contract` on DLA/GAM |
| 2.3 | Timeline / table redundancy guards (extend existing GAM scaffolds) |
| 2.4 | Matrix + probe re-runs |

---

## Phase 30-3 — Metacognition & synthesis

| Step | Action |
|------|--------|
| 3.1 | Charter `slice-30-3-charter.md` |
| 3.2 | `metacognition_contract` + page `synthesis_prompt` |
| 3.3 | Ensure assessment visibility rules (Sprint 27) not violated |
| 3.4 | Closure note + programme `current-state.md` update |

---

## Read-only investigation (optional before 30-1 code)

| # | Question | Where to look |
|---|----------|---------------|
| 1 | Which activities lack `activity_preamble` on Marx fixture? | `tests/fixtures/workflow-brief/marx-dla-procedural-output.json` |
| 2 | Does Design Page drop orientation fields? | `mergeSelfDirectedActivityFramingFieldsIntoPageActivities` |
| 3 | Overview vs learning_purpose overlap? | Page JSON sections in Marx render fixture |

---

## Out of plan (explicit)

- New workflow steps
- New cognition packs (Sprint 28 ontology)
- Sprint 29 renderer redesign
- Illustration / diagram pipeline
- Adaptive tutoring

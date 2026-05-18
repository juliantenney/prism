# Sprint 23 — current state

**Date:** 2026-05-18  
**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`  
**Sprint:** 23 — Learning Design pack rationalisation  
**Status:** **Complete** — Slices **23-1–23-6** closed

**Closeout:** [`sprint-23-closeout.md`](sprint-23-closeout.md)

**Predecessor:** [`../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md)

**Entry point (historical):** [`GPT-bootstrap-sprint-23.md`](GPT-bootstrap-sprint-23.md) · [`sprint-23-bootstrap.md`](sprint-23-bootstrap.md)

---

## Architectural headline

**Sprint 23 completes the transition from emergent LD semantics to governed declarative pack semantics.**

Elicitation initialises persistent pedagogical state; pack metadata is declarative pedagogy; Settings is operational authority after synthesis.

---

## Sprint summary

| Sprint | Status |
|--------|--------|
| **Sprint 23** | **Complete** — see [`sprint-23-closeout.md`](sprint-23-closeout.md) |
| **Sprint 22** | **Feature-complete (chartered slices)** — unified Settings + LD metadata expansion (**185** tests documented) |
| **Sprint 21** | **Closed** — **149 tests** |
| **Sprint 20** | **Closed** — **135 tests** |

---

## Verification floor

```bash
node --test tests/*.test.js
```

| Metric | Value |
|--------|-------|
| **Tests (Sprint 23 closeout)** | **195 passed**, 0 failed |
| **Research fixtures** | S1–S13 — **frozen** unless chartered |

---

## What Sprint 23 delivered

| Area | Outcome |
|------|---------|
| **23-1** | LD semantics matrix — [`ld-semantics-matrix.md`](ld-semantics-matrix.md) |
| **23-2** | Elicitation alignment model — [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md) |
| **23-3** | PF bespoke-control audit — [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md) |
| **23-4** | Workflow vs step parameter ownership — [`ld-parameter-ownership-model.md`](ld-parameter-ownership-model.md) |
| **23-5** | Design Assessment semantics — [`ld-design-assessment-semantics.md`](ld-design-assessment-semantics.md) |
| **23-6** | Pack metadata rationalisation applied — [`slice-23-6-charter.md`](slice-23-6-charter.md) |

### Pack metadata (post-23-6)

| Category | Count | Notes |
|----------|-------|--------|
| `workflowParameterControls` | **4** | `delivery_context`, `design_scope`, `input_strategy`, `duration_minutes` |
| `stepParameterControls` | **39** | Was **25** pre-23-6 |
| Design Assessment controls | **7** | Canonical assessment authority |
| Generate Assessment Items controls | **10** | Inherits from DA by default; explicit override wins |
| `assessmentPolicy` | **1** | Declared in `workflowBriefConfig` |
| Unmatched | `step_generate_learning_content` | Still no pack-declared step controls |

### Assessment doctrine (closed)

- **Design Assessment** (`step_design_assessment`) = canonical assessment authority.
- **Generate Assessment Items** inherits `response_formats`, `number_of_items`, `difficulty_profile`, `coverage_mode` from DA by default.
- PF ids aligned with pack controls; runtime inheritance preserved with canonical-key compatibility (`difficulty_profile` / `coverage_scope` + legacy fallback).
- **Research packs untouched.** **No Settings redesign.**

---

## Out of scope / future work

| Item | Notes |
|------|--------|
| Renderer / v1 UX | Not Sprint 23 |
| Runtime inheritance retirement | Optional charter after parity gates (`ld-design-assessment-semantics.md` §10.2) |
| Immediate runtime rewrite | Not planned |
| Provenance redesign | Sprint 20 preserved |
| Workflow graph redesign | Out of scope |
| Cross-pack consistency | Later (Research frozen in Sprint 23) |

---

## Architectural position (carry forward)

| Check | Requirement |
|-------|-------------|
| Unified Settings | Sprint 22 model — no redesign |
| Controls source | Pack `workflowBriefConfig` — no `mappingRules` auto-promotion |
| Sprint 21 renderer / `[PRISM_STEP_PARAMS]` | Reuse |
| Synthesis / adequacy / provenance | Unchanged unless chartered |
| Domain-pack agnostic runtime | Pack edits preferred over LD branches |

---

## References

| Document | Role |
|----------|------|
| [`sprint-23-closeout.md`](sprint-23-closeout.md) | **Authoritative closeout** |
| [`sprint-23-index.md`](sprint-23-index.md) | Pack index |
| [`review-log.md`](review-log.md) | Decisions R23-001–R23-048 |
| [`HANDOVER.md`](HANDOVER.md) | Boundaries and handover |
| [`ld-semantics-matrix.md`](ld-semantics-matrix.md) | Slice 23-1 |
| [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md) | Slice 23-2 |
| [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md) | Slice 23-3 |
| [`ld-parameter-ownership-model.md`](ld-parameter-ownership-model.md) | Slice 23-4 |
| [`ld-design-assessment-semantics.md`](ld-design-assessment-semantics.md) | Slice 23-5 |
| [`slice-23-1-charter.md`](slice-23-1-charter.md) … [`slice-23-6-charter.md`](slice-23-6-charter.md) | Slice charters (closed) |
| LD pack (live) | `domains/learning-design/domain-learning-design-step-patterns.md` |

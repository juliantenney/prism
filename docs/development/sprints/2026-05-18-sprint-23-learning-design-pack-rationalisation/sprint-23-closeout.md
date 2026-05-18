# Sprint 23 closeout — Learning Design pack rationalisation

**Date:** 2026-05-18  
**Status:** **Complete**  
**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`

**Predecessor:** [Sprint 22 — unified workflow Settings](../2026-05-15-sprint-22-unified-workflow-settings/)

---

## Architectural headline

**Sprint 23 completes the transition from emergent LD semantics to governed declarative pack semantics.**

Elicitation initialises persistent pedagogical state; pack metadata is declarative pedagogy; Settings is operational authority after synthesis. Sprint 22 delivered the generic runtime surfaces; Sprint 23 rationalised what the Learning Design pack *means* on those surfaces.

---

## Sprint status

| Item | Status |
|------|--------|
| **Sprint 23** | **Complete** |
| **Slices 23-1–23-6** | **Closed** |
| **Final verification** | **195 passed**, 0 failed |

```bash
node --test tests/*.test.js
```

---

## Delivered outcomes

### Governance and audit (Slices 23-1–23-5)

| Deliverable | Slice | Document |
|-------------|-------|----------|
| LD semantics matrix | 23-1 | [`ld-semantics-matrix.md`](ld-semantics-matrix.md) |
| Elicitation alignment model | 23-2 | [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md) |
| PF bespoke-control audit | 23-3 | [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md) |
| Workflow vs step parameter ownership model | 23-4 | [`ld-parameter-ownership-model.md`](ld-parameter-ownership-model.md) |
| Design Assessment semantics model | 23-5 | [`ld-design-assessment-semantics.md`](ld-design-assessment-semantics.md) |

### Pack implementation (Slice 23-6)

| Outcome | Detail |
|---------|--------|
| LD pack metadata rationalisation applied | `domains/learning-design/domain-learning-design-step-patterns.md` |
| `stepParameterControls` expanded | **25 → 39** |
| Design Assessment declared controls | **7** (`activity_type`, `total_items`, `coverage_scope`, `difficulty_profile`, `cognitive_demand`, `assessment_cadence`, `feedback_display`) |
| Generate Assessment Items declared controls | **10** (all `settings-only` elicitation) |
| Design Assessment = canonical assessment authority | Documented + `assessmentPolicy` block |
| Generate Items inherits by default | Explicit downstream override wins |
| PF ids aligned with pack controls | DA PF renamed; Gen PF deduped via pack ownership |
| `assessmentPolicy` block added | Authority step + inheritance rows in `workflowBriefConfig` |
| Runtime inheritance preserved | `resolveAssessmentItemsInheritedOptions` retained; canonical-key compatibility added |
| Research packs | **Untouched** |
| Unified Settings | **No redesign** |

### Refinement and hygiene

- Reduced re-asking for assessment factors now owned by params/Settings (`assessment_type`, `assessment_total_items` no longer `mustAsk`).
- `assessment_required` remains topology-only (not a Settings control).
- Construct Sequence PF `duration_minutes` id aligned with step control.
- DLA `activity_pattern_mix` PF option + template constraint.
- `delivery_context` `extraFields` duplication removed (workflow-level control retained).

---

## Slice summary

| Slice | Focus | Status |
|-------|--------|--------|
| **23-1** | LD pack inventory + semantics matrix | **Closed** |
| **23-2** | Elicitation alignment + burden reduction | **Closed** |
| **23-3** | Prompt Factory bespoke-control audit | **Closed** |
| **23-4** | Workflow vs step parameter ownership | **Closed** |
| **23-5** | Design Assessment semantics | **Closed** |
| **23-6** | Pack metadata rationalisation (apply) | **Closed** |

---

## Preserved (explicit non-goals)

| Area | Sprint 23 position |
|------|-------------------|
| Unified Settings surface | Sprint 22 model stands — no redesign |
| Sprint 21 renderer / `[PRISM_STEP_PARAMS]` | Reused |
| Synthesis / adequacy / provenance | Unchanged |
| Research packs | Frozen |
| `mappingRules` auto-promotion | Rejected — controls authored deliberately |

---

## Out of scope / future work

| Item | Notes |
|------|--------|
| **Renderer / v1 UX** | Not in Sprint 23 programme |
| **Runtime inheritance retirement** | Optional charter after parity gates in `ld-design-assessment-semantics.md` §10.2 |
| **Immediate runtime rewrite** | Not planned — pack-first doctrine holds |
| **Provenance redesign** | Sprint 20 model preserved |
| **Workflow graph redesign** | Out of scope |
| **Cross-pack consistency** | Later programme (Research frozen in Sprint 23) |
| **`step_generate_learning_content`** | Still no pack-declared step controls — documented gap |

---

## Key references

| Document | Role |
|----------|------|
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Post-close state + test floor |
| [`sprint-23-index.md`](sprint-23-index.md) | Pack index |
| [`review-log.md`](review-log.md) | Decisions R23-001–R23-048 |
| [`HANDOVER.md`](HANDOVER.md) | Boundaries and continuity |
| LD pack (live) | `domains/learning-design/domain-learning-design-step-patterns.md` |

---

## Verification record

| Checkpoint | Result |
|------------|--------|
| Sprint closeout | **195 passed**, 0 failed |

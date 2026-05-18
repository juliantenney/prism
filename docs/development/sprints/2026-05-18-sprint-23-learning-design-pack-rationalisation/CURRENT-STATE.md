# Sprint 23 — current state

**Date:** 2026-05-18  
**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`  
**Sprint:** 23 — Learning Design pack rationalisation  
**Status:** **Slice 23-1 closed** — semantics matrix complete; **no pack/runtime implementation**

**Predecessor:** [`../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md)

**Entry point:** [`GPT-bootstrap-sprint-23.md`](GPT-bootstrap-sprint-23.md) · [`sprint-23-bootstrap.md`](sprint-23-bootstrap.md)

---

## Active sprint summary

| Sprint | Status |
|--------|--------|
| **Sprint 23** | **Active** — Slice **23-1** closed; **23-2+** not chartered |
| **Sprint 22** | **Feature-complete (chartered slices)** — **185 tests** documented — unified Settings + LD metadata expansion |
| **Sprint 21** | **Closed** — **149 tests** |
| **Sprint 20** | **Closed** — **135 tests** |

---

## Verification floor

```bash
node --test tests/*.test.js
```

| Metric | Value |
|--------|-------|
| **Tests (Sprint 22 documented)** | **185 passed**, 0 failed |
| **Bootstrap expectation** | **185+** passed, 0 failed — no code delta in bootstrap |
| **Research fixtures** | S1–S13 — **frozen** unless chartered |

Run the suite at session start; treat any count above **185** as the current floor until Sprint 23 slices add tests.

---

## Sprint 22 predecessor summary (baseline for Sprint 23)

| Delivered | Notes |
|-----------|--------|
| **`[Run] [Settings] [Edit]`** | Unified workflow mode chrome |
| **Included-step aggregation** | Pack-agnostic; `canonical_step_id` scoped |
| **`workflowParameterControls`** | 4 LD workflow tunables |
| **`stepParameterControls`** | 25 LD step tunables (expanded) |
| **Brief-config recovery** | Async load + Save merge (22-2a–c) |
| **Discoverability** | Badge, save hint, planning/provenance → Settings |
| **Runtime architecture** | **Preserved** for Sprint 23 — no redesign assumed |

**Intentional gap carried into Sprint 23:** `step_generate_learning_content` has no pack-declared step controls; Design Assessment has **legacy runtime inheritance** and PF bespoke behaviour to audit.

---

## Gap statement (why Sprint 23 exists)

Sprint 22 made **structured pedagogical state** operable at workflow scale via unified Settings. The **LD pack metadata** expanded to cover core steps, but:

- **Elicitation** may still duplicate questions answerable via Settings or synthesis.  
- **`mappingRules`**, **PF `userOptions`**, and **`*ParameterControls`** may diverge semantically.  
- **Bespoke Prompt Factory / runtime branches** (notably **Design Assessment**) may predate pack-declared controls.  
- **Workflow vs step parameter ownership** (especially assessment) is not fully documented.  

Sprint 23 closes the **semantics and metadata** gap — not the **Settings surface** gap.

---

## Priority review area

**Design Assessment** (`step_design_assessment`):

- Pack-declared controls exist (`activity_type`, `total_items`, etc.).  
- Runtime still contains **canonical/title-specific** logic for downstream generate-items inheritance.  
- Assessment vocabulary spans brief factors, workflow constraints, and step params — needs a **single precedence story**.

---

## Architectural position (must preserve)

| Check | Requirement |
|-------|-------------|
| Unified Settings | **No redesign** — Sprint 22 model stands |
| Controls source | Pack `workflowBriefConfig` only — no `mappingRules` auto-promotion |
| Sprint 21 renderer / `[PRISM_STEP_PARAMS]` | Reuse |
| Synthesis / adequacy / provenance | Unchanged unless explicitly chartered |
| Domain-pack agnostic runtime | Pack edits preferred over LD branches |

---

## LD pack metadata (Sprint 22 handoff)

| Category | Count | Notes |
|----------|-------|--------|
| `workflowParameterControls` | **4** | `delivery_context`, `design_scope`, `input_strategy`, `duration_minutes` |
| `stepParameterControls` | **25** | Core LD chain; see Sprint 22 review-log |
| Unmatched example | `step_generate_learning_content` | Charter decision in Sprint 23 |

---

## References

| Document | Role |
|----------|------|
| [`sprint-23-index.md`](sprint-23-index.md) | Pack index |
| [`review-log.md`](review-log.md) | Decisions log |
| [`HANDOVER.md`](HANDOVER.md) | Boundaries and handover |
| [`ld-semantics-matrix.md`](ld-semantics-matrix.md) | Slice 23-1 audit deliverable |
| [`slice-23-1-charter.md`](slice-23-1-charter.md) | Slice 23-1 charter (closed) |

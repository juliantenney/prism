# Session Handover — Sprint 23 portable pack

**Role:** historical handover for the Sprint 23 pack (sprint **complete**).

**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`

**Date:** 2026-05-18

**Status:** **Complete** — see [`sprint-23-closeout.md`](sprint-23-closeout.md)

**Predecessor:** [`../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md)

---

## Architectural headline

**Sprint 23 completes the transition from emergent LD semantics to governed declarative pack semantics.**

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 23** | **Complete** — slices 23-1–23-6 closed; **195** tests |
| **Sprint 22** | **Feature-complete (chartered slices)** — unified Settings |
| **Sprint 21** | **Closed** |

---

## What Sprint 23 delivered

### Governance (23-1–23-5)

- LD semantics matrix  
- Elicitation alignment model  
- PF bespoke-control audit  
- Workflow vs step parameter ownership model  
- Design Assessment semantics model  

### Pack implementation (23-6)

- `stepParameterControls`: **25 → 39**  
- Design Assessment: **7** declared controls; **canonical assessment authority**  
- Generate Assessment Items: **10** declared controls; **inherits by default**, explicit override wins  
- PF ids aligned with pack controls; `assessmentPolicy` block in pack  
- Runtime inheritance **preserved** with canonical-key compatibility (minimal fallback only)  
- Research packs **untouched**; unified Settings **not redesigned**  

---

## Conceptual model (carry forward)

| Surface | Content |
|---------|---------|
| **Elicitation** | Initialises structured state (burden reduced where params/Settings own values) |
| **Settings** | Operational parameter authority (workflow + included steps) |
| **Edit** | Step prompt drafts, implementation detail |
| **Run** | Execution and outcomes |
| **Prose brief** | Provenance / history — not sole semantic authority |

**Domain pack = declarative pedagogy.** Runtime = generic interpreter.

---

## Assessment doctrine (closed in Sprint 23)

| Rule | Detail |
|------|--------|
| Authority | `step_design_assessment` |
| Inheritance | Generate Items ← DA for `response_formats`, `number_of_items`, `difficulty_profile`, `coverage_mode` |
| Override | Explicit Gen step param wins over inherited default |
| Topology | `assessment_required` gates workflow shape — **not** a Settings control |
| Alias | Brief `assessment_type` → step `activity_type` (documented) |

---

## Preserved from Sprint 22 (do not rebuild)

| Capability | Source |
|------------|--------|
| Unified Settings `[Run] [Settings] [Edit]` | Sprint 22 |
| Workflow + included-step aggregation | Sprint 22 |
| Generic renderer + `[PRISM_STEP_PARAMS]` | Sprint 21–22 |
| Pack-agnostic discovery | Sprint 22 |
| Provenance + discoverability | Sprint 20 |

Sprint 23 **rationalised pack meaning** on these surfaces — it did not replace them.

---

## Out of scope / future work

| Item | Notes |
|------|--------|
| Renderer / v1 UX | Not Sprint 23 |
| Runtime inheritance retirement | Optional charter after parity gates (`ld-design-assessment-semantics.md` §10.2) |
| Immediate runtime rewrite | Not planned |
| Provenance redesign | Sprint 20 preserved |
| Workflow graph redesign | Out of scope |
| Cross-pack consistency | Later programme |
| `step_generate_learning_content` | Still no pack step controls — documented gap |

---

## Verification

```bash
node --test tests/*.test.js
```

**Sprint 23 closeout:** **195 passed**, 0 failed.

---

## Where to start next

1. [`sprint-23-closeout.md`](sprint-23-closeout.md) — authoritative delivered/out-of-scope summary  
2. [`CURRENT-STATE.md`](CURRENT-STATE.md) — test floor and pack counts  
3. [`ld-design-assessment-semantics.md`](ld-design-assessment-semantics.md) — assessment doctrine + retirement gates  
4. Live pack: `domains/learning-design/domain-learning-design-step-patterns.md`

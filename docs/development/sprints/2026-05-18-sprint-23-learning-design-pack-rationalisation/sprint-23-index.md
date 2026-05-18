# Sprint 23 index — Learning Design pack rationalisation

**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`  
**Date:** 2026-05-18  
**Status:** **Complete** — Slices **23-1–23-6** closed

**Closeout:** [`sprint-23-closeout.md`](sprint-23-closeout.md)

**Predecessor:** [`../2026-05-15-sprint-22-unified-workflow-settings/`](../2026-05-15-sprint-22-unified-workflow-settings/)

**Verification:** **195 passed**, 0 failed (`node --test tests/*.test.js`)

---

## Architectural headline

**Sprint 23 completes the transition from emergent LD semantics to governed declarative pack semantics.**

---

## Portable pack (this folder)

| File | Purpose |
|------|---------|
| [`sprint-23-closeout.md`](sprint-23-closeout.md) | **Sprint closeout** — delivered outcomes + future work |
| [`GPT-bootstrap-sprint-23.md`](GPT-bootstrap-sprint-23.md) | Fresh-chat bootstrap (historical) |
| [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) | Alias → bootstrap |
| [`HANDOVER.md`](HANDOVER.md) | Purpose, boundaries, continuity |
| [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) | Goals, scope, risks, success criteria |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Post-close state + test floor |
| [`sprint-23-bootstrap.md`](sprint-23-bootstrap.md) | Thesis, focus areas, slice sketch |
| [`sprint-23-index.md`](sprint-23-index.md) | This index |
| [`review-log.md`](review-log.md) | Decisions R23-001–R23-048 |
| [`ld-semantics-matrix.md`](ld-semantics-matrix.md) | Slice 23-1 |
| [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md) | Slice 23-2 |
| [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md) | Slice 23-3 |
| [`ld-parameter-ownership-model.md`](ld-parameter-ownership-model.md) | Slice 23-4 |
| [`ld-design-assessment-semantics.md`](ld-design-assessment-semantics.md) | Slice 23-5 |
| [`slice-23-1-charter.md`](slice-23-1-charter.md) … [`slice-23-6-charter.md`](slice-23-6-charter.md) | Slice charters (closed) |
| [`context-files/README.md`](context-files/README.md) | Bounded snapshots |

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 23** | **Complete** — [`sprint-23-closeout.md`](sprint-23-closeout.md) |
| **Sprint 22** | **Feature-complete (chartered slices)** — **185 tests** documented |
| **Sprint 21** | **Closed** — **149 tests** |
| **Sprint 20** | **Closed** |

---

## Slice sequence (all closed)

| Slice | Focus | Status |
|-------|--------|--------|
| **23-1** | LD pack inventory + semantics matrix | **Closed** — [`ld-semantics-matrix.md`](ld-semantics-matrix.md) |
| **23-2** | Elicitation alignment + burden reduction | **Closed** — [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md) |
| **23-3** | Prompt Factory bespoke-control audit | **Closed** — [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md) |
| **23-4** | Workflow vs step parameter ownership | **Closed** — [`ld-parameter-ownership-model.md`](ld-parameter-ownership-model.md) |
| **23-5** | Design Assessment semantics | **Closed** — [`ld-design-assessment-semantics.md`](ld-design-assessment-semantics.md) |
| **23-6** | Pack metadata rationalisation (apply) | **Closed** — [`slice-23-6-charter.md`](slice-23-6-charter.md) |

---

## Programme thesis (achieved)

**Elicitation initialises persistent pedagogical state; pack metadata is declarative pedagogy; Settings is operational authority after synthesis.**

**Preserved:** Sprint 22 unified Settings runtime architecture.

**Not delivered (by design):** runtime rewrite, provenance redesign, workflow graph redesign, new synthesis architecture, Research pack changes, Settings redesign.

---

## Out of scope / future work

| Item | Notes |
|------|--------|
| Renderer / v1 UX | Future programme |
| Runtime inheritance retirement | After parity gates — `ld-design-assessment-semantics.md` §10.2 |
| Immediate runtime rewrite | Not planned |
| Provenance redesign | Sprint 20 preserved |
| Workflow graph redesign | Out of scope |
| Cross-pack consistency | Later |

---

## Architecture references

| Document | Path |
|----------|------|
| Sprint 22 pack | [`../2026-05-15-sprint-22-unified-workflow-settings/`](../2026-05-15-sprint-22-unified-workflow-settings/) |
| LD step patterns (live) | [`domains/learning-design/domain-learning-design-step-patterns.md`](../../../../domains/learning-design/domain-learning-design-step-patterns.md) |
| LD rationalisation audit | [`../../../audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md) |

---

## Verification

```bash
node --test tests/*.test.js
```

**Result:** **195 passed**, 0 failed.

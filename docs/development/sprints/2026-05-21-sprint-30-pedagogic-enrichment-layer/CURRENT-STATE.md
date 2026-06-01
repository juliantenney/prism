# Sprint 30 — current state

**Date:** 2026-05-21  
**Pack path:** `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/`  
**Status:** **Initialised** (30-0 documentation complete; implementation not started)

**Handover:** [`HANDOVER.md`](HANDOVER.md)  
**Charter:** [`sprint-30-charter.md`](sprint-30-charter.md)  
**First implementation slice:** [`slice-30-1-charter.md`](slice-30-1-charter.md)

---

## At a glance

| Item | State |
|------|--------|
| **30-0** Architecture + pack | **Complete** |
| **30-1** Orientation & narrative coherence | **Not started** |
| **30-2** Reasoning & scaffolding | **Not started** |
| **30-3** Metacognition & synthesis | **Not started** |
| **Tests** | **430 passing** (pre-PEL baseline) |
| **Runtime PEC code** | **None** |

---

## Programme context

| Prior sprint | Relevance to 30 |
|--------------|-----------------|
| [Sprint 28 cognition](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/) | Typed cognition fields + packs — **extend**, do not replace |
| [Sprint 29 renderer](../2026-05-21-sprint-29-renderer-cognition-semantics/) | `util-cognition*` display — **closed** |
| [Sprint 27 assessment](../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/) | Assessment semantics — **frozen** |
| May 2026 hotfixes | Self-directed framing, brief defaults, renderer kitchen-sink — **baseline** |

---

## Slice tracker

| Slice | Name | Status |
|-------|------|--------|
| 30-0 | Pack + PEC architecture docs | **Complete** |
| 30-1 | `orientation_contract` | Not started |
| 30-1b | Renderer passthrough (orientation fields) | Not started |
| 30-2 | `reasoning_contract` | Not started |
| 30-2b | GAM anti-redundancy (reasoning materials) | Not started |
| 30-3 | `metacognition_contract` + synthesis | Not started |
| 30-close | Evidence matrix + closure | Not started |

---

## Test coverage (baseline — extend per slice)

| Track | Test file |
|-------|-----------|
| Self-directed framing | `tests/workflow-self-directed-activity-framing-adoption.test.js` |
| Brief learner-resource defaults | `tests/workflow-brief-learner-resource-defaults.test.js` |
| Learner-page formatting | `tests/workflow-self-directed-learner-page-formatting.test.js` |
| Renderer kitchen-sink | `tests/utility-renderer-kitchen-sink.test.js` |
| RNA topology | `tests/workflow-ld-rna-sparse-brief-topology.test.js` |
| Cognition contracts | `tests/workflow-ld-cognition-contracts.test.js` |

**Command:** `node --test tests/*.test.js`

---

## Resume

1. Implement **30-1** per [`slice-30-1-charter.md`](slice-30-1-charter.md).  
2. Do not add workflow steps or cognition packs without new charter.  
3. Update [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md) after first live P30-01 / P30-02 runs.

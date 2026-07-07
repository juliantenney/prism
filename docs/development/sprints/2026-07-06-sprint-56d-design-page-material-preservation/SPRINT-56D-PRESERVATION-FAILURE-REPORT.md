# Sprint 56D — Preservation Failure Report

**Sprint:** 56D — Design Page Material Preservation Fix  
**Date:** 2026-07-06  
**Report type:** End-to-end failure analysis (observational)

**Authority:** [Sprint 56C Closure](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-CLOSURE-SUMMARY.md) (frozen) · [Generation Visibility Constraint](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md)

---

## Executive summary

A fresh end-to-end run on an **existing workflow** compared artefacts at each pipeline stage:

```
DLA output → GAM output → Design Page output → rendered HTML
```

**Finding:** Upstream stages preserved full learner-facing material bodies. The **workflow-generated** Design Page output **truncated, thinned, or summarised** those bodies. The HTML renderer **faithfully rendered** the already-thinned Design Page content.

**Failure boundary (observed):** GAM → Design Page compose  
**Failure type:** Material body truncation / summarisation / non-verbatim transport failure  
**Root cause:** **Unconfirmed** — runtime-path analysis required before assigning mechanism

**What the reproduction demonstrates:** Thinning is present in **workflow-generated Design Page outputs**. This is not evidence that application-side JS preservation or repair paths executed, or that they are the cause.

**Not classified as:**

| Ruled out | Rationale |
| --------- | --------- |
| DLA failure | DLA output contained complete material requirements M1–M15 |
| GAM failure | GAM output contained full learner-facing material bodies |
| Workflow regeneration issue | Same workflow reproduced the failure consistently |
| HTML renderer failure | Renderer displayed what Design Page artefact contained |
| CSS hiding issue | Content absent from page JSON, not merely hidden in DOM |

---

## Evidence chain

### Stage 1 — DLA (`learning_activities`)

| Observation | Status |
| ----------- | ------ |
| Material requirements M1–M15 present | **Pass** |
| Activity IDs and material IDs intact | **Pass** |
| Scaffold fields present per activity | **Pass** |

DLA correctly specified what materials each activity requires.

### Stage 2 — GAM (`activity_materials`)

| Observation | Status |
| ----------- | ------ |
| Full learner-facing material bodies for M1–M15 | **Pass** |
| Material IDs map to activity IDs | **Pass** |
| Bodies include multi-paragraph prose, worked steps, scenario detail | **Pass** |

GAM fulfilled its authoring role. Upstream content was complete before Design Page.

### Stage 3 — Design Page (`page` artefact)

| Observation | Status |
| ----------- | ------ |
| Material bodies match GAM verbatim | **Fail** |
| Truncation / excerpting / summarisation observed | **Fail** |
| Placeholder or instruction-like substitutes observed | **Fail** |

The Design Page **workflow step output** contains **thinned** `learning_activities.content[].materials.*` fields relative to GAM.

### Stage 4 — HTML renderer

| Observation | Status |
| ----------- | ------ |
| Rendered output matches Design Page JSON | **Pass** |
| Missing content in HTML where JSON already thin | **Consistent** |

Renderer behaved as a faithful presentation layer. It did not author, summarise, or hide full bodies that were absent from the page artefact.

---

## Observed material thinning examples

Representative regressions from the reproduction workflow:

| Material ID | GAM (upstream) | Design Page (downstream) | Failure pattern |
| ----------- | -------------- | ------------------------ | --------------- |
| **M1** | Full foundation text (multi-paragraph conceptual framing) | Short excerpt only | Body truncation |
| **M2** | Full worked example with visible evaluation steps | Short scenario excerpt | Worked example → synopsis |
| **M5** | Full recruitment scenarios with named cases and context | Short placeholder / excerpt | Scenario set → catalogue label |
| **M9** | Full modelling note with walkthrough examples | Short excerpt | Modelling note → framework label only |
| **M15** | Full consolidation summary with reflection prompts | Instruction-like placeholder | Consolidation → synthesis descriptor |

These patterns match anti-patterns documented in `lib/ld-materials-copy.js` (OPAQUE PAYLOAD TRANSPORT forbidden substitutes) and heuristics in `lib/design-page-materials-fidelity.js`. Matching policy text does not prove which execution path introduced the thinning.

---

## Diagnosis

### Failure boundary (observed)

```
GAM (activity_materials)
        │
        ▼
Design Page workflow runtime compose ──✗──► thinned page JSON (workflow output)
        │
        ▼
HTML renderer (faithful)
```

The defect appears **between GAM and the workflow-emitted Design Page artefact**. The reproduction does not establish whether thinning occurs:

- during Design Page LLM compose (primary suspect for workflow runs), or
- in a later application post-processing step (unproven for this reproduction)

### Execution-path note

Workflow-run outputs are generated by **workflow LLM steps**. JavaScript preservation hooks, post-compose merge layers, and app-side repair paths in the Prism codebase are **not assumed** to participate in a workflow reproduction unless execution is proven ([OQ-56D-00](SPRINT-56D-OPEN-QUESTIONS.md)).

### Mechanism classes (unconfirmed — investigate in order)

1. **Design Page runtime compose** — LLM condenses material bodies despite prompt contracts (workflow path)
2. **Design Page input payload** — GAM bodies not fully available or bound in step context (workflow path)
3. **Prompt contract competition** — compose/materials-copy obligations present but insufficient at runtime (workflow path)
4. **Application post-processing** — only if OQ-56D-00 proves JS paths executed on this run

**Root cause remains unconfirmed** until workflow runtime-path analysis is complete and OQ-56D-00 is answered.

### Required conclusions

> **The HTML renderer is not the first failure point.**

> **The reproduction demonstrates thinning in workflow-generated Design Page outputs.** Fix selection must follow proven execution-path analysis — not assumptions about application-side preserve hooks.

Fix effort must restore **verbatim GAM → Design Page material transport** on the **proven** path, without renderer changes, CSS investigation, or DLA/GAM re-authoring unless new evidence proves upstream failure.

---

## Architectural alignment note

Sprint 56C froze the correct **policy**: Design Page is transport-first; material bodies are archival L4 payloads. The observed failure is a **compliance gap** relative to that policy. This report does not reopen 56C governance conclusions or CP-4. Fixes must restore compliance on the proven execution path.

---

## Related prior audits

| Artefact | Relevance |
| -------- | --------- |
| [Sprint 55 Content Preservation Audit](../../2026-06-29-sprint-55-educational-product-experience/SPRINT-55-CONTENT-PRESERVATION-AUDIT.md) | Documents similar LLM compose thinning |
| [Sprint 38B Materials Fidelity](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-4-materials-and-table-fidelity.md) | Placeholder collapse pattern |
| `lib/design-page-materials-fidelity.js` | Placeholder/synopsis detection heuristics |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56D-PRESERVATION-FAILURE-REPORT.md` |
| Sprint | 56D |
| Status | Active evidence baseline |

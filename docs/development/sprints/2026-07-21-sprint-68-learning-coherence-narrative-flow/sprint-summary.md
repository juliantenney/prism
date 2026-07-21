# Sprint 68 — Summary

**Sprint:** 68 — Learning Coherence and Narrative Flow  
**Status:** **Chartered** (2026-07-21) — planning complete; implementation not started  
**Predecessor:** Sprint 67 closed — vNext renderer functionally complete  

---

## Purpose

Improve learner coherence where existing authoritative data supports it, and validate where renderer limitations are actually lesson-model or pipeline limitations.

```text
Authoritative lesson data → classify ownership → renderer fix OR evidence for pipeline/schema
```

Sprint 68 produces both coherence improvements **and** a validated boundary between pipeline authoring and renderer presentation.

---

## Expected outputs

| Output | Description |
| ------ | ----------- |
| Renderer improvements | Where existing model data supports better placement or presentation |
| Validated renderer/model boundary | Each issue classified: renderer, render model, schema, or pipeline |
| Render model gap analysis | Mapping deficiencies between JSON and page model |
| Pipeline enhancement evidence | Deferred schema register with minimal, justified proposals |
| Lesson model recommendations | Evidence-based evolution — not speculative features |

Deferral of some improvements is **success**, not failure, when pedagogical information is absent from the current lesson model.

---

## Guiding principles

> Improve the learner experience using authoritative lesson data before extending the lesson schema.

> The renderer renders. The pipeline authors.

| Workstream | Status |
| ---------- | ------ |
| Sprint planning and handover | **Complete** (setup task) |
| Activity-to-activity bridging investigation | **Next** |
| Narrative continuity | Pending |
| Orientation effectiveness | Pending |
| Progression guidance | Pending |
| Beat sequencing presentation | Pending |
| Instructional flow coherence | Pending |
| Repetition reduction | Pending |
| Schema gap analysis (deferred until renderer-first exhausted) | Pending |

---

## Progress

See [backlog.md](backlog.md). Next: **S68-BL-001**.

---

## Predecessor inheritance

* Sprint 67 vNext renderer is the production default for new exports.
* Do not reopen Sprint 67 CSS, navigation shell, or iconography unless a coherence fix requires a minimal presentation tweak (unlikely in early investigation).
* Legacy renderer remains available via explicit `rendererVersion: "legacy"`.

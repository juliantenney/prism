# Sprint 31 — planning seed notes

**Status:** Seed only — **NOT a charter**  
**Date:** 2026-06-01  
**Predecessor:** [Sprint 30 CLOSED](SPRINT-30-RETROSPECTIVE.md) (PEL Phases 1–2 complete)

---

## Programme intent

Sprint 31 improves **how enriched learner pages feel to read** — not **how much pedagogy the generator adds**.

> **Sprint 31 is not a pedagogy-expansion sprint.**

Do not add new PECs, new cognition fields, workflow steps, or `metacognition_contract` implementation under this programme label without explicit re-charter.

---

## Problem statement (from Sprint 30 close)

Sprint 30 proved that orientation and reasoning cues can be **generated, composed, sanitised, and rendered** reliably. Remaining pain is **presentation**:

- Cue stacking and visual noise
- Label rhetoric that feels instructional but heavy
- Uneven pacing between preamble, cues, task, and materials
- Intro/preamble redundancy at page level
- Optional fields all rendering with similar visual weight

---

## Focus areas (candidate)

| Area | Intent |
|------|--------|
| **Renderer rhetoric** | Tune labels, tone, and ordering of passive cues (“How to think”, “Using evidence”, etc.) |
| **Density modulation** | Reduce simultaneous cues; collapse or hide redundant structures when JSON overlaps |
| **Cue prominence tuning** | Differentiate primary task vs secondary orientation vs optional nudge |
| **Visual pacing** | Whitespace, section rhythm, activity block breathing room |
| **Typography hierarchy** | Headings, cue labels, body text — clearer scan path |
| **Concept presentation consistency** | Tables, cards, templates share calm visual language |
| **Calmness / readability** | Fewer competing borders, badges, and icon rows where not essential |
| **Adaptive omission (optional)** | Renderer-side dedupe/omit when cue text substantially duplicates `learner_task` or prior cue (still **non-generative**) |

---

## Explicit non-goals for Sprint 31

| Out of scope |
|--------------|
| New PECs (`metacognition_contract`, expanded `disciplinary_thinking_contract`) |
| DLA/GAM prompt expansion for more fields |
| Workflow topology changes |
| Adaptive tutoring, chat, learner modelling |
| Runtime LLM in renderer |
| Assessment semantics (Sprint 27 frozen) |
| Cognition-pack ontology changes (Sprint 28 boundary) |

---

## Relationship to deferred Sprint 30 Phase 3

`metacognition_contract` remains **deferred**. Sprint 31 should **not** be used as a backdoor to add metacognitive generation. If metacognition is revived later, it requires a **new charter** after presentation baseline improves.

See [`phase-3-design-constraints.md`](phase-3-design-constraints.md).

---

## Success signals (draft — for future charter)

- Marx and RNA live HTML score better on **calmness** and **scan path** rubrics (manual)
- Kitchen-sink fixture documents expected cue hierarchy
- No regression below Sprint 30 test floor (**471** unless documented)
- Facilitated/workshop pages unchanged
- No new fields required in DLA for presentation wins

---

## Suggested first artefacts (when chartering)

1. `slice-31-1-charter.md` — renderer rhetoric + density (read-only presentation)
2. Visual rubric appendix (cue prominence, pacing)
3. Re-run P30-01 / P30-02 HTML review — presentation-only checklist

---

## References

| Doc | Use |
|-----|------|
| [`SPRINT-30-RETROSPECTIVE.md`](SPRINT-30-RETROSPECTIVE.md) | Why Sprint 31 exists |
| [`phase-3-design-constraints.md`](phase-3-design-constraints.md) | Anti-scaffold-saturation rules still apply |
| [`context-files/live-artefacts/`](context-files/live-artefacts/) | Marx/RNA HTML review targets |

# Sprint 50 Charter — Pedagogic Manifestation and Learner Experience

**Status:** Planned  
**Predecessor:** Sprint 49 — SP-01 Text Pattern (closed **Complete with follow-on work**)  
**Primary evidence:** [`../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/`](../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/)

---

## 1. Sprint Goal

**Move from pedagogy preserved → pedagogy experienced.**

Sprint 49 established that the Marx self-directed learner-page pipeline **can** generate mandatory framing fields, cognition-orientation signals, and substantive connective exposition — and **can** carry them through GAM, Design Page compose, and renderer output.

Sprint 50 asks a different question:

> When a learner opens the rendered page, does the pedagogy **read coherently**, **guide attention**, and **feel self-explanatory** — without requiring them to infer structure from buried JSON or thin visual hierarchy?

Improvement should come from **manifestation** (compose fidelity, renderer salience, reading order, Journey Compass usefulness) — not from adding prompt layers or new mandatory contracts.

---

## 2. Explicit Non-Goals

Unless fresh evidence **demands** a narrow exception, Sprint 50 does **not** charter:

| Non-goal | Rationale |
| -------- | --------- |
| New cognition ontology | D-49-01 and LD-COGNITION-ORIENTATION are settled |
| OUTPUT CONTRACT expansion | Sprint 49 rejected sprawl; schema + small modules suffice for generation |
| New workflow gates | DLA Framing Gate v1 + GAM capture gate are stable |
| Auto-repair / auto-retry on capture failure | Explicitly rejected in Sprint 49 |
| Major prompt architecture work | C1–C4, SP-01–SP-06, preamble/cognition modules complete |
| Schema redesign | Domain `activities[]` authority aligned in Sprint 49 |
| Reopening SP-01 / D-49-01 / FM-07 | Maintain-test only |
| Facilitator workflow changes | Scope remains self-directed learner-page |

**Exception rule:** If manifestation investigation proves a field never reaches `page.json` and renderer repair masks the gap, a **targeted compose-fidelity fix** is in scope — not a new contract layer.

---

## 3. Primary Investigation Areas

High-level investigation themes only. Sprint 50 is orientation-first; slice breakdown follows audit findings.

### Learner guidance visibility

- Do orientation cues (preamble, “Before you start”, Journey Compass) **own attention** or compete with activity titles and materials?
- Is the learner’s first-read path obvious without facilitator narration?

### Cognition manifestation

- Are cognition-orientation fields (`reasoning_orientation`, `self_explanation_prompt`, etc.) **visually and rhetorically distinct** from task instructions?
- Does the renderer’s `util-cognition*` / framing block hierarchy match pedagogic intent?

### PEL manifestation

- Does PEL (preamble + cognition + support) **frame** the activity before the learner reaches materials?
- Is PEL present in data **and** salient in layout?

### Activity intelligibility

- Can a learner answer: *what am I doing, why, and how should I think about it* — from the page alone?
- Where do activity titles, tasks, and expected outputs dominate over exposition?

### Reading-order coherence

- Target sequence: **orientation → reasoning cue → task → materials**
- Audit actual DOM order and visual weight in `page.html` against this sequence.

### Journey Compass usefulness

- Per-activity aligned compass blocks (Sprint 49 refinement): do they **signpost** without noise?
- Relationship to Sprint 43 two-column prototype direction — manifestation polish, not architecture reopen.

### Page composition fidelity

- Compare `learning_activities.json` (DLA) → `page.json` (Design Page) field echo.
- Run2 evidence: materials preserved; activity-row PEL keys may be **partial** in `page.json` while HTML still renders preamble/cognition — trace merge/repair vs compose paths.

### Renderer pedagogy

- CSS/DOM semantics in `app.js` renderer (`util-activity-preamble`, `util-activity-framing`, `util-journey-compass`).
- Kitchen-sink and Marx-specific render tests as regression anchors.

---

## 4. Success Criteria

Learner-facing outputs become **more coherent and self-explanatory** without increasing prompt complexity.

| # | Criterion | Measure |
| - | --------- | ------- |
| 1 | **Manifestation rubric** | Marx run2 (or refreshed run) passes agreed learner-experience rubric on ≥4/5 activities |
| 2 | **Compose fidelity** | `page.json` activity rows reliably echo DLA PEL fields when upstream carries them |
| 3 | **Documented reading path** | Written learner sequence: orientation → reasoning → task → materials — implemented in render order and visual hierarchy |
| 4 | **No prompt regression** | Sprint 49 gate and pattern test suites remain green |
| 5 | **Evidence-led slices** | Each implementation slice traces to a manifestation finding — not speculative contract work |

---

## 5. Validation approach

1. **Start from artefacts** — [`marx-run-artefacts-run2/`](../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/) before re-running workflow.
2. **Side-by-side audit** — `learning_activities.json` + `activity_materials.md` + `page.json` + `page.html`.
3. **Optional refresh run** — only if artefact gaps block investigation (missing prompts/observations).
4. **One secondary fixture** — workshop or second corpus for generalisation (deferred until Marx audit complete).

---

## 6. Relationship to prior sprints

| Sprint | Relevance to Sprint 50 |
| ------ | ---------------------- |
| **43** | Salience / ownership diagnosis; Journey Compass + two-column prototype direction |
| **42** | Design Page as manifestation bottleneck (42-11A) |
| **48** | Pattern injection + GAM gate — frozen baseline |
| **49** | Generation + preservation proven; manifestation gap named in closure |

---

*Charter v1 — bootstrap only; no implementation tickets.*

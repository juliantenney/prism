# Context for next chat — Sprint 38-M

**Pack:** `docs/development/sprints/2026-06-05-sprint-38m-page-composition-fidelity/`

**Status:** **CHARTERED** — **38M-1 START HERE**

---

## Mission

**Page Composition Fidelity** — prevent Design Page composition from summarising or collapsing GAM-generated instructional materials.

```text
38-L made DLA and GAM instructionally sufficient.
38-M makes the composed page faithful to GAM.
```

---

## Problem (from 38-L forensic trace)

```text
DLA  → rich
GAM  → rich
Page → compressed
Render → thin learner experience
```

**Primary loss stage:** L4 Design Page compose (especially A4 Evaluate capstone).

---

## Guiding question

> How do we ensure composed page JSON and rendered output carry GAM body fidelity — not catalogue synopses?

**Architecture:** No schema · ACM · renderer styling · workflow changes ([38L-6 §4](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-6-sprint-closure.md)).

---

## Next action: 38M-1

| Phase | Task | Permission |
|-------|------|------------|
| **38M-1** | Baseline page fidelity analysis on `EV-38L-AFTER` | **Analysis only — no code/pack edits** |

**Deliverable:** `observations/38M-1-baseline-page-fidelity-analysis.md`

**Inputs:**

- `../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38L-AFTER-gam.json`
- `../2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38L-AFTER-design-page.json`
- [38L-instructional-function-loss-trace.md](../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-instructional-function-loss-trace.md)

---

## Phase sequence

```text
38M-1 → 38M-2 → 38M-3 + 38M-4 → 38M-5 → 38M-6
```

---

## Success criterion (`EV-38M-AFTER`)

| Check | Target |
|-------|--------|
| A4 worked judgement | Page length ≈ GAM |
| A4 guided judgement | Page length ≈ GAM |
| Transfer prompt | Full body survives |
| Synopsis replacement | None on capstone materials |

**Proof prefix:** `EV-38M-AFTER-*`

---

## Existing code baseline (38-L)

- `lib/page-gam-materials-preserve.js`
- `tests/page-38l-gam-preservation.test.js`
- Harness hook in `ev-38l-inflation-pipeline-capture-once.mjs`

38-M formalises and proves under `EV-38M-AFTER`.

---

## Frozen baselines

- `EV-38L-AFTER-*` — immediate comparator  
- `EV-38J-AFTER-*` — structure comparator  
- [38I-4 A4 episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

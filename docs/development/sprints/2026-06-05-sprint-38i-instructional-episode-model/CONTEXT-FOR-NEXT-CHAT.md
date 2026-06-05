# Context for next chat — Sprint 38-I

**Pack:** `docs/development/sprints/2026-06-05-sprint-38i-instructional-episode-model/`

**Status:** **CHARTERED** — start **38I-1**

---

## Programme arc

| Sprint | Role |
|--------|------|
| **38-C … 38-F** | Workbook definition, contracts, structural refinement |
| **38-G** | Activity component quality (ACM) — **CLOSED** · SIGNIFICANT SUCCESS |
| **38-H** | Workbook realisation fidelity — **CLOSED** · SUCCESS |
| **38-I** | **Instructional Episode Model** — pedagogical target state |

---

## The shift

We are now finally doing the **instructional design work** the architecture was built to support.

- **38G** proved the pipeline can **generate** richer instructional material (KM/LO → ACM → DLA/GAM).
- **38H** proved the pipeline can **preserve** that material through to the learner-facing page.
- **38I** defines the **pedagogical target state**: what excellent self-directed instructional episodes should look like.

The question is no longer primarily:

> *Can Prism generate and preserve workbook structures?*

It is:

> *What should an excellent self-directed instructional episode look like?*

---

## Architectural position (frozen)

```text
KM → LO → ACM → DLA → GAM → Workbook Page
```

**Do not redesign** this chain in 38-I. **Relate** episode patterns to it.

---

## Next action: 38I-1

| Phase | Task | Permission |
|-------|------|------------|
| **38I-1** | Review Sprints 28–31; extract pedagogical journey concepts | **Analysis only** |

**Deliverable:** `observations/38I-1-prior-pedagogical-journey-review.md`

**Rules:**

- Do **not** invent a new episode model until prior journey work is reviewed.
- Do **not** modify packs, code, or schemas.

---

## Draft episode patterns (hypothesis — refine in 38I-2)

| Level | Illustrative components |
|-------|-------------------------|
| **Understand** | orientation · activation · explanation · example · non-example · misconception challenge · self-check · transition |
| **Apply** | context · process · worked example · guided practice · independent practice · verification · reflection |
| **Analyse** | framing · criteria · worked analysis · guided reasoning · independent analysis · justification · transfer |
| **Evaluate** | perspectives · criteria · trade-offs · judgement · justification · reflection · transfer |

---

## Inherited gaps (for 38-I, not 38-H)

| Gap | Notes |
|-----|-------|
| **H-04 Evaluate practice** | Pedagogy gap — deferred from 38-H |
| **Uneven activation / transitions** | DLA authoring variance |
| **38C-1 professional PASS** | Composite — episode model may clarify bar |

---

## Do not reopen

- 38G ACM redesign · 38H fidelity fixes  
- V-01 / V-05 · 38E/38F structural contracts  
- KM/LO schema · `app.js` · renderer · pipeline  

---

## Frozen comparators

Do not overwrite: EV-01 · `EV-38E5-AFTER-*` · `EV-38E10-AFTER-*` · `EV-38F-AFTER-*` · `EV-38G-AFTER-*`

---

## Quick links

[IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md) · [HANDOVER.md](HANDOVER.md) · [README.md](README.md) · [38H-5 closure](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md)

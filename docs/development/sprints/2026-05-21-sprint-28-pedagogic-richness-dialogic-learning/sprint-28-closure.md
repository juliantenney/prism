# Sprint 28 — programme closure

**Date:** 2026-05-21  
**Status:** **Closed** (investigation 28-1–28-3; implementation 28-5a–5d; stabilisation post-5d)  
**Test floor:** **350** (`node --test tests/*.test.js`)

---

## Problem diagnosed

PRISM orchestrated learning workflows reliably but **learner cognition** inside activities and pages was **weakly typed** compared with Sprint 27 **assessment semantics**. Explicit briefs could lift live rubric scores (~1.6–1.7) yet **representation ceiling (H13)** remained: cognition lived mainly in prose, not in durable structure across E→O→G→C.

---

## Architectural findings

| Layer | Pre–Sprint 28 | Post–Sprint 28 |
|-------|---------------|----------------|
| **E** | Assessment factors strong; cognition rhetorical | Five cognition factors + four packs (`28-5a`) |
| **O** | Lean attractor; assessment-only collapse risk | Pack-minimal chains; DLA→GAM→GAI when cognition-aware (`28-5b`) |
| **G** | DLA/GAM prompts generic | Typed contract fields when packs active (`28-5c`) |
| **C** | Assessment-forward pages; section_id drift | Normalise IDs, inject activities, merge fields, dedupe MCQs, reorder (`28-5d`) |

**H10 Supported** — cognition now has stable IDs; still lighter than assessment ontology (intentional).  
**H12 Partial → Stabilised for cognition workflows** — live post-5d probes show canonical `learning_activities` before `assessment_check`.  
**H13 Partial** — ceiling lifted via typed fields; LLM adherence still variable.

---

## Implementation slices completed

| Slice | Deliverable |
|-------|-------------|
| 28-5a | Factors, packs, extraction, lean-path guards |
| 28-5b | `resolvePedagogicCognitionOrchestrationSemantics` |
| 28-5c | DLA/GAM contract scaffold + satisfaction helpers |
| 28-5d | `applyPedagogicCognitionSemanticsToComposedPage` |

**Deferred:** 28-5e harness automation (optional governance; not required for closure).

---

## What improved (live post-5d validation)

Re-ran **P28-01, P28-02, P28-07** with identical briefs ([`context-files/28-5d-stabilisation-probe-runner.js`](context-files/28-5d-stabilisation-probe-runner.js)):

| Probe | Packs resolved | DLA contract satisfied | LA before assessment |
|-------|----------------|------------------------|----------------------|
| P28-01 climate | `misconception_repair_pack` + uncertainty field | **yes** | **yes** |
| P28-02 peer | `peer_instruction_pack` | **yes** | **yes** |
| P28-07 transcript | `transcript_transformation_pack` (+ related) | **yes** | **yes** |

See [`probe-p28-01-post-5d.md`](context-files/probe-p28-01-post-5d.md), [`probe-p28-02-post-5d.md`](context-files/probe-p28-02-post-5d.md), [`probe-p28-07-post-5d.md`](context-files/probe-p28-07-post-5d.md); capture JSON [`28-5d-stabilisation-capture.json`](context-files/28-5d-stabilisation-capture.json).

---

## Sprint 28 architectural outcome

**Changed materially:** Cognition-bearing briefs now resolve **packs → topology → typed generation contracts → composition parity** without new workflows, renderer redesign, or giant ontologies.

**Remains out of scope:** Adaptive tutoring UI, learner-state engines, dynamic branching layouts, visual pedagogy frameworks, illustration pipeline, automatic rubric judges in CI.

**PRISM does better:** Preserves **learning-process structure** (activities, revision/misconception/transcript/self-study fields, section ordering) with **explainable** runtime passes and **350** regression tests including Sprint 27 assessment semantics.

**Bounded by design:** Additive optional fields, pack-gated behaviour, deterministic composition post-pass — maintainability over pedagogic maximalism.

---

## Confirmations (stabilisation checklist)

| Check | Result |
|-------|--------|
| No workflow explosion | Same LD steps; heuristics inject/protect only |
| No renderer redesign | Composition policy only |
| No giant ontology | 5 factors + 4 packs + small field sets |
| Lean/non-cognition paths | RNA sparse fixtures + tests unchanged |
| Sprint 27 assessment stable | 350 tests; combined cognition+assessment probe passes |

---

## Recommended future directions

1. **28-5e (deferred)** — static fixture analysers / rubric automation in CI.  
2. **New thematic track** — renderer/illustration/export polish (not Sprint 28 scope).  
3. **Self-study probes P28-08/09** — optional validation when CPD path is prioritised.

---

## Pause / stabilisation note

**Sprint 28 should formally close.** Programme goals (typed cognition architecture E→O→G→C) are delivered. Further gains are **operational** (harness, live QA) or **product** (renderer/illustration), not additional ontology in the cognition layer.

---

## Handover pointer

Next work: pick a **new sprint theme** or run **28-5e** as a small governance slice. Do not extend cognition packs without a new charter.

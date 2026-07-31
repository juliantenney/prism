# Sprint 71 — Cross-Resource Synthesis Notes

**Status:** **Sprint 71 COMPLETE** — [SPRINT-71-FINAL-REPORT.md](SPRINT-71-FINAL-REPORT.md)  
**Purpose:** How understanding evolved from benchmarking to architectural conclusions.  
**Not** the Improvement Register or Review Summary Register.  
**Frozen:** No new findings, issue IDs, or principles in this close.

**Related:** [improvement-register.md](improvement-register.md) · [review-metadata-index.md](review-metadata-index.md) · [STATUS.md](STATUS.md) · [design-principles.md](design-principles.md)

---

## Narrative arc

```text
Question → Benchmarking → Validation → Cross-resource synthesis
  → Controlled experiment → Architectural understanding → Closure
```

Sprint 71 began as exploratory benchmarking and concluded as an investigation into **Prism’s instructional architecture**: where quality originates, and where remaining limitations now lie.

---

## Controlled experiment (strongest empirical evidence)

```text
S71-R-010 (sparse workflow brief)     →  S71-R-011 (pedagogically informed detailed brief)
88/100                                →  91/100
```

Improvements occurred in dimensions **intentionally targeted** by the richer pedagogical guidance. This demonstrates **steerability of generation**, not mere correlation with prompt length. Critical poem evidence-availability persisted (`S71-F-001`) — Layer 2/3.

Obs: `S71-O-006`.

---

## What the synthesis established

1. Instructional quality is materially steerable through **pedagogically informed workflow guidance**.  
2. Remaining critical limitations increasingly concern **evidence availability**, not sequencing alone.  
3. Lasting quality belongs in Layer 1 contracts, Layer 2 elicitation, discipline profiles, and prompt engineering — not ever-longer author prompts.

---

## Validated Sprint 71 candidate architectural principles

Frozen set:

1. Evidence Sufficiency  
2. Evidence-Centred Activity Design  
3. Pedagogical Timing  
4. Diagnostic Feedback  
5. Disciplinary Uncertainty  
6. Discipline-Appropriate Evidence Evaluation  

Full definitions: [design-principles.md](design-principles.md).

---

## Three-layer evidence model

| Layer | Name | Responsibility |
| ----- | ---- | -------------- |
| **Layer 1** | **Platform instructional architecture** | Default generation contracts for the validated candidate principles |
| **Layer 2** | **Workflow elicitation** | Evidence source / generate vs upload / rights and constraints |
| **Layer 3** | **Author-supplied evidence** | Authentic artefacts Prism cannot or should not generate |

Differentiate instructional architecture, evidence sourcing, and author-supplied artefacts.

---

## Prompt-sensitive vs content-availability

| Class | Where it belongs |
| ----- | ---------------- |
| **Prompt-sensitive** | Layer 1–2; pedagogically informed elicitation; prompt engineering; default contracts |
| **Content-availability** | Layer 2 questions + Layer 3 author supply |

---

## Consolidation map (existing clusters → principles)

| Register clusters | Toward |
| ----------------- | ------ |
| `S71-F-001`, thematic `S71-F-014` | Evidence Sufficiency / representation presence |
| `S71-F-015` | Pedagogical Timing |
| `S71-F-002` | Diagnostic Feedback |
| `S71-F-004`, `S71-F-005`, related `S71-F-009` | Disciplinary Uncertainty |
| `S71-F-007` (discipline-appropriate only) | Discipline-Appropriate Evidence Evaluation |
| `S71-O-006` | Steerability via pedagogically informed guidance; content-availability boundary |

Architectural consolidation only — Confirmed/Partial history in the register is preserved.

---

## Complementary framing

1. **Disciplinary Representation** — artefacts present (and correctly timed).  
2. **Evidence-Based Learning** — learners reason with those artefacts.

---

## Review anchors (selected)

| Review | Role |
| ------ | ---- |
| `S71-R-010` | Owen sparse control — **88/100** |
| `S71-R-011` | Owen pedagogically informed intervention — **91/100** |
| `S71-R-009` | History richer-brief signal |
| `S71-R-008` | Pedagogical Timing (`S71-F-015`) |
| `S71-R-007` | Representation presence (`S71-F-014`) |

---

## Benchmark instrument refinements (candidates — no IDs invented)

Activity-level Evidence Sufficiency; scaffolding vs premature disclosure; alignment vs checking quality; discipline-profile evaluation; sustained Disciplinary Uncertainty; task-completion evidence over diagram quotation density; three-layer model.

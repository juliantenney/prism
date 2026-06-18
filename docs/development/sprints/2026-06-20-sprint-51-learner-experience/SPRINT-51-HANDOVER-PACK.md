# Sprint 51 Handover Pack

**Date:** 2026-06-20  
**Type:** Bootstrap handover — orientation for fresh chat  
**Audience:** Agent or human opening Sprint 51 at **learner experience quality** frontier  
**Predecessor:** Sprint 50 — Pedagogic Manifestation (closed)

---

## Read This First

Sprint 50 is **closed**. The manifestation **architecture** is implemented and tested. Sprint 51 does **not** reopen compose/renderer grammar design unless a quality investigation proves a narrow bug.

**Start from:** Does the learner experience feel coherent, coached, and self-explanatory when they open a rendered page?

**Primary evidence:**

| Corpus | Path | Use |
| ------ | ---- | --- |
| Pre-fix Marx run | [`../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/`](../2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/) | Historical gap baseline |
| Post-fix live run | [`../2026-06-20-sprint-50-pedagogic-manifestation/verification-runs/2026-06-18-marx-self-study/`](../2026-06-20-sprint-50-pedagogic-manifestation/verification-runs/2026-06-18-marx-self-study/) | Grammar + pipeline verification |
| Sprint 50 closure | [`../2026-06-20-sprint-50-pedagogic-manifestation/SPRINT-50-CLOSURE-REPORT.md`](../2026-06-20-sprint-50-pedagogic-manifestation/SPRINT-50-CLOSURE-REPORT.md) | Authoritative outcomes |

---

# What We Know

| Finding | Evidence | Confidence |
| ------- | -------- | ---------- |
| **Pedagogy generated** | DLA emits framing + cognition fields; GAM emits substantive materials on Marx corpus | **Proven** (Sprint 49 + run2) |
| **Pedagogy preserved** | GAM bodies in `page.json`; Phase 1/1B merge PEL when upstream available | **High** — edge cases may remain |
| **Pedagogy rendered** | Phase 2 grammar sections when fields on page rows; regression tests green | **Proven** in test + partial live verification |
| **Manifestation model implemented** | Single-column grammar; Study before Do; unified Check; progress-only Compass | **Proven** — see Phase 2 report |

**Settled diagnosis (Sprints 43–50):**

> Educational structures survive end-to-end. Remaining gaps are **learner experience** — visibility, voice, concreteness, and inference burden — not absence of architecture.

---

# What We Believe

| Belief | Rationale |
| ------ | --------- |
| **Remaining issues are largely learner-experience issues** | Gap analysis: Study/Do/Check **content** present; Orient/Think/Reflect **coaching** thin or hidden in run2; post-fix grammar improves structure but not prose quality |
| **Existing pedagogic value may still be hidden or weakly manifested** | Optional fields sparse; support notes late in DOM; GAM bridges carry implicit Think; page-level Orient does not substitute per-activity why |
| **Architecture-first work will not close the quality gap** | Scope confirmation + implementation proved compose + renderer sufficiency for structure |
| **Generation quality matters for richness** | Thin `reasoning_orientation` strings, uneven optional cognition fields — content layer, not manifestation grammar |

---

# Open Questions

Sprint 51 should investigate these empirically against rendered learner pages (Marx corpus first):

1. **Is Orient sufficiently visible?** — Page-level inquiry vs per-activity *Why this activity*; preamble salience when present.
2. **Is Think sufficiently visible?** — *How to approach this* vs task instructions; implicit reasoning in GAM text bodies.
3. **Is coaching language sufficiently explicit?** — Tone, density, disciplinary scaffolding beyond one-line cues.
4. **Are learners still required to infer too much?** — Reading order, quality bar, when to consult models, what “done” looks like.
5. **Are worked examples sufficiently concrete?** — Educational modelling vs procedural demonstration.
6. **Are model outputs sufficiently educational?** — Sample outputs, annotations, bridge prose.
7. **Are transitions and bridges strong enough?** — Cross-activity coherence (`intellectual_coherence_bridge` absent in run2).
8. **Are transfer opportunities authentic and useful?** — Late-session transfer prompts vs per-activity application.

---

# What Not To Revisit

Do **not** reopen the following unless **fresh evidence** shows a manifestation gap that cannot be closed within Sprint 50 architecture:

| Area | Rationale |
| ---- | --------- |
| OUTPUT CONTRACT expansion | Sprint 49–50 rejected sprawl; schema + modules suffice |
| Prompt redesign | C1–C4, SP-01–SP-06, preamble/cognition modules complete |
| Workflow gates | DLA Framing Gate v1 + GAM capture gate stable |
| Ontology redesign | D-49-01 and LD-COGNITION-ORIENTATION settled |
| Auto-repair | Explicitly rejected in Sprint 49 |
| Architecture-first solutions | Sprint 50 proved structure; Sprint 51 is quality |

**Exception rule:** A targeted compose or renderer **bug fix** is in scope if investigation proves data loss or grammar regression — not a redesign.

---

# Key Implementation Files (frozen baseline)

| Concern | Location |
| ------- | -------- |
| Instructional grammar lib | `lib/ld-instructional-manifestation-render.js` |
| Grammar activity render | `app.js` — `renderInstructionalManifestationActivityCard` |
| Compose / PEL merge | `app.js` — `mergeLearnerPageActivityFramingFieldsIntoPageActivities`, `applyPageCompositionValidationForCapturedPage` |
| Persistence path | `app.js` — `readWorkflowRunUpstreamCaptureTextForStepId`, `recomposeWorkflowPageCapturesFromUpstream` |
| DLA preamble (generation) | `lib/ld-activity-preamble-exposition.js` |
| DLA cognition (generation) | `lib/ld-cognition-orientation.js` |
| GAM patterns (generation) | `lib/instructional-pattern-prompt.js` |

---

# Regression anchors

Run before/after Sprint 51 slices:

```bash
node --test tests/sprint-50-phase-1-compose-fidelity.test.js
node --test tests/sprint-50-phase-1b-persistence-path.test.js
node --test tests/sprint-50-phase-2-renderer-instructional-grammar.test.js
node --test tests/utility-journey-compass-render.test.js
```

---

# Recommended first actions

1. Read [SPRINT-51-CHARTER.md](./SPRINT-51-CHARTER.md) — confirm scope with user.
2. Open post-fix `page.html` from verification run; walk one activity (A1) as a learner.
3. Compare run2 vs post-fix run for Orient/Think/Study order and section labels.
4. Draft a **learner experience rubric** (salience, coaching, concreteness, inference burden) — document before code.
5. Propose slices only after rubric + audit — each slice cites a quality finding.

---

*Handover pack v1 — authoritative Sprint 51 entry without Sprint 50 conversation history.*

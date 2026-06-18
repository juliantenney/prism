# Sprint 52 Handover Pack

**Date:** 2026-06-20  
**Type:** Bootstrap handover — orientation for fresh chat  
**Audience:** Agent or human opening Sprint 52 at **production-quality learner experience** frontier  
**Predecessor:** Sprint 51 — Learner Experience Quality (closed)

---

## Read This First

Sprint 51 is **closed**. Architecture, preservation, and Sprint 51 capability slices are **implemented and tested**.

**Do not reopen:** instructional grammar design, compose authority model, GAM preservation strategy, or “is pedagogy preserved?” investigations.

**Start from:** Does a **freshly generated** learner page read as an **excellent, consistent, coached resource** across all activities?

**Primary entry:** [SPRINT-52-CONTEXT.md](./SPRINT-52-CONTEXT.md) — includes **Learning Design Foundations** (why the architecture exists) and **What Sprint 51 Added** (deliberate capabilities).

**Reference baseline:** [rendered-page-sprint-51-final.html](./rendered-page-sprint-51-final.html) — open this before auditing P1 quality.

---

# Future Chat Start Point

1. Read [SPRINT-52-CONTEXT.md](./SPRINT-52-CONTEXT.md)  
2. Open [rendered-page-sprint-51-final.html](./rendered-page-sprint-51-final.html)  
3. Assume Sprint 50/51 architecture decisions are settled  
4. Do not use stale generated artefacts as current evidence  
5. Review the learner page against the Sprint 52 P1 backlog  
6. Propose one narrow production-quality slice at a time  

**One-sentence instruction:** Start with SPRINT-52-CONTEXT.md, open rendered-page-sprint-51-final.html, assume all Sprint 50/51 architecture decisions are settled, and focus exclusively on improving the quality of the learner experience through evidence-led, minimally invasive changes.

# What We Know (Settled)

| Finding | Confidence |
| ------- | ---------- |
| Pedagogy is **generated** (DLA + GAM + instructional patterns SP-01–SP-07) | **Proven** |
| Pedagogy is **preserved** (PEL merge + authoritative GAM overlay) | **High** — regression tests green |
| Pedagogy is **manifested** (seven-function grammar + pedagogic callouts) | **Proven** — Sprint 50/51 regression suites |
| Remaining gap is **production quality** — voice, depth, consistency, arc | **Accepted** — Sprint 51 Finding-01 |

---

# What Sprint 52 Must Achieve

Improve **learner-facing quality** within frozen architecture:

| P1 | Coverage, reflection, voice, model depth, check quality — **consistency across activities** |
| P2 | Transfer authenticity, activity arc, visual polish |
| P3 | Optional weak/strong judgement callout salience |

---

# Do Not Reinvestigate

Unless **new evidence** (test failure, data-loss proof, charter amendment):

| Closed topic |
| ------------ |
| Instructional sequencing architecture |
| Orient / Think / Transfer visibility **architecture** |
| Manifestation architecture (compose + renderer ownership) |
| Sprint 50 preservation decisions |
| Compose authority + GAM preservation strategy |
| Major learner journey coherence model |
| OUTPUT CONTRACT expansion |
| Workflow gate redesign |
| Auto-repair |
| Two-column layout |
| Using stale Marx run2 as current-state evidence |

Full list: [SPRINT-52-CONTEXT.md § Do Not Reinvestigate](./SPRINT-52-CONTEXT.md#do-not-reinvestigate)

---

# Valid Evidence

PRISM **does not retain artefacts**.

| Rule |
| ---- |
| Run **fresh workflow** from current codebase |
| Judge from **exported `page.html`** of this run |
| Historical folders = archaeology only — label as such |

Full rules: [SPRINT-52-CONTEXT.md § Valid Evidence](./SPRINT-52-CONTEXT.md#valid-evidence)

---

# Key Implementation Files (baseline — bug-fix only unless charter says otherwise)

| Concern | Location |
| ------- | -------- |
| Instructional patterns | `lib/instructional-pattern-prompt.js` |
| GAM preservation | `lib/page-gam-materials-preserve.js` |
| Pedagogic salience | `lib/ld-pedagogic-salience-render.js` |
| Instructional grammar | `lib/ld-instructional-manifestation-render.js` |
| DLA modules | `lib/ld-activity-preamble-exposition.js`, `lib/ld-cognition-orientation.js` |
| Compose + render | `app.js` |

---

# Regression Anchors

```bash
node --test tests/sprint-51-pedagogic-salience-render.test.js
node --test tests/sprint-51-gam-material-preservation.test.js
node --test tests/sprint-51-annotated-models-generation.test.js
node --test tests/sprint-51-evaluative-coaching-generation.test.js
node --test tests/sprint-50-phase-2-renderer-instructional-grammar.test.js
```

---

# Recommended First Actions

1. Read [SPRINT-52-CONTEXT.md](./SPRINT-52-CONTEXT.md) — especially **Clean Break** and **Reference Learner Artefact**.  
2. Open [rendered-page-sprint-51-final.html](./rendered-page-sprint-51-final.html) — walk every activity against P1 backlog.  
3. Draft a **quality rubric** row per activity before proposing slices.  
4. Propose **one narrow slice** — generation content depth, optional-field coverage, or renderer polish as evidence dictates.  
5. After a slice, verify on a **fresh run** from the current codebase (reference artefact is baseline, not post-fix proof).

---

# Orientation Summary

Sprint 52 begins from a **stable architecture** and a **validated learner-experience baseline**.

The objective is **not** to redesign PRISM. The objective is to **improve the quality of the learner experience** visible in the reference learner artefact.

- Use **fresh runs** for validation.  
- Work from **learner-facing evidence**.  
- Keep improvements **narrow and testable**.

---

*Handover pack v1 — Sprint 52 bootstrap without Sprint 50/51 reconstruction.*

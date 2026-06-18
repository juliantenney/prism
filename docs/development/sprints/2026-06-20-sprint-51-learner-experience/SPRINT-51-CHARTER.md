# Sprint 51 Charter — Learner Experience Quality

**Status:** Open  
**Predecessor:** Sprint 50 — Pedagogic Manifestation (closed)  
**Primary evidence:** Marx verification run + Sprint 50 gap analysis

---

## Mission

**Improve learner-facing pedagogic quality.**

Sprint 50 established the instructional manifestation model — seven-function grammar, single-column layout, compose fidelity, renderer section ordering. Sprint 51 asks whether that model delivers an experience learners can navigate **without inferring** structure, intent, or success criteria.

---

## Primary Themes

| # | Theme | Question |
| - | ----- | -------- |
| 1 | **Orient visibility** | Does the learner know why they are doing each activity? |
| 2 | **Think visibility** | Is intellectual approach explicit before task execution? |
| 3 | **Instructional coaching quality** | Is guidance substantive, not procedural? |
| 4 | **Worked example quality** | Do models teach method, not just demonstrate output? |
| 5 | **Model output quality** | Are sample outputs and annotations educationally purposeful? |
| 6 | **Reflection quality** | Do reflection prompts promote consolidation, not checkbox compliance? |
| 7 | **Transfer quality** | Are application opportunities authentic and well-timed? |
| 8 | **Learner inference burden** | How much must the learner guess about structure, quality, and completion? |

---

## Success Criterion

A learner should be able to move through a PRISM-generated resource with **minimal inference** about:

- **Why** they are doing something
- **How** to think about it
- **What quality** looks like
- **How** to check success
- **How** learning transfers elsewhere

Success is measured by learner-readable artefacts (rendered pages, walkthrough audits, rubric scores) — not by field presence alone.

---

## Explicit Non-Goals

Unless fresh evidence demands a narrow exception:

| Non-goal | Rationale |
| -------- | --------- |
| OUTPUT CONTRACT expansion | Settled Sprint 49–50 |
| Prompt architecture redesign | Generation layer frozen |
| New workflow gates | Gates stable |
| Ontology redesign | D-49-01 settled |
| Auto-repair systems | Rejected Sprint 49 |
| Manifestation grammar redesign | Sprint 50 Phase 2 complete |
| Two-column layout reopen | Single-column model accepted D-50-03 |

**In scope:** Quality improvements within existing fields and grammar — generation prose depth, optional-field coverage, renderer salience polish, material richness, transition prose, rubric-driven targeted fixes.

---

## Investigation Approach

1. **Start from rendered learner experience** — `page.html` first, JSON second.
2. **Use Marx corpus** — run2 baseline vs post-fix verification run.
3. **Rubric before slices** — document quality criteria before implementation.
4. **Evidence-led changes** — each slice traces to a learner-experience finding.
5. **Regression guard** — Sprint 50 test suites remain green.

---

## Relationship to Prior Sprints

| Sprint | Relevance |
| ------ | --------- |
| **43** | Salience / ownership diagnosis — experiential framing |
| **49** | Generation + preservation proven |
| **50** | Manifestation architecture implemented — Sprint 51 builds on top |

---

## Deliverables (orientation)

Sprint 51 deliverables will emerge from investigation. Expected artefact types:

- Learner experience rubric (document)
- Activity-level quality audit (Marx corpus)
- Targeted improvement slices (generation content, renderer salience, or optional-field coverage — as evidence dictates)
- Sprint 51 closure report when complete

---

*Charter v1 — bootstrap only.*

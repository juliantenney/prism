# Sprint 65 — Charter

**Sprint:** 65 — Renderer Learner Experience Optimisation  
**Working title:** Working With What We Have  
**Status:** Chartered  
**Opened:** 2026-07-16  
**Type:** Implementation-oriented renderer sprint (evidence-led)  
**Canonical pointer:** [docs/sprints/sprint-65-renderer-learner-experience-optimisation.md](../../../sprints/sprint-65-renderer-learner-experience-optimisation.md)

---

## Background

Sprint 63 showed that activities differ cognitively and that render-time signals can support meaningful Tier 2 differentiation, while some upstream instructional structure is not recoverable after the GAM→assembled-materials boundary.

Sprint 64 investigated preservation of that non-recoverable structure. Experimental path-gated envelopes worked; **production preservation was not justified**. Schema redesign, renderer redesign for hidden-plan consumption, and generic cognitive projection remain unjustified.

Sprint 65 therefore optimises the **renderer-addressable opportunity**: make the best learner experience from signals that already survive into the page artifact.

---

## Problem statement

The production renderer already surfaces many useful page-artifact fields, but does not yet compose them into the clearest possible learner experience. On rich pages, activity shells can feel repetitive, cognitive purpose can appear fragmented across labelled blocks, the primary task can be visually diluted, archetype differences can be under-signalled, materials can retain implementation residue, and page-level orientation can be top-heavy or duplicative.

**Core product question:**

> How can the renderer make each activity’s intended learner thinking, progression, task structure and success criteria immediately understandable using only current page-artifact data?

---

## Settled assumptions (do not reopen)

### From Sprint 63

* Activities differ cognitively.  
* Existing render-time signals can support meaningful Tier 2 activity differentiation.  
* Grouping, labelling, sequencing and reasoning visibility can improve manifestation.  
* Some upstream instructional structure is not recoverable downstream.

### From Sprint 64

* Non-recoverable structure can be preserved experimentally.  
* Production preservation has not been justified.  
* Schema redesign is not justified.  
* Renderer redesign for hidden-plan consumption is not justified.  
* Generic cognitive projection is not justified.  
* Production implementation of preservation machinery is not authorised.

### Sprint 65 consequence

The renderer must **not** infer, recreate, or compensate for missing archetype-plan fields. It must maximise use of the signals it actually receives. When unavailable plan data is encountered, record:

```text
Known architecture ceiling — not a Sprint 65 renderer defect.
```

---

## Goals

By sprint end, produce a clearer, more differentiated learner experience from existing page-artifact data, with measurable improvements (audit matrix) to:

1. Page orientation  
2. Activity differentiation  
3. Learner-action clarity  
4. Cognitive-mode signalling  
5. Task / output / success alignment  
6. Material hierarchy  
7. Sequencing visibility  
8. Reduction of avoidable duplication  
9. Removal or gating of implementation residue  
10. Accessibility and responsive behaviour  

---

## Non-goals

Sprint 65 must **not**:

* Propagate archetype plans beyond their current boundary  
* Introduce cognitive preservation envelopes  
* Add hidden-plan fields to production contracts  
* Redesign the page schema  
* Redesign GAM  
* Infer `required_links`, `stages`, `key_relationships`, or `governing_constraint`  
* Create a generic cognitive schema  
* Make the renderer aware of unavailable upstream reasoning as if it were present  
* Alter instructional content merely to make the renderer look better  
* Treat the RNA-virus page as the only supported content shape  
* Perform an unrestricted visual redesign  
* Introduce a new design system  
* Merge experimental Sprint 64 code into production  

---

## Constraints

* Use only fields already available to the production renderer (S65-D01).  
* No production hardening before bounded prototype + cross-sample validation (S65-D07).  
* Preserve semantic HTML, keyboard usability, mobile and print support.  
* Fail safely on missing optional fields — coherent reduced experience, not empty labelled blocks (S65-D05).  
* Gate developer diagnostics; do not delete developer observability (S65-D06).  
* Differentiation must communicate instructional function, not decoration alone (S65-D04).  
* Prefer progressive disclosure and instructional hierarchy (see Design Principle in pack README / evaluation framework).

---

## Success criteria

### Learner clarity

* Primary activity action immediately identifiable  
* Expected output immediately identifiable  
* Success criteria easy to find  
* Less need to assemble purpose from many adjacent framing blocks  

### Cognitive signalling

* Understand / apply / analyse / evaluate recognisably different via structure and wording  
* No invention of unavailable instructional reasoning  

### Progression

* Activity order and transitions clear  
* Page-level orientation without overwhelm  

### Materials

* Distinguish information, modelling, practice, workspace, verification  
* Remove generic implementation-facing labels such as “Body” where addressable  
* Unknown materials fail safely  

### Information architecture

* Reduced visible duplication  
* Improved first-screen usefulness  
* Diagnostics gated from normal learner presentation  

### Engineering quality

* No schema / GAM / preservation-envelope changes  
* Semantic HTML · a11y · responsive · printable  
* Regression coverage · reversible changes  

**Language:** claim presentation clarity, instructional legibility, task orientation, cognitive signalling, usability — **not** proven learning-outcome gains without learner research.

---

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Over-composition | Smallest learner contract first |
| Cosmetic differentiation | Tie every variation to a learner-use question |
| Content duplication | Precedence + progressive disclosure rules |
| Brittle field assumptions | Inventory optionality + safe fallbacks |
| Reference-page overfitting | Cross-sample validation before hardening |
| Diagnostic loss | Gate, do not delete |
| Architecture creep | Explicit “known architecture ceiling” decision when plan data is missing |

---

## Reference artifact

| Item | Path / note |
| ---- | ----------- |
| Primary page JSON | [`tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json`](../../../../tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json) |
| Assessment companion | [`tests/fixtures/page-render/ld-rna-hcv-assessment-page.json`](../../../../tests/fixtures/page-render/ld-rna-hcv-assessment-page.json) |
| Rendered HTML | Capture during S65-BL-001 into `samples/` / `screenshots/` |
| Sample index | [samples/README.md](samples/README.md) |

The RNA page is the **initial reference case**, not the sole acceptance case (S65-D03).

---

## Definition of done

1. Backlog S65-BL-001 … S65-BL-010 completed or explicitly deferred with rationale.  
2. Baseline audit + signal inventory + contract/rules/IA artefacts exist.  
3. Bounded prototype + cross-sample validation evidence recorded before any production hardening.  
4. Final recommendation (`sprint-65-final-recommendation.md`) selects Outcome A, B, or C.  
5. No schema, GAM, or Sprint 64 envelope merge occurred.  
6. Sprint summary and logs updated; `current-state.md` reflects close status.  

---

## First task (locked)

**S65-BL-001 — Baseline Learner-Experience Audit** — documentation only.

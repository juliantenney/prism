# Sprint 55 Context Pack — Educational Product Experience

**Sprint:** 55 — Educational Product Experience  
**Pack date:** 2026-06-29  
**Status:** Open  
**Predecessor:** [Sprint 54 closure](../2026-06-29-sprint-54-pedagogic-fidelity-audit/SPRINT-54-CLOSURE-REPORT.md)  
**Companion docs:** [CHARTER](SPRINT-55-CHARTER.md) · [DECISION-LOG](SPRINT-55-DECISION-LOG.md) · [DESIGN-PRINCIPLES](SPRINT-55-DESIGN-PRINCIPLES.md) · [PRODUCT-BACKLOG](SPRINT-55-PRODUCT-BACKLOG.md)

---

## Instructions to the assistant (fresh chat)

You are continuing **Sprint 55 — Educational Product Experience** on PRISM.

**Sprint 54 is closed.** Do not reopen pedagogic fidelity, renderer-primary-loss, or “is pedagogy preserved?” investigations unless new committed test failures appear.

**Read this pack before responding.**

**Begin with a fresh learner export** — walk the page as a learner before proposing code.

---

## Executive summary — state of the world

### Known (from Sprint 54 — do not re-prove)

* Pedagogic architecture generates and preserves instructional intent when the artefact chain is intact.  
* Rendering fidelity (JSON → HTML) is **proven** for complete page models.  
* Material-body loss under load localises primarily to **Copilot Design Page compose**; PRISM merge defects are a separate, addressable class.  
* Remaining gaps cluster in **product experience** — journey, navigation, progress, affordances.  
* PRISM exports **documents**, not an LMS.  
* Workshop facilitator mode is **deferred**.

### Sprint goal

Transform PRISM’s exported learner page from a **well-designed educational document** into a **fully realised educational product experience**.

### Do not start with

* Workflow redesign  
* Prompt / validator changes  
* Learning architecture changes  
* Theme system  
* Re-proving educational quality or rendering fidelity  

---

## Current Product Hypothesis

Sprint 54 established that PRISM can generate and preserve high-quality instructional experiences.

Sprint 55 operates on the hypothesis that the largest remaining gains will come from **product-layer improvements** rather than pedagogic, workflow, or rendering changes.

Specifically:

* The instructional architecture is **stronger** than the current learner experience layer makes visible.  
* Learners **can already learn successfully** from PRISM resources.  
* The next opportunity is to make the learning journey, actions, progress, and revision pathways **easier to perceive and use**.

Therefore Sprint 55 focuses on:

* Orientation  
* Navigation  
* Progress visibility  
* Affordances  
* Cognitive accessibility  

rather than instructional redesign.

---

## Sprint Theme: Document → Product

Sprint 55 is the transition from:

**Educational Document**

to

**Educational Product**

The objective is **not** to improve pedagogy.

The objective is to make existing pedagogy easier to:

* perceive  
* navigate  
* revisit  
* complete  
* use efficiently  

The educational architecture is considered **proven**.

The learner experience layer is now the **primary focus**.

---

## North Star User Story

As a learner opening a PRISM resource for the first time,

I can immediately see:

* where I am  
* where I am going  
* what I should do next  
* how much remains  

without needing to infer structure from the document.

When I return later,

I can quickly:

* re-orient myself  
* resume work  
* revisit previous activities  
* revise key learning points  

with minimal effort.

This user story acts as the **primary learner-centred evaluation lens** for Sprint 55.

---

# A. Sprint brief

## Primary goal

> Transform PRISM from a well-designed educational document into a fully realised **educational product experience**.

The instructional architecture is **settled**. Sprint 55 improves **how learners experience** that architecture in exported HTML.

## Success definition

A learner opening a fresh export can:

1. See the **whole journey** and their **position** in it  
2. **Navigate** to any activity or major section without scroll-search  
3. Understand **what to do next** at a glance  
4. **Return** for revision with low re-orientation cost  
5. **Print** a usable document  

…while all Sprint 50/51 instructional grammar and material preservation behaviour remains intact.

---

# B. Strategic context — why Sprint 55 exists

| Prior era | Question | Outcome |
| --------- | -------- | ------- |
| Sprints 49–51 | Is pedagogy generated, preserved, manifested? | **Yes** |
| Sprint 52 (paused) | Is production quality the frontier? | Paused for fidelity track |
| Sprints 53–54 | Where does fidelity break and why? | **Localised** — compose capacity + merge; renderer cleared |
| **Sprint 55** | What improves learner value next? | **Product experience** |

**Major pedagogic risks are retired** (Sprint 54 D-54-08). The remaining opportunity is not proving that PRISM can teach — it is making the **exported journey** feel like a designed product: visible, navigable, progressive, and actionable.

---

# C. Scope

## In scope

| Area | Examples |
| ---- | -------- |
| **Learning Journey visibility** | Navigator, sequence summary, activity list |
| **Navigation** | TOC, anchors, skip links |
| **Progress indicators** | Resource-level + activity compass integration |
| **Orientation** | Page entry framing, resume cues |
| **Affordances** | Next action, print, revision jumps |
| **Cognitive accessibility** | Landmarks, focus order, heading discipline |
| **Visual hierarchy** | Spacing, heading scale, materials scanability |
| **Revision support** | Return-to-check, model links, summary strips |
| **Learner experience improvements** | Renderer/export HTML — minimal `app.js` wiring |

## Out of scope

Unless explicitly required:

* Workflow redesign  
* Knowledge model redesign  
* Pedagogic redesign  
* Learning architecture redesign  
* Theme system development  
* Live workshop facilitator product  
* Copilot prompt redesign  
* Material closure / compose capacity (separate track)  

---

# D. Product backlog (summary)

Full detail: [SPRINT-55-PRODUCT-BACKLOG.md](./SPRINT-55-PRODUCT-BACKLOG.md)

## P1

* Learning Journey Navigator  
* TOC and anchor navigation  
* Progress visibility  
* Output affordances  

## P2

* Revision support  
* Visual hierarchy improvements  
* Cognitive accessibility improvements  

## P3

* Typography refinement  
* Theme exploration (document only)  
* Visual polish  

---

# E. Design principles

Full detail: [SPRINT-55-DESIGN-PRINCIPLES.md](./SPRINT-55-DESIGN-PRINCIPLES.md)

1. Make the learning journey visible.  
2. Make learner actions obvious.  
3. Make learner progress visible.  
4. Reduce unnecessary cognitive effort.  
5. Support first-time, returning, revision, and print use.  
6. Preserve proven instructional architecture.  

---

# F. Success criteria

From [SPRINT-55-CHARTER.md](./SPRINT-55-CHARTER.md):

| # | Criterion |
| - | --------- |
| 1 | Learning Journey Navigator shipped |
| 2 | TOC + anchor navigation |
| 3 | Progress visibility (resource + activity) |
| 4 | Output affordances (print, next-step) |
| 5 | One P2 slice (revision **or** hierarchy **or** cognitive a11y) |
| 6 | Sprint 50/51 regression suites green |
| 7 | Fresh-run learner walkthrough documented |

---

# G. Questions we no longer need to re-prove

*From Sprint 54 closure — binding for Sprint 55.*

| Closed question |
| --------------- |
| Is educational quality absent from generated resources? |
| Does pedagogic intent fail to survive workflows as a class? |
| Is the renderer the primary fidelity loss location? |
| Is rendering fidelity the main open defect? |
| Should we redesign learning architecture before UX work? |
| Is workshop viability blocked for self-study export? |

Full table: [Sprint 54 closure § Questions we no longer need to re-prove](../2026-06-29-sprint-54-pedagogic-fidelity-audit/SPRINT-54-CLOSURE-REPORT.md#questions-we-no-longer-need-to-re-prove)

---

# H. Valid evidence

| Rule | Detail |
| ---- | ------ |
| **Fresh runs** | Export `page.html` from current codebase after each slice |
| **Baseline comparison** | [rendered-page-sprint-51-final.html](../2026-06-20-sprint-52-production-quality-resource/rendered-page-sprint-51-final.html) — before/after only |
| **Not current evidence** | Historical Marx run2 folders without re-export label |
| **Walk as learner** | Document journey, navigation, progress, and affordance findings before coding |

---

# I. Key implementation surfaces (starting map)

| Concern | Likely location |
| ------- | --------------- |
| Learner HTML export | `app.js` `buildUtilityStructuredHtml`, export pipeline |
| Instructional grammar | `lib/ld-instructional-manifestation-render.js` |
| Activity compass (progress) | Existing compass — extend, do not duplicate Orient prose |
| Pedagogic salience | `lib/ld-pedagogic-salience-render.js` — preserve callouts |
| Export CSS | Utilities page styles — print + nav chrome |

*Exact slice boundaries to be decided per backlog item — one narrow slice at a time.*

---

# J. Handover notes for new chats

## J.1 Start here

1. Read this pack and [SPRINT-55-PRODUCT-BACKLOG.md](./SPRINT-55-PRODUCT-BACKLOG.md).  
2. Generate or open a **fresh** learner `page.html` (Marx or inflation).  
3. Walk the resource as a first-time learner — note journey, navigation, progress gaps.  
4. Propose **one P1 slice** with acceptance criteria before implementation.  

## J.2 Regression anchors

```bash
node --test tests/sprint-50-phase-2-renderer-instructional-grammar.test.js
node --test tests/sprint-51-pedagogic-salience-render.test.js
node --test tests/sprint-51-gam-material-preservation.test.js
node --test tests/page-materials-closure.test.js
```

## J.3 Common failure mode

Jumping to **theme polish** or **content generation** changes before **journey visibility** and **navigation** exist. Sprint 55 P1 exists to prevent that.

---

*End of Sprint 55 context pack.*

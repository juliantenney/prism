# Sprint 55 — Design Principles

**Sprint:** 55 — Educational Product Experience  
**Status:** Accepted at sprint open

---

## Principles

### 1. Make the learning journey visible

Learners should see **where they are** in the resource, **what comes next**, and **how activities connect** — without inferring structure from headings alone.

### 2. Make learner actions obvious

Every activity should make clear **what to read**, **what to do**, **what to check**, and **what to produce** — through affordances, not buried prose.

### 3. Make learner progress visible

Progress is **resource-level** and **activity-level**. Learners should know how much remains and what they have completed.

### 4. Reduce unnecessary cognitive effort

Minimise scanning cost, duplicate orientation, and hidden navigation. Support **landmarks**, **skip paths**, and **predictable layout**.

### 5. Support first-time, returning, revision, and print use

The same export must work for:

| Mode | Need |
| ---- | ---- |
| **First-time** | Orientation and journey map |
| **Returning** | Resume position and progress |
| **Revision** | Quick jump to checks, models, and summaries |
| **Print** | Readable hierarchy without interactive-only chrome |

### 6. Preserve proven instructional architecture

Product experience improvements **must not** weaken:

* Seven-function instructional grammar  
* PEL / GAM / compose authority model  
* Material preservation and closure semantics  
* Pedagogic salience callouts  

Enhance **how** the architecture reads — do not replace **what** it teaches.

### 7. Behave like a document product, not an LMS

Sprint 55 improves the learner experience of **exported resources**.

It does **not** change the underlying product model.

**Enhance:**

* navigation  
* orientation  
* progress visibility  
* revision support  
* affordances  

**Do not introduce:**

* learner accounts  
* analytics  
* grading systems  
* submission systems  
* server-side learner state  
* LMS-style platform features  

PRISM exports learning resources.

Sprint 55 improves **how those resources are experienced**.

### 8. Beat heading survives

Inside activities with episode plans, the **beat heading** is the learner’s progression anchor.

Secondary material headings, icons, callouts, and wrapper chrome must **justify their presence** — default stacking from the pre-beat-first renderer is an anti-pattern.

See [SPRINT-55-CURRENT-STATE.md § Guiding principle](SPRINT-55-CURRENT-STATE.md#remaining-sprint-55-focus).

---

## Anti-patterns

| Avoid | Because |
| ----- | ------- |
| Hiding pedagogy behind product chrome | Sprint 54 retired fidelity as primary risk |
| LMS features (login, analytics, submission) | PRISM exports documents |
| Theme systems before hierarchy works | P3 deferral |
| Architecture changes to fix UX gaps | Product layer first |
| Material-order heuristics overriding episode plans | Beat-first + registry is settled |
| Redundant headings under every beat | Beat heading survives |

---

*Sprint 55 design principles — 2026-06-29. Principle 8 added — 2026-06-29.*

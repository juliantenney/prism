# Sprint 38-C — Planning charter (Self-Study Workbook Pedagogy)

**Date:** 2026-06-04  
**Status:** **CLOSED** (2026-06-04) — observations 38C-1 … 38C-6 done  
**Execution:** **Recommended** as Sprint **38-D** — [38C-6 §7](observations/38C-6-planning-synthesis-and-execution-recommendation.md); charter not written in this pack

---

## Mission

Define what a **high-quality self-study workbook** means in PRISM Learning Design outputs, diagnose gaps against that model, and specify requirements for **DLA**, **GAM**, and **learner page experience** — without reopening Sprint 38-B prompt architecture work.

---

## Preconditions (assumed true)

Sprint 38-B delivered:

- Clarified step ownership and canonical LD modules
- Reduced four-step prompt footprint (**152,782 → 71,960**, −52.9%)
- Design Page compose contract and materials preservation
- B4 table fidelity **MONITORING** with passing Inflation gate evidence
- **730** tests passing

---

## Programme question

> How do we move from activity sheets and reference notes to genuinely effective self-study workbooks?

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Prompt architecture consolidation | 38-B complete |
| Prompt-size / token reduction | Out of charter |
| Automation / probes / CI expansion | Out of charter |
| Runtime implementation | Deferred to future execution phase |
| Sprint 39 reasoning cues | Separate programme gate |

---

## Proposed phases (planning only)

### 38C-1 — Workbook pedagogy model

**Purpose:** Define instructional functions and acceptance criteria for a self-study workbook vs adjacent genres (activity sheet, reference notes, guided tutorial).

**Deliverable:** [observations/38C-1-workbook-pedagogy-model.md](observations/38C-1-workbook-pedagogy-model.md)  
**Status:** **COMPLETE**

---

### 38C-2 — Workbook gap analysis

**Purpose:** Map Inflation (and secondary anchors) against the 38C-1 model — present / partial / absent per function; severity; origin (DLA, GAM, Design Page, vision).

**Deliverable:** [observations/38C-2-workbook-gap-analysis.md](observations/38C-2-workbook-gap-analysis.md)  
**Status:** **COMPLETE** (2026-06-04)  
**Inputs:** 38-B EV captures, golden workshop fixture, 38C quality reviews

---

### 38C-3 — DLA workbook requirements

**Purpose:** Specify what Design Learning Activities must require so downstream steps can author workbook genres (`required_materials`, cognition fields, duration budget, solo-learner task shape).

**Deliverable:** [observations/38C-3-dla-workbook-requirements.md](observations/38C-3-dla-workbook-requirements.md)  
**Status:** **COMPLETE** (2026-06-04)

---

### 38C-4 — GAM instructional genres

**Purpose:** Define GAM author obligations per material type (scenario, worked_example, task_cards, prompt_set, checklist, template, tables) and anti-patterns (reference-only table dumps).

**Deliverable:** [observations/38C-4-gam-instructional-genres.md](observations/38C-4-gam-instructional-genres.md)  
**Status:** **COMPLETE** (2026-06-04)

---

### 38C-5 — Workbook experience and rendering

**Purpose:** Describe learner-visible page structure (sections, progression, consolidation), render implications, and Design Page compose boundaries for workbook shape — observation only.

**Deliverable:** [observations/38C-5-workbook-experience-rendering.md](observations/38C-5-workbook-experience-rendering.md)  
**Status:** **COMPLETE** (2026-06-04)

---

### 38C-6 — Planning synthesis and execution recommendation

**Purpose:** Synthesise 38C-1 … 38C-5; rank execution candidates; recommend single next sprint.

**Deliverable:** [observations/38C-6-planning-synthesis-and-execution-recommendation.md](observations/38C-6-planning-synthesis-and-execution-recommendation.md)  
**Status:** **COMPLETE** (2026-06-04)  
**Recommendation:** Sprint **38-D — Workbook Authoring Contracts**

---

## Phase dependency graph

```text
38C-1 Pedagogy model
    → 38C-2 Gap analysis
        → 38C-3 DLA requirements
        → 38C-4 GAM genres
            → 38C-5 Experience + rendering
                → 38C-6 Synthesis → recommend 38-D
```

**Execution:** Sprint **38-D** recommended — separate execution charter when product approves.

---

## Success criteria (planning phase)

| Criterion | Measure |
|-----------|---------|
| Workbook model documented | 38C-1 **COMPLETE** |
| Gaps evidenced | 38C-2 **COMPLETE** (Inflation EV-01 + comparators) |
| DLA/GAM requirements drafted | 38C-3 and 38C-4 **COMPLETE** |
| Experience slice documented | 38C-5 **COMPLETE** |
| Synthesis and execution recommendation | 38C-6 **COMPLETE** |
| No scope creep | Zero runtime/prompt/test changes during planning |
| Execution path identified | 38-D recommended in 38C-6 |

---

## Boundaries with 38-B

| 38-B owns | 38-C owns |
|-----------|-----------|
| Prompt size, module dedupe, B4 pipe fidelity | Instructional genre, workbook pedagogy, learner experience quality |
| `LD-*` preserve contracts | What upstream must **author** so preserve has substance |
| Wave 1–3 implementation | Sprint **38-D** (recommended — see 38C-6) |

---

## References

- [HANDOVER.md](HANDOVER.md)
- [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md)
- [38C self-study quality review](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-self-study-resource-quality-review.md)

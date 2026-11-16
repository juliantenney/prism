# M2/M3 artefact summary — Design Page + assembled page

**Date:** 2026-11-16  
**Source:** Author-supplied Design Page partial JSON + assembled page JSON for *Why the constraint matters*  
**Purpose:** Close provenance / study-flow gaps left after HTML-only M3 inspection. Full JSON retained by author; this file records the analytically relevant excerpts.

---

## Page synthesis provenance

| Field | Design Page partial | Assembled page | Match |
| ----- | ------------------- | -------------- | ----- |
| `title` | Why the constraint matters | Why the constraint matters | Identical |
| `overview.body` | Orient + predict-before-test + reveal feedback + transfer note | Same | Identical |
| `learning_purpose.body` | Stages as kinds of evidence; preserve reasoning before feedback | Same | Identical |
| `knowledge_summary.body` | Constrained optimisation advance organiser | Same | Identical |
| `study_tips.body` | Four consolidation bullets | Same; also appears as `### Page learner-resource closure` inside A4-M5 | Identical / transported |

**Confirmed:** Assembly preserved Design Page `page_synthesis` verbatim for this regen.  
**Still unverified:** Whether Design Page newly authored those bodies or transported upstream Copilot/GAM prose (effective Design Page prompt still not supplied). Study tips match the A4-M5 closure block, consistent with TRANSPORT ONLY for study_tips when that section is present.

Design Page partial `assembly_state.enriched_by`: `["design_page"]`.  
Assembled `enriched_by`: `episode_plan`, `dla`, `gam`, `learning_sequence`, `design_page`.

---

## Learning Sequence shape (assembled)

Runtime LS includes:

- `ordered_activity_ids`: A1→A2→A3→A4  
- `timeline[]` with per-activity `learner_study_flow[]` steps: `{ step, action, material_ids, disclosure }`  
- `navigation.feedback_disclosure`: post_attempt policy listing A2-M4, A3-M3, A4-M5  
- **No** top-level `learning_sequence.study_flow` (phase + activity_ids) in this assembled page

### Intended per-activity disclosure (authored)

| Activity | Intended first action | Scaffold timing | Post-attempt materials |
| -------- | --------------------- | --------------- | ---------------------- |
| **A1** | Predict using A1-M1/A1-M2 **before examining** mathematical explanation | Then use A1-M1 to formulate; A1-M3 guided review | Checklist A1-M3 |
| **A2** | Inspect A2-M1 + begin A2-M3 calculations | A2-M2 **optional_scaffold** if needed | Reveal A2-M4 then A2-M5 |
| **A3** | Attempt substitution/range in **A3-M2 first** | Then study distinct illustration **A3-M1** | Reveal A3-M3 then A3-M4 |
| **A4** | Reflect A4-M1; then transfer attempt A4-M2/M3/M4 | — | Reveal A4-M5 then A4-M6 |

---

## Rendered order vs intended (from prior HTML parse)

Fixed presentation: Orient → Learn → Do → Check (→ Transfer on A4).

| Activity | Rendered Learn | Rendered Do | Conflict with LS? |
| -------- | -------------- | ----------- | ----------------- |
| A1 | A1-M1 full objective/constraint text | Prediction + formulation template | **Yes (planning vs presentation)** — LS wants prediction before examining A1-M1 explanation; Learn shows A1-M1 first. Severity: moderate for proportion-prediction (definitions visible before Do); not a completed-answer spoil. |
| A2 | A2-M2 modelling note (distinct a=3,b=7) | A2-M1 scenario + A2-M3 table | **Yes (optional → required pre-task)** — LS marks A2-M2 optional after initial attempt; renderer places it in Learn before Do. Distinct-data modelling limits spoiling of R1–R4. |
| A3 | A3-M1 full illustrative completed-square proof (p+q=12) | A3-M2 blank proof template | **Yes (scaffold-before-attempt)** — LS wants A3-M2 attempt **before** A3-M1; renderer puts A3-M1 in Learn first. Destination for *original* problem still in Check (A3-M3). Strongest instructional mismatch. |
| A4 | A4-M2 scenario | Reflection + transfer workspaces | Largely aligned for transfer attempt; sample_output A4-M5 in Check |

Post-attempt materials A2-M4 / A3-M3 / A4-M5 are Check-placed with Reveal-after titles — **aligned** with `navigation.feedback_disclosure` and LS post_attempt steps at the *material-type* level, not because `timeline.learner_study_flow` is executed.

---

## Implementation note (refined)

Three distinct “study flow” concepts now confirmed in evidence:

1. **Prompt wording** `learner_study_flow` (EQF / LS authoring).  
2. **Authored data** `learning_sequence.timeline[].learner_study_flow` (step/action/material_ids/disclosure) — present in this assembled page; **not referenced** by assembly/renderer code paths found in M3.  
3. **Renderer Orient metadata** `learning_sequence.study_flow` (phase + activity_ids) — **absent** from this page; would only label Orient if present.

Assembly copies the whole `learning_sequence` object (so timeline study flows are retained in JSON) but does not drive moment order or disclosure from them.

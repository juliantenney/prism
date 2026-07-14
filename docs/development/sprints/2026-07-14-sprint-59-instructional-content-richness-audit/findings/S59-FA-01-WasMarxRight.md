# Sprint 59 First Audit — WasMarxRight

| Field | Value |
| ----- | ----- |
| Sample ID | S59-FA-01 |
| Workflow ID | `ba3f2a76-b12c-45f5-b99e-f14558023681` |
| Title / topic | Was Marx Right? (self-study) |
| Date reviewed | 2026-07-14 |
| Reviewer | Sprint 59 first-audit pass |
| Pipeline | Sprint 58 partial (`pageEnrichmentV2` + `partialPageOutputs`) |
| Rubric version | `rubric-v0.1` (pilot) |
| Audit status | complete |

**Sprint context (post-finding):** First-audit finding retained. Systemic thin GAM later attributed to soft enforcement + **instructional-archetype support asymmetry** — see [../instructional-archetype-audit.md](../instructional-archetype-audit.md) and [../backlog.md](../backlog.md).

## Workflow type

- [x] Simple / topic (self-study; `generate_from_topic` metadata)
- [ ] Transcript
- [ ] Other

## Evidence status

- [x] **Stage-capture scoreable** — post-EP stage captures reviewed; assembly/render transient (not required)
- [ ] Full evidence / Inventory-only / Insufficient

**Evidence limitations:** LO, LC, KM captures empty (steps marked complete in runstate). No assessment-design stage. No renderer or assembly artefacts reviewed.

## Artefact references

| Artefact | Step ID | Present |
| -------- | ------- | ------- |
| LO | `d6035725-…` | Missing (empty capture) |
| LC | `7033652f-…` | Missing |
| KM | `3f10f01f-…` | Missing |
| EP | `52a12d2a-…` | Present |
| DLA | `2c043761-…` | Present |
| GAM | `c03347ec-…` | Present |
| Assessment design | — | Not in workflow |
| Assessment items | `afddfbfa-…` | Present |
| LS | `2a544cc0-…` | Present |
| DP | `7675f2d6-…` | Present |

Source bundle: `artefacts/first-audit/WasMarxRight_ba3f2a76.json`

---

## Content inventory

| Content type | Present? | Canonical owner | Observed path | Notes |
| ------------ | -------- | --------------- | ------------- | ----- |
| Knowledge summary | Y | DP | `captures[DP].page_synthesis.knowledge_summary` (~280 words) | No overview/purpose/study_tips |
| Learning journey | Partial | DP / LS | LS `learning_sequence.timeline`; no DP overview | Sequencing in LS only |
| Activity instructions | Y | DLA | `captures[DLA].activities[]` | Rich numbered tasks |
| Explanatory text | Y | GAM | `activities[].materials[]` type `text` | All bodies &lt;100 words |
| Worked example | Y | GAM | type `worked_example` | Mostly &lt;45 words; A1 strongest structure |
| Scenario | Y | GAM | type `scenario` | A3, A4, A5 — very brief |
| Case study | N | GAM | — | |
| Reflection prompt | Partial | GAM | `prompt_set` / `transfer_prompt` | Brief |
| Discussion prompt | N | DLA | — | Self-study |
| Formative assessment (design) | N | Assess (design) | — | **Not assessable** |
| Summative assessment (design) | N | Assess (design) | — | |
| MCQ items | Y | Assess (items) | `assessment_check.items[]` (5) | No feedback fields |
| Feedback / rationale | N | Assess (items) | — | |
| Study tips | N | DP | — | |

---

## Quantitative metrics (descriptive)

| Metric | Value |
| ------ | ----- |
| Activities (DLA) | 5 |
| GAM materials (total) | 26 |
| Materials with body &lt;80 words | 26 / 26 |
| Scenario materials | 3 |
| Assessment items | 5 MCQ |
| Item feedback present | 0 / 5 |
| knowledge_summary words | ~280 |

---

## Rubric scores (pilot)

| Content type | Score | V? | Rationale |
| ------------ | ----- | -- | --------- |
| Knowledge summary | 3 | | ~280 words; concepts + relations (surplus value, class struggle) |
| Learning journey | 2 | | LS timeline present; no overview/purpose at DP |
| Activity instructions | 3 | | Explicit tasks, outputs, 5–7 steps per activity |
| Explanatory text | 2 | | Present but consistently brief (37–64 words) |
| Worked example | 2 | | Structured steps in A1; many are outline-only (21–39 words) |
| Scenario | 1 | | Named cases but minimal stakes/constraints (18–23 words) |
| Case study | — | | Not present |
| Reflection prompt | 2 | | Present via prompt_set; thin |
| MCQ items | 2 | | Clear stems, plausible distractors; stems often session-referential |
| Feedback / rationale | 1 | | Absent on all items |
| Study tips | — | | Not present |

---

## Instructional-flow review

| Activity | Explanation | Example/model | Guided practice | Independent practice | Assessment/check | Support gap? | Primary class |
| -------- | ----------- | ------------- | --------------- | -------------------- | ---------------- | ------------ | ------------- |
| A1 | Partial | Partial | Present | Present | Not expected | Y | A |
| A2 | Partial | Partial | Present | Present | Not expected | Y | A |
| A3 | Partial | Partial | Present | Partial | Not expected | Y | A |
| A4 | Partial | Partial | Present | Partial | Not expected | Y | A |
| A5 | Partial | Partial | Present | Present | Not expected | Y | A |

**Gap pattern:** DLA requires multi-step production (e.g. three historical conditions, evaluative judgement) while GAM explanatory and scenario bodies remain thin. Guided scaffolds (tables, checklists) exist but explanation/model depth is often below task demand.

---

## Findings (primary class)

| ID | Finding | Class | Severity |
| -- | ------- | ----- | -------- |
| FA01-001 | All 26 GAM material bodies &lt;80 words; explanatory text below rubric hypothesis (~150+ words) | A | S2 |
| FA01-002 | Scenarios (e.g. A3-M2 NovaTech/StreamWork) lack stakes, constraints, decision prompts beyond labels | A | S2 |
| FA01-003 | Worked examples often skip intermediate reasoning (e.g. A3-M1 “Applying a Prediction”, 21 words) | A | S2 |
| FA01-004 | DLA tasks exceed material support — e.g. A1 step 5 requires three linked conditions; A1-M1 text ~64 words | A | S2 |
| FA01-005 | DP `page_synthesis` has knowledge_summary only; no overview, learning_purpose, or study_tips | A | S1 |
| FA01-006 | Assessment items: no feedback/rationale on any of 5 MCQs | A | S2 |
| FA01-007 | Assessment design not assessable from available workflow evidence | — | — |

No Class B/C/D findings (no renderer/assembly/validator evidence).

---

## Assessment-design review

**Assessment design not assessable from available workflow evidence.**

## Assessment workload realism

| Field | Value |
| ----- | ----- |
| Stated duration | 60 minutes (metadata) |
| Activity sequence | 5 activities (LS ordered A1–A5) |
| Assessment | 5 MCQs |
| Estimated assessment time | ~8–12 min (reviewer estimate: ~1.5–2 min/item) |
| **Verdict** | **questionable** — five substantive production activities plus five MCQs likely exceeds 60 min for typical self-study pace |

## Assessment-item review

| Item | LO (EP) | Activity | Material | Answerable? | Primary class |
| ---- | ------- | -------- | -------- | ----------- | ------------- |
| Q1 Industrial Revolution | LO1 (historical context) | A1 | A1-M1, A1-M2 | Partial — session framing helps | A |
| Q2 Bourgeoisie/proletariat | LO2 (core concepts) | A2 | A2-M1 glossary-style | Y | — |
| Q3 Wealth concentration | LO3 (predictions) | A3 | A3-M1, A3-M2 thin | Partial | A |

Items lack `feedback` / `rationale` fields. Design intent (formative MCQ) inferable from brief only — not scored as defect.

---

## Strengths

- DLA instructional design: numbered steps, clear expected outputs, progressive cognitive demand (foundation → evaluation).
- LS provides ordered timeline and navigation metadata.
- knowledge_summary at DP is substantive and concept-linked.
- Assessment stems reference session content; distractors are plausible.

## Evidence excerpts

```
GAM A3-M2 (scenario): "### Case A: NovaTech\nA multinational technology firm...\n### Case B: StreamWork\nA digital platform..."
DLA A1 learner_task step 5: "Write a short explanation describing three historical conditions..."
```

---

## Recommended action (audit phase)

Observe and feed cross-workflow summary / hypothesis list. No backlog tickets in this pass.

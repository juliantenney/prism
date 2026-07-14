# Sprint 59 First Audit — Introduction to Educational Psychology

| Field | Value |
| ----- | ----- |
| Sample ID | S59-FA-02 |
| Workflow ID | `dac8dd73-50ff-4abc-b64a-d7547008d191` |
| Title / topic | Educational Psychology (self-study) |
| Date reviewed | 2026-07-14 |
| Reviewer | Sprint 59 first-audit pass |
| Pipeline | Sprint 58 partial |
| Rubric version | `rubric-v0.1` (pilot) |
| Audit status | complete |

**Sprint context (post-finding):** First-audit finding retained. Systemic thin GAM later attributed to soft enforcement + **instructional-archetype support asymmetry** — see [../instructional-archetype-audit.md](../instructional-archetype-audit.md) and [../backlog.md](../backlog.md).

## Workflow type

- [x] Simple / topic (`generate_from_topic`)
- [ ] Transcript
- [ ] Other

## Evidence status

- [x] **Stage-capture scoreable**
- **Limitations:** LO/LC/KM empty; DP capture contains `learning_sequence` not `page_synthesis`; LS also holds sequence (duplicate shape at DP step).

## Artefact references

| Artefact | Step ID | Present |
| -------- | ------- | ------- |
| EP | `ffdc2fbe-…` | Present |
| DLA | `8cd88a1a-…` | Present |
| GAM | `fc9cedd0-…` | Present |
| Assessment items | `31323a6a-…` | Present (5 MCQ) |
| LS | `26d14fd3-…` | Present |
| DP | `2b3633eb-…` | Present ( **`learning_sequence` only** ) |

Source: `artefacts/first-audit/Introduction_to_Educational_Psychology_dac8dd73.json`

---

## Content inventory

| Content type | Present? | Owner | Observed path | Notes |
| ------------ | -------- | ----- | ------------- | ----- |
| Knowledge summary | N | DP | EP shell `page_synthesis` empty | Not in DP capture |
| Learning journey | Partial | LS | `learning_sequence.timeline` (10+15+… min) | DP duplicated LS field |
| Activity instructions | Y | DLA | 5 activities, avg ~72 instruction words | |
| Explanatory text | Y | GAM | text materials 37–74 words | |
| Worked example | Y | GAM | A1-M2 has clearest steps (~73 words body) | |
| Scenario | Y | GAM | A2-M3, A4-M2, A5-M1 | 28–39 words |
| MCQ items | Y | Assess (items) | 5 items | No feedback |
| Assessment design | N | — | **Not assessable** | |

---

## Rubric scores (pilot)

| Content type | Score | V? | Rationale |
| ------------ | ----- | -- | --------- |
| Knowledge summary | 1 | | Absent at DP; EP shell empty |
| Learning journey | 2 | | LS timeline + transitions; no learner-facing overview |
| Activity instructions | 3 | | Clear multi-step tasks |
| Explanatory text | 2 | | Bullet/overview style; under length hypothesis |
| Worked example | 2 | | A1-M2 multi-step; others ~44 words |
| Scenario | 1 | | Case labels without depth (Mrs Ahmed / Mr Lewis) |
| MCQ items | 2 | | Answerable from materials; Q3–Q5 need material recall |
| Feedback / rationale | 1 | | Absent |

---

## Instructional-flow review

| Activity | Explanation | Example/model | Guided practice | Independent practice | Assessment/check | Support gap? | Class |
| -------- | ----------- | ------------- | --------------- | -------------------- | ---------------- | ------------ | ----- |
| A1 | Partial | Partial | Present | Present | Not expected | Y | A |
| A2 | Partial | Partial | Present | Present | Not expected | Y | A |
| A3 | Partial | Absent | Present | Partial | Not expected | Y | A |
| A4 | Partial | Absent | Present | Present | Not expected | Y | A |
| A5 | Partial | Partial | Present | Present | Not expected | Y | A |

A3 DLA asks to “explain retrieval and spaced practice” but GAM has no worked example — only cards + short text.

---

## Findings

| ID | Finding | Class | Severity |
| -- | ------- | ----- | -------- |
| FA02-001 | DP partial emits `learning_sequence` only — no `page_synthesis` / knowledge_summary at DP | A | S2 |
| FA02-002 | 23/23 GAM material bodies &lt;80 words | A | S2 |
| FA02-003 | Scenarios too thin for analysis tasks (A2 classroom cases ~31 words) | A | S2 |
| FA02-004 | A3 independent explanation task unsupported by worked example material | A | S2 |
| FA02-005 | No item-level feedback on 5 formative MCQs | A | S2 |
| FA02-006 | Assessment design not assessable | — | — |

---

## Assessment workload realism

| Field | Value |
| ----- | ----- |
| Stated duration | 60 minutes |
| LS timeline sum | 10+15+12+10+13 = 60 min (activities only) |
| Assessment | 5 MCQs (~8–12 min estimated) |
| **Verdict** | **unrealistic** if all activities completed as written **and** MCQs attempted within 60 min |

## Assessment-item chains (3 items)

| Item | LO / topic | Activity | Material | Answerable? |
| ---- | ---------- | -------- | -------- | ----------- |
| Q1 define ed psych | Foundation | A1 | A1-M1 | Y |
| Q2 constructivism scenario | Theories | A2 | A2-M1, A2-M3 | Y |
| Q3 memory encoding | Cognition | A3 | A3-M1 | Y (brief text) |

---

## Strengths

- Strong DLA scaffolding pattern (consistent across activities).
- LS timeline aligns with stated 60-minute session.
- A1 worked example shows clearest step structure in sample set.
- MCQ stems align with activity progression.

## Evidence excerpt

```
DP capture keys: ["artifact_type","schema_version","assembly_state","learning_sequence"]
EP page_synthesis: {}
```

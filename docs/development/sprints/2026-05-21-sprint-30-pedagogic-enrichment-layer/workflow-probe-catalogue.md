# Sprint 30 workflow probe catalogue

**Purpose:** Standard briefs for live Factory runs and regression comparison.

**Context detail:** [`context-files/`](context-files/)

---

## Probe index

| ID | Name | Type | Primary test |
|----|------|------|--------------|
| **P30-01** | Marx self-study page | Live + fixture | `workflow-self-directed-activity-framing-adoption.test.js` |
| **P30-02** | RNA transcript self-study | Live + fixture | `workflow-brief-learner-resource-defaults.test.js` |
| **P30-03** | Climate misconception workshop | Regression only | `workflow-ld-cognition-contracts.test.js`, brief defaults |
| **P30-04** | Generic learner page | Resolver | `workflow-brief-learner-resource-defaults.test.js` (generic row) |
| **P30-05** | Kitchen-sink renderer | Fixture | `utility-renderer-kitchen-sink.test.js` |

---

## P30-01 — Marx self-study page

**Goal (canonical):**

```
Create a self-directed learning page on Karl Marx covering life phases, cause-effect links,
comparison of major works, and application of core concepts.
```

**Inputs:** `Undergraduate (self-directed study)`  
**Desired outputs:** `Learner-facing page`  
**Domains:** `learning-design`

**Resolved expectations:**

- `delivery_context: self_directed`
- `session_materials` includes `page`
- Not `face_to_face` / not `classroom` default

**Capture on live run:** `context-files/probe-p30-01-marx-live.md`

---

## P30-02 — RNA transcript self-study

**Goal:**

```
create a one hour self-study session for undergraduate students based on uploaded transcript
```

**Inputs:**

```
Uploaded lecture transcript on RNA viruses and hepatitis C (HCV).
```

**Desired outputs:** `Learner-facing page`  
**Starting artefact:** `provided_source_content`

**Resolved expectations:**

- `input_strategy: provided_source_content`
- `delivery_mode: async`
- `delivery_context: self_directed`
- Topic matches RNA/HCV — not “the uploaded transcript”

**Fixture:** `tests/fixtures/workflow-brief-ld-sparse/rna-virus-activities-formative.json`

**Capture on live run:** `context-files/probe-p30-02-rna-live.md`

---

## P30-03 — Workshop regression (do not enrich as self-study)

**Goal (excerpt):**

```
Using the uploaded lecture on climate change, create a misconception discussion workshop
with task cards and small group discussion.
```

**Resolved expectations:**

- `delivery_context` ≠ `self_directed`
- `delivery_mode: live_workshop`
- `learning_environments` includes `classroom`
- DLA prompt **without** self-directed OUTPUT CONTRACT

**Test-only** — no mandatory live run for 30-1.

---

## P30-04 — Generic learner-facing page

**Goal:**

```
Create a learner-facing page on photosynthesis with short learning activities.
```

**Desired outputs:** `Learner-facing page`

**Resolved expectations:** self-directed lean; no classroom default.

---

## Live run capture checklist

When saving probe notes under `context-files/`:

1. Brief blob (goal, inputs, outputs, starting artefact)  
2. Resolved factors panel (screenshot or JSON)  
3. Workflow `steps[]` titles  
4. Sample `learning_activities` activity row (framing fields)  
5. Rendered HTML excerpt or page JSON path  
6. Rubric scores from slice charter  
7. Test floor after change: `node --test tests/*.test.js`

# Probe P27-04 — Diagnostic misconception assessment

**Probe ID:** P27-04  
**Captured:** 2026-05-21  
**Methods:**

1. **E/O:** Read-only extract + heuristics — [`27-3-probe-capture.json`](27-3-probe-capture.json) → `probes[2]`
2. **G/C/R proxy:** Existing page fixture + renderer test API — **not** a live run from this exact brief

---

## Exact brief text

**Goal:**

> Using the uploaded lecture on climate change, create a misconception discussion workshop. Provide task cards of common false claims, an analysis worksheet, and discussion prompts. End with true/false diagnostic statements — learners should not see correct answers on the handout.

**Inputs:**

> Uploaded lecture transcript on climate change science.

**Desired outputs:**

> Learner page for workshop discussion and formative check.

**Starting artefact:** `provided_source_content`  
**Selected domains:** `learning-design`

---

## Resolved factors JSON (E/O capture)

```json
{
  "session_materials": ["page"],
  "desired_outputs": "Learner page for workshop discussion and formative check.",
  "input_strategy": "provided_source_content",
  "delivery_mode": "live_workshop",
  "activities_required": true,
  "page_profile": "learner",
  "include_answers": true,
  "topic": "climate change",
  "workshop_subject": "climate change",
  "materials_required": true,
  "objective_type": "analysis",
  "design_scope": "session",
  "delivery_pattern": "face_to_face"
}
```

**Not set:** `assessment_required` (brief has no “assessment” token — only “true/false diagnostic statements”), `assessment_type`, `feedback_display`, `feedback_required`.

**E bug (reconfirmed):** `include_answers: true` despite hide-answers prose (R27-007 — “correct answers” substring).

---

## Workflow topology

```
Normalize Content
→ Model Knowledge
→ Define Learning Outcomes
→ Design Learning Activities
→ Generate Activity Materials
→ Generate Assessment Items
→ Construct Learning Sequence
→ Design Page
```

| Step | Present? |
|------|----------|
| **Design Assessment** | **No** |
| **Design Feedback** | **No** |

---

## Candidate semantics vs capture

| Candidate factor | Intended | Captured | Layer |
|------------------|----------|----------|-------|
| `feedback_timing` | tutor-led / after discussion | **null** | **E** |
| `assessment_interaction_mode` | `diagnostic_misconception` | **null** | **E** |
| `learner_answer_visibility` | `hidden_until_reveal` | **`include_answers: true`** (wrong) | **E** |
| `misconception_assessment_link` | true | **null** | **E** |
| `peer_instruction_phase` | n/a | CLS present | weak **O** |
| `design_feedback_required` | false | step absent | **O** |

---

## Live `assessment_items` — PENDING

No `assessment_items` JSON was generated in 27-3 for this brief.

**Planned excerpt fields:** `item_id`, `item_type`, `proposition`/`statement`, `true_false_answer`, `explanation_or_rationale`.

---

## Fixture proxy (G/C/R only) — `ld-climate-misconception-discussion-page.json`

**Label:** 27-1 regression fixture aligned with catalogue P27-04 shape; **not** produced from the exact probe brief above in this sprint.

### `assessment_items` excerpt (composed page items)

```json
[
  {
    "item_id": "TF-1",
    "item_type": "true_false",
    "proposition": "Cold winters in one region prove that global warming is not happening.",
    "true_false_answer": "False"
  },
  {
    "item_id": "TF-2",
    "item_type": "true_false",
    "statement": "Climate models are unreliable because they cannot predict daily weather.",
    "true_false_answer": "False"
  }
]
```

### `feedback_pack`

**Absent** in fixture (no `feedback_pack` artefact or section).

### Page `sections[]` IDs and headings

| section_id | heading |
|------------|---------|
| `overview` | Overview |
| `learning_activities` | Learning activities |
| `assessment_check` | Formative assessment check |

### Page-level flags

| Field | Value |
|-------|-------|
| `page_profile` | `learner` |
| `feedback_display` | `"none"` |
| `include_answers` | *(unset on root)* |

### Export HTML (learner) — captured via `buildUtilityStructuredHtmlForTest`

| Check | Result |
|-------|--------|
| True/false options rendered | **Yes** (`util-true-false-options`) |
| “Correct answer” / “Answer Key” in HTML | **No** |
| Answer grid at end | **No** |

**Source:** Same assertions as `tests/utility-ld-climate-misconception-page-render.test.js` L139–149; 27-3 runner re-ran renderer on fixture.

---

## Layer trace (with proxy)

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **E** | **Dropped** diagnostic link, timing, hide-answers; **mis-set** `include_answers` | E/O capture |
| **O** | **Partial** — full activity + GAI + DP; no Design Feedback | Topology |
| **G** | **Partial (proxy)** — misconception-rich **activities**; T/F items with answers in JSON | Fixture activity `materials` + assessment items |
| **C** | **Partial (proxy)** — answers in JSON; `feedback_display: none` on page | Fixture |
| **R** | **Preserved (proxy)** — hides answers in HTML | Renderer capture |

**Intent split:** Discussion/diagnostic pedagogy **preserved in G** for activities; **assessment block** is still T/F retrieval shape with answers in data model; **learner visibility** recovered at **C/R** via `feedback_display`, not via **E** `include_answers`.

---

## Probe verdict (27-3)

P27-04 is the only priority probe with **fixture-backed G/C/R evidence**. It shows **misconception pedagogy does not propagate into elicitation factors** but can still appear in **artefacts** and **export policy**. Candidate factors explain **E** loss and **C/R mitigation** without conflating them.

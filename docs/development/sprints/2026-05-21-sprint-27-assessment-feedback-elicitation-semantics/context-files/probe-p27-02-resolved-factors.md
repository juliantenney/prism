# Probe P27-02 — Tutor-led delayed-feedback discussion quiz

**Probe ID:** P27-02  
**Captured:** 2026-05-21  
**Method:** Read-only `extractWorkflowBriefExplicitFactors` + `applyWorkflowDesignHeuristics` via [`27-3-probe-runner.js`](27-3-probe-runner.js). **No live Factory / OpenAI run.**  
**Raw JSON:** [`27-3-probe-capture.json`](27-3-probe-capture.json) → `probes[0]`

---

## Exact brief text

**Goal:**

> Design a 60-minute seminar on ocean acidification for undergraduate marine science students. Small groups discuss scenario questions using provided prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout — tutor will debrief.

**Inputs:**

> Include facilitator notes with pacing for discussion, scenario prompts, and debrief guidance for the formative check.

**Desired outputs:**

> Learner handout page plus facilitator session notes.

**Starting artefact:** `generate_from_topic`  
**Selected domains:** `learning-design`

---

## Resolved factors JSON (extract + panel merge)

```json
{
  "session_materials": ["page"],
  "desired_outputs": "Learner handout page plus facilitator session notes.",
  "input_strategy": "generate_from_topic",
  "learner_level": "undergraduate",
  "delivery_mode": "seminar",
  "page_profile": "facilitator",
  "include_answers": true,
  "topic": "ocean acidification",
  "workshop_subject": "ocean acidification for undergraduate marine science students",
  "objective_type": "questions",
  "design_scope": "session",
  "delivery_pattern": "face_to_face"
}
```

**Not set by extract (notable):** `assessment_required`, `assessment_total_items` (5), `activities_required`, `feedback_required`, `feedback_display`, `assessment_type`.

---

## Workflow topology (step titles)

```
Normalize Content
→ Generate Learning Content
→ Model Knowledge
→ Define Learning Outcomes
→ Generate Assessment Items
→ Design Learning Activities
→ Generate Activity Materials
→ Construct Learning Sequence
→ Design Page
```

| Step | Present? |
|------|----------|
| **Design Assessment** | **No** |
| **Design Feedback** | **No** |

**O note:** `Generate Assessment Items` appears **before** `Design Learning Activities` in heuristic output — discussion-then-check sequencing is not encoded in step order.

---

## Candidate semantics vs capture (R27-017 vocabulary)

| Candidate factor | Intended (probe) | Captured in resolved JSON / topology | Layer where lost |
|------------------|------------------|--------------------------------------|------------------|
| `feedback_timing` | `after_peer_discussion` / `tutor_led_reveal_only` | **null** | **E** |
| `assessment_interaction_mode` | `discussion_oriented` | **null** (prose only) | **E** |
| `learner_answer_visibility` | `hidden_until_reveal` | **`include_answers: true`** (inverts brief) | **E** |
| `tutor_answer_artefact` | facilitator pack + hidden learner answers | `page_profile: facilitator` only (collateral from “facilitator notes”) | **E** (conflicts with learner handout intent — R27-011 pattern) |
| `peer_instruction_phase` | `small_group_discussion_then_check` | CLS step only (weak proxy) | **E**, **O** (no binding to assessment) |
| `misconception_assessment_link` | optional | **null** | **E** |
| `confidence_rating_required` | false | false (absent) | — |
| `design_feedback_required` | true (desired) | **false** (step absent) | **O** (R27-008) |

---

## Live generation artefacts — PENDING

| Artefact | Status |
|----------|--------|
| `assessment_items` excerpt | **PENDING** — no LLM run |
| `feedback_pack` | **PENDING** |
| `page.sections[]` | **PENDING** |
| `page.feedback_display` / `include_answers` | **PENDING** |
| Learner export HTML | **PENDING** |

**Planned capture (27-3 manual or 27-4):** First 2 items with `correct_answer` fields; whether `feedback_pack` exists; section IDs; HTML answer visibility after composition.

---

## Layer trace — intended pedagogy

| Layer | Preserved / transformed / dropped | Evidence |
|-------|-----------------------------------|----------|
| **E** | **Dropped** timing, interaction mode, hide-answers; **false positive** `include_answers`; facilitator `page_profile` | This capture |
| **O** | **Partial** — activity chain + CLS + GAI + DP; **no** Design Assessment / Design Feedback; odd GAI-before-DLA order | This capture |
| **G** | **Pending** | — |
| **C** | **Pending** | — |
| **R** | **Pending** | — |

---

## Probe verdict (27-3)

Brief asks for **discuss → check → tutor debrief → hidden answers**. Captured factors **do not** encode that semantics bundle; `design_feedback_required` is **not** satisfied. Candidate factors **correctly label** the loss points at **E** and **O** even before live G/C/R runs.

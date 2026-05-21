# Probe P27-03 — Peer instruction workflow

**Probe ID:** P27-03  
**Captured:** 2026-05-21  
**Method:** Read-only extract + heuristics ([`27-3-probe-runner.js`](27-3-probe-runner.js)). **No live Factory / OpenAI run.**  
**Raw JSON:** [`27-3-probe-capture.json`](27-3-probe-capture.json) → `probes[1]`

---

## Exact brief text

**Goal:**

> Create a peer instruction session on stoichiometry: students attempt problems individually, discuss in pairs, then revise answers. Include 6 MCQs and reflection prompts. Emphasise pair discussion before confirming solutions.

**Inputs:**

> First-year chemistry; 90-minute lab session.

**Desired outputs:**

> Learner-facing session page with activities and MCQ check.

**Starting artefact:** `generate_from_topic`  
**Selected domains:** `learning-design`

---

## Resolved factors JSON

```json
{
  "session_materials": ["page"],
  "desired_outputs": "Learner-facing session page with activities and MCQ check.",
  "input_strategy": "generate_from_topic",
  "assessment_required": true,
  "activities_required": true,
  "page_profile": "assessment",
  "assessment_type": "mcq",
  "assessment_total_items": 6,
  "topic": "stoichiometry",
  "workshop_subject": "stoichiometry: students attempt problems individually",
  "materials_required": true,
  "design_scope": "session",
  "delivery_pattern": "face_to_face",
  "learner_level": "undergraduate"
}
```

**Strong E signals:** `assessment_total_items: 6`, `assessment_type: mcq`, `activities_required`.  
**E side effect:** `page_profile: assessment` from “MCQ check” (~7303) while desired output is learner-facing page.

---

## Workflow topology

```
Normalize Content
→ Generate Learning Content
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

**O note:** Activity chain present (DLA before GAI) — better ordering than P27-02 for “activities then check”.

---

## Candidate semantics vs capture

| Candidate factor | Intended | Captured | Layer where lost |
|------------------|----------|----------|------------------|
| `feedback_timing` | `after_peer_discussion` | **null** | **E** |
| `assessment_interaction_mode` | discussion + retrieval mix | **null** | **E** |
| `learner_answer_visibility` | hidden until pair discussion completes | **unset** (not `include_answers: false`) | **E** |
| `peer_instruction_phase` | `think_pair_share` | CLS only; **no** `grouping: pair` on assessment | **E**, **G** (pending) |
| `misconception_assessment_link` | n/a | **null** | — |
| `confidence_rating_required` | false | absent | — |
| `design_feedback_required` | false (probe expectation) | **false** (absent) | **O** (matches absence; no “confirming solutions” → feedback pack cue) |

---

## Live generation artefacts — PENDING

| Artefact | Status |
|----------|--------|
| `assessment_items` | **PENDING** |
| `feedback_pack` | **PENDING** |
| `page.sections[]` | **PENDING** |
| `feedback_display` / `include_answers` on page | **PENDING** |
| Export HTML — answers before/after discussion blocks | **PENDING** |

---

## Layer trace

| Layer | Verdict | Notes |
|-------|---------|-------|
| **E** | **Partial** | Count/type captured; **peer-instruction timing** and **discussion-before-reveal** not captured |
| **O** | **Partial** | Rich chain; no Design Feedback; assessment page profile may skew C |
| **G** | **Pending** | Likely MCQ retrieval shape (H2) |
| **C** | **Pending** | |
| **R** | **Pending** | |

---

## Probe verdict (27-3)

Probe stresses **pair discussion before confirming solutions**. System elicits **6 MCQs** and **activity chain** but **not** `peer_instruction_phase` or `feedback_timing`. Candidate factors identify **E** as first loss; without live page/HTML we cannot confirm whether **G** preserves pair pedagogy only in activities (H5 expectation).

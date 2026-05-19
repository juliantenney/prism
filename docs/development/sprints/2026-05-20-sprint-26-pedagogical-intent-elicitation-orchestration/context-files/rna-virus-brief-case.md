# Case study — RNA virus / HCV self-study sparse brief

**Authoritative runtime:** `app.js`, `domains/learning-design/domain-learning-design-step-patterns.md`  
**Pack investigation:** [`../slice-26-1-charter.md`](../slice-26-1-charter.md)

---

## Why this case matters

It separates **good topic grounding** from **bad workflow topology**:

- Educator uploaded a **lecture transcript** (authoritative source content).
- Brief asked for **short learning activities** and acceptable **self-study** delivery.
- Workflow still produced an **assessment-forward** chain and **skipped** activity/material generation steps.
- Design Page correctly surfaced missing upstream activities — proving the failure is **planning/topology**, not page composition alone.

---

## Brief shape (reconstructed — verify against live run)

Capture exact Factory fields in 26-1 from browser export or screenshots. Expected shape:

| Field | Typical content (paraphrase) |
|-------|------------------------------|
| **Design intent** | Self-study resource / revision page from lecture material |
| **Goal** | Help learners understand RNA viruses / HCV using uploaded transcript |
| **Inputs** | Uploaded lecture transcript (PDF or pasted text) |
| **Desired outputs** | Learner-facing page with **short learning activities**, formative check |
| **Audience** | Undergraduate / self-study (verify) |
| **Starting artefact** | `provided_source_content` (expected when transcript attached) |

**Phrases to verify in saved brief blob:** `learning activities`, `short activities`, `formative`, `self-study`, `transcript`, `RNA`, `hepatitis`.

---

## Expected pedagogy (reference topology)

```
Normalize Content
→ Model Knowledge
→ Define Learning Outcomes
→ Design Learning Activities
→ Generate Activity Materials
→ Generate Assessment Items   (if formative assessment requested)
→ Design Page
```

Optional: `Construct Learning Sequence` only if timed session / sequence explicitly requested — not required for generic self-study page.

---

## Observed topology (reported)

```
Normalize Content
→ Model Knowledge
→ Define Learning Outcomes
→ Generate Assessment Items
→ Design Page
```

**Missing:** `Design Learning Activities`, `Generate Activity Materials`.

---

## Investigation hooks

| Question | Where to look |
|----------|----------------|
| Was `activities?` matched in heuristics? | `explicitSessionOrActivityRequested` regex in `applyWorkflowDesignHeuristics` |
| Did formative assessment trigger lean prune? | `formativeAssessmentPackDefaultIntent`, `leanAssessmentItemIntent` |
| Was `assessment_required` set? | `extractWorkflowBriefExplicitFactors` ~7294 |
| Did pack rule exclude activities for source→page path? | `workflowPolicy.triggerRules` thin-page exclude block |
| What did resolved factors show? | Factory resolved panel + `resolveWorkflowBriefFactors` output |

---

## Downstream symptoms (page)

### Track A — activities

See [`generated-page-output-excerpt.md`](generated-page-output-excerpt.md) — page notes no `learning_activities` upstream; renderer is faithful when section absent.

### Track B — assessment (same run)

| Observation | Implication |
|-------------|-------------|
| Workflow included **Generate Assessment Items** | Generation step selected |
| `source_artefacts` cites **assessment_items** | Upstream step acknowledged |
| Learner page **lacks visible MCQs** | Break in composition and/or render — **investigate separately** |

**Do not conclude** “assessment worked” from metadata alone. Verify `page.sections[]` for `assessment_check` with populated `content.items[]`.

See [`assessment-items-output-trace.md`](assessment-items-output-trace.md).

---

## 26-1 deliverable

Replace paraphrase with **exact brief text** and:

- **Track A table:** factor → heuristic flag → step included/excluded  
- **Track B table:** checkpoint 1–10 in assessment-items-output-trace (pass/fail + primary locus)

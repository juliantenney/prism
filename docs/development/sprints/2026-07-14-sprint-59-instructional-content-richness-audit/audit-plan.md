# Sprint 59 — Audit Plan

**Status:** Methodology for diagnostic use. Thresholds in the rubric are **hypotheses** until validated.  
**Roadmap note (2026-07-14):** Diagnostic first pass + archetype investigation complete. Active implementation roadmaps through [instructional-archetype-framework.md](instructional-archetype-framework.md) and [backlog.md](backlog.md). Formal findings: [instructional-archetype-audit.md](instructional-archetype-audit.md).

---

## Goals

1. Measure what is generated today under the Sprint 58 pipeline.
2. Score richness by content type **and** (from mid-sprint) by instructional archetype where relevant.
3. Classify defects (generation vs renderer vs other).
4. Feed a prioritized backlog and a renderer input pack.
5. Support Instructional Archetype Framework acceptance tests (teaching-heavy topics after Priority 1 packages).

---

## Sample size recommendation

| Tier | Count | Role |
| ---- | ----- | ---- |
| Core target | **12–15** lessons | Primary scoring set |
| Stretch | +3–5 | Extra assessment-heavy or transcript-heavy if time allows |
| Cap | ≤20 | Avoid analysis paralysis |
| Contingency minimum | **7** | Only if time-constrained — see [sample-selection-plan.md](sample-selection-plan.md) |

Rationale: enough to cover workflow types and disciplines; small enough to finish qualitative review in one sprint.

---

## Coverage dimensions

Include across the sample:

| Dimension | Requirement |
| --------- | ----------- |
| Workflow type | ≥1 simple/topic; ≥1 transcript/source-ingest |
| Discipline / topic | ≥3 distinct domains (e.g. STEM, social science, professional/applied) |
| Outcome kind | factual/conceptual **and** applied |
| Lesson complexity | short (~1–2 activities) **and** complex (multi-activity / multi-material) |
| Assessment weight | ≥1 assessment-heavy |
| Scenario weight | ≥1 scenario-heavy |

---

## Evidence sufficiency status

Assign one status per sample in the [audit register](audit-register-template.md) and each [findings](findings-template.md) file.

| Status | Meaning | Permitted claims |
| ------ | ------- | ---------------- |
| **Full evidence** | Relevant stage captures, assembled JSON, **and** rendered HTML available | Generation scores; renderer (B) findings; assembly (C) attribution |
| **Generation-scoreable** | Stage captures and assembled JSON available; **no** reliable rendered HTML | Generation scores; inventory; assembly if captures compared — **not** class B |
| **Inventory-only** | Assembled output exists; stage attribution uncertain | Content-type presence/absence only; no richness scores; no stage blame |
| **Insufficient** | Missing assembled JSON or critical captures | Exclude from scoring or strictly limit claims |

**Rules**

- **Renderer findings (B)** require **Full evidence**.
- **Assembly attribution (C)** requires owning-stage capture **and** assembled JSON.
- **Missing evidence ≠ missing generated content** — do not infer absence from missing captures.
- Mark **Insufficient** samples in the register; do not force matrix coverage with unscorable artefacts.

---

## How outputs will be captured

**Preferred evidence sources (in order):**

1. Persisted / pasted `workflowRunCapturedOutputs` (or fixture JSON) for EP, DLA, GAM, LS, DP, assessment stages
2. Deterministically **assembled** page JSON (post-`assembleVNextPageFromWorkflowCaptures`)
3. Rendered HTML export (for renderer-comparison only — enables Full evidence)

**Recording:**

- Store or link paths under a sprint evidence folder (e.g. `artefacts/` or `findings/`) when collecting evidence.
- Prefer existing repo fixtures where verified — see [sample-selection-plan.md](sample-selection-plan.md).

**Live runs:** record brief, flags, date, and capture filenames. Early sprint rule deferred prompt changes mid-audit; that rule is **superseded** for approved Iterations 1–7 and archetype-package work ([decisions.md](decisions.md) S59-D06). Still avoid ad-hoc mid-run prompt thrash without recording the change.

---

## How content units will be segmented

| Content type | Primary location (typical) | Canonical owner |
| ------------ | --------------------------- | --------------- |
| Knowledge summary | `page_synthesis.knowledge_summary` | DP |
| Learning journey / overview / purpose | `page_synthesis.overview`, `learning_purpose`; LS transitions if present | DP (LS for sequence fields) |
| Activity instructions | DLA `activities[]` fields | DLA |
| Explanatory text | Material bodies of type explanation/text | GAM |
| Worked example / scenario / case study | GAM `activities[].materials[]` | GAM |
| Reflection / discussion prompts | DLA cognition fields; may appear in materials | DLA |
| Assessment design | Assessment-design stage capture | Assess (design) |
| Assessment items / feedback | Assessment-items capture | Assess (items) |
| Study tips | `page_synthesis.study_tips` | DP |

Segment **one unit per scoreable block**. Note observed JSON path separately from canonical owner.

---

## Quantitative measures

Collect **where appropriate** (skip if irrelevant to type):

| Measure | Notes |
| ------- | ----- |
| Word count | Body text; exclude pure markup noise |
| Sentence count | Approximate |
| Number of examples | Explicit example blocks |
| Number of scenario details | Named actors, stakes, constraints, data points |
| Number of learner actions | Imperatives / required productions |
| Number of assessment items | Count stems |
| Item-type diversity | MCQ / short / extended / etc. |
| Outcome coverage | Items/activities mapped to LO ids when present |
| Material-to-activity support ratio | Materials with substantive body ÷ activities that require them |

Treat absolute numbers as **descriptive**, not pass/fail, until rubric ranges are validated.

---

## Richness scoring terminology

Use consistently across the pack:

| Score | Label |
| ----- | ----- |
| `1` | Thin |
| `2` | Barely adequate |
| `3` | Sufficient |
| `4` | Rich |

**Verbosity flag:** `V` — separate from the 1–4 score; marks over-verbosity regardless of richness level. **Do not** use “Excessive” as an alternative fifth score.

See [content-type-rubric.md](content-type-rubric.md).

---

## Rubric calibration checkpoint

After an initial **pilot of approximately three contrasting lessons** (e.g. short factual, assessment-heavy, scenario-heavy — selected during sample verification, **not scored in pack-hardening**):

1. Score pilot lessons with rubric v0.1 (or current version).
2. Record a **calibration log** (in rubric validation section or separate note):

| Content type | Criterion retained / revised | Reason | Supporting lesson IDs | Rubric version | Pilot rescored? |
| ------------ | ----------------------------- | ------ | --------------------- | -------------- | --------------- |
| Scenario | | | S07, S10, … | v0.1 → v0.2 | Y / N |

3. Bump rubric version if criteria change (e.g. `rubric-v0.1` → `rubric-v0.2`).
4. Rescore pilot lessons if calibration materially changes scoring guidance.
5. Only then proceed to full sample scoring.

Do **not** treat pilot numeric ranges as final gates until calibration is recorded.

---

## Qualitative review method

1. Register sample in [audit-register-template.md](audit-register-template.md).
2. For each sample, fill [findings-template.md](findings-template.md).
3. Score each present content type with [content-type-rubric.md](content-type-rubric.md) using scores `1`–`4` and optional `V` flag.
4. Review instructional flow per major activity (findings template).
5. Classify each finding with one **primary** class A–F ([issue-classification-framework.md](issue-classification-framework.md)).
6. For assessment-heavy samples: design review, item review, workload realism, and **≥3 alignment chains** (or all items if fewer) — [assessment-review-framework.md](assessment-review-framework.md).
7. Compare assembled JSON presence against rendered HTML visibility when thinness is disputed (Full evidence only).

**Blindness note:** Prefer scoring assembled JSON for generation judgements; use HTML only to confirm renderer class.

---

## Reviewer notes template

```
Lesson id:
Evidence status:
Workflow type: simple | transcript | other
Assembled artefact ref:
Rendered artefact ref (if Full evidence):

Top 3 strengths:
1.
2.
3.

Top 3 thinness concerns:
1. [type] [primary A–F] [evidence path]
2.
3.

Open questions:
```

---

## Evidence recording format

Per finding (also see [backlog-template.md](backlog-template.md)):

| Field | Content |
| ----- | ------- |
| `finding_id` | e.g. `S59-F-012` |
| `lesson_id` | Sample id |
| `content_type` | From rubric |
| `canonical_owner` | EP / DLA / GAM / Assess-design / Assess-items / LS / DP / Assembly / Renderer |
| `observed_path` | JSON path |
| `primary_class` | A–F (one only) |
| `secondary_tags` | optional |
| `severity` | S0–S3 |
| `excerpt` | ≤120 words or JSON path |
| `metric_snapshot` | e.g. words=42, scenarios_details=1 |
| `evidence_status` | Full / Generation-scoreable / Inventory-only / Insufficient |
| `action` | observe / backlog / renderer-pack / deferred |

---

## Phased execution (suggested)

1. Verify sample candidates + evidence status  
2. Pilot ~3 lessons + rubric calibration  
3. Freeze sample register (12–15 target)  
4. Inventory + quantitative pass  
5. Rubric scoring + instructional-flow review + classification  
6. Assessment dual review + workload realism  
7. Consolidate backlog + [renderer input pack](renderer-input-template.md)  
8. Close sprint docs

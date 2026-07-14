# Sprint 59 — Findings Template (per lesson)

Copy to `findings/S59-<lesson-id>.md` when auditing a sample. Keep evidence excerpts short.

Record **observable evidence and classification** during review. Do not develop solution hypotheses here — those belong in backlog consolidation ([backlog.md](backlog.md); schema in [backlog-template.md](backlog-template.md)).

When scoring teaching materials, note **instructional archetype** where identifiable (e.g. mechanism_explanation vs evaluation) — see [instructional-archetype-framework.md](instructional-archetype-framework.md).

---

## Lesson metadata

| Field | Value |
| ----- | ----- |
| Finding file id | |
| Sample id (register) | |
| Title / topic | |
| Date reviewed | |
| Reviewer | |
| Pipeline | Sprint 58 partial (`pageEnrichmentV2` + `partialPageOutputs`) / other: |
| Flags recorded | |
| Rubric version | e.g. `rubric-v0.1` |
| Audit status | not started / in progress / complete / blocked |

## Workflow type

- [ ] Simple / topic
- [ ] Transcript / source-ingest
- [ ] Other: ________

## Evidence status

Select one status for this lesson (see [audit-plan.md](audit-plan.md#evidence-sufficiency-status)):

- [ ] **Full evidence** — relevant stage captures, assembled JSON, and rendered HTML available
- [ ] **Generation-scoreable** — stage captures and assembled JSON available; renderer not assessable
- [ ] **Inventory-only** — assembled output exists; stage attribution uncertain
- [ ] **Insufficient** — exclude from scoring or strictly limit claims

**Rules for this lesson:**

| Claim type | Minimum evidence |
| ---------- | ---------------- |
| Generation richness score | Generation-scoreable or Full evidence |
| Renderer finding (class B) | Full evidence (rendered HTML required) |
| Assembly attribution (class C) | Owning-stage capture **and** assembled JSON |
| Missing content | Do not infer absence from missing captures alone |

## Artefact references

| Artefact | Path / id |
| -------- | --------- |
| EP capture | |
| DLA capture | |
| GAM capture | |
| LS capture | |
| DP capture | |
| Assessment design | |
| Assessment items | |
| Assembled page JSON | |
| Rendered HTML | |

---

## Content inventory

Record **one canonical owner** per row. Cross-stage references belong in **Observed source / JSON path**, not as combined owners.

| Content type | Present? | Canonical owner | Observed source / JSON path | Notes |
| ------------ | -------- | --------------- | ----------------------------- | ----- |
| Knowledge summary | | DP | | |
| Learning journey / overview / purpose | | DP | (LS fields if observed here) | |
| Activity instructions | | DLA | | |
| Explanatory text | | GAM | (upstream LC/KM if observed) | |
| Worked example | | GAM | | |
| Scenario | | GAM | | |
| Case study | | GAM | | |
| Reflection prompt | | DLA | (material body if observed) | |
| Discussion prompt | | DLA | (material body if observed) | |
| Formative assessment (design) | | Assess (design) | | |
| Summative assessment (design) | | Assess (design) | | |
| MCQ / short / extended items | | Assess (items) | | |
| Feedback / rationale | | Assess (items) | | |
| Study tips | | DP | | |

Use class **E** only when responsibility is genuinely ambiguous, duplicated, or missing — not when content simply references another stage legitimately.

---

## Instructional-flow review (per major activity)

Review each major activity against the expected instructional arc. Use descriptive values only — **no numerical flow score**.

**Arc:** Explanation → Example or model → Guided practice → Independent practice → Assessment or checkpoint

| Activity | Explanation | Example / model | Guided practice | Independent practice | Assessment / check | Support gap? | Primary class |
| -------- | ----------- | --------------- | --------------- | -------------------- | ------------------ | ------------ | ------------- |
| | present / partial / absent / not expected | | | | | Y / N | A–F |

**Gap patterns to note (each gap = separate finding if independent):**

- Learner action required before adequate explanation
- Performance expected without a model or example
- Activity demands unsupported by materials
- Materials present but not linked to required learner output

Any support gap must use exactly one **primary** class from [issue-classification-framework.md](issue-classification-framework.md). Secondary tags optional.

---

## Quantitative metrics (descriptive)

| Metric | Value |
| ------ | ----- |
| Word count — knowledge_summary | |
| Word count — overview + purpose | |
| Activity count | |
| Learner actions (total) | |
| Materials with substantive body | |
| Material-to-activity support ratio | |
| Scenario detail counts (per scenario) | |
| Worked-example step counts | |
| Assessment item count | |
| Item-type diversity | |
| Outcome coverage (items ↔ LOs) | |

---

## Rubric scores

**Richness scale (use one score per type):**

| Score | Label |
| ----- | ----- |
| `1` | Thin |
| `2` | Barely adequate |
| `3` | Sufficient |
| `4` | Rich |

**Verbosity flag:** `V` — separate from the 1–4 richness score. Mark `V` when content is over-verbose regardless of richness score. Do not treat `V` as a fifth richness level.

| Content type | Score (1–4) | V? | Rationale (1 line) |
| ------------ | ----------- | -- | ------------------ |
| | | | |

---

## Thin elements

| Element | Canonical owner | Observed path | Primary class | Secondary tags | Severity |
| ------- | --------------- | ------------- | ------------- | -------------- | -------- |
| | | | A–F (one only) | optional | S0–S3 |

## Over-verbose elements

| Element | Observed path | Richness score | V flagged | Severity |
| ------- | ------------- | -------------- | --------- | -------- |
| | | 1–4 | Y | S0–S3 |

## Missing elements

| Expected element | Canonical owner | Why expected | Primary class | Secondary tags |
| ---------------- | --------------- | ------------ | ------------- | -------------- |
| | | | A–F (one only) | optional |

---

## Generation vs renderer classification (summary)

Count **findings** (split independent defects separately). Each finding has exactly one primary class.

| Primary class | Count | Notes |
| ------------- | ----- | ----- |
| A Generation | | |
| B Renderer | | |
| C Assembly | | |
| D Validation | | |
| E Ownership | | |
| F Expected | | |

---

## Assessment-design review

(Use [assessment-review-framework.md](assessment-review-framework.md) Part A)

- Outcome alignment:
- Evidence model:
- Formative / summative intent:
- Cognitive level:
- Coverage / sequencing:
- Verdict:

## Assessment workload realism

(Use [assessment-review-framework.md](assessment-review-framework.md) Part D)

| Field | Value |
| ----- | ----- |
| Stated lesson duration | |
| Estimated assessment completion time | |
| Basis for estimate | |
| Total required responses | |
| Expected response extent | brief / moderate / extended (per item notes) |
| Item diversity | |
| Assessment volume relative to lesson duration | |
| Proportionality of evidence requirements | |
| **Verdict** | realistic / questionable / unrealistic / insufficient evidence |

## Assessment-item review

(Part B + Part C chain rows)

**Authoritative chain rule:** For each assessment-heavy lesson, trace **at least three** assessment items through the learning outcome → activity → material → assessment-item chain, **or trace all items when fewer than three exist**.

| Item id / stem excerpt | LO | Activity | Material | Design intent met? | Answerable? | Primary class | Secondary tags |
| ---------------------- | -- | -------- | -------- | ------------------ | ----------- | ------------- | -------------- |
| | | | | Y / N / Partial | Y / N / Partial | A–F | |

- Items verdict:

---

## Recommended action

- [ ] Observe only (no backlog)
- [ ] Add backlog item(s) — ids: ________
- [ ] Include in [renderer input pack](renderer-input-template.md)
- [ ] Deferred (name sprint): ________

## Evidence excerpts

```
(path / ≤120 words)
```

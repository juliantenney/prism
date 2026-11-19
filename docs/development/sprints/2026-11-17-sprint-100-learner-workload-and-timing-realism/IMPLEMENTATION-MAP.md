# Sprint 100 — Implementation map

**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Charter:** [SPRINT-100-CHARTER.md](SPRINT-100-CHARTER.md)  
**Closure:** [SPRINT-100-CLOSURE.md](SPRINT-100-CLOSURE.md)  
**Decisions:** [decisions.md](decisions.md)

---

## Phase posture

```text
100A  Workload feasibility model                         COMPLETE
100B-1 Interactive Learning Sequence advisory integration  COMPLETE
100B-2 Assessment Pack advisory integration               COMPLETE
100C   Learning Journey commission + cumulative           COMPLETE
100D   External Educational QA workflows v1.3             COMPLETE (outside Cursor)
100E   Evidence review + closeout                         COMPLETE (qualified)
```

---

## 100A — Workload feasibility model (complete)

| Path | Role |
| ---- | ---- |
| `lib/workload-feasibility-estimator.js` | Pure estimator (`estimateActivityWorkload`) |
| `tests/s100a-workload-feasibility-estimator.test.js` | Focused unit tests |
| `tests/fixtures/s100a-workload-calibration.json` | Five calibration cases |

**Contract:** activity type, declared duration, response length, reasoning demand, reading/evidence demand, feedback interpretation, revision → indicative range, sufficiency, insufficiency flag, factors, explanation, component bands. Estimate independent of declared duration.

---

## 100B-1 — Interactive integration

| Path | Role |
| ---- | ---- |
| `lib/interactive-workload-feasibility-adapter.js` | Maps Interactive page/activity fields → 100A inputs; builds advisory warnings |
| `app.js` Learning Sequence capture validation / run status | Surfaces non-blocking author warnings |

**Integration point:** Learning Sequence capture review (page enrichment v2), where timeline durations and upstream activity specifications are available together.

**Non-goals for 100B-1:** schema changes; duration auto-rewrite; Assessment Pack / LJ / QA pipelines; learner-facing label changes; new workflow step.

---

## 100B-2 — Assessment Pack integration

| Path | Role |
| ---- | ---- |
| `lib/assessment-pack-workload-feasibility-adapter.js` | Maps Assessment Pack elicitation fields → 100A inputs; builds advisory warnings |
| `app.js` AP elicitation / formative_return / Design Page capture | Surfaces non-blocking author warnings |

**Integration point:** Design Evidence Elicitation and Author Formative Return capture (existing steps), where `indicative_duration_minutes` / `indicative_time`, `suggested_length`, stimulus/reading cues, and formative_return feedback/revision fields are concrete. Design Page also warns when `assessment_evidence.elicitations` are present. No new workflow step.

**Adapter mapping (summary):**

| Source field | Estimator input |
| ------------ | --------------- |
| `indicative_duration_minutes` (preferred) or first `N minutes` in `indicative_time` | `declaredDurationMinutes` |
| Explicit `suggested_length` word bands only | `suggestedLengthWords` |
| `delivery.kind` + prompt/evidence prose | `activityType`, `reasoningDemand` |
| Stimulus / dossier language | `readingDemand` |
| `formative_return.materials` | `requiresFeedbackInterpretation` |
| `optional_revision.offered` / revision prompt | `requiresRevision` |

**Assumptions:** Do not invent writing length from constructed_performance / text-entry alone. Do not sum nested stage minutes in prose indicative_time. Auto-checkable items use comprehension reasoning, not evaluation jargon. Revision overhead only when the same elicitation’s budget also covers post-response revision.

**Non-goals for 100B-2:** schema changes; duration auto-rewrite; Learning Journey / QA pipelines; learner-facing label changes; new workflow step; published exemplar edits.

---

## 100C — Learning Journey integration

| Path | Role |
| ---- | ---- |
| `lib/learning-journey-workload-feasibility-adapter.js` | Commission-level + journey-level feasibility; advisory warnings |
| `app.js` LJ Design Page capture / validation | Surfaces non-blocking author warnings; resolves learning-time envelope from delivery seed |

**Integration point:** Learning Journey Design Page capture — the earliest durable author-facing point where commission specifications (`specification_text`, including Approximate learner time) and the workflow learning-time envelope are available together. Sibling Steps 2–4 TIME CHECKs remain prompt-only chat context.

### Commission-level vs journey-level

| Layer | Method |
| ----- | ------ |
| Commission | Map explicit demands in `specification_text` → 100A estimator; warn when allocated approximate learner time is plausibly insufficient |
| Journey | Use commission allocations for arithmetic context only; warn from evidenced overloaded commissions and/or over-allocation vs envelope; never treat a correct sum as automatic feasibility |

### Double-counting safeguards

- Estimate commissions only — never also nested activities inside those commissions.  
- Never add Learning Element allocations to commission allocations.  
- Never sum estimator upper bounds into a predicted journey total.  
- Overlapping Learning Element claims across commissions → overlap risk note; no invented aggregate.  
- Insufficient commission evidence → silence for that commission (no invented workload).

**Non-goals for 100C:** schema changes; envelope/allocation auto-rewrite; changing TIME CHECK prompts into blocking code; Educational QA; learner-facing label changes; published exemplar edits.

---

## 100D — External Educational QA (complete outside Cursor)

Five external QA workflows updated to **v1.3**: Learning Journey, Interactive, Assessment Pack, Situated Task, Expository. Updates were performed **outside Cursor**; corresponding JSON files are **not necessarily** present in this repository.

**Not claimed:** systematic exemplar-corpus calibration of those revised QA workflows.

---

## 100E — Closeout (complete with qualifications)

Implementation evidence and known limitations reviewed. Formal closure: [SPRINT-100-CLOSURE.md](SPRINT-100-CLOSURE.md). Historical checkpoint: **105** relevant automated tests passed at 100C ([VALIDATION.md](VALIDATION.md)) — not re-run at closure.

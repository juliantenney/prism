# Sprint 71 — Improvement Register

**Source of truth for findings.**  
**One row per canonical finding or recurring finding cluster** — not one row per resource occurrence.  
**Per-resource detail:** `reviews/<review-id>.md` via [review-logging-template.md](review-logging-template.md).  
**Rules:** [CONTEXT.md](CONTEXT.md)

Do not delete **Rejected** rows.

---

## Recurrence model

| Rule | Detail |
| ---- | ------ |
| Granularity | One register row = one canonical finding / cluster |
| First sighting | Set **First observed in** to the first review ID |
| Later sightings | Append to **Occurrences / linked review IDs**; update **Last observed**; increment **Recurrence count** |
| Do not | Create a new register row for each resource that shows the same cluster |
| Detail | Keep resource-specific evidence and narrative in `reviews/<review-id>.md` |

---

## Field definitions

| Field | Description |
| ----- | ----------- |
| Finding ID | e.g. `S71-F-001` (stable cluster ID) |
| Finding summary | One-sentence observable problem (canonical wording for the cluster) |
| Benchmark finding | Hypothesis / ID from Benchmark v2.1 (if any) |
| Validation result | What Validation Review v2.0 concluded (latest / consensus note) |
| Validation status | Confirmed · Partially confirmed · Rejected · New finding |
| Production defect or instructional issue | Production defect · Instructional issue · Workflow observation · Author observation · Renderer |
| Production severity | Only if production defect (else N/A) |
| Educational priority | Only if instructional issue (else N/A) |
| Observed location | Where typically seen in final / intermediate artefact |
| Primary owning pipeline stage | Stage / layer that should have prevented it |
| Contributing stage or stages | Upstream/downstream contributors |
| Responsibility type | Prompt capability · Artefact contract · Stage handoff · Sequencing · Assembly · Renderer · Workflow observation · Author observation |
| Evidence | Paths, excerpts, artefact pointers (or links into review files) |
| First observed in | First review ID (e.g. `S71-R-001`) |
| Occurrences / linked review IDs | All linked review IDs (comma-separated) |
| Last observed | Most recent review ID and/or date |
| Recurrence count | Number of linked reviews / resources |
| Attribution confidence | Low · Medium · High |
| Candidate capability improvement | Theme for later prompt sprint (hypothesis only) |
| Action status | Logged · Watch · Deferred · Out of scope · (later) Proposed for prompt sprint |
| Notes | Free text |

---

## Register table

| Finding ID | Finding summary | Benchmark finding | Validation result | Validation status | Prod vs instructional | Prod severity | Educ. priority | Observed location | Primary owning stage | Contributing stages | Responsibility type | Evidence | First observed in | Occurrences / linked review IDs | Last observed | Recurrence count | Attribution confidence | Candidate capability improvement | Action status | Notes |
| ---------- | --------------- | ----------------- | ----------------- | ----------------- | --------------------- | ------------- | -------------- | ----------------- | -------------------- | ------------------- | ------------------- | -------- | ----------------- | ------------------------------- | ------------- | ---------------- | ---------------------- | -------------------------------- | ------------- | ----- |
| | | | | | | | | | | | | | | | | | | | | |

---

## Prompt-capability themes (consolidation — fill late)

| Theme ID | Theme | Linked finding IDs | Recurrence | Confidence | Suggested later-sprint action |
| -------- | ----- | ------------------ | ---------- | ---------- | ----------------------------- |
| | | | | | |

---

## Notes

- Benchmark findings remain hypotheses until validated.  
- Do not rewrite prompts from a single row or a single review.  
- Workflow / author rows stay visible with Action status **Out of scope** (Sprint 71).  
- Design Page prompt ownership ≠ automatic ownership of assembly or renderer losses — see [CONTEXT.md](CONTEXT.md).

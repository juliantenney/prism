# Sprint 71 — Review Logging Template

Copy to `reviews/<review-id>.md` when reviewing a resource (create `reviews/` on first use).  
After validation, promote each finding into [improvement-register.md](improvement-register.md) as a **cluster row** (update recurrence fields if the cluster already exists).  
Also record the sample in [sample-selection-plan.md](sample-selection-plan.md).

**Phase 0 gate:** Do not count Review 1 until Benchmark v2.1 and Validation Review v2.0 canonical paths + versions are recorded in [STATUS.md](STATUS.md).

---

## Review header

| Field | Value |
| ----- | ----- |
| Review ID | e.g. `S71-R-001` |
| Resource title / topic | |
| Date reviewed | |
| Reviewer | |
| Benchmark version | Prism Resource Quality Benchmark **v2.1** |
| Validation version | Prism Benchmark Validation Review **v2.0** |
| Artefact paths | page JSON / export HTML / stage captures (if any) |
| Review status | not started / in progress / complete / blocked |

---

## Comparison metadata (required)

| Field | Value |
| ----- | ----- |
| Subject / domain | |
| Learner level / audience | |
| Archetype | |
| Source-led or topic-generated | source-led · topic-generated |
| Assessment included | yes · no |
| Generated artefact / version or commit | |
| Benchmark run ID | |
| Validation run ID | |

Mirror these axes in [sample-selection-plan.md](sample-selection-plan.md).

---

## Process checklist

- [ ] Phase 0 artefact paths recorded (Benchmark v2.1 + Validation Review v2.0) — required before counting Review 1  
- [ ] Sample row added / updated in sample-selection-plan  
- [ ] Resource generated  
- [ ] Benchmark v2.1 completed  
- [ ] Validation Review v2.0 completed  
- [ ] Benchmark vs validation compared  
- [ ] Findings classified (Confirmed / Partially confirmed / Rejected / New)  
- [ ] Validated findings attributed (observed / primary / contributing / responsibility type)  
- [ ] Design Page vs assembly vs renderer distinguished where relevant  
- [ ] Register updated (cluster row + recurrence fields)  
- [ ] STATUS counters updated  

---

## Finding block (repeat)

### Finding — temporary local ID: F_

| Field | Value |
| ----- | ----- |
| Finding summary | |
| Benchmark finding | (hypothesis / ID, or none) |
| Validation result | |
| Validation status | Confirmed · Partially confirmed · Rejected · New finding |
| Production defect or instructional issue | Production defect · Instructional issue · Workflow observation · Author observation · Renderer |
| Production severity | (production only, else N/A) |
| Educational priority | (instructional only, else N/A) |
| Observed location | |
| Primary owning pipeline stage | |
| Contributing stage or stages | |
| Responsibility type | Prompt capability · Artefact contract · Stage handoff · Sequencing · Assembly · Renderer · Workflow observation · Author observation |
| Evidence | |
| Attribution confidence | Low · Medium · High |
| Candidate capability improvement | (optional hypothesis) |
| Register Finding ID | (after promotion, e.g. S71-F-00N) |
| Notes | |

**Attribution check (required):**

- [ ] Not attributed solely because of where it appears in the final output  
- [ ] Checked whether an upstream obligation existed before blaming realisation  
- [ ] Distinguished specify vs realise  
- [ ] Distinguished generation vs handoff/assembly  
- [ ] If Design Page-related: distinguished prompt omission vs artefact contract vs stage handoff vs deterministic assembly vs renderer  
- [ ] If Design Page inputs were incomplete: primary cause set upstream; Design Page recorded only if it contributed  

---

## Review summary

| Metric | Count |
| ------ | ----- |
| Confirmed | |
| Partially confirmed | |
| Rejected | |
| New finding | |

**Carry to register:** list Finding IDs promoted or recurrence-updated.  
**Do not implement:** prompt edits from this single review.

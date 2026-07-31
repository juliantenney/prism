# Sprint 71 — Validated Candidate Architectural Principles

**Status:** **Validated Sprint 71 candidate architectural principles** (frozen at sprint close; not yet product-wide ratified).  
**Sprint:** **COMPLETE** — [SPRINT-71-FINAL-REPORT.md](SPRINT-71-FINAL-REPORT.md)  
**Source reviews:** [S71-R-001](reviews/S71-R-001.md)–[S71-R-011](reviews/S71-R-011.md)  
**Related:** [cross-resource-synthesis.md](cross-resource-synthesis.md) · [improvement-register.md](improvement-register.md)

No invented Benchmark instrument IDs. **Do not add further principles in this pack.**

---

## Author guidance interpretation

**Pedagogically informed workflow guidance** demonstrably improves generation quality:

```text
S71-R-010 (sparse)  →  S71-R-011 (pedagogically informed detailed brief)
88/100              →  91/100
```

Improvements occurred in dimensions intentionally targeted by the richer guidance — evidence of **steerability**, not merely longer free-text prompts.

Do **not** conclude that authors should write increasingly sophisticated prompt text.

Long-term objective: embed principles into:

- **Layer 2** pedagogically informed elicitation;  
- discipline profiles;  
- Prism prompt engineering;  
- **Layer 1** default generation contracts.

Author effort should focus on subject-specific knowledge and **Layer 3** authentic evidence Prism cannot or should not generate.

---

## Three-layer evidence model

| Layer | Name | Responsibility |
| ----- | ---- | -------------- |
| **Layer 1** | **Platform instructional architecture** | Default generation contracts for the validated candidate principles |
| **Layer 2** | **Workflow elicitation** | Capture instructional intent about evidence sources, generation vs upload, rights |
| **Layer 3** | **Author-supplied evidence** | Authentic artefacts (copyright, organisational specificity, proprietary materials) |

---

## Two complementary improvement classes

| Class | Improves via | Examples |
| ----- | ------------ | -------- |
| **Prompt-sensitive** | Layer 1–2 + prompt engineering | Evidence-centred design; sequencing; gradual release; alignment; diagnostic feedback design |
| **Content-availability** | Layer 2 elicitation + Layer 3 supply | Copyrighted literary extracts; HR policies; institutional regulations |

---

## Frozen principle set

### Complementary framing

1. **Disciplinary Representation** — Authentic artefacts present (and correctly timed).  
2. **Evidence-Based Learning** — Learners reason *with* those artefacts.

### Validated Sprint 71 candidate architectural principles

#### 1. Evidence Sufficiency

Sufficient directly analysable evidence must be supplied or immediately accessible for evidence-based tasks. Persistent failure after instructional redesign is **evidence-availability** (`S71-R-011`), not merely “limited richness.”

**Validation question:** Can the learner complete the activity authentically without recalling or locating missing material elsewhere?

**Register:** `S71-F-001`

#### 2. Evidence-Centred Activity Design

Activities require explicit use of supplied evidence; evidence is the object of reasoning, not decoration.

**Validation question:** Could the learner complete the task adequately without examining the evidence?

**Register:** `S71-F-001`, `S71-F-004`

#### 3. Disciplinary Uncertainty

Where multiple defensible interpretations exist, uncertainty is sustained across the sequence — not isolated in one late checklist.

**Register:** `S71-F-005`, related `S71-F-004`, `S71-F-009`

#### 4. Diagnostic Feedback

Feedback distinguishes description from analysis and structure from convincing reasoning — not only component presence.

**Register:** `S71-F-002`

#### 5. Pedagogical Timing

Disciplinary representations appear when they support — not replace — learner reasoning.

**Register:** `S71-F-015`

#### 6. Discipline-Appropriate Evidence Evaluation

Interpret evidence quality through discipline profiles; do not import history provenance criteria into literary close reading indiscriminately.

---

## Cross-disciplinary interpretation

| Discipline | Authentic evidence / artefacts |
| ---------- | ------------------------------ |
| Programming | Source code and program behaviour (`S71-F-014`) |
| Mathematics | Symbolic representations and worked mathematics |
| Science | Experimental observations and datasets |
| HR | Workplace artefacts / policies (often Layer 3) |
| History | Primary and secondary historical sources |
| Literature | Directly analysable textual extracts (often Layer 3 when copyrighted) |

---

## Controlled experiment — closed

| Condition | Review | Benchmark | Result |
| --------- | ------ | --------- | ------ |
| Sparse control | `S71-R-010` | **88/100** | Strong sequencing; Evidence Sufficiency failed |
| Pedagogically informed detailed brief | `S71-R-011` | **91/100** | Targeted dimensions improved; Critical availability remained |
| Related History richer brief | `S71-R-009` | 89/100 | Early steerability signal |

Obs: `S71-O-006`.

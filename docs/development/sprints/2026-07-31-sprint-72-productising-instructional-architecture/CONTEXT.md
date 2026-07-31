# Sprint 72 — Context

**Status:** OPEN / IN PROGRESS (opened 2026-07-31)  
**Role:** Durable architectural and methodological context for implementation work  
**Predecessor authority:** Sprint 71 closed pack — **link, do not rewrite evidence**

---

## Sprint 71 architectural conclusions (carry forward)

1. Instructional quality is **materially steerable** via pedagogically informed **workflow guidance** — not by asking authors to write arbitrarily longer prompts (`S71-O-006`).  
2. Residual **Critical** limitations increasingly concern **evidence availability** (`S71-F-001`). Sprint 72 dual-routes this ID without splitting it: **A** Evidence Sufficiency as instructional requirement (platform; activities evidence-completable); **B** elicitation when Prism must ask what exists; **C** author-supplied artefacts when generation is inappropriate (`S72-D08`). Copyrighted literary extracts and similar materials often land on route C after A/B.  
3. Matched Owen experiment: sparse control **88** → detailed intervention **91**; prompt-sensitive dimensions improved; Critical poem-evidence availability persisted.  
4. Validated **candidate architectural principles** are frozen in Sprint 71 [design-principles.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/design-principles.md).  
5. Diagnostic feedback (`S71-F-002`) is a platform-wide High-priority instructional gap.  
6. Semantic headings (`S71-O-005`) remain open (renderer / accessibility).  
7. GAM math integrity (`S71-O-004`) is **Resolved — regression verified** — retain as evidence; do not reopen as active defect.

Authoritative narrative: [SPRINT-71-FINAL-REPORT.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-FINAL-REPORT.md)

---

## Evidence-Centred Learning (Sprint 72 umbrella)

**Evidence-Centred Learning** is the first-class platform umbrella:

- Evidence Sufficiency  
- Evidence-Centred Activity Design  
- Discipline-Appropriate Evidence Evaluation  

**Evidence-Based Learning** (Sprint 71 complementary framing, retained as distinct): learners reason *with* authentic artefacts, not merely about them. Distinct from Evidence-Centred Activity Design (the activity-design obligation). Productisation work nests under Evidence-Centred Learning; the S71 complementary label is not treated as a duplicate of the three nested principles.

---

## Three-layer responsibility model (binding)

| Layer | Name | Question | Sprint 72 priority |
| ----- | ---- | -------- | ------------------ |
| **1** | Platform instructional architecture | What should Prism do by default in contracts, stages, and principles? | **P1** |
| **2** | Workflow elicitation | What must the system ask because it cannot infer safely? | **P2** |
| **3** | Author-supplied evidence | What must be uploaded/selected because generation is inappropriate? | **P3** |

**Routing rule:** Prefer Layer 1 when solvable system-side; use Layer 2 only for genuinely missing information; use Layer 3 when fabrication would be educationally or legally inappropriate. Never collapse into generic “prompt improvement.”

---

## Canonical learner-page spine

```text
Generate Learning Content
→ Model Knowledge
→ Define Learning Outcomes
→ Design Episode Plan
→ Design Learning Activities
→ Generate Activity Materials
→ Construct Learning Sequence
→ Design Page
```

Assessment / feedback branch (attribute separately when relevant): Design Assessment · Generate Assessment Items · Design Feedback · Validate Learning Design · Revise Assessment Based on QA · Design Marking Rubric.

Technical / presentation (attribute separately): artefact contract · stage handoff · deterministic page assembly · renderer.

Formal map: [learning-design-pipeline-attribution-map.md](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/learning-design-pipeline-attribution-map.md)

---

## Attribution rules (from Sprint 71 / Sprint 70)

- Distinguish **observed location** vs **primary owning stage** vs **contributing stages** vs **responsibility type**.  
- Do not attribute solely by the visible surface (`S70-D09` / `S71-D09`).  
- Design Page owns prompt-authored page synthesis / signposting / visual-planning metadata — **not** automatically all final-page assembly losses.  
- Keep **Design Page** vs **deterministic assembly** vs **renderer** distinct (headings, navigation, truncation).  
- Retain rejected findings; do not silently upgrade Partial → Confirmed.

---

## Evidence-classification rules

| Class | Meaning | Action in Sprint 72 |
| ----- | ------- | ------------------- |
| Confirmed | Validated instructional finding | Eligible for implementation if Layer 1–3 destination set |
| Partially confirmed | Partial support only | Treat carefully; do not inflate recurrence |
| Rejected | Not supported | Retain; do not reopen as active work without new evidence |
| Resolved (obs) | Defect fixed / insight recorded | Destination F or closed watch unless successor explicitly reopens |
| Observation (O) | Non-instructional / UX / architecture insight | Route to UX/renderer or architecture workstreams with correct IDs |

---

## Implementation validation expectations

Follow the Sprint 72 validation loop in the Charter. Prefer matched or controlled comparisons. Require Benchmark **and** Validation Review. Judge targeted dimensions and regressions — not total score alone.

---

## Sprint 72 priority order (binding unless decision changes)

1. Platform / system improvements (Evidence-Centred Learning umbrella; productise principles; diagnostic feedback; `S71-F-001` route A first)  
2. Workflow elicitation redesign (`S71-F-001` route B where needed)  
3. Author-supplied evidence architecture (`S71-F-001` route C where generation inappropriate)  
4. Product / UX (image consistency & persistence; disciplinary representations; headings; navigation)  
5. Raise-the-ceiling investigation (~90–91 → aspirational 95–98)

**Persistence:** `S72-T-042` (workflow ↔ author-evidence associations) and `S72-T-051` (generated image assets / IDs / metadata / reconnect / selective regen) align to **one shared workflow asset-persistence model** (`S72-D09`).

---

## Product / UX carry-ins (Sprint 72 IDs — not Sprint 71 findings)

| ID | Topic | Note |
| -- | ----- | ---- |
| `S72-B-001` | Image consistency across a run | Operator-noted; shared visual style profile |
| `S72-B-002` | Persist generated images in workflow data | Survive refresh / navigation |
| `S72-B-003` | Programming / code first-class representation | Anchored by `S71-F-014`; expand requirements in S72 |
| `S72-B-004` | Specialist representations architecture path | Music / maths / chem / engineering — discovery & prioritisation |
| `S72-B-005` | Navigation bar long titles / overflow / a11y | Related to `S71-O-001`; expand acceptance criteria in S72 |

---

## What not to do

- Reopen Sprint 71 or edit its evidence files  
- Assume every issue is a prompt issue  
- Imply authors should write longer prompts as the primary fix  
- Hide Layer ambiguity in “prompt improvement” wording  
- Promise completion of every roadmap item in one sprint  

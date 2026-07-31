# Sprint 71 — Context

**Sprint:** 71 — Learner-Facing Pipeline Quality Evidence and Prompt Attribution  
**Status:** **COMPLETE** (Closed 2026-07-31)  
**Audience:** Readers of the closed pack  
**Authority:** [SPRINT-71-CHARTER.md](SPRINT-71-CHARTER.md) · close narrative [SPRINT-71-FINAL-REPORT.md](SPRINT-71-FINAL-REPORT.md)

---

## Why this sprint existed

Sprint 70 established Benchmark v2.1, Validation Review v2.0, and stage attribution before prompt change. Sprint 71 executed that evidence programme and, through synthesis plus a controlled experiment (`S71-R-010` **88** → `S71-R-011` **91**), produced **architectural understanding** of steerable instructional quality and evidence-availability limits.

Central question: **How can Prism itself generate better learner-facing resources?**

Answer at close: embed **Validated Sprint 71 candidate architectural principles** in Layer 1 platform instructional architecture and Layer 2 pedagogically informed elicitation; use Layer 3 for author-supplied authentic evidence; do not rely on authors writing ever-longer prompts.

See Final Report § How understanding evolved · What Sprint 71 proved · Three-layer evidence model.

---

## Canonical learner-page spine

Default attribution path:

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

Primary investigation focus: Episode Plan → DLA → GAM → Learning Sequence → Design Page.  
Upstream (GLC / KM / LO) remain available for attribution.  
Assessment branch is tracked separately when the resource includes assessment.

**Design Page is not the whole final page.** After Construct Learning Sequence, technical work may still include deterministic page assembly and rendering. See attribution rules below and [learning-design-pipeline-attribution-map.md](learning-design-pipeline-attribution-map.md).

---

## Classification rules

- Only **production defects** receive production severity.  
- Only **production defects** can cap release.  
- **Instructional findings** receive **educational priority**, not production severity.  
- **Rejected** findings remain logged.  
- **Workflow** and **author** observations remain visible but are **not** Sprint 71 implementation work.  
- **Renderer** defects remain a separate engineering category.  
- Do **not** assign a finding solely according to where it appears in the final output.  
- Check whether the responsible **obligation existed upstream** before blaming the content-realisation stage.  
- Distinguish **failure to specify** from **failure to realise**.  
- Distinguish **generation failure** from **handoff or assembly loss**.  
- Distinguish **Design Page prompt omission** from **deterministic page-assembly failure** and from **renderer failure**.  
- Do **not** rewrite a canonical prompt based on one isolated finding.

---

## Responsibility types (register)

Use one primary type per finding (secondary notes allowed):

| Type | Meaning |
| ---- | ------- |
| Prompt capability | Stage prompt under-specifies or mis-steers generation (**includes Design Page prompt omission** when wrapper/orientation/visual-plan content is absent from Design Page output) |
| Artefact contract | Schema / contract gap between stages |
| Stage handoff | Correct upstream output not consumed correctly by the next stage |
| Sequencing | Order / pacing / dependency failure |
| Assembly | **Deterministic page-assembly** failure — correct upstream artefacts exist but are lost or misplaced when building assembled page data (not automatic Design Page prompt blame) |
| Renderer | Correct content exists in assembled page data but not in rendered output |
| Workflow observation | Authoring UX / process (log only in Sprint 71) |
| Author observation | Brief/author input quality (log only in Sprint 71) |

---

## Design Page vs technical assembly

The Design Page **prompt** owns:

- title  
- orientation / `page_synthesis`  
- visual-planning metadata  

It does **not** automatically own all final-page assembly losses.

| Failure class | Investigate |
| ------------- | ----------- |
| Design Page prompt omission | Required wrapper / orientation / visual-plan content absent from Design Page output |
| Artefact-contract failure | Schema or contract gap prevents correct transfer |
| Stage-handoff failure | Correct upstream output not consumed by the next stage |
| Deterministic page-assembly failure | Correct upstream artefact exists but is missing from assembled page data |
| Renderer failure | Correct content exists in assembled page data but not in rendered output |

### Starting attribution rules

1. **Required wrapper / orientation / visual-plan content absent from Design Page output** → investigate **Design Page** (prompt capability / omission).  
2. **Correct upstream artefact exists but is missing from assembled page data** → investigate **assembly**, **stage handoff**, or **artefact contract** — not Design Page by default.  
3. **Correct content exists in assembled page data but not in rendered output** → investigate **renderer**.  
4. **Design Page receives incomplete upstream inputs** → attribute the **primary cause upstream**; record Design Page only where it contributed.

---

## Initial attribution guide

| Symptom | First stage / layer to investigate |
| ------- | ---------------------------------- |
| Concept or relationship missing throughout | Model Knowledge, then upstream content |
| Incorrect learning level or cognitive demand | Define Learning Outcomes |
| Wrong archetype, beat order, or overall learning shape | Design Episode Plan |
| Weak task, vague instruction, or missing scaffold | Design Learning Activities |
| Missing material obligation | Design Learning Activities first |
| Obligation present but material thin, wrong, or absent | Generate Activity Materials |
| Weak explanation, example, evidence, table, or worked process | Generate Activity Materials |
| Poor ordering, transitions, pacing, or dependencies | Construct Learning Sequence |
| Weak orientation, title, synthesis, signposting, or visual-plan metadata **absent from Design Page output** | Design Page (prompt) |
| Upstream content present upstream but missing from **assembled page data** | Assembly / handoff / artefact contract |
| Content present in assembled page data but missing or broken in **rendered** output | Renderer |
| Design Page inputs incomplete | Primary cause upstream; Design Page only if it contributed |
| Weak assessment coverage | Design Assessment |
| Weak item or stem | Generate Assessment Items |
| Generic or unhelpful feedback | Design Feedback |

---

## Improvement Register recurrence model

- **One register row** per canonical finding or recurring finding **cluster** (not one row per resource occurrence).  
- Per-resource detail lives in `reviews/<review-id>.md`.  
- Register recurrence fields:

| Field | Meaning |
| ----- | ------- |
| First observed in | First review ID (or resource ID) where the cluster was seen |
| Occurrences / linked review IDs | All review IDs linked to this cluster |
| Last observed | Most recent review ID / date |
| Recurrence count | Number of linked reviews / resources |

Update the same register row when the finding recurs; do not create a duplicate row for the same cluster.

---

## Phase 0 artefact-path gate

**Before Review 1 is counted**, STATUS must record that Benchmark v2.1 and Validation Review v2.0 are available (canonical paths **and** versions preferred).

Also required as a formal Sprint 71 artefact:

3. [learning-design-pipeline-attribution-map.md](learning-design-pipeline-attribution-map.md) (done)

**S71-R-001:** Counted — Benchmark v2.1 and Validation Review v2.0 completed (operator-confirmed). In-repo instrument paths may remain unresolved; see [STATUS.md](STATUS.md).

---

## QA artefact references

| Artefact | Version | In-repo path |
| -------- | ------- | ------------ |
| Prism Resource Quality Benchmark | v2.1 | **Operator-confirmed complete** for S71-R-001; in-repo path still unresolved — see [STATUS.md](STATUS.md) |
| Prism Benchmark Validation Review | v2.0 | **Operator-confirmed complete** for S71-R-001; in-repo path still unresolved — see [STATUS.md](STATUS.md) |
| Learning Design pipeline attribution map | Sprint 71 | [learning-design-pipeline-attribution-map.md](learning-design-pipeline-attribution-map.md) |

Update [STATUS.md](STATUS.md) when Benchmark/Validation in-repo paths are known.

---

## Sprint 70 decision-ID namespaces

| Namespace | Authority | Use in Sprint 71 |
| --------- | --------- | ---------------- |
| **S70-D01 … S70-D10** | Authoritative closure IDs in [SPRINT-70-CLOSURE.md](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-CLOSURE.md) | Cite these when referring to inherited decisions |
| **S71-D01 … S71-D10** | Sprint 71 aliases for the same ten closure decisions | Convenience IDs in this pack’s [decisions.md](decisions.md) |
| **D70-01 … D70-12** (visual-planning track) | Authoritative for Sprint 70 *visual planning* work in [SPRINT-70-DECISIONS.md](../2026-07-28-sprint-70-visual-planning-and-synthesis/SPRINT-70-DECISIONS.md) | Not aliases for S70-D01… |
| **D70-10 … D70-15** (closure block in DECISIONS.md) | **Non-authoritative duplicate numbers** that collide with earlier visual-planning D70-10… | Do **not** treat as authoritative; map via **S70-D01…S70-D10** only |

---

## Operating principles

1. Benchmark findings are **hypotheses** until validated.  
2. Attribute by **ownership**, not visibility alone.  
3. Prefer recurring patterns over single-resource anecdotes.  
4. No prompt rewrite in Sprint 71 unless charter scope is explicitly changed and logged in [decisions.md](decisions.md).

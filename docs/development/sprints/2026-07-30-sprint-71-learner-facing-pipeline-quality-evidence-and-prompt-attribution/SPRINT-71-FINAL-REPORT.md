# Sprint 71 — Final Report

**Sprint:** 71 — Learner-Facing Pipeline Quality Evidence and Prompt Attribution  
**Opened:** 2026-07-30  
**Closed:** 2026-07-31  
**Status:** **COMPLETE**  
**Predecessor:** Sprint 70 — Resource Quality QA Methodology  
**Successor:** Not opened in this close (Sprint 72 setup deferred)  
**Portable pack:** this folder  
**Top-level closeout:** [docs/sprints/sprint-71-closeout.md](../../../sprints/sprint-71-closeout.md)  
**Closure companion:** [SPRINT-71-CLOSURE.md](SPRINT-71-CLOSURE.md)

---

## How understanding evolved

Sprint 71 is a completed research and engineering investigation. Understanding progressed as follows:

```text
Question
  → Benchmarking
  → Validation
  → Cross-resource synthesis
  → Controlled experiment
  → Architectural understanding
  → Sprint closure
```

| Stage | What happened |
| ----- | ------------- |
| **Question** | How can Prism itself generate better learner-facing resources? |
| **Benchmarking** | Prism Resource Quality Benchmark v2.1 scored generated resources across disciplines. |
| **Validation** | Validation Review v2.0 confirmed, partially confirmed, rejected, or refined benchmark hypotheses. |
| **Cross-resource synthesis** | Recurring patterns were clustered and attributed to Learning Design stages (`S71-F-*`, `S71-O-*`). |
| **Controlled experiment** | Matched Wilfred Owen topic: sparse brief [`S71-R-010`](reviews/S71-R-010.md) **88/100** → pedagogically informed brief [`S71-R-011`](reviews/S71-R-011.md) **91/100**. |
| **Architectural understanding** | Quality was shown to be steerable; residual Critical limits sit mainly in evidence availability; three-layer responsibility model clarified. |
| **Sprint closure** | Evidence base frozen; principles frozen as validated candidates; no prompt rewrites; Sprint 72 not opened. |

Sprint 71 **began as a benchmarking exercise** and **concluded as an investigation into the instructional architecture of Prism**. The principal output is architectural understanding of where educational quality originates and where remaining limitations now lie — not a list of completed tasks alone.

---

## What Sprint 71 proved

Evidence-backed conclusions only (no new claims beyond the validated base):

1. **Instructional quality is materially steerable** through **pedagogically informed workflow guidance** (and the generation prompting that guidance shapes). The Owen controlled comparison shows improvement in the dimensions the richer guidance intentionally targeted — demonstrating **steerability**, not mere correlation.
2. **Remaining critical limitations increasingly concern evidence availability** rather than instructional sequencing. Resources can improve in architecture, scaffolding, alignment, and feedback design while still failing to supply enough authentic disciplinary artefacts for task completion.
3. **Long-term quality should be embedded** in workflow elicitation, discipline profiles, Prism prompt engineering, and **default generation contracts** — not by asking authors to write increasingly sophisticated free-text prompts.

**No canonical prompt rewrites** were performed (as chartered).

---

## Executive Summary

Sprint 71 collected validated quality evidence across **11** Prism-generated learner resources using Benchmark v2.1 and Validation Review v2.0, attributed findings to Learning Design pipeline stages, and retained rejected hypotheses.

The controlled experiment:

```text
S71-R-010 (sparse)  →  S71-R-011 (pedagogically informed detailed brief)
88/100              →  91/100
```

Improvements landed in dimensions intentionally targeted by the richer pedagogical guidance (instructional architecture, scaffolding, constructive alignment, disciplinary quality, feedback, independent study effectiveness, evidence-based reasoning design). Critical poem **evidence-availability** persisted — clarifying the boundary between prompt-sensitive design and content-availability / author-supply.

**Validated Sprint 71 candidate architectural principles** (frozen set — no additions at close):

1. Evidence Sufficiency  
2. Evidence-Centred Activity Design  
3. Pedagogical Timing  
4. Diagnostic Feedback  
5. Disciplinary Uncertainty  
6. Discipline-Appropriate Evidence Evaluation  

Definitions: [design-principles.md](design-principles.md). Synthesis: [cross-resource-synthesis.md](cross-resource-synthesis.md).

---

## Three-layer evidence model (platform architecture)

Future developers should treat this as the Sprint 71 architectural baseline:

| Layer | Name | Responsibility |
| ----- | ---- | -------------- |
| **Layer 1** | **Platform instructional architecture** | Default generation contracts for the validated candidate principles; authors need not restate them every run |
| **Layer 2** | **Workflow elicitation** | Capture instructional intent: where evidence comes from; generate vs upload; public domain; rights and organisational constraints |
| **Layer 3** | **Author-supplied evidence** | Authentic artefacts Prism cannot or should not generate (e.g. copyrighted literary extracts, HR policies, proprietary documentation) |

Differentiate **instructional architecture** (Layer 1), **evidence sourcing** (Layer 2), and **author-supplied artefacts** (Layer 3). Critical residual gaps increasingly sit in Layers 2–3.

---

## Objectives

| Objective | Outcome |
| --------- | ------- |
| Review varied resources with Benchmark v2.1 + Validation Review v2.0 | **Met** — 11 closed reviews (R-001–R-011); short of original ~15–20 sample target by operator close |
| Treat benchmark findings as hypotheses until validated | **Met** |
| Record Confirmed / Partially confirmed / Rejected / New | **Met** |
| Attribute validated findings to pipeline stages | **Met** |
| Track recurrence and confidence | **Met** |
| Retain rejected findings | **Met** |
| Consolidate architectural themes | **Met** — validated candidate principles + three-layer model |
| Do not rewrite canonical prompts | **Met** — zero prompt rewrites |

---

## Work Completed

### Evidence loop (Question → Benchmark → Validation → Synthesis)

- Established the Sprint 71 pack: register, review template, sample plan, attribution map, STATUS, synthesis, design principles.
- Closed reviews **S71-R-001** through **S71-R-011** across Life Sciences, Social Sciences, Humanities/History, Mathematics, Engineering, Computing, Biology (Osmosis), and English Literature.
- Maintained instructional clusters (`S71-F-001`–`S71-F-015`) and workflow/platform obs (`S71-O-001`–`S71-O-006`).
- Preserved Confirmed vs Partial recurrence rules; retained rejected hypotheses in review files.

### Controlled experiment (strongest empirical evidence)

| Arm | Review | Guidance | Benchmark |
| --- | ------ | -------- | --------- |
| Sparse control | [`S71-R-010`](reviews/S71-R-010.md) | Sparse workflow brief | **88/100** Strong |
| Detailed intervention | [`S71-R-011`](reviews/S71-R-011.md) | Pedagogically informed detailed workflow brief | **91/100** Excellent |
| Related signal | [`S71-R-009`](reviews/S71-R-009.md) | Richer History brief | **89/100** Strong |

```text
S71-R-010  →  S71-R-011
88/100     →  91/100
```

**Interpretation:** Pedagogically informed workflow guidance produced measurable improvement on a matched topic. Gains occurred in the dimensions the guidance intentionally targeted. That pattern supports **steerability of generation**, not merely correlation with “longer prompts.” Critical **evidence-availability** of poem extracts remained after intervention (`S71-F-001`) — a Layer 2/3 problem, not solved by instructional sequencing alone.

Principal architecture obs: `S71-O-006`.

### Documentation artefacts

- [improvement-register.md](improvement-register.md) · [review-metadata-index.md](review-metadata-index.md)  
- [cross-resource-synthesis.md](cross-resource-synthesis.md) · [design-principles.md](design-principles.md)  
- Reviews under [reviews/](reviews/)

---

## Principal Findings

### Instructional (selected)

| Cluster | Theme | Status highlight |
| ------- | ----- | ---------------- |
| `S71-F-001` | Evidence Sufficiency / **availability** | Confirmed recurrence **9**; **Critical** |
| `S71-F-002` | Diagnostic feedback | Confirmed recurrence **6**; platform-wide |
| `S71-F-004` | Competing interpretations | Upgraded Confirmed (History) |
| `S71-F-005` | Disciplinary uncertainty not sustained | Partial (Literature) |
| `S71-F-014` | Disciplinary representation presence | Confirmed (Programming) |
| `S71-F-015` | Pedagogical timing / premature disclosure | Confirmed (Science) |

### Architectural observation

| Obs | Theme |
| --- | ----- |
| `S71-O-006` | Pedagogically informed workflow guidance steers quality; distinguish prompt-sensitive gains from content-availability limits |

### Validated Sprint 71 candidate architectural principles

Frozen set (do not add further principles in this close):

1. Evidence Sufficiency  
2. Evidence-Centred Activity Design  
3. Pedagogical Timing  
4. Diagnostic Feedback  
5. Disciplinary Uncertainty  
6. Discipline-Appropriate Evidence Evaluation  

---

## Architectural Outcomes

Sprint 71’s principal output is **architectural understanding**: where educational quality originates (steerable instructional design via pedagogically informed elicitation and Layer-1 defaults) and where remaining limitations now lie (evidence availability / Layer 2–3).

### Workflow guidance interpretation

Sprint 71 does **NOT** conclude that authors should simply write longer prompts.

Instructional expertise should progressively migrate into:

- structured **pedagogically informed elicitation** (Layer 2);  
- discipline profiles;  
- Prism prompt engineering;  
- default generation contracts (Layer 1).

Authors should primarily provide subject-specific knowledge and authentic evidence that Prism cannot or should not generate (Layer 3).

---

## Benchmarking Improvements (instrument candidates — no invented IDs)

- Activity-level Evidence Sufficiency / availability questions.  
- Distinguish scaffolding from premature answer disclosure.  
- Distinguish constructive alignment from checking quality/calibration.  
- Discipline-profile evidence evaluation.  
- Sustained Disciplinary Uncertainty across sequences.  
- Prefer task-completion evidence over diagram/summary quotation density.

In-repo paths for Benchmark v2.1 / Validation Review v2.0 instruments remain unresolved (operator-held) — gap for Sprint 72 setup only.

---

## Deliverables

| Deliverable | Location |
| ----------- | -------- |
| Final report | This document |
| Closure record | [SPRINT-71-CLOSURE.md](SPRINT-71-CLOSURE.md) |
| Top-level closeout | [sprint-71-closeout.md](../../../sprints/sprint-71-closeout.md) |
| Improvement register | [improvement-register.md](improvement-register.md) |
| Review summary register | [review-metadata-index.md](review-metadata-index.md) |
| Cross-resource synthesis | [cross-resource-synthesis.md](cross-resource-synthesis.md) |
| Design principles | [design-principles.md](design-principles.md) |
| Closed reviews R-001–R-011 | [reviews/](reviews/) |
| Sample selection plan | [sample-selection-plan.md](sample-selection-plan.md) |
| STATUS (COMPLETE) | [STATUS.md](STATUS.md) |

---

## Sprint Assessment

| Dimension | Assessment |
| --------- | ---------- |
| Charter fidelity | High — evidence/attribution mode; zero prompt rewrites |
| Sample size | Partial vs original ~15–20 — 11 complete; closed with architectural yield from controlled experiment |
| Method maturity | High — Confirmed/Partial/Rejected discipline; recurrence rules preserved |
| Architectural yield | **High** — benchmarking → instructional-architecture investigation |
| Controlled experiment | Strongest empirical evidence: `S71-R-010` → `S71-R-011`, **88 → 91** |
| Production defects | Tracked separately; GAM math regression verified (`S71-O-004`); open a11y heading obs (`S71-O-005`) |
| Theme ID table | Empty (deferred); principles carried as validated candidates instead |

**Verdict:** Sprint 71 **COMPLETE**.

---

## Recommendations for Sprint 72

Do **not** open Sprint 72 in this close. When setup begins, consider:

1. Productise the **Validated Sprint 71 candidate architectural principles** into Layer-1 default contracts and Layer-2 pedagogically informed elicitation.  
2. Design Layer-2 questions for evidence source / generate / upload / rights.  
3. Address Critical `S71-F-001` evidence-availability with Layer-3 author-supply pathways (especially copyrighted literature).  
4. Continue sample diversity only if further Confirmed recurrence is required before large prompt rewrites.  
5. Resolve in-repo Benchmark v2.1 / Validation Review v2.0 instrument paths.  
6. Address open `S71-O-005` (semantic heading hierarchy) as renderer/accessibility work.  
7. Formalise Theme ID consolidation only under successor process — do not invent IDs in Sprint 71.

---

## Closing Statement

Sprint 71 began by asking how Prism can generate better learner-facing resources, and answered by **benchmarking, validating, synthesising, and experimentally testing** generation under sparse versus pedagogically informed workflow guidance. It closes not as a catalogue of tasks, but as an **instructional-architecture investigation**: quality is steerable; residual Critical limits increasingly concern evidence availability; lasting improvement belongs in platform architecture, pedagogically informed elicitation, and author-supplied authentic evidence — not in ever-longer author prompts.

**Sprint 71 is formally closed.** Evidence base frozen. Principles frozen as validated candidates. Ready for commit.

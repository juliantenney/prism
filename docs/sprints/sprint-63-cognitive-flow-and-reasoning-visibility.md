# Sprint 63 — Cognitive Flow & Reasoning Visibility

**Status:** Closed (2026-07-16) — Outcome A — Architecture Investigation Justified  
**Opened:** 2026-07-16  
**Type:** Discovery and architecture sprint  
**Predecessor:** [Sprint 62 — Coherent Renderer Pass (closed)](../development/sprints/2026-07-16-sprint-62-coherent-renderer-pass/SPRINT-62-CLOSURE.md)  
**Successor:** [Sprint 64 — Cognitive Structure Preservation Investigation](sprint-64-cognitive-structure-preservation-investigation.md)  
**Evolution context:** [learning-experience-evolution.md](../architecture/learning-experience-evolution.md)  
**Portable pack:** [docs/development/sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/](../development/sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/)  
**Close-out:** [sprint-63-closeout.md](../development/sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/sprint-63-closeout.md)

---

## Purpose

> Understand the next bottleneck in learning effectiveness.

Sprint 62 showed that renderer correctness and journey presentation can materially improve the learner experience **without** inventing instructional meaning. Remaining friction increasingly looks like **cognitive flow** and **reasoning visibility** problems — not missing HTML or mis-ordered materials.

---

## Working Hypothesis

The primary source of remaining learner friction may no longer be renderer correctness or activity structure.

The next bottleneck may be a mismatch between:

1. The cognitive process learners must perform.
2. The information explicitly available within the activity.

Sprint 63 exists to test this hypothesis.

### Rationale

Sprint 62 demonstrated that substantial learner-experience improvements can be achieved through renderer correctness and learner-journey presentation improvements alone.

However, subsequent analysis, boundary testing, educational review, and educational redesign exercises suggest that many remaining difficulties may stem from:

* cognitive orchestration,
* reasoning visibility,
* evaluation criteria visibility,
* judgement frameworks,
* self-checking support,
* information that may not currently exist explicitly in the pipeline.

This remains a **hypothesis, not a conclusion**.

A primary goal of Sprint 63 is to determine whether remaining learner friction is caused by:

* presentation problems,
* orchestration problems,
* missing-information problems,
* or a combination of all three.

### Expected Outcome

At the end of Sprint 63 we should be able to state, with evidence:

* what cognitive patterns exist across activities;
* what information those patterns require;
* which information is already implicit in the pipeline;
* which information is genuinely absent;
* and whether future pipeline evolution is justified.

---

## Explicit sprint nature

> **Sprint 63 is a discovery and architecture sprint.**

It is **not** yet a schema redesign sprint.  
It is **not** a DLA/GAM rewrite sprint.  
It is **not** a renderer feature sprint.

Outputs should be evidence, inventories, distinctions, and recommendations — not production code changes unless a later sprint authorises them.

---

## Proposed objectives

1. **Cognitive flow audit** — Inspect representative activities (starting from RNA A1–A6 and Sprint 62 acceptance pages) for how learners are expected to move through thinking, not only through beats.
2. **Cognitive pattern inventory** — Validate or revise provisional patterns (Classification, Causal Analysis, Process Modelling, Systems Analysis, Comparative Analysis, Evaluation & Judgement).
3. **Missing-information inventory** — Catalogue goals, criteria, frameworks, justification prompts, confidence/self-check cues, and other supports that presentation cannot invent.
4. **Distinguish failure classes:**
   - rendering issues (should already be rare post–Sprint 62)
   - orchestration issues (sequence/visibility of reasoning moves)
   - information gaps (meaning not present upstream)
5. **Produce evidence-based recommendations** for future pipeline evolution — without committing to schema changes in this sprint.

---

## Supporting hypotheses

These refine the primary Working Hypothesis above; they are also provisional.

### H1 — Learning Journey ≠ Cognitive Journey

Presentation phases (Frame → Understand → Model → Apply → Verify → Complete) organise the episode. Cognitive moves (Question → Evidence → Reasoning → Decision → Justification → Confidence) may differ by activity type.

### H2 — Uniform episode structure masks pattern diversity

Different reasoning tasks currently share a largely uniform beat grammar; perceived repetition may be pattern collision.

### H3 — Independent learning is information-limited

Where authored goal/criteria/framework meaning is absent, renderer presentation cannot safely create it (Sprint 62 A6 boundary).

### H4 — Pipeline evolution may be needed later

Any recommendation to extend DLA/GAM/authoring contracts must be grounded in Sprint 63 inventories — not assumed at kickoff.

---

## Cognitive pattern investigation (provisional)

| Activity | Candidate Cognitive Pattern |
| -------- | --------------------------- |
| A1 | Classification |
| A2 | Causal Analysis |
| A3 | Process Modelling |
| A4 | Systems Analysis |
| A5 | Comparative Analysis |
| A6 | Evaluation & Judgement |

These are **provisional hypotheses requiring validation** during Sprint 63.

---

## In scope

- Educational review / audit documentation
- Activity-by-activity cognitive flow notes
- Pattern and missing-information inventories
- Classification of issues (render vs orchestrate vs information)
- Architecture recommendations and decision candidates (documentation only)
- Optional low-fidelity prototypes that illustrate cognitive journeys **without** merging production renderer changes

## Out of scope

- Production renderer behaviour changes
- DLA / GAM / pipeline logic changes
- SSOT schema changes
- New authored fields in production contracts
- Implementing new instructional meaning generators

---

## Entrance criteria

- Sprint 62 closed (PASS)
- Learning Experience Evolution document available
- RNA A2/A6 and presentation-slice evidence available for reference

## Exit criteria

- Cognitive flow audit documented for agreed activity set
- Pattern inventory validated, revised, or rejected with rationale
- Missing-information inventory published
- Issue taxonomy applied (render / orchestrate / information)
- Recommendations for any future pipeline sprint recorded — **without** enacting redesign
- Handover ready for a possible Sprint 64 (implementation or further discovery)

---

## Recommended working method

1. Start a **new chat** with clean context; paste the pack briefing.
2. Re-read [learning-experience-evolution.md](../architecture/learning-experience-evolution.md) Phases 3–4.
3. Audit activities evidence-first (fixtures + rendered HTML), not from intuition alone.
4. Prefer inventories and distinctions over premature schema proposals.
5. Keep Sprint 62 renderer rules stable unless a separate sprint reopens presentation work.

---

## Success criterion

Sprint 63 succeeds if it **clarifies the next bottleneck** with evidence — even if the answer is “information gaps dominate” or “orchestration dominates” — and leaves a crisp recommendation for what (if anything) should change next.

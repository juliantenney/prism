# Sprint 27 — investigation plan

**Pack:** `docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/`  
**Mode:** Read-only until Phase 4 charter approval  
**Owner slice:** 27-1

---

## Objectives

1. Map **where** pedagogical assessment intent enters PRISM.  
2. Map **where** it transforms or drops before the learner sees output.  
3. Produce an **evidence-backed** gap list for elicitation vs propagation vs composition.  
4. Draft a **feedback/assessment ontology** sufficient to charter bounded fixes (27-4).

---

## Phase 1 — Evidence consolidation (27-1) — **complete**

**Duration:** 1–2 investigation sessions  
**Output:** Completed [`elicitation-evidence-matrix.md`](elicitation-evidence-matrix.md) + R27-001 in review log

| Step | Task | Artefacts |
|------|------|-----------|
| 1.1 | Document RNA/HCV case end-to-end | `rna-virus-activities-formative.json`, topology tests, Sprint 26 pack |
| 1.2 | Document inflation retrieval case | `ld-inflation-workshop-page-full.json`, render tests |
| 1.3 | Document climate misconception case | `ld-climate-misconception-discussion-page.json`, render tests |
| 1.4 | For each case: list workflow steps, resolved factors, page `sections[]`, render flags | Matrix columns |
| 1.5 | Adjudicate H1–H6 (Supported / Partial / Refuted) with line citations | `review-log.md` |

**Methods:**

- Read pack `workflowBriefConfig` + `workflowPolicy` JSON in LD step-patterns.  
- Grep `app.js` for `include_answers`, `feedback_display`, `feedback_required`, `assessment_required`.  
- Run unit tests only — no mandatory live OpenAI for 27-1.

---

## Phase 2 — Elicitation audit (27-2) — **complete**

**Prerequisite:** Phase 1 matrix complete  
**Output:** Updated [`assessment-semantics-notes.md`](assessment-semantics-notes.md) — validated gap list P1–P14, candidate factors, layer map

| Step | Task |
|------|------|
| 2.1 | Inventory all `workflowBriefConfig` factors (required + optional) |
| 2.2 | Map factors to `extractWorkflowBriefExplicitFactors` regex coverage |
| 2.3 | List semantic dimensions **missing** from Factory (discussion mode, feedback timing, confidence, peer instruction) |
| 2.4 | Compare `resolveAssessmentIntentClassMetadata` queue vs brief-time elicitation |
| 2.5 | Propose candidate factor IDs (documentation only — no schema change yet) |

---

## Phase 3 — Workflow probes (27-3) — **complete**

**Prerequisite:** Phase 2 gap list  
**Output:** [`context-files/probe-p27-02-resolved-factors.md`](context-files/probe-p27-02-resolved-factors.md), [`probe-p27-03-peer-instruction.md`](context-files/probe-p27-03-peer-instruction.md), [`probe-p27-04-assessment-items-excerpt.md`](context-files/probe-p27-04-assessment-items-excerpt.md), [`27-3-probe-capture.json`](context-files/27-3-probe-capture.json). Live G/C/R **pending** except P27-04 fixture proxy.

| Step | Task |
|------|------|
| 3.1 | Select 2–3 probes from [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md) |
| 3.2 | Run in Factory (manual) or extend heuristic tests with brief JSON |
| 3.3 | Capture: resolved factors, workflow steps, assessment_items excerpt, page JSON, HTML export |
| 3.4 | Compare **intended** pedagogy (brief author intent) vs **observed** chain |

**Suggested first probes:**

1. Tutor-led delayed-feedback discussion quiz  
2. Diagnostic misconception assessment (climate-shaped)  
3. Self-study retrieval quiz (inflation-shaped control)

---

## Phase 4 — Ontology & fix charter (27-4) — **complete (charter only)**

**Prerequisite:** Phases 1–3 signed off in review log  
**Output:** [`slice-27-4-charter.md`](slice-27-4-charter.md) — bounded implementation programme; **no code in this phase**

| Step | Task |
|------|------|
| 4.1 | Freeze ontology terms: visibility, timing, mode, interaction model |
| 4.2 | Decide layer ownership per gap (E/O/G/C/R) |
| 4.3 | Size bounded changes (pack vs app.js vs prompts) |
| 4.4 | Define regression fixtures per semantic dimension |

**Gate:** No code changes in Phases 1–3 unless blocking test failures.

---

## Layer tagging convention

Use in matrix and review log:

| Tag | Layer |
|-----|--------|
| **E** | Elicitation / brief resolution |
| **O** | Orchestration / workflow topology |
| **G** | Step generation / artefacts |
| **C** | Design Page composition |
| **R** | Renderer / export (closed unless anomaly) |

---

## Deliverables checklist

- [x] `elicitation-evidence-matrix.md` — all three cases filled  
- [x] `assessment-semantics-notes.md` — gap list validated (27-2)  
- [x] `workflow-probe-catalogue.md` — priority probes marked (27-3)  
- [x] `review-log.md` — H1–H6 verdicts + R27-006–025  
- [x] `CURRENT-STATE.md` updated at phase boundaries  
- [x] `slice-27-4-charter.md` — implementation charter (27-4)  

---

## Risks

| Risk | Mitigation |
|------|------------|
| Re-opening renderer work | Use fixtures; treat R layer closed per HANDOVER |
| Scope creep into topology | Defer to Sprint 26 pack; only note assessment–activity interaction |
| Prompt changes before evidence | Phase 4 gate |
| Confusing presentation with pedagogy | Separate matrix columns for factors vs `feedback_display` vs item fields |

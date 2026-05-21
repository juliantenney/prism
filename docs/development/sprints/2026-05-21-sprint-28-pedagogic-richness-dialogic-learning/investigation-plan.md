# Sprint 28 — investigation plan

**Pack:** `docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/`  
**Mode:** Read-only until Phase 4 charter approval  
**Status:** Phases 1–4 **charter drafted** (2026-05-21); **28-5 implementation** gated on approval  
**Owner slice:** 28-5a (post-approval)  
**Theme (2026-05-21):** **Cognitive engagement architecture** — pedagogic augmentation for experts who are not expert learning designers; **self-study** as primary strategic use-case.

---

## Objectives

1. Determine whether generated materials encode **learner cognition** (scaffolding, misconception repair, progression, self-explanation) or only **instructional artefacts**.  
2. Map **where** cognitive-engagement intent could enter PRISM (elicitation, prompts, composition) — without claiming runtime personalisation.  
3. Produce an **evidence-backed** gap list by layer **E / O / G / C / R**.  
4. Publish a **richness rubric** (D1–D10 + cognitive interpretation) sufficient to charter bounded fixes (28-4+).  
5. Adjudicate **H7:** instructional artefacts vs learner cognition.

---

## Phase 1 — Evidence consolidation (28-1)

**Duration:** 1–2 investigation sessions  
**Output:** Completed [`pedagogic-richness-evidence-matrix.md`](pedagogic-richness-evidence-matrix.md) + R28-009 in review log

| Step | Task | Status |
|------|------|--------|
| 1.1 | **Climate misconception seminar** end-to-end (primary) | **Complete** (2026-05-21) — matrix Case 1, R28-009 draft |
| 1.2 | Compare **activity_materials** vs **assessment_items** depth on same case | **Done for climate** (Case 1 matrix) |
| 1.3 | Document peer-instruction case (prediction → discussion → revision) | **Complete** (2026-05-21) — Case 2, R28-013 |
| 1.4 | Document transcript→dialogic case (if fixture/capture exists) | **Complete** (2026-05-21) — Case 3, R28-014 |
| 1.4b | Document **self-study** cases (retrieval-quiz, no-assessment, RNA page fixture) | **Complete** (2026-05-21) — Case 5 matrix + R28-012 |
| 1.5 | Apply **richness rubric** (0–3 per dimension) to each case | **Done for climate** (mean 1.2) |
| 1.6 | Adjudicate H1–H6 (Supported / Partial / Refuted) | **Climate-row draft only** — programme pending |

**Methods:**

- Read LD pack `promptTemplate` for `step_design_learning_activities`, `step_generate_activity_materials`.  
- Inspect JSON field usage: `task_cards`, `discussion_prompts`, `facilitator_moves`, `scenario`, `anticipated_responses`.  
- Grep `app.js` for activity-material mapping (read-only).  
- Unit tests + fixtures first; live OpenAI optional for 28-3.

**No code changes.**

---

## Phase 2 — Elicitation & ontology audit (28-2)

**Prerequisite:** Phase 1 matrix complete  
**Output:** [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md) §3, §10, §11; R28-015, R28-016; H10–H12  
**Status:** **Complete** (2026-05-21)

| Step | Task | Status |
|------|------|--------|
| 2.1 | Inventory `workflowBriefConfig` + runtime-merged factors | **Complete** — §3.2 class **A** |
| 2.2 | List missing cognitive dimensions | **Complete** — §3.2 class **D** |
| 2.3 | Map to `extractWorkflowBriefExplicitFactors` | **Complete** — regex vs absent |
| 2.4 | DLA vs GAM vs GAI vs Design Page contracts | **Complete** — §4 asymmetry |
| 2.5 | Orchestration lean vs rich | **Complete** — `leanAssessmentItemIntent`, P28-016 |
| 2.6 | Candidate factor IDs (docs only) | **Complete** — §3.2, 28-4 hooks in §11 |

---

## Phase 3 — Workflow probes (28-3) — **COMPLETE** (2026-05-21)

**Prerequisite:** Phase 2 gap list  
**Output:** [`context-files/`](context-files/) captures; matrix live section; R28-017/018

| Step | Task | Status |
|------|------|--------|
| 3.1 | **P28-01** climate (richer task cards) — live via `28-3-probe-runner.js` | **Done** |
| 3.2 | **P28-02** peer instruction | **Done** |
| 3.3 | **P28-07** transcript → dialogic (selected over P28-03–06) | **Done** |
| 3.4 | Rubric D1–D10 + investigator notes per probe | **Done** |
| 3.5 | Catalogue + matrix + §12 representation ceiling | **Done** |

**Optional probes (P28-03, P28-05):** Not run — time boxed; priority trio sufficient for live validation.

**Capture checklist (per probe):**

- Resolved factors (E/O)  
- `steps[]` topology  
- `learning_activities` JSON (if generated)  
- `activity_materials` JSON  
- Composed `page.sections[]`  
- Export HTML snippet (R) — semantic content only  
- Rubric scores + investigator notes

---

## Phase 4 — Gap charter (28-4) — **COMPLETE** (draft, 2026-05-21)

**Prerequisite:** Phases 1–3 complete  
**Output:** [`slice-28-4-charter.md`](slice-28-4-charter.md) — themes A–E; slices **28-5a–5e**; R28-019, R28-020

| Step | Task | Status |
|------|------|--------|
| 4.1 | Prioritise gaps P28-001–018 | **Done** |
| 4.2 | Bounded slices 28-5a–5e | **Done** |
| 4.3 | Non-goals + Sprint 27 regression anchors | **Done** |
| 4.4 | Review log R28-019/020 | **Done** |

**Gate:** No implementation until charter **user-approved**. Sprint 28 investigation **substantially complete**; programme closes after 28-5 + post-probe validation.

---

## Layer trace template (use in matrix)

For each evidence case, answer:

| Layer | Question |
|-------|----------|
| **E** | What did the brief ask for? What factors were resolved? Any dialogic/richness signals? |
| **O** | Which activity steps survived heuristics? Any lean-pruning of DLA/GAM? |
| **G** | What depth in `activity_materials` (task cards, moves, prompts)? |
| **C** | Did composition preserve or flatten materials into page sections? |
| **R** | Does export present dialogic structure without losing tension/specificity? |

---

## Dependencies

| Dependency | Status |
|------------|--------|
| Sprint 27 complete | Yes |
| Climate page fixture | Yes |
| Sprint 27 probe notes | Yes |
| Live API for 28-3 | Optional |
| New test fixtures for 28 | Deferred to implementation phase |

---

## Exit criteria (investigation complete)

- [x] Climate case row complete with rubric scores  
- [ ] ≥2 additional probes scored  
- [ ] H1–H6 adjudicated  
- [ ] Gap list P1–Pn with layer tags  
- [ ] No runtime changes on investigation branch  
- [ ] `node --test tests/*.test.js` ≥ **311** pass

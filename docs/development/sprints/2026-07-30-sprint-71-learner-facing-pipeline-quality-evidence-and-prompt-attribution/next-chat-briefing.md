# Sprint 71 — Next Chat Briefing

Paste this into a fresh chat to resume Sprint 71.

---

## Active sprint

**Sprint 71 — Learner-Facing Pipeline Quality Evidence and Prompt Attribution**  
**Status:** Active  
**Opened:** 2026-07-30  

**START HERE:** `docs/development/sprints/2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-START-HERE.md`

**Predecessor:** Sprint 70 **Closed** — QA methodology established (Benchmark v2.1, Validation Review v2.0, attribution rules). Authoritative closure IDs: `S70-D01`…`S70-D10` (Sprint 71 aliases `S71-D01`…`S71-D10`; do not cite colliding `D70-10`…`D70-15` as authority).

---

## Mission

Collect validated quality evidence across ~15–20 Prism resources and attribute findings to the canonical Learning Design pipeline stage (or assembly/renderer layer) that should have prevented them.

**Do not rewrite canonical prompts** unless a logged decision expands scope.

---

## Phase 0 gate (before Review 1 counts)

Record canonical **paths + versions** in `STATUS.md` for:

1. Prism Resource Quality Benchmark v2.1  
2. Prism Benchmark Validation Review v2.0  

Attribution map (done): `learning-design-pipeline-attribution-map.md`

---

## Workflow

1. Select sample for variety (`sample-selection-plan.md`) then generate resource  
2. Benchmark v2.1  
3. Validation Review v2.0  
4. Compare; treat benchmark as hypothesis  
5. Log Confirmed / Partially confirmed / Rejected / New in `reviews/<id>.md`  
6. Attribute: observed location · primary stage · contributing stages · responsibility type  
7. Promote/update **cluster** rows in `improvement-register.md` (first / linked reviews / last / recurrence count)  
8. Update `STATUS.md` (complete / blocked / awaiting attribution / low-confidence / sample distribution)  

---

## Spine

```text
Generate Learning Content → Model Knowledge → Define Learning Outcomes
→ Design Episode Plan → Design Learning Activities → Generate Activity Materials
→ Construct Learning Sequence → Design Page
```

Focus stages: Episode Plan, DLA, GAM, Learning Sequence, Design Page (prompt only for title/orientation/visual-plan).  
Also distinguish: artefact contract · stage handoff · deterministic page assembly · renderer.

---

## Hard rules

- Production severity / release caps only for production defects  
- Instructional findings use educational priority  
- Retain rejected findings  
- Workflow/author observations log-only  
- Observation ≠ ownership  
- Design Page does **not** automatically own all final-page assembly losses  

---

## Gaps to resolve early

- Record in-repo (or storage) paths for Benchmark v2.1 and Validation Review v2.0 in `STATUS.md` (not located under `docs/` at Sprint 70 close). Phase 0 remains open until done.

---

## Scope of agent work in this sprint

Sprint-management and QA logging documentation / analysis only unless explicitly asked to change prompts or code. Prefer updating the improvement register over implementing fixes.

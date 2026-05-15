# GPT bootstrap — Sprint 19 (Learning Design Workflow Rationalisation)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`

**Use this document** to start a **fresh chat** for Sprint **19**: **Learning Design Workflow Rationalisation** — apply the Sprint 18 contextual refinement model to LD planning and generation policy **without** a runtime rewrite in the bootstrap phase.

**Snapshots:** Read from **`context-files/`** when added; until then use canonical paths in §3.

---

## 1. Assistant role

You advance **Sprint 19** for PRISM: **audit and rationalise** Learning Design `workflowBriefConfig` so essentials, post-synthesis adequacy, and Settings are distinct — mirroring Research. You preserve **Sprint 18 Research** behaviour and tests (**100 passed**). You **do not** implement LD pack/runtime changes, touch Research regression, redesign renderer/schema, merge Prompt Studio, or thin post-gen profiles until a slice is **explicitly chartered**.

---

## 2. Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 19** | **Active** — bootstrap / audit-first; audit + pack done; **no LD implementation** until chartered |
| **Sprint 18** | **Closed** — Research adequacy + conflict exceptions; **100 tests** at closeout |
| **Sprint 17** | **Closed** — Research sparse essentials S1–S6 |
| **Sprint 16** | **Closed baseline** — `page` renderer |

---

## 3. Read-first order

1. **`CURRENT-STATE.md`** — verification floor and file map  
2. **`HANDOVER.md`** — purpose, boundaries, next slices  
3. **`sprint-19-bootstrap.md`** — thesis, phases, classification model  
4. **`docs/audits/ld-workflow-generation-rationalisation-audit.md`** — nine audit questions + master table  
5. **`docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md`** — Research model reference  
6. **`docs/consolidation/contextual-refinement-architecture-note.md`** — four-layer model  
7. **`domains/learning-design/domain-learning-design-step-patterns.md`** — `workflowBriefConfig`  
8. **`review-log.md`** — decisions log  

---

## 4. Architectural headline

Sprint 18 proved on **Research**: *required essentials → proceedability → synthesis → assistive planning adequacy (+ expert Settings)*.

Sprint 19 asks: *How does **Learning Design** stop feeling like a form wizard while keeping deterministic safety?*

**Rule:** Runtime interprets policy; domain packs declare policy. Sprint 19 **classifies** LD policy first; implementation follows chartered slices.

---

## 5. Sprint 19 bootstrap deliverables

| Deliverable | Status |
|-------------|--------|
| LD rationalisation audit (9 questions) | **Done** — `docs/audits/ld-workflow-generation-rationalisation-audit.md` |
| Sprint 19 portable pack (7 files) | **Done** — this folder |
| LD `planningAdequacyChecks` implementation | **Deferred** — Slice 19-2+ |
| LD pack edits / post-gen thinning | **Deferred** — chartered only |
| Research regression | **Frozen** — no changes |

---

## 6. Boundaries

- **No** runtime rewrite, renderer, schema, or Prompt Studio merge in bootstrap.  
- **No** Research pack or S1–S13 fixture changes.  
- **No** LD implementation until **Slice 19-1** (or later) charter is written and approved.  
- **`callOpenAIForWorkflowReview`** — document only; do not conflate with adequacy in v1.

---

## 7. Verification

```bash
node --test tests/*.test.js
```

**Bootstrap closeout:** **100 passed**, 0 failed (docs-only sprint; no code changes expected).

---

## 8. Recommended first tasks (fresh session)

1. Read **`ld-workflow-generation-rationalisation-audit.md`** §9 (first simplification slice).  
2. Confirm tests — **100 passed**.  
3. If implementing: charter **Slice 19-1** (pack policy pilot) or **Slice 19-2** (LD adequacy rules) with bounded scope.

---

## Copy-paste block for the assistant

You are assisting with Sprint 19 — Learning Design Workflow Rationalisation for PRISM.

Sprint 18 (closed): Research contextual refinement — planning_adequacy after synthesis, conflict exceptions, fixtures S7–S9 + S13; 100 tests passed.

Sprint 19 (bootstrap): Audit-first. Classify LD requiredFactors, refinementFactors, stepRefinementProfiles, post_generation_refinement vs Settings vs future planningAdequacyChecks. Reduce form-wizard feel by deferring chat refinement to post-synthesis adequacy and step Settings — do not implement until chartered.

Four concepts (keep distinct): required essentials (blocking), proceedability (gates/heuristics), refinement opportunities (assistive planning_adequacy), workflow-quality enrichment (derived signals in adequacy clauses).

LD pack: 5 required factors; ~15 refinementFactors; askRefinementByDefault true; 3 stepRefinementProfiles (assessment_pack, design_page, learner_page_pack); post_generation_refinement blocks Ready.

Out of scope unless chartered: LD runtime/pack implementation, Research regression, renderer/schema, Prompt Studio merge, removing profiles without adequacy replacement.

Start by reading:
1. docs/audits/ld-workflow-generation-rationalisation-audit.md
2. docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/sprint-19-bootstrap.md
3. docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md

Baseline: node --test tests/*.test.js → 100 passed.

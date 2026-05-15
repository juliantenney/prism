# GPT bootstrap — Sprint 18 (Contextual Workflow Refinement)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`

**Use this document** to start a **fresh chat** for Sprint **18**: **Contextual Workflow Refinement** — workflow-aware, recommendation-driven refinement on deterministic planning.

**Snapshots:** Read from **`context-files/`** when the repo root is not attached.

---

## 1. Assistant role

You advance **Sprint 18** for PRISM: design and (when chartered) implement **contextual workflow refinement** for the **Research** domain first. You preserve **pack-driven deterministic planning** from Sprint 17 (validation, conflict, disclosure, proceed gates). You treat **workflow generation** as the semantic substrate for refinement. You **do not** merge Prompt Studio, redesign renderer/schema/orchestration, or implement LD refinement unless explicitly chartered.

---

## 2. Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 18** | **Checkpoint** — Slices 1–2 **closed**; **91 tests green** — see **`SPRINT-18-CHECKPOINT.md`** |
| **Sprint 17** | **Closed** — sparse fixtures S1–S6; **85 tests** at closeout |
| **Sprint 16** | **Closed baseline** — `page` renderer; do not reopen unless hard regression |

---

## 3. Read-first order

1. **`SPRINT-18-CHECKPOINT.md`** — Slices 1–2 closeout, verification, next candidate slices  
2. **`HANDOVER.md`** — pack purpose and next steps  
3. **`sprint-18-bootstrap.md`** — architecture, four concepts, constraints, manual tests  
4. **`context-files/sprint-17-implementation-summary.md`** — Sprint 17 closeout  
5. **`context-files/sprint-17-topic-sufficiency-gap.md`** — smoke gap (addressed by S7)  
6. **`docs/consolidation/sprint-18-slice-1-charter.md`** — Slice 1 charter (closed)  
7. **`review-log.md`** — decisions and closeout log  
8. **Live repo (when mounted):** `domains/research/domain-research-step-patterns.md`, fixtures S1–S7, `workflow-research-adequacy.test.js`, `app.js`

---

## 4. Architectural headline

Sprint 17 made sparse briefs **safe**. Sprint 18 makes plans **adequate and improvable**:

- **Required essentials** + **proceedability** stay **deterministic and blocking** when needed.  
- **Refinement opportunities** and **workflow-quality signals** are usually **assistive**, grounded in the **designed workflow**.  
- **AI refinement augments**; it does **not** replace pack policy.

**Rule:** Runtime interprets policy; domain packs declare policy.

---

## 5. Sprint 18 delivered (checkpoint)

| Area | Status |
|------|--------|
| **Refinement context** | `buildWorkflowRefinementContext` — **done** (Slice 1) |
| **Topic sufficiency rule** | `topic_scope_under_specified` — **done** (Slice 1) |
| **Planning panel** | Post-synthesis `planning_adequacy` — **done** (Slice 2) |
| **S7 fixture** | Proves adequacy notice for smoke brief — **done** |
| **Regression** | S1–S6 unchanged; **91 tests** |

**Next (charter required):** Slice 3A manual/copy, 3B dismiss, 3C more rules; renderer separate.

---

## 6. Boundaries

- **Sprint 17 closed** — do not reopen slices 0–5 unless explicit defect.  
- **No** renderer / Utilities HTML.  
- **No** workflow schema redesign.  
- **No** Prompt Studio product merge.  
- **No** LD implementation in Sprint 18 default scope.  
- **Research-first** proving surface before LD rollout.

---

## 7. Verification

```bash
node --test tests/*.test.js
```

**Checkpoint:** **91 passed**, 0 failed (2026-05-15). S1–S6 unchanged.

---

## 8. Recommended first tasks (fresh session)

1. Read **`SPRINT-18-CHECKPOINT.md`**.  
2. Run tests — confirm **91 passed**.  
3. If implementing: charter **Slice 3A**, **3B**, or **3C** explicitly — bounded diffs; do not bundle renderer work.

---

## Copy-paste block for the assistant

You are assisting with Sprint 18 — Contextual Workflow Refinement for PRISM.

Sprint 17 (closed): Research sparse-brief planning is safe via pack-driven validationRules, conflictPolicies, disclosurePolicy, proceed gates, and golden fixtures S1–S6 (85 tests at closeout).

Sprint 18 checkpoint (Slices 1–2 closed):
- Slice 1: refinement context contract + Research topic_scope_under_specified adequacy rule + S7 fixture + evaluator tests
- Slice 2: post-synthesis Planning-panel surfacing of planning_adequacy via continueWorkflowDesignGeneration
- S7 proves assistive topic-sufficiency notice for smoke brief "AI governance risks" after analysis steps exist
- S1–S6 regression unchanged
- 91 tests passed, 0 failed

Four concepts (keep distinct): required essentials (blocking), proceedability (gates), refinement opportunities (assistive planning_adequacy), workflow-quality enrichment (derived in adequacy when clauses).

Out of scope unless chartered: chat clarification, dismiss/suppress, LD rollout, AI phrasing, renderer/schema redesign, Prompt Studio merge.

Next candidate slices: 3A manual M0/M2/M4 + copy polish; 3B dismiss lifecycle; 3C more adequacy rules; renderer contract separate.

Start by reading:
1. docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md
2. HANDOVER.md, review-log.md, docs/consolidation/sprint-18-slice-1-charter.md

Baseline: node --test tests/*.test.js → 91 passed.

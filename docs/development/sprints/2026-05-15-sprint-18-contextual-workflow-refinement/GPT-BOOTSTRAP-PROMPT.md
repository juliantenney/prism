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
| **Sprint 18** | **Active (bootstrap)** — exploration / docs-first; implementation charter TBD |
| **Sprint 17** | **Closed** — sparse fixtures S1–S6; validation/conflict/disclosure/gates; **85 tests green** |
| **Sprint 16** | **Closed baseline** — `page` renderer; do not reopen unless hard regression |

---

## 3. Read-first order

1. **`HANDOVER.md`** — pack purpose and next steps  
2. **`sprint-18-bootstrap.md`** — architecture, four concepts, constraints, manual tests  
3. **`context-files/sprint-17-implementation-summary.md`** — Sprint 17 closeout  
4. **`context-files/contextual-refinement-architecture-note.md`** — four layers, breakthrough framing  
5. **`context-files/sprint-17-topic-sufficiency-gap.md`** — post-closeout smoke test gap  
6. **`context-files/workflow-aware-refinement-concepts.md`** — candidate pack concepts  
7. **`context-files/existing-refinement-infrastructure-audit.md`** — what code already does  
8. **`context-files/sprint-18-research-questions.md`** — open design questions (S1–S6 grounded)  
9. **`context-files/sprint-17-research-elicitation-sparse-brief-prep.md`** — sparse brief S1–S6 table  
10. **`context-files/prompt-studio-workflow-factory-lessons.md`** — PS patterns, no merge  
11. **Live repo (when mounted):** `domains/research/domain-research-step-patterns.md`, `tests/fixtures/workflow-brief-research-sparse/`, `app.js` elicitation + `continueWorkflowDesignGeneration`

---

## 4. Architectural headline

Sprint 17 made sparse briefs **safe**. Sprint 18 makes plans **adequate and improvable**:

- **Required essentials** + **proceedability** stay **deterministic and blocking** when needed.  
- **Refinement opportunities** and **workflow-quality signals** are usually **assistive**, grounded in the **designed workflow**.  
- **AI refinement augments**; it does **not** replace pack policy.

**Rule:** Runtime interprets policy; domain packs declare policy.

---

## 5. Sprint 18 focus (bootstrap)

| Area | Direction |
|------|-----------|
| **Substrate** | First workflow design creates step-level semantic context |
| **Policy** | Pack triggers on workflow shape + brief (Research first) |
| **UX** | Workflow-level recommendations; step Settings = advanced override |
| **First adequacy candidate** | Topic scope when `generate_from_topic` + analysis chain (smoke test) |
| **Regression** | Keep S1–S6; plan S7+ for adequacy |

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

**Baseline:** **85 passed**, 0 failed (2026-05-15).

---

## 8. Recommended first tasks (fresh session)

1. Read **`sprint-18-bootstrap.md`** §§3–9 and §13 (manual tests).  
2. Read **`context-files/sprint-18-research-questions.md`** — answer or narrow RQ-T1, RQ-B1, RQ-P1.  
3. Run tests — confirm **85 passed**.  
4. If implementing: draft **refinement context contract** doc only, then one Research pack rule + **S7** fixture proposal — no broad `app.js` refactor without charter.

---

## Copy-paste block for the assistant

You are assisting with Sprint 18 — Contextual Workflow Refinement for PRISM.

Sprint 17 (closed): Research sparse-brief planning is safe via pack-driven validationRules, conflictPolicies, disclosurePolicy, proceed gates, and golden fixtures S1–S6 (85 tests green). Post-closeout gap: brief "Analyse the evidence and produce an executive briefing on AI governance risks" resolved all required factors including generate_from_topic but never clarified topic scope before a full analysis chain was planned.

Sprint 18 focus:
- workflow-aware, recommendation-driven, usually non-blocking refinement on top of deterministic planning
- workflow generation creates semantic context for elicitation (step list + artefacts + disclosures), not factor enumeration alone
- distinguish: required essentials (blocking), proceedability (gates), refinement opportunities (assistive), workflow-quality enrichment (derived signals)
- Research-first; LD deferred; Prompt Studio lessons only (no orchestration merge)
- preserve: runtime interprets policy, packs declare policy

Start by reading (in order):
1. docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/HANDOVER.md
2. docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/sprint-18-bootstrap.md
3. docs/consolidation/sprint-17-implementation-summary.md (or context-files/sprint-17-implementation-summary.md)
4. docs/consolidation/contextual-refinement-architecture-note.md
5. docs/exploration/workflow-aware-refinement-concepts.md
6. docs/audits/existing-refinement-infrastructure-audit.md
7. docs/exploration/sprint-18-research-questions.md
8. docs/consolidation/sprint-17-research-elicitation-sparse-brief-prep.md (S1–S6)
9. context-files/prompt-studio-workflow-factory-lessons.md in the Sprint 18 pack

Do not: merge Prompt Studio, redesign renderer/schema/orchestration, reopen Sprint 17 implementation, implement LD refinement unless chartered.

Baseline: node --test tests/*.test.js → 85 passed.

Active exploration: refinement timing, assistive vs blocking, refinement context contract, topic sufficiency / highImpactClarificationRules, S7+ fixtures, manual tests M0–M8 in sprint-18-bootstrap.md §13.

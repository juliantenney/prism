# Context for next chat — Sprint 38-B

**Paste this pack path first:** `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/`  
**Mirror:** [NEXT-CHAT-CONTEXT.md](../../../../NEXT-CHAT-CONTEXT.md) (repo root)

---

## 1. Current project state

- **PRISM** Learning Design workflow: upstream steps → **Design Page** compose → HTML renderer → VEU v1.2.1 → image generation.
- **Sprint 38** pedagogical visual affordance architecture is **complete**, validated E2E, and **frozen** (do not reopen schema, renderer, VEU, CSS, image models).
- **706 tests passing** (`node --test tests/*.test.js`).
- **Sprint 38-B pack** exists — **planning/audit only**; no runtime refactor in this phase.
- **Sprint 39** reasoning cue specification is **planned but deferred** until 38-B prompt audit completes.

---

## 2. Sprint 38 status (frozen)

| Piece | Summary |
|-------|---------|
| **Page root** | `visual_affordance_schema_version: "38.4"`, `activities_visual_review[]`, `visual_affordances[]` |
| **Pipeline** | Design Page → Compose (`lib/sprint38-visual-affordances.js`) → Renderer → VEU v1.2.1 → images |
| **38-6** | `pedagogical_added_value` + per-representation guidance |

Full detail: [Sprint 38 ARCHITECTURE.md](../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md)

---

## 3. Materials-fidelity regression and partial fix

**Initial regression:** Design Page outputs replaced rich `activity_materials` with placeholder labels:

- “Set of short scenarios describing price changes.”
- “Calculation table with basket items.”
- “Model showing totals, percentage calculation, and interpretation.”
- “Table linking type, evidence, and explanation.”

**Partial fix (already in codebase):**

- `buildDesignPageActivityMaterialsFidelityPromptBlock()` + runtime apply after Sprint 38 block (`app.js`)
- Pack §13 `MATERIALS FIDELITY` in `domain-learning-design-step-patterns.md`
- Sprint 38 blocks clarified: affordances are **additive**; duplicate/avoid rules apply to **figures only**
- `lib/design-page-materials-fidelity.js` + `tests/design-page-materials-fidelity.test.js` (placeholder detection)

**Outcome:** Concrete scenarios partly restored on Inflation rerun; affordances still emit.

---

## 4. Remaining table-fidelity regression (unresolved)

Tables still break into **malformed comma-row list/prose**, for example:

```text
Scenario 1,,,
Scenario 2,,,
Scenario 3,,,

Headers
Policy Change
Borrowing
Spending
Inflation

Rows
Interest rate increase,,,
Interest rate decrease,,,
```

**Expected:** Table-shaped content in named `materials` fields — markdown pipe tables (`| col | col |`) and/or structured objects — suitable for renderer table normalisation. Not CSV-style comma rows in bullet lists.

**38B-4** owns root-cause analysis (upstream GAM → Design Page copy → model compression → renderer expectations).

---

## 5. Why Sprint 38-B exists

Sprint 38 validation proved the **visual affordance architecture** works. It also proved **LD prompt architecture debt** is hurting learning resource quality:

- Sprints 35–38 added capabilities by **appending** auto-applied blocks.
- Design Page prompts are **very large** with overlapping rules.
- Block interactions cause **unpredictable compression** (placeholders first, malformed tables now).

**Hypothesis:** Bottleneck is prompt architecture, not Sprint 38 schema or renderer capability.

---

## 6. Sprint 38-B objective

**Learning Design Prompt Architecture and Materials Fidelity Consolidation**

Audit and plan how to:

- Preserve Sprint 35–38 pedagogical capabilities  
- Reduce size, duplication, and contradiction  
- Make instructions hierarchical and maintainable  
- Explicitly secure **materials + table fidelity**  

**Not:** delete pedagogy blocks without a consolidation map.

---

## 7. Scope / non-scope

| In scope | Out of scope |
|----------|----------------|
| LD prompt audit, taxonomy, Design Page consolidation **plan** | Runtime refactor (this phase) |
| Materials + **table** fidelity analysis | Renderer, VEU, CSS, image model changes |
| Regression validation **plan** | Sprint 38 schema changes |
| Prompt governance recommendations | Sprint 39 implementation (gated) |

---

## 8. Suggested first action

1. Read [SPRINT-38-B-CHARTER.md](SPRINT-38-B-CHARTER.md) and [fixtures/probe-38B-1-prompt-audit-template.md](fixtures/probe-38B-1-prompt-audit-template.md).  
2. Complete **38B-1 Prompt Audit** — start with **Design Page**: pack `promptTemplate` + `defaultPromptNotes` + all `applyWorkflowStepRuntimePromptAugmentations` blocks.  
3. In parallel, seed **38B-4** with latest Inflation Design Page JSON/HTML samples showing comma-row tables.  
4. Populate [observations/38B-1-prompt-audit.md](observations/38B-1-prompt-audit.md) and [observations/38B-4-materials-and-table-fidelity.md](observations/38B-4-materials-and-table-fidelity.md).  
5. **Do not** refactor runtime prompts yet.

---

## 9. Key files to inspect

| Area | Path |
|------|------|
| Design Page pack §13 | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Runtime augmentations | `app.js` — `applyWorkflowStepRuntimePromptAugmentations`, `buildDesignPageActivityMaterialsFidelityPromptBlock`, `buildSprint38VisualAffordanceDesignPagePromptBlock`, PEL/GAM/self-directed blocks |
| Materials fidelity lib/tests | `lib/design-page-materials-fidelity.js`, `tests/design-page-materials-fidelity.test.js` |
| Sprint 38 compose | `lib/sprint38-visual-affordances.js` |
| Inflation fixtures | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json`, `ld-inflation-workshop-learner-visibility-page.json` |
| Sprint 38 affordance probes | `tests/fixtures/sprint-38/affordance-records.json` |
| Sprint 38 architecture | `docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md` |

---

## 10. Ready-to-paste next-chat prompt

```text
We have completed Sprint 38. The pedagogical visual affordance pipeline works end-to-end and is documented. A materials-fidelity patch improved a Design Page regression where rich materials collapsed into placeholders, but the latest Inflation rerun still shows table fidelity problems such as malformed comma-row list tables (`Scenario 1,,,`) and header/row prose instead of proper table-shaped materials. Before starting Sprint 39 reasoning cue work, we need Sprint 38-B: Learning Design Prompt Architecture and Materials Fidelity Consolidation. Please review docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/CONTEXT-FOR-NEXT-CHAT.md and begin with 38B-1 Prompt Audit, paying special attention to Design Page prompt growth and 38B-4 Materials and Table Fidelity. Do not refactor runtime code yet; start with prompt inventory, taxonomy, risk analysis, and consolidation plan.
```

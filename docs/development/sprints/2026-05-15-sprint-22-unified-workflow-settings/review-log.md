# Sprint 22 review log — Unified Workflow Settings surface

**Pack path:** `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/`  
**Date:** 2026-05-15  
**Status:** **Proposed / ready for charter** — bootstrap only

**Predecessor:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

---

## 2026-05-15 — Bootstrap session

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R22-001 | Sprint 22 follows **closed Sprint 21** | Step-level generic controls exist; aggregation is next operability gap |
| R22-002 | **Unified Settings** = workflow + **included-step** parameters only | No global pack catalogue |
| R22-003 | UI model **`[Run] [Settings] [Edit]`** | Clear separation: execute / tune / implement |
| R22-004 | Settings is a **mode**, not a modal | Durable tuning surface; room for grouped layout |
| R22-005 | **Prompts outside** unified Settings | Sprint 21 prompt authority; avoid persistence ambiguity |
| R22-006 | **Prose brief not primary** after synthesis | Parameters + drafts are operational state |
| R22-007 | **Reuse Sprint 21** renderer and persistence | No parameter-semantics rewrite |
| R22-008 | **Fully domain-pack-driven** | Runtime aggregates/renders; packs declare metadata |
| R22-009 | Research pack **frozen** unless chartered | Continuity S1–S13 |
| R22-010 | No implementation in bootstrap | Documentation only |

### Artefacts created

| Artefact | Path |
|----------|------|
| Sprint 22 portable pack | `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/` |
| Fresh-chat bootstrap | [`GPT-bootstrap-sprint-22.md`](GPT-bootstrap-sprint-22.md) |
| Bootstrap alias | [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) |
| Sprint context | [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) |
| Context snapshots placeholder | [`context-files/README.md`](context-files/README.md) |
| Bootstrap thesis | [`sprint-22-bootstrap.md`](sprint-22-bootstrap.md) |
| Index | [`sprint-22-index.md`](sprint-22-index.md) |
| Current state | [`CURRENT-STATE.md`](CURRENT-STATE.md) |
| Handover | [`HANDOVER.md`](HANDOVER.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **149 passed**, 0 failed (docs-only bootstrap).

### Open questions (for Slice 22-1 charter)

1. Where does unified Settings live in Factory chrome — tab, sub-mode, or panel?  
2. Workflow-level `stepParameterControls` vs new `workflowParameterControls` array — pack contract extension?  
3. Migration: replace per-step PF parameter panel vs parallel surfaces during transition?  
4. Multi-domain workflows — which pack(s) supply metadata for aggregation?  
5. Unsaved workflow / design preview — aggregate from draft steps only?  
6. Provenance link targets — unified Settings vs per-step Settings after 22?  

---

---

## 2026-05-15 — Portable bootstrap pack completion

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R22-011 | **`GPT-bootstrap-sprint-22.md`** is authoritative fresh-chat entry | Mirrors Sprint 21 portability |
| R22-012 | **`GPT-BOOTSTRAP-PROMPT.md`** alias for cross-sprint naming parity | Discoverability |
| R22-013 | **`context-files/`** placeholder until slice charters | Bounded snapshots only when needed |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **149 passed**, 0 failed.

---

## 2026-05-15 — Slice 22-1 implementation

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R22-014 | Slice 22-1 = **included-step aggregation only** | Smallest MVP; workflow-level controls deferred to 22-2 |
| R22-015 | Reuse **`renderWorkflowPackParameterControlsSection`** with `onPackParamChange` | No duplicate control DOM; same persistence block |
| R22-016 | Params sync to **hidden step notes** on change; user **Save** persists | Matches existing gather path |
| R22-017 | **`workflowBriefResolution.briefConfig`** preferred; else resolved state | No async load in 22-1 |

### Artefacts

| Artefact | Path |
|----------|------|
| Slice charter | [`slice-22-1-charter.md`](slice-22-1-charter.md) |
| Tests | `tests/unified-workflow-settings.test.js` |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **154 passed**, 0 failed.

---

## 2026-05-15 — Slice 22-1 closeout

### Summary

Slice **22-1** delivered the unified workflow **Settings** mode: `[Run] [Settings] [Edit]` tabs, a pack-agnostic included-step aggregation layer (`collectIncludedWorkflowStepRows`, `aggregateUnifiedWorkflowParameterSections`, `resolveWorkflowBriefConfigForWorkflow`), and reuse of the Sprint 21 pack parameter renderer with `[PRISM_STEP_PARAMS]` persistence via step notes. Prompt editing and workflow-level parameter sections remain out of scope.

### Architectural review

| Check | Result |
|-------|--------|
| Domain-pack agnostic runtime | Pass — metadata-driven aggregation only |
| LD-specific branching in unified path | None |
| Included steps | `canonical_step_id` only |
| Sprint 21 renderer / persistence | Reused, not duplicated |
| Prompts in unified Settings | Not exposed |
| Save semantics | Param changes → step notes DOM; **Save workflow** persists |

### Slice 22-1.1 hardening

| Item | Detail |
|------|--------|
| Tests | Null/missing `briefConfig`; `syncUnifiedWorkflowSettingsToStepNotes` → notes block; documented re-render staleness |
| Charter | Accepted limitations recorded in [`slice-22-1-charter.md`](slice-22-1-charter.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **157 passed**, 0 failed (154 after 22-1 + 3 in 22-1.1).

### Known limitations (accepted for 22-1 / 22-1.1)

- **Workflow-level** pack parameters deferred to **22-2** (metadata contract), not included in 22-1.
- Saved workflows without persisted `workflowBriefResolution.briefConfig` may show **empty Settings** until pack config is recovered — **brief-config recovery should start 22-2**.
- **Settings re-render** reads in-memory workflow params; after an unsaved unified control change, DOM step notes hold the new values but re-entering Settings may **mis-display** until Save or a follow-up fix.

### Status

**Slice 22-1 closed** (with **22-1.1** hardening). **157 tests.** Next: **22-2** — start with **async brief-config recovery**, then workflow-level parameter metadata when pack contract is ready.

---

## 2026-05-15 — Slice 22-2a async brief-config recovery

### Summary

When unified **Settings** opens a saved workflow with included steps but no persisted `workflowBriefResolution.briefConfig`, runtime loads pack metadata via `WorkflowGenerationContext.getWorkflowBriefConfig` using `workflow.selectedDomains`, caches it in session, renders controls, and persists `briefConfig` on next **Save** (while preserving existing `workflowBriefResolution`).

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R22-018 | **Session cache** + **Save persistence** | Immediate Settings UX; durable after explicit Save |
| R22-019 | Reuse **`getWorkflowBriefConfig`** | Same path as Factory; pack-agnostic |
| R22-020 | **Load-seq guard** on async render | Avoid stale UI when switching workflows/modes |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **161 passed**, 0 failed (baseline **157** + **4** recovery tests).

---

## Status

**Slice 22-1 / 22-1.1 closed.** **Slice 22-2a** implemented (brief-config recovery). **Slice 22-2b** uses `briefConfig.workflowParameterControls` (see below).

---

## 2026-05-15 — Slice 22-2b workflowParameterControls contract

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R22-021 | Workflow-scoped metadata = **`workflowBriefConfig.workflowParameterControls`** | Sibling to `stepParameterControls`; no better repo convention found |
| R22-022 | Persist via **`[PRISM_STEP_PARAMS]` in `workflow.notes`** | Same block format as step notes; no new semantics |
| R22-023 | LD pilot: **`delivery_context`** | Maps to existing `mappingRules` workflow constraint |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **163 passed**, 0 failed.

---

## Status

**Slices 22-1, 22-1.1, 22-2a, 22-2b (workflow-level controls)** implemented. **163 tests.**

---

## 2026-05-15 — Slice 22-2c hardening

### Summary

DOM-first parameter read when the selected workflow is active; partial `briefConfig` merge on Save via `mergeRecoveredBriefConfigIntoResolution`; canonical-step pack discovery when `selectedDomains` is missing or general-only.

### Verification

**Result:** **170 passed**, 0 failed.

---

## 2026-05-15 — Slice 22-3 navigation and discoverability

### Summary

`[Run] [Settings] [Edit]` mode chrome with aria-selected, Settings badge (visible control count), persistent save hint, planning/provenance links open unified Settings (not Prompt Factory). `discoverPackBriefConfigForWorkflow` scores all structured packs against included `canonical_step_id` values.

### Verification

**Result:** **180 passed**, 0 failed.

---

## 2026-05-15 — LD metadata coverage expansion (pack layer)

### Root cause (review)

**Not a runtime bug.** Unified Settings recovered and aggregated correctly; the badge showed **8** because the LD pack only declared **7** `stepParameterControls` + **1** `workflowParameterControl` (`delivery_context`). Steps such as `step_model_knowledge` and `step_design_learning_activities` had Prompt Factory `userOptions` and `mappingRules` targets but **no** `stepParameterControls` entries until this expansion.

`step_model_learning_outcomes` is **not** a pack canonical ID (use `step_define_learning_outcomes`).

### Pack additions (`domain-learning-design-step-patterns.md`)

| Layer | Added | Source in pack semantics |
|-------|--------|---------------------------|
| **workflowParameterControls** | `design_scope`, `input_strategy`, `duration_minutes` | `requiredFactors` / `optionalFactors` + `mappingRules` → workflow constraints |
| **stepParameterControls** | +18 controls across 6 canonical step IDs | Prompt Factory `userOptions`, `optionalFactors`, and `mappingRules` `stepParams.*` targets |

**Totals:** **4** workflow + **25** step declared controls (**29** metadata rows; **19** visible on a typical 6-step LD diagnostic fixture with one intentionally unmatched step).

### Architectural review (post-expansion)

| Check | Result |
|-------|--------|
| Runtime domain-pack agnostic | **Pass** — `discoverPackBriefConfigForWorkflow` iterates manifest structured domains; no LD branches in unified Settings paths |
| Controls pack-declared, not runtime-derived | **Pass** — only `workflowBriefConfig.workflowParameterControls` / `stepParameterControls` |
| No `mappingRule` auto-promotion | **Pass** — `mappingRules` used only as documentation source when authoring metadata; not read to synthesize Settings controls |
| New workflow controls semantics | **Pass** — select/number types with choices from brief factors; map to existing constraint keys |
| `canonicalStepId` values | **Pass** — all match WGC slugified step pattern titles (`step_normalize_content`, `step_model_knowledge`, etc.) |
| `step_generate_learning_content` | **Pass** — intentionally unmatched; diagnostics: *"No pack-declared stepParameterControls matched… The domain pack may not declare Settings controls for these canonical step IDs."* |
| Badge vs rendered controls | **Pass** — `countUnifiedWorkflowVisibleParameterControls` drives badge; hidden controls excluded |
| Stale recovered cache | **Pass** (post-review fix) — `shouldRefreshRecoveredBriefConfigForUnifiedSettings` re-fetches when session cache under-covers included canonical IDs; page reload always loads fresh pack files; Save merges via 22-2c |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **185 passed**, 0 failed (183 after metadata expansion + 2 cache-refresh tests from post-expansion review).

### Accepted limitations

- Steps remain unsupported **only** where the pack declares no `stepParameterControls` (e.g. `step_generate_learning_content`).
- Steps without `canonical_step_id` are not included.
- Research pack has no `stepParameterControls` pilot.
- Persisted partial `briefConfig` with full canonical **coverage** but fewer controls per step than the live pack may not re-augment until Save or a future charter (union fills gaps only when canonical coverage score is incomplete).

---

## Status (Sprint 22)

| Slice | Status |
|-------|--------|
| 22-1 / 22-1.1 | **Closed** |
| 22-2a / 22-2b / 22-2c | **Closed** |
| 22-3 | **Implemented** |
| LD metadata expansion | **Complete** |

**Verification floor:** **185 tests** (use **183+** as metadata-expansion baseline; +2 cache-refresh tests from this review).

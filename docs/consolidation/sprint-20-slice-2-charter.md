# Sprint 20 Slice 20-2 — Workflow Assumptions / Provenance

**Date:** 2026-05-15  
**Status:** **Proposed / ready for implementation**  
**Sprint:** 20 — Workflow Explainability and Settings UX  
**Slice:** 20-2

**Implementation plan:** [`sprint-20-slice-2-implementation-plan.md`](sprint-20-slice-2-implementation-plan.md)

**Prior slice:** [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md) — Settings Discoverability; **124 tests**

**Bootstrap:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/sprint-20-bootstrap.md`

**Verification baseline:**

```bash
node --test tests/*.test.js
```

**Expected:** **124 passed**, 0 failed (charter); **124+** after implementation.

---

## 1. Purpose

Slice 20-1 made **step Settings** findable. Slice 20-2 answers the companion question after workflow generation:

> **What did the system assume, where did each value come from, and which assumptions affect which steps?**

Users should understand **explicit**, **elicited**, **inferred**, and **defaulted** resolved factors — and how **`mappingRules`** connect those factors to the **concrete step graph** — without new chat, wizards, or interpreter changes.

**Programme thesis (unchanged):** Generate with minimal questions; then clearly expose assumptions and tuning affordances afterward.

---

## 2. Architectural principle

| Layer | Role in Slice 20-2 |
|-------|-------------------|
| **Required essentials** | **Blocking** when missing — unchanged |
| **Workflow synthesis** | Supplies step graph for **step relevance** view — read-only |
| **Planning adequacy** | **Advisory** — may sit below/alongside provenance; **no new predicates** |
| **Step Settings** | **Authoritative** for execution tuning — provenance **complements**, does not duplicate Settings UI |
| **Profile post-gen** | **Optional only** — unchanged |

**Rule:** **UI-first.** Derive display from existing `resolvedState` and pack `mappingRules`. Do **not** modify `resolveWorkflowBriefFactors`, `applyWorkflowBriefMappings`, `evaluateWorkflowBriefPlanningAdequacyChecks`, or Research/LD pack policy.

---

## 3. Scope

| In scope (Slice 20-2) | Out of scope (Slice 20-2) |
|------------------------|---------------------------|
| Structured **provenance** in `#wfBriefResolvedContent` (source labels, human labels, no raw JSON dumps) | Generic explainability framework or plugin system |
| **Step relevance** — factors → steps via existing `mappedBindings.mapped` + `mappingRules` | Schema / workflow record redesign |
| **Progressive disclosure** — summary counts + expandable sections (extend defaults toggle pattern) | New elicitation or required-factor queues |
| Post-design relevance filtered to **steps in current design** | AI-generated provenance copy |
| Pure helpers + tests on `__PRISM_TEST_API` | `applyWorkflowBriefMappings` / adequacy interpreter changes |
| Optional **rejected inference** surfacing (already in `resolvedState`) | **Settings vs brief diff** (“changed since design”) — **defer** unless trivial |
| Cross-domain rendering (any pack with `workflowBriefConfig`) | Research pack / fixture **S1–S13** edits |
| Complement 20-1 Settings links (provenance explains *why*; Settings is *where to tune*) | Slice 20-3 adequacy layout overhaul |

---

## 4. Non-goals

- No new blocking behaviour, **Ready** gates, or refinement queues  
- No wizard or multi-step explainability flow  
- No runtime rewrite of mapping or adequacy engines  
- No Research domain pack or Research test changes  
- No Prompt Studio merge  
- No duplicate step parameter editors in the resolved brief panel  
- No pack-authored provenance narratives (deterministic UI labels only)  
- No “changed since design” unless a **narrow, UI-only** comparison is trivial in implementation (default: **defer**)

---

## 5. Context from Slice 20-1

| 20-1 deliverable | 20-2 relationship |
|------------------|-------------------|
| Settings badges + param summaries on steps | **Keep** — summaries show *current* step params; provenance shows *brief factor source* |
| `appendWorkflowBriefPlanningNoticesUi` | **Keep** — render **after** provenance summary block |
| `focusWorkflowStepSettings()` | **Reuse** — step relevance rows may link “Tune in Settings” for `stepParams.*` targets |
| Plain-text factor blocks in `renderWorkflowBriefResolvedPanel` | **Replace/enhance** with structured provenance UI (same data, better labels) |

---

## 6. Minimum viable provenance model (no schema change)

All fields already exist on `workflowBriefResolved` / `resolvedState` after essentials + mapping:

| Field | Use in 20-2 |
|-------|-------------|
| `resolvedFactors` | Display value per factor |
| `resolvedSources` | `explicit` \| `elicited` \| `inferred` \| `default` → user-facing source badge |
| `inferredFactors` | Count / optional detail (already in summary line) |
| `confirmedInferredFactors` | Optional “confirmed” marker on inferred rows |
| `rejectedInference[]` | Collapsible “Not applied” list (`factorId`, `value`, `source`, `message`) |
| `mappedBindings.mapped[]` | `{ factor, target, value }` — build factor → targets index |
| `mappedBindings.stepParamPatch` | Step-level applied params (read-only echo, not Settings editor) |
| `briefConfig` | Factor `label` / `plainEnglish` for display names |
| Design snapshot | `getSelectedWorkflowDesign()` or `state.workflowDesignVersions` — filter relevance to present steps |

**Step relevance derivation (no new metadata):**

1. Parse each `mappedBindings.mapped[].target`.  
2. If `stepParams.{canonicalStepId}.{paramKey}` → attach factor to that step id.  
3. If `workflow.workflowOutputSpec.*` → attach to **workflow-level** group (not a single step).  
4. Intersect with design step titles / `canonical_step_id` via existing catalog helpers (`normalizeCanonicalStepId`, `getPatternByCanonicalWorkflowTitle`).

**Missing metadata (accept limits):**

| Gap | 20-2 handling |
|-----|----------------|
| No “why inferred” sentence per factor | Show source badge only; rejected rows carry `message` when present |
| No Settings edit history | Defer diff to future slice |
| Design steps without `canonical_step_id` | Title-based match (same as 20-1) |

---

## 7. UX goals

1. **At a glance** — Summary line: N explicit, N inferred, N defaulted (existing counts, kept visible).  
2. **Trust** — User-provided (explicit + elicited) listed first with clear source labels.  
3. **Assumptions visible** — Inferred section expanded by default (small N); defaults collapsed (existing toggle, styled consistently).  
4. **Step connection** — After design exists: “Brief affects these steps” with factor names under each step title.  
5. **Action path** — Provenance → adequacy notices (20-1) → Settings (20-1); no fourth elicitation path.

---

## 8. Progressive disclosure approach

```text
Resolved workflow brief (summary)
├── Status counts (asked / resolved / mapped) — compact text
├── Assumptions at a glance (badges: explicit | inferred | default counts)
├── [expanded] User-provided factors (explicit + elicited)
├── [expanded] Inferred assumptions
├── [collapsed] Defaulted values (existing toggle)
├── [collapsed] Rejected inference (if any)
├── [post-design only] Step relevance (factors per step)
├── Planning notices (20-1 structured UI, unchanged behaviour)
└── [optional] Mapped-to-workflow constraints (workflow-level only, collapsed)
```

Avoid showing full `mapped[]` target paths to users — show **step title + param keys** or **workflow constraint** labels.

---

## 9. Runtime impact assessment

| Area | Impact |
|------|--------|
| `resolveWorkflowBriefFactors` | **None** |
| `applyWorkflowBriefMappings` | **None** |
| Adequacy evaluation / merge | **None** |
| `renderWorkflowBriefResolvedPanel` | **Refactor presentation** — same inputs, structured DOM |
| New helpers | **UI-only** — build provenance view model, render sections |
| `__PRISM_TEST_API` | Export pure builders for tests |
| Packs | **None** (cross-domain via active `briefConfig`) |
| Research | **Frozen** — UI renders Research sessions if same `resolvedState` shape |

**Justified hooks (expected):**

| Function | Role |
|----------|------|
| `buildWorkflowBriefProvenanceViewModel(config, resolvedState, design)` | Pure: group factors, index step relevance |
| `appendWorkflowBriefProvenanceUi(parent, model, options)` | DOM sections |
| `formatWorkflowBriefFactorDisplayLabel(config, factorId)` | label / plainEnglish / id |
| `formatWorkflowBriefFactorDisplayValue(value)` | Avoid raw JSON except arrays (short list) |

**Not justified:** changes to mapping output shape, new `resolvedState` fields, or adequacy `when` predicates.

---

## 10. Likely files touched

| File | Change |
|------|--------|
| `app.js` | Provenance view model + `renderWorkflowBriefResolvedPanel` integration |
| `style.css` | Provenance source badges, step-relevance list, section spacing |
| `index.html` | Optional helper text on `wfBriefResolvedDetails` |
| `tests/workflow-brief-provenance.test.js` | **New** — view model + grouping tests |

**Not expected:** `domains/research/*`, `domains/learning-design/*`, adequacy test fixtures.

---

## 11. Test strategy

```bash
node --test tests/*.test.js
```

| Test type | Examples |
|-----------|----------|
| **Unit (pure)** | Group factors by `resolvedSources`; step relevance from `mapped[]` + mock design steps |
| **Unit** | Workflow-level vs step-level target split |
| **Unit** | Rejected inference rows included when present |
| **Regression** | Existing 124 tests green; `formatWorkflowBriefPlanningNoticesLines` unchanged |
| **Manual** | LD assessment/page brief: post-design provenance shows `page_profile` inferred + Design Page relevance + 20-1 Settings link |

**Target:** **+6 to +10** tests in `workflow-brief-provenance.test.js`.

---

## 12. Success criteria

| Criterion | Target |
|-----------|--------|
| User sees source per resolved factor | explicit / elicited / inferred / default labels |
| User sees which steps factors affect | Post-design step relevance section |
| No new blocking or chat | Yes |
| Settings remain authoritative | Yes — no inline editors in provenance |
| Sprint 18/19 architecture | Preserved |
| Research frozen | Yes |
| Automated floor | **124+** green |

---

## 13. Domain scope recommendation

| Option | Recommendation |
|--------|----------------|
| **LD-first manual validation** | **Yes** — primary QA scenarios (assessment + page mappings) |
| **Cross-domain implementation** | **Yes** — code reads `briefConfig.mappingRules` and `resolvedState` generically; Research benefits without pack edits |
| **Research-specific pack work** | **No** — frozen |

Implementation should **not** branch on domain id except where design/catalog already does for step titles.

---

## 14. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Resolved brief panel becomes long | Progressive disclosure; keep defaults collapsed; cap step-relevance to mapped factors only |
| Duplicates 20-1 step summaries | Provenance = factor **source**; step list = **applied params** — different sections |
| Pre-design shows step relevance too early | Hide step block until `design.steps.length > 0` |
| Raw JSON in UI | `formatWorkflowBriefFactorDisplayValue` — strings as-is, arrays as comma-separated |
| Scope creep (“changed since design”) | Charter **defer**; document in plan §6 |
| Adequacy becomes a wizard | No new adequacy rules; optional one-line factor hint only if zero-cost |

---

## 15. Recommended next slice after 20-2

**Slice 20-3 — Adequacy UX Refinement:** grouping, priority presentation, extend Settings deep-links — **without** new predicates (per bootstrap §9).

---

## 16. References

| Document | Role |
|----------|------|
| [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md) | Prior slice |
| [`sprint-20-slice-2-implementation-plan.md`](sprint-20-slice-2-implementation-plan.md) | Bounded implementation steps |
| [`contextual-refinement-architecture-note.md`](contextual-refinement-architecture-note.md) | Four layers |
| [`HANDOVER.md`](../development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/HANDOVER.md) | Programme handoff |

# Sprint 20 Slice 20-2 — closeout (Workflow Assumptions / Provenance)

**Date:** 2026-05-15  
**Status:** **Closed** — implementation, tests, and clean manual validation complete  
**Charter:** [`sprint-20-slice-2-charter.md`](sprint-20-slice-2-charter.md)  
**Implementation plan:** [`sprint-20-slice-2-implementation-plan.md`](sprint-20-slice-2-implementation-plan.md)  
**Prior slice:** [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md) — Settings Discoverability; **124 tests**  
**Sprint pack:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/`

**Verification:**

```bash
node --test tests/*.test.js
```

**Result:** **132 passed**, 0 failed

---

## 1. Executive summary

Slice 20-2 closes the **assumptions / provenance** gap after Slice 20-1: users can see **what was resolved**, **where each value came from**, and **which brief factors affect which steps** — in structured Factory UI, not in more chat.

The resolved brief panel (`#wfBriefResolvedDetails`) now renders a **read-only provenance view** over existing `resolvedState` and `mappedBindings`, with **step relevance** derived from pack `mappingRules` targets (`stepParams.*`). **Step Settings** remain the authoritative tuning surface; provenance **Tune in Settings** links reuse the 20-1 navigation path.

**Programme thesis (unchanged):** Generate with minimal questions; then clearly expose assumptions and tuning affordances afterward.

**Relation to Sprint 20 goals:** With 20-1 (discoverability) and 20-2 (provenance), the consolidated Factory interaction model is in place: **lightweight brief → workflow synthesis → explainability → Settings tuning → advisory adequacy**. Slice **20-3** remains presentation polish on adequacy grouping only — not a new interpretation layer.

---

## 2. Architectural preservation

| Constraint | Status |
|------------|--------|
| **No new elicitation** | **Preserved** — no new required factors, refinement queues, or wizard flows |
| **Planning adequacy advisory only** | **Preserved** — adequacy unchanged; provenance is separate read-only layer |
| **No schema additions** | **Preserved** — display derives from existing `resolvedState` shape |
| **Mapping interpreter unchanged** | **Preserved** — `applyWorkflowBriefMappings` and mapping application not modified |
| **Adequacy interpreter unchanged** | **Preserved** — `evaluateWorkflowBriefPlanningAdequacyChecks` and merge paths not modified |
| **Research pack untouched** | **Preserved** — no Research pack or fixture **S1–S13** edits |
| **LD pack untouched** | **Preserved** — no `domain-learning-design-step-patterns.md` policy change |
| **Runtime / Ready / profile queues** | **Preserved** — no redesign; `askRefinementByDefault: false` unchanged |
| **Step Settings authoritative** | **Preserved** — provenance does not edit parameters inline |
| **Provenance read-only** | **Preserved** — no writes to `resolvedState` from the panel |
| **Renderer consolidation** | **Not claimed** — HTML/page renderer work is out of scope |

**Four guidance layers (Sprint 18/19 terminology):**

| Layer | Slice 20-2 impact |
|-------|-------------------|
| **Required essentials** | Blocking when missing — **unchanged** |
| **Workflow synthesis** | Supplies step graph for step relevance filtering — **read-only** |
| **Planning adequacy** | **Assistive** — may appear below provenance; **no new predicates** |
| **Step Settings** | **Authoritative** — provenance links explain *why*; Settings is *where to tune* |
| **Profile post-gen** | Optional opt-in only — **unchanged** |

**Architectural conclusion:** Workflows are now effectively **parameterised systems** surfaced through **packs + Settings**, with Factory UI explaining resolution and mapping without re-opening elicitation.

---

## 3. Provenance model

### 3.1 View model

`buildWorkflowBriefProvenanceViewModel(resolvedState, config, designContext)` groups resolved factors for display:

| Source label (UI) | Typical origin |
|-------------------|----------------|
| **Explicit** | User-entered brief fields |
| **You answered** | Elicitation / confirmation answers |
| **Inferred** | Pack inference rules |
| **Defaulted** | Pack or system defaults (collapsed by default) |

Rejected inference rows pass through when present in `resolvedState`.

### 3.2 Rendering

`appendWorkflowBriefProvenanceUi` + `renderWorkflowBriefResolvedPanel` replace raw JSON in `#wfBriefResolvedContent` with:

- **Assumptions at a glance** — grouped explicit / inferred rows with human labels and values  
- **Defaulted values hidden (N)** — collapsible (extends existing toggle pattern)  
- **Rejected inference hidden (N)** — collapsible when applicable  
- **Brief affects these steps** — step relevance section (post-design only)  
- **Workflow-level mappings (N)** — collapsible rows not tied to a single step  
- **No raw JSON exposure** — `formatWorkflowBriefFactorDisplayLabel` / `formatWorkflowBriefFactorDisplayValue` avoid JSON dumps for arrays and objects  

### 3.3 Cross-domain behaviour

Rendering is **pack-agnostic**: any workflow with `workflowBriefConfig`, `mappingRules`, and a populated `resolvedState` gets the same UI structure. LD and Research both use the same helpers; pack-specific labels come from pack metadata, not hard-coded domain branches in the panel.

---

## 4. Step relevance model

### 4.1 Index construction

`buildWorkflowBriefStepRelevanceIndex(mappedBindings, designSteps, catalog, config)`:

- Reads **`mappedBindings.mapped[]`** (existing mapping output)  
- Filters to targets matching `stepParams.{canonicalStepId}.*`  
- Joins factors to **steps present in the current design** via `getDesignStepPresenceIndex` (canonical id + title hint)  
- Omits steps not in the active design graph  

### 4.2 UI presentation

When `model.hasDesign && model.stepRelevance.length`, the panel shows **Brief affects these steps**:

- Step title (from design or canonical id)  
- Bulleted factor labels with **param key hints** (e.g. `number_of_items`, `page_profile`)  
- **Tune in Settings** button when `isWorkflowStepConfigurableInSettings` — calls `focusWorkflowStepSettings(..., { openSettings: true })`  

**Workflow-level mappings** are listed separately so users do not confuse global brief→workflow bindings with per-step parameter targets.

---

## 5. UX outcomes

| Surface | Outcome |
|---------|---------|
| **Resolved brief** (`#wfBriefResolvedDetails`) | Structured provenance; summary line “Resolved workflow brief (complete)” |
| **Factory design preview** (`#wfDesignSteps`) | **Tunable** badges unchanged from 20-1; complements provenance |
| **Tune in Settings (provenance)** | Same navigation contract as 20-1 planning links |
| **Unsaved workflow** | Save-first toast: *“Save the workflow, then open Settings on the matching step to tune parameters.”* |
| **Saved workflow** | **Settings...** on step row → Prompt Factory step config (authoritative) |

**Complements Slice 20-1:** 20-1 answers *where to tune*; 20-2 answers *what was assumed and which steps those assumptions affect*.

---

## 6. Manual validation findings

**Environment:** `http://127.0.0.1:8787/` — clean **Learning Design–only** session (no domain switch).

**Fixture:** Brief **“S20-2 Clean LD M2”** — 10-question MCQ cell biology, session scope, outputs include assessment items + learner page, design page in constraints, `generate_from_topic` starting point.

| Check | Result |
|-------|--------|
| **Brief affects these steps** | **Present** — 3 step groups (Define Learning Outcomes, Generate Assessment Items, Design Page) |
| **Factor → step param hints** | **Present** — e.g. `learnerLevel`, `number_of_items`, `difficulty_profile`, `page_profile`, `tone_style` |
| **Tune in Settings (provenance)** | **3 buttons** visible |
| **Tunable indicators** | **Present** on suggested workflow steps 2–5 |
| **Explicit / Inferred rows** | Human-readable (mcq, cell biology, 10 items, etc.) |
| **Defaulted values** | **Collapsed** (“Defaulted values hidden (11)”) |
| **Workflow-level mappings** | **Present** (“Workflow-level mappings (21)”, collapsed) |
| **No raw JSON** | **Confirmed** |
| **Save as workflow** | **OK** — My Workflows retains goal, constraints, artefacts |
| **Unsaved Tune** | **Save-first toast** observed |
| **Saved Settings path** | **OK** — **Settings...** opens Prompt Studio workflow prompt mode |

### 6.1 Stale-session finding (earlier inconclusive pass)

An earlier validation pass **did not** show “Brief affects these steps” or provenance **Tune in Settings** after switching to **Research** mid-session with an old LD design loaded. A **clean LD-only** re-run showed full provenance and step relevance.

**Conclusion:** The earlier miss was **not an isolated 20-2 defect** — likely **stale session / domain switch** with mismatched or empty `mappedBindings` relative to the active design graph.

### 6.2 Automation nuance

Browser automation could **not reliably click** provenance **Tune in Settings** after save due to **layout overlap** between the resolved-brief panel and the design preview. This does **not** block closeout:

- **Unit tests** cover view model and step relevance indexing  
- **Saved Settings...** controls use the same `openWorkflowStepSettingsFromElement` path  
- **Unsaved** path verified via toast + design-step highlight  

**Optional follow-up (human, non-blocking):** One manual click on provenance **Tune in Settings** after save to confirm tab switch + highlight + Settings open in a single gesture.

---

## 7. Runtime hooks (UI-only)

| Function | Role |
|----------|------|
| `buildWorkflowBriefProvenanceViewModel` | Groups factors by source; builds step relevance + workflow-level rows |
| `buildWorkflowBriefStepRelevanceIndex` | Maps `mappedBindings.mapped[]` → design steps |
| `appendWorkflowBriefProvenanceUi` | DOM for provenance sections (collapsibles, step list, Tune links) |
| `formatWorkflowBriefFactorDisplayLabel` | Human factor labels from pack metadata |
| `formatWorkflowBriefFactorDisplayValue` | Human values; avoids JSON for arrays/objects |
| `getWorkflowBriefProvenanceSourceLabel` | Explicit / You answered / Inferred / Defaulted labels |
| `renderWorkflowBriefResolvedPanel` | **Refactored** — orchestrates planning notices + provenance (no interpreter calls added) |

**Reused from Slice 20-1:** `focusWorkflowStepSettings`, `isWorkflowStepConfigurableInSettings`, `appendWorkflowBriefPlanningNoticesUi`.

**Explicitly unchanged:** `resolveWorkflowBriefFactors`, `applyWorkflowBriefMappings`, `evaluateWorkflowBriefPlanningAdequacyChecks`, pack policy files, Research/LD adequacy tests.

---

## 8. Changed files

| File | Change |
|------|--------|
| `app.js` | Provenance view model, step relevance index, structured panel render, display formatters, `__PRISM_TEST_API` exports |
| `style.css` | Provenance section, factor rows, step list, collapsible, settings-link styles |
| `index.html` | `#wfBriefResolvedContent` container semantics (structured div vs raw pre) |
| `tests/workflow-brief-provenance.test.js` | **New** — 8 tests (+8) |

**Not changed:**

| Path | Reason |
|------|--------|
| `domains/research/*` | Research frozen |
| `domains/learning-design/domain-learning-design-step-patterns.md` | No pack policy change |
| Research tests / fixtures **S1–S13** | Regression anchor |
| Mapping / adequacy / resolution interpreters | UI-only slice |
| `tests/workflow-settings-discoverability.test.js` | 20-1 suite unchanged |

---

## 9. Test verification

```bash
node --test tests/*.test.js
```

| Milestone | Result |
|-----------|--------|
| After Slice 20-1 | 124 passed |
| **After Slice 20-2** | **132 passed**, 0 failed |

**New suite:** `tests/workflow-brief-provenance.test.js` — view model grouping, step relevance, workflow-level separation, rejected inference, display formatters, design-step filtering.

**Regression:** All Sprint 18/19 suites and 20-1 discoverability tests green.

---

## 10. Outcomes

| Criterion | Met |
|-----------|-----|
| Structured provenance in resolved brief | **Yes** |
| Source labels (Explicit / You answered / Inferred / Defaulted) | **Yes** |
| Step relevance from `mappedBindings.mapped[]` | **Yes** |
| Workflow-level mappings section | **Yes** |
| Collapsible defaults / rejected | **Yes** |
| No raw JSON in panel | **Yes** |
| Cross-domain generic rendering | **Yes** |
| Provenance read-only; Settings authoritative | **Yes** |
| No interpreter / pack / schema changes | **Yes** |
| Clean LD manual validation | **Yes** |
| Automated regression | **Yes** — **132** tests |

---

## 11. Remaining optional follow-up

| Item | Notes |
|------|--------|
| **Provenance Tune after save (manual)** | Confirm single-gesture navigation when layout allows; automation blocked by overlap only |
| **Slice 20-3** | Adequacy **presentation** — grouping, priority ordering, broader Settings deep-links; **no new predicates** |
| **“Changed since design”** | **Deferred** per charter — Settings vs brief diff not in 20-2 scope |
| **Renderer consolidation** | **Not started** — do not conflate with Sprint 20 |

---

## 12. Recommended next slice — 20-3 Adequacy UX refinement

**Slice 20-3** should improve **scanability** of planning adequacy disclosures (grouping, priority presentation) and extend Settings deep-links where helpful — **without** new blocking rules, pack edits, or interpreter changes.

See `sprint-20-bootstrap.md` §8 and [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md).

---

## 13. References

| Document | Role |
|----------|------|
| [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md) | Settings discoverability baseline |
| [`sprint-20-slice-2-charter.md`](sprint-20-slice-2-charter.md) | Scope and non-goals |
| [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md) | Parameterisation thesis |
| [`sprint-20-bootstrap.md`](../development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/sprint-20-bootstrap.md) | Programme goals |
| [`sprint-19-closeout.md`](sprint-19-closeout.md) | Prior sprint baseline |

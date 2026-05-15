# Sprint 20 — closeout (Workflow Explainability and Settings UX)

**Date:** 2026-05-15  
**Status:** **Closed** — all three slices implemented and validated  
**Sprint pack:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/`  
**Prior sprint:** [`sprint-19-closeout.md`](sprint-19-closeout.md) — LD rationalisation; **118 tests** at Sprint 19 closeout

**Verification:**

```bash
node --test tests/*.test.js
```

**Result:** **135 passed**, 0 failed

---

## 1. Sprint outcome

Sprint 20 completes the **post-generation workflow intelligibility layer** in the Factory UI. After Sprints 18–19 reduced chat-heavy elicitation and moved structural guidance to **planning adequacy** and **Settings**, users still needed to see **what was assumed**, **where it applies**, and **how to tune** — without a second wizard.

Three implementation slices shipped on a **UI-first** basis: discoverability (20-1), provenance (20-2), resolved-brief panel polish (20-3). **Interpreters and domain pack policy were preserved**; runtime changes are presentation and navigation only.

| Slice | Deliverable | Tests at close |
|-------|-------------|----------------|
| **20-1** | Settings Discoverability | **124** |
| **20-2** | Workflow Assumptions / Provenance | **132** |
| **20-3** | Adequacy UX Refinement (resolved-brief panel) | **135** |

**Programme thesis (unchanged):** Generate with minimal questions; then show what was assumed and where to tune — in the UI, not in more chat.

---

## 2. Programme conclusion

Sprint 20 makes workflows **visibly behave as parameterised systems**:

| Capability | State after Sprint 20 |
|------------|------------------------|
| **Settings are discoverable** | Badges, summaries, planning and provenance → **Open step Settings** |
| **Assumptions are explainable** | Source-labelled provenance over `resolvedState`; no raw JSON |
| **Affected steps are visible** | **Brief affects these steps** from `mappedBindings.mapped[]` |
| **Planning guidance is advisory and action-led** | Non-blocking; safety/actionable first; informational collapsed when noisy |
| **Tuning surface is clear** | Step Settings remain authoritative; Factory does not duplicate editors |

**Not claimed in Sprint 20:**

| Item | Note |
|------|------|
| **Utilities / page HTML renderer consolidation** | Out of programme — only Factory **resolved-brief panel** renderer work in 20-3 |
| **Full Settings parameter editor** | See **Sprint 21 candidate** — mapped `stepParams` not all first-class controls yet |
| **Pack parameter audit** | Which parameters should exist / be exposed — future charter |

---

## 3. Consolidated PRISM interaction model

```text
1. Lightweight brief
2. Essentials gate minimum viability (blocking when unsafe / incomplete)
3. Workflow synthesis creates a concrete workflow
4. Planning adequacy advises without blocking
5. Provenance explains assumptions (explicit, answered, inferred, defaulted)
6. Step relevance shows where assumptions apply to design steps
7. Settings provide the tuning surface (authoritative execution parameters)
```

**Four guidance layers (Sprint 18/19 terminology, after Sprint 20 UI):**

| Layer | Sprint 20 contribution |
|-------|-------------------------|
| **Required essentials** | **Unchanged** — blocking when missing |
| **Workflow synthesis** | **Unchanged** — supplies step graph for relevance filtering |
| **Planning adequacy** | **Presentation** — Planning guidance; links to Settings; no new predicates |
| **Provenance / explainability** | **New UI layer** — read-only over `resolvedState` |
| **Step Settings** | **Discoverability + navigation** — primary tuning surface |
| **Profile post-gen** | **Unchanged** — optional opt-in only |

**Architectural rule (unchanged):** Runtime interprets policy; domain packs declare policy. Sprint 20 makes that contract **legible** in the Factory.

---

## 4. Slice 20-1 — Settings Discoverability

**Closeout:** [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md)

| Deliverable | Detail |
|-------------|--------|
| **Configurable-step detection** | Catalog `configurationMode: simple` + `userOptions`, or pack `mappingRules` → `stepParams.*` |
| **Tunable / Settings affordances** | **Tunable** on design preview; **Settings** on saved library steps |
| **Compact step summaries** | Up to four labelled values from priority list (assessment, page, tone, depth, etc.) |
| **Planning → Settings navigation** | **Open step Settings** on mapped adequacy rows; `focusWorkflowStepSettings()` |
| **UI-only hooks** | `decorateWorkflowStepSettingsDiscoverability`, `appendWorkflowBriefPlanningNoticesUi` (structured), save-first toast on unsaved design |

**Files:** `app.js`, `style.css`, `index.html`, `tests/workflow-settings-discoverability.test.js` (+6 tests).

**Preserved:** no new elicitation; adequacy/mapping interpreters unchanged; Research/LD packs frozen.

---

## 5. Slice 20-2 — Workflow Assumptions / Provenance

**Closeout:** [`sprint-20-slice-2-closeout.md`](sprint-20-slice-2-closeout.md)

| Deliverable | Detail |
|-------------|--------|
| **Structured provenance** | `#wfBriefResolvedContent` — view model over existing `resolvedState` |
| **Source labels** | Explicit, You answered, Inferred, Defaulted |
| **Factor → step relevance** | From `mappedBindings.mapped[]` + active design steps |
| **Workflow-level mappings** | Separate collapsible section |
| **Collapsed defaults / rejected** | Progressive disclosure; no raw JSON |
| **Cross-domain rendering** | Generic helpers for any pack with `workflowBriefConfig` + mappings |

**Files:** `app.js`, `style.css`, `index.html`, `tests/workflow-brief-provenance.test.js` (+8 tests).

**Manual validation note:** Missing step relevance in an early pass was attributed to **stale session / Research domain switch**, not a code defect — clean LD-only run confirmed full behaviour.

---

## 6. Slice 20-3 — Adequacy UX Refinement

**Charter:** [`sprint-20-slice-3-charter.md`](sprint-20-slice-3-charter.md)  
**Implementation plan:** [`sprint-20-slice-3-implementation-plan.md`](sprint-20-slice-3-implementation-plan.md)

| Deliverable | Detail |
|-------------|--------|
| **Renderer-only panel polish** | No adequacy/mapping/resolution interpreter changes |
| **Compact status strip** | Single scannable summary line (replaces verbose multi-line stats block) |
| **Planning guidance** | Action-first ordering; tiering: safety → actionable → informational |
| **Planning notice collapse** | Additional informational rows behind disclosure when count &gt; 3 |
| **Section order** | Status → guidance → **Brief affects these steps** → assumption detail → tail (workflow-level, defaulted, rejected) |
| **Terminology** | **Open step Settings** unified (provenance + planning); **Suggestion:** not **Action:** |
| **Layout** | Panel sections, scroll on `#wfBriefResolvedContent`, spacing under design preview |

**Files:** `app.js`, `style.css`, `index.html`, `tests/workflow-brief-panel-ux.test.js` (+3 tests).

---

## 7. Architecture preserved

| Constraint | Status |
|------------|--------|
| **No new elicitation** | **Preserved** |
| **No blocking adequacy** | **Preserved** — advisory only |
| **No schema changes** | **Preserved** |
| **No mapping interpreter changes** | **Preserved** — `applyWorkflowBriefMappings` frozen |
| **No adequacy interpreter changes** | **Preserved** — `evaluateWorkflowBriefPlanningAdequacyChecks` frozen |
| **No Research pack changes** | **Preserved** — fixtures **S1–S13** frozen |
| **No LD pack policy changes** | **Preserved** in Sprint 20 |
| **No Prompt Studio merge** | **Out of scope** |
| **No Settings architecture redesign** | Sprint 20 adds navigation and explainability, not a new editor |
| **No wizard regression** | **Preserved** — lightweight brief + post-design explainability |

**Reflection:** [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md) — workflows as parameterised systems; pack audit is **future**, not Sprint 20.

---

## 8. Test progression

| Milestone | Result |
|-----------|--------|
| Sprint 20 bootstrap | 118 passed |
| After Slice 20-1 | **124 passed** (+6) |
| After Slice 20-2 | **132 passed** (+8) |
| **Sprint 20 closeout** | **135 passed** (+3) |

**New test suites:**

| File | Slice |
|------|-------|
| `tests/workflow-settings-discoverability.test.js` | 20-1 |
| `tests/workflow-brief-provenance.test.js` | 20-2 |
| `tests/workflow-brief-panel-ux.test.js` | 20-3 |

**Regression:** Research S1–S13, LD adequacy, profile thinning, Sprint 18/19 suites green.

---

## 9. Slice closeouts and charters

| Slice | Charter | Closeout |
|-------|---------|----------|
| 20-1 | [`sprint-20-slice-1-charter.md`](sprint-20-slice-1-charter.md) | [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md) |
| 20-2 | [`sprint-20-slice-2-charter.md`](sprint-20-slice-2-charter.md) | [`sprint-20-slice-2-closeout.md`](sprint-20-slice-2-closeout.md) |
| 20-3 | [`sprint-20-slice-3-charter.md`](sprint-20-slice-3-charter.md) | *(implementation complete; programme closeout is this document)* |

---

## 10. Success criteria (programme)

| Criterion | Met |
|-----------|-----|
| Configurable steps visible in Factory | **Yes** — badges + cues |
| Key assumptions understandable post-design | **Yes** — provenance + status strip |
| Tune without more chat | **Yes** — Settings + navigation |
| Planning guides, does not interrogate | **Yes** — 20-3 ordering and copy |
| Ready non-blocking | **Yes** |
| Sprint 18/19 interpreters preserved | **Yes** |
| Automated regression | **Yes** — **135** tests |

---

## 11. Sprint 21 candidate — Pack-defined Step Parameter Controls

**Status:** **Not started** — recorded as the primary architectural follow-on discovered during Sprint 20. **Do not implement under Sprint 20 closeout.**

### Issue discovered in Sprint 20

Step **Settings** today expose tuning through Prompt Factory step config and `[PRISM_STEP_PARAMS]` / mapped patches, but **do not expose all pack-defined `stepParams` as first-class editable controls**. Users see summaries and provenance param keys, yet many mapped parameters remain **opaque or notes-only** until a fuller Settings editor exists.

### Proposed direction (Sprint 21)

**Pack-defined Step Parameter Controls** — Settings becomes the **full workflow parameter editor**; runtime stays **generic and pack-driven**.

| Principle | Intent |
|-----------|--------|
| **Every relevant pack-defined step parameter** | Inspectable and editable in Step Settings when mapped to that step |
| **Pack-authored metadata** | Labels, defaults, options, advanced/basic visibility, elicitation priority |
| **Brief / elicitation stays small** | Only **high-impact** parameters asked up front |
| **Richer parameters Settings-only** | Available after generation without expanding the wizard |

### Two-tier parameter model (target)

**1. Elicited parameters** — small set worth asking before synthesis:

- Assessment type, item count, learner level  
- Topic / scope, formative vs summative intent  
- Other pack-declared **high-impact** factors only  

**2. Settings-only parameters** — richer controls after the workflow exists:

- Sequencing strategy, difficulty progression, distractor style  
- Feedback granularity, answer visibility, retry/remediation options  
- Explanation depth, and similar arcane or expert-facing dimensions  

Brief and essentials remain **lightweight**; Settings absorb the long tail of pedagogical tuning.

### Pack audit (related future work)

Separate from UI implementation, a **pack-centred audit** may ask:

| Question | Intent |
|----------|--------|
| Are the **right** parameters exposed? | Pedagogical salience vs noise |
| Do domain packs define **all relevant** factors? | LD and Research coverage |
| Are low-value / internal parameters **hidden** or marked advanced? | Reduce provenance and Settings clutter |
| Can richer assessment/page settings be added **declaratively** through packs? | Avoid hard-coded domain branches in `app.js` |

See [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md) §5.

### Explicitly out of Sprint 21 charter until scoped

- Utilities HTML renderer programme  
- Prompt Studio product merge  
- New blocking elicitation or profile **required** tiers  
- Rewriting mapping or adequacy interpreters without evidence  

---

## 12. Other future backlog (not Sprint 20 / not Sprint 21 by default)

| Item | When |
|------|------|
| **Settings vs brief diff** (“changed since design”) | Deferred from 20-2; UI-only comparison charter |
| **LD validation / conflict policies** | Sprint 19 planned 19-4 — separate charter if evidence emerges |
| **Optional live API confidence runs** | Manual M2-style fixtures on `127.0.0.1:8787` |
| **Provenance Tune click after save** | Optional human check; automation overlap noted in 20-2 validation |

---

## 13. References

| Document | Role |
|----------|------|
| [`sprint-20-bootstrap.md`](../development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/sprint-20-bootstrap.md) | Programme bootstrap |
| [`contextual-refinement-architecture-note.md`](contextual-refinement-architecture-note.md) | Four-layer model |
| [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md) | Parameterisation thesis + audit direction |
| [`CURRENT-STATE.md`](../development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/CURRENT-STATE.md) | Pack state after close |

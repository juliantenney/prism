# Sprint 20 review log — Workflow Explainability and Settings UX

**Pack path:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/`  
**Date:** 2026-05-15

---

## 2026-05-15 — Bootstrap session

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R20-001 | Sprint 20 follows **closed Sprint 19** UX gap, not new elicitation | 19 reduced chat; Settings burden increased |
| R20-002 | **UI-first** slices; avoid runtime rewrite unless justified | Preserve 19 `app.js` freeze |
| R20-003 | **Slice 20-1 first** — Settings Discoverability | Highest leverage for tuning without chat |
| R20-004 | **Slice 20-2** — assumptions / provenance | Explain inferred/defaulted values |
| R20-005 | **Slice 20-3** — adequacy UX refinement | Presentation only; stay non-blocking |
| R20-006 | Research **frozen** unless explicitly chartered | Regression anchor S1–S13 |
| R20-007 | No return to heavy **refinementFactors** or profile **required** tiers | Contradicts 18/19 architecture |
| R20-008 | Core principle: **minimal interrogation**, then expose affordances | Programme thesis |

### Artefacts created

- Sprint 20 portable pack (7 files in this folder)

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **118 passed**, 0 failed (docs-only bootstrap).

### Open questions (for Slice 20-1 charter)

1. Badges on step list vs Planning-panel-only affordances?  
2. Minimal `app.js` hooks acceptable for focus/scroll to Settings?  
3. LD-only pilot vs cross-domain Factory behaviour?

---

## 2026-05-15 — Slice 20-1 implementation

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R20-009 | **Badges on both** library step list and `wfDesignSteps` design preview | Users see tunability before and after save |
| R20-010 | **Minimal UI-only hooks** in `app.js` for focus/scroll and Settings open | Charter open question resolved: yes, justified for 1–2 click navigation |
| R20-011 | **Cross-domain** configurability via catalog `configurationMode` + pack `mappingRules` | Not LD-only; Research steps unchanged at pack level |
| R20-012 | **Do not modify** adequacy or mapping interpreters | Preserve Sprint 18/19 architecture; links are presentation-only |
| R20-013 | **Compact summaries** capped at four keys from a fixed priority list | Progressive disclosure; avoid noisy step rows |
| R20-014 | **Structured planning UI** with **Open step Settings** for two LD adequacy ids + action-copy inference | Points adequacy at Settings instead of re-asking factors |
| R20-015 | **Save-first toast** when navigating from planning to unsaved design steps | Settings require persisted workflow step; no fake Settings on design-only rows |
| R20-016 | **Reuse existing Settings...** click path | Settings remain authoritative; no duplicate config surface |

### Implementation notes

- Configurable detection: `configurationMode: simple` + `userOptions`, or `stepParams.{canonicalId}.*` in `mappingRules`.  
- Summary sources: `[PRISM_STEP_PARAMS]` block, `stepParamPatch`, resolved factors via existing mappings.  
- Navigation: `focusWorkflowStepSettings()` → Workflows tab + highlight + `openWorkflowStepSettingsFromElement()`; design-only → Factory tab + toast.  
- Helpers exported on `__PRISM_TEST_API` for `workflow-settings-discoverability.test.js`.

### Artefacts created / updated

| Artefact | Path |
|----------|------|
| Slice 20-1 charter | `docs/consolidation/sprint-20-slice-1-charter.md` |
| Slice 20-1 closeout | `docs/consolidation/sprint-20-slice-1-closeout.md` |
| Tests | `tests/workflow-settings-discoverability.test.js` |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **124 passed**, 0 failed (**+6** from bootstrap floor of **118**).

### Open questions (for Slice 20-2)

1. Show provenance in resolved brief only, or a dedicated assumptions panel?  
2. Should 20-2 detect Settings edits vs mapped brief (“changed since design”)?  
3. Research resolved-brief surfacing without pack changes?

---

## 2026-05-15 — Slice 20-2 implementation

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R20-017 | **Provenance in `#wfBriefResolvedContent`** only — extend resolved brief panel | Reuses existing post-design surface; no second assumptions panel |
| R20-018 | **View model over `resolvedState`** — no interpreter edits | Preserve Sprint 18/19 architecture; UI derives display only |
| R20-019 | **Step relevance from `mappedBindings.mapped[]`** + design step presence index | Explains pack mapping output without re-running mapping logic |
| R20-020 | **Source labels:** Explicit, You answered, Inferred, Defaulted | Deterministic UI copy; no pack-authored narratives |
| R20-021 | **Workflow-level mappings** separate from per-step relevance | Avoid conflating global bindings with `stepParams.*` targets |
| R20-022 | **Defer “changed since design”** | Charter default; Settings vs brief diff not required for 20-2 closeout |
| R20-023 | **Cross-domain generic rendering** | Any pack with `workflowBriefConfig` + mappings; not LD-only |
| R20-024 | **Provenance read-only**; **Settings authoritative** | Tune links navigate only; no inline parameter editors |
| R20-025 | **Reuse `focusWorkflowStepSettings`** for provenance Tune links | Consistent with 20-1; `openSettings: true` on saved workflow |

### Implementation notes

- `renderWorkflowBriefResolvedPanel` refactored to orchestrate planning notices + `appendWorkflowBriefProvenanceUi`.  
- `buildWorkflowBriefProvenanceViewModel` groups factors; filters step relevance to steps in active design.  
- Human display via `formatWorkflowBriefFactorDisplayLabel` / `formatWorkflowBriefFactorDisplayValue` — no raw JSON.  
- Collapsible defaulted and rejected sections extend existing toggle state pattern.  
- Helpers exported on `__PRISM_TEST_API` for `workflow-brief-provenance.test.js`.

### Artefacts created / updated

| Artefact | Path |
|----------|------|
| Slice 20-2 charter | `docs/consolidation/sprint-20-slice-2-charter.md` |
| Slice 20-2 implementation plan | `docs/consolidation/sprint-20-slice-2-implementation-plan.md` |
| Slice 20-2 closeout | `docs/consolidation/sprint-20-slice-2-closeout.md` |
| Tests | `tests/workflow-brief-provenance.test.js` |

### Changed code (runtime / UI)

| File | Role |
|------|------|
| `app.js` | View model, step relevance index, provenance UI, panel render refactor |
| `style.css` | Provenance and collapsible section styles |
| `index.html` | Structured `wfBriefResolvedContent` container |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **132 passed**, 0 failed (**+8** from Slice 20-1 floor of **124**).

---

## 2026-05-15 — Slice 20-2 manual validation

### Procedure

- Environment: `http://127.0.0.1:8787/`  
- **Clean LD-only** session — no domain switch  
- Brief fixture: **“S20-2 Clean LD M2”** — 10-question MCQ cell biology, session, assessment + learner page outputs, design page in constraints, `generate_from_topic`  
- **Design workflow** → **Save as workflow**

### Confirmed

| Check | Result |
|-------|--------|
| **Brief affects these steps** | Present — 3 step groups |
| **Tune in Settings** (provenance) | 3 buttons |
| **Tunable** badges on design steps | Present |
| **Explicit / Inferred** readable values | Present |
| **Defaulted values hidden** | Collapsed |
| **Workflow-level mappings** | Present (collapsed) |
| **No raw JSON** | Confirmed |
| **Unsaved Tune** | Save-first toast |
| **Saved Settings...** | Opens Prompt Studio step config |

### Stale-session finding

An earlier pass **after switching to Research** with an old LD design **did not** show step relevance or provenance Tune buttons. **Clean LD-only re-validation** showed full behaviour.

| Conclusion | Detail |
|------------|--------|
| **Not a 20-2 code defect** | Missing UI likely **stale session / domain switch** with mismatched `mappedBindings` vs design graph |
| **Automation nuance** | Provenance **Tune in Settings** after save not reliably clickable (layout overlap); covered by unit tests + saved **Settings...** path |

### Architectural note (validation)

Manual validation supports the programme conclusion: workflows are **parameterised systems** (packs + `mappingRules` + Settings), with Factory UI now surfacing **resolution provenance** and **step relevance** without additional elicitation.

---

## 2026-05-15 — Slice 20-3 implementation

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R20-026 | **Renderer-only** resolved-brief panel — no interpreter edits | Sprint 20 architecture lock |
| R20-027 | **Compact status strip** replaces verbose multi-line stats | Reduce cognitive load; dedupe counts |
| R20-028 | **Planning guidance** before deep provenance | Action first; adequacy guides, does not interrogate |
| R20-029 | **Planning notice tiers** — safety, actionable, informational | UI sort/collapse only; no new adequacy predicates |
| R20-030 | **Collapse informational planning** when count &gt; 3 | Progressive disclosure |
| R20-031 | **Open step Settings** label everywhere (provenance + planning) | Terminology consistency |

### Implementation notes

- Section order: status → planning guidance → step relevance → assumption detail → tail (workflow-level, defaulted, rejected).  
- `appendWorkflowBriefProvenanceStepRelevanceSection`, `appendWorkflowBriefProvenanceDetailSections`, `appendWorkflowBriefProvenanceTailSections`.  
- Helpers: `buildWorkflowBriefResolvedStatusStrip`, `classifyWorkflowBriefPlanningNoticeRow`, `sortWorkflowBriefPlanningNoticeRows`.  
- Panel scroll and section CSS on `#wfBriefResolvedContent`.

### Artefacts created / updated

| Artefact | Path |
|----------|------|
| Slice 20-3 charter | `docs/consolidation/sprint-20-slice-3-charter.md` |
| Slice 20-3 implementation plan | `docs/consolidation/sprint-20-slice-3-implementation-plan.md` |
| Tests | `tests/workflow-brief-panel-ux.test.js` |

### Changed code (runtime / UI)

| File | Role |
|------|------|
| `app.js` | Panel reorder, planning tiers, status strip, sectioned provenance |
| `style.css` | Panel sections, scroll, planning tier accents |
| `index.html` | Resolved-brief helper copy |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **135 passed**, 0 failed (**+3** from Slice 20-2 floor of **132**).

---

## 2026-05-15 — Sprint 20 programme closeout

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R20-032 | **Sprint 20 closed** after slices 20-1–20-3 | Programme goals A–C met at Factory UX layer |
| R20-033 | **Sprint 21 candidate** — Pack-defined Step Parameter Controls | Mapped `stepParams` not all first-class in Settings yet |
| R20-034 | **Two-tier parameter model** documented for future | Elicited (high-impact) vs Settings-only (rich controls) |
| R20-035 | **Pack audit** deferred | Parameter curation separate from Sprint 20 UI |

### Programme conclusion

Sprint 20 completes post-generation **workflow intelligibility** in the Factory: discoverable Settings, explainable assumptions, visible step relevance, action-led advisory planning. Workflows **visibly** behave as parameterised systems; **full** Settings editing for all pack parameters is **future** work.

### Artefacts created / updated

| Artefact | Path |
|----------|------|
| Programme closeout | `docs/consolidation/sprint-20-closeout.md` |
| Pack updates | `CURRENT-STATE.md`, `HANDOVER.md`, `sprint-20-index.md`, `review-log.md` |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **135 passed**, 0 failed.

### Issue recorded for Sprint 21 (not implemented)

Step Settings do not yet expose all mapped **`stepParams`** as first-class editable controls. Target: pack-defined metadata drives a **full workflow parameter editor** in Settings; brief asks only high-impact parameters upfront.

---

## Status

**Sprint 20 closed** — programme closeout [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md). **Sprint 21 not started.**

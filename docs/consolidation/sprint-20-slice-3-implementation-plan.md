# Sprint 20 Slice 20-3 — implementation plan (Adequacy UX Refinement)

**Date:** 2026-05-15  
**Status:** **Plan only** — no implementation in this document  
**Charter:** [`sprint-20-slice-3-charter.md`](sprint-20-slice-3-charter.md)  
**Prior slice:** [`sprint-20-slice-2-closeout.md`](sprint-20-slice-2-closeout.md) — **132 tests**

**Goal:** Smallest safe path to a **coherent, scannable** resolved-brief panel — **UI-only**; adequacy **guides**, does not **interrogate**.

**Verification before implementation PR:**

```bash
node --test tests/*.test.js
```

**Expected:** **132 passed**, 0 failed

---

## 1. Read-first — current render path

### 1.1 `renderWorkflowBriefResolvedPanel` (today)

```text
#wfBriefResolvedContent
├── .workflow-brief-resolved-stats     (compact text: asked/resolved/mapped + legacy lines)
├── appendWorkflowBriefProvenanceUi    (20-2: glance, explicit/inferred, collapsibles, step relevance, workflow-level)
└── appendWorkflowBriefPlanningNoticesUi (20-1: grouped by category, Open step Settings on mapped rows)
```

**Panel chrome:** `#wfBriefResolvedDetails` summary + helper in `index.html` (20-1/20-2 copy).

### 1.2 Planning notices (unchanged inputs)

| Input | Source |
|-------|--------|
| `resolvedState.planningDisclosures` | `buildWorkflowBriefPlanningDisclosures` — **do not modify builder** |
| Row shape | `message`, `action`, `category`, `blockedValue`, adequacy metadata |
| Settings link | `resolvePlanningAdequacySettingsNavigationTarget(row)` → `focusWorkflowStepSettings` |

Category order today: `getWorkflowBriefPlanningCategoryMeta(config, cat).order` — **reuse**, optionally extend with UI-only **tier** map.

### 1.3 Provenance (unchanged inputs)

| Input | Source |
|-------|--------|
| `buildWorkflowBriefProvenanceViewModel` | Pure — **may call unchanged** |
| Collapse state | `state.workflowBriefShowDefaults`, `workflowBriefShowRejected` |

20-3 **must not** change view-model semantics — only **container order**, **wrappers**, and **CSS**.

---

## 2. Proposed information architecture (target)

### 2.1 Recommended section order

**Option A (recommended) — guidance before deep provenance:**

```text
Resolved workflow brief (complete)
├── Helper: explain → advise → tune (one line, index.html)
├── Status strip (single deduped counts — no duplicate prose block)
├── Planning guidance (actionable adequacy first, collapsible info tier)
├── Assumptions at a glance (provenance summary — compact)
├── [existing provenance sections, unchanged data]
│   ├── Explicit / Inferred groups
│   ├── Defaulted / Rejected collapsibles
│   ├── Brief affects these steps
│   └── Workflow-level mappings
└── (no fourth elicitation block)
```

**Rationale:** Adequacy answers *“what should I do?”*; provenance answers *“what did you assume?”* — actionable guidance first reduces wizard fatigue.

**Option B (minimal change):** Keep provenance → planning order; improve spacing and headings only. Use if reorder risks user confusion — document choice in closeout.

**Decision gate:** Implement **Option A** unless manual mockup on LD M2 brief feels worse; fallback to **Option B**.

### 2.2 Panel-level helper copy (index.html)

Replace or extend existing resolved-brief helper with three roles:

> Inspect what was assumed, review planning suggestions, then tune execution in step **Settings**. Planning notices are advisory and do not block saving.

Keep under ~2 lines; link to no new surfaces.

---

## 3. Implementation work packages

### WP-1 — Status strip deduplication (high value)

| Task | Detail |
|------|--------|
| Merge stats | Combine `.workflow-brief-resolved-stats` text with provenance summary counts where redundant |
| Pure helper | `buildWorkflowBriefResolvedStatusStrip(model, resolvedState)` → single line or 2–3 chips |
| Tests | 2–3 assertions on string parts / counts |

**Do not** remove safety counts (asked, resolved, mapped) — consolidate presentation only.

### WP-2 — Planning notices prioritisation (high value)

| Task | Detail |
|------|--------|
| Row tier | `classifyWorkflowBriefPlanningNoticeRow(row)` → `actionable` \| `informational` \| `safety` (pure, UI rules on existing fields) |
| Sort within category | Actionable before informational; preserve category order from pack meta |
| Collapse | If `informational` count &gt; 3, wrap in collapsible “Additional planning notes (N)” — **collapsed by default** |
| Safety | Never collapse rows with `blockedValue` or category `validation` / `conflict` |

**Do not** filter out rows the interpreter emitted — only reorder and hide behind disclosure.

### WP-3 — Visual hierarchy and density (high value)

| Task | Detail |
|------|--------|
| `style.css` | Section wrappers: `.workflow-brief-panel-section`, spacing scale, heading levels |
| Planning items | Clear separation message / action / Settings button |
| Provenance | Slightly reduce list density; consistent `muted` for param key hints |
| Focus | Reuse `.workflow-step-settings-focus` — no change |

### WP-4 — Terminology and affordances (medium value)

| Task | Detail |
|------|--------|
| Button labels | Audit **Tune in Settings** vs **Open step Settings** — pick one primary label or keep both with tooltips (document in closeout) |
| Adequacy action line | Prefer “Suggestion:” over “Action:” if copy test shows less interrogation tone — **copy only** |
| Save-first | Ensure unsaved `focusWorkflowStepSettings` toast unchanged; add inline muted cue under provenance Tune buttons when `!state.selectedWorkflowId` |

### WP-5 — Layout overlap mitigation (medium value, optional)

| Task | Detail |
|------|--------|
| Spacing | Margin below `#wfBriefResolvedDetails` content before `#wfDesignSteps` |
| Scroll | `max-height` + `overflow-y: auto` on `.workflow-brief-resolved-content` if panel exceeds viewport — **Factory only** |

Addresses 20-2 manual validation automation nuance; not required for AC if spacing fix is trivial.

### WP-6 — Tests and regression (required)

| Suite | Change |
|-------|--------|
| New or extended | `tests/workflow-brief-panel-ux.test.js` **or** extend `workflow-brief-provenance.test.js` / `workflow-settings-discoverability.test.js` |
| Cover | Status strip helper, notice tier sort order, collapse threshold (pure functions) |
| Floor | **132+** passed |

**No** changes to Research/LD adequacy evaluation tests.

---

## 4. Files likely touched

| File | Expected change |
|------|-----------------|
| `app.js` | `renderWorkflowBriefResolvedPanel` order; planning UI tier/sort/collapse; optional status strip helper; `__PRISM_TEST_API` exports |
| `style.css` | Panel sections, planning/provenance density, optional scroll container |
| `index.html` | Resolved-brief helper copy |
| `tests/workflow-brief-panel-ux.test.js` | **New** (preferred) or extend existing — **+3 to +8 tests** |

**Not expected:** pack files, mapping/adequacy functions, Prompt Studio, Utilities renderer.

---

## 5. Pure helpers (proposed signatures)

```text
buildWorkflowBriefResolvedStatusStrip(config, resolvedState, provenanceModel) → string | { parts[] }

classifyWorkflowBriefPlanningNoticeRow(row) → "safety" | "actionable" | "informational"

sortWorkflowBriefPlanningNoticeRows(rows) → rows[]   // stable sort, same length

shouldCollapsePlanningNoticeGroup(rows, tier) → boolean
```

All **deterministic**; no pack reads beyond existing `getWorkflowBriefPlanningCategoryMeta`.

---

## 6. Manual validation checklist

Copy into closeout when done.

- [ ] LD M2-style brief → design → resolved panel scannable  
- [ ] Planning rows: actionable visible; informational collapsed when many  
- [ ] Provenance: defaults/rejected still collapsed  
- [ ] **Open step Settings** from adequacy (saved workflow)  
- [ ] **Tune in Settings** from provenance (saved — human click if automation fails)  
- [ ] Unsaved: save-first toast on Tune  
- [ ] Research scenario: layout works; no LD-only headings  
- [ ] No new blocking on Ready / design  
- [ ] `node --test tests/*.test.js` → 132+ green  

---

## 7. Acceptance mapping

| Charter AC | Work package |
|------------|--------------|
| AC-1 Hierarchy | WP-3 |
| AC-2 Roles clear | WP-2, panel helper WP §2.2 |
| AC-3 No blocking | All — no interpreter edits |
| AC-4 Interpreters frozen | §1, charter do-not-touch |
| AC-5 Progressive disclosure | WP-2 collapse + 20-2 collapsibles preserved |
| AC-6 Settings navigation | WP-4 — behaviour unchanged |
| AC-7 Terminology | WP-4 |
| AC-8 Tests | WP-6 |
| AC-9 Research/LD regression | WP-6 full suite |
| AC-10 Lightweight feel | Manual §6 |

---

## 8. Deferred beyond Sprint 20

| Item | Why defer |
|------|-----------|
| Settings vs brief diff | Needs comparison contract; not presentation-only |
| Pack parameter audit | [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md) |
| New adequacy predicates / pack rules | Architecture change |
| Utility HTML renderer | Different surface |
| Prompt Studio merge | Programme out of scope |
| Generic explainability framework | Over-engineering |

---

## 9. Implementation sequence (suggested PR order)

| Step | Deliverable | Test impact |
|------|-------------|-------------|
| 1 | Pure helpers + unit tests | +3–5 |
| 2 | Status strip + section wrappers | +0–2 |
| 3 | Planning tier sort + collapse | +2–3 |
| 4 | CSS density + optional scroll | 0 |
| 5 | Copy/terminology pass | 0 |
| 6 | Manual validation + closeout doc | 0 |

**Single PR acceptable** if small; split only if review size &gt; ~400 lines UI.

---

## 10. Sprint 20 closure checklist (post-20-3)

| Task | Owner |
|------|-------|
| `sprint-20-slice-3-closeout.md` | Implementation session |
| Update `CURRENT-STATE.md` → Sprint 20 **closed** | Docs |
| Update `HANDOVER.md` → point to programme closeout | Docs |
| Append `review-log.md` | Docs |
| Optional `sprint-20-closeout.md` programme summary | Docs |
| Confirm **132+** tests | CI / local |

---

## 11. References

| Document | Role |
|----------|------|
| [`sprint-20-slice-3-charter.md`](sprint-20-slice-3-charter.md) | Scope and AC |
| [`sprint-20-slice-2-closeout.md`](sprint-20-slice-2-closeout.md) | Provenance baseline |
| [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md) | Navigation baseline |
| [`contextual-refinement-architecture-note.md`](contextual-refinement-architecture-note.md) | Adequacy layer role |

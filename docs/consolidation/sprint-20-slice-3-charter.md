# Sprint 20 Slice 20-3 — Adequacy UX Refinement

**Date:** 2026-05-15  
**Status:** **Proposed / ready for implementation**  
**Sprint:** 20 — Workflow Explainability and Settings UX  
**Slice:** 20-3 (final consolidation slice)

**Prior slices:**

| Slice | Closeout | Tests at close |
|-------|----------|----------------|
| **20-1** Settings Discoverability | [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md) | 124 passed |
| **20-2** Workflow Assumptions / Provenance | [`sprint-20-slice-2-closeout.md`](sprint-20-slice-2-closeout.md) | 132 passed |

**Bootstrap:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/sprint-20-bootstrap.md`

**Architecture context:**

| Document | Role |
|----------|------|
| [`contextual-refinement-architecture-note.md`](contextual-refinement-architecture-note.md) | Four guidance layers — adequacy is assistive |
| [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md) | Parameterised workflow thesis |

**Verification baseline (pre-20-3):**

```bash
node --test tests/*.test.js
```

**Expected:** **132 passed**, 0 failed

---

## 1. Framing — architecture complete; slice is polish

**Sprint 20 core architecture is already complete** after Slices 20-1 and 20-2. PRISM now behaves as a **parameterised workflow system** in the Factory:

1. Lightweight brief  
2. Concrete workflow synthesis  
3. Advisory planning adequacy  
4. Provenance / explainability  
5. Settings-based tuning  
6. Parameterised workflow behaviour (packs + `mappingRules` + `stepParams`)

Slice **20-3** does **not** add capabilities, interpreters, or pack policy. It refines **how** adequacy, provenance, and Settings affordances are **presented together** so the Factory experience feels **coherent, scannable, and non-wizard-like**.

**Core principle:** **Adequacy should guide, not interrogate.**

**Renderer scope (this slice):** Factory **panel renderer** only — `#wfBriefResolvedDetails`, planning notice DOM, `style.css`, helper copy, section ordering. **Not** Utilities HTML renderer consolidation, workflow schema, or Prompt Studio.

---

## 2. Purpose

After 20-2, users can read assumptions and step relevance — but the resolved-brief area can still feel **dense** or **duplicative** (stats line + provenance groups + planning categories). Slice 20-3 makes the **relationship between provenance, adequacy, and Settings** obvious at a glance:

| Layer | User question | 20-3 answer (presentation) |
|-------|---------------|----------------------------|
| **Provenance** | What was assumed? | Scannable assumptions; collapsed noise |
| **Adequacy** | What should I consider? | Prioritised, grouped notices — not a second form |
| **Settings** | Where do I tune? | Consistent **Tune** / **Open step Settings** language and placement |

**Programme thesis (unchanged):** Generate with minimal questions; then show what was assumed and where to tune — in the UI, not in more chat.

---

## 3. UX goals

### 3.1 Planning panel readability

- Reduce **visual density** in `#wfBriefResolvedContent` without hiding safety-critical disclosures.  
- Improve **section order and hierarchy** so users scan: status → guidance → assumptions → detail.  
- Reduce **duplication** between compact stats, “Assumptions at a glance”, and planning messages that repeat the same factor.  
- Improve **spacing and grouping** (`style.css`) for category headings, notice rows, and provenance blocks.

### 3.2 Clarify provenance ↔ adequacy ↔ Settings

- One short **panel-level cue** (helper copy) explaining the three roles: explain (provenance), advise (adequacy), tune (Settings).  
- Avoid adequacy rows that **re-ask** what provenance already shows unless the row adds **actionable** guidance.  
- Align terminology:

| Term | Use |
|------|-----|
| **Tunable** | Design preview / unsaved step — “can tune after save” |
| **Settings** | Authoritative step configuration surface |
| **Explicit / You answered / Inferred / Defaulted** | Provenance source labels only |
| **Open step Settings** | Adequacy-linked navigation (saved workflow) |
| **Tune in Settings** | Provenance-linked navigation (same underlying hook) |

Optional: unify button label to **Open step Settings** everywhere if copy audit shows **Tune in Settings** is redundant — **presentation only**; same `focusWorkflowStepSettings` behaviour.

### 3.3 Action affordances

- Preserve **non-blocking** adequacy — no new gates, no modal interrogation.  
- Strengthen **save-first guidance** for unsaved workflows (consistent toast + inline cue).  
- Ensure adequacy **Open step Settings** and provenance **Tune in Settings** share visual weight and placement patterns (same `btn small` class family).  
- **Info-only** adequacy rows (no Settings target) visually distinct from **actionable** rows.

### 3.4 Progressive disclosure

- Keep **defaulted** and **rejected inference** collapsed by default (20-2).  
- Add or extend **collapse for low-priority planning categories** (e.g. informational / meta categories) where pack emits many rows.  
- Avoid **configuration dashboard** feel — no tables of all factors, no inline editors, no giant control surfaces.

### 3.5 Lightweight workflow generation feel

- No return to chat-heavy refinement or post-gen factor queues.  
- Resolved brief panel remains **post-design explainability**, not a pre-design wizard.  
- **Ready** and design flow unchanged.

---

## 4. Non-goals

| Non-goal | Notes |
|----------|--------|
| **Adequacy policy changes** | No new `planningAdequacyChecks`, predicates, or pack rules |
| **Mapping logic changes** | `applyWorkflowBriefMappings` frozen |
| **Factor resolution changes** | `resolveWorkflowBriefFactors` / inference frozen |
| **Schema changes** | No new `resolvedState` fields |
| **Generic explainability framework** | No plugin system or cross-app narrative engine |
| **Prompt Studio merge** | Out of programme |
| **Settings architecture redesign** | Settings panel behaviour unchanged |
| **Research pack / S1–S13 edits** | Frozen |
| **LD pack policy edits** | Frozen unless typo-only copy referenced by UI labels |
| **Utilities / page renderer consolidation** | Separate programme — not Sprint 20 |
| **“Changed since design” diff** | Deferred beyond Sprint 20 |
| **Pack parameter audit** | Post–Sprint 20 per [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md) §5 |
| **New blocking elicitation** | Contradicts Sprints 18–20 |

---

## 5. Renderer-only scope boundaries

Slice 20-3 is **presentation and DOM structure** in the Factory resolved-brief path only.

| In scope | Out of scope |
|----------|----------------|
| `renderWorkflowBriefResolvedPanel` section order and wrappers | Workflow run-time execution |
| `appendWorkflowBriefProvenanceUi` layout tweaks | `buildWorkflowBriefPlanningDisclosures` evaluation |
| `appendWorkflowBriefPlanningNoticesUi` grouping, collapse, priority sort | `evaluateWorkflowBriefPlanningAdequacyChecks` |
| `style.css` — hierarchy, spacing, responsive tweaks | `index.html` structural redesign beyond helper copy |
| Pure UI helpers for **display ordering** / **row tier** (testable) | New adequacy messages from packs |
| `index.html` — panel helper text | `wfDesignSteps` / `#workflowSteps` badge logic (unless copy-only) |

**Interpretation:** “Renderer” means **resolved-brief panel renderer** and related Factory CSS — not claiming HTML utility renderer work is in scope or complete.

---

## 6. Potential refinement areas (charter backlog)

Prioritised for implementation plan — not all required for closeout.

| Area | Intent |
|------|--------|
| **Section ordering** | Re-evaluate stats → provenance → planning; consider **guidance before deep provenance** when planning rows exist |
| **Adequacy prioritisation** | UI-side sort/tier within existing rows (severity, category order, actionable-first) — **no new predicates** |
| **Low-priority collapse** | Collapsible block for informational planning categories when row count &gt; N |
| **Deduped summary** | Single compact status strip; avoid repeating counts in stats + glance |
| **Terminology pass** | Tunable / Settings / provenance labels consistent across panel + step lists |
| **Action row layout** | Adequacy action + Settings button on one scannable line |
| **Saved vs unsaved cues** | Align provenance Tune + design Tunable + save-first toast wording |
| **Layout / responsiveness** | Long LD assessment briefs — scroll regions, sticky summary optional |
| **Overlap mitigation** | Reduce provenance panel vs design preview click interception (layout/spacing only) |

---

## 7. Risk analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Adequacy feels like a wizard again** | Medium | High | Cap visible rows by tier + collapse; no new questions; advisory copy only |
| **Reorder confuses returning users** | Low | Medium | Document order in closeout; one stable primary hierarchy |
| **Accidental interpreter edit** | Medium | High | Charter **do not touch** list; code review + test floor unchanged semantics |
| **Hiding important safety disclosures** | Low | High | Never collapse `validation` / blocked / conflict categories by default |
| **Scope creep into pack audit** | Medium | Medium | Defer parameter curation to post–Sprint 20 |
| **Duplicated Settings buttons** | Low | Low | Same hook; unify styling not behaviour |
| **Research regression** | Low | High | No pack edits; run full **132** test suite |

---

## 8. Manual validation strategy

**Environment:** `http://127.0.0.1:8787/` (or `npm run dev` equivalent).

| Scenario | What to verify |
|----------|----------------|
| **LD assessment + page (M2-style)** | Panel scannable in &lt;30s; provenance + adequacy + Tune/Settings paths clear |
| **Research briefing + page** | Cross-domain layout; no LD-only headings hard-coded |
| **Many planning rows** | Low-priority collapsed; actionable rows visible without scroll hunt |
| **Unsaved design** | Save-first toast + Tunable cues consistent |
| **Saved workflow** | Open step Settings from adequacy; Settings... from library |
| **No domain switch mid-session** | Avoid stale-session false negatives (20-2 lesson) |
| **Ready / design** | No new blocking; design still one-click after brief |

**Pass bar:** A novice author can answer: *what was assumed*, *what should I consider*, *where do I tune* — without reading raw JSON or opening chat.

---

## 9. Acceptance criteria

| # | Criterion |
|---|-----------|
| AC-1 | Resolved brief panel has clear **visual hierarchy** (headings, spacing, grouping) — reviewer consensus “scannable” |
| AC-2 | **Provenance**, **planning adequacy**, and **Settings** roles distinguishable from panel copy + layout |
| AC-3 | **No new blocking** behaviour, elicitation, or Ready gates |
| AC-4 | **No changes** to mapping, adequacy evaluation, resolution, or pack policy files |
| AC-5 | **Progressive disclosure** preserved — defaults/rejected collapsed; low-priority planning collapsible where implemented |
| AC-6 | **Open step Settings** / **Tune in Settings** still invoke `focusWorkflowStepSettings` — saved vs unsaved behaviour unchanged |
| AC-7 | **Terminology** consistent per §3.2 (document any intentional dual labels in closeout) |
| AC-8 | `node --test tests/*.test.js` — **132+ passed**, 0 failed; new tests only for **pure UI ordering/tier** helpers if added |
| AC-9 | **Research S1–S13** and LD adequacy suites green — no fixture edits |
| AC-10 | Factory still feels **lightweight** — no configuration-dashboard regression (manual sign-off) |

---

## 10. Do not touch

| Path / function | Reason |
|-----------------|--------|
| `resolveWorkflowBriefFactors` | Resolution interpreter |
| `applyWorkflowBriefMappings` | Mapping interpreter |
| `evaluateWorkflowBriefPlanningAdequacyChecks` | Adequacy interpreter |
| `buildWorkflowBriefPlanningDisclosures` (evaluation logic) | Disclosure content source |
| `applyWorkflowBriefPlanningAdequacyAfterDesign` | Post-design merge |
| `domains/research/*` | Research frozen |
| `domains/learning-design/domain-learning-design-step-patterns.md` | LD policy frozen |
| `tests/workflow-research-*.test.js`, sparse S1–S13 | Regression anchor |
| `tests/workflow-ld-adequacy.test.js` | LD adequacy anchor |
| Workflow JSON schema / normalise paths | No schema sprint |
| Prompt Studio orchestration | Out of scope |
| Utilities HTML renderer (`utilityRender*`) | Not Factory panel renderer |

**May touch (UI-only):** `renderWorkflowBriefResolvedPanel`, `appendWorkflowBriefProvenanceUi`, `appendWorkflowBriefPlanningNoticesUi`, related pure sort/tier helpers, `style.css`, `index.html` helper strings, optional `tests/workflow-brief-panel-ux.test.js` (or extend provenance/discoverability suites).

---

## 11. UX debt vs completed architecture

### Completed (do not re-litigate in 20-3)

| Capability | Slice |
|------------|-------|
| Settings / Tunable discoverability on step lists | 20-1 |
| Planning → **Open step Settings** for mapped adequacy ids | 20-1 |
| `focusWorkflowStepSettings` navigation | 20-1 |
| Structured provenance + step relevance | 20-2 |
| Source labels + collapsible defaults/rejected | 20-2 |
| Workflow-level mappings section | 20-2 |
| Cross-domain generic provenance rendering | 20-2 |
| Parameterised workflow architecture (packs + Settings) | 18–20 programme |

### Remaining UX debt (20-3 or defer)

| Item | 20-3 target | Defer beyond Sprint 20 |
|------|-------------|-------------------------|
| Panel density / section order | **Primary** | — |
| Adequacy row prioritisation / collapse | **Primary** | — |
| Duplicated stats vs glance counts | **Primary** | — |
| Terminology harmonisation | **Primary** | — |
| Provenance Tune click overlap (layout) | **Secondary** (spacing) | — |
| Settings vs brief diff | — | **Yes** |
| Pack parameter audit (right params exposed?) | — | **Yes** |
| Utility/page renderer consolidation | — | **Yes** |
| Broader Settings deep-links for all adequacy ids | Partial | Expand only with pack charter |

---

## 12. Relation to Sprint 20 programme goals

| Programme goal | 20-3 contribution |
|----------------|-------------------|
| **A. Settings discoverability** | **Consolidate** — clearer relationship to adequacy/provenance |
| **B. Workflow explainability** | **Consolidate** — less noise around 20-2 provenance |
| **C. Adequacy UX refinement** | **Primary slice** — grouping, priority, presentation |

After 20-3, Sprint 20 programme goals **A–C** are addressed at the Factory UX layer. Programme closeout should state: **architecture frozen at 132 tests**; future work is **pack curation** and **renderer programmes**, not Factory explainability foundations.

---

## 13. Sprint 20 closure recommendation

**Recommend closing Sprint 20 after Slice 20-3** when:

- Acceptance criteria §9 are met  
- Manual validation sign-off on LD + one Research scenario  
- `sprint-20-slice-3-closeout.md` and sprint pack `CURRENT-STATE.md` updated to **Sprint 20 closed**  
- Optional programme closeout note (`docs/consolidation/sprint-20-closeout.md`) — **docs-only**, not required for slice charter  

**Do not** extend Sprint 20 for parameter audits, Settings diff, or utility renderer work — charter those separately.

---

## 14. References

| Document | Role |
|----------|------|
| [`sprint-20-slice-2-closeout.md`](sprint-20-slice-2-closeout.md) | Immediate predecessor |
| [`sprint-20-slice-3-implementation-plan.md`](sprint-20-slice-3-implementation-plan.md) | Execution plan |
| [`HANDOVER.md`](../development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/HANDOVER.md) | Pack handover |
| [`sprint-20-parameterisation-reflection.md`](sprint-20-parameterisation-reflection.md) | Post–Sprint 20 audit direction |

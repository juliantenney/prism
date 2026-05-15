# Sprint 20 Slice 20-1 — Settings Discoverability

**Date:** 2026-05-15  
**Status:** **Closed** — see [`sprint-20-slice-1-closeout.md`](sprint-20-slice-1-closeout.md)  
**Sprint:** 20 — Workflow Explainability and Settings UX  
**Slice:** 20-1

**Bootstrap:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/sprint-20-bootstrap.md`  
**Prior sprint:** [`sprint-19-closeout.md`](sprint-19-closeout.md) — LD rationalisation; **118 tests**; `app.js` unchanged in Sprint 19

**Verification baseline:**

```bash
node --test tests/*.test.js
```

**Expected:** **118+** passed, 0 failed

---

## 1. Purpose

After Sprint 18/19 reduced chat-heavy elicitation, users need to **find and use step Settings** for assessment, page, and activity tuning. Slice 20-1 adds **UI discoverability** only: badges, compact parameter summaries, and Planning-panel links to step Settings — without new blocking flows, schema changes, or Research pack edits.

**Thesis (unchanged):** Generate with minimal questions; then make tuning affordances obvious in the Factory UI.

---

## 2. Architectural principle

| Layer | Role in Slice 20-1 |
|-------|----------------------|
| **Required essentials** | **Blocking** — unchanged |
| **Workflow synthesis** | Produces step graph — unchanged |
| **Planning adequacy** | **Advisory** — may **link** to Settings; not re-ask factors |
| **Step Settings** | **Authoritative** — **primary focus** of this slice |
| **Profile post-gen** | **Optional only** — no required tiers restored |

**Rule:** UI-first; minimal `app.js` hooks for navigation and summaries. No runtime rewrite of adequacy or mapping interpreters.

---

## 3. Scope

| In scope | Out of scope |
|----------|----------------|
| Step-level **Settings** / **Tunable** badges on library and design step lists | Workflow assumptions / provenance panel (Slice 20-2) |
| Compact **parameter summaries** on configurable steps | Adequacy layout overhaul (Slice 20-3) |
| Planning panel **Open step Settings** for mapped adequacy rows | Research pack / fixtures S1–S13 |
| Scroll/focus + optional Settings open from Planning links | New blocking or wizard flows |
| CSS for badges, cues, planning links | Schema / renderer redesign |
| `workflow-settings-discoverability.test.js` | AI-generated adequacy |

---

## 4. UX deliverables

1. **Step list** — Configurable steps show a small badge and a one-line cue (including mapped values when present).
2. **Design preview** — `wfDesignSteps` shows **Tunable** + “save then Settings” before library save.
3. **Planning panel** — Structured planning notices with **Open step Settings** where adequacy maps to `step_design_page` or `step_generate_assessment_items`.
4. **Navigation** — One click from adequacy → focus step; second click (or auto) opens existing Settings flow (Prompt Factory step config).

---

## 5. Non-goals

- No new mandatory elicitation or refinement queues  
- No changes to `planningAdequacyChecks` predicates or LD pack policy  
- No Prompt Studio merge  
- No changes to `askRefinementByDefault` or profile tiers  

---

## 6. Success criteria

| Criterion | Target |
|-----------|--------|
| Configurable steps visible | Badge or cue on steps with `configurationMode: simple` or `stepParams` mappings |
| Reach Settings in 1–2 interactions | Planning link → step focus → Settings |
| Ready non-blocking | Preserved |
| Tests | **118+** green |

---

## 7. References

| Document | Role |
|----------|------|
| [`contextual-refinement-architecture-note.md`](contextual-refinement-architecture-note.md) | Four layers |
| [`sprint-20-bootstrap.md`](../development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/sprint-20-bootstrap.md) | Programme goals |

# Session Handover — Sprint 21 portable pack

**Role:** authoritative for **this pack** until Sprint 21 closes.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`

**Date:** 2026-05-15 (bootstrap)

**Entry point:** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md)

**Predecessor closeout:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 21** | **Proposed / ready for charter** — bootstrap only |
| **Sprint 20** | **Closed** — **135 tests** |
| **Sprint 19** | **Closed** — **118 tests** |
| **Sprint 18** | **Closed** — **100 tests** |

---

## Why Sprint 21 exists

Sprint 20 made workflows **legible**: discoverable Settings, provenance, step relevance, planning guidance → **Open step Settings**.

**Gap discovered in Sprint 20:** Step Settings expose tuning through Prompt Factory config and mapped `[PRISM_STEP_PARAMS]` patches, but **not all pack-defined `stepParams` appear as first-class editable controls**. Summaries and provenance show param keys; many mapped parameters stay **opaque or notes-only**.

Sprint 21 completes the **parameterised workflow front-end**: Settings become the **full workflow parameter editor**; runtime stays **generic and pack-driven**.

---

## Sprint 21 thesis (one sentence)

*Packs declare parameters and rendering metadata; runtime renders generic controls, persists values, propagates execution, and keeps provenance aligned — without bespoke UI per parameter.*

---

## What Sprint 20 already provides (do not rebuild)

| Capability | Source |
|------------|--------|
| Resolved factors + mappings | Sprint 17–18 runtime |
| `mappingRules` → `stepParams` | Pack + `applyWorkflowBriefMappings` |
| Provenance view model | Sprint 20-2 |
| Settings discoverability + navigation | Sprint 20-1 |
| Advisory planning adequacy | Sprint 18–19 + 20-3 presentation |
| Cross-domain provenance rendering | Sprint 20-2 |

Sprint 21 **extends Settings**, not synthesis or adequacy interpreters.

---

## Two-tier parameter model

| Tier | Purpose | Examples |
|------|---------|----------|
| **Elicited** | Small high-impact set during design | Assessment type, item count, learner level, topic/scope, formative/summative intent |
| **Settings-only** | Rich tuning after workflow exists | Sequencing strategy, difficulty progression, distractor style, feedback granularity, answer visibility, retry/remediation, explanation depth, scaffolding intensity |

**Principle:** Do not force arcane configuration during synthesis. Generate quickly; tune richly afterward.

---

## Consolidated interaction model (target after Sprint 21)

1. Lightweight brief (elicited tier only)  
2. Essentials gate minimum viability  
3. Workflow synthesis → concrete workflow  
4. Planning adequacy advises (non-blocking)  
5. Provenance explains assumptions  
6. Step relevance shows where parameters apply  
7. **Settings edit all relevant pack-defined step parameters** (generic controls)

---

## Recommended slice sequence (bootstrap proposal)

| Slice | Title | Intent |
|-------|-------|--------|
| **21-1** | Parameter metadata + generic Settings renderer | Pack conventions; typed controls; persist + propagate |
| **21-2** | Advanced/basic grouping + visibility | Progressive disclosure; hide internal/low-value params |
| **21-3** | LD pack pilot + provenance alignment | Declarative LD params; summaries match controls |

Charters to refine scope per slice.

---

## In scope (programme)

- Pack-defined parameter metadata (labels, descriptions, defaults, options, visibility, grouping, elicitation priority, control types)  
- Generic Settings control rendering in Factory  
- Typed controls (select, number, boolean, text, etc. as pack declares)  
- Advanced/basic parameter grouping  
- Parameter visibility rules  
- Preserving provenance integration when values change in Settings  

---

## Out of scope (bootstrap default)

| Item | Reason |
|------|--------|
| Implementation in bootstrap | Planning only |
| Utilities / page HTML renderer rewrite | Separate programme |
| Prompt Studio merge | Product boundary |
| Schema overhaul | Incremental pack metadata first |
| Pack validation framework | Future programme |
| AI-generated parameter semantics | Deterministic pack-authored metadata |
| Workflow diff / history | Deferred from 20-2 |
| Collaborative editing | Not PRISM Factory scope |
| Runtime execution engine redesign | Propagation hooks only as needed |
| New blocking elicitation / profile required tiers | Contradicts 18–19 |

---

## Architectural continuity (must preserve)

- Lightweight elicitation  
- Essentials gating (blocking when unsafe)  
- Advisory adequacy only  
- Provenance model over `resolvedState`  
- Pack-driven architecture  
- Generic runtime (no domain branches in `app.js` for each param)  
- No wizard regression  

---

## Future benefits (post Sprint 21)

| Benefit | Mechanism |
|---------|-----------|
| Declarative new settings | Add pack metadata, not Factory branches |
| Richer pedagogical tuning | Domains extend `stepParams` independently |
| Lower runtime complexity | One generic renderer |
| Packs as configuration contracts | Factors + mappings + Settings metadata co-located |

---

## Potential future audit (not Sprint 21 implementation)

- Are the **right** parameters exposed?  
- Are low-value / internal parameters **hidden**?  
- Which parameters should be **elicited** vs **Settings-only**?  
- Are domain packs **missing** meaningful controls?  
- Should **advanced** parameters collapse by default?  

See [`sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) §3–§5.

---

## Verification

```bash
node --test tests/*.test.js
```

**Floor at bootstrap:** **135 passed**, 0 failed.

---

## Recommended first task

Read **`sprint-21-bootstrap.md`**, then draft **Slice 21-1 charter** (metadata schema + generic Settings renderer MVP).

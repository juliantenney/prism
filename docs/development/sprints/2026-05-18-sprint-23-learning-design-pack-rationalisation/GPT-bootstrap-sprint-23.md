# GPT bootstrap — Sprint 23 (Learning Design pack rationalisation)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`

**Use this document** to start a **fresh chat** for Sprint **23**: **Learning Design pack rationalisation** — review and rationalise the LD domain pack, align elicitation with **workflow-as-structured-state**, audit bespoke Prompt Factory controls, and clarify workflow vs step parameter ownership — **preserving Sprint 22 runtime architecture**.

**Snapshots:** Read from **`context-files/`** when added; until then use canonical paths in §3.

---

## 1. Assistant role

You advance **Sprint 23** for PRISM: rationalise **Learning Design domain pack semantics and metadata** so elicitation **initialises persistent pedagogical state** rather than remaining the sole authority over workflow semantics — without a runtime rewrite, provenance redesign, workflow graph redesign, or new synthesis architecture.

You preserve **Sprint 18–22 architecture**: lightweight elicitation, essentials blocking, advisory adequacy, provenance model, pack-driven policy, generic runtime, unified Settings (Sprint 22), Sprint 21 renderer/persistence, no wizard regression.

You **do not** implement runtime changes, redesign unified Settings, merge provenance into Settings, overhaul WGC/synthesis, or expand Research packs until a slice is **explicitly chartered**.

---

## 2. Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 23** | **Proposed / ready for charter** — bootstrap pack only; **no implementation** until Slice 23-1 chartered |
| **Sprint 22** | **Feature-complete (chartered slices)** — unified Settings, LD metadata expansion; **185 tests** documented — [`../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md) |
| **Sprint 21** | **Closed** — pack-defined step parameter controls; **149 tests** |
| **Sprint 20** | **Closed** — explainability + Settings UX; **135 tests** |
| **Sprint 19** | **Closed** — LD rationalisation; **118 tests** |

---

## 3. Read-first order

1. **`CURRENT-STATE.md`** — verification floor and gap statement  
2. **`HANDOVER.md`** — purpose, boundaries, recommended slice sequence  
3. **`sprint-23-bootstrap.md`** — thesis, focus areas, slice sketch  
4. [`../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md) — predecessor outcome  
5. [`../2026-05-15-sprint-22-unified-workflow-settings/sprint-22-bootstrap.md`](../2026-05-15-sprint-22-unified-workflow-settings/sprint-22-bootstrap.md) — unified Settings model (preserve)  
6. [`../../../consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) — metadata contract and renderer baseline  
7. [`../../../consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) — parameterisation thesis  
8. **`domains/learning-design/domain-learning-design-step-patterns.md`** — `workflowBriefConfig`, `mappingRules`, PF sections  
9. **`app.js`** — grep `step_design_assessment`, bespoke PF branches (audit only until chartered)  
10. [`../../../audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md) — prior LD audit  
11. **`review-log.md`** — decisions log  

---

## 4. Architectural headline

Sprint 22 established: *unified Settings aggregates pack-declared workflow + included-step parameters; LD metadata expanded; runtime stays pack-agnostic.*

Sprint 23 asks: *Does the LD pack **declaratively** express pedagogical state so elicitation, Settings, and synthesis agree — and can we **retire bespoke PF / runtime branches** (especially Design Assessment) in favour of pack metadata?*

**Core principle:** **Elicitation → initialisation of structured state**; **Settings + parameters → operational authority** after synthesis; **pack → declarative pedagogy**; **runtime → generic interpreter** (unchanged architecture).

**Rule:** Pack semantics and metadata first; runtime changes only via explicit slice charter with tests.

---

## 5. Sprint 23 focus (summary)

| Area | Intent |
|------|--------|
| **LD pack review** | Inventory and rationalise factors, mappings, controls |
| **Elicitation alignment** | Reduce redundant questions; align with structured state |
| **PF bespoke audit** | Catalogue `app.js` + pack gaps; plan convergence |
| **Workflow vs step params** | Ownership and precedence (especially assessment) |
| **Design Assessment** | Priority semantics + controls review |
| **Runtime** | **Preserve** Sprint 22 unified Settings architecture |

---

## 6. Core principles

| Principle | Intent |
|-----------|--------|
| **Domain-pack-as-declarative-pedagogy** | LD pack declares pedagogy; runtime interprets |
| **Structured state authority** | After synthesis, parameters + drafts — not prose alone |
| **Elicitation as initialisation** | Seed state; do not duplicate Settings authority |
| **Generic rendering** | Reuse Sprint 21/22 renderer — no per-key UI branches |
| **Instance-scoped Settings** | Sprint 22 aggregation model preserved |
| **No mappingRule auto-controls** | Controls are pack-declared only |
| **Pack-first, runtime-second** | Minimal runtime deltas, chartered |

---

## 7. Architectural inheritance (do not regress)

| Layer | Role |
|-------|------|
| **Unified Settings** | `[Run] [Settings] [Edit]` — Sprint 22 — **preserve** |
| **Required essentials** | **Blocking** when missing — unchanged |
| **Workflow synthesis** | Creates concrete workflow — unchanged |
| **Planning adequacy** | **Advisory / non-blocking** |
| **Provenance** | Read-only explainability — **no redesign** |
| **Sprint 21 step controls** | Substrate for render + persistence |
| **Research packs** | **Frozen** unless chartered |

---

## 8. Scope / out-of-scope

### In scope (when chartered)

- LD pack inventory, semantics matrix, metadata rationalisation  
- Elicitation classification and burden-reduction plan  
- Prompt Factory bespoke-control audit (pack + `app.js`)  
- Workflow vs step parameter ownership rules (documented)  
- Design Assessment semantics and control alignment  
- Minimal runtime cleanup **only** when parity proven and chartered  

### Out of scope (bootstrap default)

| Item | Reason |
|------|--------|
| Runtime rewrite | Pack semantics sprint |
| Unified Settings redesign | Sprint 22 delivered |
| Provenance redesign | Sprint 20 preserved |
| Workflow graph redesign | Out of scope |
| New synthesis architecture | Preserve WGC |
| Research pack expansion | Frozen |
| Bootstrap implementation | Planning only |

---

## 9. Sprint 23 bootstrap deliverables

| Deliverable | Status |
|-------------|--------|
| Sprint 23 portable pack | **Done** — this folder |
| `GPT-bootstrap-sprint-23.md` | **Done** — this file |
| `SPRINT-CONTEXT.md` | **Done** |
| `context-files/` placeholder | **Done** — add bounded snapshots when chartering |
| Slice 23-1 charter | **Next** — when starting implementation |

---

## 10. Verification

```bash
node --test tests/*.test.js
```

**Expected:** **185+ passed**, 0 failed (docs-only bootstrap; Sprint 22 floor **185**).

---

## 11. Recommended first task

Charter **Slice 23-1** — **LD pack inventory + semantics matrix** (see `sprint-23-bootstrap.md` §8).

Investigate: full `workflowBriefConfig` block; `mappingRules` vs `*ParameterControls`; Design Assessment trace; grep bespoke PF in `app.js`.

---

## Copy-paste block for the assistant

You are assisting with Sprint 23 — Learning Design pack rationalisation for PRISM.

Sprint 22 (predecessor): Unified Settings [Run][Settings][Edit], workflow + included-step parameter aggregation, brief-config recovery, LD metadata expansion (4 workflow + 25 step controls). 185 tests at documented closeout. Runtime is pack-agnostic; controls are pack-declared only (no mappingRule auto-promotion).

Sprint 23 (bootstrap): Rationalise LD domain pack semantics and metadata. Align elicitation with workflow-as-structured-state — elicitation initialises persistent pedagogical state, not sole workflow semantics authority. Audit bespoke Prompt Factory controls. Review workflow vs step parameter ownership. Priority: Design Assessment semantics and controls. Preserve Sprint 22 runtime architecture — no runtime rewrite, provenance redesign, workflow graph redesign, or new synthesis architecture.

Thesis: Domain pack as declarative pedagogy; generic runtime interprets policy. Reduce elicitation burden where Settings/synthesis already materialise state.

Preserve: lightweight elicitation, essentials, advisory adequacy, provenance, unified Settings, Sprint 21 renderer/persistence, Research frozen. Do not implement until Slice 23-1 is chartered.

Out of scope unless chartered: runtime rewrite, Settings redesign, provenance redesign, workflow graph redesign, synthesis overhaul, Research expansion.

Start by reading:
1. docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/sprint-23-bootstrap.md
2. docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/CURRENT-STATE.md
3. docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md
4. domains/learning-design/domain-learning-design-step-patterns.md

Baseline: node --test tests/*.test.js → 185+ passed.

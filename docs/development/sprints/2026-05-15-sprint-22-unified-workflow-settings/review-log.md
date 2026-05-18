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

## Status

**Portable bootstrap complete** — **149 tests**. **No slices chartered.** **No implementation.**

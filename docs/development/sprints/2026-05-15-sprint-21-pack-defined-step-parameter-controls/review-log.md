# Sprint 21 review log — Pack-defined Step Parameter Controls

**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`  
**Date:** 2026-05-15

---

## 2026-05-15 — Bootstrap session

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R21-001 | Sprint 21 follows **closed Sprint 20** operability gap | Explainability complete; Settings editor incomplete |
| R21-002 | **Settings = full workflow parameter editor** | Programme thesis from closeout §11 |
| R21-003 | **Pack metadata + generic runtime renderer** | Avoid bespoke `app.js` per parameter |
| R21-004 | **Two-tier model** — elicited vs Settings-only | Preserve lightweight synthesis; rich post-gen tuning |
| R21-005 | **Slice 21-1 first** — metadata + generic renderer MVP | Foundation before grouping and LD pilot |
| R21-006 | **Slice 21-2** — advanced/basic + visibility | Progressive disclosure; hide internal params |
| R21-007 | **Slice 21-3** — LD pilot + provenance alignment | Integrate with Sprint 20 explainability |
| R21-008 | Sprint 21 completes **parameterised front-end**, not synthesis | Architectural framing |
| R21-009 | Research **frozen** unless chartered | S1–S13 regression anchor |
| R21-010 | No blocking elicitation or profile **required** tier regression | Continuity from 18–20 |
| R21-011 | Pack audit **deferred** | Reflection §5 — informs packs, not 21-1 blocker |

### Artefacts created

| Artefact | Path |
|----------|------|
| Sprint 21 portable pack (7 files) | `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/` |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **135 passed**, 0 failed (docs-only bootstrap).

### Open questions (for Slice 21-1 charter)

1. Metadata location — pack root `stepParameterControls` vs per-step `promptFactory` extension vs `workflowBriefConfig` sibling?  
2. Minimum control types for v1 — `select`, `number`, `boolean`, `text` only?  
3. Coexistence with existing `userOptions` / `configurationMode: simple` — migrate or bridge?  
4. LD pilot step list — assessment + page first, or activity scaffolding params?  
5. Provenance source label when user edits in Settings — **explicit** override vs new tier?

---

## Status

**Sprint 21 bootstrap complete** — **ready for Slice 21-1 charter**. **No implementation started.**

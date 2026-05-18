# Sprint 22 index — Unified Workflow Settings surface

**Pack path:** `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/`  
**Date:** 2026-05-15  
**Status:** **Slices 22-1 through 22-3 implemented**; **LD metadata coverage expansion complete**

**Entry point:** [`GPT-bootstrap-sprint-22.md`](GPT-bootstrap-sprint-22.md)

**Predecessor closeout:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

**Verification:** **185 passed**, 0 failed (`node --test tests/*.test.js`)

---

## Portable pack (this folder)

| File | Purpose |
|------|---------|
| [`GPT-bootstrap-sprint-22.md`](GPT-bootstrap-sprint-22.md) | **Fresh-chat bootstrap** — restoration prompt + copy-paste block |
| [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) | Alias → authoritative bootstrap |
| [`HANDOVER.md`](HANDOVER.md) | Purpose, boundaries, slice sequence |
| [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) | Goals, scope, risks, success criteria |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Gap statement + test floor |
| [`sprint-22-bootstrap.md`](sprint-22-bootstrap.md) | Thesis, UI model, likely approach |
| [`sprint-22-index.md`](sprint-22-index.md) | This index |
| [`review-log.md`](review-log.md) | Decisions R22-001+ |
| [`slice-22-1-charter.md`](slice-22-1-charter.md) | Slice 22-1 charter |
| [`context-files/README.md`](context-files/README.md) | Bounded snapshot placeholder |

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 22** | **Active** — chartered slices **implemented**; **185 tests** |
| **Sprint 21** | **Closed** — [`sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) — **149 tests** |
| **Sprint 20** | **Closed** — [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| **Sprint 19** | **Closed** |

---

## Slice sequence

| Slice | Focus | Status |
|-------|--------|--------|
| **22-1 / 22-1.1** | Unified Settings shell + included-step aggregation | **Closed** |
| **22-2a** | Async brief-config recovery | **Closed** |
| **22-2b** | `workflowParameterControls` | **Closed** |
| **22-2c** | DOM re-read, Save merge, canonical discovery | **Closed** |
| **22-3** | Navigation, badge, save hint, provenance links | **Implemented** |
| **LD metadata** | Pack control expansion for core LD steps | **Complete** |

---

## Programme thesis

**Settings = unified workflow tuning surface** for pack-declared parameters (workflow-level + included steps). **Edit** = prompts and implementation. **Run** = default orientation.

**Not:** modal redesign, parameter-system rewrite, or prompt editing in Settings.

---

## UI model

```text
[ Run ]    [ Settings ]    [ Edit ]
```

---

## Architecture references

| Document | Path |
|----------|------|
| Sprint 21 closeout | [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) |
| Sprint 21 pack | [`../2026-05-15-sprint-21-pack-defined-step-parameter-controls/`](../2026-05-15-sprint-21-pack-defined-step-parameter-controls/) |
| LD step patterns | [`domains/learning-design/domain-learning-design-step-patterns.md`](../../../../domains/learning-design/domain-learning-design-step-patterns.md) |
| Shared vocabulary | [`docs/development/shared-vocabulary.md`](../../shared-vocabulary.md) |

---

## Verification

```bash
node --test tests/*.test.js
```

**Expected:** **185 passed**, 0 failed.

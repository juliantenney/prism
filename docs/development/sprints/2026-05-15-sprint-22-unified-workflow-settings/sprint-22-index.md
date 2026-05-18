# Sprint 22 index — Unified Workflow Settings surface

**Pack path:** `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/`  
**Date:** 2026-05-15  
**Status:** **Proposed / ready for charter**

**Entry point:** [`GPT-bootstrap-sprint-22.md`](GPT-bootstrap-sprint-22.md)

**Predecessor closeout:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

**Verification at bootstrap:** **149 passed**, 0 failed

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
| [`context-files/README.md`](context-files/README.md) | Bounded snapshot placeholder |

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 22** | **Bootstrap** — no implementation |
| **Sprint 21** | **Closed** — [`sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) — **149 tests** |
| **Sprint 20** | **Closed** — [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| **Sprint 19** | **Closed** |

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

## Proposed slice sequence (placeholder)

| Slice | Focus | Status |
|-------|--------|--------|
| **22-1** | Unified Settings shell + included-step aggregation MVP | Charter pending |
| **22-2** | Workflow-level parameter section (pack contract TBD) | Deferred |
| **22-3** | [Run][Settings][Edit] navigation + discoverability | Deferred |

---

## Architecture references

| Document | Path |
|----------|------|
| Sprint 21 closeout | [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) |
| Sprint 21 pack | [`../2026-05-15-sprint-21-pack-defined-step-parameter-controls/`](../2026-05-15-sprint-21-pack-defined-step-parameter-controls/) |
| Parameterisation reflection | [`docs/consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) |
| Shared vocabulary | [`docs/development/shared-vocabulary.md`](../../shared-vocabulary.md) |

---

## Investigation starting points (when chartered)

| Area | Path |
|------|------|
| Sprint 21 renderer | `app.js` — `renderWorkflowStepPromptConfigUI`, parameter helpers |
| Step inclusion | Workflow `steps[]`, `canonicalStepId` / pattern matching |
| LD pack metadata | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Factory navigation | `index.html`, workflow mode tabs / panels |
| Tests | `tests/workflow-step-parameter-controls.test.js` |

---

## Test baseline

| Milestone | Result |
|-----------|--------|
| Sprint 21 close | **149 passed** |
| Sprint 22 bootstrap | **149 passed** (no code delta expected) |

---

## Verification

```bash
node --test tests/*.test.js
```

**At bootstrap:** **149 passed**, 0 failed.

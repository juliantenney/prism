# Sprint 23 index — Learning Design pack rationalisation

**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`  
**Date:** 2026-05-18  
**Status:** **Proposed / ready for charter** — bootstrap pack only

**Entry point:** [`GPT-bootstrap-sprint-23.md`](GPT-bootstrap-sprint-23.md)

**Predecessor:** [`../2026-05-15-sprint-22-unified-workflow-settings/`](../2026-05-15-sprint-22-unified-workflow-settings/)

**Verification:** **185+** passed, 0 failed (`node --test tests/*.test.js`; Sprint 22 documented **185**)

---

## Portable pack (this folder)

| File | Purpose |
|------|---------|
| [`GPT-bootstrap-sprint-23.md`](GPT-bootstrap-sprint-23.md) | **Fresh-chat bootstrap** — restoration prompt + copy-paste block |
| [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) | Alias → authoritative bootstrap |
| [`HANDOVER.md`](HANDOVER.md) | Purpose, boundaries, slice sequence |
| [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) | Goals, scope, risks, success criteria |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Gap statement + test floor |
| [`sprint-23-bootstrap.md`](sprint-23-bootstrap.md) | Thesis, focus areas, slice sketch |
| [`sprint-23-index.md`](sprint-23-index.md) | This index |
| [`review-log.md`](review-log.md) | Decisions R23-001+ |
| [`slice-23-1-charter.md`](slice-23-1-charter.md) | Proposed Slice 23-1 (placeholder) |
| [`context-files/README.md`](context-files/README.md) | Bounded snapshot placeholder |

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 23** | **Bootstrap** — no implementation |
| **Sprint 22** | **Feature-complete (chartered slices)** — **185 tests** documented |
| **Sprint 21** | **Closed** — [`sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) — **149 tests** |
| **Sprint 20** | **Closed** — [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |

---

## Proposed slice sequence

| Slice | Focus | Status |
|-------|--------|--------|
| **23-1** | LD pack inventory + semantics matrix | **Proposed** — see charter placeholder |
| **23-2** | Elicitation alignment + burden reduction | **Proposed** |
| **23-3** | Prompt Factory bespoke-control audit | **Proposed** |
| **23-4** | Workflow vs step parameter ownership | **Proposed** |
| **23-5** | Design Assessment semantics + controls | **Proposed** |
| **23-6** | Pack metadata rationalisation (apply) | **Proposed** |

---

## Programme thesis

**Elicitation initialises persistent pedagogical state; pack metadata is declarative pedagogy; Settings is operational authority after synthesis.**

**Preserve:** Sprint 22 unified Settings runtime architecture.

**Not:** runtime rewrite, provenance redesign, workflow graph redesign, new synthesis architecture.

---

## Priority review area

**Design Assessment** (`step_design_assessment`) — assessment blueprint semantics, pack controls, bespoke PF/runtime inheritance.

---

## Architecture references

| Document | Path |
|----------|------|
| Sprint 22 pack | [`../2026-05-15-sprint-22-unified-workflow-settings/`](../2026-05-15-sprint-22-unified-workflow-settings/) |
| Sprint 21 closeout | [`../../../consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) |
| LD step patterns | [`domains/learning-design/domain-learning-design-step-patterns.md`](../../../../domains/learning-design/domain-learning-design-step-patterns.md) |
| LD rationalisation audit | [`../../../audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md) |
| Shared vocabulary | [`docs/development/shared-vocabulary.md`](../../shared-vocabulary.md) |

---

## Verification

```bash
node --test tests/*.test.js
```

**Expected:** **185+** passed, 0 failed.

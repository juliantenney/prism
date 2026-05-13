# Sprint 12 — First-pass structural observability (Phases A–E) — closure

## Status

**Closed** (first-pass slice only).

This closure records **bounded structural observability** delivered as **tests and documentation** only. It **does not** state that all Sprint 12 work is complete, **does not** approve broader Sprint 12 candidate items from `docs/consolidation/sprint-12-candidate-prep-note.md`, and **does not** change Sprint 09 contract-boundary governance or the canonical Sprint 10 audit (`docs/consolidation/sprint-10-contract-audit.md`).

**No production behavior changes** were required for this first-pass closure.

## Completed first-pass surfaces (A–E)

- **Phase A —** `workflowGenerationContext.js` `buildWorkflowGenerationContext` → `promptContext` **assembly skeleton**: section heading order (`## PLATFORM CONTEXT` → `## DOMAIN CONTEXT` → `## WORKFLOW BRIEF`); `Selected domains:` present between DOMAIN and BRIEF.
- **Phase B —** same path → `promptContext` **`### File:`** path **provenance ordering** in PLATFORM and DOMAIN sections (happy-path deterministic `fetch`).
- **Phase C —** same path → **return-shape** happy path: `promptContext` string type; `loadedFiles` order; `missingFiles` empty; `selectedDomains` vs mirrored normalization.
- **Phase D —** `app.js` **source-level** structural check only: design user payload join `String(promptContext || "") + "\n\n" + buildWorkflowCompactDirective(mode)` (no execution, no test seams).
- **Phase E —** same WGC path → DOMAIN CONTEXT **first `Selected domains:`** line: comma-separated domain id **token order** vs mirrored normalization (structural only; invalid/duplicate/always-on handling).

## Test files added

- `tests/workflow-generation-context-phase-a.test.js`
- `tests/workflow-generation-context-phase-b.test.js`
- `tests/workflow-generation-context-phase-c.test.js`
- `tests/workflow-generation-context-phase-e.test.js`
- `tests/workflow-design-user-payload-phase-d.test.js`

## Verification

From repository root:

```bash
node --test tests/workflow-generation-context-phase-a.test.js tests/workflow-generation-context-phase-b.test.js tests/workflow-generation-context-phase-c.test.js tests/workflow-generation-context-phase-e.test.js tests/workflow-design-user-payload-phase-d.test.js
```

**Result at closure:** nine tests, all passed (local `node --test`).

## Deferred surfaces (explicitly out of scope for this first-pass)

The following remain **deferred / future-chartered** only. They were **not** targets of Phases A–E and are **not** promoted to in-scope work by this closure:

- Runtime observation of design user payload beyond the Phase D **source-level** join check.
- Semantic prompt assertions; model or generated-output assertions.
- `fetch` fallback, failed manifest loads, failed file loads, and missing-file / `missingFiles` path coverage as test targets.
- `manifestPromise` / `textCache` behavior as asserted contracts.
- Broad `app.js` orchestration coverage.
- Persistence / import / export contract expansion beyond existing Sprint 11 channels.
- Domain-pack edits and semantic contract migration.

**These deferred items are non-blocking** for first-pass A–E closure: they are **out of scope** for this pass, not incomplete deliverables within it.

## Governance alignment

- Sprint 11 closure (`docs/consolidation/sprint-11-closure.md`) records completed BL/F-INT and PE foundations and deferred WGC/runtime orchestration coverage; this first-pass **narrows** observability on the WGC assembly surface and one **static** design-payload join line **without** claiming completion of that deferred orchestration agenda.
- Sprint 12 candidate preparation (`docs/consolidation/sprint-12-candidate-prep-note.md`) remains **candidate framing** for broader directions; this closure is a **separate, bounded** completed slice.

## Review log

- **2026-05-13** — First-pass structural observability Phases A–E closure documented (consolidation note only).

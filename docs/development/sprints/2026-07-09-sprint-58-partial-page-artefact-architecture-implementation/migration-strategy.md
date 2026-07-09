# Migration Strategy — Sprint 58

## Objective

Introduce partial page artefact workflow without breaking legacy compose-based workflows.

---

## Gating model

| Flag / condition | Behaviour |
| ---------------- | --------- |
| `isPartialPageOutputWorkflowEnabled(wf) === true` | Partial prompts, no post-EP injection, partial validation, assembly render |
| `isPageEnrichmentV2WorkflowEnabled(wf) === true` && partial off | Legacy full-page v2 (rollback path — default **off** after Sprint 58) |
| `isPageEnrichmentV2WorkflowEnabled(wf) === false` | Legacy compose: `learning_activities`, `activity_materials`, Design Page merge |

**Sprint 58 fix:** Restore `isPageEnrichmentV2WorkflowEnabled(wf)` to read workflow config — remove hard-coded `return true`.

Suggested workflow record flags:

```json
{
  "pageEnrichmentV2": true,
  "partialPageOutputs": true
}
```

---

## Phased cutover

### Phase A — Parallel implementation (Sprint 58)

- Add assembly module and partial validators alongside existing full-page code.
- Gate new behaviour behind `partialPageOutputs`.
- Full-page v2 code paths remain for rollback until partial E2E proven.

### Phase B — Default enable

- New LD page workflows default `partialPageOutputs: true`.
- Documentation and prompt seeds updated.

### Phase C — Deprecate full-page v2 (future)

- Remove upstream embed builders used only for full-page enrich-in-place.
- Remove full-page preservation contracts.
- Retain deterministic enrich helpers (`enrichPageWithDla`, etc.) for tests/fixtures only.

### Phase D — Legacy compose retirement (future, separate sprint)

- Retire Design Page LLM compose when all workflows on v2 partial path.

---

## Code paths to gate

| Path | Partial on | Partial off (legacy) |
| ---- | ---------- | -------------------- |
| `buildUpstream*EmbedSection*` | Return `""` | Current embed behaviour |
| `buildWorkflowStepInstructions` binding body injection | Skip post-EP | Inject captures |
| `validateGamOrPageCapture` etc. | Partial validators | Full-page validators |
| `syncWorkflowRunCapturedOutputToState` compose | Skip post-EP | Current compose |
| `applyPageCompositionValidationForCapturedPage` | Skip post-EP | Run compose repair |
| Render | Assemble then normalize | Direct normalize |

---

## Data migration

No persisted workflow migration required. Users re-run workflow and paste partial captures per step.

Existing `workflowRunCapturedOutputs` full pages may coexist; assembly prefers stage-appropriate partials when `partialPageOutputs` enabled.

---

## Documentation migration

- [ADR-partial-page-artefact-assembly.md](ADR-partial-page-artefact-assembly.md) supersedes post-EP full-page sections in 56F `progressive-enrichment-architecture.md` (add supersession banner only — do not rewrite 56F history).
- 57A budget docs remain reference for prompt authoring.

---

## Rollback

Set `partialPageOutputs: false` on workflow to restore full-page v2 path (if retained in Phase A).

Set `pageEnrichmentV2: false` for full legacy compose workflow.

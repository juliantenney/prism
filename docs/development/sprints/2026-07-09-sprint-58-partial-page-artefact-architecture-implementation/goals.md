# Sprint 58 — Goals

## Primary goals

1. **Implement partial page artefact outputs** for DLA, GAM, Learning Sequence, and Design Page.
2. **Remove upstream artefact injection** from post-Episode-Plan prompt assembly.
3. **Store partial artefacts** in workflow step `runStepOutput` captures without compose/repair mutation.
4. **Implement deterministic page assembly** (`lib/page-vnext-assemble.js`) merging captures by stage ownership.
5. **Integrate assembly with render path** so assembled pages produce valid HTML.
6. **Preserve legacy workflows** where `isPageEnrichmentV2WorkflowEnabled` / partial mode is off.

## Secondary goals

7. Update UI help text for step output paste workflow.
8. Export assembly and validation helpers on `__PRISM_TEST_API`.
9. Document partial artefact envelopes in ADR and ownership model.

## Non-goals

- Instructional-budget experimentation (57A reference only)
- Runtime LLM inspection or repair
- API-based artefact transfer
- Assessment stage implementation (assembly stubs only)
- `finalise_page` step implementation

## Alignment with product intent

PRISM remains a **prompt-only pipeline**: LLMs generate content; artefacts transport owned slices; code assembles and renders. Validation is human review after workflow execution, supplemented by deterministic structural checks.

# Open Questions — Sprint 56F

## Architecture

- [ ] Exact moment page artefact is first created (Episode Plan only vs earlier profile step)?
- [ ] Is `finalise_page` a workflow step or deterministic post-step utility?
- [ ] Should enrichment be LLM-guided write into page JSON or deterministic field merge after LLM generation?

## Schema

- [ ] Final top-level page shape: extend 56E schema or simplify for enrichment?
- [ ] Per-stage `assembly_state.enriched_by` tracking format?
- [ ] How are learner-journey scaffold fields nested in activities?

## GAM

- [ ] GAM enriches page in-place vs emits enrichable JSON fragment consumed by binding?
- [ ] Minimum material record fields (`material_id`, `material_type`, `title`, `body`) — confirm?
- [ ] How are tables represented in `body` (markdown string vs structured)?

## Workflow bindings

- [ ] Which steps pass `page` artefact vs separate outputs today?
- [ ] Impact on `app.js` step artefact bindings?
- [ ] Episode Plan output contract change scope?

## Design Page retirement

- [ ] Hard remove step vs bypass with feature flag during dev?
- [ ] Deprecation timeline for compose contracts?

## Validation

- [ ] HR Essentials fixture commit strategy?
- [ ] Per-enrichment-boundary audit snapshots required?

## ID policy

- [ ] Confirm: any ID mismatch is hard failure with no mapping?
- [ ] Legacy LO-prefixed IDs in some workflows — source of truth for required IDs?

## Renderer

- [ ] Renderer changes needed for progressive page shape?
- [ ] Section model unchanged from 56E canonical sections?
